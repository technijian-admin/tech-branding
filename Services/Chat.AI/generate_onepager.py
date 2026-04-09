"""
Chat.AI One-Pager — ReportLab PDF generation.
Full-bleed, pixel-perfect, single 8.5x11" page.
Uses entire page with no white margins showing.
"""

import os
import requests
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
W, H = letter  # 612 x 792 pts

# ── Brand Colors ──
BLUE       = HexColor('#006DB6')
BLUE_DARK  = HexColor('#004D80')
ORANGE     = HexColor('#F67D4B')
ORANGE_DK  = HexColor('#E5663A')
TEAL       = HexColor('#1EAAC8')
CHARTREUSE = HexColor('#CBDB2D')
DARK       = HexColor('#1A1A2E')
DARK2      = HexColor('#0A1628')
DARK3      = HexColor('#0D2847')
NEAR_BLACK = HexColor('#2D2D2D')
GREY       = HexColor('#59595B')
MED_GREY   = HexColor('#ADB5BD')
LIGHT_GREY = HexColor('#E9ECEF')
OFF_WHITE  = HexColor('#F8F9FA')
WHITE_C    = HexColor('#FFFFFF')

# ── Helpers ──

def draw_rect(c, x, y, w, h, color, radius=0):
    c.setFillColor(color)
    c.setStrokeColor(color)
    if radius:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=0)
    else:
        c.rect(x, y, w, h, fill=1, stroke=0)

def draw_card(c, x, y, w, h, radius=6, border_color=None, shadow=True):
    """Draw a white card with optional shadow and colored left border."""
    if shadow:
        c.setFillColor(Color(0, 0, 0, alpha=0.06))
        c.roundRect(x+1.5, y-1.5, w, h, radius, fill=1, stroke=0)
    c.setFillColor(WHITE_C)
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    if border_color:
        c.setFillColor(border_color)
        c.rect(x, y + 2, 3.5, h - 4, fill=1, stroke=0)

def text(c, x, y, txt, size=9, color=GREY, bold=False, font='Helvetica'):
    fname = f'{font}-Bold' if bold else font
    c.setFont(fname, size)
    c.setFillColor(color)
    c.drawString(x, y, txt)

def text_center(c, x, y, txt, size=9, color=GREY, bold=False):
    fname = 'Helvetica-Bold' if bold else 'Helvetica'
    c.setFont(fname, size)
    c.setFillColor(color)
    c.drawCentredString(x, y, txt)

def text_right(c, x, y, txt, size=9, color=GREY, bold=False):
    fname = 'Helvetica-Bold' if bold else 'Helvetica'
    c.setFont(fname, size)
    c.setFillColor(color)
    c.drawRightString(x, y, txt)

def draw_circle(c, x, y, r, color):
    c.setFillColor(color)
    c.circle(x, y, r, fill=1, stroke=0)

def draw_check(c, x, y, color=TEAL, size=9):
    c.setFont('Helvetica-Bold', size)
    c.setFillColor(color)
    c.drawString(x, y, '\u2713')

def draw_dot(c, x, y, color, r=3):
    c.setFillColor(color)
    c.circle(x, y, r, fill=1, stroke=0)

def wrap_text(c, x, y, txt, max_width, size=8, color=GREY, leading=10, bold=False):
    """Simple word-wrap text. Returns final y position."""
    fname = 'Helvetica-Bold' if bold else 'Helvetica'
    c.setFont(fname, size)
    c.setFillColor(color)
    words = txt.split()
    lines = []
    current = ''
    for w in words:
        test = f'{current} {w}'.strip()
        if c.stringWidth(test, fname, size) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def fetch_logo():
    try:
        resp = requests.get("https://technijian.com/wp-content/uploads/2023/08/Logo.jpg", timeout=5)
        if resp.status_code == 200:
            return BytesIO(resp.content)
    except:
        pass
    return None


def build():
    pdf_path = os.path.join(OUT_DIR, 'Chat.AI One-Pager.pdf')
    c = canvas.Canvas(pdf_path, pagesize=letter)
    c.setTitle('Technijian Chat.AI — One-Pager')
    c.setAuthor('Technijian')

    margin = 30      # inner content margin
    col_gap = 16     # gap between columns
    left_col_x = margin + 6
    right_col_x = W / 2 + col_gap / 2
    col_w = (W - 2 * margin - col_gap) / 2

    # ════════════════════════════════════════════
    # HERO STRIP — full bleed dark, top of page
    # ════════════════════════════════════════════
    hero_h = 100
    hero_y = H - hero_h

    # Dark background — full bleed
    draw_rect(c, 0, hero_y, W, hero_h, DARK)
    # Accent overlay rectangles for depth
    draw_rect(c, 0, hero_y, W * 0.4, hero_h, DARK2)
    c.setFillColor(Color(0.05, 0.1, 0.18, alpha=0.5))
    c.rect(W * 0.7, hero_y, W * 0.3, hero_h, fill=1, stroke=0)

    # Decorative glows
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.1))
    c.circle(W - 60, H - 20, 80, fill=1, stroke=0)
    c.setFillColor(Color(0.96, 0.49, 0.29, alpha=0.07))
    c.circle(180, hero_y + 10, 60, fill=1, stroke=0)

    # Orange accent line at bottom of hero
    draw_rect(c, 0, hero_y, W, 3, ORANGE)

    # Logo
    logo_data = fetch_logo()
    if logo_data:
        from reportlab.lib.utils import ImageReader
        logo = ImageReader(logo_data)
        logo_s = 36  # 1:1 square logo — preserve aspect ratio
        c.drawImage(logo, margin + 4, hero_y + 56, width=logo_s, height=logo_s, mask='auto')

    # Title — offset right of square logo
    title_x = margin + 46
    text(c, title_x, hero_y + 28, 'Technijian', size=22, color=WHITE_C, bold=True)
    text(c, title_x + c.stringWidth('Technijian ', 'Helvetica-Bold', 22), hero_y + 28,
         'Chat.AI', size=22, color=ORANGE, bold=True)

    # Badge
    badge_x = title_x + c.stringWidth('Technijian Chat.AI  ', 'Helvetica-Bold', 22) + 10
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.15))
    c.roundRect(badge_x, hero_y + 28, 130, 18, 9, fill=1, stroke=0)
    c.setStrokeColor(Color(0.12, 0.67, 0.78, alpha=0.4))
    c.setLineWidth(0.5)
    c.roundRect(badge_x, hero_y + 28, 130, 18, 9, fill=0, stroke=1)
    text(c, badge_x + 8, hero_y + 32, 'ENTERPRISE AI PLATFORM', size=6.5, color=TEAL, bold=True)

    # Stats — right side of hero
    stats = [('4+', 'AI Providers'), ('32+', 'Endpoints'), ('>60%', 'Win Rate'), ('99.9%', 'SLA')]
    sx = W - margin - 8
    for num, lbl in reversed(stats):
        nw = c.stringWidth(num, 'Helvetica-Bold', 16)
        lw = c.stringWidth(lbl, 'Helvetica', 7)
        total_w = nw + 4 + lw
        sx -= total_w
        text(c, sx, hero_y + 37, num, size=16, color=ORANGE, bold=True)
        text(c, sx + nw + 4, hero_y + 40, lbl, size=7, color=Color(1, 1, 1, alpha=0.5))
        # Divider dot
        if lbl != 'AI Providers':
            sx -= 16
            draw_dot(c, sx + 6, hero_y + 43, Color(1, 1, 1, alpha=0.2), 1.5)

    # ════════════════════════════════════════════
    # VALUE PROP BAR — full bleed blue
    # ════════════════════════════════════════════
    vp_h = 26
    vp_y = hero_y - vp_h
    draw_rect(c, 0, vp_y, W, vp_h, BLUE)
    # Subtle gradient overlay
    c.setFillColor(Color(0, 0.2, 0.4, alpha=0.25))
    c.rect(W * 0.6, vp_y, W * 0.4, vp_h, fill=1, stroke=0)

    text_center(c, W / 2, vp_y + 8,
                'Secure, multi-model AI with collective intelligence, workflow automation, and enterprise governance.',
                size=8.5, color=WHITE_C, bold=True)

    # ════════════════════════════════════════════
    # MAIN CONTENT — two columns
    # ════════════════════════════════════════════
    content_top = vp_y - 10
    cta_h = 28
    footer_h = 18
    content_bottom = cta_h + footer_h + 6

    # ── LEFT COLUMN ──
    y = content_top

    # Section: KEY CAPABILITIES
    text(c, left_col_x, y, 'KEY CAPABILITIES', size=9, color=BLUE, bold=True)
    draw_rect(c, left_col_x, y - 2, 95, 1.5, BLUE)
    y -= 16

    cap_groups = [
        ('Multi-Model AI', BLUE, [
            'GPT-4o, Claude, Gemini + more \u2014 switch mid-chat',
            'Streaming responses with file analysis',
            'Thread sharing with permissions & export',
        ]),
        ('AI Council (Patent Pending)', ORANGE, [
            '3-stage: Diverge \u2192 Converge \u2192 Synthesize',
            '3+ models per query, anonymized review',
            '>30% hallucination reduction vs single model',
        ]),
        ('Workflow & Knowledge', TEAL, [
            'N8N workflows triggered from chat context',
            'RAG with Weaviate / Pinecone / Chroma',
            'Custom assistants with REST/GraphQL connectors',
        ]),
    ]

    for title, color, items in cap_groups:
        # Colored mini-bar
        draw_rect(c, left_col_x, y + 1, 3, 10, color)
        text(c, left_col_x + 8, y, title, size=8, color=DARK, bold=True)
        y -= 12
        for item in items:
            draw_check(c, left_col_x + 8, y, TEAL, 7)
            text(c, left_col_x + 18, y, item, size=7, color=GREY)
            y -= 10
        y -= 5

    # Section: HOW IT WORKS
    y -= 4
    text(c, left_col_x, y, 'HOW IT WORKS', size=9, color=BLUE, bold=True)
    draw_rect(c, left_col_x, y - 2, 80, 1.5, BLUE)
    y -= 18

    steps = [
        ('Deploy', 'Set up your tenant with Azure AD SSO in minutes'),
        ('Configure', 'Choose AI models, set budgets, create assistants'),
        ('Scale', 'Add users, workflows, and integrations as you grow'),
    ]
    for i, (title, desc) in enumerate(steps, 1):
        # Orange circle with number
        cx = left_col_x + 9
        cy = y + 4
        draw_circle(c, cx, cy, 8, ORANGE)
        text_center(c, cx, cy - 3, str(i), size=8, color=WHITE_C, bold=True)
        text(c, left_col_x + 22, y + 2, title, size=8, color=DARK, bold=True)
        tw = c.stringWidth(title + '  ', 'Helvetica-Bold', 8)
        text(c, left_col_x + 22 + tw, y + 2, f'\u2014 {desc}', size=7, color=GREY)
        y -= 20

    # Section: COMPETITIVE SNAPSHOT
    y -= 6
    text(c, left_col_x, y, 'VS. COMPETITORS', size=9, color=BLUE, bold=True)
    draw_rect(c, left_col_x, y - 2, 95, 1.5, BLUE)
    y -= 14

    comp_rows = [
        ('Multi-model AI',      '\u2014', '\u2014', '\u2713'),
        ('AI Council',          '\u2014', '\u2014', '\u2713'),
        ('Per-call cost track', '\u2014', '\u2014', '\u2713'),
        ('On-premise deploy',   '\u2014', '\u2014', '\u2713'),
        ('Budget alerts',       '\u2014', '\u2014', '\u2713'),
    ]

    # Mini header
    comp_x = left_col_x + 4
    comp_cols = [comp_x + 108, comp_x + 145, comp_x + 182, comp_x + 218]
    draw_rect(c, comp_x - 2, y - 1, col_w - 12, 11, DARK)
    text(c, comp_x + 2, y, 'Capability', size=6, color=WHITE_C, bold=True)
    text_center(c, comp_cols[0], y, 'GPT', size=6, color=WHITE_C, bold=True)
    text_center(c, comp_cols[1], y, 'Copilot', size=6, color=WHITE_C, bold=True)
    text_center(c, comp_cols[2], y, 'Gemini', size=6, color=WHITE_C, bold=True)
    # Highlight column header
    draw_rect(c, comp_cols[3] - 18, y - 1, 36, 11, BLUE)
    text_center(c, comp_cols[3], y, 'Chat.AI', size=6, color=WHITE_C, bold=True)
    y -= 11

    for cap, gpt, cop, chatai in comp_rows:
        # Alternating row bg
        text(c, comp_x + 2, y, cap, size=6, color=DARK)
        text_center(c, comp_cols[0], y, gpt, size=6, color=MED_GREY)
        text_center(c, comp_cols[1], y, cop, size=6, color=MED_GREY)
        text_center(c, comp_cols[2], y, cop if cop == '\u2014' else cop, size=6, color=MED_GREY)
        # Highlight
        draw_rect(c, comp_cols[3] - 18, y - 1, 36, 10, Color(0, 0.43, 0.71, alpha=0.06))
        text_center(c, comp_cols[3], y, chatai, size=7, color=TEAL, bold=True)
        y -= 10

    # ── RIGHT COLUMN ──
    y2 = content_top

    # Section: WHY CHAT.AI
    text(c, right_col_x, y2, 'WHY CHAT.AI', size=9, color=BLUE, bold=True)
    draw_rect(c, right_col_x, y2 - 2, 72, 1.5, BLUE)
    y2 -= 16

    diffs = [
        (BLUE,       'Multi-provider',    'No vendor lock-in \u2014 OpenAI, Anthropic, Google, Azure'),
        (ORANGE,     'Cost control',       'Token-level metering with prepaid budgets & alerts'),
        (TEAL,       'Enterprise security','Row-level isolation, full audit trail, HIPAA/SOC 2'),
        (DARK,       'On-premise option',  'Deploy in your infrastructure for data sovereignty'),
        (CHARTREUSE, 'Council consensus',  'Patent-pending multi-agent deliberation (>60% win rate)'),
    ]

    for color, title, desc in diffs:
        draw_dot(c, right_col_x + 4, y2 + 3, color, 3.5)
        text(c, right_col_x + 12, y2, title, size=8, color=DARK, bold=True)
        y2 -= 10
        y2 = wrap_text(c, right_col_x + 12, y2, desc, col_w - 20, size=7, color=GREY, leading=9)
        y2 -= 6

    # Section: PRICING
    y2 -= 4
    text(c, right_col_x, y2, 'PRICING AT-A-GLANCE', size=9, color=BLUE, bold=True)
    draw_rect(c, right_col_x, y2 - 2, 118, 1.5, BLUE)
    y2 -= 14

    # Table header
    px = right_col_x
    pw = col_w - 4
    pc1 = px + 4
    pc2 = px + pw * 0.45
    pc3 = px + pw * 0.72

    draw_rect(c, px, y2 - 1, pw, 13, DARK)
    text(c, pc1, y2 + 1, 'Plan', size=7, color=WHITE_C, bold=True)
    text(c, pc2, y2 + 1, 'Monthly', size=7, color=WHITE_C, bold=True)
    text(c, pc3, y2 + 1, 'Users', size=7, color=WHITE_C, bold=True)
    y2 -= 14

    pricing = [
        ('Starter', '$299/mo', '10', False),
        ('Growth', '$899/mo', '50', False),
        ('Professional', '$1,699/mo', '100', True),
        ('Enterprise', 'Custom', '250+', False),
    ]
    for plan, price, users, is_pop in pricing:
        if is_pop:
            draw_rect(c, px, y2 - 2, pw, 13, Color(0, 0.43, 0.71, alpha=0.08))
            draw_rect(c, px, y2 - 2, 3, 13, BLUE)
        text(c, pc1, y2, plan, size=7.5, color=BLUE if is_pop else DARK, bold=is_pop)
        text(c, pc2, y2, price, size=7.5, color=DARK, bold=is_pop)
        text(c, pc3, y2, users, size=7.5, color=DARK)
        if is_pop:
            text(c, pc3 + 22, y2, '\u2605', size=7, color=ORANGE, bold=True)
        y2 -= 13
    text(c, px + 4, y2, 'Annual plans save 17%  \u2022  No per-seat pricing', size=6, color=TEAL, bold=True)
    y2 -= 16

    # Section: SECURITY
    text(c, right_col_x, y2, 'SECURITY & COMPLIANCE', size=9, color=BLUE, bold=True)
    draw_rect(c, right_col_x, y2 - 2, 130, 1.5, BLUE)
    y2 -= 14

    badges = [
        ('\u2713 Azure AD SSO', '\u2713 Row-Level Security'),
        ('\u2713 Full Audit Trail', '\u2713 Azure Key Vault'),
        ('\u2713 HIPAA / SOC 2 Ready', '\u2713 RBAC Roles'),
        ('\u2713 Prompt Injection Defense', '\u2713 Rate Limiting'),
    ]
    for b1, b2 in badges:
        draw_check(c, right_col_x + 2, y2, TEAL, 7)
        text(c, right_col_x + 12, y2, b1[2:], size=7, color=GREY)  # skip checkmark prefix
        draw_check(c, right_col_x + col_w / 2 + 2, y2, TEAL, 7)
        text(c, right_col_x + col_w / 2 + 12, y2, b2[2:], size=7, color=GREY)
        y2 -= 11

    # Section: ROI HIGHLIGHT
    y2 -= 6
    text(c, right_col_x, y2, 'SAVINGS SNAPSHOT', size=9, color=BLUE, bold=True)
    draw_rect(c, right_col_x, y2 - 2, 108, 1.5, BLUE)
    y2 -= 14

    # Mini ROI cards
    roi = [
        ('10 users', '$389 \u2192 $299', '$1,080/yr', BLUE),
        ('50 users', '$2,500 \u2192 $899', '$19,212/yr', ORANGE),
        ('250 users', '$18,500 \u2192 $3,999', '$174,012/yr', TEAL),
    ]
    roi_card_w = (col_w - 12) / 3
    for i, (label, cost, savings, color) in enumerate(roi):
        rx = right_col_x + i * (roi_card_w + 6)
        # Card bg
        draw_rect(c, rx, y2 - 32, roi_card_w, 44, Color(0.1, 0.1, 0.18, alpha=1))
        draw_rect(c, rx, y2 + 10, roi_card_w, 2, color)
        text_center(c, rx + roi_card_w / 2, y2 + 2, label, size=6, color=Color(1, 1, 1, alpha=0.5))
        text_center(c, rx + roi_card_w / 2, y2 - 8, cost, size=6, color=Color(1, 1, 1, alpha=0.7))
        text_center(c, rx + roi_card_w / 2, y2 - 22, savings, size=8, color=CHARTREUSE, bold=True)

    # ════════════════════════════════════════════
    # CTA BAR — full bleed blue
    # ════════════════════════════════════════════
    cta_y = footer_h
    draw_rect(c, 0, cta_y, W, cta_h, BLUE)
    c.setFillColor(Color(0, 0.2, 0.4, alpha=0.3))
    c.rect(W * 0.65, cta_y, W * 0.35, cta_h, fill=1, stroke=0)

    text_center(c, W / 2, cta_y + 11,
                'Ready to see Chat.AI in action?   Schedule a demo:  RJain@technijian.com  |  949.379.8500',
                size=8.5, color=WHITE_C, bold=True)

    # ════════════════════════════════════════════
    # FOOTER — full bleed dark
    # ════════════════════════════════════════════
    draw_rect(c, 0, 0, W, footer_h, NEAR_BLACK)
    text_center(c, W / 2, 5,
                '\u00A9 2026 Technijian  \u2022  18 Technology Dr. Ste 141, Irvine CA 92618  \u2022  technijian.com',
                size=6.5, color=Color(1, 1, 1, alpha=0.4))

    # ════════════════════════════════════════════
    # DECORATIVE ELEMENTS
    # ════════════════════════════════════════════
    # Thin teal accent line separating content from CTA
    draw_rect(c, 0, cta_y + cta_h, W, 1.5, TEAL)

    # Thin orange line at top of hero
    draw_rect(c, 0, H - 2, W, 2, ORANGE)

    # Column divider — subtle dotted line
    c.setStrokeColor(Color(0, 0, 0, alpha=0.08))
    c.setLineWidth(0.5)
    c.setDash(2, 3)
    c.line(W / 2, content_bottom + 10, W / 2, content_top + 5)
    c.setDash()

    c.save()
    print(f"  PDF: {pdf_path}")
    return pdf_path


def main():
    print("Building Chat.AI One-Pager (ReportLab)...")
    build()
    print("Done!")

if __name__ == '__main__':
    main()
