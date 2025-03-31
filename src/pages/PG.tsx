import { useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField } from '@/components/FlexFields';

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

      // Restrict Methods based on Type
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

      // Update Value options based on Method
      valueInput.options =
        methodInput.value === 'Datasheet'
          ? datasheetValueOptions
          : networkValueOptions;

      // Reset Value if not valid in the new options
      if (
        !valueInput.options.find((option) => option.value === valueInput.value)
      ) {
        valueInput.value = '';
      }

      // Remove Username & Password fields first
      field.inputs = field.inputs.filter(
        (i) => i.label !== 'Username' && i.label !== 'Password',
      );

      // If "Username, Password" is selected, add Username & Password inputs
      if (valueInput.value === 'Username, Password') {
        field.inputs.push({ label: 'Username', value: '', type: 'text' });
        field.inputs.push({ label: 'Password', value: '', type: 'text' });
      }

      return { ...field, inputs: [...field.inputs] };
    });

    setFields(newFields);
  };

  const fieldTemplate = createField(fields);

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
