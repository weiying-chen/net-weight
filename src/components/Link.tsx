import { AnchorHTMLAttributes } from 'react';
import { cn } from '@/utils';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href?: string | null;
};

export const Link: React.FC<LinkProps> = ({
  className,
  children,
  href,
  ...props
}) => {
  return (
    <a
      {...props}
      href={href ?? '#'}
      className={cn(
        'flex max-w-full items-center gap-2 underline-offset-4 hover:underline',
        className,
      )}
    >
      {children}
    </a>
  );
};
