# Incident runbook (pilot)

For the on-call developer and the coordinator. Keep this printed with the paper fallback pack. Names and the
support number are filled in before the pilot (owner action; still open in `docs/BLOCKERS.md`).

## First five minutes, any incident

1. Write down what you saw: time, who reported it, what the screen/SMS said, which app and role.
2. Decide the severity: **S1** money or personal data at risk, or the cluster cannot work; **S2** one role or
   one screen broken; **S3** cosmetic.
3. Start the paper fallback (slot list, haul sheet, slip) for anything S1 that blocks today's work.
4. Tell the coordinator what is happening and what to do meanwhile. Never leave them waiting in silence.

## Who acts

| Role | Person | Phone |
|---|---|---|
| On-call developer (primary) | to be named | to be named |
| On-call developer (backup) | to be named | to be named |
| Coordinator (cluster) | to be named | to be named |
| Data Protection Officer | to be named (O7) | to be named |

## Site down or app not loading

- Check Vercel → the four projects: recent deploy, deployment status, function errors.
- If the last deploy is the cause: Instant Rollback to the previous production deployment; record the rollback
  in the incident log. Then reproduce locally before redeploying.
- Check Supabase → project status and the database health page. Restore is a team action (B-10 rehearsal
  first), never an improvised one.
- Paper fallback until the app answers again. Tell the cluster by SMS.

## SMS not sending

- Live SMS fails closed until O8 (aggregator chosen, sender registered). If the aggregator is down: the app
  still records the message; use the paper/call fallback for time-critical ones (slot, haul, payment).
- Check the aggregator's status page and delivery reports before touching anything.
- Never paste SMS contents into a group chat; use lot codes.

## Wrong payment shown

- **S1.** Stop the payout: do not send the advance or balance until the numbers are confirmed.
- Recompute from the settlement row: weight (dried_kg) × quoted rate − drying − margin; compare with the slip
  and the SMS. The audit log shows who changed the settlement and when.
- Mark paid only after the coordinator confirms with the farmer on the phone. Any correction is a new record
  with a note, never an edit that hides the first one.

## Suspected data leak

- **S1.** Follow the breach procedure below. Do not delete anything yet: the trail is needed.
- Who decides: the DPO, with the owner. Who notifies: the DPO notifies the National Privacy Commission and
  the affected people. Notify the Commission within 72 hours of knowledge of a qualifying breach, and the
  affected people without undue delay (NPC rules; the DPO confirms the exact wording and criteria).
- Preserve evidence: export the audit log rows involved, note times in UTC, keep the incident log.
- Rotate affected credentials (Supabase service key, Vercel envs) through the owners' accounts only.

## Wrong data in a record

- Fix by adding a correction (re-import or a new row) and note why in the request log; the audit log keeps the
  before/after. For a person's profile fields, use the DSR procedure (`docs/DSR.md`).

## After any incident

- Write a short note the same day: what happened, who was affected, what was done, what prevents a repeat.
- If a screen misled the user, file it as a bug with the screenshot and the role.
- Update this runbook when a step turns out wrong; the runbook is tested by use.
