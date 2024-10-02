import { useState, useRef, KeyboardEvent } from 'react';
import { Col } from '@/components/Col';
import { Tag } from '@/components/Tag';
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
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateTags = (updatedTags: string[]) => {
    setTags(updatedTags);
    onChange(updatedTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        updateTags([...tags, newTag]);
        setInputValue('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    updateTags(updatedTags);
  };

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div
        tabIndex={0}
        className={cn(
          'flex w-full flex-wrap items-center gap-2 rounded border border-border bg-background px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          { 'border-danger': error },
        )}
      >
        {tags.map((tag) => (
          <Tag key={tag} onClick={() => handleRemoveTag(tag)}>
            {tag}
          </Tag>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter or Tab'}
          className="flex-grow bg-background text-sm outline-none"
        />
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
