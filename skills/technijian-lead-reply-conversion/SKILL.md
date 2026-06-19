---
name: technijian-lead-reply-conversion
description: Playbook for converting an inbound REPLY to Technijian cold outreach into an AI Growth blueprint engagement. Classifies the reply (interested / declined-a-service / hard opt-out) and runs the right play - pivot, convert, or honor-and-gift - then builds the blueprint (via technijian-biz-dev-blueprint) and drafts the email (always to Drafts, never sent). Keywords: cold lead replied, prospect responded, declined, unsubscribe, opt out, "we already have", convert warm lead, blueprint email, conversion reply.
---

# Technijian Lead-Reply Conversion Playbook

## When to use
A prospect or lead **replied** to Technijian outreach and Ravi wants to respond - whether the reply is interest, a brush-off ("we have an IT Manager"), or a hard "unsubscribe." This skill decides the play and drives it end to end. It **pairs with** `technijian-biz-dev-blueprint` (which builds the report) and the email memories; this skill is the *decision tree + email handling + compliance* around them.

**The core insight (Ravi, repeated across MPN / OETT / AHO / Franklin):** *a reply, even a "no," is an opening.* It tells you exactly which lane is closed so you can own an open one. Almost every reply is convertible into a blueprint conversation - except a hard opt-out, which is converted into goodwill, not a pitch.

---

## Step 1 - Read the ACTUAL reply (never work from a paraphrase)
Pull the real message from Ravi's mailbox before deciding anything. Use app-only Graph (creds from the OneDrive keys vault at runtime; see `reference_email_sending`, `feedback_m365_mcp_use_powershell`). The wording determines the play and the compliance posture.

- Search `messages?$search="from:<their-domain or address>"`, read subject + full body text.
- Note: who actually replied (the original recipient vs a shared inbox vs the principal), the exact ask, and any list/footer signals (e.g. "privileged communications," an unsubscribe footer).
- A user's optimistic summary ("they might want AI") is a hope, not the text. Confirm against the real words. (Franklin 2026-06-19: user said "might like AI"; the actual reply was a one-word **"unsubscribe."**)

## Step 2 - Classify the reply and choose the play

| Reply type | Signal | Play |
|---|---|---|
| **Interested / engaged** | Asked a question, replied positively, "tell me more," booked nothing yet | **Convert.** Build the blueprint; draft a warm reply that attaches it (or the exec summary); CTA = the signature Book-a-Meeting button + broaden the topic (`feedback_outreach_cta_signature_button`, biz-dev Phase 11). |
| **Declined a specific service** | "We have an IT Manager," "we have a network team," "we don't need IT/MSP" | **Post-decline reframe.** Do NOT re-pitch the declined service. Pivot the ENTIRE blueprint to adjacent AI value the incumbent does NOT provide, addressed to the person who replied, framed as *complementary to* (never competing with) what they already have. (OETT -> AI for training/curriculum, complementary to their IT Manager; AHO -> AI for mission growth, keep your network team; MPN -> growth engine, not "we'll run your IT.") See `feedback_reframe_off_declined_service`. |
| **Hard opt-out / unsubscribe** | "unsubscribe," "remove me," "stop emailing" | **Honor it (CAN-SPAM).** Suppress the address from outreach; send NO further marketing. The blueprint is still worth building as an **internal asset** for a future *opted-in* channel. Optionally (Ravi's call) a single **removal-confirmation + goodwill** reply: confirm removal, leave the blueprint as a no-strings gift, **NO sales CTA, no meeting ask.** (Franklin 2026-06-19.) |
| **Wrong person / "talk to X"** | Redirect to a colleague | Build for the org; address/route to the named decision-maker; warm the replier as champion. |

**Classify before you build.** The same blueprint content is framed very differently across these. Getting the GTM/decline framing wrong is the #1 way the deliverable misses (biz-dev Phase 0.2).

## Step 3 - Build the blueprint
Run `technijian-biz-dev-blueprint` end to end. Non-negotiables that bite every time:
- **Facts-only** (pre-discovery): report only verified facts; convert unknowns into a "Questions to Complete the Analysis" section; never assume their environment/finances (`feedback_facts_not_assumptions_pre_discovery`).
- **Framing to the org type:** for-profit -> growth + conservative ROI vs entry; **nonprofit/training trust -> mission capacity, NO ROI multiples, "peers" not "competitors"** (OETT, AHO).
- **Sensitive-data clients** (children, health, PII - e.g. an educational-therapy practice): make **data privacy the foundation, not a footnote** - private governed deployments, human-in-the-loop on anything a child/parent sees, never feed records to public AI. It is also a trust differentiator. (Franklin.)
- **Authentic logo** (`feedback_logo_use_authentic_files`), **live TOC field** + Word-COM convert (`feedback_toc_must_be_live_field`), **render every page** + ink-scan + mojibake scan before declaring done. Verify the client code is unique in the Client Portal.

## Step 4 - Draft the email (ALWAYS to Drafts, NEVER auto-send)
Mechanics (reusable scripts: `Clients/OETT/draft-oett-email.py`, `Clients/FES/draft-franklin-email.py`):
- Python + Graph **app-only**, secret read from the keys vault **at runtime** - never hardcode a secret, even in `c:\tmp` (`feedback_no_hardcoded_secrets_in_repo`).
- **`createReply` on their message** so it threads (preserves In-Reply-To/References); `PATCH` the body with the composed HTML; attach the PDF in one shot (`fileAttachment`, base64, <3MB).
- **Fetch the draft back and render it to PNG** (body + signature) for a real 3-pass proofread (structure / encoding / content). Scan for mojibake.
- **Leave it in Drafts. Wait for Ravi's explicit send approval.** "Proceed" / "go ahead with the draft" is NOT send permission (`feedback_always_draft_before_send`, `feedback_proofread_before_not_after`).

Voice + format (`reference_ravi_email_style`, `feedback_always_use_signature`):
- Greeting = `FirstName,` on its own line (no Hi/Hello/Dear). For a shared inbox where the name is unknown, `<Company> team,` is a safe default - flag it for confirmation.
- Flowing conversational prose, contractions, short paragraphs, **no headers/bullets**, **no em-dashes** (use commas/hyphens - mojibake safety). ASCII-only in the `.py` source; HTML entities for accents (`Ren&eacute;e`).
- Sign-off `Thank you,` then the full Ravi Jain HTML signature (`assets/email/signatures/ravi-jain/ravi-jain.html`). No manual name line.
- **CTA by reply type:** warm -> signature booking button + "...and the AI strategies Technijian is putting into place for itself and its clients." **Decline-reframe** -> soft, low-pressure. **Opt-out/goodwill** -> NO CTA at all (no meeting, no "reply to discuss"); the signature's passive buttons are enough.

## Step 5 - Compliance & honesty (do not skip)
- **Honor opt-outs.** After "unsubscribe," suppress the address and send no marketing. A removal-confirmation + no-solicitation goodwill note is a low-risk courtesy; anything with a sales ask is not. Flag it as Ravi's call.
- **Don't claim an action you didn't take.** If the email says "we've removed you," make sure the address is actually suppressed from the list/CRM, or tell Ravi to.
- **No invented numbers** anywhere (pricing, enrollment, metrics) - real/published or "TBD/at discovery."
- Outward-facing send is hard to reverse - that's why every email waits in Drafts for an explicit human OK.

## Step 6 - Record it
- Vault project page `claude-memory/topics/project_<code>.md` + a one-line MEMORY.md pointer; a dated `Sessions/` note (+ Chat History for long sessions).
- Save email artifacts (`outreach-email-preview.png`, the draft `.py`) in the client folder.

---

## Worked examples (this lineage)
- **MPN (Multipoint Network), 2026-06-17** - cold lead replied/declined ("we are an IT firm"); reframed to a *growth engine* (not AI-101); conversion reply + full blueprint, drafted.
- **OETT (Operating Engineers Training Trust), 2026-06-19** - replied "We have an IT Manager." -> pivot to **AI for training & recruitment** (nonprofit framing, no ROI multiples), complementary to their IT Manager; threaded draft + 32pp blueprint.
- **Franklin Educational Services (FES), 2026-06-19** - replied **"unsubscribe."** -> honored the opt-out; built a 31pp blueprint as an **asset** (privacy-first, children's data); drafted a **removal-confirmation + no-strings goodwill** reply (no CTA), to Drafts.

## Related
- `technijian-biz-dev-blueprint` (the build) · `reference_ravi_email_style` · `feedback_always_draft_before_send` · `feedback_proofread_before_not_after` · `feedback_always_use_signature` · `feedback_reframe_off_declined_service` · `feedback_outreach_cta_signature_button` · `feedback_delivery_emails_no_sales_cta` · `feedback_facts_not_assumptions_pre_discovery` · `reference_email_sending` · `feedback_no_hardcoded_secrets_in_repo`
