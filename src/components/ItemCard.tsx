import { useState } from 'react';
import { Card } from '@/components/Card';
import { Title } from '@/components/Title';
import { Button } from '@/components/Button';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Row } from '@/components/Row';

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
  const [isAdded, setIsAdded] = useState(false);
  const [increaseTriggered, setIncreaseTriggered] = useState(false); // Track if increase action was triggered

  const handleIncrease = () => {
    if (!isAdded) {
      // First click: set isAdded to true but do not increase the total
      setIsAdded(true);
      setIncreaseTriggered(false); // Reset increase trigger
    } else {
      if (!increaseTriggered) {
        // Second click: increase the total price and set isAdded to false
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
      // Decrease only if the price was increased
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
      <p>Status: {isAdded ? 'Added to list' : 'Not in list'}</p>
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
