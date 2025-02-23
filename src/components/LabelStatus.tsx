import { useState, useEffect } from 'react';
import { Row } from '@/components/Row';
import { Select, SelectProps } from '@/components/Select';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

type CommonProps = {
  label?: string;
  verified?: boolean;
  required?: boolean;
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
  required,
  className,
  ...props
}: LabelStatusProps<T>) => {
  const isInteractive = 'options' in props;
  const selectProps = isInteractive ? (props as SelectProps<T>) : undefined;
  const isSelectedDisabled = selectProps
    ? selectProps.options.length === 1
    : false;

  const initialValue = selectProps?.value;
  const [value, setValue] = useState<T | undefined>(initialValue);

  const isValidValue = selectProps
    ? selectProps.options.some((option) => option.value === initialValue)
    : false;

  useEffect(() => {
    if (isValidValue) {
      setValue(initialValue);
    }
  }, [initialValue, isValidValue]);

  return (
    <Row alignItems="center" className={className} locked>
      {label && (
        <label className="text-sm font-semibold">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}
      {isInteractive && selectProps && (
        <Select
          {...selectProps}
          value={value as T}
          disabled={isSelectedDisabled}
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
