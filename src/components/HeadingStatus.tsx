import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { cn } from '@/utils';

type HeadingStatusProps<T extends string | number> = SelectProps<T> & {
  heading?: string;
};

export const HeadingStatus = <T extends string | number>({
  heading,
  className,
  ...props
}: HeadingStatusProps<T>) => {
  return (
    <>
      {/* <Row alignItems="center" className={className} locked fluid> */}
      <Row alignItems="center" className={cn('w-auto', className)} locked>
        {heading && <Heading size="sm">{heading}</Heading>}
        <Select
          {...props}
          isIconTrigger
          small
          className="border-0 bg-subtle shadow-none"
        />
      </Row>
    </>
  );
};
