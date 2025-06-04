import {
  useState,
  useRef,
  useLayoutEffect,
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { cn } from '@/utils';
import { IconChevronDown, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';
import { Tooltip } from '@/components/Tooltip';
import { Input } from '@/components/Input';

export type SelectOption<T> = {
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
  wrapperClassName?: string;
  onChange?: (value: T) => void;
  onSearchChange?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  isIconTrigger?: boolean;
  small?: boolean;
  hasSearch?: boolean;
  isLoading?: boolean;
  isDropdownLoading?: boolean;
  muted?: boolean;
  searchQuery?: string;
  icon?: ReactNode;
  noResultsLabel?: ReactNode;
  formatValue?: (label: string) => string;
};

export const Select = <T extends string | number>({
  label,
  value,
  options,
  placeholder = 'Select an option',
  error,
  className,
  wrapperClassName,
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
  isDropdownLoading = false,
  muted = false,
  searchQuery: extSearchQuery = '',
  icon,
  noResultsLabel,
  formatValue,
  ...props
}: SelectProps<T>) => {
  // State for open/close and keyboard focus
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectOption<T> | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dropdownStyles, setDropdownStyles] = useState<CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // This ref prevents scrollIntoView on the first mount only
  const hasRenderedDropdown = useRef(false);

  // After the dropdown actually renders, mark it as rendered once
  useLayoutEffect(() => {
    if (isOpen) {
      hasRenderedDropdown.current = true;
    }
  }, [isOpen]);

  // Merge external searchQuery prop with local state
  const searchQuery = useMemo(
    () => (extSearchQuery || localSearchQuery).trim(),
    [extSearchQuery, localSearchQuery],
  );

  // Keep `selected` in sync with `value`
  useLayoutEffect(() => {
    setSelected(options.find((o) => o.value === value) || null);
  }, [value, options]);

  // Filter options based on searchQuery
  const [filteredOptions, setFilteredOptions] = useState<SelectOption<T>[]>([]);
  useEffect(() => {
    if (isDropdownLoading) {
      setFilteredOptions([]);
    } else if (extSearchQuery) {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter(
          (opt) =>
            !opt.isHidden &&
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [isDropdownLoading, options, extSearchQuery, searchQuery]);

  // When opening with search enabled, initialize focusedIndex
  useEffect(() => {
    if (isOpen && hasSearch) {
      setFocusedIndex(filteredOptions.length > 0 ? 0 : null);
    }
  }, [filteredOptions, hasSearch, isOpen]);

  const openDropdown = () => {
    if (disabled || !onChange) return;
    setIsOpen(true);
    if (selected) {
      const idx = options.findIndex((o) => o.value === selected.value);
      setFocusedIndex(idx >= 0 ? idx : null);
    }
    onFocus?.();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(null);
    onBlur?.();
  };

  const handleOptionClick = (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement>,
  ) => {
    e.stopPropagation();
    setSelected(opt);
    onChange?.(opt.value);
    setLocalSearchQuery('');
    closeDropdown();
  };

  const handleKeyDown = (
    e: ReactKeyboardEvent<HTMLDivElement | HTMLInputElement>,
  ) => {
    if (disabled) return;
    if (!isOpen && e.key === 'Enter') {
      e.preventDefault();
      openDropdown();
      return;
    }
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, filteredOptions.length - 1),
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? filteredOptions.length - 1 : Math.max(prev - 1, 0),
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex !== null) {
          handleOptionClick(filteredOptions[focusedIndex], e as any);
        }
        break;
    }
  };

  // Compute dropdown position, flip up/down, and build style object
  const adjustDropdownPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const maxH = 384;
    const vh = window.innerHeight;
    const belowSpace = Math.min(vh - rect.bottom, maxH);
    const aboveSpace = Math.min(rect.top, maxH);
    const flipUp = aboveSpace > belowSpace;
    const rawGap = 4;

    // Round rect values to avoid fractional rounding discrepancies
    const roundedBottom = Math.round(rect.bottom);
    const roundedTop = Math.round(rect.top);

    const computedStyles: CSSProperties = {
      position: 'fixed',
      left: `${rect.left}px`,
      minWidth: `${rect.width}px`,
      maxHeight: `${flipUp ? aboveSpace : belowSpace}px`,
      overflowY: 'auto',
      zIndex: 200,
    };

    if (flipUp) {
      // Use roundedTop so bottom gap is consistent
      computedStyles.bottom = `${vh - roundedTop + rawGap}px`;
    } else {
      computedStyles.top = `${roundedBottom + rawGap}px`;
    }

    setDropdownStyles(computedStyles);
  };

  // Close on outside click
  useLayoutEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      closeDropdown();
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  // Close on Escape
  useLayoutEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen]);

  // Recompute position on open and window resize
  useLayoutEffect(() => {
    if (!isOpen) return;
    adjustDropdownPosition();
    window.addEventListener('resize', adjustDropdownPosition);
    return () => window.removeEventListener('resize', adjustDropdownPosition);
  }, [isOpen, filteredOptions]);

  // Ensure we have a portal container for all dropdowns
  const dropdownContainer = useMemo(() => {
    let el = document.getElementById('select-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'select-portal';
      document.body.appendChild(el);
    }
    return el;
  }, []);

  // Render the real (search-enabled) input
  const renderRealInput = () => (
    <div
      className={cn('relative w-full min-w-0', className)}
      ref={triggerRef}
      {...props}
    >
      <Input
        icon={<IconSearch size={16} className="text-muted" />}
        placeholder={placeholder}
        value={
          isOpen ? localSearchQuery : localSearchQuery || selected?.label || ''
        }
        formatValue={formatValue}
        onChange={(e) => {
          if (!isOpen) openDropdown();
          setLocalSearchQuery(e.target.value);
          onSearchChange?.(e.target.value);
        }}
        onClick={() => !isOpen && openDropdown()}
        onKeyDown={handleKeyDown}
        onFocus={() => !isOpen && openDropdown()}
        autoComplete="off"
        disabled={disabled}
        isLoading={isLoading}
      />
      {isOpen && renderDropdown()}
    </div>
  );

  // Render the pseudo input trigger
  const renderPseudoInput = () => (
    <div
      className={cn('relative w-full min-w-0', className)}
      ref={triggerRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (!disabled && onChange) {
          e.stopPropagation();
          isOpen ? closeDropdown() : openDropdown();
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
        <Row alignItems="center" className="min-w-0">
          {selected?.icon && <span>{selected.icon}</span>}
          {!isIconTrigger && (
            <span className={cn('w-full truncate', !selected && 'text-muted')}>
              {selected
                ? formatValue
                  ? formatValue(selected.label)
                  : selected.label
                : placeholder}
            </span>
          )}
        </Row>
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 right-3 flex items-center',
            disabled && 'opacity-50',
          )}
        >
          {isLoading ? (
            <IconLoader2 size={16} className="animate-spin text-muted" />
          ) : !isIconTrigger ? (
            (icon ?? <IconChevronDown size={small ? 16 : 20} />)
          ) : null}
        </span>
      </PseudoInput>
      {isOpen && renderDropdown()}
    </div>
  );

  // Build the dropdown (to be portaled)
  const renderDropdown = () => {
    if (!isOpen) {
      // Reset the “has rendered once” flag whenever the dropdown closes
      hasRenderedDropdown.current = false;
      return null;
    }

    const dropdownContent = (
      <div
        ref={dropdownRef}
        style={dropdownStyles}
        className={cn(
          'rounded border border-border bg-background shadow',
          'overflow-hidden',
        )}
      >
        {isDropdownLoading && localSearchQuery.length > 0 ? (
          <div className="flex items-center justify-center p-4">
            <IconLoader2 size={24} className="animate-spin" />
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="p-4 text-sm text-muted">
            {noResultsLabel || 'No results found'}
          </div>
        ) : (
          <ul className="max-h-full overflow-y-auto overflow-x-hidden">
            {filteredOptions.map((opt, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filteredOptions.length - 1;
              const isFocused = focusedIndex === idx;

              const listItem = (
                <li
                  ref={(el) => {
                    // Only scroll into view if dropdown has already been rendered once
                    if (
                      hasRenderedDropdown.current &&
                      isOpen &&
                      isFocused &&
                      el
                    ) {
                      el.scrollIntoView({ block: 'nearest' });
                    }
                  }}
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm',
                    {
                      'px-3 pb-2 pt-3': isFirst,
                      'px-3 pb-3 pt-2': isLast,
                      'bg-subtle': isFocused,
                      'rounded-t': isFirst,
                      'rounded-b': isLast,
                    },
                  )}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => handleOptionClick(opt, e)}
                >
                  {opt.icon && <span>{opt.icon}</span>}
                  <span>{opt.label}</span>
                </li>
              );

              return opt.tooltip ? (
                <Tooltip key={opt.value} content={opt.tooltip}>
                  {listItem}
                </Tooltip>
              ) : (
                listItem
              );
            })}
          </ul>
        )}
      </div>
    );

    return createPortal(dropdownContent, dropdownContainer);
  };

  return (
    <Col className={cn({ 'w-auto': isIconTrigger }, wrapperClassName)}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        ) : (
          label
        ))}
      {hasSearch ? renderRealInput() : renderPseudoInput()}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
