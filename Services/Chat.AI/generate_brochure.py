"""
Chat.AI Brochure — ReportLab PDF generation.
Full-bleed, 8-page premium marketing brochure.
Vector graphics, precise positioning, gradients, tiny file size.
"""

import os
import requests
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

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
MUTED      = Color(0.63, 0.63, 0.67, 1)
DIM        = Color(0.53, 0.53, 0.56, 1)

# ── Content margins ──
ML = 36   # left margin
MR = 36   # right margin
CW = W - ML - MR  # content width

# ── Helpers ──

def draw_rect(c, x, y, w, h, color, radius=0):
    c.setFillColor(color)
    c.setStrokeColor(color)
    if radius:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=0)
    else:
        c.rect(x, y, w, h, fill=1, stroke=0)

def draw_card(c, x, y, w, h, radius=6, border_color=None, shadow=True):
    if shadow:
        c.setFillColor(Color(0, 0, 0, alpha=0.06))
        c.roundRect(x + 1.5, y - 1.5, w, h, radius, fill=1, stroke=0)
    c.setFillColor(WHITE_C)
    c.setStrokeColor(LIGHT_GREY)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    if border_color:
        c.setFillColor(border_color)
        c.rect(x, y + 2, 4, h - 4, fill=1, stroke=0)

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

def wrap_text_center(c, x, y, txt, max_width, size=8, color=GREY, leading=10, bold=False):
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
        c.drawCentredString(x, y, line)
        y -= leading
    return y

def orange_top_line(c):
    draw_rect(c, 0, H - 2, W, 2, ORANGE)

def accent_bar(c, color, thickness=6):
    draw_rect(c, 0, H - thickness - 2, W, thickness, color)

def fetch_logo():
    try:
        resp = requests.get("https://technijian.com/wp-content/uploads/2023/08/Logo.jpg", timeout=5)
        if resp.status_code == 200:
            return BytesIO(resp.content)
    except:
        pass
    return None


# ════════════════════════════════════════════════════
# PAGE BUILDERS
# ════════════════════════════════════════════════════

def page_cover(c):
    """PAGE 1: COVER — full dark page with glows."""
    # Dark gradient background layers
    draw_rect(c, 0, 0, W, H, DARK)
    draw_rect(c, 0, 0, W, H * 0.5, DARK2)
    draw_rect(c, 0, H * 0.3, W * 0.5, H * 0.7, DARK3)
    c.setFillColor(Color(0.05, 0.1, 0.18, alpha=0.4))
    c.rect(0, H * 0.5, W, H * 0.5, fill=1, stroke=0)

    # Decorative radial glows
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.08))
    c.circle(W - 80, H - 120, 180, fill=1, stroke=0)
    c.setFillColor(Color(0.96, 0.49, 0.29, alpha=0.06))
    c.circle(60, 120, 200, fill=1, stroke=0)
    c.setFillColor(Color(0, 0.43, 0.71, alpha=0.05))
    c.circle(-30, H * 0.5, 250, fill=1, stroke=0)

    # Orange accent line at top
    draw_rect(c, 0, H - 2, W, 2, ORANGE)

    # Logo
    logo_data = fetch_logo()
    if logo_data:
        logo = ImageReader(logo_data)
        logo_size = 80  # 1:1 square logo — preserve aspect ratio
        c.drawImage(logo, W / 2 - logo_size / 2, H - 310, width=logo_size, height=logo_size, mask='auto')

    # Badge pill
    badge_text = 'ENTERPRISE AI PLATFORM'
    c.setFont('Helvetica-Bold', 8)
    bw = c.stringWidth(badge_text, 'Helvetica-Bold', 8) + 24
    bx = W / 2 - bw / 2
    by = H - 340
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.15))
    c.roundRect(bx, by, bw, 20, 10, fill=1, stroke=0)
    c.setStrokeColor(Color(0.12, 0.67, 0.78, alpha=0.4))
    c.setLineWidth(0.5)
    c.roundRect(bx, by, bw, 20, 10, fill=0, stroke=1)
    text_center(c, W / 2, by + 6, badge_text, size=8, color=TEAL, bold=True)

    # Title
    cy = H - 380
    title1 = 'Technijian '
    title2 = 'Chat.AI'
    tw1 = c.stringWidth(title1, 'Helvetica-Bold', 40)
    tw2 = c.stringWidth(title2, 'Helvetica-Bold', 40)
    total = tw1 + tw2
    tx = W / 2 - total / 2
    text(c, tx, cy, title1, size=40, color=WHITE_C, bold=True)
    text(c, tx + tw1, cy, title2, size=40, color=ORANGE, bold=True)

    # Tagline
    text_center(c, W / 2, cy - 36, 'Collective Intelligence for the Modern Enterprise',
                size=16, color=MUTED)

    # Decorative orange line
    line_w = 80
    draw_rect(c, W / 2 - line_w / 2, cy - 60, line_w, 2, ORANGE)

    # Sub-tagline
    text_center(c, W / 2, cy - 80,
                'Multi-Model AI  \u00b7  Workflow Automation  \u00b7  Enterprise Governance',
                size=10, color=DIM)


def page_challenge(c):
    """PAGE 2: THE CHALLENGE."""
    # White background
    draw_rect(c, 0, 0, W, H, WHITE_C)
    orange_top_line(c)
    accent_bar(c, TEAL, 6)

    # Title
    y = H - 50
    t1 = 'The Challenge with '
    t2 = 'Enterprise AI Today'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 24)
    text(c, ML, y, t1, size=24, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=24, color=ORANGE, bold=True)

    # Subtitle
    y -= 24
    y = wrap_text(c, ML, y, 'Organizations face real barriers adopting AI at scale. '
                  'These four challenges prevent teams from realizing the full potential '
                  'of artificial intelligence.', CW, size=11, color=GREY, leading=14)
    y -= 16

    problems = [
        ('Single-Vendor Lock-In', BLUE,
         'Tying your organization to one AI provider means you inherit their outages, pricing changes, and model limitations.',
         'Chat.AI orchestrates OpenAI, Anthropic, Google, and Azure simultaneously with automatic failover.'),
        ('No Cost Visibility', ORANGE,
         'ChatGPT Team and Copilot charge flat per-seat fees with no transparency into actual token consumption or model costs.',
         'Per-call cost attribution, prepaid budgets, and overage alerts give you complete financial control.'),
        ('Hallucinations & Unreliable Output', TEAL,
         'Single-model responses have no checks or balances. Users can\'t tell when the AI is confidently wrong.',
         'AI Council deliberation across 3+ models reduces hallucinations by over 30% with consensus validation.'),
        ('Security & Compliance Gaps', CHARTREUSE,
         'Consumer AI tools lack tenant isolation, audit trails, and the controls required for regulated industries.',
         'Row-level security, stored-procedure-only data access, full audit logging, and HIPAA/SOC 2 architecture.'),
    ]

    card_h = 120
    for title, color, problem, solution in problems:
        draw_card(c, ML, y - card_h, CW, card_h, radius=6, border_color=color, shadow=True)
        # Title
        text(c, ML + 16, y - 18, title, size=13, color=color, bold=True)
        # Problem text
        py = wrap_text(c, ML + 16, y - 36, problem, CW - 32, size=9, color=GREY, leading=12)
        # Arrow + solution
        arrow_y = py - 4
        text(c, ML + 16, arrow_y, '\u2192', size=11, color=ORANGE, bold=True)
        wrap_text(c, ML + 30, arrow_y, solution, CW - 46, size=9, color=DARK, leading=12, bold=True)

        y -= card_h + 12


def page_capabilities(c):
    """PAGE 3: PLATFORM CAPABILITIES."""
    draw_rect(c, 0, 0, W, H, WHITE_C)
    orange_top_line(c)
    accent_bar(c, BLUE, 6)

    y = H - 50
    t1 = 'Platform '
    t2 = 'Capabilities'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 24)
    text(c, ML, y, t1, size=24, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=24, color=ORANGE, bold=True)

    y -= 20
    y = wrap_text(c, ML, y, 'Everything your organization needs to adopt AI securely and effectively.',
                  CW, size=11, color=GREY, leading=14)
    y -= 12

    features = [
        ('Multi-Model Chat', BLUE,
         'Conversational AI powered by GPT-4o, Claude Sonnet, Gemini Pro, and more.',
         ['Switch models mid-conversation or route automatically',
          'Streaming responses with file attachments & analysis',
          'Thread sharing with permissions, export & history']),
        ('Custom AI Assistants', ORANGE,
         'Create purpose-built AI assistants with custom system instructions.',
         ['Per-assistant model selection and connector integrations',
          'REST, GraphQL, and database connectors attachable',
          'Shared or private assistants, MyGPTs for personal productivity']),
        ('Projects & Workspaces', TEAL,
         'Organize chats, files, and instructions into project containers.',
         ['Project-level system prompts inherited across all chats',
          'Shared files & organizational knowledge base',
          'Granular view/edit permissions with cross-chat context']),
        ('Workflow Automation', DARK,
         'Trigger N8N workflows directly from chat context.',
         ['Chat-initiated workflow triggers with parameter extraction',
          'Multi-step business process execution from conversation',
          'Run tracking, retry mechanisms, and cost attribution']),
        ('Knowledge & Memory', CHARTREUSE,
         'Upload documents and give AI persistent organizational memory.',
         ['Weaviate, Pinecone, or Chroma vector stores per tenant',
          'File vectorization, embedding, and semantic search',
          'Retrieval-augmented generation (RAG) capabilities']),
        ('Billing & Cost Controls', TEAL,
         'Prepaid balance model with token-level metering.',
         ['Per-call, per-user, and per-model cost attribution',
          'Budget alerts at 75% and 100% thresholds',
          'Invoice generation and billing period management',
          'Transparent token overage pricing']),
    ]

    col_w = (CW - 16) / 2
    row_h = 142

    for idx, (title, color, desc, bullets) in enumerate(features):
        col = idx % 2
        row = idx // 2
        fx = ML + col * (col_w + 16)
        fy = y - row * (row_h + 10) - row_h

        # Card background
        draw_card(c, fx, fy, col_w, row_h, radius=5, shadow=True)

        # Colored circle icon
        draw_circle(c, fx + 16, fy + row_h - 18, 6, color)

        # Title
        text(c, fx + 28, fy + row_h - 22, title, size=11, color=DARK, bold=True)

        # Description
        ty = fy + row_h - 38
        ty = wrap_text(c, fx + 12, ty, desc, col_w - 24, size=8, color=GREY, leading=10)
        ty -= 4

        # Bullets
        for b in bullets:
            draw_check(c, fx + 14, ty, TEAL, 7)
            ty = wrap_text(c, fx + 24, ty, b, col_w - 38, size=7.5, color=GREY, leading=9)
            ty -= 2


def page_ai_council(c):
    """PAGE 4: AI COUNCIL DEEP DIVE — full dark page."""
    # Full dark background layers
    draw_rect(c, 0, 0, W, H, DARK)
    draw_rect(c, 0, 0, W, H * 0.4, DARK2)
    c.setFillColor(Color(0.05, 0.1, 0.18, alpha=0.3))
    c.rect(0, H * 0.4, W, H * 0.6, fill=1, stroke=0)
    orange_top_line(c)

    y = H - 40

    # Badge
    badge = 'PATENT PENDING'
    c.setFont('Helvetica-Bold', 8)
    bw = c.stringWidth(badge, 'Helvetica-Bold', 8) + 16
    c.setFillColor(Color(0.96, 0.49, 0.29, alpha=0.15))
    c.roundRect(ML, y - 2, bw, 18, 9, fill=1, stroke=0)
    text(c, ML + 8, y + 2, badge, size=8, color=ORANGE, bold=True)

    # Title
    y -= 34
    t1 = 'AI Council \u2014 '
    t2 = 'Collective Intelligence'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 26)
    text(c, ML, y, t1, size=26, color=WHITE_C, bold=True)
    text(c, ML + tw1, y, t2, size=26, color=ORANGE, bold=True)

    # Description
    y -= 22
    y = wrap_text(c, ML, y,
                  'The industry\'s first multi-agent deliberation system. Instead of trusting a single AI model\'s '
                  'opinion, Chat.AI convenes a council of 3+ diverse models through a structured 3-stage pipeline '
                  '\u2014 delivering answers that are more accurate, more balanced, and dramatically less prone to hallucination.',
                  CW, size=10.5, color=MUTED, leading=14)

    # 3 pipeline stages
    y -= 16
    stages = [
        ('1', 'Divergence',
         'Your query is routed to 3+ AI models in parallel. Each model responds independently with no knowledge of the others.'),
        ('2', 'Convergence',
         'Responses are anonymized (model names stripped to prevent sycophancy) and peer-reviewed for semantic similarity, with mandatory dissent encouraged.'),
        ('3', 'Synthesis',
         'The highest-performing model (auto-selected chairman) synthesizes a consensus response using Bayesian weighting and correlation analysis.'),
    ]

    stage_w = (CW - 20) / 3
    for i, (num, title, desc) in enumerate(stages):
        sx = ML + i * (stage_w + 10)
        sy = y - 130

        # Dark card
        c.setFillColor(Color(0.08, 0.08, 0.16, alpha=0.8))
        c.roundRect(sx, sy, stage_w, 130, 6, fill=1, stroke=0)
        c.setStrokeColor(Color(1, 1, 1, alpha=0.05))
        c.setLineWidth(0.5)
        c.roundRect(sx, sy, stage_w, 130, 6, fill=0, stroke=1)

        # Orange numbered circle
        draw_circle(c, sx + stage_w / 2, sy + 108, 14, ORANGE)
        text_center(c, sx + stage_w / 2, sy + 103, num, size=14, color=WHITE_C, bold=True)

        # Stage title
        text_center(c, sx + stage_w / 2, sy + 84, title, size=11, color=WHITE_C, bold=True)

        # Stage description
        wrap_text_center(c, sx + stage_w / 2, sy + 70, desc, stage_w - 16,
                         size=7.5, color=Color(0.69, 0.69, 0.72, 1), leading=10)

    y = sy - 24

    # 4 metrics in 2x2 grid
    metrics = [
        ('>60%', 'Win Rate vs Single Models'),
        ('>30%', 'Hallucination Reduction'),
        ('3+', 'Models Per Deliberation'),
        ('100%', 'Anonymized Peer Review'),
    ]
    metric_w = (CW - 20) / 4
    for i, (val, label) in enumerate(metrics):
        mx = ML + i * (metric_w + 6.67)
        my = y - 60

        # Darker card
        c.setFillColor(Color(0.06, 0.06, 0.12, alpha=0.9))
        c.roundRect(mx, my, metric_w, 60, 5, fill=1, stroke=0)

        text_center(c, mx + metric_w / 2, my + 34, val, size=20, color=TEAL, bold=True)
        wrap_text_center(c, mx + metric_w / 2, my + 18, label, metric_w - 10,
                         size=7, color=DIM, leading=9)

    y = my - 18

    # Supported models
    text(c, ML, y, 'Supported:', size=9, color=DIM, bold=True)
    sw = c.stringWidth('Supported:  ', 'Helvetica-Bold', 9)
    text(c, ML + sw, y,
         'GPT-4o  \u2022  Claude Sonnet  \u2022  Gemini Pro  \u2022  GPT-4o mini  \u2022  Claude Haiku  \u2022  Gemini Flash  \u2022  Claude Opus  \u2022  Azure OpenAI',
         size=9, color=MUTED)


def page_use_cases(c):
    """PAGE 5: USE CASES."""
    draw_rect(c, 0, 0, W, H, WHITE_C)
    orange_top_line(c)
    accent_bar(c, ORANGE, 6)

    y = H - 50
    t1 = 'Who Uses '
    t2 = 'Chat.AI'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 24)
    text(c, ML, y, t1, size=24, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=24, color=ORANGE, bold=True)

    y -= 22
    y = wrap_text(c, ML, y,
                  'Organizations across industries trust Chat.AI for secure, intelligent AI adoption.',
                  CW, size=11, color=GREY, leading=14)
    y -= 20

    use_cases = [
        ('Legal Firm \u2022 25 Users', BLUE,
         'Needed multi-model AI for contract review with strict audit compliance requirements.',
         'AI Council consensus reduced review errors by 40%. Full audit trail satisfies compliance auditors. Multiple model perspectives catch contract risks a single model misses.',
         '40%', 'Reduction in Review Errors'),
        ('Healthcare Provider \u2022 100 Users', ORANGE,
         'Required HIPAA-compliant AI for clinical Q&A without sending patient data to third-party clouds.',
         'On-premise deployment with row-level security keeps data in-house. Cost controls prevented budget overruns. Clinical staff access AI without compliance risk.',
         '$0', 'Compliance Violations'),
        ('Financial Services \u2022 500 Users', TEAL,
         'Was paying for 5 separate AI tools, workflow platforms, and vector databases with no unified cost visibility.',
         'Consolidated to single platform with Chat.AI Enterprise. Token-level metering replaced guesswork. 50% fewer vendor contracts to manage.',
         '$174K', 'Annual Savings'),
    ]

    card_h = 180
    for persona, color, challenge, solution, metric, metric_label in use_cases:
        draw_card(c, ML, y - card_h, CW, card_h, radius=6, border_color=color, shadow=True)

        # Persona badge
        c.setFont('Helvetica-Bold', 9)
        pw = c.stringWidth(persona, 'Helvetica-Bold', 9) + 16
        c.setFillColor(Color(color.red, color.green, color.blue, alpha=0.1))
        c.roundRect(ML + 16, y - 22, pw, 18, 9, fill=1, stroke=0)
        text(c, ML + 24, y - 18, persona, size=9, color=color, bold=True)

        # Challenge
        cy = y - 42
        text(c, ML + 16, cy, 'Challenge:', size=9, color=DARK, bold=True)
        cw_offset = c.stringWidth('Challenge:  ', 'Helvetica-Bold', 9)
        cy = wrap_text(c, ML + 16 + cw_offset, cy, challenge, CW - 32 - cw_offset, size=9, color=GREY, leading=12)
        cy -= 6

        # Solution
        text(c, ML + 16, cy, 'Solution:', size=9, color=DARK, bold=True)
        sw_offset = c.stringWidth('Solution:  ', 'Helvetica-Bold', 9)
        cy = wrap_text(c, ML + 16 + sw_offset, cy, solution, CW - 32 - sw_offset, size=9, color=GREY, leading=12)

        # Result metric — bottom right of card
        text_right(c, ML + CW - 20, y - card_h + 22, metric, size=24, color=TEAL, bold=True)
        text_right(c, ML + CW - 20, y - card_h + 8, metric_label, size=9, color=GREY)

        y -= card_h + 14


def page_pricing(c):
    """PAGE 6: PRICING."""
    draw_rect(c, 0, 0, W, H, WHITE_C)
    orange_top_line(c)
    accent_bar(c, TEAL, 6)

    y = H - 46
    t1 = 'Simple, '
    t2 = 'Transparent Pricing'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 24)
    text(c, ML, y, t1, size=24, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=24, color=ORANGE, bold=True)

    y -= 18
    text(c, ML, y, 'No hidden fees. No per-seat surprises. Annual plans save 17%.', size=10, color=GREY)

    y -= 20

    # Pricing table
    headers = ['', 'Starter', 'Growth', 'Professional \u2605', 'Enterprise']
    rows = [
        ['Monthly Price',      '$299',    '$899',     '$1,699',         'Custom'],
        ['Annual Price',       '$2,990',  '$8,990',   '$16,990',        'Custom'],
        ['Users',              '10',      '50',       '100',            '250 \u2013 1,000+'],
        ['Tokens/month',       '10M',     '35M',      '75M',           '200M \u2013 750M+'],
        ['Storage',            '10 GB',   '50 GB',    '150 GB',        '500 GB \u2013 2 TB'],
        ['Custom Assistants',  '5',       '25',       'Unlimited',     'Unlimited'],
        ['Workflows',          '10',      '50',       'Unlimited',     'Unlimited'],
        ['AI Council',         '\u2014',  '\u2014',   '\u2713 Included', '\u2713 Included'],
        ['Model Tier',         'Standard', 'Pro',     'Pro + Premium', 'All Premium'],
        ['Uptime SLA',         '99.0%',   '99.5%',    '99.5%',        '99.9 \u2013 99.95%'],
        ['Support Response',   '72 hours', '48 hours', '24 hours',    '4 \u2013 1 hour'],
        ['Token Overage',      '$16/1M',  '$15/1M',   '$14.75/1M',    '$14.50/1M'],
    ]

    num_rows = 1 + len(rows)
    row_h = 22
    col_widths = [CW * 0.22, CW * 0.17, CW * 0.17, CW * 0.22, CW * 0.22]

    for ri in range(num_rows):
        ry = y - ri * row_h
        cx = ML
        for ci in range(5):
            cw_col = col_widths[ci]
            is_pro = (ci == 3)

            if ri == 0:
                # Header row
                bg = BLUE if is_pro else DARK
                draw_rect(c, cx, ry - row_h, cw_col, row_h, bg)
                text_center(c, cx + cw_col / 2, ry - row_h + 7, headers[ci],
                           size=8, color=WHITE_C, bold=True)
            else:
                # Data rows
                if is_pro:
                    draw_rect(c, cx, ry - row_h, cw_col, row_h, Color(0.91, 0.96, 0.99, 1))
                elif ri % 2 == 0:
                    draw_rect(c, cx, ry - row_h, cw_col, row_h, OFF_WHITE)

                val = rows[ri - 1][ci]
                is_label = (ci == 0)
                text_center(c, cx + cw_col / 2, ry - row_h + 7, val,
                           size=7.5, color=DARK if (is_pro or is_label) else GREY,
                           bold=(is_pro or is_label))
            cx += cw_col

    y -= num_rows * row_h + 10

    # Add-ons
    text(c, ML, y, 'Add-ons: Additional token packs, premium model access, and dedicated support available.',
         size=8, color=GREY)
    y -= 22

    # Deployment cards
    deployments = [
        ('\u2601  Cloud (SaaS)', 'Fully managed on Azure with automatic updates, monitoring, and 24/7 global support.',
         'Starting at $299/mo', Color(0.91, 0.96, 0.99, 1)),
        ('\U0001f3e0  On-Premise', 'Deploy inside your own infrastructure for maximum data sovereignty.',
         'Starting at $45,000/yr', OFF_WHITE),
    ]
    dep_w = (CW - 12) / 2
    dep_h = 80
    for i, (title, desc, price, bg) in enumerate(deployments):
        dx = ML + i * (dep_w + 12)
        draw_rect(c, dx, y - dep_h, dep_w, dep_h, bg, radius=6)
        text(c, dx + 14, y - 18, title, size=12, color=DARK, bold=True)
        wrap_text(c, dx + 14, y - 36, desc, dep_w - 28, size=9, color=GREY, leading=11)
        text(c, dx + 14, y - dep_h + 12, price, size=10, color=BLUE, bold=True)


def page_comparison(c):
    """PAGE 7: COMPARISON + ROI."""
    draw_rect(c, 0, 0, W, H, WHITE_C)
    orange_top_line(c)
    accent_bar(c, BLUE, 6)

    y = H - 46
    t1 = 'How Chat.AI '
    t2 = 'Compares'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 20)
    text(c, ML, y, t1, size=20, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=20, color=ORANGE, bold=True)
    y -= 18

    # Comparison table
    cmp_headers = ['Capability', 'ChatGPT Team', 'MS Copilot', 'Gemini Business', 'Chat.AI']
    cmp_rows = [
        ['Multi-model access',       'OpenAI only',    'OpenAI only',      'Google only',    '\u2713 4+ providers'],
        ['AI Council (consensus)',    '\u2014',         '\u2014',           '\u2014',         '\u2713 Patent pending'],
        ['Per-call cost attribution', '\u2014',         '\u2014',           '\u2014',         '\u2713 Token-level'],
        ['Workflow automation',       'GPTs only',      'Power Automate ($)','\u2014',        '\u2713 N8N built-in'],
        ['Multi-tenant isolation',    '\u2014',         'Basic',            'Basic',          '\u2713 Row-level security'],
        ['Full audit logging',        '\u2014',         'Limited',          'Limited',        '\u2713 SP-enforced'],
        ['Custom vector stores',      'OpenAI only',    '\u2014',           '\u2014',         '\u2713 Weaviate/Pinecone'],
        ['On-premise deployment',     '\u2014',         '\u2014',           '\u2014',         '\u2713 Term license'],
        ['Budget controls',           '\u2014',         '\u2014',           '\u2014',         '\u2713 75%/100% alerts'],
        ['Price (25 users)',          '$625/mo',        '$750/mo',          '$500/mo',        '$899/mo (50 seats)'],
    ]

    num_rows = 1 + len(cmp_rows)
    row_h = 20
    col_widths = [CW * 0.22, CW * 0.18, CW * 0.18, CW * 0.20, CW * 0.22]

    for ri in range(num_rows):
        ry = y - ri * row_h
        cx = ML
        for ci in range(5):
            cw_col = col_widths[ci]
            is_chatai = (ci == 4)

            if ri == 0:
                bg = BLUE if is_chatai else DARK
                draw_rect(c, cx, ry - row_h, cw_col, row_h, bg)
                text_center(c, cx + cw_col / 2, ry - row_h + 6, cmp_headers[ci],
                           size=7.5, color=WHITE_C, bold=True)
            else:
                if is_chatai:
                    draw_rect(c, cx, ry - row_h, cw_col, row_h, Color(0.91, 0.96, 0.99, 1))
                elif ri % 2 == 0:
                    draw_rect(c, cx, ry - row_h, cw_col, row_h, OFF_WHITE)

                val = cmp_rows[ri - 1][ci]
                if is_chatai and val.startswith('\u2713'):
                    # Teal check + text
                    text_center(c, cx + cw_col / 2, ry - row_h + 6, val,
                               size=7, color=TEAL, bold=True)
                elif val == '\u2014':
                    text_center(c, cx + cw_col / 2, ry - row_h + 6, val,
                               size=7, color=MED_GREY)
                else:
                    text_center(c, cx + cw_col / 2, ry - row_h + 6, val,
                               size=7, color=DARK if ci == 0 else GREY, bold=(ci == 0))
            cx += cw_col

    y -= num_rows * row_h + 16

    # ── ROI Section (dark background) ──
    roi_h = y  # fill remaining page
    draw_rect(c, 0, 0, W, roi_h, DARK)
    draw_rect(c, 0, 0, W, roi_h * 0.5, DARK2)

    ry = roi_h - 24
    t1 = 'What You '
    t2 = 'Save'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 20)
    text(c, ML, ry, t1, size=20, color=WHITE_C, bold=True)
    text(c, ML + tw1, ry, t2, size=20, color=ORANGE, bold=True)

    ry -= 16
    text(c, ML, ry, 'Real cost comparisons for typical organizations switching to Chat.AI.',
         size=10, color=DIM)
    ry -= 20

    # ROI table
    roi_headers = ['Scenario', 'Current Cost', 'Chat.AI', 'Monthly Savings', 'Annual Savings']
    roi_data = [
        ['Small Team (10)', '$389/mo', '$299/mo', '$90/mo', '$1,080'],
        ['Mid-Market (50)', '$2,500/mo', '$899/mo', '$1,601/mo', '$19,212'],
        ['Enterprise (250)', '$18,500/mo', '$3,999/mo', '$14,501/mo', '$174,012'],
    ]

    roi_col_w = [CW * 0.22, CW * 0.20, CW * 0.18, CW * 0.20, CW * 0.20]
    roi_row_h = 24

    # Header
    cx = ML
    for ci in range(5):
        cw_col = roi_col_w[ci]
        c.setFillColor(Color(0.1, 0.1, 0.2, alpha=0.8))
        c.rect(cx, ry - roi_row_h, cw_col, roi_row_h, fill=1, stroke=0)
        text_center(c, cx + cw_col / 2, ry - roi_row_h + 8, roi_headers[ci],
                   size=8, color=TEAL, bold=True)
        cx += cw_col
    ry -= roi_row_h

    # Data rows
    for ri, rd in enumerate(roi_data):
        cx = ML
        for ci in range(5):
            cw_col = roi_col_w[ci]
            val = rd[ci]
            is_savings = (ci == 4)
            if ci == 0:
                clr = WHITE_C
                b = True
            elif is_savings:
                clr = CHARTREUSE
                b = True
            else:
                clr = Color(0.69, 0.69, 0.72, 1)
                b = False
            text_center(c, cx + cw_col / 2, ry - roi_row_h + 8, val, size=9, color=clr, bold=b)
            cx += cw_col
        ry -= roi_row_h


def page_security_about_cta(c):
    """PAGE 8: SECURITY + ABOUT + CTA."""
    draw_rect(c, 0, 0, W, H, WHITE_C)
    orange_top_line(c)
    accent_bar(c, TEAL, 6)

    y = H - 46

    # Security title
    t1 = 'Enterprise-Grade '
    t2 = 'Security & Compliance'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 18)
    text(c, ML, y, t1, size=18, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=18, color=ORANGE, bold=True)
    y -= 20

    sec_items = [
        ('Azure AD SSO', BLUE, 'OAuth 2.0/OIDC with JWT bearer tokens'),
        ('Row-Level Security', ORANGE, 'Database-enforced tenant isolation'),
        ('Full Audit Trail', TEAL, 'Every mutation logged with user & timestamp'),
        ('Azure Key Vault', DARK, 'All secrets encrypted at rest'),
        ('Prompt Injection Defense', ORANGE, 'Salted sequence tags & delimiter separation'),
        ('HIPAA / SOC 2 Ready', BLUE, 'Compliance-ready architecture'),
        ('RBAC Roles', TEAL, 'Multi-level role hierarchies'),
        ('Rate Limiting', DARK, 'Per-user, per-tenant throttling'),
    ]

    col_w = (CW - 16) / 2
    for idx, (title, color, desc) in enumerate(sec_items):
        col = idx % 2
        row = idx // 2
        sx = ML + col * (col_w + 16)
        sy = y - row * 22

        draw_dot(c, sx + 5, sy + 3, color, 4)
        text(c, sx + 14, sy, title, size=9, color=DARK, bold=True)
        tw = c.stringWidth(title + '  ', 'Helvetica-Bold', 9)
        text(c, sx + 14 + tw, sy, '\u2014  ' + desc, size=8, color=GREY)

    y -= (len(sec_items) // 2) * 22 + 14

    # Orange thin divider
    draw_rect(c, ML, y, CW, 2, ORANGE)
    y -= 22

    # About Technijian
    t1 = 'About '
    t2 = 'Technijian'
    tw1 = c.stringWidth(t1, 'Helvetica-Bold', 18)
    text(c, ML, y, t1, size=18, color=DARK, bold=True)
    text(c, ML + tw1, y, t2, size=18, color=BLUE, bold=True)
    y -= 16

    about1 = ('Founded in 2000 by Ravi Jain, Technijian has grown from a single-consultant operation '
              'into a full-spectrum IT services company with offices in Irvine, California and India. '
              'For over 25 years, we\'ve served small and mid-sized businesses with managed IT, '
              'cybersecurity, cloud, compliance, and AI-driven solutions.')
    y = wrap_text(c, ML, y, about1, CW, size=9, color=GREY, leading=12)
    y -= 4

    about2 = ('Our Technijians Pod Model assigns a dedicated team to each client \u2014 so you get '
              'people who truly know your infrastructure, not a rotating cast of strangers. '
              'With 24/7 global support at no extra cost, we deliver enterprise-grade technology '
              'with the responsiveness of a dedicated partner.')
    y = wrap_text(c, ML, y, about2, CW, size=9, color=GREY, leading=12)
    y -= 16

    # 3 metric boxes
    metrics = [('25+', 'Years in Business'), ('24/7', 'Global Support'), ('6', 'Service Pillars')]
    box_w = (CW - 20) / 3
    box_h = 50
    for i, (val, label) in enumerate(metrics):
        bx = ML + i * (box_w + 10)
        draw_rect(c, bx, y - box_h, box_w, box_h, OFF_WHITE, radius=5)
        text_center(c, bx + box_w / 2, y - 22, val, size=22, color=ORANGE, bold=True)
        text_center(c, bx + box_w / 2, y - 40, label, size=8, color=GREY)

    y -= box_h + 18

    # Blue CTA banner
    cta_h = 70
    draw_rect(c, 0, y - cta_h, W, cta_h, BLUE)
    c.setFillColor(Color(0, 0.2, 0.4, alpha=0.3))
    c.rect(W * 0.65, y - cta_h, W * 0.35, cta_h, fill=1, stroke=0)

    text_center(c, W / 2, y - 22, 'Ready to Transform How Your Team Uses AI?',
                size=18, color=WHITE_C, bold=True)
    text_center(c, W / 2, y - 38,
                'Schedule a personalized demo and see how Chat.AI delivers better answers at a lower cost.',
                size=9.5, color=Color(0.8, 0.87, 0.93, 1))
    text_center(c, W / 2, y - 56,
                'RJain@technijian.com   \u2022   949.379.8500',
                size=13, color=WHITE_C, bold=True)

    y -= cta_h + 2

    # Dark footer
    footer_h = max(y, 20)
    draw_rect(c, 0, 0, W, footer_h, NEAR_BLACK)
    text_center(c, W / 2, footer_h / 2 - 4,
                '\u00a9 2026 Technijian  \u2022  18 Technology Dr. Ste 141, Irvine CA 92618  \u2022  technijian.com',
                size=7, color=Color(1, 1, 1, alpha=0.4))


# ════════════════════════════════════════════════════
# MAIN BUILD
# ════════════════════════════════════════════════════

def build():
    pdf_path = os.path.join(OUT_DIR, 'Chat.AI Brochure.pdf')
    c = canvas.Canvas(pdf_path, pagesize=letter)
    c.setTitle('Technijian Chat.AI \u2014 Brochure')
    c.setAuthor('Technijian')

    page_cover(c)
    c.showPage()

    page_challenge(c)
    c.showPage()

    page_capabilities(c)
    c.showPage()

    page_ai_council(c)
    c.showPage()

    page_use_cases(c)
    c.showPage()

    page_pricing(c)
    c.showPage()

    page_comparison(c)
    c.showPage()

    page_security_about_cta(c)

    c.save()
    print(f"  PDF: {pdf_path}")
    return pdf_path


def main():
    print("Building Chat.AI Brochure (ReportLab)...")
    build()
    print("Done!")


if __name__ == '__main__':
    main()
