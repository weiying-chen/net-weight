import { Row } from '@/components/Row';
import { Select, SelectProps } from '@/components/Select';
import { Heading } from '@/components/Heading';

export type HeadingSelectProps<T extends string | number> = SelectProps<T> & {
  text: string;
};

export const HeadingSelect = <T extends string | number>({
  text,
  className,
  ...selectProps
}: HeadingSelectProps<T>) => {
  return (
    <Row
      alignItems="center"
      className={`border-b border-border pb-2 ${className}`}
      locked
    >
      <Heading size="sm">{text}</Heading>
      <Select {...selectProps} />
    </Row>
  );
};
