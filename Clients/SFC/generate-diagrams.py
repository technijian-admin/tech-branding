"""
generate-diagrams.py — Santa Fe Christian Schools (SFC) Managed IT, Security & AI Brief
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
Output -> Clients/SFC/diagrams/{architecture,timeline}.png
Facts-only: structural diagrams mapping Technijian's offering to a K-12 independent school.
Usage:   python "Clients/SFC/generate-diagrams.py"
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

# ============================================================ ARCHITECTURE (3-column: Run / Secure / Grow)
def arch_card(x,y,w,h,accent,title,desc,badge,badge_color):
    t=esc(title); d=esc(desc); b=esc(badge)
    badge_txt=WHITE if badge_color in (BLUE,DARK,TEAL,PURPLE,RED) else DARK
    words=d.split(); l1,l2,cnt,on2=[],[],0,False
    for w_ in words:
        if not on2 and cnt+len(w_)+1<=40: l1.append(w_); cnt+=len(w_)+1
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
  <text x="148" y="98" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">RUN THE SCHOOL'S IT</text>
  <text x="148" y="115" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">the foundation that just works</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="98" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">SECURE &amp; PROTECT STUDENTS</text>
  <text x="448" y="115" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">student data, safety &amp; compliance</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="98" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">SAVE TIME &amp; GROW</text>
  <text x="748" y="115" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">AI for staff, families &amp; admissions</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    run=(arch_card(20,136,256,88,BLUE,"Help Desk for Staff & Faculty","One place for teachers and office staff to get unstuck fast, on campus or remote.","Co-Managed IT",BLUE)
        +arch_card(20,236,256,88,BLUE,"Network, Wi-Fi & Phones","The Checkpoint firewall, campus Wi-Fi, and the 3CX / Twilio phone system, run and tuned.","Managed IT",BLUE)
        +arch_card(20,336,256,88,BLUE,"Google Workspace, Identity & Devices","Accounts, single sign-on, and the MacBook / Chromebook fleet for staff and students.","Managed IT",BLUE)
        +arch_card(20,436,256,88,BLUE,"Backup & Continuity","Tested backups of servers, files and cloud so a bad day never becomes a lost week.","My Continuity",TEAL))
    secure=(arch_card(320,136,256,88,ORANGE,"24/7 Managed Detection & Response","Eyes-on-glass monitoring and response across endpoints and servers, around the clock.","My Security",ORANGE)
        +arch_card(320,236,256,88,ORANGE,"Email, Web & Content Filtering","Anti-phishing and CIPA-aligned web filtering that keeps students safer online.","My AntiSpam",ORANGE)
        +arch_card(320,336,256,88,ORANGE,"Student-Data Privacy","FERPA, COPPA and California SOPIPA / AB 1584 controls over who can touch what.","My Compliance",ORANGE)
        +arch_card(320,436,256,88,ORANGE,"Compliance Evidence & Vendors","Audit-ready records and vetting of the ed-tech apps that handle student data.","My Compliance",ORANGE))
    grow=(arch_card(620,136,256,88,TEAL,"Staff & Teacher Time-Savers","Draft newsletters, forms and routine replies in minutes — humans review and send.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Family & Parent Communications","Faster, clearer answers to common parent questions across web, email and text.","My AI",TEAL)
        +arch_card(620,336,256,88,TEAL,"Admissions & Enrollment Visibility","Be the school families find and choose — search, AEO and inquiry follow-up.","My SEO",BLUE)
        +arch_card(620,436,256,88,TEAL,"Knowledge Base","Policies, how-tos and institutional know-how, searchable instead of stuck in inboxes.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">enables</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">frees</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Technijian for Santa Fe Christian Schools — One Partner, Three Jobs</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Run the school's IT (left); secure it and protect student data (centre); save staff time and help enrollment (right).</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My IT / My Security / My AntiSpam / My Compliance / My AI / My SEO. A person reviews every AI-drafted message; student and family data stays in private, governed tools.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">{marker}{title}{headers}{bg}{run}{secure}{grow}{arrows}{note}</svg>'

# ============================================================ TIMELINE (phased roadmap)
def milestone_card(x,y,w,h,accent,num,title,body,tag,tag_color):
    t=esc(title); bd=esc(body); tg=esc(tag)
    tw=len(tg)*7+16; tx=x+w-tw-8; ty=y+h-22
    tag_txt=WHITE if tag_color in (BLUE,DARK,TEAL,PURPLE,RED) else DARK
    words=bd.split(); l1,l2,cnt,on2=[],[],0,False
    for w_ in words:
        if not on2 and cnt+len(w_)+1<=31: l1.append(w_); cnt+=len(w_)+1
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
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">PHASE 1 · STABILIZE</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">solve today's problem</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">PHASE 2 · SECURE</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">protect &amp; comply</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">PHASE 3 · OPTIMIZE</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">save time &amp; grow</text>'''
    TL_Y,TL_H=110,18
    bar=f'''
  <defs><linearGradient id="tl" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="{BLUE}"/><stop offset="45%" stop-color="{ORANGE}"/><stop offset="100%" stop-color="{TEAL}"/></linearGradient></defs>
  <rect x="80" y="{TL_Y}" width="740" height="{TL_H}" fill="url(#tl)" rx="4"/>
  <line x1="80" y1="{TL_Y-5}" x2="80" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <line x1="328" y1="{TL_Y-5}" x2="328" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="576" y1="{TL_Y-5}" x2="576" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="820" y1="{TL_Y-5}" x2="820" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <text x="80" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Start</text>
  <text x="328" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">~30 days</text>
  <text x="576" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">~90 days</text>
  <text x="820" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Ongoing</text>'''
    COL_X=[84,340,588]; R1,R2=162,266
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Phones & Network Working","Configure 3CX V20, Checkpoint and Twilio cleanly — calls just work.","Quick win",BLUE)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Free Nexus Assess","A no-cost read of your environment and a prioritized roadmap to keep.","No cost",GREEN)
        +milestone_card(COL_X[1],R1,232,92,ORANGE,"3","Security Baseline","MFA, EDR, backup and email filtering brought to a known-good baseline.","My Security",ORANGE)
        +milestone_card(COL_X[1],R2,232,92,ORANGE,"4","Student-Data Compliance","FERPA / COPPA / SOPIPA controls and audit-ready evidence in place.","My Compliance",ORANGE)
        +milestone_card(COL_X[2],R1,236,92,TEAL,"5","Staff Time-Savers","AI drafting for newsletters, forms and parent replies — humans approve.","My AI",TEAL)
        +milestone_card(COL_X[2],R2,236,92,TEAL,"6","Admissions Visibility","Be the school families find; faster inquiry follow-up and a knowledge base.","My SEO",BLUE))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate after a short discovery call and the free assessment. Each phase delivers something useful before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">A Staged Roadmap — Solve Today's Problem First, Then Build</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Santa Fe Christian Schools x Technijian — stabilize the phones and network, then secure, then optimize.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ RENDER
async def render(page,html,output):
    await page.set_viewport_size({"width":960,"height":700})
    await page.set_content(html,wait_until="networkidle")
    await page.wait_for_timeout(300)
    el=await page.query_selector("svg")            # clip to the SVG element (robust vs full_page)
    await el.screenshot(path=str(output))
    print(f"  saved -> {output.name} ({output.stat().st_size//1024} KB)")

async def main():
    print("Generating Santa Fe Christian Schools diagrams (SVG)...")
    async with async_playwright() as pw:
        browser=await pw.chromium.launch()
        page=await browser.new_page(device_scale_factor=3)
        print("1  architecture.png"); await render(page,page_shell(build_arch_svg()),     DIAGRAMS_DIR/"architecture.png")
        print("2  timeline.png");     await render(page,page_shell(build_timeline_svg()), DIAGRAMS_DIR/"timeline.png")
        await browser.close()
    print("Done.")

if __name__=="__main__":
    asyncio.run(main())
