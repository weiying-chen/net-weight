import {
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
} from 'react';
import { cn } from '@/utils';
import { Row } from '@/components/Row';
import { PseudoInput } from '@/components/PseudoInput';
import { Input } from '@/components/Input';
import { Tag } from '@/components/Tag';
import { IconChevronDown, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { SelectOption } from '@/components/SelectDropdown';

export type SelectTriggerProps<T> = {
  multiple: boolean;
  hasSearch: boolean;
  selectedOptions: SelectOption<T>[];
  placeholder: string;
  isOpen: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  small: boolean;
  isIconTrigger: boolean;
  muted: boolean;
  error?: string;
  icon?: ReactNode;
  formatValue?: (label: string) => string;
  localSearchQuery: string;
  onSearchChange?: (query: string) => void;
  openDropdown: () => void;
  closeDropdown: () => void;
  handleOptionClick: (
    opt: SelectOption<T>,
    e: ReactMouseEvent<HTMLLIElement> | null,
  ) => void;
  handleKeyDown: (
    e: ReactKeyboardEvent<HTMLDivElement | HTMLInputElement>,
  ) => void;
  setLocalSearchQuery: (query: string) => void;
  className?: string;
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
  // Clear search query whenever the dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setLocalSearchQuery('');
    }
  }, [isOpen, setLocalSearchQuery]);

  // Create a ref for the <input> in “Multi + Search” mode
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ——————————————————————————————————————————————————————————————————
  // 1) Multi + No-Search (render tags inside a PseudoInput that wraps)
  // ——————————————————————————————————————————————————————————————————
  const renderMultiplePseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full min-w-0', className)}
      onKeyDown={handleKeyDown}
      onClickCapture={(e) => {
        // If click originated from a <button> (i.e., the IconX), do nothing here
        if ((e.target as HTMLElement).closest('button')) return;

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
          'flex cursor-pointer flex-wrap items-center gap-1 shadow',
          {
            'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
            'hover:shadow-dark': !isDisabled,
            'h-8 px-2 text-sm': small && !isIconTrigger,
            'h-10 px-3 text-sm': !small && !isIconTrigger,
            'border-0 bg-subtle shadow-none': muted,
            'flex h-5 cursor-pointer items-center justify-between whitespace-nowrap rounded border-0 bg-subtle px-2 py-1 text-xs shadow-none outline-none ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus-visible:ring-2':
              isIconTrigger,
          },
        )}
      >
        <Row alignItems="center" className="min-w-0 flex-1 flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <Tag
              key={opt.value}
              onRemove={() => handleOptionClick(opt, null)}
              removeIconSize={12}
              className="h-5 px-2 py-1 text-xs"
            >
              {opt.label}
            </Tag>
          ))}
          {selectedOptions.length === 0 && (
            <span className="text-muted">{placeholder}</span>
          )}
        </Row>

        <span className={cn('flex items-center', isDisabled && 'opacity-50')}>
          {isLoading ? (
            <IconLoader2 size={16} className="animate-spin text-muted" />
          ) : !isIconTrigger ? (
            (icon ?? <IconChevronDown size={small ? 16 : 20} />)
          ) : null}
        </span>
      </PseudoInput>
    </div>
  );

  // ——————————————————————————————————————————————————————————————————
  // 2) Multi + Search (render tags + an unstyled <input>, wrapping)
  // ——————————————————————————————————————————————————————————————————
  const renderMultipleSearchInput = () => {
    return (
      <div
        ref={triggerRef}
        className={cn(
          'relative flex w-full cursor-text flex-wrap items-center gap-1 rounded border border-border bg-background p-2',
          className,
        )}
        onClickCapture={(e) => {
          // Prevent toggling when clicking the Tag’s remove-button
          if ((e.target as HTMLElement).closest('button')) return;

          if (!isDisabled) {
            if (!isOpen) openDropdown();
            // Always focus the <input> when clicking anywhere in this wrapper
            searchInputRef.current?.focus();
          }
        }}
      >
        {selectedOptions.map((opt) => (
          <Tag
            key={opt.value}
            onRemove={() => handleOptionClick(opt, null)}
            removeIconSize={12}
            className="h-5 px-2 py-1 text-xs"
          >
            {opt.label}
          </Tag>
        ))}

        <input
          ref={searchInputRef}
          type="text"
          // Only show placeholder when no tags are selected
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          value={localSearchQuery}
          onChange={(e) => {
            if (!isOpen) openDropdown();
            setLocalSearchQuery(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleKeyDown(e as any);
              setLocalSearchQuery('');
              return;
            }
            if (
              e.key === 'Backspace' &&
              localSearchQuery === '' &&
              selectedOptions.length > 0
            ) {
              e.preventDefault();
              const last = selectedOptions[selectedOptions.length - 1];
              handleOptionClick(last, null);
            } else {
              handleKeyDown(e as any);
            }
          }}
          autoComplete="off"
          disabled={isDisabled}
          className={cn(
            'placeholder:text-muted-foreground min-w-[1px] max-w-full flex-grow border-none bg-transparent px-[1px] py-0 text-sm outline-none transition-colors focus-visible:ring-0',
            { 'cursor-not-allowed opacity-50': isDisabled },
          )}
          style={{
            width:
              localSearchQuery.length === 0
                ? '1ch'
                : `${localSearchQuery.length + 1}ch`,
          }}
        />

        <span className={cn('flex items-center', isDisabled && 'opacity-50')}>
          {
            isLoading ? (
              <IconLoader2 size={16} className="animate-spin text-muted" />
            ) : null /* No chevron when hasSearch is true */
          }
        </span>
      </div>
    );
  };

  // ——————————————————————————————————————————————————————————————————
  // 3) Single + Search (uses <Input> with IconSearch)
  // ——————————————————————————————————————————————————————————————————
  const renderRealInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full', className)}
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
        {
          isLoading ? (
            <IconLoader2 size={16} className="animate-spin text-muted" />
          ) : null /* No chevron when hasSearch is true */
        }
      </span>
    </div>
  );

  // ——————————————————————————————————————————————————————————————————
  // 4) Single + No-Search (renders a PseudoInput)
  // ——————————————————————————————————————————————————————————————————
  const renderPseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full min-w-0', className)}
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
          'flex h-5 w-full cursor-pointer items-center justify-between whitespace-nowrap rounded border-0 border-border bg-subtle px-2 py-1 text-xs shadow-none outline-none ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus-visible:ring-2':
            isIconTrigger,
          'flex cursor-pointer justify-between': !isIconTrigger,
          'focus-visible:ring-0 focus-visible:ring-offset-0':
            isOpen && !isIconTrigger,
          'hover:shadow-dark': !isDisabled && !isIconTrigger,
          'h-8 px-2 text-sm': small && !isIconTrigger,
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
              (icon ?? <IconChevronDown size={16} />)
            ) : null}
          </span>
        </Row>
      </PseudoInput>
    </div>
  );

  // Pick which version to render:
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
