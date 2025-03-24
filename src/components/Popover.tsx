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

export type PopoverProps = {
  label: ReactNode;
  asContent: ReactNode;
  className?: string;
  disabled?: boolean;
  small?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export const Popover = ({
  label,
  asContent,
  className,
  disabled = false,
  small = false,
  open,
  onOpenChange,
}: PopoverProps) => {
  // Use controlled state if "open" is provided, otherwise fallback to internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const adjustDropdownPosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const shouldFlip = spaceAbove > spaceBelow;
      setDropdownPosition(shouldFlip ? 'top' : 'bottom');
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      adjustDropdownPosition();
      const handleResize = () => adjustDropdownPosition();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  const handleTriggerClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.stopPropagation();
    setOpen(!isOpen);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Escape') {
      closeDropdown();
    }
  };

  useLayoutEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement;

      // Prevent closing if clicking on an element with `data-state="open"`
      if (target.closest('[data-state="open"]')) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <Col fluid>
      <div
        ref={triggerRef}
        className="relative inline-block"
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
      >
        <PseudoInput
          tabIndex={0}
          disabled={disabled}
          className={cn(
            'flex cursor-pointer items-center gap-2 shadow',
            {
              'focus-visible:ring-0 focus-visible:ring-offset-0': isOpen,
              'hover:shadow-dark': !disabled,
              'h-5 px-2 py-1 text-xs': small,
            },
            className,
          )}
        >
          <Row alignItems="center" className="font-medium" locked>
            {label}
          </Row>
          <IconChevronDown size={small ? 16 : 20} />
        </PseudoInput>

        {isOpen && (
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'absolute left-0 z-50 cursor-default rounded border border-border bg-background p-4 shadow',
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
            )}
          >
            {asContent}
          </div>
        )}
      </div>
    </Col>
  );
};
