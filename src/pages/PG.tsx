import { useState } from 'react';
import { Col } from '@/components/Col';
import { Select } from '@/components/Select';

export function PG() {
  const [traits, setTraits] = useState<string[]>([]);

  const traitOptions = [
    { value: 'Logical thinker', label: 'Logical thinker' },
    { value: 'Creative/Imaginative', label: 'Creative/Imaginative' },
    { value: 'Problem-solver', label: 'Problem-solver' },
    { value: 'Quick learner', label: 'Quick learner' },
    { value: 'Analytical', label: 'Analytical' },
    { value: 'Intuitive', label: 'Intuitive' },
  ];

  return (
    <Col className="w-full gap-6 p-6">
      <Select
        multiple
        hasSearch
        allowCustomOptions
        label="Intelligence traits"
        placeholder="Type or select traits"
        value={traits}
        onChange={setTraits}
        options={traitOptions}
      />
    </Col>
  );
}
