# Persona × Service Mapping Matrix

**Purpose.** Resolve "which persona buys which service, at what deal size, through which motion" in a single view. Use this file for go-to-market planning, campaign targeting, territory/pod assignment, and gap analysis on the service portfolio.

**Legend.**
- **P** = Primary target (this persona is the core buyer; lead with this service)
- **S** = Secondary target (buys it as an add-on or cross-sell, not the entry offer)
- **E** = Expansion (buys it after 6 – 18 months in the account)
- **—** = Not a meaningful buyer for this service

---

## Matrix: Persona × Service

| Persona ↓ \ Service → | My IT | My Security | My Cloud | My Office | My Continuity | My Dev | My SEO | My AI | My AI Lead Gen | My Compliance (suite) | Chat.AI | Nexus Assess + Pulse | My Sip |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 Mark Tanaka — SMB Owner/CEO | **P** | S | S | S | E | — | — | E | — | E | E | S | S |
| 02 Angela Santos — Healthcare Practice Admin | **P** | **P** | S | S | **P** | — | E | E | — | **P** (HIPAA) | E (Chat.AI Healthcare) | S | S |
| 03 Brian O'Connell — Financial Services CCO | S | **P** | S | S | **P** | — | — | E | — | **P** (vCCO, SOC 2, Audit) | **P** (Chat.AI Financial Services) | **P** | — |
| 04 Greg Mahoney — Defense Mfg COO | S | **P** | S (GCC High) | E | **P** | — | — | **P** (Mfg) | — | **P** (CMMC) | S | S | — |
| 05 Priya Sharma — SaaS CTO | — | **P** | **P** | — | S | **P** (ext. engineering) | — | E | — | **P** (SOC 2) | — | **P** | — |
| 06 Catherine Weiss — Law Firm Managing Partner | **P** | **P** | S | **P** | **P** | — | E | E | — | **P** (Guardian, Vault) | E (Chat.AI + legal) | S | E |
| 07 Tom Anderson — Real Estate Brokerage Owner | **P** | S | S | **P** | S | E | **P** | **P** (Real Estate) | **P** | — | E | — |
| 08 Denise Washington — Non-Profit ED | **P** | S | **P** (email/M365) | **P** | S | — | **P** | E | — | S (grant compliance) | — | S | — |
| 09 Antonio DiMarco — Restaurant Group Owner | S | **P** (PCI) | S | S | S | — | **P** | E | S | S (PCI) | — | S | E |
| 10 Javier Torres — Construction Executive | **P** | **P** (endpoint) | **P** (Azure AD Hybrid) | **P** | S | — | S | E | **P** | — | E | — | — |
| 11 Sarah Okafor — Internal IT Director (Co-Mgd) | **P** (co-mgd) | **P** | **P** | S | S | **P** | — | E | — | S | E | **P** | — |
| 12 Jennifer Hayes — Marketing Director | — | — | — | — | — | S (landing pages) | **P** | E | **P** | — | **P** | — | — |
| 13 Terry Williams — CFO Economic Buyer | *approves all* | *approves all* | *approves all* | *approves all* | **P** (owns DR $) | — | — | — | — | **P** (owns compliance $) | — | — | — |

---

## Typical entry deal size (ARR) by persona

| Persona | Entry deal (Yr 1 ARR) | Mature deal (Yr 3 ARR) | Entry service (the "land") |
|---|---|---|---|
| 01 SMB Owner/CEO | $30K – $90K | $75K – $180K | My IT + M365 bundle |
| 02 Healthcare Practice Admin | $60K – $180K | $180K – $420K | My IT + HIPAA + My Continuity |
| 03 Financial Services CCO | $75K – $250K | $250K – $600K | My Security (SOC) + Archiving |
| 04 Defense Mfg COO | $90K – $300K | $300K – $900K | My Compliance CMMC readiness |
| 05 SaaS CTO | $40K – $150K | $150K – $500K | My Compliance SOC 2 |
| 06 Law Firm Mgmt Partner | $60K – $200K | $200K – $450K | My IT + My Office + My Security |
| 07 Real Estate Brokerage Owner | $25K – $100K | $90K – $250K | My SEO / My AI Lead Gen |
| 08 Non-Profit ED | $18K – $60K | $60K – $140K | My IT + M365 non-profit SKU |
| 09 Restaurant Group Owner | $20K – $70K | $60K – $180K | My SEO + PCI + IT |
| 10 Construction Executive | $40K – $150K | $150K – $400K | My IT + endpoint security |
| 11 Internal IT Director (Co-Mgd) | $60K – $250K | $250K – $750K | Co-Managed IT + My Security |
| 12 Marketing Director | $30K – $120K | $100K – $300K | My SEO / My AI Lead Gen |
| 13 CFO | *signs across portfolio* | *signs across portfolio* | My Continuity + My Compliance |

---

## Land → Expand paths

### 01 Mark Tanaka — SMB Owner
`My IT` → `My Office` (M365 cleanup) → `My Security` (EDR/MFA) → `My Continuity` (Veeam) → `My Compliance` if regulated → `My AI Lead Gen` if growth-focused

### 02 Angela Santos — Healthcare Practice Admin
`My IT + HIPAA` → `My Continuity` (ransomware + audit) → `My Security` (SOC, DLP for PHI) → `Chat.AI Healthcare` (clinical knowledge retrieval) → `My Dev` (EHR integrations)

### 03 Brian O'Connell — Financial Services CCO
`My Security SOC + WORM Archiving` → `My Compliance vCCO` → `Chat.AI Financial Services` (FINRA-aware governance, WORM retention) → `Nexus Assess + Pulse` (continuous pentest) → `My Cloud` (regulated workloads)

### 04 Greg Mahoney — Defense Mfg COO
`My Compliance CMMC Readiness` → `My Cloud` (GCC High enclave) → `My Security` (SIEM, CUI controls) → `My Continuity` (immutable backups) → `My AI Manufacturing` (estimating, quality, docs)

### 05 Priya Sharma — SaaS CTO
`My Compliance SOC 2 Readiness` → `My Security` (24/7 MDR) → `My Cloud` (AWS/Azure Well-Architected) → `My Dev` (extra engineering capacity) → `Nexus Assess + Pulse` (ongoing pentest)

### 06 Catherine Weiss — Law Firm Managing Partner
`My IT + M365` → `My Security` (MFA, EDR, email) → `My Compliance Guardian` (sensitive file protection) → `My Compliance Vault` (secrets) → `My Continuity` → `Chat.AI` (legal research)

### 07 Tom Anderson — Real Estate Brokerage Owner
`My AI Lead Gen` → `My SEO` → `My AI Real Estate` → `My IT + My Office` → `My Security` (endpoints + MFA)

### 08 Denise Washington — Non-Profit ED
`M365 Non-Profit (My Office)` → `My IT` → `My Cloud` (email/continuity) → `My SEO` (donor acquisition) → `My Security` (MFA + training)

### 09 Antonio DiMarco — Restaurant Group Owner
`My SEO` (traffic & reviews) → `My Security` (PCI + POS) → `My IT` (multi-site) → `My Office` → `My AI Lead Gen` (catering / private events)

### 10 Javier Torres — Construction Executive
`My AI Lead Gen` (luxury home buyer lead-gen) → `My IT + My Office` → `My Security` (endpoint + MFA) → `My Cloud` (Azure AD Hybrid) → `My Continuity`

### 11 Sarah Okafor — Internal IT Director
`Co-Managed IT` → `My Security` (24/7 MDR) → `My Cloud` (capacity + architecture) → `Nexus Assess + Pulse` (annual pentest) → `My Dev` (extra capacity)

### 12 Jennifer Hayes — Marketing Director
`My SEO` → `My AI Lead Gen` → `Chat.AI` (workflow automation) → `My Dev` (landing pages, MarTech integrations)

### 13 Terry Williams — CFO
`My Continuity` (risk / insurance) + `My Compliance` (audit) → approves further expansion as ROI is proven

---

## Sales motion by persona

| Persona | Primary motion | Secondary motion | Referral source |
|---|---|---|---|
| 01 SMB Owner | Referral, local networking (BNI, chamber, Vistage) | Outbound LinkedIn | Other SMB owners, CPAs, attorneys |
| 02 Healthcare Practice Admin | Specialty society / MGMA, CPA/consultant referral | Outbound email + HIPAA webinar | Peer practice admin, EHR vendor |
| 03 Financial Services CCO | Peer referral (RIA network), compliance consultant partner, FINRA exam prep events | RIA conferences | FSC Wealth, other RIAs |
| 04 Defense Mfg COO | DoD sub-tier events, prime contractor push-down (CMMC flowdown) | Targeted LinkedIn to COO / CISO | Prime contractor, C3PAO |
| 05 SaaS CTO | Inbound SEO ("SOC 2 readiness"), peer CTO network, VC portfolio intro | LinkedIn + community (HN, Slack) | Portfolio founders, auditor firms |
| 06 Law Firm Mgmt Partner | Bar association events, CLE sponsorship, attorney referrals | Targeted email | Other firm admins, outside counsel |
| 07 Real Estate Brokerage | Direct outbound (My AI Lead Gen demo), local realtor association | Referral from title/escrow partners | Other brokerage owners |
| 08 Non-Profit ED | Non-profit associations (OCNonprofit, CalNonprofits), TechSoup, board referral | Sponsorship at NP events | Board members, other EDs |
| 09 Restaurant Group Owner | Local restaurant association, POS vendor channel | Direct outbound on Yelp-visible brands | Other restaurant owners |
| 10 Construction Executive | Luxury home builder conferences, HBA of OC, trade-show | Direct outbound via BuildZoom lists | Architects, land-dev partners |
| 11 Internal IT Director | Co-managed RFPs, SpiceWorks, Reddit r/sysadmin, ISACA | Direct outbound + vendor-partner co-sell | CIO peer network |
| 12 Marketing Director | Inbound SEO (Technijian's own), LinkedIn, HubSpot partner ecosystem | AMA chapter events | Agency partners |
| 13 CFO | Referral up from operating buyer; AFP / CFO.com content | Sponsorship at CFO round-tables | Outside CPA, auditor |

---

## Service portfolio coverage analysis (gap-finder)

| Service | Strongest persona fit | Weakest persona fit (underserved opportunity) |
|---|---|---|
| My IT | 01, 02, 06, 10 | Hospitality (09) — low attachment; product fit is there, GTM isn't |
| My Security | 03, 04, 05, 09 (PCI), 06 | 08 non-profit — underserved, needs non-profit SKU |
| My Cloud | 04, 05, 08, 10 | 09 hospitality — limited fit until Sip pre-release ships |
| My Office | 01, 06, 08, 10 | 09 hospitality |
| My Continuity | 02, 03, 04, 06, 13 | 07 real estate — ransomware risk exists but persona doesn't prioritize |
| My Dev | 05, 11 | All others — needs a "starter" SKU for SMBs |
| My SEO | 07, 08, 09, 12 | 05 SaaS — SaaS has SEO need but Technijian positioning is local-SMB |
| My AI | 04 (Mfg), 07 (Real Estate), 01 | 03, 05, 06 — enterprise-AI packaging needed |
| My AI Lead Gen | 07, 10, 12 | 01, 09 — could expand w/ industry SKUs |
| My Compliance | 02, 03, 04, 05 | 08, 09 — light-touch compliance SKU needed |
| Chat.AI (pre-release) | 02 (Healthcare), 03 (Financial), 06 (legal research) | Productization not yet shipped to horizontal personas |
| Nexus Assess + Pulse (pre-release) | 03, 05, 11 | Early access; market TBD |
| My Sip (pre-release) | 06, 09 | Early access; market TBD |

---

## Priority tiers for 2026 GTM

**Tier 1 — primary ICP (invest heaviest)**
- 02 Healthcare Practice Administrator
- 03 Financial Services CCO
- 04 Defense Mfg COO
- 05 SaaS CTO
- 06 Law Firm Managing Partner
- 11 Internal IT Director (Co-Managed)

**Tier 2 — proven secondary ICP**
- 01 SMB Owner/CEO
- 07 Real Estate Brokerage Owner
- 10 Construction Executive
- 13 CFO (always involved, but rarely the first touch)

**Tier 3 — opportunistic / referral-driven**
- 08 Non-Profit ED
- 09 Restaurant Group Owner
- 12 Marketing Director (often inside an account led by another persona)

---

*Matrix version: 1.0 — Last reviewed: April 2026*
