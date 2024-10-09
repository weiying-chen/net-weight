import { useState } from 'react';
import { Heading } from '@/components/Heading';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react'; // Import the icons

type Column<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function Table<T>({
  data,
  columns,
}: {
  data: T[];
  columns: Column<T>[];
}) {
  const [sortConfig, setSortConfig] = useState<{
    index: number;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig && sortConfig.index < columns.length) {
      const { index, direction } = sortConfig;
      const aValue = columns[index].render(a);
      const bValue = columns[index].render(b);

      const aStr =
        aValue !== null && aValue !== undefined ? String(aValue) : '';
      const bStr =
        bValue !== null && bValue !== undefined ? String(bValue) : '';

      if (aStr === '[object Object]' || bStr === '[object Object]') {
        return 0;
      }

      if (aStr < bStr) return direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const handleSort = (index: number) => {
    const sampleValue = columns[index].render(data[0]);
    if (isObject(sampleValue)) {
      return;
    }

    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig?.index === index) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ index, direction });
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-subtle">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="cursor-pointer px-4 py-2 text-left"
                onClick={() => handleSort(index)}
              >
                <Heading size="sm" className="flex items-center gap-2">
                  {column.header}
                  {sortConfig?.index === index &&
                    (sortConfig.direction === 'asc' ? (
                      <IconArrowUp size={16} />
                    ) : (
                      <IconArrowDown size={16} />
                    ))}
                </Heading>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-subtle">
          {sortedData.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-subtle">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2 text-sm">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
