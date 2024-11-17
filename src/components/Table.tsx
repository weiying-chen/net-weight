import { useState, useRef, useEffect } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

export function Table<T>({
  data,
  cols,
  onRowHover,
  onRowClick,
}: {
  data: T[];
  cols: Cols<T>[];
  onRowHover?: (item: T) => React.ReactNode;
  onRowClick?: (e: React.MouseEvent<Element>, item: T) => void;
}) {
  const [sortConfig, setSortConfig] = useState<{
    index: number;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const hideTimeout = useRef<number | null>(null);

  const [widths, setWidths] = useState<{ [index: number]: number }>(
    () => Object.fromEntries(cols.map((_, index) => [index, 150])), // Default widths
  );

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

  const handleMouseEnterRow = (rowIndex: number, event: React.MouseEvent) => {
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }

    setHoveredRow(rowIndex);

    const rowElement = event.currentTarget as HTMLDivElement;
    const rowTop = rowElement.getBoundingClientRect().top;
    const rowHeight = rowElement.getBoundingClientRect().height;
    setHoverPosition(rowTop + rowHeight / 2);
  };

  const handleMouseLeaveRow = () => {
    hideTimeout.current = window.setTimeout(() => {
      setHoveredRow(null);
    }, 100);
  };

  const handleMouseEnterHoverContent = () => {
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }
  };

  const handleMouseLeaveHoverContent = () => {
    hideTimeout.current = window.setTimeout(() => {
      setHoveredRow(null);
    }, 100);
  };

  const startResizing = (index: number, event: React.MouseEvent) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = widths[index] || 150;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      setWidths((prevWidths) => {
        const newWidths = { ...prevWidths };
        const newWidth = Math.max(startWidth + deltaX, 50); // Minimum width is 50px
        newWidths[index] = newWidth;
        return newWidths;
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const handleScroll = () => {
      setHoveredRow(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <div className="relative w-full overflow-x-auto">
      <div>
        {/* Header */}
        <div className="flex border-b border-gray-300 bg-subtle">
          {cols.map((column, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 border-r border-gray-300 px-4 py-2 text-left"
              style={{ width: `${widths[index] || 150}px` }}
            >
              <div
                className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
                onClick={() => handleSort(index)}
              >
                {column.header}
                {sortConfig?.index === index &&
                  (sortConfig.direction === 'asc' ? (
                    <IconArrowUp size={16} />
                  ) : (
                    <IconArrowDown size={16} />
                  ))}
              </div>
              {index < cols.length - 1 && (
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-400 hover:bg-gray-600"
                  onMouseDown={(e) => startResizing(index, e)}
                />
              )}
            </div>
          ))}
        </div>
        {/* Body */}
        <div>
          {sortedData.map((item, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex cursor-pointer border-b border-gray-300 ${
                hoveredRow === rowIndex ? 'bg-subtle' : ''
              }`}
              onClick={(e) => onRowClick?.(e, item)}
              onMouseEnter={(e) => handleMouseEnterRow(rowIndex, e)}
              onMouseLeave={handleMouseLeaveRow}
            >
              {cols.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-shrink-0 px-4 py-2 text-sm"
                  style={{ width: `${widths[colIndex] || 150}px` }}
                >
                  {column.render(item)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {hoveredRow !== null && onRowHover && hoverPosition !== null && (
        <div
          className="fixed z-10"
          style={{
            top: `${hoverPosition}px`,
            right: '24px',
            transform: 'translateY(-50%)',
          }}
          onMouseEnter={handleMouseEnterHoverContent}
          onMouseLeave={handleMouseLeaveHoverContent}
        >
          {onRowHover(sortedData[hoveredRow])}
        </div>
      )}
    </div>
  );
}
