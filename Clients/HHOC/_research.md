# HHOC — Housing for Health Orange County, Inc. (DBA "Housing for Health California")
## AI Growth Blueprint — Research File

**Client code:** HHOC
**Date researched:** 2026-05-26
**Researcher:** Technijian AI research (web crawl + Form 990 + CalAIM/firmographic)
**Status:** Research complete — ready for blueprint writing
**Source pattern:** Mirrors `Clients/VAF/_research.md`, `Clients/SCF/`, `Clients/ORX/` — research-driven, not templated.

---

## 00 — Positioning Guardrails (READ FIRST)

### A. What HHOC actually is — get this right.
**Housing for Health Orange County, Inc.** (EIN 87-3137292) is a small California **501(c)(3) nonprofit** (IRS ruling April 2022), HQ **17701 Cowan Ave, Suite 200, Irvine, CA 92614**; (949) 263-8676 / (833) 736-3173. It plays a **hybrid role**: (1) a **CalAIM Enhanced Care Management (ECM) + housing Community Supports provider** that bills Medi-Cal managed care directly (holds NPI 1124766704, Case Management taxonomy), and (2) an emerging **administrative "umbrella" / regrantor** that supports other front-line homeless-services CBOs. In **2025 it rebranded/expanded as "Housing for Health California" (HHCA)** — a DBA over the same OC entity (legal name unchanged; `housingforhealthoc.org` 301-redirects to `housingforhealthca.org`). **HHOC = Housing for Health Orange County.** Home = Orange County; **"statewide" is forward-looking/aspirational** (no verified out-of-county operations yet).

### B. This is a mission-driven nonprofit — frame "growth" as funding + people served, not "sales."
Growth = **(capture the Medi-Cal revenue it's already entitled to) + (serve more people) + (win/deepen payer contracts and grants).** Voice must be respectful and mission-aligned. The deliverable is opportunity-focused; sensitive items (see D) live as neutral discovery questions, not spotlighted critiques.

### C. GTM motion = ACCOUNT-BASED (payer contracts), NOT consumer demand-gen.
Buyers are a **finite, named set of payers**: Medi-Cal **Managed Care Plans** (in OC that's **CalOptima** — a single-payer COHS county; plus **Kaiser** ECM) and, for expansion, other MCPs/counties. Secondary: **grants/philanthropy** (Kaiser, foundations). Supporting: **referral relationships** (hospitals/ERs, OC Coordinated Entry, FQHCs). New 2025 motion: **selling back-office/infrastructure to other CBOs** (the umbrella/network play). **Minimal consumer demand-gen** — individuals don't fund the org. So: lead with payer-contract enablement, billing/compliance, outcomes reporting, and account intelligence — NOT a consumer funnel. (Per `feedback_pitch_abm_not_leadgen`.) Modest AEO/SEO value = referral partners + eligible clients finding them.

### D. Sensitive flags — handle tactfully (research-only; in the client doc, use neutral discovery questions).
- **No clearly identified CURRENT ED/CEO.** Heather (Dion) Stratman (ex-CAO) left to City of Irvine ~Dec 2024; Rachel Steinmetz (ex-COO) appears departed. **Do NOT print current leadership names in the client doc.** Board (HHCA About page): Danielle N. Ball, Patti Long, Sara May, Natalie Reider, Arif Shaikh.
- **Possible Mercy House affiliation:** CauseIQ describes HHOC as "a subordinate organization under Mercy House Living Centers" — mechanism UNVERIFIED; HHOC also regrants TO Mercy House. Who actually governs is unclear. → discovery question, not an assertion.
- **FY2024 revenue fell ~77%** (FY23 $5.53M → FY24 $1.27M; FY22 $4.89M) — cause unknown (possibly a pass-through/regranting flow ending or restructuring). **Do NOT speculate on the cause or spotlight the drop in the client doc.** Treat current financials as a neutral discovery item.

### E. HIPAA-safe is the leading constraint (the credibility anchor — like VAF's explainability).
HHOC handles **Medi-Cal member PHI** and likely **42 CFR Part 2 (SUD) records**. **Any AI touching client data must be HIPAA-compliant** — BAA in place, private/enterprise endpoints (Azure OpenAI / AWS Bedrock / Anthropic via BAA), tenant-isolated, no client PHI to public/consumer LLMs, human-in-the-loop. Make the BAA/architecture point FIRST. Concrete local proof the constraint bites: the OC recuperative-care pilot had to invent a data-flow workaround when a CalOptima↔OC-HCA BAA expired mid-pilot (CHCS). No autonomous billing (False Claims risk) — explainable + human-reviewed.

---

## 01 — Business Snapshot

| Field | Detail | Confidence |
|-------|--------|-----------|
| Legal name | **Housing For Health Orange County Inc** (DBA "Housing for Health California") | VERIFIED (ProPublica 990 / NPI) |
| EIN / status | 87-3137292; **501(c)(3)**, IRS ruling April 2022 | VERIFIED |
| HQ | 17701 Cowan Ave, Suite 200, Irvine, CA 92614; (949) 263-8676 | VERIFIED (NPI registry) |
| NPI | 1124766704 (Case Management taxonomy 251B00000X) | VERIFIED (CMS) |
| What it is | **CalAIM ECM + housing Community Supports provider** (bills Medi-Cal MCPs) **+ emerging CBO "umbrella"/regrantor** | VERIFIED (site + 990 + CalOptima/Kaiser listings) |
| Headcount | ~5 (FY24 990) / ~9 (LinkedIn 2026) | VERIFIED-ish |
| Footprint | **Orange County** (all verified ops); "California/statewide" = forward-looking | core OC VERIFIED |
| Revenue (Form 990) | FY22 $4.89M · FY23 $5.53M · **FY24 $1.27M** (−77% YoY; cause unknown) | VERIFIED (figures); cause UNVERIFIED |
| Revenue model | Primarily **Medi-Cal managed care (CalAIM ECM + CS billing)** via CalOptima + Kaiser ECM; philanthropy small (Kaiser $95K, "Housing with Heart" $60K FY24); **regrants to peers** (Mercy House, Friendship Shelter, Jamboree) | VERIFIED (990) |
| Leadership | **No confirmed current ED/CEO** (prior C-suite departed 2024–25). Board named on site. | flag — keep names OUT of client doc |
| 2024 impact (their reporting) | **2,412 members served · 92% kept permanent housing · 39% increased income (Day Hab)** | VERIFIED (their Impact page) |

---

## 02 — The CalAIM Business Model (non-obvious — worth the model diagram)

Four parties, one flow: a **referral source** (hospital/ER discharge, OC Coordinated Entry, FQHC, or the MCP's high-utilizer list) routes an eligible **Medi-Cal member** to HHOC → **HHOC delivers** ECM + housing Community Supports (navigation, deposits, tenancy/sustaining, day habilitation, short-term post-hospitalization housing) → **HHOC bills the Medi-Cal Managed Care Plan** (CalOptima in OC; Kaiser for ECM) → the **MCP pays** — and that last step is the leaky one (slow-pay/denials on anything not a "clean claim"). HHOC also **regrants/supports peer CBOs** (the umbrella role).

**Programs (their site):** Housing Navigation · Housing Deposits (up to $5,000) · Housing Sustainability & Tenancy Services · Day Habilitation · Enhanced Care Management (ECM) · Short-Term Post-Hospitalization Housing — these map exactly to CalAIM ECM + the housing Community Supports.

**Payment models (representative; MCP/county-specific — confirm actuals):** Housing Transition Navigation ~$324–449 **PMPM** (assumes ~1:35 caseload) · Housing Tenancy & Sustaining ~$413–475 **PMPM** (~1:25 caseload) · Housing Deposits **one-time** (~$5,000 cap) · Short-Term Post-Hospitalization **per diem** (~$97–119/day) · ECM separate **PMPM**. **Caseload ratios are baked into the PMPM rates → caseload optimization directly drives margin.**

---

## 03 — The Growth Equation
Three levers, each AI-addressable; all PHI-touching work is HIPAA-safe:
1. **Capture earned revenue** — bill cleanly + recover denials on services already delivered (the #1 lever; "capture, don't chase").
2. **Serve more people** — faster intake/eligibility + caseload optimization + care-coordination throughput (mission + billable volume).
3. **Win & deepen funding** — account intelligence on MCPs/counties + RFP/grant discovery + the outcomes reporting MCPs/funders require for renewals.

---

## 04 — Funding & Regulatory Landscape

### CalAIM trends 2024–2026 ("more billable services, harder to collect, less startup subsidy, looming cliff")
- **IPP (Incentive Payment Program) sunset Dec 31, 2024** — the startup subsidy era is over; programs must self-sustain on claims revenue.
- **PATH capacity-building funding** (workforce, data, billing/closed-loop-referral readiness; up to $1.44B 2022–2026) **winds down end of 2026** — but is the exact money that funds billing/data/AI-readiness work *now*.
- **Transitional Rent (15th Community Support)** — optional for MCPs Jan 1, 2025; **mandatory Jan 1, 2026** — a brand-new billable line; first-mover capture.
- **MCPs slow-pay/deny CBOs.** Statutory rule: pay 90% of *clean* claims in 30 days, 99% in 90 — but getting claims "clean" is where CBOs bleed. **This is the revenue thesis for AI.**
- **CalAIM waiver runs through Dec 31, 2026; 2027+ successor uncertain** — capture now.
- **CLRS (closed-loop referral) required of MCPs by July 1, 2025**; field weakness = MCPs bought **incompatible** CLR platforms (Unite Us, findhelp) → caseworkers juggle multiple portals. AI sits *on top of* these to reduce burden, not replace them.
- Macro tailwind: CalOptima HHIP, HHAP-6 ($760M) — CalAIM housing dollars still flowing.

### Regulatory frame — burden (AI target) vs constraint (AI guardrail)
| Regime | Burden | AI angle |
|--------|--------|----------|
| **HIPAA** | PHI on Medi-Cal members; HHOC is a Business Associate of the MCPs | **CONSTRAINT first** (BAA, encryption, access) → then reducer (HIPAA-safe documentation/coding/summarization) |
| **42 CFR Part 2** | Tighter SUD-record confidentiality; **compliance by Feb 16, 2026** | **HARD CONSTRAINT** — consent/segmentation; SUD data not to general models |
| **Medi-Cal billing/claiming integrity & audit** | Every ECM/CS claim auditable; clawback + False Claims exposure | Reducer + risk-reducer: audit-readiness, doc-to-claim matching, denial detection — **explainable, human-reviewed, no autonomous billing** |
| **HMIS** | HUD data standards, de-dup, reporting | Reducer: data-quality automation, reconcile vs MCP encounter data |
| **CalHHS Data Exchange Framework (DxF)** | Statewide health-data exchange; small/nonprofit orgs by **Jan 31, 2026** | Reducer + opportunity: participate in DxF/QHIO → faster referral intake (ADT feeds) |
| **CIE / data-sharing + consent** | Cross-org sharing gated by signed DSAs/consent | Reducer + constraint: AI drafts/tracks consents; sharing gated by agreements |
| **Fair housing** | Anti-discrimination in client/landlord matching | **CONSTRAINT:** any matching model must be bias-audited (protected classes) |

---

## 05 — Where the Growth Lives (account-based)
| Growth Pool | Who/What | How HHOC captures it |
|-------------|----------|----------------------|
| **Payer contracts (PRIMARY)** | CalOptima (OC), Kaiser ECM; other MCPs/counties on expansion | Account intelligence + outcomes MCPs require; clean billing that proves reliability |
| **Captured/recovered revenue** | The Medi-Cal claims already earned but denied/uncaptured | Billing/documentation/denial-recovery automation |
| **Grants / RFPs** | HHAP, HCD, CoC, foundations (Kaiser, etc.), CalAIM PATH | RFP/grant discovery + drafting from an evidence library |
| **Provider-network / umbrella (emerging)** | Other housing CBOs that need infrastructure/compliance | Resell the platform/standards (the 2025 HHCA pivot) — verify model |

---

## 06 — Stakeholder Personas (validate before finalizing)
Multi-stakeholder nonprofit. Matrix axis: **Influence on Funding & Sustainability × Engagement Priority.**
| # | Stakeholder | Role | Notes |
|---|-------------|------|-------|
| 1 | **Medi-Cal Managed Care Plan (CalOptima)** | The payer — funds everything | Anchor relationship to deepen; OC = single-payer COHS |
| 2 | **The Complex Medi-Cal Member** | The person served (beneficiary) | Mission core + each enrolled member = PMPM revenue |
| 3 | **The Referral Source** (hospital/ER, OC Coordinated Entry, FQHC) | Feeds eligible members in | Pipeline; DxF/QHIO ADT feeds |
| 4 | **The Care Manager / Caseworker** | Internal delivery + the throughput constraint | Caseload vs rate = margin |
| 5 | **The Funder / Foundation** (Kaiser, etc.) | Supplemental philanthropy | Smaller dollars; outcomes-driven |
| 6 | **The Partner CBO** | The umbrella/network customer (emerging) | The 2025 pivot — resell infrastructure |

---

## 07 — AI Opportunity Inventory (ranked; all PHI work HIPAA-safe)
**TIER 1 (lead here):**
1. **Medi-Cal ECM/CS claiming & billing automation** (clean claims, eligibility/auth, **denial detection & resubmission**, PMPM/per-diem/one-time logic, aging dashboards) → My Dev + My AI. Recovers earned revenue. [AUTO, high PHI] ★★★★★
2. **ECM/CS documentation & encounter-data automation** (notes → compliant encounters/care plans; flag gaps pre-claim) → My Dev + My AI. Why claims aren't "clean"; frees caseworker time. [AUTO, high PHI + Part 2] ★★★★★
3. **Caseload & capacity optimization** (staff to the rate-baked 1:35 / 1:25 ratios) → My AI. Margin driver. ★★★★★
4. **Compliance / audit-readiness monitoring** (doc-to-claim, **Part 2 consent tracking — Feb 2026**, DxF readiness) → My Security + My AI. Protects revenue. ★★★★☆

**TIER 2:**
5. **Referral intake & eligibility screening** (hospital/ER/county/MCP high-utilizer + DxF ADT feeds) → My Dev. More billable enrollments. [AUTO+LG, high PHI]
6. **Outcomes & impact reporting** (MCP performance, funder/HHAP/CoC, 990 narratives, dashboards) → My AI. Drives renewals + grants.
7. **MCP & county contract account-intelligence + RFP/grant discovery** → My AI / My AI Lead Gen. The ABM/expansion play.
8. **HMIS / data-quality automation** → My Dev. Reconcile vs MCP encounter data.

**TIER 3 / situational:** client–housing matching (bias-audited), landlord recruitment, care-coordination copilot (HIPAA-safe), multilingual member comms, donor development, AEO/SEO discoverability (referral partners + eligible clients).

**Top 5 to lead:** #1 billing/claims, #2 documentation, #3 caseload, #4 compliance/audit-readiness, #7 account-intelligence — sequenced as **"stop leaving Medi-Cal money on the table, safely."**

---

## 08 — Peers & Competitive Landscape
| Org | What | Scale | Data/AI maturity |
|-----|------|-------|------------------|
| **Illumination Foundation** (Santa Ana, OC) | Recuperative care, post-hosp housing, ECM/CS, primary/BH | ~$44M budget; saved >$17M for 1,200 CalOptima patients | **THE tech-forward OC benchmark** (claims/data/outcomes) |
| **Brilliant Corners** (statewide) | Flexible Housing Subsidy Pool TPA, navigation, landlord engagement | 15,000+ housed | **Most data/tech-forward at scale**; building centralized referral/reporting; named to Transitional Rent |
| **PATH** (statewide, OC) | Outreach, shelter, navigation, ECM | >24,000/yr; OC >$45M | Operations-heavy; **moderate tech** |
| **Mercy House** (OC, likely HHOC parent/partner) | Full continuum shelter→PSH | Regional | **Behind on tech** |
| **HealthRIGHT 360** (statewide) | Integrated BH/SUD + primary care + housing; ECM | 50+ programs, 10 counties | Clinical-data mature |
| *Unite Us / findhelp* (infra, not peers) | Closed-loop referral + billing rails (CLRS) | National | The tech layer everyone plugs into — **interoperate, don't replace** |

**Tech-forward benchmark = Brilliant Corners (systems) + Illumination Foundation (OC outcomes).** Field weakness: fragmented incompatible CLR platforms → caseworkers juggle portals. **HHOC's wedge:** it can't out-scale the leaders, but it can **out-modernize the operations-heavy peers (PATH, Mercy House)** on data/AI — which is what wins MCP contracts + outcomes — and potentially **resell that capability to its provider network** (the umbrella play).

---

## 09 — Brand & Digital Presence Audit
Squarespace site, modern/clean, recently rebranded (2025). Strengths: clear mission, an Impact page with real numbers, multi-audience nav, toll-free intake. Gaps: **`/partner` page 404s** (the core B2B value prop is broken/unbuilt); **no "For Health Plans"/RFP/procurement page** (odd for an org whose buyers are MCPs); thin outcomes data (3 stats, FY24 only); no public financials/annual report; thin content/SEO; low social profile. The presentation under-represents a CalAIM provider with real outcomes — and is a credibility gap when recruiting MCP contracts and partner CBOs.

---

## 10 — Blueprint Structural Recommendation
Profile = small mission-driven nonprofit, CalAIM/Medi-Cal, HIPAA-regulated, account-based (payer contracts), revenue thesis = capture earned revenue. Full ~16-section blueprint like VAF/SCF, but **calibrate investment DOWN** (small nonprofit) and frame growth as funding + people served.

### Sections
Cover · TOC · 01 Executive Summary · **02 The CalAIM Model — How HHOC Is Funded** (model diagram) · 03 The Growth Equation · 04 Funding & Regulatory Landscape (CalAIM trends + HIPAA/Part 2 + the HIPAA-safe constraint) · 05 Where the Growth Lives (ABM payer pools) · 06 The HHOC Stakeholders (6 personas + matrix) · 07 Peer & Competitive Landscape (scorecard + scale×AI-maturity 2×2) · 08 Brand & Digital Presence Audit · 09 Technijian Capabilities — **Proven Builds & Services (built-vs-service labeled correctly from the start)** · 10 How AI Helps HHOC Serve More & Capture More (Capture Revenue / Serve More People / Win & Comply + AI tools matrix + HIPAA-safe boundary) · 11 Impact & Service Investment · 12 Implementation Roadmap (90/180/365) · 13 Quick Wins · 14 Questions to Calibrate · 15 What Happens Next · 16 About Technijian · Appendix.

### Diagrams (5; HTML+SVG+Playwright)
- **Fig 2.0 — The CalAIM funding flow** (Referral → Member → HHOC delivers ECM/CS → bills MCP → MCP pays [leaky step]; AI band)
- **Fig 6.0 — Stakeholder Map** (Influence on Funding × Engagement Priority)
- **Fig 7.0 — Peer Positioning 2×2** (Scale/Reach × Data & AI Maturity — HHOC small/low, arrow up to out-modernize operations-heavy peers toward the Illumination/Brilliant Corners tier)
- **Fig 10.0 — AI Engine** (Capture Revenue / Serve More People / Win & Comply)
- **Fig 12.0 — 90/180/365 timeline**

### Capability Proof — built vs service (per [[feedback_capability_proof_built_vs_service]])
- **Proven Builds ("What Technijian Built")** from `services/My AI/assets/my-ai-content.txt`: **AI Document Intelligence for FINRA broker-dealers** (days→minutes, 60–80% less review) → ECM/CS documentation + claims-packet assembly + grant/RFP drafting; **Enterprise Knowledge & Memory (Weaviate + Obsidian)** → HIPAA-safe care-coordination memory / cross-system member summary + institutional knowledge.
- **Services ("The Technijian Service")**: **My Dev** (HIPAA-safe claims/billing + documentation + caseload & outcomes dashboards + referral intake), **My AI** (HIPAA-safe AI strategy/Fractional Advisor; billing/documentation/compliance automation; account intelligence), **My Security** (HIPAA + 42 CFR Part 2 Safeguards). (My SEO covered in §08/§10/investment, not a §09 box.)
- **No unverified metrics.** Use only documented results.

### Investment (calibrated DOWN for a small nonprofit; ~$91K Y1; note PATH-fundability)
| Service | Scope | Monthly | Y1 |
|---------|-------|---------|-----|
| My AI — Fractional AI Advisor (HIPAA-safe) | AI program lead + billing/documentation/compliance strategy + MCP/RFP account intelligence | $2,000 | $24,000 |
| My SEO — Referral & Funder Discoverability + Site Fix | AEO; "For Health Plans"/"Partner" pages; fix the /partner 404 (NOT consumer demand-gen) | $1,000 | $12,000 |
| My Security — HIPAA + 42 CFR Part 2 Safeguards | Required infosec program + Part 2 (Feb 2026) readiness; the entry point | $800 | $9,600 |
| My Dev — Custom Build (one-time, phased) | HIPAA-safe claims/billing + documentation/encounter capture + caseload & outcomes dashboards + referral intake | — | $40,000 |
| My AI — Executive AI Workshop + DxF/Part 2 readiness (one-time) | Leadership alignment + HIPAA-safe AI roadmap | — | $5,000 |
| **Y1 TOTAL** | Recurring $3,800/mo + builds | | **~$91,000** |

Note: billing/data/closed-loop-referral readiness + capacity building is exactly what **CalAIM PATH capacity-building funds cover through 2026** — the program may be substantially grant-offsettable, and it is designed to self-fund via recovered Medi-Cal revenue. My AI Lead Gen (deeper MCP/county/RFP account intelligence) = optional Phase-3 expansion once capture is proven.

### ROI (estimated, conservative; calibrates to actual Medi-Cal claims volume in discovery)
- Captured / recovered Medi-Cal revenue (Y1): **+$100K / +$250K / +$500K** (denials recovered + documentation gaps closed + faster, cleaner billing + caseload throughput)
- Program investment Y1: ~$91,000 → **Modeled ROI ~1.1× / 2.7× / 5.5×**
- Plus (not in the ratio): **more people served** (the mission metric), audit-risk reduction, and won/renewed contracts and grants. Heavily caveat: depends on their actual claims volume — a key discovery item (their current financials).

### Quick Wins (zero-commitment)
1. Fix the **`/partner` 404** and add a one-page **"For Health Plans / Partners"** section (the buyers are MCPs — give them a landing page).
2. **Publish 3–5 outcome metrics** prominently (they already report 2,412 served / 92% retention / 39% income) — outcomes win MCP renewals and grants.
3. **Baseline current claim denials / days-to-payment** (the capture story's starting number).
4. **Run a 42 CFR Part 2 + HIPAA readiness check** (free posture check before any AI; Feb 2026 deadline).
5. Publish one **referral-partner FAQ** ("how to refer a Medi-Cal member for ECM/housing supports") so hospitals/county can find and use them.

---

## 11 — Gaps Still Open (confirm with client — neutral discovery questions)
- [ ] **Current ED/CEO and who governs** (prior C-suite departed; possible Mercy House affiliation)
- [ ] **Current financials / what changed in FY2024**; current Medi-Cal claims volume + denial rate + days-to-payment (the ROI anchor)
- [ ] Which **MCPs/counties** they're contracted with beyond CalOptima/Kaiser; which Community Supports types
- [ ] Current **systems**: HMIS vendor, CLR platform (findhelp vs Unite Us), billing/TPA, EHR/case-management
- [ ] Caseload ratios + staffing today (margin vs the rate)
- [ ] Whether they bill Medi-Cal **directly** or are becoming a **network/standards body** for member CBOs (the AI center of gravity shifts on this)
- [ ] Is **"statewide"** real yet, or OC-only; PATH/grant funding they currently hold

---

## 12 — Sources
- Housing for Health California — housingforhealthca.org (Home, About, Services, Impact, Contact); ProPublica Nonprofit Explorer EIN 87-3137292 (Form 990 FY21–24); CauseIQ; CMS NPI Registry (1124766704); CalOptima provider listing; Kaiser Permanente ECM facility listing
- CalAIM — CHCF (Housing-Related Community Supports; Billing Better in CalAIM), DHCS (Community Supports Policy Guide Apr 2025; ECM/CS Billing Guidance; Transitional Rent; IPP; CLR FAQs), NASHP (rates), CHCS (OC recuperative-care lessons / expired-BAA story)
- Payers/regulatory — DHCS MCP-by-county; CHCF Medi-Cal Managed Care Plans by County; HHS 42 CFR Part 2 Final Rule (Feb 16, 2026); CalHHS Data Exchange Framework (DxF, QHIOs); HMIS (HUD)
- Funding — HCD HHAP-6 ($760M); Gov. Newsom $145.4M HHAP (Apr 2026); PATH; HUD CoC (2025–26 turmoil)
- Peers — Illumination Foundation (ProPublica; CHCF $17M respite); Brilliant Corners (FHSP); PATH OC (VoiceofOC); Mercy House; HealthRIGHT 360; Unite Us / findhelp (CLRS)
- Skill — `skills/technijian-biz-dev-blueprint/SKILL.md`; examples `Clients/VAF/`, `Clients/SCF/`, `Clients/ORX/`; `feedback_capability_proof_built_vs_service`
