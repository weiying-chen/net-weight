import { ReactNode } from 'react';
import { cn } from '@/utils';
import { IconX } from '@tabler/icons-react';
import { Button } from '@/components/Button';

type TagProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function Tag({ className, children, onClick }: TagProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 rounded bg-subtle px-2 py-1 text-sm text-foreground',
        className,
      )}
    >
      {children}
      {onClick && (
        <Button variant="link" onClick={onClick}>
          <IconX size={16} />
        </Button>
      )}
    </span>
  );
}
