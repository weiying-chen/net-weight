import { useState } from 'react';
import { Row } from '@/components/Row';
import { ItemCard } from '@/components/ItemCard';
import { Title } from '@/components/Title';

export default function App() {
  const [total, setTotal] = useState(0);

  const handleIncrease = (price: number) => {
    setTotal((prevTotal) => prevTotal + price);
  };

  const handleDecrease = (price: number) => {
    setTotal((prevTotal) => Math.max(0, prevTotal - price)); // Ensures total doesn't go below zero
  };

  return (
    <div className="p-6">
      <Row>
        <ItemCard
          title="Toast"
          price={45}
          onIncrease={() => handleIncrease(45)}
          onDecrease={() => handleDecrease(45)}
        />
        <ItemCard
          title="Avocado"
          price={69}
          onIncrease={() => handleIncrease(69)}
          onDecrease={() => handleDecrease(69)}
        />
        <ItemCard
          title="Sweet potatoes"
          price={35}
          onIncrease={() => handleIncrease(35)}
          onDecrease={() => handleDecrease(35)}
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
