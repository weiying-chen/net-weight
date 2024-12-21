import { useState, useEffect } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';

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

  const [selectedItems, setSelectedItems] = useState<typeof initialData>([]);

  useEffect(() => {
    const cols = colsFromKeys(pickedKeys);
    setColumns(cols);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(initialData);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
    ...Array(8)
      .fill(0)
      .map((_, index) => ({
        name: `Duplicated Item ${index + 1}`,
        createDateTime: '2023-11-03',
        lastUpdateDateTime: '2023-11-03',
        createUserName: 'user',
        status: 'Pending',
        priority: 'Medium',
        category: 'Office Supplies',
        assignedTo: 'Team Member',
        description: 'Generic description',
        location: 'Chicago',
        comments: 'No comments',
        deadline: '2023-12-15',
        budget: '$100',
        approvalStatus: 'Pending',
      })),
  ];

  return (
    <Col gap="lg">
      <Row gap="xl">
        <Table
          data={data}
          cols={columns}
          selectedItems={selectedItems}
          onRowSelect={(updatedSelection) => setSelectedItems(updatedSelection)}
          asActions={(item) => (
            <Row>
              <Button onClick={() => alert(`Editing: ${item.name}`)}>
                Edit
              </Button>
              <Button onClick={() => alert(`Deleting: ${item.name}`)}>
                Delete
              </Button>
            </Row>
          )}
          asTooltip={(item) => (
            <ul className="list-inside list-disc">
              {Object.entries(item).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {String(value)}
                </li>
              ))}
            </ul>
          )}
        />
      </Row>
      <div>
        <strong>Selected Rows:</strong>
        <pre>{JSON.stringify(selectedItems, null, 2)}</pre>
      </div>
    </Col>
  );
};
