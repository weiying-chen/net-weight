import { useRef, useState, useEffect, useMemo } from 'react';
import {
  IconFileDescription,
  IconEdit,
  IconFileOff,
} from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FileData } from '@/components/FileUpload';
import { getFileUrl } from '@/helpers';
import { XButton } from '@/components/FilePreviews/XButton';

export type FilePreviewsProps = {
  files: FileData[];
  onRemoveFile?: (index: number) => void;
  onEditClick?: (index: number) => void;
  layout?: 'grid' | 'avatar' | 'banner' | 'avatarBottom';
  className?: string;
  noFileText?: string;
  previewClassName?: string;
  xZIndex?: number;
};

type FilePreviewItemProps = {
  file: FileData;
  index: number;
  onRemoveFile?: (index: number) => void;
  onEditClick?: (index: number) => void;
  layout: 'grid' | 'avatar' | 'banner' | 'avatarBottom';
  xZIndex?: number;
};

function FilePreviewItem({
  file,
  index,
  onRemoveFile,
  onEditClick,
  layout,
  xZIndex,
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
          'aspect-w-1 aspect-h-1 w-full rounded-md pb-7': layout === 'grid',
          'flex h-32 w-32 items-center justify-center rounded-full':
            layout === 'avatar' || layout === 'avatarBottom',
          'w-full': layout === 'banner',
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
          xZIndex={xZIndex}
        />
      )}

      {renderOverlay()}

      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`Preview ${index + 1}`}
          className={cn(
            {
              'rounded-full': layout === 'avatar' || layout === 'avatarBottom',
              'rounded-md': layout === 'grid',
            },
            {
              'h-full w-full object-contain':
                layout === 'grid' || layout === 'banner',
              'h-32 w-32': layout === 'avatar' || layout === 'avatarBottom',
            },
            'object-cover',
          )}
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <Col
          align="center"
          alignItems="center"
          className={cn('text-center', {
            'h-full w-full rounded-md':
              layout === 'grid' || layout === 'banner',
            'h-32 w-32 rounded-full':
              layout === 'avatar' || layout === 'avatarBottom',
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
  noFileText,
  previewClassName,
  xZIndex = 100,
}: FilePreviewsProps) {
  if (files.length === 0 && noFileText) {
    return (
      <Row
        align="center"
        alignItems="center"
        className={cn('rounded bg-subtle p-3', className, previewClassName)}
      >
        <Col align="center" alignItems="center">
          <IconFileOff size={40} stroke={1} className="text-muted" />
          <p className="text-sm text-muted">{noFileText}</p>
        </Col>
      </Row>
    );
  }

  return (
    <div
      className={cn(
        'w-full gap-2 rounded bg-subtle p-3',
        {
          'grid grid-cols-4 md:grid-cols-8': layout === 'grid',
          'flex items-center justify-center': [
            'avatar',
            'banner',
            'avatarBottom',
          ].includes(layout),
        },
        className,
        previewClassName,
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
          xZIndex={xZIndex}
        />
      ))}
    </div>
  );
}
