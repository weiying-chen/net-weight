import { forwardRef, MouseEvent } from 'react';
import { cn } from '@/utils';
import { Row } from '@/components/Row';

type PseudoInputProps = {
  tabIndex?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const PseudoInput = forwardRef<HTMLDivElement, PseudoInputProps>(
  function PseudoInput(
    { tabIndex, error, disabled, className, children, onClick },
    ref,
  ) {
    return (
      <Row
        ref={ref}
        alignItems="center"
        locked
        tabIndex={tabIndex}
        onClick={onClick}
        className={cn(
          'h-10 w-full whitespace-nowrap rounded border border-border bg-background px-3 py-2 text-sm outline-none ring-foreground ring-offset-2 ring-offset-background focus-visible:ring-2',
          {
            'border-danger': error,
            'pointer-events-none opacity-50': disabled,
          },
          className,
        )}
      >
        {children}
      </Row>
    );
  },
);

PseudoInput.displayName = 'PseudoInput';
