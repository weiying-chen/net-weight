import { useState } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

export interface Column<T> {
  header: React.ReactNode;
  accessor: (item: T) => React.ReactNode;
  sortKey?: keyof T; // SortKey must be a keyof T
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T>({
  data,
  columns,
}: DataTableProps<T>): JSX.Element {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: keyof T) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return prevConfig.direction === 'asc'
          ? { key, direction: 'desc' }
          : { key, direction: 'asc' };
      }

      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="overflow-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left"
                onClick={() => column.sortKey && toggleSort(column.sortKey)}
              >
                <div className="flex cursor-pointer items-center space-x-2">
                  <span>{column.header}</span>
                  {column.sortKey &&
                    sortConfig?.key === column.sortKey &&
                    (sortConfig.direction === 'asc' ? (
                      <IconArrowUp size={16} />
                    ) : (
                      <IconArrowDown size={16} />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-white even:bg-gray-100">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {column.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
