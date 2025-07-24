import {
  ReactNode,
  useState,
  useRef,
  useLayoutEffect,
  CSSProperties,
  useEffect,
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
// event name for “hide all other tooltips”
const TOOLTIP_HIDE_EVENT = 'tooltip:hide-others';

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
    visibility: 'hidden',
    opacity: 0,
    transform: 'none',
    zIndex: 9999,
    ...(width != null ? { width } : {}),
  });

  // unique ID for this instance
  const myId = useRef(`${Date.now()}-${Math.random()}`).current;
  const ref = useRef<HTMLDivElement>(null);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // hide this tooltip when another broadcasts
  useEffect(() => {
    const onHide = (e: Event) => {
      const otherId = (e as CustomEvent<string>).detail;
      if (otherId !== myId) {
        setVisible(false);
      }
    };
    window.addEventListener(TOOLTIP_HIDE_EVENT, onHide as any);
    return () => window.removeEventListener(TOOLTIP_HIDE_EVENT, onHide as any);
  }, [myId]);

  const position = (x: number, y: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // lock natural width if needed (measure only, don’t return)
    if (width == null && style.width == null) {
      setStyle((s) => ({ ...s, width: rect.width }));
    }

    // clamp into view
    const top = Math.min(
      Math.max(y + TOOLTIP_OFFSET, TOOLTIP_OFFSET),
      vh - rect.height - TOOLTIP_OFFSET,
    );
    const left = Math.min(
      Math.max(x + TOOLTIP_OFFSET, TOOLTIP_OFFSET),
      vw - rect.width - TOOLTIP_OFFSET * 2,
    );

    setStyle((s) => ({
      ...s,
      top,
      left,
      visibility: 'visible',
      opacity: 1,
      transform: 'scale(1)',
      transformOrigin: 'top left',
      transition: 'opacity 150ms ease-in-out, transform 150ms ease-in-out',
    }));
  };

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // tell all others to hide
    window.dispatchEvent(new CustomEvent(TOOLTIP_HIDE_EVENT, { detail: myId }));
    lastPos.current = { x: e.clientX, y: e.clientY };
    setVisible(true);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    lastPos.current = { x: e.clientX, y: e.clientY };
    position(e.clientX, e.clientY);
  };

  const onLeave = () => {
    setVisible(false);
    // reset style
    setStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      visibility: 'hidden',
      opacity: 0,
      transform: 'none',
      zIndex: 9999,
      ...(width != null ? { width } : {}),
    });
  };

  // re‑position before paint when becoming visible
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
              'whitespace-pre-wrap',
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
