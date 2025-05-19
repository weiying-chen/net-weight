import React from 'react';

export type SegmentIconProps = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  angle: number;
  radiusPct: number;
  size: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
};

export const SegmentIcon: React.FC<SegmentIconProps> = ({
  Icon,
  color,
  angle,
  radiusPct,
  size,
  isActive,
  onHover,
  onLeave,
}) => {
  const θ = (angle * Math.PI) / 180;
  const x = 50 + Math.sin(θ) * radiusPct;
  const y = 50 - Math.cos(θ) * radiusPct;

  const outlineStyle: React.CSSProperties = isActive
    ? {
        border: `3px solid ${color}`, // inner ring matching segment color
        outline: '3px solid white', // outer white ring
        outlineOffset: '4px', // gap between colored and white ring
      }
    : {};

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="absolute flex items-center justify-center rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        backgroundColor: color,
        cursor: 'pointer',
        boxSizing: 'content-box', // keeps border/outline outside of the size
        ...outlineStyle,
      }}
    >
      <Icon className="h-6 w-6 text-white" />
    </div>
  );
};
