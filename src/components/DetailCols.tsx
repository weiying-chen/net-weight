import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';

type Field = { label?: ReactNode; value: ReactNode } | null;

type DetailColsProps = {
  /** only rows of fields */
  rows: Field[][];
};

export const DetailCols: React.FC<DetailColsProps> = ({ rows }) => {
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
        {/* wrap value in a block-level truncate container */}
        <div className="w-full min-w-0 truncate">{field.value}</div>
      </Row>
    </Col>
  );

  return (
    <Col className="gap-4">
      {rows.map((fields, rowIdx) => {
        // pad to at least 3 fields
        const padded = [...fields];
        while (padded.length < 3) padded.push(null);

        // split first three and extras
        const firstThree = padded.slice(0, 3) as NonNullable<Field>[];
        const extras = fields
          .slice(3)
          .filter((f): f is NonNullable<Field> => !!f);
        const hideExtraLabel = extras.length === 1;
        const extraLabel = hideExtraLabel ? extras[0].label : undefined;

        return (
          <div
            key={rowIdx}
            className="grid w-full gap-4"
            style={{
              gridTemplateColumns: '1fr 1fr 1fr 3fr',
            }}
          >
            {firstThree.map((f, idx) =>
              f ? renderDetail(f, idx) : <div key={idx} />,
            )}

            {/* extras container in last grid cell */}
            <div className="flex min-w-0 gap-2">
              {extras.map((f, ei) => {
                const shouldHide = hideExtraLabel && f.label === extraLabel;
                const field = shouldHide ? { ...f, label: undefined } : f;
                return (
                  <div key={ei} className="min-w-0 flex-1">
                    {renderDetail(field, `extra-${ei}`)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Col>
  );
};
