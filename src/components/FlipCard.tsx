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
        className={`h-full w-full transition-all duration-500 [transform-style:preserve-3d]`}
        style={{
          transform: flipped ? 'rotateY(180deg)' : '', // Flip rotation based on the state
        }}
      >
        {/* Front side */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden]`}
          style={{
            backfaceVisibility: flipped ? 'hidden' : 'visible', // Hide front side when flipped
          }}
        >
          {front}
        </div>

        {/* Back side */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden]`}
          style={{
            transform: 'rotateY(180deg)', // Rotate the back side when flipped
            backfaceVisibility: flipped ? 'visible' : 'hidden', // Show the back when flipped
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
};
