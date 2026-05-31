---
name: technijian-pricing
description: Generate brand-compliant Technijian pricing schedules — quotes, SOW investment tables, RFP pricing exhibits, MSA Schedule A, recurring monthly recurring revenue (MRR) summaries — as XLSX or DOCX. Standardizes Technijian's service catalog, naming, units, discounts, escalators, and disclaimers. Use whenever a client-facing artifact needs numbers attached.
---

# Technijian Pricing Schedule Generator

## When to use this skill

Use this skill — and not freehand pricing — for:
- Proposal "Investment & Pricing" section
- SOW Schedule A / pricing exhibit
- MSA Schedule A (rate card)
- RFP pricing schedule (often Excel template provided by issuer)
- QBR slide 11 strategic-recommendation pricing
- One-off quote letter (with `technijian-letterhead`)
- Internal MRR rollup

## Service catalog (canonical)

The official Technijian service catalog. Every priced item must match a SKU below or follow the [Custom] convention.

### Managed IT Services pillar

| SKU | Description | Unit | Default rate (USD) | Notes |
|---|---|---|---|---|
| MIT-FULLSEAT | Full Managed Seat — endpoint + helpdesk + patching + AV | per user / month | $125–$165 | Volume-tiered; min 10 seats |
| MIT-SVRMGD | Managed Server (Win/Linux) | per server / month | $250–$350 | Includes monitoring, patching, backup verification |
| MIT-NETMGD | Managed Network Device (firewall, switch, AP) | per device / month | $35–$65 | Tiered by device class |
| MIT-VCIO | Virtual CIO services | per month | $1,500–$3,500 | Quarterly strategy, annual roadmap |
| MIT-PROJECT | Project block (planned work, scoped) | per hour | $145–$195 | Senior eng $185, Tier-2 $145 |
| MIT-AFTERHOURS | After-hours emergency | per hour | $290 | 1.5x weekday rate, 2x holiday |

### Cybersecurity pillar

| SKU | Description | Unit | Default rate (USD) | Notes |
|---|---|---|---|---|
| SEC-XDR | CrowdStrike Falcon XDR / EDR | per endpoint / month | $25–$35 | Bundled with management |
| SEC-EMAIL | Sophos Email Protection | per mailbox / month | $5–$8 | Anti-phishing + DLP |
| SEC-SOC | 24/7 SOC monitoring & response | per endpoint / month | $18–$28 | Includes monthly threat report |
| SEC-PHISH | Phishing simulation + training (KnowBe4) | per user / year | $35 | Quarterly campaigns |
| SEC-PENTEST | External penetration test | flat fee | $4,500–$12,000 | Scoped by attack surface |
| SEC-INCIDENT | Incident response (retainer) | per month | $750 | First 8 hours free; $295/hr after |

### Cloud Solutions pillar

| SKU | Description | Unit | Default rate (USD) | Notes |
|---|---|---|---|---|
| CLD-M365 | Microsoft 365 management (Business / E3 / E5) | per user / month | $8–$15 | Plus license cost passthrough |
| CLD-AZURE | Azure infrastructure management | per resource hour | $0.05–$0.20 | Compute + storage + network mgmt |
| CLD-AWS | AWS infrastructure management | per resource hour | $0.05–$0.20 | Same model as Azure |
| CLD-MIGRATION | Cloud migration project | flat (scoped) | $8,000–$60,000 | Tiered by user count + workloads |
| CLD-BACKUP | Cloud backup (Datto/Veeam) | per TB / month | $35–$55 | Cold storage tier $15/TB |

### Compliance & Business Continuity pillar

| SKU | Description | Unit | Default rate (USD) | Notes |
|---|---|---|---|---|
| CMP-HIPAA | HIPAA risk assessment + roadmap | flat fee | $4,500–$9,500 | Annual; +$2,500 quarterly tracking |
| CMP-SOC2 | SOC 2 readiness assessment | flat fee | $12,000–$28,000 | Type I + roadmap to Type II |
| CMP-PCI | PCI DSS gap assessment | flat fee | $5,500–$14,500 | Tier 4 SAQ-A through SAQ-D |
| CMP-GDPR | GDPR readiness | flat fee | $6,500–$16,000 | EU-presence dependent |
| CMP-BCDR | Business continuity / DR planning | flat fee | $4,500–$15,000 | Plan + tabletop exercise |

### Software Development & AI pillar

| SKU | Description | Unit | Default rate (USD) | Notes |
|---|---|---|---|---|
| AI-MYAI | My AI subscription (per-user copilot) | per user / month | $60–$95 | Includes Outlook/Teams/SharePoint integration |
| AI-CHATAI | Chat.AI multi-tenant SaaS | per tenant / month | $850–$2,400 | Tiered by query volume |
| AI-NEXUS | Nexus Assess + Pulse | per assessment | $3,500–$9,500 | Annual subscription option |
| AI-CUSTOM | Custom AI agent development | per hour | $185–$275 | Senior AI engineer |
| DEV-FULLSTACK | Full-stack development | per hour | $145–$210 | .NET 8, React 18, SQL Server |

### Strategic IT Consulting pillar

| SKU | Description | Unit | Default rate (USD) | Notes |
|---|---|---|---|---|
| CON-STRAT | Strategic IT planning | per engagement | $8,500–$25,000 | 3-6 month engagement |
| CON-VENDOR | Vendor selection / RFP support | flat fee | $4,500–$15,000 | Inclusive of evaluation matrix |
| CON-DUEDIL | Pre-acquisition IT due diligence | flat fee | $6,000–$22,000 | Risk + integration cost report |

## Pricing rules

### R1 — Use ranges, not single numbers, in marketing materials
Marketing collateral (brochures, datasheets, web pages) shows tiered ranges (e.g., "$125–$165/user/mo"). Single numbers go in proposals/SOWs only, after discovery.

### R2 — Volume tiering
| Tier | Seat range | Discount off list |
|---|---|---|
| Starter | 10-24 | 0% |
| Growth | 25-49 | 5% |
| Standard | 50-99 | 10% |
| Enterprise | 100-249 | 15% |
| Strategic | 250+ | Negotiated |

### R3 — Multi-year discount
- 2-year commit: additional 3% off
- 3-year commit: additional 5% off
- Auto-renew: maintains current discount

### R4 — Annual escalator
3% annual price increase on anniversary, capped at CPI + 1%. Disclose in SOW.

### R5 — Bundling
| Bundle | Includes | Bundle discount |
|---|---|---|
| **Foundation** | MIT-FULLSEAT + SEC-XDR + CLD-M365 | 8% |
| **Secure** | Foundation + SEC-EMAIL + SEC-PHISH + CMP-HIPAA | 12% |
| **Modern** | Secure + AI-MYAI + DEV-FULLSTACK block (40hr/mo) | 15% |

### R6 — Out-of-scope work
Always include "Out of Scope" section. Common exclusions:
- Hardware procurement (passthrough at cost +5%)
- Vendor third-party software (passthrough at cost)
- After-hours work (R-MIT-AFTERHOURS rate)
- Travel beyond 30 miles from Irvine HQ ($0.67/mi + travel time at 50% rate)

### R7 — Payment terms
- Default: Net 30
- Setup fees: 50% at SOW signature, 50% at go-live
- Recurring: monthly in advance, due 1st of month
- Late fee: 1.5%/month after 30 days past due

### R8 — Discounts
| Type | Default discount | Notes |
|---|---|---|
| New-logo | 5% off first 12 months | Account for first-year acquisition cost |
| Education / non-profit | 10% off list | Verify 501(c)(3) status |
| Partner referral | 5% off first 6 months | Client-side discount when a partner referred the deal. Distinct from what the partner is PAID — see R9. |
| Multi-bundle | per R5 | Stacked with volume tier |

**Maximum stacked discount: 25%.** Beyond that, escalate to Ravi.

### R9 — Channel / referral economics (what the PARTNER is paid)
Do not confuse a client-side discount (R8) with partner compensation. Two models only:
- **Referral:** partner is paid a MAX of **10% of the GROSS MONTHLY SERVICE INVOICE** — recurring services only. NOT on hardware/license passthrough, NOT on one-time/setup/project fees. Cap is 10%; lower is fine.
- **Resale:** partner buys at a wholesale rate and sets their own markup; Technijian invoices the partner, the partner invoices the end client.

Never write "10–20%", "up to 20%", or an open-ended "ongoing %" — those over-commit margin and are not policy. A deal uses one model, not both. Why: the 10%-of-gross-monthly cap is what keeps a referred account profitable after delivery cost.

## Output formats

> **Brand values are not hardcoded here.** Every color/font/contact value named below (Blue, Off White, Dark Charcoal, Core Orange) is a convenience label — read the actual hex/value from `assets/brand-tokens.json`, the single source of truth, at build time. If a token name and a cached value disagree, the JSON wins.

### A — Proposal pricing table (DOCX)

Branded table within `technijian-proposal` document:
- Blue header row (Service / Description / Quantity / Unit Rate / Monthly / Annual)
- Alternating Off White / White data rows
- Sub-totals per service pillar
- Total row with Dark Charcoal background, Core Orange amount
- "Investment Summary" callout below: monthly + annual + 3-yr TCV

### B — RFP pricing schedule (XLSX)

Many RFPs provide a fixed Excel template. Fill it; then attach a branded summary cover sheet:
- Hero number: 3-year TCV
- Bundle composition pie
- Assumptions block
- Discount stack disclosure

### C — Quote letter (DOCX with letterhead)

For one-off quotes < $25K:
- Letterhead per `technijian-letterhead` (USA or India)
- Brief intro paragraph
- Pricing table (max 6 line items)
- Terms summary (Net 30, valid 30 days, signature line)
- Quote number in format `Q-YYYY-NNNN`

### D — MRR rollup (XLSX, internal)

Per-client recurring revenue, grouped by service pillar; trailing-13-month chart; churn vs expansion classifier.

## Voice rules for pricing artifacts

1. **"Investment" not "cost".** Universal in client-facing pricing.
2. **Show the unit.** "Per user per month" not just "$125".
3. **Volume tier disclosure.** If quoted at the Growth tier, say so — gives runway for upsell.
4. **No "starting at" without showing the upper bound.** Misleading.
5. **Disclose the escalator.** "3% annual increase" stated upfront builds trust.
6. **Total cost over term.** A 3-year SOW shows year-by-year and TCV. No surprises later.
7. **Attribution for benchmarks.** If comparing to "industry average," cite the Gartner/IDC/Forrester source.
8. **Currency explicit.** "USD" or "INR" suffix on all numbers; avoid "$" alone for international clients.
9. **Numbers are real, never invented.** Every line item ties to the 2026 rate card / catalog SKU. Do not fabricate a rate to fill a cell. Where a quantity or scope is not yet confirmed, label the figure an estimate "confirmed at discovery" rather than presenting it as final.
10. **Present a blended US-led rate; never expose the offshore/India cost basis** on a client-facing page. The India delivery center lowers our cost — that is internal margin, not a client line item. Show one US-led blended rate.
11. **ROI shown alongside pricing is a RANGE, not a single number.** Give a downside-protected floor + likely + upside. Never lead the reader with a sub-1× floor optic — relabel the floor "Downside-Protected" and lead the prose/callout with the expected (~likely) case. (Full method: `technijian-roi`.)

## Anti-patterns

- "Call for pricing" on a brochure (kills lead conversion — show ranges)
- Loss-leader pricing without renewal escalator (sets unsustainable expectation)
- Mixing list and discounted in the same table without showing the math
- Discount > 25% without escalation
- Multi-bundle quote without specifying which discount stacks (R5+R8 conflict)
- Quoting partner pay as "10–20%" or an open-ended "ongoing %" (violates R9 — 10%-of-gross-monthly cap, recurring only)
- Exposing the India/offshore cost basis on a client-facing page (show one US-led blended rate)
- Inventing a rate to fill a cell, or presenting an unconfirmed scope figure as final (label estimates "confirmed at discovery")
- Declaring a generated XLSX/DOCX done without rendering and visually proofreading it (see Workflow step 7)

## Workflow

```
1. Discovery: confirm user count, sites, services in scope
2. Pick SKUs from catalog; do not invent line items
3. Apply tier (R2), bundle (R5), and other discounts (R8); stop at 25% stacked
4. Add escalator + payment terms (R4, R7)
5. Generate output format (A/B/C/D above)
6. Run technijian-voice over prose sections
7. Verify before done: render the finished XLSX/DOCX to images and visually proofread every page at display size — check totals/subtotals add up, no truncated cells or stranded rows, currency suffixes present, no India cost basis leaked. Never declare done unverified.
8. Run technijian-design-review on rendered artifact
9. Internal review (Ravi for >$50K MRR or >25% discount)
```

## Related skills

- **technijian-proposal** — embeds Format A
- **technijian-rfp** — feeds Format B
- **technijian-letterhead** — wraps Format C
- **technijian-roi** — pairs with pricing to show payback
- **technijian-qbr** — Format D feeds CEO QBR
- **technijian-voice** + **technijian-design-review** — gates
