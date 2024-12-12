import { Col } from '@/components/Col';
import { HeadingToggle } from '@/components/HeadingToggle';
import { cn } from '@/utils';

type SectionToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
  heading: string;
  children: React.ReactNode;
};

export const SectionToggle = ({
  isVisible,
  onToggle,
  heading,
  children,
}: SectionToggleProps) => {
  return (
    <Col
      className={cn(
        {
          'gap-0': !isVisible,
        },
        'transition-all duration-300 ease-in-out',
      )}
    >
      <HeadingToggle text={heading} checked={isVisible} onChange={onToggle} />
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
