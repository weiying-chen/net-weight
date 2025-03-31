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
  // Note: Since the default Type is "Rack", we initialize Method options with only "Datasheet"
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
        value: 'Datasheet', // Default to Datasheet
        type: 'select',
        options: [{ value: 'Datasheet', label: 'Datasheet' }],
      },
      {
        label: 'Value',
        value: '',
        type: 'select',
        // Default Value options based on the default Method ("Datasheet")
        options: datasheetValueOptions,
      },
    ],
  });

  // Initialize the state with a single field
  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  // Update Method and Value options based on the selected Type and Method
  const handleFieldsChange = (updatedFields: FlexField[]) => {
    const newFields = updatedFields.map((field) => {
      // Find the relevant inputs
      const typeInput = field.inputs.find((i) => i.label === 'Type');
      const methodInput = field.inputs.find((i) => i.label === 'Method');
      const valueInput = field.inputs.find((i) => i.label === 'Value');
      if (!typeInput || !methodInput || !valueInput) return field;

      // If Type is "Rack", only allow "Datasheet" as a Method.
      if (typeInput.value === 'Rack') {
        methodInput.options = [{ value: 'Datasheet', label: 'Datasheet' }];
        // Force the value to "Datasheet" if it's not already set
        if (methodInput.value !== 'Datasheet') {
          methodInput.value = 'Datasheet';
        }
      } else {
        // For other Types, allow both Datasheet and Network
        methodInput.options = [
          { value: 'Datasheet', label: 'Datasheet' },
          { value: 'Network', label: 'Network' },
        ];
      }

      // Update Value options based on the selected Method
      if (methodInput.value === 'Datasheet') {
        valueInput.options = datasheetValueOptions;
      } else if (methodInput.value === 'Network') {
        valueInput.options = networkValueOptions;
      } else {
        valueInput.options = [];
      }

      return { ...field, inputs: [...field.inputs] };
    });

    setFields(newFields);
  };

  // Field template for new fields (using the current state to generate the next key)
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
