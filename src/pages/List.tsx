import { useState, useEffect } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Table } from '@/components/Table';

export type TableCol<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

function renderArray(key: string, value: any[]): React.ReactNode {
  if (key === 'tags') {
    return value.map((org: any) => org.name).join(', ');
  } else if (key === 'contentAssets') {
    return value.map((contentAsset: any) => contentAsset.name).join(', ');
  }

  return value.join(', ');
}

function renderValue(key: string, value: any): React.ReactNode {
  const fallback = '-';
  const isEmptyArray =
    Array.isArray(value) && value.length === 0 && key !== 'favs';

  if (value === null || value === undefined || value === '' || isEmptyArray) {
    return fallback;
  } else if (Array.isArray(value)) {
    return renderArray(key, value);
  } else if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  } else {
    return String(value);
  }
}

function colsFromKeys<T>(pickedKeys: string[]): TableCol<T>[] {
  return pickedKeys.map((key) => ({
    header: key,
    render: (item: T) => {
      const value = item[key as keyof T];
      return renderValue(key, value);
    },
  }));
}

export const List = () => {
  const pickedKeys = [
    'name',
    'createDateTime',
    'lastUpdateDateTime',
    'createUserName',
    'status',
    'priority',
    'category',
    'assignedTo',
    'description',
    'location',
    'comments',
    'deadline',
    'budget',
    'approvalStatus',
  ];

  const [data, setData] = useState<typeof initialData | []>([]);
  const [columns, setColumns] = useState<TableCol<(typeof initialData)[0]>[]>(
    [],
  );

  // Added: Track selected rows
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const cols = colsFromKeys(pickedKeys);
    setColumns(cols);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(initialData);
    }, 0); // Simulate 2-second delay

    return () => clearTimeout(timer);
  }, []);

  // Added: Handle row selection
  const handleRowSelect = (rowIndex: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const initialData = [
    {
      name: 'WFH ISP Device',
      createDateTime: '2023-11-01',
      lastUpdateDateTime: '2023-11-01',
      createUserName: 'admin',
      status: 'Active',
      priority: 'High',
      category: 'IT Equipment',
      assignedTo: 'John Doe',
      description: 'Device for setup',
      location: 'New York',
      comments: 'Delivered successfully',
      deadline: '2023-12-01',
      budget: '$500',
      approvalStatus: 'Approved',
    },
    {
      name: 'ee',
      createDateTime: '2023-11-02',
      lastUpdateDateTime: '2023-11-02',
      createUserName: 'admin',
      status: 'Inactive',
      priority: 'Low',
      category: 'Miscellaneous',
      assignedTo: 'Jane Smith',
      description: 'Unused item in inventory',
      location: 'San Francisco',
      comments: 'Needs review',
      deadline: '2023-12-10',
      budget: '$200',
      approvalStatus: 'Pending',
    },
  ];

  return (
    <Col gap="lg">
      <Row gap="xl">
        <Table
          data={data}
          cols={columns.slice(0, 13)}
          selectedRows={selectedRows} // Pass selected rows
          onRowSelect={handleRowSelect} // Pass selection handler
        />
      </Row>
      <div>
        <strong>Selected Rows:</strong>
        <pre>
          {JSON.stringify(
            Array.from(selectedRows).map((index) => data[index]),
            null,
            2,
          )}
        </pre>
      </div>
    </Col>
  );
};
