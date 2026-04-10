"""
Chat.AI Brochure — ReportLab direct PDF generation.
Produces a multi-page US Letter brochure with full Technijian branding.
"""

import os
import math
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

W, H = letter  # 612 x 792

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
PDF_PATH = os.path.join(OUT_DIR, 'Chat.AI Brochure.pdf')
LOGO_PATH = os.path.normpath(os.path.join(OUT_DIR, '..', '..', 'assets', 'Technijian Logo - white text.png'))
GRAPHICS_DIR = os.path.join(OUT_DIR, 'graphics')
AI_COUNCIL_GRAPHIC = os.path.join(GRAPHICS_DIR, 'ai-council-pipeline.png')
PLATFORM_OVERVIEW_GRAPHIC = os.path.join(GRAPHICS_DIR, 'platform-overview.png')
ROI_GRAPHIC = os.path.join(GRAPHICS_DIR, 'roi-savings.png')

FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'
try:
    font_dir = os.path.expanduser('~/AppData/Local/Microsoft/Windows/Fonts')
    if os.path.exists(os.path.join(font_dir, 'OpenSans-Regular.ttf')):
        pdfmetrics.registerFont(TTFont('OpenSans', os.path.join(font_dir, 'OpenSans-Regular.ttf')))
        pdfmetrics.registerFont(TTFont('OpenSans-Bold', os.path.join(font_dir, 'OpenSans-Bold.ttf')))
        FONT = 'OpenSans'
        FONT_BOLD = 'OpenSans-Bold'
except Exception:
    pass


def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_width=0.5):
    c.saveState()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
    p = c.beginPath()
    p.roundRect(x, y, w, h, r)
    c.drawPath(p, fill=1 if fill_color else 0, stroke=1 if stroke_color else 0)
    c.restoreState()


def draw_circle(c, x, y, r, fill_color):
    c.saveState()
    c.setFillColor(fill_color)
    c.circle(x, y, r, fill=1, stroke=0)
    c.restoreState()


def draw_check(c, x, y, size=10):
    c.saveState()
    c.setFillColor(TEAL)
    c.setFont(FONT_BOLD, size)
    c.drawString(x, y, '\u2713')
    c.restoreState()


def dark_bg(c):
    """Fill full page with dark gradient."""
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.saveState()
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.12))
    c.circle(W + 30, H - 80, 200, fill=1, stroke=0)
    c.restoreState()
    c.saveState()
    c.setFillColor(Color(0.96, 0.49, 0.29, alpha=0.08))
    c.circle(-50, 120, 180, fill=1, stroke=0)
    c.restoreState()
    c.saveState()
    c.setFillColor(Color(0, 0.43, 0.71, alpha=0.10))
    c.circle(-60, H * 0.5, 160, fill=1, stroke=0)
    c.restoreState()


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = current + (" " if current else "") + word
        if c.stringWidth(test, font, size) > max_width:
            if current:
                lines.append(current)
            current = word
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def draw_wrapped_lines(c, lines, x, y, line_height, centered=False):
    """Draw pre-wrapped lines from a top baseline downward."""
    for i, line in enumerate(lines):
        if centered:
            c.drawCentredString(x, y - i * line_height, line)
        else:
            c.drawString(x, y - i * line_height, line)


def draw_brand_logo(c, center_x, top_y, width=190):
    """Draw the approved reverse Technijian logo on dark backgrounds."""
    if not os.path.exists(LOGO_PATH):
        return 0
    try:
        logo = ImageReader(LOGO_PATH)
        iw, ih = logo.getSize()
        height = width * (ih / iw)
        c.drawImage(logo, center_x - width / 2, top_y - height, width=width, height=height, mask='auto')
        return height
    except Exception:
        return 0


def draw_fitted_image(c, image_path, x, y, w, h, padding=0):
    """Draw an image fitted proportionally into a bounding box."""
    if not os.path.exists(image_path):
        return False
    try:
        image = ImageReader(image_path)
        iw, ih = image.getSize()
        usable_w = max(1, w - 2 * padding)
        usable_h = max(1, h - 2 * padding)
        scale = min(usable_w / iw, usable_h / ih)
        draw_w = iw * scale
        draw_h = ih * scale
        dx = x + (w - draw_w) / 2
        dy = y + (h - draw_h) / 2
        c.drawImage(image, dx, dy, width=draw_w, height=draw_h, mask='auto')
        return True
    except Exception:
        return False


def draw_arrow(c, x1, y1, x2, y2, color, width=1.6, head=7):
    """Draw a straight arrow between two points."""
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)
    angle = math.atan2(y2 - y1, x2 - x1)
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(x2 - head * math.cos(angle - math.pi / 6), y2 - head * math.sin(angle - math.pi / 6))
    p.lineTo(x2 - head * math.cos(angle + math.pi / 6), y2 - head * math.sin(angle + math.pi / 6))
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.restoreState()


def build():
    c = canvas.Canvas(PDF_PATH, pagesize=letter)
    c.setTitle("Technijian Chat.AI \u2014 Enterprise AI Platform Brochure")
    c.setAuthor("Technijian")
    margin = 56

    # ══ PAGE 1: COVER ══
    dark_bg(c)
    logo_h = draw_brand_logo(c, W / 2, H - 70, width=215)
    bw = 170
    bx = (W - bw) / 2
    c.saveState()
    c.setFillColor(Color(0.12, 0.67, 0.78, alpha=0.20))
    c.setStrokeColor(Color(0.12, 0.67, 0.78, alpha=0.45))
    c.setLineWidth(0.5)
    pill_y = H * 0.62
    if logo_h:
        pill_y = min(pill_y, H - 120 - logo_h)
    p = c.beginPath(); p.roundRect(bx, pill_y, bw, 22, 11); c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(TEAL); c.setFont(FONT_BOLD, 9)
    c.drawCentredString(W / 2, pill_y + 7, "ENTERPRISE AI PLATFORM")
    c.restoreState()
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 48); c.drawCentredString(W / 2, H * 0.52, "Technijian")
    c.setFillColor(ORANGE); c.drawCentredString(W / 2, H * 0.52 - 52, "Chat.AI")
    c.setFillColor(Color(1, 1, 1, alpha=0.56)); c.setFont(FONT_BOLD, 11)
    c.drawCentredString(W / 2, H * 0.52 - 80, "ENTERPRISE AI PLATFORM BROCHURE")
    c.setFillColor(Color(1, 1, 1, alpha=0.60)); c.setFont(FONT, 14)
    c.drawCentredString(W / 2, H * 0.36, "Secure, multi-model AI with collective intelligence,")
    c.drawCentredString(W / 2, H * 0.36 - 20, "workflow automation, and enterprise governance.")
    c.setFillColor(ORANGE); c.rect(W / 2 - 30, H * 0.30, 60, 3, fill=1, stroke=0)
    stats = [("4+", "AI Providers"), ("32+", "Endpoints"), (">60%", "Council Win Rate"), ("99.9%", "Uptime SLA")]
    start_x = (W - len(stats) * 120) / 2
    c.setStrokeColor(Color(1, 1, 1, alpha=0.10)); c.setLineWidth(0.5); c.line(margin, H * 0.25, W - margin, H * 0.25)
    for i, (num, lbl) in enumerate(stats):
        sx = start_x + i * 120 + 60
        c.setFillColor(ORANGE); c.setFont(FONT_BOLD, 32); c.drawCentredString(sx, H * 0.17, num)
        c.setFillColor(Color(1, 1, 1, alpha=0.45)); c.setFont(FONT, 9); c.drawCentredString(sx, H * 0.17 - 18, lbl.upper())
    c.showPage()

    # ══ PAGE 2: THE CHALLENGE ══
    c.setFillColor(OFF_WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - margin
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 28); c.drawString(margin, y, "The")
    tw = c.stringWidth("The ", FONT_BOLD, 28); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Challenge")
    y -= 24; c.setFillColor(GREY); c.setFont(FONT, 12)
    for line in wrap_text(c, "Enterprises adopting AI face critical obstacles that generic chatbot subscriptions cannot solve. Today's AI landscape forces painful trade-offs between capability, security, and cost.", FONT, 12, W - 2 * margin):
        c.drawString(margin, y, line); y -= 18
    y -= 20
    challenges = [
        (BLUE, "Vendor Lock-In", "Tied to a single AI provider with no failover, no model comparison, and no negotiating leverage.", "Chat.AI connects 4+ providers with automatic failover"),
        (ORANGE, "Runaway AI Costs", "No visibility into which teams or users consume the most tokens. Monthly bills arrive as surprises.", "Token-level metering with per-user budgets & alerts"),
        (TEAL, "Security Gaps", "Consumer AI tools lack audit trails, role-based access, and tenant isolation for compliance.", "Row-level isolation, full audit trail, HIPAA/SOC 2 ready"),
        (CHARTREUSE, "Hallucinations", "Relying on one model means no cross-validation. Wrong answers go unchecked and unverified.", "AI Council cross-validates with 3+ models per query"),
    ]
    card_w = (W - 2 * margin - 16) / 2; card_h = 135
    for i, (color, title, desc, solution) in enumerate(challenges):
        col = i % 2; row = i // 2
        cx = margin + col * (card_w + 16); cy = y - row * (card_h + 14)
        draw_rounded_rect(c, cx, cy - card_h, card_w, card_h, 6, fill_color=WHITE, stroke_color=LIGHT_GREY)
        c.setFillColor(color); c.rect(cx, cy - card_h + 6, 4, card_h - 12, fill=1, stroke=0)
        c.setFillColor(color); c.setFont(FONT_BOLD, 14); c.drawString(cx + 16, cy - 22, title)
        c.setFillColor(GREY); c.setFont(FONT, 10.5); dy = cy - 40
        for line in wrap_text(c, desc, FONT, 10.5, card_w - 32): c.drawString(cx + 16, dy, line); dy -= 14
        dy -= 6; draw_circle(c, cx + 24, dy + 4, 8, color)
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 10); c.drawCentredString(cx + 24, dy + 1, "\u2192")
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 10)
        for line in wrap_text(c, solution, FONT_BOLD, 10, card_w - 50): c.drawString(cx + 38, dy, line); dy -= 13
    panel_y = 82; panel_h = 132
    draw_rounded_rect(c, margin, panel_y, W - 2 * margin, panel_h, 10, fill_color=WHITE, stroke_color=LIGHT_GREY)
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 16); c.drawString(margin + 18, panel_y + panel_h - 28, "What Enterprises Need Instead")
    c.setFillColor(GREY); c.setFont(FONT, 10); c.drawString(margin + 18, panel_y + panel_h - 46, "Model choice, governance, and answer quality control in one platform.")
    need_items = [
        (BLUE, "4+ Providers", "Avoid lock-in and route prompts to the best-fit model."),
        (ORANGE, "Budget Guardrails", "Track token spend by user, team, and model before invoices hit."),
        (TEAL, "Consensus Review", "Use AI Council to reduce hallucinations on high-stakes work."),
    ]
    ni_w = (W - 2 * margin - 36) / 3
    for i, (accent, title, body) in enumerate(need_items):
        nx = margin + 18 + i * ni_w
        if i:
            c.setStrokeColor(LIGHT_GREY); c.setLineWidth(0.6)
            c.line(nx - 6, panel_y + 18, nx - 6, panel_y + panel_h - 18)
        c.setFillColor(accent); c.setFont(FONT_BOLD, 14); c.drawString(nx, panel_y + 56, title)
        c.setFillColor(GREY); c.setFont(FONT, 8.8)
        draw_wrapped_lines(c, wrap_text(c, body, FONT, 8.8, ni_w - 12), nx, panel_y + 38, 11)
    c.showPage()

    # ══ PAGE 3: CORE CAPABILITIES ══
    c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - margin
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 28); c.drawString(margin, y, "Core")
    tw = c.stringWidth("Core ", FONT_BOLD, 28); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Capabilities")
    y -= 22; c.setFillColor(GREY); c.setFont(FONT, 12)
    c.drawString(margin, y, "Six integrated modules that transform AI into an enterprise intelligence platform."); y -= 30
    features = [
        (BLUE, "Multi-Model AI Engine", "Access GPT-4o, Claude Sonnet, Gemini Pro through a unified interface.", ["Switch models mid-conversation", "Auto-route queries by task type", "Streaming with file attachments", "Thread sharing & full history"]),
        (ORANGE, "AI Council (Patent Pending)", "Multi-model collective intelligence that outperforms any single model.", [">60% win rate vs single models", ">30% hallucination reduction", "3-stage deliberation process", "Anonymized peer review"]),
        (TEAL, "Knowledge & RAG", "Enterprise knowledge base with vector search across your documents.", ["Weaviate, Pinecone, Chroma", "Semantic search & vectorization", "SharePoint & Drive sync", "Persistent org memory"]),
        (DARK, "Custom Assistants", "Build purpose-specific AI agents with system prompts and connectors.", ["Custom system prompts", "REST, GraphQL, DB connectors", "Project workspaces", "Template marketplace"]),
        (CHARTREUSE, "Workflow Automation", "Trigger complex workflows from chat, powered by N8N integration.", ["N8N orchestration", "Connect to any API", "Scheduled & event-driven", "Chat-triggered automations"]),
        (BLUE, "Enterprise Governance", "Complete visibility over AI usage, costs, and compliance.", ["Token-level cost tracking", "Per-user & per-model budgets", "Analytics dashboard", "75%/100% budget alerts"]),
    ]
    card_w = (W - 2 * margin - 32) / 3; card_h = 180
    for i, (color, title, desc, bullets) in enumerate(features):
        col = i % 3; row = i // 3
        cx = margin + col * (card_w + 16); cy = y - row * (card_h + 14)
        draw_rounded_rect(c, cx, cy - card_h, card_w, card_h, 8, fill_color=WHITE, stroke_color=LIGHT_GREY)
        c.setFillColor(color); c.rect(cx, cy - 3, card_w, 3, fill=1, stroke=0)
        draw_rounded_rect(c, cx + 12, cy - 48, 36, 36, 8, fill_color=color)
        c.setFillColor(WHITE if color != CHARTREUSE else DARK); c.setFont(FONT_BOLD, 16); c.drawCentredString(cx + 30, cy - 40, "\u2605")
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 11); c.drawString(cx + 12, cy - 62, title)
        c.setFillColor(GREY); c.setFont(FONT, 9); dy = cy - 76
        for line in wrap_text(c, desc, FONT, 9, card_w - 24): c.drawString(cx + 12, dy, line); dy -= 12
        dy -= 4
        for bullet in bullets:
            draw_check(c, cx + 12, dy, 8); c.setFillColor(GREY); c.setFont(FONT, 8.5); c.drawString(cx + 24, dy, bullet); dy -= 12
    panel_y = 66; panel_h = 146
    draw_rounded_rect(c, margin, panel_y, W - 2 * margin, panel_h, 10, fill_color=DARK)
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 16); c.drawString(margin + 18, panel_y + panel_h - 28, "One Platform, Shared Controls")
    c.setFillColor(Color(1, 1, 1, alpha=0.60)); c.setFont(FONT, 10)
    c.drawString(margin + 18, panel_y + panel_h - 46, "Every module runs on the same identity, knowledge, and governance foundation.")
    diagram_y = panel_y + 12
    c.setFillColor(Color(1, 1, 1, alpha=0.55)); c.setFont(FONT_BOLD, 8)
    c.drawString(margin + 22, diagram_y + 66, "AI PROVIDERS")
    c.drawString(W - margin - 112, diagram_y + 66, "GOVERNANCE")
    chip_w = 82; chip_h = 18
    provider_x = margin + 22
    provider_y = [diagram_y + 48, diagram_y + 24, diagram_y]
    providers = ["GPT-4o", "Claude", "Gemini"]
    for py, label in zip(provider_y, providers):
        draw_rounded_rect(c, provider_x, py, chip_w, chip_h, 9, fill_color=Color(1, 1, 1, alpha=0.10), stroke_color=Color(1, 1, 1, alpha=0.20))
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 8.2); c.drawCentredString(provider_x + chip_w / 2, py + 5, label)
    center_w = 154; center_h = 44
    center_x = W / 2 - center_w / 2
    center_y = diagram_y + 22
    draw_rounded_rect(c, center_x, center_y, center_w, center_h, 12, fill_color=WHITE)
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 14); c.drawCentredString(W / 2, center_y + 25, "Chat.AI Platform")
    c.setFillColor(BLUE); c.setFont(FONT_BOLD, 7.4); c.drawCentredString(W / 2, center_y + 10, "ROUTING  •  COUNCIL  •  GOVERNANCE")
    gov_x = W - margin - 104
    gov_y = [diagram_y + 40, diagram_y + 14]
    governance = [("SSO + RBAC", BLUE), ("Audit Trail", TEAL)]
    for (label, accent), gy in zip(governance, gov_y):
        draw_rounded_rect(c, gov_x, gy, 82, 18, 9, fill_color=Color(1, 1, 1, alpha=0.10), stroke_color=Color(1, 1, 1, alpha=0.20))
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 7.6); c.drawCentredString(gov_x + 41, gy + 5, label)
    base_y = panel_y + 12
    base_items = [("RAG", TEAL), ("Workflows", ORANGE), ("Analytics", CHARTREUSE)]
    for i, (label, accent) in enumerate(base_items):
        bx = margin + 174 + i * 96
        draw_rounded_rect(c, bx, base_y, 80, 18, 9, fill_color=Color(1, 1, 1, alpha=0.10), stroke_color=Color(1, 1, 1, alpha=0.20))
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 7.8); c.drawCentredString(bx + 40, base_y + 5, label)
        draw_arrow(c, bx + 40, base_y + 18, W / 2, center_y, accent, width=1.0, head=5)
    for py, accent in zip([p + chip_h / 2 for p in provider_y], [BLUE, ORANGE, TEAL]):
        draw_arrow(c, provider_x + chip_w, py, center_x, center_y + center_h / 2, accent, width=1.0, head=5)
    for gy, accent in zip([g + 9 for g in gov_y], [BLUE, TEAL]):
        draw_arrow(c, center_x + center_w, center_y + center_h / 2, gov_x, gy, accent, width=1.0, head=5)
    c.showPage()

    # ══ PAGE 4: AI COUNCIL DEEP DIVE ══
    dark_bg(c)
    y = H - margin
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 28); c.drawString(margin, y, "The AI")
    tw = c.stringWidth("The AI ", FONT_BOLD, 28); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Council")
    tw2 = c.stringWidth("Council", FONT_BOLD, 28)
    c.setFillColor(Color(1, 1, 1, alpha=0.55)); c.setFont(FONT, 14); c.drawString(margin + tw + tw2 + 10, y + 2, "\u2014 Patent Pending")
    y -= 22; c.setFillColor(Color(1, 1, 1, alpha=0.55)); c.setFont(FONT, 12)
    for line in wrap_text(c, "Our breakthrough multi-model deliberation system synthesizes collective intelligence from multiple AI providers, achieving consensus that outperforms any single model.", FONT, 12, W - 2 * margin):
        c.drawString(margin, y, line); y -= 17
    y -= 20
    stages = [
        ("1", "Diverge", "Each model independently generates its response. No model sees another's output, ensuring diversity of reasoning."),
        ("2", "Converge", "Models anonymously review and critique each other's responses. Agreements strengthen; contradictions flagged."),
        ("3", "Synthesize", "A synthesis engine combines the strongest elements into a higher-quality response with confidence scoring."),
    ]
    for num, title, desc in stages:
        draw_circle(c, margin + 14, y - 4, 14, ORANGE)
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 14); c.drawCentredString(margin + 14, y - 9, num)
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 15); c.drawString(margin + 36, y - 2, title); y -= 18
        c.setFillColor(Color(1, 1, 1, alpha=0.6)); c.setFont(FONT, 10.5)
        for line in wrap_text(c, desc, FONT, 10.5, W / 2 - margin - 20): c.drawString(margin + 36, y, line); y -= 14
        y -= 16
    metrics = [(">60%", "Win Rate vs Single Models"), (">30%", "Hallucination Reduction"), ("3+", "Models per Query"), ("100%", "Anonymized Review")]
    mx = W / 2 + 16; my = H - margin - 96; mc_w = (W / 2 - margin - 32) / 2; mc_h = 92
    for i, (num, lbl) in enumerate(metrics):
        col = i % 2; row = i // 2
        mcx = mx + col * (mc_w + 10); mcy = my - row * (mc_h + 12)
        draw_rounded_rect(c, mcx, mcy - mc_h, mc_w, mc_h, 8, fill_color=Color(1, 1, 1, alpha=0.06), stroke_color=Color(1, 1, 1, alpha=0.10))
        c.setFillColor(TEAL); c.setFont(FONT_BOLD, 28); c.drawCentredString(mcx + mc_w / 2, mcy - 34, num)
        metric_lines = wrap_text(c, lbl.upper(), FONT, 7.4, mc_w - 14)
        c.setFillColor(Color(1, 1, 1, alpha=0.45)); c.setFont(FONT, 7.4)
        label_top = mcy - mc_h + 22 + (len(metric_lines) - 1) * 4
        draw_wrapped_lines(c, metric_lines, mcx + mc_w / 2, label_top, 9, centered=True)
    band_y = 86; band_h = 148
    draw_rounded_rect(c, margin, band_y, W - 2 * margin, band_h, 10, fill_color=WHITE, stroke_color=Color(1, 1, 1, alpha=0.16))
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 10)
    c.drawString(margin + 22, band_y + band_h - 20, "COUNCIL FLOW")
    c.setFillColor(BLUE); c.setFont(FONT_BOLD, 8.5)
    c.drawString(margin + 108, band_y + band_h - 20, "DIVERGE")
    c.setFillColor(TEAL); c.drawString(margin + 265, band_y + band_h - 20, "CONVERGE")
    c.setFillColor(ORANGE); c.drawString(margin + 390, band_y + band_h - 20, "SYNTHESIZE")
    query_x = margin + 18; query_y = band_y + 50
    draw_rounded_rect(c, query_x, query_y, 62, 24, 8, fill_color=Color(0.96, 0.49, 0.29, alpha=0.14), stroke_color=ORANGE, stroke_width=1)
    c.setFillColor(ORANGE); c.setFont(FONT_BOLD, 8.8); c.drawCentredString(query_x + 31, query_y + 8, "User Query")
    model_x = query_x + 92; model_w = 68; model_h = 18
    model_boxes = [(band_y + 84, "GPT-4o"), (band_y + 56, "Claude"), (band_y + 28, "Gemini")]
    for idx, (my, label) in enumerate(model_boxes):
        accent = [BLUE, TEAL, BLUE][idx]
        draw_rounded_rect(c, model_x, my, model_w, model_h, 9, fill_color=Color(0, 0.43, 0.71, alpha=0.10), stroke_color=accent, stroke_width=1)
        c.setFillColor(accent); c.setFont(FONT_BOLD, 7.8); c.drawCentredString(model_x + model_w / 2, my + 5, label)
        draw_arrow(c, query_x + 62, query_y + 12, model_x, my + model_h / 2, ORANGE, width=1.2, head=5)
    review_x = model_x + 98; review_y = band_y + 48
    draw_rounded_rect(c, review_x, review_y, 84, 34, 10, fill_color=DARK)
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 9); c.drawCentredString(review_x + 42, review_y + 18, "Peer Review")
    c.setFillColor(Color(1, 1, 1, alpha=0.55)); c.setFont(FONT, 6.8); c.drawCentredString(review_x + 42, review_y + 8, "Anonymous • blind")
    for my in [band_y + 93, band_y + 65, band_y + 37]:
        draw_arrow(c, model_x + model_w, my, review_x, review_y + 17, BLUE, width=1.2, head=5)
    synth_x = review_x + 110; synth_y = band_y + 48
    draw_rounded_rect(c, synth_x, synth_y, 78, 34, 10, fill_color=Color(0.12, 0.67, 0.78, alpha=0.10), stroke_color=TEAL, stroke_width=1)
    c.setFillColor(TEAL); c.setFont(FONT_BOLD, 8.6); c.drawCentredString(synth_x + 39, synth_y + 18, "Synthesis")
    c.setFillColor(GREY); c.setFont(FONT, 6.8); c.drawCentredString(synth_x + 39, synth_y + 8, "confidence-ranked")
    draw_arrow(c, review_x + 84, review_y + 17, synth_x, synth_y + 17, TEAL, width=1.3, head=5)
    answer_x = synth_x + 100; answer_y = band_y + 48
    draw_rounded_rect(c, answer_x, answer_y, 72, 34, 10, fill_color=Color(0.96, 0.49, 0.29, alpha=0.10), stroke_color=ORANGE, stroke_width=1)
    c.setFillColor(ORANGE); c.setFont(FONT_BOLD, 8.4); c.drawCentredString(answer_x + 36, answer_y + 18, "Consensus")
    c.setFillColor(GREY); c.setFont(FONT, 6.8); c.drawCentredString(answer_x + 36, answer_y + 8, "final answer")
    draw_arrow(c, synth_x + 78, synth_y + 17, answer_x, answer_y + 17, ORANGE, width=1.3, head=5)
    c.showPage()

    # ══ PAGE 5: USE CASES ══
    c.setFillColor(OFF_WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - margin
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 28); c.drawString(margin, y, "Real-World")
    tw = c.stringWidth("Real-World ", FONT_BOLD, 28); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Use Cases")
    y -= 22; c.setFillColor(GREY); c.setFont(FONT, 12)
    c.drawString(margin, y, "How organizations leverage Chat.AI to transform their AI operations."); y -= 40
    use_cases = [
        (BLUE, "Financial Services", "Compliance-First AI", "200-person firm needed AI for research without data leaks or hallucinated advice.", ["Research without data leakage", "Audit-ready answers for reviewers"], "$19,212", "Annual Savings"),
        (ORANGE, "Healthcare", "HIPAA-Compliant AI KB", "Clinical staff needed AI search across protocols with full HIPAA audit trails.", ["Clinical policy search in seconds", "Protected PHI boundaries by design"], "100%", "Audit Coverage"),
        (TEAL, "Technology", "Multi-Model Dev Platform", "100+ developers needed multiple AI models without managing separate subscriptions.", ["One workspace across major models", "Shared prompts, assistants, and threads"], "$174K", "Annual Savings"),
    ]
    uc_w = (W - 2 * margin - 32) / 3; uc_h = 318
    for i, (color, persona, title, desc, proof_points, metric, lbl) in enumerate(use_cases):
        ux = margin + i * (uc_w + 16); uy = y
        draw_rounded_rect(c, ux, uy - uc_h, uc_w, uc_h, 8, fill_color=WHITE, stroke_color=LIGHT_GREY)
        c.setFillColor(color); c.rect(ux, uy - 3, uc_w, 3, fill=1, stroke=0)
        draw_rounded_rect(c, ux + 12, uy - 36, uc_w - 24, 20, 10, fill_color=OFF_WHITE, stroke_color=LIGHT_GREY)
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 9); c.drawCentredString(ux + uc_w / 2, uy - 31, persona)
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 12); ty = uy - 56
        for line in wrap_text(c, title, FONT_BOLD, 12, uc_w - 24): c.drawString(ux + 12, ty, line); ty -= 16
        c.setFillColor(GREY); c.setFont(FONT, 10); ty -= 4
        for line in wrap_text(c, desc, FONT, 10, uc_w - 24): c.drawString(ux + 12, ty, line); ty -= 14
        ty -= 6
        for proof in proof_points:
            proof_lines = wrap_text(c, proof, FONT, 8.5, uc_w - 36)
            draw_check(c, ux + 12, ty, 8)
            c.setFillColor(GREY); c.setFont(FONT, 8.5)
            draw_wrapped_lines(c, proof_lines, ux + 24, ty, 10)
            ty -= max(12, len(proof_lines) * 10 + 2)
        res_h = 52; res_y = uy - uc_h + 12
        draw_rounded_rect(c, ux + 12, res_y, uc_w - 24, res_h, 6, fill_color=DARK)
        c.setFillColor(TEAL); c.setFont(FONT_BOLD, 22); c.drawCentredString(ux + uc_w / 2, res_y + 26, metric)
        c.setFillColor(Color(1, 1, 1, alpha=0.50)); c.setFont(FONT, 8); c.drawCentredString(ux + uc_w / 2, res_y + 10, lbl.upper())
    panel_y = 86; panel_h = 128
    draw_rounded_rect(c, margin, panel_y, W - 2 * margin, panel_h, 10, fill_color=WHITE, stroke_color=LIGHT_GREY)
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 16); c.drawString(margin + 18, panel_y + panel_h - 28, "What Winning Deployments Have In Common")
    c.setFillColor(GREY); c.setFont(FONT, 10)
    c.drawString(margin + 18, panel_y + panel_h - 46, "Teams standardize on Chat.AI when they need security, model choice, and cost control at the same time.")
    win_items = [
        (BLUE, "Governed Access", "SSO, RBAC, and audit trails make adoption safe for regulated teams."),
        (ORANGE, "Reusable Knowledge", "Assistants and RAG content spread successful patterns faster."),
        (TEAL, "Transparent Spend", "Leaders can finally see where AI budget is going and optimize it."),
    ]
    wi_w = (W - 2 * margin - 36) / 3
    for i, (accent, title, body) in enumerate(win_items):
        wx = margin + 18 + i * wi_w
        if i:
            c.setStrokeColor(LIGHT_GREY); c.setLineWidth(0.6)
            c.line(wx - 6, panel_y + 18, wx - 6, panel_y + panel_h - 18)
        c.setFillColor(accent); c.setFont(FONT_BOLD, 13); c.drawString(wx, panel_y + 54, title)
        c.setFillColor(GREY); c.setFont(FONT, 8.8)
        draw_wrapped_lines(c, wrap_text(c, body, FONT, 8.8, wi_w - 12), wx, panel_y + 36, 11)
    c.showPage()

    # ══ PAGE 6: PRICING ══
    c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - margin
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 28); c.drawString(margin, y, "Plans &")
    tw = c.stringWidth("Plans & ", FONT_BOLD, 28); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Pricing")
    y -= 22; c.setFillColor(GREY); c.setFont(FONT, 12)
    c.drawString(margin, y, "Simple, transparent pricing. Annual plans save 17%. No per-seat charges."); y -= 40
    tiers = [
        ("Starter", "$299", "$2,990/yr", False, "Pilot teams and secure AI evaluation", ["Up to 10 users", "10M tokens/month", "Multi-model access", "Azure AD SSO", "Basic audit trail", "Email support"]),
        ("Growth", "$899", "$8,990/yr", False, "Department rollouts with shared knowledge", ["Up to 50 users", "35M tokens/month", "Custom assistants", "RAG knowledge base", "Full audit trail", "Priority support"]),
        ("Professional", "$1,699", "$16,990/yr", True, "Organization-wide AI operations", ["Up to 100 users", "75M tokens/month", "AI Council included", "N8N automation", "Advanced analytics", "Dedicated CSM"]),
        ("Enterprise", "Custom", "Contact us", False, "Regulated or isolated deployments", ["250+ users", "200M+ tokens", "On-premise ($45K/yr)", "Custom integrations", "SLA guarantees", "24/7 phone support"]),
    ]
    tier_w = (W - 2 * margin - 48) / 4; tier_h = 360
    for i, (name, price, annual, popular, best_for, feats) in enumerate(tiers):
        tx = margin + i * (tier_w + 16); ty = y
        stroke = BLUE if popular else LIGHT_GREY
        draw_rounded_rect(c, tx, ty - tier_h, tier_w, tier_h, 8, fill_color=WHITE, stroke_color=stroke, stroke_width=1.5 if popular else 0.5)
        c.setFillColor(BLUE if popular else LIGHT_GREY); c.rect(tx, ty - 3, tier_w, 3, fill=1, stroke=0)
        iy = ty - 20
        if popular:
            draw_rounded_rect(c, tx + (tier_w - 70) / 2, iy - 2, 70, 16, 8, fill_color=BLUE)
            c.setFillColor(WHITE); c.setFont(FONT_BOLD, 7); c.drawCentredString(tx + tier_w / 2, iy + 2, "MOST POPULAR"); iy -= 22
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 14); c.drawCentredString(tx + tier_w / 2, iy - 6, name); iy -= 26
        c.setFillColor(BLUE); c.setFont(FONT_BOLD, 26); c.drawCentredString(tx + tier_w / 2, iy - 4, price); iy -= 20
        c.setFillColor(HexColor('#ADB5BD')); c.setFont(FONT, 9); c.drawCentredString(tx + tier_w / 2, iy, annual); iy -= 24
        for feat in feats:
            draw_check(c, tx + 10, iy, 9); c.setFillColor(GREY); c.setFont(FONT, 9); c.drawString(tx + 24, iy, feat); iy -= 16
        footer_h = 54; footer_y = ty - tier_h + 14
        footer_fill = Color(0, 0.43, 0.71, alpha=0.05) if popular else OFF_WHITE
        draw_rounded_rect(c, tx + 8, footer_y, tier_w - 16, footer_h, 6, fill_color=footer_fill, stroke_color=stroke if popular else LIGHT_GREY, stroke_width=0.6)
        c.setFillColor(BLUE if popular else GREY); c.setFont(FONT_BOLD, 7.5); c.drawCentredString(tx + tier_w / 2, footer_y + footer_h - 14, "BEST FOR")
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 8.2)
        draw_wrapped_lines(c, wrap_text(c, best_for, FONT_BOLD, 8.2, tier_w - 30), tx + tier_w / 2, footer_y + footer_h - 28, 9, centered=True)
    panel_y = 82; panel_h = 120
    draw_rounded_rect(c, margin, panel_y, W - 2 * margin, panel_h, 10, fill_color=OFF_WHITE, stroke_color=LIGHT_GREY)
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 16); c.drawString(margin + 18, panel_y + panel_h - 28, "All Plans Include The Essentials")
    pricing_notes = [
        (BLUE, "No Seat Tax", "Pricing scales by token capacity, not by every additional employee."),
        (ORANGE, "Annual Savings", "Yearly billing reduces cost by roughly 17% for committed teams."),
        (TEAL, "Deployment Flexibility", "Cloud plans scale fast, with on-premise available for isolated environments."),
    ]
    pn_w = (W - 2 * margin - 36) / 3
    for i, (accent, title, body) in enumerate(pricing_notes):
        px = margin + 18 + i * pn_w
        if i:
            c.setStrokeColor(LIGHT_GREY); c.setLineWidth(0.6)
            c.line(px - 6, panel_y + 18, px - 6, panel_y + panel_h - 18)
        c.setFillColor(accent); c.setFont(FONT_BOLD, 13); c.drawString(px, panel_y + 50, title)
        c.setFillColor(GREY); c.setFont(FONT, 8.8)
        draw_wrapped_lines(c, wrap_text(c, body, FONT, 8.8, pn_w - 12), px, panel_y + 34, 11)
    c.showPage()

    # ══ PAGE 7: COMPARISON + ROI ══
    c.setFillColor(OFF_WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - margin
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 28); c.drawString(margin, y, "Competitive")
    tw = c.stringWidth("Competitive ", FONT_BOLD, 28); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Comparison")
    y -= 22; c.setFillColor(GREY); c.setFont(FONT, 11)
    c.drawString(margin, y, "Chat.AI combines enterprise controls with lower total cost than separate AI subscriptions."); y -= 24
    col_widths = [130, 85, 100, 85, 100]; headers = ["Capability", "ChatGPT", "Copilot", "Gemini", "Chat.AI"]
    rows = [
        ["Multi-Model", "\u2014", "\u2014", "\u2014", "\u2713 4+ Providers"], ["AI Council", "\u2014", "\u2014", "\u2014", "\u2713 Patent Pending"],
        ["Cost Tracking", "\u2014", "\u2014", "\u2014", "\u2713 Token-Level"], ["On-Premise", "\u2014", "\u2014", "\u2014", "\u2713 Full Stack"],
        ["Audit Trail", "\u2014", "Limited", "Limited", "\u2713 Full"], ["Automation", "\u2014", "\u2014", "\u2014", "\u2713 N8N"],
        ["RAG/KB", "\u2014", "Basic", "\u2014", "\u2713 Vector Search"], ["Assistants", "GPTs", "\u2014", "Gems", "\u2713 Full Platform"],
        ["50 Users/mo", "$1,250", "$1,500", "$1,000", "$899"],
    ]
    row_h = 23
    tx = margin
    for i, (hdr, cw) in enumerate(zip(headers, col_widths)):
        c.setFillColor(BLUE if i == len(headers) - 1 else DARK); c.rect(tx, y - row_h, cw, row_h, fill=1, stroke=0)
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 9); c.drawString(tx + 6, y - row_h + 7, hdr); tx += cw
    y -= row_h
    for ri, row in enumerate(rows):
        tx = margin
        for ci, (cell, cw) in enumerate(zip(row, col_widths)):
            bg = OFF_WHITE if ri % 2 == 0 else WHITE
            if ci == len(row) - 1: bg = Color(0, 0.43, 0.71, alpha=0.05) if ri % 2 == 0 else Color(0, 0.43, 0.71, alpha=0.03)
            c.setFillColor(bg); c.rect(tx, y - row_h, cw, row_h, fill=1, stroke=0)
            if ci == len(row) - 1 and '\u2713' in cell: c.setFillColor(TEAL); c.setFont(FONT_BOLD, 9.5)
            elif cell == "\u2014": c.setFillColor(HexColor('#BBBBBB')); c.setFont(FONT, 9.5)
            elif ci == len(row) - 1: c.setFillColor(BLUE); c.setFont(FONT_BOLD, 9.5)
            else: c.setFillColor(GREY); c.setFont(FONT, 9.5)
            c.drawString(tx + 6, y - row_h + 7, cell); tx += cw
        y -= row_h
    y -= 30
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 22); c.drawString(margin, y, "Return on")
    tw = c.stringWidth("Return on ", FONT_BOLD, 22); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Investment"); y -= 24
    roi_data = [("Small Team \u2022 10 Users", "$389 \u2192 $299/mo", "$1,080/yr", BLUE), ("Mid-Market \u2022 50 Users", "$2,500 \u2192 $899/mo", "$19,212/yr", ORANGE), ("Enterprise \u2022 250 Users", "$18.5K \u2192 $3,999/mo", "$174,012/yr", TEAL)]
    rc_w = (W - 2 * margin - 32) / 3; rc_h = 100
    for i, (label, cost, save, color) in enumerate(roi_data):
        rx = margin + i * (rc_w + 16); ry = y - 10
        draw_rounded_rect(c, rx, ry - rc_h, rc_w, rc_h, 8, fill_color=DARK)
        c.setFillColor(color); c.rect(rx, ry - 3, rc_w, 3, fill=1, stroke=0)
        c.setFillColor(Color(1, 1, 1, alpha=0.50)); c.setFont(FONT, 9); c.drawCentredString(rx + rc_w / 2, ry - 22, label)
        c.setFillColor(Color(1, 1, 1, alpha=0.60)); c.setFont(FONT, 9); c.drawCentredString(rx + rc_w / 2, ry - 38, cost)
        c.setFillColor(CHARTREUSE); c.setFont(FONT_BOLD, 24); c.drawCentredString(rx + rc_w / 2, ry - 74, save)
    panel_y = 78; panel_h = 124
    draw_rounded_rect(c, margin, panel_y, W - 2 * margin, panel_h, 10, fill_color=WHITE, stroke_color=LIGHT_GREY)
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 12); c.drawString(margin + 18, panel_y + panel_h - 22, "BEFORE VS. AFTER AI SPEND")
    roi_columns = [
        ("Small Team", "$389/mo", "$299/mo", "$1,080/yr", BLUE),
        ("Mid-Market", "$2,500/mo", "$899/mo", "$19,212/yr", ORANGE),
        ("Enterprise", "$18.5K/mo", "$3,999/mo", "$174,012/yr", TEAL),
    ]
    col_w = (W - 2 * margin - 44) / 3
    for i, (label, before_cost, after_cost, savings, accent) in enumerate(roi_columns):
        cx = margin + 16 + i * (col_w + 6)
        if i:
            c.setStrokeColor(LIGHT_GREY); c.setLineWidth(0.6)
            c.line(cx - 6, panel_y + 18, cx - 6, panel_y + panel_h - 18)
        c.setFillColor(accent); c.setFont(FONT_BOLD, 10.5); c.drawString(cx, panel_y + 84, label)
        c.setFillColor(GREY); c.setFont(FONT_BOLD, 7.2); c.drawString(cx, panel_y + 68, "BEFORE")
        draw_rounded_rect(c, cx, panel_y + 48, col_w - 18, 14, 7, fill_color=Color(0.89, 0.16, 0.16, alpha=0.12), stroke_color=HexColor('#E63946'), stroke_width=0.8)
        c.setFillColor(HexColor('#E63946')); c.setFont(FONT_BOLD, 8.6); c.drawRightString(cx + col_w - 26, panel_y + 52, before_cost)
        c.setFillColor(GREY); c.setFont(FONT_BOLD, 7.2); c.drawString(cx, panel_y + 34, "AFTER")
        after_width = (col_w - 18) * [299 / 389, 899 / 2500, 3999 / 18500][i]
        draw_rounded_rect(c, cx, panel_y + 14, after_width, 14, 7, fill_color=Color(0.12, 0.67, 0.78, alpha=0.16), stroke_color=TEAL, stroke_width=0.8)
        c.setFillColor(TEAL); c.setFont(FONT_BOLD, 8.6); c.drawString(cx + 8, panel_y + 18, after_cost)
        save_w = col_w - 48
        draw_rounded_rect(c, cx, panel_y + 1, save_w, 16, 8, fill_color=Color(0.80, 0.86, 0.18, alpha=0.16), stroke_color=HexColor('#91AA1E'), stroke_width=0.8)
        c.setFillColor(CHARTREUSE); c.setFont(FONT_BOLD, 8.4); c.drawCentredString(cx + save_w / 2, panel_y + 5, f"SAVE {savings}")
    c.showPage()

    # ══ PAGE 8: SECURITY + CTA ══
    c.setFillColor(WHITE); c.rect(0, 0, W, H, fill=1, stroke=0)
    y = H - margin
    c.setFillColor(DARK); c.setFont(FONT_BOLD, 24); c.drawString(margin, y, "Security &")
    tw = c.stringWidth("Security & ", FONT_BOLD, 24); c.setFillColor(ORANGE); c.drawString(margin + tw, y, "Compliance"); y -= 22
    c.setFillColor(GREY); c.setFont(FONT, 11)
    c.drawString(margin, y, "Built for organizations that need control, traceability, and deployment flexibility."); y -= 28
    sec_items = [
        (BLUE, "Azure AD SSO", "Microsoft identity SSO"), (ORANGE, "Row-Level Security", "Complete tenant isolation"),
        (TEAL, "Full Audit Trail", "Every interaction logged"), (DARK, "Azure Key Vault", "Secrets with auto-rotation"),
        (BLUE, "Prompt Injection Defense", "Multi-layer validation"), (ORANGE, "HIPAA / SOC 2 Ready", "Healthcare & financial ready"),
        (TEAL, "RBAC Roles", "Granular access control"), (DARK, "Rate Limiting", "Per-user endpoint controls"),
    ]
    sb_w = (W - 2 * margin - 18) / 2; sb_h = 72
    for i, (color, title, desc) in enumerate(sec_items):
        col = i % 2; row = i // 2
        sx = margin + col * (sb_w + 18); sy = y - row * (sb_h + 10)
        draw_rounded_rect(c, sx, sy - sb_h, sb_w, sb_h, 6, fill_color=WHITE, stroke_color=LIGHT_GREY)
        draw_rounded_rect(c, sx + 12, sy - 40, 28, 28, 8, fill_color=color)
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 14); c.drawCentredString(sx + 26, sy - 36, "\u2713")
        title_lines = wrap_text(c, title, FONT_BOLD, 10.3, sb_w - 64)
        desc_lines = wrap_text(c, desc, FONT, 8.7, sb_w - 64)
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 10.3)
        draw_wrapped_lines(c, title_lines, sx + 50, sy - 22, 12)
        c.setFillColor(GREY); c.setFont(FONT, 8.7)
        desc_top = sy - 24 - len(title_lines) * 12 - 2
        draw_wrapped_lines(c, desc_lines, sx + 50, desc_top, 10)
    # Bottom CTA
    cta_top = 312
    c.setFillColor(BLUE); c.rect(0, 0, W, cta_top, fill=1, stroke=0)
    c.setFillColor(Color(0, 0.2, 0.4, alpha=0.35)); c.rect(W * 0.5, 0, W * 0.5, cta_top, fill=1, stroke=0)
    cy = cta_top - 64
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 25); c.drawCentredString(W / 2, cy, "Ready to Transform Your AI Strategy?"); cy -= 26
    c.setFillColor(Color(1, 1, 1, alpha=0.72)); c.setFont(FONT, 12); c.drawCentredString(W / 2, cy, "Schedule a demo and see how Chat.AI saves your organization thousands."); cy -= 34
    trust_items = ["SSO + RBAC", "Full Audit Trail", "On-Premise Available"]
    pill_w = 124; pill_h = 22; pill_gap = 10
    pill_start = W / 2 - (len(trust_items) * pill_w + (len(trust_items) - 1) * pill_gap) / 2
    for i, item in enumerate(trust_items):
        px = pill_start + i * (pill_w + pill_gap)
        draw_rounded_rect(c, px, cy - pill_h + 6, pill_w, pill_h, 11, stroke_color=Color(1, 1, 1, alpha=0.28), stroke_width=1)
        c.setFillColor(WHITE); c.setFont(FONT_BOLD, 8); c.drawCentredString(px + pill_w / 2, cy - 9, item)
    cy -= 42
    draw_rounded_rect(c, W / 2 - 170, cy - 36, 160, 36, 6, fill_color=ORANGE)
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 12); c.drawCentredString(W / 2 - 90, cy - 24, "Schedule a Demo")
    draw_rounded_rect(c, W / 2 + 10, cy - 36, 160, 36, 6, stroke_color=Color(1, 1, 1, alpha=0.35), stroke_width=1.5)
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 12); c.drawCentredString(W / 2 + 90, cy - 24, "Call 949.379.8500")
    cy -= 60
    c.setFillColor(Color(1, 1, 1, alpha=0.60)); c.setFont(FONT, 11)
    c.drawCentredString(W / 2, cy, "Ravi Jain  \u2014  RJain@technijian.com  \u2022  949.379.8500"); cy -= 16
    c.drawCentredString(W / 2, cy, "18 Technology Dr. Ste 141, Irvine CA 92618")
    c.showPage()

    # ══ BACK COVER ══
    dark_bg(c)
    draw_brand_logo(c, W / 2, H / 2 + 120, width=220)
    c.setFillColor(WHITE); c.setFont(FONT_BOLD, 28); c.drawCentredString(W / 2, H / 2 + 20, "Chat.AI")
    c.setFillColor(Color(1, 1, 1, alpha=0.58)); c.setFont(FONT_BOLD, 15); c.drawCentredString(W / 2, H / 2 - 8, "Technijian Enterprise AI Platform")
    c.setFillColor(Color(1, 1, 1, alpha=0.50)); c.setFont(FONT, 15); c.drawCentredString(W / 2, H / 2 - 38, "Enterprise AI, Reimagined.")
    c.setFillColor(TEAL); c.setFont(FONT_BOLD, 14); c.drawCentredString(W / 2, H / 2 - 74, "technijian.com/chat-ai")
    c.setFillColor(Color(1, 1, 1, alpha=0.50)); c.setFont(FONT, 11); c.drawCentredString(W / 2, H / 2 - 106, "Schedule a demo: RJain@technijian.com  •  949.379.8500")
    c.setFillColor(Color(1, 1, 1, alpha=0.30)); c.setFont(FONT, 8); c.drawCentredString(W / 2, 30, "\u00a9 2026 Technijian  \u2022  18 Technology Dr. Ste 141, Irvine CA 92618")

    c.save()
    size_kb = os.path.getsize(PDF_PATH) / 1024
    print(f"PDF generated: {PDF_PATH} ({size_kb:.0f} KB)")


if __name__ == '__main__':
    build()
