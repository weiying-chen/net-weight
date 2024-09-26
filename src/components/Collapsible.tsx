import { cn } from '@/utils';
import { useRef, ReactNode } from 'react';

type CollapsibleProps = {
  collapsed?: boolean;
  className?: string;
  children: ReactNode;
};

export const Collapsible = ({
  collapsed = true,
  className,
  children,
}: CollapsibleProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  let maxHeight = '0px';

  if (contentRef.current && !collapsed) {
    maxHeight = `${contentRef.current.scrollHeight}px`;
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        'w-full overflow-hidden transition-all duration-300 ease-in-out',
        className,
      )}
      style={{
        maxHeight: maxHeight,
      }}
    >
      {children}
    </div>
  );
};
