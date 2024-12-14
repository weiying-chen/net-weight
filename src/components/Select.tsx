import { useState, useRef, useEffect } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconChevronDown } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';

type SelectOption = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
};

type SelectProps = {
  label?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (value: string | number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
};

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  placeholder,
  error,
  className,
  onChange,
  onFocus,
  onBlur,
  required,
  disabled,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    value: string | number;
    label: string;
    icon?: React.ReactNode;
  } | null>(() => options.find((option) => option.value === value) || null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const setInitialFocusedIndex = () => {
    if (selected) {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === selected.value,
      );
      setFocusedIndex(selectedIndex !== -1 ? selectedIndex : null);
    } else {
      setFocusedIndex(null);
    }
  };

  const handleOptionClick = (
    option: SelectOption,
    event: React.MouseEvent<HTMLLIElement>,
  ) => {
    event.stopPropagation();
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
    setFocusedIndex(null);
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
          prev === null ? 0 : Math.min(prev + 1, options.length - 1),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? options.length - 1 : Math.max(prev - 1, 0),
        );
        break;
      case 'Enter':
        if (focusedIndex !== null) {
          handleOptionClick(options[focusedIndex], event as any);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(null);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(null);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onBlur]);

  const handleDropdownToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.stopPropagation();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setInitialFocusedIndex();
      onFocus?.();
    } else {
      onBlur?.();
    }
  };

  const renderDropdown = () => (
    <ul className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded border border-border bg-white shadow">
      {options.map((option, index) => (
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
          {option.icon && option.icon}
          {option.label}
        </li>
      ))}
    </ul>
  );

  return (
    <Col className={className}>
      {label && (
        <label className="text-sm font-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div
        ref={dropdownRef}
        className="relative w-full"
        onKeyDown={handleKeyDown}
        onClick={handleDropdownToggle}
        tabIndex={0}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      >
        <PseudoInput
          tabIndex={-1}
          error={error}
          disabled={disabled}
          className={cn('cursor-pointer justify-between shadow', {
            'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
            'hover:shadow-dark': !disabled,
          })}
        >
          <div className="flex items-center gap-2">
            {selected?.icon && selected.icon}
            {selected ? selected.label : placeholder || 'Select an option'}
          </div>
          <IconChevronDown size={20} className="ml-2" />
        </PseudoInput>
        {isOpen && renderDropdown()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
