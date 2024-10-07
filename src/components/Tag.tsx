import { ReactNode } from 'react';
import { cn } from '@/utils';
import { IconX } from '@tabler/icons-react';

type TagProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function Tag({ className, children, onClick }: TagProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 rounded bg-subtle px-2 py-1 text-sm text-foreground',
        className,
      )}
    >
      {children}
      {onClick && (
        <button
          type="button"
          className="ml-1 cursor-pointer text-xs text-white"
          onClick={onClick}
        >
          <IconX size={10} />
        </button>
      )}
    </span>
  );
}
