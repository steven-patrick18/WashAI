import type { Metadata } from "next";
import ShadeChart, { VintageRow } from "@/components/ShadeChart";
import DenimSwatch from "@/components/DenimSwatch";
import { WASH_EFFECTS } from "@/lib/shades";

export const metadata: Metadata = {
  title: "Shade Chart — WashAI",
};

export default function ShadesPage() {
  return (
    <main className="wrap">
      <div className="card">
        <h2>Denim shade chart</h2>
        <p className="sub">
          The standard wash-shade vocabulary WashAI predicts against. Swatches are
          drawn procedurally (twill weave + wash-down) — hover a card for the
          typical route to reach that shade. Use the same names in your garment
          briefs for consistent shade communication with buyers.
        </p>
        <ShadeChart showHints />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Vintage intensity reference</h2>
        <p className="sub">
          What “light / medium / heavy vintage” means on a mid-blue base — abrasion
          depth and whisker contrast increase left to right.
        </p>
        <VintageRow />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Wash-effect reference</h2>
        <p className="sub">
          The building blocks a recipe combines, with typical process windows.
        </p>
        <div className="effect-grid">
          {WASH_EFFECTS.map((e) => (
            <div className="effect-card" key={e.name}>
              <DenimSwatch style={e.style} width="100%" height={80} />
              <div className="swatch-name">{e.name}</div>
              <div className="effect-what">{e.what}</div>
              <div className="effect-process">{e.process}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
