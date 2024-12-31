import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { DayPicker, MonthCaptionProps, useDayPicker } from 'react-day-picker';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { format } from 'date-fns';
import { Button } from '@/components/Button';
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendarMonth,
} from '@tabler/icons-react';
import { Row } from '@/components/Row';

export type DatePickerProps = {
  label?: ReactNode;
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
  const [displayedMonth, setDisplayedMonth] = useState(value || new Date());

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

  const renderNav = () => {
    const { previousMonth, nextMonth, goToMonth } = useDayPicker();

    return (
      <Row fluid>
        <Button
          variant="link"
          onClick={() => previousMonth && goToMonth(previousMonth)}
        >
          <IconChevronLeft />
        </Button>
        <Button
          variant="link"
          onClick={() => nextMonth && goToMonth(nextMonth)}
        >
          <IconChevronRight />
        </Button>
      </Row>
    );
  };

  const renderCaption = ({ calendarMonth }: MonthCaptionProps) => (
    <Row align="between">
      <h2 className="text-lg font-semibold">
        {format(calendarMonth.date, 'MMMM yyyy')}
      </h2>
      {renderNav()}
    </Row>
  );

  const renderDayPicker = () => (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-10',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        'rounded-md border border-border bg-background p-3 shadow',
      )}
    >
      <DayPicker
        mode="single"
        selected={value}
        month={displayedMonth}
        onMonthChange={setDisplayedMonth}
        showOutsideDays
        onSelect={(date) => {
          if (date) {
            onChange(date);
            setIsOpen(false);
          }
        }}
        classNames={{
          day: 'text-center',
        }}
        components={{
          Nav: () => <></>,
          MonthCaption: (props) => (
            <>
              {renderCaption(props)}
              <div className="my-2 h-px bg-border"></div>
            </>
          ),
          DayButton: (props) => {
            const { modifiers, day, children, ...buttonProps } = props;

            return (
              <button
                {...buttonProps}
                className={cn('w-full rounded p-2 hover:shadow', {
                  'bg-primary text-background': modifiers.selected,
                  'bg-subtle': modifiers.today,
                  'text-muted': modifiers.outside,
                })}
              >
                {children}
              </button>
            );
          },
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
            // setDisplayedMonth(value || new Date());
            setIsOpen((prev) => !prev);
          }
        }}
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
          <IconCalendarMonth size={20} />
        </PseudoInput>
        {isOpen && renderDayPicker()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
