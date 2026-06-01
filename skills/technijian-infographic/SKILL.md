---
name: technijian-infographic
description: Generate brand-compliant Technijian infographics — single-image visual stories combining stats, icons, and short narrative — as HTML/SVG renderable to PNG/PDF. Use to fill sparse pages in brochures/datasheets, support social posts, or visualize survey results, ROI math, threat landscape numbers, etc. Different from technijian-diagram — diagrams are structural; infographics are emotional/persuasive.
---

# Technijian Infographic Generator

## When to use this skill

Use **infographic** (not diagram) when you need to:
- Fill a sparse brochure/one-pager page with a meaningful visual (per `feedback_page_breaks.md`)
- Visualize a stat-heavy story (e.g., "Why MSPs win" with 6 numbers + 1 illustration)
- Communicate a multi-step methodology to a non-technical audience
- Make a social post that stops the scroll
- Support a blog post lead image

Use **technijian-diagram** instead when the visual is purely structural (architecture, RACI, sequence).

## Output format

Single self-contained HTML page sized to the target medium:

| Use | Dimensions | Output |
|---|---|---|
| Page filler in 8.5×11 brochure | 7.5in × 4.5in | inline `<figure>` embedded in brochure HTML |
| Standalone marketing infographic | 1080×1920px (vertical) or 1080×1080px (square) | PNG via Playwright |
| LinkedIn post | 1200×627px | PNG via Playwright |
| Blog hero | 1600×900px | PNG via Playwright |

## Composition templates

### Template A — Stat Constellation
Hero number (huge, Core Blue, 96–140pt) + 3-4 supporting stats orbiting it + 1-line takeaway at bottom.

**Use for:** ROI summaries, "by the numbers" stories, threat-landscape data.

### Template B — 3-Stage Story
Three labeled panels left-to-right: Before / During / After (or Discover / Decide / Deploy). Each panel has an icon, a headline, 2 bullet points.

**Use for:** Engagement model, methodology overviews, before/after migration outcomes.

### Template C — Iceberg
Visible-above-water section (small, what clients see) over hidden-below-water section (large, what Technijian does). Used to show full-stack value.

**Use for:** Showing depth of pod-model support, total cost of ownership.

### Template D — Layer Pyramid
Stacked horizontal layers, narrowest at top (outcome) widest at bottom (foundation). Each layer in a different brand color with icon + label.

**Use for:** Maslow-style needs hierarchies, defense-in-depth, AI capability stack.

### Template E — Comparison Card Pair
Two side-by-side cards: "Without Technijian" (greyed out, sad icons) vs "With Technijian" (full-color, positive icons). Three rows of comparison points.

**Use for:** Win-win pitches, competitive comparison, before/after. ⚠ Never name competitors directly.

### Template F — Process Loop
Circular flow with 4–6 stages connected by arrows; center holds a logo or summary phrase.

**Use for:** Continuous improvement cycles, GSD loop, security operations cycle.

### Template G — Map + Pins
World or US map with location pins, each pin annotated with a stat. Use for "Our coverage" or "Where threats originate" stories.

### Template H — Tree of Outcomes
Top node = problem; tree branches down to multiple outcome leaves. Color leaves by category (cybersecurity = orange, compliance = blue, etc.).

**Use for:** Risk-mitigation decision trees, "what could go wrong" stories.

## Brand application

`assets/brand-tokens.json` is the **single source of truth** for all brand values. Read/sync from it at build time — the CSS variables below are a cached convenience and can drift. Brand essentials an infographic must respect:

- **Tagline (if shown):** `technology as a solution` — lowercase, no period. The old "Technology Support, Your Way." is **RETIRED — never use it**.
- **Contact / CTA number:** the main switchboard **949.379.8499** (reaches USA + India). `949.379.8500` is Sales-direct only and `949.379.8501` is Billing-direct only — do not use either as a generic CTA.
- **Logos:** use the REAL logo files (full-color on light, reverse-white on dark), centered — never recolor or recreate the wordmark.
- **Two offices:** Irvine HQ (18 Technology Dr Ste 141, Irvine CA 92618) + Panchkula India delivery center.

Read tokens from `assets/brand-tokens.json`:

```css
.tj-info {
  --blue:   #006DB6;
  --orange: #F67D4B;
  --teal:   #1EAAC8;
  --char:   #CBDB2D;  /* chartreuse — savings highlights only */
  --dark:   #1A1A2E;
  --grey:   #59595B;
  --off:    #F8F9FA;
  --light:  #E9ECEF;
}
```

**Color rules for infographics:**
- **Hero number:** Core Blue or Core Orange (one or the other, not both)
- **Stats grid:** Cycle blue → orange → teal → blue
- **Background:** Off White, OR Dark Charcoal (never pure black)
- **Icons:** Service-pillar icons from `assets/icons/service-pillars/` in matching pillar color
- **Savings/ROI numbers:** Chartreuse `#CBDB2D` (only place this color appears)
- **Negative numbers / risks:** Status critical `#CC0000`, sparingly

## Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Hero stat | Plus Jakarta Sans | 96–140px | 800 |
| Stat number | Plus Jakarta Sans | 48–64px | 700 |
| Section header | Plus Jakarta Sans | 24–32px | 700 uppercase |
| Body text | DM Sans | 14–16px | 400 |
| Caption / source | DM Sans | 11px | 400 grey |
| Logo wordmark | Open Sans | 16px | 700 |

## Anti-Slop rules

1. **No stock-photo clichés.** Never handshake, lightbulb, puzzle pieces, gears, briefcases.
2. **No isometric 3D illustrations.** They scream "templated."
3. **No emoji** (per project memory — this is corporate).
4. **No more than 7 elements** competing for attention. Edit ruthlessly.
5. **One typeface family per infographic.** Don't mix Plus Jakarta + Open Sans + serif.
6. **Sources cited.** If a stat is from a 3rd party (Verizon DBIR, IBM Cost of Breach), credit at the bottom in 11px grey.
7. **Logo placement:** bottom-right corner, 80–120px wide, full-color on light, white on dark.
8. **No fabricated numbers or proof.** Never invent a stat, outcome metric, ROI figure, client result, or quote to fill a visual. The service is launching — there are no completed client projects, so do NOT present client names or "results"; use anonymized industry profiles (scope only). Frame any not-yet-built capability as a dated near-term build, never as delivered. Flag internal estimates as "confirmed at discovery".

## Call to action

If the infographic carries a CTA (social, blog hero, brochure filler), the low-friction on-ramp is the free **Nexus Assess** assessment (Network Detective: internal + external vulnerability scan + M365 review). Pair it with the main switchboard **949.379.8499**. Keep it to one clear ask — never a sales-direct/billing-direct number for a general CTA.

## Workflow

```
1. Identify which page in the host artifact is sparse OR what stat needs visualization
2. Pick the template (A-H above) that matches the message intent
3. Outline the data:
   - Hero number / phrase
   - Supporting stats / steps
   - Takeaway line
4. Build the HTML/SVG with brand tokens
5. Render PNG via Playwright at the right dimensions
6. Embed in host (or use standalone for social/blog)
7. Run technijian-design-review on the host artifact
```

## Verify before done

Never declare an infographic finished unverified:
- **Render the actual output** (PNG/PDF) and visually proofread it at its real display size — check that every number, label, and source line is legible and on-brand.
- For embedded page fillers, use a **body-region fill metric** (exclude header/footer) to catch whitespace, short pages, or stranded captions — a figure that passes a page-height check can still leave the content area sparse or clip a caption.
- Confirm logo, tagline (if shown), and any CTA number match the brand essentials above.

## NotebookLM fallback

For concepts where you have no clear visual idea, use NotebookLM CLI to generate a starting concept:

```bash
notebooklm-py infographic --concept "3-stage Diverge-Converge-Synthesize flow for Technijian My AI methodology" --style "professional editorial, brand colors blue/orange/teal"
```

Then trace/adapt the result into a brand-compliant SVG. **Do not embed AI-generated raster infographics directly** — they often have illegible text and off-brand colors.

## Related skills

- **technijian-brand** — colors/typography source of truth
- **technijian-diagram** — for structural diagrams (use that, not this, for flowcharts)
- **technijian-social** — when the infographic IS the social post
- **technijian-design-review** — gates the host artifact
