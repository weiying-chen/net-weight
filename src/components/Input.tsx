import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, disabled, className, error, ...props },
  ref,
) {
  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">{label}</label>
        ) : (
          label // If label is a React node, render it as-is
        ))}
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          {
            'border-danger': error,
            'cursor-not-allowed opacity-50': disabled,
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
