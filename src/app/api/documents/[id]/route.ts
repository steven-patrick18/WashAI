import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  await prisma.document.delete({ where: { id } });
  // Stored name is a server-generated UUID, safe to join.
  await unlink(path.join(process.cwd(), "uploads", doc.filename)).catch(() => {});

  return NextResponse.json({ ok: true });
}
