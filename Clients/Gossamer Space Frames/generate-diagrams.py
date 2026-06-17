"""
generate-diagrams.py — Gossamer Space Frames (GSF) AI Growth Blueprint
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
SVG on a 4px grid, >=11px node text, WCAG contrast, solid fills, brand tokens.
Engineer-to-engineer, for-profit framing. The reframe: NOT managed IT / security
(already declined) — AI for the COMMERCIAL front end: being found and winning work.
AI never touches the structural engineering; it helps the market find a proven firm.

Output -> Clients/Gossamer Space Frames/diagrams/{model,personas,architecture,timeline,competitive}.png
Usage:   py -3.12 "Clients/Gossamer Space Frames/generate-diagrams.py"
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

# ============================================================ MODEL — how the firm wins & delivers work
def build_model_svg():
    marker=f'<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker></defs>'
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Gossamer Wins &amp; Delivers Work</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Work comes in; world-class engineering turns it into proven structures; results, told well, bring the next project.</text>'''
    supply=(box(40,92,196,66,WHITE,TEAL,"INQUIRIES & RFPs","developers, EPCs, GCs",DARK,GREY)
        +box(40,168,196,66,WHITE,TEAL,"REPUTATION & REFERRALS","patents, NREL, awards",DARK,GREY)
        +box(40,244,196,66,WHITE,TEAL,"PARTNER / CHANNEL","3M, EPC & utility ties",DARK,GREY))
    sup_label=f'<text x="138" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">WORK IN</text>'
    hub=box(304,150,196,150,DARK,DARK,"GOSSAMER","engineer & fabricate",WHITE,"#C9CDD6",18)
    hub_extra=f'''<text x="402" y="266" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">space frames · CSP troughs</text>
  <text x="402" y="282" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">patented IP · the crown jewel</text>'''
    demand=(box(568,80,292,56,WHITE,BLUE,"LOWER-COST SOLAR FIELDS","LAT 73: >25% field cost cut",DARK,GREY)
        +box(568,148,292,56,WHITE,BLUE,"VERIFIED PERFORMANCE","NREL: >99% optical intercept",DARK,GREY)
        +box(568,216,292,56,WHITE,BLUE,"ICONIC LONG-SPAN STRUCTURES","Co-Axial Joint architecture",DARK,GREY)
        +box(568,284,292,56,WHITE,BLUE,"DURABLE INSTALLATIONS","award-winning CSP plants",DARK,GREY))
    dem_label=f'<text x="714" y="70" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">PROVEN OUTCOMES</text>'
    arrows=f'''
  <line x1="236" y1="125" x2="300" y2="200" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="201" x2="300" y2="224" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="277" x2="300" y2="250" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="205" x2="564" y2="108" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="220" x2="564" y2="176" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="240" x2="564" y2="244" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="258" x2="564" y2="312" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    seg=f'''
  <rect x="40" y="356" width="820" height="44" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="52" y="374" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">THE IP</text>
  <text x="52" y="391" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">LAT 73 Large Aperture Trough  ·  SunLock center drive  ·  MiniTruss / X-PERF panels  ·  Co-Axial Joint System  ·  architectural space frames  ·  multiple US patents</text>'''
    band=f'''
  <rect x="40" y="412" width="820" height="62" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="412" width="6" height="62" rx="3" fill="{ORANGE}"/>
  <text x="60" y="435" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in — the front end only (it never touches your engineering)</text>
  <text x="60" y="456" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">be found in search &amp; AI answers  ·  project &amp; RFP intelligence  ·  lead identification  ·  proposal &amp; spec drafting  ·  case studies / storytelling</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{sup_label}{supply}{hub}{hub_extra}{dem_label}{demand}{arrows}{seg}{band}</svg>'

# ============================================================ PERSONAS — buyer & channel map
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    # (key, label, deal-value x, sourcing-now y, color, textcolor, r, label dx, label dy, anchor)
    P=[("CSP/EPC","CSP Developers & EPCs",84,84,BLUE,WHITE,30,0,-44,"middle"),
       ("MENA","International / MENA Developers",90,70,GOLD,DARK,28,0,44,"middle"),
       ("UTILITY","Electric Utilities",74,52,TEAL,DARK,26,44,2,"start"),
       ("HEAT","Industrial Process-Heat / Desal",60,76,ORANGE,DARK,26,0,-42,"middle"),
       ("ARCH","Architects & GCs (space frames)",48,48,GREEN,WHITE,24,0,-40,"middle"),
       ("GOV","Government / National Labs",34,30,GREY,WHITE,22,-30,4,"end")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{tc}" text-anchor="middle">{esc(key)}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">PURSUE NOW</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">GROWING — NURTURE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE, SLOWER</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">SELECTIVE</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{BLUE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">CSP Developers &amp; EPCs</text>
  <circle cx="272" cy="557" r="7" fill="{GOLD}"/><text x="284" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">International / MENA</text>
  <circle cx="448" cy="557" r="7" fill="{TEAL}"/><text x="460" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Electric Utilities</text>
  <circle cx="600" cy="557" r="7" fill="{ORANGE}"/><text x="612" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Industrial Process-Heat</text>
  <circle cx="84" cy="581" r="7" fill="{GREEN}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Architects &amp; GCs</text>
  <circle cx="272" cy="581" r="7" fill="{GREY}"/><text x="284" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Government / National Labs</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Buyer &amp; Channel Map — Deal Value x How Actively Sourcing Now</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Who buys structures like Gossamer's, and how actively each segment is sourcing in 2026. Archetypes to calibrate at discovery, not a ranked account list.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Sourcing Intensity Now -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Deal Value -&gt;</text>
  {quad}{dots}{legend}
</svg>'''

# ============================================================ ARCHITECTURE — the AI growth engine
def arch_card(x,y,w,h,accent,title,desc,badge,badge_color):
    t=esc(title); d=esc(desc); b=esc(badge)
    badge_txt=WHITE if badge_color in (BLUE,DARK,TEAL,PURPLE,GREEN) else DARK
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">BE FOUND &amp; TELL THE STORY</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">visibility · authority · AEO</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN MORE WORK</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">pipeline · leads · proposals</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RESPOND &amp; OPERATE FASTER</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">specs · knowledge · estimating</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    inbound=(arch_card(20,136,256,88,BLUE,"Modern Site & Tech Content","Replace the 2012-era .htm site with a fast, technical, credible web presence.","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"Authority & Case Studies","Turn LAT 73, Martin / FPL, and NREL verification into living, citable proof.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"AEO / GEO for Buyer Terms","Be the answer for 'large aperture trough', 'CSP support structure', and more.","My SEO",BLUE)
        +arch_card(20,436,256,88,BLUE,"Search & Directory Presence","Surface for the terms developers and EPCs actually search — not just your name.","My SEO",BLUE))
    core=(arch_card(320,136,256,88,ORANGE,"Project & RFP Intelligence","Track CSP, industrial-heat, and space-frame projects and tenders as they emerge.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Lead Identification","Find and prioritize developers, EPCs, and GCs actively sourcing structures now.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"Outreach & Follow-up","Draft tailored, technical first-touch and follow-up; Glenn owns every relationship.","My AI",TEAL)
        +arch_card(320,436,256,88,ORANGE,"International / MENA Reach","Surface and translate for the Middle East & North Africa CSP pipeline.","My AI",TEAL))
    outbound=(arch_card(620,136,256,88,TEAL,"Proposal & Spec Drafting","First drafts of proposals, capability statements, and spec responses from your facts.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Knowledge Graph of the IP","25+ years of designs, patents, and projects made instantly searchable for the team.","My Dev",DARK)
        +arch_card(620,336,256,88,TEAL,"Estimating Support","Pull comparable past work to speed and de-risk ballpark estimates and scoping.","My AI",TEAL)
        +arch_card(620,436,256,88,TEAL,"Inquiry & RFP Triage","Sort and route incoming inquiries; nothing high-value slips through a small team.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">find</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">win</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Gossamer AI Growth Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Be found and tell the story (left); win more work (center); respond and operate faster (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · My AI · My Dev. AI works the commercial front end and drafts; a person verifies every claim and owns every relationship. It never touches the structural engineering.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">{marker}{title}{headers}{bg}{inbound}{core}{outbound}{arrows}{note}</svg>'

# ============================================================ TIMELINE
def milestone_card(x,y,w,h,accent,num,title,body,tag,tag_color):
    t=esc(title); bd=esc(body); tg=esc(tag)
    tw=len(tg)*7+16; tx=x+w-tw-8; ty=y+h-22
    tag_txt=WHITE if tag_color in (BLUE,DARK,TEAL,PURPLE,GREEN) else DARK
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">BE FOUND</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">WIN WORK</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; SUSTAIN</text>'''
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Modern Site + Content","New technical site; LAT / NREL case studies surfaced.","My SEO",BLUE)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Get Discoverable","AEO/GEO for buyer terms; revive a credible LinkedIn.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Pipeline Intelligence","Track CSP, process-heat & space-frame RFPs and tenders.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Lead & Outreach Engine","Identify active buyers; AI-drafted technical outreach.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Proposal Automation","Faster proposals & spec responses from your own facts.","My AI",TEAL)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Knowledge Graph + Dashboard","25 yrs of IP searchable; a measured pipeline dashboard.","My Dev",DARK))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate at discovery and flex to capacity; each phase is sized to pay for itself before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Gossamer x Technijian — get found, win more work, then scale and sustain the engine.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE / VISIBILITY-DEMAND 2x2
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, visibility/discoverability x, technical credibility y, color, r, ldx, ldy, anchor)
    C=[("GOSSAMER",24,80,ORANGE,28,44,-36,"start"),
       ("SkyFuel (aluminum SpaceFrame)",64,66,BLUE,22,0,-32,"middle"),
       ("Geometrica / MERO (space frames)",82,56,TEAL,20,0,36,"middle"),
       ("Glass-mirror collector suppliers",58,46,GREY,16,0,34,"middle"),
       ("Newer digital-first entrants",32,38,GREEN,16,0,-30,"middle"),
       ("Market reports / directories",84,22,GOLD,18,0,36,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="GOSSAMER" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(72),Y(80); sx,sy=X(24),Y(80)
    move=f'''
  <line x1="{sx+34}" y1="{sy}" x2="{tx-14}" y2="{ty}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{(sx+tx)//2}" y="{ty-18}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">Found AND proven — where the work goes</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">FOUND + PROVEN</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">PROVEN, HARD TO FIND</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">VISIBLE, LESS PROVEN</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOW PROFILE</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Visibility &amp; Demand Landscape — Discoverability x Technical Credibility</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score — and a discovery item, not a verified peer benchmark. Gossamer's gap is reach, not proof.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Technical Credibility &amp; Proof -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Online Visibility / Discoverability -&gt;</text>
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
    print("Generating Gossamer Space Frames diagrams (SVG)...")
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
