import { Col } from '@/components/Col';
import { Table } from '@/components/Table'; // Adjust the import path if needed

type Item = {
  id: string;
  fruit: string;
  color: string;
};

export function PG() {
  const items: Item[] = [
    { id: '1', fruit: 'Apple', color: 'Red' },
    { id: '2', fruit: 'Banana', color: 'Yellow' },
    { id: '3', fruit: 'Grape', color: 'Purple' },
  ];

  const columns = [
    {
      header: 'Fruit',
      render: (item: Item) => item.fruit,
      editable: true, // this one can be edited
    },
    {
      header: 'Color',
      render: (item: Item) => item.color,
      editable: false, // disable editing for this column
    },
  ];

  return (
    <Col className="w-full gap-6 p-6">
      <Table
        data={items}
        cols={columns}
        selectedItems={[]}
        onRowClick={(e, item) => {
          console.log('Clicked row:', item);
        }}
      />
    </Col>
  );
}
