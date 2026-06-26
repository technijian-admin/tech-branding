# -*- coding: utf-8 -*-
"""TEMPLATE — Technijian "AI Pursuit Intelligence" proposal (standalone BD proposal).
Self-contained HTML -> branded multi-page Letter PDF (Playwright/Chromium), airy
AI-Growth-Report format. See skills/technijian-pursuit-intelligence-proposal/SKILL.md.

HOW TO USE
  1. Copy to  Clients/<CODE>/build-<code>-proposal.py
  2. Set CODE / CLIENT / SHORT below. Fill every  # >>> FILL  block with researched,
     real, CODE-FREE content (use the real company name, never the internal code).
  3. Run it. It renders the PDF, rasterizes every page to _proof_p##.png, and checks
     that the internal CODE never rendered (must be 0).
  4. Eyeball every page; fix; re-render. Confirm 0 code, 0 mojibake, math exact, ~12-16pp.

NON-NEGOTIABLES (see SKILL.md "Hard guardrails")
  - AUTHENTIC logo only (assets/Technijian Logo 2.png). NOT assets/logos/png/* fakes.
  - Real company name everywhere + in the output filename. Internal CODE never rendered.
  - Published My AI Lead Gen pricing only. ABM framing (no "lead gen / funnel / cold list").
  - OC-builder proof framed honestly (proven engine; first-in-niche config = the pilot).
  - Use HTML entities for punctuation: &mdash; &ndash; &rsquo; &ldquo; &rdquo; &middot;
    &rarr; &times; &sect;  (prevents mojibake).
"""
import os, base64, re
from playwright.sync_api import sync_playwright

# >>> FILL: client identity ---------------------------------------------------
CODE   = "XXX"                 # internal Technijian client code — for the leak-check ONLY; never put in content
CLIENT = "Client Full Name"    # real company name (client-facing)
SHORT  = "Client"              # natural short form (client-facing)
OUTNAME = "Client-AI-Pursuit-Intelligence-Proposal.pdf"   # use the REAL name, not the code
PREPARED_FOR = "Decision-Maker Name, Title, " + CLIENT     # the real buyer/champion
LOCALITY = "Local partners in Orange County"               # true locality hook (adjust)
# -----------------------------------------------------------------------------

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))      # adjust depth if not under Clients/<CODE>/
LOGO_LIGHT = os.path.join(ROOT, "assets", "Technijian Logo 2.png")  # AUTHENTIC, light bg
light_b64 = base64.b64encode(open(LOGO_LIGHT, "rb").read()).decode()
OUT = os.path.join(HERE, OUTNAME)

# Brand colors (brand-tokens.json)
BLUE, ORANGE, TEAL, DARK = "#006DB6", "#F67D4B", "#1EAAC8", "#1A1A2E"
GREY, LIGHT, OFF, PURPLE = "#59595B", "#E3E7EB", "#F6F8FA", "#7B2D8B"

# ---------- fragment helpers (do not change) ----------
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
        trs += "<tr>" + "".join(f'<td class="{a}">{c}</td>' for c, a in zip(r, aligns)) + "</tr>"
    return f'<table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>'

# ---------- CSS (airy AI-Growth-Report format — do not change) ----------
CSS = """
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Open Sans',Arial,sans-serif; color:#59595B; font-size:13px; line-height:1.62; }
p { margin-bottom:11px; text-align:justify; }
.avoid { break-inside:avoid; }
.pb { break-before:page; }
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
.kpis { display:flex; gap:14px; margin:8px 0 20px; }
.kpi { flex:1; background:#F6F8FA; border-radius:8px; padding:20px 8px; text-align:center; }
.kpi .n { font-size:29px; font-weight:800; line-height:1.1; }
.kpi .l { font-size:10.5px; color:#59595B; margin-top:6px; line-height:1.4; }
.sech { display:flex; align-items:center; margin:2px 0 16px; break-before:page; break-after:avoid; }
.sech .bar { width:8px; height:34px; border-radius:2px; margin-right:15px; flex:none; }
.sech h2 { font-size:19px; font-weight:800; line-height:1.15; }
h3 { font-size:14.5px; font-weight:800; margin:18px 0 7px; break-after:avoid; }
table { width:100%; border-collapse:collapse; margin:11px 0 13px; font-size:11px; }
th, td { border:1px solid #E3E7EB; padding:8px 11px; text-align:left; vertical-align:top; line-height:1.45; }
th { color:#fff; font-weight:700; font-size:10.5px; }
tbody tr:nth-child(even) { background:#F6F8FA; }
tr { break-inside:avoid; }
thead { break-inside:avoid; display:table-header-group; }
td b { color:#006DB6; }
.r { text-align:right; } .c { text-align:center; }
th.r { text-align:right; } th.c { text-align:center; }
.callout { background:#F6F8FA; border-left:5px solid #006DB6; border-radius:0 7px 7px 0; padding:14px 18px; margin:15px 0; }
.callout h4 { font-size:13.5px; font-weight:800; margin-bottom:5px; }
.callout p { margin-bottom:7px; font-size:12.5px; line-height:1.55; }
.callout p:last-child { margin-bottom:0; }
.flow { display:flex; align-items:stretch; gap:0; margin:14px 0 8px; }
.flow .box { flex:1; background:#F6F8FA; border:1px solid #E3E7EB; border-top:3px solid #006DB6; border-radius:5px; padding:11px 10px; text-align:center; }
.flow .box.late { border-top-color:#F67D4B; }
.flow .box .bt { font-weight:700; color:#1A1A2E; font-size:11.5px; display:block; }
.flow .box .bs { font-size:9.6px; color:#59595B; }
.flow .arr { display:flex; align-items:center; color:#006DB6; font-weight:800; font-size:16px; padding:0 9px; }
.stage { background:#F6F8FA; border-radius:8px; padding:13px 16px; margin:11px 0; }
.stage .sh { font-size:13.5px; font-weight:800; color:#006DB6; margin-bottom:4px; }
.stage .sh .tag { font-size:10px; font-weight:700; color:#59595B; }
.stage p { margin:0; font-size:12.5px; }
.stage ul { margin:5px 0 0 19px; } .stage li { margin-bottom:4px; font-size:12.5px; line-height:1.5; }
.stack .band { border-left:6px solid #006DB6; background:#F6F8FA; border-radius:0 7px 7px 0; padding:12px 16px; margin-bottom:10px; }
.stack .band .bh { font-weight:800; color:#006DB6; font-size:12.5px; letter-spacing:.4px; }
.stack .band ul { margin:5px 0 0 19px; } .stack .band li { font-size:11.5px; margin-bottom:3px; }
.notb { background:#F6F8FA; border-left:5px solid #59595B; border-radius:0 7px 7px 0; padding:12px 17px; margin:12px 0; break-inside:avoid; }
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
# >>> FILL: the one-line case = the THESIS in 3-4 sentences, in THIS client's world.
P.append(f"""
<div class="cover">
  <div class="cband"></div>
  <img class="logo" src="data:image/png;base64,{light_b64}">
  <div class="crule"></div>
  <h1>{CLIENT.upper()}</h1>
  <div class="t2">AI Pursuit Intelligence</div>
  <div class="t3">A Business Development Proposal from Technijian</div>
  <div class="coneline">
    {SHORT}&rsquo;s next pursuit is already visible in public data <b>right now</b> &mdash; >>> FILL: two or three
    concrete early-signal examples in THIS client&rsquo;s world. None of it reaches {SHORT} until the RFP /
    solicitation posts &mdash; and by then every qualified competitor sees the same notice at the same moment.
    <b>AI Pursuit Intelligence changes that sequence.</b>
  </div>
  <div class="cmeta">
    <b>Prepared for:</b> {PREPARED_FOR}<br>
    <b>Prepared by:</b> Ravi Jain, CEO, Technijian &nbsp;&middot;&nbsp; rjain@technijian.com &nbsp;&middot;&nbsp; >>> FILL: Month Year<br>
    Reference: Technijian AI Growth Program &mdash; {CLIENT}
  </div>
  <div class="cband o"></div>
  <div class="cfb-sub">{LOCALITY} &nbsp;&middot;&nbsp; 949.379.8499 &nbsp;&middot;&nbsp; technijian.com</div>
  <div class="cconf">CONFIDENTIAL &mdash; prepared exclusively for {CLIENT}.</div>
</div>
""")

# ---- 01 ----  How <Client> Wins Work Today — and Where the Signal Arrives Too Late
P.append(sech("01", f"How {SHORT} Wins Work Today &mdash; and Where the Signal Arrives Too Late"))
# >>> FILL: 4 KPI cards that sell the pursuit-intelligence value (lead time / signal layers / proof / pilot $)
P.append('<div class="kpis">'
         + kpi("3&ndash;12 mo", "Lead time before the solicitation", BLUE)
         + kpi("8", "Public-data signal layers", ORANGE)
         + kpi("24", "Tier-1 leads in one 75-min run", TEAL)
         + kpi("~$10.5K", "90-day pilot (published tier)", DARK)
         + '</div>')
# >>> FILL: establish the client's existing strength (years, scale, proof points), then "the signal arrives too late".
P.append("<p>>>> FILL: the client&rsquo;s 1-paragraph existing-strength + the structural blind spot: "
         "<b>the signal arrives too late.</b></p>")
P.append('<div class="flow avoid">'
         '<div class="box"><span class="bt">Buyer acts</span><span class="bs">public record, day&nbsp;1</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box"><span class="bt">Months pass</span><span class="bs">early notice / cycle</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box late"><span class="bt">Solicitation posts</span><span class="bs">public portal</span></div>'
         '<div class="arr">&rarr;</div>'
         '<div class="box late"><span class="bt">' + SHORT + ' sees it</span><span class="bs">same moment as rivals</span></div></div>')
P.append("<p>>>> FILL: by the time the solicitation posts, rivals are already positioned; the firm that knew months "
         "earlier got the early conversation. Name real competitors.</p>")
P.append(sub(f"What {SHORT}&rsquo;s team watches manually today (estimated; confirm at discovery)"))
P.append('<ul class="std"><li>>>> FILL</li><li>>>> FILL</li><li>>>> FILL</li></ul>')
P.append("<p>>>> FILL: the <b>coverage problem</b> &mdash; the signal universe is larger than any human can watch; "
         "an AI system can read all of it, every day.</p>")

# ---- 02 ----  What AI Pursuit Intelligence Delivers (the 4-stage engine + SIGNAL LAYERS)
P.append(sech("02", "What AI Pursuit Intelligence Delivers"))
P.append("<p><b>AI Pursuit Intelligence</b> is a multi-agent, multi-source monitoring system configured around "
         f"{SHORT}&rsquo;s named-account universe and service lines. It is not a generic bid-alert service. It is not "
         "a cold contact list. It works in four stages.</p>")
P.append('<div class="stage"><div class="sh">Stage 1 &mdash; Harvest <span class="tag">(continuous, automated)</span></div>'
         '<p>>>> FILL count: data layers are monitored in near-real-time:</p></div>')
# >>> FILL: 7-8 SIGNAL LAYERS derived from THIS client's procurement reality (the heart of the doc). Real examples only.
P.append(table(
    ["Signal Layer", "What It Surfaces", f"Why It Matters for {SHORT}"],
    [["<b>>>> FILL layer 1</b>", ">>> FILL what it surfaces", ">>> FILL why-it-matters (the earliest signal)"],
     ["<b>>>> FILL layer 2</b>", ">>> FILL", ">>> FILL"],
     ["<b>>>> FILL &hellip; add 7&ndash;8 rows total</b>", ">>> FILL", ">>> FILL"]],
    aligns=["l", "l", "l"]))
P.append('<div class="stage"><div class="sh">Stage 2 &mdash; Enrich <span class="tag">(AI-powered, per signal)</span></div>'
         '<ul><li>Identity, project type, jurisdiction / lead agency</li>'
         '<li>>>> FILL: the client&rsquo;s prior history / incumbency at that buyer or site (cross-referenced against their archive)</li>'
         '<li>Estimated scope, timeline, and likely procurement path</li>'
         '<li>Relationship flag: &ldquo;>>> FILL prior-relationship example&rdquo; vs. &ldquo;new &mdash; no prior relationship&rdquo;</li></ul></div>')
P.append('<div class="stage"><div class="sh">Stage 3 &mdash; Score <span class="tag">(prioritized by criteria)</span></div>'
         '<ul><li><b>Fit</b> &mdash; does it match the client&rsquo;s service lines?</li>'
         '<li><b>Relationship / incumbency</b> &mdash; do they already know this buyer or site?</li>'
         '<li><b>Timing</b> &mdash; early enough to position before the solicitation?</li>'
         '<li><b>Segment</b> &mdash; which buyer segment, and how high-value?</li></ul>'
         '<p style="margin-top:4px;">Output: a prioritized <b>Tier-1 pursuit list</b> &mdash; a curated set with full '
         'context, not a flood of irrelevant bids.</p></div>')
P.append('<div class="stage"><div class="sh">Stage 4 &mdash; Deliver <span class="tag">(weekly Pursuit Intelligence Brief)</span></div>'
         '<ul><li><b>New Tier-1 signals</b> matching the client&rsquo;s segments</li>'
         '<li><b>Account dossiers</b> &mdash; buyer background, decision-maker, the client&rsquo;s history at the site</li>'
         '<li><b>Incumbency / relationship triggers</b> &mdash; >>> FILL a concrete example in the client&rsquo;s world</li>'
         '<li><b>Teaming / market triggers</b> &mdash; >>> FILL a concrete example</li></ul></div>')

# ---- 03 ----  Why This Is Fundamentally Different
P.append(sech("03", "Why This Is Fundamentally Different from Current Methods"))
P.append("<p>>>> FILL: most BD tooling falls into a few traps; this is none of them.</p>")
P.append(table(
    ["What Most Firms Use", "The Problem", "What AI Pursuit Intelligence Is Instead"],
    [["<b>>>> FILL (e.g. bid-alert services)</b>", ">>> FILL", ">>> FILL"],
     ["<b>Waiting for the RFP / solicitation</b>", "Reactive; every rival sees the same notice at once", "Positioned with the buyer <i>before</i> the notice posts"],
     ["<b>Manual portal-watching</b>", "Throttled; pulls senior staff off billable work", "Automated coverage of every relevant portal, every day"],
     ["<b>Relationship &amp; referral only</b>", "High-quality but supply-constrained", "Complements the network &mdash; surfaces the right moment to activate it"],
     ["<b>Generic CRM</b>", "Tracks pursuits you already know about", "Feeds the CRM with new, scored, early-stage pursuits"]],
    aligns=["l", "l", "l"]))
P.append(callout("The critical distinction: this is not a cold-list / bid-chasing play. It is a timing-and-incumbency play.",
    f">>> FILL: {SHORT} already has the relationships and the record; AI Pursuit Intelligence tells them <i>when</i> to "
    "activate them, and surfaces new buyers before a competitor does. End with a vivid, concrete example in their world.", ORANGE))

# ---- 04 ----  Why Now
P.append(sech("04", "Why Now &mdash; the 2026 Context"))
P.append("<p>Three forces are converging, and all three favor a firm that moves now.</p>")
P.append(sub("1. >>> FILL: a funding / regulatory / demand wave entering the pipeline now"))
P.append("<p>>>> FILL</p>")
P.append(sub("2. >>> FILL: a predictable cycle THIS client can exploit (permit renewals, contract expirations, budgets)"))
P.append("<p>>>> FILL</p>")
P.append(sub("3. The field is not AI-ready"))
P.append("<p>>>> FILL: the niche peers are traditional, the giants run no niche-specific pursuit intelligence; the "
         "differentiator window is open now, measured in quarters.</p>")

# ---- 05 ----  Proof (OC builder case — keep factual; frame honestly)
P.append(sech("05", "Proof &mdash; the Engine Is Already Running"))
P.append("<p>This is not a theoretical system. A near-identical pursuit-intelligence build is already live for a "
         "specialist firm in the same region &mdash; a luxury custom-home builder in Orange County.</p>")
P.append(table(
    ["Element", "Detail (anonymized; scope + effort only)"],
    [["Client", "Luxury custom-home builder, Orange County coastal market"],
     ["Problem", "15&ndash;20 hours per week of manual portal-reading across permit databases, HOA committee agendas, and just-sold records"],
     ["Solution", "Multi-agent pipeline: 7 signal layers, 10 permit jurisdictions, 60+ HOA review committees"],
     ["Result on day one", "<b>24 enriched, scored Tier-1 leads in a single 75-minute run</b> &mdash; replacing the week&rsquo;s manual work"],
     ["Signal sources", "County permit portals, city building departments, HOA agendas, county recorder (just-sold), coastal filings"]],
    aligns=["l", "l"]))
P.append("<p>The buyer is different; the engine is identical. >>> FILL: one sentence mapping the OC builder&rsquo;s "
         f"signals to {SHORT}&rsquo;s. <b>Same public-data foundation, same enrichment-and-scoring pipeline</b> "
         f"&mdash; re-pointed at {SHORT}&rsquo;s named-account universe.</p>")
P.append(sub(f"The adaptation for {SHORT}", TEAL))
P.append('<ul class="std"><li>Buyer type shifts to >>> FILL</li><li>Signal focus shifts to >>> FILL</li>'
         '<li>Enrichment adds >>> FILL (incumbency cross-reference)</li><li>Scoring adds >>> FILL (their procurement path)</li></ul>')
P.append(callout("An honest boundary",
    f"Technijian has not yet built a pursuit-intelligence system for {SHORT}&rsquo;s niche &mdash; they would be the "
    "first. What is <i>proven</i> is the engine above, in production today. Configuring it for their buyers and cycles "
    "is exactly what the 90-day pilot does.", BLUE))

# ---- 06 ----  Day to Day
P.append(sech("06", f"What {SHORT}&rsquo;s Pursuit Team Gets, Day to Day"))
P.append(table(
    ["Before", "After"],
    [[">>> FILL manual habit", "Open the <b>weekly Pursuit Intelligence Brief</b> &mdash; scored, enriched pursuits with context"],
     [">>> FILL", "Review Tier-1 signals &mdash; projects that just became visible"],
     [">>> FILL", "Per dossier: buyer background, decision-maker, prior history"],
     [">>> FILL", "Per incumbency trigger: a renewal flagged early &mdash; defend it"]],
    aligns=["l", "l"]))
P.append("<p>The team does not search. The team <b>receives</b>. >>> FILL: they spend time on the work, the "
         "relationship, the proposal &mdash; not on portal-reading.</p>")
P.append(callout(">>> FILL: Decision-maker&rsquo;s read",
    [">>> FILL: a defensible, auditable pursuit pipeline on public records; their record becomes the incumbency backbone.",
     ">>> FILL: a measurable pursuit metric; a small accountable pilot that proves the lift before it scales."], BLUE))
# If the client's deliverables carry professional/regulatory weight, add the "the professional still signs" boundary:
P.append(callout(">>> FILL: Practitioner&rsquo;s read (the boundary)",
    [">>> FILL: the brief protects billable time.",
     ">>> FILL: the system surfaces opportunities and <b>never</b> touches a professional determination or signature."], TEAL))

# ---- 07 ----  What This Is Not
P.append(sech("07", "What This Is Not", GREY))
P.append('<div class="notb"><b>This is not a generic bid-chasing / cold-list service.</b> >>> FILL.</div>')
P.append('<div class="notb"><b>This is not &ldquo;AI will win you work by itself.&rdquo;</b> >>> FILL: the AI surfaces '
         'the signal; the work is won by the client&rsquo;s people and reputation.</div>')
P.append('<div class="notb"><b>This is not replacing relationships or referrals.</b> >>> FILL: it supplements them.</div>')
P.append('<div class="notb"><b>This is not demographic data brokering.</b> No purchased lists. Every signal originates '
         'in public records, at a scale and speed no manual process can match.</div>')

# ---- 08 ----  Investment & ROI
P.append(sech("08", "Investment &amp; ROI Framework"))
P.append(sub("Entry Scope (Pursuit Intelligence Pilot)"))
P.append(table(
    ["Component", "Description"],
    [["<b>Signal architecture build</b>", ">>> FILL: N data layers configured for the client&rsquo;s named-account universe"],
     ["<b>Enrichment &amp; scoring layer</b>", "Buyer profiling, incumbency cross-reference, fit + procurement-path scoring"],
     ["<b>Weekly Pursuit Intelligence Brief</b>", "Formatted weekly delivery to the decision-maker and pursuit team"],
     ["<b>Pilot period</b>", "90-day pilot; weekly signal briefs + monthly review"]],
    aligns=["l", "l"]))
P.append("<p>The pilot runs on <b>My AI Lead Gen&rsquo;s published service tiers</b> &mdash; no invented pricing "
         "(verify against the current brochure):</p>")
P.append(table(
    ["My AI Lead Gen Tier", "Monthly", "Scope"],
    [["Starter", "$1,499/mo", "1 vertical &middot; 500 leads/mo"],
     [f"<b>Professional</b> (the fit for {SHORT})", "<b>$3,499/mo</b>", "3 verticals &middot; daily runs &middot; 2,500 leads/mo"],
     ["Enterprise", "$6,999/mo", "Unlimited verticals &middot; 10K+ leads/mo"]],
    aligns=["l", "r", "l"]))
P.append(f"<p>{SHORT}&rsquo;s named-account universe spans several segments, which maps to the <b>Professional tier "
         "($3,499/mo)</b>, about <b>$10,500 for the 90-day pilot</b>, plus a one-time signal-architecture configuration "
         "(scoped at the discovery quote). A more conservative on-ramp: the <b>Starter tier ($1,499/mo)</b> scoped to "
         "the single highest-value segment &mdash; >>> FILL &mdash; expanding to Professional as the pilot proves out.</p>")
P.append(sub(f"ROI Framework (model with {SHORT} data at discovery)", ORANGE))
P.append("<p><b>Input variables</b> to confirm: average engagement value by type (illustrative); current win rate; "
         "pursuits tracked actively.</p>")
# >>> FILL: choose inputs so pursuits x win% = a WHOLE number of wins (keeps the arithmetic exact).
P.append(table(
    ["Illustrative model (rebuilt with actual figures at discovery)", "Value"],
    [["Additional qualified pursuits surfaced per year (conservative)", ">>> FILL e.g. 10 / year"],
     ["Incremental win rate assumed on the new signals", ">>> FILL e.g. ~20%"],
     ["Average engagement value assumed (illustrative)", ">>> FILL e.g. $70,000"],
     ["<b>Result &mdash; ~N added wins per year &times; $value</b>", "<b>>>> FILL = exact product</b>"]],
    aligns=["l", "r"]))
P.append("<p>>>> FILL: break-even is a fraction of one win; name the highest-value non-numeric outcome "
         "(e.g. defending an incumbency).</p>")
P.append(callout("Efficiency model (hours recovered)",
    ">>> FILL: hours/week of manual watching &rarr; ~30 min/week of review &mdash; recovered hours go back to the work.", TEAL))

# ---- 09 ----  Relationship to the Broader Program
P.append(sech("09", "Relationship to the Broader AI Growth Program"))
P.append(f"<p>AI Pursuit Intelligence is one module within a larger picture &mdash; not the full Technijian program for "
         f"{SHORT}. Here is how it fits.</p>")
P.append('<div class="stack avoid">'
         '<div class="band" style="border-color:'+ORANGE+'"><span class="bh" style="color:'+ORANGE+'">ENTRY PLAY (now)</span>'
         '<ul><li>>>> FILL entry services (e.g. AEO authority content, AI workshop) + this pilot</li></ul></div>'
         '<div class="band"><span class="bh">PURSUIT ENGINE (this proposal)</span>'
         '<ul><li>Signal architecture + weekly Pursuit Intelligence Brief + incumbency tracking</li></ul></div>'
         '<div class="band" style="border-color:'+TEAL+'"><span class="bh" style="color:'+TEAL+'">INSTITUTIONAL KNOWLEDGE (expansion)</span>'
         '<ul><li>>>> FILL: knowledge brain + AI proposal/SOQ engine</li></ul></div>'
         '<div class="band" style="border-color:'+DARK+'"><span class="bh" style="color:'+DARK+'">FOUNDATION</span>'
         '<ul><li>>>> FILL: secure IT + AI governance + the relevant boundary</li></ul></div></div>')
P.append('<p class="hon">Entry-program and build figures are planning estimates from the client&rsquo;s AI Growth '
         'Report; My SEO bills at published rates, while build line items are confirmed at quote. The only committed '
         'scope in this proposal is the Pursuit Intelligence pilot priced in Section 8.</p>')

# ---- 10 ----  Why Technijian, Why Now
P.append(sech("10", "Why Technijian, Why Now"))
P.append(callout("1. We have already built this engine &mdash; in the same region.",
    ">>> FILL: re-pointing a proven system at the client&rsquo;s universe, not a new capability.", BLUE))
P.append(callout("2. >>> FILL: the client-specific time-bound reason (incumbency to defend, funding window, etc.).",
    ">>> FILL.", ORANGE))
P.append(f"<p>>>> FILL: {SHORT} already has the people, the record, and the relationships. The only gap is the "
         "systematic intelligence layer that tells those relationships <i>when</i> to move.</p>")

# ---- 11 ----  Next Steps
P.append(sech("11", "Proposed Next Steps"))
P.append(table(
    ["Step", "What Happens"],
    [["<b>1. Discovery call</b> (30&ndash;45 min)", ">>> FILL: confirm the named-account roster, pipeline + win rate, priority segments/cycles."],
     ["<b>2. Signal-architecture scoping</b> (1 week)", "Technijian maps the specific buyers and cycles. Output: a one-page architecture doc + pilot scope with fixed investment."],
     ["<b>3. 90-day pilot</b>", "Weeks 1&ndash;2 build + test; Week 3 first brief; Weeks 4&ndash;12 weekly briefs, scoring tuned; end: review vs. baseline."],
     ["<b>4. Expansion</b> (post-pilot)", ">>> FILL: knowledge brain + proposal engine so surfaced pursuits flow into drafted responses."]],
    aligns=["l", "l"]))
P.append('<div class="close"><h4>The first move is a 30-minute discovery call.</h4>'
         f'<p>>>> FILL: confirm the named accounts and point the system at {SHORT}&rsquo;s universe &mdash; so the first '
         'Pursuit Intelligence Brief is on their desk inside three weeks.</p></div>')

# ---- Appendix ----
P.append(sech("Appendix", f"Key Contacts at {CLIENT}", GREY))
P.append(table(
    ["Name", "Role", "Role in this engagement"],
    [[">>> FILL decision-maker", ">>> FILL title", "Primary &mdash; decision-maker; pursuit owner"],
     [">>> FILL", ">>> FILL", ">>> FILL"]],
    aligns=["l", "l", "l"]))
P.append('<p class="hon" style="margin-top:10px;">Technijian &middot; Managed IT, Cybersecurity &amp; AI Solutions &middot; '
         '18 Technology Dr., Ste 141, Irvine, CA 92618 &middot; technijian.com &middot; rjain@technijian.com<br>'
         f'This proposal is confidential and prepared exclusively for {CLIENT}.</p>')

HTML = ("<!DOCTYPE html><html><head><meta charset='utf-8'><style>" + CSS +
        "</style></head><body>" + "".join(P) + "</body></html>")

# ---------- running header / footer (do not change) ----------
HEADER = (f'<div style="font-family:Arial,sans-serif;width:100%;box-sizing:border-box;'
          f'padding:0 1in;display:flex;align-items:flex-end;justify-content:space-between;">'
          f'<img src="data:image/png;base64,{light_b64}" style="height:28px">'
          f'<div style="flex:1;margin-left:18px;border-bottom:2px solid #006DB6;'
          f'text-align:right;padding-bottom:3px;">'
          f'<span style="font-size:8.5px;color:#59595B;letter-spacing:.6px;">'
          f'AI Pursuit Intelligence &nbsp;&middot;&nbsp; {CLIENT}</span></div></div>')
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

# ---------- proofread: rasterize every page + check the internal CODE never rendered ----------
import fitz
doc = fitz.open(OUT)
n = doc.page_count
txt = "".join(p.get_text() for p in doc)
leaks = len(re.findall(r"\b" + re.escape(CODE) + r"\b", txt))
print("PAGES:", n, "| size_kb:", round(os.path.getsize(OUT) / 1024))
print(f"internal code '{CODE}' rendered (MUST be 0):", leaks)
print("mojibake check (A-tilde, MUST be 0):", txt.count("Ã"))
for i, page in enumerate(doc):
    page.get_pixmap(dpi=96).save(os.path.join(HERE, f"_proof_p{i+1:02d}.png"))
doc.close()
print("Proof PNGs written:", n, "-> eyeball every page, then delete _proof_*.png")
