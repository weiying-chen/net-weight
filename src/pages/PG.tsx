import { useState } from 'react';
import { DayPicker } from '@/components/DayPicker'; // Adjust the import path as needed
import { Col } from '@/components/Col';

export function PG() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Col>
      <DayPicker
        value={selectedDate ?? undefined}
        onChange={(date) => {
          setSelectedDate(date);
          console.log('Selected date:', date);
        }}
      />
    </Col>
  );
}
