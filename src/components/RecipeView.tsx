import type { GeneratedRecipe } from "@/lib/recipe";
import { matchShade } from "@/lib/shades";
import DenimSwatch from "./DenimSwatch";

export default function RecipeView({ recipe }: { recipe: GeneratedRecipe }) {
  const shadeRef = matchShade(recipe.predictedShade);
  return (
    <div className="card">
      <div className="summary">
        {recipe.summary}
        <div className="predicted-row">
          {shadeRef && (
            <DenimSwatch style={shadeRef.style} width={64} height={46} rounded={8} />
          )}
          <div>
            <div className="predicted">Predicted shade · {recipe.predictedShade}</div>
            {shadeRef && (
              <div className="predicted-ref">Chart reference: {shadeRef.name}</div>
            )}
          </div>
        </div>
      </div>

      {recipe.processSequence?.length > 0 && (
        <div className="route">
          {recipe.processSequence.map((step, i) => (
            <span className="chip" key={i}>{i + 1}. {step}</span>
          ))}
        </div>
      )}

      {recipe.stages?.map((s, i) => (
        <div className="stage" key={i}>
          <h3>{i + 1}. {s.name}</h3>
          <p className="purpose">{s.purpose}</p>
          <div className="params">
            <span><b>Temp</b> {s.temperatureC}°C</span>
            <span><b>Time</b> {s.timeMin} min</span>
            <span><b>pH</b> {s.ph}</span>
            <span><b>RPM</b> {s.rpm}</span>
            <span><b>Water</b> {s.waterLevel}</span>
          </div>
          {s.chemicals?.length > 0 && (
            <table className="chem">
              <tbody>
                {s.chemicals.map((c, j) => (
                  <tr key={j}>
                    <td>{c.name}</td>
                    <td>{c.dosage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {s.safety?.length > 0 && (
            <div className="stage-safety">
              {s.safety.map((w, j) => (
                <div key={j}>⚠️ {w}</div>
              ))}
            </div>
          )}
          {s.checkpoint && (
            <div className="stage-checkpoint">✅ Checkpoint: {s.checkpoint}</div>
          )}
        </div>
      ))}

      <div className="meta">
        <span><b>Machine load</b>{recipe.machineLoad}</span>
        <span><b>Batch size</b>{recipe.batchSize}</span>
        <span><b>Cycles</b>{recipe.numberOfCycles}</span>
      </div>

      {recipe.risks?.length > 0 && (
        <ul className="risks">
          {recipe.risks.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      {recipe.commonMistakes?.length > 0 && (
        <div className="mistakes">
          <b>First-timer mistakes to avoid</b>
          <ul>
            {recipe.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {recipe.notes && <p className="notes">{recipe.notes}</p>}
    </div>
  );
}
