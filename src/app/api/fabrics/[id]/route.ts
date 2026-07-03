import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Recipes referencing this fabric keep their history (fabricId becomes null).
  await prisma.recipe.updateMany({ where: { fabricId: id }, data: { fabricId: null } });
  await prisma.fabric.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
