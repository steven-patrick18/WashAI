import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "washai_session";
const SESSION_DAYS = 7;

export type Role = "OWNER" | "MANAGER" | "OPERATOR";
export const ROLES: Role[] = ["OWNER", "MANAGER", "OPERATOR"];

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set — add it to .env");
  return new TextEncoder().encode(s);
}

// --- Passwords ---------------------------------------------------------------

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- Sessions (signed JWT in an httpOnly cookie) ------------------------------

export async function createSessionCookie(session: Session): Promise<void> {
  const token = await new SignJWT({
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setSubject(session.userId)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      userId: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null; // expired or tampered
  }
}
