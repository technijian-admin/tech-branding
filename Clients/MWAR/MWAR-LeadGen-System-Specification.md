# MWAR-LeadGen — System Specification

**Internal repo / code name:** `mwar-leadgen`
**Client-facing product name:** **Monaco Growth Engine**
**Client:** Monaco Wheels & Auto Restyling (Monaco Wheel Restoration LLC) — Costa Mesa, CA (monacowr.com)
**Prepared for:** Ravi Jain / Technijian engineering
**Status:** Specification v1.0 — ready to scaffold and build
**Date:** 2026-06-30

> **Naming discipline (important).** Inside the repo, "MWAR" is fine. In **anything the client ever sees** (the weekly Attribution Report, any dashboard, any email), use **"Monaco"** or **"Monaco Growth Engine"** — never the internal code "MWAR" and never "lead generation." Jovan was burned by lead-gen vendors; the framing is *growth intelligence + attribution*, not cold lead-gen. This is a hard rule, not a preference.
>
> **This is NOT a pursuit intelligence engine.** DAS and MBCA monitor public records to find B2B prospects 3–12 months ahead of a formal RFQ. MWAR is a consumer service business — demand already exists (people damage wheels every day); the problem is **capturing it, attributing it, and converting it to booked shop jobs**. The architecture is fundamentally different.

---

## 1. Purpose & Scope

### 1.1 What this system does
MWAR-LeadGen is a **demand generation + attribution engine** for Monaco Wheel Restoration. It does three things in parallel:

1. **Generates demand** — drives net-new potential customers to Monaco through local SEO automation, review velocity management, and targeted dealer/fleet B2B outreach.
2. **Captures demand** — intercepts after-hours inquiries (75% of booking happens via phone/text; the shop is closed M–F 8am–6pm only) with an AI booking assistant and photo-to-quote flow.
3. **Attributes demand** — tracks every inbound contact to its source channel (local search, Yelp, referral, dealer, outreach) and reconciles it to a **booked job** for the performance billing calculation ($40/net-new attributed booked job).

Attribution is the backbone of the engagement. Jovan's explicit requirement: "as they produce the leads, they produce the bill we pay." The system must make the billing defensible, transparent, and indisputable.

### 1.2 The 4-stage engine
```
GENERATE  → build local SEO authority; automate review requests; post social content; reach dealers
CAPTURE   → after-hours AI assistant; photo-to-quote bot; call-tracking; form tracking
ATTRIBUTE → map every inbound contact to source; match to booked job; net-new vs repeat exclusion
REPORT    → weekly Attribution Brief to Jovan + Ravi; monthly billing reconciliation
```

### 1.3 In scope (Phase 1 / first 90 days)
- Attribution tracking stack: dedicated call-tracking number, form tracking, UTM tagging, source classification.
- Google Business Profile (GBP) automation: weekly posts, photo uploads, Q&A, category optimization for the Costa Mesa location.
- Automated post-service review request: SMS to customer phone after job completion.
- After-hours AI assistant: SMS/web chat bot that captures name, vehicle, damage description, availability, and photo outside M–F 8am–6pm hours.
- Photo-to-quote inbox routing: inbound photos → technician review queue → quote reply within 2 hours.
- B2B dealer outreach: scrape OC dealership list, enrich contacts, run a warm multi-touch sequence, track dealer pipeline status.
- Weekly Attribution Report (email to Jovan + Ravi): new contacts by source, attributed booked jobs, running $40/job tab, performance vs. baseline.

### 1.4 Out of scope (Phase 1) / expansion
- San Clemente brand — **Phase 2** (per Jovan's 2026-05-26 correction: primary focus = Costa Mesa / Monaco Wheels & Auto Restyling first).
- Full website rebuild or booking system replacement (integration-first in Phase 1).
- Automated social content publishing (Phase 2 — manual content calendar first).
- CRM integration (Phase 2 once Jovan selects a platform).
- Las Vegas location (separate scope).

### 1.5 Business goal & success definition
Pilot succeeds if it produces ≥ 25 net-new attributed booked jobs/month at which point the performance fee ($40 × 25 = $1,000) matches the old $1,750 flat — and Jovan's **effective cost per booked job** is provably lower than any alternative channel. The shop-shift objective (more in-shop, fewer mobile) is tracked as a secondary KPI.

---

## 2. Business Context (Monaco Wheel Restoration)

| Attribute | Detail | Why it matters to the build |
|---|---|---|
| Legal entity | Monaco Wheel Restoration LLC dba Monaco Wheels & Auto Restyling | Name in all client-facing output |
| Owner | **Jovan Giles** (jovan@monacowr.com) — spelled Jovan, not Javon | Email recipient; performance-billing approver |
| Location | 1560 Superior Ave Unit B3, Costa Mesa CA 92627 · (949) 800-8502 | Attribution anchor: the Costa Mesa GBP + call-tracking number |
| Hours | Mon–Fri 8am–6pm (CLOSED WEEKENDS) | After-hours capture window = Sat/Sun + weekday evenings |
| Founded | 2013; 100,000+ wheels repaired | Trust-builder in all copy |
| Yelp | 4.9 stars, 222+ reviews (Costa Mesa) | Leverage; review request automation builds on this |
| Booking mix | 75% phone/text · 25% online form | Call tracking + SMS bot are tier-1 priorities |
| Revenue baseline | ~$48,700/mo (~$584K annual at corrected 40/60 in-shop/mobile) | The ROI denominator |
| Channel mix | 40% in-shop · 60% mobile (Jovan-corrected) | **Shop-shift is a core objective** — booking flow defaults to shop |
| B2B | 4 active dealerships + body shop referrals | Dealer expansion is a high-margin growth lane |
| Capacity gap | 10–12 wheels/day vs 20–30 max | +2 wheels/day (+$6,160/mo) = full program breakeven at $140 blended |

### 2.1 Recipients (who gets the weekly report)
| Name | Role | What they care about |
|---|---|---|
| **Jovan Giles** | Owner (approval + billing) | Attribution accuracy; net-new jobs; cost/job; shop vs mobile split |
| **Ravi Jain** | Technijian account exec | Performance vs. breakeven; pipeline health; dealer account count |

### 2.2 Key context for engineers
- **Attribution sensitivity is high.** Jovan does not want to pay for repeat customers, walk-ins, or jobs referred by existing dealer accounts. "Net-new attributed" has a specific legal-ish definition (see §6) that must be locked in writing before launch.
- **Phone/text is the primary channel.** If we don't capture call attribution, we can't bill accurately. A dedicated call-tracking number routed to (949) 800-8502 is non-negotiable from day one.
- **Shop-shift is a commercial objective.** The booking flow should default to "drop off at Costa Mesa" and offer mobile only as an add-on / premium tier. This is explicitly what Jovan wants (mobile costs him more per job and caps throughput).
- **Weekend availability gap is the white space.** Competitors (Steve's Mobile, Rim Revival) are open 7 days. The after-hours bot captures weekend inquiry intent; if Jovan ever extends hours, the capture system is ready.

---

## 3. System Architecture

### 3.1 Component diagram
```
                       ┌─────────────────────────────────────────────────┐
                       │               ORCHESTRATOR                       │
                       │         scripts/run-all-engines.js               │
                       │   (daily: SEO check · review trigger · dealer   │
                       │    outreach · attribution sync · report build)   │
                       └──────────────────┬──────────────────────────────┘
                                          │
     ┌──────────────┬──────────────┬──────┴──────┬──────────────┬─────────────┐
     ▼              ▼              ▼              ▼              ▼             ▼
 GENERATE:      GENERATE:      CAPTURE:       CAPTURE:       ATTRIBUTE:   REPORT:
 GBP/SEO        Dealer         After-hours    Call + Form    Source       Weekly
 automation     outreach       AI bot         tracking       reconciler   Brief
 (L1)           (L5)           (L3)           (L2, L4)       (§6)         (§9)
     │              │              │              │              │             │
     └──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
                                          │
                         ┌────────────────▼──────────────────┐
                         │         ATTRIBUTION STORE          │
                         │  data/contacts/ · data/bookings/  │
                         │  data/attribution/ · billing/      │
                         └────────────────┬──────────────────┘
                                          ▼
                         ┌────────────────────────────────────┐
                         │   WEEKLY ATTRIBUTION REPORT (email) │
                         │   + MONTHLY BILLING RECONCILIATION  │
                         └────────────────────────────────────┘
```

### 3.2 Data flow (daily orchestration)
1. **Preflight** — verify GBP API, call-tracking API, Twilio, SerpAPI, Graph credentials live.
2. **SEO pulse** — poll local ranking positions (Google Maps Pack + organic) for target keywords; flag rank changes ≥ 3 positions (§4 L1).
3. **Review trigger** — query job-completion log (manual CSV or Jovan's invoicing system); send SMS review request for any job completed yesterday where no prior review-request was sent (§4 L2).
4. **Bot queue** — pull after-hours inquiries received since last run (Twilio SMS webhook or web chat API); classify intent (quote/booking/question) and route (§4 L3).
5. **Dealer outreach** — advance any dealer contact due for next touch; log replies; flag new dealer accounts as "activated" (§4 L5).
6. **Attribution sync** — ingest call-tracking CDR, form submissions, and Jovan's weekly booked-job log; match contacts to bookings; apply §6 net-new rules; update `data/attribution/` (§6).
7. **Report** — build the weekly Attribution Report HTML; email it to Jovan + Ravi via M365 Graph (§9).
8. **Log** — per-run stats written to `runs/` + `runs/run-index.json`.

---

## 4. Signal & Demand Layers

These are the six demand channels the system monitors, generates from, or captures. The framework deliberately mirrors the pursuit-intelligence "signal layers" pattern from DAS/MBCA for engineering consistency — but the signals here are **inbound demand signals**, not public-record pursuit signals.

> Legend — **♻ Reuse:** BBC/tech-leads code usable as-is. **🔧 Adapt:** pattern exists, retarget needed. **🆕 New:** net-new component. **⚠ Hard:** dependencies on third-party webhooks or Jovan's ops process.

### 4.1 Layer summary

| # | Layer | What it monitors / generates | Access method | Attribution source tag | Status |
|---|---|---|---|---|---|
| L1 | **Local SEO / GBP rank** | Google Maps Pack + organic positions for 15 target keywords; weekly GBP post + photo; citation health | Google Business Profile API + SerpAPI local rank | `gbp` / `organic` | 🆕 New |
| L2 | **Review velocity** | SMS review request triggered after each completed job; monitors GBP review count weekly | Twilio SMS + GBP API (read review count) | `review-referral` (new customer cites reviews) | 🆕 New ⚠ |
| L3 | **After-hours AI assistant** | SMS/web chat bot active outside M–F 8am–6pm; captures quote requests + photos; routes to tech queue | Twilio Programmable SMS + webhook handler | `bot-capture` | 🆕 New |
| L4 | **Call + form tracking** | Dedicated tracking number routed to (949) 800-8502; form UTM; CDR ingest | CallRail (or Twilio call-tracking) + form tag | `tracked-call` / `tracked-form` | 🆕 New ⚠ |
| L5 | **Dealer / fleet outreach** | Scrape OC new-car dealerships; enrich contact (GM/Service Mgr); multi-touch warm email sequence; track pipeline | SerpAPI + Hunter.io + M365 send | `dealer-outreach` | 🔧 Adapt (tech-leads) |
| L6 | **Social / community signals** | Monitor Instagram @monacowheel engagement; flag high-performing posts; TikTok/Google trend pulse for "wheel repair OC" | SerpAPI trends + IG Basic Display API | `social` (attribution context, not direct source) | 🆕 New (passive) |

### 4.2 Per-layer detail

**L1 — Local SEO / GBP rank.**
The single highest-ROI channel for a local service business. The system:
- Posts one GBP update per week (service highlight, before/after photo, seasonal hook) using the GBP API — automated from a content template; Jovan approves or the post goes out on a timer.
- Monitors 15 target keyword ranking positions weekly via SerpAPI `google_maps` and `google` engines: "wheel repair Costa Mesa," "wheel restoration OC," "Tesla wheel repair Irvine," "curb rash repair Costa Mesa," etc. (full list in `config/seo-targets.json`).
- Alerts when ranking drops ≥ 3 positions (competitor action) or rises to Map Pack top-3 (win signal).
- Runs a monthly citation audit (compare NAP across Yelp, GBP, Bing Places, Apple Maps, YP) and flags inconsistencies.
- **Shop-shift note:** GBP content should default to "drop off at our Costa Mesa shop" language in every post — not mobile-first.

**L2 — Review velocity.**
Monaco's 4.9 / 222-review moat is its most valuable asset. The system protects and extends it:
- After Jovan (or staff) marks a job complete (via a daily CSV upload or a webhook from his invoicing tool), the system waits 3 hours then sends an SMS review request to the customer's phone: "Hi [Name], thanks for trusting Monaco Wheels with your [vehicle]! If we did great work, a quick Google/Yelp review means the world — [link]. – Jovan & team."
- Links are tracked (bit.ly with UTM) so we know the review funnel conversion rate.
- One-time send per customer phone (never double-send). DNC list maintained in `data/contacts/dnc.json`.
- Weekly GBP review count is polled and charted in the Attribution Report (review velocity = leading indicator of demand).

**L3 — After-hours AI assistant.**
The biggest capture gap: Monaco is closed nights and weekends but inbound intent does not stop. The system:
- A Twilio SMS number (separate from the tracking number in L4) is published as "Text us for a quote 24/7" on the website, GBP description, and Yelp listing.
- A webhook handler (`agents/bot/sms-handler.js`) runs continuously (deployed as a small Node.js server or serverless function). Outside business hours (M–F 8am–6pm PT) it replies to inbound texts:
  - Auto-reply 1: "Monaco Wheels is closed right now, but we've got your message. Reply with a photo of the damage + your vehicle make/model and we'll quote you first thing when we open."
  - If the customer replies with a photo → save to `data/bot-queue/` + alert Jovan via SMS at open of business.
  - If text only → classify intent (quote/general/complaint) and queue for morning follow-up.
- During business hours → forward to (949) 800-8502 (pass-through mode).
- **Shop-shift:** bot replies always reference "drop off at our Costa Mesa shop" as option 1, mobile as option 2.

**L4 — Call + form tracking (attribution backbone).**
This is the most critical layer for the $40/job billing model. Without it, Jovan cannot verify what Technijian's program produced.
- A **dedicated call-tracking number** (CallRail or Twilio; see §13) is published ONLY on Technijian-controlled assets (GBP listing, Yelp, website managed by Technijian, social profiles updated by Technijian). The existing (949) 800-8502 remains on business cards and non-program assets.
- Every call to the tracking number is logged: caller ID, timestamp, duration, recording (if Jovan consents). CDR is ingested daily by `scripts/ingest-call-cdr.js`.
- Every web form submission gets a UTM tag (`utm_source=monaco-program&utm_medium=...`) so Google Analytics (or the form system) passes it through.
- **What this buys:** at billing time, Technijian can show Jovan a list of every tracked call/form with caller ID, timestamp, and whether it became a booked job. The attribution is not a "trust us" — it is a auditable log.

**L5 — Dealer / fleet outreach.**
The high-margin expansion lane. Currently 4 dealerships + body shop referrals. The system:
- Scrapes OC new-car dealerships (Toyota, Honda, Hyundai, Kia, Tesla, Lexus, Mercedes, BMW, Porsche in Costa Mesa / Newport Beach / Irvine / Santa Ana corridor) via SerpAPI `google_maps` search + a curated `config/target-dealers.json`.
- Enriches each dealer with GM name and Service Manager via Hunter.io domain search + LinkedIn scrape (tech-leads `prequalify_leads.py` pattern adapted).
- Runs a 3-touch warm sequence: Touch 1 = intro email (Jovan voice, not Technijian); Touch 2 = follow-up with a before/after photo case study; Touch 3 = "Is there a better contact?" Minimum 5 days between touches.
- Tracks dealer status: `prospect → contacted → replied → meeting → active-account`. Active accounts are marked in `config/excluded-accounts.json` so their jobs are never billed under the $40 performance model (pre-existing B2B accounts are excluded by definition).
- Weekly report shows: outreach sent, reply rate, new accounts activated.

**L6 — Social / community signals.**
Passive monitoring only in Phase 1 (no auto-publishing):
- SerpAPI `google_trends` weekly pulse for "wheel repair [city]" keywords — flags rising demand signals.
- Instagram @monacowheel Basic Display API: fetch recent post engagement (likes + comments). High performers (top 20%) get flagged in the report as "content to boost / replicate."
- No auto-publishing in Phase 1. Content calendar is manually managed by Jovan; Phase 2 adds the content engine.

---

## 5. Data Model

All records are JSON; persisted under `data/`. Schemas (informal):

### 5.1 Contact (every inbound inquiry, regardless of channel)
```jsonc
{
  "id": "sha1(phone|email + firstSeen)",     // dedup key
  "phone": "+19494445555",
  "email": "customer@gmail.com",             // if provided
  "name": "Mike T.",                         // if provided
  "vehicle": "2023 Tesla Model Y",
  "damageDescription": "two curb rashes, rear passenger",
  "photoUrls": ["s3://mwar-leadgen/bot-queue/..."],
  "channel": "tracked-call | tracked-form | bot-capture | dealer-referral | direct",
  "sourceDetail": "gbp | yelp | organic | dealer-outreach | unknown",
  "inboundAt": "2026-07-05T09:17:00-07:00",
  "isAfterHours": false,
  "status": "new | quoted | booked | completed | no-show | dnc",
  "bookedJobId": "JOB-2026-0712-042",       // null until matched
  "isNetNew": true,                          // false = repeat or excluded B2B
  "firstSeen": "2026-07-05",
  "lastUpdated": "2026-07-07"
}
```

### 5.2 BookedJob (Jovan's confirmed bookings)
```jsonc
{
  "jobId": "JOB-2026-0712-042",
  "customerPhone": "+19494445555",
  "customerName": "Mike T.",
  "vehicle": "2023 Tesla Model Y",
  "serviceType": "wheel-repair | caliper | chrome-delete | wrap | mobile",
  "shopType": "in-shop | mobile",
  "bookedAt": "2026-07-07T10:00:00-07:00",
  "completedAt": "2026-07-09T14:30:00-07:00",
  "revenue": 125.00,
  "attributedContactId": "sha1...",          // links to Contact record
  "attributionSource": "gbp",
  "isBillable": true,                        // net-new, not excluded
  "billingCycle": "2026-07"
}
```

### 5.3 DealerAccount
```jsonc
{
  "dealerId": "dealer-001",
  "name": "Pacific BMW Newport Beach",
  "address": "1 Auto Center Dr, Newport Beach CA",
  "gmName": "John Smith",
  "serviceManagerName": "Maria Lopez",
  "serviceManagerEmail": "m.lopez@...",
  "touchSequenceStatus": "contacted | replied | active-account | dead",
  "lastTouchDate": "2026-07-01",
  "nextTouchDue": "2026-07-06",
  "activatedDate": null,                     // set when they become a paying account
  "isExcludedFromPerformanceBilling": false  // true once they become active
}
```

### 5.4 AttributionRecord (monthly billing basis)
```jsonc
{
  "billingCycle": "2026-07",
  "netNewAttributedJobs": 28,
  "baseFee": 750.00,
  "performanceFee": 1120.00,                 // 28 × $40
  "totalBill": 1870.00,
  "jobList": [ /* BookedJob refs */ ],
  "excludedJobs": { "repeat": 14, "existingDealer": 6, "directWalkIn": 3 },
  "generatedAt": "2026-07-31"
}
```

### 5.5 Persisted caches
`data/contacts/dnc.json`, `geocode-cache.json`, `hunter-cache.json` — keyed lookups so daily re-runs don't repeat API calls or re-send SMS.

---

## 6. Attribution Engine (the billing backbone)

This section defines exactly what counts as a "net-new attributed booked job" for the $40 performance fee. **Lock this in writing with Jovan before launch** — the definition is the most likely dispute point.

### 6.1 Definition of a billable job
A job is billable ($40 applies) when ALL of the following are true:

| Criterion | Rule |
|---|---|
| **Attributed** | The customer's first contact arrived via a Technijian-controlled channel: the dedicated call-tracking number, a UTM-tagged web form, the AI bot SMS number, or a GBP action (click-to-call, click-to-web) on the Technijian-optimized listing. |
| **Net-new customer** | The customer's phone number has NOT appeared in Jovan's job log in the prior 12 months (rolling). Repeat customers never billed. |
| **Not a pre-existing B2B account** | The contact is not from one of the dealerships or body shops listed in `config/excluded-accounts.json` at the time of first contact. |
| **Job completed** | The service was actually completed (not a quote that didn't book, not a no-show). |
| **Not a direct walk-in** | Walk-ins with no prior tracked contact are excluded (unattributable). |

### 6.2 Attribution workflow
```
1. Inbound contact arrives (tracked call, form, bot SMS)
   → Contact record created with channel tag
2. Daily: Jovan uploads completed jobs CSV (or webhook fires from invoicing system)
   → scripts/attribution-sync.js matches contact phone to job phone
   → Apply §6.1 rules; set isBillable = true/false
3. Weekly: attribution report shows running count + excluded count
4. Monthly (last business day): billing reconciliation generated
   → Jovan reviews and approves (or disputes) the job list
   → Ravi invoices the approved total
```

### 6.3 Dispute handling
The system saves **every** piece of evidence: call CDR with recording URL, form submission timestamp, bot conversation log. If Jovan disputes a specific job, Technijian pulls the record and shows the inbound contact timestamp, the tracking channel, and the customer phone match to the booked job. The log is the source of truth.

### 6.4 Attribution confidence tiers
| Confidence | Definition | Handling |
|---|---|---|
| **High** | Tracked call or tagged form → job completed same/next day | Auto-billable |
| **Medium** | Bot capture → job booked within 7 days, phone match | Auto-billable |
| **Low** | Customer mentions program in conversation but no tracked contact | Flag for Jovan manual approval — never auto-bill |
| **None** | No tracked contact, no mention | Not billable |

---

## 7. Demand Generation Components

### 7.1 GBP content automation
**Tool:** Google Business Profile API (OAuth2 service account)
**Script:** `scripts/gbp-post.js`

Weekly content calendar (auto-generated from templates in `config/gbp-templates.json`):
- **Monday:** Service highlight (rotate: wheel repair / caliper / chrome delete / wraps)
- Attach a before/after photo from `data/photos/approved/` (Jovan approves a photo bank on setup)
- **Shop-shift copy rule:** every post ends with "Book your appointment at our Costa Mesa shop" (not mobile CTA)
- **Google updates:** category set to "Wheel Alignment Service" + "Auto Body Shop" + "Car Detailing" — confirm best-fit categories in Phase 0

Citation audit runs monthly via `scripts/citation-audit.js` (SerpAPI + manual spot-check): compare NAP (Name / Address / Phone) across GBP, Yelp, Bing, Apple Maps, YP. Flag discrepancies for Ravi to fix manually (automated correction is outside Phase 1 scope).

### 7.2 SEO keyword tracking
**Tool:** SerpAPI `google` + `google_maps` engines
**Script:** `scripts/rank-tracker.js`
**Config:** `config/seo-targets.json`

15 initial target keywords (adjust post-Phase-0 with Jovan):
```
"wheel repair Costa Mesa"
"curb rash repair Costa Mesa"
"wheel restoration Orange County"
"mobile wheel repair OC"
"Tesla wheel repair OC"
"wheel repair near me" (geo-targeted to Costa Mesa)
"rim repair Costa Mesa"
"custom wheel finish OC"
"brake caliper painting OC"
"chrome delete OC"
"wheel repair Newport Beach"
"wheel repair Irvine"
"wheel restoration Huntington Beach"
"car wrap Orange County"
"San Clemente wheel repair"          ← Phase 2 brand; track from Day 1 for baseline
```

Weekly rank stored in `data/rankings/YYYY-MM-DD.json`. Charted in the Attribution Report (trend lines, not just spot values).

### 7.3 Review request automation
**Tool:** Twilio SMS
**Script:** `scripts/review-request.js`

Trigger: Jovan uploads a daily completed-jobs CSV (`data/jobs/completed-YYYY-MM-DD.csv`) with columns: `jobId, customerPhone, customerName, vehicle, serviceType`. Alternatively, a webhook endpoint (`/webhook/job-complete`) accepts POSTs from his invoicing system.

Flow:
1. For each completed job, check `data/contacts/review-request-log.json` — if phone already received a request, skip.
2. Wait 3 hours post-completion (configurable in `config/review-settings.json`).
3. Send SMS from Twilio number: template in `config/sms-templates.json` key `review_request`.
4. Log sent: `{ phone, sentAt, jobId, shortLink }` → `data/contacts/review-request-log.json`.

**Short link:** generate a bit.ly link (or Twilio shortener) that routes to Google review deep link for the Costa Mesa GBP listing. Track clicks.

**DNC compliance:** any customer who replies STOP → added to `data/contacts/dnc.json` → never messaged again.

---

## 8. After-Hours Capture Layer

### 8.1 The SMS bot
**Tool:** Twilio Programmable SMS + Node.js webhook server
**Script:** `agents/bot/sms-handler.js`
**Deployed:** Small Express server (or Vercel/Railway serverless) — must be always-on (not Windows Task Scheduler)

The bot number is separate from:
- (949) 800-8502 — the existing Monaco number (untouched)
- The L4 call-tracking number — that's for inbound calls, attribution only

The bot number is published as "Text for a 24/7 quote" on all Technijian-controlled assets.

**State machine (stored in `data/bot-sessions/<phone>.json`):**
```
IDLE → GREETING_SENT → AWAITING_PHOTO → PHOTO_RECEIVED → QUEUED
```

| State | Trigger | Bot reply |
|---|---|---|
| IDLE (first text) | Any text during business hours | "Hi! This is Monaco Wheels. We're open — give us a call at (949) 800-8502 or keep texting and we'll reply. What can we help with?" |
| IDLE (first text, after hours) | Any text | "Monaco Wheels is closed right now (M–F 8am–6pm). Text us a photo of the damage + your vehicle make/model and we'll quote you first thing when we open!" |
| AWAITING_PHOTO | Text without photo | "No worries — text a photo when you have one. What's your vehicle make and model?" |
| AWAITING_PHOTO | Photo received | "Got it! We'll review this and send you a quote by [next business open]. Is Costa Mesa shop or mobile service better for you?" |
| PHOTO_RECEIVED | Any follow-up | "Thanks — you're in the queue! Questions? Call (949) 800-8502 during business hours." |

**Morning alert:** At 8:00am PT on business days, `scripts/bot-morning-alert.js` sends Jovan an SMS summary: "Monaco bot: [N] new inquiries overnight. [N] with photos. Reply QUEUE to see them or check the portal."

### 8.2 Photo-to-quote queue
Photos saved to `data/bot-queue/YYYY-MM-DD/<phone>/` (or an S3 bucket if self-hosting becomes an issue). A lightweight web portal (`portal/index.html` — static HTML, no framework) shows Jovan the queue: vehicle, damage description, photo thumbnail, customer phone. He taps a phone number to call or taps "Quote sent" to mark it handled.

The portal is read-only for the attribution system; Jovan works it manually. Phase 2 can add a "send quote" text directly from the portal.

---

## 9. Delivery — Weekly Attribution Report

### 9.1 The deliverable
A **weekly HTML email** (Monaco Growth Engine branding) to Jovan Giles + Ravi Jain, containing:

1. **Headline numbers:** Net-new attributed booked jobs (week) + running monthly total + running monthly performance fee (MTD bill preview).
2. **Channel breakdown table:** Jobs by source (tracked call / bot capture / form / dealer-referral / unknown) this week vs. last week.
3. **Attribution job list:** Customer name (first name + last initial), vehicle, service type, attribution source, booked date. This is the auditable record Jovan can dispute line by line.
4. **SEO rank summary:** Top-3 keyword positions; any rank changes ≥ 3 positions this week.
5. **Review velocity:** New GBP reviews this week; total count; trend.
6. **Dealer pipeline:** Contacts reached, replies received, new accounts activated.
7. **After-hours capture:** Inquiries via bot this week; conversion rate (bot inquiry → booked job); photos received.
8. **Shop-shift KPI:** % of new attributed jobs that are in-shop vs. mobile this week vs. baseline.

### 9.2 Channels
- **Email:** M365 Graph — reuse `scripts/email-tier1-leads.ps1` pattern (Technijian app reg). Retarget recipients + template.
- **Files attached:** `data/attribution/weekly-YYYY-MM-DD.{xlsx,pdf}` — the attribution job list for Jovan's records.
- **MCP:** `mcp-server/index.js` exposes `get-attribution`, `run-pipeline`, `get-billing-preview`, `search-contacts` for interactive querying by Claude.

### 9.3 Monthly billing reconciliation
On the last business day of each month, `scripts/billing-reconcile.js` generates:
- `billing/YYYY-MM-reconciliation.json` — machine-readable (per §5.4 schema)
- `billing/YYYY-MM-invoice-backup.xlsx` — the job list Jovan reviews before Ravi invoices
- Emailed to Jovan with subject "Monaco Growth Engine — [Month] Performance Summary & Billing Preview"

---

## 10. Dealer Outreach Engine

### 10.1 Target list build
**Script:** `agents/dealer-discovery/discover-dealers.js`
**Source:** SerpAPI `google_maps` query: "car dealership [city]" for each city in `config/dealer-targets.json` (Costa Mesa, Newport Beach, Irvine, Santa Ana, Huntington Beach, Laguna Hills, Laguna Niguel).
**Supplement:** A curated seed list of known OC luxury/Tesla dealerships in `config/dealer-seed.json` (built manually at Phase 0; 20–30 entries to start).

Per-dealership record: name, address, phone, website domain, brand (Tesla / BMW / Honda / etc.), estimated lot size (proxy for volume).

### 10.2 Contact enrichment
**Tool:** Hunter.io domain search → Service Manager / Fleet Manager / General Manager
**Script:** `scripts/enrich-dealer-contacts.js`
**Fallback:** LinkedIn scrape via SerpAPI `google` (site:linkedin.com "service manager" "[dealer name]") if Hunter returns no results.

Priority contacts:
1. Service Manager (handles lot damage, transport damage, test-drive rash)
2. Fleet Manager (if listed — fleet programs are high-volume)
3. General Manager (fallback if no service contact found)

### 10.3 Outreach sequence
3-touch sequence per contact; minimum 5 business days between touches. All email sent as Jovan Giles via M365 Graph (same Technijian app reg, `From: jovan@monacowr.com` if Jovan grants send-as permission — confirm in Phase 0; otherwise Ravi sends and hand-offs to Jovan).

| Touch | Timing | Content |
|---|---|---|
| T1 | Day 0 | Introduction: Monaco's credentials (100K+ wheels, 4.9 stars), offer a dealer wholesale rate for transport/lot damage, request 15-min call or shop visit |
| T2 | Day 5 | Before/after photo case study (attach one from `data/photos/approved/`); "We handle [brand] wheels regularly — here's what we did for a [competitor dealer]" |
| T3 | Day 10 | "Is there a better contact at [dealership] for wheel repair vendor relationships?" (breaks friction if wrong person) |

After T3 with no reply → status `dead`; revisit in 90 days.

**Anti-spam safeguards:** max 10 new T1 touches per week (don't blast); verify email before sending (Hunter verification score ≥ 0.7); never auto-send beyond T1 until reply classification confirms it's safe.

### 10.4 Reply classification
Inbound replies to dealer outreach emails are polled via M365 Graph (`Get-MgUserMessage` filter on dealer domain keywords) by `scripts/classify-dealer-replies.js`. Claude classifies each reply:
- `interested` → alert Ravi immediately; advance to phone call
- `wrong-contact` → extract referred name if present; create new contact record
- `not-interested` → mark `dead`; stop sequence
- `auto-reply` → ignore; don't advance

---

## 11. The "Convert & Retain" Layer

### 11.1 Shop-shift booking flow
The after-hours bot and the web form both default to in-shop scheduling. Language choices:
- First option offered: "Drop it off at our Costa Mesa shop (1560 Superior Ave Unit B3)"
- Second option: "Mobile service is also available for an additional fee (we come to you)"
- Bot should never lead with mobile.

Phase 2: if Jovan integrates a booking platform (Calendly, ServiceBridge, etc.), the bot can direct-book shop appointments.

### 11.2 Repeat customer nurture
A customer who books via the tracked channel is added to `data/contacts/customers.json`. Six months after their last job, `scripts/nurture-followup.js` queues a re-engagement SMS:
- "Hi [Name], it's Monaco Wheels — hope [vehicle] is rolling smooth! Wheels take more damage over time. We're running [any seasonal offer] — want to book a quick check?" (Jovan personalizes this before send — never auto-send nurture without approval.)

### 11.3 Outcomes loop (attribution loop-close)
A row `wasContactedByProgram` + `outcome` (booked/quoted/declined/ghosted) in `data/attribution/` is updated manually by Jovan or via the bot conversation. This closes the loop: Technijian can demonstrate not just contacts generated but contacts converted — the real proof of program ROI.

---

## 12. Automation & Scheduling

### 12.1 Always-on components (not Task Scheduler)
| Component | Host | Notes |
|---|---|---|
| After-hours SMS bot (`agents/bot/sms-handler.js`) | Node.js server / Railway / Vercel | Must respond within seconds to Twilio webhook; cannot be Task Scheduler |
| Twilio webhook receiver for call CDR | Same host as bot | Receives CDR POSTs from Twilio |
| Web form webhook receiver | Same host or Zapier | Receives form submissions with UTM data |

### 12.2 Scheduled components (Windows Task Scheduler — BBC pattern)
| Task | Cadence | Script |
|---|---|---|
| Daily orchestration | Daily 07:00 PT | `scripts/run-all-engines.js` |
| Rank tracking | Weekly Sunday 23:00 PT | `scripts/rank-tracker.js` |
| Citation audit | Monthly 1st at 08:00 PT | `scripts/citation-audit.js` |
| Attribution sync | Daily 08:30 PT (after Jovan's job CSV upload) | `scripts/attribution-sync.js` |
| Weekly report email | Every Monday 08:00 PT | `scripts/build-report.js` + `scripts/email-report.ps1` |
| Monthly billing reconciliation | Last business day 09:00 PT | `scripts/billing-reconcile.js` |
| Dealer outreach advances | Daily 09:00 PT | `scripts/advance-dealer-sequence.js` |

### 12.3 Scheduler setup
Reuse BBC `scripts/setup-weekly-schedule.ps1` pattern (PowerShell Task Scheduler registration). Add multiple tasks per the table above.

---

## 13. Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Language/runtime | **Node.js 20 LTS** (CommonJS) | Maximize reuse of BBC/tech-leads patterns |
| Browser automation | **patchright** 1.59 (primary) + playwright-extra/stealth | Dealer discovery scraping; anti-bot |
| SMS / voice | **Twilio** | Industry standard for call tracking + programmable SMS |
| Call tracking | **CallRail** (preferred) or Twilio call tracking | CallRail has a built-in attribution dashboard; Twilio is cheaper if we self-build |
| Email delivery | PowerShell + Microsoft Graph | Reuse BBC email script |
| GBP API | **Google Business Profile API** (OAuth2 service account) | Official API for posts, insights |
| Rank monitoring | **SerpAPI** google + google_maps engines | Already used in tech-leads |
| Contact discovery | **Hunter.io** | Already used in tech-leads |
| URL shortener / tracking | **Bit.ly API** or Twilio built-in | Review-request link tracking |
| Spreadsheet | **xlsx** | Attribution report XLSX attachments |
| Config/env | **dotenv** | Vault-first loader (`agents/shared/load-env.js` ♻) |
| LLM (dealer reply classification) | Claude (via Anthropic API) | Reply classification; copy drafting |
| Bot portal | Static HTML (`portal/index.html`) | No framework needed for a simple photo queue |
| MCP | @modelcontextprotocol/sdk | Interactive querying by Claude |
| Scheduler | Windows Task Scheduler | BBC pattern |
| Always-on host | Railway.app (free tier) or Vercel (serverless) | Twilio webhooks need always-on; Task Scheduler cannot do this |

Python is acceptable for one-off scripts (GBP API calls have good Python SDKs) but the **orchestrator stays Node** to inherit BBC directly.

---

## 14. Repository Structure

```
mwar-leadgen/
├─ README.md
├─ SPEC.md                            # this document
├─ package.json
├─ .env                               # gitignored; real values in OneDrive keys vault
├─ .gitignore
├─ .mcp.json
├─ agents/
│  ├─ bot/
│  │  ├─ sms-handler.js               # NEW — Twilio webhook; after-hours bot
│  │  └─ session-store.js             # NEW — per-phone conversation state
│  ├─ dealer-discovery/
│  │  └─ discover-dealers.js          # NEW — SerpAPI dealer scrape
│  └─ shared/
│     ├─ browser.js                   # ♻ BBC
│     ├─ load-env.js                  # ♻ BBC (point to mwar-leadgen.env)
│     └─ contacts.js                  # ♻ BBC (adapt schema for §5.1)
├─ scripts/
│  ├─ run-all-engines.js              # ♻ BBC orchestrator (retarget for MWAR pipeline)
│  ├─ preflight-check.js              # ♻ BBC (verify Twilio, GBP, CallRail, Graph, SerpAPI)
│  ├─ gbp-post.js                     # NEW — GBP API weekly post
│  ├─ rank-tracker.js                 # NEW — SerpAPI local rank poll
│  ├─ citation-audit.js               # NEW — NAP consistency check
│  ├─ review-request.js               # NEW — Twilio SMS review request trigger
│  ├─ bot-morning-alert.js            # NEW — Jovan's AM summary SMS
│  ├─ ingest-call-cdr.js              # NEW — CallRail/Twilio CDR ingest
│  ├─ ingest-form-submissions.js      # NEW — UTM-tagged form submission ingest
│  ├─ attribution-sync.js             # NEW — match contacts to booked jobs; §6 rules
│  ├─ billing-reconcile.js            # NEW — monthly billing report generator
│  ├─ enrich-dealer-contacts.js       # 🔧 Adapt tech-leads prequalify_leads.py
│  ├─ advance-dealer-sequence.js      # 🔧 Adapt tech-leads prep_next_touches.py
│  ├─ classify-dealer-replies.js      # 🔧 Adapt tech-leads reply_classifier.py
│  ├─ nurture-followup.js             # NEW — 6-month repeat-customer SMS queue
│  ├─ build-report.js                 # NEW — weekly Attribution Report HTML
│  ├─ email-report.ps1                # ♻ BBC email-tier1-leads.ps1 (retarget)
│  ├─ run-tracker.js                  # ♻ BBC
│  └─ setup-weekly-schedule.ps1       # ♻ BBC (register all Task Scheduler tasks)
├─ portal/
│  └─ index.html                      # NEW — bot photo-to-quote queue viewer
├─ config/
│  ├─ seo-targets.json                # 15 target keywords + geo
│  ├─ gbp-templates.json              # weekly GBP post templates
│  ├─ sms-templates.json              # review request + bot reply templates
│  ├─ dealer-targets.json             # target cities + segments for dealer discovery
│  ├─ dealer-seed.json                # manually curated luxury/Tesla dealer list
│  ├─ excluded-accounts.json          # pre-existing B2B accounts (never billed)
│  ├─ attribution-rules.json          # §6 billable-job definition (the contract)
│  └─ review-settings.json            # delay after job completion, DNC rules
├─ data/
│  ├─ contacts/                        # Contact records + DNC + review-request log
│  ├─ jobs/                            # Jovan's daily completed-jobs CSVs
│  ├─ rankings/                        # weekly rank snapshots (gitignored)
│  ├─ bot-queue/                       # after-hours photo captures (gitignored)
│  ├─ attribution/                     # weekly attribution records
│  ├─ output/                          # run artifacts (gitignored)
│  └─ billing/                         # monthly reconciliation reports
├─ mcp-server/
│  └─ index.js                         # ♻ BBC pattern; tools: get-attribution, get-billing-preview
├─ runs/                               # per-run logs (gitignored)
└─ docs/
   ├─ workstation.md                   # setup guide
   └─ phase-0-discovery.md             # §18 items to confirm with Jovan
```

---

## 15. Configuration & Secrets

### 15.1 Secrets — never in repo
All credentials load at runtime from the OneDrive keys vault (BBC pattern, `agents/shared/load-env.js`):
`C:\Users\rjain\OneDrive - Technijian, Inc\Documents\VSCODE\keys\mwar-leadgen.env`

| Key | Used for | Notes |
|---|---|---|
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | SMS bot, review requests, call tracking | Twilio master creds |
| `TWILIO_BOT_NUMBER` | After-hours bot SMS number | Published on assets |
| `TWILIO_TRACKING_NUMBER` | L4 call-tracking number | Published only on Technijian-controlled assets |
| `CALLRAIL_API_KEY` | CDR ingest (if CallRail vs Twilio self-build) | Optional; Twilio CDR works too |
| `GBP_SERVICE_ACCOUNT_JSON` | Google Business Profile API | OAuth2 service account JSON |
| `SERPAPI_KEY` | Rank tracking + dealer discovery | Reuse from tech-leads |
| `HUNTER_API_KEY` | Dealer contact enrichment | Reuse from tech-leads |
| `BITLY_API_TOKEN` | Review request short links | Free tier |
| `ANTHROPIC_API_KEY` | Dealer reply classification | Claude API |
| `GRAPH_CLIENT_ID` / `GRAPH_TENANT_ID` / `GRAPH_CLIENT_SECRET` | M365 email | Reuse Technijian app reg |
| `GOOGLE_GEOCODING_API_KEY` | Dealer address geocoding | Reuse |
| `JOVAN_MOBILE` | Morning alert SMS destination | Jovan's cell; never commit |

### 15.2 `config/attribution-rules.json` (the contract — confirm with Jovan)
```jsonc
{
  "performanceFeePerJob": 40.00,
  "baseFee": 750.00,
  "netNewWindowDays": 365,        // customer must not have booked in prior N days
  "trackedChannels": ["tracked-call","tracked-form","bot-capture"],
  "excludedAccounts": "see excluded-accounts.json",
  "minimumCallDurationSeconds": 30,  // filter pocket dials
  "requireJobCompletion": true,       // no-shows not billed
  "billingApprovalRequired": true     // Jovan must approve monthly list before invoice
}
```

---

## 16. Non-Functional Requirements

- **Attribution accuracy over speed.** A false positive (billing Jovan for a repeat customer) is worse than a missed billable job. When in doubt, exclude; flag for Jovan manual review.
- **Idempotent daily run.** Re-running the orchestrator the same day must produce the same attribution state (dedup by contact ID + job ID).
- **Twilio webhook reliability.** The bot server must respond to Twilio within 15 seconds or Twilio will retry. Use webhook validation (Twilio signature header) to reject spoofed requests.
- **Privacy / DNC compliance.** Any STOP reply → immediate DNC. No re-send regardless of subsequent texts. Maintain DNC log indefinitely.
- **Config over code.** Adding a new GBP post template, keyword, or dealer city = editing JSON. Adding a new outreach touch sequence = editing `config/` not writing code.
- **Observability.** Per-run stats (contacts ingested, CDRs matched, jobs attributed, SMS sent, dealer touches advanced) in `runs/` and surfaced in the weekly report footer.
- **Shop-shift in every output.** Every bot reply, every GBP post, every review-request SMS — all default to "Costa Mesa shop" framing, never lead with mobile.

---

## 17. Security, Legal & Ethical

- **TCPA compliance.** Review-request SMS and bot capture are initiated by the customer (inbound texts consent to receive replies). Proactive outbound SMS to a customer who has not texted us requires express written consent. The nurture follow-up (§11.2) must be gated behind Jovan's explicit approval per send — never auto-fire.
- **Call recording disclosure.** If CallRail is configured to record calls, California two-party consent law applies (CA Penal Code §632). Either announce the recording ("This call may be recorded for quality assurance") on the phone line, or configure call tracking as CDR-only (no recording) until legal review.
- **CAN-SPAM / commercial email.** Dealer outreach sequences are commercial email. Include an unsubscribe mechanism (one-line "reply REMOVE" instruction in every email); honor immediately.
- **Dealer contact data.** Business contacts (GM, Service Manager) are legitimate B2B contacts under CAN-SPAM. Do not use personal emails; Hunter.io filters to business domains automatically.
- **Secrets:** vault-only, never committed (GitHub push protection).
- **Attribution data.** Customer contact records (phone numbers, names, vehicles) are PII. Store minimum necessary; don't share outside Jovan's operation; purge after 24 months if no activity.
- **No cold SMS blasting.** The bot number only replies to people who texted first. It must never initiate outbound SMS to numbers that haven't messaged us.

---

## 18. Build Roadmap (mapped to the performance pricing model)

> Commercial frame: $750/mo base + $40/net-new attributed booked job. The build-out cost is **deferred** (Jovan's explicit request — no $15K upfront). Engineering hours are self-funded by Technijian until performance fees generate the margin to recover them. Phase 1 must be lean.

| Phase | Window | Deliverable | Work |
|---|---|---|---|
| **0 — Discovery** | Pre-build (Week 0) | Locked config + attribution contract | §19 items: Jovan's invoicing system/API, his job-log format, phone consent/DNC list, confirmed excluded B2B accounts, GBP credentials, call-tracking number choice |
| **1 — Attribution foundation** | Weeks 1–2 | Call tracking live + form UTM + daily job-log ingest + attribution sync | L4 call-tracking number published on GBP; `attribution-sync.js` running; first week's CDRs matched; attribution-rules.json signed off by Jovan |
| **2 — Demand capture** | Weeks 3–4 | After-hours bot live + review request automation live | Bot deployed on Railway; `sms-handler.js` passing Twilio webhook; `review-request.js` triggered from first completed-jobs CSV upload; first morning alert sent |
| **3 — First report** | Week 5 | Weekly Attribution Report delivered; baseline established | `build-report.js` + `email-report.ps1`; first email to Jovan; baseline metrics locked (pre-program job volume by channel) |
| **4 — Demand generation** | Weeks 6–10 | GBP automation live; rank tracking; dealer outreach launched | `gbp-post.js` posting first GBP update; `rank-tracker.js` storing first snapshot; first 10 dealer T1 touches sent |
| **5 — Expansion** | Weeks 11–12+ | Full pipeline running; first billing reconciliation; San Clemente Phase 2 scoped | Monthly billing report sent; first $40/job invoice issued; Phase 2 scope (San Clemente brand) scoped if Jovan is satisfied |

### 18.1 MVP definition (what "done" means for Phase 1)
By end of Week 5, the system can **prove to Jovan** — with an auditable log — that at least one inbound contact arrived via a Technijian-controlled channel and became a completed booked job. That is the billing model's proof of concept.

### 18.2 Suggested first commits
1. `npm init` + copy BBC `package.json` deps + `agents/shared/{browser,load-env,contacts}.js`.
2. `config/attribution-rules.json` + `config/excluded-accounts.json` — the contract documents.
3. `scripts/ingest-call-cdr.js` + CallRail/Twilio CDR integration — prove call attribution end-to-end.
4. `scripts/attribution-sync.js` — map one real CDR to one real job from Jovan's CSV.
5. `agents/bot/sms-handler.js` — deploy to Railway; prove after-hours bot replies in < 5 sec.
6. `scripts/review-request.js` — send first real review-request SMS from a completed job CSV.
7. `scripts/build-report.js` skeleton → first Attribution Report email to Jovan.

---

## 19. Success Metrics & Acceptance Criteria

| Metric | Target (pilot / first 90 days) |
|---|---|
| Attribution system live | Yes, by Week 2 |
| Call-tracking number published on all Technijian-controlled assets | Yes, by Week 1 |
| After-hours bot response time | < 10 sec after hours |
| New GBP reviews (net) per month | ≥ 5 |
| Net-new attributed booked jobs / month | ≥ 15 by Month 2; ≥ 25 by Month 3 |
| % of attributed jobs = in-shop (shop-shift KPI) | > 50% (baseline likely <40%) |
| Dealer new accounts activated | ≥ 1 in 90 days |
| Attribution billing accepted by Jovan (no disputed jobs > 10%) | Yes, by Month 2 billing cycle |
| Jovan's effective cost-per-booked-job vs prior Google Ads | Provably lower (pull prior Google Ads CPL for comparison in Phase 0) |

---

## 20. Open Discovery Items (confirm with Jovan — Phase 0)

Put these in `docs/phase-0-discovery.md` and resolve before any code ships:

1. **Invoicing system / job log format** — how does Jovan track completed jobs today? (Invoice app, spreadsheet, text messages?) Determines the CDR-match data source.
2. **Customer phone collection** — does Jovan collect and store customer phones for all jobs? Is there a CRM or is it manual? This is the attribution matching key.
3. **Existing DNC / consent list** — any customers who should never receive SMS from Monaco?
4. **Excluded B2B accounts** (the performance-fee boundary) — confirm the list of existing dealerships and body shops that will never be billed as "net-new." This list goes into `config/excluded-accounts.json` and both parties sign off on it.
5. **Google Business Profile access** — does Jovan have GBP owner/manager access? Need to add Technijian as a manager to use the API.
6. **Call recording consent decision** — does Jovan want recorded calls (valuable for dispute resolution) or CDR-only? California two-party law applies.
7. **Call tracking number placement** — confirm exact list of Technijian-controlled assets (website, GBP listing, Yelp, Instagram bio) where the tracking number will replace or supplement (949) 800-8502.
8. **Send-as permission for dealer outreach** — can Jovan grant Microsoft 365 send-as for jovan@monacowr.com (if he uses M365)? Alternatively, Ravi sends and hand-offs to Jovan.
9. **Prior Google Ads CPL** — Jovan mentioned "complete disappointment"; pull the actual spend + inbound-job count from Google Ads history to anchor the performance comparison.
10. **Weekend hours possibility** — Jovan closed weekends by choice or resource constraint? If resource is the issue, is Saturday a possible Phase 2 expansion?
11. **Photo bank for GBP posts** — does Jovan have a library of before/after photos? Need ≥ 20 approved photos at Phase 0 to seed the weekly GBP content engine.
12. **Bot number publication timing** — when should the bot number go live on GBP/Yelp? Needs to be before the bot is deployed (don't publish what isn't working).

---

## Appendix A — BBC / tech-leads → MWAR Reuse Map (file-level)

> Note: MWAR is a consumer-service demand-gen system, not a public-records pursuit-intelligence system. BBC reuse is shallower than DAS/MBCA — the core patterns (env loading, email, scheduling) carry over cleanly; the harvest/enrich/score layer does not.

| MWAR component | Source to start from | Action |
|---|---|---|
| Browser factory | BBC `agents/shared/browser.js` | ♻ Reuse for dealer discovery scraping |
| Env/vault loader | BBC `agents/shared/load-env.js` | ♻ Reuse; point to `mwar-leadgen.env` |
| Contact schema | BBC `agents/shared/contacts.js` | 🔧 Adapt schema for §5.1 (consumer contact vs developer contact) |
| Orchestrator | BBC `scripts/run-all-layers.js` | ♻ Reuse shell; swap layer registry for MWAR pipeline steps |
| Email report | BBC `scripts/email-tier1-leads.ps1` | ♻ Reuse; retarget recipient, subject, template |
| Run tracker | BBC `scripts/run-tracker.js` | ♻ Reuse |
| Self-heal | BBC `scripts/pipeline-selfheal.js` | ♻ Reuse for dealer discovery retries |
| Preflight | BBC `scripts/preflight-check.js` | ♻ Reuse; swap service list (Twilio/GBP/CallRail/Graph) |
| Scheduler setup | BBC `scripts/setup-weekly-schedule.ps1` | ♻ Reuse; register MWAR tasks |
| MCP server | BBC `mcp-server/index.js` | ♻ Reuse pattern; retarget tools |
| Dealer contact enrichment | tech-leads `scripts/prequalify_leads.py` | 🔧 Port pattern to Node.js; target dealer contacts not tech execs |
| Dealer outreach sequences | tech-leads `scripts/prep_next_touches.py` | 🔧 Port; 3-touch dealer sequence instead of 5-touch tech-exec sequence |
| Reply classification | tech-leads `scripts/reply_classifier.py` | 🔧 Port; retrain classification categories for dealer replies |
| 3-pass proofread | tech-leads `scripts/proofread.py` | ♻ Reuse for dealer outreach email drafts |
| M365 send | tech-leads M365 send pattern | ♻ Reuse for dealer outreach emails (send-as Jovan if permitted) |

### What is genuinely new (no existing analogue)
| Component | Why new |
|---|---|
| `agents/bot/sms-handler.js` | Twilio Programmable SMS bot — no equivalent in BBC or tech-leads |
| `scripts/ingest-call-cdr.js` | CallRail/Twilio CDR ingest — BBC has no call tracking |
| `scripts/attribution-sync.js` | The core billing engine — maps CDRs + forms → completed jobs → net-new test |
| `scripts/billing-reconcile.js` | Monthly performance-fee calculation — unique to the $750/$40 model |
| `scripts/gbp-post.js` | Google Business Profile API integration — no prior BBC/tech-leads work |
| `scripts/rank-tracker.js` | Local SEO rank monitoring (SerpAPI `google_maps`) — different from tech-leads news_fetch |
| `scripts/review-request.js` | Post-service SMS review request trigger — unique to consumer service business |
| `portal/index.html` | Bot photo queue viewer — simple static portal, nothing comparable in BBC |

---

## Appendix B — `config/signal-sources.json` (starter template)

```jsonc
{
  "L1_gbp": {
    "type": "api",
    "base": "https://mybusinessbusinessinformation.googleapis.com/v1",
    "accountKey": "GBP_SERVICE_ACCOUNT_JSON",
    "locationId": "<verify in Phase 0 — GBP location resource name>",
    "postsPerWeek": 1
  },
  "L1_rank": {
    "type": "serpapi",
    "engine": "google_maps",
    "keywordsFile": "config/seo-targets.json",
    "location": "Costa Mesa, California, United States",
    "gl": "us",
    "hl": "en"
  },
  "L2_review_sms": {
    "type": "twilio",
    "fromNumber": "TWILIO_BOT_NUMBER",
    "templateKey": "review_request",
    "delayHoursAfterJobCompletion": 3
  },
  "L3_bot": {
    "type": "twilio-webhook",
    "fromNumber": "TWILIO_BOT_NUMBER",
    "webhookPath": "/webhook/sms",
    "businessHoursStart": "08:00",
    "businessHoursEnd": "18:00",
    "businessDays": ["Mon","Tue","Wed","Thu","Fri"],
    "timezone": "America/Los_Angeles"
  },
  "L4_call_tracking": {
    "type": "callrail",
    "trackingNumber": "TWILIO_TRACKING_NUMBER",
    "routeTo": "+19498008502",
    "cdrWebhookPath": "/webhook/cdr"
  },
  "L4_form_tracking": {
    "type": "utm",
    "utmSource": "monaco-program",
    "formWebhookPath": "/webhook/form"
  },
  "L5_dealer": {
    "type": "serpapi",
    "engine": "google_maps",
    "queries": ["car dealership Costa Mesa", "car dealership Newport Beach",
                "car dealership Irvine", "BMW dealership OC", "Tesla dealership OC"],
    "seedFile": "config/dealer-seed.json"
  },
  "L6_trends": {
    "type": "serpapi",
    "engine": "google_trends",
    "keywords": ["wheel repair Orange County", "rim repair OC", "curb rash repair"]
  }
}
```

---

*End of specification v1.0. Confirm §20 discovery items with Jovan before writing any code — the attribution contract (§6 + `config/attribution-rules.json`) and the excluded-accounts list are the two documents that must exist before the system touches billing. Lock them in writing; they are the foundation of the performance-fee relationship.*
