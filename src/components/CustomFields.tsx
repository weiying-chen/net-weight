import { useEffect, useRef, useState, useMemo } from 'react';
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
  errors?: Array<{ key?: string; value?: string } | undefined>;
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
  disablePortal?: boolean;
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
  disablePortal = false,
}) => {
  // Normalize lockedFields once
  const normalizedLocked = useMemo(
    () => lockedFields.map((k) => k.trim()),
    [lockedFields],
  );

  // Compute which initial keys are locked (by index)
  const lockedIndexRef = useRef<Set<number>>(
    new Set(
      initialFields
        .map((f, idx) => ({ key: f.key.trim(), idx }))
        .filter(({ key }) => normalizedLocked.includes(key))
        .map(({ idx }) => idx),
    ),
  );

  const prevFields = useRef<CustomField[]>(initialFields);
  const [fields, setFields] = useState<CustomField[]>(initialFields);

  useEffect(() => {
    setFields(initialFields);
    prevFields.current = initialFields;
  }, [initialFields]);

  const updateFields = (newFields: CustomField[]) => {
    setFields(newFields);
    onChange(newFields);
  };

  const handleFieldChange = (
    index: number,
    fieldType: 'key' | 'value' | 'type',
    newValue: string | number | boolean,
  ) => {
    const newFields = fields.map((field, i) => {
      if (i !== index) return field;
      if (fieldType === 'type') {
        const newType = newValue as ValueType;
        return { ...field, type: newType, value: resetType(newType) };
      }
      return { ...field, [fieldType]: newValue };
    });
    updateFields(newFields);
  };

  const handleAddField = () => {
    const newField: CustomField = { key: '', value: '', type: 'string' };
    updateFields([...fields, newField]);
  };

  const handleRemoveClick = async (field: CustomField, index: number) => {
    // If this field name is in lockedFields, skip onBeforeRemove
    const isLockedName = normalizedLocked.includes(field.key.trim());
    if (!isLockedName && onBeforeRemove) {
      const canRemove = await onBeforeRemove(field);
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
        const isLocked = lockedIndexRef.current.has(index);
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
              disablePortal={disablePortal}
            />
            {!keysOnly && renderValueInput(field, index)}
            <Button
              type="button"
              variant="secondary"
              className="md:mt-7"
              disabled={isLocked}
              onClick={() => handleRemoveClick(field, index)}
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
