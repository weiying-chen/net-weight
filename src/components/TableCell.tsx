import { useEffect, useState } from "react";
import { Input } from "@/components/Input";

type TableCellProps = {
  value: string | React.ReactNode; // Can be a string or any React node
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onCancel: () => void;
  onBlur: () => void; // Add onBlur here
};

export function TableCell({
  value,
  isEditing,
  onChange,
  onCancel,
  onBlur,
}: TableCellProps) {
  const [inputValue, setInputValue] = useState<string>("");

  // Only set input value if the value is a string
  useEffect(() => {
    if (typeof value === "string") {
      setInputValue(value);
    }
  }, [value]);

  // If we're in edit mode and value is a string, show input
  if (isEditing && typeof value === "string") {
    return (
      <Input
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {
          onChange(inputValue); // Trigger onChange when input loses focus
          onBlur(); // Optionally trigger onBlur as well if needed
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(inputValue); // Trigger onChange when pressing Enter
            onBlur(); // Trigger onBlur when pressing Enter to remove focus
          } else if (e.key === "Escape") {
            onCancel(); // Trigger onCancel when pressing Escape
            onBlur(); // Trigger onBlur when pressing Escape
          }
        }}
        inputClassName="h-auto w-full border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 "
      />
    );
  }

  // If it's not in edit mode or the value is not a string, just render it
  return <span className="block w-full select-none truncate">{value}</span>;
}
