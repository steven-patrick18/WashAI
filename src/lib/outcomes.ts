// Module 4 — batch outcome vocabulary, shared by UI, API and prompt builder.
export const OUTCOMES = [
  { value: "PERFECT", label: "Perfect shade", good: true },
  { value: "TOO_DARK", label: "Too dark", good: false },
  { value: "TOO_LIGHT", label: "Too light", good: false },
  { value: "EXCESS_DAMAGE", label: "Excess damage", good: false },
  { value: "HIGH_SHRINKAGE", label: "High shrinkage", good: false },
  { value: "UNEVEN_SHADE", label: "Uneven shade", good: false },
  { value: "CUSTOMER_REJECTION", label: "Customer rejection", good: false },
] as const;

export type OutcomeValue = (typeof OUTCOMES)[number]["value"];

export function isOutcome(v: string): v is OutcomeValue {
  return OUTCOMES.some((o) => o.value === v);
}

export function outcomeLabel(v: string): string {
  return OUTCOMES.find((o) => o.value === v)?.label ?? v;
}
