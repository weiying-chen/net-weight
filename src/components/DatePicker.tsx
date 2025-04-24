import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  ReactNode,
} from 'react';
import { format } from 'date-fns';
import {
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { DayPicker } from '@/components/DayPicker';
import { MonthPicker } from '@/components/MonthPicker';

export type DatePickerProps = {
  label?: ReactNode;
  value?: Date;
  onChange?: (value: Date) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  small?: boolean;
  monthLabel?: (date: Date) => string;
  weekdayLabel?: (weekday: string, index: number) => string;
  valueLabel?: (date: Date) => string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value: externalValue,
  onChange,
  placeholder = 'Select a date',
  error,
  className,
  required,
  disabled,
  small = false,
  monthLabel,
  weekdayLabel,
  valueLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const [horizontalPosition, setHorizontalPosition] = useState<
    'left' | 'right'
  >('left');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    externalValue,
  );
  const [viewDate, setViewDate] = useState<Date>(externalValue || new Date());

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(externalValue);
    if (externalValue) setViewDate(externalValue);
  }, [externalValue]);

  const adjustDropdownPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dd = dropdownRef.current;
    const ddH = dd.scrollHeight;
    const ddW = dd.scrollWidth;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setDropdownPosition(rect.bottom + ddH > vh ? 'top' : 'bottom');
    const spaceRight = vw - rect.right;
    const spaceLeft = rect.left;
    if (spaceRight >= ddW && spaceRight >= spaceLeft) {
      setHorizontalPosition('left');
    } else if (spaceLeft >= ddW) {
      setHorizontalPosition('right');
    } else {
      setHorizontalPosition(spaceRight < spaceLeft ? 'right' : 'left');
    }
  };

  useLayoutEffect(() => {
    if (isOpen) adjustDropdownPosition();
  }, [isOpen]);

  useLayoutEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setViewMode('day');
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
    onChange?.(date);
    setIsOpen(false);
    setViewMode('day');
  };

  const goPrev = () => {
    if (viewMode === 'day') {
      const y = viewDate.getFullYear();
      const m = viewDate.getMonth();
      setViewDate(new Date(y, m - 1, 1));
    } else {
      setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    }
  };
  const goNext = () => {
    if (viewMode === 'day') {
      const y = viewDate.getFullYear();
      const m = viewDate.getMonth();
      setViewDate(new Date(y, m + 1, 1));
    } else {
      setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
    }
  };

  const renderPicker = () => (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-10 rounded border border-border bg-background p-3 shadow',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        horizontalPosition === 'right' ? 'right-0' : 'left-0',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">
            {monthLabel
              ? monthLabel(viewDate)
              : format(viewDate, viewMode === 'day' ? 'MMMM yyyy' : 'yyyy')}
          </span>
          <button onClick={goPrev} className="rounded p-1 hover:bg-subtle">
            <IconChevronLeft size={20} />
          </button>
          <button onClick={goNext} className="rounded p-1 hover:bg-subtle">
            <IconChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={cn('rounded px-2 py-1 text-xs', {
              'bg-primary text-white': viewMode === 'day',
              'hover:bg-subtle': viewMode !== 'day',
            })}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
          <button
            className={cn('rounded px-2 py-1 text-xs', {
              'bg-primary text-white': viewMode === 'month',
              'hover:bg-subtle': viewMode !== 'month',
            })}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
        </div>
      </div>
      <div className="mb-2 h-px w-full bg-border" />
      {viewMode === 'day' ? (
        <DayPicker
          value={selectedDate}
          label={weekdayLabel}
          onChange={handleSelect}
          viewDate={viewDate}
        />
      ) : (
        <MonthPicker
          value={selectedDate}
          label={monthLabel}
          onChange={handleSelect}
          viewDate={viewDate.getFullYear()}
        />
      )}
    </div>
  );

  return (
    <Col className={cn('relative', className)}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        ) : (
          label
        ))}
      <div
        ref={triggerRef}
        className="relative w-full"
        onClick={() => !disabled && setIsOpen((o) => !o)}
      >
        <PseudoInput
          tabIndex={0}
          error={error}
          disabled={disabled}
          className={cn('cursor-pointer justify-between shadow', {
            'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
            'hover:shadow-dark': !disabled,
            'h-6 px-2 py-1 text-xs': small,
          })}
        >
          {selectedDate
            ? valueLabel
              ? valueLabel(selectedDate)
              : selectedDate.toLocaleDateString()
            : placeholder}
          <IconCalendarMonth size={20} />
        </PseudoInput>
        {isOpen && renderPicker()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
