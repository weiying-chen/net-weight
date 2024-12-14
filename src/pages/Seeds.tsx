import { useState, useEffect } from 'react';
import { Column, DataTable } from '@/components/DataTable';
import { timeAgo } from '@/utils';
import { Button } from '@/components/Button';
import { seedData as initialData, Seed } from '@/data';

export function Seeds(): JSX.Element {
  const [plants, setPlants] = useState<Seed[]>(() => {
    const savedData = localStorage.getItem('seeds');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('seeds', JSON.stringify(plants));
  }, [plants]);

  const markAsWatered = (id: number) => {
    const now = new Date().toISOString();
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered: now } : plant,
      ),
    );
  };

  const markAsSowed = (id: number) => {
    const now = new Date().toISOString();
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, sowedDate: now } : plant,
      ),
    );
  };

  const markAsSprouted = (id: number) => {
    const now = new Date().toISOString();
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, sproutedDate: now } : plant,
      ),
    );
  };

  const incrementSeedsSprouted = (id: number) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id
          ? { ...plant, seedsSprouted: (plant.seedsSprouted || 0) + 1 }
          : plant,
      ),
    );
  };

  const columns: Column<Seed>[] = [
    {
      header: 'Name',
      sortKey: 'name',
      accessor: (item: Seed) => item.name,
    },
    {
      header: 'Seeds sowed',
      sortKey: 'seedsSowed',
      accessor: (item: Seed) => item.seedsSowed,
    },
    {
      header: 'Seeds sprouted',
      sortKey: 'seedsSprouted',
      accessor: (item: Seed) => (
        <div className="flex items-center space-x-2">
          <span>{item.seedsSprouted || 0}</span>
          <Button
            variant="secondary"
            className="h-auto px-2 py-1 text-xs"
            onClick={() => incrementSeedsSprouted(item.id)}
          >
            +1
          </Button>
        </div>
      ),
    },
    {
      header: 'Sowed date',
      sortKey: 'sowedDate',
      accessor: (item: Seed) => (
        <div className="flex items-center space-x-2">
          <span>{item.sowedDate ? timeAgo(item.sowedDate) : 'Unknown'}</span>
          <Button
            variant="secondary"
            className="h-auto px-2 py-1 text-xs"
            onClick={() => markAsSowed(item.id)}
          >
            Set now
          </Button>
        </div>
      ),
    },
    {
      header: 'Sprouted date',
      sortKey: 'sproutedDate',
      accessor: (item: Seed) => (
        <div className="flex items-center space-x-2">
          <span>
            {item.sproutedDate ? timeAgo(item.sproutedDate) : 'Not sprouted'}
          </span>
          <Button
            variant="secondary"
            className="h-auto px-2 py-1 text-xs"
            onClick={() => markAsSprouted(item.id)}
          >
            Set now
          </Button>
        </div>
      ),
    },
    {
      header: 'Last watered',
      sortKey: 'lastWatered',
      accessor: (item: Seed) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const wasWateredAWeekAgo = item.lastWatered
          ? new Date(item.lastWatered) < oneWeekAgo
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
      header: 'Variable',
      sortKey: 'variable',
      accessor: (item: Seed) => item.variable || 'N/A',
    },
    {
      header: 'Substrate',
      sortKey: 'substrate',
      accessor: (item: Seed) =>
        item.substrate && item.substrate.length > 0
          ? item.substrate.join(', ')
          : 'Unknown',
    },
  ];

  return <DataTable data={plants} columns={columns} />;
}
