import { ReactNode } from 'react';
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
  if (!isOpen) return null;

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
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full border border-border bg-background p-6 shadow md:rounded-xl',
          cnFromSize[size],
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
