import { isToday } from 'date-fns';

export type CalendarDay = {
  year: number;
  month: number;
  dayNumber: number;
  isCurrentMonth: boolean;
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const TOTAL_CELLS = 42;
  const daysInCurrent = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const days: CalendarDay[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const offset = i - startDay;
    let dayNumber: number;
    let itemYear: number;
    let itemMonth: number;
    let isCurrentMonth = true;

    if (i < startDay) {
      dayNumber = daysInPrev - (startDay - 1 - i);
      itemYear = prevYear;
      itemMonth = prevMonth;
      isCurrentMonth = false;
    } else if (offset >= daysInCurrent) {
      dayNumber = offset - daysInCurrent + 1;
      itemYear = nextYear;
      itemMonth = nextMonth;
      isCurrentMonth = false;
    } else {
      dayNumber = offset + 1;
      itemYear = year;
      itemMonth = month;
    }

    days.push({ year: itemYear, month: itemMonth, dayNumber, isCurrentMonth });
  }

  return days;
}

export type DayPickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: (label: string, index: number) => string;
  viewDate: Date;
};

export function DayPicker({
  value,
  onChange,
  label,
  viewDate,
}: DayPickerProps) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const calendarDays = buildCalendarDays(year, month);

  const defaultWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="w-72">
      <div className="mb-1 grid grid-cols-7 text-center text-xs text-muted">
        {defaultWeekdays.map((wd, i) => (
          <div key={i}>{label ? label(wd, i) : wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {calendarDays.map(
          ({ year: y, month: m, dayNumber, isCurrentMonth }, i) => {
            const cellDate = new Date(y, m, dayNumber);
            const isSelected =
              isCurrentMonth &&
              value != null &&
              value.getFullYear() === y &&
              value.getMonth() === m &&
              value.getDate() === dayNumber;
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
                type="button"
                disabled={!isCurrentMonth}
                onClick={() => isCurrentMonth && onChange?.(cellDate)}
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
