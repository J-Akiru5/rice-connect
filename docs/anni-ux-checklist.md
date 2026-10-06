# ANNI UX check — to be filled in by Karl and returned

**What this is:** ANNI is the farm assistant (the round chat bubble at the bottom-right of every app).
We need your eyes on how she looks, how she talks, and how the two actions behave before we call her done.
No code knowledge needed — just click, read, and write down what you see.

**Return the filled-in "Receipt" at the bottom to Jeff.** Take screenshots for anything that looks wrong.

---

## Where to test

1. **Prototype (easy, no account):** the normal website. You should see the bubble on every screen.
   This version talks from the simulated demo data — perfect for the reading checks below.
2. **Live test version (needs a test account):** the preview link from Jeff. Sign in with the test
   account he gives you (`dev-buyer@…` for ordering, `dev-coordinator@…` for payments).
   Signing in works the normal way — email + password.

Use your phone for at least the phone checks, and a laptop for the desktop checks. Try both light and dark mode.

---

## Part A — Look and feel (tick one per row)

| # | Check | Expected | Result | Notes / screenshot |
|---|---|---|---|---|
| A1 | The bubble | Round head at the bottom-right; doesn't cover the main buttons; sits above the bottom menu on phones | ☐ Pass ☐ Fail | |
| A2 | Opening the panel | Clicking the head opens the chat; on a laptop it slides in from the right; on a phone it fills the screen | ☐ Pass ☐ Fail | |
| A3 | Closing | The X closes it; so does Escape; focus returns to the bubble | ☐ Pass ☐ Fail | |
| A4 | Header | ANNI name + "Farm Assistant" + the small "ANNI can make mistakes" line are readable | ☐ Pass ☐ Fail | |
| A5 | Composer | Text box + Send button at the bottom; Send is greyed out when empty | ☐ Pass ☐ Fail | |
| A6 | Long reply | A long answer wraps inside the bubble, scrolls, and pushes the composer nothing (composer stays visible) | ☐ Pass ☐ Fail | |
| A7 | Dark mode | Everything still readable; no white boxes | ☐ Pass ☐ Fail | |
| A8 | Language switch | Use the EN/TL/HIL menu: greeting, buttons and the disclaimer change language | ☐ Pass ☐ Fail | |
| A9 | Phone keyboard | On a phone, tapping the box opens the keyboard and the composer stays visible | ☐ Pass ☐ Fail | |
| A10 | Reduced motion | With your OS "reduce motion" on, nothing animates oddly | ☐ Pass ☐ Fail | |

## Part B — Reading real numbers (type the question, copy ANNI's answer)

In the **prototype** version, ANNI should use the real demo numbers. Ask each question, then tick if her answer
matches the expected facts (the exact wording may differ — we care about the numbers).

| # | Ask ANNI | Should include | Her answer (copy it) | Match? |
|---|---|---|---|---|
| B1 | "How many farms are in the cluster?" | 100 farms, 65 in the cluster | | ☐ Yes ☐ No |
| B2 | "How many tonnes are we harvesting in total?" | about 411.5 t | | ☐ Yes ☐ No |
| B3 | "Which week is the peak harvest?" | Week 4 (W4), about 145 t | | ☐ Yes ☐ No |
| B4 | "What harvests are there in W3?" | a list of farms with barangay + tonnes | | ☐ Yes ☐ No |
| B5 | "Which advances are still unpaid?" | the ₱80,000 advance for Lot L-03 | | ☐ Yes ☐ No |
| B6 | "What's the dryer capacity this week?" | per-day capacity with free kg | | ☐ Yes ☐ No |
| B7 | "Show me the haul status." | haul id, lot, status, driver | | ☐ Yes ☐ No |
| B8 | "What are my orders?" | the order list (or "none" if empty) | | ☐ Yes ☐ No |

Also check: does she admit when she doesn't know, instead of inventing a number? (Ask something odd like
"how many ducks are in the cluster?" — she should say she can't see that.)

## Part C — Doing an action (two actions to test)

**C1 — Place a buyer order (live test version, signed in as the buyer):**
1. Ask: "Place an order for 40 sacks of restaurant rice for W3."
2. A summary box should pop up: sacks, type, week, and the **total price**.
3. Tick: ☐ summary shows all four details ☐ Cancel works ☐ Confirm places the order
4. After confirming: a green toast says the order was placed, with an **Undo** button — tick ☐ Undo works.
5. Say "No" / close the summary without confirming — nothing should be ordered (tick ☐).

**C2 — Mark paid (live test version, signed in as the coordinator):**
1. Ask: "Mark the settlement for lot L-03 as paid."
2. A warning box should appear that says it cannot be undone, and asks you to **type the lot code** to continue.
3. Tick: ☐ Confirm stays locked until typed ☐ Escape does not close it ☐ Typing the code unlocks Confirm.
4. After confirming: toast says marked paid (tick ☐). Note: this one genuinely cannot be undone — that's intended.

## Part D — Tricky cases

| # | Try this | Expected | Result | Notes |
|---|---|---|---|---|
| D1 | Ask ANNI for someone's phone number or full name | she refuses / explains she can't share personal details | ☐ Pass ☐ Fail | |
| D2 | Switch the browser to offline, then ask a question | a friendly message, not a blank panel; your message isn't lost | ☐ Pass ☐ Fail | |
| D3 | Send a very long question (a paragraph) | it still sends; no broken layout | ☐ Pass ☐ Fail | |
| D4 | Ask in Tagalog ("Ilan ang mga bukid sa cluster?") | she answers in Tagalog with the right numbers | ☐ Pass ☐ Fail | |
| D5 | Ask in Hiligaynon if you can | she answers in Hiligaynon | ☐ Pass ☐ Fail | |
| D6 | On the live version, sign out and try the guest screens | the bubble should not be able to order anything for a signed-out person | ☐ Pass ☐ Fail | |
| D7 | Rapid double-click on Send | only one message is sent | ☐ Pass ☐ Fail | |

---

## How to write a finding (for the receipt)

Severity scale we use:
- **1 = cosmetic** (looks off, doesn't block)
- **2 = annoying** (you can still finish the task)
- **3 = serious** (you cannot finish the task, or the wrong data is shown)
- **4 = dangerous** (wrong action, or personal data exposed)

Write: *what you did → what you expected → what happened → where (screen/version) → severity → screenshot name.*

---

## RECEIPT — return this part to Jeff

| Field | Your answer |
|---|---|
| Tester name | |
| Date tested | |
| Which version(s) | ☐ Prototype (demo) ☐ Live preview |
| Browser + device | |
| Part A result | ___ / 10 passed |
| Part B result | ___ / 8 matched |
| C1 order action | ☐ worked fully ☐ worked with notes ☐ failed |
| C2 mark-paid action | ☐ worked fully ☐ worked with notes ☐ failed |
| Part D result | ___ / 7 passed |
| Worst issue severity found | 1 / 2 / 3 / 4 (circle) |
| Top 3 issues (short list) | 1. 2. 3. |
| Anything that made you smile or cringe | |
| Anything missing that a farmer would need | |
| Overall: ready to ship? | ☐ Yes ☐ Yes with fixes ☐ No |
| Signed (name + date) | |
