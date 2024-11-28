import { Row } from '@/components/Row';
import { Tag } from '@/components/Tag';

type TagsProps = {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
  className?: string;
};

export function Tags({ tags, onRemoveTag, className }: TagsProps) {
  return (
    <Row className={className} locked>
      {tags.map((tag) => (
        <Tag
          key={tag}
          onClick={onRemoveTag ? () => onRemoveTag(tag) : undefined}
        >
          {tag}
        </Tag>
      ))}
    </Row>
  );
}
