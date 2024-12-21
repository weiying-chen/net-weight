import { Column } from '@/components/DataTable';
import { Seed } from '@/data';

import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

import { Button } from '@/components/Button';

const shortTimeAgo = (dateTime: string): string => {
  const now = new Date();
  const then = new Date(dateTime);

  const years = differenceInYears(now, then);
  if (years > 0) return `${years}y`;

  const months = differenceInMonths(now, then);
  if (months > 0) return `${months}mo`;

  const weeks = differenceInWeeks(now, then);
  if (weeks > 0) return `${weeks}w`;

  const days = differenceInDays(now, then);
  if (days > 0) return `${days}d`;

  const hours = differenceInHours(now, then);
  if (hours > 0) return `${hours}h`;

  const minutes = differenceInMinutes(now, then);
  if (minutes > 0) return `${minutes}m`;

  const seconds = differenceInSeconds(now, then);
  return `${seconds}s`;
};

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
        <span>{item.sowedDate ? shortTimeAgo(item.sowedDate) : 'Unknown'}</span>
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
          {item.sproutedDate ? shortTimeAgo(item.sproutedDate) : 'Not sprouted'}
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
            {item.lastWatered
              ? shortTimeAgo(item.lastWatered)
              : 'Never watered'}
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
