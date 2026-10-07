# Product

## Register

brand

## Users

Four roles share one cluster in Dingle, Iloilo, plus the people who evaluate it:

- **Coordinator** (primary operator): runs the cluster on a desktop. Plans the harvest, matches buyers, books dryer slots, dispatches haulers, releases payment. Works in a borrowed office, on a laptop, often with a spotty connection.
- **Farmer**: smallholder, reached only by SMS. May be older, may read Tagalog or Hiligaynon, does not use a smartphone app. Replies "1 OK" or "2 Move". Never the direct user of the public site, but the person the pitch is ultimately about.
- **Buyer** (miller, retailer, market seller, restaurant): a business owner or manager. Needs volume, grade, price and a delivery window they can commit to.
- **Driver**: accepts haul jobs on a phone.
- **Evaluators**: LGU and municipal agriculture officers, government programme staff, Enactus judges, prospective buyers and funders. They arrive at the public site to decide, in about ninety seconds, whether this is a serious operation or a student demo.

The job to be done on the public surface: let an evaluator trust the model enough to take a meeting.

## Product Purpose

RiceConnect helps a farmer cluster sell together rather than one farm at a time: plan the harvest, line up buyers
before it comes in, dry and haul it on time, and pay farmers fast. Farmers need only SMS.

This repository is the **Enactus Philippines 2026 prototype**: simulated data, no real farms, farmers or prices.
Success for this surface is not conversion. It is credibility. An LGU officer should finish the page believing the
model is buildable and the numbers are honestly labelled.

## Brand Personality

Institutional and trustworthy. Calm, exact, unhurried. Closer to a published government circular than to a startup
landing page.

Voice: plain nouns and concrete numbers. Every claim carries its provenance label (Model, Simulated, Assumed) in
plain sight. Confident because it is precise, never because it is loud.

Emotional goal: **competence you can verify.** The reader should feel they are being briefed, not sold to.

## Anti-references

- **Startup landing pages.** Gradient meshes, parallax, animated counters, glassmorphism as decoration, purple-to-blue.
  This is the "AI slop" read the audience currently worries about.
- **NGO / charity affect.** Warm inspirational photography of smiling farmers, aspirational copy. It reads as a cause,
  not an operation, and it undercuts the case for a business model.
- **Crypto / fintech dashboards.** Dark neon, chart confetti, "reimagined" verb-forward copy.
- **Editorial-magazine styling.** Display serif italics, drop caps, broadsheet columns. Wrong register entirely.
- Decorative effects that do not carry information: gradient text, side-stripe accents, ghost cards (hairline border
  plus wide soft shadow), repeating-stripe backgrounds, sketchy SVG illustration, paper-grain filters.
- Numbers presented without a unit, a source, or an "assumed" label.

## Design Principles

1. **Provenance on every claim.** A figure is never bare. Unit, source and simulation status travel with it. This is
   the product's credibility mechanism, not a disclaimer to be buried.
2. **Legible before beautiful.** The reader set includes older farmers, municipal staff and business owners. Body text
   is large, contrast is high, and the measure is capped. Craft that costs readability is not craft here.
3. **Institutional, not institutional-looking.** Solid surfaces and honest structure over translucency and effect.
   If an element does not help the reader decide, it is noise.
4. **Restraint is the voice, not the absence of one.** One deliberate signature (the brand band, the wordmark) carries
   the identity. Do not compensate for plainness with trend effects.
5. **Say what is not known.** Uncertainty is stated, dated and labelled. The prototype's honesty is its strongest
   design asset.

## Accessibility & Inclusion

- **Target: WCAG 2.2 AA**, plus defaults suited to older readers: body text at 16px or larger, generous line-height,
  and a capped measure.
- `prefers-reduced-motion` is honoured for every animation; a crossfade or instant state replaces motion, never a
  blank section.
- Status is never colour alone: icon plus word plus colour.
- Targets at least 44px on phone, 40px on desktop. Focus visible on every control at 3px.
- EN / TL / HIL all first-class. TL and HIL remain marked "draft: needs native review" until signed off.
- Nothing depends on a connection: the buyer map degrades to a table, and the rest of the product runs offline.
