"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GeneratedRecipe } from "@/lib/recipe";

/**
 * Guided execution for a wash recipe — one stage at a time, with timer,
 * safety warnings, and a mandatory checkpoint before advancing. Progress is
 * saved in localStorage so a page reload (or a multi-hour wash) never loses
 * the operator's place.
 */
interface Saved {
  idx: number;
  finished: boolean;
}

export default function RunMode({
  recipeId,
  label,
  recipe,
}: {
  recipeId: string;
  label: string;
  recipe: GeneratedRecipe;
}) {
  const storageKey = `washai-run-${recipeId}`;
  const stages = recipe.stages ?? [];

  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Timer state (per stage)
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stage = stages[idx];

  // Restore progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        if (saved.idx >= 0 && saved.idx < stages.length) setIdx(saved.idx);
        setFinished(!!saved.finished);
      }
    } catch {}
    setLoaded(true);
  }, [storageKey, stages.length]);

  // Persist progress
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(storageKey, JSON.stringify({ idx, finished } satisfies Saved));
  }, [idx, finished, loaded, storageKey]);

  // Reset per-stage state when the stage changes
  useEffect(() => {
    setChecked(false);
    setRunning(false);
    setSecondsLeft((stages[idx]?.timeMin ?? 0) * 60);
  }, [idx, stages]);

  // Countdown
  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  function fmt(total: number): string {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function next() {
    if (idx + 1 >= stages.length) {
      setFinished(true);
    } else {
      setIdx(idx + 1);
    }
  }

  function restart() {
    localStorage.removeItem(storageKey);
    setFinished(false);
    setIdx(0);
  }

  if (!loaded) return null;

  if (finished || stages.length === 0) {
    return (
      <div className="card run-done">
        <div className="run-done-icon">🏁</div>
        <h2>Wash complete</h2>
        <p className="sub">
          All {stages.length} stages done for <b>{label}</b>. One last thing — and it
          matters most: record how the batch came out so WashAI learns for next time.
        </p>
        <div className="run-done-actions">
          <Link className="btn-primary" href={`/recipes/${recipeId}`}>
            Record batch outcome →
          </Link>
          <a className="btn-ghost" onClick={restart}>
            Run again
          </a>
        </div>
      </div>
    );
  }

  const timerTotal = (stage.timeMin ?? 0) * 60;
  const timeUp = timerTotal > 0 && secondsLeft === 0;

  return (
    <div className="run">
      <div className="run-head">
        <div>
          <div className="run-label">{label}</div>
          <div className="run-progress">
            Stage {idx + 1} of {stages.length}
          </div>
        </div>
        <Link href={`/recipes/${recipeId}`} className="btn-ghost">
          Exit run mode
        </Link>
      </div>

      <div className="run-track">
        {stages.map((s, i) => (
          <div
            key={i}
            className={`run-dot${i < idx ? " done" : ""}${i === idx ? " now" : ""}`}
            title={s.name}
          />
        ))}
      </div>

      <div className="card run-stage">
        <h2>
          {idx + 1}. {stage.name}
        </h2>
        <p className="run-purpose">{stage.purpose}</p>

        <div className="run-params">
          <div><b>{stage.temperatureC}°C</b><span>Temperature</span></div>
          <div><b>{stage.timeMin} min</b><span>Time</span></div>
          <div><b>pH {stage.ph}</b><span>Bath pH</span></div>
          <div><b>{stage.rpm}</b><span>RPM</span></div>
        </div>
        <div className="run-water">💧 {stage.waterLevel}</div>

        {stage.chemicals?.length > 0 && (
          <table className="chem run-chem">
            <tbody>
              {stage.chemicals.map((c, j) => (
                <tr key={j}>
                  <td>{c.name}</td>
                  <td>{c.dosage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {stage.safety?.length > 0 && (
          <div className="stage-safety run-safety">
            {stage.safety.map((w, j) => (
              <div key={j}>⚠️ {w}</div>
            ))}
          </div>
        )}

        {timerTotal > 0 && (
          <div className={`run-timer${timeUp ? " up" : ""}`}>
            <span className="run-clock">{fmt(secondsLeft)}</span>
            {timeUp ? (
              <span className="run-timeup">TIME UP — do the checkpoint</span>
            ) : (
              <button
                className="btn-timer"
                onClick={() => setRunning(!running)}
                type="button"
              >
                {running ? "Pause" : secondsLeft === timerTotal ? "Start timer" : "Resume"}
              </button>
            )}
          </div>
        )}

        {stage.checkpoint && (
          <label className="run-checkpoint">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span>
              <b>Checkpoint — verify before continuing:</b> {stage.checkpoint}
            </span>
          </label>
        )}

        <div className="run-actions">
          <button
            className="btn-ghost"
            type="button"
            disabled={idx === 0}
            onClick={() => setIdx(idx - 1)}
          >
            ← Previous
          </button>
          <button
            type="button"
            disabled={!!stage.checkpoint && !checked}
            onClick={next}
          >
            {idx + 1 === stages.length ? "Finish wash 🏁" : "Stage done → Next"}
          </button>
        </div>
        {!!stage.checkpoint && !checked && (
          <p className="run-hint">Tick the checkpoint to unlock the next stage.</p>
        )}
      </div>
    </div>
  );
}
