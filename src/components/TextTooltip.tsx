import React, { useRef, useLayoutEffect, useState } from 'react';
import { Tooltip } from '@/components/Tooltip';
import { Row } from '@/components/Row';

/**
 * Props for TextTooltip:
 * - content: the visible text or node to display
 * - tooltipText: optional override for tooltip content
 * - after: optional node to render after the label
 * - className: additional classes for the visible label
 */
type TextTooltipProps = {
  content: React.ReactNode;
  tooltipText?: React.ReactNode;
  after?: React.ReactNode;
  className?: string;
};

/**
 * TextTooltip shows a hover tooltip when its content is truncated
 * by its container width (e.g. in a flex layout).
 */
export const TextTooltip: React.FC<TextTooltipProps> = ({
  content,
  tooltipText,
  className = '',
  after = null,
}) => {
  // ref for the hidden measurement clone, always in the flex flow
  const measureRef = useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    // check if content overflows
    const checkOverflow = () => {
      setTruncated(el.scrollWidth > el.clientWidth);
    };

    // initial check
    checkOverflow();

    // observe size changes via ResizeObserver
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    // cleanup
    return () => observer.disconnect();
  }, [content]);

  // the actual visible label
  const label = (
    <div
      className={`min-w-0 truncate text-sm font-semibold ${className}`}
      aria-hidden={truncated ? undefined : true}
    >
      {content}
    </div>
  );

  return (
    <Row className="relative" alignItems="center" locked>
      {/* hidden clone for measurement */}
      <div
        ref={measureRef}
        className="pointer-events-none absolute inset-0 whitespace-nowrap text-sm font-semibold opacity-0"
        aria-hidden
      >
        {content}
      </div>

      {/* render with or without tooltip */}
      {truncated ? (
        <Tooltip
          content={tooltipText ?? content}
          className="min-w-0 items-center"
        >
          {label}
        </Tooltip>
      ) : (
        label
      )}

      {/* optional after-node */}
      {after}
    </Row>
  );
};
