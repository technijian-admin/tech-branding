# JRMDF — Dr. Javier Romero — IT Discovery Meeting Brief

**Client code:** JRMDF · **Type:** MSP first-meeting (CNBC/CDLX pattern) · **Prepared:** 2026-06-11
**Lead source:** Inbound — booked "IT Discovery Meeting" via technijian.com booking page.

## The lead (from the booking form — verbatim facts)

| Field | Value |
|---|---|
| Name | Javier Romero (signs "Javier Romero MD FACS") |
| Email | jromero116@msn.com |
| Phone | (805) 302-3979 |
| Address | 5544 Crestone Court (likely home; 805 = Ventura County) |
| Time zone | Pacific |
| Notes | "opening a new surgical sub-specialty clinic, using Cerner, epic and Kaiser portals for EMR's. Needs software interface, and infrastructure development." |

## Who we believe he is (web research 2026-06-11 — VERIFY LIVE, do not recite at him)

**Dr. Javier (Anthony) Romero, MD FACS — Ventura, CA.** Trauma surgery & surgical critical care + minimally invasive (bariatric/foregut) surgeon:

- Surgeon at **Anacapa Surgical Associates** (Ventura) — anacapasurgical.com/project/dr-romero
- **Director of Surgical Critical Care, Ventura County Medical Center** (trauma/CC there since ~2002, per LinkedIn)
- **Surgery program director at Community Memorial Hospital – Ventura** since 2018 (mycmh.org profile)
- **Vice President, Southern California Chapter, American College of Surgeons**
- UC Davis (MD) → Santa Barbara Cottage Hospital (residency) → USC/LA General (surgical critical care fellowship)

**The key insight — his three named systems map to his three likely affiliations:**

| He said | Maps to | EMR |
|---|---|---|
| "Cerner" | Ventura County Medical Center (Ventura County Health Care Agency) | Cerner |
| "Epic" | Community Memorial Healthcare | Epic (launched **MyChart** patient portal — MyChart is Epic-exclusive) |
| "Kaiser portals" | Kaiser Permanente | Epic (KP HealthConnect; community-provider access via Affiliate Link) |

Reading of his note: "using Cerner, epic and Kaiser portals **for EMRs**" suggests he plans to **document inside the hospital systems** via credentialed community-provider/portal access (Pattern A in the deck) rather than necessarily buying his own EHR — common for surgeons who operate at hospitals. But a practice still needs scheduling/billing at minimum → the Pattern A/B blend is the central discovery question.

## What was built (pre-meeting)

Path: `Clients/JRMDF/presentation/`
- `generate_presentation.js` (pptxgenjs — reuses CDLX node_modules; authentic logo PNGs)
- **`Technijian for Dr. Javier Romero - IT Discovery Deck.pptx`** (12 slides, ~2.5 MB) + **`.pdf`** (~538 KB shareable)
- Speaker notes on all 12 slides (presenter talking points + discovery probes)

**Deck flow (12 slides):**
1. Cover (dark, white logo) — "Building the technology foundation for your new surgical sub-specialty clinic"
2. Agenda — working discovery conversation, his two asks define it
3. What we heard — stat cards NEW / 3 / 2 / DAY 1 + "what that means"
4. The core idea — "born digital, built right once" (retrofit vs greenfield + 3 takeaways: EMR strategy drives the build · lead times gate opening day · compliance cheapest on day one)
5. **Interfaces** — what "using Cerner, Epic and Kaiser" means: Pattern A (work inside their systems) vs Pattern B (own EHR/PM + exchange) vs what Technijian owns either way (drive all three hospital-IT relationships)
6. **Infrastructure** — the new-clinic blueprint, six layers (connectivity/network · clinical workstations · communications · M365 & identity · security & HIPAA stack · backup & continuity)
7. HIPAA from day one — SRA (45 CFR 164.308), BAAs, encryption/access, training, policies/IR, evidence — + cyber-insurance overlap band
8. Proof — 3 REAL anonymized healthcare case studies (multi-practice group 12-mo platform ops zero patient-facing downtime · 18-endpoint Win11 weekend cutover · 70+ hr HIPAA-aware software + AI modernization)
9. Technijian stack — My IT / My Security / My Dev (start: all three) + My Compliance / My Jian
10. How pricing works — REAL rate-card per-person stack ($26.50 + $4.75 + $4.00 + $6.00 + ~$46 ≈ $87/person/mo + $20 DMARC); 10-person ≈ $890/mo labeled ILLUSTRATIVE; one-time build-out = fixed-scope quote after free site walk
11. How we'd engage — Discovery → free site walk & assessment → blueprint & fixed quote → build·test·train·open + 90-day lead-time note
12. Next step CTA (dark) — free site walk & clinic technology assessment + New Clinic IT Checklist give-away

## Discovery questions (the meeting's real agenda)

1. Sub-specialty and clinical scope of the new clinic? In-office procedures?
2. Location — Ventura area? Lease signed? Construction/build-out status? Square footage / exam-room count?
3. **Target opening date** — everything schedules backward from it.
4. Headcount at opening — providers / MAs / front office? Growth in year 1?
5. **The EMR question:** document in hospital systems via portals (Pattern A), own practice EHR/PM (Pattern B), or blend? Which is the primary hospital?
6. Billing — in-house biller vs billing service? (Drives PM-system and BAA needs.)
7. Existing remote access to each of the three systems today? Kaiser referral relationship (Affiliate Link)?
8. Imaging — PACS viewing needs in office? Labs partner?
9. Who else is involved — office manager, practice consultant, architect/GC, partner physicians?
10. Cyber insurance / malpractice carrier IT requirements already in hand?
11. Budget expectations — one-time vs monthly tolerance.
12. Decision process and timeline for choosing the IT partner.

## Rules honored
- **Authentic Technijian logos** (`assets/Technijian Logo 2.png` light / `Technijian Logo - white text.png` dark) — NOT the AI-regenerated marks.
- **No invented pricing** — every number is from the tech-legal rate card (same set as CNBC deck); 10-person figure explicitly labeled illustrative; build-out = "fixed-scope quote after free site walk."
- **Client-facing pricing rules** — investment only, no cost basis/markup/US-India split; monthly not annual.
- **Built-vs-service honesty** — case studies are real anonymized engagements; speaker notes say plainly we don't name clients and offer references.
- Identity research kept to speaker notes/brief — deck only uses what HE told us.

## Status / next
- **NOT sent** — pre-meeting deck for Ravi to present. No meeting date in the booking info yet (booking page captures the request; confirm the calendar slot).
- After the meeting: capture real scope (specialty, location, opening date, headcount, EMR pattern), then a follow-up recap email same day + site-walk booking. Update `project_jrmdf` memory + vault session note.
