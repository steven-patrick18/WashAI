"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Row {
  id: string;
  name: string;
  detail: string;
}

const MACHINE_TYPES = [
  "WASHER_EXTRACTOR",
  "STONE_WASH",
  "OZONE",
  "LASER",
  "HYDRO_EXTRACTOR",
  "DRYER",
  "PP_SPRAY_BOOTH",
];

export default function MastersPanel({
  fabrics,
  machines,
}: {
  fabrics: Row[];
  machines: Row[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function submit(url: string, body: Record<string, unknown>) {
    setError(null);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function remove(kind: "fabrics" | "machines", id: string) {
    if (!confirm("Delete this record? Existing recipes keep their history.")) return;
    await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {error && <div className="error" style={{ gridColumn: "1 / -1" }}>{error}</div>}
      <FabricForm onSubmit={(b) => submit("/api/fabrics", b)} rows={fabrics} onDelete={(id) => remove("fabrics", id)} />
      <MachineForm onSubmit={(b) => submit("/api/machines", b)} rows={machines} onDelete={(id) => remove("machines", id)} />
    </div>
  );
}

function MasterList({ rows, onDelete }: { rows: Row[]; onDelete: (id: string) => void }) {
  return (
    <div style={{ marginTop: 16 }}>
      {rows.map((r) => (
        <div className="doc" key={r.id}>
          <div>
            <div className="doc-title">{r.name}</div>
            <div className="doc-meta">{r.detail || "—"}</div>
          </div>
          <a className="doc-delete" onClick={() => onDelete(r.id)}>✕</a>
        </div>
      ))}
      {rows.length === 0 && <div className="empty">Nothing yet.</div>}
    </div>
  );
}

function FabricForm({
  rows,
  onSubmit,
  onDelete,
}: {
  rows: Row[];
  onSubmit: (b: Record<string, unknown>) => Promise<boolean>;
  onDelete: (id: string) => void;
}) {
  const empty = {
    name: "", supplier: "", construction: "", warpCount: "", weftCount: "",
    gsm: "", ounce: "", composition: "", stretchPct: "", lycraPct: "",
    indigoDepth: "medium", sulfurDyePct: "", yarnType: "ring", finish: "",
    shrinkagePct: "", notes: "",
  };
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof empty, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      ...f,
      gsm: f.gsm ? Number(f.gsm) : null,
      ounce: f.ounce ? Number(f.ounce) : null,
      stretchPct: f.stretchPct ? Number(f.stretchPct) : null,
      lycraPct: f.lycraPct ? Number(f.lycraPct) : null,
      sulfurDyePct: f.sulfurDyePct ? Number(f.sulfurDyePct) : null,
      shrinkagePct: f.shrinkagePct ? Number(f.shrinkagePct) : null,
    });
    if (ok) setF(empty);
    setBusy(false);
  }

  return (
    <form className="card" onSubmit={go}>
      <h2>Fabrics ({rows.length})</h2>
      <p className="sub">Module 2 — every parameter here sharpens the AI&apos;s recipe.</p>

      <label>Name *</label>
      <input value={f.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. 11oz Comfort Stretch Indigo" />
      <div className="row">
        <div><label>Supplier</label><input value={f.supplier} onChange={(e) => set("supplier", e.target.value)} /></div>
        <div><label>Construction</label><input value={f.construction} onChange={(e) => set("construction", e.target.value)} placeholder="3/1 RHT twill" /></div>
      </div>
      <div className="row">
        <div><label>Warp count</label><input value={f.warpCount} onChange={(e) => set("warpCount", e.target.value)} placeholder="10s" /></div>
        <div><label>Weft count</label><input value={f.weftCount} onChange={(e) => set("weftCount", e.target.value)} placeholder="16s + 40D" /></div>
      </div>
      <div className="row">
        <div><label>GSM</label><input type="number" value={f.gsm} onChange={(e) => set("gsm", e.target.value)} /></div>
        <div><label>Ounce (oz/yd²)</label><input type="number" step="0.1" value={f.ounce} onChange={(e) => set("ounce", e.target.value)} /></div>
      </div>
      <label>Composition</label>
      <input value={f.composition} onChange={(e) => set("composition", e.target.value)} placeholder="98% Cotton 2% Elastane" />
      <div className="row">
        <div><label>Stretch %</label><input type="number" step="0.5" value={f.stretchPct} onChange={(e) => set("stretchPct", e.target.value)} /></div>
        <div><label>Lycra %</label><input type="number" step="0.5" value={f.lycraPct} onChange={(e) => set("lycraPct", e.target.value)} /></div>
      </div>
      <div className="row">
        <div>
          <label>Indigo depth</label>
          <select value={f.indigoDepth} onChange={(e) => set("indigoDepth", e.target.value)}>
            <option value="deep">Deep</option>
            <option value="medium">Medium</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div><label>Sulphur dye %</label><input type="number" step="0.5" value={f.sulfurDyePct} onChange={(e) => set("sulfurDyePct", e.target.value)} /></div>
      </div>
      <div className="row">
        <div>
          <label>Yarn type</label>
          <select value={f.yarnType} onChange={(e) => set("yarnType", e.target.value)}>
            <option value="ring">Ring-spun</option>
            <option value="open-end">Open-end</option>
            <option value="slub">Slub</option>
          </select>
        </div>
        <div><label>Shrinkage %</label><input type="number" step="0.5" value={f.shrinkagePct} onChange={(e) => set("shrinkagePct", e.target.value)} /></div>
      </div>
      <label>Finish</label>
      <input value={f.finish} onChange={(e) => set("finish", e.target.value)} placeholder="mercerised / raw / overdyed" />
      <label>Notes for the AI</label>
      <textarea rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. prone to back-staining; crocking issues above 60°C" />
      <button disabled={busy}>{busy ? "Saving…" : "Add fabric"}</button>

      <MasterList rows={rows} onDelete={onDelete} />
    </form>
  );
}

function MachineForm({
  rows,
  onSubmit,
  onDelete,
}: {
  rows: Row[];
  onSubmit: (b: Record<string, unknown>) => Promise<boolean>;
  onDelete: (id: string) => void;
}) {
  const empty = {
    name: "", type: "WASHER_EXTRACTOR", capacityKg: "", rpm: "",
    waterPerCycleL: "", maxTempC: "", steamKgPerHr: "", notes: "",
  };
  const [m, setM] = useState(empty);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof empty, v: string) => setM((p) => ({ ...p, [k]: v }));

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await onSubmit({
      ...m,
      capacityKg: m.capacityKg ? Number(m.capacityKg) : null,
      rpm: m.rpm ? Number(m.rpm) : null,
      waterPerCycleL: m.waterPerCycleL ? Number(m.waterPerCycleL) : null,
      maxTempC: m.maxTempC ? Number(m.maxTempC) : null,
      steamKgPerHr: m.steamKgPerHr ? Number(m.steamKgPerHr) : null,
    });
    if (ok) setM(empty);
    setBusy(false);
  }

  return (
    <form className="card" onSubmit={go}>
      <h2>Machines ({rows.length})</h2>
      <p className="sub">Module 1 — capacity and limits keep recipes machine-safe.</p>

      <label>Name *</label>
      <input value={m.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Tolkar 300kg Front Loader" />
      <label>Type</label>
      <select value={m.type} onChange={(e) => set("type", e.target.value)}>
        {MACHINE_TYPES.map((t) => (
          <option key={t} value={t}>{t.replaceAll("_", " ")}</option>
        ))}
      </select>
      <div className="row">
        <div><label>Capacity (kg)</label><input type="number" value={m.capacityKg} onChange={(e) => set("capacityKg", e.target.value)} /></div>
        <div><label>RPM</label><input type="number" value={m.rpm} onChange={(e) => set("rpm", e.target.value)} /></div>
      </div>
      <div className="row">
        <div><label>Water / cycle (L)</label><input type="number" value={m.waterPerCycleL} onChange={(e) => set("waterPerCycleL", e.target.value)} /></div>
        <div><label>Max temp (°C)</label><input type="number" value={m.maxTempC} onChange={(e) => set("maxTempC", e.target.value)} /></div>
      </div>
      <label>Steam (kg/hr)</label>
      <input type="number" value={m.steamKgPerHr} onChange={(e) => set("steamKgPerHr", e.target.value)} />
      <label>Notes for the AI</label>
      <textarea rows={2} value={m.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. weak heating coil — max practical 70°C" />
      <button disabled={busy}>{busy ? "Saving…" : "Add machine"}</button>

      <MasterList rows={rows} onDelete={onDelete} />
    </form>
  );
}
