import { useEffect, useState } from 'react';
import { Input } from '@/components/Input';

type TableCellProps = {
  value: string | React.ReactNode; // Can be a string or any React node
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onCancel: () => void;
  // onBlur: () => void; // Add onBlur here
};

export function TableCell({
  value,
  isEditing,
  onChange,
  onCancel,
}: TableCellProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (typeof value === 'string') {
      setInputValue(value);
    }
  }, [value]);

  if (isEditing && typeof value === 'string') {
    return (
      <Input
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => onChange(inputValue)} // blur commits
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChange(inputValue); // Enter commits
          } else if (e.key === 'Escape') {
            onCancel(); // Escape cancels
          }
        }}
        inputClassName="h-auto w-full border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    );
  }

  return <span className="block w-full select-none truncate">{value}</span>;
}
