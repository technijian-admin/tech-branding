"""
generate-diagrams.py — Custom Silicon Solutions (CSS) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
Output -> Clients/CSS/diagrams/{model,personas,architecture,timeline,competitive}.png
Usage:   python "Clients/CSS/generate-diagrams.py"
"""
import asyncio, pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

BLUE="#006DB6"; ORANGE="#F67D4B"; TEAL="#1EAAC8"; DARK="#1A1A2E"; GREY="#59595B"
LIGHT="#E9ECEF"; OFF="#F8F9FA"; WHITE="#FFFFFF"; GOLD="#C9922A"; GREEN="#28A745"; PURPLE="#7B2D8B"

def page_shell(svg, bg=WHITE):
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box;}} body{{background:{bg};display:inline-block;}} svg{{display:block;}}
</style></head><body>{svg}</body></html>"""

def esc(s): return s.replace("&","&amp;").replace("<","&lt;")

def box(x,y,w,h,fill,stroke,title,subtitle,title_color,sub_color,title_size=13):
    sub=""
    if subtitle:
        sub=f'<text x="{x+w//2}" y="{y+h//2+15}" font-family="Segoe UI,Arial" font-size="10.5" fill="{sub_color}" text-anchor="middle">{esc(subtitle)}</text>'
    ty=y+h//2+(2 if not subtitle else -4)
    return f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="2"/>
  <text x="{x+w//2}" y="{ty}" font-family="Segoe UI,Arial" font-size="{title_size}" font-weight="700" fill="{title_color}" text-anchor="middle">{esc(title)}</text>{sub}'''

# ============================================================ MODEL
def build_model_svg():
    marker=f'<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker></defs>'
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Custom Silicon Solutions Delivers a Custom ASIC</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A US-based, fab-agnostic turnkey house: take a design in at any stage, build it, test it, and ship production silicon.</text>'''
    inputs=(box(40,92,196,60,WHITE,TEAL,"NAPKIN CONCEPT / BLOCK DIAGRAM","an idea, not yet a spec",DARK,GREY)
        +box(40,160,196,60,WHITE,TEAL,"COMPLETE SPECIFICATION","ready-to-design requirement",DARK,GREY)
        +box(40,228,196,60,WHITE,TEAL,"OBSOLETE PART TO REPLACE","EOL / last-time-buy / DMSMS",DARK,GREY))
    in_label=f'<text x="138" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">DESIGN INPUTS (any stage)</text>'
    hub=box(304,148,196,150,DARK,DARK,"CUSTOM SILICON","design - test - production",WHITE,"#C9CDD6",17)
    hub_extra=f'''<text x="402" y="200" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">SOLUTIONS</text>
  <text x="402" y="264" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">US-based - fab-agnostic</text>
  <text x="402" y="280" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">300+ tape-outs - 100% success</text>'''
    markets=(box(568,72,292,52,WHITE,BLUE,"INDUSTRIAL / IoT","drivers, PMICs, sensors, metering",DARK,GREY)
        +box(568,134,292,52,WHITE,BLUE,"MEDICAL DEVICES","implantable, wearable, ultra-low power",DARK,GREY)
        +box(568,196,292,52,WHITE,BLUE,"AEROSPACE & DEFENSE","hi-rel, long-life, obsolescence",DARK,GREY)
        +box(568,258,292,52,WHITE,BLUE,"CONSUMER ELECTRONICS","high-volume integration",DARK,GREY))
    mkt_label=f'<text x="714" y="62" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">TARGET MARKETS (OEM design teams)</text>'
    arrows=f'''
  <line x1="236" y1="122" x2="300" y2="198" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="190" x2="300" y2="220" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="258" x2="300" y2="246" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="206" x2="564" y2="100" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="214" x2="564" y2="162" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="232" x2="564" y2="224" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="244" x2="564" y2="286" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    seg=f'''
  <rect x="40" y="356" width="820" height="44" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="52" y="374" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">TURNKEY SCOPE (in-house test floor)</text>
  <text x="52" y="391" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">architecture &amp; design  -  simulation  -  layout  -  prototype/tape-out  -  wafer probe (in-house)  -  final package test (in-house)  -  production  -  supply  |  foundries: TSMC - GlobalFoundries - X-FAB - Tower</text>'''
    band=f'''
  <rect x="40" y="412" width="820" height="62" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="412" width="6" height="62" rx="3" fill="{ORANGE}"/>
  <text x="60" y="435" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="60" y="456" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">AEO authority + technical long-tail  -  RFQ / spec / NRE drafting  -  obsolescence cross-reference  -  datasheet &amp; test-program docs  -  account &amp; trigger intelligence  -  knowledge graph</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{in_label}{inputs}{hub}{hub_extra}{mkt_label}{markets}{arrows}{seg}{band}</svg>'

# ============================================================ PERSONAS (segment matrix)
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    # (key, label, volume_x, value_y, color, textcolor, r, label_dx, label_dy, anchor)
    P=[("INDUSTRIAL / IoT","Industrial / IoT Design Engineer",80,50,BLUE,WHITE,32,0,54,"middle"),
       ("MEDICAL","Medical-Device R&D Lead",30,84,ORANGE,WHITE,30,0,52,"middle"),
       ("A&D / HI-REL","Aerospace & Defense Program Engineer",20,58,TEAL,DARK,26,0,46,"middle"),
       ("OBSOLESCENCE","Obsolescence / Sustaining-Eng. Manager",60,36,GREEN,WHITE,28,0,52,"middle")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VOLUME PROGRAMS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE / HI-REL &amp; MEDICAL</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / INTEGRATION</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">NICHE / LOW-VOLUME</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{BLUE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Industrial / IoT Design Engineer</text>
  <circle cx="350" cy="557" r="7" fill="{ORANGE}"/><text x="362" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Medical-Device R&amp;D Lead</text>
  <circle cx="600" cy="557" r="7" fill="{TEAL}"/><text x="612" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Aerospace &amp; Defense Program Engineer</text>
  <circle cx="84" cy="581" r="7" fill="{GREEN}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Obsolescence / Sustaining-Engineering Manager</text>
  <text x="430" y="586" font-family="Segoe UI,Arial" font-size="11.5" font-style="italic" fill="{GREY}">Cross-cutting trigger: an obsolete part can appear in any market.</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Segments — Unit Volume x Value &amp; Complexity per Program</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Buyer archetypes evidenced by named customers, served markets, and trade-show presence. Bubble size = relative value per program. Calibrate at discovery.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Value &amp; Engineering Complexity per Program -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Annual Unit Volume -&gt;</text>
  {quad}{dots}{legend}
</svg>'''

# ============================================================ ARCHITECTURE
def arch_card(x,y,w,h,accent,title,desc,badge,badge_color):
    t=esc(title); d=esc(desc); b=esc(badge)
    badge_txt=WHITE if badge_color in (BLUE,DARK,TEAL,PURPLE) else DARK
    words=d.split(); l1,l2,cnt,on2=[],[],0,False
    for w_ in words:
        if not on2 and cnt+len(w_)+1<=38: l1.append(w_); cnt+=len(w_)+1
        else: on2=True; l2.append(w_)
    bw=len(b)*7+16; bx=x+w-bw-8; by=y+h-22
    return f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+20}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>
  <text x="{x+14}" y="{y+36}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+14}" y="{y+50}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{" ".join(l2)}</text>
  <rect x="{bx}" y="{by}" width="{bw}" height="16" fill="{badge_color}" rx="8"/>
  <text x="{bx+bw//2}" y="{by+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{badge_txt}" text-anchor="middle">{b}</text>'''

def build_arch_svg():
    marker=f'<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{BLUE}"/></marker></defs>'
    headers=f'''
  <rect x="16" y="76" width="264" height="48" fill="{BLUE}" rx="4"/>
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND &amp; WIN</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">authority + named accounts</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">QUOTE &amp; DESIGN FASTER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">RFQ - spec - cross-ref - datasheet</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RUN THE BACK OFFICE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">test docs - support - knowledge</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    col1=(arch_card(20,136,256,88,BLUE,"Authority / AEO Content","Be the cited answer when a design engineer asks an AI assistant for a custom-ASIC partner.","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"Technical Long-Tail Pages","Datasheet-grade pages for each capability so search and AI find the right CSS expertise.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Account & Trigger Intelligence","Watch target OEMs for EOL notices, new programs, and design-win signals to time outreach.","My AI",TEAL)
        +arch_card(20,436,256,88,BLUE,"Trade-Show Capture & Follow-up","Turn Sensors Converge, MD&M, and GOMACTech contacts into fast, personalised follow-up.","My AI",TEAL))
    col2=(arch_card(320,136,256,88,ORANGE,"RFQ to Spec & NRE Drafting","Turn a loose requirement into a structured spec and quote estimate in minutes, not days.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Obsolescence Cross-Reference","An EOL part in, CSS drop-in replacement candidates out, parametrically matched.","My Dev",DARK)
        +arch_card(320,336,256,88,ORANGE,"Datasheet & App-Note Generation","Draft datasheets, app notes, and product briefs consistently from design data.","My AI",TEAL)
        +arch_card(320,436,256,88,ORANGE,"Spec-Compliance Double-Check","Several models peer-review critical parameters; a wrong number is a tape-out risk.","My AI",TEAL))
    col3=(arch_card(620,136,256,88,TEAL,"Test-Program & Char. Docs","Assemble test programs, characterisation reports, and quality records into audit-ready form.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Customer Technical Support AI","Answer integration questions instantly from CSS's own datasheets and design notes.","My AI",TEAL)
        +arch_card(620,336,256,88,TEAL,"Institutional Knowledge Graph","Capture 25+ year veterans' know-how before retirement; make it searchable for the team.","My Dev",DARK)
        +arch_card(620,436,256,88,TEAL,"Project / Tape-out Tracking","An AI layer that flags at-risk milestones across concurrent design and test programs.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">win</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">deliver</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Custom Silicon Solutions AI Growth &amp; Integration Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Win more design wins (left); quote and design faster (centre); automate the engineering back office (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI - My Dev. AI augments the engineers; a qualified engineer signs off every spec, quote, and parameter, and proprietary designs stay in private, governed deployments.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">{marker}{title}{headers}{bg}{col1}{col2}{col3}{arrows}{note}</svg>'

# ============================================================ TIMELINE
def milestone_card(x,y,w,h,accent,num,title,body,tag,tag_color):
    t=esc(title); bd=esc(body); tg=esc(tag)
    tw=len(tg)*7+16; tx=x+w-tw-8; ty=y+h-22
    tag_txt=WHITE if tag_color in (BLUE,DARK,TEAL,PURPLE) else DARK
    words=bd.split(); l1,l2,cnt,on2=[],[],0,False
    for w_ in words:
        if not on2 and cnt+len(w_)+1<=30: l1.append(w_); cnt+=len(w_)+1
        else: on2=True; l2.append(w_)
    return f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+17}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{accent}">MILESTONE {num}</text>
  <text x="{x+14}" y="{y+33}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>
  <text x="{x+14}" y="{y+48}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+14}" y="{y+61}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{" ".join(l2)}</text>
  <rect x="{tx}" y="{ty}" width="{tw}" height="16" fill="{tag_color}" rx="8"/>
  <text x="{tx+tw//2}" y="{ty+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{tag_txt}" text-anchor="middle">{tg}</text>'''

def build_timeline_svg():
    P1_X,P2_X,P3_X=80,328,576; P1_W,P2_W,P3_W=248,248,244
    phases=f'''
  <rect x="{P1_X}" y="60" width="{P1_W}" height="44" fill="{BLUE}" rx="4"/>
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1-90</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">QUOTE &amp; WIN FASTER</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; INTEGRATE</text>'''
    TL_Y,TL_H=110,18
    bar=f'''
  <defs><linearGradient id="tl" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="{BLUE}"/><stop offset="40%" stop-color="{TEAL}"/><stop offset="70%" stop-color="{ORANGE}"/><stop offset="100%" stop-color="#c45e2c"/></linearGradient></defs>
  <rect x="80" y="{TL_Y}" width="740" height="{TL_H}" fill="url(#tl)" rx="4"/>
  <line x1="80" y1="{TL_Y-5}" x2="80" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <line x1="328" y1="{TL_Y-5}" x2="328" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="576" y1="{TL_Y-5}" x2="576" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="820" y1="{TL_Y-5}" x2="820" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <text x="80" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 0</text>
  <text x="328" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 90</text>
  <text x="576" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 180</text>
  <text x="820" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 365</text>'''
    COL_X=[84,340,588]; R1,R2=162,266
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","AI Readiness + Workflow Map","Map design, RFQ, test, and documentation workflows; pick the two highest-ROI automations.","My AI",TEAL)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","AEO + Technical Long-Tail","Extend the SEO we already run into AI-search authority and datasheet-grade capability pages.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","RFQ to Spec / NRE Drafting","Turn loose requirements into structured specs and quote estimates; an engineer confirms each.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Obsolescence Cross-Ref Tool","A parametric matcher that turns dead-part searches into CSS drop-in opportunities.","My Dev",DARK)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Test Docs + Knowledge Graph","Automate characterisation/test documentation; capture veteran know-how before retirement.","My Dev",DARK)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Account Intel + ROI Dashboard","Trigger intelligence on target OEMs and a measured ROI dashboard for every claim.","My AI",TEAL))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate after a discovery call (see the Questions section). The build is staged so each phase pays before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Growth &amp; Integration Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Custom Silicon Solutions x Technijian — get found, quote and win faster, then automate and scale.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE 2x2 (US turnkey accountability x analog/mixed-signal depth)
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, turnkey_x, depth_y, color, r, ldx, ldy, anchor)
    C=[("CUSTOM SILICON SOLUTIONS",82,80,ORANGE,30,0,52,"middle"),
       ("Offshore analog boutiques (AnSem, ICsense)",40,82,BLUE,24,0,-40,"middle"),
       ("US boutiques (ASIC North, System to ASIC)",60,62,TEAL,22,0,40,"middle"),
       ("Big / structured-ASIC (Renesas, AI-scale)",72,26,DARK,24,0,40,"middle"),
       ("In-house design team",24,68,GOLD,18,36,2,"start"),
       ("Standard IC / DIY discrete",16,22,GREY,16,0,34,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="CUSTOM SILICON SOLUTIONS" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(60),Y(62); sx,sy=X(82),Y(80)
    move=f'''
  <line x1="{tx+8}" y1="{ty-22}" x2="{sx-8}" y2="{sy+34}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{X(80)}" y="{Y(58)}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">add AI visibility + speed</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">US TURNKEY + ANALOG-EXPERT (the prize)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DEEP BUT OFFSHORE / DIY LOAD</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">TURNKEY BUT NOT ANALOG-FOCUSED</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">COMMODITY / DIY RISK</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning — US Turnkey Accountability x Analog/Mixed-Signal Depth</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score. Offshore houses are deep but not US-accountable; big-ASIC won't take low/mid-volume analog — the top-right is CSS's corner.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Analog / Mixed-Signal &amp; High-Voltage Depth -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">US Turnkey Accountability (design -&gt; in-house test -&gt; production) -&gt;</text>
  {quad}{dots}{move}
</svg>'''

# ============================================================ RENDER
async def render(page,html,output):
    await page.set_content(html,wait_until="networkidle")
    box_=await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width":max(box_["w"],900),"height":max(box_["h"],100)})
    await page.screenshot(path=str(output),full_page=True)
    print(f"  saved -> {output.name} ({output.stat().st_size//1024} KB)")

async def main():
    print("Generating Custom Silicon Solutions diagrams (SVG)...")
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(); page=await browser.new_page(device_scale_factor=2)
        print("1  model.png");        await render(page,page_shell(build_model_svg()),       DIAGRAMS_DIR/"model.png")
        print("2  personas.png");     await render(page,page_shell(build_personas_svg()),    DIAGRAMS_DIR/"personas.png")
        print("3  architecture.png"); await render(page,page_shell(build_arch_svg()),        DIAGRAMS_DIR/"architecture.png")
        print("4  timeline.png");     await render(page,page_shell(build_timeline_svg()),    DIAGRAMS_DIR/"timeline.png")
        print("5  competitive.png");  await render(page,page_shell(build_competitive_svg()), DIAGRAMS_DIR/"competitive.png")
        await browser.close()
    print("Done.")

if __name__=="__main__":
    asyncio.run(main())
