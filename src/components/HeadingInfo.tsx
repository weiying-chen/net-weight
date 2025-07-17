import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { cn } from '@/utils';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';

type HeadingInfoProps = {
  text?: string;
  className?: string;
  /** Text content to show in the tooltip on hover */
  tooltipText?: React.ReactNode;
};

export const HeadingInfo = ({
  text,
  className,
  tooltipText,
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
        {tooltipText ? (
          <Tooltip content={tooltipText}>
            <IconInfoCircle size={16} className="cursor-pointer text-muted" />
          </Tooltip>
        ) : (
          <IconInfoCircle size={16} className="text-muted" />
        )}
      </Row>
      <div className="h-[0.5px] w-full shrink-0 bg-border" />
    </>
  );
};
