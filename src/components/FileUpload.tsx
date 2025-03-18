import { useState, useEffect, ReactNode } from 'react';
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
  files?: FileData[];
  maxSize?: number;
  multiple?: boolean;
  accept?: { [key: string]: string[] };
  acceptText?: string;
  required?: boolean;
  onEditClick?: (index: number) => void;
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
  onEditClick,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  // const prevInitialFilesRef = useRef(initialFiles); // Keep track of last prop state

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
    // if (JSON.stringify(files) !== JSON.stringify(initialFiles)) {
    setFiles([...initialFiles]); // 🚀 Ensures new reference
    // }
  }, [initialFiles]);

  // Cleanup URLs to prevent memory leaks
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
        <p className="text-xs text-muted">{`${acceptText}${Object.values(accept).flat().join(', ')}`}</p>
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
            onEditClick={onEditClick}
          />
        )}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
