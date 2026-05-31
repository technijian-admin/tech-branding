---
name: technijian-video-script
description: Generate brand-compliant Technijian video scripts optimized for HeyGen avatar pipelines, screen-record explainers, and short-form social video. Use when producing weekly newsletter videos, service-explainer demos, internal training, or LinkedIn/YouTube short-form. Outputs a structured script with B-roll cues, lower-third callouts, and HeyGen-ready voice direction.
---

# Technijian Video Script Generator

## When to use this skill

Use for any Technijian video output:
- Weekly newsletter video (Ravi or avatar) — 60-90s
- Service explainer (My AI, Chat.AI, Nexus Assess) — 90-120s
- Customer-story video (anonymized) — 60-90s
- Tech-tip short (LinkedIn/X/YouTube Shorts) — 30-45s
- Training/onboarding for new clients — 5-10 min
- Conference/webinar opener — 30-60s

Reference: `reference_tech_leads_case_studies.md` documents Technijian's HeyGen avatar video production capability — this skill produces the script that feeds that pipeline.

## Format selection

| Format | Duration | Output | Use |
|---|---|---|---|
| **HeyGen avatar** | 60-120s | Script + voice direction + B-roll cues | Newsletter, service explainer, repeated production |
| **Founder talking head** (Ravi on camera) | 60-180s | Script + teleprompter file + lower-thirds | Personal POV, customer wins, controversial takes |
| **Screen recording** | 60-300s | Script + narration + screen-cue marks | Product demos, technical how-tos |
| **Animated kinetic typography** | 30-60s | Script + word-emphasis marks + visual cues | Short social hooks, statistic stories |
| **Customer interview cut-down** | 60-180s | Question list + paper edit guide | Anonymized customer stories with permission |

## Script structure

```
[HOOK — 0-5s]      Stop the scroll. One question, one stat, or one bold claim.
[CONTEXT — 5-15s]  Why this matters to the viewer right now.
[STORY/TEACH — 15-50s]  The single point. One example. One number.
[SO WHAT — 50-65s]  What the viewer should DO with this knowledge.
[CTA — 65-75s]     One specific next step. Phone, link, schedule.
```

90-second target = ~225 spoken words at 150 wpm.

## Standard script template

```yaml
---
title: "How Pod Model Eliminates Ticket Lottery"
duration_target_seconds: 75
format: HeyGen-avatar
avatar_id: "ravi-default-001"   # HeyGen avatar identity
voice_id: "ravi-voice-en-US"    # HeyGen voice clone
voice_style: "conversational, calm, slight smile"
date: "2026-05-06"
distribution: ["technijian.com/blog", "newsletter", "linkedin"]
captions: true
languages: ["en-US"]
---

# Script

## [HOOK — 0-5s]
**Visual:** Avatar med-close, light office background.
**Lower-third:** "Ravi Jain · Founder, Technijian"
**SAY:** Have you ever called IT support and gotten a different person every time?

## [CONTEXT — 5-15s]
**Visual:** Avatar; B-roll of stock IT helpdesk frustration scene cut at 8s.
**SAY:** That's the ticket lottery. You explain the problem. They ticket it. Tomorrow someone new asks the same questions.

## [STORY — 15-50s]
**Visual:** Cut to text-on-screen animation showing "POD MODEL" in Core Blue.
**Lower-third:** "Pod = dedicated team per client"
**SAY:** Twenty-five years ago we said: never again. Every Technijian client gets a pod — same vCIO, same lead engineer, same backup engineer. They know your network, your apps, your people. When you call, they pick up where the last conversation ended.

## [SO WHAT — 50-65s]
**Visual:** Avatar. Lower-third clears.
**SAY:** Resolution time drops by half. Trust goes up. Your team stops doing IT triage in their heads.

## [CTA — 65-75s]
**Visual:** Avatar. Lower-third: "949.379.8499 · technijian.com"
**SAY:** If you're tired of explaining your environment every time, let's talk. Thirty minutes. No pitch. Just a conversation about your team.
```

## Brand assets, tagline & contact (single source of truth)

- **Tagline:** **"technology as a solution"** (lowercase, no period) — used on the closer bumper / brand sign-off. The old **"Technology Support, Your Way."** is RETIRED — never use it.
- **Single source of truth:** `assets/brand-tokens.json` holds the canonical colors, tagline, phone, and logo paths. Read/sync from it for any intro/outro graphic, lower-third color, or end card — do not hardcode (hardcoded values are only a cached convenience and will drift).
- **Logos:** use the REAL logos — full-color on light backgrounds, reverse-white on dark — centered (e.g. in opener/closer bumpers and end cards).
- **Main contact / CTA number is the switchboard 949.379.8499** (reaches US + India). Do NOT use 949.379.8500 (Sales-direct only) or 949.379.8501 (Billing-direct only) as a general CTA. Spoken digit-by-digit: "nine-four-nine, three-seven-nine, eight-four-nine-nine."
- **On-ramp CTA:** the strongest low-friction next step is the free **Nexus Assess** assessment (Network Detective: internal + external vulnerability scan + Microsoft 365 review) — pitch it as the easy first step before "call us."
- **Two offices** if a script needs them: Irvine HQ (18 Technology Dr Ste 141, Irvine CA 92618) + Panchkula India delivery center.

## Honesty discipline

The service is launching — there are NO completed client projects. Do NOT fabricate proof, metrics, testimonials, quotes, or stats in any script. For customer-story / "proof" beats use anonymized industry profiles (scope + effort only, no invented outcome numbers). Frame any not-yet-built capability as a dated near-term build, never as already delivered. Flag any figure as an estimate "confirmed at discovery."

## Verify before done

If the deliverable includes rendered storyboard frames, end cards, bumpers, or on-screen-text mockups, render EVERY frame to an image and visually proofread it at display size before declaring done — confirm the tagline, phone number, and logo are correct and legible, and that no caption or lower-third text is clipped or stranded. Never declare done unverified.

## HeyGen voice direction tips

- **Pacing marks:** use commas for natural breath; ellipses force pauses ("...same engineer").
- **Emphasis:** UPPERCASE for emphasized words ("they KNOW your network").
- **Avoid commas in numbers:** "fifteen minutes" not "15," (HeyGen mispronounces).
- **Spell tricky words phonetically:** "vCIO" → "vee-see-eye-oh" in pronunciation field.
- **No interjections** ("um", "uh", "you know") — HeyGen renders them robotically.
- **Read aloud and time** before uploading — actual delivery is often 10% slower than read.

## B-roll & visual cue conventions

| Cue | Meaning |
|---|---|
| `[CUT TO: ...]` | Hard cut to specified visual |
| `[B-ROLL: ...]` | Cutaway during dialogue |
| `[OVERLAY: ...]` | Text or graphic over avatar |
| `[LOWER-THIRD: ...]` | Bottom-screen name/title strap |
| `[CHYRON: ...]` | Full-screen text card |
| `[SFX: ...]` | Sound effect |

## Brand spec for video

| Element | Spec |
|---|---|
| Aspect ratio | 16:9 for landing pages/YouTube; 9:16 for shorts; 1:1 for LinkedIn feed |
| Resolution | 1920×1080 minimum |
| Color palette | Brand tokens (intro/outro graphics) |
| Lower-third style | Off-white card, Core Blue text, Core Orange accent strip |
| Bumpers | 2-3s opener with logo + tagline ("technology as a solution"); 3-5s closer with CTA (949.379.8499 / Nexus Assess) |
| Captions | Always on; Open Sans Bold, white with 30% black drop, sentence case |
| Music | Royalty-free, bed at -28dB; no music during dialogue if unfamiliar voice |
| Logo | Bottom-right corner watermark, 80px wide, 40% opacity |

## Voice rules for video scripts

1. **Spoken English ≠ written English.** Contractions ("we're", "don't"), shorter sentences, fewer subordinate clauses.
2. **Read every script aloud.** If you stumble, the avatar will too.
3. **One idea per video.** Multi-topic videos lose viewers at the topic switch.
4. **Specific numbers > vague claims.** "Resolution time drops by half" not "improves dramatically."
5. **Direct address.** "You" not "businesses." "We" not "Technijian."
6. **No buzzword stacking** (per `technijian-voice`).
7. **Phone number spoken digit-by-digit** for clarity: "nine-four-nine, three-seven-nine, eight-four-nine-nine." (Main line 949.379.8499 — not 8500/8501.)

## Distribution metadata

Every script ends with this block (used by the publishing pipeline):

```yaml
distribution:
  youtube:
    title: "[max 60 chars, keyword-front-loaded]"
    description: "[~250 words including link, timestamps, hashtags]"
    tags: [...]
    thumbnail: "[path to 1280x720 PNG]"
  linkedin:
    caption: "[~120 words, 2-3 hashtags]"
  newsletter:
    placement: "lead | feature | quick-tip"
    embed_url: "[hosted video URL]"
```

## Workflow

```
1. Pick a single topic (one idea per video)
2. Draft the 5-block script (Hook / Context / Story / So-What / CTA)
3. Read aloud; time it; trim to budget
4. Run technijian-voice
5. Mark visual cues + lower-thirds
6. Generate caption file (.srt)
7. Submit to HeyGen pipeline OR record live OR send to editor
8. Review the output; iterate ONE pass max
9. Publish per distribution metadata
```

## Related skills

- **technijian-brand** — colors/typography for lower-thirds
- **technijian-voice** — voice gates (relaxed for spoken — contractions OK)
- **technijian-social** — derivative captions for LinkedIn/X
- **technijian-blog** — companion long-form post
- **technijian-design-review** — bumpers, lower-thirds, thumbnail QA
