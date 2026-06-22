"""
generate-diagrams.py — China Auto Group (CAG) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
Output -> Clients/CAG/diagrams/{model,personas,architecture,timeline,competitive}.png
Usage:   python "Clients/CAG/generate-diagrams.py"
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How China Auto Group Sources</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A US-accountable, turnkey partner: vet and engineer with China factories, manage quality and import, and deliver landed to the buyer's warehouse.</text>'''
    supply=(box(40,92,196,60,WHITE,TEAL,"CHINA FACTORY NETWORK","database of hundreds of factories",DARK,GREY)
        +box(40,160,196,60,WHITE,TEAL,"SHANGHAI OFFICE","on-site dev + IATF-16949 QC",DARK,GREY)
        +box(40,228,196,60,WHITE,TEAL,"ENGINEERING & SAMPLES","spec - prototype - PPAP",DARK,GREY))
    sup_label=f'<text x="138" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">SOURCE &amp; MAKE (China)</text>'
    hub=box(304,148,196,150,DARK,DARK,"CHINA AUTO GROUP","source - QC - import - deliver",WHITE,"#C9CDD6",18)
    hub_extra=f'''<text x="402" y="264" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">US importer of record</text>
  <text x="402" y="280" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">"Landed Your Warehouse"</text>'''
    demand=(box(568,80,292,56,WHITE,BLUE,"AFTERMARKET BRANDS / DISTRIBUTORS","catalog - private label",DARK,GREY)
        +box(568,148,292,56,WHITE,BLUE,"OE / OEM MANUFACTURERS","custom components to spec",DARK,GREY)
        +box(568,216,292,56,WHITE,BLUE,"TIER 1 / TIER 2 SUPPLIERS","cost-down - IATF 16949",DARK,GREY)
        +box(568,284,292,56,WHITE,BLUE,"SPECIALTY / PERFORMANCE","low-volume custom runs",DARK,GREY))
    dem_label=f'<text x="714" y="70" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">AUTOMOTIVE BUYERS (US / EU)</text>'
    arrows=f'''
  <line x1="236" y1="124" x2="300" y2="198" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="192" x2="300" y2="220" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="258" x2="300" y2="248" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="210" x2="564" y2="108" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="220" x2="564" y2="176" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="238" x2="564" y2="244" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="252" x2="564" y2="312" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    seg=f'''
  <rect x="40" y="356" width="820" height="44" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <text x="52" y="374" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{DARK}">TURNKEY SCOPE</text>
  <text x="52" y="391" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">identify factory  -  negotiate  -  engineer  -  schedule  -  quality control  -  consolidate &amp; ship  -  clear customs  -  finance (USD / open account)  -  warehouse</text>'''
    band=f'''
  <rect x="40" y="412" width="820" height="62" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="412" width="6" height="62" rx="3" fill="{ORANGE}"/>
  <text x="60" y="435" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian AI plugs in</text>
  <text x="60" y="456" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">supplier discovery &amp; risk-scoring  -  HTS + landed-cost modeling  -  RFQ / quote drafting  -  quality-doc automation  -  order tracking on Acctivate  -  East-West comms  -  knowledge graph</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{sup_label}{supply}{hub}{hub_extra}{dem_label}{demand}{arrows}{seg}{band}</svg>'

# ============================================================ PERSONAS (segment matrix)
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    # (key, label, volume_x, value_y, color, textcolor, r, label_dx, label_dy, anchor)
    P=[("AFTMKT","Aftermarket Brand / Distributor",78,52,BLUE,WHITE,32,0,54,"middle"),
       ("TIER 1-2","Tier 1 / Tier 2 Supplier",60,64,TEAL,DARK,28,0,-40,"middle"),
       ("OE/OEM","OE / OEM Manufacturer",34,84,ORANGE,WHITE,30,0,-42,"middle"),
       ("SPECIALTY","Specialty / Performance",26,62,GREEN,WHITE,24,-38,2,"end")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">CORE GROWTH ACCOUNTS</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-MARGIN SPECIALTY</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">VOLUME / COMMODITY</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">OCCASIONAL / SPOT</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{BLUE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Aftermarket Brand / Distributor</text>
  <circle cx="350" cy="557" r="7" fill="{TEAL}"/><text x="362" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Tier 1 / Tier 2 Supplier</text>
  <circle cx="600" cy="557" r="7" fill="{ORANGE}"/><text x="612" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">OE / OEM Manufacturer</text>
  <circle cx="84" cy="581" r="7" fill="{GREEN}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Specialty / Performance Brand</text>
  <text x="350" y="586" font-family="Segoe UI,Arial" font-size="11.5" font-style="italic" fill="{GREY}">Cross-cutting trigger: the "China+1 diversifier" can be any of these.</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Customer Segments — Order Volume x Value per Relationship</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Buyer archetypes evidenced by the team's own account mandates and product lines. Bubble size = relative value per relationship. Calibrate at discovery.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Value / Complexity per Relationship -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Order Volume -&gt;</text>
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
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">QUOTE &amp; SOURCE FASTER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">classify - cost - quote - vet</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RUN THE BACK OFFICE</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">QC docs - tracking - comms - knowledge</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    inbound=(arch_card(20,136,256,88,BLUE,"Authority / AEO Content","Be the cited answer for sourcing-under-tariffs and China+1 questions; the firm publishes nothing today.","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"Website Refresh + Reputation","Turn the dated brochure site into a credible, conversion-ready presence buyers trust.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Account & Trigger Intelligence","Watch target parts brands for tariff, recall, and supply-shift triggers to time outreach.","My AI",TEAL)
        +arch_card(20,436,256,88,BLUE,"RFQ / Proposal Drafting","Turn a buyer's loose requirement into a structured RFQ and proposal in minutes.","My AI",TEAL))
    core=(arch_card(320,136,256,88,ORANGE,"HTS + Landed-Cost Engine","Classify a part and model duty, freight, and landed cost across China, Vietnam, Mexico, India.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Supplier Discovery & Risk Scoring","Mine and risk-score factory candidates; extend the member-factory database.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"China+1 Scenario Modeling","Compare total landed cost and lead time across alternative-country suppliers.","My AI",TEAL)
        +arch_card(320,436,256,88,ORANGE,"Quote & Spec Generation","Draft spec sheets, BOMs, and customer-ready quotes consistently and fast.","My Dev",DARK))
    outbound=(arch_card(620,136,256,88,TEAL,"Quality-Doc Automation","Assemble PPAP / IATF 16949 / inspection and customs paperwork into audit-ready records.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Order & Production Tracking","An AI layer over Acctivate: flag at-risk POs, schedule slips, and container status.","My Dev",DARK)
        +arch_card(620,336,256,88,TEAL,"East-West Comms + Translation","Draft status updates and translate China-US factory and customer threads, 24/7.","My AI",TEAL)
        +arch_card(620,436,256,88,TEAL,"Knowledge Graph (70 yrs)","Capture decades of supplier, part, and program know-how before key people retire.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">win</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">deliver</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">China Auto Group AI Growth &amp; Integration Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Win more accounts (left); classify, cost, and quote faster (centre); automate the sourcing back office around Acctivate (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO - My AI - My Dev. AI augments the team and Acctivate; a person signs off every classification, quote, and commitment, and proprietary specs + supplier pricing stay in private, governed deployments.</text>'
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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">QUOTE &amp; SOURCE FASTER</text>
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","AI Readiness + Process Map","Map sourcing, quoting, classification, QC, and Acctivate; pick the two highest-ROI automations.","My AI",TEAL)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Authority Content Base","Refresh the site; start authority/AEO content on sourcing-under-tariffs and China+1.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","HTS + Landed-Cost Engine","Classify parts and model landed cost across countries; a person confirms every entry.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","RFQ / Quote Drafting","Turn loose requirements into structured RFQs and customer-ready quotes in minutes.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Supplier Intel + QC Docs","Risk-score factories; automate PPAP / IATF and customs paperwork.","My Dev",DARK)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Account Intel + ROI Dashboard","Trigger intelligence on target accounts and a measured ROI dashboard.","My AI",TEAL))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate after a discovery call (see the Questions section). The build is staged so each phase pays before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Growth &amp; Integration Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">China Auto Group x Technijian — get found, quote and source faster, then automate and scale.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE 2x2 (Turnkey accountability x Automotive depth)
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, turnkey_x, autodepth_y, color, r, ldx, ldy, anchor)
    C=[("CHINA AUTO GROUP",80,82,ORANGE,30,0,52,"middle"),
       ("Generalist agencies (Dragon, Leeline)",66,32,BLUE,24,0,42,"middle"),
       ("Marketplaces / DIY (Alibaba)",18,26,DARK,24,0,40,"middle"),
       ("QC / inspection (QIMA, SGS)",30,52,TEAL,20,0,-30,"middle"),
       ("In-house China buying office",24,74,GOLD,18,34,2,"start"),
       ("Freight / customs brokers",40,16,GREY,16,0,34,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="CHINA AUTO GROUP" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(66),Y(32); sx,sy=X(80),Y(82)
    move=f'''
  <line x1="{tx-10}" y1="{ty-24}" x2="{sx-6}" y2="{sy+34}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{X(78)}" y="{Y(56)}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">add auto depth + AI</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">TURNKEY + AUTO-EXPERT (the prize)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DEEP BUT DIY / IN-HOUSE LOAD</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">TURNKEY BUT GENERALIST</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">DIY / COMMODITY RISK</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning — Turnkey Accountability x Automotive Depth</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score. Marketplaces are cheap but you own all the risk; generalists are turnkey but not auto-expert — the top-right is open.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Automotive Specialization &amp; Engineering Depth -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Turnkey Accountability / Risk Transferred to Partner -&gt;</text>
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
    print("Generating China Auto Group diagrams (SVG)...")
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
