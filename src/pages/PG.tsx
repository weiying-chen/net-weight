import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField, FlexFieldInput } from '@/components/FlexFields';

const extraFieldsMapping: Record<string, FlexFieldInput[]> = {
  'Username, Password': [
    { label: 'Username', value: '', type: 'text' },
    { label: 'Password', value: '', type: 'text' },
  ],
  Dimensions: [
    { label: 'Width', value: 0, type: 'number', unit: 'cm' },
    { label: 'Depth', value: 0, type: 'number', unit: 'cm' },
    { label: 'Height', value: 0, type: 'number', unit: 'cm' },
  ],
  Price: [
    { label: 'Amount', value: 0, type: 'number', unit: 'USD' },
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

function updateExtraFields(field: FlexField, selectedItem: string): FlexField {
  // Get all extra field labels from the mapping
  const allExtraLabels = Object.values(extraFieldsMapping)
    .flat()
    .map((input) => input.label);

  // Remove any extra fields and any generic "Value" field
  const filteredInputs = field.inputs.filter(
    (input) => !allExtraLabels.includes(input.label) && input.label !== 'Value',
  );

  if (extraFieldsMapping[selectedItem]) {
    // Merge existing values for extra inputs, if they exist
    const extraInputs = extraFieldsMapping[selectedItem].map((extra) => {
      const existing = field.inputs.find(
        (input) => input.label === extra.label,
      );
      return existing ? { ...extra, value: existing.value } : { ...extra };
    });
    return {
      ...field,
      inputs: [...filteredInputs, ...extraInputs],
    };
  } else {
    // Handle the generic "Value" field by preserving its value if it exists.
    let genericInput = field.inputs.find((input) => input.label === 'Value');
    if (!genericInput) {
      genericInput = { label: 'Value', value: '', type: 'text' };
    }
    return {
      ...field,
      inputs: [...filteredInputs, genericInput],
    };
  }
}

export function PG() {
  const datasheetItemOptions = [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial Number', label: 'Serial Number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change Date', label: 'Change Date' },
    { value: 'Price', label: 'Price' },
  ];

  const networkItemOptions = [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username, Password', label: 'Username, Password' },
    { value: 'IP Range,IP Address', label: 'IP Range,IP Address' },
    { value: 'Secret Key', label: 'Secret Key' },
  ];

  const getNextKey = (currentFields: FlexField[]) => {
    const maxKey = currentFields.reduce((max, field) => {
      const num = parseInt(field.key, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxKey + 1);
  };

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
        label: 'Item',
        value: '',
        type: 'select',
        options: datasheetItemOptions,
      },
    ],
  });

  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  const handleFieldsChange = (updatedFields: FlexField[]) => {
    const newFields = updatedFields.map((field) => {
      const typeInput = field.inputs.find((i) => i.label === 'Type');
      const methodInput = field.inputs.find((i) => i.label === 'Method');
      const itemInput = field.inputs.find((i) => i.label === 'Item');

      if (!typeInput || !methodInput || !itemInput) return field;

      // Adjust method options based on type
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

      // Change item options based on method
      itemInput.options =
        methodInput.value === 'Datasheet'
          ? datasheetItemOptions
          : networkItemOptions;

      // Reset item value if it doesn't exist in the current options
      if (
        !itemInput.options.find((option) => option.value === itemInput.value)
      ) {
        itemInput.value = '';
      }

      // Update extra fields based on the selected item
      let updatedField = updateExtraFields(field, String(itemInput.value));

      // Handle the Price unit update if the selected item is Price
      if (String(itemInput.value) === 'Price') {
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
