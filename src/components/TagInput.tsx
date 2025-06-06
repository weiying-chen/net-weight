import { useState, useRef, KeyboardEvent } from 'react';
import { Col } from '@/components/Col';
import { Tag } from '@/components/Tag';
import { PseudoInput } from '@/components/PseudoInput';

type TagInputProps = {
  label?: string;
  tags?: string[];
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (tags: string[]) => void;
};

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags: initialTags = [],
  placeholder,
  error,
  className,
  onChange,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateTags = (newTags: string[]) => {
    setTags(newTags);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag();
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      e.preventDefault();
      removeLastTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      updateTags([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeLastTag = () => {
    const newTags = tags.slice(0, -1);
    updateTags(newTags);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    updateTags(newTags);
  };

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <PseudoInput tabIndex={0} error={error} className="h-auto flex-wrap">
        {tags.map((tag) => (
          <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
            {tag}
          </Tag>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder || 'Type and press Enter or Tab'}
          className="flex-grow bg-background text-sm outline-none"
        />
      </PseudoInput>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
