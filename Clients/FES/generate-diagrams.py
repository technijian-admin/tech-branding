"""
generate-diagrams.py - Franklin Educational Services (FES) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright (HTML+SVG) at device_scale_factor=3.
Output -> Clients/FES/diagrams/*.png
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">What Franklin Educational Services Does - and Where AI Helps</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A founder-led educational therapy and tutoring practice helping students with learning differences thrive - built on trust and expertise.</text>'''
    in_label=f'<text x="146" y="86" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{ORANGE}" text-anchor="middle">FAMILIES IN</text>'
    supply=(box(40,98,212,68,WHITE,ORANGE,"Parents Seeking Help","searching online, or referred",DARK,GREY)
        +box(40,176,212,68,WHITE,ORANGE,"Students","with learning differences",DARK,GREY))
    hub=f'<rect x="312" y="116" width="210" height="176" rx="6" fill="{DARK}"/>'
    hub_extra=f'''<text x="417" y="152" font-family="Segoe UI,Arial" font-size="16" font-weight="700" fill="{WHITE}" text-anchor="middle">FRANKLIN ED.</text>
  <text x="417" y="184" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">Educational therapy + tutoring</text>
  <text x="417" y="212" font-family="Segoe UI,Arial" font-size="10.5" fill="#9FE6F4" text-anchor="middle">Dr. Franklin's "Academic</text>
  <text x="417" y="228" font-family="Segoe UI,Arial" font-size="10.5" fill="#9FE6F4" text-anchor="middle">Management" method</text>
  <text x="417" y="258" font-family="Segoe UI,Arial" font-size="10.5" fill="#C9CDD6" text-anchor="middle">Brentwood + online</text>'''
    out_label=f'<text x="704" y="86" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{BLUE}" text-anchor="middle">OUTCOMES OUT</text>'
    demand=(box(582,98,278,56,WHITE,BLUE,"Confident, Capable Students","executive function + skills",DARK,GREY)
        +box(582,166,278,56,WHITE,BLUE,"Reassured, Engaged Parents","progress they can see",DARK,GREY)
        +box(582,234,278,56,WHITE,BLUE,"Stronger School Outcomes","and self-advocacy",DARK,GREY))
    arrows=f'''
  <line x1="252" y1="132" x2="308" y2="170" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="252" y1="210" x2="308" y2="232" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="190" x2="578" y2="126" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="200" x2="578" y2="194" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>
  <line x1="522" y1="218" x2="578" y2="258" stroke="{GREY}" stroke-width="2" marker-end="url(#ar)"/>'''
    band=f'''
  <rect x="40" y="324" width="820" height="158" rx="6" fill="{OFF}" stroke="{LIGHT}"/>
  <rect x="40" y="324" width="6" height="158" rx="3" fill="{ORANGE}"/>
  <text x="60" y="350" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}">Two fronts where AI helps - on a foundation of strict privacy for children's data</text>
  <text x="60" y="376" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}">GROW the practice</text>
  <text x="200" y="376" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">be found by the right families, and turn Dr. Franklin's authority into reach.</text>
  <text x="60" y="402" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{BLUE}">RUN it lighter</text>
  <text x="200" y="402" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">give the clinical team their time back from the documentation the work requires.</text>
  <text x="60" y="436" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{TEAL}">PRIVACY FIRST</text>
  <text x="200" y="436" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">children's records never go into public AI; private, governed deployments;</text>
  <text x="200" y="453" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}">a qualified person reviews anything that reaches a parent or child.</text>'''
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
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The People Franklin Serves - and How AI Helps Each</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Not leads - the people at the center of the work, and the staff who do it. The "AI helps" line is the opportunity, to calibrate at discovery.</text>'''
    cw,ch=268,196; gx=20
    x0=40; x1=x0+cw+gx; x2=x1+cw+gx; r1=72
    cards=(persona_card(x0,r1,cw,ch,ORANGE,DARK,"The Parent","Anxious parent of a struggling child; the buyer","trust, real expertise, and progress they can actually see.","be findable; a private intake assistant; clear progress updates.")
        +persona_card(x1,r1,cw,ch,BLUE,WHITE,"The Student","K-college, with a learning difference","personalized, confidence-building support and structure.","adaptive practice + study tools, always guided by an educator.")
        +persona_card(x2,r1,cw,ch,TEAL,DARK,"Educational Therapist","Expert practitioner on staff","to spend time teaching, not writing notes and reports.","draft session notes, reports, and summaries; human signs off.")
        +persona_card(x0+cw//2+gx//2,r1+ch+24,cw,ch,DARK,WHITE,"Referral Partner","School, psychologist, pediatrician, SLP/OT","reliable communication and outcomes for families they send.","referral nurture and clear, professional outcome summaries.")
        +persona_card(x1+cw//2+gx//2,r1+ch+24,cw,ch,RED,WHITE,"Dr. Franklin","Founder, clinical director, the method & brand","to scale his impact without diluting quality or himself.","capture the method into playbooks; surface his authority; free his time."))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 508" width="900" height="508" role="img">{title}{cards}</svg>'

# ============================================================ PEER LANDSCAPE
def build_peer_svg():
    title=f'''
  <text x="40" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">How Tutoring & Special-Ed Practices Are Adopting AI</text>
  <text x="40" y="54" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">A strategic read, not a measured score. The field is moving fastest on documentation and personalized practice. Franklin can lead among premium practices.</text>'''
    banner=f'''
  <rect x="40" y="74" width="820" height="56" rx="6" fill="{BLUE}"/>
  <text x="60" y="96" font-family="Segoe UI,Arial" font-size="12.5" font-weight="700" fill="{WHITE}">What's already proven (2026)</text>
  <text x="60" y="114" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4">Special-education teams report saving ~2-4 hours per IEP using AI to draft documentation, with a human reviewing every word -</text>
  <text x="60" y="128" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4">and ~57% of special-ed teachers find AI helpful for spotting learning patterns.</text>'''
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
    markers=(marker(270,["Most private","tutoring practices"],GREY,up=False)
        +marker(430,["Schools using AI","for IEP paperwork"],BLUE,up=True)
        +marker(570,["AI assessment &","feedback tools"],TEAL,up=False)
        +marker(770,["Intelligent tutoring","(e.g. Khanmigo)"],ORANGE,up=True))
    oett=f'''
  <circle cx="130" cy="{BY+10}" r="11" fill="none" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="4 3"/>
  <circle cx="130" cy="{BY+10}" r="7" fill="{ORANGE}"/>
  <text x="130" y="{BY-78}" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{ORANGE}" text-anchor="middle">Franklin today</text>
  <text x="130" y="{BY-62}" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" text-anchor="middle">premium practice</text>
  <line x1="148" y1="{BY+2}" x2="250" y2="{BY-34}" stroke="{ORANGE}" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#arP)"/>
  <text x="232" y="{BY-44}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}" text-anchor="start">first-mover among</text>
  <text x="232" y="{BY-30}" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="{ORANGE}" text-anchor="start">premium practices</text>'''
    note=f'<text x="60" y="492" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">Examples are representative directions of travel across comparable practices, not guarantees. Sources in the Appendix.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 504" width="900" height="504" role="img">{grad}{title}{banner}{bar}{markers}{oett}{note}</svg>'

# ============================================================ ARCHITECTURE (2 fronts + privacy foundation)
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
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Franklin's Two-Front AI Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Grow the practice (left) and run it lighter (right) - everything resting on a foundation of strict privacy for children's data.</text>'''
    headers=f'''
  <rect x="16" y="74" width="424" height="46" fill="{ORANGE}" rx="4"/>
  <text x="228" y="96" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">GROW THE PRACTICE</text>
  <text x="228" y="112" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">be found by the right families</text>
  <rect x="460" y="74" width="424" height="46" fill="{BLUE}" rx="4"/>
  <text x="672" y="96" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">RUN IT LIGHTER</text>
  <text x="672" y="112" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">give the team their time back</text>'''
    bg=f'''
  <rect x="16" y="124" width="424" height="300" fill="{OFF}" rx="4"/>
  <rect x="460" y="124" width="424" height="300" fill="{OFF}" rx="4"/>'''
    grow=(arch_card(22,134,412,ORANGE,"Be Found by the Right Families","AEO and SEO for dyslexia, ADHD, and learning-difference searches in LA and OC.","My SEO",BLUE)
        +arch_card(22,206,412,ORANGE,"Authority Content Engine","Turn Dr. Franklin's book and 80+ talks into parent guides, articles, and video.","My AI",TEAL)
        +arch_card(22,278,412,ORANGE,"Referral Nurture","Keep schools, psychologists, and pediatricians informed and engaged.","Lead Gen",ORANGE)
        +arch_card(22,350,412,ORANGE,"Capture Inquiries","A private intake assistant that answers parents and routes serious inquiries.","My Dev",DARK))
    run=(arch_card(466,134,412,BLUE,"Session Notes & Reports","Draft from the educator's input; a qualified person reviews and signs off.","My AI",TEAL)
        +arch_card(466,206,412,BLUE,"Assessment Summaries","Turn evaluation data into clear, parent-friendly summaries, reviewed by staff.","My AI",TEAL)
        +arch_card(466,278,412,BLUE,"Capture the Method","Preserve the Academic Management method as team playbooks and onboarding.","My AI",TEAL)
        +arch_card(466,350,412,BLUE,"Tutor-Student Matching","Match the right specialist to each child faster, with the team deciding.","My Dev",DARK))
    foundation=f'''
  <rect x="16" y="436" width="868" height="56" fill="{TEAL}" rx="6"/>
  <text x="450" y="459" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">DATA-PRIVACY FOUNDATION - the base everything sits on</text>
  <text x="450" y="479" font-family="Segoe UI,Arial" font-size="10.5" fill="{DARK}" text-anchor="middle">Children's records never go into public AI tools. Private, governed deployments. A qualified person reviews anything that reaches a parent or child.</text>'''
    note=(f'<text x="16" y="512" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">* My SEO / My AI / My AI Lead Gen / My Dev. AI drafts and finds; Franklin\'s educators decide, teach, and sign off.</text>'
        +f'<text x="16" y="527" font-family="Segoe UI,Arial" font-size="10.5" fill="{GREY}" font-style="italic">It amplifies the team and the method - it never replaces the human relationship at the center of the work.</text>')
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
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Privacy-Safe Setup + Notes Pilot","Stand up governed AI; pilot session-note drafting with 1-2 therapists.","My AI",TEAL)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Visibility & Authority Audit","Map how families find Franklin and where Dr. Franklin's authority can surface.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,TEAL,"3","Authority Content Engine","Turn the book and talks into parent guides, articles, and video.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,TEAL,"4","Documentation Across the Team","Roll note, report, and assessment drafting to all educators.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,ORANGE,"5","Capture the Method","Preserve Academic Management as playbooks; speed tutor onboarding.","My AI",TEAL)
        +milestone_card(COL_X[2],R2,236,92,ORANGE,"6","Parent Portal + Reputation","A progress portal, referral nurture, and a steady review engine.","My Dev",DARK))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and scope calibrate after a discovery conversation (see the Questions section). Each phase delivers value before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">90 / 180 / 365-Day Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Franklin x Technijian - start privacy-safe with a documentation pilot, grow the practice, then scale Dr. Franklin's method.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ RENDER
async def render(page,html,output):
    await page.set_content(html,wait_until="networkidle")
    box_=await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width":max(box_["w"],900),"height":max(box_["h"],100)})
    await page.screenshot(path=str(output),full_page=True)
    print(f"  saved -> {output.name} ({output.stat().st_size//1024} KB)")

async def main():
    print("Generating FES diagrams (SVG) at 3x...")
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
