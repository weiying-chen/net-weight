import { useState } from 'react';
import { cn } from '@/utils';
import { Col } from '@/components/Col';
import { IconCheck, IconX } from '@tabler/icons-react';

export type SwitchProps = {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  small?: boolean;
  fluid?: boolean;
  className?: string;
  error?: string;
};

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled,
  small = false,
  fluid = false,
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
    <Col className={cn({ 'w-auto': fluid }, className)}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer items-center justify-between rounded border border-transparent outline-none ring-foreground ring-offset-2 transition-colors focus-visible:ring-2',
          small ? 'h-4 w-8 bg-subtle text-xs' : 'h-10 w-20 bg-subtle text-sm',
          {
            'border-danger': error,
            'cursor-not-allowed opacity-50': disabled,
          },
        )}
      >
        {!isChecked && (
          <IconX
            size={small ? 10 : 20}
            className={cn(
              'absolute text-muted',
              small ? 'right-[3px]' : 'right-[10px]',
            )}
          />
        )}
        {isChecked && (
          <IconCheck
            size={small ? 10 : 20}
            className={cn(
              'absolute text-success',
              small ? 'left-[3px]' : 'left-[10px]',
            )}
          />
        )}
        <span
          className={cn(
            'block rounded border border-border bg-background shadow ring-0 transition-transform hover:shadow-dark',
            small ? 'h-4 w-4 translate-x-4' : 'h-10 w-10 translate-x-10',
            {
              'translate-x-0': !isChecked,
              'translate-x-10': isChecked && !small,
              'translate-x-4': isChecked && small,
            },
          )}
        />
      </button>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
