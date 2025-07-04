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

  // State to track selected rows
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  // Define columns for the table
  const columns = [
    {
      header: 'Fruit',
      render: (item: Item) => item.fruit,
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
    // const columnHeader = columns[colIndex].header;

    // If column is editable, update the corresponding item
    // if (columnHeader) {
    //   const updatedItems = [...items];
    //   updatedItems[rowIndex] = {
    //     ...updatedItems[rowIndex],
    //     [columnHeader.toLowerCase()]: newValue, // Dynamically update the property
    //   };
    //   setItems(updatedItems); // Update the state with the new items array
    // }
  };

  // Handle row selection
  const handleRowSelect = (item: Item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id,
    );
    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id),
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <Col className="w-full gap-6 p-6">
      <Table
        data={items}
        cols={[
          {
            header: 'Select',
            render: (item: Item) => (
              <input
                type="checkbox"
                checked={selectedItems.some(
                  (selectedItem) => selectedItem.id === item.id,
                )}
                onChange={() => handleRowSelect(item)} // Toggle selection on checkbox change
              />
            ),
          },
          ...columns, // Spread the original columns here
        ]}
        selectedItems={selectedItems}
        onRowClick={(e, item) => {
          console.log('Clicked row:', item);
        }}
        onCellChange={handleCellChange} // Pass the handleCellChange function
        // editable={false}
      />
    </Col>
  );
}
