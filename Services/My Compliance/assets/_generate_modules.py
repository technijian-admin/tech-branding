"""Generate 4 module one-pagers for My Compliance: Audit, Signal, Shield, Guardian.

Adapted from Chat.AI - Healthcare One-Pager.html template.
Structure per module:
  Hero (logo + title + tagline + 4 stats)
  Orange line + value prop strip (tagline)
  Main 2-column grid:
    Left col: Capabilities (4 groups) + Today's Method + Nexus Future
    Right col: Why <Module> + Engagement Models (4) + Frameworks + Impact strip
  CTA + footer
"""
from playwright.sync_api import sync_playwright
import os
from PIL import Image

ASSETS_DIR = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance\assets'
OUT_DIR    = r'C:\VSCode\tech-branding\tech-branding\Services\My Compliance'

CSS = r"""
:root {
  --blue:#006DB6; --blue-dark:#004d80; --orange:#F67D4B; --teal:#1EAAC8;
  --chartreuse:#CBDB2D; --dark:#1A1A2E; --near-black:#2D2D2D;
  --grey:#59595B; --light-grey:#E9ECEF; --off-white:#F8F9FA; --white:#FFFFFF;
}
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
@page { size: letter; margin:0; }
html, body { width:8.5in; min-height:11in; }
body {
  font-family:'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color:#333; line-height:1.5;
  display:flex; flex-direction:column;
  width:8.5in; min-height:11in; height:11in;
  margin:0 auto; overflow:hidden; background:var(--off-white);
  position:relative;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}

.hero {
  background: linear-gradient(135deg, var(--dark) 0%, #0a1628 60%, #0d2847 100%);
  padding:18px 32px; display:flex; align-items:center;
  justify-content:space-between; flex-shrink:0;
  position:relative; overflow:hidden;
}
.hero::before { content:''; position:absolute; top:-50px; right:-40px; width:160px; height:160px; background:radial-gradient(circle, rgba(30,170,200,0.15) 0%, transparent 70%); border-radius:50%; }
.hero::after  { content:''; position:absolute; bottom:-40px; left:15%; width:120px; height:120px; background:radial-gradient(circle, rgba(246,125,75,0.10) 0%, transparent 70%); border-radius:50%; }
.hero-left { display:flex; align-items:center; gap:14px; position:relative; z-index:1; }
.hero-left img { height:32px; display:block; }
.hero-text { display:flex; flex-direction:column; }
.hero-badge { display:inline-block; background:rgba(30,170,200,0.20); border:1px solid rgba(30,170,200,0.45); color:var(--teal); font-size:7px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:2px 10px; border-radius:10px; margin-bottom:4px; width:fit-content; }
.hero-title { font-size:22px; font-weight:800; color:#fff; line-height:1.1; }
.hero-title .o { color:var(--orange); }
.hero-stats { display:flex; gap:18px; position:relative; z-index:1; }
.hero-stat { text-align:center; }
.hero-stat .n { font-size:15px; font-weight:800; color:var(--orange); display:block; line-height:1.1; }
.hero-stat .l { font-size:7.5px; color:rgba(255,255,255,0.55); display:block; letter-spacing:0.3px; text-transform:uppercase; margin-top:2px; }
.hero-stat + .hero-stat { border-left:1px solid rgba(255,255,255,0.12); padding-left:18px; }

.orange-line { height:3px; background:linear-gradient(90deg, var(--orange), var(--teal)); flex-shrink:0; }
.vp { background:var(--blue); text-align:center; padding:8px 20px; color:#fff; font-size:11.5px; font-weight:600; flex-shrink:0; }

.main { display:grid; grid-template-columns:1fr 1fr; gap:22px; padding:11px 28px 54px; flex:1; }

.sh { font-size:12.5px; font-weight:700; color:var(--blue); text-transform:uppercase; letter-spacing:1.1px; margin-bottom:7px; border-bottom:2px solid var(--light-grey); padding-bottom:3px; }

.sec { margin-bottom:9px; }

/* Capabilities */
.cg { margin-bottom:7px; }
.cg-t { font-size:11.5px; font-weight:700; color:var(--dark); display:flex; align-items:center; gap:6px; margin-bottom:2px; }
.cg-bar { width:4px; height:13px; border-radius:2px; flex-shrink:0; }
.cg p { font-size:10.25px; color:#444; line-height:1.36; padding-left:10px; }

/* Today/Future cards */
.tf { display:grid; grid-template-columns:1fr; gap:7px; }
.tf-card { background:#fff; border-left:3px solid var(--orange); padding:7px 10px; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.05); }
.tf-card.future { border-left-color:var(--teal); }
.tf-label { font-size:8.5px; font-weight:700; color:var(--orange); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:2px; }
.tf-card.future .tf-label { color:var(--teal); }
.tf-body { font-size:10.25px; color:#333; line-height:1.4; }
.tf-body b { color:var(--dark); }

/* Why list */
.diff { list-style:none; }
.diff li { font-size:10.5px; padding:3px 0; display:flex; gap:8px; align-items:flex-start; line-height:1.34; }
.dd { width:10px; height:10px; min-width:10px; border-radius:50%; margin-top:3px; flex-shrink:0; }
.diff li b { color:var(--dark); }

/* Engagement table */
.pt-wrap { border-radius:6px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.08); margin-top:4px; }
.pt { width:100%; border-collapse:collapse; }
.pt th { background:var(--dark); color:#fff; padding:5px 8px; text-align:left; font-weight:600; font-size:9px; }
.pt td { padding:5px 8px; font-size:10px; vertical-align:top; }
.pt tr:nth-child(even) td { background:var(--off-white); }
.pt td:first-child { color:var(--blue); font-weight:600; width:42%; }

/* Frameworks badges */
.badges { display:flex; flex-wrap:wrap; gap:5px 10px; margin-top:4px; }
.badge { font-size:9.5px; color:var(--grey); display:flex; align-items:center; gap:4px; }
.badge .bi { color:var(--teal); font-weight:800; font-size:10px; }

.cta { background:linear-gradient(135deg, var(--blue), var(--blue-dark)); text-align:center; padding:9px 20px; color:#fff; font-size:10.5px; position:absolute; left:0; right:0; bottom:20px; }
.cta b { color:#fff; }
.cta a { color:var(--orange); text-decoration:none; font-weight:700; }
.foot { background:var(--near-black); text-align:center; height:20px; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.38); font-size:7px; position:absolute; left:0; right:0; bottom:0; }

@media print {
  @page { size: letter; margin:0; }
  html, body { width:8.5in; min-height:11in; }
  body { min-height:11in; height:11in; margin:0; }
  * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
}
"""

# Module data
MODULES = [
    {
        "key": "Audit",
        "title_short": "Audit",
        "page_title": "Technijian My Compliance — Audit — Evidence Binders on Demand",
        "badge": "Compliance Module · Evidence & Audit",
        "tagline": "Evidence Binders on Demand. Tamper-evident audit logging, linked evidence, and one-click audit pack export aligned to your frameworks.",
        "stats": [
            ("Tamper", "Evident Logs"),
            ("Aligned", "8+ Frameworks"),
            ("1-Click", "Audit Pack"),
            ("6+ Yr", "Retention"),
        ],
        "caps": [
            ("blue",       "Centralized Audit Logging",
             "Append-only audit events with correlation IDs across systems, privileged-action logging, and full user · action · object · timestamp capture for every compliance-relevant operation."),
            ("orange",     "Evidence Repository",
             "Linked evidence per control: policy attestations, test results, screenshots, ticket records, and approval signatures — all versioned and ready for assessor review."),
            ("teal",       "Audit Pack Builder",
             "Pick a framework + time window; the builder auto-collects linked evidence, generates an indexed manifest, and exports an auditor-ready PDF or ZIP package."),
            ("dark",       "Retention & Archive",
             "Configurable retention per framework (HIPAA 6-yr, SOC 2, PCI, etc.), tamper-evident WORM storage, and immutable export support for legal hold."),
        ],
        "today": "Technijian consulting — evidence binders are assembled manually from tool exports, spreadsheets, and emailed attachments. Time-intensive but tailored to each assessor and framework.",
        "future": "<b>Nexus Audit</b> module — auto-generated audit packs with framework-aligned evidence, real-time gap detection, and one-click auditor package generation.",
        "why_title": "Why Audit",
        "why": [
            ("blue",       "Evidence Is the Audit",     "Every framework's audit hinges on evidence. Without systematic collection, you scramble the week before."),
            ("orange",     "Linked, Not Loose",          "Evidence is attached to controls — assessors see traceability, not a folder of PDFs."),
            ("teal",       "Audit Season → Non-Event",   "Pre-built packs mean auditors get what they need on day one, not week three."),
            ("dark",       "Tamper-Evident Trail",       "Append-only logs and immutable exports prove integrity to assessors and regulators."),
            ("chartreuse", "Multi-Framework Reuse",      "One evidence repository serves HIPAA, SOC 2, PCI, ISO, CMMC, GDPR, NIST, and HITRUST."),
        ],
        "engagement": [
            ("Audit Readiness Prep",        "Fixed-fee, framework-specific gap close + evidence collection prior to certification audit"),
            ("Managed Evidence Collection", "Ongoing monthly capture, organization, and refresh of evidence linked to each control"),
            ("Audit Sherpa",                "Hands-on guidance through certification — assessor liaison, evidence presentation, finding response"),
            ("Evidence Binder Remediation", "Cleanup of legacy binders, control mapping, and gap closure to make existing evidence audit-ready"),
        ],
        "frameworks": ["HIPAA", "SOC 2", "PCI-DSS", "CMMC", "ISO 27001", "GDPR", "NIST 800-171", "HITRUST", "CCPA"],
        "cta_q": "Ready to turn audit season into a non-event?",
    },
    {
        "key": "Signal",
        "title_short": "Signal",
        "page_title": "Technijian My Compliance — Signal — SIEM + SOC for Compliance",
        "badge": "Compliance Module · SIEM + SOC",
        "tagline": "SIEM + SOC. Tuned for Compliance. Log ingestion, detection engineering, UEBA, and SOAR — calibrated to compliance frameworks, not just security.",
        "stats": [
            ("24/7", "SOC Monitoring"),
            ("UEBA", "Entity Risk"),
            ("MITRE", "ATT&CK Tagged"),
            ("SOAR", "Playbooks"),
        ],
        "caps": [
            ("blue",       "Log Ingestion & Normalization",
             "Firewalls, IDS/IPS, VPN, Windows events, cloud APIs, email security, and EDR — all normalized into a unified schema with entity context for cross-source correlation."),
            ("orange",     "Detection Engineering",
             "Threshold, correlation, sequence, IOC, new-terms, and baseline rules — all MITRE ATT&CK tagged, with a test harness that replays sample events for tuning."),
            ("teal",       "UEBA & Entity Risk",
             "Per-entity baseline models, anomaly scoring, risk roll-ups across user/host/account, and explainability metadata so analysts trust the score."),
            ("dark",       "Case Mgmt & SOAR",
             "Case timelines, SLA tracking, playbooks with approval gates, and automated response actions: disable account, block IOC, isolate endpoint, ticket creation."),
        ],
        "today": "Technijian delivers SOC via 3rd-party SIEM (Microsoft Sentinel · Splunk · others) with manual rule tuning and analyst triage. Effective but labor-intensive per tenant.",
        "future": "<b>Nexus Signal</b> module — built-in SIEM with AI-powered triage, auto-tuning per tenant, integrated case management, and native SOAR playbooks.",
        "why_title": "Why Signal",
        "why": [
            ("blue",       "Frameworks Demand Logging",  "HIPAA, SOC 2, PCI, CMMC, ISO — every framework requires log collection, review, and alerting."),
            ("orange",     "Noise → Signal",              "Detection engineering and UEBA cut alert volume so analysts focus on what's real."),
            ("teal",       "MITRE-Tagged Coverage",       "Every detection mapped to ATT&CK technique — gaps are visible and prioritized."),
            ("dark",       "24/7 SOC, Audit-Grade",       "Continuous monitoring with retained evidence: alert, response, resolution — all logged."),
            ("chartreuse", "SOAR Cuts MTTR",              "Playbooks containment in minutes, not hours — with full audit trail of every action."),
        ],
        "engagement": [
            ("SIEM Deployment",              "Fixed-fee deployment of Sentinel/Splunk/etc., source onboarding, baseline detection rules, dashboards"),
            ("Managed SOC",                  "Monthly 24/7 monitoring, triage, tuning, threat hunting, executive reporting"),
            ("Detection Engineering Review", "Audit existing detections, MITRE coverage map, false-positive reduction, new rule development"),
            ("Compliance Logging Audit",     "Per-framework log source mapping, retention validation, gap closure recommendations"),
        ],
        "frameworks": ["HIPAA", "SOC 2", "PCI-DSS", "CMMC", "ISO 27001", "GDPR", "NIST 800-171", "HITRUST", "CCPA"],
        "cta_q": "Ready for compliance-grade logging and 24/7 SOC?",
    },
    {
        "key": "Shield",
        "title_short": "Shield",
        "page_title": "Technijian My Compliance — Shield — DLP + User Activity Monitoring",
        "badge": "Compliance Module · DLP + UAM",
        "tagline": "Data Loss Prevention + User Activity Monitoring. Catch regulated data before it leaves the endpoint — and prove it for the auditor.",
        "stats": [
            ("Teramind", "Powered Today"),
            ("OCR", "Indexed Search"),
            ("DLP", "Block & Warn"),
            ("Session", "Playback"),
        ],
        "caps": [
            ("blue",       "Endpoint DLP",
             "Content inspection for PII, PHI, PCI, and CUI; behavior-based rules; warn / block / notify / record actions on USB, email, web upload, print, and clipboard."),
            ("orange",     "User Activity Monitoring",
             "Application + web activity, file events, clipboard, print events, policy-gated screen capture, and OCR-indexed search across captured content."),
            ("teal",       "Insider Threat Detection",
             "Anomaly detection per user, dynamic risk scoring, session playback with timeline, and exportable evidence packets for HR or legal review."),
            ("dark",       "Compliance Evidence",
             "Audit trails of regulated-data handling, DLP exception logs, insider incident reports — formatted for direct inclusion in compliance audit packs."),
        ],
        "today": "<b>Teramind</b> — enterprise DLP + UAM platform, deployed, tuned, and managed by Technijian. Mature, proven, ready today.",
        "future": "<b>Nexus Shield</b> module — native DLP + UAM integrated with Vault (credentials), Signal (SIEM), and Guardian (file protection) under one tenant.",
        "why_title": "Why Shield",
        "why": [
            ("blue",       "Endpoints Leak Data",          "Regulated data (PHI, CUI, PII, PCI) walks out via USB, email, paste, and screen — Shield catches it."),
            ("orange",     "Block, Don't Just Watch",      "Real-time block/warn actions stop exfiltration before it completes — not just alerts after."),
            ("teal",       "Insider Risk, Quantified",     "Per-user risk scores let security teams focus on the few users that matter most."),
            ("dark",       "Evidence for the Auditor",     "Every DLP event, exception, and incident is logged in formats auditors accept directly."),
            ("chartreuse", "Session Playback",             "Investigations get definitive answers — see what the user actually did, not just metadata."),
        ],
        "engagement": [
            ("Shield Deployment",            "Fixed-fee Teramind rollout: agent deployment, policy library, exception process, training"),
            ("Managed DLP Program",          "Ongoing policy tuning, exception triage, monthly reporting, periodic policy review"),
            ("Insider Threat Investigation", "Per-incident response: timeline, evidence packet, HR/legal handoff, lessons learned"),
            ("Compliance Reporting Package", "Quarterly DLP audit reports formatted for HIPAA, PCI, SOC 2, CMMC assessor review"),
        ],
        "frameworks": ["HIPAA (PHI)", "PCI-DSS (CHD)", "CMMC (CUI)", "GDPR", "SOC 2", "CCPA", "NIST 800-171"],
        "cta_q": "Ready to stop regulated data from walking out?",
    },
    {
        "key": "Guardian",
        "title_short": "Guardian",
        "page_title": "Technijian My Compliance — Guardian — File Protection + Ransomware Response",
        "badge": "Compliance Module · File Protection",
        "tagline": "Sensitive File Protection + Ransomware Response. Discover what's on the share, classify it, monitor it, and stop ransomware before it spreads.",
        "stats": [
            ("Auto", "Classification"),
            ("FIM", "Continuous"),
            ("DLP", "For Files"),
            ("Anti", "Ransomware"),
        ],
        "caps": [
            ("blue",       "File Discovery & Classification",
             "SMB share scanning, sensitive-file identification (PHI / PCI / CUI / PII), ROT (redundant / obsolete / trivial) analysis, and rule-based classification across the estate."),
            ("orange",     "File Integrity Monitoring (FIM)",
             "Baseline + change detection, permission-change alerts, ransomware heuristics, and unauthorized access notifications for sensitive shares and config files."),
            ("teal",       "DLP Enforcement for Files",
             "In-motion policies for sensitive files: block / warn on USB, email, web upload, print, and clipboard — across endpoints and Remote Desktop Services."),
            ("dark",       "Ransomware Detection & Response",
             "Behavioral heuristics, mass-encryption detection, automated quarantine and rollback workflows, and forensic evidence preservation for post-incident review."),
        ],
        "today": "Technijian consulting — manual file-share audits via PowerShell scripts plus Teramind rules for endpoint DLP. Effective discovery, but labor-intensive at scale.",
        "future": "<b>Nexus Guardian</b> module — automated classification, continuous FIM, integrated DLP policies, and AI-powered ransomware response playbooks under one console.",
        "why_title": "Why Guardian",
        "why": [
            ("blue",       "Ransomware Targets Files",     "Encryption hits file shares first — Guardian discovers what's there and protects it in motion."),
            ("orange",     "You Can't Protect What You Can't See", "Most orgs don't know what sensitive data lives on shares — discovery is step zero."),
            ("teal",       "FIM = Early Warning",          "Permission changes and mass file events surface attacks before encryption completes."),
            ("dark",       "DLP Across Endpoints + RDS",   "Files are exfiltrated from endpoints and remote sessions alike — both must be covered."),
            ("chartreuse", "Forensics Built-In",           "Quarantine + rollback + evidence preservation lets you recover and investigate at once."),
        ],
        "engagement": [
            ("File Share Discovery",         "Fixed-fee SMB scan, sensitive data inventory, ROT report, classification recommendations"),
            ("Managed Guardian Program",     "Ongoing FIM, DLP tuning, ransomware playbook drills, monthly file-risk reporting"),
            ("Ransomware Readiness Assessment", "Tabletop exercise, control gap analysis, recovery RTO/RPO validation, executive briefing"),
            ("Post-Incident Forensics",      "Evidence preservation, timeline reconstruction, root-cause analysis, regulator-ready report"),
        ],
        "frameworks": ["HIPAA (PHI shares)", "CMMC (CUI shares)", "PCI-DSS (CHD)", "SOC 2", "GDPR", "NIST 800-171"],
        "cta_q": "Ready to defend the file shares ransomware targets?",
    },
]


def render_html(m: dict) -> str:
    # Hero stats
    stats_html = ""
    for n, l in m["stats"]:
        stats_html += f'    <div class="hero-stat"><span class="n">{n}</span><span class="l">{l}</span></div>\n'

    # Capabilities
    caps_html = ""
    for color, title, body in m["caps"]:
        caps_html += f"""      <div class="cg">
        <div class="cg-t"><div class="cg-bar" style="background:var(--{color})"></div> {title}</div>
        <p>{body}</p>
      </div>
"""

    # Why list
    why_html = ""
    for color, label, body in m["why"]:
        why_html += f'        <li><div class="dd" style="background:var(--{color})"></div><div><b>{label}:</b> {body}</div></li>\n'

    # Engagement
    eng_html = ""
    for name, desc in m["engagement"]:
        eng_html += f"          <tr><td>{name}</td><td>{desc}</td></tr>\n"

    # Frameworks
    fw_html = ""
    for fw in m["frameworks"]:
        fw_html += f'        <div class="badge"><span class="bi">&#10003;</span> {fw}</div>\n'

    title_short = m["title_short"]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{m['page_title']}</title>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>

<div class="hero">
  <div class="hero-left">
    <img src="../../../assets/Technijian Logo - white text.png" alt="Technijian">
    <div class="hero-text">
      <div class="hero-badge">{m['badge']}</div>
      <div class="hero-title">My <span class="o">Compliance</span> &mdash; {title_short}</div>
    </div>
  </div>
  <div class="hero-stats">
{stats_html}  </div>
</div>
<div class="orange-line"></div>
<div class="vp">{m['tagline']}</div>

<div class="main">
  <div>
    <div class="sec">
      <div class="sh">{title_short} Capabilities</div>
{caps_html}    </div>

    <div class="sec">
      <div class="sh">Today &rarr; Nexus</div>
      <div class="tf">
        <div class="tf-card">
          <div class="tf-label">Today &mdash; Technijian Delivery</div>
          <div class="tf-body">{m['today']}</div>
        </div>
        <div class="tf-card future">
          <div class="tf-label">Future &mdash; Nexus Platform</div>
          <div class="tf-body">{m['future']}</div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="sec">
      <div class="sh">{m['why_title']}</div>
      <ul class="diff">
{why_html}      </ul>
    </div>

    <div class="sec">
      <div class="sh">Engagement Models</div>
      <div class="pt-wrap">
      <table class="pt">
        <thead><tr><th>Model</th><th>Scope</th></tr></thead>
        <tbody>
{eng_html}        </tbody>
      </table>
      </div>
    </div>

    <div class="sec">
      <div class="sh">Compliance Frameworks Served</div>
      <div class="badges">
{fw_html}      </div>
    </div>
  </div>
</div>

<div class="cta">{m['cta_q']} &nbsp; <a href="mailto:RJain@technijian.com">Schedule a Demo</a> &nbsp;|&nbsp; <b>RJain@technijian.com</b> &nbsp;|&nbsp; <b>949.379.8500</b></div>
<div class="foot">&copy; 2026 Technijian &middot; 18 Technology Dr. Ste 141, Irvine CA 92618 &middot; technijian.com</div>

</body>
</html>
"""


def main():
    # 1. Write HTML files
    for m in MODULES:
        html = render_html(m)
        html_path = os.path.join(ASSETS_DIR, f"My Compliance - {m['key']} One-Pager.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  HTML  {html_path}")

    # 2. Render PDFs + screenshots via Playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for m in MODULES:
            html_path = os.path.join(ASSETS_DIR, f"My Compliance - {m['key']} One-Pager.html")
            pdf_path  = os.path.join(OUT_DIR,    f"My Compliance - {m['key']} One-Pager.pdf")
            shot_path = os.path.join(ASSETS_DIR, f"_verify_{m['key'].lower()}_onepager.png")

            page = browser.new_page(viewport={"width": 816, "height": 1056})
            page.goto("file:///" + html_path.replace(os.sep, "/"))
            page.wait_for_load_state("networkidle")
            page.pdf(
                path=pdf_path, format="Letter", print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            )
            page.screenshot(path=shot_path, full_page=True)
            page.close()

            with Image.open(shot_path) as img:
                w, h = img.size
            status = "OK" if h <= 1080 else "OVERFLOW"
            print(f"  PDF   {pdf_path}  | screenshot {w}x{h} -> {status}")
        browser.close()

    print("Done.")


if __name__ == "__main__":
    main()
