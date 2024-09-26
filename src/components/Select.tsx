import { useState, useRef, useEffect } from 'react';
import { Col } from '@/components/Col';
import { cn } from '@/utils';
import { IconChevronDown } from '@tabler/icons-react';

type SelectProps = {
  label?: string;
  value: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  error?: string;
  className?: string;
  onChange: (value: string | number) => void;
};

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  placeholder,
  error,
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    value: string | number;
    label: string;
  } | null>(() => options.find((option) => option.value === value) || null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const setInitialFocusedIndex = () => {
    if (selected) {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === selected.value,
      );
      setFocusedIndex(selectedIndex !== -1 ? selectedIndex : null);
    } else {
      setFocusedIndex(null);
    }
  };

  const handleOptionClick = (
    option: { value: string | number; label: string },
    event: React.MouseEvent<HTMLLIElement>,
  ) => {
    event.stopPropagation();
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
    setFocusedIndex(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen && event.key === 'Enter') {
      setIsOpen(true);
      setInitialFocusedIndex();
      return;
    }

    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, options.length - 1),
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? options.length - 1 : Math.max(prev - 1, 0),
        );
        break;
      case 'Enter':
        if (focusedIndex !== null) {
          handleOptionClick(options[focusedIndex], event as any);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(null);
        break;
      default:
        break;
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
    event.stopPropagation();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setInitialFocusedIndex();
    }
  };

  const renderDropdown = () => (
    <ul className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded border border-border bg-white shadow">
      {options.map((option, index) => (
        <li
          key={option.value}
          className={cn('flex cursor-pointer items-center px-3 py-2 text-sm', {
            'bg-subtle': focusedIndex === index,
          })}
          onClick={(event) => handleOptionClick(option, event)}
          onMouseEnter={() => setFocusedIndex(index)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      <div
        ref={dropdownRef}
        tabIndex={0}
        className="relative w-full rounded outline-none ring-foreground ring-offset-2 focus-visible:ring-2"
        onKeyDown={handleKeyDown}
        onClick={handleDropdownToggle}
      >
        <div
          className={cn(
            'flex h-10 w-full cursor-pointer items-center justify-between rounded border border-border bg-background px-3 py-2 text-sm shadow hover:shadow-dark',
            { 'border-danger': error },
          )}
        >
          {selected ? selected.label : placeholder || 'Select an option'}
          <IconChevronDown size={20} className="ml-2" />
        </div>
        {isOpen && renderDropdown()}
      </div>
      {error && <span className="text-sm text-danger">{error}</span>}
    </Col>
  );
};
