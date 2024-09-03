import { Card } from '@/components/Card';
import { Title } from '@/components/Title';
import { Button } from '@/components/Button';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Row } from '@/components/Row';

export default function App() {
  return (
    <div className="p-6">
      <Row>
        <Card>
          <Title>Toast</Title>
          <p>Price: $100</p>
          <Row>
            <Button isFull>
              <IconPlus />
            </Button>
            <Button variant="secondary" isFull className="w-12">
              <IconMinus className="shrink-0" />
            </Button>
          </Row>
        </Card>
        <Card>
          <Title>Toast</Title>
          <p>Price: $100</p>
          <Row>
            <Button isFull>
              <IconPlus />
            </Button>
            <Button variant="secondary" isFull className="w-12">
              <IconMinus className="shrink-0" />
            </Button>
          </Row>
        </Card>
      </Row>
    </div>
  );
}
