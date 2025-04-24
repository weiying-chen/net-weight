import React from 'react';
import { format } from 'date-fns';

export type MonthPickerProps = {
  /** Currently selected date (month+year) */
  value?: Date;
  /** Callback when a month is clicked */
  onChange?: (date: Date) => void;
  /** Controlled year to render */
  year: number;
  /** Custom formatter for month labels (e.g. 'Jan', '一月') */
  monthLabel?: (date: Date) => string;
};

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
  year,
  monthLabel,
}) => {
  // build one Date per month in the given year
  const months = Array.from({ length: 12 }).map(
    (_, idx) => new Date(year, idx, 1),
  );

  const handleMonthClick = (monthIndex: number) => {
    const selected = new Date(year, monthIndex, 1);
    onChange?.(selected);
  };

  return (
    <div className="w-72">
      <div className="grid grid-cols-3 gap-1 text-sm">
        {months.map((m, idx) => (
          <button
            key={idx}
            disabled={
              value != null &&
              (value.getMonth() !== idx || value.getFullYear() !== year)
            }
            onClick={() => handleMonthClick(idx)}
            className={`rounded py-1 transition ${
              value && value.getFullYear() === year && value.getMonth() === idx
                ? 'bg-primary text-white'
                : 'hover:bg-subtle'
            }`}
          >
            {monthLabel ? monthLabel(m) : format(m, 'MMM')}
          </button>
        ))}
      </div>
    </div>
  );
};
