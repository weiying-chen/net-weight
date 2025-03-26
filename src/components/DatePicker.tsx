import { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import { DayPicker } from 'react-day-picker';
import { PseudoInput } from '@/components/PseudoInput';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
// import { format } from 'date-fns';
// import { Button } from '@/components/Button';
import {
  // IconChevronLeft,
  // IconChevronRight,
  IconCalendarMonth,
} from '@tabler/icons-react';
// import { Row } from '@/components/Row';

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

  // Update internal state when external value changes
  useLayoutEffect(() => {
    setSelectedDate(externalValue);
    setDisplayedMonth(externalValue || new Date());
  }, [externalValue]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  // const renderNav = () => {
  //   const { previousMonth, nextMonth, goToMonth } = useDayPicker();
  //   return (
  //     <Row fluid>
  //       <Button
  //         variant="link"
  //         onClick={() => {
  //           console.log('Custom Nav: Previous clicked');
  //           previousMonth && goToMonth(previousMonth);
  //         }}
  //         className="p-1"
  //       >
  //         <IconChevronLeft />
  //       </Button>
  //       <Button
  //         variant="link"
  //         onClick={() => {
  //           console.log('Custom Nav: Next clicked');
  //           nextMonth && goToMonth(nextMonth);
  //         }}
  //         className="p-1"
  //       >
  //         <IconChevronRight />
  //       </Button>
  //     </Row>
  //   );
  // };

  // Custom MonthCaption override with debugging
  // const CustomMonthCaption = (props: MonthCaptionProps) => {
  //   console.log('CustomMonthCaption props:', props);
  //   return (
  //     <Row align="between">
  //       <h2 className="text-lg font-semibold text-red-500">
  //         {format(props.calendarMonth.date, 'MMMM yyyy')}
  //       </h2>
  //       {renderNav()}
  //     </Row>
  //   );
  // };

  // Custom DayButton override with debugging
  // const CustomDayButton = (props: any) => {
  //   console.log('CustomDayButton props:', props);
  //   const { modifiers, day, children, ...buttonProps } = props;
  //   return (
  //     <button
  //       {...buttonProps}
  //       className={cn(
  //         'w-full rounded p-2 hover:shadow',
  //         modifiers.selected && 'bg-primary text-background',
  //         modifiers.today && 'bg-subtle',
  //         modifiers.outside && 'text-muted',
  //       )}
  //     >
  //       {children}
  //     </button>
  //   );
  // };

  const renderDayPicker = () => (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'absolute z-10 rounded border border-border bg-background p-3 shadow',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
      )}
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        month={displayedMonth}
        onMonthChange={setDisplayedMonth}
        showOutsideDays
        onSelect={(date) => date && handleSelectDate(date)}
        // components={{
        //   // Enable custom overrides:
        //   MonthCaption: (props) => (
        //     <>
        //       <CustomMonthCaption {...props} />
        //       <div className="my-2 h-px bg-border" />
        //     </>
        //   ),
        //   // DayButton: CustomDayButton,
        // }}
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
        // components={{
        //   DayButton: (props: DayButtonProps) => (
        //     <DayButton {...props} className="text-red-400" />
        //   ),
        // }}
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
