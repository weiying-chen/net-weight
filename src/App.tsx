import { useState, useEffect } from 'react';
import { Row } from '@/components/Row';
import { ItemCard } from '@/components/ItemCard';
import { Title } from '@/components/Title';

export default function App() {
  const [total, setTotal] = useState<number>(() => {
    const savedTotal = localStorage.getItem('total');
    return savedTotal ? parseInt(savedTotal, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('total', total.toString());
  }, [total]);

  const handleIncrease = (price: number) => {
    setTotal((prevTotal) => prevTotal + price);
  };

  const handleDecrease = (price: number) => {
    setTotal((prevTotal) => Math.max(0, prevTotal - price));
  };

  return (
    <div className="p-6">
      <Row>
        <ItemCard
          title="Toast (吐司)"
          price={45}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
        <ItemCard
          title="Avocado (酪梨)"
          price={69}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
        <ItemCard
          title="Sweet potatoes (甘薯)"
          price={35}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </Row>
      <Row align="center">
        <Title size="lg" className="mt-4">
          Total: ${total}
        </Title>
      </Row>
    </div>
  );
}
