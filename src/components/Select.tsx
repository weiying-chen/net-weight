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
import { cn } from '@/utils';
import { SelectDropdown, SelectOption } from '@/components/SelectDropdown';
import { SelectTrigger } from '@/components/SelectTrigger';

type CommonProps<T> = {
  label?: ReactNode;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
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

/**
 * Props for single-select mode (or when `multiple` is omitted/false).
 *   – `value` must be a single T
 *   – `onChange` receives a single T
 */
export type SingleSelectProps<T> = CommonProps<T> & {
  multiple?: false;
  value: T;
  onChange?: (value: T) => void;
};

/**
 * Props for multi-select mode (when `multiple={true}`).
 *   – `value` must be an array of T
 *   – `onChange` receives an array of T
 */
export type MultiSelectProps<T> = CommonProps<T> & {
  multiple: true;
  value: T[];
  onChange?: (value: T[]) => void;
};

/**
 * Union type: if `multiple === true`, you get MultiSelectProps; else, SingleSelectProps.
 */
export type SelectProps<T> = SingleSelectProps<T> | MultiSelectProps<T>;

export const Select = <T extends string | number>(props: SelectProps<T>) => {
  // — Destructure all common props first —
  const {
    label,
    options,
    placeholder = 'Select an option',
    error,
    className,
    wrapperClassName,
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
  } = props as CommonProps<T>;

  // TypeScript will narrow `multiple` below:
  const multiple = (props as any).multiple === true;

  // Depending on `multiple`, `value` is either T or T[]:
  const value = (props as any).value as T | T[];

  // Depending on `multiple`, onChange is either (v: T)=>void or (v: T[])=>void
  const onChange = (props as any).onChange as
    | ((val: T) => void)
    | ((vals: T[]) => void)
    | undefined;

  // If disabled or only one option remains, we treat it as “disabled”
  const isDisabled = disabled || options.length === 1;

  // ——————————————————————————————————————————————————————————————————
  // Internal state
  // ——————————————————————————————————————————————————————————————————
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Internally, we always keep an array of selected options:
  //   • single-select → array of length 0 or 1
  //   • multi-select  → array of 0…N
  const [selectedOptions, setSelectedOptions] = useState<SelectOption<T>[]>([]);

  // “local” search text that we type into the trigger’s input
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasRenderedDropdown = useRef(false);

  // Mark that the dropdown has rendered at least once, so scrollIntoView can fire
  useLayoutEffect(() => {
    if (isOpen) {
      hasRenderedDropdown.current = true;
    }
  }, [isOpen]);

  // Combine external searchQuery + localSearchQuery
  const searchQuery = useMemo(
    () => (extSearchQuery || localSearchQuery).trim(),
    [extSearchQuery, localSearchQuery],
  );

  // Whenever `value` or `options` change, sync our internal `selectedOptions`
  useLayoutEffect(() => {
    if (multiple) {
      // In multi mode → `value` is guaranteed to be T[]
      const vals = Array.isArray(value) ? value : [];

      // Preserve selection order by mapping `value` array → corresponding option
      setSelectedOptions(
        vals
          .map((v) => options.find((o) => o.value === v))
          .filter((o): o is SelectOption<T> => !!o),
      );
    } else {
      // In single mode → `value` is guaranteed to be T
      const singleVal = Array.isArray(value) ? undefined : (value as T);
      const found = options.find((o) => o.value === singleVal) || null;
      setSelectedOptions(found ? [found] : []);
    }
  }, [value, options, multiple]);

  // Filter the dropdown’s options based on `searchQuery`
  const [filteredOptions, setFilteredOptions] = useState<SelectOption<T>[]>([]);
  useEffect(() => {
    if (isDropdownLoading) {
      setFilteredOptions([]);
    } else if (extSearchQuery) {
      // If external searchQuery is provided, show all options (caller can filter upstream)
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

  // If the dropdown just opened and we are in “search” mode, highlight the very first item
  useEffect(() => {
    if (isOpen && hasSearch) {
      setFocusedIndex(filteredOptions.length > 0 ? 0 : null);
    }
  }, [filteredOptions, hasSearch, isOpen]);

  // ——————————————————————————————————————————————————————————————————
  // Handlers to open/close dropdown
  // ——————————————————————————————————————————————————————————————————
  const openDropdown = () => {
    if (isDisabled || !onChange) return;
    setIsOpen(true);

    // Only scroll to the “currently selected” item if we are NOT in “search” mode.
    if (!hasSearch && selectedOptions.length > 0) {
      const idx = options.findIndex(
        (o) => o.value === selectedOptions[0].value,
      );
      setFocusedIndex(idx >= 0 ? idx : null);
    }
    onFocus?.();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(null);
    onBlur?.();
  };

  // ——————————————————————————————————————————————————————————————————
  // When an option is clicked
  // ——————————————————————————————————————————————————————————————————
  const handleOptionClick = (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement> | null,
  ) => {
    if (e) e.stopPropagation();

    if (multiple) {
      // Multi-select: toggle in/out of the array
      const exists = selectedOptions.some((s) => s.value === opt.value);
      let newSelected: SelectOption<T>[];

      if (exists) {
        newSelected = selectedOptions.filter((s) => s.value !== opt.value);
      } else {
        newSelected = [...selectedOptions, opt];
      }

      setSelectedOptions(newSelected);
      // Fire onChange with T[]
      (onChange as (v: T[]) => void)?.(newSelected.map((s) => s.value) as T[]);

      // 👉 Immediately clear the search query:
      setLocalSearchQuery('');
      // (dropdown stays open in multi mode)
    } else {
      // Single-select: pick exactly one and close
      setSelectedOptions([opt]);
      (onChange as (v: T) => void)?.(opt.value);

      // 👉 Immediately clear the search query
      setLocalSearchQuery('');
      closeDropdown();
    }
  };

  // ——————————————————————————————————————————————————————————————————
  // Keyboard navigation inside the dropdown
  // ——————————————————————————————————————————————————————————————————
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

  // ——————————————————————————————————————————————————————————————————
  // Positioning the dropdown under the trigger
  // ——————————————————————————————————————————————————————————————————
  const adjustDropdownPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const rawGap = 4;

    // Compute available space below
    const maxH = 384;
    const vh = window.innerHeight;
    const belowSpace = Math.min(vh - rect.bottom, maxH);

    // Always open downward if hasSearch is true
    if (hasSearch) {
      const top = Math.round(rect.bottom) + rawGap;
      setDropdownStyles({
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${top}px`,
        minWidth: `${rect.width}px`,
        maxHeight: `${belowSpace}px`,
        overflowY: 'auto',
        zIndex: 200,
      });
      return;
    }

    // Otherwise, use original “flip up if there’s more space above” logic
    const aboveSpace = Math.min(rect.top, maxH);
    const flipUp = aboveSpace > belowSpace;

    const roundedBottom = Math.round(rect.bottom);
    const roundedTop = Math.round(rect.top);

    const computedStyles: React.CSSProperties = {
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

  // Close if click outside
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

  // Close on ESC
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

  // Recompute dropdown position on open & on resize
  useLayoutEffect(() => {
    if (!isOpen) return;
    adjustDropdownPosition();
    window.addEventListener('resize', adjustDropdownPosition);
    return () => window.removeEventListener('resize', adjustDropdownPosition);
  }, [isOpen, filteredOptions]);

  // Create (or reuse) a portal container with id="select-portal"
  const dropdownContainer = useMemo(() => {
    let el = document.getElementById('select-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'select-portal';
      document.body.appendChild(el);
    }
    return el;
  }, []);

  // ——————————————————————————————————————————————————————————————————
  // Render the “trigger” portion via SelectTrigger
  // ——————————————————————————————————————————————————————————————————
  const renderedTrigger = (
    <SelectTrigger
      multiple={multiple}
      hasSearch={hasSearch}
      selectedOptions={selectedOptions}
      placeholder={placeholder}
      isOpen={isOpen}
      isDisabled={isDisabled}
      isLoading={isLoading}
      small={small}
      isIconTrigger={isIconTrigger}
      muted={muted}
      error={error}
      icon={icon}
      formatValue={formatValue}
      localSearchQuery={localSearchQuery}
      onSearchChange={onSearchChange}
      openDropdown={openDropdown}
      closeDropdown={closeDropdown}
      handleOptionClick={handleOptionClick}
      handleKeyDown={handleKeyDown}
      setLocalSearchQuery={setLocalSearchQuery}
      className={className}
      triggerRef={triggerRef} // ← pass the ref directly
    />
  );

  // ——————————————————————————————————————————————————————————————————
  // Render the dropdown portion via SelectDropdown
  // ——————————————————————————————————————————————————————————————————
  const renderedDropdown = (
    <SelectDropdown
      filteredOptions={filteredOptions}
      focusedIndex={focusedIndex}
      selectedValue={
        multiple
          ? (selectedOptions.map((s) => s.value) as T[])
          : selectedOptions.length > 0
            ? (selectedOptions[0].value as T)
            : null
      }
      multiple={multiple}
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
      {renderedTrigger}
      {renderedDropdown}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
