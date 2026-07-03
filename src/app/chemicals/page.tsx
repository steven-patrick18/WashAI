import type { Metadata } from "next";
import { CHEMICALS, LAB_TOOLS, GOLDEN_RULES } from "@/lib/chemicals";
import ChemVisual from "@/components/ChemVisual";

export const metadata: Metadata = {
  title: "Chemicals & Materials — WashAI",
};

const DANGER_LABEL = {
  LOW: { text: "Low hazard", cls: "chem-danger low" },
  CAUTION: { text: "Caution", cls: "chem-danger caution" },
  HIGH: { text: "HIGH HAZARD", cls: "chem-danger high" },
} as const;

export default function ChemicalsPage() {
  return (
    <main className="wrap">
      <div className="card rules">
        <h2>🛑 Golden safety rules — read before touching anything</h2>
        <ol>
          {GOLDEN_RULES.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Chemical identification guide</h2>
        <p className="sub">
          Every chemical a garment laundry uses: what it looks like on the shelf,
          how to recognise it, what it does, typical dosing, and its dangers.
          Illustrations show each chemical&apos;s physical form.
        </p>

        <div className="chem-grid">
          {CHEMICALS.map((c) => (
            <div className="chem-card" key={c.id} id={c.id}>
              <ChemVisual uid={c.id} form={c.form} color={c.color} />
              <div className="chem-head">
                <div>
                  <div className="chem-name">{c.name}</div>
                  <div className="chem-aka">{c.aka}</div>
                </div>
                <span className={DANGER_LABEL[c.danger].cls}>{DANGER_LABEL[c.danger].text}</span>
              </div>

              <div className="chem-facts">
                <span><b>Looks</b> {c.looks}</span>
                <span><b>Smell</b> {c.smell}</span>
              </div>

              <div className="chem-section">
                <b>How to identify</b>
                <ul>
                  {c.identify.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="chem-section">
                <b>Used for</b>
                <p>{c.usedFor}</p>
                <div className="chem-dose">📏 {c.dosage}</div>
              </div>

              {c.safety.length > 0 && (
                <div className="stage-safety">
                  {c.safety.map((s, i) => (
                    <div key={i}>⚠️ {s}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Physical materials &amp; lab tools</h2>
        <p className="sub">
          The equipment your Run Mode checkpoints depend on — what each is for,
          how to use it, and what to buy.
        </p>
        <div className="tool-grid">
          {LAB_TOOLS.map((t) => (
            <div className="tool-card" key={t.name}>
              <div className="tool-icon">{t.icon}</div>
              <div className="chem-name">{t.name}</div>
              <p className="tool-why">{t.why}</p>
              <p className="tool-how"><b>How:</b> {t.how}</p>
              <p className="tool-buy">🛒 {t.buy}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
