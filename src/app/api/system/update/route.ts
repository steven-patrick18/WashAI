import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const session = await getSession();
  if (session?.role !== "OWNER") {
    return NextResponse.json({ error: "Owner only." }, { status: 403 });
  }

  const updaterUrl = process.env.UPDATER_URL;
  if (!updaterUrl) {
    return NextResponse.json(
      { error: "Self-update is only available on the production server." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${updaterUrl}/update`, {
      method: "POST",
      headers: { "x-updater-token": process.env.UPDATER_TOKEN ?? "" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Updater service unreachable." }, { status: 502 });
  }
}
