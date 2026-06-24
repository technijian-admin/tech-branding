"""
generate-diagrams.py — Shoes That Fit (STF) AI Growth & IT Readiness Blueprint (HYBRID)
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
SVG on a 4px grid, >=10.5px node text, WCAG contrast, solid fills, brand tokens.
Facts-only nonprofit framing. AI assists people; security protects the gifts and donor data.

Output -> Clients/STF/diagrams/{model,readiness,personas,architecture,timeline,competitive}.png
Usage:   py -3.12 "Clients/STF/generate-diagrams.py"
"""
import asyncio, pathlib
from playwright.async_api import async_playwright

DIAGRAMS_DIR = pathlib.Path(__file__).parent / "diagrams"
DIAGRAMS_DIR.mkdir(exist_ok=True)

BLUE="#006DB6"; ORANGE="#F67D4B"; TEAL="#1EAAC8"; DARK="#1A1A2E"; GREY="#59595B"
LIGHT="#E9ECEF"; OFF="#F8F9FA"; WHITE="#FFFFFF"; GOLD="#C9922A"; GREEN="#28A745"; PURPLE="#7B2D8B"; RED="#CC0000"

def page_shell(svg, bg=WHITE):
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box;}} body{{background:{bg};display:inline-block;}} svg{{display:block;}}
</style></head><body>{svg}</body></html>"""

def esc(s): return s.replace("&amp;","&").replace("&","&amp;").replace("<","&lt;")  # idempotent on &amp;

def box(x,y,w,h,fill,stroke,title,subtitle,title_color,sub_color,title_size=13):
    sub=""
    if subtitle:
        sub=f'<text x="{x+w//2}" y="{y+h//2+15}" font-family="Segoe UI,Arial" font-size="10.5" fill="{sub_color}" text-anchor="middle">{esc(subtitle)}</text>'
    ty=y+h//2+(2 if not subtitle else -4)
    return f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="2"/>
  <text x="{x+w//2}" y="{ty}" font-family="Segoe UI,Arial" font-size="{title_size}" font-weight="700" fill="{title_color}" text-anchor="middle">{esc(title)}</text>{sub}'''

# ============================================================ MODEL — how impact is created & sustained
def build_model_svg():
    marker=f'<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{GREY}"/></marker></defs>'
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Shoes That Fit Creates &amp; Sustains Impact</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Support comes in; sponsors and the Shoe Bank turn it into new shoes for children; outcomes flow out and, told well, bring more support.</text>'''
    supply=(box(40,92,200,62,WHITE,TEAL,"CORPORATE &amp; CELEBRITY","Nordstrom, Stater Bros, Capital Group",DARK,GREY)
        +box(40,160,200,62,WHITE,TEAL,"COMMUNITY SPONSORS","schools, civic groups (min 30 kids)",DARK,GREY)
        +box(40,228,200,62,WHITE,TEAL,"INDIVIDUAL &amp; LEGACY","donors, estate giving",DARK,GREY)
        +box(40,296,200,62,WHITE,TEAL,"FOUNDATIONS &amp; GRANTS","MGM, Dodgers, Stratton",DARK,GREY))
    sup_label=f'<text x="140" y="82" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{TEAL}" text-anchor="middle">SUPPORT IN</text>'
    hub=box(308,168,188,150,DARK,DARK,"SHOES THAT FIT","Shoe Bank (16,000 sq ft)",WHITE,"#C9CDD6",17)
    hub_extra=f'''<text x="402" y="286" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">~218,000 children a year</text>
  <text x="402" y="302" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">50 states · 2,135 communities</text>'''
    demand=(box(564,108,296,56,WHITE,BLUE,"BRAND-NEW SHOES THAT FIT","measured for each child",DARK,GREY)
        +box(564,176,296,56,WHITE,BLUE,"CONFIDENCE &amp; ATTENDANCE","ready to learn, play, thrive",DARK,GREY)
        +box(564,244,296,56,WHITE,BLUE,"DIGNITY AT SCHOOL","no child left out",DARK,GREY))
    dem_label=f'<text x="712" y="98" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">OUTCOMES FOR CHILDREN</text>'
    arrows=f'''
  <line x1="240" y1="150" x2="304" y2="210" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="240" y1="210" x2="304" y2="234" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="240" y1="270" x2="304" y2="256" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="240" y1="324" x2="304" y2="282" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="496" y1="226" x2="560" y2="136" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="496" y1="240" x2="560" y2="204" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="496" y1="258" x2="560" y2="272" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    band=f'''
  <rect x="40" y="386" width="820" height="92" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="386" width="6" height="92" rx="3" fill="{ORANGE}"/>
  <text x="60" y="408" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">Where Technijian plugs in — two fronts, neither replacing the people or relationships</text>
  <rect x="60" y="420" width="386" height="46" rx="5" fill="{WHITE}" stroke="{BLUE}"/>
  <rect x="60" y="420" width="5" height="46" rx="2" fill="{BLUE}"/>
  <text x="76" y="438" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{BLUE}">FOUNDATION · secure the money &amp; data</text>
  <text x="76" y="455" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">BEC / wire-fraud controls · MFA · M365 migration · donor PII</text>
  <rect x="458" y="420" width="388" height="46" rx="5" fill="{WHITE}" stroke="{ORANGE}"/>
  <rect x="458" y="420" width="5" height="46" rx="2" fill="{ORANGE}"/>
  <text x="474" y="438" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{ORANGE}">GROWTH · raise more &amp; report impact</text>
  <text x="474" y="455" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">partner ABM · grants · donor reactivation · CSR reporting</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{sup_label}{supply}{hub}{hub_extra}{dem_label}{demand}{arrows}{band}</svg>'

# ============================================================ READINESS — the two fronts (hybrid)
def build_readiness_svg():
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Two Fronts — Protect What You've Built, Then Grow It</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A record $776K gift and a year of scaling raise the stakes on both: secure the money and donor data first, then grow the partner engine with AI.</text>'''
    # center spine
    spine=f'''
  <rect x="386" y="92" width="128" height="404" rx="8" fill="{DARK}"/>
  <text x="450" y="150" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">THE</text>
  <text x="450" y="170" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">MOMENT</text>
  <text x="450" y="214" font-family="Segoe UI,Arial" font-size="22" font-weight="700" fill="{ORANGE}" text-anchor="middle">$776K+</text>
  <text x="450" y="232" font-family="Segoe UI,Arial" font-size="10" fill="#C9CDD6" text-anchor="middle">record gift</text>
  <text x="450" y="286" font-family="Segoe UI,Arial" font-size="22" font-weight="700" fill="{TEAL}" text-anchor="middle">218K</text>
  <text x="450" y="304" font-family="Segoe UI,Arial" font-size="10" fill="#C9CDD6" text-anchor="middle">kids a year</text>
  <text x="450" y="358" font-family="Segoe UI,Arial" font-size="22" font-weight="700" fill="{GREEN}" text-anchor="middle">44</text>
  <text x="450" y="376" font-family="Segoe UI,Arial" font-size="10" fill="#C9CDD6" text-anchor="middle">staff</text>
  <text x="450" y="430" font-family="Segoe UI,Arial" font-size="22" font-weight="700" fill="{WHITE}" text-anchor="middle">50</text>
  <text x="450" y="448" font-family="Segoe UI,Arial" font-size="10" fill="#C9CDD6" text-anchor="middle">states</text>'''
    def card(x,y,w,accent,t,d):
        words=esc(d).split(); l1,l2,cnt,on2=[],[],0,False
        for ww in words:
            if not on2 and cnt+len(ww)+1<=44: l1.append(ww); cnt+=len(ww)+1
            else: on2=True; l2.append(ww)
        return f'''
  <rect x="{x}" y="{y}" width="{w}" height="68" rx="5" fill="{WHITE}" stroke="{LIGHT}"/>
  <rect x="{x}" y="{y}" width="5" height="68" rx="2" fill="{accent}"/>
  <text x="{x+16}" y="{y+24}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{esc(t)}</text>
  <text x="{x+16}" y="{y+42}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{" ".join(l1)}</text>
  <text x="{x+16}" y="{y+57}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{" ".join(l2)}</text>'''
    lhead=f'''
  <rect x="40" y="92" width="330" height="40" rx="5" fill="{BLUE}"/>
  <text x="205" y="112" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">FOUNDATION — SECURE &amp; SCALE</text>
  <text x="205" y="127" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">protect the gifts, the donor data, the team</text>'''
    left=(card(40,144,330,BLUE,"BEC &amp; wire-fraud controls","Email authentication and payment-verification so a publicized gift cannot be hijacked.")
        +card(40,220,330,BLUE,"Identity &amp; device security","MFA everywhere, endpoint protection, and least-privilege access for 44 staff.")
        +card(40,296,330,BLUE,"M365 grant-cliff migration","Re-license cleanly after the 2025 nonprofit-grant change — no security gaps in transit.")
        +card(40,372,330,BLUE,"Donor data &amp; payment hygiene","Map where donor PII and card data live; close the gaps a funder will ask about.")
        +card(40,448,330,GREEN,"Free Nexus Assess baseline","One no-cost risk assessment — internal, external, dark-web, and Microsoft 365 review."))
    rhead=f'''
  <rect x="530" y="92" width="330" height="40" rx="5" fill="{ORANGE}"/>
  <text x="695" y="112" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">GROWTH — RAISE &amp; REACH</text>
  <text x="695" y="127" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">grow the partner engine and the donor base</text>'''
    right=(card(530,144,330,ORANGE,"Corporate-partner ABM","Find look-alike corporate prospects and renewal signals for the #1 revenue engine.")
        +card(530,220,330,ORANGE,"Grant discovery &amp; drafting","Match funders and draft faster so staff write the case, not the boilerplate.")
        +card(530,296,330,ORANGE,"Donor reactivation","Segment and re-engage the lapsed and mid-tier donors a small team cannot reach by hand.")
        +card(530,372,330,ORANGE,"Impact stories &amp; CSR reports","Auto-draft per-partner impact reports and bilingual stories that win the next gift.")
        +card(530,448,330,TEAL,"Shoe-Bank &amp; school logistics","Forecast size mix and streamline school intake across the new warehouse."))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 516" width="900" height="516" role="img">{title}{spine}{lhead}{left}{rhead}{right}</svg>'

# ============================================================ PERSONAS — supporter & stakeholder map
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    # (key, label, capacity x, engagement y, color, textcolor, r, label dx, label dy, anchor)
    P=[("CORP","Corporate &amp; Celebrity Partners",84,84,ORANGE,DARK,32,0,-46,"middle"),
       ("FOUND","Foundations &amp; Grantmakers",80,56,TEAL,DARK,28,42,2,"start"),
       ("MAJOR","Major-Gift &amp; Legacy Donors",62,68,BLUE,WHITE,28,0,-42,"middle"),
       ("COMM","Community Sponsors (schools, civic)",46,50,GREEN,WHITE,26,0,42,"middle"),
       ("INDIV","Individual / Recurring Donors",34,60,PURPLE,WHITE,24,0,-38,"middle"),
       ("LAPSED","Lapsed &amp; Mid-Tier Donors",28,30,DARK,WHITE,22,0,40,"middle")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        dots+=f'''
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">DEEPEN &amp; STEWARD</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">ENGAGED, GROWING</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">CULTIVATE UPWARD</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">RE-ENGAGE</text>'''
    center_note=f'''
  <rect x="{X(40)}" y="{Y(50)-16}" width="170" height="32" rx="6" fill="{WHITE}" stroke="{ORANGE}" stroke-dasharray="4 3"/>
  <text x="{X(40)+85}" y="{Y(50)+4}" font-family="Segoe UI,Arial" font-size="10.5" font-weight="700" fill="{ORANGE}" text-anchor="middle">children served = the purpose</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{ORANGE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Corporate &amp; Celebrity</text>
  <circle cx="262" cy="557" r="7" fill="{TEAL}"/><text x="274" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Foundations &amp; Grants</text>
  <circle cx="452" cy="557" r="7" fill="{BLUE}"/><text x="464" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Major-Gift &amp; Legacy</text>
  <circle cx="638" cy="557" r="7" fill="{GREEN}"/><text x="650" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Community Sponsors</text>
  <circle cx="84" cy="581" r="7" fill="{PURPLE}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Individual / Recurring</text>
  <circle cx="300" cy="581" r="7" fill="{DARK}"/><text x="312" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Lapsed &amp; Mid-Tier Donors</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Supporter &amp; Partner Map — Giving Capacity x Engagement</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Where AI helps Shoes That Fit grow and steward each relationship. Bubble size approximates revenue weight; calibrate at discovery.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Engagement Depth -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Giving Capacity -&gt;</text>
  {quad}{dots}{center_note}{legend}
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
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">visibility · stories · AEO</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RAISE MORE &amp; WIN PARTNERS</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">partners · grants · donors</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">SERVE &amp; REPORT IMPACT</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">schools · logistics · funders</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    inbound=(arch_card(20,136,256,88,BLUE,"Authority &amp; Impact Stories","A story engine — kids served, the $776K gift, outcomes — that donors and search reward.","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"AEO / GEO + Google Ad Grant","Be the cited answer for corporate CSR and giving; activate the $10K/mo free Ad Grant.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Bilingual Reach","Spanish donor and school pages for a 50-state, heavily Hispanic community.","My SEO",BLUE)
        +arch_card(20,436,256,88,BLUE,"Search &amp; CSR Discovery","Own 'back-to-school shoe drive' and 'corporate giving' searches, not just the brand name.","My SEO",BLUE))
    core=(arch_card(320,136,256,88,ORANGE,"Corporate-Partner ABM","Find look-alike corporate prospects, warm-intro paths, and renewal-risk signals.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Grant Prospecting &amp; Drafting","Match funders and draft boilerplate; staff write the funder-specific case for support.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"Donor Reactivation &amp; Scoring","Segment, score, and re-engage lapsed and mid-tier donors across the base.","My AI",TEAL)
        +arch_card(320,436,256,88,ORANGE,"Personalized Appeals","Draft tailored, bilingual appeals and thank-yous; a human owns every relationship.","My AI",TEAL))
    outbound=(arch_card(620,136,256,88,TEAL,"Per-Partner CSR Reporting","Auto-draft each corporate partner's impact report — the renewal currency.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"School Intake &amp; Matching","Streamline how schools measure, request, and receive — at 50-state scale.","My Dev",DARK)
        +arch_card(620,336,256,88,TEAL,"Shoe-Bank Logistics","Forecast size mix and optimize distribution from the new 16,000 sq ft warehouse.","My Dev",DARK)
        +arch_card(620,436,256,88,TEAL,"Staff Time Recovered","Less admin, more mission: hours returned to partners, schools, and children.","My AI",TEAL))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">reach</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">serve</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Shoes That Fit AI Growth Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Be found and tell the story (left); raise more and win partners and grants (center); serve schools and report impact (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO · My AI · My Dev. AI drafts and researches; a human verifies every claim and owns every partner and donor relationship. No donor data goes into public AI tools.</text>'
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
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">SECURE &amp; STABILIZE</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">RAISE &amp; REACH</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">DEEPEN &amp; SUSTAIN</text>'''
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Free Nexus Assess","Run the no-cost risk baseline; fix BEC, MFA, and M365 gaps first.","Security",BLUE)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Ad Grant + AI Policy","Activate the free Google Ad Grant; set a one-page AI use policy.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Partner &amp; Grant Engine","Corporate-partner ABM + first AI-assisted grant drafts.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Donor Reactivation","Segment, score, and re-engage lapsed and mid-tier donors.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Logistics + Intake","School-intake automation and Shoe-Bank size forecasting.","My Dev",DARK)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Reporting + Dashboard","Automated CSR/funder reports + a measured impact dashboard.","My AI",TEAL))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate at discovery and flex to budget and grant cycles; each phase is sized to pay for itself in dollars raised, hours saved, or risk avoided.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Shoes That Fit x Technijian — secure and stabilize, raise and reach, deepen and sustain.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ COMPETITIVE / FUNDING-VISIBILITY 2x2
def build_competitive_svg():
    def X(s): return round((80+s/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    marker=f'<defs><marker id="arO" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    # (label, visibility/reach, ai-fundraising maturity, color, r, ldx, ldy, anchor)
    C=[("SHOES THAT FIT",64,28,ORANGE,28,0,50,"middle"),
       ("National children's charities (large)",90,58,BLUE,22,0,-32,"middle"),
       ("Peer back-to-school / shoe nonprofits",52,40,TEAL,18,40,2,"start"),
       ("Local children's nonprofits",38,30,GREY,16,0,34,"middle"),
       ("CSR / giving directories &amp; portals",80,22,GOLD,18,0,36,"middle"),
       ("Digitally-savvy small nonprofits",30,70,GREEN,18,0,-30,"middle")]
    dots=""
    for label,s,m,color,r,ldx,ldy,anc in C:
        cx,cy=X(s),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="4 3"/>' if label=="SHOES THAT FIT" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    tx,ty=X(76),Y(78); sx,sy=X(64),Y(28)
    move=f'''
  <line x1="{sx}" y1="{sy-32}" x2="{tx}" y2="{ty+22}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arO)"/>
  <circle cx="{tx}" cy="{ty}" r="10" fill="none" stroke="{ORANGE}" stroke-width="2"/>
  <text x="{tx}" y="{ty-22}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">The open lane: trusted brand + AI partner-growth</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">VISIBLE + AI-ENABLED</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">NIMBLE, LOWER-PROFILE</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">VISIBLE, TRADITIONAL</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="#9AA0A6" text-anchor="middle">LOCAL / DATED</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  {marker}
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Funding &amp; Visibility Landscape — Reach x AI Fundraising Maturity</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic assessment, not a measured score — and a discovery item, not a verified peer set. Calibrate the peer map at discovery.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">AI Fundraising Maturity -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Visibility / Reach -&gt;</text>
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
    print("Generating Shoes That Fit diagrams (SVG)...")
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(); page=await browser.new_page(device_scale_factor=2)
        print("1  model.png");        await render(page,page_shell(build_model_svg()),       DIAGRAMS_DIR/"model.png")
        print("2  readiness.png");    await render(page,page_shell(build_readiness_svg()),   DIAGRAMS_DIR/"readiness.png")
        print("3  personas.png");     await render(page,page_shell(build_personas_svg()),    DIAGRAMS_DIR/"personas.png")
        print("4  architecture.png"); await render(page,page_shell(build_arch_svg()),        DIAGRAMS_DIR/"architecture.png")
        print("5  timeline.png");     await render(page,page_shell(build_timeline_svg()),    DIAGRAMS_DIR/"timeline.png")
        print("6  competitive.png");  await render(page,page_shell(build_competitive_svg()), DIAGRAMS_DIR/"competitive.png")
        await browser.close()
    print("Done.")

if __name__=="__main__":
    asyncio.run(main())
