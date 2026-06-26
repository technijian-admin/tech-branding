# -*- coding: utf-8 -*-
"""Danielian Associates - AI Pursuit Intelligence: A Business Development Proposal.
Self-contained HTML -> branded multi-page Letter PDF (Playwright/Chromium).

Renders the accuracy-reviewed markdown (DAS-AI-Pursuit-Intelligence-Proposal.md)
into a Technijian-branded PDF that matches the DAS report/summary/brief family.

LOGO DISCIPLINE (feedback_logo_use_authentic_files): uses the AUTHENTIC root logos
  - assets/Technijian Logo 2.png        (light bg: cover + running header)
  - assets/Technijian Logo - white text (dark bg: not needed here)
NOT the assets/logos/png/* AI fakes that brand-tokens.json points to.
"""
import os, base64
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LOGO_LIGHT = os.path.join(ROOT, "assets", "Technijian Logo 2.png")  # authentic, light bg
light_b64 = base64.b64encode(open(LOGO_LIGHT, "rb").read()).decode()
OUT = os.path.join(HERE, "Danielian-AI-Pursuit-Intelligence-Proposal.pdf")

# Brand colors (brand-tokens.json)
BLUE, ORANGE, TEAL, DARK = "#006DB6", "#F67D4B", "#1EAAC8", "#1A1A2E"
GREY, LIGHT, OFF, PURPLE = "#59595B", "#E3E7EB", "#F6F8FA", "#7B2D8B"

# ---------- fragment helpers ----------
def sech(num, title, color=BLUE):
    return (f'<div class="sech avoid"><span class="bar" style="background:{color}"></span>'
            f'<h2 style="color:{color}">{num}&nbsp;&nbsp;{title}</h2></div>')

def sub(title, color=BLUE):
    return f'<h3 style="color:{color}">{title}</h3>'

def callout(title, body, color=BLUE):
    if isinstance(body, (list, tuple)):
        body = "".join(f"<p>{b}</p>" for b in body)
    else:
        body = f"<p>{body}</p>"
    return (f'<div class="callout avoid" style="border-color:{color}">'
            f'<h4 style="color:{color}">{title}</h4>{body}</div>')

def kpi(n, l, color=BLUE):
    return (f'<div class="kpi"><div class="n" style="color:{color}">{n}</div>'
            f'<div class="l">{l}</div></div>')

def table(headers, rows, aligns=None, headcolor=BLUE):
    aligns = aligns or ["l"] * len(headers)
    th = "".join(f'<th class="{a}" style="background:{headcolor}">{h}</th>' for h, a in zip(headers, aligns))
    trs = ""
    for r in rows:
        tds = ""
        for cell, a in zip(r, aligns):
            tds += f'<td class="{a}">{cell}</td>'
        trs += f"<tr>{tds}</tr>"
    return f'<table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>'

# ---------- CSS (plain string; hardcoded hex) ----------
CSS = """
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Open Sans',Arial,sans-serif; color:#59595B; font-size:13px; line-height:1.62; }
p { margin-bottom:11px; text-align:justify; }
.avoid { break-inside:avoid; }
.pb { break-before:page; }

/* ---- cover ---- */
.cover { text-align:center; }
.cband { height:28px; background:#006DB6; border-radius:3px; margin:0 0 42px; }
.cband.o { height:14px; background:#F67D4B; border-radius:3px; margin:38px 0 0; }
.cover img.logo { height:58px; margin:6px 0 4px; }
.crule { width:150px; height:3px; background:#F67D4B; margin:22px auto 26px; }
.cover h1 { font-size:43px; font-weight:800; color:#1A1A2E; letter-spacing:1px; margin-bottom:6px; }
.cover .t2 { font-size:28px; font-weight:700; color:#006DB6; margin-bottom:10px; }
.cover .t3 { font-size:14.5px; color:#59595B; margin-bottom:28px; }
.coneline { font-size:14px; color:#1A1A2E; line-height:1.6; margin:0 auto 30px; max-width:90%; }
.coneline b { color:#006DB6; }
.cmeta { font-size:12px; color:#59595B; line-height:1.9; margin-top:6px; }
.cmeta b { color:#1A1A2E; }
.cconf { font-size:10px; font-style:italic; color:#59595B; margin-top:16px; }
.cfb-sub { font-size:11.5px; color:#59595B; margin-top:10px; }

/* ---- kpis (top of section 1) ---- */
.kpis { display:flex; gap:14px; margin:8px 0 20px; }
.kpi { flex:1; background:#F6F8FA; border-radius:8px; padding:20px 8px; text-align:center; }
.kpi .n { font-size:29px; font-weight:800; line-height:1.1; }
.kpi .l { font-size:10.5px; color:#59595B; margin-top:6px; line-height:1.4; }

/* ---- section headers (each starts a new page) ---- */
.sech { display:flex; align-items:center; margin:2px 0 16px; break-before:page; break-after:avoid; }
.sech .bar { width:8px; height:34px; border-radius:2px; margin-right:15px; flex:none; }
.sech h2 { font-size:19px; font-weight:800; line-height:1.15; }
h3 { font-size:14.5px; font-weight:800; margin:18px 0 7px; break-after:avoid; }

/* ---- tables ---- */
table { width:100%; border-collapse:collapse; margin:11px 0 13px; font-size:11px; }
th, td { border:1px solid #E3E7EB; padding:8px 11px; text-align:left; vertical-align:top; line-height:1.45; }
th { color:#fff; font-weight:700; font-size:10.5px; }
tbody tr:nth-child(even) { background:#F6F8FA; }
tr { break-inside:avoid; }
thead { break-inside:avoid; display:table-header-group; }
td b { color:#006DB6; }
.r { text-align:right; } .c { text-align:center; }
th.r { text-align:right; } th.c { text-align:center; }

/* ---- callouts ---- */
.callout { background:#F6F8FA; border-left:5px solid #006DB6; border-radius:0 7px 7px 0;
           padding:14px 18px; margin:15px 0; }
.callout h4 { font-size:13.5px; font-weight:800; margin-bottom:5px; }
.callout p { margin-bottom:7px; font-size:12.5px; line-height:1.55; }
.callout p:last-child { margin-bottom:0; }

/* ---- timeline flow ---- */
.flow { display:flex; align-items:stretch; gap:0; margin:14px 0 8px; }
.flow .box { flex:1; background:#F6F8FA; border:1px solid #E3E7EB; border-top:3px solid #006DB6;
             border-radius:5px; padding:11px 10px; text-align:center; }
.flow .box.late { border-top-color:#F67D4B; }
.flow .box .bt { font-weight:700; color:#1A1A2E; font-size:11.5px; display:block; }
.flow .box .bs { font-size:9.6px; color:#59595B; }
.flow .arr { display:flex; align-items:center; color:#006DB6; font-weight:800; font-size:16px; padding:0 9px; }

/* ---- stage cards ---- */
.stage { background:#F6F8FA; border-radius:8px; padding:13px 16px; margin:11px 0; }
.stage .sh { font-size:13.5px; font-weight:800; color:#006DB6; margin-bottom:4px; }
.stage .sh .tag { font-size:10px; font-weight:700; color:#59595B; }
.stage p { margin:0; font-size:12.5px; }
.stage ul { margin:5px 0 0 19px; } .stage li { margin-bottom:4px; font-size:12.5px; line-height:1.5; }

/* ---- program stack ---- */
.stack .band { border-left:6px solid #006DB6; background:#F6F8FA; border-radius:0 7px 7px 0;
               padding:12px 16px; margin-bottom:10px; }
.stack .band .bh { font-weight:800; color:#006DB6; font-size:12.5px; letter-spacing:.4px; }
.stack .band ul { margin:5px 0 0 19px; } .stack .band li { font-size:11.5px; margin-bottom:3px; }

/* ---- not-list ---- */
.notb { background:#F6F8FA; border-left:5px solid #59595B; border-radius:0 7px 7px 0;
        padding:12px 17px; margin:12px 0; break-inside:avoid; }
.notb b { color:#1A1A2E; }

ul.std { margin:4px 0 12px 20px; } ul.std li { margin-bottom:6px; line-height:1.5; }
.hon { font-style:italic; font-size:11.5px; color:#59595B; line-height:1.5; }
.close { background:#006DB6; color:#fff; border-radius:10px; padding:20px 24px; margin:18px 0 6px; }
.close h4 { font-size:15px; font-weight:800; margin-bottom:6px; }
.close p { color:#eaf3fb; font-size:12.5px; margin-bottom:0; line-height:1.55; }
.close.steps { background:#F6F8FA; color:#1A1A2E; }
.close.steps h4 { color:#006DB6; }
.close.steps p { color:#59595B; }
"""

# ================= CONTENT =================
P = []

# ---- COVER ----
P.append(f"""
<div class="cover">
  <div class="cband"></div>
  <img class="logo" src="data:image/png;base64,{light_b64}">
  <div class="crule"></div>
  <h1>DANIELIAN ASSOCIATES</h1>
  <div class="t2">AI Pursuit Intelligence</div>
  <div class="t3">A Business Development Proposal from Technijian</div>
  <div class="coneline">
    Danielian&rsquo;s next pursuit is already visible in public data <b>right now</b> &mdash; a developer
    just recorded a deed; a planning commission posted a multifamily project for entitlement review; a
    national builder filed an early environmental notice in a corridor SB&nbsp;79 just upzoned. None of it
    lands on Deborah&rsquo;s desk until it&rsquo;s an RFQ &mdash; and by then KTGY and AO Architects are already
    on the short list. <b>AI Pursuit Intelligence changes that sequence.</b>
  </div>
  <div class="cmeta">
    <b>Prepared for:</b> Deborah Muro, Director of Business Development &nbsp;&middot;&nbsp;
      Victor Alvarez-Duran, Chief Technology Manager<br>
    <b>Prepared by:</b> Ravi Jain, CEO, Technijian &nbsp;&middot;&nbsp; rjain@technijian.com &nbsp;&middot;&nbsp; June 2026<br>
    Reference: Technijian AI Growth Program &mdash; Danielian Associates
  </div>
  <div class="cband o"></div>
  <div class="cfb-sub">Two firms, one city &mdash; Irvine, California, five minutes apart
    &nbsp;&middot;&nbsp; 949.379.8499 &nbsp;&middot;&nbsp; technijian.com</div>
  <div class="cconf">CONFIDENTIAL &mdash; prepared exclusively for Danielian Associates.</div>
</div>
""")

# ---- 01 ----
P.append(sech("01", "How Danielian Finds Work Today &mdash; and Where the Gaps Are"))
P.append('<div class="kpis">'
         + kpi("3&ndash;12 mo", "Signal arrives before the RFQ", BLUE)
         + kpi("24", "Tier-1 leads in one 75-min run", ORANGE)
         + kpi("7+", "Public-data signal layers", TEAL)
         + kpi("~$10.5K", "90-day pilot (published tier)", DARK)
         + '</div>')
P.append("<p>Danielian wins through relationships, reputation, and responsive pursuit execution. "
         "That model has produced 6,353 projects and 1M+ housing units across 57 years. It is not broken. "
         "But it has a structural blind spot: <b>the signal arrives too late.</b></p>")
P.append('<div class="flow avoid">'
         '<div class="box"><span class="bt">Developer buys land</span>'
         '<span class="bs">public record, day&nbsp;1</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box"><span class="bt">6&ndash;12 months pass</span>'
         '<span class="bs">informal architect talks begin</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box late"><span class="bt">RFQ released</span>'
         '<span class="bs">3&ndash;4 firms pre-positioned</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box late"><span class="bt">Danielian learns of it</span>'
         '<span class="bs">when the call comes in</span></div></div>')
P.append("<p>By the time a formal RFQ lands &mdash; posted to a public bid board for agency work, or simply "
         "arriving as a call or email for a private developer pursuit (where there is no public posting at all) "
         "&mdash; two things are already true: the developer has had informal architect conversations, and three "
         "or four firms with standing relationships are already positioned. The pursuit is still winnable &mdash; "
         "but it&rsquo;s uphill. The firm that knew six months earlier, when the land recorded and the entitlement "
         "clock started, got the first call.</p>")
P.append(sub("What Deborah&rsquo;s team is doing manually today (estimated; confirm at discovery)"))
P.append('<ul class="std">'
         '<li>Monitoring a handful of developer websites and LinkedIn feeds</li>'
         '<li>Watching for RFQ postings on PlanetBids, eBidUSA, or direct developer emails</li>'
         '<li>Keeping tabs on a network of referrals and broker relationships</li>'
         '<li>Attending events and reading AEC trade coverage for deal announcements</li></ul>')
P.append("<p>This is not a failure of effort. It&rsquo;s a <b>coverage problem</b>: the signal universe is orders "
         "of magnitude larger than any team can monitor manually. Building-permit and entitlement data is spread "
         "across California&rsquo;s 58 counties and their hundreds of cities, each with its own portal. Dozens of "
         "OC-area planning commissions post project agendas weekly. CA HCD tracks density-bonus and builder-remedy "
         "applications. County recorders log every land transfer. National builders file early environmental notices "
         "months before a design team is announced. No BD team reads all of it. An AI system can.</p>")

# ---- 02 ----
P.append(sech("02", "What AI Pursuit Intelligence Delivers"))
P.append("<p><b>AI Pursuit Intelligence</b> is a multi-agent, multi-source monitoring system configured "
         "specifically around Danielian&rsquo;s buyer universe and service lines. It is not a contact list. It is "
         "not email blasting. It is not Apollo or ZoomInfo. It works in four stages.</p>")
P.append('<div class="stage"><div class="sh">Stage 1 &mdash; Harvest <span class="tag">(continuous, automated)</span></div>'
         '<p>Seven or more data layers are monitored in near-real-time:</p></div>')
P.append(table(
    ["Signal Layer", "What It Surfaces", "Why It Matters for Danielian"],
    [["<b>Building permit filings</b>", "Multifamily, BTR, ADU-batch, and mixed-use permits across OC, LA, and Nashville jurisdictions",
      "Project in permit = an architect is already selected; the gap to close is the pre-permit entitlement stage"],
     ["<b>Planning commission &amp; DRB agendas</b>", "Projects moving through entitlement approval (weekly postings from 10+ jurisdictions)",
      "Entitlement approval = design-team selection within 90&ndash;180 days; Danielian can be in the room <i>now</i>"],
     ["<b>CEQA / EIR filings</b>", "Environmental notices for large residential and mixed-use projects",
      "Big projects file early; an EIR is a 12&ndash;18 month signal <i>before</i> the RFQ"],
     ["<b>County recorder &mdash; land transfers</b>", "Deed records: developer names, parcel size, acquisition price",
      "Developer just bought land = site feasibility + architect selection is imminent"],
     ["<b>CA HCD filings</b>", "Density-bonus applications, builder-remedy projects, affordable-housing pipeline",
      "Directly in Danielian&rsquo;s product lines; many are not widely publicized"],
     ["<b>SB 79 / ADU / middle-housing triggers</b>", "Transit-adjacent parcels newly upzoned (SB 79, eff. 7/1/2026); 8-ADU-per-lot projects (SB 1211)",
      "New legislation creates new project types in Danielian&rsquo;s core categories"],
     ["<b>Developer &amp; national-builder news</b>", "PR, permit filings, and announcements from national/regional CA builders (D.R. Horton, Lennar, Toll Brothers, Tri Pointe, Taylor Morrison, Brookfield)",
      "National builders announce communities months before architect selection; local developers signal through PR"]],
    aligns=["l", "l", "l"]))
P.append('<div class="stage"><div class="sh">Stage 2 &mdash; Enrich <span class="tag">(AI-powered, per signal)</span></div>'
         '<ul><li>Developer / owner identity (if not in the record)</li>'
         '<li>Project-type classification (multifamily / BTR / ADU / affordable / mixed-use / SFR)</li>'
         '<li>Jurisdiction and entitlement pathway; estimated project size and timeline</li>'
         '<li>Danielian&rsquo;s past work in that jurisdiction or with that developer (cross-referenced vs. the 6,353-project archive)</li>'
         '<li>Existing-relationship flag: &ldquo;Danielian has done 3 projects with this developer&rdquo; vs. &ldquo;first contact&rdquo;</li></ul></div>')
P.append('<div class="stage"><div class="sh">Stage 3 &mdash; Score <span class="tag">(prioritized by Danielian criteria)</span></div>'
         '<ul><li><b>Fit</b> &mdash; does the project type match Danielian&rsquo;s core lines?</li>'
         '<li><b>Relationship</b> &mdash; existing connection to this developer, landowner, or municipality?</li>'
         '<li><b>Timing</b> &mdash; is it at a stage where outreach lands (pre-RFQ, not post-award)?</li>'
         '<li><b>Market</b> &mdash; active Danielian geography (OC, LA, Nashville, or an expansion target)?</li></ul>'
         '<p style="margin-top:4px;">Output: a prioritized <b>Tier-1 pursuit list</b> &mdash; not a raw dump of 500 records, '
         'but a curated set of 20&ndash;40 high-fit opportunities with full context.</p></div>')
P.append('<div class="stage"><div class="sh">Stage 4 &mdash; Deliver <span class="tag">(weekly brief to Deborah&rsquo;s team)</span></div>'
         '<ul><li><b>New Tier-1 signals</b> &mdash; projects that just hit the radar and match Danielian&rsquo;s criteria</li>'
         '<li><b>Account dossiers</b> &mdash; per signal, a pre-meeting brief on the developer (pipeline, past architect partners, decision-makers)</li>'
         '<li><b>Existing-relationship triggers</b> &mdash; &ldquo;XYZ Developer, who you worked with in Irvine in 2019, just recorded a deed in Torrance &mdash; worth a call&rdquo;</li>'
         '<li><b>Legislative / market triggers</b> &mdash; &ldquo;SB 79 created 12 new density-eligible parcels in the Metro Rail corridor this week &mdash; here are the owners&rdquo;</li></ul></div>')

# ---- 03 ----
P.append(sech("03", "Why This Is Fundamentally Different from Current Outreach"))
P.append("<p>Most &ldquo;lead generation&rdquo; services for professional-services firms fall into one of two "
         "traps. This is neither.</p>")
P.append(table(
    ["What Most Firms Use", "The Problem", "What AI Pursuit Intelligence Is Instead"],
    [["<b>Apollo / ZoomInfo</b>", "Cold contact lists; generic demographic filtering; no signal about why-now or what-project; the same list every competitor buys",
      "Real-time public-data signals tied to <i>specific projects and events</i> &mdash; not demographic profiles"],
     ["<b>Email-blast campaigns</b>", "A volume play that commoditizes Danielian alongside every other firm in the inbox",
      "Project-specific, relationship-informed outreach tied to a concrete trigger"],
     ["<b>Manual BD monitoring</b>", "Throttled by what one or two people can physically watch; misses most of the signal universe",
      "Automated coverage of the full public-data footprint across every relevant jurisdiction, 24/7"],
     ["<b>Reactive RFQ response</b>", "Danielian learns about the project when competitors may already be pre-positioned",
      "Signals arrive 3&ndash;12 months <i>before</i> the RFQ, when Danielian can still shape the conversation"],
     ["<b>Referral / relationship only</b>", "High-quality but supply-constrained; relies on the network to surface the opportunity",
      "Complements the network &mdash; Danielian still wins through relationships; the AI surfaces the right moments to activate them"]],
    aligns=["l", "l", "l"]))
P.append(callout("The critical distinction: this is not a cold-list play. It is a timing play.",
    "Danielian already has the relationships. The product of 57 years is not just 6,353 projects &mdash; it&rsquo;s a "
    "network of developers, homebuilders, planners, and municipalities who already know the Danielian name. AI "
    "Pursuit Intelligence tells Danielian <i>when</i> those relationships should be activated, and surfaces <i>new</i> "
    "ones to build before the competition does. A developer Danielian has never met just recorded 14 acres in an SB 79 "
    "transit corridor. They are about to need an architect who knows multifamily and density-bonus design. Danielian can "
    "be in that conversation in week two &mdash; or wait for the RFQ in month eight.", ORANGE))

# ---- 04 ----
P.append(sech("04", "Why Now &mdash; the 2026 Context Makes This Urgent"))
P.append("<p>Three factors are compressing the window simultaneously.</p>")
P.append(sub("1. California housing legislation is generating new projects in Danielian&rsquo;s exact categories"))
P.append('<ul class="std">'
         '<li><b>SB 79 (effective July 1, 2026):</b> transit-corridor upzoning creates new multifamily and mixed-use '
         'feasibility on previously constrained parcels. Developers are running pencil-outs <i>right now</i>; architect '
         'selection follows 90&ndash;180 days later.</li>'
         '<li><b>SB 1211:</b> up to 8 detached ADUs per multifamily lot &mdash; a new product-type calculation for every '
         'existing multifamily developer relationship Danielian has.</li>'
         '<li><b>ADU streamlining + SB 9 expansion:</b> continued volume of ADU and middle-housing work in Danielian&rsquo;s '
         'pipeline territories.</li></ul>')
P.append("<p>The firms in the room when developers are figuring out SB 79 feasibility will be on the short list when "
         "the project is greenlit. That entry window is open <i>now</i>, for roughly six to nine months.</p>")
P.append(sub("2. The AEC market is bifurcating between AI-ready and AI-behind firms"))
P.append("<p>Per the 2025 Deltek Clarity survey: 53% of A&amp;E firms use AI and 94% plan to increase usage, but only "
         "~20% feel &ldquo;highly prepared&rdquo; &mdash; a 55-point readiness gap. The firms that close it in 2026 will "
         "operate faster, win more pursuits, and present smarter to developers. The firms that wait will feel the "
         "pressure in 2027.</p>")
P.append(sub("3. Danielian&rsquo;s largest competitors have the scale to move first"))
P.append("<p>KTGY and AO Architects are larger, well-resourced firms with strong digital presences &mdash; the kind "
         "most able to invest in AI ahead of smaller peers. The window where AI-augmented BD is a differentiator, not a "
         "table stake, is measured in months, not years. Danielian&rsquo;s countervailing advantage: it can move faster and "
         "more decisively than a large firm&rsquo;s committee.</p>")

# ---- 05 ----
P.append(sech("05", "Proof &mdash; Already Running in Danielian&rsquo;s Market"))
P.append("<p>This is not a theoretical system. A near-identical pursuit-intelligence build is already live for a "
         "<b>luxury custom-home builder in Orange County</b>.</p>")
P.append(table(
    ["Element", "Detail (anonymized; scope + effort only)"],
    [["Client", "Luxury custom-home builder, Orange County coastal market"],
     ["Problem", "15&ndash;20 hours per week of manual portal-reading across permit databases, HOA ARC committee agendas, story-pole filings, and just-sold records"],
     ["Solution", "Multi-agent pipeline: 7 signal layers, 10 permit jurisdictions, 60+ HOA ARC committees"],
     ["Result on day one", "<b>24 enriched Tier-1 leads in a single 75-minute run</b> &mdash; replacing the week&rsquo;s manual work"],
     ["Signal sources", "County permit portals, city building departments, HOA ARC agendas, county recorder (just-sold), story-pole filings, coastal-commission filings"]],
    aligns=["l", "l"]))
P.append("<p>This is <b>the same terrain Danielian&rsquo;s developer universe moves through</b>. The permit portals "
         "are the same. The planning-commission agendas are the same jurisdictions. The county recorder is the same. "
         "The signal logic translates directly &mdash; from the builder looking for replacement/remodel homeowners to "
         "the architecture firm looking for developers with active projects.</p>")
P.append(sub("The adaptation for Danielian", TEAL))
P.append('<ul class="std">'
         '<li>Buyer type shifts from homeowner-prospect to developer / builder / municipality</li>'
         '<li>Signal focus shifts from residential story-poles and HOA ARCs to multifamily entitlement filings, CEQA notices, and density-bonus applications</li>'
         '<li>Enrichment adds relationship cross-reference against Danielian&rsquo;s 6,353-project archive, developer profiling, decision-maker research</li>'
         '<li>Scoring adds Danielian&rsquo;s specific pursuit criteria (project type, geography, relationship history)</li></ul>')
P.append('<p class="hon">Same engine. Same public-data foundation. Danielian-specific configuration.</p>')

# ---- 06 ----
P.append(sech("06", "What Deborah Muro&rsquo;s Team Gets, Day to Day"))
P.append(table(
    ["Before", "After"],
    [["Monday: check public bid boards and inbound RFQs", "Monday: open the <b>weekly Pursuit Intelligence Brief</b> &mdash; 20&ndash;40 scored, enriched opportunities with context"],
     ["Weekly: scan a handful of developer sites and LinkedIn feeds", "Per brief: review Tier-1 signals &mdash; new projects that just became visible"],
     ["As it comes: track referrals and inbound calls", "Per dossier: developer background, decision-makers, and Danielian&rsquo;s prior history with them"],
     ["Quarterly: review pipeline; identify coverage gaps", "Per trigger: a flag when a dormant relationship has a live project &mdash; a warm call, not a cold one"],
     ["Ongoing: react to whatever the market surfaces", "Quarterly: pipeline metrics in EOS Scorecard format &mdash; new signals, contacts, pursuits, win rate"]],
    aligns=["l", "l"]))
P.append("<p>The team does not search. The team <b>receives</b>. They spend their time on the call, the "
         "relationship, the proposal &mdash; not on reading planning-commission PDFs.</p>")
P.append(callout("Victor Alvarez-Duran&rsquo;s read (governance)",
    ["A governed, auditable AI pipeline with clear data sources, no hallucinated contacts, and documented enrichment logic.",
     "No vendor lock-in to a data broker &mdash; built on public data and Technijian&rsquo;s proprietary multi-agent pipeline; pluggable into whatever CRM or pursuit-tracking tool Danielian uses (or a lightweight system if none exists). The firm&rsquo;s 6,353-project archive becomes the relationship-history backbone."], TEAL))
P.append(callout("John Danielian&rsquo;s read (EOS)",
    ["One EOS Rock: &ldquo;Q3 Rock &mdash; Pursuit Intelligence Pilot: establish 40 Tier-1 accounts by July 31, score them, contact 20 before Q3 ends.&rdquo;",
     "Scorecard metric: <b>hours-to-first-contact</b> (from project signal to Deborah&rsquo;s outreach), tracked weekly. A measurable, accountable investment &mdash; not a vague &ldquo;digital transformation.&rdquo;"], BLUE))

# ---- 07 ----
P.append(sech("07", "What This Is Not", GREY))
P.append('<div class="notb"><b>This is not cold-list blasting.</b> Every outreach Deborah makes is triggered by a '
         'specific project signal with context. &ldquo;We noticed your entitlement application in the Santa Ana planning '
         'commission&rdquo; is not a cold email &mdash; it&rsquo;s a warm, informed opening.</div>')
P.append('<div class="notb"><b>This is not &ldquo;AI will find you new clients by itself.&rdquo;</b> The AI surfaces the '
         'signal and the context. The relationship is still built by Deborah&rsquo;s team. The architecture is still '
         'designed by Danielian&rsquo;s architects. The win is still earned through craft, reputation, and proposal quality.</div>')
P.append('<div class="notb"><b>This is not replacing the referral network.</b> Referrals from builders and developers '
         'who already know Danielian are the highest-value signal. This system supplements them with systematic coverage '
         'of the market the referral network doesn&rsquo;t reach.</div>')
P.append('<div class="notb"><b>This is not demographic data brokering.</b> No purchased lists. No cold-contact databases. '
         'Every signal originates in public records &mdash; the same records Danielian could theoretically check manually, at a '
         'scale and speed no manual process can match.</div>')

# ---- 08 ----
P.append(sech("08", "Investment &amp; ROI Framework"))
P.append(sub("Entry Scope (Pursuit Intelligence Pilot)"))
P.append(table(
    ["Component", "Description"],
    [["<b>Signal architecture build</b>", "5&ndash;7 data layers configured for Danielian&rsquo;s buyer universe (multifamily, BTR, ADU, affordable, SFR) across OC + LA jurisdictions"],
     ["<b>Enrichment &amp; scoring layer</b>", "Developer profiling, Danielian-relationship cross-reference, project-type + timing scoring"],
     ["<b>Weekly Pursuit Intelligence Brief</b>", "Formatted weekly delivery to Deborah&rsquo;s team; EOS-ready KPI format"],
     ["<b>Pilot period</b>", "90-day pilot; weekly signal briefs + monthly review"]],
    aligns=["l", "l"]))
P.append("<p>The pilot runs on <b>My AI Lead Gen&rsquo;s published service tiers</b> &mdash; no invented pricing:</p>")
P.append(table(
    ["My AI Lead Gen Tier", "Monthly", "Scope"],
    [["Starter", "$1,499/mo", "1 vertical &middot; 500 leads/mo"],
     ["<b>Professional</b> (the fit for Danielian)", "<b>$3,499/mo</b>", "3 verticals &middot; daily runs &middot; 2,500 leads/mo"],
     ["Enterprise", "$6,999/mo", "Unlimited verticals &middot; 10K+ leads/mo"]],
    aligns=["l", "r", "l"]))
P.append("<p>Danielian&rsquo;s buyer universe spans several &ldquo;verticals&rdquo; (multifamily, BTR, ADU, affordable, "
         "mixed-use), which maps to the <b>Professional tier ($3,499/mo)</b> &mdash; about <b>$10,500 for the 90-day "
         "pilot</b> &mdash; plus a one-time signal-architecture configuration for Danielian&rsquo;s specific jurisdictions and "
         "6,353-project relationship cross-reference (scoped at the discovery quote). Any annual-commitment discount, and "
         "the Phase 2 expansion (Nashville + full national-builder coverage), are confirmed at scoping.</p>")
P.append(sub("ROI Framework (model with Danielian data at discovery)", ORANGE))
P.append("<p><b>Input variables</b> to confirm with Deborah / Jeff Schmehr: average project fee (likely $200K&ndash;$1M+ "
         "for multifamily/BTR); current annual pursuit win rate (typical AEC 25&ndash;40%); average hours-to-proposal "
         "(typically 40&ndash;120 hrs); number of pursuits tracked actively.</p>")
P.append(table(
    ["Illustrative model (rebuilt with Danielian&rsquo;s actual figures at discovery)", "Value"],
    [["Additional qualified pursuits surfaced per quarter (conservative vs. the 24-lead OC run)", "3 / quarter"],
     ["Danielian win rate assumed on the new signals", "1 of 3 (33%)"],
     ["Average project fee assumed (conservative OC/LA multifamily)", "$350,000"],
     ["<b>Result &mdash; 1 added win per quarter &times; 4 &times; $350K</b>", "<b>~$1.4M / yr incremental</b>"]],
    aligns=["l", "r"]))
P.append("<p>Against a ~$10,500 pilot investment, the break-even is a fraction of a single additional win. The metric "
         "that makes this undeniable to Jeff Schmehr: <b>what is one earlier-stage pursuit worth to Danielian?</b></p>")
P.append(callout("Efficiency model (hours recovered)",
    "If Deborah&rsquo;s team spends even 5 hours/week on manual signal monitoring (conservative), that&rsquo;s 260 hours "
    "per year of BD research time. AI Pursuit Intelligence reduces that to review time (30&ndash;60 minutes per week to "
    "read the brief) &mdash; <b>~230 hours/year recovered</b>, redirected from portal-reading toward relationships and "
    "proposal quality.", TEAL))

# ---- 09 ----
P.append(sech("09", "Relationship to the Broader AI Growth Program"))
P.append("<p>AI Pursuit Intelligence is one module within a larger picture &mdash; not the full Technijian program for "
         "Danielian. Here is how it fits.</p>")
P.append('<div class="stack avoid">'
         '<div class="band" style="border-color:'+ORANGE+'"><span class="bh" style="color:'+ORANGE+'">ENTRY PLAY (now)</span>'
         '<ul><li>AI Workshop / Readiness (as an EOS Rock) &mdash; $5K one-time</li>'
         '<li>Fractional AI Advisor (program governance) &mdash; ~$24K/yr</li>'
         '<li>AEO Authority Content (named-developer audience) &mdash; ~$12K/yr</li></ul></div>'
         '<div class="band"><span class="bh">PURSUIT ENGINE (next: AI Pursuit Intelligence)</span>'
         '<ul><li>Signal architecture + enrichment build (this proposal)</li>'
         '<li>Weekly Pursuit Intelligence Brief</li><li>EOS Scorecard integration (pursuit KPIs)</li></ul></div>'
         '<div class="band" style="border-color:'+TEAL+'"><span class="bh" style="color:'+TEAL+'">INSTITUTIONAL KNOWLEDGE (expansion)</span>'
         '<ul><li>6,353-project knowledge graph (Weaviate + My AI)</li>'
         '<li>Entitlement / code research assistant</li><li>Proposal / SOQ automation (days &rarr; hours)</li></ul></div>'
         '<div class="band" style="border-color:'+DARK+'"><span class="bh" style="color:'+DARK+'">FOUNDATION</span>'
         '<ul><li>Secure IT + M365 + AI governance across 3 offices (My IT / My Compliance)</li></ul></div></div>')
P.append('<p class="hon">Entry-program figures are planning estimates carried from the Danielian AI Growth Report; My SEO '
         'bills at published rates, while the AI Workshop, Fractional AI Advisor, and build line items are confirmed at '
         'quote. The only committed scope in this proposal is the Pursuit Intelligence pilot priced in Section 8.</p>')
P.append("<p>The Pursuit Intelligence build runs standalone as a pilot &mdash; it does not require the full program. But "
         "it compounds when the institutional knowledge graph is built (the relationship cross-reference gets richer as "
         "more of Danielian&rsquo;s archive is indexed) and when proposal automation is live (surfaced leads flow directly into "
         "accelerated proposal assembly).</p>")

# ---- 10 ----
P.append(sech("10", "Why Technijian, Why Now"))
P.append(callout("1. We have already built this in Danielian&rsquo;s market.",
    "The OC luxury-homebuilder system in Section 5 uses the same data sources &mdash; OC county permit portal, city "
    "planning portals, county recorder, HOA ARC agendas &mdash; relevant to Danielian&rsquo;s developer universe. We are not "
    "proposing a new capability; we are proposing to redirect a proven system toward Danielian&rsquo;s buyer personas.", BLUE))
P.append(callout("2. The SB 79 window is time-bounded.",
    "SB 79&rsquo;s transit-corridor upzoning becomes effective July 1, 2026. Developers are running feasibility on newly "
    "upzoned parcels now, in spring and early summer 2026. Architect conversations follow 90&ndash;180 days later &mdash; "
    "putting the opportunity squarely in Q3&ndash;Q4 2026. A system built in July captures the wave; a system built in "
    "October misses most of it.", ORANGE))
P.append("<p>Deborah Muro&rsquo;s team is the right team to activate this. Danielian already has the relationships, the "
         "portfolio, and the reputation. The only gap is the systematic intelligence layer that tells those relationships "
         "<i>when</i> to call &mdash; and introduces the new ones before the RFQ.</p>")

# ---- 11 ----
P.append(sech("11", "Proposed Next Steps"))
P.append(table(
    ["Step", "What Happens"],
    [["<b>1. Discovery call</b> (30&ndash;45 min)", "Deborah + Victor (optional Jeff). Confirm pursuit pipeline size and win rate; existing tech stack (CRM, pursuit tracking, any AI in pilot); target developer list; Q3 2026 geographies and project-type priorities; EOS Rock timing."],
     ["<b>2. Signal-architecture scoping</b> (1 week)", "Technijian maps the specific signal sources, jurisdictions, and enrichment logic for Danielian&rsquo;s exact buyer universe. Output: a one-page architecture doc and pilot scope with fixed investment."],
     ["<b>3. 90-day pilot</b>", "Weeks 1&ndash;2: build + test harvest + enrichment. Week 3: first Pursuit Intelligence Brief delivered. Weeks 4&ndash;12: weekly briefs, scoring tuned, EOS Scorecard set up. End: review vs. baseline (signals surfaced, contacts made, pursuits entered, hours recovered)."],
     ["<b>4. Full-market expansion</b>", "Extend to Nashville, layer in national-builder pipeline monitoring, connect to the institutional knowledge graph as it is built."]],
    aligns=["l", "l"]))
P.append('<div class="close"><h4>The first move is a 30-minute discovery call.</h4>'
         '<p>Confirm the numbers, name the crown-jewel developer relationships that seed the intelligence system, and '
         'lock the Q3 EOS Rock &mdash; so the first Pursuit Intelligence Brief is on Deborah&rsquo;s desk inside three '
         'weeks, while the SB 79 window is still wide open.</p></div>')

# ---- Appendix ----
P.append(sech("Appendix", "Key Contacts at Danielian Associates", GREY))
P.append(table(
    ["Name", "Title", "Role in this engagement"],
    [["Deborah Muro", "Director of Business Development", "Primary champion; weekly-brief owner; pursuit activation"],
     ["Victor Alvarez-Duran", "Chief Technology Manager", "Technical champion; system governance; integration"],
     ["Jeff Schmehr", "CFO", "ROI gate; Scorecard accountability"],
     ["John Danielian", "President", "Approval; EOS Rock sign-off"]],
    aligns=["l", "l", "l"]))
P.append('<p class="hon" style="margin-top:10px;">Technijian &middot; Managed IT, Cybersecurity &amp; AI Solutions &middot; '
         '18 Technology Dr., Ste 141, Irvine, CA 92618 &middot; technijian.com &middot; rjain@technijian.com<br>'
         'This proposal is confidential and prepared exclusively for Danielian Associates.</p>')

HTML = ("<!DOCTYPE html><html><head><meta charset='utf-8'><style>" + CSS +
        "</style></head><body>" + "".join(P) + "</body></html>")

# ---------- running header / footer ----------
HEADER = (f'<div style="font-family:Arial,sans-serif;width:100%;box-sizing:border-box;'
          f'padding:0 1in;display:flex;align-items:flex-end;justify-content:space-between;">'
          f'<img src="data:image/png;base64,{light_b64}" style="height:28px">'
          f'<div style="flex:1;margin-left:18px;border-bottom:2px solid #006DB6;'
          f'text-align:right;padding-bottom:3px;">'
          f'<span style="font-size:8.5px;color:#59595B;letter-spacing:.6px;">'
          f'AI Pursuit Intelligence &nbsp;&middot;&nbsp; Danielian Associates</span></div></div>')
FOOTER = ('<div style="font-family:Arial,sans-serif;width:100%;box-sizing:border-box;'
          'padding:0 1in;font-size:8px;color:#59595B;text-align:center;">'
          'Technijian &nbsp;|&nbsp; 18 Technology Dr., Ste 141, Irvine, CA 92618 &nbsp;|&nbsp; '
          '949.379.8499 &nbsp;|&nbsp; technijian.com &nbsp;|&nbsp; CONFIDENTIAL &nbsp;|&nbsp; '
          'Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>')

with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page()
    pg.set_content(HTML, wait_until="networkidle")
    pg.wait_for_timeout(700)
    pg.pdf(path=OUT, format="Letter", print_background=True,
           display_header_footer=True, header_template=HEADER, footer_template=FOOTER,
           margin={"top": "1.0in", "bottom": "0.85in", "left": "1.0in", "right": "1.0in"})
    b.close()

# ---------- rasterize every page for proofread ----------
import fitz
doc = fitz.open(OUT)
n = doc.page_count
print("PAGES:", n, "| size_kb:", round(os.path.getsize(OUT) / 1024))
for i, page in enumerate(doc):
    page.get_pixmap(dpi=120).save(os.path.join(HERE, f"_proof_p{i+1:02d}.png"))
doc.close()
print("Proof PNGs written:", n)
