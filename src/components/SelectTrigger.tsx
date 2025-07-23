import {
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils';
import { Row } from '@/components/Row';
import { PseudoInput } from '@/components/PseudoInput';
import { Input } from '@/components/Input';
import { Tag } from '@/components/Tag';
import { IconChevronDown, IconSearch, IconLoader2 } from '@tabler/icons-react';
import { SelectOption } from '@/components/SelectDropdown';

export type SelectTriggerProps<
  T extends string | number | boolean | null | undefined,
> = {
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

export function SelectTrigger<
  T extends string | number | boolean | null | undefined,
>({
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
  useEffect(() => {
    if (!isOpen) {
      setLocalSearchQuery('');
    }
  }, [isOpen, setLocalSearchQuery]);

  const tagsRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const moreRef = useRef<HTMLSpanElement>(null);

  const [fitCount, setFitCount] = useState<number>(selectedOptions.length);

  const computeFitCount = () => {
    if (!tagsRef.current || !chevronRef.current || !moreRef.current) {
      const newCount = selectedOptions.length;
      if (newCount !== fitCount) {
        setFitCount(newCount);
      }
      return;
    }

    const children = Array.from(tagsRef.current.children) as HTMLElement[];
    const totalTags = children.length;

    if (totalTags === 0) {
      if (fitCount !== 0) {
        setFitCount(0);
      }
      return;
    }

    const firstLineTop = children[0].offsetTop;
    let firstLineCount = 0;
    for (let i = 0; i < totalTags; i++) {
      if (children[i].offsetTop !== firstLineTop) break;
      firstLineCount++;
    }

    const lastFirstLineTag = children[firstLineCount - 1];
    const lastRect = lastFirstLineTag.getBoundingClientRect();
    const chevronRect = chevronRef.current.getBoundingClientRect();

    const chevronStyles = getComputedStyle(chevronRef.current);
    const chevronPadLeft = parseFloat(chevronStyles.paddingLeft);
    const chevronPadRight = parseFloat(chevronStyles.paddingRight);
    const chevronTotalWidth =
      chevronRect.width + chevronPadLeft + chevronPadRight;
    const BUFFER = 8;
    const THRESHOLD = Math.round(chevronTotalWidth + BUFFER);

    const rawGap = chevronRect.left - lastRect.right;
    const flooredGap = Math.floor(rawGap);

    if (firstLineCount < totalTags) {
      if (firstLineCount !== fitCount) {
        setFitCount(firstLineCount);
      }
      return;
    }

    const moreStyles = getComputedStyle(moreRef.current);
    const moreMarginLeft = parseFloat(moreStyles.marginLeft);
    const moreMarginRight = parseFloat(moreStyles.marginRight);
    const moreTotalWidth =
      moreRef.current.offsetWidth + moreMarginLeft + moreMarginRight;

    if (flooredGap >= THRESHOLD + moreTotalWidth) {
      if (totalTags !== fitCount) {
        setFitCount(totalTags);
      }
      return;
    }

    let cumulative = 0;
    let count = 0;
    const containerLeft = tagsRef.current.getBoundingClientRect().left;
    const maxAllowable =
      chevronRect.left - containerLeft - THRESHOLD - moreTotalWidth;

    for (let i = 0; i < totalTags; i++) {
      const el = children[i];
      if (el.offsetTop !== firstLineTop) break;

      const style = getComputedStyle(el);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const elWidth = el.offsetWidth + marginLeft + marginRight;
      const nextCumulative = cumulative + elWidth;

      if (nextCumulative > maxAllowable) {
        break;
      }

      cumulative = nextCumulative;
      count++;
    }

    if (count !== fitCount) {
      setFitCount(count);
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      computeFitCount();
    }
  }, [selectedOptions, isOpen]);

  useEffect(() => {
    if (!triggerRef.current) return;

    let rafId: number | null = null;
    const observer = new ResizeObserver(() => {
      if (!isOpen) return;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        computeFitCount();
        rafId = null;
      });
    });

    observer.observe(triggerRef.current);
    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [triggerRef, isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => computeFitCount());
      } else {
        computeFitCount();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const renderMultiTagsSummary = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted">{placeholder}</span>;
    }

    if (fitCount >= selectedOptions.length) {
      return (
        <>
          {selectedOptions.map((opt) => (
            <Tag
              key={String(opt.value)}
              onRemove={() => handleOptionClick(opt, null)}
              removeIconSize={12}
              className="h-5 px-2 py-1 text-xs"
            >
              {opt.label}
            </Tag>
          ))}
        </>
      );
    }

    const visible = selectedOptions.slice(0, fitCount);
    const hiddenCount = selectedOptions.length - fitCount;
    return (
      <>
        {visible.map((opt) => (
          <Tag
            key={String(opt.value)}
            onRemove={() => handleOptionClick(opt, null)}
            removeIconSize={12}
            className="h-5 px-2 py-1 text-xs"
          >
            {opt.label}
          </Tag>
        ))}

        {/* 
          Attach a ref here so computeFitCount can measure its width.
          flex-shrink-0 and whitespace-nowrap ensure it never wraps internally.
        */}
        <span
          ref={moreRef}
          className="flex-shrink-0 whitespace-nowrap px-1 text-sm"
        >
          and {hiddenCount} more
        </span>
      </>
    );
  };

  const renderMultiplePseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full min-w-0', className)}
      onKeyDown={handleKeyDown}
      onClickCapture={(e) => {
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
        className={cn('flex cursor-pointer items-center gap-2 shadow', {
          'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
          'hover:shadow-dark': !isDisabled,
          'h-8 px-2 text-sm': small && !isIconTrigger,
          'h-10 px-3 text-sm': !small && !isIconTrigger,
          'border-0 bg-subtle shadow-none': muted,

          'flex h-5 cursor-pointer items-center justify-between whitespace-nowrap rounded border-0 bg-subtle px-2 py-1 text-xs shadow-none outline-none ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus-visible:ring-2':
            isIconTrigger,
        })}
      >
        {/* Tag container: now flex-nowrap + overflow-hidden */}
        <Row
          ref={tagsRef}
          alignItems="center"
          className="min-w-0 flex-1 flex-nowrap gap-2 overflow-hidden"
        >
          {renderMultiTagsSummary()}
        </Row>

        {/* Chevron/Icon */}
        <span
          ref={chevronRef}
          className={cn('flex items-center', isDisabled && 'opacity-50')}
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

  const renderMultipleSearchInput = () => (
    <div
      ref={triggerRef}
      className={cn(
        'relative flex w-full cursor-text items-center gap-2 rounded border border-border bg-background p-2',
        className,
      )}
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        if (!isDisabled) {
          if (!isOpen) openDropdown();
          searchInputRef.current?.focus();
        }
      }}
    >
      {/* Tag container (only render if there are selected options) */}
      {selectedOptions.length > 0 && (
        <div ref={tagsRef} className="flex flex-wrap items-center gap-2">
          {renderMultiTagsSummary()}
        </div>
      )}

      {/* Search input */}
      <input
        ref={searchInputRef}
        type="text"
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
          'min-w-[1px] max-w-full flex-grow border-none bg-transparent px-[1px] py-0 text-sm outline-none transition-colors placeholder:text-muted focus-visible:ring-0',
          {
            'cursor-not-allowed opacity-50': isDisabled,
          },
        )}
        style={{
          width:
            localSearchQuery.length === 0
              ? '1ch'
              : `${localSearchQuery.length + 1}ch`,
        }}
      />

      {/* Chevron/Icon */}
      <span
        ref={chevronRef}
        className={cn(
          'absolute right-2 flex items-center',
          isDisabled && 'opacity-50',
        )}
      >
        {isLoading && (
          <IconLoader2 size={16} className="animate-spin text-muted" />
        )}
        {!isLoading && <IconChevronDown size={16} />}
      </span>
    </div>
  );

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
        {isLoading && (
          <IconLoader2 size={16} className="animate-spin text-muted" />
        )}
      </span>
    </div>
  );

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
          locked
          className={cn('min-w-0', isIconTrigger && 'gap-0')}
        >
          <Row alignItems="center" className="min-w-0 gap-2" fluid>
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
