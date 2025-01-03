import { IconFileDescription, IconX } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FileData } from '@/components/FileUpload';

type FilePreviewsProps = {
  files: FileData[];
  onRemoveFile?: (index: number) => void;
  multiple?: boolean;
  className?: string;
};

export function FilePreviews({
  files,
  onRemoveFile,
  multiple = true,
  className,
}: FilePreviewsProps) {
  const renderFilename = (file: FileData) => (
    <Row
      align="center"
      alignItems="center"
      className="absolute bottom-0 flex h-7 overflow-hidden border-t border-border p-2 text-xs"
      locked
    >
      <span className="truncate text-ellipsis whitespace-nowrap">
        {file.name}
      </span>
    </Row>
  );

  const renderX = (index: number) => {
    if (!onRemoveFile) return null;

    return (
      <button
        type="button"
        className="absolute right-1 top-1 z-10 rounded-full bg-foreground p-1 text-background opacity-0 shadow transition-opacity duration-200 hover:shadow-dark group-hover:opacity-100"
        onClick={() => onRemoveFile(index)}
      >
        <IconX size={16} />
      </button>
    );
  };

  return (
    <div
      className={cn(
        'w-full gap-2 rounded bg-subtle p-3',
        { 'grid grid-cols-4 md:grid-cols-8': multiple },
        { 'flex justify-center': !multiple },
        className,
      )}
    >
      {files.map((file, index) => (
        <div
          key={index}
          className={cn(
            'group relative overflow-hidden rounded border border-border bg-background pb-7',
            { 'aspect-w-1 aspect-h-1 w-full': multiple },
            { 'w-auto': !multiple },
          )}
        >
          {renderX(index)}
          {file.url ? (
            <img
              src={file.url}
              alt={`Preview ${index + 1}`}
              className={cn(
                'w-full',
                { 'h-full object-contain': multiple },
                { 'max-h-24': !multiple },
              )}
            />
          ) : (
            <Col align="center" alignItems="center" className="h-full">
              <IconFileDescription size={60} stroke={1} />
            </Col>
          )}
          {renderFilename(file)}
        </div>
      ))}
    </div>
  );
}
