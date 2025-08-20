import { useEffect, useState } from 'react';
import { Input } from '@/components/Input';
import { CellValue } from '@/components/Table';

type TableCellProps<D = Record<string, unknown>, V = CellValue> = {
  value: V | React.ReactNode;
  isEditing: boolean;
  row: D;
  editor?: (
    inputValue: V,
    row: D,
    setValue: (val: V) => void,
    commit: () => void,
    onCancel: () => void,
  ) => React.ReactNode;
  onChange: (newValue: V) => void;
  onCancel: () => void;
};

export function TableCell<D = Record<string, unknown>, V = CellValue>({
  value,
  isEditing,
  row,
  editor,
  onChange,
  onCancel,
}: TableCellProps<D, V>) {
  const [inputValue, setInputValue] = useState<V>(value as V);

  useEffect(() => {
    setInputValue(value as V);
  }, [value]);

  if (isEditing && editor) {
    return editor(
      inputValue,
      row,
      (val: V) => setInputValue(val),
      () => onChange(inputValue),
      onCancel,
    );
  }

  if (isEditing && (typeof value === 'string' || typeof value === 'number')) {
    return (
      <Input
        type={typeof value === 'number' ? 'number' : 'text'}
        autoFocus
        value={String(inputValue ?? '')}
        onChange={(e) => setInputValue(e.target.value as V)}
        onBlur={() => {
          const parsed =
            typeof value === 'number'
              ? (Number(inputValue) as V)
              : (inputValue as V);
          onChange(parsed);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const parsed =
              typeof value === 'number'
                ? (Number(inputValue) as V)
                : (inputValue as V);
            onChange(parsed);
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        inputClassName="absolute py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    );
  }

  return (
    <span className="block w-full select-none truncate border border-transparent px-3 py-2">
      {String(value)}
    </span>
  );
}
