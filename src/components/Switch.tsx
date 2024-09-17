import { useState } from 'react';
import { cn } from '@/utils';
import { Col } from '@/components/Col';
import { IconCheck, IconX } from '@tabler/icons-react';

type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
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
    if (onChange) {
      setIsChecked(!isChecked);
      onChange(!isChecked);
    }
  };

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <button
        type="button"
        onClick={handleToggle}
        disabled={!onChange} // Disable the button if onChange is not provided
        className={cn(
          'focus-visible:ring-ring relative inline-flex h-[42.2px] w-[84.4px] shrink-0 cursor-pointer items-center justify-between rounded border border-transparent bg-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed',
          {
            'border-danger': error,
          },
        )}
      >
        {!isChecked && (
          <IconX size={20} className="absolute right-[11px] text-muted" />
        )}
        {isChecked && (
          <IconCheck size={20} className="absolute left-[11px] text-success" />
        )}
        <span
          className={cn(
            'pointer-events-none block h-[42.2px] w-[42.2px] rounded border border-border bg-background ring-0 transition-transform',
            {
              'translate-x-[42.2px]': isChecked,
              'translate-x-0': !isChecked,
            },
          )}
        />
      </button>
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </Col>
  );
};
