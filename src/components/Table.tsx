import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';
import { TableCell } from '@/components/TableCell';

type Cols<D> = {
  header?: string;
  render: (item: D) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: D) => string | number;
  width?: number;
  editable?: boolean;
};

const MIN_COL_WIDTH = 50;
const MAX_COL_WIDTH = 300;

type SortConfig = { index: number; direction: 'asc' | 'desc' } | null;

export function Table<T, D extends object>({
  data: originalData,
  formatData,
  formatHeader,
  selectedItems,
  cols,
  onRowClick,
  onRowSelect,
  onCellChange,
  asActions,
  asTooltip,
}: {
  data: T[];
  formatData?: (items: T[]) => D[];
  formatHeader?: (header: string) => string;
  selectedItems: T[];
  cols: Cols<D>[];
  onRowClick?: (e: React.MouseEvent, item: T) => void;
  onRowSelect?: (sel: T[]) => void;
  onCellChange?: (rowIndex: number, colIndex: number, newValue: string) => void; // Define the prop type
  asActions?: (item: T) => React.ReactNode;
  asTooltip?: (item: T) => React.ReactNode;
}) {
  const [localData, setLocalData] = useState<T[]>(
    JSON.parse(JSON.stringify(originalData)),
  );

  const paired = useMemo(() => {
    const dispArr = formatData
      ? formatData(localData) // Use localData here
      : (localData as unknown as D[]);
    return dispArr.map((disp, i) => ({ orig: localData[i], disp })); // Use localData here
  }, [localData, formatData]);

  const renderedCols = useMemo(() => {
    return cols.map((col) => ({
      ...col,
      header: formatHeader ? formatHeader(col.header || '') : col.header,
    }));
  }, [cols, formatHeader]);

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const hideTimeout = useRef<number | null>(null);
  const isMouseDown = useRef(false);
  const [widths, setWidths] = useState<{ [i: number]: number }>({});
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sortedPaired = useMemo(() => {
    if (!sortConfig) return paired;
    const { index, direction } = sortConfig;
    const col = cols[index];

    return [...paired].sort((a, b) => {
      const sa = col.sortValue
        ? col.sortValue(a.disp)
        : String(col.render(a.disp) ?? '');
      const sb = col.sortValue
        ? col.sortValue(b.disp)
        : String(col.render(b.disp) ?? '');

      // If values are not comparable, skip sort
      if (
        typeof sa !== 'string' &&
        typeof sa !== 'number' &&
        typeof sb !== 'string' &&
        typeof sb !== 'number'
      ) {
        return 0;
      }

      if (direction === 'asc') return sa < sb ? -1 : sa > sb ? 1 : 0;
      return sa > sb ? -1 : sa < sb ? 1 : 0;
    });
  }, [paired, sortConfig, cols]);

  const handleSort = (ci: number) => {
    if (cols[ci].sortable === false) return;

    const col = cols[ci];
    const sample = col.sortValue
      ? col.sortValue(paired[0]?.disp)
      : col.render(paired[0]?.disp);

    if (typeof sample !== 'string' && typeof sample !== 'number') return;

    const dir =
      sortConfig?.index === ci && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';

    setSortConfig({ index: ci, direction: dir });
  };

  const handleMouseEnterRow = (ri: number, e: React.MouseEvent) => {
    if (isMouseDown.current) return;
    hideTimeout.current && window.clearTimeout(hideTimeout.current);
    setHoveredRow(ri);
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const cont = containerRef.current?.getBoundingClientRect();
    if (cont) {
      setHoverPosition({
        top: rect.top + rect.height / 2,
        right: document.documentElement.clientWidth - cont.right,
      });
    }
  };
  const handleMouseLeaveRow = () => {
    hideTimeout.current = window.setTimeout(() => setHoveredRow(null), 100);
  };
  const handleMouseMoveRow = (ri: number) => {
    if (hoveredRow !== ri) return;
    hideTimeout.current && window.clearTimeout(hideTimeout.current);
  };

  const startResizing = (ci: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = widths[ci] ?? MIN_COL_WIDTH;
    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      setWidths((prev) => ({
        ...prev,
        [ci]: Math.max(startW + delta, MIN_COL_WIDTH),
      }));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleRowSelect = (
    ri: number,
    e?: MouseEvent | React.MouseEvent | React.ChangeEvent,
  ) => {
    const { orig } = sortedPaired[ri];

    // Narrow type to check for shiftKey safely
    const isShiftClick =
      !!e && 'shiftKey' in e && typeof e.shiftKey === 'boolean' && e.shiftKey;

    if (isShiftClick && lastClickedIndex !== null) {
      const rangeStart = Math.min(lastClickedIndex, ri);
      const rangeEnd = Math.max(lastClickedIndex, ri);
      const rangeItems = sortedPaired
        .slice(rangeStart, rangeEnd + 1)
        .map((p) => p.orig);

      const selectedSet = new Set(selectedItems);
      const shouldSelect = !rangeItems.every((item) => selectedSet.has(item));

      const next = shouldSelect
        ? [...selectedItems, ...rangeItems.filter((i) => !selectedSet.has(i))]
        : selectedItems.filter((item) => !rangeItems.includes(item));

      onRowSelect?.(next);
    } else {
      // Normal toggle
      const next = selectedItems.includes(orig)
        ? selectedItems.filter((x) => x !== orig)
        : [...selectedItems, orig];

      setLastClickedIndex(ri);
      onRowSelect?.(next);
    }
  };

  const setIndeterminateState = (el: HTMLInputElement | null) => {
    if (!el) return;
    el.indeterminate =
      selectedItems.length > 0 && selectedItems.length < originalData.length;
  };
  const handleSelectAll = () => {
    onRowSelect?.(
      selectedItems.length === originalData.length ? [] : [...originalData],
    );
  };

  const handleDoubleClick = (ri: number, ci: number) => {
    const isColumnEditable = cols[ci].editable !== false;
    const isCellNotBeingEdited =
      !editingCell || editingCell.row !== ri || editingCell.col !== ci;

    if (isColumnEditable && isCellNotBeingEdited) {
      // Update editing cell to the new one
      setEditingCell({ row: ri, col: ci });
    }
  };

  const handleCellChange = (ri: number, ci: number, newValue: string) => {
    const col = cols[ci];

    // Check if the column header is defined
    if (col.header === undefined) {
      console.error(`Column header at index ${ci} is undefined.`);
      return;
    }

    const columnHeader = col.header;

    // Copy the data to avoid mutating the original state
    const updatedData = [...localData];

    // Update the specific cell based on column header (dynamic key)
    (updatedData[ri] as Record<string, any>)[columnHeader] = newValue;

    // Optimistically update the table with the new value
    setLocalData(updatedData);

    // Call the parent function to notify about the cell change
    if (onCellChange) {
      onCellChange(ri, ci, newValue);
    }

    // Reset editingCell after cell change
    // setEditingCell(null);
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (hoverRef.current?.contains(e.target as Node)) return;
      if (containerRef.current?.contains(e.target as Node)) return;

      isMouseDown.current = true;
      hideTimeout.current && window.clearTimeout(hideTimeout.current);
      setHoveredRow(null);
    };
    const onUp = () => {
      isMouseDown.current = false;
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const prevCols = useRef<Cols<D>[]>([]); // Ref to track previous cols

  useLayoutEffect(() => {
    // Only recalculate if cols have changed
    const colsChanged = !cols.every((col, i) => {
      return col.header === prevCols.current[i]?.header; // Compare headers
    });

    if (!colsChanged) return; // Skip recalculation if no change

    // Recalculate column widths when cols have changed
    const newW: { [i: number]: number } = {};

    cols.forEach((col, i) => {
      if (col.width) {
        newW[i] = col.width;
        return;
      }

      const hdrSpan = headerRefs.current[i]?.querySelector('span');
      const hW = hdrSpan?.scrollWidth ?? MIN_COL_WIDTH;
      const bW = Math.max(
        ...bodyRefs.current.map((row) => {
          const span = row[i]?.querySelector('span');
          return span?.scrollWidth ?? MIN_COL_WIDTH;
        }),
        MIN_COL_WIDTH,
      );
      const base = Math.max(hW, bW, MIN_COL_WIDTH);

      let pl = 0,
        pr = 0;
      const el = headerRefs.current[i];
      if (el) {
        const st = getComputedStyle(el);
        pl = parseFloat(st.paddingLeft);
        pr = parseFloat(st.paddingRight);
      }

      newW[i] = Math.min(base + pl + pr + 2, MAX_COL_WIDTH);
    });

    setWidths(newW);
    prevCols.current = cols;
  }, [cols]);

  const renderHeader = () => (
    <div className="flex bg-subtle">
      {onRowSelect && (
        <div className="flex items-center justify-center">
          <label
            className="flex h-full w-full cursor-pointer items-center justify-center px-4 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={setIndeterminateState}
              type="checkbox"
              checked={
                originalData.length > 0 &&
                selectedItems.length === originalData.length
              }
              onChange={handleSelectAll}
              className="pointer-events-none"
            />
          </label>
        </div>
      )}
      <div className="flex w-12 items-center justify-center px-4 py-2 text-sm font-semibold">
        #
      </div>
      {renderedCols.map((col, i) => (
        <div
          key={i}
          className={`relative flex min-w-0 px-4 py-2 text-left ${
            col.sortable === false ? 'cursor-default' : 'cursor-pointer'
          }`}
          style={{ width: widths[i] ?? MIN_COL_WIDTH }}
          ref={(el) => (headerRefs.current[i] = el)}
          onClick={() => (col.sortable === false ? null : handleSort(i))}
        >
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
            {col.header !== undefined && (
              <span className="block w-full truncate">{col.header}</span>
            )}
            {sortConfig?.index === i &&
              (sortConfig.direction === 'asc' ? (
                <IconArrowUp size={16} className="flex-shrink-0" />
              ) : (
                <IconArrowDown size={16} className="flex-shrink-0" />
              ))}
          </div>
          <div
            className="absolute right-0 top-0 flex h-full w-2 cursor-col-resize items-center justify-center"
            onMouseDown={(e) => startResizing(i, e)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full w-[2px] bg-background" />
          </div>
        </div>
      ))}
    </div>
  );

  // Helper function to render the content of a row
  const renderRowContent = (ri: number, orig: T, disp: D) => {
    return (
      <>
        {onRowSelect && (
          <div className="flex items-center justify-center">
            <label
              className="flex h-full w-full cursor-pointer items-center justify-center px-4 py-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRowSelect(ri, e);
              }}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(orig)}
                readOnly
              />
            </label>
          </div>
        )}
        <div className="flex w-12 items-center justify-center px-4 py-2 text-sm">
          {ri + 1}
        </div>
        {cols.map((col, ci) => (
          <div
            key={ci}
            className={`relative box-border flex min-w-0 px-4 py-2 text-sm ${
              // Add bg-background if the cell is being edited
              editingCell?.row === ri && editingCell?.col === ci
                ? 'bg-background'
                : ''
            }`}
            onDoubleClick={() => handleDoubleClick(ri, ci)} // Handle double-click here
            style={{
              width: widths[ci] ?? MIN_COL_WIDTH,
            }}
            ref={(el) => {
              bodyRefs.current[ri] = bodyRefs.current[ri] || [];
              bodyRefs.current[ri][ci] = el;
            }}
          >
            {/* Absolutely positioned overlay (border or shadow) */}
            {editingCell?.row === ri && editingCell?.col === ci && (
              <div className="pointer-events-none absolute inset-0 z-10 rounded border-2 border-border" />
            )}

            <TableCell
              value={String(col.render(disp))}
              isEditing={
                col.editable !== false &&
                editingCell?.row === ri &&
                editingCell?.col === ci
              }
              onChange={(newValue) => handleCellChange(ri, ci, newValue)} // Trigger cell change
              onCancel={() => setEditingCell(null)}
              onBlur={() => setEditingCell(null)} // Add onBlur to exit edit mode
            />
          </div>
        ))}
      </>
    );
  };

  // Helper function to render the entire row
  const renderRowNode = (ri: number, orig: T, rowContent: JSX.Element) => {
    return (
      <div
        key={ri}
        className={`flex cursor-pointer border-b border-subtle ${
          hoveredRow === ri ? 'bg-subtle' : ''
        }`}
        onClick={(e) => {
          if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current); // it's a double-click, cancel single click
            clickTimeoutRef.current = null;
            return;
          }

          clickTimeoutRef.current = setTimeout(() => {
            onRowClick?.(e, orig); // now we know it's a real single click
            clickTimeoutRef.current = null;
          }, 200); // or 250 if you want a more generous threshold
        }}
        onMouseEnter={(e) => handleMouseEnterRow(ri, e)}
        onMouseLeave={handleMouseLeaveRow}
        onMouseMove={() => handleMouseMoveRow(ri)}
      >
        {rowContent}
      </div>
    );
  };

  // Main renderBody function
  const renderBody = () =>
    sortedPaired.map(({ orig, disp }, ri) => {
      const rowContent = renderRowContent(ri, orig, disp);
      const rowNode = renderRowNode(ri, orig, rowContent);

      // Only use wrapTooltip here to wrap with Tooltip if necessary
      if (asTooltip && !isMouseDown.current) {
        return (
          <Tooltip key={ri} content={asTooltip!(orig)}>
            {rowNode}
          </Tooltip>
        );
      }

      return rowNode;
    });

  const renderHover = () => {
    if (
      isMouseDown.current ||
      hoveredRow === null ||
      !hoverPosition ||
      !asActions
    )
      return null;
    const { orig } = sortedPaired[hoveredRow];
    return (
      <div
        ref={hoverRef}
        className="pointer-events-auto fixed z-10 -translate-y-1/2 transform bg-subtle"
        style={{
          top: `${hoverPosition.top}px`,
          right: `${hoverPosition.right}px`,
        }}
        onMouseEnter={() =>
          hideTimeout.current && window.clearTimeout(hideTimeout.current)
        }
        onMouseLeave={handleMouseLeaveRow}
      >
        {asActions(orig)}
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
    </div>
  );
}
