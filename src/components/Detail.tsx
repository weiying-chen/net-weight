import { Col } from '@/components/Col';
import { cn } from '@/utils';

type DetailProps = {
  label?: string;
  text: string;
  className?: string;
};

export const Detail: React.FC<DetailProps> = ({ label, className, text }) => {
  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div className={cn('h-10 w-full border-b border-subtle pb-2')}>
        {text}
      </div>
    </Col>
  );
};
