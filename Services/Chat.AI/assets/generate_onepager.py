"""
Chat.AI One-Pager — ReportLab direct PDF generation.
Produces a pixel-perfect single-page US Letter PDF with full Technijian branding.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

W, H = letter  # 612 x 792 points

# Brand colors
BLUE = HexColor('#006DB6')
BLUE_DARK = HexColor('#004d80')
ORANGE = HexColor('#F67D4B')
TEAL = HexColor('#1EAAC8')
CHARTREUSE = HexColor('#CBDB2D')
DARK = HexColor('#1A1A2E')
NEAR_BLACK = HexColor('#2D2D2D')
GREY = HexColor('#59595B')
LIGHT_GREY = HexColor('#E9ECEF')
OFF_WHITE = HexColor('#F8F9FA')
WHITE = HexColor('#FFFFFF')

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(OUT_DIR, 'Chat.AI One-Pager.pdf')

# Try to register Open Sans, fall back to Helvetica
FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'
try:
    # Common Windows path for Open Sans
    font_dir = os.path.expanduser('~/AppData/Local/Microsoft/Windows/Fonts')
    if os.path.exists(os.path.join(font_dir, 'OpenSans-Regular.ttf')):
        pdfmetrics.registerFont(TTFont('OpenSans', os.path.join(font_dir, 'OpenSans-Regular.ttf')))
        pdfmetrics.registerFont(TTFont('OpenSans-Bold', os.path.join(font_dir, 'OpenSans-Bold.ttf')))
        pdfmetrics.registerFont(TTFont('OpenSans-SemiBold', os.path.join(font_dir, 'OpenSans-SemiBold.ttf')))
        pdfmetrics.registerFont(TTFont('OpenSans-Light', os.path.join(font_dir, 'OpenSans-Light.ttf')))
        FONT = 'OpenSans'
        FONT_BOLD = 'OpenSans-Bold'
except Exception:
    pass


def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_width=0.5):
    """Draw a rounded rectangle."""
    c.saveState()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
    p = c.beginPath()
    p.roundRect(x, y, w, h, r)
    if fill_color and stroke_color:
        c.drawPath(p, fill=1, stroke=1)
    elif fill_color:
        c.drawPath(p, fill=1, stroke=0)
    else:
        c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def draw_check(c, x, y, color=TEAL, size=8):
    """Draw a teal check mark."""
    c.saveState()
    c.setFillColor(color)
    c.setFont(FONT_BOLD, size)
    c.drawString(x, y, '\u2713')
    c.restoreState()


def draw_circle(c, x, y, r, fill_color):
    """Draw a filled circle."""
    c.saveState()
    c.setFillColor(fill_color)
    c.circle(x, y, r, fill=1, stroke=0)
    c.restoreState()


def build():
    c = canvas.Canvas(PDF_PATH, pagesize=letter)
    c.setTitle("Technijian Chat.AI — One-Pager")
    c.setAuthor("Technijian")

    # ── HERO STRIP (y: 720-792) ──
    hero_top = H
    hero_h = 72
    hero_bot = hero_top - hero_h

    # Dark gradient background (simulated with layers)
    c.setFillColor(DARK)
    c.rect(0, hero_bot, W, hero_h, fill=1, stroke=0)
    # Subtle teal glow top-right
    c.saveState()
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.12))
    c.circle(W - 30, hero_top - 10, 80, fill=1, stroke=0)
    c.restoreState()
    # Subtle orange glow bottom-left
    c.saveState()
    c.setFillColor(Color(0.96, 0.49, 0.29, alpha=0.08))
    c.circle(W * 0.2, hero_bot + 10, 60, fill=1, stroke=0)
    c.restoreState()

    # Badge pill
    badge_text = "ENTERPRISE AI PLATFORM"
    c.saveState()
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.20))
    c.setStrokeColor(Color(0.12, 0.67, 0.78, alpha=0.45))
    c.setLineWidth(0.5)
    bx, by, bw, bh = 28, hero_bot + 44, 130, 14
    p = c.beginPath()
    p.roundRect(bx, by, bw, bh, 7)
    c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont(FONT_BOLD, 6)
    c.drawString(bx + 8, by + 4, badge_text)
    c.restoreState()

    # Title
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 20)
    c.drawString(28, hero_bot + 16, "Technijian")
    title_x = 28 + c.stringWidth("Technijian ", FONT_BOLD, 20)
    c.setFillColor(ORANGE)
    c.drawString(title_x, hero_bot + 16, "Chat.AI")

    # Hero stats (right side)
    stats = [("4+", "AI Providers"), ("32+", "Endpoints"), (">60%", "Council Win Rate"), ("99.9%", "Uptime SLA")]
    stat_x = W - 28
    for i, (num, label) in enumerate(reversed(stats)):
        sx = stat_x - (i * 90)
        c.setFillColor(ORANGE)
        c.setFont(FONT_BOLD, 18)
        nw = c.stringWidth(num, FONT_BOLD, 18)
        c.drawString(sx - nw, hero_bot + 30, num)
        c.setFillColor(Color(1, 1, 1, alpha=0.50))
        c.setFont(FONT, 7)
        lw = c.stringWidth(label, FONT, 7)
        c.drawString(sx - lw, hero_bot + 18, label)
        # Separator line
        if i < len(stats) - 1:
            c.setStrokeColor(Color(1, 1, 1, alpha=0.12))
            c.setLineWidth(0.5)
            c.line(sx - nw - 12, hero_bot + 18, sx - nw - 12, hero_bot + 48)

    # ── ORANGE ACCENT LINE ──
    accent_y = hero_bot - 2.5
    c.setFillColor(ORANGE)
    c.rect(0, accent_y, W * 0.5, 2.5, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(W * 0.5, accent_y, W * 0.5, 2.5, fill=1, stroke=0)

    # ── VALUE PROP BAR (y: 693-717) ──
    vp_h = 24
    vp_bot = accent_y - vp_h
    c.setFillColor(BLUE)
    c.rect(0, vp_bot, W, vp_h, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD if 'SemiBold' not in FONT else FONT.replace('Bold', 'SemiBold'), 9.5)
    vp_text = "Secure, multi-model AI with collective intelligence, workflow automation, and enterprise governance \u2014 all in one platform."
    tw = c.stringWidth(vp_text, FONT_BOLD, 9.5)
    c.setFont(FONT_BOLD, 9.5)
    c.drawString((W - tw) / 2, vp_bot + 8, vp_text)

    # ── MAIN BODY — TWO COLUMNS ──
    body_top = vp_bot - 10
    left_x = 24
    left_w = 276
    right_x = 312
    right_w = 276
    col_bottom = 56  # space for CTA + footer

    # ═══ LEFT COLUMN ═══
    y = body_top

    # Section: KEY CAPABILITIES
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(left_x, y, "KEY CAPABILITIES")
    y -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(left_x, y, left_x + left_w, y)
    y -= 12

    capabilities = [
        ("Multi-Model AI", BLUE, [
            "GPT-4o, Claude Sonnet, Gemini Pro, Llama, and more",
            "Switch models mid-conversation or auto-route by task",
            "Streaming responses with file attachments & code analysis",
            "Thread sharing with permissions, export & full history",
        ]),
        ("AI Council (Patent Pending)", ORANGE, [
            "3-stage deliberation: Diverge \u2192 Converge \u2192 Synthesize",
            "3+ models per query with anonymized peer review",
            ">60% win rate vs single models across benchmarks",
            ">30% hallucination reduction through cross-validation",
        ]),
        ("Custom Assistants & Projects", TEAL, [
            "Purpose-built AI assistants with custom system prompts",
            "REST, GraphQL, and direct database connector integrations",
            "Project workspaces with inherited context & team sharing",
            "Template marketplace for rapid assistant deployment",
        ]),
        ("Workflow & Knowledge", DARK, [
            "N8N workflow automation triggered from chat context",
            "RAG with Weaviate, Pinecone, or Chroma vector stores",
            "File vectorization, semantic search & persistent org memory",
            "Knowledge base auto-sync with SharePoint & Google Drive",
        ]),
    ]

    for cat_name, cat_color, items in capabilities:
        # Color bar + category title
        c.setFillColor(cat_color)
        c.rect(left_x, y - 9, 3, 10, fill=1, stroke=0)
        c.setFont(FONT_BOLD, 10)
        c.drawString(left_x + 7, y - 8, cat_name)
        y -= 14

        for item in items:
            draw_check(c, left_x + 4, y - 8, TEAL, 8)
            c.setFillColor(HexColor('#444444'))
            c.setFont(FONT, 8.5)
            c.drawString(left_x + 16, y - 8, item)
            y -= 11
        y -= 4

    # Section: HOW IT WORKS
    y -= 4
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(left_x, y, "HOW IT WORKS")
    y -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(left_x, y, left_x + left_w, y)
    y -= 14

    steps = [
        ("1", "Deploy", "Provision your tenant with Azure AD SSO in under 15 minutes"),
        ("2", "Configure", "Choose AI models, set per-user token budgets, create custom assistants"),
        ("3", "Scale", "Add users, workflows, knowledge bases & integrations as you grow"),
    ]
    for num, title, desc in steps:
        # Orange circle with number
        draw_circle(c, left_x + 8, y - 4, 7, ORANGE)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 8)
        c.drawCentredString(left_x + 8, y - 7, num)
        # Bold title + description
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 9)
        c.drawString(left_x + 22, y - 7, title)
        tw = c.stringWidth(title, FONT_BOLD, 9)
        c.setFillColor(GREY)
        c.setFont(FONT, 9)
        c.drawString(left_x + 22 + tw + 4, y - 7, "\u2014 " + desc)
        y -= 16

    # Section: VS. COMPETITORS
    y -= 6
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(left_x, y, "VS. COMPETITORS")
    y -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(left_x, y, left_x + left_w, y)
    y -= 4

    # Comparison table
    tbl_x = left_x
    tbl_w = left_w
    col_widths = [90, 42, 42, 42, 60]
    headers = ["Capability", "ChatGPT", "Copilot", "Gemini", "Chat.AI"]
    rows = [
        ["Multi-Model", "\u2014", "\u2014", "\u2014", "\u2713 4+"],
        ["AI Council", "\u2014", "\u2014", "\u2014", "\u2713"],
        ["Cost Tracking", "\u2014", "\u2014", "\u2014", "\u2713"],
        ["On-Premise", "\u2014", "\u2014", "\u2014", "\u2713"],
        ["Audit Trail", "\u2014", "Limited", "Limited", "\u2713 Full"],
        ["Automation", "\u2014", "\u2014", "\u2014", "\u2713 N8N"],
        ["50 Users/mo", "$1,250", "$1,500", "$1,000", "$899"],
    ]

    row_h = 11
    # Header row
    cx = tbl_x
    for i, (hdr, cw) in enumerate(zip(headers, col_widths)):
        if i == len(headers) - 1:
            c.setFillColor(BLUE)
        else:
            c.setFillColor(DARK)
        c.rect(cx, y - row_h, cw, row_h, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 7)
        c.drawString(cx + 3, y - row_h + 3, hdr)
        cx += cw
    y -= row_h

    # Data rows
    for ri, row in enumerate(rows):
        cx = tbl_x
        for ci, (cell, cw) in enumerate(zip(row, col_widths)):
            # Alternating row bg
            if ri % 2 == 0:
                c.setFillColor(OFF_WHITE)
            else:
                c.setFillColor(WHITE)
            if ci == len(row) - 1:
                c.setFillColor(Color(0, 0.43, 0.71, alpha=0.05) if ri % 2 == 0 else Color(0, 0.43, 0.71, alpha=0.03))
            c.rect(cx, y - row_h, cw, row_h, fill=1, stroke=0)

            # Cell text
            if ci == len(row) - 1 and '\u2713' in cell:
                c.setFillColor(TEAL)
                c.setFont(FONT_BOLD, 7.5)
            elif cell == "\u2014":
                c.setFillColor(HexColor('#BBBBBB'))
                c.setFont(FONT, 7.5)
            elif ci == len(row) - 1:
                c.setFillColor(BLUE)
                c.setFont(FONT_BOLD, 7.5)
            else:
                c.setFillColor(GREY)
                c.setFont(FONT, 7.5)
            c.drawString(cx + 3, y - row_h + 3, cell)
            cx += cw
        y -= row_h

    # ═══ RIGHT COLUMN ═══
    y_r = body_top

    # Section: WHY CHAT.AI
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(right_x, y_r, "WHY CHAT.AI")
    y_r -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(right_x, y_r, right_x + right_w, y_r)
    y_r -= 14

    differentiators = [
        (BLUE, "Multi-Provider Freedom:", "No vendor lock-in \u2014 OpenAI, Anthropic, Google, Azure, open-source with automatic failover"),
        (ORANGE, "Granular Cost Control:", "Token-level metering per model, prepaid budgets with 75%/100% alerts, full billing attribution"),
        (TEAL, "Enterprise Security:", "Row-level tenant isolation, full audit trail, prompt injection defense, HIPAA/SOC 2 ready"),
        (DARK, "On-Premise Option:", "Deploy the full stack in your infrastructure for complete data sovereignty ($45K/yr)"),
        (CHARTREUSE, "Council Consensus:", "Patent-pending multi-agent deliberation achieves >60% win rate & >30% fewer hallucinations"),
        (BLUE, "Workflow Automation:", "Trigger N8N workflows from chat, connect to any API, and build custom AI-powered pipelines"),
    ]

    for dot_color, title, desc in differentiators:
        draw_circle(c, right_x + 4, y_r - 4, 3.5, dot_color)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 9)
        c.drawString(right_x + 14, y_r - 7, title)
        tw = c.stringWidth(title, FONT_BOLD, 9)
        c.setFillColor(GREY)
        c.setFont(FONT, 8.5)
        # Wrap text if needed
        remaining = desc
        line_x = right_x + 14 + tw + 3
        avail = right_x + right_w - line_x
        if c.stringWidth(remaining, FONT, 8.5) > avail:
            # Split at word boundary
            words = remaining.split()
            line1 = ""
            for w in words:
                test = line1 + (" " if line1 else "") + w
                if c.stringWidth(test, FONT, 8.5) > avail:
                    break
                line1 = test
            c.drawString(line_x, y_r - 7, line1)
            y_r -= 10
            remainder = remaining[len(line1):].strip()
            c.drawString(right_x + 14, y_r - 7, remainder)
        else:
            c.drawString(line_x, y_r - 7, remaining)
        y_r -= 14

    # Section: PRICING AT-A-GLANCE
    y_r -= 4
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(right_x, y_r, "PRICING AT-A-GLANCE")
    y_r -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(right_x, y_r, right_x + right_w, y_r)
    y_r -= 4

    # Pricing table
    p_cols = [70, 50, 50, 40, 50]
    p_headers = ["Plan", "Monthly", "Annual", "Users", "Tokens"]
    p_rows = [
        ["Starter", "$299", "$2,990", "10", "10M"],
        ["Growth", "$899", "$8,990", "50", "35M"],
        ["Professional", "$1,699", "$16,990", "100", "75M"],
        ["Enterprise", "Custom", "Custom", "250+", "200M+"],
    ]
    highlight_row = 2  # Professional

    # Header
    px = right_x
    for hdr, cw in zip(p_headers, p_cols):
        c.setFillColor(DARK)
        c.rect(px, y_r - row_h, cw, row_h, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 7)
        c.drawString(px + 3, y_r - row_h + 3, hdr)
        px += cw
    y_r -= row_h

    # Data rows
    for ri, row in enumerate(p_rows):
        px = right_x
        for ci, (cell, cw) in enumerate(zip(row, p_cols)):
            if ri == highlight_row:
                c.setFillColor(HexColor('#E6F0FA'))
            elif ri % 2 == 0:
                c.setFillColor(OFF_WHITE)
            else:
                c.setFillColor(WHITE)
            c.rect(px, y_r - row_h, cw, row_h, fill=1, stroke=0)

            if ri == highlight_row:
                c.setFillColor(BLUE if ci == 0 else DARK)
                c.setFont(FONT_BOLD, 8)
            else:
                c.setFillColor(GREY)
                c.setFont(FONT, 8)
            c.drawString(px + 3, y_r - row_h + 3, cell)
            px += cw
        y_r -= row_h

    # Pricing note
    c.setFillColor(TEAL)
    c.setFont(FONT_BOLD, 7)
    y_r -= 4
    c.drawString(right_x, y_r, "Annual plans save 17%  \u2022  No per-seat pricing  \u2022  Professional includes AI Council")

    # Section: SECURITY & COMPLIANCE
    y_r -= 16
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(right_x, y_r, "SECURITY & COMPLIANCE")
    y_r -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(right_x, y_r, right_x + right_w, y_r)
    y_r -= 12

    badges = [
        "Azure AD SSO", "Row-Level Security", "Full Audit Trail", "Azure Key Vault",
        "Prompt Injection Defense", "HIPAA / SOC 2 Ready", "RBAC Role Management", "Rate Limiting",
    ]
    bx = right_x
    for i, badge in enumerate(badges):
        draw_check(c, bx, y_r - 2, TEAL, 8)
        c.setFillColor(GREY)
        c.setFont(FONT, 8)
        c.drawString(bx + 11, y_r - 2, badge)
        bw = 11 + c.stringWidth(badge, FONT, 8) + 14
        bx += bw
        if bx > right_x + right_w - 40:
            bx = right_x
            y_r -= 12

    # Section: SAVINGS SNAPSHOT
    y_r -= 16
    c.setFillColor(BLUE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(right_x, y_r, "SAVINGS SNAPSHOT")
    y_r -= 3
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(1.5)
    c.line(right_x, y_r, right_x + right_w, y_r)
    y_r -= 8

    # ROI cards
    roi_data = [
        ("10 Users", "$389 \u2192 $299/mo", "$1,080/yr", BLUE),
        ("50 Users", "$2,500 \u2192 $899/mo", "$19,212/yr", ORANGE),
        ("250 Users", "$18.5K \u2192 $3,999/mo", "$174,012/yr", TEAL),
    ]
    card_w = 86
    card_h = 48
    card_gap = 6
    for i, (label, cost, save, accent_color) in enumerate(roi_data):
        cx = right_x + i * (card_w + card_gap)
        # Card background
        draw_rounded_rect(c, cx, y_r - card_h, card_w, card_h, 4, fill_color=DARK)
        # Top accent bar
        c.setFillColor(accent_color)
        c.rect(cx, y_r - 2, card_w, 2, fill=1, stroke=0)
        # Label
        c.setFillColor(Color(1, 1, 1, alpha=0.55))
        c.setFont(FONT, 7)
        lw = c.stringWidth(label, FONT, 7)
        c.drawString(cx + (card_w - lw) / 2, y_r - 14, label)
        # Cost
        c.setFillColor(Color(1, 1, 1, alpha=0.60))
        c.setFont(FONT, 6.5)
        cw_t = c.stringWidth(cost, FONT, 6.5)
        c.drawString(cx + (card_w - cw_t) / 2, y_r - 24, cost)
        # Savings
        c.setFillColor(CHARTREUSE)
        c.setFont(FONT_BOLD, 12)
        sw = c.stringWidth(save, FONT_BOLD, 12)
        c.drawString(cx + (card_w - sw) / 2, y_r - 40, save)

    # ── CTA BAR ──
    cta_h = 26
    cta_bot = 26
    # Blue gradient (simulated)
    c.setFillColor(BLUE)
    c.rect(0, cta_bot, W, cta_h, fill=1, stroke=0)
    c.setFillColor(Color(0, 0.2, 0.4, alpha=0.3))
    c.rect(W * 0.6, cta_bot, W * 0.4, cta_h, fill=1, stroke=0)
    # CTA text
    c.setFillColor(WHITE)
    c.setFont(FONT, 9)
    cta_text = "Ready to see Chat.AI in action?"
    c.drawString(28, cta_bot + 9, cta_text)
    cx_after = 28 + c.stringWidth(cta_text, FONT, 9) + 8
    c.setFillColor(ORANGE)
    c.setFont(FONT_BOLD, 9)
    c.drawString(cx_after, cta_bot + 9, "Schedule a Demo")
    cx_after += c.stringWidth("Schedule a Demo", FONT_BOLD, 9) + 8
    c.setFillColor(WHITE)
    c.setFont(FONT, 9)
    c.drawString(cx_after, cta_bot + 9, "|  RJain@technijian.com  |  949.379.8500")

    # ── FOOTER ──
    c.setFillColor(NEAR_BLACK)
    c.rect(0, 0, W, cta_bot, fill=1, stroke=0)
    c.setFillColor(Color(1, 1, 1, alpha=0.38))
    c.setFont(FONT, 6)
    foot = "\u00a9 2026 Technijian  \u2022  18 Technology Dr. Ste 141, Irvine CA 92618  \u2022  technijian.com"
    fw = c.stringWidth(foot, FONT, 6)
    c.drawString((W - fw) / 2, 10, foot)

    c.save()
    size_kb = os.path.getsize(PDF_PATH) / 1024
    print(f"PDF generated: {PDF_PATH} ({size_kb:.0f} KB)")


if __name__ == '__main__':
    build()
