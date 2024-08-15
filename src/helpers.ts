import { Device } from "./types";

export function getDeviceName(devices: Device[], deviceId: string): string {
  const device = devices.find((d) => d.deviceId === deviceId);
  return device ? device.name : deviceId;
}
