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
};

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false); // Ensures the modal stays in the DOM during animation
  const [isAnimating, setIsAnimating] = useState(false); // Tracks if animation is in progress

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true); // Add modal to the DOM
      requestAnimationFrame(() => setIsAnimating(true)); // Trigger animation
    } else {
      setIsAnimating(false); // Start exit animation
      const timeout = setTimeout(() => setIsMounted(false), 200); // Match the animation duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  const cnFromSize = {
    md: 'max-w-lg',
    lg: 'max-w-screen-md',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className,
      )}
    >
      <div
        className={cn(
          'fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200',
          isAnimating ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full transform border border-border bg-background p-6 shadow transition-all duration-200 ease-in-out md:rounded-xl',
          cnFromSize[size],
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
      >
        <Button
          variant="link"
          className="absolute right-6 top-6"
          onClick={onClose}
        >
          <IconX size={20} />
        </Button>
        {children}
      </div>
    </div>
  );
}
