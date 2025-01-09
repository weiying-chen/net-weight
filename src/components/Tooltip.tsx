import {
  ReactNode,
  useState,
  useRef,
  useLayoutEffect,
  CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  transient?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className,
  transient = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);

  // Store final tooltip style (top/left) after measurement
  const [style, setStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  });

  // Refs to trigger and tooltip elements
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Show/hide the tooltip
  const handleMouseEnter = () => {
    setIsVisible(true);
  };
  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  /**
   * Calculate tooltip position. We wrap it in a requestAnimationFrame so
   * that layout is stable before measuring. Then we set `isMeasured = true`
   * so that the tooltip becomes visible (no flicker at 0,0).
   */
  useLayoutEffect(() => {
    if (!isVisible) {
      setIsMeasured(false);
      return;
    }

    // Reset measurement so tooltip starts hidden
    setIsMeasured(false);

    requestAnimationFrame(() => {
      const triggerEl = triggerRef.current;
      const tooltipEl = tooltipRef.current;
      if (!triggerEl || !tooltipEl) return;

      const triggerRect = triggerEl.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'bottom':
          top = triggerRect.bottom + window.scrollY;
          left =
            triggerRect.left +
            triggerRect.width / 2 -
            tooltipRect.width / 2 +
            window.scrollX;
          break;
        case 'top':
          top = triggerRect.top - tooltipRect.height + window.scrollY;
          left =
            triggerRect.left +
            triggerRect.width / 2 -
            tooltipRect.width / 2 +
            window.scrollX;
          break;
        case 'left':
          top =
            triggerRect.top +
            triggerRect.height / 2 -
            tooltipRect.height / 2 +
            window.scrollY;
          left = triggerRect.left - tooltipRect.width + window.scrollX;
          break;
        case 'right':
          top =
            triggerRect.top +
            triggerRect.height / 2 -
            tooltipRect.height / 2 +
            window.scrollY;
          left = triggerRect.right + window.scrollX;
          break;
      }

      // Optional spacing
      const spacing = 0;
      if (position === 'top') top -= spacing;
      if (position === 'bottom') top += spacing;
      if (position === 'left') left -= spacing;
      if (position === 'right') left += spacing;

      setStyle((prev) => ({
        ...prev,
        top,
        left,
      }));

      setIsMeasured(true);
    });
  }, [isVisible, position]);

  /**
   * We only portal the tooltip if isVisible. Inside the portal, we do:
   * - Use `invisible` class (or style) if we haven’t measured yet, so user
   *   doesn’t see flicker at the wrong position.
   * - Add a slight scale + opacity transition for a smooth appearance.
   */
  return (
    <>
      {/* The trigger element in normal flow */}
      <div
        ref={triggerRef}
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={style}
            className={cn(
              'pointer-events-none transform rounded bg-foreground px-3 py-2 text-sm text-background shadow',
              'whitespace-nowrap transition duration-200 ease-in-out',
              // Slight scale/opacity transition
              isMeasured ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
              // Hide it (no flicker) until measured:
              !isMeasured && 'invisible',
            )}
            // If "transient" is true, hide on tooltip mouseenter
            onMouseEnter={transient ? handleMouseLeave : undefined}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
