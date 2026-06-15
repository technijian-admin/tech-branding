# SaaS Pricing & Packaging Strategy — My Jian AI Agent
**Technijian, Inc. · Generated 2026-06-15 · Confidential — internal strategy**
Author: SaaS pricing-expert analysis (Ramanujam / Poyar / Campbell / a16z method) for Robert "Ravi" Jain
Inputs: tech-web-myjian repo (agents, harness, COGS, labor model), tech-branding V3.1 collateral, vault memory, live competitor pricing (fetched 2026-06-15)

---

## Executive Summary — the recommendation in one page

**My Jian is an autonomous 24×7 AI IT-operations / SOC agent** (36 diagnose + 31 remediate agents, 43 platform routes, MITRE + SIEM correlation, 31 compliance evaluators, 58 live clients). It is priced today (V3.1, 2026-05-28) as a **hybrid: per-M365-user ($9 / $24) + per-monitored-resource** (firewall $99, backup $59, …), anchored at *"40% of name-brand price."* Internally, the engineering team values each agent in a **floor (token cost) → ceiling (labor saved)** band and suggests **$150–500/agent**.

**The structure is right. The anchor is wrong, and money is being left on the table.**

1. **Keep the hybrid value metric** (per-user + per-resource). It is the correct, value-aligned, expansion-friendly model. The internal **per-agent model should stay internal** — it is a costing/value tool to *set* resource prices, not a customer-facing metric. *(Per-agent fails the "simple / scalable" test for buyers; per-resource is the same value expressed in the buyer's language.)*
2. **Re-anchor the value narrative to the right competitive set.** V3.1 benchmarks against MSP point-tools (Auvik $250, Liongard $50–100, Huntress $6). Jian's *true* category is **agentic AIOps / AI-SOC**, where comparable capability costs **$20K–$378K/yr** (Prophet $20–42K, Dropzone $36K, Torq $59–378K, **Microsoft Security Copilot ~$105K/yr** eval, Arctic Wolf $80–96K, Moveworks/Aisera $90–130K+). Against *that* set Jian's typical client ($383–$5,822/mo = $4.6K–$70K/yr) sits at **5–25% of comparable** — the value story is **2–5× stronger than the collateral claims**.
3. **The #1 move: monetize what's already built but unsold.** The **mssql agent alone models $1,272/client/mo of labor value and has NO retail SKU.** Add **Jian for SQL Server** and **Jian for Network/SNMP Monitoring** immediately.
4. **Add a middle tier.** Two tiers ($9 → $24, a 2.7× cliff) leave no "land here" target. Insert **Jian Plus $16/user/mo** as the tier most clients should land on (correlation + active response + expanding remediation).
5. **Formalize the MSP/white-label wholesale program** as a named SKU (the channel is wide open — half the incumbent set hides pricing and walls off small MSPs).
6. **Protect the small-account floor.** A bare 25-seat Core-only client = $225/mo, *below* the $165–315/mo cost-to-serve. Set a **$299/mo platform minimum** (or require ≥1 resource attach).
7. **Hold list prices low *deliberately* for land-grab — then raise on a published cadence** as reference customers accrue (this is already the stated plan; formalize it).

**Recommended headline:** keep the magnet, monetize the gaps, anchor the story to the real category.

| | Today (V3.1) | Recommended |
|---|---|---|
| Per-user tiers | 2 ($9 / $24) | **3** ($9 / **$16** / $24) + Enterprise/MSP anchor |
| Resource SKUs | 8 | **10** (+ SQL Server $99, + Network/SNMP $79) |
| Value anchor | "40% of MSP name-brand" | **"A fraction of a $100K AI-SOC — with the receipts"** |
| Entry motion | quote / pilot (ad hoc) | **14-day full trial + free single-resource "Jian Watch"** |
| MSP channel | discount footnote | **named white-label wholesale program** |
| Expansion lever | seats + resources | + tier upgrades + frameworks + **Autopilot outcome add-on** + MSP-client growth |
| Floor protection | 25-seat min ($225) | **$299/mo platform minimum** |
| Expected effect | — | higher ARPA, NRR >120%, defensible margin, faster sales cycle via transparency |

---

## 1. Product & Market Assessment

### What the buyer is really buying
Jian replaces a **24×7 Tier-1/Tier-2 SOC + NOC + compliance-evidence + report-assembly stack** with software. It watches every monitored platform for every client, classifies against MITRE ATT&CK, correlates cross-platform kill-chains, opens forensic Client-Portal tickets, routes them shift-aware, and auto-emits compliance evidence + branded monthly reports. ~28K LLM decisions/24h with **99.6% gated to $0** before any model call.

### Status-quo cost (what Jian displaces)
| Replaces | Status-quo cost | Source |
|---|---|---|
| 24×7 SOC analyst coverage | $80K–$130K+/yr (Arctic Wolf / Moveworks / Aisera tier) | competitor research 2026-06-15 |
| Microsoft Security Copilot (autonomous triage) | ~$105K/yr (3 SCUs 24×7) or $0 w/ E5 + $6/SCU overage | microsoft.com/security/pricing |
| AI-SOC analyst (Prophet/Dropzone/Simbian) | $10K–$42K/yr entry | Vendr / AWS Marketplace |
| Compliance automation (Vanta/Drata) | $20K–$25K/yr median + ~$5K/framework | Vendr |
| Config/attack-surface (Liongard) | per-environment, 15-env minimum | vendor + 3rd-party |
| Network monitoring (Auvik) | $15–$25/device/mo | vendor store |
| RMM (NinjaOne) | $1.50–$3.75/device/mo | vendor |
| **Measured labor** | **14–90 hrs/client/mo eliminated · ~45% of proactive IT hours · ~$250/client/mo (conservative) to $1,050–$9,000/mo (by size)** | jian-system-overview.md §18a; myjian-agent-pricing-model.md |

### Buyer personas (Jian has two go-to-markets)
| Persona | Who | Motion | Primary metric that resonates |
|---|---|---|---|
| **Direct SMB / mid-market** | Technijian's managed-IT clients (20–500 seats), regulated verticals (legal, dental, finance, gov) | sales-assisted, transparent line-item quote | per-user + per-resource; "hours saved" + "fraction of name-brand" |
| **MSP channel** | Other MSPs reselling/white-labeling Jian to *their* clients | wholesale, volume, NFR | per-endpoint wholesale + multi-tenant + co-brand |

### Value inventory (capability → tier candidate)
| Capability | Buyer outcome | Replaces | Differentiator? | Tier |
|---|---|---|---|---|
| 24×7 autonomous monitoring + triage + ticketing | No overnight desk; nothing slips | NOC/SOC labor | Table stakes (the platform) | **Core** |
| MITRE-tagged events + branded monthly report | Audit-ready evidence, no assembly | Manual report prep (6–18 hrs/mo) | Differentiator | **Core** |
| Baseline compliance evaluators (HIPAA/SOC2/PCI) | Continuous control evidence | Vanta/Drata ($20K/yr) | **Strong differentiator** | **Core** |
| Cross-platform SIEM correlation (real-time + retro) | Coordinated-attack detection no point tool sees | $50K SIEM + analyst | **Strong differentiator** | **Plus** |
| Priority shift-aware routing + faster MTTR | Right tech, right shift, instantly | Dispatcher labor | Differentiator | **Plus** |
| Gated Tier-1 auto-remediation (expanding catalog) | Fixes, not just alerts | Tech remediation labor | **Delighter (roadmap)** | **Plus** |
| CMMC + custom frameworks (SOX/GLBA/FINRA/NIST/FedRAMP) | Regulated-vertical readiness | Vanta +$5K/framework | Enterprise-only | **Compliance** |
| Dedicated CISSP CSM + 99.5% SLA + audit liaison | Hand-holding + accountability | vCISO retainer | Enterprise-only | **Compliance** |
| Backup vendor-agnosticism (Veeam **+ NAKIVO**) | One report across mixed backup | Liongard (no NAKIVO) | **Unique** | resource add-on |
| Per-resource depth (firewall, network, DNS, vCenter, web, **SQL**) | Whole-estate coverage, one platform | 8 separate tools/invoices | **Consolidation** | resource add-ons |

---

## 2. The Value Metric (the highest-leverage decision)

**Recommendation: keep the two-axis hybrid — per-M365-user (identity layer) + per-monitored-resource (infrastructure layer). Keep per-agent internal.**

### Scoring the three candidates
| Test | Per-user | Per-resource | Per-agent (internal model) |
|---|---|---|---|
| Aligned with value | ◑ (people layer only) | ● (tracks the work Jian does) | ◑ (value, but seller-framed) |
| Predictable | ● | ● | ◑ |
| Scalable (NRR) | ● seats grow | ● estate grows (M&A, growth) | ✗ finite agent *types* caps expansion |
| Simple (one sentence) | ● | ● per line | ✗ buyers don't know what an "agent" is |
| Hard to game | ● | ● (auto-discovered) | ● |
| Measurable | ● license count | ● Jian auto-counts (`price_list.json` count_source) | ● |
| **Verdict** | **Keep — identity layer** | **Keep — infra layer & NRR engine** | **Internal only — sets resource prices, flags gaps** |

### Why per-agent must stay internal — but is invaluable
The engineering `floor→ceiling` model (token cost → labor saved, default $150–250/agent, security/identity/backup/mssql $250–500) is the **right tool to price each resource SKU and to catch under-monetized capabilities.** It already surfaced the single biggest finding:

> **The mssql agent models ~$1,272/client/mo of labor value (2 clients × $2,544/mo total) and has no retail SKU at all.** Selling it at even $99/instance/mo prices it at <8% of modeled labor value — a near-free margin win.

**Action:** translate the per-agent ceilings into resource list prices; never put "per agent" on a customer quote.

### Metering plan
- **Users:** count of paid M365 licenses (exclude shared mailboxes / rooms / guests). Already metered via Graph.
- **Resources:** Jian auto-discovers and counts each billable unit (firewalls, environments, zones, vCenters, SQL instances). `scripts/agents/configs/price_list.json` already maps each line item to the pull that counts it — **true-up can be automated and shown to the client** (a transparency asset competitors can't match).
- **AI tokens:** **do not meter.** ~$0.30/client/mo steady-state; bundle into base. (See §6 pass-through policy.)

---

## 3. Willingness-to-Pay — research plan & assumptions used

No formal WTP study has been run; below is the plan plus the live signals substituted for data.

### Live signals to mine now (no survey needed)
- **Win/loss + discount depth:** how often does the rep discount, and by how much? Frequent deep discounts = priced too high *for the framing*; never discounting = too low. (Category context: Torq buyers got 40% off at year-end — Jian's *published* discount avoids that game.)
- **Resource attach rate:** % of Core clients who add ≥1 resource, and how many. This validates the expansion engine.
- **Tier mix:** Standard vs Compliance Pro split — a thin Compliance Pro % means the $24 cliff is too steep (→ the new $16 Plus tier catches them).
- **"No-brainer" question** on every sales call: *"What would make this an instant yes?"*

### Instruments to run (priority order)
| Instrument | Question it answers | Design | Sample |
|---|---|---|---|
| **Van Westendorp PSM** | What's the acceptable price band for the *per-user* tiers (abstract value)? | 4 questions (too cheap / cheap / expensive / too expensive) per persona | 40–60 / segment (SMB, mid-market, MSP) |
| **Gabor-Granger** | Optimize each *resource* price we suspect is underpriced (firewall, SQL, vCenter) | "Would you buy at $X?" laddered up/down | 40–60 / SKU |
| **Choice-based conjoint** | Which features belong in Core vs Plus vs Compliance | features × price trade-offs | 200+ |
| **MaxDiff** | Rank differentiators → confirm tier fences | force-rank 12–15 capabilities | 150+ |

### Assumptions used in lieu of data (state them, defend them)
- Labor savings are **MODELED, not measured** (the pricing-model "honesty ledger" flags this) — used the **conservative ~$250/client/mo**, not the $1,050–9,000 by-size headline, for ROI claims.
- Token COGS uses the **measured ~$5/client/mo**, not the bug-inflated $6,382 all-time or the cold-cache $169/mo spike (both explained as transient in the docs).
- Competitor enterprise prices are **Vendr/marketplace observed contract values**, not list — treated as ranges.

---

## 4. Packaging — tiers & fences

### Per-user core: 3 tiers + an Enterprise/MSP anchor
| | **Jian Core** | **Jian Plus** ⭐ NEW | **Jian Compliance** | **Enterprise / MSP** |
|---|---|---|---|---|
| **Target buyer** | Any SMB wanting 24×7 coverage | Growing / multi-platform SMB (the **target tier**) | Regulated verticals (HIPAA/CMMC/finance/gov) | 500+ seats, MSP resellers |
| **Price** | **$9/user/mo** | **$16/user/mo** | **$24/user/mo** | Contact sales |
| **Annual (2 mo free)** | $90/user/yr | $160/user/yr | $240/user/yr | custom + multi-year |
| **Value-metric allowance** | unlimited monitoring; 25-seat / $299 min | same | same | volume + NFR |
| **Key adds** | Autonomous monitoring, triage, ticketing, @Jian Teams bot, branded monthly report, baseline compliance evidence (HIPAA/SOC2/PCI), MITRE tagging | + real-time **cross-platform SIEM correlation**, priority shift-aware routing, **expanding Tier-1 auto-remediation catalog**, weekly reporting, lite custom @Jian skills | + **CMMC + custom frameworks**, dedicated **CISSP CSM**, 99.5% SLA, cross-client correlator, audit-firm liaison, on-demand reports | + multi-tenant console, white-label/co-brand, dedicated infra option, custom SLA |
| **Upgrade trigger** | "We added a 2nd location / want it to *act*, not just alert" | "We're going through an audit / need CMMC" | "We resell IT / have 500+ seats" | — |
| **Excludes (upsell drivers)** | correlation, remediation, frameworks | frameworks, dedicated CSM | — | — |

**Fences** follow the rules: security/SSO/SLA/dedicated-CSM gated up (the accepted "SSO/compliance tax"); table-stakes monitoring never gated. The **value cliff Core→Plus** is "alert vs act + correlate"; **Plus→Compliance** is "operate vs audit-ready."

### Resource add-ons (à la carte, the NRR engine) — keep all, add two
| Jian Service | Price | Status |
|---|---|---|
| Jian for Firewall | $99/firewall/mo | keep |
| Jian for Meraki Network | $79/org/mo | keep |
| Jian for Backup (Veeam + NAKIVO) | $59/env/mo | keep (disclosed 59–118% exception) |
| Jian for DNS (Umbrella) | $39/tenant/mo | keep |
| Jian for Endpoint EDR — WS / Server | $1.50 / $3.50/mo | keep |
| Jian for vCenter | $99/vCenter/mo | keep |
| Jian for Web / Cloudflare | $29/zone/mo | keep |
| **Jian for SQL Server** | **$99/instance/mo** | **NEW** — fills the biggest gap (labor value ~$1,272/client/mo) |
| **Jian for Network / SNMP Monitoring** | **$79/site/mo** | **NEW** — OpManager agent, distinct from Meraki |

> Most resource SKUs carry **1.5–3× headroom** vs the AI-SOC comparable. Hold for land-grab; raise on the §7 cadence.

### Entry motion — add a real trial (category wedge)
Today: ad-hoc pilot. **Recommendation:** publish a **14-day full-feature trial (no credit card)** + a **free, read-only "Jian Watch" single-resource tier** (e.g., watch one firewall free, upgrade to act). Marginal cost ≈ $0 (COGS pennies). Only **2 of 7** AI-SOC vendors offer any free access — this is a cheap, differentiated land wedge that also generates the "it would have caught N things" proof the auto-remediation story needs.

---

## 5. Recommended Pricing (tier cards)

### Per-user
- **Jian Core — $9/user/mo** ($90/yr). 25-seat / **$299/mo platform minimum**.
- **Jian Plus — $16/user/mo** ($160/yr). *Most popular — the target tier.*
- **Jian Compliance — $24/user/mo** ($240/yr).
- **Jian Enterprise / MSP — contact sales** (anchor + channel).

### Resource add-ons
As table in §4. **New:** SQL Server $99/instance, Network/SNMP $79/site.

### Bundles (keep; fix the known bugs)
| Bundle | Contents | Flat | Note |
|---|---|---|---|
| Jian Starter | Core 25 + 1 FW + 1 backup | **$349/mo** | itemized $383 |
| Jian Pro ⭐ | Compliance 50 + 2 FW + 1 backup + 1 Meraki | **$1,495/mo** | itemized $1,615 |
| Jian Enterprise | Compliance 100 + 3 FW + 1 backup + 2 Meraki + 1 DNS | **$2,695/mo** | itemized $2,953 |

> **Fix before next publish:** (1) spec §16 still references a stale **$3,295** Enterprise bundle — operative price is **$2,695** everywhere else; (2) the Price Sheet header banner mislabels **"V3.0"** despite V3.1 content. Both cosmetic, both should be corrected.

### Worked examples (arithmetic verified 2026-06-15)
| Profile | Build | Monthly | Annual (−17%) | vs name-brand stack | vs AI-SOC category |
|---|---|---|---|---|---|
| Small — 20-user law firm | Core 25×$9 ($225) + 1 FW + 1 backup | **$383** | $3,818 | $960 → **40%** | Prophet/Dropzone entry $10–36K/yr → **~10–38%** |
| Medium — 50-user dental (HIPAA) | Compliance 50×$24 + 2 FW + 2 Meraki + 1 backup = $1,615, −10% | **$1,453** | $14,479 | $5,550 → **26%** | MS Copilot ~$105K/yr → **~17%** |
| Mid-market — 250-user multi-site | Compliance 250×$24 + 5 FW + 3 Meraki + 2 backup = $6,850, −15% | **$5,822** | $58,007 | $28,350 → **21%** | Arctic Wolf/Aisera $80–130K/yr → **~45–73%** |

*All monthly. Conservative labor offset alone (~$250/client/mo) covers the Small client's bill ~0.65×; by-size labor ($1,050–9,000/mo) yields 1.4–5.7× ROI before any risk-reduction value.*

---

## 6. Monetization Model

**Model: hybrid (per-seat base + per-resource add-ons) — keep. It is the modern B2B default and exactly right here.** Predictable base for the buyer's CFO; per-resource component is the expansion engine.

### AI cost pass-through policy (mandatory section)
- **Bundle, don't meter.** Steady-state token COGS is **~$0.30/client/mo** (99.6% of findings gated to $0; cheap-first cascade — DeepSeek $0.14/M, Sonnet-escalate ~$0.30/M effective at 90% cache; **no Gemini** per CEO directive 2026-06-11). Metering tokens would "price the service at noise."
- **Guardrail:** the internal **$100/platform/mo LiteLLM budget cap** + the SQL/rule gate are the cost-control; a runaway client trips the cap, not the customer invoice.
- **Recapture heavy-automation value via the Autopilot add-on** (§7), not via token metering — the category's outcome-pricing shift (Prophet/Simbian per-investigation; Aisera per-resolution) belongs in an *expansion* lever, not the base.

### Discount discipline
- Keep **annual −17%** (2 mo free), shown as the default toggle.
- Keep **volume −10/15/20/25%** (auto-applied on monthly invoice). Add **multi-year** (2-yr / 3-yr) depth for MSP/Enterprise.
- **Never discount list price** — use term/scope/ramp/add-on concessions. Publish a discount-authority matrix (§9).
- Transparency *is* the discount story: a published, verifiable line-item price in a category where 6/7 competitors hide numbers shortens the sales cycle and removes the "your price depends on how hard you negotiate" friction.

### Localization
Not urgent (US SMB/MSP focus). If Jian goes to MSP channel internationally, add PPP-adjusted wholesale (30–60% off) + local-currency display.

---

## 7. Competitive Landscape

### Matrix (fetched 2026-06-15; "—" = not public, itself a signal)
| Competitor | Model | Value metric | Free/Trial | Entry | Mid | Enterprise | Public? |
|---|---|---|---|---|---|---|---|
| **Dropzone AI** | flat / per AI analyst | investigations/yr (≤4,000) | demo only | **$36K/yr** | — | — (MSSP multi-tenant) | No |
| **Prophet Security** | usage / per investigation | investigations | free POV | **~$20K/yr** | — | **~$42K/yr** | No (Vendr) |
| **Simbian** | usage / per alert | alerts (per ~1k) | none (SOC) | **$10K/yr** | — | — | AWS only |
| **Intezer** | per endpoint | endpoints | 10 scans/mo + 14-day | ~$40–60/host/yr | — | — | No (current SOC) |
| **Radiant / 7AI** | quote | use-cases+seats / consumption | demo only | — | — | — | **No** |
| **Torq HyperSOC** | base + per-workflow + per-agent compute | executions | free Community | ~$59K/yr | ~$86–179K | **~$274–378K/yr** | No (Vendr) |
| **MS Security Copilot** | consumption (SCU) | SCU/hr | none | **$4/SCU/hr** (~$35K/yr 24×7) | ~$105K eval | $6/SCU overage; **$0 w/ E5** | **Yes** |
| **CrowdStrike Charlotte AI** | credits, add-on to Falcon | credits/task | Falcon trial | — | — | — | No |
| **Moveworks** (→ServiceNow) | per-employee/yr | employees | none | — (~$15–200/emp) | ~$130K ACV | **$1M+** | No |
| **Aisera** (→Automation Anywhere) | per-seat → consumption | seats/resolutions | none | — | ~$90–108K/yr | $200K–$1.2M list | No |
| **ServiceNow Now Assist** | edition + "Assists" pool | per Assist / fulfiller | none | ~$25–75/fulfiller/mo | +25–60% on base | $300–600K/yr add-on | No |
| **Arctic Wolf** (MDR) | quote / hybrid | per user/node | none | ~$40K/yr | ~$80–96K | $200–500K+ | No |
| **Huntress** | per-unit | endpoint/identity/source | 14-day | ~$8.99 (MSP ~$2.50) | — | volume | Partial |
| **NinjaOne** | per-device | device | 14-day | $3.75/device | ~$2.00–2.50 | $1.50/device | Partial |
| **Vanta / Drata** | tiered + quote | employees + frameworks | none | $7.5–9.5K/yr | $20–25K | $57–60K+ | No |
| **My Jian** | **hybrid per-user + per-resource** | **users + resources** | *(proposed)* trial+free | **$383/mo** | $1,453/mo | $5,822/mo | **Yes — published, line-item** |

### Insights & white space
1. **Opacity is the category norm — transparency is Jian's moat.** 6/7 AI-SOC vendors and half the MSP set publish **zero** prices (/pricing 404s are routine). Jian is the only player with **published, verifiable, line-item, auto-true-up-able** pricing. Lean into it hard.
2. **Nobody is openly priced below ~$10K/yr.** The funded incumbents abandoned SMB/small-MSP. Jian's $383/mo ($4.6K/yr) entry **owns white space no one is defending.**
3. **The metric is the positioning, and it's deliberately confusing.** SCU / credit / "Assist" are opaque abstract units that prevent comparison and enable quiet re-rating. Jian meters on **units the buyer already counts** (users, firewalls, backups) — a trust win.
4. **Don't fight Microsoft on E5-bundled basic triage.** MS just reset the floor to "free with E5 + $6/SCU overage." Win on **non-Microsoft estates, non-E5 buyers, cross-platform correlation, deeper remediation, and consolidation** (one platform vs their five).
5. **Compliance is a near-zero-marginal-cost adjacency to absorb.** Vanta/Drata charge $20–25K/yr + $5K/framework to watch config evidence Jian already holds. Bundling continuous control evidence (Core) and frameworks (Compliance tier) is high-perceived-value land-and-expand.
6. **The incumbents price *priced humans*.** Arctic Wolf / Moveworks / ConnectWise PSA bake in analyst/tech/dispatcher labor. Jian does that work autonomously — so it can sit **far below the labor-loaded incumbent and still hold ~90% software margin.** Anchor to *work eliminated*, not their per-seat rate.

---

## 8. Expansion & Retention (the NRR engine)

**Target: NRR > 120%** (B2B-great). Six independent expansion vectors:

| Vector | Mechanic | Trigger |
|---|---|---|
| **Seat growth** | per-user base scales with headcount | client hires |
| **Resource attach/growth** | add firewalls, backups, SQL, sites (M&A, new locations) | infra added; Jian *auto-discovers* and prompts |
| **Tier upgrade** | Core → Plus → Compliance | "want it to act" / audit / regulated |
| **+Framework** | CMMC, SOX, GLBA, NIST 800-171 as add-ons | new contract / vertical requirement |
| **Autopilot outcome add-on (NEW, V2)** | per-incident-auto-resolved credit pack — recaptures heavy-automation value | remediation catalog adoption grows |
| **MSP-client growth** | wholesale scales as the MSP signs *their* clients | channel partner grows |

**Upgrade triggers in-product:** Jian already detects un-monitored resources and tier-locked capabilities — surface these as in-ticket / in-report nudges ("Jian detected an unmonitored SQL instance — add Jian for SQL Server"). The branded monthly report is the natural expansion surface.

**Downgrade/cancel flow:** offer pause (keep evidence chain) and downgrade-to-Core or Jian-Watch-free instead of churn; win-back with the "here's what we caught" audit log.

**Price increases:** raise **new-customer** prices first; **grandfather existing clients 12 months**; cadence of small lifts over one shock; tie each lift to shipped value (e.g., when the auto-remediation catalog expands, or a framework is added). The existing $49 bot-only grandfather (24 months) is the template.

---

## 9. Unit Economics & Guardrails

| Metric | Value | Target | Verdict |
|---|---|---|---|
| Direct COGS / client / mo | **~$12** (LLM ~$5 + infra ~$7) | — | software-like |
| Software gross margin | **~95%** | >75–80% | ✅ excellent |
| Fully-loaded cost-to-serve (incl. amortized eng maintenance $150–300) | **$165–315/client/mo** | — | the real cost line |
| Blended gross margin (Yr-3) | **85–92%** (projected) | >75–80% | ✅ defensible |
| **Small-account floor risk** | 25-seat Core-only = **$225/mo < $165–315 cost-to-serve** | — | ⚠️ **fix: $299/mo platform minimum or require ≥1 resource** |
| CAC payback / LTV:CAC / Rule of 40 | not computable (need growth + CAC data) | <12 mo / >3:1 / ≥40 | instrument & track |

**Key guardrails:**
- **Set the $299/mo platform minimum.** Most clients attach a resource and clear cost-to-serve already (Small example $383); the minimum closes the bare-Core-only loss case.
- **Token COGS is not the risk; eng-maintenance is.** Margin is defended by amortizing maintenance across the fleet — every marginal client adds only ~$12 direct. Scale *improves* margin.
- **No SKU sells below the 25-seat floor's cost basis once the $299 minimum is in.**

---

## 10. Rollout Plan

### Pricing page (see `pricing-page-mockup.md`)
3 per-user tier cards (Plus = "Most popular", highlighted), monthly/annual toggle defaulting to annual, an à-la-carte resource calculator, the trial + free-tier CTA, the AI-SOC anchor comparison ("a fraction of a $100K autonomous SOC — and you can verify every line"), and an FAQ.

### Experiment backlog (see `pricing-experiments.md`)
Prioritized: (1) Core $9→$12 land-price test on new visitors; (2) the $16 Plus tier A/B (does it lift mix?); (3) trial-vs-pilot conversion; (4) resource-attach nudge in the monthly report; (5) SQL/vCenter Gabor-Granger price test. **Never A/B existing customers' renewal price.**

### Migration & grandfathering
- New 3-tier + new SKUs apply to **new** customers immediately.
- Existing Standard/Compliance Pro clients: unchanged price; offer Plus as an *upgrade*, not a forced move.
- $49 bot-only and report-only legacy SKUs: honor existing grandfather windows.

### Sales enablement
Discount-authority matrix (by deal size), the ROI/labor calculator (conservative $250/client/mo + by-size), the AI-SOC anchor slides, objection handling ("why cheaper than Arctic Wolf?" → "we automated the analyst; you're not paying for headcount"), the transparency talk-track.

### Instrumentation (track to manage pricing as a living system)
Pricing-page views → plan-select → checkout funnel; resource-attach rate; tier mix; expansion/contraction events; discount applied; usage-vs-budget-cap; churn reason. (`agent_decisions` already carries `client_code` + `cost_usd`; add a `work_type` tag to separate monitoring from ad-hoc RCA for true per-client margin — the one open data gap.)

---

## 11. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Labor savings are modeled, not measured → ROI overclaim | Use conservative $250/client/mo in collateral; capture clean post-fix data (~1 wk) then refresh ceilings |
| Underpricing trains the market low | Land-grab is deliberate; publish the raise cadence; re-anchor narrative to AI-SOC category now |
| Auto-remediation over-promised (4 live ops today) | Frame as "expanding catalog" + the "would-have-caught-it" audit story; don't headline as fully autonomous |
| Microsoft E5 bundling commoditizes basic triage | Win on non-MS estates, cross-platform correlation, consolidation, deeper remediation |
| SKU sprawl (now 3 tiers + 10 resources + bundles) depresses conversion | Keep the *page* to 3 tiers + a resource calculator; resources are "add-ons", not visible tiers |
| Small-account margin | $299/mo platform minimum |

## 12. Sources
- **Internal:** tech-web-myjian — `docs/jian-system-overview.md` (§18a price book, App. C model rates), `docs/myjian-agent-pricing-model.md` (floor→ceiling per-agent model + live table), `docs/llm-cost-controls.md` ($6,382 incident, $100/key cap), `docs/llm-vs-sql-optimization.md` (99.6% gate), `docs/weekly-llm-sql-optimization/2026-06-12|14.md`, `docs/saas-pricing/2026-06-12|15.md`, `SPEC.md`; `scripts/agents/_jian.py`, `_router.py`, `_base.py`, `configs/price_list.json`. tech-branding — `Services/My Jian AI Agent/my-jian-pricing-spec.md` (V3.1), Price Sheet / Brochure / One-Pager HTML. Vault — `project_jian_ai_agent_marketing`, `reference_my_jian_siem_ingest`, `reference_msp_rate_card`.
- **Competitor pricing (fetched 2026-06-15):** microsoft.com/security/pricing (SCU $4/$6/hr, E5 inclusion 2025-11-18); vendr.com marketplace (Prophet $20–42K, Torq $59–378K, Moveworks ~$130K, Aisera ~$90–108K, Arctic Wolf ~$80–96K, Vanta $20K, Drata $24.9K); AWS Marketplace (Simbian $10K); sourceforge/intezer (Dropzone $36K); crowdstrike.com/charlotte-ai; pagerduty.com/pricing/aiops ($699/mo add-on); ninjaone.com/pricing ($1.50–3.75/device); huntress.com/pricing; auvik.com/pricing; liongard.com; drata.com/pricing; vanta.com/pricing.
- **Method:** *Monetizing Innovation* (Ramanujam/Simon-Kucher); OpenView/Poyar usage-based + PLG benchmarks; ProfitWell/Paddle value-metric & NRR; a16z pricing essays; Van Westendorp / Gabor-Granger / conjoint / MaxDiff.
