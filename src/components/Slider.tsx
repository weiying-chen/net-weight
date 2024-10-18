import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/utils'; // Assuming you have a utility for class names
import { Col } from '@/components/Col'; // Assuming you have a Col component for layout

type SliderProps = {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
};

export const Slider: React.FC<SliderProps> = ({
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className,
  error,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);

  const getPercentage = useCallback(() => {
    return ((currentValue - min) / (max - min)) * 100;
  }, [currentValue, min, max]);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!sliderTrackRef.current) return;
      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const clientX =
        'touches' in event ? event.touches[0].clientX : event.clientX;
      const newValue = Math.min(
        Math.max(
          ((clientX - trackRect.left) / trackRect.width) * (max - min) + min,
          min,
        ),
        max,
      );
      setCurrentValue(Math.round(newValue / step) * step);
      onChange(Math.round(newValue / step) * step);
    },
    [min, max, step, onChange],
  );

  const handleStart = useCallback(() => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
  }, [handleMove]);

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div className={cn('relative w-full')}>
        <div
          ref={sliderTrackRef}
          className={cn(
            'relative h-2 rounded-full bg-subtle',
            disabled && 'pointer-events-none opacity-50',
          )}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {/* Track */}
          <div
            className="absolute h-full rounded-full bg-muted"
            style={{ width: `${getPercentage()}%` }}
          />
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full border border-border bg-background shadow',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            style={{
              left: `calc(${getPercentage()}% - 8px)`,
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          />
        </div>
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
