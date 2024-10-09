import { cn } from '@/utils';
import { useRef, ReactNode, useState, useEffect } from 'react';

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
  const [maxHeight, setMaxHeight] = useState('0px');

  const updateMaxHeight = () => {
    if (contentRef.current && !collapsed) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  };

  useEffect(() => {
    updateMaxHeight();

    const handleResize = () => {
      updateMaxHeight();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed]);

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
