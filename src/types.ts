export type Reading = {
  id: number;
  item: string;
  weight: number;
  createdAt: string;
  deviceId: string;
};

export type Device = {
  id: number;
  created_at: string;
  device_id: string;
  name: string;
};
