# Responsive checklist (verify by hand in devtools)

Widths: **360, 390** (mobile) · **768, 1024** (tablet) · **1440, 1920** (desktop). Check light and dark (theme toggle) at least at 390 and 1440.
Run `npm run build && npm start`, open devtools → device toolbar → "Responsive", set the width, reload.

## Every route, every width

- [ ] No horizontal page scroll (drag the page sideways; only the A6 slip box and nothing else may scroll inside itself).
- [ ] DemoChip "PROTOTYPE · SIMULATED DATA" and the footer "Team Syntaxure Labs · ISUFST" are visible.
- [ ] Shell: <768 top bar (logo mark, EN/TL/HIL, theme) + bottom tabs Farm · Logistics · Orders · SMS · More (More opens Plan, Market, Dry); 768–1199 icon rail with words; ≥1200 full sidebar with all seven modules.
- [ ] No key data cut with "…": barangay, farm ID, farmer, amounts wrap to two lines instead.
- [ ] Tab through: every control shows the 3px focus ring; targets look ≥44px on phone, ≥40px on desktop.
- [ ] Switch to TL and HIL: longer words wrap, nothing overflows its button or panel.

## Per route

| Route | 360 | 390 | 768 | 1024 | 1440 | 1920 | What to look for |
|---|---|---|---|---|---|---|---|
| `/farm` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Narrow: card list, 10 per page, "Previous \| Page 1 of 10 \| Next". Wide (content ≥720px): table; ≥1000px content: detail panel on the right, else under the table. 20 per page + Rows per page 10/20/50; "Showing 1-20 of 100". |
| `/farm?status=verified&barangay=…&q=…&page=2` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Filters and page survive reload and Back; changing a filter goes back to page 1. `?q=zzz` shows "No farms match". |
| `/farm/F-014` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Full page; Add to Cluster works; card and harvest side by side when wide. |
| `/plan` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Narrow: barangay cards with week bars (F-014 gold outline in W3). Wide: HarvestCalendar. "Farms by Harvest Date" paginated, table ↔ cards. |
| `/market` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Filter chips wrap; commitment cards stack; forecast table ↔ cards. |
| `/dry` and `/dry?week=4` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Week switch W1–W4 updates the URL and resets the list to page 1. SlotTimeline: 1 column below 640px viewport, 7 columns above (check 768/1024 for cramped columns). Slot list paginated. |
| `/haul` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Narrow: one column (stepper + route on top, Change Driver opens the list). Wide (content ≥840px): two columns, driver list always on the right. Hard style everywhere, no glass inside hard cards. |
| `/haul?state=empty` → New Request → Send | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Form, auto-assign, error state with more than 100 sacks. |
| `/haul/driver` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Accept → Picked Up → Delivered; one column, max 720px. |
| `/pay` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | 13 lots: 1 page at 20, 2 pages at 10. Table ↔ cards; L-03 highlighted and linked. |
| `/pay/L-03` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | BigStats wrap, ₱ amounts not broken mid-number; slip box scrolls inside itself on phones; Print Slip prints only the slip (A6). |
| `/sms` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Wide content: desktop chat (conversation list + thread, date chips, read-only footer). Narrow: the farmer's phone (PhoneFrame); below 390px the frame narrows to the column. Switch EN/TL/HIL: bubbles and the list preview follow. |
| `/sms?all=1` | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Three columns wide, one column narrow. |

## Phone frame (video only)

| URL | Check at 1920 |
|---|---|
| `/demo?rec=1&flip=1` | ☐ Farm, Haul and SMS beats in the phone frame; Plan, Market, Dry, Pay as desktop pages; timing 0–78 s unchanged; EN→TL→HIL at 64/67/70 s. |
| `/farm/F-014?frame=phone`, `/haul?frame=phone`, `/haul/driver?frame=phone`, `/sms?frame=phone` | ☐ Content inside the frame uses the narrow (mobile) layout. |
| `/farm?rec=1` | ☐ Same as `?frame=phone`. |
| `/plan?frame=phone` | ☐ Ignored: desktop page (by design). |
