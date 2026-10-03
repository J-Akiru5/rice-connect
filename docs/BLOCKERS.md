# Blockers and missing items

| Item | Status | Note |
|---|---|---|
| `public/brand/*.svg` (5 logo files) | Present | Downloaded from the design system's asset store. They are a trace of the raster logo, not the designer's vector (per the design's Logos README). |
| Playwright screenshots | Not run here (by instruction) | `npm run shots` is written; run it locally. It needs a Chromium that Playwright can find. |
| Visual QA in a browser | Not done in this session | Playwright and browsers were off-limits here. Verified instead: `next build` (types + lint), 31 vitest tests, and server-rendered HTML of every route (DemoChip + footer present, no `href="#"`). Layout at 1440/1920/390, dark theme and TL/HIL lengths still need an eye-check with `npm run shots`. |
| Contrast re-measure | Not done | The design's contrast gate was measured on the design's boards. Changes here: `#374151`/`#4b5563` on white hard cards → `--gray-900` (darker, higher contrast); new screens reuse the measured tokens. Re-run a contrast pass on the screenshots. |
| TL / HIL copy | Draft | Every Tagalog and Hiligaynon string (design + prototype additions) needs native review. |
| Logo vectors | Trace | The SVGs are a trace of the raster logo; prefer the designer's original if one exists. |
| Dryer clock times | Dropped | No source for slot clock times; slots show kg. Add times only with a real dryer schedule. |
