import { Row } from '@/components/Row';
import { Select, SelectProps } from '@/components/Select';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

type CommonProps = {
  label?: string;
  verified?: boolean;
  className?: string;
};

type LabelStatusProps<T extends string | number> =
  | (CommonProps & {
      options: Array<SelectProps<T>['options'][number]>;
      value: T;
      onChange: (option: T) => void;
    })
  | CommonProps;

export const LabelStatus = <T extends string | number>({
  label,
  verified,
  className,
  ...props
}: LabelStatusProps<T>) => {
  const isInteractive = 'options' in props;

  return (
    <Row alignItems="center" className={className} locked>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {isInteractive && (
        <Select
          {...(props as SelectProps<T>)}
          isIconTrigger
          small
          className="border-0 bg-subtle shadow-none"
        />
      )}
      {verified && (
        <IconRosetteDiscountCheckFilled size={16} className="text-primary" />
      )}
    </Row>
  );
};
