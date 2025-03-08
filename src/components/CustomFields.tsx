import { useEffect, useRef, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';
import { Switch } from '@/components/Switch';

export type ValueType = 'string' | 'number' | 'boolean';

export type CustomField = {
  key: string;
  value: string | number | boolean;
  type: ValueType;
};

export type CustomFieldsProps = {
  label?: string;
  fields?: CustomField[];
  keysOnly?: boolean;
  errors?: Array<{ key?: string; value?: string }>;
  className?: string;
  lockedFields?: string[];
  fillOnceFields?: string[];
  passwordFields?: string[];
  addFieldLabel?: string;
  nameLabel?: string;
  typeLabel?: string;
  valueLabel?: string;
  selectPlaceholder?: string;
  typeOptions?: { value: ValueType; label: string }[];
  onChange: (fields: CustomField[]) => void;
  onBeforeRemove?: (field: CustomField) => Promise<boolean> | boolean;
};

export const resetType = (type: ValueType): string | number | boolean => {
  switch (type) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    default:
      return '';
  }
};

export const CustomFields: React.FC<CustomFieldsProps> = ({
  label,
  fields: initialFields = [],
  keysOnly = false,
  className,
  errors,
  lockedFields = [],
  fillOnceFields = [],
  passwordFields = [],
  addFieldLabel = 'Add field',
  nameLabel = 'Name',
  typeLabel = 'Type',
  valueLabel = 'Value',
  selectPlaceholder,
  typeOptions = [
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Switch (on/off)' },
  ],
  onChange,
  onBeforeRemove,
}) => {
  const prevFields = useRef([...initialFields]);
  const [fields, setFields] = useState<CustomField[]>(initialFields);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const updateFields = (newFields: CustomField[]) => {
    setFields(newFields);
    onChange(newFields);
  };

  const handleFieldChange = (
    index: number,
    fieldType: 'key' | 'value' | 'type',
    value: string | number | boolean,
  ) => {
    const newFields = fields.map((field, i) =>
      i === index
        ? {
            ...field,
            [fieldType]:
              fieldType === 'type' ? resetType(value as ValueType) : value,
          }
        : field,
    );
    updateFields(newFields);
  };

  const handleAddField = () => {
    updateFields([...fields, { key: '', value: '', type: 'string' }]);
  };

  const handleRemoveField = async (index: number) => {
    if (onBeforeRemove) {
      const canRemove = await onBeforeRemove(fields[index]);
      if (!canRemove) return;
    }
    updateFields(fields.filter((_, i) => i !== index));
  };

  const renderValueInput = (field: CustomField, index: number) => {
    const isFillOnce =
      fillOnceFields.includes(field.key) && !!prevFields.current[index]?.value;
    const isPassword = passwordFields.includes(field.key);

    switch (field.type) {
      case 'number':
        return (
          <Input
            label={valueLabel}
            type="number"
            value={String(field.value)}
            onChange={(e) =>
              handleFieldChange(index, 'value', Number(e.target.value))
            }
            error={errors?.[index]?.value}
            disabled={isFillOnce}
          />
        );
      case 'boolean':
        return (
          <Row>
            <Switch
              checked={Boolean(field.value)}
              onChange={(checked) => handleFieldChange(index, 'value', checked)}
              label={valueLabel}
              disabled={isFillOnce}
            />
          </Row>
        );
      default:
        return (
          <Input
            label={valueLabel}
            type={isPassword ? 'password' : 'text'}
            value={String(field.value)}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
            error={errors?.[index]?.value}
            disabled={isFillOnce}
          />
        );
    }
  };

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, index) => {
        const isLocked = lockedFields.includes(field.key);
        return (
          <Row alignItems="start" key={index}>
            <Input
              label={nameLabel}
              value={field.key}
              onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
              error={errors?.[index]?.key}
              disabled={isLocked}
            />
            <Select
              label={typeLabel}
              value={field.type}
              options={typeOptions}
              placeholder={selectPlaceholder}
              onChange={(value) =>
                handleFieldChange(index, 'type', value as ValueType)
              }
              disabled={isLocked}
            />
            {!keysOnly && renderValueInput(field, index)}
            <Button
              type="button"
              variant="secondary"
              className="md:mt-7"
              disabled={isLocked}
              onClick={() => handleRemoveField(index)}
            >
              <IconTrash size={20} />
            </Button>
          </Row>
        );
      })}
      <Button type="button" onClick={handleAddField} className="self-start">
        {addFieldLabel}
      </Button>
    </Col>
  );
};
