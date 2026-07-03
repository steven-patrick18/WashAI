// Inserts one hand-authored demo recipe (mid-blue vintage on the seeded 12oz
// selvedge) so Guided Run Mode can be demonstrated before any AI generation.
// Run: npx tsx prisma/demo-recipe.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demo = {
  summary:
    "Mid Blue vintage route for 12oz rigid selvedge indigo: hot desize with strong anti-backstain, acid enzyme abrasion for highs/lows, a short controlled NaOCl touch to open the shade, full neutralisation, then softener. Designed so a first-time operator can execute it stage by stage.",
  processSequence: [
    "Load & Desize",
    "Hot Rinse",
    "Enzyme Wash",
    "Rinse",
    "Bleach Touch",
    "Antichlor + Neutralise",
    "Softener",
    "Extract & Dry",
  ],
  stages: [
    {
      name: "Load & Desize",
      purpose:
        "Removes the starch size from the warp so chemicals can reach the fibre evenly — skipping or rushing this causes patchy washing later.",
      chemicals: [
        { name: "Alpha amylase (desizing enzyme)", dosage: "1.0 g/L" },
        { name: "Non-ionic wetting agent", dosage: "0.5 g/L" },
        { name: "Anti-backstaining agent", dosage: "1.5 g/L" },
      ],
      waterLevel: "1:8 liquor ratio (approx 2000 L for 250 kg)",
      temperatureC: 60,
      timeMin: 20,
      ph: 6.5,
      rpm: 25,
      safety: [
        "Load garments loosely — max 250 kg for this drum; overloading causes crease marks that never wash out.",
        "Hot bath: keep the door gasket area clear when sampling.",
      ],
      checkpoint:
        "Pull one garment; back pocket lining should show NO slimy/starchy feel. Bath water should look milky (size coming off).",
    },
    {
      name: "Hot Rinse",
      purpose:
        "Flushes the loosened size and dirt out before enzyme — enzyme in dirty liquor redeposits indigo onto pockets (back-staining).",
      chemicals: [],
      waterLevel: "1:10, two fills and drains",
      temperatureC: 50,
      timeMin: 5,
      ph: 7,
      rpm: 25,
      safety: [],
      checkpoint: "Second drain runs almost clear — if still blue/milky, rinse once more.",
    },
    {
      name: "Enzyme Wash",
      purpose:
        "Acid cellulase eats the surface fibre so the indigo highs/lows appear — this is where the vintage character is made.",
      chemicals: [
        { name: "Acid cellulase enzyme", dosage: "1.5 g/L" },
        { name: "Acetic acid (to set pH)", dosage: "as needed to pH 4.5–5.0" },
        { name: "Anti-backstaining agent", dosage: "1.0 g/L" },
      ],
      waterLevel: "1:6 (low liquor = more friction = better abrasion)",
      temperatureC: 50,
      timeMin: 50,
      ph: 4.8,
      rpm: 30,
      safety: [
        "Acetic acid: wear gloves and goggles when dosing; add acid to water, never water to acid.",
        "Do NOT exceed 55°C — the enzyme dies and the batch loses abrasion.",
      ],
      checkpoint:
        "CHECK pH IS 4.5–5.0 WITH A TEST STRIP BEFORE ADDING ENZYME. At 40 min pull a leg panel: seam abrasion should show clear white highs; if weak, run 10 more min and re-check.",
    },
    {
      name: "Rinse",
      purpose: "Stops enzyme action and removes loose fibre dust before bleach.",
      chemicals: [],
      waterLevel: "1:10, two fills",
      temperatureC: 40,
      timeMin: 5,
      ph: 7,
      rpm: 25,
      safety: [],
      checkpoint: "Water drains without heavy lint; garments feel clean, not slimy.",
    },
    {
      name: "Bleach Touch",
      purpose:
        "A short, weak hypochlorite bath lifts the ground shade from dark to mid blue — small dose + short time = control.",
      chemicals: [
        { name: "Sodium hypochlorite (NaOCl, ~5% active)", dosage: "4 g/L" },
        { name: "Soda ash (pH buffer)", dosage: "0.5 g/L" },
      ],
      waterLevel: "1:10 (high liquor = even bleaching)",
      temperatureC: 45,
      timeMin: 12,
      ph: 10.5,
      safety: [
        "CHLORINE HAZARD: run exhaust fan; never let hypo touch acid (releases toxic gas). Gloves, goggles, apron mandatory.",
        "Pre-dilute the hypo in a bucket of water before dosing into the machine — never pour concentrate onto garments.",
      ],
      rpm: 30,
      checkpoint:
        "At 8 min pull a panel, rinse it in the sink and compare wet shade against the approved standard — wet reads ~1 shade darker than dry. STOP the moment it matches; bleach keeps working while you wait.",
    },
    {
      name: "Antichlor + Neutralise",
      purpose:
        "Kills residual chlorine so the shade stops moving and the fabric doesn't yellow or lose strength in storage.",
      chemicals: [
        { name: "Sodium metabisulphite", dosage: "2 g/L" },
        { name: "Acetic acid", dosage: "to pH 6–6.5" },
      ],
      waterLevel: "1:8",
      temperatureC: 40,
      timeMin: 10,
      ph: 6.5,
      rpm: 25,
      safety: [
        "Metabisulphite gives off sulphur fumes in acid bath — keep ventilation on.",
      ],
      checkpoint:
        "Chlorine test paper on bath water shows NEGATIVE (no colour change). If positive, add 0.5 g/L more metabisulphite and run 5 min.",
    },
    {
      name: "Softener",
      purpose: "Sets the soft hand feel the buyer approved — the 'finish' the customer touches in the store.",
      chemicals: [
        { name: "Cationic softener flakes (pre-dissolved)", dosage: "2 g/L" },
        { name: "Acetic acid", dosage: "to pH 5.5" },
      ],
      waterLevel: "1:8",
      temperatureC: 40,
      timeMin: 15,
      ph: 5.5,
      rpm: 20,
      safety: [],
      checkpoint:
        "Hand-feel a dried sample panel (iron it dry): should match the approved 'soft' standard, no greasy surface.",
    },
    {
      name: "Extract & Dry",
      purpose:
        "High-speed extraction then tumble dry — full drying locks the final shade; a damp assessment always reads too dark.",
      chemicals: [],
      waterLevel: "n/a",
      temperatureC: 70,
      timeMin: 45,
      ph: 7,
      rpm: 400,
      safety: [
        "Check pockets are empty before tumble drying; metal objects damage the drum and garments.",
        "Do not over-dry past 45 min — over-drying yellows the anti-stain finish.",
      ],
      checkpoint:
        "FINAL: fully dry garment vs approved standard under D65 light box (or north daylight). Shade, highs/lows, and hand feel all match → batch approved for finishing.",
    },
  ],
  machineLoad: "250 kg (approx 620 pairs of jeans)",
  batchSize: "1000 pcs = 4 machine loads; keep every load's timing identical for shade consistency",
  numberOfCycles: 4,
  predictedShade: "Mid Blue with light vintage character",
  risks: [
    "Back-staining on pocket bags if anti-stain is skipped in desize or enzyme stages.",
    "Shade variation between the 4 loads if bleach timing differs by even 2–3 minutes — use a stopwatch, not the wall clock.",
    "Crease marks from overloading; never exceed 250 kg.",
  ],
  commonMistakes: [
    "Adding enzyme before checking pH — at pH 7 the enzyme does nothing and the batch comes out flat and dark.",
    "Judging bleach shade on a wet garment — wet always looks darker; rinse-and-compare, or better, dry the test panel.",
    "Skipping the antichlor because 'it rinsed enough' — residual chlorine keeps eating the shade for days and weakens the fabric.",
    "Pouring concentrated hypochlorite straight into the drum — instant local over-bleach spots that cannot be fixed.",
    "Different operators running different loads with different timings — write the actual minutes on the batch card and repeat them exactly.",
  ],
  notes:
    "This is a demonstration recipe authored for training. Generate a live recipe for your exact fabric and machine for production use.",
};

async function main() {
  const fabric = await prisma.fabric.findFirst({
    where: { name: { contains: "12oz" } },
  });
  const machine = await prisma.machine.findFirst({
    where: { type: "WASHER_EXTRACTOR" },
  });

  const existing = await prisma.recipe.findFirst({
    where: { styleNumber: "DEMO-001" },
  });
  if (existing) {
    console.log("Demo recipe already present:", existing.id);
    return;
  }

  const recipe = await prisma.recipe.create({
    data: {
      styleNumber: "DEMO-001",
      buyer: "Training",
      quantityPcs: 1000,
      shadeTarget: "Mid Blue",
      vintageLevel: "medium",
      handFeel: "soft",
      generated: demo,
      model: "hand-authored-demo",
      fabricId: fabric?.id ?? null,
      machineId: machine?.id ?? null,
    },
  });
  console.log("Demo recipe created:", recipe.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
