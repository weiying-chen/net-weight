import { forwardRef, TextareaHTMLAttributes, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  error?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, className, error, ...props }, ref) {
    return (
      <Col className={className}>
        {label &&
          (typeof label === 'string' ? (
            <label className="text-sm font-semibold">{label}</label>
          ) : (
            label // If label is a React node, render it as-is
          ))}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none ring-foreground ring-offset-2 ring-offset-background focus-visible:ring-2',
            {
              'border-danger': error,
              'cursor-not-allowed opacity-50': props.disabled,
            },
          )}
          {...props}
        />
        {error && <span className="text-sm text-danger">{error}</span>}
      </Col>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
