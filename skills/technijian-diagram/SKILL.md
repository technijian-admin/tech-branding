---
name: technijian-diagram
description: Generate brand-compliant Technijian diagrams — architecture, process flow, sequence, swimlane, RACI, network topology, ER, decision tree, quadrant, Venn, layer stack — as self-contained HTML+SVG (no Mermaid, no JS deps). Use when adding diagrams to brochures, reports, proposals, blog posts, or training material. Output reads brand-tokens.json so colors/fonts inherit automatically.
---

# Technijian Diagram Generator

## When to use this skill

Use this skill instead of Mermaid, ASCII art, or screenshots-of-Visio whenever a Technijian artifact needs:
- Process flows (engagement model, incident response, change management)
- Architecture diagrams (network topology, cloud migration, AI platform stack)
- RACI matrices, decision trees, swimlanes
- Quadrants (e.g., risk × likelihood, cost × impact)
- Venn diagrams (overlap of services, compliance frameworks)
- Layer stacks (defense-in-depth, OSI, AI agent layers)
- Sequence diagrams (auth flow, ticket escalation, integration flows)
- Org charts / pod model visualizations
- Timelines / Gantt-style roadmaps

## Why a custom diagram skill

Public diagram tools either (a) look generic AI-Slop (Mermaid pastel defaults), (b) require a separate executable (draw.io desktop), or (c) ignore brand. This skill produces:
- **Editorial-quality SVG** with brand colors from `assets/brand-tokens.json`
- **Self-contained HTML** — no JS, no external CSS, paste into any HTML artifact
- **PDF-ready** via Playwright at the same DPI as brochures/datasheets

## Output format

Each diagram is a self-contained HTML fragment with inline `<style>` and inline SVG:

```html
<figure class="tj-diagram tj-diagram--flow" role="img" aria-labelledby="d1-title">
  <figcaption id="d1-title">[Diagram title]</figcaption>
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid meet">
    <!-- nodes, edges, labels -->
  </svg>
</figure>
<style>
  .tj-diagram { font-family: 'Open Sans', sans-serif; }
  /* brand-token-driven defaults */
</style>
```

For embedding in brochures/datasheets, also export a PNG via Playwright:
```python
page.set_content(html_fragment); page.locator('.tj-diagram').screenshot(path='diagram.png')
```

### PNG export discipline (crop + aspect ratio)

When the diagram PNG is placed into a docx/PDF, two failures distort or strand figures. Avoid both:

1. **Auto-crop each PNG to its content plus a small uniform margin.** Screenshotting the `.tj-diagram` locator (not the whole viewport) gets you most of the way, but trim residual whitespace so the figure does not float in a sea of padding when scaled into a column. Pillow `Image.getbbox()` on the inverted image gives the content box; pad it by an equal margin on all sides before saving.
2. **DERIVE each figure's aspect ratio from the REAL PNG pixel dimensions — never hardcode AR.** Read `width, height = Image.open(png).size` at embed time and size the docx/PDF picture from that ratio. A hardcoded AR drifts as you tweak the SVG `viewBox` and silently distorts the figure or strands it in the wrong slot. Compute the placed width, then set height = width × (h_px / w_px).

### Long y-axis / category labels (overflow fix)

For bar/quadrant/timeline diagrams with long left-side labels, do NOT let the label run into the plot. Reserve a **fixed-width label column (a bar of constant width) and rotate the text about its own center** inside that column, so a long label cannot overflow the plot area regardless of length. Truncating or wrapping is acceptable only inside that reserved width.

## Brand tokens (read from brand-tokens.json)

`assets/brand-tokens.json` is the SINGLE SOURCE OF TRUTH for color/typography. READ it at build time and sync these hex values from it — the constants below are a cached convenience for reference, not authority. If a token drifts in the JSON, the diagram must follow the JSON, not this snippet.

```js
const C = {
  blue:   '#006DB6',  // Primary nodes, primary connections
  orange: '#F67D4B',  // Highlight node (max 1-2 per diagram), CTAs
  teal:   '#1EAAC8',  // Secondary nodes, "in-progress" state
  dark:   '#1A1A2E',  // Outline nodes on light background
  grey:   '#59595B',  // Body text, axes, tick marks
  light:  '#E9ECEF',  // Borders, gridlines, neutral nodes
  off:    '#F8F9FA',  // Background fills for grouped regions
};
```

## Diagram types & templates

### 1. Flow / Process

Horizontal flow with rounded rectangles, arrowheads in Core Blue, single highlight in Core Orange.

```html
<svg viewBox="0 0 800 200">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#006DB6"/>
    </marker>
  </defs>
  <!-- 4 stages -->
  <g>
    <rect x="20"  y="60" width="160" height="80" rx="8" fill="#F8F9FA" stroke="#006DB6" stroke-width="2"/>
    <text x="100" y="105" text-anchor="middle" font-size="14" font-weight="700" fill="#1A1A2E">Discover</text>
    <line x1="180" y1="100" x2="220" y2="100" stroke="#006DB6" stroke-width="2" marker-end="url(#arr)"/>
    <!-- ... repeat for Design / Deploy / Operate -->
  </g>
</svg>
```

### 2. Architecture (layered)

Stacked horizontal bands with service-pillar colors as left accent strip.

### 3. RACI matrix

Plain HTML table with brand-color-coded cell backgrounds: R=Core Orange, A=Core Blue, C=Teal, I=Light Grey.

### 4. Sequence

Two-lane diagram with vertical lifelines and labeled horizontal arrows. Use Core Blue for forward calls, Teal for returns.

### 5. Swimlane

Horizontal bands by actor; tasks as rounded rectangles per band; Core Orange marks the critical-path task.

### 6. Quadrant (2×2)

```
Y-axis label
   ┌──────────┬──────────┐
   │   Q2     │   Q1     │
   │  niche   │  HERO    │ ← Core Orange highlight in Q1
   ├──────────┼──────────┤
   │   Q3     │   Q4     │
   │  avoid   │  optimize│
   └──────────┴──────────┘
              X-axis label
```

### 7. Venn (3-circle)

Three overlapping circles with brand colors at 30% opacity; intersection labeled in dark text.

### 8. Layer stack (defense-in-depth)

Stacked horizontal bands like a layer cake; each layer is a rounded rectangle with a brand-colored left accent strip and a name on the left + 1-line description on the right.

### 9. Pod model org chart

Center node "Client" surrounded by satellite nodes (vCIO, Pod Lead, Engineers, Tier-2, etc.) connected with thin curves. Use Core Blue for org nodes, Core Orange for the client at center.

### 10. Decision tree

Top-down binary tree with rounded rectangles for nodes; Yes branches go left in Core Blue, No branches go right in Brand Grey.

### 11. Timeline / Gantt

Horizontal time axis with stacked task bars; quarter labels in Core Blue uppercase.

### 12. Network topology

Cloud → firewall → switch → endpoints. Use the service-pillar icons from `assets/icons/service-pillars/` for major nodes.

### 13. Compliance map

Grid: rows = controls, columns = HIPAA / PCI / SOC 2 / GDPR. Cells filled with status colors from `brand-tokens.json` `color.status`.

### 14. AI agent stack

Vertical layered diagram: Orchestrator → Agents → Tools → Models → Data. Each layer in a different brand color.

## Design principles (anti-AI-Slop)

1. **One highlight color per diagram.** If everything is colored, nothing stands out. Use Core Orange for max 1–2 elements; everything else is Core Blue or neutral.
2. **No drop shadows.** Editorial diagrams use 1–2px hairline borders, never shadows.
3. **No gradients in nodes.** Solid fills only.
4. **Coordinates divisible by 4.** Avoids the "AI-generated random pixels" look.
5. **Text inside nodes ≥ 12px.** Never use 8-10px labels — they're unreadable in print.
6. **WCAG contrast.** White text on Core Blue ✓; white text on Core Orange ✗ (use dark text). White text on Teal ✗ (use dark text).
7. **Title above the diagram, not inside.** Use `<figcaption>` for titles.
8. **`role="img"` + `aria-labelledby`** for screen-reader accessibility.

## Workflow

```
1. Pick the closest template type from the 14 above
2. Sketch the structure in plain text first (nodes + edges)
3. Compute coordinates on a 4px grid
4. Build the SVG with brand tokens (synced from brand-tokens.json)
5. Render via Playwright to PNG; auto-crop + derive AR from real pixels; embed in target artifact
6. VERIFY before done: open the rendered PNG and proofread it at its display size in the host artifact
7. Run technijian-design-review on the host artifact
```

## Verify before done (never declare done unverified)

A diagram that looks fine in the SVG can still fail once rasterized and scaled into a doc. Always:
- **Open the final PNG and read every label at its display size.** Sub-12px or clipped text that survived the SVG check shows up here.
- **Check for stranded captions and dead whitespace** — a figure that scaled smaller than its allotted box leaves a gap; re-crop or re-fit rather than shipping the gap.
- **Confirm the figure aspect ratio in the host doc matches the source** (no horizontal/vertical squish from a wrong AR).
- Do not declare the diagram done until you have visually inspected the embedded result, not just the source SVG.

## Related skills

- **technijian-brand** — color/typography source of truth
- **technijian-infographic** — when the visual is more than a structural diagram (e.g., stat callouts, illustrations)
- **technijian-design-review** — runs the diagram through brand & accessibility gates
