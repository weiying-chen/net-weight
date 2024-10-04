import { Col } from '@/components/Col';
import { ListPicker } from '@/components/ListPicker';

function flattenAttrs(
  data: { [key: string]: any; attributes: Record<string, any> }[],
) {
  return data.map(({ attributes, ...rest }) => ({
    ...attributes,
    ...rest,
  }));
}

// const data = [
//   {
//     attributes: {
//       attr1: 'string',
//       attr2: 0,
//       attr3: true,
//     },
//     tags: ['tag 1', 'tag 2'],
//   },
//   {
//     attributes: {
//       attr1: 'another string',
//       attr2: 42,
//       attr3: false,
//     },
//     tags: ['tag 3', 'tag 4'],
//   },
// ];

const data = [
  {
    attr1: 'string',
    attr2: 0,
    attr3: true,
    tags: ['tag 1', 'tag 2'],
  },
  {
    attr1: 'another string',
    attr2: 42,
    attr3: false,
    tags: ['tag 3', 'tag 4'],
  },
];

// const flattenedData = flattenAttrs(data);
// console.log(flattenedData);

const handleListPickerChange = (activeKeys: string[]) => {
  console.log('Selected keys:', activeKeys);
  // Additional logic to handle the selected keys can go here
};

export function Config() {
  return (
    <Col>
      {/* Pass data and onChange to ListPicker */}
      <ListPicker data={data} onChange={handleListPickerChange} />
    </Col>
  );
}
