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
