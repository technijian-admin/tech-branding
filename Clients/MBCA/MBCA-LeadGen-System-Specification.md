# MBCA-LeadGen — System Specification

**Internal repo / code name:** `mbca-leadgen` (a.k.a. "MBCA-LeadGen")
**Client-facing product name:** **MBC Pursuit Intelligence** (an "AI Pursuit Intelligence" engine)
**Client:** MBC Aquatic Sciences — Costa Mesa, CA (mbcaquatic.com)
**Prepared for:** Ravi Jain / Technijian engineering
**Status:** Specification v1.0 — ready to scaffold and build
**Date:** 2026-06-30

> **Naming discipline (important).** Inside the repo, "MBCA" is fine. In **anything the client ever sees** (the weekly Brief, any UI, any document), use **"MBC"** and **"Pursuit Intelligence"** — never the internal code "MBCA" and never "lead generation." MBC wins work through QBS selection, on-call master agreements, and prime/A-E teaming — account-based (ABM), never cold outreach. The framing is *timing and incumbency intelligence on named pursuits*, not lead-gen. This is a hard rule, not a preference.

---

## 1. Purpose & Scope

### 1.1 What this system does
MBCA-LeadGen continuously monitors public records along the California coast to surface **aquatic-science, marine-monitoring, and environmental-consulting projects 3–24 months before the formal solicitation or on-call cycle**, enriches and scores each against MBC's ICP (service lines, incumbency, and procurement path), and delivers a **weekly Pursuit Intelligence Brief** to Shane Beck and the principal-scientist bench. The goal: MBC is in the agency conversation *before* the RFP posts — and the §316(b) / NPDES renewal calendar is tracked proactively so no incumbent contract quietly lapses.

It is a direct re-target of the proven **BBC Lead Gen engine** (`c:\vscode\bbc-leadgen\bbc-leadgen` — the "OC Luxury Home Builder" case study), replacing the signal layers, ICP, and scoring rubric from *luxury single-family resale/rebuild* to *marine/aquatic environmental consulting for agencies, utilities, ports, and prime A-E firms*.

### 1.2 The 4-stage engine
```
HARVEST  → scrape/poll 8 public-data signal layers: CIP budgets, CEQA/NEPA,
            NPDES permit cycles, board agendas, federal procurement, on-call
            solicitations, infrastructure funding, and prime/A-E teaming signals
ENRICH   → resolve agency identity, project type, procurement path, and MBC
            incumbency cross-reference (57-yr project record)
SCORE    → rank against MBC's ICP (service-line fit, incumbency, timing,
            segment, procurement path)
DELIVER  → weekly Pursuit Intelligence Brief (Tier-1 list + account dossiers +
            NPDES renewal calendar) to Shane Beck + the science bench
```

### 1.3 In scope (pilot)
- Signal harvest, enrichment, scoring, and weekly Brief for **the California coast (San Diego through Ventura)** — MBC's primary market.
- The **NPDES / §316(b) permit renewal calendar** — MBC's gold layer and the system's highest-value defensive capability.
- Unattended weekly run via Windows Task Scheduler.
- MCP server for interactive querying by Claude.

### 1.4 Out of scope (pilot) / expansion
- Automated SOQ drafting (activation is human-led in the pilot — Shane and the science bench own the pursuit and the science).
- Full CRM sync (export only in pilot; Unanet/Deltek integration is Phase 4).
- MBC's 57-year project archive vector index — **stretch goal but closer to core** than for DAS (the incumbency cross-reference IS the differentiator; request the archive export at Phase 0).
- Federal procurement beyond SAM.gov (USACE eBuy, Navy EPS) — Phase 3.
- Out-of-state work (rare for MBC; defer).

### 1.5 Business goal & success definition
Replace 3–5 hrs/week of senior-scientist portal-watching and bid-screening with a curated Tier-1 pursuit feed, and **proactively flag every §316(b)/NPDES renewal in MBC's incumbent account roster** before it enters the competitive window. Pilot succeeds if it surfaces qualified pre-solicitation pursuits the team did not already know about, and the renewal calendar flags at least one incumbent contract that needed early activation.

---

## 2. Business Context (MBC Aquatic Sciences)

| Attribute | Detail | Why it matters to the build |
|---|---|---|
| Firm | Marine/aquatic environmental consulting, Costa Mesa; founded 1969; 57 years | Defines the ICP and the geographic target (CA coast) |
| Core service lines | CWA §316(b) entrainment/impingement; NPDES permit support; marine toxicology; eelgrass survey/restoration; dredging/sediment; CEQA/EIR biological; desalination environmental; coastal restoration | Defines **service-line fit** scoring |
| Scale | 600+ major reports; 30-yr continuous monitoring at El Segundo; 12 coastal generating stations monitored; in-house EPA toxicity lab | Archive = the incumbency-intelligence backbone (§8.4) |
| Win motion | QBS / on-call master agreements / prime-sub / repeat agency relationships — NOT RFP-reactive | Defines procurement-path scoring + ABM discipline |
| "Why now" | IIJA/state bonds funding a coastal/water project wave; §316(b)/NPDES 5-yr renewal cycles are trackable years out; aquatic consulting field is not AI-ready | Two dedicated signal layers (NPDES calendar + IIJA funding) |
| Named-account universe | SCE, AES, Cabrillo, El Segundo Power, NRG, LADWP (power); LACSD, OCSD, IEUA (wastewater); Poseidon Water, West Basin MWD, Doheny (desal); POLA, POLB (ports); AECOM, Dudek, ICF, Moffatt & Nichol, Parsons, Tetra Tech (primes); USACE, USCG, Camp Pendleton (federal) | Seed list for named-account scoring + news queries |

### 2.1 Recipients (champion map)
| Name | Title | Role in the system |
|---|---|---|
| **Shane Beck** | President & Principal Scientist | **Primary Brief recipient** — pursuit owner; decision-maker; the "scientist signs" boundary keeper |
| **Chuck Mitchell** | Founder (1969); VP / Managing Scientist | Institutional memory — the 57-year record the system cross-references for incumbency; optional Brief recipient |
| **Principal Scientist bench** | Senior scientists (27-yr avg tenure) | The pursuit team the Brief serves; the science and the signatures stay here |

---

## 3. System Architecture

### 3.1 Component diagram
```
                          ┌─────────────────────────────────────────────┐
                          │              ORCHESTRATOR                    │
                          │      scripts/run-all-layers.js               │
                          │  (preflight → harvest → dedup → enrich →     │
                          │   score → report → brief → email)            │
                          └───────────────┬─────────────────────────────┘
                                          │
   ┌──────────┬──────────┬───────┬────────┴──┬──────────┬───────────┬──────────┐
   ▼          ▼          ▼       ▼           ▼          ▼           ▼          ▼
L1 Agency  L2 CEQA/   L3 NPDES/ L4 Board/  L5 Federal L6 On-call  L7 Infra/  L8 Prime/
CIP        NEPA       §316(b)   Commission SAM.gov    Solicit.    Water      A-E
budgets    notices    calendar  agendas    forecasts  (PlanetBids) Funding   Teaming
(CIP docs/ (CEQAnet   (EPA ECHO (Granicus/ (SAM API + (BidNet +   (IIJA +   (SerpAPI
 agency    + NEPA.gov) CIWQS)   Legistar/  USACE/USCG agency      state     news;
 portals)              (5-yr    PDF)       forecasts) portals)    bonds)    prime
                       renewal                                              newsrooms)
                       dates)
   │          │          │       │           │          │           │          │
   └──────────┴──────────┴───────┴───────────┴──────────┴───────────┴──────────┘
                                          │  raw signals (JSON per layer)
                                          ▼
                          ┌─────────────────────────────────────────────┐
                          │   CONSOLIDATE & DEDUP                        │
                          │   normalize agency/site → geocode → merge    │
                          └───────────────┬─────────────────────────────┘
                                          ▼
                          ┌─────────────────────────────────────────────┐
                          │   ENRICH  (agency profile · project type ·   │
                          │   procurement path · MBC incumbency X-ref)  │
                          └───────────────┬─────────────────────────────┘
                                          ▼
                          ┌─────────────────────────────────────────────┐
                          │   SCORE & TIER  (config/scoring.json)        │
                          └───────────────┬─────────────────────────────┘
                                          ▼
              ┌───────────────────────────┼───────────────────────────┐
              ▼                           ▼                           ▼
   data/output/*.{json,csv,xlsx}   Pursuit Intelligence Brief   MCP server
                                   (HTML email + dossiers +     (query tools)
                                    NPDES renewal calendar)
```

### 3.2 Data flow (one weekly run)
1. **Preflight** — verify every portal/API reachable + every key valid (reuse `scripts/preflight-check.js`).
2. **Harvest** — run all 8 layer agents in parallel; each writes `data/output/<layer>-YYYY-MM-DD.json`.
3. **Consolidate & dedup** — normalize agency name + site ID, geocode where relevant, merge multi-source hits (a project seen in CEQA *and* a CIP *and* a board agenda is one record with 3 source flags).
4. **Enrich** — agency profile, project type + procurement-path classification, MBC incumbency cross-reference.
5. **Score & tier** — apply `config/scoring.json`; assign Tier 1/2/3.
6. **Report** — write CSV + XLSX (full set) to `data/output/`.
7. **Brief** — generate the weekly HTML Brief (Tier-1 + dossiers + NPDES renewal calendar) and email it (M365 Graph).
8. **Log** — per-run folder under `runs/` with stats and a `run-index.json` entry.

---

## 4. Signal Layers / Data Sources

This is the heart of the re-target. Each layer below names the **real source**, the **access method**, and the **build status** relative to BBC.

> Legend — **♻ Reuse:** BBC code runs as-is or with config only. **🔧 Adapt:** BBC pattern exists, retarget needed. **🆕 New:** net-new agent. **⚠ Hard:** technically involved / partly manual at MVP.

### 4.1 Layer summary

| # | Layer | Real source(s) | Access method | Lead time before solicitation | Status |
|---|---|---|---|---|---|
| L1 | **Agency CIP budgets** | Water/sanitation district, port, and city capital plans (annual budget PDFs, online CIP portals, OpenGov) | Portal scrape + `pdf-parse` on CIP docs | **12–24 mo** (earliest signal; funded project → enviro doc coming) | 🆕 New ⚠ |
| L2 | **CEQA / NEPA notices** | **CEQAnet** (statewide CA, ceqanet.opr.ca.gov); **NEPA.gov** / Federal Register for federal projects | Public API / search harvest | 12–18 mo (NOP = consultant needed; marine/bio sub-scope follows) | 🔧 Adapt (DAS L3 CEQAnet ♻; add NEPA) |
| L3 | **NPDES & CWA §316(b) permit cycles** | **EPA ECHO** (echo.epa.gov — public NPDES permit database); **CA State Water Board CIWQS** (ciwqs.waterboards.ca.gov) | API / public query harvest | **Predictive years out** (5-yr renewal cycles; compute calendar) | 🆕 New — **MBCA Gold Layer** |
| L4 | **Board / commission / district agendas** | Granicus, Legistar, PrimeGov, CivicClerk (water boards, city councils, port commissions, harbor commissions) | Playwright + `pdf-parse` | 3–9 mo (project approvals trigger marine review within months) | 🔧 Adapt (BBC `agents/drb`) |
| L5 | **Federal procurement forecasts** | **SAM.gov API** (free, official); USACE / Navy / USCG procurement forecasts; SBIR/STTR notices | REST API (SAM) + targeted scrape | 3–12 mo (task orders forecast months ahead) | 🆕 New |
| L6 | **On-call & master-agreement solicitations** | **PlanetBids** (primary CA platform), **BidNet**, and direct agency procurement portals | Playwright + portal polling | 0–3 mo (the live solicitation; lowest lead time but critical to never miss) | 🆕 New |
| L7 | **Infrastructure & water funding triggers** | IIJA program pages (USBR, EPA WIF, USACE), **CA Prop 1/4/68 State Water Board grants**, desalination/water-reliability initiatives | REST/scrape + `pdf-parse` | 6–18 mo (funded programs → environmental work pipeline) | 🆕 New |
| L8 | **Prime / A-E teaming signals** | **SerpAPI google_news** (tech-leads `news_fetch.py` pattern) against MBC's named primes (AECOM, Dudek, ICF, Moffatt & Nichol, Parsons, Psomas, Tetra Tech); prime newsrooms; LinkedIn announcements | SerpAPI API + light scrape | Variable (prime's early pursuit = MBC's teaming window) | ♻ Reuse (tech-leads) |

### 4.2 Per-layer detail

**L1 — Agency CIP Budgets.**
- The **earliest signal** and MBC's highest-value layer — a funded capital project in a district's CIP means environmental documentation is coming 12–24 months before the consultant solicitation.
- Target agencies: every coastal water and sanitation district, port authority, harbor commission, and major city from San Diego to Ventura. Start with MBC's named-account roster (SCE, AES, LACSD, OCSD, POLA, POLB, West Basin MWD, IEUA) and expand.
- Access: many districts publish CIP/budget PDFs on their websites or via **OpenGov** (a common budget-transparency platform). Harvest the annual budget cycle (typically Sep–Nov adoption). Parse with `pdf-parse` for project names, capital amounts, and environmental-documentation line items.
- Flag projects named for environmental assessment, biological monitoring, permit compliance, water quality, desalination, dredging, or habitat restoration — MBC's core scopes.
- **This is the hardest layer to systematize** (format fragmentation across dozens of agencies) but the most valuable. Build a curated `config/agencies.json` roster; one scraper per agency pattern. Prioritize named-account agencies first.

**L2 — CEQA / NEPA notices.**
- Reuse the **CEQAnet** harvester from DAS's L3 (same source, same API). For MBCA, filter for coastal, port, water, and energy project types — **not** residential.
- Add **NEPA federal notices** (Federal Register / NEPA.gov) for federal agency projects (USACE, USCG, Navy, NPS coastal). NEPA is CA-absent in DAS's build — this is MBC-specific.
- Notice of Preparation (NOP) = environmental consultant needed; marine/biological sub-scope follows close behind. NOD (Determination) = project is moving.
- Keyword filter: desalination, water treatment, discharge, dredging, habitat restoration, marine, aquatic, coastal, wetlands, NPDES, stormwater, impingement, entrainment.

**L3 — NPDES & CWA §316(b) Permit Renewal Calendar.**
- **MBC's gold layer** and the system's most defensible feature. The coastal power, wastewater, and desalination dischargers MBC serves run on **5-year NPDES and §316(b) cycles**. The renewal dates are knowable years in advance.
- **EPA ECHO** (echo.epa.gov) exposes a public REST API (`/echo/dfr.json`, `/echo/cwa_rest_services.get_facilities`) — query for NPDES facilities in CA coastal counties (San Diego, Orange, Los Angeles, Ventura); extract permit issuance date + effective period to compute the next renewal window.
- **CA State Water Board CIWQS** (ciwqs.waterboards.ca.gov) holds CA-specific permit details and inspection records. Harvest via their public query interface.
- Build and maintain a **NPDES Renewal Calendar** (`data/npdes-calendar.json`) — each MBC incumbent facility with its permit #, issuance date, next renewal quarter, and incumbency status. Run a renewal-flagging check on every Brief cycle: anything renewing within 18 months goes into the Brief as an **incumbency trigger**.
- Cross-reference against MBC's named accounts: El Segundo Generating Station (AES, NRG), 12 monitored coastal generating stations, LACSD Clearwater, OCSD, West Basin MWD, Poseidon Carlsbad/Huntington Beach, etc.
- **This is the one layer where MBC's institutional memory = an irreplaceable competitive moat.** A 30-year record at a station is the strongest qualification in the state. A renewal flagged 18 months out = time to start the conversation. A renewal missed = lapse to whoever showed up first.

**L4 — Board / Commission / District Agendas.**
- Reuse BBC's `agents/drb/` multi-platform scraper (Granicus / Legistar / city CMS), but retarget to **water boards, port commissions, harbor commissions, and coastal city councils** — not planning/design-review boards.
- Key portals: POLA board agendas (Legistar), POLB board agendas, LACSD board, OCSD board, water district boards (MWDOC, West Basin MWD, IEUA, OCWD), CA Coastal Commission hearings.
- Parse agenda PDFs for project names, applicants, locations, scope keywords, and hearing dates. A project approved at a water board = consultant solicitation follows within months.
- Frequency: most boards meet monthly; scrape weekly in case of special meetings.

**L5 — Federal Procurement Forecasts.**
- **SAM.gov API** (free, no authentication for most endpoints): query for NAICS codes relevant to MBC — 541620 (environmental consulting), 541380 (testing labs), 236220 (industrial building construction), and environmental subcodes. Filter to CA + marine/aquatic keywords.
- SAM.gov "Contract Opportunities" (pre-solicitation notices and forecast notices) appear weeks to months before the formal RFP. USACE Sacramento / LA District posts pre-solicitation notices.
- Supplement with USACE / USCG direct procurement pages (scrape) and Navy EPS for Camp Pendleton work.
- MBC's USACE / USCG / Camp Pendleton track record is the door — flag any federal opportunity where MBC has prior work at that installation or district.

**L6 — On-Call & Master-Agreement Solicitations.**
- MBC's **backbone contracts** — the QBS on-call multi-year master agreements that generate recurring task orders. Surface every relevant on-call cycle as it opens; flag renewals before they lapse.
- **PlanetBids** is the primary CA public-agency solicitation platform (most water districts, ports, and cities). Scrape the solicitations board for keywords: marine biology, aquatic toxicology, environmental monitoring, eelgrass, NPDES, §316(b), dredging, wetlands, CEQA biological.
- **BidNet** as secondary. Direct agency portals (LACSD, OCSD, POLA, POLB, USACE eBuy) as named-account supplements.
- This layer has the **lowest lead time** (solicitation is already posted) but is critical — MBC must never miss an on-call opening for a named account. Flag renewals: if MBC has a master agreement with Agency X, set a forward-calendar alert at 6 months before typical expiry.

**L7 — Infrastructure & Water Funding Triggers.**
- IIJA-funded programs, CA Prop 1 / Prop 4 / Prop 68 state water board grants, and desalination/water-reliability initiatives convert into an environmental-work pipeline. Following the money predicts the pursuits 6–18 months before the consultant solicitations.
- Sources: USBR WaterSMART grant awards, EPA Water Infrastructure Finance grants, CA State Water Board Grant Portal (sgma.water.ca.gov), CA DWR funding announcements.
- Harvest: grant award announcements (RSS + PDF); news (SerpAPI query against "California water infrastructure funding desalination coastal IIJA").
- Flag awards to MBC's named agencies or to coastal/port/water projects matching MBC's service lines.

**L8 — Prime / A-E Teaming Signals.**
- MBC's **highest-velocity channel**: surface a prime's large infrastructure pursuit early so MBC is on the team before the scope is locked. A teaming window closes fast once the RFP posts.
- Reuse tech-leads' `news_fetch.py` pattern (SerpAPI `google_news`) against the named-prime query list: AECOM, Dudek, ICF, Moffatt & Nichol, Parsons, Psomas, Tetra Tech, Arcadis, Stantec. Queries: `"[Prime] wins" OR "pursuing" OR "awarded" site scope coastal port water environmental`.
- Supplement: prime newsrooms (scrape `/news` pages), LinkedIn company updates (light-touch scrape), SAM.gov awardee lookups.
- Cross-reference prime + pursuit + geography → score as high if marine scope likely + MBC has not already won the on-call.
- **Coopetition note:** Dudek, ICF, and AECOM are both competitors AND primes MBC subs to. A Dudek large-scale pursuit = teaming opportunity, not competition. Score accordingly.

### 4.3 Source reference (Appendix B has full URLs)
All source endpoints, portal vendors, and dataset IDs are catalogued in `config/signal-sources.json` (template in Appendix B) so a developer can add/disable a source without touching code.

---

## 5. Data Model

All records are JSON; persisted per-layer and consolidated. Schemas (informal):

### 5.1 PursuitRecord (the core entity)
```jsonc
{
  "id": "sha1(normalizedAgencyName + siteId + projectRef)",  // stable dedup key
  "agencyName": "LACSD — Los Angeles County Sanitation Districts",
  "normalizedAgencyName": "lacsd los angeles county sanitation districts",
  "siteId": "Clearwater Desalination Facility, CA",          // site or project identifier
  "geo": { "lat": 33.77, "lng": -118.18 },
  "agencyType": "wastewater | power | port | desal | water-district | federal | municipal | prime",
  "projectType": "npdes-renewal | 316b-renewal | ceqa-bio | dredging | eelgrass | toxicity | desal | on-call | monitoring | teaming | cip-project | nepa | unknown",
  "procurementPath": "qbs-on-call | project-rfp | prime-sub | task-order | unknown",
  "stage": "cip-funded | ceqa-nop | board-approved | solicitation-posted | permit-renewal | teaming-window | unknown",
  "scopeText": "Long-Term Receiving-Water Monitoring Program, NPDES renewal cycle Q1 2027",
  "sources": [                                               // every layer that surfaced it
    { "layer": "L3-npdes", "ref": "NPDES CA0055328", "renewalQuarter": "Q1-2027", "url": "..." },
    { "layer": "L1-cip",   "ref": "LACSD FY27 CIP Item 4.2", "date": "2026-05-15", "url": "..." }
  ],
  "agency": {                                                // see 5.3
    "rawName": "LACSD",
    "resolvedEntity": "Los Angeles County Sanitation Districts",
    "primeContact": "John Doe, Director of Engineering"
  },
  "contacts": [ /* see 5.2 */ ],
  "incumbency": {                                            // from MBC archive cross-ref (§8.4)
    "knownAgency": true,
    "yearsOfRelationship": 12,
    "lastProjectYear": 2023,
    "note": "MBC has monitored Clearwater NPDES discharge since 2011; 4 consecutive renewal cycles"
  },
  "npdesCalendar": {                                         // L3-specific
    "permitNumber": "CA0055328",
    "issuanceDate": "2022-01-15",
    "expirationDate": "2027-01-14",
    "renewalWindowOpen": "2026-07-14",   // 6-mo before expiration
    "urgency": "renew-now | watch | track"
  },
  "legislative": { "iija": false, "stateWaterBond": true, "npdesRenewal": true },
  "score": 17,
  "tier": 1,
  "scoreBreakdown": { /* see §7 */ },
  "firstSeen": "2026-06-30",
  "lastSeen": "2026-06-30"
}
```

### 5.2 Contact (adapt BBC `agents/shared/contacts.js` schema)
```jsonc
{ "role": "agency-pm | principal-engineer | procurement | agency-board-member | prime-bd | prime-pm",
  "name": "Jane Doe", "firm": "LACSD", "title": "Director of Engineering",
  "phone": "...", "email": "...", "source": "hunter | agency-portal | news | linkedin" }
```

### 5.3 AccountDossier (generated for each Tier-1 agency/prime in the Brief)
```jsonc
{ "agency": "LACSD — Clearwater Desalination Facility",
  "activePursuitsSurfaced": 2,
  "background": "LA County's regional water recycling / desalination arm; 2M+ population served...",
  "npdesPermits": [ { "permitNo": "CA0055328", "expirationDate": "2027-01-14", "urgency": "renew-now" } ],
  "priorMBCWork": [ { "project": "Long-Term Receiving-Water Monitoring Program", "years": "2011–2023" } ],
  "decisionMakers": [ /* contacts */ ],
  "suggestedTrigger": "NPDES permit expires Jan 2027 — MBC's 12-year monitoring record is the strongest qualification; start the pre-renewal conversation with the Engineering Director now (6-mo window open)" }
```

### 5.4 NPDES Renewal Calendar (persistent — not per-run)
`data/npdes-calendar.json` — the standing database of known NPDES/§316(b) permits for MBC's named accounts and expanded CA coastal universe. Updated weekly from EPA ECHO + CIWQS. Keyed by permit number. The renewal-flagging logic runs on this file every Brief cycle.

### 5.5 Persisted caches (idempotency)
`data/output/agency-cache.json`, `geocode-cache.json`, `archive-index/` — keyed lookups so re-runs don't re-pay API calls (BBC pattern).

---

## 6. Scoring Engine

Config-driven (`config/scoring.json`) so it can be tuned during the pilot without code changes. **Calibrate with Shane in Week 3** — MBC's segment weighting (§316b vs. desal vs. prime teaming) may shift.

### 6.1 Point rubric (initial)

| Signal | Points | Notes |
|---|---:|---|
| **Incumbency: MBC has prior work at this agency/site** | +6 | Strongest signal — the moat |
| **NPDES / §316(b) renewal within 18 months** | +5 | Defend the contract |
| **NPDES / §316(b) renewal within 6 months** | +7 (replaces +5) | Urgent — act now |
| Project type = §316(b) entrainment/impingement | +5 | MBC core |
| Project type = NPDES monitoring / permit support | +5 | MBC core |
| Project type = desalination environmental | +4 | Core |
| Project type = dredging / sediment | +4 | Core |
| Project type = eelgrass / habitat restoration | +4 | Core |
| Project type = marine toxicology / WET testing | +4 | Core (in-house lab) |
| Project type = CEQA/EIR biological (coastal, port, water) | +3 | Bread-and-butter |
| Procurement path = QBS on-call (MBC's backbone) | +4 | High-velocity |
| Procurement path = prime/A-E teaming (named prime) | +4 | High-velocity |
| Procurement path = project RFP | +2 | Competitive but winnable |
| Stage = CIP-funded or CEQA-NOP | +4 | Earliest, highest value |
| Stage = board approved / agenda item | +3 | Design/procurement window |
| Stage = solicitation posted (on-call or RFP) | +1 | Live — act immediately |
| Segment = power-gen utility (§316b) | +3 | Highest LTV |
| Segment = port / harbor | +3 | Repeat, long-term |
| Segment = wastewater / sanitation district | +2 | Recurring |
| Segment = federal (USACE/USCG/military) | +2 | MBC track record = door |
| Segment = desalination developer | +3 | Poseidon analog |
| Multi-source (seen in ≥2 layers) | +2 | Corroborated intent |
| New agency (no prior MBC relationship) but in-niche | +1 | Expansion signal |
| Known prime pursuing large project (L8) | +3 | Teaming window |
| IIJA / state water bond funded | +2 | "Why now" |
| **Negative:** out of MBC service lines (terrestrial only, demolition, non-enviro) | −4 | |
| **Negative:** outside CA / not coastal (MBC rare out-of-state) | −3 | |
| **Negative:** on-call already won (MBC already on contract) | −2 | Brief note only |
| **Negative:** permit/project already in active procurement (RFP close < 2 weeks) | −1 | Too late to position |

### 6.2 Tiers
- **Tier 1 (act now):** score ≥ 14 → goes in the Brief with a full dossier.
- **Tier 2 (watch):** 8–13 → Brief appendix / watchlist.
- **Tier 3 (monitor):** 4–7 → CSV only.
- **Drop:** < 4.

> Note: the NPDES Renewal Calendar tracks ALL renewals regardless of score — every permit in MBC's named-account roster surfaces in the Brief's incumbency section even if the project scores in Tier 2.

### 6.3 Implementation
Adapt BBC's `scripts/score-and-report.js` + `score-and-report-lib.js`. Replace the luxury-SFR rubric with the table above; replace BBC's `agents/shared/client-fit.js` (`isBurkhartFit`) with `isMBCFit` (aquatic/marine environmental, in CA, procurement path not QBS-closed).

---

## 7. Enrichment Pipeline

| Step | Source | Reuse | Output |
|---|---|---|---|
| Agency name normalize + geocode | Google Geocoding API | ♻ `scripts/enrich-geocode.js` | dedup key, lat/lng |
| **Agency profile** | Agency website scrape + OpenGov | 🆕 new module (`enrich-agency-profile.js`) | agency type, CIP link, board roster, PM contacts |
| **Project type + procurement path classification** | LLM (Claude) on scope text | 🆕 new module | npdes-renewal, qbs-on-call, prime-sub, etc. |
| Decision-maker contacts | **Hunter.io** (domain → verified emails) | ♻ tech-leads `prequalify_leads.py` pattern | agency BD/PM/engineering director contacts |
| **MBC incumbency cross-reference** | MBC 57-yr project archive index (§8.4) | 🆕 stretch (but near-core for MBCA) | "known agency/site" flag + years of relationship |
| **NPDES permit details** | EPA ECHO API + CA CIWQS | 🆕 `agents/npdes/echo.js` | permit #, issuance date, expiration, renewal urgency |
| Prime teaming context | SerpAPI + prime newsrooms | ♻ tech-leads `news_fetch.py` | prime project name, marine scope likelihood |

> Agency-profile enrichment (getting the right PM contact and project context from an agency website) is the net-new enrichment problem vs. BBC (BBC enriched individual homeowners; MBCA enriches institutional government agencies). Budget time for it — contact directories are inconsistently structured.

---

## 8. Delivery — Pursuit Intelligence Brief

### 8.1 The deliverable
A **weekly HTML email** (rendered, on-brand "MBC Pursuit Intelligence") to Shane Beck (+ optional Chuck Mitchell), containing:
1. **Executive line** — "N new Tier-1 pursuits this week" + efficiency metric (principal-scientist portal-watching hours recovered).
2. **NPDES / §316(b) Renewal Calendar** — the standing list of MBC incumbent permits with renewal urgency flags. This section appears every week regardless of new signals.
3. **Tier-1 pursuit cards** — agency name, project type, procurement path, stage, score, surfacing sources, and a one-line *suggested trigger* (the activation hook).
4. **Account dossiers** — for each Tier-1 agency/prime (§5.3).
5. **Incumbency triggers** — "El Segundo's NPDES permit enters the renewal window in Q1 2027 — your 30-year monitoring record is the strongest qualification in the state; start the conversation now" / "Moffatt & Nichol is pursuing a Port of Long Beach program — the marine scope is yours if you're on the team in the next 60 days."
6. **Teaming triggers** — prime-teaming opportunities where MBC's sub-scope is visible.
7. **Attachments** — full XLSX (all tiers) + NPDES calendar export.

### 8.2 Channels
- **Email:** M365 Graph — reuse `scripts/email-tier1-leads.ps1` (already authenticates as RJain@technijian.com via the Technijian app registration). Retarget recipient (Shane Beck) + template.
- **Files:** `data/output/full-run-YYYY-MM-DD.{json,csv,xlsx}` + `brief-YYYY-MM-DD.html` + `npdes-calendar.json`.
- **MCP:** `mcp-server/index.js` exposes `get-tier1`, `run-pipeline`, `get-dossier`, `get-npdes-calendar`, `search-pursuits` for interactive use in Claude.

### 8.3 Brief generator
New `scripts/build-brief.js` — consumes the scored `full-run` JSON + `npdes-calendar.json`, renders the HTML Brief (airy style; MBC-appropriate Technijian branding). Reuse BBC's `build-full-report.js` for the XLSX.

### 8.4 MBC Incumbency / Archive Cross-Reference (the differentiator — request at Phase 0)
Index MBC's 57-year project record (agency name, site, project type, year, permit number) into a vector/keyword store (Weaviate or SQLite FTS to start). At enrichment, match each surfaced agency/site against it to produce the **"MBC already knows this agency"** flag and the **years-of-relationship** enrichment.

For MBCA, this is **closer to core than for DAS** — the incumbency flag is the single highest-scoring signal (+6 pts) and the foundation of the NPDES renewal defense play. Request the archive export from MBC at Phase-0 discovery. Chuck Mitchell (the 57-year institutional memory) is the right person to ask.

Unlike DAS (where the archive is a stretch goal), build at minimum a **curated named-account roster** (`config/named-accounts.json`) from the proposal research — 40+ agencies we know MBC has worked with — as an immediate incumbency proxy while waiting for the full archive.

---

## 9. The "Convert into Wins" Layer (ABM activation)

> **Clarification for MBCA:** a "lead that converts into a client" = a surfaced **pursuit that becomes a won on-call agreement or project task order**. For incumbency pursuits, it means a renewed contract rather than a lapsed one. The system finds the signal; the *win* comes from Shane or the science bench activating the relationship *before* the solicitation posts.

### 9.1 Pilot (human-led — the "scientist signs" boundary)
The Brief hands Shane a ranked, dossiered list. He and the science bench activate named-agency relationships (call, site visit, teaming conversation) using the suggested triggers. The system tracks **hours-to-first-contact** (for new pursuits) and **renewal-conversation-started** (for NPDES calendar items) as pilot outcome metrics.

A key ABM discipline: MBC's agency PMs are often known personally. The system's job is to surface *the right moment* to activate that relationship — not to replace it with cold outreach.

### 9.2 Loop-closing
A lightweight `outcomes.json` (or a column Shane edits in the XLSX) feeds back: contacted? / on-call submitted? / won? / renewed? — so the pilot can be measured against baseline at Week 12.

### 9.3 Expansion (post-pilot, optional)
The tech-leads activation stack (`prep_next_touches.py` + Hunter verification + M365 send + 3-pass `proofread.py`) can draft **warm, account-specific** outreach (email + SOQ cover language) for Shane's approval — same machinery that runs Technijian's own pipeline, voice-profiled to MBC's QBS/science-first tone. **Gated behind explicit opt-in and always human-approved.** The "scientist signs" boundary extends to activation copy: no automated outbound without Shane review.

### 9.4 Compounding with the Institutional-Memory Brain (expansion)
Per the MBC AI Growth Report, the long-term expansion is the **Institutional-Memory Brain** (index 57 years of reports, datasets, and taxonomic judgment → Weaviate + Obsidian). When that layer is built, the Pursuit Intelligence engine's Tier-1 signals flow directly into an AI SOQ/CEQA-scope drafting engine — turning a flagged pursuit into a drafted statement of qualifications in hours. The MBCA-LeadGen repo should expose a `get-tier1-for-soq` MCP tool in anticipation of this integration.

---

## 10. Automation & Scheduling

- **Cadence:** weekly, **Monday 07:00 PT** (Brief lands at the start of Shane's week). Configurable.
- **NPDES calendar check:** also runs on the **1st of each month** with a standalone renewal-urgency digest — any permit entering the 18-month window gets a direct alert to Shane even between weekly briefs.
- **Mechanism:** Windows Task Scheduler — reuse `scripts/setup-weekly-schedule.ps1`. Steps: `preflight → pipeline → npdes-calendar-refresh → report → brief → email`.
- **Self-healing:** reuse BBC's `pipeline-selfheal.js` (retries failed portal scrapes) and `pipeline-learn.js` (records portal changes).
- **Logging:** per-run folder `runs/YYYY-MM-DD_HH-MM/` with per-agent logs, error screenshots, and a `runs/run-index.json` entry. Reuse BBC `scripts/run-tracker.js`.
- **Runtime budget:** target < 60 min/run for the full CA coast pipeline (more sources than DAS, but no multi-metro Playwright fleet).

---

## 11. Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Language/runtime | **Node.js 20 LTS** (CommonJS) | Maximize direct reuse of BBC's proven agents/scripts |
| Browser automation | **patchright** 1.59 (primary) + playwright 1.58 + playwright-extra/stealth (fallback) | Anti-bot; identical to BBC |
| PDF parsing | **pdf-parse** | CIP budget docs, board agenda PDFs (L1, L4) |
| Spreadsheet/doc | **xlsx**, **docx** | Reports + Brief attachments |
| Config/env | **dotenv** | Vault-first loader (`agents/shared/load-env.js`) |
| LLM (optional) | LiteLLM gateway / Claude | Project-type classification, agency-profile extraction from unstructured CIP text, scope summarization |
| Vector store (stretch) | Weaviate or SQLite FTS | MBC archive incumbency index (§8.4) — higher priority than DAS |
| Email | PowerShell + Microsoft Graph | Reuse BBC email script |
| MCP | @modelcontextprotocol/sdk | Interactive querying |
| Scheduler | Windows Task Scheduler | Reuse BBC PS1 |

Python is acceptable for isolated pieces (EPA ECHO / CIWQS API, SAM.gov pull, archive indexing) but the **orchestrator and scrapers stay Node** to inherit BBC directly.

---

## 12. Repository Structure

```
mbca-leadgen/
├─ README.md
├─ SPEC.md                         # this document
├─ package.json
├─ .env                            # gitignored; real values in OneDrive keys vault
├─ .gitignore
├─ .mcp.json
├─ agents/
│  ├─ cip/                         # NEW — agency CIP budget scrapers (per-agency)
│  │  ├─ lacsd/                    # LACSD capital plan
│  │  ├─ ocsd/                     # OCSD
│  │  ├─ pola/                     # Port of LA
│  │  ├─ polb/                     # Port of LB
│  │  └─ shared/                   # OpenGov pattern + pdf-parse
│  ├─ ceqa-nepa/                   # ADAPT from DAS agents/ceqa — add NEPA federal
│  ├─ npdes/                       # NEW — MBCA Gold Layer
│  │  ├─ echo.js                   # EPA ECHO API harvest
│  │  ├─ ciwqs.js                  # CA CIWQS harvest
│  │  └─ renewal-calendar.js       # Build/maintain npdes-calendar.json
│  ├─ board-agendas/               # ADAPT from BBC agents/drb (water boards, port commissions)
│  ├─ federal/                     # NEW — SAM.gov API + USACE/USCG scrape
│  ├─ solicitations/               # NEW — PlanetBids + BidNet scrapers
│  ├─ funding/                     # NEW — IIJA + state water bond grant tracking
│  ├─ teaming/                     # REUSE tech-leads news_fetch (prime news)
│  └─ shared/                      # browser.js, load-env.js, contacts.js, dedup.js,
│                                   #  geocode.js, mbc-fit.js, scoring.js,
│                                   #  agency-profile.js, procurement-path-classifier.js
├─ scripts/
│  ├─ preflight-check.js           # ♻ BBC
│  ├─ run-all-layers.js            # ♻ BBC orchestrator (swap layer registry)
│  ├─ enrich-all-leads.js          # ♻ BBC (geocode/agency-profile/contacts)
│  ├─ enrich-agency-profile.js     # NEW
│  ├─ classify-procurement-path.js # NEW (LLM-assisted)
│  ├─ refresh-npdes-calendar.js    # NEW (runs weekly + monthly)
│  ├─ score-and-report.js          # ♻ BBC (swap rubric)
│  ├─ build-full-report.js         # ♻ BBC (XLSX/CSV)
│  ├─ build-brief.js               # NEW (weekly Pursuit Intelligence Brief HTML)
│  ├─ email-brief.ps1              # ♻ BBC email-tier1-leads.ps1 (retarget)
│  ├─ pipeline-selfheal.js         # ♻ BBC
│  ├─ run-tracker.js               # ♻ BBC
│  └─ setup-weekly-schedule.ps1    # ♻ BBC
├─ config/
│  ├─ agencies.json                # named-account roster (agency → CIP URL → board URL → permit #s)
│  ├─ signal-sources.json          # all source endpoints/API bases (Appendix B)
│  ├─ mbc-icp.json                 # service-line keywords, agency types, geo scope
│  ├─ scoring.json                 # the §6 rubric (tunable)
│  └─ prime-list.json              # named primes for L8 news queries
├─ data/
│  ├─ output/                      # run artifacts + caches (gitignored)
│  ├─ npdes-calendar.json          # standing permit renewal calendar (tracked in git)
│  └─ archive-index/               # MBC 57-yr project incumbency index (stretch)
├─ mcp-server/
│  └─ index.js                     # ♻ BBC pattern (add get-npdes-calendar, get-tier1-for-soq)
├─ runs/                           # per-run logs/screenshots (gitignored)
└─ docs/
   ├─ workstation.md               # setup guide
   └─ phase-0-discovery.md         # §18 items to confirm with Shane
```

---

## 13. Configuration & Secrets

### 13.1 Secrets — never in repo
All credentials load at runtime from the OneDrive keys vault (BBC pattern, `agents/shared/load-env.js`):
`C:\Users\rjain\OneDrive - Technijian, Inc\Documents\VSCODE\keys\mbca-leadgen.env`

| Key | Used for | Notes |
|---|---|---|
| `GOOGLE_GEOCODING_API_KEY` | Geocode (dedup) | Reuse |
| `SERPAPI_KEY` | Prime/teaming news (L8) | From tech-leads |
| `HUNTER_API_KEY` | Contact discovery | From tech-leads |
| `EPA_ECHO_API_KEY` | NPDES permit data (L3) | Free registration |
| `SAM_GOV_API_KEY` | Federal procurement (L5) | Free registration at SAM.gov |
| `PLANETBIDS_*` | On-call solicitations (L6) | Portal credentials if required |
| `GRAPH_CLIENT_ID` / `GRAPH_TENANT_ID` / `GRAPH_CLIENT_SECRET` | M365 email | Reuse Technijian app reg |
| Per-agency portal logins | CIP portals, CIWQS | Only where required |

> Note: ATTOM API (used in BBC and DAS) is **NOT needed** for MBCA — no property deed layer; replace with EPA ECHO + CIWQS for the permit-data equivalent.

### 13.2 `config/agencies.json` (shape)
```jsonc
{ "named_accounts": [
    { "name": "LACSD", "fullName": "LA County Sanitation Districts",
      "type": "wastewater", "cipUrl": "https://www.lacsd.org/civicax/...",
      "boardVendor": "legistar", "boardUrl": "https://lacsd.legistar.com",
      "npdesPermits": ["CA0055328", "CA0053961"],
      "incumbency": true, "yearsOfRelationship": 12 },
    { "name": "AES-El-Segundo", "fullName": "AES El Segundo LLC / El Segundo Power",
      "type": "power-gen-316b", "cipUrl": null,
      "npdesPermits": ["CA0001139"],
      "incumbency": true, "yearsOfRelationship": 30 }
    /* ... 40+ named accounts from project vault research ... */
  ],
  "primes": [
    { "name": "AECOM", "domain": "aecom.com", "coopetition": true },
    { "name": "Dudek", "domain": "dudek.com", "coopetition": true },
    { "name": "ICF", "domain": "icf.com", "coopetition": true },
    { "name": "Moffatt & Nichol", "domain": "moffattnichol.com", "coopetition": true },
    { "name": "Parsons", "domain": "parsons.com", "coopetition": false },
    { "name": "Tetra Tech", "domain": "tetratech.com", "coopetition": true }
  ] }
```

---

## 14. Non-Functional Requirements

- **Idempotent & incremental:** stable `id` (agency+site+projectRef) dedup; persistent caches; `firstSeen`/`lastSeen` so the Brief shows only *new* pursuits week-over-week. The NPDES calendar is a standing dataset — not reset per run.
- **Anti-bot / polite:** patchright; randomized delays; per-portal concurrency caps; respect robots/ToS (§16).
- **Resilient harvest:** one agency failing must not abort the run; failures logged with screenshots, retried next run (BBC self-heal pattern).
- **NPDES calendar integrity:** the calendar file (`data/npdes-calendar.json`) is the most mission-critical artifact — its renewal-date accuracy directly drives business decisions. Validate permit dates against two sources (ECHO + CIWQS) before writing; flag discrepancies for manual review.
- **Observability:** per-run stats (records/layer, dedup ratio, enrichment yield %, tier counts) written to `runs/` and surfaced in the Brief footer.
- **Config over code:** adding an agency or source = editing JSON, not writing an agent (except genuinely new portal vendors).
- **Determinism:** a re-run on the same day produces the same scored set (no randomness in scoring).

---

## 15. Security, Legal & Ethical

- **Public records only.** All sources are public government/regulatory data (EPA ECHO, CIWQS, SAM.gov, CEQAnet, Granicus, PlanetBids) or licensed data APIs (Hunter, SerpAPI under their ToS). No authentication bypass.
- **Respect ToS / rate limits.** Prefer official APIs (EPA ECHO REST, SAM.gov, CEQAnet) over scraping where they exist. Throttle scrapers. EPA ECHO is a public-good dataset — use it responsibly.
- **PII:** contacts are *professional* government procurement contacts; store only what's needed for the Brief; no consumer-credit or restricted data.
- **ABM discipline (product-level):** the system surfaces intelligence for **named-account, warm activation**. It must not be wired into cold mass-email. Activation (§9.3) is always human-approved and account-specific. The "scientist signs" boundary extends here: no automated outbound claiming to speak for MBC's scientific expertise.
- **NPDES data accuracy:** renewal dates affect real regulatory and business decisions. Every calendar entry should note its source(s) and last-verified date. Disclaim in the Brief footer that dates should be verified against the permit record before action.
- **Secrets:** vault-only, never committed (GitHub push protection will block hardcoded secrets).

---

## 16. Build Roadmap (mapped to the 90-day pilot)

> Commercial frame (from the proposal, published pricing — do not invent): My AI Lead Gen **Professional $3,499/mo → ~$10,500 for the 90-day pilot** + one-time signal-architecture configuration (scoped at quote). Starter $1,499/mo on-ramp available, scoped to the §316(b)/NPDES backbone only, expanding to Professional as the pilot proves out. Only the pilot is committed scope.

| Phase | Window | Deliverable | Layers / work |
|---|---|---|---|
| **0 — Discovery** | Pre-build (Week 0) | Confirmed config + named-account roster | §18 items: named-account roster, NPDES permit list, pursuit baseline, CRM stack, archive export request |
| **1 — NPDES Calendar + MVP harvest** | Weeks 1–2 | **NPDES Renewal Calendar live** (L3 — EPA ECHO + CIWQS); first scored Tier-1 list | L3 (NPDES 🆕), L4 (board agendas 🔧), L2 (CEQAnet 🆕); `mbc-fit` + scoring; XLSX out |
| **2 — First Brief** | Week 3 | Weekly Pursuit Intelligence Brief delivered; thresholds calibrated with Shane | `build-brief.js`, email, dossiers, NPDES calendar section |
| **3 — Full signal set** | Weeks 4–8 | L1 (CIP budgets), L5 (SAM.gov federal), L6 (PlanetBids), L7 (IIJA funding), L8 (prime teaming); incumbency cross-ref from curated named-account list | Scheduler live; outcome loop tracked; archive index started if export received |
| **4 — Expansion** | Weeks 9–12 + | Full archive incumbency index; activation assist (§9.3); Institutional-Memory Brain integration path; CIWQS full integration | Post-pilot review vs. baseline |

### 16.1 MVP definition (what "done" means for Phase 1)
The NPDES Renewal Calendar is populated for MBC's named accounts (at minimum the 40+ agencies from `config/agencies.json`) with correct expiration dates from EPA ECHO. A single `npm run pipeline` produces a deduped, scored `full-run` with a non-trivial Tier-1 set including at least one NPDES incumbency trigger — proving the engine's core defensive value. Written to XLSX.

### 16.2 Suggested first commits
1. `npm init` + copy BBC `package.json` deps + `agents/shared/{browser,load-env,contacts}.js`.
2. `config/agencies.json` with the 40+ named accounts from vault research.
3. `agents/npdes/echo.js` → EPA ECHO API → prove the NPDES calendar (highest-value first).
4. `agents/board-agendas/` → adapt BBC `agents/drb` to water board + port commission portals.
5. `mbc-fit.js` + `scoring.json` + adapt `score-and-report.js`.
6. `build-brief.js` skeleton → first HTML Brief with NPDES calendar section.

---

## 17. Success Metrics & Acceptance Criteria

| Metric | Target (pilot) |
|---|---|
| Weekly run completes unattended | Yes, by Week 4 |
| NPDES Renewal Calendar populated (named accounts) | ≥ 40 permits, dates from EPA ECHO, by Week 2 |
| NPDES permits flagged as "renew-now" (≤6 mo) | Surfaced with urgency in every Brief |
| New Tier-1 pursuits surfaced / week (new signals only) | ≥ 5 (calibrate with Shane Wk3) |
| Pursuits MBC did *not* already know about | > 0 (the core proof) |
| Enrichment yield (agency contact) | ≥ 50% of Tier-1 (agencies harder to resolve than individuals) |
| Principal-scientist portal-watching hours recovered | ≥ 2 hrs/wk (confirm baseline at discovery) |
| Renewal-conversation-started from Brief trigger | ≥ 1 by Week 12 |
| Pursuits entered into active pursuit from Brief | ≥ 1 by Week 12 |

---

## 18. Open Discovery Items (confirm with Shane — Phase 0)

Put these in `docs/phase-0-discovery.md`:
1. **Named-account roster** — confirm and extend the 40+ agency list; especially which water districts, ports, and utilities MBC has on-call agreements with today.
2. **Full NPDES permit list** — MBC's complete list of active NPDES/§316(b) monitoring contracts with permit numbers, expiration dates, and key PM contacts. This seeds the Calendar immediately.
3. **Pursuit baseline** — current pursuit volume, QBS win rate, on-call submission cadence, hours-to-SOQ (ROI anchors).
4. **CRM / pursuit-tracking stack** — Unanet, Deltek, Cosential, or spreadsheet? (for export/loop-close target).
5. **Archive export** — can MBC provide the 57-year project list (agency, site, project type, year, permit #)? Even a spreadsheet export enables the incumbency index. Chuck Mitchell is the right person to ask.
6. **Service-line weighting** — confirm §6 rubric reflects how Shane actually prioritizes (§316b vs. desal vs. prime teaming vs. eelgrass).
7. **On-call agreements that are renewing** — which master agreements are expiring in the next 12–24 months? Critical to pre-load into the Calendar as high-urgency.
8. **Prime teaming relationships** — which primes does MBC currently have active teaming agreements with? Which are the highest-value to watch?

---

## Appendix A — BBC / DAS → MBCA Reuse Map (file-level)

| MBCA component | Source to start from | Action |
|---|---|---|
| Browser factory | BBC `agents/shared/browser.js` | Reuse as-is |
| Env/vault loader | BBC `agents/shared/load-env.js` | Reuse, point to `mbca-leadgen.env` |
| Contact schema + hydration | BBC `agents/shared/contacts.js`, `llm-contacts.js` | Reuse; adapt role enum (agency-pm vs. developer-exec) |
| Fit filter | BBC `agents/shared/client-fit.js` (`isBurkhartFit`) | Fork → `mbc-fit.js` (aquatic enviro, CA coast, not closed) |
| Orchestrator | BBC `scripts/run-all-layers.js` | Reuse, swap layer registry (8 MBCA layers) |
| Board/agenda scrapers | BBC `agents/drb/` | Adapt — target water boards, port commissions (not planning/DRB) |
| CEQA harvester | DAS `agents/ceqa/` | Reuse; add NEPA federal notices |
| Scoring | BBC `scripts/score-and-report.js` + `score-and-report-lib.js` | Reuse, swap rubric (§6) |
| Enrichment — geocode | BBC `scripts/enrich-geocode.js` | Reuse |
| Enrichment — contacts | BBC `scripts/skip-trace-leads.js` (pattern) + Hunter | Reuse Hunter pattern; drop skip-trace (less relevant for agency contacts) |
| Report (XLSX/CSV) | BBC `scripts/build-full-report.js`, `csv-to-excel.js` | Reuse |
| Email | BBC `scripts/email-tier1-leads.ps1` | Reuse, retarget recipient/template |
| Scheduler | BBC `scripts/setup-weekly-schedule.ps1` | Reuse; add monthly NPDES calendar run |
| Self-heal / learn / tracker | BBC `scripts/pipeline-selfheal.js`, `pipeline-learn.js`, `run-tracker.js` | Reuse |
| Preflight | BBC `scripts/preflight-check.js`, `preflight-smoke.js` | Reuse |
| MCP server | BBC `mcp-server/index.js` | Reuse, retarget tools (add `get-npdes-calendar`, `get-tier1-for-soq`) |
| Prime/teaming news (L8) | tech-leads `scripts/news_fetch.py` | Port pattern; retarget queries to named primes |
| Activation (expansion) | tech-leads `prep_next_touches.py`, `proofread.py`, Hunter verify | Port (gated, human-approved, "scientist signs") |
| **NPDES Calendar (L3)** | **NET NEW** | `agents/npdes/echo.js` + `ciwqs.js` + `renewal-calendar.js` |
| **CIP budget scrapers (L1)** | **NET NEW** | Per-agency (LACSD, POLA, POLB, OCSD, etc.) |
| **Federal / SAM.gov (L5)** | **NET NEW** | SAM.gov REST API |
| **On-call solicitations (L6)** | **NET NEW** | PlanetBids + BidNet scrapers |
| **Funding triggers (L7)** | **NET NEW** | IIJA/state water bond grant scrape |
| **Agency profiler** | **NET NEW** | `enrich-agency-profile.js` |
| **Procurement-path classifier** | **NET NEW** | `classify-procurement-path.js` (LLM-assisted) |

## Appendix B — `config/signal-sources.json` (starter template)
```jsonc
{
  "L1_cip": {
    "type": "scrape+pdf", "note": "per-agency — see agencies.json for CIP URLs",
    "pattern": "annual budget cycle Sep–Nov; parse for enviro/marine/NPDES/monitoring keywords"
  },
  "L2_ceqa": {
    "type": "api",    "base": "https://ceqanet.opr.ca.gov",
    "filters": ["coastal","port","water","energy","desalination","marine","wetland"],
    "minCommentPeriod": 0
  },
  "L2_nepa": {
    "type": "scrape", "base": "https://nepa.gov", "supplement": "Federal Register",
    "filters": ["USACE","USCG","Navy","NPS","coastal","marine","dredging"]
  },
  "L3_echo": {
    "type": "api",    "base": "https://echo.epa.gov/echo/cwa_rest_services.get_facilities",
    "params": { "p_st": "CA", "p_county": "San Diego,Orange,Los Angeles,Ventura" },
    "tokenKey": "EPA_ECHO_API_KEY"
  },
  "L3_ciwqs": {
    "type": "scrape", "base": "https://ciwqs.waterboards.ca.gov",
    "note": "CA-specific permit detail; cross-validate with ECHO dates"
  },
  "L4_board_agendas": {
    "type": "scrape+pdf", "vendors": ["granicus","legistar","primegov","civicclerk"],
    "note": "per-agency — see agencies.json for boardVendor + boardUrl"
  },
  "L5_sam": {
    "type": "api",    "base": "https://api.sam.gov/opportunities/v2/search",
    "params": { "naicsCode": "541620,541380", "postedFrom": "-30d", "placeOfPerformance.state.code": "CA" },
    "tokenKey": "SAM_GOV_API_KEY"
  },
  "L6_planetbids": {
    "type": "scrape", "base": "https://www.planetbids.com",
    "keywords": ["marine biology","aquatic toxicology","NPDES","316b","eelgrass","dredging","environmental monitoring"]
  },
  "L6_bidnet": {
    "type": "scrape", "base": "https://www.bidnet.com",
    "keywords": ["marine","aquatic","environmental","NPDES","coastal","wetlands"]
  },
  "L7_iija": {
    "type": "scrape+serpapi", "note": "USBR WaterSMART, EPA WIF, CA DWR grants, CA State Water Board",
    "queries": ["California IIJA water grant award coastal desalination","CA Prop 4 water bond environmental"]
  },
  "L8_prime_news": {
    "type": "serpapi", "engine": "google_news",
    "queries": [
      "\"AECOM\" wins port OR water OR coastal California environmental",
      "\"Dudek\" pursuing water OR coastal California",
      "\"ICF\" marine OR aquatic California award",
      "\"Moffatt & Nichol\" port OR harbor California environmental",
      "\"Tetra Tech\" NPDES OR water OR coastal California"
    ],
    "tokenKey": "SERPAPI_KEY"
  }
}
```

---
*End of specification v1.0. The NPDES Renewal Calendar (L3) is the highest-value first build — get EPA ECHO running against the named-account permit list before any other layer. Verify permit expiration dates against CIWQS as a second source. All per-agency CIP portal URLs and board agenda vendors should be confirmed during Phase-0 discovery — they drift over time.*
