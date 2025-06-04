import { useState } from 'react';
import { Col } from '@/components/Col';
import { Select } from '@/components/Select';
import type { SelectOption } from '@/components/Select';

const exampleOptions: SelectOption<string>[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
  { label: 'Indian Fig', value: 'indian-fig' },
  { label: 'Jackfruit', value: 'jackfruit' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Mango', value: 'mango' },
  { label: 'Nectarine', value: 'nectarine' },
  { label: 'Orange', value: 'orange' },
  { label: 'Papaya', value: 'papaya' },
  { label: 'Quince', value: 'quince' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Tomato', value: 'tomato' },
];

export function PG() {
  const [selectedFruit, setSelectedFruit] = useState<string>('');

  return (
    <Col className="w-full">
      <Select
        options={exampleOptions}
        value={selectedFruit}
        onChange={setSelectedFruit}
        placeholder="Select a fruit..."
        label="Favorite Fruit"
      />
    </Col>
  );
}
