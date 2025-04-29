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
  disabled?: boolean;
  onStepClick: (url: string) => void;
}

export function Steps({
  steps,
  currentStep,
  disabled = false,
  onStepClick,
}: StepsProps) {
  return (
    <Row alignItems="center" locked className="w-auto">
      {steps.map((step, index) => (
        <Row
          key={index}
          alignItems="center"
          locked
          className={`group w-auto ${!disabled && 'cursor-pointer'}`}
          onClick={() => !disabled && onStepClick(step.url)}
        >
          <Button
            variant={index + 1 === currentStep ? 'primary' : 'secondary'}
            square
            circular
            className={`h-7 w-7 cursor-default text-xs ${!disabled && 'cursor-pointer group-hover:shadow-dark'} md:w-7`}
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
