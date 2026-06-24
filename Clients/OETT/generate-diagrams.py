"""
generate-diagrams.py - Operating Engineers Training Trust (OETT) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright (HTML+SVG) at device_scale_factor=3 (print quality).
Output -> Clients/OETT/diagrams/*.png
Usage:   python "Clients/OETT/generate-diagrams.py"
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

def esc(s): return s.replace("&","&amp;").replace("<","&lt;")

def wrap(text, width):
    words=text.split(); lines=[]; cur=""
    for w_ in words:
        if len(cur)+len(w_)+1<=width: cur=(cur+" "+w_).strip()
        else: lines.append(cur); cur=w_
    if cur: lines.append(cur)
    return lines

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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">What OETT Does - and the Knowledge Cliff Ahead</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A 60-year training trust turning people into the skilled operators who build California - just as a generation of expertise prepares to retire.</text>'''
    in_label=f'<text x="146" y="86" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">WHO FEEDS IT</text>'
    supply=(box(40,98,212,68,WHITE,ORANGE,"Prospective Apprentices","the next generation of operators",DARK,GREY)
        +box(40,176,212,68,WHITE,ORANGE,"Veteran Master Operators","decades of hard-won expertise",DARK,GREY))
    hub=box(312,116,210,176,DARK,DARK,"OETT TRAINING TRUST","",WHITE,"#C9CDD6",18)
    hub_extra=f'''<text x="417" y="180" font-family="Segoe UI,Arial" font-size="11" fill="#C9CDD6" text-anchor="middle">Apprenticeship + Journeyperson</text>
  <text x="417" y="198" font-family="Segoe UI,Arial" font-size="11" fill="#C9CDD6" text-anchor="middle">continuing education</text>
  <text x="417" y="224" font-family="Segoe UI,Arial" font-size="11" fill="#9FE6F4" text-anchor="middle">6 sites - since 1964</text>
  <text x="417" y="242" font-family="Segoe UI,Arial" font-size="11" fill="#9FE6F4" text-anchor="middle">6,000 OJT hrs - 6 semesters</text>'''
    out_label=f'<text x="704" y="86" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">THE WORKFORCE OUT</text>'
    demand=(box(582,98,278,56,WHITE,BLUE,"Skilled Operating Engineers","dispatched to build California",DARK,GREY)
        +box(582,166,278,56,WHITE,BLUE,"Recertified Journeypersons","upskilled on new equipment",DARK,GREY)
        +box(582,234,278,56,WHITE,BLUE,"Signatory Contractors","fund the trust, hire the graduates",DARK,GREY))
    arrows=f'''
  <line x1="252" y1="132" x2="308" y2="170" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="252" y1="210" x2="308" y2="232" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="190" x2="578" y2="126" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="200" x2="578" y2="194" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="218" x2="578" y2="258" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    band=f'''
  <rect x="40" y="324" width="820" height="158" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="324" width="6" height="158" rx="3" fill="{ORANGE}"/>
  <text x="60" y="350" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">The cliff - and where an AI layer helps (on top of the team, not instead of it)</text>
  <text x="60" y="372" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">An estimated ~41% of the construction workforce is projected to retire by 2031 (NCCER), and the industry needs ~349,000 net new workers in 2026 alone</text>
  <text x="60" y="390" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">(ABC) - more than half just to replace retirees. A training trust sits at the center of both problems: refill the pipeline, and keep the expertise.</text>
  <text x="60" y="424" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}">RECRUIT the next generation faster</text>
  <text x="60" y="444" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{BLUE}">CAPTURE retiring expertise before it walks out the door</text>
  <text x="468" y="424" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{TEAL}">MODERNIZE how apprentices learn</text>
  <text x="468" y="444" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{GREY}">CUT the CEU / compliance admin load</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{in_label}{supply}{hub}{hub_extra}{out_label}{demand}{arrows}{band}</svg>'

# ============================================================ PERSONAS (stakeholder cards)
def persona_card(x,y,w,h,color,tcolor,name,role,need,ai):
    nm=esc(name)
    role_l=wrap(role,32); need_l=wrap("Needs: "+need,34); ai_l=wrap("AI helps: "+ai,34)
    head_h=40
    out=f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{WHITE}" stroke="{LIGHT}" stroke-width="1.5"/>
  <path d="M{x+6},{y} h{w-12} a6,6 0 0 1 6,6 v{head_h-6} h{-w} v{head_h-6} a6,6 0 0 1 6,-{head_h-6} z" fill="{color}"/>
  <rect x="{x}" y="{y}" width="{w}" height="{head_h}" rx="6" fill="{color}"/>
  <text x="{x+w//2}" y="{y+26}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{tcolor}" text-anchor="middle">{nm}</text>'''
    ty=y+head_h+18
    for ln in role_l:
        out+=f'<text x="{x+14}" y="{ty}" font-family="Segoe UI,Arial" font-size="10.5" font-style="italic" fill="{GREY}">{esc(ln)}</text>'; ty+=14
    ty+=4
    for ln in need_l:
        out+=f'<text x="{x+14}" y="{ty}" font-family="Segoe UI,Arial" font-size="10.5" fill="{DARK}">{esc(ln)}</text>'; ty+=14
    ty+=4
    for ln in ai_l:
        out+=f'<text x="{x+14}" y="{ty}" font-family="Segoe UI,Arial" font-size="10.5" fill="{BLUE}">{esc(ln)}</text>'; ty+=14
    return out

def build_personas_svg():
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The People OETT Serves - and How AI Helps Each</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Not buyers - the stakeholders along the operating-engineer lifecycle. The "AI helps" line is the opportunity, to calibrate at discovery.</text>'''
    cw,ch=268,196; gx=20
    x0=40; x1=x0+cw+gx; x2=x1+cw+gx
    r1=72
    cards=(persona_card(x0,r1,cw,ch,ORANGE,DARK,"Prospective Apprentice","Career-changer, young adult, or veteran exploring the trades","a clear, fast way to discover the program, apply, and prepare - in their language.","be found in search, a 24/7 multilingual application assistant, exam prep.")
        +persona_card(x1,r1,cw,ch,BLUE,WHITE,"Apprentice In-Program","3-4 years, 6,000 OJT hours + 6 semesters","study support, test prep, and confidence before seat time on a $500K machine.","study assistant, scenario/sim prep, multilingual support, progress nudges.")
        +persona_card(x2,r1,cw,ch,TEAL,DARK,"Curriculum Coordinator","Builds & maintains courses across 9+ equipment families, 6 sites","faster ways to create and update curriculum, assessments, and safety modules.","draft & refresh curriculum and assessments; standards changes applied fast.")
        +persona_card(x0+cw//2+gx//2,r1+ch+24,cw,ch,RED,WHITE,"Veteran Master Operator","Decades of tacit, jobsite judgment - nearing retirement","a way to pass on knowledge that today lives only in their head and hands.","structured knowledge capture -> durable, searchable curriculum.")
        +persona_card(x1+cw//2+gx//2,r1+ch+24,cw,ch,DARK,WHITE,"Director of Training","Accountable for outcomes, capacity & compliance across districts","visibility across 6 sites and a lighter DAS / federal reporting burden.","cross-site dashboards, reporting automation, outcome analytics."))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 508" width="900" height="508" role="img">{title}{cards}</svg>'

# ============================================================ PEER LANDSCAPE (adoption stages)
def build_peer_svg():
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Where Training Organizations Sit on AI Adoption</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic read, not a measured score. The category is moving - and a federal tailwind is pushing it. OETT can lead its peer set rather than follow.</text>'''
    banner=f'''
  <rect x="40" y="74" width="820" height="56" rx="6" fill="{BLUE}"/>
  <text x="60" y="96" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{WHITE}">Federal tailwind (2026)</text>
  <text x="60" y="114" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4">The U.S. Department of Labor launched a national initiative to integrate AI into Registered Apprenticeships -</text>
  <text x="60" y="128" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4">including traditional trades and infrastructure occupations.</text>'''
    grad=f'<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="{LIGHT}"/><stop offset="50%" stop-color="{TEAL}"/><stop offset="100%" stop-color="{ORANGE}"/></linearGradient><marker id="arP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="{ORANGE}"/></marker></defs>'
    BY=312
    bar=f'''
  <rect x="60" y="{BY}" width="780" height="20" rx="10" fill="url(#pg)"/>
  <text x="140" y="{BY+46}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{GREY}" text-anchor="middle">EXPLORING</text>
  <text x="450" y="{BY+46}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{TEAL}" text-anchor="middle">PILOTING</text>
  <text x="760" y="{BY+46}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{ORANGE}" text-anchor="middle">INTEGRATED</text>'''
    def marker(cx,label_lines,color,up=True):
        out=f'<circle cx="{cx}" cy="{BY+10}" r="7" fill="{color}"/>'
        if up:
            ly=BY-18
            for i,ln in enumerate(reversed(label_lines)):
                out+=f'<text x="{cx}" y="{ly-i*15}" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">{esc(ln)}</text>'
            out+=f'<line x1="{cx}" y1="{BY-8}" x2="{cx}" y2="{BY+3}" stroke="{color}" stroke-width="1.5"/>'
        else:
            ly=BY+72
            for i,ln in enumerate(label_lines):
                out+=f'<text x="{cx}" y="{ly+i*15}" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">{esc(ln)}</text>'
            out+=f'<line x1="{cx}" y1="{BY+17}" x2="{cx}" y2="{BY+28}" stroke="{color}" stroke-width="1.5"/>'
        return out
    markers=(marker(270,["Most JATCs &","trade schools"],GREY,up=False)
        +marker(420,["Community &","technical colleges"],BLUE,up=True)
        +marker(560,["AI equipment","simulators (studies)"],TEAL,up=False)
        +marker(770,["NC State AI Academy","+ Apprenti (registered)"],ORANGE,up=True))
    oett=f'''
  <circle cx="130" cy="{BY+10}" r="11" fill="none" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="4 3"/>
  <circle cx="130" cy="{BY+10}" r="7" fill="{ORANGE}"/>
  <text x="130" y="{BY-78}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{ORANGE}" text-anchor="middle">OETT today</text>
  <text x="130" y="{BY-62}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" text-anchor="middle">heavy-equipment training</text>
  <line x1="148" y1="{BY+2}" x2="250" y2="{BY-34}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arP)"/>
  <text x="232" y="{BY-44}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}" text-anchor="start">first-mover opportunity</text>
  <text x="232" y="{BY-30}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}" text-anchor="start">in SoCal</text>'''
    note=f'<text x="60" y="492" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">Examples are representative directions of travel across comparable training organizations, not guarantees. Sources in the Appendix.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 504" width="900" height="504" role="img">{grad}{title}{banner}{bar}{markers}{oett}{note}</svg>'

# ============================================================ ARCHITECTURE (two-motion engine)
def arch_card(x,y,w,h,accent,title,desc,badge,badge_color):
    t=esc(title); b=esc(badge)
    badge_txt=WHITE if badge_color in (BLUE,DARK,TEAL,PURPLE,RED) else DARK
    l=wrap(desc,40)[:2]
    bw=len(b)*7+16; bx=x+w-bw-8; by=y+h-22
    out=f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+20}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>'''
    yy=y+36
    for ln in l:
        out+=f'<text x="{x+14}" y="{yy}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{esc(ln)}</text>'; yy+=14
    out+=f'''
  <rect x="{bx}" y="{by}" width="{bw}" height="16" fill="{badge_color}" rx="8"/>
  <text x="{bx+bw//2}" y="{by+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{badge_txt}" text-anchor="middle">{b}</text>'''
    return out

def build_arch_svg():
    headers=f'''
  <rect x="16" y="76" width="280" height="48" fill="{ORANGE}" rx="4"/>
  <text x="156" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">RECRUIT</text>
  <text x="156" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">attract the next generation</text>
  <rect x="310" y="76" width="280" height="48" fill="{BLUE}" rx="4"/>
  <text x="450" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">TRAIN</text>
  <text x="450" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">capture &amp; scale expertise</text>
  <rect x="604" y="76" width="280" height="48" fill="{TEAL}" rx="4"/>
  <text x="744" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">OPERATE</text>
  <text x="744" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">run it with less admin</text>'''
    bg=f'''
  <rect x="16" y="124" width="280" height="408" fill="{OFF}" rx="4"/>
  <rect x="310" y="124" width="280" height="408" fill="{OFF}" rx="4"/>
  <rect x="604" y="124" width="280" height="408" fill="{OFF}" rx="4"/>'''
    recruit=(arch_card(22,136,268,86,ORANGE,"Be Found by Recruits","AEO/SEO so OETT is the answer for \"how to become a crane operator in CA.\"","My SEO",BLUE)
        +arch_card(22,232,268,86,ORANGE,"Application Assistant","A 24/7 multilingual chatbot that guides applicants and answers exam questions.","My AI",TEAL)
        +arch_card(22,328,268,86,ORANGE,"Recruitment Campaigns","Targeted outreach to schools, veterans groups, and career-changers.","Lead Gen",ORANGE)
        +arch_card(22,424,268,86,ORANGE,"Screen & Rank","Triage and rank applicants fast when application windows open.","My AI",TEAL))
    train=(arch_card(316,136,268,86,BLUE,"Capture Veteran Expertise","Turn a retiring master operator's knowledge into durable, searchable curriculum.","My AI",TEAL)
        +arch_card(316,232,268,86,BLUE,"Build Curriculum Faster","Draft and update courses and assessments across 9+ equipment families.","My AI",TEAL)
        +arch_card(316,328,268,86,BLUE,"Apprentice Study Assistant","Test prep, multilingual support, and scenario prep before live seat time.","My Dev",DARK)
        +arch_card(316,424,268,86,BLUE,"Modernize Delivery","Microlearning and simulation prep that shorten time-to-competence.","My AI",TEAL))
    operate=(arch_card(610,136,268,86,TEAL,"CEU / DAS Reporting","Pre-fill, validate, and reconcile records so reporting stays audit-ready.","My AI",TEAL)
        +arch_card(610,232,268,86,TEAL,"Cross-Site Dashboards","One view of training across all 6 sites and districts.","My Dev",DARK)
        +arch_card(610,328,268,86,TEAL,"Knowledge Base","Searchable institutional memory for instructors and new hires.","My AI",TEAL)
        +arch_card(610,424,268,86,TEAL,"Outcome Analytics","Completion, pass rates, and dispatch-readiness at a glance.","My Dev",DARK))
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">OETT's Two-Motion AI Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Recruit the next generation (left); capture and scale your instructors' expertise (center); run the trust with less administrative load (right).</text>'''
    note=(f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">* My SEO / My AI / My AI Lead Gen / My Dev. AI drafts, captures, and triages; instructors and coordinators validate and own the content.</text>'
        +f'<text x="16" y="568" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">This adds an AI layer on top of your team - and complements your IT Manager (who runs the network). None of this is their job.</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 582" width="900" height="582" role="img">{title}{headers}{bg}{recruit}{train}{operate}{note}</svg>'

# ============================================================ TIMELINE
def milestone_card(x,y,w,h,accent,num,title,body,tag,tag_color):
    t=esc(title); tg=esc(tag)
    tw=len(tg)*7+16; tx=x+w-tw-8; ty=y+h-22
    tag_txt=WHITE if tag_color in (BLUE,DARK,TEAL,PURPLE,RED) else DARK
    l=wrap(body,30)[:2]
    out=f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+17}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{accent}">MILESTONE {num}</text>
  <text x="{x+14}" y="{y+33}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>'''
    yy=y+48
    for ln in l:
        out+=f'<text x="{x+14}" y="{yy}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{esc(ln)}</text>'; yy+=13
    out+=f'''
  <rect x="{tx}" y="{ty}" width="{tw}" height="16" fill="{tag_color}" rx="8"/>
  <text x="{tx+tw//2}" y="{ty+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{tag_txt}" text-anchor="middle">{tg}</text>'''
    return out

def build_timeline_svg():
    P1_X,P2_X,P3_X=80,328,576; P1_W,P2_W,P3_W=248,248,244
    phases=f'''
  <rect x="{P1_X}" y="60" width="{P1_W}" height="44" fill="{BLUE}" rx="4"/>
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1-90</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">FOUNDATION &amp; QUICK WINS</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 91-180</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">BUILD THE TWO MOTIONS</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE ACROSS 6 SITES</text>'''
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Knowledge-Capture Pilot","Record 1-2 retiring master operators into a first AI-built training module.","My AI",TEAL)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Recruit & Curriculum Audit","Map how recruits find OETT today and how curriculum is built and updated.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Curriculum AI Assist","Draft and refresh courses and assessments with instructor sign-off.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Recruitment Engine","Search visibility plus a multilingual application assistant for prospects.","My Dev",DARK)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Roll Across 6 Sites","Apprentice study assistant and CEU/DAS reporting automation, site by site.","My Dev",DARK)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Dashboards & Outcomes","Cross-site analytics and a searchable institutional knowledge base.","My AI",TEAL))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and scope calibrate after a discovery conversation (see the Questions section). Each phase delivers value before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">OETT x Technijian - start with a knowledge-capture pilot, build the two motions, then scale across all six training sites.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ RENDER
async def render(page,html,output):
    await page.set_content(html,wait_until="networkidle")
    box_=await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width":max(box_["w"],900),"height":max(box_["h"],100)})
    await page.screenshot(path=str(output),full_page=True)
    print(f"  saved -> {output.name} ({output.stat().st_size//1024} KB)")

async def main():
    print("Generating OETT diagrams (SVG) at 3x...")
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(); page=await browser.new_page(device_scale_factor=3)
        print("1  model.png");        await render(page,page_shell(build_model_svg()),     DIAGRAMS_DIR/"model.png")
        print("2  personas.png");     await render(page,page_shell(build_personas_svg()),  DIAGRAMS_DIR/"personas.png")
        print("3  peer.png");         await render(page,page_shell(build_peer_svg()),      DIAGRAMS_DIR/"peer.png")
        print("4  architecture.png"); await render(page,page_shell(build_arch_svg()),      DIAGRAMS_DIR/"architecture.png")
        print("5  timeline.png");     await render(page,page_shell(build_timeline_svg()),  DIAGRAMS_DIR/"timeline.png")
        await browser.close()
    print("Done.")

if __name__=="__main__":
    asyncio.run(main())
