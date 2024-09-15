import { useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

type CustomField = {
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
};

type CustomFieldsProps = {
  label: string;
  fields: CustomField[];
  error?: string;
  className?: string;
  onChange: (fields: CustomField[]) => void;
};

export const CustomFields: React.FC<CustomFieldsProps> = ({
  label,
  fields: initialFields,
  error,
  className,
  onChange,
}) => {
  const [fields, setFields] = useState<CustomField[]>(initialFields);

  const handleFieldChange = (
    index: number,
    fieldType: 'key' | 'value' | 'type',
    value: string | number | boolean,
  ) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [fieldType]: value } : field,
    );
    console.log(updatedFields);
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleAddField = () => {
    const updatedFields = [
      ...fields,
      { key: '', value: '', type: 'string' as 'string' | 'number' | 'boolean' }, // Correct type casting
    ];
    console.log(updatedFields);
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    console.log(updatedFields);
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const typeOptions = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
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
          />
        );
      case 'boolean':
        return (
          <Select
            label="Value"
            value={String(field.value)}
            options={[
              { value: 'true', label: 'True' },
              { value: 'false', label: 'False' },
            ]}
            onChange={(value) =>
              handleFieldChange(index, 'value', value === 'true')
            }
          />
        );
      default:
        return (
          <Input
            label="Value"
            value={String(field.value)}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
          />
        );
    }
  };

  return (
    <Col className={className}>
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <Row key={index} className="items-end gap-2">
            <Input
              label="Key"
              value={field.key}
              onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
            />
            {renderValueInput(field, index)}
            <Select
              label="Type"
              value={field.type}
              options={typeOptions}
              onChange={(value) =>
                handleFieldChange(
                  index,
                  'type',
                  value as 'string' | 'number' | 'boolean',
                )
              }
              className="flex-1"
            />
            <Button
              type="button"
              variant="danger"
              onClick={() => handleRemoveField(index)}
            >
              Delete
            </Button>
          </Row>
        ))}
        <Button type="button" onClick={handleAddField} className="self-start">
          Add Field
        </Button>
      </div>
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </Col>
  );
};
