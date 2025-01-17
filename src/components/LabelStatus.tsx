import { Row } from '@/components/Row';
import { Select, SelectProps } from '@/components/Select';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

type LabelStatusProps<T extends string | number> = SelectProps<T> & {
  label?: string;
  verified?: boolean;
  className?: string;
};

export const LabelStatus = <T extends string | number>({
  label,
  verified,
  className,
  ...props
}: LabelStatusProps<T>) => {
  return (
    <Row alignItems="center" className={className} locked>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {props.options ? (
        <Select
          {...props}
          isIconTrigger
          small
          className="border-0 bg-subtle shadow-none"
        />
      ) : null}
      {verified && (
        <IconRosetteDiscountCheckFilled size={16} className="text-primary" />
      )}
    </Row>
  );
};
