import { useState, useEffect } from 'react';
import { Row } from '@/components/Row';
import { ItemCard } from '@/components/ItemCard';
import { Title } from '@/components/Title';

const foodItems = [
  { title: 'Toast (吐司)', price: 45 },
  { title: 'Avocado (酪梨)', price: 69 },
  { title: 'Sweet potatoes (甘薯)', price: 35 },
];

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
        {foodItems.map((item, index) => (
          <ItemCard
            key={index}
            title={item.title}
            price={item.price}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        ))}
      </Row>
      <Row align="center">
        <Title size="lg" className="mt-4">
          Total: ${total}
        </Title>
      </Row>
    </div>
  );
}
