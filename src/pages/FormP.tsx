import { Heading } from '@/components/Heading';
import { Row } from '@/components/Row';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Col } from '@/components/Col';
import { CustomLinks } from '@/components/CustomLinks';
import { Button } from '@/components/Button';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { z } from 'zod';
import { FieldError, FieldErrorsImpl, Merge, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const Separator: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return <hr className={`w-full border-foreground ${className}`} />;
};

export const clErrFromErr = (
  errors?:
    | Merge<
        FieldError,
        (FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined)[]
      >
    | undefined,
) => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors.map((error: any) => ({
    type: error?.type?.message,
    value: error?.value?.message,
  }));
};

export const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
];

const contactTypes = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'telephone', label: 'Telephone' },
  { value: 'fax', label: 'Fax' },
];

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required and cannot be empty.' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required and cannot be empty.' }),
  alternativeName: z.string(),
  email: z
    .string()
    .email({ message: 'Must be a valid email address.' })
    .min(1, { message: 'Email is required and cannot be empty.' }),
  gender: z.enum(['M', 'F'], {
    errorMap: () => ({ message: 'Gender must be either "M" or "F".' }),
  }),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in the format YYYY-MM-DD.'),
  nationality: z
    .string()
    .min(2, { message: 'Nationality must be at least 2 characters long.' }),
  idType: z.enum(['Taiwanese ID card', 'Passport'], {
    errorMap: () => ({
      message: 'ID type must be either "Taiwanese ID card" or "Passport".',
    }),
  }),
  idNumber: z
    .string()
    .min(1, { message: 'ID number is required and cannot be empty.' }),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  stateProvince: z.string(),
  zipPostalCode: z.string(),
  country: z.string(),
  contactInfo: z
    .array(
      z.object({
        type: z.string(),
        value: z.string(),
      }),
    )
    .default([]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const FormP = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      alternativeName: '',
      email: '',
      gender: 'M',
      birthday: '',
      nationality: '',
      idType: 'Taiwanese ID card',
      idNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      zipPostalCode: '',
      country: '',
      contactInfo: [],
    },
  });

  const onClickUpload = () => {
    console.log('Upload document button clicked!');
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log('Form submitted:', data);
  };

  const renderGeneralInfo = () => {
    // TODO: @REMOVE this
    const isVerified = false; // Example for showing verification

    return (
      <Col>
        <Row alignItems="center">
          <Heading size="sm">General Information</Heading>
          <IconRosetteDiscountCheckFilled
            size={20}
            className={isVerified ? 'text-primary' : 'text-muted'}
          />
          <Button
            variant="secondary"
            className="h-6 px-2 py-1 text-xs"
            onClick={onClickUpload}
          >
            Upload document
          </Button>
        </Row>
        <Separator />
        <Row>
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
            disabled
          />
          <Input
            label="Last Name"
            {...register('lastName')}
            required
            error={errors.lastName?.message}
            disabled
          />
          <Input
            label="Alternative Name"
            {...register('alternativeName')}
            error={errors.alternativeName?.message}
          />
        </Row>
        <Row>
          <Input
            label="Email"
            {...register('email')}
            required
            disabled
            error={errors.email?.message}
          />
          <Select
            label="Gender"
            value={getValues('gender')}
            options={[
              { label: 'Male', value: 'M' },
              { label: 'Female', value: 'F' },
            ]}
            placeholder="Select gender"
            required
            disabled
            onChange={(option) => setValue('gender', option as 'M' | 'F')}
            error={errors.gender?.message}
          />
        </Row>
        <Row>
          <Input
            label="Birthday"
            type="date"
            {...register('birthday')}
            required
            disabled
            error={errors.birthday?.message}
          />
          <Select
            label="Nationality"
            value={getValues('nationality')}
            options={countryOptions}
            placeholder="Select nationality"
            required
            disabled
            onChange={(option) => setValue('nationality', option as string)}
            error={errors.nationality?.message}
          />
        </Row>
        <Row>
          <Select
            label="ID Type"
            value={getValues('idType')}
            options={[
              { label: 'Taiwanese ID card', value: 'Taiwanese ID card' },
              { label: 'Passport', value: 'Passport' },
            ]}
            placeholder="Select ID type"
            onChange={(option) =>
              setValue('idType', option as 'Taiwanese ID card' | 'Passport')
            }
            required
            disabled
            error={errors.idType?.message}
          />
          <Input
            label="ID Number"
            {...register('idNumber')}
            required
            disabled
            error={errors.idNumber?.message}
          />
        </Row>
      </Col>
    );
  };

  const renderOtherInfo = () => (
    <Col>
      <Heading size="sm" isFull hasBorder>
        Other Information
      </Heading>
      <Row>
        <Input
          label="Address Line 1"
          {...register('addressLine1')}
          error={errors.addressLine1?.message}
        />
      </Row>
      <Row>
        <Input
          label="Address Line 2"
          {...register('addressLine2')}
          error={errors.addressLine2?.message}
        />
      </Row>
      <Row>
        <Input
          label="City"
          {...register('city')}
          error={errors.city?.message}
        />
        <Input
          label="State/Province"
          {...register('stateProvince')}
          error={errors.stateProvince?.message}
        />
      </Row>
      <Row>
        <Input
          label="Zip/Postal Code"
          {...register('zipPostalCode')}
          error={errors.zipPostalCode?.message}
        />
        <Select
          label="Country"
          value={getValues('country')}
          options={countryOptions}
          onChange={(option) => setValue('country', option as string)}
          error={errors.country?.message}
        />
      </Row>
    </Col>
  );

  const renderContactInfo = () => (
    <Col>
      <Heading size="sm" isFull hasBorder>
        Contact Information
      </Heading>
      <CustomLinks
        links={getValues('contactInfo')}
        options={contactTypes}
        onChange={(links) => setValue('contactInfo', links)}
        errors={clErrFromErr(errors.contactInfo)}
      />
    </Col>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Col gap="lg">
        {renderGeneralInfo()}
        {renderOtherInfo()}
        {renderContactInfo()}
        <Row align="end">
          <Button type="submit">Submit</Button>
        </Row>
      </Col>
    </form>
  );
};
