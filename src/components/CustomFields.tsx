import { useEffect, useRef, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';
import { Switch } from '@/components/Switch';

type ValueType = 'string' | 'number' | 'boolean';

type CustomField = {
  key: string;
  value: string | number | boolean;
  type: ValueType;
};

type CustomFieldsProps = {
  label?: string;
  fields?: CustomField[];
  keysOnly?: boolean;
  errors?: Array<{ key?: string; value?: string }>;
  className?: string;
  lockedFields?: string[];
  fillOnceFields?: string[];
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
  onChange,
  onBeforeRemove,
}) => {
  const prevFields = useRef([...initialFields]);
  const [fields, setFields] = useState<CustomField[]>(initialFields);

  const updateFields = (newFields: CustomField[]) => {
    setFields(newFields);
    onChange(newFields);
  };

  const handleFieldChange = (
    index: number,
    fieldType: 'key' | 'value' | 'type',
    value: string | number | boolean,
  ) => {
    const newFields = fields.map((field, i) => {
      if (i === index) {
        if (fieldType === 'type') {
          const resetValue = resetType(value as ValueType);
          return {
            ...field,
            type: value as ValueType,
            value: resetValue,
          };
        }
        return { ...field, [fieldType]: value };
      }
      return field;
    });
    updateFields(newFields);
  };

  const handleAddField = () => {
    const newFields = [
      ...fields,
      { key: '', value: '', type: 'string' as ValueType },
    ];
    updateFields(newFields);
  };

  const handleRemoveField = async (index: number) => {
    const fieldToRemove = fields[index];

    if (onBeforeRemove) {
      const canRemove = await onBeforeRemove(fieldToRemove);
      if (!canRemove) {
        return;
      }
    }

    const newFields = fields.filter((_, i) => i !== index);
    updateFields(newFields);
  };

  const typeOptions = [
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Switch (on/off)' },
  ];

  const renderValueInput = (field: CustomField, index: number) => {
    const isFillOnce =
      fillOnceFields.includes(field.key) && !!prevFields.current[index]?.value;

    switch (field.type) {
      case 'number':
        return (
          <Input
            label="Value"
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
              label="Value"
              disabled={isFillOnce}
            />
          </Row>
        );
      default:
        return (
          <Input
            label="Value"
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
              label="Name"
              value={field.key}
              onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
              error={errors?.[index]?.key}
              disabled={isLocked}
            />
            <Select
              label="Type"
              value={field.type}
              options={typeOptions}
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
        Add Field
      </Button>
    </Col>
  );
};
