import { useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';

export type CustomLink<T = {}> = {
  type: string;
  value: string;
} & T;

type PlatformOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type CustomLinksProps<T = {}> = {
  label?: string;
  links?: CustomLink<T>[];
  options: PlatformOption[];
  className?: string;
  errors?: Array<{ type?: string; value?: string }>;
  onChange: (links: CustomLink<T>[]) => void;
  onFocus?: (field: string | null) => void;
  asTypeLabel?: (
    link: CustomLink<T>,
    index: number,
    handleLinkChange: (index: number, fieldType: string, value: any) => void,
  ) => React.ReactNode;
};

export const CustomLinks = <T,>({
  label,
  links: initialLinks = [],
  options,
  className,
  errors = [],
  onChange,
  onFocus,
  asTypeLabel,
}: CustomLinksProps<T>) => {
  const [links, setLinks] = useState<CustomLink<T>[]>(initialLinks);

  const updateLinks = (newLinks: CustomLink<T>[]) => {
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleLinkChange = (index: number, fieldType: string, value: any) => {
    const newLinks = links.map((link, i) => {
      if (i === index) {
        return { ...link, [fieldType]: value };
      }
      return link;
    });
    updateLinks(newLinks);
  };

  const handleAddLink = () => {
    const newLinks = [...links, { type: '', value: '' } as CustomLink<T>];
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
            label={
              asTypeLabel ? asTypeLabel(link, index, handleLinkChange) : 'Type'
            }
            value={link.type}
            options={options}
            onChange={(value) =>
              handleLinkChange(index, 'type', value as string)
            }
            onFocus={() => onFocus?.(`content.socialLinks.${index}.type`)}
            onBlur={() => onFocus?.(null)}
            error={errors?.[index]?.type}
          />
          <Input
            label="Value"
            value={link.value}
            onChange={(e) => handleLinkChange(index, 'value', e.target.value)}
            onFocus={() => onFocus?.(`content.socialLinks.${index}.value`)}
            onBlur={() => onFocus?.(null)}
            error={errors?.[index]?.value}
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
