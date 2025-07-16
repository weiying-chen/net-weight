import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { cn } from '@/utils';
import { IconInfoCircle } from '@tabler/icons-react';

type HeadingInfoProps = {
  text?: string;
  className?: string;
};

export const HeadingInfo = ({
  text,
  className,
  ...props
}: HeadingInfoProps) => {
  return (
    <>
      <Row
        alignItems="center"
        gap="sm"
        className={cn('w-auto', className)}
        locked
      >
        <Heading size="sm">{text}</Heading>
        <IconInfoCircle
          size={16}
          className="cursor-pointer text-muted"
          {...props}
        />
      </Row>
      <div className="h-[0.5px] w-full shrink-0 bg-border" />
    </>
  );
};
