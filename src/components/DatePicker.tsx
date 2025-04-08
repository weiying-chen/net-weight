import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { DayPicker } from 'react-day-picker';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconCalendarMonth } from '@tabler/icons-react';

export type DatePickerProps = {
  label?: ReactNode;
  value?: Date; // Optional external control
  onChange?: (value: Date) => void; // Notify parent on change
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  small?: boolean;
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
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const [horizontalPosition, setHorizontalPosition] = useState<
    'left' | 'right'
  >('left');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    externalValue,
  );
  const [displayedMonth, setDisplayedMonth] = useState(
    externalValue || new Date(),
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const adjustDropdownPosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.scrollHeight;
      const dropdownWidth = dropdownRef.current.scrollWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Vertical positioning: flip if not enough space below trigger.
      const shouldFlipVertically =
        triggerRect.bottom + dropdownHeight > viewportHeight;
      setDropdownPosition(shouldFlipVertically ? 'top' : 'bottom');

      // Horizontal positioning:
      // Calculate available space on each side of the trigger.
      const spaceOnRight = viewportWidth - triggerRect.right;
      const spaceOnLeft = triggerRect.left;

      // Check if either side can fully accommodate the dropdown's width.
      if (spaceOnRight >= dropdownWidth && spaceOnRight >= spaceOnLeft) {
        // There is enough space on the right.
        setHorizontalPosition('left'); // align dropdown's left edge with trigger's left.
      } else if (spaceOnLeft >= dropdownWidth) {
        // There is enough space on the left.
        setHorizontalPosition('right'); // align dropdown's right edge with trigger's right.
      } else {
        // Neither side can fully display the dropdown.
        // Choose the side with the most available space.
        setHorizontalPosition(spaceOnRight < spaceOnLeft ? 'right' : 'left');
      }
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      adjustDropdownPosition();
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Update internal state when external value changes.
  useLayoutEffect(() => {
    setSelectedDate(externalValue);
    setDisplayedMonth(externalValue || new Date());
  }, [externalValue]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const renderDayPicker = () => (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-10 rounded border border-border bg-background p-3 shadow',
        // Vertical alignment: show above or below trigger.
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        // Horizontal alignment: position based on computed side.
        horizontalPosition === 'right' ? 'right-0' : 'left-0',
      )}
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        month={displayedMonth}
        onMonthChange={setDisplayedMonth}
        showOutsideDays
        onSelect={(date) => date && handleSelectDate(date)}
        classNames={{
          root: 'rdp-root',
          months: 'rdp-months',
          month: 'rdp-month',
          caption:
            'rdp-caption flex justify-between items-center mb-2 border-b pb-2 border-border',
          caption_label: 'rdp-caption-label text-lg font-semibold',
          nav: 'rdp-nav flex items-center gap-2',
          table: 'rdp-table',
          head: 'rdp-head',
          head_row: 'rdp-head_row',
          head_cell: 'rdp-head_cell text-sm font-medium',
          row: 'rdp-row',
          cell: 'rdp-cell',
          day: 'rdp-day text-center w-10 h-10 p-2 rounded hover:shadow',
          day_selected: 'bg-primary text-background',
          day_today: 'bg-subtle',
          day_outside: 'text-muted',
        }}
      />
    </div>
  );

  return (
    <Col className={cn('relative', className)}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger"> *</span>}
          </label>
        ) : (
          label
        ))}
      <div
        ref={triggerRef}
        className="relative w-full"
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
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
          {selectedDate ? selectedDate.toLocaleDateString() : placeholder}
          <IconCalendarMonth size={20} />
        </PseudoInput>
        {isOpen && renderDayPicker()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
