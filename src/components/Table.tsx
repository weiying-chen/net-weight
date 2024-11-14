import React, { useState, useRef } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
  width?: number;
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
  const [columnWidths, setColumnWidths] = useState(
    cols.map((col) => col.width || 150),
  );

  const resizingIndicator = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthsRef = useRef<number[]>([]);

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

  const handleResizeStart = (index: number, startX: number) => {
    document.body.classList.add('select-none');
    startXRef.current = startX;
    startWidthsRef.current = [...columnWidths];

    // if (resizingIndicator.current) {
    //   resizingIndicator.current.style.display = 'block';
    //   resizingIndicator.current.style.left = `${startX}px`;
    // }

    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - startXRef.current;
      const newWidth = Math.max(50, startWidthsRef.current[index] + deltaX);

      setColumnWidths((prevWidths) => {
        const updatedWidths = [...prevWidths];
        updatedWidths[index] = newWidth;
        return updatedWidths;
      });

      // if (resizingIndicator.current) {
      //   resizingIndicator.current.style.left = `${event.clientX}px`;
      // }
    };

    const handleMouseUp = () => {
      document.body.classList.remove('select-none');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // if (resizingIndicator.current) {
      //   resizingIndicator.current.style.display = 'none';
      // }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="min-w-full">
        <table className="min-w-full" style={{ borderCollapse: 'separate' }}>
          <thead className="bg-subtle">
            <tr>
              {cols.map((column, index) => (
                <th
                  key={index}
                  className="relative px-4 py-2 text-left"
                  style={{ width: columnWidths[index], position: 'relative' }}
                >
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    onClick={() => handleSort(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {column.header}
                    {sortConfig?.index === index &&
                      (sortConfig.direction === 'asc' ? (
                        <IconArrowUp size={16} />
                      ) : (
                        <IconArrowDown size={16} />
                      ))}
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                    onMouseDown={(e) => handleResizeStart(index, e.clientX)}
                    style={{ touchAction: 'none' }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {sortedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-subtle"
                onClick={(e) => onRowClick?.(e, item)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {cols.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm"
                    style={{ width: columnWidths[colIndex] }}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*
      <div
        ref={resizingIndicator}
        className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-blue-500"
        style={{ display: 'none', position: 'fixed' }}
      />
    */}
    </div>
  );
}
