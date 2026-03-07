# Technijian Brand Asset Inventory & Requirements

**Purpose:** Audit of current brand assets and checklist of what has been created and what still needs work.

Last updated: March 2026

---

## Asset Summary

| Category | Status | Files Created |
|----------|--------|---------------|
| Logo SVG Variants | Done | 8 SVGs (7 hand-crafted + AI source extracted) |
| Logo PNG Exports | Done | 18 PNGs at multiple sizes |
| Favicon & App Icons | Done | .ico, Apple Touch, Android, MS Tile, OG image, manifest (11 files) |
| Social Media Assets | Done | 4 profiles + 4 covers + 5 post templates + OG image |
| Service Pillar Icons | Done | 6 SVGs + 36 PNGs (3 sizes + 3 color variants each) |
| Brand Patterns | Done | 2 SVG patterns + CSS gradients |
| Email Templates | Done | Newsletter + announcement + event invitation + signature + setup guide |
| Presentation Template | Done | 7-slide PPTX with brand styling |
| Proposal Template | Done | Multi-page DOCX with TOC, tables, branding |
| One-Pager Template | Done | Single-page DOCX service overview |
| Case Study Template | Done | 2-page DOCX client success story |
| Business Card | Done | Front + back SVG templates |
| Letterhead | Done | SVG template |
| Claude Code Skills | Done | 5 skills for brand-compliant content generation |

---

## Original Assets (Legacy)

These files remain in the root `assets/` folder for reference. New work should use the organized folder structure.

| # | File | Type | Dimensions | Notes |
|---|------|------|------------|-------|
| 1 | `Technijian Logo - Copy.jpg` | JPG | 5005 x 1048 | Full-color logo on white background |
| 2 | `Technijian Logo 2.png` | PNG | 10011 x 2095 | Full-color logo with transparency (master raster) |
| 3 | `Technijian Logo - white text.png` | PNG | 5008 x 1048 | Reverse/white logo with transparency |
| 4 | `Technijian Logo - 200x50.jpg` | JPG | 200 x 50 | Small web logo |
| 5 | `Technijian Logo 2_153x32 - Copy.png` | PNG | 153 x 32 | Very small web logo |
| 6 | `Technijian Logo - white text.ai` | AI | Vector | Adobe Illustrator source (PDF-based, extractable) |

---

## Created Assets by Folder

### logos/svg/

| File | Description |
|------|-------------|
| `technijian-logo-full-color.svg` | Full logo with icon + wordmark + tagline, standard brand colors |
| `technijian-logo-reverse-white.svg` | Full logo, all-white for dark backgrounds |
| `technijian-logo-mono-black.svg` | Full logo, all-black for monochrome print |
| `technijian-wordmark-only.svg` | Wordmark + tagline only (no icon) |
| `technijian-icon-full-color.svg` | Dot grid icon only, brand colors |
| `technijian-icon-white.svg` | Dot grid icon only, all-white |
| `technijian-icon-black.svg` | Dot grid icon only, all-black |
| `technijian-logo-from-ai-source.svg` | Extracted from .ai file via PyMuPDF (authoritative vector) |

### logos/png/

| File | Source |
|------|--------|
| `technijian-logo-full-color-2400x502.png` | From raster master |
| `technijian-logo-full-color-1200x251.png` | From raster master |
| `technijian-logo-full-color-600x125.png` | From raster master |
| `technijian-logo-reverse-white-10000x3334.png` | From AI source |
| `technijian-logo-reverse-white-5000x1667.png` | From AI source |
| `technijian-logo-reverse-white-2500x834.png` | From AI source |
| `technijian-logo-reverse-white-834x278.png` | From AI source |
| `technijian-logo-from-ai-300dpi.png` | Direct 300dpi export from AI |
| `technijian-icon-from-ai-1334x1667.png` | Icon crop from AI source |
| `technijian-icon-from-ai-667x834.png` | Icon crop from AI source |
| `technijian-icon-full-color-512x512.png` | Cropped from raster master |
| `technijian-icon-full-color-256x256.png` | Cropped from raster master |
| `technijian-icon-full-color-192x192.png` | For Android Chrome |
| `technijian-icon-full-color-180x180.png` | For Apple Touch |
| `technijian-icon-full-color-150x150.png` | For MS Tile |
| `technijian-icon-full-color-48x48.png` | For favicon .ico |
| `technijian-icon-full-color-32x32.png` | For favicon |
| `technijian-icon-full-color-16x16.png` | For favicon |

### logos/print/

| File | Description |
|------|-------------|
| `technijian-logo-reverse-white.ai` | Adobe Illustrator source file (copied from legacy) |

### favicons/

| File | Description |
|------|-------------|
| `favicon.ico` | Multi-size ICO (16, 32, 48) |
| `favicon-32x32.png` | Browser tab icon |
| `favicon-16x16.png` | Smallest browser icon |
| `apple-touch-icon-180x180.png` | iOS home screen |
| `android-chrome-192x192.png` | Android home screen |
| `android-chrome-512x512.png` | Android splash |
| `mstile-150x150.png` | Windows tile |
| `og-image-1200x630.png` | Default social share image |
| `site.webmanifest` | Web app manifest |
| `browserconfig.xml` | Windows tile config |
| `favicon-snippet.html` | Copy-paste HTML for website head |

### social/profiles/

| File | Platform |
|------|----------|
| `technijian-profile-linkedin-300x300.png` | LinkedIn |
| `technijian-profile-x-400x400.png` | X (Twitter) |
| `technijian-profile-facebook-170x170.png` | Facebook |
| `technijian-profile-youtube-800x800.png` | YouTube |

### social/covers/

| File | Platform |
|------|----------|
| `technijian-cover-linkedin-1128x191.png` | LinkedIn |
| `technijian-cover-x-1500x500.png` | X (Twitter) |
| `technijian-cover-facebook-820x312.png` | Facebook |
| `technijian-cover-youtube-2560x1440.png` | YouTube |

### social/templates/

| File | Layout |
|------|--------|
| `social-post-announcement.svg` | Dark background, blue accent, headline + CTA button |
| `social-post-tip.svg` | Light background, teal accent bar, tip number + title + body |
| `social-post-quote.svg` | Off-white background, large quote mark, attribution |
| `social-post-stat.svg` | Blue background, large stat number, supporting text |
| `social-post-team.svg` | Split layout, photo placeholder + name/title/bio |

### icons/service-pillars/

**SVG Masters (6 files):**

| File | Pillar | Default Color |
|------|--------|---------------|
| `icon-managed-it.svg` | Managed IT Services | Core Blue |
| `icon-cybersecurity.svg` | Cybersecurity | Core Orange |
| `icon-cloud.svg` | Cloud Solutions | Teal |
| `icon-compliance.svg` | Compliance & Business Continuity | Core Blue |
| `icon-software-ai.svg` | Software Development & AI | Teal |
| `icon-consulting.svg` | Strategic IT Consulting | Core Orange |

**PNG Exports (36 files):**

Each icon is exported at 3 sizes (48x48, 96x96, 192x192) in default color, plus 3 color variants (blue, teal, white) at 96x96.

| Pattern | Example |
|---------|---------|
| `icon-{name}-48x48.png` | `icon-managed-it-48x48.png` |
| `icon-{name}-96x96.png` | `icon-managed-it-96x96.png` |
| `icon-{name}-192x192.png` | `icon-managed-it-192x192.png` |
| `icon-{name}-blue-96x96.png` | `icon-managed-it-blue-96x96.png` |
| `icon-{name}-teal-96x96.png` | `icon-managed-it-teal-96x96.png` |
| `icon-{name}-white-96x96.png` | `icon-managed-it-white-96x96.png` |

### patterns/

| File | Description |
|------|-------------|
| `pattern-dot-grid-tile.svg` | Light repeating tile for light backgrounds |
| `pattern-dot-grid-dark.svg` | Dark variant for dark backgrounds |
| `gradient-brand.css` | CSS gradient definitions (7 brand gradients) |

### email/templates/

| File | Description |
|------|-------------|
| `email-newsletter.html` | Full responsive newsletter with hero, content blocks, tips, CTA, footer |
| `email-announcement.html` | Single-message announcement with blue hero, body text, CTA |
| `email-event.html` | Event invitation with teal label, date/time/location details, RSVP button |

### email/signatures/

| File | Description |
|------|-------------|
| `email-signature.html` | Standard employee email signature template |
| `email-signature-guide.md` | Setup instructions for Outlook, Gmail, Apple Mail |

### presentations/

| File | Description |
|------|-------------|
| `technijian-template.pptx` | 7-slide brand template (title, divider, content, 2-col, image+text, quote, CTA) |

### print/templates/

| File | Description |
|------|-------------|
| `technijian-proposal-template.docx` | Multi-page proposal (cover, TOC, exec summary, scope, SLA, pricing, about, next steps) |
| `technijian-one-pager-template.docx` | Single-page service overview with challenge, solution, benefits, CTA |
| `technijian-case-study-template.docx` | 2-page case study with metrics table, testimonial quote, CTA |
| `technijian-business-card-front.svg` | Business card front with trim marks (3.5x2" + bleed) |
| `technijian-business-card-back.svg` | Business card back (dark charcoal with dot grid icon) |
| `technijian-letterhead.svg` | 8.5x11" letterhead with header, footer, orange accent |
| `technijian-letterhead-template.docx` | DOCX letter template with branded header, footer, placeholder body |
| `technijian-qbr-template.docx` | Quarterly Business Review with performance tables, ticket analysis, security overview |
| `technijian-msa-template.docx` | Master Services Agreement with 14 sections and dual signature block |
| `technijian-sow-template.docx` | Statement of Work with scope, timeline, deliverables, pricing table |
| `technijian-nda-template.docx` | Non-Disclosure Agreement with definitions, obligations, remedies |
| `technijian-sla-template.docx` | Service Level Agreement with severity response times, service credits |
| `technijian-aup-template.docx` | Acceptable Use Policy with security requirements, monitoring, enforcement |
| `technijian-it-assessment-template.docx` | IT Assessment Report with severity findings, risk matrix, recommendations |
| `technijian-security-audit-template.docx` | Security Audit Report with compliance status, risk register, remediation roadmap |
| `technijian-compliance-report-template.docx` | Compliance Report with control assessment, gap analysis, remediation plan |

---

## Build Scripts

Build scripts for regenerating template files are in `scripts/`. Each requires `npm install` of its dependency before running.

| Script | Output | Dependency |
|--------|--------|------------|
| `scripts/build-presentation.js` | `assets/presentations/technijian-template.pptx` | pptxgenjs |
| `scripts/build-proposal.js` | `assets/print/templates/technijian-proposal-template.docx` | docx |
| `scripts/build-one-pager.js` | `assets/print/templates/technijian-one-pager-template.docx` | docx |
| `scripts/build-case-study.js` | `assets/print/templates/technijian-case-study-template.docx` | docx |
| `scripts/build-report.js` | `assets/print/templates/technijian-qbr-template.docx` | docx |
| `scripts/build-letterhead.js` | `assets/print/templates/technijian-letterhead-template.docx` | docx |
| `scripts/build-msa.js` | `assets/print/templates/technijian-msa-template.docx` | docx |
| `scripts/build-sow.js` | `assets/print/templates/technijian-sow-template.docx` | docx |
| `scripts/build-nda.js` | `assets/print/templates/technijian-nda-template.docx` | docx |
| `scripts/build-sla.js` | `assets/print/templates/technijian-sla-template.docx` | docx |
| `scripts/build-aup.js` | `assets/print/templates/technijian-aup-template.docx` | docx |
| `scripts/build-it-assessment.js` | `assets/print/templates/technijian-it-assessment-template.docx` | docx |
| `scripts/build-security-audit.js` | `assets/print/templates/technijian-security-audit-template.docx` | docx |
| `scripts/build-compliance-report.js` | `assets/print/templates/technijian-compliance-report-template.docx` | docx |
| `scripts/brand-helpers.js` | (shared module used by SOW, NDA, SLA, AUP, assessment, audit, compliance scripts) | docx |

---

## Claude Code Skills

Skills for generating brand-compliant content are in `skills/`. See `skills/README.md` for installation instructions.

| Skill | Purpose |
|-------|---------|
| `technijian-brand` | Master brand reference (colors, typography, voice, UI specs) |
| `technijian-proposal` | Generate DOCX proposals, one-pagers, case studies |
| `technijian-presentation` | Generate branded PowerPoint decks |
| `technijian-social` | Generate social media graphics and captions |
| `technijian-email` | Generate HTML email campaigns, newsletters, signatures |
| `technijian-report` | Generate branded reports (QBRs, IT assessments, security audits) |
| `technijian-letterhead` | Generate formal letters and correspondence on company letterhead |
| `technijian-legal` | Generate legal agreements (MSA, SOW, NDA, SLA, AUP) |

---

## Still Needed (Future Work)

### High Priority

- [ ] **Refine SVG logos** — The hand-crafted SVGs approximate the logo but should be verified against the .ai source for exact geometry (the interlocking rounded corners between grid cells are simplified)
- [ ] **Google Slides template** — Port the PPTX to Google Slides format

### Medium Priority

- [ ] **Envelope template** — #10 envelope layout
- [ ] **Brand pattern PNG** — Rasterize the SVG pattern at 600x600 for use in tools that don't support SVG

### Low Priority

- [ ] **Device mockups** — Use a Figma plugin or service (Smartmockups, Placeit) rather than custom PSD files
- [ ] **Dark tech photography** — 5-10 pre-treated background images
- [ ] **Team photography** — Professional headshots and office photos
- [ ] **Dark overlay texture** — Pre-built 2400x1600 dark tech overlay PNG

---

## File Naming Convention

```text
technijian-[type]-[variant]-[size].[ext]
```

| Token | Values |
|-------|--------|
| type | `logo`, `icon`, `wordmark`, `favicon`, `profile`, `cover`, `pattern`, `template` |
| variant | `full-color`, `reverse-white`, `mono-black`, `mono-white` |
| size | Pixel dimensions (`1200x630`) or standard name (`a4`, `letter`) |

---

## Folder Structure

```text
assets/
  logos/
    svg/                    # SVG logo variants (8 files)
    png/                    # PNG exports at multiple sizes (18 files)
    print/                  # AI source file
  favicons/                 # Favicon set + manifest + browserconfig (11 files)
  icons/
    service-pillars/        # 6 pillar icon SVGs + 36 PNG exports
    ui/                     # (empty - for future UI icons)
  social/
    profiles/               # Platform profile images (4 files)
    covers/                 # Platform cover/banner images (4 files)
    templates/              # Social post SVG templates (5 files)
  email/
    templates/              # Newsletter, announcement, event HTML templates (3 files)
    signatures/             # Signature HTML + setup guide (2 files)
  presentations/            # PPTX template
  print/
    templates/              # 13 DOCX templates + business card SVGs + letterhead SVG
    collateral/             # (empty - for exported PDFs)
  photography/
    dark-tech/              # (empty - needs stock/custom photos)
    people/                 # (empty - needs team photos)
  patterns/                 # SVG patterns + CSS gradients (3 files)
  mockups/                  # (empty - use Figma plugin or service)
docs/
  Technijian_Brand_Guide_2026.md    # Master brand guide
  Technijian_Brand_Guide_2026.docx  # Word version
  Technijian_Brand_Guide_2026.pptx  # Presentation version
  Asset_Inventory_and_Requirements.md  # This file
scripts/
  brand-helpers.js          # Shared visual helper module (colors, borders, layout functions)
  build-presentation.js     # Regenerate PPTX template
  build-proposal.js         # Regenerate proposal DOCX
  build-one-pager.js        # Regenerate one-pager DOCX
  build-case-study.js       # Regenerate case study DOCX
  build-report.js           # Regenerate QBR DOCX
  build-letterhead.js       # Regenerate letterhead DOCX
  build-msa.js              # Regenerate MSA DOCX
  build-sow.js              # Regenerate SOW DOCX
  build-nda.js              # Regenerate NDA DOCX
  build-sla.js              # Regenerate SLA DOCX
  build-aup.js              # Regenerate AUP DOCX
  build-it-assessment.js    # Regenerate IT Assessment DOCX
  build-security-audit.js   # Regenerate Security Audit DOCX
  build-compliance-report.js # Regenerate Compliance Report DOCX
skills/
  README.md                 # Installation instructions
  technijian-brand/         # Master brand skill
  technijian-email/         # Email generator skill
  technijian-presentation/  # Presentation generator skill
  technijian-proposal/      # Proposal generator skill
  technijian-social/        # Social media content skill
  technijian-report/        # Report generator skill (QBR, IT assessment, security audit, compliance)
  technijian-letterhead/    # Letterhead and correspondence skill
  technijian-legal/         # Legal agreement skill (MSA, SOW, NDA, SLA, AUP)
```

---

## Technical Notes

### Reading the .ai File

The Adobe Illustrator file (`Technijian Logo - white text.ai`) is PDF-based and can be read with PyMuPDF:

```python
import fitz
doc = fitz.open("Technijian Logo - white text.ai")
page = doc[0]

# Extract as SVG
svg = page.get_svg_image()

# Export as high-res PNG
pix = page.get_pixmap(dpi=300)
pix.save("output.png")
```

Install: `pip install pymupdf`
