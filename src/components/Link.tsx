import { AnchorHTMLAttributes } from 'react';
import { cn } from '@/utils';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link: React.FC<LinkProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <a
      {...props}
      className={cn(
        'flex max-w-full items-center gap-2 underline-offset-4 hover:underline',
        className,
      )}
    >
      {children}
    </a>
  );
};
