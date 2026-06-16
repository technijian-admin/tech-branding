# Research Brief: The Holman Group (HMG) — Co-Managed IT + Security + AI Growth & Integration

**Prospect:** The Holman Group (holmangroup.com), Canoga Park / Los Angeles CA
**Contact:** Deric Hobbie, Network Administrator · 800-321-2843 · derich@holmangroup.com *(intro listed "holemangroup.com" — TYPO; confirm correct address before send)*
**Meeting:** Ravi Jain ↔ Deric Hobbie · June 19, 2026 · 11:00 AM PT · Microsoft Teams (intro via Lewis)
**Client code:** HMG (verified unique against live Client Portal `/api/clients/active`, 67 active clients; H-codes in use = HHOC, HIT)
**Compiled:** 2026-06-16. All non-obvious claims carry an inline source; UNVERIFIED items flagged.

---

## 1. Corporate + Digital Footprint
- National **behavioral health & EAP** company, **founded 1979**, HQ **Canoga Park, CA** (PO Box 8011, Canoga Park 91309); also an **Arizona** location (LinkedIn). CEO/President **Kwasi Holman**.
- **CA Knox-Keene licensed since 1985; URAC accredited since 2015** — holds **CVO, Utilization Management (UM), and Health Network (HN)** accreditations.
- LinkedIn: **51–200 employees** band, **97 employees listed, 604 followers**, industry "Hospitals and Health Care."
- Self-describes serving **"millions of members"** for employers, associations, unions, trusts, Medicare/Medicaid managed-care, and insurance plans.
- **Services (the data/ops surface IT must protect):** EAP (3/5/8/10/20-session); managed Behavioral Health Care Plans (inpatient+outpatient); mental-health & **substance-abuse carve-outs**; **CISM** nationwide; **ASO** programs; org development, counseling, training, coaching, **drug-compliance**; **24/7/365 crisis line (800-321-2843)**.
- **Internet-facing apps (co-managed hooks):** Provider Search / "See My Plan" (`/ProviderSearch.aspx`), Provider Portal + Reserve Network Application (`/provider_portal/rna_provider.aspx`), For Members portal, Community Resources. Site references a **"QuickCap Provider Portal"** → runs a **claims / UM / authorizations** platform (QuickCap = MedVision managed-care platform — vendor mapping **INFERRED/UNVERIFIED**). Public site is **classic ASP.NET (.aspx)** → **Windows/IIS** stack, consistent with on-prem Windows servers Deric described.
- **UNVERIFIED:** Google Business Profile rating/reviews (not found); press page (legacy `.aspx` 404s); specific IT job postings / "Deric Hobbie" not indexed; ~$7.2M revenue (from intro data, not web-confirmed).

## 2. Five-Regime Compliance Load (the security/compliance backbone)
A Knox-Keene, URAC-accredited managed behavioral-health plan handling PHI sits at the intersection of FIVE regimes — a load one in-house admin cannot evidence/monitor/defend alone:
- **HIPAA Privacy + Security Rules.** ⚠️ **OCR Security Rule NPRM (Fed. Reg. Jan 6, 2025)** would **remove "addressable" vs "required,"** explicitly **require MFA**, **require encryption at rest + in transit**, and mandate **asset inventory + network map, vuln scans every 6 months, annual pen testing, 72-hour DR restoration.** Final rule expected 2025/2026. → **strongest co-managed/vCISO wedge.** (HHS OCR fact sheet)
- **42 CFR Part 2 (SUD records).** SAMHSA **final rule (eff. Apr 16, 2024)** aligned Part 2 with HIPAA, added **civil money penalties**; **enforcement active Feb 16, 2026** (now). Heightened protection for SUD counseling notes. (Federal Register; SAMHSA)
- **California CMIA.** Binds health plans + **contractors**; penalties stack: **$2,500/violation**, up to **$25,000/patient** intentional, **private right of action** ($1,000 nominal + actual + punitive + fees). **Per-record** → existential for a behavioral-health breach. (Consumer Fed of CA)
- **DMHC oversight (Knox-Keene).** Licensed/supervised by **CA Dept. of Managed Health Care**; must e-file compliance reports (Rule 1300.41.8) — regulator-facing reporting an MSP can evidence.
- **URAC accreditation = recurring audited IT/security obligations** (privacy/security/data-governance, HIPAA-compliant UM systems, staff security training, data-security pillar). Re-accreditation recurring.
- **Breach notification:** HIPAA + CA breach statute + CA AG reporting + Part 2. Encryption = the safe-harbor lever across all.

## 3. AI Use Cases (real, sourced; label projections vs measured)
- **EAP intake/triage:** benefits verification 10–20 min/new client manually; one vendor reports **+~30% intake** (vendor-reported).
- **Member/provider call center** (Holman runs a 24/7 crisis + member line): **40% interactions resolved autonomously** (Summa); **AHT −4 min, wait 14 min→44 sec** (3CLogic+ServiceNow); **95% after-hours** automation (UAMS+Luma). Claims/find-care/billing = 50–70%+ of inbound.
- **Claims processing (Holman runs QuickCap):** AI pre-submission scrubbing **−up to 70% intake-gateway cost**, **−25% processing cost in 2–3 yr** (Cognizant; analyst/vendor).
- **Prior auth / UM (Holman holds URAC UM):** gen-AI streamlines ~10-day prior auth; **admin cost −25–40%** (McKinsey).
- **Macro anchor:** McKinsey+Harvard (2023) — wider AI **$200–360B/yr** savings (5–10% of US health spend); **private payers 7–9% (~$80–110B/yr).**
- **Behavioral-health-specific, peer-reviewed:** Woebot RCT — significant PHQ-9 reduction (d≈0.44). "AI augments clinicians, never replaces."
- ⚠️ **Regulatory headwind:** several states/CMS restrict AI making prior-auth **denials** without clinician review → position AI **assistive/augmenting, never autonomous denial.** (KFF)

## 4. Co-Managed Value (~60-seat, on-prem, HIPAA, in-house IT) — "augment Deric, don't replace him"
- Internal IT works side-by-side; org **keeps strategy + institutional knowledge**, gains MSP tooling/skills/manpower "at a fraction of in-house build cost." (Level.io, Compass MSP)
- **CompTIA thesis:** primary outsourcing driver is now the **skills gap, not cost** — mid-market can't recruit/retain security+cloud specialists an MSP has at scale. ("68% of MSPs offer co-managed" = secondary blog, **UNVERIFIED**; skills-gap thesis is CompTIA's own.)
- **Healthcare angle:** continuous HIPAA monitoring; MSP owns security/compliance while in-house keeps **business apps (QuickCap claims, provider/member portals, EAP intake).**
- **What one admin physically can't staff:** 24/7 SOC/SIEM; after-hours+overflow help desk (so Deric can take PTO); security tooling at scale (EDR/MDR, email, vuln, backup); compliance-evidence production (HIPAA risk analysis, Part 2/CMIA/URAC/DMHC artifacts); project bandwidth (server refresh, M365 hardening, encryption rollout); **vCIO/vCISO** strategic layer.

## 5. Cost-Consolidation Ranges (2026) — *market-typical, NOT competitor quotes*
| Service line | Market-typical range | Note |
|---|---|---|
| Managed/Co-managed IT (per user/mo) | **$110–$400**; mid-market 50–250 users **$150–$250** | Velo, VC3 |
| 24/7 SOC / MDR | **$10–$30 / endpoint/mo**; small orgs **$1,500–$5,000/mo**; deploy $5K–$25K | UnderDefense, Expel |
| vCISO | **$3,000–$12,000/mo** (vs FT CISO $270K–$425K/yr) | SideChannel, Cynomi |
| HIPAA risk assessment / compliance | analysis $2K–$20K; gap $1.5K–$6K; ongoing $2K–$15K/yr | Secureframe, AccountableHQ |
| Email security | **~$3–$6/user/mo** (My AntiSpam $4.75 in-band) | directional |
| EDR (standalone) | **$5–$15/endpoint/mo** (folded in MDR band) | directional |
| M365/cloud backup | **~$3–$7/user/mo** | directional |
| Security-awareness training | **~$1–$5/user/mo** | directional |
> **For ~60 seats:** co-managed IT alone ≈ **$9,000–$15,000/mo** ($150–$250×60) before standalone SOC/vCISO/compliance → consolidation narrative. Label every figure "market-typical, not a quote."

## 6. Behavioral-Health Cyber Risk (the visceral case)
- Healthcare = **#1 breach cost 14 yrs running: $7.42M avg (2025)**; longest to contain (~279 days). (IBM)
- 2025: **697 large healthcare breaches, ≥61.5M individuals**; Change Healthcare alone ~192.7M. (HIPAA Journal)
- Ransomware: **211 healthcare attacks H1 2025**, avg demand **~$7M**. (Comparitech)
- Dark-web value: medical record **$250–$1,000** vs credit card $5–$25; PHI can't be cancelled.
- **Behavioral-health is weaponizable:** Vastaamo (Finland) — patients **individually extorted** with stolen therapy notes. For Holman a breach = members personally extorted with therapy/SUD records, not just a fine.

---
### Honesty rules carried into all HMG deliverables
- No invented pricing — use the market-typical ranges above (labeled) or Technijian's real rate card / published SKUs, else "scoped after assessment."
- AI = assistive/augmenting, never autonomous denial; label vendor projections as projections.
- Capability proof = anonymized scope+effort, no fabricated client outcomes.
- Lead emotional frame everywhere: **co-managed augments Deric; it does not replace him.**
- Authentic logos only (assets root files); render + eyeball before declaring done.
