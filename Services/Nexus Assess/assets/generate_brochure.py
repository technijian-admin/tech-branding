"""
Nexus Assess Brochure — ReportLab PDF Generator
Produces a multi-page, full-bleed, branded brochure PDF.
Each page is US Letter (612x792 pts).
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, Color, white
from reportlab.pdfgen import canvas

W, H = letter
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(OUT_DIR, "Nexus Assess Brochure.pdf")

# Brand colors
BLUE = HexColor('#006DB6')
ORANGE = HexColor('#F67D4B')
TEAL = HexColor('#1EAAC8')
CHARTREUSE = HexColor('#CBDB2D')
DARK = HexColor('#1A1A2E')
NEAR_BLACK = HexColor('#2D2D2D')
GREY = HexColor('#59595B')
LIGHT_GREY = HexColor('#E9ECEF')
OFF_WHITE = HexColor('#F8F9FA')
WHITE_C = HexColor('#FFFFFF')

def a(color, alpha_val):
    return Color(color.red, color.green, color.blue, alpha=alpha_val)

def dark_bg(c):
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(Color(0.04, 0.09, 0.17, alpha=0.5))
    c.rect(W*0.5, 0, W*0.5, H, fill=1, stroke=0)
    c.setFillColor(a(TEAL, 0.07))
    c.circle(W - 60, H - 80, 120, fill=1, stroke=0)
    c.setFillColor(a(ORANGE, 0.04))
    c.circle(80, 150, 100, fill=1, stroke=0)

def footer(c, dark=True):
    c.setFillColor(NEAR_BLACK if dark else LIGHT_GREY)
    c.rect(0, 0, W, 24, fill=1, stroke=0)
    c.setFillColor(a(white, 0.38) if dark else GREY)
    c.setFont("Helvetica", 7)
    c.drawCentredString(W/2, 9, "\u00a9 2026 Technijian  \u2022  18 Technology Dr. Ste 141, Irvine CA 92618  \u2022  technijian.com")

def accent_line(c, y):
    thirds = W / 3
    for i, col in enumerate([ORANGE, TEAL, BLUE]):
        c.setFillColor(col)
        c.rect(thirds * i, y, thirds + 1, 3, fill=1, stroke=0)

# ══════════════════════════════════════════════════════════
# PAGE 1: COVER
# ══════════════════════════════════════════════════════════
def page_cover(c):
    dark_bg(c)
    # Badge
    c.setFillColor(a(TEAL, 0.12))
    c.setStrokeColor(a(TEAL, 0.35))
    c.setLineWidth(0.8)
    c.roundRect(210, 470, 192, 22, 11, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(W/2, 476, "IT RISK & COMPLIANCE PLATFORM")
    # Title
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 52)
    c.drawString(140, 415, "Nexus")
    c.setFillColor(ORANGE)
    c.drawString(140 + c.stringWidth("Nexus ", "Helvetica-Bold", 52), 415, "Assess")
    # Accent line
    c.setFillColor(ORANGE)
    c.rect(256, 400, 50, 3, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(306, 400, 50, 3, fill=1, stroke=0)
    # Tagline
    c.setFillColor(a(white, 0.55))
    c.setFont("Helvetica", 14)
    c.drawCentredString(W/2, 370, "Automated IT environment scanning, risk scoring,")
    c.drawCentredString(W/2, 352, "and compliance reporting across your entire infrastructure.")
    # Stats
    stats = [("94+", "REPORTS"), ("10", "FRAMEWORKS"), ("3", "PLATFORMS"), ("24/7", "MONITORING")]
    sx = 100
    for i, (num, label) in enumerate(stats):
        if i > 0:
            c.setStrokeColor(a(white, 0.10))
            c.setLineWidth(0.5)
            c.line(sx - 12, 270, sx - 12, 310)
        c.setFillColor(ORANGE)
        c.setFont("Helvetica-Bold", 28)
        c.drawCentredString(sx + 45, 290, num)
        c.setFillColor(a(white, 0.40))
        c.setFont("Helvetica", 7)
        c.drawCentredString(sx + 45, 275, label)
        sx += 115
    footer(c)

# ══════════════════════════════════════════════════════════
# PAGE 2: THE CHALLENGE
# ══════════════════════════════════════════════════════════
def page_challenge(c):
    c.setFillColor(OFF_WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Badge
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(48, H - 60, "THE CHALLENGE")
    # Title
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(48, H - 95, "IT Blind Spots Are Costing You Millions")
    # Lead
    c.setFillColor(GREY)
    c.setFont("Helvetica", 11)
    c.drawString(48, H - 120, "Most organizations lack complete visibility into their IT environments. Fragmented tools,")
    c.drawString(48, H - 135, "manual audits, and reactive security leave critical gaps that attackers exploit.")
    accent_line(c, H - 150)

    # 4 pain cards
    pains = [
        (BLUE, "Blind Spots in Hybrid Environments",
         ["Network spans on-premise, cloud, and remote", "endpoints \u2014 no single tool sees it all.",
          "Shadow IT and misconfigured cloud permissions", "hide in the gaps between point solutions."]),
        (ORANGE, "Manual Audits Drain Resources",
         ["Security assessments take weeks across multiple", "tools. By the time reports compile, data is stale.",
          "Teams spend more time gathering data than", "acting on the findings."]),
        (TEAL, "Compliance Complexity Keeps Growing",
         ["HIPAA, SOC 2, PCI-DSS, NIST, CMMC \u2014 each", "demands unique evidence and control mapping.",
          "Preparing for audits consumes hundreds of", "hours annually with no end in sight."]),
        (CHARTREUSE, "Risk Scoring Without Context",
         ["Generic scanners flag thousands of CVEs without", "business context. Teams waste time triaging low-",
          "impact findings while critical exposures like", "compromised dark web credentials go undetected."]),
    ]
    cy = H - 180
    for i, (color, title, lines) in enumerate(pains):
        col = i % 2
        row = i // 2
        x = 48 + col * 268
        y = cy - row * 150
        # Card bg
        c.setFillColor(a(HexColor('#000000'), 0.06))
        c.roundRect(x + 2, y - 2, 252, 130, 8, fill=1, stroke=0)
        c.setFillColor(white)
        c.setStrokeColor(LIGHT_GREY)
        c.setLineWidth(0.5)
        c.roundRect(x, y, 252, 130, 8, fill=1, stroke=1)
        # Left border
        c.setFillColor(color)
        c.rect(x, y + 4, 4, 122, fill=1, stroke=0)
        # Title
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(x + 16, y + 105, title)
        # Body
        c.setFillColor(GREY)
        c.setFont("Helvetica", 9)
        for j, line in enumerate(lines):
            c.drawString(x + 16, y + 85 - j * 14, line)
    footer(c, dark=False)

# ══════════════════════════════════════════════════════════
# PAGE 3: THE SOLUTION
# ══════════════════════════════════════════════════════════
def page_solution(c):
    c.setFillColor(white)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(48, H - 60, "THE SOLUTION")
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(48, H - 95, "One Platform. Complete Visibility.")
    c.setFillColor(GREY)
    c.setFont("Helvetica", 11)
    c.drawString(48, H - 120, "Nexus Assess replaces fragmented security tools with a unified IT risk and compliance")
    c.drawString(48, H - 135, "platform that scans, scores, and reports across your entire infrastructure \u2014 automatically.")
    accent_line(c, H - 150)

    pillars = [
        (BLUE, "Discover Everything", "Non-intrusive scanning across Windows, macOS,", "Linux, AD, M365, and AWS. Deploy ISAA agents", "or run agentless \u2014 your choice."),
        (ORANGE, "Score & Prioritize Risk", "Dual risk scoring combines proprietary algorithms", "with CVSS and Microsoft Secure Score. Severity-", "based prioritization with remediation guidance."),
        (TEAL, "Report Instantly", "94+ report types in DOCX, PDF, XLSX, PPTX, and", "VSDX. Executive infographics, technical deep-", "dives, and branded client-facing reports."),
        (CHARTREUSE, "Stay Compliant", "Built-in mapping for 10 frameworks: HIPAA,", "SOC 2, PCI-DSS, NIST CSF, CIS Controls, GDPR,", "CMMC, CJIS, FFIEC, and HPH CPGs."),
    ]
    cy = H - 180
    for i, (color, title, l1, l2, l3) in enumerate(pillars):
        x = 48 + (i % 2) * 268
        y = cy - (i // 2) * 150
        # Card
        c.setFillColor(OFF_WHITE)
        c.setStrokeColor(LIGHT_GREY)
        c.roundRect(x, y, 252, 130, 8, fill=1, stroke=1)
        c.setFillColor(color)
        c.rect(x, y + 4, 4, 122, fill=1, stroke=0)
        # Icon square
        c.setFillColor(color)
        c.roundRect(x + 16, y + 85, 34, 34, 8, fill=1, stroke=0)
        # Title
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(x + 58, y + 102, title)
        # Body
        c.setFillColor(GREY)
        c.setFont("Helvetica", 9)
        c.drawString(x + 16, y + 65, l1)
        c.drawString(x + 16, y + 52, l2)
        c.drawString(x + 16, y + 39, l3)

    # How it works strip
    c.setFillColor(DARK)
    c.rect(0, 100, W, 90, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(W/2, 170, "How It Works")
    steps = [("1", "Deploy", "Install ISAA agents or\nrun agentless scans"),
             ("2", "Assess", "Automated scans evaluate\nsecurity & compliance"),
             ("3", "Report", "Generate executive reports\nwith remediation steps")]
    sx = 100
    for num, title, desc in steps:
        c.setFillColor(ORANGE)
        c.circle(sx, 145, 12, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(sx, 141, num)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(sx + 20, 147, title)
        c.setFillColor(a(white, 0.55))
        c.setFont("Helvetica", 8)
        for j, line in enumerate(desc.split("\n")):
            c.drawString(sx + 20, 133 - j * 11, line)
        sx += 180
    footer(c, dark=False)

# ══════════════════════════════════════════════════════════
# PAGE 4: KEY DIFFERENTIATOR — 94 REPORTS
# ══════════════════════════════════════════════════════════
def page_reports(c):
    dark_bg(c)
    c.setFillColor(CHARTREUSE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(48, H - 60, "KEY DIFFERENTIATOR")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(48, H - 95, "94 Reports No Other Platform Delivers")
    c.setFillColor(a(white, 0.55))
    c.setFont("Helvetica", 11)
    c.drawString(48, H - 120, "From network diagrams to compliance gap analysis \u2014 all branded with your company logo.")

    # 4 report cards
    cats = [(BLUE, "32", "Network", "Assets, diagrams, health,\nrisk, change tracking, QBR"),
            (ORANGE, "39", "Security", "Vulnerabilities, access control,\nuser behavior, breach liability"),
            (TEAL, "13", "Cloud", "Azure AD, M365, Teams,\nSharePoint, Conditional Access"),
            (CHARTREUSE, "10", "Compliance", "HIPAA, SOC 2, PCI-DSS,\nNIST CSF, CIS, GDPR")]
    sx = 48
    for color, num, title, desc in cats:
        c.setFillColor(a(white, 0.06))
        c.setStrokeColor(a(white, 0.10))
        c.roundRect(sx, H - 270, 122, 120, 8, fill=1, stroke=1)
        c.setFillColor(color)
        c.rect(sx, H - 152, 122, 3, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 32)
        c.drawCentredString(sx + 61, H - 195, num)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(sx + 61, H - 215, title)
        c.setFillColor(a(white, 0.45))
        c.setFont("Helvetica", 8)
        for j, line in enumerate(desc.split("\n")):
            c.drawCentredString(sx + 61, H - 232 - j * 11, line)
        sx += 135

    # Format badges
    formats = ["DOCX", "PDF", "XLSX", "PPTX", "VSDX"]
    fx = 150
    for fmt in formats:
        c.setFillColor(a(white, 0.08))
        c.setStrokeColor(a(white, 0.15))
        c.roundRect(fx, H - 320, 56, 26, 6, fill=1, stroke=1)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(fx + 28, H - 312, fmt)
        fx += 68

    # AI Summaries callout
    c.setFillColor(a(white, 0.04))
    c.setStrokeColor(a(white, 0.08))
    c.roundRect(48, 60, W - 96, 80, 10, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(68, 115, "AI-Powered Executive Summaries")
    c.setFillColor(a(white, 0.6))
    c.setFont("Helvetica", 10)
    c.drawString(68, 96, "Every report includes an AI-generated executive summary with natural language risk")
    c.drawString(68, 82, "explanations, trend analysis, and intelligent ticket recommendations.")
    footer(c)

# ══════════════════════════════════════════════════════════
# PAGE 5: PRICING
# ══════════════════════════════════════════════════════════
def page_pricing(c):
    c.setFillColor(OFF_WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(48, H - 60, "PLANS & PRICING")
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(48, H - 95, "Simple, Transparent Pricing")
    accent_line(c, H - 110)

    tiers = [
        ("Essentials", "$499", "$4,990/yr", "Up to 50 endpoints", [
            "Network & security assessments", "Microsoft 365 auditing", "50+ report types",
            "CVSS risk scoring", "Compliance mapping", "Branded export"]),
        ("Professional", "$999", "$9,990/yr", "Up to 250 endpoints", [
            "Everything in Essentials", "Dark web monitoring", "94+ report types",
            "AI executive summaries", "PSA & ITGlue integration", "Scheduled scans", "Change detection"]),
        ("Enterprise", "$1,999", "$19,990/yr", "Unlimited endpoints", [
            "Everything in Professional", "Multi-site consolidated", "AWS infrastructure",
            "Custom frameworks", "API access & webhooks", "Priority support", "Dedicated CSM"]),
        ("Managed", "Custom", "Full service", "White-glove", [
            "Everything in Enterprise", "Technijian runs assessments", "Monthly briefings",
            "Remediation PM", "Compliance audit prep", "24/7 monitoring", "White-glove onboarding"]),
    ]
    tx = 38
    popular_idx = 1
    for i, (name, price, annual, ep, features) in enumerate(tiers):
        cw = 130
        cy = H - 130
        is_pop = (i == popular_idx)
        # Card shadow + bg
        c.setFillColor(a(HexColor('#000000'), 0.06))
        c.roundRect(tx + 2, cy - 382, cw, 370, 8, fill=1, stroke=0)
        c.setFillColor(white)
        c.setStrokeColor(BLUE if is_pop else LIGHT_GREY)
        c.setLineWidth(2 if is_pop else 0.5)
        c.roundRect(tx, cy - 380, cw, 370, 8, fill=1, stroke=1)
        # Popular badge
        if is_pop:
            c.setFillColor(BLUE)
            c.roundRect(tx + 20, cy - 17, 90, 18, 9, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont("Helvetica-Bold", 7)
            c.drawCentredString(tx + cw/2, cy - 12, "MOST POPULAR")
        # Name
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(tx + cw/2, cy - 45, name)
        # Price
        c.setFillColor(BLUE)
        c.setFont("Helvetica-Bold", 26)
        c.drawCentredString(tx + cw/2, cy - 78, price)
        c.setFillColor(GREY)
        c.setFont("Helvetica", 8)
        c.drawCentredString(tx + cw/2, cy - 92, "/mo" if price != "Custom" else "")
        # Annual
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(tx + cw/2, cy - 108, annual)
        # EP bar
        c.setStrokeColor(LIGHT_GREY)
        c.setLineWidth(0.5)
        c.line(tx + 10, cy - 120, tx + cw - 10, cy - 120)
        c.setFillColor(GREY)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(tx + cw/2, cy - 135, ep)
        c.line(tx + 10, cy - 145, tx + cw - 10, cy - 145)
        # Features
        fy = cy - 162
        for feat in features:
            c.setFillColor(TEAL)
            c.setFont("Helvetica-Bold", 7)
            c.drawString(tx + 12, fy, "\u2713")
            c.setFillColor(HexColor('#555555'))
            c.setFont("Helvetica", 7.5)
            c.drawString(tx + 22, fy, feat)
            fy -= 13
        tx += cw + 10

    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(W/2, 56, "Annual plans save 17%  \u2022  Volume discounts for MSPs  \u2022  30-day free pilot available")
    footer(c, dark=False)

# ══════════════════════════════════════════════════════════
# PAGE 6: COMPETITIVE COMPARISON
# ══════════════════════════════════════════════════════════
def page_comparison(c):
    c.setFillColor(white)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(48, H - 60, "COMPETITIVE ADVANTAGE")
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(48, H - 95, "Why Teams Switch to Nexus Assess")
    accent_line(c, H - 110)

    headers = ["Capability", "Qualys", "Nessus", "Auvik", "Nexus Assess"]
    col_xs = [48, 220, 300, 380, 455]
    col_ws = [172, 80, 80, 75, 105]
    # Header row
    for i, (hdr, x, w) in enumerate(zip(headers, col_xs, col_ws)):
        if i == len(headers) - 1:
            c.setFillColor(BLUE)
        else:
            c.setFillColor(DARK)
        c.rect(x, H - 140, w, 20, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 6, H - 135, hdr)

    rows = [
        ("Agentless network scans", "\u2713", "\u2713", "\u2014", "\u2713"),
        ("Microsoft 365 auditing", "\u2014", "\u2014", "\u2014", "\u2713"),
        ("Azure AD assessment", "\u2014", "\u2014", "\u2014", "\u2713"),
        ("94+ report types", "\u2014", "\u2014", "\u2014", "\u2713"),
        ("Dark web monitoring", "\u2014", "\u2014", "\u2014", "\u2713"),
        ("Built-in compliance GRC", "Add-on", "\u2014", "\u2014", "\u2713 Built-in"),
        ("AI executive summaries", "\u2014", "\u2014", "\u2014", "\u2713"),
        ("PSA integration (full)", "\u2014", "\u2014", "Limited", "\u2713 Full"),
        ("Multi-format export (5)", "PDF only", "PDF/CSV", "\u2014", "\u2713 5 formats"),
        ("Branded client reports", "\u2014", "\u2014", "\u2014", "\u2713"),
        ("10 compliance frameworks", "3", "\u2014", "\u2014", "\u2713 10"),
    ]
    ry = H - 160
    for ri, row in enumerate(rows):
        for ci, (val, x, w) in enumerate(zip(row, col_xs, col_ws)):
            bg = OFF_WHITE if ri % 2 == 0 else white
            if ci == len(col_xs) - 1:
                c.setFillColor(Color(0.92, 0.96, 1.0, alpha=1))
            else:
                c.setFillColor(bg)
            c.rect(x, ry, w, 18, fill=1, stroke=0)
            is_check = val.startswith("\u2713")
            is_dash = val == "\u2014"
            if ci == 0:
                c.setFillColor(DARK)
                c.setFont("Helvetica", 8)
            elif is_check and ci == len(col_xs) - 1:
                c.setFillColor(TEAL)
                c.setFont("Helvetica-Bold", 9)
            elif is_dash:
                c.setFillColor(HexColor('#CCCCCC'))
                c.setFont("Helvetica", 8)
            else:
                c.setFillColor(GREY)
                c.setFont("Helvetica", 8)
            c.drawString(x + 6, ry + 5, val)
        ry -= 18
    footer(c, dark=False)

# ══════════════════════════════════════════════════════════
# PAGE 7: ROI
# ══════════════════════════════════════════════════════════
def page_roi(c):
    dark_bg(c)
    c.setFillColor(CHARTREUSE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(48, H - 60, "RETURN ON INVESTMENT")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(48, H - 95, "The Business Case for Nexus Assess")
    c.setFillColor(a(white, 0.55))
    c.setFont("Helvetica", 11)
    c.drawString(48, H - 120, "Replace fragmented tools with one platform that pays for itself.")

    # 3 ROI cards
    roi = [(BLUE, "50 Endpoints", "85%", "Faster than manual"),
           (ORANGE, "250 Endpoints", "$4.45M", "Avg breach cost avoided"),
           (TEAL, "Compliance", "70%", "Less audit prep time")]
    rx = 48
    for color, label, value, desc in roi:
        c.setFillColor(a(white, 0.05))
        c.setStrokeColor(a(white, 0.10))
        c.roundRect(rx, H - 270, 165, 110, 8, fill=1, stroke=1)
        c.setFillColor(color)
        c.rect(rx, H - 162, 165, 3, fill=1, stroke=0)
        c.setFillColor(a(white, 0.45))
        c.setFont("Helvetica", 8)
        c.drawCentredString(rx + 82, H - 185, label.upper())
        c.setFillColor(CHARTREUSE)
        c.setFont("Helvetica-Bold", 34)
        c.drawCentredString(rx + 82, H - 228, value)
        c.setFillColor(a(white, 0.50))
        c.setFont("Helvetica", 9)
        c.drawCentredString(rx + 82, H - 250, desc)
        rx += 178

    # TCO Box
    c.setFillColor(a(white, 0.04))
    c.setStrokeColor(a(white, 0.08))
    c.roundRect(48, 80, W - 96, 220, 10, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(68, 275, "Total Cost of Ownership Analysis")
    tco_rows = [
        ("Qualys VMDR + Policy Compliance", "$18,000/yr"),
        ("Nessus Professional + Compliance add-on", "$12,500/yr"),
        ("Dark web monitoring (3rd party)", "$3,600/yr"),
        ("Manual report creation (120 hrs x $85)", "$10,200/yr"),
        ("Total without Nexus Assess", "$44,300/yr"),
        ("Nexus Assess Professional (annual)", "$9,990/yr"),
    ]
    ty = 248
    for label, val in tco_rows:
        c.setStrokeColor(a(white, 0.06))
        c.setLineWidth(0.3)
        c.line(68, ty - 4, W - 68, ty - 4)
        c.setFillColor(a(white, 0.65))
        c.setFont("Helvetica", 9)
        c.drawString(68, ty, label)
        c.setFillColor(a(white, 0.85))
        c.setFont("Helvetica-Bold", 9)
        c.drawRightString(W - 68, ty, val)
        ty -= 22
    # Savings row
    c.setStrokeColor(a(white, 0.10))
    c.line(68, ty - 4, W - 68, ty - 4)
    c.setFillColor(CHARTREUSE)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(68, ty - 2, "Annual Savings with Nexus Assess")
    c.setFont("Helvetica-Bold", 16)
    c.drawRightString(W - 68, ty - 4, "$34,310/yr")
    footer(c)

# ══════════════════════════════════════════════════════════
# PAGE 8: CTA + BACK COVER
# ══════════════════════════════════════════════════════════
def page_cta(c):
    # Blue gradient CTA
    c.setFillColor(BLUE)
    c.rect(0, H/2, W, H/2, fill=1, stroke=0)
    c.setFillColor(Color(0, 0.2, 0.35, alpha=0.3))
    c.rect(W*0.5, H/2, W*0.5, H/2, fill=1, stroke=0)
    c.setFillColor(a(white, 0.06))
    c.circle(W - 80, H - 80, 100, fill=1, stroke=0)

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(W/2, H - 120, "See Your Risk Posture in Minutes")
    c.setFillColor(a(white, 0.70))
    c.setFont("Helvetica", 12)
    c.drawCentredString(W/2, H - 148, "Schedule a personalized Nexus Assess demo and discover what")
    c.drawCentredString(W/2, H - 164, "94+ automated reports reveal about your environment.")

    # Buttons
    c.setFillColor(ORANGE)
    c.roundRect(195, H - 216, 100, 32, 6, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(245, H - 205, "Schedule Demo")
    c.setFillColor(Color(1, 1, 1, alpha=0))
    c.setStrokeColor(a(white, 0.4))
    c.setLineWidth(1.5)
    c.roundRect(315, H - 216, 100, 32, 6, fill=0, stroke=1)
    c.setFillColor(white)
    c.drawCentredString(365, H - 205, "949.379.8500")

    c.setFillColor(a(white, 0.6))
    c.setFont("Helvetica", 10)
    c.drawCentredString(W/2, H - 250, "RJain@technijian.com  |  949.379.8500  |  18 Technology Dr. Ste 141, Irvine CA 92618")

    # Dark back cover bottom half
    c.setFillColor(DARK)
    c.rect(0, 0, W, H/2, fill=1, stroke=0)
    c.setFillColor(a(TEAL, 0.06))
    c.circle(W - 60, 100, 80, fill=1, stroke=0)
    c.setFillColor(a(white, 0.55))
    c.setFont("Helvetica", 14)
    c.drawCentredString(W/2, H/2 - 80, "IT Risk & Compliance. Solved.")
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(W/2, H/2 - 110, "technijian.com")
    footer(c)

def main():
    c_pdf = canvas.Canvas(OUT_PATH, pagesize=letter)
    c_pdf.setTitle("Technijian Nexus Assess Brochure")
    c_pdf.setAuthor("Technijian")

    pages = [page_cover, page_challenge, page_solution, page_reports,
             page_pricing, page_comparison, page_roi, page_cta]

    for i, page_fn in enumerate(pages):
        page_fn(c_pdf)
        if i < len(pages) - 1:
            c_pdf.showPage()

    c_pdf.save()
    print(f"Brochure PDF saved: {OUT_PATH}")

if __name__ == "__main__":
    main()
