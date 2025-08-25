import { ReactNode, useEffect, useState } from 'react';
import { Input } from '@/components/Input';
import { CellValue } from '@/components/Table';

export type CellRenderValue = ReactNode;

type TableCellProps<D = Record<string, unknown>> = {
  value: CellRenderValue;
  isEditing: boolean;
  row: D;
  editor?: (
    inputValue: CellValue,
    row: D,
    setValue: (val: CellValue) => void,
    commit: () => void,
    onCancel: () => void,
  ) => React.ReactNode;
  onChange: (newValue: CellValue) => void;
  onCancel: () => void;
};

export function TableCell<D = Record<string, unknown>>({
  value,
  isEditing,
  row,
  editor,
  onChange,
  onCancel,
}: TableCellProps<D>) {
  // local state tracks raw value
  const [inputValue, setInputValue] = useState<CellValue>(
    typeof value === 'string' || typeof value === 'number' ? value : null,
  );

  useEffect(() => {
    // keep in sync when value changes
    if (typeof value === 'string' || typeof value === 'number') {
      setInputValue(value);
    } else {
      setInputValue(null);
    }
  }, [value]);

  // custom editor case
  if (isEditing && editor) {
    return editor(
      inputValue,
      row,
      (val: CellValue) => setInputValue(val),
      () => onChange(inputValue),
      onCancel,
    );
  }

  // default string/number inline editor
  if (
    isEditing &&
    (typeof inputValue === 'string' ||
      typeof inputValue === 'number' ||
      inputValue === null)
  ) {
    const inputType = typeof inputValue === 'number' ? 'number' : 'text';

    return (
      <Input
        type={inputType}
        autoFocus
        value={inputValue === null ? '' : String(inputValue)}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(
            inputType === 'number'
              ? val === ''
                ? null
                : Number(val)
              : val === ''
                ? null
                : val,
          );
        }}
        onBlur={() => onChange(inputValue)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChange(inputValue);
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        inputClassName="absolute py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    );
  }

  // default display mode
  return (
    <span className="block w-full select-none truncate border border-transparent px-3 py-2">
      {value}
    </span>
  );
}
