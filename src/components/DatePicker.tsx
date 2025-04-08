import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconCalendarMonth } from '@tabler/icons-react';
// Import your custom DayPicker component.
import { DayPicker } from '@/components/DayPicker';

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
  // Our custom DayPicker manages its own month navigation so we no longer need a separate displayedMonth state.

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const adjustDropdownPosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.scrollHeight;
      const dropdownWidth = dropdownRef.current.scrollWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Flip vertical if not enough room.
      const shouldFlipVertically =
        triggerRect.bottom + dropdownHeight > viewportHeight;
      setDropdownPosition(shouldFlipVertically ? 'top' : 'bottom');

      // Horizontal positioning.
      const spaceOnRight = viewportWidth - triggerRect.right;
      const spaceOnLeft = triggerRect.left;
      if (spaceOnRight >= dropdownWidth && spaceOnRight >= spaceOnLeft) {
        setHorizontalPosition('left');
      } else if (spaceOnLeft >= dropdownWidth) {
        setHorizontalPosition('right');
      } else {
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
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // When an external value changes, update our internal selectedDate.
  useLayoutEffect(() => {
    setSelectedDate(externalValue);
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
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        horizontalPosition === 'right' ? 'right-0' : 'left-0',
      )}
    >
      <DayPicker value={selectedDate} onChange={handleSelectDate} />
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
          if (!disabled) setIsOpen((prev) => !prev);
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
