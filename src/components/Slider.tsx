import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';

type ButtonLabels = {
  left: React.ReactNode;
  right: React.ReactNode;
};

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
  buttonLabels?: ButtonLabels;
};

export const Slider: React.FC<SliderProps> = ({
  label,
  value: baseValue = 0,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
  className,
  error,
  buttonLabels,
}) => {
  // Helper function to clamp a value
  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  // Round based on step (<1: two decimals, else integer)
  const roundValue = (val: number) =>
    step < 1 ? parseFloat(val.toFixed(2)) : Math.round(val);

  const [value, setValue] = useState<number>(
    roundValue(clamp(baseValue, min, max)),
  );
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setValue(roundValue(clamp(baseValue, min, max)));
  }, [baseValue, min, max]);

  // Always use clamped value for calculations.
  const clampedValue = clamp(value, min, max);

  // Calculates the percentage of the track to fill.
  const getPercentage = () => ((clampedValue - min) / (max - min)) * 100;

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
    // Calculate raw value based on pointer position.
    const rawValue =
      ((clientX - trackRect.left) / trackRect.width) * (max - min) + min;
    const newValue = roundValue(clamp(rawValue, min, max));
    setValue(newValue);
    onChange(newValue);
    setTimeout(() => thumbRef.current?.focus(), 0);
  };

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target !== thumbRef.current) {
      handleMove(event.nativeEvent as MouseEvent | TouchEvent);
    }
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
    let newValue = clampedValue;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = clamp(clampedValue - step, min, max);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = clamp(clampedValue + step, min, max);
        break;
      default:
        return;
    }
    newValue = roundValue(newValue);
    setValue(newValue);
    onChange(newValue);
  };

  // Handlers for the button clicks
  const decreaseValue = () => {
    const newValue = roundValue(clamp(clampedValue - step, min, max));
    setValue(newValue);
    onChange(newValue);
  };

  const increaseValue = () => {
    const newValue = roundValue(clamp(clampedValue + step, min, max));
    setValue(newValue);
    onChange(newValue);
  };

  // Render the slider track element
  const sliderElement = (
    <div className="relative w-full">
      <div
        ref={sliderTrackRef}
        className={cn(
          'relative h-2 rounded-full bg-subtle',
          disabled && 'pointer-events-none opacity-50',
        )}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div
          className="absolute h-full rounded-full bg-muted"
          style={{ width: `${getPercentage()}%` }}
        />
        <div
          ref={thumbRef}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          aria-label={label}
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded-full border border-border bg-background shadow outline-none ring-foreground ring-offset-2 ring-offset-background transition-colors focus-visible:ring-2',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          style={{ left: `calc(${getPercentage()}% - 10px)` }}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );

  return (
    <Col className={className}>
      <Row align="between">
        {label && <label className="text-sm font-semibold">{label}</label>}
        <span className="text-sm">
          {step < 1 ? clampedValue.toFixed(2) : clampedValue} {unit}
        </span>
      </Row>
      {buttonLabels ? (
        <Row alignItems="center">
          <Button
            variant="link"
            circular
            onClick={decreaseValue}
            disabled={disabled || clampedValue === min}
          >
            {buttonLabels.left}
          </Button>
          {sliderElement}
          <Button
            variant="link"
            circular
            onClick={increaseValue}
            disabled={disabled || clampedValue === max}
          >
            {buttonLabels.right}
          </Button>
        </Row>
      ) : (
        sliderElement
      )}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};

export default Slider;
