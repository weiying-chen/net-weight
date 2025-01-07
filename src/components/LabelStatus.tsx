import { Row } from '@/components/Row';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';

type LabelStatusProps = {
  label?: string;
  verified?: boolean;
  className?: string;
};

export const LabelStatus: React.FC<LabelStatusProps> = ({
  label,
  verified,
  className,
}) => {
  return (
    <Row alignItems="center" className={className} locked fluid>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {verified && (
        <IconRosetteDiscountCheckFilled size={16} className="text-primary" />
      )}
    </Row>
  );
};
