import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { seedData as initialData, Seed } from '@/data';
import { AddSeedModal } from '@/pages/_components/AddSeedModal';
import { IconPlus } from '@tabler/icons-react';
import { Col } from '@/components/Col';
import { getSeedColumns } from '@/pages/seedColumns';

export function Seeds(): JSX.Element {
  const [plants, setPlants] = useState<Seed[]>(() => {
    const savedData = localStorage.getItem('seeds');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeed, setEditingSeed] = useState<Seed | null>(null);

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

  const handleSaveSeed = (seed: Seed | Omit<Seed, 'id'>) => {
    if ('id' in seed) {
      setPlants((prevPlants) =>
        prevPlants.map((plant) =>
          plant.id === seed.id ? { ...plant, ...seed } : plant,
        ),
      );
    } else {
      const nextId = plants.length
        ? Math.max(...plants.map((p) => p.id)) + 1
        : 1;
      setPlants((prevPlants) => [...prevPlants, { id: nextId, ...seed }]);
    }
    setEditingSeed(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('seeds', JSON.stringify(plants));
  }, [plants]);

  return (
    <Col gap="lg">
      <Button variant="primary" onClick={() => setIsModalOpen(true)}>
        <IconPlus /> Add Seed
      </Button>
      <DataTable
        data={plants}
        columns={getSeedColumns(
          incrementSeedsSprouted,
          markAsSowed,
          markAsSprouted,
          markAsWatered,
        )}
        onRowClick={(item) => setEditingSeed(item)}
      />
      <AddSeedModal
        isOpen={isModalOpen || !!editingSeed}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSeed(null);
        }}
        onSave={handleSaveSeed}
        initialSeed={editingSeed || undefined}
      />
    </Col>
  );
}
