import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconCheck } from '@tabler/icons-react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
  error?: string;
  small?: boolean;
  fluid?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      error,
      disabled,
      checked,
      onChange,
      small = false,
      fluid = false,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <Col className={cn({ 'w-auto': fluid }, className)}>
        <label
          className={cn(
            'relative inline-flex h-fit w-full cursor-pointer select-none items-center gap-2 outline-none ring-foreground ring-offset-2 ring-offset-background focus-visible:ring-2',
            {
              'cursor-not-allowed opacity-50': disabled,
            },
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only"
            {...props}
          />

          {/* Visual checkbox */}
          <span
            className={cn(
              'flex items-center justify-center rounded border border-border bg-background shadow transition-colors',
              small ? 'h-4 w-4' : 'h-5 w-5',
              checked && 'bg-primary',
              error && 'border-danger',
            )}
          >
            {checked && (
              <IconCheck
                size={small ? 10 : 14}
                className="pointer-events-none text-background"
              />
            )}
          </span>

          {/* Inline label text */}
          {label && (
            <span className="truncate text-sm font-medium text-foreground">
              {label}
            </span>
          )}
        </label>

        {error && <span className="text-sm text-danger">{error}</span>}
      </Col>
    );
  },
);

Checkbox.displayName = 'Checkbox';
