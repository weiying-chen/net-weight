import { ReactNode, useState, useRef, useEffect, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  transient?: boolean;
}

const TOOLTIP_OFFSET = { x: 10, y: 10 }; // Offset for tooltip positioning

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className,
  transient = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  });

  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const tooltipRect = tooltipRef.current?.getBoundingClientRect() || {
      width: 0,
      height: 0,
    };

    let top = event.clientY + TOOLTIP_OFFSET.y;
    let left = event.clientX + TOOLTIP_OFFSET.x;

    // Prevent the tooltip from extending beyond the viewport
    if (top + tooltipRect.height > viewportHeight) {
      top = event.clientY - TOOLTIP_OFFSET.y - tooltipRect.height;
    }
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 5; // 5px margin
    }
    if (left < 0) {
      left = 5; // Ensure at least 5px from the left edge
    }

    setTooltipPosition((prev) => ({
      ...prev,
      top,
      left,
    }));
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timeoutId = setTimeout(() => setShouldRender(false), 200); // Match transition duration
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);

  return (
    <>
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove} // Track cursor movement
      >
        {children}
      </div>

      {shouldRender &&
        createPortal(
          <div
            ref={tooltipRef}
            style={tooltipPosition}
            className={cn(
              'pointer-events-none fixed z-20 transform whitespace-nowrap rounded bg-foreground px-3 py-2 text-sm text-background shadow',
              'transition-opacity duration-200 ease-in-out',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
            onMouseEnter={transient ? handleMouseLeave : undefined}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
