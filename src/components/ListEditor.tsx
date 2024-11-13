import { useState, useEffect } from 'react';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { cn } from '@/utils';

type ListEditorProps = {
  items: string[];
  activeItems?: string[]; // Optional
  className?: string;
  onChange: (initialItems: string[]) => void;
};

export function ListEditor({
  items,
  activeItems: initialItems = [], // Default to an empty array if not provided
  className,
  onChange,
}: ListEditorProps) {
  // Initialize activeItems correctly
  const [activeItems, setActiveItems] = useState<string[]>(() => {
    return initialItems && initialItems.length > 0 ? initialItems : items;
  });

  const [inactiveItems, setInactiveItems] = useState<string[]>(
    items.filter((item) => !activeItems.includes(item)),
  );

  const [pickedInactiveItems, setPickedInactiveItems] = useState<string[]>([]);
  const [pickedActiveItems, setPickedActiveItems] = useState<string[]>([]);

  // Update inactive items when activeItems or items change
  useEffect(() => {
    setInactiveItems(items.filter((item) => !activeItems.includes(item)));
  }, [activeItems, items]);

  // Optional: Update activeItems if initialItems prop changes
  useEffect(() => {
    setActiveItems((prevActiveItems) => {
      if (
        initialItems &&
        initialItems.length > 0 &&
        initialItems !== prevActiveItems
      ) {
        return initialItems;
      }
      return prevActiveItems;
    });
  }, [initialItems]);

  const updateActiveItems = (newActiveItems: string[]) => {
    setActiveItems(newActiveItems);
    onChange(newActiveItems);
  };

  const handleAddItems = () => {
    const newActiveItems = [...activeItems, ...pickedInactiveItems];
    updateActiveItems(newActiveItems);
    setPickedInactiveItems([]);
  };

  const handleRemoveItems = () => {
    const newActiveItems = activeItems.filter(
      (item) => !pickedActiveItems.includes(item),
    );
    updateActiveItems(newActiveItems);
    setPickedActiveItems([]);
  };

  const handleMoveUp = () => {
    const newActiveItems = [...activeItems];
    const sortedPickedItems = [...pickedActiveItems].sort(
      (a, b) => newActiveItems.indexOf(a) - newActiveItems.indexOf(b),
    );

    sortedPickedItems.forEach((pickedItem) => {
      const index = newActiveItems.indexOf(pickedItem);
      if (index > 0) {
        [newActiveItems[index - 1], newActiveItems[index]] = [
          newActiveItems[index],
          newActiveItems[index - 1],
        ];
      }
    });
    updateActiveItems(newActiveItems);
  };

  const handleMoveDown = () => {
    const newActiveItems = [...activeItems];
    const sortedPickedItems = [...pickedActiveItems].sort(
      (a, b) => newActiveItems.indexOf(b) - newActiveItems.indexOf(a),
    );

    sortedPickedItems.forEach((pickedItem) => {
      const index = newActiveItems.indexOf(pickedItem);
      if (index < newActiveItems.length - 1) {
        [newActiveItems[index + 1], newActiveItems[index]] = [
          newActiveItems[index],
          newActiveItems[index + 1],
        ];
      }
    });
    updateActiveItems(newActiveItems);
  };

  const handleAllItemClick = (item: string) => {
    setPickedInactiveItems((prev) =>
      prev.includes(item)
        ? prev.filter((item) => item !== item)
        : [...prev, item],
    );
  };

  const handlePickedItemClick = (item: string) => {
    setPickedActiveItems((prev) =>
      prev.includes(item)
        ? prev.filter((item) => item !== item)
        : [...prev, item],
    );
  };

  const renderList = (
    items: string[],
    pickedItems: string[],
    onItemClick: (item: string) => void,
  ) => (
    <ul className="h-40 w-full overflow-y-auto rounded border border-border p-2 text-sm">
      {items.map((item) => (
        <li
          key={item}
          onClick={() => onItemClick(item)}
          className={cn('cursor-pointer px-2 py-1', {
            'bg-muted text-white': pickedItems.includes(item),
          })}
        >
          {item}
        </li>
      ))}
    </ul>
  );

  const renderEditButtons = () => (
    <Col fluid className="self-center md:-mt-5">
      <Button
        isFull
        onClick={handleAddItems}
        disabled={pickedInactiveItems.length === 0}
      >
        <IconArrowRight size={20} /> Add
      </Button>
      <Button
        variant="danger"
        isFull
        onClick={handleRemoveItems}
        disabled={pickedActiveItems.length === 0}
      >
        <IconArrowLeft size={20} /> Remove
      </Button>
    </Col>
  );

  const renderMoveButtons = () => (
    <Row align="center">
      <Button
        variant="secondary"
        onClick={handleMoveUp}
        disabled={
          pickedActiveItems.length === 0 ||
          activeItems.indexOf(pickedActiveItems[0]) === 0
        }
      >
        <IconArrowUp size={20} /> Move Up
      </Button>
      <Button
        variant="secondary"
        onClick={handleMoveDown}
        disabled={
          pickedActiveItems.length === 0 ||
          activeItems.indexOf(
            pickedActiveItems[pickedActiveItems.length - 1],
          ) ===
            activeItems.length - 1
        }
      >
        <IconArrowDown size={20} /> Move Down
      </Button>
    </Row>
  );

  return (
    <Row gap="lg" className={className}>
      <Col className="min-w-0 flex-1">
        <Heading size="sm">Inactive</Heading>
        {renderList(inactiveItems, pickedInactiveItems, handleAllItemClick)}
      </Col>
      {renderEditButtons()}
      <Col className="min-w-0 flex-1">
        <Heading size="sm">Active</Heading>
        {renderList(activeItems, pickedActiveItems, handlePickedItemClick)}
        {renderMoveButtons()}
      </Col>
    </Row>
  );
}
