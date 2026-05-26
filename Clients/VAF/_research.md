# VAF — VIA Auto Finance, LLC
## AI Growth Blueprint — Research File

**Client code:** VAF
**Date researched:** 2026-05-22
**Researcher:** Technijian AI research (web crawl + firmographic + competitive)
**Status:** Research complete — ready for blueprint writing
**Source pattern:** Mirrors `Clients/SCF/_research.md` and `Clients/ORX/_research.md` — research-driven, not templated.

---

## 00 — Positioning Guardrail (READ FIRST)

### A. VIA is a CUSO, not a balance-sheet subprime independent. Get this right or the whole pitch misfires.

VIA Auto Finance, LLC is a **Credit Union Service Organization (CUSO)** founded **2022**, HQ **6 Venture, Suite 295, Irvine, CA 92618**, (877) 784-2288. It **originates, underwrites, and prices prime / near-prime / super-prime indirect auto loans through car dealerships** — but the loans are **funded, booked, and serviced by its partner credit union, American Heritage Credit Union (AHCU)** (Philadelphia-area, ~$4B+). Loans are "exclusively awarded to" AHCU; the borrower becomes an AHCU member and pays AHCU. VIA is **NOT** subprime, **NOT** BHPH, **NOT** a bank, **NOT** a captive, **NOT** consumer-direct, **NOT** a refi/marketplace.

**Traction (verified):** **$350M cumulative indirect originations + ~10,000 new CU members in under 3 years** (since May 2022, per a Feb 2025 AHCU/CUInsight press release). Live in **CA, AZ, NV, TX, OK** (UT/FL/WA referenced inconsistently — unverified). Stated ambition: **20 additional states + additional credit-union partners** on the CUSO platform. ~29 employees (LinkedIn). CEO **Bob Barbee** (verified; ex-COO Symmetry Auto Finance). Other C-suite names are data-broker-sourced — **keep OUT of the client doc**.

### B. The dual-customer structure is the single most important fact.

VIA's growth = **(more dealers) × (more funded loans per dealer) × (protected ROA for the funding credit union).** It must win **dealers** (to source paper) AND keep the **funding CU** happy on ROA + credit quality + member growth. So:
- **GTM = heavily ACCOUNT-BASED (dealer acquisition).** There is **NO consumer demand-gen surface** (no apply-online, no refi marketing). The only consumer touchpoint is AHCU's payment portal.
- **Do NOT pitch consumer demand-gen, consumer SEO, or refi marketing** — VIA does not transact with consumers. That would be a mis-pitch (worse than the RKE lead-gen error). See `feedback_pitch_abm_not_leadgen`.
- The right plays: **dealer-acquisition account intelligence** (which dealers to recruit/grow), **field-sales enablement**, **dealer-portal / instant-decision UX + RouteOne/Dealertrack integration**, **internal funding-speed + verification + fraud automation** (to deliver the "higher ROA" promise), and **CUSO-partner expansion** (recruit more credit unions). "My AI Lead Gen" here = **named-dealer account intelligence**, not consumer lead-gen.

### C. AI underwriting must be EXPLAINABLE — lead with the constraint (credibility anchor).

A lender will judge Technijian on regulatory fluency. Any AI touching credit decisions must be **explainable and adverse-action-ready**:
- **ECOA / Reg B** requires **specific, accurate adverse-action reasons**. **CFPB Circular 2023-03**: creditors cannot excuse non-compliance because a model is "too complex, opaque, or novel." **Black-box ML is a non-starter.**
- **Fair-lending disparate-impact** risk is narrowing federally (CFPB final rule effective ~July 2026, but contested) — but it is **NOT eliminated**: ECOA still applies at the statute level, and **state AGs are actively enforcing** (e.g., Massachusetts AG settled a fair-lending action over an AI underwriting model, July 2025).
- **Honest framing:** "We don't sell a black box. We help VIA deploy **explainable, documented, adverse-action-ready** models — or automate the verification/compliance layer around your existing scorecards — so you get the speed and ROA upside without un-defendable fair-lending risk." **Lead with this; it signals we understand their world.**

---

## 01 — Business Snapshot

| Field | Detail | Confidence |
|-------|--------|-----------|
| Legal entity | **VIA Auto Finance, LLC** (Delaware LLC; WA foreign-LLC reg 2022-06-17) | VERIFIED (WA SoS) |
| What it is | **CUSO** — indirect auto-loan **originator/underwriter** for dealerships; loans funded + serviced by partner CU | VERIFIED |
| Founded | **2022** (operations + AHCU partnership began May 2022) | VERIFIED |
| HQ | **6 Venture, Suite 295, Irvine, CA 92618** | VERIFIED |
| Phone | Dealer/main **(877) 784-2288**; borrower servicing 800.342.0008 (AHCU line) | VERIFIED |
| Partner CU | **American Heritage Credit Union** (Philadelphia-area, ~$4B+) — funds, books, services; borrower becomes AHCU member | VERIFIED |
| Credit tier | **Prime / near-prime / super-prime** (NOT subprime, NOT BHPH) | VERIFIED (tiers stated); subprime-exclusion inferred |
| Originations | **$350M cumulative** in <3 years | VERIFIED (AHCU/CUInsight press, 2025-02-18) |
| Members created | **~10,000 new AHCU members** | VERIFIED |
| States | **CA, AZ, NV, TX, OK** live; **20 additional planned** | core 5 VERIFIED; expansion stated |
| Employees | ~29 (LinkedIn band 11–50) | LinkedIn self-report |
| Leadership | **Bob Barbee — President & CEO** (ex-COO Symmetry Auto Finance) | VERIFIED. Other names data-broker → keep OUT of client doc |
| Funding model | **CU deposits** (AHCU balance sheet) — NOT ABS-dependent | VERIFIED (no VIA securitization on record) |
| Dealer count / annual run-rate / AUM / per-loan economics | **Not disclosed** | UNVERIFIED — discovery items |

---

## 02 — The Business Model (the CUSO — non-obvious, worth a diagram)

Three parties, one loan: **Dealer** sources the deal at the F&I desk → **VIA** originates, underwrites, and prices it (near/prime), targeting "higher ROA than a traditional direct auto portfolio" → **American Heritage CU** funds, books, and services it; the borrower becomes an **AHCU member**. VIA is the dealer-acquisition + origination + underwriting engine; the credit union is the balance sheet + servicer. The CUSO lets the CU grow indirect auto loans (and members) in markets it couldn't reach organically; VIA earns CUSO economics (origination/servicing/yield-share — exact structure not public).

**Differentiators VIA already claims:** real-time/instant credit decisions; near/prime/super-prime tiers; terms to 96 months; "customized underwriting programs designed with lender risk teams"; "higher ROA"; a turnkey, repeatable CUSO platform for additional CU partners; experienced field-sales staff driving dealer relationships.

**Structural moat:** **CU deposit funding = lower cost of capital** than ABS-dependent independents (whose subprime ABS spreads widened after the 2025 Tricolor collapse). This is VIA's edge — emphasize it.

---

## 03 — Industry Context, Regulation & Trends

### Trends 2024–2026 (verified)
- **Affordability crisis:** new-vehicle ATP topped **$50,000** (Oct 2025); avg payment **>$750/mo**; new APR ~9.7%, used ~14.7%.
- **Record delinquency:** subprime **60+ DPD ~6.65%** (Oct 2025, a record); ~1.73M repossessions in 2024 (highest since 2009). Near-prime is safer, but the funding CU's ROA depends on disciplined underwriting + fraud control + early-warning servicing — all AI-addressable.
- **Consolidation / retrenchment → dealer relationships up for grabs:** Prestige stopped new originations (Nov 2025); Truist/Regional Acceptance pulled back (2023); Capital One exited dealer floorplan (2023); **Tricolor collapsed (Chapter 7, Sept 2025) amid ~$900M fraud.** Concrete argument for dealer-acquisition account intelligence (capture abandoned dealer relationships).
- **Credit-union channel is winning:** CUs were the #1 auto originator by units for 5 straight years (~2.2M loans / $62B via CUDL/Origence; ~20.6% of total auto financing). **Indirect growth is now constrained by OPERATIONAL FRICTION — lenders compete on speed, accuracy, predictability, NOT rate.** (This sentence is the bullseye for the pitch.)
- **Fintech/embedded-lending encroachment:** AutoFi, Upstart Showroom, Lendbuzz Express Contract compress deal time 50–70%; dealers increasingly expect instant, doc-light decisions.
- **Fraud:** Point Predictive — industry exposure **$9.2B (2025) → $10.4B (2026)**; income misrep = 45%; synthetic IDs +59%/yr (3–5× higher delinquency).

### Regulatory frame (include a section — heavy, and the AI thesis + constraint)
| Regime | Burden | AI angle |
|--------|--------|----------|
| **ECOA / Reg B** | Specific, accurate **adverse-action reasons**; fair lending | Auto-generate compliant reason codes — **requires explainable model** (the constraint) |
| **TILA / Reg Z** | Accurate APR/finance-charge disclosures every contract | Doc-gen + automated disclosure validation |
| **FCRA** | Permissible purpose, risk-based-pricing & adverse-action notices | Automated notice generation + dispute handling |
| **FDCPA** (collections) | Contact frequency/time/right-party rules | AI collections prioritization w/ compliant cadence (AHCU services today) |
| **GLBA + FTC Safeguards Rule** | Written infosec program; 30-day breach notice (≥500 customers) | **Technijian MSSP core — the low-friction entry point** |
| **UDAAP** | Avoid unfair/deceptive servicing | Communication QA, complaint analytics |
| **SCRA / MLA** | 6% / 36% MAPR caps; repo protections | Automated DMDC military-status checks + guardrails |
| **State licensing / rate caps** | 45 states + DC patchwork | Geo-aware rate/term rules engine + audit logging |

**Constraint to state plainly:** any AI underwriting must be **explainable, bias-tested, adverse-action-ready, and free of protected-class proxies.** Regardless of how the federal supervisory perimeter shifts (CFPB larger-participant threshold + disparate-impact rule are both in flux), **ECOA explainability + adverse-action + state AG enforcement remain.** Lead with the constraint.

---

## 04 — Competitive Landscape

| Tier | Players | Relevance |
|------|---------|-----------|
| **Direct near-prime peers** | Global Lending Services (GLS), Flagship Credit Acceptance, First Help Financial (FHF), **Veros Credit (Santa Ana — neighbor)**, **Lobel Financial (Anaheim — neighbor; DealWRITER portal + Dealertrack/RouteOne)** | HIGH — same lane / model |
| **CU-indirect / CUSO channel** | **Open Lending (Lenders Protection)**, Origence/CUDL, defi SOLUTIONS | HIGH — VIA's exact structure |
| **Deep-subprime independents (scale/ops context)** | **Westlake** (Informed.IQ: ~70% docs auto-cleared, funding <1hr — the ops-AI benchmark), Credit Acceptance, Exeter, ACA, **CPS (Irvine neighbor, AI adopter)**, UACC | MEDIUM — different tier; "what scale+tech looks like" |
| **Captives / banks (prime benchmark)** | Toyota Financial, GM Financial, Ally, Chase, Capital One | LOW-MED — set the rate floor |
| **AI-native benchmark** | **Open Lending** (channel proof: 400+ FIs, ~2M risk profiles in 5s; Sound CU yield +8%) + **Upstart** (model: instant, zero-doc, fair-lending-aware), Lendbuzz (thin-file AI), Pagaya (ABS), AutoFi (F&I UX) | BENCHMARK — "what modern looks like" |

### Gap analysis — white space VIA can own
1. **Funding moat + AI speed = uncontested.** Dealers now choose on **speed/automation, not rate.** VIA has a structural **CU-deposit cost-of-capital moat** that the AI-native players (Upstart/Open Lending) and ABS-funded independents (Westlake/Veros/Exeter) don't have — but VIA is **not yet fast/automated**. Pair the funding moat with AI funding-speed and VIA owns a corner no one else can reach.
2. **Operational friction is the real constraint.** Verification/stip automation (Informed.IQ-class: 99% accuracy <30s vs ~7-day manual) directly removes the friction the CU channel names as *the* limiter on indirect growth.
3. **Dealer relationships are up for grabs** as competitors retrench (Prestige/Truist/Tricolor) — account intelligence captures them.
4. **Digitally under-built:** dated `.php` brochure site, no public dealer portal, no stated RouteOne/Dealertrack integration (table stakes), no content/SEO, ~495 LinkedIn followers. Neighbors Lobel (DealWRITER) and CPS (AI) are ahead on this.

### Benchmarks to cite: **Open Lending + Upstart** (channel + model in VIA's exact lane); **Westlake / CPS + Informed.IQ** (ops). One structural caution: VIA is small/young — frame as "the disciplined, CU-funded challenger that out-modernizes to win dealer share," not a scale leader.

---

## 05 — Customer Persona Candidates (dual-customer model)

Buyers = dealers (primary) + the funding CU (the stakeholder VIA must retain/grow). The end borrower is context, not a marketing target. Diagram axis: **Origination Volume Potential × Strategic Value (credit quality / stickiness)** for the dealer side; the CU is a distinct stakeholder.

| # | Persona | Side | Notes |
|---|---------|------|-------|
| 1 | **Dealer Principal / GM** (franchised + independent used-car) | Dealer (primary) | Wants fast "yes," competitive structures, reliable funding; chooses lenders on speed/consistency |
| 2 | **F&I Manager** (the daily user) | Dealer (primary) | Submits deals; wants instant decisions, multiple structures per approval, fast stip clearing, easy submission (RouteOne/Dealertrack) |
| 3 | **Dealer-Group Finance Director** (multi-rooftop) | Dealer (emerging) | Higher volume; portfolio-level relationship; the anchor accounts |
| 4 | **The Funding Credit Union — American Heritage** | Funder (stakeholder) | "Customer" VIA must keep happy: ROA, credit quality, member growth, compliance |
| 5 | **Prospective CU Partner** | Funder (emerging) | Credit unions VIA wants to recruit onto the CUSO platform (the 20-state scale lever) |
| 6 | **The Near-Prime Borrower → CU Member** | End user (context) | Acquired via dealer; becomes AHCU member; experience + credit quality matter, but not a VIA marketing target |

---

## 06 — AI Opportunity Inventory (ranked by GROWTH impact)

**TIER 1 — highest growth (lead here)**
1. **Dealer-acquisition & dealer-scoring account intelligence** → My AI Lead Gen + My AI. Score/prioritize which dealerships to recruit (volume, credit mix, competitor-exit exposure, geographic whitespace in the 20-state expansion); trigger on competitor retrenchment; feed a rep CRM. **Technijian's bullseye + VIA's #1 growth lever.** ★★★★★
2. **Stipulation / income / employment verification automation** → My Dev + My AI. The proven, low-controversy win (Informed.IQ-class: 99% accuracy <30s vs ~7-day manual; Westlake auto-clears ~70% of docs, funds <1hr). Removes the operational friction; faster funding = more captured deals + the CU's "speed/accuracy/predictability" demand met. ★★★★★
3. **Fraud & synthetic-identity detection** → My AI (ScamShield lineage). Protects ROA + the CU relationship; industry exposure $10.4B (2026); income misrep 45%. ★★★★★
4. **Explainable risk-based decisioning support + fair-lending/adverse-action automation** → My AI + LLM Council QA. Tighten/expand the near-prime envelope for the "higher ROA" promise — explainable + documented, never black-box. ★★★★☆

**TIER 2 — strong growth/efficiency**
5. **Dealer-portal + instant-decision UX + RouteOne/Dealertrack integration** → My Dev. Table stakes that reinforce #1. ★★★★☆
6. **Portfolio early-warning & early-payoff/churn analytics** → My AI. Protects the CU's ROA; informs pricing. ★★★★☆
7. **GLBA / FTC Safeguards security program & monitoring** → My Security (MSSP). Required by law; the low-friction entry point that funds the relationship while AI matures. ★★★★☆
8. **Collections / servicing prioritization** → My AI (note: AHCU services today — position as shared-value or future VIA capability). ★★★☆☆

**TIER 3 — situational / longer-horizon**
9. **Loan-app / contract OCR** (bundled into #2). 10. **Borrower chatbot** (low — AHCU services). 11. **Dealer-facing B2B authority content** (modest — to attract dealers, not consumers; supports #1). 12. **AEO/SEO for consumer queries — LOW/none today** (dealer-indirect, no consumer brand; only if VIA ever goes consumer-direct). 13. **EV-financing analytics.** 14. **ABS analytics — lowest** (VIA is CU-funded, not ABS).

**Pitch spine:** Lead with **#1 (dealer account intelligence — differentiated lead-gen)** + **#2 & #3 (verification + fraud — fast, defensible ROI that protects the CU's ROA)**, anchor credibility with **#4 (explainable underwriting + fair-lending)**, use **#7 (GLBA Safeguards/MSSP)** as the low-friction entry. Benchmark to Open Lending + Upstart (channel+model) and Westlake/CPS + Informed.IQ (ops).

---

## 07 — Brand & Digital Presence Audit
Dated **`.php` brochure site** (Home/About/For Dealers/For Borrowers/Why Partner/Contact); thin content, no blog, no state/location pages, no SEO footprint. **No public dealer-portal login.** **No stated RouteOne/Dealertrack/CUDL integration** (table stakes for indirect lenders — a notable gap). Consumer payment portal is AHCU's, not VIA-branded. No Trustpilot/BBB footprint (expected — borrower relationship sits with the CU). LinkedIn ~495 followers, ~29 employees; low-activity Facebook. The presentation under-represents a CUSO that has originated $350M and created 10,000 members — and is a credibility gap when recruiting **dealers and additional CU partners.**

---

## 08 — Blueprint Structural Recommendation

VIA profile = **young, focused, B2B (dealer-facing), heavily regulated, dual-customer CUSO, expansion-stage.** Build a full ~16-section blueprint (like SCF/ORX), but calibrate scale/investment DOWN (30-person company) and frame growth as **dealer acquisition + funding-speed + protected ROA + CUSO-partner expansion** — NOT consumer marketing.

### Sections
Cover · TOC · 01 Executive Summary · **02 The Business Model — A Credit-Union-Backed CUSO** (diagram) · **03 The Growth Equation** (dealers × loans/dealer × protected ROA) · 04 Industry & Regulatory Landscape · 05 Where the Growth Lives (dealers / deeper share / CU partners / 20-state expansion — ABM) · 06 The VIA Customer (dealer personas + funding-CU stakeholder + matrix) · 07 Competitive Landscape (peers + scorecard + 2×2 + white space) · 08 Brand & Digital Presence Audit · 09 Technijian Capability Proof (5 builds) · 10 How AI Transforms VIA's Growth Engine (Win Dealers / Fund Faster & Safer / Protect & Scale + AI tools matrix + explainability boundary) · 11 Business Impact & Service Investment · 12 Implementation Roadmap (90/180/365) · 13 Quick Wins · 14 Questions to Calibrate · 15 What Happens Next · 16 About Technijian · Appendix.

### Diagrams (5; HTML+SVG+Playwright)
- **Fig 02.0 — The CUSO model** (Dealer → VIA originates/underwrites → American Heritage CU funds/services; borrower becomes member; AI acceleration band)
- **Fig 06.0 — Dealer Segment Matrix** (Origination Volume Potential × Strategic Value)
- **Fig 07.0 — Competitive Positioning 2×2** (Funding-Cost / Cost-of-Capital Advantage × Origination Speed & AI Automation — VIA bottom-right "funding moat, manual," arrow up to "moat + AI speed = uncontested")
- **Fig 10.0 — AI Growth Engine** (3 columns: WIN DEALERS / FUND FASTER & SAFER / PROTECT & SCALE)
- **Fig 12.0 — 90/180/365 timeline**

### Roadmap pacing: **90/180/365** (regulated, multi-stakeholder, integration-dependent).

### Investment calibration (smaller than SCF; ~$188K Y1)
| Service | Scope | Monthly | Y1 |
|---------|-------|---------|-----|
| My AI Lead Gen — Dealer Account Intelligence (Professional) | Named-dealer scoring/targeting + competitor-retrenchment triggers + rep CRM across the 20-state expansion | $3,499 | $42,000 |
| My AI — Fractional AI Advisor | AI program leadership + **explainable-underwriting / fair-lending governance** | $2,000 | $24,000 |
| My SEO — Dealer-Facing Authority Content + Site Modernization | B2B content to attract dealers/CU partners + refresh the dated site (NOT consumer SEO) | $1,500 | $18,000 |
| My Security — GLBA Safeguards Program & Monitoring | Required infosec program + monitoring (the low-friction entry) | $1,200 | $14,400 |
| My Dev — Managed App Services | Hosting/monitoring/optimization | $800 | $9,600 |
| My Dev — Custom Build (one-time, phased) | Stip/income verification + fraud screening + dealer-portal/instant-decision UX + RouteOne/Dealertrack integration | — | $75,000 |
| My AI — Executive AI Workshop (one-time) | Leadership alignment + fair-lending guardrails roadmap | — | $5,000 |
| **Y1 TOTAL** | Recurring $8,999/mo + builds | | **~$188,000** |

### ROI model (estimated, conservative; VIA's CUSO economics not public → illustrative)
- New active dealer relationships (Y1): **+20 / +45 / +90** (est.)
- Incremental funded originations (Y1): **+$40M / +$90M / +$180M** (est.; new dealers + faster funding/higher capture)
- Illustrative VIA economics on incremental originations* (placeholder **~1.5%** blended origination/servicing/yield-share — **TO CONFIRM in discovery**): **+$600K / +$1.35M / +$2.7M**
- Program investment Y1: ~$188,000 → **Modeled ROI ~3.2× / 7.2× / 14.4×**
- Plus: fraud losses avoided + protected CU ROA (the relationship that funds everything) + matched the speed bar that wins dealers. All figures projected, not guaranteed.

### Technijian Capability Proof — 5 builds
1. **My AI Lead Gen — Account-Based Outbound** → named-dealer account intelligence + competitor-retrenchment triggers + rep enablement across the expansion.
2. **AI Document Intelligence (FINRA questionnaires, days→minutes, 60–80% less manual review)** → stipulation/income/employment verification automation = faster funding.
3. **ScamShield + LLM Council (3-model peer review, risk scoring)** → fraud & synthetic-identity detection + explainable adverse-action / fair-lending QA (the credibility anchor — explainable, documented, not black-box).
4. **AI-Native Custom App Delivery (My Dev)** → dealer portal + instant-decision UX + RouteOne/Dealertrack integration + verification/fraud workflow.
5. **Security-first AI + GLBA/SOC2/audit (My Security / My AI governance)** → GLBA Safeguards program + audit trails + the compliance layer that makes AI underwriting deployable.

### Quick Wins (zero-commitment)
1. Modernize the dated `.php` site + add a clean **dealer-enrollment** landing page (credibility for recruiting dealers + CU partners).
2. Confirm/expose **RouteOne / Dealertrack** submission paths (table stakes dealers expect).
3. Publish one **dealer-facing authority piece** ("Why a CU-backed lender funds faster + better ROA").
4. **Baseline the current stip-clearing / time-to-fund** (the speed story's starting point).
5. Run a **fair-lending / adverse-action readiness check** on current decisioning (free posture check before any AI underwriting).

---

## 09 — Gaps Still Open (confirm with client before/while building)
- [ ] Current **active dealer count** + dealers added/month + field-rep headcount
- [ ] **Annual (vs cumulative) origination run-rate**, avg loan size, look-to-book / capture rate
- [ ] Current **time-to-fund / stip-clearing** + % manual (the speed baseline)
- [ ] **VIA's CUSO economics** (origination fee / servicing / yield share per loan) — the ROI anchor
- [ ] Current decisioning: rules-based scorecard vs any model; **adverse-action process + fair-lending testing today**
- [ ] **Fraud / synthetic-ID losses** today
- [ ] **RouteOne / Dealertrack / CUDL** integration status
- [ ] CUSO structure: **AHCU sole funder** or additional CU partners? recruitment pipeline?
- [ ] LOS / CRM / tech stack (integration surface)
- [ ] Who owns dealer marketing + the 20-state expansion plan; confirm leadership names

---

## 10 — Sources
- VIA Auto Finance — viaautofinance.com (Home, About, For Dealers, Why Partner, For Borrowers, Contact); WA SoS corporate record (legal entity)
- American Heritage CU + CUInsight press release (2025-02-18) — $350M originations / 10,000 members milestone; CUInsight company profile; CB Insights
- Robert Barbee — LinkedIn (CEO, ex-Symmetry Auto Finance); leadership (other names) data-broker (TheOrg/RocketReach/ZoomInfo — unverified, excluded from client doc)
- Competitors — Global Lending Services, Flagship, First Help Financial, Veros (OCBJ/AutoFinanceNews), Lobel (DealWRITER), Westlake (Informed.IQ/LABizJournal), Credit Acceptance, Exeter, ACA, CPS, UACC; Open Lending, Upstart, Lendbuzz, Pagaya, AutoFi
- Industry — Cox Automotive (ATP/affordability/MUVVI), Fitch/Fed (subprime delinquency), Origence/CU Management (CU channel + operational-friction thesis), Point Predictive (fraud $9.2B→$10.4B), S&P (ABS), Tricolor collapse (CNBC)
- Regulation — CFPB Circular 2023-03 (adverse-action/AI explainability); ECOA/Reg B; FTC Safeguards Rule; CFPB larger-participant proposal + disparate-impact final rule (both in flux); MA AG AI-underwriting settlement (2025); SCRA/MLA
- Skill — `skills/technijian-biz-dev-blueprint/SKILL.md`; examples `Clients/SCF/`, `Clients/ORX/`
