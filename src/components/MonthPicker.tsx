import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Heading } from '@/components/Heading';

export type MonthPickerProps = {
  /** Currently selected date (month+year) */
  value?: Date;
  /** Callback when a month is clicked */
  onChange?: (date: Date) => void;
  /** Controlled year, if you want to override internal state */
  year?: number;
  /** Callback when the year changes (via nav arrows) */
  onYearChange?: (year: number) => void;
  /** Custom formatter for month labels (e.g. 'Jan', '一月') */
  monthLabel?: (date: Date) => string;
};

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
  year: externalYear,
  onYearChange,
  monthLabel,
}) => {
  // Determine initial year: controlled via prop or inferred from value or fallback to current year
  const initialYear =
    externalYear ?? value?.getFullYear() ?? new Date().getFullYear();
  const [year, setYear] = useState<number>(initialYear);

  // Sync with controlled year prop
  useEffect(() => {
    if (externalYear !== undefined && externalYear !== year) {
      setYear(externalYear);
    }
  }, [externalYear]);

  // Navigate years
  const handlePrevYear = () => {
    const newYear = year - 1;
    setYear(newYear);
    onYearChange?.(newYear);
  };

  const handleNextYear = () => {
    const newYear = year + 1;
    setYear(newYear);
    onYearChange?.(newYear);
  };

  // Month buttons
  const months = Array.from({ length: 12 }).map(
    (_, idx) => new Date(year, idx, 1),
  );

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(year, monthIndex, 1);
    onChange?.(newDate);
  };

  return (
    <div className="w-72">
      {/* Header: Year label and nav arrows */}
      <div className="mb-2 flex items-center justify-between">
        <Heading>{year}</Heading>
        <div className="flex gap-1">
          <button
            className="rounded p-1 text-muted hover:bg-subtle"
            onClick={handlePrevYear}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            className="rounded p-1 text-muted hover:bg-subtle"
            onClick={handleNextYear}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Divider for symmetry with DayPicker */}
      <div className="mb-2 h-px w-full bg-border" />

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-1 text-sm">
        {months.map((m, idx) => (
          <button
            key={idx}
            className="rounded py-1 hover:bg-subtle"
            onClick={() => handleMonthClick(idx)}
          >
            {monthLabel ? monthLabel(m) : format(m, 'MMM')}
          </button>
        ))}
      </div>
    </div>
  );
};
