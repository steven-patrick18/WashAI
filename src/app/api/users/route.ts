import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, ROLES, type Role } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "OWNER") {
    return NextResponse.json({ error: "Only the owner can manage users." }, { status: 403 });
  }

  let body: { name?: string; email?: string; password?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const role = (body.role ?? "OPERATOR") as Role;

  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid name and email are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash: await hashPassword(password), role },
    });
    return NextResponse.json({ id: user.id });
  } catch {
    return NextResponse.json({ error: "That email is already registered." }, { status: 409 });
  }
}
