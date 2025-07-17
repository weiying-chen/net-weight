import { Row } from '@/components/Row';
import { Tooltip } from '@/components/Tooltip';
import { IconInfoCircle } from '@tabler/icons-react';

type LabelInfoProps = {
  text: string;
  tooltipText: string;
  required?: boolean;
  className?: string;
};

export const LabelInfo = ({
  text,
  tooltipText,
  required,
  className,
}: LabelInfoProps) => {
  return (
    <Row alignItems="center" className={className} locked>
      <label className="flex items-center gap-1 text-sm font-semibold">
        {text}
        {required && <span className="ml-1 text-danger">*</span>}
        <Tooltip content={tooltipText} width={240}>
          <IconInfoCircle size={16} className="cursor-pointer text-muted" />
        </Tooltip>
      </label>
    </Row>
  );
};
