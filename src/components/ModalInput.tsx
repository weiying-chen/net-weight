import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Col } from '@/components/Col';
import { PseudoInput } from '@/components/PseudoInput';
import { cn } from '@/utils';
import { IconWorldSearch } from '@tabler/icons-react';
import { Modal } from '@/components/Modal';

type ModalInputProps = {
  label?: React.ReactNode;
  placeholder?: string;
  value?: string | null;
  error?: string;
  disabled?: boolean;
  content: (onClose: () => void) => React.ReactNode;
  /** Optional display-only transformation */
  formatValue?: (value: any) => string;
};

export const ModalInput = ({
  label,
  placeholder = 'Click to open modal',
  value = '',
  error,
  disabled = false,
  content,
  formatValue,
}: ModalInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Freeze body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const rawValue =
    typeof formatValue === 'function' ? formatValue(value) : value;
  const displayValue = rawValue ?? '';

  // Decide where to portal (fallback to document.body)
  const portalTarget = document.getElementById('modal-root') || document.body;

  return (
    <Col>
      {label && <label className="text-sm font-semibold">{label}</label>}

      <div
        className="relative w-full"
        onClick={() => !disabled && setIsOpen(true)}
      >
        <PseudoInput
          tabIndex={0}
          error={error}
          disabled={disabled}
          className={cn('cursor-pointer justify-between shadow', {
            'hover:shadow-dark': !disabled,
          })}
        >
          {displayValue || placeholder}
          <IconWorldSearch size={20} />
        </PseudoInput>
      </div>
      {/* error && <span className="text-sm text-danger">{error}</span> */}

      {/*
        Wrap the <Modal> in createPortal so it still mounts under #modal-root,
        while letting Modal handle its own show/hide animation.
      */}
      {isOpen &&
        createPortal(
          <Modal isOpen={isOpen} onClose={handleClose}>
            {content(handleClose)}
          </Modal>,
          portalTarget,
        )}
    </Col>
  );
};
