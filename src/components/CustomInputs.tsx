import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { IconTrash } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { cn } from '@/utils';

export type CustomInputsProps<T = any> = {
  label?: ReactNode;
  value: T[];
  onChange: (val: T[]) => void;
  addButtonLabel: string;
  renderFields: (
    item: T,
    index: number,
    handleChange: <K extends keyof T>(
      index: number,
      key: K,
      value: T[K],
    ) => void,
  ) => ReactNode;
  required?: boolean;
  className?: string;
};

export function CustomInputs<T = any>({
  label,
  value,
  onChange,
  addButtonLabel,
  renderFields,
  required,
  className,
}: CustomInputsProps<T>) {
  const handleChange = <K extends keyof T>(
    index: number,
    key: K,
    newValue: T[K],
  ) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      [key]: newValue,
    };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...value, {} as T]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Col className={cn('min-w-0', className)}>
      {label &&
        (typeof label === 'string' ? (
          <label className="mb-1 text-sm font-semibold">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        ) : (
          label
        ))}

      {value.map((item, i) => (
        <Row key={i} alignItems="start" gap="sm" className="mb-2">
          {renderFields(item, i, handleChange)}
          <Button
            type="button"
            variant="secondary"
            className="md:mt-7"
            locked
            onClick={() => handleRemove(i)}
          >
            <IconTrash size={20} />
          </Button>
        </Row>
      ))}

      <Button type="button" onClick={handleAdd} className="mt-1 self-start">
        {addButtonLabel}
      </Button>
    </Col>
  );
}
