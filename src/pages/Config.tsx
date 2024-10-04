import { List } from '@/pages/List';

function flattenAttrs(
  data: { [key: string]: any; attributes: Record<string, any> }[],
) {
  return data.map(({ attributes, ...rest }) => ({
    ...attributes,
    ...rest,
  }));
}

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

// Sample data
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

const pickedKeys = ['attr1', 'attr2', 'tags'];

export function Config() {
  return (
    <div>
      <List data={flattenAttrs(data)} columns={colsFromKeys(pickedKeys)} />
    </div>
  );
}
