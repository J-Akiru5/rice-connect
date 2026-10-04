# Decisions, corrections and open questions

## Owner decisions (4 Oct 2026)

| # | Question | Decision |
|---|---|---|
| P1 | What is the plan for? | **Freeze the demo, build the product** in the same monorepo. The prototype rules are replaced on purpose by the product rules in [AGENTS.next.md](AGENTS.next.md) at the start of Phase 1. |
| P2 | Production freeze | **`main` is frozen until after the Enactus events.** Work continues on `develop` and `staging`. See correction C4 for the end date. |
| P3 | Guardrails | **Required CI, no required reviewers** on `main`, `staging` and `develop`. Developers merge their own PRs; GitHub refuses a merge while CI is red. |
| P4 | Plan format | **Repo markdown (this folder) as the source of truth**, plus a published HTML portal for humans. |
| P5 | Team | **2–3 developers plus AI agents.** The plan is prescriptive: rules, templates and checklists an agent can follow without judgement calls. |
| P6 | Oct 6–7 | **Usability test on the simulated prototype; the real-data pilot comes later** (after Phase 4). |
| P7 | Libraries | **Approved:** Radix UI primitives, React Hook Form + Zod, TanStack Query, with the owner's guardrails below. Exact versions, nothing else added. |
| P8 | End-to-end tests | **Playwright runs in GitHub Actions CI only**, never in agent sessions. |
| P9 | Branch protection (earlier, M24) | Superseded by P3: still no reviewers, but CI is required. |
| P10 | Sign-in (M23) | Mock Sign In and Sign Up per app (split layout), farmer by mobile number, pages open without signing in in demo mode. |

### Library guardrails (owner's words, binding)

1. **Radix as unstyled primitives only.** Never Radix Themes or shadcn/ui CSS. Each primitive is wrapped once in `packages/ui` using our tokens: glass by default, the hard logistics style inside Haul, 3px focus ring, 44px phone / 40px desktop targets, `prefers-reduced-motion`. Portaled dialogs and menus carry the same style class (glass or hard) as the screen that opened them.
2. **Zod has no default English messages.** Every error is an i18n key with EN, TL and HIL text.
3. **TanStack Query defaults for the local adapter:** `retry: false`, `refetchOnWindowFocus: false`, `staleTime: Infinity`. Loading, error and empty states use our `EmptyState` and `StatusChip` (and the state components in [04-ux-standards.md](04-ux-standards.md)), never a default spinner.
4. Pin exact versions. Add nothing else without asking. The colour guard stays clean.

## Corrections to the brief

These are places where the request, taken literally, would have hurt the result. Each one has a reason and the fix the plan uses.

**C1. "UI shell first, backend later" is right about speed and wrong about order of thinking.**
Building screens before the data model is how teams redo screens. Every screen needs loading, empty, error, forbidden and offline states, and those depend on what the data is and who may see it. *Fix:* build the UI shell first, but fix the data contracts in the same phase (Zod schemas, repository interfaces, the draft database tables and access rules). The screens are built against mock adapters that honour the same contracts, so the backend later plugs in without screen changes.

**C2. "Idiot-proof" and "no branch protection" pulled against each other.**
Without protection, one bad push reaches production and nothing stops it. *Fix (accepted):* required CI, zero reviewers.

**C3. "A real pilot on Oct 6–7" was not feasible, and fast agents don't change that.**
The bottleneck was never typing speed. It was the Data Privacy Act (consent records, privacy notice, secure storage, a person accountable for the data), SMS sender registration lead time, native review of Tagalog and Hiligaynon, and the risk of losing farmers' trust on the first contact. *Fix (accepted):* Oct 6–7 is a moderated usability test on the simulated prototype; the real pilot follows the Phase 4 gate.

**C4. The production freeze should run through the contest on Oct 9, not end on Oct 8.**
`docs/UAT-KIT.html` lists the contest on **Oct 9**. Unfreezing `main` on Oct 8 means a deploy can land the day before the contest. *Recommendation:* keep `main` frozen until the end of Oct 9 and promote the first Phase 1 work on Oct 10. **Needs the owner's confirmation (open question O1).**

**C5. The existing test kit tells testers to use a control that no longer exists.**
`docs/UAT-KIT.html` tasks B1 and D1 say "View as Buyer / Driver" in the header. That switcher was removed in decision M22, and production no longer has it. *Fix:* the kit's B1 and D1 now start from `/buyer/login` and `/driver/login` (updated in the same PR as this plan).

**C6. Four separate apps cost a 2–3 person team more than they return.**
Multi-zones give independent deploys, which this team does not need, and they already caused a real gap: the staging preview of the main app cannot show the staging buyer, driver and farmer apps (decision M16), so new zone pages cannot be tested end to end on staging. They also mean four Vercel projects, four layouts and cross-zone navigation rules. *Recommendation:* fold the four apps into one Next.js app with route groups per role, keeping all `packages/*`. **This contradicts an earlier owner decision (keep separate buyer, driver and farmer apps), so it is open question O2, not a change the plan makes.**

## Open questions for the owner

| # | Question | Recommendation | Blocks |
|---|---|---|---|
| O1 | Keep `main` frozen through Oct 9 (contest day)? | Yes; first Phase 1 promotion on Oct 10. | Phase 1 promotions only. |
| O2 | One app with route groups instead of four multi-zone apps? | Yes, early in Phase 1, before the UI kit work multiplies across four apps. See [03-architecture.md](03-architecture.md#d1-one-app-or-four). | Phase 1 ticket F-10. |
| O3 | Formatter: Prettier or Biome (a new dependency)? | Prettier, run in CI with `--check`; it removes style debates from agent PRs. | Ticket F-06 (optional). |
| O4 | Component tests: Testing Library + jsdom (new dependencies)? | Yes, for the UI kit wrappers only; screens are covered by Playwright. | Ticket Q-03. |
| O5 | Accessibility checks in E2E: `@axe-core/playwright` (new dependency)? | Yes; it catches missing labels and contrast regressions on every PR. | Ticket Q-04. |
| O6 | Error tracking in production: Sentry (new dependency, external service)? | Yes, from Phase 3 (real users), with personal data scrubbed. | Phase 3–4. |
| O7 | Who is the Data Protection Officer (or compliance officer) for the pilot? | Name one person before Phase 4. | Phase 4 gate. |
| O8 | Which SMS aggregator, and who registers the sender name? | Decide in Phase 3; start registration early because it has lead time. | Phase 4 gate. |
