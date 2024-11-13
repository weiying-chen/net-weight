import {
  useForm,
  SubmitHandler,
  Merge,
  FieldError,
  FieldErrorsImpl,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { Col } from '@/components/Col';
import { TagInput } from '@/components/TagInput';
import { Button } from '@/components/Button';
import { CustomFields } from '@/components/CustomFields';
import { Switch } from '@/components/Switch';
import { Detail } from '@/components/Detail';
import { FileUpload } from '@/components/FileUpload';
import { useEffect, useState } from 'react';
import { Tag } from '@/components/Tag';
import { Modal } from '@/components/Modal';
import { FilePreviews } from '@/components/FilePreviews';

type Folder = {
  id: string;
  name: string;
  fileIds: string[];
  attributes: string[];
  folders: Folder[];
};

type ValueType = 'string' | 'number' | 'boolean';

type CustomField = {
  key: string;
  value: string | number | boolean;
  type: ValueType;
};

const asset = {
  id: 'file1',
};

const folders = [
  {
    id: 'folder1',
    name: 'Folder 1',
    fileIds: ['file1', 'file2'],
    attributes: ['attr1', 'attr2'],
    folders: [],
  },
  {
    id: 'folder2',
    name: 'Folder 2',
    fileIds: ['file1', 'file2'],
    attributes: ['attr2', 'attr3'],
    folders: [],
  },
];

const uploadedFiles = [
  {
    url: 'https://via.placeholder.com/150',
    name: 'placeholder1.jpg',
    file: null,
  },
  {
    url: 'https://via.placeholder.com/200',
    name: 'placeholder2.png',
    file: null,
  },
];

const countryOptions = [
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'australia', label: 'Australia' },
  { value: 'india', label: 'India' },
];

function findDupeKeys(customFields: Array<{ key: string }>, ctx: any) {
  const keys = customFields.map((field) => field.key);
  const dupes = keys.filter((key, index) => keys.indexOf(key) !== index);

  dupes.forEach((dupe) => {
    keys.forEach((key, index) => {
      if (key === dupe) {
        ctx.addIssue({
          code: 'custom',
          path: [index, 'key'],
          message: `Duplicate key "${dupe}" found`,
        });
      }
    });
  });
}

export const cfErrFromErr = (
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

  return errors.map((fieldError: any) => ({
    key: fieldError?.key?.message,
    value: fieldError?.value?.message,
  }));
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  country: z.string().min(1, 'Country is required'),
  customFields: z
    .array(
      z.object({
        key: z.string().min(1, 'Key is required'),
        value: z.union([z.string(), z.number(), z.boolean()]),
        type: z.enum(['string', 'number', 'boolean']),
      }),
    )
    .superRefine((customFields, ctx) => {
      findDupeKeys(customFields, ctx);
    }),
  isEnabled: z.boolean(),
  files: z.array(z.instanceof(File)).min(1, 'Files is required'),
});

type FormData = z.infer<typeof schema>;

export function Form() {
  const [isEdit, setIsEdit] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currFolder, setCurrFolder] = useState<Folder | null>(null);
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const {
    register,
    handleSubmit,
    setValue: setValueBase,
    getValues,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      tags: ['tag 1', 'tag 2'],
      country: 'usa',
      customFields: [],
      isEnabled: false,
      files: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

  useEffect(() => {
    console.log('Custom fields:', getValues('customFields'));
  }, [setValueBase]);

  const handleBeforeRemove = (field: CustomField) => {
    const foldersWithFile = folders
      .flatMap((folder) => [folder, ...folder.folders])
      .filter((folder) => folder.fileIds.includes(asset.id));

    for (const folder of foldersWithFile) {
      const attrToRemove = field.key;
      const isMatch = folder.attributes.includes(attrToRemove);

      if (isMatch) {
        setCurrFolder(folder);
        setIsModalOpen(true);

        return new Promise<boolean>((resolve) => {
          setConfirmResolve(() => resolve);
        });
      }
    }

    return Promise.resolve(true);
  };

  const handleOkClick = () => {
    if (confirmResolve) confirmResolve(true);
    setIsModalOpen(false);
  };

  const handleCloseClick = () => {
    if (confirmResolve) confirmResolve(false);
    setIsModalOpen(false);
  };

  const setValue = (name: keyof FormData, value: any) => {
    setValueBase(name, value, {
      shouldDirty: true,
      shouldValidate: isSubmitted,
    });
  };

  return (
    <Col>
      <Button
        type="button"
        onClick={() => setIsEdit((prevShowForm) => !prevShowForm)}
      >
        {isEdit ? 'Editing' : 'Viewing'}
      </Button>
      <br />
      {isEdit ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Col gap="xl">
            <Col gap="lg">
              <Heading hasBorder isFull>
                Basic information
              </Heading>
              <Row>
                <Input
                  label="Name"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Switch
                  label="Enabled"
                  checked={getValues('isEnabled')}
                  className="w-auto"
                  onChange={(checked) => setValue('isEnabled', checked)}
                />
                <Select
                  label="Country"
                  value={getValues('country')}
                  options={countryOptions}
                  placeholder="Select your country"
                  error={errors.country?.message}
                  onChange={(option) => setValue('country', option.toString())}
                />
              </Row>
              <Textarea
                label="Description"
                disabled
                {...register('description')}
                error={errors.description?.message}
              />
              <FileUpload
                label="Upload Images"
                files={uploadedFiles}
                multiple={true}
                onChange={(files) => {
                  // Map and filter to extract only non-null `File` objects
                  console.log(files);
                  const validFiles = files
                    .map((fileData) => fileData.file) // Extract `file` from each `FileData`
                    .filter((file): file is File => file !== null); // Filter out any `null` entries

                  setValue('files', validFiles); // Update form state with `File[]`
                }}
                error={errors.files?.message}
              />
            </Col>
            <Col gap="lg">
              <Heading hasBorder isFull>
                Tags
              </Heading>
              <TagInput
                tags={getValues('tags') || []}
                placeholder="Type and press Enter or Tab"
                error={errors.tags?.message}
                onChange={(tags) => setValue('tags', tags)}
              />
            </Col>
            <Col gap="lg">
              <Heading hasBorder isFull>
                Custom fields
              </Heading>
              <CustomFields
                fields={getValues('customFields')}
                onChange={(fields) => {
                  setValue('customFields', fields);
                }}
                onBeforeRemove={async (field) =>
                  await handleBeforeRemove(field)
                }
                errors={cfErrFromErr(errors.customFields)}
              />
            </Col>
            <Button type="submit" disabled={!isDirty}>
              Submit
            </Button>
          </Col>
        </form>
      ) : (
        <Col gap="xl">
          <Col gap="lg">
            <Heading hasBorder isFull>
              Basic information
            </Heading>
            <Row>
              <Detail label="Name" content={getValues('name') || '-'} />
              <Detail
                label="Enabled"
                content={getValues('isEnabled') ? 'Yes' : 'No'}
              />
              <Detail label="Country" content={getValues('country')} />
            </Row>
            <Detail
              label="Description"
              content={getValues('description') || '-'}
            />
          </Col>
          <Col gap="lg">
            <Heading hasBorder isFull>
              Tags
            </Heading>
            <Detail
              content={getValues('tags')?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            />
          </Col>
          <Col gap="lg">
            <Heading hasBorder isFull>
              Custom Fields
            </Heading>
            {getValues('customFields').map((field, index) => (
              <Detail
                key={index}
                label={field.key}
                content={
                  field.type === 'boolean' ? (
                    <Switch checked={field.value as boolean} />
                  ) : (
                    field.value
                  )
                }
              />
            ))}
          </Col>
          <Col gap="lg">
            <Heading hasBorder isFull>
              Uploaded Files
            </Heading>
          </Col>
          <Detail
            content={
              (getValues('files') ?? []).length > 0 ? (
                <FilePreviews files={uploadedFiles} />
              ) : (
                '-'
              )
            }
          />
        </Col>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseClick}>
        <p>{currFolder?.name}</p>
        <Button onClick={handleOkClick}>OK</Button>
        <Button onClick={handleCloseClick}>Close</Button>
      </Modal>
    </Col>
  );
}
