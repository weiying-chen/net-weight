import { ReactNode } from 'react';
import { cn } from '@/utils';

type TitleProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
};

export function Title({ size = 'md', className, children }: TitleProps) {
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
        className,
      )}
    >
      {children}
    </h2>
  );
}
