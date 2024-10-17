import { useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';

type Link = {
  platform: string;
  url: string;
};

type PlatformOption = {
  value: string;
  label: string;
};

type CustomLinksProps = {
  label?: string;
  links: Link[];
  options: PlatformOption[];
  className?: string;
  errors?: Array<{ platform?: string; url?: string }>;
  onChange: (links: Link[]) => void;
};

export const CustomLinks: React.FC<CustomLinksProps> = ({
  label,
  links: initialLinks,
  options,
  className,
  errors,
  onChange,
}) => {
  const [links, setLinks] = useState<Link[]>(initialLinks);

  const updateLinks = (newLinks: Link[]) => {
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleLinkChange = (
    index: number,
    fieldType: 'platform' | 'url',
    value: string,
  ) => {
    const newLinks = links.map((link, i) => {
      if (i === index) {
        return { ...link, [fieldType]: value };
      }
      return link;
    });
    updateLinks(newLinks);
  };

  const handleAddLink = () => {
    const newLinks = [...links, { platform: '', url: '' }];
    updateLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    updateLinks(newLinks);
  };

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {links.map((link, index) => (
        <Row alignItems="start" key={index}>
          <Select
            label="Platform"
            value={link.platform}
            options={options}
            onChange={(value) =>
              handleLinkChange(index, 'platform', value as string)
            }
          />
          <Input
            label="URL"
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            error={errors?.[index]?.url}
          />
          <Button
            type="button"
            variant="secondary"
            className="md:mt-7"
            locked
            onClick={() => handleRemoveLink(index)}
          >
            <IconTrash size={20} />
          </Button>
        </Row>
      ))}
      <Button type="button" onClick={handleAddLink} className="self-start">
        Add Link
      </Button>
    </Col>
  );
};
