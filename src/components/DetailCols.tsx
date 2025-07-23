import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { DetailTooltip } from '@/components/DetailTooltip';

type Field = { label?: ReactNode; value: ReactNode } | null;

type DetailColsProps = {
  /** only rows of fields */
  rows: Field[][];
  /** hide columns by index: 0,1,2 for the first three, 3 for the extras */
  hideCols?: number[];
  /**
   * Column widths for cols [0,1,2,extras].
   * E.g. ['2fr','1fr','1fr','3fr'].
   * Defaults to ['1fr','1fr','1fr','3fr'].
   */
  colWidths?: [string, string, string, string];
};

export const DetailCols: React.FC<DetailColsProps> = ({
  rows,
  hideCols = [],
  colWidths = ['1fr', '1fr', '1fr', '3fr'],
}) => {
  const renderDetail = (field: NonNullable<Field>, key: React.Key) => (
    <Col key={key} className="min-w-0 gap-2">
      {field.label ? (
        <label className="block truncate text-sm font-semibold">
          {field.label}
        </label>
      ) : (
        <div className="block truncate text-sm font-semibold">&nbsp;</div>
      )}
      <Row
        locked
        className="w-full min-w-0 border-b border-subtle pb-2 text-sm"
      >
        <DetailTooltip content={field.value} />
      </Row>
    </Col>
  );

  return (
    <Col className="gap-4">
      {rows.map((fields, rowIdx) => {
        // pad to at least 3 fields
        const padded = [...fields];
        while (padded.length < 3) padded.push(null);

        // extras beyond the first three
        const extras = fields
          .slice(3)
          .filter((f): f is NonNullable<Field> => !!f);
        const hideExtraLabel = extras.length === 1;
        const extraLabel = hideExtraLabel ? extras[0].label : undefined;

        // pick only the columns we want to show
        const visibleCols = colWidths.filter(
          (_, idx) => !hideCols.includes(idx),
        );
        const visibleIndices = colWidths
          .map((_, idx) => idx)
          .filter((idx) => !hideCols.includes(idx));

        return (
          <div
            key={rowIdx}
            className="grid w-full gap-4"
            style={{ gridTemplateColumns: visibleCols.join(' ') }}
          >
            {visibleIndices.map((colIdx) => {
              if (colIdx < 3) {
                // first-three slots
                const f = padded[colIdx];
                return f ? renderDetail(f, colIdx) : <div key={colIdx} />;
              } else {
                // extras slot
                return (
                  <div key="extras" className="flex min-w-0 gap-2">
                    {extras.map((f, ei) => {
                      const shouldHide =
                        hideExtraLabel && f.label === extraLabel;
                      const field = shouldHide ? { ...f, label: undefined } : f;
                      return (
                        <div key={ei} className="min-w-0 flex-1">
                          {renderDetail(field, `extra-${ei}`)}
                        </div>
                      );
                    })}
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </Col>
  );
};
