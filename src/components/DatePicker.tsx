// components/DatePicker.tsx
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
  headerLabel?: (date: Date, mode: 'day' | 'month') => string;
  monthLabel?: (date: Date) => string;
  weekdayLabel?: (weekday: string, index: number) => string;
  valueLabel?: (date: Date) => string;
  viewModeLabels?: { day: string; month: string };
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
  headerLabel,
  monthLabel,
  weekdayLabel,
  valueLabel,
  viewModeLabels,
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
  // this flag lets us ignore exactly one outside click after month→day switch
  const skipNextOutsideClick = useRef(false);

  // sync external value
  useEffect(() => {
    setSelectedDate(externalValue);
    if (externalValue) setViewDate(externalValue);
  }, [externalValue]);

  // position adjustment
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

  // outside-click listener (click phase)
  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      // swallow exactly one if flagged
      if (skipNextOutsideClick.current) {
        skipNextOutsideClick.current = false;
        return;
      }
      if (
        !dropdownRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setViewMode('day');
      }
    };
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, []);

  // day select
  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
    onChange?.(date);
    setIsOpen(false);
    setViewMode('day');
  };

  // nav
  const goPrev = () => {
    if (viewMode === 'day') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    } else {
      setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    }
  };
  const goNext = () => {
    if (viewMode === 'day') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    } else {
      setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
    }
  };

  // render dropdown
  const renderPicker = () => (
    <div
      ref={dropdownRef}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-10 rounded border border-border bg-background p-3 shadow',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        horizontalPosition === 'right' ? 'right-0' : 'left-0',
      )}
    >
      {/* header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">
            {headerLabel
              ? headerLabel(viewDate, viewMode)
              : format(viewDate, viewMode === 'day' ? 'MMMM yyyy' : 'yyyy')}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              className="rounded p-1 hover:bg-subtle"
            >
              <IconChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded p-1 hover:bg-subtle"
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={cn('rounded px-2 py-1 text-xs', {
              'bg-primary text-white': viewMode === 'day',
              'hover:bg-subtle': viewMode !== 'day',
            })}
          >
            {viewModeLabels?.day ?? 'Day'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={cn('rounded px-2 py-1 text-xs', {
              'bg-primary text-white': viewMode === 'month',
              'hover:bg-subtle': viewMode !== 'month',
            })}
          >
            {viewModeLabels?.month ?? 'Month'}
          </button>
        </div>
      </div>

      <div className="mb-2 h-px w-full bg-border" />

      {/* body */}
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
          monthLabel={monthLabel}
          viewDate={viewDate.getFullYear()}
          onChange={(date) => {
            // flag to skip the next outside click
            skipNextOutsideClick.current = true;
            setViewDate(date);
            setViewMode('day');
          }}
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
          <span className={cn(!selectedDate && 'text-muted')}>
            {selectedDate
              ? valueLabel
                ? valueLabel(selectedDate)
                : selectedDate.toLocaleDateString()
              : placeholder}
          </span>
          <IconCalendarMonth size={20} />
        </PseudoInput>

        {isOpen && renderPicker()}
      </div>

      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
