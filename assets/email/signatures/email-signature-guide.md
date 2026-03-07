# Technijian Email Signature Setup Guide

## Template

Use `email-signature.html` as the base. Replace **all** `[PLACEHOLDER]` values with the employee's actual information before deploying.

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
| `[BOOKING_URL]` | Calendar booking link. Delete the entire booking `<tr>` block if not applicable | `https://calendly.com/ravi-technijian` |

### Company-Wide Fields (set once, same for all employees)

| Placeholder | Description |
|---|---|
| `[LOGO_URL]` | Hosted full-color logo (use 600x125 PNG) |
| `[ICON_LINKEDIN_URL]` | Hosted 24x24 LinkedIn icon |
| `[ICON_FACEBOOK_URL]` | Hosted 24x24 Facebook icon |
| `[ICON_YOUTUBE_URL]` | Hosted 24x24 YouTube icon |
| `[ICON_INSTAGRAM_URL]` | Hosted 24x24 Instagram icon |
| `[ICON_X_URL]` | Hosted 24x24 X (Twitter) icon |
| `[ICON_TIKTOK_URL]` | Hosted 24x24 TikTok icon |
| `[ICON_SPOTIFY_URL]` | Hosted 24x24 Spotify icon |
| `[ICON_APPLE_PODCASTS_URL]` | Hosted 24x24 Apple Podcasts icon |
| `[SPOTIFY_URL]` | Technijian Spotify profile/show URL |
| `[APPLE_PODCASTS_URL]` | Technijian Apple Podcasts URL |

## Optional Sections

These sections can be removed for employees who don't need them:

| Section | How to Remove |
|---|---|
| Employee photo | Delete the `<!-- Photo column -->` `<td>` block |
| Credentials | Remove the `<span>` tag after `[EMPLOYEE_NAME]` |
| Cell phone | Delete the `C:` line (the `<br>` and everything between) |
| Booking button | Delete the `<!-- Booking link -->` `<tr>` block |

## Hosting Requirements

All images must be hosted at publicly accessible URLs. Email clients download images from URLs -- they cannot use local file paths.

| Image | Source File | Suggested Hosted Path |
|---|---|---|
| Employee photo | 120x120px square JPEG | `https://technijian.com/team/[name].jpg` |
| Company logo | `logos/png/technijian-logo-full-color-600x125.png` | `https://technijian.com/assets/logo-email.png` |
| Social icons | 24x24px PNGs (8 icons) | `https://technijian.com/assets/icons/[platform].png` |

## Social Media Links

The signature includes 8 social platforms. The profile URLs are hardcoded in the template:

| Platform | URL in Template |
|---|---|
| LinkedIn | `https://www.linkedin.com/company/technijian` |
| Facebook | `https://www.facebook.com/technijian` |
| YouTube | `https://www.youtube.com/@technijian` |
| Instagram | `https://www.instagram.com/technijian` |
| X (Twitter) | `https://x.com/technijian` |
| TikTok | `https://www.tiktok.com/@technijian` |
| Spotify | `[SPOTIFY_URL]` -- replace with actual URL |
| Apple Podcasts | `[APPLE_PODCASTS_URL]` -- replace with actual URL |

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
- **"Book a Meeting" button** in Core Blue with white text, 4px rounded corners
- **Address** in muted grey (`#ADB5BD`), 11px
- **Blue divider line** (2px, `#006DB6`)
- **Company logo** (160px wide)
- **8 social media icons** (24x24px each)
- **Confidentiality disclaimer** in 10px muted grey
