import { useState } from 'react';
import { Col } from '@/components/Col';
import { PseudoInput } from '@/components/PseudoInput';
import { Modal } from '@/components/Modal';
import { cn } from '@/utils';
import { IconWorldSearch } from '@tabler/icons-react';

type ModalInputProps = {
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  content: (onClose: () => void) => React.ReactNode;
};

export const ModalInput = ({
  label,
  placeholder = 'Click to open modal',
  value = '',
  error,
  disabled = false,
  content,
}: ModalInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

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
          {value || placeholder}
          <IconWorldSearch size={20} />
        </PseudoInput>
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        {content(handleClose)}
      </Modal>
    </Col>
  );
};
