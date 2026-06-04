// Pet Care Plus - AI Growth & Integration Strategy - EXECUTIVE SUMMARY (hook artifact, ~6pp)
// Abridged from build-pcap-report.js. Same brand tokens + helpers + diagrams. ENTRY-only pricing.
// This is the PDF attached to first-touch outreach; the full plan is held for the meeting.

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
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 360, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 32, bold: true, color, font: FONT_HEAD })] })] }),
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
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
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
// ---- PAGE 1: cover band + KPIs + opening ----
d.push(
  colorBanner(CORE_BLUE),
  spacer(500),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 240, height: 50 } })] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'PET CARE PLUS', size: 46, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy  —  Executive Summary', size: 26, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY + '  |  West Loop, Chicago  |  petcp.com', size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  colorBanner(CORE_ORANGE, 60),
  spacer(260),
  kpiRow([
    { number: '1998', label: 'Same-Owner Since', color: CORE_BLUE },
    { number: '5', label: 'Services, One Resort', color: CORE_ORANGE },
    { number: '4.7', label: 'Google Star Rating', color: TEAL },
    { number: '24/7', label: 'Staffed, 365 Days', color: DARK_CHARCOAL },
  ]),
  spacer(260),
  p('Technijian already runs Pet Care Plus’ search marketing — the weekly SEO program, Google Ads across five campaigns, analytics, and call tracking. This is the next layer: turning that foundation into an AI-driven growth and retention engine for a resort with assets no Chicago rival can copy quickly — the city’s only heated saltwater pool, true 24/7 care, a real cat suite, and a single-owner reputation since 1998. The plan closes the gap with the market’s reputation leader (Tucker Pup’s) and its technology leader (Wag Hotels) on three fronts: get found, book faster, and keep & grow.'),
  calloutBox('The Core Opportunity', [
    'Turn the physical moat into a digital moat — own the local-search and AI-answer position no Chicago rival has claimed, on the pool, 24/7, and cat-boarding stories nobody else tells.',
    'Stop the booking leak — replace the 24-hour callback for new customers with instant booking and second-fast response: recovered conversion on demand the ads already pay for.',
    'Build the retention flywheel nobody else has — a membership / "Pool Club" program that turns daycare regulars into recurring revenue.',
  ], CORE_ORANGE),
  pageBreak(),
);

// ---- PAGE 2: The Opportunity (market) ----
d.push(
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(120),
  p('Pet care is one of the fastest-growing service categories in the country, and owners now choose and book a resort almost entirely online. Three forces decide who wins.'),
  spacer(120),
  buildTable(
    [{ label: 'Force', weight: 2.6 }, { label: 'What’s Happening', weight: 4 }, { label: 'What It Means for Pet Care Plus', weight: 3.4 }],
    [
      ['Booking is digital', '84% of owners say online booking matters; 89% want reminders; under-35 owners switch over slow response', 'The 24-hour callback is the biggest gap to close — instant booking is table stakes'],
      ['Reviews decide the shortlist', '88% of under-35 owners check reviews before choosing', 'Review velocity widens the lead on demand already attracted'],
      ['AI answers are the new front page', '~25% of search shifts to AI assistants by 2026; AI now names local businesses', 'First mover owns the cited answer for West Loop pet care'],
      ['Membership is the margin lever', 'Labor ~45% of revenue; resorts target 60–70% weekday occupancy to break even', 'A membership program builds recurring revenue and fills mid-week troughs'],
    ],
  ),
  spacer(160),
  calloutBox('Why Pet Care Plus Wins This', [
    'The moat is physical and real: a 28-year single-owner reputation, the only heated saltwater pool in Chicago, true 24/7 staffing, and a cat suite — hard to copy, and almost entirely unmarketed online.',
    'The foundation is already in place: Technijian runs the search marketing today, so this program compounds what is in flight rather than starting over.',
  ], CORE_BLUE),
);
d.push(pageBreak());

// ---- PAGE 3: The AI Engine ----
d.push(
  ...sectionHeader('How AI Grows Pet Care Plus', CORE_BLUE),
  spacer(120),
  p('The engine runs three motions at once — get found (own local search and AI answers, build review velocity, tell the pool and cat-boarding stories), book faster (replace the 24-hour callback with instant booking and second-fast response), and keep & grow (a membership program, a branded app, and win-back that compound the regulars). Every part builds on the search foundation Technijian already runs.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'Pet Care Plus AI Engine', 600, 1.61),
  diagramCaption('The Engine: Get Found, Book Faster, and Keep & Grow'),
);
d.push(pageBreak());

// ---- PAGE 4: The Three Motions ----
d.push(
  ...sectionHeader('The Three Motions', CORE_ORANGE),
  spacer(120),
  calloutBox('1 — Get Found', [
    'Own "dog boarding / daycare / grooming West Loop," "dog pool Chicago," and the cat-boarding queries in Google and AI answers; build automated review velocity toward the market leader; and finally tell the pool and 24/7 stories at the scale they deserve. Fix the 31/100 mobile speed that quietly costs rankings and bookings.',
  ], CORE_BLUE),
  spacer(120),
  calloutBox('2 — Book Faster', [
    'Replace the 24-hour booking callback for new customers with instant online booking and a second-fast text-back, plus an AI front desk that answers hours, availability, and vaccine rules around the clock. This converts the demand the ads already pay for — before it cools.',
  ], CORE_ORANGE),
  spacer(120),
  calloutBox('3 — Keep & Grow', [
    'Launch the membership / "Pool Club" program no independent Chicago rival offers, a branded booking-and-webcam app to match the technology leader, automated stay photos, and win-back for lapsing regulars. Turn one-time stays into recurring revenue.',
  ], TEAL),
  spacer(160),
  calloutBox('The Honest Boundary', [
    'AI augments the front desk and the care team — it does not replace the people and the dogs that are the whole point. It integrates around the booking system Pet Care Plus already uses; it extends that workflow, it does not rip and replace.',
  ], DARK_CHARCOAL),
);
d.push(pageBreak());

// ---- PAGE 5: The Program (ENTRY only) ----
d.push(
  ...sectionHeader('The Program', CORE_BLUE),
  spacer(120),
  p('Start small and build on the search foundation already running. The entry program uses real published Technijian rates and pays for itself on the booking fix and review velocity alone — with no large build to begin. The bigger build (the app and the membership platform) comes later, once the entry proves the lift.'),
  spacer(120),
  buildTable(
    [{ label: 'Entry Program', weight: 3 }, { label: 'What It Does', weight: 4 }, { label: 'Investment', weight: 2.4 }],
    [
      ['My SEO — Answer-Engine, Local & Reviews', 'Already engaged — expand the current program (AEO, review engine, technical fix, pool/cat content)', { text: 'In place', color: PASS }],
      ['My AI Lead Gen — Capture & Speed-to-Lead (Starter)', 'Second-fast text-back, AI front desk, nurture to booking — the main new entry cost', { text: '$1,499/mo* + $2,500 setup', color: CORE_BLUE }],
      ['My AI — Review Engine + AI Readiness Workshop', 'Review-velocity program + leadership alignment and roadmap', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'ENTRY PROGRAM', bold: true }, { text: 'Builds on the My SEO in place; new cost = Lead Gen Starter + TBD items', bold: true }, { text: 'In place + new', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(60),
  p('* Pet Care Plus is already engaged on My SEO, so that program is in place and this plan expands its scope. The main new entry cost is My AI Lead Gen Starter — $1,499/mo plus a one-time $2,500 setup (published). The custom build (instant booking, the branded app, and the membership / Pool Club platform), managed services, and the advisor are the Phase-2 expansion, scoped in discovery — no invented numbers.', { italics: true, size: 18 }),
  spacer(140),
  calloutBox('How We’ll Measure the Return', [
    'We do not lead with a multiple we cannot back. Year-1 return is modeled from real levers — recovered booking conversion, review-driven new demand, and membership recurring revenue — each tied to a number Pet Care Plus already tracks in its analytics and call tracking. Targets are set from those baselines in discovery. Illustrative until then — no number we can’t back.',
  ], TEAL),
);
d.push(pageBreak());

// ---- PAGE 6: Roadmap + CTA ----
d.push(
  ...sectionHeader('The Roadmap & Next Step', CORE_BLUE),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Pet Care Plus 90-180-270 Day Roadmap', 600, 2.30),
  diagramCaption('90 / 180 / 270-Day Roadmap: Foundation, Growth, then Scale & Retention'),
  spacer(120),
  calloutBox('Recommended Next Steps', [
    'Step 1: A 30-minute discovery call to confirm the baselines (most are already in your analytics and call tracking) and the program scope.',
    'Step 2: Technijian returns a calibrated model and a fixed-scope Statement of Work within 5 business days.',
    'Step 3: Phase 1 kickoff — instant booking for new leads, the review engine, and the technical fix — live inside 30 days.',
  ], CORE_ORANGE),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 280, bottom: 280, left: 400, right: 400 }, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'We already run your search marketing. Let’s turn it into a growth engine.', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499  |  technijian.com', size: 22, color: WHITE, font: FONT_BODY })] }),
  ] })] })] }),
);

const doc = new Document({
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [{ id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: d }],
});
const OUT = path.join(__dirname, 'Pet-Care-Plus-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log(`Summary DOCX written: ${OUT}\n   Size: ${(buf.length / 1024).toFixed(1)} KB`); }).catch(e => { console.error('Build failed:', e.message); process.exit(1); });
