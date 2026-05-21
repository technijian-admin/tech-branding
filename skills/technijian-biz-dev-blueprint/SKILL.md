---
name: technijian-biz-dev-blueprint
description: Generate an AI-Driven Digital Business Development Blueprint for a Technijian prospect or client. A research-driven, client-specific branded DOCX + PDF report that shows exactly how AI transforms their business development function — with Technijian products named and priced as the implementation partner. Section count, persona count, and diagrams are determined by research, not fixed in advance.
---

# Technijian AI-Driven Business Development Blueprint

## Overview

Generates a premium branded consulting deliverable (typically 40–70 pages depending on client complexity) that shows a prospect or client *exactly* how AI transforms their business development function — with Technijian products named and priced as the implementation partner.

**Keywords**: business development, AI blueprint, growth strategy, personas, competitive landscape, ROI, roadmap, DOCX, biz dev, digital transformation

**Canonical example**: `Clients/RKE/build-rke-report.js` — first full implementation (RK Engineering Group, Newport Beach, 2026-05-18).

**Key principle**: Every decision — which sections to include, how many personas to build, which diagrams to create — must be driven by what the research actually reveals about this specific client. Never copy the RKE structure verbatim. Use it as a reference, not a template.

---

## Phase 0: Intake & Research Planning

Before writing a single section, answer these questions. The answers determine structure.

### 1. Client complexity assessment

| Question | Answer shapes |
|----------|---------------|
| How many distinct service lines does the client have? | Section 03 depth; persona count |
| Are they in a regulated industry? | Whether to include a Regulatory section |
| Do they have an existing market analysis or strategy doc? | Starting point depth; gaps to fill |
| How many distinct buyer types can you name with confidence? | Persona count |
| Does the client sell to a broad market or a finite, *named* list of buyers? | Demand-gen (volume) vs. account-based / ABM (depth) — see GTM motion below |
| Is the competitive landscape documented or do you need to research it? | Competitor section complexity |
| What's the likely deal size with Technijian? | Investment table calibration |
| Is this a single location or multi-market client? | Whether to include a geographic expansion section |

### 2. Go-to-market (GTM) motion — broad demand-gen vs. account-based (CRITICAL)

**Classify this before writing the growth engine. Getting it wrong is the single most common way this deliverable misses.** It decides whether the "How AI Transforms Growth" section is framed as *volume demand generation* or *account-based (ABM) depth*.

| Signal | Motion | Growth-engine framing |
|--------|--------|----------------------|
| Sells to a large, open market; success = more qualified leads in the funnel; buyer is often anonymous until they raise a hand | **Broad demand-gen** | Lead generation, inbound funnels, review velocity, map-pack — volume plays are appropriate |
| Sells to a finite, KNOWN universe of buyers they can name; wins work through relationships, referrals, RFPs, or on-call master agreements; "we know exactly who our targets are" | **Account-based (ABM)** | Account intelligence, trigger/signal monitoring on named targets, RFP/proposal automation, pre-meeting account dossiers, personalized per-account outreach — NEVER "lead generation" or "shotgun marketing" |

**Default by industry**: AEC / engineering, government-contracting, professional services (legal, accounting, consulting), niche B2B, and DME / medical-device-style B2B2C firms are almost always **account-based**. Local consumer services (auto, home services, healthcare practices, beauty, food) are usually **broad demand-gen**. When unsure, ask the client one question: *"Do you have a known list of target accounts, or are you trying to reach a broad market?"*

**Why this matters (RKE lesson, 2026-05-21):** The RKE blueprint was technically strong but was followed by a demand-gen offer ("a Digital Marketing Campaign for inbound and lead gen"). RKE's president declined: *"we are intentionally not looking for a broad 'shotgun' marketing approach or generalized lead generation... we know exactly who our targets are."* The capability was right; the framing was wrong. For an ABM client, reframe the SAME AI as the layer *under* their named-account strategy — see Phase 6.

### 3. Data gathering checklist

| Item | Source | Why |
|------|--------|-----|
| Client website (full crawl) | Public | Services, tone, gaps, trust signals |
| Google/Yelp reviews (50+) | Public | Real customer language, pain points, churn triggers |
| LinkedIn company + owner | Public | Team size, markets served, positioning |
| Named competitors (research 5–8) | Yelp, Google, search | Competitive moat analysis |
| Client-provided materials | Client | Source of truth for facts, portfolio, pricing |
| Procurement / sales channels | Discovery or research | How buyers actually find and hire them |
| Regulatory or licensing requirements | Industry research | Only if relevant; skip if consumer-facing service business |
| Pricing (client's and competitors') | Public + client | ROI model input |

**If no source document exists**: run cold. Use web research to populate the business-context sections, then layer the Technijian sections on top.

---

## Phase 1: Research Synthesis

Before writing sections, produce a `_research.md` file in the client folder with:

1. **Business snapshot** — what they do, who they serve, founding story, key stats
2. **GTM motion** — classify as broad demand-gen or account-based (ABM) per Phase 0.2. For ABM clients, capture the *named-account universe*: target segments + example named accounts (e.g., "key developers, municipal agencies, planning firms"). This is what the growth engine targets instead of a generic lead funnel.
3. **Competitive landscape** — named competitors, their ratings, pricing, strengths, gaps
4. **Customer voice** — exact phrases from real reviews; what customers praise and what they complain about
5. **Market gaps** — what no competitor is doing well (these become AI opportunities)
6. **AI opportunity inventory** — brainstorm 10–15 ways AI could help THIS specific business; rank by impact and Technijian fit
7. **Persona candidates** — list every buyer type you can find evidence for; you'll cull during writing

This file is the foundation. Sections are written from it, not invented during writing.

---

## Report Structure (Research-Driven)

**Do not use a fixed template.** Select sections from the menu below based on what the research supports. Every section included must have enough real data to fill it credibly. Better to write 6 dense sections than 14 thin ones.

### Always-include (every blueprint)

| Section | Key Content |
|---------|-------------|
| Cover | Blue top bar, logo, orange divider, title, client name, date, orange bottom bar |
| TOC | Auto-populated via invisible Heading1 paragraphs adjacent to each colored section header |
| Executive Summary | KPI stat cards from real client data (use as many cards as you have credible stats — typically 3–5) |
| The Customer (Personas) | Research-driven personas — as many as the data supports; see persona guidance below |
| Competitive Landscape | Named, researched competitors — as many as exist; see competitor guidance below |
| Technijian Capability Proof | Map proven Technijian builds to THIS client's specific use cases |
| How AI Transforms [Client]'s Growth Engine | Inbound / Outbound / Internal AI; AI Tools matrix citing Technijian services |
| Business Impact & Service Investment | KPI lift, ROI model, Service Investment Map with real pricing |
| Implementation Roadmap | Milestones paced to client complexity — not always 90/180/365 |
| Quick Wins | Client-specific actions they can take in week 1, no contract required |
| Conclusion + CTA | Next-steps callout |
| About Technijian | My AI, My SEO, My Dev + contact table |
| Appendix | Works cited (however many sources the research produced) |

### Include-if-relevant (add when research justifies it)

| Section | Include when |
|---------|-------------|
| Regulatory / Industry Architecture | Client operates in a regulated environment (legal, healthcare, engineering, financial services, construction) |
| Service Architecture | Client has 3+ distinct service lines worth explaining to a new buyer |
| Project / Portfolio Highlights | Client has a named portfolio of past work they're proud of |
| Strategic Market Dynamics & Procurement | Client's buyer journey is complex or non-obvious (B2B, RFPs, institutional buyers) |
| Geographic Expansion Strategy | Client is actively targeting new markets or cities |
| Brand & Digital Presence Audit | Client has a significant gap between their quality of work and their online presence |

---

## Phase 2: Persona Development

### Persona count: research-driven

Do not target a fixed number. Build as many personas as you can support with evidence:

- **Must have evidence**: a real customer review, a described client type, a buyer segment you can name with confidence
- **Stop when**: you're inventing personas to fill a number rather than describing real buyer segments
- **Typical range**: 3–6 personas; fewer for focused businesses, more for multi-market or multi-service clients
- **Distinguish tiers if helpful**: if some personas are high-volume/core and others are niche/emerging, say so — but don't force a split if the data doesn't show one

### Persona card format

Each persona = one colored table card:
- Header row: persona color background + persona name (white bold, 24pt)
- Label/value rows: Role, Pain Points (2–4 bullets), Decision Driver, AI Opportunity, Technijian Hook

### Volume × Margin quadrant diagram

Include this diagram **only if** you have 4+ personas AND can credibly place each on a volume/margin axis. For consumer service businesses with similar margin profiles, a different visual (e.g., frequency × spend) may be more honest.

### Persona color pool (assign in order of importance)

```
Primary personas  → Core Blue (006DB6), Core Orange (F67D4B), Teal (1EAAC8), Critical Red (CC0000)
Secondary personas → Chartreuse (8BC34A), Dark Charcoal (1A1A2E), Purple (7B2D8B), Gold (F5A623)
```

---

## Phase 3: Competitive Landscape

### Competitor count: research-driven

Include every named competitor you can find with real data. Don't pad with generic categories ("national chains") and don't limit to 5 if 8 exist.

**Minimum data required per competitor to include them:**
- Name + location
- One measurable fact (Yelp rating, review count, years in business, or price point)
- One identifiable strength or weakness

### Competitor table format

Adapt columns to the industry. Standard: Name | Market | Rating/Reviews | Strengths | Weaknesses | AI/Digital Posture

### Gap analysis callout

After the table, a Core Blue bordered callout: where is the white space no competitor owns? This becomes the AI differentiation thesis.

---

## Phase 4: Diagrams

### Diagram selection: what best visualizes THIS client's data?

Do not default to the RKE three-diagram set. For each potential diagram, ask: *does this data structure actually need a visual, or does a table serve better?*

**Diagram candidates:**

| Visual type | Use when |
|-------------|----------|
| Volume × Margin scatter | 4+ personas with meaningfully different volume and margin profiles |
| Frequency × Spend scatter | Consumer service businesses where volume and margin are similar across personas |
| AI growth engine architecture | Client has inbound + outbound + internal AI opportunities worth illustrating |
| Implementation timeline | Roadmap has 3+ distinct phases with sequential dependencies |
| Before/after comparison | Client has a measurable current-state vs future-state contrast |
| Geographic heat map | Multi-market client where location matters to the strategy |
| Funnel / conversion diagram | Client has a defined sales or customer journey worth mapping |
| Competitive radar chart | 5+ competitors with 4+ comparable attributes |

**Always render via HTML + CSS + Lucide icons + Playwright.** Never matplotlib.

**Skip a diagram if**: the same information reads better as a table or bullet list. A diagram earns its page — if it doesn't add clarity, cut it.

---

## Phase 5: Technijian Capability Proof

This section is the credibility centerpiece — it comes BEFORE the AI growth pitch. It proves Technijian has already built what this specific client needs.

### Build count: research-driven

Map as many proven Technijian builds as are genuinely relevant to this client. Don't force 5 if 3 are clearly applicable, and don't pad to hit a number. Each build must have a specific, named client application — not a generic one.

**Proven Technijian builds available to cite** (select what fits):

| Proven Build | Best fit for |
|---|---|
| Multi-Agent SEO + AEO Platform (Claude/GPT-4o/Gemini + MCP + SEMrush/GA4/Perplexity) | Any client who wins business through online visibility or content authority |
| AI Document Intelligence (RFPs: days → minutes) | B2B clients with proposal-heavy sales cycles |
| LLM Council pattern — 3-model peer review (ScamShield) | Clients whose core deliverable is a document, report, or recommendation |
| Weaviate + Obsidian knowledge system | Clients with years of institutional knowledge locked in files and people's heads |
| AI-Native SDLC v7.0 — custom app delivery 3–5× faster | Clients who need a specific workflow tool, calculator, or CRM built |
| AI-Powered Review & Reputation System | Consumer-facing businesses where online ratings drive new customer acquisition |
| Local SEO + Google Business Profile AI automation | Local service businesses competing on map pack ranking and review velocity |
| AI Booking & Scheduling Optimization | Service businesses where booking friction causes revenue loss |
| Social Content AI — before/after, short-form video | Visually-driven service businesses (auto, beauty, home services, food) |

### Callout box format

Each build = one callout box:
- Dark Charcoal header: "Proven Build: [Build Name]"
- Row 1: "What Technijian Built" — describe the actual build in 1–2 sentences
- Row 2: "How This Applies to [Client]" — the specific application for this client
- Left accent bar in Core Blue

---

## Phase 6: AI Growth Engine

**First, match the framing to the client's GTM motion (Phase 0.2).** The three channels stay, but their *content* changes completely between a broad demand-gen client and an account-based (ABM) client. For an ABM client, the phrase "lead generation" should not appear — reframe it as account intelligence and targeted outreach.

### Three channels (always include all three)

| Channel | Broad demand-gen framing | Account-based (ABM) framing |
|---------|--------------------------|------------------------------|
| **Inbound** | AEO/SEO for AI-cited authority; Google Map Pack dominance; review velocity | Authority/AEO content aimed at the *specific named buyers* — the technical questions those planners/agencies/buyers actually ask — so the firm is the cited expert in its narrow domain |
| **Outbound** | AI lead generation — automated prospecting, review generation, referral activation, broad outreach personalization | Account intelligence + **trigger/signal monitoring** on named targets (new filings, RFPs, project awards, leadership changes); **RFP/proposal auto-drafting**; **pre-meeting account dossiers**; personalized per-account outreach against the client's *existing* target list |
| **Internal** | AI automation — booking optimization, capacity recovery, knowledge retention, quality control | Knowledge graph of institutional history → case studies matched to each target; capacity recovery; quality control on deliverables |

> **Never pitch broad lead-gen / "shotgun" marketing to an account-based client.** They already know who their targets are; the value is depth and timing, not volume. State plainly that AI *supports* the human relationship layer (referrals, trust, in-person) and does not replace it — that honesty builds credibility. (RKE declined the engagement on exactly this framing error — see Phase 0.2.)

### AI Tools matrix

Always 4 columns: Tool / Use Case / Impact Metric / **Technijian Service**

The 4th column names the specific My AI / My SEO / My Dev offering. No abstract "AI for X" framing — name the product.

Rows = as many AI tools as are relevant to this client. Don't pad; don't cut tools that genuinely apply.

---

## Phase 7: Business Impact & Service Investment

### KPI lift table

Build KPI rows from what THIS client actually cares about. Do not copy the RKE row set. Typical rows for different client types:

- **Service businesses**: new customers/month, review rating, repeat booking rate, response time
- **B2B/professional services**: proposal win rate, time-to-proposal, pipeline value, hours recovered
- **Multi-location**: revenue per location, referral rate, average ticket size

Always use the client's current state as the baseline where known. If unknown, say "estimated current" with the assumption noted.

### Y1 ROI model

| Row | Value |
|-----|-------|
| Technijian Service Investment (Y1) | $X–$Y range |
| Projected revenue attributed to AI program | $A–$B |
| ROI ratio | Nx–Mx |
| Payback period | Q quarter |

Use real pricing from:
- `services/My SEO/assets/my-seo-content.txt`
- `services/My AI/assets/my-ai-content.txt`
- Any service investment data from client discovery

### Service Investment Map

Table: Technijian Service | Tier / Description | Monthly Investment | Y1 Total

Include every product that genuinely applies. Skip products that don't fit this client — don't include My Dev just to look comprehensive if there's no dev scope.

---

## Phase 8: Implementation Roadmap

### Phase structure: research-driven

Do not default to 90/180/365 days. Pace the roadmap to what the client can realistically absorb:

- **Simple service business**: 30/60/90 days (fast wins matter; don't overwhelm)
- **Mid-complexity B2B**: 90/180/270 days
- **Complex enterprise / regulated**: 90/180/365 days

Label phases by outcome, not just calendar dates. "Foundation → Growth → Scale" works well. "Quick Wins → Automation → Intelligence" works for some clients. Use whatever framing fits.

Each phase: 2–4 milestones. Each milestone: name + 2–4 bullet deliverables.

### Timeline diagram

Include a timeline diagram **only if** the roadmap has 3+ sequential phases and the visual helps the reader understand dependencies. For simple 2-phase plans, a table is cleaner.

If you include a diagram, render via HTML + Playwright (not matplotlib):
- Horizontal bar with gradient phase zones
- Milestone markers with Lucide icon circles
- Milestone labels that do NOT overlap
- Outcome boxes or callouts below the bar

---

## Phase 9: Quick Wins

Client-specific actions the client can take in their first week — **no Technijian contract required**.

### Count: as many as apply, minimum 3

Each Quick Win must be:
- Specific to this client's situation (not generic advice)
- Completable without spending money or signing anything
- A natural on-ramp to Technijian's engagement

**Example categories** (adapt to client):
- A free tool they can audit today (Google Business Profile, GA4, Search Console)
- A review generation action they can do manually (text their last 10 customers)
- A content gap they can fill this week (add photos, update hours, write FAQ)
- A competitor they should monitor (set a Google Alert)
- An internal process they can document (for future AI training data)

---

## Playwright Render Setup

```python
from playwright.sync_api import sync_playwright

def render_diagram(html_content, output_path, width=1200, height=700):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.set_content(html_content)
        page.wait_for_timeout(500)
        page.screenshot(path=output_path, full_page=False)
        browser.close()
```

### Fonts
```html
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');
body { font-family: 'Plus Jakarta Sans', sans-serif; }
</style>
```

Embed Lucide icons as inline SVG (MIT license). No external CDN — embed SVG paths directly for reproducibility.

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
- [ ] Growth-engine framing matches the client's GTM motion (Phase 0.2) — NO "lead generation" / "inbound funnel" / "shotgun" language for an account-based (ABM) client

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
8. **Match the growth framing to the GTM motion**: For account-based (ABM) clients — AEC, government, professional services, niche B2B — never use "lead generation", "fill your funnel", or "shotgun" language. Frame AI as account intelligence + RFP automation + targeted per-account outreach *under* their existing named-account strategy. See Phase 0.2.

---

## Related Skills

- **technijian-report** — For IT/security/QBR reports (not biz-dev strategy docs)
- **technijian-diagram** — For additional editorial SVG diagrams beyond the 3 standard ones
- **technijian-roi** — For standalone ROI/business-case models referenced in Section 10
- **technijian-voice** — Audit full draft text before inserting into docx-js
- **technijian-brand** — Master brand reference for any values not covered here
