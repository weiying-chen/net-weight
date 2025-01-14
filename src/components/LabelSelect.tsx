import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';

type LabelSelectProps<T extends string | number> = SelectProps<T> & {
  label?: string;
  required?: boolean;
};

export const LabelSelect = <T extends string | number>({
  label,
  className,
  required,
  ...props
}: LabelSelectProps<T>) => {
  return (
    <Row alignItems="center" className={className} locked fluid>
      {label && (
        <label className="text-sm font-semibold">
          {label} {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <Select
        {...props}
        isIconTrigger
        small
        className="border-0 bg-subtle shadow-none"
      />
    </Row>
  );
};
