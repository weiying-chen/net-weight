import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import Table from '@/components/Table';

const data = [
  { name: 'John Doe', age: 30, job: 'Engineer' },
  { name: 'Jane Smith', age: 25, job: 'Designer' },
];

type DataType = (typeof data)[0];

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
};

const columns: Column<DataType>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'age',
    header: 'Age',
    render: (item) => <strong>{item.age} years old</strong>,
  },
  { key: 'job', header: 'Job', render: (item) => <em>{item.job}</em> },
];

export function List() {
  return (
    <Col>
      <Heading>My Table</Heading>
      <Table data={data} columns={columns} />
    </Col>
  );
}
