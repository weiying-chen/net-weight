import { Row } from '@/components/Row';
import { Select, SingleSelectProps } from '@/components/Select';
import { cn } from '@/utils';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';
import { IconInfoCircle } from '@tabler/icons-react';

type CommonProps = {
  label?: string;
  verified?: boolean;
  required?: boolean;
  tooltipText?: string;
  className?: string;
};

export type LabelStatusProps<T extends string | number | null> =
  | (CommonProps & Omit<SingleSelectProps<T>, 'multiple'>)
  | CommonProps;

export const LabelStatus = <T extends string | number | null>({
  label,
  verified,
  required,
  tooltipText,
  className,
  ...props
}: LabelStatusProps<T>) => {
  const isInteractive = 'options' in props;
  const selectProps = isInteractive
    ? (props as Omit<SingleSelectProps<T>, 'multiple'>)
    : undefined;

  const isSelectedDisabled = selectProps && selectProps.options.length === 1;

  return (
    <Row alignItems="center" className={cn('w-auto', className)} locked>
      {label &&
        (tooltipText ? (
          <label className="flex items-center gap-2 truncate text-sm font-semibold">
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
            <Tooltip content={tooltipText} width={240}>
              <IconInfoCircle size={16} className="cursor-pointer text-muted" />
            </Tooltip>
          </label>
        ) : (
          <label className="truncate text-sm font-semibold">
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        ))}

      {selectProps && (
        <Select
          {...selectProps}
          disabled={isSelectedDisabled}
          isIconTrigger
          small
          muted
        />
      )}

      {verified && (
        <IconRosetteDiscountCheckFilled size={16} className="text-primary" />
      )}
    </Row>
  );
};
