import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { DetailTooltip } from '@/components/DetailTooltip';

type Primitive = string | number | boolean;

type Option = { value: Primitive; label: ReactNode };

type Field = {
  key: string;
  label?: ReactNode;
  value: ReactNode;
  rawValue?: Primitive;
  showIf?: { key: string; equals: Primitive };
  options?: Option[];
} | null;

type DetailColsProps = {
  rows: Field[][];
  hideCols?: number[];
  labelOnlyCols?: number[];
  colWidths?: [string, string, string, string];
  formatValue?: (value: ReactNode, key: string, colIdx: number) => ReactNode;
};

export const DetailCols: React.FC<DetailColsProps> = ({
  rows,
  hideCols = [],
  labelOnlyCols = [],
  colWidths = ['1fr', '1fr', '1fr', '3fr'],
  formatValue,
}) => {
  const getPrimitive = (f: NonNullable<Field>): Primitive | undefined => {
    if (f.rawValue !== undefined) return f.rawValue;
    const v = f.value as unknown;
    if (
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean'
    )
      return v;
    return undefined;
  };

  const shouldShowDetail = (
    field: NonNullable<Field>,
    row: Field[],
    seen = new Set<string>(),
  ): boolean => {
    if (!field.showIf) return true;
    const controller = row.find((f) => f && f.key === field.showIf!.key) as
      | NonNullable<Field>
      | undefined;
    if (!controller) return false;
    if (seen.has(controller.key)) return false;
    seen.add(controller.key);
    if (!shouldShowDetail(controller, row, seen)) return false;
    return getPrimitive(controller) === field.showIf.equals;
  };

  // Resolve label from options, then let formatValue do any final prettifying
  const toDisplay = (field: NonNullable<Field>, colIdx: number) => {
    const raw = getPrimitive(field);
    const optLabel =
      field.options?.find((o) => o.value === raw)?.label ??
      field.options?.find((o) => o.value === field.value)?.label;

    const base = optLabel ?? field.value;
    return formatValue ? formatValue(base, field.key, colIdx) : base;
  };

  const renderDetail = (
    field: NonNullable<Field>,
    key: React.Key,
    colIdx: number,
  ) => {
    const isValueOnly = labelOnlyCols.includes(colIdx);
    const display = toDisplay(field, colIdx);
    return (
      <Col align="center" key={key} className="min-w-0 gap-2">
        {!isValueOnly && field.label && (
          <label className="block truncate text-sm font-semibold">
            {field.label}
          </label>
        )}
        <Row
          locked
          className={`w-full min-w-0 text-sm ${isValueOnly ? 'font-semibold' : 'border-b border-subtle pb-2'}`}
        >
          <DetailTooltip content={display} />
        </Row>
      </Col>
    );
  };

  const renderField = (field: Field, key: React.Key, colIdx: number) =>
    field ? renderDetail(field, key, colIdx) : <div key={key} />;

  const renderExtras = (
    extras: NonNullable<Field>[],
    hideExtraLabel: boolean,
    extraLabel: ReactNode | undefined,
    rowKey: React.Key,
  ) => (
    <div key={`extras-${rowKey}`} className="flex min-w-0 gap-2">
      {extras.map((f, ei) => {
        const shouldHideLabel = hideExtraLabel && f.label === extraLabel;
        const field = shouldHideLabel ? { ...f, label: undefined } : f;
        return (
          <div key={`extra-${rowKey}-${ei}`} className="min-w-0 flex-1">
            {renderDetail(field, `extra-${rowKey}-${ei}`, 3)}
          </div>
        );
      })}
    </div>
  );

  const renderRow = (fields: Field[], rowKey: React.Key) => {
    const visible = fields.map((f) =>
      f && shouldShowDetail(f, fields) ? f : null,
    );
    const padded = [...visible];
    while (padded.length < 3) padded.push(null);
    const extras = visible.slice(3).filter((f): f is NonNullable<Field> => !!f);
    const hideExtraLabel = extras.length === 1;
    const extraLabel = hideExtraLabel ? extras[0].label : undefined;

    const visibleCols = colWidths.filter((_, idx) => !hideCols.includes(idx));
    const visibleIndices = colWidths
      .map((_, idx) => idx)
      .filter((idx) => !hideCols.includes(idx));

    return (
      <div
        key={`row-${rowKey}`}
        className="grid w-full gap-4"
        style={{ gridTemplateColumns: visibleCols.join(' ') }}
      >
        {visibleIndices.map((colIdx) =>
          colIdx < 3
            ? renderField(padded[colIdx], `cell-${rowKey}-${colIdx}`, colIdx)
            : renderExtras(extras, hideExtraLabel, extraLabel, rowKey),
        )}
      </div>
    );
  };

  const renderSectionHeader = (title: ReactNode, key: string) => (
    <span
      key={key}
      className="w-full border-b border-subtle pb-2 font-semibold text-muted"
    >
      {typeof title === 'string'
        ? title.charAt(0).toUpperCase() + title.slice(1)
        : title}
    </span>
  );

  const grouped = rows.reduce<Record<string, Field[][]>>((acc, row) => {
    const methodCell = row.find((f) => f?.key === 'method') as
      | NonNullable<Field>
      | undefined;
    let methodVal: Primitive | undefined;
    if (methodCell) {
      methodVal =
        methodCell.rawValue ??
        (typeof methodCell.value === 'string' ||
        typeof methodCell.value === 'number' ||
        typeof methodCell.value === 'boolean'
          ? methodCell.value
          : undefined);
    }
    const method = String(methodVal ?? 'Unknown');
    (acc[method] ||= []).push(row);
    return acc;
  }, {});

  return (
    <Col gap="lg">
      {Object.entries(grouped).map(([method, methodRows], sIdx) => {
        const sectionKey = `section-${method}-${sIdx}`;
        return (
          <Col key={sectionKey}>
            {renderSectionHeader(method, sectionKey)}
            {methodRows.map((r, i) => renderRow(r, `${sIdx}-${i}`))}
          </Col>
        );
      })}
    </Col>
  );
};
