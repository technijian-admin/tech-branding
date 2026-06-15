# My Jian AI Agent — V4 Collateral Build Spec (2026-06-15)
**Single source of truth for the V4 rebuild. Every builder reads this. Do NOT invent numbers — use exactly what's here. Do NOT overclaim — obey the honesty guardrails.**

Brand promise (unchanged): **"40% of name-brand price. Same protection. One platform."**
Version stamp on every doc: **V4 · Effective 2026-06-15** (FIX the old "V3.0"/"V3.1" stamps).

---

## 1. BRAND SYSTEM (identical across all docs)

- **Font:** Inter — `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`
- **Logo (only authentic source):** `https://technijian.com/wp-content/uploads/2023/08/Logo.jpg` (height 28–36px, on dark headers)
- **CSS variables (use verbatim):**
  ```
  --blue:#006DB6; --orange:#F67D4B; --dark:#1A1A2E; --teal:#1EAAC8;
  --light:#F4F8FC; --gray:#6B7280; --border:#E5EAF0;
  --jian:#7C3AED; --jian-light:#EDE9FE; --green:#15803D;
  --meraki:#0E7490; --sophos:#B45309;
  ```
- **Header style:** dark gradient `linear-gradient(135deg,var(--dark) 0%,#2D1B69 100%)`, a purple radial glow, and a 3px accent bar `linear-gradient(90deg,var(--jian),var(--teal),var(--orange))`. "My" in white-40%, "Jian" in `#A78BFA`.
- **Fixed-page pattern (match existing collateral):**
  ```
  body { font-family:'Inter',sans-serif; background:#cdd4dc; display:flex; flex-direction:column; align-items:center; gap:24px; padding:32px; }
  .page { width:8.5in; height:11in; background:#fff; overflow:hidden; box-shadow:0 4px 32px rgba(0,0,0,.18); position:relative; flex-shrink:0; display:flex; flex-direction:column; }
  @media print { html,body{margin:0;padding:0;background:#fff;display:block;} .page{box-shadow:none;break-after:page;} }
  ```
- **Contact (footer/CTA):** `sales@technijian.com` · `(949) 379-8499` · `technijian.com`
- **Tone:** confident challenger brand, transparent, verifiable. Cards/tables/colored badges, NOT walls of text. Match the existing brochure/one-pager/price-sheet visual language.

---

## 2. EXACT V4 PRICING (authoritative — copy these numbers)

### Per-user — Jian for M365 (the people/identity layer) — 3 tiers + anchor
| Tier | Monthly | Annual (2 mo free) | Position |
|---|---|---|---|
| **Jian Core** | **$9/user/mo** | $90/user/yr | Land tier — 24×7 platform |
| **Jian Plus** ⭐ NEW · "Most Popular" | **$16/user/mo** | $160/user/yr | The target tier |
| **Jian Compliance** (was "Compliance Pro") | **$24/user/mo** | $240/user/yr | Regulated verticals |
| **Enterprise / MSP** | contact sales | custom + multi-year | white-label, multi-tenant, NFR |

- **Platform minimum: $299/mo** (replaces the old bare 25-seat = $225 floor). State as "25 seats / $299/mo platform minimum."
- **Jian Teams Bot Only — $99/mo flat** (≤25 users; @Jian Teams bot only, no platform). Keep.
- **Tier contents:**
  - **Core $9:** autonomous 24×7 monitoring + triage + ticketing, @Jian Teams Self-Service bot, branded monthly report, baseline compliance evidence (HIPAA/SOC 2/PCI), MITRE-tagged events, SIEM correlation.
  - **Plus $16:** everything in Core **plus** real-time cross-platform SIEM correlation, priority shift-aware routing, expanding Tier-1 auto-remediation catalog (see honesty note), weekly reporting, lite custom @Jian skills.
  - **Compliance $24:** everything in Plus **plus** CMMC + custom frameworks (SOX/GLBA/FINRA/NIST 800-171/FedRAMP), dedicated CISSP-certified CSM, 99.5% SLA, cross-client correlator, audit-firm liaison, on-demand reports.

### Per-resource add-ons (10 SKUs) — the expansion engine
| Service | Price | Annual | Name-brand comp | % of comp |
|---|---|---|---|---|
| Jian for Firewall (per Sophos/Meraki firewall) | $99/mo | $990/yr | Arctic Wolf $300–500/site | 20–33% |
| **Jian for SQL Server (per instance)** ⭐ NEW | $99/mo | $990/yr | (no clean comp — was unsold) | — |
| Jian for vCenter (per vCenter Server) | $99/mo | $990/yr | VMware vROps Premium $150+ | 66% |
| Jian for Meraki Network (per Meraki org) | $79/mo | $790/yr | Auvik $250/site | 32% |
| **Jian for Network / SNMP Monitoring (per site)** ⭐ NEW | $79/mo | $790/yr | Auvik $250/site | 32% |
| Jian for Backup (Veeam **+ NAKIVO**, per env) | $59/mo | $590/yr | Liongard $50–100 (no NAKIVO) | 59–118%* |
| Jian for DNS (per Umbrella tenant) | $39/mo | $390/yr | Cisco Umbrella add-ons $80+ | 49% |
| Jian for Web / Cloudflare (per zone) | $29/mo | $290/yr | Cloudflare paid + labor | ~40% |
| Jian for Endpoint EDR — Workstation (overlay) | $1.50/mo | $15/yr | Huntress $6 | 25% |
| Jian for Endpoint EDR — Server (overlay) | $3.50/mo | $35/yr | Huntress $6 / CrowdStrike $10–15 | 23–58% |

\* **Backup is the one disclosed exception to the 40% rule** — Liongard is already cheap AND doesn't cover NAKIVO; Jian wins on vendor-agnostic coverage, not raw price. Always disclose.

### Starter bundles (flat-price alternative)
| Bundle | Contents | Flat | vs itemized |
|---|---|---|---|
| Jian Starter | Core 25 seats + 1 firewall + 1 backup | **$349/mo** | itemized $383 |
| Jian Pro ⭐ | Compliance 50 + 2 firewalls + 1 backup + 1 Meraki | **$1,495/mo** | itemized $1,615 |
| Jian Enterprise | Compliance 100 + 3 firewalls + 1 backup + 2 Meraki + 1 DNS | **$2,695/mo** | itemized $2,953 |
(NOTE: the operative Enterprise bundle price is **$2,695** — never $3,295.)

### Discounts (two mechanics, stack multiplicatively)
- **Annual prepay: 17% off** (2 months free) — any service/tier/bundle.
- **Volume tier (auto on monthly invoice total):** 10% at $1k–$4,999 · 15% at $5k–$14,999 · 20% at $15k–$49,999 · 25% at $50k+.
- Canonical example: $5,000/mo + annual → $5,000 × 0.85 × 0.83 = **$3,528/mo effective**.

### Entry motion (NEW — emphasize; rivals don't offer this)
- **14-day full-feature trial, no credit card.**
- **Free read-only "Jian Watch"** — watch ONE resource (e.g., a firewall) free, forever; upgrade to act.

### Worked examples (arithmetic verified — reproduce exactly)
| Profile | Build | Monthly | vs name-brand |
|---|---|---|---|
| Small — 20-user law firm | Core 25×$9 ($225) + 1 FW ($99) + 1 backup ($59) | **$383** | ~$960 → 40% |
| Medium — 50-user dental (HIPAA) | Compliance 50×$24 ($1,200) + 2 FW ($198) + 2 Meraki ($158) + 1 backup ($59) = $1,615, −10% volume | **$1,453** | ~$5,550 → 26% |
| Mid-market — 250-user multi-site | Compliance 250×$24 ($6,000) + 5 FW ($495) + 3 Meraki ($237) + 2 backup ($118) = $6,850, −15% volume | **$5,822** | ~$28,350 → 21% |

### Legacy / grandfathering (keep as-is)
- Existing **$49/mo IT Self-Service Agent** customers: grandfathered 24 months at $49 for the original bot-only feature set; upgrade to platform → V4 per-user pricing.
- Report-only legacy SKUs retained: My M365 Report $15–$129/tenant/mo (5 bands), My Meraki Report $150/org/mo, My Sophos Report $99/$199/$299/tenant/mo. Platform subscribers get equivalent reports auto-included.

---

## 3. VERIFIED FUNCTIONAL FACTS (the NEW content the client requested)

### 3a. The agent functions + cadence (all times Pacific)
| Function | What it is | Cadence | Output |
|---|---|---|---|
| **Alert** | Real-time critical-event detection (lightweight evaluators; LLM pulled in only for context) | **Every 15 min** (lower tiers 30m/1h/2h/6h) | Opens P1/P2 Client-Portal ticket + Teams channel + Adaptive Card to "Jian Alerts" |
| **Diagnose** | The judgment pass — reads the day's data through the AI gateway, decides what warrants a ticket + recommended fix + MITRE tag | **Daily 14:00 PT** (or at the 15-min Alert cadence on critical platforms) | Forensic CP ticket routed to the on-shift tech |
| **Activity** | Daily roll-up of the day's events into a per-client posture summary | **Daily 14:30 PT** | Feeds monthly reports + SIEM correlator + the learning loop |
| **Counts** | Usage/license counting — observed-vs-billed reconciliation to surface under-billing & license waste | **Observed daily 05:00 PT; Billed monthly** | Read-only count reports |

### 3b. Remediate — HONESTY GUARDRAIL (do NOT overclaim)
- **Auto-fix is gated BY DESIGN. Jian opens tickets; it does NOT silently fix client systems.**
- The only **live autonomous actions**: (1) Jian **self-healing** its own platform, (2) **M365 session revocation** on confirmed account takeover (live across tenants), and a small fixed catalog of reversible infrastructure actions (e.g., re-run stale pulls, backfill, restart backend).
- Every client-platform Tier-1 remediation requires: **7 days of clean diagnose traces matching what techs did ≥95% + explicit per-op approval + a tested rollback path.** First client-platform remediation (Sophos firewall) is **roadmapped 2026 Q2.**
- **Frame the gating as a STRENGTH:** "Jian shows you a documented audit trail proving it would have made the right call — N times — before it's ever empowered to act."
- **NEVER write "31 auto-remediations"** (that's a code-file count). **NEVER claim automatic IP blocking** (Microsoft blocks the permission; Jian emails the IP list for manual block — only session-revoke is automated).

### 3c. Compliance engine
- **31 evaluators** across **5 frameworks: HIPAA, SOC 2, CMMC, PCI-DSS + Technijian baseline** (Compliance tier adds custom: SOX/GLBA/FINRA/NIST 800-171/FedRAMP).
- **3 modes:** **Alert** — 6 critical-breach evaluators every 15 min (MFA disabled, audit log off, CA policy disabled, DMARC reverted, new mailbox forwarding rule, new Global Admin); **Diagnose** — all 31 daily 03:00 PT; **Activity** — pass/fail by framework daily 14:30 PT.
- **Produces:** continuous framework-tagged evidence, **branded monthly compliance report (DOCX)**, **append-only tamper-evident audit log**.
- **Honesty line (good to print):** evaluators return "unknown" when they can't prove a result — **"Jian never claims a control passes without evidence."**

### 3d. SIEM / correlation
- **MITRE ATT&CK:** **858 techniques · 15 tactics · 189 threat groups · 824 software**, refreshed **daily 02:00 PT** from the official MITRE STIX bundle.
- **Two modes:** **Real-time** every 15 min (1-hour window) → P1 the moment a critical correlation crosses threshold; **Retrospective** daily 14:30 PT re-scans the **prior 7 days** against the fresh catalog (catches slow-burn campaigns).
- **Correlates 5 security sources:** **Inky, Sophos, M365 Security (sign-in), CrowdStrike, Huntress.**
- **Kill-chain scoring:** maps each event to MITRE → groups by (client, day-window) → weighted tactic score → severity by how many distinct tactics fired.
- **Example kill chain (great copy):** Inky phishing email → M365 risky sign-in → CrowdStrike malicious PowerShell → Huntress scheduled task → **CRITICAL coordinated-attack ticket** that single-tool monitoring would miss.

### 3e. How Jian communicates
- **Email (Microsoft Graph, from `jian@technijian.com`):** daily **Morning Summary** (07:00 PT), **security alerts** (rich HTML: MITRE map + IP-geolocation table + AADSTS error codes in plain English + what Jian did + next steps), **user-direct notifications** (emails the affected user on their own sign-in events), **weekly autonomy report** (Mon 07:00 PT), optional branded client-facing report.
- **Microsoft Teams — the `@Jian` bot:** **channel-per-ticket** (creates `#<ticket>—<subject>`, renames `[CLOSED]` + archives on close); **Adaptive Cards** (open/update/assign/close) + a dedicated **"Jian Alerts"** channel; **two-way** (techs + requester chat in-channel, relayed to the Client Portal); a **self-service assistant** for end users (answers IT questions from a per-client RAG "brain" of ticket history + Teams files + Technijian knowledge). **Installed in 99 of 100 client Teams tenants.**
- **Client Portal tickets:** **idempotent** (dedupe key `platform:client:date:type` — never double-files), forensic context (MITRE tag + recommended fix + evidence), **shift-aware routing** (India-primary / US-fallback, after-hours handoff, L2/L3 escalation if no time entry in 4h, 3-bounce cap), **automatic billable time entries**. A CP poller runs every 2 min (CP has no webhook).
- **Approval / control loop:** escalations become **approve/deny emails** that lead with "✅ What I want to do: \<specific fix\>"; a poller reads the reply (token + anti-spoof) every 10 min and runs **only** actions from the fixed reversible catalog — **an AI model or an email reply can never run an arbitrary command.**

### 3f. Complete LIVE data-source catalog (group by layer)
| Layer | Source(s) — what flows in |
|---|---|
| **Identity / Microsoft 365** (22 workloads end-to-end) | M365 Security (risky/failed sign-ins, password spray, impossible travel, MFA), M365 Admin/Entra (app-cred expiry, PIM/roles, CA policy state), M365 Compliance (Secure Score, MFA%, audit-log state), M365 Storage (mailbox/OneDrive/SharePoint/Teams usage), M365 License (assigned-vs-used + Pax8 reconcile), M365 Apps service-health |
| **Email security / deliverability** | Inky Phish Fence (phishing, BEC, brand impersonation, user-reported, link-clicks), EasyDMARC (DMARC/SPF/DKIM posture, new sending sources) |
| **Endpoint / EDR** | CrowdStrike Falcon (malicious PowerShell, credential dumping, lateral movement, beacons), Huntress (persistence, webshells, malicious scheduled tasks, NOC escalations) |
| **Network / firewall** | Sophos Firewall (IPS hits, brute force, geo-blocks, port scans), Meraki (switch/AP health, IDS/IPS, WAN failover, config drift), OpManager network monitoring (device/interface alarms, availability), Cisco switching (port-channel/LACP, config drift) |
| **DNS** | Cisco Umbrella (DNS-layer blocks, malicious-category lookups, roaming-agent drift) |
| **Web / edge** | Cloudflare (WAF hits, L7 bot/DDoS, cert expiry, zone health) |
| **Backup / DR** | Veeam (VBR + 365 + ONE — failed sessions, malware findings, repo runway) **+ NAKIVO** (per-job status, unprotected backups, transporter load + self-heal) — vendor-agnostic |
| **Database** | Microsoft SQL Server (instance/DB health, failed jobs, blocking, backup/log status) |
| **Virtualization** | vCenter (host/datastore/VM health) |
| **Remote access** | ScreenConnect (offline agents, stale sessions, file-transfer storms) |
| **Voice** | 3CX (license/trunk/SIP health) |
| **Archiving / DLP** | MailStore (archive health), Teramind (DLP / insider-threat) |
| **Jian self-monitoring** | The Jian platform itself (self-heals; never files a client ticket) |

**ROADMAP / "built, waiting for data" — LABEL CLEARLY, do NOT market as live:** OS fleet (Windows / macOS / Linux) and network devices (switches, Wi-Fi APs, VoIP phones, printers, UPS) via the **Jian Remote Agent (Edge collector)**; client-facing read-only dashboard; auto-generated signed compliance PDFs; Jian Voice as a paid add-on.

### 3g. Headline stats (safe to print)
40+ platforms monitored (43 routes) · **858** MITRE techniques · **31** compliance evaluators across **5** frameworks · **~25K** findings/day with **99.6% resolved for $0** before any AI cost · **~45%** of proactive IT support hours eliminated · **@Jian bot in 99 of 100** client Teams tenants · **57+** managed client environments · **~254 tech-hrs/mo (~1.6 FTE)** of labor value.
**DO NOT print:** "28K decisions/day" (unverified), a hard "58 clients" (use "57+"), or "31 auto-remediations."

---

## 4. RENDER / VERIFY / PROOFREAD PROTOCOL (every builder must follow)
1. Build the HTML at the specified `assets/…` path (overwrite the existing file).
2. Render to the final PDF with Playwright (fixed-page docs use zero margins + explicit width/height):
   ```python
   page.pdf(path=PDF, width='8.5in', height='11in', print_background=True,
            margin={'top':'0','right':'0','bottom':'0','left':'0'})
   ```
3. Screenshot full_page AND per-page; **READ the screenshots**. If ANY page clips content or overflows the 11in box, or has a large empty gap, **fix density (font/padding/whitespace) and re-render until clean.** Priority: **no clipping > no whitespace** (a little whitespace beats lost content).
4. **Proofread every dollar figure and every arithmetic sum against §2 of this spec.** Confirm the three worked examples compute.
5. Confirm the version stamp reads **"V4 · Effective 2026-06-15"** and there is NO leftover "V3.0"/"V3.1"/"$3,295".
6. Report: page count, any clipping fixed, math-check confirmation.
