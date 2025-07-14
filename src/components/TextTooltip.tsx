import { useRef, useLayoutEffect, useState } from 'react';
import { Tooltip } from '@/components/Tooltip';

type TextTooltipProps = {
  text: string;
  className?: string;
};

export const TextTooltip: React.FC<TextTooltipProps> = ({
  text,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      setTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [text]);

  const content = (
    <span ref={ref} className={`w-full truncate font-medium ${className}`}>
      {text}
    </span>
  );

  return truncated ? (
    <Tooltip content={text} className="flex w-full min-w-0 items-center">
      {content}
    </Tooltip>
  ) : (
    content
  );
};
