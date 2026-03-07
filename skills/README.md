# Technijian Brand Skills for Claude Code

These skills enable Technijian team members to generate brand-compliant materials directly from Claude Code. Each skill encodes the Technijian Brand Guide 2026 rules so that outputs automatically follow correct colors, typography, voice, and layout.

## Available Skills

| Skill | What It Generates |
|-------|-------------------|
| `technijian-brand` | Master brand reference (colors, typography, voice, UI specs) |
| `technijian-proposal` | DOCX proposals, one-pagers, and case studies |
| `technijian-presentation` | PowerPoint slide decks with branded layouts |
| `technijian-social` | Social media graphics (SVG) and post captions |
| `technijian-email` | HTML email campaigns, newsletters, and signatures |
| `technijian-report` | QBRs, IT assessments, security audits, compliance reports |
| `technijian-letterhead` | Formal letters and correspondence on company letterhead |
| `technijian-legal` | MSAs, SOWs, NDAs, SLAs, and Acceptable Use Policies |

## Installation

### Option 1: Install from this repository

Each team member runs these commands in their terminal:

```bash
claude install-skill /path/to/tech-branding/skills/technijian-brand
claude install-skill /path/to/tech-branding/skills/technijian-proposal
claude install-skill /path/to/tech-branding/skills/technijian-presentation
claude install-skill /path/to/tech-branding/skills/technijian-social
claude install-skill /path/to/tech-branding/skills/technijian-email
claude install-skill /path/to/tech-branding/skills/technijian-report
claude install-skill /path/to/tech-branding/skills/technijian-letterhead
claude install-skill /path/to/tech-branding/skills/technijian-legal
```

Replace `/path/to/tech-branding` with the actual path where this repo is cloned.

### Option 2: Manual copy

Copy each skill folder into your Claude Code skills directory:

```bash
# Windows
copy /r skills\technijian-brand %USERPROFILE%\.claude\skills\technijian-brand
copy /r skills\technijian-email %USERPROFILE%\.claude\skills\technijian-email
copy /r skills\technijian-presentation %USERPROFILE%\.claude\skills\technijian-presentation
copy /r skills\technijian-proposal %USERPROFILE%\.claude\skills\technijian-proposal
copy /r skills\technijian-social %USERPROFILE%\.claude\skills\technijian-social

# macOS / Linux
cp -r skills/technijian-* ~/.claude/skills/
```

### Option 3: Project-level (recommended for shared repos)

If this `skills/` folder lives inside a project repository, Claude Code automatically discovers skills in the project directory. No installation needed -- just clone the repo and the skills are available.

## Usage Examples

Once installed, team members can prompt Claude Code naturally:

**Proposals:**
> "Create an IT services proposal for Acme Corp, a 50-person manufacturing company in Los Angeles needing managed IT and cybersecurity."

**Presentations:**
> "Build a 10-slide pitch deck for a healthcare client interested in HIPAA compliance and cloud migration."

**Social Media:**
> "Create a LinkedIn tech tip post about phishing prevention."

**Emails:**
> "Generate a monthly newsletter announcing our new AI development services and Q1 security stats."

**Email Signatures:**
> "Create an email signature for John Smith, Senior Solutions Architect."

**Reports:**
> "Generate a Q1 2026 QBR for Acme Corp showing 99.5% uptime and 142 tickets resolved."

**Letters:**
> "Write a welcome letter for a new client, Johnson Manufacturing, introducing their pod team."

**Legal Agreements:**
> "Create an MSA for a 24-month managed IT engagement with Pacific Healthcare Group."

## Prerequisites

Some skills generate files that require Node.js packages:

| Skill | Package | Install |
|-------|---------|---------|
| Presentations | pptxgenjs | `npm install pptxgenjs` |
| Proposals / Case Studies | docx | `npm install docx` |
| Reports / QBRs | docx | `npm install docx` |
| Letters / Letterhead | docx | `npm install docx` |
| Legal Agreements | docx | `npm install docx` |

These are installed automatically in the working directory when needed.

## Brand Assets

The skills reference logo files from `assets/logos/png/`. Ensure these files are accessible:

- `technijian-logo-full-color-600x125.png` (light backgrounds)
- `technijian-logo-full-color-1200x251.png` (presentations, light)
- `technijian-logo-reverse-white-5000x1667.png` (dark backgrounds)
