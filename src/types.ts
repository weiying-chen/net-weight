export type Reading = {
  id: number;
  weight: number;
  createdAt: string;
  deviceId: string;
};

export type Device = {
  id: number;
  createdAt: string;
  deviceId: string;
  name: string;
  itemWeight: number;
  extraWeight: number;
};

export type Item = {
  title: string;
  price: number;
};
