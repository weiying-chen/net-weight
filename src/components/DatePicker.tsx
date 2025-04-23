import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconCalendarMonth } from '@tabler/icons-react';
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

export const DatePicker = ({
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
}: DatePickerProps) => {
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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const adjustDropdownPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dd = dropdownRef.current;
    const ddH = dd.scrollHeight;
    const ddW = dd.scrollWidth;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // vertical
    setDropdownPosition(rect.bottom + ddH > vh ? 'top' : 'bottom');
    // horizontal
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

  useLayoutEffect(() => {
    setSelectedDate(externalValue);
  }, [externalValue]);

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
    setViewMode('day');
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
      {/* Mode toggle */}
      <div className="mb-2 flex justify-end space-x-2">
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

      {viewMode === 'day' ? (
        <DayPicker
          value={selectedDate}
          onChange={handleSelect}
          monthLabel={monthLabel}
          weekdayLabel={weekdayLabel}
        />
      ) : (
        <MonthPicker
          value={selectedDate}
          onChange={handleSelect}
          year={selectedDate?.getFullYear()}
          onYearChange={(y) =>
            setSelectedDate(new Date(y, selectedDate?.getMonth() ?? 0, 1))
          }
          monthLabel={monthLabel}
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
