import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';

type HeadingInfoProps = {
  text?: string;
  className?: string;
  tooltipText?: React.ReactNode;
};

export const HeadingInfo = ({
  text,
  className,
  tooltipText,
}: HeadingInfoProps) => {
  return (
    <>
      <Row alignItems="center" className={className} locked>
        <Heading size="sm">{text}</Heading>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <IconInfoCircle size={16} className="cursor-pointer text-muted" />
          </Tooltip>
        )}
      </Row>
      <div className="h-[0.5px] w-full shrink-0 bg-border" />
    </>
  );
};
