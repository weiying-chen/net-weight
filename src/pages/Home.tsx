import { ItemCard } from '@/components/ItemCard';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { Item } from '@/types';
import { useEffect, useState } from 'react';

const items = [
  { title: 'Toast (吐司)', price: 45 },
  { title: 'Eggs (雞蛋)', price: 95 },
  { title: 'Ground pork (豬絞肉)', price: 92 },
  { title: 'Chicken thigh (雞腿)', price: 80 },
  { title: 'Chicken breast (雞胸)', price: 79 },
  { title: 'Avocado (酪梨)', price: 69 },
  { title: 'Ham (火腿)', price: 76 },
  { title: 'Cheese (起司)', price: 83 },
  { title: 'Salmon (鮭魚)', price: 125 },
  { title: 'Sweet potato leaves (地瓜葉)', price: 35 },
  { title: 'Chicken wings (雞翅)', price: 64 },
  { title: 'Onions (洋蔥)', price: 32 },
  { title: 'Lettuce (生菜)', price: 32 },
  { title: 'Rice (米)', price: 159 },
  { title: 'Cabbage (高麗菜)', price: 32 },
  { title: 'Powder milk (奶粉)', price: 329 },
  { title: 'Radish (蘿蔔)', price: 45 },
  { title: 'Mayo (美乃滋)', price: 20 },
  { title: 'Lemon (檸檬)', price: 59 },
  { title: 'Mushrooms (香菇)', price: 68 },
];

export function Home() {
  const [total, setTotal] = useState<number>(() => {
    const savedTotal = localStorage.getItem('total');
    return savedTotal ? parseInt(savedTotal, 10) : 0;
  });

  const handleIncrease = (item: Item) => {
    setTotal((prevTotal) => prevTotal + item.price);
  };

  const handleDecrease = (item: Item) => {
    setTotal((prevTotal) => Math.max(0, prevTotal - item.price));
  };

  useEffect(() => {
    localStorage.setItem('total', total.toString());
  }, [total]);

  return (
    <>
      <Row align="center" className="flex-wrap">
        {items.map((item, index) => (
          <ItemCard
            key={index}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            className="w-full md:w-64"
          />
        ))}
      </Row>
      <Row align="center">
        <Heading size="lg" className="mt-4">
          Total: ${total}
        </Heading>
      </Row>
    </>
  );
}
