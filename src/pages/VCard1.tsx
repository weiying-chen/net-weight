import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Col } from '@/components/Col';
import { FileUpload } from '@/components/FileUpload';
import { Heading } from '@/components/Heading';
import { CustomLinks } from '@/components/CustomLinks';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLine,
  IconBrandWechat,
  IconSocial,
} from '@tabler/icons-react';
import { VCardForm } from '@/pages/VCardForm';
import { Row } from '@/components/Row';

// TODO: turn this into a constant

const steps = [
  { label: 'Content', url: '/vcard1' },
  { label: 'Design', url: '/vcard2' },
  { label: 'QRCode', url: '/vcard3' },
];

const currentStep = 1;

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
      z.object({ platform: z.string().optional(), url: z.string().optional() }),
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

const platforms = [
  {
    value: 'facebook',
    label: 'Facebook',
    icon: <IconBrandFacebook size={20} />,
  },
  {
    value: 'instagram',
    label: 'Instagram',
    icon: <IconBrandInstagram size={20} />,
  },
  { value: 'line', label: 'Line', icon: <IconBrandLine size={20} /> },
  { value: 'wechat', label: 'WeChat', icon: <IconBrandWechat size={20} /> },
  { value: 'other', label: 'Other', icon: <IconSocial size={20} /> },
];

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

  const renderBasicInfo = () => (
    <Col gap="lg">
      <Heading size="sm" hasBorder isFull>
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
      <Heading size="sm" hasBorder isFull>
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
      <Heading size="sm" hasBorder isFull>
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

  const renderCustomLinks = () => (
    <Col gap="lg">
      <Heading size="sm" hasBorder isFull>
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
    <VCardForm
      currentStep={currentStep}
      steps={steps}
      onSubmit={handleSubmit(onSubmit)}
    >
      {renderBasicInfo()}
      {renderSelfIntro()}
      {renderContactInfo()}
      {renderCustomLinks()}
    </VCardForm>
  );
}
