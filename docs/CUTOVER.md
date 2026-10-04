# Deploy, branches and rollback

## Projects

| Vercel project | Root Directory | Serves | Production URL |
|---|---|---|---|
| `rice-connect` | `apps/main` | `/`, `/launch`, `/login`, `/coordinator/*`, `/admin/*` (incl. `/admin/login`); rewrites `/buyer`, `/driver`, `/farmer` | https://rice-connect-opal.vercel.app |
| `riceconnect-buyer` | `apps/buyer` | `/buyer/*` (incl. `/buyer/login`) | https://riceconnect-buyer.vercel.app |
| `riceconnect-driver` | `apps/driver` | `/driver`, `/driver/login` | https://riceconnect-driver.vercel.app |
| `riceconnect-farmer` | `apps/farmer` | `/farmer/*` | https://riceconnect-farmer.vercel.app |

Users only visit `rice-connect-opal.vercel.app`. The other three domains are origins for its rewrites; opened directly, their `/` opens the app's own page on that host (works on staging previews too), and paths of other apps go to the main origin. Retired: `riceconnect-site` and `riceconnect-coordinator`. Until the owner deletes them in the Vercel dashboard, both skip every build (Ignored Build Step `exit 0`).

Vercel Authentication covers **previews only**. Production must stay public, or the rewrites to buyer, driver and farmer get a login page.

## Branches

```
feature/* ──PR──▶ develop ──PR──▶ staging ──PR──▶ main
   CI only          CI only      CI + Vercel     CI + Vercel
                                  preview        production
```

- Vercel builds only `main` and `staging` (`git.deploymentEnabled` in each `apps/*/vercel.json`).
- GitHub Actions CI runs lint, build, test and the guard checks on every PR and on pushes to `develop`.
- Staging preview URLs are behind Vercel Authentication (team members only). The staging preview of `apps/main` sends `/buyer`, `/driver` and `/farmer` to the **production** apps (decision M16).

## Before merging `staging` → `main`

- [ ] CI is green on the PR.
- [ ] The staging previews of every changed app are `READY`.
- [ ] On the `rice-connect` staging preview: `/`, `/launch`, `/login`, `/admin/login`, `/admin`, `/coordinator/home`, `/coordinator/farm`, `/coordinator/demo` return 200 and show the DemoChip and the footer.
- [ ] Legacy redirects: `/farm` → `/coordinator/farm`, `/demo` → `/coordinator/demo`, `/sms` → `/farmer`, `/haul/driver` → `/driver`.
- [ ] By hand in a browser on production after the merge: place a buyer order on `/buyer/orders`, see it on `/coordinator/home` in another tab. Reply `1` on `/farmer`, then see slot D-58 confirmed on `/coordinator/dry`.
- [ ] By hand: the 78 s `/coordinator/demo` plays end to end.
- [ ] By hand: Sign In on `/login`, `/buyer/login`, `/driver/login`, `/admin/login` opens that app and its header shows "Signed In" and Sign Out; Sign Out returns to that sign-in page.

## Rollback

- Bad production deploy: in Vercel, open the project → Deployments → pick the last good production deployment → **Instant Rollback**.
- Code: revert the merge commit on a branch and PR it through `develop` → `staging` → `main`.
- Back to the pre-monorepo prototype: branch `rollback/demo-v2` (ec7de9e). Restoring it means setting `rice-connect`'s Root Directory back to empty and replacing `main`; this needs the owner's go-ahead.
