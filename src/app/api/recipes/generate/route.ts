import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRecipe, type RecipeInput } from "@/lib/recipe";
import { MODEL } from "@/lib/anthropic";
import { outcomeLabel } from "@/lib/outcomes";

export const runtime = "nodejs";
export const maxDuration = 120; // recipe generation can take a while at high effort

interface Body extends RecipeInput {
  fabricId?: string;
  machineId?: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Add it to .env and restart." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fabric = body.fabricId
    ? await prisma.fabric.findUnique({ where: { id: body.fabricId } })
    : null;
  const machine = body.machineId
    ? await prisma.machine.findUnique({ where: { id: body.machineId } })
    : null;

  // Module 4 — Recipe Learning Engine: pull recent batch outcomes recorded on
  // this fabric and hand them to the model so it corrects course.
  let learnings: string[] = [];
  if (fabric) {
    const results = await prisma.productionResult.findMany({
      where: { recipe: { fabricId: fabric.id } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        recipe: {
          select: { shadeTarget: true, vintageLevel: true, handFeel: true },
        },
      },
    });
    learnings = results.map((r) => {
      const ctx = [
        r.recipe.shadeTarget && `shade "${r.recipe.shadeTarget}"`,
        r.recipe.vintageLevel && `${r.recipe.vintageLevel} vintage`,
        r.recipe.handFeel && `${r.recipe.handFeel} hand`,
      ]
        .filter(Boolean)
        .join(", ");
      const note = r.operatorNote ? ` Operator note: ${r.operatorNote}` : "";
      return `Batch targeting ${ctx || "similar brief"} → outcome: ${outcomeLabel(r.outcome)}.${note}`;
    });
  }

  try {
    const generated = await generateRecipe(body, fabric, machine, learnings);

    const recipe = await prisma.recipe.create({
      data: {
        styleNumber: body.styleNumber || null,
        buyer: body.buyer || null,
        quantityPcs: body.quantityPcs ?? null,
        shadeTarget: body.shadeTarget || null,
        vintageLevel: body.vintageLevel || null,
        handFeel: body.handFeel || null,
        generated: generated as object,
        model: MODEL,
        fabricId: fabric?.id ?? null,
        machineId: machine?.id ?? null,
      },
    });

    return NextResponse.json({ id: recipe.id, recipe: generated });
  } catch (err) {
    console.error("Recipe generation failed:", err);
    const message =
      err instanceof Error ? err.message : "Recipe generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
