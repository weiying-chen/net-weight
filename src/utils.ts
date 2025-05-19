import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const groupBy = <T, K extends keyof T>(
  data: T | T[], // Accept either a single object or an array of objects
  key: K,
): Record<string, T[]> => {
  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : [data];

  return dataArray.reduce((acc: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key]); // Convert key to string to use as an object key
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
};

type AnyObject = { [key: string]: any };

export function toCamelCase(
  data: AnyObject | AnyObject[],
): AnyObject | AnyObject[] {
  if (Array.isArray(data)) {
    return data.map((item) => toCamelCase(item)) as AnyObject[];
  }

  if (typeof data === 'object' && data !== null) {
    const camelCaseObj: AnyObject = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (g) =>
          g[1].toUpperCase(),
        );
        camelCaseObj[camelCaseKey] = data[key];
      }
    }
    return camelCaseObj;
  }

  return data;
}

export const timeAgo = (lastWateredString: string): string => {
  const now = new Date();
  const wateredLastWatered = new Date(lastWateredString);
  const diffInMs = now.getTime() - wateredLastWatered.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

  if (years > 0) return `${years}y`;
  if (months > 0) return `${months}m`;
  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}min`;
  return `${seconds}s`; // Return seconds if less than a minute
};

export const isInDormancy = (dormancy?: 'Summer' | 'Winter'): boolean => {
  if (!dormancy) return false; // If dormancy is undefined, return false

  const now = new Date();
  const month = now.getMonth() + 1; // January = 0, so add 1

  // Summer: June (6) to August (8)
  const isSummer = month >= 6 && month <= 8;

  // Winter: December (12) to February (2)
  const isWinter = month === 12 || month <= 2;

  if (dormancy === 'Summer') return isSummer;
  if (dormancy === 'Winter') return isWinter;

  return false; // Default to false for invalid values
};

// Helper to map month to season in Taiwan
export const getSeason = (month: string): string => {
  const currentYear = new Date().getFullYear(); // Use current year
  const monthIndex = new Date(`${currentYear}-${month}-01`).getMonth() + 1;

  if (monthIndex >= 3 && monthIndex <= 5) return 'Spring';
  if (monthIndex >= 6 && monthIndex <= 8) return 'Summer';
  if (monthIndex >= 9 && monthIndex <= 11) return 'Fall';
  return 'Winter';
};

export function getArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const θ1 = (startDeg * Math.PI) / 180;
  const θ2 = (endDeg * Math.PI) / 180;
  const x1 = cx + Math.sin(θ1) * r;
  const y1 = cy - Math.cos(θ1) * r;
  const x2 = cx + Math.sin(θ2) * r;
  const y2 = cy - Math.cos(θ2) * r;
  return { d: `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`, x1, y1, x2, y2 };
}

export function getSegmentDegrees(
  index: number,
  slice: number,
  spotlight: boolean,
) {
  if (spotlight) {
    const mid = slice * index;
    return { startDeg: mid - slice / 2, endDeg: mid + slice / 2 };
  }
  return { startDeg: slice * index, endDeg: slice * (index + 1) };
}
