import { ButtonHTMLAttributes, forwardRef } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  isLoading?: boolean;
  locked?: boolean;
  isFull?: boolean;
  circular?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      isLoading = false,
      locked = false,
      isFull = false,
      circular = false,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const cnFromVariant = {
      primary: 'text-background bg-primary',
      secondary: 'text-foreground bg-secondary',
      success: 'text-background bg-success',
      danger: 'text-white bg-danger',
      link: 'h-auto border-none bg-transparent px-0 py-0 text-foreground shadow-none',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-border px-4 py-2 text-sm font-medium shadow ring-foreground ring-offset-2 ring-offset-background hover:shadow-dark focus:outline-none focus-visible:ring-2',
          cnFromVariant[variant],
          {
            'w-full md:w-auto': !locked,
            'w-full md:w-full': isFull,
            'w-10 rounded-full px-0 py-0 md:w-10': circular,
            'pointer-events-none opacity-50': props.disabled || isLoading,
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
  },
);

Button.displayName = 'Button';
