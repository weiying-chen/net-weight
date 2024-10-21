import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { VCardPreview } from '@/pages/VCardPreview';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Heading } from '@/components/Heading';
import { PhoneFrame } from '@/components/PhoneFrame';
import { useNavigate } from 'react-router-dom';

type VCardFormProps = {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
};

const steps = [
  { label: 'Content', url: '/vcard1' },
  { label: 'Design', url: '/vcard2' },
  { label: 'QRCode', url: '/vcard3' },
];

const currentStep = 1;

export function VCardForm({ children, onSubmit }: VCardFormProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  const navigate = useNavigate();

  const handleStepClick = (url: string) => {
    navigate(url);
  };

  const handlePrevClick = () => {
    if (!isFirstStep) {
      handleStepClick(steps[currentStep - 2].url);
    }
  };

  const handleNextClick = () => {
    if (!isLastStep) {
      handleStepClick(steps[currentStep].url);
    }
  };

  const handleCancel = () => {
    navigate('/vcard4');
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
            onStepClick={handleStepClick}
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
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            {onSubmit && <Button type="submit">Save</Button>}
          </Row>
        </Row>
      </Col>
    </form>
  );
}
