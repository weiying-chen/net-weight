import { useState } from 'react';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { Card } from '@/components/Card';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { cn } from '@/utils';

export function Config() {
  const [inactiveItems, setInactiveItems] = useState<number[]>(
    Array.from({ length: 10 }, (_, index) => index),
  );
  const [activeItems, setActiveItems] = useState<number[]>([]);
  const [pickedInactiveItems, setPickedInactiveItems] = useState<number[]>([]);
  const [pickedActiveItems, setPickedActiveItems] = useState<number[]>([]);

  const handleAllItemClick = (index: number) => {
    setPickedInactiveItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  const handlePickedItemClick = (index: number) => {
    setPickedActiveItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  const handleAddItems = () => {
    const newActiveItems = [...activeItems, ...pickedInactiveItems];
    const remainingInactiveItems = inactiveItems.filter(
      (item) => !pickedInactiveItems.includes(item),
    );
    setActiveItems(newActiveItems);
    setInactiveItems(remainingInactiveItems);
    setPickedInactiveItems([]);
  };

  const handleRemoveItems = () => {
    const newInactiveItems = [...inactiveItems, ...pickedActiveItems];
    const remainingActiveItems = activeItems.filter(
      (item) => !pickedActiveItems.includes(item),
    );
    setInactiveItems(newInactiveItems);
    setActiveItems(remainingActiveItems);
    setPickedActiveItems([]);
  };

  const renderList = (
    items: number[],
    selectedItems: number[],
    onItemClick: (index: number) => void,
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
          Column {item + 1}
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
