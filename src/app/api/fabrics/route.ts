import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Fabric name is required." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

  const fabric = await prisma.fabric.create({
    data: {
      name,
      supplier: str(b.supplier),
      construction: str(b.construction),
      warpCount: str(b.warpCount),
      weftCount: str(b.weftCount),
      gsm: num(b.gsm) !== null ? Math.round(num(b.gsm)!) : null,
      ounce: num(b.ounce),
      composition: str(b.composition),
      stretchPct: num(b.stretchPct),
      lycraPct: num(b.lycraPct),
      indigoDepth: str(b.indigoDepth),
      sulfurDyePct: num(b.sulfurDyePct),
      yarnType: str(b.yarnType),
      finish: str(b.finish),
      shrinkagePct: num(b.shrinkagePct),
      notes: str(b.notes),
    },
  });

  return NextResponse.json({ id: fabric.id });
}
