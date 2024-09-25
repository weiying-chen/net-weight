import { Button } from '@/components/Button';
import { Col } from '@/components/Col';
import { Input } from '@/components/Input';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';

export function Misc() {
  return (
    <>
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
      <br />
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
    </>
  );
}
