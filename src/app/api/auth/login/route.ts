import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, verifyPassword, type Role } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Same message for unknown email and wrong password — don't leak which.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  });

  return NextResponse.json({ ok: true });
}
