# Technijian Email Signature Setup Guide

## Templates

Choose the correct template based on the employee's team:

| Template | Team | Team Booking Button |
|---|---|---|
| `email-signature.html` | Techs & Admin Staff (default) | Book time with Support |
| `email-signature-seo.html` | SEO Team | Book SEO Meeting |
| `email-signature-dev.html` | Developers | Book Dev Meeting |

Replace **all** `[PLACEHOLDER]` values with the employee's actual information before deploying.

## Placeholders to Replace

### Per-Employee Fields

| Placeholder | Description | Example |
|---|---|---|
| `[EMPLOYEE_NAME]` | Full name (appears twice: name row + photo alt text) | `Ravi Jain` |
| `[CREDENTIALS]` | Professional credentials after name. Remove the `<span>` entirely if none | `CISSP, PMP` |
| `[JOB_TITLE]` | Current title | `CEO` |
| `[OFFICE_PHONE]` | Office phone (appears twice: href + display text) | `949.379.8499 x201` |
| `[CELL_PHONE]` | Cell number (appears twice: href + display text). Delete the entire `C:` line if not applicable | `714.402.3164` |
| `[EMAIL]` | Email address (appears twice: href + display text) | `rjain@technijian.com` |
| `[PHOTO_URL]` | Hosted URL to employee headshot (120x120px square). Delete the photo `<td>` block if no photo | `https://technijian.com/team/ravi-jain.jpg` |
| `[BOOKING_URL]` | Personal calendar booking link. Delete the "Book a Meeting" `<a>` tag if not applicable | `https://outlook.office.com/bookwithme/...` |

### Company-Wide Assets (hardcoded in templates, no placeholders needed)

The logo and social media links are baked into the templates with real URLs:

- **Logo:** `https://technijian.com/wp-content/uploads/2026/03/technijian-logo-full-color-600x125-1.png`
- **Social links:** Text-based links (LinkedIn | Facebook | YouTube | Instagram | X | TikTok | Pinterest) — no icon images needed

## Optional Sections

These sections can be removed for employees who don't need them:

| Section | How to Remove |
|---|---|
| Employee photo | Delete the `<!-- Photo column -->` `<td>` block |
| Credentials | Remove the `<span>` tag after `[EMPLOYEE_NAME]` |
| Cell phone | Delete the `C:` line (the `<br>` and everything between) |
| Personal booking button | Delete the "Book a Meeting" `<a>` tag (keep the "Book time with Support" button) |

## Hosting Requirements

Employee photos must be hosted at publicly accessible URLs. Email clients download images from URLs — they cannot use local file paths.

| Image | Suggested Hosted Path |
|---|---|
| Employee photo (120x120 JPEG) | `https://technijian.com/wp-content/uploads/2026/03/[name].jpg` |

## Social Media Links

The signature includes 7 social platforms as text-based links (hardcoded in templates):

| Platform | URL in Template |
|---|---|
| LinkedIn | `https://www.linkedin.com/company/technijian` |
| Facebook | `https://www.facebook.com/Technijian01/` |
| YouTube | `https://www.youtube.com/@TechnijianIT` |
| Instagram | `https://www.instagram.com/technijianinc/` |
| X (Twitter) | `https://twitter.com/technijian_` |
| TikTok | `https://www.tiktok.com/@technijian` |
| Pinterest | `https://in.pinterest.com/technijian01/` |

## Setup by Email Client

### Microsoft Outlook (Desktop)

1. Open Outlook > File > Options > Mail > Signatures
2. Click "New" and name it "Technijian"
3. In the signature editor, switch to the source/HTML view
4. Paste the contents of `email-signature.html` (with all placeholders replaced)
5. Set as default for new messages and replies

### Microsoft Outlook (Web / Microsoft 365)

1. Go to Settings (gear icon) > View all Outlook settings > Mail > Compose and reply
2. Under "Email signature," paste the HTML signature
3. Toggle "Automatically include my signature on new messages" and "on replies"

### Gmail

1. Go to Settings (gear) > See all settings > General > Signature
2. Create a new signature named "Technijian"
3. Gmail doesn't support raw HTML paste; instead, open `email-signature.html` in a browser, select all (Ctrl+A), copy (Ctrl+C), and paste into the Gmail signature editor
4. Set as default

### Apple Mail

1. Open Mail > Settings > Signatures
2. Create a new signature
3. Open `email-signature.html` in Safari, select all, copy
4. Paste into the signature field in Mail settings
5. Uncheck "Always match my default message font"

## Design Elements

The signature follows the Technijian Brand Guide 2026:

- **Orange accent line** (3px, `#F67D4B`) at top
- **Employee photo** with 6px rounded corners and light grey border
- **Name** in Dark Charcoal (`#1A1A2E`), 18px bold
- **Credentials** in Core Blue (`#006DB6`), 11px uppercase
- **Title** in Core Blue, 13px semibold
- **Contact labels** (T/C/S/E/W) in Core Blue bold
- **"Book a Meeting" button** in Core Blue (`#006DB6`) with white text, 4px rounded corners (per-employee, optional)
- **"Book time with Support" button** in Brand Orange (`#F67D4B`) with white text, 4px rounded corners (company-wide)
- **Dual office addresses** (USA + India) in muted grey (`#ADB5BD`), 11px, with Core Blue labels
- **Blue divider line** (2px, `#006DB6`)
- **Company logo** (160px wide)
- **7 social media text links** in Core Blue, 11px semibold, pipe-separated
- **Confidentiality disclaimer** in 10px muted grey
