import { useState, useRef, KeyboardEvent } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type TagInputProps = {
  label: string;
  tags: string[];
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (tags: string[]) => void;
};

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  placeholder,
  error,
  className,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Col>
      <label className="text-sm font-semibold">{label}</label>
      <div
        className={cn(
          'flex w-full flex-wrap items-center gap-2 rounded border border-border bg-background px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          { 'border-danger': error },
          className,
        )}
        tabIndex={0}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm text-white"
          >
            <span>{tag}</span>
            <button
              type="button"
              className="ml-1 cursor-pointer text-xs text-white"
              onClick={() => handleRemoveTag(tag)}
            >
              x
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter or Tab'}
          className="flex-grow bg-background outline-none"
        />
      </div>
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </Col>
  );
};
