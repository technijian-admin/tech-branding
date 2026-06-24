// Santa Fe Christian Schools (SFC) — Managed IT, Security & AI Strategy Brief
// Technijian-branded DOCX builder. FACTS-ONLY (pre-discovery): report only verified
// facts; turn every unknown into a client question. Market/threat numbers are facts
// about the market, sourced + labeled. Authentic logo (assets/ root file).
// Lead = Rob Honma, CTO (verified). Lean in-house IT -> co-managed, not replace.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak, TableOfContents
} = require('C:/vscode/tech-branding/tech-branding/node_modules/docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const CHARTREUSE = strip(tokens.color.secondary.chartreuse.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL = strip(tokens.color.status.critical.$value);
const GREEN = '28A745';
const GOLD = 'C9922A';
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 24, 2026';
const DIAG = path.join(__dirname, 'diagrams');
const diagBuf = (n) => fs.existsSync(path.join(DIAG, n)) ? fs.readFileSync(path.join(DIAG, n)) : null;

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ keepNext: true, spacing: { before: s, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, o = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function pRuns(runs, o = {}) {
  const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true, spacing: { before: 0, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [headingPara, visual, spacer(120)];
}
function plainHeader(text, color = CORE_BLUE) {
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: 1 })] }), visual, spacer(120)];
}
function subHeader(text, color = CORE_BLUE) { return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 300, after: 130 }, children: [new TextRun({ text, size: 27, bold: true, color, font: FONT_HEAD })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, spacing: { before: 220, after: 90 }, children: [new TextRun({ text, size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }); }
const NB = 'bullets';
function bullet(text, o = {}) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...o })] }); }
function bulletRuns(runs) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) }); }
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const arr = Array.isArray(body) ? body : [body];
  const bodyParas = arr.map((b, i) => new Paragraph({ keepNext: i < arr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
    new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
  ] })] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 90, right: 90 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 42, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, o = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = o;
  const totalW = columns.reduce((s, c) => s + c.weight, 0);
  const cw = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalW)));
  cw[cw.length - 1] += CONTENT_W - cw.reduce((s, w) => s + w, 0);
  const hc = columns.map((c, i) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 110, bottom: 110, left: 130, right: 130 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 19, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dr = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const co = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    const texts = Array.isArray(co.text) ? co.text : [co.text];
    const paras = texts.map(t => new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, spacing: { before: 0, after: 30, line: 276 }, children: [new TextRun({ text: t, size: 19, color: co.color || BRAND_GREY, bold: co.bold || false, italics: co.italics || false, font: FONT_BODY })] }));
    return new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 90, bottom: 90, left: 130, right: 130 }, verticalAlign: VerticalAlign.TOP, children: paras });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cw, rows: [new TableRow({ tableHeader: true, children: hc }), ...dr] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = o; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }
function pngDims(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function diagramImage(buf, alt, widthPx = 600) { if (!buf) return new Paragraph({ children: [new TextRun('')] }); const { w, h } = pngDims(buf); return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx * h / w) }, altText: { title: alt, description: alt, name: alt } })] }); }
function caption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 220 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }

// ============================================================ COVER
const cover = [
  colorBar(CORE_BLUE, 200), spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(340),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }), spacer(220),
  centered('MANAGED IT, SECURITY', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('& AI STRATEGY BRIEF', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(150),
  centered('Santa Fe Christian Schools', { size: 48, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Solving the phone-and-firewall project on your desk — and what a partner could take off it next. Built on verified facts, with the questions that complete the picture.', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(900),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Rob Honma, Chief Technology Officer — Santa Fe Christian Schools', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · A PRE-DISCOVERY BRIEFING FOR SANTA FE CHRISTIAN SCHOOLS', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Brief'),
  p('This brief was prepared from public research, before any technical discovery call. It holds to a simple discipline:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports only verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Santa Fe Christian Schools is drawn from your own website, your technology pages, public records, and your booking note — and is cited in the Appendix. We have not assumed your server and device counts, your security tooling, or your compliance posture.' }]),
  bulletRuns([{ text: 'It turns every unknown into a question. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer needs information only your team has, we ask rather than guess. Section 11 is a short questionnaire; your answers — or a free Nexus Assess — complete the analysis and produce real, costed recommendations.' }]),
  p('Numbers describing the wider K-12 market and the school threat landscape are facts about that market — sourced and labeled — not predictions about Santa Fe Christian. Any figure specific to your school is intentionally left open until discovery.', { spaceBefore: 60, spaceAfter: 120 }),
  calloutBox('A note on honesty',
    'Technijian would rather under-claim and verify than over-claim and walk it back. Where we inferred something — for example, that "MySchoolApp" on your technology site is a Blackbaud platform — we say so and flag it for confirmation. You should expect the same discipline in every deliverable we produce for you.', TEAL),
];

// ============================================================ TOC
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', { hyperlink: true, headingStyleRange: '1-1' }),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Santa Fe Christian Schools is a K-12, Christ-centered college-preparatory school in Solana Beach, founded in 1977 and serving roughly 1,100 students on a single campus. You reached out with a specific, immediate need: help configuring 3CX V20 Update 9 — the phone system — to work cleanly through your Check Point firewall with a Twilio SIP trunk. That is the front door of this brief, and the rest follows from it.', { spaceAfter: 120 }),
  p('We make the case on two fronts, then hand the specifics back to you:', { spaceAfter: 120 }),
  kpiRow([
    { number: '1977', label: 'Founded · ~50 years serving K-12 families', color: CORE_BLUE },
    { number: '~1,100', label: 'Students, K-12, on one campus', color: CORE_ORANGE },
    { number: '82%', label: 'Of K-12 schools hit by a cyber incident, 2023–24', color: CRITICAL },
    { number: 'Jun 16', label: '3CX V20 U9 went Final — your project is brand-new', color: TEAL },
  ]),
  spacer(160),
  pRuns([{ text: 'Front one — solve today, then run and secure the school. ', bold: true, color: DARK_CHARCOAL }, { text: 'The 3CX, Check Point, and Twilio task is real and current — Update 9 reached Final release on June 16, 2026, about a week before this brief. Getting a brand-new PBX release to pass the firewall and trunk cleanly is exactly the fiddly, time-boxed work a partner who has done it before clears quickly. From there, a co-managed model keeps your team in charge while Technijian adds the help-desk overflow, 24/7 monitoring, and project muscle that a lean in-house function cannot staff alone.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — integrate AI for time and enrollment. ', bold: true, color: DARK_CHARCOAL }, { text: 'The work your staff already do — parent communications, admissions follow-up, routine documents — is exactly where schools are applying AI today, as an assistant to people rather than a replacement. The same tools help you be the school families find and choose. Every family-facing message is still reviewed by a person, and student data stays in private, governed tools.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is deliberately conservative. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented price or a guessed result in this document. The market ranges in Section 10 are labeled market-typical, not quotes. The real numbers come after a free, no-obligation Nexus Assess of your environment, or after you answer the questionnaire in Section 11 — whichever you prefer.' }], { spaceAfter: 120 }),
  calloutBox('The single idea to carry into the meeting',
    'Start with the problem on your desk. Solving the 3CX / Check Point / Twilio configuration is a small, concrete proof of how Technijian works — and the natural window into the bigger picture: a co-managed partner that runs and secures the school’s IT and helps your staff do more with the hours they have. Co-managed means we work for your team, not instead of it.', CORE_ORANGE),
];

// ============================================================ 01 WHAT WE VERIFIED
const section1 = [
  ...sectionHeader('What We Verified About Santa Fe Christian', CORE_BLUE, '01'),
  p('Everything in this section is drawn from the school’s own website and technology pages, public records, press coverage, and your booking note. Sources are listed in the Appendix.', { spaceAfter: 140 }),
  subHeader('School snapshot'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'What it is', bold: true }, 'A private, coeducational, Christ-centered college-preparatory school serving grades K-12 across four divisions (Kindergarten, Elementary, Middle, High).'],
      [{ text: 'Founded', bold: true }, '1977; became independent of Christian Unified Schools of San Diego in 1985. About five decades serving North County coastal families.'],
      [{ text: 'Enrollment', bold: true }, 'Approximately 1,075–1,125 students (sources vary by year), ~13:1 student–teacher ratio, on a single Solana Beach campus.'],
      [{ text: 'Mission', bold: true }, '"We prepare global leaders for Christ." A Christ-centered community; applications include a statement of faith and church involvement.'],
      [{ text: 'Recognition', bold: true }, 'National Blue Ribbon awards across the Elementary (2011), Middle (2015), and High (2017) schools; strong college-placement and test-score profile.'],
      [{ text: 'Accreditation', bold: true }, 'WASC, ACSI (Association of Christian Schools International), and CESA; member of ECFA (financial accountability); athletics in the CIF San Diego Section (Eagles).'],
      [{ text: 'Leadership', bold: true }, 'Rod Gilbert, Head of Schools; Kurt de Pfyffer, Chief Financial & Operations Officer; Rob Honma, Chief Technology Officer.'],
      [{ text: 'Budget context', bold: true, color: CRITICAL }, 'Tuition spans roughly $20K (K-5) to $29K (9-12); ~25% of students receive aid (>$1.5M budget). We cite no IT budget figure — it is a discovery item.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('The technology we can see from the outside'),
  p('Your public technology pages expose the core of the school’s stack. Each is a system that must be supported, secured, and kept running — and each is a natural place a partner adds value. We treat platform names as observed-and-to-confirm, not settled fact:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'System (observed)', weight: 30 }, { label: 'What it implies for IT, security & support', weight: 70 }],
    [
      [{ text: '3CX phone system', bold: true }, 'A software VoIP PBX — the subject of your booking. Telephony is mission-critical for a school (front office, attendance, emergencies); it is also the project on your desk right now.'],
      ['Google Workspace + Hapara', 'Staff and student email, files, and classroom management run on Google, with Hapara as the classroom overlay — identity, sharing controls, and student safety all live here.'],
      [{ text: 'MySchoolApp (Blackbaud, inferred)' }, 'Parent and student portal / SIS / LMS. The system of record for student data — availability, access control, and the provider’s data-handling all matter. (Platform inferred from the brand; confirm.)'],
      ['School Pass', 'Visitor management, dismissal, and perimeter safety — a system that ties physical safety to IT, and a known interest of your CTO.'],
      ['MacBooks + Chromebooks', 'A mixed Apple-and-Google device fleet for staff and students — patching, configuration, and loss/theft handling across two ecosystems.'],
      [{ text: 'Check Point firewall', bold: true }, 'An enterprise-grade firewall at the edge — capable, and the piece that sits squarely between your new phone system and the outside world (Section 2).'],
    ], { headerColor: TEAL }),
  spacer(120),
  calloutBox('What we have NOT assumed — and will confirm with you',
    ['We do not know, and have not guessed: how 3CX is hosted (on-premise or cloud) and the Check Point model and firmware; your server and endpoint counts; your backup and disaster-recovery design; your security tooling (EDR, MFA, email security); the size of the IT team beneath the CTO; whether the school takes E-rate funding; or your tuition-payment processor.',
     'These are the questions in Section 11. A free Nexus Assess answers most of them with hard data rather than conversation.'], CORE_ORANGE),
];

// ============================================================ 02 THE IMMEDIATE PROJECT (the wedge)
const section2 = [
  ...sectionHeader('The Project on Your Desk — 3CX, Check Point & Twilio', CORE_BLUE, '02'),
  p('You asked for help configuring 3CX V20 Update 9 with a Check Point firewall and Twilio. This section is the technical reality of that task — written for a CTO, not dumbed down — because the fastest way to earn a longer conversation is to be useful in the first one. None of it is a criticism of your setup; it is the shape of a job that is genuinely fiddly the first time and routine once you have done it often.', { spaceAfter: 130 }),
  subHeader('What 3CX V20 Update 9 actually changed'),
  p('Update 9 reached Final release on June 16, 2026 — roughly a week before this brief, which makes your timing a fair reason to want a second set of hands. The headline changes that matter to this job: a fully redesigned Web Client; a new lower-cost AI call-and-voicemail transcription option; and — most relevant — a new Custom Template Builder for SIP-trunk interoperability, which lets an admin switch between built-in and custom trunk templates while preserving DIDs, caller IDs, and routing. That is the lever for tuning a Twilio trunk cleanly.', { spaceAfter: 120 }),
  subHeader('Why the three pieces fight each other'),
  p('Each component is fine alone. The work is in the seams, and there are three:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Piece', weight: 22 }, { label: 'What it needs', weight: 44 }, { label: 'Where it bites', weight: 34 }],
    [
      [{ text: '3CX V20 U9', bold: true, color: CORE_BLUE }, 'Full-Cone NAT and a clean path for SIP (UDP 5060 / TCP 5060–5061), the RTP media range (UDP 9000–10999), and the tunnel (5090). Its built-in Firewall Checker validates NAT type, not just open ports.', 'A Firewall Checker that fails on NAT type even when ports look open.'],
      [{ text: 'Check Point firewall', bold: true, color: CORE_BLUE }, 'SIP inspection / ALG turned off so it stops rewriting SIP packets — but then the RTP media ports must be defined and permitted manually, with a stable 1:1 NAT for the PBX.', 'Default SIP inspection silently mangles signaling; edits are invisible to 3CX traces.'],
      [{ text: 'Twilio Elastic SIP trunk', bold: true, color: CORE_BLUE }, 'A Termination URI (outbound), an Origination URI pointed at the 3CX public FQDN (inbound), and matching authentication — both an IP access-control entry for the PBX’s public IP and a credential list mirrored into 3CX.', 'If the IP ACL or credentials drift out of sync, auth fails; any public-IP change breaks inbound.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  pRuns([{ text: 'The classic failure signatures. ', bold: true, color: DARK_CHARCOAL }, { text: 'When SIP ALG is left on or NAT is wrong, you get the textbook symptoms: registration that drops, one-way or no audio, and calls that disconnect at roughly thirty seconds. They look like a 3CX or Twilio bug; they are almost always the firewall in the middle. This exact pairing — 3CX behind a Check Point Quantum Spark gateway — is common enough that it has its own dedicated threads in Check Point’s own community.' }], { spaceAfter: 120 }),
  subHeader('How Technijian would approach it'),
  bulletRuns([{ text: 'Confirm the ground truth first. ', bold: true, color: DARK_CHARCOAL }, { text: 'The Check Point model and firmware, how and where 3CX is hosted, the public IP and FQDN, and the Twilio trunk’s current state — before changing anything.' }]),
  bulletRuns([{ text: 'Disable SIP inspection on the firewall, then define the media path explicitly. ', bold: true, color: DARK_CHARCOAL }, { text: 'Turn off the SIP ALG, set a stable NAT for the PBX, and permit SIP, the RTP range, and the tunnel deliberately rather than trusting an inspection engine to guess.' }]),
  bulletRuns([{ text: 'Bring the Twilio trunk up cleanly. ', bold: true, color: DARK_CHARCOAL }, { text: 'Termination and Origination URIs set to the right FQDN, IP ACL and credentials in sync, numbers in E.164, codecs matched — then validate with the 3CX Firewall Checker and live test calls in both directions.' }]),
  bulletRuns([{ text: 'Document it so it stays fixed. ', bold: true, color: DARK_CHARCOAL }, { text: 'A short runbook of the firewall rules, trunk settings, and the public-IP dependency, so the next firmware update or IP change does not reopen the same ticket.' }]),
  calloutBox('Why this is the right first step',
    'It is finite, it is concrete, and it is exactly the kind of work that goes faster with a team that has configured 3CX behind enterprise firewalls many times. Solve this well, and you have a real, low-risk read on how Technijian works — which is the honest basis for any larger conversation about co-managed IT, security, and the AI ideas later in this brief. We can scope it as a one-time project or fold it into the free assessment; your call.', TEAL),
];

// ============================================================ 03 COMPLIANCE LANDSCAPE
const section3 = [
  ...sectionHeader('Your Student-Data & Compliance Landscape', CORE_BLUE, '03'),
  p('A school that holds student records and takes tuition payments sits inside a web of privacy and security rules. The honest picture for a privately funded religious school is more nuanced than the headlines suggest — and getting it right is itself a service. The table separates what legally binds you from what reaches you through your apps and your insurer. Exact applicability — especially anything tied to federal funding — is a confirm-at-discovery item, not an assertion.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Regime', weight: 20 }, { label: 'What it governs', weight: 42 }, { label: 'How it reaches Santa Fe Christian', weight: 38 }],
    [
      [{ text: 'FERPA', bold: true, color: CORE_BLUE }, 'Federal privacy of student education records.', 'Generally does NOT legally bind a privately funded school (it is tied to U.S. Dept. of Education funding) — but families and ed-tech providers expect FERPA-aligned practice. Confirm funding status.'],
      [{ text: 'COPPA', bold: true, color: CORE_BLUE }, 'Federal protection for data collected online from children under 13.', 'Reaches you through the apps young students use; the school acts as the consent agent. A reason to vet what student-facing tools collect.'],
      [{ text: 'CA SOPIPA (SB 1177)', bold: true, color: CORE_BLUE }, 'Bars K-12 ed-tech providers from selling or targeting student data — public or private.', 'Binds your providers, and shapes which apps and contracts are acceptable. A lever you can use when choosing tools.'],
      [{ text: 'CIPA', bold: true, color: CORE_BLUE }, 'Federal internet-filtering and safety-policy requirement.', 'Attaches ONLY if the school takes E-rate funding. This single yes/no decides whether CIPA applies — a key discovery question.'],
      [{ text: 'PCI-DSS', bold: true, color: CORE_BLUE }, 'Payment-card data security standard.', 'Applies wherever tuition, fees, or donations are paid by card. A tokenizing processor keeps your scope small — worth confirming.'],
      [{ text: 'Cyber-insurance', bold: true, color: CORE_BLUE }, 'Underwriting requirements to bind or renew a policy.', 'In practice the firmest driver: insurers now require MFA, EDR, tested immutable backups, email security, awareness training, and a tested incident-response plan.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('The honest message most schools do not hear',
    ['You are largely exempt from the mandates that are tied to federal funding — FERPA and CIPA may simply not bind a privately funded school. But you still inherit real obligations through the ed-tech apps you use and the tuition payments you take, and your cyber-insurer will require a concrete set of controls regardless of which laws apply.',
     'So the practical security bar is set less by statute and more by your insurer and your duty to families — which is good news, because that bar is clear and buildable. We would rather tell you that than sell you a compliance scare.'], CORE_ORANGE),
];

// ============================================================ 04 THREAT LANDSCAPE
const section4 = [
  ...sectionHeader('The K-12 Threat Landscape', CORE_BLUE, '04'),
  p('The following are facts about the environment every school operates in. They are not statements about Santa Fe Christian’s defenses, which we have not assessed.', { spaceAfter: 130 }),
  kpiRow([
    { number: '82%', label: 'Of K-12 schools hit by a cyber incident, Jul 2023–Dec 2024', color: CRITICAL },
    { number: '60M+', label: 'Students exposed in the PowerSchool SIS breach', color: CORE_ORANGE },
    { number: '$464K', label: 'Average education ransom demand, 2025', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  subHeader('Why schools are targets'),
  bulletRuns([{ text: 'Children’s data is high-value and long-lived. ', bold: true, color: DARK_CHARCOAL }, { text: 'A student’s identity can be misused for years before anyone notices, which makes school records attractive and hard to remediate after a breach.' }]),
  bulletRuns([{ text: 'The biggest risk is often a provider, not your own walls. ', bold: true, color: DARK_CHARCOAL }, { text: 'In the PowerSchool breach, a single student-information-system provider exposed data on more than 60 million students and 10 million teachers, and the attacker extorted $2.85 million. The lesson is to vet and monitor the platforms that hold your data, not only the perimeter.' }]),
  bulletRuns([{ text: 'The numbers are large but not hopeless. ', bold: true, color: DARK_CHARCOAL }, { text: 'U.S. education ransomware counts dipped slightly in 2025, yet records exposed rose about 27%, and the average education ransom demand was around $464,000 — survivable only if backups and response are ready in advance.' }]),
  bulletRuns([{ text: 'Federal help thinned out in 2025. ', bold: true, color: DARK_CHARCOAL }, { text: 'Federal K-12 cybersecurity support was scaled back — the Department of Education’s education-technology office was closed and several K-12 programs discontinued — leaving schools more reliant on their own teams and partners.' }]),
  spacer(80),
  calloutBox('The honest framing',
    'We do not raise this to alarm you — your team may already manage these risks well. We raise it because the floor for "good enough" security is objectively higher for a school holding children’s data than for an ordinary small business, and because a single incident costs far more than continuous protection. The right next step is to measure your actual exposure, not to assume it.', TEAL),
];

// ============================================================ 05 CO-MANAGED MODEL
const section5 = [
  ...sectionHeader('The Co-Managed Model — Augment, Don’t Replace', CORE_BLUE, '05'),
  p('You have a capable, award-winning technology leader and, from what we can see, a lean team. That is the textbook case for co-managed IT: your in-house function keeps ownership of strategy and institutional knowledge, while an outside partner adds tooling, specialized skills, and around-the-clock coverage. The driver is not cost — it is that no small team can be expert at everything, available every hour, and free to run projects all at once.', { spaceAfter: 140 }),
  subHeader('What a lean school IT team cannot easily staff alone'),
  p('This is not a comment on capability — it is arithmetic. The items below need either 24/7 staffing, specialized tooling, or dedicated project bandwidth that a small team running daily operations cannot also provide:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Capability gap', weight: 32 }, { label: 'Why it benefits from a partner', weight: 68 }],
    [
      ['24/7 monitoring & response (MDR)', 'Attacks land after hours, over weekends, and during breaks — exactly when a school’s small team is offline. Monitoring should not clock out when the staff does.'],
      ['Help-desk overflow & coverage', 'Tier-1/2 overflow during the school day, plus coverage for evenings, sick days, and the times your team is heads-down on a project or on vacation.'],
      ['Security tooling at scale', 'EDR, email security, MFA, vulnerability scanning, and backup — bought, integrated, and tuned by specialists rather than assembled and maintained solo.'],
      ['Project muscle', 'The phone-and-firewall job, a Wi-Fi refresh, a Google Workspace hardening — extra hands for the projects that otherwise wait for summer.'],
      ['Backup & recovery you can prove', 'Immutable, tested backups of servers and cloud data with a recovery you have actually rehearsed — the difference between a bad day and a lost week.'],
      ['Strategy & a second opinion', 'A vCIO/vCISO cadence and a sounding board for a CTO who today carries the strategy, the build, and the security alone.'],
    ], { headerColor: CORE_ORANGE }),
  spacer(120),
  calloutBox('The point, said plainly',
    'Co-management augments your CTO and his team; it does not replace them. Your team keeps control of the relationship and the roadmap, gains a named Technijian pod that learns your environment, and gets a bench to call on the worst week of the year. On a normal week, you barely notice us — which is exactly how it should feel.', CORE_BLUE),
];

// ============================================================ 06 CAPABILITY MAP
const section6 = [
  ...sectionHeader('Technijian Capability Map', CORE_BLUE, '06'),
  p('Technijian is an Irvine-based IT services company founded in 2000, with a Panchkula, India delivery center for 24/7 follow-the-sun coverage. We are cybersecurity-first (CISSP-led, delivering managed detection and response via our My Jian SIEM and CrowdStrike/Huntress MDR partners) and AI-forward (we build, not just resell). One partner can do three jobs for a school: run the IT, secure it and protect students, and help staff do more with the time they have.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Technijian for Santa Fe Christian — one partner, three jobs', 624),
  caption('Figure 06.0 — Run the school’s IT (left); secure it and protect student data (centre); save staff time and help enrollment (right). Which pieces apply to you is a discovery question, not an assumption.'),
  buildTable(
    [{ label: 'Need category', weight: 30 }, { label: 'Technijian service', weight: 22 }, { label: 'What it delivers', weight: 48 }],
    [
      ['Co-managed help desk & operations', { text: 'My IT', bold: true, color: CORE_BLUE }, 'Tier-1/2 overflow, after-hours coverage, monitoring, patching, and Google Workspace / device administration alongside your team.'],
      ['Phone, network & project work', { text: 'My IT', bold: true, color: CORE_BLUE }, 'The 3CX / Check Point / Twilio job, Wi-Fi and network refreshes, and the projects that otherwise wait for summer.'],
      ['24/7 security monitoring & response', { text: 'My Security', bold: true, color: CORE_BLUE }, 'Managed detection and response, EDR, identity hardening, and incident response — the around-the-clock layer.'],
      ['Email & web safety', { text: 'My AntiSpam', bold: true, color: CORE_BLUE }, 'Managed email security at a published $4.75 per user per month, plus web/content filtering aligned to student safety.'],
      ['Backup, continuity & recovery', { text: 'My Continuity', bold: true, color: CORE_BLUE }, 'Immutable, tested backups of servers and cloud data with a recovery you have actually rehearsed.'],
      ['Compliance & ed-tech governance', { text: 'My Compliance', bold: true, color: CORE_BLUE }, 'The cyber-insurance control stack, student-data-handling reviews of your apps, and audit-ready evidence.'],
      ['Practical AI & custom builds', { text: 'My AI / My Dev', bold: true, color: CORE_BLUE }, 'Staff time-savers, parent-communication help, and admissions visibility — the efficiency front in Section 8.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('How we work — representative engagement profiles'),
  p('These are the shapes of work we deliver, anonymized and described by scope only — no client names and no cherry-picked outcome numbers:', { spaceAfter: 100 }),
  calloutBox('Profile A — A school / nonprofit with a lean IT team',
    'A mission-driven organization with one strong technology lead and little depth beneath. Scope: a 24/7 monitoring overlay and help-desk overflow so the in-house lead got nights, weekends, and project time back — while keeping full control of the roadmap.', CORE_BLUE),
  calloutBox('Profile B — A VoIP / firewall cutover',
    'An organization moving its phone system behind an enterprise firewall with a hosted SIP trunk. Scope: SIP ALG disabled, NAT and media ports defined deliberately, the trunk brought up cleanly, and a runbook left behind so the fix survived the next firmware update.', CORE_ORANGE),
  calloutBox('Profile C — Practical AI for an office team',
    'An organization buried in repetitive document and communication work. Scope: AI drafting and document-intelligence explored to cut the routine load — with a person reviewing everything that reaches a family, and sensitive data kept out of public tools.', TEAL),
  subHeader('"Won’t AI cost a fortune?" — the multi-model discipline'),
  p('A fair question whenever AI is on the table. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three providers and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume extraction and classification, mid-tier models for the bulk of drafting and reasoning, and the most capable models only for the small slice that needs deep judgment. In practice this runs roughly 60–80% below the cost of routing everything to one premium model, with no quality loss on the work that matters — and private, governed deployments mean student and family data never reaches a public tool.', { spaceAfter: 120 }),
];

// ============================================================ 07 SECURITY & SAFETY ARCHITECTURE
const section7 = [
  ...sectionHeader('Security & Safety Architecture', CORE_BLUE, '07'),
  p('A school has to cover six layers, and be able to show each is working — for its insurer, its board, and the families who trust it with their children. Any one is buildable in-house; the difficulty is running all six continuously. The table describes what each layer covers and what it maps to — a structure we would tailor to your environment after discovery, never impose before it.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Layer', weight: 24 }, { label: 'What it covers', weight: 46 }, { label: 'Maps to', weight: 30 }],
    [
      [{ text: 'Identity & access', bold: true, color: CORE_BLUE }, 'MFA on every account, conditional access, and control of admin rights across Google Workspace and your apps. Most breaches begin at a stolen sign-in.', 'Cyber-insurance, COPPA/SOPIPA'],
      [{ text: 'Endpoints & devices', bold: true, color: CORE_BLUE }, 'Threat detection on staff and student MacBooks and Chromebooks, disk encryption, and enforced patching — on campus and off.', 'Cyber-insurance'],
      [{ text: 'Email & web safety', bold: true, color: CORE_BLUE }, 'Anti-phishing, malicious-link protection, and content/DNS filtering that keeps students safer online (and supports CIPA if E-rate applies).', 'CIPA (if E-rate), cyber-insurance'],
      [{ text: 'Data, backup & ransomware', bold: true, color: CORE_BLUE }, 'Immutable, tested backups of servers and cloud data with a rehearsed recovery. The difference between an incident and a catastrophe.', 'Cyber-insurance'],
      [{ text: 'Student-data & ed-tech governance', bold: true, color: CORE_BLUE }, 'Knowing which apps hold student data, what they collect, and that their contracts are sound — produced continuously, not at audit time.', 'COPPA, SOPIPA, PCI'],
      [{ text: '24/7 monitoring & response', bold: true, color: CORE_BLUE }, 'Eyes-on-glass monitoring with a defined response — the coverage a lean school team cannot staff overnight and over breaks.', 'Cyber-insurance'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('Start where the insurer points',
    'If you want one place to begin, begin with the cyber-insurance control stack — MFA, EDR, tested backups, email security, awareness training, and a tested incident-response plan. It is concrete, it is what an underwriter will ask for at renewal, and it covers most of what a school actually needs. A free Nexus Assess measures where you stand against exactly this list.', CORE_ORANGE),
];

// ============================================================ 08 AI OPPORTUNITY
const section8 = [
  ...sectionHeader('The AI Opportunity for an Independent School', CORE_BLUE, '08'),
  p('The second front is doing more with the people you have. The work your staff already do is the same work schools everywhere are starting to give an AI assistant — drafting, summarizing, answering routine questions — always with a person reviewing anything a family sees. There are two payoffs: hours given back to your team, and more of the right families finding and choosing the school.', { spaceAfter: 140 }),
  subHeader('Give staff their time back'),
  buildTable(
    [{ label: 'Where the time goes today', weight: 32 }, { label: 'How AI helps (a person still approves)', weight: 40 }, { label: 'Technijian service', weight: 28 }],
    [
      [{ text: 'Parent & family communications', bold: true, color: DARK_CHARCOAL }, 'Draft newsletters, announcements, and answers to the same recurring questions in the school’s voice — staff review and send.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Admissions inquiry follow-up', bold: true, color: DARK_CHARCOAL }, 'Fast, personal first responses to inquiries and tour requests so no interested family waits — the moment that wins a tour.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Routine documents & forms', bold: true, color: DARK_CHARCOAL }, 'Assemble and tidy the repetitive paperwork that fills an office day, on the school’s templates.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Staff & faculty IT questions', bold: true, color: DARK_CHARCOAL }, 'A first-line assistant that answers the common "how do I…" questions, easing the load on a lean IT team.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Policies & institutional know-how', bold: true, color: DARK_CHARCOAL }, 'Make handbooks, procedures, and hard-won knowledge searchable instead of stuck in inboxes and a few people’s heads.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  subHeader('Be the school families find and choose'),
  p('Private schools compete for a finite pool of families, and that search increasingly starts online and with AI assistants. Santa Fe Christian sits in a dense, affluent market — Bishop’s, La Jolla Country Day, Francis Parker, Pacific Ridge, Cathedral Catholic, and, closest on faith, Horizon Prep. The school’s real distinction — Christ-centered, K-12, Blue Ribbon, college-prep — is a story worth being found for.', { spaceAfter: 100 }),
  bulletRuns([{ text: 'Be found in search and AI answers. ', bold: true, color: DARK_CHARCOAL }, { text: 'So that "private Christian school in North County San Diego" surfaces Santa Fe Christian, with content that answers what searching parents actually ask.' }]),
  bulletRuns([{ text: 'Turn reputation into enrollment. ', bold: true, color: DARK_CHARCOAL }, { text: 'Reviews and ratings on the directories families check (Niche, GreatSchools) are social proof; a steady, managed presence compounds.' }]),
  bulletRuns([{ text: 'Respond before the competition does. ', bold: true, color: DARK_CHARCOAL }, { text: 'The school that answers an inquiry first and warmest usually gets the tour — and the tour is where you win.' }]),
  spacer(60),
  calloutBox('How this stays honest — and safe',
    'AI here assists people; it does not replace a teacher’s or an admissions officer’s judgment, and a person reviews anything a family receives. Student and family data never goes into public AI tools — we use private, governed deployments, in line with Technijian’s security-first method (Ravi Jain is a CISSP). We will not put a dollar of "AI savings" specific to Santa Fe Christian in writing until we know your real volumes — those are questions in Section 11.', CORE_ORANGE),
];

// ============================================================ 09 UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '09'),
  p('A short, independent primer so the conversation rests on shared ground rather than hype. Each point is anchored to an independent framework, not a sales claim — your CTO will recognize the discipline.', { spaceAfter: 130 }),
  h3('What AI is — and the one distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction comes from Anthropic’s engineering guidance: ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a predefined path — predictable, low-risk, e.g. "draft this from these inputs") versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself — flexible, needs oversight). The operating principle is to use the simplest thing that works: start with simple automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer, so a person reviews anything family-facing or policy-bound before it goes out.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— student and family data never goes into public AI tools; we use private, governed deployments.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool in use is inventoried with an owner, a provider, and the data it touches, straight from the NIST "Govern" function.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Do-it-yourself tools are inexpensive but leave you to assemble, secure, and govern the system — and to own the three risks above — on top of running the school. A capable full-time AI hire costs well over $180,000 a year, is scarce, and cannot cover strategy, build, security, and governance alone. A partner provides all four at a fraction of the cost, with proven builds and CISSP-led security — which matters more, not less, when the data belongs to children.', { spaceAfter: 120 }),
];

// ============================================================ 10 MARKET CONTEXT & INVESTMENT
const section10 = [
  ...sectionHeader('Market Context & Investment Framework', CORE_BLUE, '10'),
  p('No price in this section is a quote for Santa Fe Christian. These are market-typical ranges for the separate services an organization usually buys — shown to set honest expectations and to make the consolidation argument. Your actual figure is scoped only after a free Nexus Assess, with nonprofit and education pricing applied where eligible.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Service line', weight: 36 }, { label: 'Market-typical range (2026)', weight: 36 }, { label: 'Note', weight: 28 }],
    [
      ['Co-managed IT (per user / month)', '$60–$150 co-managed; fully managed $110–$250', 'Scales with scope'],
      ['24/7 MDR', '$10–$30 / endpoint / mo; small orgs $1,500–$5,000 / mo', 'directional'],
      ['Email security', '~$3–$6 / user / mo (Technijian My AntiSpam $4.75)', 'published'],
      ['Backup (servers + cloud)', '~$3–$7 / user / mo plus server protection', 'directional'],
      ['Security-awareness training', '~$1–$5 / user / mo', 'directional'],
      ['One-time project work (e.g. 3CX/firewall)', 'scoped per project', 'fixed quote'],
      ['vCIO / vCISO advisory', '$2,000–$8,000 / mo (vs. a full-time hire many times that)', 'directional'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  pRuns([{ text: 'The consolidation argument. ', bold: true, color: DARK_CHARCOAL }, { text: 'A school usually buys these from several different providers, each with its own bill and its own gaps between them. Consolidating most of that into one co-managed relationship — one team, one bill, nonprofit pricing where it applies — is usually both simpler and more economical. The structural reason Technijian can do the same work for less is a senior U.S.-led, India-delivered model, presented as one blended rate rather than a stack of line items.' }], { spaceAfter: 120 }),
  calloutBox('How a real number gets set',
    'We quote from data, not assumptions. A free Nexus Assess inventories your environment; from there we build a fixed, per-line proposal covering only the layers you want, with education and nonprofit licensing applied where eligible. Every line is explained; nothing is hidden. The phone-and-firewall project can be scoped on its own, today.', TEAL),
];

// ============================================================ 11 QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section11 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '11'),
  p('This is the heart of the brief. Everything above is what we could verify or source; the analysis becomes real and costed only when these are answered — by your team, or by a free Nexus Assess that measures most of them directly. There are no wrong answers, and "we’re not sure" is useful information.', { spaceAfter: 130 }),
  ...qGroup('A · The phone-and-firewall project', CORE_BLUE, [
    'Is 3CX hosted on-premise or in the cloud, and what is its public IP / FQDN today?',
    'What Check Point model and firmware sits at the edge, and who manages it now?',
    'Is the Twilio trunk live, partially configured, or not yet set up — and is it for calls, parent SMS, or both?',
    'What exactly is failing today — registration, audio, inbound, outbound, or the Firewall Checker?',
  ]),
  ...qGroup('B · IT environment & infrastructure', CORE_ORANGE, [
    'How many servers (physical and virtual) do you run, and what does each do?',
    'How many staff and student devices in total, and what is the MacBook / Chromebook split?',
    'What is on-premise versus in the cloud, and is the school all-Google or partly Microsoft?',
    'How are servers and cloud data backed up today, and when was the last tested restore?',
  ]),
  ...qGroup('C · Security posture & insurance', TEAL, [
    'Is MFA enforced for all staff and admin accounts, including remote and Google admin access?',
    'What endpoint protection / EDR and email security are in place today?',
    'Do you carry cyber-insurance, and what controls did the last application or renewal require?',
    'When was your last vulnerability scan or security assessment, and who watches alerts after hours?',
  ]),
  ...qGroup('D · Compliance & student data', CHARTREUSE, [
    'Does the school take E-rate or any federal funding? (This decides whether CIPA applies.)',
    'Which system is the student record / SIS (is "MySchoolApp" Blackbaud?), and who supports it?',
    'How is tuition paid, and is the card data handled by a tokenizing processor?',
    'How do you track which ed-tech apps hold student data and what their contracts say?',
  ]),
  ...qGroup('E · Operations, AI & decision', DARK_CHARCOAL, [
    'Where does office and admin staff time go that feels the most repetitive?',
    'How are admissions inquiries handled today, and how fast do families hear back?',
    'How large is the IT team beneath the CTO, and what is your 2026 project roadmap?',
    'Who besides the CTO weighs in on a decision like this (the CFOO, the Head of Schools, the board)?',
  ]),
  spacer(80),
  calloutBox('You do not have to answer these on paper',
    'A free Nexus Assess answers most of Groups B and C with hard data — an internal and external vulnerability scan, a dark-web credential check, and a Google Workspace / Microsoft 365 security review — returned as a prioritized roadmap. The rest take a short conversation. Either path turns this brief into a costed plan.', CORE_ORANGE),
];

// ============================================================ 12 PATH FORWARD
const section12 = [
  ...sectionHeader('The Path Forward', CORE_BLUE, '12'),
  p('A staged sequence that solves today’s problem first and gives you something useful at every step:', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), 'A staged roadmap — stabilize, secure, optimize', 624),
  caption('Figure 12.0 — Solve the phone-and-firewall problem and run the free assessment first; then secure and comply; then save time and help enrollment. Sequence and targets calibrate at discovery.'),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 50 }, { label: 'Your commitment', weight: 42 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'Solve the 3CX / Check Point / Twilio project — scoped on its own, a clean first win and a real read on how we work.', 'A small, defined project. Or fold it into the free assessment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'Free Nexus Assess — internal + external vulnerability scan, dark-web credential check, and a Google Workspace / M365 security review, returned as a prioritized roadmap.', 'None. Free, and the roadmap is yours to keep.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Right-sized co-managed proposal — only the layers you want, scoped to your real environment, with education pricing where eligible.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Your no-obligation next step',
    ['Let us solve the phone-and-firewall project, and book a free Nexus Assess alongside it. We return a prioritized roadmap within about ten business days — yours to keep whether or not we ever work together. No contract, no obligation.',
     'Contact: Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is a full-spectrum IT services company founded in 2000 by Ravi Jain. For more than 25 years we have served small and mid-sized organizations — including schools and nonprofits — with managed and co-managed IT, cybersecurity, cloud, compliance, and AI-driven development. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide 24/7 coverage at no additional cost. Our approach is cybersecurity-first and AI-forward — helping organizations use technology as a competitive advantage.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery center', bold: true }, 'Panchkula IT Park, Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. what we inferred'),
  p('In the spirit of the no-assumptions method, the following were inferred from indirect evidence and should be confirmed rather than treated as settled fact:', { spaceAfter: 100 }),
  bullet('That "MySchoolApp" on your technology site is a Blackbaud Education Management platform — inferred from the brand; provider and hosting to confirm.'),
  bullet('That the IT team beneath the CTO is small — inferred from the absence of public IT job listings and named staff; confirm.'),
  bullet('The lead phone number (858-298-2360) as Rob Honma’s direct line — the school’s main line is 858-755-8900; we will confirm the best contact before any correspondence.'),
  bullet('The Check Point model/firmware, how 3CX is hosted, and the Twilio trunk’s current state — central to Section 2 and left open for discovery.'),
  bullet('All other internal environment details (server/endpoint counts, security stack, backup design, E-rate status) — deliberately left open for Section 11.'),
  subHeader('Selected sources'),
  ...[
    'Santa Fe Christian Schools — about, admissions, tuition, and technology pages: sfcs.net and edtech.sfcs.net; Wikipedia; CA Dept. of Education school directory; ECFA member profile.',
    'Rob Honma, CTO — SFC press release; Del Mar Times / San Diego Union-Tribune; Times of San Diego; Cox Business Top Tech Awards 2023; LinkedIn (/in/rhonma/).',
    '3CX V20 Update 9 — 3CX release notes and "U9 Final" blog (Final June 16, 2026); 3CX firewall-router configuration and Firewall Checker docs; 3CX Twilio SIP-trunk guide; Twilio 3CX trunking guide.',
    'Check Point + 3CX — Check Point SMB "Inspecting VoIP Traffic" admin guide and SIP wizard (sk113573); Check Point CheckMates community threads on 3CX behind Quantum Spark; SIP ALG guidance (Viirtue).',
    'Compliance — FERPA applicability to private schools (studentprivacy.ed.gov); COPPA FAQ (FTC); CIPA / E-rate (FCC, ALA); California SOPIPA SB 1177 and AB 1584 / Ed Code §49073.1 (leginfo.ca.gov); PCI-DSS (PCI SSC); cyber-insurance control requirements (Huntress, SeedPod).',
    'K-12 threat landscape — K-12 Dive and GovTech (2025 education ransomware); Comparitech education ransomware roundup; NBOA; PowerSchool SIS breach coverage; K12 SIX.',
    'Competitors / market — The Bishop’s School, La Jolla Country Day, Francis Parker, Cathedral Catholic, Pacific Ridge, Horizon Prep (company sites; privateschoolreview; niche; US News); San Diego County private-school market (privateschoolreview).',
    'AI framing — MIT Sloan (AI literacy); Anthropic ("Building Effective Agents," workflows vs. agents); NIST AI Risk Management Framework (Govern/Map/Measure/Manage).',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider market, sourced above; figures specific to Santa Fe Christian Schools are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Santa Fe Christian Schools  ·  Managed IT, Security & AI Strategy Brief', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const allChildren = [
  ...cover, ...methodNote, ...toc, ...execSummary,
  ...section1, ...section2, ...section3, ...section4, ...section5, ...section6,
  ...section7, ...section8, ...section9, ...section10, ...section11, ...section12,
  ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'Santa Fe Christian Schools — Managed IT, Security & AI Strategy Brief', description: 'A facts-only pre-discovery brief for Santa Fe Christian Schools, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'SFC-Managed-IT-Security-AI-Brief.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
