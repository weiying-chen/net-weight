import { useState, ReactNode, useRef, useEffect } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/utils';

export type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export const Accordion = ({ title, children, className }: AccordionProps) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [open]);

  return (
    <Col className={cn('w-full', className)}>
      <Row
        className="cursor-pointer items-center justify-between border-b border-border py-2"
        onClick={() => setOpen(!open)}
      >
        <Heading size="sm">{title}</Heading>
        <IconChevronDown
          size={20}
          className={cn(
            'transition-transform duration-300',
            open ? 'rotate-180' : 'rotate-0',
          )}
        />
      </Row>
      <div
        ref={contentRef}
        className="w-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: height }}
      >
        {children}
      </div>
    </Col>
  );
};
