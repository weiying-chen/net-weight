import { ReactNode } from 'react';
import { cn } from '@/utils';

type TitleProps = {
  size?: 'sm' | 'md' | 'lg'; // Define size variants
  className?: string; // Allows additional custom styles
  children: ReactNode; // Title content
};

export function Title({ size = 'md', className, children }: TitleProps) {
  // Map size prop to Tailwind font size classes
  const cnFromSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <h2
      className={cn(
        cnFromSize[size], // Apply size class based on the size prop
        'font-semibold tracking-tight', // Additional default classes
        className, // Custom classes passed as props
      )}
    >
      {children}
    </h2>
  );
}
