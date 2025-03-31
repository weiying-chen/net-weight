import { useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField } from '@/components/FlexFields';

export function PG() {
  const [fields, setFields] = useState<FlexField[]>([
    {
      key: '1',
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
          options: [
            { value: 'Datasheet', label: 'Datasheet' },
            { value: 'Router', label: 'Router' },
          ],
        },
        { label: 'Value', value: '', type: 'text' },
      ],
    },
  ]);

  // Function to generate the next key
  const getNextKey = () => {
    const maxKey = fields.reduce((max, field) => {
      const num = parseInt(field.key, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxKey + 1);
  };

  // Default new field structure with a dynamically assigned key
  const fieldTemplate = (): FlexField => ({
    key: getNextKey(),
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
        options: [
          { value: 'Datasheet', label: 'Datasheet' },
          { value: 'Router', label: 'Router' },
        ],
      },
      { label: 'Value', value: '', type: 'text' },
    ],
  });

  return (
    <Col>
      <FlexFields
        label="Attributes"
        fields={fields}
        fieldTemplate={fieldTemplate()} // Call the function to generate a new field
        onChange={setFields}
      />
    </Col>
  );
}
