import { useState, useEffect } from 'react';
import { Col } from '@/components/Col';
import { CustomFields } from '@/components/CustomFields';

export type ValueType = 'string' | 'number' | 'boolean';

export type CustomField = {
  key: string;
  value: string | number | boolean;
  type: ValueType;
};

export function PG() {
  const [fields, setFields] = useState<CustomField[]>([
    { key: 'Name', value: 'Example', type: 'string' },
    { key: 'Age', value: 30, type: 'number' },
    { key: 'Active', value: true, type: 'boolean' },
  ]);

  // Log fields whenever it changes
  useEffect(() => {
    console.log('Fields updated:', fields);
  }, [fields]); // Dependency array ensures it runs when `fields` changes

  return (
    <Col>
      <CustomFields
        addFieldLabel="Add Attribute"
        nameLabel="Name"
        typeLabel="Type"
        valueLabel="Value"
        fields={fields}
        onChange={setFields}
      />
    </Col>
  );
}
