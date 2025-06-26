import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';

export type CustomLink<T extends string | null = string, U = {}> = {
  type: T;
  value: string | null;
} & U;

type PlatformOption<T extends string | null = string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

export type CustomLinksProps<T extends string | null = string, U = {}> = {
  label?: string;
  addLinkLabel?: string;
  typeLabel?: string;
  valueLabel?: string;
  links?: CustomLink<T, U>[];
  options: PlatformOption<T>[];
  className?: string;
  asTypeLabel?: (
    link: CustomLink<T, U>,
    index: number,
    handleLinkChange: (
      index: number,
      fieldType: keyof CustomLink<T, U>,
      value: any,
    ) => void,
  ) => React.ReactNode;
  selectPlaceholder?: string;
  onChange: (links: CustomLink<T, U>[]) => void;
  onFocus?: (field: string | null) => void;
  onAddLink?: () => CustomLink<T, U>;
  errors?: Array<{ type?: string; value?: string }>;
};

export const CustomLinks = <T extends string | null, U = {}>({
  label,
  addLinkLabel = 'Add link',
  typeLabel = 'Type',
  valueLabel = 'Value',
  links: initialLinks = [],
  options,
  className,
  asTypeLabel,
  selectPlaceholder,
  onChange,
  onFocus,
  onAddLink,
  errors = [],
}: CustomLinksProps<T, U>) => {
  const [links, setLinks] = useState<CustomLink<T, U>[]>([]);

  useEffect(() => {
    setLinks(
      initialLinks.map((link) => ({
        ...link,
        type: link.type ?? null,
        value: link.value ?? null,
      })),
    );
  }, [initialLinks]);

  const updateLinks = (newLinks: CustomLink<T, U>[]) => {
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleLinkChange = (
    index: number,
    fieldType: keyof CustomLink<T, U>,
    value: any,
  ) => {
    const updated = links.map((link, i) =>
      i === index ? { ...link, [fieldType]: value } : link,
    );
    updateLinks(updated);
  };

  const handleAddLink = () => {
    const newLink = onAddLink
      ? onAddLink()
      : ({ type: null, value: null } as CustomLink<T, U>);
    updateLinks([...links, newLink]);
  };

  const handleRemoveLink = (index: number) => {
    updateLinks(links.filter((_, i) => i !== index));
  };

  return (
    <Col className={className}>
      {label && <label className="text-sm font-semibold">{label}</label>}
      {links.map((link, index) => (
        <Row alignItems="start" key={index}>
          <Select<T | null>
            label={
              asTypeLabel
                ? asTypeLabel(link, index, handleLinkChange)
                : typeLabel
            }
            value={link.type}
            options={options}
            placeholder={selectPlaceholder}
            onChange={(value) =>
              handleLinkChange(index, 'type', value as T | null)
            }
            onFocus={() => onFocus?.(`content.socialLinks.${index}.type`)}
            onBlur={() => onFocus?.(null)}
            error={errors?.[index]?.type}
          />
          <Input
            label={valueLabel}
            value={link.value ?? ''}
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
        {addLinkLabel}
      </Button>
    </Col>
  );
};
