import { useRef, useLayoutEffect, useState } from 'react';
import { Tooltip } from '@/components/Tooltip';

type TextTooltipProps = {
  content: React.ReactNode;
  tooltipText?: string;
  after?: React.ReactNode;
  className?: string;
};

export const TextTooltip: React.FC<TextTooltipProps> = ({
  content,
  tooltipText,
  className = '',
  after = null,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      setTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [content]);

  const labelSpan = (
    <span
      ref={ref}
      className={`truncate text-sm font-medium ${className} min-w-0`}
    >
      {content}
    </span>
  );

  return (
    <span className="inline-flex min-w-0 items-center gap-0.5">
      {truncated ? (
        <Tooltip
          content={tooltipText || content}
          className="flex w-full min-w-0 items-center"
        >
          {labelSpan}
        </Tooltip>
      ) : (
        labelSpan
      )}
      {after}
    </span>
  );
};
