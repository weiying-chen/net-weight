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
    {
      key: '2',
      inputs: [
        {
          label: 'Type',
          value: 'Switch',
          type: 'select',
          options: [
            { value: 'Rack', label: 'Rack' },
            { value: 'Switch', label: 'Switch' },
            { value: 'Router', label: 'Router' },
          ],
        },
        {
          label: 'Method',
          value: 'Router',
          type: 'select',
          options: [
            { value: 'Datasheet', label: 'Datasheet' },
            { value: 'Router', label: 'Router' },
          ],
        },
        { label: 'Value', value: '', type: 'text' },
      ],
    },
    {
      key: '3',
      inputs: [
        {
          label: 'Type',
          value: 'Router',
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

  return (
    <Col>
      <FlexFields label="Attributes" fields={fields} onChange={setFields} />
    </Col>
  );
}
