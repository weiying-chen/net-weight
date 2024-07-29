export const groupBy = <T, K extends keyof T>(
  data: T[],
  key: K,
): Record<string, T[]> => {
  return data.reduce((acc: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key]); // Convert key to string to use as an object key
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
};
