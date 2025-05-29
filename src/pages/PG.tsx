import { useState } from 'react';
import { Col } from '@/components/Col';
import { TagSelect } from '@/components/TagSelect';
import type { SelectOption } from '@/components/Select';

// Example options for TagSelect
const exampleOptions: SelectOption<string>[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];

export function PG() {
  const [selectedTags, setSelectedTags] = useState<SelectOption<string>[]>([]);

  return (
    <Col className="w-full">
      <TagSelect
        options={exampleOptions}
        value={selectedTags}
        onChange={setSelectedTags}
        placeholder="Search fruits..."
      />
    </Col>
  );
}
