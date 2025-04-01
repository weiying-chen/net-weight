import { FlexFieldInput } from '@/components/FlexFields';

export const datasheetOptions: Record<
  string,
  { value: string; label: string }[]
> = {
  Rack: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial Number', label: 'Serial Number' },
    { value: 'Size', label: 'Size' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change Date', label: 'Change Date' },
    { value: 'Price', label: 'Price' },
  ],
  Switch: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial Number', label: 'Serial Number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change Date', label: 'Change Date' },
    { value: 'Price', label: 'Price' },
  ],
  Router: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial Number', label: 'Serial Number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change Date', label: 'Change Date' },
    { value: 'Price', label: 'Price' },
  ],
};

export const networkOptions: Record<
  string,
  { value: string; label: string }[]
> = {
  // Rack is intentionally omitted.
  Switch: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username, Password', label: 'Username, Password' },
    { value: 'IP Range,IP Address', label: 'IP Range,IP Address' },
    { value: 'Secret Key', label: 'Secret Key' },
  ],
  Router: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username, Password', label: 'Username, Password' },
    { value: 'IP Range,IP Address', label: 'IP Range,IP Address' },
    { value: 'Secret Key', label: 'Secret Key' },
    { value: 'Public Key', label: 'Public Key' },
  ],
};

export const extraInputs: Record<string, FlexFieldInput[]> = {
  Dimensions: [
    { key: 'width', label: 'Width', value: 0, type: 'number', unit: 'cm' },
    { key: 'depth', label: 'Depth', value: 0, type: 'number', unit: 'cm' },
    { key: 'height', label: 'Height', value: 0, type: 'number', unit: 'cm' },
  ],
  Price: [
    { key: 'amount', label: 'Amount', value: 0, type: 'number', unit: 'USD' },
    {
      key: 'currency',
      label: 'Currency',
      value: 'USD',
      type: 'select',
      options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
      ],
    },
  ],
  Size: [{ key: 'size', label: 'Size', value: 0, type: 'number', unit: 'U' }],
  Weight: [
    { key: 'weight', label: 'Weight', value: 0, type: 'number', unit: 'kg' },
  ],
  Unit: [{ key: 'unit', label: 'Unit', value: 'U', type: 'text' }],
  'MAC address': [
    { key: 'macAddress', label: 'MAC address', value: '', type: 'text' },
  ],
  'Username, Password': [
    { key: 'username', label: 'Username', value: '', type: 'text' },
    { key: 'password', label: 'Password', value: '', type: 'password' },
  ],
};

export const defaultInputs: FlexFieldInput[] = [
  {
    key: 'type',
    label: 'Type',
    value: 'Rack',
    type: 'select',
    options: Object.keys(datasheetOptions).map((type) => ({
      value: type,
      label: type,
    })),
  },
  {
    key: 'method',
    label: 'Method',
    value: 'Datasheet',
    type: 'select',
    // Only "Datasheet" by default if Type = "Rack"
    options: [{ value: 'Datasheet', label: 'Datasheet' }],
  },
  {
    key: 'item',
    label: 'Item',
    value: '',
    type: 'select',
    options: datasheetOptions.Rack,
  },
];
