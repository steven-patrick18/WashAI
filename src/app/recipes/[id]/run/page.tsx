import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { GeneratedRecipe } from "@/lib/recipe";
import RunMode from "@/components/RunMode";

export const dynamic = "force-dynamic";

export default async function RunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { fabric: { select: { name: true } }, machine: { select: { name: true } } },
  });
  if (!recipe) notFound();

  const generated = recipe.generated as unknown as GeneratedRecipe;
  const label = [
    recipe.styleNumber,
    recipe.buyer,
    recipe.shadeTarget,
    recipe.fabric?.name,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="wrap">
      <RunMode recipeId={recipe.id} label={label || "Wash batch"} recipe={generated} />
    </main>
  );
}
