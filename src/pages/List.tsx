import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
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
    <Col gap="lg">
      <Row gap="xl">
        <Table data={data} cols={columns} />
      </Row>
    </Col>
  );
};
