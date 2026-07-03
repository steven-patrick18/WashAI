import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "washai_session";
// Pages/APIs reachable without a session.
const PUBLIC_PAGES = ["/login", "/setup"];

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secretValue = process.env.AUTH_SECRET;
  if (!token || !secretValue) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secretValue));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await hasValidSession(req);

  // Auth endpoints and public pages pass through — but bounce logged-in
  // users away from the login/setup screens.
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();
  if (PUBLIC_PAGES.includes(pathname)) {
    if (authed) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  if (authed) return NextResponse.next();

  // APIs get a 401; pages get redirected to login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  // Everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
