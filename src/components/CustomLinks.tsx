import { useEffect, useState } from 'react';
import { Col } from '@/components/Col';
import { Row } from '@/components/Row';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { IconTrash } from '@tabler/icons-react';

export type CustomLink<T extends string = string, U = {}> = {
  type: T;
  value: string | null;
} & U;

type PlatformOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

export type CustomLinksProps<T extends string = string, U = {}> = {
  label?: string;
  addLinkLabel?: string;
  typeLabel?: string;
  valueLabel?: string;
  links?: CustomLink<T, U>[];
  options: readonly PlatformOption<T>[];
  className?: string;
  asTypeLabel?: (
    link: CustomLink<T, U>,
    index: number,
    handleLinkChange: (index: number, fieldType: string, value: any) => void,
  ) => React.ReactNode;
  selectPlaceholder?: string;
  onChange: (links: CustomLink<T, U>[]) => void;
  onFocus?: (field: string | null) => void;
  onAddLink?: () => CustomLink<T, U>;
  errors?: Array<{ type?: string; value?: string }>;
};

export const CustomLinks = <T extends string, U = {}>({
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
        value: link.value ?? '',
      })),
    );
  }, [initialLinks]);

  const updateLinks = (newLinks: CustomLink<T, U>[]) => {
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleLinkChange = (index: number, fieldType: string, value: any) => {
    const newLinks = links.map((link, i) =>
      i === index ? { ...link, [fieldType]: value ?? '' } : link,
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
              asTypeLabel
                ? asTypeLabel(link, index, handleLinkChange)
                : typeLabel
            }
            value={link.type}
            options={[...options] as PlatformOption<T>[]}
            placeholder={selectPlaceholder}
            onChange={(value) =>
              handleLinkChange(index, 'type', value as string)
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
