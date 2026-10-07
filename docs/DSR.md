# Data subject requests (access, correction, erasure)

RA 10173 gives a person the right to be informed, to object, to access, to correct and to erase their data,
and to complain. This is the working procedure; the DPO may adjust it. It is not legal advice.

## Intake

| Channel | Who receives | First action |
|---|---|---|
| In person during onboarding or a visit | Any team member | Write it on the request log (date, name, what they asked); tell them the DPO will confirm. |
| SMS to the support number (printed on the guides) | On-call developer | Forward to the DPO the same day. |
| Email to the address in the privacy notice | DPO | Reply within one working day. |

A request is logged with: date received, requester, channel, what was asked (access / correction / erasure /
objection), who is handling it, and the dates of each reply. The log holds no copies of the data itself.

## Identity

Before releasing or changing anything, confirm the requester is the account holder: in person with a
supporting ID sighting (record only "ID sighted", never a number or a photo), or through the mobile number
already on the account (reply thread), or the email on the account.

## Access (export)

1. `node scripts/dsr.mjs export --email <their email>` — prints a summary (counts only) and writes the full
   JSON to `exports/dsr-<date>-<id>.json` (the `exports/` folder is gitignored; never commit it).
2. Hand the file to the requester over a channel they control, then delete the file and the copy from any
   chat/email within 7 days. The DPO records what was sent and when.

## Correction

Correction is a normal edit by the DPO or an admin in the app (profile fields) or with the service key for
fields without a screen. Record the before/after in the request log; the audit log keeps its own copy.

## Erasure

The pilot keeps financial records (settlements, orders, commitments) under the owner/DPO's retention decision
(`docs/DATA-INVENTORY.md`); a hard delete would also break references (`on delete restrict` on farms,
commitments and orders). The supported action until that decision is **withdraw + anonymise**:

1. `node scripts/dsr.mjs erase --email <their email> --confirm <their email>` — withdraws every consent
   (`withdrawn_at`), clears the display name, mobile and barangay, and prints how many financial rows remain
   (those are the DPO's call to delete after retention).
2. The team stops using the account; the DPO records the outcome.
3. If the DPO decides on full deletion after retention, delete the auth user from the Supabase Dashboard
   (Authentication → Users) or the Admin API, after exporting the audit trail the law requires to keep.

## Timing

Reply to every request within the period the Data Privacy Act and NPC issuances allow (the DPO confirms the
exact number of working days; the team's internal target is 5 working days). If more time is needed, say so in
writing with a date.

## What must never happen

- No data release before identity is confirmed.
- No export left in the repo, a chat, a screenshot or a personal drive.
- No field is changed to hide a payment or a delivery; corrections fix errors, they do not rewrite history.

## Log fields

`received_on`, `requester_email_or_code`, `channel`, `kind`, `handled_by`, `identity_checked_on`,
`completed_on`, `outcome`, `notes` (no copies of data).
