export type Reading = {
  id: number;
  item: string;
  weight: number;
  createdAt: string;
  deviceId: string;
};

export type Device = {
  id: number;
  createdAt: string;
  deviceId: string;
  name: string;
};
