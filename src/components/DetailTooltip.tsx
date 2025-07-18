import { useRef, useLayoutEffect, useState } from 'react';
import { Tooltip } from '@/components/Tooltip';

type DetailTooltipProps = {
  content: React.ReactNode;
  tooltipText?: string;
  after?: React.ReactNode;
  className?: string;
};

export const DetailTooltip: React.FC<DetailTooltipProps> = ({
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
    <span ref={ref} className="block w-full truncate text-sm">
      {content}
    </span>
  );

  // make the root container flex-1 and min-w-0 so it can shrink inside a flex Row
  return (
    <div className={`min-w-0 flex-1 ${className}`}>
      {truncated ? (
        <Tooltip content={tooltipText || content} className="w-full">
          {labelSpan}
        </Tooltip>
      ) : (
        labelSpan
      )}
      {after}
    </div>
  );
};
