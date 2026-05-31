---
name: technijian-design-review
description: Audit any Technijian-branded artifact (PDF, DOCX, PPTX, HTML) for brand compliance, body-content overflow/clipping, page-break problems, accessibility violations, and voice-rule violations. Use BEFORE declaring any marketing or sales artifact done. This is the gate that turns "looks fine" into "ready to send to clients."
---

# Technijian Design Review (QA Gate)

## When to use this skill

Run this skill on **every** Technijian artifact before declaring it complete:
- Brochures (`Services/*/[Service] Brochure.pdf`)
- One-pagers (`Services/*/[Service] One-Pager.pdf`)
- Datasheets (`Services/*/[Service] Marketing Datasheet.pdf`)
- Case studies (`Case Studies/**/*.pdf`)
- Letterhead/letters
- Reports (QBR, IT assessment, security audit, compliance)
- Proposals, SOWs, MSAs
- Email campaigns
- Social posts

**Hard rule:** if `technijian-design-review` has not been run, the artifact is not done. "Verified" means every page/slide was rendered to an image and visually proofread at display size — never declare an artifact done unverified, and never sign off from the markup/code alone.

## Pipeline

```
1. Identify artifact type (HTML+PDF, DOCX, PPTX, image)
2. Run automated checks (Playwright for HTML+PDF, python-docx for DOCX, python-pptx for PPTX),
   including the body-region fill metric (H4) on EVERY page/slide
3. Render EVERY page/slide to an image — not a sample. A multi-page/multi-slide artifact
   is only verified when all of its pages have been rendered and reviewed.
4. Visually review every screenshot at its intended display size (Read tool on each PNG) —
   proofread the actual pixels, never declare done from code/markup alone or "looks fine"
5. Compile findings list grouped by severity
6. Iterate fixes one at a time; re-run checks
7. Sign off only when ALL hard gates pass AND every page has been rendered + visually proofread
```

## Hard Gates (block sign-off)

Severity = Critical. The artifact CANNOT ship if any of these fail.

| # | Check | How to verify | Source |
|---|---|---|---|
| H1 | **Body-content clipping** — content inside `.body { flex:1; overflow:hidden }` must not exceed `clientHeight` | `body.scrollHeight - body.clientHeight <= 2px` per page | `feedback_verify_body_clipping.md` |
| H2 | **One-pager total height** — full-page screenshot must equal exactly 1056px | `img.size[1] <= 1056` | `feedback_verify_onepagers.md` |
| H3 | **Brochure page-break overflow** — no content crosses the bottom edge of any `.page` | Crop screenshot to page boundary; check bottom 40px for cut text | `feedback_page_breaks.md` |
| H4 | **Underflow / short page** — no `.page` with > 15% blank space at bottom (looks unprofessional, page must justify itself). Measure a **body-region fill metric** (exclude the header band + footer band, then compute filled vs. blank pixels in the remaining content region) so a page padded by header/footer chrome can't pass while its content is sparse. Also catches stranded captions and orphaned headings at a page foot | Eyeball bottom 200px; compute body-region fill % (header/footer excluded); should have content or an anchored dark strip | `feedback_page_breaks.md` |
| H5 | **Logo correctness** — dark backgrounds use `technijian-logo-dark-bg-transparent.png`, light use `technijian-logo-full-color-*.png`. NEVER `Technijian Logo - white text.png` | Grep for forbidden filenames; visually confirm logo is colorful on dark | `feedback_logo_usage.md` |
| H6 | **Phone-line discipline** — the general contact/CTA number is the MAIN switchboard **949.379.8499** (reaches USA + India). 949.379.8500 is **Sales-direct only**; 949.379.8501 is **Billing-direct only**. Letterhead, business cards, footers, and "contact us" CTAs MUST use 8499 unless the artifact is purpose-specific (a sales-only or billing-only piece) | Grep for all three numbers; any generic contact/CTA showing 8500 or 8501 instead of 8499 FAILS | `reference_phone_main_line.md`, `reference_technijian_phone_lines.md` |
| H9 | **No fabricated proof** — no invented outcome metrics, ROI/savings figures, percentages, client quotes, testimonials, awards, or completed-project case-study results. The service is **launching** — there are no finished client projects, so any "we delivered X% / saved $Y for client Z" claim is fabrication. Real anonymized industry profiles are OK (scope + effort only, no outcome numbers); forward-looking capabilities must read as a dated NEAR-TERM BUILD, never as delivered; estimates must be flagged "confirmed at discovery" | Read every stat/metric/quote; confirm each traces to a real source or is labeled an estimate. Grep for "%", "$", "increased", "reduced", "saved", "testimonial" and verify provenance | `feedback_no_client_names.md` |
| H7 | **No fake client names** — no "Anderson Real Estate", "Aventine", "Brandywine", "Mason West", "Talsco", "CHL", "Canusa Hershman" used as completed-project case studies | Grep for those exact strings | `feedback_no_client_names.md` |
| H8 | **Office mismatch** — US-entity letters do not show India address as primary; India-entity invoices do not show CA address as primary | Read header office identifier; cross-check sender entity | letterhead skill |

## Soft Gates (warn, don't block)

Severity = High. Strongly preferred to fix before sign-off.

| # | Check |
|---|---|
| S1 | Color accuracy — hex values match `assets/brand-tokens.json` exactly. `brand-tokens.json` is the SINGLE SOURCE OF TRUTH for all brand values; any hardcoded color/phone/tagline elsewhere is a cached convenience that must be re-synced from it, not trusted over it |
| S2 | Typography — Open Sans for corporate, Plus Jakarta + DM Sans for marketing collateral |
| S3 | WCAG contrast — Core Orange `#F67D4B` on white only used at ≥18px bold or for icons/buttons |
| S4 | Voice — no banned words from `brand-tokens.json` `voice.avoid_words` (cost, vendor, guarantee compliance, leverage, unlock, seamless, etc.) |
| S5 | Differentiator coverage — pod model + 24/7 + cybersecurity-first mentioned in marketing artifacts |
| S6 | Tagline — "technology as a solution" (lowercase, no period) appears at least once in covers/closings, AND the RETIRED tagline "Technology Support, Your Way." never appears (grep for it; if present, FAIL and replace) |
| S7 | Footer completeness — address, phone, website all present on every page |
| S8 | No pure black `#000000` backgrounds — use Dark Charcoal `#1A1A2E` |

## Cosmetic Gates (lowest priority)

Severity = Medium. Address if time permits.

| # | Check |
|---|---|
| C1 | Spacing follows the 8px scale (4 / 8 / 16 / 24 / 32 / 48 / 64) |
| C2 | Card border-radius is 6-8px (not arbitrary values) |
| C3 | Card shadows use the standard `0 2px 8px rgba(0,0,0,0.08)` |
| C4 | Section accent bars use brand colors (blue/orange/teal) — no off-brand hues |
| C5 | Hyphens vs em-dashes used correctly (em-dash for parenthetical breaks) |

## Verification recipes (copy-paste)

### HTML + PDF artifacts (brochures, one-pagers, datasheets, case studies, letterhead)

```python
from playwright.sync_api import sync_playwright
import os

def review(html_path, expected_pages=1):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 816, "height": 1056})
        page.goto("file:///" + html_path.replace(os.sep, "/"))
        page.wait_for_load_state("networkidle")

        # H1: per-page body-content clipping
        clips = page.evaluate("""
            () => Array.from(document.querySelectorAll('.page')).map((pg, i) => {
                const b = pg.querySelector('.body') || pg;
                return { page: i+1, client: b.clientHeight, scroll: b.scrollHeight, overflow: b.scrollHeight - b.clientHeight };
            })
        """)
        for c in clips:
            assert c['overflow'] <= 2, f"H1 FAIL page {c['page']}: {c['overflow']}px clipped"

        # H2: one-pager total height
        if expected_pages == 1:
            shot = page.screenshot(full_page=True)
            from PIL import Image; import io
            img = Image.open(io.BytesIO(shot))
            assert img.size[1] <= 1060, f"H2 FAIL: total height {img.size[1]}px > 1056"

        # Page-by-page screenshots for visual review
        page.screenshot(path=html_path.replace('.html', '_review.png'), full_page=True)
        browser.close()
```

### DOCX artifacts (proposals, reports, letters, contracts)

```python
from docx import Document
def review(docx_path):
    doc = Document(docx_path)
    # H5: logo presence in header
    assert any(r.element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
               for s in doc.sections for r in s.header.paragraphs[0].runs), "H5 FAIL: no logo in header"
    # S7: footer has phone + website
    footer_text = '\n'.join(p.text for s in doc.sections for p in s.footer.paragraphs)
    assert 'technijian.com' in footer_text, "S7 FAIL: missing website in footer"
    # Main switchboard 949.379.8499 is the default contact/CTA number; 8500=Sales-direct, 8501=Billing-direct
    assert any(p in footer_text for p in ['949.379.8499', '949.379.8500', '949.379.8501']), "S7 FAIL: missing phone in footer"
```

### PPTX artifacts (presentations)

```python
from pptx import Presentation
def review(pptx_path):
    prs = Presentation(pptx_path)
    # First slide must be dark
    first = prs.slides[0]
    # Last slide must be CTA
    last = prs.slides[-1]
    # Every content slide must have a header bar (no plain bullets on white)
    # ... (extend based on technijian-presentation skill)
```

## Findings report template

After each review, output a markdown findings block in this exact format:

```markdown
## Design Review: [Artifact Name]
**Verdict:** [PASS | PASS-WITH-WARNINGS | FAIL]
**Reviewed:** YYYY-MM-DD
**Reviewer:** technijian-design-review skill

### Hard gates
- [x] H1 — body clipping (max 0px)
- [x] H2 — one-pager height (1056px)
- [ ] H3 — brochure page break (page 4 cuts off "...continued")  ← BLOCKS SHIP
- [x] H6 — phone discipline (generic contact uses 949.379.8499 switchboard)
- [x] H9 — no fabricated metrics/quotes/case-study outcomes (service is launching)

### Soft gates
- [x] S1 — colors
- [ ] S4 — voice ("game-changing" used in para 2; replace with "practical")

### Cosmetic
- [ ] C5 — em-dash inconsistency (hyphens used in 3 places)

### Recommended fixes
1. [BLOCKER] page 4 — reduce capability list from 6 to 5 items, or split across pages 4-5
2. [WARN] swap "game-changing" → "practical" in para 2
```

## Iteration discipline

- **One fix at a time.** Don't bundle 5 changes into one edit; re-run gates after each.
- **Atomic edits.** Each change should be a single Edit call with a clear before/after.
- **Re-screenshot after every fix.** Compare before/after PNGs side-by-side.
- **Stop when all hard gates pass.** Don't chase cosmetic nits if hard gates fail.

## Related skills

- **technijian-brand** — source of truth for brand rules
- **technijian-voice** — runs voice/tone gates (S4) over text-heavy artifacts
- **technijian-brochure** / **technijian-datasheet** / **technijian-letterhead** — artifacts this skill audits
