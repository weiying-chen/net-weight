import { ReactNode } from 'react';
import { cn } from '@/utils';

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
          'relative z-10 rounded-xl border border-border bg-white p-6 shadow',
        )}
      >
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
