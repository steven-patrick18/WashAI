import type { ChemForm } from "@/lib/chemicals";

/**
 * Procedural illustration of a chemical's physical form — liquid in a jar,
 * powder pile, flakes, crystals, pearls, stones, emulsion, test strip.
 * Deterministic (no randomness) so it renders identically on server and
 * client. `uid` must be unique per instance for SVG defs.
 */
export default function ChemVisual({
  uid,
  form,
  color,
  width = "100%",
  height = 96,
}: {
  uid: string;
  form: ChemForm;
  color: string;
  width?: number | string;
  height?: number | string;
}) {
  const liquidGrad = `chem-lg-${uid}`;
  const clip = `chem-clip-${uid}`;

  // Deterministic pseudo-random from index — stable across renders.
  const pr = (i: number, salt: number) =>
    (Math.abs(Math.sin(i * 12.9898 + salt * 78.233)) * 43758.5453) % 1;

  const isContainer = form === "liquid" || form === "emulsion";

  return (
    <svg
      viewBox="0 0 120 96"
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={liquidGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.75" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <clipPath id={clip}>
          <path d="M42 30 h36 v42 a6 6 0 0 1 -6 6 h-24 a6 6 0 0 1 -6 -6 z" />
        </clipPath>
      </defs>

      {/* Lab bench */}
      <rect width="120" height="96" fill="#f4f5f7" rx="10" />
      <ellipse cx="60" cy="82" rx="38" ry="6" fill="#0b0e18" opacity="0.07" />

      {isContainer && (
        <g>
          {/* Jar */}
          <path
            d="M42 30 h36 v42 a6 6 0 0 1 -6 6 h-24 a6 6 0 0 1 -6 -6 z"
            fill="#ffffff"
            stroke="#c7ccd6"
            strokeWidth="1.5"
          />
          {/* Liquid */}
          <g clipPath={`url(#${clip})`}>
            <rect x="42" y="40" width="36" height="40" fill={`url(#${liquidGrad})`} />
            {form === "emulsion" && (
              <rect x="42" y="40" width="36" height="40" fill="#ffffff" opacity="0.55" />
            )}
            <ellipse cx="60" cy="40" rx="18" ry="2.6" fill="#ffffff" opacity="0.5" />
          </g>
          {/* Neck + cap */}
          <rect x="48" y="22" width="24" height="8" fill="#ffffff" stroke="#c7ccd6" strokeWidth="1.5" />
          <rect x="46" y="16" width="28" height="7" rx="2" fill="#39415a" />
          {/* Shine */}
          <rect x="46" y="34" width="3.5" height="34" rx="2" fill="#ffffff" opacity="0.55" />
        </g>
      )}

      {(form === "powder" || form === "granules") && (
        <g>
          <path d="M22 76 Q60 34 98 76 Z" fill={color} stroke="#0b0e18" strokeOpacity="0.12" />
          {Array.from({ length: form === "granules" ? 26 : 40 }).map((_, i) => {
            const x = 28 + pr(i, 1) * 64;
            const spread = 1 - Math.abs(x - 60) / 38; // height of pile at x
            const y = 74 - pr(i, 2) * 34 * Math.max(0.15, spread);
            const r = form === "granules" ? 1.6 + pr(i, 3) * 1.4 : 0.8 + pr(i, 3) * 0.8;
            return (
              <circle key={i} cx={x} cy={y} r={r} fill="#0b0e18" opacity={0.1 + pr(i, 4) * 0.12} />
            );
          })}
        </g>
      )}

      {form === "flakes" &&
        Array.from({ length: 16 }).map((_, i) => {
          const x = 24 + pr(i, 5) * 72;
          const y = 40 + pr(i, 6) * 34;
          const rot = pr(i, 7) * 80 - 40;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={9 + pr(i, 8) * 6}
              height={5 + pr(i, 9) * 3}
              rx="1.6"
              fill={color}
              stroke="#0b0e18"
              strokeOpacity="0.15"
              transform={`rotate(${rot} ${x} ${y})`}
            />
          );
        })}

      {form === "pearls" &&
        Array.from({ length: 18 }).map((_, i) => {
          const x = 28 + pr(i, 10) * 64;
          const y = 46 + pr(i, 11) * 28;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill={color} stroke="#0b0e18" strokeOpacity="0.15" />
              <circle cx={x - 1.2} cy={y - 1.2} r={1.1} fill="#ffffff" opacity="0.8" />
            </g>
          );
        })}

      {form === "crystals" &&
        Array.from({ length: 14 }).map((_, i) => {
          const x = 26 + pr(i, 12) * 68;
          const y = 44 + pr(i, 13) * 30;
          const s = 4 + pr(i, 14) * 5;
          const rot = pr(i, 15) * 90;
          return (
            <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
              <polygon
                points={`${x},${y - s} ${x + s * 0.5},${y} ${x},${y + s} ${x - s * 0.5},${y}`}
                fill={color}
                stroke="#b064c9"
                strokeOpacity="0.6"
                strokeWidth="0.7"
              />
              <line x1={x} y1={y - s * 0.6} x2={x} y2={y + s * 0.6} stroke="#d29ae2" strokeWidth="0.6" opacity="0.7" />
            </g>
          );
        })}

      {form === "stones" && (
        <g>
          {[
            { cx: 44, cy: 62, rx: 17, ry: 13 },
            { cx: 74, cy: 66, rx: 14, ry: 11 },
            { cx: 60, cy: 48, rx: 12, ry: 9 },
          ].map((s, i) => (
            <g key={i}>
              <ellipse {...s} fill={color} stroke="#0b0e18" strokeOpacity="0.15" />
              {Array.from({ length: 9 }).map((_, j) => {
                const a = pr(i * 10 + j, 16) * Math.PI * 2;
                const rr = pr(i * 10 + j, 17);
                const hx = s.cx + Math.cos(a) * s.rx * 0.7 * rr;
                const hy = s.cy + Math.sin(a) * s.ry * 0.7 * rr;
                return (
                  <circle key={j} cx={hx} cy={hy} r={0.9 + pr(j, 18) * 1.2} fill="#0b0e18" opacity="0.22" />
                );
              })}
            </g>
          ))}
        </g>
      )}

      {form === "strip" && (
        <g>
          {/* colour chart */}
          {["#d94f2b", "#e8a02c", "#d8c93a", "#7fb54a", "#3a7fb5", "#5a4ab5"].map((c, i) => (
            <rect key={i} x={24 + i * 12.5} y={26} width="10.5" height="10.5" rx="2" fill={c} />
          ))}
          {/* the strip itself */}
          <rect x="50" y="44" width="14" height="34" rx="2" fill="#fdf9ee" stroke="#c7ccd6" />
          <rect x="50" y="64" width="14" height="14" rx="2" fill={color} />
        </g>
      )}
    </svg>
  );
}
