import { Col } from '@/components/Col';
import { Heading } from '@/components/Heading';
import { QRCodeSVG } from 'qrcode.react';
import { ClipCopy } from '@/components/ClipCopy';
import { VCardForm } from '@/pages/VCardForm';

const qrCodeUrl = 'https://example.com/qrcode';

export function VCard3() {
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

  return <VCardForm>{renderShare()}</VCardForm>;
}
