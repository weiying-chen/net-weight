import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';

type HeadingSelectProps<T extends string | number> = SelectProps<T> & {
  heading?: string;
};

export const HeadingSelect = <T extends string | number>({
  heading,
  className,
  ...props
}: HeadingSelectProps<T>) => {
  return (
    <Row alignItems="center" className={className} locked fluid>
      {heading && <Heading size="sm">{heading}</Heading>}
      <Select
        {...props}
        isIconTrigger
        small
        className="border-0 bg-subtle shadow-none"
      />
    </Row>
  );
};
