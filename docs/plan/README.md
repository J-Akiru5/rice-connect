# RiceConnect product plan

Status: **approved direction, Phase 0 in progress; Release 3 in production; Phase 1 decisions taken** (4 Oct 2026: keep four apps, O3–O5 approved, F-03 target — decisions M32–M36). Owner: Jeff (Syntaxure Labs). Written for 2–3 developers working with AI agents.

This folder is the source of truth for turning the Enactus prototype into an industry-grade product. Agents and developers follow these files; the HTML portal is a rendered copy for reading and sharing. When the two disagree, these files win.

## TL;DR

- **Two tracks, one repo.** The Enactus demo is frozen as a release branch and stays deployable. The product is built in the same monorepo, starting from the UI shell, with data contracts fixed at the same time.
- **Order of work.** Phase 0 (now to Oct 9): run the Oct 6–7 usability test on production (Release 3, simulated data) and collect findings; the owner lifted the production freeze on 4 Oct after checking sign-in (M31). Phase 1: guardrails and foundations. Phase 2: the functional UI shell for every role, built against mock adapters. Phase 3: the Supabase backend behind the same adapters. Phase 4: privacy, SMS and operations readiness. Phase 5: the real pilot with one cluster.
- **Idiot-proofing is enforced by machines, not by memory.** Required CI on `develop`, `staging` and `main` (no reviewer needed), lint rules that block the known mistakes, Playwright end-to-end tests in CI, one component kit that makes the accessible and safe path the easy path, and one form and data pattern used everywhere.
- **No real personal data before Phase 4 passes.** The usability test uses the simulated prototype only.

## Files

| File | What it decides |
|---|---|
| [01-decisions.md](01-decisions.md) | The owner's answers, the corrections made to the brief, and the open decisions that still need the owner. |
| [02-roadmap.md](02-roadmap.md) | Phases, the gate that ends each phase, and what is out of scope in each. |
| [03-architecture.md](03-architecture.md) | Target architecture: packages, adapters, data contracts, the Supabase schema draft, environments, demo mode. |
| [04-ux-standards.md](04-ux-standards.md) | UI/UX standards and the idiot-proofing catalogue: states, forms, confirmations, copy, accessibility, devices. |
| [05-engineering-standards.md](05-engineering-standards.md) | Code standards: TypeScript, lint rules, package boundaries, testing, CI, branches, dependencies, security, performance. |
| [06-agent-playbook.md](06-agent-playbook.md) | How AI agents take a task: ticket template, model routing, definition of done, what an agent must never do. |
| [07-usability-test.md](07-usability-test.md) | The Oct 6–7 usability test: scripts per role, consent, observation sheet, severity scale, findings log. |
| [08-pilot-readiness.md](08-pilot-readiness.md) | What must be true before real people's data goes in: Data Privacy Act (RA 10173), SMS, operations. |
| [09-backlog.md](09-backlog.md) | Prioritised tickets with acceptance criteria, sized for agents. |
| [10-changelog.md](10-changelog.md) | What has shipped to production, release by release. |
| [AGENTS.next.md](AGENTS.next.md) | The product rules, adopted as `AGENTS.md` (F-02, M36); kept for provenance. |

## How to use this plan

1. Pick the top open ticket in [09-backlog.md](09-backlog.md) for the current phase.
2. Copy the ticket into a GitHub issue using the template in [06-agent-playbook.md](06-agent-playbook.md).
3. Hand it to the agent the routing table names. The agent reads `AGENTS.md`, this folder, and the files the ticket lists.
4. The PR must pass CI and tick the definition of done. Merge into `develop`; promote to `staging`, then `main`, by PR.
5. If a ticket changes a rule or a decision, record it in `docs/DECISIONS.md` in the same PR.

## What is verified and what is not

Verified in the repo on 4 Oct 2026 (commit `cfb7147` on `develop`):
- Thirty `page.tsx` routes across four apps, none with a route-level `error.tsx`, `loading.tsx` or `not-found.tsx`.
- Twenty `rgba(...)` colour literals inside class names that the current hex-only guard does not catch.
- Eleven test files (domain, store, ui, one in screens); no component tests and no end-to-end tests.
- ESLint runs `next/core-web-vitals` only. TypeScript runs in `strict` mode.
- The same theme boot script is copied into four app layouts.
- First-load JavaScript per route is about 133–145 kB (from `next build` output).

Not verified: anything visual in a browser (no browser runs in agent sessions), and whether production is public without a Vercel login. Both are owner checks in Phase 0.
