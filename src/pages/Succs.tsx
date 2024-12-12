import { useState, useEffect } from 'react';
import { Column, DataTable } from '@/components/DataTable';
import { isInDormancy, timeAgo } from '@/utils';
import { Button } from '@/components/Button';
import { data as initialData, Plant } from '@/data';

export function Succs(): JSX.Element {
  const [plants, setPlants] = useState<Plant[]>(() => {
    const savedData = localStorage.getItem('plants');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('plants', JSON.stringify(plants));
  }, [plants]);

  const markAsWatered = (id: number) => {
    const now = new Date().toISOString();
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered: now } : plant,
      ),
    );
  };

  const columns: Column<Plant>[] = [
    {
      header: 'Name',
      sortKey: 'name',
      accessor: (item: Plant) => item.name,
    },
    {
      header: 'Variant',
      sortKey: 'variant',
      accessor: (item: Plant) => item.variant || 'N/A',
    },
    {
      header: 'Size',
      sortKey: 'size',
      accessor: (item: Plant) => item.size,
    },
    {
      header: 'Last Watered',
      sortKey: 'lastWatered',
      accessor: (item: Plant) => {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const wasWateredAWeekAgo = item.lastWatered
          ? new Date(item.lastWatered) < twoWeeksAgo
          : false;

        return (
          <div className="flex items-center space-x-2">
            <span className={wasWateredAWeekAgo ? 'text-primary' : ''}>
              {item.lastWatered ? timeAgo(item.lastWatered) : 'Never watered'}
            </span>
            <Button
              variant="secondary"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => markAsWatered(item.id)}
            >
              Set now
            </Button>
          </div>
        );
      },
    },
    {
      header: 'Dormancy',
      sortKey: 'dormancy',
      accessor: (item: Plant) => {
        const isDormant = item.dormancy ? isInDormancy(item.dormancy) : false;
        return item.dormancy ? (
          <span className={`${isDormant ? 'text-primary' : ''}`}>
            {item.dormancy}
          </span>
        ) : (
          'N/A'
        );
      },
    },
    {
      header: 'Light Level',
      sortKey: 'lightLevel',
      accessor: (item: Plant) => (
        <span className={`${item.lightLevel === 'High' ? 'text-primary' : ''}`}>
          {item.lightLevel}
        </span>
      ),
    },
    {
      header: 'Water Needs',
      sortKey: 'waterNeeds',
      accessor: (item: Plant) => (
        <span className={`${item.waterNeeds === 'High' ? 'text-primary' : ''}`}>
          {item.waterNeeds}
        </span>
      ),
    },
    {
      header: 'Substrate',
      sortKey: 'substrate',
      accessor: (item: Plant) =>
        item.substrate && item.substrate.length > 0
          ? item.substrate.join(', ')
          : 'Unknown',
    },
  ];

  return <DataTable data={plants} columns={columns} />;
}
