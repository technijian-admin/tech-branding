# Technijian Brand Skills for Claude Code

These skills enable Technijian team members to generate brand-compliant materials directly from Claude Code. Each skill encodes the Technijian Brand Guide 2026 rules so that outputs automatically follow correct colors, typography, voice, and layout.

All skills read from a single source of truth: [`assets/brand-tokens.json`](../assets/brand-tokens.json) (DTCG-format design tokens). When you change a brand value there, every skill picks it up automatically.

## Available Skills (23 total)

### Foundation (1)

| Skill | What It Does |
|---|---|
| `technijian-brand` | Master brand reference — colors, typography, voice, UI specs, two-office data |

### Business development (1)

| Skill                          | What It Generates                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `technijian-biz-dev-blueprint` | DOCX+PDF AI growth blueprint — personas, competitors, capability proof, ROI model, roadmap |

### Document generation (10)

| Skill | What It Generates |
|---|---|
| `technijian-proposal` | DOCX proposals, sales one-pagers (forward-looking) |
| `technijian-case-study` | HTML+PDF case studies (backward-looking, anonymized from tech-leads kb) |
| `technijian-presentation` | PowerPoint slide decks with branded layouts |
| `technijian-brochure` | Multi-page (6–8) brochure PDFs via HTML+Playwright |
| `technijian-datasheet` | Single-page datasheet PDFs via HTML+Playwright |
| `technijian-report` | DOCX QBRs, IT assessments, security audits, compliance reports |
| `technijian-qbr` | Data-driven Quarterly Business Reviews (PPTX deck + DOCX appendix) |
| `technijian-letterhead` | Formal letters on USA HQ or India Delivery Center letterhead (DOCX + HTML/PDF) |
| `technijian-legal` | MSAs, SOWs, NDAs, SLAs, AUPs |
| `technijian-rfp` | 6-stage RFP-response pipeline with compliance matrix |

### Marketing & content (5)

| Skill | What It Generates |
|---|---|
| `technijian-email` | HTML email campaigns, newsletters, signatures |
| `technijian-social` | Social graphics (SVG/HTML) + captions |
| `technijian-blog` | Blog posts dual-optimized for Google + AI citations |
| `technijian-video-script` | HeyGen avatar / talking-head / screen-record scripts |
| `technijian-pricing` | Pricing schedules — quotes, RFP exhibits, MSA Schedule A, MRR rollups |

### Visual generation (2)

| Skill | What It Generates |
|---|---|
| `technijian-diagram` | Editorial SVG diagrams (14 types — flow, RACI, sequence, etc.) |
| `technijian-infographic` | Single-image visual stories (8 templates — stat constellation, iceberg, comparison, etc.) |

### QA gates (2)

| Skill | What It Does |
|---|---|
| `technijian-voice` | Audits any draft text for banned words, voice violations, weak CTAs, AI slop |
| `technijian-design-review` | Audits any rendered artifact for body clipping, page breaks, logo correctness, brand compliance — runs `technijian-voice` as part of S4 |

### Business intelligence (1)

| Skill | What It Generates |
|---|---|
| `technijian-roi` | Defensible ROI/business-case models (downtime, breach, AI productivity, cloud migration, MSP-vs-internal) |

## How the skills compose

```
discovery → technijian-roi  ──┐
                              ├──→ technijian-proposal ──→ technijian-design-review → ship
technijian-case-study ────────┤                          ↑
                              │                          │
brand-tokens.json ──→ all skills ──→ technijian-voice ───┘
                              │
sales win → technijian-letterhead (welcome letter)
         → technijian-qbr (recurring)
         → technijian-blog / video-script / social (thought-leadership amplification)
```

## Two-office discipline

Technijian operates from two entities:

| Office | Address | Use for |
|---|---|---|
| **USA Headquarters** | 18 Technology Dr., Ste 141, Irvine, CA 92618, USA | All US-client correspondence, marketing, MSAs/SOWs |
| **India Delivery Center** | Plot No. 07, 1st Floor, Panchkula IT Park, Panchkula, Haryana 134109, India | India-entity invoicing, vendor coordination, GSTIN-bearing documents |

The `technijian-letterhead` skill produces both variants. Other skills default to USA but can be switched via `office: india` parameter where applicable.

## Installation

### Option 1: Project-level (recommended)

Skills in this repo's `skills/` folder are auto-discovered when you launch Claude Code from this repo. No installation needed.

### Option 2: Install globally

```bash
# Windows
Copy-Item -Recurse skills\technijian-* "$env:USERPROFILE\.claude\skills\"

# macOS / Linux
cp -r skills/technijian-* ~/.claude/skills/
```

### Option 3: Marketplace (planned)

When marketplace publication is ready, all Technijian skills will be installable via:

```
/plugin install technijian-brand-skills
```

## Usage Examples

**AI Growth Blueprint (new client):**
> "Build a biz-dev blueprint for Pacific Structural Engineers — Newport Beach seismic/structural firm, ~40 staff, primarily public agency clients. No source doc; research from their website."

**AI Growth Blueprint (from existing analysis):**
> "Build a biz-dev blueprint for Meridian Environmental. Source deck is at Clients/Meridian/meridian-market-analysis.docx. Competitors: SWCA, ICF, Stantec, ESA, Ascent."

**Letterhead (US):**
> "Draft a welcome letter for John Smith, CTO of Anderson Real Estate, on USA letterhead."

**Letterhead (India):**
> "Generate a vendor coordination letter from Shelja Mehta on India letterhead for the Panchkula polo-shirt vendor."

**Case study:**
> "Build an anonymized financial-services case study about Azure AD Connect migration; pull from tech-leads kb/clients/19-b2-insurance."

**ROI:**
> "Build an ROI model for a 50-user manufacturer considering My AI for lease abstraction. Show 3-year payback at 25%, 50%, 75% adoption."

**RFP:**
> "Start the RFP response pipeline for City of Anaheim RFP-2026-IT-007. The PDF is at /downloads/anaheim-rfp.pdf."

**QBR:**
> "Generate Q2 2026 QBR for Aventine Apartments — pull tickets from Autotask, uptime from PRTG, security from Sophos."

**Voice audit:**
> "Run technijian-voice over the My AI brochure draft I just edited."

**Design review:**
> "Run technijian-design-review on Services/Chat.AI-pre-release/Chat.AI Brochure.pdf."

## Brand asset paths (the most-used)

```
assets/brand-tokens.json                                              ← single source of truth
assets/logos/png/technijian-logo-full-color-1200x251.png              ← light backgrounds
assets/logos/png/technijian-logo-dark-bg-transparent.png              ← dark backgrounds (use this!)
assets/icons/service-pillars/                                         ← 6 pillar icons + variants
assets/print/templates/technijian-letterhead-{usa,india}.{docx,pdf,html}
```

## Prerequisites

| Skill | Package | Install |
|---|---|---|
| brochure / datasheet / case-study / letterhead-html | Playwright (Python 3.12) | `py -3.12 -m pip install playwright; py -3.12 -m playwright install chromium` |
| presentation | pptxgenjs | `npm install pptxgenjs` |
| proposal / report / letterhead / legal / qbr / pricing | docx | `npm install docx` |
| pricing (XLSX) / qbr (XLSX) / roi (XLSX) | openpyxl or exceljs | `pip install openpyxl` or `npm install exceljs` |

## Vault memory (project knowledge)

These skills encode learnings captured in `C:\Users\rjain\.claude\projects\c--VSCode-tech-branding\memory\`:
- `feedback_verify_body_clipping.md` → enforced by `technijian-design-review` H1
- `feedback_verify_onepagers.md` → enforced by H2
- `feedback_page_breaks.md` → enforced by H3+H4
- `feedback_logo_usage.md` → enforced by H5
- `reference_technijian_phone_lines.md` → enforced by H6
- `feedback_no_client_names.md` → enforced by H7 + `technijian-voice` V4
- `reference_tech_leads_case_studies.md` → consumed by `technijian-case-study`
- `reference_python_312_playwright.md` → tools used in renderers
