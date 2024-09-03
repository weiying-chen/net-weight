import { ReactNode, ButtonHTMLAttributes } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  isFull?: boolean; // Use isFull prop for full width
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  isLoading = false,
  isFull = false, // Default isFull to false
  className,
  children,
  ...props
}: ButtonProps) {
  const cnFromVariant = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center rounded border border-border px-4 py-2 font-medium shadow outline-none ring-foreground ring-offset-2 hover:shadow-dark focus-visible:ring-2',
        cnFromVariant[variant],
        { 'w-full rounded-full': isFull }, // Apply w-full if isFull is true
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
