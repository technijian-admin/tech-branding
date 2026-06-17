"""
generate-diagrams.py — Multipoint Network (MPN) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright (HTML+SVG). Output -> Clients/MPN/diagrams/*.png
Usage:   python "Clients/MPN/generate-diagrams.py"
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">What Multipoint Network Builds — and Who Can't Find It</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A boutique with rare, provable capability serving the most demanding clients in media — and almost no market presence to match it.</text>'''
    supply=(box(40,92,196,60,WHITE,TEAL,"Custom Software / SaaS","\"the team that built it runs it\"",DARK,GREY)
        +box(40,160,196,60,WHITE,TEAL,"AI / ML Production Systems","24 systems, 14 models",DARK,GREY)
        +box(40,228,196,60,WHITE,TEAL,"Cloudflare + Cloud Migration","16 zones; Azure to Workers",DARK,GREY))
    sup_label=f'<text x="138" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">CAPABILITY</text>'
    hub=box(304,150,196,150,DARK,DARK,"MULTIPOINT","design · build · grow",WHITE,"#C9CDD6",19)
    hub_extra=f'''<text x="402" y="266" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">TPN · SOC 2 · CMMC</text>
  <text x="402" y="282" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">Beverly Hills · since ~2003</text>'''
    demand=(box(568,80,292,56,WHITE,BLUE,"STUDIOS","Warner Bros. · Paramount",DARK,GREY)
        +box(568,148,292,56,WHITE,BLUE,"NETWORKS / MEDIA","NBCUniversal",DARK,GREY)
        +box(568,216,292,56,WHITE,BLUE,"PRODUCTION / POST","content-security (TPN)",DARK,GREY)
        +box(568,284,292,56,WHITE,BLUE,"SAAS / TECH","Velaro and others",DARK,GREY))
    dem_label=f'<text x="714" y="70" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">CLIENTS (logos shown on their site)</text>'
    arrows=f'''
  <line x1="236" y1="124" x2="300" y2="198" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="192" x2="300" y2="220" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="236" y1="258" x2="300" y2="248" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="210" x2="564" y2="108" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="220" x2="564" y2="176" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="238" x2="564" y2="244" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="500" y1="252" x2="564" y2="312" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    band=f'''
  <rect x="40" y="356" width="820" height="118" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="356" width="6" height="118" rx="3" fill="{ORANGE}"/>
  <text x="60" y="380" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">The gap — and where the Technijian AI growth engine plugs in</text>
  <text x="60" y="402" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Real, provable proof (99.97% uptime · 34,897 tickets · a $187K-to-$3K cloud case) sits behind a thin website, ~122 LinkedIn followers, and almost no</text>
  <text x="60" y="420" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">search or review presence. The capability is rare; the visibility is near-zero.</text>
  <text x="60" y="448" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}">Get found (AEO / authority content)   ·   Capture &amp; convert (funnel + AI assistant)   ·   Win named accounts (account-based outbound)</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{sup_label}{supply}{hub}{hub_extra}{dem_label}{demand}{arrows}{band}</svg>'

# ============================================================ PERSONAS (segment matrix)
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    P=[("STUDIO","Studio / Network IT & Security",60,86,BLUE,WHITE,30,0,50,"middle"),
       ("POST","Production / Post House",70,66,ORANGE,DARK,30,0,52,"middle"),
       ("ENT MEDIA","Enterprise Media Infra",46,82,GREEN,WHITE,26,-38,0,"end"),
       ("AGENCY","Agency / Creative Shop",64,46,TEAL,DARK,26,40,2,"start"),
       ("SAAS","Media-Tech / SaaS",40,56,GOLD,DARK,24,0,-38,"middle"),
       ("CLOUD","Cloud / Cost-Cut Buyer",78,40,DARK,WHITE,24,0,44,"middle")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">ANCHOR ACCOUNTS (ABM)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">HIGH-VALUE NICHE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">SEARCHABLE / VOLUME</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">OPPORTUNISTIC</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{BLUE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Studio / Network IT &amp; Security</text>
  <circle cx="320" cy="557" r="7" fill="{ORANGE}"/><text x="332" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Production / Post-Production house</text>
  <circle cx="600" cy="557" r="7" fill="{GREEN}"/><text x="612" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Enterprise Media Infrastructure</text>
  <circle cx="84" cy="581" r="7" fill="{TEAL}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Agency / Creative shop</text>
  <circle cx="320" cy="581" r="7" fill="{GOLD}"/><text x="332" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Media-tech / SaaS company</text>
  <circle cx="600" cy="581" r="7" fill="{DARK}"/><text x="612" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Cloud-migration / cost-cut buyer</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Buyer Segments — Volume x Value</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Archetypes of the accounts Multipoint can win with AI-assisted, relationship-led growth. Bubble size = value per engagement. Calibrate at discovery.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Value per Engagement -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Deal Volume -&gt;</text>
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
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">be the cited answer</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">CAPTURE &amp; CONVERT</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">turn proof into pipeline</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">WIN NAMED ACCOUNTS</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">account-based outbound</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    inbound=(arch_card(20,136,256,88,BLUE,"AEO / GEO for the niche","Be cited for \"Cloudflare migration agency\", \"TPN-compliant IT for studios\", \"AI/ML for media\".","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"Surface the Proof","Turn the $187K-to-$3K case, 99.97% uptime, and the ML pipeline into authority content.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Fix the Storefront","Rebuild the thin site for conversion; fix LinkedIn and the review/reputation footprint.","My Dev",DARK)
        +arch_card(20,436,256,88,BLUE,"Technical & Local SEO","Schema, structured data, and Beverly Hills / LA local signals so search and AI can find them.","My SEO",BLUE))
    core=(arch_card(320,136,256,88,ORANGE,"Lead-Capture Funnel","A real path from visitor to qualified enquiry, not a single-narrative brochure page.","My Dev",DARK)
        +arch_card(320,236,256,88,ORANGE,"On-Site AI Assistant","Answer prospect questions 24/7 and route serious enquiries to the team.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"Case-Study / Proof Engine","Productize each win into a reusable, searchable case study that sells while they sleep.","My AI",TEAL)
        +arch_card(320,436,256,88,ORANGE,"Package the Bespoke","Turn one-off engineering into named, marketable offers so growth doesn't bottleneck on the founder.","My Dev",DARK))
    outbound=(arch_card(620,136,256,88,TEAL,"Account Intelligence","Signal monitoring on studios, post houses, agencies, and media-tech targets.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Proposal Automation","Draft tailored proposals and SOWs fast; the team personalises and signs off.","Lead Gen",ORANGE)
        +arch_card(620,336,256,88,TEAL,"ABM Outreach","Personalised, relationship-respecting outbound to a named target list, not spray-and-pray.","Lead Gen",ORANGE)
        +arch_card(620,436,256,88,TEAL,"Pipeline & CRM","One view of pipeline so the founder-led motion scales without losing the thread.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">capture</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">close</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Multipoint Network AI Growth Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Get found for what you already do (left); convert the traffic into qualified pipeline (centre); win the named media accounts (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · My AI · My AI Lead Gen · My Dev. AI drafts, finds, and triages; a human approves every outbound and owns the brand voice — this augments the founder-led sales motion, it does not replace it.</text>'
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUND &amp; FOUNDATION</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">DEMAND ENGINE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE &amp; OUTBOUND</text>'''
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Audit + Foundation","Brand/positioning, technical SEO, and the consumer-facing storefront rebuilt for conversion.","My Dev",DARK)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Surface the Proof","First authority content from real wins; AEO/GEO base so AI search can cite them.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Capture & Assistant","Lead-capture funnel and an on-site AI assistant convert the new traffic.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Account Intelligence","Named target list (studios, post, agencies) with signal monitoring and dossiers.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","ABM Outbound","Personalised outreach and proposal automation against the named list.","Lead Gen",ORANGE)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Packaged Offers + ROI","Bespoke work packaged into offers; a measured pipeline / ROI dashboard.","My AI",TEAL))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate after a discovery call (see the Questions section). Each phase pays before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Growth Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Multipoint Network x Technijian — get found, build the demand engine, then scale outbound.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE 2x2 (Capability x Visibility)
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, visibility_x, capability_y, color, r, ldx, ldy, anchor)
    C=[("MULTIPOINT NETWORK",26,82,ORANGE,30,0,52,"middle"),
       ("PE-backed consolidators",82,70,BLUE,22,0,-32,"middle"),
       ("Boutique dev / AI agencies",46,76,GREEN,20,-38,-2,"end"),
       ("Generic local MSPs",66,40,TEAL,20,0,40,"middle"),
       ("Marketing-led MSPs",80,34,GOLD,18,0,38,"middle"),
       ("Freelancers / small shops",30,42,GREY,16,0,36,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="MULTIPOINT NETWORK" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(80),Y(86); sx,sy=X(26),Y(82)
    move=f'''
  <line x1="{sx+30}" y1="{sy}" x2="{tx-26}" y2="{ty+6}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <text x="{X(54)}" y="{Y(90)}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">capability they have + visibility they need</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SEEN AND STRONG (the goal)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">STRONG BUT INVISIBLE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">SEEN BUT ORDINARY</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NEITHER</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Competitive Positioning — Market Visibility x Technical Capability</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score. Multipoint has the rare top-left position: real capability, almost no visibility.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Technical Capability -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Market Visibility -&gt;</text>
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
    print("Generating Multipoint Network diagrams (SVG)...")
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
