# My Jian — Pricing & Packaging Specification

**Version:** 4 (Final — Hybrid Resource-Based, 3-Tier Per-User)
**Date:** 2026-06-15
**Owner:** rjain@technijian.com
**Scope:** Pricing for the shipping capability set (autonomous 24×7 monitoring, diagnose, activity, counts, branded reports, compliance engine, cross-vendor SIEM correlation, `@Jian` Teams bot + channel-per-ticket workflow, gated approve/deny remediation). Full Tier-1 client-platform auto-remediation, Jian Voice, and the Jian Remote Agent (Edge collector) are roadmap items, labeled as such, and priced separately when they ship.

**V4 supersedes V3.1 (2026-05-28).** Same underlying hybrid model. Changelog — what changed in V4: (1) per-user moved from two tiers to **three** — new **Jian Plus $16/user/mo** sits between Core $9 and Compliance $24, and the old "Standard"/"Compliance Pro" labels become **Jian Core** / **Jian Compliance**; (2) the bare 25-seat / $225 floor is replaced by a **$299/mo platform minimum**; (3) two new per-resource SKUs added — **Jian for SQL Server $99/instance/mo** and **Jian for Network / SNMP Monitoring $79/site/mo** (now 10 SKUs); (4) new entry motion — a **14-day full-feature trial** + a **free "Jian Watch"** single-resource tier; (5) the stale **$3,295** Enterprise-bundle reference is corrected to **$2,695**; (6) a new section, **"What Jian Does & Monitors,"** documents the functional layer (functions + cadence, compliance, SIEM, communication channels, live data-source catalog) with explicit honesty guardrails.

---

## 1. The Core Pricing Rule — "40% of Name Brand"

Mirrors the Technijian private-cloud pricing playbook against AWS / Azure: every Jian line item lists at ~40% (or less) of the equivalent name-brand competitor.

We're a challenger brand. We don't have Arctic Wolf marketing budgets or Vanta analyst coverage. We win on (1) consolidation (one platform vs. their five), (2) integration (cross-platform MITRE correlation that no comp does end-to-end), and (3) **transparent value math** — every buyer can verify per-line.

When Jian has 100+ reference customers + analyst coverage, we tighten to 50–60% of name-brand. Not before.

**Brand promise (unchanged):** *"40% of name-brand price. Same protection. One platform."*

---

## 2. The Pricing Model — Hybrid (Per-User + Per-Resource)

Two axes:

| Axis | Unit | Why this unit |
|---|---|---|
| **Per-user** | Licensed M365 user | Value scales with users — Teams `@Jian` bot deflections, license waste, M365 monitoring, compliance touchpoints |
| **Per-resource** | Per firewall / per Meraki org / per backup environment / per vCenter / per SQL instance / per monitored site / etc. | Value scales with infrastructure complexity — multi-site clients pay proportionally |

Matches existing Technijian PriceList (Sophos per-firewall + per-endpoint, Microsoft per-user, Veeam per-VM, Pax8 per-SKU). Familiar buyer mental model = lower sales friction.

---

## 3. Per-User Pricing — Jian for M365 (Three Parallel Tiers)

| Tier | Price | Annual (2 mo free) | Best for |
|---|---|---|---|
| **Jian Core** | **$9/user/mo** | **$90/user/yr** | Land tier — general SMB. Full 24×7 platform: M365 monitoring + license audit + `@Jian` Teams Self-Service bot + HIPAA/SOC 2/PCI compliance evidence + branded monthly M365 report + cross-vendor SIEM correlation + MITRE tagging + autonomous monitoring/triage/ticketing |
| **Jian Plus** ⭐ "Most Popular" | **$16/user/mo** | **$160/user/yr** | The target tier. Everything in Core PLUS real-time cross-platform SIEM correlation, priority shift-aware routing, the expanding Tier-1 auto-remediation catalog (gated — see §11), weekly reporting, and lite custom `@Jian` skills |
| **Jian Compliance** (was "Compliance Pro") | **$24/user/mo** | **$240/user/yr** | Regulated / DoD / multi-site / M&A. Everything in Plus PLUS CMMC + custom frameworks (SOX/GLBA/FINRA/NIST 800-171/FedRAMP) + dedicated CISSP-certified CSM + 99.5% SLA + cross-client correlator + audit-firm liaison + on-demand reports |
| **Enterprise / MSP** | **contact sales** | custom + multi-year | White-label, multi-tenant, NFR licensing — the channel/large-enterprise path |

**Platform minimum: $299/mo.** State on the page as **"25 seats / $299/mo platform minimum"** (a deployment requires 25 seats or fewer **plus at least one resource**, and bills at no less than $299/mo). This **replaces the old bare 25-seat = $225 Standard floor.**

**Why $299, not $225:** A bare 25-seat Core deployment (25 × $9 = $225) was **below our cost-to-serve** at the small end (see §12 — cost to serve a single client is ~$165–$315/mo, and a brand-new client carries the highest engineering-onboarding load). The $299 floor guarantees every account clears the cost-to-serve line on day one and reflects that real deployments always pair the per-user platform with at least one resource (a firewall, a backup environment, etc.). It is a floor, not a surcharge — any account whose itemized total already exceeds $299 simply pays the itemized total.

**Jian Teams Bot Only — $99/mo flat** (≤25 users; `@Jian` Microsoft Teams bot only, no platform monitoring, no compliance evidence, no branded reports). Retained — see §5.

**Why parallel tiers, not "+upgrade" add-ons:** Three prices on the page read as three products, not "is the base incomplete?" Core is fully featured and stands alone; Plus is the volume/most-popular tier with real-time correlation and the remediation catalog; Compliance adds regulatory scope and white-glove service. This is cleaner than "+$X add-on" framing and lets a rep anchor on Plus (the middle, "Most Popular" option) while Core lands the price-sensitive buyer and Compliance captures the regulated premium.

### What every Jian for M365 tier includes (Core baseline)

- Autonomous 24×7 monitoring + triage + ticketing
- M365 monitoring (sign-in risk, risky users, license waste, mailbox/OneDrive/SharePoint storage)
- M365 Apps Service Health monitoring (22 workloads: Exchange, OneDrive, SharePoint, Teams, Power BI, Power Automate, Intune, Defender, Entra, Purview, Stream, Forms, Viva, Yammer, Planner, Project, Skype, Universal Print, Windows 365, Dynamics 365, Microsoft 365 Apps)
- `@Jian` Teams Self-Service bot for ALL user seats (RAG over CP tickets + Teams files + Technijian KB)
- Channel-per-ticket Teams workflow (synced via CP poller every 2 min)
- Compliance evidence: HIPAA, SOC 2, PCI, Technijian baseline (31 evaluators run continuously)
- Branded monthly M365 DOCX report
- MITRE ATT&CK tagging on all M365 events
- Cross-vendor SIEM correlation (real-time + 7-day retrospective)
- Shift-aware ticket routing (India/US/L2-L3 cap)
- Append-only audit log

### What Jian Plus adds (the target tier)

- **Real-time cross-platform SIEM correlation** (every-15-minute correlation window, not just retrospective)
- **Priority shift-aware routing** (faster escalation handling on the on-shift queue)
- **Expanding Tier-1 auto-remediation catalog** — gated by design (7 days of clean diagnose traces ≥95% match + explicit per-op approval + tested rollback; first client-platform remediation roadmapped 2026 Q2 — see §11). Plus subscribers are first in line as catalog entries graduate.
- **Weekly reporting** (in addition to the monthly report)
- **Lite custom `@Jian` skills** (a starter set of per-client workflow shortcuts in your Teams tenant)

### What Jian Compliance adds (human + advanced scope, never "platform features turned off")

- **CMMC** compliance framework + custom frameworks (SOX, GLBA, FINRA, NIST 800-171, FedRAMP)
- **Dedicated CISSP-certified Customer Success Manager** (Ravi Jain, CISSP, fills this role for Compliance clients)
- **99.5% SLA** (specific terms stated in the MSA at contract signing)
- **Cross-client correlator** (gated, opt-in — multi-tenant pattern detection at MITRE-tactic level)
- **Learning consolidator** (weekly playbook + false-positive mining)
- **Morning summary briefing** (daily Adaptive Card + email)
- **Quarterly executive briefing**
- **Custom `@Jian` skills deployed to your Microsoft Teams workspace** (full per-client workflow automation in your own Teams tenant)
- **On-demand report generation**
- **CISSP-led audit-firm liaison** (Ravi Jain, CISSP, talks to your auditor directly)

---

## 4. Per-Resource Pricing — Jian for [Infrastructure] (10 SKUs)

| Service | Jian Price | Annual | Name-Brand Comp | % of Comp |
|---|---|---|---|---|
| **Jian for Firewall** (per Sophos/Meraki firewall) | **$99/firewall/mo** | $990/yr | Arctic Wolf MDR $300–$500/site, Sophos My Sophos $99–$299 | **20–33%** |
| **Jian for SQL Server** (per instance) ⭐ NEW | **$99/instance/mo** | $990/yr | (no clean comp — previously unsold) | **—** |
| **Jian for vCenter** (per vCenter Server) | **$99/vCenter/mo** | $990/yr | VMware vROps Premium ~$150+ | **66%** |
| **Jian for Meraki Network** (per Meraki org) | **$79/org/mo** | $790/yr | Auvik $250/site | **32%** |
| **Jian for Network / SNMP Monitoring** (per site) ⭐ NEW | **$79/site/mo** | $790/yr | Auvik $250/site | **32%** |
| **Jian for Backup** (per Veeam VBR / 365 / ONE / **NAKIVO** env — vendor-agnostic) | **$59/env/mo** | $590/yr | Liongard $50–$100/client (no NAKIVO) | **59–118%** *(see exception note below)* |
| **Jian for DNS** (per Cisco Umbrella tenant) | **$39/tenant/mo** | $390/yr | Cisco Umbrella reporting add-ons ~$80+ | **49%** |
| **Jian for Web / Cloudflare** (per Cloudflare zone) | **$29/zone/mo** | $290/yr | Cloudflare paid + manual labor | **~40%** |
| **Jian for Endpoint EDR — Workstation** (overlay your EDR vendor) | **$1.50/workstation/mo** | $15/yr | Huntress $6/desktop | **25%** |
| **Jian for Endpoint EDR — Server** (overlay your EDR vendor) | **$3.50/server/mo** | $35/yr | Huntress $6/server, CrowdStrike $10–$15 | **23–58%** |

**New in V4:**

- **Jian for SQL Server** ($99/instance/mo) — monitors instance/DB health, failed SQL Agent jobs, blocking chains, and backup/transaction-log status. There is no clean name-brand comp at this price point; this data source was previously collected but unsold.
- **Jian for Network / SNMP Monitoring** ($79/site/mo) — SNMP-based device/interface/availability monitoring (OpManager-style) for switches, network appliances, and infrastructure per physical site. Comps to Auvik at $250/site → 32%.

### Backup line exception (transparent)

Jian for Backup at $59 vs. Liongard at $50–$100 = **59–118% of comp**, which breaks our 40% promise. We hold $59 because:

1. **Liongard is already a discount product** — pricing Jian at 40% would mean ~$20/mo, below cost-to-serve.
2. **NAKIVO support is unique** — Liongard doesn't cover NAKIVO. Veeam ONE Reporter only covers Veeam. Jian bridges both at one rate.
3. **We win on integration**, not raw price, on this one line.

This exception is **stated explicitly in the brochure** so a procurement audit doesn't catch us being inconsistent.

---

## 5. Bot-Only SKU (For Buyers Who Just Want `@Jian` in Teams)

| Tier | Price | Cap | Best for |
|---|---|---|---|
| **Jian Teams Bot Only** | **$99/mo flat** | Up to 25 users | The 5–25-seat client who wants the `@Jian` Microsoft Teams bot and nothing else. No platform monitoring, no compliance evidence, no branded reports. |

This is the bot-only "entry SKU" for the truly small SMB. Replaces the V1 $49 IT Self-Service Agent (which is grandfathered for existing customers — see §9). Any client that wants real platform monitoring moves to **Jian Core** and clears the **$299/mo platform minimum** (see §3).

---

## 6. Starter Bundles (For "Just Give Me One Number" Buyers)

For SMBs who don't want to think about line items. Flat monthly price, small discount vs. itemized.

| Bundle | What's in it | Flat price | vs. itemized |
|---|---|---|---|
| **Jian Starter** | Core 25 seats + 1 firewall + 1 backup environment | **$349/mo flat** | itemized $383 (saves $34, –9%) |
| **Jian Pro Bundle** ⭐ | Compliance 50 seats + 2 firewalls + 1 backup + 1 Meraki org | **$1,495/mo flat** | itemized $1,615 (saves $120, –7%) |
| **Jian Enterprise Bundle** | Compliance 100 seats + 3 firewalls + 1 backup + 2 Meraki orgs + 1 DNS | **$2,695/mo flat** | itemized $2,953 (saves $258, –8.7%) |

**The operative Enterprise bundle price is $2,695 — never $3,295.**

These are NOT replacements for the line-item pricing — they're an *alternative path* for the buyer who wants one number. Sales rep offers either: "You can quote line-by-line, or we have these three bundles." Most buyers will choose the bundle that fits, especially in the SMB segment.

---

## 7. Entry Motion (NEW in V4 — rivals don't offer this)

Two low-friction ways in, both designed to remove the "prove it first" objection:

| Motion | What it is | Why it converts |
|---|---|---|
| **14-day full-feature trial** | Full platform, every feature, **no credit card.** Connect your APIs and watch Jian work for two weeks. | Most MDR/compliance competitors take a week just to produce a *quote*. We're delivering live findings before they've sent paper. |
| **Free "Jian Watch"** | A **free, read-only, single-resource** tier — point Jian at ONE resource (e.g., one firewall) and it watches it free, **forever.** Upgrade to a paid tier when you want Jian to *act*, correlate across sources, or add seats/resources. | Zero-risk land. The buyer sees real value on their own infrastructure, then expands. "Watch one firewall free; upgrade to act." |

**Sales framing:** Land with Jian Watch or the 14-day trial → prove value on the customer's own data → expand to Core/Plus/Compliance + resources. The free Watch tier is single-resource and read-only on purpose; it is the top of the expansion funnel, not a substitute for the platform.

---

## 8. Simplified Discount Structure (Two Mechanics Only)

Two stacking discounts (carried forward from V3.1):

| Mechanic | Discount |
|---|---|
| **Annual prepay** (any service, any tier, any bundle) | **17% off** (2 months free; effectively monthly × 10 = annual) |
| **Volume tier** (based on total monthly invoice, auto-applied) | 0% under $1,000/mo; **10%** at $1,000–$4,999; **15%** at $5,000–$14,999; **20%** at $15,000–$49,999; **25%** at $50,000+/mo |

**Discounts stack multiplicatively.** Canonical example: a $5,000/mo client on annual prepay pays $5,000 × 0.85 (15% volume) × 0.83 (17% annual) = **$3,528/mo effective.** CFO can verify the math in 10 seconds.

---

## 9. Resource Definitions (Glossary)

Pre-empts every "wait, what counts as a..." conversation at quote time.

| Term | Definition |
|---|---|
| **Firewall** | One managed Sophos or Meraki firewall appliance. HA pair = 1 unit. Multi-WAN on one appliance = 1 unit. |
| **SQL Server instance** | One Microsoft SQL Server instance (named or default), regardless of the number of databases hosted on it. |
| **Meraki organization** | One Meraki dashboard organization, regardless of number of networks or devices within it. |
| **Monitored site (SNMP)** | One physical site / network location monitored over SNMP (switches, appliances, infrastructure devices at that location). |
| **Backup environment** | One Veeam VBR Server, OR one Veeam 365 tenant, OR one Veeam ONE Reporter Server, OR one NAKIVO Director instance. Mix and match within a client at $59 each. |
| **Cloudflare zone** | One apex domain (e.g., `example.com`). All subdomains (`*.example.com`) included free. |
| **vCenter** | One vCenter Server instance. vCenter Enhanced Linked Mode counts as 1 unit per Platform Services Controller. |
| **Umbrella tenant** | One Cisco Umbrella organization (child org under a parent partner relationship). |
| **vSphere / VMware site** | One vCenter Server datacenter (charged via the vCenter SKU). |
| **Workstation** | One desktop, laptop, or VDI session. Must be running a real OS with an EDR agent (Huntress / CrowdStrike). |
| **Server** | One server endpoint (physical or virtual) with an EDR agent. |
| **Licensed user** | One Microsoft 365 paid license assignment (not shared mailboxes, room/equipment accounts, or guest users). |

---

## 10. Grandfathering & Legacy SKUs

### Existing $49 IT Self-Service Agent customers

Customers currently paying $49/mo flat for the original IT Self-Service Agent SKU stay at **$49 for the original bot-only feature set, grandfathered 24 months** from V4 launch (2026-06-15).

If they want any platform monitoring (Jian Core or higher, or any per-resource service), they upgrade to V4 per-user pricing for that scope. The bot itself continues at $49 within the grandfathering window. After the 24-month grandfathering period, they convert to current pricing.

**For new customers,** $49 is no longer available — the entry SKU is Jian Teams Bot Only at $99/mo flat (see §5), or the free Jian Watch tier (see §7).

### Legacy standalone report SKUs (report-only buyers)

For buyers who only want a single branded monthly report and don't want the platform:

| Report | Price |
|---|---|
| My M365 Report | $15–$129/tenant/mo (5 user-count bands XS–XL) |
| My Meraki Report | $150/Meraki org/mo flat |
| My Sophos Report | $99 / $199 / $299/tenant/mo (Essentials / Advanced / Enterprise) |

Retained from the 2026-05-04 brochure. **Platform subscribers (Jian for M365 + any per-resource service) get equivalent reports auto-included** at no additional charge — these standalone SKUs are only for buyers who don't want the platform.

---

## 11. What Jian Does & Monitors (The Functional Layer)

This section documents *what the buyer is actually paying for* — the functions Jian runs, how often, what it monitors, and how it communicates. **Honesty guardrails are baked in: Jian opens tickets and shows its work; it does not silently fix client systems.** (All times Pacific.)

### 11a. The agent functions + cadence

| Function | What it is | Cadence | Output |
|---|---|---|---|
| **Alert** | Real-time critical-event detection (lightweight evaluators; the LLM is pulled in only for context) | **Every 15 min** (lower tiers 30m / 1h / 2h / 6h) | Opens a P1/P2 Client-Portal ticket + Teams channel + Adaptive Card to the "Jian Alerts" channel |
| **Diagnose** | The judgment pass — reads the day's data through the AI gateway and decides what warrants a ticket + recommended fix + MITRE tag | **Daily 14:00 PT** (or at the 15-min Alert cadence on critical platforms) | Forensic CP ticket routed to the on-shift tech |
| **Activity** | Daily roll-up of the day's events into a per-client posture summary | **Daily 14:30 PT** | Feeds monthly reports + the SIEM correlator + the learning loop |
| **Counts** | Usage/license counting — observed-vs-billed reconciliation to surface under-billing and license waste | **Observed daily 05:00 PT; billed monthly** | Read-only count reports |

### 11b. Remediate — HONESTY GUARDRAIL (we do NOT overclaim)

- **Auto-fix is gated BY DESIGN. Jian opens tickets; it does NOT silently fix client systems.**
- The only **live autonomous actions** today are: (1) Jian **self-healing its own platform**, (2) **M365 session revocation** on confirmed account takeover (live across tenants), and (3) a small fixed catalog of reversible *infrastructure* actions on our own backend (e.g., re-run a stale pull, backfill, restart a backend service).
- Every **client-platform** Tier-1 remediation requires all three of: **7 days of clean diagnose traces matching what techs actually did ≥95% + explicit per-operation approval + a tested rollback path.** The first client-platform remediation (Sophos firewall) is **roadmapped 2026 Q2.**
- **Frame the gating as a STRENGTH:** *"Jian shows you a documented audit trail proving it would have made the right call — N times — before it's ever empowered to act."*
- **NEVER write "31 auto-remediations"** — that is a count of code files, not live actions. **NEVER claim automatic IP blocking** — Microsoft blocks the permission; Jian emails the IP list for a human to block. Only **session-revoke** is automated.

### 11c. Compliance engine

- **31 evaluators** across **5 frameworks: HIPAA, SOC 2, CMMC, PCI-DSS + Technijian baseline.** (The Compliance tier adds custom frameworks: SOX / GLBA / FINRA / NIST 800-171 / FedRAMP.)
- **3 modes:** **Alert** — 6 critical-breach evaluators every 15 min (MFA disabled, audit log off, CA policy disabled, DMARC reverted, new mailbox forwarding rule, new Global Admin); **Diagnose** — all 31 daily at 03:00 PT; **Activity** — pass/fail by framework daily at 14:30 PT.
- **Produces:** continuous framework-tagged evidence, a **branded monthly compliance report (DOCX)**, and an **append-only, tamper-evident audit log.**
- **Honesty line (good to print):** evaluators return **"unknown"** when they can't prove a result — *"Jian never claims a control passes without evidence."*

### 11d. SIEM / correlation

- **MITRE ATT&CK catalog:** **858 techniques · 15 tactics · 189 threat groups · 824 software**, refreshed **daily at 02:00 PT** from the official MITRE STIX bundle.
- **Two modes:** **Real-time** every 15 min (1-hour window) → raises a P1 the moment a critical correlation crosses threshold; **Retrospective** daily at 14:30 PT re-scans the **prior 7 days** against the freshly refreshed catalog (catches slow-burn campaigns).
- **Correlates 5 security sources:** **Inky, Sophos, M365 Security (sign-in), CrowdStrike, Huntress.**
- **Kill-chain scoring:** maps each event to MITRE → groups by (client, day-window) → computes a weighted tactic score → assigns severity by how many distinct tactics fired.
- **Example kill chain (great copy):** Inky phishing email → M365 risky sign-in → CrowdStrike malicious PowerShell → Huntress scheduled task → **CRITICAL coordinated-attack ticket** that single-tool monitoring would miss.

### 11e. How Jian communicates

- **Email (Microsoft Graph, from `jian@technijian.com`):** a daily **Morning Summary** (07:00 PT); **security alerts** (rich HTML — MITRE map + IP-geolocation table + AADSTS error codes explained in plain English + what Jian did + next steps); **user-direct notifications** (emails the affected user about their own sign-in events); a **weekly autonomy report** (Mon 07:00 PT); and an optional branded client-facing report.
- **Microsoft Teams — the `@Jian` bot:** **channel-per-ticket** (creates `#<ticket>—<subject>`, renames `[CLOSED]` and archives on close); **Adaptive Cards** (open / update / assign / close) plus a dedicated **"Jian Alerts"** channel; **two-way** (techs and the requester chat in-channel, relayed to the Client Portal); and a **self-service assistant** for end users (answers IT questions from a per-client RAG "brain" of ticket history + Teams files + the Technijian knowledge base). **Installed in 99 of 100 client Teams tenants.**
- **Client Portal tickets:** **idempotent** (dedupe key `platform:client:date:type` — never double-files); forensic context (MITRE tag + recommended fix + evidence); **shift-aware routing** (India-primary / US-fallback, after-hours handoff, L2/L3 escalation if no time entry in 4h, 3-bounce cap); and **automatic billable time entries.** A CP poller runs every 2 min (the CP has no webhook).
- **Approval / control loop:** escalations become **approve/deny emails** that lead with *"✅ What I want to do: \<specific fix\>"*; a poller reads the reply (token + anti-spoof) every 10 min and runs **only** actions from the fixed reversible catalog — **an AI model, or an email reply, can never run an arbitrary command.**

### 11f. Complete LIVE data-source catalog (by layer)

| Layer | Source(s) — what flows in |
|---|---|
| **Identity / Microsoft 365** (22 workloads end-to-end) | M365 Security (risky/failed sign-ins, password spray, impossible travel, MFA), M365 Admin/Entra (app-cred expiry, PIM/roles, CA policy state), M365 Compliance (Secure Score, MFA %, audit-log state), M365 Storage (mailbox/OneDrive/SharePoint/Teams usage), M365 License (assigned-vs-used + Pax8 reconcile), M365 Apps service-health |
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

**ROADMAP / "built, waiting for data" — LABEL CLEARLY; do NOT market as live:** OS fleet (Windows / macOS / Linux) and network devices (switches, Wi-Fi APs, VoIP phones, printers, UPS) via the **Jian Remote Agent (Edge collector)**; the client-facing read-only dashboard; auto-generated signed compliance PDFs; and Jian Voice as a paid add-on.

### 11g. Headline stats (safe to print)

40+ platforms monitored (43 routes) · **858** MITRE techniques · **31** compliance evaluators across **5** frameworks · **~25K** findings/day with **99.6% resolved for $0** before any AI cost · **~45%** of proactive IT-support hours eliminated · **@Jian bot in 99 of 100** client Teams tenants · **57+** managed client environments · **~254 tech-hrs/mo (~1.6 FTE)** of labor value.

**DO NOT print:** "28K decisions/day" (unverified), a hard "58 clients" (always use **"57+"**), or **"31 auto-remediations."**

---

## 12. Cost-to-Serve and Margin Discipline

Per `state/cost_reports/` (steady-state):

| Line | Per client per month |
|---|---|
| LLM / token COGS (Gemini Flash primary; includes safety multiple) — **steady-state ~$0.30/client/mo** | ~$0.30 |
| Infrastructure (SQL / n8n / IIS / LiteLLM / Azure App Service amortized) | $7 |
| Engineering maintenance (amortized; drops fast as client count grows) | $150–$300 |
| **Cost to serve (one client)** | **~$165–$315/mo** |

**Token COGS is steady-state ~$0.30/client/mo** — the architecture resolves 99.6% of the ~25K daily findings with lightweight evaluators *before* any AI cost is incurred, so the LLM is invoked only for the judgment/context pass. (The earlier "$5 LLM" line was a conservative safety-buffer ceiling, not the observed steady-state cost.)

**No Jian deployment sells below cost-to-serve** — the **$299/mo platform minimum** (see §3) guarantees it at the small end, where engineering-onboarding load is highest. At the year-3 projected mix (100+ clients, average client paying $1,500–$3,500/mo), **blended gross margin is 85–92%** — premium SaaS economics. With token COGS at ~$0.30/client and infra amortizing as the base grows, the dominant variable cost is human engineering time, which is exactly what the gated-remediation learning loop is designed to reduce.

---

## 13. Worked Examples — Three Real Client Profiles

### Small SMB — 20-user law firm, 1 office, 1 firewall, 1 backup

| Path | Calculation | Monthly |
|---|---|---|
| **Itemized** | Core 25-seat min × $9 = $225, + 1 firewall × $99, + 1 backup × $59 | **$383** |
| **Annual prepay** | $383 × 10 | $3,830/yr |
| **OR Jian Starter Bundle** | flat | **$349** |
| **vs. comp stack** | Huntress + Vanta + Arctic Wolf entry + Liongard + reporting labor | ~$960/mo |
| **Jian = 40% of comp** (or 36% with the Starter Bundle) | | |

*(This $383 deployment clears the $299 platform minimum on the itemized total, so the floor doesn't bind here.)*

### Medium regulated — 50-user dental group, HIPAA + SOC 2, 2 sites, 2 firewalls, 2 Meraki orgs, 1 backup

| Path | Calculation | Monthly |
|---|---|---|
| **Itemized** | Compliance 50 × $24 = $1,200, + 2 × $99 = $198, + 2 × $79 = $158, + 1 × $59 = $59 → $1,615 | $1,615 |
| Volume tier ($1,000–$4,999) | × 0.90 | **$1,453** |
| **Annual prepay** | $1,453 × 10 | $14,530/yr |
| **OR Jian Pro Bundle** | flat (includes everything above) | **$1,495** |
| **vs. comp stack** | Drata + M365 + Aisera + Arctic Wolf × 2 + Auvik × 2 + Liongard | ~$5,550/mo |
| **Jian = 26% of comp** (or 27% with the Pro Bundle) | | |

### Mid-market — 250-user multi-site, 5 firewalls, 3 Meraki orgs, 2 backups, regulated

| Path | Calculation | Monthly |
|---|---|---|
| **Itemized** | Compliance 250 × $24 = $6,000, + 5 × $99 = $495, + 3 × $79 = $237, + 2 × $59 = $118 → $6,850 | $6,850 |
| Volume tier ($5,000–$14,999) | × 0.85 | **$5,822** |
| **Annual prepay** | $5,822 × 10 | $58,220/yr |
| **vs. comp stack** | Drata Business + M365 + Aisera + Arctic Wolf × 5 + Auvik × 3 + Liongard + custom-framework consultant | ~$28,350/mo |
| **Jian = 21% of comp** | | |

*(All three examples use clean multiplicative discount stacking on the volume-tier %; the mid-market number quoted is $5,822.)*

---

## 14. Revenue Modeling — V4 vs. Prior

Same 57-client base, realistic year-2 mix:

| Segment | # clients | Avg seats | Profile | Per-client/mo | Total/mo |
|---|---|---|---|---|---|
| Small (Jian Starter or itemized) | 30 | 20 | $349 bundle or $383 itemized | $360 | $10,800 |
| Medium (Pro Bundle or itemized) | 22 | 50 | $1,495 bundle or $1,453 itemized | $1,470 | $32,340 |
| Large (itemized only, multi-site) | 5 | 200 | $5,822 itemized w/ volume disc | $5,822 | $29,110 |
| **Total monthly** | | | | | **$72,250** |
| **Annualized ARR** | | | | | **~$867K/year** |

The new **Jian Plus $16** tier is expected to lift this base modestly over the year as price-sensitive Core buyers trade up for real-time correlation and the remediation catalog, and as a few Compliance-leaning mid-market accounts settle on Plus instead. (Modeled conservatively above at the prior tier mix; Plus upside is treated as headroom, not a baseline assumption.)

At 100 clients (year-3 target): **~$2.1M/year ARR.**

---

## 15. Why V4 Will Convert Clients (The Conversion Argument)

Built-in conversion levers:

### Lever 1 — "Tell us your stack, we'll quote in 60 seconds"

Sales rep asks a handful of questions:
1. How many M365 users?
2. How many firewalls?
3. How many Meraki organizations / monitored sites?
4. How many SQL Server instances?
5. How many backup environments (Veeam OR NAKIVO)?
6. Core, Plus, or Compliance?
7. Annual or monthly?

Plug into the calculator → quote in 5 minutes. **Speed-to-quote is a closing weapon.** Most competitors take a week for an MDR quote.

### Lever 2 — Free Jian Watch + 14-day trial (new in V4)

The single biggest objection ("prove it on my stack first") is answered before paper: **watch one resource free forever, or run the full platform free for 14 days, no credit card.** Land cost is zero; the buyer expands once they've seen real findings on their own infrastructure.

### Lever 3 — Worked-example self-identification

Brochure shows Small / Medium / Mid-market profiles with the math done. Buyer reads "I'm like the medium dental group" → trusts the math → moves to close.

### Lever 4 — Per-line "you'd pay X for [vendor], we're Y" — sticky and memorable

"Arctic Wolf is $300/site. Jian for Firewall is $99." "Auvik is $250/site. Jian for SNMP monitoring is $79." Buyer remembers ONE such line and trusts the whole brochure.

### Lever 5 — Three tiers with a "Most Popular" middle (new in V4)

A three-tier page (Core $9 / **Plus $16** / Compliance $24) lets the rep anchor on the middle "Most Popular" option. Core lands the price-sensitive buyer; Plus captures the buyer who wants real-time correlation + the remediation catalog without the regulated-framework premium; Compliance at $24/user still undercuts Drata Business ($40–$100/user) for the regulated mid-market. Cleaner than V3's "+$15 upgrade" framing.

### Lever 6 — Bundle option for SMBs who want one number

Jian Starter at $349/mo flat removes the "10 SKUs is too much" objection. SMB closes faster on a clean bundle.

### Lever 7 — Backup vendor agnosticism

The NAKIVO callout in Jian for Backup is a unique differentiator. Sales line: *"Veeam ONE doesn't cover NAKIVO. We do. One price, any vendor."* M&A scenarios with mixed backup vendors close instantly.

### Lever 8 — "Jian shows its work before it acts"

The gated-remediation design is a *trust* lever, not a limitation: *"Jian shows you a documented audit trail proving it would have made the right call — N times — before it's ever empowered to act."* Regulated and risk-averse buyers prefer this to a black-box auto-fixer.

---

## 16. Conversion Tactics by Segment

### Sub-25-seat SMB (5–24 users)

- Lead with **free Jian Watch** (one resource, zero cost) or **Jian Teams Bot Only** at $99/mo. Easy approval.
- Discovery question a few months in: "Want us to add the SOC layer? Switch to the Jian Starter Bundle, $349 flat — adds firewall + backup monitoring + the full M365 platform." Lever to expand.

### 25–100-seat SMB (the sweet spot)

- Start most prospects on the **14-day full trial** so they see live findings on their own stack.
- Lead with the **Jian Starter Bundle** ($349) if they have 1 firewall + 1 backup. One-number sale.
- For the buyer who wants real-time correlation without regulated frameworks, anchor on **Jian Plus** at $16/user.
- If they're multi-site or regulated, lead with **Jian Compliance** at $24/user (or the **Jian Pro Bundle** at $1,495 flat for the typical 50-user regulated profile).
- Annual prepay closes the conversation: "Pay annually, save 17% — first month free while we connect APIs."

### 100–250-seat regulated mid-market

- Lead with **Jian Compliance itemized.** Show the worked-example math on the price sheet. Procurement loves the per-line transparency.
- Bundle math: $1,453–$5,822/mo with the volume tier; annual saves another 17%.
- CSM-led sale; pilot on the 14-day trial (or 30 days free on Core), upgrade to Compliance at month 2 once the compliance team validates the evidence chain.

### 250–1,000-seat enterprise

- Itemized only; no flat bundle.
- Custom NDA-protected quote built in 24 hours.
- Co-sell: anchor against Arctic Wolf Enterprise + Drata + Aisera comp stack ($30,000–$50,000/mo). Jian at $10,000–$15,000/mo is genuinely transformative.

### MSP channel (10+ clients reselling Jian)

- White-label license via the **Enterprise / MSP** tier + 20% off list at 25+ clients with annual commit.
- MSP-specific brochure (separate deliverable).
- Pax8 listing required for friction-free billing.

---

## 17. Open Pricing Decisions (Future Adjustments)

1. **Jian Plus attach rate.** $16 is the new middle tier; after 6 months of sales data, validate that Plus is capturing trade-ups from Core without cannibalizing Compliance.
2. **Starter Bundle pricing.** Three bundles published at $349 / $1,495 / **$2,695**. After 6 months of sales data, may need adjustment based on attach rates.
3. **MSP wholesale tier.** Currently informal at "negotiate 20% off list at 50+ clients." Formalize once two reference MSPs are live.
4. **Jian Compliance pricing.** $24/user might be low for the regulated mid-market — could go to $29 once we have 5 reference customers. Wait and see.
5. **Free Jian Watch boundaries.** Single-resource, read-only, free forever — monitor conversion-to-paid and whether the resource cap should ever extend to two.
6. **Roadmap add-on pricing.** Jian Voice and the Jian Remote Agent (Edge collector) finalize at their respective launches; client-platform remediation (first: Sophos firewall) roadmapped 2026 Q2.

---

## 18. Source-of-Truth Files

| File | Owns |
|---|---|
| `Services/My Jian AI Agent/my-jian-pricing-spec.md` (this file) | V4 pricing strategy |
| `Services/My Jian AI Agent/assets/_V4_BUILD_SPEC.md` | V4 collateral build spec (numbers + functional facts + render protocol) |
| `docs/jian-system-overview.md` §18a | Embedded pricing (update to V4) |
| `docs/My-Jian-Specification.docx` | Formal external spec |
| `Services/My Jian AI Agent/My Jian AI Agent Brochure.html/.pdf` | Multi-page suite brochure |
| `Services/My Jian AI Agent/My Jian AI Agent One-Pager.html/.pdf` | Single-page summary |
| `Services/My Jian AI Agent/My Jian AI Agent Price Sheet.html/.pdf` | Comprehensive standalone reference |

---

## 19. Brand Promise

**Tagline:** *"40% of name-brand price. Same protection. One platform."*

Every per-line comp callout backs it. Every worked-example client profile demonstrates it. Every sales conversation lands on it.

---

*End of pricing specification v4.*
