// Module 5 (Shade Prediction) support — the denim shade catalog.
// Swatches are drawn procedurally (SVG twill + wash effects) so the app ships
// with zero copyrighted imagery. Hex values approximate real indigo behaviour:
// warp-dyed indigo lightens toward the weft (greyish-white) as it abrades.

export type SwatchEffect = "none" | "mottle" | "whiskers" | "spray" | "snow";

export interface SwatchStyle {
  base: string; // dominant warp colour
  weft: string; // thread colour showing through the twill
  intensity: number; // 0–1 overall wash-down / centre fade
  effect: SwatchEffect;
  tint?: string; // optional cast overlay (dirty / grey looks)
}

export interface Shade {
  id: string;
  name: string;
  hint: string; // typical route to reach this shade
  style: SwatchStyle;
}

export const SHADES: Shade[] = [
  {
    id: "raw-indigo",
    name: "Raw / Deep Indigo",
    hint: "Rinse or one-wash only — desize + soft rinse, no abrasion.",
    style: { base: "#151f3d", weft: "#2a3860", intensity: 0.04, effect: "none" },
  },
  {
    id: "dark-blue",
    name: "Dark Blue",
    hint: "Light enzyme 20–30 min, no bleach. Shade loss ~10%.",
    style: { base: "#1c2c52", weft: "#33477c", intensity: 0.12, effect: "none" },
  },
  {
    id: "mid-blue",
    name: "Mid Blue",
    hint: "Enzyme/stone 45–60 min ± touch of bleach. The commercial workhorse.",
    style: { base: "#2b4578", weft: "#5570a5", intensity: 0.32, effect: "none" },
  },
  {
    id: "light-blue",
    name: "Light Blue",
    hint: "Longer enzyme + controlled NaOCl bleach, careful neutralisation.",
    style: { base: "#49688f", weft: "#7d99c0", intensity: 0.5, effect: "none" },
  },
  {
    id: "sky-bleach",
    name: "Bleach / Sky Blue",
    hint: "Strong bleach bath or double bleach; anti-yellowing essential.",
    style: { base: "#7c96b8", weft: "#a9bdd8", intensity: 0.62, effect: "none" },
  },
  {
    id: "ice-wash",
    name: "Ice Wash",
    hint: "Heavy bleach + stones to near-white ground with blue cast.",
    style: { base: "#a9bacf", weft: "#cdd8e6", intensity: 0.78, effect: "mottle" },
  },
  {
    id: "snow-wash",
    name: "Snow Wash (Acid)",
    hint: "Pumice soaked in KMnO4 tumbled dry, then neutralise — strong marble contrast.",
    style: { base: "#8ba0bd", weft: "#e7ecf3", intensity: 0.55, effect: "snow" },
  },
  {
    id: "vintage",
    name: "Vintage",
    hint: "Enzyme/stone + local abrasion, whiskers, PP spray on highs.",
    style: { base: "#3d5a88", weft: "#7590b8", intensity: 0.45, effect: "whiskers" },
  },
  {
    id: "dirty-tint",
    name: "Dirty / Tint",
    hint: "Post-wash direct-dye tint (yellow/brown) with fixing; 'used' cast.",
    style: { base: "#43597c", weft: "#6e7f9a", intensity: 0.35, effect: "none", tint: "#9a7c3f" },
  },
  {
    id: "grey-cast",
    name: "Grey Cast",
    hint: "Sulphur-bottom fabric or grey tint over bleached ground.",
    style: { base: "#565e6c", weft: "#7f8794", intensity: 0.3, effect: "none", tint: "#6b7280" },
  },
  {
    id: "black-wash",
    name: "Black Wash",
    hint: "Enzyme on sulphur/reactive black; anti-redding, low bleach.",
    style: { base: "#22242c", weft: "#3c3f4a", intensity: 0.18, effect: "none" },
  },
  {
    id: "jet-black",
    name: "Jet / Raw Black",
    hint: "Rinse only + black over-tint for depth; resin for coated looks.",
    style: { base: "#121318", weft: "#23252d", intensity: 0.05, effect: "none" },
  },
];

// Vintage-intensity references (drawn on the mid-blue base).
export const VINTAGE_LEVELS: { value: string; label: string; style: SwatchStyle }[] = [
  {
    value: "light",
    label: "Light",
    style: { base: "#2b4578", weft: "#5570a5", intensity: 0.22, effect: "whiskers" },
  },
  {
    value: "medium",
    label: "Medium",
    style: { base: "#2b4578", weft: "#5570a5", intensity: 0.45, effect: "whiskers" },
  },
  {
    value: "heavy",
    label: "Heavy",
    style: { base: "#35507f", weft: "#7d99c0", intensity: 0.68, effect: "whiskers" },
  },
];

// Wash-effect reference cards for the chart page.
export interface WashEffectRef {
  name: string;
  what: string;
  process: string;
  style: SwatchStyle;
}

export const WASH_EFFECTS: WashEffectRef[] = [
  {
    name: "Rinse Wash",
    what: "Removes size and dust only; shade nearly untouched.",
    process: "Desize 55–60°C → rinse → softener. 15–20 min total wet time.",
    style: { base: "#1c2c52", weft: "#2f4270", intensity: 0.06, effect: "none" },
  },
  {
    name: "Enzyme Wash",
    what: "Cellulase eats surface fibre — soft hand, even abrasion, gentle lightening.",
    process: "Acid cellulase 1–2% @ 45–55°C, pH 4.5–5.5, 30–60 min.",
    style: { base: "#2b4578", weft: "#5570a5", intensity: 0.3, effect: "none" },
  },
  {
    name: "Stone Wash",
    what: "Pumice abrasion — stronger highs/lows contrast than enzyme alone.",
    process: "Pumice 0.5–1:1 w/w + enzyme, 45–90 min; watch hem/waistband damage.",
    style: { base: "#31517e", weft: "#6d88ae", intensity: 0.4, effect: "mottle" },
  },
  {
    name: "Bleach Wash",
    what: "NaOCl strips indigo overall — flat, lighter ground.",
    process: "NaOCl 3–10 g/L @ 40–50°C, 10–20 min → antichlor (metabisulphite) → neutralise.",
    style: { base: "#6d89ad", weft: "#9db3d0", intensity: 0.55, effect: "none" },
  },
  {
    name: "Ozone Fade",
    what: "Gas-phase bleaching — even vintage cast with almost no water.",
    process: "Damp garments, O3 cabinet 15–30 min; strict room sealing + destructor.",
    style: { base: "#54719b", weft: "#8ea7c8", intensity: 0.48, effect: "none" },
  },
  {
    name: "PP Spray / Local Bleach",
    what: "Potassium permanganate sprayed on highs — bright localised burn-out.",
    process: "KMnO4 2–5% spray on mannequin → dry → neutralise (metabisulphite bath).",
    style: { base: "#3d5a88", weft: "#7590b8", intensity: 0.35, effect: "spray" },
  },
  {
    name: "Whiskers / Laser",
    what: "Crease-line fading at hips/thighs — hand-sand, resin-set, or laser-etched.",
    process: "Laser 60–100 DPI greyscale mask, or emery + PP touch; resin cure 150°C.",
    style: { base: "#35507f", weft: "#7590b8", intensity: 0.3, effect: "whiskers" },
  },
  {
    name: "Snow / Acid Wash",
    what: "Dry pumice soaked in bleach/PP — high-contrast random marble.",
    process: "Soaked stones tumbled with dry garments 20–40 min → neutralise → rinse.",
    style: { base: "#8ba0bd", weft: "#e7ecf3", intensity: 0.5, effect: "snow" },
  },
];

/** Loose keyword match from a free-text/predicted shade to a chart entry. */
export function matchShade(text: string | undefined | null): Shade | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  const scored = SHADES.map((s) => {
    const words = s.name.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    const hits = words.filter((w) => t.includes(w)).length;
    return { s, hits, words: words.length };
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || a.words - b.words);
  return scored[0]?.s;
}
