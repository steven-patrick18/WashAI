import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type AnthropicNS from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getAnthropic, MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 180; // reading whole PDFs takes time

const ASK_SYSTEM = `You are WashAI's Knowledge Base — a master denim washing
technician answering questions for laundry staff. Ground your answer in the
attached reference documents when they are provided; cite which document (by
title) supports each key claim. If the documents don't cover the question,
answer from established denim wet-processing practice and say so. Be practical:
give dosages, temperatures, times and pH where relevant. Answer in clear,
simple English suitable for factory technicians.`;

interface Body {
  question?: string;
  documentIds?: string[];
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

  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  const docs = body.documentIds?.length
    ? await prisma.document.findMany({ where: { id: { in: body.documentIds } } })
    : [];

  // Attach each selected PDF as a document block — Claude reads them natively.
  const content: AnthropicNS.ContentBlockParam[] = [];
  for (const doc of docs) {
    const bytes = await readFile(path.join(process.cwd(), "uploads", doc.filename));
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: bytes.toString("base64"),
      },
      title: doc.title,
    });
  }
  content.push({ type: "text", text: question });

  try {
    const response = await getAnthropic().messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" } as unknown as AnthropicNS.MessageCreateParams["thinking"],
      system: ASK_SYSTEM,
      messages: [{ role: "user", content }],
    });

    const answer = response.content
      .filter((b): b is AnthropicNS.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    return NextResponse.json({
      answer,
      usedDocuments: docs.map((d) => d.title),
    });
  } catch (err) {
    console.error("Knowledge base ask failed:", err);
    const message = err instanceof Error ? err.message : "Ask failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
