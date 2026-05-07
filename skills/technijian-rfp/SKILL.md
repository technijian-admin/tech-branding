---
name: technijian-rfp
description: Run a structured 6-stage Technijian RFP-response pipeline — analyze, requirement-map, draft, voice-check, compliance-validate, assemble — producing a brand-compliant DOCX response with compliance matrix, win themes, executive summary, technical approach, pricing, and references. Use when responding to formal Requests for Proposals, government solicitations, or large-enterprise RFIs.
---

# Technijian RFP Response Pipeline

## When to use this skill

Use this skill (NOT `technijian-proposal`) when:
- Responding to a formal RFP, RFI, or RFQ document
- Government solicitation (state, local, federal — California municipalities are most common)
- Mid-market enterprise sourcing event with a vendor questionnaire
- Healthcare/financial-services procurement with a compliance attestation appendix
- Any response requiring a **compliance matrix** mapping client requirements to vendor responses

Use `technijian-proposal` for unsolicited proposals or relationship-driven sales documents without a structured RFP.

## Pipeline stages

```
Stage 1: ANALYZE        → Extract requirements, evaluation criteria, win themes from the RFP PDF
Stage 2: REQUIREMENT MAP → Build compliance matrix (Req ID, Section, Mandatory/Optional, Our Response, Evidence)
Stage 3: DRAFT          → Write each response section using the matrix and Technijian's evidence library
Stage 4: VOICE CHECK    → Run technijian-voice over every section; flag overpromises
Stage 5: COMPLIANCE     → Validate every mandatory requirement has a "Comply / Comply with explanation / Does not comply" answer
Stage 6: ASSEMBLE       → Render to DOCX with compliance matrix, executive summary, body, pricing, references, appendices
```

## Stage 1 — Analyze

Read the RFP and produce `rfp-analysis.md`:

```markdown
# RFP: [Title]
**Issuing entity:** [name]
**Due:** YYYY-MM-DD HH:MM TZ
**Submission method:** [PDF email | portal | hardcopy]
**Page limit:** [X pages]
**Award timeline:** [date]
**Estimated value:** [$ range]

## Evaluation criteria & weights
| Criterion | Weight |
|---|---|
| Technical approach | 40% |
| Past performance | 25% |
| Price | 20% |
| Small-business preference | 15% |

## Hot buttons (themes the buyer cares about)
- ...

## Win themes (what we'll emphasize)
- 25+ years continuous operation since 2000
- Pod model = single team, no ticket lottery
- 24/7 US + India coverage included, not upcharged
- Cybersecurity-first, AI-forward
- ... (tailor to RFP)

## Disqualifiers (red flags that may disqualify Technijian)
- [e.g., requires SOC 2 Type II certification — we are SOC 2 Type I]
- [e.g., requires CA-prequalified vendor list — confirm Ravi's status]

## Submission checklist
- [ ] Cover letter
- [ ] Executive summary (max X pages)
- [ ] Technical proposal
- [ ] Compliance matrix (signed)
- [ ] Pricing schedule (Excel template provided)
- [ ] References (3 minimum)
- [ ] Insurance certificates
- [ ] Past performance questionnaires
```

## Stage 2 — Requirement map

Build `compliance-matrix.csv`:

```csv
Req ID,Section,Mandatory,Requirement Text,Our Response,Evidence Reference,Risk
1.1,Scope,Yes,"Vendor shall provide 24/7 helpdesk",Comply,"§3.2 Pod Model + India operations",Low
1.2,Scope,Yes,"Vendor shall maintain SOC 2 Type II",Comply with explanation,"Type I current; Type II in progress per §6.1",Medium
2.1,SLA,Yes,"P1 incident response within 15 minutes",Comply,§4.1 SLA matrix,Low
...
```

Severity-rate each "Comply with explanation" or "Does not comply" — these are bid-risk items.

## Stage 3 — Draft sections

Standard RFP response structure (adapt to RFP-specified TOC):

| § | Section | Source |
|---|---|---|
| 1 | Cover Letter | technijian-letterhead skill |
| 2 | Executive Summary | This skill — 2-3 page win-theme narrative |
| 3 | Company Overview | brand-tokens `boilerplate.long_100w` + differentiators |
| 4 | Technical Approach | This skill — per service pillar relevant to RFP |
| 5 | Project Management & Methodology | Pod model + GSD + standard engagement model |
| 6 | Compliance & Security | technijian-report compliance template |
| 7 | Past Performance | technijian-case-study (anonymized rollups + capability stories) |
| 8 | Key Personnel | Bio cards: Ravi Jain + relevant pod members |
| 9 | Pricing | technijian-pricing skill |
| 10 | References | 3-5 verifiable references (with permission) |
| 11 | Compliance Matrix | The matrix from Stage 2 |
| 12 | Appendices | Insurance certs, W-9, business license, certifications |

## Stage 4 — Voice check

Run every section through `technijian-voice`. RFP-specific extra gates:

| Gate | Rule |
|---|---|
| RFP1 | No "guarantees" of compliance outcomes — say "implement controls that address" |
| RFP2 | No "best-of-breed" / "world-class" / "industry-leading" filler |
| RFP3 | Every claim has evidence (case study, certification, customer reference) — flag unsupported assertions |
| RFP4 | Pricing assumptions explicit ("assumes 50 users; +$X per user above 50") |
| RFP5 | No copy-paste from prior RFPs without re-validation against current RFP requirements |

## Stage 5 — Compliance validation

Before render, validate:
- Every mandatory (Yes) requirement has a non-blank Our Response cell
- Every "Does not comply" has a written explanation
- Page limits not exceeded (run page count per section)
- All RFP-required attachments included (per Stage 1 checklist)
- Pricing math correct (total = sum of line items)
- Submission method confirmed (email vs portal vs hardcopy)

## Stage 6 — Assemble

Output structure:

```
RFP-Responses/
└── [Issuer] - [RFP Title] - [YYYY-MM-DD]/
    ├── 00 - Cover Letter.pdf
    ├── 01 - Executive Summary.pdf
    ├── 02 - Technical Proposal.pdf
    ├── 03 - Compliance Matrix.xlsx
    ├── 04 - Pricing Schedule.xlsx
    ├── 05 - References.pdf
    ├── 06 - Appendices.pdf
    ├── Technijian RFP Response - [Issuer] - [date].pdf  ← combined for portal submission
    └── working/
        ├── rfp-analysis.md
        ├── compliance-matrix.csv
        ├── voice-audit.md
        └── source-rfp.pdf
```

Combined PDF assembly: use `pdf` skill to concatenate sections in order.

## Brand specs

Same as proposal/report (Open Sans, Core Blue headings, Brand Grey body). Add an RFP-specific cover page:
- Issuer logo (top-left, if provided)
- Technijian logo (top-right)
- "Response to Request for Proposal" label (Core Blue uppercase, letter-spaced)
- RFP title + RFP number
- "Submitted by: Technijian" + date
- Confidentiality notice (per RFP requirements)

## Win-rate discipline

Track in `RFP-Responses/_log.csv` for every RFP:
- Date submitted, value, win/loss, decision date, debrief notes
- Use win-rate analytics to refine Stage 1 disqualifier list over time

## Related skills

- **technijian-proposal** — for unsolicited proposals (different format)
- **technijian-pricing** — pricing schedule generator
- **technijian-case-study** — past-performance section
- **technijian-voice** — Stage 4 gates
- **technijian-design-review** — final assembly QA
- **technijian-letterhead** — cover letter
