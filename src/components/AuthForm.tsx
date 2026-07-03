"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "setup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSetup = mode === "setup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(isSetup ? "/api/auth/setup" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSetup ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form className="card auth-card" onSubmit={submit}>
      <div className="auth-logo">Wash<span>AI</span></div>
      <h2>{isSetup ? "Create the owner account" : "Sign in"}</h2>
      <p className="sub">
        {isSetup
          ? "First-time setup: this account gets the OWNER role and manages all other users."
          : "Use the account your factory owner created for you."}
      </p>

      {error && <div className="error">{error}</div>}

      {isSetup && (
        <>
          <label>Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </>
      )}

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus={!isSetup}
      />

      <label>Password {isSetup && <span className="hint">(min 8 characters)</span>}</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={isSetup ? 8 : undefined}
      />

      <button type="submit" disabled={busy}>
        {busy ? "Please wait…" : isSetup ? "Create owner account" : "Sign in"}
      </button>
    </form>
  );
}
