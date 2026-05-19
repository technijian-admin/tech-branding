"""
Generate sophisticated, professional diagrams for the RKE deliverable using:
- HTML + CSS (gradient, shadow, modern typography)
- Lucide icons (MIT-licensed, inline SVG)
- Playwright for high-DPI PNG rendering

Outputs to ./diagrams/{architecture,timeline,personas}.png
Brand: Technijian (Core Blue #006DB6, Core Orange #F67D4B, Teal #1EAAC8, Chartreuse #CBDB2D)

Run with: py -3.12 generate-diagrams-html.py
"""

import os
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


# ---------- Lucide icons (inline SVG, MIT licensed) ----------
# Source: https://lucide.dev — copied path data
def lucide(name, stroke='#FFFFFF', size=22, stroke_width=2):
    paths = {
        'file-text':     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
        'building':      '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
        'scale':         '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
        'trophy':        '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
        'factory':       '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
        'leaf':          '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.66 12.13 12.13 0 0 1-3.93 10.16C13.8 17.34 9.5 17.96 7 17"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
        'brain':         '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
        'network':       '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
        'database':      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
        'target':        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
        'file-search':   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2"/><path d="M14 2v6h6"/><circle cx="16" cy="17" r="3"/><path d="m22 22-1.5-1.5"/>',
        'message-circle':'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
        'search':        '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        'file-pen':      '<path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v6h6"/><path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
        'send':          '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        'handshake':     '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
        'shield':        '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
        'warehouse':     '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/>',
        'trending-up':   '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
        'plug':          '<path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M6 13V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z"/>',
        'eye':           '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    }
    p = paths.get(name, '')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{stroke}" stroke-width="{stroke_width}" stroke-linecap="round" stroke-linejoin="round">{p}</svg>'


# ============================================================
# COMMON CSS (shared across all diagrams)
# ============================================================
COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');

:root {
  --blue: #006DB6;
  --blue-dark: #004F85;
  --orange: #F67D4B;
  --teal: #1EAAC8;
  --chartreuse: #CBDB2D;
  --dark: #1A1A2E;
  --dark-2: #252540;
  --grey: #59595B;
  --grey-light: #9090A5;
  --off-white: #F8F9FA;
  --light-grey: #E9ECEF;
  --white: #FFFFFF;
  --critical: #CC0000;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Plus Jakarta Sans', 'Open Sans', system-ui, -apple-system, sans-serif;
  background: #FFFFFF;
  color: var(--dark);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.canvas {
  width: 1600px;
  padding: 60px 80px 60px;
  background: #FFFFFF;
}
.canvas .title {
  font-size: 44px;
  font-weight: 800;
  color: var(--blue);
  letter-spacing: -0.5px;
  line-height: 1.1;
  margin-bottom: 8px;
}
.canvas .title .accent { color: var(--orange); }
.canvas .subtitle {
  font-size: 18px;
  color: var(--grey);
  font-style: italic;
  margin-bottom: 36px;
}
.canvas .footnote {
  font-size: 15px;
  color: var(--grey);
  font-style: italic;
  text-align: center;
  margin-top: 24px;
  letter-spacing: 0.1px;
}
"""


# ============================================================
# DIAGRAM 1 — AI GROWTH ENGINE ARCHITECTURE
# ============================================================
def html_architecture():
    # Data
    sources = [
        ('file-text',     'RFP Platforms',     'PlanetBids · BidNet · BidSync',     'var(--blue)'),
        ('building',      'Permit Filings',    'NOPs · land acquisitions',           'var(--blue)'),
        ('scale',         'Court Filings',     'CEQA case dockets · OPR advisories', 'var(--blue)'),
        ('trophy',        'Prime Awards',      'AECOM · Stantec · HDR wins',         'var(--blue)'),
        ('factory',       'SCAQMD Signals',    'Rule 2305 · AB 98 enforcement',      'var(--blue)'),
        ('leaf',          'ESG Reporters',     'SEC climate · CARB SB 253/261',      'var(--blue)'),
    ]
    ai_layer = [
        ('brain',         'LLM Council',          'Claude · GPT-4o · Gemini',           'var(--teal)'),
        ('network',       'MCP Integrations',     'SEMrush · GA4 · Perplexity',         'var(--orange)'),
        ('database',      'Knowledge Graph',      'Weaviate + Obsidian',                'var(--orange)'),
        ('target',        'Predictive Scoring',   'Intent signals · lead scoring',      'var(--teal)'),
        ('file-search',   'Doc Intelligence',     'RFP auto-draft · peer review',       'var(--orange)'),
        ('message-circle','Conversation Intel',   'Call transcripts · objection mining','var(--teal)'),
    ]
    outputs = [
        ('search',        'Inbound (AEO + SEO)',      'All 7 personas',         'var(--blue)'),
        ('file-pen',      'RFP Auto-Draft',           'Regulatory Guardian',    'var(--blue)'),
        ('send',          'Permit-Trigger Reach',     'Timeline Driver',        'var(--orange)'),
        ('handshake',     'Prime-Award Outreach',     'Design Integrator',      'var(--teal)'),
        ('shield',        'Litigation Watch + CRM',   'Legal Strategist',       'var(--critical)'),
        ('warehouse',     'Warehouse + ESG Tools',    'Emerging personas',      'var(--chartreuse)'),
    ]

    def card_light(ic, title, sub, color):
        return f"""
        <div class="card light" style="--accent: {color}">
          <div class="icon-bubble" style="background: {color}">{lucide(ic, '#FFFFFF', 22)}</div>
          <div class="card-text">
            <div class="card-title">{title}</div>
            <div class="card-sub">{sub}</div>
          </div>
        </div>"""

    def card_dark(ic, title, sub, color):
        return f"""
        <div class="card dark" style="--accent: {color}">
          <div class="icon-bubble" style="background: {color}; box-shadow: 0 0 24px {color}55;">{lucide(ic, '#FFFFFF', 22)}</div>
          <div class="card-text">
            <div class="card-title-dark">{title}</div>
            <div class="card-sub-dark">{sub}</div>
          </div>
        </div>"""

    def card_output(ic, title, sub, color):
        return f"""
        <div class="card light right" style="--accent: {color}">
          <div class="icon-bubble" style="background: {color}">{lucide(ic, '#FFFFFF', 22)}</div>
          <div class="card-text">
            <div class="card-title">{title}</div>
            <div class="card-sub" style="color: {color}; font-weight: 700;">{sub}</div>
          </div>
        </div>"""

    src_html = ''.join(card_light(*s) for s in sources)
    ai_html  = ''.join(card_dark(*a) for a in ai_layer)
    out_html = ''.join(card_output(*o) for o in outputs)

    return f"""
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{COMMON_CSS}
.arch-grid {{
  display: grid;
  grid-template-columns: 1fr 60px 1.05fr 60px 1fr;
  gap: 0;
  align-items: stretch;
}}
.col-header {{
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 16px;
}}
.col-header.blue {{ color: var(--blue); }}
.col-header.orange {{ color: var(--orange); }}
.col-header .sub {{ display:block; font-size:11px; font-weight: 500; color: var(--grey); letter-spacing: 1px; margin-top: 4px; }}
.col {{
  display: flex;
  flex-direction: column;
  gap: 14px;
}}
.col.center {{
  background: linear-gradient(180deg, #1A1A2E 0%, #0E0E1F 100%);
  border-radius: 24px;
  padding: 28px 22px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.04) inset;
  position: relative;
}}
.col.center::before {{
  content:'';
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--orange), transparent);
  border-radius: 2px;
}}
.card {{
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 14px;
  position: relative;
}}
.card.light {{
  background: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-left: 4px solid var(--accent);
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}}
.card.dark {{
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-left: 4px solid var(--accent);
}}
.icon-bubble {{
  width: 38px; height: 38px; border-radius: 11px;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}}
.card-text {{ flex:1; min-width: 0; }}
.card-title {{ font-size: 15px; font-weight: 700; color: var(--dark); line-height: 1.2; margin-bottom: 2px; }}
.card-sub   {{ font-size: 12.5px; color: var(--grey); line-height: 1.3; }}
.card-title-dark {{ font-size: 15px; font-weight: 700; color: #FFFFFF; line-height: 1.2; margin-bottom: 2px; }}
.card-sub-dark   {{ font-size: 12.5px; color: rgba(255,255,255,0.55); line-height: 1.3; }}

.arrow-col {{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding-top: 60px;
}}
.arrow {{
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--grey-light) 100%);
  position: relative;
}}
.arrow.orange {{
  background: linear-gradient(90deg, var(--orange) 0%, var(--orange) 100%);
}}
.arrow::after {{
  content: '';
  position: absolute;
  right: 0; top: 50%;
  transform: translateY(-50%);
  width: 0; height: 0;
  border-left: 8px solid var(--grey-light);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}}
.arrow.orange::after {{
  border-left-color: var(--orange);
}}
.col-center-header {{
  text-align: center;
  margin-bottom: 18px;
}}
.col-center-header .title {{
  font-family: 'Open Sans';
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--orange);
}}
.col-center-header .sub {{
  font-family: 'DM Sans';
  font-size: 13px;
  color: var(--teal);
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 4px;
}}
</style></head>
<body>
<div class="canvas">
  <div class="title">The RKE <span class="accent">AI Growth Engine</span></div>
  <div class="subtitle">Public data sources flow into the Technijian AI layer; outputs reach each of the seven personas through dedicated channels.</div>

  <div class="arch-grid">
    <div>
      <div class="col-header blue">Data Sources<span class="sub">Public · continuous monitoring</span></div>
      <div class="col">{src_html}</div>
    </div>

    <div class="arrow-col">
      <div class="arrow"></div>
      <div class="arrow"></div>
      <div class="arrow"></div>
    </div>

    <div>
      <div class="col-center-header">
        <div class="title">Technijian AI Layer</div>
        <div class="sub">My AI  ·  My Dev  ·  My SEO</div>
      </div>
      <div class="col center">{ai_html}</div>
    </div>

    <div class="arrow-col">
      <div class="arrow orange"></div>
      <div class="arrow orange"></div>
      <div class="arrow orange"></div>
    </div>

    <div>
      <div class="col-header orange">Outputs → Personas<span class="sub">Triggered, personalized outreach</span></div>
      <div class="col">{out_html}</div>
    </div>
  </div>

  <div class="footnote">Every component above is in production today for an existing Technijian client — see Section 08 for the proof set.</div>
</div>
</body></html>"""


# ============================================================
# DIAGRAM 2 — IMPLEMENTATION TIMELINE
# ============================================================
def html_timeline():
    return f"""
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{COMMON_CSS}
.tl-wrap {{ position: relative; margin: 40px 0 60px; }}
.tl-bar {{
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  height: 100px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(0,109,182,0.18);
}}
.zone {{
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #FFFFFF;
  font-family: 'Plus Jakarta Sans';
  position: relative;
}}
.zone-1 {{ background: linear-gradient(135deg, #006DB6 0%, #004F85 100%); }}
.zone-2 {{ background: linear-gradient(135deg, #F67D4B 0%, #DD5A2A 100%); }}
.zone-3 {{ background: linear-gradient(135deg, #1EAAC8 0%, #138AA3 100%); }}
.zone-name {{ font-size: 22px; font-weight: 800; letter-spacing: 1px; }}
.zone-days {{ font-size: 14px; font-weight: 500; opacity: 0.85; margin-top: 4px; letter-spacing: 0.5px; }}

.milestones {{
  position: relative;
  height: 220px;
  margin-bottom: -1px;
}}
.ms {{
  position: absolute;
  display: flex; flex-direction: column; align-items: center;
  transform: translateX(-50%);
  text-align: center;
  width: 180px;
}}
.ms-icon {{
  width: 48px; height: 48px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #FFFFFF;
  margin-bottom: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  border: 3px solid #FFFFFF;
}}
.ms-line {{
  width: 2px; flex: 1; min-height: 24px;
}}
.ms-title {{ font-size: 13px; font-weight: 700; color: var(--dark); line-height: 1.25; }}
.ms-sub   {{ font-size: 11px; color: var(--grey); margin-top: 3px; line-height: 1.3; }}

.gates {{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin-top: 16px;
  position: relative;
}}
.gate {{ text-align: center; position: relative; }}
.gate::before {{
  content:'';
  position: absolute;
  top: -22px; left: 50%; transform: translateX(-50%);
  width: 2px; height: 14px;
  background: var(--dark);
}}
.gate-day {{ font-size: 16px; font-weight: 800; color: var(--dark); }}
.gate-label {{ font-size: 12px; color: var(--grey); margin-top: 2px; }}

.outcomes-title {{
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: var(--blue);
  margin: 40px 0 24px;
  letter-spacing: -0.3px;
}}
.outcomes {{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}}
.outcome {{
  padding: 28px 24px;
  border-radius: 16px;
  background: #FFFFFF;
  border: 1px solid var(--light-grey);
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}}
.outcome::before {{
  content: '';
  position: absolute;
  top:0; left:0; right:0;
  height: 4px;
}}
.o1::before {{ background: var(--blue); }}
.o2::before {{ background: var(--orange); }}
.o3::before {{ background: var(--teal); }}
.outcome-num {{ font-family: 'Plus Jakarta Sans'; font-size: 36px; font-weight: 800; letter-spacing: -1px; line-height: 1; margin-bottom: 8px; }}
.o1 .outcome-num {{ color: var(--blue); }}
.o2 .outcome-num {{ color: var(--orange); }}
.o3 .outcome-num {{ color: var(--teal); }}
.outcome-label {{ font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 4px; }}
.outcome-sub   {{ font-size: 13px; color: var(--grey); }}
</style></head>
<body>
<div class="canvas">
  <div class="title">90 / 180 / 365 Day Implementation Timeline</div>
  <div class="subtitle">Three phases. Six key milestones. Cumulative outcomes at each gate.</div>

  <div class="tl-wrap">
    <div class="milestones">
      <!-- Foundation -->
      <div class="ms" style="left: 12%; bottom: 0;">
        <div class="ms-icon" style="background: var(--blue);">{lucide('search', '#FFFFFF', 22)}</div>
        <div class="ms-line" style="background: var(--blue);"></div>
        <div class="ms-title">RFP Intelligence Engine Live</div>
        <div class="ms-sub">Foundation · Wks 5–8</div>
      </div>
      <div class="ms" style="left: 22%; bottom: 80px;">
        <div class="ms-icon" style="background: var(--blue);">{lucide('file-text', '#FFFFFF', 22)}</div>
        <div class="ms-line" style="background: var(--blue);"></div>
        <div class="ms-title">Persona 1 Loop + Hub Content</div>
        <div class="ms-sub">Foundation · Wks 9–12</div>
      </div>
      <!-- Acceleration -->
      <div class="ms" style="left: 38%; bottom: 0;">
        <div class="ms-icon" style="background: var(--orange);">{lucide('file-pen', '#FFFFFF', 22)}</div>
        <div class="ms-line" style="background: var(--orange);"></div>
        <div class="ms-title">AI Proposal Engine v1</div>
        <div class="ms-sub">Acceleration · Wks 13–16</div>
      </div>
      <div class="ms" style="left: 48%; bottom: 80px;">
        <div class="ms-icon" style="background: var(--orange);">{lucide('target', '#FFFFFF', 22)}</div>
        <div class="ms-line" style="background: var(--orange);"></div>
        <div class="ms-title">VMT Calculator + Litigation Watch</div>
        <div class="ms-sub">Acceleration · Wks 21–26</div>
      </div>
      <!-- Compounding -->
      <div class="ms" style="left: 68%; bottom: 0;">
        <div class="ms-icon" style="background: var(--teal);">{lucide('shield', '#FFFFFF', 22)}</div>
        <div class="ms-line" style="background: var(--teal);"></div>
        <div class="ms-title">AI Peer-Review + Prime Tracker</div>
        <div class="ms-sub">Compounding · Q3</div>
      </div>
      <div class="ms" style="left: 88%; bottom: 80px;">
        <div class="ms-icon" style="background: var(--teal);">{lucide('database', '#FFFFFF', 22)}</div>
        <div class="ms-line" style="background: var(--teal);"></div>
        <div class="ms-title">Knowledge Graph + Conv. Intel</div>
        <div class="ms-sub">Compounding · Q4</div>
      </div>
    </div>

    <div class="tl-bar">
      <div class="zone zone-1"><div class="zone-name">FOUNDATION</div><div class="zone-days">Days 1–90</div></div>
      <div class="zone zone-2"><div class="zone-name">ACCELERATION</div><div class="zone-days">Days 91–180</div></div>
      <div class="zone zone-3"><div class="zone-name">COMPOUNDING</div><div class="zone-days">Days 181–365</div></div>
    </div>

    <div class="gates">
      <div class="gate"><div class="gate-day">Day 1</div><div class="gate-label">Kickoff</div></div>
      <div class="gate"><div class="gate-day">Day 90</div><div class="gate-label">90-day gate</div></div>
      <div class="gate"><div class="gate-day">Day 180</div><div class="gate-label">180-day gate</div></div>
      <div class="gate"><div class="gate-day">Day 365</div><div class="gate-label">Annual review</div></div>
    </div>
  </div>

  <div class="outcomes-title">Cumulative Outcomes by Phase</div>
  <div class="outcomes">
    <div class="outcome o1">
      <div class="outcome-num">+15%</div>
      <div class="outcome-label">RFP responses</div>
      <div class="outcome-sub">6 hub articles ranked · Persona 1 loop active</div>
    </div>
    <div class="outcome o2">
      <div class="outcome-num">↓ 60%</div>
      <div class="outcome-label">Proposal cycle time</div>
      <div class="outcome-sub">VMT lead capture live · Persona 2 + 4 outreach</div>
    </div>
    <div class="outcome o3">
      <div class="outcome-num">+45%</div>
      <div class="outcome-label">Qualified pipeline</div>
      <div class="outcome-sub">ROI 6× – 8× realized · Conversation Intel live</div>
    </div>
  </div>
</div>
</body></html>"""


# ============================================================
# DIAGRAM 3 — PERSONA QUADRANT
# ============================================================
def html_personas():
    personas = [
        # (n, x%, y%, color, name, sub, icon)
        (1, 78, 22, 'var(--blue)',     'Regulatory Guardian',  'On-call RFPs · recurring',     'building'),
        (2, 82, 38, 'var(--orange)',   'Timeline Driver',      'Developer projects · speed',   'send'),
        (3, 56, 25, 'var(--teal)',     'Design Integrator',    'Prime-sub teaming · large',    'handshake'),
        (4, 28, 14, 'var(--critical)', 'Legal Strategist',     'Expert witness · top margin',  'scale'),
        (5, 68, 64, 'var(--chartreuse)','Industrial Logistics','Warehouse EIRs · IE',           'warehouse'),
        (6, 40, 42, 'var(--dark)',     'Institutional Steward','Master plans · UC/CSU',        'trophy'),
        (7, 28, 70, 'var(--teal)',     'ESG / Sustainability', 'CARB SB 253 attestation',      'leaf'),
    ]

    dots_html = ''
    legend_html = ''
    for n, x, y, color, name, sub, ic in personas:
        dots_html += f"""
        <div class="dot" style="left: {x}%; top: {y}%; background: {color};">
          <div class="dot-icon">{lucide(ic, '#FFFFFF', 22)}</div>
          <div class="dot-num">{n}</div>
        </div>"""
        legend_html += f"""
        <div class="legend-row">
          <div class="legend-dot" style="background: {color};">{n}</div>
          <div class="legend-text">
            <div class="legend-name">{name}</div>
            <div class="legend-sub">{sub}</div>
          </div>
        </div>"""

    return f"""
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{COMMON_CSS}
.persona-layout {{
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: stretch;
}}
.chart {{
  position: relative;
  background: #FAFBFC;
  border: 1px solid var(--light-grey);
  border-radius: 20px;
  padding: 36px 36px 60px 88px;  /* extra left padding for Y-axis label */
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  min-height: 640px;
}}
.quad {{
  position: relative;
  width: 100%; height: 540px;
  background:
    linear-gradient(135deg, transparent 49.9%, var(--light-grey) 49.9%, var(--light-grey) 50.1%, transparent 50.1%),
    repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 24px, #FAFBFC 24px, #FAFBFC 48px);
  border-left: 2px solid var(--dark);
  border-bottom: 2px solid var(--dark);
}}
.priority-zone {{
  position: absolute;
  left: 50%; top: 0;
  width: 50%; height: 50%;
  background: linear-gradient(135deg, rgba(246,125,75,0.08) 0%, rgba(246,125,75,0.02) 100%);
  pointer-events: none;
}}
.divider-v {{ position: absolute; left: 50%; top:0; bottom:0; width:1px; background: var(--light-grey); }}
.divider-h {{ position: absolute; top: 50%; left:0; right:0; height:1px; background: var(--light-grey); }}
.quad-label {{
  position: absolute;
  font-size: 11px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--grey);
}}
.ql-tl {{ top: 12px; left: 16px; }}
.ql-tr {{ top: 12px; right: 16px; color: var(--orange); }}
.ql-bl {{ bottom: 12px; left: 16px; }}
.ql-br {{ bottom: 12px; right: 16px; }}
.ax-x {{
  position: absolute; bottom: -34px; left: 50%;
  transform: translateX(-50%);
  font-size: 13px; font-weight: 700; color: var(--dark);
  letter-spacing: 0.3px; white-space: nowrap;
}}
.ax-y-wrap {{
  position: absolute;
  left: -56px; top: 0; bottom: 0;
  width: 30px;
  display: flex; align-items: center; justify-content: center;
}}
.ax-y {{
  font-size: 13px; font-weight: 700; color: var(--dark);
  letter-spacing: 0.3px; white-space: nowrap;
  transform: rotate(-90deg);
  transform-origin: center center;
}}

.dot {{
  position: absolute;
  width: 64px; height: 64px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 22px rgba(0,0,0,0.18);
  border: 4px solid #FFFFFF;
  z-index: 2;
}}
.dot-num {{
  position: absolute;
  bottom: -7px; right: -7px;
  width: 24px; height: 24px;
  background: #FFFFFF;
  border-radius: 50%;
  font-size: 12px; font-weight: 800;
  color: var(--dark);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}}
.dot-icon {{ display: flex; }}

.legend {{
  background: #FFFFFF;
  border: 1px solid var(--light-grey);
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}}
.legend-title {{
  font-size: 12px; font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--light-grey);
}}
.legend-row {{
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid #F0F2F4;
}}
.legend-row:last-child {{ border-bottom: none; }}
.legend-dot {{
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #FFFFFF;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}}
.legend-name {{ font-size: 15px; font-weight: 700; color: var(--dark); line-height: 1.2; }}
.legend-sub  {{ font-size: 12.5px; color: var(--grey); margin-top: 2px; font-style: italic; }}
</style></head>
<body>
<div class="canvas">
  <div class="title">Seven Customer Personas <span class="accent">— Volume × Margin</span></div>
  <div class="subtitle">Where each persona sits on buying-signal frequency vs. revenue per engagement. Bigger numbers = higher AI-tooling ROI.</div>

  <div class="persona-layout">
    <div class="chart">
      <div class="quad">
        <div class="priority-zone"></div>
        <div class="divider-v"></div>
        <div class="divider-h"></div>
        <div class="quad-label ql-tl">Boutique · High Margin</div>
        <div class="quad-label ql-tr">Priority Zone</div>
        <div class="quad-label ql-bl">Niche · Emerging</div>
        <div class="quad-label ql-br">Volume · Commodity</div>
        {dots_html}
        <div class="ax-x">VOLUME  (buying-signal frequency →)</div>
      </div>
      <div class="ax-y-wrap"><div class="ax-y">← MARGIN  (revenue per engagement)</div></div>
    </div>

    <div class="legend">
      <div class="legend-title">Persona Key</div>
      {legend_html}
    </div>
  </div>

  <div class="footnote">Right + Up = prioritize outbound campaigns. Left + Up = relationship-driven selling.</div>
</div>
</body></html>"""


# ============================================================
# RENDER WITH PLAYWRIGHT
# ============================================================
def render(html, out_filename, viewport_width=1760, scale=2):
    out_path = os.path.join(OUT_DIR, out_filename)
    tmp_html = os.path.join(OUT_DIR, '_tmp_' + out_filename.replace('.png', '.html'))
    with open(tmp_html, 'w', encoding='utf-8') as f:
        f.write(html)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': viewport_width, 'height': 1200}, device_scale_factor=scale)
        page = context.new_page()
        page.goto('file:///' + tmp_html.replace('\\', '/'))
        page.wait_for_load_state('networkidle')
        # Locate the .canvas element and screenshot just that
        canvas = page.locator('.canvas')
        canvas.screenshot(path=out_path, omit_background=False)
        browser.close()
    os.remove(tmp_html)
    print(f'Wrote {out_path}')


if __name__ == '__main__':
    render(html_architecture(), 'architecture.png', viewport_width=1760, scale=2)
    render(html_timeline(),     'timeline.png',     viewport_width=1760, scale=2)
    render(html_personas(),     'personas.png',     viewport_width=1760, scale=2)
    print('All HTML diagrams rendered.')
