import React, { useState, useRef } from 'react';
import { cn } from '@/utils';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';

type SliderProps = {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
};

export const Slider: React.FC<SliderProps> = ({
  label,
  value: initialValue = 0,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  onChange,
  disabled = false,
  className,
  error,
}) => {
  const [value, setValue] = useState(initialValue);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const getPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  const getClientX = (event: MouseEvent | TouchEvent) => {
    if ('touches' in event) {
      return event.touches[0].clientX;
    }
    return event.clientX;
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!sliderTrackRef.current) return;
    const trackRect = sliderTrackRef.current.getBoundingClientRect();
    const clientX = getClientX(event);

    const newValue = Math.min(
      Math.max(
        ((clientX - trackRect.left) / trackRect.width) * (max - min) + min,
        min,
      ),
      max,
    );

    setValue(Math.round(newValue / step) * step);
    onChange(Math.round(newValue / step) * step);

    // Focus the thumb after the value is set when clicking on the track
    setTimeout(() => thumbRef.current?.focus(), 0);
  };

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    const target = event.target as HTMLElement;

    // If clicking on the track (not the thumb), move the thumb and focus it
    if (target !== thumbRef.current) {
      handleMove(event.nativeEvent as MouseEvent | TouchEvent);
    }

    // Add event listeners for drag
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  const handleEnd = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    let newValue = value;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(value - step, min);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(value + step, max);
        break;
      default:
        return;
    }

    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Col className={className}>
      <Row align="between">
        {label && <label className="text-sm font-semibold">{label}</label>}
        <span className="text-sm">
          {value}
          {unit} {/* Display the unit */}
        </span>
      </Row>
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
            ref={thumbRef}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label={label}
            className={cn(
              'absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded-full border border-border bg-background shadow outline-none ring-foreground ring-offset-2 transition-colors focus-visible:ring-2',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            style={{
              left: `calc(${getPercentage()}% - 10px)`,
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
