import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';
import { Row } from '@/components/Row';
import { FileUpload } from '@/components/FileUpload';
import { Heading } from '@/components/Heading';
import { CustomLinks } from '@/components/CustomLinks';

const clErrFromErr = (
  errors: any,
): Array<{ platform?: string; url?: string }> => {
  if (!Array.isArray(errors)) {
    return [];
  }
  return errors.map((error: any) => ({
    platform: error?.platform?.message,
    url: error?.url?.message,
  }));
};

const schema = z.object({
  title: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  avatar: z.array(z.instanceof(File)).optional(),
  selfIntroTitle: z.string().optional(),
  description: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-]+$/, 'Invalid phone number')
    .or(z.literal('')),
  email: z.string().email('Invalid email address').or(z.literal('')),
  website: z.string().url('Invalid URL').or(z.literal('')),
  address: z.string().optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

export function VCard1() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  const steps = [
    { label: 'Content', url: '/vcard1' },
    { label: 'Design', url: '/vcard2' },
    { label: 'QRCode', url: '/vcard3' },
  ];

  const currentStep = 1;

  const handleStepClick = (url: string) => {
    window.location.href = url;
  };

  const renderBasicInfo = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Basic Info
      </Heading>
      <Row>
        <Input
          label="Title"
          {...register('title')}
          error={errors.title?.message}
        />
        <Input
          label="Heading"
          {...register('heading')}
          error={errors.heading?.message}
        />
        <Input
          label="Subheading"
          {...register('subheading')}
          error={errors.subheading?.message}
        />
      </Row>
      <FileUpload
        label="Avatar"
        files={[]}
        onChange={(files) => setValue('avatar', files)}
        error={errors.avatar?.message}
      />
    </Col>
  );

  const renderSelfIntro = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Self-Introduction
      </Heading>
      <Input
        label="Self-Introduction Title"
        {...register('selfIntroTitle')}
        error={errors.selfIntroTitle?.message}
      />
      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />
    </Col>
  );

  const renderContactInfo = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Contact Info
      </Heading>
      <Row>
        <Input
          label="Phone"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Input
          label="Email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Website"
          {...register('website')}
          error={errors.website?.message}
        />
      </Row>
      <Input
        label="Address"
        {...register('address')}
        error={errors.address?.message}
      />
    </Col>
  );

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'Line', label: 'Line' },
    { value: 'WeChat', label: 'WeChat' },
    { value: 'other', label: 'Other' },
  ];

  const renderCustomLinks = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Social Links
      </Heading>
      <CustomLinks
        links={[]}
        options={platforms}
        onChange={(links) => setValue('socialLinks', links)}
        errors={clErrFromErr(errors.socialLinks)}
      />
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
        {renderBasicInfo()}
        {renderSelfIntro()}
        {renderContactInfo()}
        {renderCustomLinks()}
        <Button type="submit">Submit</Button>
      </Col>
    </form>
  );
}