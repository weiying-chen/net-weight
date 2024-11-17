import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { isInDormancy, timeAgo } from '@/utils';
import { Button } from '@/components/Button';

interface Plant {
  id: number;
  name: string;
  lastWatered: string;
  dormancy?: 'Summer' | 'Winter'; // Dormancy period
  lightLevel: 'High' | 'Low'; // Light requirements
  waterNeeds: 'High' | 'Low'; // Watering needs
}

const initialData: Plant[] = [
  {
    id: 1,
    name: 'Aloe marlothii',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: 'Winter',
    lightLevel: 'High', // High light requirements
    waterNeeds: 'Low', // Low water needs
  },
  {
    id: 2,
    name: 'Adenium obesum',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: 'Winter',
    lightLevel: 'High', // High light requirements
    waterNeeds: 'High', // High water needs
  },
  {
    id: 3,
    name: 'Haworthia cooperi',
    lastWatered: '2024-10-18T00:00:00',
    dormancy: 'Summer',
    lightLevel: 'Low', // Low light requirements
    waterNeeds: 'Low', // Low water needs
  },
];

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

  const columns = [
    {
      header: 'Plant',
      accessor: (item: Plant) => item.name,
    },
    {
      header: 'Last Watered',
      accessor: (item: Plant) => (
        <div className="flex items-center space-x-2">
          <span>
            {item.lastWatered ? timeAgo(item.lastWatered) : 'Never watered'}
          </span>
          <Button
            onClick={() => markAsWatered(item.id)}
            className="h-auto px-2 py-1 text-xs"
          >
            Water Now
          </Button>
        </div>
      ),
    },
    {
      header: 'Dormancy',
      accessor: (item: Plant) => {
        const isDormant = item.dormancy ? isInDormancy(item.dormancy) : false;

        return item.dormancy ? (
          <span className={`${isDormant ? 'text-success' : ''}`}>
            {item.dormancy}
          </span>
        ) : (
          'N/A'
        );
      },
    },
    {
      header: 'Light Level',
      accessor: (item: Plant) => (
        <span className={`${item.lightLevel === 'High' ? 'text-primary' : ''}`}>
          {item.lightLevel}
        </span>
      ),
    },
    {
      header: 'Water Needs',
      accessor: (item: Plant) => (
        <span className={`${item.waterNeeds === 'High' ? 'text-primary' : ''}`}>
          {item.waterNeeds}
        </span>
      ),
    },
  ];

  return <DataTable data={plants} columns={columns} />;
}
