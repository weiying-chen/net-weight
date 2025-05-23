import { getArcPath, getSegmentDegrees } from '@/utils';
import React from 'react';

export type SvgRingProps = {
  size: number;
  stroke: number;
  colors: readonly string[];
  spotlightIndex: number | null;
  fadePct?: number; // fraction of slice used for fade edges (0–0.5)
};

export const SvgRing: React.FC<SvgRingProps> = ({
  size,
  stroke,
  colors,
  spotlightIndex,
  fadePct = 0.2,
}) => {
  const count = colors.length;
  const slice = 360 / count;

  // Center with padding baked in
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - stroke / 2;

  const fadeStart = fadePct * 100;
  const fadeEnd = 100 - fadeStart;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
      shapeRendering="geometricPrecision"
    >
      <defs>
        {colors.map((col, i) => {
          const next = colors[(i + 1) % count];

          // full-segment path
          const { startDeg: fullStart, endDeg: fullEnd } = getSegmentDegrees(
            i,
            slice,
            false,
          );
          const full = getArcPath(cx, cy, r, fullStart, fullEnd);

          // fade-edge path
          const { startDeg: fadeStartDeg, endDeg: fadeEndDeg } =
            getSegmentDegrees(i, slice, true);
          const fade = getArcPath(cx, cy, r, fadeStartDeg, fadeEndDeg);

          return (
            <React.Fragment key={i}>
              {/* solid-to-solid gradient */}
              <linearGradient
                id={`grad${i}`}
                gradientUnits="userSpaceOnUse"
                x1={full.x1}
                y1={full.y1}
                x2={full.x2}
                y2={full.y2}
              >
                <stop offset="0%" stopColor={col} />
                <stop offset="100%" stopColor={next} />
              </linearGradient>

              {/* fade edges in/out using stopOpacity */}
              <linearGradient
                id={`fade${i}`}
                gradientUnits="userSpaceOnUse"
                x1={fade.x1}
                y1={fade.y1}
                x2={fade.x2}
                y2={fade.y2}
              >
                <stop offset="0%" stopColor={col} stopOpacity="0" />
                <stop
                  offset={`${fadeStart}%`}
                  stopColor={col}
                  stopOpacity="1"
                />
                <stop offset={`${fadeEnd}%`} stopColor={col} stopOpacity="1" />
                <stop offset="100%" stopColor={col} stopOpacity="0" />
              </linearGradient>
            </React.Fragment>
          );
        })}
      </defs>

      {colors.map((_, i) => {
        const isSpot = spotlightIndex === i;
        const { startDeg, endDeg } = getSegmentDegrees(i, slice, isSpot);
        const { d } = getArcPath(cx, cy, r, startDeg, endDeg);

        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={`url(#${isSpot ? 'fade' : 'grad'}${i})`}
            strokeWidth={stroke}
            strokeOpacity={spotlightIndex === null || isSpot ? 1 : 0}
            strokeLinecap="butt"
            style={{ transition: 'stroke-opacity 300ms ease-in-out' }}
          />
        );
      })}
    </svg>
  );
};
