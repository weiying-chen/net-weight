import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Select, SelectOption } from '@/components/Select';
import { Tag } from '@/components/Tag';
import { useState } from 'react';

export type TagSelectProps<T extends string> = {
  /** All available options */
  options: SelectOption<T>[];
  /** Placeholder for the select input */
  placeholder?: string;
  /** Controlled list of selected tags */
  value: SelectOption<T>[];
  /** Called when tag list changes */
  onChange: (tags: SelectOption<T>[]) => void;
};

export function TagSelect<T extends string>({
  options,
  placeholder,
  value: tags,
  onChange,
}: TagSelectProps<T>) {
  const [searchValue, setSearchValue] = useState<T | ''>('');

  const handleSelect = (val: T) => {
    const opt = options.find((o) => o.value === val);
    if (!opt || tags.some((t) => t.value === val)) return;

    onChange([...tags, opt]);
    setSearchValue('');
  };

  const handleRemove = (val: T) => {
    onChange(tags.filter((t) => t.value !== val));
  };

  return (
    <Col className="w-full">
      <Row>
        {tags.map((tag) => (
          <Tag key={tag.value} onRemove={() => handleRemove(tag.value)}>
            {tag.label}
          </Tag>
        ))}
      </Row>
      <Select
        hasSearch
        options={options}
        value={searchValue as T}
        placeholder={placeholder}
        onChange={handleSelect}
      />
    </Col>
  );
}
