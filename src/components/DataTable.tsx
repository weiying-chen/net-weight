import { useState } from 'react';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface Column<T> {
  header: React.ReactNode; // Header can be a React element or a string
  accessor: (item: T) => React.ReactNode; // Accessor must return a React element or string
  sortKey?: keyof T; // Key used for sorting
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
          : null;
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
                      <IconChevronUp size={16} />
                    ) : (
                      <IconChevronDown size={16} />
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
