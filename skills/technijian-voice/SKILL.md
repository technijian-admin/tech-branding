---
name: technijian-voice
description: Audit any Technijian text artifact for voice/tone violations — banned words, off-brand phrasing, compliance-guarantee language, AI slop, weak CTAs. Use over draft prose BEFORE rendering to PDF/DOCX/HTML, and as part of technijian-design-review. Reads the use/avoid word lists from brand-tokens.json so a single edit propagates everywhere.
---

# Technijian Voice & Tone Auditor

## When to use this skill

Run before rendering any text-heavy artifact to its final format:
- Brochure/datasheet/case-study HTML (before PDF)
- Proposal / report / letter drafts (before DOCX export)
- Email campaign body (before send)
- Social caption (before post)
- Blog post draft
- RFP response sections

Do NOT use for: legal contracts (NDAs, MSAs, SOWs use precise legal language by design — voice rules don't apply to clauses).

## The Technijian voice (from brand guide)

> Down-to-earth and non-corporate. We are a knowledgeable friend offering clear, helpful guidance.

Five tone dials:
- **Friendly** — but not unprofessional
- **Informative** — but not authoritative
- **Smart** — but not complicated
- **Confident** — but not showy
- **Proactive** — but not pushy

## Hard gates (block sign-off)

### V1 — Banned words

The following words are banned; flag every occurrence and suggest the replacement. Source: `assets/brand-tokens.json` `voice.avoid_words`.

| Banned | Replace with |
|---|---|
| vendor, resource, asset (when describing people/team) | partner, team, dedicated |
| reactive, break-fix | proactive, preventive |
| revolutionary, game-changing, disruptive, paradigm-shifting | practical, effective, modern |
| cost, expense | investment |
| guarantee compliance, ensure compliance | navigate compliance, support your compliance posture |
| cutting-edge, bleeding-edge | modern, AI-forward |
| synergistic, end-to-end, leverage, unlock, seamless, holistic, robust, world-class | (delete or rewrite — these are buzzwords with no meaning) |
| best-of-breed, mission-critical (overused) | use only when truly accurate; otherwise delete |
| utilize | use |
| prior to | before |
| in order to | to |
| Technology Support, Your Way. (RETIRED tagline) | technology as a solution (lowercase, no period) |

The retired tagline `Technology Support, Your Way.` must NEVER appear — flag every occurrence as a hard violation. The only current tagline is `technology as a solution` (lowercase, no trailing period).

### V2 — Compliance overpromise

Flag any phrase claiming guaranteed compliance outcomes. Banned patterns:
- "We guarantee HIPAA compliance"
- "Ensure SOC 2 certification"
- "Make you PCI compliant"

Required phrasing:
- "Help you navigate HIPAA requirements"
- "Support your SOC 2 readiness"
- "Address PCI DSS control requirements"

### V3 — Buzzword stacking

Flag sentences that string together 3+ buzzwords without concrete meaning. Example:
> "Our synergistic, end-to-end, AI-driven, cloud-first platform leverages cutting-edge technology to unlock unprecedented business value."

Action: rewrite to state one concrete benefit with one concrete mechanism.

### V4 — Forbidden client references

Per `feedback_no_client_names.md`, the following names cannot be used as completed-project case studies:
- Anderson Real Estate, Aventine Apartments, Brandywine Homes, Mason West, Talsco, JVR Sheetmetal, CHL, Canusa Hershman

Flag every literal occurrence. They may appear in cover letters TO those prospects, but never in marketing collateral as proof.

### V4b — Fabricated proof / undelivered capability

The service is launching — there are NO completed client projects. Flag any of the following as hard violations (no fabricated proof allowed):
- Invented outcome metrics presented as fact ("reduced downtime 47%", "saved $200K", "improved uptime to 99.99%") with no real source. Case studies may describe scope + effort only — never fabricated result numbers.
- Made-up customer quotes, testimonials, star ratings, or review counts.
- Statistics presented as Technijian's track record that aren't grounded in a real source.
- A not-yet-built capability described as already delivered. Reframe as a dated near-term build ("launching Q3 2026"), never as live/shipped.

Rule of thumb: any figure that isn't grounded should be flagged "confirm at discovery" or relabeled as an estimate. Real anonymized industry profiles (e.g. "a 40-attorney firm") are fine; fabricated specifics are not.

### V4c — Wrong contact / CTA phone number

The MAIN contact and CTA number is the switchboard **949.379.8499** (reaches USA + India). Flag these as hard violations:
- `949.379.8500` used as the general contact / CTA number — that line is **Sales-direct only**.
- `949.379.8501` used as the general contact / CTA number — that line is **Billing-direct only**.

8500 and 8501 are valid ONLY when the context is explicitly sales-direct or billing-direct, respectively. On letterhead, business cards, generic "contact us" / "book a call" CTAs, the number must be 949.379.8499. (Source: `assets/brand-tokens.json` — read the number from there; hardcoded copies are a cached convenience and must stay in sync.)

### V4d — Channel / referral overpromise

When prose describes partner / channel / referral economics, flag open-ended or inflated commitments as hard violations:
- "10–20%", "up to 20%", or any open-ended "ongoing %" referral share.
- Referral share applied to hardware or one-time fees.

Correct framing: a referral pays the partner a MAX of **10% of the gross monthly SERVICE invoice only** (not hardware, not one-time). The alternative is a resale markup the partner sets themselves. Flag anything exceeding or vaguer than that cap.

## Soft gates (warn)

### V5 — Weak CTAs

Flag and suggest stronger alternatives:

| Weak | Strong |
|---|---|
| Click here | Schedule a Call / Get the report / Read the case study |
| Learn more | See how it works (with specific outcome) |
| Contact us | Talk to a Technijian engineer |
| Get started | Book a 30-minute consultation |
| Get started (high-friction first ask) | Claim your free Nexus Assess (internal + external vulnerability + M365 review) |

Prefer the free **Nexus Assess** assessment as the low-friction first-step CTA on-ramp when the artifact is trying to convert a cold/new prospect — it's an easier "yes" than a paid engagement. Also flag CTAs that point at a signature widget (e.g. "use the Book-a-Meeting button in my signature"); the CTA should be one explicit, in-document action with the main number 949.379.8499 or a named link.

### V6 — Passive voice in marketing copy

Flag passive constructions in headlines and body of marketing collateral. Active voice preferred. (Acceptable in legal/policy text.)

### V7 — Sentence length

Flag sentences > 28 words in marketing copy. Split into two.

### V8 — All-caps in body

Flag all-caps phrases in body text (acceptable in section labels like "TECH TIP", "NOTICE:", "CASE STUDY"). Banned in body paragraphs.

### V9 — Excessive punctuation

Flag !!, ??, …!, multi-exclamation. One exclamation per artifact maximum.

### V10 — First-person singular "I"

Marketing collateral represents the company; use "we" not "I" (except in CEO letters / founder quotes).

## Cosmetic gates

### V11 — Em-dash vs hyphen

- Use em-dash `—` (no spaces) for parenthetical breaks: "the team — all 12 of us — agree"
- Use en-dash `–` for ranges: "9–5", "Q1–Q3"
- Use hyphen `-` only for compound modifiers: "client-facing"

Flag misuse.

### V12 — Oxford comma

Use Oxford comma for clarity: "managed IT, cybersecurity, and cloud" — not "managed IT, cybersecurity and cloud".

### V13 — Numbers under 10

Spell out one through nine; use numerals for 10+. Exceptions: stats, percentages, dollar amounts, version numbers.

## Audit recipe

```python
# Pseudocode — run text through these checks
import re, json

tokens = json.load(open('assets/brand-tokens.json'))
avoid = tokens['voice']['avoid_words']['$value']
forbidden_clients = ['Anderson Real Estate', 'Aventine', 'Brandywine Homes',
                     'Mason West', 'Talsco', 'JVR Sheetmetal', 'CHL', 'Canusa Hershman']

def audit(text):
    findings = []
    # V1: banned words
    for word in avoid:
        for m in re.finditer(r'\b' + re.escape(word) + r'\b', text, re.I):
            findings.append({'gate': 'V1', 'severity': 'hard', 'pos': m.start(), 'word': word})
    # V2: compliance overpromise
    for pat in [r'guarantee\s+(?:HIPAA|SOC ?2|PCI|GDPR|compliance)',
                r'ensure\s+(?:HIPAA|SOC ?2|PCI|GDPR|compliance)',
                r'make\s+you\s+(?:HIPAA|SOC ?2|PCI|GDPR)\s+compliant']:
        for m in re.finditer(pat, text, re.I):
            findings.append({'gate': 'V2', 'severity': 'hard', 'pos': m.start()})
    # V4: forbidden client names
    for name in forbidden_clients:
        for m in re.finditer(re.escape(name), text):
            findings.append({'gate': 'V4', 'severity': 'hard', 'pos': m.start(), 'word': name})
    # V1/V4b: retired tagline
    for m in re.finditer(r'Technology Support,?\s*Your Way\.?', text, re.I):
        findings.append({'gate': 'V1', 'severity': 'hard', 'pos': m.start(),
                         'note': 'retired tagline -> "technology as a solution"'})
    # V4c: wrong CTA phone (8500=sales-direct, 8501=billing-direct; main is 8499)
    for m in re.finditer(r'949[.\- ]?379[.\- ]?850[01]\b', text):
        findings.append({'gate': 'V4c', 'severity': 'hard', 'pos': m.start(),
                         'note': 'use main 949.379.8499 unless context is explicitly sales/billing-direct'})
    # V4d: referral overpromise
    for m in re.finditer(r'(1\d\s*[-–]\s*20\s*%|up to\s*20\s*%|ongoing\s*%)', text, re.I):
        findings.append({'gate': 'V4d', 'severity': 'hard', 'pos': m.start(),
                         'note': 'referral cap = 10% of gross monthly service invoice'})
    # ... add V4b (fabricated proof — judgment-based), V5–V13 similarly
    return findings
```

## Output format

```markdown
## Voice Audit: [Artifact Name]
**Verdict:** [PASS | FIX-REQUIRED]

### Hard violations (must fix)
- [V1] line 12: "we leverage cutting-edge AI to unlock business value" → rewrite ("we use modern AI to do X")
- [V2] line 47: "guarantee HIPAA compliance" → "support your HIPAA posture"

### Warnings
- [V5] line 88: weak CTA "Learn more" → "Read the 60-second My AI overview"

### Cosmetic
- [V11] line 3: hyphen used where em-dash needed
```

## Voice cheat sheet (quick reference)

**Always:**
- Lead with client challenge, not capability
- Use "investment" for pricing
- "Pod model" when describing team
- "Technijians" (plural) for the team itself
- "technology as a solution" tagline in covers/closings

**Never:**
- "Vendor" or "resource" for people
- "Cost" or "expense" for investment
- Compliance-outcome guarantees
- Three-buzzword chains
- Real client names as case studies
- The retired tagline "Technology Support, Your Way."
- 949.379.8500 / 8501 as the generic contact/CTA number (use 949.379.8499)
- Fabricated metrics, quotes, ratings, or stats; undelivered capability framed as already shipped
- "10–20%" / open-ended referral share (cap is 10% of gross monthly service invoice)

## Related skills

- **technijian-brand** — voice rules source
- **technijian-design-review** — runs voice gates as part of artifact QA (S4)
- All content-producing skills (proposal, report, brochure, datasheet, email, social, blog, case-study) should be filtered through this skill before render
