const path = require("path");
const PptxGenJS = require("C:/vscode/tech-branding/tech-branding/Clients/CDLX/presentation/node_modules/pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for The Holman Group — Co-Managed IT, Security & Strategic Support";
pptx.title = "Technijian for The Holman Group";
pptx.lang = "en-US";
pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-US" };

// ---- Real Technijian logo files (authentic, per brand guidance) ----
const LOGO_LIGHT = "C:/vscode/tech-branding/tech-branding/Clients/HMG/assets/Technijian Logo 2.png";        // dark text — light bg
const LOGO_DARK = "C:/vscode/tech-branding/tech-branding/Clients/HMG/assets/Technijian Logo - white text.png"; // white text — dark bg
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

const outPath = path.resolve(__dirname, "Technijian for The Holman Group - First Meeting Deck.pptx");

// ============ SPEAKER NOTES (presenter-facing; not shown on slides) ============
const NOTES = {
  cover:
    "OPEN WARM. Thank Deric for the time and thank Lewis for the introduction. You're Ravi, Founder & CEO of Technijian — Irvine-based, 25+ years, security-first. Frame the whole meeting in one sentence: \"This is a working conversation about how an outside team could COMPLEMENT what you already run — not replace it.\" Deric is the Network Administrator with an in-house team; the fastest way to lose him is to sound like a rip-and-replace MSP. He came to learn and to size up fit — keep it relaxed and peer-to-peer (tech-to-tech). VERIFY-LIVE (do not assert on slides): confirm ~60 endpoints; how many servers and what they run; on-prem vs Microsoft 365 split; team size; that he's HIPAA/Knox-Keene/URAC regulated (public, but confirm scope); who else weighs in (CFO/CEO Kwasi Holman/compliance). NOTE: their email domain is holmangroup.com (not 'holemangroup') — confirm Deric's correct address before any follow-up.",
  why:
    "Set expectations in 20 seconds: six quick stops, ending on the part that matters most — YOUR questions — and a free, no-commitment next step. Say it plainly: \"I'm not here to take over your network. I'm here to find the two or three places a partner actually takes work off your plate.\" Then hand him the wheel: \"Before I talk — what made you take this call? What would make the next 40 minutes worth it?\" Let his answer reorder the deck. The dark card is the promise: he keeps control.",
  heard:
    "Play back what we know so he sees we listened and prepared. Confirm each number LIVE — still ~60 computers? how many physical/virtual servers, and what's on them (file, AD/DC, app, SQL, line-of-business)? what's already in Microsoft 365 vs still on-prem? Is it just him, or a small team? Good probes: \"What's the oldest thing in the rack you worry about?\" / \"When something breaks at 2 AM, who gets the call?\" / \"What's the one project you can never get to?\" Behavioral-health + Knox-Keene + URAC means PHI everywhere — acknowledge the compliance weight but DON'T lecture him on his own regulations; ask how he handles the IT-side evidence today.",
  who:
    "Earn the right to keep talking — 20 seconds, not a history lesson. The four proof points that matter to a fellow technician: (1) 25+ years, we're not going anywhere; (2) the POD model — a named team that learns YOUR environment, not a different stranger every ticket; (3) security-first, CISSP-led, our own 24/7 SOC; (4) AI-forward, we actually build, not just resell. Land the pod model hardest — it's the antidote to every bad MSP experience he's had. If he's quiet, ask: \"Have you worked with an outside IT shop before — what did you like or hate about it?\"",
  proof:
    "Credibility BEFORE pitch. These are anonymized industry profiles — scope and effort only, no client names, no invented metrics. Pick the ONE closest to his world and go deeper on it; don't read all three. The point isn't to brag, it's to signal \"we've stood inside a regulated, on-prem, in-house-IT shop exactly like yours and added value without stepping on the admin.\" If he leans in on one, ask what part of that maps to his reality. Honesty rule: if he asks for references or specifics we can't share live, promise a proper case study in the follow-up — never fabricate a number or a logo.",
  coManaged:
    "This is the heart of the credibility story for HIM specifically. The fear in the room is \"is this guy here to make me redundant?\" Kill it directly: co-managed means he stays in charge and we plug specific gaps. Walk the left column (the old all-or-nothing outsourcing he's right to distrust) vs the right (co-managed). Then the three takeaways — lead with #1 (you keep control) and #3 (augment, not replace). Concrete examples: we take nights/weekends so his team sleeps; we run the SOC he can't staff 24/7; we add hands for the server refresh he keeps postponing. Say: \"On your worst week, we're the bench. On a normal week, you barely notice us.\"",
  ways:
    "Plant 2–3 seeds, then SHUT UP and watch which one he reacts to — that tells you what actually hurts. Don't pitch all three equally; read the room. For most in-house admins the live wire is #1 (give me my nights back) or #2 (I'm scared about a breach I can't see). #3 (strategic + AI) is the differentiator nobody else brings — mention the EAP/claims AI angle lightly as \"the kind of thing we'd explore once the basics are solid,\" not a hard pitch. Frame each as a hypothesis: \"teams your size usually feel X — true for you?\" Leave room for him to correct you.",
  security:
    "Highest-stakes slide — they're a Knox-Keene behavioral-health plan, so PHI and 42 CFR Part 2 (substance-use records) raise the bar above ordinary HIPAA. Walk the six layers fast; do NOT lecture a network admin on security basics — instead ask which layers he already feels good about and which keep him up at night. The honest hook: \"You can probably build any one of these. The hard part is staffing all six, 24/7, with audit evidence a regulator will accept — that's where a partner earns its keep.\" WHY NOW (strong, dated triggers): (1) the HIPAA Security Rule update (OCR NPRM, Jan 2025) is expected to make MFA, encryption at rest + in transit, annual penetration testing, and vulnerability scans every 6 months MANDATORY — the 'addressable' escape hatch goes away; (2) 42 CFR Part 2 enforcement with civil money penalties became active Feb 2026. Use these to make 'do nothing' costly without fear-mongering. VERIFY-LIVE: current EDR/SIEM/email-security tools; last HIPAA risk assessment + pen test; how 42 CFR Part 2 / CMIA evidence is produced today; whether QuickCap and the provider/member portals are in scope. Don't assert gaps you haven't confirmed.",
  discovery:
    "THE POINT OF THE MEETING. Put the deck down here and let him talk — aim for him doing 70% of the talking. Questions are ordered easy→strategic; skip any he already answered earlier. The must-learns: (a) real environment shape (servers/endpoints, on-prem vs cloud), (b) where his hours go / after-hours pain, (c) security + compliance posture and evidence burden, (d) roadmap projects he wants bandwidth for, (e) the decision chain (CFO? CEO Kwasi Holman? compliance officer?). End on \"what would make this worth your time\" so you close on HIS terms. Never ask something you should already know — that signals you didn't prepare.",
  engage:
    "Lower the stakes to near zero. The only ask today is the free Nexus Assess — internal + external vulnerability scan, dark-web credential check, and a Microsoft 365 security review, handed back as a prioritized roadmap MAPPED TO HIPAA that's his to keep whether or not we ever work together. It gives him a real artifact to take to his CFO/CEO, and it gives us the data to scope a right-sized co-managed proposal. Reassure: \"This isn't a sales trap — it's a read of your environment you can act on with your own team.\" If he asks price: give a verbal range only, and say the fixed number comes after the assessment. NEVER discuss our cost basis or how we staff it.",
  closing:
    "Close on ONE concrete, dated thing: book the free Nexus Assess, roadmap back within ~10 business days. Pair it with the risk-reversal out loud — free, no contract, no obligation, the roadmap is yours to keep. Broaden the topic slightly so you're a peer strategist, not a one-deal pitch: \"...and I'm happy to share the broader security + AI playbook we run for ourselves and our other clients.\" Confirm the best email (verify holmangroup.com address), propose a specific time this week, and send a short recap email TODAY with the booking link and your signature. End warm, zero pressure.",
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
  slide.addText("Technijian  |  For The Holman Group  |  June 19, 2026", {
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
      x: card.x + 0.18, y: card.y + 0.44, w: card.w - 0.36, h: 0.42,
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
    x: 10.0, y: 0.95, w: 2.6, h: 0.32, rectRadius: 0.04,
    fill: { color: COLORS.dark, transparency: 30 },
    line: { color: COLORS.teal, pt: 0.75 },
  });
  slide.addText("PREPARED FOR THE HOLMAN GROUP", {
    x: 10.0, y: 0.95, w: 2.6, h: 0.32,
    fontFace: "Arial", fontSize: 8, bold: true, color: COLORS.teal,
    align: "center", valign: "mid", charSpace: 0.6, margin: 0,
  });
  slide.addText("Technijian", {
    x: 0.7, y: 2.25, w: 12, h: 0.95,
    fontFace: "Arial", fontSize: 52, bold: true, color: COLORS.white,
    margin: 0,
  });
  slide.addText("for The Holman Group", {
    x: 0.7, y: 3.2, w: 12.2, h: 0.7,
    fontFace: "Arial", fontSize: 30, bold: true, color: COLORS.orange,
    margin: 0,
  });
  slide.addText("Co-managed IT, security, and strategic support — alongside your team, not over it.", {
    x: 0.7, y: 4.1, w: 11.8, h: 0.5,
    fontFace: "Arial", fontSize: 17, color: COLORS.white, margin: 0,
    transparency: 12,
  });
  hLine(slide, 0.7, 5.15, 11.9, COLORS.teal, 0.018);
  slide.addText("First meeting  |  Ravi Jain, Founder & CEO  ↔  Deric Hobbie, Network Administrator  |  June 19, 2026  ·  11:00 AM PT  ·  Microsoft Teams", {
    x: 0.7, y: 5.3, w: 12.0, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0,
  });
  slide.addText("Behavioral health & EAP  ·  ~60 endpoints  ·  on-prem servers  ·  in-house IT team  ·  HIPAA / Knox-Keene / URAC", {
    x: 0.7, y: 5.68, w: 12.0, h: 0.3,
    fontFace: "Arial", fontSize: 11, bold: true, color: COLORS.teal, margin: 0,
  });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  technijian.com  ·  949.379.8499  ·  technology as a solution", {
    x: 0.7, y: 6.05, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 10, color: COLORS.white, margin: 0,
    transparency: 40,
  });
  slide.addNotes(NOTES.cover);
}

// SLIDE 2 — WHY WE'RE HERE / AGENDA
function whySlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Why we're here",
    "A working conversation — on your terms",
    "Lewis connected us because you're weighing whether an outside partner could complement your in-house IT. That's exactly the conversation worth having.",
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
  slide.addText("OUR PROMISE TODAY", {
    x: 0.78, y: 2.65, w: 3.6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText("We're not here to take over your network. We're here to find the two or three places where an outside team genuinely takes work off your plate — and to leave you with something useful either way.", {
    x: 0.78, y: 3.05, w: 3.5, h: 1.9,
    fontFace: "Arial", fontSize: 13.5, color: COLORS.white, valign: "top", margin: 0, transparency: 6,
  });
  slide.addText([
    { text: "You keep control.\n", options: { bold: true, color: COLORS.teal, fontSize: 12 } },
    { text: "We fill the gaps a single in-house team can't staff around the clock.", options: { color: COLORS.white, fontSize: 12, transparency: 12 } },
  ], {
    x: 0.78, y: 5.55, w: 3.5, h: 1.1, valign: "top", margin: 0,
  });

  const items = [
    { t: "What we heard from you", d: "~60 endpoints, on-prem servers, in-house IT — said back so we can correct anything." },
    { t: "Who Technijian is", d: "25+ years, security-first, a dedicated team model — in 20 seconds." },
    { t: "Where a partner actually helps", d: "The co-managed model: augment your team, don't replace it." },
    { t: "Security & compliance for a health plan", d: "HIPAA, Knox-Keene, URAC, 42 CFR Part 2 — what a partner shoulders." },
    { t: "Your questions", d: "The heart of the meeting — your environment, your priorities." },
    { t: "A free, no-commitment next step", d: "A security read of your environment that's yours to keep." },
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
  slide.addNotes(NOTES.why);
}

// SLIDE 3 — WHAT WE HEARD
function heardSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "What we heard",
    "Your environment, said back to you",
    "From your conversation with Lewis. If we got anything wrong, now's the time to fix it — this is your meeting.",
    3, COLORS.teal);

  const stats = [
    { n: "~60", l: "Computers / endpoints" },
    { n: "On-prem", l: "Servers in-house" },
    { n: "In-house", l: "IT team you run" },
    { n: "Regulated", l: "HIPAA · Knox-Keene · URAC" },
  ];
  stats.forEach((s, i) => {
    const x = 0.55 + i * 3.06;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.35, w: 2.86, h: 1.35, rectRadius: 0.08,
      fill: { color: COLORS.dark },
      line: { color: COLORS.dark, transparency: 100 },
    });
    slide.addText(s.n, {
      x, y: 2.46, w: 2.86, h: 0.62,
      fontFace: "Arial", fontSize: 26, bold: true,
      color: COLORS.orange, align: "center", margin: 0, valign: "mid",
    });
    slide.addText(s.l.toUpperCase(), {
      x: x + 0.1, y: 3.12, w: 2.66, h: 0.5,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: COLORS.white, align: "center", margin: 0, charSpace: 0.4,
      transparency: 20, valign: "top",
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
  slide.addText("WHAT THAT TELLS US", {
    x: 0.85, y: 4.15, w: 11.6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.teal, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "You already run real IT. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "An in-house team and on-prem servers means you don't need someone to take the wheel — you need depth and coverage on top of what you've built. That's co-management, not outsourcing.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "On-prem + regulated raises the bar. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Physical servers to patch, back up, and secure — plus PHI under HIPAA, Knox-Keene, and URAC — is a lot for one team to cover 24/7 with audit-ready evidence.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "Behavioral-health data is high-value. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Mental-health and substance-use records (42 CFR Part 2) are among the most sensitive — and most targeted — data there is. The security floor for a plan like yours is simply higher.", options: { color: COLORS.slate, fontSize: 12.5 } },
  ], {
    x: 0.85, y: 4.5, w: 11.7, h: 2.1,
    valign: "top", margin: 0,
  });
  slide.addNotes(NOTES.heard);
}

// SLIDE 4 — WHO TECHNIJIAN IS
function whoSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Who we are",
    "Technijian, in 20 seconds",
    "Enough to know we're a serious, local, security-first partner — then back to you.",
    4, COLORS.blue);

  const cards = [
    { label: "Since 2000", title: "25+ years, still here", band: COLORS.blue,
      body: "An Irvine-based IT firm founded in 2000, with a Panchkula, India delivery center for true follow-the-sun coverage. We're not a flip-this-MSP startup — we'll be here for the long relationship." },
    { label: "The pod model", title: "A team that knows you", band: COLORS.orange,
      body: "You get a dedicated pod — a named team that learns your environment — not a different stranger on every ticket. It's the single thing clients tell us they were missing before." },
    { label: "Security-first", title: "Built in, not bolted on", band: COLORS.teal,
      body: "CISSP-led, with our own 24/7 Security Operations Center and CrowdStrike / Huntress-grade tooling. Security isn't an add-on line item for us — it's how we run everything." },
    { label: "AI-forward", title: "We build, not just resell", band: COLORS.chartreuse,
      body: "We develop practical AI and custom software (our My Jian platform, document intelligence, automation) — so the strategic conversation goes beyond keeping the lights on." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 2) * 6.23;
    const y = 2.3 + Math.floor(i / 2) * 2.2;
    addCard(slide, { x, y, w: 6.0, h: 2.0, band: c.band, label: c.label, title: c.title, body: c.body, titleSize: 16, bodySize: 11.5, bodyY: 0.78 });
  });
  slide.addNotes(NOTES.who);
}

// SLIDE 5 — PROOF
function proofSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "How we work",
    "The kind of work we do for shops like yours",
    "Representative engagement profiles — the shape of the work we deliver, no client names and no cherry-picked numbers. The pattern is always the same: add depth without stepping on the in-house team.",
    5, COLORS.teal);

  const cards = [
    { label: "Profile A · Regulated healthcare", title: "HIPAA practice, co-managed", band: COLORS.blue,
      body: "A multi-site healthcare organization with its own IT lead. Scope: hardened Microsoft 365, EDR across endpoints and servers, a HIPAA Security Rule risk assessment, and audit-ready evidence — run alongside their admin, who stayed in charge throughout.",
      foot: "We added depth; the in-house lead kept control." },
    { label: "Profile B · On-prem + in-house IT", title: "24/7 overlay, nights back", band: COLORS.orange,
      body: "A mid-market org with on-prem servers and a small internal team carrying the pager. Scope: a 24/7 SOC overlay plus after-hours help-desk so the in-house staff got nights and weekends back, with patch and backup discipline tightened across the server estate.",
      foot: "The internal team got nights and weekends back." },
    { label: "Profile C · Claims / benefits ops", title: "Document & workflow AI", band: COLORS.teal,
      body: "A benefits-operations workflow heavy with manual document handling. Scope: AI document-intelligence and workflow automation explored to cut repetitive processing — the same pattern we'd look at for EAP intake and claims, once the IT foundation is solid.",
      foot: "The pattern we'd explore for EAP intake & claims." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + i * 4.16;
    addCard(slide, { x, y: 2.3, w: 3.95, h: 3.75, band: c.band, label: c.label, title: c.title, body: c.body, footer: c.foot, titleSize: 15, bodySize: 11, bodyY: 0.92 });
  });
  // bottom synthesizing bar
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.25, w: 12.25, h: 0.62, rectRadius: 0.06,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addText("Different situations, one constant: we add depth and coverage without taking the wheel from your in-house team.", {
    x: 0.55, y: 6.25, w: 12.25, h: 0.62,
    fontFace: "Arial", fontSize: 12.5, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.proof);
}

// SLIDE 6 — THE CORE IDEA: CO-MANAGED
function coManagedSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The core idea",
    "Co-managed means we work for you, not instead of you",
    "The old pitch was all-or-nothing: hand us your network and step aside. That's not this. Co-management keeps you in charge and plugs specific gaps.",
    6, COLORS.orange);

  const cols = [
    { title: "All-or-nothing outsourcing", sub: "(the model you're right to distrust)", band: COLORS.grey, items: [
      "Replace the in-house team",
      "Tickets go to rotating strangers",
      "You lose visibility and control",
      "Your admin gets sidelined",
      "One rigid bundle, take it or leave it",
    ] },
    { title: "Co-managed with Technijian", sub: "(augment what you run)", band: COLORS.orange, items: [
      "Your team stays in charge",
      "A named pod that learns your stack",
      "We cover the gaps you choose",
      "Your admin is force-multiplied + mentored",
      "Pick the layers you actually need",
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
      x: x + 0.18, y: 2.5, w: 2.5, h: 0.55,
      fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0, valign: "top",
    });
    slide.addText(c.sub, {
      x: x + 0.18, y: 3.0, w: 2.55, h: 0.4,
      fontFace: "Arial", fontSize: 9.5, italic: true, color: c.band, margin: 0, valign: "top",
    });
    c.items.forEach((it, idx) => {
      const ty = 3.5 + idx * 0.62;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2, y: ty + 0.06, w: 0.1, h: 0.1,
        fill: { color: c.band }, line: { color: c.band, transparency: 100 },
      });
      slide.addText(it, {
        x: x + 0.38, y: ty, w: 2.32, h: 0.55,
        fontFace: "Arial", fontSize: 11, color: COLORS.slate, valign: "top", margin: 0,
      });
    });
  });

  const takeaways = [
    { n: "1", t: "You keep control", d: "Your team owns the relationship and the roadmap. We never make changes you didn't approve, and you can see everything we do.", c: COLORS.blue },
    { n: "2", t: "We cover what one team can't", d: "24/7 SOC, after-hours and weekend response, surge bandwidth for projects, PTO coverage — the things a single in-house team simply can't staff alone.", c: COLORS.teal },
    { n: "3", t: "Augment, not replace", d: "On your worst week we're the bench you call. On a normal week, you barely notice us — and your admin grows by working next to ours.", c: COLORS.orange },
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
      x: 7.85, y: y + 0.18, w: 4.8, h: 0.32,
      fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(tk.d, {
      x: 7.85, y: y + 0.5, w: 4.85, h: 0.8,
      fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0,
    });
  });
  slide.addNotes(NOTES.coManaged);
}

// SLIDE 7 — A FEW WAYS WE COULD HELP
function waysSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "A few ways we could help",
    "Three places a partner usually earns its keep",
    "Not a menu to buy today — hypotheses to react to. Tell us which of these is real for you, and which isn't.",
    7, COLORS.blue);

  const services = [
    { title: "Co-Managed IT & Help Desk", sub: "Take work off the plate", body: "Tier-1/2 overflow and after-hours / weekend coverage, patching and monitoring, Microsoft 365 administration, and surge bandwidth for the projects you can never get to. Your team sets the priorities; we add the hands.", band: COLORS.blue, foot: "You set the priorities; we add the hands." },
    { title: "24/7 Security & HIPAA", sub: "Cover what you can't watch", body: "A 24/7 SOC, EDR on every endpoint and server, email security, and identity hardening — plus HIPAA / Knox-Keene / URAC evidence and risk assessments. The coverage and audit trail one team can't sustain alone.", band: COLORS.orange, foot: "The coverage one team can't sustain alone." },
    { title: "Strategic IT + AI Efficiency", sub: "Beyond keeping the lights on", body: "A vCIO/vCISO planning cadence — and practical AI for your operation: EAP intake triage, claims and document intelligence, provider-network matching. The efficiency conversation, once the foundation is solid.", band: COLORS.teal, foot: "The layer most MSPs don't bring." },
  ];
  services.forEach((s, i) => {
    const x = 0.55 + i * 4.16;
    addCard(slide, { x, y: 2.3, w: 3.95, h: 3.75, band: s.band, label: s.sub, title: s.title, body: s.body, footer: s.foot, titleSize: 15.5, bodySize: 11.5, bodyY: 0.92 });
  });
  // bottom synthesizing bar
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.25, w: 12.25, h: 0.62, rectRadius: 0.06,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addText("Most teams your size feel one of these the most. Today's job is finding out which — then going deep there.", {
    x: 0.55, y: 6.25, w: 12.25, h: 0.62,
    fontFace: "Arial", fontSize: 12.5, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.ways);
}

// SLIDE 8 — SECURITY & COMPLIANCE
function securitySlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Security & compliance",
    "Six layers a behavioral-health plan has to cover",
    "You could build any one of these. The hard part is running all six, 24/7, with evidence a regulator will accept. Which keep you up at night?",
    8, COLORS.teal);

  const layers = [
    { title: "Identity & access", band: COLORS.blue, body: "MFA on every login, conditional access, and privileged-account control. Most breaches start at a stolen sign-in — so this is where we lock down first." },
    { title: "Endpoints & servers", band: COLORS.orange, body: "EDR + threat detection on every laptop and on-prem server, disk encryption, and enforced patching — on the network and off it." },
    { title: "Email & web defense", band: COLORS.teal, body: "Anti-phishing, malicious-link protection, and DNS/web filtering. Healthcare is the most-phished sector there is; most attacks arrive in the inbox." },
    { title: "Data, backup & ransomware", band: COLORS.chartreuse, body: "Immutable, tested backups of your servers and Microsoft 365 with fast recovery. Production storage and a sync are not a backup." },
    { title: "Compliance evidence", band: COLORS.green, body: "HIPAA Security Rule risk analysis, policies, and audit-ready documentation — including 42 CFR Part 2, CMIA, Knox-Keene, and URAC IT controls." },
    { title: "24/7 SOC & response", band: COLORS.dark, body: "Eyes-on-glass monitoring with a defined response when something looks wrong — the around-the-clock coverage an in-house team can't staff alone." },
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
  slide.addNotes(NOTES.security);
}

// SLIDE 9 — DISCOVERY QUESTIONS
function discoverySlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Your turn",
    "The questions that actually shape a fit",
    "This is the part that matters most. The more candid you are here, the more useful our free assessment and any proposal will be.",
    9, COLORS.orange);

  const qs = [
    "Walk me through the environment — how many servers and endpoints, and what's on-prem versus already in Microsoft 365 / the cloud?",
    "Where does your team's time actually go — help desk, patching, projects, after-hours fires?",
    "When something breaks at 2 AM or over a holiday weekend, who gets the call today?",
    "On security: what's your current EDR / SIEM / email-security stack, and when was your last HIPAA risk assessment or penetration test?",
    "How do you produce the IT-side evidence for HIPAA, 42 CFR Part 2, Knox-Keene, and URAC today — and how painful is it?",
    "What projects are on your roadmap this year that you'd love more bandwidth for?",
    "Besides you, who weighs in on a decision like this — finance, compliance, the CEO?",
    "What would make this conversation worth your time today?",
  ];
  qs.forEach((q, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 6.23;
    const y = 2.35 + row * 1.12;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 6.0, h: 1.0, rectRadius: 0.06,
      fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.16, y: y + 0.2, w: 0.6, h: 0.6, rectRadius: 0.08,
      fill: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal }, line: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal, transparency: 100 },
    });
    slide.addText(`${i + 1}`, {
      x: x + 0.16, y: y + 0.2, w: 0.6, h: 0.6,
      fontFace: "Arial", fontSize: 18, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0,
    });
    slide.addText(q, {
      x: x + 0.9, y: y + 0.1, w: 4.95, h: 0.82,
      fontFace: "Arial", fontSize: 11, color: COLORS.slate, valign: "mid", margin: 0,
    });
  });
  slide.addNotes(NOTES.discovery);
}

// SLIDE 10 — HOW WE'D ENGAGE / FREE FIRST STEP
function engageSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "A free first step",
    "Start with a no-commitment read of your environment",
    "Before anyone talks contracts, we give you something useful — a clear picture of where you stand, yours to keep.",
    10, COLORS.blue);

  // Left: the free Nexus Assess card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 2.3, w: 5.7, h: 4.45, rectRadius: 0.08,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 2.3, w: 5.7, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("FREE · NO CONTRACT · YOURS TO KEEP", {
    x: 0.8, y: 2.55, w: 5.2, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText("Nexus Assess", {
    x: 0.8, y: 2.85, w: 5.2, h: 0.55, fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white, margin: 0,
  });
  slide.addText("A security and risk read of your actual environment:", {
    x: 0.8, y: 3.45, w: 5.2, h: 0.4, fontFace: "Arial", fontSize: 12, color: COLORS.white, margin: 0, transparency: 10, valign: "top",
  });
  const bullets = [
    "Internal + external vulnerability scan",
    "Dark-web credential exposure check",
    "Microsoft 365 security configuration review",
    "Prioritized roadmap mapped to HIPAA",
  ];
  bullets.forEach((b, i) => {
    const y = 3.95 + i * 0.5;
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.85, y: y + 0.07, w: 0.12, h: 0.12, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
    slide.addText(b, { x: 1.1, y, w: 5.0, h: 0.44, fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 6 });
  });
  slide.addText("No obligation. Whether or not we ever work together, the roadmap is yours to act on with your own team.", {
    x: 0.8, y: 6.05, w: 5.25, h: 0.6, fontFace: "Arial", fontSize: 10.5, italic: true, color: COLORS.teal, valign: "top", margin: 0,
  });

  // Right: the simple path
  const phases = [
    { n: "01", t: "Today — discovery", d: "A relaxed conversation about your environment and what matters most. No commitment.", c: COLORS.orange },
    { n: "02", t: "Free Nexus Assess", d: "We scan and review, then hand you a plain-language, HIPAA-mapped risk roadmap.", c: COLORS.blue },
    { n: "03", t: "Right-sized co-managed proposal", d: "Only the layers you actually want, scoped to your real environment — every line explained.", c: COLORS.teal },
  ];
  phases.forEach((p, i) => {
    const y = 2.3 + i * 1.5;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.55, y, w: 6.25, h: 1.35, rectRadius: 0.08,
      fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.72, y: y + 0.22, w: 0.95, h: 0.9, rectRadius: 0.1,
      fill: { color: p.c }, line: { color: p.c, transparency: 100 },
    });
    slide.addText(p.n, {
      x: 6.72, y: y + 0.22, w: 0.95, h: 0.9,
      fontFace: "Arial", fontSize: 22, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0,
    });
    slide.addText(p.t, {
      x: 7.85, y: y + 0.2, w: 4.8, h: 0.4, fontFace: "Arial", fontSize: 15, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(p.d, {
      x: 7.85, y: y + 0.62, w: 4.85, h: 0.65, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0,
    });
  });
  slide.addNotes(NOTES.engage);
}

// SLIDE 11 — CLOSING / CTA
function closingSlide() {
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
  slide.addText("THE NEXT STEP", {
    x: 0.55, y: 1.05, w: 6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "One small step. ", options: { color: COLORS.white, bold: true } },
    { text: "Nothing to sign.", options: { color: COLORS.orange, bold: true } },
  ], {
    x: 0.55, y: 1.35, w: 12, h: 0.7,
    fontFace: "Arial", fontSize: 34, margin: 0,
  });

  const opts = [
    { tag: "Recommended", title: "Book your free Nexus Assess", body: "We scan your environment and Microsoft 365, then hand you a prioritized, HIPAA-mapped roadmap within about 10 business days — yours to keep, no contract, no obligation.", band: COLORS.teal },
    { tag: "Happy to share", title: "Our security + AI playbook", body: "I'll walk you through the broader security and practical-AI playbook we run for ourselves and our clients — useful context whether or not we work together.", band: COLORS.orange },
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
      x: x + 0.25, y: 2.95, w: 5.6, h: 0.5,
      fontFace: "Arial", fontSize: 18, bold: true, color: COLORS.white, margin: 0,
    });
    slide.addText(o.body, {
      x: x + 0.25, y: 3.55, w: 5.6, h: 1.7,
      fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 12,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85, rectRadius: 0.4,
    fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText([
    { text: "Let's book your free Nexus Assess   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 10 } },
  ], {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85,
    align: "center", valign: "mid", margin: 0,
  });

  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  Panchkula, India  ·  technology as a solution", {
    x: 0.55, y: 6.75, w: 12.2, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white,
    align: "center", margin: 0, transparency: 35,
  });
  slide.addNotes(NOTES.closing);
}

// ============ MAIN ============

coverSlide();
whySlide();
heardSlide();
whoSlide();
proofSlide();
coManagedSlide();
waysSlide();
securitySlide();
discoverySlide();
engageSlide();
closingSlide();

pptx.writeFile({ fileName: outPath }).then(filename => {
  console.log(`  Wrote ${filename}`);
});
