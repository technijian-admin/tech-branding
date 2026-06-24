# CDLX — CardLogix Corporation
## Research Foundation (Phase 1, per technijian-biz-dev-blueprint skill)

**Status:** RESEARCH-ONLY · built 2026-05-29 for 1:00 PM PT Teams meeting with Nick Schooler · NOT yet rendered to DOCX/PDF. Decision on full blueprint vs. light follow-up collateral comes AFTER the meeting.

---

## 1. Business Snapshot

| Field | Value |
|---|---|
| Legal name | CardLogix Corporation |
| Internal code | CDLX |
| Founded | 1998 (28 years; ships to 43+ countries) |
| HQ | **16 Hughes, Irvine, CA 92618** (same zip as Technijian @ 18 Technology Dr, Ste 141 — minutes apart in the Spectrum) |
| Secondary address | 22521 Avenida Empresa Ste 103-104, Rancho Santa Margarita, CA 92688 (older — may be legacy) |
| Annual revenue | ~$6M (2026, per ZoomInfo / Crunchbase-class signals) |
| Headcount | ~14–25 (sources disagree 14 → 25–100; the SDR's "5–6 workstations + 2 servers + IT run solo by Nick" strongly suggests the lower end is correct) |
| Website | https://www.cardlogix.com/ |
| Tagline | "Smart Card Manufacturer & Software Developer" |

## 2. Leadership

| Name | Role | Notes |
|---|---|---|
| **Sebastien Goulet** | Chairman & CEO | Final decision-maker. Not in our meeting. |
| Ken Indorf | Board of Directors | — |
| Tom Hope | Director of Sales | Owns CardLogix's commercial relationships — relevant for the partnership track. |
| **Nick Schooler** | Business Development | **OUR MEETING.** Email nick@cardlogix.com · 949-380-1312 · LinkedIn: nickschooler · "extremely knowledgeable in smart card technology"; authors blog content on the cardlogix.com site (most recent post Feb 2026). |

**Read on Nick:** BD/sales-engineering type, not a P&L owner. He can champion both tracks (their IT + the partnership) internally and influence Goulet/Hope, but he's not the signing authority for the partnership-level commitment. He IS likely the signing authority for a modest co-managed IT engagement at their own shop.

## 3. What CardLogix Actually Does (product taxonomy)

### Hardware
- **Credentsys™ PIV Card** — contact PIV on Common Criteria EAL 5+ silicon, FIPS 201 compliant
- **Credentsys™ Dual-Interface PIV** — newest product line (recent CardLogix news-room release)
- **FIDO2 Smart Cards** — explicitly marketed as "compliant with CJIS and NIST AAL2/AAL3 requirements"
- **Hirsch uTrust FIDO2 Smart Card** (resold/integrated; partner = Identiv) — FIPS 140-3, unifies FIDO2/U2F/PIV/OpenPGP into one credential
- **GoTrust Idem Key FIDO2 / PIV** (resold)
- **First Responder Authentication Credential (FRAC)** — PIV-Interoperable cards for LE
- **CR100 cards** (CardLogix proprietary form factor)

### Biometric / handheld
- **BIOSID®** — IP67-rated handheld, multi-modal biometric capture + smart-card R/W
- **Corvus Portable Identity Kit (PIK)** — biometric enrollment in the field (civil ID, customs, LE)

### Software
- Smart Card Issuance Software, Identity Verification, Card Validation

### Certifications / standards CardLogix products carry
- NIST-certified (cards)
- GSA-approved (HSPD-12, FIPS 201)
- Common Criteria EAL 5+ silicon
- CJIS-compliant (FIDO2 line)
- NIST AAL2/AAL3 aligned

### Markets they serve (per their own site)
- National IDs, Government / Military IDs
- Driver Licenses, Voting Cards
- National Healthcare Programs
- **Local, state, federal governments** (indirect channel)
- Education, healthcare institutions
- Enterprise

### Channel posture
**Indirect.** They sell THROUGH integrators / resellers (e.g., Iriscan is a named official reseller). They do not appear to be a direct-to-agency operator. This is the seam where Technijian fits.

## 4. GTM Motion Classification (per blueprint skill Phase 0.2)

**Account-based (ABM)**, both for their own sales AND for any joint go-to-market.

- Their target buyer universe is finite and named (specific federal/state agencies, prime integrators, OEM card resellers).
- This is NOT a place to pitch broad demand-gen / Google-ad / "fill your funnel" lead-gen.
- For the partnership track, the right framing is *channel/integrator partnership* — Technijian becomes an option CardLogix can hand off to or co-sell with when an LE customer needs the full IT/managed-services wrap around the hardware.

## 5. The Two-Track Opportunity

### Track A — CardLogix's OWN IT (the easy land)
- 5–6 workstations + 2 servers
- Nick runs IT himself today (solo, internal)
- "Considered co-managed in the past, cost was the main concern"
- Company is growing — they FEEL the inflection point
- **Technijian fit:** the **Co-Managed IT** model from My IT brochure is purpose-built for this — "we partner with your internal IT team, extending coverage, tools, and senior expertise; after-hours overflow help desk, shared RMM/ticketing/docs, senior architects on demand, compliance & security co-ownership. Best for: Companies with lean internal IT teams."
- Nick keeps strategic control (he stays in the loop); Technijian absorbs the toil (patching, monitoring, after-hours, second-pair-of-eyes on incidents)
- Pricing has to be RIGHT — they walked from a co-managed pitch before on cost. Anchor on per-endpoint Tier 1 / Tier 2 lines, not the full vCIO retainer.

### Track B — CJIS / MFA partnership for law enforcement (the strategic upside)
- CardLogix sells the HARDWARE (PIV / FIDO2 smart cards, FRAC PIV-I, BIOSID biometric kits) that LE agencies need for CJIS-compliant authentication.
- They DON'T deliver the MSP/MSSP wrap around it — card lifecycle management, AD/Entra ID integration, ongoing CJIS-compliant managed IT, managed detection & response (MDR), evidence capture for audits.
- That's exactly where Technijian can fit on the channel side.
- The market timing is hot:
  - **CJIS Security Policy 5.9.5** (July 2024) made MFA mandatory for all CJI access as of **October 1, 2024**.
  - **CJIS 6.0** (December 2024) tightened password + MFA further.
  - **Phishing-resistant MFA is now required** — SMS-MFA is out, FIDO2 / PKI smart cards are in. This is exactly CardLogix's product strength.
  - Section 5.6.2 mandates 2-of-3 factors; PIV/FIDO2 smart cards satisfy this cleanly.

### Honest gap — Technijian CJIS readiness
- My Compliance currently supports **8 frameworks** (HIPAA, SOC 2, PCI-DSS, CMMC/DFARS, GDPR/CCPA, NIST CSF, CIS Controls, ISO 27001). **CJIS is not yet one of them.**
- Closest adjacency = CMMC (similar control families, similar evidence model, similar DoD-style audit posture).
- Honest pitch posture: *"We have not yet built a CJIS practice the way we've built CMMC. But the control families overlap heavily — Entra ID + Defender + conditional access + Teramind insider risk + N-able Passportal — these are the same Lego pieces. If a partnership with CardLogix gives us reason to stand up a CJIS wrapper around our existing My Compliance program, we have a serious head start."*
- Per the `feedback_capability_proof_built_vs_service.md` rule: **do not claim CJIS work Technijian has delivered.** Frame CJIS as a near-term build, not a track record.

## 6. Competitive Landscape — for the partnership angle

Who else does what CardLogix does (and can Technijian be picked over them as the IT-services partner)?

| Vendor | Position | Relevant offering |
|---|---|---|
| **HID Global** | The 800-lb gorilla. HID Crescendo + HID Trusted Identities. | CJIS-certified MFA, smart cards, full ecosystem. Their MSP/integrator channel is mature — Technijian would be Nth in line on a CardLogix peer-comparison. |
| **Identiv** | Hirsch uTrust FIDO2 (CardLogix already resells this). | Direct partner overlap. |
| **Tx Systems** | Smart-card distributor focused on CJIS. | Direct competitor to CardLogix's channel position. |
| **Yubico** | YubiKey FIDO2 — the consumer-tier "easy MFA" pick. | Different price point; many LE agencies pick YubiKey just to satisfy MFA without PIV depth. |
| **CardLogix's edge** | US-based mfg, small-batch + custom programming, NIST/GSA cert, 28-year tenure. | The credentialing-grade story (PIV + biometric + FRAC) is where they win vs. Yubico. |

**Implication for our pitch:** CardLogix doesn't need Technijian to make MORE smart cards. They need a managed-services partner who can be the END-TO-END story so they don't lose deals to HID's tighter ecosystem. That's the value Technijian brings: "we'll manage the agency's IT environment so your cards drop into a CJIS-ready home."

## 7. AI Opportunity Inventory (only if Track B advances)

Hold this for a follow-up artifact AFTER the meeting. The first meeting is about discovery + relationship, not pitching an AI engine on top of an unbuilt CJIS practice.

If asked: My AI products that could attach later =
- AI-assisted CJIS audit-prep (RFP-style doc intelligence → audit evidence packs, like the FINRA Proven Result)
- My Jian AI Agent IT Self-Service for the agency's officers (password resets, MFA enrollment help)
- Knowledge graph of CJIS policy + each agency's controls (Weaviate + Obsidian pattern)

## 8. Sources

- https://www.cardlogix.com/ — corporate site
- https://www.cardlogix.com/services/card-manufacturing/ — manufacturing capability
- https://www.cardlogix.com/markets/identity-smart-id-card/ — markets
- https://www.cardlogix.com/news-room/cardlogix-introduces-the-credentsys-dual-interface-smart-card-family-for-secure-id/ — Credentsys product line
- https://www.cardlogix.com/product/cardlogix-credentsys-piv-card/ — PIV product page
- https://www.cardlogix.com/product-tag/fido2/ — FIDO2 line
- https://www.cardlogix.com/glossary/first-responder-authentication-credential/ — FRAC
- https://www.cardlogix.com/tag/cjis/ — CJIS tag (content marketing aimed at LE)
- https://www.linkedin.com/in/nickschooler/ — Nick's LinkedIn
- https://www.linkedin.com/in/sebgoulet/ — Sebastien Goulet (CEO) LinkedIn
- https://rocketreach.co/cardlogix-corporation-management_b5d65472f42e3203 — management team
- https://rocketreach.co/cardlogix-corporation-profile_b5d65472f42e3203 — company profile
- https://www.zoominfo.com/c/cardlogix-corp/6750883 — ZoomInfo profile (revenue / headcount)
- https://specopssoft.com/blog/cjis-compliance-password-mfa-requirements/ — CJIS 5.9.5 MFA breakdown
- https://www.psportals.com/blog/cjis-authentication-law-enforcement/ — CJIS LE authentication requirements
- https://www.imprivata.com/blog/what-you-need-know-now-about-cjis-6 — CJIS 6.0 changes
- https://www.diversecti.com/2026/01/09/cjis-security-policy-6-0/ — CJIS 6.0 summary
- https://accutivesecurity.com/securing-public-safety-organizations-with-hids-cjis-certified-mfa/ — HID's CJIS positioning (for competitive read)
- https://files.identiv.com/solutions/Identiv_AuthenticationSolutions-for-CriminalJusticeInformationServices-SolutionsBrief.pdf — Identiv LE solutions brief
