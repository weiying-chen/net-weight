import { Tooltip } from '@/components/Tooltip';
import { cn } from '@/utils';
import { IconInfoCircle } from '@tabler/icons-react';

type LabelInfoProps = {
  text: string;
  tooltipText: string;
  required?: boolean;
  className?: string;
};

export const LabelInfo = ({
  text,
  tooltipText,
  required,
  className,
}: LabelInfoProps) => {
  return (
    <label
      className={cn('flex items-center gap-2 text-sm font-semibold', className)}
    >
      {text}
      {required && <span className="ml-1 text-danger">*</span>}
      <Tooltip content={tooltipText} width={240}>
        <IconInfoCircle size={16} className="cursor-pointer text-muted" />
      </Tooltip>
    </label>
  );
};
