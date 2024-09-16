import { useState } from 'react';
import { cn } from '@/utils';
import { Col } from '@/components/Col';

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  error?: string;
};

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  className,
  error,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  };

  return (
    <Col>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'focus-visible:ring-ring inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          {
            'bg-foreground': isChecked,
            'bg-muted': !isChecked,
            'border-danger': error,
          },
          className,
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full border border-border bg-background ring-0 transition-transform',
            {
              'translate-x-5': isChecked,
              'translate-x-0': !isChecked,
            },
          )}
        />
      </button>
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </Col>
  );
};
