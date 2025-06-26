import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';

interface TooltipProps {
  children: ReactNode;
  content: React.ReactNode;
  className?: string;
  transient?: boolean;
  /**
   * Width in pixels. If you pass a number (e.g. 200), the tooltip will be 200px wide.
   * If omitted, the tooltip will size itself to fit its content exactly (no wrapping).
   */
  width?: number;
}

const TOOLTIP_OFFSET = { x: 10, y: 10 };

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className,
  transient = false,
  width,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    ...(width != null ? { width } : {}),
  });

  const tooltipRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // clamp & position logic
  const positionTooltip = (clientX: number, clientY: number) => {
    if (!tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    let top = clientY + window.scrollY + TOOLTIP_OFFSET.y;
    let left = clientX + window.scrollX + TOOLTIP_OFFSET.x;

    // vertical clamp
    const maxTop = window.scrollY + vh - rect.height - 5;
    top = Math.min(Math.max(top, window.scrollY + 5), maxTop);

    // horizontal clamp
    const maxLeft = window.scrollX + vw - rect.width - 5;
    left = Math.min(Math.max(left, window.scrollX + 5), maxLeft);

    setStyle((prev) => ({ ...prev, top, left }));
    setIsMeasured(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    setShouldRender(true);
    setIsVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    positionTooltip(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // measure natural width and clamp on mount
  useLayoutEffect(() => {
    if (!shouldRender) return;

    if (width == null && tooltipRef.current) {
      // lock in the natural width (pre-wrap)
      const naturalW = tooltipRef.current.scrollWidth;
      setStyle((prev) => ({ ...prev, width: naturalW }));
    }

    positionTooltip(mousePos.current.x, mousePos.current.y);
  }, [shouldRender, width]);

  // fade-out & unmount
  useEffect(() => {
    if (!isVisible) {
      const t = window.setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  // reset measurement
  useEffect(() => {
    if (!isVisible) setIsMeasured(false);
  }, [isVisible]);

  // respond to width prop changes
  useEffect(() => {
    setStyle((prev) => ({
      ...prev,
      ...(width != null ? { width } : { width: undefined }),
    }));
  }, [width]);

  return (
    <>
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
              'whitespace-nowrap transition duration-200 ease-in-out',
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
