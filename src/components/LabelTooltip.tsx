import { useRef, useLayoutEffect, useState } from 'react';
import { Tooltip } from '@/components/Tooltip';

type Props = {
  text: string;
  className?: string;
};

export const LabelTooltip: React.FC<Props> = ({ text, className = '' }) => {
  const ref = useRef<HTMLLabelElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      setTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [text]);

  const label = (
    <label
      ref={ref}
      className={`w-full truncate text-sm font-semibold ${className}`}
    >
      {text}
    </label>
  );

  return truncated ? (
    <Tooltip content={text} className="flex w-full min-w-0 items-center">
      {label}
    </Tooltip>
  ) : (
    label
  );
};
