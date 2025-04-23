import { useState, useEffect, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FilePreviews } from '@/components/FilePreviews';
import { Peeker } from '@/components/Peeker';

export type FileData = {
  url?: string;
  name: string;
  file?: File;
  [key: string]: any;
};

type FileUploadProps = {
  label?: ReactNode;
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (files: FileData[]) => void;
  files?: FileData[];
  maxSize?: number;
  layout?: 'grid' | 'avatar' | 'banner' | 'avatarBottom';
  accept?: { [key: string]: string[] };
  acceptText?: string;
  required?: boolean;
  onEditClick?: (index: number) => void;
  noFileText?: string;
  previewClassName?: string;
  xZIndex?: number;
};

export function FileUpload({
  label,
  placeholder = 'Drag & drop or click to upload',
  error,
  className,
  onChange,
  files: initialFiles = [],
  maxSize = Infinity,
  layout = 'grid',
  accept = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg'],
    'application/pdf': ['.pdf'],
  },
  acceptText = 'Accepted file type(s): ',
  required,
  onEditClick,
  noFileText,
  previewClassName,
  xZIndex = 100,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const isPreviewBottom =
    layout === 'grid' || layout === 'banner' || layout === 'avatarBottom';
  const allowMultiple = layout === 'grid';

  const updateFiles = (newFiles: FileData[]) => {
    setFiles(newFiles);
    onChange(newFiles);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      url: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
      name: file.name,
      file,
    }));

    updateFiles(allowMultiple ? [...files, ...newFiles] : newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: allowMultiple,
  });

  useEffect(() => {
    if (JSON.stringify(files) !== JSON.stringify(initialFiles)) {
      setFiles([...initialFiles]);
    }
  }, [initialFiles]);

  useEffect(() => {
    return () => {
      files.forEach((fileData) => {
        if (fileData.url) URL.revokeObjectURL(fileData.url);
      });
    };
  }, [files]);

  const renderDropzone = () => (
    <div
      tabIndex={0}
      {...getRootProps()}
      className={cn(
        'relative flex w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-border p-6 text-sm outline-none ring-foreground ring-offset-2 ring-offset-background transition-colors focus-visible:ring-2',
        { 'border-danger': error },
      )}
    >
      <input {...getInputProps()} />
      <Col gap="sm" alignItems="center">
        <p>{isDragActive ? 'Drop the files here...' : placeholder}</p>
        <p className="text-xs text-muted">
          {`${acceptText}${Object.values(accept).flat().join(', ')}`}
        </p>
      </Col>
    </div>
  );

  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">
            {label} {required && <span className="text-danger"> *</span>}
          </label>
        ) : (
          label
        ))}
      <div
        className={cn(
          'flex w-full',
          isPreviewBottom
            ? 'flex-col gap-2'
            : 'flex-col items-stretch gap-2 md:flex-row',
        )}
      >
        {renderDropzone()}
        {(files.length > 0 || noFileText) &&
          (isPreviewBottom && layout === 'grid' && files.length > 10 ? (
            <Peeker
              peekHeight={200}
              className={cn(
                { 'order-first md:w-1/3': !isPreviewBottom },
                previewClassName,
              )}
            >
              <FilePreviews
                files={files}
                layout={layout}
                onRemoveFile={handleRemoveFile}
                onEditClick={onEditClick}
                noFileText={noFileText}
                xZIndex={xZIndex}
              />
            </Peeker>
          ) : (
            <FilePreviews
              files={files}
              layout={layout}
              className={cn(
                { 'order-first md:w-1/3': !isPreviewBottom },
                previewClassName,
              )}
              onRemoveFile={handleRemoveFile}
              onEditClick={onEditClick}
              noFileText={noFileText}
              xZIndex={xZIndex}
            />
          ))}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
