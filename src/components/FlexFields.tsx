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
  label: string;
  value: string | number | boolean;
  type: ValueType;
  options?: Option[];
  unit?: string;
};

export type FlexField = {
  id: string;
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
  asUnit?: (unit?: string) => string | undefined;
  monthLabel?: (date: Date) => string;
  weekdayLabel?: (weekday: string, index: number) => string;
  dateValueLabel?: (date: Date) => string;
  selectPlaceholder?: string;
  datePlaceholder?: string;
  errors?: Array<{ [key: string]: string }>;
};

export const FlexFields: React.FC<FlexFieldsProps> = ({
  label,
  fields: initialFields = [],
  addFieldLabel = 'Add Field',
  fieldTemplate,
  onChange,
  asLabel,
  asOption,
  asUnit,
  monthLabel,
  weekdayLabel,
  dateValueLabel,
  selectPlaceholder,
  datePlaceholder,
  errors,
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
          id: crypto.randomUUID().slice(0, 8),
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

    // Simply derive the error (if any) from the errors passed in the props.
    const errorMsg = errors?.[fieldIndex]?.[input.key];

    return (
      <Col className="flex-1">
        <label className="text-sm font-medium">
          {displayLabel}
          {input.unit && (
            <span className="ml-1 text-xs text-muted">
              {asUnit ? asUnit(input.unit) : input.unit}
            </span>
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
                  error={errorMsg}
                />
              );
            case 'switch':
              return (
                <Switch
                  checked={Boolean(input.value)}
                  onChange={(checked) =>
                    handleInputChange(fieldIndex, inputIndex, checked)
                  }
                  label={displayLabel}
                  error={errorMsg}
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
                  placeholder={selectPlaceholder}
                  disabled={!!input.options && input.options.length === 1}
                  onChange={(value) =>
                    handleInputChange(fieldIndex, inputIndex, value)
                  }
                  error={errorMsg}
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
                  error={errorMsg}
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
                  placeholder={datePlaceholder}
                  monthLabel={monthLabel}
                  weekdayLabel={weekdayLabel}
                  valueLabel={dateValueLabel}
                  error={errorMsg}
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
                  error={errorMsg}
                />
              );
          }
        })()}
      </Col>
    );
  };

  return (
    <Col className="w-full">
      {label && <label className="mb-2 text-sm font-semibold">{label}</label>}
      {fields.map((field, fieldIndex) => (
        <Row alignItems="start" key={field.id}>
          {field.inputs.map((input, inputIndex) => (
            <div
              key={`${field.id}-${input.key}-${inputIndex}`}
              className="flex-1"
            >
              {renderInput(fieldIndex, input, inputIndex)}
            </div>
          ))}
          <div className="self-start md:mt-7">
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
