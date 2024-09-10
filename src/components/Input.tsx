import { forwardRef } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type InputProps = {
  type?: 'text' | 'number' | 'password' | 'email' | 'tel';
  label: string;
  error?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  value?: string | number;
  placeholder?: string;
};

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
          'w-full rounded border border-border px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          { 'border-danger': error },
          className,
        )}
        {...props}
      />
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </Col>
  );
});

Input.displayName = 'Input';

export { Input };
