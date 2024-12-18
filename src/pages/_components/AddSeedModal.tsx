import { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { Seed } from '@/data';

const defaultNewSeed: Omit<Seed, 'id'> = {
  name: '',
  variant: '',
  seedsSowed: 0,
  seedsSprouted: 0,
  sowedDate: '',
  sproutedDate: '',
  lastWatered: '',
  variable: '',
  substrate: [],
};

type AddSeedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seed: Seed | Omit<Seed, 'id'>) => void;
  initialSeed?: Seed | Omit<Seed, 'id'>;
};

export function AddSeedModal({
  isOpen,
  onClose,
  onSave,
  initialSeed,
}: AddSeedModalProps) {
  const [newSeed, setNewSeed] = useState<Seed | Omit<Seed, 'id'>>(
    initialSeed || defaultNewSeed,
  );

  useEffect(() => {
    if (initialSeed) {
      setNewSeed(initialSeed);
    } else {
      setNewSeed(defaultNewSeed);
    }
  }, [initialSeed]);

  const handleSave = () => {
    onSave(newSeed);
    setNewSeed(defaultNewSeed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Col gap="lg">
        <Heading hasBorder isFull>
          {initialSeed && 'id' in initialSeed ? 'Edit Seed' : 'Add New Seed'}
        </Heading>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="w-full"
        >
          <Col gap="md">
            <Input
              label="Name"
              value={newSeed.name}
              onChange={(e) => setNewSeed({ ...newSeed, name: e.target.value })}
            />
            <Input
              label="Variant"
              value={newSeed.variant}
              onChange={(e) =>
                setNewSeed({ ...newSeed, variant: e.target.value })
              }
            />
            <Input
              label="Seeds Sowed"
              type="number"
              min="0"
              value={newSeed.seedsSowed}
              onChange={(e) =>
                setNewSeed({ ...newSeed, seedsSowed: Number(e.target.value) })
              }
            />
            <Input
              label="Seeds Sprouted"
              type="number"
              min="0"
              value={newSeed.seedsSprouted}
              onChange={(e) =>
                setNewSeed({
                  ...newSeed,
                  seedsSprouted: Number(e.target.value),
                })
              }
            />
            <Input
              label="Sowed Date"
              type="datetime-local"
              value={newSeed.sowedDate}
              onChange={(e) =>
                setNewSeed({ ...newSeed, sowedDate: e.target.value })
              }
            />
            <Input
              label="Sprouted Date"
              type="datetime-local"
              value={newSeed.sproutedDate}
              onChange={(e) =>
                setNewSeed({ ...newSeed, sproutedDate: e.target.value })
              }
            />
            <Input
              label="Last Watered"
              type="datetime-local"
              value={newSeed.lastWatered}
              onChange={(e) =>
                setNewSeed({ ...newSeed, lastWatered: e.target.value })
              }
            />
            <Input
              label="Variable"
              value={newSeed.variable}
              onChange={(e) =>
                setNewSeed({ ...newSeed, variable: e.target.value })
              }
            />
            <Input
              label="Substrate"
              placeholder="Comma-separated values"
              value={newSeed.substrate?.join(', ')}
              onChange={(e) =>
                setNewSeed({
                  ...newSeed,
                  substrate: e.target.value.split(',').map((v) => v.trim()),
                })
              }
            />
          </Col>
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="ml-2">
              {initialSeed && 'id' in initialSeed ? 'Save Changes' : 'Add Seed'}
            </Button>
          </div>
        </form>
      </Col>
    </Modal>
  );
}
