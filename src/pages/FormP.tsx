import { Row } from '@/components/Row';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Col } from '@/components/Col';
import { CustomLinks } from '@/components/CustomLinks';
import { Button } from '@/components/Button';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LabelSelect } from '@/components/LabelSelect';
import { HeadingSelect } from '@/components/HeadingSelect';
import { DatePicker } from '@/components/DatePicker';
import {
  clErrFromErr,
  contactTypes,
  countryOptions,
  deepMerge,
  genderOpts,
  idTypeOpts,
  profile,
  profileDefaultValues,
  profileSchema,
  ProfileSecVis,
  secVisibleToOpts,
  Separator,
  ProfileVis,
  visibleToOpts,
} from '@/pages/formpDefaults';
import { Heading } from '@/components/Heading';
import { LabelStatus } from '@/components/LabelStatus';

type ProfileFormValues = z.infer<typeof profileSchema>;

export const FormP = () => {
  const {
    register,
    control,
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

  function getSecVisibleTo(...fields: ProfileVis[]): ProfileSecVis {
    const first = fields[0] as ProfileVis;
    return fields.every((f) => f === first) ? first : 'mixed';
  }

  const getGeneralInfoSecVisibleTo = (): ProfileSecVis => {
    const firstNameVisible = getValues('firstName.visibleTo');
    const lastNameVisible = getValues('lastName.visibleTo');
    const alternativeNameVisible = getValues('alternativeName.visibleTo');
    const emailVisible = getValues('email.visibleTo');
    const genderVisible = getValues('gender.visibleTo');
    const birthdayVisible = getValues('birthday.visibleTo');
    const nationalityVisible = getValues('nationality.visibleTo');
    const idTypeVisible = getValues('idType.visibleTo');
    const idNumberVisible = getValues('idNumber.visibleTo');

    return getSecVisibleTo(
      firstNameVisible,
      lastNameVisible,
      alternativeNameVisible,
      emailVisible,
      genderVisible,
      birthdayVisible,
      nationalityVisible,
      idTypeVisible,
      idNumberVisible,
    );
  };

  const getOtherInfoSecVisibleTo = (): ProfileSecVis => {
    const addressLine1Visible = getValues('addressLine1.visibleTo');
    const addressLine2Visible = getValues('addressLine2.visibleTo');
    const cityVisible = getValues('city.visibleTo');
    const stateProvinceVisible = getValues('stateProvince.visibleTo');
    const zipPostalCodeVisible = getValues('zipPostalCode.visibleTo');
    const countryVisible = getValues('country.visibleTo');

    return getSecVisibleTo(
      addressLine1Visible,
      addressLine2Visible,
      cityVisible,
      stateProvinceVisible,
      zipPostalCodeVisible,
      countryVisible,
    );
  };

  // const getContactInfoSecVisibleTo = (): ProfileSecVis => {
  //   const contactInfoVisible = getValues('contactInfo.visibleTo');
  //   return contactInfoVisible;
  // };

  // Triggers re-renders when `HeadingSelect` updates form values
  useWatch({ control });

  const renderGeneralInfo = () => {
    // TODO: @REMOVE this
    const isVerified = false; // Example for showing verification

    return (
      <Col>
        <Row alignItems="center">
          <HeadingSelect
            heading="General Information"
            value={getGeneralInfoSecVisibleTo()}
            options={secVisibleToOpts}
            onChange={(option) => {
              if (option !== 'mixed') {
                setValue('firstName.visibleTo', option);
                setValue('lastName.visibleTo', option);
                setValue('alternativeName.visibleTo', option);
                setValue('email.visibleTo', option);
                setValue('gender.visibleTo', option);
                setValue('birthday.visibleTo', option);
                setValue('nationality.visibleTo', option);
                setValue('idType.visibleTo', option);
                setValue('idNumber.visibleTo', option);
              }
            }}
          />
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
          <DatePicker
            label={
              <LabelSelect
                label="Birthday"
                value={getValues('birthday.visibleTo')}
                options={visibleToOpts}
                onChange={(option) => setValue('birthday.visibleTo', option)}
              />
            }
            value={getValues('birthday.value')}
            onChange={(date) => setValue('birthday.value', date)}
            placeholder="Select a date"
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
      <HeadingSelect
        heading="Other Information"
        value={getOtherInfoSecVisibleTo()}
        options={secVisibleToOpts}
        onChange={(option) => {
          if (option !== 'mixed') {
            setValue('addressLine1.visibleTo', option);
            setValue('addressLine2.visibleTo', option);
            setValue('city.visibleTo', option);
            setValue('stateProvince.visibleTo', option);
            setValue('zipPostalCode.visibleTo', option);
            setValue('country.visibleTo', option);
          }
        }}
      />
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
      {/*
      <HeadingSelect
        heading="Contact Information"
        value={getContactInfoSecVisibleTo()}
        options={secVisibleToOpts}
        onChange={(option) => {
          if (option !== 'mixed') {
            setValue('contactInfo.visibleTo', option);
          }
        }}
      />
    */}
      <Heading isFull hasBorder>
        Contact information
      </Heading>
      <CustomLinks<{ visibleTo: 'all' | 'users' | 'contacts' | 'owner' }>
        links={getValues('contactInfo.values')}
        options={contactTypes}
        onChange={(links) => setValue('contactInfo.values', links)}
        errors={clErrFromErr(errors.contactInfo?.values)}
        asTypeLabel={(link) => (
          <LabelStatus label="Type" verified={link.visibleTo === 'all'} />
        )}
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
