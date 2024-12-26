import { cn } from '@/utils';
import { ReactNode, useState } from 'react';

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

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2',
    left: 'right-full top-1/2 transform -translate-y-1/2',
    right: 'left-full top-1/2 transform -translate-y-1/2',
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        className={cn(
          'absolute z-50 transform rounded bg-foreground px-3 py-2 text-sm text-background shadow',
          'transition duration-200 ease-in-out',
          'whitespace-nowrap',
          positionClasses[position],
          isVisible
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
        onMouseEnter={transient ? handleMouseLeave : undefined}
        // onMouseLeave={handleMouseLeave}
      >
        {content}
      </div>
    </div>
  );
};
