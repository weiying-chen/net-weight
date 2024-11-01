import { useState, useEffect, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FilePreviews } from '@/components/FilePreviews';

type FileUploadProps = {
  label?: ReactNode;
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (files: File[]) => void;
  files?: { url: string; name: string; file: File | null }[];
  maxSize?: number;
  multiple?: boolean;
};

type FileData = {
  url: string | null;
  name: string;
  file: File | null;
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
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles);

  const updateFiles = (newFiles: FileData[]) => {
    setFiles(newFiles);
    onChange(
      newFiles
        .map((fileData) => fileData.file)
        .filter((file) => file !== null) as File[],
    );
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        url: isImage ? URL.createObjectURL(file) : null,
        name: file.name,
        file,
      };
    });

    // If multiple is false, replace the existing files with the new ones
    updateFiles(multiple ? [...files, ...newFiles] : newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
    },
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

  return (
    <Col className={className}>
      {label &&
        (typeof label === 'string' ? (
          <label className="text-sm font-semibold">{label}</label>
        ) : (
          label // Render label as-is if it's a ReactNode
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
        <p className="text-center">
          {isDragActive ? 'Drop the images here...' : placeholder}
        </p>
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
