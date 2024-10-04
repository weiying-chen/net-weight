import { useState } from 'react';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { Card } from '@/components/Card';
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
  keys: string[];
  onChange: (activeKeys: string[]) => void;
};

export function ListEditor({ keys, onChange }: ListEditorProps) {
  const [inactiveItems, setInactiveItems] = useState<string[]>(keys);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [pickedInactiveItems, setPickedInactiveItems] = useState<string[]>([]);
  const [pickedActiveItems, setPickedActiveItems] = useState<string[]>([]);

  const handleAllItemClick = (key: string) => {
    setPickedInactiveItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const handlePickedItemClick = (key: string) => {
    setPickedActiveItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const updateActiveItems = (newActiveItems: string[]) => {
    setActiveItems(newActiveItems);
    onChange(newActiveItems);
  };

  const updateAllItems = (
    newActiveItems: string[],
    newInactiveItems: string[],
  ) => {
    setActiveItems(newActiveItems);
    setInactiveItems(newInactiveItems);
    onChange(newActiveItems);
  };

  const handleAddItems = () => {
    const newActiveItems = [...activeItems, ...pickedInactiveItems];
    const remainingInactiveItems = inactiveItems.filter(
      (item) => !pickedInactiveItems.includes(item),
    );

    updateAllItems(newActiveItems, remainingInactiveItems);
    setPickedInactiveItems([]);
  };

  const handleRemoveItems = () => {
    const remainingActiveItems = activeItems.filter(
      (item) => !pickedActiveItems.includes(item),
    );
    const newInactiveItems = [...inactiveItems, ...pickedActiveItems];

    updateAllItems(remainingActiveItems, newInactiveItems);
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

  const renderList = (
    items: string[],
    pickedItems: string[],
    onItemClick: (key: string) => void,
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
    <>
      {/* The margin offsets the headings */}
      <Col fluid className="-mt-5 self-center">
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
    </>
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
    <Card>
      <Col>
        <Heading>Customize columns</Heading>
        <Row gap="lg">
          <Col>
            <Heading size="sm">Inactive</Heading>
            {renderList(inactiveItems, pickedInactiveItems, handleAllItemClick)}
          </Col>
          {renderEditButtons()}
          <Col>
            <Heading size="sm">Active</Heading>
            {renderList(activeItems, pickedActiveItems, handlePickedItemClick)}
            {renderMoveButtons()}
          </Col>
        </Row>
      </Col>
    </Card>
  );
}
