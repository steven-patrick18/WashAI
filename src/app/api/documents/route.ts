import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
// Claude accepts PDFs up to 32MB per request; cap uploads a little below that.
const MAX_BYTES = 30 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) {
    return NextResponse.json({ error: "Upload a file under 'file'." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "PDF too large (max 30 MB). Split the book into parts and upload each." },
      { status: 400 },
    );
  }

  const title =
    (form.get("title") as string | null)?.trim() ||
    file.name.replace(/\.pdf$/i, "");

  // Random stored name — never trust the client filename for the disk path.
  const filename = `${crypto.randomUUID()}.pdf`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  const doc = await prisma.document.create({
    data: {
      title,
      filename,
      mimeType: "application/pdf",
      sizeBytes: file.size,
    },
  });

  return NextResponse.json({ id: doc.id, title: doc.title });
}
