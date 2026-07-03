"use client";

import { SHADES, VINTAGE_LEVELS } from "@/lib/shades";
import DenimSwatch from "./DenimSwatch";

/** Grid of denim shades. Pass onSelect to make it a picker. */
export default function ShadeChart({
  selected,
  onSelect,
  compact = false,
  showHints = false,
}: {
  selected?: string;
  onSelect?: (name: string) => void;
  compact?: boolean;
  showHints?: boolean;
}) {
  const sel = selected?.toLowerCase() ?? "";
  return (
    <div className={compact ? "swatch-grid compact" : "swatch-grid"}>
      {SHADES.map((s) => {
        const isSel = sel !== "" && sel === s.name.toLowerCase();
        return (
          <div
            key={s.id}
            className={`swatch-card${isSel ? " selected" : ""}${onSelect ? " clickable" : ""}`}
            onClick={onSelect ? () => onSelect(s.name) : undefined}
            title={s.hint}
          >
            <DenimSwatch style={s.style} width="100%" height={compact ? 44 : 84} />
            <div className="swatch-name">{s.name}</div>
            {showHints && <div className="swatch-hint">{s.hint}</div>}
          </div>
        );
      })}
    </div>
  );
}

/** Light / medium / heavy vintage intensity reference, optionally a picker. */
export function VintageRow({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <div className="vintage-row">
      {VINTAGE_LEVELS.map((v) => (
        <div
          key={v.value}
          className={`swatch-card${selected === v.value ? " selected" : ""}${onSelect ? " clickable" : ""}`}
          onClick={onSelect ? () => onSelect(v.value) : undefined}
        >
          <DenimSwatch style={v.style} width="100%" height={44} />
          <div className="swatch-name">{v.label}</div>
        </div>
      ))}
    </div>
  );
}
