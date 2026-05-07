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

## Soft gates (warn)

### V5 — Weak CTAs

Flag and suggest stronger alternatives:

| Weak | Strong |
|---|---|
| Click here | Schedule a Call / Get the report / Read the case study |
| Learn more | See how it works (with specific outcome) |
| Contact us | Talk to a Technijian engineer |
| Get started | Book a 30-minute consultation |

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
    # ... add V5–V13 similarly
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

## Related skills

- **technijian-brand** — voice rules source
- **technijian-design-review** — runs voice gates as part of artifact QA (S4)
- All content-producing skills (proposal, report, brochure, datasheet, email, social, blog, case-study) should be filtered through this skill before render
