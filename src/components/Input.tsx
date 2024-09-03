import { forwardRef } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type InputProps = {
  type?: 'text' | 'number' | 'password' | 'email' | 'tel';
  label: string;
  error?: string; // Custom prop for handling error messages
  className?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  value?: string | number;
  placeholder?: string;
};

// Define the Input component using the function keyword with forwardRef
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', label, className, error, ...props },
  ref,
) {
  return (
    <Col>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full rounded border border-border px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2', // Added ring and focus-visible styles
          { 'border-red-500': error }, // Add error styling if an error exists
          className,
        )}
        {...props} // Spread only the props defined in InputProps
      />
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </Col>
  );
});

Input.displayName = 'Input';

export { Input };
