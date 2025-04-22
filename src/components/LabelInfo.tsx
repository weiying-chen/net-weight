import { Row } from '@/components/Row';
import { Tooltip } from '@/components/Tooltip';
import { IconInfoCircle } from '@tabler/icons-react';

type LabelInfoProps = {
  label: string;
  tooltip: string;
  required?: boolean;
  className?: string;
};

export const LabelInfo = ({
  label,
  tooltip,
  required,
  className,
}: LabelInfoProps) => {
  return (
    <Row alignItems="center" className={className} locked>
      <label className="flex items-center gap-1 text-sm font-semibold">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
        <Tooltip content={tooltip}>
          <IconInfoCircle size={16} className="cursor-help text-muted" />
        </Tooltip>
      </label>
    </Row>
  );
};
