// components/SelectDropdown.tsx

import {
  ReactNode,
  MouseEvent as ReactMouseEvent,
  CSSProperties,
  MutableRefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { Row } from '@/components/Row';
import { cn } from '@/utils';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';

export type SelectOption<T> = {
  label: string;
  value: T;
  icon?: ReactNode;
  isHidden?: boolean;
  tooltip?: ReactNode;
};

export type SelectDropdownProps<T extends string | number | null> = {
  /** Filtered options to display */
  filteredOptions: SelectOption<T>[];
  /** Currently highlighted index (for keyboard navigation) */
  focusedIndex: number | null;
  /** The currently selected value(s) */
  selectedValue: T | T[] | null;
  /** Whether multiple selection is enabled */
  multiple?: boolean;
  /** Called when an option is clicked */
  onOptionClick: (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement>,
  ) => void;
  /** Update focused index on hover */
  setFocusedIndex: (index: number) => void;
  /** Whether the dropdown is in a loading state */
  isDropdownLoading: boolean;
  /** Current search query (to decide loading vs. “no results found”) */
  localSearchQuery: string;
  /** Label to show when no results are found */
  noResultsLabel?: ReactNode;
  /** Inline styles for positioning the dropdown */
  dropdownStyles: CSSProperties;
  /** The container element into which the dropdown is portaled */
  dropdownContainer: HTMLElement;
  /** Ref to track if dropdown has already rendered once (for scrollIntoView) */
  hasRenderedDropdown: MutableRefObject<boolean>;
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** Pass-down ref so parent can detect clicks inside */
  dropdownRef: MutableRefObject<HTMLDivElement | null>;
};

export function SelectDropdown<T extends string | number | null>({
  filteredOptions,
  focusedIndex,
  selectedValue,
  multiple = false,
  onOptionClick,
  setFocusedIndex,
  isDropdownLoading,
  localSearchQuery,
  noResultsLabel,
  dropdownStyles,
  dropdownContainer,
  hasRenderedDropdown,
  isOpen,
  dropdownRef,
}: SelectDropdownProps<T>) {
  if (!isOpen) {
    if (hasRenderedDropdown.current) {
      hasRenderedDropdown.current = false;
    }
    return null;
  }

  const dropdownContent = (
    <div
      ref={dropdownRef}
      style={dropdownStyles}
      className={cn(
        'overflow-hidden rounded border border-border bg-background shadow',
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

            const isSelected = multiple
              ? Array.isArray(selectedValue) &&
                selectedValue.includes(opt.value)
              : selectedValue === opt.value;

            return (
              <li
                key={opt.value}
                ref={(el) => {
                  if (
                    hasRenderedDropdown.current &&
                    isOpen &&
                    isFocused &&
                    el
                  ) {
                    el.scrollIntoView({ block: 'nearest' });
                  }
                }}
                className={cn(
                  'flex cursor-pointer items-center whitespace-nowrap px-3 py-2 text-sm',
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
                onClick={(e) => onOptionClick(opt, e)}
              >
                <Row align="between" alignItems="center" className="w-full">
                  <div className="flex items-center gap-2">
                    {opt.icon && <span>{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <IconCheck size={16} className="text-muted" />}
                </Row>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return createPortal(dropdownContent, dropdownContainer);
}
