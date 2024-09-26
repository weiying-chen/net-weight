import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/utils';

type RowProps = HTMLAttributes<HTMLDivElement> & {
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'between' | 'stretch';
  alignItems?: 'start' | 'center' | 'end' | 'between' | 'stretch';
  locked?: boolean;
  className?: string;
  children: ReactNode;
};

export function Row({
  gap = 'md',
  align = 'start',
  alignItems = 'start',
  locked = false,
  className,
  children,
  ...props
}: RowProps) {
  const cnFromGap = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
    xl: 'gap-6',
  };

  const cnFromAlign = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    stretch: 'justify-stretch',
  };

  const cnFromAlignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    between: 'items-between',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={cn(
        'flex w-full',
        cnFromGap[gap],
        cnFromAlign[align],
        cnFromAlignItems[alignItems],
        { 'flex-col md:flex-row': !locked },
        className,
      )}
      {...props} // Spread the props to allow attributes like onClick
    >
      {children}
    </div>
  );
}
