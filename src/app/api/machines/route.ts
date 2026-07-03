import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MACHINE_TYPES = [
  "WASHER_EXTRACTOR",
  "STONE_WASH",
  "OZONE",
  "LASER",
  "HYDRO_EXTRACTOR",
  "DRYER",
  "PP_SPRAY_BOOTH",
];

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const type = typeof b.type === "string" ? b.type : "";
  if (!name) {
    return NextResponse.json({ error: "Machine name is required." }, { status: 400 });
  }
  if (!MACHINE_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid machine type." }, { status: 400 });
  }

  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

  const machine = await prisma.machine.create({
    data: {
      name,
      type,
      capacityKg: num(b.capacityKg),
      rpm: num(b.rpm) !== null ? Math.round(num(b.rpm)!) : null,
      waterPerCycleL: num(b.waterPerCycleL),
      maxTempC: num(b.maxTempC),
      steamKgPerHr: num(b.steamKgPerHr),
      notes: str(b.notes),
    },
  });

  return NextResponse.json({ id: machine.id });
}
