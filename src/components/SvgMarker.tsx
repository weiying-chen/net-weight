import type { ComponentType, SVGProps, ReactNode } from 'react';
import { Tooltip } from '@/components/Tooltip';

export type SvgMarkerProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  angle: number;
  radiusPct: number;
  size: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick?: () => void;
  ringProgress?: number;
  tooltip?: ReactNode;
};

function darkenHex(hex: string, amount = 0.2): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const num = parseInt(hex.replace('#', ''), 16);
  const r = clamp(((num >> 16) & 255) * (1 - amount));
  const g = clamp(((num >> 8) & 255) * (1 - amount));
  const b = clamp((num & 255) * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function SvgMarker({
  Icon,
  color,
  angle,
  radiusPct,
  size,
  isActive,
  onHover,
  onLeave,
  onClick,
  ringProgress = 0,
  tooltip,
}: SvgMarkerProps) {
  const theta = (angle * Math.PI) / 180;
  const x = 50 + Math.sin(theta) * radiusPct;
  const y = 50 - Math.cos(theta) * radiusPct;

  const ringThickness = 3;
  const ringOffset = 4;
  const totalSize = size + 2 * (ringOffset + ringThickness);
  const r = totalSize / 2 - ringThickness / 2;

  const circumference = 2 * Math.PI * r;
  const dashLength = Math.max(0, Math.min(1, ringProgress)) * circumference;

  const strokeColor = darkenHex(color, 0.25);

  const markerContent = (
    <div
      className="absolute flex items-center justify-center"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: totalSize,
        height: totalSize,
        cursor: 'pointer',
      }}
    >
      {/* Ring always rendered; opacity animated */}
      <svg
        width={totalSize}
        height={totalSize}
        className="absolute transition-opacity duration-200 ease-out"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: isActive ? 1 : 0,
        }}
      >
        <circle
          cx={totalSize / 2}
          cy={totalSize / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--subtle))"
          strokeWidth={ringThickness}
        />
        <circle
          cx={totalSize / 2}
          cy={totalSize / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={ringThickness}
          strokeDasharray={`${dashLength} ${circumference}`}
          transform={`rotate(-90 ${totalSize / 2} ${totalSize / 2})`}
          strokeLinecap="round"
        />
      </svg>

      {/* Marker icon */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: size, height: size, backgroundColor: color, zIndex: 1 }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );

  return tooltip ? (
    <Tooltip content={tooltip} transient>
      {markerContent}
    </Tooltip>
  ) : (
    markerContent
  );
}
