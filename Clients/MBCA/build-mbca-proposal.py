# -*- coding: utf-8 -*-
"""MBC Aquatic Sciences - AI Pursuit Intelligence: A Business Development Proposal.
Self-contained HTML -> branded multi-page Letter PDF (Playwright/Chromium).

Parallel to the Danielian (DAS) AI Pursuit Intelligence proposal, adapted to MBC's
environmental-science consulting business: signals = agency CIPs, CEQA/NEPA notices,
NPDES / CWA Section 316(b) permit cycles, federal forecasts, on-call solicitations,
prime/A-E teaming. Grounded in Clients/MBCA/_research.md (8 buyer segments, real clients).

Airy AI-Growth-Report format (1in margins, section-per-page, large legible header logo).
LOGO: AUTHENTIC assets/Technijian Logo 2.png (NOT the assets/logos/png/* AI fakes).
NAMING: uses the real brand "MBC Aquatic Sciences" / "MBC" - never the internal code "MBCA".
PRICING: published My AI Lead Gen tiers only (no invented numbers).
"""
import os, base64
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
LOGO_LIGHT = os.path.join(ROOT, "assets", "Technijian Logo 2.png")  # authentic, light bg
light_b64 = base64.b64encode(open(LOGO_LIGHT, "rb").read()).decode()
OUT = os.path.join(HERE, "MBC-AI-Pursuit-Intelligence-Proposal.pdf")

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

# ---------- CSS (airy AI-Growth-Report format) ----------
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
"""

# ================= CONTENT =================
P = []

# ---- COVER ----
P.append(f"""
<div class="cover">
  <div class="cband"></div>
  <img class="logo" src="data:image/png;base64,{light_b64}">
  <div class="crule"></div>
  <h1>MBC AQUATIC SCIENCES</h1>
  <div class="t2">AI Pursuit Intelligence</div>
  <div class="t3">A Business Development Proposal from Technijian</div>
  <div class="coneline">
    MBC&rsquo;s next pursuit is already visible in public data <b>right now</b> &mdash; a water district just
    funded a capital project in its CIP; a port commission posted a dredging project for environmental review;
    a coastal power station&rsquo;s NPDES permit just entered its renewal cycle. None of it reaches MBC until the
    RFP or on-call solicitation posts &mdash; and by then every qualified competitor sees the same notice at the
    same moment. <b>AI Pursuit Intelligence changes that sequence.</b>
  </div>
  <div class="cmeta">
    <b>Prepared for:</b> Shane Beck, President &amp; Principal Scientist, MBC Aquatic Sciences<br>
    <b>Prepared by:</b> Ravi Jain, CEO, Technijian &nbsp;&middot;&nbsp; rjain@technijian.com &nbsp;&middot;&nbsp; June 2026<br>
    Reference: Technijian AI Growth Program &mdash; MBC Aquatic Sciences
  </div>
  <div class="cband o"></div>
  <div class="cfb-sub">Local partners in Orange County &mdash; MBC in Costa Mesa, Technijian in Irvine
    &nbsp;&middot;&nbsp; 949.379.8499 &nbsp;&middot;&nbsp; technijian.com</div>
  <div class="cconf">CONFIDENTIAL &mdash; prepared exclusively for MBC Aquatic Sciences.</div>
</div>
""")

# ---- 01 ----
P.append(sech("01", "How MBC Wins Work Today &mdash; and Where the Signal Arrives Too Late"))
P.append('<div class="kpis">'
         + kpi("3&ndash;12 mo", "Lead time before the solicitation", BLUE)
         + kpi("8", "Public-data signal layers", ORANGE)
         + kpi("24", "Tier-1 leads in one 75-min run", TEAL)
         + kpi("~$10.5K", "90-day pilot (published tier)", DARK)
         + '</div>')
P.append("<p>MBC has spent 57 years building one of the most defensible aquatic-science practices on the "
         "California coast &mdash; 600+ major reports, a 30-year continuous monitoring record at El Segundo, an "
         "in-house EPA toxicity lab, and the firm that pioneered eelgrass restoration in California. Work comes the "
         "way it should for a specialist of this caliber: qualifications-based selection, on-call master agreements, "
         "repeat agency relationships, and prime / A-E teaming. That model is not broken. But it has a structural "
         "blind spot: <b>the signal arrives too late.</b></p>")
P.append('<div class="flow avoid">'
         '<div class="box"><span class="bt">Agency funds a project</span>'
         '<span class="bs">CIP / budget, day&nbsp;1</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box"><span class="bt">6&ndash;18 months pass</span>'
         '<span class="bs">CEQA notice / permit cycle</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box late"><span class="bt">Solicitation posts</span>'
         '<span class="bs">RFP or on-call, public portal</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box late"><span class="bt">MBC sees it</span>'
         '<span class="bs">same moment as every rival</span></div></div>')
P.append("<p>By the time an on-call solicitation or project RFP posts to PlanetBids or an agency portal, two things "
         "are already true: the agency&rsquo;s project manager has often already formed a shortlist of firms they "
         "know, and every qualified competitor &mdash; Tenera, Merkel, Miller, and the big primes &mdash; sees the "
         "same notice at the same moment. The pursuit is still winnable, but it&rsquo;s a scramble. The firm that knew "
         "nine months earlier &mdash; when the district funded the project in its capital plan, or the power "
         "station&rsquo;s NPDES renewal clock started &mdash; got the early conversation that shapes the scope.</p>")
P.append(sub("What MBC&rsquo;s team watches manually today (estimated; confirm at discovery)"))
P.append('<ul class="std">'
         '<li>PlanetBids / BidNet and a few agency portals for on-call and project solicitations</li>'
         '<li>A handful of city-council, water-board, and port-commission agendas</li>'
         '<li>Known primes&rsquo; pursuits, surfaced through the teaming network</li>'
         '<li>Word-of-mouth from long-standing agency and utility relationships</li></ul>')
P.append("<p>This is not a failure of effort &mdash; it is a <b>coverage problem</b>. The signal universe is "
         "enormous: every coastal water and sanitation district, port, harbor, and power facility from San Diego to "
         "Ventura publishes capital plans, board agendas, CEQA notices, and permit calendars on its own portal, on its "
         "own schedule. No principal scientist can read all of it &mdash; and the hours they spend trying are hours off "
         "billable science. An AI system can read all of it, every day.</p>")

# ---- 02 ----
P.append(sech("02", "What AI Pursuit Intelligence Delivers"))
P.append("<p><b>AI Pursuit Intelligence</b> is a multi-agent, multi-source monitoring system configured around "
         "MBC&rsquo;s named-account universe and service lines &mdash; power and wastewater dischargers, ports, "
         "desalination developers, water districts, federal agencies, and the primes MBC teams with. It is not a "
         "generic bid-alert service. It is not a cold contact list. It works in four stages.</p>")
P.append('<div class="stage"><div class="sh">Stage 1 &mdash; Harvest <span class="tag">(continuous, automated)</span></div>'
         '<p>Eight data layers are monitored in near-real-time:</p></div>')
P.append(table(
    ["Signal Layer", "What It Surfaces", "Why It Matters for MBC"],
    [["<b>Agency Capital Improvement Programs (CIP) &amp; budgets</b>", "Multi-year capital plans from water / sanitation districts, ports, and cities naming funded projects",
      "A funded capital project = environmental documentation is coming; the earliest signal of all, often 12&ndash;24 months before the consultant solicitation"],
     ["<b>CEQA / NEPA notices</b>", "Notices of Preparation, scoping notices, and EIR / EIS filings for coastal, port, water, and energy projects",
      "A Notice of Preparation means an environmental consultant is needed; the marine / biology sub-scope follows close behind"],
     ["<b>NPDES &amp; CWA &sect;316(b) permit cycles</b>", "Renewal calendars for coastal power, wastewater, and desalination dischargers (5-year cycles)",
      "MBC&rsquo;s core recurring work &mdash; entrainment / impingement and long-term monitoring; the renewal date is predictable years out"],
     ["<b>Board, commission &amp; district agendas</b>", "Weekly agendas from city councils, water boards, and port &amp; harbor commissions",
      "Project approvals trigger marine / aquatic review within months; MBC can be known to the agency before the solicitation"],
     ["<b>Federal procurement forecasts</b>", "SAM.gov and USACE / Navy / USCG advance procurement forecasts",
      "Federal marine / environmental task orders are forecast months ahead; MBC&rsquo;s USACE / USCG / Camp Pendleton record is the door"],
     ["<b>On-call &amp; master-agreement solicitations</b>", "QBS on-call cycles on PlanetBids, BidNet, and agency portals",
      "The contracts that ARE MBC&rsquo;s backbone &mdash; surface every cycle as it opens, and flag the renewals before they lapse"],
     ["<b>Infrastructure &amp; water funding triggers</b>", "IIJA, state water &amp; climate bonds, and desalination / water-reliability initiatives",
      "Funded programs convert into an environmental-work pipeline; following the money predicts the pursuits"],
     ["<b>Prime / A-E teaming signals</b>", "Large infrastructure pursuits where MBC is the marine / aquatic sub (AECOM, Dudek, ICF, Moffatt &amp; Nichol&hellip;)",
      "MBC&rsquo;s highest-velocity channel; surface the prime&rsquo;s pursuit early so MBC is on the team before the scope is locked"]],
    aligns=["l", "l", "l"]))
P.append('<div class="stage"><div class="sh">Stage 2 &mdash; Enrich <span class="tag">(AI-powered, per signal)</span></div>'
         '<ul><li>Agency / owner identity, project type (CEQA / &sect;316(b) / NPDES / dredging / desalination / restoration), and lead agency</li>'
         '<li>MBC&rsquo;s prior work with that agency or at that site (cross-referenced against 57 years of projects &mdash; the incumbency flag)</li>'
         '<li>Estimated scope, timeline, and likely procurement path (QBS on-call vs. project RFP vs. prime sub)</li>'
         '<li>Relationship flag: &ldquo;MBC has monitored this station for 30 years&rdquo; vs. &ldquo;new agency &mdash; no prior MBC relationship&rdquo;</li></ul></div>')
P.append('<div class="stage"><div class="sh">Stage 3 &mdash; Score <span class="tag">(prioritized by MBC criteria)</span></div>'
         '<ul><li><b>Fit</b> &mdash; does it match MBC&rsquo;s service lines (marine / &sect;316(b) / toxicity / eelgrass / dredging / CEQA)?</li>'
         '<li><b>Relationship / incumbency</b> &mdash; does MBC already know this agency, site, or prime?</li>'
         '<li><b>Timing</b> &mdash; is it early enough to position before the solicitation posts?</li>'
         '<li><b>Segment</b> &mdash; which of MBC&rsquo;s buyer segments, and how high-value (LTV)?</li></ul>'
         '<p style="margin-top:4px;">Output: a prioritized <b>Tier-1 pursuit list</b> &mdash; 15&ndash;30 high-fit '
         'opportunities with full context, not a flood of irrelevant bids.</p></div>')
P.append('<div class="stage"><div class="sh">Stage 4 &mdash; Deliver <span class="tag">(weekly Pursuit Intelligence Brief)</span></div>'
         '<ul><li><b>New Tier-1 signals</b> &mdash; projects that just became visible in capital plans and CEQA notices and match MBC&rsquo;s segments</li>'
         '<li><b>Account dossiers</b> &mdash; agency background, the capital plan, prior consultants, the project manager, and MBC&rsquo;s history at the site</li>'
         '<li><b>Incumbency triggers</b> &mdash; &ldquo;El Segundo&rsquo;s NPDES permit enters renewal in Q1 &mdash; your 30-year record is the strongest qualification in the state; start the conversation now&rdquo;</li>'
         '<li><b>Teaming triggers</b> &mdash; &ldquo;Moffatt &amp; Nichol is pursuing a Port of Long Beach program &mdash; the marine scope is yours if you&rsquo;re on the team in the next 60 days&rdquo;</li></ul></div>')

# ---- 03 ----
P.append(sech("03", "Why This Is Fundamentally Different from Current Methods"))
P.append("<p>Most business-development tooling for a consulting firm falls into one of a few traps. This is none of "
         "them.</p>")
P.append(table(
    ["What Most Firms Use", "The Problem", "What AI Pursuit Intelligence Is Instead"],
    [["<b>Generic bid-alert services</b> (BidNet / PlanetBids alerts)", "Fire only AFTER the solicitation posts; flood the inbox with irrelevant bids; no early signal, no scoring",
      "Real-time signals tied to specific projects, permit cycles, and capital plans 3&ndash;12 months <i>before</i> the solicitation"],
     ["<b>Waiting for the RFP / on-call</b>", "Reactive; every qualified competitor sees the same notice at the same moment",
      "MBC is positioned with the agency or prime <i>before</i> the notice posts"],
     ["<b>Manual portal-watching</b>", "Throttled by what one or two scientists can read; pulls them off billable science",
      "Automated coverage of every relevant agency, port, and permit portal, every day"],
     ["<b>Relationship &amp; referral only</b>", "High-quality but supply-constrained; relies on the network to surface the opportunity",
      "Complements the network &mdash; surfaces the right moment to activate a relationship, and the new agencies it doesn&rsquo;t reach"],
     ["<b>Generic CRM</b> (Unanet / Deltek)", "Tracks the pursuits you already know about; doesn&rsquo;t surface new early signals",
      "Feeds the CRM with new, scored, early-stage pursuits the team would otherwise never see"]],
    aligns=["l", "l", "l"]))
P.append(callout("The critical distinction: this is not a bid-chasing service. It is a timing-and-incumbency play.",
    "MBC already has the science, the 57-year record, and the agency relationships. AI Pursuit Intelligence tells MBC "
    "<i>when</i> to activate them &mdash; and surfaces the new agencies and primes to build before a competitor does. "
    "A water district three counties away just funded a desalination feasibility study. They are about to need exactly "
    "the environmental documentation MBC has delivered for Poseidon, Doheny, and Camp Pendleton. MBC can be in that "
    "conversation this quarter &mdash; or see the RFP next year, alongside everyone else.", ORANGE))

# ---- 04 ----
P.append(sech("04", "Why Now &mdash; the 2026 Context"))
P.append("<p>Three forces are converging, and all three favor a firm that moves now.</p>")
P.append(sub("1. A funded infrastructure-and-water wave is entering the pipeline now"))
P.append("<p>IIJA, state water &amp; climate bonds, and the renewed desalination and water-reliability push are funding "
         "coastal, port, and water projects across California &mdash; each one carrying environmental-documentation and "
         "marine-monitoring work. That work is visible in agency capital plans and CEQA notices <i>now</i>, 12&ndash;24 "
         "months before the consultant solicitations. The firm watching the capital plans gets the early conversation.</p>")
P.append(sub("2. MBC&rsquo;s recurring permit calendar is predictable &mdash; and rewards whoever tracks it"))
P.append("<p>The coastal power, wastewater, and desalination dischargers MBC serves run on 5-year NPDES and CWA "
         "&sect;316(b) cycles. The renewal dates are knowable years out. A system that tracks them turns MBC&rsquo;s "
         "incumbency &mdash; the 30-year El Segundo record, the 12 coastal generating stations MBC has monitored "
         "&mdash; into a defended, renewed book of business instead of a contract that quietly lapses to whoever showed "
         "up first.</p>")
P.append(sub("3. The aquatic-consulting field is not AI-ready"))
P.append("<p>The niche peers &mdash; Tenera, Merkel, Miller &mdash; are small and traditional; the giants (AECOM, "
         "Dudek, ESA) run no niche-specific pursuit intelligence. No competitor is systematically surfacing pursuits "
         "before the solicitation. The window where AI-augmented business development is a differentiator &mdash; not a "
         "table stake &mdash; is open now, and it is measured in quarters, not years.</p>")

# ---- 05 ----
P.append(sech("05", "Proof &mdash; the Engine Is Already Running in MBC&rsquo;s Region"))
P.append("<p>This is not a theoretical system. A near-identical pursuit-intelligence build is already live for a "
         "different specialist firm in MBC&rsquo;s own backyard &mdash; a luxury custom-home builder in Orange "
         "County.</p>")
P.append(table(
    ["Element", "Detail (anonymized; scope + effort only)"],
    [["Client", "Luxury custom-home builder, Orange County coastal market"],
     ["Problem", "15&ndash;20 hours per week of manual portal-reading across permit databases, HOA committee agendas, and just-sold records"],
     ["Solution", "Multi-agent pipeline: 7 signal layers, 10 permit jurisdictions, 60+ HOA review committees"],
     ["Result on day one", "<b>24 enriched, scored Tier-1 leads in a single 75-minute run</b> &mdash; replacing the week&rsquo;s manual work"],
     ["Signal sources", "County permit portals, city building departments, HOA agendas, county recorder (just-sold), story-pole and coastal filings"]],
    aligns=["l", "l"]))
P.append("<p>The buyer is different; the engine is identical. The OC builder watches permit portals, HOA committees, "
         "and just-sold records to find homeowners before they choose a builder. For MBC, the same multi-agent engine "
         "watches agency capital plans, CEQA notices, NPDES calendars, and federal forecasts to find projects before "
         "the agency chooses a consultant. <b>Same public-data foundation, same enrichment-and-scoring pipeline</b> "
         "&mdash; re-pointed at MBC&rsquo;s named-account universe.</p>")
P.append(sub("The adaptation for MBC", TEAL))
P.append('<ul class="std">'
         '<li>Buyer type shifts from homeowner-prospect to agency / utility / port / prime</li>'
         '<li>Signal focus shifts from permits and HOA agendas to CIP budgets, CEQA notices, NPDES / &sect;316(b) cycles, and federal forecasts</li>'
         '<li>Enrichment adds incumbency cross-reference against MBC&rsquo;s 57-year project record and named-account roster</li>'
         '<li>Scoring adds MBC&rsquo;s service-line fit and the QBS / on-call / teaming procurement path</li></ul>')
P.append(callout("An honest boundary",
    "Technijian has not yet built a pursuit-intelligence system for an environmental-science consultancy &mdash; MBC "
    "would be the first in this niche. What is <i>proven</i> is the engine: the multi-agent public-data monitoring "
    "pipeline above, in production today. Configuring it for MBC&rsquo;s agencies, ports, and permit cycles is exactly "
    "what the 90-day pilot does.", BLUE))

# ---- 06 ----
P.append(sech("06", "What MBC&rsquo;s Pursuit Team Gets, Day to Day"))
P.append(table(
    ["Before", "After"],
    [["Senior scientists check PlanetBids and a few agency agendas between billable work", "Open the <b>weekly Pursuit Intelligence Brief</b> &mdash; 15&ndash;30 scored, enriched pursuits with context"],
     ["Watch for on-call solicitations as they post", "Review Tier-1 signals &mdash; projects that just became visible in capital plans and CEQA notices"],
     ["Hear about prime pursuits through the network", "Per dossier: agency background, the project manager, and MBC&rsquo;s history at the site"],
     ["React to whatever the portals surface", "Per incumbency trigger: an NPDES / &sect;316(b) renewal flagged a year early &mdash; defend the contract"],
     ["Lose time to bid-screening", "Per teaming trigger: a prime&rsquo;s pursuit where the marine scope is MBC&rsquo;s"]],
    aligns=["l", "l"]))
P.append("<p>The team does not search. The team <b>receives</b>. Senior scientists spend their time on the science, "
         "the agency relationship, and the SOQ &mdash; not on reading port-commission agendas.</p>")
P.append(callout("Shane Beck&rsquo;s read (owner / pursuit)",
    ["A defensible, auditable pursuit pipeline built entirely on public records &mdash; no purchased lists, no cold contacts. MBC&rsquo;s 57-year record becomes the incumbency-history backbone the system scores against.",
     "A measurable pursuit metric &mdash; pursuits surfaced, contacts made, win rate &mdash; in place of &ldquo;we should do more business development.&rdquo; A small, accountable pilot that proves the lift before it scales."], BLUE))
P.append(callout("The science bench&rsquo;s read (the boundary)",
    ["The brief protects billable time &mdash; the principal scientists stop portal-watching and get back to the science and the agency relationships.",
     "The system respects the line MBC lives by: it surfaces opportunities and context, and it <b>never</b> touches a scientific determination or a regulatory signature. AI finds the work; the licensed scientist still owns and signs it."], TEAL))

# ---- 07 ----
P.append(sech("07", "What This Is Not", GREY))
P.append('<div class="notb"><b>This is not a generic bid-chasing service.</b> Every pursuit in the brief is tied to a '
         'specific project, capital plan, or permit cycle and scored against MBC&rsquo;s service lines &mdash; not a '
         'flood of irrelevant solicitations.</div>')
P.append('<div class="notb"><b>This is not &ldquo;AI will win you contracts by itself.&rdquo;</b> The AI surfaces the '
         'signal and the context. The pursuit is still won by MBC&rsquo;s scientists, the 57-year reputation, and a '
         'defensible SOQ. The science and the signature stay with the licensed professionals.</div>')
P.append('<div class="notb"><b>This is not replacing relationships or referrals.</b> Agency and prime relationships '
         'built over decades are MBC&rsquo;s highest-value signal. This system supplements them &mdash; covering the '
         'agencies and permit cycles the network can&rsquo;t watch by hand.</div>')
P.append('<div class="notb"><b>This is not demographic data brokering.</b> No purchased lists. No cold-contact '
         'databases. Every signal originates in public records &mdash; agency capital plans, CEQA filings, permit '
         'calendars, federal forecasts &mdash; at a scale and speed no manual process can match.</div>')

# ---- 08 ----
P.append(sech("08", "Investment &amp; ROI Framework"))
P.append(sub("Entry Scope (Pursuit Intelligence Pilot)"))
P.append(table(
    ["Component", "Description"],
    [["<b>Signal architecture build</b>", "8 data layers configured for MBC&rsquo;s named-account universe &mdash; power / &sect;316(b), wastewater, ports, desalination, water districts, federal, and prime teaming &mdash; along the California coast"],
     ["<b>Enrichment &amp; scoring layer</b>", "Agency profiling, MBC incumbency cross-reference, service-line + procurement-path scoring"],
     ["<b>Weekly Pursuit Intelligence Brief</b>", "Formatted weekly delivery to Shane and the pursuit team; incumbency-renewal calendar"],
     ["<b>Pilot period</b>", "90-day pilot; weekly signal briefs + monthly review"]],
    aligns=["l", "l"]))
P.append("<p>The pilot runs on <b>My AI Lead Gen&rsquo;s published service tiers</b> &mdash; no invented pricing:</p>")
P.append(table(
    ["My AI Lead Gen Tier", "Monthly", "Scope"],
    [["Starter", "$1,499/mo", "1 vertical &middot; 500 leads/mo"],
     ["<b>Professional</b> (the fit for MBC)", "<b>$3,499/mo</b>", "3 verticals &middot; daily runs &middot; 2,500 leads/mo"],
     ["Enterprise", "$6,999/mo", "Unlimited verticals &middot; 10K+ leads/mo"]],
    aligns=["l", "r", "l"]))
P.append("<p>MBC&rsquo;s named-account universe spans several segments &mdash; power, wastewater, ports, desalination, "
         "water districts, federal &mdash; which maps to the <b>Professional tier ($3,499/mo)</b>, about <b>$10,500 for "
         "the 90-day pilot</b>, plus a one-time signal-architecture configuration for MBC&rsquo;s specific agencies, "
         "ports, and permit cycles (scoped at the discovery quote). A more conservative on-ramp: the <b>Starter tier "
         "($1,499/mo)</b> scoped to MBC&rsquo;s single highest-value segment &mdash; the &sect;316(b) / NPDES power-and-"
         "wastewater renewal backbone &mdash; expanding to Professional as the pilot proves out.</p>")
P.append(sub("ROI Framework (model with MBC data at discovery)", ORANGE))
P.append("<p><b>Input variables</b> to confirm with Shane: average first-year engagement value by type (illustrative "
         "$45K&ndash;$110K); current on-call / pursuit win rate; typical SOQ turnaround; number of pursuits tracked "
         "actively.</p>")
P.append(table(
    ["Illustrative model (rebuilt with MBC&rsquo;s actual figures at discovery)", "Value"],
    [["Additional qualified pursuits surfaced per year (conservative vs. the 24-lead OC run)", "10 / year"],
     ["Incremental win rate assumed on the new signals", "~20%"],
     ["Average first-year engagement value assumed (illustrative)", "$70,000"],
     ["<b>Result &mdash; ~2 added wins per year &times; $70,000</b>", "<b>~$140,000 / yr incremental</b>"]],
    aligns=["l", "r"]))
P.append("<p>Against a ~$10,500 pilot investment, break-even is a fraction of a single additional win. And the "
         "highest-value outcome isn&rsquo;t even in that number: tracking the &sect;316(b) / NPDES renewal calendar "
         "<b>defends the long-term monitoring contracts</b> &mdash; like the 30-year El Segundo record &mdash; where "
         "MBC&rsquo;s institutional memory is the moat and a lapsed renewal is the one loss that hurts most.</p>")
P.append(callout("Efficiency model (principal-scientist hours recovered)",
    "If senior scientists spend even 3&ndash;4 hours a week between them on manual portal-watching and bid-screening, "
    "that is 150&ndash;200 hours a year of principal-scientist time. The brief reduces that to ~30 minutes a week of "
    "review &mdash; recovering well over 100 hours a year that go back to billable science and agency relationships.", TEAL))

# ---- 09 ----
P.append(sech("09", "Relationship to the Broader AI Growth Program"))
P.append("<p>AI Pursuit Intelligence is one module within a larger picture &mdash; not the full Technijian program for "
         "MBC. Here is how it fits.</p>")
P.append('<div class="stack avoid">'
         '<div class="band" style="border-color:'+ORANGE+'"><span class="bh" style="color:'+ORANGE+'">ENTRY PLAY (now)</span>'
         '<ul><li>Niche AEO authority content &mdash; own the AI-search answer for eelgrass survey / restoration, CWA &sect;316(b), marine toxicity testing, and desalination documentation</li>'
         '<li>Executive AI Workshop &mdash; the succession / institutional-memory roadmap and the &ldquo;scientist signs&rdquo; AI-governance boundary</li>'
         '<li>AI Pursuit Intelligence pilot (this proposal)</li></ul></div>'
         '<div class="band"><span class="bh">PURSUIT ENGINE (this proposal)</span>'
         '<ul><li>Signal architecture + enrichment build (8 layers)</li>'
         '<li>Weekly Pursuit Intelligence Brief</li><li>Incumbency / permit-renewal tracking</li></ul></div>'
         '<div class="band" style="border-color:'+TEAL+'"><span class="bh" style="color:'+TEAL+'">INSTITUTIONAL KNOWLEDGE (expansion)</span>'
         '<ul><li>The Institutional-Memory Brain &mdash; index 57 years of reports, datasets, and taxonomic judgment (Weaviate + Obsidian)</li>'
         '<li>AI Proposal / SOQ / CEQA-scope Engine &mdash; draft responses from the brain (days &rarr; hours)</li></ul></div>'
         '<div class="band" style="border-color:'+DARK+'"><span class="bh" style="color:'+DARK+'">FOUNDATION</span>'
         '<ul><li>Secure IT + AI governance + the &ldquo;scientist signs&rdquo; boundary across the firm</li></ul></div></div>')
P.append('<p class="hon">Entry-program and build figures are planning estimates from the MBC AI Growth Report; My SEO '
         'bills at published rates, while the Workshop and the Institutional-Memory build are confirmed at quote. The '
         'only committed scope in this proposal is the Pursuit Intelligence pilot priced in Section 8.</p>')
P.append("<p>The Pursuit Intelligence build runs standalone as a pilot. But it compounds with the Institutional-Memory "
         "Brain: the incumbency cross-reference gets richer as 57 years of MBC&rsquo;s project record is indexed, and the "
         "pursuits it surfaces flow straight into the AI Proposal Engine &mdash; turning a Tier-1 signal into a drafted "
         "SOQ in hours.</p>")

# ---- 10 ----
P.append(sech("10", "Why Technijian, Why Now"))
P.append(callout("1. We have already built this engine &mdash; in MBC&rsquo;s region.",
    "The OC luxury-homebuilder system in Section 5 uses the same public-data sources, the same multi-agent enrichment, "
    "and the same scoring pipeline relevant to MBC&rsquo;s agencies and ports. We are not proposing a new capability; we "
    "are re-pointing a proven system at MBC&rsquo;s named-account universe.", BLUE))
P.append(callout("2. MBC&rsquo;s incumbency is a wasting asset unless it is defended.",
    "The &sect;316(b) / NPDES renewal cycles that carry MBC&rsquo;s 30-year monitoring records are knowable years in "
    "advance. A system that tracks them now protects the recurring book that institutional memory has earned &mdash; "
    "before a renewal quietly lapses to a competitor who showed up first.", ORANGE))
P.append("<p>Shane, MBC already has the science, the 57-year record, and the agency relationships. The only gap is the "
         "systematic intelligence layer that tells those relationships <i>when</i> to move &mdash; and surfaces the new "
         "agencies and primes before the solicitation posts.</p>")

# ---- 11 ----
P.append(sech("11", "Proposed Next Steps"))
P.append(table(
    ["Step", "What Happens"],
    [["<b>1. Discovery call</b> (30&ndash;45 min)", "Shane + (optional) Chuck or a proposal lead. Confirm the named-account roster, the on-call / pursuit pipeline and win rate, the priority segments and permit cycles, and how SOQs are assembled today."],
     ["<b>2. Signal-architecture scoping</b> (1 week)", "Technijian maps the specific agencies, ports, permit calendars, and prime relationships for MBC&rsquo;s universe. Output: a one-page architecture doc and pilot scope with fixed investment."],
     ["<b>3. 90-day pilot</b>", "Weeks 1&ndash;2: build + test harvest + enrichment. Week 3: first Pursuit Intelligence Brief delivered. Weeks 4&ndash;12: weekly briefs, scoring tuned to MBC&rsquo;s segments, incumbency-renewal calendar built. End: review vs. baseline."],
     ["<b>4. Expansion</b> (post-pilot)", "Add the Institutional-Memory Brain and the AI Proposal Engine so surfaced pursuits flow into drafted SOQs; extend AEO authority across MBC&rsquo;s niches."]],
    aligns=["l", "l"]))
P.append('<div class="close"><h4>The first move is a 30-minute discovery call.</h4>'
         '<p>Confirm the named accounts, map the highest-value permit cycles, and point the system at MBC&rsquo;s '
         'universe &mdash; so the first Pursuit Intelligence Brief is on Shane&rsquo;s desk inside three weeks, while '
         'this year&rsquo;s capital plans and CEQA notices are still early.</p></div>')

# ---- Appendix ----
P.append(sech("Appendix", "Key Contacts at MBC Aquatic Sciences", GREY))
P.append(table(
    ["Name", "Role", "Role in this engagement"],
    [["Shane Beck", "President &amp; Principal Scientist", "Primary &mdash; decision-maker; pursuit owner; the science-first boundary"],
     ["Chuck Mitchell", "Founder (1969); VP / Managing Scientist", "Institutional memory &mdash; the 57-year record the system cross-references for incumbency"],
     ["Principal Scientist bench", "Senior scientists (27-yr avg tenure)", "The pursuit team the weekly brief serves; the science and the signatures stay here"]],
    aligns=["l", "l", "l"]))
P.append('<p class="hon" style="margin-top:10px;">Technijian &middot; Managed IT, Cybersecurity &amp; AI Solutions &middot; '
         '18 Technology Dr., Ste 141, Irvine, CA 92618 &middot; technijian.com &middot; rjain@technijian.com<br>'
         'This proposal is confidential and prepared exclusively for MBC Aquatic Sciences.</p>')

HTML = ("<!DOCTYPE html><html><head><meta charset='utf-8'><style>" + CSS +
        "</style></head><body>" + "".join(P) + "</body></html>")

# ---------- running header / footer ----------
HEADER = (f'<div style="font-family:Arial,sans-serif;width:100%;box-sizing:border-box;'
          f'padding:0 1in;display:flex;align-items:flex-end;justify-content:space-between;">'
          f'<img src="data:image/png;base64,{light_b64}" style="height:28px">'
          f'<div style="flex:1;margin-left:18px;border-bottom:2px solid #006DB6;'
          f'text-align:right;padding-bottom:3px;">'
          f'<span style="font-size:8.5px;color:#59595B;letter-spacing:.6px;">'
          f'AI Pursuit Intelligence &nbsp;&middot;&nbsp; MBC Aquatic Sciences</span></div></div>')
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
    page.get_pixmap(dpi=96).save(os.path.join(HERE, f"_proof_p{i+1:02d}.png"))
doc.close()
print("Proof PNGs written:", n)
