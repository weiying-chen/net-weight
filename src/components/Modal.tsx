import { ReactNode } from 'react';
import { cn } from '@/utils';
import { IconX } from '@tabler/icons-react';
import { Button } from '@/components/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

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
          'max-w-screen-3xl relative z-10 border border-border bg-white p-6 shadow md:rounded-xl',
        )}
      >
        <Button isLink className="absolute right-6 top-6" onClick={onClose}>
          <IconX size={20} />
        </Button>
        {children}
      </div>
    </div>
  );
}
