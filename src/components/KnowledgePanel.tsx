"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Doc {
  id: string;
  title: string;
  sizeMb: number;
  date: string;
}

export default function KnowledgePanel({ documents }: { documents: Doc[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string[]>(documents.slice(0, 2).map((d) => d.id));
  const [question, setQuestion] = useState("How do I reduce back staining in 12 oz stretch denim?");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [usedDocs, setUsedDocs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function removeDoc(id: string) {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setSelected((s) => s.filter((x) => x !== id));
    router.refresh();
  }

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function ask() {
    if (!question.trim()) return;
    setAsking(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, documentIds: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ask failed.");
      setAnswer(data.answer);
      setUsedDocs(data.usedDocuments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Library</h2>
        <p className="sub">
          Upload the PDFs you collect (books, TDS sheets, papers — see{" "}
          <code>docs/knowledge-base-sources.md</code> for the buying guide). Tick
          the ones to consult, then ask below. Max 30 MB per PDF.
        </p>

        <input ref={fileRef} type="file" accept="application/pdf" />
        <button onClick={upload} disabled={uploading}>
          {uploading ? "Uploading…" : "Upload PDF"}
        </button>

        <div style={{ marginTop: 16 }}>
          {documents.length === 0 && (
            <div className="empty">No documents yet — WashAI has no memory to draw on.</div>
          )}
          {documents.map((d) => (
            <div className="doc" key={d.id}>
              <input
                type="checkbox"
                checked={selected.includes(d.id)}
                onChange={() => toggle(d.id)}
              />
              <div>
                <div className="doc-title">{d.title}</div>
                <div className="doc-meta">{d.sizeMb} MB · {d.date}</div>
              </div>
              <a className="doc-delete" onClick={() => removeDoc(d.id)}>✕</a>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Ask the washing master</h2>
        <p className="sub">
          Answers are grounded in the ticked documents ({selected.length} selected)
          and cite them by title.
        </p>

        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='e.g. "What enzyme dosage for medium stone-wash on 9.5oz stretch?"'
        />
        <button onClick={ask} disabled={asking}>
          {asking ? "Consulting the library…" : "Ask"}
        </button>

        {error && <div className="error" style={{ marginTop: 16 }}>{error}</div>}

        {answer && (
          <div className="answer">
            {usedDocs.length > 0 && (
              <div className="route" style={{ marginBottom: 10 }}>
                {usedDocs.map((t) => (
                  <span className="chip" key={t}>📄 {t}</span>
                ))}
              </div>
            )}
            <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
