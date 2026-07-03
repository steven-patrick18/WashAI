// Replaces the fictional seed machines with Sharv Enterprises / Firelock's
// REAL inventory (from Sharv_Firelock_Current_Washing_Process.pptx, July 2026).
// Safe to run repeatedly. Run: npx tsx prisma/sharv-machines.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REMOVE = ["Tonello G1 — 250kg Washer/Extractor", "Ozone Cabinet — G2"];

const MACHINES = [
  {
    name: "A-ONE AEW/150 — 150 kg Washer",
    type: "WASHER_EXTRACTOR",
    capacityKg: 150,
    rpm: null,
    waterPerCycleL: null,
    maxTempC: 90,
    steamKgPerHr: null,
    notes:
      "Main workhorse (desize, bleach, softener baths). Side-load drum, direct steam from 200 kg/hr STEAM FAB boiler. FULLY MANUAL: water fill, chemical addition through door, push-button panel, no programmable recipes — recipes must give simple stepwise instructions and exact bucket-weighed doses. Typical working load ~150 kg (~370 pcs).",
  },
  {
    name: "A-ONE — 125 kg Washer",
    type: "WASHER_EXTRACTOR",
    capacityKg: 125,
    rpm: null,
    waterPerCycleL: null,
    maxTempC: 90,
    steamKgPerHr: null,
    notes:
      "Parallel baths: rinse, neutralise, tint, softener. Same manual operation as the 150 kg unit (direct steam, no programme panel).",
  },
  {
    name: "A-ONE — 35 kg Washer (sampling)",
    type: "WASHER_EXTRACTOR",
    capacityKg: 35,
    rpm: null,
    waterPerCycleL: null,
    maxTempC: 90,
    steamKgPerHr: null,
    notes:
      "Small lots, sampling and shade trials — use this for recipe trials before scaling to the 150 kg machine. Manual operation.",
  },
  {
    name: "FABCARE Hydro Extractor — 15 kg",
    type: "HYDRO_EXTRACTOR",
    capacityKg: 15,
    rpm: null,
    waterPerCycleL: 0,
    maxTempC: null,
    steamKgPerHr: null,
    notes:
      "UNDERSIZED vs washers (310 kg installed) — a 150 kg wash lot needs ~10 hydro loads. Plan batch timing around this bottleneck.",
  },
  {
    name: "FABCARE Drying Tumbler — 30 kg",
    type: "DRYER",
    capacityKg: 30,
    rpm: null,
    waterPerCycleL: 0,
    maxTempC: 80,
    steamKgPerHr: null,
    notes:
      "Electric heating, basic digital timer, worn but running. Undersized — overflow goes to open-air rope lines (weather-dependent, dust/sun-fade risk to shade consistency). Recipes must flag full tumble-dry for shade-critical batches.",
  },
  {
    name: "Wooden Rotary Drum (local-made) — 70 pcs",
    type: "STONE_WASH",
    capacityKg: null,
    rpm: null,
    waterPerCycleL: 0,
    maxTempC: null,
    steamKgPerHr: null,
    notes:
      "DRY tumbling / effect work only — NO stone wash is run, no pumice on site. Max 70 pcs/cycle, motor+gearbox, timing by operator experience. Do not write pumice-stone stages for this factory; use enzyme routes for abrasion instead.",
  },
  {
    name: "Manual PP Spray Station (leg form)",
    type: "PP_SPRAY_BOOTH",
    capacityKg: null,
    rpm: null,
    waterPerCycleL: 0,
    maxTempC: null,
    steamKgPerHr: null,
    notes:
      "Hand-gun PP spray on leg form by 1 spray master — NO enclosed booth, NO extraction, NO curing oven (effects set by tumbler/ambient heat). Recipes must include strict PP safety (respirator, ventilation) and full metabisulphite neutralisation. Compressed air from reciprocating compressor.",
  },
];

async function main() {
  for (const name of REMOVE) {
    const m = await prisma.machine.findFirst({ where: { name } });
    if (m) {
      await prisma.recipe.updateMany({ where: { machineId: m.id }, data: { machineId: null } });
      await prisma.machine.delete({ where: { id: m.id } });
      console.log("Removed fictional machine:", name);
    }
  }

  for (const m of MACHINES) {
    const existing = await prisma.machine.findFirst({ where: { name: m.name } });
    if (existing) {
      await prisma.machine.update({ where: { id: existing.id }, data: m });
      console.log("Updated:", m.name);
    } else {
      await prisma.machine.create({ data: m });
      console.log("Added:", m.name);
    }
  }

  console.log(`Done — ${await prisma.machine.count()} machines in master.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
