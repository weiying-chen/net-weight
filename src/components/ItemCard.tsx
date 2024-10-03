import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Item } from '@/types';

type ItemCardProps = {
  item: Item;
  onIncrease?: (item: Item) => void;
  onDecrease?: (item: Item) => void;
  className?: string;
};

export function ItemCard({
  item,
  onIncrease,
  onDecrease,
  className,
}: ItemCardProps) {
  const { title, price } = item;
  const itemKey = `isAdded-${title}`;

  const [isAdded, setIsAdded] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(itemKey);
    return savedValue ? JSON.parse(savedValue) : false;
  });

  const [increaseTriggered, setIncreaseTriggered] = useState(false);

  useEffect(() => {
    localStorage.setItem(itemKey, JSON.stringify(isAdded));
  }, [isAdded, itemKey]);

  const handleIncrease = () => {
    if (!isAdded) {
      setIsAdded(true);
      setIncreaseTriggered(false);
    } else {
      if (!increaseTriggered) {
        if (onIncrease) {
          onIncrease(item);
        }
        setIncreaseTriggered(true);
        setIsAdded(false);
      }
    }
  };

  const handleDecrease = () => {
    if (isAdded) {
      setIsAdded(false);
    } else {
      if (onDecrease) {
        onDecrease(item);
      }
      setIncreaseTriggered(false);
    }
  };

  return (
    <Card className={className}>
      <Heading>{title}</Heading>
      <p>Price: ${price}</p>
      <Row className="flex-row">
        <Button
          isFull
          onClick={handleIncrease}
          variant={isAdded ? 'success' : 'primary'}
          className="text-background"
        >
          <IconPlus size={20} />
        </Button>
        <Button variant="secondary" locked onClick={handleDecrease}>
          <IconMinus size={20} className="shrink-0" />
        </Button>
      </Row>
    </Card>
  );
}
