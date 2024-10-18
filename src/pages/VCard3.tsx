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

const currentStep = 3;

const qrCodeUrl = 'https://example.com/qrcode';

export function VCard3() {
  const handleStepClick = (url: string) => {
    window.location.href = url;
  };

  const renderShare = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Share
      </Heading>
      <Row align="center" className="rounded bg-subtle p-4" locked>
        <QRCodeSVG
          value={JSON.stringify(qrCodeUrl)}
          className="h-auto w-full max-w-40 border border-border"
        />
      </Row>
      <ClipCopy value={qrCodeUrl} />
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
      {renderShare()}
    </Col>
  );
}
