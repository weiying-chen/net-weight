import { Col } from '@/components/Col';
import { Steps } from '@/components/Steps';
import { Row } from '@/components/Row';
import { Heading } from '@/components/Heading';
import { QRCodeSVG } from 'qrcode.react';
import { ClipCopy } from '@/components/ClipCopy';

const steps = [
  { label: 'Content', url: '/vcard1' },
  { label: 'Design', url: '/vcard2' },
  { label: 'QRCode', url: '/vcard3' },
];

const currentStep = 1;

const qrCodeData = {
  content: {
    basicInfo: {
      title: '',
      heading: '',
      subheading: '',
      avatar: null,
    },
    selfIntro: {
      title: '',
      description: '',
    },
    contactInfo: {
      title: '',
      phone: '',
      email: '',
      website: '',
      address: '',
    },
    socialLinks: [],
  },
  design: {
    colors: {
      primaryColor: '#000000',
      secondaryColor: '#000000',
      backgroundColor: '#ffffff',
    },
  },
};

// Define the dummy URL variable
const qrCodeURL = 'https://example.com/qrcode';

export function VCard3() {
  const handleStepClick = (url: string) => {
    window.location.href = url;
  };

  const renderQrCode = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        QRCode
      </Heading>
      <Row align="center" className="rounded bg-subtle p-4" locked>
        <QRCodeSVG
          value={JSON.stringify(qrCodeData)}
          className="h-auto w-full max-w-40 border border-border"
        />
      </Row>
    </Col>
  );

  const renderShare = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Share
      </Heading>
      <ClipCopy label="" value={qrCodeURL} />
    </Col>
  );

  return (
    <Col gap="xl">
      <Row align="center" locked>
        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </Row>
      {renderQrCode()}
      {renderShare()}
    </Col>
  );
}
