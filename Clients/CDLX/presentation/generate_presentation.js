const path = require("path");
const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Technijian";
pptx.company = "Technijian";
pptx.subject = "Technijian for CardLogix — Two Conversations Worth Having";
pptx.title = "Technijian for CardLogix";
pptx.lang = "en-US";
pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-US" };

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

const outPath = path.resolve(__dirname, "Technijian for CardLogix - Meeting Deck.pptx");

// ============ HELPERS ============

function hLine(slide, x, y, w, color = COLORS.line, thickness = 0.012) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: thickness,
    fill: { color },
    line: { color, transparency: 100 },
  });
}

function addBrandMark(slide, x, y, darkBg = false) {
  const s = 0.09;
  const gap = 0.018;
  const palette = [
    ["64748B", "006DB6", "F67D4B", "64748B"],
    ["64748B", "1EAAC8", "64748B", "1EAAC8"],
    ["94A3AF", "006DB6", "1EAAC8", "64748B"],
  ];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + c * (s + gap),
        y: y + r * (s + gap),
        w: s, h: s, rectRadius: 0.015,
        fill: { color: palette[r][c] },
        line: { color: palette[r][c], transparency: 100 },
      });
    }
  }
  slide.addText("TECHNIJIAN", {
    x: x + 4 * (s + gap) + 0.1,
    y: y - 0.02,
    w: 1.8, h: 0.36,
    fontFace: "Arial", fontSize: 17, bold: true,
    color: darkBg ? COLORS.white : COLORS.dark,
    charSpace: 1, margin: 0, valign: "mid",
  });
}

function addFooter(slide, page) {
  hLine(slide, 0.5, 7.05, 12.35, COLORS.line, 0.012);
  slide.addText("Technijian  |  For CardLogix Corporation  |  2026-05-29", {
    x: 0.55, y: 7.1, w: 8.0, h: 0.25,
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
  addBrandMark(slide, 0.55, 0.35);
  slide.addText(eyebrow.toUpperCase(), {
    x: 0.55, y: 0.95, w: 8.0, h: 0.28,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: accent, charSpace: 0.5, margin: 0,
  });
  slide.addText(title, {
    x: 0.55, y: 1.2, w: 12.4, h: 0.55,
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

function addBulletList(slide, items, opts = {}) {
  const { x = 0.7, y = 2.3, w = 5.6, fontSize = 13,
    bulletColor = COLORS.blue, textColor = COLORS.dark, gap = 0.45 } = opts;
  items.forEach((item, index) => {
    const top = y + index * gap;
    slide.addShape(pptx.ShapeType.ellipse, {
      x, y: top + 0.08, w: 0.12, h: 0.12,
      fill: { color: bulletColor },
      line: { color: bulletColor, transparency: 100 },
    });
    slide.addText(item, {
      x: x + 0.22, y: top, w, h: 0.4,
      fontFace: "Arial", fontSize, color: textColor,
      breakLine: false, margin: 0, valign: "top",
    });
  });
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
      fontFace: "Arial", fontSize: 16, bold: true,
      color: card.titleColor || COLORS.dark, margin: 0,
    });
  }
  if (card.body) {
    const reserveBottom = card.footer ? 0.45 : 0.15;
    slide.addText(card.body, {
      x: card.x + 0.18, y: card.y + 0.86,
      w: card.w - 0.36, h: card.h - 0.86 - reserveBottom,
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

function addTableHeaders(slide, headers, colX, y, widths, fill = COLORS.blue) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colX[0], y,
    w: widths.reduce((s, n) => s + n, 0), h: 0.38, rectRadius: 0.03,
    fill: { color: fill }, line: { color: fill, transparency: 100 },
  });
  headers.forEach((header, idx) => {
    slide.addText(header, {
      x: colX[idx] + 0.08, y: y + 0.08,
      w: widths[idx] - 0.16, h: 0.22,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: COLORS.white, margin: 0,
    });
  });
}

function addTableRow(slide, cols, colX, y, widths, opts = {}) {
  slide.addShape(pptx.ShapeType.rect, {
    x: colX[0], y,
    w: widths.reduce((s, n) => s + n, 0), h: opts.h || 0.5,
    fill: { color: opts.fill || COLORS.white },
    line: { color: opts.line || COLORS.line, pt: 0.75 },
  });
  cols.forEach((text, idx) => {
    slide.addText(text, {
      x: colX[idx] + 0.08, y: y + 0.07,
      w: widths[idx] - 0.16, h: (opts.h || 0.5) - 0.14,
      fontFace: "Arial", fontSize: opts.fontSize || 10,
      color: opts.color || COLORS.slate,
      bold: idx === 0 && !!opts.firstColBold,
      valign: "mid", margin: 0,
    });
  });
}

// ============ SLIDES ============

// SLIDE 1 — COVER
function coverSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  // accent band top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.4, fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  // accent band bottom
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.1, w: 13.33, h: 0.4, fill: { color: COLORS.blue },
    line: { color: COLORS.blue, transparency: 100 },
  });
  // teal glow
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.5, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 88 },
    line: { color: COLORS.teal, transparency: 100 },
  });
  // orange glow
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: 5, w: 5, h: 5, fill: { color: COLORS.orange, transparency: 92 },
    line: { color: COLORS.orange, transparency: 100 },
  });
  addBrandMark(slide, 0.7, 0.85, true);
  // confidential badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 10.6, y: 0.95, w: 2.0, h: 0.32, rectRadius: 0.04,
    fill: { color: COLORS.dark, transparency: 30 },
    line: { color: COLORS.teal, pt: 0.75 },
  });
  slide.addText("PREPARED FOR CARDLOGIX", {
    x: 10.6, y: 0.95, w: 2.0, h: 0.32,
    fontFace: "Arial", fontSize: 8.5, bold: true, color: COLORS.teal,
    align: "center", valign: "mid", charSpace: 1, margin: 0,
  });
  // title block
  slide.addText("Technijian", {
    x: 0.7, y: 2.4, w: 12, h: 1.0,
    fontFace: "Arial", fontSize: 56, bold: true, color: COLORS.white,
    margin: 0,
  });
  slide.addText("for CardLogix", {
    x: 0.7, y: 3.35, w: 12, h: 1.0,
    fontFace: "Arial", fontSize: 56, bold: true, color: COLORS.orange,
    margin: 0,
  });
  // tagline
  slide.addText("Two conversations worth having — for your shop, and for your law-enforcement customers.", {
    x: 0.7, y: 4.55, w: 11.8, h: 0.5,
    fontFace: "Arial", fontSize: 18, color: COLORS.white, margin: 0,
    transparency: 25,
  });
  // meta line
  hLine(slide, 0.7, 5.5, 11.8, COLORS.teal, 0.018);
  slide.addText("Meeting briefing  |  Ravi Jain ↔ Nick Schooler  |  Thu 2026-05-29  |  1:00 PM PT  |  Teams", {
    x: 0.7, y: 5.65, w: 11.8, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white, margin: 0,
  });
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  technijian.com  ·  949.379.8499", {
    x: 0.7, y: 6.0, w: 11.8, h: 0.3,
    fontFace: "Arial", fontSize: 10, color: COLORS.white, margin: 0,
    transparency: 40,
  });
}

// SLIDE 2 — AGENDA
function agendaSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Agenda",
    "Two conversations worth having today",
    "We've been five minutes apart for 25 years. Let's use the time well — your shop, and your law-enforcement deals.",
    2, COLORS.blue);

  const cards = [
    { x: 0.55, y: 2.4, w: 6.0, h: 4.4, band: COLORS.blue,
      label: "Track A · Your Shop",
      title: "Co-Managed IT for CardLogix",
      body: "Your 5–6 workstations and 2 servers. Nick keeps strategic control. Technijian absorbs the toil — 24/7 monitoring, patching, after-hours coverage, M365 hardening, second pair of eyes on incidents.\n\nThe Co-Managed model is purpose-built for owner-operator IT shops that have outgrown the solo run — the help desk runs around you, not in place of you.\n\nGoal of this conversation: scope a free 30-minute IT assessment.",
      footer: "Nick decides this one." },
    { x: 6.78, y: 2.4, w: 6.0, h: 4.4, band: COLORS.orange,
      label: "Track B · LE Customers",
      title: "CJIS / MFA Partnership",
      body: "You make the credentials — Credentsys PIV, FIDO2, FRAC. Law-enforcement agencies need somebody to wrap CJIS-grade managed-IT and MSSP around the hardware so the credential lands in a CJIS-ready home.\n\nThat's the seam where Technijian fits as a channel partner — you don't lose deals to HID's tighter ecosystem because the full story now has a managed-services half.\n\nGoal of this conversation: agree whether the concept is worth a deeper look.",
      footer: "Goulet + Hope approve this one." },
  ];
  cards.forEach(c => addCard(slide, c));
}

// SLIDE 3 — SAME BUSINESS PARK / RAPPORT
function rapportSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Why us, why now",
    "Same business park. 25-year Irvine peer.",
    "We've been here as long as you have. The local managed-IT partner that doesn't outsource your help desk to a continent away.",
    3, COLORS.teal);

  // Stat cards row
  const stats = [
    { n: "1998", l: "CardLogix founded" },
    { n: "2000", l: "Technijian founded" },
    { n: "0.2 mi", l: "Distance between offices" },
    { n: "92618", l: "Same Irvine zip" },
  ];
  stats.forEach((s, i) => {
    const x = 0.55 + i * 3.06;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.4, w: 2.86, h: 1.4, rectRadius: 0.08,
      fill: { color: COLORS.dark },
      line: { color: COLORS.dark, transparency: 100 },
    });
    slide.addText(s.n, {
      x, y: 2.55, w: 2.86, h: 0.7,
      fontFace: "Arial", fontSize: 30, bold: true,
      color: COLORS.orange, align: "center", margin: 0, valign: "mid",
    });
    slide.addText(s.l.toUpperCase(), {
      x, y: 3.3, w: 2.86, h: 0.4,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: COLORS.white, align: "center", margin: 0, charSpace: 0.8,
      transparency: 40,
    });
  });

  // What that means strip
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 4.1, w: 12.25, h: 2.6, rectRadius: 0.08,
    fill: { color: COLORS.white },
    line: { color: COLORS.line, pt: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 4.1, w: 0.12, h: 2.6,
    fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText("WHAT THAT MEANS FOR THIS CONVERSATION", {
    x: 0.85, y: 4.3, w: 11.6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "Local. ", options: { bold: true, color: COLORS.dark, fontSize: 13 } },
    { text: "On-site response in minutes, not hours. No offshore handoff, no time-zone gap on an incident.\n\n", options: { color: COLORS.slate, fontSize: 13 } },
    { text: "Peer-vintage. ", options: { bold: true, color: COLORS.dark, fontSize: 13 } },
    { text: "Same Irvine-tech generation. We grew up with the same vendors, the same compliance pressure curves, the same customer expectations.\n\n", options: { color: COLORS.slate, fontSize: 13 } },
    { text: "Surprise factor: low. ", options: { bold: true, color: COLORS.dark, fontSize: 13 } },
    { text: "We know your space. CardLogix is a known commodity in identity — we don't need a discovery call to figure out what an HSPD-12 deployment looks like.", options: { color: COLORS.slate, fontSize: 13 } },
  ], {
    x: 0.85, y: 4.65, w: 11.7, h: 1.95,
    valign: "top", margin: 0,
  });
}

// SLIDE 4 — TRACK A: CO-MANAGED IT
function trackASlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Track A · Co-Managed IT",
    "For your 5–6 workstations and 2 servers",
    "You keep strategic control. We absorb the toil. The Co-Managed model is purpose-built for owner-operator shops that have outgrown the solo run.",
    4, COLORS.blue);

  // Four pillar cards
  const pillars = [
    { title: "Help desk & monitoring", body: "24/7 NOC + U.S.-based help desk. After-hours and weekend on-call escalation. ITIL ticketing with SLA reporting.", band: COLORS.blue },
    { title: "Desktops & servers", body: "Endpoint management, automated patching, hardware lifecycle, backup verification, M365 admin, performance tuning.", band: COLORS.orange },
    { title: "Network & security", body: "Firewall policy, VPN / SD-WAN, Wi-Fi optimization, segmentation, switch lifecycle, multi-site failover.", band: COLORS.teal },
    { title: "Strategic leadership", body: "vCIO reporting, technology roadmapping, IT budget modeling, vendor management, compliance posture reviews.", band: COLORS.dark },
  ];
  pillars.forEach((p, i) => {
    const x = 0.55 + (i % 2) * 6.23;
    const y = 2.3 + Math.floor(i / 2) * 2.25;
    addCard(slide, { x, y, w: 6.0, h: 2.05, band: p.band,
      label: `Pillar 0${i+1}`, title: p.title, body: p.body });
  });

  // Engagement strip at bottom
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 6.85, w: 12.25, h: 0.15,
    fill: { color: COLORS.dark },
    line: { color: COLORS.dark, transparency: 100 },
  });
}

// SLIDE 5 — TECHNIJIAN STACK
function stackSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "The Technijian Stack",
    "Five services that compose into a managed-IT + MSSP + compliance program",
    "Each works standalone. Together they're the wrap CardLogix needs for its CJIS-grade deals.",
    5, COLORS.orange);

  const services = [
    { title: "My IT", sub: "Managed & Co-Managed", body: "24/7 monitoring + help desk + vCIO. Endpoint, network, server lifecycle. Fixed-scope projects when you need them.", band: COLORS.blue },
    { title: "My Security", sub: "24/7 SOC", body: "15-min critical SLA. EDR + SIEM + email security + MFA-everywhere + conditional access. IR + forensics + Fractional CISO.", band: COLORS.orange },
    { title: "My Compliance", sub: "8 frameworks today", body: "HIPAA, SOC 2, PCI-DSS, CMMC, GDPR, NIST CSF, CIS, ISO 27001. vCCO / vCISO. Audit-prep sherpa. Evidence collection.", band: COLORS.teal },
    { title: "My Jian", sub: "Our cross-vendor SIEM", body: "Technijian-built and operated. Ingests across firewall + EDR + email + DNS + backup + M365. MITRE-tagged. Continuous compliance.", band: COLORS.chartreuse },
    { title: "My Dev / My AI", sub: "Custom & advisory", body: "Custom builds, AI Document Intelligence, knowledge graphs, agent workflows. Fractional AI Advisor on retainer.", band: COLORS.dark },
  ];
  services.forEach((s, i) => {
    const x = 0.55 + (i % 3) * 4.16;
    const y = 2.3 + Math.floor(i / 3) * 2.45;
    addCard(slide, { x, y, w: 3.95, h: 2.25, band: s.band,
      label: s.sub, title: s.title, body: s.body });
  });
}

// SLIDE 6 — MY JIAN DEEP DIVE
function jianSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  // accent
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.18,
    fill: { color: COLORS.chartreuse },
    line: { color: COLORS.chartreuse, transparency: 100 },
  });
  // teal glow
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 90 },
    line: { color: COLORS.teal, transparency: 100 },
  });
  addBrandMark(slide, 0.55, 0.35, true);

  slide.addText("DIFFERENTIATOR", {
    x: 0.55, y: 0.95, w: 6, h: 0.28,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.chartreuse, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "My Jian", options: { color: COLORS.white, bold: true } },
    { text: " — our own cross-vendor SIEM & compliance platform", options: { color: COLORS.orange, bold: true } },
  ], {
    x: 0.55, y: 1.2, w: 12.4, h: 0.6,
    fontFace: "Arial", fontSize: 26, margin: 0,
  });
  slide.addText("Built and operated by Technijian. Same platform we sell to clients runs against our own environment.", {
    x: 0.55, y: 1.85, w: 12.4, h: 0.35,
    fontFace: "Arial", fontSize: 13, color: COLORS.white, margin: 0,
    transparency: 30,
  });
  hLine(slide, 0.55, 2.3, 12.25, COLORS.teal, 0.012);

  // What it ingests
  slide.addText("WHAT IT INGESTS", {
    x: 0.55, y: 2.5, w: 6, h: 0.28,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.teal, charSpace: 0.5, margin: 0,
  });
  const sources = [
    "Sophos firewall syslog",
    "INKY email security",
    "CrowdStrike EDR",
    "Huntress EDR / MDR",
    "Meraki dashboard + syslog",
    "Veeam / NAKIVO backup",
    "Cisco Umbrella DNS",
    "vCenter / vSphere",
    "Cloudflare edge",
    "M365 × 22 workloads",
  ];
  sources.forEach((s, i) => {
    const x = 0.55 + (i % 5) * 1.34;
    const y = 2.85 + Math.floor(i / 5) * 0.55;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 1.24, h: 0.42, rectRadius: 0.05,
      fill: { color: COLORS.white, transparency: 92 },
      line: { color: COLORS.teal, transparency: 70, pt: 0.75 },
    });
    slide.addText(s, {
      x: x + 0.06, y, w: 1.12, h: 0.42,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: COLORS.white, align: "center", valign: "mid", margin: 0,
    });
  });

  hLine(slide, 0.55, 4.15, 12.25, COLORS.teal, 0.008);

  // What it produces
  slide.addText("WHAT IT PRODUCES", {
    x: 0.55, y: 4.35, w: 6, h: 0.28,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  const outputs = [
    { n: "31", l: "Continuous compliance evaluators\n(HIPAA, SOC 2, PCI, Technijian baseline)" },
    { n: "Real-time", l: "Cross-vendor SIEM correlation\n+ 7-day retrospective sweep" },
    { n: "MITRE", l: "ATT&CK tagging on every event\nfor every detection" },
    { n: "1×/mo", l: "Branded compliance DOCX report\nper environment" },
    { n: "Append-only", l: "Audit log — tamper-evident\nchain of custody" },
  ];
  outputs.forEach((o, i) => {
    const x = 0.55 + i * 2.46;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 4.7, w: 2.36, h: 1.7, rectRadius: 0.06,
      fill: { color: COLORS.white, transparency: 94 },
      line: { color: COLORS.white, transparency: 78, pt: 0.5 },
    });
    slide.addText(o.n, {
      x: x + 0.1, y: 4.85, w: 2.16, h: 0.5,
      fontFace: "Arial", fontSize: 22, bold: true,
      color: COLORS.chartreuse, align: "center", margin: 0,
    });
    slide.addText(o.l, {
      x: x + 0.1, y: 5.4, w: 2.16, h: 0.9,
      fontFace: "Arial", fontSize: 9, color: COLORS.white,
      align: "center", valign: "top", margin: 0, transparency: 22,
    });
  });

  // bottom punchline
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 6.55, w: 12.25, h: 0.6, rectRadius: 0.06,
    fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText("If a prospect asks \"show me you're compliant,\" Jian is what generates the answer — every month, automatically.", {
    x: 0.55, y: 6.55, w: 12.25, h: 0.6,
    fontFace: "Arial", fontSize: 12, bold: true, color: COLORS.white,
    align: "center", valign: "mid", margin: 0,
  });

  // footer (dark variant)
  slide.addText("Technijian  |  For CardLogix Corporation  |  2026-05-29", {
    x: 0.55, y: 7.25, w: 8.0, h: 0.25,
    fontFace: "Arial", fontSize: 9, color: COLORS.white, margin: 0,
    transparency: 50,
  });
  slide.addText("6", {
    x: 12.2, y: 7.23, w: 0.6, h: 0.25,
    fontFace: "Arial", fontSize: 10, bold: true, align: "right",
    color: COLORS.chartreuse, margin: 0,
  });
}

// SLIDE 7 — TRACK B: CJIS PARTNERSHIP CONCEPT
function trackBSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Track B · Partnership concept",
    "CardLogix hardware + Technijian managed-IT wrap, sold into CJIS",
    "A channel-style partnership where your existing PIV / FIDO2 / FRAC product portfolio drops into a CJIS-ready managed environment we operate at the agency.",
    7, COLORS.orange);

  // Three columns: You bring / We bring / Together
  const cols = [
    { title: "What CardLogix brings", band: COLORS.blue, label: "Hardware & credentials", items: [
      "Credentsys PIV (EAL 5+, FIPS 201)",
      "FIDO2 smart cards (CJIS / AAL2/3)",
      "First Responder credentials (FRAC, PIV-I)",
      "BIOSID biometric handhelds (IP67)",
      "Issuance, verification, validation software",
      "28-year US-based manufacturing credibility",
    ] },
    { title: "What Technijian brings", band: COLORS.orange, label: "Managed wrap", items: [
      "Entra ID / AD integration for the agency",
      "Card lifecycle (issue, rotate, revoke) workflows",
      "24/7 SOC + 15-minute critical SLA",
      "8-framework compliance program + CJIS (Phase 1)",
      "My Jian SIEM for continuous evidence",
      "Audit-evidence pack a state CSO can use",
    ] },
    { title: "What the joint customer gets", band: COLORS.teal, label: "End-to-end story", items: [
      "One signed CJIS Security Addendum, not two",
      "Phishing-resistant MFA satisfied day one",
      "12 other CJIS policy areas covered by the wrap",
      "Continuous evidence — not annual scramble",
      "A single accountable team across hardware + ops",
      "The full deal that HID, Identiv currently win",
    ] },
  ];
  cols.forEach((c, i) => {
    const x = 0.55 + i * 4.16;
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.3, w: 3.95, h: 4.55, rectRadius: 0.08,
      fill: { color: COLORS.white },
      line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 2.3, w: 3.95, h: 0.1,
      fill: { color: c.band },
      line: { color: c.band, transparency: 100 },
    });
    slide.addText(c.label.toUpperCase(), {
      x: x + 0.18, y: 2.5, w: 3.6, h: 0.22,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: c.band, charSpace: 0.4, margin: 0,
    });
    slide.addText(c.title, {
      x: x + 0.18, y: 2.72, w: 3.6, h: 0.4,
      fontFace: "Arial", fontSize: 15, bold: true,
      color: COLORS.dark, margin: 0,
    });
    c.items.forEach((it, idx) => {
      const ty = 3.2 + idx * 0.55;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.22, y: ty + 0.09, w: 0.1, h: 0.1,
        fill: { color: c.band },
        line: { color: c.band, transparency: 100 },
      });
      slide.addText(it, {
        x: x + 0.4, y: ty, w: 3.45, h: 0.5,
        fontFace: "Arial", fontSize: 10.5, color: COLORS.slate,
        valign: "top", margin: 0,
      });
    });
  });
}

// SLIDE 8 — CJIS TIMING + HONEST GAP
function cjisTimingSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "Why now · The honest gap",
    "CJIS phishing-resistant MFA has been mandatory since October 1, 2024",
    "And the policy keeps tightening. Two questions: what the market needs, and what Technijian can honestly say it has.",
    8, COLORS.blue);

  // Left: timeline
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 2.3, w: 6.0, h: 4.55, rectRadius: 0.08,
    fill: { color: COLORS.white },
    line: { color: COLORS.line, pt: 1 },
  });
  slide.addText("THE MARKET TIMING", {
    x: 0.75, y: 2.45, w: 5.6, h: 0.25,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.blue, charSpace: 0.5, margin: 0,
  });
  const timeline = [
    { d: "Jul 2024", t: "CJIS Security Policy 5.9.5", b: "MFA explicitly mandated for every account that touches CJI. Phishing-resistant factors required." },
    { d: "Oct 1, 2024", t: "Compliance deadline", b: "Hard deadline for all entities accessing CJI to have MFA in place. No grace period." },
    { d: "Dec 2024", t: "CJIS Security Policy 6.0", b: "Tightens password + MFA further. Aligns explicitly to NIST 800-53 Rev 5. SMS-MFA is out." },
    { d: "2026", t: "Where the market is", b: "Agencies are mid-cycle on PIV / FIDO2 rollouts. The hardware side moves; the managed-IT wrap lags." },
  ];
  timeline.forEach((t, i) => {
    const y = 2.8 + i * 1.0;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.75, y: y + 0.08, w: 0.18, h: 0.18,
      fill: { color: COLORS.orange },
      line: { color: COLORS.orange, transparency: 100 },
    });
    if (i < timeline.length - 1) {
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.83, y: y + 0.26, w: 0.02, h: 0.74,
        fill: { color: COLORS.line },
        line: { color: COLORS.line, transparency: 100 },
      });
    }
    slide.addText(t.d.toUpperCase(), {
      x: 1.0, y: y, w: 5.4, h: 0.22,
      fontFace: "Arial", fontSize: 9, bold: true,
      color: COLORS.orange, charSpace: 0.5, margin: 0,
    });
    slide.addText(t.t, {
      x: 1.0, y: y + 0.2, w: 5.4, h: 0.28,
      fontFace: "Arial", fontSize: 12, bold: true,
      color: COLORS.dark, margin: 0,
    });
    slide.addText(t.b, {
      x: 1.0, y: y + 0.5, w: 5.4, h: 0.5,
      fontFace: "Arial", fontSize: 10, color: COLORS.slate,
      valign: "top", margin: 0,
    });
  });

  // Right: honest gap callout
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.78, y: 2.3, w: 6.0, h: 4.55, rectRadius: 0.08,
    fill: { color: COLORS.dark },
    line: { color: COLORS.dark, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.78, y: 2.3, w: 0.12, h: 4.55,
    fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText("THE HONEST GAP", {
    x: 7.05, y: 2.5, w: 5.5, h: 0.25,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText("What Technijian has — and what's next.", {
    x: 7.05, y: 2.78, w: 5.5, h: 0.4,
    fontFace: "Arial", fontSize: 16, bold: true,
    color: COLORS.white, margin: 0,
  });
  slide.addText([
    { text: "What we have today.\n", options: { bold: true, color: COLORS.teal, fontSize: 11 } },
    { text: "Eight compliance frameworks running in production — HIPAA, SOC 2, PCI-DSS, CMMC, GDPR, NIST CSF, CIS, ISO 27001. The same NIST 800-53 control families CJIS 6.0 explicitly aligns to. The Lego pieces — Entra ID, Defender, conditional access, Teramind, Passportal, My Jian — are all in place.\n\n", options: { color: COLORS.white, fontSize: 11, transparency: 18 } },
    { text: "What we have NOT done.\n", options: { bold: true, color: COLORS.orange, fontSize: 11 } },
    { text: "We have not delivered a CJIS engagement before. We will not claim otherwise. CJIS is not the ninth framework in our brochure today — it would be the ninth we'd stand up.\n\n", options: { color: COLORS.white, fontSize: 11, transparency: 18 } },
    { text: "The path, if Track B becomes real.\n", options: { bold: true, color: COLORS.chartreuse, fontSize: 11 } },
    { text: "~90 days to credentialed. Bottleneck = FBI fingerprint clearance for 4–8 engineers (6–12 weeks each). In parallel: CJIS Security Addendum legal review, SOPs layered on our CMMC base, FIPS-validation evidence packs, California CSA introduction.", options: { color: COLORS.white, fontSize: 11, transparency: 18 } },
  ], {
    x: 7.05, y: 3.2, w: 5.55, h: 3.55,
    valign: "top", margin: 0,
  });
}

// SLIDE 9 — HOW WE'D ENGAGE
function howWeEngageSlide() {
  const slide = pptx.addSlide();
  addHeader(slide,
    "How we'd engage",
    "Discovery first. No pricing in the meeting. Land small, expand on signal.",
    "Both tracks follow the same low-commitment path — a small first step that earns the right to a bigger one.",
    9, COLORS.teal);

  // Phase columns
  const phases = [
    { n: "01", t: "Discovery", d: "30-minute working session. Walk the environment (Track A) or the CJIS deal flow (Track B). No quote produced here — just a shared picture.", c: COLORS.orange },
    { n: "02", t: "Free assessment", d: "Track A: 2-hour environment baseline with top-risk report. Track B: 1-page partnership concept doc tailored to forward to Sebastien.", c: COLORS.blue },
    { n: "03", t: "Scoped quote", d: "Track A: Co-Managed proposal with line-item per-endpoint pricing. Track B: joint-GTM term sheet with Phase 1 (clearance) milestones.", c: COLORS.teal },
    { n: "04", t: "Land and expand", d: "Track A: 30-day pilot ramp; expand to vCIO + projects on signal. Track B: first joint LE pursuit; expand the wrap on win.", c: COLORS.chartreuse },
  ];
  phases.forEach((p, i) => {
    const x = 0.55 + i * 3.12;
    // Number block
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2, y: 2.4, w: 0.95, h: 0.95, rectRadius: 0.1,
      fill: { color: p.c },
      line: { color: p.c, transparency: 100 },
    });
    slide.addText(p.n, {
      x: x + 0.2, y: 2.4, w: 0.95, h: 0.95,
      fontFace: "Arial", fontSize: 26, bold: true,
      color: COLORS.white, align: "center", valign: "mid", margin: 0,
    });
    // Card body
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.6, w: 2.92, h: 3.2, rectRadius: 0.08,
      fill: { color: COLORS.white },
      line: { color: COLORS.line, pt: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x, y: 3.6, w: 2.92, h: 0.06,
      fill: { color: p.c },
      line: { color: p.c, transparency: 100 },
    });
    slide.addText(p.t, {
      x: x + 0.18, y: 3.8, w: 2.56, h: 0.4,
      fontFace: "Arial", fontSize: 15, bold: true,
      color: COLORS.dark, margin: 0,
    });
    slide.addText(p.d, {
      x: x + 0.18, y: 4.3, w: 2.56, h: 2.3,
      fontFace: "Arial", fontSize: 10.5, color: COLORS.slate,
      valign: "top", margin: 0,
    });
    // Arrow between
    if (i < 3) {
      slide.addText("→", {
        x: x + 2.7, y: 2.65, w: 0.55, h: 0.55,
        fontFace: "Arial", fontSize: 28, bold: true,
        color: COLORS.line, align: "center", valign: "mid", margin: 0,
      });
    }
  });
}

// SLIDE 10 — NEXT STEPS + Q&A
function nextStepsSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.blue };
  // gradient overlay
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLORS.dark, transparency: 70 },
    line: { color: COLORS.dark, transparency: 100 },
  });
  // teal glow
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.5, y: -1, w: 5, h: 5, fill: { color: COLORS.teal, transparency: 88 },
    line: { color: COLORS.teal, transparency: 100 },
  });
  // orange band top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.18,
    fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  addBrandMark(slide, 0.55, 0.4, true);
  slide.addText("NEXT STEPS", {
    x: 0.55, y: 1.05, w: 6, h: 0.3,
    fontFace: "Arial", fontSize: 10, bold: true,
    color: COLORS.orange, charSpace: 0.5, margin: 0,
  });
  slide.addText([
    { text: "Two next steps. ", options: { color: COLORS.white, bold: true } },
    { text: "No commitment.", options: { color: COLORS.orange, bold: true } },
  ], {
    x: 0.55, y: 1.35, w: 12, h: 0.7,
    fontFace: "Arial", fontSize: 34,
    margin: 0,
  });

  // Two options
  const opts = [
    { tag: "Track A", title: "Free 30-min IT assessment", body: "We walk your environment for an hour or two, baseline what's there, surface top risks, and come back with a scoped Co-Managed option for your shop. No commitment past the assessment.", band: COLORS.teal },
    { tag: "Track B", title: "Partnership concept brief", body: "We put a 1–2 page CJIS partnership concept on paper — thesis, joint-GTM motion, the 90-day clearance path, what each side needs from the other. You forward it to Sebastien if it resonates.", band: COLORS.orange },
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
      fontFace: "Arial", fontSize: 10, bold: true,
      color: o.band, charSpace: 0.5, margin: 0,
    });
    slide.addText(o.title, {
      x: x + 0.25, y: 2.95, w: 5.6, h: 0.5,
      fontFace: "Arial", fontSize: 18, bold: true,
      color: COLORS.white, margin: 0,
    });
    slide.addText(o.body, {
      x: x + 0.25, y: 3.55, w: 5.6, h: 1.7,
      fontFace: "Arial", fontSize: 12, color: COLORS.white,
      valign: "top", margin: 0, transparency: 22,
    });
  });

  // CTA pill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85, rectRadius: 0.4,
    fill: { color: COLORS.orange },
    line: { color: COLORS.orange, transparency: 100 },
  });
  slide.addText([
    { text: "Book a 30-minute meeting   ·   ", options: { bold: true, color: COLORS.white, fontSize: 16 } },
    { text: "rjain@technijian.com   ·   949.379.8499 x201   ·   technijian.com", options: { color: COLORS.white, fontSize: 14, transparency: 12 } },
  ], {
    x: 0.55, y: 5.7, w: 12.2, h: 0.85,
    align: "center", valign: "mid", margin: 0,
  });

  // Footer
  slide.addText("18 Technology Dr. Ste 141, Irvine CA 92618  ·  Same business park as you.", {
    x: 0.55, y: 6.75, w: 12.2, h: 0.3,
    fontFace: "Arial", fontSize: 11, color: COLORS.white,
    align: "center", margin: 0, transparency: 40,
  });
}

// ============ MAIN ============

coverSlide();
agendaSlide();
rapportSlide();
trackASlide();
stackSlide();
jianSlide();
trackBSlide();
cjisTimingSlide();
howWeEngageSlide();
nextStepsSlide();

pptx.writeFile({ fileName: outPath }).then(filename => {
  console.log(`  Wrote ${filename}`);
});
