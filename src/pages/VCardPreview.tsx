import { Avatar } from '@/components/Avatar';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { Card } from '@/components/Card';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLine,
  IconBrandWechat,
  IconMail,
  IconMapPin,
  IconPhone,
  IconHome,
  IconPlus,
} from '@tabler/icons-react';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';

export const VCardPreview = () => {
  const previewSelfIntro = () => (
    <Card>
      <Col gap="lg">
        <Heading size="sm" hasBorder isFull>
          Self-introduction
        </Heading>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Col>
    </Card>
  );

  const previewContactInfo = () => (
    <Card>
      <Col gap="lg">
        <Heading size="sm" hasBorder isFull>
          Contact Info
        </Heading>
        <Row alignItems="center">
          <IconPhone size={20} />
          +1 (123) 456-7890
        </Row>
        <Row alignItems="center">
          <IconMail size={20} />
          example@example.com
        </Row>
        <Row alignItems="center">
          <IconMapPin size={20} />
          www.example.com
        </Row>
        <Row alignItems="start">
          <IconHome size={20} />
          1234 Main St, Springfield, USA
        </Row>
      </Col>
    </Card>
  );

  const previewCustomLinks = () => (
    <Card>
      <Col gap="lg">
        <Heading size="sm" hasBorder isFull>
          Social Links
        </Heading>
        <Row alignItems="center">
          <IconBrandFacebook size={20} />
          <a href="#">facebook.com/example</a>
        </Row>
        <Row alignItems="center">
          <IconBrandInstagram size={20} />
          <a href="#">instagram.com/example</a>
        </Row>
        <Row alignItems="center">
          <IconBrandLine size={20} />
          example_line
        </Row>
        <Row alignItems="center">
          <IconBrandWechat size={20} />
          example_wechat
        </Row>
      </Col>
    </Card>
  );

  return (
    <Col gap="lg" className="p-6">
      <Col alignItems="center">
        <Avatar
          size="lg"
          src="https://via.placeholder.com/150"
          alt="User Avatar"
        />
        <Heading size="lg">Title</Heading>
        <Heading>Heading</Heading>
        <Heading size="sm">Subheading</Heading>
        <Row align="center">
          <Button>
            <IconPlus size={20} />
            Add contact
          </Button>
        </Row>
      </Col>
      {previewSelfIntro()}
      {previewContactInfo()}
      {previewCustomLinks()}
    </Col>
  );
};
