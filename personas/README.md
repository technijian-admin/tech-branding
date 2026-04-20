# Technijian Customer Personas

**Purpose.** Authoritative, zero-vagueness buyer personas for every Technijian service. Each file defines exactly one persona with ~25 attribute blocks — identity, organization, role, goals, pains, buying behavior, objections, decision criteria, watering holes, Technijian fit, verbatim quotes, anti-persona, and risks. These are built to be copy-paste usable in sales plays, campaigns, website copy, collateral targeting, pricing, ad audiences, SDR scripts, and QBR narratives.

**Scope.** 13 personas total: 10 vertical (industry-primary decision makers) + 3 horizontal (cross-industry buyer roles that show up alongside the vertical buyer).

---

## Why this structure

Technijian sells on two axes simultaneously:

1. **Vertical axis** — regulation, operations, and language differ so radically by industry that a healthcare administrator and a defense manufacturer buy differently even when the product is the same (e.g. "cybersecurity"). Vertical personas capture this.
2. **Horizontal axis** — inside a single account, multiple people shape the purchase: the economic buyer (often CFO), the technical counterpart (internal IT Director for co-managed deals), and the growth-side buyer (Marketing Director for SEO / AI Lead Gen). Horizontal personas capture these.

A complete sales motion usually addresses one vertical persona + one or two horizontal personas together.

---

## Persona index

### Vertical personas (primary industry decision-maker)

| # | File | Persona | Industry | Typical Company Size | Primary Services |
|---|------|---------|----------|---------------------|-----------------|
| 01 | [vertical/01_smb-generalist-owner.md](vertical/01_smb-generalist-owner.md) | Mark Tanaka — SMB Owner/CEO | Professional services, general SMB | 20 – 100 emp, $5M – $30M | My IT, My Office, My Cloud, My Security |
| 02 | [vertical/02_healthcare-practice-admin.md](vertical/02_healthcare-practice-admin.md) | Angela Santos — Practice Administrator | Healthcare (multi-site clinic / medical group) | 25 – 300 emp, $5M – $60M | My IT, My Security (HIPAA), My Continuity, My Compliance HIPAA, Chat.AI Healthcare |
| 03 | [vertical/03_financial-services-compliance.md](vertical/03_financial-services-compliance.md) | Brian O'Connell — CCO / Operations Principal | Broker-Dealer, RIA, Wealth Mgmt | 15 – 200 emp, $3M – $100M AUM tier-dependent | My Security (FINRA SOC), My Continuity (WORM/archiving), My Compliance, Chat.AI Financial Services |
| 04 | [vertical/04_defense-mfg-executive.md](vertical/04_defense-mfg-executive.md) | Greg Mahoney — COO / VP Ops | Precision manufacturing, DIB (ITAR/CMMC) | 40 – 400 emp, $10M – $150M | My Compliance CMMC, My Security, My AI Manufacturing, My Cloud (GCC High) |
| 05 | [vertical/05_saas-startup-cto.md](vertical/05_saas-startup-cto.md) | Priya Sharma — CTO / Founding Engineer | B2B SaaS, Tech startup | 15 – 150 emp, Seed – Series B | My Compliance SOC 2, My Cloud (AWS/Azure), My Security, My Dev |
| 06 | [vertical/06_law-firm-managing-partner.md](vertical/06_law-firm-managing-partner.md) | Catherine Weiss — Managing Partner / Firm Administrator | Law firm (litigation, corporate, IP) | 20 – 200 attorneys, $10M – $100M | My IT, My Office, My Security, My Compliance (data protection), My Continuity |
| 07 | [vertical/07_real-estate-brokerage-owner.md](vertical/07_real-estate-brokerage-owner.md) | Tom Anderson — Brokerage / Property Mgmt Owner | Residential real estate, property mgmt | 15 – 250 agents/staff | My IT, My AI Real Estate, My AI Lead Gen, My SEO, My Office |
| 08 | [vertical/08_non-profit-executive-director.md](vertical/08_non-profit-executive-director.md) | Denise Washington — Executive Director / COO | Non-profit, social services | 10 – 100 staff, $2M – $25M budget | My IT, My Office, My Security, My Continuity, My SEO |
| 09 | [vertical/09_hospitality-restaurant-owner.md](vertical/09_hospitality-restaurant-owner.md) | Antonio DiMarco — Restaurant Group Owner | Restaurants, hospitality, QSR | 3 – 30 locations, $5M – $80M | My SEO, My IT, My Security (PCI), My Office |
| 10 | [vertical/10_construction-executive.md](vertical/10_construction-executive.md) | Javier Torres — Construction Executive / GC | Residential/commercial construction, luxury builder | 20 – 200 emp, $15M – $250M | My AI Lead Gen, My IT, My Security (endpoint), My Cloud (Azure AD Hybrid) |

### Horizontal personas (cross-industry buyer roles)

| # | File | Persona | Role | Appears In | Primary Services |
|---|------|---------|------|-----------|-----------------|
| 11 | [horizontal/11_internal-it-director-comanaged.md](horizontal/11_internal-it-director-comanaged.md) | Sarah Okafor — Internal IT Director | Co-managed IT counterpart | Mid-market 100 – 800 emp | My IT Co-Managed, My Security, My Cloud, My Dev |
| 12 | [horizontal/12_marketing-director-growth.md](horizontal/12_marketing-director-growth.md) | Jennifer Hayes — Marketing / Growth Director | Demand-generation buyer | Any growth-oriented vertical | My SEO, My AI Lead Gen, Chat.AI, My Dev |
| 13 | [horizontal/13_cfo-economic-buyer.md](horizontal/13_cfo-economic-buyer.md) | Terry Williams — CFO / Controller | Economic buyer & signatory | Mid-market across verticals | Approves all; owns My Continuity, My Compliance spend |

---

## How to use these personas

### 1. Sales enablement
- **Discovery.** Match the prospect to 1 vertical + 1 horizontal persona within the first call. Use the "Pain Points," "Triggers," and "Objections" sections as an interview script.
- **Qualification.** The "Anti-Persona / Not a Fit" section is a fast disqualifier — if 3+ of those red flags are true, decline or defer.
- **Messaging.** Lead with the top 2 pain points from the vertical persona in the opening pitch. Use verbatim quotes ("Quotes" section) to mirror their language.
- **Proposal sizing.** The "Typical Deal Size / ARR Range" and "Land → Expand Path" drive the anchor tier in SOWs.

### 2. Marketing & content
- **Campaign targeting.** LinkedIn title + industry filters come directly from the "Identity" + "Organization" fields.
- **Ad copy.** Hooks come from "Top Pain Points." CTAs come from "Triggers."
- **Collateral.** Each vertical persona maps to one industry one-pager, one case study angle, and one email sequence.
- **SEO / keyword strategy.** "Watering Holes" and "Information Sources" reveal the queries and publications to win.

### 3. Product & service design
- Pricing tiers, SLA structure, reporting formats, and contract preferences in each persona's "Buying Behavior" section are input to product packaging decisions.
- The cross-persona **SERVICE_MAPPING.md** matrix shows which services are under- or over-served by the current portfolio.

### 4. Account planning & QBRs
- "Success Metrics" + "Communication Preferences" set the QBR format and cadence per account.
- "Key Stakeholders" + "Influencers" identify the account-plan map of people to touch.

---

## Files in this folder

```
personas/
├── README.md               # This file — index, how to use
├── TEMPLATE.md             # Full attribute template (for adding new personas)
├── SERVICE_MAPPING.md      # Matrix: persona × service × fit + expected deal size
├── vertical/               # 10 industry-primary decision-maker personas
│   ├── 01_smb-generalist-owner.md
│   ├── 02_healthcare-practice-admin.md
│   ├── 03_financial-services-compliance.md
│   ├── 04_defense-mfg-executive.md
│   ├── 05_saas-startup-cto.md
│   ├── 06_law-firm-managing-partner.md
│   ├── 07_real-estate-brokerage-owner.md
│   ├── 08_non-profit-executive-director.md
│   ├── 09_hospitality-restaurant-owner.md
│   └── 10_construction-executive.md
└── horizontal/             # 3 cross-industry buyer-role personas
    ├── 11_internal-it-director-comanaged.md
    ├── 12_marketing-director-growth.md
    └── 13_cfo-economic-buyer.md
```

---

## Maintenance rules

- **Update on every deal.** When a new deal closes, scan the primary contact against the closest persona. If 4+ attributes drift, open a new persona or a sub-persona variant.
- **Review quarterly.** Every quarter, revalidate the Typical Deal Size ranges against the previous quarter's booked ARR.
- **Source citations.** Where a claim is derived from a specific Technijian case study or service one-pager, the file cites it by path (e.g. `Case Studies/Healthcare/Healthcare - Custom Software & AI Integration.pdf`). Keep those paths current.
- **Name & demographic fiction.** The names, ages, and biographical details are composites, not real people. They're written at enough specificity to feel human, but they represent a segment — not an individual.
- **Anti-persona is mandatory.** Never drop the "Not a Fit" section. Disqualification is a feature, not a gap.

---

*Last updated: April 2026 · Maintainer: Ravi Jain · rjain@technijian.com*
