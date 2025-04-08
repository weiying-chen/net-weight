import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';
import { Switch } from '@/components/Switch';
import { DatePicker } from '@/components/DatePicker';
import { format } from 'date-fns';

export type ValueType =
  | 'text'
  | 'number'
  | 'float'
  | 'switch'
  | 'select'
  | 'password'
  | 'date';

export type Option = {
  value: string | number;
  label: string;
};

export type FlexFieldInput = {
  key: string;
  label?: string;
  value: string | number | boolean;
  type: ValueType;
  options?: Option[];
  unit?: string;
};

export type FlexField = {
  key: string;
  inputs: FlexFieldInput[];
};

export type FlexFieldsProps = {
  label?: string;
  fields?: FlexField[];
  addFieldLabel?: string;

  fieldTemplate?: FlexField;
  onChange: (fields: FlexField[]) => void;
  asLabel?: (label: string) => string;
  asOption?: (option: Option) => Option;
};

export const FlexFields: React.FC<FlexFieldsProps> = ({
  label,
  fields: initialFields = [],
  addFieldLabel = 'Add Field',
  fieldTemplate,
  onChange,
  asLabel,
  asOption,
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
    const newField: FlexField = fieldTemplate
      ? { ...fieldTemplate }
      : {
          key: 'newField',
          inputs: [
            {
              key: 'value',
              label: 'Value',
              value: '',
              type: 'text' as ValueType,
            },
          ],
        };
    updateFields([...fields, newField]);
  };

  const handleRemoveField = (fieldIndex: number) => {
    updateFields(fields.filter((_, i) => i !== fieldIndex));
  };

  const renderInput = (
    fieldIndex: number,
    input: FlexFieldInput,
    inputIndex: number,
  ) => {
    const displayLabel = input.label
      ? asLabel
        ? asLabel(input.label)
        : input.label
      : 'Value';

    return (
      <Col>
        <label className="block text-sm font-medium">
          {displayLabel}
          {input.unit && (
            <span className="ml-1 text-xs text-muted">{input.unit}</span>
          )}
        </label>
        {(() => {
          switch (input.type) {
            case 'number':
            case 'float':
              return (
                <Input
                  type="number"
                  step={input.type === 'float' ? '0.1' : undefined}
                  value={String(input.value)}
                  onChange={(e) =>
                    handleInputChange(
                      fieldIndex,
                      inputIndex,
                      Number(e.target.value),
                    )
                  }
                />
              );
            case 'switch':
              return (
                <Switch
                  checked={Boolean(input.value)}
                  onChange={(checked) =>
                    handleInputChange(fieldIndex, inputIndex, checked)
                  }
                />
              );
            case 'select': {
              const finalOptions = input.options
                ? input.options.map((opt) => (asOption ? asOption(opt) : opt))
                : [];
              return (
                <Select
                  value={String(input.value)}
                  options={finalOptions}
                  disabled={!!input.options && input.options.length === 1}
                  onChange={(value) =>
                    handleInputChange(fieldIndex, inputIndex, value)
                  }
                />
              );
            }
            case 'password':
              return (
                <Input
                  type="password"
                  value={String(input.value)}
                  onChange={(e) =>
                    handleInputChange(fieldIndex, inputIndex, e.target.value)
                  }
                />
              );
            case 'date':
              return (
                <DatePicker
                  value={
                    input.value ? new Date(input.value as string) : undefined
                  }
                  onChange={(date) => {
                    const formattedDate = date
                      ? format(date, 'yyyy-MM-dd')
                      : '';
                    handleInputChange(fieldIndex, inputIndex, formattedDate);
                  }}
                  placeholder="Select a date"
                />
              );
            default:
              return (
                <Input
                  type="text"
                  value={String(input.value)}
                  onChange={(e) =>
                    handleInputChange(fieldIndex, inputIndex, e.target.value)
                  }
                />
              );
          }
        })()}
      </Col>
    );
  };

  return (
    <Col className="w-full">
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, fieldIndex) => (
        <Row alignItems="center" key={field.key}>
          {field.inputs.map((input, inputIndex) => (
            <div
              key={`${field.key}-${input.key}-${inputIndex}`}
              className="w-full"
            >
              {renderInput(fieldIndex, input, inputIndex)}
            </div>
          ))}
          <div className="self-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleRemoveField(fieldIndex)}
            >
              <IconTrash size={20} />
            </Button>
          </div>
        </Row>
      ))}
      <Button type="button" onClick={handleAddField} className="self-start">
        {addFieldLabel}
      </Button>
    </Col>
  );
};
