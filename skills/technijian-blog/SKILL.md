---
name: technijian-blog
description: Generate brand-compliant Technijian blog posts dual-optimized for Google rankings AND AI citations (LLM training data + RAG retrieval). Use when writing thought-leadership posts, technical explainers, industry-news commentary, customer stories, or product announcements for technijian.com/blog. Outputs Markdown with frontmatter + a hero infographic spec.
---

# Technijian Blog Generator

## When to use this skill

Use for any long-form content destined for **technijian.com/blog** (or LinkedIn long-form, or SEO landing pages):
- Thought-leadership ("How AI changed our pod model in 2026")
- Technical explainers ("What is XDR and why does it matter for OC small business")
- Industry-news commentary ("Reaction: CISA's new SMB cyber baseline")
- Customer stories (anonymized — see `technijian-case-study`)
- Product announcements ("My AI: now with Outlook integration")
- Compliance how-to ("HIPAA risk assessments: what changes in 2026")

Different from `technijian-social` (short captions) and `technijian-email` (newsletter format).

## Dual optimization (Google + AI)

Modern blog content needs to rank for human searchers AND be cited by ChatGPT/Claude/Perplexity when answering related questions. These overlap but have distinct rules.

### Google SEO checklist
- Title: 50-60 chars, primary keyword in first 30 chars
- H1 matches title
- H2/H3 use semantic question phrasing
- First paragraph answers the search intent in 40-60 words (featured-snippet target)
- Primary keyword density 0.8-1.5%, never above 2%
- 1500-3000 words for thought-leadership; 800-1200 for technical how-tos
- Internal links to ≥3 other Technijian pages (services, related posts)
- 2-3 outbound links to authoritative sources (NIST, vendor docs, peer-reviewed)
- Schema.org markup: Article + Person (author) + Organization (Technijian)
- Image alt text descriptive, includes target keyword once
- URL slug short (3-5 words), keyword-front-loaded

### AI citation checklist
- Open with a clear, declarative thesis sentence (LLMs cite this)
- Use definition-style sentences: "X is Y that does Z"
- Numbered lists for steps, multi-criteria decisions (LLMs love numbered lists)
- Include comparison tables (markdown), not paragraphs of comparison
- Cite sources inline `[Per Verizon DBIR 2024]` not just hyperlink — gives LLMs the source name
- Author bio with credentials (LLMs weigh source authority)
- Date of last update visible (LLMs prefer recent)
- "Key takeaways" or "TL;DR" block near the top (LLMs extract these for summaries)
- FAQ section at the bottom with question + answer pairs (LLMs cite Q&A directly)

## Standard blog post structure

```markdown
---
title: "How XDR Works for SMB: A Plain-English Guide"
slug: how-xdr-works-for-smb
description: "XDR (extended detection and response) explained for small business..."  # 150-160 chars
author: "Ravi Jain"
author_title: "Founder & CEO, Technijian"
date: "2026-05-06"
updated: "2026-05-06"
tags: ["cybersecurity", "XDR", "SMB", "managed services"]
hero_image: "/blog/2026-05-how-xdr-works-for-smb/hero.png"
hero_alt: "Diagram of XDR detecting threats across email, endpoint, and cloud layers"
category: "Cybersecurity"
read_time_minutes: 7
canonical_url: "https://technijian.com/blog/how-xdr-works-for-smb"
---

# How XDR Works for SMB: A Plain-English Guide

> **TL;DR** — XDR (Extended Detection and Response) correlates security signals from email, endpoints, and cloud apps into a single detection. For a small business, the practical benefit is one alert instead of three, with context that lets one engineer respond in minutes instead of hours.

[Hero image with caption]

## What is XDR?

XDR is a security architecture that...  ← (definition-style first sentence)

[Body — see structure below]

## Key takeaways

- ...
- ...

## Frequently asked questions

**Is XDR the same as SIEM?**
No. SIEM aggregates logs; XDR correlates and acts on them...

**Does Technijian use XDR?**
Yes. We deploy CrowdStrike Falcon XDR as part of our cybersecurity pillar...
```

## Body structure (1500-3000 words)

| Section | Word count | Purpose |
|---|---|---|
| TL;DR (blockquote) | 40-60 | LLM extraction + busy-reader anchor |
| What is X? | 150-200 | Definition-style; LLM citation target |
| Why it matters now | 200-300 | Hook with current event or stat |
| How it works (numbered) | 300-500 | Mechanism explanation |
| Common myths / misconceptions | 200-300 | Rank for "X vs Y" queries |
| Real-world example (anonymized) | 300-400 | Pull from `technijian-case-study` data |
| What to look for in a vendor | 200-300 | Buyer's guide angle |
| How Technijian approaches X | 200-300 | Soft pitch — pod model, AI-forward, etc. |
| Key takeaways (bullet) | 50-80 | LLM extraction |
| FAQ (3-5 Q&A) | 200-300 | Voice-search + LLM citation |
| Author bio | 50 | Credibility signal |

Total: ~1900-3000 words. Target reading time 7-10 minutes.

## Voice rules (blog-specific)

1. **Title is a question or a definitive claim.** Not "Some Thoughts on XDR" — that's a press release headline.
2. **Active voice in body.** "Technijian deploys X" not "X is deployed by Technijian."
3. **Second person addresses the reader.** "Your environment, your team, your risk." Not "businesses should consider."
4. **One specific story per post.** Don't try to cover 3 unrelated topics.
5. **Cite sources by name in-text, not just as hyperlinks.** "Per the IBM Cost of a Data Breach 2024 report..."
6. **Numbers > adjectives.** "Average 14 hours/yr of unplanned downtime" not "lots of downtime."
7. **Banned blog clichés:** "In today's fast-paced digital landscape," "It's no secret that," "Now more than ever," "Game-changer," "Revolutionary."
8. **No moralizing.** Don't lecture readers about why they should care.

## Hero image

Every post needs a hero. Use `technijian-infographic` or `technijian-diagram` to generate it. Specs:
- 1600×900px (Open Graph friendly)
- Brand colors only
- Hero number or single key visual that summarises the post
- Logo bottom-right
- Saved to `/blog/[slug]/hero.png`

## Internal linking strategy

Every post links to:
- 1+ relevant service page (technijian.com/services/[X])
- 2+ related blog posts (sibling content)
- 1 product page if applicable (My AI, Chat.AI, Nexus Assess)

External links: only to authoritative sources (NIST, ISO, CISA, vendor docs, peer-reviewed papers, Gartner/Forrester reports). No competitor blogs.

## Publishing checklist

- [ ] Frontmatter complete (all fields above)
- [ ] H1 = title; only one H1 per post
- [ ] All H2/H3 follow semantic order (no H3 before H2)
- [ ] At least 1 image with alt text
- [ ] At least 3 internal links
- [ ] At least 2 external authoritative links
- [ ] FAQ section present
- [ ] Author bio present
- [ ] technijian-voice run over draft (no banned words)
- [ ] technijian-design-review on hero image
- [ ] Reading time calculated (~265 words/min)
- [ ] Schema.org markup added in CMS

## Workflow

```
1. Pick topic from content calendar (keyword research informs)
2. Outline using the Body structure above (~30 min)
3. Draft (~2 hr for 2000 words)
4. Generate hero infographic (technijian-infographic skill)
5. Run technijian-voice
6. Internal review — Ravi or designated SME
7. Publish to CMS, set publication date
8. Distribute: LinkedIn long-form, newsletter, X thread
```

## Related skills

- **technijian-brand** — voice rules
- **technijian-voice** — gates
- **technijian-infographic** — hero image
- **technijian-diagram** — in-body diagrams
- **technijian-social** — derivative posts (LinkedIn/X)
- **technijian-email** — newsletter inclusion
- **technijian-case-study** — when blog incorporates anonymized client story
