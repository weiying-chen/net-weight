import React, { useState } from 'react';

type Cols<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

export function Table2<T>({ data, cols }: { data: T[]; cols: Cols<T>[] }) {
  const [widths, setWidths] = useState<{ [index: number]: number }>(
    () => Object.fromEntries(cols.map((_, index) => [index, 100])), // Default widths
  );

  const startResizing = (index: number, event: React.MouseEvent) => {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = widths[index] || 100;

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

  return (
    <div className="relative w-full overflow-x-auto">
      {/* Header */}
      <div className="flex border-b border-gray-300 bg-subtle">
        {cols.map((column, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 border-r border-gray-300 px-4 py-2 text-left"
            style={{ width: `${widths[index] || 100}px` }}
          >
            <div className="text-sm font-semibold">{column.header}</div>
            {/* Visible Resize Handle: Only render if not the last column */}
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
        {data.map((item, rowIndex) => (
          <div key={rowIndex} className="flex border-b border-gray-300">
            {cols.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex-shrink-0 px-4 py-2 text-sm"
                style={{ width: `${widths[colIndex] || 100}px` }}
              >
                {column.render(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
