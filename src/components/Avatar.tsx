import { cn } from '@/utils';

type AvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  src: string;
  alt: string;
  className?: string;
};

export function Avatar({ size = 'md', src, alt, className }: AvatarProps) {
  const cnFromSize = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
  };

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center overflow-hidden rounded-full border border-border',
        cnFromSize[size],
        className,
      )}
    >
      <img src={src} alt={alt} />
    </div>
  );
}
