import { Device } from "./types";

export const getDeviceName = (devices: Device[], deviceId: string): string => {
  const device = devices.find((d) => d.device_id === deviceId);
  return device ? device.name : deviceId;
};
