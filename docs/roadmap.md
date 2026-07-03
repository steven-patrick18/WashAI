# WashAI — 20-Module Roadmap & Status

Goal: **a first-time washing person can do top-grade, repeatable washing** —
and the system gets smarter with every batch (AI-DOS vision in [vision.md](vision.md)).

| # | Module | Status | Where / What's next |
|---|--------|--------|---------------------|
| 1 | Factory Master Setup | 🟡 **Machines done** | `/masters` — machine CRUD live. Next: factory profile, plants, departments, targets |
| 2 | Fabric Intelligence | 🟢 **Working** | `/masters` fabric CRUD + fabric data drives every recipe. Next: standalone fabric analysis ("predict wash behaviour" report) |
| 3 | Recipe AI Generator | 🟢 **Working** | `/` — full brief → production recipe with teaching fields (safety, checkpoints, common mistakes) |
| 4 | Recipe Learning Engine | 🟢 **Working** | Outcomes recorded per batch are injected into future prompts per fabric. Next: cross-fabric learning + auto-adjust summaries |
| 5 | Shade Prediction | 🟡 **Groundwork** | `/shades` chart + predicted-shade matching. Next: colour delta (ΔE) vs buyer standard, shade grading |
| 6 | Live Production Monitoring | 🟡 **Seed** | Guided Run Mode tracks stage progress per batch. Next: persist runs server-side → live "machines running" board |
| 7 | Chemical Intelligence | 🔴 Planned | Chemical master (stock, price, supplier, TDS link) → feeds Costing + alternatives suggestions |
| 8 | Costing AI | 🔴 Planned | Per-garment cost derived from recipe stages × chemical prices × water/steam rates |
| 9 | Quality Control AI | 🔴 Planned | QC parameter capture per batch → pass/fail prediction (needs batch history volume) |
| 10 | Sustainability Engine | 🔴 Planned | Water/chemical totals are already in recipes — aggregate into per-batch consumption reports |
| 11 | Defect Analysis AI | 🟡 **Partial** | Outcome vocabulary covers major defects; knowledge base answers corrective-action questions. Next: defect photos (→ Module 15) |
| 12 | Buyer Management | 🔴 Planned | Buyer profiles, shade standards, approved-recipe locking |
| 13 | Knowledge Base AI | 🟢 **Working** | `/knowledge` — PDF library + grounded Q&A with citations. Next: chunked retrieval for big libraries |
| 14 | Voice AI (5 languages) | 🔴 Planned | Speech-to-text → existing generate API; Hindi/English first |
| 15 | Vision AI | 🔴 Planned | Photo of garment → shade match/defect detect (Claude vision API — no custom model needed for v1) |
| 16 | Factory Dashboard | 🔴 Planned | Aggregations over recipes/outcomes/runs |
| 17 | Predictive AI | 🔴 Planned | Needs history volume from Modules 4/6/9 first |
| 18 | ERP Integration | 🔴 Planned | REST API already exists; ERPNext webhook adapter first |
| 19 | Mobile App / Roles | 🟡 **Roles done** | OWNER/MANAGER/OPERATOR auth live; web app is mobile-usable. Next: recipe approval flow (manager), PWA install |
| 20 | Self-Evolution Engine | 🟡 **Loop exists** | Module 4 is the seed. Next: machine/operator performance comparison once run data accumulates |

## The "first-time washer" pillar (cross-cutting — DONE this release)

- Every recipe stage teaches: **why** (purpose), **what can hurt you** (safety),
  **how you know it worked** (checkpoint)
- **Guided Run Mode** (`/recipes/[id]/run`): one stage at a time, built-in
  countdown timer, mandatory checkpoint tick before the next stage unlocks,
  progress survives page reloads
- **Common first-timer mistakes** listed on every recipe
- Demo training recipe: `DEMO-001` (run `npx tsx prisma/demo-recipe.ts`)

## Suggested build order (next 3 releases)

1. **Chemicals + Costing (7+8)** — chemical master with prices → real ₹/garment on every recipe
2. **Buyer Management + approval flow (12+19)** — manager approves recipe before operators can run it
3. **Vision v1 (15)** — photo → shade comparison via Claude vision; feeds QC (9) and defects (11)
