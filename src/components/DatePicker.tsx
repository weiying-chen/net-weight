import { useState, useRef, useLayoutEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

export type DatePickerProps = {
  label?: string;
  value?: Date;
  onChange: (value: Date) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  small?: boolean;
};

export const DatePicker = ({
  label,
  value,
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

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const adjustDropdownPosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;

      const shouldFlip = triggerRect.bottom + dropdownHeight > viewportHeight;
      setDropdownPosition(shouldFlip ? 'top' : 'bottom');
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

  const renderDayPicker = () => (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-10',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        'w-full rounded-md border border-border bg-background p-3 shadow',
      )}
    >
      <DayPicker
        mode="single"
        selected={value}
        onSelect={(date) => {
          const parsedDate = typeof date === 'string' ? new Date(date) : date;
          if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
            onChange(parsedDate);
          }
        }}
        classNames={{
          day: 'p-2 rounded hover:bg-gray-200', // Tailwind class for each day
          day_selected: 'bg-blue-500 text-white hover:bg-blue-600', // Highlight selected day
          nav_button: 'text-gray-500 hover:text-blue-500', // Navigation buttons
          // month: 'bg-gray-50 p-4 rounded-md shadow', // Calendar container
        }}
      />
    </div>
  );

  return (
    <Col className={cn('relative', className)}>
      {label && (
        <label className="text-sm font-semibold">
          {label} {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <div
        ref={triggerRef}
        className="relative w-full"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        tabIndex={0}
      >
        <PseudoInput
          tabIndex={0}
          error={error}
          disabled={disabled}
          className={cn(
            'cursor-pointer justify-between shadow',
            {
              'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
              'hover:shadow-dark': !disabled,
              'h-6 px-2 py-1 text-xs': small,
            },
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <span>{value ? value.toLocaleDateString() : placeholder}</span>
          </div>
        </PseudoInput>
        {isOpen && renderDayPicker()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
