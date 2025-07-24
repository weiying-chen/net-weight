import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconLoader2 } from '@tabler/icons-react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
  triggerOnly?: boolean;
  formatValue?: (value: any) => string;
  inputClassName?: string;
  rightSection?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    disabled,
    className,
    error,
    required,
    icon,
    isLoading,
    triggerOnly,
    readOnly,
    formatValue,
    value,
    type,
    inputClassName,
    rightSection,
    ...props
  },
  ref,
) {
  const isReadOnly = triggerOnly || readOnly;

  const baseInputClasses =
    'h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted';

  const displayValue =
    typeof formatValue === 'function' ? formatValue(value) : value;

  const shouldForceTextType =
    (type === 'number' || type === 'tel') &&
    typeof displayValue === 'string' &&
    (disabled || isReadOnly) &&
    typeof formatValue === 'function';

  const actualType = shouldForceTextType ? 'text' : type;

  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger">*</span>}
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
          type={actualType}
          disabled={disabled}
          readOnly={isReadOnly}
          value={displayValue}
          className={cn(
            baseInputClasses,
            !triggerOnly &&
              'ring-foreground ring-offset-2 ring-offset-background focus-visible:ring-2',
            triggerOnly && 'cursor-pointer shadow hover:shadow-dark',
            icon && 'pl-9',
            rightSection || isLoading ? 'pr-9' : '',
            {
              'border-danger': error,
              'pointer-events-none opacity-50': disabled,
            },
            inputClassName,
          )}
          {...props}
        />
        {isLoading && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <IconLoader2 size={16} className="animate-spin text-muted" />
          </span>
        )}
        {rightSection && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {rightSection}
          </span>
        )}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
});

Input.displayName = 'Input';

export { Input };
