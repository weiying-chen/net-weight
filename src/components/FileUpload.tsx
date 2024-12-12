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
  files?: { url?: string; name: string; file?: File }[];
  maxSize?: number;
  multiple?: boolean;
  accept?: { [key: string]: string[] };
  acceptText?: string;
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
  acceptText,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles);

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

  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">{label}</label>
        ) : (
          label
        ))}
      <div
        tabIndex={0}
        {...getRootProps()}
        className={cn(
          'relative w-full cursor-pointer rounded border-2 border-dashed border-border p-6 text-sm outline-none ring-foreground ring-offset-2 transition-colors focus-visible:ring-2',
          { 'border-danger': error },
        )}
      >
        <input {...getInputProps()} />
        <Col gap="sm" alignItems="center">
          <p>{isDragActive ? 'Drop the files here...' : placeholder}</p>
          <p className="text-xs text-muted">
            {acceptText || `Accepted file type(s): ${acceptedFileTypes}`}
          </p>
        </Col>
      </div>
      {files.length > 0 && (
        <FilePreviews
          files={files}
          multiple={multiple}
          onRemoveFile={handleRemoveFile}
        />
      )}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
