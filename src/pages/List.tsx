import { Table } from '@/components/Table';
import { Table2 } from '@/components/Table2';
// import { Table2 } from '@/components/Table2';

type User = {
  name: string;
  age: number;
  address: string;
};

export const List = () => {
  const columns = [
    { header: 'Name', render: (item: User) => item.name },
    { header: 'Age', render: (item: User) => item.age },
    { header: 'Address', render: (item: User) => item.address },
  ];

  const data = [
    { name: 'Alice', age: 25, address: '123 Main St' },
    { name: 'Bob', age: 30, address: '456 Elm St' },
  ];

  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-4 text-xl font-bold">User Table</h1>
      <Table2 data={data} cols={columns} />
      {/* <Table data={data} cols={columns} /> */}
    </div>
  );
};
