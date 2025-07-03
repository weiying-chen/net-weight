import { useState, useEffect } from 'react';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipped?: boolean; // External control of the flipped state
}

export const FlipCard = ({
  front,
  back,
  className = '',
  flipped: flippedBase = false,
}: FlipCardProps) => {
  const [flipped, setFlipped] = useState(flippedBase);

  // If the external flip prop changes, update the internal state
  useEffect(() => {
    setFlipped(flippedBase);
  }, [flippedBase]);

  return (
    <div className={`perspective-1000 mb-8 h-64 w-56 ${className}`}>
      <div
        className={`h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''}`}
      >
        <div className={`absolute inset-0 [backface-visibility:hidden]`}>
          {front}
        </div>
        <div
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          {back}
        </div>
      </div>
    </div>
  );
};
