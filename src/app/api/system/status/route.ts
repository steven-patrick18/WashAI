import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

async function fetchJson(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  const session = await getSession();
  if (session?.role !== "OWNER") {
    return NextResponse.json({ error: "Owner only." }, { status: 403 });
  }

  const [users, fabrics, machines, recipes, outcomes, documents, lastRecipe] =
    await Promise.all([
      prisma.user.count(),
      prisma.fabric.count(),
      prisma.machine.count(),
      prisma.recipe.count(),
      prisma.productionResult.count(),
      prisma.document.count(),
      prisma.recipe.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    ]);

  // Deployed version (via updater sidecar) + latest version on GitHub.
  const updaterUrl = process.env.UPDATER_URL;
  const token = process.env.UPDATER_TOKEN ?? "";
  const [local, remote] = await Promise.all([
    updaterUrl
      ? fetchJson(`${updaterUrl}/status`, { headers: { "x-updater-token": token } }, 3000)
      : Promise.resolve(null),
    fetchJson(
      "https://api.github.com/repos/steven-patrick18/WashAI/commits/main",
      { headers: { "User-Agent": "washai-system" } },
      5000,
    ),
  ]);

  const currentSha = (local?.sha as string | undefined) ?? null;
  const remoteSha = (remote?.sha as string | undefined) ?? null;

  return NextResponse.json({
    counts: {
      users,
      fabrics,
      machines,
      recipes,
      outcomes,
      documents,
    },
    lastRecipeAt: lastRecipe?.createdAt ?? null,
    apiKeyConfigured:
      !!process.env.ANTHROPIC_API_KEY &&
      process.env.ANTHROPIC_API_KEY !== "REPLACE_WITH_YOUR_KEY",
    deploy: {
      mode: updaterUrl ? "production" : "development",
      currentSha,
      remoteSha,
      updateAvailable: !!currentSha && !!remoteSha && currentSha !== remoteSha,
      updating: (local?.updating as boolean | undefined) ?? false,
      lastResult: local?.lastResult ?? null,
    },
  });
}
