---
name: technijian-biz-dev-blueprint
description: Generate a complete AI-Driven Digital Business Development Blueprint for a Technijian prospect or client. Produces a 55–65 page branded DOCX + PDF report with 7 customer personas, competitive landscape, Technijian capability proof mapped to client use cases, Y1 ROI model, 90/180/365 implementation roadmap, and Quick Wins — plus three Playwright-rendered diagrams embedded in the document. Built from the RKE engagement (2026-05-18) as the canonical pattern.
---

# Technijian AI-Driven Business Development Blueprint

## Overview

Generates a premium 55–65 page branded consulting deliverable that shows a prospect or client *exactly* how AI transforms their business development function — with Technijian products named and priced as the implementation partner.

**Keywords**: business development, AI blueprint, growth strategy, personas, competitive landscape, ROI, roadmap, DOCX, biz dev, digital transformation

**Canonical example**: `Clients/RKE/build-rke-report.js` — the first complete implementation of this pattern (RK Engineering Group, Newport Beach, delivered 2026-05-18).

---

## Phase 0: Intake

Before opening an editor, gather:

| Item | Source | Why |
|------|--------|-----|
| Existing market analysis or strategy deck | Client-provided | The base layer — expand, don't replace |
| Client website + LinkedIn | Public | Org structure, service lines, portfolio |
| Target procurement channels | Client or research | Public vs private, RFPs, direct |
| Regulatory / compliance environment | Industry research | Shapes AI use-case framing |
| Named competitors (3–5) | Client or research | Competitive landscape section |
| Current pain points (if shared) | Discovery call notes | Shapes persona priorities |
| Active engagement / opportunity size | Internal CRM | Calibrates investment table |

**If no source document exists**: run the Blueprint cold. Use web research to populate Sections 01–05, then layer in the Technijian sections (06–14). The report structure is the same.

---

## Report Structure (14 Sections + Appendix)

Always follow this exact order. Do not skip sections.

| # | Section | Key Content |
|---|---------|-------------|
| — | Cover | Blue top bar, logo, orange divider, title, client name, date, orange bottom bar |
| — | TOC | Auto-populated via invisible Heading1 paragraphs adjacent to each colored section header |
| 01 | Executive Summary | 4 KPI stat cards from client portfolio data (years, projects/clients served, personas, win rate or key metric) |
| 02 | Regulatory / Industry Architecture | The rules, frameworks, or market dynamics that define the client's operating environment |
| 03 | Service Architecture | Client's service lines — 3–4 categories with 4–6 bullets each |
| 04 | Project Portfolio Highlights | 4–6 named real projects/clients (anonymize if needed) with outcome framing |
| 05 | Strategic Market Dynamics & Procurement | How buyers find and hire the client; public vs private; decision drivers |
| 06 | The Customer Personas | 4 primary + 3 emerging personas with Volume×Margin quadrant diagram |
| 07 | Competitive Landscape | 5–7 named competitors, positioning table, gap analysis |
| 08 | Technijian Capability Proof | 5 proven Technijian builds mapped to client-specific applications (the "we've done this before" section) |
| 09 | How AI Transforms [Client]'s Growth Engine | Inbound / Outbound / Internal AI + 4-column AI Tools matrix citing Technijian services |
| 10 | Projected Business Impact & Service Investment | KPI lift table, Y1 ROI, capacity recovery hours, Service Investment Map by product |
| 11 | Implementation Roadmap | 90/180/365 day milestones with deliverables and timeline diagram |
| 12 | Quick Wins | 5 actions the client can start week 1 (no Technijian contract required) |
| 13 | Conclusion | Next-steps callout box + CTA |
| 14 | About Technijian | Productized services (My AI, My SEO, My Dev) + contact table |
| A | Appendix | Works cited with URLs (30–45 sources) |

---

## Phase 1: Research (Sections 01–05)

### Client intelligence checklist

- [ ] Full list of named service offerings and how they are described publicly
- [ ] Regulatory frameworks named (CEQA, HIPAA, ADA, NFPA, etc.)
- [ ] Any "state-of-the-market" dynamics (consolidation, regulation changes, AI adoption curve)
- [ ] Procurement pathways — RFPs, master service agreements, direct hire, referral
- [ ] Geographic footprint and target markets
- [ ] Real project names and outcomes (from portfolio, press releases, or LinkedIn)

**Voice rules during research**: No `leverage`, `seamless`, `unlock`, `world-class`, `robust`, `vendor`, `cutting-edge`. Use `trusted`, `low-friction`, `proven`, `purpose-built`.

---

## Phase 2: Persona Development (Section 06)

### Persona card format

Each persona = one colored table card:
- Header row: persona color background + persona name (white bold, 24pt)
- Label/value rows: 5 rows — Role, Pain Points (3 bullets), Decision Driver, AI Opportunity, Technijian Hook

### The 7-persona model

Build **4 primary personas** (high volume, established) + **3 emerging/niche personas** (growing, specialized):

| Tier | Count | Description |
|------|-------|-------------|
| Primary | 4 | Core buyer types who represent 80% of revenue today |
| Emerging | 3 | High-margin niches the client can capture with AI differentiation |

### Volume × Margin quadrant diagram

After all 7 persona cards, embed **Figure 6.0** — a scatter plot with:
- X-axis: Volume (deal frequency)
- Y-axis: Margin (fee/deal)
- Numbered dots (1–7) + externalized persona key panel
- Rendered via HTML + Playwright (see Diagram section below)

**Persona color assignments** (use in order):
```
Primary 1 → Core Blue   (006DB6)
Primary 2 → Core Orange (F67D4B)
Primary 3 → Teal        (1EAAC8)
Primary 4 → Critical Red (CC0000)
Emerging 5 → Chartreuse  (8BC34A)
Emerging 6 → Dark Charcoal (1A1A2E)
Emerging 7 → Teal (repeat, lighter shade)
```

---

## Phase 3: Competitive Landscape (Section 07)

### Competitor analysis format

Main table: 6 columns — Competitor | HQ | Size | Strengths | Weaknesses | AI Posture

### Gap analysis callout

After the table, a Core Blue bordered callout box:
> **The AI Differentiation Gap**: Explain in 2–3 sentences why none of the competitors have AI-native processes — and how Technijian closes that gap.

**Research minimum**: 5 named competitors with real data (website, LinkedIn, public RFPs). Do not invent competitor data.

---

## Phase 4: Technijian Capability Proof (Section 08)

This section is the centerpiece. It proves Technijian has already built what the client needs.

### The 5 proven builds to cite

Map exactly 5 Technijian proven capabilities to 5 client-specific applications:

| Proven Build | Adaptation Pattern |
|---|---|
| Multi-Agent SEO Automation (Claude/GPT-4o/Gemini + MCP + SEMrush/GA4/Perplexity) | Answer Engine Optimization (AEO) content machine for the client's regulatory keywords |
| AI Document Intelligence for FINRA (RFPs: days → minutes) | Client's RFP-response engine for their primary procurement channel |
| LLM Council pattern (ScamShield: 3-model peer review) | AI peer-review tool for the client's core deliverables (studies, proposals, reports) |
| Weaviate + Obsidian knowledge system | Client's institutional knowledge graph (decades of projects → queryable KB) |
| AI-Native SDLC v7.0 (3–5× faster ship) | Custom tools built for the client's specific workflows (calculators, monitors, CRMs) |

Each build = a callout box with:
- Dark Charcoal header: "Proven Build #N: [Build Name]"
- 2 rows: "What Technijian Built" | "How This Applies to [Client]"
- Left accent bar in Core Blue

---

## Phase 5: AI Growth Engine (Section 09)

### Three channels

| Channel | Content |
|---------|---------|
| **Inbound** | Answer Engine Optimization (AEO/SEO) — content strategy for AI-cited authority in the client's domain |
| **Outbound** | AI-powered lead generation — automated prospecting, outreach personalization, pipeline tracking |
| **Internal** | AI automation — capacity recovery, quality control, knowledge retention, proposal acceleration |

### AI Tools matrix

4-column table (not 3): Tool / Use Case / Impact Metric / **Technijian Service**

The 4th column names the specific My AI / My SEO / My Dev offering — no abstract "AI for X" framing.

---

## Phase 6: Business Impact & Service Investment (Section 10)

### KPI lift table

| KPI | Current State | With AI | Lift |
|-----|-------------|---------|------|
| Proposal win rate | Client's current % | + estimate | + X pts |
| Billable-equivalent hours recovered | 0 | Y hours/yr | New capacity |
| Time-to-proposal | Client's current | Reduced by Z% | — |
| Content-attributed pipeline | $0 | $ target | — |

### Y1 ROI model

| Row | Value |
|-----|-------|
| Technijian Service Investment (Y1) | $X–$Y range |
| Projected new pipeline attributed to AI | $A–$B |
| ROI ratio | Nx–Mx |
| Payback period | Q quarter |

Use real pricing from:
- `services/My SEO/assets/my-seo-content.txt`
- `services/My AI/assets/my-ai-content.txt`
- Any service investment data from client discovery

### Service Investment Map (10.4)

Explicit table: Technijian Service | Tier / Description | Monthly Investment | Y1 Total

Always include at minimum:
- My SEO (with specific tier and add-ons)
- My AI (Fractional Advisor + at least one engagement type)
- My Dev (scoped build + Managed App Services)

---

## Phase 7: Implementation Roadmap (Section 11)

### 3-phase structure

| Phase | Timeline | Milestones |
|-------|----------|------------|
| Foundation | 0–90 days | 2 milestones — infrastructure + knowledge base |
| Growth | 90–180 days | 2 milestones — first content engine + lead gen |
| Scale | 180–365 days | 2 milestones — ROI loop closed + next-gen builds |

Each milestone: Name + 3 bullet deliverables.

### Timeline diagram (Figure 11.0)

Rendered via HTML + Playwright:
- Horizontal timeline bar with 3 gradient phase zones (blue → orange → teal)
- 6 milestone markers with Lucide icon circles
- 3 outcome boxes below the bar with top accent color bars
- Milestone labels outside/above bar (no overlapping)

---

## Phase 8: Quick Wins (Section 12)

5 actions the client can take in Week 1 — **no Technijian contract required**:

1. Something they can Google or start researching today
2. A free tool audit (GA4, Search Console, LinkedIn analytics)
3. A content or keyword gap they can act on manually
4. A process they can document for future AI training data
5. A competitor monitoring setup (Google Alerts, LinkedIn notifications)

Frame these as "proof of concept" steps — they naturally lead to engaging Technijian for acceleration.

---

## Diagrams: HTML + Playwright (3 Required)

Never use matplotlib. Always use HTML + CSS + Lucide icons + Playwright for production-grade output.

### Setup

```python
from playwright.sync_api import sync_playwright
import base64

def render_diagram(html_content, output_path, width=1200, height=700):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.set_content(html_content)
        page.wait_for_timeout(500)
        page.screenshot(path=output_path, full_page=False)
        browser.close()
```

### Diagram 1: Persona Volume × Margin Quadrant (Figure 6.0)

- 900×650px SVG-in-HTML
- X-axis: Volume (deal frequency), Y-axis: Margin ($/deal)
- Numbered filled circles (diameter 40px) in persona colors
- Persona key panel on the right (6 cols: # | Name | Color chip | Volume | Margin | Priority)
- Subtle diagonal shading for high-volume + high-margin quadrant

### Diagram 2: AI Growth Engine Architecture (Figure 9.0)

- 1200×700px
- 3-column layout: Data Sources | AI Layer (dark gradient center) | Outputs
- Lucide icons in colored circle bubbles (file-text, brain, network, etc.)
- Each column: 4–5 item cards with icon + label + 1-line description
- Subtle drop shadows on cards, accent underline on column headers

### Diagram 3: 90/180/365 Implementation Timeline (Figure 11.0)

- 1400×600px
- Horizontal gradient bar: blue (days 0–90) → orange (90–180) → teal (180–365)
- 6 milestone markers: Lucide icon in white circle on colored background
- Phase zone labels above bar ("Foundation", "Growth", "Scale")
- Milestone labels alternating above/below connector lines (no overlap)
- 3 outcome cards below bar with top color accent

### Fonts (inline as @import)

```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');
body { font-family: 'Plus Jakarta Sans', sans-serif; }
</style>
```

### Lucide icons

Embed as inline SVG (MIT license). Do not use external CDN — embed the SVG paths directly for reproducibility.

---

## Build Pattern (docx-js)

### File structure

```
Clients/[ClientCode]/
  build-[clientcode]-report.js    ← docx-js builder (single file, reads brand-tokens.json)
  generate-diagrams.py            ← Playwright HTML → PNG renderer
  diagrams/
    architecture.png              ← Figure 9.0
    timeline.png                  ← Figure 11.0
    personas.png                  ← Figure 6.0
  [ClientCode]-AI-Growth-Report.docx
  [ClientCode]-AI-Growth-Report.pdf
  _source.md                      ← Pandoc extract of original source doc (if applicable)
```

### Section header pattern (TOC-visible)

Always emit a tiny invisible Heading1 paragraph BEFORE the visual colored table. This makes sections appear in the TOC while the colored accent bar provides the visual treatment:

```javascript
function sectionHeader(text) {
  return [
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      run: { size: 1, color: "FFFFFF" },         // invisible — TOC only
      spacing: { before: 480, after: 0 },
      keepNext: true,
    }),
    new Table({                                   // visual accent bar
      columnWidths: [120, 9240],
      rows: [new TableRow({ children: [
        new TableCell({ shading: { fill: "006DB6" }, borders: noBorders, children: [new Paragraph({})] }),
        new TableCell({ borders: noBorders, margins: { top: 80, bottom: 80, left: 160 },
          children: [new Paragraph({ children: [new TextRun({ text, size: 36, bold: true, color: "006DB6" })] })]
        })
      ]})]
    })
  ];
}
// Usage: ...sectionHeader("01 — Executive Summary"),
```

### TOC config

```javascript
new TableOfContents("Table of Contents", {
  hyperlink: true,
  headingStyleRange: "1-2",   // h3 excluded — keeps TOC compact
})
```

### Page setup

```javascript
page: {
  size: { width: 12240, height: 15840 },  // US Letter
  margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
}
```

### No pageBreakBefore on H1

Remove `pageBreakBefore: true` from Heading1 style. Use `spacing.before: 480` + `keepNext: true` instead. This prevents orphan pages when a section ends mid-page. Cover and TOC are the only forced page breaks.

---

## PDF Generation (Word COM)

After generating the DOCX, convert to PDF via Word COM to force TOC update:

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Resolve-Path "Clients\[ClientCode]\[ClientCode]-AI-Growth-Report.docx"
$pdfPath = Resolve-Path "Clients\[ClientCode]\[ClientCode]-AI-Growth-Report.pdf"
$doc = $word.Documents.Open($docPath.Path)
$doc.TablesOfContents | ForEach-Object { $_.Update() }
$doc.SaveAs([ref]$pdfPath.Path, [ref]17)   # 17 = wdFormatPDF
$doc.Close()
$word.Quit()
```

---

## Quality Gates (run before declaring done)

### Gate 1: Content accuracy
- [ ] All statistics are real (sourced or client-provided) — no placeholder numbers
- [ ] All competitor names are real organizations (not invented)
- [ ] Investment ranges match current pricing files in `services/`
- [ ] Cross-references between sections are correct (e.g., "see Section 11.1" actually exists)
- [ ] Persona count is consistent across all sections that mention it

### Gate 2: Voice compliance
Run `technijian-voice` skill on the full draft text before inserting into docx-js. Flag and fix:
- Banned words: `leverage`, `seamless`, `unlock`, `world-class`, `robust`, `vendor`, `cutting-edge`, `end-to-end` (unless technical), `game-changing`, `revolutionary`
- Weak CTAs: "feel free to", "don't hesitate to"
- AI slop phrases: "in today's fast-paced world", "in conclusion", "it is important to note"

### Gate 3: Visual / PDF audit
- [ ] Open DOCX and verify TOC has all 14 sections
- [ ] Open PDF page-by-page — no orphan callout boxes stranded alone on a page
- [ ] All 3 diagrams render at their embedded display size — text readable, no overlapping labels
- [ ] Cover page: blue top bar, logo, orange divider, title, orange bottom bar, "CONFIDENTIAL"
- [ ] Header/footer present on every body page (not cover/TOC)

### Gate 4: Diagram readability
- [ ] Screenshot each diagram at its embedded size (approx 500px wide in DOCX) — NOT just at export size
- [ ] Milestone labels in timeline diagram: no overlap, all visible
- [ ] Persona dots in quadrant: numbered, no overlap
- [ ] Architecture columns: headers not crashing, icon circles aligned

---

## Service Investment Defaults

Use these as starting points; adjust for client size and scope.

| Product | Tier | Monthly | Y1 Total |
|---------|------|---------|----------|
| My SEO | Tier 3 + AI Search Opt + PR + Content Syndication | $1,550/mo | $18,600 |
| My AI | Fractional AI Advisor (4 hrs/mo) | $2,000/mo | $24,000 |
| My AI | Executive AI Workshop (1× upfront) | — | $5,000 |
| My AI | Fixed-Scope AI Build | — | $25,000–$75,000 |
| My Dev | Custom App Build (scoped) | — | $40,000–$120,000 |
| My Dev | Managed App Services | $800/mo | $9,600 |

**Y1 range framing**: Use a low (conservative) and high (full engagement) number.
- Conservative: SEO + Fractional AI Advisor + 1 scoped build
- Full: SEO + AI Workshop + 2 AI builds + Dev + Managed Services

---

## Voice Rules for This Document Type

This is a **business development consulting document**, not a marketing brochure and not an IT audit.

1. **Specific over vague**: "7,000 transportation studies" not "thousands of projects"
2. **Names over categories**: "Fehr & Peers" not "a major competitor"
3. **Outcomes over features**: "win 3 additional on-call RFPs per year" not "improve proposal quality"
4. **Evidence before pitch**: Capability Proof (Section 08) must come before the AI growth engine pitch (Section 09)
5. **Quick Wins are zero-commitment**: Frame them as self-serve actions — do not attach Technijian pricing to them
6. **ROI model is projected, not guaranteed**: Use "projected", "estimated", "modeled at" — never "guaranteed"
7. **Client industry language throughout**: Use the same terms the client uses (CEQA not "environmental law", VMT not "traffic metrics") — this shows domain knowledge

---

## Related Skills

- **technijian-report** — For IT/security/QBR reports (not biz-dev strategy docs)
- **technijian-diagram** — For additional editorial SVG diagrams beyond the 3 standard ones
- **technijian-roi** — For standalone ROI/business-case models referenced in Section 10
- **technijian-voice** — Audit full draft text before inserting into docx-js
- **technijian-brand** — Master brand reference for any values not covered here
