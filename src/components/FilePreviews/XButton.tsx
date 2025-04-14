import { usePortalContainer } from '@/hooks/usePortalContainer';
import { IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export function XButton({
  index,
  onRemoveFile,
  containerRef,
  hovered,
  layout,
  imageLoaded,
}: {
  index: number;
  onRemoveFile: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  hovered: boolean;
  layout: 'grid' | 'avatar' | 'banner' | 'avatarBottom';
  imageLoaded?: boolean;
}) {
  const portalContainer = usePortalContainer();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const borderWidth = 1;
  const isRectangle =
    layout === 'grid' || layout === 'banner' || layout === 'avatarBottom';
  const offsetTop = (isRectangle ? 4 : 20) + borderWidth;
  const offsetRight = (isRectangle ? 28 : 20) + borderWidth;

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const top = rect.top + window.scrollY + offsetTop;
    const left = rect.right + window.scrollX - offsetRight;
    setCoords({ top, left });
  }, [containerRef, offsetTop, offsetRight]);

  useEffect(() => {
    updatePosition();

    const handleScrollResize = () => updatePosition();
    window.addEventListener('scroll', handleScrollResize);
    window.addEventListener('resize', handleScrollResize);

    return () => {
      window.removeEventListener('scroll', handleScrollResize);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [updatePosition]);

  useEffect(() => {
    if (imageLoaded) {
      updatePosition();
    }
  }, [imageLoaded, updatePosition]);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <div
      className="pointer-events-auto absolute z-40 transition-opacity duration-200"
      style={{
        top: coords.top,
        left: coords.left,
        opacity: hovered ? 1 : 0,
      }}
    >
      <button
        type="button"
        className="rounded-full bg-foreground p-1 text-background shadow hover:shadow-dark"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveFile(index);
        }}
      >
        <IconX size={16} />
      </button>
    </div>,
    portalContainer,
  );
}
