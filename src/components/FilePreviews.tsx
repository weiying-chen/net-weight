import { IconFileDescription, IconX } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';
import { cn } from '@/utils';

type FileData = {
  url: string | null;
  name: string;
  file: File | null;
};

type FilePreviewsProps = {
  files: FileData[];
  onRemoveFile?: (index: number) => void;
  multiple?: boolean; // Add multiple prop here
};

export function FilePreviews({
  files,
  onRemoveFile,
  multiple = true,
}: FilePreviewsProps) {
  const renderFilename = (file: FileData) => (
    <Row
      align="center"
      alignItems="center"
      className="absolute bottom-0 flex h-7 overflow-hidden border-t border-border bg-background p-2 text-xs"
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
        'gap-2 rounded bg-subtle p-3',
        { 'grid grid-cols-4 md:grid-cols-8': multiple },
        { 'flex w-full justify-center': !multiple },
      )}
    >
      {files.map((file, index) => (
        <div
          key={index}
          className={cn(
            'group relative overflow-hidden rounded border border-border pb-7',
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
