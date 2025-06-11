// PG.tsx
import { useState } from 'react';
import { Col } from '@/components/Col';
import { FieldList, FieldStatus } from '@/components/FieldList';
import { IconWorld, IconUsers, IconLock } from '@tabler/icons-react';

export type PersonVis = 'everyone' | 'friends' | 'only_me';

const visibilityOptions = [
  {
    value: 'everyone',
    label: 'Everyone',
    icon: <IconWorld size={14} />,
    tooltip: 'Visible to everyone',
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: <IconUsers size={14} />,
    tooltip: 'Visible to friends only',
  },
  {
    value: 'only_me',
    label: 'Only Me',
    icon: <IconLock size={14} />,
    tooltip: 'Visible only to you',
  },
] satisfies {
  value: PersonVis;
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
}[];

export function PG() {
  const [personalEmails, setPersonalEmails] = useState<
    FieldStatus<string, PersonVis>[]
  >([
    {
      value: 'alex@example.com',
      verified: true,
      visibleTo: 'friends',
    },
    {
      value: 'hello@drypots.com',
      verified: false,
      visibleTo: 'only_me',
    },
  ]);

  return (
    <Col className="w-full gap-6">
      <FieldList
        label="Email"
        addButtonLabel="Add email"
        value={personalEmails}
        onChange={setPersonalEmails}
        visibilityOptions={visibilityOptions}
      />
    </Col>
  );
}
