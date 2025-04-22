import { ReactNode, useState, useRef, useEffect, CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  transient?: boolean;
}

const TOOLTIP_OFFSET = { x: 10, y: 10 };

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className,
  transient = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    requestAnimationFrame(() => {
      if (!tooltipRef.current) return;

      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = event.clientY + window.scrollY + TOOLTIP_OFFSET.y;
      let left = event.clientX + window.scrollX + TOOLTIP_OFFSET.x;

      // Prevent bottom overflow
      if (
        event.clientY + TOOLTIP_OFFSET.y + tooltipRect.height >
        viewportHeight
      ) {
        top =
          event.clientY +
          window.scrollY -
          TOOLTIP_OFFSET.y -
          tooltipRect.height;
      }
      // Prevent right overflow
      if (
        event.clientX + TOOLTIP_OFFSET.x + tooltipRect.width >
        viewportWidth
      ) {
        left = window.scrollX + viewportWidth - tooltipRect.width - 5;
      }
      // Prevent left overflow
      if (left < window.scrollX) {
        left = window.scrollX + 5;
      }

      setStyle((prev) => ({ ...prev, top, left }));
      setIsMeasured(true);
    });
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsMeasured(false);
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      {shouldRender &&
        createPortal(
          <div
            ref={tooltipRef}
            style={style}
            className={cn(
              'pointer-events-none transform rounded bg-foreground px-3 py-2 text-sm text-background shadow',
              'max-w-[250px] whitespace-pre-line transition duration-200 ease-in-out',
              isVisible && isMeasured
                ? 'scale-100 opacity-100'
                : 'scale-95 opacity-0',
              isVisible && !isMeasured && 'invisible',
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
