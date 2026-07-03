"use client";

import { useState } from "react";
import type { GeneratedRecipe } from "@/lib/recipe";
import RecipeView from "./RecipeView";
import ShadeChart, { VintageRow } from "./ShadeChart";

interface Option {
  id: string;
  name: string;
}

export default function RecipeForm({
  fabrics,
  machines,
}: {
  fabrics: Option[];
  machines: Option[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);

  const [form, setForm] = useState({
    styleNumber: "",
    buyer: "",
    quantityPcs: "1000",
    shadeTarget: "mid blue vintage",
    vintageLevel: "medium",
    handFeel: "soft",
    fabricId: fabrics[0]?.id ?? "",
    machineId: machines[0]?.id ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantityPcs: form.quantityPcs ? Number(form.quantityPcs) : undefined,
          fabricId: form.fabricId || undefined,
          machineId: form.machineId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      setRecipe(data.recipe as GeneratedRecipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid">
      <form className="card" onSubmit={onSubmit}>
        <h2>Garment brief</h2>
        <p className="sub">Describe the wash you need. Fields are flexible.</p>

        <div className="row">
          <div>
            <label>Style #</label>
            <input value={form.styleNumber} onChange={(e) => set("styleNumber", e.target.value)} placeholder="e.g. LV-511" />
          </div>
          <div>
            <label>Buyer</label>
            <input value={form.buyer} onChange={(e) => set("buyer", e.target.value)} placeholder="e.g. Levi's" />
          </div>
        </div>

        <label>Quantity (pcs)</label>
        <input type="number" min="1" value={form.quantityPcs} onChange={(e) => set("quantityPcs", e.target.value)} />

        <label>Shade target — pick from the chart or type freely</label>
        <input value={form.shadeTarget} onChange={(e) => set("shadeTarget", e.target.value)} />
        <ShadeChart
          compact
          selected={form.shadeTarget}
          onSelect={(name) => set("shadeTarget", name)}
        />

        <label>Vintage level</label>
        <VintageRow
          selected={form.vintageLevel}
          onSelect={(v) => set("vintageLevel", v)}
        />

        <label>Hand feel</label>
        <select value={form.handFeel} onChange={(e) => set("handFeel", e.target.value)}>
          <option value="soft">Soft</option>
          <option value="medium">Medium</option>
          <option value="firm">Firm</option>
        </select>

        <label>Fabric</label>
        <select value={form.fabricId} onChange={(e) => set("fabricId", e.target.value)}>
          <option value="">— none / describe generically —</option>
          {fabrics.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        <label>Machine</label>
        <select value={form.machineId} onChange={(e) => set("machineId", e.target.value)}>
          <option value="">— none / assume 250kg washer —</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Generating recipe…" : "Generate wash recipe"}
        </button>
      </form>

      <div>
        {error && <div className="error">{error}</div>}

        {!recipe && !error && (
          <div className="empty">
            {loading
              ? "The washing master is working through desize, enzyme, bleach and softener steps…"
              : "Your generated recipe will appear here."}
          </div>
        )}

        {recipe && <RecipeView recipe={recipe} />}
      </div>
    </div>
  );
}
