import { useState, useRef, KeyboardEvent } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type TagInputProps = {
  label?: string;
  tags: string[];
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (tags: string[]) => void;
};

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags: initialTags,
  placeholder,
  error,
  className,
  onChange,
}) => {
  // Using `tags` directly prevents new tags from appearing in the UI when the form is dirty.
  const [tags, setTags] = useState<string[]>(initialTags); // Local state for tags
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial tags with local state when they change
  // useEffect(() => {
  //   setTags(initialTags);
  // }, [initialTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        onChange(updatedTags); // Sync with parent
        setInputValue('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onChange(updatedTags); // Sync with parent
  };

  return (
    <Col className={className}>
      {label && <label className="font-semibold">{label}</label>}
      <div
        tabIndex={0}
        className={cn(
          'flex w-full flex-wrap items-center gap-2 rounded border border-border bg-background px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          { 'border-danger': error },
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-sm text-white"
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
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
