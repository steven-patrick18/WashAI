import Anthropic from "@anthropic-ai/sdk";

// Default to the most capable model. Override with ANTHROPIC_MODEL if needed.
export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

// Construct lazily so a missing key never throws at import/build time — only
// when a recipe is actually generated. The SDK resolves ANTHROPIC_API_KEY
// (or an `ant auth login` profile) from the environment.
let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}
