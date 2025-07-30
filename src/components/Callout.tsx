import { Row } from '@/components/Row';
import { IconInfoCircle, IconExclamationCircle } from '@tabler/icons-react';
import { ReactNode } from 'react';

type CalloutVariant = 'primary' | 'danger';

interface CalloutProps {
  variant?: CalloutVariant;
  children: React.ReactNode;
}

const variantStyles: Record<
  CalloutVariant,
  { border: string; icon: ReactNode }
> = {
  primary: {
    border: 'border-primary',
    icon: <IconInfoCircle size={30} className="flex-shrink-0 text-primary" />,
  },
  danger: {
    border: 'border-danger',
    icon: (
      <IconExclamationCircle size={30} className="flex-shrink-0 text-danger" />
    ),
  },
};

export const Callout: React.FC<CalloutProps> = ({
  variant = 'primary',
  children,
}) => {
  const { border, icon } = variantStyles[variant];

  return (
    <Row alignItems="center" className={`rounded border p-3 text-sm ${border}`}>
      {icon}
      <div>{children}</div>
    </Row>
  );
};
