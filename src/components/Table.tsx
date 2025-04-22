import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

const MIN_COL_WIDTH = 50;
const MAX_COL_WIDTH = 300;

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
  onRowClick?: (e: React.MouseEvent, item: T) => void;
  onRowSelect?: (sel: T[]) => void;
  asActions?: (item: T) => React.ReactNode;
  asTooltip?: (item: T) => React.ReactNode;
}) {
  // — state & refs —
  const [sortConfig, setSortConfig] = useState<{
    index: number;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const hideTimeout = useRef<number | null>(null);

  // this tracks any mouse-down (anywhere in the document)
  const isMouseDown = useRef(false);

  const [widths, setWidths] = useState<{ [i: number]: number }>({});
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // once on mount, toggle isMouseDown on any document mousedown/up
  useEffect(() => {
    const onDown = () => {
      isMouseDown.current = true;
      if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
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

  // — sorting logic (unchanged) —
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { index, direction } = sortConfig;
    const sa = String(cols[index].render(a) ?? '');
    const sb = String(cols[index].render(b) ?? '');
    if (sa === '[object Object]' || sb === '[object Object]') return 0;
    return sa < sb
      ? direction === 'asc'
        ? -1
        : 1
      : direction === 'asc'
        ? 1
        : -1;
  });
  const handleSort = (i: number) => {
    const sample = cols[i].render(data[0]);
    if (typeof sample === 'object' && sample !== null) return;
    const dir =
      sortConfig?.index === i && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    setSortConfig({ index: i, direction: dir });
  };

  // — hover logic: also bail if isMouseDown.current —
  const handleMouseEnterRow = (ri: number, e: React.MouseEvent) => {
    if (isMouseDown.current) return;
    if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
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
    if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
  };

  // — column resizing (unchanged) —
  const startResizing = (ci: number, e: React.MouseEvent) => {
    e.preventDefault();
    // global mousedown already flipped isMouseDown
    const startX = e.clientX;
    const startW = widths[ci] || MIN_COL_WIDTH;
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

  // — initial auto-size (include padding + divider) —
  useLayoutEffect(() => {
    if (!data.length) return;
    const newW: { [i: number]: number } = {};
    cols.forEach((_, i) => {
      const hdr = headerRefs.current[i]?.querySelector('span');
      const hW = hdr?.scrollWidth ?? MIN_COL_WIDTH;
      const bW = Math.max(
        ...bodyRefs.current.map((r) => {
          const s = r[i]?.querySelector('span');
          return s?.scrollWidth ?? MIN_COL_WIDTH;
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
  }, [data, cols]);

  // — row selection —
  const handleRowSelect = (ri: number) => {
    const itm = data[ri];
    const next = selectedItems.includes(itm)
      ? selectedItems.filter((x) => x !== itm)
      : [...selectedItems, itm];
    onRowSelect?.(next);
  };
  const setIndeterminateState = (el: HTMLInputElement | null) => {
    if (el)
      el.indeterminate =
        selectedItems.length > 0 && selectedItems.length < data.length;
  };
  const handleSelectAll = () => {
    onRowSelect?.(selectedItems.length === data.length ? [] : [...data]);
  };

  // — render header/body/hover —
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
                <IconArrowUp size={16} className="shrink-0" />
              ) : (
                <IconArrowDown size={16} className="shrink-0" />
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

  const renderBody = () =>
    sortedData.map((item, ri) => {
      const row = (
        <div
          key={ri}
          className={`flex cursor-pointer border-b border-subtle ${hoveredRow === ri ? 'bg-subtle' : ''}`}
          onClick={(e) => {
            console.log('Row clicked:', item);
            onRowClick?.(e, item);
          }}
          onMouseEnter={(e) => handleMouseEnterRow(ri, e)}
          onMouseLeave={handleMouseLeaveRow}
          onMouseMove={() => handleMouseMoveRow(ri)}
        >
          {onRowSelect && (
            <div className="flex items-center justify-center px-4 py-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => handleRowSelect(ri)}
              />
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
              <span className="block w-full truncate">{col.render(item)}</span>
            </div>
          ))}
        </div>
      );

      // ← key change: only wrap in Tooltip if mouse is up
      if (asTooltip && !isMouseDown.current) {
        return (
          <Tooltip key={ri} content={asTooltip(item)}>
            {row}
          </Tooltip>
        );
      }
      return row;
    });

  const renderHover = () => {
    if (
      isMouseDown.current ||
      hoveredRow === null ||
      !hoverPosition ||
      !asActions
    )
      return null;
    return (
      <div
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
    </div>
  );
}
