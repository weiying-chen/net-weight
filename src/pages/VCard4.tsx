import { Button } from '@/components/Button';
import { Col } from '@/components/Col';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Row } from '@/components/Row';
import { VCardPreview } from '@/pages/VCardPreview';
import { useNavigate } from 'react-router-dom';

export function VCard4() {
  const navigate = useNavigate();

  // TODO: the URL should be set with a constant
  const handleEditClick = () => {
    navigate('/vcard1');
  };

  return (
    <Col gap="xl">
      <PhoneFrame>
        <VCardPreview />
      </PhoneFrame>
      <Row align="center">
        <Button variant="primary" onClick={handleEditClick}>
          Edit
        </Button>
      </Row>
    </Col>
  );
}
