import { HTMLAttributes } from 'react';
import { cn } from '@/utils';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-border bg-white p-6 shadow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
