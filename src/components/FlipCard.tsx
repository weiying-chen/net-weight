interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipped?: boolean;
  direction?: 'left' | 'right';
}

export const FlipCard = ({
  front,
  back,
  className = '',
  flipped = false,
  direction = 'right',
}: FlipCardProps) => {
  const angle = direction === 'left' ? '-180deg' : '180deg';

  return (
    <div className={`h-64 w-56 [perspective:1000px] ${className}`}>
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          transform: flipped ? `rotateY(${angle})` : undefined,
        }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {front}
        </div>
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ transform: `rotateY(${angle})` }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};
