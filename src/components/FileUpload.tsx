import { useState, useEffect, ReactNode, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FilePreviews } from '@/components/FilePreviews';

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
  files?: { url?: string; name: string; file?: File }[];
  maxSize?: number;
  multiple?: boolean;
  accept?: { [key: string]: string[] };
  acceptText?: string;
  required?: boolean;
};

export function FileUpload({
  label,
  placeholder = 'Drag & drop or click to upload',
  error,
  className,
  onChange,
  files: initialFiles = [],
  maxSize = Infinity,
  multiple = true,
  accept = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg'],
    'application/pdf': ['.pdf'],
  },
  acceptText = 'Accepted file type(s): ',
  required,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const initialized = useRef(false);

  const updateFiles = (newFiles: FileData[]) => {
    setFiles(newFiles);
    onChange(newFiles);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        url: isImage ? URL.createObjectURL(file) : undefined,
        name: file.name,
        file,
      };
    });

    updateFiles(multiple ? [...files, ...newFiles] : newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  useEffect(() => {
    return () => {
      files.forEach((fileData) => {
        if (fileData.url) {
          URL.revokeObjectURL(fileData.url);
        }
      });
    };
  }, [files]);

  const formatNames = {
    '.jpeg': 'JPEG',
    '.jpg': 'JPEG',
    '.png': 'PNG',
    '.svg': 'SVG',
    '.pdf': 'PDF',
    '.mib': 'MIB',
  };

  const acceptedFileTypes = Object.values(accept)
    .flat()
    .map((ext) => formatNames[ext as keyof typeof formatNames] || ext)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(', ');

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
          {`${acceptText}${acceptedFileTypes}`}
        </p>
      </Col>
    </div>
  );

  useEffect(() => {
    if (!initialized.current && initialFiles.length > 0) {
      setFiles(initialFiles);
      initialized.current = true;
    }
  }, [initialFiles]);

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
          multiple
            ? 'flex-col gap-4'
            : 'flex-col items-stretch gap-2 md:flex-row',
        )}
      >
        {renderDropzone()}
        {files.length > 0 && (
          <FilePreviews
            files={files}
            multiple={multiple}
            className={cn({ 'order-first md:w-1/3': !multiple })}
            onRemoveFile={handleRemoveFile}
          />
        )}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
