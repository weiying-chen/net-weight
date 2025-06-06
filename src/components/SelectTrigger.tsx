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
  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Clear search query whenever the dropdown closes
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setLocalSearchQuery('');
    }
  }, [isOpen, setLocalSearchQuery]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Refs for measuring tag container, chevron, and "and X more" span
  // ─────────────────────────────────────────────────────────────────────────────
  const tagsRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const moreRef = useRef<HTMLSpanElement>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) State: how many tags actually fit before the chevron (accounting for "and X more")
  // ─────────────────────────────────────────────────────────────────────────────
  const [fitCount, setFitCount] = useState<number>(selectedOptions.length);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) computeFitCount() measures the gap, then figures out how many tags fit.
  //    This version detects any wrap and subtracts the "and X more" width.
  //    We only call setFitCount(...) when the new value differs from the old one.
  //    We also log a few intermediate values for debugging.
  // ─────────────────────────────────────────────────────────────────────────────
  const computeFitCount = () => {
    console.log('[SelectTrigger] computeFitCount start', {
      selectedOptions,
      fitCount,
    });

    // ── CASE A: missing refs ─────────────────────────────────────────────
    if (!tagsRef.current || !chevronRef.current || !moreRef.current) {
      const newCount = selectedOptions.length;
      console.log(
        '[SelectTrigger] Missing refs → want setFitCount to:',
        newCount,
      );
      if (newCount !== fitCount) {
        console.log(
          '[SelectTrigger]   ➔ actually updating fitCount to',
          newCount,
        );
        setFitCount(newCount);
      } else {
        console.log('[SelectTrigger]   ➔ skip update (already that value)');
      }
      return;
    }

    const children = Array.from(tagsRef.current.children) as HTMLElement[];
    const totalTags = children.length;
    console.log('[SelectTrigger] totalTags:', totalTags);

    // ── CASE B: no tags at all ────────────────────────────────────────────
    if (totalTags === 0) {
      console.log('[SelectTrigger] totalTags=0 → want setFitCount to 0');
      if (0 !== fitCount) {
        console.log('[SelectTrigger]   ➔ updating fitCount to 0');
        setFitCount(0);
      } else {
        console.log('[SelectTrigger]   ➔ skip update (already 0)');
      }
      return;
    }

    // 4a) Determine how many tags are on the first line
    const firstLineTop = children[0].offsetTop;
    let firstLineCount = 0;
    for (let i = 0; i < totalTags; i++) {
      if (children[i].offsetTop !== firstLineTop) break;
      firstLineCount++;
    }
    console.log('[SelectTrigger] firstLineCount:', firstLineCount);

    // 4b) Get bounding rectangles for the last first-line tag + chevron
    const lastFirstLineTag = children[firstLineCount - 1];
    const lastRect = lastFirstLineTag.getBoundingClientRect();
    const chevronRect = chevronRef.current.getBoundingClientRect();
    console.log(
      '[SelectTrigger] lastRect, chevronRect:',
      lastRect,
      chevronRect,
    );

    // 4c) Build threshold (chevron width + padding + small buffer)
    const chevronStyles = getComputedStyle(chevronRef.current);
    const chevronPadLeft = parseFloat(chevronStyles.paddingLeft);
    const chevronPadRight = parseFloat(chevronStyles.paddingRight);
    const chevronTotalWidth =
      chevronRect.width + chevronPadLeft + chevronPadRight;
    const BUFFER = 4;
    const THRESHOLD = Math.round(chevronTotalWidth + BUFFER);
    console.log('[SelectTrigger] THRESHOLD (chevron + buffer):', THRESHOLD);

    // 4d) Gap between last first-line tag and chevron
    const rawGap = chevronRect.left - lastRect.right;
    const flooredGap = Math.floor(rawGap);
    console.log('[SelectTrigger] rawGap, flooredGap:', rawGap, flooredGap);

    // ── CASE C: at least one tag has wrapped to a second line ───────────
    if (firstLineCount < totalTags) {
      console.log(
        '[SelectTrigger] Tag wrap detected (firstLineCount < totalTags) → want setFitCount to',
        firstLineCount,
      );
      if (firstLineCount !== fitCount) {
        console.log('[SelectTrigger]   ➔ updating fitCount to', firstLineCount);
        setFitCount(firstLineCount);
      } else {
        console.log('[SelectTrigger]   ➔ skip update (already that)');
      }
      return;
    }

    // 4f) Measure width of the “and X more” span
    const moreWidth = moreRef.current.offsetWidth;
    console.log('[SelectTrigger] moreWidth:', moreWidth);

    // If there is enough gap to show all first-line tags + “and X more”, just show them all
    if (flooredGap >= THRESHOLD + moreWidth) {
      console.log(
        '[SelectTrigger] Enough space for all tags → want setFitCount to',
        totalTags,
      );
      if (totalTags !== fitCount) {
        console.log('[SelectTrigger]   ➔ updating fitCount to', totalTags);
        setFitCount(totalTags);
      } else {
        console.log('[SelectTrigger]   ➔ skip update (already that)');
      }
      return;
    }

    // 4g) Otherwise, sum widths + margins one by one, until exceeding maxAllowable
    let cumulative = 0;
    let count = 0;
    const containerLeft = tagsRef.current.getBoundingClientRect().left;
    const maxAllowable =
      chevronRect.left - containerLeft - THRESHOLD - moreWidth;
    console.log('[SelectTrigger] maxAllowable:', maxAllowable);

    for (let i = 0; i < totalTags; i++) {
      const el = children[i];
      if (el.offsetTop !== firstLineTop) break;

      const style = getComputedStyle(el);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const elWidth = el.offsetWidth + marginLeft + marginRight;

      const nextCumulative = cumulative + elWidth;
      if (nextCumulative > maxAllowable) {
        console.log(
          '[SelectTrigger] Breaking at tag index',
          i,
          'nextCumulative',
          nextCumulative,
        );
        break;
      }

      cumulative = nextCumulative;
      count++;
    }
    console.log(
      '[SelectTrigger] Computed count:',
      count,
      'previous fitCount:',
      fitCount,
    );

    // Final guard: only update if the new count is different
    if (count !== fitCount) {
      console.log('[SelectTrigger]   ➔ updating fitCount to', count);
      setFitCount(count);
    } else {
      console.log('[SelectTrigger]   ➔ skip update (no change)');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) Whenever selectedOptions change, re‐compute fitCount BEFORE paint
  // ─────────────────────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    console.log(
      '[SelectTrigger] useLayoutEffect triggered by selectedOptions change:',
      selectedOptions,
    );
    computeFitCount();
  }, [selectedOptions]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) Also re‐compute fitCount whenever the trigger container resizes
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!triggerRef.current) return;
    const observer = new ResizeObserver(() => {
      console.log('[SelectTrigger] ResizeObserver callback');
      computeFitCount();
    });
    observer.observe(triggerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [triggerRef]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) Ref for the <input> in “Multi + Search” mode
  // ─────────────────────────────────────────────────────────────────────────────
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 8) renderMultiTagsSummary(): either all tags or “first + X more”
  // ─────────────────────────────────────────────────────────────────────────────
  const renderMultiTagsSummary = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted">{placeholder}</span>;
    }

    // If fitCount ≥ total, just show every tag
    if (fitCount >= selectedOptions.length) {
      return (
        <>
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
        </>
      );
    }

    // Otherwise, show only the first fitCount tags + “and {remaining} more”
    const visible = selectedOptions.slice(0, fitCount);
    const hiddenCount = selectedOptions.length - fitCount;
    return (
      <>
        {visible.map((opt) => (
          <Tag
            key={opt.value}
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 9) Four “modes” of rendering (identical to your original logic, except flex-wrap → flex-nowrap)
  // ─────────────────────────────────────────────────────────────────────────────

  // 9.1) Multi + No‐Search (render tags inside a PseudoInput)
  const renderMultiplePseudoInput = () => (
    <div
      ref={triggerRef}
      className={cn('relative w-full min-w-0', className)}
      onKeyDown={handleKeyDown}
      onClickCapture={(e) => {
        // If click came from a <button> (the tag’s “×”), do nothing
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
        className={cn('flex cursor-pointer items-center gap-1 shadow', {
          'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
          'hover:shadow-dark': !isDisabled,
          'h-8 px-2 text-sm': small && !isIconTrigger,
          'h-10 px-3 text-sm': !small && !isIconTrigger,
          'border-0 bg-subtle shadow-none': muted,
          // If using icon-trigger styling:
          'flex h-5 cursor-pointer items-center justify-between whitespace-nowrap rounded border-0 bg-subtle px-2 py-1 text-xs shadow-none outline-none ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus-visible:ring-2':
            isIconTrigger,
        })}
      >
        {/* Tag container: now flex-nowrap + overflow-hidden */}
        <Row
          ref={tagsRef}
          alignItems="center"
          className="min-w-0 flex-1 flex-nowrap gap-1 overflow-hidden"
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

  // 9.2) Multi + Search (render tags + <input>)
  const renderMultipleSearchInput = () => (
    <div
      ref={triggerRef}
      className={cn(
        'relative flex w-full cursor-text items-center gap-1 rounded border border-border bg-background p-2',
        className,
      )}
      onClickCapture={(e) => {
        // Prevent toggling when clicking the Tag’s “×”
        if ((e.target as HTMLElement).closest('button')) return;
        if (!isDisabled) {
          if (!isOpen) openDropdown();
          searchInputRef.current?.focus();
        }
      }}
    >
      {/* Tag container (only render if there are selected options) */}
      {selectedOptions.length > 0 && (
        <div ref={tagsRef} className="flex flex-wrap items-center gap-1">
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

  // 9.3) Single + Search
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

  // 9.4) Single + No-Search
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 10) Pick which “mode” to render:
  // ─────────────────────────────────────────────────────────────────────────────
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
