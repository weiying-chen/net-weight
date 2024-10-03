import { Button } from '@/components/Button';
import { Col } from '@/components/Col';
import { Input } from '@/components/Input';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { Card } from '@/components/Card';

export function Misc() {
  return (
    <Col gap="lg">
      <Card>
        <Col alignItems="center">
          <Heading>Heading-heading-heading-heading-heading</Heading>
          <p>Some text</p>
        </Col>
      </Card>
      <Row align="between">
        <Row locked>
          <Input />
          <Button type="button" locked>
            Viewing
          </Button>
        </Row>
        <Row align="end">
          <Button type="button">Add item</Button>
        </Row>
      </Row>
      <Row gap="xl">
        <Col className="w-auto">
          <Heading>Categories</Heading>
          <p>Category 1</p>
          <p>Category 2</p>
          <p>Category 3</p>
        </Col>
        <Col>
          <p>This is the main content</p>
          <p>This is the main content</p>
          <p>This is the main content</p>
        </Col>
      </Row>
    </Col>
  );
}
