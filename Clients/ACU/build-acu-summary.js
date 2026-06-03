// Acuity Advisors - AI Growth & Integration Strategy - EXECUTIVE SUMMARY (hook artifact, ~6pp)
// Abridged from build-acu-report.js. Same brand tokens + helpers + diagrams. ENTRY-only pricing.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const PASS = strip(tokens.color.status.pass.$value);
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';

const LOGO_BUF = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png'));
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => fs.existsSync(path.join(DIAGRAMS_DIR, n)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, n)) : null;
const DIAGRAM_ARCH_BUF = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');
const TODAY = '2026-06-02';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ spacing: { before: s, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE) {
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 360, after: 120, line: 240 }, children: [new TextRun({ text, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 32, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiCell(number, label, color, w) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 80, right: 80 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 38, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) { const w = Math.floor(CONTENT_W / items.length); return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] }); }
function buildTable(columns, rows) {
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function diagramImage(buf, alt, widthPx = 600, ar = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / ar) }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(t) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: t, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, h = 200) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun('')] })] })] })] }); }
function makeHeader() { return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders, rows: [new TableRow({ children: [
  new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 168, height: 35 } })] })] }),
  new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
]})] })] }); }
function makeFooter() { return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
  new TextRun({ text: 'Technijian  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] }); }

const d = [];
// ---- PAGE 1 ----
d.push(
  colorBanner(CORE_BLUE),
  spacer(500),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 240, height: 50 } })] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'ACUITY ADVISORS', size: 44, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy  —  Executive Summary', size: 25, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY + '  |  Santa Ana, California  |  acuityadvisors.com', size: 19, color: BRAND_GREY, font: FONT_BODY })] }),
  colorBanner(CORE_ORANGE, 60),
  spacer(260),
  kpiRow([
    { number: '1989', label: 'Advising Since', color: CORE_BLUE },
    { number: 'West Coast', label: 'Largest ESOP Practice', color: CORE_ORANGE },
    { number: 'M&S', label: 'Backed (2024)', color: TEAL },
    { number: 'CFA·ASA', label: 'Credentialed Team', color: DARK_CHARCOAL },
  ]),
  spacer(260),
  p('Technijian already runs and secures Acuity’s environment — the managed IT, endpoint defense, and Microsoft 365 hardening a confidential advisory firm depends on. This is the next layer: turning a relationship built on trust and security into a growth engine, built inside the perimeter we already protect. For an M&A and ESOP firm, security is the precondition for using AI at all — and it is the firm’s advantage, not its limit.'),
  calloutBox('The Core Opportunity', [
    'Own the answer no one has claimed — the entire category is answer-engine-blind; the owner-education and "M&A vs. ESOP vs. family" decisions owners research first are unowned by the deal banks, and Acuity uniquely does both.',
    'Turn thirty-five years into a visible asset — a credentialed, Marshall & Stevens-backed, West-Coast-leading ESOP practice whose real proof is un-merchandised online.',
    'Build AI where it is safe — because Technijian secures the perimeter, the deal-preparation and knowledge AI lives inside it, not in a public chatbot. That confidentiality boundary is the differentiator.',
  ], CORE_ORANGE),
  pageBreak(),
);

// ---- PAGE 2 ----
d.push(
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(120),
  p('Three forces converge in Acuity’s favor: a demographic wave of owners who must transition, an ESOP tailwind that rewards the credentialed, and a moment when both owners and AI engines decide credibility online.'),
  spacer(120),
  buildTable(
    [{ label: 'Force', weight: 2.6 }, { label: 'What’s Happening', weight: 4 }, { label: 'What It Means for Acuity', weight: 3.4 }],
    [
      ['The succession wave', '~2.9M U.S. businesses owned by people 55+; ~73% plan a transition within a decade', 'Structural, rising demand — the authority owners trust wins the early conversation'],
      ['The planning gap', 'Only ~19% of boomer owners have started planning; only 20–30% of marketed businesses sell', 'Acuity sells preparedness and execution into the gap'],
      ['ESOP tailwinds', '~6,600 ESOPs, $2T+ assets; the WORK Act and 2025 legislation favor employee ownership', 'The West Coast’s largest ESOP practice is positioned for it'],
      ['Owners decide online', 'They research "ESOP," "sell my business," "valuation" first — and the category is answer-engine-blind', 'First mover owns the cited authority no deal bank has claimed'],
    ],
  ),
  spacer(160),
  calloutBox('Why Acuity Wins This', [
    'The moat is real: CFA/ASA credentials, the West Coast’s largest ESOP practice, a Marshall & Stevens platform, and a thirty-five-year track record — hard to replicate, simply uncaptured online.',
    'The foundation already exists: because Technijian secures the environment, the program compounds a relationship in place rather than starting over.',
  ], CORE_BLUE),
);
d.push(pageBreak());

// ---- PAGE 3 ----
d.push(
  ...sectionHeader('How AI Grows Acuity', CORE_BLUE),
  spacer(120),
  p('The engine runs three motions at once — get cited (own the owner-education and decision content that earns authority), win the referral and the owner (intelligence on the advisors who send deals and the owners showing signals), and run leaner and remember (secure, in-perimeter deal-prep AI and a thirty-five-year knowledge system). Every part builds on the security foundation Technijian already runs — and respects the boundary that protects the firm.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'Acuity AI Engine', 600, 1.61),
  diagramCaption('The Engine: Get Cited, Win the Referral & Owner, and Run Leaner & Remember'),
);
d.push(pageBreak());

// ---- PAGE 4 ----
d.push(
  ...sectionHeader('The Three Motions', CORE_ORANGE),
  spacer(120),
  calloutBox('1 — Get Cited', [
    'Own "what is an ESOP," "ESOP vs. selling," and "business valuation" in Google and AI answers; publish the "M&A vs. ESOP vs. family" decision content only Acuity can own; and merchandise thirty-five years of track record into searchable proof. The whole category is answer-engine-blind — first mover earns compounding, credible authority.',
  ], CORE_BLUE),
  spacer(120),
  calloutBox('2 — Win the Referral & the Owner', [
    'Map and nurture the CPAs, attorneys, and wealth advisors who send the deals — the #1 acquisition channel — and flag owners showing transition signals for the partners. Account-based and relationship-led: AI supports the introduction, it does not manufacture volume.',
  ], CORE_ORANGE),
  spacer(120),
  calloutBox('3 — Run Leaner & Remember', [
    'Secure, in-perimeter AI that speeds CIMs, teasers, proposals, and diligence, and turns thirty-five years of deals into matched precedents — raising the engagements each credentialed professional can carry.',
  ], TEAL),
  spacer(160),
  calloutBox('The Boundary Is the Differentiator', [
    'AI assists; the CFA/ASA professional signs every valuation and opinion; confidential deal data never touches public AI. A confidential firm cannot use the public-AI shortcut its peers reach for — so the firm that builds AI safely, inside its perimeter, gains an advantage that is hard to copy. Technijian already secures that perimeter.',
  ], DARK_CHARCOAL),
);
d.push(pageBreak());

// ---- PAGE 5 ----
d.push(
  ...sectionHeader('The Program', CORE_BLUE),
  spacer(120),
  p('Acuity’s managed IT and security are already in place — this adds the growth layer on top. The entry program uses real published Technijian rates and makes the firm’s authority visible; the secure deal-prep build comes later, once the entry proves the lift. No invented numbers.'),
  spacer(120),
  buildTable(
    [{ label: 'Entry Program', weight: 3 }, { label: 'What It Does', weight: 4 }, { label: 'Investment', weight: 2.4 }],
    [
      ['Managed IT + Cybersecurity', 'The secure foundation the growth program builds inside', { text: 'In place', color: PASS }],
      ['My SEO — Answer-Engine, Owner Education & Local', 'AEO + decision hub + proof scoreboard + local content (new for Acuity)', { text: '$500–$1,500/mo*', color: CORE_BLUE }],
      ['My AI Lead Gen — Referral & Account Intelligence (Starter)', 'COI intelligence + owner transition signals; relationship-led', { text: '$1,499/mo* + $2,500 setup', color: CORE_BLUE }],
      ['My AI — Readiness Workshop + Content Engine', 'Leadership alignment, the boundary, and the content engine', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'ENTRY PROGRAM', bold: true }, { text: 'Builds on the IT + security in place; new cost = My SEO + Lead Gen Starter + TBD item', bold: true }, { text: 'In place + new', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(60),
  p('* Real published Technijian list rates. Acuity’s managed IT and security are already in place and are not re-priced. My SEO is new for Acuity — published tiers run $500–$1,500/mo; My AI Lead Gen Starter is $1,499/mo plus a one-time $2,500 setup. The secure deal-prep build (CIM / teaser / proposal + diligence + the institutional-knowledge system), managed services, and the advisor are the Phase-2 expansion, scoped in discovery — no invented numbers.', { italics: true, size: 18 }),
  spacer(140),
  calloutBox('How We’ll Measure the Return', [
    'We do not lead with a multiple we cannot back. Year-1 return is modeled from real levers — authority inbound, referral activation, and revenue per professional — each tied to a number Acuity already tracks. Targets are set from those baselines in discovery, and in this market a single additional engagement can outweigh the entire program cost. Illustrative until then — no number we can’t back.',
  ], TEAL),
);
d.push(pageBreak());

// ---- PAGE 6 ----
d.push(
  ...sectionHeader('The Roadmap & Next Step', CORE_BLUE),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Acuity 90-180-270 Day Roadmap', 600, 2.30),
  diagramCaption('90 / 180 / 270-Day Roadmap: Foundation, Authority & Referral, then Scale & Remember'),
  spacer(120),
  calloutBox('Recommended Next Steps', [
    'Step 1: A 30-minute discovery call to confirm the baselines and the program scope.',
    'Step 2: Technijian returns a calibrated model and a fixed-scope Statement of Work within 5 business days.',
    'Step 3: Phase 1 kickoff — the answer-engine foundation, the decision hub, and the proof scoreboard — inside 30 days.',
  ], CORE_ORANGE),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 280, bottom: 280, left: 400, right: 400 }, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'We already secure your environment. Let’s turn it into a growth engine.', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499  |  technijian.com', size: 22, color: WHITE, font: FONT_BODY })] }),
  ] })] })] }),
);

const doc = new Document({
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [{ id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: d }],
});
const OUT = path.join(__dirname, 'Acuity-Advisors-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log(`Summary DOCX written: ${OUT}\n   Size: ${(buf.length / 1024).toFixed(1)} KB`); }).catch(e => { console.error('Build failed:', e.message); process.exit(1); });
