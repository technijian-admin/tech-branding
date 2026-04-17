# Technijian Case Studies

Industry-anonymized case studies built from real Technijian engagement data
(proposals, tickets, and time-entry records). **No client names appear in any
case study** — each story is anonymized to the industry profile and any
identifying detail (company name, server hostnames, employee names) has been
stripped or replaced with role-generic language.

## Sources

Source material lives outside this repo:

- `C:/VSCode/tech-leads/tech-leads/tracking/kb/case-studies/` — 142 anonymized
  proposal-driven summaries + 59 ticket-driven 12-month activity rollups,
  organized by industry.

The `_index.md` in that folder is the authoritative catalog.

## Folder layout

```text
Case Studies/
├── README.md                       (this file)
├── generate_pdfs.py                (renders every HTML to PDF via Playwright)
├── verify_pages.py                 (per-page screenshot + overflow guard)
├── AI Development/
│   ├── assets/*.html               (source HTML, letter-sized, 2 pages)
│   └── *.pdf                       (generated)
├── Construction/
├── Cross-Industry/
├── Financial Services/
├── Healthcare/
├── Hospitality/
├── Manufacturing/
├── Non-Profit/
├── Real Estate/
└── Small Business/
```

## Case studies in this set

| Industry            | Title                                                   | Source signal                             |
|---------------------|---------------------------------------------------------|-------------------------------------------|
| AI Development      | Chat.AI Multi-Tenant Platform & GSD 14-Agent Pipeline   | Flagship capability · Chat.AI v8 handoff  |
| Healthcare          | Multi-Practice 3CX Telephony & Server Platform Ops      | 475+ tkts / 520+ hrs / 12 mo              |
| Healthcare          | Custom Software + AI Authorization Workflow             | 70 hr custom-software proposal            |
| Healthcare          | Windows 10 → Windows 11 Fleet Upgrade (18 endpoints)    | 44 hr 2-phase upgrade proposal            |
| Real Estate         | Portfolio-Wide 3CX VoIP Rollout & Endpoint Security     | 33+ engagements / 1000+ hrs               |
| Construction        | CrowdStrike Endpoint Security & Patch Management        | 325+ tkts / 340 hrs / 12 mo               |
| Construction        | Datacenter Migration + Azure AD Hybrid Identity         | 89 hr modernization + 65 hrs (12 mo)      |
| Construction        | AI Lead Generation for Luxury Home Builder              | 24 Tier-1 leads / 75-min run · 7 layers   |
| Financial Services  | Infrastructure Stability, Patching & Compliance Posture | 230+ tkts / 240+ hrs / 12 mo              |
| Manufacturing       | Server, Backup & Network Resilience Program             | 60+ tkts / 70+ hrs / 12 mo                |
| Hospitality         | Restaurant SEO, Content & WordPress Program             | 213 entries / 340 hrs / 4 mo YTD          |
| Non-Profit          | Cloud Mailbox Migration + B2B Partner Collaboration     | 26 hr migration + 99 hrs (12 mo)          |
| Small Business      | 21-User On-Prem AD → Entra ID (Azure AD) Migration      | 2× 44–50 hr cloud-migration proposals     |
| Small Business      | Server 2012 → 2022 + Hyper-V → ESXi (loaner pattern)    | 84 hr 6-phase modernization proposal      |
| Cross-Industry      | 3CX v18 → v20 Multi-Client Upgrade Pattern              | 10+ engagements / 31–32 hrs each          |

## Authoring rules (enforced)

1. **No client names.** Describe by industry + role-based attribution only
   (e.g., "a multi-practice medical group", "a regional construction
   contractor").
2. **No fabricated quotes or testimonials.** When a pull quote is used, it
   must come from a documented source or be replaced with a framed
   "representative outcome" statement.
3. **Metrics must be traceable.** Ticket counts, hours, and technical scope
   map back to the source kb files above.
4. **Brand compliance.** Uses Open Sans + the 2026 brand palette
   (`#006DB6` blue, `#F67D4B` orange, `#1EAAC8` teal, `#1A1A2E` dark,
   `#CBDB2D` chartreuse).

## Building the PDFs

```bash
cd "c:/VSCode/tech-branding/tech-branding"
python "Case Studies/generate_pdfs.py"
```

Playwright (already a repo dep) renders each `assets/*.html` to a letter-sized
PDF alongside the industry folder.
