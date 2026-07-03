"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Status {
  counts: {
    users: number;
    fabrics: number;
    machines: number;
    recipes: number;
    outcomes: number;
    documents: number;
  };
  lastRecipeAt: string | null;
  apiKeyConfigured: boolean;
  deploy: {
    mode: "production" | "development";
    currentSha: string | null;
    remoteSha: string | null;
    updateAvailable: boolean;
    updating: boolean;
    lastResult: { ok: boolean; finishedAt: string } | null;
  };
}

const short = (sha: string | null) => (sha ? sha.slice(0, 7) : "—");

export default function SystemPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateStarted, setUpdateStarted] = useState(false);
  const startShaRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/system/status", { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load status.");
      const data = (await res.json()) as Status;
      setStatus(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load status.");
      return null;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // While an update runs, poll until the deployed commit changes.
  useEffect(() => {
    if (!updateStarted) return;
    const t = setInterval(async () => {
      const s = await load().catch(() => null);
      if (s?.deploy.currentSha && s.deploy.currentSha !== startShaRef.current && !s.deploy.updating) {
        setUpdateStarted(false);
      }
    }, 15000);
    return () => clearInterval(t);
  }, [updateStarted, load]);

  async function triggerUpdate() {
    if (!status) return;
    if (!confirm("Update WashAI from GitHub now? The app restarts in ~3–4 minutes; nobody should be mid-wash-generation.")) return;
    startShaRef.current = status.deploy.currentSha;
    const res = await fetch("/api/system/update", { method: "POST" });
    if (res.status === 202 || res.ok) {
      setUpdateStarted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not start update.");
    }
  }

  if (!status) {
    return <div className="card">{error ? <div className="error">{error}</div> : "Loading system status…"}</div>;
  }

  const d = status.deploy;
  const stats: { label: string; value: number | string; href?: string }[] = [
    { label: "Users", value: status.counts.users, href: "/users" },
    { label: "Fabrics", value: status.counts.fabrics, href: "/masters" },
    { label: "Machines", value: status.counts.machines, href: "/masters" },
    { label: "Recipes", value: status.counts.recipes, href: "/recipes" },
    { label: "Batch outcomes", value: status.counts.outcomes, href: "/recipes" },
    { label: "Knowledge PDFs", value: status.counts.documents, href: "/knowledge" },
  ];

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>System status</h2>
        <p className="sub">
          Everything WashAI knows right now.
          {status.lastRecipeAt &&
            ` Last recipe generated ${new Date(status.lastRecipeAt).toLocaleString()}.`}
        </p>
        <div className="sys-grid">
          {stats.map((s) => (
            <a className="sys-stat" key={s.label} href={s.href}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </a>
          ))}
        </div>

        <div className={status.apiKeyConfigured ? "sys-key ok" : "sys-key missing"}>
          {status.apiKeyConfigured
            ? "✅ Anthropic API key configured — recipe generation and knowledge Q&A are active."
            : "⚠️ Anthropic API key NOT configured — recipe generation and knowledge Q&A will fail until it is added to the server .env."}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Software version &amp; updates</h2>
        <p className="sub">
          Updates come from GitHub (steven-patrick18/WashAI). Your data (recipes,
          outcomes, users, PDFs) is never touched by an update.
        </p>

        <div className="meta" style={{ margin: "0 0 14px" }}>
          <span><b>Environment</b>{d.mode}</span>
          <span><b>Installed version</b>{short(d.currentSha)}</span>
          <span><b>Latest on GitHub</b>{short(d.remoteSha)}</span>
          <span>
            <b>Status</b>
            {updateStarted || d.updating ? (
              <span className="tag warn">updating…</span>
            ) : d.updateAvailable ? (
              <span className="tag warn">update available</span>
            ) : (
              <span className="tag ok">up to date</span>
            )}
          </span>
        </div>

        {updateStarted || d.updating ? (
          <div className="sys-updating">
            🚀 Update running — the server is pulling from GitHub and rebuilding
            itself. This takes ~3–4 minutes; this page will refresh automatically.
            Don&apos;t start wash generations meanwhile.
          </div>
        ) : d.mode === "development" ? (
          <p className="notes">
            Self-update runs on the production server only. Locally, changes hot-reload.
          </p>
        ) : (
          <button
            onClick={triggerUpdate}
            disabled={!d.updateAvailable}
            title={d.updateAvailable ? "Pull latest from GitHub and rebuild" : "Already on the latest version"}
          >
            {d.updateAvailable ? "⬇️ Update now (pull from GitHub + rebuild)" : "Up to date ✓"}
          </button>
        )}

        {d.lastResult && !updateStarted && (
          <p className="notes" style={{ marginTop: 10 }}>
            Last update: {d.lastResult.ok ? "succeeded" : "FAILED"} at{" "}
            {new Date(d.lastResult.finishedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
