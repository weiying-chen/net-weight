import { useState } from 'react';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { Card } from '@/components/Card';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { cn } from '@/utils';

type ListPickerProps = {
  keys: string[];
  onChange: (activeKeys: string[]) => void;
};

export function ListPicker({ keys, onChange }: ListPickerProps) {
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

  const updateItems = (
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

    updateItems(newActiveItems, remainingInactiveItems);
    setPickedInactiveItems([]);
  };

  const handleRemoveItems = () => {
    const remainingActiveItems = activeItems.filter(
      (item) => !pickedActiveItems.includes(item),
    );
    const newInactiveItems = [...inactiveItems, ...pickedActiveItems];

    updateItems(remainingActiveItems, newInactiveItems);
    setPickedActiveItems([]);
  };

  const renderList = (
    items: string[],
    selectedItems: string[],
    onItemClick: (key: string) => void,
  ) => (
    <ul className="h-40 w-full overflow-y-auto rounded border border-border p-2 text-sm">
      {items.map((item) => (
        <li
          key={item}
          onClick={() => onItemClick(item)}
          className={cn('cursor-pointer px-2 py-1', {
            'bg-muted text-white': selectedItems.includes(item),
          })}
        >
          {item}
        </li>
      ))}
    </ul>
  );

  const renderButtons = () => (
    <Col fluid>
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

  return (
    <Card>
      <Col>
        <Heading>Customize columns</Heading>
        <Row gap="lg" alignItems="center">
          <Col>
            <Heading size="sm">Inactive</Heading>
            {renderList(inactiveItems, pickedInactiveItems, handleAllItemClick)}
          </Col>
          {renderButtons()}
          <Col>
            <Heading size="sm">Active</Heading>
            {renderList(activeItems, pickedActiveItems, handlePickedItemClick)}
          </Col>
        </Row>
      </Col>
    </Card>
  );
}
