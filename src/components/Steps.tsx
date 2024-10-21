import { IconChevronRight } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Heading } from '@/components/Heading';

interface Step {
  label: string;
  url: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (url: string) => void;
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <Row alignItems="center" locked className="w-auto">
      {steps.map((step, index) => (
        <Row
          key={index}
          alignItems="center"
          locked
          className="group w-auto cursor-pointer"
          onClick={() => onStepClick(step.url)}
        >
          <Button
            variant={index + 1 === currentStep ? 'primary' : 'secondary'}
            circular
            className="group-hover:shadow-dark"
          >
            {index + 1}
          </Button>
          <Heading>{step.label}</Heading>
          {index < steps.length - 1 && <IconChevronRight size={30} />}
        </Row>
      ))}
    </Row>
  );
}
