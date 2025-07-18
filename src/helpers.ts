import { FileData } from '@/components/FileUpload';
import { Device } from './types';

export function getDeviceName(devices: Device[], deviceId: string): string {
  const device = devices.find((d) => d.deviceId === deviceId);
  return device ? device.name : deviceId;
}

export function getFileUrl(file: FileData | File): string | undefined {
  const rawFile = file instanceof File ? file : file.file;
  const name = rawFile?.name || '';
  const type = rawFile?.type || '';

  const isImage =
    (type.startsWith('image/') && type !== 'image/vnd.dwg') ||
    /\.(jpe?g|png|gif|webp|svg)$/i.test(name);

  // Only create blob URL if this is a real image
  if (rawFile && isImage) {
    return URL.createObjectURL(rawFile);
  }

  // Only use .url if it's not a blob URL (those are session-bound and break)
  if ('url' in file && file.url && !file.url.startsWith('blob:')) {
    return file.url;
  }

  return undefined;
}
