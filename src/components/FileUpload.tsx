import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type FileUploadProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (files: File[]) => void;
};

export function FileUpload({
  label,
  placeholder = 'Drag & drop or click to upload images',
  error,
  className,
  onChange,
}: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    onChange(acceptedFiles);

    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
    },
  });

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const renderPreviews = () => (
    <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="aspect-w-1 aspect-h-1 relative w-full overflow-hidden rounded border border-border"
        >
          <img
            src={preview}
            alt={`Preview ${index + 1}`}
            className="h-full w-full object-contain p-2"
          />
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
          { 'bg-subtle': isDragActive, 'border-danger': error },
        )}
      >
        <input {...getInputProps()} />
        <p className="text-center">
          {isDragActive ? 'Drop the images here...' : placeholder}
        </p>
      </div>
      {renderPreviews()}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
}
