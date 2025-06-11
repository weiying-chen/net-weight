import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { IconTrash } from '@tabler/icons-react';
import { LabelStatus } from '@/components/LabelStatus';

export type FieldStatus<T = string, V extends string | number = string> = {
  value: T | null;
  verified: boolean;
  visibleTo: V;
};

export type FieldListProps<T = string, V extends string | number = string> = {
  label: string;
  addButtonLabel: string;
  value: FieldStatus<T, V>[];
  onChange: (value: FieldStatus<T, V>[]) => void;
  visibilityOpts: { value: V; label: string }[];
};

export const FieldList = <T = string, V extends string | number = string>({
  label,
  addButtonLabel,
  value,
  onChange,
  visibilityOpts,
}: FieldListProps<T, V>) => {
  const handleChange = (
    index: number,
    field: keyof FieldStatus<T, V>,
    newValue: any,
  ) => {
    const updated = value.map((entry, i) =>
      i === index ? { ...entry, [field]: newValue } : entry,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    const firstVisibility = visibilityOpts[0]?.value;
    if (firstVisibility === undefined) return;

    onChange([
      ...value,
      {
        value: null,
        verified: false,
        visibleTo: firstVisibility,
      } as FieldStatus<T, V>,
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Col>
      {value.map((entry, i) => (
        <Row key={i} alignItems="start">
          <Input
            label={
              <LabelStatus
                label={label}
                value={entry.visibleTo}
                options={visibilityOpts}
                onChange={(v) => handleChange(i, 'visibleTo', v)}
                verified={entry.verified}
              />
            }
            value={(entry.value ?? '') as string}
            onChange={(e) => handleChange(i, 'value', e.target.value)}
            className="flex-1"
          />
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
      <Button type="button" onClick={handleAdd} className="mt-2 self-start">
        {addButtonLabel}
      </Button>
    </Col>
  );
};
