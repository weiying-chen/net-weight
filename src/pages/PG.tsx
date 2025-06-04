// PG.tsx
import { useState } from 'react';
import { Col } from '@/components/Col';
import { Select } from '@/components/Select';
import { SelectOption } from '@/components/SelectDropdown';

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
  // 1. Single-select, no search
  const [singleNoSearch, setSingleNoSearch] = useState<string>('');

  // 2. Single-select, with search
  const [singleWithSearch, setSingleWithSearch] = useState<string>('');

  // 3. Multi-select, no search
  const [multiNoSearch, setMultiNoSearch] = useState<string[]>([]);

  // 4. Multi-select, with search
  const [multiWithSearch, setMultiWithSearch] = useState<string[]>([]);

  return (
    <Col className="w-full gap-6">
      {/* 1. Single-select, no search */}
      <div>
        <label className="mb-1 block text-sm font-semibold">
          1. Single-select, no search
        </label>
        <Select
          options={exampleOptions}
          value={singleNoSearch}
          onChange={setSingleNoSearch}
          placeholder="Pick one fruit…"
          // (no `hasSearch`, no `multiple`)
        />
      </div>

      {/* 2. Single-select, with search */}
      <div>
        <label className="mb-1 block text-sm font-semibold">
          2. Single-select, with search
        </label>
        <Select
          options={exampleOptions}
          value={singleWithSearch}
          onChange={setSingleWithSearch}
          placeholder="Pick one fruit…"
          hasSearch
          // `multiple` omitted → single mode
        />
      </div>

      {/* 3. Multi-select, no search */}
      <div>
        <label className="mb-1 block text-sm font-semibold">
          3. Multi-select, no search
        </label>
        <Select
          options={exampleOptions}
          value={multiNoSearch}
          onChange={setMultiNoSearch}
          placeholder="Pick one or more fruits…"
          multiple
          // `hasSearch` omitted → no search
        />
      </div>

      {/* 4. Multi-select, with search */}
      <div>
        <label className="mb-1 block text-sm font-semibold">
          4. Multi-select, with search
        </label>
        <Select
          options={exampleOptions}
          value={multiWithSearch}
          onChange={setMultiWithSearch}
          placeholder="Pick one or more fruits…"
          multiple
          hasSearch
        />
      </div>
    </Col>
  );
}
