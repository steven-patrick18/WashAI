import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "WashAI — AI Denim Washing Master",
  description:
    "Convert traditional washing-master experience into an intelligent, self-learning AI. Recipe AI core.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <header className="masthead">
          <div className="wrap">
            <span className="badge">Recipe AI Core · MVP</span>
            <h1>WashAI — Digital Washing Master</h1>
            <p>
              Enter a garment brief with fabric and machine data; Claude generates a
              complete, production-ready wash recipe.
            </p>
            {session && (
              <div className="navbar">
                <nav className="nav">
                  <a href="/">Recipe Generator</a>
                  <a href="/recipes">Recipe History</a>
                  <a href="/shades">Shade Chart</a>
                  <a href="/knowledge">Knowledge Base</a>
                  {session.role === "OWNER" && <a href="/users">Users</a>}
                </nav>
                <div className="userbar">
                  <span className="user-chip">
                    {session.name} · {session.role}
                  </span>
                  <form action="/api/auth/logout" method="post">
                    <button className="logout" type="submit">Sign out</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
