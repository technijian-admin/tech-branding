"""
generate-diagrams.py - Prosperity Wealth Planning (PWP) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright (HTML+SVG) at device_scale_factor=3.
Output -> Clients/PWP/diagrams/*.png
ASCII-only source (mojibake safety). No em-dashes.
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">What Prosperity Wealth Planning Does - and Where AI Helps</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A fee-only fiduciary financial-planning firm helping professionals and retirees retire with confidence - built on trust and judgment.</text>'''
    in_label=f'<text x="146" y="86" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">CLIENTS IN</text>'
    supply=(box(40,98,212,68,WHITE,ORANGE,"Professionals & Retirees","searching online, or referred",DARK,GREY)
        +box(40,176,212,68,WHITE,ORANGE,"Automotive Pros & Retirees","the firm's signature niche",DARK,GREY))
    hub=f'<rect x="312" y="116" width="210" height="176" rx="6" fill="{DARK}"/>'
    hub_extra=f'''<text x="417" y="150" font-family="Segoe UI,Arial" font-size="15" font-weight="700" fill="{WHITE}" text-anchor="middle">PROSPERITY WEALTH</text>
  <text x="417" y="182" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">Fee-only fiduciary planning</text>
  <text x="417" y="210" font-family="Segoe UI,Arial" font-size="10.5" fill="#9FE6F4" text-anchor="middle">Carolanne's planning</text>
  <text x="417" y="226" font-family="Segoe UI,Arial" font-size="10.5" fill="#9FE6F4" text-anchor="middle">process and judgment</text>
  <text x="417" y="258" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">Irvine + Long Beach</text>'''
    out_label=f'<text x="704" y="86" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">OUTCOMES OUT</text>'
    demand=(box(582,98,278,56,WHITE,BLUE,"Confident Retirement Income","a plan they understand",DARK,GREY)
        +box(582,166,278,56,WHITE,BLUE,"Clarity & Peace of Mind","progress they can see",DARK,GREY)
        +box(582,234,278,56,WHITE,BLUE,"A Fiduciary They Trust","advice, no products sold",DARK,GREY))
    arrows=f'''
  <line x1="252" y1="132" x2="308" y2="170" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="252" y1="210" x2="308" y2="232" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="190" x2="578" y2="126" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="200" x2="578" y2="194" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="218" x2="578" y2="258" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    band=f'''
  <rect x="40" y="324" width="820" height="158" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="324" width="6" height="158" rx="3" fill="{ORANGE}"/>
  <text x="60" y="350" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Two fronts where AI helps - on a foundation of strict privacy and RIA compliance for client financial data</text>
  <text x="60" y="376" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}">GROW the practice</text>
  <text x="200" y="376" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">be found by the right clients, and turn the firm's video series into reach.</text>
  <text x="60" y="402" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{BLUE}">RUN it lighter</text>
  <text x="200" y="402" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">give advisors their time back from meeting notes, plan drafting, and client comms.</text>
  <text x="60" y="436" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{TEAL}">PRIVACY & COMPLIANCE FIRST</text>
  <text x="240" y="436" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">client financial data never goes into public AI; private, governed deployments;</text>
  <text x="240" y="453" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">Reg S-P, the SEC Marketing Rule, and a fiduciary reviewing anything a client sees.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500" role="img">{marker}{title}{in_label}{supply}{hub}{hub_extra}{out_label}{demand}{arrows}{band}</svg>'

# ============================================================ PERSONAS
def persona_card(x,y,w,h,color,tcolor,name,role,need,ai):
    nm=esc(name); role_l=wrap(role,32); need_l=wrap("Needs: "+need,34); ai_l=wrap("AI helps: "+ai,34)
    head_h=40
    out=f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{WHITE}" stroke="{LIGHT}" stroke-width="1.5"/>
  <rect x="{x}" y="{y}" width="{w}" height="{head_h}" rx="6" fill="{color}"/>
  <rect x="{x}" y="{y+head_h-8}" width="{w}" height="8" fill="{color}"/>
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The People Prosperity Wealth Planning Serves - and How AI Helps Each</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Not leads - the people at the center of the work, and the team and partners around them. The "AI helps" line is the opportunity, to calibrate at discovery.</text>'''
    cw,ch=268,196; gx=20
    x0=40; x1=x0+cw+gx; x2=x1+cw+gx; r1=72
    cards=(persona_card(x0,r1,cw,ch,ORANGE,DARK,"The Affluent Client","Professional or retiree, $500K+; the buyer","trust, fiduciary care, and a plan they can actually see.","be findable; a private intake assistant; clearer plan updates.")
        +persona_card(x1,r1,cw,ch,BLUE,WHITE,"Automotive Pro & Retiree","Toyota associate or retiree; the niche","a planner who knows equity comp, pensions, and their world.","be the cited expert for their situation; faster, tailored plans.")
        +persona_card(x2,r1,cw,ch,TEAL,DARK,"The Financial Planner","CFP on staff","to spend time advising, not writing notes and plans.","draft meeting notes, plans, and summaries; advisor signs off.")
        +persona_card(x0+cw//2+gx//2,r1+ch+24,cw,ch,DARK,WHITE,"Referral Partner / COI","CPA, estate attorney, custodian","reliable communication and outcomes for clients they send.","COI nurture and clear, professional client summaries.")
        +persona_card(x1+cw//2+gx//2,r1+ch+24,cw,ch,RED,WHITE,"Carolanne Chavanne","Founder; 35 years of relationships & the method","to scale her judgment without diluting quality or herself.","capture the method into playbooks; surface her authority; free her time."))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 508" width="900" height="508" role="img">{title}{cards}</svg>'

# ============================================================ PEER LANDSCAPE
def build_peer_svg():
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How RIAs & Financial Planners Are Adopting AI</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic read, not a measured score. The field is moving fastest on meeting notes and client communications. PWP can lead among premium fee-only practices.</text>'''
    banner=f'''
  <rect x="40" y="74" width="820" height="56" rx="6" fill="{BLUE}"/>
  <text x="60" y="96" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{WHITE}">What's already proven (2026)</text>
  <text x="60" y="114" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4">63% of RIAs now use AI (Schwab, Jan 2026), more than double 2023; the leading uses are meeting notes and email drafting -</text>
  <text x="60" y="128" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4">and AI note-takers report saving advisors 5-15 hours a week (vendor-reported).</text>'''
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
    markers=(marker(270,["Most solo","RIAs"],GREY,up=False)
        +marker(430,["Meeting-note adopters","(Jump, Zocks)"],BLUE,up=True)
        +marker(570,["CRM & planning","AI assistants"],TEAL,up=False)
        +marker(770,["Robo & planning","tools"],ORANGE,up=True))
    here=f'''
  <circle cx="130" cy="{BY+10}" r="11" fill="none" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="4 3"/>
  <circle cx="130" cy="{BY+10}" r="7" fill="{ORANGE}"/>
  <text x="130" y="{BY-78}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{ORANGE}" text-anchor="middle">PWP today</text>
  <text x="130" y="{BY-62}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" text-anchor="middle">premium fee-only</text>
  <line x1="148" y1="{BY+2}" x2="250" y2="{BY-34}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arP)"/>
  <text x="232" y="{BY-44}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}" text-anchor="start">first-mover among</text>
  <text x="232" y="{BY-30}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}" text-anchor="start">premium fee-only practices</text>'''
    note=f'<text x="60" y="492" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">Examples are representative directions of travel across comparable practices, not guarantees. Sources in the Appendix.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 504" width="900" height="504" role="img">{grad}{title}{banner}{bar}{markers}{here}{note}</svg>'

# ============================================================ ARCHITECTURE (2 fronts + privacy/compliance foundation)
def arch_card(x,y,w,accent,title,desc,badge,badge_color,h=62):
    t=esc(title); b=esc(badge)
    badge_txt=WHITE if badge_color in (BLUE,DARK,TEAL,PURPLE,RED) else DARK
    l=wrap(desc,46)[:2]
    bw=len(b)*7+16; bx=x+w-bw-8; by=y+h-22
    out=f'''
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{WHITE}" rx="3"/>
  <rect x="{x}" y="{y}" width="4" height="{h}" fill="{accent}" rx="2"/>
  <text x="{x+14}" y="{y+19}" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}">{t}</text>'''
    yy=y+35
    for ln in l:
        out+=f'<text x="{x+14}" y="{yy}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}">{esc(ln)}</text>'; yy+=13
    out+=f'''
  <rect x="{bx}" y="{by}" width="{bw}" height="16" fill="{badge_color}" rx="8"/>
  <text x="{bx+bw//2}" y="{by+11}" font-family="Segoe UI,Arial" font-size="10" font-weight="700" fill="{badge_txt}" text-anchor="middle">{b}</text>'''
    return out

def build_arch_svg():
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Prosperity Wealth Planning's Two-Front AI Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Grow the practice (left) and run it lighter (right) - everything resting on a foundation of privacy and RIA compliance for client financial data.</text>'''
    headers=f'''
  <rect x="16" y="74" width="424" height="46" fill="{ORANGE}" rx="4"/>
  <text x="228" y="96" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">GROW THE PRACTICE</text>
  <text x="228" y="112" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">be found by the right clients</text>
  <rect x="460" y="74" width="424" height="46" fill="{BLUE}" rx="4"/>
  <text x="672" y="96" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">RUN IT LIGHTER</text>
  <text x="672" y="112" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">give the team their time back</text>'''
    bg=f'''
  <rect x="16" y="124" width="424" height="300" fill="{OFF}" rx="4"/>
  <rect x="460" y="124" width="424" height="300" fill="{OFF}" rx="4"/>'''
    grow=(arch_card(22,134,412,ORANGE,"Be Found by the Right Clients","AEO and SEO for fee-only and retirement searches in Irvine and OC.","My SEO",BLUE)
        +arch_card(22,206,412,ORANGE,"Authority Content Engine","Turn the Supercharge Your Finances series into articles, posts, and video.","My AI",TEAL)
        +arch_card(22,278,412,ORANGE,"Referral & COI Nurture","Keep CPAs, estate attorneys, and custodians informed and engaged.","Lead Gen",ORANGE)
        +arch_card(22,350,412,ORANGE,"Capture Inquiries","A private intake assistant that answers prospects and routes serious inquiries.","My Dev",DARK))
    run=(arch_card(466,134,412,BLUE,"Meeting Notes & Follow-ups","Draft from the advisor's input; a person reviews and signs off.","My AI",TEAL)
        +arch_card(466,206,412,BLUE,"Financial-Plan Drafting","Turn planning inputs into draft plans and IPS, reviewed by the advisor.","My AI",TEAL)
        +arch_card(466,278,412,BLUE,"Client Review Prep","Pre-meeting client dossiers and summaries from Orion and the CRM.","My AI",TEAL)
        +arch_card(466,350,412,BLUE,"Capture the Method","Preserve Carolanne's planning process as playbooks and onboarding.","My AI",TEAL))
    foundation=f'''
  <rect x="16" y="436" width="868" height="56" fill="{TEAL}" rx="6"/>
  <text x="450" y="459" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">PRIVACY & COMPLIANCE FOUNDATION - the base everything sits on</text>
  <text x="450" y="479" font-family="Segoe UI,Arial" font-size="10.5" fill="{DARK}" text-anchor="middle">Client financial data never goes into public AI tools. Private, governed deployments. Reg S-P, the Marketing Rule, and fiduciary review built in.</text>'''
    note=(f'<text x="16" y="512" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">* My SEO / My AI / My AI Lead Gen / My Dev. AI drafts and finds; PWP\'s advisors decide, advise, and sign off.</text>'
        +f'<text x="16" y="527" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">It amplifies the team and the method - it never replaces the fiduciary relationship at the center of the work.</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" width="900" height="540" role="img">{title}{headers}{bg}{grow}{run}{foundation}{note}</svg>'

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
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">GROW &amp; AUTOMATE</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 181-365</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SCALE THE METHOD</text>'''
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Compliance-Safe Setup + Notes Pilot","Governed AI setup; pilot notes with two advisors.","My AI",TEAL)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Visibility & Authority Audit","Map how clients find PWP and where authority can surface.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Authority Content Engine","Repurpose the video series into posts and video.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Documentation Across the Team","Roll notes, plans, and review prep to all advisors.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Capture the Method","Preserve Carolanne's process; speed advisor onboarding.","My AI",TEAL)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Client Portal + Reputation","A client portal, COI nurture, and a steady review engine.","My Dev",DARK))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and scope calibrate after a discovery conversation (see the Questions section). Each phase delivers value before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">PWP x Technijian - start compliance-safe with a meeting-notes pilot, grow the practice, then scale Carolanne's method.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ RENDER
async def render(page,html,output):
    await page.set_content(html,wait_until="networkidle")
    box_=await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width":max(box_["w"],900),"height":max(box_["h"],100)})
    await page.screenshot(path=str(output),full_page=True)
    print(f"  saved -> {output.name} ({output.stat().st_size//1024} KB)")

async def main():
    print("Generating PWP diagrams (SVG) at 3x...")
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
