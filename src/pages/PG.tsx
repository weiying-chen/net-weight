import { Select } from '@/components/Select';

export function PG() {
  const options = [
    { label: 'aa', value: '1', tooltip: 'This is the first option' },
    { label: 'ab', value: '3', tooltip: 'This is the third option' },
    { label: 'bb', value: '2', tooltip: 'This is the second option' },
  ];

  return (
    <div className="p-4">
      <Select
        label="Select an option"
        value="1"
        options={options}
        searchable
        onChange={(val) => console.log('Selected:', val)}
      />
    </div>
  );
}
