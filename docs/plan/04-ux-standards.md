# UI/UX standards and idiot-proofing

"Idiot-proofing" here means designing so that the easy action is the correct one, mistakes are hard to make, and when they happen they are cheap to undo. It is not about the users: farmers, drivers and coordinators are experts in their work and newcomers to this app, often on a small phone with a weak signal. The rules below apply to every screen, and the UI kit implements them once so screens get them for free.

The existing design rules in `AGENTS.md` (glass default, hard style inside Haul, tokens only, 3px focus ring, 44/40px targets, icon + word on every action, status = icon + word + colour) stay. This document adds to them.

## 1. Who we design for

| Role | Device and context | What goes wrong today | Design consequence |
|---|---|---|---|
| Farmer | Feature phone or entry-level Android, prepaid data, outdoors, bright sun, Hiligaynon first. | Small text, long flows, unfamiliar English terms. | SMS parity for every action; 16px+ body; three steps at most; plain Hiligaynon; numbers with units. |
| Driver | Android in a vehicle cab, one hand, interrupted, patchy signal. | Missed taps, lost updates when the signal drops. | Huge primary button per step; one action per screen; queued updates with a visible "Not sent yet" state. |
| Buyer | Phone or laptop, business hours, price-sensitive. | Wrong quantity or week, surprise totals. | Steppers instead of free text; live total before confirming; a summary step for orders. |
| Coordinator | Laptop and phone, many tasks a day, the person who fixes everyone else's mistakes. | Acting on the wrong farm or lot; losing context. | Clear identity on every record (ID + name + barangay); undo; history; filters that persist in the URL. |
| Admin | Laptop. | Changing configuration by accident. | Typed confirmation for dangerous actions; environment ribbon; audit trail. |

## 2. State matrix

Every screen, and every independent panel on a screen, designs all of these states. The UI kit provides one component per state so they look and behave the same everywhere. A PR that adds a screen without them is not done.

| State | When | What the user sees | Component |
|---|---|---|---|
| Loading (first) | No data yet. | A skeleton in the shape of the content (not a spinner), after 300 ms; before that, nothing. | `LoadingState` |
| Loading (refresh) | Data shown, refetching. | The data stays; a small "Updating" marker. Never blank the screen. | `RefreshMarker` |
| Empty | The query worked and there is nothing. | `EmptyState` with the terrace illustration, one sentence on why it is empty, and the one action that fills it. | `EmptyState` |
| Empty (filtered) | Filters exclude everything. | "No farms match these filters" + Clear Filters. Not the first-run empty state. | `EmptyState variant="filtered"` |
| Error (recoverable) | Network or server failure. | What happened in plain words, a Try Again button, and a short reference code for support. | `ErrorState` |
| Error (not found) | The record does not exist or was removed. | "This haul no longer exists" + a link back to the list. | `ErrorState variant="notFound"` |
| Forbidden | Signed in as a role that may not see it. | "This page is for coordinators" + Sign In as a different account. Never a blank page. | `ForbiddenState` |
| Signed out | Product mode, no session. | Redirect to the role's sign-in with a return link. | Route guard |
| Offline | The browser reports offline. | A persistent banner; actions that need the network are disabled with the reason shown. | `OfflineBanner` |
| Pending write | A change is sent but not confirmed. | The item shows "Saving…"; the control is locked. | Form kit / `StatusChip` |
| Success | A change is confirmed. | A toast that names what happened ("Haul H-07 marked Delivered") with Undo when the action is reversible. | `Toast` |
| Partial | Some panels loaded, one failed. | The failed panel shows its own `ErrorState`; the rest of the screen works. | Per-panel boundaries |

## 3. Prevention: make the wrong input impossible

1. **Choose, don't type.** Use selects, segmented controls, radio cards and steppers for anything with a known set of values (barangay, vehicle, buyer type, week, sacks). Free text only for names and notes.
2. **Constrain at the control.** `inputMode` for the right keyboard (`numeric`, `tel`, `email`), `min`/`max`/`step` on numbers, disabled past dates, maximum lengths shown as a counter near the limit.
3. **Units live next to the field**, inside the control's frame: "sacks", "kg", "₱/kg". Never ask for a bare number.
4. **Sensible defaults** from context: the current week, the user's barangay, the last vehicle used. A default must be visible and easy to change, never hidden.
5. **Masks and normalisation, never rejection for format.** Accept `0917 123 4567`, `09171234567` and `+63 917 123 4567`; store E.164. Trim spaces. Accept `1`, `OK`, `oo` for yes in SMS (already done in `parseSmsReply`).
6. **Disable with a reason.** A disabled button always has a visible line saying why ("Pick a week first"). Prefer enabling the button and showing the error on press for primary actions, so users learn what is missing.
7. **One primary action per screen**, visually dominant, in the same place on every screen (bottom of the form on phones, end of the row on desktop).

## 4. Confirmation and recovery

| Action type | Example | Pattern |
|---|---|---|
| Reversible, low impact | Mark a slot confirmed; filter a list. | Do it immediately; toast with Undo for 10 seconds. |
| Reversible, affects someone else | Reassign a haul to another driver. | Do it; toast with Undo; the other person is notified only after the undo window closes. |
| Irreversible or money | Place an order; mark a settlement paid; delete a farm. | Summary step that restates the consequence in numbers ("Place order: 4 sacks, 100 kg, ₱4,800.00, W3"), then confirm. |
| Dangerous admin | Change a role; reset data; change prices. | `AlertDialog` that requires typing the record's ID or the word shown. |

Never use `window.confirm` or `window.alert`. Lint blocks them.

**Double-submit protection.** Every submit locks its button and shows the pending label ("Placing Order…") until the response; every write carries an idempotency key. A second tap does nothing.

**Unsaved changes.** Forms longer than three fields warn before navigating away and keep a draft locally until submitted.

**Status changes move forward only** unless an explicit Undo or a coordinator override is used (the driver cannot go from Delivered back to Picked Up by mistake).

## 5. Forms

- Built only with the form kit (React Hook Form + Zod). No hand-rolled `useState` forms.
- Every field has a visible label (never a placeholder used as a label), optional hint text, and an error slot linked with `aria-describedby`.
- Validate on blur after the first interaction, and on submit. On submit with errors: focus the first invalid field, and for forms longer than five fields show an error summary at the top that links to each field.
- Error text says what is wrong and how to fix it: "Enter an 11-digit mobile number that starts with 09", not "Invalid input".
- Zod messages are i18n keys only (owner guardrail). An untranslated message fails a unit test.
- Password fields have Show/Hide. Sign-up shows the password rule before the user types.
- Server errors that belong to a field are mapped to that field; others go to a form-level alert at the top.

## 6. Copy and language

- Write for the person, in their words: "palay" and "sacks" for farmers, "lot" and "slot" for coordinators. Keep a glossary in `packages/i18n/GLOSSARY.md` with the term in EN, TL and HIL and who uses it.
- Buttons say exactly what happens: "Place Order", "Mark Picked Up", never "Submit" or "OK".
- Numbers always carry units and use `.tabular`; money is ₱ with two decimals; dates show the day name ("Thu 22 Oct").
- No string concatenation for sentences; placeholders only (`"Haul {id} is now {status}"`), so word order can change per language.
- Every string exists in EN, TL and HIL; TL and HIL stay marked draft until a native speaker signs them off (tracked per string in a review sheet).
- Allow 30–40% longer TL/HIL text: no fixed-width buttons, no truncation of key data.

## 7. Navigation and orientation

- The shell is identical across roles: same header, same place for language, theme, account and environment ribbon.
- Page titles say where you are and which record ("Haul H-07 · Lot L-03"). Deep pages show a back link to their list with filters preserved.
- Every list keeps filters, sort and page in the URL (already the rule for lists over 12 rows), so Back and Reload never lose the user's place.
- 404 and error pages are branded, explain what happened, and offer the way home for that role.
- The environment ribbon (Demo / Staging / Production) is always visible outside production and absent in production.

## 8. Accessibility

Target: WCAG 2.2 AA, checked automatically on every PR (axe, if O5 is approved) and by hand on each new kit component.

- Keyboard: everything reachable and operable; focus visible (3px ring); focus moves into dialogs and returns to the trigger on close (Radix does this; do not override it).
- Screen readers: real labels; icon-only controls have an accessible name; status changes are announced (`role="status"` for toasts and pending states).
- Contrast: only token colours, which were measured; never put text on `brand-gold` or `info` fills except as specified in `tokens.json`.
- Motion: every transition respects `prefers-reduced-motion`.
- Language: `<html lang>` follows the language switcher (already done).

## 9. Devices, network and performance

- Design at 360px first. Test at 360, 390, 768, 1024, 1440, 1920 (the existing responsive checklist).
- Budget: first-load JavaScript per route must not grow more than 10% over the Phase 1 baseline without a recorded decision. Today's baseline from `next build` is about 133–145 kB.
- Images: none required for core tasks; the map is progressive (the page works when tiles fail, already the rule).
- Network: assume 3G and drops. Writes from the driver app queue locally and retry, with a visible "Not sent yet" marker; nothing silently disappears.
- Low-end Android: avoid heavy blur on long lists (glass panels on scroll are expensive); test on one real entry-level phone before each phase gate.

## 10. Trust and transparency

- Show who changed what and when on records that matter (haul status, settlement, slot). In demo mode the history is simulated and labelled.
- After every money-related action, show the receipt (the slip) and send the SMS; the app and the SMS must say the same numbers.
- Keep "simulated" labelling in demo mode on every route (the DemoChip rule) and remove it only in live mode.

## 11. Component inventory (UI kit v1)

| Component | Built on | Replaces today | Notes |
|---|---|---|---|
| `Dialog` | Radix Dialog | `Modal` (native `<dialog>`) | Glass or hard class passed from the opener. |
| `AlertDialog` | Radix AlertDialog | none | Consequence text required; optional typed confirmation. |
| `Menu` | Radix DropdownMenu | Hand-built `LanguageSwitcher` listbox | Language switcher, account menu, row actions. |
| `Select` | Radix Select | Native `<select>` styled with `input-2026` | Searchable variant later if lists grow. |
| `Tabs` | Radix Tabs | Ad hoc week switchers | URL-synced variant for lists. |
| `Toast` | Radix Toast | none | Success + Undo; `role="status"`. |
| `Popover`, `Tooltip` | Radix | none | Tooltips never hold required information. |
| `Checkbox`, `RadioGroup`, `Switch` | Radix | Custom `Checkbox` | 44px hit area on phone. |
| `Form`, `Field`, `FieldError`, `SubmitButton` | React Hook Form + Zod | Hand-rolled forms (sign-in, order, add farm, SMS reply) | i18n error map; double-submit lock. |
| `LoadingState`, `ErrorState`, `ForbiddenState`, `OfflineBanner`, `RefreshMarker` | Plain React + tokens | Ad hoc `?state=` boards | Used by every data hook consumer. |
| `EnvironmentRibbon` | Plain React | none | Demo / Staging / Production. |

Each wrapper ships with: keyboard test, a test page under `/__kit` (development only), the glass and hard variants where relevant, reduced-motion support, and TL/HIL long-string rendering.

## 12. Review checklist for any UI PR

- [ ] All states in the state matrix that apply are implemented and reachable in E2E (or with `?state=` in demo mode).
- [ ] No free text where a choice would do; units next to every number input.
- [ ] One primary action; destructive actions use the right confirmation pattern; Undo where reversible.
- [ ] Labels, hints, errors as i18n keys in EN/TL/HIL; no concatenated sentences.
- [ ] Keyboard-only run passes; focus visible; dialog focus returns to the trigger.
- [ ] Checked at 360px and 1440px in light and dark; TL and HIL do not overflow.
- [ ] No colour literals; tokens only.
