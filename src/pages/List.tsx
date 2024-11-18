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
  ];

  const data = [
    {
      name: 'WFH ISP Device',
      createDateTime: '2024-11-11 10:14:29',
      lastUpdateDateTime: '2024-11-17 14:55:09',
      createUserName: 'admin',
    },
    {
      name: 'ee',
      createDateTime: '2024-11-15 09:39:10',
      lastUpdateDateTime: '2024-11-15 10:15:31',
      createUserName: 'admin',
    },
  ];

  const [columns, setColumns] = useState<TableCol<(typeof data)[0]>[]>([]);

  useEffect(() => {
    const cols = colsFromKeys(pickedKeys);
    setColumns(cols);
  }, []);

  return (
    <Col gap="lg">
      <Row gap="xl">
        <Table data={data} cols={columns} />
      </Row>
    </Col>
  );
};
