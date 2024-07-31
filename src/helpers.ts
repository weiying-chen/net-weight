import { Device } from "./types";

export const getDeviceName = (devices: Device[], deviceId: string): string => {
  const device = devices.find((d) => d.deviceId === deviceId);
  return device ? device.name : deviceId;
};
