import { useEffect, useState } from 'react';
import { Input } from '@/components/Input';

type TableCellProps<D = any, V = any> = {
  value: V | React.ReactNode;
  isEditing: boolean;
  row: D;
  editor?: (
    inputValue: V,
    row: D,
    setValue: (val: V) => void, // update local state
    commit: () => void, // commit to parent
    onCancel: () => void,
  ) => React.ReactNode;
  onChange: (newValue: V) => void;
  onCancel: () => void;
};

export function TableCell<D, V = any>({
  value,
  isEditing,
  row,
  editor,
  onChange,
  onCancel,
}: TableCellProps<D, V>) {
  const [inputValue, setInputValue] = useState<V>(value as V);

  // Keep local input state in sync when value changes
  useEffect(() => {
    setInputValue(value as V);
  }, [value]);

  // 🔹 If a custom editor is provided, use it
  if (isEditing && editor) {
    return editor(
      inputValue,
      row,
      (val: V) => setInputValue(val), // keep the actual type
      () => onChange(inputValue), // commit current value
      onCancel,
    );
  }

  // 🔹 Default string/number editor
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
        // inputClassName="h-auto w-full border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        inputClassName="absolute py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    );
  }

  // 🔹 Default read-only rendering
  return (
    <span className="block w-full select-none truncate border border-transparent px-3 py-2">
      {String(value)}
    </span>
  );
}
