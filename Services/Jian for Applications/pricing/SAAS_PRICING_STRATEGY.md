# SaaS Pricing & Packaging Strategy — Jian for Applications
Generated 2026-06-15 · Technijian · prepared as the source-of-truth pricing model behind the Jian for Applications datasheet, brochure & price sheet.

---

## Executive Summary

**Jian for Applications** develops and runs bespoke, client-specific AI agents that monitor a client's
revenue-critical line-of-business application (read-only: watch → trace → alert → worklist; never auto-acts).

- **Value metric:** **per application agent** (one agent watches one app / data source / integration), **tiered by complexity** (Essential / Professional / Platform). This is the unit the buyer counts, it scales as they add apps, and it's metered trivially.
- **Monetization model:** **two-part hybrid** — a **one-time Build (development) fee** + an **ongoing monthly Subscription (the watch)**. This mirrors how the market already buys this: you pay a dev shop to *build* an agent, and you pay a SaaS/AMS vendor to *run/maintain* it. We do both, on one engine.
- **The 3 tiers + Enterprise anchor:**

  | | **Essential** | **Professional** ⭐ | **Platform** | **Enterprise** |
  |---|---|---|---|---|
  | Build (one-time) | **$6,000** | **$15,000** | **$30,000** | Custom |
  | Subscription | **$249/mo** | **$499/mo** | **$899/mo** | Custom |
  | Annual (2 mo free) | $2,490/yr | $4,990/yr | $8,990/yr | Custom |

- **#1 thing this changes:** replaces the prior vague bands ("$8–25K / $250–500 / Retainer") with a **named, competitively-anchored, defensible tier ladder** that a rep can quote and a buyer can self-select into.
- **Expected impact:** higher realized ASP (the middle tier lands at **$499/mo + $15K build** vs the old $250–500 floor), a clear expansion path (more agents → tier upgrades → platform bundle → Managed Ops), and a transparent story that wins against opaque APM and "% of collections" RCM vendors.

---

## Product & Market Assessment

**What the buyer replaces:** (a) a custom **dev-shop build** to instrument their app, (b) a **generic APM/observability** subscription that watches infrastructure but not business logic, and (c) the **dev/AMS retainer** that keeps the app alive. Today they buy these from three different vendors; Jian collapses them into one.

**Status-quo cost (the value we protect), grounded in the ORX baseline:**
- A **95-day feed freeze** hid **~9,295 claims** from the management app — invisible to every infra tool.
- **~1,615 service lines / ~$180K** were billed in-system but **never transmitted** to the payer.
- **~6,000 rejections** aged unworked; at the **MGMA $30/denial** handling benchmark that's ~$180K of denial-handling cost.
- The institutional knowledge left with the off-boarded developer (bus-factor = 1).

**Value Inventory**

| Capability | Buyer outcome | Replaces | DIY/alt cost | Differentiator? | Tier |
|---|---|---|---|---|---|
| Single-source health/recency watchdog | Know the instant a feed/job stops | a cron + nagios + a human | $5–15K build | table stakes | Essential |
| Multi-source business-logic detections | Catch "billed but never sent," stale syncs | custom dev + APM | $20–80K build | **differentiator** | Professional |
| End-to-end record tracing + worklists | Hand the team the exact fix list | manual SQL spelunking | analyst hours | **differentiator** | Professional |
| Deep SP→API→MCP integration / correlation | Operate the hardest revenue logic | custom multi-agent build | $60–100K+ build | **differentiator** | Platform |
| Branded alerts (email + Teams + ticket) | Never a silent failure | n/a | — | delighter | all |
| Managed Operations (operate/fix/modernize) | Replace the dev shop | AMS contract | 15–20% build/yr | enterprise-only | add-on |

---

## The Value Metric

**Recommended: per application agent, tiered by complexity.** Runner-up was *per monitored application* (too coarse — a 1-source app and a 6-system platform would pay the same) and *per record/claim volume* (punishes the client's growth — exactly backwards for an NRR engine). "Per agent" wins the good-metric test: **aligned** (more apps/logic → more agents), **predictable** (you count agents, not events), **scalable** (the expansion engine), **simple** (one line each), **hard to game**, **measurable**. Complexity tiers are the secondary fence that captures build effort and depth-of-value.

**Metering:** trivial — we provision and name each agent; there is nothing volatile to meter, so the bill never surprises (the #1 churn cause in usage pricing is designed out).

---

## Packaging (tiers & fences)

Three visible tiers + an Enterprise anchor. **Professional is the target tier** — it's the one a real app needs (multi-source + business logic + tracing + worklists), and the value cliff from Essential is obvious.

| Tier | Target buyer | What it watches | Key adds | Upgrade trigger | Excluded (upsell) |
|---|---|---|---|---|---|
| **Essential** | a single feed / job / data source | health, recency, threshold detections on one source | branded alerts, monthly report | "we need it to understand our process, not just ping it" | business-logic detections, tracing |
| **Professional** ⭐ | a full line-of-business app | multi-source + business-logic detections, end-to-end record tracing, fix worklists | everything in Essential + worklists + tracing | "we have a second/third system in this flow" | deep MCP integration, correlation |
| **Platform** | a deep, multi-system revenue flow | full SP→API→MCP integration, cross-system correlation, the hardest logic | everything in Pro + MCP + correlation + priority | "we want you to operate it, not just watch" | Managed Operations |
| **Enterprise** | a portfolio of apps / org-wide | multiple platforms, custom SLA, dedicated | custom frameworks, SLA, dedicated CSM | — | — |

**Entry wedge (not a tier):** a **free 2-week read-only monitoring pilot on one data source** — generates the "it would have caught this" proof before a dollar of build is quoted. (Mirrors the proven "Jian Watch" wedge on the core platform.)

---

## Recommended Pricing

**Two parts, always: Build (one-time) + Subscription (monthly).**

| | Essential | **Professional** ⭐ | Platform | Enterprise |
|---|---|---|---|---|
| **Build (one-time)** | **$6,000** | **$15,000** | **$30,000** | Custom |
| **Subscription** | **$249/mo** | **$499/mo** | **$899/mo** | Custom |
| **Annual (2 months free, ~17%)** | $2,490/yr | $4,990/yr | $8,990/yr | Custom |

**Mechanics**
- **Annual prepay:** 2 months free (~17% off), shown as the default.
- **Platform bundle:** **3+ agents on one application → 15% off the monthly** (drives "watch the whole platform").
- **Minimum engagement:** **$499/mo** (one Professional agent or equivalent).
- **Managed Operations (optional, separate line):** we operate, fix & modernize the app itself — **retainer from $2,500/mo** or T&M on the Technijian managed-services rate card. This is the AMS/dev-shop replacement; priced and sold separately from the SaaS watch.

**ORX worked example** — 3 agents on the claims platform (1 Platform + 2 Professional):

| Agent | Tier | Build | Subscription |
|---|---|---|---|
| Waystar clearinghouse (837 EDI + REST + leak/rejection logic) | Platform | $30,000 | $899/mo |
| OXPLive feed watchdog (OrthoXpressDB → OXPLiveNG) | Professional | $15,000 | $499/mo |
| DaisyBill 837 MCP (workers-comp sync/health) | Professional | $15,000 | $499/mo |
| **À la carte total** | | **$60,000** | **$1,897/mo** |
| **Platform bundle (−15% monthly)** | | **$60,000 one-time** | **$1,612/mo** |

> Context: an equivalent **custom multi-agent build alone runs $100K–$500K**; full **APM + AMS** for this platform would exceed **$2,000/mo** and still wouldn't understand a single claim. ORX gets business-logic monitoring of its entire revenue cycle for **$60K once + $1,612/mo** — less than the cost of **one** of the billing events it prevents.

---

## Monetization Model

**Hybrid (one-time build + monthly subscription) is correct and market-native:**
- The **build fee** matches how custom AI agents / MCP servers / integrations are bought (one-time, $5K–$300K+). We sit at the **low end** of that range because the Jian engine already does ~80% of the work — the buyer only funds the app-specific logic. That's the whole margin and positioning story.
- The **monthly subscription** matches APM/observability (recurring, per-host/usage) and AMS maintenance (15–20% of build/yr). Our per-agent fee is **comparable-to-below** a real APM deployment while being **business-logic-aware**, not infra-generic.
- **AI cost pass-through:** tokens are **bundled into the subscription, not metered** (real COGS ≈ $5/client/mo of LLM; pennies per agent). Guardrail: internal LiteLLM budget cap; no per-token line item ever reaches the client invoice. This protects gross margin without a surprise-bill mechanic.

**Discount discipline:** never cut the list price; concede on **term** (annual/multi-year), **scope** (bundle), or **ramp**. Build is fixed-fee per tier; Managed Ops is the negotiable, scope-based line.

---

## Competitive Landscape

| Category / Vendor | Model | Entry | Real-platform cost | Gated / opaque? | Where Jian wins |
|---|---|---|---|---|---|
| **Datadog** (APM+Infra) | per host, stacks | $15/host infra + $31/host APM | $500–1,500+/mo | published but stacks fast | watches *infra*, not business logic |
| **New Relic** | per full user + per-GB ingest | $349/user + $0.30–0.60/GB | $500–2,000+/mo | published, ingest-driven | same — generic telemetry, no claim logic |
| **Dynatrace / AppDynamics** | per host-hour / per APM agent | ~$22–29/host full-stack | custom, premium | "contact sales" common | same; enterprise-priced |
| **Custom AI-agent / MCP dev shop** | one-time build | $5–15K simple / $20–80K mid / $60–100K+ complex | + 15–30%/yr maint. | project-quoted | we reuse an engine → build at the **low end**, and we *run* it |
| **Application Management Services (AMS)** | retainer / 15–20% of build/yr | custom | $625–833/mo per $50K app | custom | we add the AI watch, not just keep-the-lights-on |
| **Healthcare RCM / denial-mgmt** | % of collections / contact sales | opaque | opaque | **mostly hidden** | **transparent flat fee** + we catch what they don't (the un-sent claim) |

**Insights / white space**
1. **Two markets, one buyer:** the build (dev shop) and the run (APM/AMS) are sold by different vendors. **Nobody bundles bespoke-build + business-logic-watch on a reusable engine.** That's our lane.
2. **APM is blind to money.** Every host/span tool would show ORX "green" while $180K silently failed to transmit. Our wedge: *"APM watches the plumbing; Jian watches the money."*
3. **Opacity is the category norm** (RCM "% of collections," enterprise APM "contact sales"). **Transparent, published tiers are the trust play** — same moat as the core Jian platform.
4. **Custom AI-agent builds are scary-priced** ($25K–$300K+). Anchoring "**from $6,000 to build**" reframes us as the obvious, de-risked entry.

---

## Expansion & Retention (the NRR engine)

**Target NRR > 120%.** Drivers, in order of leverage:
1. **More agents** — the client adds apps / data sources (each a new agent). Primary expansion vector.
2. **Tier upgrades** — Essential → Professional as they want logic not pings; Professional → Platform as systems multiply.
3. **Platform bundle** — lands the whole revenue flow, raises switching cost.
4. **Managed Operations** — the high-ACV cross-sell (operate the app).
5. **Annual / multi-year** — locks retention, improves cash.

**Upgrade triggers** are surfaced *in the monthly report* (e.g., "Agent X traced 240 records this month — Professional tracing would have auto-worklisted them"). **Downgrade flow:** pause the watch (keep the agent provisioned) instead of cancel; the build is sunk, so churn is structurally low. **Price increases:** grandfather existing agents 12 months; raise new-client list first; cadence of small increases tied to shipped detections.

---

## Unit Economics & Guardrails

| Tier | Price/mo | COGS/mo (LLM+infra) | **Gross margin** |
|---|---|---|---|
| Essential | $249 | ~$12 | **95%** |
| Professional | $499 | ~$12 | **98%** |
| Platform | $899 | ~$12 | **99%** |

- All tiers clear the 75–80% GM floor by a wide margin (COGS is pennies; the engine is amortized).
- **Build** is high-margin one-time eng labor against a reusable engine (we build only the app-specific layer).
- **Red-flag check:** none. The only structural cost is one-time build labor — recovered by the build fee; the subscription is ~pure margin. The risk is **under-pricing**, not under-margin — hence pricing to value/competition, not to cost.

---

## Rollout Plan

- **Collateral:** apply the tier table to the **datasheet** (pricing block) and **brochure** (pricing page), and ship a standalone **Price Sheet** (HTML+PDF) — consistent numbers across all three (single source = this doc).
- **Sales motion:** bespoke / sales-assisted (not self-serve). Entry = free 2-week pilot → scoped build quote → subscription. Discovery is where the tier is set.
- **Experiments:** (new prospects only) A/B the **build anchor** ("from $6,000" vs "from $15,000"), the **pilot length** (2 vs 4 weeks), and the **bundle discount** (15% vs 20%). Never A/B an existing client's renewal.
- **Migration / grandfathering:** ORX (the flagship) is quoted on these tiers; any earlier verbal indicative number is superseded by the platform-bundle figure with the "you're getting a named, SLA-backed model" framing.
- **Instrumentation:** track quote→build→subscription conversion, agents-per-client (expansion), tier mix, and pilot→paid rate.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Build sticker shock | Lead with "from $6,000" + the $100K+ custom-dev anchor; offer to fold build into a 24-mo subscription. |
| "Why monthly if it's read-only?" | Frame the subscription as continuous monitoring (APM comp) + the living runbook + the eng on-call — not "maintenance." |
| Scope creep on Managed Ops | Keep it a **separate, scoped** line (retainer/T&M); never blend into the SaaS tiers. |
| Margin erosion from heavy LLM use | Tokens bundled but capped (internal LiteLLM budget); upsell heavy automation to Managed Ops, don't meter tokens. |
| Competitor undercut on price | We don't compete on price vs APM — we compete on **relevance** (business logic) and **transparency**; the value protected dwarfs the fee. |

---

## Sources

Competitor data (fetched 2026-06-15):
- Datadog pricing — Last9, Finout, MonitoringCost (Infra $15/host, APM $31–40/host, stacks).
- New Relic pricing — SigNoz, CloudZero, MonitoringCost (full user $349/mo, $0.30–0.60/GB ingest, 100GB free).
- Custom AI agent build cost — SoftTeco, ProductCrafters, DestiLabs ($5K–$300K+; tiers $5–15K / $20–80K / $60–100K+; maint 15–30%/yr).
- Application Management Services / software maintenance — Everest Group, Savi/Gartner rule (15–20% of build/yr; retainer model).
- Healthcare denial management / RCM — BillingParadise, MD Clarity, MGMA ($30/denial; mostly % of collections / contact-sales).

SaaS pricing canon applied: *Monetizing Innovation* (Ramanujam/Simon-Kucher) value-first + good-better-best; ProfitWell/Paddle value-metric & expansion; OpenView/Poyar hybrid usage model; a16z packaging. Method per the `saas-pricing-expert` skill.

Internal anchors (not exposed to clients): direct COGS ~$12/client/mo (LLM ~$5 + infra ~$7); 85–92% blended GM; Chat.AI BespokeCustom-MCP band $8–25K + $150–500/mo; internal labor-value model $250–500/agent/mo.
