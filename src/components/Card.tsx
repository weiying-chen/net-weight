import { ReactNode } from 'react';
import { cn } from '@/utils';

type CardProps = {
  className?: string; // Allows additional custom styles
  children: ReactNode; // Card content
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-lg border border-border bg-white p-4 shadow',
        className,
      )}
    >
      {children}
    </div>
  );
}
