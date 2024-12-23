import { useState, useRef, useEffect, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconChevronDown } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';

type SelectOption<T> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
  isHidden?: boolean;
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Sync local state with external `value` prop
  useEffect(() => {
    const newSelected =
      options.find((option) => option.value === value) || null;
    if (newSelected?.value !== selected?.value) {
      setSelected(newSelected);
    }
  }, [value, options]);

  const setInitialFocusedIndex = () => {
    if (selected) {
      const selectedIndex = options.findIndex(
        (option) => option.value === selected.value,
      );
      setFocusedIndex(selectedIndex !== -1 ? selectedIndex : null);
    } else {
      setFocusedIndex(null);
    }
  };

  const handleDropdownToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.stopPropagation();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setInitialFocusedIndex();
    }
    onFocus?.();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(null);
    onBlur?.();
  };

  const handleOptionClick = (
    option: SelectOption<T>,
    event: React.MouseEvent<HTMLLIElement>,
  ) => {
    event.stopPropagation();
    setSelected(option);
    onChange(option.value); // Notify parent of the change
    closeDropdown();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen && event.key === 'Enter') {
      setIsOpen(true);
      setInitialFocusedIndex();
      return;
    }

    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null
            ? 0
            : Math.min(
                prev + 1,
                options.filter((option) => !option.isHidden).length - 1,
              ),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null
            ? options.filter((option) => !option.isHidden).length - 1
            : Math.max(prev - 1, 0),
        );
        break;
      case 'Enter':
        if (focusedIndex !== null) {
          const visibleOptions = options.filter((option) => !option.isHidden);
          handleOptionClick(visibleOptions[focusedIndex], event as any);
        }
        break;
      case 'Escape':
        closeDropdown();
        break;
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
      className={cn(
        'absolute z-10 mt-1 overflow-hidden rounded border border-border bg-white shadow',
        isIconTrigger ? 'left-0 right-auto w-auto' : 'left-0 right-0 w-full',
      )}
    >
      {options
        .filter((option) => !option.isHidden) // Exclude hidden options
        .map((option, index) => (
          <li
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
              {
                'bg-subtle': focusedIndex === index,
              },
            )}
            onClick={(event) => handleOptionClick(option, event)}
            onMouseEnter={() => setFocusedIndex(index)}
            onMouseDown={(e) => e.preventDefault()}
          >
            {option.icon && <span>{option.icon}</span>}
            <span>{option.label}</span>
          </li>
        ))}
    </ul>
  );

  return (
    <Col className={cn({ 'w-auto': isIconTrigger }, className)}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger"> *</span>}
          </label>
        ) : (
          label
        ))}
      <div
        ref={dropdownRef}
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
          className={cn('cursor-pointer justify-between shadow', {
            'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
            'hover:shadow-dark': !disabled,
            'h-6 px-2 py-1 text-xs': small,
          })}
        >
          <div className="flex items-center gap-2">
            {selected?.icon && <span>{selected.icon}</span>}
            {!isIconTrigger && (
              <span>{selected ? selected.label : placeholder}</span>
            )}
          </div>
          <IconChevronDown size={small ? 16 : 20} />
        </PseudoInput>
        {isOpen && renderDropdown()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
