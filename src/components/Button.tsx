import { ReactNode, ButtonHTMLAttributes } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
  locked?: boolean;
  isFull?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  isLoading = false,
  locked = false,
  isFull = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const cnFromVariant = {
    primary: 'text-background bg-primary',
    secondary: 'text-foreground bg-secondary',
    success: 'text-background bg-success',
    danger: 'text-background bg-danger',
  };

  return (
    <button
      className={cn(
        'flex h-10 items-center justify-center rounded border border-border px-4 py-2 text-sm font-medium shadow ring-foreground ring-offset-2 focus:outline-none focus-visible:ring-2',
        cnFromVariant[variant],
        {
          'w-full rounded-full': isFull,
          'w-full md:w-auto': !locked,
          'hover:shadow-dark': !props.disabled && !isLoading,
          'cursor-not-allowed opacity-50': props.disabled || isLoading,
        },
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <IconLoader2 className="mr-2 animate-spin" size={16} />}
      {children}
    </button>
  );
}
