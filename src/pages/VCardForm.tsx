import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { VCardPreview } from '@/pages/VCardPreview';

type VCardFormProps = {
  children: React.ReactNode;
  currentStep: number;
  steps: { label: string; url: string }[];
  onSubmit?: (event: React.FormEvent) => void;
};

export function VCardForm({
  children,
  currentStep,
  steps,
  onSubmit,
}: VCardFormProps) {
  const handleStepClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <Col alignItems="center">
      <form
        onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()}
        className="w-full max-w-screen-lg"
      >
        <Col gap="xl">
          <Row align="center" locked>
            <Steps
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </Row>
          <Row gap="xl">
            <Card className="flex-grow-2 basis-2/3">
              <Col gap="xl">{children}</Col>
            </Card>
            <Card className="flex-grow basis-1/3">
              <VCardPreview />
            </Card>
          </Row>
          {onSubmit && (
            <Row align="end">
              <Button type="submit">Submit</Button>
            </Row>
          )}
        </Col>
      </form>
    </Col>
  );
}
