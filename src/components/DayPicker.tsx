import { useState } from 'react';
import { format, isToday } from 'date-fns';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Heading } from '@/components/Heading';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

type CalendarDay = {
  year: number;
  month: number;
  dayNumber: number;
  isCurrentMonth: boolean;
};

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const TOTAL_CELLS = 42; // 6 rows × 7 columns
  const daysInCurrent = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  // Compute previous month values.
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);

  // Compute next month values.
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const calendarDays: CalendarDay[] = [];

  for (let i = 0; i < TOTAL_CELLS; i++) {
    const dayIndex = i - startDay; // offset relative to current month's first day
    let dayNumber: number;
    let itemYear: number;
    let itemMonth: number;
    let isCurrentMonth = true;

    if (i < startDay) {
      // Days from previous month.
      dayNumber = daysInPrev - (startDay - 1 - i);
      itemYear = prevYear;
      itemMonth = prevMonth;
      isCurrentMonth = false;
    } else if (dayIndex >= daysInCurrent) {
      // Days from next month.
      dayNumber = dayIndex - daysInCurrent + 1;
      itemYear = nextYear;
      itemMonth = nextMonth;
      isCurrentMonth = false;
    } else {
      // Current month.
      dayNumber = dayIndex + 1;
      itemYear = year;
      itemMonth = month;
    }

    calendarDays.push({
      year: itemYear,
      month: itemMonth,
      dayNumber,
      isCurrentMonth,
    });
  }
  return calendarDays;
}

type DayPickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
};

export function DayPicker({ value, onChange }: DayPickerProps) {
  const today = new Date();
  const initialDate = value ?? today;

  // Store the full selected Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());

  // Build a fixed 42-cell grid for the calendar.
  const calendarDays = buildCalendarDays(year, month);

  const handleDayClick = (dayNumber: number) => {
    const newDate = new Date(year, month, dayNumber);
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    // Let selectedDate remain (if it falls in the new month, it'll show highlighted)
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    // Let selectedDate remain
  };

  return (
    // Removed explicit border, padding, and shadow. You can wrap this div or apply your own styles.
    <div className="w-72">
      {/* Header: Month label on left, navigation arrows on right */}
      <div className="mb-2 flex items-center justify-between">
        <Heading>{format(new Date(year, month), 'MMMM yyyy')}</Heading>
        <div className="flex gap-1">
          <button
            className="rounded p-1 text-muted hover:bg-subtle"
            onClick={goToPreviousMonth}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            className="rounded p-1 text-muted hover:bg-subtle"
            onClick={goToNextMonth}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Divider: Remove if you wish */}
      <div className="mb-2 h-px w-full bg-border" />

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs text-muted">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {calendarDays.map(
          ({ year: y, month: m, dayNumber, isCurrentMonth }, i) => {
            const cellDate = new Date(y, m, dayNumber);
            const isSelected =
              isCurrentMonth &&
              selectedDate !== null &&
              selectedDate.getFullYear() === y &&
              selectedDate.getMonth() === m &&
              selectedDate.getDate() === dayNumber;
            const isTodayDate = isToday(cellDate);

            const baseClass = isCurrentMonth
              ? isSelected
                ? 'bg-primary text-white'
                : isTodayDate
                  ? 'bg-subtle text-foreground'
                  : 'text-foreground hover:bg-subtle'
              : 'cursor-default select-none text-muted';

            return (
              <button
                key={i}
                disabled={!isCurrentMonth}
                onClick={() => isCurrentMonth && handleDayClick(dayNumber)}
                className={`rounded p-2 text-center transition ${baseClass}`}
              >
                {dayNumber}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
