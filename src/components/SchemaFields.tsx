import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { DatePicker } from '@/components/DatePicker';
import { format } from 'date-fns';
import { LabelTooltip } from '@/components/LabelTooltip';
import { Row } from '@/components/Row';
import { TextTooltip } from '@/components/TextTooltip';

export type ValueType =
  | 'text'
  | 'integer'
  | 'number'
  | 'switch'
  | 'select'
  | 'password'
  | 'date';

export type Option = { value: string | number | boolean; label: string };

export type SchemaFieldInput = {
  key: string;
  label: string;
  value: string | number | boolean;
  type: ValueType;
  options?: Option[];
  optionsFrom?: string;
  unit?: string;
  showIf?: {
    key: string;
    equals: string;
  };
  required?: boolean;
};

export type SchemaField = { id: string; inputs: SchemaFieldInput[] };

export type SchemaFieldsProps = {
  label?: string;
  fields?: SchemaField[];
  addFieldLabel?: string;
  fieldTemplate?: SchemaField;
  onChange: (fields: SchemaField[]) => void;
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

const blueprintKeys = ['item', 'value'];

function getLabel(
  value: string | number | boolean,
  options?: Option[],
  asOption?: (option: Option) => Option,
): string {
  const selected = options?.find((o) => o.value === value);
  if (!selected) return String(value);

  const resolved = asOption?.(selected) ?? selected;
  return resolved.label;
}

export const SchemaFields: React.FC<SchemaFieldsProps> = ({
  label,
  fields: initialFields = [],
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
  const [fields, setFields] = useState<SchemaField[]>(initialFields);

  const shouldShow = (inp: SchemaFieldInput, inputs: SchemaFieldInput[]) => {
    if (!inp.showIf) return true;
    const controlling = inputs.find((i) => i.key === inp.showIf!.key);
    return controlling?.value === inp.showIf.equals;
  };

  const updateFields = (newFields: SchemaField[]) => {
    setFields(newFields);
    onChange(newFields);
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

  const renderInput = (
    field: SchemaField,
    fi: number,
    inp: SchemaFieldInput,
    ii: number,
  ) => {
    const displayLabel = asLabel?.(inp.label) ?? inp.label;
    const labelIgnoreKeys = ['category', 'method', 'item'];
    const realInputs = field.inputs.filter(
      (i) => !labelIgnoreKeys.includes(i.key),
    );
    const shouldHideLabel =
      realInputs.length === 1 && realInputs[0].key === inp.key;

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
            value={inp.value}
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
          {!shouldHideLabel && <LabelTooltip text={displayLabel} />}
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

  useEffect(() => setFields(initialFields), [initialFields]);

  if (fields.length === 0) return null;

  return (
    <Col>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {fields.map((field, fi) => {
        const extras = field.inputs.filter(
          (inp) => !['category', 'method', 'item'].includes(inp.key),
        );

        // new logic for handling single extra input that's not "value"
        const onlyExtra = extras.length === 1 ? extras[0] : null;
        const onlyExtraIdx = onlyExtra
          ? field.inputs.findIndex((i) => i.key === onlyExtra.key)
          : -1;

        return (
          <div
            key={field.id}
            className="grid w-full gap-4"
            style={{
              // item = 1fr, value/extra = 3fr
              gridTemplateColumns: `1fr 3fr`,
            }}
          >
            {blueprintKeys.map((key, idx) => {
              // ① Special-case “item” as a truncated span
              if (key === 'item') {
                const inp = field.inputs.find((i) => i.key === 'item');
                if (!inp || typeof inp.value !== 'string') return null;

                return (
                  <Row
                    key={`${field.id}-item`}
                    alignItems="center"
                    className="min-w-0"
                  >
                    <TextTooltip
                      text={getLabel(inp.value, inp.options, asOption)}
                    />
                  </Row>
                );
              }

              // ② Any other non-“value” keys
              if (key !== 'value') {
                const inpIndex = field.inputs.findIndex((i) => i.key === key);
                return (
                  <div key={`${field.id}-${key}-${idx}`} className="min-w-0">
                    {inpIndex >= 0 ? (
                      renderInput(field, fi, field.inputs[inpIndex], inpIndex)
                    ) : (
                      <div style={{ visibility: 'hidden' }} />
                    )}
                  </div>
                );
              }

              // ③ “value” (or extra fields) go here
              return (
                <div key={`${field.id}-value-${idx}`} className="min-w-0">
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
          </div>
        );
      })}
    </Col>
  );
};
