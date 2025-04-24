import React from 'react';
import { format } from 'date-fns';

export type MonthPickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  viewDate: number;
  label?: (date: Date) => string;
};

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
  viewDate,
  label,
}) => {
  const months = Array.from({ length: 12 }).map(
    (_, idx) => new Date(viewDate, idx, 1),
  );

  const handleMonthClick = (monthIndex: number) => {
    const selected = new Date(viewDate, monthIndex, 1);
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
              (value.getMonth() !== idx || value.getFullYear() !== viewDate)
            }
            onClick={() => handleMonthClick(idx)}
            className={`rounded py-1 transition ${
              value &&
              value.getFullYear() === viewDate &&
              value.getMonth() === idx
                ? 'bg-primary text-white'
                : 'hover:bg-subtle'
            }`}
          >
            {label ? label(m) : format(m, 'MMM')}
          </button>
        ))}
      </div>
    </div>
  );
};
