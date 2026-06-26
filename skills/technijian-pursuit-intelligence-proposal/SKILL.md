---
name: technijian-pursuit-intelligence-proposal
description: Generate a Technijian "AI Pursuit Intelligence" proposal — a focused, forwardable branded PDF that repositions My AI Lead Gen as a TIMING play (surface a client's next pursuit 3–12 months BEFORE the RFP/solicitation) for an account-based (ABM) client. Airy AI-Growth-Report format, published My AI Lead Gen pricing, client-specific signal layers, the OC-builder proof. Use for ABM firms (AEC/architecture, environmental, gov-contracting, professional services, niche B2B) when you want to pitch the pursuit-intelligence product as ONE standalone proposal — not the full AI Growth blueprint. Triggers: "AI Pursuit Intelligence proposal", "pursuit intelligence", "AI Lead Gen proposal for <client>", "the same report/proposal as Danielian / MBC".
---

# Technijian AI Pursuit Intelligence Proposal

## Overview

A premium, **standalone business-development proposal** that shows one ABM client *exactly* how Technijian's **My AI Lead Gen** product — repositioned as **"AI Pursuit Intelligence"** — wins them more work by surfacing their next pursuit **3–12 months before the RFP / on-call solicitation / RFQ posts.**

**The thesis (the one idea the whole document sells):** a specialist firm's next pursuit is already visible in public data today — a buyer just funded a project, filed an early notice, or started a permit/renewal clock — but it doesn't reach the firm until the formal solicitation posts, by which point every qualified competitor sees the same notice at the same moment. AI Pursuit Intelligence changes that *sequence*: harvest the early public signals, enrich + score them against the client's criteria, and deliver a weekly **Pursuit Intelligence Brief** so the firm activates relationships *before* it's a competition.

**Keywords**: AI Pursuit Intelligence, My AI Lead Gen, pursuit intelligence, account intelligence, ABM, timing play, RFP/RFQ/SOQ, on-call master agreement, signal monitoring, named-account, branded proposal PDF, biz dev.

**Canonical examples (study these — both built 2026-06-25):**
- `Clients/DAS/build-das-proposal.py` → `Danielian-AI-Pursuit-Intelligence-Proposal.pdf` — architecture/AEC firm (Danielian Associates). Signals = building permits, planning-commission agendas, CEQA/EIR, land transfers, HCD filings, SB 79, developer news.
- `Clients/MBCA/build-mbca-proposal.py` → `MBC-AI-Pursuit-Intelligence-Proposal.pdf` — environmental-science consultancy (MBC Aquatic Sciences). Signals = agency CIP budgets, CEQA/NEPA, NPDES & CWA §316(b) cycles, board agendas, federal forecasts, on-call solicitations, infra funding, prime/A-E teaming.
- **Template builder:** `skills/technijian-pursuit-intelligence-proposal/build-proposal-template.py` — copy this, fill the `# >>> FILL` blocks, render.

**Relationship to other skills:**
- This is **NOT** the full `technijian-biz-dev-blueprint` (AI Growth Report). The blueprint is the 20–70pp whole-business strategy (growth + integration, all buyer segments, competitive landscape, capability proofs). **This proposal is one focused product pitch** — the My AI Lead Gen / pursuit-intelligence module, sold as a single forwardable 12–16pp PDF. Build the blueprint first (or alongside); this proposal is the standalone "here's how the pursuit engine specifically works for you" follow-on. Section 9 explicitly maps it back into the broader program.
- Reuses the **airy AI-Growth-Report visual format** (see `technijian-biz-dev-blueprint` / the DAS `Danielian-AI-Growth-Report.pdf`).

---

## When to use it — and when NOT to

**Use it when:** the client is **account-based (ABM)** — they win work through a finite, *named* universe of buyers via relationships, referrals, RFPs/RFQs/SOQs, on-call master agreements, or prime/A-E teaming. Examples: AEC/architecture/engineering, environmental/marine science, government contracting, professional services (legal, accounting, consulting), niche B2B. You want to pitch the pursuit-intelligence engine as a concrete, priced, standalone deliverable.

**Do NOT use it (or reframe heavily) when:** the client is **broad demand-gen** (local consumer services — auto, home services, healthcare practices, beauty, food — where success = more anonymous leads in a funnel). For those, the product is straight "My AI Lead Gen" demand-gen, not this ABM "pursuit/timing" framing. **The single biggest failure mode is using lead-gen language ("fill your funnel", "cold list", "shotgun outreach") for an ABM client** — see `feedback_pitch_abm_not_leadgen`.

---

## The proven format — do not re-derive it

The builder is **self-contained HTML → Letter PDF via Playwright/Chromium** (Python), modeled on `Clients/DAS/build-das-brief.py`. It uses **PyMuPDF (`fitz`)** to rasterize every page for proofread. Toolchain is already installed (playwright, fitz, PIL).

**Match the airy "AI Growth Report" look exactly** (this took iteration — the first build was too dense and was rejected; do not repeat that):
- **1 inch margins** all around (`margin={"top":"1.0in","bottom":"0.85in","left":"1.0in","right":"1.0in"}`).
- **Body 13px, line-height 1.62, justified.** Open Sans (Google Fonts @import + Arial fallback).
- **Each numbered section starts on its own page** (`.sech { break-before: page; }`). Generous bottom-of-page whitespace is INTENTIONAL here (it is a long-form report, not a one-pager — the "fill every page" rule does NOT apply).
- **Cover:** thick blue banner → large centered AUTHENTIC logo (~58px) → orange rule → big charcoal `<CLIENT NAME>` → blue "AI Pursuit Intelligence" → grey subtitle → the **one-line case** (the thesis in 3–4 sentences) → prepared-for/by meta → orange bottom banner → locality line → CONFIDENTIAL.
- **Running header (every page):** authentic logo (~28px) left + "AI Pursuit Intelligence · `<Client>`" right, with a 2px blue underline under the title. **Footer:** `Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8499 | technijian.com | CONFIDENTIAL | Page X of Y` (use Playwright `display_header_footer` + `pageNumber`/`totalPages`).
- Section headers = colored vertical bar + bold colored title. KPI cards, blue-header zebra tables, colored-left-spine callouts, 4-stage cards, program-stack bands — all in the template CSS. Brand colors from `brand-tokens.json`: BLUE `#006DB6`, ORANGE `#F67D4B`, TEAL `#1EAAC8`, DARK `#1A1A2E`, GREY `#59595B`, OFF `#F6F8FA`.

Output lands ~12–16 pages, ~1 MB. Name the PDF with the **real company name**, e.g. `<RealName>-AI-Pursuit-Intelligence-Proposal.pdf`.

---

## The 11-section structure (+ appendix)

Keep this spine; adapt the content. (`<Client>` = real company name / natural short form.)

1. **How `<Client>` Wins Work Today — and Where the Signal Arrives Too Late.** KPI row (4 cards) + a horizontal "signal arrives late" timeline (buyer acts → time passes → solicitation posts → client sees it, same moment as rivals) + "what the team watches manually today" + the *coverage problem*.
2. **What AI Pursuit Intelligence Delivers.** The 4-stage engine: **Harvest** (the client-specific SIGNAL-LAYER table — the heart of the doc) → **Enrich** → **Score** → **Deliver** (the weekly Pursuit Intelligence Brief, with example triggers).
3. **Why This Is Fundamentally Different from Current Methods.** Comparison table (the generic tools they'd otherwise use vs. AI Pursuit Intelligence) + the **"timing play, not a cold-list/bid-chasing play"** callout.
4. **Why Now.** 3 client-specific, time-bound drivers (a funding/regulatory wave + a predictable cycle the client can exploit + the field's AI-readiness gap).
5. **Proof — the Engine Is Already Running.** The **OC Luxury Home Builder** My AI Lead Gen case (24 enriched Tier-1 leads in one 75-minute run; 7 signal layers; 10 jurisdictions; 60+ HOA committees) + "the adaptation for `<Client>`" + an **honest boundary** callout (the engine is proven; configuring it for *this* niche is what the pilot does).
6. **What `<Client>`'s Pursuit Team Gets, Day to Day.** Before/After table + the decision-maker's read + the practitioner's read (and, where the client's deliverables carry professional/regulatory weight, the "the licensed professional still signs" boundary).
7. **What This Is Not.** 4 honesty boundaries: not a generic bid/cold-list play; not "AI wins it by itself"; not replacing relationships/referrals; not data brokering (public records only).
8. **Investment & ROI Framework.** Entry-scope table + the **published My AI Lead Gen tier table** + the pilot anchor + an **illustrative, arithmetically-exact ROI** + an efficiency (hours-recovered) callout.
9. **Relationship to the Broader AI Growth Program.** The program stack (ENTRY / PURSUIT ENGINE / INSTITUTIONAL KNOWLEDGE / FOUNDATION) + the "only the pilot is committed scope" caveat.
10. **Why Technijian, Why Now.** Two callouts (we've built this engine already + the client-specific time-bound reason) + a direct line to the decision-maker.
11. **Proposed Next Steps.** Discovery → scoping → 90-day pilot → expansion table + a closing CTA band.

**Appendix — Key Contacts.** The real champion map (decision-maker / pursuit owner / any technical or budget gate). Footer: Technijian one-line + confidential notice.

---

## The heart of the work: client-specific SIGNAL LAYERS

The Stage-1 "Harvest" table is what makes this proposal *theirs* and not a template. **Derive 7–8 signal layers from how this client's buyers actually fund, plan, and procure work** — the public artifacts that appear *before* the formal solicitation. Research the client's procurement reality (their `/projects`, `/clients`, the agencies/buyers they serve, the regulatory cycles they live on). Patterns by client type:

| Client type | Early public signals (examples — research the real ones) |
|---|---|
| **AEC / architecture** | building permits, planning-commission & DRB agendas, CEQA/EIR notices, county-recorder land transfers, HCD/density-bonus filings, upzoning legislation, national-builder PR |
| **Environmental / scientific consulting** | agency CIP budgets, CEQA/NEPA notices (NOP/scoping/EIR), NPDES & permit-renewal cycles, board/commission agendas, federal procurement forecasts (SAM.gov/USACE), on-call solicitations, infrastructure/bond funding, prime/A-E teaming |
| **Gov-contracting / prof. services** | agency budgets & forecasts, RFP/RFI pipelines, incumbent-contract expiration calendars, board agendas, grant/funding announcements, regulatory triggers, teaming/sub opportunities |

Each row: **Signal Layer | What It Surfaces | Why It Matters for `<Client>`.** Then Enrich (identity, project type, the client's prior history/incumbency at that buyer/site, scope/timeline, relationship flag), Score (Fit / Relationship-or-incumbency / Timing / Segment), Deliver (Tier-1 list + dossiers + incumbency/teaming triggers with concrete examples in the client's own world).

---

## Adaptation methodology — per client

1. **Confirm GTM = ABM** (see "When to use"). If demand-gen, stop and reframe — this skill's framing is wrong for them.
2. **Ground in real facts first.** Read the client's `_research.md` / blueprint / website. Use real buyer names, segments, regulatory cycles, and prior projects (incumbency is a huge angle). Never invent.
3. **Reframe My AI Lead Gen → "AI Pursuit Intelligence."** Timing + incumbency play; never "lead generation/funnel/cold list" for ABM.
4. **Derive the 7–8 signal layers** from their procurement reality (above). This is the differentiator.
5. **"Why Now"** = client-specific and time-bound (a funding/regulatory wave + a predictable cycle to exploit + the AI-readiness gap). Drop another client's drivers (e.g., don't carry "SB 79" or "EOS" to a non-AEC/non-EOS client).
6. **Proof** = the OC builder case, framed honestly (proven engine; first-in-niche config is the pilot) per `feedback_capability_proof_built_vs_service`.
7. **Pricing** = **published My AI Lead Gen tiers only** (see below). Map the client's multi-segment universe to **Professional** as "the fit," and offer the **Starter** tier scoped to their single highest-value segment as a conservative on-ramp (`feedback_price_conservative_land_and_expand`).
8. **ROI** = illustrative, grounded in the client's (illustrative) average engagement value, **arithmetically exact** (pick inputs that yield a whole-number win count — e.g. N pursuits × win% = an integer — so `pursuits × rate × value` is internally consistent). Label "illustrative; rebuilt with the client's actual figures at discovery." Call out the highest-value non-numeric outcome (e.g. defending an incumbency).
9. **Prepared-for the right person**, and check the **relationship**: if the client is a warm/Vistage/existing relationship, say so in the framing and prepare it for the actual decision-maker — don't default to "cold." (Many of these are warm — confirm.)
10. **Drop the donor client's specifics.** Champion titles, operating systems (EOS), and laws are client-specific — re-derive, don't copy.

### Published My AI Lead Gen pricing (verify against the current brochure before each use)
| Tier | Monthly | Scope |
|---|---|---|
| Starter | $1,499/mo | 1 vertical · 500 leads/mo |
| **Professional** (typical fit) | **$3,499/mo** | 3 verticals · daily runs · 2,500 leads/mo |
| Enterprise | $6,999/mo | Unlimited verticals · 10K+ leads/mo |

90-day pilot at Professional ≈ **$10,500** + a one-time signal-architecture configuration (scoped at the discovery quote). If a client's blueprint already priced ABM differently, reconcile with the **"only the pilot is committed scope"** caveat in Section 9.

---

## Hard guardrails (the corrections that bite — read before building)

- **NO internal client CODE in the rendered PDF or its filename** (`feedback_no_client_code_in_deliverables`). Use the real company name ("MBC Aquatic Sciences"/"MBC", "Danielian Associates"/"Danielian") — never the Technijian code (MBCA, DAS, RKE…). The code is fine for the repo folder and the `build-<code>-proposal.py` script name only. **Verify:** extract the rendered PDF text with PyMuPDF and grep `\b<CODE>\b` → must be 0.
- **AUTHENTIC logo only** (`feedback_logo_use_authentic_files`): `assets/Technijian Logo 2.png` on light backgrounds. **Do NOT** use `assets/logos/png/technijian-logo-*` (AI fakes) — note that `brand-tokens.json`'s logo path points to the fake, so don't trust it. (The fake happens to look identical, but use the authentic file for compliance.)
- **Published/real pricing only, else TBD** (`feedback_no_invented_pricing`).
- **ABM framing** — never lead-gen/funnel/cold-list language for an ABM client (`feedback_pitch_abm_not_leadgen`).
- **Capability-proof honesty** — only the OC-builder case is "built"; the client config is forward-looking/first-in-niche (`feedback_capability_proof_built_vs_service`).
- **Proofread math + every page** (`feedback_collateral_math_proofread`): rasterize every page, eyeball the logo/colors/format, audit every number, confirm zero mojibake (em/en dashes, curly quotes, `·`, `→`, `×`, `§` all render — use HTML entities `&mdash; &ndash; &rsquo; &ldquo; &rdquo; &middot; &rarr; &times; &sect;`).
- **Airy format** — render and eyeball; the section-per-page whitespace is intended.

---

## Build + proofread workflow

```powershell
# 1. Copy the template into the client's folder and rename:
#    skills/technijian-pursuit-intelligence-proposal/build-proposal-template.py
#    -> Clients/<CODE>/build-<code>-proposal.py
# 2. Fill every  # >>> FILL  block with researched, real, code-free content.
# 3. Render + auto-proofread (the script rasterizes every page + checks for the code):
python "Clients/<CODE>/build-<code>-proposal.py"
# 4. View the _proof_p##.png pages (and half-crops if dense); fix; re-render.
# 5. Confirm: 0 client-code tokens, 0 mojibake, math exact, authentic logo, ~12–16pp.
# 6. Update the client's project memory + a vault session note. Deliverable is NOT sent
#    until Ravi reviews (see feedback_always_draft_before_send).
```

## Per-client customization checklist

- [ ] GTM confirmed ABM (not demand-gen)
- [ ] Real company name everywhere; **0 internal-code tokens** in the rendered PDF + filename
- [ ] 7–8 signal layers derived from THIS client's procurement reality
- [ ] "Why Now" rewritten with this client's time-bound drivers (donor-client laws/EOS removed)
- [ ] Proof framed honestly (proven engine; first-in-niche config = the pilot)
- [ ] Pricing = published My AI Lead Gen tiers; Professional fit + Starter on-ramp; ROI arithmetically exact
- [ ] Prepared-for the real decision-maker; relationship (warm/Vistage/existing vs cold) reflected
- [ ] Authentic logo; airy format; every page rendered + proofread; 0 mojibake
- [ ] Project memory + session note updated; NOT sent until reviewed
