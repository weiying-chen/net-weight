import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';
import { Heading, HeadingProps } from '@/components/Heading';
import { cn } from '@/utils';

type HeadingStatusProps<T extends string | number> = SelectProps<T> & {
  heading: string;
  /** override the heading size if you want */
  size?: HeadingProps['size'];
};

export const HeadingStatus = <T extends string | number>({
  heading,
  className,
  size = 'sm',
  ...props
}: HeadingStatusProps<T>) => {
  return (
    <Row alignItems="center" className={cn('w-auto', className)} locked>
      <Heading size={size}>{heading}</Heading>
      <Select {...props} isIconTrigger small muted />
    </Row>
  );
};
