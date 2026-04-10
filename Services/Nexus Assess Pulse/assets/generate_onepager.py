"""
Nexus Assess Pulse — One-Pager PDF via ReportLab
Pixel-perfect US Letter page with full-bleed backgrounds.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(OUT_DIR, 'Nexus Assess Pulse One-Pager.pdf')

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

# Try to register Open Sans, fallback to Helvetica
FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'
try:
    for style, suffix in [('OpenSans', 'Regular'), ('OpenSans-Bold', 'Bold'),
                           ('OpenSans-SemiBold', 'SemiBold'), ('OpenSans-Light', 'Light')]:
        pdfmetrics.registerFont(TTFont(style, f'OpenSans-{suffix}.ttf'))
    FONT = 'OpenSans'
    FONT_BOLD = 'OpenSans-Bold'
except Exception:
    pass


def draw_rounded_rect(c, x, y, w, h, r, fill=None, stroke=None):
    """Draw a rounded rectangle."""
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, r)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w, y + h - r, x + w - r, y + h, r)
    p.lineTo(x + r, y + h)
    p.arcTo(x + r, y + h, x, y + h - r, r)
    p.lineTo(x, y + r)
    p.arcTo(x, y + r, x + r, y, r)
    p.close()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.drawPath(p, fill=1 if fill else 0, stroke=1)
    else:
        c.drawPath(p, fill=1 if fill else 0, stroke=0)


def build():
    c = canvas.Canvas(PDF_PATH, pagesize=letter)

    # ── HERO STRIP (top 85px) ──
    hero_h = 85
    hero_y = H - hero_h
    c.setFillColor(DARK)
    c.rect(0, hero_y, W, hero_h, fill=1, stroke=0)

    # Decorative glow circles
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.1))
    c.circle(W - 30, H - 15, 80, fill=1, stroke=0)
    c.setFillColor(Color(0.96, 0.49, 0.3, alpha=0.06))
    c.circle(120, hero_y + 10, 60, fill=1, stroke=0)

    # Title
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 22)
    c.drawString(28, H - 38, "Nexus")
    c.setFillColor(ORANGE)
    c.drawString(28 + c.stringWidth("Nexus ", FONT_BOLD, 22), H - 38, "Assess")
    c.setFillColor(WHITE)
    c.drawString(28 + c.stringWidth("Nexus Assess", FONT_BOLD, 22), H - 38, " + ")
    c.setFillColor(ORANGE)
    c.drawString(28 + c.stringWidth("Nexus Assess + ", FONT_BOLD, 22), H - 38, "Pulse")

    # Badge
    badge_y = H - 58
    draw_rounded_rect(c, 28, badge_y, 200, 16, 8, fill=Color(0.12, 0.67, 0.78, alpha=0.15))
    c.setFillColor(TEAL)
    c.setFont(FONT, 7)
    c.drawString(36, badge_y + 4, "IT RISK & COMPLIANCE + AI PENTEST")

    # Sub text
    c.setFillColor(Color(1, 1, 1, alpha=0.4))
    c.setFont(FONT, 7.5)
    c.drawString(240, badge_y + 4, "Vulnerability Intelligence Platform")

    # Hero stats
    stats = [("100+", "Report Types"), ("20+", "Security Tools"), ("AI", "ML Classifier"), ("24/7", "Monitoring")]
    sx = W - 28
    for val, label in reversed(stats):
        lw = c.stringWidth(label, FONT, 8)
        vw = c.stringWidth(val, FONT_BOLD, 20)
        bw = max(lw, vw) + 16
        sx -= bw
        c.setFillColor(ORANGE)
        c.setFont(FONT_BOLD, 20)
        c.drawCentredString(sx + bw / 2, H - 38, val)
        c.setFillColor(Color(1, 1, 1, alpha=0.45))
        c.setFont(FONT, 8)
        c.drawCentredString(sx + bw / 2, H - 52, label)
        # separator
        if sx > 350:
            c.setStrokeColor(Color(1, 1, 1, alpha=0.15))
            c.setLineWidth(0.5)
            c.line(sx - 6, H - 55, sx - 6, H - 28)

    # ── ORANGE LINE ──
    ol_y = hero_y
    c.setFillColor(ORANGE)
    c.rect(0, ol_y - 3, W / 2, 3, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(W / 2, ol_y - 3, W / 2, 3, fill=1, stroke=0)

    # ── VALUE PROP BAR ──
    vp_h = 24
    vp_y = ol_y - 3 - vp_h
    c.setFillColor(BLUE)
    c.rect(0, vp_y, W, vp_h, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 10.5)
    vp_text = "Unified IT risk assessment, compliance reporting, and AI-enhanced penetration testing in one platform."
    c.drawCentredString(W / 2, vp_y + 7, vp_text)

    # ── CTA BAR ──
    cta_h = 24
    cta_y = 22
    c.setFillColor(BLUE)
    c.rect(0, cta_y, W, cta_h, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 10)
    c.drawCentredString(W / 2, cta_y + 7, "Schedule a demo: RJain@technijian.com  |  949.379.8500  |  technijian.com")

    # ── FOOTER ──
    foot_h = 22
    c.setFillColor(NEAR_BLACK)
    c.rect(0, 0, W, foot_h, fill=1, stroke=0)
    c.setFillColor(Color(1, 1, 1, alpha=0.38))
    c.setFont(FONT, 7)
    c.drawCentredString(W / 2, 7, "\u00a9 2026 Technijian \u00b7 18 Technology Dr. Ste 141, Irvine CA 92618 \u00b7 technijian.com")

    # ── MAIN BODY AREA ──
    body_top = vp_y - 8
    body_bottom = cta_y + cta_h + 8
    body_h = body_top - body_bottom
    left_x = 28
    left_w = (W - 28 * 2 - 18) / 2
    right_x = left_x + left_w + 18
    right_w = left_w

    # ── LEFT COLUMN ──
    y = body_top

    def section_header(c, x, y, text):
        c.setFillColor(BLUE)
        c.setFont(FONT_BOLD, 11)
        c.drawString(x, y, text.upper())
        y -= 3
        c.setStrokeColor(LIGHT_GREY)
        c.setLineWidth(1.5)
        c.line(x, y, x + left_w, y)
        return y - 10

    def category_title(c, x, y, text, color):
        c.setFillColor(color)
        c.rect(x, y - 1, 4, 12, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 10)
        c.drawString(x + 8, y, text)
        return y - 14

    def bullet(c, x, y, text):
        c.setFillColor(TEAL)
        c.setFont(FONT_BOLD, 9)
        c.drawString(x, y, "\u2713")
        c.setFillColor(HexColor('#444444'))
        c.setFont(FONT, 9.5)
        c.drawString(x + 12, y, text)
        return y - 12

    # Assess Capabilities
    y = section_header(c, left_x, y, "Assess Capabilities")

    y = category_title(c, left_x, y, "Discovery & Scanning", BLUE)
    y = bullet(c, left_x + 2, y, "Non-intrusive scans: Windows, macOS, Linux")
    y = bullet(c, left_x + 2, y, "Remote data collectors & lightweight agents")
    y = bullet(c, left_x + 2, y, "Continuous monitoring with real-time analysis")
    y = bullet(c, left_x + 2, y, "SQL Server database security assessments")
    y -= 6

    y = category_title(c, left_x, y, "Cloud & Microsoft 365", ORANGE)
    y = bullet(c, left_x + 2, y, "M365, Teams, SharePoint, Exchange audits")
    y = bullet(c, left_x + 2, y, "Azure AD & Active Directory security")
    y = bullet(c, left_x + 2, y, "AWS infrastructure & misconfig detection")
    y -= 6

    y = category_title(c, left_x, y, "Risk Intelligence & Compliance", TEAL)
    y = bullet(c, left_x + 2, y, "Dual scoring: proprietary + CVSS + MS Secure Score")
    y = bullet(c, left_x + 2, y, "Dark web monitoring & credential exposure")
    y = bullet(c, left_x + 2, y, "100+ reports: exec, risk plans, compliance")
    y = bullet(c, left_x + 2, y, "HIPAA, SOC 2, PCI-DSS, CJIS, NIST CSF")
    y -= 10

    # Pulse Capabilities
    y = section_header(c, left_x, y, "Pulse Capabilities")

    y = category_title(c, left_x, y, "Recon & Vulnerability Scanning", ORANGE)
    y = bullet(c, left_x + 2, y, "Subdomain finder + Nmap port scanning")
    y = bullet(c, left_x + 2, y, "AI-enhanced website scanner for auth handling")
    y = bullet(c, left_x + 2, y, "SQL injection, XSS, SSRF, OWASP Top 10")
    y = bullet(c, left_x + 2, y, "CMS scanning: WordPress, Drupal, Joomla")
    y -= 6

    y = category_title(c, left_x, y, "AI Automation & Exploitation", DARK)
    y = bullet(c, left_x + 2, y, "ML Classifier: HIT / MISS / PARTIAL / INCONCLUSIVE")
    y = bullet(c, left_x + 2, y, "Pentest Robots: automated attack sequences")
    y = bullet(c, left_x + 2, y, "SQLMap & Sniper auto-exploitation for PoC")
    y = bullet(c, left_x + 2, y, "Screenshot & payload logging for evidence")
    y -= 10

    # How It Works
    y = section_header(c, left_x, y, "How It Works")
    # Assess steps
    c.setFillColor(Color(0, 0.43, 0.71, alpha=0.12))
    draw_rounded_rect(c, left_x, y - 2, 36, 12, 3, fill=Color(0, 0.43, 0.71, alpha=0.12))
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 7)
    c.drawString(left_x + 4, y, "ASSESS")
    sx = left_x + 42
    for num, label, desc in [("1", "Deploy", "Agents/agentless"), ("2", "Assess", "Auto evaluation"), ("3", "Report", "Exec reports")]:
        c.setFillColor(ORANGE)
        c.circle(sx + 7, y + 4, 7, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 8)
        c.drawCentredString(sx + 7, y + 1, num)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 8.5)
        c.drawString(sx + 18, y + 3, label)
        c.setFillColor(GREY)
        c.setFont(FONT, 7.5)
        c.drawString(sx + 18, y - 6, desc)
        sx += 78
    y -= 22

    # Pulse steps
    draw_rounded_rect(c, left_x, y - 2, 30, 12, 3, fill=Color(0.96, 0.49, 0.3, alpha=0.12))
    c.setFillColor(ORANGE)
    c.setFont(FONT_BOLD, 7)
    c.drawString(left_x + 4, y, "PULSE")
    sx = left_x + 42
    for num, label, desc in [("1", "Scope", "Define targets"), ("2", "Scan", "Pentest Robots"), ("3", "Prove", "Safe PoC")]:
        c.setFillColor(ORANGE)
        c.circle(sx + 7, y + 4, 7, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 8)
        c.drawCentredString(sx + 7, y + 1, num)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 8.5)
        c.drawString(sx + 18, y + 3, label)
        c.setFillColor(GREY)
        c.setFont(FONT, 7.5)
        c.drawString(sx + 18, y - 6, desc)
        sx += 78

    # ── RIGHT COLUMN ──
    y = body_top

    y = section_header(c, right_x, y, "Why Nexus Assess + Pulse")

    diffs = [
        (BLUE, "Complete visibility:", "Network, cloud, endpoints, AD in one platform"),
        (ORANGE, "AI-powered accuracy:", "ML classifier eliminates false positives"),
        (TEAL, "Proof, not findings:", "Safe exploitation generates executive evidence"),
        (DARK, "100+ branded reports:", "Exec infographics, risk plans, compliance"),
        (CHARTREUSE, "Unified platform:", "Risk assessment + pen testing, one pane of glass"),
    ]
    for color, title, desc in diffs:
        c.setFillColor(color)
        c.circle(right_x + 4, y + 2, 4, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 9.5)
        c.drawString(right_x + 14, y, title)
        c.setFillColor(HexColor('#444444'))
        c.setFont(FONT, 9.5)
        c.drawString(right_x + 14 + c.stringWidth(title + " ", FONT_BOLD, 9.5), y, desc)
        y -= 14
    y -= 6

    # Pricing
    y = section_header(c, right_x, y, "Pricing At-a-Glance")

    # Assess pricing mini-table
    draw_rounded_rect(c, right_x, y - 2, 36, 12, 3, fill=Color(0, 0.43, 0.71, alpha=0.12))
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 7)
    c.drawString(right_x + 4, y, "ASSESS")
    y -= 16

    # Table header
    c.setFillColor(DARK)
    c.rect(right_x, y, right_w / 2 - 4, 14, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 7.5)
    cols = [right_x + 4, right_x + 62, right_x + 105]
    c.drawString(cols[0], y + 4, "Plan")
    c.drawString(cols[1], y + 4, "Monthly")
    c.drawString(cols[2], y + 4, "Endpoints")
    y -= 12

    assess_rows = [("Essentials", "$499", "50"), ("Professional", "$999", "250"), ("Enterprise", "$1,999", "Unlimited")]
    for i, (plan, price, ep) in enumerate(assess_rows):
        if i == 1:
            c.setFillColor(Color(0, 0.43, 0.71, alpha=0.08))
            c.rect(right_x, y - 2, right_w / 2 - 4, 12, fill=1, stroke=0)
            c.setFillColor(BLUE)
        else:
            c.setFillColor(HexColor('#333333'))
        c.setFont(FONT_BOLD if i == 1 else FONT, 8.5)
        c.drawString(cols[0], y, plan)
        c.setFillColor(HexColor('#333333'))
        c.setFont(FONT, 8.5)
        c.drawString(cols[1], y, price)
        c.drawString(cols[2], y, ep)
        y -= 11
    y -= 6

    # Pulse pricing mini-table
    draw_rounded_rect(c, right_x, y - 2, 30, 12, 3, fill=Color(0.96, 0.49, 0.3, alpha=0.12))
    c.setFillColor(ORANGE)
    c.setFont(FONT_BOLD, 7)
    c.drawString(right_x + 4, y, "PULSE")
    y -= 16

    c.setFillColor(DARK)
    c.rect(right_x, y, right_w / 2 - 4, 14, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 7.5)
    c.drawString(cols[0], y + 4, "Plan")
    c.drawString(cols[1], y + 4, "Monthly")
    c.drawString(cols[2], y + 4, "Scans/mo")
    y -= 12

    pulse_rows = [("Starter", "$299", "25"), ("Professional", "$799", "100"), ("Enterprise", "$1,499", "Unlimited")]
    for i, (plan, price, scans) in enumerate(pulse_rows):
        if i == 1:
            c.setFillColor(Color(0, 0.43, 0.71, alpha=0.08))
            c.rect(right_x, y - 2, right_w / 2 - 4, 12, fill=1, stroke=0)
            c.setFillColor(BLUE)
        else:
            c.setFillColor(HexColor('#333333'))
        c.setFont(FONT_BOLD if i == 1 else FONT, 8.5)
        c.drawString(cols[0], y, plan)
        c.setFillColor(HexColor('#333333'))
        c.setFont(FONT, 8.5)
        c.drawString(cols[1], y, price)
        c.drawString(cols[2], y, scans)
        y -= 11

    c.setFillColor(TEAL)
    c.setFont(FONT_BOLD, 7.5)
    c.drawString(right_x, y, "Annual plans save 17% \u2022 Bundle discounts available")
    y -= 14

    # Compliance & Attack Surface
    y = section_header(c, right_x, y, "Compliance & Coverage")

    compliance = ["HIPAA", "SOC 2", "PCI-DSS", "CJIS", "NIST CSF", "CIS", "GDPR", "HPH CPGs"]
    cx = right_x
    for i, label in enumerate(compliance):
        c.setFillColor(TEAL)
        c.setFont(FONT_BOLD, 9)
        c.drawString(cx, y, "\u2713")
        c.setFillColor(GREY)
        c.setFont(FONT, 8.5)
        c.drawString(cx + 10, y, label)
        cw = 10 + c.stringWidth(label, FONT, 8.5) + 12
        cx += cw
        if cx > right_x + right_w - 30:
            cx = right_x
            y -= 12
    y -= 14

    surfaces = ["Web Apps", "APIs/REST", "Network", "Cloud/AWS", "CMS", "DNS", "SSL/TLS", "OWASP"]
    cx = right_x
    for label in surfaces:
        c.setFillColor(ORANGE)
        c.setFont(FONT, 8)
        c.drawString(cx, y, "\u25cf")
        c.setFillColor(GREY)
        c.setFont(FONT, 8.5)
        c.drawString(cx + 9, y, label)
        cw = 9 + c.stringWidth(label, FONT, 8.5) + 10
        cx += cw
        if cx > right_x + right_w - 30:
            cx = right_x
            y -= 12
    y -= 14

    # ROI strip
    y = section_header(c, right_x, y, "Efficiency Gains")
    roi_items = [
        ("90%", "faster", "40h\u21924h pentest", BLUE),
        ("95%", "signal", "ML classifier", ORANGE),
        ("$15K", "saved", "5+ tools \u2192 1", TEAL),
    ]
    roi_w = (right_w - 12) / 3
    for i, (num, label, detail, color) in enumerate(roi_items):
        rx = right_x + i * (roi_w + 6)
        draw_rounded_rect(c, rx, y - 28, roi_w, 38, 5, fill=DARK)
        # top accent
        c.setFillColor(color)
        c.rect(rx, y + 8, roi_w, 2, fill=1, stroke=0)
        # number
        c.setFillColor(CHARTREUSE)
        c.setFont(FONT_BOLD, 14)
        c.drawCentredString(rx + roi_w / 2, y - 6, num)
        # label
        c.setFillColor(Color(1, 1, 1, alpha=0.45))
        c.setFont(FONT, 7)
        c.drawCentredString(rx + roi_w / 2, y - 18, detail)

    c.save()
    size_kb = os.path.getsize(PDF_PATH) / 1024
    print(f"PDF generated: {PDF_PATH} ({size_kb:.0f} KB)")


if __name__ == '__main__':
    build()
