import {
  ReactNode,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
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

  // This controls whether the tooltip is actually in the DOM.
  // Even after isVisible goes false, we keep the tooltip in the DOM
  // long enough to show the fade-out animation.
  const [shouldRender, setShouldRender] = useState(false);

  // Used for hiding flicker on initial measure (positions at 0,0).
  const [isMeasured, setIsMeasured] = useState(false);

  // Final tooltip styles (top/left).
  const [style, setStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  });

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
   * We keep tooltip in the DOM as long as shouldRender = true.
   * When isVisible changes to true => shouldRender = true immediately.
   * When isVisible changes to false => we wait 200ms (the duration of fade-out),
   * then set shouldRender = false (unmount).
   */
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timeoutId = setTimeout(() => setShouldRender(false), 200); // match transition duration
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);

  /**
   * Calculate tooltip position whenever the tooltip becomes "visible".
   * We do this in a requestAnimationFrame so layout is stable before measuring.
   * Then set `isMeasured = true` so that the tooltip transitions in without
   * flickering at (0,0).
   */
  useLayoutEffect(() => {
    if (!isVisible) {
      setIsMeasured(false);
      return;
    }

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

      // Once measured, we'll allow it to be visible in the correct place.
      setIsMeasured(true);
    });
  }, [isVisible, position]);

  return (
    <>
      {/* Trigger element */}
      <div
        ref={triggerRef}
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {shouldRender &&
        createPortal(
          <div
            ref={tooltipRef}
            style={style}
            // Use transitions for fade/scale in & out.
            // If not visible, we apply 'opacity-0 scale-95' (fade out).
            // If measured and visible, 'opacity-100 scale-100' (fade in).
            // If it's visible but not measured, also hide (invisible) to prevent flicker.
            className={cn(
              'pointer-events-none transform rounded bg-foreground px-3 py-2 text-sm text-background shadow',
              'whitespace-nowrap transition duration-200 ease-in-out',
              isVisible && isMeasured
                ? 'scale-100 opacity-100'
                : 'scale-95 opacity-0',
              isVisible && !isMeasured && 'invisible', // Hide while measuring
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
