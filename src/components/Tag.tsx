import { ReactNode } from 'react';
import { cn } from '@/utils';
import { IconX } from '@tabler/icons-react';
import { Button } from '@/components/Button';

type TagProps = {
  className?: string;
  children: ReactNode;
  onRemove?: () => void;
  removeIconSize?: number;
};

export function Tag({
  className,
  children,
  onRemove,
  removeIconSize = 16,
}: TagProps) {
  return (
    <span
      className={cn(
        'flex h-7 items-center gap-2 whitespace-nowrap rounded bg-subtle px-2 py-1 text-sm text-foreground',
        className,
      )}
    >
      {children}
      {onRemove && (
        <Button variant="link" onClick={onRemove}>
          <IconX size={removeIconSize} />
        </Button>
      )}
    </span>
  );
}
