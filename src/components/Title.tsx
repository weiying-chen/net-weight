import { ReactNode } from 'react';
import { cn } from '@/utils';

type TitleProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  isFull?: boolean;
  hasBorder?: boolean;
};

export function Title({
  size = 'md',
  className,
  children,
  isFull,
  hasBorder,
}: TitleProps) {
  const cnFromSize = {
    sm: 'text-base uppercase',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <h2
      className={cn(
        'font-semibold tracking-tight',
        cnFromSize[size],
        { 'w-full': isFull },
        { 'border-b border-border pb-2': hasBorder },
        className,
      )}
    >
      {children}
    </h2>
  );
}
