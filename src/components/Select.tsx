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
  wrapperClassName?: string;
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
  isDropdownLoading?: boolean;
  muted?: boolean;
  searchQuery?: string;
  icon?: ReactNode;
  noResultsLabel?: ReactNode;
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
  ...props
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectOption<T> | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const searchQuery = useMemo(
    () => (extSearchQuery || localSearchQuery).trim(),
    [extSearchQuery, localSearchQuery],
  );

  useLayoutEffect(() => {
    setSelected(options.find((o) => o.value === value) || null);
  }, [value, options]);

  const [filteredOptions, setFilteredOptions] = useState<SelectOption<T>[]>([]);
  useEffect(() => {
    if (isDropdownLoading) {
      setFilteredOptions([]);
    } else if (extSearchQuery) {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((opt) => {
          return (
            !opt.isHidden &&
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }),
      );
    }
  }, [isDropdownLoading, options, extSearchQuery, searchQuery]);

  useEffect(() => {
    if (isOpen && hasSearch) {
      setFocusedIndex(filteredOptions.length > 0 ? 0 : null);
    }
  }, [filteredOptions.length, hasSearch, isOpen]);

  const openDropdown = () => {
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
    onChange(opt.value);
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
        setFocusedIndex((p) =>
          p === null ? 0 : Math.min(p + 1, filteredOptions.length - 1),
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((p) =>
          p === null ? filteredOptions.length - 1 : Math.max(p - 1, 0),
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

  const adjustDropdownPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const maxH = 384;
    const vh = window.innerHeight;
    const below = Math.min(vh - rect.bottom, maxH);
    const above = Math.min(rect.top, maxH);
    const flip = above > below;
    dropdownRef.current.style.maxHeight = `${flip ? above : below}px`;
    setDropdownPosition(flip ? 'top' : 'bottom');
  };

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

  useLayoutEffect(() => {
    if (!isOpen) return;
    adjustDropdownPosition();
    window.addEventListener('resize', adjustDropdownPosition);
    return () => window.removeEventListener('resize', adjustDropdownPosition);
  }, [isOpen]);

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

  const renderPseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full min-w-0', className)}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        isOpen ? closeDropdown() : openDropdown();
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
              {selected ? selected.label : placeholder}
            </span>
          )}
        </Row>
        {!isIconTrigger && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center"></span>
        )}
      </PseudoInput>
      {isLoading && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <IconLoader2 size={16} className="animate-spin text-muted" />
        </span>
      )}
      {!isLoading && !isIconTrigger && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {icon ?? <IconChevronDown size={small ? 16 : 20} />}
        </span>
      )}
      {isOpen && renderDropdown()}
    </div>
  );

  const renderDropdown = () => {
    if (!isOpen) return null;
    return (
      <div
        ref={dropdownRef}
        className={cn(
          'absolute z-50 overflow-hidden rounded border border-border bg-background shadow',
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
          isIconTrigger ? 'left-0 right-auto w-auto' : 'left-0 right-0 w-full',
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
          <ul className="max-h-96 overflow-y-auto overflow-x-hidden">
            {filteredOptions.map((opt, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filteredOptions.length - 1;
              const item = (
                <li
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm',
                    {
                      'px-3 pb-2 pt-3': isFirst,
                      'px-3 pb-3 pt-2': isLast,
                      'bg-subtle': focusedIndex === idx,
                      'rounded-t': isFirst,
                      'rounded-b': isLast,
                    },
                  )}
                  onClick={(e) => handleOptionClick(opt, e)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {opt.icon && <span>{opt.icon}</span>}
                  <span>{opt.label}</span>
                </li>
              );
              return opt.tooltip ? (
                <Tooltip key={opt.value} content={opt.tooltip} transient>
                  {item}
                </Tooltip>
              ) : (
                item
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <Col className={cn({ 'w-auto': isIconTrigger }, wrapperClassName)}>
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
