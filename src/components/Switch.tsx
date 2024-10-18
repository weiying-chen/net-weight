import { useState } from 'react';
import { cn } from '@/utils';
import { Col } from '@/components/Col';
import { IconCheck, IconX } from '@tabler/icons-react';

type SwitchProps = {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  // fluid?: boolean;
  className?: string;
  error?: string;
};

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled,
  // fluid = false,
  className,
  error,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (onChange && !disabled) {
      setIsChecked(!isChecked);
      onChange(!isChecked);
    }
  };

  return (
    // <Col className={cn({ 'w-auto': fluid }, className)}>
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-10 w-20 shrink-0 cursor-pointer items-center justify-between rounded border border-transparent bg-subtle outline-none ring-foreground ring-offset-2 transition-colors focus-visible:ring-2',
          {
            'border-danger': error,
            'cursor-not-allowed opacity-50': disabled,
          },
        )}
      >
        {!isChecked && (
          <IconX size={20} className="absolute right-[10px] text-muted" />
        )}
        {isChecked && (
          <IconCheck size={20} className="absolute left-[10px] text-success" />
        )}
        <span
          className={cn(
            'block h-10 w-10 rounded border border-border bg-background shadow ring-0 transition-transform hover:shadow-dark',
            {
              'translate-x-10': isChecked,
              'translate-x-0': !isChecked,
            },
          )}
        />
      </button>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
