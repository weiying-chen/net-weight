import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Title } from '@/components/Title';
import { Button } from '@/components/Button';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { cn } from '@/utils';

type ItemCardProps = {
  title: string;
  price: number;
  onIncrease?: (price: number) => void;
  onDecrease?: (price: number) => void;
};

export function ItemCard({
  title,
  price,
  onIncrease,
  onDecrease,
}: ItemCardProps) {
  const itemKey = `isAdded-${title}`; // Unique key for each item based on its title

  // Initialize isAdded from localStorage
  const [isAdded, setIsAdded] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(itemKey);
    return savedValue ? JSON.parse(savedValue) : false;
  });

  const [increaseTriggered, setIncreaseTriggered] = useState(false); // Track if increase action was triggered

  // Update localStorage whenever isAdded changes
  useEffect(() => {
    localStorage.setItem(itemKey, JSON.stringify(isAdded));
  }, [isAdded, itemKey]);

  const handleIncrease = () => {
    if (!isAdded) {
      setIsAdded(true);
      setIncreaseTriggered(false); // Reset increase trigger
    } else {
      if (!increaseTriggered) {
        if (onIncrease) {
          onIncrease(price);
        }
        setIncreaseTriggered(true); // Mark that increase was triggered
        setIsAdded(false); // Immediately set isAdded to false
      }
    }
  };

  const handleDecrease = () => {
    if (isAdded) {
      setIsAdded(false); // Reset added state
    } else {
      if (onDecrease) {
        onDecrease(price);
      }
      setIncreaseTriggered(false); // Reset trigger
    }
  };

  return (
    <Card>
      <Title>{title}</Title>
      <p>Price: ${price}</p>
      <p>
        Added:{' '}
        <span className={cn({ 'text-success': isAdded })}>
          {isAdded ? 'Yes' : 'No'}
        </span>
      </p>
      <Row>
        <Button isFull onClick={handleIncrease}>
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
