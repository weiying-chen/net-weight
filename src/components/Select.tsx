import { forwardRef, SelectHTMLAttributes } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string;
  placeholder?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, className, error, placeholder, ...props },
  ref,
) {
  return (
    <Col>
      <label className="text-sm font-semibold">{label}</label>
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded border border-border px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
          { 'border-danger': error },
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </Col>
  );
});

Select.displayName = 'Select';

export { Select };
