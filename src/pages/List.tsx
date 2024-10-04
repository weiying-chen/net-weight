import { useState } from 'react';
import { Table } from '@/components/Table';
import { ListPicker } from '@/components/ListPicker';
import { Col } from '@/components/Col';

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
      <ListPicker keys={keys} onChange={handlePickedKeysChange} />
      <Table data={flattenedData} columns={columns} />
    </Col>
  );
}
