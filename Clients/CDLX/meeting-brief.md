# CDLX — Meeting Brief
**Ravi Jain ↔ Nick Schooler (CardLogix) · Thu 2026-05-29 · 1:00 PM PT · Teams**

> One-page-style internal brief. Read once before the call. The fuller intel is in `_research.md`. Two tracks on the table; treat the meeting as discovery, not a pitch.

---

## In the room

- **Nick Schooler** — Business Development, CardLogix. Sales-engineering background, deeply technical on smart cards. nick@cardlogix.com · **949-380-1312** · LinkedIn: nickschooler.
- **NOT in the room (but the real signers):** Sebastien Goulet (Chairman & CEO) and Tom Hope (Director of Sales). Track-B partnership needs them eventually; Track-A IT engagement Nick can champion himself.
- SDR-set context: introduced by Jannea.

## 30-second on CardLogix

US smart-card manufacturer + software developer, **Irvine since 1998**, ~$6M revenue, ~14–25 people. **HQ: 16 Hughes, Irvine 92618 — same zip and same Spectrum business park as Technijian (18 Technology Dr).** They ship NIST-certified / GSA-approved PIV cards, FIDO2 cards explicitly marketed as "CJIS- and NIST AAL2/AAL3-compliant," biometric kits (BIOSID, Corvus PIK), and FRAC (First Responder Authentication Credentials — PIV-Interoperable). Channel-led: they sell THROUGH integrators/resellers, not direct to agencies. Competitors: HID Global, Identiv, Tx Systems, Yubico.

## The two tracks

| | **Track A — CardLogix's own IT** | **Track B — CJIS/MFA partnership for LE** |
|---|---|---|
| What | Co-managed IT for 5–6 workstations + 2 servers | Channel/integrator partnership: CardLogix supplies the hardware (PIV / FIDO2 / FRAC / BIOSID), Technijian wraps the managed-IT + MSSP + CJIS-compliance program around it for LE agency end-customers |
| Buyer | Nick (likely signs) | Goulet + Hope (Nick champions) |
| Time-to-close | Weeks if priced right | Months — needs at least one joint pilot |
| Confidence | High — this is exactly what My IT Co-Managed model exists for | Real but unproven — needs follow-up |

## Track A — talking points

- Mirror their language back: they said "co-managed" and "cost was the concern." Don't overshoot.
- Show the **Co-Managed IT** model from My IT (page 5 of the brochure — `Services/My IT/My IT Brochure.pdf`): after-hours / overflow help desk, shared RMM + ticketing + documentation, senior architects on demand, compliance & security co-ownership. Designed for orgs with lean internal IT.
- Anchor on per-endpoint pricing, not the full retainer. **Don't quote a number in the meeting** — say "let me scope it after we see your environment; we have an Assessment that's our standard first step." Discovery first.
- Two case studies that match their profile (use as social proof, don't deep-dive):
  - **Small Business — Azure AD Cloud Migration** (21-user SMB, retired on-prem AD, ~50 hrs)
  - **Small Business — Server 2012→2022 + Hyper-V→ESXi** (2-host loaner-pattern modernization; same servers-shape they have)
- DO offer: a free 30-minute IT assessment / vCIO workshop as the next step. That's the "land" — discovery, not commitment.
- DON'T offer: a fixed monthly number. Discovery first.

## Track B — talking points

Frame as a *concept conversation*, not a pitch. The goal of this meeting is to find out (a) whether they actually want a partner here, (b) what they think the gap is, (c) whether Goulet/Hope would even take the meeting.

The thesis to float, in plain language:

> *"You make the credentials. CJIS 5.9.5 made phishing-resistant MFA mandatory for every LE agency as of October 2024 — and 6.0 tightened it again in December. Smart cards and FIDO2 keys are exactly what satisfies that — that's your edge. But most agencies need somebody to actually deploy the cards into their environment, integrate with their Entra ID / AD / CJIS-Launchpad, and run the ongoing managed-IT and MDR that the rest of the CJIS Security Policy demands. If you don't have a managed-services partner you can hand off to, you're losing those deals to HID, who has the full ecosystem. Is that something you'd want to talk about?"*

If he says yes:
- Walk through what Technijian DOES have today: My Compliance (8 frameworks — HIPAA, SOC 2, PCI, CMMC, GDPR, NIST CSF, CIS, ISO 27001) + My Security (24/7 MDR, EDR, SIEM, MFA-everywhere, 15-min response SLA) + My IT (managed + co-managed).
- Honest gap (per `feedback_capability_proof_built_vs_service.md`): **we have NOT yet built a CJIS practice the way we've built CMMC**. The Lego pieces are all there — Entra ID, Defender, conditional access, Teramind, Passportal — and CMMC's control families overlap heavily with CJIS. A partnership reason to stand up the CJIS wrapper is exactly the trigger we'd need.
- Don't promise a CJIS-certified anything in this meeting. Use words like *"natural extension,"* *"close adjacent,"* *"the body of work to formalize is months not years."*

If he says no / not now:
- Park it. Stay on Track A. We don't lose anything.

## Discovery questions to ask (in roughly this order)

1. **"Tell me about your growth — how many users / endpoints in the next 12 months?"** (sizes the Track A scope, also surfaces whether they're hiring and where)
2. **"What's running on the two servers today?"** (file/AD/Hyper-V/app server? on-prem AD or hybrid? backup? — this is exactly the shape of our Small Business case studies)
3. **"What's eating your time?"** (the IT pain Nick personally feels — after-hours, patching, M365 admin, user provisioning, security alerts — this is where co-managed earns its place)
4. **"What did the prior co-managed conversation actually look like — what was the number, and what model?"** (so we know what we're benchmarked against on cost)
5. **"On the partnership idea — who at CardLogix would own that conversation? Is it Sebastien? Tom?"** (maps the decision chain without sounding like we're going around him)
6. **"What does a typical LE customer of yours look like today — agency size, who they buy through, how they end up with your card in their hands?"** (channel mapping; tells us who the joint customer would actually be)
7. **"Have you seen any of your LE end-customers struggle with the integration / managed-IT side once they have your cards?"** (does the gap actually exist from their POV? — qualifies the partnership)
8. **"What does success look like for this conversation — for you, today?"** (always close on this; lets Nick set the next-step bar himself)

## What NOT to do

- **Don't price** Track A in the meeting. Discovery → assessment → scoped quote.
- **Don't claim CJIS delivery experience.** We have CMMC + NIST + FIPS infrastructure. CJIS is the adjacent next-step, not a portfolio item.
- **Don't pitch My AI / SEO / Lead Gen.** Not the meeting. (If Nick asks what else Technijian does, name them in one breath and move on.)
- **Don't promise to bring Goulet a partnership deck next week.** Earn the right with a smaller signal first — Nick will not appreciate us going over his head on the first contact.
- **Don't oversize** the response. CardLogix is a ~14-person, ~$6M-revenue shop — they don't want enterprise-MSP overhead. Lean.

## Rapport hooks (use early, naturally)

- **Same business park.** "We're 5 minutes from you — 18 Technology Drive in the Spectrum. Surprised our paths haven't crossed." (Confirms we're local, not offshore; reduces vendor-risk.)
- **28-year tenure.** "1998 — you've been at this almost as long as us. Technijian started in 2000. Roughly the same Irvine-tech-vintage." (Peer framing, not vendor-to-customer.)
- **The Credentsys dual-interface launch.** If you've seen their recent news-room post, mention it briefly — shows you actually looked at what they do. (Don't fake depth on PIV-card internals.)

## Next-step framing (close the meeting on one of these)

- **If Track A only:** "Let me send a short proposal for a free IT assessment — we walk your environment for an hour or two, surface the top risks, and come back with a scoped co-managed option. No commitment past the assessment."
- **If Track A + Track B interest:** "Two next steps then — I'll send the assessment proposal for your side, and I'll put together a short concept brief on the CJIS-partnership idea you can read and forward to Sebastien if it resonates. Both of those land in your inbox by Tuesday."
- **If Track B is the bigger animal:** "Let me put a short partnership concept on paper — one or two pages, not a deck — and you tell me whether Sebastien would take 20 minutes for it. If he would, we set that meeting. If not, we focus on getting your own IT in order first and let the partnership idea bake."

## After the meeting (what we build, depending on signal)

- **Always:** brief recap email today, before EOD. Ravi's signature + the Book-a-Meeting button per [[feedback_outreach_cta_signature_button]].
- **If Track A:** a scoped IT-assessment proposal (use the existing Small Business case studies as embedded social proof — both already in `Case Studies/Small Business/`).
- **If Track B alive:** a short "CJIS partnership concept" one-pager — NOT a 38-page biz-dev blueprint. CDLX's small size + the partnership being a *concept* (not a strategy build) doesn't justify the full-engine deliverable. Keep it tight.
- **Update memory:** save a `project_cdlx.md` after the meeting with the actual signal we got (Track A scope, Track B interest level, decision-chain notes).

---

**File:** `Clients/CDLX/meeting-brief.md` · drafted 2026-05-29 08:30 PT · pre-meeting
