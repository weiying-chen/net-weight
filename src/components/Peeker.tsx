import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/utils';
import { Button } from '@/components/Button';

export type PeekerProps = {
  collapsed?: boolean;
  peekHeight?: number;
  className?: string;
  children: ReactNode;
};

export const Peeker = ({
  collapsed: initialCollapsed = true,
  peekHeight = 80,
  className,
  children,
}: PeekerProps) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(`${peekHeight}px`);
  const [hovered, setHovered] = useState(false);

  const updateMaxHeight = () => {
    if (!contentRef.current) return;
    setMaxHeight(
      collapsed ? `${peekHeight}px` : `${contentRef.current.scrollHeight}px`,
    );
  };

  useEffect(() => {
    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => {
      window.removeEventListener('resize', updateMaxHeight);
    };
  }, [collapsed, peekHeight]);

  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden transition-all duration-200 ease-in-out',
        className,
      )}
      style={{ maxHeight }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={contentRef}>{children}</div>
      {collapsed && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"
          style={{ height: `${peekHeight}px` }}
        />
      )}
      {hovered && (
        <Button
          variant="secondary"
          className="pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 'Expand' : 'Collapse'}
        </Button>
      )}
    </div>
  );
};
