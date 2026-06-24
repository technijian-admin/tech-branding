const path = require("path");
const PptxGenJS = require("C:/vscode/tech-branding/tech-branding/Clients/CDLX/presentation/node_modules/pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for Santa Fe Christian Schools — Managed IT, Security & AI";
pptx.title = "Technijian for Santa Fe Christian Schools";
pptx.lang = "en-US";
pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-US" };

// ---- Real Technijian logo files (authentic, per brand guidance) ----
const LOGO_LIGHT = "C:/vscode/tech-branding/tech-branding/Clients/SFC/assets/Technijian Logo 2.png";          // dark text — light bg
const LOGO_DARK = "C:/vscode/tech-branding/tech-branding/Clients/SFC/assets/Technijian Logo - white text.png"; // white text — dark bg
const LOGO_AR = 4.779;

const COLORS = {
  blue: "006DB6", teal: "1EAAC8", orange: "F67D4B", chartreuse: "CBDB2D",
  dark: "1A1A2E", slate: "334155", grey: "64748B", light: "E9EEF5",
  offWhite: "F8FAFC", white: "FFFFFF", line: "D8E0EA",
  paleBlue: "EAF4FB", green: "0F766E", red: "B42318",
};

const outPath = path.resolve(__dirname, "Technijian for Santa Fe Christian Schools - First Meeting Deck.pptx");

// ============ SPEAKER NOTES (presenter-facing; not shown on slides) ============
const NOTES = {
  cover:
    "OPEN WARM and PEER-TO-PEER. You're Ravi, Founder & CEO of Technijian — Irvine-based, 25+ years, security-first, CISSP. You're meeting Rob Honma, CTO — and he is a credentialed, award-winning peer (Cox Business 'Top Tech Awards' 2023 Nonprofit winner, ITIL-certified, ~30-yr career, ran tech for a large multi-campus church and a public HS district). Treat this tech-to-tech, not as a sales call. Frame the whole meeting in one sentence: 'Let's get your 3CX project sorted first, and use it as a window into where an outside team could COMPLEMENT what you already run.' He reached out for help with a SPECIFIC, current task — lead with that, not a generic MSP pitch. VERIFY-LIVE (do NOT assert on slides): confirm ~1,100 K-12 enrollment; how 3CX is hosted (on-prem vs cloud); the Check Point model/firmware; whether Twilio is for SIP calls, parent SMS, or both; the size of his IT team; whether SFC takes E-rate (decides CIPA). CONTACT: the booking listed 858-298-2360 (likely his cell) — the school main is 858-755-8900; confirm the best email/number before any follow-up. Budget for a later commercial step runs through Kurt de Pfyffer, CFOO; Rod Gilbert is Head of Schools.",
  why:
    "Set expectations in 20 seconds: we start with your phone-and-firewall project, then a few quick stops, ending on YOUR questions and a free, no-commitment next step. Say it plainly: 'I'm not here to take over your network — you clearly run a good shop. I'm here to clear this 3CX hurdle and find the two or three places a partner takes work off your plate.' Then hand him the wheel: 'Before I talk — what's the state of the 3CX cutover right now, and what made you reach out?' Let his answer reorder the deck. The dark card is the promise: he keeps control.",
  heard:
    "Play back what we know so he sees we listened and prepared. The booking said: configuring 3CX V20 Update 9, Check Point firewall, Twilio. Confirm LIVE: is 3CX on-prem or hosted? Which Check Point model (Quantum Spark SMB is typical for a school)? Is the Twilio trunk live, half-configured, or not started — and is it for calls, parent SMS, or both? What EXACTLY is failing — registration, one-way audio, inbound, the Firewall Checker? Good probes: 'Where are you stuck right now?' / 'Did U9 change behaviour vs your prior build?' He's Google Workspace + Hapara + MacBooks/Chromebooks + MySchoolApp (likely Blackbaud) + School Pass — acknowledge the stack you can see, but ask, don't assert. Don't lecture a CTO on his own environment.",
  who:
    "Earn the right to keep talking — 20 seconds, not a history lesson. Four proof points for a fellow technologist: (1) 25+ years, we're not going anywhere; (2) the POD model — a named team that learns YOUR environment, not a stranger every ticket; (3) security-first, CISSP-led, 24/7 MDR (My Jian SIEM correlating CrowdStrike/Huntress, our analysts triaging); (4) AI-forward — we actually build, not just resell. Land the pod model and the 'we've configured 3CX behind enterprise firewalls many times' point hardest. If he's quiet, ask about his own award-winning safety/geo-fencing work — he'll light up, and it tells you what he values.",
  project:
    "THIS is the differentiator slide — it proves we understand his exact problem, not a generic pitch. Walk the three seams: (1) 3CX needs Full-Cone NAT + a clean path for SIP 5060 / RTP 9000-10999 / tunnel 5090, and its Firewall Checker validates NAT TYPE not just open ports; (2) Check Point does SIP inspection/ALG by default — it must be turned OFF, then the RTP ports defined manually, with a stable 1:1 NAT; (3) Twilio Elastic SIP needs Termination + Origination URIs pointed at the 3CX FQDN, with the IP ACL and credentials kept in sync. The classic symptoms — dropped registration, one-way audio, calls dying at ~30s — are almost always the firewall, not 3CX/Twilio. Mention U9 went Final June 16, 2026 (~a week ago) and its new Custom SIP-trunk Template Builder. Then STOP and ask him where he actually is. Offer: we can scope this as a one-time project OR fold it into the free assessment. Do NOT over-promise a fix sight-unseen — say 'this is the shape of it; we confirm your specifics first.'",
  coManaged:
    "The fear in the room for any capable CTO is 'is this guy here to make me redundant?' Kill it directly: co-managed means he stays in charge and we plug specific gaps. Walk the left column (old all-or-nothing outsourcing he's right to distrust) vs the right (co-managed). Three takeaways — lead with #1 (you keep control) and #3 (augment, not replace). Concrete for a lean school team: we take nights/weekends and breaks so he's not the only pager; we run 24/7 monitoring he can't staff solo; we bring hands for the projects that wait for summer. Say: 'On your worst week, we're the bench. On a normal week, you barely notice us — and a junior tech on your side grows working next to our engineers.'",
  ways:
    "Plant 2-3 seeds, then read which one he reacts to. Don't pitch all three equally. For a lean-team CTO the live wires are usually #1 (give me coverage and project hands) or #2 (the security/insurance stack I can't fully staff). #3 (AI for staff + admissions) is the differentiator nobody else brings — mention it lightly as 'once the basics are solid.' Frame each as a hypothesis: 'teams your size usually feel X — true for you?' Tie the security card to the cyber-insurance angle (concrete, non-political): MFA + EDR + tested backups + email security + awareness + IR plan is what an underwriter wants at renewal. Leave room for him to correct you.",
  security:
    "Walk the six layers fast; do NOT lecture a CISSP-adjacent CTO on security basics — ask which layers he already feels good about and which keep him up at night. The honest hook: 'You can build any one of these. The hard part is running all six, 24/7, over school breaks, with evidence your insurer and board will accept — that's where a partner earns its keep.' Lead the 'why' with the CYBER-INSURANCE control stack — it's concrete and avoids politics. WHY NOW (sourced, market facts — NOT claims about SFC): 82% of K-12 schools had a cyber incident (Jul'23-Dec'24); the PowerSchool SIS breach exposed 60M+ students; and federal K-12 cyber support was cut in 2025, so schools are more on their own. VERIFY-LIVE: MFA everywhere? current EDR/email security? backups tested? cyber-insurance in place and what did it require? Don't assert gaps you haven't confirmed.",
  discovery:
    "THE POINT OF THE MEETING. Put the deck down and let him talk — aim for him doing most of the talking. Questions ordered easy->strategic; skip any he already answered. Must-learns: (a) the real state of the 3CX/Check Point/Twilio project and what's failing, (b) environment shape (servers/endpoints, on-prem vs cloud, all-Google?), (c) security + insurance posture, (d) the SIS (is MySchoolApp Blackbaud?) and E-rate status (decides CIPA), (e) team size + 2026 roadmap, (f) decision chain (CFOO Kurt de Pfyffer? Head of Schools Rod Gilbert? board?). End on 'what would make this worth your time today.' Never ask what you should already know — signals you didn't prepare.",
  engage:
    "Lower the stakes to near zero. Two easy yeses: (1) let us help close out the 3CX project — scoped on its own; (2) the free Nexus Assess — internal + external vulnerability scan, dark-web credential check, and a Google Workspace / M365 security review, handed back as a prioritized roadmap that's his to keep whether or not we ever work together. It gives him a real artifact for his CFOO and board, and gives us the data to scope a right-sized co-managed proposal. Reassure: 'This isn't a sales trap — it's a read of your environment you can act on with your own team.' If he asks price: verbal range only; the fixed number comes after the assessment. NEVER discuss our cost basis or staffing model.",
  closing:
    "Close on ONE concrete next thing: get the 3CX project scoped and book the free Nexus Assess, roadmap back within ~10 business days. Pair it with the risk-reversal out loud — free, no contract, no obligation, the roadmap is yours to keep. Broaden slightly so you're a peer strategist, not a one-deal pitch: '...and I'm happy to share the broader security + AI playbook we run for ourselves and our other clients, including the school-specific pieces.' Confirm the best email/number (the booking line may be his cell; school main is 858-755-8900), propose a specific time this week, and send a short recap email TODAY with the booking link and your signature. End warm, zero pressure.",
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
  slide.addText("Technijian  |  For Santa Fe Christian Schools  |  June 24, 2026", {
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
  if (subtitle) {
    slide.addText(subtitle, { x: 0.55, y: 1.7, w: 12.4, h: 0.35, fontFace: "Arial", fontSize: 11, color: COLORS.slate, margin: 0 });
  }
  hLine(slide, 0.55, 2.05, 12.25, COLORS.line, 0.01);
  addFooter(slide, page);
}
function addCard(slide, card) {
  slide.addShape(pptx.ShapeType.roundRect, { x: card.x, y: card.y, w: card.w, h: card.h, rectRadius: 0.08, fill: { color: card.fill || COLORS.white }, line: { color: card.line || card.fill || COLORS.line, pt: 1 } });
  if (card.band) {
    slide.addShape(pptx.ShapeType.rect, { x: card.x, y: card.y, w: card.w, h: 0.1, fill: { color: card.band }, line: { color: card.band, transparency: 100 } });
  }
  if (card.label) {
    slide.addText(card.label.toUpperCase(), { x: card.x + 0.18, y: card.y + 0.2, w: card.w - 0.36, h: 0.22, fontFace: "Arial", fontSize: 9, bold: true, color: card.labelColor || card.band || COLORS.blue, charSpace: 0.4, margin: 0 });
  }
  if (card.title) {
    slide.addText(card.title, { x: card.x + 0.18, y: card.y + 0.44, w: card.w - 0.36, h: 0.42, fontFace: "Arial", fontSize: card.titleSize || 16, bold: true, color: card.titleColor || COLORS.dark, margin: 0 });
  }
  if (card.body) {
    const reserveBottom = card.footer ? 0.45 : 0.15;
    slide.addText(card.body, { x: card.x + 0.18, y: card.y + (card.bodyY || 0.86), w: card.w - 0.36, h: card.h - (card.bodyY || 0.86) - reserveBottom, fontFace: "Arial", fontSize: card.bodySize || 10.5, color: card.bodyColor || COLORS.slate, valign: "top", margin: 0, breakLine: false });
  }
  if (card.footer) {
    slide.addText(card.footer, { x: card.x + 0.18, y: card.y + card.h - 0.38, w: card.w - 0.36, h: 0.28, fontFace: "Arial", fontSize: 9, bold: true, italic: true, color: card.band || COLORS.blue, margin: 0 });
  }
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
  slide.addShape(pptx.ShapeType.roundRect, { x: 9.7, y: 0.95, w: 2.9, h: 0.32, rectRadius: 0.04, fill: { color: COLORS.dark, transparency: 30 }, line: { color: COLORS.teal, pt: 0.75 } });
  slide.addText("PREPARED FOR SANTA FE CHRISTIAN", { x: 9.7, y: 0.95, w: 2.9, h: 0.32, fontFace: "Arial", fontSize: 8, bold: true, color: COLORS.teal, align: "center", valign: "mid", charSpace: 0.5, margin: 0 });
  slide.addText("Technijian", { x: 0.7, y: 2.2, w: 12, h: 0.95, fontFace: "Arial", fontSize: 52, bold: true, color: COLORS.white, margin: 0 });
  slide.addText("for Santa Fe Christian Schools", { x: 0.7, y: 3.15, w: 12.2, h: 0.7, fontFace: "Arial", fontSize: 29, bold: true, color: COLORS.orange, margin: 0 });
  slide.addText("Let's solve the phone-and-firewall project — then look at what a partner takes off your plate next.", { x: 0.7, y: 4.05, w: 11.9, h: 0.5, fontFace: "Arial", fontSize: 16, color: COLORS.white, margin: 0, transparency: 12 });
  hLine(slide, 0.7, 5.05, 11.9, COLORS.teal, 0.018);
  slide.addText("First meeting  |  Ravi Jain, Founder & CEO  ↔  Rob Honma, Chief Technology Officer  |  Solana Beach, CA", { x: 0.7, y: 5.2, w: 12.0, h: 0.3, fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0 });
  slide.addText("K-12 Christian school  ·  ~1,100 students  ·  3CX V20 + Check Point + Twilio  ·  Google Workspace  ·  lean in-house IT", { x: 0.7, y: 5.58, w: 12.0, h: 0.3, fontFace: "Arial", fontSize: 11, bold: true, color: COLORS.teal, margin: 0 });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  technijian.com  ·  949.379.8499  ·  technology as a solution", { x: 0.7, y: 5.95, w: 11.9, h: 0.3, fontFace: "Arial", fontSize: 10, color: COLORS.white, margin: 0, transparency: 40 });
  slide.addNotes(NOTES.cover);
}

// SLIDE 2 — WHY WE'RE HERE / AGENDA
function whySlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Why we're here", "Start with your project — then the bigger picture",
    "You reached out to get 3CX V20 working cleanly through your Check Point firewall with Twilio. Let's solve that first, then see where a partner fits.", 2, COLORS.blue);

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 2.35, w: 4.0, h: 4.5, rectRadius: 0.08, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 2.35, w: 4.0, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("OUR PROMISE TODAY", { x: 0.78, y: 2.65, w: 3.6, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0 });
  slide.addText("We're not here to take over your network. We're here to clear the 3CX hurdle, and find the two or three places an outside team genuinely takes work off your plate — and to leave you with something useful either way.", { x: 0.78, y: 3.05, w: 3.5, h: 1.9, fontFace: "Arial", fontSize: 13, color: COLORS.white, valign: "top", margin: 0, transparency: 6 });
  slide.addText([
    { text: "You keep control.\n", options: { bold: true, color: COLORS.teal, fontSize: 12 } },
    { text: "We fill the gaps a lean in-house team can't staff around the clock.", options: { color: COLORS.white, fontSize: 12, transparency: 12 } },
  ], { x: 0.78, y: 5.55, w: 3.5, h: 1.1, valign: "top", margin: 0 });

  const items = [
    { t: "The project on your desk", d: "3CX V20 Update 9 + Check Point + Twilio — what it takes to get clean." },
    { t: "What we heard from you", d: "Your environment, said back — so you can correct anything." },
    { t: "Who Technijian is", d: "25+ years, security-first, a dedicated team model — in 20 seconds." },
    { t: "Where a partner actually helps", d: "Co-managed: augment your team, don't replace it." },
    { t: "Security & student data for a school", d: "What an insurer, a board, and families expect a partner to shoulder." },
    { t: "Your questions + a free next step", d: "The heart of the meeting — and a read of your environment to keep." },
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

// SLIDE 3 — WHAT WE HEARD
function heardSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "What we heard", "Your environment, said back to you",
    "From your booking note and your public technology pages. If we got anything wrong, now's the time to fix it — this is your meeting.", 3, COLORS.teal);

  const stats = [
    { n: "3CX V20", l: "Phone system · the project" },
    { n: "Check Point", l: "Firewall at the edge" },
    { n: "Twilio", l: "SIP trunk / messaging" },
    { n: "Google", l: "Workspace · Hapara · Macs" },
  ];
  stats.forEach((s, i) => {
    const x = 0.55 + i * 3.06;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.35, w: 2.86, h: 1.35, rectRadius: 0.08, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
    slide.addText(s.n, { x, y: 2.46, w: 2.86, h: 0.62, fontFace: "Arial", fontSize: 22, bold: true, color: COLORS.orange, align: "center", margin: 0, valign: "mid" });
    slide.addText(s.l.toUpperCase(), { x: x + 0.1, y: 3.12, w: 2.66, h: 0.5, fontFace: "Arial", fontSize: 9, bold: true, color: COLORS.white, align: "center", margin: 0, charSpace: 0.3, transparency: 20, valign: "top" });
  });

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 3.95, w: 12.25, h: 2.8, rectRadius: 0.08, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 3.95, w: 0.12, h: 2.8, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
  slide.addText("WHAT THAT TELLS US", { x: 0.85, y: 4.15, w: 11.6, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.teal, charSpace: 0.5, margin: 0 });
  slide.addText([
    { text: "You run a real, modern shop. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Google Workspace with Hapara, a mixed Mac and Chromebook fleet, a Blackbaud-style portal, and an enterprise Check Point firewall — this is a thoughtfully built environment, led by a CTO who's been recognized for it. You don't need someone to take the wheel; you need depth and coverage on top.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "The 3CX cutover is a real, current task. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Update 9 went Final about a week ago, and getting a brand-new PBX release clean through Check Point and Twilio is genuinely fiddly the first time — a fair reason to want a second set of hands.\n\n", options: { color: COLORS.slate, fontSize: 12.5 } },
    { text: "A school carries a higher security floor. ", options: { bold: true, color: COLORS.dark, fontSize: 12.5 } },
    { text: "Children's data, tuition payments, and a cyber-insurer's checklist set a bar that's a lot for a lean team to hold alone, every hour of every day.", options: { color: COLORS.slate, fontSize: 12.5 } },
  ], { x: 0.85, y: 4.5, w: 11.7, h: 2.1, valign: "top", margin: 0 });
  slide.addNotes(NOTES.heard);
}

// SLIDE 4 — WHO TECHNIJIAN IS
function whoSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Who we are", "Technijian, in 20 seconds",
    "Enough to know we're a serious, local, security-first partner — then back to you.", 4, COLORS.blue);

  const cards = [
    { label: "Since 2000", title: "25+ years, still here", band: COLORS.blue, body: "An Irvine-based IT firm founded in 2000, with a Panchkula, India delivery center for true follow-the-sun coverage. We're built for the long relationship, not the quick flip." },
    { label: "The pod model", title: "A team that knows you", band: COLORS.orange, body: "You get a dedicated pod — a named team that learns your environment — not a different stranger on every ticket. It's the single thing clients tell us they were missing before." },
    { label: "Security-first", title: "Built in, not bolted on", band: COLORS.teal, body: "CISSP-led, delivering 24/7 managed detection & response — our My Jian SIEM correlating across CrowdStrike / Huntress MDR, with our analysts triaging. Security is how we run everything." },
    { label: "We've done this", title: "3CX behind enterprise firewalls", band: COLORS.chartreuse, body: "We configure VoIP behind enterprise firewalls regularly, and we build practical AI and custom software — so the conversation can go beyond keeping the lights on." },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 2) * 6.23;
    const y = 2.3 + Math.floor(i / 2) * 2.2;
    addCard(slide, { x, y, w: 6.0, h: 2.0, band: c.band, label: c.label, title: c.title, body: c.body, titleSize: 16, bodySize: 11.5, bodyY: 0.78 });
  });
  slide.addNotes(NOTES.who);
}

// SLIDE 5 — THE PROJECT ON YOUR DESK (the wedge)
function projectSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "The project on your desk", "3CX V20 · Check Point · Twilio — why the seams fight",
    "Each piece is fine alone. The work is where they meet — and it's the same pattern every time, which is exactly why it goes faster with a team that's done it often.", 5, COLORS.orange);

  const cols = [
    { title: "3CX V20 Update 9", sub: "(Final June 16, 2026)", band: COLORS.blue, items: [
      "Needs Full-Cone NAT — not just open ports",
      "SIP 5060 · RTP 9000–10999 · tunnel 5090",
      "Firewall Checker validates NAT type",
      "New Custom SIP-trunk Template Builder",
    ] },
    { title: "Check Point firewall", sub: "(the piece in the middle)", band: COLORS.orange, items: [
      "SIP inspection / ALG ON by default",
      "Must turn ALG OFF — it mangles SIP",
      "Then define RTP ports manually",
      "Stable 1:1 NAT for the PBX",
    ] },
    { title: "Twilio Elastic SIP", sub: "(the trunk)", band: COLORS.teal, items: [
      "Termination + Origination URIs",
      "Pointed at the 3CX public FQDN",
      "IP ACL + credentials kept in sync",
      "Numbers in E.164; codecs matched",
    ] },
  ];
  cols.forEach((c, i) => {
    const x = 0.55 + i * 4.16;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.3, w: 3.95, h: 3.2, rectRadius: 0.08, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.rect, { x, y: 2.3, w: 3.95, h: 0.1, fill: { color: c.band }, line: { color: c.band, transparency: 100 } });
    slide.addText(c.title, { x: x + 0.2, y: 2.5, w: 3.6, h: 0.4, fontFace: "Arial", fontSize: 15, bold: true, color: COLORS.dark, margin: 0, valign: "top" });
    slide.addText(c.sub, { x: x + 0.2, y: 2.88, w: 3.6, h: 0.3, fontFace: "Arial", fontSize: 10, italic: true, color: c.band, margin: 0, valign: "top" });
    c.items.forEach((it, idx) => {
      const ty = 3.32 + idx * 0.5;
      slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.22, y: ty + 0.06, w: 0.1, h: 0.1, fill: { color: c.band }, line: { color: c.band, transparency: 100 } });
      slide.addText(it, { x: x + 0.4, y: ty, w: 3.4, h: 0.45, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0 });
    });
  });
  // bottom bar — the failure signatures + approach
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 5.65, w: 12.25, h: 1.2, rectRadius: 0.06, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addText("THE TELL", { x: 0.78, y: 5.78, w: 11.7, h: 0.25, fontFace: "Arial", fontSize: 9, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0 });
  slide.addText([
    { text: "Dropped registration, one-way audio, or calls dying at ~30 seconds ", options: { bold: true, color: COLORS.white, fontSize: 12 } },
    { text: "look like a 3CX or Twilio bug — but they're almost always the firewall in the middle. Our approach: confirm the ground truth, turn off SIP inspection and define the media path deliberately, bring the Twilio trunk up clean, validate with the Firewall Checker and live calls — then leave a runbook so the next update doesn't reopen the ticket.", options: { color: COLORS.white, fontSize: 12, transparency: 10 } },
  ], { x: 0.78, y: 6.04, w: 11.8, h: 0.75, valign: "top", margin: 0 });
  slide.addNotes(NOTES.project);
}

// SLIDE 6 — THE CO-MANAGED MODEL
function coManagedSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "The core idea", "Co-managed means we work for you, not instead of you",
    "The old pitch was all-or-nothing: hand us your network and step aside. That's not this. Co-management keeps you in charge and plugs specific gaps.", 6, COLORS.blue);

  const cols = [
    { title: "All-or-nothing outsourcing", sub: "(the model you're right to distrust)", band: COLORS.grey, items: [
      "Replace the in-house team", "Tickets go to rotating strangers", "You lose visibility and control", "Your CTO gets sidelined", "One rigid bundle, take it or leave it",
    ] },
    { title: "Co-managed with Technijian", sub: "(augment what you run)", band: COLORS.blue, items: [
      "Your team stays in charge", "A named pod that learns your stack", "We cover the gaps you choose", "Your team is force-multiplied + mentored", "Pick the layers you actually need",
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
    { n: "1", t: "You keep control", d: "Your team owns the relationship and the roadmap. We never make changes you didn't approve, and you see everything we do.", c: COLORS.blue },
    { n: "2", t: "We cover what one team can't", d: "24/7 monitoring, after-hours and break coverage, surge bandwidth for projects, PTO cover — what a lean team simply can't staff alone.", c: COLORS.teal },
    { n: "3", t: "Augment, not replace", d: "On your worst week we're the bench you call. On a normal week, you barely notice us — and your team grows alongside ours.", c: COLORS.orange },
  ];
  takeaways.forEach((tk, i) => {
    const y = 2.3 + i * 1.52;
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.78, y, w: 6.02, h: 1.38, rectRadius: 0.08, fill: { color: COLORS.offWhite }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 6.95, y: y + 0.2, w: 0.75, h: 0.75, rectRadius: 0.1, fill: { color: tk.c }, line: { color: tk.c, transparency: 100 } });
    slide.addText(tk.n, { x: 6.95, y: y + 0.2, w: 0.75, h: 0.75, fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
    slide.addText(tk.t, { x: 7.85, y: y + 0.18, w: 4.8, h: 0.32, fontFace: "Arial", fontSize: 14, bold: true, color: COLORS.dark, margin: 0 });
    slide.addText(tk.d, { x: 7.85, y: y + 0.5, w: 4.85, h: 0.8, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "top", margin: 0 });
  });
  slide.addNotes(NOTES.coManaged);
}

// SLIDE 7 — A FEW WAYS WE COULD HELP
function waysSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "A few ways we could help", "Three places a partner usually earns its keep",
    "Not a menu to buy today — hypotheses to react to. Tell us which of these is real for you, and which isn't.", 7, COLORS.blue);

  const services = [
    { title: "Co-Managed IT & Project Hands", sub: "Take work off the plate", body: "The 3CX / firewall job today; then help-desk overflow, after-hours and break coverage, patching and monitoring, and the projects that wait for summer. Your team sets the priorities; we add the hands.", band: COLORS.blue, foot: "You set the priorities; we add the hands." },
    { title: "Security, Student Data & Insurance", sub: "Cover what you can't watch", body: "24/7 MDR, EDR on every device, email and web safety, MFA and backups — plus the cyber-insurance control stack and student-data reviews of your apps. The coverage and evidence one team can't sustain alone.", band: COLORS.orange, foot: "Built to the checklist your insurer hands you." },
    { title: "Practical AI for Staff & Admissions", sub: "Do more with the hours you have", body: "AI that drafts parent communications, speeds admissions follow-up, and tidies routine documents — a person reviews everything a family sees. The layer most providers don't bring.", band: COLORS.teal, foot: "Time back, and more of the right families." },
  ];
  services.forEach((s, i) => {
    const x = 0.55 + i * 4.16;
    addCard(slide, { x, y: 2.3, w: 3.95, h: 3.75, band: s.band, label: s.sub, title: s.title, body: s.body, footer: s.foot, titleSize: 15, bodySize: 11, bodyY: 0.92 });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 6.25, w: 12.25, h: 0.62, rectRadius: 0.06, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addText("Most teams your size feel one of these the most. Today's job is finding out which — then going deep there.", { x: 0.55, y: 6.25, w: 12.25, h: 0.62, fontFace: "Arial", fontSize: 12.5, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
  slide.addNotes(NOTES.ways);
}

// SLIDE 8 — SECURITY & SAFETY FOR A SCHOOL
function securitySlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Security & student safety", "Six layers a school has to cover",
    "You could build any one of these. The hard part is running all six, 24/7, with evidence your insurer and board will accept. Which keep you up at night?", 8, COLORS.teal);

  const layers = [
    { title: "Identity & access", band: COLORS.blue, body: "MFA on every account, conditional access, and admin-rights control across Google Workspace and your apps. Most breaches start at a stolen sign-in." },
    { title: "Endpoints & devices", band: COLORS.orange, body: "Threat detection on staff and student Macs and Chromebooks, disk encryption, and enforced patching — on campus and off." },
    { title: "Email & web safety", band: COLORS.teal, body: "Anti-phishing, malicious-link protection, and content filtering that keeps students safer online (and supports CIPA if E-rate applies)." },
    { title: "Backup & ransomware", band: COLORS.chartreuse, body: "Immutable, tested backups of servers and cloud data with a rehearsed recovery. The difference between an incident and a catastrophe." },
    { title: "Student data & apps", band: COLORS.green, body: "Knowing which apps hold student data, what they collect, and that their contracts are sound — COPPA, SOPIPA, and PCI for tuition." },
    { title: "24/7 monitoring & response", band: COLORS.dark, body: "Eyes-on-glass with a defined response — the around-the-clock coverage a lean school team can't staff over nights and breaks." },
  ];
  layers.forEach((l, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.3 + Math.floor(i / 3) * 2.3;
    addCard(slide, { x, y, w: 3.95, h: 2.1, band: l.band, label: `Layer 0${i + 1}`, title: l.title, body: l.body, titleSize: 15, bodySize: 10.5 });
  });
  slide.addNotes(NOTES.security);
}

// SLIDE 9 — DISCOVERY QUESTIONS
function discoverySlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "Your turn", "The questions that actually shape a fit",
    "This is the part that matters most. The more candid you are here, the more useful our free assessment and any proposal will be.", 9, COLORS.orange);

  const qs = [
    "Where are you stuck on the 3CX cutover right now — registration, audio, inbound, or the Firewall Checker?",
    "Is 3CX on-prem or hosted, what Check Point model is at the edge, and is Twilio for calls, parent SMS, or both?",
    "Walk me through the environment — servers, endpoints, and what's on-prem versus in Google / the cloud?",
    "On security: is MFA everywhere, what's your EDR and email security, and are backups tested?",
    "Do you carry cyber-insurance — and what controls did the last application or renewal ask for?",
    "Does the school take E-rate or federal funding, and which system is the student record (is MySchoolApp Blackbaud)?",
    "How big is the team beneath you, and what projects are on your 2026 roadmap you'd love bandwidth for?",
    "Besides you, who weighs in on a decision like this — the CFOO, the Head of Schools, the board?",
  ];
  qs.forEach((q, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 6.23;
    const y = 2.35 + row * 1.12;
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 6.0, h: 1.0, rectRadius: 0.06, fill: { color: COLORS.white }, line: { color: COLORS.line, pt: 1 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.16, y: y + 0.2, w: 0.6, h: 0.6, rectRadius: 0.08, fill: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal }, line: { color: i % 2 === 0 ? COLORS.blue : COLORS.teal, transparency: 100 } });
    slide.addText(`${i + 1}`, { x: x + 0.16, y: y + 0.2, w: 0.6, h: 0.6, fontFace: "Arial", fontSize: 18, bold: true, color: COLORS.white, align: "center", valign: "mid", margin: 0 });
    slide.addText(q, { x: x + 0.9, y: y + 0.1, w: 4.95, h: 0.82, fontFace: "Arial", fontSize: 10.5, color: COLORS.slate, valign: "mid", margin: 0 });
  });
  slide.addNotes(NOTES.discovery);
}

// SLIDE 10 — A FREE FIRST STEP
function engageSlide() {
  const slide = pptx.addSlide();
  addHeader(slide, "A free first step", "Two easy yeses — and a read of your environment to keep",
    "Before anyone talks contracts, we give you something useful: the project closed out, and a clear picture of where you stand.", 10, COLORS.blue);

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 2.3, w: 5.7, h: 4.45, rectRadius: 0.08, fill: { color: COLORS.dark }, line: { color: COLORS.dark, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 2.3, w: 5.7, h: 0.1, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText("FREE · NO CONTRACT · YOURS TO KEEP", { x: 0.8, y: 2.55, w: 5.2, h: 0.3, fontFace: "Arial", fontSize: 10, bold: true, color: COLORS.orange, charSpace: 0.5, margin: 0 });
  slide.addText("Nexus Assess", { x: 0.8, y: 2.85, w: 5.2, h: 0.55, fontFace: "Arial", fontSize: 26, bold: true, color: COLORS.white, margin: 0 });
  slide.addText("A security and risk read of your actual environment:", { x: 0.8, y: 3.45, w: 5.2, h: 0.4, fontFace: "Arial", fontSize: 12, color: COLORS.white, margin: 0, transparency: 10, valign: "top" });
  const bullets = ["Internal + external vulnerability scan", "Dark-web credential exposure check", "Google Workspace / Microsoft 365 review", "Prioritized roadmap — yours to keep"];
  bullets.forEach((b, i) => {
    const y = 3.95 + i * 0.5;
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.85, y: y + 0.07, w: 0.12, h: 0.12, fill: { color: COLORS.teal }, line: { color: COLORS.teal, transparency: 100 } });
    slide.addText(b, { x: 1.1, y, w: 5.0, h: 0.44, fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 6 });
  });
  slide.addText("No obligation. Whether or not we ever work together, the roadmap is yours to act on with your own team.", { x: 0.8, y: 6.05, w: 5.25, h: 0.6, fontFace: "Arial", fontSize: 10.5, italic: true, color: COLORS.teal, valign: "top", margin: 0 });

  const phases = [
    { n: "01", t: "Close out the 3CX project", d: "We help get the phone-and-firewall cutover clean — scoped on its own, a real read on how we work.", c: COLORS.orange },
    { n: "02", t: "Free Nexus Assess", d: "We scan and review, then hand you a plain-language, prioritized risk roadmap.", c: COLORS.blue },
    { n: "03", t: "Right-sized co-managed proposal", d: "Only the layers you want, scoped to your real environment, education pricing where eligible.", c: COLORS.teal },
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
    { text: "Two small steps. ", options: { color: COLORS.white, bold: true } },
    { text: "Nothing to sign.", options: { color: COLORS.orange, bold: true } },
  ], { x: 0.55, y: 1.35, w: 12, h: 0.7, fontFace: "Arial", fontSize: 34, margin: 0 });

  const opts = [
    { tag: "Recommended", title: "Close the 3CX project + free Nexus Assess", body: "We help finish the phone-and-firewall cutover and scan your environment, then hand you a prioritized roadmap within about 10 business days — yours to keep, no contract, no obligation.", band: COLORS.teal },
    { tag: "Happy to share", title: "Our school security + AI playbook", body: "I'll walk you through the broader security and practical-AI playbook we run for ourselves and our clients — useful context whether or not we work together.", band: COLORS.orange },
  ];
  opts.forEach((o, i) => {
    const x = 0.55 + i * 6.4;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.55, w: 6.1, h: 2.8, rectRadius: 0.08, fill: { color: COLORS.white, transparency: 88 }, line: { color: o.band, pt: 1 } });
    slide.addText(o.tag.toUpperCase(), { x: x + 0.25, y: 2.7, w: 5.6, h: 0.25, fontFace: "Arial", fontSize: 10, bold: true, color: o.band, charSpace: 0.5, margin: 0 });
    slide.addText(o.title, { x: x + 0.25, y: 2.95, w: 5.6, h: 0.5, fontFace: "Arial", fontSize: 17, bold: true, color: COLORS.white, margin: 0 });
    slide.addText(o.body, { x: x + 0.25, y: 3.6, w: 5.6, h: 1.65, fontFace: "Arial", fontSize: 12, color: COLORS.white, valign: "top", margin: 0, transparency: 12 });
  });

  slide.addShape(pptx.ShapeType.roundRect, { x: 0.55, y: 5.7, w: 12.2, h: 0.85, rectRadius: 0.4, fill: { color: COLORS.orange }, line: { color: COLORS.orange, transparency: 100 } });
  slide.addText([
    { text: "Let's start with your 3CX project   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 10 } },
  ], { x: 0.55, y: 5.7, w: 12.2, h: 0.85, align: "center", valign: "mid", margin: 0 });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  Panchkula, India  ·  technology as a solution", { x: 0.55, y: 6.75, w: 12.2, h: 0.3, fontFace: "Arial", fontSize: 11, color: COLORS.white, align: "center", margin: 0, transparency: 35 });
  slide.addNotes(NOTES.closing);
}

// ============ MAIN ============
coverSlide();
whySlide();
heardSlide();
whoSlide();
projectSlide();
coManagedSlide();
waysSlide();
securitySlide();
discoverySlide();
engageSlide();
closingSlide();

pptx.writeFile({ fileName: outPath }).then(filename => { console.log(`  Wrote ${filename}`); });
