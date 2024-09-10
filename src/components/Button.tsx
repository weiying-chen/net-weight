import { ReactNode, ButtonHTMLAttributes } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'success';
  isLoading?: boolean;
  isFull?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  isLoading = false,
  isFull = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const cnFromVariant = {
    primary: 'text-background bg-primary',
    secondary: 'text-foreground bg-secondary',
    success: 'text-background bg-success',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center rounded border border-border px-4 py-2 font-medium shadow ring-foreground ring-offset-2 hover:shadow-dark focus:outline-none focus-visible:ring-2',
        cnFromVariant[variant],
        { 'w-full rounded-full': isFull },
        className,
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <IconLoader2 className="mr-2 animate-spin" size={16} />}
      {children}
    </button>
  );
}
