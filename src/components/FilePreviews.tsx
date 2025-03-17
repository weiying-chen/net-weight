import { IconFileDescription, IconX, IconEdit } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FileData } from '@/components/FileUpload';

type FilePreviewsProps = {
  files: FileData[];
  onRemoveFile?: (index: number) => void;
  onClickEdit?: (index: number) => void;
  multiple?: boolean;
  className?: string;
};

export function FilePreviews({
  files,
  onRemoveFile,
  onClickEdit,
  multiple = true,
  className,
}: FilePreviewsProps) {
  // Render the file name overlay.
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
  // Render both edit and remove buttons inside a Row container.
  const renderActions = (index: number) => (
    <Row
      align="end"
      className="absolute right-1 top-1 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      {/* Edit button */}
      {onClickEdit && (
        <button
          type="button"
          className="rounded-full bg-foreground p-1 text-background shadow hover:shadow-dark"
          onClick={() => onClickEdit(index)}
        >
          <IconEdit size={16} />
        </button>
      )}
      {/* Remove file button */}
      {onRemoveFile && (
        <button
          type="button"
          className="rounded-full bg-foreground p-1 text-background shadow hover:shadow-dark"
          onClick={() => onRemoveFile(index)}
        >
          <IconX size={16} />
        </button>
      )}
    </Row>
  );

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
          {renderActions(index)}
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
