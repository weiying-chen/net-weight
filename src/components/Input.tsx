import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
  /** Makes the input act as a read-only trigger with hover and shadow styles */
  triggerOnly?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    disabled,
    className,
    error,
    required,
    icon,
    triggerOnly,
    readOnly,
    ...props
  },
  ref,
) {
  const isReadOnly = triggerOnly || readOnly;

  const baseInputClasses =
    'h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted';

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
      <div className="relative w-full">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          readOnly={isReadOnly}
          className={cn(
            baseInputClasses,
            !triggerOnly &&
              'ring-foreground ring-offset-2 ring-offset-background focus-visible:ring-2',
            triggerOnly && 'cursor-pointer shadow hover:shadow-dark',
            icon && 'pl-9',
            {
              'border-danger': error,
              'pointer-events-none opacity-50': disabled,
            },
          )}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
});

Input.displayName = 'Input';

export { Input };
