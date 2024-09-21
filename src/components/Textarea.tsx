import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, className, error, ...props }, ref) {
    return (
      <Col className={className}>
        {label && <label className="font-semibold">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded border border-border bg-background px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
            { 'border-danger': error },
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
