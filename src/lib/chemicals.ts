// Module 7 groundwork — the laundry chemical & materials identification guide.
// Written for first-time operators: how to recognise each chemical on the
// shelf (form, colour, smell), what it does, typical dosing, and its dangers.

export type ChemForm =
  | "liquid"
  | "emulsion"
  | "powder"
  | "granules"
  | "flakes"
  | "pearls"
  | "crystals"
  | "stones"
  | "strip";

export type Danger = "LOW" | "CAUTION" | "HIGH";

export interface Chemical {
  id: string;
  name: string;
  aka: string; // trade/common names heard in Indian laundries
  form: ChemForm;
  color: string; // swatch colour
  looks: string; // physical description
  smell: string;
  identify: string[]; // on-the-shelf identification cues
  usedFor: string;
  dosage: string;
  danger: Danger;
  safety: string[];
}

export const CHEMICALS: Chemical[] = [
  {
    id: "amylase",
    name: "Desizing Enzyme (Alpha Amylase)",
    aka: "Desize enzyme · Aquazym / Lucozyme types",
    form: "liquid",
    color: "#b98a4a",
    looks: "Amber-brown liquid (sometimes beige powder)",
    smell: "Mild, slightly fermented / yeasty",
    identify: [
      "Amber liquid in drums marked 'amylase' or 'desize'",
      "Feels slightly slippery, not soapy",
      "No sharp or chlorine smell — if it stings the nose, it's NOT this",
    ],
    usedFor: "First stage of almost every wash — eats the starch size off the warp so later chemicals work evenly.",
    dosage: "0.5–2 g/L @ 55–70°C, pH 6–7, 15–20 min",
    danger: "LOW",
    safety: ["Can sensitise skin with repeated contact — wear gloves.", "Enzyme dust/aerosol should not be inhaled."],
  },
  {
    id: "cellulase",
    name: "Stone-wash Enzyme (Cellulase)",
    aka: "Acid / neutral cellulase · bio-polish enzyme",
    form: "granules",
    color: "#d3bd90",
    looks: "Beige-tan granules or amber liquid",
    smell: "Faint, earthy",
    identify: [
      "Beige free-flowing granules — like coarse besan",
      "Bag/drum says 'cellulase', 'bio-stone' or 'denim wash enzyme'",
      "Acid type works at pH 4.5–5.5; neutral type at pH 6–7 — check the label",
    ],
    usedFor: "The vintage-maker: eats surface cellulose so indigo highs/lows appear. Replaces most pumice stone.",
    dosage: "1–2% owg (or 1–2 g/L) @ 45–55°C, 30–60 min at its correct pH",
    danger: "LOW",
    safety: ["Never above 55–60°C — the enzyme dies (batch comes out flat).", "Avoid breathing granule dust; wear a mask when scooping."],
  },
  {
    id: "hypo",
    name: "Sodium Hypochlorite (Bleach)",
    aka: "Hypo · liquid bleach · NaOCl",
    form: "liquid",
    color: "#dde8b0",
    looks: "Pale yellow-green watery liquid",
    smell: "STRONG chlorine — swimming-pool smell",
    identify: [
      "The chlorine smell is unmistakable even from a closed drum",
      "Pale greenish-yellow tint in a white bucket",
      "A drop bleaches a scrap of denim white within minutes",
    ],
    usedFor: "Lifting the ground shade — dark to mid/light blue. The classic bleach bath.",
    dosage: "3–10 g/L @ 40–50°C, pH 10–11 (buffer with soda ash), 10–20 min — ALWAYS followed by antichlor",
    danger: "HIGH",
    safety: [
      "NEVER let it touch any acid — releases chlorine gas that can kill.",
      "Pre-dilute in a bucket of water; never pour concentrate onto garments.",
      "Gloves + goggles + apron + running exhaust fan, always.",
    ],
  },
  {
    id: "kmno4",
    name: "Potassium Permanganate (PP)",
    aka: "PP · permanganate · KMnO4",
    form: "crystals",
    color: "#2b1038",
    looks: "Almost-black crystals with a purple metallic glint; dissolves bright purple-pink",
    smell: "Odourless",
    identify: [
      "Tiny dark needle-like crystals that shine purple when tilted in light",
      "One crystal in a glass of water blooms bright violet-pink",
      "Stains fingers and surfaces BROWN that won't wash off — telltale sign",
    ],
    usedFor: "PP spray for local bright highlights; PP-soaked pumice for snow wash.",
    dosage: "Spray: 2–5% solution on highs → dry → neutralise. Snow wash: stones soaked in 3–8% solution",
    danger: "HIGH",
    safety: [
      "Strong oxidiser — keep away from glycerine, softeners, solvents (fire risk).",
      "Spray only in a ventilated booth with water curtain; wear respirator.",
      "Every PP touch MUST be neutralised with metabisulphite or garments yellow/brown later.",
    ],
  },
  {
    id: "metabisulphite",
    name: "Sodium Metabisulphite",
    aka: "Meta · antichlor · neutraliser",
    form: "powder",
    color: "#f1f1ec",
    looks: "White crystalline powder",
    smell: "Sharp sulphur sting (like struck matches) when wet",
    identify: [
      "White powder whose bag says 'metabisulphite' / 'SMBS'",
      "Wet a pinch — the sulphur smell is immediate and sharp",
      "Kept near the bleach/PP station (it's their 'off switch')",
    ],
    usedFor: "Neutralising after hypo bleach and PP — stops the shade from moving and prevents yellowing/strength loss.",
    dosage: "2–5 g/L @ 40°C, pH 6–6.5, 10 min — verify with chlorine test paper",
    danger: "CAUTION",
    safety: ["Fumes sting eyes/nose in acid bath — ventilate.", "Asthmatics should not handle it — sulphite sensitivity is real."],
  },
  {
    id: "acetic",
    name: "Acetic Acid",
    aka: "AC acid · vinegar acid (industrial 80–99%)",
    form: "liquid",
    color: "#eef2f2",
    looks: "Clear, water-like liquid",
    smell: "STRONG vinegar — sharp enough to make eyes water at full strength",
    identify: [
      "Clear liquid + overwhelming vinegar smell = acetic",
      "Stored in plastic (never metal) carboys",
      "pH strip dipped in a drop goes deep red/orange",
    ],
    usedFor: "Setting bath pH for enzyme (4.5–5.5), softener (5.5), and general neutralising.",
    dosage: "0.5–2 g/L 'to pH' — always dose gradually and re-check with a strip",
    danger: "CAUTION",
    safety: [
      "Concentrated acid burns skin and eyes — gloves + goggles when dosing.",
      "Add ACID TO WATER, never water to acid.",
      "Keep FAR from hypochlorite — acid + hypo = chlorine gas.",
    ],
  },
  {
    id: "caustic",
    name: "Caustic Soda (Sodium Hydroxide)",
    aka: "Caustic · lye · NaOH",
    form: "pearls",
    color: "#f7f7f4",
    looks: "White pearls/flakes that get HOT and slippery when wet",
    smell: "Odourless — but wet fingers feel soapy/burning",
    identify: [
      "Small white pearls that heat the water noticeably when dissolved",
      "Solution feels slippery (it is dissolving your skin — wash immediately)",
      "Bag marked 'caustic soda pearls 99%'",
    ],
    usedFor: "Heavy-duty scouring, sulphur-black clean-up, some bleach boosting. NOT an everyday garment-wash chemical.",
    dosage: "1–3 g/L only where the recipe explicitly calls for it",
    danger: "HIGH",
    safety: [
      "Most dangerous chemical in the store for skin/eyes — face shield when dissolving.",
      "Dissolving generates heat — add pearls SLOWLY to cold water, stirring.",
      "Never confuse with soda ash: caustic heats water, soda ash doesn't.",
    ],
  },
  {
    id: "sodaash",
    name: "Soda Ash (Sodium Carbonate)",
    aka: "Washing soda · soda ash light",
    form: "powder",
    color: "#f5f4ef",
    looks: "Fine white powder, free-flowing",
    smell: "Odourless",
    identify: [
      "White powder that does NOT heat water when dissolved (unlike caustic)",
      "Solution feels mildly soapy; pH strip shows ~11 (blue-green)",
      "Cheapest, biggest bags in the chemical store",
    ],
    usedFor: "Buffering bleach baths (pH 10–11), dye fixation assistance, general alkali.",
    dosage: "0.5–2 g/L as buffer",
    danger: "LOW",
    safety: ["Mild irritant — rinse off skin; avoid breathing dust."],
  },
  {
    id: "softener",
    name: "Cationic Softener",
    aka: "Softener flakes · cold-water softener",
    form: "flakes",
    color: "#f3ecd8",
    looks: "Waxy off-white / pale yellow flakes (also sold as paste)",
    smell: "Faintly waxy, sometimes lightly perfumed",
    identify: [
      "Waxy flakes that feel greasy between fingers",
      "Melt in hot water into a milky solution",
      "Bag says 'cationic softener flakes'",
    ],
    usedFor: "The final soft hand-feel the buyer approved — last wet stage of nearly every recipe.",
    dosage: "1–3 g/L @ 40°C, pH 5–5.5 (acetic), 10–15 min — pre-dissolve in hot water first",
    danger: "LOW",
    safety: ["Cationic + anionic chemicals cancel out — never mix into the same bath as anionic anti-stain."],
  },
  {
    id: "silicone",
    name: "Silicone Softener (Micro-emulsion)",
    aka: "Silicone · micro silicone · slick softener",
    form: "emulsion",
    color: "#f8f8f3",
    looks: "Milky-white liquid like thin milk",
    smell: "Almost none",
    identify: [
      "Milky liquid that leaves a distinctly SLIPPERY film rubbed between fingers",
      "A drop in water blooms white without fully dissolving",
      "Drum marked 'amino silicone' / 'micro emulsion'",
    ],
    usedFor: "Premium slick-soft surface feel, often combined with flake softener for top-tier hand feel.",
    dosage: "1–2 g/L @ 40°C, pH 5–6, 10–15 min",
    danger: "LOW",
    safety: ["Spilled silicone makes floors dangerously slippery — sand and clean immediately.", "Silicone spots on garments are nearly impossible to remove — dose pre-diluted."],
  },
  {
    id: "antistain",
    name: "Anti-backstaining Agent",
    aka: "Anti-stain · anti-redeposition · ABS",
    form: "liquid",
    color: "#efe9c8",
    looks: "Pale yellowish, slightly viscous liquid",
    smell: "Mild soapy",
    identify: [
      "Drum labelled 'anti back staining' — usually near the enzymes",
      "Slightly thicker than water; foams gently when shaken",
    ],
    usedFor: "Stops loosened indigo from re-depositing on pocket bags and weft — the difference between clean and 'dirty' pockets.",
    dosage: "1–2 g/L in desize AND enzyme baths",
    danger: "LOW",
    safety: ["None significant — standard gloves."],
  },
  {
    id: "resin",
    name: "Resin (DMDHEU)",
    aka: "3D resin · wrinkle resin · crease-set",
    form: "liquid",
    color: "#ece5c9",
    looks: "Clear to pale-yellow liquid",
    smell: "Faint formaldehyde prick (sharp, medicinal)",
    identify: [
      "The only chemical with that slight formaldehyde sting",
      "Used at the spray/curing station, not the washer",
      "Drum marked 'low-formaldehyde resin' / 'DMDHEU'",
    ],
    usedFor: "Setting 3D whiskers, crease lines and coated looks — sprayed/dipped then oven-cured.",
    dosage: "Dip 60–120 g/L or spray blend → cure 140–160°C for 15–25 min",
    danger: "CAUTION",
    safety: [
      "Formaldehyde release — respirator + ventilation at spray/cure.",
      "Buyers test formaldehyde limits (e.g. <75 ppm) — never overdose.",
      "Over-curing makes fabric tear like paper — follow cure temp/time exactly.",
    ],
  },
  {
    id: "peroxide",
    name: "Hydrogen Peroxide",
    aka: "Peroxide · H2O2 (35–50%)",
    form: "liquid",
    color: "#eef4f6",
    looks: "Clear water-like liquid in vented drums",
    smell: "Faintly sharp, 'clean' smell",
    identify: [
      "Vented cap on the drum (it slowly releases oxygen) — key clue",
      "A drop on a cut potato fizzes white foam",
      "Cool to touch; bottle often dark-coloured",
    ],
    usedFor: "Oxygen bleaching (gentler alternative to hypo), sulphur-black brightening, some neutralising.",
    dosage: "2–6 g/L @ 60–80°C, pH 10.5–11, 20–40 min",
    danger: "CAUTION",
    safety: ["Concentrated H2O2 whitens/burns skin on contact — rinse immediately.", "Never seal in an airtight container — pressure builds."],
  },
  {
    id: "tint",
    name: "Direct Dye Tint",
    aka: "Tint · dirty dye · overdye powder",
    form: "powder",
    color: "#6b5a2e",
    looks: "Intense coloured powder (yellow/brown/blue/grey) — tiny amount stains everything",
    smell: "Odourless",
    identify: [
      "Small tubs of violently coloured powder kept away from everything else",
      "A few grains tint a full bucket of water",
      "Labelled 'direct yellow/brown/blue …'",
    ],
    usedFor: "Dirty/vintage casts and fashion tints applied after washing, then fixed.",
    dosage: "0.001–0.5% owg @ 40–60°C with salt, then cationic fixing agent",
    danger: "LOW",
    safety: ["Wear gloves — stains skin for days.", "Weigh on paper on the balance; airborne dye powder contaminates other batches."],
  },
  {
    id: "pumice",
    name: "Pumice Stones",
    aka: "Wash stones · volcanic stone",
    form: "stones",
    color: "#a9a59b",
    looks: "Light grey porous stones, float or barely sink; full of holes",
    smell: "None (dusty)",
    identify: [
      "So light they feel fake — a fist-sized stone weighs almost nothing",
      "Surface full of gas holes like a sponge",
      "Sizes graded 2–4 cm / 4–6 cm",
    ],
    usedFor: "Mechanical abrasion in classic stone wash and PP-soaked snow wash.",
    dosage: "0.5–1:1 stone-to-garment weight, 45–90 min; remove every stone before drying",
    danger: "CAUTION",
    safety: [
      "Stones left in pockets/legs destroy dryers — shake out every garment.",
      "Stone dust silts drains — use the sieve trap when draining.",
      "Heavy bags — lift with your legs, two people per bag.",
    ],
  },
  {
    id: "phstrip",
    name: "pH Test Strips",
    aka: "pH paper · universal indicator strips",
    form: "strip",
    color: "#e8b23a",
    looks: "Small paper strips that change colour; box has a colour chart",
    smell: "None",
    identify: [
      "Flat plastic box/roll with rainbow colour chart printed on it",
      "Buy BOTH universal (0–14) and narrow-range 3.8–5.5 (for enzyme baths)",
    ],
    usedFor: "THE most important checkpoint tool — verifying bath pH before enzyme, softener, neutralise stages.",
    dosage: "Dip 2 seconds, shake once, compare to the chart after 15 seconds",
    danger: "LOW",
    safety: ["Keep the box dry and closed — humid strips read wrong."],
  },
];

// Physical materials & lab tools every checkpoint depends on.
export interface LabTool {
  icon: string;
  name: string;
  why: string;
  how: string;
  buy: string;
}

export const LAB_TOOLS: LabTool[] = [
  {
    icon: "🧪",
    name: "Chlorine Test Paper (KI-starch)",
    why: "Proves the antichlor stage actually worked — residual chlorine keeps eating shade for days.",
    how: "Touch paper to bath water: turns blue-black = chlorine still present, stays white = neutralised.",
    buy: "Lab supply stores / Amazon; keep at the neutralise station.",
  },
  {
    icon: "💡",
    name: "D65 Colour-Matching Light Box",
    why: "Shade approval is meaningless under factory tube lights — buyers assess in D65 daylight standard.",
    how: "Dry the sample panel fully, place beside the approved standard, judge at 45° under D65 only.",
    buy: "Verivide / TILO / local equivalents, ₹40,000–1.5 lakh. The single most important QC purchase.",
  },
  {
    icon: "⚖️",
    name: "Digital Balance (0.1 g) + Measuring Jugs",
    why: "Repeatable washing IS accurate weighing — 'one mug of enzyme' is how batches differ.",
    how: "Weigh every chemical per the recipe card; log actual grams on the batch sheet.",
    buy: "5 kg × 0.1 g balance ₹2,000–5,000; graduated jugs 1 L / 5 L.",
  },
  {
    icon: "✂️",
    name: "GSM Cutter + Sample Balance",
    why: "Verifies fabric weight on arrival and after wash (weight loss = abrasion amount).",
    how: "Punch a 100 cm² circle, weigh in grams × 100 = GSM.",
    buy: "GSM cutter ₹8,000–15,000 with pads.",
  },
  {
    icon: "🌡️",
    name: "Digital Probe Thermometer",
    why: "Machine temperature gauges drift — enzyme dies above 55°C and you'd never know.",
    how: "Check actual bath temperature at dosing time, not just the dial.",
    buy: "Kitchen/lab probe ₹500–1,500; calibrate in boiling water (100°C).",
  },
  {
    icon: "⏱️",
    name: "Stopwatch / Interval Timer (one per machine)",
    why: "2–3 extra minutes in bleach = one shade lighter. Wall clocks cause shade variation between loads.",
    how: "Start at chemical dosing, not at machine start. Log actual minutes on the batch card.",
    buy: "Basic digital timers ₹200–500 each; magnet-back preferred.",
  },
  {
    icon: "🧤",
    name: "PPE Set (per operator)",
    why: "Hypo, PP, caustic and acids are on this page for a reason.",
    how: "Nitrile gloves + chemical splash goggles + PVC apron + rubber boots; respirator at PP spray and resin cure.",
    buy: "Industrial safety stores; keep spares — a torn glove is a burned hand.",
  },
  {
    icon: "🎨",
    name: "ISO Grey Scales (Staining & Colour Change)",
    why: "How buyers grade wash-fastness results (1–5). Your QC must speak the same numbers.",
    how: "Compare tested vs original swatch under D65; grade against the scale steps.",
    buy: "SDC/AATCC grey scale pair ₹8,000–15,000.",
  },
  {
    icon: "🔄",
    name: "Crockmeter (Rubbing Fastness)",
    why: "Dry/wet crocking is the #1 lab failure for dark denim — test before shipping, not after rejection.",
    how: "10 rubs dry + 10 wet with standard cloth, grade staining vs grey scale.",
    buy: "Manual crockmeter ₹15,000–35,000.",
  },
];

export const GOLDEN_RULES: string[] = [
  "NEVER let bleach (hypo) meet any acid — the chlorine gas released can kill. Store them on opposite sides of the room.",
  "Always add chemical to water, never water to chemical — especially acids and caustic.",
  "Pre-dissolve every powder/flake in a bucket before dosing — undissolved chemical = permanent spots.",
  "Label every container. Never store any chemical in a drink bottle. Ever.",
  "Oxidisers (PP, hypo, peroxide) live away from organics, softeners and acids.",
  "Gloves + goggles + apron are not optional. A checkpoint you can't see because of a burned eye helps nobody.",
  "White powders look identical (meta, soda ash, caustic, salt) — identify by label first, behaviour second (caustic heats water), NEVER by taste.",
  "When unsure, ask. One wrong scoop can ruin a 250 kg batch — or a hand.",
];
