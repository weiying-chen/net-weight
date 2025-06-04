// components/Select.tsx

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
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { cn } from '@/utils';
import { IconChevronDown, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';
import { Input } from '@/components/Input';
import { SelectDropdown, SelectOption } from '@/components/SelectDropdown';

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
  disabled = false,
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
  const isDisabled = disabled || options.length === 1;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectOption<T> | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dropdownStyles, setDropdownStyles] = useState<CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const hasRenderedDropdown = useRef(false);

  useLayoutEffect(() => {
    if (isOpen) {
      hasRenderedDropdown.current = true;
    }
  }, [isOpen]);

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
        options.filter(
          (opt) =>
            !opt.isHidden &&
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [isDropdownLoading, options, extSearchQuery, searchQuery]);

  useEffect(() => {
    if (isOpen && hasSearch) {
      setFocusedIndex(filteredOptions.length > 0 ? 0 : null);
    }
  }, [filteredOptions, hasSearch, isOpen]);

  const openDropdown = () => {
    if (isDisabled || !onChange) return;
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
    if (isDisabled) return;
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

  const adjustDropdownPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const maxH = 384;
    const vh = window.innerHeight;
    const belowSpace = Math.min(vh - rect.bottom, maxH);
    const aboveSpace = Math.min(rect.top, maxH);
    const flipUp = aboveSpace > belowSpace;
    const rawGap = 4;

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
      computedStyles.bottom = `${vh - roundedTop + rawGap}px`;
    } else {
      computedStyles.top = `${roundedBottom + rawGap}px`;
    }

    setDropdownStyles(computedStyles);
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
  }, [isOpen, filteredOptions]);

  const dropdownContainer = useMemo(() => {
    let el = document.getElementById('select-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'select-portal';
      document.body.appendChild(el);
    }
    return el;
  }, []);

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
        disabled={isDisabled}
        isLoading={isLoading}
      />
      <SelectDropdown
        filteredOptions={filteredOptions}
        focusedIndex={focusedIndex}
        selectedValue={selected ? selected.value : null}
        onOptionClick={handleOptionClick}
        setFocusedIndex={setFocusedIndex}
        isDropdownLoading={isDropdownLoading}
        localSearchQuery={localSearchQuery}
        noResultsLabel={noResultsLabel}
        dropdownStyles={dropdownStyles}
        dropdownContainer={dropdownContainer}
        hasRenderedDropdown={hasRenderedDropdown}
        isOpen={isOpen}
        dropdownRef={dropdownRef}
      />
    </div>
  );

  const renderPseudoInput = () => (
    <div
      className={cn('relative w-full min-w-0', className)}
      ref={triggerRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (!isDisabled && onChange) {
          e.stopPropagation();
          isOpen ? closeDropdown() : openDropdown();
        }
      }}
      {...props}
    >
      <PseudoInput
        tabIndex={0}
        error={error}
        disabled={isDisabled}
        className={cn('cursor-pointer justify-between shadow', {
          'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
          'hover:shadow-dark': !isDisabled,
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
            isDisabled && 'opacity-50',
          )}
        >
          {isLoading ? (
            <IconLoader2 size={16} className="animate-spin text-muted" />
          ) : !isIconTrigger ? (
            (icon ?? <IconChevronDown size={small ? 16 : 20} />)
          ) : null}
        </span>
      </PseudoInput>
      <SelectDropdown
        filteredOptions={filteredOptions}
        focusedIndex={focusedIndex}
        selectedValue={selected ? selected.value : null}
        onOptionClick={handleOptionClick}
        setFocusedIndex={setFocusedIndex}
        isDropdownLoading={isDropdownLoading}
        localSearchQuery={localSearchQuery}
        noResultsLabel={noResultsLabel}
        dropdownStyles={dropdownStyles}
        dropdownContainer={dropdownContainer}
        hasRenderedDropdown={hasRenderedDropdown}
        isOpen={isOpen}
        dropdownRef={dropdownRef}
      />
    </div>
  );

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
