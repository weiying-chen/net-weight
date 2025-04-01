import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField, FlexFieldInput } from '@/components/FlexFields';

// Separate Data Sheet item options for Rack and Switch.
const rackDatasheetItemOptions = [
  { value: 'Manufacturers', label: 'Manufacturers' },
  { value: 'Serial Number', label: 'Serial Number' },
  { value: 'Size', label: 'Size' },
  { value: 'Dimensions', label: 'Dimensions' },
  { value: 'Weight', label: 'Weight' },
  { value: 'Acquisition date', label: 'Acquisition date' },
  { value: 'Change Date', label: 'Change Date' },
  { value: 'Price', label: 'Price' },
];

const switchDatasheetItemOptions = [
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

// Global extra fields mapping: keys should match the Data Sheet item values
const extraFieldsMappingByType: Record<string, FlexFieldInput[]> = {
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
  Size: [{ label: 'Size', value: 0, type: 'number', unit: 'U' }],
  Weight: [{ label: 'Weight', value: 0, type: 'number', unit: 'kg' }],
  Unit: [{ label: 'Unit', value: 'U', type: 'text' }],
  'MAC address': [{ label: 'MAC address', value: '', type: 'text' }],
};

// Update extra fields based on the selected Item.
// If no Item is selected, remove any extra fields.
function updateExtraFields(field: FlexField, selectedItem: string): FlexField {
  // Use the global mapping.
  const mapping = extraFieldsMappingByType;
  // Build a list of all extra field labels (plus a generic "Value").
  const extraLabels = Object.values(mapping)
    .flat()
    .map((input) => input.label)
    .concat('Value');

  // Keep static (non‑extra) inputs.
  const staticInputs = field.inputs.filter(
    (input) => !extraLabels.includes(input.label),
  );

  // If no Item is selected, just return static inputs.
  if (!selectedItem) {
    return { ...field, inputs: staticInputs };
  }

  if (mapping[selectedItem]) {
    // If the selected Item has special mapped fields, merge their values.
    const extraInputs = mapping[selectedItem].map((extra) => {
      const existing = field.inputs.find(
        (input) => input.label === extra.label,
      );
      return existing ? { ...extra, value: existing.value } : { ...extra };
    });
    return {
      ...field,
      inputs: [...staticInputs, ...extraInputs],
    };
  } else {
    // For unmapped items, always add a generic "Value" field.
    const genericInput = field.inputs.find(
      (input) => input.label === 'Value',
    ) || { label: 'Value', value: '', type: 'text' };
    return { ...field, inputs: [...staticInputs, genericInput] };
  }
}

export function PG() {
  const getNextKey = (currentFields: FlexField[]) => {
    const maxKey = currentFields.reduce((max, field) => {
      const num = parseInt(field.key, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxKey + 1);
  };

  // Create a field with default options. Default type is "Rack".
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
        // Default to Rack options
        options: rackDatasheetItemOptions,
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

      // Adjust method options based on type.
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

      // Set Data Sheet item options based on the Type and Method.
      if (methodInput.value === 'Datasheet') {
        itemInput.options =
          typeInput.value === 'Rack'
            ? rackDatasheetItemOptions
            : typeInput.value === 'Switch'
              ? switchDatasheetItemOptions
              : rackDatasheetItemOptions; // fallback to Rack options
      } else {
        itemInput.options = networkItemOptions;
      }

      // Reset the Item value if it's not in the current options.
      if (
        !itemInput.options.find((option) => option.value === itemInput.value)
      ) {
        itemInput.value = '';
      }

      // Update extra fields based on the selected Item.
      let updatedField = updateExtraFields(field, itemInput.value.toString());

      // Handle the Price unit update if the selected Item is Price.
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
