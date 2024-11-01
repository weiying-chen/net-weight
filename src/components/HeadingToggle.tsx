import { Row } from '@/components/Row';
import { Switch, SwitchProps } from '@/components/Switch';
import { Heading } from '@/components/Heading';

type HeadingToggleProps = SwitchProps & {
  text: string;
};

export const HeadingToggle: React.FC<HeadingToggleProps> = ({
  text,
  className,
  ...switchProps
}) => {
  return (
    <Row
      alignItems="center"
      className={`border-b border-border pb-2 ${className}`}
    >
      <Heading size="sm">{text}</Heading>
      <Switch small fluid {...switchProps} />
    </Row>
  );
};
