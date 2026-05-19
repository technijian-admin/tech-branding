"""
Generate 3 branded, READABLE diagrams for the RKE Strategic AI Growth Report.
Optimized for clarity at full-page width in DOCX.

  1. AI Growth Engine Architecture  (Section 09)
  2. 90/180/365 Implementation Timeline  (Section 11)
  3. Seven Personas Quadrant  (Section 06)
"""

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle

# Brand
CORE_BLUE     = '#006DB6'
CORE_ORANGE   = '#F67D4B'
TEAL          = '#1EAAC8'
CHARTREUSE    = '#CBDB2D'
DARK_CHARCOAL = '#1A1A2E'
BRAND_GREY    = '#59595B'
OFF_WHITE     = '#F8F9FA'
LIGHT_GREY    = '#E9ECEF'
WHITE         = '#FFFFFF'
CRITICAL      = '#CC0000'

OUT_DIR = r'c:\VSCode\tech-branding\tech-branding\Clients\RKE\diagrams'
os.makedirs(OUT_DIR, exist_ok=True)

plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['savefig.facecolor'] = 'white'


# ============================================================
# DIAGRAM 1 — AI Growth Engine Architecture (simplified, bigger text)
# ============================================================
def diagram_architecture():
    # Figsize sized for 6.5" display width in DOCX with print-readable text
    fig, ax = plt.subplots(figsize=(11, 7), dpi=220)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Title
    ax.text(8, 9.5, 'The RKE AI Growth Engine',
            fontsize=32, fontweight='bold', color=CORE_BLUE, ha='center')
    ax.text(8, 8.95, 'Public data sources  →  Technijian AI layer  →  Outputs that reach the seven personas',
            fontsize=17, color=BRAND_GREY, ha='center', style='italic')

    col_top = 8.1
    col_bot = 1.0

    # ============= COLUMN 1: Data Sources =============
    c1_x, c1_w = 0.3, 4.2
    ax.add_patch(FancyBboxPatch((c1_x, col_bot), c1_w, col_top - col_bot,
                                  boxstyle="round,pad=0.02,rounding_size=0.2",
                                  fc=OFF_WHITE, ec=LIGHT_GREY, lw=1.5))
    ax.text(c1_x + c1_w/2, col_top - 0.35, 'DATA SOURCES',
            fontsize=16, fontweight='bold', color=CORE_BLUE, ha='center')

    sources = [
        ('RFP Platforms',  'PlanetBids · BidNet'),
        ('Permit Filings', 'NOPs · land deals'),
        ('Court Filings',  'CEQA case dockets'),
        ('Prime Awards',   'AECOM · Stantec'),
        ('SCAQMD Signals', 'Rule 2305 · AB 98'),
        ('ESG Reporters',  'SEC · CARB SB 253'),
    ]
    n = len(sources)
    box_h = 0.78
    avail = col_top - col_bot - 1.0
    spacing = avail / n
    y_top = col_top - 1.0
    for i, (title, sub) in enumerate(sources):
        y_center = y_top - (i + 0.5) * spacing
        ax.add_patch(Rectangle((c1_x + 0.2, y_center - box_h/2), c1_w - 0.4, box_h,
                                fc=WHITE, ec=LIGHT_GREY, lw=1.0))
        ax.text(c1_x + 0.35, y_center + 0.13, title,
                fontsize=15, fontweight='bold', color=DARK_CHARCOAL)
        ax.text(c1_x + 0.35, y_center - 0.18, sub,
                fontsize=12, color=BRAND_GREY)

    # ============= COLUMN 2: Technijian AI Layer =============
    c2_x, c2_w = 5.7, 4.6
    ax.add_patch(FancyBboxPatch((c2_x, col_bot), c2_w, col_top - col_bot,
                                  boxstyle="round,pad=0.02,rounding_size=0.2",
                                  fc=DARK_CHARCOAL, ec=DARK_CHARCOAL, lw=0))
    ax.text(c2_x + c2_w/2, col_top - 0.35, 'TECHNIJIAN AI LAYER',
            fontsize=16, fontweight='bold', color=CORE_ORANGE, ha='center')
    ax.text(c2_x + c2_w/2, col_top - 0.75, 'My AI  ·  My Dev  ·  My SEO',
            fontsize=12, color=TEAL, ha='center', style='italic')

    ai_components = [
        ('LLM Council',        'Claude · GPT-4o · Gemini', TEAL),
        ('MCP Integrations',   'SEMrush · GA4 · Perplex.', CORE_ORANGE),
        ('Knowledge Graph',    'Weaviate + Obsidian',      CORE_ORANGE),
        ('Predictive Scoring', 'Intent · lead scoring',    TEAL),
        ('Doc Intelligence',   'RFP draft · peer review',  CORE_ORANGE),
        ('Conversation Intel', 'Call transcripts',         TEAL),
    ]
    y_top_ai = col_top - 1.2
    avail_ai = col_top - col_bot - 1.4
    spacing_ai = avail_ai / n
    for i, (title, sub, color) in enumerate(ai_components):
        y_center = y_top_ai - (i + 0.5) * spacing_ai
        ax.add_patch(Rectangle((c2_x + 0.25, y_center - box_h/2), c2_w - 0.5, box_h,
                                fc='#252540', ec=color, lw=1.5))
        ax.text(c2_x + 0.45, y_center + 0.13, title,
                fontsize=15, fontweight='bold', color=WHITE)
        ax.text(c2_x + 0.45, y_center - 0.18, sub,
                fontsize=12, color='#A0A0B5')

    # ============= COLUMN 3: RKE Outputs =============
    c3_x, c3_w = 11.5, 4.2
    ax.add_patch(FancyBboxPatch((c3_x, col_bot), c3_w, col_top - col_bot,
                                  boxstyle="round,pad=0.02,rounding_size=0.2",
                                  fc=OFF_WHITE, ec=LIGHT_GREY, lw=1.5))
    ax.text(c3_x + c3_w/2, col_top - 0.35, 'OUTPUTS → PERSONAS',
            fontsize=16, fontweight='bold', color=CORE_BLUE, ha='center')

    outputs = [
        ('Inbound (AEO + SEO)',    'All 7 personas',      CORE_BLUE),
        ('RFP Auto-Draft',         'Regulatory Guardian', CORE_BLUE),
        ('Permit-Trigger Reach',   'Timeline Driver',     CORE_ORANGE),
        ('Prime-Award Outreach',   'Design Integrator',   TEAL),
        ('Litigation Watch + CRM', 'Legal Strategist',    CRITICAL),
        ('Warehouse + ESG Tools',  'Emerging personas',   CHARTREUSE),
    ]
    n_out = len(outputs)
    y_top_o = col_top - 1.0
    avail_o = col_top - col_bot - 1.0
    spacing_o = avail_o / n_out
    box_h_o = 0.78
    for i, (title, persona, color) in enumerate(outputs):
        y_center = y_top_o - (i + 0.5) * spacing_o
        ax.add_patch(Rectangle((c3_x + 0.2, y_center - box_h_o/2), c3_w - 0.4, box_h_o,
                                fc=WHITE, ec=LIGHT_GREY, lw=1.0))
        # Colored left pill
        ax.add_patch(Rectangle((c3_x + 0.2, y_center - box_h_o/2), 0.12, box_h_o, fc=color, ec=color))
        ax.text(c3_x + 0.45, y_center + 0.13, title,
                fontsize=15, fontweight='bold', color=DARK_CHARCOAL)
        ax.text(c3_x + 0.45, y_center - 0.18, persona,
                fontsize=12, color=color, fontweight='bold')

    # ============= ARROWS between columns =============
    # Three big arrows between col1→col2 and col2→col3
    for y in [6.5, 4.5, 2.5]:
        ax.add_patch(FancyArrowPatch((c1_x + c1_w + 0.1, y),
                                       (c2_x - 0.1, y),
                                       arrowstyle='->,head_width=0.4,head_length=0.5',
                                       mutation_scale=18, color=BRAND_GREY, lw=2))
        ax.add_patch(FancyArrowPatch((c2_x + c2_w + 0.1, y),
                                       (c3_x - 0.1, y),
                                       arrowstyle='->,head_width=0.4,head_length=0.5',
                                       mutation_scale=18, color=CORE_ORANGE, lw=2))

    # Footer note
    ax.text(8, 0.4,
            'Every component above is in production today for an existing Technijian client — see Section 08 for the proof set.',
            fontsize=13, color=BRAND_GREY, ha='center', style='italic')

    fig.savefig(os.path.join(OUT_DIR, 'architecture.png'),
                dpi=220, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print('Wrote architecture.png')


# ============================================================
# DIAGRAM 2 — 90/180/365 Implementation Timeline (clean, no overlap)
# ============================================================
def diagram_timeline():
    fig, ax = plt.subplots(figsize=(11, 9), dpi=220)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')

    # Title
    ax.text(8, 11.4, '90 / 180 / 365 Day Implementation Timeline',
            fontsize=30, fontweight='bold', color=CORE_BLUE, ha='center')
    ax.text(8, 10.85, 'Three phases. Six key milestones. Cumulative outcomes at each gate.',
            fontsize=16, color=BRAND_GREY, ha='center', style='italic')

    # Timeline bar
    bar_y = 5.0
    bar_h = 0.9
    bar_x_start = 1.0
    bar_x_end = 15.0
    bar_w = bar_x_end - bar_x_start
    zone1_end = bar_x_start + bar_w * (90/365)
    zone2_end = bar_x_start + bar_w * (180/365)

    # Add small white gap between zones for visual breathing room
    gap = 0.12
    ax.add_patch(Rectangle((bar_x_start,        bar_y), (zone1_end - gap) - bar_x_start, bar_h, fc=CORE_BLUE,   ec='none'))
    ax.add_patch(Rectangle((zone1_end + gap*0.5, bar_y), (zone2_end - gap*0.5) - (zone1_end + gap*0.5), bar_h, fc=CORE_ORANGE, ec='none'))
    ax.add_patch(Rectangle((zone2_end + gap,    bar_y), bar_x_end - (zone2_end + gap), bar_h, fc=TEAL,         ec='none'))

    # Zone labels (inside bar) — slightly smaller to ensure they don't crowd the gaps
    ax.text((bar_x_start + zone1_end) / 2, bar_y + bar_h/2,
            'FOUNDATION\nDays 1–90',
            fontsize=15, fontweight='bold', color=WHITE, ha='center', va='center')
    ax.text((zone1_end + zone2_end) / 2, bar_y + bar_h/2,
            'ACCELERATION\nDays 91–180',
            fontsize=15, fontweight='bold', color=WHITE, ha='center', va='center')
    ax.text((zone2_end + bar_x_end) / 2, bar_y + bar_h/2,
            'COMPOUNDING\nDays 181–365',
            fontsize=15, fontweight='bold', color=WHITE, ha='center', va='center')

    # Day gates BELOW the bar
    gates = [
        (bar_x_start, 'Day 1', 'Kickoff'),
        (zone1_end,   'Day 90', '90-day gate'),
        (zone2_end,   'Day 180', '180-day gate'),
        (bar_x_end,   'Day 365', 'Annual review'),
    ]
    for x, day, sub in gates:
        ax.plot([x, x], [bar_y - 0.1, bar_y - 0.35], color=DARK_CHARCOAL, lw=1.5)
        ax.text(x, bar_y - 0.55, day, fontsize=14, color=DARK_CHARCOAL,
                ha='center', va='top', fontweight='bold')
        ax.text(x, bar_y - 0.95, sub, fontsize=11, color=BRAND_GREY,
                ha='center', va='top')

    # MILESTONES ABOVE the bar — TWO per phase, well-spaced horizontally + staggered vertically
    fz_left = bar_x_start; fz_right = zone1_end
    az_left = zone1_end;   az_right = zone2_end
    cz_left = zone2_end;   cz_right = bar_x_end

    # 6 total milestones: each zone gets 2, placed at 30% and 75% of zone width
    foundation = [
        (fz_left + (fz_right - fz_left) * 0.30, 'RFP Intelligence\nEngine Live',  1.4),
        (fz_left + (fz_right - fz_left) * 0.78, 'Persona 1 Loop\n+ Hub Content',  3.4),
    ]
    acceleration = [
        (az_left + (az_right - az_left) * 0.30, 'AI Proposal\nEngine v1',          1.4),
        (az_left + (az_right - az_left) * 0.78, 'VMT Calculator\n+ Litigation',    3.4),
    ]
    compounding = [
        (cz_left + (cz_right - cz_left) * 0.25, 'AI Peer-Review\n+ Prime Tracker', 1.4),
        (cz_left + (cz_right - cz_left) * 0.78, 'Knowledge Graph\n+ Conv. Intel',  3.4),
    ]

    bar_top = bar_y + bar_h
    def draw_milestones(items, color):
        for x, label, y_off in items:
            ax.plot([x, x], [bar_top + 0.05, bar_top + y_off - 0.15], color=color, lw=1.8)
            ax.scatter([x], [bar_top + y_off - 0.15], s=180, c=color, edgecolors=WHITE, linewidths=2.5, zorder=3)
            # Background rectangle behind text (subtle white halo for legibility)
            ax.text(x, bar_top + y_off + 0.05, label, fontsize=14,
                    color=DARK_CHARCOAL, ha='center', va='bottom', fontweight='bold')

    draw_milestones(foundation, CORE_BLUE)
    draw_milestones(acceleration, CORE_ORANGE)
    draw_milestones(compounding, TEAL)

    # Cumulative outcomes — three boxed columns, fixed positions for guaranteed spacing
    ax.text(8, 2.9, 'Cumulative Outcomes by Phase',
            fontsize=18, fontweight='bold', color=CORE_BLUE, ha='center')

    out_boxes = [
        # (x_center, color, headline, subline)
        (2.85, CORE_BLUE,   '+15% RFP responses',   '6 hub articles ranked'),
        (8.0,  CORE_ORANGE, 'Proposal cycle ↓ 60%', 'VMT lead capture live'),
        (13.15, TEAL,       '+45% qualified pipe.', 'ROI 6× – 8× realized'),
    ]
    box_w = 4.4
    box_h = 1.4
    for cx, col, head, sub in out_boxes:
        # Box outline matching zone color
        ax.add_patch(FancyBboxPatch((cx - box_w/2, 0.6), box_w, box_h,
                                      boxstyle="round,pad=0.02,rounding_size=0.15",
                                      fc=OFF_WHITE, ec=col, lw=1.8))
        ax.text(cx, 0.6 + box_h - 0.4, head,
                fontsize=14, color=col, ha='center', va='center', fontweight='bold')
        ax.text(cx, 0.6 + box_h - 1.0, sub,
                fontsize=12, color=col, ha='center', va='center', fontweight='bold')

    fig.savefig(os.path.join(OUT_DIR, 'timeline.png'),
                dpi=220, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print('Wrote timeline.png')


# ============================================================
# DIAGRAM 3 — Persona Quadrant (externalized legend, bigger fonts)
# ============================================================
def diagram_personas():
    # Wider figure with bigger padding zones for axis labels & strategic note
    fig, ax = plt.subplots(figsize=(11, 8), dpi=220)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')

    # Title (top of figure with generous breathing room)
    ax.text(8, 11.4, 'Seven Customer Personas — Volume × Margin',
            fontsize=28, fontweight='bold', color=CORE_BLUE, ha='center')
    ax.text(8, 10.85, 'Where each persona sits on buying-signal frequency vs. revenue per engagement',
            fontsize=14, color=BRAND_GREY, ha='center', style='italic')

    # Plot area — pushed right + down to leave room for Y-axis label
    # and pushed up to leave room for X-axis label + strategic note
    px_min, px_max = 1.6, 9.6
    py_min, py_max = 2.8, 9.6
    midx = (px_min + px_max) / 2
    midy = (py_min + py_max) / 2

    # Background
    ax.add_patch(Rectangle((px_min, py_min), px_max - px_min, py_max - py_min,
                            fc=OFF_WHITE, ec=LIGHT_GREY, lw=1.5))
    # Highlight priority quadrant
    ax.add_patch(Rectangle((midx, midy), px_max - midx, py_max - midy,
                            fc=CORE_ORANGE, ec='none', alpha=0.08))

    # Quadrant dividers
    ax.plot([midx, midx], [py_min, py_max], color=LIGHT_GREY, lw=1.2, ls='--')
    ax.plot([px_min, px_max], [midy, midy], color=LIGHT_GREY, lw=1.2, ls='--')

    # Quadrant captions — placed in corners with adequate padding
    ax.text(px_min + 0.15, py_max - 0.25, 'BOUTIQUE / HIGH MARGIN',
            fontsize=10, color=BRAND_GREY, fontweight='bold', va='top')
    ax.text(px_max - 0.15, py_max - 0.25, 'PRIORITY ZONE',
            fontsize=11, color=CORE_ORANGE, fontweight='bold', ha='right', va='top')
    ax.text(px_min + 0.15, py_min + 0.25, 'NICHE / EMERGING',
            fontsize=10, color=BRAND_GREY, fontweight='bold', va='bottom')
    ax.text(px_max - 0.15, py_min + 0.25, 'VOLUME / COMMODITY',
            fontsize=10, color=BRAND_GREY, fontweight='bold', ha='right', va='bottom')

    # Axis labels — well outside plot area
    ax.text(midx, py_min - 0.55, 'VOLUME  (buying-signal frequency →)',
            fontsize=14, fontweight='bold', color=DARK_CHARCOAL, ha='center', va='top')
    ax.text(px_min - 0.6, midy, '← MARGIN  (revenue per engagement)',
            fontsize=14, fontweight='bold', color=DARK_CHARCOAL,
            ha='center', va='center', rotation=90)

    # Personas in new coordinate range (px_min=1.6, px_max=9.6, py_min=2.8, py_max=9.6)
    # Re-map: x in [2.0, 9.2], y in [3.3, 9.2]
    personas = [
        (1, 8.4, 8.0, CORE_BLUE,     'Regulatory Guardian',  'On-call RFPs · recurring',     1300),
        (2, 8.7, 6.9, CORE_ORANGE,   'Timeline Driver',      'Developer projects · speed',   1500),
        (3, 5.4, 7.8, TEAL,          'Design Integrator',    'Prime-sub teaming · large',    1100),
        (4, 3.0, 8.7, CRITICAL,      'Legal Strategist',     'Expert witness · top margin',  1000),
        (5, 7.0, 4.7, CHARTREUSE,    'Industrial Logistics', 'Warehouse EIRs · IE',          1250),
        (6, 3.8, 6.4, DARK_CHARCOAL, 'Institutional Steward','Master plans · UC/CSU',        1050),
        (7, 2.7, 4.3, TEAL,          'ESG / Sustainability', 'CARB SB 253 attestation',      850),
    ]
    for num, x, y, color, name, sub, size in personas:
        ax.scatter([x], [y], s=size, c=color, edgecolors=WHITE, linewidths=3, zorder=3, alpha=0.95)
        ax.text(x, y, str(num), fontsize=16, fontweight='bold', color=WHITE,
                ha='center', va='center', zorder=4)

    # Externalized legend panel — right of plot area, sized to fit all 7 entries cleanly
    lx, ly_top, lw, lh = 10.3, 9.8, 5.4, 7.0
    ax.add_patch(FancyBboxPatch((lx, ly_top - lh), lw, lh,
                                  boxstyle="round,pad=0.02,rounding_size=0.2",
                                  fc=OFF_WHITE, ec=LIGHT_GREY, lw=1.5))
    ax.text(lx + 0.3, ly_top - 0.4, 'PERSONA KEY',
            fontsize=15, fontweight='bold', color=CORE_BLUE)

    # 7 entries, evenly spaced in the available legend height
    avail = lh - 1.0
    spacing = avail / 7
    for i, (num, x, y, color, name, sub, size) in enumerate(personas):
        legend_y = ly_top - 1.0 - (i + 0.5) * spacing
        # Legend dot
        ax.scatter([lx + 0.55], [legend_y], s=350, c=color, edgecolors=WHITE, linewidths=1.5, zorder=3)
        ax.text(lx + 0.55, legend_y, str(num), fontsize=12, fontweight='bold',
                color=WHITE, ha='center', va='center', zorder=4)
        # Name + sub
        ax.text(lx + 1.20, legend_y + 0.15, name,
                fontsize=13, fontweight='bold', color=DARK_CHARCOAL, va='center')
        ax.text(lx + 1.20, legend_y - 0.20, sub,
                fontsize=11, color=BRAND_GREY, va='center', style='italic')

    # Bottom strategic note — placed BELOW the X-axis label with clear separation
    ax.text(8, 1.4,
            'Bigger dot = higher AI-tooling ROI.    Right + Up = prioritize outbound;    Left + Up = relationship-driven selling.',
            fontsize=12, color=BRAND_GREY, ha='center', va='center', style='italic')

    fig.savefig(os.path.join(OUT_DIR, 'personas.png'),
                dpi=220, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print('Wrote personas.png')


if __name__ == '__main__':
    diagram_architecture()
    diagram_timeline()
    diagram_personas()
    print('\nAll diagrams generated in:', OUT_DIR)
