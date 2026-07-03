import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "OWNER") {
    return NextResponse.json({ error: "Only the owner can manage users." }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.userId) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
