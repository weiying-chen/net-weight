'use client';

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
  allowAddOptions?: boolean;
  allowSingleOption?: boolean;
  isMobile?: boolean; // new
  emptyIcon?: ReactNode;
  disablePortal?: boolean;
};

/**
 * Props for single-select mode (or when `multiple` is omitted/false).
 *   – `value` may be a single T or null (if T includes null)
 *   – `onChange` receives a single T
 */
export type SingleSelectProps<T> = CommonProps<T> & {
  multiple?: false;
  value?: T | null;
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

/**
 * Select component now accepts T extending string, number, or null.
 * This allows `value` and `onChange` to handle null directly.
 */
export const Select = <T extends string | number | boolean | null | undefined>(
  props: SelectProps<T>,
) => {
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
    allowAddOptions,
    isMobile,
    emptyIcon,
    disablePortal = false,
  } = props as CommonProps<T>;

  const multiple = (props as any).multiple === true;
  const value = (props as any).value as T | T[];
  const onChange = (props as any).onChange as
    | ((val: T) => void)
    | ((vals: T[]) => void)
    | undefined;

  const isDisabled =
    disabled || (options.length === 1 && !props.allowSingleOption);

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectOption<T>[]>([]);
  const [addedOptions, setAddedOptions] = useState<SelectOption<T>[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasRenderedDropdown = useRef(false);

  const searchQuery = useMemo(() => {
    const query = (extSearchQuery || localSearchQuery).trim();
    return query;
  }, [extSearchQuery, localSearchQuery]);

  const addCustomOption = () => {
    if (!allowAddOptions) return;

    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const alreadyExists =
      options.some(
        (opt) => opt.label.toLowerCase() === trimmed.toLowerCase(),
      ) ||
      selectedOptions.some(
        (opt) => opt.label.toLowerCase() === trimmed.toLowerCase(),
      );

    if (alreadyExists) return;

    const newOption: SelectOption<T> = { label: trimmed, value: trimmed as T };
    setAddedOptions((prev) => [...prev, newOption]);

    if (multiple) {
      const updated = [...selectedOptions, newOption];
      setSelectedOptions(updated);
      (onChange as (vals: T[]) => void)?.(updated.map((o) => o.value));
    } else {
      setSelectedOptions([newOption]);
      (onChange as (val: T) => void)?.(newOption.value);
      closeDropdown();
    }

    setLocalSearchQuery('');
  };

  useLayoutEffect(() => {
    if (isOpen) hasRenderedDropdown.current = true;
  }, [isOpen]);

  useLayoutEffect(() => {
    if (multiple) {
      const vals = Array.isArray(value) ? value : [];
      setSelectedOptions(
        vals
          .map((v) => {
            const allOptions = allowAddOptions
              ? [...options, ...addedOptions]
              : options;
            return allOptions.find((o) => o.value === v);
          })
          .filter((o): o is SelectOption<T> => !!o),
      );
    } else {
      const singleVal = !Array.isArray(value) ? value : undefined;
      const allOptions = allowAddOptions
        ? [...options, ...addedOptions]
        : options;
      const found =
        singleVal !== undefined
          ? allOptions.find((o) => o.value === singleVal) || null
          : null;
      setSelectedOptions(found ? [found] : []);
    }
  }, [value, options, multiple]);

  const [filteredOptions, setFilteredOptions] = useState<SelectOption<T>[]>([]);

  useEffect(() => {
    const trimmed = searchQuery.trim();

    // if (isDropdownLoading) {
    //   setFilteredOptions([]);
    //   return;
    // }

    const allOptions = allowAddOptions
      ? [...options, ...addedOptions]
      : options;

    const filtered = allOptions.filter(
      (opt, idx, arr) =>
        !opt.isHidden &&
        opt.label.toLowerCase().includes(trimmed.toLowerCase()) &&
        arr.findIndex((o) => o.value === opt.value) === idx,
    );

    const exactMatchExists = allOptions.some(
      (opt) => opt.label.toLowerCase() === trimmed.toLowerCase(),
    );

    if (
      allowAddOptions &&
      trimmed &&
      filtered.length === 0 &&
      !exactMatchExists
    ) {
      const addNewOption: SelectOption<T> = {
        label: `Add "${trimmed}"`,
        value: trimmed as T,
        isAddNew: true,
      };
      setFilteredOptions([addNewOption]);
    } else {
      setFilteredOptions(filtered);
    }
    // }, [isDropdownLoading, options, addedOptions, searchQuery]);
  }, [options, addedOptions, searchQuery]);

  useEffect(() => {
    if (isOpen && hasSearch) {
      setFocusedIndex(filteredOptions.length > 0 ? 0 : null);
    }
  }, [filteredOptions, hasSearch, isOpen]);

  const openDropdown = () => {
    if (isDisabled || !onChange) return;
    setIsOpen(true);
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

  const handleOptionClick = (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement> | null,
  ) => {
    if (e) e.stopPropagation();

    if (opt.isAddNew) {
      addCustomOption();
      return;
    }

    if (multiple) {
      const exists = selectedOptions.some((s) => s.value === opt.value);
      const newSelected = exists
        ? selectedOptions.filter((s) => s.value !== opt.value)
        : [...selectedOptions, opt];
      setSelectedOptions(newSelected);
      (onChange as (v: T[]) => void)?.(newSelected.map((s) => s.value));
    } else {
      setSelectedOptions([opt]);
      (onChange as (v: T) => void)?.(opt.value);
      closeDropdown();
    }

    setLocalSearchQuery('');
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
        if (focusedIndex !== null && filteredOptions[focusedIndex]) {
          handleOptionClick(filteredOptions[focusedIndex], e as any);
        } else {
          addCustomOption();
        }
        break;
    }
  };

  // const adjustDropdownPosition = () => {
  //   if (!triggerRef.current) return;
  //   const rect = triggerRef.current.getBoundingClientRect();
  //   const rawGap = 4;
  //   const maxH = 384;
  //   const vh = window.innerHeight;
  //   const belowSpace = Math.min(vh - rect.bottom, maxH);
  //   const aboveSpace = Math.min(rect.top, maxH);
  //   const flipUp = aboveSpace > belowSpace;
  //   const computedStyles: React.CSSProperties = {
  //     position: 'fixed',
  //     left: `${rect.left}px`,
  //     minWidth: `${rect.width}px`,
  //     maxHeight: `${flipUp ? aboveSpace : belowSpace}px`,
  //     overflowY: 'auto',
  //     zIndex: 200,
  //   };
  //   if (flipUp) {
  //     computedStyles.bottom = `${vh - Math.round(rect.top) + rawGap}px`;
  //   } else {
  //     computedStyles.top = `${Math.round(rect.bottom) + rawGap}px`;
  //   }
  //   setDropdownStyles(computedStyles);
  // };

  const adjustDropdownPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const rawGap = 4;
    const maxH = 384;
    const vh = window.innerHeight;
    const belowSpace = Math.min(vh - rect.bottom, maxH);
    const aboveSpace = Math.min(rect.top, maxH);
    const flipUp = aboveSpace > belowSpace;

    const disablePortal = props.disablePortal ?? false;

    const computedStyles: React.CSSProperties = {
      position: disablePortal ? 'absolute' : 'fixed',
      minWidth: `${rect.width}px`,
      maxHeight: `${flipUp ? aboveSpace : belowSpace}px`,
      overflowY: 'auto',
      zIndex: 200,
    };

    if (disablePortal) {
      const parentRect =
        triggerRef.current.parentElement?.getBoundingClientRect();
      const wrapperTop = parentRect?.top ?? 0;
      const wrapperLeft = parentRect?.left ?? 0;

      computedStyles.left = `${rect.left - wrapperLeft}px`;

      if (flipUp) {
        computedStyles.top = `${rect.top - wrapperTop - aboveSpace - rawGap}px`;
      } else {
        computedStyles.top = `${rect.bottom - wrapperTop + rawGap}px`;
      }
    } else {
      computedStyles.left = `${rect.left}px`;

      if (flipUp) {
        computedStyles.bottom = `${vh - Math.round(rect.top) + rawGap}px`;
      } else {
        computedStyles.top = `${Math.round(rect.bottom) + rawGap}px`;
      }
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

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (e: Event) => {
      if (
        e.target === document ||
        e.target === document.body ||
        e.target === document.scrollingElement
      ) {
        closeDropdown();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const dropdownContainer = useMemo(() => {
    let el = document.getElementById('select-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'select-portal';
      document.body.appendChild(el);
    }
    return el;
  }, []);

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
      triggerRef={triggerRef}
      isMobile={isMobile}
      emptyIcon={emptyIcon}
    />
  );

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
      disablePortal={disablePortal}
    />
  );

  return (
    <Col
      className={cn(
        'relative min-w-0',
        { 'w-auto': isIconTrigger },
        wrapperClassName,
      )}
    >
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
