import {
  ReactNode,
  MouseEvent as ReactMouseEvent,
  CSSProperties,
  MutableRefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { Row } from '@/components/Row';
import { cn } from '@/utils';
import { IconLoader2, IconPlus, IconCheck } from '@tabler/icons-react';

export type SelectOption<T> = {
  label: string;
  value: T;
  icon?: ReactNode;
  isHidden?: boolean;
  tooltip?: ReactNode;
  isAddNew?: boolean;
};

export type SelectDropdownProps<
  T extends string | number | boolean | null | undefined,
> = {
  filteredOptions: SelectOption<T>[];
  focusedIndex: number | null;
  selectedValue: T | T[] | null;
  multiple?: boolean;
  onOptionClick: (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement>,
  ) => void;
  setFocusedIndex: (index: number) => void;
  isDropdownLoading: boolean;
  localSearchQuery: string;
  noResultsLabel?: ReactNode;
  dropdownStyles: CSSProperties;
  dropdownContainer: HTMLElement;
  hasRenderedDropdown: MutableRefObject<boolean>;
  isOpen: boolean;
  dropdownRef: MutableRefObject<HTMLDivElement | null>;
};

export function SelectDropdown<
  T extends string | number | boolean | null | undefined,
>({
  filteredOptions,
  focusedIndex,
  selectedValue,
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

            const isSelected = Array.isArray(selectedValue)
              ? selectedValue.includes(opt.value)
              : selectedValue === opt.value;

            return (
              <li
                key={String(opt.value)}
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
                {opt.isAddNew ? (
                  <Row alignItems="center">
                    <IconPlus size={16} />
                    <span>{opt.label}</span>
                  </Row>
                ) : (
                  <div className="flex w-full items-center justify-between gap-2">
                    <Row alignItems="center" className="gap-2">
                      {opt.icon && <span>{opt.icon}</span>}
                      <span>{opt.label}</span>
                    </Row>
                    {isSelected && <IconCheck size={16} />}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return createPortal(dropdownContent, dropdownContainer);
}
