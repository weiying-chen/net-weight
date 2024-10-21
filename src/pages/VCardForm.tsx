import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { VCardPreview } from '@/pages/VCardPreview';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Heading } from '@/components/Heading';
import { PhoneFrame } from '@/components/PhoneFrame';

type VCardFormProps = {
  children: React.ReactNode;
  currentStep: number;
  steps: { label: string; url: string }[];
  onSubmit?: (event: React.FormEvent) => void;
  onCancel?: () => void;
  onStepClick: (url: string) => void;
};

export function VCardForm({
  children,
  currentStep,
  steps,
  onSubmit,
  onCancel,
  onStepClick,
}: VCardFormProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  const handlePrevClick = () => {
    if (!isFirstStep) {
      onStepClick(steps[currentStep - 2].url);
    }
  };

  const handleNextClick = () => {
    if (!isLastStep) {
      onStepClick(steps[currentStep].url);
    }
  };

  return (
    <form
      onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()}
      className="mx-auto w-full max-w-screen-lg"
    >
      <Col gap="xl">
        <Row align="center" locked>
          <Steps
            steps={steps}
            currentStep={currentStep}
            onStepClick={onStepClick}
          />
        </Row>
        <Row gap="xl">
          <Card className="flex-grow-2 basis-2/3">
            <Col gap="xl">{children}</Col>
          </Card>
          <Card className="flex-grow basis-1/3">
            <Col gap="lg" alignItems="center">
              <Heading size="sm" hasBorder isFull>
                Preview
              </Heading>
              <PhoneFrame>
                <VCardPreview />
              </PhoneFrame>
            </Col>
          </Card>
        </Row>
        <Row align="between" gap="lg">
          <Row>
            {!isFirstStep && (
              <Button variant="secondary" onClick={handlePrevClick}>
                <IconArrowLeft size={20} />
                Prev
              </Button>
            )}
            {!isLastStep && (
              <Button variant="secondary" onClick={handleNextClick}>
                <IconArrowRight size={20} />
                Next
              </Button>
            )}
          </Row>
          <Row align="end">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {onSubmit && <Button type="submit">Save</Button>}
          </Row>
        </Row>
      </Col>
    </form>
  );
}
