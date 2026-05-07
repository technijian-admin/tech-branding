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

**Hard rule:** if `technijian-design-review` has not been run, the artifact is not done.

## Pipeline

```
1. Identify artifact type (HTML+PDF, DOCX, PPTX, image)
2. Run automated checks (Playwright for HTML+PDF, python-docx for DOCX, python-pptx for PPTX)
3. Take per-page verification screenshots
4. Visually review screenshots (Read tool on each PNG)
5. Compile findings list grouped by severity
6. Iterate fixes one at a time; re-run checks
7. Sign off only when ALL hard gates pass
```

## Hard Gates (block sign-off)

Severity = Critical. The artifact CANNOT ship if any of these fail.

| # | Check | How to verify | Source |
|---|---|---|---|
| H1 | **Body-content clipping** — content inside `.body { flex:1; overflow:hidden }` must not exceed `clientHeight` | `body.scrollHeight - body.clientHeight <= 2px` per page | `feedback_verify_body_clipping.md` |
| H2 | **One-pager total height** — full-page screenshot must equal exactly 1056px | `img.size[1] <= 1056` | `feedback_verify_onepagers.md` |
| H3 | **Brochure page-break overflow** — no content crosses the bottom edge of any `.page` | Crop screenshot to page boundary; check bottom 40px for cut text | `feedback_page_breaks.md` |
| H4 | **Underflow** — no `.page` with > 15% blank space at bottom (looks unprofessional, page must justify itself) | Eyeball bottom 200px; should have content or anchored dark strip | `feedback_page_breaks.md` |
| H5 | **Logo correctness** — dark backgrounds use `technijian-logo-dark-bg-transparent.png`, light use `technijian-logo-full-color-*.png`. NEVER `Technijian Logo - white text.png` | Grep for forbidden filenames; visually confirm logo is colorful on dark | `feedback_logo_usage.md` |
| H6 | **Phone-line discipline** — sales artifacts use 949.379.8500; billing artifacts use 949.379.8501 | Grep for both numbers; cross-check against artifact purpose | `reference_technijian_phone_lines.md` |
| H7 | **No fake client names** — no "Anderson Real Estate", "Aventine", "Brandywine", "Mason West", "Talsco", "CHL", "Canusa Hershman" used as completed-project case studies | Grep for those exact strings | `feedback_no_client_names.md` |
| H8 | **Office mismatch** — US-entity letters do not show India address as primary; India-entity invoices do not show CA address as primary | Read header office identifier; cross-check sender entity | letterhead skill |

## Soft Gates (warn, don't block)

Severity = High. Strongly preferred to fix before sign-off.

| # | Check |
|---|---|
| S1 | Color accuracy — hex values match `assets/brand-tokens.json` exactly |
| S2 | Typography — Open Sans for corporate, Plus Jakarta + DM Sans for marketing collateral |
| S3 | WCAG contrast — Core Orange `#F67D4B` on white only used at ≥18px bold or for icons/buttons |
| S4 | Voice — no banned words from `brand-tokens.json` `voice.avoid_words` (cost, vendor, guarantee compliance, leverage, unlock, seamless, etc.) |
| S5 | Differentiator coverage — pod model + 24/7 + cybersecurity-first mentioned in marketing artifacts |
| S6 | Tagline — "technology as a solution" appears at least once in covers/closings |
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
    assert any(p in footer_text for p in ['949.379.8500', '949.379.8501']), "S7 FAIL: missing phone in footer"
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
