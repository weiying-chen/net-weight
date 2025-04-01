import { useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField, FlexFieldInput } from '@/components/FlexFields';

// Unified Data Sheet item options for different types
const datasheetOptions: Record<string, { value: string; label: string }[]> = {
  Rack: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial Number', label: 'Serial Number' },
    { value: 'Size', label: 'Size' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change Date', label: 'Change Date' },
    { value: 'Price', label: 'Price' },
  ],
  Switch: [
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
  ],
  Router: [
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
  ],
  Network: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username, Password', label: 'Username, Password' },
    { value: 'IP Range,IP Address', label: 'IP Range,IP Address' },
    { value: 'Secret Key', label: 'Secret Key' },
    { value: 'Public Key', label: 'Public Key' },
  ],
};

// Extra fields mapping
const extraFieldsMapping: Record<string, FlexFieldInput[]> = {
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

const getItemOptions = (type: string, method: string) => {
  return method === 'Datasheet'
    ? datasheetOptions[type] || datasheetOptions.Rack
    : datasheetOptions.Network;
};

function updateExtraFields(field: FlexField, selectedItem: string): FlexField {
  const mapping = extraFieldsMapping;
  const extraLabels = Object.values(mapping)
    .flat()
    .map((input) => input.label)
    .concat('Value');
  const staticInputs = field.inputs.filter(
    (input) => !extraLabels.includes(input.label),
  );
  if (!selectedItem) return { ...field, inputs: staticInputs };
  if (mapping[selectedItem]) {
    const extraInputs = mapping[selectedItem].map((extra) => {
      const existing = field.inputs.find(
        (input) => input.label === extra.label,
      );
      return existing ? { ...extra, value: existing.value } : { ...extra };
    });
    return { ...field, inputs: [...staticInputs, ...extraInputs] };
  }
  const genericInput = field.inputs.find(
    (input) => input.label === 'Value',
  ) || { label: 'Value', value: '', type: 'text' };
  return { ...field, inputs: [...staticInputs, genericInput] };
}

export function PG() {
  const getNextKey = (currentFields: FlexField[]) => {
    return String(
      Math.max(
        0,
        ...currentFields.map((field) => parseInt(field.key, 10) || 0),
      ) + 1,
    );
  };

  const createField = (currentFields: FlexField[]): FlexField => ({
    key: getNextKey(currentFields),
    inputs: [
      {
        label: 'Type',
        value: 'Rack',
        type: 'select',
        options: Object.keys(datasheetOptions).map((type) => ({
          value: type,
          label: type,
        })),
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
        options: datasheetOptions.Rack,
      },
    ],
  });

  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  const handleFieldsChange = (updatedFields: FlexField[]) => {
    setFields(
      updatedFields.map((field) => {
        const typeInput = field.inputs.find((i) => i.label === 'Type');
        const methodInput = field.inputs.find((i) => i.label === 'Method');
        const itemInput = field.inputs.find((i) => i.label === 'Item');

        if (!typeInput || !methodInput || !itemInput) return field;

        // Convert values to string to ensure type safety
        const typeValue = String(typeInput.value);
        const methodValue = String(methodInput.value);
        let itemValue = String(itemInput.value);

        // Get valid item options based on the selected Type and Method
        itemInput.options = getItemOptions(typeValue, methodValue);

        // Reset item value if it is not in the updated options
        if (!itemInput.options.some((opt) => opt.value === itemValue)) {
          itemValue = '';
          itemInput.value = itemValue;
        }

        return updateExtraFields(field, itemValue);
      }),
    );
  };

  return (
    <Col>
      <FlexFields
        label="Attributes"
        fields={fields}
        fieldTemplate={createField(fields)}
        onChange={handleFieldsChange}
      />
    </Col>
  );
}
