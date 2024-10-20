import { Card } from '@/components/Card';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { IconDroplet } from '@tabler/icons-react';

interface Plant {
  name: string;
  date: string;
}

const items: Plant[] = [
  { name: 'Lithop (medium)', date: '2024-10-20T00:00:00' },
  { name: 'Lithop (small)', date: '2024-10-20T00:00:00' },
  { name: 'Haworthia', date: '2024-10-20T200:00:00' },
  { name: 'Portulaca (small)', date: '2024-10-20T00:00:00' },
  { name: 'Portulaca (medium)', date: '2024-10-20T00:00:00' },
  { name: 'Portulaca (large)', date: '2024-10-20T00:00:00' },
  { name: 'Lophophora (tall)', date: '2024-10-20T00:00:00' },
  { name: 'Adenium', date: '2024-10-20T00:00:00' },
];

const timeAgo = (dateString: string): string => {
  const now = new Date();
  const wateredDate = new Date(dateString);
  const diffInMs = now.getTime() - wateredDate.getTime();

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

export function Home2(): JSX.Element {
  return (
    <>
      <Row align="center" className="flex-wrap">
        {items.map((item, index) => (
          <Card key={index} className="w-full p-4 md:w-64">
            <Heading>{item.name}</Heading>
            <Row gap="sm">
              <IconDroplet size={20} />
              {timeAgo(item.date)}
            </Row>
          </Card>
        ))}
      </Row>
    </>
  );
}
