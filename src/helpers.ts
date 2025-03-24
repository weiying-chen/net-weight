import { FileData } from '@/components/FileUpload';
import { Device } from './types';

export function getDeviceName(devices: Device[], deviceId: string): string {
  const device = devices.find((d) => d.deviceId === deviceId);
  return device ? device.name : deviceId;
}

export function getFileUrl(file: FileData | File): string | undefined {
  if ('url' in file && file.url) {
    return file.url;
  }

  if (file instanceof File) {
    const url = URL.createObjectURL(file);
    return url;
  }

  return undefined;
}
