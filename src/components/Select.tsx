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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Function to set the initial focused index based on the selected option
  const setInitialFocusedIndex = () => {
    const selectedIndex = selected
      ? options.findIndex((opt) => opt.value === selected.value)
      : 0;
    setFocusedIndex(selectedIndex !== -1 ? selectedIndex : 0);
  };

  const handleOptionClick = (
    option: { value: string | number; label: string },
    event: React.MouseEvent<HTMLLIElement>,
  ) => {
    event.stopPropagation(); // Stop event from bubbling to avoid re-toggling dropdown
    setSelected(option);
    onChange(option.value);
    setIsOpen(false); // Close dropdown on option click
    setFocusedIndex(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isOpen) {
      if (event.key === 'ArrowDown') {
        setFocusedIndex((prevIndex) =>
          prevIndex === null ? 0 : Math.min(prevIndex + 1, options.length - 1),
        );
      } else if (event.key === 'ArrowUp') {
        setFocusedIndex((prevIndex) =>
          prevIndex === null ? options.length - 1 : Math.max(prevIndex - 1, 0),
        );
      } else if (event.key === 'Enter' && focusedIndex !== null) {
        handleOptionClick(options[focusedIndex], event as any); // Pass event to handleOptionClick
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        setFocusedIndex(null);
      }
    } else if (event.key === 'Enter') {
      // Open the dropdown and set the initial focused index
      setIsOpen(true);
      setInitialFocusedIndex();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent click inside from toggling dropdown incorrectly
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setInitialFocusedIndex(); // Set the initial focused index when opening the dropdown
    }
  };

  const renderDropdown = () => (
    <ul className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded border border-border bg-white shadow">
      {options.map((option, index) => (
        <li
          key={option.value}
          className={cn(
            'flex cursor-pointer items-center px-4 py-2 hover:bg-secondary',
            {
              'bg-secondary': focusedIndex === index,
            },
          )}
          onClick={(event) => handleOptionClick(option, event)}
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
      <div
        ref={dropdownRef}
        className="relative w-full rounded outline-none ring-foreground ring-offset-2 focus-visible:ring-2"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleDropdownToggle}
      >
        <div
          className={cn(
            'w-full cursor-pointer rounded border border-border bg-background px-3 py-2',
            { 'border-danger': error },
            className,
          )}
        >
          {selected ? selected.label : placeholder || 'Select an option'}
        </div>
        {isOpen && renderDropdown()}
      </div>
      {error && <span className="mt-1 text-sm text-danger">{error}</span>}
    </Col>
  );
};
