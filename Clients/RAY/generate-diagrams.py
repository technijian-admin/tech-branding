"""
generate-diagrams.py — Rayco Exteriors (RAY) AI Growth & Bid-Intelligence Blueprint
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
SVG on a 4px grid, >=10.5px node text, WCAG contrast, solid fills, brand tokens.
Account-based (ABM), for-profit framing. The reframe: NOT managed IT / security
(already declined) — AI for the COMMERCIAL front end: being found by community
managers and winning more HOA/CID reconstruction bids. AI never touches the field work.

Output -> Clients/RAY/diagrams/{model,personas,architecture,timeline,competitive}.png
Usage:   py -3.12 "Clients/RAY/generate-diagrams.py"
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Rayco Wins &amp; Delivers Work</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Work comes in through managers and bid lists; field craft restores the building; results, told well, win the next community.</text>'''
    supply=(box(40,92,196,66,WHITE,TEAL,"RFP / BID INVITATIONS","CM specs · HOA boards",DARK,GREY)
        +box(40,168,196,66,WHITE,TEAL,"CAM REFERRALS & VENDOR LISTS","management portfolios",DARK,GREY)
        +box(40,244,196,66,WHITE,TEAL,"CACM / CAI PRESENCE","Industry Partner Plus",DARK,GREY))
    sup_label=f'<text x="138" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">WORK IN</text>'
    hub=box(304,150,196,150,DARK,DARK,"RAYCO","reconstruct & waterproof",WHITE,"#C9CDD6",18)
    hub_extra=f'''<text x="402" y="266" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">exterior rehab · decks · stucco</text>
  <text x="402" y="282" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">the field craft · your domain</text>'''
    demand=(box(568,80,292,56,WHITE,BLUE,"RESTORED BUILDING ENVELOPES","3,500+ communities & buildings",DARK,GREY)
        +box(568,148,292,56,WHITE,BLUE,"SB 326 REPAIRS COMPLETED","to spec, under permit",DARK,GREY)
        +box(568,216,292,56,WHITE,BLUE,"WARRANTY & ANNUAL INSPECTIONS","written reports, touch-up",DARK,GREY)
        +box(568,284,292,56,WHITE,BLUE,"REFERENCEABLE COMMUNITIES","board & CAM trust",DARK,GREY))
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
  <text x="52" y="374" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">THE CRAFT</text>
  <text x="52" y="391" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Complete exterior rehab  ·  painting &amp; waterproofing  ·  wood / dry-rot  ·  decks &amp; balconies  ·  stucco &amp; masonry  ·  railings  ·  siding  ·  B / C-33 licensed</text>'''
    band=f'''
  <rect x="40" y="412" width="820" height="62" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="412" width="6" height="62" rx="3" fill="{ORANGE}"/>
  <text x="60" y="435" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in — the commercial front end only (it never touches your field reconstruction)</text>
  <text x="60" y="456" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">be found in search &amp; AI answers  ·  SB 326 account intelligence  ·  RFP &amp; spec drafting  ·  reputation / reviews  ·  proposal generation  ·  manager follow-up</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{sup_label}{supply}{hub}{hub_extra}{dem_label}{demand}{arrows}{seg}{band}</svg>'

# ============================================================ PERSONAS — buyer & decision-chain map
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    # (key, label, leverage x, sourcing-now y, color, textcolor, r, label dx, label dy, anchor)
    P=[("MGMT","Community Management Companies",84,68,BLUE,WHITE,30,0,-46,"middle"),
       ("BOARD","HOA Boards (the decider)",56,82,ORANGE,DARK,28,-34,-30,"middle"),
       ("CAM","Community Assn Managers (gatekeeper)",68,76,TEAL,DARK,26,40,-30,"start"),
       ("SPEC","Construction Mgrs / Specifiers",74,54,GREEN,WHITE,24,38,4,"start"),
       ("SB326","SB 326 / overdue-inspection CIDs",38,86,GOLD,DARK,26,0,-40,"middle"),
       ("COMM","Commercial / mixed-use property",46,40,GREY,WHITE,22,-30,4,"end")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{tc}" text-anchor="middle">{esc(key)}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">PURSUE NOW</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">DEADLINE-DRIVEN</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-LEVERAGE, SLOWER</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">SELECTIVE</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{BLUE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Management Companies</text>
  <circle cx="272" cy="557" r="7" fill="{ORANGE}"/><text x="284" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">HOA Boards</text>
  <circle cx="420" cy="557" r="7" fill="{TEAL}"/><text x="432" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Community Assn Managers</text>
  <circle cx="624" cy="557" r="7" fill="{GREEN}"/><text x="636" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Construction Mgrs / Specifiers</text>
  <circle cx="84" cy="581" r="7" fill="{GOLD}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">SB 326 / overdue-inspection CIDs</text>
  <circle cx="320" cy="581" r="7" fill="{GREY}"/><text x="332" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Commercial / mixed-use</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Buyer &amp; Decision-Chain Map — Deal Leverage x How Actively Sourcing Now</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Who hires a reconstruction contractor, and how actively each is sourcing in 2026. Archetypes to calibrate at discovery, not a ranked account list.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Sourcing Intensity Now -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Portfolio / Deal Leverage -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">BE FOUND &amp; TRUSTED</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">visibility · reviews · authority</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN MORE BIDS</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">SB 326 intel · portfolios · RFPs</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RESPOND &amp; OPERATE FASTER</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">estimates · knowledge · packets</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    inbound=(arch_card(20,136,256,88,BLUE,"Modern Site + SB 326 Content","A fast site with board-ready SB 326 and reserve-funding explainers.","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"AEO / GEO for Buyer Terms","Be the answer for 'HOA reconstruction contractor OC / San Diego'.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Reputation & Reviews Engine","Close the review gap; systematic solicitation and response, on autopilot.","My SEO",BLUE)
        +arch_card(20,436,256,88,BLUE,"Authority & Case Studies","Turn 3,500 projects into citable proof boards and CAMs can find.","My SEO",BLUE))
    core=(arch_card(320,136,256,88,ORANGE,"SB 326 / 721 Account Intelligence","Flag CIDs entering 9-year cycles or overdue on balcony inspections.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Portfolio Mapping","Map which HOAs FirstService, Seabreeze, Powerstone, Action manage.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"RFP & Spec Response Drafting","Draft bids mapped to the construction manager's specification, faster.","My AI",TEAL)
        +arch_card(320,436,256,88,ORANGE,"CACM / CAI Event Follow-up","Capture booth and seminar leads; structured, personalized manager follow-up.","My AI",TEAL))
    outbound=(arch_card(620,136,256,88,TEAL,"Estimate-to-Proposal Speed","AI-assisted takeoff narrative and scope-to-proposal for the estimator.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Knowledge from 3,500 Projects","Comparable scopes, costs, and photos retrievable to speed and de-risk bids.","My Dev",DARK)
        +arch_card(620,336,256,88,TEAL,"Preferred-Vendor Packets","Generate the licensing, insurance, and references packets firms require.","My AI",TEAL)
        +arch_card(620,436,256,88,TEAL,"Inbound Lead Scoring & Triage","Prioritize inquiries by deal size, deadline, and portfolio leverage.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">find</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">win</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Rayco AI Growth &amp; Bid-Intelligence Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Be found and trusted (left); win more bids (center); respond and operate faster (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · My AI · My Dev. AI works the commercial front end and drafts; a person verifies every claim and owns every relationship. It never touches the field reconstruction.</text>'
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">BE FOUND &amp; TRUSTED</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">WIN MORE BIDS</text>
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Site + SB 326 Content","New site; board-ready SB 326 and reserve explainers.","My SEO",BLUE)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Reviews + Discoverability","Reputation engine; AEO/GEO for buyer terms.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","SB 326 Account Intelligence","Flag CIDs in-cycle or overdue; prioritized targets.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Portfolio + RFP Engine","Map management portfolios; AI-drafted spec responses.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Proposal Automation","Faster proposals from your own scopes and facts.","My AI",TEAL)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Knowledge Graph + Dashboard","3,500 projects searchable; a pipeline dashboard.","My Dev",DARK))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate at discovery and flex to capacity; each phase is sized to pay for itself before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Rayco x Technijian — get found and trusted, win more bids, then scale and sustain the engine.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE / VISIBILITY-REPUTATION 2x2
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, visibility/discoverability x, reputation depth y, color, r, ldx, ldy, anchor)
    C=[("RAYCO",40,48,ORANGE,28,0,46,"middle"),
       ("EmpireWorks (scale leader)",82,60,BLUE,22,-32,4,"end"),
       ("BRR (SD balcony, reviews-led)",60,82,TEAL,20,-28,2,"end"),
       ("Pacific Western (SD depth)",52,70,GREY,18,-30,4,"end"),
       ("Bay Cities (SB 326 content)",60,48,GREEN,16,0,34,"middle"),
       ("CACM / CAI directories",84,28,GOLD,18,0,36,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="RAYCO" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(86),Y(84); sx,sy=X(40),Y(48)
    move=f'''
  <line x1="{sx+30}" y1="{sy-12}" x2="{tx-14}" y2="{ty+8}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+12}" y="{ty-22}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="end">Found AND trusted</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">FOUND + TRUSTED</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">TRUSTED, HARDER TO FIND</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">VISIBLE, THINNER REVIEWS</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOW PROFILE</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Visibility &amp; Reputation Landscape — Discoverability x Public Review Depth</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score — and a discovery item, not a verified peer benchmark. Rayco's project proof is real; its public review depth is the gap.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Public Reputation &amp; Review Depth -&gt;</text>
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
    print("Generating Rayco Exteriors diagrams (SVG)...")
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
