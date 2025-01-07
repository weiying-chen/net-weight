import { ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';

type DetailProps = {
  label?: ReactNode;
  content: ReactNode;
  className?: string;
};

export const Detail: React.FC<DetailProps> = ({
  label,
  content,
  className,
}) => {
  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">{label}</label>
        ) : (
          label
        ))}
      <Row className="w-full border-b border-subtle pb-2 text-sm" locked>
        {content}
      </Row>
    </Col>
  );
};
