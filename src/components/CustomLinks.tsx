import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';

export type CustomLink<T extends string = string, U = {}> = {
  type: T;
  value: string | null; // Allow null values
} & U;

type PlatformOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

type CustomLinksProps<T extends string = string, U = {}> = {
  label?: string;
  links?: CustomLink<T, U>[];
  options: readonly PlatformOption<T>[];
  className?: string;
  onChange: (links: CustomLink<T, U>[]) => void;
  onFocus?: (field: string | null) => void;
  onAddLink?: () => CustomLink<T, U>;
  asTypeLabel?: (
    link: CustomLink<T, U>,
    index: number,
    handleLinkChange: (index: number, fieldType: string, value: any) => void,
  ) => React.ReactNode;
  errors?: Array<{ type?: string; value?: string }>;
};

export const CustomLinks = <T extends string, U = {}>({
  label,
  links: initialLinks = [],
  options,
  className,
  onChange,
  onFocus,
  onAddLink,
  asTypeLabel,
  errors = [],
}: CustomLinksProps<T, U>) => {
  const [links, setLinks] = useState<CustomLink<T, U>[]>([]);

  useEffect(() => {
    // Sanitize initial links to ensure `null` values are converted to ''
    setLinks(
      initialLinks.map((link) => ({
        ...link,
        value: link.value ?? '', // Convert `null` to empty string
      })),
    );
  }, [initialLinks]);

  const updateLinks = (newLinks: CustomLink<T, U>[]) => {
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleLinkChange = (index: number, fieldType: string, value: any) => {
    const newLinks = links.map((link, i) =>
      i === index
        ? { ...link, [fieldType]: value ?? '' } // Convert `null` to empty string
        : link,
    );
    updateLinks(newLinks);
  };

  const handleAddLink = () => {
    const newLink = onAddLink
      ? onAddLink()
      : ({ type: '', value: '' } as CustomLink<T, U>);

    updateLinks([...links, newLink]);
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
            options={[...options] as PlatformOption<T>[]}
            onChange={(value) =>
              handleLinkChange(index, 'type', value as string)
            }
            onFocus={() => onFocus?.(`content.socialLinks.${index}.type`)}
            onBlur={() => onFocus?.(null)}
            error={errors?.[index]?.type}
          />
          <Input
            label="Value"
            value={link.value ?? ''} // Ensure `null` is not passed to the input
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
        Add link
      </Button>
    </Col>
  );
};
