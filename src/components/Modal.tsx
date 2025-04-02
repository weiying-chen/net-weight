import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/utils';
import { IconX } from '@tabler/icons-react';
import { Button } from '@/components/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: 'md' | 'lg';
  locked?: boolean;
  position?: 'center' | 'top';
};

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
  locked = false,
  position = 'center',
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Delay the animation trigger slightly to allow initial render
      const timer = setTimeout(() => setIsAnimating(true), 20);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timeout = setTimeout(() => setIsMounted(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (locked) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, locked]);

  if (!isMounted) return null;

  const cnFromSize = {
    md: 'max-w-lg',
    lg: 'max-w-screen-md',
  };

  // Change vertical alignment based on the position prop.
  const containerClasses =
    position === 'top'
      ? 'fixed inset-x-0 top-0 z-[100] flex items-start justify-center'
      : 'fixed inset-0 z-[100] flex items-center justify-center';

  return (
    <div className={cn(containerClasses, className)}>
      <div
        className={cn(
          'fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200',
          isAnimating ? 'opacity-100' : 'opacity-0',
        )}
        onClick={locked ? undefined : onClose}
      />
      <div
        className={cn(
          'relative w-full transform border border-border bg-background p-6 shadow transition-all duration-200 ease-in-out md:rounded-xl',
          cnFromSize[size],
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
      >
        {!locked && (
          <Button
            variant="link"
            locked
            className="absolute right-6 top-6"
            onClick={onClose}
          >
            <IconX size={20} />
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
