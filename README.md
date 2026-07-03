# WashAI — Digital Washing Master

> "Convert traditional washing-master experience into an intelligent, self-learning AI system."

This repository is the **Recipe AI core** — the intelligent heart of the larger
[AI Denim Operating System](docs/vision.md) vision. It's a thin, working vertical
slice you can demo to a factory owner:

1. **Fabric + Machine master data** (Modules 1 & 2) — seeded, editable in the DB.
2. **Recipe AI Generator** (Module 3) — a garment brief + fabric + machine goes
   in; Claude returns a complete, production-ready wash recipe (process sequence,
   per-stage chemicals, water, temperature, time, pH, RPM, machine load, shade
   prediction and risk cautions).
3. **Recipe Learning Engine** (Module 4) — `/recipes` history; record each
   batch outcome (perfect / too dark / damage / …) and the last 10 outcomes on
   that fabric are injected into the next generation so recipes self-correct.
4. **Knowledge Base AI** (Module 13) — `/knowledge`; upload the PDFs you buy
   (see [docs/knowledge-base-sources.md](docs/knowledge-base-sources.md) for the
   buying guide) and ask washing-master questions grounded in those documents.

## Stack

- **Next.js 15** (App Router, TypeScript) — one codebase, grows into mobile via the same API.
- **Prisma** — SQLite for zero-setup local dev (default); switch the datasource
  provider to `postgresql` + use `docker-compose.yml` (or a cloud URL) for production.
- **Claude API** (`claude-opus-4-8`, adaptive thinking) — the washing-master reasoning.

## Prerequisites

- Node.js 20+
- An Anthropic API key — https://console.anthropic.com/

## Setup

```bash
# 1. Install
npm install

# 2. Configure — edit .env and paste your ANTHROPIC_API_KEY
#    (DATABASE_URL defaults to a local SQLite file — nothing to install)

# 3. Create the schema and seed sample fabrics/machines
npm run db:push
npm run db:seed

# 4. Run
npm run dev
```

Open http://localhost:3000, fill the brief, and click **Generate wash recipe**.

> No database yet? The app still generates recipes — just leave the fabric/machine
> dropdowns on "none" and Claude will assume sensible defaults.

## Project layout

```
prisma/
  schema.prisma      Fabric, Machine, Recipe, ProductionResult
  seed.ts            Sample denim fabrics + machines
src/
  lib/
    prisma.ts        DB client
    anthropic.ts     Claude client + model id
    recipe.ts        Prompt + generation (the washing-master brain)
  app/
    page.tsx         Loads master data, renders the form
    api/recipes/generate/route.ts   POST → generate + persist
  components/
    RecipeForm.tsx   Brief form + recipe renderer
```

## Where this goes next

The [full vision](docs/vision.md) is 20 modules. Modules 2, 3, 4 and 13 now have
working slices. Natural next steps:

- **Modules 1/2 CRUD**: screens to add/edit factories, machines and fabrics
  (today they're seeded via `prisma/seed.ts` or Prisma Studio: `npm run db:studio`).
- **Module 5 — Shade Prediction**: structured shade grading + buyer shade comparison.
- **Module 8 — Costing**: per-garment chemical/water/steam cost derived from the
  generated recipe stages.
- **Knowledge retrieval at scale**: today Q&A attaches whole PDFs per question;
  move to chunked retrieval (embeddings) once the library grows past a few books.
