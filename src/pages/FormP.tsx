import { Heading } from '@/components/Heading';
import { Row } from '@/components/Row';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Col } from '@/components/Col';
import { CustomLinks } from '@/components/CustomLinks';
import { Button } from '@/components/Button';
import {
  IconAddressBook,
  IconEyeOff,
  IconRosetteDiscountCheckFilled,
  IconUser,
  IconUsers,
  IconWorld,
} from '@tabler/icons-react';
import { z } from 'zod';
import { FieldError, FieldErrorsImpl, Merge, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LabelSelect } from '@/components/LabelSelect';

export type VisibleTo = 'all' | 'users' | 'contacts' | 'owner' | 'none';

export type VisibleToOpt = {
  label: string;
  value: VisibleTo;
  icon?: React.ReactNode;
};

export type ContentField<T> = {
  value: T;
  visibleTo: VisibleTo;
};

export type ContactInfo = {
  values: Array<{
    type: string;
    value: string;
  }>;
  visibleTo: VisibleTo;
};

export type ProfileContent = {
  firstName: ContentField<string>;
  lastName: ContentField<string>;
  alternativeName: ContentField<string>;
  email: ContentField<string>;
  gender: ContentField<'M' | 'F'>;
  birthday: ContentField<string>;
  nationality: ContentField<string>;
  idType: ContentField<'taiwanese-id-card' | 'passport'>;
  idNumber: ContentField<string>;
  addressLine1: ContentField<string>;
  addressLine2: ContentField<string>;
  city: ContentField<string>;
  stateProvince: ContentField<string>;
  zipPostalCode: ContentField<string>;
  country: ContentField<string>;
  contactInfo: ContactInfo;
};

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

export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] !== null &&
      source[key] !== undefined &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(
        result[key] as T[Extract<keyof T, string>],
        source[key] as Partial<T[Extract<keyof T, string>]>,
      );
    } else if (source[key] === null || source[key] === undefined) {
      // Fall back to the target's value or an empty string
      result[key] = target[key] ?? ('' as T[Extract<keyof T, string>]);
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }

  return result;
}

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

export const visibleToOpts: VisibleToOpt[] = [
  { label: 'All', value: 'all', icon: <IconWorld size={16} /> },
  { label: 'Users', value: 'users', icon: <IconUsers size={16} /> },
  { label: 'Contacts', value: 'contacts', icon: <IconAddressBook size={16} /> },
  { label: 'Owner', value: 'owner', icon: <IconUser size={16} /> },
  { label: 'None', value: 'none', icon: <IconEyeOff size={16} /> },
];

export const genderOpts = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
];

export const idTypeOpts = [
  { label: 'Taiwanese ID card', value: 'taiwanese-id-card' },
  { label: 'Passport', value: 'passport' },
];

const visibilityEnum = z.enum(['all', 'users', 'contacts', 'owner', 'none']);

export const profileSchema = z.object({
  firstName: z.object({
    value: z
      .string()
      .min(1, { message: 'First name is required and cannot be empty.' }),
    visibleTo: visibilityEnum,
  }),
  lastName: z.object({
    value: z
      .string()
      .min(1, { message: 'Last name is required and cannot be empty.' }),
    visibleTo: visibilityEnum,
  }),
  alternativeName: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  email: z.object({
    value: z
      .string()
      .email({ message: 'Must be a valid email address.' })
      .min(1, { message: 'Email is required and cannot be empty.' }),
    visibleTo: visibilityEnum,
  }),
  gender: z.object({
    value: z.enum(['M', 'F'], {
      errorMap: () => ({ message: 'Gender must be either "M" or "F".' }),
    }),
    visibleTo: visibilityEnum,
  }),
  birthday: z.object({
    value: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Birthday must be in the format YYYY-MM-DD.',
      ),
    visibleTo: visibilityEnum,
  }),
  nationality: z.object({
    value: z
      .string()
      .min(2, { message: 'Nationality must be at least 2 characters long.' }),
    visibleTo: visibilityEnum,
  }),
  idType: z.object({
    value: z.enum(['taiwanese-id-card', 'passport'], {
      errorMap: () => ({
        message: 'ID type must be either "Taiwanese ID card" or "Passport".',
      }),
    }),
    visibleTo: visibilityEnum,
  }),
  idNumber: z.object({
    value: z
      .string()
      .min(1, { message: 'ID number is required and cannot be empty.' }),
    visibleTo: visibilityEnum,
  }),
  addressLine1: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  addressLine2: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  city: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  stateProvince: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  zipPostalCode: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  country: z.object({
    value: z.string(),
    visibleTo: visibilityEnum,
  }),
  contactInfo: z.object({
    values: z
      .array(
        z.object({
          type: z.string(),
          value: z.string(),
        }),
      )
      .default([]),
    visibleTo: visibilityEnum,
  }),
});

export const profileDefaultValues: ProfileContent = {
  firstName: {
    value: '',
    visibleTo: 'all',
  },
  lastName: {
    value: '',
    visibleTo: 'all',
  },
  alternativeName: {
    value: '',
    visibleTo: 'all',
  },
  email: {
    value: '',
    visibleTo: 'all',
  },
  gender: {
    value: 'M',
    visibleTo: 'all',
  },
  birthday: {
    value: '',
    visibleTo: 'all',
  },
  nationality: {
    value: '',
    visibleTo: 'all',
  },
  idType: {
    value: 'taiwanese-id-card',
    visibleTo: 'all',
  },
  idNumber: {
    value: '',
    visibleTo: 'all',
  },
  addressLine1: {
    value: '',
    visibleTo: 'all',
  },
  addressLine2: {
    value: '',
    visibleTo: 'all',
  },
  city: {
    value: '',
    visibleTo: 'all',
  },
  stateProvince: {
    value: '',
    visibleTo: 'all',
  },
  zipPostalCode: {
    value: '',
    visibleTo: 'all',
  },
  country: {
    value: '',
    visibleTo: 'all',
  },
  contactInfo: {
    values: [],
    visibleTo: 'all',
  },
};

export const profile: ProfileContent = {
  firstName: {
    value: 'John',
    visibleTo: 'all',
  },
  lastName: {
    value: 'Doe',
    visibleTo: 'all',
  },
  alternativeName: {
    value: 'Johnny',
    visibleTo: 'users',
  },
  email: {
    value: 'john.doe@example.com',
    visibleTo: 'contacts',
  },
  gender: {
    value: 'M',
    visibleTo: 'all',
  },
  birthday: {
    value: '1990-01-01',
    visibleTo: 'users',
  },
  nationality: {
    value: 'American',
    visibleTo: 'all',
  },
  idType: {
    value: 'taiwanese-id-card',
    visibleTo: 'owner',
  },
  idNumber: {
    value: 'A123456789',
    visibleTo: 'owner',
  },
  addressLine1: {
    value: '123 Main Street',
    visibleTo: 'contacts',
  },
  addressLine2: {
    value: 'Apt 4B',
    visibleTo: 'contacts',
  },
  city: {
    value: 'New York',
    visibleTo: 'all',
  },
  stateProvince: {
    value: 'NY',
    visibleTo: 'all',
  },
  zipPostalCode: {
    value: '10001',
    visibleTo: 'all',
  },
  country: {
    value: 'United States',
    visibleTo: 'all',
  },
  contactInfo: {
    values: [
      { type: 'email', value: 'john.business@example.com' },
      { type: 'phone', value: '+1-555-123-4567' },
    ],
    visibleTo: 'contacts',
  },
};

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
    defaultValues: deepMerge(profileDefaultValues, profile),
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
            label={
              <LabelSelect
                label="First Name"
                value={getValues('firstName.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('firstName.visibleTo', option)}
              />
            }
            {...register('firstName.value')}
            error={errors.firstName?.message}
            required
            disabled
          />
          <Input
            label={
              <LabelSelect
                label="Last Name"
                value={getValues('lastName.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('lastName.visibleTo', option)}
              />
            }
            {...register('lastName.value')}
            required
            error={errors.lastName?.message}
            disabled
          />
          <Input
            label={
              <LabelSelect
                label="Alternative Name"
                value={getValues('alternativeName.visibleTo')}
                options={visibleToOpts}
                onChange={(option) =>
                  setValue('alternativeName.visibleTo', option)
                }
              />
            }
            {...register('alternativeName.value')}
            error={errors.alternativeName?.message}
          />
        </Row>
        <Row>
          <Input
            label={
              <LabelSelect
                label="Email"
                value={getValues('email.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('email.visibleTo', option)}
              />
            }
            {...register('email.value')}
            required
            disabled
            error={errors.email?.message}
          />
          <Select
            label={
              <LabelSelect
                label="Gender"
                value={getValues('gender.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('gender.visibleTo', option)}
              />
            }
            value={getValues('gender.value')}
            options={genderOpts}
            placeholder="Select gender"
            required
            disabled
            onChange={(value) => setValue('gender.value', value as 'M' | 'F')}
            error={errors.gender?.message}
          />
        </Row>
        <Row>
          <Input
            label={
              <LabelSelect
                label="Birthday"
                value={getValues('birthday.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('birthday.visibleTo', option)}
              />
            }
            type="date"
            {...register('birthday.value')}
            required
            disabled
            error={errors.birthday?.message}
          />
          <Select
            label={
              <LabelSelect
                label="Nationality"
                value={getValues('nationality.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('nationality.visibleTo', option)}
              />
            }
            value={getValues('nationality.value')}
            options={countryOptions}
            placeholder="Select nationality"
            required
            disabled
            onChange={(value) => setValue('nationality.value', value)}
            error={errors.nationality?.message}
          />
        </Row>
        <Row>
          <Select
            label={
              <LabelSelect
                label="ID Type"
                value={getValues('idType.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('idType.visibleTo', option)}
              />
            }
            value={getValues('idType.value')}
            placeholder="Select ID type"
            onChange={(option) =>
              setValue(
                'idType.value',
                option as 'taiwanese-id-card' | 'passport',
              )
            }
            required
            disabled
            options={idTypeOpts}
            error={errors.idType?.message}
          />
          <Input
            label={
              <LabelSelect
                label="ID Number"
                value={getValues('idNumber.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('idNumber.visibleTo', option)}
              />
            }
            {...register('idNumber.value')}
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
          label={
            <LabelSelect
              label="Address Line 1"
              value={getValues('addressLine1.visibleTo')}
              options={visibleToOpts}
              onChange={(option) => setValue('addressLine1.visibleTo', option)}
            />
          }
          {...register('addressLine1.value')}
          error={errors.addressLine1?.message}
        />
      </Row>
      <Row>
        <Input
          label={
            <LabelSelect
              label="Address Line 2"
              value={getValues('addressLine2.visibleTo')}
              options={visibleToOpts}
              onChange={(option) => setValue('addressLine2.visibleTo', option)}
            />
          }
          {...register('addressLine2.value')}
          error={errors.addressLine2?.message}
        />
      </Row>
      <Row>
        <Input
          label={
            <LabelSelect
              label="City"
              value={getValues('city.visibleTo')}
              options={visibleToOpts}
              onChange={(option) => setValue('city.visibleTo', option)}
            />
          }
          {...register('city.value')}
          error={errors.city?.message}
        />
        <Input
          label={
            <LabelSelect
              label="State/Province"
              value={getValues('stateProvince.visibleTo')}
              options={visibleToOpts}
              onChange={(option) => setValue('stateProvince.visibleTo', option)}
            />
          }
          {...register('stateProvince.value')}
          error={errors.stateProvince?.message}
        />
      </Row>
      <Row>
        <Input
          label={
            <LabelSelect
              label="Zip/Postal Code"
              value={getValues('zipPostalCode.visibleTo')}
              options={visibleToOpts}
              onChange={(option) => setValue('zipPostalCode.visibleTo', option)}
            />
          }
          {...register('zipPostalCode.value')}
          error={errors.zipPostalCode?.message}
        />
        <Select
          label={
            <LabelSelect
              label="Country"
              value={getValues('country.visibleTo')}
              options={visibleToOpts}
              onChange={(option) => setValue('country.visibleTo', option)}
            />
          }
          value={getValues('country.value')}
          options={countryOptions}
          onChange={(option) => setValue('country.value', option)}
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
        links={getValues('contactInfo.values')}
        options={contactTypes}
        onChange={(links) => setValue('contactInfo.values', links)}
        errors={clErrFromErr(errors.contactInfo?.values)}
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
