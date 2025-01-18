import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: string;
  required?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, disabled, className, error, required, ...props },
  ref,
) {
  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger"> *</span>}
          </label>
        ) : (
          label
        ))}
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none ring-foreground ring-offset-2 ring-offset-background focus-visible:ring-2',
          {
            'border-danger': error,
            'pointer-events-none opacity-50': disabled,
          },
        )}
        {...props}
      />
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
});

Input.displayName = 'Input';

export { Input };
