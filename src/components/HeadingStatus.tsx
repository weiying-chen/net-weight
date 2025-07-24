import { Select, SelectProps } from '@/components/Select';
import { Row } from '@/components/Row';
import { Heading, HeadingProps } from '@/components/Heading';
import { cn } from '@/utils';

type HeadingStatusProps<T extends string | number> = {
  heading: string;
  /** override the heading size if you want */
  size?: HeadingProps['size'];
  /** click on the heading text */
  onClick?: React.MouseEventHandler<HTMLHeadingElement>;
} & SelectProps<T>;

export const HeadingStatus = <T extends string | number>({
  heading,
  className,
  size = 'sm',
  onClick,
  ...selectProps
}: HeadingStatusProps<T>) => {
  return (
    <Row alignItems="center" className={cn('w-auto', className)} locked>
      <Heading size={size} onClick={onClick}>
        {heading}
      </Heading>
      <Select {...selectProps} isIconTrigger small muted />
    </Row>
  );
};
