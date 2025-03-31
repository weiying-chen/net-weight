import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Switch } from '@/components/Switch';
import { IconTrash } from '@tabler/icons-react';

export type ValueType = 'string' | 'number' | 'boolean';

export type FlexFieldInput = {
  label?: string; // Optional label for the input (defaults to "Value" if not provided)
  value: string | number | boolean;
  type: ValueType; // Determines which input is shown
};

export type FlexField = {
  key: string; // Field group name (displayed as a static label)
  inputs: FlexFieldInput[]; // One or more inputs in this field
};

export type FlexFieldsProps = {
  label?: string;
  fields?: FlexField[];
  addFieldLabel?: string;
  onChange: (fields: FlexField[]) => void;
};

export const FlexFields: React.FC<FlexFieldsProps> = ({
  label,
  fields: initialFields = [],
  addFieldLabel = 'Add Field',
  onChange,
}) => {
  const [fields, setFields] = useState<FlexField[]>(initialFields);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const updateFields = (newFields: FlexField[]) => {
    setFields(newFields);
    onChange(newFields);
  };

  const handleInputChange = (
    fieldIndex: number,
    inputIndex: number,
    newValue: string | number | boolean,
  ) => {
    const newFields = fields.map((field, fi) => {
      if (fi !== fieldIndex) return field;
      return {
        ...field,
        inputs: field.inputs.map((inp, ii) =>
          ii === inputIndex ? { ...inp, value: newValue } : inp,
        ),
      };
    });
    updateFields(newFields);
  };

  const handleAddField = () => {
    // Add a new field with one default input (adjust defaults as needed)
    updateFields([
      ...fields,
      { key: 'New Field', inputs: [{ label: '', value: '', type: 'string' }] },
    ]);
  };

  const handleRemoveField = (fieldIndex: number) => {
    updateFields(fields.filter((_, i) => i !== fieldIndex));
  };

  // Removed the unused 'field' parameter
  const renderInput = (
    fieldIndex: number,
    input: FlexFieldInput,
    inputIndex: number,
  ) => {
    const inputLabel = input.label || 'Value';
    switch (input.type) {
      case 'number':
        return (
          <Input
            label={inputLabel}
            type="number"
            value={String(input.value)}
            onChange={(e) =>
              handleInputChange(fieldIndex, inputIndex, Number(e.target.value))
            }
          />
        );
      case 'boolean':
        return (
          <Switch
            label={inputLabel}
            checked={Boolean(input.value)}
            onChange={(checked) =>
              handleInputChange(fieldIndex, inputIndex, checked)
            }
          />
        );
      default:
        return (
          <Input
            label={inputLabel}
            type="text"
            value={String(input.value)}
            onChange={(e) =>
              handleInputChange(fieldIndex, inputIndex, e.target.value)
            }
          />
        );
    }
  };

  return (
    <Col>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, fieldIndex) => (
        <div key={fieldIndex} className="my-2 rounded border p-3">
          {/* Display the field's key as a static group label */}
          <div className="mb-2 font-bold">{field.key}</div>
          <Row>
            {field.inputs.map((input, inputIndex) => (
              <div key={inputIndex} className="mr-2">
                {renderInput(fieldIndex, input, inputIndex)}
              </div>
            ))}
          </Row>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleRemoveField(fieldIndex)}
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
