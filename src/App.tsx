import { useState, useEffect } from 'react';
import { Row } from '@/components/Row';
import { ItemCard } from '@/components/ItemCard';
import { Title } from '@/components/Title';

const items = [
  { title: 'Toast (吐司)', price: 45 },
  { title: 'Eggs (雞蛋)', price: 95 },
  { title: 'Ground pork (豬絞肉)', price: 99 },
  { title: 'Chicken thigh (雞腿)', price: 80 },
  { title: 'Avocado (酪梨)', price: 69 },
  { title: 'Ham (火腿)', price: 76 },
  { title: 'Cheese (起司)', price: 83 },
  { title: 'Sweet potato leaves (地瓜葉)', price: 35 },
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
      <Row className="flex flex-wrap justify-center gap-4">
        {items.map((item, index) => (
          <ItemCard
            key={index}
            title={item.title}
            price={item.price}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            className="w-full md:w-64"
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
