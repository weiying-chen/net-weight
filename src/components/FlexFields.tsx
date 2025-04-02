import React, { useEffect, useState } from 'react';
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
  | 'switch'
  | 'select'
  | 'password'
  | 'date';

export type Option = {
  value: string | number;
  label: string;
};

export type FlexFieldInput = {
  key: string; // Internal identifier used for logic
  label?: string; // Display label (can be localized)
  value: string | number | boolean;
  type: ValueType; // Determines which input is rendered
  options?: Option[]; // For type 'select'
  unit?: string; // Optional unit string (e.g., "cm", "USD")
};

export type FlexField = {
  key: string; // Field group identifier
  inputs: FlexFieldInput[]; // One or more inputs in this field
};

export type FlexFieldsProps = {
  label?: string;
  fields?: FlexField[];
  addFieldLabel?: string;
  // Template structure for a new field.
  fieldTemplate?: FlexField;
  onChange: (fields: FlexField[]) => void;
};

export const FlexFields: React.FC<FlexFieldsProps> = ({
  label,
  fields: initialFields = [],
  addFieldLabel = 'Add Field',
  fieldTemplate,
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
    // Use the fieldTemplate prop if provided; otherwise, fall back to a basic default.
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

  // Helper function to render an input with its display label and unit.
  const renderInput = (
    fieldIndex: number,
    input: FlexFieldInput,
    inputIndex: number,
  ) => {
    const displayLabel = input.label || 'Value';
    return (
      <div className="w-full">
        <label className="block text-sm font-medium">
          {displayLabel}
          {input.unit && (
            <span className="ml-1 text-xs text-muted">{input.unit}</span>
          )}
        </label>
        {(() => {
          switch (input.type) {
            case 'number':
              return (
                <Input
                  type="number"
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
            case 'select':
              return (
                <Select
                  value={String(input.value)}
                  options={input.options || []}
                  // Disable if there is only one option available.
                  disabled={!!input.options && input.options.length === 1}
                  onChange={(value) =>
                    handleInputChange(fieldIndex, inputIndex, value)
                  }
                />
              );
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
                    // Format the date to yyyy-MM-dd
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
      </div>
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
