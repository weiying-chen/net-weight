import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';
import { Switch } from '@/components/Switch';

export type ValueType = 'text' | 'number' | 'switch' | 'select';

export type Option = {
  value: string | number;
  label: string;
};

export type FlexFieldInput = {
  label?: string; // Optional label for the input (defaults to "Value")
  value: string | number | boolean;
  type: ValueType; // Determines which input is shown
  options?: Option[]; // For type 'select'
};

export type FlexField = {
  key: string; // Field group name, displayed as a static label
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
    updateFields([
      ...fields,
      {
        key: 'New Field',
        inputs: [{ label: 'Value', value: '', type: 'text' }],
      },
    ]);
  };

  const handleRemoveField = (fieldIndex: number) => {
    updateFields(fields.filter((_, i) => i !== fieldIndex));
  };

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
      case 'switch':
        return (
          <Switch
            label={inputLabel}
            checked={Boolean(input.value)}
            onChange={(checked) =>
              handleInputChange(fieldIndex, inputIndex, checked)
            }
          />
        );
      case 'select':
        return (
          <Select
            label={inputLabel}
            value={String(input.value)}
            options={input.options || []}
            onChange={(value) =>
              handleInputChange(fieldIndex, inputIndex, value)
            }
          />
        );
      default:
        // 'text'
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
    <Col className="w-full">
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, index) => (
        <Row alignItems="center" key={index} className="mb-2 w-full">
          {/* Static field key */}
          <div className="mr-2 font-bold">{field.key}</div>
          {field.inputs.map((input, inputIndex) => (
            <div key={inputIndex} className="mr-2 flex-1">
              {renderInput(index, input, inputIndex)}
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="md:mt-7"
            onClick={() => handleRemoveField(index)}
          >
            <IconTrash size={20} />
          </Button>
        </Row>
      ))}
      <Button type="button" onClick={handleAddField} className="self-start">
        {addFieldLabel}
      </Button>
    </Col>
  );
};
