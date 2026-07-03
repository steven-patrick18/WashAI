import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // A couple of representative denim fabrics a washing master would recognise.
  const fabrics = [
    {
      name: "12oz Rigid Selvedge Indigo",
      supplier: "Arvind",
      construction: "3/1 RHT twill",
      warpCount: "10s",
      weftCount: "10s",
      gsm: 407,
      ounce: 12,
      composition: "100% Cotton",
      stretchPct: 0,
      lycraPct: 0,
      indigoDepth: "deep",
      sulfurDyePct: 0,
      yarnType: "ring",
      finish: "raw / loomstate",
      shrinkagePct: 8,
      notes: "Rigid selvedge; prone to back-staining without good anti-stain.",
    },
    {
      name: "9.5oz Stretch Indigo (2% Elastane)",
      supplier: "Raymond UCO",
      construction: "2/1 twill",
      warpCount: "16s",
      weftCount: "16s + 40D lycra",
      gsm: 322,
      ounce: 9.5,
      composition: "98% Cotton 2% Elastane",
      stretchPct: 30,
      lycraPct: 2,
      indigoDepth: "medium",
      sulfurDyePct: 0,
      yarnType: "ring",
      finish: "mercerised",
      shrinkagePct: 4,
      notes: "Watch lycra recovery; avoid temps above 60C in stone/enzyme.",
    },
  ];

  for (const f of fabrics) {
    const existing = await prisma.fabric.findFirst({ where: { name: f.name } });
    if (!existing) await prisma.fabric.create({ data: f });
  }

  const machines = [
    {
      name: "Tonello G1 — 250kg Washer/Extractor",
      type: "WASHER_EXTRACTOR",
      capacityKg: 250,
      rpm: 40,
      waterPerCycleL: 2500,
      maxTempC: 90,
      steamKgPerHr: 120,
      notes: "Front-loading; good for enzyme/bleach and rinse cycles.",
    },
    {
      name: "Ozone Cabinet — G2",
      type: "OZONE",
      capacityKg: 80,
      rpm: 0,
      waterPerCycleL: 0,
      maxTempC: 35,
      notes: "Dry ozone for bleaching/vintage without water.",
    },
  ];

  for (const m of machines) {
    const existing = await prisma.machine.findFirst({ where: { name: m.name } });
    if (!existing) await prisma.machine.create({ data: m });
  }

  const fabricCount = await prisma.fabric.count();
  const machineCount = await prisma.machine.count();
  console.log(`Seed complete: ${fabricCount} fabrics, ${machineCount} machines.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
