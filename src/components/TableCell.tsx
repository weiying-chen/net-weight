import { useEffect, useState } from 'react';
import { Input } from '@/components/Input';

type TableCellProps = {
  value: string;
  isEditing: boolean;
  onDoubleClick: () => void;
  onChange: (newValue: string) => void;
  onCancel: () => void;
};

export function TableCell({
  value,
  isEditing,
  onDoubleClick,
  onChange,
  onCancel,
}: TableCellProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => onChange(inputValue)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChange(inputValue);
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        inputClassName="h-auto w-full border-none bg-transparent px-0 py-0 shadow-none focus: focus-visible:ring-0 focus-visible:ring-offset-0 "
      />
    );
  }

  return (
    <span
      className="block w-full cursor-text truncate"
      onDoubleClick={onDoubleClick}
    >
      {value}
    </span>
  );
}
