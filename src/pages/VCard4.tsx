import { useNavigate } from 'react-router-dom';
import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { QRCodeSVG } from 'qrcode.react';
import { ClipCopy } from '@/components/ClipCopy';
import { VCardForm } from '@/pages/VCardForm';

const steps = [
  { label: 'Content', url: '/vcard1' },
  { label: 'Design', url: '/vcard2' },
  { label: 'QRCode', url: '/vcard3' },
];

const currentStep = 3;

const qrCodeUrl = 'https://example.com/qrcode';

export function VCard4() {
  const navigate = useNavigate();

  const handleStepClick = (url: string) => {
    navigate(url);
  };

  const renderShare = () => (
    <Col gap="lg">
      <Heading hasBorder isFull>
        Share
      </Heading>
      <Col alignItems="center" className="rounded bg-subtle p-4">
        <QRCodeSVG
          value={JSON.stringify(qrCodeUrl)}
          className="h-auto w-full max-w-40 border border-border"
        />
      </Col>
      <ClipCopy value={qrCodeUrl} />
    </Col>
  );

  return (
    <VCardForm
      currentStep={currentStep}
      steps={steps}
      onStepClick={handleStepClick}
    >
      {renderShare()}
    </VCardForm>
  );
}
