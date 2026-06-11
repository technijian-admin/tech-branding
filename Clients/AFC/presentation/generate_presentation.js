const path = require("path");
const PptxGenJS = require("C:/vscode/tech-branding/tech-branding/Clients/CDLX/presentation/node_modules/pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for Abound Food Care — First Meeting";
pptx.title = "Technijian for Abound Food Care";
pptx.lang = "en-US";
pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-US" };

// ---- Real Technijian logo files (authentic, per brand guidance) ----
const LOGO_LIGHT = "C:/vscode/tech-branding/tech-branding/assets/Technijian Logo 2.png";        // dark text — for light backgrounds
const LOGO_DARK = "C:/vscode/tech-branding/tech-branding/assets/Technijian Logo - white text.png"; // white text — for dark backgrounds
const LOGO_AR = 4.78; // width / height aspect ratio of both logo files

const COLORS = {
  blue: "006DB6",
  teal: "1EAAC8",
  orange: "F67D4B",
  chartreuse: "CBDB2D",
  dark: "1A1A2E",
  slate: "334155",
  grey: "64748B",
  light: "E9EEF5",
  offWhite: "F8FAFC",
  white: "FFFFFF",
  line: "D8E0EA",
  paleBlue: "EAF4FB",
  paleTeal: "E8F8FB",
  paleOrange: "FFF1EA",
  paleDark: "EEF2F7",
  green: "0F766E",
  red: "B42318",
};

const outPath = path.resolve(__dirname, "Technijian for Abound Food Care - First Meeting Deck.pptx");

// ============ SPEAKER NOTES (presenter-facing; not shown on slides) ============
const NOTES = {
  cover:
    "OPEN WARM. Thank Esmeralda for the detailed conversation with Jannea — she gave us a genuinely useful picture, and saying so credits her. She is the Executive Assistant: very likely coordinating this evaluation for leadership (CEO Mike Learakos — led the org since 2016, drove the 2021 rebrand from Waste Not OC to Abound Food Care), so her private test is \"will this be easy to bring to my boss.\" Make her job easy — clear, calm, no pressure. VERIFY LIVE: who else is on the call? If Mike joins, adjust altitude up (mission + accountability), not down. INCUMBENT RULE: never name TechHeights on a slide and never bash them — she said they're responsive and quick, and we open by agreeing that's worth keeping. The gap she described is closure, root cause, and communication — that's our lane all meeting. MISSION CONTEXT (verify naturally, don't lecture them about their own org): founded 2012 as Waste Not OC by Dr. Eric Handler (then OC public health officer) and Mark Lowry (OC Food Bank); today Abound is the food-recovery LOGISTICS layer — connecting food donors (restaurants, grocers, hotels, hospitals) to recovery organizations — and a contracted SB 1383 compliance implementer for jurisdictions: Ventura County regional program (2024), Garden Grove, Arcata, and the Sacramento-area Capital Food Access Alliance (grant projects running through June 30, 2026). LinkedIn shows a small core staff; ~15 computers fits staff + program people. Respect: their IT budget is mission money — every dollar saved is food moved.",
  agenda:
    "Set expectations in one breath: \"This is a working conversation, not a pitch. You told Jannea three things that keep recurring — recommendations that don't fully resolve, communication breakdowns between technicians and staff, and tickets closed without being done. You've also just moved to Microsoft and may be moving offices. That's the agenda.\" Then hand her the wheel: \"What would make this half hour most useful to you?\" Let her priorities reorder the talk. If time is short, slides 4 and 5 (the support model) are the heart of the deck — she is evaluating support quality above all.",
  situation:
    "Play her own words back, then fill the blanks LIVE — this is the discovery slide. MUST-LEARN LIST: (1) Contract — when does the current term end? Renewal or notice window? Everything times off this. (2) Decision — who owns the call? Executive Director / CEO? Is there a board or finance step? What does \"evaluating options\" look like on their side? (3) Environment — any on-prem server, or cloud-only since the Microsoft move? Who owns the firewall and Wi-Fi gear? Phone system? (4) The 15 computers — desktops vs laptops, one office or hybrid, any warehouse / ops devices? (5) Microsoft 365 — who did the Google migration? Are they on Microsoft nonprofit licensing? Is MFA enforced? Anything still living on Google (Drive files, calendars)? (6) Make each pain CONCRETE: ask for one example of a recommendation that didn't resolve, one miscommunication, one ticket closed-but-not-done. Ask: \"what would good have looked like?\" (7) The move — when, where, bigger or smaller, lease status? (8) Security — cyber insurance? Backups today? Any incidents? (9) Mission systems — what software runs food recovery, donors, volunteers? (Their ecosystem publicly references the ChowMatch matching app, and they sell a \"Data Collection\" service line — CalRecycle-facing reporting and chain-of-custody data are contract deliverables, so uptime and data integrity are mission-critical. Verify what they actually run.) (10) Budget rhythm — fiscal year, board approval thresholds. BUDGET CONTEXT (know it, never recite it): public filings show revenue around $2M with three straight deficit years and shrinking reserves — so lead with predictable flat-fee, right-sized scope, and the nonprofit licensing check. Do NOT quote their financials at them. Close the slide with: \"Did we get anything wrong?\" — corrections are gold.",
  coreIdea:
    "THE EMPATHY SLIDE — land it carefully. Open by giving the incumbent their due, verbally: \"You said the current provider is responsive — that matters and it's worth keeping.\" Then the reframe: responsiveness measures how fast someone answers; resolution measures whether the problem ever comes back. The pattern she described — recurring issues, recommendations that don't land, tickets closed without confirmation — is a PROCESS problem, not a people problem. Good firms engineer closure: a ticket lifecycle with confirmation, written recommendations with owners and dates, one named team. The third takeaway lowers the stakes: evaluating costs nothing and gives them leverage either way — even if they stay put, they'll know what to ask for. DO NOT let this slide become a competitor roast; precision beats attack and she will repeat whatever tone we set when she briefs her boss.",
  support:
    "THE DIFFERENTIATOR SLIDE — this answers her three pains point by point, so connect each card to her words. Named pod = no more re-explaining context to a different technician each time (her miscommunication pain). Tickets that close properly = the person who raised it confirms the fix before the ticket closes (her closed-not-done pain). Root-cause discipline = a recurring issue triggers a root-cause review, not a third quick fix (her recommendations pain). Recommendations in writing = every recommendation has the problem, fix, investment, owner, and date — reviewed until done. Quarterly review = leadership sees the whole picture; the office move gets planned here, not discovered. Plain-language reporting = My Jian, a monthly report a non-technical leader can actually read. PROBE while this slide is up: \"Which of these would have made the biggest difference in the last six months?\" Their answer tells you what to lead with in the proposal. COMPETITIVE CONTEXT (for your head only — never quote their marketing or pricing in the meeting): the incumbent's published model gates monthly IT reviews and strategy/vCIO work to its higher tiers; a small nonprofit on an entry tier typically isn't getting documented roadmaps or standing reviews. That's exactly the lane: our quarterly leadership review and written-recommendation discipline are INCLUDED for a 15-computer org, not an enterprise upgrade.",
  m365:
    "They JUST moved Google → Microsoft — this slide says: the migration being \"done\" is not the same as Microsoft 365 being SECURED, RIGHT-LICENSED, and ADOPTED. Walk it lightly; this is a give, not a pitch. The nonprofit licensing check is genuinely valuable: Microsoft offers significant nonprofit discounts and grants, and orgs that migrate commercially often overpay — we verify it as part of any engagement (and the free assessment flags it regardless). Independent backup is the eye-opener: Microsoft retention is not backup; if an account is compromised or data deleted past the window, it's gone — a third-party M365 backup (~$4/person) closes it. Email protection matters for a nonprofit: donor and vendor payment fraud rides on spoofed domains; DMARC/DKIM closes that door. PROBES: who ran the migration? Anything still on Google? MFA enforced for everyone? Have they had phishing attempts since the move? (Most orgs say yes.) TECH FACTS (verified from public DNS — fine to mention naturally): their mail already routes through Microsoft 365, and there's an SPF-management layer on the domain, plus leftover Google site-verification records — small, concrete evidence that the Google-to-Microsoft transition left loose ends worth a tidy-up pass. Their hospital partnerships (food-insecurity screening, medically tailored meals) put them HIPAA-adjacent — if that surfaces, note we run HIPAA-aware practices for healthcare clients and can fold a compliance review into the assessment.",
  move:
    "Office move = the long-term-partner test she named in the SDR notes. The teaching point: a move done right is scheduled BACKWARD from the move date, and the first domino is the internet circuit at the new site — 30 to 60+ days of lead time in many buildings, sometimes longer. Everything else (network build, cabling, Wi-Fi, phones, the move-weekend cutover) hangs off that. The quiet upsell built into this slide: a move is the cheapest moment to fix infrastructure debt — aging switches, messy cabling, dead-spot Wi-Fi get fixed in transit instead of as separate projects later. PROBES: how real is the move — lease being shopped, signed, or just discussed? Target date? Same city? Bigger or smaller footprint? Who is the internal owner of the move? If the move is within 6 months, say plainly: circuit orders should go in soon — whoever handles their IT.",
  proof:
    "Proof, not promises — three real, anonymized Technijian engagements; offer references. Walk fast and tie each to AFC: (1) an Orange County nonprofit's cloud email migration — planned, migrated, verified, and supported with user training after cutover, about 26 engineering hours — the same world AFC just lived through, and we handle the after-care that makes it stick; (2) an 18-workstation fleet upgraded over a single weekend with preconfigured spares — almost exactly AFC's fleet size, and the discipline a move-weekend cutover needs; (3) a multi-site medical group where we run the full platform — phones, servers, endpoints, Microsoft 365 — with monthly patch discipline and documented evidence, zero patient-facing downtime in 12 months — that's what month six with us looks like. If asked \"have you worked with food banks / food recovery?\": be honest — we serve Orange County nonprofits and SMBs across industries; the food-recovery mission is new to us, and the IT underneath it is the work we do every week. RELEVANCE HOOK: their jurisdiction contracts (Ventura County, Garden Grove, Arcata, Sacramento alliance) make them effectively a government contractor — those contracts ride on auditable data trails, reliable reporting, and increasingly on security riders. Documented patch evidence and independent backup aren't IT niceties for Abound; they're contract hygiene.",
  stack:
    "Keep this short — one partner, five doors, and they'd start with two: My IT + My Security as the foundation (that's the per-person stack on the next slide). My Office is where the Microsoft 365 optimization lives; My Continuity is backup and recovery; My Jian is the plain-language monthly report — point at it as the standing answer to their communication pain. Don't pitch AI, SEO, or development in this meeting — wrong altitude for a support-quality evaluation. If they ask about compliance (donor data, health-system partners), note we run HIPAA-aware practices for healthcare clients and can fold a compliance review into the assessment.",
  pricing:
    "She didn't raise price with Jannea — service quality is the driver — but any provider evaluation lands on \"what would this cost,\" so show HOW the number gets built with real list prices before she has to ask. Walk the per-person stack so ~$87 feels earned: endpoint security + email security + Microsoft 365 backup + training + managed help desk. The 15-person line is ILLUSTRATIVE — say \"swap in your real headcount and that's the shape of your monthly.\" Microsoft 365 nonprofit licensing is separate (Microsoft bills it) and we verify they're on nonprofit pricing as part of onboarding. IF SHE SHARES THE INCUMBENT'S PRICE: do not react, do not discount on the spot — \"useful, thank you — the quote after the free assessment will be apples-to-apples.\" We win on the system (closure, root cause, communication), not on being the cheapest. NEVER discuss internal economics or staffing model costs — only their investment. The exact quote follows the free assessment and is timed to their contract window. BUDGET SENSITIVITY: they're a small nonprofit running lean (public filings show recent deficit years) — emphasize flat predictable monthly, right-sized scope (\"nothing you don't need\"), and that the nonprofit licensing check often finds real savings on the Microsoft side. Frame the investment as protecting the systems their jurisdiction contracts and grants depend on.",
  engage:
    "Lower the stakes — this slide exists to make evaluating us feel safe while under contract. Say it plainly: \"You're under contract — that's fine. Steps one through three are free, and the findings are yours either way.\" The Nexus Assess: internal + external vulnerability scan plus a Microsoft 365 review, coordinated with their team, light touch on day-to-day operations. The output is a prioritized, plain-English roadmap — leverage for them no matter what they decide (even to hold the incumbent accountable). The structured switch only happens if they choose it: documented onboarding, managed credential and knowledge handover, the pod learns the environment before day one, support never gaps. If asked \"how disruptive is switching?\": honest answer — the handover is mostly invisible to staff; the visible change is that tickets start closing with confirmation.",
  nextSteps:
    "Close on ONE thing: book the free assessment — propose a specific window (\"could we get the scan scheduled in the next two weeks?\"). Offer the IT Provider Accountability Checklist as a give-away no matter what — ten questions to hold ANY provider accountable, current one included; it keeps goodwill if they're not ready and it frames the evaluation criteria in our favor when she forwards it. Confirm logistics: best email (ebustos@aboundfoodcare.org), who should be on the findings review, and whether the Executive Director wants the roadmap presented live. End warm and local: we're in Irvine, minutes from their Santa Ana office; on-site is easy. SAME DAY: send the recap email with the checklist attached and two proposed assessment windows.",
};

// ============ HELPERS ============

function hLine(slide, x, y, w, color = COLORS.line, thickness = 0.012) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: thickness,
    fill: { color },
    line: { color, transparency: 100 },
  });
}

// Real PNG logo. w in inches; height derived from aspect ratio.
function addLogo(slide, x, y, w, dark = false) {
  slide.addImage({
    path: dark ? LOGO_DARK : LOGO_LIGHT,
    x, y, w, h: w / LOGO_AR,
  });
}

function addFooter(slide, page) {
  hLine(slide, 0.5, 7.05, 12.35, COLORS.line, 0.012);
  slide.addText("Technijian  |  For Abound Food Care  |  First Conversation  |  2026-06", {
    x: 0.55, y: 7.1, w: 9.0, h: 0.25,
    fontFace: "Arial", fontSize: 9, color: COLORS.grey, margin: 0,
  });
  slide.addText(`${page}`, {
    x: 12.2, y: 7.08, w: 0.6, h: 0.25,
    fontFace: "Arial", fontSize: 10, bold: true, align: "right",
    color: COLORS.blue, margin: 0,
  });
}

function addHeader(slide, eyebrow, title, subtitle, page, accent = COLORS.blue) {
  slide.background = { color: COLORS.offWhite };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.18,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
  addLogo(slide, 0.55, 0.3, 1.75, false);
  slide.addText(eyebrow.toUpperCase(), {
    x: 0.55, y: 0.92, w: 9.0, h: 0.28,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: accent, charSpace: 0.5, margin: 0,
  });
  slide.addText(title, {
    x: 0.55, y: 1.18, w: 12.4, h: 0.55,
    fontFace: "Arial", fontSize: 22, bold: true,
    color: COLORS.dark, margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.55, y: 1.7, w: 12.4, h: 0.35,
      fontFace: "Arial", fontSize: 11, color: COLORS.slate, margin: 0,
    });
  }
  hLine(slide, 0.55, 2.05, 12.25, COLORS.line, 0.01);
  addFooter(slide, page);
}

function addCard(slide, card) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: card.x, y: card.y, w: card.w, h: card.h,
    rectRadius: 0.08,
    fill: { color: card.fill || COLORS.white },
    line: { color: card.line || card.fill || COLORS.line, pt: 1 },
  });
  if (card.band) {
    slide.addShape(pptx.ShapeType.rect, {
      x: card.x, y: card.y, w: card.w, h: 0.1,
      fill: { color: card.band },
      line: { color: card.band, transparency: 100 },
    });
  }
  if (card.label) {
    slide.addText(card.label.toUpperCase(), {
      x: card.x + 0.18, y: card.y + 0.2, w: card.w - 0.36, h: 0.22,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: card.labelColor || card.band || COLORS.blue,
      charSpace: 0.4, margin: 0,
    });
  }
  if (card.title) {
    slide.addText(card.title, {
      x: card.x + 0.18, y: card.y + 0.44, w: card.w - 0.36, h: card.titleH || 0.42,
      fontFace: "Arial", fontSize: card.titleSize || 16, bold: true,
      color: card.titleColor || COLORS.dark, margin: 0,
    });
  }
  if (card.body) {
    const reserveBottom = card.footer ? 0.45 : 0.15;
    slide.addText(card.body, {
      x: card.x + 0.18, y: card.y + (card.bodyY || 0.86),
      w: card.w - 0.36, h: card.h - (card.bodyY || 0.86) - reserveBottom,
      fontFace: "Arial", fontSize: card.bodySize || 10.5,
      color: card.bodyColor || COLORS.slate,
      valign: "top", margin: 0, breakLine: false,
    });
  }
  if (card.footer) {
    slide.addText(card.footer, {
      x: card.x + 0.18, y: card.y + card.h - 0.38,
      w: card.w - 0.36, h: 0.28,
      fontFace: "Arial", fontSize: 9, bold: true, italic: true,
      color: card.band || COLORS.blue, margin: 0,
    });
  }
}

// ============ SLIDES ============

// SLIDE 1 — COVER
function coverSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.1, w: 13.33, h: 0.4, fill: { color: COLORS.blue },
    line: { color: COLORS.blue, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.5, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 88 },
    line: { color: COLORS.teal, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: 5, w: 5, h: 5, fill: { color: COLORS.orange, transparency: 92 },
    line: { color: COLORS.orange, transparency: 100 },
  });
  addLogo(slide, 0.7, 0.8, 2.7, true);
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.45, y: 0.95, w: 3.15, h: 0.32, rectRadius: 0.04,
    fill: { color: COLORS.dark, transparency: 30 },
    line: { color: COLORS.teal, pt: 0.75 },
  });
  slide.addText("PREPARED FOR ABOUND FOOD CARE", {
    x: 9.45, y: 0.95, w: 3.15, h: 0.32,
    fontFace: "Arial", fontSize: 8.5, bold: true, color: COLORS.teal,
    align: "center", valign: "mid", charSpace: 1, margin: 0,
  });
  slide.addText("Technijian", {
    x: 0.7, y: 2.3, w: 12, h: 0.95,
    fontFace: "Arial", fontSize: 52, bold: true, color: COLORS.white,
    margin: 0,
  });
  slide.addText("for Abound Food Care", {
    x: 0.7, y: 3.25, w: 12.2, h: 0.7,
    fontFace: "Arial", fontSize: 30, bold: true, color: COLORS.orange,
    margin: 0,
  });
  slide.addText("A working conversation about IT support that resolves, communicates, and plans ahead.", {
    x: 0.7, y: 4.15, w: 11.8, h: 0.5,
    fontFace: "Arial", fontSize: 18, color: COLORS.white, margin: 0,
    transparency: 18,
  });
  hLine(slide, 0.7, 5.2, 11.9, COLORS.teal, 0.018);
  slide.addText("First Meeting  |  Ravi Jain ↔ Esmeralda Bustos  |  June 11, 2026 · Teams", {
    x: 0.7, y: 5.35, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0,
  });
  slide.addText("15-computer environment  ·  Newly on Microsoft 365  ·  An office move on the horizon", {
    x: 0.7, y: 5.72, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 11, bold: true, color: COLORS.teal, margin: 0,
  });
  slide.addText("technology as a solution  ·  18 Technology Dr. Ste 141, Irvine CA 92618  ·  technijian.com  ·  949.379.8499", {
    x: 0.7, y: 6.08, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 10, color: COLORS.white, margin: 0,
    transparency: 40,
  });
  slide.addNotes(NOTES.cover);
}

// SLIDE 2 — AGENDA
function agendaSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Agenda",
    "What we'd like to cover today",
    "A working conversation, not a pitch. You told us exactly where support falls short — that's where we'll spend the time.",
    2, COLORS.blue);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 2.35, w: 4.0, h: 4.5, rectRadius: 0.08,
    fill: { color: COLORS.dark },
    line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 2.35, w: 4.0, h: 0.1,
    fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText("OUR GOAL TODAY", {
    x: 0.78, y: 2.65, w: 3.6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText("Understand how technology supports Abound's mission and team — and leave you with a clear, free way to evaluate your options without disrupting what you have today.", {
    x: 0.78, y: 3.05, w: 3.5, h: 1.9,
    fontFace: "Arial", fontSize: 14, color: COLORS.white, valign: "top", margin: 0, transparency: 8,
  });
  slide.addText([
    { text: "You know your organization.\n", options: { bold: true, color: COLORS.teal, fontSize: 12 } },
    { text: "We bring straight answers about what good IT support should look like.", options: { color: COLORS.white, fontSize: 12, transparency: 15 } },
  ], {
    x: 0.78, y: 5.55, w: 3.5, h: 1.1, valign: "top", margin: 0,
  });

  const items = [
    { t: "What we heard from you", d: "Fifteen computers, a provider that's responsive but issues that recur — said back to make sure we got it right." },
    { t: "Responsive isn't the same as resolved", d: "Why quick support can still leave the same problems coming back — and what closure actually looks like." },
    { t: "How we run support", d: "A named team, tickets that close only when you confirm, recommendations in writing — communication as a system." },
    { t: "Getting full value from Microsoft 365", d: "You just made the move from Google. Securing, right-licensing, and finishing it — including nonprofit pricing." },
    { t: "The office move, done as a project", d: "Circuits ordered early, a planned cutover weekend, and a Monday morning where everything just works." },
    { t: "A free first step", d: "A no-cost IT and security assessment you can run while under contract — the findings are yours either way." },
  ];
  items.forEach((it, i) => {
    const y = 2.4 + i * 0.74;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4.8, y, w: 0.55, h: 0.55, rectRadius: 0.1,
      fill: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal },
      line: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal, transparency: 100 },
    });
    slide.addText(`${i + 1}`, {
      x: 4.8, y, w: 0.55, h: 0.55,
      fontFace: "Arial", fontSize: 20, bold: true, color: COLORS.white,
      align: "center", valign: "mid", margin: 0,
    });
    slide.addText(it.t, {
      x: 5.55, y: y - 0.02, w: 7.2, h: 0.3,
      fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(it.d, {
      x: 5.55, y: y + 0.27, w: 7.25, h: 0.4,
      fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, margin: 0, valign: "top",
    });
  });
  slide.addNotes(NOTES.agenda);
}

// SLIDE 3 — WHAT WE HEARD
function situationSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "What we heard",
    "Your situation, said back to you",
    "From your conversation with Jannea. Today we fill in the details — please correct anything we have wrong.",
    3, COLORS.teal);

  const stats = [
    { n: "15", l: "Computers under support today" },
    { n: "3", l: "Recurring issues · raised, still unresolved" },
    { n: "NEW", l: "To Microsoft 365 · moved from Google" },
    { n: "1", l: "Office move on the horizon" },
  ];
  stats.forEach((s, i) => {
    const x = 0.55 + i * 3.06;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.35, w: 2.86, h: 1.35, rectRadius: 0.08,
      fill: { color: COLORS.dark },
      line: { color: COLORS.dark, transparency: 100 },
    });
    slide.addText(s.n, {
      x, y: 2.48, w: 2.86, h: 0.65,
      fontFace: "Arial", fontSize: 30, bold: true,
      color: COLORS.orange, align: "center", margin: 0, valign: "mid",
    });
    slide.addText(s.l.toUpperCase(), {
      x: x + 0.1, y: 3.16, w: 2.66, h: 0.45,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: COLORS.white, align: "center", margin: 0, charSpace: 0.6,
      transparency: 25, valign: "top",
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 3.95, w: 12.25, h: 2.8, rectRadius: 0.08,
    fill: { color: COLORS.white },
    line: { color: COLORS.line, pt: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 3.95, w: 0.12, h: 2.8,
    fill: { color: COLORS.teal },
    line: { color: COLORS.teal, transparency: 100 },
  });
  slide.addText("WHAT THAT MEANS", {
    x: 0.85, y: 4.15, w: 11.6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.teal, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "Responsive support, unresolved problems. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Your provider answers quickly — and you said so. But recommendations that don't fully fix things, miscommunication between technicians and staff, and tickets closed before the work is done mean the same issues keep coming back.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "You already did the hard part: you raised it. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "These issues continued after being addressed with the provider — which is exactly when an organization has earned the right to look at its options.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "Two big transitions ahead. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "A new Microsoft 365 environment to secure and adopt, and a possible office move to plan. The next year needs a partner who plans ahead — not one who reacts quickly.", options: { color: COLORS.slate, fontSize: 12.5 } },
  ], {
    x: 0.85, y: 4.5, w: 11.7, h: 2.1,
    valign: "top", margin: 0,
  });
  slide.addNotes(NOTES.situation);
}

// SLIDE 4 — THE CORE IDEA (responsive vs resolved)
function coreIdeaSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The core idea",
    "Responsive isn't the same as resolved",
    "Fast answers measure speed. Resolution measures whether the problem ever comes back. The gap between the two is process — and process can be fixed.",
    4, COLORS.blue);

  const cols = [
    { title: "The pattern you described", sub: "(in your own words)", band: COLORS.grey, items: [
      "Quick responses — but recommendations that don't fully resolve the problem",
      "The same issues recurring after they've been “fixed”",
      "Tickets closed or left incomplete without anyone confirming",
      "Technicians and staff talking past each other",
      "Issues raised with the provider — and the pattern continuing anyway",
    ] },
    { title: "What good looks like", sub: "(support built to close the loop)", band: COLORS.orange, items: [
      "Every problem traced to its root cause and fixed once",
      "Recommendations in writing — problem, fix, owner, and date",
      "Tickets close only when the person who raised them confirms",
      "One named team that already knows your environment",
      "A standing review where leadership holds the provider accountable",
    ] },
  ];
  cols.forEach((c, i) => {
    const x = 0.55 + i * 3.05;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.3, w: 2.85, h: 4.5, rectRadius: 0.08,
      fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 2.3, w: 2.85, h: 0.1, fill: { color: c.band }, line: { color: c.band, transparency: 100 },
    });
    slide.addText(c.title, {
      x: x + 0.18, y: 2.5, w: 2.5, h: 0.32,
      fontFace: "Arial", fontSize: 14.5, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(c.sub, {
      x: x + 0.18, y: 2.82, w: 2.5, h: 0.28,
      fontFace: "Arial", fontSize: 10, italic: true, color: c.band, margin: 0,
    });
    c.items.forEach((it, idx) => {
      const ty = 3.25 + idx * 0.7;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2, y: ty + 0.06, w: 0.1, h: 0.1,
        fill: { color: c.band }, line: { color: c.band, transparency: 100 },
      });
      slide.addText(it, {
        x: x + 0.38, y: ty, w: 2.32, h: 0.66,
        fontFace: "Arial", fontSize: 10, color: COLORS.slate, valign: "top", margin: 0,
      });
    });
  });

  const takeaways = [
    { n: "1", t: "It's a process problem, not a people problem", d: "Communication breakdowns and unconfirmed closures aren't bad luck — they're what happens when no system enforces ownership and follow-through. Good providers engineer the loop closed.", c: COLORS.blue },
    { n: "2", t: "Recurring issues are a root-cause signal", d: "When a recommendation doesn't resolve the problem, the symptom got treated and the cause stayed. A root-cause review fixes it once — and documents why.", c: COLORS.teal },
    { n: "3", t: "Evaluating costs you nothing", d: "You're under contract, and that's fine. A free, structured assessment gives you a prioritized picture of your environment — useful whichever provider you choose.", c: COLORS.orange },
  ];
  takeaways.forEach((tk, i) => {
    const y = 2.3 + i * 1.52;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.78, y, w: 6.02, h: 1.38, rectRadius: 0.08,
      fill: { color: COLORS.offWhite }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.95, y: y + 0.2, w: 0.75, h: 0.75, rectRadius: 0.1,
      fill: { color: tk.c }, line: { color: tk.c, transparency: 100 },
    });
    slide.addText(tk.n, {
      x: 6.95, y: y + 0.2, w: 0.75, h: 0.75,
      fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white,
      align: "center", valign: "mid", margin: 0,
    });
    slide.addText(tk.t, {
      x: 7.85, y: y + 0.12, w: 4.85, h: 0.34,
      fontFace: "Arial", fontSize: 13, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(tk.d, {
      x: 7.85, y: y + 0.46, w: 4.85, h: 0.86,
      fontFace: "Arial", fontSize: 9.8, color: COLORS.slate, valign: "top", margin: 0,
    });
  });
  slide.addNotes(NOTES.coreIdea);
}

// SLIDE 5 — HOW WE RUN SUPPORT (the differentiator)
function supportSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "How we run support",
    "Built so nothing falls through the cracks",
    "Each of these exists because of a story like yours. Together they're the system that keeps communication from breaking down.",
    5, COLORS.orange);

  const cards = [
    { title: "A named pod, not a queue", band: COLORS.blue, body: "The same dedicated Technijian team every time — they know your people, your setup, and your history, so your staff never starts a ticket by re-explaining everything." },
    { title: "Tickets that close properly", band: COLORS.teal, body: "Every ticket has one owner and a plain-English status — and it closes only when the person who raised it confirms the problem is actually fixed." },
    { title: "Root-cause discipline", band: COLORS.orange, body: "An issue that comes back triggers a root-cause review, not a third quick fix. We fix it once, document what caused it, and show you the evidence." },
    { title: "Recommendations in writing", band: COLORS.green, body: "Every recommendation states the problem, the fix, the investment, an owner, and a date — then gets tracked to done. No more advice that evaporates." },
    { title: "A quarterly review with leadership", band: COLORS.chartreuse, body: "A standing sit-down: what broke, what we fixed, what's coming — including office-move planning. You hold us accountable with data, not anecdotes." },
    { title: "Plain-language reporting", band: COLORS.dark, body: "A monthly report a non-technical leader can actually read: what happened, what it means, what we're doing about it. Proof the system is working." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.28 + Math.floor(i / 3) * 2.22;
    addCard(slide, {
      x, y, w: 3.95, h: 2.1, band: c.band,
      label: `0${i + 1}`, title: c.title, body: c.body,
      titleSize: 14.5, bodySize: 10.3,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32, rectRadius: 0.05,
    fill: { color: COLORS.paleOrange }, line: { color: COLORS.orange, pt: 0.75 },
  });
  slide.addText("You shouldn't have to chase your IT provider. The system should chase the work.", {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32,
    fontFace: "Arial", fontSize: 10.5, bold: true, color: COLORS.dark,
    align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.support);
}

// SLIDE 6 — MICROSOFT 365 AFTER THE MOVE FROM GOOGLE
function m365Slide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "You just moved to Microsoft",
    "A migration is done when it's secured, right-licensed, and adopted",
    "Most organizations land on Microsoft 365 functional but not finished. Six things worth checking now — the free assessment covers all of them.",
    6, COLORS.teal);

  const cards = [
    { title: "Security baseline", band: COLORS.blue, body: "Multi-factor authentication for everyone, sensible sign-in policies, and safe sharing defaults — the settings a migration rarely turns on by itself." },
    { title: "Nonprofit licensing check", band: COLORS.teal, body: "Microsoft offers significant nonprofit pricing and grants. We verify you're on the right plans at the right price — many migrated orgs quietly overpay." },
    { title: "Independent backup", band: COLORS.orange, body: "Microsoft's retention is not a backup. A deleted mailbox, a compromised account, or an honest mistake past the window is gone — unless it's independently backed up." },
    { title: "Email & domain protection", band: COLORS.green, body: "Anti-phishing filtering plus DMARC/DKIM on your domain — so no one can impersonate Abound to your donors, partners, or vendors." },
    { title: "Team adoption", band: COLORS.chartreuse, body: "Teams, SharePoint, and OneDrive set up the way your team actually works — and short, human training so the Google habits transfer instead of frustrate." },
    { title: "Google leftovers, retired cleanly", band: COLORS.dark, body: "Drive files, shared docs, calendars, and old accounts still half-alive on Google get migrated or retired on purpose — no orphaned data, no surprise renewals." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.28 + Math.floor(i / 3) * 2.22;
    addCard(slide, {
      x, y, w: 3.95, h: 2.1, band: c.band,
      label: `0${i + 1}`, title: c.title, body: c.body,
      titleSize: 14.5, bodySize: 10.3,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32, rectRadius: 0.05,
    fill: { color: COLORS.paleTeal }, line: { color: COLORS.teal, pt: 0.75 },
  });
  slide.addText("Every one of these is checked in the free assessment — you'll know exactly where your new environment stands.", {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32,
    fontFace: "Arial", fontSize: 10.5, bold: true, color: COLORS.dark,
    align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.m365);
}

// SLIDE 7 — THE OFFICE MOVE
function moveSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The office move",
    "A move is a project — and the calendar is the hard part",
    "Done right, a move schedules backward from moving day. Done late, it's weeks of workarounds. Six things that make the difference.",
    7, COLORS.blue);

  const cards = [
    { title: "Circuits first", band: COLORS.blue, body: "Business internet at the new site has the longest lead time — often 30 to 60+ days. The circuit order is the first domino; everything else schedules behind it." },
    { title: "Walk the space early", band: COLORS.teal, body: "Network, Wi-Fi coverage, and cabling planned from the floor plan — sized to how your team actually sits and works, not patched after move-in." },
    { title: "Build before you move", band: COLORS.orange, body: "Firewall, switches, and Wi-Fi installed and tested at the new site while the old office still runs — so moving day is a cutover, not a construction project." },
    { title: "Phones move with you", band: COLORS.green, body: "Your numbers, auto-attendant, and call flow transfer without a gap — donors and partners never hit a dead line." },
    { title: "The move-weekend cutover", band: COLORS.chartreuse, body: "Equipment moves over a weekend on a written runbook with a fallback plan. Monday morning, your team sits down and works." },
    { title: "Fix debt in transit", band: COLORS.dark, body: "A move is the cheapest moment to retire aging switches, messy cabling, and dead-spot Wi-Fi — improvements ride along instead of becoming separate projects." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.28 + Math.floor(i / 3) * 2.22;
    addCard(slide, {
      x, y, w: 3.95, h: 2.1, band: c.band,
      label: `0${i + 1}`, title: c.title, body: c.body,
      titleSize: 14.5, bodySize: 10.3,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32, rectRadius: 0.05,
    fill: { color: COLORS.paleBlue }, line: { color: COLORS.blue, pt: 0.75 },
  });
  slide.addText("Tell us the target date — we'll build the timeline backward from it, whoever ends up running your IT.", {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32,
    fontFace: "Arial", fontSize: 10.5, bold: true, color: COLORS.blue,
    align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.move);
}

// SLIDE 8 — PROOF
function proofSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Proof, not promises",
    "We do this work for organizations like yours today",
    "Three real Technijian engagements — anonymized for confidentiality, references available on request.",
    8, COLORS.teal);

  const cards = [
    {
      band: COLORS.blue, label: "Orange County nonprofit",
      stat: "Cloud email move · planned, run, supported",
      title: "Microsoft 365 mailbox migration",
      body: "Planned and ran a nonprofit's move to Microsoft 365 — pre-staged migration, verification of every mailbox, and post-migration user training and support, about 26 engineering hours in all. The discipline a cloud transition needs to actually stick.",
    },
    {
      band: COLORS.orange, label: "Professional office · 18 endpoints",
      stat: "One weekend · whole fleet upgraded",
      title: "Windows 11 cutover, zero business-hours disruption",
      body: "Rolled an 18-workstation fleet from Windows 10 to 11 over a single weekend — preconfigured spares on standby and a structured second pass for stragglers. Almost exactly your fleet size, and the same discipline a move weekend takes.",
    },
    {
      band: COLORS.teal, label: "Multi-site medical group",
      stat: "12 months · zero patient-facing downtime",
      title: "Full platform operations, month after month",
      body: "Phones, servers, endpoints, and Microsoft 365 run as one platform — monthly patch discipline with documented evidence, in a setting where downtime is never acceptable. This is what steady state with us looks like.",
    },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + i * 4.16;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.3, w: 3.95, h: 3.75, rectRadius: 0.08,
      fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 2.3, w: 3.95, h: 0.1, fill: { color: c.band }, line: { color: c.band, transparency: 100 },
    });
    slide.addText(c.label.toUpperCase(), {
      x: x + 0.18, y: 2.5, w: 3.6, h: 0.22,
      fontFace: "Arial", fontSize: 9, bold: true, color: c.band, charSpace: 0.4, margin: 0,
    });
    slide.addText(c.stat, {
      x: x + 0.18, y: 2.76, w: 3.6, h: 0.55,
      fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0, valign: "top",
    });
    hLine(slide, x + 0.18, 3.38, 3.59, c.band, 0.014);
    slide.addText(c.title, {
      x: x + 0.18, y: 3.5, w: 3.6, h: 0.5,
      fontFace: "Arial", fontSize: 11.5, bold: true, color: c.band, margin: 0, valign: "top",
    });
    slide.addText(c.body, {
      x: x + 0.18, y: 4.0, w: 3.6, h: 1.95,
      fontFace: "Arial", fontSize: 10, color: COLORS.slate, valign: "top", margin: 0,
    });
  });

  slide.addText("Founded 2000 · Irvine HQ + India delivery center · 24/7 support · a dedicated pod assigned to every client.", {
    x: 0.55, y: 6.35, w: 12.25, h: 0.4,
    fontFace: "Arial", fontSize: 11, italic: true, bold: true, color: COLORS.slate, align: "center", margin: 0,
  });
  slide.addNotes(NOTES.proof);
}

// SLIDE 9 — THE TECHNIJIAN STACK
function stackSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The Technijian stack",
    "One partner, five doors — you'd start with two",
    "Each service stands on its own. For Abound: managed IT and security as the foundation; the rest as needs grow.",
    9, COLORS.orange);

  const services = [
    { title: "My IT", sub: "Managed help desk & monitoring", body: "Help desk + monitoring + patching for every computer, the network, and Microsoft 365 — one number your staff calls, one named pod that answers.", band: COLORS.blue, start: "Start here." },
    { title: "My Security", sub: "24/7 protection", body: "Managed threat detection on every device, email security, MFA everywhere, and 24/7 monitoring — protection sized for a 15-computer nonprofit.", band: COLORS.orange, start: "Start here." },
    { title: "My Office", sub: "Microsoft 365, finished properly", body: "Licensing (including nonprofit pricing), security baseline, Teams and SharePoint adoption, and the last of the Google environment retired cleanly.", band: COLORS.teal },
    { title: "My Continuity", sub: "Backup & recovery", body: "Independent Microsoft 365 backup and tested recovery — a deleted file, a compromised account, or a failed device never costs you a workday.", band: COLORS.chartreuse },
    { title: "My Jian", sub: "Plain-language reporting", body: "Technijian-built monitoring that watches across your stack and produces a monthly report your leadership can actually read — proof it's all working.", band: COLORS.dark },
  ];
  services.forEach((s, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.3 + Math.floor(i / 3) * 2.45;
    addCard(slide, {
      x, y, w: 3.95, h: 2.25, band: s.band,
      label: s.sub, title: s.title, body: s.body,
      footer: s.start || null,
    });
  });
  slide.addNotes(NOTES.stack);
}

// SLIDE 10 — HOW PRICING WORKS (real rate-card numbers)
function pricingSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "How pricing works",
    "Transparent building blocks — no surprises",
    "Real list prices from our standard small-organization packages. Your monthly = your headcount × the stack; the exact quote follows the free assessment.",
    10, COLORS.teal);

  // Left panel — itemized per-person building blocks
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 2.3, w: 7.5, h: 4.05, rectRadius: 0.08,
    fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 2.3, w: 7.5, h: 0.1, fill: { color: COLORS.blue }, line: { color: COLORS.blue, transparency: 100 } });
  slide.addText("WHAT PROTECTS EACH PERSON  ·  PER MONTH", {
    x: 0.78, y: 2.52, w: 7.1, h: 0.28, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.blue, charSpace: 0.4, margin: 0,
  });

  const rows = [
    { l: "Endpoint security — threat detection + DNS filtering + patching + remote support", p: "$26.50" },
    { l: "Email security & anti-phishing", p: "$4.75" },
    { l: "Microsoft 365 cloud backup", p: "$4.00" },
    { l: "Security-awareness training (simulated phishing)", p: "$6.00" },
    { l: "Managed help desk & 24/7 monitoring", p: "~$46" },
  ];
  rows.forEach((r, i) => {
    const y = 2.86 + i * 0.46;
    slide.addText(r.l, {
      x: 0.78, y, w: 6.1, h: 0.44, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "mid", margin: 0,
    });
    slide.addText(r.p, {
      x: 6.95, y, w: 1.0, h: 0.44, fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.dark, align: "right", valign: "mid", margin: 0,
    });
    hLine(slide, 0.78, y + 0.44, 7.05, COLORS.line, 0.008);
  });

  slide.addText("Per person", {
    x: 0.78, y: 5.2, w: 5.0, h: 0.36, fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.blue, valign: "mid", margin: 0,
  });
  slide.addText("≈ $87 / mo", {
    x: 5.5, y: 5.2, w: 2.45, h: 0.36, fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.blue, align: "right", valign: "mid", margin: 0,
  });
  slide.addText("+ Email-domain (DMARC/DKIM) protection — whole organization", {
    x: 0.78, y: 5.62, w: 6.1, h: 0.34, fontFace: "Arial", fontSize: 10, italic: true, color: COLORS.grey, valign: "mid", margin: 0,
  });
  slide.addText("$20 / mo", {
    x: 6.95, y: 5.62, w: 1.0, h: 0.34, fontFace: "Arial", fontSize: 10.5, bold: true, italic: true, color: COLORS.grey, align: "right", valign: "mid", margin: 0,
  });
  slide.addText("Microsoft 365 licenses are billed by Microsoft — on nonprofit pricing, which we verify you're getting.", {
    x: 0.78, y: 5.98, w: 7.1, h: 0.32, fontFace: "Arial", fontSize: 9.5, italic: true, color: COLORS.grey, valign: "top", margin: 0,
  });

  // Right panel — how the number gets built
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.25, y: 2.3, w: 4.55, h: 4.05, rectRadius: 0.08,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, { x: 8.25, y: 2.3, w: 4.55, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("HOW YOUR NUMBER GETS BUILT", {
    x: 8.48, y: 2.52, w: 4.1, h: 0.28, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.4, margin: 0,
  });
  slide.addText("≈ $87", {
    x: 8.48, y: 2.82, w: 4.1, h: 0.7, fontFace: "Arial", fontSize: 44, bold: true, color: COLORS.white, margin: 0,
  });
  slide.addText("per person / month — the managed stack", {
    x: 8.48, y: 3.52, w: 4.1, h: 0.3, fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.teal, margin: 0,
  });
  slide.addText("Illustration only: a 15-person organization ≈ $1,330/mo. Swap in your real headcount and that's the shape of your monthly.", {
    x: 8.48, y: 3.86, w: 4.05, h: 0.6, fontFace: "Arial", fontSize: 10.5, color: COLORS.white, valign: "top", margin: 0, transparency: 15 });
  hLine(slide, 8.48, 4.5, 4.05, COLORS.teal, 0.01);
  const pts = [
    "Flat, predictable monthly — billed per person, every line shown.",
    "Exact quote after the free assessment — sized to what we actually find, nothing you don't need.",
    "Timed to your current contract window — no overlap you don't choose.",
  ];
  pts.forEach((p, i) => {
    const y = 4.64 + i * 0.56;
    slide.addShape(pptx.ShapeType.ellipse, { x: 8.48, y: y + 0.06, w: 0.1, h: 0.1, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
    slide.addText(p, { x: 8.66, y, w: 3.95, h: 0.54, fontFace: "Arial", fontSize: 10, color: COLORS.white, valign: "top", margin: 0, transparency: 10 });
  });

  slide.addText("Real Technijian list prices from our standard small-organization packages; the 15-person figure is illustrative only. Your fixed monthly follows the free assessment.", {
    x: 0.55, y: 6.5, w: 12.25, h: 0.4,
    fontFace: "Arial", fontSize: 9.5, italic: true, color: COLORS.grey, align: "center", margin: 0,
  });
  slide.addNotes(NOTES.pricing);
}

// SLIDE 11 — HOW WE'D ENGAGE
function engageSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "How we'd engage",
    "Evaluating us is free — and doesn't disturb what you have",
    "Every step is gated. You see the findings and the quote before deciding anything — and you're under contract, which is fine.",
    11, COLORS.blue);

  const phases = [
    { n: "01", t: "Today's conversation", d: "What's working, what isn't, and what the next year holds — the move, Microsoft 365, growth. No commitment, no homework.", c: COLORS.orange },
    { n: "02", t: "Free assessment", d: "Our Nexus Assess: internal + external vulnerability scan plus a Microsoft 365 review — coordinated with your team, light touch on daily operations.", c: COLORS.blue },
    { n: "03", t: "Findings & a scoped quote", d: "A prioritized, plain-English roadmap of what we found, plus a fixed monthly quote sized to your real environment and timed to your contract window.", c: COLORS.teal },
    { n: "04", t: "A structured switch — if you choose it", d: "Documented onboarding, managed credential and knowledge handover, and a pod that learns your environment before day one. Support never gaps.", c: COLORS.chartreuse },
  ];
  phases.forEach((p, i) => {
    const x = 0.55 + i * 3.12;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2, y: 2.4, w: 0.95, h: 0.95, rectRadius: 0.1,
      fill: { color: p.c }, line: { color: p.c, transparency: 100 },
    });
    slide.addText(p.n, {
      x: x + 0.2, y: 2.4, w: 0.95, h: 0.95,
      fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white,
      align: "center", valign: "mid", margin: 0,
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.6, w: 2.92, h: 2.95, rectRadius: 0.08,
      fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 3.6, w: 2.92, h: 0.06, fill: { color: p.c }, line: { color: p.c, transparency: 100 },
    });
    slide.addText(p.t, {
      x: x + 0.18, y: 3.8, w: 2.56, h: 0.65,
      fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0, valign: "top",
    });
    slide.addText(p.d, {
      x: x + 0.18, y: 4.45, w: 2.56, h: 2.0,
      fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0,
    });
    if (i < 3) {
      slide.addText("→", {
        x: x + 2.7, y: 2.65, w: 0.55, h: 0.55,
        fontFace: "Arial", fontSize: 28, bold: true, color: COLORS.line,
        align: "center", valign: "mid", margin: 0,
      });
    }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.68, w: 12.25, h: 0.32, rectRadius: 0.05,
    fill: { color: COLORS.paleBlue }, line: { color: COLORS.blue, pt: 0.5 },
  });
  slide.addText("Steps 1–3 are free and commitment-free. The findings are yours to keep — useful even if you decide to stay put.", {
    x: 0.55, y: 6.68, w: 12.25, h: 0.32,
    fontFace: "Arial", fontSize: 9.5, bold: true, color: COLORS.blue, align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.engage);
}

// SLIDE 12 — NEXT STEPS
function nextStepsSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.blue };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLORS.dark, transparency: 70 },
    line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.5, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 88 },
    line: { color: COLORS.teal, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 },
  });
  addLogo(slide, 0.55, 0.4, 2.2, true);
  slide.addText("NEXT STEP", {
    x: 0.55, y: 1.05, w: 6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "One next step. ", options: { color: COLORS.white, bold: true } },
    { text: "No commitment.", options: { color: COLORS.orange, bold: true } },
  ], {
    x: 0.55, y: 1.35, w: 12, h: 0.7,
    fontFace: "Arial", fontSize: 34, margin: 0,
  });

  const opts = [
    { tag: "Recommended", title: "Free Nexus Assess — IT & security review", body: "Internal + external vulnerability scan plus a Microsoft 365 review, scheduled in the next two weeks. You get a prioritized, plain-English roadmap — free, no contract, yours to keep and act on with us or anyone.", band: COLORS.teal },
    { tag: "You keep this either way", title: "The IT Provider Accountability Checklist", body: "One page, ten questions any organization should be able to ask its IT provider — about ticket closure, root cause, written recommendations, and move planning. Useful with your current provider, or your next one.", band: COLORS.orange },
  ];
  opts.forEach((o, i) => {
    const x = 0.55 + i * 6.4;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.55, w: 6.1, h: 2.8, rectRadius: 0.08,
      fill: { color: COLORS.white, transparency: 88 },
      line: { color: o.band, pt: 1 },
    });
    slide.addText(o.tag.toUpperCase(), {
      x: x + 0.25, y: 2.7, w: 5.6, h: 0.25,
      fontFace: "Arial", fontSize: 10, bold: true, color: o.band, charSpace: 0.5, margin: 0,
    });
    slide.addText(o.title, {
      x: x + 0.25, y: 2.95, w: 5.6, h: 0.75,
      fontFace: "Arial", fontSize: 17, bold: true, color: COLORS.white, margin: 0, valign: "top",
    });
    slide.addText(o.body, {
      x: x + 0.25, y: 3.72, w: 5.6, h: 1.55,
      fontFace: "Arial", fontSize: 11.5, color: COLORS.white, valign: "top", margin: 0, transparency: 14,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85, rectRadius: 0.4,
    fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText([
    { text: "Book your free assessment   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 10 } },
  ], {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85,
    align: "center", valign: "mid", margin: 0,
  });

  slide.addText("technology as a solution  ·  18 Technology Dr. Ste 141, Irvine CA 92618 — minutes from your Santa Ana office  ·  On-site across Orange County", {
    x: 0.55, y: 6.75, w: 12.2, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white,
    align: "center", margin: 0, transparency: 35,
  });
  slide.addNotes(NOTES.nextSteps);
}

// ============ MAIN ============

coverSlide();
agendaSlide();
situationSlide();
coreIdeaSlide();
supportSlide();
m365Slide();
moveSlide();
proofSlide();
stackSlide();
pricingSlide();
engageSlide();
nextStepsSlide();

pptx.writeFile({ fileName: outPath }).then(filename => {
  console.log(`  Wrote ${filename}`);
});
