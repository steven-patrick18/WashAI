import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, hashPassword } from "@/lib/auth";

// First-run only: creates the OWNER account when no users exist yet.
export async function POST(req: Request) {
  const count = await prisma.user.count();
  if (count > 0) {
    return NextResponse.json(
      { error: "Setup already completed. Ask the owner for an account." },
      { status: 403 },
    );
  }

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid name and email are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password), role: "OWNER" },
  });

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: "OWNER",
  });

  return NextResponse.json({ ok: true });
}
