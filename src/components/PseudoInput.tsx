import { cn } from '@/utils';
import { Row } from '@/components/Row';

type PseudoInputProps = {
  tabIndex?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const PseudoInput = ({
  tabIndex,
  error,
  disabled,
  className,
  children,
}: PseudoInputProps) => {
  return (
    <Row
      alignItems="center"
      locked={true}
      tabIndex={tabIndex}
      className={cn(
        'h-10 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none ring-foreground ring-offset-2 focus-visible:ring-2',
        {
          'border-danger': error,
          'cursor-not-allowed opacity-50': disabled,
        },
        className,
      )}
    >
      {children}
    </Row>
  );
};
