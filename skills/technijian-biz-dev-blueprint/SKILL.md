---
name: technijian-biz-dev-blueprint
description: Generate an AI-Driven Digital Business Development Blueprint for a Technijian prospect or client. A research-driven, client-specific branded DOCX + PDF report that shows exactly how AI transforms their business development function — with Technijian products named and priced as the implementation partner. Section count, persona count, and diagrams are determined by research, not fixed in advance.
---

# Technijian AI Growth & Integration Strategy (AI-Driven Business Development Blueprint)

## Overview

Generates a premium branded consulting deliverable (typically 20–70 pages depending on client complexity) that shows a prospect or client *exactly* how Technijian helps them on two fronts at once — with Technijian products named and priced as the implementation partner:

- **Growth** — get found, capture demand, and win more deals (AEO/SEO, account intelligence, RFP automation, reputation, the right outbound motion for their GTM).
- **Integration & efficiency** — weave AI into how the business actually runs (knowledge retention, document/RFP automation, booking/scheduling, quality control, audit-evidence) so the team does more with less and revenue-per-head climbs.

This works for **any company in any industry** — engineering firms, DME suppliers, fuel distributors, smart-card manufacturers, professional services, local consumer businesses. The research drives which growth and which integration plays matter for *this* client; never copy another client's mix.

**Keywords**: AI growth strategy, AI growth and integration study, business development, AI blueprint, growth roadmap, AI efficiency, personas, competitive landscape, ROI, roadmap, DOCX, biz dev, digital transformation

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

> **⚠️ DIGITAL AUDIT DATA — NEVER TRUST COLD WEB SCRAPES FOR THESE METRICS (AXRT lesson, 2026-06-09):**
> Jill Goodwin (CEO, Axis Research & Technologies) responded to the blueprint identifying three wrong data points in Section 08 (Brand & Digital Presence Audit):
> - LinkedIn followers: report said **43** → actual **2,027**
> - Google Business Profile: report said "Not found for any location" → they had **GBP for all 4 locations**, 57 five-star reviews in Irvine alone
> - Blog/SEO: report said "no blog, no content strategy" → active blog + 10-year marketing partner managing SEO
>
> **Root cause:** LinkedIn follower counts, Google review counts, and GBP presence are routinely stale or wrong in cold web research (cached data, wrong entity matching, third-party aggregator lag). These are also the numbers a client WILL check and WILL call out.
>
> **Mandatory discipline for the Brand & Digital Presence Audit section:**
> 1. **Never assert a follower count or review count as fact** in the published report without cross-referencing at least two independent sources (e.g., direct LinkedIn page visit + SimilarWeb/Apollo). If you cannot verify, write "approximately X" or "reported at X" with the caveat noted.
> 2. **Do NOT say "Google Business Profile not found"** unless you have personally searched `site:google.com/maps "[company name]"` AND tried the business name + city in Google Maps. GBP is frequently mis-indexed by third-party tools.
> 3. **Do NOT say "no blog / no content strategy"** unless you have scrolled the actual website blog/news section and found it empty. Many sites have blog content not indexed by standard research tools.
> 4. **Frame the audit as an enhancement opportunity, not a failure audit.** When a client has an existing marketing partner, the pitch is NOT "you have no digital presence" but "your traditional SEO is not translating into AI search (GEO/AEO) — that is the new frontier your current partner hasn't built capability in yet." This keeps the conversation collaborative rather than antagonistic.

### Gate 0: Live Digital-Presence Verification (run BEFORE writing Section 08 — MANDATORY)

Use the Playwright MCP browser (or WebFetch where the page is static) to capture evidence for every claim that will appear in the digital audit table. No claim enters the table without a verification row below.

| Claim to verify | Method | Evidence required |
|---|---|---|
| LinkedIn follower count | `browser_navigate` → `linkedin.com/company/<slug>` → screenshot. If login-walled, try Google cache / Bing preview; if still blocked, label the number "approximate, unverified" in the report | Screenshot or "UNVERIFIED" label |
| Google Business Profile + review counts | `browser_navigate` → `google.com/maps/search/<company>+<city>` for EVERY location | Screenshot per location showing listing + star count, or two failed direct searches before claiming absence |
| Blog / content activity | `browser_navigate` → site `/blog`, `/news`, `/resources`, `/insights` paths + check sitemap.xml for post URLs with dates | List of ≥3 recent post titles+dates, or confirmation all paths 404/empty |
| Online booking | Click the site's actual CTA buttons — follow "Schedule"/"Book" links to see if a real scheduling tool loads | Note the tool (Calendly/custom/none) |
| Product pages | Navigate to the product name directly + site search | URL or confirmed absence |
| Careers/jobs (workflow intel) | Site careers page + `linkedin.com/company/<slug>/jobs` + Indeed search | Job titles list — reveals internal workflows and team structure |

Record results in `_research.md` under a `## Verified Digital Presence (date)` heading with the capture date. Numbers go stale — re-verify if more than ~2 weeks pass between research and send.

**Quick verification snippet (Playwright MCP not available → use Python):**
```python
# py -3.12 verify_digital.py — screenshots LinkedIn, Maps, blog for the research file
from playwright.sync_api import sync_playwright
TARGETS = {
    "linkedin":  "https://www.linkedin.com/company/<slug>/",
    "maps_loc1": "https://www.google.com/maps/search/<company>+<city1>",
    "blog":      "https://<domain>/blog",
}
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(device_scale_factor=2).new_page()
    for name, url in TARGETS.items():
        try:
            pg.goto(url, timeout=20000, wait_until="domcontentloaded")
            pg.wait_for_timeout(2500)
            pg.screenshot(path=f"verify_{name}.png", full_page=False)
            print(name, "->", pg.title())
        except Exception as e:
            print(name, "FAILED", e)
    b.close()
# Then OPEN each verify_*.png with the Read tool and read the actual numbers off the image.
```

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
| Understanding AI — Field Guide for [Client] Leadership | The education layer: what AI is, where the client sits on the maturity ladder, the 3 risks to manage, what peers do, why a partner. See Phase 5c. |
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

> **NO FIXED COUNTS — derive every count from deep research on THIS company. (Ravi, 2026-06-02.)** The number of personas — and of sections, diagrams, and capability proofs — is determined by what deep research reveals about *this specific company's* actual buyers, **never copied from RKE, ACU, or any prior report.** RKE having 7 personas does NOT mean the next client gets 7. Do the research first — who does this company actually sell to? — then build exactly that many personas, whether that is 3, 4, 5, 6, or 8, each backed by real evidence. Forcing a count to match a previous client (e.g. "RKE-caliber = 7 personas") is the exact error this rule exists to prevent. "RKE caliber" means DEPTH and the right SECTION MENU for this client, **not** a persona/section/diagram quota.

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

### Diagram build discipline (PNG → docx) — prevents stranded / distorted figures

- **Auto-crop every rendered PNG** to its content plus a small uniform margin before embedding. Uncropped screenshots carry stray whitespace that strands the figure or shrinks the live content; crop kills it.
- **DERIVE each figure's aspect ratio from the REAL PNG pixel dimensions** (read width/height off the cropped file), then size the docx image to that AR. Never hardcode an aspect ratio — a hardcoded AR drifts as content changes and distorts the figure or leaves a gap.
- **Long y-axis labels:** render the label inside a fixed-width bar rotated about its own center, so a long label can never overflow the plot area or collide with the bars.

**Implementation: `pngDims()` + `diagramImage()` pattern (mandatory)**

Read actual PNG dimensions from the IHDR header (bytes 16–23), then compute the embedded height from the real ratio. Never pass a hardcoded `aspectRatio`:

```javascript
// Read PNG IHDR dimensions — offsets 16=width, 20=height
function pngDims(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

// Embed diagram at correct aspect ratio derived from real file dimensions
function diagramImage(buf, altTitle, widthPx = 600) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const { w, h } = pngDims(buf);
  const imgW = widthPx;
  const imgH = Math.round(widthPx * h / w);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [new ImageRun({
      type: 'png', data: buf,
      transformation: { width: imgW, height: imgH },
      altText: { title: altTitle, description: altTitle, name: altTitle }
    })]
  });
}
```

If a tall diagram causes its last bullet/caption to orphan onto the next page, reduce the `widthPx` argument (e.g., from 620 to 520) rather than cutting content — the diagram gets shorter and the text fits.

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

### Phase 5b: The multi-model cost discipline — answer "won't AI cost a fortune?" (always address; Ravi, 2026-06-10)

A real, recurring buyer concern: *"if you run AI on everything — content, lead gen, credit, RFPs — won't the token bill be enormous?"* The honest, differentiating answer is that **Technijian does not wire every task to one expensive model. It runs a routed, multi-model platform — roughly seven models across three vendors and three capability tiers — and sends each sub-task to the cheapest model that can do it well.** This is the single biggest reason a partner who has *built* the routing beats a client (or a one-model agency) wiring everything to a single premium model. Put a version of this in the report — in the Capability Proof, the Investment section, or the FAQ's "what does it cost" answer.

**The seven-model spread (frame as tiers, not exact versions — versions go stale):**

| Tier | Representative models | Used for |
|---|---|---|
| **Frontier (most capable, most expensive)** | Claude Opus · GPT-5-class · Gemini Ultra/Pro | The ~5–10% of work that needs deep judgment: final brand-voice pass, compliance-critical answers, the hardest reasoning |
| **Workhorse (balanced)** | Claude Sonnet · Gemini Flash/Pro | The bulk of reasoning and drafting: blog drafts, outreach personalization, summarization, scoring borderline cases |
| **Lightweight (fast, cheapest)** | Claude Haiku · GPT-4o-mini | High-volume mechanical work: classification, extraction, enrichment, tagging thousands of records |

**The routing logic — say it plainly:** every job is decomposed; cheap models do the volume, mid models do the reasoning, and the frontier model is reserved for the small slice that genuinely needs it. Where quality is non-negotiable, an **LLM-council pattern** (3 models peer-review the same output, ScamShield-style) catches what any single model would miss. Result: clients pay frontier-model prices only for the fraction of work that warrants them — typically a **~60–80% lower run cost than routing everything to one premium model**, with no quality loss on the work that matters.

**Give 2–3 concrete examples (adapt to the client's actual workflows):**
- *Content factory:* a lightweight model drafts from the brief, a workhorse fact-checks and tightens, a frontier model does the final brand-voice and accuracy pass — instead of one premium model doing all three at ~3× the cost (this is the "~70% less content-production time/cost" claim on the SEO platform).
- *Lead gen:* thousands of prospects are enriched and ICP-scored on the cheapest model; only the borderline hot/warm calls escalate to a reasoning model; outreach drafts come from a workhorse. You pay pennies on the volume and dollars only on the judgment.
- *Document intelligence (RFPs / credit packets):* extraction runs on a lightweight model, the actual answer drafting on a workhorse, and a frontier model + council review on the compliance-critical sections — the same engine behind "RFPs: days → minutes, 60–80% less manual review."

**Why it converts:** it defuses the cost objection, demonstrates real AI-engineering depth (not just "we use ChatGPT"), and reinforces the "use the simplest tool that works" principle from the education layer (Phase 5c). It also pairs with the responsible-AI story — private, governed deployments — so cheap models never see sensitive data they shouldn't. Keep numbers as ranges ("~60–80% lower run cost," "typically") and label them as engineering norms, not a client-specific guarantee.

---

## Phase 5c: Client AI Education Layer — "Understanding AI" section (always include)

**Encoded after AXRT + SC Fuels, 2026-06-10.** Ravi's direction: the reports were strong on the *sell* but light on the *educate*. For the buyers these blueprints target — an ops-minded CEO at a bioskills lab, a sales director at a 95-year-old fuel distributor — the reflex is *"is this real or is this hype?"* A vendor-neutral education section converts that skepticism into trust, and **almost no competitor does it.** Every element below is anchored to a **citable, third-party framework** (NIST, Gartner, MIT, Anthropic, McKinsey) — that is what makes it educational rather than another pitch. Place this section AFTER Capability Proof and BEFORE the AI Growth Engine: prove you can build it, teach them how to think about it, then show the engine.

Build it as one cohesive section, **"Understanding AI — A Field Guide for [Client] Leadership"**, with these sub-parts. Keep it plain-English and short — this educates a non-technical executive, so no jargon without a one-line definition.

**1. What AI actually is (and isn't).** Open with the MIT Sloan framing — *you need to know what AI can and can't do, not how to build it* — to disarm a non-technical owner. Then the single most useful distinction, from Anthropic's "Building Effective Agents": **automation/workflows** (AI follows a predefined path — predictable, low-risk; e.g. "draft this from these inputs") vs **agents** (AI decides the steps itself — flexible, needs oversight; e.g. "monitor the pipeline and act"). State the operating principle: *use the simplest thing that works* — we start the client with simple automations that pay off fast and add agents only where they earn it. This directly justifies the maturity-laddered roadmap.

**2. Where [Client] sits today — the AI maturity ladder.** A small table using a 5-stage model (Gartner-style: **Foundational → Emerging → Operational → Scaled → Transformational**, or the simpler **Assisted → Augmented → Autonomous**), with the client honestly marked at stage 1–2 and the next two rungs named. Reassure: most established firms in their industry sit here; the leaders are one or two rungs up and the gap closes in months, not years. This reframes the engagement as *"move you up two rungs,"* not *"buy a product,"* and creates urgency without insult.

**3. Adopting AI responsibly — the 3 risks every leader must manage.** Anchor to the **NIST AI Risk Management Framework** (its four functions — **Govern, Map, Measure, Manage** — give a CEO a memorable, vendor-neutral mental model). Then the three plain risks every owner must manage, each paired with how Technijian handles it:
   - **Hallucination** (AI can state a confident wrong answer) → human-in-the-loop on anything customer-facing or compliance-bound.
   - **Data leakage** → never put PHI / customer / proprietary data into public AI tools; use private, governed deployments.
   - **Compliance & accountability** → inventory every AI tool (owner, vendor, data source) — straight from the RMF *Govern* function.
   This is a **trust differentiator** and lands hardest for regulated clients (HIPAA / tissue chain-of-custody; LCFS/RIN; financial). Tie to Ravi's CISSP / security-first method.

**4. What peers are already doing.** A short sidebar — 3–4 anonymized industry analogues with real before/after numbers. Source from a credible public use-case library (e.g. the MIT-licensed / CC-BY `ai-use-cases-library`, attribution-safe) and adapt to the client's industry. Creates concreteness and healthy FOMO for buyers who think "nobody in our industry does this." Keep claims sourced — do not invent peer outcomes.

**5. A day in the life — before and after.** One page (or a two-column callout) following ONE real persona from the report (a lab coordinator; a fuel rep) through their day with vs. without AI. Visceral and memorable where tables aren't. Pull the tasks straight from the operational-efficiency section (Phase 6b) so the two reinforce.

**6. Why a partner — vs. hiring or DIY tools.** A short three-way comparison: **DIY tools** (cheap, but you assemble and govern it yourself — and own the 3 risks); **hire** (a capable AI hire is $180K+/yr, scarce, and can't cover strategy + build + security + governance alone); **partner / Technijian** (strategy + build + security + governance at fractional cost, with proven builds and CISSP-led security). This is the "educate on Technijian" beat — it positions the firm without a hard sell.

**7. ROI as a managed investment — fold into the Business Impact section (Phase 7), not here.** Use McKinsey's stage-gate framing: run AI as a managed investment, track **adoption → operational improvement → financial benefit vs total cost of ownership → stop/scale decision**, and state plainly: *"if a pilot doesn't clear its cost at the gate, we stop."* Anchor with the credibility stat (≈88% of companies use AI, only ≈39% see profit impact — the difference is disciplined measurement, not more spend). This de-risks the ask and matches the truthful-pricing / value-at-stake convention.

### Citable sources (use these names; everything else is phrasing-only)

| Element | Citable anchor |
|---|---|
| What AI is / literacy | MIT Sloan ("literacy, not expertise"); WEF AI-literacy pillars |
| Workflow vs agent | Anthropic, "Building Effective Agents" |
| Maturity ladder | Gartner AI Maturity Model (Foundational→Transformational); Google Cloud AI Adoption Framework |
| Responsible AI | NIST AI Risk Management Framework (Govern/Map/Measure/Manage); ISO/IEC 42001 (where it leads at scale) |
| Peer use cases | `ai-use-cases-library` (MIT + CC-BY-4.0, attribution required) — examples only |
| ROI discipline | McKinsey QuantumBlack five-layer AI measurement framework |

**Do NOT cite** vendor blogs (appinventiv, hyscaler, etc.) by name — use them for plain-language phrasing only. Only the institutional/standards sources above go in the report's text or appendix.

### Build notes

- This is client-agnostic content with client-specific examples — write it once, swap the industry analogues, the persona in the day-in-the-life, and the maturity-ladder "you are here" marker.
- Keep it to ~2–3 pages. It is a primer, not a textbook. If it runs long, the day-in-the-life (#5) and peer sidebar (#4) are the first to trim.
- Reuse existing helpers (`calloutBox`/`callout`, `buildTable`/`data_table`, `subHeader`/`h2`). No new diagram required, though a simple maturity-ladder bar is a nice-to-have if page budget allows.

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

### Phase 6b: The Operational-Efficiency Front — always include a dedicated section (AXRT lesson, 2026-06-09)

The two-front thesis (Growth + Integration) is only real if the report *has* an Integration section. A growth-only blueprint reads as "spend money to get more customers" — the efficiency front reads as "save money and de-risk what you already do," which is often the easier yes and lands especially well with an **operations-minded CEO** (Jill Goodwin at AXRT had been COO). Build a standalone section — typically titled *"Inside the [Business] — AI-Powered Operational Efficiency"* — placed right after the AI Growth Engine. Ravi's direction (2026-06-09): *"figure out internal workflows the company might have and using the Technijian case studies explain better how the AI consulting could help reduce costs, improve efficiency."*

**How to discover internal workflows without insider access — reverse-engineer from the public site (this is the durable technique):**

| Source on the client's own site | Workflow it reveals |
|---|---|
| Contact / booking form dropdowns ("I'm interested in… Booking a Lab / Event / Perfusion") | The actual service intake categories and how requests are triaged |
| Multiple phone numbers / per-location contact lines | Whether ops are centralized or siloed per site (a manual-coordination tell) |
| "Our process" / "what we offer" / services pages | The fulfillment steps (staffing, provisioning, catering, AV, storage) |
| Careers / job postings (site + LinkedIn `/jobs` + Indeed) | Team structure and named roles = the humans doing manual work today |
| Reviews (Google/Yelp) naming staff and praising "coordination," "prep," "responsiveness" | Where the labor-intensive excellence lives — and the key-person risk |
| Compliance/credential language (AATB, FDA, HIPAA, chain-of-custody) | Documentation burden that AI can automate into audit-ready records |
| Any proprietary product/platform they mention | Whether they already run *operational* AI (so the gap is *commercial/efficiency* AI, not "they have no AI") |

**Build the section as a 3-column workflow→AI→proof table** — `Client Workflow Today | AI Integration | Proven Technijian Result`. Every row's third column must cite a REAL prior Technijian build with a hard number (see Phase 5 capability inventory + the case-study repos). This is what makes the efficiency claims credible instead of hand-wavy. Common high-value rows for any multi-site, booking-driven, or compliance-heavy business:
- Booking/intake automation → cite the booking-portal build (~60% friction ↓, ~40% capture ↑)
- Document/run-sheet/proposal assembly → cite AI document-intelligence (days → minutes)
- Compliance/chain-of-custody records → cite HIPAA documentation-automation build
- Institutional knowledge / onboarding → cite Weaviate knowledge-graph build
- Cross-location visibility → cite multi-location reporting/dashboard build
- Client rebooking/reactivation → cite AI lead-gen/outreach engine (hard lead count)

**Then quantify in plain numbers** with a second table (Efficiency Lever | Conservative Annual Impact): staff hours recovered, error reduction, faster audit response, utilization lift (note even a 3–5% utilization lift on premium capacity is six figures), knowledge-retention/onboarding speed. Label everything "conservative estimate, confirm at discovery," and add matching **operational discovery questions** to the Questions-to-Calibrate section (how are bookings/logistics coordinated today and how many staff hours; how is compliance documentation handled; how is knowledge transferred to new sites/hires).

**Reflect the two fronts in the Executive Summary** — explicitly say the blueprint works on two fronts (growth + efficiency) and name the section numbers, so an ops-minded reader sees the cost-saving half immediately.

---

## Phase 7: Business Impact & Service Investment

### Price to win the meeting — land-and-expand (CRITICAL)

**The Year-1 total must not price Technijian out of the first meeting. Lead with a small, low-commitment ENTRY program, and show the full program + custom build as a clearly-labeled later EXPANSION (the upsell).** Ravi's standing direction (2026-05-27, on the AAVA/Aventine blueprint): *"you might be pricing us out from getting a meeting; be more conservative with our prices and then we can upsell."*

Apply this on every blueprint:

- **Phase 1 — ENTRY ("the land"):** the recurring quick-win services that pay for themselves fast and need **no large up-front build** — typically My SEO (local/reputation/GEO), My AI Lead Gen (capture/nurture, Starter tier), and a low-cost My AI Workshop / Readiness Assessment. Aim for an entry that is an easy "yes" (often **~$30k–$45k Y1** for an SMB/single-site; calibrate up only for a true enterprise). This is the headline number the client sees first.
- **Phase 2 — EXPANSION (the upsell):** the custom My Dev build (assistant / portal / app), Managed App Services, and the Fractional AI Advisor — explicitly framed as *"once the entry proves the lift."* Show the **full-engine** total too, but as the expansion, not the ask.
- **Phase 3 — SCALE:** multi-site / portfolio / additional-location roll-out as further upside (a callout, not a hard ROI table — the one-time build amortizes across sites).
- **Model the headline ROI against the ENTRY price, not the full program.** A small denominator yields a strong, honest ratio (e.g., AAVA entry ≈ $32k → 1.6x/2.6x/3.5x), which makes the entry the easy yes. Note that the expansion unlocks larger gains the entry ratio does not count.
- **Sequence the roadmap entry-first** (Phase 8): quick-win recurring services in the first phase; the custom build in the second phase (after the entry proves out); retention + scale in the third. Keep the implementation timeline diagram consistent with this order.
- Discovery (the Questions section) still calibrates everything; present all numbers as estimated/conservative.

### KPI lift table

Build KPI rows from what THIS client actually cares about. Do not copy the RKE row set. Typical rows for different client types:

- **Service businesses**: new customers/month, review rating, repeat booking rate, response time
- **B2B/professional services**: proposal win rate, time-to-proposal, pipeline value, hours recovered
- **Multi-location**: revenue per location, referral rate, average ticket size

Always use the client's current state as the baseline where known. If unknown, say "estimated current" with the assumption noted.

### Y1 ROI model

Model the headline ratio against the **ENTRY program** (small denominator → strong, honest ratio), and note that the expansion unlocks larger gains the entry ratio does not count.

| Row | Value |
|-----|-------|
| Technijian ENTRY-program investment (Y1) | $X (the conservative "land" — keep this modest) |
| Projected value attributed to the entry program | conservative / target / aggressive |
| Modeled ROI ratio (vs. entry) | Nx / Mx / Px |
| Full-engine investment (entry + expansion) | $Y (shown as the upsell, not the ask) |

**ROI as a range — never lead with a sub-1× optic.** Show three scenarios (very-conservative floor, likely, upside). If the very-conservative floor lands below 1×, do NOT lead the reader with it — relabel that row **"Downside-Protected"** and lead the prose, the callout, and the headline ratio with the *expected (~likely)* case. A floor that reads as "you lose money" tanks the easy-yes even when the likely case is strong.

**Do not expose the offshore/India cost basis on a client-facing page.** Present a single blended **US-led** rate. The India rate card (and any per-component cost stack) is internal margin math — citing it client-side invites rate-shopping and erodes the price. Bundled price + a transparent *US* labor-rate table is the professional norm.

Use real pricing from:
- `services/My SEO/assets/my-seo-content.txt`
- `services/My AI/assets/my-ai-content.txt`
- Any service investment data from client discovery

### Service Investment Map

Table: Technijian Service | Tier / Description | Monthly Investment | Y1 Total

**Structure it land-and-expand** (see the CRITICAL note above): list the Phase-1 ENTRY services first with a bold **ENTRY PROGRAM** subtotal row, then the Phase-2 EXPANSION services with a bold **FULL ENGINE (entry + expansion)** total row. Label expansion line items "(Phase 2)" so it is unmistakable the build is the upsell, not the ask.

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

## Phase 9b: Conversion Layer — turn the report into a "yes" (always include)

**Encoded after AXRT + SC Fuels, 2026-06-10.** Ravi's question: *"is there anything to make this report more of a conversion for a client to work with Technijian?"* The honest answer was that the reports were ~80% inform / 20% convert. A blueprint that educates beautifully still doesn't *close* — closing needs specific conversion mechanics that are easy to leave out. Build ALL of these into every blueprint:

**1. Productized, risk-reversed entry offer (the single most important conversion fix).** "Scoped at discovery" is friction — it makes the buyer wait and think. Replace it with a **named, fixed-scope, fixed-price, fixed-timeline starter** with ONE headline success metric:
- Give the entry a product name ("The 90-Day AI Visibility Pilot," "The AI Lead-Gen Pilot Sprint").
- State exactly what's included, the price (use published rates), the duration, and the single metric you'll be judged on.
- **Add an explicit risk-reversal** — turn the McKinsey stage-gate philosophy into an actual offer: *"If the pilot doesn't hit [metric] by day 90, you're under no obligation to continue — and we'll tell you honestly whether to."* (Calibrate the strength of the guarantee with Ravi; even a soft "no lock-in, cancel anytime, we stop if it's not working" beats silence.) Risk reversal is frequently the literal thing that tips the yes.

**2. Cost of inaction / urgency.** The report shows upside; add the quantified downside of waiting — loss aversion outpulls gain. A short callout: *"every quarter without [GEO / the pilot], you cede [AI-search citations / warm pipeline] to competitors optimizing right now; here is the leaking demand."* Tie it to a real, dated window where one exists (first-mover, a regulation, a budget cycle).

**3. "AI Search Reality Check" — show, don't tell.** A visceral, **clearly-labeled-illustrative** box that simulates what an AI assistant returns today for a high-intent query in their space, showing the client is NOT cited (or competitors are). Format as a mock prompt→answer in a bordered callout. **Truthfulness rule:** label it "illustrative of how AI search resolves this query" — do NOT present a fabricated box as a real screenshot. (If you want real proof, actually run the query on Perplexity/ChatGPT and screenshot it — but never fake a screenshot.) This makes the GEO gap real in a way a table never does.

**4. Objection-handling FAQ.** Name and defuse the silent no's in a 5–6 Q&A section near the CTA. The real objections are always some of: *"we already pay an agency," "isn't AI just hype," "is our data safe," "we don't have bandwidth for another vendor," "what if our team won't adopt it," "what does this really cost."* Answer each in 2–3 honest sentences. Unaddressed objections are where deals silently die.

**5. The forwardable 1-page executive brief (see Phase 10).** The champion (the person you met) is rarely the sole economic buyer; a CFO or parent-company exec may never open a 30–45-page PDF. A single-page brief the champion can forward — gap → engine → entry price → ROI → one CTA — is often what actually closes. Build it for every engagement (Phase 10 covers the artifact mechanics).

**Placement:** entry offer + risk reversal go in the Business-Impact/Investment section; cost-of-inaction near the opportunity framing or right before the CTA; AI-search reality check in the digital-audit or growth-engine section; the FAQ as its own short section just before "What Happens Next." Keep the voice honest and specific — conversion copy that overclaims reads as a pitch and backfires with a sophisticated buyer.

---

## Phase 10: Executive Summary Hook Artifact (CRITICAL — always build this)

**Encoded after ALG / Algro International, 2026-05-28.** Ravi's instinct: *"why don't you attach the plan? should we give like an executive summary of what the plan is hoping to do? and attach that?"*

**Never attach the full 30–40-page plan to the first-touch outreach email.** It overwhelms; recipients open it once, see "PDF, 38 pages," and put it aside. Instead, build a SECOND, shorter artifact — the **Executive Summary** — and attach that. Hold the full plan in reserve for the meeting itself, or send on explicit request.

### What the Executive Summary contains (typically 4–7 pages)

A distilled, branded PDF that mirrors the full plan's narrative arc but at one-tenth the length. Same brand tokens, same helpers, same diagrams — just fewer sections and tighter copy. Pull from the full plan, don't rewrite from scratch.

| Page | Section | Source from full plan |
|---|---|---|
| 1 | Cover band + logo + title + KPI cards (the 4 headline numbers) + opening framing | Section 01 distilled |
| 2 | The Opportunity — the 3 forces / market reality, plus the compliance-boundary callout | Sections 01 + 03 distilled |
| 3 | How AI Transforms [Client]'s Growth Engine — architecture diagram + 1-paragraph intro | Section 10 with architecture diagram |
| 4 | The three motions — one callout per motion (Get Cited / Win Doc Race / Hold & Expand for ABM; Get Found / Lease Faster / Keep & Grow for demand-gen) | Section 10 distilled |
| 5 | The Program — entry investment table (Phase 1 only, NOT the full engine) + ROI table modeled vs the entry | Section 11 distilled |
| 6 | Roadmap diagram + Next Step CTA card | Section 12 timeline diagram + CTA |

Reuse the already-rendered `architecture.png` and `timeline.png` from the full plan. No new diagrams.

**Even lighter option — a 1-page Concept Brief.** When the recipient is a busy executive who won't open a 4–7-page summary either, build a single self-contained Letter page (HTML → Playwright → one PNG/PDF) that a champion can forward as-is: the gap, the engine in one diagram, the entry program + ROI-vs-entry, and the dated CTA. Same brand tokens. This is the most forwardable artifact in the set — use it as the attachment when even the Executive Summary is too long.

### File structure

```
Clients/[ClientCode]/
  build-[clientcode]-summary.js          ← shorter docx-js builder (4–7 pages)
  docx-to-pdf-summary.py                 ← Word COM PDF converter for the summary
  [ClientCode]-AI-Growth-Summary.docx
  [ClientCode]-AI-Growth-Summary.pdf     ← THIS is what the first-touch email attaches
```

### Build pattern

Reuse the SAME helper functions (`sectionHeader`, `calloutBox`, `kpiRow`, `buildTable`, `diagramImage`, `colorBanner`, etc.) from the full-plan builder. Reuse the SAME brand tokens. Reuse the SAME diagram PNGs. Only the `docChildren` content array shortens. The summary should feel like the same document — same fonts, same color, same header/footer — just abridged.

**Pricing in the summary:** show ONLY the **ENTRY program** table (the $30–35K easy-yes). Do NOT show the expansion / full-engine pricing — that creates sticker shock at first touch. The summary ends on the entry program + ROI vs entry + CTA card. The expansion is mentioned in passing in body copy ("the bigger build comes later, once the entry proves the lift") but never tabled. Reserve the full Service Investment Map for the discovery call.

### How the outreach email uses it

The first-touch email body **acknowledges the attached Executive Summary** explicitly and offers the full plan on request. Example phrasing (adapt to client):

> *"I've attached a short Executive Summary that walks through the gap, the engine, the [roadmap], and the entry program. The entry is small on purpose, about $XX K for the first year, and it pays for itself on [the two highest-conviction levers] alone, with no large build to begin. The bigger build comes later, once the entry proves the lift. The full XX-page plan is ready if you want to read further before we meet."*

That paragraph does four jobs at once: (a) tells the recipient there's a quick summary they can read in 5 minutes; (b) drops the headline price up front so there's no sticker shock when they open the PDF; (c) frames the expansion as future-tense, not the ask; (d) signals depth (a full plan exists) without forcing it on them.

### CTA closing (Phase 11 encodes the rule)

End the email with the signature-button CTA pattern (see Phase 11). Do NOT ask for a "reply with a date" — route the recipient to the Book-a-Meeting button already in Ravi's HTML signature.

---

## Phase 11: Outreach Email CTA — Use the Signature Button (CRITICAL)

**Encoded after ALG / Algro International, 2026-05-28**, after Ravi edited the draft's closing line before sending.

**My draft closing:** *"I'd love 30 minutes to walk you through it. Reply with a day that works and I'll send a calendar invite."*

**Ravi's sent closing:** *"I'd love 30 minutes to walk you through it. Use book a meeting in my signature line to setup a time to discuss this and all the AI Strategies Technijian is putting into place for itself and its clients."*

Two things are better about Ravi's version:

1. **Route the CTA to the existing Book-a-Meeting button in the signature**, not "reply with a date." The signature already has the button (`https://outlook.office.com/bookwithme/...`). One click books a slot; an email reply with a date requires Ravi to send a calendar invite back. Lower friction beats higher-effort every time.
2. **Broaden the meeting topic beyond the single client.** Adding *"...all the AI Strategies Technijian is putting into place for itself and its clients"* positions Ravi as a cross-client AI strategist with broader thought leadership, not a single-account pitch. It makes the meeting feel more valuable to the recipient.

### The pattern to encode

For any outreach email (cold or warm-expansion) closing a biz-dev blueprint, use this two-sentence structure:

> *"I'd love [N] minutes to walk you through it. Use book a meeting in my signature line to setup a time to discuss this and all the AI Strategies Technijian is putting into place for itself and its clients."*

Variations are fine; the two non-negotiables are:
- The CTA points to the signature's booking button, not an email reply.
- The meeting topic extends beyond the single client to Technijian's broader AI work.

For non-AI topics (cybersecurity, IT, hosting), adapt the second clause to match the topic: *"...all the [cybersecurity / managed IT / hosting] work Technijian is doing for itself and its clients."*

### When NOT to use the signature-button CTA

- Replies to an active thread where a date has already been proposed.
- Recipients who explicitly prefer email scheduling (rare).
- Internal Technijian emails (no booking button needed).
- Hyper-cold first-touch where there's no existing relationship signal at all (here, lead with the booking button only if the email itself has earned the click — make sure the body is strong).

---

## Playwright Render Setup

**MANDATORY: always use `device_scale_factor=3` (or minimum 2) in the browser context.** Default (1×) renders at ~72–113 DPI effective in print — diagrams look pixelated in the PDF. `device_scale_factor=3` yields ~340–410 DPI at content width, which is print-quality. This is the async pattern (sync_playwright works too — use the same `device_scale_factor` arg):

```python
from playwright.async_api import async_playwright
import asyncio

async def render_all_diagrams(diagrams: dict[str, str], out_dir: str):
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        # device_scale_factor=3 renders at 3× physical pixels → ~340-410 DPI at DOCX content width
        context = await browser.new_context(device_scale_factor=3)
        page = await context.new_page()
        for name, html in diagrams.items():
            await page.set_content(html)
            await page.wait_for_timeout(500)
            await page.screenshot(path=f"{out_dir}/{name}.png", full_page=True)
        await browser.close()

asyncio.run(render_all_diagrams(DIAGRAMS, "diagrams/"))
```

Expected output file sizes with `device_scale_factor=3`: ~100–280 KB per diagram PNG (vs ~10–30 KB at 1×). DOCX will grow to ~1 MB — that is correct and expected for print-quality output.

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
  build-[clientcode]-report.js    ← docx-js builder (single file, reads brand-tokens.json — see Brand anchors below)
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

### Every section starts on a new page (Ravi, 2026-06-10 — supersedes the old "no pageBreakBefore" rule)

**Every numbered section must begin on a fresh page. The TOC must never share a page with Section 1.** Use the Word-native page-break-before property on the section heading — NOT standalone `pageBreak()` paragraphs (those create blank pages when content already fills the page; native page-break-before never does).

- **docx.js:** add `pageBreakBefore: true` to the invisible Heading1 paragraph inside `sectionHeader()`, and set its `spacing.before: 0`. Then **remove every standalone `pageBreak()` call that ends a section** and every `{ pageBreakAfter: true }` / embedded `new PageBreak()` you previously used to separate sections — with page-break-before on the next header, those now double up into blank pages. Keep exactly one manual break: cover → TOC (the TOC is generated content, not an H1, so it needs the cover's trailing `pageBreak()`). Section 1's `pageBreakBefore` then separates TOC from Section 1 automatically.
- **python-docx:** set `p.paragraph_format.page_break_before = True` on the heading in `h1()` (and `space_before = Pt(0)`). Then **remove the trailing `doc.add_page_break()` from `toc()`** — the first section's `h1` page-break-before starts that page, so the TOC won't double-break into a blank. Keep `cover()`'s trailing `add_page_break()` (cover → TOC). `secbreak()` becomes a pure no-op.
- **Trade-off, accept it:** forcing a page per section means short sections leave white space at the bottom of their page. That is the intended look — a clean, section-per-page document — and it is what the client asked for. Page count rises ~30–40%; that is fine.
- **ALSO remove any `spacer()` / empty paragraph that sits IMMEDIATELY BEFORE a section header** (not just manual `pageBreak()` calls). This is the subtler blank-page cause (found across 8 reports in the 2026-06-10 mass sweep). Pattern: `docChildren.push(spacer(100)); docChildren.push(...sectionHeader('04'))`. When the *previous* section ends with a page-filling callout/table, that trailing spacer orphans onto its own otherwise-empty page, and the header's `pageBreakBefore` then starts the next page → a fully blank page in between. The section header's own `pageBreakBefore` already provides all the separation needed, so a spacer before it is redundant AND harmful. **Put spacers AFTER the header (between header and its first content), never before it.** AXRT is clean precisely because it spaces *after* the header; the reports that broke spaced *before* it.
- **Verify after build:** render every page; confirm (a) the TOC does not share a page with Section 1, (b) each section header sits at the top of a page, (c) zero fully-blank pages. If a blank appears, the cause is almost always one of: a stray manual `pageBreak()`, OR a `spacer()`/empty paragraph immediately before a section header. Render the blank page AND the page before it — the page-before will end with the content that filled it, and the blank is the orphaned spacer.

### TOC field must be UPDATED-AND-SAVED in the DOCX (2026-06-11 lesson)

docx.js / python-docx write the TOC as a **field with no cached result** — Word computes it only on a field update. The PDF-export pass updates fields for the PDF, but **unless the DOCX itself is SAVED after a field update, anyone opening the .docx in Word sees an empty page where the TOC belongs** (the "blank page / no TOC" complaint; bit SCF Rev2 on 2026-06-11 — its python-docx pipeline never field-saved the DOCX). After every build: open the DOCX via Word COM, run `TablesOfContents.Item(i).Update()` + `Fields.Update()`, **`doc.Save()`**, then export the PDF from that same session. Verify BOTH artifacts: (a) PDF page 2 shows TOC entries and 3 spot-checked page numbers land on the right headings; (b) the saved DOCX has `TablesOfContents.Item(1).Range.Text.Length > 500`. When scanning for TOCs programmatically, do NOT look for a "Table of Contents" heading — these reports don't print one; detect the entry pattern (`^\d{2}  Title .... pageno$`) instead.

**TOC length rule (RKE p4 lesson, 2026-06-11):** use `headingStyleRange: '1-1'` (sections only) on any report long enough that a '1-2' TOC reaches ~2 full pages. A TOC field that exactly fills its pages spills its **trailing paragraph mark** onto the next page, and Section 01's pageBreakBefore then strands that page blank (this was RKE p4 — it resisted spacer/keepNext fixes because the spill is INSIDE the field). ACU hit the same wall at 17 sections and set the '1-1' precedent. **Blank-page scans must strip the running HEADER line too** (recurring-line detection across pages), not just footers — a header-only page reads as ~50 chars of "text" and evades naive thresholds.

### Brand anchors (read from `assets/brand-tokens.json` — single source of truth)

`assets/brand-tokens.json` is the SINGLE SOURCE OF TRUTH for every brand value; read/sync from it and never hardcode. Any hex literals in this skill or in templates are a cached convenience only — if they disagree with brand-tokens.json, brand-tokens.json wins. Non-negotiables for this deliverable:

- **Tagline:** "technology as a solution" (lowercase, no period). The old "Technology Support, Your Way." is RETIRED — never use it.
- **Contact / CTA number:** the main switchboard **949.379.8499** (reaches USA + India). 949.379.8500 is Sales-direct only; 949.379.8501 is Billing-direct only — do not put those on the cover/About/contact table.
- **Logos:** use the REAL logos — full-color on light backgrounds, reverse-white on dark — centered.
- **Two offices:** Irvine HQ (18 Technology Dr Ste 141, Irvine CA 92618) + Panchkula India delivery center.

(Master reference: `technijian-brand`.)

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
- [ ] Cross-references between sections are correct (e.g., "see Section 11.1" actually exists) — **re-check EVERY "Section N" reference after any section insert/renumber; this breaks silently every single time**
- [ ] Persona count is consistent across all sections that mention it
- [ ] Growth-engine framing matches the client's GTM motion (Phase 0.2) — NO "lead generation" / "inbound funnel" / "shotgun" language for an account-based (ABM) client

### Gate 1b: Truthfulness audit (run before every send — AXRT + SC Fuels, 2026-06-10)

A wrong number destroys trust faster than a missing one, and a sophisticated client WILL spot-check. Audit every factual claim and classify it VERIFIED / UNVERIFIED / OVERSTATED before it ships. Hard-won rules:

- **Market-size & CAGR stats are the #1 fabrication risk.** They get pulled from thin air or a hallucinated "market report" and are often wrong by multiples. (AXRT shipped "$26B medical device training market" — the real figure is ~$3.8B, off by ~7×.) **Verify every market number against a real, named analyst source (web search it), or soften to a defensible range** ("several billion dollars, growing ~16% annually"). Never cite a source title you didn't actually read (e.g. "Global X Market Report 2025" with no publisher is a tell).
- **Never attribute specific framework labels to a firm unless they're that firm's actual labels.** The five-stage maturity ladder: Gartner's *real* stages are Awareness → Active → Operational → Systemic → Transformational. Do NOT call a paraphrased ladder "Gartner's." Say "a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks)." The McKinsey "≈88% use AI, ≈39% see EBIT impact" pairing IS real (State of AI 2025) — verified, citable as-is. NIST's four functions (Govern/Map/Measure/Manage) are real. MIT Sloan "literacy not expertise" is real. Anthropic "Building Effective Agents" is real.
- **"What peers are doing" sidebars are INDUSTRY examples, not Technijian client outcomes.** Label them "representative directions of travel across comparable industries, not guarantees," and point the reader to the Capability-Proof / efficiency sections for Technijian's *own* measured results. Do not let a peer-trend bullet read as "a [specific client type] Technijian served got X" unless it actually maps to a real engagement.
- **Attribute client-stated facts to the client, every time.** If a number came from the prospect's own mouth in a meeting (e.g. SC Fuels: "Pilot cut onboarding 27→3 days with AI"), write "as [name] shared on [date]" — do NOT restate it as an independent fact about a third party (especially when that third party is the client's own parent company).
- **Don't print a precise count you can't see.** Review counts, follower counts, employee counts: cite only what the live source actually shows (Gate 0). "4.5-star rating" (visible) is safe; "4.5 stars / 20 reviews" (count not visible) is not. Use a range or drop the number.
- **Respect the client's own accuracy guardrails in `_research.md`** (e.g. SC Fuels: "DO NOT cite revenue," "keep unverified leadership names out"). These exist because the data is unreliable — honor them.
- **Hedge unsourced-but-plausible figures** ("typically $180K+/year," "estimated," "industry-typical") rather than stating them flat. Keep every "illustrative / conservative / to be confirmed at discovery" disclaimer already in the ROI and efficiency sections.

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

### Gate 5: Render-every-page + body-region fill check (never declare done unverified)
- [ ] Render EVERY page of the PDF (and the Executive Summary / concept brief) to an image and actually look at it at display size — page-height-only checks pass while content silently clips or strands.
- [ ] Compute a **body-region fill metric** per page — the filled area within the body region, with the header/footer band EXCLUDED. Flag any page whose body region is mostly empty: it's a short page, a stray page break, or a stranded callout/caption. A full *page* height can hide a half-empty *body*.

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

**Y1 framing — land-and-expand (lead with the entry, not the full number):**
- **ENTRY ("the land," the headline ask):** quick-win recurring services + a low-cost workshop, **no large build** — e.g., My SEO + My AI Lead Gen (Starter) + My AI Workshop/Readiness. Target an easy-yes ~$30k–$45k Y1 for an SMB/single-site.
- **EXPANSION (the upsell, "once it proves out"):** add the My Dev custom build + Managed App Services + Fractional AI Advisor → full-engine Y1.
- **SCALE:** multi-site / portfolio roll-out as further upside (build amortizes across sites).
- Do NOT lead with the full-engine number; it can price Technijian out of the first meeting (Ravi, 2026-05-27).

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

## Field-tested refinements (CDLX / CardLogix, 2026-05)

These are hard-won lessons from running the skill end-to-end on a real engagement that went through a live first meeting. Fold them in by default.

### Fold in the real meeting transcript when one exists
The blueprint is far stronger built *after* the first meeting than before. When a transcript or notes exist:
- **Trace every claim to something the prospect actually said.** Quote them in your reasoning. An opportunity the client confirmed out loud ("this is a service you'd help us with") is *validated* — say so, and upgrade that row's confidence from "concept" to "validated in our [date] conversation." Don't leave it framed as a cold hypothesis when the client already warmed it.
- **Let the prospect's own framing reshape the market section.** CDLX's Nick described a three-wave MFA-adoption story (federal → state/local → private via cyber-insurance) far wider than our cold research had it. His framing was more accurate and more expansive than ours — use the client's lens.
- **Name the real incumbent to displace** from what they tell you (CDLX: phone-based MFA — Duo/Okta — not just the obvious hardware competitors).
- **Rewrite "Next Steps" to mirror what was actually agreed**, not generic boilerplate.

If the meeting hasn't happened, build from research but keep claims conservative and don't invent outcomes — then revise after.

### Grounding pricing (do not fabricate rates)
A wrong or invented number destroys trust faster than a missing one. Discipline:
- **Managed-IT and labor rates come from the legal repo rate card** (`C:\VSCode\tech-legal\`, current standard = the latest MSA + Schedule C). Cite it as the basis. Real US rates (2026): Tech Support $150 normal / $250 after-hours / $125 contracted; CTO/vCIO $250/$350/$225. India Tech Support is a flat $150/hr standard, dropping to $15/$30 only under a cycle commitment — and its hour bands are **inverted** vs US ($15 = 7 PM–7 AM PT India daytime, $30 = 7 AM–7 PM PT night shift). US normal hours are Mon–Fri 7 AM–7 PM PT. See the `reference_technijian_labor_rates` memory; these are easy to get backwards.
- **Productized "My X" services**: only **My SEO** has published tiers (`services/My SEO/assets/my-seo-content.txt`: Tier 1 $500 → Tier 5 $1,500/mo; add-ons AI Search Opt $200 / PR $150 / Content Syndication $200). **My AI, My Dev, My Security, My Compliance, My Cloud have NO published price** — use the Service Investment Defaults and label them "estimated, confirmed at quote." Never present an invented precise figure as fact.
- Show a transparent **Labor Rates table** in the investment section so ad-hoc/project/CA-build work has no surprises. Do **not** expose the internal per-component cost stack (CrowdStrike $/endpoint, etc.) — bundled price + transparent labor rates is the professional norm and protects margin.
- If you don't have a source for a number, **ask or omit** — do not fill the gap with a plausible-looking rate.

### Lead the Quick Wins with a free Nexus Assess
The strongest Quick Win is a concrete, branded, no-cost assessment — it converts "free advice" into a real first engagement. **Nexus Assess** is Technijian's brand for a Network-Detective-style IT risk assessment (the platform is "Nexus Assess + Pulse"; **Nexus Pulse** is the AI-pentest sibling — never call it "Technijian Nexus"). Feature language lives in `services/Nexus Assess Pulse-pre-release/`. Frame it as one free run covering internal vulnerability, external vulnerability (+ dark-web credential check), and a Microsoft 365 review, delivered as a prioritized remediation roadmap — and note it maps to the client's compliance frameworks so it doubles as a head start on their gap map. No pricing (it's the no-commitment hook).

### Keep deep technical companion docs SEPARATE, cross-referenced
When the engagement also needs a heavy technical/commercial analysis (e.g. the CDLX CloudHSM cost study), do **not** merge it into the blueprint. Different audience (BD-persuasion vs engineering), different shelf life (the blueprint is durable; technical list-pricing goes stale), different POV. Instead, add a short non-technical subsection in the blueprint that names it as a **companion deliverable** and points to it. The "complete strategy" is the *set* of documents, not one bloated PDF.

### Build-pattern gotchas (these will bite you)
- **Always spread helper calls that return arrays** into `docChildren`: `...sectionHeader(...)`, `...numberedSteps(...)`. A bare un-spread array (or a stray scalar) serializes as the invalid XML token `<0/>`, and **Word silently refuses to open the file** ("Word experienced an error trying to open the file") even though `node` built it without complaint. Diagnose any won't-open docx with `python -c "import zipfile,xml.dom.minidom as M; M.parseString(zipfile.ZipFile('...docx').read('word/document.xml'))"` — a stray `<0/>` is the tell.
- **Convert DOCX→PDF sequentially, never in a parallel tool batch.** Parallel Word COM calls wedge Word so it fails to open *every* file. If it wedges: kill WINWORD, delete `%APPDATA%\Microsoft\Templates\Normal.dotm` (Word rebuilds it), clear `HKCU:\...\Word\Resiliency`.
- **Never publish unverified digital metrics in Section 08.** LinkedIn follower counts, Google review counts, and GBP presence are routinely wrong in cold web research. The client WILL read this section and WILL call out wrong numbers (AXRT: report said 43 LinkedIn followers → actual 2,027; said GBP not found → GBP active all 4 locations with 57 five-star reviews). Cross-reference any metric you state as fact. See the Data gathering checklist warning block above.
- **Watch for blank pages** from an explicit `pageBreak()` landing on an already-full boundary — render every page and check for empties; remove the redundant break and let content flow. **The fix is to embed the `PageBreak` run INSIDE the last content paragraph** (not as a standalone `new Paragraph({ children: [new PageBreak()] })`). A standalone pageBreak paragraph that lands at a page boundary creates a completely blank page. Instead, add `{ pageBreakAfter: true }` support to your `p()` helper and call it on the last paragraph of the section:
  ```javascript
  // Add pageBreakAfter option to the p() helper
  function p(text, opts = {}) {
    const { pageBreakAfter = false, ...rest } = opts;
    const children = [new TextRun({ text, ...rest })];
    if (pageBreakAfter) children.push(new PageBreak());
    return new Paragraph({ children, ...rest });
  }
  // Usage: last paragraph of a section
  p('Final sentence of section...', { pageBreakAfter: true }),
  // NOT: separate pageBreak() paragraph after it
  ```
- **Verify visually, and don't trust a flaky shell.** Render the PDF/diagram pages to PNG and actually look (cover logo real? tables not overlapping? no blank pages?). When the shell's text output is unreliable, trust the image reads and Word's own success/failure over echoed text.

## Related Skills

- **technijian-report** — For IT/security/QBR reports (not biz-dev strategy docs)
- **technijian-diagram** — For additional editorial SVG diagrams beyond the 3 standard ones
- **technijian-roi** — For standalone ROI/business-case models referenced in Section 10
- **technijian-voice** — Audit full draft text before inserting into docx-js
- **technijian-brand** — Master brand reference for any values not covered here
