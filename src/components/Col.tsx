import { ReactNode } from 'react';
import { cn } from '@/utils';

type ColProps = {
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'between' | 'stretch';
  alignItems?: 'start' | 'center' | 'end' | 'between' | 'stretch';
  className?: string;
  children: ReactNode;
};

export function Col({
  gap = 'md',
  // What should the default be?
  align = 'start',
  alignItems = 'start',
  className,
  children,
}: ColProps) {
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
        'flex w-full flex-col',
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
