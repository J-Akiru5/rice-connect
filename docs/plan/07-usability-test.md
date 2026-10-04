# Usability test, Oct 6–7

A moderated usability test on the **simulated prototype in production** (`main`, frozen). No real personal data is entered or collected. This complements `docs/UAT-KIT.html` (the team's acceptance kit); this file is about learning where real people struggle, not about passing tasks.

## Goals

1. Find where farmers, drivers, buyers and coordinators hesitate, misread or make mistakes.
2. Learn which words (EN, TL, HIL) people do not understand.
3. Decide what Phase 2 fixes first, with evidence.

## Setup

- **Where:** production, `https://rice-connect-opal.vercel.app` (Release 3). The owner first confirms it opens in a private window with no Vercel login.
- **What is live there:** the mock Sign In and Sign Up forms per app (M23). Any well-formed email or mobile and password signs in as that app's demo account; tell participants to type made-up details, never their own.
- **Devices:** the participant's own phone where possible (realistic), plus one facilitator Android phone and one laptop as backup. Private window for each participant so earlier sessions' data does not show.
- **People:** a facilitator (reads tasks, does not help for one minute), a note-taker, the participant.
- **Participants:** three to five per role if available; five users of one kind typically surface most of the serious problems (Nielsen's rule of thumb), and fewer still find the worst ones.
- **Time:** 15–20 minutes per person.

## Consent (read aloud before starting)

> "Thank you. We are students from ISUFST testing an early version of an app called RiceConnect. Everything in it is made up: the farms, names, prices and places are not real. We are testing the app, not you; if something is confusing, that is the app's fault and exactly what we want to find. We will not record your face or voice, and we will not write down your name or number. You can stop at any time. Is it all right to continue?"

Record only: role, device type, preferred language, and whether consent was given. Nothing else about the person.

## Tasks

Read each task aloud, in the participant's language. Do not name the buttons. Mark **P** (did it alone), **H** (needed help), **F** (could not), and note where they hesitated.

### Farmer

| # | Task | Done when |
|---|---|---|
| F1 | "You got messages from the cluster. Open them and tell me what they ask you to do." | Explains the dryer slot and the reply options in their own words. |
| F2 | "You can bring your palay on that day. Answer the message." | Replies `1` (or OK/Oo); sees the slot confirmed. |
| F3 | "Now imagine you cannot come that day. What would you do?" | Finds the `2` reply. |
| F4 | "How much will you be paid, and when?" | Finds the slip; reads net, advance and balance. |
| F5 | "Change the language to the one you prefer." | Uses the language menu. |

### Driver

| # | Task | Done when |
|---|---|---|
| D1 | "Sign in as the driver." Start at `/driver/login`; give a made-up mobile such as 0900 000 0000. | Lands on the haul job. |
| D2 | "Take this job." | Accepts. |
| D3 | "You have picked up the sacks. Tell the app." | Marks Picked Up. |
| D4 | "You have delivered. Tell the app." | Marks Delivered; stepper complete. |
| D5 | "Where are you picking up, and how many sacks?" | Reads farm, barangay and sacks. |

### Buyer

| # | Task | Done when |
|---|---|---|
| B1 | "Sign in as the buyer." Start at `/buyer/login`; give a made-up email such as test@example.com. | Lands on Cluster Supply. |
| B2 | "You run a restaurant. How much rice can you get next week?" | Picks Restaurant; reads the weekly figure. |
| B3 | "Order 4 sacks for week 3." | Order appears in My Orders with kg and ₱ total. |
| B4 | "Try to order 0 sacks." | Sees a clear error; no order is created. |
| B5 | "Where did your rice come from?" | Follows the trace to the farm. |

### Coordinator

| # | Task | Done when |
|---|---|---|
| C1 | "Sign in as the coordinator." Start at `/login`; made-up email and password. | Lands on Home. |
| C2 | "Which farms in Licu-an are verified?" | Uses the filters; list shows the result. |
| C3 | "When does lot L-03 dry?" | Finds slot D-58. |
| C4 | "Give the haul for L-03 to a different driver." | Driver changes; override shown. |
| C5 | "How much does the farmer get?" | Reads the settlement. |

### Everyone, at the end (two questions)

1. "What was the most confusing moment?"
2. "Which word or label did you not understand?"

## Observation sheet

| Time | Participant (role, device, language) | Task | P/H/F | Where they hesitated | What they said (quote) | Severity |
|---|---|---|---|---|---|---|

## Severity scale

| Level | Meaning | Action |
|---|---|---|
| 4 | Cannot complete a core task, or completes it with a wrong result (wrong number, wrong record). | Fix first in Phase 2; blocks Gate 2. |
| 3 | Completes only with help, or after a long hesitation. | Fix in Phase 2; blocks Gate 2. |
| 2 | Completes alone but is slowed or unsure. | Scheduled in Phase 2. |
| 1 | Cosmetic; noticed but no effect. | Backlog. |
| 0 | Not a usability problem (opinion, feature wish). | Logged as a product idea. |

## After the sessions

1. Within 24 hours, turn each sheet row with severity 2+ into a GitHub issue labelled `ux-finding` and `sev-N`, with the role, the task, the quote and the screen.
2. Group findings by screen; the three screens with the most severity 3–4 findings go first in Phase 2.
3. Words that people did not understand go to the glossary review (`packages/i18n/GLOSSARY.md`) for the native speakers.
4. Destroy paper sheets once transcribed; they hold no personal data, but keep the habit for the real pilot.
