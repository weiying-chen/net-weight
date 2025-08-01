import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';
import { TableCell } from '@/components/TableCell';

export type TableCol<D> = {
  header?: string;
  render: (item: D) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: D) => string | number;
  width?: number;
  editable?: boolean;
  path?: string; // The path for nested fields (e.g., 'address.street')
};

const MIN_COL_WIDTH = 50;
const MAX_COL_WIDTH = 300;

type SortConfig = { index: number; direction: 'asc' | 'desc' } | null;

const updateNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.'); // Split the path string (e.g., 'address.street' -> ['address', 'street'])
  let current = obj;

  // Traverse the object using the keys and update the value
  keys.slice(0, -1).forEach((key) => {
    if (!current[key]) current[key] = {}; // Create missing nested objects if necessary
    current = current[key];
  });

  // Set the value at the final key
  current[keys[keys.length - 1]] = value;
};

export function Table<T, D extends object>({
  data: originalData,
  formatData,
  formatHeader,
  selectedData,
  cols,
  pinData,
  onRowClick,
  onRowSelect,
  onCellChange,
  asActions,
  asTooltip,
  editable = false,
  isLoading = false,
}: {
  data: T[];
  formatData?: (items: T[]) => D[];
  formatHeader?: (header: string) => string;
  selectedData: T[];
  cols: TableCol<D>[];
  pinData?: (item: T) => boolean;
  onRowClick?: (e: React.MouseEvent, item: T) => void;
  onRowSelect?: (sel: T[]) => void;
  onCellChange?: (rowIndex: number, colIndex: number, newValue: string) => void; // Define the prop type
  asActions?: (item: T) => React.ReactNode;
  asTooltip?: (item: T) => React.ReactNode;
  editable?: boolean; // Editable prop for the entire table
  isLoading?: boolean;
}) {
  const isCellEditable = (
    ri: number,
    ci: number,
    col: TableCol<D>,
    disp: D,
  ) => {
    return (
      editable && // Access directly from component props
      col.editable !== false &&
      editingCell?.row === ri &&
      editingCell?.col === ci &&
      typeof col.render(disp) === 'string' // Ensure the value is a string
    );
  };

  // const [localData, setLocalData] = useState<T[]>(
  //   JSON.parse(JSON.stringify(originalData)),
  // );

  const [localData, setLocalData] = useState<T[]>([]);

  useEffect(() => {
    setLocalData(originalData);
  }, [originalData]);

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
    const sortFn = (a: (typeof paired)[0], b: (typeof paired)[0]) => {
      if (!sortConfig) return 0;
      const { index, direction } = sortConfig;
      const col = cols[index];
      const sa = col.sortValue
        ? col.sortValue(a.disp)
        : String(col.render(a.disp) ?? '');
      const sb = col.sortValue
        ? col.sortValue(b.disp)
        : String(col.render(b.disp) ?? '');
      if (typeof sa !== 'string' && typeof sa !== 'number') return 0;
      if (typeof sb !== 'string' && typeof sb !== 'number') return 0;
      return direction === 'asc'
        ? sa < sb
          ? -1
          : sa > sb
            ? 1
            : 0
        : sa > sb
          ? -1
          : sa < sb
            ? 1
            : 0;
    };

    if (!pinData) return [...paired].sort(sortFn);

    const pinned = paired.filter(({ orig }) => pinData(orig));
    const others = paired.filter(({ orig }) => !pinData(orig));
    return [...pinned.sort(sortFn), ...others.sort(sortFn)];
  }, [paired, sortConfig, cols, pinData]);

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

    const isShiftClick =
      !!e && 'nativeEvent' in e && (e.nativeEvent as MouseEvent).shiftKey;

    if (isShiftClick && lastClickedIndex !== null) {
      const rangeStart = Math.min(lastClickedIndex, ri);
      const rangeEnd = Math.max(lastClickedIndex, ri);
      const rangeItems = sortedPaired
        .slice(rangeStart, rangeEnd + 1)
        .map((p) => p.orig);

      const selectedSet = new Set(selectedData);
      const shouldSelect = !rangeItems.every((item) => selectedSet.has(item));

      const next = shouldSelect
        ? [...selectedData, ...rangeItems.filter((i) => !selectedSet.has(i))]
        : selectedData.filter((item) => !rangeItems.includes(item));

      onRowSelect?.(next);
    } else {
      // Normal toggle
      const next = selectedData.includes(orig)
        ? selectedData.filter((x) => x !== orig)
        : [...selectedData, orig];

      setLastClickedIndex(ri);
      onRowSelect?.(next);
    }
  };

  const setIndeterminateState = (el: HTMLInputElement | null) => {
    if (!el) return;
    el.indeterminate =
      selectedData.length > 0 && selectedData.length < originalData.length;
  };
  const handleSelectAll = () => {
    onRowSelect?.(
      selectedData.length === originalData.length ? [] : [...originalData],
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

    // Check if the column header and path are defined
    if (col.header === undefined || col.path === undefined) {
      console.error(`Column header or path is undefined for column ${ci}`);
      return;
    }

    const flatField = col.header; // Flattened field (e.g., 'address_street')
    const path = col.path; // Path to the nested field (e.g., 'address.street')

    // Copy the data to avoid mutating the original state
    const updatedData = [...localData];

    // Update the flattened data first
    updatedData[ri] = { ...updatedData[ri], [flatField]: newValue };

    // Now update the nested data using the path
    const updatedRow = updatedData[ri];
    updateNestedValue(updatedRow, path, newValue);

    // Update the local state with the modified data
    setLocalData(updatedData);

    // Notify parent if needed
    if (onCellChange) {
      onCellChange(ri, ci, newValue);
    }
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

  const prevCols = useRef<TableCol<D>[]>([]); // Ref to track previous cols

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
                selectedData.length === originalData.length
              }
              onChange={handleSelectAll}
              className="custom-checkbox pointer-events-none"
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
              htmlFor={`checkbox-body-${ri}`}
              className="flex h-full w-full cursor-pointer items-center justify-center px-4 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                id={`checkbox-body-${ri}`}
                type="checkbox"
                checked={selectedData.includes(orig)}
                onChange={(e) => handleRowSelect(ri, e)}
                className="custom-checkbox pointer-events-auto"
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
              isCellEditable(ri, ci, col, disp) ? 'bg-background' : ''
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
            {isCellEditable(ri, ci, col, disp) && (
              <div className="pointer-events-none absolute inset-0 z-10 rounded border border-border" />
            )}
            <TableCell
              value={col.render(disp)} // Pass raw value from render() without forcing string conversion
              isEditing={isCellEditable(ri, ci, col, disp)}
              onChange={(newValue) => handleCellChange(ri, ci, newValue)}
              onCancel={() => setEditingCell(null)}
              onBlur={() => setEditingCell(null)}
            />
          </div>
        ))}
      </>
    );
  };

  // Helper function to render the entire row
  const renderRowNode = (ri: number, orig: T, rowContent: ReactNode) => {
    return (
      <div
        key={ri}
        className={`flex cursor-pointer border-b border-subtle ${
          hoveredRow === ri ? 'bg-subtle' : ''
        }`}
        onClick={(e) => {
          if (editingCell && editingCell.row === ri) return;

          if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            return;
          }

          clickTimeoutRef.current = setTimeout(() => {
            onRowClick?.(e, orig);
            clickTimeoutRef.current = null;
          }, 200);
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
    <div
      ref={containerRef}
      className={`relative w-full overflow-x-auto ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
    >
      <div className="min-w-max">
        {renderHeader()}
        {renderBody()}
      </div>
      {renderHover()}
    </div>
  );
}
