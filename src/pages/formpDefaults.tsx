import {
  IconAddressBook,
  IconBlendMode,
  IconUser,
  IconUsers,
  IconWorld,
} from '@tabler/icons-react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { z } from 'zod';

export type SecVisibleTo = 'all' | 'users' | 'contacts' | 'owner' | 'mixed';
export type VisibleTo = 'all' | 'users' | 'contacts' | 'owner';

export type SecVisibleToOpt = {
  label: string;
  value: SecVisibleTo;
  icon?: React.ReactNode;
  isHidden?: boolean;
};

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

export const contactTypes = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'telephone', label: 'Telephone' },
  { value: 'fax', label: 'Fax' },
];

export const secVisibleToOpts: SecVisibleToOpt[] = [
  { label: 'All', value: 'all', icon: <IconWorld size={16} /> },
  { label: 'Users', value: 'users', icon: <IconUsers size={16} /> },
  { label: 'Contacts', value: 'contacts', icon: <IconAddressBook size={16} /> },
  { label: 'Owner', value: 'owner', icon: <IconUser size={16} /> },
  {
    label: 'Mixed',
    value: 'mixed',
    icon: <IconBlendMode size={16} />,
    isHidden: true,
  },
  // { label: 'None', value: 'none', icon: <IconEyeOff size={16} /> },
];

export const visibleToOpts: VisibleToOpt[] = [
  { label: 'All', value: 'all', icon: <IconWorld size={16} /> },
  { label: 'Users', value: 'users', icon: <IconUsers size={16} /> },
  { label: 'Contacts', value: 'contacts', icon: <IconAddressBook size={16} /> },
  { label: 'Owner', value: 'owner', icon: <IconUser size={16} /> },
  // { label: 'None', value: 'none', icon: <IconEyeOff size={16} /> },
];

export const genderOpts = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
];

export const idTypeOpts = [
  { label: 'Taiwanese ID card', value: 'taiwanese-id-card' },
  { label: 'Passport', value: 'passport' },
];

const visibilityEnum = z.enum(['all', 'users', 'contacts', 'owner']);

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
