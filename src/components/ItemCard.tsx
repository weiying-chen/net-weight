import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Title } from '@/components/Title';
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
      <Title>{title}</Title>
      <p>Price: ${price}</p>
      <Row className="flex-row">
        <Button
          isFull
          onClick={handleIncrease}
          variant={isAdded ? 'success' : 'primary'}
          className="text-background"
        >
          <IconPlus />
        </Button>
        <Button
          variant="secondary"
          isFull
          className="w-12"
          onClick={handleDecrease}
        >
          <IconMinus className="shrink-0" />
        </Button>
      </Row>
    </Card>
  );
}
