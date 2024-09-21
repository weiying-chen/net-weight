import { forwardRef, InputHTMLAttributes } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className, error, ...props },
  ref,
) {
  return (
    <Col className={className}>
      {label && <label className="font-semibold">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded border border-border bg-background px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          { 'border-danger': error },
        )}
        {...props}
      />
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
});

Input.displayName = 'Input';

export { Input };
