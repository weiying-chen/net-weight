import {
  useState,
  useRef,
  useLayoutEffect,
  ReactNode,
  MouseEvent,
} from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconChevronDown } from '@tabler/icons-react';
import { PseudoInput } from '@/components/PseudoInput';
import { Row } from '@/components/Row';
import { Tooltip } from '@/components/Tooltip';

export type PopoverProps = {
  label: ReactNode;
  asContent: ReactNode;
  tooltip?: ReactNode;
  className?: string;
  disabled?: boolean;
  small?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** If true, makes the trigger a fixed square */
  isSquare?: boolean;
  /** If true, hides the default Chevron icon */
  hideChevron?: boolean;
};

export const Popover = ({
  label,
  asContent,
  tooltip,
  className,
  disabled = false,
  small = false,
  open,
  onOpenChange,
  isSquare = false,
  hideChevron = false,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;

  const [dropdownVertical, setDropdownVertical] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const [dropdownHorizontal, setDropdownHorizontal] = useState<
    'left' | 'right'
  >('left');

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setInternalOpen(v);
  };

  const adjustPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;
    const trig = triggerRef.current.getBoundingClientRect();
    const drop = dropdownRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - trig.bottom;
    const spaceAbove = trig.top;

    if (spaceBelow >= drop.height || spaceBelow >= spaceAbove) {
      setDropdownVertical('bottom');
    } else {
      setDropdownVertical('top');
    }

    // horizontal flip
    const spaceRight = window.innerWidth - trig.left;
    if (spaceRight < drop.width && trig.right > drop.width) {
      setDropdownHorizontal('right');
    } else {
      setDropdownHorizontal('left');
    }
  };

  // keep your positioning logic
  useLayoutEffect(() => {
    if (!isOpen) return;
    adjustPosition();
    const onResize = () => adjustPosition();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  // stop pointer events in the dropdown from reaching document (capture)
  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = dropdownRef.current;
    if (!el) return;

    const stop = (e: PointerEvent) => e.stopPropagation();
    el.addEventListener('pointerdown', stop, true); // capture phase
    return () => el.removeEventListener('pointerdown', stop, true);
  }, [isOpen]);

  const handleTriggerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.stopPropagation();
    setOpen(!isOpen);
  };

  // close when clicking outside (but allow portals marked data-popover-keepopen)
  useLayoutEffect(() => {
    if (!isOpen) return;

    const onPointerDownDoc = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      const insideTrigger = !!triggerRef.current?.contains(t);
      const insideDropdown = !!dropdownRef.current?.contains(t);
      const keepOpen = !!t.closest('[data-popover-keepopen]');

      if (insideTrigger || insideDropdown || keepOpen) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDownDoc);
    return () => document.removeEventListener('pointerdown', onPointerDownDoc);
  }, [isOpen]);

  // close on Escape (global, avoids typing issues on PseudoInput)
  useLayoutEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const pseudoInput = (
    <PseudoInput
      tabIndex={0}
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center gap-2 shadow',
        {
          'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
          'hover:shadow-dark': !disabled,
          'h-5 px-2 py-1 text-xs': small && !isSquare,
          'h-10 w-10 justify-center px-0 py-0': isSquare,
        },
        className,
      )}
      onClick={handleTriggerClick}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    >
      <Row alignItems="center" className="font-medium" locked fluid>
        {label}
      </Row>
      {!hideChevron && <IconChevronDown size={small ? 16 : 20} />}
    </PseudoInput>
  );

  return (
    <Col fluid>
      <div ref={triggerRef} className="relative inline-block">
        {tooltip && !isOpen ? (
          <Tooltip content={tooltip}>{pseudoInput}</Tooltip>
        ) : (
          pseudoInput
        )}

        {isOpen && (
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'absolute z-50 cursor-default rounded border border-border bg-background p-4 shadow',
              dropdownHorizontal === 'left' ? 'left-0' : 'right-0', // horizontal
              dropdownVertical === 'bottom'
                ? 'top-full mt-1'
                : 'bottom-full mb-1', // vertical
            )}
          >
            {asContent}
          </div>
        )}
      </div>
    </Col>
  );
};
