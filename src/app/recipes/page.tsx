import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { outcomeLabel } from "@/lib/outcomes";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      fabric: { select: { name: true } },
      results: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <main className="wrap">
      <div className="card">
        <h2>Recipe history</h2>
        <p className="sub">
          Every generated recipe is saved. Open one to record the batch outcome —
          that feedback automatically improves the next recipe on the same fabric.
        </p>

        {recipes.length === 0 ? (
          <div className="empty">
            No recipes yet. <Link href="/">Generate your first wash recipe →</Link>
          </div>
        ) : (
          <table className="list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Style / Buyer</th>
                <th>Shade target</th>
                <th>Fabric</th>
                <th>Latest outcome</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id}>
                  <td>{r.createdAt.toLocaleDateString()}</td>
                  <td>
                    {r.styleNumber || "—"}
                    {r.buyer ? ` · ${r.buyer}` : ""}
                  </td>
                  <td>{r.shadeTarget || "—"}</td>
                  <td>{r.fabric?.name || "generic"}</td>
                  <td>
                    {r.results[0] ? (
                      <span className={r.results[0].outcome === "PERFECT" ? "tag ok" : "tag warn"}>
                        {outcomeLabel(r.results[0].outcome)}
                      </span>
                    ) : (
                      <span className="tag">awaiting batch</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/recipes/${r.id}`}>View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
