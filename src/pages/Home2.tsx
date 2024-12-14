import { Card } from '@/components/Card';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import {
  IconDroplet,
  IconFlower,
  IconLeaf,
  IconSnowflake,
  IconSun,
  IconZzz,
} from '@tabler/icons-react';
import { Tooltip } from '@/components/Tooltip';

interface Plant {
  name: string;
  lastWatered: string;
  dormancy?: { start: string; end: string };
}

const items: Plant[] = [
  {
    name: 'Aloe marlothii',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '10', end: '03' }, // October to March
  },
  {
    name: 'Adenium obesum',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '10', end: '03' }, // October to March
  },
  {
    name: 'Senecio mweroensis',
    lastWatered: '',
    dormancy: { start: '11', end: '03' }, // November to March
  },
  {
    name: 'Lithops (medium)',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '11', end: '03' }, // November to March
  },
  {
    name: 'Lithops (small)',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '11', end: '03' }, // November to March
  },
  {
    name: 'Haworthia cooperi',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '05', end: '08' }, // May to August
  },
  {
    name: 'Portulaca molokiniensis (small)',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '12', end: '03' }, // December to March
  },
  {
    name: 'Portulaca molokiniensis (medium)',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '12', end: '03' }, // December to March
  },
  {
    name: 'Portulaca molokiniensis (large)',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '12', end: '03' }, // December to March
  },
  {
    name: 'Lophophora williamsii (tall)',
    lastWatered: '2024-10-20T00:00:00',
    dormancy: { start: '11', end: '02' }, // November to February
  },
  {
    name: 'Phyllanthus mirabilis',
    lastWatered: '',
    dormancy: { start: '11', end: '02' }, // November to February
  },
];

// Helper to calculate time since last watering
const timeAgo = (lastWateredString: string): string => {
  const now = new Date();
  const wateredLastWatered = new Date(lastWateredString);
  const diffInMs = now.getTime() - wateredLastWatered.getTime();

  const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
  );
  const weeks = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7),
  );
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  return `${years ? years + 'Y ' : ''}${months ? months + 'M ' : ''}${
    weeks ? weeks + 'W ' : ''
  }${days ? days + 'd ' : ''}${hours ? hours + 'h' : ''} ago`;
};

// Helper to check if current date is within dormancy period
const isInDormancy = (start: string, end: string): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear(); // Use the current year dynamically
  const startMonth = new Date(`${currentYear}-${start}-01`).getMonth();
  const endMonth = new Date(`${currentYear}-${end}-01`).getMonth();
  const currentMonth = now.getMonth();

  // Handle wrapping around the year (e.g., December to March)
  if (startMonth <= endMonth) {
    return currentMonth >= startMonth && currentMonth <= endMonth;
  } else {
    return currentMonth >= startMonth || currentMonth <= endMonth;
  }
};

// Helper to map month to season in Taiwan
const getSeason = (month: string): JSX.Element => {
  const currentYear = new Date().getFullYear(); // Use current year
  const monthIndex = new Date(`${currentYear}-${month}-01`).getMonth() + 1;

  if (monthIndex >= 3 && monthIndex <= 5) return <IconFlower size={20} />; // Spring icon
  if (monthIndex >= 6 && monthIndex <= 8) return <IconSun size={20} />; // Summer icon
  if (monthIndex >= 9 && monthIndex <= 11) return <IconLeaf size={20} />; // Fall icon
  return <IconSnowflake size={20} />; // Winter icon
};

export function Home2(): JSX.Element {
  return (
    <>
      <Row align="center" className="flex-wrap">
        {items.map((item, index) => (
          <Card key={index} className="w-full p-4 md:w-64">
            <Heading>{item.name}</Heading>
            <Row gap="sm">
              <IconDroplet size={20} />
              {timeAgo(item.lastWatered)}
            </Row>
            {item.dormancy && (
              <Row
                gap="sm"
                className={
                  isInDormancy(item.dormancy.start, item.dormancy.end)
                    ? 'text-success'
                    : ''
                }
              >
                <Tooltip content="Dormancy period">
                  <IconZzz size={20} />
                </Tooltip>
                {item.dormancy.end} ({getSeason(item.dormancy.start)} to{' '}
                {getSeason(item.dormancy.end)})
              </Row>
            )}
          </Card>
        ))}
      </Row>
    </>
  );
}
