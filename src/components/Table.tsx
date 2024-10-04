import { Heading } from '@/components/Heading';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
}

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

function Table<T extends Record<string, any>>({
  data,
  columns,
}: TableProps<T>) {
  return (
    <table className="min-w-full">
      <thead className="bg-subtle">
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} className="px-4 py-2 text-left">
              <Heading size="sm">{column.header}</Heading>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-subtle">
        {data.map((item, index) => (
          <tr key={index} className="hover:bg-subtle">
            {columns.map((column) => (
              <td
                key={`${index}-${String(column.key)}`}
                className="px-4 py-2 text-sm"
              >
                {column.render ? column.render(item) : item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
