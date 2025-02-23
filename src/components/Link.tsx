import { AnchorHTMLAttributes } from 'react';
import { cn } from '@repo/ui/utils';

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
        'relative inline-flex max-w-full items-center gap-2 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-100 hover:after:scale-x-100',
        className,
      )}
    >
      {children}
    </a>
  );
};
