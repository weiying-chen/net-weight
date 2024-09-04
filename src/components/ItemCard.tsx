import { Card } from '@/components/Card';
import { Title } from '@/components/Title';
import { Button } from '@/components/Button';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Row } from '@/components/Row';

type ItemCardProps = {
  title: string;
  price: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

export function ItemCard({
  title,
  price,
  onIncrease,
  onDecrease,
}: ItemCardProps) {
  return (
    <Card>
      <Title>{title}</Title>
      <p>Price: ${price}</p>
      <Row>
        <Button isFull onClick={onIncrease}>
          <IconPlus />
        </Button>
        <Button
          variant="secondary"
          isFull
          className="w-12"
          onClick={onDecrease}
        >
          <IconMinus className="shrink-0" />
        </Button>
      </Row>
    </Card>
  );
}
