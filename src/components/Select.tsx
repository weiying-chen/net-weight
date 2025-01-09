import {
  useState,
  useRef,
  useLayoutEffect,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconChevronDown } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';
import { Tooltip } from '@/components/Tooltip';

type SelectOption<T> = {
  label: string;
  value: T;
  icon?: ReactNode;
  isHidden?: boolean;
  tooltip?: ReactNode;
};

export type SelectProps<T> = {
  label?: ReactNode;
  value: T;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (value: T) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  isIconTrigger?: boolean;
  small?: boolean;
};

export const Select = <T extends string | number>({
  label,
  value,
  options,
  placeholder = 'Select an option',
  error,
  className,
  onChange,
  onFocus,
  onBlur,
  required,
  disabled,
  isIconTrigger = false,
  small = false,
  ...props
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectOption<T> | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const newSelected =
      options.find((option) => option.value === value) || null;
    setSelected(newSelected);
  }, [value, options]);

  const adjustDropdownPosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownMaxHeight = 384; // The max height of the dropdown in pixels
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const availableSpaceBelow = Math.min(spaceBelow, dropdownMaxHeight);
      const availableSpaceAbove = Math.min(spaceAbove, dropdownMaxHeight);
      const shouldFlip = availableSpaceAbove > availableSpaceBelow;

      dropdownRef.current.style.maxHeight = `${shouldFlip ? availableSpaceAbove : availableSpaceBelow}px`;

      setDropdownPosition(shouldFlip ? 'top' : 'bottom');
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      adjustDropdownPosition();

      const handleResize = () => adjustDropdownPosition();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  const handleDropdownToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.stopPropagation();

    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setFocusedIndex(
        selected
          ? options.findIndex((option) => option.value === selected.value)
          : null,
      );
      onFocus?.();
    } else {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(null);
    onBlur?.();
  };

  const handleOptionClick = (
    option: SelectOption<T>,
    event: MouseEvent<HTMLLIElement>,
  ) => {
    event.stopPropagation();
    setSelected(option);
    onChange(option.value);
    closeDropdown();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen && event.key === 'Enter') {
      setIsOpen(true);

      return;
    }

    if (!isOpen) return;

    const visibleOptions = options.filter((option) => !option.isHidden);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, visibleOptions.length - 1),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? visibleOptions.length - 1 : Math.max(prev - 1, 0),
        );
        break;
      case 'Enter':
        if (focusedIndex !== null) {
          handleOptionClick(visibleOptions[focusedIndex], event as any);
        }
        break;
      case 'Escape':
        closeDropdown();
        break;
      default:
        break;
    }
  };

  useLayoutEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const renderDropdown = () => (
    <ul
      ref={dropdownRef}
      className={cn(
        'absolute z-10 mt-1 max-h-96 overflow-y-auto overflow-x-hidden rounded border border-border bg-white shadow',
        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        isIconTrigger ? 'left-0 right-auto w-auto' : 'left-0 right-0 w-full',
      )}
    >
      {options
        .filter((option) => !option.isHidden)
        .map((option, index, visibleOptions) => {
          const isFirst = index === 0;
          const isLast = index === visibleOptions.length - 1;

          const liEl = (
            <li
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 text-sm',
                {
                  'px-3 pb-2 pt-3': isFirst,
                  'px-3 pb-3 pt-2': isLast,
                  'px-3 py-2': !isFirst && !isLast,
                },
                {
                  'bg-subtle': focusedIndex === index,
                  'rounded-t': isFirst,
                  'rounded-b': isLast,
                },
              )}
              onClick={(event) => handleOptionClick(option, event)}
              onMouseEnter={() => setFocusedIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </li>
          );

          return option.tooltip ? (
            <Tooltip key={option.value} content={option.tooltip} transient>
              {liEl}
            </Tooltip>
          ) : (
            liEl
          );
        })}
    </ul>
  );

  return (
    <Col className={cn({ 'w-auto': isIconTrigger })}>
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
        onKeyDown={handleKeyDown}
        onClick={handleDropdownToggle}
        tabIndex={0}
        {...props}
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
            {selected?.icon && <span>{selected.icon}</span>}
            {!isIconTrigger && (
              <span>{selected ? selected.label : placeholder}</span>
            )}
          </div>
          {!isIconTrigger && <IconChevronDown size={small ? 16 : 20} />}
        </PseudoInput>
        {isOpen && renderDropdown()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
