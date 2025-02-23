import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Col } from '@/components/Col';
import { PseudoInput } from '@/components/PseudoInput';

type ColorPickerProps = {
  label?: string;
  error?: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
};

export const ColorPicker = ({
  label,
  error,
  value,
  onChange,
  disabled,
}: ColorPickerProps) => {
  const [color, setColor] = useState(value);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const togglePicker = () => {
    if (!disabled) {
      setIsPickerOpen((prev) => !prev);
    }
  };

  const updateColor = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsPickerOpen(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);

    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      updateColor(newColor);
    }
  };

  useEffect(() => {
    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerOpen]);

  useEffect(() => {
    setColor(value);
  }, [value]);

  return (
    <Col className="relative" ref={pickerRef}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <PseudoInput tabIndex={0} error={error} disabled={disabled}>
        <div
          className="h-6 w-6 flex-shrink-0 cursor-pointer rounded border border-border"
          style={{ backgroundColor: color }}
          onClick={togglePicker}
        />
        <input
          type="text"
          value={color}
          onChange={handleInputChange}
          className="w-full bg-background text-sm outline-none"
          maxLength={7}
        />
      </PseudoInput>
      {isPickerOpen && (
        <div className="absolute top-16 z-10 rounded border border-border bg-white p-2 shadow">
          <HexColorPicker color={color} onChange={updateColor} />
        </div>
      )}
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
