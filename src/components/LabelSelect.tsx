import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';

type LabelSelectProps<T extends string | number> = SelectProps<T> & {
  label?: string;
};

export const LabelSelect = <T extends string | number>({
  label,
  className,
  ...props
}: LabelSelectProps<T>) => {
  return (
    <Row alignItems="center" className={className} locked fluid>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <Select {...props} isIconTrigger small />
    </Row>
  );
};
