import { useState } from 'react';
import { Col } from '@/components/Col';
import { PseudoInput } from '@/components/PseudoInput';
import { Button } from '@/components/Button';
import { IconCopy } from '@tabler/icons-react';

type ClipCopyProps = {
  value: string;
  className?: string;
};

export const ClipCopy = ({ value, className }: ClipCopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Col className={className}>
      <PseudoInput tabIndex={0} className="justify-between">
        <span className="overflow-hidden text-ellipsis text-nowrap">
          {value}
        </span>
        <Button className="h-7 gap-1 px-2 py-1" onClick={handleCopy} locked>
          <IconCopy size={16} />
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </PseudoInput>
    </Col>
  );
};
