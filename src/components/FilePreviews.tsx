import { IconFileDescription, IconX } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';

type FileData = {
  url: string | null;
  name: string;
  file: File | null;
};

type FilePreviewsProps = {
  files: FileData[];
  removeFile?: (index: number) => void;
};

export function FilePreviews({ files, removeFile }: FilePreviewsProps) {
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
    if (!removeFile) return null;

    return (
      <button
        className="absolute right-1 top-1 z-10 rounded-full bg-foreground p-1 text-background opacity-0 shadow transition-opacity duration-200 hover:shadow-dark group-hover:opacity-100"
        onClick={() => removeFile(index)}
      >
        <IconX size={16} />
      </button>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
      {files.map((file, index) => (
        <div
          key={index}
          className="aspect-w-1 aspect-h-1 group relative w-full overflow-hidden rounded border border-border pb-7"
        >
          {renderX(index)}
          {file.url ? (
            <img
              src={file.url}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-contain"
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
