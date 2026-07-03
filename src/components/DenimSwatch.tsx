"use client";

import { useId } from "react";
import type { SwatchStyle } from "@/lib/shades";

/**
 * Procedurally-drawn denim swatch: twill weave lines + fabric noise +
 * wash-down effects (centre fade, stone mottle, whiskers, PP spray, snow).
 * No external images — everything is generated SVG.
 */
export default function DenimSwatch({
  style,
  width = 120,
  height = 90,
  rounded = 10,
}: {
  style: SwatchStyle;
  width?: number | string;
  height?: number | string;
  rounded?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const twillId = `twill-${uid}`;
  const noiseId = `noise-${uid}`;
  const mottleId = `mottle-${uid}`;
  const fadeId = `fade-${uid}`;
  const sprayId = `spray-${uid}`;
  const clipId = `clip-${uid}`;

  const { base, weft, intensity, effect, tint } = style;

  return (
    <svg
      viewBox="0 0 120 90"
      width={width}
      height={height}
      preserveAspectRatio="none"
      role="img"
      style={{ display: "block" }}
    >
      <defs>
        {/* Diagonal twill weave */}
        <pattern
          id={twillId}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(63)"
        >
          <rect width="5" height="5" fill={base} />
          <line x1="0" y1="0" x2="0" y2="5" stroke={weft} strokeWidth="1.6" opacity="0.55" />
          <line x1="2.5" y1="0" x2="2.5" y2="5" stroke="#0b0e18" strokeWidth="0.7" opacity="0.25" />
        </pattern>

        {/* Fine yarn noise */}
        <filter id={noiseId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0" />
        </filter>

        {/* Large-patch mottle for stone / snow */}
        <filter id={mottleId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="m" />
          <feColorMatrix in="m" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 0.25 0.55 0.9" />
          </feComponentTransfer>
        </filter>

        {/* Centre wash-down */}
        <radialGradient id={fadeId} cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor={weft} stopOpacity={Math.min(1, intensity * 1.15)} />
          <stop offset="55%" stopColor={weft} stopOpacity={intensity * 0.55} />
          <stop offset="100%" stopColor={weft} stopOpacity="0" />
        </radialGradient>

        {/* Tight PP-spray burst */}
        <radialGradient id={sprayId} cx="50%" cy="45%" r="42%">
          <stop offset="0%" stopColor="#f2f5f9" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#dbe3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#dbe3ee" stopOpacity="0" />
        </radialGradient>

        <clipPath id={clipId}>
          <rect width="120" height="90" rx={rounded} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect width="120" height="90" fill={`url(#${twillId})`} />
        <rect width="120" height="90" filter={`url(#${noiseId})`} opacity="0.16" />
        <rect width="120" height="90" fill={`url(#${fadeId})`} />

        {(effect === "mottle" || effect === "snow") && (
          <rect
            width="120"
            height="90"
            filter={`url(#${mottleId})`}
            opacity={effect === "snow" ? 0.75 : 0.4}
          />
        )}

        {effect === "whiskers" && (
          <g stroke="#e8edf4" strokeLinecap="round" fill="none">
            <path d="M8 36 Q 60 30, 112 37" strokeWidth="2.4" opacity="0.5" />
            <path d="M6 46 Q 60 41, 114 46" strokeWidth="3.2" opacity="0.6" />
            <path d="M10 56 Q 60 52, 110 57" strokeWidth="2.6" opacity="0.5" />
            <path d="M14 65 Q 60 62, 106 66" strokeWidth="1.8" opacity="0.35" />
          </g>
        )}

        {effect === "spray" && <rect width="120" height="90" fill={`url(#${sprayId})`} />}

        {tint && <rect width="120" height="90" fill={tint} opacity="0.2" />}

        {/* Subtle vignette so cards read as fabric, not flat colour */}
        <rect width="120" height="90" fill="#0b0e18" opacity="0.06" />
      </g>

      <rect
        width="119"
        height="89"
        x="0.5"
        y="0.5"
        rx={rounded}
        fill="none"
        stroke="#0b0e18"
        strokeOpacity="0.18"
      />
    </svg>
  );
}
