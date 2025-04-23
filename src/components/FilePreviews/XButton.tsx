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
  xZIndex = 100,
}: {
  index: number;
  onRemoveFile: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  hovered: boolean;
  layout: 'grid' | 'avatar' | 'banner' | 'avatarBottom';
  imageLoaded?: boolean;
  xZIndex?: number;
}) {
  const portalContainer = usePortalContainer();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const borderWidth = 1;
  const isRectangle = layout === 'grid' || layout === 'banner';
  const offsetTop = (isRectangle ? 4 : 20) + borderWidth;
  const offsetRight = (isRectangle ? 28 : 20) + borderWidth;

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top + window.scrollY + offsetTop,
      left: rect.right + window.scrollX - offsetRight,
    });
  }, [containerRef, offsetTop, offsetRight]);

  // 1) on mount & on scroll/resize
  useEffect(() => {
    updatePosition();
    const handleSR = () => updatePosition();
    window.addEventListener('scroll', handleSR);
    window.addEventListener('resize', handleSR);
    return () => {
      window.removeEventListener('scroll', handleSR);
      window.removeEventListener('resize', handleSR);
    };
  }, [updatePosition]);

  // 2) recalc whenever the image loads
  useEffect(() => {
    if (imageLoaded) updatePosition();
  }, [imageLoaded, updatePosition]);

  // 3) **NEW** recalc on hover so the coords match the new preview dimensions
  useEffect(() => {
    if (hovered) {
      updatePosition();
    }
  }, [hovered, updatePosition]);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <div
      className="pointer-events-auto absolute transition-opacity duration-200"
      style={{
        top: coords.top,
        left: coords.left,
        opacity: hovered ? 1 : 0,
        zIndex: xZIndex,
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
