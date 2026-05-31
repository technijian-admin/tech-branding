---
name: technijian-qbr
description: Generate data-driven Technijian Quarterly Business Reviews — narrative-arc presentations + DOCX appendix — by pulling live ticket/uptime/security/project data and translating it into "where you were, where you are, what changed, what's next." Use for client QBRs (per-client) and for the internal CEO QBR rollup. More opinionated than technijian-report's QBR template.
---

# Technijian QBR Generator (Data-Driven)

## When to use this skill

Use **this** skill when:
- The QBR is for a real client and you have actual ticket/uptime/security data to pull from
- You need both a client-facing slide deck AND a written appendix
- You want the narrative arc (where they were → are now → at risk → planning) not just a stat dump

Use `technijian-report` (QBR template) when:
- You only have summary numbers and need a quick DOCX
- It's a one-time engagement summary, not a recurring QBR

## QBR narrative arc

Every Technijian QBR follows this 4-act structure:

```
Act 1 — Where you are        (current quarter performance)
Act 2 — How you got here      (trend lines from prior quarters)
Act 3 — What's at risk        (incidents, near-misses, capacity issues, security findings)
Act 4 — What we're doing      (planned remediations, upcoming projects, strategic recs)
```

Skip the throat-clearing intro. Start with Act 1 numbers.

## Data sources

### Per-client QBR

| Metric | Source | Pulled how |
|---|---|---|
| Uptime % | Monitoring (PRTG/Datadog/internal) | Quarterly avg of monitored device availability |
| Tickets opened/closed/avg-resolution | Helpdesk (Autotask/ConnectWise/Kaseya) | Date range filter |
| Ticket categories | Same | Group by issue type |
| Security events blocked | Sophos/CrowdStrike | Sum of detections |
| Patches applied | Datto/Kaseya/manual | Counts by patch class |
| Backups status | Veeam/Datto Continuity | Success rate, RPO/RTO |
| Projects delivered | tech-leads kb/clients/[client]/proposals/ | Filter by quarter |
| Open recommendations | Prior QBR action items | Status update each |

### CEO QBR (internal rollup)

| Metric | Source |
|---|---|
| Total clients (active, churned, new) | tech-leads kb/clients/ |
| Total ticket volume by service pillar | Helpdesk export |
| Engineer utilization | Time entries by engineer |
| Pipeline + bookings | tech-leads kb/proposals/ |
| Top 3 escalations | Helpdesk + manual notes |

## Standard slide structure (PPTX, 12 slides)

| # | Slide | Layout (per technijian-presentation) | Content |
|---|---|---|---|
| 1 | Cover | Title (dark) | "[Client] Q[N] [Year] Business Review" + dates + Technijian logo |
| 2 | Executive Summary | Content (white, header bar) | 4 bullet headlines, color-coded (Green = on track, Orange = watch, Red = risk) |
| 3 | Service Performance | Content + KPI cards | Uptime, MTTR, Ticket Volume, CSAT — large numbers, last-quarter delta |
| 4 | Where You Were | Content + chart | Trailing-4-quarter trend chart for top 3 metrics |
| 5 | Ticket Analysis | Two-column | Left: top 5 ticket categories; Right: insight on what's driving them |
| 6 | Security Posture | Content + KPI cards | Threats blocked, patches applied, vulns remediated, training completion |
| 7 | Projects Delivered | Content + table | Project, status, outcome, hours |
| 8 | What's at Risk | Section divider (blue) | Lead-in to risks |
| 9 | Risks & Watch Items | Content + table | Risk, likelihood, impact, mitigation owner, target date |
| 10 | What We're Doing | Content + numbered steps | Planned remediations + upcoming projects, color-coded by quarter |
| 11 | Strategic Recommendations | Content + 2-3 callouts | Larger plays for next 1-2 quarters (cybersecurity uplift, cloud migration, AI adoption) |
| 12 | CTA / Close | Closing (dark) | "Questions?" + next QBR date + sponsor contact |

## DOCX appendix structure (5-10 pages)

| § | Section |
|---|---|
| A1 | Detailed ticket log (all P1/P2 incidents with timeline) |
| A2 | Patch report (per-asset patching status) |
| A3 | Backup report (per-job success/failure) |
| A4 | Security event detail (per-detection summary) |
| A5 | Project change-log (any scope/cost changes) |
| A6 | Open recommendations (carried forward from prior QBR) |
| A7 | SLA performance (commitments vs actuals) |
| A8 | Investment summary (last quarter spend, projected next-quarter) |

## Brand spec

Slides: per `technijian-presentation` (Open Sans, dark cover, blue section dividers, Off White content, orange section accents, dark close).

Appendix DOCX: per `technijian-report` (Open Sans, Core Blue H1, severity-color cells, alternating row tables).

### Brand single source of truth (do not hardcode)

- All brand values — colors, fonts, logo paths, contact lines, tagline, offices — live in `assets/brand-tokens.json`. Read/sync from it at build time; the hex codes in the color table below are a cached convenience, not the source of truth.
- **Tagline:** "technology as a solution" (lowercase, no period). The old "Technology Support, Your Way." is RETIRED — never use it on a slide, footer, or appendix.
- **Contact / CTA number:** the MAIN switchboard **949.379.8499** (reaches USA + India). 949.379.8500 is Sales-direct only and 949.379.8501 is Billing-direct only — do not use either as the QBR contact/next-steps number.
- **Logos:** use the REAL logo files — full-color on light backgrounds, reverse-white on the dark cover/divider/close slides — centered. Do not recolor or stretch.
- **Two offices:** Irvine HQ (18 Technology Dr Ste 141, Irvine CA 92618) + Panchkula India delivery center.

## Build & verification mechanics

### Diagrams / trend charts (HTML + Playwright PNG → PPTX/DOCX)

When rendering the trailing-4-quarter trend charts or any custom figure:
- **Auto-crop** each exported PNG to its content plus a small uniform margin, so charts don't carry dead whitespace into the slide/appendix.
- **Derive each figure's aspect ratio from the REAL PNG pixel dimensions** — never hardcode an AR. A hardcoded AR drifts as the chart changes and distorts or strands the figure.
- For long y-axis category labels (e.g. ticket-category names), put the label in a **fixed-width bar rotated about its own center** so it can't overflow the plot area.

### DOCX appendix build (docx-js)

- **SPREAD helper functions into the children array** — `...sectionHeader(...)`, `...numberedSteps(...)` — not bare calls. A bare call makes docx emit an invalid `<0/>` token and Word refuses to open the file.
- After every build, **validate `word/document.xml` is well-formed (contains no `<0/>`)** before declaring the appendix done.

### DOCX → PDF

- Convert via `docx2pdf` (`py -3.12 docx-to-pdf.py`), **sequentially — never in parallel**. Parallel Word COM calls wedge; if it locks, clear `Normal.dotm` and retry one at a time.

### Verify before done (every output)

- Render **every** slide and every appendix page to an image and visually proofread at display size before sending — this is part of "done," not optional.
- Use a **body-region fill metric** (header/footer excluded) to catch whitespace, short pages, and stranded captions/charts. A page that passes on height can still be half-empty.

### Forwardable concept brief (companion artifact)

- Offer a **1-page executive concept brief** that distills the QBR's headline result + top risk + the recommended next play onto a single self-contained Letter page (HTML → Playwright → one page). It's what a sponsor forwards up the chain when they can't forward the full deck.

## Color discipline for QBR

| Color | Means |
|---|---|
| Green `#28A745` | On track, on/above SLA, healthy |
| Teal `#1EAAC8` | Watch — below target but not critical |
| Orange `#F67D4B` | Action required — at risk |
| Red `#CC0000` | Critical — SLA miss, P1 incident, security breach |

NEVER soften red/orange to teal to make a quarter look better. Reality reports build trust.

## Voice rules (QBR-specific)

1. **Lead with the number, then the story.** "97.2% uptime — three planned maintenance windows, one unplanned 14-min incident on April 8 caused by..."
2. **Specific dates and durations.** "April 8, 11:14 AM PT, resolved 11:28 AM PT" not "earlier this quarter."
3. **Name the cause.** "Caused by a Sophos signature update; patched same-day. Vendor postmortem attached."
4. **No marketing speak.** This is a service review, not a sales pitch. Save the upsell for slide 11.
5. **Honor commitments tracking.** Every prior-quarter commitment gets a status: Done / In Progress / Deferred (with reason).
6. **No client name in third person.** Address the client directly: "Your environment" not "[Client]'s environment."
7. **No fabrication.** Never invent metrics, quotes, case-study outcomes, or proof points to dress up a quarter. If a figure isn't confirmed, label it an estimate "confirmed at discovery." Any capability you haven't built yet (a new monitoring view, an AI rollout) is framed as a dated **near-term build**, never as already delivered. The service-uplift pieces are launching — there are no completed-client outcome metrics to cite; use anonymized industry profiles (scope + effort only).

## Strategic recommendations & CTA (slides 11–12) — conversion discipline

Slide 11 is the one place the QBR turns forward-looking and priced. Apply these so the recommendation lands without eroding the trust the prior 10 slides earned:

- **Split the ask.** Bracket a small, priced "easy yes" (e.g. the next-quarter quick win) separately from the larger strategic play, so the sponsor knows exactly what they're approving now vs. later.
- **ROI as a range, not a point.** Show very-conservative floor → likely → upside. NEVER lead with a sub-1× floor optic — relabel the floor "Downside-Protected" and lead the prose/callout with the **expected (~likely) case**.
- **Pricing from the real 2026 rate card.** Never invent numbers. Present a blended US-led rate; do NOT expose the offshore/India cost basis on a client-facing slide.
- **Right-size the comparison anchor.** An inflated "vendor stack you'd otherwise pay" or savings number REDUCES credibility — keep anchors defensible.
- **Quantify the cost of inaction** and **proactively rebut the known prior objection** rather than waiting for it in the room.
- **One dated, in-document CTA + explicit risk-reversal** on slide 12 — a real next-QBR/kickoff date and what the client risks nothing by doing, not "use the Book-a-Meeting button in my signature."
- **Quick-win on-ramp:** for clients not ready for the strategic play, the low-friction first step is a free **"Nexus Assess"** assessment (Network Detective: internal + external vulnerability scan + M365 review). Use it as the slide-12 fallback CTA.
- **Channel/referral economics (if a partner or referral appears in recs):** a referral pays the partner a MAX of **10% of the gross monthly service invoice** only (not hardware, not one-time); the alternative is a resale markup the partner sets. Never write "10–20%" or an open-ended ongoing %.

## Workflow

```
1. Confirm client + quarter; pull date range
2. Run data exports for each metric (helpdesk, monitoring, security, backups, patches, projects)
3. Generate trend charts (4-quarter trailing)
4. Identify the top 3 risks (likelihood × impact)
5. Draft 12-slide PPTX (technijian-presentation skill)
6. Draft DOCX appendix (technijian-report skill)
7. Run technijian-voice over slide notes + appendix prose
8. Run technijian-design-review on PPTX + DOCX
9. Internal review (account manager + engineering lead)
10. Send 48 hours before the meeting; arrive ready to discuss
```

## Related skills

- **technijian-presentation** — slide deck generator
- **technijian-report** — appendix DOCX generator (or use this skill's structured appendix)
- **technijian-roi** — when QBR includes cost-saved or downtime-avoided math
- **technijian-voice** — voice gates
- **technijian-design-review** — final QA
- **technijian-pricing** — for slide 11 strategic recommendations with budget
