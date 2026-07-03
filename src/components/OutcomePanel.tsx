"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OUTCOMES } from "@/lib/outcomes";

export default function OutcomePanel({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [outcome, setOutcome] = useState<string>("PERFECT");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome, operatorNote: note || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save outcome.");
      setNote("");
      router.refresh(); // re-render the server page so the outcome list updates
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2>Record batch outcome</h2>
      <p className="sub">
        How did production go? This is the learning loop — the AI adjusts future
        recipes on this fabric based on what you record here.
      </p>

      {error && <div className="error">{error}</div>}

      <label>Outcome</label>
      <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
        {OUTCOMES.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <label>Operator note (optional)</label>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Shade came 5% darker than approved; back-staining on pockets."
      />

      <button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save outcome"}
      </button>
    </div>
  );
}
