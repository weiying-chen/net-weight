import React, { useState, useRef, useEffect } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconCheck } from '@tabler/icons-react';

type SelectProps = {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string;
  onChange: (value: string | number) => void;
  className?: string;
  placeholder?: string;
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  className,
  error,
  placeholder,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    value: string | number;
    label: string;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOptionClick = (option: {
    value: string | number;
    label: string;
  }) => {
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render function for dropdown
  const renderDropdown = () => (
    <ul className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded border border-border bg-white shadow">
      {options.map((option) => (
        <li
          key={option.value}
          className="flex cursor-pointer items-center px-4 py-2 hover:bg-secondary"
          onClick={() => handleOptionClick(option)}
        >
          <span className="mr-2 flex w-4 items-center justify-center">
            {selected?.value === option.value && (
              <IconCheck className="text-primary" size={16} />
            )}
          </span>
          {option.label}
        </li>
      ))}
    </ul>
  );

  return (
    <Col>
      <label className="text-sm font-semibold">{label}</label>
      <div ref={dropdownRef} className="relative w-full">
        <div
          className={cn(
            'w-full cursor-pointer rounded border border-border bg-background px-3 py-2 outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
            { 'border-danger': error },
            className,
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selected ? selected.label : placeholder || 'Select an option'}
        </div>
        {isOpen && renderDropdown()}
      </div>
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </Col>
  );
};
