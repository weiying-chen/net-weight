import { useState } from 'react';
import { Col } from '@/components/Col';
import { Table } from '@/components/Table'; // Adjust the import path if needed

type Item = {
  id: string;
  fruit: string;
  color: string;
};

export function PG() {
  // State to store the items data
  const [items, setItems] = useState<Item[]>([
    { id: '1', fruit: 'Apple', color: 'Red' },
    { id: '2', fruit: 'Banana', color: 'Yellow' },
    { id: '3', fruit: 'Grape', color: 'Purple' },
  ]);

  // Define columns for the table
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

  // Handle cell changes
  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    newValue: string,
  ) => {
    // Log the values
    console.log('Row Index:', rowIndex);
    console.log('Column Index:', colIndex);
    console.log('New Value:', newValue);

    // Get the column header to know which property to update
    const columnHeader = columns[colIndex].header;

    // If column is editable, update the corresponding item
    if (columnHeader) {
      const updatedItems = [...items];
      updatedItems[rowIndex] = {
        ...updatedItems[rowIndex],
        [columnHeader.toLowerCase()]: newValue, // Dynamically update the property
      };
      setItems(updatedItems); // Update the state with the new items array
    }
  };

  return (
    <Col className="w-full gap-6 p-6">
      <Table
        data={items}
        cols={columns}
        selectedItems={[]}
        onRowClick={(e, item) => {
          console.log('Clicked row:', item);
        }}
        onCellChange={handleCellChange} // Pass the handleCellChange function
      />
    </Col>
  );
}
