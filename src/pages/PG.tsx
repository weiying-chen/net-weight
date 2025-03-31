import { useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField } from '@/components/FlexFields';

export function PG() {
  // 1) Mappings for Value options
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

  // 2) Function to generate the next key
  const getNextKey = (currentFields: FlexField[]) => {
    const maxKey = currentFields.reduce((max, field) => {
      const num = parseInt(field.key, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxKey + 1);
  };

  // 3) Helper function to create a new field
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
        // Now let's have "Datasheet" and "Network" as method options
        label: 'Method',
        value: 'Datasheet', // Default to "Datasheet"
        type: 'select',
        options: [
          { value: 'Datasheet', label: 'Datasheet' },
          { value: 'Network', label: 'Network' },
        ],
      },
      {
        label: 'Value',
        value: '',
        type: 'select',
        // By default, if Method is "Datasheet", we show datasheetValueOptions
        options: datasheetValueOptions,
      },
    ],
  });

  // 4) Initialize state with a single field
  const [fields, setFields] = useState<FlexField[]>([createField([])]);

  // 5) We'll dynamically update "Value" options whenever "Method" changes
  const handleFieldsChange = (updatedFields: FlexField[]) => {
    const newFields = updatedFields.map((field) => {
      const methodInput = field.inputs.find((i) => i.label === 'Method');
      const valueInput = field.inputs.find((i) => i.label === 'Value');
      if (!methodInput || !valueInput) return field; // Safety check

      // Based on the current Method, set the Value field's options
      if (methodInput.value === 'Datasheet') {
        valueInput.options = datasheetValueOptions;
      } else if (methodInput.value === 'Network') {
        valueInput.options = networkValueOptions;
      } else {
        // Fallback, if needed
        valueInput.options = [];
      }

      // Return the updated field
      return {
        ...field,
        inputs: [...field.inputs], // ensure we have a new array
      };
    });

    setFields(newFields);
  };

  // 6) Field template for new fields
  const fieldTemplate = createField(fields);

  return (
    <Col>
      <FlexFields
        label="Attributes"
        fields={fields}
        fieldTemplate={fieldTemplate}
        onChange={handleFieldsChange} // Use the dynamic onChange
      />
    </Col>
  );
}
