import { Select } from '@/components/Select';

export function PG() {
  const options = [
    { label: 'Argentina', value: '1', tooltip: 'Country in South America' },
    { label: 'Australia', value: '2', tooltip: 'Country in Oceania' },
    { label: 'Austria', value: '3', tooltip: 'Country in Central Europe' },
    { label: 'Algeria', value: '4', tooltip: 'Country in North Africa' },
    {
      label: 'Afghanistan',
      value: '5',
      tooltip: 'Country in South-Central Asia',
    },
    { label: 'Belgium', value: '6', tooltip: 'Country in Western Europe' },
    { label: 'Brazil', value: '7', tooltip: 'Country in South America' },
    { label: 'Bulgaria', value: '8', tooltip: 'Country in Southeast Europe' },
    { label: 'Bahamas', value: '9', tooltip: 'Country in the Caribbean' },
    { label: 'Bahrain', value: '10', tooltip: 'Country in the Middle East' },
  ];

  return (
    <div className="p-4">
      <Select
        label="Select an option"
        value="1"
        options={options}
        hasSearch
        onChange={(val) => console.log('Selected:', val)}
      />
    </div>
  );
}
