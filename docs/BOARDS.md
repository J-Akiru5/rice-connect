# Canvas boards → routes

Source: canvas "RiceConnect · Enactus 2026 Canvas" (`project/canvas.json`, version 1791054420-9052), 28 boards on 3 pages (Phone, Desktop, Gate).
`?state=` values reproduce the design's state boards on the same route; they change nothing else.

| # | Board (file) | Canvas page | Size | Route |
|---|---|---|---|---|
| 1 | Main.dc.html — Farm Profile | phone | 390×844 | `/farm/F-014` |
| 2 | Farm-Profile-Dark.dc.html | phone | 390×844 | `/farm/F-014` with the theme toggle on Dark |
| 3 | Farm-Profile-Empty.dc.html | phone | 390×844 | `/farm?state=empty` |
| 4 | Farm-Profile-Error.dc.html | phone | 390×844 | `/farm/F-014?state=error` |
| 5 | Farm-Profile-Success.dc.html | phone | 390×844 | `/farm/F-014?state=success` (also after pressing Add to Cluster) |
| 6 | Haul-Coordinator.dc.html | phone | 390×844 | `/haul` |
| 7 | Haul-Coordinator-Full.dc.html | phone | 390×1560 | `/haul` (scrolled full length) |
| 8 | Haul-Driver.dc.html | phone | 390×844 | `/haul/driver` |
| 9 | Haul-Empty.dc.html | phone | 390×844 | `/haul?state=empty` |
| 10 | Haul-Error.dc.html | phone | 390×844 | `/haul?state=error` |
| 11 | Haul-Success.dc.html | phone | 390×844 | `/haul?state=success` |
| 12 | SMS.dc.html — 3 messages | phone | 390×844 | `/sms` |
| 13 | Plan.dc.html | desktop | 1440 | `/plan` |
| 14 | Plan-Dark.dc.html | desktop | 1440 | `/plan` with Dark |
| 15 | Plan-1920.dc.html | desktop | 1920 | `/plan` at 1920 |
| 16 | Market.dc.html | desktop | 1440 | `/market` |
| 17 | Market-1920.dc.html | desktop | 1920 | `/market` at 1920 |
| 18 | Dry.dc.html | desktop | 1440 | `/dry` |
| 19 | Dry-1920.dc.html | desktop | 1920 | `/dry` at 1920 |
| 20 | Pay.dc.html | desktop | 1440 | `/pay/L-03` |
| 21 | Pay-Dark.dc.html | desktop | 1440 | `/pay/L-03` with Dark |
| 22 | Pay-1920.dc.html | desktop | 1920 | `/pay/L-03` at 1920 |
| 23 | Pay-Empty.dc.html | desktop | 1440 | `/pay?state=empty` |
| 24 | Pay-Error.dc.html | desktop | 1440 | `/pay/L-03?state=error` |
| 25 | Pay-Success.dc.html | desktop | 1440 | `/pay/L-03?state=success` |
| 26 | SMS-All-Languages.dc.html | desktop | 1440 | `/sms?all=1` |
| 27 | End-Card.dc.html | desktop | 1920×1080 | `/demo` beat 72–78 s (`/demo?beat=8`) |
| 28 | Contrast-Gate.dc.html | gate | 1440 | **No route.** It is the design's measured contrast report (a QA document, not a screen). Kept as a reference in the design system's CONTRAST.md. |

## Board without a route

- **Contrast-Gate** (QA report). Deliberately not a route.

## Routes without a board

- `/` — redirects to `/farm`.
- `/farm` — the farm list (100 farms). The canvas only draws one profile and the empty state; the list reuses FarmProfileCard rows' fields and StatusChip.
- `/pay` — the lot list for settlement. The canvas only draws the lot record (Pay) and its states.
- `/buyer`, `/buyer/orders` — the buyer portal (supply map, orders, trace to the farm); derived, not in canvas.
- `/demo` — the guided 78 s sequence. It shows the other boards in order and ends on End-Card.
