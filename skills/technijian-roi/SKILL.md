---
name: technijian-roi
description: Build defensible ROI / business-case models for Technijian sales conversations — downtime-cost, breach-cost-avoided, productivity-recovered, cloud-vs-onprem, MSP-vs-internal-IT, AI-time-savings. Outputs a brand-compliant XLSX model + a one-page summary HTML/PDF. Use when a prospect asks "what's the payback?" or when a proposal needs a credible cost-justification.
---

# Technijian ROI Calculator

## When to use this skill

Use this skill whenever a sales artifact needs a defensible cost-justification:
- Proposal cover-letter ROI hook
- One-pager "by the numbers" callout
- QBR slide 11 strategic recommendation with $ rationale
- Discovery-call handout
- Boardroom-ready business case for a multi-year engagement
- RFP Section "Value to Client"

## ROI model library

Each model lives as an XLSX template in `assets/roi-models/`. Inputs are highlighted in light yellow; calculated outputs in light green. Outputs feed a one-page HTML summary.

### Model 1 — Downtime cost avoided

**Formula:**
```
Annual downtime cost = (avg hours of unplanned outage / year) × (revenue per hour OR fully-loaded labor cost per hour) × (impact factor)
Avoided cost = downtime hours reduced × cost per hour
ROI = (avoided cost − Technijian investment) / Technijian investment
```

**Inputs:** revenue/hr, employees, fully-loaded comp, current outage hours/yr, target reduction.

**Default benchmarks** (cite when no client data):
- SMB downtime cost: $137–$427 per minute (Gartner / IBM)
- Avg SMB unplanned downtime: 14 hours/yr without proactive monitoring → 2 hours/yr with MSP

### Model 2 — Cyber-incident probability × impact

**Formula:**
```
Annualized loss expectancy (ALE) = Single Loss Expectancy × Annualized Rate of Occurrence
SLE = breach cost (records × $/record + recovery + downtime + reputation)
ARO = breach probability per year (industry baseline)
Risk reduction = (current ALE) − (Technijian-managed ALE)
```

**Default benchmarks:**
- IBM Cost of a Data Breach 2024: $4.88M global avg; SMB avg ~$3.31M for those with 500+ records breached
- SMB ARO without MDR: ~14% per year; with managed XDR (CrowdStrike): ~3% per year
- Per-record breach cost: $165 (US healthcare $408)

Always cite the source year and report.

### Model 3 — Internal IT vs MSP

**Formula:**
```
Internal cost = (FTE count × fully-loaded cost) + (tools licensing) + (training) + (turnover replacement amortized) + (after-hours upcharge)
MSP cost = monthly fee × 12
Net delta = Internal − MSP
```

**Hidden costs to surface:**
- 24/7 coverage requires 5+ FTEs (1 person can't do 24/7)
- Senior-engineer recruitment cost ~25% of first-year salary
- Tool licensing for a 50-user org: $40-80/user/mo across stack
- Training & certification: $5-15K/engineer/yr

### Model 4 — Cloud migration payback

**Formula:**
```
On-prem TCO = (hardware refresh / N years) + power + cooling + facility + admin time + downtime risk + opportunity cost
Cloud TCO = monthly compute + storage + egress + reserved-instance discount + admin time
Payback period = migration cost / annual savings
```

**Considerations:** depreciation tail of existing hardware, licensing portability (Windows Server, SQL CALs), egress lock-in.

### Model 5 — AI productivity recovery (My AI / Chat.AI)

**Formula:**
```
Time saved per task = (manual minutes − AI-assisted minutes) × tasks per period
Annual hours saved = time saved per task × frequency × employees affected
Annual $ saved = hours × fully-loaded labor rate
Net ROI = (annual $ saved − annual AI subscription) / annual AI subscription
```

**Calibrated benchmarks** (use only when client has done a pilot):
- Lease abstraction: 60-page lease, 2-3 hr manual → 15 min AI-assisted (8x speedup)
- Email triage: 90 min/day → 30 min/day (3x speedup) — needs Outlook/Gmail integration
- Meeting notes: 20 min/meeting → 2 min review (10x speedup)
- Code review on small PRs: 30 min → 8 min (3.75x speedup)

⚠ AI productivity claims attract scrutiny — always pair with a 30-day pilot offer to validate the numbers in their environment.

### Model 6 — Compliance penalty avoidance

**Formula:**
```
Risk of fine = max fine × probability × severity discount
Technijian compliance support reduces probability by [X]%
Avoided fine = current risk − managed risk
```

**Frameworks to draw from:**
- HIPAA: $100-$50,000 per violation, max $1.5M/yr per category
- PCI: $5K-$100K/month plus per-card fees
- GDPR: up to 4% of global annual revenue
- SOC 2: not a fine but loss of enterprise contracts

Never claim Technijian "guarantees" no fines — model risk reduction, not elimination.

## Output formats

### A — XLSX model (full)
Brand-styled spreadsheet with input cells (yellow), calc cells (locked), output cells (green), assumptions sheet, sources sheet. Use the `xlsx` skill for generation.

### B — One-page HTML/PDF summary
Single 8.5×11in page with:
- Hero: payback period (Core Blue, 96pt) + "for [Client Name]"
- 3-card row: investment / annual return / 5-year NPV
- Assumptions block (light grey, citations in 9pt)
- Sensitivity table: ROI at low/expected/high adoption
- CTA: "30-min ROI workshop with our solutions architect — 949.379.8500"

### C — Slide for proposal/QBR
A single slide with the payback hero number + 3 supporting stats + assumption footer.

## Voice rules for ROI artifacts

1. **Show the math.** Every output number traces to inputs in 2-3 steps. No black-box claims.
2. **Cite sources for benchmarks.** "Per IBM Cost of a Data Breach 2024" not "industry studies show."
3. **Distinguish hard $ from soft $.** Cost avoided (hard) vs productivity recovered (soft) — label clearly.
4. **Use "investment" not "cost."**
5. **Ranges over precision.** "$180K–$240K avoided" beats "$209,847.00 avoided" — shows you understand uncertainty.
6. **Include break-even sensitivity.** What if adoption is 50%? 25%? Buyers respect honest scenarios.
7. **No 10x/100x claims** without a pilot. AI ROI especially — ground in observed data, not vendor marketing.

## Anti-patterns (do not produce)

- "Save 90% on IT costs" with no model
- "Pays for itself in 30 days" without a downtime/breach model showing how
- ROI driven entirely by avoided breach (over-reliance on tail risk)
- 5-year NPV using a discount rate you can't justify
- ROI summary without a sources block

## Workflow

```
1. Discovery: pull from client what data points they have (revenue, headcount, current outage history, current spend)
2. Pick the model(s) that match the conversation (downtime, breach, AI, internal-vs-MSP, etc.)
3. Build the XLSX with their inputs in yellow
4. Generate the one-page HTML summary
5. Run technijian-voice over the summary
6. Run technijian-design-review on the PDF
7. Send the XLSX (so they can stress-test) + PDF (the headline)
```

## Related skills

- **technijian-proposal** — embed ROI summary in proposals
- **technijian-qbr** — Q11 strategic recs use ROI models
- **technijian-rfp** — Section "Value to Client"
- **technijian-pricing** — investment side of the equation
- **technijian-design-review** — QA gate
