import { ReactNode } from 'react';
import { cn } from '@/utils';

type HeadingProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  isFull?: boolean;
  hasBorder?: boolean;
};

export function Heading({
  size = 'md',
  className,
  children,
  isFull,
  hasBorder,
}: HeadingProps) {
  const cnFromSize = {
    sm: 'text-base uppercase',
    // md: 'text-xl',
    // lg: 'text-2xl',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <h2
      className={cn(
        'max-w-full overflow-hidden text-ellipsis text-nowrap font-semibold tracking-tight',
        cnFromSize[size],
        { 'w-full': isFull },
        // The "margin" will be set by the `gap`
        { 'border-b border-border pb-2': hasBorder },
        className,
      )}
    >
      {children}
    </h2>
  );
}
