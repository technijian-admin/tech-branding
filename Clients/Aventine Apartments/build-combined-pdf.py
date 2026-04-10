"""
Build a combined PDF: Cover Letter + Resume for The Aventine at Aliso Viejo
Technijian branded, using reportlab with Calibri fonts.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus.flowables import HRFlowable

# ── Register fonts ──
FONTS = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("Cal", f"{FONTS}/calibri.ttf"))
pdfmetrics.registerFont(TTFont("CalB", f"{FONTS}/calibrib.ttf"))
pdfmetrics.registerFont(TTFont("CalI", f"{FONTS}/calibrii.ttf"))
pdfmetrics.registerFont(TTFont("CalBI", f"{FONTS}/calibriz.ttf"))
pdfmetrics.registerFontFamily("Cal", normal="Cal", bold="CalB", italic="CalI", boldItalic="CalBI")

# ── Brand colors ──
BLUE = HexColor("#006DB6")
ORANGE = HexColor("#F67D4B")
DARK = HexColor("#1A1A2E")
GREY = HexColor("#59595B")
TEAL = HexColor("#1EAAC8")
LGREY = HexColor("#E9ECEF")
OFFWH = HexColor("#F8F9FA")
WHITE = HexColor("#FFFFFF")

# ── Styles ──
S_BODY = ParagraphStyle("body", fontName="Cal", fontSize=10.5, leading=14, textColor=GREY, spaceAfter=6)
S_BODY_SM = ParagraphStyle("bodysm", fontName="Cal", fontSize=9.5, leading=13, textColor=GREY, spaceAfter=4)
S_BOLD = ParagraphStyle("bold", fontName="CalB", fontSize=10.5, leading=14, textColor=DARK, spaceAfter=6)
S_SECTION = ParagraphStyle("section", fontName="CalB", fontSize=13, leading=16, textColor=BLUE, spaceBefore=14, spaceAfter=4)
S_SUBSEC = ParagraphStyle("subsec", fontName="CalB", fontSize=10.5, leading=14, textColor=TEAL, spaceBefore=8, spaceAfter=4)
S_NAME = ParagraphStyle("name", fontName="CalB", fontSize=22, leading=26, textColor=WHITE)
S_TITLE = ParagraphStyle("title", fontName="Cal", fontSize=11, leading=14, textColor=TEAL)
S_CONTACT = ParagraphStyle("contact", fontName="Cal", fontSize=9, leading=12, textColor=HexColor("#C0C0C0"))
S_CENTER = ParagraphStyle("center", fontName="Cal", fontSize=9.5, leading=12, textColor=GREY, alignment=TA_CENTER)
S_DATE = ParagraphStyle("date", fontName="Cal", fontSize=10.5, leading=14, textColor=GREY)
S_CLOSING = ParagraphStyle("closing", fontName="CalB", fontSize=10.5, leading=14, textColor=DARK)

W, H = letter
MARGIN = 0.75 * inch

LOGO = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "logos", "png", "technijian-logo-full-color-600x125.png")


def accent_bar(color=BLUE, thickness=3):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=4, spaceBefore=0)


def section_hdr(title):
    """Blue left-bar section header."""
    t = Table(
        [[Paragraph(title.upper(), S_SECTION)]],
        colWidths=[W - 2 * MARGIN],
        rowHeights=[None],
    )
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LINEBEFOREFROMEDGE", (0, 0), (0, -1), 4, BLUE),
    ]))
    return t


def name_banner():
    """Dark charcoal banner with name and title."""
    content = [
        Paragraph("RAVI JAIN", S_NAME),
        Spacer(1, 4),
        Paragraph(
            '<font name="Cal" color="#1EAAC8">AI Strategy &amp; Implementation Consultant</font>'
            '  <font name="Cal" color="#59595B">|</font>  '
            '<font name="Cal" color="#F67D4B">Founder &amp; CEO, Technijian</font>',
            ParagraphStyle("t2", fontName="Cal", fontSize=11, leading=14)
        ),
        Spacer(1, 4),
        Paragraph("Irvine, CA  \u2022  rjain@technijian.com  \u2022  (949) 379-8499 x201  \u2022  technijian.com", S_CONTACT),
    ]
    t = Table([[content]], colWidths=[W - 2 * MARGIN])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return t


def cap_bullet(text):
    return Paragraph(f'<font name="CalB" color="#F67D4B">\u25b8</font> {text}', S_BODY_SM)


def blue_bullet(text):
    return Paragraph(f'<font name="CalB" color="#006DB6">\u2022</font> {text}', S_BODY_SM)


def tag_row(label, value):
    t = Table(
        [[Paragraph(label, ParagraphStyle("tl", fontName="CalB", fontSize=9, textColor=WHITE, leading=12)),
          Paragraph(value, ParagraphStyle("tv", fontName="Cal", fontSize=9, textColor=GREY, leading=12))]],
        colWidths=[1.5 * inch, W - 2 * MARGIN - 1.5 * inch]
    )
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), BLUE),
        ("BACKGROUND", (1, 0), (1, 0), OFFWH),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def value_table():
    data = [
        ["AI to Execution", "Turn AI from a vague initiative into an executable roadmap with clear phases, ownership, controls, and ROI logic"],
        ["Built for Real Business", "Design solutions usable inside real businesses with security, compliance, and operational constraints"],
        ["Strategy + Implementation", "Combine consulting judgment with hands-on implementation depth, reducing the gap between recommendations and deployment"],
        ["Operator Mindset", "25+ years running a technology business \u2014 adoption, workflows, governance, and measurable outcomes"],
    ]
    rows = []
    colors_l = [BLUE, TEAL, BLUE, TEAL]
    colors_r = [OFFWH, WHITE, OFFWH, WHITE]
    for i, (lbl, val) in enumerate(data):
        rows.append([
            Paragraph(lbl, ParagraphStyle("vl", fontName="CalB", fontSize=9, textColor=WHITE, leading=12)),
            Paragraph(val, ParagraphStyle("vr", fontName="Cal", fontSize=9, textColor=GREY, leading=12)),
        ])
    t = Table(rows, colWidths=[1.6 * inch, W - 2 * MARGIN - 1.6 * inch])
    style_cmds = [
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]
    for i in range(4):
        style_cmds.append(("BACKGROUND", (0, i), (0, i), colors_l[i]))
        style_cmds.append(("BACKGROUND", (1, i), (1, i), colors_r[i]))
    t.setStyle(TableStyle(style_cmds))
    return t


def engagement_table():
    cols = [
        ("FIXED-SCOPE PROJECTS", "Defined scope, deliverables, and timeline. Pay for outcomes, not hours. Ideal for discrete initiatives like AI Readiness Assessments or Document Intelligence.", DARK),
        ("FLEXIBLE CONSULTING", "On-demand engagement for ongoing strategic guidance, architecture reviews, implementation support, or supplementing your team on AI initiatives as needs evolve.", BLUE),
        ("FRACTIONAL AI ADVISOR", "Retained monthly engagement providing ongoing strategic AI guidance, vendor evaluation, team enablement, and implementation oversight on a predictable cadence.", TEAL),
    ]
    cw = (W - 2 * MARGIN) / 3
    row = []
    for title, desc, bg in cols:
        cell = [
            Paragraph(title, ParagraphStyle("et", fontName="CalB", fontSize=9.5, textColor=WHITE, leading=12, alignment=TA_CENTER)),
            Spacer(1, 4),
            Paragraph(desc, ParagraphStyle("ed", fontName="Cal", fontSize=8.5, textColor=HexColor("#D0D0D0"), leading=11, alignment=TA_CENTER)),
        ]
        row.append(cell)
    t = Table([row], colWidths=[cw] * 3)
    style = [
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    for i, (_, _, bg) in enumerate(cols):
        style.append(("BACKGROUND", (i, 0), (i, 0), bg))
    t.setStyle(TableStyle(style))
    return t


def project_table():
    header = ["PROJECT", "DESCRIPTION"]
    rows = [
        ["AI Readiness Assessment", "Discovery engagement to map current workflows across leasing, resident services, maintenance, marketing, and property operations; identify top AI opportunities ranked by ROI and feasibility; deliver an executive-ready roadmap"],
        ["AI Leasing Intelligence", "AI-powered lead scoring, prospect journey analytics, automated follow-up workflows, tour scheduling optimization, and conversion rate prediction to maximize occupancy and reduce vacancy loss"],
        ["Resident Experience AI", "AI-driven resident communication platform: smart maintenance request routing, predictive service scheduling, automated renewal campaigns, and sentiment analysis to improve retention rates"],
        ["Smart Maintenance &amp; Operations", "AI-assisted work order prioritization, predictive maintenance scheduling for HVAC/plumbing/appliances, vendor coordination optimization, and cost variance detection across the property"],
        ["AI Document Intelligence", "Automated processing of lease agreements, rental applications, move-in/move-out inspections, vendor contracts, and compliance documentation \u2014 dramatically reducing manual review time"],
        ["Executive AI Briefing", "Half-day leadership workshop: multifamily AI landscape, live demos tailored to The Aventine, competitive positioning, and prioritized opportunity assessment"],
    ]
    hs = ParagraphStyle("th", fontName="CalB", fontSize=9, textColor=WHITE, leading=12)
    ns = ParagraphStyle("tn", fontName="CalB", fontSize=9, textColor=DARK, leading=12)
    ds = ParagraphStyle("td", fontName="Cal", fontSize=9, textColor=GREY, leading=12)
    data = [[Paragraph(h, hs) for h in header]]
    for name, desc in rows:
        data.append([Paragraph(name, ns), Paragraph(desc, ds)])
    cw = [1.8 * inch, W - 2 * MARGIN - 1.8 * inch]
    t = Table(data, colWidths=cw)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 1), (-1, -1), 0.5, LGREY),
    ]
    t.setStyle(TableStyle(style))
    return t


# ── Header/Footer ──
def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    # Header: logo + blue line
    if os.path.exists(LOGO):
        canvas_obj.drawImage(LOGO, MARGIN, H - 0.55 * inch, width=1.4 * inch, height=0.29 * inch, preserveAspectRatio=True, mask="auto")
    canvas_obj.setStrokeColor(BLUE)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(MARGIN, H - 0.62 * inch, W - MARGIN, H - 0.62 * inch)
    # Footer
    canvas_obj.setStrokeColor(LGREY)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(MARGIN, 0.55 * inch, W - MARGIN, 0.55 * inch)
    canvas_obj.setFont("Cal", 7.5)
    canvas_obj.setFillColor(GREY)
    canvas_obj.drawCentredString(W / 2, 0.4 * inch,
        f"Technijian Corporation | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8500  \u2022  Page {canvas_obj.getPageNumber()}")
    canvas_obj.restoreState()


# ═══════════════════════════════════════════
#  BUILD STORY
# ═══════════════════════════════════════════
story = []

# ─── COVER LETTER (Pages 1-2) ───
story.append(Spacer(1, 6))
story.append(Paragraph("April 9, 2026", S_DATE))
story.append(Spacer(1, 12))
story.append(Paragraph("<b>The Aventine at Aliso Viejo</b>", S_BOLD))
story.append(Paragraph("Attn: Property Management", S_BODY))
story.append(Paragraph("22501 Chase", S_BODY))
story.append(Paragraph("Aliso Viejo, CA 92656", S_BODY))
story.append(Spacer(1, 12))
story.append(Paragraph("<b>Dear Management Team,</b>", S_BOLD))
story.append(Spacer(1, 6))

story.append(Paragraph(
    'I\u2019m writing to introduce <font name="CalB" color="#006DB6">Technijian Corporation</font> '
    'and the AI consulting services we provide to premier multifamily residential communities. '
    'As a luxury apartment community in Aliso Viejo offering <b>resort-style amenities, modern floor plans, '
    'and a commitment to exceptional resident experiences</b>, The Aventine represents exactly the type of '
    'quality-focused property where targeted AI adoption can elevate operations, leasing velocity, and resident '
    'satisfaction \u2014 without disrupting what already works.', S_BODY))

story.append(Paragraph(
    'I\u2019m Ravi Jain, Founder &amp; CEO of Technijian, an AI strategy and implementation consulting firm based in Irvine. '
    'I\u2019ve spent 25+ years helping organizations across real estate, property management, financial services, and professional services '
    'move from AI curiosity to operational deployment. My approach is practical: identify where AI creates measurable value, '
    'design solutions that respect your existing workflows and compliance requirements, then implement and operationalize them.', S_BODY))

story.append(Spacer(1, 6))
story.append(section_hdr("WHY THE AVENTINE AT ALISO VIEJO"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    'Your community has qualities that make AI adoption both high-impact and low-risk: a premium positioning in the competitive '
    'South Orange County multifamily market; a comprehensive amenity package including resort-style pool, 24-hour fitness center, and '
    'heated spa that demands sophisticated operational coordination; a pet-friendly policy that broadens your resident base; '
    'and a leasing operation managing diverse floor plans across a wide price range ($1,795\u2013$2,790/month) that requires '
    'precision in pricing, availability management, and prospect engagement.', S_BODY))
story.append(Paragraph(
    'Based on my review of your operations and market position, I see several areas where AI can deliver '
    '<b>immediate, measurable ROI</b> for The Aventine:', S_BODY))

story.append(Spacer(1, 6))
story.append(section_hdr("PROPOSED AI CONSULTING PROJECTS"))
story.append(Spacer(1, 4))
story.append(project_table())

story.append(Spacer(1, 8))
story.append(section_hdr("ENGAGEMENT OPTIONS"))
story.append(Spacer(1, 4))
story.append(engagement_table())

story.append(Spacer(1, 8))
story.append(section_hdr("WHY TECHNIJIAN"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    '<font name="CalB" color="#F67D4B">\u25b8 Local Expertise:</font> '
    'We\u2019re based in Irvine \u2014 minutes from Aliso Viejo \u2014 and understand the South Orange County '
    'multifamily landscape, the competitive dynamics, resident expectations, and market conditions that shape your business.', S_BODY))
story.append(Paragraph(
    '<font name="CalB" color="#F67D4B">\u25b8 Strategy + Implementation:</font> '
    'Unlike pure strategy consultants, we don\u2019t hand you a slide deck and walk away. '
    'We architect, build, and operationalize solutions through to production.', S_BODY))
story.append(Paragraph(
    '<font name="CalB" color="#F67D4B">\u25b8 Property Management Experience:</font> '
    'We serve property management firms, multifamily operators, and real estate developers as core verticals \u2014 '
    'we understand the operational complexity of managing leasing pipelines, maintenance workflows, resident communications, '
    'and vendor relationships.', S_BODY))
story.append(Paragraph(
    '<font name="CalB" color="#F67D4B">\u25b8 Proven AI Delivery:</font> '
    'We\u2019ve deployed AI document intelligence for FINRA broker-dealers, multi-agent automation platforms, '
    'and enterprise-grade LLM workflows \u2014 with the same rigor we\u2019d bring to The Aventine.', S_BODY))

story.append(Spacer(1, 8))
story.append(Paragraph(
    'As a neighboring Irvine-based company, I\u2019d welcome the opportunity to schedule a 30-minute introductory call to discuss how AI can strengthen '
    'The Aventine\u2019s leasing operations, resident satisfaction, and competitive positioning. An '
    '<font name="CalB" color="#006DB6">Executive AI Briefing</font> is a great starting point \u2014 or we can begin with a comprehensive '
    '<font name="CalB" color="#006DB6">AI Readiness Assessment</font> for a deeper, actionable engagement.', S_BODY))

story.append(Spacer(1, 6))
story.append(Paragraph("Looking forward to the conversation.", S_BODY))
story.append(Spacer(1, 10))
story.append(Paragraph("<b>Ravi Jain</b>", S_CLOSING))
story.append(Paragraph('<font name="CalB" color="#006DB6">Founder &amp; CEO, Technijian Corporation</font>',
    ParagraphStyle("sig2", fontName="Cal", fontSize=10.5, leading=14, textColor=BLUE)))
story.append(Paragraph("AI Strategy &amp; Implementation Consulting", S_BODY_SM))
story.append(Paragraph("rjain@technijian.com  \u2022  (949) 379-8499 x201  \u2022  technijian.com", S_BODY_SM))
story.append(Spacer(1, 8))
story.append(accent_bar(ORANGE))

# ─── PAGE BREAK: RESUME ───
story.append(PageBreak())

# ─── RESUME (Pages 3-5) ───
story.append(name_banner())
story.append(Spacer(1, 14))

story.append(section_hdr("EXECUTIVE PROFILE"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "AI and technology consulting executive with a blend of boardroom-level strategy, enterprise transformation leadership, "
    "and hands-on implementation capability. I help organizations move from AI exploration to operational deployment by aligning "
    "business goals, security requirements, data architecture, workflow automation, and user adoption.", S_BODY))
story.append(Paragraph(
    "My work sits at the intersection of AI strategy, enterprise software architecture, automation, cybersecurity, compliance, "
    "and managed operations. Known for translating ambiguity into execution: defining roadmaps, architecting systems, selecting tools, "
    "designing workflows, building governance guardrails, and driving delivery through to production. 25+ years as a technology operator "
    "give me a practitioner\u2019s lens that pure strategists rarely bring.", S_BODY))

story.append(Spacer(1, 10))
story.append(section_hdr("CORE CONSULTING CAPABILITIES"))
story.append(Spacer(1, 4))
caps_l = [
    "Enterprise AI strategy &amp; adoption roadmaps",
    "AI use case discovery, prioritization &amp; business-case development",
    "Hands-on AI implementation for internal operations &amp; client services",
    "LLM workflow design, guardrails, approval flows &amp; secure tool integration",
    "AI-enabled service delivery for MSP, IT, security &amp; compliance",
]
caps_r = [
    "Enterprise software &amp; platform architecture",
    "Process automation &amp; workflow orchestration",
    "Security-first AI design, RBAC, auditability &amp; policy controls",
    "Multi-tenant SaaS &amp; operational platform design",
    "AI product strategy, feature definition &amp; delivery oversight",
]
cap_data = [[cap_bullet(l), cap_bullet(r)] for l, r in zip(caps_l, caps_r)]
cw_half = (W - 2 * MARGIN) / 2
cap_t = Table(cap_data, colWidths=[cw_half, cw_half])
cap_t.setStyle(TableStyle([
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("TOPPADDING", (0, 0), (-1, -1), 1),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(cap_t)

story.append(Spacer(1, 10))
story.append(section_hdr("REPRESENTATIVE VALUE TO CLIENTS"))
story.append(Spacer(1, 4))
story.append(value_table())

story.append(Spacer(1, 10))
story.append(section_hdr("PROFESSIONAL EXPERIENCE"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    '<b>CEO &amp; AI / Technology Consulting Leader</b>  |  '
    '<font name="CalB" color="#006DB6">Technijian Corporation</font>', S_BOLD))
story.append(Paragraph(
    '<i>2000 \u2013 Present  \u2022  Irvine, California  \u2022  technijian.com</i>',
    ParagraphStyle("exp_sub", fontName="CalI", fontSize=9.5, leading=13, textColor=GREY, spaceAfter=4)))
story.append(Paragraph(
    "Lead a technology services and consulting business focused on helping organizations modernize operations, "
    "improve security posture, and adopt practical automation and AI solutions across managed IT, cybersecurity, "
    "cloud, compliance, and custom software.", S_BODY_SM))

story.append(Spacer(1, 6))
story.append(Paragraph("Enterprise Consulting &amp; Advisory", S_SUBSEC))
story.append(blue_bullet("Advise clients on enterprise AI adoption \u2014 opportunity mapping, workflow redesign, governance requirements, and phased implementation strategy"))
story.append(blue_bullet("Work with executive stakeholders to identify where AI can improve service delivery, reduce manual effort, accelerate documentation, improve decision support, and strengthen operational consistency"))
story.append(blue_bullet("Bridge business and technical teams by translating strategic goals into implementation plans, architectural requirements, delivery milestones, and measurable outcomes"))

story.append(Spacer(1, 6))
story.append(Paragraph("Hands-On Implementation Leadership", S_SUBSEC))
story.append(blue_bullet("Translate consulting strategy into delivery by shaping solution architecture, system design, operational workflows, data structures, APIs, and deployment patterns"))
story.append(blue_bullet("Lead implementation initiatives: LLM-enabled assistants, workflow automation, policy-aware AI tooling, enterprise documentation systems, security &amp; compliance operations workflows"))
story.append(blue_bullet("Stay involved below the strategy layer: architecture reviews, feature definition, edge-case analysis, process mapping, and execution troubleshooting"))

story.append(Spacer(1, 6))
story.append(Paragraph("AI / Platform / Product Leadership", S_SUBSEC))
story.append(blue_bullet("Architected multi-agent AI SEO automation platform integrating Claude, GPT-4o, and Gemini with MCP servers; reduced content production time by ~70%"))
story.append(blue_bullet('Designed SDLC v7.0 ("Claude Code Native") \u2014 AI-first software development methodology covering discovery through post-release monitoring'))
story.append(blue_bullet("Architected ScamShield, an AI scam-detection product using LLM Council (Claude + GPT-4o + Gemini), Weaviate RAG, IPQS/Twilio risk scoring, and Whisper transcription \u2014 designed for 70\u201380% gross margins"))
story.append(blue_bullet("Deployed AI-driven document intelligence to auto-populate complex vendor questionnaires for FINRA-registered broker-dealers \u2014 cutting RFP response time from days to minutes"))
story.append(blue_bullet("Implemented Weaviate and Obsidian.md hybrid memory systems for enterprise AI agents, enabling persistent knowledge retrieval across sessions"))

story.append(Spacer(1, 10))
story.append(section_hdr("TECHNOLOGY & DOMAIN AREAS"))
story.append(Spacer(1, 4))
story.append(tag_row("AI / Automation",
    "Claude (Sonnet/Opus), GPT-4o, Gemini, Whisper | MCP Protocol &amp; Apps | Claude Code | Multi-agent orchestration | "
    "LLM workflow design | Weaviate, Chroma, Pinecone (RAG/vector) | Obsidian.md knowledge systems | Prompt &amp; system design | AI governance patterns"))
story.append(Spacer(1, 3))
story.append(tag_row("Architecture",
    "Multi-tenant platforms | Enterprise web apps | API-first services | Backend orchestration | "
    "MCP server integration (SEMrush, GA4, Perplexity, Firecrawl, DataForSEO, Asana, Gmail, Google Calendar) | .NET 8, React, WordPress"))
story.append(Spacer(1, 3))
story.append(tag_row("Security / Compliance",
    "Access control &amp; RBAC | Audit trails | Compliance evidence workflows | HIPAA, PCI DSS, SOC 2, GDPR | CrowdStrike | DLP-oriented design | Zero Trust principles"))
story.append(Spacer(1, 3))
story.append(tag_row("Cloud &amp; Infra",
    "AWS | Microsoft Azure | Microsoft 365 | Private datacenter | SD-WAN | 24/7 managed operations"))

story.append(Spacer(1, 10))
story.append(section_hdr("ENGAGEMENT MODELS"))
story.append(Spacer(1, 4))
eng_caps_l = [
    "Fractional AI CTO / Advisor",
    "AI Strategy Workshops",
    "Enterprise Roadmap Development",
    "AI Implementation Planning",
]
eng_caps_r = [
    "AI Product / Service Design",
    "Operational Automation Consulting",
    "Security-Aware AI Workflow Design",
    "Executive Advisory + Delivery Oversight",
]
eng_data = [[cap_bullet(l), cap_bullet(r)] for l, r in zip(eng_caps_l, eng_caps_r)]
eng_t = Table(eng_data, colWidths=[cw_half, cw_half])
eng_t.setStyle(TableStyle([
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("TOPPADDING", (0, 0), (-1, -1), 1),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(eng_t)

story.append(Spacer(1, 10))
story.append(section_hdr("INDUSTRIES SERVED"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Financial Services &amp; FINRA-Registered Broker-Dealers  \u2022  Healthcare &amp; HIPAA-Regulated Organizations  \u2022  "
    "Legal &amp; Professional Services  \u2022  Real Estate &amp; Property Management  \u2022  Technology &amp; SaaS  \u2022  "
    "Manufacturing &amp; Distribution  \u2022  Non-Profit &amp; Education  \u2022  Retail &amp; eCommerce", S_BODY))

story.append(Spacer(1, 10))
story.append(section_hdr("EDUCATION"))
story.append(Spacer(1, 4))
story.append(Paragraph("<b>M.S., Electrical Engineering \u2014 Systems Engineering Concentration</b>", S_BOLD))
story.append(Paragraph("California State University, Fullerton (CSUF)", S_BODY_SM))
story.append(Spacer(1, 4))
story.append(Paragraph("<b>B.S., Physics</b>", S_BOLD))
story.append(Paragraph("University of California, Los Angeles (UCLA)", S_BODY_SM))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "<i>Ongoing professional development through Anthropic, AWS, Microsoft, CrowdStrike, and cybersecurity/compliance certification programs.</i>",
    ParagraphStyle("edu_note", fontName="CalI", fontSize=9.5, leading=13, textColor=GREY)))

story.append(Spacer(1, 14))
story.append(accent_bar(ORANGE))
story.append(Spacer(1, 4))
story.append(Paragraph(
    '<font name="CalB" color="#006DB6">rjain@technijian.com  \u2022  (949) 379-8499 x201  \u2022  technijian.com</font>', S_CENTER))


# ═══════════════════════════════════════════
#  BUILD PDF
# ═══════════════════════════════════════════
out_path = os.path.join(os.path.dirname(__file__), "Ravi_Jain_Technijian_Aventine_Apartments.pdf")

doc = SimpleDocTemplate(
    out_path,
    pagesize=letter,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=0.75 * inch, bottomMargin=0.7 * inch,
)
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f"Combined PDF written to: {out_path}")
