"""
generate-diagrams.py — Canusa Hershman (CHR) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
SVG on a 4px grid, >=11px node text, WCAG contrast, solid fills, brand tokens.

Output -> Clients/Canusa Hershman/diagrams/{model,personas,architecture,timeline,competitive}.png
Usage:   python "Clients/Canusa Hershman/generate-diagrams.py"
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Canusa Hershman Trades the Market</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">An independent group in the middle of a two-sided trade: it sources recovered materials, finances and moves them, and sells to mills and consumers worldwide.</text>'''
    supply=(box(40,92,196,66,WHITE,TEAL,"GENERATORS & MRFs","manufacturers · printers · retailers",DARK,GREY)
        +box(40,168,196,66,WHITE,TEAL,"OWN MRFs — Recycle 1","4 processing plants",DARK,GREY)
        +box(40,244,196,66,WHITE,TEAL,"GLOBAL SUPPLY","North America · Europe",DARK,GREY))
    sup_label=f'<text x="138" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">SUPPLY</text>'
    hub=box(304,150,196,150,DARK,DARK,"CANUSA HERSHMAN","trade · finance · move",WHITE,"#C9CDD6",19)
    hub_extra=f'''<text x="402" y="266" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">market access · financing</text>
  <text x="402" y="282" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">supply-chain · cieTrade</text>'''
    demand=(box(568,80,292,56,WHITE,BLUE,"DOMESTIC PAPER MILLS","fiber & containerboard buyers",DARK,GREY)
        +box(568,148,292,56,WHITE,BLUE,"EXPORT MILLS — Newport CH","LatAm · India · SE Asia",DARK,GREY)
        +box(568,216,292,56,WHITE,BLUE,"PLASTICS & RESIN — BA/CH","recycled + virgin resin",DARK,GREY)
        +box(568,284,292,56,WHITE,BLUE,"PACKAGING PAPERS — Evergreen","linerboard · kraft · specialty",DARK,GREY))
    dem_label=f'<text x="714" y="70" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">DEMAND</text>'
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
  <text x="52" y="374" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">DIVISIONS</text>
  <text x="52" y="391" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">CHRC (fiber/plastics/metals)  ·  Recycle 1 (processing)  ·  BA/CH Polymers  ·  Evergreen Fibres  ·  Pulp &amp; Alt Fibers  ·  Newport CH (export JV)</text>'''
    band=f'''
  <rect x="40" y="412" width="820" height="62" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="412" width="6" height="62" rx="3" fill="{ORANGE}"/>
  <text x="60" y="435" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="60" y="456" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">commodity price &amp; market signals  ·  trade-document automation  ·  demand forecasting  ·  vendor / credit intelligence  ·  cieTrade dashboards  ·  digital authority / AEO</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{sup_label}{supply}{hub}{hub_extra}{dem_label}{demand}{arrows}{seg}{band}</svg>'

# ============================================================ PERSONAS (segment matrix)
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    P=[("EXP MILL","Export Mill Buyer",84,80,ORANGE,DARK,32,0,-44,"middle"),
       ("DOM MILL","Domestic Mill Buyer",80,52,BLUE,WHITE,32,0,50,"middle"),
       ("GEN/MRF","Large Generator / MRF",62,46,TEAL,DARK,28,-38,2,"end"),
       ("BRAND","Brand / ESG Supplier",36,80,GREEN,WHITE,24,0,-38,"middle"),
       ("RESIN","Plastics / Resin Buyer",44,62,GOLD,DARK,24,40,2,"start"),
       ("METALS","Metals Buyer",26,40,DARK,WHITE,22,0,40,"middle")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR RELATIONSHIPS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">STRATEGIC / GROWTH</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / RECURRING</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC / SPOT</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{ORANGE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Export Mill Buyer (Asia / LatAm)</text>
  <circle cx="330" cy="557" r="7" fill="{BLUE}"/><text x="342" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Domestic Mill Buyer</text>
  <circle cx="560" cy="557" r="7" fill="{TEAL}"/><text x="572" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Large Generator / MRF (supply)</text>
  <circle cx="84" cy="581" r="7" fill="{GREEN}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Brand / Manufacturer ESG Supplier</text>
  <circle cx="360" cy="581" r="7" fill="{GOLD}"/><text x="372" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Plastics / Resin Buyer</text>
  <circle cx="590" cy="581" r="7" fill="{DARK}"/><text x="602" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Metals Buyer</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Trade-Relationship Matrix — Volume x Strategic Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Archetypes of the buy-side and sell-side relationships Canusa Hershman manages. Bubble size = relative volume. Calibrate at discovery.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Strategic Value -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Trade Volume -&gt;</text>
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">authority + searchable demand</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">TRADE &amp; ACCOUNT INTEL</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">price, accounts, credit, signals</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">OPS &amp; INTEGRATION</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">cieTrade · docs · logistics</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    inbound=(arch_card(20,136,256,88,BLUE,"Authority & Market Content","Market commentary and grade guides — the firm publishes none today; a clear gap to own.","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"AEO / GEO Citations","Be the cited source in ChatGPT, Perplexity & Google AI Overviews for recovered-material sourcing.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Brand Hygiene + Per-Location","Fix the mislabeled LinkedIn industry; profiles for Branford + Recycle 1 plants.","My SEO",BLUE)
        +arch_card(20,436,256,88,BLUE,"Supplier / Generator Inbound","Capture generators searching to place tonnage; route leads to the right division.","My Dev",DARK))
    core=(arch_card(320,136,256,88,ORANGE,"Commodity Price & Signals","Decision-support on price trends and market signals — probabilistic, never a guarantee.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Account & Credit Intelligence","Vendor and customer risk scoring on payment history and market conditions.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"Trader Account Dossiers","Pre-call briefs for traders and AEs; flag at-risk supply or buyer relationships.","Lead Gen",ORANGE)
        +arch_card(320,436,256,88,ORANGE,"Contract / Expiry Monitoring","Track expiring supply and offtake agreements; surface re-trade opportunities early.","My AI",TEAL))
    outbound=(arch_card(620,136,256,88,TEAL,"Trade-Doc Automation -> cieTrade","Bills of lading, customs declarations & certificates of origin, parsed into cieTrade.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Portal + Chatbot on cieTrade","Self-serve order, document and balance lookups for suppliers and customers, 24/7.","My Dev",DARK)
        +arch_card(620,336,256,88,TEAL,"Logistics & Container Optimization","Match loads to lanes and forwarders; cut demurrage and empty miles on export.","My Dev",DARK)
        +arch_card(620,436,256,88,TEAL,"ESG / Sustainability Reporting","Automate diversion and recovery reporting for customers and the sustainability page.","My AI",TEAL))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">data</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">act</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Canusa Hershman AI Growth &amp; Integration Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Be found and trusted (left); arm the traders with intelligence (center); automate the back office around cieTrade (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · My AI · My AI Lead Gen · My Dev. AI augments traders and the cieTrade system of record — it does not replace the trader relationship that closes a contract.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">{marker}{title}{headers}{bg}{inbound}{core}{outbound}{arrows}{note}</svg>'

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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">TRADE INTELLIGENCE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">INTEGRATE &amp; SCALE</text>'''
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Authority + Brand Hygiene","Fix LinkedIn label, per-location profiles, technical SEO + first market-content hub.","My SEO",BLUE)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","AI Readiness + cieTrade Scope","Map workflows and cieTrade modules; pick the two highest-ROI automations.","My AI",TEAL)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Price & Market Signals","Decision-support dashboard for traders; AEO/GEO content begins to get cited.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Trade-Doc Automation Pilot","BoL / customs / certificate-of-origin parsing into cieTrade; account dossiers.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Portal, Chatbot & Logistics","Supplier/customer self-serve on cieTrade; container & lane optimization live.","My Dev",DARK)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Credit Intel + ESG + ROI","Credit scoring, sustainability reporting, and a measured ROI dashboard.","My AI",TEAL))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate after a discovery call (see the Questions section). The build is staged so each phase pays before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Growth &amp; Integration Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Canusa Hershman x Technijian — get found, arm the traders, integrate the back office.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE 2x2
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, scale, maturity, color, r, ldx, ldy, anchor)
    C=[("CANUSA HERSHMAN",72,27,ORANGE,30,0,52,"middle"),
       ("Smurfit Westrock",94,51,BLUE,22,0,-32,"middle"),
       ("WM / Republic",88,36,GREY,18,30,4,"start"),
       ("Pratt Recycling",60,43,TEAL,18,0,-30,"middle"),
       ("Greif / Caraustar",48,24,GOLD,16,0,34,"middle"),
       ("Cellmark",64,60,GREEN,18,30,2,"start"),
       ("B2B recycling marketplaces",26,82,DARK,18,0,-30,"middle"),
       ("Regional brokers / MRFs",28,20,GREY,16,0,34,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="CANUSA HERSHMAN" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(80),Y(80); sx,sy=X(72),Y(27)
    move=f'''
  <line x1="{sx}" y1="{sy-34}" x2="{tx}" y2="{ty+22}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx+16}" y="{ty-6}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="start">The open lane: scale + AI</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE + DIGITAL LEADERS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DIGITAL-NATIVE, SUB-SCALE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SCALE, DIGITALLY UNDER-BUILT</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">REGIONAL / DATED</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning — Scale / Reach x Digital &amp; AI Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score. The open corner — scale plus a real AI/digital presence — is uncontested in recovered-materials trading.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Digital &amp; AI Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Scale / Reach -&gt;</text>
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
    print("Generating Canusa Hershman diagrams (SVG)...")
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
