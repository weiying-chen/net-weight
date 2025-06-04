// components/SelectTrigger.tsx

import {
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { cn } from '@/utils';
import { Row } from '@/components/Row';
import { PseudoInput } from '@/components/PseudoInput';
import { Input } from '@/components/Input';
import { Tag } from '@/components/Tag';
import { IconChevronDown, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { SelectOption } from '@/components/SelectDropdown';

export type SelectTriggerProps<T> = {
  /** Passed from Select: whether multi‐select mode is on */
  multiple: boolean;
  /** Passed from Select: whether search‐in‐input is enabled */
  hasSearch: boolean;
  /** All currently selected options (array of SelectOption<T>) */
  selectedOptions: SelectOption<T>[];
  /** Placeholder text to show when nothing is selected */
  placeholder: string;
  /** Is the dropdown currently open (to control focus styling) */
  isOpen: boolean;
  /** If disabled, clicking/focusing does nothing */
  isDisabled: boolean;
  /** If loading, show spinner instead of arrow */
  isLoading: boolean;
  /** If true, render smaller (“text-sm h-8 px-2”) vs default (“h-10 px-3”) */
  small: boolean;
  /** If true, do not render the default chevron arrow icon */
  isIconTrigger: boolean;
  /** If true, render a “muted” style (borderless background) */
  muted: boolean;
  /** Any error message shown below the trigger (passed, but not used visually here) */
  error?: string;
  /** Icon to show on the right side (overrides default chevron) */
  icon?: ReactNode;
  /** How to format a label when passing `formatValue` */
  formatValue?: (label: string) => string;

  /** Current search‐in‐input text (only used when hasSearch=true) */
  localSearchQuery: string;
  /** Called when typing changes searchQuery */
  onSearchChange?: (query: string) => void;

  /** Called by parent to open the dropdown */
  openDropdown: () => void;
  /** Called by parent to close the dropdown */
  closeDropdown: () => void;

  /** Called when an option is clicked or a tag’s “×” is clicked.
   *  opt: SelectOption<T>, e: ReactMouseEvent or null when removing via Backspace/“×”
   */
  handleOptionClick: (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement> | null,
  ) => void;

  /** Called on keyDown for ArrowUp/ArrowDown/Enter behavior in dropdown */
  handleKeyDown: (
    e: ReactKeyboardEvent<HTMLDivElement | HTMLInputElement>,
  ) => void;

  /** Only used in multi+search mode: update the internal search text */
  setLocalSearchQuery: (query: string) => void;

  /** Pass through any custom className for the wrapper `<div>` */
  className?: string;

  /** Reference to the actual visible trigger element (Input or PseudoInput) */
  triggerRef: React.RefObject<HTMLDivElement>;
};

export function SelectTrigger<T extends string | number>({
  multiple,
  hasSearch,
  selectedOptions,
  placeholder,
  isOpen,
  isDisabled,
  isLoading,
  small,
  isIconTrigger,
  muted,
  error,
  icon,
  formatValue,
  localSearchQuery,
  onSearchChange,
  openDropdown,
  closeDropdown,
  handleOptionClick,
  handleKeyDown,
  setLocalSearchQuery,
  className,
  triggerRef,
}: SelectTriggerProps<T>) {
  // ──────────────────────────────────────────────────────────
  // 1) Multi + No‐Search (render tags inside a PseudoInput)
  // ──────────────────────────────────────────────────────────
  const renderMultiplePseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn(
        'relative',
        isIconTrigger ? 'w-auto' : 'w-full min-w-0',
        className,
      )}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (!isDisabled) {
          e.stopPropagation();
          isOpen ? closeDropdown() : openDropdown();
        }
      }}
    >
      <PseudoInput
        tabIndex={0}
        error={error}
        disabled={isDisabled}
        className={cn(
          'flex cursor-pointer flex-wrap justify-between gap-1 shadow',
          {
            'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
            'hover:shadow-dark': !isDisabled,
            'h-8 px-2 text-sm': small && !isIconTrigger,
            // ← Default size should be text-sm
            'h-10 px-3 text-sm': !small && !isIconTrigger,
            'border-0 bg-subtle shadow-none': muted,
            // When icon‐trigger is true, apply the exact “old” icon‐trigger styling:
            'flex h-5 cursor-pointer items-center justify-between whitespace-nowrap rounded border-0 bg-subtle px-2 py-1 text-xs shadow-none outline-none ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus-visible:ring-2':
              isIconTrigger,
          },
        )}
      >
        <Row alignItems="center" className="min-w-0 flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <Tag
              key={opt.value}
              onRemove={() => handleOptionClick(opt, null)}
              className="h-5 px-2 py-1 text-xs"
            >
              {opt.label}
            </Tag>
          ))}
          {selectedOptions.length === 0 && (
            <span className="text-muted">{placeholder}</span>
          )}
        </Row>

        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 right-2 flex items-center',
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
    </div>
  );

  // ──────────────────────────────────────────────────────────
  // 2) Multi + Search (render tags + an Input)
  // ──────────────────────────────────────────────────────────
  const renderMultipleSearchInput = () => (
    <div
      ref={triggerRef}
      className={cn(
        'relative flex',
        isIconTrigger ? 'w-auto' : 'w-full min-w-0',
        'flex-wrap items-center gap-1 rounded border border-border bg-background px-1 py-1',
        { 'text-sm': small, 'text-base': !small },
        className,
      )}
      onClick={() => !isOpen && openDropdown()}
    >
      {selectedOptions.map((opt) => (
        <Tag
          key={opt.value}
          onRemove={() => handleOptionClick(opt, null)}
          className="h-5 px-2 py-1 text-xs"
        >
          {opt.label}
        </Tag>
      ))}

      <Input
        className="min-w-[60px] flex-1 p-0"
        placeholder={selectedOptions.length === 0 ? placeholder : ''}
        value={isOpen ? localSearchQuery : ''}
        formatValue={formatValue}
        onChange={(e) => {
          if (!isOpen) openDropdown();
          setLocalSearchQuery(e.target.value);
          onSearchChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          // Remove last tag on Backspace if search box is empty
          if (
            e.key === 'Backspace' &&
            localSearchQuery === '' &&
            selectedOptions.length > 0
          ) {
            const last = selectedOptions[selectedOptions.length - 1];
            handleOptionClick(last, null);
          } else {
            handleKeyDown(e as any);
          }
        }}
        autoComplete="off"
        disabled={isDisabled}
        isLoading={isLoading}
      />

      <span
        className={cn(
          'pointer-events-none absolute inset-y-0 right-2 flex items-center',
          isDisabled && 'opacity-50',
        )}
      >
        {isLoading ? (
          <IconLoader2 size={16} className="animate-spin text-muted" />
        ) : !isIconTrigger ? (
          (icon ?? <IconChevronDown size={small ? 16 : 20} />)
        ) : null}
      </span>
    </div>
  );

  // ──────────────────────────────────────────────────────────
  // 3) Single + Search (a normal Input with search icon)
  // ──────────────────────────────────────────────────────────
  const renderRealInput = () => (
    <div
      ref={triggerRef}
      className={cn(
        'relative',
        isIconTrigger ? 'w-auto' : 'w-full min-w-0',
        className,
      )}
      onKeyDown={handleKeyDown}
      onClick={() => !isDisabled && openDropdown()}
    >
      <Input
        icon={<IconSearch size={16} className="text-muted" />}
        placeholder={placeholder}
        value={
          isOpen
            ? localSearchQuery
            : localSearchQuery ||
              (selectedOptions.length > 0 ? selectedOptions[0].label : '')
        }
        formatValue={formatValue}
        onChange={(e) => {
          if (!isOpen) openDropdown();
          setLocalSearchQuery(e.target.value);
          onSearchChange?.(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => !isOpen && openDropdown()}
        autoComplete="off"
        disabled={isDisabled}
        isLoading={isLoading}
      />

      <span
        className={cn(
          'pointer-events-none absolute inset-y-0 right-2 flex items-center',
          isDisabled && 'opacity-50',
        )}
      >
        {isLoading ? (
          <IconLoader2 size={16} className="animate-spin text-muted" />
        ) : !isIconTrigger ? (
          (icon ?? <IconChevronDown size={small ? 16 : 20} />)
        ) : null}
      </span>
    </div>
  );

  // ──────────────────────────────────────────────────────────
  // 4) Single + No‐Search (a PseudoInput showing one label)
  // ──────────────────────────────────────────────────────────
  const renderPseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn(
        'relative',
        isIconTrigger ? 'w-auto' : 'w-full min-w-0',
        className,
      )}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (!isDisabled) {
          e.stopPropagation();
          isOpen ? closeDropdown() : openDropdown();
        }
      }}
    >
      <PseudoInput
        tabIndex={0}
        error={error}
        disabled={isDisabled}
        className={cn('shadow', {
          // The exact “old” icon‐trigger styling when isIconTrigger is true:
          'flex h-5 w-full cursor-pointer items-center justify-between whitespace-nowrap rounded border-0 border-border bg-subtle px-2 py-1 text-xs shadow-none outline-none ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus-visible:ring-2':
            isIconTrigger,

          // Otherwise, use the normal small/large PseudoInput styles:
          'flex cursor-pointer justify-between': !isIconTrigger,
          'focus-visible:ring-0 focus-visible:ring-offset-0':
            isOpen && !isIconTrigger,
          'hover:shadow-dark': !isDisabled && !isIconTrigger,
          'h-8 px-2 text-sm': small && !isIconTrigger,
          // ← Default size should be text-sm
          'h-10 px-3 text-sm': !small && !isIconTrigger,
          'border-0 bg-subtle shadow-none': muted && !isIconTrigger,
        })}
      >
        <Row
          align="between"
          alignItems="center"
          className={cn('min-w-0', isIconTrigger && 'gap-0')}
        >
          <Row alignItems="center" className="min-w-0 gap-1">
            {selectedOptions[0]?.icon && <span>{selectedOptions[0].icon}</span>}
            {!isIconTrigger && (
              <span
                className={cn(
                  'truncate',
                  selectedOptions.length === 0 && 'text-muted',
                )}
              >
                {selectedOptions.length > 0
                  ? formatValue
                    ? formatValue(selectedOptions[0].label)
                    : selectedOptions[0].label
                  : placeholder}
              </span>
            )}
          </Row>

          <span className={cn('flex items-center', isDisabled && 'opacity-50')}>
            {isLoading ? (
              <IconLoader2 size={16} className="animate-spin text-muted" />
            ) : !isIconTrigger ? (
              (icon ?? <IconChevronDown size={small ? 16 : 20} />)
            ) : null}
          </span>
        </Row>
      </PseudoInput>
    </div>
  );

  // ──────────────────────────────────────────────────────────
  // Choose which of the four to render:
  // ──────────────────────────────────────────────────────────
  if (multiple && hasSearch) {
    return renderMultipleSearchInput();
  } else if (multiple && !hasSearch) {
    return renderMultiplePseudoInput();
  } else if (!multiple && hasSearch) {
    return renderRealInput();
  } else {
    return renderPseudoInput();
  }
}
