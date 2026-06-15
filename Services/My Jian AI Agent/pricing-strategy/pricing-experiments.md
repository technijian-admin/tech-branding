# My Jian AI Agent — Pricing Experiment Backlog (prioritized)
2026-06-15 · companion to SAAS_PRICING_STRATEGY.md

Rule: **price/packaging A/B runs on NEW visitors or NEW cohorts only — never on existing customers' renewal price.** Always grandfather on increases.

| # | Experiment | Hypothesis | Primary metric | Guardrail | MDE / sample | Duration |
|---|---|---|---|---|---|---|
| 1 | **Core land price $9 → $12** (new visitors) | +33% base ARPA with <10% conversion loss (Core is far below WTP) | revenue/visitor | trial-start rate, attach rate | ±10% conv, ~1,500 sessions/arm | 4–6 wks |
| 2 | **Introduce $16 Plus tier** (3-tier vs current 2-tier) | a middle tier lifts mix off Core and raises blended ARPA (Good-Better-Best) | blended ARPA / new logo | Compliance-tier share (don't cannibalize) | ±$3 ARPA, ~300 new logos | 8 wks |
| 3 | **14-day trial vs sales-pilot** | self-serve trial shortens cycle + lifts SMB conversion (category barely offers trials) | trial→paid % vs pilot→paid % | sales-cycle length, ACV | ±5pts, ~200/arm | 8 wks |
| 4 | **Resource-attach nudge in monthly report** | in-report "Jian found an unmonitored SQL/firewall" prompt lifts attach → NRR | resources/account 90-day Δ | unsubscribe / complaint rate | +0.3 resources/acct, all clients | 1 qtr |
| 5 | **SQL Server price discovery $99 vs $149 vs $199** (Gabor-Granger + live) | labor ceiling (~$1,272/client/mo) supports >$99; find revenue-max point | revenue/SQL-SKU | attach rate at each point | survey 40–60 + live ladder | 6 wks |
| 6 | **vCenter / firewall raise test** | 1.5–3× AI-SOC headroom → modest raise holds conversion | revenue/SKU | attach rate | ±10% conv | 6 wks |
| 7 | **Free "Jian Watch" single-resource tier** | free read-only land wedge → upgrade-to-act funnel + proof data | free→paid % within 60d | serving cost (≈$0), support load | ~2–5% B2B PLG conv | 1 qtr |
| 8 | **Annual default toggle on/off** | defaulting to annual lifts annual-plan share + cash/retention | % annual plans | total conversion | +10pts annual share | 4 wks |
| 9 | **MSP wholesale rate 40% vs 50% off retail** | finds the channel margin/volume sweet spot | partner-signed clients × margin | partner churn | ±5 partners | 1 qtr |
| 10 | **Autopilot outcome add-on (per-incident-resolved pack)** willingness | heavy-automation clients will pay to capture remediation value | add-on attach % among Plus/Compliance | base-plan downgrade | ±5pts attach | 1 qtr (post-V2) |

**Instrumentation prerequisites:** pricing-page view → plan-select → checkout funnel events; resource-attach tracking; tier-mix dashboard; `work_type` tag on `agent_decisions` (separate monitoring vs ad-hoc RCA) for true per-client margin; discount-applied + churn-reason capture.

**Sequencing:** run #1 + #3 + #8 first (fast, independent, low-risk). #2 (Plus tier) is the highest-value structural test — run once #1 establishes the Core baseline. #5/#6 price-discovery before any list raise. #7/#9/#10 are channel/PLG/outcome bets for the next two quarters.
