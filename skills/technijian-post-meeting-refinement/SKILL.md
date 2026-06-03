---
name: technijian-post-meeting-refinement
description: Refine a Technijian biz-dev blueprint or strategic report into a Revision 2 AFTER the first client meeting. Folds the meeting transcript/notes into the document — tracing every claim to what the client actually said, upgrading confirmed opportunities to "validated", reshaping the market/competitive framing with the client's own lens, naming the real incumbent to complement-or-displace, repositioning Technijian services around what surfaced, and rewriting Next Steps to mirror what was agreed. Produces a branded DOCX + PDF Rev 2. Use after a discovery / proposal-review call when a transcript or notes exist.
---

# Technijian Post-Meeting Refinement (Blueprint / Report → Revision 2)

## What this is

The companion to `technijian-biz-dev-blueprint`. The blueprint (or a strategic/SEO report) is built **before** the first meeting from research. This skill rebuilds it **after** the first meeting, folding in everything the client said so the document stops being a cold hypothesis and becomes a validated, client-specific plan.

A blueprint is always stronger after the first meeting. The client corrects the facts, names the real competitors and incumbent, validates which opportunities matter, reveals budget and timing, and tells you their actual goal in their own words. Revision 2 captures all of it.

**Canonical worked example:** SC Fuels (SCF), June 2026.
- Input report: `Clients/SCF/SCFuels_Strategic_Report_Technijian_June2026.docx` (the pre-meeting SEO/GEO audit).
- Input meeting: `Clients/SCF/Derek Bettencourt - General Meeting.docx` (Teams recording transcript, June 2, 2026).
- Output: `Clients/SCF/SCFuels_Strategic_Report_Technijian_June2026_Rev2.docx` + `.pdf`, built by `Clients/SCF/build-scf-rev2.py`.

**Keywords:** post-meeting, follow-up, revision 2, rev2, refine proposal, fold in transcript, meeting notes, validated opportunities, incumbent, after the meeting, second meeting prep, sharpen the report.

**Related skills:** `technijian-biz-dev-blueprint` (the parent — build patterns, brand anchors, pricing discipline, quality gates all carry over), `technijian-voice`, `technijian-brand`, `proofread-report`.

---

## Phase 0: Gather the inputs

You need three things. The first two are mandatory.

| Input | Source | Why |
|-------|--------|-----|
| The original report/blueprint | `Clients/<CODE>/` | The thing you are revising. Read its full structure first. |
| The meeting transcript or notes | Teams recording `.docx`, Otter, hand notes | The source of truth for Rev 2. Read it end to end. |
| Any new facts that surfaced | The meeting + a quick web check | New incumbent (e.g., an existing agency), new competitor, new product names, budget signals. |

**Extracting a Teams `.docx` transcript:** use python-docx, walking the body in document order (paragraphs + tables). Force UTF-8 on stdout or you will hit a cp1252 `charmap` error on the en-dashes/arrows:

```python
import docx, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
doc = docx.Document(path)
for p in doc.paragraphs:
    if p.text.strip(): print(p.text)
```

If the report `.docx` extracts to almost nothing, it is the same encoding bug — not an empty file. Fix the encoding and re-run before assuming the file is broken.

---

## Phase 1: Mine the meeting (the heart of this skill)

Read the transcript and pull out, with quotes, each of these. **Trace every Rev 2 claim to something the client said out loud.**

1. **The client's actual goal, in their words.** This becomes the organizing idea of Rev 2. (SCF: Derek's "add business without [just] adding salespeople" → reframed as "AI lets one rep cover 2–4× the accounts." Everything in the plan now serves that one line.)
2. **Validated opportunities.** Anything the client confirmed ("yes, that's a service you'd help us with", "we have a budget approved for that") moves from *concept* to **validated**. Say so explicitly and date it.
3. **Corrections to your cold research.** Where the client said "you got this wrong" or "you missed X" — fix it and, ideally, show you heard it. (SCF: the competitive lens was wider than our research — fuel-card *networks* WEX/Voyager, not just other distributors; and the government/RFP gap.)
4. **The client's own framing of their market.** Their lens is usually more accurate and more expansive than your cold one. Use it. (CDLX: Nick's three-wave MFA-adoption story; SCF: Derek's generational-buyer shift.)
5. **The real incumbent to complement or displace.** Who already has the budget you are after? An existing agency, an in-house tool, a parent-company mandate. Name it. (SCF: WebFX, a multi-year SEO agency. Also a Pilot-parent AI benchmark: onboarding 27 days → 3 days.)
6. **Budget, timing, and authority signals.** "We got a budget approved to redo the website" = live project + timing. "I'll bring my number-two and Director of Sales & Marketing" = the next meeting's audience.
7. **What was actually agreed for next steps.** Rewrite "Next Steps" to mirror this exactly — not generic boilerplate. (SCF: Ravi promised a site + WebFX analysis "in a couple of days" → Rev 2 *is* that deliverable; next is the team working session.)
8. **New product/system names the client uses.** (SCF: InsightView, FleetSeek, Salesforce — the internal-AI pillar now speaks to these by name.)

Write these into a short `_meeting_notes.md` (or extend `_research.md`) in the client folder so the rebuild reads from notes, not memory.

---

## Phase 2: Confirm the two positioning forks with the user

Before rebuilding, two decisions usually change the whole document and are the user's to make. Ask them (AskUserQuestion), don't assume:

1. **Incumbent stance.** When the meeting reveals an incumbent (agency/tool), how aggressive should Rev 2 be?
   - **Better-value challenger** — Technijian does what the incumbent does *plus* the net-new AI work, at lower published cost; make the consolidation case while crediting the incumbent's real strengths.
   - **Complement, then offer more** — keep the incumbent where they are strong, add the AI layer they lack as net-new scope, and frame taking over their work as an *optional later* step. (Lower-friction; the right call when the relationship is multi-year and the client's team is still meeting the incumbent — SCF chose this.)
   - **Neutral decision framework** — even-handed capability + cost comparison, no switch recommendation.
2. **Cost specificity.** Do we know what the client pays the incumbent today?
   - **Yes** → model concrete monthly/annual savings against it.
   - **No** → compare Technijian's **published rates** to the incumbent's **public/typical ranges**, and flag "confirm current spend" as a discovery item. **Never invent the client's spend.**

These map directly to the engagement's risk. Getting the incumbent stance wrong is the fastest way to make the follow-up land badly.

---

## Phase 3: Reshape the document

Keep what the client praised; change what the meeting changed. Typical Rev 2 edits:

- **Add a "What We Heard — [date] Strategy Session" section near the front.** A validated-priorities table: *What the client said · What it means for the plan · Status (VALIDATED)*. This is the single most powerful Rev 2 addition — it proves you listened and front-loads the client's own goals. (See SCF Section 2.)
- **Re-open the Executive Summary** around the client's stated goal. Add a short "what changed in this revision" callout.
- **Update the company/market facts** the client corrected. (SCF: website is outdated/"still says family owned"; rebuild is budgeted.)
- **Reframe the competitive section** with the client's lens and name the incumbent honestly — strengths *and* gaps. The gaps are where Technijian's net-new AI work lives.
- **Reposition the Technijian services** around what surfaced. Often this means promoting net-new pillars the cold blueprint under-weighted — outbound lead gen, internal/CRM AI, a budgeted website rebuild — and tying each to a client quote.
- **Add the cost/operating-model section** per the Phase-2 decisions (coordinated-with-incumbent table; published-rate comparison; optional consolidation path).
- **Rewrite Next Steps** to mirror what was agreed, with the signature Book-a-Meeting CTA (see parent skill Phase 11).

Everything else from the parent `technijian-biz-dev-blueprint` still applies: research-driven section/persona/diagram counts (no fixed quotas), capability-proof-before-pitch, land-and-expand pricing, voice rules.

---

## Phase 4: Build it (reuse the parent's patterns)

Build a `build-<code>-rev2.py`. python-docx is the reliable path for an audit/report-style doc (the SCF Rev 2 builder is the reference). Carry over from the parent skill / brand:

- **Brand anchors from `assets/brand-tokens.json`** — Core Blue `006DB6`, Core Orange `F67D4B`, status colors; tagline "technology as a solution"; main line **949.379.8499**; Arial for report bodies.
- **Authentic logo only** — `assets/Technijian Logo 2.png` (light) / `assets/Technijian Logo - white text.png` (dark). The `brand-tokens.json` logo *paths* point at AI-regenerated fakes — ignore them. (See `feedback_logo_use_authentic_files`.)
- **Pricing discipline (`feedback_no_invented_pricing`)** — My SEO published tiers ($500–$1,500/mo + add-ons + DMA $100–$300/mo); My AI Lead Gen $1,499 / $3,499 / $6,999/mo; **My AI consulting + My Dev builds = "scoped at discovery"** (never an invented figure). Incumbent comparison uses the incumbent's *public* ranges; the client's actual spend is a discovery item unless they gave it to you.
- **Built-vs-service labels (`feedback_capability_proof_built_vs_service`)** — only say Technijian "built" something for delivered case studies; keep the FINRA "vendor questionnaires" Proven Result verbatim.

### Layout lessons baked in from the SCF build

- **Continuous flow beats a page-break-per-section.** Forcing every section onto a new page strands short sections on half-empty pages. Let content flow; delineate sections with a styled Heading-1 + an orange bottom rule. Only the cover and TOC get hard page breaks. (SCF dropped from 26 sparse pages to 18 dense ones with this one change.)
- **Set `w:cantSplit` on every table row** so tables don't break across a page boundary.
- **Auto-generate the TOC** via a `TOC \o "1-2"` field; update it on PDF conversion.
- **Color-code status/grade cells** (PASS/A green, WARN amber, FAIL/F/CRITICAL red, B blue, C grey, QUICK WIN green, URGENT red, NEW teal, STRATEGIC/HIGH VALUE blue) — it makes an audit table instantly readable.
- **Convert DOCX→PDF via Word COM** (python `win32com`), updating `TablesOfContents` and `Fields` first. Do it sequentially, never in a parallel batch.

---

## Phase 5: Quality gates (run before declaring done)

Inherit the parent skill's gates, plus these Rev-2-specific checks:

- [ ] **Every validated claim traces to a quote.** No opportunity is framed as a cold guess if the client already warmed it.
- [ ] **Incumbent handled per the Phase-2 decision** — strengths credited, gaps honest, stance (complement / challenger / neutral) consistent throughout.
- [ ] **No invented client spend; no invented Y1 total.** Published rates + "scoped at discovery" + "confirm current spend" only. Grep the output to confirm.
- [ ] **Next Steps mirror what was actually agreed** (audience, deliverable, timing) — not boilerplate.
- [ ] **Render EVERY page to PNG and look at it** at display size. Check: authentic logo on cover; no mojibake (real `—`, `–`, `→`, curly quotes); no table split awkwardly; no page whose *body region* is mostly empty.
- [ ] **Voice pass** — no banned words (`leverage`, `seamless`, `unlock`, `vendor` as "supplier", `end-to-end`, `cutting-edge`, `game-changing`, `revolutionary`). "vendor questionnaires" in the FINRA proof is the one allowed exception (verbatim term of art).
- [ ] **Filename marks the revision** — `..._Rev2.docx` — and the cover carries a "REVISION 2" tag. Preserve the original; do not overwrite it.

---

## Phase 6: The lighter artifact + outreach (optional)

Per the parent skill's Phase 10, an Executive Summary (4–7 pp) or 1-page Concept Brief can be built from the Rev 2 for the follow-up email — but it is **less necessary here than for a cold first-touch**: a post-meeting client whose team is preparing questions usually *wants* the full detail. Build the summary if the recipient is a busy exec who will forward it; otherwise the full Rev 2 is the right primary artifact. Outreach CTA always routes to the Book-a-Meeting button in Ravi's signature (parent skill Phase 11), and broadens the topic to "all the AI strategies Technijian is putting into place for itself and its clients."

---

## One-line summary

**Read the meeting like it's the brief — because it is.** The pre-meeting blueprint is your best guess; Revision 2 is the client telling you which guesses were right, what you missed, who the real incumbent is, and what they actually want. Capture that faithfully, decide the incumbent stance with the user, keep the pricing honest, and the second meeting writes itself.
