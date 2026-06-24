# Santa Fe Christian Schools (SFC) — Research Synthesis

**Prepared:** June 24, 2026 · **For:** First-meeting (IT Discovery) deliverables · **Discipline:** FACTS-ONLY (pre-discovery). Report only verified facts; turn every unknown into a client question. Market/threat numbers are facts about the market, sourced + labeled — never predictions about SFC.

---

## 0. The lead / booking (verbatim, from Technijian website intake)

- **Name:** Rob · **Email:** Rhonma@sfcs.net · **Phone:** 858-298-2360
- **Address:** 838 Academy Drive, Solana Beach, CA 92075 · **Time zone:** PST
- **Service booked:** "IT Discovery Meeting"
- **Stated need (verbatim):** *"We're looking for assistance in configuring 3CX V20 update 9 and are using a Checkpoint Firewall + Twilio."*

**Rob = Rob Honma, Chief Technology Officer (CTO) — VERIFIED** (deep-research agent). Email `Rhonma@` decodes to R. Honma; LinkedIn vanity URL is `/in/rhonma/`; title corroborated by SFC's own press release, Del Mar Times/SD Union-Tribune, and Times of San Diego. **Profile:** ~30-yr tech career (mostly Silicon Valley; prior tech lead at a large multi-campus church + Huntington Beach Union HS District), MIS degree (CSU Fullerton), **ITIL v3 Foundation** certified, **Cox Business "Top Tech Awards" 2023 — Nonprofit category** winner. He is a strategic, framework-literate IT leader (roadmap/governance/security-maturity), NOT a break/fix admin. Signature projects: network broadcasting, **geo-fencing campus safety** ("no-occupy zones"/perimeter alerts), network upgrades. Runs a **lean team** (no public IT staff beneath him) → pitch **co-managed / overflow help-desk / MDR / project muscle**, not full outsourcing. **Budget owner for a later commercial step: Kurt de Pfyffer, CFOO.** Phone 858-298-2360 = UNVERIFIED as his (SFC main is 858-755-8900) — confirm. Do NOT print his cell as fact.

---

## 1. Business snapshot — VERIFIED

| Attribute | Verified fact | Source |
|---|---|---|
| What it is | Private, coeducational, college-preparatory **Christian** school, K–12 | Wikipedia; privateschoolreview; sfcs.net |
| Founded | **1977** | Wikipedia; CDE directory |
| Grades | **K–12** (elementary, middle, high school) | sfcs.net; US News |
| Enrollment | **~1,077 students** | privateschoolreview / Niche |
| Campus | **838 Academy Drive, Solana Beach, CA 92075** (Solana Beach / North County San Diego coast) | booking; Yelp; CDE |
| Mascot / identity | **Eagles** (athletics) | search results |
| Accreditation | **WASC**, **ACSI** (Association of Christian Schools International), **CESA** (Council on Educational Standards & Accountability) | Wikipedia; privateschoolreview |
| Tuition (HS) | **~$22,000–$27,500/yr** (day tuition ~$27,520 reported) | privateschoolreview |
| Financial aid | **~25% of students** receive aid; **>$1.5M** annual aid budget | privateschoolreview |
| Domain | **sfcs.net** (primary). Note: `santafechristian.org` also appears; a *different* "Santa Fe Christian" exists in Santa Fe, NM — do not conflate | search |
| CDS code | 37683466927883 (CA Dept of Education) | CDE directory |

**NOT verified (→ questions):** head of school name/title; total staff/faculty headcount; number of campuses/buildings; endpoint & server counts; SIS/LMS in use (Blackbaud/FACTS/Veracross/PowerSchool?); M365 vs Google Workspace; current MSP or in-house IT structure; whether they take E-rate federal funding; online tuition/payment processor.

---

## 2. The immediate technical need — VERIFIED context (the wedge)

Rob's stated problem is a concrete, solvable MSP project: stand up / finish configuring **3CX V20 Update 9** so calls work cleanly through a **Check Point firewall** with **Twilio** as the SIP trunk.

- **3CX V20 Update 9** — current/real release ("V20 Update 9 Final" referenced in 3CX forums, 2025–26). 3CX is a software VoIP PBX (self-hosted or hosted). Config = SIP trunk, extensions, firewall rules, the inbound "firewall checker." *Source: 3CX V20 change log + forums.*
- **Check Point firewall + SIP** — the classic gotcha: **SIP ALG (Application Layer Gateway) must be OFF.** ALG inspects/rewrites SIP packets; its edits are invisible to 3CX traces, causing one-way audio, dropped registration, and ghost call failures. Check Point's VoIP/SIP inspection needs to be disabled and replaced with explicit NAT + port rules. *Source: 3CX firewall-router docs + community.*
- **Ports** — SIP **5060 UDP** inbound (+ **5060–5061 TCP**); RTP audio **9000–10999 UDP** inbound; plus the 3CX tunnel/web ports. *Source: 3CX firewall docs.*
- **Twilio** — 3CX supports **only Twilio "Elastic SIP Trunking"** (not Programmable Voice as a trunk); 3CX can **auto-configure** a Twilio Elastic SIP trunk. Pain points: IP-ACL vs credential auth, origination/termination URIs, codec match, and — again — the firewall. *Source: 3CX Twilio SIP-trunk doc; Twilio Elastic SIP docs.* Schools also commonly use Twilio for **mass SMS parent/emergency notifications** — confirm which use applies (trunk, SMS, or both).

**Why it's a great wedge:** it's a real, near-term, finite problem Technijian can solve fast; solving it earns the right to the broader managed-IT/security/AI conversation. Frame it as the "easy first win," not the whole pitch.

---

## 3. Compliance / student-data landscape — facts, with honest applicability nuance

**Cross-cutting insight (deep-research agent, refined + more accurate):** the student-privacy laws aimed at *schools* (FERPA, CIPA, AB 1584) are tied to **federal funding or public-LEA status**, so they largely **do NOT legally bind a privately-funded religious K-12.** But the laws that bind their **vendors** (COPPA, SOPIPA) and their **payment handling** (PCI-DSS), plus **cyber-insurance underwriting**, create real obligations. **The honest MSP message:** *"You're largely exempt from the funding-conditioned mandates, but you inherit obligations through ed-tech vendors and tuition payments — and your cyber-insurer will require a control stack regardless."* Never assert SFC is "subject to" FERPA/CIPA without confirming funding/E-rate.

| Regime | Type | Applies to SFC? | Detail |
|---|---|---|---|
| **FERPA** | Federal law | **Generally NOT** (funding-conditioned) | ED.gov: private/parochial K-12 generally don't receive DOE funding → not subject to FERPA. Voluntary FERPA-aligned practice still common/expected by vendors |
| **COPPA** | Federal rule (FTC) | **Yes — via vendors** | Binds online operators for under-13s; school acts as consent agent (school-consent exception) |
| **CIPA** | Federal law | **CONDITIONAL** | Attaches **only if SFC takes E-rate** (or LSTA/ESEA Title III). No E-rate = not bound. **This binary decides CIPA — confirm** |
| **CA SOPIPA (SB 1177)** | CA law | **Yes — via vendors** | Binds K-12 ed-tech "operators" for CA students, public OR private; bars sale/targeted ads/profiling of student data |
| **CA AB 1584 (Ed Code §49073.1)** | CA law | **NOT directly** | Targets public LEAs; private schools adopt its clauses as best-practice vendor contract language |
| **PCI-DSS** | Contractual standard | **Yes** | Any card payments (tuition/fees/donations). Most schools = SAQ A / Level 4 with a tokenized processor to shrink scope |
| **Cyber-insurance** | Underwriting requirement | **Yes (practically)** — THE anchor | To bind/renew, insurers require **MFA + EDR/XDR + immutable/tested backups + email security/awareness training + a tested IR plan.** The cleanest, most concrete pitch anchor |

**Honest framing for the brief:** present these as facts about the environment, map each to an IT control, lead the "why secure" argument with the **cyber-insurance control stack** (concrete + non-political), and put exact applicability (E-rate, federal funding) in the Questions section. Pairs with facts-only discipline. *(UNVERIFIED secondary stats like "41% of cyber applications denied" — omit or label; the control requirements themselves are well-corroborated.)*

---

## 4. K-12 threat landscape — VERIFIED market facts (NOT claims about SFC)

- **82% of K-12 schools experienced a cyber incident** between July 2023 and Dec 2024. *(K12 SIX / sector reporting.)*
- **US education ransomware:** ~130 attacks in 2025 (50 confirmed by Comparitech); a ~9% YoY *decline* in count, but **records exposed rose ~27%** (3.1M → 3.9M across confirmed attacks). *(Comparitech via GovTech / K-12 Dive.)*
- **Average education ransom demand fell 33%:** $694K (2024) → **$464K (2025)** — still existential for a single-campus school. *(Comparitech.)*
- **PowerSchool breach (a K-12 SIS provider):** sensitive data of **60M+ students and 10M+ teachers** exposed; the attacker extorted **$2.85M** (guilty plea, 2025). The single most relevant cautionary tale — a school's biggest data risk is often a *vendor/SIS*, not its own walls. *(GovTech / K-12 Dive.)*
- **Federal K-12 cyber support was cut in 2025** — the US Dept. of Education's Office of Educational Technology was shuttered and MS-ISAC K-12 programs discontinued, leaving schools more on their own. A clean "why now / why a partner" beat. *(K-12 Dive / NBOA.)*

**Why schools are targets:** rich PII on minors (long-lived, hard to remediate), constrained budgets/IT staff, broad device fleets (1:1 student devices), and a long ed-tech vendor chain. Frame as *the floor for "good enough" is higher for a school*, not as fear-mongering.

---

## 5. Competitive / enrollment context (for the AI-growth/admissions angle)

Private K-12 schools in coastal North County San Diego compete for a finite pool of families. SFC's neighbors/peers (name only; for enrollment context):

| School | Where | Note |
|---|---|---|
| **Pacific Ridge School** | Carlsbad | Independent, 6–12, ~661 students; ranked #1 North County |
| **The Bishop's School** | La Jolla | Episcopal, 6–12, tuition ~$49,600 — premium benchmark |
| **Cathedral Catholic HS** | Carmel Valley | Large Catholic 9–12 |
| **La Jolla Country Day** | La Jolla | Independent K–12 |
| **Francis Parker** | San Diego | Independent K–12 |
| **Horizon Prep** | Rancho Santa Fe | Christian (ACSI) K–8/elem — closest faith peer |
| **Grauer / Diegueño / others** | Encinitas area | Smaller independents |

**Enrollment funnel reality:** families discover schools via search, word-of-mouth, and increasingly AI assistants; the journey is inquiry → tour → application → enrollment → re-enrollment. This is the *demand-gen / admissions* angle for the AI section — be the school families find and follow up with fast. SFC's ~25% financial-aid investment signals it actively competes on access. (Keep all SFC-specific enrollment numbers as discovery items.)

---

## 6. AI opportunity inventory for an independent school (efficiency + growth)

**Operational efficiency (the easier yes — give staff time back):**
- Draft routine parent emails, newsletters, forms, permission slips → human reviews/sends
- Answer common parent/family questions (hours, calendar, policies) across web/email/text
- Admissions inquiry triage + fast, personal follow-up
- Summarize/organize policies & how-tos into a searchable staff knowledge base
- Help-desk deflection for staff/faculty IT questions
- Document/records handling (with strict student-data guardrails)

**Growth / enrollment (schools DO compete online):**
- AEO/SEO so SFC is the school families find for "private Christian school Solana Beach / North County"
- Reputation/review velocity (Google, Niche, GreatSchools)
- Faster inquiry response = higher tour-booking conversion

**Guardrails (lead with these):** never put student PII into public AI tools; human-in-the-loop on anything family-facing; private, governed deployments; AI assists staff, never replaces educators' judgment. Tie to NIST AI RMF / responsible-AI education layer.

---

## 7. What we did NOT assume → questions for the meeting

Environment (servers/endpoints, on-prem vs cloud, M365/Google, network/Wi-Fi, where 3CX is hosted), security stack (EDR/SIEM/MFA/backup/email security), the SIS/LMS and ed-tech inventory, current IT structure (in-house vs MSP, is Rob the whole team?), compliance posture & E-rate/federal-funding status, tuition-payment processor, enrollment trends/targets, and decision chain (Head of School/Business Office/Board). All deliberately left open → Questions section.

---

## 8. Sources (selected)

- SFC: en.wikipedia.org/wiki/Santa_Fe_Christian_Schools; privateschoolreview.com (SFC profile); niche.com; usnews.com; CDE School Directory (cdscode 37683466927883); sfcs.net (admissions/tuition).
- 3CX/Twilio/Check Point: 3cx.com V20 change log; 3cx.com/docs/manual/firewall-router-configuration; 3cx.com/docs/sip-trunk/twilio; 3cx.com community (V20 firewall threads); twilio.com/docs/sip-trunking.
- Compliance: studentprivacy.ed.gov (FERPA); ftc.gov (COPPA); CA SOPIPA SB 1177 + AB 1584 (leginfo.ca.gov); fcc.gov (CIPA/E-rate); PCI SSC.
- K-12 threat: K-12 Dive (ransomware 2025); GovTech "Cyber Attacks on Schools…2025"; Comparitech education ransomware roundup; NBOA "Cyberattacks on Education Up 23%"; PowerSchool breach coverage; K12 SIX.
- Competitors: pacificridge.org; bishops.com; privateschoolreview / niche profiles.

**Reconcile:** a background deep-research agent was also run; fold in any additional verified facts it returns (esp. Rob's full name/title, head of school, SIS/tech stack) — only if independently sourced.
