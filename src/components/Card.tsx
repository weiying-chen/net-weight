import { ReactNode } from 'react';
import { cn } from '@/utils';

type CardProps = {
  className?: string;
  children: ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-border bg-white p-4 shadow',
        className,
      )}
    >
      {children}
    </div>
  );
}
