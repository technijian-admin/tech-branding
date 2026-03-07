---
name: technijian-email
description: Generate brand-compliant Technijian email campaigns, newsletters, and signatures. Use when creating HTML email templates, newsletter content, email marketing campaigns, or employee email signatures for Technijian.
---

# Technijian Email Generator

## Overview

Generates Technijian-branded HTML email templates, newsletter content, and email signatures. All output is responsive, inline-styled for email client compatibility, and follows the Technijian Brand Guide 2026.

**Keywords**: email, newsletter, email template, email signature, email campaign, marketing email, technijian, html email

## Brand Colors (for inline CSS)

```
Core Orange: #F67D4B    Core Blue: #006DB6     Teal: #1EAAC8
Dark Charcoal: #1A1A2E  Brand Grey: #59595B    Off White: #F8F9FA
Light Grey: #E9ECEF     White: #FFFFFF
```

## Email Template Types

### 1. Monthly Newsletter

**Structure:**
1. **Header**: Full logo (left, 200px), white background, 3px Core Blue bottom border
2. **Hero section**: Dark Charcoal background, white headline (28px Bold), grey subtitle
3. **Article blocks** (2-3): Blue H2 heading, grey body text, Orange CTA button
4. **Dividers**: 1px `#E9ECEF` between blocks
5. **Quick Tips section**: Teal bold labels + grey descriptions
6. **CTA banner**: Core Blue background, white text, orange button
7. **Footer**: Off White background, contact info, social links, unsubscribe

### 2. Announcement Email

**Structure:**
1. **Header**: Same as newsletter
2. **Hero**: Core Blue background, white centered headline (32px Bold), subtitle
3. **Body**: 1-2 paragraphs of grey body text + centered orange CTA button
4. **Footer**: Same as newsletter

### 3. Event Invitation

**Structure:**
1. **Header**: Same as newsletter
2. **Hero**: Dark Charcoal background, Teal "YOU'RE INVITED" label, white title
3. **Event details**: Structured rows with Core Blue labels (DATE, TIME, LOCATION)
4. **Description**: Grey body text + centered orange "RSVP Now" button
5. **Footer**: Same as newsletter

### 4. Employee Email Signature

**Layout**: Two-column with blue vertical divider
- **Left**: Full-color logo (140px)
- **Right**: Name (16px, bold, Dark Charcoal), Title (13px, Core Blue), Contact (12px), Address (11px, grey)

## HTML Email Rules

### Technical Requirements
- **Max width**: 600px for the email container
- **All CSS must be inline** - no `<style>` blocks (stripped by many email clients)
- **Use tables for layout** - `role="presentation"` on all layout tables
- **Font stack**: `'Open Sans', 'Segoe UI', Helvetica, Arial, sans-serif`
- **Images**: Always include `alt` text and `width` attribute
- **CTA buttons**: Use table-based buttons (not `<a>` with background), for Outlook compatibility:
  ```html
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background-color:#F67D4B;border-radius:6px;">
        <a href="#" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">Button Text</a>
      </td>
    </tr>
  </table>
  ```

### Styling Specs

| Element | Style |
|---------|-------|
| H1 | 28-32px, Bold, White (on dark) or Core Blue (on light) |
| H2 | 20-22px, Bold, Core Blue |
| Body text | 16px, Regular, `#59595B`, line-height 1.6 |
| Links | Core Blue `#006DB6`, no underline |
| CTA button | Orange `#F67D4B`, white text, 6px radius, 12px 24px padding, Semi-Bold |
| Preheader | Hidden div, max-height 0, overflow hidden |
| Footer text | 13px, `#59595B` for info; 11px `#ADB5BD` for unsubscribe |

### Standard Footer Content

```html
<strong>Technijian</strong><br>
18 Technology Dr., Ste 141<br>
Irvine, CA 92618<br>
949.379.8500 | technijian.com
```

Always include: Social links (LinkedIn, X, Facebook), Unsubscribe link, Manage Preferences link.

## Email Copy Guidelines

### Subject Lines
- **Communicate value, not hype** ("3 ways to reduce IT downtime" not "AMAZING IT SECRETS!!!")
- **Keep under 50 characters** for mobile preview
- **Never use ALL CAPS** or excessive punctuation
- **Personalize when possible** ("[First Name], your quarterly IT review is ready")

### Body Copy
- **Respect the reader's time** - get to the point
- **One CTA per email section** - don't overwhelm with choices
- **Lead with benefit** - what does the reader gain?
- **Short paragraphs** - 2-3 sentences max per paragraph
- **Clear CTA** - "Schedule a Call" beats "Click Here"

### Newsletter Specific
- **2-3 articles per newsletter** - not more
- **Each article**: Headline + 2-3 sentence summary + "Read More" button
- **Include a "Quick Tips" section** for practical value
- **End with a call-to-action banner** (contact us, schedule a review)

## Logo for Email

Use the hosted logo URL in all email templates:
```
<!-- Replace with actual hosted URL -->
<img src="https://technijian.com/assets/technijian-logo.png" alt="Technijian - Technology as a Solution" width="200">
```

Recommended source file: `assets/logos/png/technijian-logo-full-color-600x125.png`

## Related Skills

- **technijian-brand** — Master brand reference (colors, typography, voice, UI specs). Consult for any values not covered here.
