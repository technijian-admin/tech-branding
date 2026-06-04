// Pet Care Plus (petcp.com) - AI Growth & Integration Strategy
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/CBI/build-cbi-report.js. Framed as a warm EXPANSION of an
// existing My SEO + Google Ads relationship. Demand-gen GTM. AUTHENTIC logo (Technijian Logo 2.png).
// Pricing: real published rates + "TBD - based on discovery" (per feedback_no_invented_pricing).

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ---------- Brand constants ----------
const tokens = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'
));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE     = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE   = strip(tokens.color.primary.orange.$value);
const TEAL          = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';
const PURPLE        = '7B2D8B';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

// AUTHENTIC logo (NOT the AI-fake set in assets/logos/png/technijian-logo-*).
const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-02';
const CLIENT = 'Pet Care Plus';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) { return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}

function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })] });
}

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })] });
}

function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}

function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}

function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}

function personaCard(name, color, fields) {
  const headerRow = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 120, bottom: 120, left: 200, right: 200 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })] })] });
  const fieldRows = fields.map(([label, value], i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], rows: [headerRow, ...fieldRows] });
}

// kind = 'built' (delivered case study) | 'service' (productized service we offer)
function capabilityBox(title, built, applies, kind = 'built') {
  const leadLabel = kind === 'service' ? 'The Technijian Service: ' : 'What Technijian Built: ';
  const leadColor = kind === 'service' ? TEAL : CORE_BLUE;
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: leadColor, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: leadLabel, size: 20, bold: true, color: leadColor, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Pet Care Plus: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ] }),
    ]})],
  });
}

function diagramImage(buf, altTitle, widthPx = 600, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) }, altText: { title: altTitle, description: altTitle, name: altTitle } })] });
}
function diagramCaption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}

// ---------- Header / Footer ----------
function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 168, height: 35 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ] })] });
}

// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 264, height: 55 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'PET CARE PLUS', size: 54, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Award-Winning Pet Resort  —  West Loop, Chicago', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Chicago, Illinois  |  petcp.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for Pet Care Plus', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }), pageBreak());

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1998', label: 'Same-Owner Since', color: CORE_BLUE },
    { number: '5', label: 'Services, One Resort', color: CORE_ORANGE },
    { number: '4.7', label: 'Google Star Rating', color: TEAL },
    { number: '24/7', label: 'Staffed, 365 Days', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Technijian already runs Pet Care Plus’ search marketing — the weekly SEO program, Google Ads across five campaigns, analytics, and call tracking. This strategy is the next layer on top of work that is already moving: turning that foundation into an AI-driven growth and retention engine. Pet Care Plus has spent twenty-eight years building the kind of pet resort competitors cannot copy quickly — Chicago’s only in-ground heated saltwater pool, genuine round-the-clock staffing, a real cat-boarding suite, and a single-owner reputation since 1998. The opportunity is that none of those advantages is fully working online yet.'),
  p('Pet owners now choose a resort the way they choose a restaurant: a quick search, the reviews, and how easy it is to book. Today the market is led on reputation by Tucker Pup’s — four blocks away, with roughly a thousand more Google reviews — and on technology by Wag Hotels and its booking-and-webcam app. Pet Care Plus sits in the middle on both, despite owning the better physical experience. The plan closes that gap on three fronts: get found (answer-engine and local search, review velocity, the pool and cat-boarding stories nobody else tells), book faster (replace the 24-hour booking callback with instant booking and second-fast lead response), and keep and grow (a membership program and a branded app that no independent Chicago rival offers).'),
  p('Because Technijian already runs the search foundation, this program compounds what is in flight rather than starting over — and every play is built to be measured against Pet Care Plus’ own analytics and call-tracking baselines.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Turn the physical moat into a digital moat: the saltwater pool, true 24/7 care, and cat boarding are genuinely hard to copy and almost entirely unmarketed online — first mover owns the AI-answer and local-search position no Chicago rival has claimed.',
      'Stop the booking leak: new customers currently fill a form and wait for a 24-hour callback, while the industry standard — and the under-35 owners who switch on slow response — expect instant booking. This is recovered conversion on demand the ads already pay for.',
      'Build the retention flywheel nobody else has: a membership / "Pool Club" program tied to the unique pool and the daycare regulars turns one-time stays into recurring revenue — the single clearest white space in the Chicago market.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Pet Care Plus’ internal numbers (monthly new customers, booking-conversion rate, average lifetime value, occupancy, and membership-eligible regulars) were not part of this draft. Every projection below is labeled estimated, and pricing shows real published rates where they exist and "to be determined in discovery" everywhere else. A short discovery call — the questions are in Section 14 — replaces estimates with real baselines.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW PET CARE PLUS WINS & KEEPS CUSTOMERS ----------
docChildren.push(
  ...sectionHeader('How Pet Care Plus Wins & Keeps Customers', CORE_BLUE, '02'),
  spacer(100),
  p('A growth plan starts with how the business actually grows. Pet Care Plus is a local, demand-driven business: a pet owner in the West Loop or the wider city searches for boarding, daycare, grooming, or cat care, checks the reviews, and books. The same owner — once their dog loves the place — comes back weekly for daycare, every few weeks for grooming, and every trip for boarding. So there are two engines: acquisition (be found and chosen by new owners) and retention (make the regulars stick and spend more). Both run across five services, and both are anchored by assets no nearby rival has.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How Pet Care Plus Wins & Keeps Customers', 600, 1.73),
  diagramCaption('Figure 2.0 — New owners find Pet Care Plus through search and reviews; happy regulars rebook across five services and refer the next owner'),
  spacer(120),
  subHeader('Two Engines, One Resort'),
  bullet('Acquisition (be chosen): a new owner finds Pet Care Plus through Google, the map pack, AI answers, and reviews — then books boarding, daycare, grooming, cat boarding, or training.'),
  bullet('Retention (keep them): the daycare regular, the grooming loyalist, and the repeat boarder are the profit base — recurring visits, higher lifetime value, and word-of-mouth that feeds acquisition back.'),
  spacer(120),
  calloutBox(
    'Why the Model Rewards AI',
    [
      'Acquisition is decided online before anyone calls: owners check reviews and pick the resort that shows up first with proof. Whoever owns the search and answer-engine result — and has the review volume to back it — wins the booking.',
      'Retention is a recurring-revenue problem: the daycare regular who comes twice a week is worth far more than a single boarding stay, and a membership program turns that loyalty into predictable monthly revenue. No Chicago independent runs one.',
      'And the repetitive work in the middle — answering "do you have space this weekend," booking, sending stay photos, asking for the review — is exactly what AI handles, freeing the front desk for the dogs and the people.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE GROWTH EQUATION ----------
docChildren.push(
  ...sectionHeader('The Growth Equation', TEAL, '03'),
  spacer(100),
  p('Pet Care Plus grows three ways, and each is gated by something specific and fixable. This is the spine the rest of the plan hangs on.'),
  spacer(140),
  buildTable(
    [ { label: 'Growth Lever', weight: 2.4 }, { label: 'What Gates It Today', weight: 4 }, { label: 'The AI Play', weight: 3.6 } ],
    [
      ['Get found by new owners', 'A mobile site scoring 31/100 on speed and 1,140 technical warnings; the pool, cat boarding, and 24/7 stories barely told; no answer-engine presence', 'Answer-engine + local SEO, a technical and PageSpeed fix, and content built around the assets rivals lack'],
      ['Book the demand you already pay for', 'New customers fill a form and wait up to 24 hours for a callback; ads drive calls into a slow funnel', 'Instant online booking, second-fast text-back, and an AI front desk that answers and books around the clock'],
      ['Keep and grow the regulars', 'No membership, no loyalty program, no branded app; review volume a third of the market leader’s', 'A membership / Pool Club program, a branded booking-and-webcam app, and an automated review engine'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why Pet Care Plus Is Positioned to Win This',
    [
      'The cheapest gains are the most certain: the booking fix, the review engine, and the pool and cat-boarding content are low-cost moves with fast, measurable payoff on demand that already exists.',
      'The moat is real and physical: a 28-year single-owner reputation, the only heated saltwater pool in Chicago, true 24/7 staffing, and a real cat suite are hard for a chain or a startup to match — they just need to be made findable and bookable.',
      'The search foundation is already in place: Technijian runs the SEO, ads, analytics, and call tracking today, so the program plugs into a stack we already manage rather than starting from zero.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE MARKET & WHERE IT'S GOING ----------
docChildren.push(
  ...sectionHeader('The Market & Where It’s Going', CORE_BLUE, '04'),
  spacer(100),
  p('Pet care is one of the fastest-growing service categories in the country, and the way owners choose and book has moved decisively online. Two realities shape the plan: premium pet care is growing, and the winners are the resorts that are easiest to find, trust, and book.'),
  spacer(140),
  subHeader('Market Forces (2025–2026)'),
  buildTable(
    [ { label: 'Force', weight: 2.6 }, { label: 'What’s Happening', weight: 4 }, { label: 'Implication for Pet Care Plus', weight: 3.4 } ],
    [
      ['Pets are family, and spend is premium', 'About 90% of owners consider pets family; pet boarding, daycare, and grooming is a ~$15B U.S. market growing every year', 'Premium positioning works — the pool, the suites, the 24/7 care are exactly what owners now pay up for'],
      ['Booking is decided digitally', '84% of owners say online booking matters; 89% want digital reminders; 85% want post-stay updates', 'The 24-hour callback is the biggest gap to close — instant booking is now table stakes'],
      ['Reviews decide the shortlist', '88% of under-35 owners check reviews; 48% will switch providers in a year, often over slow communication', 'Review volume and fast response are how the booking is won or lost — both are fixable'],
      ['AI answers are the new front page', 'Gartner projects ~25% of search shifts to AI assistants by 2026; AI answers now name specific local businesses', 'First mover to be the cited answer for West Loop pet care owns a position no rival has claimed'],
      ['Membership is the margin lever', 'Labor is ~45% of revenue; facilities target 60–70% weekday occupancy to break even; recurring revenue smooths it', 'A membership / Pool Club program fills mid-week troughs and builds predictable revenue'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Market’s Verdict',
    [
      'The resort that is most findable and most trusted online wins the new owner — a position Pet Care Plus can take in the West Loop with focused, mostly low-cost work.',
      'The resort that is easiest to book — instantly, on a phone, at 9pm — converts the demand everyone else lets cool for 24 hours.',
      'And the resort that turns loyal regulars into members earns the recurring revenue that makes the whole operation steadier. All three point the same way: make a genuinely premium operation work online as well as it works in person.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('The next dollar comes from a few clear pools. Some are new demand to capture; the largest may be the demand Pet Care Plus already attracts but does not convert or keep. The program serves all of them.'),
  spacer(120),
  buildTable(
    [ { label: 'Growth Pool', weight: 2.6 }, { label: 'Who / What', weight: 3.2 }, { label: 'How Pet Care Plus Captures It', weight: 4 } ],
    [
      ['Searchable local demand', 'Owners searching "dog boarding West Loop," "doggy daycare Chicago," "dog grooming near me," "dog pool Chicago"', 'Answer-engine + local SEO, a fast mobile site, and content on the pool, cat boarding, and 24/7 care'],
      ['Recovered conversion', 'Callers and form-fills the ads already generate who cool off during the 24-hour callback', 'Instant booking + second-fast text-back + an AI front desk — convert demand already paid for'],
      ['Daycare & grooming regulars', 'The repeat customers who drive most lifetime value', 'A membership / Pool Club program, win-back automation, and cross-sell into grooming and training'],
      ['The cat owner', 'An underserved niche — most rivals are dog-only', 'A dedicated cat-boarding page and campaign for "Kitty Wonderland" — claim a lane no one markets'],
      ['The new puppy parent', 'The highest-lifetime-value customer — training plus daycare plus grooming for years', 'Capture at the first-puppy moment (training / first groom) and nurture across services'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Capture What You Already Attract',
    [
      'The searchable pools are demand that exists today — owners are searching for Chicago pet care right now; the job is to be found, trusted, and instantly bookable.',
      'The retention pools are the quiet majority of the value: a daycare regular or a new puppy parent is worth many single boarding stays, and almost no Chicago competitor has a membership program to lock them in.',
      'The two reinforce each other: more reviews and better content win new owners, and a better booking-and-membership experience keeps them — each makes the other stronger.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE PET CARE PLUS CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The Pet Care Plus Customer', CORE_ORANGE, '06'),
  spacer(100),
  p('Pet Care Plus serves five kinds of customer across its services. The cards below profile each, and the matrix places them by visit frequency and lifetime value — which is where the program should aim its retention spend.'),
  spacer(160),

  personaCard('1 — The Daycare Regular', CORE_ORANGE, [
    ['Role', 'A dual-income household whose dog comes one to four days a week — the recurring-revenue backbone.'],
    ['Pain Points', 'Wants reliable availability, easy rebooking, and to know the dog is safe and happy all day.'],
    ['Decision Driver', 'Convenience, trust, a dog that loves it — and a reason to commit (membership, package, app).'],
    ['AI Opportunity', 'A membership / Pool Club program and a branded app lock in the routine; win-back automation catches a lapse.'],
    ['Technijian Hook', 'My Dev — membership program + booking app. My AI — win-back automation.'],
  ]),
  spacer(160),
  personaCard('2 — The New Puppy Parent', PASS, [
    ['Role', 'A first-time or new-puppy owner entering through training, daycare socialization, or a first groom — the highest lifetime value.'],
    ['Pain Points', 'Overwhelmed and anxious; wants guidance, socialization, and a trusted place as the puppy grows.'],
    ['Decision Driver', 'Expertise and reassurance (AKC S.T.A.R. Puppy, named groomers) and an easy first booking.'],
    ['AI Opportunity', 'Capture at the puppy moment and nurture across training, daycare, and grooming for years.'],
    ['Technijian Hook', 'My AI Lead Gen — capture & nurture. My AI — cross-sell journeys.'],
  ]),
  spacer(160),
  personaCard('3 — The Grooming Loyalist', TEAL, [
    ['Role', 'A customer who returns every few weeks to a named groomer — Miriam, Gina, or the team.'],
    ['Pain Points', 'Wants a consistent result and their preferred groomer; dislikes scheduling friction.'],
    ['Decision Driver', 'Trust in a specific groomer and easy rebooking — the relationship is the product.'],
    ['AI Opportunity', 'Online rebooking with groomer preference, automated reminders, and a review ask after every visit.'],
    ['Technijian Hook', 'My Dev — booking with groomer preference. My SEO — review engine.'],
  ]),
  spacer(160),
  personaCard('4 — The Traveling Boarder', CORE_BLUE, [
    ['Role', 'An owner who boards during trips and holidays — episodic, but high per-stay and peak-driven.'],
    ['Pain Points', 'Wants peace of mind while away — safety, updates, and a webcam to check in.'],
    ['Decision Driver', 'Trust, the activity packages (including pool time), and proof the dog is well cared for.'],
    ['AI Opportunity', 'Automated stay photos ("Photo Pup-Dates"), a branded webcam app, and holiday-demand booking.'],
    ['Technijian Hook', 'My Dev — webcam/report-card app. My AI — photo-update automation.'],
  ]),
  spacer(160),
  subHeader('The Underserved Niche'),
  personaCard('5 — The Cat Owner', PURPLE, [
    ['Role', 'An owner who needs cat boarding — a market most Chicago dog facilities ignore.'],
    ['Pain Points', 'Few quality cat-boarding options; wants a calm, clean, cat-specific space.'],
    ['Decision Driver', 'A dedicated cat suite ("Kitty Wonderland"), cleanliness, and clear proof of care.'],
    ['AI Opportunity', 'A cat-boarding landing page and search campaign claim a lane no competitor markets.'],
    ['Technijian Hook', 'My SEO — cat-boarding content + local search. My Dev — cat-boarding booking.'],
  ]),
  spacer(200),
  p('Figure 6.0 places each by visit frequency and lifetime value — the anchor regulars and the high-lifetime puppy parent in the upper band deserve the most retention investment; the episodic boarder and the cat owner are valuable, targeted opportunities.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Pet Care Plus Customer Matrix', 580, 1.50),
  diagramCaption('Figure 6.0 — Customer Matrix: Visit Frequency vs. Spend / Lifetime Value'),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('The Chicago premium pet market has a clear reputation leader and a clear technology leader — and a wide-open middle. Tucker Pup’s, four blocks away in the West Loop, leads on reviews with roughly a thousand of them and a dynamic-pricing booking engine. Wag Hotels, half a mile away, leads on technology with a full booking-and-webcam app. Pet Care Plus cannot out-scale a national chain, but it owns a better physical experience than either — and the territory neither has claimed is exactly where its assets are strongest.'),
  spacer(140),
  buildTable(
    [ { label: 'Competitor', weight: 2.1 }, { label: 'Where / What', weight: 3 }, { label: 'Posture vs. Pet Care Plus', weight: 4.1 } ],
    [
      ['Tucker Pup’s Pet Resort', 'West Loop — ~4 blocks away', 'The reputation leader — ~1,050 Google reviews, dynamic-pricing booking, auto-loyalty; the bar for trust and booking UX'],
      ['Wag Hotels (West Loop)', 'National chain, ~0.5 mi away', 'The technology leader — full app with booking, virtual report cards, and a webcam; beatable on local feel and the pool'],
      ['Found Chicago', 'Albany Park', 'Nonprofit rescue + vet + training halo (~520 reviews); mission-driven, not a pool-and-resort experience'],
      ['Urban Pooch', 'Ravenswood', 'Cage-free + retail hybrid (~378 reviews); strong reviews, no signature physical asset'],
      ['K9 University', 'East Garfield Park', 'Full price transparency and a shuttle; accepts reactive dogs; training-led'],
      ['PUPS Pet Club', 'Seven Chicago clubs', 'The only real membership in market ($299/yr tier with webcam + rewards) — the model to learn from and beat on assets'],
      ['Chicago Canine Academy', 'Belmont Cragin', 'Veteran-owned, training-led, 24/7 monitoring; not a daycare-experience or pool competitor'],
    ],
  ),
  spacer(200),
  subHeader('Reputation & Digital-Maturity Scorecard'),
  p('Reduced to what decides who gets the booking — review volume, booking experience, and a membership — the picture is clear, and it shows the move available to a resort with the best physical assets in the field.'),
  buildTable(
    [ { label: 'Player', weight: 2.4 }, { label: 'Reviews', weight: 1.7, align: AlignmentType.CENTER }, { label: 'Booking', weight: 1.9, align: AlignmentType.CENTER }, { label: 'Membership', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Verdict', weight: 2.4 } ],
    [
      ['Tucker Pup’s', { text: '~1,050', color: PASS, align: AlignmentType.CENTER }, { text: 'Dynamic', color: PASS, align: AlignmentType.CENTER }, { text: 'Loyalty', align: AlignmentType.CENTER }, 'Reputation leader'],
      ['Wag Hotels', { text: 'Chain', align: AlignmentType.CENTER }, { text: 'Full app', color: PASS, align: AlignmentType.CENTER }, { text: 'No', align: AlignmentType.CENTER }, 'Technology leader'],
      ['PUPS Pet Club', { text: 'Mixed', align: AlignmentType.CENTER }, { text: 'Online', align: AlignmentType.CENTER }, { text: '$299/yr', color: PASS, align: AlignmentType.CENTER }, 'Only membership in market'],
      ['Found / Urban Pooch', { text: '~378–520', color: PASS, align: AlignmentType.CENTER }, { text: 'Forms', align: AlignmentType.CENTER }, { text: 'No', align: AlignmentType.CENTER }, 'Strong reviews, no resort asset'],
      [{ text: 'Pet Care Plus (today)', bold: true }, { text: '~282', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: '24-hr callback', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Best assets, untapped digitally', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field. Pet Care Plus sits in the local/emerging corner on digital signals — but it holds physical assets (the pool, true 24/7, cat boarding) none of the leaders have. The realistic move is straight up: review velocity, instant booking, and a membership, with the unique assets as the story.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. Digital & AI Maturity', 580, 1.50),
  diagramCaption('Figure 7.0 — Competitive Positioning: Scale / Reach vs. Digital & AI Maturity'),
  spacer(160),
  calloutBox(
    'Where Pet Care Plus Wins',
    [
      'On reviews and booking, the leaders are ahead on volume and software — both of which Pet Care Plus can close quickly with a review engine and instant booking, on demand it already attracts.',
      'On the physical experience, Pet Care Plus is ahead and no software can replicate it: the only heated saltwater pool in Chicago, genuine 24/7 staffing, a real cat suite, and 28 years of single-owner trust.',
      'The white space is the membership and the AI-answer position — neither the reputation leader nor the tech leader owns a true local membership or the cited-answer result, and Pet Care Plus’ assets are tailor-made for both.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For a 28-year, award-winning resort, the online experience under-represents the operation — and a few fixes are unusually high-return because owners decide and book largely online.'),
  spacer(140),
  buildTable(
    [ { label: 'Digital Asset', weight: 2.6 }, { label: 'Current State', weight: 3.2 }, { label: 'Gap / Opportunity', weight: 4.2 } ],
    [
      ['Online booking', 'New customers submit a form and wait up to 24 hours for a callback; the Gingr portal serves only returning daycare/grooming clients', 'The single biggest conversion leak — add instant booking for new leads and second-fast response'],
      ['Mobile site speed', 'PageSpeed 31/100 on mobile; 1,140 technical warnings', 'A slow site loses rankings and bookings — a technical and speed fix lifts both'],
      ['Webcam experience', 'A raw camera-system login (a DVR portal), not a branded app', 'A branded booking-and-webcam app matches what the technology leader markets around'],
      ['Review volume', '~282 Google reviews; a strong 4.7 rating to protect and compound', 'The market leader has roughly a thousand — a review engine widens the lead on demand already attracted'],
      ['The signature assets', 'The saltwater pool, cat boarding, and 24/7 care are barely told online', 'The most differentiated stories in the market are nearly unmarketed — content and AEO gold'],
      ['Blog & content', 'A handful of posts, thin and undated', 'Weak for the answer-engine race where AI now names specific local businesses — a fast content win'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making a genuinely premium resort work online as well as it works in person.',
      'The booking fix, the review engine, and the pool and cat-boarding content are low-cost, compounding moves with fast returns — and the search foundation is already running.',
      'They are also the natural first ninety days: fix the front door and the booking flow, then build the app and the membership on top.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITIES ----------
docChildren.push(
  ...sectionHeader('Technijian Capabilities — Proven Builds & Services', CORE_BLUE, '09'),
  spacer(100),
  p('Technijian already runs Pet Care Plus’ search marketing, so we know the site, the analytics, the ad accounts, and the call data — which makes everything here faster and lower-risk to deploy. This section separates two things plainly: a proven build Technijian has actually delivered, and the productized services Pet Care Plus would engage. We have not built an AI booking-and-membership platform for a pet resort before, and we say so; what follows maps real capabilities to this specific business, honestly labeled.'),
  spacer(160),
  subHeader('Proven Build — A System Technijian Has Built'),
  capabilityBox(
    'Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants — cutting content-production time roughly 70%.',
    'This is the engine that gets Pet Care Plus found: own "dog boarding / daycare / grooming West Loop," "dog pool Chicago," and the cat-boarding queries in Google and AI answers, and finally tell the pool and 24/7 stories at the scale they deserve.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Pet Care Plus Would Engage'),
  capabilityBox(
    'My SEO — Local Search, Answer-Engine & Reviews',
    'My SEO is Technijian’s local and answer-engine search service — Google Business Profile optimization, city and service landing pages, review generation, technical and PageSpeed remediation, and content merchandising. It is the service already running for Pet Care Plus, expanded.',
    'It fixes the 31/100 mobile speed and the technical warnings, builds review velocity toward the market leader’s level, claims the cat-boarding and pool lanes, and wins the answer-engine result no rival has.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Capture & Speed-to-Lead',
    'My AI Lead Gen is Technijian’s productized capture-and-nurture service — it responds to inbound interest in seconds, qualifies and routes it, and nurtures it until it books, with an AI front desk that answers around the clock.',
    'For Pet Care Plus it converts the demand the ads already pay for: a second-fast text-back to every new inquiry, an AI assistant that answers hours, availability, and vaccine rules at 9pm, and nurture that turns a question into a booking.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle to ship the tools a business actually runs on — integrating with the platforms already in place (here, the Gingr booking system).',
    'For Pet Care Plus it builds instant online booking for new leads, a branded booking-and-webcam app to match the technology leader, automated stay photos, and the membership / Pool Club program that turns regulars into recurring revenue.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI — Automation & Fractional Advisor',
    'My AI is Technijian’s applied-AI service — automation, an AI front desk, win-back and cross-sell journeys, and fractional advisory to lead the program and keep it measured against real numbers.',
    'For Pet Care Plus it automates the routine front-desk load, runs win-back on lapsing daycare regulars, drives puppy-to-daycare-to-grooming cross-sell, and ties the whole program to the analytics and call-tracking baselines.',
    'service'
  ),
);

// ---------- 10 AI ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Grows Pet Care Plus', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get found (own local search and AI answers, build review velocity, and tell the pool and cat-boarding stories), book faster (replace the 24-hour callback with instant booking and second-fast response), and keep and grow (a membership program, a branded app, and win-back and cross-sell that compound the regulars). Every part builds on the search foundation Technijian already runs for Pet Care Plus.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Pet Care Plus AI Engine', 600, 1.61),
  diagramCaption('Figure 10.0 — The Engine: Get Found, Book Faster, and Keep & Grow'),
  spacer(160),
  buildTable(
    [ { label: 'Motion', weight: 1.7 }, { label: 'Play', weight: 2.5 }, { label: 'What It Does', weight: 3 }, { label: 'Metric', weight: 1.6 }, { label: 'Service', weight: 1.5 } ],
    [
      ['Get Found', 'Answer-engine + local SEO', 'Own boarding/daycare/grooming + pool + cat queries in Google and AI answers', 'Local rankings', 'My SEO'],
      ['Get Found', 'Review-generation engine', 'Automated post-stay review asks across Google and Yelp', 'Review volume', 'My SEO'],
      ['Get Found', 'PageSpeed + technical fix', 'Repair the 31/100 mobile site and the 1,140 warnings', 'Speed, rankings', 'My SEO'],
      ['Get Found', 'Signature-asset content', 'Tell the pool, cat-boarding, and 24/7 stories nobody else does', 'Organic reach', 'My SEO'],
      ['Book Faster', 'Instant online booking', 'Replace the 24-hour callback for new leads with real-time booking', 'Booking rate', 'My Dev'],
      ['Book Faster', 'Speed-to-lead + AI front desk', 'Second-fast text-back; answer hours/availability/vaccines 24/7', 'Lead response time', 'My AI Lead Gen'],
      ['Book Faster', 'Uncap high-intent ads', 'Free the budget-capped Branded and Grooming campaigns already converting', 'Captured demand', 'My SEO'],
      ['Keep & Grow', 'Membership / Pool Club', 'Recurring daycare + pool membership no Chicago rival offers', 'Recurring revenue', 'My Dev'],
      ['Keep & Grow', 'Branded booking + webcam app', 'A local, polished app to match the technology leader', 'Repeat bookings', 'My Dev'],
      ['Keep & Grow', 'Win-back + cross-sell', 'Re-engage lapsing regulars; puppy → daycare → grooming journeys', 'Retention, LTV', 'My AI'],
      ['Keep & Grow', 'Photo Pup-Date automation', 'Auto-send stay photos — the transparency premium owners pay for', 'Satisfaction', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'AI augments the front desk and the care team — it does not replace the people and the dogs that are the whole point. The AI assistant answers and books; the staff care for the pets.',
      'Technijian integrates around the booking system Pet Care Plus already uses (Gingr) — it extends that workflow to new leads and adds the app and membership layer, it does not rip and replace.',
      'And every play runs on the search and analytics foundation Technijian already provides, so the growth program is built on a stack we already manage and measure.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('This section shows where the value comes from and what the program costs. Pricing shows real published Technijian rates where they exist and "to be determined in discovery" everywhere else — we quote what we can stand behind. The return is shown as the method we will measure, not an invented multiple; the discovery questions in Section 14 replace estimates with Pet Care Plus’ real baselines from its own analytics and call tracking.'),
  spacer(140),
  subHeader('Projected Lift (Estimated)'),
  buildTable(
    [ { label: 'Measure', weight: 3 }, { label: 'Current State', weight: 2.6 }, { label: 'With the Program', weight: 2.6 }, { label: 'Direction', weight: 1.8 } ],
    [
      ['New-lead booking', '24-hour callback', 'Instant booking + second-fast response', 'More booked stays'],
      ['Mobile site speed', '31/100; 1,140 warnings', 'Fast, clean, ranking', 'Found + converting'],
      ['Online reviews (volume)', '~282 Google', 'Automated review velocity', 'Trust + ranking'],
      ['AI-answer visibility', 'Absent', 'Cited for West Loop pet care', 'New demand'],
      ['Retention / recurring revenue', 'No membership', 'Membership / Pool Club', 'Predictable revenue'],
      ['Front-desk load', 'Manual calls & inquiries', 'AI handles routine 24/7', 'Staff capacity'],
      ['Stay updates', 'Manual / add-on', 'Automated photo updates', 'Premium experience'],
    ],
  ),
  spacer(160),
  subHeader('How We’ll Measure the Return (Illustrative)'),
  p('We do not lead with a multiple we cannot back. Year-1 return is modeled from the levers below, each tied to a number Pet Care Plus already tracks — so the model is built from real baselines in discovery, not assumed here.'),
  buildTable(
    [ { label: 'Value Lever', weight: 3 }, { label: 'The Mechanism', weight: 4 }, { label: 'The Number We Calibrate From', weight: 3 } ],
    [
      ['Recovered conversion', 'Instant booking + speed-to-lead capture demand the ads already pay for, before it cools', 'Current call/form volume and booking-conversion rate (call tracking)'],
      ['New search demand', 'Answer-engine + local SEO + review velocity lift map-pack rank and bookings', 'Current organic + GBP bookings and review count'],
      ['Retention & membership', 'A membership program and win-back turn one-time stays into recurring revenue', 'Daycare-regular count and average lifetime value'],
      ['Occupancy smoothing', 'Membership and mid-week campaigns fill the troughs toward the 60–70% break-even', 'Weekday vs. weekend occupancy'],
    ],
  ),
  spacer(60),
  p('Illustrative until discovery — no number we can’t back. Revenue is attributed to the program, not guaranteed; targets are set from Pet Care Plus’ own analytics and call-tracking baselines.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Technijian Service Investment Map (Land-and-Expand)'),
  p('Lead with a small entry program built on the search foundation already running; add the custom build and advisory as a later expansion, once the entry proves the lift. Published rates are shown where they exist; the rest is scoped in discovery.'),
  buildTable(
    [ { label: 'Service', weight: 2.8 }, { label: 'Scope', weight: 3.8 }, { label: 'Monthly', weight: 1.6 }, { label: 'Investment', weight: 1.6 } ],
    [
      ['My SEO — Answer-Engine, Local & Reviews', 'Already engaged — expand the current program with AEO, the review engine, the PageSpeed/technical fix, and pool/cat content', { text: 'In place', color: PASS }, { text: 'Current engagement', color: PASS }],
      ['My SEO — Add-ons (optional)', 'AI Search Optimization, PR, or Content Syndication, only if added to the current program', '$150–$200/mo*', 'Optional'],
      ['My AI Lead Gen — Capture & Speed-to-Lead (Starter)', 'Second-fast text-back, AI front desk, nurture to booking — the main new entry cost', '$1,499/mo*', '+ $2,500 setup'],
      [{ text: 'My AI — Review/Reputation Engine + AI Readiness Workshop', }, 'Review-velocity program + leadership alignment and roadmap', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'ENTRY PROGRAM SUBTOTAL', bold: true }, { text: 'Builds on the My SEO already in place; the new cost is the Lead Gen Starter + the TBD items scoped in discovery', bold: true }, { text: '', bold: true }, { text: 'In place + new', bold: true, color: CORE_BLUE }],
      [{ text: 'My Dev — Custom Build (Phase 2)', }, 'Instant booking + branded webcam/report-card app + membership/Pool Club portal', '—', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'My Dev — Managed App Services (Phase 2)', }, 'Hosting, monitoring, and support for the app + membership platform', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'My AI — Fractional AI Advisor (Phase 2)', }, 'Program leadership across search, booking, and retention', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'Finalized after discovery', bold: true }, { text: '', bold: true }, { text: 'TBD', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(60),
  p('* Pet Care Plus is already engaged on My SEO, so that program is in place — this plan expands its scope (AEO, the review engine, the technical fix, and content) within the current relationship; optional add-ons run $150–$200/mo each. The main new entry cost is My AI Lead Gen Starter at $1,499/mo plus a one-time $2,500 setup (real published rates). My AI, My Dev, the membership build, managed services, and the workshop have no published rate and are scoped in discovery — the Year-1 total is finalized then.', { italics: true, size: 18 }),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'The cheapest wins come first: the booking fix and the review engine start paying back in recovered bookings within the first quarter — on demand the ads already generate, with no large build to begin.',
      'The membership program is the compounding play: even a modest number of daycare regulars on a monthly membership adds recurring revenue that a one-time-stay business never sees.',
      'And because Technijian already runs the search marketing, there is no new firm to onboard — the program plugs into a stack we already manage and measure.',
    ],
    CORE_BLUE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence: fix the front door and the booking flow first, then grow demand and automate the front desk, then build the retention engine — the membership and the app. The cheapest, highest-visibility wins land in the first ninety days; the bigger builds get realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Pet Care Plus 90-180-270 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 12.0 — Pet Care Plus Growth Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Fix the front door and the booking leak; turn on the trust engine.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Answer-Engine + Technical Fix', 'Stand up AEO and local pages for boarding, daycare, grooming, pool, and cat boarding; repair the 31/100 mobile speed and the 1,140 warnings.'],
      ['1.2 — Instant Booking + Review Engine', 'Extend instant online booking to new leads (not just returning clients), add second-fast text-back, and turn on automated post-stay review asks.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Growth (Days 91–180)', { color: TEAL }),
  p('Grow demand and take the routine load off the front desk.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — AI Front Desk + Social', 'Launch the AI assistant that answers and books around the clock, and a content engine for pool and grooming short-form video.'],
      ['2.2 — Review Scale + Uncap Ads', 'Run review velocity to widen the lead, free the budget-capped high-intent campaigns, and turn on win-back for lapsing regulars.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Retention (Days 181–270)', { color: CORE_ORANGE }),
  p('Build the recurring-revenue engine no Chicago rival has.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Membership / Pool Club + App', 'Launch the membership program and the branded booking-and-webcam app; bring photo-update automation into production.'],
      ['3.2 — Cross-Sell + ROI Dashboard', 'Turn on puppy-to-daycare-to-grooming cross-sell journeys and deliver the ROI dashboard against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions Pet Care Plus can take immediately — before any expanded engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Open Online Booking to New Leads',
    ['The Gingr booking system already serves returning daycare and grooming clients — extend the same self-service booking to new customers instead of the 24-hour callback. It stops the single biggest conversion leak at no new cost.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Text Your Last 50 Happy Clients a Review Link',
    ['Send a one-tap Google review link to fifty recent boarding and daycare customers. You sit around 282 reviews where the market leader has roughly a thousand; starting the habit this week begins closing the gap, for free.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Publish One "Chicago’s Only Heated Saltwater Dog Pool" Page',
    ['Put up a single page — with photos and a short video — about the pool. It is the most differentiated asset in the market and almost nobody searches and finds it; this claims the lane in Google and AI answers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Add a Cat-Boarding Landing Page',
    ['Most Chicago dog facilities ignore cats. A dedicated "Kitty Wonderland" cat-boarding page captures an underserved search lane you already serve, with suites most rivals cannot match.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Fix the Biggest Mobile-Speed Offender',
    ['Compress the oversized homepage images dragging the 31/100 mobile score. It is a same-week change that lifts both Google ranking and the share of phone visitors who actually book.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This strategy builds on what Technijian already sees in Pet Care Plus’ analytics and ads — but the numbers in Sections 11 and 12 are deliberately conservative until we confirm a few baselines. The good news: most of these are already in the call-tracking and analytics dashboards. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [ { label: 'Topic', weight: 2.4 }, { label: 'What We’d Confirm', weight: 4.4 }, { label: 'Why It Matters', weight: 3.2 } ],
    [
      ['Booking conversion', 'How many calls and form-fills become bookings today, and how many cool off in the callback window', 'Sizes the recovered-conversion opportunity — the fastest win'],
      ['Customer economics', 'Average lifetime value by service (daycare, boarding, grooming)', 'The primary input to the retention and membership model'],
      ['The regulars', 'How many daycare and grooming regulars are membership-eligible', 'Scopes the membership / Pool Club program'],
      ['Occupancy', 'Weekday vs. weekend occupancy across boarding and daycare', 'Sizes the mid-week and membership opportunity'],
      ['Booking split', 'Share of bookings by phone vs. form, and the no-show / unanswered-lead rate', 'Calibrates the instant-booking and AI-front-desk plays'],
      ['Appetite', 'Interest in a membership program and a branded app', 'Decides the Phase-2 expansion scope'],
      ['Systems', 'Gingr usage and any other booking, POS, or CRM tools', 'Defines the build and integration surface'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Pet Care Plus’ real numbers — not on conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('Pet Care Plus has the hard things: twenty-eight years under one owner, a 4.7 Google rating, the only heated saltwater pool in Chicago, true 24/7 care, and a real cat suite. What it has not yet done is make that strength as visible, as bookable, and as repeatable online as it is in person — and that is exactly where AI helps.'),
  p('The opportunity is concrete and low-risk: open booking to new leads, build the reviews and content owners choose by, claim the AI-answer position no rival has, and turn loyal regulars into members. Because Technijian already runs the search marketing, this is the rare growth program that starts on a stack the partner already manages and measures.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — instant booking for new leads, the review engine, and the technical fix — live inside 30 days.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'We already run your search marketing. Let’s turn it into a growth engine.', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ] })] })],
  }),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000 — and already Pet Care Plus’ search-marketing partner. We build and operate the AI systems that help regional businesses compete at scale, with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Pet Care Plus', weight: 5 }],
    [
      ['My SEO (in place)', 'The search marketing Technijian already runs — expanded with answer-engine optimization, a review engine, technical fixes, and the pool and cat-boarding content'],
      ['My AI Lead Gen', 'Capture and speed-to-lead — a second-fast response and an AI front desk that converts the demand the ads already generate'],
      ['My Dev', 'Custom, AI-native builds — instant booking, a branded booking-and-webcam app, and the membership / Pool Club platform'],
      ['My AI', 'Applied AI — front-desk automation, win-back and cross-sell, and the fractional advisory that leads the program'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted June 2026, plus Pet Care Plus’ existing Technijian engagement records. Company details (founding year, ownership, services, awards, ratings) are drawn from public sources and the company’s own materials and should be confirmed with Pet Care Plus before external use.', { italics: true }),
  spacer(120),
  p('1. Pet Care Plus — petcp.com (Home, About, Dog Boarding, Doggie Daycare, Dog Grooming, Cat Boarding, Book Now, Offers & Events, Blog, Contact); Prestige Dog Training; the Gingr customer portal.', { size: 20 }),
  p('2. Reputation — Google Business Profile (≈4.7 / ≈282 reviews via Wanderlog and nears.me); Yelp; BBB; Groupon. Ratings are public snapshots and vary by date.', { size: 20 }),
  p('3. Competitors — Tucker Pup’s Pet Resort; Wag Hotels (West Loop); Found Chicago; Urban Pooch; K9 University; PUPS Pet Club; Chicago Canine Academy (public listings, Google/Yelp).', { size: 20 }),
  p('4. Industry — IBISWorld (Pet Grooming & Boarding); Mordor Intelligence and MarkWide (pet care & daycare); Clarkston Consulting and IBPSA (2026 trends); Vetstoria and PetDesk (owner behavior); Gingr, MoeGo, DaySmart, Anolla (operations & AI); HubSpot / CXL / Gartner (answer-engine optimization).', { size: 20 }),
  p('5. Technijian capabilities & service pricing — My SEO published tiers ($500–$1,500/mo plus add-ons), My AI Lead Gen ($1,499 Starter + $2,500 setup); My AI and My Dev are scoped per engagement; documented Proven Result (Multi-Agent SEO + Answer-Engine Platform). Existing engagement per Technijian SEO and client-portal records.', { size: 20 }),
);

// =====================================================================
const doc = new Document({
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } } }] }] },
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: docChildren }],
});

const OUT_PATH = path.join(__dirname, 'Pet-Care-Plus-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
