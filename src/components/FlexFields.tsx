import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';
import { Switch } from '@/components/Switch';
import { DatePicker } from '@/components/DatePicker';
import { format } from 'date-fns';
import { LabelTooltip } from '@/components/LabelTooltip';
import { Row } from '@/components/Row';

export type ValueType =
  | 'text'
  | 'integer'
  | 'number'
  | 'switch'
  | 'select'
  | 'password'
  | 'date';

export type Option = { value: string | number | boolean; label: string };

export type FlexFieldInput = {
  key: string;
  label: string;
  value: string | number | boolean;
  type: ValueType;
  options?: Option[];
  unit?: string;
  condition?: {
    key: string;
    equals: string;
  };
};

export type FlexField = { id: string; inputs: FlexFieldInput[] };

export type FlexFieldsProps = {
  label?: string;
  fields?: FlexField[];
  addFieldLabel?: string;
  fieldTemplate?: FlexField;
  onChange: (fields: FlexField[]) => void;
  asLabel?: (label: string) => string;
  asOption?: (option: Option) => Option;
  asUnit?: (unit?: string) => string | undefined;
  headerLabel?: (date: Date, mode: 'day' | 'month') => string;
  monthLabel?: (date: Date) => string;
  weekdayLabel?: (weekday: string, index: number) => string;
  dateValueLabel?: (date: Date) => string;
  selectPlaceholder?: string;
  datePlaceholder?: string;
  errors?: Array<{ [key: string]: string }>;
  viewModeLabels?: { day: string; month: string };
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
  headerLabel,
  monthLabel,
  weekdayLabel,
  dateValueLabel,
  selectPlaceholder = 'Select an option',
  datePlaceholder,
  errors,
  viewModeLabels,
}) => {
  const [fields, setFields] = useState<FlexField[]>(initialFields);

  const shouldShow = (inp: FlexFieldInput, inputs: FlexFieldInput[]) => {
    if (!inp.condition) return true;
    const controlling = inputs.find((i) => i.key === inp.condition!.key);
    return controlling?.value === inp.condition.equals;
  };

  const updateFields = (newFields: FlexField[]) => {
    setFields(newFields);
    onChange(newFields);
  };

  const cloneInput = (inp: FlexFieldInput): FlexFieldInput => ({
    ...inp,
    options: inp.options ? [...inp.options] : undefined,
  });

  const makeDefaultField = (): FlexField =>
    fieldTemplate
      ? {
          id: crypto.randomUUID().slice(0, 8),
          inputs: fieldTemplate.inputs.map(cloneInput),
        }
      : {
          id: crypto.randomUUID().slice(0, 8),
          inputs: [{ key: 'value', label: 'Value', value: '', type: 'text' }],
        };

  const handleInputChange = (
    fi: number,
    ii: number,
    newValue: string | number | boolean,
  ) => {
    const updated = fields.map((fld, idx) =>
      idx !== fi
        ? fld
        : {
            ...fld,
            inputs: fld.inputs.map((inp, j) =>
              j === ii ? { ...inp, value: newValue } : inp,
            ),
          },
    );
    updateFields(updated);
  };

  const handleAddField = () => updateFields([...fields, makeDefaultField()]);

  const handleRemoveField = (i: number) =>
    updateFields(fields.filter((_, idx) => idx !== i));

  const renderInput = (
    field: FlexField,
    fi: number,
    inp: FlexFieldInput,
    ii: number,
  ) => {
    const displayLabel = asLabel?.(inp.label) ?? inp.label;

    const fieldErrs = errors?.[fi] || {};
    let errorMsg = fieldErrs[inp.key];
    if (!errorMsg && inp.type === 'select' && inp.key === 'currency') {
      errorMsg = fieldErrs.value;
    }

    let element;
    switch (inp.type) {
      case 'integer':
        element = (
          <Input
            type="number"
            step="1"
            inputMode="numeric"
            value={String(inp.value)}
            onChange={(e) => handleInputChange(fi, ii, Number(e.target.value))}
            error={errorMsg}
          />
        );
        break;
      case 'number':
        element = (
          <Input
            type="number"
            step="0.1"
            value={String(inp.value)}
            onChange={(e) => handleInputChange(fi, ii, Number(e.target.value))}
            error={errorMsg}
          />
        );
        break;
      case 'switch':
        element = (
          <Switch
            checked={Boolean(inp.value)}
            onChange={(ch) => handleInputChange(fi, ii, ch)}
            label={displayLabel}
            error={errorMsg}
          />
        );
        break;
      case 'select':
        element = (
          <Select
            value={String(inp.value)}
            options={inp.options?.map((o) => asOption?.(o) ?? o) ?? []}
            placeholder={selectPlaceholder}
            onChange={(v) => handleInputChange(fi, ii, v)}
            error={errorMsg}
            className="min-w-0"
            wrapperClassName="min-w-0"
            disabled={inp.options?.length === 1}
          />
        );
        break;
      case 'password':
        element = (
          <Input
            type="password"
            value={String(inp.value)}
            onChange={(e) => handleInputChange(fi, ii, e.target.value)}
            error={errorMsg}
          />
        );
        break;
      case 'date':
        element = (
          <DatePicker
            value={inp.value ? new Date(inp.value as string) : undefined}
            onChange={(d) =>
              handleInputChange(fi, ii, d ? format(d, 'yyyy-MM-dd') : '')
            }
            placeholder={datePlaceholder}
            headerLabel={headerLabel}
            monthLabel={monthLabel}
            weekdayLabel={weekdayLabel}
            valueLabel={dateValueLabel}
            viewModeLabels={viewModeLabels}
            error={errorMsg}
          />
        );
        break;
      default:
        element = (
          <Input
            type="text"
            value={String(inp.value)}
            onChange={(e) => handleInputChange(fi, ii, e.target.value)}
            error={errorMsg}
          />
        );
    }

    return (
      <Col key={`${field.id}-${inp.key}-${ii}`}>
        <Row gap="sm" alignItems="center">
          <LabelTooltip text={displayLabel} />
          {inp.unit && (
            <span className="text-xs text-muted">
              {asUnit?.(inp.unit) ?? inp.unit}
            </span>
          )}
        </Row>
        {element}
      </Col>
    );
  };

  const blueprintKeys = ['type', 'method', 'item', 'value'];

  useEffect(() => setFields(initialFields), [initialFields]);

  return (
    <Col>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, fi) => {
        const extras = field.inputs.filter(
          (inp) => !['type', 'method', 'item'].includes(inp.key),
        );

        // new logic for handling single extra input that's not "value"
        const onlyExtra = extras.length === 1 ? extras[0] : null;
        const onlyExtraIdx = onlyExtra
          ? field.inputs.findIndex((i) => i.key === onlyExtra.key)
          : -1;

        return (
          <div
            key={field.id}
            className="grid-cols-flexfields grid w-full gap-2"
            // className="grid w-full gap-2"
            style={
              {
                // gridTemplateColumns: `repeat(${blueprintKeys.length}, minmax(0, 1fr)) auto`,
              }
            }
          >
            {blueprintKeys.map((key, idx) => {
              if (key !== 'value') {
                const inpIndex = field.inputs.findIndex((i) => i.key === key);
                return (
                  <div key={`${field.id}-${key}-${idx}`}>
                    {inpIndex >= 0 ? (
                      renderInput(field, fi, field.inputs[inpIndex], inpIndex)
                    ) : (
                      <div style={{ visibility: 'hidden' }} />
                    )}
                  </div>
                );
              }

              return (
                <div key={`${field.id}-value-${idx}`}>
                  {extras.length > 1 ? (
                    <div className="flex gap-2">
                      {extras
                        .filter((inp) => shouldShow(inp, field.inputs))
                        .map((inp, ii) => {
                          const realIdx = field.inputs.findIndex(
                            (x) => x.key === inp.key,
                          );
                          return (
                            <div
                              key={`${field.id}-${inp.key}-${ii}`}
                              className="min-w-0 flex-1"
                            >
                              {renderInput(field, fi, inp, realIdx)}
                            </div>
                          );
                        })}
                    </div>
                  ) : onlyExtra &&
                    onlyExtraIdx >= 0 &&
                    shouldShow(onlyExtra, field.inputs) ? (
                    renderInput(field, fi, onlyExtra, onlyExtraIdx)
                  ) : (
                    <div style={{ visibility: 'hidden' }} />
                  )}
                </div>
              );
            })}
            <div className="mt-7 w-12 self-start">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleRemoveField(fi)}
                className="md:w-full"
              >
                <IconTrash size={20} className="shrink-0" />
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="button" onClick={handleAddField} className="self-start">
        {addFieldLabel}
      </Button>
    </Col>
  );
};
