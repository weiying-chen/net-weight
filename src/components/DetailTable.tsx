import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';

type Column<T> = {
  header: ReactNode;
  render: (item: T) => ReactNode;
};

type DetailTableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export function DetailTable<T>({ data, columns }: DetailTableProps<T>) {
  return (
    <Col className="border-b border-subtle text-sm">
      <Row className="border-b border-subtle bg-subtle px-4 py-2 font-semibold">
        <div className="w-12 text-center">#</div>
        {columns.map((col, i) => (
          <div key={i} className="flex-1 px-4">
            {col.header}
          </div>
        ))}
      </Row>
      {data.map((item, index) => (
        <Row
          key={index}
          className="border-b border-subtle px-4 py-2 last:border-none"
        >
          <div className="w-12 text-center">{index + 1}</div>
          {columns.map((col, i) => (
            <div key={i} className="flex-1 px-4">
              {col.render(item)}
            </div>
          ))}
        </Row>
      ))}
    </Col>
  );
}
