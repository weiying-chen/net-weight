import { Heading } from '@/components/Heading';

function renderTable(children: React.ReactNode) {
  return <table className="min-w-full">{children}</table>;
}

function renderTableHead(children: React.ReactNode) {
  return <thead className="bg-subtle">{children}</thead>;
}

function renderTableBody(children: React.ReactNode) {
  return <tbody className="divide-y divide-subtle">{children}</tbody>;
}

function renderTableRow(children: React.ReactNode, key?: number | string) {
  return (
    <tr key={key} className="hover:bg-subtle">
      {children}
    </tr>
  );
}

function renderTableHeader(children: React.ReactNode, key: number | string) {
  return (
    <th key={key} className="px-4 py-2 text-left">
      <Heading size="sm">{children}</Heading>
    </th>
  );
}

function renderTableCell(children: React.ReactNode, key: number | string) {
  return (
    <td key={key} className="px-4 py-2 text-sm">
      {children}
    </td>
  );
}

type Column<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

export function Table<T>({
  data,
  columns,
}: {
  data: T[];
  columns: Column<T>[];
}) {
  return renderTable(
    <>
      {renderTableHead(
        renderTableRow(
          columns.map((column, index) =>
            renderTableHeader(column.header, index),
          ),
        ),
      )}
      {renderTableBody(
        data.map((item, rowIndex) =>
          renderTableRow(
            columns.map((column, colIndex) =>
              renderTableCell(column.render(item), colIndex),
            ),
            rowIndex,
          ),
        ),
      )}
    </>,
  );
}
