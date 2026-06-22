const path = require("path");
const PptxGenJS = require("C:/vscode/tech-branding/tech-branding/Clients/CDLX/presentation/node_modules/pptxgenjs");

// Technijian — First IT Discovery Meeting deck for ROG Services (RGS).
// COLD inbound lead (via technijian.com). FACTS-ONLY: state only public facts,
// invite correction, turn every unknown into a discovery question. Do NOT assume
// their internal IT, security stack, or that they have in-house IT staff.

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for ROG Services — Managed & Co-Managed IT, Security & Strategic Support";
pptx.title = "Technijian for ROG Services";
pptx.lang = "en-US";
pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-US" };

// ---- Authentic Technijian logo files ----
const LOGO_LIGHT = "C:/vscode/tech-branding/tech-branding/Clients/RGS/assets/Technijian Logo 2.png";        // dark text — light bg
const LOGO_DARK  = "C:/vscode/tech-branding/tech-branding/Clients/RGS/assets/Technijian Logo - white text.png"; // white text — dark bg
const LOGO_AR = 4.78;

const COLORS = {
  blue: "006DB6", teal: "1EAAC8", orange: "F67D4B", chartreuse: "CBDB2D",
  dark: "1A1A2E", slate: "334155", grey: "64748B", light: "E9EEF5",
  offWhite: "F8FAFC", white: "FFFFFF", line: "D8E0EA",
  paleBlue: "EAF4FB", green: "0F766E", red: "B42318",
};

const outPath = path.resolve(__dirname, "Technijian for ROG Services - First Meeting Deck.pptx");

// ============ SPEAKER NOTES (presenter-facing; not shown on slides) ============
const NOTES = {
  cover:
    "OPEN WARM. This is a COLD inbound lead — someone at ROG Services reached out through technijian.com about IT. You don't yet know WHO will be in the room or what they run. Job #1 in the first 5 minutes: find out who you're talking to (a principal? office manager? finance? the board?), what prompted the inquiry, and who else decides. You're Ravi, Founder & CEO of Technijian — Irvine-based, 25+ years, security-first, and we work with nonprofits. Frame the meeting in one line: \"I did my homework on what ROG does publicly, but I've assumed NOTHING about your systems — today is about understanding your world and finding where we genuinely help.\" NOTE: their site is rogservices.ORG but the published email is rogservices.COM (the .com redirects to .org) — confirm the right email before any follow-up. Everything on the next slides about ROG is from PUBLIC sources only; invite correction freely.",
  why:
    "Set expectations in 20 seconds: six quick stops, ending on the part that matters most — THEIR questions — and a free, no-commitment next step. Say it plainly: \"I'm not here to sell you a network you didn't ask for. I'm here to understand how you protect the people you serve, and find the two or three places a partner takes real work off your plate.\" Then hand them the wheel early: \"Before I talk — what made you reach out to us? What would make the next 40 minutes worth your time?\" Let their answer reorder the deck. The dark card is the promise: you stay in control, we right-size to a nonprofit budget.",
  verified:
    "Show we did our homework AND that we respect the line between public facts and their private reality. Walk the four facts fast — founded 2010, 7 offices across CA + Montana, 2,100+ clients (THEIR reported figure), SSA + VA representative-payee / fiduciary. Then the honest framing: \"Everything here is from your website and public filings — I have NOT assumed anything about your IT, your software, or your security. Correct me where I'm wrong.\" The thing that matters: as a payee/fiduciary you (a) hold deeply sensitive data — SSNs, bank details, health/disability info — and (b) MOVE money for vulnerable people. That combination is exactly what raises the security bar. Don't assert they have gaps; ask how they handle it today. Good probes: \"Who set up your IT originally?\" / \"What keeps you up at night on the data side?\"",
  who:
    "Earn the right to keep talking — 20 seconds, not a history lesson. Four proof points: (1) 25+ years, since 2000 — we're not going anywhere; (2) the POD model — a named team that learns YOUR environment, not a new stranger every ticket; (3) security-first, CISSP-led, our own 24/7 SOC; (4) AI-forward — we actually build, not just resell. For a nonprofit, add the affordability note: we know the nonprofit licensing programs (TechSoup, Microsoft 365 nonprofit) and we right-size. If they're quiet, ask: \"Have you worked with an outside IT provider before — what did you like or want to be different?\"",
  proof:
    "Credibility BEFORE pitch. Anonymized industry profiles — scope and effort only, no client names, no invented metrics. Pick the ONE closest to their world and go deeper; don't read all three. The signal: \"we've protected multi-site nonprofits and organizations that move money and hold sensitive personal data — exactly your situation — and done it on a right-sized budget.\" Honesty rule: if they ask for references or specifics we can't share live, promise a proper case study in the follow-up — never fabricate a number or a logo.",
  fit:
    "This kills the #1 fear of a small org: \"are you going to take over and run up a bill?\" The truth: we flex to whatever they have. KEY UNKNOWN to resolve live — who runs their IT TODAY? An internal person? An outside shop? The office manager doing their best? We genuinely don't know, so ASK before positioning. If they have no real IT function, FULLY MANAGED fits. If they have someone, CO-MANAGED augments them. Either way: they keep control, we cover what a small team can't staff (24/7, security, backup, projects), and we right-size to a nonprofit. Say: \"On your worst week we're the bench you call; on a normal week you barely notice us.\"",
  security:
    "Highest-stakes slide — but DON'T lecture them on their own duty. They're an SSA/VA representative payee: they hold SSNs, bank-account details, and health/disability information, and they DISBURSE benefit money and remotely load prepaid debit cards for 2,100+ vulnerable people. Two factual hooks (use, don't fear-monger): (1) SSA expressly requires payees to have DOCUMENTED procedures protecting personal information and role-based access — that's a real obligation, not my opinion; (2) Business Email Compromise / payment-diversion was the #2 cybercrime by dollar loss in 2024 ($2.77B to the FBI), and the FBI specifically calls out redirecting payments onto prepaid cards — which is literally part of your workflow. Walk the six layers fast; ASK which they already feel good about and which worry them. The honest line: \"You could build any one of these — the hard part is running all six at once, across seven offices, with evidence for an SSA or VA review. That's where a partner earns its keep.\" Do NOT assert gaps you haven't confirmed. Flag honestly that HIPAA/GLBA/CCPA applicability is a real legal question for a payee — we don't pretend to know; we'd confirm with your counsel.",
  ways:
    "Plant 2-3 seeds, then SHUT UP and watch which one they react to — that tells you what actually hurts. Don't pitch all three equally. For a small multi-site nonprofit the live wires are usually #1 (nobody really owns our IT / it's a patchwork) or #2 (we move money and hold SSNs and I'm not sure we're protected). #3 (strategic + AI) is the differentiator nobody else brings — mention the annual SSA/VA accounting and per-beneficiary reporting burden across 2,100 clients lightly as \"the kind of repetitive paperwork AI can take off your staff, once the basics are solid,\" not a hard pitch. Frame each as a hypothesis: \"orgs your size usually feel X — true for you?\"",
  discovery:
    "THE POINT OF THE MEETING. Put the deck down and let them talk — aim for them doing 70% of the talking. Questions go easy->strategic; skip any already answered. The must-learns: (a) who owns IT today and what's actually deployed (M365 vs Google, MFA, who supports it); (b) how the 7 offices connect and which are staffed; (c) what runs the per-beneficiary accounting / bill-pay / prepaid-card loading; (d) how they guard against a fraudulent payment-change request (BEC); (e) how records are stored, backed up, and produced for SSA/VA reviews; (f) where staff lose time to manual paperwork; (g) the decision chain (board? finance? leadership?). End on \"what would make this worth your time\" so you close on THEIR terms. Never ask something you should already know from public info — that signals you didn't prepare.",
  engage:
    "Lower the stakes to near zero. The only ask today is the free Nexus Assess — internal + external vulnerability scan, dark-web credential check, and a Microsoft 365 / Google Workspace security review, handed back as a prioritized roadmap they keep whether or not we ever work together. For a fiduciary, frame the roadmap as mapped to the SSA/VA safeguarding expectations and security best practice (NOT 'HIPAA' — that's an open legal question for a payee; don't overclaim). It gives them a real artifact to take to their board/finance, and it gives us the data to scope a right-sized managed or co-managed proposal with nonprofit licensing applied. Reassure: \"This isn't a sales trap — it's a read of your environment you can act on with whoever supports you today.\" If they ask price: verbal range only; the fixed number comes after the assessment. NEVER discuss our cost basis.",
  closing:
    "Close on ONE concrete thing: book the free Nexus Assess, roadmap back within ~10 business days, no contract, no obligation, theirs to keep. Broaden slightly so you're a peer advisor, not a one-deal pitch: \"...and I'm happy to share the broader security + practical-AI playbook we run for ourselves and our clients, including nonprofits.\" Confirm the best email (verify the rogservices.org vs .com address), propose a specific time this week, and send a short recap email TODAY with the booking link and your signature. End warm, zero pressure.",
};

// ============ HELPERS ============
function hLine(slide, x, y, w, color = COLORS.line, thickness = 0.012) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h: thickness, fill: { color }, line: { color, transparency: 100 } });
}
function addLogo(slide, x, y, w, dark = false) {
  slide.addImage({ path: dark ? LOGO_DARK : LOGO_LIGHT, x, y, w, h: w / LOGO_AR });
}
function addFooter(slide, page) {
  hLine(slide, 0.5, 7.05, 12.35, COLORS.line, 0.012);
  slide.addText("Technijian  |  For ROG Services  |  IT Discovery Meeting", {
    x: 0.55, y: 7.1, w: 9.0, h: 0.25, fontFace: "Arial", fontSize: 9, color: COLORS.grey, margin: 0,
  });
  slide.addText(`${page}`, { x: 12.2, y: 7.08, w: 0.6, h: 0.25, fontFace: "Arial", fontSize: 10, bold: true, align: "right", color: COLORS.blue, margin: 0 });
}
function addHeader(slide, eyebrow, title, subtitle, page, accent = COLORS.blue) {
  slide.background = { color: COLORS.offWhite };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: accent }, line: { color: accent, transparency: 100 } });
  addLogo(slide, 0.55, 0.3, 1.75, false);
  slide.addText(eyebrow.toUpperCase(), { x: 0.55, y: 0.92, w: 9.0, h: 0.28, fontFace: "Arial", fontSize: 10, bold: true, color: accent, charSpace: 0.5, margin: 0 });
  slide.addText(title, { x: 0.55, y: 1.18, w: 12.4, h: 0.55, fontFace: "Arial", fontSize: 22, bold: true, color: COLORS.dark, margin: 0 });
  if (subtitle) slide.addText(subtitle, { x: 0.55, y: 1.7, w: 12.4, h: 0.35, fontFace: "Arial", fontSize: 11, color: COLORS.slate, margin: 0 });
  hLine(slide, 0.55, 2.05, 12.25, COLORS.line, 0.01);
  addFooter(slide, page);
}
function addCard(slide, card) {
  slide.addShape(pptx.ShapeType.roundRect, { x: card.x, y: card.y, w: card.w, h: card.h, rectRadius: 0.08, fill: { color: card.fill || COLORS.white }, line: { color: card.line || card.fill || COLORS.line, pt: 1 } });
  if (card.band) slide.addShape(pptx.ShapeType.rect, { x: card.x, y: card.y, w: card.w, h: 0.1, fill: { color: card.band }, line: { color: card.band, transparency: 100 } });
  if (card.label) slide.addText(card.label.toUpperCase(), { x: card.x + 0.18, y: card.y + 0.2, w: card.w - 0.36, h: 0.22, fontFace: "Arial", fontSize: 9, bold: true, color: card.labelColor || card.band || COLORS.blue, charSpace: 0.4, margin: 0 });
  if (card.title) slide.addText(card.title, { x: card.x + 0.18, y: card.y + 0.44, w: card.w - 0.36, h: 0.42, fontFace: "Arial", fontSize: card.titleSize || 16, bold: true, color: card.titleColor || COLORS.dark, margin: 0 });
  if (card.body) {
    const reserveBottom = card.footer ? 0.45 : 0.15;
    slide.addText(card.body, { x: card.x + 0.18, y: card.y + (card.bodyY || 0.86), w: card.w - 0.36, h: card.h - (card.bodyY || 0.86) - reserveBottom, fontFace: "Arial", fontSize: card.bodySize || 10.5, color: card.bodyColor || COLORS.slate, valign: "top", margin: 0, breakLine: false });
  }
  if (card.footer) slide.addText(card.footer, { x: card.x + 0.18, y: card.y + card.h - 0.38, w: card.w - 0.36, h: 0.28, fontFace: "Arial", fontSize: 9, bold: true, italic: true, color: card.band || COLORS.blue, margin: 0 });
}

// ============ SLIDES ============

// SLIDE 1 — COVER
function coverSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.1, w: 13.33, h: 0.4, fill: { color: COLORS.blue }, line: { color: COLORS.blue, transparency: 100 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 9.5, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 88 }, line: { color: COLORS.teal, transparency: 100 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: -1, y: 5, w: 5, h: 5, fill: { color: COLORS.orange, transparency: 92 }, line: { color: COLORS.orange, transparency: 100 } });
  addLogo(slide, 0.7, 0.8, 2.7, true);
  slide.addShape(pptx.ShapeType.roundRect, { x: 10.0, y: 0.95, w: 2.6, h: 0.32, rectRadius: 0.04, fill: { color: COLORS.dark, transparency: 30 }, line: { color: COLORS.teal, pt: 0.75 } });
  slide.addText("PREPARED FOR ROG SERVICES", { x: 10.0, y: 0.95, w: 2.6, h: 0.32, fontFace: "Arial", fontSize: 8, bold: true, color: COLORS.teal, align: "center", valign: "mid", charSpace: 0.6, margin: 0 });
  slide.addText("Technijian", { x: 0.7, y: 2.2, w: 12, h: 0.95, fontFace: "Arial", fontSize: 52, bold: true, color: COLORS.white, margin: 0 });
  slide.addText("for ROG Services", { x: 0.7, y: 3.15, w: 12.2, h: 0.7, fontFace: "Arial", fontSize: 30, bold: true, color: COLORS.orange, margin: 0 });
  slide.addText("Managed & co-managed IT, security, and the fiduciary-grade data protection your mission depends on.", { x: 0.7, y: 4.05, w: 11.8, h: 0.5, fontFace: "Arial", fontSize: 17, color: COLORS.white, margin: 0, transparency: 12 });
  hLine(slide, 0.7, 5.05, 11.9, COLORS.teal, 0.018);
  slide.addText("An introductory IT discovery conversation  ·  Ravi Jain, Founder & CEO, Technijian", { x: 0.7, y: 5.2, w: 12.0, h: 0.3, fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0 });
  slide.addText("Nonprofit SSA & VA representative payee  ·  7 offices (CA + MT)  ·  501(c)(3) since 2010  ·  serving clients who can't manage their own benefits", { x: 0.7, y: 5.58, w: 12.2, h: 0.3, fontFace: "Arial", fontSize: 10.5, bold: true, color: COLORS.teal, margin: 0 });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  technijian.com  ·  949.379.8499  ·  technology as a solution", { x: 0.7, y: 6.05, w: 11.9, h: 0.3, fontFace: "Arial", fontSize: 10, color: COLORS.white, margin: 0, transparency: 40 });
  slide.addNotes(NOTES.cover);
}

// SLIDE 2 — WHY WE'RE HERE / AGENDA
function whySlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Why we're here", "A working conversation — on your terms", "You reached out about IT. Today is about understanding how ROG works and where an outside partner genuinely helps — nothing assumed, nothing to sign.", 2, COLORS.blue);
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 2.35, w: 4.0, h: 4.5, rectRadius: 0.08, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 2.35, w: 4.0, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("OUR PROMISE TODAY", { x: 0.78, y: 2.65, w: 3.6, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0 });
  slide.addText("We're not here to sell you a network you didn't ask for. We're here to understand how you protect the people you serve — and find the two or three places an outside team genuinely takes work off your plate.", { x: 0.78, y: 3.05, w: 3.5, h: 1.9, fontFace: "Arial", fontSize: 13.5, color: COLORS.white, valign: "top", margin: 0, transparency: 6 });
  slide.addText([
    { text: "You stay in control.\n", options: { bold: true, color: COLORS.teal, fontSize: 12 } },
    { text: "We right-size to a nonprofit budget and fill the gaps a small team can't staff around the clock.", options: { color: COLORS.white, fontSize: 12, transparency: 12 } },
  ], { x: 0.78, y: 5.5, w: 3.5, h: 1.2, valign: "top", margin: 0 });

  const items = [
    { t: "What we verified about you", d: "From public sources only — said back so you can correct anything." },
    { t: "Who Technijian is", d: "25+ years, security-first, a dedicated team model — in 20 seconds." },
    { t: "How we'd fit", d: "Managed or co-managed — we flex to whoever runs your IT today." },
    { t: "Security & your fiduciary duty", d: "Protecting SSNs, benefit funds, and the people behind them." },
    { t: "Your questions", d: "The heart of the meeting — your world, your priorities." },
    { t: "A free, no-commitment next step", d: "A security read of your environment that's yours to keep." },
  ];
  items.forEach((it, i) => {
    const y = 2.4 + i * 0.74;
    slide.addShape(pptx.ShapeType.roundRect, { x: 4.8, y, w: 0.55, h: 0.55, rectRadius: 0.1, fill: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal }, line: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal, transparency: 100 } });
    slide.addText(`${i + 1}`, { x: 4.8, y, w: 0.55, h: 0.55, fontFace: "Arial", fontSize: 20, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
    slide.addText(it.t, { x: 5.55, y: y - 0.02, w: 7.2, h: 0.3, fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0 });
    slide.addText(it.d, { x: 5.55, y: y + 0.27, w: 7.25, h: 0.4, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, margin: 0, valign: "top" });
  });
  slide.addNotes(NOTES.why);
}

// SLIDE 3 — WHAT WE VERIFIED
function verifiedSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "What we verified", "What we know — from public sources only", "Everything here is from your website and public filings. We've assumed nothing about your systems. If we got anything wrong, now's the time to fix it.", 3, COLORS.teal);
  const stats = [
    { n: "2010", l: "501(c)(3) founded" },
    { n: "7", l: "Offices · CA + Montana" },
    { n: "2,100+", l: "Clients served (ROG's figure)" },
    { n: "SSA + VA", l: "Rep payee / fiduciary" },
  ];
  stats.forEach((s, i) => {
    const x = 0.55 + i * 3.06;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.35, w: 2.86, h: 1.35, rectRadius: 0.08, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
    slide.addText(s.n, { x, y: 2.46, w: 2.86, h: 0.62, fontFace: "Arial", fontSize: 25, bold: true, color: COLORS.orange, align: "center", margin: 0, valign: "mid" });
    slide.addText(s.l.toUpperCase(), { x: x + 0.1, y: 3.12, w: 2.66, h: 0.5, fontFace: "Arial", fontSize: 9, bold: true, color: COLORS.white, align: "center", margin: 0, charSpace: 0.3, transparency: 20, valign: "top" });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 3.95, w: 12.25, h: 2.8, rectRadius: 0.08, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 3.95, w: 0.12, h: 2.8, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
  slide.addText("WHAT THAT TELLS US", { x: 0.85, y: 4.15, w: 11.6, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.teal, charSpace: 0.5, margin: 0 });
  slide.addText([
    { text: "You're a fiduciary who moves money. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "As an SSA & VA representative payee you receive and disburse benefits — and remotely load prepaid debit cards — for people who can't manage their own funds. That makes your operation a payments operation, with all the risk that carries.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "You hold deeply sensitive data. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "SSNs, bank-account details, and health/disability information on a vulnerable population — exactly the data attackers and fraudsters target hardest.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "You run multi-site, on a nonprofit budget. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Seven offices across California and Montana, a small team, and a mission to protect — so the answer has to be right-sized, not enterprise-priced.", options: { color: COLORS.slate, fontSize: 12.5 } },
  ], { x: 0.85, y: 4.5, w: 11.7, h: 2.1, valign: "top", margin: 0 });
  slide.addNotes(NOTES.verified);
}

// SLIDE 4 — WHO TECHNIJIAN IS
function whoSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Who we are", "Technijian, in 20 seconds", "Enough to know we're a serious, local, security-first partner who works with nonprofits — then back to you.", 4, COLORS.blue);
  const cards = [
    { label: "Since 2000", title: "25+ years, still here", band: COLORS.blue, body: "An Irvine-based IT firm founded in 2000, with a Panchkula, India delivery center for true follow-the-sun coverage. We build long relationships — not flip-and-churn engagements." },
    { label: "The pod model", title: "A team that knows you", band: COLORS.orange, body: "You get a dedicated pod — a named team that learns your environment — not a different stranger on every ticket. It's the single thing clients tell us they were missing before." },
    { label: "Security-first", title: "Built in, not bolted on", band: COLORS.teal, body: "CISSP-led, with our own 24/7 Security Operations Center and CrowdStrike / Huntress-grade tooling. Security isn't an add-on line item for us — it's how we run everything." },
    { label: "AI-forward + nonprofit-aware", title: "We build, and we right-size", band: COLORS.chartreuse, body: "We develop practical AI and custom software — and we know the nonprofit licensing programs (TechSoup, Microsoft 365 nonprofit) that keep a 501(c)(3)'s costs down." },
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
  addHeader(slide, "How we work", "The kind of work we do for organizations like yours", "Representative engagement profiles — the shape of the work, no client names and no cherry-picked numbers. The constant: protect sensitive data and the people behind it, on a right-sized budget.", 5, COLORS.teal);
  const cards = [
    { label: "Profile A · Multi-site nonprofit", title: "Managed IT, many offices", band: COLORS.blue, body: "A nonprofit with several small offices and no full IT department. Scope: standardized and secured Microsoft 365 with nonprofit licensing, MFA for everyone, managed endpoints, and tested backups — so leadership could stop worrying about IT and focus on the mission.", foot: "Right-sized, nonprofit-priced." },
    { label: "Profile B · Handles money + PII", title: "Fraud & BEC hardening", band: COLORS.orange, body: "An organization that disburses funds and holds sensitive personal data. Scope: email security and anti-phishing, identity hardening, and a verification process for any payment- or account-change request — the controls that stop wire-fraud and payment diversion.", foot: "The controls that stop payment fraud." },
    { label: "Profile C · Records-heavy ops", title: "Document & workflow AI", band: COLORS.teal, body: "An operation buried in recurring paperwork and reporting. Scope: AI document-intelligence and workflow automation explored to cut repetitive processing — the same pattern we'd look at for annual accountings and per-client reporting, once the IT foundation is solid.", foot: "The pattern for your accounting & reporting." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + i * 4.16;
    addCard(slide, { x, y: 2.3, w: 3.95, h: 3.75, band: c.band, label: c.label, title: c.title, body: c.body, footer: c.foot, titleSize: 15, bodySize: 11, bodyY: 0.92 });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 6.25, w: 12.25, h: 0.62, rectRadius: 0.06, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addText("Different situations, one constant: we protect sensitive data and the people behind it — without taking the wheel from you.", { x: 0.55, y: 6.25, w: 12.25, h: 0.62, fontFace: "Arial", fontSize: 12.5, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
  slide.addNotes(NOTES.proof);
}

// SLIDE 6 — HOW WE'D FIT: MANAGED OR CO-MANAGED
function fitSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "How we'd fit", "Managed or co-managed — your call, not ours", "We don't yet know who runs your IT today, and that's fine. Whichever shape fits, you stay in control and we right-size to a nonprofit.", 6, COLORS.orange);
  const cols = [
    { title: "Fully managed IT", sub: "(if no one really owns IT today)", band: COLORS.blue, items: [
      "We run day-to-day IT end-to-end",
      "Help desk your staff can just call",
      "Security, backup & updates handled",
      "One predictable monthly cost",
      "You set priorities; we do the work",
    ] },
    { title: "Co-managed IT", sub: "(if you have an internal person or shop)", band: COLORS.orange, items: [
      "We augment whoever handles IT now",
      "They stay in charge of the roadmap",
      "We add 24/7, security & project bandwidth",
      "Cover nights, weekends & vacations",
      "Pick the layers you actually need",
    ] },
  ];
  cols.forEach((c, i) => {
    const x = 0.55 + i * 3.05;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.3, w: 2.85, h: 4.5, rectRadius: 0.08, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.rect, { x, y: 2.3, w: 2.85, h: 0.1, fill: { color: c.band }, line: { color: c.band, transparency: 100 } });
    slide.addText(c.title, { x: x + 0.18, y: 2.5, w: 2.5, h: 0.55, fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0, valign: "top" });
    slide.addText(c.sub, { x: x + 0.18, y: 3.0, w: 2.55, h: 0.4, fontFace: "Arial", fontSize: 9.5, italic: true, color: c.band, margin: 0, valign: "top" });
    c.items.forEach((it, idx) => {
      const ty = 3.5 + idx * 0.62;
      slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.2, y: ty + 0.06, w: 0.1, h: 0.1, fill: { color: c.band }, line: { color: c.band, transparency: 100 } });
      slide.addText(it, { x: x + 0.38, y: ty, w: 2.32, h: 0.55, fontFace: "Arial", fontSize: 11, color: COLORS.slate, valign: "top", margin: 0 });
    });
  });
  const takeaways = [
    { n: "1", t: "You keep control", d: "You own the relationship and the roadmap. We never make changes you didn't approve, and you can see everything we do.", c: COLORS.blue },
    { n: "2", t: "We cover what a small team can't", d: "24/7 security monitoring, after-hours and weekend response, backup, and surge bandwidth for projects — across all seven offices.", c: COLORS.teal },
    { n: "3", t: "Right-sized for a nonprofit", d: "We apply nonprofit licensing (TechSoup, Microsoft 365 nonprofit) and scope only what you need — protection that fits the budget.", c: COLORS.orange },
  ];
  takeaways.forEach((tk, i) => {
    const y = 2.3 + i * 1.52;
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.78, y, w: 6.02, h: 1.38, rectRadius: 0.08, fill: { color: COLORS.offWhite }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.95, y: y + 0.2, w: 0.75, h: 0.75, rectRadius: 0.1, fill: { color: tk.c }, line: { color: tk.c, transparency: 100 } });
    slide.addText(tk.n, { x: 6.95, y: y + 0.2, w: 0.75, h: 0.75, fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
    slide.addText(tk.t, { x: 7.85, y: y + 0.18, w: 4.8, h: 0.32, fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0 });
    slide.addText(tk.d, { x: 7.85, y: y + 0.5, w: 4.85, h: 0.8, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0 });
  });
  slide.addNotes(NOTES.fit);
}

// SLIDE 7 — SECURITY & THE FIDUCIARY DUTY
function securitySlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Security & your fiduciary duty", "Six layers a payee that moves money has to cover", "You hold SSNs and bank details and disburse benefit funds for vulnerable people. The bar is high — and SSA expressly asks payees to protect this data. Which layers keep you up at night?", 7, COLORS.teal);
  const layers = [
    { title: "Identity & access", band: COLORS.blue, body: "MFA on every login, conditional access, and role-based access to beneficiary data — exactly what SSA asks payees to document. Most breaches start at a stolen sign-in." },
    { title: "Endpoints & devices", band: COLORS.orange, body: "EDR + threat detection on every laptop across all offices, disk encryption, and enforced patching — on the network and off it." },
    { title: "Email & payment fraud", band: COLORS.teal, body: "Anti-phishing plus a verification process for any request to change a payment, bank account, or card load. Business email compromise is the #2 cybercrime by dollar loss." },
    { title: "Data, backup & ransomware", band: COLORS.chartreuse, body: "Immutable, tested backups of beneficiary records and accounting systems with fast recovery. A sync to the cloud is not a backup." },
    { title: "Audit-ready records", band: COLORS.green, body: "Records stored, retained, and retrievable for an SSA Protection-and-Advocacy onsite review or a VA field examination — without a fire drill." },
    { title: "24/7 SOC & response", band: COLORS.dark, body: "Eyes-on-glass monitoring with a defined response when something looks wrong — the around-the-clock coverage a small team can't staff alone." },
  ];
  layers.forEach((l, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.3 + Math.floor(i / 3) * 2.3;
    addCard(slide, { x, y, w: 3.95, h: 2.1, band: l.band, label: `Layer 0${i + 1}`, title: l.title, body: l.body, titleSize: 15, bodySize: 10.5 });
  });
  slide.addNotes(NOTES.security);
}

// SLIDE 8 — A FEW WAYS WE COULD HELP
function waysSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "A few ways we could help", "Three places a partner usually earns its keep", "Not a menu to buy today — hypotheses to react to. Tell us which of these is real for you, and which isn't.", 8, COLORS.blue);
  const services = [
    { title: "Managed / Co-Managed IT", sub: "Take work off the plate", body: "Help desk your staff can just call, managed devices and Microsoft 365 across all seven offices, patching and monitoring, and surge bandwidth for projects — with nonprofit licensing applied. We flex to whoever runs IT today.", band: COLORS.blue, foot: "One team, all offices, right-sized." },
    { title: "Security & Data Protection", sub: "Protect funds, SSNs & the people", body: "MFA and identity hardening, EDR, email and payment-fraud defense, tested backups, and records you can produce for an SSA or VA review. The protection a fiduciary handling benefit money needs — and SSA asks for.", band: COLORS.orange, foot: "Built for a payee's duty of care." },
    { title: "Strategic IT + AI Efficiency", sub: "Beyond keeping the lights on", body: "A planning cadence — and practical AI for your operation: drafting the annual SSA/VA accountings, reconciling per-beneficiary ledgers, and processing intake paperwork. The repetitive work AI can take off your staff, once the basics are solid.", band: COLORS.teal, foot: "The layer most providers don't bring." },
  ];
  services.forEach((s, i) => {
    const x = 0.55 + i * 4.16;
    addCard(slide, { x, y: 2.3, w: 3.95, h: 3.75, band: s.band, label: s.sub, title: s.title, body: s.body, footer: s.foot, titleSize: 15.5, bodySize: 11, bodyY: 0.92 });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 6.25, w: 12.25, h: 0.62, rectRadius: 0.06, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addText("Most teams your size feel one of these the most. Today's job is finding out which — then going deep there.", { x: 0.55, y: 6.25, w: 12.25, h: 0.62, fontFace: "Arial", fontSize: 12.5, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
  slide.addNotes(NOTES.ways);
}

// SLIDE 9 — DISCOVERY QUESTIONS
function discoverySlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Your turn", "The questions that actually shape a fit", "This is the part that matters most. The more candid you are here, the more useful our free assessment and any proposal will be.", 9, COLORS.orange);
  const qs = [
    "Who handles your IT today — an internal person, an outside provider, or a bit of both?",
    "Across your seven offices, which are staffed, and how do your people connect and share files?",
    "What runs the per-beneficiary accounting, bill-pay, and prepaid-card loading — a payee platform, QuickBooks, spreadsheets?",
    "Are you on Microsoft 365 or Google Workspace — and is multi-factor login turned on for everyone?",
    "How do you guard against a fraudulent request to change a payment, bank account, or card load?",
    "How are SSA/VA records stored and backed up — and how do you produce them for an onsite review or field exam?",
    "Where does your staff lose the most time to manual paperwork — annual accountings, intake, reconciliation?",
    "Besides you, who weighs in on an IT decision — the board, finance, leadership? What would make this worth your time?",
  ];
  qs.forEach((q, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 6.23;
    const y = 2.35 + row * 1.12;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 6.0, h: 1.0, rectRadius: 0.06, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.16, y: y + 0.2, w: 0.6, h: 0.6, rectRadius: 0.08, fill: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal }, line: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal, transparency: 100 } });
    slide.addText(`${i + 1}`, { x: x + 0.16, y: y + 0.2, w: 0.6, h: 0.6, fontFace: "Arial", fontSize: 18, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
    slide.addText(q, { x: x + 0.9, y: y + 0.1, w: 4.95, h: 0.82, fontFace: "Arial", fontSize: 11, color: COLORS.slate, valign: "mid", margin: 0 });
  });
  slide.addNotes(NOTES.discovery);
}

// SLIDE 10 — A FREE FIRST STEP
function engageSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "A free first step", "Start with a no-commitment read of your environment", "Before anyone talks contracts, we give you something useful — a clear picture of where you stand, yours to keep.", 10, COLORS.blue);
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 2.3, w: 5.7, h: 4.45, rectRadius: 0.08, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 2.3, w: 5.7, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("FREE · NO CONTRACT · YOURS TO KEEP", { x: 0.8, y: 2.55, w: 5.2, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0 });
  slide.addText("Nexus Assess", { x: 0.8, y: 2.85, w: 5.2, h: 0.55, fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white, margin: 0 });
  slide.addText("A security and risk read of your actual environment:", { x: 0.8, y: 3.45, w: 5.2, h: 0.4, fontFace: "Arial", fontSize: 12, color: COLORS.white, margin: 0, transparency: 10, valign: "top" });
  const bullets = [
    "Internal + external vulnerability scan",
    "Dark-web credential exposure check",
    "Microsoft 365 / Google Workspace security review",
    "Prioritized roadmap — mapped to SSA/VA safeguarding",
  ];
  bullets.forEach((b, i) => {
    const y = 3.95 + i * 0.5;
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.85, y: y + 0.07, w: 0.12, h: 0.12, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
    slide.addText(b, { x: 1.1, y, w: 5.0, h: 0.44, fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 6 });
  });
  slide.addText("No obligation. Whether or not we ever work together, the roadmap is yours to act on with whoever supports you today.", { x: 0.8, y: 6.05, w: 5.25, h: 0.6, fontFace: "Arial", fontSize: 10.5, italic: true, color: COLORS.teal, valign: "top", margin: 0 });
  const phases = [
    { n: "01", t: "Today — discovery", d: "A relaxed conversation about your environment and what matters most. No commitment.", c: COLORS.orange },
    { n: "02", t: "Free Nexus Assess", d: "We scan and review, then hand you a plain-language risk roadmap mapped to your safeguarding duties.", c: COLORS.blue },
    { n: "03", t: "Right-sized proposal", d: "Managed or co-managed — only the layers you want, scoped to your real environment, nonprofit licensing applied.", c: COLORS.teal },
  ];
  phases.forEach((p, i) => {
    const y = 2.3 + i * 1.5;
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.55, y, w: 6.25, h: 1.35, rectRadius: 0.08, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.72, y: y + 0.22, w: 0.95, h: 0.9, rectRadius: 0.1, fill: { color: p.c }, line: { color: p.c, transparency: 100 } });
    slide.addText(p.n, { x: 6.72, y: y + 0.22, w: 0.95, h: 0.9, fontFace: "Arial", fontSize: 22, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
    slide.addText(p.t, { x: 7.85, y: y + 0.2, w: 4.8, h: 0.4, fontFace: "Arial", fontSize: 15, bold: true, color: COLORS.dark, margin: 0 });
    slide.addText(p.d, { x: 7.85, y: y + 0.62, w: 4.85, h: 0.65, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0 });
  });
  slide.addNotes(NOTES.engage);
}

// SLIDE 11 — CLOSING / CTA
function closingSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.blue };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.dark, transparency: 70 }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: 9.5, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 88 }, line: { color: COLORS.teal, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  addLogo(slide, 0.55, 0.4, 2.2, true);
  slide.addText("THE NEXT STEP", { x: 0.55, y: 1.05, w: 6, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0 });
  slide.addText([
    { text: "One small step. ", options: { color: COLORS.white, bold: true } },
    { text: "Nothing to sign.", options: { color: COLORS.orange, bold: true } },
  ], { x: 0.55, y: 1.35, w: 12, h: 0.7, fontFace: "Arial", fontSize: 34, margin: 0 });
  const opts = [
    { tag: "Recommended", title: "Book your free Nexus Assess", body: "We scan your environment and Microsoft 365 / Google Workspace, then hand you a prioritized risk roadmap within about 10 business days — yours to keep, no contract, no obligation.", band: COLORS.teal },
    { tag: "Happy to share", title: "Our security + AI playbook", body: "I'll walk you through the broader security and practical-AI playbook we run for ourselves and our clients, nonprofits included — useful context whether or not we work together.", band: COLORS.orange },
  ];
  opts.forEach((o, i) => {
    const x = 0.55 + i * 6.4;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.55, w: 6.1, h: 2.8, rectRadius: 0.08, fill: { color: COLORS.white, transparency: 88 }, line: { color: o.band, pt: 1 } });
    slide.addText(o.tag.toUpperCase(), { x: x + 0.25, y: 2.7, w: 5.6, h: 0.25, fontFace: "Arial", fontSize: 10, bold: true, color: o.band, charSpace: 0.5, margin: 0 });
    slide.addText(o.title, { x: x + 0.25, y: 2.95, w: 5.6, h: 0.5, fontFace: "Arial", fontSize: 18, bold: true, color: COLORS.white, margin: 0 });
    slide.addText(o.body, { x: x + 0.25, y: 3.55, w: 5.6, h: 1.7, fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 12 });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 5.7, w: 12.2, h: 0.85, rectRadius: 0.4, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText([
    { text: "Let's book your free Nexus Assess   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 10 } },
  ], { x: 0.55, y: 5.7, w: 12.2, h: 0.85, align: "center", valign: "mid", margin: 0 });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  Panchkula, India  ·  technology as a solution", { x: 0.55, y: 6.75, w: 12.2, h: 0.3, fontFace: "Arial", fontSize: 11, color: COLORS.white, align: "center", margin: 0, transparency: 35 });
  slide.addNotes(NOTES.closing);
}

// ============ MAIN ============
coverSlide();
whySlide();
verifiedSlide();
whoSlide();
proofSlide();
fitSlide();
securitySlide();
waysSlide();
discoverySlide();
engageSlide();
closingSlide();

pptx.writeFile({ fileName: outPath }).then(filename => { console.log(`  Wrote ${filename}`); });
