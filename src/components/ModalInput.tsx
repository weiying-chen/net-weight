import { useState } from 'react';
import { Col } from '@/components/Col';
import { PseudoInput } from '@/components/PseudoInput';
import { Modal } from '@/components/Modal';

type ModalInputProps = {
  label?: React.ReactNode;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  modalContent: React.ReactNode;
};

export const ModalInput = ({
  label,
  placeholder = 'Click to open modal',
  error,
  disabled = false,
  modalContent,
}: ModalInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Col>
      {label && <label className="text-sm font-semibold">{label}</label>}

      <div
        className="relative w-full"
        onClick={() => !disabled && setIsOpen(true)}
        tabIndex={0}
      >
        <PseudoInput
          tabIndex={0}
          error={error}
          disabled={disabled}
          className="cursor-pointer"
        >
          <div>{placeholder}</div>
        </PseudoInput>
      </div>

      {error && <span className="text-sm text-danger">{error}</span>}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        {modalContent}
      </Modal>
    </Col>
  );
};
