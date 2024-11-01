import { HTMLAttributes } from 'react';
import { cn } from '@/utils';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  size?: 'sm' | 'md' | 'lg';
  isFull?: boolean;
  hasBorder?: boolean;
};

export function Heading({
  size = 'md',
  isFull,
  hasBorder,
  className,
  children,
  ...props
}: HeadingProps) {
  const cnFromSize = {
    sm: 'text-sm uppercase',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <h2
      className={cn(
        'max-w-full overflow-hidden text-ellipsis text-nowrap font-semibold tracking-tight',
        cnFromSize[size],
        { 'w-full': isFull },
        { 'border-b border-border pb-2': hasBorder },
        className,
      )}
      {...props} // Spread additional props here
    >
      {children}
    </h2>
  );
}
