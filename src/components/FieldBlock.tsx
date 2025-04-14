import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { cn } from '@/utils';

type FieldBlockProps = {
  label?: ReactNode;
  unit?: string;
  value: ReactNode;
  className?: string;
};

export const FieldBlock: React.FC<FieldBlockProps> = ({
  label,
  unit,
  value,
  className,
}) => {
  return (
    <Col className={cn('gap-2', className)}>
      {(label || unit) && (
        <label className="text-sm font-medium">
          {label && <span className="font-semibold">{label}</span>}
          {unit && (
            <span className="ml-1 text-xs font-normal text-muted">{unit}</span>
          )}
        </label>
      )}
      <Row className="w-full border-b border-subtle pb-2 text-sm" locked>
        {value}
      </Row>
    </Col>
  );
};
