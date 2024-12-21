import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Select, SelectProps } from '@/components/Select';
import { Heading } from '@/components/Heading';
import { cn } from '@/utils';
import { useState, useRef } from 'react';
import { IconBlendMode } from '@tabler/icons-react';

type SectionSelectProps<T extends string | number> = SelectProps<T> & {
  isVisible: boolean;
  heading: string;
  isMixed?: boolean; // Indicates whether the component starts in a "mixed" state
  children: React.ReactNode;
};

export const SectionSelect = <T extends string | number>({
  isVisible,
  heading,
  isMixed = false,
  children,
  className,
  ...selectProps
}: SectionSelectProps<T>) => {
  const [showMixed, setShowMixed] = useState<boolean>(isMixed);
  const realSelectRef = useRef<HTMLDivElement>(null); // Reference for the real select

  const handleTemporarySelectClick = () => {
    setShowMixed(false); // Switch to the real Select
    // Programmatically open the real select dropdown
    setTimeout(() => {
      realSelectRef.current?.click();
    }, 0); // Slight delay to ensure state updates
  };

  return (
    <Col
      className={cn(
        {
          'gap-0': !isVisible,
        },
        'transition-all duration-300 ease-in-out',
      )}
    >
      <Row
        alignItems="center"
        className={`border-b border-border pb-2 ${className}`}
        locked
      >
        <Heading size="sm">{heading}</Heading>
        {showMixed ? (
          // Temporary Select to show "Mixed" option
          <div onClick={handleTemporarySelectClick}>
            <Select
              value="mixed"
              options={[
                {
                  value: 'mixed',
                  label: 'Mixed',
                  icon: <IconBlendMode size={18} />,
                },
              ]} // Temporary "Mixed" option
              isIconTrigger
              small
              disabled // Disable the dropdown
              onChange={() => {}} // No-op function
            />
          </div>
        ) : (
          // Real Select
          <div ref={realSelectRef}>
            <Select {...selectProps} isIconTrigger small />
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
