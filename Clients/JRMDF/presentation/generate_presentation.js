const path = require("path");
const PptxGenJS = require("C:/vscode/tech-branding/tech-branding/Clients/CDLX/presentation/node_modules/pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for Javier Romero, MD FACS — IT Discovery for a New Surgical Sub-Specialty Clinic";
pptx.title = "Technijian for Javier Romero, MD FACS";
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

const outPath = path.resolve(__dirname, "Technijian for Dr. Javier Romero - IT Discovery Deck.pptx");

// ============ SPEAKER NOTES (presenter-facing; not shown on slides) ============
const NOTES = {
  cover:
    "OPEN WARM. Dr. Romero booked this himself through technijian.com — thank him for reaching out and respect his time; he's a practicing surgeon. PREP CONTEXT (verify naturally, don't recite his CV at him): we believe he's the Ventura trauma / critical-care + minimally-invasive surgeon — Anacapa Surgical Associates, Director of Surgical Critical Care at Ventura County Medical Center, and surgery program director at Community Memorial. His 805 number fits Ventura. His three named systems map to his likely affiliations: VCMC runs Cerner, Community Memorial runs Epic (MyChart), Kaiser runs Epic. Frame today as a working discovery conversation: he told us exactly what he needs — software interfaces to Cerner / Epic / Kaiser and infrastructure for a brand-new clinic — so today is about understanding the clinic well enough to design it right.",
  agenda:
    "Set expectations: six quick stops. Say it plainly: \"You told us two things — you need the clinic's infrastructure built, and you need to work across Cerner, Epic, and Kaiser. We'll cover how we'd approach both, then what discovery looks like.\" Then hand him the wheel: \"What would make this half-hour most useful to you?\" Let his priorities reorder the talk. If he's short on time, slides 5 (interfaces) and 6 (infrastructure) are the heart of the deck.",
  situation:
    "Play his own words back, then fill the blanks LIVE — this is the discovery slide. Must-learn list: (1) What's the sub-specialty and scope of the new clinic? (2) Where — Ventura area? Lease signed? Build-out underway? (3) Target opening date — everything schedules backward from it. (4) Headcount at opening — providers, MAs, front office? (5) The EMR question (sets up slide 5): does he plan to DOCUMENT in the hospital systems via their portals, or run his own practice EHR/PM and exchange with them? (6) Billing — in-house or billing service? (7) Who else is involved — office manager, practice consultant, contractor? (8) Imaging or in-office procedures that need special equipment on the network?",
  coreIdea:
    "The teaching moment. A new clinic is the one time you get to build technology right ONCE instead of untangling someone else's choices. Walk the contrast quickly — the point is the three takeaways on the right: the EMR-access strategy drives the build; lead times gate opening day (internet circuits, hardware, and hospital IT processes all take weeks — start early); and HIPAA is cheapest designed-in. If he gives you an opening date on slide 3, tie takeaway 2 to it here: \"If you're opening in the fall, circuit orders need to go in now.\"",
  interfaces:
    "THE ANSWER TO HIS FIRST ASK. He said 'using Cerner, Epic and Kaiser portals for EMRs' — that phrasing suggests Pattern A (work inside the hospitals' systems via community-provider access), which is common for surgeons who operate at hospitals. But confirm: many surgical practices also run their own lightweight EHR/PM for office notes, scheduling, and billing — Pattern B. The honest framing: hospital IT controls THEIR side; what we own is YOUR side — engineered workstations, secured access, and driving the credentialing / access / interface process with each of the three organizations so it's not him chasing three IT departments. Probes: Does he have remote access to each system today? Which hospital is primary? Does Kaiser send him referrals (Affiliate Link)? Who does his billing?",
  infrastructure:
    "THE ANSWER TO HIS SECOND ASK. Walk the six layers briefly — don't lecture a surgeon. Emphasize: Layer 1 lead times (business internet circuits can take 30–60+ days in some buildings — order first); Layer 5 is not optional for a clinic (HIPAA technical safeguards + cyber-insurance applications now require EDR, MFA, encryption); Layer 6 in plain terms: \"If a workstation dies at 8 AM on clinic day, what happens at 8:05?\" Tie everything to clinical workflow: exam rooms, front desk, his office, and wherever he reviews imaging.",
  hipaa:
    "Keep this confident, not scary — he knows HIPAA clinically; what's new is standing up a covered entity from scratch. The Security Risk Analysis isn't bureaucracy: it's legally required (45 CFR 164.308), Medicare/MIPS attestation asks for it, and cyber-insurance underwriting effectively demands the same controls. New-practice gotcha: EVERY vendor touching PHI needs a BAA — EHR, e-fax, email, answering service, billing service, shredding, IT provider (us included — we sign one). Position: we build the technical safeguards into the build itself, so compliance is a by-product of the architecture, not a retrofit project.",
  proof:
    "Proof, not promises — these are real, anonymized Technijian healthcare engagements; offer references. Walk them fast: (1) we already run the full platform — phones, servers, endpoints, M365 — for a multi-site medical group, 12 months, zero patient-facing downtime; (2) we upgraded an 18-workstation clinical fleet in one weekend without disrupting patient hours — that's the same discipline a new-clinic cutover needs; (3) we do custom software and AI work INSIDE a HIPAA-aware development cycle — that's the muscle behind his interface workstream. Do NOT name the clients. If he asks about new-clinic builds specifically, be honest: every environment we manage we either built or rebuilt — and a greenfield build is the cleaner version of work we do every week.",
  stack:
    "Keep this short — the point is one partner, five doors, and he'd start with three: the build project (My Dev + My IT together), then My IT + My Security as the ongoing foundation. My Compliance is the HIPAA program he'll want as he hires staff. My Jian = the plain-language monthly report that proves it's all working. Don't pitch AI beyond the interface work — wrong meeting.",
  pricing:
    "He didn't ask for pricing in his note, but a physician opening a practice is absolutely budgeting — so show HOW the number gets built, with real list prices, before he asks. Walk the per-person stack so it feels earned: about $87 per person per month all-in managed. The 10-person line is ILLUSTRATIVE — say \"swap in your real headcount and that's your monthly.\" The one-time build-out (cabling, network, workstations, phones, interfaces) is genuinely scope-dependent — committing to a number before seeing the space would be guessing, and we don't guess; it's a fixed-scope quote after the free site walk, with hardware at the configuration he approves. NEVER discuss cost basis or staffing economics — only his investment. (Source: standard desktop $26.50 + email security $4.75 + M365 backup $4.00 + training $6.00 + ~$46 managed help-desk per person, + $20/mo domain protection.)",
  engage:
    "Lower the stakes. The only ask today is Step 2 — a free site walk and clinic technology assessment. Everything after is gated and reversible: he sees the blueprint and the fixed quote BEFORE committing to anything. Reassure on accountability: one partner owns the whole runway — circuits, hardware, hospital access processes, go-live — so he's never coordinating three vendors and three hospital IT departments while also credentialing, hiring, and seeing patients. If the opening date is close, say so honestly: the calendar is the enemy, let's get the site walk on the books this week.",
  nextSteps:
    "Close on ONE thing: book the free site walk / clinic technology assessment — propose a specific day. He's in Ventura; we cover SoCal on-site. Offer the New Clinic IT Checklist as a give-away no matter what — it keeps goodwill if he's not ready. Confirm best email (jromero116@msn.com from the booking) and cell for scheduling. End warm: congratulate him on the new practice. Send a short recap email TODAY with the checklist and proposed site-walk times.",
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
  slide.addText("Technijian  |  For Javier Romero, MD FACS  |  IT Discovery  |  2026-06", {
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
    x: 9.7, y: 0.95, w: 2.9, h: 0.32, rectRadius: 0.04,
    fill: { color: COLORS.dark, transparency: 30 },
    line: { color: COLORS.teal, pt: 0.75 },
  });
  slide.addText("PREPARED FOR DR. JAVIER ROMERO", {
    x: 9.7, y: 0.95, w: 2.9, h: 0.32,
    fontFace: "Arial", fontSize: 8.5, bold: true, color: COLORS.teal,
    align: "center", valign: "mid", charSpace: 1, margin: 0,
  });
  slide.addText("Technijian", {
    x: 0.7, y: 2.3, w: 12, h: 0.95,
    fontFace: "Arial", fontSize: 52, bold: true, color: COLORS.white,
    margin: 0,
  });
  slide.addText("for Javier Romero, MD FACS", {
    x: 0.7, y: 3.25, w: 12.2, h: 0.7,
    fontFace: "Arial", fontSize: 30, bold: true, color: COLORS.orange,
    margin: 0,
  });
  slide.addText("Building the technology foundation for your new surgical sub-specialty clinic.", {
    x: 0.7, y: 4.15, w: 11.8, h: 0.5,
    fontFace: "Arial", fontSize: 18, color: COLORS.white, margin: 0,
    transparency: 18,
  });
  hLine(slide, 0.7, 5.2, 11.9, COLORS.teal, 0.018);
  slide.addText("IT Discovery Meeting  |  Ravi Jain ↔ Javier Romero, MD FACS  |  Booked via technijian.com", {
    x: 0.7, y: 5.35, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0,
  });
  slide.addText("New clinic infrastructure  ·  EMR connectivity across Cerner, Epic & Kaiser  ·  HIPAA from day one", {
    x: 0.7, y: 5.72, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 11, bold: true, color: COLORS.teal, margin: 0,
  });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  technijian.com  ·  949.379.8499", {
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
    "A working discovery conversation, not a pitch. You told us what you need — interfaces and infrastructure — so that's where we'll spend the time.",
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
  slide.addText("Understand your new clinic well enough to design its technology right — and leave you with a clear, no-pressure path from today to a fully built, HIPAA-ready opening day.", {
    x: 0.78, y: 3.05, w: 3.5, h: 1.9,
    fontFace: "Arial", fontSize: 14, color: COLORS.white, valign: "top", margin: 0, transparency: 8,
  });
  slide.addText([
    { text: "You bring the clinical vision.\n", options: { bold: true, color: COLORS.teal, fontSize: 12 } },
    { text: "We bring the build plan — and straight answers about what it takes.", options: { color: COLORS.white, fontSize: 12, transparency: 15 } },
  ], {
    x: 0.78, y: 5.55, w: 3.5, h: 1.1, valign: "top", margin: 0,
  });

  const items = [
    { t: "What we heard from you", d: "New surgical sub-specialty clinic, Cerner + Epic + Kaiser, interfaces and infrastructure — said back to make sure we got it right." },
    { t: "What working across three EMR ecosystems means", d: "The two patterns for Cerner / Epic / Kaiser connectivity — and what each asks of the build." },
    { t: "The infrastructure blueprint", d: "The six layers every new clinic needs, from internet circuits to backup and continuity." },
    { t: "HIPAA from day one", d: "Compliant-by-design: what a brand-new covered entity must stand up — built into the build." },
    { t: "Proof, and how pricing works", d: "Real Technijian healthcare engagements, and transparent per-person pricing with no surprises." },
    { t: "Next step", d: "A free site walk and clinic technology assessment — then a blueprint and fixed quote." },
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
    "From your note when you booked this meeting. Today we fill in the details — correct anything we have wrong.",
    3, COLORS.teal);

  const stats = [
    { n: "NEW", l: "Clinic — built from the ground up" },
    { n: "3", l: "EMR ecosystems · Cerner · Epic · Kaiser" },
    { n: "2", l: "Workstreams · interfaces + infrastructure" },
    { n: "DAY 1", l: "HIPAA-ready target at opening" },
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
    { text: "A greenfield build — your one chance to do it right once. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "No legacy systems to untangle. Every choice — network, devices, phones, security — gets made on purpose, sized to your clinical workflow.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "Three EMR ecosystems, one practice. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Cerner, Epic, and Kaiser portals means working across three separate health-system IT organizations — credentialed access, secured workstations, and clean referral and results flow into your own records.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "A surgical practice runs on uptime and compliance. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Scheduling, documentation, imaging review, and billing all sit on this foundation — and as a new covered entity, HIPAA safeguards have to be standing on opening day, not bolted on later.", options: { color: COLORS.slate, fontSize: 12.5 } },
  ], {
    x: 0.85, y: 4.5, w: 11.7, h: 2.1,
    valign: "top", margin: 0,
  });
  slide.addNotes(NOTES.situation);
}

// SLIDE 4 — THE CORE IDEA (greenfield advantage)
function coreIdeaSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The core idea",
    "A clinic that's born digital — built right once",
    "Most practices inherit technology problems and retrofit around them. You get to skip that entirely — if the build is sequenced right.",
    4, COLORS.blue);

  const cols = [
    { title: "The retrofit way", sub: "(what most practices live with)", band: COLORS.grey, items: [
      "Devices bought ad hoc, one crisis at a time",
      "Consumer-grade Wi-Fi carrying patient data",
      "EMR access set up laptop-by-laptop, by whoever's around",
      "Compliance bolted on after the fact",
      "Week-one surprises: dead spots, dropped faxes, no backups",
    ] },
    { title: "Your greenfield", sub: "(built on purpose)", band: COLORS.orange, items: [
      "Every component chosen once, to a plan",
      "Clinical-grade, segmented network from day one",
      "Hospital access engineered per ecosystem — all three",
      "HIPAA safeguards designed into the architecture",
      "Opening day is boring — everything just works",
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
      fontFace: "Arial", fontSize: 15, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(c.sub, {
      x: x + 0.18, y: 2.82, w: 2.5, h: 0.28,
      fontFace: "Arial", fontSize: 10, italic: true, color: c.band, margin: 0,
    });
    c.items.forEach((it, idx) => {
      const ty = 3.25 + idx * 0.68;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2, y: ty + 0.06, w: 0.1, h: 0.1,
        fill: { color: c.band }, line: { color: c.band, transparency: 100 },
      });
      slide.addText(it, {
        x: x + 0.38, y: ty, w: 2.32, h: 0.64,
        fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0,
      });
    });
  });

  const takeaways = [
    { n: "1", t: "The EMR strategy drives the build", d: "How you'll work across Cerner, Epic, and Kaiser — and whether you run your own practice system — shapes the workstations, network, and security underneath. We settle that first.", c: COLORS.blue },
    { n: "2", t: "Lead times gate opening day", d: "Internet circuits, hardware orders, and hospital IT access processes each take weeks. The build schedules backward from your opening date — the earlier we start, the calmer it goes.", c: COLORS.teal },
    { n: "3", t: "Compliance is cheapest on day one", d: "HIPAA safeguards designed into the architecture cost a fraction of retrofitting them — and your cyber-insurance application will ask for them anyway.", c: COLORS.orange },
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
      x: 7.85, y: y + 0.14, w: 4.8, h: 0.32,
      fontFace: "Arial", fontSize: 13.5, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(tk.d, {
      x: 7.85, y: y + 0.46, w: 4.85, h: 0.86,
      fontFace: "Arial", fontSize: 9.8, color: COLORS.slate, valign: "top", margin: 0,
    });
  });
  slide.addNotes(NOTES.coreIdea);
}

// SLIDE 5 — CONNECTING THREE ECOSYSTEMS (the interface answer)
function interfacesSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Your first ask — software interfaces",
    "What “using Cerner, Epic and Kaiser” means for the build",
    "Two proven patterns — most surgical practices end up with a blend. Discovery decides the mix; the build then makes it seamless.",
    5, COLORS.teal);

  const cards = [
    {
      band: COLORS.blue, label: "Pattern A — work inside their systems",
      title: "Hospital portals, engineered",
      body: "You document and round inside each hospital's own EMR via credentialed community-provider access.\n\nWhat that takes: per-hospital access clients (Citrix / VDI / web), secured and certified on every workstation; fast dual-monitor setups; identity hygiene and MFA per health system; and one tested login experience in every exam room — not three fights per patient.",
      bodySize: 10.5,
    },
    {
      band: COLORS.orange, label: "Pattern B — run your own system",
      title: "Practice EHR/PM + exchange",
      body: "Your clinic runs its own EHR / practice-management system for office notes, scheduling, and billing — and exchanges with the hospitals.\n\nWhat that takes: EHR/PM selection support, HL7 / FHIR interfaces and Direct secure messaging where each hospital supports them, e-fax workflows for the rest, plus eRx and lab / imaging results routing into your charts.",
      bodySize: 10.5,
    },
    {
      band: COLORS.teal, label: "Either way — what Technijian owns",
      title: "We drive all three relationships",
      body: "Hospital IT controls their side. We own yours — and we manage the process with each organization:\n\n•  Access / credentialing applications with each health-system IT\n•  Workstation builds certified against each portal\n•  Interface and Direct-messaging setup and testing\n•  One throat to choke when something breaks",
      bodySize: 10.5,
    },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + i * 4.16;
    addCard(slide, {
      x, y: 2.3, w: 3.95, h: 3.85, band: c.band,
      label: c.label, title: c.title, body: c.body,
      titleSize: 14.5, bodySize: c.bodySize, bodyY: 0.92,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.32, w: 12.25, h: 0.55, rectRadius: 0.06,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addText("Your three ecosystems are three separate IT organizations. Our job: you see patients — we handle the three IT departments.", {
    x: 0.55, y: 6.32, w: 12.25, h: 0.55,
    fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.white,
    align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.interfaces);
}

// SLIDE 6 — INFRASTRUCTURE BLUEPRINT (the infrastructure answer)
function infrastructureSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Your second ask — infrastructure",
    "The new-clinic blueprint — six layers, one build",
    "Everything a surgical sub-specialty clinic stands on. Each layer is sized to your floor plan, headcount, and workflow during discovery.",
    6, COLORS.orange);

  const layers = [
    { title: "Connectivity & network", band: COLORS.blue, body: "Business internet + backup circuit, clinical-grade firewall, segmented Wi-Fi (clinical / office / guest), and structured cabling. Circuits have the longest lead time — we order them first." },
    { title: "Clinical workstations & devices", band: COLORS.orange, body: "Exam-room and front-desk workstations, dual monitors for imaging and portal work, document scanners, label and badge printers — specified once, imaged identically." },
    { title: "Communications", band: COLORS.teal, body: "Healthcare-grade VoIP phones with auto-attendant and after-hours routing, HIPAA-suitable e-fax for referrals and records, and answering-service integration." },
    { title: "Microsoft 365 & identity", band: COLORS.chartreuse, body: "Professional email on your domain, MFA on every login, secure internal messaging, and shared calendars — the identity backbone every hospital portal hangs off." },
    { title: "Security & HIPAA stack", band: COLORS.green, body: "Managed EDR + threat detection on every device, DNS filtering, disk encryption, automatic patching, and email security — the technical safeguards HIPAA expects." },
    { title: "Backup & continuity", band: COLORS.dark, body: "Independent backup of Microsoft 365 and clinic data, rapid workstation recovery, and documented downtime procedures — so a failed device never cancels a clinic day." },
  ];
  layers.forEach((l, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.3 + Math.floor(i / 3) * 2.3;
    addCard(slide, {
      x, y, w: 3.95, h: 2.1, band: l.band,
      label: `Layer 0${i + 1}`, title: l.title, body: l.body,
      titleSize: 15, bodySize: 10.5,
    });
  });
  slide.addNotes(NOTES.infrastructure);
}

// SLIDE 7 — HIPAA FROM DAY ONE
function hipaaSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Compliant by design",
    "HIPAA from day one — built in, not bolted on",
    "A new practice is a new covered entity. These six items have to exist at opening — we build them into the build itself.",
    7, COLORS.blue);

  const cards = [
    { title: "Security Risk Analysis", band: COLORS.blue, body: "The written risk analysis HIPAA requires (45 CFR 164.308) — and the first thing Medicare/MIPS attestation and OCR ask to see. We run it as part of the build." },
    { title: "Business Associate Agreements", band: COLORS.teal, body: "Every vendor touching PHI needs a BAA — EHR, e-fax, email, answering service, billing service, IT provider. We inventory them and sign ours on day one." },
    { title: "Encryption & access control", band: COLORS.orange, body: "Disk encryption on every device, MFA on every login, role-based access, and automatic screen locks — the safe-harbor controls that make a lost laptop a non-event." },
    { title: "Workforce training", band: COLORS.green, body: "Short security-awareness training and simulated phishing for your staff from the first hire — people are the most-attacked layer in healthcare." },
    { title: "Policies & incident response", band: COLORS.chartreuse, body: "Right-sized written policies — acceptable use, access, breach response — plus a tested plan for what happens in the first hour of an incident." },
    { title: "Evidence & audit trail", band: COLORS.dark, body: "Patching, backups, training, and access reviews — documented continuously, so audits, payer reviews, and insurance renewals are a file pull, not a fire drill." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.28 + Math.floor(i / 3) * 2.22;
    addCard(slide, {
      x, y, w: 3.95, h: 2.1, band: c.band,
      label: `0${i + 1}`, title: c.title, body: c.body,
      titleSize: 14.5, bodySize: 10.2,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32, rectRadius: 0.05,
    fill: { color: COLORS.paleOrange }, line: { color: COLORS.orange, pt: 0.75 },
  });
  slide.addText("Bonus: these are the same controls your cyber-insurance application will require — one build satisfies both.", {
    x: 0.55, y: 6.66, w: 12.25, h: 0.32,
    fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.dark,
    align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.hipaa);
}

// SLIDE 8 — PROOF (real healthcare engagements)
function proofSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Proof, not promises",
    "We run technology for medical practices today",
    "Three real Technijian healthcare engagements — anonymized for confidentiality, references available on request.",
    8, COLORS.teal);

  const cards = [
    {
      band: COLORS.blue, label: "Multi-practice medical group",
      stat: "12 months · zero patient-facing downtime",
      title: "Full platform operations",
      body: "VoIP phones, a dozen+ Windows servers, endpoints, and Microsoft 365 for a multi-site, HIPAA-regulated medical group — monthly patch discipline with documented evidence for compliance, and 3CX telephony kept reliable for front-desk and clinical staff.",
    },
    {
      band: COLORS.orange, label: "Healthcare practice · 18 endpoints",
      stat: "One weekend · clinical fleet upgraded",
      title: "Windows 11 cutover, zero clinic disruption",
      body: "Rolled 18 clinical-office workstations from Windows 10 to 11 over a single weekend — driven by cyber-insurance requirements, with a structured second pass for stragglers and preconfigured spares on standby. No patient-hours lost.",
    },
    {
      band: COLORS.teal, label: "Medical practice · software + AI",
      stat: "70+ hrs · HIPAA-aware development",
      title: "Modernized a live clinical web app",
      body: "Updated the UI and database of a live healthcare application, stood up a clean data service, and integrated an AI assistant that auto-generates authorization checklists — all inside a HIPAA-aware development cycle. This is the muscle behind your interface workstream.",
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

  slide.addText("Every environment we manage, we either built or rebuilt. A greenfield clinic is the cleaner version of work we do every week.", {
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
    "One partner, five doors — your build starts with three",
    "Each service stands on its own. For a new clinic: the build project plus managed IT and security as the ongoing foundation.",
    9, COLORS.orange);

  const services = [
    { title: "My IT", sub: "Managed help desk & monitoring", body: "Help desk + monitoring + patching for every workstation, the network, and Microsoft 365 — one number your staff calls, with guaranteed response.", band: COLORS.blue, start: "Start here." },
    { title: "My Security", sub: "24/7 protection", body: "EDR + threat detection on every device, email security, MFA everywhere, and 24/7 monitoring — the HIPAA technical-safeguard layer, managed.", band: COLORS.orange, start: "Start here." },
    { title: "My Dev", sub: "Interfaces & custom software", body: "Hospital portal access engineering, HL7 / FHIR interfaces, and custom software in a HIPAA-aware development cycle — your interface workstream lives here.", band: COLORS.teal, start: "Your build project." },
    { title: "My Compliance", sub: "The HIPAA program", body: "Security Risk Analysis, BAA inventory, policies, training, and audit-ready evidence — kept current as you hire and grow.", band: COLORS.chartreuse },
    { title: "My Jian", sub: "Plain-language reporting", body: "Technijian-built monitoring that watches across your stack and produces a plain monthly report — so you always know it's working.", band: COLORS.dark },
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
    "Real list prices from our standard small-practice packages. Your monthly = your headcount × the stack; the one-time build-out is a fixed-scope quote after the free site walk.",
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
    { l: "Endpoint security — EDR + threat detection + DNS filtering + patching + remote support", p: "$26.50" },
    { l: "Email security & anti-phishing (HIPAA-suitable)", p: "$4.75" },
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
  slide.addText("+ Email-domain (DMARC/DKIM) protection — whole practice", {
    x: 0.78, y: 5.62, w: 6.1, h: 0.34, fontFace: "Arial", fontSize: 10, italic: true, color: COLORS.grey, valign: "mid", margin: 0,
  });
  slide.addText("$20 / mo", {
    x: 6.95, y: 5.62, w: 1.0, h: 0.34, fontFace: "Arial", fontSize: 10.5, bold: true, italic: true, color: COLORS.grey, align: "right", valign: "mid", margin: 0,
  });
  slide.addText("Optional as compliance needs grow: encrypted email, single sign-on, activity monitoring & data-loss prevention.", {
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
  slide.addText("Illustration only: a 10-person clinic ≈ $890/mo. Swap in your real headcount and that's your monthly.", {
    x: 8.48, y: 3.86, w: 4.05, h: 0.6, fontFace: "Arial", fontSize: 10.5, color: COLORS.white, valign: "top", margin: 0, transparency: 15,
  });
  hLine(slide, 8.48, 4.5, 4.05, COLORS.teal, 0.01);
  const pts = [
    "Flat, predictable monthly — billed per person, every line shown.",
    "One-time build-out (network, cabling, devices, interfaces): fixed-scope quote after the free site walk.",
    "Hardware at the configuration you approve — you see and own everything.",
  ];
  pts.forEach((p, i) => {
    const y = 4.64 + i * 0.56;
    slide.addShape(pptx.ShapeType.ellipse, { x: 8.48, y: y + 0.06, w: 0.1, h: 0.1, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
    slide.addText(p, { x: 8.66, y, w: 3.95, h: 0.54, fontFace: "Arial", fontSize: 10, color: COLORS.white, valign: "top", margin: 0, transparency: 10 });
  });

  slide.addText("Real Technijian list prices from our standard small-practice packages; the 10-person figure is illustrative only. Your fixed monthly and one-time build-out quote follow the free site assessment.", {
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
    "Discovery first. A blueprint before a dollar. Then we build.",
    "Every step is gated — you see the plan and the fixed quote before committing to anything.",
    11, COLORS.blue);

  const phases = [
    { n: "01", t: "Discovery", d: "Today's conversation. Specialty, location, opening date, headcount, and how you want to work across Cerner, Epic, and Kaiser. No commitment.", c: COLORS.orange },
    { n: "02", t: "Free site walk & assessment", d: "We walk the space (or plans), map the EMR-access strategy with each health system, and inventory every build need — circuits to exam rooms.", c: COLORS.blue },
    { n: "03", t: "Blueprint & fixed quote", d: "One document: the clinic technology blueprint, the build timeline scheduled backward from opening day, and a fixed one-time + monthly quote.", c: COLORS.teal },
    { n: "04", t: "Build · test · train · open", d: "Circuits ordered first, network and workstations built, hospital access certified, staff trained — then we run it 24/7 as your managed IT partner.", c: COLORS.chartreuse },
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
      fontFace: "Arial", fontSize: 14.5, bold: true, color: COLORS.dark, margin: 0, valign: "top",
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
  slide.addText("Timing note: internet circuits and hospital IT access processes are the long poles — engaging 90+ days before opening keeps everything off the critical path.", {
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
    { tag: "Recommended", title: "Free site walk & clinic technology assessment", body: "We walk your space or plans, map the access strategy with Cerner, Epic, and Kaiser, and come back with the clinic technology blueprint and a fixed quote — one-time build plus monthly. You decide from there.", band: COLORS.teal },
    { tag: "You keep this either way", title: "The New Clinic IT Checklist (1 page)", body: "A plain-language checklist of everything a new practice needs — circuits, devices, HIPAA items, and the lead times for each — yours to keep and act on, whether or not we work together.", band: COLORS.orange },
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
    { text: "Book your site walk   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 10 } },
  ], {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85,
    align: "center", valign: "mid", margin: 0,
  });

  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  On-site across Southern California  ·  Congratulations on the new practice.", {
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
interfacesSlide();
infrastructureSlide();
hipaaSlide();
proofSlide();
stackSlide();
pricingSlide();
engageSlide();
nextStepsSlide();

pptx.writeFile({ fileName: outPath }).then(filename => {
  console.log(`  Wrote ${filename}`);
});
