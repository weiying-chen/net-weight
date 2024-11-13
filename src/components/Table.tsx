import { useState } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

export function Table<T>({
  data,
  cols,
  onRowClick,
}: {
  data: T[];
  cols: Cols<T>[];
  onRowClick?: (e: React.MouseEvent<Element>, item: T) => void;
}) {
  const [sortConfig, setSortConfig] = useState<{
    index: number;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig && sortConfig.index < cols.length) {
      const { index, direction } = sortConfig;
      const aValue = cols[index].render(a);
      const bValue = cols[index].render(b);

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
    const sampleValue = cols[index].render(data[0]);

    if (typeof sampleValue === 'object' && sampleValue !== null) {
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
            {cols.map((column, index) => (
              <th
                key={index}
                className="cursor-pointer px-4 py-2 text-left"
                onClick={() => handleSort(index)}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {column.header}
                  {sortConfig?.index === index &&
                    (sortConfig.direction === 'asc' ? (
                      <IconArrowUp size={16} />
                    ) : (
                      <IconArrowDown size={16} />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-subtle">
          {sortedData.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="cursor-pointer hover:bg-subtle"
              onClick={(e) => onRowClick?.(e, item)}
            >
              {cols.map((column, colIndex) => (
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
