---
name: technijian-first-meeting-deck
description: Build the branded PowerPoint deck for a FIRST sales meeting with a new lead in ANY industry — a short, discovery-led conversion deck whose job is to align what Technijian can do with what that specific company needs (hook, credibility, 2–3 ways Technijian could help, discovery questions, soft next step). Use whenever someone needs a first-meeting deck, intro deck, discovery deck, prospect pitch, "deck for a sales call", or slides to present to a new lead/prospect to convert them. NOT for the heavy post-research AI Growth & Integration study (that is technijian-biz-dev-blueprint) and NOT for an existing-client QBR (that is technijian-qbr).
---

# Technijian First-Meeting Conversion Deck

Build the slide deck a Technijian rep brings to the **first conversation with a new lead** — the meeting whose only job is to earn the *next* meeting (a scoped assessment, a follow-up, a referral upward). This is the front door of the sales motion, not the close.

## The one idea that makes this deck work: it is discovery-led, not a pitch

A first meeting is won by *listening*, not by talking through 30 slides. The deck is a lightweight spine for a conversation the prospect should do most of the talking in. If the rep reads every slide aloud, the deck has failed.

So this deck is deliberately short (8–12 slides), heavy on credibility and questions, and light on pricing. It opens a relationship; it does not try to land a number. Build it that way — the temptation to dump the whole capability catalog or full pricing into the first meeting is the single most common way these go cold.

**When to use which deck:**
- **This skill** — first touch / discovery / "we just got introduced." Short, listen-first, soft next step.
- **`technijian-biz-dev-blueprint`** — the deep, research-driven AI Growth Report (DOCX/PDF, 20–40pp) built *after* you understand the account. Its companion pitch deck is the *second* meeting.
- **`technijian-qbr`** — existing client, recurring review. Not a new lead.

## Logo and PPTX mechanics: defer to `technijian-presentation`

Do not reinvent the PPTX plumbing. Read and follow **`technijian-presentation`** for: how to build with `pptxgenjs`, the slide-master colors, KPI tiles, tables, and — most importantly — **logo handling**. The non-negotiable rule from that skill, repeated here because a first impression is the worst possible place to get it wrong:

> **Use the real Technijian logo PNG via `addImage`. Never draw the wordmark with text boxes or colored squares. Reverse-white transparent PNG on dark slides, full-color PNG on light slides.** After rendering, convert the cover to an image and *look at it* — confirm the real dot-grid mark appears, correct aspect ratio. A fabricated logo silently signals "thrown together," which is fatal in a first meeting.

```
assets/Technijian Logo - white text.png   ← dark slides (cover, section, closing)
assets/Technijian Logo 2.png              ← light body slides
(both have aspect ratio w/h = 4.78 — size with h = w / 4.78)
```

> Do NOT use `assets/logos/png/technijian-logo-*` — those are AI-regenerated files with the WRONG icon (`feedback_logo_use_authentic_files`). The two assets-root files above are the authentic logos (the CNBC and JRMDF decks are the working reference).

All other brand values (colors, fonts, phone, addresses) come from `assets/brand-tokens.json` — the SINGLE SOURCE OF TRUTH; never hardcode (any literal value elsewhere in this skill is a cached convenience — read/sync from the JSON). Brand specifics that bite on a first impression:
- **Tagline:** "technology as a solution" (lowercase, no period). The old "Technology Support, Your Way." is RETIRED — never use it.
- **Contact / CTA number:** the MAIN switchboard **949.379.8499** (reaches USA + India). 949.379.8500 is Sales-direct only; 949.379.8501 is Billing-direct only — neither belongs on the deck's contact/closing.
- **Offices:** Irvine HQ (18 Technology Dr Ste 141, Irvine CA 92618) + Panchkula, India delivery center.

## The slide arc

Keep it to this spine. Cut anything that does not earn its place. Every slide has a *job*; if a slide's job is "show off," delete it.

| # | Slide | Its job | Notes |
|---|-------|---------|-------|
| 1 | **Cover** | Set a credible, local, human tone | Dark bg, reverse-white logo, "Conversation with [Lead Co]", date, "Prepared by [rep]". Not "Sales Presentation." |
| 2 | **Why we're here** | Mirror back *their* words | One line on what prompted the meeting (the referral, the trigger, the problem they raised). Shows you listened before you talked. If you have a rapport hook — same city, same vintage, shared connection — use it here. |
| 3 | **Who Technijian is (in 20 seconds)** | Earn the right to continue | Founded 2000, Irvine + India, dedicated-pod model, security-first, AI-forward. 3–4 proof points, not a history lesson. Real logo, real numbers. |
| 4 | **Proof we've done this** | Credibility before pitch | 2–3 *relevant* anonymized industry profiles that match this lead's situation — **scope + effort only, NO fabricated outcome metrics, quotes, or stats** (the service is launching — no completed client projects). Pull from `technijian-biz-dev-blueprint` Capability Proof list or `technijian-case-study`. Specific > generic, but never invented. |
| 5–6 | **A few ways we could help** | Plant 2–3 seeds, not 12 | The 2–3 most relevant services framed as *outcomes for them*, phrased as hypotheses ("teams like yours usually feel X — if that's true, here's how we'd help"). Leave room for them to react. This is where you find out what actually matters to them. |
| 7 | **Discovery questions** | Hand them the mic | 5–8 open questions tailored to this lead (see below). This is the heart of the meeting. Some reps keep this as a presenter-notes slide; either way the questions drive the conversation. |
| 8 | **A free first step** | Make the next step easy and zero-risk | The soft next step — almost always a **free Nexus Assess** security/risk assessment (internal + external vulnerability + M365 review, delivered as a prioritized roadmap). No contract, no spend. See the soft-close section. |
| 9 | **Closing** | One clear next action | Dark bg, reverse-white logo, the next step as ONE dated in-document CTA + a one-line risk-reversal (e.g. "free, no contract, prioritized roadmap is yours to keep"), rep contact (main line 949.379.8499). Put the dated step on the slide itself — do not defer the whole CTA to a signature/booking button. |

Optional add-ins *only if the situation calls for it*: a "market shift / why now" slide if there's a real dated trigger (a mandate, a deadline, an incident); a single rapport/local slide if proximity is a selling point; a **cost-consolidation value-stack slide** if price/value is clearly on the buyer's mind (see below). Resist anything else.

### The cost-consolidation slide (use when price is the buyer's concern — never a named-competitor matrix)

If the lead is price-sensitive or asks "how do you compare to other MSPs / agencies," the instinct to show a competitive comparison is right but the *named-competitor price matrix is wrong* — you can't get rivals' real quotes, a rigged table kills your credibility, and it commoditizes you. Do the honest version instead, which converts better anyway:

- **One column: "what you stitch together today"** — the 5–8 separate vendors a company normally pays (Managed IT, 24/7 MDR, compliance/vCISO, marketing agency, sales-data subscription, AI consultant, dev, vCIO), each a *real market monthly range*, summed to a fragmented total.
- **Second column: Technijian as one partner** consolidating most of that stack — one relationship, one bill.
- **The honest cost story:** the US-senior + India-blended model is the structural reason the same outcomes cost less. That is the only "we're more economical" claim to make, because it's true. Present it as a **blended US-led rate** — never expose the offshore/India cost basis or per-hour numbers on a client-facing slide. Ground any figure in the real 2026 rate card; never invent one.
- **Caveat on the slide:** "market typical ranges, not competitor quotes." A technical buyer respects that and stops shopping.
- **No invented Technijian total** — the real number comes from the scoped quote after the free Nexus Assess.

The reusable method + researched category ranges live in `technijian-biz-dev-blueprint` ("Cost-consolidation value stack"). Pull the ranges from there; research fresh if the engagement is in a different market.

## Conversion mechanics (the few moves that make a first meeting convert)

A discovery deck still has to *earn the next step*. Build these in where the situation calls for them — without turning the meeting into a pitch:

- **Split the ask.** Keep the small, zero-risk "easy yes" (the free Nexus Assess) cleanly separate from the strategic later track, so the champion knows exactly what they're agreeing to *now* vs. later. Don't blur a free assessment into a paid engagement on the same slide.
- **One dated, in-document CTA + risk-reversal** (see the closing-CTA section) — not a CTA hidden in an email signature.
- **Right-size every anchor.** An inflated vendor-stack or "savings" number REDUCES credibility with a technical buyer. The cost-consolidation slide already enforces this ("market typical ranges, not competitor quotes," no invented Technijian total) — keep all anchors defensible.
- **Rebut the known prior objection.** If this lead has an obvious likely objection (got burned by an MSP, "we're too small," already has a guy), address it proactively rather than waiting for it to surface as a wall.
- **Quantify the cost of inaction.** Where there's a real, dated trigger (mandate, deadline, recent incident), make the price of doing nothing concrete — but as an estimate "to confirm at discovery," never a fabricated figure.
- **If ROI comes up:** present it as a RANGE (downside-protected floor + likely + upside) and LEAD with the likely case — never anchor the buyer's eye on a sub-1x floor. (Detail lives in `technijian-roi` / the blueprint; the first meeting stays light.)
- **Referral / partnership economics (only if they ever surface):** a channel/client REFERRAL pays the partner a MAX of 10% of the GROSS MONTHLY SERVICE INVOICE (not hardware, not one-time fees); the alternative is a RESALE markup the partner sets. Never say "10–20%" or an open-ended "ongoing %".

## Discovery questions — the actual point of the meeting

Generate 5–8 questions specific to this lead, ordered to flow from easy/factual to strategic. Good first-meeting questions:
- Size the opportunity without quoting a price ("how many users/endpoints today, and where does the next 12 months take that?").
- Surface the pain the buyer personally feels ("what eats the most internal IT time right now?").
- Map the decision chain gently ("who else would weigh in on something like this?").
- Uncover prior history ("have you looked at this before — what did that look like?").
- End on their terms ("what would make this conversation worth your time today?").

Pull the real ones from the blueprint's discovery list when it exists. Never ask a question whose answer you should already know from research — that signals you didn't prepare.

## The soft close (don't oversell the next step)

The next step must be **low-commitment and valuable on its own**. The default is a **free Nexus Assess** — Technijian's branded IT risk and security assessment (internal vulnerability, external vulnerability + dark-web credential check, Microsoft 365 review), returned as a prioritized remediation roadmap that maps to the frameworks the prospect cares about. It gives them something real whether or not they buy, and it gives Technijian the data to scope a right-sized proposal.

- Brand name is **Nexus Assess** (platform = "Nexus Assess + Pulse"; **Nexus Pulse** is the AI-pentest sibling). Never "Technijian Nexus." Feature language: `services/Nexus Assess Pulse-pre-release/`.
- **No pricing on the deck.** A first meeting is too early; pricing creates objections before trust exists. Hold the numbers for the follow-up. (If they push for a ballpark, the rep gives a range verbally — the deck stays clean.)

### Closing CTA — one dated in-document step + risk-reversal
The closing slide must carry ONE concrete, **dated** next step *on the slide itself* (e.g. "Book your free Nexus Assess — we'll have the prioritized roadmap back to you by [date]") paired with explicit risk-reversal (free, no contract, the roadmap is yours to keep). Do NOT make "use the Book-a-Meeting button in my signature" the CTA — a CTA buried in a signature is too easy to ignore; the booking link can support the on-slide ask but cannot replace it. Broaden the topic slightly beyond this one lead — e.g. "...to dig into this and the broader AI strategy we're rolling out for ourselves and our clients" — which positions the rep as a thought leader, not a one-deal pitch. (Encoded from the blueprint's Phase 11.)

## Speaker notes — mandatory on every slide

Every first-meeting deck ships with **presenter speaker notes on EVERY slide** (`slide.addNotes(...)`) — no exceptions (Ravi, 2026-06-11). In a discovery deck the notes ARE half the deliverable: the slides carry the conversation spine; the notes carry the rep's game plan. Per slide, write coaching-style notes that include:

- the one idea the slide must land, and what to say if time is short;
- the **discovery probes** to ask while that slide is up (the "what we heard" slide gets the must-learn list);
- **verify-live items** — everything research suggests but the booking didn't confirm (who the lead is, environment, affiliations). Background research lives in the notes, NEVER on the client-facing slide;
- handling guidance — pricing framing ("estimate; fixed quote after the free assessment"), the known objection rebuttal, what NOT to pitch in this meeting.

Reference pattern: `Clients/CNBC/presentation/generate_presentation.js` and `Clients/JRMDF/presentation/generate_presentation.js` (a `NOTES = {...}` object + `slide.addNotes(NOTES.x)` per slide). Verify after building: unzip the `.pptx` and confirm `ppt/notesSlides/notesSlide*.xml` count equals the slide count.

## Voice

Run the draft through **`technijian-voice`** before finalizing. First-meeting decks especially must avoid hype words (leverage, seamless, world-class, cutting-edge, game-changing) and weak CTAs — a new lead's BS detector is fully on. Be specific, human, and confident-not-pushy. Use the prospect's industry language, not ours.

## Honesty rule (carry over from the blueprint)
Do not claim capabilities Technijian hasn't built. If a relevant practice is adjacent-but-not-yet-built (the CDLX CJIS example), frame it as a **dated near-term build**, never as a track record. A first meeting is exactly where an over-claim gets caught and kills trust. See `feedback_capability_proof_built_vs_service` memory. Reinforcing rules:
- The service is launching — **no completed client projects.** Use anonymized industry profiles (scope + effort), never real client names or fabricated outcomes.
- No fabricated proof, metrics, case-study results, quotes, or stats — anywhere on the deck.
- Flag any number (sizing, savings, ROI) as an estimate **"to confirm at discovery."**

## Forwardable companion: a 1-page concept brief
A first-meeting deck often needs to survive being *forwarded* to someone who wasn't in the room. Offer a self-contained **1-page concept brief** alongside the deck — a single Letter-page HTML rendered via Playwright to PDF — that an exec can forward to capture the gist without the full slide file. Same brand/honesty rules apply; keep it to one page and verify it renders cleanly (no clipping) before sending.

## Quality gates (before declaring done)

1. **Logo is real** — render the cover to PNG and confirm the actual Technijian mark appears (not text/shapes), correct aspect ratio. (Per `technijian-presentation`.)
2. **It's short** — 8–12 slides. If it's 20, you've turned a discovery meeting into a lecture; cut.
3. **Discovery questions are tailored** — specific to this lead, not generic; ordered easy→strategic.
4. **No pricing tables** — first meeting stays price-light; the soft step is free.
5. **Voice clean** — `technijian-voice` passed; no hype, no weak CTA.
6. **Next step is one clear, low-risk action** — ONE dated CTA on the closing slide itself + risk-reversal (the booking button supports it but does not replace it).
7. **Render and eyeball every slide** — render EVERY slide to an image and proofread at display size; never declare done unverified. Use a body-region fill metric (header/footer excluded) to catch whitespace, short slides, and stranded captions/text — a slide can pass a height check while content silently clips or strands. Confirm: no clipped text/overflow, logo on cover + closing, tagline "technology as a solution," contact = main line 949.379.8499.
8. **No fabrication slipped in** — every proof point is anonymized scope/effort with no invented metric/quote; any not-yet-built capability reads as a dated near-term build; numbers flagged "to confirm at discovery."
9. **Speaker notes on EVERY slide** — coaching-style presenter notes with discovery probes and verify-live items; confirmed embedded (notesSlide XML count == slide count).

## Related skills
- **`technijian-presentation`** — PPTX mechanics + logo handling (read this first; this skill builds on it)
- **`technijian-biz-dev-blueprint`** — the deep AI Growth Report for *after* discovery; source of Capability Proof + discovery questions
- **`technijian-case-study`** — anonymized proof points for slide 4
- **`technijian-voice`** — mandatory voice gate
- **`technijian-brand`** — brand reference for any value not in brand-tokens.json
