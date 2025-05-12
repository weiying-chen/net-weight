import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconTrash } from '@tabler/icons-react';

type DynFieldsProps<T extends Record<string, string | number>> = {
  label?: string;
  fields?: T[];
  fieldTemplate: T;
  labels?: Partial<Record<keyof T, string>>; // Optional localized labels
  addFieldLabel?: string;
  onChange: (fields: T[]) => void;
};

export const DynFields = <T extends Record<string, string | number>>({
  label,
  fields: initialFields = [],
  fieldTemplate,
  labels = {},
  addFieldLabel = 'Add Field',
  onChange,
}: DynFieldsProps<T>) => {
  const [fields, setFields] = useState<T[]>(initialFields);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const updateFields = (newFields: T[]) => {
    setFields(newFields);
    onChange(newFields);
  };

  const handleInputChange = (
    index: number,
    key: keyof T,
    value: string | number,
  ) => {
    const updated = fields.map((f, i) =>
      i !== index ? f : { ...f, [key]: value },
    );
    updateFields(updated);
  };

  const handleAddField = () => {
    updateFields([...fields, { ...fieldTemplate }]);
  };

  const handleRemoveField = (index: number) => {
    updateFields(fields.filter((_, i) => i !== index));
  };

  const keys = Object.keys(fieldTemplate) as (keyof T)[];

  return (
    <Col className="w-full space-y-2">
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, fi) => (
        <div
          key={fi}
          className="grid w-full items-end gap-2"
          style={{
            gridTemplateColumns: `repeat(${keys.length}, minmax(0, 1fr)) auto`,
          }}
        >
          {keys.map((key) => (
            <Input
              key={`${fi}-${String(key)}`}
              label={labels[key] ?? String(key)}
              type={typeof field[key] === 'number' ? 'number' : 'text'}
              value={String(field[key])}
              onChange={(e) =>
                handleInputChange(
                  fi,
                  key,
                  typeof field[key] === 'number'
                    ? Number(e.target.value)
                    : e.target.value,
                )
              }
              className="w-full min-w-0" // ensure full width inside grid
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleRemoveField(fi)}
            className="w-10"
          >
            <IconTrash size={20} />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={handleAddField} className="self-start">
        {addFieldLabel}
      </Button>
    </Col>
  );
};
