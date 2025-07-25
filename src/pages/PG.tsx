import { useState } from 'react';
import { Col } from '@/components/Col';
import { Table } from '@/components/Table'; // adjust path if needed

type Item = {
  id: string;
  fruit: string;
  color: string;
};

const generateItems = (count: number): Item[] => {
  const fruits = [
    'Apple',
    'Banana',
    'Grape',
    'Mango',
    'Orange',
    'Peach',
    'Plum',
    'Lemon',
    'Kiwi',
    'Papaya',
  ];
  const colors = [
    'Red',
    'Yellow',
    'Purple',
    'Green',
    'Orange',
    'Pink',
    'Blue',
    'Brown',
    'Black',
    'White',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    fruit: fruits[i % fruits.length] + ` ${i + 1}`,
    color: colors[i % colors.length],
  }));
};

export function PG() {
  const [items, setItems] = useState<Item[]>(() => generateItems(20));
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const columns = [
    {
      header: 'Fruit',
      render: (item: Item) => item.fruit,
    },
    {
      header: 'Color',
      render: (item: Item) => item.color,
      editable: false,
    },
  ];

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    newValue: string,
  ) => {
    console.log('Row:', rowIndex, 'Col:', colIndex, 'New:', newValue);
    // …your update logic…
  };

  const handleRowSelect = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
    );
  };

  return (
    <Col className="w-full gap-6 p-6">
      <Table<Item, Item>
        data={items}
        selectedData={selectedItems} // <- prop name fixed
        onRowSelect={(next) => setSelectedItems(next)}
        cols={[
          {
            header: 'Select',
            render: (item: Item) => (
              <input
                type="checkbox"
                checked={selectedItems.some((i) => i.id === item.id)}
                onChange={() => handleRowSelect(item)}
              />
            ),
          },
          ...columns,
        ]}
        onRowClick={(e, item) => console.log('Clicked row:', item)}
        onCellChange={handleCellChange}
      />
    </Col>
  );
}
