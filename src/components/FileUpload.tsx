import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { Row } from '@/components/Row';
import { IconX } from '@tabler/icons-react';

type FileUploadProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (files: File[]) => void;
  files?: { url: string; name: string; file: File | null }[];
};

type FileData = {
  url: string;
  name: string;
  file: File | null;
};

export function FileUpload({
  label,
  placeholder = 'Drag & drop or click to upload images',
  error,
  className,
  onChange,
  files: initialFiles = [],
}: FileUploadProps) {
  const [files, setFiles] = useState<FileData[]>(
    initialFiles.map((file) => ({ ...file })),
  );

  const updateFiles = (updatedFiles: FileData[]) => {
    setFiles(updatedFiles);
    onChange(
      updatedFiles
        .map((fileData) => fileData.file)
        .filter((file) => file !== null) as File[],
    );
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    updateFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    updateFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((fileData) => {
        if (fileData.file) {
          URL.revokeObjectURL(fileData.url);
        }
      });
    };
  }, [files]);

  const renderPreviews = () => (
    <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
      {files.map((fileData, index) => (
        <div
          key={index}
          className="aspect-w-1 aspect-h-1 group relative w-full overflow-hidden rounded border border-border pb-7"
        >
          <button
            className="absolute right-1 top-1 z-10 rounded-full bg-foreground p-1 text-background opacity-0 shadow transition-opacity duration-200 hover:shadow-dark group-hover:opacity-100"
            onClick={() => removeFile(index)}
          >
            <IconX size={16} />
          </button>
          {fileData.file && fileData.file.type.startsWith('image/') ? (
            <img
              src={fileData.url}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              src={fileData.url}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-contain"
            />
          )}
          <Row
            align="center"
            alignItems="center"
            className="absolute bottom-0 flex h-7 overflow-hidden border-t border-border bg-background p-2 text-xs"
            locked
          >
            <span className="truncate text-ellipsis whitespace-nowrap">
              {fileData.name}
            </span>
          </Row>
        </div>
      ))}
    </div>
  );

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div
        {...getRootProps()}
        className={cn(
          'relative w-full cursor-pointer rounded border-2 border-dashed border-border p-6 text-sm outline-none transition-colors',
          { 'border-danger': error },
        )}
      >
        <input {...getInputProps()} />
        <p className="text-center">
          {isDragActive ? 'Drop the images here...' : placeholder}
        </p>
      </div>
      {files.length > 0 && renderPreviews()}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
