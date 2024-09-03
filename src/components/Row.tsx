import { ReactNode } from 'react';
import { cn } from '@/utils';

type RowProps = {
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'between';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  children: ReactNode;
};

export function Row({
  gap = 'md',
  // What should the default be?
  align = 'start',
  alignItems = 'start',
  className,
  children,
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
  };

  const cnFromAlignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col md:flex-row',
        cnFromGap[gap],
        cnFromAlign[align],
        cnFromAlignItems[alignItems],
        className,
      )}
    >
      {children}
    </div>
  );
}
