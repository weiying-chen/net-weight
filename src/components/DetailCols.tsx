import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';

type Field = { label?: ReactNode; value: ReactNode } | null;

type DetailColsProps = {
  /** rows of fields */
  rows: Field[][];
  /** minimum number of columns (pads shorter rows) */
  minCols?: number;
  /**
   * Override widths by column index.
   * E.g. ['2fr','1fr', undefined, '3rem'] → col 1=2fr, col 2=1fr, col 4=3rem.
   */
  colWidths?: (string | undefined)[];
};

export const DetailCols: React.FC<DetailColsProps> = ({
  rows,
  minCols = 3,
  colWidths = [],
}) => {
  // determine how many columns we need
  const maxCols = Math.max(minCols, ...rows.map((r) => r.length));

  // build default array of '1fr'
  const widths: string[] = Array.from(
    { length: maxCols },
    (_, i) => colWidths[i] ?? '1fr',
  );
  const templateColumns = widths.join(' ');

  const renderDetail = (field: NonNullable<Field>, key: React.Key) => (
    <Col key={key} className="gap-2">
      {field.label ? (
        <label className="block truncate text-sm font-semibold">
          {field.label}
        </label>
      ) : (
        <div className="block truncate text-sm font-semibold">&nbsp;</div>
      )}
      <Row
        locked
        className="w-full overflow-hidden truncate whitespace-nowrap border-b border-subtle pb-2 text-sm"
      >
        {field.value}
      </Row>
    </Col>
  );

  return (
    <Col className="gap-4">
      {rows.map((fields, rowIdx) => {
        // hide label of sole non-baseKey field (i.e., when only one extra input exists)
        const padded = [...fields];
        while (padded.length < maxCols) padded.push(null);

        // determine which fields are baseColumns by position
        const baseCount = 3; // category, method, item
        const extraFields = padded.slice(baseCount).filter((f) => f);
        const hideExtraLabel = extraFields.length === 1;
        const extraLabel = hideExtraLabel ? extraFields[0]?.label : undefined;

        return (
          <div
            key={rowIdx}
            className="grid w-full gap-4"
            style={{ gridTemplateColumns: templateColumns }}
          >
            {padded.map((f, idx) => {
              if (!f) return <div key={idx} />;

              const shouldHide = hideExtraLabel && f.label === extraLabel;
              const field = shouldHide ? { ...f, label: undefined } : f;
              return renderDetail(field, idx);
            })}
          </div>
        );
      })}
    </Col>
  );
};
