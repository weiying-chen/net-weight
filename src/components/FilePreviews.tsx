import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { IconFileDescription, IconX, IconEdit } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { FileData } from '@/components/FileUpload';

type FilePreviewsProps = {
  files: FileData[];
  onRemoveFile?: (index: number) => void;
  onEditClick?: (index: number) => void;
  multiple?: boolean;
  className?: string;
};

/**
 * Create a portal <div> in document.body, remove on unmount.
 */
function usePortalContainer() {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalContainer(el);

    return () => {
      if (el.parentNode) {
        document.body.removeChild(el);
      }
    };
  }, []);

  return portalContainer;
}

/**
 * RemoveButtonPortal:
 * Places the "X" in the top-right corner of the container via portal,
 * so it won't be clipped by overflow hidden or border radius.
 * We recalc on scroll/resize so it follows the container.
 */
function RemoveButtonPortal({
  index,
  onRemoveFile,
  containerRef,
  hovered,
  multiple,
}: {
  index: number;
  onRemoveFile: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  hovered: boolean;
  multiple: boolean;
}) {
  const portalContainer = usePortalContainer();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Tweak these values until it looks perfect for both shapes
  const borderWidth = 1;
  const offsetTop = (multiple ? 4 : 20) + borderWidth;
  const offsetRight = (multiple ? 28 : 20) + borderWidth;

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const top = rect.top + window.scrollY + offsetTop;
    const left = rect.right + window.scrollX - offsetRight;
    setCoords({ top, left });
  }, [containerRef, offsetTop, offsetRight]);

  useEffect(() => {
    updatePosition();
    function handleScrollResize() {
      updatePosition();
    }
    window.addEventListener('scroll', handleScrollResize);
    window.addEventListener('resize', handleScrollResize);
    return () => {
      window.removeEventListener('scroll', handleScrollResize);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [updatePosition]);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <div
      className="absolute z-10 transition-opacity duration-200"
      style={{
        top: coords.top,
        left: coords.left,
        opacity: hovered ? 1 : 0, // fade in/out on hover
      }}
    >
      <button
        type="button"
        className="rounded-full bg-foreground p-1 text-background shadow hover:shadow-dark"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering edit on container
          onRemoveFile(index);
        }}
      >
        <IconX size={16} />
      </button>
    </div>,
    portalContainer,
  );
}

type FilePreviewItemProps = {
  file: FileData;
  index: number;
  onRemoveFile?: (index: number) => void;
  onEditClick?: (index: number) => void;
  multiple: boolean;
};

function FilePreviewItem({
  file,
  index,
  onRemoveFile,
  onEditClick,
  multiple,
}: FilePreviewItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Render the overlay with edit icon only if onEditClick is provided.
  const renderOverlay = () =>
    onEditClick ? (
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <IconEdit size={40} className="text-background" />
      </div>
    ) : null;

  const renderFilename = (file: FileData) =>
    multiple ? (
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
          'aspect-w-1 aspect-h-1 w-full rounded-md pb-7': multiple,
          'flex h-32 w-32 items-center justify-center rounded-full': !multiple,
        },
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (onEditClick) onEditClick(index);
      }}
    >
      {onRemoveFile && (
        <RemoveButtonPortal
          index={index}
          onRemoveFile={onRemoveFile}
          containerRef={containerRef}
          hovered={hovered}
          multiple={multiple}
        />
      )}

      {renderOverlay()}

      {file.url ? (
        multiple ? (
          <div className="relative box-border h-full w-full p-1">
            <img
              src={file.url}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <img
            src={file.url}
            alt={`Preview ${index + 1}`}
            className="h-full w-full object-cover"
          />
        )
      ) : (
        <Col
          align="center"
          alignItems="center"
          className={cn('h-full w-full', {
            'rounded-md': multiple,
            'rounded-full': !multiple,
          })}
        >
          <IconFileDescription size={60} stroke={1} />
        </Col>
      )}

      {multiple && renderFilename(file)}
    </div>
  );
}

export function FilePreviews({
  files,
  onRemoveFile,
  onEditClick,
  multiple = true,
  className,
}: FilePreviewsProps) {
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
        <FilePreviewItem
          key={index}
          file={file}
          index={index}
          onRemoveFile={onRemoveFile}
          onEditClick={onEditClick}
          multiple={multiple}
        />
      ))}
    </div>
  );
}
