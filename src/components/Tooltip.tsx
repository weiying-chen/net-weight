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
  content: React.ReactNode;
  className?: string;
  transient?: boolean;
  /** width in px; omit for auto-size */
  width?: number;
}

const TOOLTIP_OFFSET = 10;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className,
  transient = false,
  width,
}) => {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    visibility: 'hidden',
    ...(width != null ? { width } : {}),
  });

  const ref = useRef<HTMLDivElement>(null);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const position = (x: number, y: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;

    // 1) If no prop-width AND we haven't yet set style.width, lock in full box-width now:
    if (width == null && style.width == null) {
      setStyle((s) => ({ ...s, width: rect.width }));
      return; // wait for next frame to do the clamp+reveal
    }

    // 2) Clamp & reveal
    const top = Math.min(
      Math.max(y + TOOLTIP_OFFSET, TOOLTIP_OFFSET),
      vh - rect.height - TOOLTIP_OFFSET,
    );
    const left = Math.min(
      Math.max(x + TOOLTIP_OFFSET, TOOLTIP_OFFSET),
      vw - rect.width - TOOLTIP_OFFSET,
    );

    setStyle((s) => ({
      ...s,
      top,
      left,
      visibility: 'visible',
    }));
  };

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    lastPos.current = { x: e.clientX, y: e.clientY };
    setVisible(true);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    lastPos.current = { x: e.clientX, y: e.clientY };
    position(e.clientX, e.clientY);
  };
  const onLeave = () => {
    setVisible(false);
    // reset so next time we re-measure if necessary
    setStyle((s) => ({
      ...s,
      visibility: 'hidden',
      top: 0,
      left: 0,
      ...(width != null ? {} : { width: undefined }),
    }));
  };

  // Measure & position *before* paint any time we go visible or width changes
  useLayoutEffect(() => {
    if (visible) {
      position(lastPos.current.x, lastPos.current.y);
    }
  }, [visible, width]);

  return (
    <>
      <div
        className={cn(className)}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={ref}
            style={style}
            className={cn(
              'pointer-events-none fixed rounded bg-foreground px-3 py-2 text-sm text-background shadow',
              'whitespace-pre transition duration-150 ease-in-out',
            )}
            onMouseEnter={transient ? onLeave : undefined}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
