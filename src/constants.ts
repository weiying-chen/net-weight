import { FlexFieldInput } from '@/components/FlexFields';

export const datasheetOptions: Record<
  string,
  { value: string; label: string }[]
> = {
  Rack: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial number', label: 'Serial number' },
    { value: 'Size', label: 'Size' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change date', label: 'Change date' },
    { value: 'Price', label: 'Price' },
  ],
  Switch: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial number', label: 'Serial number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change date', label: 'Change date' },
    { value: 'Price', label: 'Price' },
  ],
  Router: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial number', label: 'Serial number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change date', label: 'Change date' },
    { value: 'Price', label: 'Price' },
  ],
  Firewall: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Serial number', label: 'Serial number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change date', label: 'Change date' },
    { value: 'Price', label: 'Price' },
  ],
  Server: [
    { value: 'Manufacturers', label: 'Manufacturers' },
    { value: 'Service tag', label: 'Service tag' },
    { value: 'Serial number', label: 'Serial number' },
    { value: 'MAC address', label: 'MAC address' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Power', label: 'Power' },
    { value: 'Dimensions', label: 'Dimensions' },
    { value: 'Weight', label: 'Weight' },
    { value: 'Unit', label: 'Unit' },
    { value: 'Processor', label: 'Processor' },
    { value: 'RAM (memory)', label: 'RAM (memory)' },
    { value: 'Storage', label: 'Storage' },
    { value: 'Acquisition date', label: 'Acquisition date' },
    { value: 'Change date', label: 'Change date' },
    { value: 'Price', label: 'Price' },
  ],
};

export const networkOptions: Record<
  string,
  { value: string; label: string }[]
> = {
  Switch: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username & password', label: 'Username & password' },
    { value: 'IP range & IP address', label: 'IP range & IP address' },
    { value: 'Secret Key', label: 'Secret Key' },
  ],
  Router: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username & password', label: 'Username & password' },
    { value: 'IP range & IP address', label: 'IP range & IP address' },
    { value: 'Secret Key', label: 'Secret Key' },
    { value: 'Public Key', label: 'Public Key' },
  ],
  Firewall: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username & password', label: 'Username & password' },
    { value: 'IP range & IP address', label: 'IP range & IP address' },
    { value: 'Secret Key', label: 'Secret Key' },
  ],
  Server: [
    { value: 'Ethernet', label: 'Ethernet' },
    { value: 'Optical', label: 'Optical' },
    { value: 'Username & password', label: 'Username & password' },
    { value: 'IP range & IP address', label: 'IP range & IP address' },
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
  Size: [{ key: 'size', label: 'Value', value: 0, type: 'number', unit: 'U' }],
  Weight: [
    { key: 'weight', label: 'Value', value: 0, type: 'number', unit: 'kg' },
  ],
  Unit: [{ key: 'unit', label: 'Value', value: '', type: 'text', unit: 'U' }],
  'MAC address': [
    { key: 'macAddress', label: 'Value', value: '', type: 'text' },
  ],
  'Username & password': [
    { key: 'username', label: 'Username', value: '', type: 'text' },
    { key: 'password', label: 'Password', value: '', type: 'password' },
  ],
  Processor: [
    {
      key: 'processor',
      label: 'Value',
      value: '',
      type: 'text',
      unit: 'CPU',
    },
  ],
  'RAM (memory)': [
    { key: 'ram', label: 'Value', value: 0, type: 'number', unit: 'GB' },
  ],
  Storage: [
    { key: 'storage', label: 'Value', value: 0, type: 'number', unit: 'GB' },
  ],
  'Service tag': [
    { key: 'serviceTag', label: 'Value', value: '', type: 'text' },
  ],
  Power: [
    {
      key: 'power',
      label: 'Value',
      value: '',
      type: 'select',
      options: [
        { value: 'Single power supply', label: 'Single power supply' },
        { value: 'Dual power supply', label: 'Dual power supply' },
      ],
    },
  ],
  'Acquisition date': [
    { key: 'acquisitionDate', label: 'Value', value: '', type: 'date' },
  ],
  'Change date': [
    { key: 'changeDate', label: 'Value', value: '', type: 'date' },
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
