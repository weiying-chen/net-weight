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
import { useNavigate } from 'react-router-dom';

export const downloadVcf = (vcf: string) => {
  const nameMatch = vcf.match(/FN:(.*)/);
  const fullName = nameMatch ? nameMatch[1].trim() : 'contact';
  const fileName = `${fullName.replace(/\s+/g, '_').toLowerCase()}.vcf`;
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

export const VCardPreview = () => {
  const navigate = useNavigate();

  const handleOutputVcf = () => {
    const vcf = `
      BEGIN:VCARD
      VERSION:3.0
      N:Bradford;Theresa;;;
      FN:Theresa Bradford
      ORG:FintechConsult
      TITLE:Finance Consultant
      TEL;WORK;VOICE:+1 (123) 456-7890
      EMAIL;WORK:example@example.com
      URL:www.example.com
      ADR:;;1234 Main St;Springfield;;USA
      END:VCARD
    `;

    downloadVcf(vcf);

    navigate('/vcard4');
  };

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
          <Button onClick={handleOutputVcf}>
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
