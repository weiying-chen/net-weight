import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/Button';
import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';
import { Row } from '@/components/Row';
import { ColorPicker } from '@/components/ColorPicker';
import { Heading } from '@/components/Heading';
import { Select } from '@/components/Select'; // Assuming you have this Select component

const schema = z.object({
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  fontFamily: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const fontOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Georgia', value: 'Georgia' },
];

export function VCard2() {
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      foregroundColor: '#ffffff',
      backgroundColor: '#ffffff',
      primaryColor: '#000000',
      secondaryColor: '#000000',
      borderColor: '#000000',
      fontFamily: 'Arial',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  const steps = [
    { label: 'Content', url: '/vcard1' },
    { label: 'Design', url: '/vcard2' },
    { label: 'QRCode', url: '/vcard3' },
  ];

  const currentStep = 2;

  const handleStepClick = (url: string) => {
    window.location.href = url;
  };

  const renderColors = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Colors
      </Heading>
      <Row>
        <ColorPicker
          label="Foreground color"
          value={getValues('foregroundColor')}
          onChange={(color) => setValue('foregroundColor', color)}
          error={errors.foregroundColor?.message}
        />
        <ColorPicker
          label="Background color"
          value={getValues('backgroundColor')}
          onChange={(color) => setValue('backgroundColor', color)}
          error={errors.backgroundColor?.message}
        />
        <ColorPicker
          label="Primary color"
          value={getValues('primaryColor')}
          onChange={(color) => setValue('primaryColor', color)}
          error={errors.primaryColor?.message}
        />
        <ColorPicker
          label="Secondary color"
          value={getValues('secondaryColor')}
          onChange={(color) => setValue('secondaryColor', color)}
          error={errors.secondaryColor?.message}
        />
        <ColorPicker
          label="Border color"
          value={getValues('borderColor')}
          onChange={(color) => setValue('borderColor', color)}
          error={errors.borderColor?.message}
        />
      </Row>
    </Col>
  );

  const renderFont = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Font
      </Heading>
      <Row>
        <Select
          label="Style"
          value={getValues('fontFamily')}
          options={fontOptions}
          placeholder="Select a font style"
          error={errors.fontFamily?.message}
          onChange={(option) => setValue('fontFamily', option.toString())}
        />
      </Row>
    </Col>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Col gap="xl">
        <Row align="center" locked>
          <Steps
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </Row>
        {renderColors()}
        {renderFont()}
        <Button type="submit">Submit</Button>
      </Col>
    </form>
  );
}
