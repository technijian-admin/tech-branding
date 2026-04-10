"""
Nexus Assess One-Pager — ReportLab PDF Generator
Produces a pixel-perfect, full-bleed, single US Letter page PDF.
Brand: Technijian (Blue #006DB6, Orange #F67D4B, Teal #1EAAC8)
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

# Page dimensions
W, H = letter  # 612 x 792

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
WHITE = HexColor('#FFFFFF')

# Transparent helpers
def alpha(hex_color, a):
    r, g, b = hex_color.red, hex_color.green, hex_color.blue
    return Color(r, g, b, alpha=a)

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(OUT_DIR, "Nexus Assess One-Pager.pdf")

def draw_hero(c):
    """Dark hero strip at top — 88px tall."""
    y = H - 88
    h = 88
    # Dark gradient (simulated with layered rects)
    c.setFillColor(DARK)
    c.rect(0, y, W, h, fill=1, stroke=0)
    c.setFillColor(Color(0.04, 0.09, 0.17, alpha=0.6))
    c.rect(W*0.5, y, W*0.5, h, fill=1, stroke=0)
    c.setFillColor(Color(0.05, 0.16, 0.28, alpha=0.4))
    c.rect(W*0.7, y, W*0.3, h, fill=1, stroke=0)

    # Decorative glows
    c.setFillColor(alpha(TEAL, 0.08))
    c.circle(W - 30, H - 20, 60, fill=1, stroke=0)
    c.setFillColor(alpha(ORANGE, 0.06))
    c.circle(120, y + 10, 50, fill=1, stroke=0)

    # Title
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(28, H - 42, "Nexus")
    tw = c.stringWidth("Nexus ", "Helvetica-Bold", 22)
    c.setFillColor(ORANGE)
    c.drawString(28 + tw, H - 42, "Assess")

    # Badge
    badge_y = H - 60
    badge_text = "IT RISK & COMPLIANCE PLATFORM"
    c.setFont("Helvetica", 6.5)
    btw = c.stringWidth(badge_text, "Helvetica", 6.5)
    bx = 28
    c.setStrokeColor(alpha(TEAL, 0.5))
    c.setFillColor(alpha(TEAL, 0.15))
    c.roundRect(bx, badge_y - 4, btw + 16, 14, 7, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.drawString(bx + 8, badge_y, badge_text)

    # Hero stats
    stats = [("94+", "Report Types"), ("3", "OS Platforms"), ("24/7", "Monitoring"), ("10", "Frameworks")]
    sx = W - 28
    for i, (num, label) in enumerate(reversed(stats)):
        c.setFont("Helvetica-Bold", 17)
        nw = c.stringWidth(num, "Helvetica-Bold", 17)
        c.setFont("Helvetica", 6.5)
        lw = c.stringWidth(label, "Helvetica", 6.5)
        col_w = max(nw, lw) + 24
        sx -= col_w
        cx = sx + col_w / 2
        c.setFillColor(ORANGE)
        c.setFont("Helvetica-Bold", 17)
        c.drawCentredString(cx, H - 40, num)
        c.setFillColor(alpha(white, 0.5))
        c.setFont("Helvetica", 6.5)
        c.drawCentredString(cx, H - 52, label.upper())
        if i < len(stats) - 1:
            c.setStrokeColor(alpha(white, 0.15))
            c.setLineWidth(0.5)
            c.line(sx, H - 72, sx, H - 22)

def draw_accent_line(c):
    """Orange-to-teal-to-blue gradient accent line."""
    y = H - 91
    third = W / 3
    for i, color in enumerate([ORANGE, TEAL, BLUE]):
        c.setFillColor(color)
        c.rect(third * i, y, third + 1, 3, fill=1, stroke=0)

def draw_value_prop(c):
    """Blue value prop bar."""
    y = H - 115
    h = 22
    c.setFillColor(BLUE)
    c.rect(0, y, W, h, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9.5)
    text = "Automated IT environment scanning, risk scoring, and compliance reporting across your entire infrastructure."
    c.drawCentredString(W/2, y + 7, text)

def draw_section_header(c, text, x, y, w):
    """Blue uppercase section header with underline."""
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(x, y - 4, x + w, y - 4)

def draw_capability_group(c, title, color, items, x, y):
    """Capability group with colored bar and check items."""
    # Color bar
    c.setFillColor(color)
    c.rect(x, y - 2, 3, 11, fill=1, stroke=0)
    # Title
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x + 8, y, title)
    # Items
    iy = y - 12
    for item in items:
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(x + 6, iy, "\u2713")
        c.setFillColor(HexColor('#444444'))
        c.setFont("Helvetica", 8)
        c.drawString(x + 16, iy, item)
        iy -= 10.5
    return iy

def draw_left_column(c):
    """Left column: capabilities, report categories, how it works, comparison."""
    lx = 28
    lw = 270
    cy = H - 130

    # KEY CAPABILITIES
    draw_section_header(c, "Key Capabilities", lx, cy, lw)
    cy -= 18

    groups = [
        ("Discovery & Scanning", BLUE, [
            "Non-intrusive scans on Windows, macOS, and Linux",
            "Remote data collectors & lightweight ISAA agents",
            "Automated scheduling with continuous monitoring",
            "Real-time data analysis and risk prioritization",
            "SQL Server database security assessments",
        ]),
        ("Cloud & Microsoft 365", ORANGE, [
            "M365, Teams, SharePoint, OneDrive & Exchange audits",
            "Azure AD & Active Directory security assessments",
            "AWS infrastructure evaluation & config review",
            "Cloud permission & misconfiguration detection",
            "Conditional Access Policy analysis",
        ]),
        ("Risk Intelligence", TEAL, [
            "Dual scoring: proprietary + CVSS + MS Secure Score",
            "Severity-based prioritization with remediation",
            "Dark web monitoring & credential exposure detection",
            "Vulnerability scanning with CVE correlation",
            "AI-powered executive summaries for all reports",
        ]),
        ("Reporting & Compliance", DARK, [
            "94+ reports: executive, risk plans, technical details",
            "Multi-format export: DOCX, PDF, XLSX, PPTX, VSDX",
            "HIPAA, SOC 2, CJIS, PCI-DSS, NIST, CIS, GDPR",
            "Branded client-facing reports with your logo",
            "IT change comparison & end-user activity reports",
        ]),
    ]

    for title, color, items in groups:
        cy = draw_capability_group(c, title, color, items, lx, cy)
        cy -= 4

    # 94 REPORTS TABLE
    cy -= 6
    draw_section_header(c, "94 Reports Across 4 Categories", lx, cy, lw)
    cy -= 14

    cats = [
        ("Network Assessment", "Assets, diagrams, health, risk, change tracking", "32"),
        ("Security Assessment", "Vulnerabilities, access, behavior, breach liability", "39"),
        ("Microsoft Cloud", "Azure AD, M365, Teams, SharePoint, OneDrive", "13"),
        ("Compliance Frameworks", "HIPAA, PCI, NIST, CIS, SOC 2, CMMC, CJIS", "10"),
    ]
    # Table header
    c.setFillColor(DARK)
    c.roundRect(lx, cy - 2, lw, 13, 2, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(lx + 5, cy + 1, "CATEGORY")
    c.drawRightString(lx + lw - 5, cy + 1, "COUNT")
    cy -= 14
    for i, (cat, desc, count) in enumerate(cats):
        bg = OFF_WHITE if i % 2 == 0 else white
        c.setFillColor(bg)
        c.rect(lx, cy - 1, lw, 12, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(lx + 5, cy + 1, cat)
        c.setFillColor(GREY)
        c.setFont("Helvetica", 6.5)
        tw2 = c.stringWidth(cat + "  ", "Helvetica-Bold", 7.5)
        c.drawString(lx + 5 + tw2, cy + 1, "- " + desc)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 8)
        c.drawRightString(lx + lw - 8, cy + 1, count)
        cy -= 12

    # HOW IT WORKS
    cy -= 10
    draw_section_header(c, "How It Works", lx, cy, lw)
    cy -= 16
    steps = [
        ("1", "Deploy", "Install lightweight ISAA agents or run agentless scans across your network"),
        ("2", "Assess", "Automated scans evaluate security posture, vulnerabilities, and compliance gaps"),
        ("3", "Report", "Generate executive & technical reports with prioritized remediation steps"),
    ]
    for num, title, desc in steps:
        # Orange circle
        cx_c = lx + 9
        cy_c = cy + 3
        c.setFillColor(alpha(ORANGE, 0.2))
        c.circle(cx_c, cy_c, 10, fill=1, stroke=0)
        c.setFillColor(ORANGE)
        c.circle(cx_c, cy_c, 8, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(cx_c, cy_c - 3, num)
        # Text
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(lx + 22, cy + 2, title)
        c.setFillColor(HexColor('#444444'))
        c.setFont("Helvetica", 7.5)
        tw3 = c.stringWidth(title + "  ", "Helvetica-Bold", 8)
        c.drawString(lx + 22 + tw3, cy + 2, "- " + desc)
        cy -= 15

    # COMPETITIVE COMPARISON
    cy -= 8
    draw_section_header(c, "Vs. Competitors", lx, cy, lw)
    cy -= 14

    headers = ["Capability", "Qualys", "Nessus", "Auvik", "Nexus Assess"]
    col_widths = [90, 38, 38, 38, 66]
    # Header row
    hx = lx
    for i, (hdr, cw) in enumerate(zip(headers, col_widths)):
        if i == len(headers) - 1:
            c.setFillColor(BLUE)
        else:
            c.setFillColor(DARK)
        c.rect(hx, cy - 2, cw, 13, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(hx + 3, cy + 1, hdr)
        hx += cw

    rows = [
        ("Agentless scans", True, True, False, True),
        ("M365 audits", False, False, False, True),
        ("94+ reports", False, False, False, True),
        ("Dark web monitor", False, False, False, True),
        ("Compliance GRC", "Add-on", False, False, "Built-in"),
        ("AI exec summaries", False, False, False, True),
        ("PSA integration", False, False, "Limited", "Full"),
        ("Multi-format export", False, False, False, True),
    ]
    cy -= 13
    for ri, row in enumerate(rows):
        rx = lx
        bg = OFF_WHITE if ri % 2 == 0 else white
        for ci, (val, cw) in enumerate(zip(row, col_widths)):
            if ci == len(col_widths) - 1:
                c.setFillColor(Color(0.92, 0.96, 0.99, alpha=1))
            else:
                c.setFillColor(bg)
            c.rect(rx, cy - 1, cw, 11, fill=1, stroke=0)
            if ci == 0:
                c.setFillColor(DARK)
                c.setFont("Helvetica", 7)
                c.drawString(rx + 3, cy + 1, str(val))
            elif val is True:
                c.setFillColor(TEAL)
                c.setFont("Helvetica-Bold", 8)
                c.drawCentredString(rx + cw/2, cy, "\u2713")
            elif val is False:
                c.setFillColor(HexColor('#BBBBBB'))
                c.setFont("Helvetica", 7)
                c.drawCentredString(rx + cw/2, cy + 1, "\u2014")
            else:
                if ci == len(col_widths) - 1:
                    c.setFillColor(TEAL)
                    c.setFont("Helvetica-Bold", 6.5)
                else:
                    c.setFillColor(GREY)
                    c.setFont("Helvetica", 6.5)
                c.drawCentredString(rx + cw/2, cy + 1, str(val))
            rx += cw
        cy -= 11

def draw_right_column(c):
    """Right column: differentiators, pricing, compliance, ROI."""
    rx = 312
    rw = 272
    cy = H - 130

    # WHY NEXUS ASSESS
    draw_section_header(c, "Why Nexus Assess", rx, cy, rw)
    cy -= 16

    diffs = [
        (BLUE, "Complete visibility:", "Scan networks, cloud, endpoints, and AD from one platform"),
        (ORANGE, "Executive-ready reports:", "94+ branded reports with infographics and risk plans"),
        (TEAL, "Dual risk scoring:", "Proprietary algorithms + CVSS + Microsoft Secure Score"),
        (DARK, "10 compliance frameworks:", "HIPAA, SOC 2, PCI-DSS, NIST CSF, CIS, GDPR & more"),
        (CHARTREUSE, "PSA & doc sync:", "Auto ticket creation and ITGlue sync for MSP workflows"),
        (BLUE, "AI-powered insights:", "AI executive summaries and intelligent ticket recommendations"),
        (ORANGE, "Continuous monitoring:", "Scheduled scans with change detection & dark web monitoring"),
    ]
    for color, title, desc in diffs:
        c.setFillColor(color)
        c.circle(rx + 4, cy + 3, 3.5, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(rx + 14, cy + 1, title)
        tw4 = c.stringWidth(title + " ", "Helvetica-Bold", 8)
        c.setFillColor(HexColor('#444444'))
        c.setFont("Helvetica", 7.5)
        c.drawString(rx + 14 + tw4, cy + 1, desc)
        cy -= 13

    # PRICING
    cy -= 8
    draw_section_header(c, "Pricing At-a-Glance", rx, cy, rw)
    cy -= 14

    p_headers = ["Plan", "Monthly", "Annual", "Endpoints"]
    p_widths = [68, 58, 58, 88]
    px = rx
    for hdr, pw in zip(p_headers, p_widths):
        c.setFillColor(DARK)
        c.rect(px, cy - 2, pw, 13, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(px + 4, cy + 1, hdr.upper())
        px += pw

    tiers = [
        ("Essentials", "$499", "$4,990", "Up to 50", False),
        ("Professional", "$999", "$9,990", "Up to 250", True),
        ("Enterprise", "$1,999", "$19,990", "Unlimited", False),
        ("Managed", "Custom", "Custom", "Full service", False),
    ]
    cy -= 13
    for name, mo, yr, ep, popular in tiers:
        px = rx
        for ci, (val, pw) in enumerate(zip([name, mo, yr, ep], p_widths)):
            if popular:
                c.setFillColor(Color(0.90, 0.94, 0.98, alpha=1))
            elif tiers.index((name, mo, yr, ep, popular)) % 2 == 0:
                c.setFillColor(OFF_WHITE)
            else:
                c.setFillColor(white)
            c.rect(px, cy - 1, pw, 12, fill=1, stroke=0)
            if ci == 0 and popular:
                c.setFillColor(BLUE)
                c.setFont("Helvetica-Bold", 7.5)
            elif ci == 0:
                c.setFillColor(DARK)
                c.setFont("Helvetica-Bold", 7.5)
            else:
                c.setFillColor(HexColor('#444444'))
                c.setFont("Helvetica", 7.5)
            c.drawString(px + 4, cy + 1, val)
            px += pw
        cy -= 12

    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(rx, cy - 1, "Annual saves 17%  \u2022  Professional includes dark web monitoring  \u2022  All plans include compliance")
    cy -= 14

    # SECURITY & COMPLIANCE
    draw_section_header(c, "Security & Compliance", rx, cy, rw)
    cy -= 14

    badges = ["HIPAA", "SOC 2", "PCI-DSS", "CJIS", "HPH CPGs", "NIST CSF", "CIS Controls", "GDPR", "CMMC", "FFIEC"]
    bx = rx
    for badge in badges:
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(bx, cy, "\u2713")
        c.setFillColor(GREY)
        c.setFont("Helvetica", 7.5)
        c.drawString(bx + 9, cy, badge)
        bw = 9 + c.stringWidth(badge, "Helvetica", 7.5) + 14
        bx += bw
        if bx > rx + rw - 20:
            bx = rx
            cy -= 11

    # ROI SNAPSHOT
    cy -= 16
    draw_section_header(c, "Risk Reduction Snapshot", rx, cy, rw)
    cy -= 14

    roi_data = [
        (BLUE, "50 Endpoints", "85%", "Faster assessments"),
        (ORANGE, "250 Endpoints", "$4.45M", "Avg breach cost avoided"),
        (TEAL, "Compliance", "70%", "Less audit prep time"),
    ]
    card_w = (rw - 12) / 3
    for i, (color, label, value, desc) in enumerate(roi_data):
        cx = rx + i * (card_w + 6)
        # Dark card
        c.setFillColor(DARK)
        c.roundRect(cx, cy - 36, card_w, 48, 4, fill=1, stroke=0)
        # Top accent bar
        c.setFillColor(color)
        c.rect(cx, cy + 8, card_w, 3, fill=1, stroke=0)
        # Label
        c.setFillColor(alpha(white, 0.5))
        c.setFont("Helvetica", 6)
        c.drawCentredString(cx + card_w/2, cy - 2, label.upper())
        # Value
        c.setFillColor(CHARTREUSE)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(cx + card_w/2, cy - 18, value)
        # Desc
        c.setFillColor(alpha(white, 0.5))
        c.setFont("Helvetica", 5.5)
        c.drawCentredString(cx + card_w/2, cy - 30, desc)

def draw_cta(c):
    """Blue CTA bar."""
    y = 30
    h = 26
    c.setFillColor(BLUE)
    c.rect(0, y, W, h, fill=1, stroke=0)
    c.setFillColor(Color(0, 0.2, 0.35, alpha=0.3))
    c.rect(W*0.6, y, W*0.4, h, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(W/2, y + 9, "See your risk posture in minutes  \u2014  Schedule an Assess Demo  |  RJain@technijian.com  |  949.379.8500")

def draw_footer(c):
    """Dark footer bar."""
    c.setFillColor(NEAR_BLACK)
    c.rect(0, 0, W, 30, fill=1, stroke=0)
    c.setFillColor(alpha(white, 0.38))
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(W/2, 12, "\u00a9 2026 Technijian  \u2022  18 Technology Dr. Ste 141, Irvine CA 92618  \u2022  technijian.com")

def main():
    c_pdf = canvas.Canvas(OUT_PATH, pagesize=letter)
    c_pdf.setTitle("Technijian Nexus Assess One-Pager")
    c_pdf.setAuthor("Technijian")

    # White base
    c_pdf.setFillColor(white)
    c_pdf.rect(0, 0, W, H, fill=1, stroke=0)

    draw_hero(c_pdf)
    draw_accent_line(c_pdf)
    draw_value_prop(c_pdf)
    draw_left_column(c_pdf)
    draw_right_column(c_pdf)
    draw_cta(c_pdf)
    draw_footer(c_pdf)

    c_pdf.save()
    print(f"PDF saved: {OUT_PATH}")

if __name__ == "__main__":
    main()
