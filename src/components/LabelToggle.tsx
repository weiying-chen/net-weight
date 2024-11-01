import { Row } from '@/components/Row';
import { Switch, SwitchProps } from '@/components/Switch';

type LabelToggleProps = SwitchProps & {
  label: string;
};

export const LabelToggle: React.FC<LabelToggleProps> = ({
  label,
  className,
  ...switchProps
}) => {
  return (
    <Row alignItems="center" className={className}>
      <label className="text-sm font-semibold">{label}</label>
      <Switch small fluid {...switchProps} />
    </Row>
  );
};
