import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOutcome } from "@/lib/outcomes";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { outcome?: string; operatorNote?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.outcome || !isOutcome(body.outcome)) {
    return NextResponse.json({ error: "Invalid outcome value." }, { status: 400 });
  }

  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  }

  const result = await prisma.productionResult.create({
    data: {
      recipeId: id,
      outcome: body.outcome,
      operatorNote: body.operatorNote?.slice(0, 2000) || null,
    },
  });

  return NextResponse.json({ id: result.id });
}
