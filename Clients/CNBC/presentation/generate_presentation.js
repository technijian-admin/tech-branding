const path = require("path");
const PptxGenJS = require("C:/vscode/tech-branding/tech-branding/Clients/CDLX/presentation/node_modules/pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for Creative Nonprofit Business Consultants — Securing a Fully Remote Team";
pptx.title = "Technijian for Creative Nonprofit Business Consultants";
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

const outPath = path.resolve(__dirname, "Technijian for CNBC - Meeting Deck.pptx");

// ============ SPEAKER NOTES (presenter-facing; not shown on slides) ============
const NOTES = {
  cover:
    "OPEN WARM. Thank Cheryl for returning the call and for her time. You're Ravi, you lead Technijian — Irvine-based, ~25 years, and you work with a lot of small, fully-remote teams. Frame today as a working conversation about securing her remote team and what it costs — NOT a hard sell. She's the Owner/CEO, she's not technical, and she's exploring. Keep it relaxed and plain-spoken.",
  agenda:
    "Set expectations: six quick stops, ending on pricing and a no-commitment next step. Say it plainly: \"I won't oversell a 7-person team — you'll leave knowing what you need and what it costs.\" Then hand her the wheel: \"Anything you specifically want to make sure we cover?\" Let her priorities reorder the talk if needed.",
  situation:
    "Play the notes back to show you listened. Confirm each number LIVE — still ~7 people? still CA/AZ/NY/MD? still no server, everything in Microsoft 365? Is the college intern still the only IT help? This is discovery, so correct anything wrong on the spot. Good probes: \"What's eating the intern's time?\" / \"Has anything scared you on the security side lately?\" / \"Besides you, who weighs in on this decision?\"",
  remoteReality:
    "The teaching moment, in plain English. The point: with no office and no server, there's no network to defend — so protection moves to two places, the LOGIN and the LAPTOP. Watch for the 'aha.' Avoid jargon. If she's nodding, move fast; if she looks puzzled, slow down on \"the login is the new lock\" — that's the idea everything else hangs on.",
  intern:
    "Be respectful — she likes and trusts the intern, and may feel protective. The message is NOT \"fire the intern.\" It's: one part-time person can't watch 7 laptops across 4 time zones around the clock, and the knowledge walks out the door at graduation. Offer CO-MANAGED — we work alongside and even mentor the intern. That lowers her guilt and her sense of risk at the same time.",
  howWeSecure:
    "This directly answers the question she came with. Walk the six layers briefly — don't lecture. Emphasize Layer 1 (MFA / identity) and Layer 5 (people / training) as the highest-leverage, lowest-cost wins. Call out Layer 4 in plain terms: \"Microsoft 365 is not a backup — if a file is deleted or hit by ransomware, you need an independent copy.\" Tie every layer back to \"works on each laptop, wherever it is — no office required.\"",
  stack:
    "Keep this short — she does not need all five. Say: \"You'd start with My IT + My Security; that's the core of what you asked for. The rest are here when you grow.\" Mention My Compliance only as the answer to \"when a funder or board asks how you protect their data.\" Do NOT pitch My AI / SEO / Lead Gen unless she asks — wrong meeting.",
  whyItMatters:
    "This is the value framing for HER business. She sells trust to nonprofits; a breach of donor or grant data isn't just downtime, it's existential to her brand. More funders and boards now ask consultants how they protect data — being able to say \"we're professionally secured\" wins and keeps work. Use this to flip security from a cost into a competitive advantage she can talk about.",
  pricing:
    "She explicitly asked for pricing — so deliver, but keep control of the framing. Walk the itemized per-person stack so the number feels EARNED, not pulled from the air. Land on about $90 per user — roughly $630 a month for all seven. Then immediately add: \"That's an estimate using our standard small-business packages — the same way we price other 7-person teams. Your fixed quote comes after a free 30-minute assessment, and nonprofit Microsoft 365 licensing (often free or deeply discounted) brings it down further.\" If she pushes for an exact number: \"Give me 30 minutes to look at your setup and I'll put a fixed number in writing.\" NEVER discuss our cost basis or how we staff it — only her investment. (Source: standard desktop $26.50 + email/Inky $4.75 + M365 backup $4.00 + training $6.00 + ~$46 managed help-desk per person, + $20/mo domain monitoring.)",
  engage:
    "Lower the stakes. The only thing you're asking for today is Step 2 — a free 30-minute assessment. Everything after is gated and reversible. Reassure on speed: \"We secure identities and laptops first, in days — you'd feel safer inside the first week.\" Reassure on the intern: we can run alongside them. No long lock-in talk; this is about earning the next small step.",
  nextSteps:
    "Close on ONE thing: book the free remote-security assessment. Offer the 1-page secure-remote-team checklist as a give-away no matter what — it keeps goodwill if she's not ready to decide. Confirm the best email to send things to and propose a specific time this week. End warm, zero pressure. Then send a short recap email TODAY with your signature and the booking link.",
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
  slide.addText("Technijian  |  For Creative Nonprofit Business Consultants  |  2026-06-05", {
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
    x: 10.5, y: 0.95, w: 2.1, h: 0.32, rectRadius: 0.04,
    fill: { color: COLORS.dark, transparency: 30 },
    line: { color: COLORS.teal, pt: 0.75 },
  });
  slide.addText("PREPARED FOR CNBC", {
    x: 10.5, y: 0.95, w: 2.1, h: 0.32,
    fontFace: "Arial", fontSize: 8.5, bold: true, color: COLORS.teal,
    align: "center", valign: "mid", charSpace: 1, margin: 0,
  });
  slide.addText("Technijian", {
    x: 0.7, y: 2.3, w: 12, h: 0.95,
    fontFace: "Arial", fontSize: 52, bold: true, color: COLORS.white,
    margin: 0,
  });
  slide.addText("for Creative Nonprofit Business Consultants", {
    x: 0.7, y: 3.25, w: 12.2, h: 0.7,
    fontFace: "Arial", fontSize: 30, bold: true, color: COLORS.orange,
    margin: 0,
  });
  slide.addText("Securing a fully remote team — wherever your people log in.", {
    x: 0.7, y: 4.15, w: 11.8, h: 0.5,
    fontFace: "Arial", fontSize: 18, color: COLORS.white, margin: 0,
    transparency: 18,
  });
  hLine(slide, 0.7, 5.2, 11.9, COLORS.teal, 0.018);
  slide.addText("Meeting briefing  |  Ravi Jain ↔ Cheryl Taylor (Owner & CEO)  |  Fri 2026-06-05  |  1:00 PM PT  |  Teams", {
    x: 0.7, y: 5.35, w: 11.9, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0,
  });
  slide.addText("Cybersecurity for a distributed, cloud-only nonprofit consultancy  ·  7 people  ·  4 states", {
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
    "A working conversation, not a hard pitch. You wanted to understand cybersecurity for a remote team, and pricing — so that's where we'll spend the time.",
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
  slide.addText("Give you a clear, plain-language picture of how a 7-person, fully remote team gets secured — and what it costs — so you can decide your next step with no pressure.", {
    x: 0.78, y: 3.05, w: 3.5, h: 1.9,
    fontFace: "Arial", fontSize: 14, color: COLORS.white, valign: "top", margin: 0, transparency: 8,
  });
  slide.addText([
    { text: "You bring the questions.\n", options: { bold: true, color: COLORS.teal, fontSize: 12 } },
    { text: "We bring straight answers — and we won't oversell a team your size.", options: { color: COLORS.white, fontSize: 12, transparency: 15 } },
  ], {
    x: 0.78, y: 5.55, w: 3.5, h: 1.1, valign: "top", margin: 0,
  });

  const items = [
    { t: "What we heard from you", d: "7 people, 4 states, no server, intern-run IT — said back to make sure we got it right." },
    { t: "Why remote is a different security problem", d: "When there's no office network, the rules change. In plain terms." },
    { t: "How we secure a fully remote team", d: "The six layers that protect each laptop and login — no server required." },
    { t: "What managed IT + security looks like", d: "The Technijian services, right-sized to a small nonprofit consultancy." },
    { t: "Pricing — real numbers for seven", d: "How we price, what 7 users runs, nonprofit savings, and the path to a firm quote." },
    { t: "Next step", d: "A free, no-commitment security assessment of your setup." },
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
    "From your conversation with Jannea and Sierra. If we got anything wrong, today's the time to fix it.",
    3, COLORS.teal);

  const stats = [
    { n: "7", l: "Team members & laptops" },
    { n: "4", l: "U.S. states  ·  CA AZ NY MD" },
    { n: "0", l: "On-prem servers (cloud-only)" },
    { n: "1", l: "Intern running IT today" },
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
    { text: "Fully remote, no office network. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Laptops in California, Arizona, New York, and Maryland — nothing tying them together but the cloud. You and your admin assistant work from a small office; everyone else is distributed.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "Cloud-only. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "No server to defend — your work lives in Microsoft 365 and on each individual laptop. That changes where security has to live.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "Cybersecurity is the priority — and there's no IT provider yet. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "A college intern has carried IT so far. You want professional protection for a distributed team, and a clear answer on what it costs.", options: { color: COLORS.slate, fontSize: 12.5 } },
  ], {
    x: 0.85, y: 4.5, w: 11.7, h: 2.1,
    valign: "top", margin: 0,
  });
  slide.addNotes(NOTES.situation);
}

// SLIDE 4 — REMOTE-FIRST REALITY
function remoteRealitySlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The core idea",
    "When there's no office, every laptop is the front door",
    "A fully remote, cloud-only team isn't a smaller version of an office — it's a different shape. Here's why, in plain terms.",
    4, COLORS.blue);

  const cols = [
    { title: "The old model", sub: "(what you don't have)", band: COLORS.grey, items: [
      "An office with one network",
      "A firewall at the door",
      "A server in a closet",
      "IT staff down the hall",
      "Everyone behind one wall",
    ] },
    { title: "Your reality", sub: "(remote-first)", band: COLORS.orange, items: [
      "7 laptops, 7 home networks",
      "4 states, multiple time zones",
      "Work in Microsoft 365 / the cloud",
      "Each login = the keys to everything",
      "No wall — each device on its own",
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
        x: x + 0.38, y: ty, w: 2.32, h: 0.6,
        fontFace: "Arial", fontSize: 11, color: COLORS.slate, valign: "top", margin: 0,
      });
    });
  });

  const takeaways = [
    { n: "1", t: "The perimeter is gone", d: "There's no office wall to hide behind. Each laptop is exposed on its own home or coffee-shop Wi-Fi — so protection has to live on the device itself.", c: COLORS.blue },
    { n: "2", t: "The login is the new lock", d: "Whoever controls your Microsoft 365 sign-in controls your data. Securing that login — with MFA and access rules — is job number one.", c: COLORS.teal },
    { n: "3", t: "Protection must be remote-native", d: "Tools that assume a server or an office don't fit you. Yours have to reach every laptop over the internet and manage it automatically.", c: COLORS.orange },
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
  slide.addNotes(NOTES.remoteReality);
}

// SLIDE 5 — INTERN TO TEAM
function internSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The gap today",
    "Your intern got you here. Securing a distributed team is a team sport.",
    "This isn't a knock on your intern — it's that protecting 7 laptops across 4 time zones, around the clock, is more than any one person can carry.",
    5, COLORS.orange);

  const left = {
    x: 0.55, y: 2.35, w: 6.0, h: 4.45, band: COLORS.grey,
    label: "Hard for one person — through no fault of theirs",
    title: "What an intern can't cover",
    body: "•  24/7 monitoring across multiple time zones\n\n•  After-hours and weekend incident response\n\n•  A documented, repeatable security baseline applied the same way to every laptop\n\n•  Accountability — guaranteed response times, and insurance behind the work\n\n•  Continuity when they graduate or move on — today the knowledge lives in one head",
    bodySize: 12, bodyY: 0.95,
  };
  const right = {
    x: 6.78, y: 2.35, w: 6.0, h: 4.45, band: COLORS.blue,
    label: "What changes with a managed partner",
    title: "What a team adds",
    body: "•  A credentialed team and a 24/7 Security Operations Center behind every laptop\n\n•  Written security standards, applied consistently to all 7 devices\n\n•  One number to call — with defined, guaranteed response times\n\n•  Knowledge that stays — documented and owned by us, not stuck in one person\n\n•  We can mentor your intern alongside us (co-managed), so they grow with you",
    bodySize: 12, bodyY: 0.95,
  };
  addCard(slide, left);
  addCard(slide, right);
  slide.addNotes(NOTES.intern);
}

// SLIDE 6 — HOW WE SECURE A REMOTE TEAM (CORE)
function howWeSecureSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The answer to your question",
    "How we secure a fully remote team — no server required",
    "Six layers that travel with each person, wherever they log in. This is exactly what you asked us to explain.",
    6, COLORS.teal);

  const layers = [
    { title: "Identity & access", band: COLORS.blue, body: "Multi-factor authentication on every login, smart access rules, and hardened Microsoft 365 sign-ins. The login is the new perimeter — we lock it down first." },
    { title: "Every device protected", band: COLORS.orange, body: "Managed antivirus + threat detection on all 7 laptops, disk encryption, and automatic updates — enforced over the internet, no office visit needed." },
    { title: "Email & web defense", band: COLORS.teal, body: "Phishing and spam filtering, malicious-link protection, and safe web/DNS filtering. Most attacks arrive by email — we stop them before the click." },
    { title: "Data & backup", band: COLORS.chartreuse, body: "Independent, ransomware-resilient backup of your Microsoft 365 data with fast recovery. The cloud by itself is not a backup." },
    { title: "Your people", band: COLORS.green, body: "Short security-awareness training and simulated phishing. Your team becomes your strongest layer instead of the weakest link." },
    { title: "Eyes on glass, 24/7", band: COLORS.dark, body: "A Security Operations Center watching alerts around the clock, with a defined response when something looks wrong — across every time zone your team works in." },
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
  slide.addNotes(NOTES.howWeSecure);
}

// SLIDE 7 — THE TECHNIJIAN STACK
function stackSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The Technijian stack",
    "Five services — you'd start with just the first two",
    "Each works on its own. For a team your size, My IT + My Security is the foundation; the rest are here when you grow.",
    7, COLORS.orange);

  const services = [
    { title: "My IT", sub: "Managed & Co-Managed", body: "Help desk + monitoring + patching for your laptops and Microsoft 365. We can run it fully, or alongside your intern.", band: COLORS.blue, start: true },
    { title: "My Security", sub: "24/7 SOC", body: "EDR + email security + MFA-everywhere + 24/7 monitoring and response. This is the core of what you came to us for.", band: COLORS.orange, start: true },
    { title: "My Compliance", sub: "When clients ask", body: "HIPAA, SOC 2, and more — evidence and guidance for when a funder or client asks how you protect their data.", band: COLORS.teal },
    { title: "My Jian", sub: "Our security platform", body: "Technijian-built monitoring that watches across your tools and produces a plain monthly security report.", band: COLORS.chartreuse },
    { title: "My AI / My Dev", sub: "When you're ready", body: "Practical AI and custom builds — a later conversation, only if and when it helps the mission.", band: COLORS.dark },
  ];
  services.forEach((s, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.3 + Math.floor(i / 3) * 2.45;
    addCard(slide, {
      x, y, w: 3.95, h: 2.25, band: s.band,
      label: s.sub, title: s.title, body: s.body,
      footer: s.start ? "Start here." : null,
    });
  });
  slide.addNotes(NOTES.stack);
}

// SLIDE 8 — WHY IT MATTERS FOR A NONPROFIT CONSULTANCY
function whyItMattersSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Why this matters for you",
    "For a firm that serves nonprofits, trust is the product",
    "Security isn't overhead for CNBC — it's part of the credibility you sell to the organizations that rely on you.",
    8, COLORS.blue);

  const cards = [
    { title: "You hold sensitive data", band: COLORS.orange, body: "Client financials, grant and donor information, board materials. A breach there isn't just downtime — it's a hit to the trust your business runs on." },
    { title: "Your clients are starting to ask", band: COLORS.blue, body: "Funders, boards, and partners increasingly ask consultants “how do you protect our data?” A clear, confident answer helps you win and keep work." },
    { title: "Nonprofits are targeted", band: COLORS.teal, body: "Attackers see mission-driven organizations — and the firms that serve them — as softer targets. Being the secure consultant is a real differentiator." },
    { title: "Do more with less", band: COLORS.green, body: "Managed security gives a 7-person firm enterprise-grade protection without an enterprise budget — and gets you out of being the help desk." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 2) * 6.23;
    const y = 2.3 + Math.floor(i / 2) * 2.0;
    addCard(slide, { x, y, w: 6.0, h: 1.8, band: c.band, title: c.title, body: c.body, titleSize: 15, bodySize: 11, bodyY: 0.92 });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.28, w: 12.25, h: 0.6, rectRadius: 0.06,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addText("Modeling good data stewardship isn't a cost for CNBC — it's part of the value you offer the nonprofits you serve.", {
    x: 0.55, y: 6.28, w: 12.25, h: 0.6,
    fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.white,
    align: "center", valign: "mid", margin: 0,
  });
  slide.addNotes(NOTES.whyItMatters);
}

// SLIDE 9 — PRICING (real numbers from the rate card / standard packages)
function pricingSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Pricing",
    "What it costs — real numbers for seven",
    "You asked about cost, so here it is. This is how we price a team your size, using our standard small-business security packages. Your final, fixed quote is set after a free assessment.",
    9, COLORS.teal);

  // Left panel — itemized per-person estimate
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
    { l: "Email security & archiving (anti-phishing / anti-spam)", p: "$4.75" },
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

  // per-person subtotal
  slide.addText("Per person", {
    x: 0.78, y: 5.2, w: 5.0, h: 0.36, fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.blue, valign: "mid", margin: 0,
  });
  slide.addText("≈ $87 / mo", {
    x: 5.5, y: 5.2, w: 2.45, h: 0.36, fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.blue, align: "right", valign: "mid", margin: 0,
  });
  // org-wide add
  slide.addText("+ Email-domain (DMARC/DKIM) monitoring — whole org", {
    x: 0.78, y: 5.62, w: 6.1, h: 0.34, fontFace: "Arial", fontSize: 10, italic: true, color: COLORS.grey, valign: "mid", margin: 0,
  });
  slide.addText("$20 / mo", {
    x: 6.95, y: 5.62, w: 1.0, h: 0.34, fontFace: "Arial", fontSize: 10.5, bold: true, italic: true, color: COLORS.grey, align: "right", valign: "mid", margin: 0,
  });
  slide.addText("Optional as you grow: encrypted email, advanced identity / single sign-on, deeper activity monitoring.", {
    x: 0.78, y: 5.98, w: 7.1, h: 0.32, fontFace: "Arial", fontSize: 9.5, italic: true, color: COLORS.grey, valign: "top", margin: 0,
  });

  // Right panel — the estimate + nonprofit budget
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.25, y: 2.3, w: 4.55, h: 4.05, rectRadius: 0.08,
    fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, { x: 8.25, y: 2.3, w: 4.55, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("YOUR ESTIMATE — ALL 7 USERS", {
    x: 8.48, y: 2.52, w: 4.1, h: 0.28, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.4, margin: 0,
  });
  slide.addText("≈ $630", {
    x: 8.48, y: 2.82, w: 4.1, h: 0.7, fontFace: "Arial", fontSize: 44, bold: true, color: COLORS.white, margin: 0,
  });
  slide.addText("per month  ·  about $90 / user", {
    x: 8.48, y: 3.52, w: 4.1, h: 0.3, fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.teal, margin: 0,
  });
  slide.addText("Before Microsoft 365 nonprofit licensing — often free or deeply discounted — lowers it further.", {
    x: 8.48, y: 3.86, w: 4.05, h: 0.6, fontFace: "Arial", fontSize: 10.5, color: COLORS.white, valign: "top", margin: 0, transparency: 15,
  });
  hLine(slide, 8.48, 4.5, 4.05, COLORS.teal, 0.01);
  const pts = [
    "Flat, predictable monthly — one bundle, billed per person.",
    "Every line shown — nothing hidden, you approve the scope.",
    "A fixed quote in writing after a free 30-minute assessment.",
  ];
  pts.forEach((p, i) => {
    const y = 4.66 + i * 0.5;
    slide.addShape(pptx.ShapeType.ellipse, { x: 8.48, y: y + 0.06, w: 0.1, h: 0.1, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
    slide.addText(p, { x: 8.66, y, w: 3.95, h: 0.46, fontFace: "Arial", fontSize: 10.5, color: COLORS.white, valign: "top", margin: 0, transparency: 10 });
  });

  // bottom honest disclaimer
  slide.addText("Illustrative estimate using our standard small-business security packages — the same way we price other 7-person teams. Final fixed monthly quote is set after a free assessment, and before nonprofit Microsoft 365 licensing.", {
    x: 0.55, y: 6.5, w: 12.25, h: 0.4,
    fontFace: "Arial", fontSize: 9.5, italic: true, color: COLORS.grey, align: "center", margin: 0,
  });
  slide.addNotes(NOTES.pricing);
}

// SLIDE 10 — HOW WE'D ENGAGE
function engageSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "How we'd engage",
    "Discovery first. Start small. No long lock-in.",
    "A low-commitment path — a small first step that earns the right to the next one.",
    10, COLORS.blue);

  const phases = [
    { n: "01", t: "Discovery", d: "A 30-minute conversation (today). We learn your team, devices, and what matters most. No commitment.", c: COLORS.orange },
    { n: "02", t: "Free security assessment", d: "We review your Microsoft 365 setup and the 7 laptops, then hand you a plain-language risk snapshot — what's exposed, ranked.", c: COLORS.blue },
    { n: "03", t: "Scoped quote", d: "A fixed, per-user monthly proposal with nonprofit licensing applied. Every line explained, nothing hidden.", c: COLORS.teal },
    { n: "04", t: "Onboard & protect", d: "We secure identities and laptops first (days, not months), then settle into 24/7 managed protection — alongside your intern if you like.", c: COLORS.chartreuse },
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
      x, y: 3.6, w: 2.92, h: 3.2, rectRadius: 0.08,
      fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 3.6, w: 2.92, h: 0.06, fill: { color: p.c }, line: { color: p.c, transparency: 100 },
    });
    slide.addText(p.t, {
      x: x + 0.18, y: 3.8, w: 2.56, h: 0.4,
      fontFace: "Arial", fontSize: 15, bold: true, color: COLORS.dark, margin: 0,
    });
    slide.addText(p.d, {
      x: x + 0.18, y: 4.3, w: 2.56, h: 2.3,
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
  slide.addNotes(NOTES.engage);
}

// SLIDE 11 — NEXT STEPS + Q&A
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
    { tag: "Recommended", title: "Free remote-security assessment", body: "We review your Microsoft 365 and your 7 laptops, then come back with a plain-language risk snapshot and a fixed, per-user quote — with nonprofit pricing applied. You decide from there.", band: COLORS.teal },
    { tag: "You keep this either way", title: "A 1-page secure-remote-team checklist", body: "A short, plain checklist of the protections every fully remote team should have — yours to keep and act on, whether or not we work together.", band: COLORS.orange },
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
      fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 14,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85, rectRadius: 0.4,
    fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText([
    { text: "Book a 30-minute assessment   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 10 } },
  ], {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85,
    align: "center", valign: "mid", margin: 0,
  });

  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  Securely supporting fully remote teams.", {
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
remoteRealitySlide();
internSlide();
howWeSecureSlide();
stackSlide();
whyItMattersSlide();
pricingSlide();
engageSlide();
nextStepsSlide();

pptx.writeFile({ fileName: outPath }).then(filename => {
  console.log(`  Wrote ${filename}`);
});
