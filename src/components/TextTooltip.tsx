import { useRef, useLayoutEffect, useState } from 'react';
import { Tooltip } from '@/components/Tooltip';

type TextTooltipProps = {
  content: React.ReactNode;
  tooltipText?: string;
  className?: string;
};

export const TextTooltip: React.FC<TextTooltipProps> = ({
  content,
  tooltipText,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      setTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [content]);

  const span = (
    <span ref={ref} className={`w-full truncate font-medium ${className}`}>
      {content}
    </span>
  );

  return truncated ? (
    <Tooltip
      content={tooltipText || content}
      className="flex w-full min-w-0 items-center"
    >
      {span}
    </Tooltip>
  ) : (
    span
  );
};
