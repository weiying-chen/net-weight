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

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string().min(1, 'Subheading is required'),
  avatar: z.array(z.instanceof(File)).min(1, 'Avatar is required'),
  selfIntroTitle: z.string().min(1, 'Self-intro title is required'),
  description: z.string().min(1, 'Description is required'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\+?[0-9\s\-]+$/, 'Invalid phone number'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  website: z.string().url('Invalid URL'),
  address: z.string().min(1, 'Address is required'),
  facebook: z.string().url('Invalid Facebook URL').optional(),
  instagram: z.string().url('Invalid Instagram URL').optional(),
  line: z.string().min(1, 'LINE username is required').optional(),
  wechat: z.string().min(1, 'WeChat ID is required').optional(),
  socialLink1: z.string().url('Invalid Social Link 1 URL').optional(),
  socialLink2: z.string().url('Invalid Social Link 2 URL').optional(),
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

  const stepsArray = ['Content', 'Design', 'QRCode'];
  const currentStep = 1;

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

  const renderSocialLinks = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Social Links
      </Heading>
      <Row>
        <Input
          label="Facebook"
          {...register('facebook')}
          error={errors.facebook?.message}
        />
        <Input
          label="Instagram"
          {...register('instagram')}
          error={errors.instagram?.message}
        />
      </Row>
      <Row>
        <Input
          label="LINE"
          {...register('line')}
          error={errors.line?.message}
        />
        <Input
          label="WeChat"
          {...register('wechat')}
          error={errors.wechat?.message}
        />
      </Row>
      <Row>
        <Input
          label="Social Link 1"
          {...register('socialLink1')}
          error={errors.socialLink1?.message}
        />
        <Input
          label="Social Link 2"
          {...register('socialLink2')}
          error={errors.socialLink2?.message}
        />
      </Row>
    </Col>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Col gap="xl">
        <Row align="center" locked>
          <Steps steps={stepsArray} currentStep={currentStep} />
        </Row>
        {renderBasicInfo()}
        {renderSelfIntro()}
        {renderContactInfo()}
        {renderSocialLinks()}
        <Button type="submit">Submit</Button>
      </Col>
    </form>
  );
}
