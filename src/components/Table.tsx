import React, { useState, useRef, useEffect } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { Tooltip } from './Tooltip'; // <-- import your new Tooltip here

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

const MIN_COL_WIDTH = 50;

export function Table<T>({
  data,
  selectedItems,
  cols,
  onRowClick,
  onRowSelect,
  asActions,
  asTooltip,
}: {
  data: T[];
  selectedItems: T[];
  cols: Cols<T>[];
  onRowClick?: (e: React.MouseEvent<Element>, item: T) => void;
  onRowSelect?: (selectedItems: T[]) => void;
  asActions?: (item: T) => React.ReactNode;
  asTooltip?: (item: T) => React.ReactNode;
}) {
  const [sortConfig, setSortConfig] = useState<{
    index: number;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Track which row is hovered (for asActions).
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // This is for positioning the “actions” hover at the right side of the table.
  const [hoverPosition, setHoverPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  // Used to delay hiding asActions so user can move into that popover.
  const hideTimeout = useRef<number | null>(null);

  // Track column widths for resizing.
  const [widths, setWidths] = useState<{ [index: number]: number }>({});
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sort the data based on the current sortConfig (if any).
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig && sortConfig.index < cols.length) {
      const { index, direction } = sortConfig;
      const aValue = cols[index].render(a);
      const bValue = cols[index].render(b);

      const aStr =
        aValue !== null && aValue !== undefined ? String(aValue) : '';
      const bStr =
        bValue !== null && bValue !== undefined ? String(bValue) : '';

      // If they're objects or something un-sortable, do not sort.
      if (aStr === '[object Object]' || bStr === '[object Object]') {
        return 0;
      }

      if (aStr < bStr) return direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  // Handle sorting when the user clicks a column header.
  const handleSort = (index: number) => {
    const sampleValue = cols[index].render(data[0]);
    // Skip sorting if the column value is an object.
    if (typeof sampleValue === 'object' && sampleValue !== null) {
      return;
    }

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.index === index) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ index, direction });
  };

  // For showing the asActions on hover.
  const handleMouseEnterRow = (rowIndex: number, event: React.MouseEvent) => {
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }

    setHoveredRow(rowIndex);

    // Position the popover on the right side.
    const rowElement = event.currentTarget as HTMLDivElement;
    const rowRect = rowElement.getBoundingClientRect();
    const container = containerRef.current;
    const containerBounds = container?.getBoundingClientRect();

    if (containerBounds) {
      setHoverPosition({
        top: rowRect.top + rowRect.height / 2,
        right: document.documentElement.clientWidth - containerBounds.right,
      });
    }
  };

  const handleMouseLeaveRow = () => {
    // Delay hiding so user can move into the asActions popover if needed.
    hideTimeout.current = window.setTimeout(() => {
      setHoveredRow(null);
    }, 100);
  };

  // We still clear the hide timeout if the user is moving around within the row.
  // (Prevents asActions from disappearing if you haven't actually left the row.)
  const handleMouseMoveRow = (rowIndex: number) => {
    if (hoveredRow !== rowIndex) return;
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }
  };

  // Let the user resize columns.
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

  // On mount / updates, measure columns to set initial min widths.
  useEffect(() => {
    if (data.length === 0) return;

    const calculateWidths = () => {
      const newWidths: { [index: number]: number } = {};

      cols.forEach((_, colIndex) => {
        const headerWidth =
          headerRefs.current[colIndex]?.getBoundingClientRect().width || 0;

        const bodyWidths = bodyRefs.current.map((row) =>
          row[colIndex] ? row[colIndex]!.getBoundingClientRect().width : 0,
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

  // Handling row selection.
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

  // Renders the header row with sortable columns.
  const renderHeader = () => (
    <div className="flex bg-subtle">
      {onRowSelect && (
        <div className="flex items-center justify-center px-4 py-2">
          <input
            ref={setIndeterminateState}
            type="checkbox"
            checked={data.length > 0 && selectedItems.length === data.length}
            onChange={handleSelectAll}
          />
        </div>
      )}
      <div className="flex w-12 items-center justify-center px-4 py-2 text-sm font-semibold">
        #
      </div>
      {cols.map((column, index) => (
        <div
          key={index}
          className="relative flex items-center px-4 py-2 text-left"
          style={{ width: `${widths[index]}px` }}
          ref={(el) => (headerRefs.current[index] = el)}
        >
          <div
            className="flex min-w-0 cursor-pointer items-center gap-2 text-sm font-semibold"
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

  // Renders each row of data.
  const renderBody = () =>
    sortedData.map((item, rowIndex) => {
      // The row content we always render
      const rowContent = (
        <div
          key={rowIndex}
          className={`flex cursor-pointer border-b border-subtle ${
            hoveredRow === rowIndex ? 'bg-subtle' : ''
          }`}
          onClick={(e) => onRowClick?.(e, item)}
          onMouseEnter={(e) => handleMouseEnterRow(rowIndex, e)}
          onMouseLeave={handleMouseLeaveRow}
          onMouseMove={() => handleMouseMoveRow(rowIndex)}
        >
          {onRowSelect && (
            <div className="flex items-center justify-center px-4 py-2">
              <input
                type="checkbox"
                checked={selectedItems.some((selected) => selected === item)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => handleRowSelect(rowIndex)}
              />
            </div>
          )}
          <div className="flex w-12 items-center justify-center px-4 py-2 text-sm">
            {rowIndex + 1}
          </div>
          {cols.map((column, colIndex) => (
            <div
              key={colIndex}
              className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap px-4 py-2 text-sm"
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
      );

      // If we have a tooltip function, wrap the row in our Tooltip component
      // so that the tooltip shows whatever `asTooltip(item)` returns.
      if (asTooltip) {
        return (
          <Tooltip key={rowIndex} content={asTooltip(item)}>
            {rowContent}
          </Tooltip>
        );
      }

      // Otherwise, just return the row as-is.
      return rowContent;
    });

  // Manages the asActions popover.
  // (Still uses hoveredRow + positions it on the right side)
  const handleMouseMoveHover = () => {
    if (hoveredRow === null) return;
    if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }
  };

  const handleMouseEnterHover = () => {
    if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
  };

  const handleMouseLeaveHover = () => {
    hideTimeout.current = window.setTimeout(() => {
      setHoveredRow(null);
    }, 100);
  };

  // Renders the asActions popover if the user hovers a row.
  const renderHover = () => {
    if (hoveredRow === null || hoverPosition === null || !asActions)
      return null;

    return (
      <div
        className="pointer-events-auto fixed z-10 -translate-y-1/2 transform bg-subtle"
        style={{
          top: `${hoverPosition.top}px`,
          right: `${hoverPosition.right}px`,
        }}
        onMouseEnter={handleMouseEnterHover}
        onMouseLeave={handleMouseLeaveHover}
        onMouseMove={handleMouseMoveHover}
      >
        {asActions(sortedData[hoveredRow])}
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-x-auto" ref={containerRef}>
      <div className="min-w-max">
        {renderHeader()}
        {renderBody()}
      </div>
      {renderHover()}
      {/* No custom tooltip here anymore—it's handled by the <Tooltip> component above. */}
    </div>
  );
}
