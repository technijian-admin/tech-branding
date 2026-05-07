---
name: technijian-case-study
description: Generate brand-compliant Technijian case studies as HTML+PDF (2 fixed-size letter pages) sourced from anonymized tech-leads kb data. Use when creating industry rollups, capability stories, or representative-work narratives. Enforces the "no real client names" rule and the source-data discipline documented in vault memory.
---

# Technijian Case Study Generator

## When to use this skill

Use this skill — NOT `technijian-proposal` — when:
- Building industry-rollup case studies (e.g., "Lease abstraction at scale for commercial real-estate operators")
- Creating capability flagship stories (Chat.AI, AI Lead Gen, Avatar Video Pipeline, etc.)
- Producing representative-work examples for brochures (anonymized)
- Documenting outcome-driven narratives where the format is fixed (challenge → solution → results → quote → CTA)

The proposal skill is for forward-looking sales documents; this skill is for backward-looking proof.

## Source of truth

All Technijian case-study source data lives **outside this repo** at:

```
C:/VSCode/tech-leads/tech-leads/tracking/kb/
```

Three layers (per `reference_tech_leads_case_studies.md`):

1. **`kb/case-studies/`** — 142 proposal-driven + 59 ticket-driven industry rollups; `_index.md` is the catalog
2. **`kb/case-studies/_capabilities/`** — 7 flagship stories (Chat.AI, AI Lead Gen, AI Agents, AI Avatar Video, n8n, PPT Pipeline, Team Allocation)
3. **`kb/clients/`** — 67 client-specific profiles with 5-year proposal history + 12-month ticket activity (richest data layer)

**Rule:** read source first; never invent numbers, dates, hours, or technologies. If a number isn't in source, omit it.

## Anonymization (MANDATORY)

Per `feedback_no_client_names.md` — Technijian has no completed client projects to use as named case studies for the AI services launch. **Strip all client identifiers.**

| Replace | With |
|---|---|
| "Yerbo Group", "Housing for Health OC", "Ortho Xpress", "ORX", "CalOptima" | Industry-generic descriptor: "a 50-property commercial portfolio operator", "a county public-health partner agency", "a mid-size ITAR precision shop" |
| "the practice-DC-01", "the firm-DC-04", "the property management company-FS01" | "the client's domain controller", "the client's file server" |
| "Anderson Real Estate", "Aventine", "Brandywine", "Mason West", "Talsco", "CHL", "Canusa Hershman" | Generic industry profile (these are prospects in the cover-letter pipeline, not clients) |

**Safe to KEEP** (technology identifiers, not client identifiers):
- Vendor names: GoDaddy, Microsoft, Google, Tyler EnerGov, ATTOM, CrowdStrike, Cisco, Veeam, etc.
- Generic server hostnames: DC03, DC04, FS01, HV01, OPSPRB, VBR, VONE
- Technology categories: Azure AD Connect, Windows 11, Sophos XGS, Datto Continuity, etc.

**Always anonymize** even when generic-seeming: partner-agency names ("CalOptima" → "county public-health partner agency").

## Folder structure

```
Case Studies/
├── [Industry]/
│   ├── [Service Theme] Case Study.pdf            ← FINAL OUTPUT
│   └── assets/
│       ├── [Service Theme] Case Study.html       ← HTML source (2 pages)
│       ├── generate_pdf.py                       ← Playwright renderer
│       ├── _verify-pg1.png _verify-pg2.png       ← QA screenshots
│       └── source-notes.md                       ← Which kb files it pulls from
```

Existing industries in `Case Studies/`: AI Development, Construction, Cross-Industry, Financial Services, Healthcare, Hospitality, Manufacturing, Non-Profit, Real Estate, Small Business.

## 2-page HTML structure

Each case study is exactly two fixed 8.5×11in pages.

### Page 1 — Setup

```
┌─────────────────────────────────────────┐
│  HERO (~140px, dark)                    │  Industry label (teal) + Title (white) + 1-line subtitle
├─────────────────────────────────────────┤
│  Tricolor accent rule (3px)              │
├──────────────┬──────────────────────────┤
│  CONTEXT     │  KEY METRICS             │  Left: industry/scale/services 3-line block
│  panel (light)│  3-card row (off-white)  │  Right: 3 number cards
├──────────────┴──────────────────────────┤
│  THE CHALLENGE (white)                   │  H2 + 2-3 short paras + 3 bullet pain-points
├─────────────────────────────────────────┤
│  THE APPROACH (off-white)                │  H2 + 4 numbered steps with icons
└─────────────────────────────────────────┘
```

### Page 2 — Outcome

```
┌─────────────────────────────────────────┐
│  THE RESULTS (white)                    │  H2 + 4-stat callout row (large numbers, brand colors)
├─────────────────────────────────────────┤
│  WHAT THIS MEANS (off-white)            │  Plain-English interpretation, 2-3 paras
├─────────────────────────────────────────┤
│  PULL QUOTE (light grey bg)              │  Large italic quote; attribution generic ("Operations Director, mid-size manufacturer")
├─────────────────────────────────────────┤
│  WHO THIS APPLIES TO (white)             │  Bullet list of profiles where this approach fits
├─────────────────────────────────────────┤
│  CTA BAR (Core Blue)                     │  "Talk to us about [theme]" + 949.379.8500 + technijian.com
├─────────────────────────────────────────┤
│  FOOTER (near-black)                     │  Address, page number
└─────────────────────────────────────────┘
```

## Content rules

1. **Lead with the challenge, not Technijian.** First paragraph names the industry pain point.
2. **Specific numbers, not vague claims.** "44 hours of senior engineer time saved per month" beats "significant time savings."
3. **Attribute scope, not identity.** "A 50-property commercial real-estate operator" not "[Client Name]".
4. **Show the math.** Where a number matters (hours saved, dollars avoided), show the inputs in a small footer note.
5. **Quote attribution is role+scale, not name.** "Operations Director, 200-employee precision manufacturer."
6. **Cite the source layer.** Internal `source-notes.md` records which `kb/` files were pulled (for future regeneration).
7. **No future-tense ROI promises.** Case studies report outcomes; promises go in proposals.

## Brand spec (same as datasheet/brochure)

```css
--blue: #006DB6;        --orange: #F67D4B;       --teal: #1EAAC8;
--chartreuse: #CBDB2D;  --dark: #1A1A2E;         --grey: #59595B;
--off-white: #F8F9FA;   --light-grey: #E9ECEF;
font-display: 'Plus Jakarta Sans';
font-body:    'DM Sans';
```

Page setup: `width: 8.5in; height: 11in; overflow: hidden; position: relative` per page (per `feedback_page_breaks.md`).

## Verification (mandatory)

Per `feedback_verify_body_clipping.md`, check `body.scrollHeight - body.clientHeight <= 2px` per page. The full-page screenshot must be exactly 2112px tall (2 letter pages).

```python
clips = page.evaluate("""
    () => Array.from(document.querySelectorAll('.page')).map((pg, i) => {
        const b = pg.querySelector('.body');
        return { page: i+1, overflow: b ? b.scrollHeight - b.clientHeight : 0 };
    })
""")
assert all(c['overflow'] <= 2 for c in clips), "Body content clipped"
```

## Workflow

```
1. Read C:/VSCode/tech-leads/tech-leads/tracking/kb/case-studies/_index.md to pick a theme
2. Read the source files (proposal + ticket rollup + per-client profile if richer)
3. Anonymize aggressively (see table above)
4. Draft the 2-page HTML
5. Render PDF via Playwright
6. Take per-page screenshots; visually verify
7. Run technijian-design-review on the output
8. Save source-notes.md for future regeneration
```

## Related skills

- **technijian-brand** — colors/typography
- **technijian-proposal** — forward-looking sales docs (this is the backward-looking complement)
- **technijian-voice** — voice/tone gates over the prose
- **technijian-design-review** — verification gate
