import { Row } from '@/components/Row';
import { Select, SingleSelectProps } from '@/components/Select';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

type CommonProps = {
  label?: string;
  verified?: boolean;
  required?: boolean;
  className?: string;
};

type LabelStatusProps<T extends string | number> =
  | (CommonProps & Omit<SingleSelectProps<T>, 'multiple'>) // force single-select only
  | CommonProps;

export const LabelStatus = <T extends string | number>({
  label,
  verified,
  required,
  className,
  ...props
}: LabelStatusProps<T>) => {
  const isInteractive = 'options' in props;

  const selectProps = isInteractive
    ? (props as Omit<SingleSelectProps<T>, 'multiple'>)
    : undefined;

  const isSelectedDisabled = selectProps && selectProps.options.length === 1;

  return (
    <Row alignItems="center" className={className} locked>
      {label && (
        <label className="truncate text-sm font-semibold">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}
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
