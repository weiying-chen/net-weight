import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Select, SelectOption } from '@/components/Select';
import { Tag } from '@/components/Tag';
import { ReactNode, useState } from 'react';

export type TagSelectProps<T extends string> = {
  /** Optional label displayed above the tag list */
  label?: ReactNode;
  /** All available options */
  options: SelectOption<T>[];
  /** Placeholder for the select input */
  placeholder?: string;
  /** Controlled list of selected tag values */
  value: T[];
  /** Called when tag list changes */
  onChange: (values: T[]) => void;
  /** Error message displayed below the select */
  error?: string;
};

export function TagSelect<T extends string>({
  label,
  options,
  placeholder,
  value,
  onChange,
  error,
}: TagSelectProps<T>) {
  const [searchValue, setSearchValue] = useState<T | ''>('');

  // Find the selected option objects for display as tags
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleSelect = (val: T) => {
    if (!options.some((o) => o.value === val) || value.includes(val)) {
      return;
    }
    onChange([...value, val]);
    setSearchValue('');
  };

  const handleRemove = (val: T) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <Col className="w-full">
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">{label}</label>
        ) : (
          label
        ))}

      {selectedOptions.length > 0 && (
        <Row>
          {selectedOptions.map((opt) => (
            <Tag key={opt.value} onRemove={() => handleRemove(opt.value)}>
              {opt.label}
            </Tag>
          ))}
        </Row>
      )}

      <Select
        hasSearch
        options={options}
        value={searchValue as T}
        placeholder={placeholder}
        onChange={handleSelect}
      />

      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
