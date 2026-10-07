# Backlog

Ordered by phase, then priority. Size: **S** (under half a day of agent work), **M** (about a day), **L** (several days; split before starting if possible). "Model" follows the routing table in [06-agent-playbook.md](06-agent-playbook.md). Each ticket becomes a GitHub issue with the template there; the acceptance criteria below are the minimum.

## Phase 0: freeze and learn

| ID | Ticket | Size | Who | Acceptance criteria |
|---|---|---|---|---|
| P0-01 | Create rollback branch `release/demo-enactus-2026` at production commit `02a6199` | S | Agent | Branch exists on GitHub at that commit; recorded in `docs/DECISIONS.md`. |
| P0-02 | Confirm production opens without a Vercel login | S | Owner | Checked in a private window on a phone and a laptop; result noted in `docs/BLOCKERS.md`. |
| P0-03 | Update `docs/UAT-KIT.html` tasks that use the removed "View as" switcher | S | Agent | B1 and D1 start from `/buyer/login` and `/driver/login`; no mention of "View as" remains. |
| P0-04 | Run the Oct 6–7 usability test | M | Team | Sheets filled per [07-usability-test.md](07-usability-test.md); consent read to everyone; no personal data recorded. |
| P0-05 | Log findings as issues | S | Team | Every severity 2+ finding is an issue with `ux-finding` + `sev-N` labels within 24 hours. |
| P0-06 | ~~Owner answers O2 (one app or four)~~ **Closed (P12): keep four apps** | S | Owner | Recorded in `docs/DECISIONS.md` (M32). (O1 closed by M31.) |

## Phase 1: guardrails and foundations

| ID | Ticket | Size | Model | Acceptance criteria |
|---|---|---|---|---|
| F-01 | Required CI on `develop`, `staging`, `main` | S | Owner | GitHub ruleset: PR required, status checks `check` (and `e2e` once Q-02 lands) required, 0 approvals, no force-push, no deletion. |
| F-02 | Switch rules to [AGENTS.next.md](AGENTS.next.md) | S | MIMO | `AGENTS.md` and `CLAUDE.md` replaced; prototype rules kept in the release branch; decision recorded. |
| F-03 | Upgrade Next.js and React to current stable | M | Kimi 3 | Official codemods run; all builds, tests and the demo pass; no other change in the PR. |
| F-04 | Tighten TypeScript (`noUncheckedIndexedAccess`, `noImplicitOverride`) | M | GLM 2.5 | Flags on; every error fixed without `!` or `any`. |
| F-05 | Package-boundary lint | S | DeepSeek V4 Pro | Rules per [05-engineering-standards.md](05-engineering-standards.md#package-boundaries); a deliberate bad import in a test file fails lint. |
| F-06 | Formatter (O3 approved: Prettier 3.9.9) | S | DeepSeek V4 Pro | Prettier config; `prettier --check` in CI; one formatting-only PR. |
| F-07 | Colour guard covers `rgb`, `rgba`, `hsl`; replace the 20 existing literals with tokens | M | Claude Sonnet | Guard fails on any colour literal outside tokens; all 20 replaced with token-based classes; visual check at 390/1440. |
| F-08 | Lint rules for raw links, `localStorage`, `confirm/alert`, hand-rolled dialogs, English in JSX | M | DeepSeek V4 Pro | Each rule has a failing example in a test fixture; codebase passes. |
| F-09 | One shared theme boot script in `@rc/ui` | S | Flash 3.6 | The four copies in app layouts are replaced by one import; behaviour unchanged. |
| F-10 | ~~Fold four apps into one with route groups (if O2 approved)~~ **Declined (M32): keep the four apps** | — | — | No work; `zones.mjs` and `ZLink` stay, M16 gap accepted. |
| F-11 | Branded `not-found`, `error`, `loading` per route group | M | Claude Sonnet | A wrong URL shows the branded 404 with DemoChip (demo mode), footer and a link home for the role; a thrown error shows the error page with a reference code. |
| F-12 | Environment ribbon | S | Flash 3.6 | Shows Demo / Staging / Local outside production; absent in production; never covers content. |
| F-13 | Mode switch `NEXT_PUBLIC_RC_MODE=demo|live` | M | Kimi 3 | Demo: mock adapters, DemoChip, open routes. Live: guarded routes, no DemoChip. Default `demo` until Phase 3. |

### UI, form and data kits

| ID | Ticket | Size | Model | Acceptance criteria |
|---|---|---|---|---|
| K-01 | Add Radix primitives (exact versions) and the kit structure in `packages/ui/src/kit` | S | DeepSeek V4 Pro | Only the approved packages; exact pins; a `/__kit` development page lists components. |
| K-02 | `Dialog` and `AlertDialog` (glass and hard variants, typed confirmation option) | M | Claude Sonnet | Replaces `Modal`; focus trap and return; Escape closes (not for AlertDialog with typed confirm); reduced motion. |
| K-03 | `Menu` (DropdownMenu); move `LanguageSwitcher` onto it | M | Claude Sonnet | Arrow keys, typeahead, Escape; no layout shift; draft tag kept. |
| K-04 | `Select`, `Tabs` (URL-synced variant), `Checkbox`, `RadioGroup`, `Switch` | M | Claude Sonnet | 44px phone / 40px desktop targets; labels required by type. |
| K-05 | `Toast` with Undo; `Popover`; `Tooltip` | M | Claude Sonnet | Toast `role="status"`; Undo calls back within 10 s; tooltips hold no required information. |
| K-06 | State components: `LoadingState`, `ErrorState`, `ForbiddenState`, `OfflineBanner`, `RefreshMarker` | M | Claude Sonnet | Match the state matrix; reference code shown on errors; strings in EN/TL/HIL. |
| D-01 | Zod schemas for every entity in `packages/domain/src/schemas` | M | GLM 2.5 | One schema per entity in [03-architecture.md](03-architecture.md#data-contracts); valid and invalid sample tests; seed parses. |
| D-02 | Zod i18n error map (keys only) | S | GLM 2.5 | No English default messages; a test fails if any key lacks EN/TL/HIL. |
| D-03 | Form kit: `Form`, `Field`, `FieldError`, `SubmitButton`, error summary | M | Claude Sonnet | Focus first invalid field; double-submit locked; `aria-describedby` wiring. |
| D-04 | Repository interfaces + mock implementations (async, idempotency keys, typed errors) | L | Kimi 3 | Interfaces for farms, lots, slots, hauls, commitments, orders, settlements, SMS; mocks pass contract tests. |
| D-05 | `packages/data`: TanStack Query client and hooks (approved defaults) | M | Kimi 3 | `retry:false`, `refetchOnWindowFocus:false`, `staleTime:Infinity` for mocks; query-key factory; hooks return data the state components consume. |
| D-06 | Move `AuthScreen` onto the form kit | S | Claude Sonnet | Same behaviour as M23; E2E auth flow passes. |

### Quality

| ID | Ticket | Size | Model | Acceptance criteria |
|---|---|---|---|---|
| Q-01 | Playwright in CI (browser installed in the job only) | M | DeepSeek V4 Pro | Smoke spec: every route 200, DemoChip (demo), footer, no console errors, no horizontal scroll at 360px. |
| Q-02 | Critical-flow E2E specs (five flows in [05-engineering-standards.md](05-engineering-standards.md#testing)) | L | Kimi 3 | All five pass on CI; `e2e` becomes a required check. |
| Q-03 | Component tests for the kit (O4 approved) | M | Claude Sonnet | Keyboard and focus tests for K-02 to K-05; covered by the tests shipped in those tickets (M33). |
| Q-04 | Axe in E2E (if O5 approved) | S | DeepSeek V4 Pro | No serious or critical violations on any route. |
| Q-05 | Bundle budget check | S | DeepSeek V4 Pro | Baseline recorded; CI fails on more than 10% growth per route. |
| Q-06 | Visual snapshots for key screens | M | Claude Sonnet | 390 and 1440, light and dark; updated only with a `visual-update` label. |

## Phase 2: functional UI shell

One ticket per screen, each with the same acceptance criteria: built on the kits; full state matrix; idiot-proofing rules for its actions ([04-ux-standards.md](04-ux-standards.md)); usability findings for that screen fixed; strings in EN/TL/HIL; E2E updated.

| ID | Screen | Notable rules | Model |
|---|---|---|---|
| S-01 | Farmer SMS inbox and reply | Reply choices as large buttons plus free text; confirmation SMS echo. | Claude Sonnet |
| S-02 | Farmer slip | Net, advance, balance in large type; same numbers as the SMS. | Claude Sonnet |
| S-03 | Driver haul | One action per step; forward-only status; queued updates with "Not sent yet". | Claude Sonnet |
| S-04 | Buyer supply and order | Stepper for sacks; week tabs; summary step with total; Undo on cancel within the window. | Claude Sonnet |
| S-05 | Buyer orders and trace | Order status chips; trace to farm without farmer identity beyond the code. | Claude Sonnet |
| S-06 | Coordinator home | Today's tasks first; every item links to its record. | Claude Sonnet |
| S-07 | Haul (coordinator) | Reassign with Undo; override visible in history. | Claude Sonnet |
| S-08 | Dryer slots | Capacity shown before assigning; no double booking (schema rule). | Claude Sonnet |
| S-09 | Pay and settlement | Summary + confirm for "mark paid"; irreversible after confirm except by admin. | Claude Sonnet |
| S-10 | Plan, market, farm list and profile | Filters in URL; empty-filtered state; add farm via form kit. | Claude Sonnet |
| S-11 | Admin | Typed confirmation for role and configuration changes; audit view. | Claude Sonnet |
| S-12 | Route guards in live mode | Signed out → role sign-in with return link; wrong role → forbidden state. | Kimi 3 |
| S-13 | Native review of TL/HIL for farmer and driver screens | Glossary file; every string signed off or flagged. | Team |
| S-14 | Second usability round | Same scripts; no severity 3–4 findings (Gate 2). | Team |
| S-15 | Farmer plan (`/farmer/plan`): own harvest week, the cluster calendar with the farm's row in gold, book a repeat delivery | Summary + confirm, then Undo on cancel; the nav item and its route ship together (no dead links); state matrix; strings EN/TL/HIL. | Claude Sonnet |
| S-16 | Central milling (`/farmer/milling`): slot, dryer and sack request for the farmer's lot | Uses `MILLING`/`DRYER_SLOTS` as they are (derived, not new figures); confirm or move the slot through `useSetSlotStatus` (the write the SMS replies use) with Undo, recovery and sack weights stay labelled assumed; nav grows with its route. | Claude Sonnet |
| S-17 | Contract price & variety (`/farmer/price`): the commitment's grade, MC and price beside the rice variety | Four tabs stay (SMS, Plan, Milling, Slip) and Price rides in the shared More sheet; assumed numbers stay labelled from `overrides.json`. | Claude Sonnet |
| S-18 | Driver: jobs list at `/`, the job card at `/haul/driver/jobs/{id}` | Nav down to two items (`jobs` + SMS); accept/decline on the list, pickup/delivery on the card; `/haul/driver/jobs/{id}` redirects to the new path; no repository changes. | Claude Sonnet |
| S-19 | Fix the double-encoded characters in `strings.prototype.ts` | 168 `Â·` (should be `·`), 3 `Â©` and 15 `â€¦` (should be `…`) render as mojibake in the farm summary, the plan eyebrow, the sidebar and the marketing copy — pre-existing at `ebee5b7`, not introduced by S-15–S-18. Text-only repair, no key or translation changes, then refresh the affected visual baselines. **Done** in the `lou` merge (PR #30); baselines refreshed with the merge follow-up. | Claude Sonnet |

## Phase 3: backend

**Status (6 Oct 2026, `develop`):** B-01 scaffold + cloud dev project migrated; B-02 schema; B-03 RLS + 30 pgTAP assertions; B-04 `SupabaseAuthAdapter` + live session/guard; B-05 repositories behind the D-04 interfaces (simplifications recorded in `docs/DECISIONS.md` M48); B-06 audit triggers; B-09 security headers — all done and CI-green. B-07 `SmsAdapter` interface + mock shipped, provider and inbound webhook pending **O8**. B-08 declined by the owner (no error tracking, **O6**, M46). B-10 restore rehearsal is an owner/team action. Gate 3 now depends on the gated live smokes (`e2e/gate3-live.spec.ts`, `e2e/anni-live.spec.ts`; see `docs/HANDOVER.md`) run from a network that can reach Supabase: the screen conversion is complete (farm, coordinator home, pay, dry, haul, plan, market, buyer and SMS all read the data layer; exceptions and remaining live gaps in `docs/BLOCKERS.md`), and the live runs against the dev/staging Supabase projects still have to be done before real data.

| ID | Ticket | Size | Model |
|---|---|---|---|
| B-01 | Supabase projects (dev, staging, prod), CLI migrations in repo | M | Kimi 3 |
| B-02 | Schema migration from the reviewed data model draft | L | Kimi 3 |
| B-03 | RLS policies + per-role RLS tests in CI | L | Kimi 3 |
| B-04 | `SupabaseAuthAdapter` (email and phone + password; profile on sign-up) | M | Kimi 3 |
| B-05 | Supabase repositories implementing D-04 interfaces; server-side Zod validation | L | Kimi 3 |
| B-06 | Audit log (trigger or service layer) | M | Kimi 3 |
| B-07 | `SmsAdapter` (mock + aggregator) and inbound reply webhook | L | Kimi 3 |
| B-08 | Error tracking (if O6) with personal data scrubbing | S | DeepSeek V4 Pro |
| B-09 | Security headers helper (CSP and others) | S | DeepSeek V4 Pro |
| B-10 | Backup restore rehearsal into staging | S | Team |

## Phase 4: readiness

Every item in [08-pilot-readiness.md](08-pilot-readiness.md) becomes a ticket with the owner named.

**Status (7 Oct 2026):** the repository side is built — privacy notice + footer link + consent capture at sign-up (M52), data inventory, DSR procedure and script, incident runbook, printable paper fallback pack and per-role onboarding guides; the items needing the owner, the DPO, native review or the second usability round remain open in the checklist and `docs/BLOCKERS.md`. SMS readiness still waits on **O8**.

## Known issues to fold into the tickets above

| Issue | Where it is fixed |
|---|---|
| Staging main app shows production buyer/driver/farmer apps (M16) | Accepted (M32): zone pages are checked on their own previews; revisit if it blocks testing. |
| Coordinator's "SMS" menu item opens the farmer app's shell with no way back except the logo | S-01 |
| Farmer sign-up subtitle reuses launch-card copy ("The farmer's SMS: reply 1 OK or 2 Move.") | D-06 (new `auth.about.farmer` string) |
| Page titles and meta descriptions say "prototype" | F-13 (mode-aware metadata) |
| `CONTACT_EMAIL` is a placeholder (`team@example.com`) | Owner: supply the real address before any public launch (still open after F-02) |
| No route-level 404/error/loading | F-11 |
| 20 `rgba(...)` literals bypass the colour guard | F-07 |
| Theme boot script copied four times | F-09 |
