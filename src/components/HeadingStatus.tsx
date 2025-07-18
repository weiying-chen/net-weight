import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { cn } from '@/utils';

type HeadingStatusProps<T extends string | number> = SelectProps<T> & {
  // heading?: string;
  heading: string;
};

export const HeadingStatus = <T extends string | number>({
  heading,
  className,
  ...props
}: HeadingStatusProps<T>) => {
  return (
    <>
      <Row alignItems="center" className={cn('w-auto', className)} locked>
        <Heading size="sm">{heading}</Heading>
        <Select {...props} isIconTrigger small muted />
      </Row>
    </>
  );
};
