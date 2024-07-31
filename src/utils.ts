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

  if (typeof data === "object" && data !== null) {
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
