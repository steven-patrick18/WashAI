import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { GeneratedRecipe } from "@/lib/recipe";
import { outcomeLabel } from "@/lib/outcomes";
import RecipeView from "@/components/RecipeView";
import OutcomePanel from "@/components/OutcomePanel";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      fabric: true,
      machine: true,
      results: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!recipe) notFound();

  const generated = recipe.generated as unknown as GeneratedRecipe;

  return (
    <main className="wrap">
      <p>
        <Link href="/recipes">← Back to history</Link>
      </p>

      <div className="grid">
        <div>
          <div className="card">
            <h2>Batch details</h2>
            <p className="sub">
              {recipe.styleNumber || "No style #"}
              {recipe.buyer ? ` · ${recipe.buyer}` : ""} ·{" "}
              {recipe.createdAt.toLocaleString()}
            </p>
            <div className="meta" style={{ margin: 0 }}>
              <span><b>Fabric</b>{recipe.fabric?.name ?? "generic"}</span>
              <span><b>Machine</b>{recipe.machine?.name ?? "assumed"}</span>
              <span><b>Qty</b>{recipe.quantityPcs ?? "—"}</span>
              <span><b>Shade</b>{recipe.shadeTarget ?? "—"}</span>
            </div>
          </div>

          <OutcomePanel recipeId={recipe.id} />

          {recipe.results.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <h2>Recorded outcomes</h2>
              <p className="sub">These feed the learning engine for this fabric.</p>
              <ul className="risks" style={{ borderLeftColor: "var(--indigo-500)" }}>
                {recipe.results.map((res) => (
                  <li key={res.id}>
                    <b>{outcomeLabel(res.outcome)}</b>
                    {res.operatorNote ? ` — ${res.operatorNote}` : ""}{" "}
                    <span style={{ color: "var(--muted)" }}>
                      ({res.createdAt.toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <RecipeView recipe={generated} />
      </div>
    </main>
  );
}
