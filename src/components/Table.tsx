import React, { useState, useRef, useEffect } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

const MIN_COL_WIDTH = 50;

export function Table<T>({
  data,
  selectedItems,
  cols,
  onRowHover,
  onRowClick,
  onRowSelect,
}: {
  data: T[];
  selectedItems: T[];
  cols: Cols<T>[];
  onRowHover?: (item: T) => React.ReactNode;
  onRowClick?: (e: React.MouseEvent<Element>, item: T) => void;
  onRowSelect?: (selectedItems: T[]) => void;
}) {
  const [sortConfig, setSortConfig] = useState<{
    index: number;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const hideTimeout = useRef<number | null>(null);
  const [widths, setWidths] = useState<{ [index: number]: number }>({});
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[][]>([]);

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

  const startResizing = (index: number, event: React.MouseEvent) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = widths[index];

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      setWidths((prevWidths) => {
        const newWidths = { ...prevWidths };
        const newWidth = Math.max(startWidth + deltaX, MIN_COL_WIDTH);
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
    if (data.length === 0) return;

    const calculateWidths = () => {
      const newWidths: { [index: number]: number } = {};

      cols.forEach((_, colIndex) => {
        const headerWidth =
          headerRefs.current[colIndex]?.getBoundingClientRect().width || 0;

        const bodyWidths = bodyRefs.current.map((row) =>
          row[colIndex] ? row[colIndex].getBoundingClientRect().width : 0,
        );

        const maxBodyWidth = Math.max(...bodyWidths, 0);
        newWidths[colIndex] = Math.max(
          headerWidth,
          maxBodyWidth,
          MIN_COL_WIDTH,
        );
      });

      setWidths(newWidths);
    };

    calculateWidths();
  }, [data, cols]);

  useEffect(() => {
    const handleScroll = () => {
      setHoveredRow(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleRowSelect = (rowIndex: number) => {
    const selectedItem = data[rowIndex];
    const isSelected = selectedItems.some((item) => item === selectedItem);

    const newSelection = isSelected
      ? selectedItems.filter((item) => item !== selectedItem)
      : [...selectedItems, selectedItem];

    onRowSelect?.(newSelection);
  };

  const setIndeterminateState = (el: HTMLInputElement | null) => {
    if (el) {
      el.indeterminate =
        selectedItems.length > 0 && selectedItems.length < data.length;
    }
  };

  const handleSelectAll = () => {
    const newSelection = selectedItems.length === data.length ? [] : [...data];
    onRowSelect?.(newSelection);
  };

  const renderHeader = () => (
    <div className="flex bg-subtle">
      {onRowSelect && (
        <div className="w-8 px-4 py-2">
          <input
            ref={setIndeterminateState}
            type="checkbox"
            checked={data.length > 0 && selectedItems.length === data.length}
            onChange={handleSelectAll}
          />
        </div>
      )}
      {cols.map((column, index) => (
        <div
          key={index}
          className="relative px-4 py-2 text-left"
          style={{ width: `${widths[index]}px` }}
          ref={(el) => (headerRefs.current[index] = el)}
        >
          <div
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
            onClick={() => handleSort(index)}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {column.header}
            </span>
            {sortConfig?.index === index &&
              (sortConfig.direction === 'asc' ? (
                <IconArrowUp size={16} className="shrink-0" />
              ) : (
                <IconArrowDown size={16} className="shrink-0" />
              ))}
          </div>
          <div
            className="absolute right-0 top-0 flex h-full w-2 cursor-col-resize items-center justify-center"
            onMouseDown={(e) => startResizing(index, e)}
          >
            <div className="h-full w-[2px] bg-background"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBody = () => (
    <div>
      {sortedData.map((item, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex cursor-pointer border-b border-subtle ${
            hoveredRow === rowIndex ? 'bg-subtle' : ''
          }`}
          onClick={(e) => onRowClick?.(e, item)}
          onMouseEnter={(e) => handleMouseEnterRow(rowIndex, e)}
          onMouseLeave={handleMouseLeaveRow}
        >
          {onRowSelect && (
            <div className="w-8 px-4 py-2">
              <input
                type="checkbox"
                checked={selectedItems.some((selected) => selected === item)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => handleRowSelect(rowIndex)}
              />
            </div>
          )}
          {cols.map((column, colIndex) => (
            <div
              key={colIndex}
              className="overflow-hidden text-ellipsis whitespace-nowrap px-4 py-2 text-sm"
              style={{ width: `${widths[colIndex]}px` }}
              ref={(el) => {
                if (!bodyRefs.current[rowIndex]) {
                  bodyRefs.current[rowIndex] = [];
                }
                bodyRefs.current[rowIndex][colIndex] = el;
              }}
            >
              {column.render(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderHover = () => {
    if (hoveredRow === null || hoverPosition === null || !onRowHover)
      return null;

    return (
      <div
        className="fixed right-6 z-10 -translate-y-1/2 transform bg-subtle"
        style={{ top: `${hoverPosition}px` }}
        onMouseEnter={() => {
          if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
        }}
        onMouseLeave={handleMouseLeaveRow}
      >
        {onRowHover(sortedData[hoveredRow])}
      </div>
    );
  };

  return (
    <div className="relative overflow-x-auto">
      <div style={{ minWidth: 'max-content' }}>
        {renderHeader()}
        {renderBody()}
      </div>
      {renderHover()}
    </div>
  );
}
