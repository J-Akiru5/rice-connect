# Cutover: old single app → monorepo zones

The old Vercel project `rice-connect` (https://rice-connect-opal.vercel.app) is **not touched** until every box below is checked.

## Projects

| Vercel project | Root directory | Serves | Production URL (expected) |
|---|---|---|---|
| `riceconnect-site` | `apps/marketing` | `/`, `/launch`, gateway rewrites + legacy redirects | https://riceconnect-site.vercel.app |
| `riceconnect-coordinator` | `apps/coordinator` | `/coordinator/*` | https://riceconnect-coordinator.vercel.app |
| `riceconnect-buyer` | `apps/buyer` | `/buyer/*` | https://riceconnect-buyer.vercel.app |
| `riceconnect-driver` | `apps/driver` | `/driver` | https://riceconnect-driver.vercel.app |
| `riceconnect-farmer` | `apps/farmer` | `/farmer/*` | https://riceconnect-farmer.vercel.app |
| `rice-connect` (old) | repo root | old single app | https://rice-connect-opal.vercel.app |

Vercel Authentication on the new projects covers **previews only**. Production must be public, or the gateway's rewrites to the zone origins get a login page.

Users only ever visit the gateway (`riceconnect-site`). Zone URLs are origins for the rewrites. Opening a zone directly works, but it is a different origin, so it does not share localStorage with the gateway.

## Checklist (on the gateway's production URL)

- [ ] All five production deployments are `READY` on the same `main` commit.
- [ ] The zone origins in `apps/marketing/zones.mjs` (`PRODUCTION`) match the real production domains. If a domain differs, fix `zones.mjs` and redeploy `riceconnect-site`.
- [ ] `/` and `/launch` return 200 and show the DemoChip and the footer.
- [ ] `/coordinator/home`, `/coordinator/farm`, `/coordinator/demo`, `/buyer`, `/buyer/orders`, `/driver`, `/farmer`, `/farmer/slip` return 200 through the gateway, with DemoChip and footer.
- [ ] CSS, fonts and logos load on a zone page (no 404s for `/coordinator/_next/...` or `/coordinator/brand/...`).
- [ ] Legacy redirects: `/farm` → `/coordinator/farm`, `/haul/driver` → `/driver`, `/sms` → `/farmer`, `/demo` → `/coordinator/demo`, `/pay/<lot>` → `/coordinator/pay/<lot>`.
- [ ] Zone responses carry `X-Robots-Tag: noindex`; `/robots.txt` disallows the zones.
- [ ] By hand in a browser: place a buyer order on `/buyer/orders`, then see it on `/coordinator/home` in another tab. Reply `1` on `/farmer`, then see the slot as confirmed on `/coordinator/dry`.
- [ ] By hand: the 78 s `/coordinator/demo` still plays end to end.
- [ ] `/buyer` map: tiles load; with the network blocked, the page still works.

## Cutover (pick one, after the checklist passes)

**A. Keep the new URL.** Share https://riceconnect-site.vercel.app (or attach a custom domain to `riceconnect-site`). Leave `rice-connect` as is, or pause it. This is the simplest option and needs no change to the old project.

**B. Keep the old URL.** In the old project `rice-connect`, set Root Directory to `apps/marketing` and redeploy `main`. The old URL then becomes the gateway; the zone projects stay as they are. Then delete `riceconnect-site`, or keep it as a second gateway.

## Rollback

- Old project, before cutover: nothing to do. It keeps serving its last good deployment.
- Old project, after option B: in Vercel, open `rice-connect` → Deployments, pick the last pre-monorepo production deployment, and choose **Instant Rollback**. Then set Root Directory back to empty.
- Code: branch `rollback/demo-v2` (ec7de9e) is `main` before the monorepo. To restore it: `git checkout -B main origin/rollback/demo-v2 && git push --force-with-lease origin main`. This step needs the owner's go-ahead.
