"""
generate-diagrams.py — Pangea Luxe Travel (PLT) AI Growth & Integration Blueprint
Renders diagram PNGs via Playwright using HTML+SVG (technijian-diagram skill).
Output -> Clients/PLT/diagrams/{personas,architecture,timeline}.png
Usage:   python "Clients/PLT/generate-diagrams.py"
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

# ============================================================ PERSONAS (Frequency x Spend)
def build_personas_svg():
    def X(v): return round((80+v/100*760)/4)*4
    def Y(m): return round((500-m/100*440)/4)*4
    QVX=X(50); QHY=Y(50)
    # (key, label, freq_x, spend_y, color, text_color, radius, label_dx, label_dy, anchor)
    P=[("VIP","Repeat & Referral VIP",86,80,BLUE,WHITE,34,0,56,"middle"),
       ("FAMILY","Multigen Luxury Family",42,84,PURPLE,WHITE,32,44,4,"start"),
       ("HONEY","Honeymoon & Wedding Couple",20,76,ORANGE,DARK,28,0,46,"middle"),
       ("MILE","Milestone Celebration Couple",54,62,GOLD,DARK,26,0,46,"middle"),
       ("CRUISE","Luxury Cruise Enthusiast",74,46,TEAL,DARK,26,0,44,"middle")]
    dots=""
    for key,label,v,m,color,tc,r,ldx,ldy,anc in P:
        cx,cy=X(v),Y(m); lx,ly=cx+ldx,cy+ldy
        ring=f'<circle cx="{cx}" cy="{cy}" r="{r+6}" fill="none" stroke="{BLUE}" stroke-width="2" stroke-dasharray="4 3"/>' if key=="VIP" else ""
        dots+=f'''{ring}
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>
  <text x="{cx}" y="{cy+4}" font-family="Segoe UI,Arial" font-size="11" font-weight="700" fill="{tc}" text-anchor="middle">{key}</text>
  <text x="{lx}" y="{ly}" font-family="Segoe UI,Arial" font-size="12" font-weight="600" fill="{DARK}" text-anchor="{anc}">{esc(label)}</text>'''
    quad=f'''
  <text x="{X(76)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">REPEAT &amp; HIGH-VALUE (the engine)</text>
  <text x="{X(22)}" y="74" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">ONCE-IN-A-LIFETIME</text>
  <text x="{X(76)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">FREQUENT / ENTHUSIAST</text>
  <text x="{X(22)}" y="492" font-family="Segoe UI,Arial" font-size="11.5" font-weight="700" fill="#9AA0A6" text-anchor="middle">OCCASIONAL</text>'''
    legend=f'''
  <circle cx="84" cy="557" r="7" fill="{BLUE}"/><text x="96" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Repeat &amp; Referral VIP (highest lifetime value)</text>
  <circle cx="430" cy="557" r="7" fill="{PURPLE}"/><text x="442" y="562" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Multigenerational Luxury Family</text>
  <circle cx="84" cy="581" r="7" fill="{ORANGE}"/><text x="96" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Honeymoon &amp; Destination-Wedding Couple</text>
  <circle cx="430" cy="581" r="7" fill="{GOLD}"/><text x="442" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Milestone Celebration Couple</text>
  <circle cx="700" cy="581" r="7" fill="{TEAL}"/><text x="712" y="586" font-family="Segoe UI,Arial" font-size="12" fill="{DARK}">Luxury Cruise Enthusiast</text>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">The Travelers You Serve — Trip Frequency x Spend per Trip</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Research-based archetypes of the affluent travelers a luxury advisory serves. Bubble size = relative lifetime value.</text>
  <rect x="80" y="60" width="760" height="440" fill="{OFF}" rx="4"/>
  <line x1="{QVX}" y1="60" x2="{QVX}" y2="500" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="{QHY}" x2="840" y2="{QHY}" stroke="{LIGHT}" stroke-width="1.5" stroke-dasharray="5 4"/>
  <line x1="80" y1="60" x2="80" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <line x1="80" y1="500" x2="840" y2="500" stroke="#ADB5BD" stroke-width="1.5"/>
  <text transform="rotate(-90,30,280)" x="30" y="280" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Spend per Trip -&gt;</text>
  <text x="460" y="534" font-family="Segoe UI,Arial" font-size="13" font-weight="600" fill="{DARK}" text-anchor="middle">Trip Frequency -&gt;</text>
  {quad}{dots}{legend}
</svg>'''

# ============================================================ ARCHITECTURE (3-column: Win / Serve / Keep)
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
  <text x="148" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{WHITE}" text-anchor="middle">GET FOUND &amp; CHOSEN</text>
  <text x="148" y="116" font-family="Segoe UI,Arial" font-size="10" fill="#C9E3F4" text-anchor="middle">be the advisor affluent travelers find</text>
  <rect x="316" y="76" width="264" height="48" fill="{ORANGE}" rx="4"/>
  <text x="448" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">PLAN &amp; SERVE FASTER</text>
  <text x="448" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">the time engine — minutes, not hours</text>
  <rect x="616" y="76" width="264" height="48" fill="{TEAL}" rx="4"/>
  <text x="748" y="100" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="{DARK}" text-anchor="middle">KEEP &amp; GROW</text>
  <text x="748" y="116" font-family="Segoe UI,Arial" font-size="10" fill="{DARK}" text-anchor="middle">repeat, referral &amp; reputation</text>'''
    bg=f'''
  <rect x="16" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="316" y="124" width="264" height="412" fill="{OFF}" rx="4"/>
  <rect x="616" y="124" width="264" height="412" fill="{OFF}" rx="4"/>'''
    win=(arch_card(20,136,256,88,BLUE,"Local & AEO Search Authority","Be the cited answer for 'luxury Italy advisor' and 'Orange County honeymoon planner.'","My SEO",BLUE)
        +arch_card(20,236,256,88,BLUE,"Instagram & Visual Content Engine","Turn 30+ countries of photos into a steady, on-brand feed affluent travelers follow.","My SEO",BLUE)
        +arch_card(20,336,256,88,BLUE,"Reviews & Reputation Velocity","Systematically earn Google, Yelp and Virtuoso reviews — the proof that converts.","My SEO",BLUE)
        +arch_card(20,436,256,88,BLUE,"Lead Capture & Nurture","Turn website visitors into enquiries; nurture them warmly until they are ready to book.","My AI",TEAL))
    serve=(arch_card(320,136,256,88,ORANGE,"AI Itinerary & Proposal Drafting","A brief becomes a polished, branded itinerary in minutes; you personalise and send.","My AI",TEAL)
        +arch_card(320,236,256,88,ORANGE,"Supplier & Destination Research","Pull options, availability and insider detail fast — the research grind, automated.","My AI",TEAL)
        +arch_card(320,336,256,88,ORANGE,"Branded Trip Documents","Pre-trip guides, day-by-day plans and packing lists, generated to your template.","My Dev",DARK)
        +arch_card(320,436,256,88,ORANGE,"Quote & Option Assembly","Assemble comparison options and quotes without the manual copy-and-paste.","My AI",TEAL))
    keep=(arch_card(620,136,256,88,TEAL,"Post-Trip Re-Engagement","Welcome-home note, review request and the next-trip nudge — handled automatically.","My AI",TEAL)
        +arch_card(620,236,256,88,TEAL,"Anniversary & Re-Book Triggers","Surface the right client for the right offer at the right moment.","My AI",TEAL)
        +arch_card(620,336,256,88,TEAL,"Referral Activation","Make it easy for delighted clients to refer — the boutique advisor's best channel.","My AI",TEAL)
        +arch_card(620,436,256,88,TEAL,"Destination Knowledge Base","Your 30+ countries of know-how, searchable — not stuck in two people's heads.","My Dev",DARK))
    arrows=f'''
  <line x1="280" y1="330" x2="312" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="296" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">win</text>
  <line x1="580" y1="330" x2="612" y2="330" stroke="{BLUE}" stroke-width="2" marker-end="url(#arr)"/>
  <text x="596" y="324" font-family="Segoe UI,Arial" font-size="10" fill="{GREY}" text-anchor="middle">delight</text>'''
    title=f'''
  <text x="16" y="34" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">Pangea Luxe AI Growth &amp; Time Engine</text>
  <text x="16" y="56" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Win more travelers (left); plan and serve them faster (centre); keep and grow them (right) — so two people run like a much larger agency.</text>'''
    note=f'<text x="16" y="552" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* My SEO / My AI / My Dev. The advisor personalises and confirms every itinerary, quote and booking; client and payment data stays in private, governed tools.</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="900" height="560" role="img">{marker}{title}{headers}{bg}{win}{serve}{keep}{arrows}{note}</svg>'

# ============================================================ TIMELINE (30/60/90)
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
  <text x="{P1_X+P1_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{WHITE}" text-anchor="middle">DAYS 1-30</text>
  <text x="{P1_X+P1_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="#C9E3F4" text-anchor="middle">GET FOUND</text>
  <rect x="{P2_X}" y="60" width="{P2_W}" height="44" fill="{ORANGE}" rx="4"/>
  <text x="{P2_X+P2_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 31-60</text>
  <text x="{P2_X+P2_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">SERVE FASTER</text>
  <rect x="{P3_X}" y="60" width="{P3_W}" height="44" fill="{TEAL}" rx="4"/>
  <text x="{P3_X+P3_W//2}" y="80" font-family="Segoe UI,Arial" font-size="12" font-weight="700" fill="{DARK}" text-anchor="middle">DAYS 61-90</text>
  <text x="{P3_X+P3_W//2}" y="96" font-family="Segoe UI,Arial" font-size="11" fill="{DARK}" text-anchor="middle">KEEP &amp; SCALE</text>'''
    TL_Y,TL_H=110,18
    bar=f'''
  <defs><linearGradient id="tl" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="{BLUE}"/><stop offset="45%" stop-color="{ORANGE}"/><stop offset="100%" stop-color="{TEAL}"/></linearGradient></defs>
  <rect x="80" y="{TL_Y}" width="740" height="{TL_H}" fill="url(#tl)" rx="4"/>
  <line x1="80" y1="{TL_Y-5}" x2="80" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <line x1="328" y1="{TL_Y-5}" x2="328" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="576" y1="{TL_Y-5}" x2="576" y2="{TL_Y+TL_H+5}" stroke="{WHITE}" stroke-width="2" opacity="0.7"/>
  <line x1="820" y1="{TL_Y-5}" x2="820" y2="{TL_Y+TL_H+5}" stroke="{GREY}" stroke-width="1.5"/>
  <text x="80" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 0</text>
  <text x="328" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 30</text>
  <text x="576" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 60</text>
  <text x="820" y="{TL_Y+TL_H+18}" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" text-anchor="middle">Day 90</text>'''
    COL_X=[84,340,588]; R1,R2=162,266
    cards=(milestone_card(COL_X[0],R1,232,92,BLUE,"1","Visibility Foundation","Optimise Google Business and Yelp; switch on the review engine.","My SEO",BLUE)
        +milestone_card(COL_X[0],R2,232,92,BLUE,"2","Content & Social Jumpstart","Revive the blog with guides; set an Instagram cadence.","My SEO",BLUE)
        +milestone_card(COL_X[1],R1,232,92,ORANGE,"3","AI Itinerary Assist","Draft itineraries and proposals in your own voice.","My AI",TEAL)
        +milestone_card(COL_X[1],R2,232,92,ORANGE,"4","Research & Documents","Automate supplier research and trip-document assembly.","My AI",TEAL)
        +milestone_card(COL_X[2],R1,236,92,TEAL,"5","Retention Engine","Post-trip re-engagement, reviews and referrals — automatic.","My AI",TEAL)
        +milestone_card(COL_X[2],R2,236,92,TEAL,"6","Knowledge + ROI","A searchable knowledge base and a simple ROI dashboard.","My Dev",DARK))
    note=f'<text x="80" y="378" font-family="Segoe UI,Arial" font-size="11" fill="{GREY}" font-style="italic">* Sequence and targets calibrate after a short discovery call. The build is staged so each phase pays for itself before the next begins.</text>'
    title=f'''
  <text x="80" y="28" font-family="Segoe UI,Arial" font-size="18" font-weight="700" fill="{DARK}">30 / 60 / 90-Day Growth &amp; Time Roadmap</text>
  <text x="80" y="48" font-family="Segoe UI,Arial" font-size="12" fill="{GREY}">Pangea Luxe x Technijian — get found, then serve faster, then keep and scale.</text>'''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" width="900" height="392" role="img">{title}{phases}{bar}{cards}{note}</svg>'

# ============================================================ RENDER
async def render(page,html,output):
    await page.set_content(html,wait_until="networkidle")
    box_=await page.evaluate("() => ({w: document.body.scrollWidth, h: document.body.scrollHeight})")
    await page.set_viewport_size({"width":max(box_["w"],900),"height":max(box_["h"],100)})
    await page.screenshot(path=str(output),full_page=True)
    print(f"  saved -> {output.name} ({output.stat().st_size//1024} KB)")

async def main():
    print("Generating Pangea Luxe Travel diagrams (SVG)...")
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(); page=await browser.new_page(device_scale_factor=3)
        print("1  personas.png");     await render(page,page_shell(build_personas_svg()),    DIAGRAMS_DIR/"personas.png")
        print("2  architecture.png"); await render(page,page_shell(build_arch_svg()),        DIAGRAMS_DIR/"architecture.png")
        print("3  timeline.png");     await render(page,page_shell(build_timeline_svg()),    DIAGRAMS_DIR/"timeline.png")
        await browser.close()
    print("Done.")

if __name__=="__main__":
    asyncio.run(main())
