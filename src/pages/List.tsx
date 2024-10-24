import { useState } from 'react';
import { Table } from '@/components/Table';
import { ListEditor } from '@/components/ListEditor';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';

function flattenAttrs(
  data: { [key: string]: any; attributes: Record<string, any> }[],
) {
  return data.map(({ attributes, ...rest }) => ({
    ...attributes,
    ...rest,
  }));
}

const data = [
  {
    name: 'aaa',
    attributes: {
      attr1: 'string',
      attr2: 0,
      attr3: true,
    },
    tags: ['tag 1', 'tag 2'],
    tags1: ['tag 1', 'tag 2'],
    tags2: ['tag 1', 'tag 2'],
    tags3: ['tag 1', 'tag 2'],
    tags4: ['tag 1', 'tag 2'],
    tags5: ['tag 1', 'tag 2'],
    tags6: ['tag 1', 'tag 2'],
    tags7: ['tag 1', 'tag 2'],
    tags8sssssssss: ['tag 1', 'tag 2'],
  },
  {
    name: 'bbb',
    attributes: {
      attr1: 'another string',
      attr2: 42,
      attr3: false,
    },
    tags: ['tag 3', 'tag 4'],
    tags1: ['tag 1', 'tag 2'],
    tags2: ['tag 1', 'tag 2'],
    tags3: ['tag 1', 'tag 2'],
    tags4: ['tag 1', 'tag 2'],
    tags5: ['tag 1', 'tag 2'],
    tags6: ['tag 1', 'tag 2'],
    tags7: ['tag 1', 'tag 2'],
    tags8: ['tag 1', 'tag 2'],
  },
];

const flattenedData = flattenAttrs(data);

const keys = Object.keys(flattenedData[0]);

function colsFromKeys<T>(
  pickedKeys: string[],
): { header: string; render: (item: T) => React.ReactNode }[] {
  return pickedKeys.map((key) => ({
    header: key,
    render: (item: T) => {
      const value = item[key as keyof T];
      if (Array.isArray(value)) {
        return value.join(', ');
      } else if (typeof value === 'boolean') {
        return value ? 'True' : 'False';
      } else if (value === null || value === undefined) {
        return '';
      }
      return String(value);
    },
  }));
}

export function List() {
  const [pickedKeys, setPickedKeys] = useState<string[]>(keys);

  const handlePickedKeysChange = (newPickedKeys: string[]) => {
    setPickedKeys(newPickedKeys);
  };

  const columns = colsFromKeys<(typeof flattenedData)[0]>(pickedKeys);

  return (
    <Col gap="lg">
      <Row>
        <Col className="w-64">ssstw twt wtw twtwt</Col>
        <Col className="w-screen-lg w-full min-w-0">
          <ListEditor items={keys} onChange={handlePickedKeysChange} />
          <Table data={flattenedData} columns={columns} />
        </Col>
      </Row>
    </Col>
  );
}
