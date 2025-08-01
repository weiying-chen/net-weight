'use client';

import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from 'react';
import { parse, isValid, format } from 'date-fns';
import {
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { Input } from '@/components/Input';
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

  const [inputValue, setInputValue] = useState<string>(
    externalValue
      ? valueLabel
        ? valueLabel(externalValue)
        : format(externalValue, 'yyyy-MM-dd')
      : '',
  );

  const [viewDate, setViewDate] = useState<Date>(externalValue || new Date());

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLInputElement>(null);
  const skipNextOutsideClick = useRef(false);

  useEffect(() => {
    setSelectedDate(externalValue);
    if (externalValue) {
      const formatted = valueLabel
        ? valueLabel(externalValue)
        : format(externalValue, 'yyyy-MM-dd');
      setInputValue(formatted);
      setViewDate(externalValue);
    }
  }, [externalValue, valueLabel]);

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

  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
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

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
    const formatted = valueLabel
      ? valueLabel(date)
      : format(date, 'yyyy-MM-dd');
    setInputValue(formatted);
    onChange?.(date);
    setIsOpen(false);
    setViewMode('day');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = (_: FocusEvent<HTMLInputElement>) => {
    if (!inputValue) return;

    const parsed = parse(inputValue, 'yyyy-MM-dd', new Date());

    if (isValid(parsed)) {
      const iso = format(parsed, 'yyyy-MM-dd');
      setInputValue(iso);
      setSelectedDate(parsed);
      setViewDate(parsed);
      onChange?.(parsed);
    } else {
      if (selectedDate) {
        setInputValue(format(selectedDate, 'yyyy-MM-dd'));
      } else {
        setInputValue('');
      }
    }
  };

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

  const renderPicker = () => (
    <div
      ref={dropdownRef}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-50 rounded border border-border bg-background p-3 shadow',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        horizontalPosition === 'right' ? 'right-0' : 'left-0',
      )}
    >
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

      <div className="relative w-full">
        <Input
          ref={triggerRef}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={error}
          rightSection={
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  skipNextOutsideClick.current = true;
                  setIsOpen((o) => !o);
                }
              }}
              className={cn(
                'flex items-center',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <IconCalendarMonth size={20} />
            </button>
          }
        />

        {isOpen && renderPicker()}
      </div>
    </Col>
  );
};
