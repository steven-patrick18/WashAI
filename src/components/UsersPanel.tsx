"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

export default function UsersPanel({ users, selfId }: { users: UserRow[]; selfId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OPERATOR");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create user.");
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this user? They will be signed out and unable to log in.")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not delete user.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid">
      <form className="card" onSubmit={create}>
        <h2>Add a user</h2>
        <p className="sub">
          Operators run recipes and record outcomes. Managers additionally approve
          recipes (coming next). Owners manage users.
        </p>

        {error && <div className="error">{error}</div>}

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password <span className="hint">(min 8 characters)</span></label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="OPERATOR">Operator</option>
          <option value="MANAGER">Manager</option>
          <option value="OWNER">Owner</option>
        </select>

        <button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create user"}
        </button>
      </form>

      <div className="card">
        <h2>Team</h2>
        <p className="sub">{users.length} account{users.length === 1 ? "" : "s"}</p>
        <table className="list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}{u.id === selfId ? " (you)" : ""}</td>
                <td>{u.email}</td>
                <td>
                  <span className={u.role === "OWNER" ? "tag ok" : "tag"}>{u.role}</span>
                </td>
                <td>{u.date}</td>
                <td>
                  {u.id !== selfId && (
                    <a className="doc-delete" onClick={() => remove(u.id)}>✕</a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
