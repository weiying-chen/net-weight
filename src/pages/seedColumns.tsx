import { Column } from '@/components/DataTable';
import { Seed } from '@/data';
import { timeAgo } from '@/utils';
import { Button } from '@/components/Button';

export const getSeedColumns = (
  incrementSeedsSprouted: (id: number) => void,
  markAsSowed: (id: number) => void,
  markAsSprouted: (id: number) => void,
  markAsWatered: (id: number) => void,
): Column<Seed>[] => [
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
          onClick={(e) => {
            e.stopPropagation();
            incrementSeedsSprouted(item.id);
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            markAsSowed(item.id);
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            markAsSprouted(item.id);
          }}
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
            onClick={(e) => {
              e.stopPropagation();
              markAsWatered(item.id);
            }}
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
