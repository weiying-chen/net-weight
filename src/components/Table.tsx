import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';

type Cols<D> = {
  header: string;
  render: (item: D) => React.ReactNode;
};

const MIN_COL_WIDTH = 50;
const MAX_COL_WIDTH = 300;

type SortConfig = { index: number; direction: 'asc' | 'desc' } | null;

export function Table<T, D extends object>({
  data: originalData,
  formatData,
  selectedItems,
  cols,
  onRowClick,
  onRowSelect,
  asActions,
  asTooltip,
}: {
  data: T[];
  formatData?: (items: T[]) => D[];
  selectedItems: T[];
  cols: Cols<D>[];
  onRowClick?: (e: React.MouseEvent, item: T) => void;
  onRowSelect?: (sel: T[]) => void;
  asActions?: (item: T) => React.ReactNode;
  asTooltip?: (item: T) => React.ReactNode;
}) {
  // Pair originals with display copies
  const paired = useMemo(() => {
    const dispArr = formatData
      ? formatData(originalData)
      : (originalData as unknown as D[]);
    return dispArr.map((disp, i) => ({ orig: originalData[i], disp }));
  }, [originalData, formatData]);

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

  // Sort logic
  const sortedPaired = useMemo(() => {
    if (!sortConfig) return paired;
    const { index, direction } = sortConfig;
    return [...paired].sort((a, b) => {
      const sa = String(cols[index].render(a.disp) ?? '');
      const sb = String(cols[index].render(b.disp) ?? '');
      if (sa === '[object Object]' || sb === '[object Object]') return 0;
      if (direction === 'asc') return sa < sb ? -1 : sa > sb ? 1 : 0;
      return sa > sb ? -1 : sa < sb ? 1 : 0;
    });
  }, [paired, sortConfig, cols]);

  // GLOBAL MOUSE HANDLERS (for hover popover), but IGNORE clicks INSIDE the table
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      // If cursor is in the hover-actions popover, ignore
      if (hoverRef.current?.contains(e.target as Node)) return;
      // *** NEW: ignore any mousedown that starts inside our table container ***
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

  // Header click → sort
  const handleSort = (ci: number) => {
    const sample = cols[ci].render(paired[0]?.disp);
    if (typeof sample === 'object' && sample !== null) return;
    const dir =
      sortConfig?.index === ci && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    setSortConfig({ index: ci, direction: dir });
  };

  // Hover row
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

  // Column resizing
  const startResizing = (ci: number, e: React.MouseEvent) => {
    e.preventDefault();
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

  // Auto-calc widths
  useLayoutEffect(() => {
    if (!sortedPaired.length) return;
    const newW: { [i: number]: number } = {};
    cols.forEach((_, i) => {
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
  }, [cols]);

  // Row selection
  const handleRowSelect = (ri: number) => {
    const { orig } = sortedPaired[ri];
    const next = selectedItems.includes(orig)
      ? selectedItems.filter((x) => x !== orig)
      : [...selectedItems, orig];
    onRowSelect?.(next);
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

  // HEADER RENDER
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
      {cols.map((col, i) => (
        <div
          key={i}
          className="relative flex min-w-0 px-4 py-2 text-left"
          style={{ width: widths[i] ?? MIN_COL_WIDTH }}
          ref={(el) => (headerRefs.current[i] = el)}
        >
          <div
            className="flex min-w-0 cursor-pointer items-center gap-2 text-sm font-semibold"
            onClick={() => handleSort(i)}
          >
            <span className="block w-full truncate">{col.header}</span>
            {sortConfig?.index === i &&
              (sortConfig.direction === 'asc' ? (
                <IconArrowUp size={16} />
              ) : (
                <IconArrowDown size={16} />
              ))}
          </div>
          <div
            className="absolute right-0 top-0 flex h-full w-2 cursor-col-resize items-center justify-center"
            onMouseDown={(e) => startResizing(i, e)}
          >
            <div className="h-full w-[2px] bg-background" />
          </div>
        </div>
      ))}
    </div>
  );

  // BODY RENDER
  const renderBody = () =>
    sortedPaired.map(({ orig, disp }, ri) => {
      const wrapTooltip = !!(asTooltip && !isMouseDown.current);
      const rowContent = (
        <>
          {onRowSelect && (
            <div className="flex items-center justify-center">
              <label
                className="flex h-full w-full cursor-pointer items-center justify-center px-4 py-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(orig)}
                  onChange={() => handleRowSelect(ri)}
                  className="pointer-events-none"
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
              className="flex min-w-0 px-4 py-2 text-sm"
              style={{ width: widths[ci] ?? MIN_COL_WIDTH }}
              ref={(el) => {
                bodyRefs.current[ri] = bodyRefs.current[ri] || [];
                bodyRefs.current[ri][ci] = el;
              }}
            >
              <span className="block w-full truncate">{col.render(disp)}</span>
            </div>
          ))}
        </>
      );

      const rowNode = (
        <div
          key={ri}
          className={`flex cursor-pointer border-b border-subtle ${
            hoveredRow === ri ? 'bg-subtle' : ''
          }`}
          onClick={(e) => onRowClick?.(e, orig)}
          onMouseEnter={(e) => handleMouseEnterRow(ri, e)}
          onMouseLeave={handleMouseLeaveRow}
          onMouseMove={() => handleMouseMoveRow(ri)}
        >
          {rowContent}
        </div>
      );

      if (wrapTooltip) {
        return (
          <Tooltip key={ri} content={asTooltip!(orig)} maxWidth="280px">
            {rowNode}
          </Tooltip>
        );
      }
      return rowNode;
    });

  // HOVER ACTIONS
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
