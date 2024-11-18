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
    'location', // New column
    'comments', // New column
    'deadline', // New column
    'budget', // New column
    'approvalStatus', // New column
  ];

  const [data, setData] = useState<typeof initialData | []>([]);
  const [columns, setColumns] = useState<TableCol<(typeof initialData)[0]>[]>(
    [],
  );

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

  const initialData = [
    {
      name: 'WFH ISP Device',
      createDateTime: 'WFH ISP Device',
      lastUpdateDateTime: 'WFH ISP Device',
      createUserName: 'admin',
      status: 'Active',
      priority: 'High',
      category: 'IT Equipment',
      assignedTo: 'John Doe',
      description: 'Device for setup',
      location: 'New York',
      comments: 'Delivered successfully',
      deadline: 'New York',
      budget: 'New York',
      approvalStatus: 'Delivered successfully',
    },
    {
      name: 'ee',
      createDateTime: 'WFH ISP Device',
      lastUpdateDateTime: 'WFH ISP Device',
      createUserName: 'admin',
      status: 'Inactive',
      priority: 'Low',
      category: 'Miscellaneous',
      assignedTo: 'Jane Smith',
      description: 'Unused item in inventory',
      location: 'San Francisco',
      comments: 'Needs review',
      deadline: 'New York',
      budget: 'New York',
      approvalStatus: 'Pending',
    },
  ];

  // if (loading) {
  //   return <div>Loading...</div>; // Show a loading indicator
  // }

  return (
    <Col gap="lg">
      <Row gap="xl">
        <Table data={data} cols={columns.slice(0, 13)} />
      </Row>
    </Col>
  );
};
