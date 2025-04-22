import { useState, useRef, ReactNode } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { Select, SelectProps } from '@/components/Select';
import { IconBlendMode } from '@tabler/icons-react';
import { cn } from '@/utils';

type SectionStatusProps<T extends string | number> = SelectProps<T> & {
  heading: string;
  isVisible?: boolean;
  isMixed?: boolean;
  children: ReactNode;
};

export const SectionStatus = <T extends string | number>({
  heading,
  isVisible = true,
  isMixed = false,
  children,
  className,
  ...selectProps
}: SectionStatusProps<T>) => {
  const [showMixed, setShowMixed] = useState<boolean>(isMixed);
  const realSelectRef = useRef<HTMLDivElement>(null);

  const handleTemporarySelectClick = () => {
    setShowMixed(false);

    setTimeout(() => {
      realSelectRef.current?.click();
    }, 0);
  };

  return (
    <Col
      className={cn('transition-all duration-300 ease-in-out', {
        'gap-0': !isVisible,
      })}
    >
      <Row
        alignItems="center"
        className={cn('border-b border-border pb-2', className)}
        locked
      >
        <Heading size="sm">{heading}</Heading>
        {showMixed ? (
          <div onClick={handleTemporarySelectClick}>
            <Select
              value="mixed"
              options={[
                {
                  value: 'mixed',
                  label: 'Mixed',
                  icon: <IconBlendMode size={18} />,
                },
              ]}
              isIconTrigger
              small
              disabled
              onChange={() => {}}
            />
          </div>
        ) : (
          <div ref={realSelectRef}>
            <Select {...selectProps} isIconTrigger small muted />
          </div>
        )}
      </Row>
      <Col
        className={cn('transition-all duration-300 ease-in-out', {
          'pointer-events-none max-h-0 opacity-0': !isVisible,
          'pointer-events-auto max-h-[1000px] opacity-100': isVisible,
        })}
      >
        {children}
      </Col>
    </Col>
  );
};
