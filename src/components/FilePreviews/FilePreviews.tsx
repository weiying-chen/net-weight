import { useRef, useState, useEffect, useMemo } from 'react';
import { IconFileDescription, IconEdit } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FileData } from '@/components/FileUpload';
import { getFileUrl } from '@/helpers';
import { XButton } from '@/components/FilePreviews/XButton';

type FilePreviewsProps = {
  files: FileData[];
  onRemoveFile?: (index: number) => void;
  onEditClick?: (index: number) => void;
  layout?: 'grid' | 'avatar' | 'banner';
  className?: string;
};

type FilePreviewItemProps = {
  file: FileData;
  index: number;
  onRemoveFile?: (index: number) => void;
  onEditClick?: (index: number) => void;
  layout: 'grid' | 'avatar' | 'banner';
};

function FilePreviewItem({
  file,
  index,
  onRemoveFile,
  onEditClick,
  layout,
}: FilePreviewItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const previewUrl = useMemo(() => getFileUrl(file), [file]);

  useEffect(() => {
    if (file instanceof File && previewUrl) {
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  }, [file, previewUrl]);

  const renderOverlay = () =>
    onEditClick ? (
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <IconEdit size={40} className="text-background" />
      </div>
    ) : null;

  // Show filename only in grid mode.
  const renderFilename = (file: FileData) =>
    layout === 'grid' ? (
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
    ) : null;

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative overflow-hidden border border-border bg-background',
        onEditClick && 'cursor-pointer',
        {
          // Grid mode: same as before.
          'aspect-w-1 aspect-h-1 w-full rounded-md pb-7': layout === 'grid',
          // Avatar mode: same as before.
          'flex h-32 w-32 items-center justify-center rounded-full':
            layout === 'avatar',
          // Banner mode: full width, rounded, with no fixed aspect ratio.
          'w-full rounded-md': layout === 'banner',
        },
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (onEditClick) onEditClick(index);
      }}
    >
      {onRemoveFile && (
        <XButton
          index={index}
          onRemoveFile={onRemoveFile}
          containerRef={containerRef}
          hovered={hovered}
          layout={layout}
          imageLoaded={imageLoaded}
        />
      )}

      {renderOverlay()}

      {previewUrl ? (
        layout === 'grid' || layout === 'banner' ? (
          <div className="relative box-border h-full w-full p-1">
            <img
              src={previewUrl}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-contain"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        ) : (
          <img
            src={previewUrl}
            alt={`Preview ${index + 1}`}
            className="h-full w-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        )
      ) : (
        <Col
          align="center"
          alignItems="center"
          className={cn('h-full w-full', {
            'rounded-md': layout === 'grid' || layout === 'banner',
            'rounded-full': layout === 'avatar',
          })}
        >
          <IconFileDescription size={60} stroke={1} />
        </Col>
      )}

      {renderFilename(file)}
    </div>
  );
}

export function FilePreviews({
  files,
  onRemoveFile,
  onEditClick,
  layout = 'grid',
  className,
}: FilePreviewsProps) {
  return (
    <div
      className={cn(
        'w-full gap-2 rounded bg-subtle p-3',
        {
          // Grid: same as before.
          'grid grid-cols-4 md:grid-cols-8': layout === 'grid',
          // Avatar and Banner: use flex to center the image.
          'flex justify-center': layout === 'avatar' || layout === 'banner',
        },
        className,
      )}
    >
      {files.map((file, index) => (
        <FilePreviewItem
          key={index}
          file={file}
          index={index}
          onRemoveFile={onRemoveFile}
          onEditClick={onEditClick}
          layout={layout}
        />
      ))}
    </div>
  );
}
