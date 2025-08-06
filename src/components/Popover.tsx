import {
  useState,
  useRef,
  useLayoutEffect,
  ReactNode,
  KeyboardEvent,
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

    // vertical flip
    const spaceBelow = window.innerHeight - trig.bottom;
    setDropdownVertical(spaceBelow < drop.height ? 'top' : 'bottom');

    // horizontal flip
    const spaceRight = window.innerWidth - trig.left;
    setDropdownHorizontal(spaceRight < drop.width ? 'right' : 'left');
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    adjustPosition();
    const onResize = () => adjustPosition();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  const handleTriggerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.stopPropagation();
    setOpen(!isOpen);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Escape') setOpen(false);
  };

  // close when clicking outside
  useLayoutEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement;
      if (
        triggerRef.current?.contains(tgt) ||
        dropdownRef.current?.contains(tgt)
      )
        return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

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
      onKeyDown={handleKeyDown}
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
              // horizontal
              dropdownHorizontal === 'left' ? 'left-0' : 'right-0',
              // vertical
              dropdownVertical === 'bottom'
                ? 'top-full mt-1'
                : 'bottom-full mb-1',
            )}
          >
            {asContent}
          </div>
        )}
      </div>
    </Col>
  );
};
