import { useState } from 'react';
import { DatePicker } from '@/components/DatePicker'; // adjust path if needed
import { Col } from '@/components/Col';

export function PG() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Col>
      <DatePicker
        label="Pickup date"
        value={selectedDate ?? undefined}
        onChange={(date) => {
          setSelectedDate(date);
          console.log('Selected date:', date);
        }}
        placeholder="Select a date"
        required
      />
    </Col>
  );
}
