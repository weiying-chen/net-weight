import { cn } from '@/utils';
import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2',
    left: 'right-full top-1/2 transform -translate-y-1/2',
    right: 'left-full top-1/2 transform -translate-y-1/2',
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div
        className={cn(
          'absolute z-50 transform rounded bg-foreground px-2 py-1 text-sm text-background shadow',
          'transition duration-200 ease-in-out',
          'whitespace-nowrap',
          positionClasses[position],
          isVisible
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        {content}
      </div>
    </div>
  );
};
