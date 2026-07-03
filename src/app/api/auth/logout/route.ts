import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  await clearSessionCookie();
  // Plain-form friendly: redirect straight back to the login page.
  return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
}
