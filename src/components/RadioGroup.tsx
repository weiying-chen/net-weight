import { forwardRef, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { Row } from '@/components/Row';

type RadioOption = {
  label: ReactNode;
  value: string;
};

type RadioGroupProps = {
  options: RadioOption[];
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    { options, name, value, onChange, label, error, required, disabled },
    ref,
  ) {
    return (
      <Col ref={ref}>
        {label && (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-primary"> *</span>}
          </label>
        )}
        <Row gap="lg">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-center gap-2 text-sm',
                disabled && 'pointer-events-none opacity-50',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                className={cn(
                  'h-4 w-4 rounded-full border border-border bg-background text-primary accent-primary focus:ring-0', // focus:ring-0 removes the square
                  error && 'border-danger',
                )}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </Row>
        {error && <span className="text-sm text-danger">{error}</span>}
      </Col>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
