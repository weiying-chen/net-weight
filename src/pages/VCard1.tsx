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
import { Avatar } from '@/components/Avatar';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLine,
  IconBrandWechat,
  IconHome,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSocial,
} from '@tabler/icons-react';
import { Card } from '@/components/Card';
import { useEffect, useRef, useState } from 'react';
import { PhonePreview } from '@/components/PhonePreview';

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

const steps = [
  { label: 'Content', url: '/vcard1' },
  { label: 'Design', url: '/vcard2' },
  { label: 'QRCode', url: '/vcard3' },
];

const currentStep = 1;

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

  const handleStepClick = (url: string) => {
    window.location.href = url;
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

  const previewSelfIntro = () => (
    <Card>
      <Col gap="lg">
        <Heading size="sm" hasBorder isFull>
          Self-introduction
        </Heading>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Col>
    </Card>
  );

  const previewContactInfo = () => (
    <Card>
      <Col gap="lg">
        <Heading size="sm" hasBorder isFull>
          Contact Info
        </Heading>
        <Row alignItems="center">
          <IconPhone />
          +1 (123) 456-7890
        </Row>
        <Row alignItems="center">
          <IconMail />
          example@example.com
        </Row>
        <Row alignItems="center">
          <IconMapPin />
          www.example.com
        </Row>
        <Row alignItems="center">
          <IconHome />
          1234 Main St, Springfield, USA
        </Row>
      </Col>
    </Card>
  );

  const previewCustomLinks = () => (
    <Card>
      <Col gap="lg">
        <Heading size="sm" hasBorder isFull>
          Social Links
        </Heading>
        <Row alignItems="center">
          <IconBrandFacebook size={20} />
          <a href="#">facebook.com/example</a>
        </Row>
        <Row alignItems="center">
          <IconBrandInstagram size={20} />
          <a href="#">instagram.com/example</a>
        </Row>
        <Row alignItems="center">
          <IconBrandLine size={20} />
          example_line
        </Row>
        <Row alignItems="center">
          <IconBrandWechat size={20} />
          example_wechat
        </Row>
      </Col>
    </Card>
  );

  const renderPreview = () => {
    return (
      <Col gap="lg" alignItems="center">
        <Heading size="sm" hasBorder isFull>
          Preview
        </Heading>
        <PhonePreview>
          <Col gap="lg" className="p-6">
            <Col alignItems="center">
              <Avatar
                size="lg"
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              <Heading size="lg">Title</Heading>
              <Heading>Heading</Heading>
              <Heading size="sm">Subheading</Heading>
            </Col>
            {previewSelfIntro()}
            {previewContactInfo()}
            {previewCustomLinks()}
          </Col>
        </PhonePreview>
      </Col>
    );
  };

  return (
    <Col alignItems="center">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
              <Col gap="xl">
                {renderBasicInfo()}
                {renderSelfIntro()}
                {renderContactInfo()}
                {renderCustomLinks()}
              </Col>
            </Card>
            <Card className="flex-grow basis-1/3">{renderPreview()}</Card>
          </Row>
          <Row align="end">
            <Button type="submit">Submit</Button>
          </Row>
        </Col>
      </form>
    </Col>
  );
}
