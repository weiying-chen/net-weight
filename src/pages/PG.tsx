import { useState } from 'react';
import { Col } from '@/components/Col';
import { FlexFields, FlexField } from '@/components/FlexFields';

export function PG() {
  const [fields, setFields] = useState<FlexField[]>([
    {
      key: '1',
      inputs: [
        { label: 'Type', value: '', type: 'string' },
        { label: 'Method', value: '', type: 'string' },
        { label: 'Value', value: '', type: 'string' },
      ],
    },
    {
      key: '2',
      inputs: [
        { label: 'Type', value: '', type: 'string' },
        { label: 'Method', value: '', type: 'string' },
        { label: 'Value', value: '', type: 'string' },
      ],
    },
    {
      key: '3',
      inputs: [
        { label: 'Type', value: '', type: 'string' },
        { label: 'Method', value: '', type: 'string' },
        { label: 'Value', value: '', type: 'string' },
      ],
    },
  ]);

  return (
    <Col>
      <FlexFields label="Attributes" fields={fields} onChange={setFields} />
    </Col>
  );
}
