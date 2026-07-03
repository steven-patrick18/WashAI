import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Recipes referencing this machine keep their history (machineId becomes null).
  await prisma.recipe.updateMany({ where: { machineId: id }, data: { machineId: null } });
  await prisma.machine.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
