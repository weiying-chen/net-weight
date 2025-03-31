import {
  useState,
  useRef,
  useLayoutEffect,
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
} from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { cn } from '@/utils';
import { IconChevronDown, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';
import { Tooltip } from '@/components/Tooltip';
import { Input } from '@/components/Input';

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
  onSearchChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  isIconTrigger?: boolean;
  small?: boolean;
  hasSearch?: boolean;
  isLoading?: boolean;
  muted?: boolean;
  searchQuery?: string;
};

export const Select = <T extends string | number>({
  label,
  value,
  options,
  placeholder = 'Select an option',
  error,
  className,
  onChange,
  onSearchChange,
  onFocus,
  onBlur,
  required,
  disabled,
  isIconTrigger = false,
  small = false,
  hasSearch = false,
  isLoading = false,
  muted = false,
  searchQuery: extSearchQuery = '',
  ...props
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectOption<T> | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const searchQuery = useMemo(
    () => (extSearchQuery || localSearchQuery).trim(),
    [extSearchQuery, localSearchQuery],
  );

  useLayoutEffect(() => {
    const newSelected =
      options.find((option) => option.value === value) || null;
    setSelected(newSelected);
  }, [value, options]);

  const [filteredOptions, setFilteredOptions] = useState<SelectOption<T>[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (extSearchQuery) {
        // API already filtered, so just use the options directly
        setFilteredOptions(options);
      } else {
        const filtered = options.filter((option) => {
          const labelLower = option.label.toLowerCase();
          const searchLower = searchQuery.toLowerCase();
          return !option.isHidden && labelLower.includes(searchLower);
        });
        setFilteredOptions(filtered);
      }
    } else {
      setFilteredOptions([]);
    }
  }, [isLoading, options, extSearchQuery, localSearchQuery]);

  // Needs to run when options update, not just when opening the dropdown.
  useEffect(() => {
    if (isOpen && hasSearch) {
      setFocusedIndex(filteredOptions.length > 0 ? 0 : null);
    }
  }, [localSearchQuery, isOpen, filteredOptions.length, hasSearch]);

  const openDropdown = () => {
    setIsOpen(true);
    // setLocalSearchQuery('');
    if (selected) {
      const idx = options.findIndex((o) => o.value === selected.value);
      setFocusedIndex(idx !== -1 ? idx : null);
    } else {
      setFocusedIndex(null);
    }
    onFocus?.();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(null);
    // setLocalSearchQuery('');
    onBlur?.();
  };

  const handleOptionClick = (
    option: SelectOption<T>,
    event: ReactMouseEvent<HTMLLIElement>,
  ) => {
    event.stopPropagation();
    setSelected(option);
    onChange(option.value);
    setLocalSearchQuery('');
    closeDropdown();
  };

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement | HTMLInputElement>,
  ) => {
    if (disabled) return;

    if (!isOpen && event.key === 'Enter') {
      event.preventDefault();
      openDropdown();
      return;
    }
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, filteredOptions.length - 1),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? filteredOptions.length - 1 : Math.max(prev - 1, 0),
        );
        break;
      case 'Enter':
        event.preventDefault(); // Prevent form submission here as well
        if (focusedIndex !== null && filteredOptions[focusedIndex]) {
          handleOptionClick(filteredOptions[focusedIndex], event as any);
        }
        break;
      default:
        break;
    }
  };

  const adjustDropdownPosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownMaxHeight = 384;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const availableSpaceBelow = Math.min(spaceBelow, dropdownMaxHeight);
      const availableSpaceAbove = Math.min(spaceAbove, dropdownMaxHeight);
      const shouldFlip = availableSpaceAbove > availableSpaceBelow;

      dropdownRef.current.style.maxHeight = `${
        shouldFlip ? availableSpaceAbove : availableSpaceBelow
      }px`;
      setDropdownPosition(shouldFlip ? 'top' : 'bottom');
    }
  };

  useLayoutEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    adjustDropdownPosition();
    const handleResize = () => adjustDropdownPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const renderRealInput = () => (
    <div
      className={cn('relative w-full', className)}
      ref={triggerRef}
      {...props}
    >
      <Input
        icon={<IconSearch className="text-muted" size={16} />}
        placeholder={placeholder}
        value={
          isOpen ? localSearchQuery : localSearchQuery || selected?.label || ''
        }
        onChange={(e) => {
          if (!isOpen) openDropdown();
          setLocalSearchQuery(e.target.value);
          onSearchChange?.(e.target.value);
        }}
        onClick={() => {
          if (!isOpen) openDropdown();
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (!isOpen) openDropdown();
        }}
        disabled={disabled}
      />
      {isOpen && renderDropdown()}
    </div>
  );

  const renderPseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full', className)}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (!disabled) {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setFocusedIndex(
              selected
                ? options.findIndex((o) => o.value === selected.value)
                : null,
            );
            onFocus?.();
          } else {
            closeDropdown();
          }
        }
      }}
      {...props}
    >
      <PseudoInput
        tabIndex={0}
        error={error}
        disabled={disabled}
        className={cn('cursor-pointer justify-between shadow', {
          'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
          'hover:shadow-dark': !disabled,
          'h-5 px-2 py-1 text-xs': small,
          'border-0 bg-subtle shadow-none': muted,
        })}
      >
        <Row alignItems="center">
          {selected?.icon && <span>{selected.icon}</span>}
          {!isIconTrigger && (
            <span className={selected ? '' : 'text-muted'}>
              {selected ? selected.label : placeholder}
            </span>
          )}
        </Row>
        {!isIconTrigger && <IconChevronDown size={small ? 16 : 20} />}
      </PseudoInput>
      {isOpen && renderDropdown()}
    </div>
  );

  const renderDropdown = () => {
    if (!isOpen) return null; // Only render when open

    return (
      <div
        ref={dropdownRef}
        className={cn(
          'absolute z-50 overflow-hidden rounded border border-border bg-background shadow',
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
          isIconTrigger ? 'left-0 right-auto w-auto' : 'left-0 right-0 w-full',
        )}
      >
        {isLoading && localSearchQuery.length > 0 ? (
          <div className="flex items-center justify-center p-4">
            <IconLoader2 size={24} className="animate-spin" />
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="p-4 text-sm text-muted">No results found</div>
        ) : (
          <ul className="max-h-96 overflow-y-auto overflow-x-hidden">
            {filteredOptions.map((option, index) => {
              const isFirst = index === 0;
              const isLast = index === filteredOptions.length - 1;
              const liEl = (
                <li
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm',
                    {
                      'px-3 pb-2 pt-3': isFirst,
                      'px-3 pb-3 pt-2': isLast,
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
        )}
      </div>
    );
  };

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
      {hasSearch ? renderRealInput() : renderPseudoInput()}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
