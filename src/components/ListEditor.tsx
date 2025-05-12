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

type ListEditorLabels = {
  active?: string;
  inactive?: string;
  moveUp?: string;
  moveDown?: string;
  add?: string;
  remove?: string;
};

type ListEditorProps = {
  items: string[];
  activeItems?: string[];
  className?: string;
  onChange: (initialItems: string[]) => void;
  labels?: ListEditorLabels;
  /**
   * Optional function to format item labels for display only.
   */
  asItemName?: (item: string) => string;
};

export function ListEditor({
  items,
  activeItems: initialItems = [],
  className,
  onChange,
  labels,
  asItemName,
}: ListEditorProps) {
  const {
    active = 'Active',
    inactive = 'Inactive',
    moveUp = 'Move Up',
    moveDown = 'Move Down',
    add = 'Add',
    remove = 'Remove',
  } = labels || {};

  const [activeItems, setActiveItems] = useState<string[]>(() => {
    return initialItems && initialItems.length > 0 ? initialItems : items;
  });

  const [inactiveItems, setInactiveItems] = useState<string[]>(
    items.filter((item) => !activeItems.includes(item)),
  );

  const [pickedInactiveItems, setPickedInactiveItems] = useState<string[]>([]);
  const [pickedActiveItems, setPickedActiveItems] = useState<string[]>([]);

  useEffect(() => {
    setInactiveItems(items.filter((item) => !activeItems.includes(item)));
  }, [activeItems, items]);

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
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handlePickedItemClick = (item: string) => {
    setPickedActiveItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const renderList = (
    listItems: string[],
    pickedItems: string[],
    onItemClick: (item: string) => void,
  ) => (
    <ul className="h-40 w-full overflow-y-auto rounded border border-border p-2 text-sm">
      {listItems.map((item) => (
        <li
          key={item}
          onClick={() => onItemClick(item)}
          className={cn('cursor-pointer px-2 py-1', {
            'bg-muted text-white': pickedItems.includes(item),
          })}
        >
          {asItemName ? asItemName(item) : item}
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
        <IconArrowRight size={20} /> {add}
      </Button>
      <Button
        variant="danger"
        isFull
        onClick={handleRemoveItems}
        disabled={pickedActiveItems.length === 0}
      >
        <IconArrowLeft size={20} /> {remove}
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
        <IconArrowUp size={20} /> {moveUp}
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
        <IconArrowDown size={20} /> {moveDown}
      </Button>
    </Row>
  );

  return (
    <Row gap="lg" className={className}>
      <Col className="min-w-0 flex-1">
        <Heading size="sm">{inactive}</Heading>
        {renderList(inactiveItems, pickedInactiveItems, handleAllItemClick)}
      </Col>
      {renderEditButtons()}
      <Col className="min-w-0 flex-1">
        <Heading size="sm">{active}</Heading>
        {renderList(activeItems, pickedActiveItems, handlePickedItemClick)}
        {renderMoveButtons()}
      </Col>
    </Row>
  );
}
