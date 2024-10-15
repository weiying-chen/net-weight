import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type FormData = z.infer<typeof schema>;

export function VCard1() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  const stepsArray = ['Enter name', 'Review', 'Submit'];
  const currentStep = 1;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Col gap="lg">
        <Steps steps={stepsArray} currentStep={currentStep} />
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Button type="submit">Submit</Button>
      </Col>
    </form>
  );
}
