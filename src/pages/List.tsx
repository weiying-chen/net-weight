import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table';

const data = [
  {
    attributes: {
      attr1: 'string',
      attr2: 0,
      attr3: true,
    },
    tags: ['tag 1', 'tag 2'],
  },
  {
    attributes: {
      attr1: 'another string',
      attr2: 42,
      attr3: false,
    },
    tags: ['tag 3', 'tag 4'],
  },
];

type Column<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

export function List() {
  const columns: Column<(typeof data)[0]>[] = [
    { header: 'Attribute 1', render: (item) => item.attributes.attr1 },
    { header: 'Attribute 2', render: (item) => item.attributes.attr2 },
    {
      header: 'Attribute 3',
      render: (item) => (item.attributes.attr3 ? 'True' : 'False'),
    },
    {
      header: 'Tags',
      render: (item) => item.tags.join(', '),
    },
  ];

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <TableHeader key={index}>{column.header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>{column.render(item)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
