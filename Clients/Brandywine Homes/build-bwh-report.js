// Brandywine Homes (brandywine-homes.com) — AI Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/CBI/build-cbi-report.js. COLD outreach (no existing
// Technijian relationship). GTM = hybrid, supply-side-led (Source / Entitle & Build /
// Sell & Partner). Land-and-expand pricing. Built-vs-service capability labels.

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

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-03';
const CLIENT = 'Brandywine Homes';
const PHONE = '949.379.8499';

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
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, pageBreakBefore: true,
    spacing: { before: 0, after: 120, line: 240 },
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Brandywine Homes: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
    children: [
      new TextRun({ text: `Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  ${PHONE}  |  technijian.com  |  Page `, size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'BRANDYWINE HOMES', size: 54, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Urban Infill Homebuilding  —  Southern California', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California  |  brandywine-homes.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for Brandywine Homes', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ---------- (no trailing pageBreak: the TOC fills the page; an explicit
// break here lands on a full boundary and produces a blank page. Let Section 01 flow.)
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }));

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1994', label: 'Family-Owned Since', color: CORE_BLUE },
    { number: '60+', label: 'Infill Communities Built', color: CORE_ORANGE },
    { number: '$1.2B', label: 'Cumulative Revenue', color: TEAL },
    { number: '~2,000', label: 'Homes Delivered', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Brandywine Homes has spent more than thirty years doing the hardest thing in California real estate: turning underused infill land — an abandoned church, a tired motel, a failed strip center — into homes, working side by side with cities through public-private partnerships. Sixty-plus communities, roughly two thousand homes, and $1.2 billion in revenue is a record very few infill builders can claim. This blueprint, prepared by Technijian as a fellow Irvine company, lays out how AI strengthens that exact model — without changing what already works.'),
  p('The starting point is honest: for an infill builder, growth is not gated by selling homes. Well-located infill homes sell. Growth is gated on the supply side — finding and entitling scarce, complicated land faster than the next builder. That is where the national giants are now spending their AI budgets. D.R. Horton runs Prophetic, an AI land platform that lets one analyst evaluate 5,700 parcels a month instead of a couple hundred. Lennar runs an AI sales agent that handles the 30% of buyer inquiries arriving overnight. Those tools are built for large-tract production. In the Southern California infill niche where Brandywine competes, AI adoption is effectively zero.'),
  p('That gap is the opportunity. This is a focused program with three motions that map exactly to how Brandywine grows: source (find and qualify more infill land, faster, with AI parcel and feasibility intelligence), entitle and build (compress entitlement timelines and run constrained sites leaner with document automation and construction-ops AI), and sell and partner (absorb homes faster with a 24/7 buyer assistant, and make the relationships with cities, landowners, and capital partners more findable and better-armed). AI does the surfacing, drafting, and answering; the team still negotiates the deal and wins the council vote.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'A once-in-a-generation policy window: the 2025 CEQA reform (AB 130 / SB 131) created a statutory exemption for infill housing and, per the Urban Land Institute, cuts the entitlement timeline by an estimated 12 to 18 months. The builder who can screen and qualify parcels for these by-right pathways fastest wins the land.',
      'A wide-open competitive lane: no Southern California infill builder — not Olson, City Ventures, Melia, Trumark, or Warmington — has deployed AI in land sourcing, entitlements, construction, or buyer absorption. Being first is a durable advantage, not a catch-up move.',
      'A program priced to start small: a roughly $37K entry program (an executive workshop, AI land and account intelligence, and answer-engine search) pays for itself on the land and absorption levers alone, with the larger custom build held for after the entry proves the lift.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Brandywine’s internal numbers — deal volume, entitlement timelines, absorption pace, and capital structure — were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call. The specific questions are in Section 15.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE INFILL GROWTH MODEL ----------
docChildren.push(
  ...sectionHeader('The Infill Growth Model', CORE_BLUE, '02'),
  spacer(100),
  p('A growth plan has to start with how Brandywine actually makes money, because it is not a retail funnel — it is a deal pipeline. Land comes in on the supply side, runs through four stages, and comes out as a finished community. Three outside parties feed every deal: the landowner who holds an underused parcel, the city that controls entitlements through a public-private partnership, and the capital partners and lenders who fund construction. The center of gravity is the front of the pipeline: source and entitle. Win there, and the rest follows.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How Brandywine Grows: an Infill Deal Pipeline', 600, 1.67),
  diagramCaption('Figure 2.0 — Brandywine’s growth is gated on the supply side: sourcing and entitling scarce infill land, not selling the homes'),
  spacer(120),
  subHeader('Four Stages, One Pipeline'),
  bullet('Source: find and assemble underused infill parcels — churches, motels, failed retail, strip malls, warehouses — across Orange County, LA County, and the Inland Empire. Gated by deal flow and land scarcity.'),
  bullet('Entitle: navigate city planning, CEQA, zoning, and by-right pathways, and structure the public-private partnership. Gated by entitlement time and risk — the single longest, costliest part of the cycle.'),
  bullet('Build: develop a small, constrained infill site with a lean team running several communities at once. Gated by cost and schedule discipline.'),
  bullet('Sell: absorb attainable townhomes and move-up detached homes in a slow, incentive-heavy market. Gated by absorption pace.'),
  spacer(120),
  calloutBox(
    'Why the Model Rewards AI',
    [
      'The supply side is a search-and-judgment problem at scale — exactly what AI does well. Scanning thousands of parcels, classifying their by-right path, and estimating yield is work a lean team cannot do by hand but an AI does in minutes.',
      'The entitlement stage is paperwork-heavy and time-sensitive — CEQA filings, staff reports, community-meeting materials — and the 2025 reform rewards whoever moves fastest through the new exemptions.',
      'And absorption in a soft market is won on speed-to-buyer: the inquiry answered at 2 a.m. and the tour booked before a competitor responds.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE GROWTH EQUATION ----------
docChildren.push(
  ...sectionHeader('The Growth Equation', TEAL, '03'),
  spacer(100),
  p('Brandywine grows three ways, and each is gated by something AI can move. This is the spine the rest of the plan hangs on.'),
  spacer(140),
  buildTable(
    [ { label: 'Growth Lever', weight: 2.4 }, { label: 'What Gates It Today', weight: 4 }, { label: 'The AI Play', weight: 3.6 } ],
    [
      ['Source more land', 'Infill parcels are scarce and found largely by hand and relationship; a lean team can only chase so many at once', 'AI land and feasibility intelligence — scan and score thousands of parcels, surface off-market sites, classify the by-right path'],
      ['Entitle and build faster', 'Discretionary CEQA and manual filings stretch entitlements 12-18 months; constrained sites punish cost and schedule slips', 'Entitlement document automation, approval-timeline modeling, and construction-ops AI across concurrent communities'],
      ['Absorb and partner', 'Homes sit longer in a soft market; overnight inquiries go unanswered; the B2B partner story is hard to find online', 'A 24/7 buyer assistant, answer-engine search, and a findable landowner / city / capital presence'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why Brandywine Is Positioned to Win This',
    [
      'The hard assets are already there: 32 years of entitlement know-how, a network of city and capital relationships, and a proven adaptive-reuse model. AI makes that judgment scale across more deals — it does not replace it.',
      'The timing is rare: the 2025 CEQA reform rewards the fastest mover on by-right infill, and that speed is exactly what an AI screening-and-drafting layer provides.',
      'The lane is empty: no Southern California infill competitor has any of this, so the advantage is first-mover, not catch-up.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE MARKET & WHERE IT'S GOING ----------
docChildren.push(
  ...sectionHeader('The Market & Where It’s Going', CORE_BLUE, '04'),
  spacer(100),
  p('Three forces shape the plan: California cannot build enough housing, the 2025 CEQA reform just rewrote the entitlement clock in infill builders’ favor, and the AI race in homebuilding is being run by national giants aimed at large tracts — leaving the infill niche wide open.'),
  spacer(140),
  subHeader('Market Forces (2024–2026)'),
  buildTable(
    [ { label: 'Force', weight: 2.6 }, { label: 'What’s Happening', weight: 4 }, { label: 'Implication for Brandywine', weight: 3.4 } ],
    [
      ['Chronic undersupply', 'California is short ~3 million homes, yet H1 2025 permits fell to ~49,400 — the lowest since 2014', 'Demand for well-located infill homes is structural; the constraint is land and approvals, not buyers'],
      ['CEQA reform window', 'AB 130 / SB 131 (June 2025) created a statutory CEQA exemption for infill housing up to 20 acres; ULI estimates a 12-18 month timeline cut', 'A rare advantage for whoever screens and qualifies parcels for by-right paths fastest — an AI problem'],
      ['By-right toolbox', 'SB 9, SB 35 / SB 423, AB 2011 (housing on commercial land), and Density Bonus law stack to boost yield and speed', 'Fluency in stacking these pathways, parcel by parcel, is a durable edge'],
      ['Soft for-sale market', 'New-home sales per community are down ~15% YoY; unsold inventory is up ~18%; incentives average ~7.5% of base price', 'Absorption speed and marketing efficiency directly protect margin'],
      ['Buyers shop online first', '>70% of buyers use multiple platforms before contact; new-home search runs through AI assistants and listing portals', 'A 24/7 assistant and answer-engine visibility convert demand a soft market makes scarce'],
    ],
  ),
  spacer(160),
  subHeader('The AI Race in Homebuilding'),
  p('The largest builders are arming both ends of the pipeline. On land, D.R. Horton and Century Communities run Prophetic, an AI platform that generates zoning-compliant site plans and yield estimates in minutes and lets one analyst evaluate 5,700 parcels a month. On sales, Lennar’s AI agent handles the roughly 30% of inquiries that arrive overnight and is on pace to book about 12,000 appointments a year. These tools are built for large-tract production — none is tuned for the parcel-by-parcel, assemblage-heavy, entitlement-hard reality of Southern California infill. That is the white space.'),
  spacer(120),
  calloutBox(
    'The Market’s Verdict',
    [
      'The scarcity and the policy window both reward the same thing: speed and reach on the supply side — sourcing and entitling more infill land than a hand-run process can.',
      'The soft sales market rewards absorption speed and marketing efficiency — answering and converting the demand that does exist.',
      'And the AI race rewards the first infill builder to act, because the national tools are pointed elsewhere and no regional infill competitor has moved.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('The next dollar of growth comes from a few clear pools. The supply-side pools are won account by account — landowners, cities, and capital partners. The buyer pools are won on absorption speed. The program serves all of them.'),
  spacer(120),
  buildTable(
    [ { label: 'Growth Pool', weight: 2.4 }, { label: 'Who / What', weight: 3.2 }, { label: 'How Brandywine Captures It', weight: 4 } ],
    [
      ['Off-market infill land', 'Owners of churches, motels, failed retail, strip malls, and warehouses ripe for redevelopment', 'AI parcel monitoring + feasibility scoring + a findable landowner-facing presence'],
      ['Public-private partnerships', 'Cities seeking revitalization of underused, transitional sites', 'A documented PPP track record made searchable, plus faster, cleaner entitlement filings'],
      ['By-right pathway sites', 'Parcels that qualify under SB 9, SB 35 / SB 423, AB 2011, or the AB 130 exemption', 'Automated eligibility classification and yield estimates that surface deals competitors miss'],
      ['Attainable + move-up buyers', 'Townhome and detached buyers across OC, LA County, and the Inland Empire', 'A 24/7 buyer assistant and answer-engine visibility that speed absorption in a soft market'],
      ['Capital + BTR partners', 'Equity partners, construction lenders, and build-to-rent investors funding the pipeline', 'Investor-ready deal packets and partner targeting that keep the funding pipeline full'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Sides, One Program',
    [
      'The supply-side pools are won by relationship and timing — AI surfaces the parcel and arms the team, but the deal is still negotiated by people who have done it for thirty years.',
      'The buyer pools are demand that already exists in a short market — the job is to answer and convert it faster than the homes can sit.',
      'The two reinforce each other: a stronger, more findable public and partner presence makes Brandywine a more credible partner to cities and capital, which feeds the supply side.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE BRANDYWINE STAKEHOLDERS ----------
docChildren.push(
  ...sectionHeader('The Brandywine Stakeholders', CORE_ORANGE, '06'),
  spacer(100),
  p('Brandywine’s growth runs through more relationships than just homebuyers. The cards below profile the people who actually gate and fund the pipeline, plus the buyers who absorb the homes. The matrix that follows places each by deal value and by how much landing the relationship drives growth.'),
  spacer(160),

  subHeader('Supply-Side Gatekeepers'),
  personaCard('1 — The City / Public-Private Partner', CORE_BLUE, [
    ['Role', 'Planning staff, a city manager, and a council seeking to revitalize an underused or transitional site — the entitlement gatekeeper and the partner in a PPP (the Baldwin Park model).'],
    ['Pain Points', 'Slow, contested approvals; community pushback; uncertainty about whether a builder will actually deliver a quality project.'],
    ['Decision Driver', 'A credible, proven partner who makes the city look good, moves cleanly through process, and delivers what was promised.'],
    ['AI Opportunity', 'Faster, cleaner entitlement filings and community-meeting materials; a searchable PPP track record that makes Brandywine the obvious partner.'],
    ['Technijian Hook', 'My AI — entitlement document intelligence. My SEO — a findable PPP and redevelopment story.'],
  ]),
  spacer(160),
  personaCard('2 — The Land Seller / Off-Market Owner & Broker', CORE_ORANGE, [
    ['Role', 'The owner of an underused infill parcel, or the broker who controls it — the front of the pipeline.'],
    ['Pain Points', 'Hard to identify and reach before a competitor does; uncertainty about what a complicated site can actually yield.'],
    ['Decision Driver', 'A builder who can move fast with a credible offer and a clear plan for a hard parcel.'],
    ['AI Opportunity', 'AI parcel monitoring and owner targeting surface and prioritize off-market sites; instant yield and feasibility estimates let Brandywine move first.'],
    ['Technijian Hook', 'My AI Lead Gen — land and owner intelligence. My Dev — the feasibility tool.'],
  ]),
  spacer(160),
  personaCard('3 — The Capital & Equity Partner', PASS, [
    ['Role', 'Equity partners and construction lenders who fund each deal — the layer that lets a lean builder run several communities at once.'],
    ['Pain Points', 'Wants speed, certainty, and clear underwriting; dislikes surprises on cost, schedule, or entitlement risk.'],
    ['Decision Driver', 'Confidence in the deal: clean feasibility, a realistic timeline, and a partner who delivers returns.'],
    ['AI Opportunity', 'AI-pressure-tested feasibility and investor-ready deal packets shorten the path to a funded deal and deepen partner trust.'],
    ['Technijian Hook', 'My AI — feasibility underwriting review. My Dev — investor deal-packet automation.'],
  ]),
  spacer(160),
  subHeader('The Buyers'),
  personaCard('4 — The Attainable Townhome Buyer', GOLD, [
    ['Role', 'A first-time or value-focused buyer of an attainable townhome (roughly $480K-$800K) — the volume base of the for-sale business.'],
    ['Pain Points', 'Affordability anxiety; wants quick answers on price, availability, and incentives, often after hours.'],
    ['Decision Driver', 'A clear, fast, low-friction buying experience and confidence in the builder.'],
    ['AI Opportunity', 'A 24/7 buyer assistant answers questions and books tours the moment interest strikes; answer-engine search puts Brandywine in the buyer’s shortlist.'],
    ['Technijian Hook', 'My Dev — the buyer assistant. My SEO — community and answer-engine search.'],
  ]),
  spacer(160),
  personaCard('5 — The Move-Up / Detached Buyer', TEAL, [
    ['Role', 'A higher-value buyer of a detached home (roughly $900K-$1M+) in a lower-density infill community.'],
    ['Pain Points', 'Wants to compare options confidently and understand the neighborhood and finish quality before committing.'],
    ['Decision Driver', 'Trust, neighborhood fit, and a smooth, well-informed buying process.'],
    ['AI Opportunity', 'Richer, AI-readable community content and a responsive assistant shorten the consideration cycle and improve absorption.'],
    ['Technijian Hook', 'My SEO — community content and visibility. My Dev — the buyer assistant.'],
  ]),
  spacer(160),
  subHeader('Emerging Segment'),
  personaCard('6 — The BTR / Multifamily Investor', PURPLE, [
    ['Role', 'A build-to-rent or multifamily investor for Brandywine’s growing rental arm (the 234-unit Delhaven Pointe in Murrieta) — high value per relationship.'],
    ['Pain Points', 'Needs confidence in pro forma, delivery, and the operating story before committing capital.'],
    ['Decision Driver', 'Proven delivery, a clear rental thesis, and investor-grade materials.'],
    ['AI Opportunity', 'Partner targeting and investor-ready deal packets grow the rental pipeline as capital rotates toward build-to-rent.'],
    ['Technijian Hook', 'My AI Lead Gen — investor and partner targeting. My Dev — deal-packet automation.'],
  ]),
  spacer(200),
  p('Figure 6.0 maps each by deal value and by strategic influence on the pipeline. The story is clear: Brandywine’s growth is gated by the supply-side relationships at the top — cities, landowners, and capital — which is exactly where account intelligence and faster filings matter most.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Brandywine Stakeholder Matrix', 580, 1.50),
  diagramCaption('Figure 6.0 — Stakeholder Matrix: Deal / Relationship Value vs. Strategic Influence on the Pipeline'),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('Brandywine competes in two arenas. Among Southern California infill builders, the field is conventional — modern websites and human sales offices, but no AI anywhere in land, entitlements, construction, or sales. Among the national production giants, AI is already a weapon — but those tools are built for large-tract, master-planned work, not parcel-by-parcel infill. Brandywine cannot out-scale Lennar; it can be the first infill builder to bring AI to the infill-specific hard problems.'),
  spacer(140),
  buildTable(
    [ { label: 'Competitor', weight: 2.2 }, { label: 'Profile', weight: 3 }, { label: 'Posture vs. Brandywine', weight: 4 } ],
    [
      ['The Olson Company', 'Seal Beach; 11,000+ urban-infill homes across ~100 CA cities', 'The closest strategic peer — scale and infill focus, but no AI signals; beatable on speed and tooling'],
      ['City Ventures', 'Irvine; ~5,000 all-electric / solar infill townhomes', 'Modern brand and live chat, but no AI, no land tooling — a conventional digital posture'],
      ['Melia Homes', 'Irvine; OC infill (Anaheim, Stanton, Placentia)', 'Templated builder website, no AI — directly overlapping turf, easy to out-modernize'],
      ['Trumark Homes', 'San Ramon (Daiwa House); core infill, "land others won’t touch"', 'Best-in-class among infill peers — a buyer portal and virtual counselors — but still no generative AI'],
      ['Risewell (New Home Co + Landsea)', 'Irvine; top-25 builder; "High Performance Homes" + Apple HomeKit', 'The strongest tech brand among regionals, but that is smart-home product tech, not AI in operations or land'],
      ['Lennar / D.R. Horton (national)', 'Production giants; LISA AI sales agent; Prophetic AI land platform', 'The AI benchmark — but aimed at large-tract production, not infill; the model to learn from, not match on scale'],
    ],
  ),
  spacer(200),
  subHeader('Scale & AI-Maturity Scorecard'),
  p('Reduced to the two things that decide who wins the land and the buyer — scale and AI maturity — the picture is stark. The entire Southern California infill cohort sits in the same corner: real businesses, real reputations, and no AI at all.'),
  buildTable(
    [ { label: 'Player', weight: 2.6 }, { label: 'Scale', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Land AI', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Sales AI', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Verdict', weight: 2.6 } ],
    [
      ['Lennar', { text: 'National', align: AlignmentType.CENTER }, { text: 'Partial', color: TEAL, align: AlignmentType.CENTER }, { text: 'Yes', color: PASS, align: AlignmentType.CENTER }, 'Scale + AI leader (large-tract)'],
      ['D.R. Horton', { text: 'National', align: AlignmentType.CENTER }, { text: 'Yes', color: PASS, align: AlignmentType.CENTER }, { text: 'Partial', color: TEAL, align: AlignmentType.CENTER }, 'AI land via Prophetic'],
      ['Trumark', { text: 'Regional', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Portal', align: AlignmentType.CENTER }, 'Best infill peer — still no AI'],
      ['Olson / City Ventures / Melia', { text: 'Regional', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, 'Conventional infill cohort'],
      [{ text: 'Brandywine (today)', bold: true }, { text: 'Regional', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'First-mover lane is open', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field. The whole infill cohort — Brandywine included — sits in the bottom-left: regional scale, no AI. The national giants are top-right but pointed at different work. The realistic, high-payoff move is straight up: be the first infill builder with AI in land, entitlements, and absorption.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. AI & Digital Maturity', 580, 1.50),
  diagramCaption('Figure 7.0 — Competitive Positioning: Scale / Volume vs. AI & Digital Maturity'),
  spacer(160),
  calloutBox(
    'Where Brandywine Wins',
    [
      'Not on scale — Lennar and D.R. Horton are a different size and a different business. The win is on the infill-specific hard problems their large-tract tools do not address: parcel assemblage, brownfield and by-right screening, and entitlement acceleration.',
      'Against the infill cohort, the advantage is simply being first: a 32-year reputation and city relationships, now armed with AI, against competitors running the same process they ran a decade ago.',
      'The same content and presence that win buyers also make Brandywine a more credible partner to cities and capital — so both fronts compound.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For a 32-year, $1.2 billion builder, the digital presence is solid where it points at buyers and thin where it points at the partners who actually gate growth. A few fixes are unusually high-return because the audiences — cities, landowners, capital, and increasingly AI search engines — decide largely online.'),
  spacer(140),
  buildTable(
    [ { label: 'Digital Asset', weight: 2.6 }, { label: 'Current State', weight: 3.2 }, { label: 'Gap / Opportunity', weight: 4.2 } ],
    [
      ['Crawler / AI access', 'The website returns an HTTP 403 to non-browser fetchers — it renders for people but blocks many crawlers and AI fetchers', 'A quiet but real visibility risk as buyers shift to AI search — fix it so Google and AI assistants can read the site'],
      ['AI-search momentum', 'Internal links already carry a ChatGPT-referral tag — Brandywine is tracking AI-search traffic', 'A strong signal to build on: answer-engine optimization done right turns that momentum into cited visibility'],
      ['B2B partner presence', 'A single static "Partnerships" page; a light LinkedIn footprint despite a relationship-driven, PPP-heavy model', 'No findable surface for the landowners, cities, and capital partners that gate the pipeline — the biggest gap'],
      ['Buyer content', 'Modern per-community microsites with real-time availability and a steady SEO blog', 'A good foundation — make each community page AI-readable (schema, FAQ) so assistants cite it'],
      ['Construction / proptech', 'No public signal of BIM, land tools, scheduling, or estimating technology', 'A blank slate — the operational AI that competitors lack is entirely greenfield here'],
      ['Reputation / social', 'Modest social following for a builder of this tenure; light review footprint', 'Under-merchandised proof for both buyers and partners — a fast, compounding content win'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making a strong, proven operation as findable and as modern online as it already is in the field.',
      'The crawler fix and a partner-facing presence are low-cost, compounding moves with fast returns — and Brandywine is already courting AI-search traffic, so the foundation is started.',
      'They are also the natural first ninety days: fix the foundation and turn on intelligence, then build the tools on top.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a buyer or a city partner asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now, given the crawler block:'),
  calloutBox('Prompt: "Who builds quality infill townhomes on redeveloped sites in Orange County?"', [
    'TODAY — the AI assistant answers with whichever builders have content it can actually read and third-party signals it can find: it names a couple of larger regional and national builders, and does NOT mention Brandywine — even though Brandywine has 32 years, 60-plus infill communities, and a documented public-private-partnership track record. With the site returning a 403 to many fetchers, the assistant cannot read the very pages that would make Brandywine the obvious answer. Brandywine is invisible at the exact moment a buyer or a city is forming a shortlist.',
    'AFTER THE FIX — the same query returns Brandywine as a cited option ("Brandywine Homes is a family-owned Southern California infill builder with 60+ communities and a public-private-partnership track record…"), with the AI-readable community pages and the partner-facing presence as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result is part of the free Nexus Assess baseline.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter the site stays unreadable to crawlers and the partner presence stays thin, the assistants learn to answer "infill builder in Southern California" with someone else — and that default, once set in the training and retrieval data, is harder and more expensive to dislodge than to claim now. The same is true of the supply side: the CEQA-reform window rewards the fastest mover on by-right infill, and that speed comes from the screening-and-drafting layer this report describes. No SoCal infill competitor has moved yet — that lane is open today, not indefinitely. The cost of waiting is not zero; it is a competitor becoming the default answer and the first to clear the new exemptions.'),
);

// ---------- 09 TECHNIJIAN CAPABILITIES ----------
docChildren.push(
  ...sectionHeader('Technijian Capabilities — Proven Builds & Services', CORE_BLUE, '09'),
  spacer(100),
  p('Before the pitch, the proof. This section separates two things plainly: AI systems Technijian has actually built and shipped, and the productized services Brandywine would engage. Each is labeled for what it is, and each maps to a specific use in the infill pipeline. Technijian is an Irvine firm that builds and operates production-grade AI — not a strategy shop that hands over a deck.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence (Days to Minutes)',
    'Technijian deployed AI document intelligence that auto-populates complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60-80% less manual review.',
    'Pointed at the entitlement stage, the same approach drafts and tracks CEQA filings, staff reports, community-meeting materials, and municipal correspondence — turning the longest, most paperwork-heavy part of the cycle into a fraction of the time.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants — cutting content-production time roughly 70%.',
    'This is the engine that gets Brandywine found: AI-readable community pages, a landowner and city-facing presence, and the answer-engine visibility that builds on the ChatGPT-referral traffic the site already tracks.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'LLM Council — Three-Model Peer Review (ScamShield)',
    'Technijian built ScamShield on an LLM Council pattern — Claude, GPT-4o, and Gemini independently review and cross-check each decision — with Weaviate RAG memory and risk scoring, hitting 70-80% target gross margins.',
    'The same pattern pressure-tests a land deal: three models independently review feasibility, zoning, and risk before Brandywine commits capital — a second, third, and fourth opinion on every parcel, in minutes.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Weaviate + Obsidian Knowledge System',
    'Technijian implemented a hybrid Weaviate (vector) plus Obsidian knowledge system giving AI agents persistent, queryable memory across an organization’s documents and history.',
    'For Brandywine it becomes an institutional-knowledge graph: 32 years of entitlement playbooks, city-by-city approval history, and subcontractor performance, queryable by a lean team so judgment scales across every concurrent community.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Brandywine Would Engage'),
  capabilityBox(
    'My AI Lead Gen — Land & Account Intelligence',
    'My AI Lead Gen is Technijian’s productized intelligence service — it harvests high-fit targets from public data, enriches and scores them, and delivers prioritized, outreach-ready lists.',
    'Re-tuned for an infill builder, it monitors Southern California parcels, starts, and permits, surfaces off-market redevelopment sites and landowners, and targets the cities and capital partners worth pursuing — account intelligence for the supply side, not buyer lead-gen.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) to ship the tools and integrations a business actually runs on.',
    'For Brandywine it builds the AI land-and-feasibility tool, the entitlement document-intelligence pipeline, the 24/7 buyer assistant, and the institutional-knowledge graph — the custom layer the off-the-shelf tools do not cover.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO + My AI — Search, Strategy & the Fractional Advisor',
    'My SEO is Technijian’s search and answer-engine service; My AI provides the executive workshop, the fractional AI advisor, and the strategy and governance that tie a program together.',
    'Together they fix the crawler block, build the buyer and partner-facing presence, and put a hands-on AI advisor over the whole program so a lean team gets the value without having to run it.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across land intelligence, entitlement drafting, and buyer absorption: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass, the compliance-critical sections of an entitlement filing, deepest deal-feasibility reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — staff reports and community-meeting materials, parcel scoring, outreach personalization, summarization', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classifying and extracting from thousands of parcels, enriching owner and permit records, tagging by-right eligibility', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Brandywine pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single CEQA filing, for example, is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final accuracy-and-compliance pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. Where the stakes are highest, like a land-feasibility commit, the LLM-council pattern above puts three models on the same decision. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 10 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Brandywine Homes Leadership', CORE_BLUE, '10'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Brandywine sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that Brett Whitehead, Alex Hernandez, and the Brandywine team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft the CEQA exemption checklist from this parcel’s zoning and APN data." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch Southern California parcels and flag new off-market infill sites worth underwriting." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Brandywine starts with simple automations that pay off in the first 90 days, and adds autonomous agents only where the value is proven — which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Brandywine Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run companies — including Brandywine — sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Brandywine Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'Already courting AI search (the site tracks ChatGPT-referral traffic) and running modern web tooling, but AI is not yet woven into land, entitlements, or absorption', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — parcel screening, entitlement drafting, buyer response — with measured results', ''],
      ['4. Scaled', 'AI is embedded across sourcing, entitlements, construction, and sales with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the business sources, entitles, builds, and sells', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Brandywine is already at the Emerging stage: it tracks AI-search referrals and runs real-time-availability tooling on its community sites. This report is the plan to reach Operational — AI working in land sourcing, entitlements, and absorption — within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a deal-driven, relationship-heavy business like Brandywine, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer — a misread setback, an over-stated yield', 'Human-in-the-loop review on anything that goes to a city, a partner, or a buyer — AI drafts, a person approves before it leaves the building'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — deal terms, capital-partner relationships, and feasibility numbers never touch a public model'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Organizations Are Already Doing', { color: CORE_BLUE }),
  bullet('Homebuilding land teams: national builders run AI land platforms that let one analyst evaluate thousands of parcels a month instead of a couple hundred — finding deals a hand-run process never sees.'),
  bullet('Regulated, document-heavy approvals: organizations facing paperwork-intensive filings are turning multi-day document assembly into a minutes-long, review-ready draft — responding to more opportunities with the same team.'),
  bullet('For-sale and rental sales: builders and operators are using AI assistants to answer overnight buyer inquiries and book tours that would otherwise go cold until morning — converting demand a soft market makes scarce.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Brandywine’s own numbers would be confirmed in discovery. Technijian’s specific, measured results from prior builds appear in Section 9 (Technijian Capabilities) and the operational levers in Section 12.', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — A Brandywine Entitlements Lead', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: An entitlements lead hears about an off-market parcel, pulls zoning and APN records by hand, estimates yield from experience, and then spends days drafting the CEQA paperwork, the staff report, and the community-meeting materials city by city — most of it held in a few senior people’s heads across several concurrent communities.',
    'WITH AI: AI parcel monitoring surfaces the site and scores its by-right path (SB 9 / SB 35-423 / AB 2011 / density bonus) with a yield estimate in minutes; an AI assistant drafts the entitlement filings and meeting materials from the parcel data; the lead reviews, corrects, and approves. The 32-year playbook is captured in a system, so the same standard holds across every community and survives a new hire or a new city.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but Brandywine assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader is scarce and typically costs $180K+/year, and one person cannot cover strategy, build, security, and governance for a lean ~50-person team'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one Irvine team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 11 AI ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Grows Brandywine', CORE_BLUE, '11'),
  spacer(100),
  p('The engine runs three motions that mirror the pipeline: source (find and qualify more infill land with AI parcel and feasibility intelligence), entitle and build (compress approvals and run constrained sites leaner with document automation, timeline modeling, construction-ops AI, and a knowledge graph), and sell and partner (absorb homes with a 24/7 buyer assistant and answer-engine search, and keep the land, city, and capital relationships full). It supports the human relationship layer — it does not replace it.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Brandywine AI Engine', 600, 1.61),
  diagramCaption('Figure 10.0 — The Engine: Source, Entitle & Build, Sell & Partner'),
  spacer(160),
  buildTable(
    [ { label: 'Motion', weight: 1.7 }, { label: 'Play', weight: 2.5 }, { label: 'What It Does', weight: 3 }, { label: 'Metric', weight: 1.6 }, { label: 'Service', weight: 1.5 } ],
    [
      ['Source', 'Land + feasibility intelligence', 'Scan SoCal infill parcels; estimate yield + feasibility in minutes', 'Parcels screened', 'My Dev'],
      ['Source', 'Parcel + owner targeting', 'Surface off-market sites and landowners; prioritize assemblage', 'Qualified sites', 'Lead Gen'],
      ['Source', 'By-right path scoring', 'Auto-classify SB 9 / SB 35 / AB 2011 / density-bonus eligibility', 'By-right deals found', 'My AI'],
      ['Source', 'Feasibility underwriting review', 'A 3-model AI council pressure-tests each deal before commit', 'Risk caught early', 'My AI'],
      ['Entitle & Build', 'Entitlement document intelligence', 'Draft and track CEQA filings, staff reports, correspondence', 'Days to minutes', 'My AI'],
      ['Entitle & Build', 'Approval-timeline modeling', 'City-by-city timelines + community-meeting materials', 'Faster approvals', 'My Dev'],
      ['Entitle & Build', 'Construction-ops AI', 'Schedule, budget-variance, and change-order analysis', 'Margin protected', 'My Dev'],
      ['Entitle & Build', 'Institutional-knowledge graph', '32 years of playbooks and city history, queryable', 'Lean team scales', 'My AI'],
      ['Sell & Partner', '24/7 AI buyer assistant', 'Answer plans / price / availability; book tours; catch leads', 'Absorption pace', 'My Dev'],
      ['Sell & Partner', 'Community + answer-engine search', 'AI-readable pages assistants cite; fix the crawler block', 'Cited visibility', 'My SEO'],
      ['Sell & Partner', 'Landowner + city B2B presence', 'A findable PPP and redevelopment story for partners', 'Inbound partners', 'My SEO'],
      ['Sell & Partner', 'Capital + BTR targeting', 'Surface equity / BTR partners; investor-ready packets', 'Funded deals', 'Lead Gen'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'AI augments the land team, the entitlement experts, the construction managers, and the sales office — it does not replace the relationships with cities, landowners, and capital partners that 32 years built.',
      'AI surfaces the parcel, drafts the filing, and answers the buyer at 2 a.m.; people still negotiate the deal, win the council vote, and build the home.',
      'This is not broad, "shotgun" marketing — Brandywine already knows the kind of land and the kind of partner it wants. The value is depth, speed, and timing on a known target set, not volume.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 12 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '12'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because Brandywine’s internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 15 replace them with real baselines. The logic holds across a wide range of inputs, because the levers — land sourced, entitlement time saved, margin protected, homes absorbed — are large relative to the program cost.'),
  spacer(120),
  calloutBox('AI as a Managed Investment — Not a Leap of Faith', [
    'The reason most AI spending disappoints is not the technology — it is the lack of measurement. Per McKinsey’s State of AI, the large majority of companies now use AI, but only a minority see a real profit impact; the difference is disciplined measurement, not bigger budgets.',
    'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost — and if a pilot does not clear its cost at the gate, we stop and re-scope. Brandywine carries the upside, not blind risk.',
  ], CORE_ORANGE),
  spacer(140),
  subHeader('Projected Lift (Estimated)'),
  buildTable(
    [ { label: 'Measure', weight: 3 }, { label: 'Estimated Current', weight: 2.4 }, { label: 'With the Program', weight: 2.4 }, { label: 'Direction', weight: 1.8 } ],
    [
      ['Infill parcels screened / month', 'A handful, by hand', 'Hundreds, AI-scored', 'Bigger pipeline'],
      ['Entitlement document turnaround', 'Days of manual drafting', 'Minutes-to-draft, AI-assisted', 'Faster approvals'],
      ['Entitlement timeline (qualifying infill)', 'Discretionary CEQA', 'By-right paths + AB 130 exemption', '12-18 months faster*'],
      ['Overnight buyer inquiries captured', 'Missed until morning', 'Answered + booked 24/7', 'More tours'],
      ['Construction cost-variance visibility', 'Reactive', 'Predictive, per community', 'Margin protected'],
      ['Institutional knowledge', 'In people’s heads', 'Queryable knowledge graph', 'Lean team scales'],
    ],
  ),
  spacer(40),
  p('* Per the Urban Land Institute on AB 130 / SB 131; applies to qualifying infill projects. All measures calibrate to Brandywine’s actuals in discovery.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Year-1 Value at Stake (Illustrative, Conservative)'),
  p('For a homebuilder, the levers are large relative to the program. The table models three of them conservatively and deliberately excludes the biggest one — additional land sourced and entitled — because a single new infill community dwarfs the entire program. The ratio is modeled against the entry program, not the full engine.'),
  buildTable(
    [ { label: 'Value Lever', weight: 3.6 }, { label: 'Conservative', weight: 2.1 }, { label: 'Likely', weight: 2.1 }, { label: 'Upside', weight: 2.1 } ],
    [
      ['Carrying cost saved (faster entitlements)', '+$50,000', '+$110,000', '+$210,000'],
      ['Absorption / incentive efficiency', '+$35,000', '+$80,000', '+$150,000'],
      ['Construction cost-variance recovery', '+$25,000', '+$55,000', '+$100,000'],
      [{ text: 'Total annual value (excl. new land sourced)', bold: true }, { text: '+$110,000', bold: true }, { text: '+$245,000', bold: true }, { text: '+$460,000', bold: true }],
      [{ text: 'Entry-program investment (Y1)', bold: true }, { text: '~$37,400', bold: true }, { text: '~$37,400', bold: true }, { text: '~$37,400', bold: true }],
      [{ text: 'Modeled ROI vs. entry', bold: true, color: CORE_BLUE }, { text: '~2.9x', bold: true, color: PASS }, { text: '~6.6x', bold: true, color: PASS }, { text: '~12x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('Figures are illustrative and conservative, modeled on public benchmarks (e.g., the ~7.5% incentive norm and ULI’s 12-18 month entitlement estimate). Value is attributed to the program, not guaranteed, and the largest lever — new land sourced and entitled — is not counted in the ratio. All inputs calibrate to Brandywine’s actuals in discovery.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Land & Visibility Pilot', { color: CORE_BLUE }),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot turns on AI land and account intelligence, fixes the crawler block, and stands up the AI-search and partner-facing presence, and proves the lift before any larger build is discussed. It is the headline ask — recurring quick-win services and a workshop, no large build — and pays for itself on the land and absorption levers alone. The custom build is the expansion, deliberately held for after the pilot proves out.'),
  buildTable(
    [ { label: 'Service', weight: 2.9 }, { label: 'Scope', weight: 3.5 }, { label: 'Monthly', weight: 1.4 }, { label: 'Y1 Total', weight: 1.4 } ],
    [
      ['My AI — Executive Workshop & Readiness (one-time)', 'Leadership alignment and a prioritized AI roadmap', '—', '$5,000'],
      ['My AI Lead Gen — Land & Account Intelligence (Starter)', 'Monitor SoCal infill parcels, starts, permits; landowner, city, and capital targets', '$1,499/mo', '$17,988'],
      ['My SEO — Community + Answer-Engine Search (Tier 3 + AI Search Opt)', 'AI-readable community pages, the crawler fix, and the B2B partner presence', '$1,200/mo', '$14,400'],
      [{ text: 'THE 90-DAY PILOT — YEAR 1', bold: true }, { text: '~$2,699/mo + $5,000 one-time', bold: true }, { text: '', bold: true }, { text: '~$37,400', bold: true, color: CORE_BLUE }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program lead across the land tool, entitlement AI, and buyer assistant', '$2,000/mo', '$24,000'],
      ['My Dev — Custom AI Builds (Phase 2; estimated, confirmed at quote)', 'Land-feasibility tool, entitlement document-intelligence, 24/7 buyer assistant, knowledge graph', '—', '$75,000'],
      ['My Dev — Managed App Services (Phase 2)', 'Run and maintain the builds', '$800/mo', '$9,600'],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'Recurring $5,499/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$146,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(120),
  calloutBox('The Pilot Bar — and Our Commitment', [
    'Success metric: within 90 days, AI land-and-account intelligence is live and delivering a scored, prioritized pipeline of Southern California infill parcels and partner targets the team would not have surfaced by hand, AND Brandywine is readable and cited by AI search — the crawler block is fixed and the answer-engine and partner-facing presence are live.',
    'Our commitment: the pilot is month-to-month after the initial term — no lock-in. If it has not hit the metric above by day 90, you are under no obligation to continue, and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
  ], CORE_ORANGE),
  spacer(60),
  p('Productized rates are current published figures (My SEO tiers and add-ons; My AI Lead Gen Starter). My AI and My Dev are estimated and confirmed at quote. A blended, US-led rate is shown; project and custom work is quoted against a transparent labor-rate card with no surprises. Scale is the third step: roll the tooling across every active and future community and the build-to-rent arm — the one-time build amortizes across sites.', { italics: true, size: 18 }),
);

// ---------- 13 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '13'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence: turn on the foundation and the intelligence first, then build the pipeline tools, then scale across communities. The cheapest, highest-visibility wins land in the first ninety days; the bigger builds get realistic runway and only start after the entry proves out.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Brandywine 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 12.0 — Brandywine Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Align leadership, turn on intelligence, and fix the front door.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Workshop + Land & Account Intelligence', 'Run the executive AI workshop and a prioritized roadmap; turn on parcel, owner, city, and capital monitoring for Southern California infill.'],
      ['1.2 — Community + Answer-Engine Search', 'Fix the crawler block, make community pages AI-readable, and stand up the landowner and city-facing B2B presence.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Pipeline (Days 91–180)', { color: TEAL }),
  p('Build the supply-side tools that compress sourcing and entitlements.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Land-Feasibility Tool', 'Launch the AI parcel tool: yield estimates and by-right path scoring (SB 9 / SB 35 / AB 2011 / density bonus) across SoCal infill sites.'],
      ['2.2 — Entitlement Document Intelligence', 'Bring CEQA-filing and staff-report drafting into production, with city-by-city approval-timeline modeling.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale (Days 181–365)', { color: CORE_ORANGE }),
  p('Add absorption and operations, then roll across communities.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Buyer Assistant + Knowledge Graph', 'Launch the 24/7 AI buyer assistant across communities and the institutional-knowledge graph for the team.'],
      ['3.2 — Construction-Ops AI + ROI Dashboard', 'Bring schedule and budget-variance AI into production and deliver the ROI dashboard against the Section 15 baselines.'],
    ],
  ),
);

// ---------- 14 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '14'),
  spacer(100),
  p('Five actions Brandywine can take immediately — before any engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Unblock the Crawler so AI Search Can Read You',
    ['Your site returns a 403 to non-browser fetchers, which can block Google and AI assistants like ChatGPT and Perplexity from reading it. You are already tracking ChatGPT referral traffic — do not block the crawler that feeds it. This is a same-week server-config fix with outsized visibility payoff.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Run a Free Nexus Assess',
    ['Technijian will run a no-cost Nexus Assess — an internal and external vulnerability scan plus a Microsoft 365 review, delivered as a prioritized remediation roadmap. It is a concrete first engagement that maps to your compliance posture, with no commitment.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Stand Up a "For Land Sellers & City Partners" Page',
    ['Create a single page that tells the public-private-partnership and adaptive-reuse story — the Baldwin Park kind of project — so the landowners and cities that gate your pipeline can find and vet you. Today that story lives mostly in people’s heads, not where a partner searches.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Add AI-Readable Detail to Every Community Page',
    ['Put structured pricing, floor plans, availability, and an FAQ in machine-readable form on each community page so AI assistants cite Brandywine when a buyer asks. You already have the content and a real-time availability tool — this makes it visible to answer engines.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Document One City’s Entitlement Playbook',
    ['Write down the steps, timelines, and contacts for one city’s approval process. It is useful on its own and becomes the first seed of an institutional-knowledge graph — turning 32 years of know-how into something a lean team can query.'],
    CORE_BLUE),
);

// ---------- 15 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '15'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 12 and 13 are deliberately conservative estimates — a short discovery call replaces them with Brandywine’s real baselines and sharpens the whole program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [ { label: 'Topic', weight: 2.4 }, { label: 'What We’d Confirm', weight: 4.4 }, { label: 'Why It Matters', weight: 3.2 } ],
    [
      ['Deal volume + goal', 'Communities closed per year and how many you want to run concurrently', 'Sets the scale of the land and entitlement engine'],
      ['Land sourcing', 'Where deals come from today (brokers, off-market, relationships) and the sourcing-to-close funnel', 'Calibrates the AI land-intelligence work'],
      ['Entitlement timeline', 'Average approval time, which cities, and the biggest entitlement pain points', 'Sizes the document-intelligence and timeline gains'],
      ['Construction', 'Cost-variance and schedule experience on constrained infill sites', 'Scopes the construction-ops AI'],
      ['Absorption', 'Current absorption pace and incentive load vs. the ~7.5% norm; the buyer-marketing and CRM stack', 'Sizes the buyer-assistant and search plays'],
      ['Capital', 'Equity partners and lender relationships, and the funding cadence', 'Shapes the capital-partner and deal-packet work'],
      ['For-sale vs. BTR', 'The growth split between for-sale and build-to-rent', 'Weights the program toward the right pools'],
      ['Systems', 'Current CRM, the real-time-availability tool, and any land or proptech systems', 'Defines the build and integration surface'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Brandywine’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 16 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '16'),
  spacer(100),
  p('The honest answers to the questions Brandywine leadership is most likely asking right now.'),
  spacer(120),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already have a web partner (P11) and an SEO blog. Why add Technijian?', bold: true }, 'Keep them — they built a solid, modern site. We add the layer they do not: AI-search optimization (answer-engine) that fixes the crawler block, the landowner and city-facing B2B presence, and the AI land intelligence and internal automation no web or SEO shop provides. We run alongside your partner, not over them.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — parcel screening and document drafting — not autonomous "agents" running your business. We use the simplest tool that works, measure it, and only expand what earns its place. The national giants already run AI on land and sales; this is the same discipline, tuned for infill.'],
      [{ text: 'Is our data — deal terms, capital relationships, feasibility numbers — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything that goes to a city, a partner, or a buyer, led by a CISSP-certified team. Data governance is part of the free Nexus Assess in the Quick Wins.'],
      [{ text: 'We’re a lean ~50-person team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give your team back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing what we draft. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry is a fixed-price 90-day pilot with a defined success metric (Section 12), month-to-month with no lock-in. If it has not hit the metric by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The 90-day pilot is approximately $37K for Year 1 at published rates — no hidden fees, no large up-front build. Because we route work across roughly seven models by task (Section 9), the AI run cost is a fraction of wiring everything to one premium model. The full engine (the later expansion) is profiled in Section 12, but only after the pilot proves the lift.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 17 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '17'),
  spacer(100),
  p('Brandywine has the hard things: 32 years, 60-plus infill communities, $1.2 billion in revenue, deep city and capital relationships, and a proven adaptive-reuse model. What it has not yet done is bring AI to the supply side of that model — and no Southern California infill competitor has either. That is a first-mover lane, open today, in the exact part of the business where growth is actually gated.'),
  p('The opportunity is concrete and low-risk: turn on AI land and account intelligence, fix the front door and the partner presence, then build the land-feasibility, entitlement, and buyer tools on top. The entry program is small on purpose and pays for itself on the land and absorption levers alone; the bigger build comes later, once the entry proves the lift.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 15 questions and confirm program scope — or start with a half-day Executive AI Briefing tailored to Brandywine.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the workshop, land and account intelligence, and the crawler and search fixes — live inside 30 days.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Be the first infill builder with AI on the supply side.', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: `Ravi Jain, Founder & CEO, Technijian  |  rjain@technijian.com  |  ${PHONE}`, size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ] })] })],
  }),
);

// ---------- 18 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '18'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional businesses compete at scale — as a fellow Orange County company that understands the Southern California development landscape.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Brandywine', weight: 5 }],
    [
      ['My AI', 'AI strategy, the executive workshop, the fractional advisor, and the custom AI that runs the land, entitlement, and buyer engine'],
      ['My AI Lead Gen', 'Land and account intelligence — parcels, owners, cities, and capital partners surfaced and prioritized for the supply side'],
      ['My Dev', 'Custom, AI-native builds — the land-feasibility tool, entitlement document-intelligence, the 24/7 buyer assistant, and the knowledge graph'],
      ['My SEO', 'Community and answer-engine search, the crawler fix, and the landowner and city-facing B2B presence'],
      ['My IT & My Security', 'The managed IT, cybersecurity, and compliance foundation that the whole program runs on, securely'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Founder & CEO', 'Ravi Jain — rjain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', PHONE],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(80),
  p('Intelligence gathered via public web research, June 2026. Company details are drawn from public sources and Brandywine’s own materials, and should be confirmed before external use.', { italics: true, spaceAfter: 100 }),
  p('1. Brandywine Homes — brandywine-homes.com (Vision/Mission, Partnerships, Team, Find Your Home, Past Communities, Multi-Family, News); Yelp / D&B / BuildZoom; LinkedIn; Instagram; PR Newswire (2019 results); The Real Deal LA (Pico Rivera, 2024); SoCal MAME 2021.', { size: 20, spaceAfter: 100 }),
  p('2. Market, policy & proptech — Davis Vanguard and firsttuesday (permits / starts); HousingWire and John Burns Research (sales, inventory, incentives, affordability); C.A.R. 2026 forecast; Holland & Knight and Urban Land Institute (AB 130 / SB 131, 12-18 month estimate); Terner Center and CA YIMBY (SB 423, AB 2011); NAR and Zonda / NewHomeSource; The Real Deal and Bisnow (Prophetic, D.R. Horton, Century); HousingWire (Acres.ai); Higharc / Inman; Cotality and HouseCanary; ECI (MarkSystems, Lasso CRM); Salesforce and Chief AI Officer (Lennar LISA / Agentforce); Autodesk 2025 construction-AI trends.', { size: 20, spaceAfter: 100 }),
  p('3. Competitors & Technijian — The Olson Company, City Ventures, Melia Homes, Trumark Homes, Warmington, Intracorp; Risewell Homes (New Home Co. + Landsea); Lennar, KB Home, Tri Pointe, Toll Brothers (Builder Magazine, GlobeNewswire, company sites). Technijian documented Proven Results: AI Document Intelligence (FINRA broker-dealers); Multi-Agent SEO + Answer-Engine Platform; ScamShield LLM Council; Weaviate + Obsidian knowledge system.', { size: 20, spaceAfter: 100 }),
  p('4. AI literacy & responsible-AI frameworks (Section 10) — MIT Sloan Management Review (AI literacy: "what AI can do," not how to build it); Anthropic, "Building Effective Agents" (the automation/workflow vs. agent distinction); the widely-used five-stage AI maturity model, consistent with Gartner and Google Cloud frameworks; U.S. NIST AI Risk Management Framework (Govern / Map / Measure / Manage); McKinsey State of AI (AI as a stage-gated, measured investment).', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Brandywine-Homes-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
