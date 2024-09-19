import { useState } from 'react';
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
  fields: CustomField[];
  // 'type' is set with a select, so it'll never be wrong
  errors?: Array<{ key?: string; value?: string }>;
  className?: string;
  onChange: (fields: CustomField[]) => void;
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
  fields: initialFields,
  errors, // Add errors prop here
  className,
  onChange,
}) => {
  const [fields, setFields] = useState<CustomField[]>(initialFields);

  const handleFieldChange = (
    index: number,
    fieldType: 'key' | 'value' | 'type',
    value: string | number | boolean,
  ) => {
    const updatedFields = fields.map((field, i) => {
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
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleAddField = () => {
    const updatedFields = [
      ...fields,
      { key: '', value: '', type: 'string' as ValueType },
    ];
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const typeOptions = [
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Switch' },
  ];

  const renderValueInput = (field: CustomField, index: number) => {
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
          />
        );
      case 'boolean':
        return (
          <Row>
            <Switch
              checked={Boolean(field.value)}
              onChange={(checked) => handleFieldChange(index, 'value', checked)}
              label="Value"
              className="w-auto"
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
          />
        );
    }
  };

  return (
    <Col className={className}>
      {label && <label className="font-semibold">{label}</label>}
      {fields.map((field, index) => (
        <Row alignItems="start" key={index}>
          <Input
            label="Key"
            value={field.key}
            onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
            error={errors?.[index]?.key}
          />
          <Select
            label="Type"
            value={field.type}
            options={typeOptions}
            onChange={(value) =>
              handleFieldChange(index, 'type', value as ValueType)
            }
          />
          {renderValueInput(field, index)}
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleRemoveField(index)}
          >
            <IconTrash size={20} />
          </Button>
        </Row>
      ))}
      <Button type="button" onClick={handleAddField} className="self-start">
        Add Field
      </Button>
    </Col>
  );
};
