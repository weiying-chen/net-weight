import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField, FlexFieldInput } from '@/components/FlexFields';

// Configuration for extra fields based on Value selection,
// now with unit properties added.
const extraFieldsMapping: Record<string, FlexFieldInput[]> = {
  'Username, Password': [
    { label: 'Username', value: '', type: 'text' },
    { label: 'Password', value: '', type: 'text' },
  ],
  'Dimensions (W x D x H)': [
    { label: 'Width', value: '', type: 'number', unit: 'cm' },
    { label: 'Depth', value: '', type: 'number', unit: 'cm' },
    { label: 'Height', value: '', type: 'number', unit: 'cm' },
  ],
  Price: [
    { label: 'Amount', value: '', type: 'number', unit: 'USD' },
    {
      label: 'Currency',
      value: 'USD',
      type: 'select',
      options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
      ],
    },
  ],
};

function updateExtraFields(field: FlexField, selectedValue: string): FlexField {
  // Get all possible extra field labels from the mapping
  const allExtraLabels = Object.values(extraFieldsMapping)
    .flat()
    .map((input) => input.label);

  // If the current value doesn't require extra fields,
  // remove any extra fields from the inputs.
  if (!extraFieldsMapping[selectedValue]) {
    return {
      ...field,
      inputs: field.inputs.filter(
        (input) => !allExtraLabels.includes(input.label),
      ),
    };
  }

  // Otherwise, get the required extra fields for this value.
  const requiredExtraFields = extraFieldsMapping[selectedValue];
  const requiredLabels = requiredExtraFields.map((input) => input.label);

  // Preserve non-extra fields and extra fields that belong to the active selection.
  let preservedInputs = field.inputs.filter((input) => {
    // If input is not an extra field at all, keep it.
    if (!allExtraLabels.includes(input.label)) return true;
    // Otherwise, keep it only if it belongs to the required set.
    return requiredLabels.includes(input.label);
  });

  // For each required extra field, if it's not already present, add it.
  requiredExtraFields.forEach((required) => {
    if (!preservedInputs.find((input) => input.label === required.label)) {
      preservedInputs.push({ ...required });
    }
  });

  return { ...field, inputs: preservedInputs };
}

export function PG() {
  // Mappings for Value options
  const datasheetValueOptions = [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial Number', label: 'Serial Number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions (W x D x H)', label: 'Dimensions (W x D x H)' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change Date', label: 'Change Date' },
    { value: 'Price', label: 'Price' },
  ];

  const networkValueOptions = [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username, Password', label: 'Username, Password' },
    { value: 'IP Range,IP Address', label: 'IP Range,IP Address' },
    { value: 'Secret Key', label: 'Secret Key' },
  ];

  // Function to generate the next key
  const getNextKey = (currentFields: FlexField[]) => {
    const maxKey = currentFields.reduce((max, field) => {
      const num = parseInt(field.key, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxKey + 1);
  };

  // Helper function to create a new field
  const createField = (currentFields: FlexField[]): FlexField => ({
    key: getNextKey(currentFields),
    inputs: [
      {
        label: 'Type',
        value: 'Rack',
        type: 'select',
        options: [
          { value: 'Rack', label: 'Rack' },
          { value: 'Switch', label: 'Switch' },
          { value: 'Router', label: 'Router' },
        ],
      },
      {
        label: 'Method',
        value: 'Datasheet',
        type: 'select',
        options: [{ value: 'Datasheet', label: 'Datasheet' }],
      },
      {
        label: 'Value',
        value: '',
        type: 'select',
        options: datasheetValueOptions,
      },
    ],
  });

  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  // Update Method and Value options based on the selected Type and Method
  const handleFieldsChange = (updatedFields: FlexField[]) => {
    const newFields = updatedFields.map((field) => {
      const typeInput = field.inputs.find((i) => i.label === 'Type');
      const methodInput = field.inputs.find((i) => i.label === 'Method');
      const valueInput = field.inputs.find((i) => i.label === 'Value');

      if (!typeInput || !methodInput || !valueInput) return field;

      // Restrict Methods based on Type.
      if (typeInput.value === 'Rack') {
        methodInput.options = [{ value: 'Datasheet', label: 'Datasheet' }];
        if (methodInput.value !== 'Datasheet') {
          methodInput.value = 'Datasheet';
        }
      } else {
        methodInput.options = [
          { value: 'Datasheet', label: 'Datasheet' },
          { value: 'Network', label: 'Network' },
        ];
      }

      // Update Value options based on Method.
      valueInput.options =
        methodInput.value === 'Datasheet'
          ? datasheetValueOptions
          : networkValueOptions;

      // Reset Value if not valid in the new options.
      if (
        !valueInput.options.find((option) => option.value === valueInput.value)
      ) {
        valueInput.value = '';
      }

      // Update extra fields based on the selected Value.
      const updatedField = updateExtraFields(field, String(valueInput.value));

      // --- NEW: If "Price" is selected, update the Amount field's unit based on Currency.
      if (String(valueInput.value) === 'Price') {
        const currencyInput = updatedField.inputs.find(
          (inp) => inp.label === 'Currency',
        );
        if (currencyInput) {
          const newCurrency = String(currencyInput.value);
          updatedField.inputs = updatedField.inputs.map((inp) =>
            inp.label === 'Amount' ? { ...inp, unit: newCurrency } : inp,
          );
        }
      }

      return { ...updatedField, inputs: [...updatedField.inputs] };
    });

    setFields(newFields);
  };

  const fieldTemplate = createField(fields);

  useEffect(() => {
    console.log('fields:', fields);
  }, [fields]);

  return (
    <Col>
      <FlexFields
        label="Attributes"
        fields={fields}
        fieldTemplate={fieldTemplate}
        onChange={handleFieldsChange}
      />
    </Col>
  );
}
