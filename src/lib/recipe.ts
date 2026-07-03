import type AnthropicNS from "@anthropic-ai/sdk";
import type { Fabric, Machine } from "@prisma/client";
import { getAnthropic, MODEL } from "./anthropic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecipeInput {
  styleNumber?: string;
  buyer?: string;
  quantityPcs?: number;
  shadeTarget?: string;
  vintageLevel?: string; // light | medium | heavy
  handFeel?: string; // soft | medium | firm
}

export interface RecipeStage {
  name: string; // e.g. "Enzyme Wash"
  purpose: string; // why this step exists for this fabric/shade
  chemicals: { name: string; dosage: string }[]; // dosage as "1.5 g/L" or "2%"
  waterLevel: string; // e.g. "1:8 liquor ratio" or "2000 L"
  temperatureC: number;
  timeMin: number;
  ph: number;
  rpm: number;
}

export interface GeneratedRecipe {
  summary: string;
  processSequence: string[]; // ordered step names, the high-level route
  stages: RecipeStage[]; // detailed recipe per stage
  machineLoad: string; // e.g. "40 kg (approx 100 pcs)"
  batchSize: string;
  numberOfCycles: number;
  predictedShade: string;
  risks: string[]; // damage/shrinkage/back-staining cautions
  notes: string;
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a master denim washing technician with 30 years of
experience across laundries supplying Levi's, Zara, H&M and Bestseller. You know
enzymes, cellulase, bleach (NaOCl / KMnO4), neutralisation, softeners, resins,
tints and the behaviour of indigo, sulphur-bottom and stretch denims.

You convert a garment brief plus fabric and machine data into a complete,
production-ready wash recipe. Be specific and realistic with chemical dosages,
liquor ratios, temperatures, times, pH and RPM — the numbers must be values a
real laundry could load into a Tonello/Tolkar machine. Protect lycra recovery
(avoid high temperature on stretch), control back-staining on rigid indigo, and
keep damage/shrinkage within buyer tolerance.

Respond with ONE JSON object and nothing else — no markdown, no code fences, no
commentary before or after. The JSON MUST match exactly this shape:

{
  "summary": string,
  "processSequence": string[],
  "stages": [
    {
      "name": string,
      "purpose": string,
      "chemicals": [{ "name": string, "dosage": string }],
      "waterLevel": string,
      "temperatureC": number,
      "timeMin": number,
      "ph": number,
      "rpm": number
    }
  ],
  "machineLoad": string,
  "batchSize": string,
  "numberOfCycles": number,
  "predictedShade": string,
  "risks": string[],
  "notes": string
}`;

function line(label: string, value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return `- ${label}: ${value}`;
}

export function buildUserPrompt(
  input: RecipeInput,
  fabric?: Fabric | null,
  machine?: Machine | null,
  learnings: string[] = [],
): string {
  const brief = [
    line("Style number", input.styleNumber),
    line("Buyer", input.buyer),
    line("Quantity (pcs)", input.quantityPcs),
    line("Shade target", input.shadeTarget),
    line("Vintage level", input.vintageLevel),
    line("Hand feel", input.handFeel),
  ]
    .filter(Boolean)
    .join("\n");

  const fabricBlock = fabric
    ? [
        line("Name", fabric.name),
        line("Supplier", fabric.supplier),
        line("Construction", fabric.construction),
        line("Warp/weft count", `${fabric.warpCount ?? "?"} / ${fabric.weftCount ?? "?"}`),
        line("GSM", fabric.gsm),
        line("Ounce", fabric.ounce),
        line("Composition", fabric.composition),
        line("Stretch %", fabric.stretchPct),
        line("Lycra %", fabric.lycraPct),
        line("Indigo depth", fabric.indigoDepth),
        line("Sulphur dye %", fabric.sulfurDyePct),
        line("Yarn type", fabric.yarnType),
        line("Finish", fabric.finish),
        line("Shrinkage %", fabric.shrinkagePct),
        line("Fabric notes", fabric.notes),
      ]
        .filter(Boolean)
        .join("\n")
    : "No fabric record selected — assume a standard mid-weight indigo denim and state that assumption.";

  const machineBlock = machine
    ? [
        line("Name", machine.name),
        line("Type", machine.type),
        line("Capacity (kg)", machine.capacityKg),
        line("RPM", machine.rpm),
        line("Water per cycle (L)", machine.waterPerCycleL),
        line("Max temp (C)", machine.maxTempC),
        line("Steam (kg/hr)", machine.steamKgPerHr),
        line("Machine notes", machine.notes),
      ]
        .filter(Boolean)
        .join("\n")
    : "No machine selected — assume a 250kg front-loading washer/extractor.";

  const learningBlock =
    learnings.length > 0
      ? `\nPAST PRODUCTION FEEDBACK (Module 4 — learn from these real batch outcomes on this fabric; adjust dosage, temperature, timing and pH to avoid repeating failures and to repeat successes)\n${learnings
          .map((l) => `- ${l}`)
          .join("\n")}\n`
      : "";

  return `GARMENT BRIEF\n${brief || "(minimal brief — use sensible defaults)"}

FABRIC\n${fabricBlock}

MACHINE\n${machineBlock}
${learningBlock}
Produce the complete wash recipe as the specified JSON object.`;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/** Pull the first balanced JSON object out of a model response. */
function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model response.");
  }
  return text.slice(start, end + 1);
}

export async function generateRecipe(
  input: RecipeInput,
  fabric?: Fabric | null,
  machine?: Machine | null,
  learnings: string[] = [],
): Promise<GeneratedRecipe> {
  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 16000,
    // Opus 4.8 uses adaptive thinking. The installed SDK's types predate it, so
    // cast — the runtime API accepts { type: "adaptive" }.
    thinking: { type: "adaptive" } as unknown as AnthropicNS.MessageCreateParams["thinking"],
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildUserPrompt(input, fabric, machine, learnings) },
    ],
  });

  const text = response.content
    .filter((b): b is AnthropicNS.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return JSON.parse(extractJson(text)) as GeneratedRecipe;
}
