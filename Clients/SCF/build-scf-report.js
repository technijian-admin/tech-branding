// SC Fuels (Southern Counties Oil Co., L.P.) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/ORX/build-orx-report.js (MWAR/RKE lineage).

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
const CHARTREUSE    = strip(tokens.color.secondary.chartreuse.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';

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

const TODAY = '2026-05-22';
const CLIENT = 'SC Fuels';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

// ---------- Helpers ----------
function spacer(size = 200) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] });
}
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })],
  });
}

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
  });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [120, CONTENT_W - 120],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 120, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 120, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 100, bottom: 100, left: 200, right: 0 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })],
      }),
    ]})],
  });
  return [headingPara, visualTable];
}

function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    keepNext: true, keepLines: true,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })],
  });
}

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}

function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({
    keepNext: true, keepLines: true,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })],
  });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({
    keepNext: i < bodyArr.length - 1, keepLines: true,
    spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({
        width: { size: 80, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 80, type: WidthType.DXA },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [titleP, ...bodyParas],
      }),
    ]})],
  });
}

function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    borders: noBorders,
    margins: { top: 200, bottom: 200, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 48, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ],
  });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })],
  });
}

function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  const diff = CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  colWidths[colWidths.length - 1] += diff;

  const headerCells = columns.map((c, i) => new TableCell({
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { fill: headerColor, type: ShadingType.CLEAR },
    borders: cellBorders,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })],
  }));

  const dataRows = rows.map((row, ri) => new TableRow({
    cantSplit: true,
    children: row.map((cell, i) => {
      const cellObj = typeof cell === 'string' ? { text: cell } : cell;
      const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
      return new TableCell({
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: columns[i].align || AlignmentType.LEFT,
          children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })],
        })],
      });
    }),
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows],
  });
}

function personaCard(name, color, fields) {
  const headerRow = new TableRow({
    cantSplit: true,
    children: [new TableCell({
      columnSpan: 2,
      shading: { fill: color, type: ShadingType.CLEAR },
      borders: noBorders,
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })],
    })],
  });
  const fieldRows = fields.map(([label, value], i) => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 2400, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 2400, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2400, CONTENT_W - 2400],
    rows: [headerRow, ...fieldRows],
  });
}

function capabilityBox(title, built, applies) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({
        width: { size: 80, type: WidthType.DXA },
        shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 80, type: WidthType.DXA },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: 'What Technijian Built: ', size: 20, bold: true, color: CORE_BLUE, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to SC Fuels: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  });
}

function diagramImage(buf, altTitle, widthPx = 600, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) }, altText: { title: altTitle, description: altTitle, name: altTitle } })],
  });
}
function diagramCaption(text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] });
}
function colorBanner(color, height = 200) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })],
  });
}

// ---------- Header / Footer ----------
function makeHeader() {
  return new Header({ children: [new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2400, CONTENT_W - 2400],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ],
  })] });
}

// =====================================================================
// DOCUMENT BODY
// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(400),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2000, 5360, 2000],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})],
  }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'SC FUELS', size: 72, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Southern Counties Oil Co.', size: 26, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Orange, California  |  scfuels.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for SC Fuels', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1930', label: 'Distributing Fuel Since', color: CORE_BLUE },
    { number: '11,000+', label: 'Commercial Customers', color: CORE_ORANGE },
    { number: '15+', label: 'Western States Served', color: TEAL },
    { number: '1B+', label: 'Gallons Delivered Yearly', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('SC Fuels is the West’s market-leading independent fuel and lubricant distributor — and since 2021, part of Pilot Company, which is majority-owned by Berkshire Hathaway. It moves more than a billion gallons a year to over eleven thousand commercial accounts across fifteen-plus states, runs four delivery channels, and is actively buying up regional distributors. On scale, supply, and balance sheet, SC Fuels already leads. The question this blueprint answers is a different one: who turns that lead into a digital and AI advantage before a rival does it first?'),
  p('Because on digital, SC Fuels is under-built relative to its size. It is content-light and shows no AI in its buyer experience, while one competitor — Booster — has built an app-first, AI-routed mobile-fueling service, and two others — Mansfield and World Kinect — lead the category on content and fuel-data tooling. None of them, however, has combined real scale with real AI in SC Fuels’ Western backyard. That corner of the market is open, and SC Fuels is the one player with the scale to own it.'),
  p('This blueprint is a focused, hybrid growth program with three moves: get found for the demand that already searches (local and answer-engine SEO, a page for every branch and service, and an upgraded customer portal with an AI assistant), win the named accounts worth winning (account intelligence, RFP automation, and pre-visit dossiers that arm the field team), and run leaner (route, tank, and compliance automation that protects margin). It is deliberately account-based where it should be — SC Fuels already knows who its commercial targets are — and demand-capturing where genuine search demand exists.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'SC Fuels leads on scale and supply (Pilot- and Berkshire-backed) but is digitally under-built. The "scale plus AI" corner of the Western market is uncontested — and SC Fuels is the only player big enough to claim it.',
      'Real search demand goes uncaptured today: "bulk diesel delivery [city]," "cardlock near me," "DEF delivery," and "renewable diesel supplier" are searched every day, and SC Fuels has no per-branch pages to catch them. Local and answer-engine SEO claims that demand.',
      'Growth is gated by how many accounts a finite field team can reach. Account intelligence multiplies the reps across fifteen states without proportional headcount — under SC Fuels’ existing named-account strategy, not a broad lead-generation blast.',
    ],
    CORE_ORANGE
  ),
  p('Note on figures: SC Fuels’ internal metrics (current new accounts per month, churn, gross profit per account, compliance hours) were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call — the specific questions are listed in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE MARKET POSITION ----------
docChildren.push(
  ...sectionHeader('The Market Position', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for SC Fuels has to start by being honest about who SC Fuels is today — because the public story and the real one have drifted apart. The website still tells a third-generation, family-owned story. The reality is bigger: in 2021, SC Fuels became part of Pilot Company, one of North America’s largest fuel operators, which is majority-owned by Berkshire Hathaway. The founding family’s leadership stayed on to run the business, but the balance sheet, the supply infrastructure, and the national fueling network behind SC Fuels are now those of a top-tier energy company.'),
  p('That changes the strategic posture entirely. SC Fuels is not a regional underdog defending its turf — it is the consolidator. In 2025 alone it absorbed Downs Energy’s cardlock, fueling, and lubricants assets and acquired Lutz Petroleum, adding dozens of cardlock sites and thousands of customers in Southern California. The growth engine described in this document is therefore not about survival; it is about converting a position of strength into a durable digital and AI lead — and integrating each acquisition cleanly instead of letting acquired customers quietly churn.'),
  spacer(120),
  calloutBox(
    'Three Strengths to Build On',
    [
      'Scale and supply security: Pilot- and Berkshire-backed sourcing, plus access to a nationwide cardlock network (CFN and Pacific Pride, 230,000+ acceptance sites) that few regional rivals can match.',
      'An acquisitive footprint: SC Fuels is actively buying regional distributors, which means a steady stream of new customer books to onboard, cross-sell, and retain — a job AI account intelligence is built for.',
      'A real installed base: more than eleven thousand commercial accounts, from small family businesses to Fortune 500 fleets, across construction, agriculture, trucking, municipal, manufacturing, and waste.',
    ],
    CORE_BLUE
  ),
  p('The one thing SC Fuels has not yet done is tell that story online or put AI to work behind it. The Pilot-scale reality is a selling point sitting unused; aligning the brand with it is one of the Quick Wins in Section 13.', { spaceBefore: 60 }),
);

// ---------- 03 THE DISTRIBUTION BUSINESS MODEL ----------
docChildren.push(
  ...sectionHeader('The Distribution Business Model', TEAL, '03'),
  spacer(100),
  p('SC Fuels makes money as the operator in the middle of the fuel supply chain: it sources product at the rack and through Pilot’s network, then delivers it to commercial customers through four distinct channels, billing and supporting each account along the way. Understanding those channels matters for a growth program, because each one is found, sold, and retained differently — and AI plugs into each at a different point.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How SC Fuels Reaches the Market', 600, 1.73),
  diagramCaption('Figure 3.0 — How SC Fuels reaches the market: supply, four delivery channels, and where AI plugs in'),
  spacer(120),
  subHeader('Four Channels, One Operator'),
  buildTable(
    [
      { label: 'Channel', weight: 2.4 },
      { label: 'What It Is', weight: 4.2 },
      { label: 'Primary Buyer', weight: 3.4 },
    ],
    [
      ['Bulk / bobtail delivery', 'Tank-truck delivery of gasoline, on- and off-road diesel, biodiesel, and renewable diesel to on-site tanks', 'Construction yards, farms, transload sites, large fleets'],
      ['Mobile on-site fueling', 'A fuel truck refills fleet vehicles and equipment where they sit, overnight or between shifts', 'Construction, agriculture, transportation fleets'],
      ['Cardlock network', 'Fleet fuel cards (CFN, Pacific Pride, and SC Fuels programs) accepted across 230,000+ sites nationwide', 'Over-the-road and regional commercial fleets'],
      ['Wholesale, lubricants & DEF', 'Branded and unbranded supply, Chevron/Castrol/Valvoline lubricants, and diesel exhaust fluid', 'Retail stations, resellers, industrial accounts'],
    ],
  ),
  spacer(160),
  subHeader('What SC Fuels Already Does Well'),
  p('The business runs on real operational strengths — each of which gets sharper with AI behind it:'),
  bullet('Supply security and price discipline backed by Pilot’s sourcing — a hard advantage to replicate regionally.'),
  bullet('A genuine multi-channel offer: a customer can buy bulk, mobile, cardlock, and lubricants from one partner on one relationship.'),
  bullet('A self-service customer portal already in place (rebates, e-receipts, transaction controls) — a foundation to extend, not rebuild.'),
  bullet('Field sales reps who own long-term commercial account relationships — the human core that AI is meant to amplify, not replace.'),
  spacer(120),
  calloutBox(
    'Why the Model Rewards AI',
    [
      'Every channel runs on data — gallons, routes, tank levels, card transactions, prices, and credits — and most of that data is under-used today. That is exactly the raw material AI turns into forecasting, retention, and margin.',
      'Because the same account often buys across several channels, share-of-wallet growth (selling a bulk customer a cardlock program, or a fleet customer lubricants and DEF) is one of the cheapest forms of growth — and AI is good at spotting where it is sitting.',
      'The recurring lines — keep-full tanks, cardlock, lubricants, DEF — are reorderable revenue that rewards predictive replenishment and churn prevention, both of which are automatable.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 INDUSTRY & REGULATORY LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Industry & Regulatory Landscape', CORE_BLUE, '04'),
  spacer(100),
  p('Two forces define the next few years for a Western fuel distributor, and both favor the operator that modernizes first. The first is market structure: the industry is consolidating fast, demand for traditional fuels is softening as fleets grow more efficient and begin to electrify, and renewable diesel is becoming the growth-and-margin offset. The second is regulation: California and the Western states impose one of the heaviest fuel-compliance burdens in the country — and that burden is precisely where AI removes cost and risk.'),
  spacer(140),
  subHeader('Market Forces (2024–2026)'),
  buildTable(
    [
      { label: 'Force', weight: 2.6 },
      { label: 'What’s Happening', weight: 4.2 },
      { label: 'Implication for SC Fuels', weight: 3.2 },
    ],
    [
      ['Consolidation', 'Refiners and large distributors are buying regional players to lock in volume', 'SC Fuels is on the buy side — the opportunity is clean integration and cross-sell of acquired books'],
      ['Softening fuel demand', 'Gasoline use is easing as efficiency rises; medium-duty fleet electrification is starting at depots', 'Defend and expand share of each account; win net-new accounts to outrun flat demand'],
      ['Renewable diesel (R99)', 'A drop-in diesel substitute whose economics are driven by LCFS credits', 'A higher-margin growth line SC Fuels already sells — and can lead on, with content and targeting'],
      ['Telematics convergence', 'Fuel cards, telematics, and tank sensors are merging; ~14% of fleet fuel spend is lost to fraud/theft', 'Data and fraud controls become a selling point, not just a back-office function'],
      ['Driver / labor shortage', 'CDL and Hazmat driver scarcity pressures delivery operations', 'Route and delivery optimization protects service levels with the same headcount'],
    ],
  ),
  spacer(160),
  subHeader('The Regulatory Burden Is the AI Thesis'),
  p('Compliance in this industry is heavy, recurring, and error-prone — which makes it an ideal target for automation. The table below ranks the major regimes by how much documentation work AI can take off SC Fuels’ plate.'),
  buildTable(
    [
      { label: 'Regime', weight: 2.2 },
      { label: 'What It Requires', weight: 4.6 },
      { label: 'AI Reduction', weight: 1.8, align: AlignmentType.CENTER },
    ],
    [
      ['CARB / LCFS', 'Carbon-intensity tracking, credit and deficit accounting, quarterly reporting; the CI target stepped up in mid-2025', { text: 'High', color: PASS, bold: true }],
      ['RFS / RINs (EPA)', 'Renewable Identification Number tracking, renewable-volume obligations, and attestation', { text: 'High', color: PASS, bold: true }],
      ['IFTA fuel tax', 'Multi-jurisdiction mileage-and-fuel tax filing — manual filing costs roughly 88 hours a year per fleet', { text: 'High', color: PASS, bold: true }],
      ['UST rules', 'Annual monitoring certification, 36-month tank testing; single-wall tanks had to be closed by end of 2025', { text: 'Medium', color: CORE_ORANGE, bold: true }],
      ['DOT / Hazmat', 'Driver and Hazmat certifications, bills of lading and manifests, placarding', { text: 'Medium', color: CORE_ORANGE, bold: true }],
      ['Fuel excise / sales tax', 'Layered federal, state, and local excise determination', { text: 'Medium', color: CORE_ORANGE, bold: true }],
    ],
  ),
  spacer(160),
  calloutBox(
    'LCFS, RINs, and IFTA Are the Fastest ROI',
    [
      'These three regimes are heavy, recurring, and rules-based — the profile that AI automates most reliably, with a clean before-and-after the client can measure in hours saved.',
      'CARB and LCFS are uniquely Western, so SC Fuels’ footprint makes the burden especially acute — and the automation especially valuable.',
      'Compliance automation is also the easiest credibility-builder: bounded, painful, and obviously worth fixing. It proves the program works fast, then funds the bigger growth plays.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('Before tactics, one question decides the strategy: where does SC Fuels’ next dollar of growth actually come from? The answer is a few distinct pools of demand — some of them searchable and under-captured today, and some of them a finite set of named accounts won by the field team. The program is built to serve all of them, which is why it pairs broad search capture with targeted, account-based outreach instead of one undirected campaign.'),
  spacer(120),
  buildTable(
    [
      { label: 'Demand Pool', weight: 2.2 },
      { label: 'Who’s Looking', weight: 2.6 },
      { label: 'Example Triggers / Searches', weight: 3 },
      { label: 'How SC Fuels Wins It', weight: 2.4 },
    ],
    [
      ['Searchable local', 'Fleet, construction, ag buyers comparing suppliers', '"bulk diesel delivery [city]", "cardlock near me", "DEF delivery", "renewable diesel supplier"', 'Local + AEO SEO, per-branch pages, portal capture'],
      ['Named commercial accounts', 'Large fleets, contractors, ag operations the reps know by name', '(won by outreach, not search) fleet expansions, new yards, fuel-spend signals', 'Account intelligence + per-account outreach + reps'],
      ['Municipal / government', 'City, county, transit, and waste procurement officers', 'Posted RFPs and bids for fuel-supply contracts', 'RFP / bid auto-response + speed + service depth'],
      ['Renewable / ESG', 'Ports, corporate ESG fleets, LCFS-motivated buyers', '"renewable diesel," "R99," carbon-reporting needs', 'Authority content + targeted outreach on the margin line'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Ways to Grow, One Program',
    [
      'The searchable pool is demand that already exists — buyers type these queries and the results point to whoever shows up, which is rarely SC Fuels today. Local SEO, answer-engine optimization, and an upgraded portal turn that traffic into quotes and open accounts.',
      'The named accounts and municipal contracts are not won by search; they are won by the field team. That track stays account-based, so the program is never an undirected "spray-and-pray" — AI surfaces the right targets and arms the rep who closes them.',
      'This honesty is the point: SC Fuels already knows who its biggest targets are. The value of AI is depth and timing on those accounts, plus capturing the broad search demand the field team can’t chase one quote at a time.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE SC FUELS CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The SC Fuels Customer', CORE_ORANGE, '06'),
  spacer(100),
  p('SC Fuels serves a set of distinct commercial buyer types. Each is found and sold differently, and they differ meaningfully on both account fuel volume and margin or strategic value — which is why the segment matrix below uses those two axes to show where to point the search effort and where to point the account-based outreach.'),
  spacer(160),

  personaCard('1 — The Fleet Operations Director', CORE_BLUE, [
    ['Role', 'Runs fueling for a trucking, logistics, or transportation fleet — cards, bulk, and cost-per-mile are their world.'],
    ['Pain Points', 'Fuel is the second-biggest line item; card fraud and off-route fills bleed margin; reconciling spend across sites is manual.'],
    ['Decision Driver', 'Uptime, network coverage, transaction control, and clean data — price matters, but so does never having a truck sit dry.'],
    ['AI Opportunity', 'Fraud alerts and spend analytics make the SC Fuels card a data product, not just a payment method; churn models flag at-risk accounts early.'],
    ['Technijian Hook', 'My Dev — portal + card analytics. My AI — fraud detection and churn prediction that defend a high-volume account.'],
  ]),
  spacer(160),

  personaCard('2 — The Construction Equipment / Operations Manager', CORE_ORANGE, [
    ['Role', 'Keeps equipment and vehicles fueled across active job sites, often with on-site tanks and off-road (red-dye) diesel.'],
    ['Pain Points', 'A dry tank stops a crew; sites move; ordering is reactive; mobile fueling has to show up on time, every time.'],
    ['Decision Driver', 'Reliability and responsiveness — keep-full service and on-site fueling that never lets a job wait on fuel.'],
    ['AI Opportunity', 'Predictive tank monitoring triggers refills before run-dry; demand forecasting and route optimization keep mobile fueling on schedule.'],
    ['Technijian Hook', 'My Dev — predictive tank monitoring + route optimization. My SEO — capture "[city] on-site fleet fueling" search demand.'],
  ]),
  spacer(160),

  personaCard('3 — The Agricultural Operations Manager', TEAL, [
    ['Role', 'Manages fuel for a farm or ag operation — seasonal, remote, and heavily off-road diesel.'],
    ['Pain Points', 'Demand spikes at planting and harvest; tanks are far from the road; running out mid-season is costly.'],
    ['Decision Driver', 'A supplier who anticipates the season and keeps remote tanks full without being chased.'],
    ['AI Opportunity', 'Seasonal demand forecasting and keep-full automation; local search capture for ag-fuel queries by region.'],
    ['Technijian Hook', 'My Dev — keep-full + forecasting. My SEO — regional ag-fuel pages and answer-engine presence.'],
  ]),
  spacer(160),

  personaCard('4 — The Municipal / Government Fleet & Procurement Officer', DARK_CHARCOAL, [
    ['Role', 'Procures fuel for a city, county, transit agency, or waste operation — almost always through a formal RFP.'],
    ['Pain Points', 'Bids are documentation-heavy and deadline-driven; compliance and reporting are scrutinized; incumbents are hard to unseat.'],
    ['Decision Driver', 'A complete, on-time, compliant bid and dependable reporting — plus diversity-spend credentials, where SC Fuels is at a disadvantage.'],
    ['AI Opportunity', 'RFP and bid auto-response turns days of assembly into hours, letting SC Fuels respond to more bids faster — speed and depth that counter the missing diversity wedge.'],
    ['Technijian Hook', 'My AI — RFP / bid response automation. My Dev — compliant reporting dashboards for awarded contracts.'],
  ]),
  spacer(160),

  subHeader('Emerging & Higher-Margin Segments'),
  personaCard('5 — The Sustainability / ESG Fleet Buyer', PASS, [
    ['Role', 'A port, public agency, or corporate fleet under pressure to cut carbon — a buyer of renewable diesel (R99) and biodiesel.'],
    ['Pain Points', 'Needs lower-carbon fuel without new equipment, plus clean carbon reporting to prove it.'],
    ['Decision Driver', 'A credible renewable-fuel supply and the documentation to back the sustainability claim.'],
    ['AI Opportunity', 'Authority content owns the renewable-diesel and LCFS questions in search and AI answers; targeting matches LCFS economics to the right accounts.'],
    ['Technijian Hook', 'My SEO — renewable-diesel / LCFS authority content. My AI — opportunity intelligence on which accounts to push R99.'],
  ]),
  spacer(160),

  personaCard('6 — The Lubricants & DEF Industrial Buyer', GOLD, [
    ['Role', 'A manufacturer or industrial operation buying lubricants, DEF, and chemicals — often alongside fuel.'],
    ['Pain Points', 'Wants one reliable supplier for fuel and lubricants; reorders and product selection are a manual chore.'],
    ['Decision Driver', 'Lower volume than the fuel accounts but higher margin — and a natural cross-sell from an existing fuel relationship.'],
    ['AI Opportunity', 'Share-of-wallet intelligence flags fuel accounts that should be buying lubricants and DEF; reorder automation captures the recurring lines.'],
    ['Technijian Hook', 'My AI — cross-sell and reorder intelligence. My SEO — lubricant and DEF product content.'],
  ]),
  spacer(200),

  p('Figure 6.0 maps each segment by account fuel volume and margin or strategic value — showing which buyers are the anchor accounts to defend and win, which are higher-margin niches, and which represent high-volume recurring revenue.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'SC Fuels Customer Segment Matrix', 580, 1.50),
  diagramCaption('Figure 6.0 — SC Fuels Customer Segments: Account Fuel Volume vs. Margin / Strategic Value'),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('SC Fuels competes against three different kinds of rival: the traditional digital leaders it should match (Mansfield and World Kinect/Flyers, which lead on content and fuel-data tooling), the digitally-invisible regionals it already out-resources (Hunt & Sons, Ramos, and most small players), and the digital-native disruptor it should learn from (Booster, whose app-first, AI-routed model shows what a modern fuel buyer experience looks like). The pattern across all of them is the opportunity: no one combines real scale with real AI in the West.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.2 },
      { label: 'Market', weight: 3 },
      { label: 'Posture vs. SC Fuels', weight: 4 },
    ],
    [
      ['World Kinect / Flyers', 'Global; Flyers covers the Western US (Auburn, CA)', 'The largest direct West Coast cardlock and lubricants rival; scale and capital, but a giant in which local accounts can feel small'],
      ['Mansfield Energy', 'National (Gainesville, GA); 3B+ gallons/yr', 'The digital benchmark — FuelNet portal, fuel-data analytics, daily market content; Georgia-centric, so the West is not its home turf'],
      ['Pinnacle Petroleum', 'Huntington Beach, CA — next door; 25 states', 'Closest local peer; woman-owned (WBE) diversity-spend wedge and tank monitoring; beatable on digital depth'],
      ['Ramos Oil', 'West Sacramento, CA; CA + NV', 'Minority-owned (MBE) diversity wedge and NorCal government ties; smaller, thinner SoCal presence, dated digital'],
      ['Hunt & Sons (Phillips 66)', 'Sacramento, CA; NorCal', 'NorCal cardlock specialist, now refiner-owned; digitally fragmented and weak — easy to out-modernize'],
      ['Star Oilco', 'Portland, OR; Pacific Northwest', 'Tiny, not a SoCal threat — but proof that content marketing works in this category, punching above its weight on SEO'],
      ['Booster', 'San Mateo, CA; major metros incl. CA', 'The digital-native disruptor: app-first mobile fueling with a named AI routing engine and Amazon/UPS customers; the experience bar to clear'],
      ['NextNRG (ex-EzFill)', 'Miami, FL; expanding into LA & SF', 'Mobile-fueling consolidator, but financially fragile — a cautionary tale on the model’s economics'],
    ],
  ),
  spacer(200),
  subHeader('Digital & AI Maturity Scorecard'),
  p('Stripping the field down to the digital fundamentals that drive modern buying shows the gap clearly — and shows that SC Fuels starts from a solid base, not behind.'),
  buildTable(
    [
      { label: 'Player', weight: 2.4 },
      { label: 'Modern Site', weight: 1.5, align: AlignmentType.CENTER },
      { label: 'Portal', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Content / SEO', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'AI', weight: 1.3, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.6 },
    ],
    [
      ['Mansfield', { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'Data', align: AlignmentType.CENTER }, 'Traditional digital leader'],
      ['World Kinect / Flyers', { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'Data', align: AlignmentType.CENTER }, 'Traditional digital leader'],
      ['Booster', { text: 'Yes', align: AlignmentType.CENTER }, { text: 'App', align: AlignmentType.CENTER }, { text: 'Good', align: AlignmentType.CENTER }, { text: 'Yes', color: PASS, align: AlignmentType.CENTER }, 'Digital-native benchmark'],
      ['Pinnacle', { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Partial', align: AlignmentType.CENTER }, { text: 'Light', align: AlignmentType.CENTER }, { text: 'No', color: CRITICAL, align: AlignmentType.CENTER }, 'Mid — beatable on depth'],
      ['Ramos / Hunt & Sons', { text: 'Dated', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Basic', align: AlignmentType.CENTER }, { text: 'Weak', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'No', color: CRITICAL, align: AlignmentType.CENTER }, 'Digitally invisible'],
      [{ text: 'SC Fuels (today)', bold: true }, { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Yes', align: AlignmentType.CENTER, color: PASS }, { text: 'Light', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Solid base, AI-blank', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field on the two axes that matter — scale and reach against digital and AI maturity. SC Fuels sits where no rival does: in the high-scale row, but below the leaders on AI. The move is straight up.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning Scale vs Digital-AI Maturity', 580, 1.50),
  diagramCaption('Figure 7.0 — Competitive Positioning: Scale / Reach vs. Digital & AI Maturity'),
  spacer(160),
  calloutBox(
    'Where SC Fuels Wins — The White Space',
    [
      'The "scale plus AI" corner is empty in the West. The digital leaders (Mansfield, World Kinect) do not have SC Fuels’ regional density and Pilot-backed supply; the digital natives (Booster) do not have its scale. SC Fuels can occupy a corner neither can reach.',
      'Local search demand is unclaimed: roughly fifteen branches and no per-city pages means real "[fuel service] + [city]" demand goes to whoever ranks. First to build location pages and answer-engine content captures it.',
      'Acquisitions are a growth lever competitors are not pursuing with AI: every book SC Fuels buys (Downs, Lutz, and the next) is a list to cross-sell and retain, not just absorb.',
      'The one structural disadvantage — no minority- or woman-owned (MBE/WBE) status for set-aside RFPs — is answered with speed and depth: RFP automation that lets SC Fuels respond to more municipal bids, faster, backed by Pilot-scale supply.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For a Pilot-backed market leader moving more than a billion gallons a year, the online presence materially under-represents the operation. The quality and scale of the business are far ahead of how it shows up in search and in AI answers — and closing that gap is the fastest early win.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Local / location pages', 'No per-city or per-branch pages across ~15 Western markets', 'Real "[fuel service] + [city]" demand goes uncaptured — a page per branch and service claims it'],
      ['Answer-engine presence', 'Effectively none', 'No content ranking in Google or cited by ChatGPT, Perplexity, and AI Overviews for fuel, renewable, or compliance questions'],
      ['Content engine', 'Thin, low cadence', 'Mansfield and even tiny Star Oilco out-publish SC Fuels; a renewable / LCFS / fuel-market hub would outrank both regionally'],
      ['Ownership / brand story', '"Family-owned" copy that predates the Pilot era', 'The Pilot- and Berkshire-backed scale is a selling point being left unused, and the stale story is a credibility and SEO liability'],
      ['Customer portal', 'Real self-serve portal (rebates, e-receipts, controls)', 'A strong base — extend it with an AI assistant and self-serve quoting toward the Booster experience bar'],
      ['AI in the buyer experience', 'None evident', 'Competitors (Booster) market AI; SC Fuels has none on the buyer-facing side — the clearest single gap'],
      ['Social presence', 'Modest (~5K LinkedIn followers) for the size', 'Under-weight for a 900-person, multi-state leader; a content engine feeds it'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making its existing scale and strengths visible, findable, and quotable.',
      'Per-branch location pages, a renewable / compliance content hub, and an AI-assisted portal are low-cost, compounding moves with fast SEO and credibility returns.',
      'These are also the natural first ninety days of the program: fix the foundation and the story, then build the engine on top of it.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('Before the growth program, one thing must be clear: Technijian has already built the systems SC Fuels needs. The platforms below are delivered and operating for real clients — not proposals. Each maps to a specific SC Fuels use case, with security and compliance built in rather than bolted on.'),
  spacer(160),

  capabilityBox(
    'Proven Build 1 — Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants.',
    'This is the engine that gets SC Fuels found: own "bulk diesel delivery [city]," "renewable diesel supplier," cardlock and DEF queries in both Google and AI answers, and build the per-branch location pages SC Fuels does not have today.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 2 — My AI Lead Gen: Account-Based Outbound',
    'My AI Lead Gen is Technijian’s productized outbound engine — harvest high-fit targets from public data, enrich and score them, and deliver outreach-ready personalized sequences — replacing the data-subscription tax of tools like ZoomInfo and Apollo.',
    'For the named-account track it builds the list of commercial fleets, contractors, ag operations, and municipal buyers worth winning by territory and fuel signal, with a per-account dossier for each rep visit — depth on the accounts SC Fuels already knows it wants, not a broad blast.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 3 — AI Document Intelligence (RFPs: Days to Minutes)',
    'Technijian deployed document intelligence for FINRA-registered broker-dealers that auto-populates complex due-diligence questionnaires, cutting RFP response from days to minutes with 60–80% less manual review.',
    'Pointed at municipal and large-fleet fuel bids, the same engine drafts and assembles RFP responses in hours instead of days — letting SC Fuels respond to more bids, faster, the speed-and-depth answer to rivals’ diversity-spend credentials.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 4 — AI-Native Custom App Delivery (My Dev)',
    'Technijian’s AI-native software lifecycle delivers custom web apps three to five times faster than traditional development — portals, dashboards, and integrations built around a client’s actual process.',
    'This builds the operational layer: an upgraded self-serve customer portal with an AI assistant and online quoting, predictive tank-monitoring and keep-full alerts, and the LCFS, RIN, and IFTA compliance automation that turns recurring paperwork into a scheduled job.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 5 — Local SEO + Review & Reputation Engine',
    'Technijian built an AI system that manages Google Business Profiles and requests, monitors, and responds to reviews across the local directories that search ranking depends on.',
    'Across SC Fuels’ fifteen-plus branches, complete and consistent Business Profiles and active reviews lift the local rankings that capture "[fuel service] + [city]" demand — and they are exactly the third-party signals AI assistants weigh when deciding whom to cite.'
  ),
);

// ---------- 10 HOW AI TRANSFORMS THE GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms SC Fuels’ Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get found for the demand that searches, win the named accounts worth winning, and run leaner so margin and service hold as demand shifts. The first motion captures broad search demand at scale; the second is account-based by design, aimed at the targets SC Fuels already knows; the third protects and compounds the base. Together they turn SC Fuels from a scale leader that is digitally quiet into the obvious, modern answer in its markets.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'SC Fuels AI Growth Engine', 600, 1.61),
  diagramCaption('Figure 10.0 — The Engine: Get Found, Account Intelligence & Outbound, and Internal Automation'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.7 },
      { label: 'Play', weight: 2.4 },
      { label: 'What It Does', weight: 3.1 },
      { label: 'Metric', weight: 1.7 },
      { label: 'Technijian Service', weight: 1.7 },
    ],
    [
      ['Get Found', 'Local + AEO search', 'Rank for "[fuel service] + [city]" and answer-engine queries', 'Organic leads / mo', 'My SEO'],
      ['Get Found', 'Location / branch pages', 'A page per branch and service across the Western footprint', 'Local rankings', 'My SEO'],
      ['Get Found', 'Authority content + GBP', 'Renewable / LCFS / fuel-market hub + reviews per branch', 'Citations, reviews', 'My SEO'],
      ['Account Intel', 'Account-based prospecting', 'Named fleet, construction, ag & municipal targets by territory', 'Qualified accounts / mo', 'My AI Lead Gen'],
      ['Account Intel', 'Trigger / signal monitoring', 'New permits, fleet expansions, posted RFPs, rival contract expiries', 'Triggered outreach', 'My AI'],
      ['Account Intel', 'RFP / bid auto-response', 'Draft and assemble municipal & large-fleet bids in hours', 'Bids submitted, win rate', 'My AI'],
      ['Account Intel', 'Dossiers + churn model', 'Pre-visit briefs for reps; flag declining-gallon accounts', 'Meetings, retained volume', 'My AI'],
      ['Run Leaner', 'Portal + AI chatbot', 'Self-serve orders, invoices, status, cardlock support 24/7', 'Self-serve rate', 'My Dev'],
      ['Run Leaner', 'Route & demand optimization', 'Forecast demand; optimize bulk and mobile delivery routes', 'Cost per delivery', 'My Dev'],
      ['Run Leaner', 'Predictive tank monitoring', 'Keep-full refills triggered before a tank runs dry', 'Run-dry events', 'My Dev'],
      ['Run Leaner', 'LCFS / RIN / IFTA automation', 'Automate carbon-credit, RIN, and fuel-tax reporting', 'Compliance hours saved', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'Local SEO, answer-engine content, and the portal get SC Fuels found and turn searchers into quotes and open accounts — most of that work is highly automatable.',
      'For the named commercial and municipal accounts, AI surfaces the right targets, times the outreach, and arms the rep — but the relationship, the on-site service promise, and Pilot-scale supply still close the contract.',
      'That honesty is the point: the plan captures broad demand at scale and makes the named-account effort sharper, without pretending software signs a fuel-supply contract on its own.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because SC Fuels’ internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 14 replace these assumptions with real baselines. The ROI logic holds across a wide range of inputs, because the two levers — net-new commercial accounts and retained or expanded volume on the existing base — are large relative to the program cost.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['New commercial accounts / quarter', 'Field-team limited', 'Inbound + account-based', 'More named wins'],
      ['Local search capture (per branch)', 'None (no location pages)', 'Ranking across markets', 'Local demand captured'],
      ['Answer-engine citations', 'None', 'Cited for fuel / renewable / compliance', 'Durable visibility'],
      ['RFP / bid turnaround', 'Manual, days', 'Drafted in hours', 'More bids, faster'],
      ['Cardlock / account churn', 'Reactive', 'Predicted and saved', 'Retained volume'],
      ['Compliance hours (LCFS / RIN / IFTA)', 'Manual', 'Automated', 'Hours recovered'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model (Estimated, Conservative Assumptions)'),
  buildTable(
    [
      { label: 'Model Input', weight: 3.4 },
      { label: 'Conservative', weight: 2.2 },
      { label: 'Target', weight: 2.2 },
      { label: 'Aggressive', weight: 2.2 },
    ],
    [
      ['Net-new commercial accounts (Y1)', '+6', '+12', '+24'],
      ['Est. annual gross profit per new account*', '$40,000', '$40,000', '$40,000'],
      ['Gross profit from new accounts', '+$240,000', '+$480,000', '+$960,000'],
      ['Retained + expanded volume (existing base)**', '+$80,000', '+$160,000', '+$320,000'],
      [{ text: 'Total additional annual gross profit', bold: true }, { text: '+$320,000', bold: true }, { text: '+$640,000', bold: true }, { text: '+$1,280,000', bold: true }],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$247,000', bold: true }, { text: '~$247,000', bold: true }, { text: '~$247,000', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '1.3x', bold: true, color: PASS }, { text: '2.6x', bold: true, color: PASS }, { text: '5.2x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* Placeholder annual gross profit per new commercial account, blended across small and large; calibrates to SC Fuels’ actual per-account economics in discovery. ** Modeled from churn prevented and share-of-wallet expansion (cardlock, lubricants, DEF) across the 11,000-account base. All figures projected on gross profit, not revenue, and not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Technijian Service Investment Map'),
  buildTable(
    [
      { label: 'Service', weight: 2.7 },
      { label: 'Scope', weight: 3.7 },
      { label: 'Monthly', weight: 1.4 },
      { label: 'Y1 Total', weight: 1.4 },
    ],
    [
      ['My SEO — SEO + AEO + Local', 'Multi-state local + answer-engine SEO, per-branch location pages, renewable / compliance content hub', '$2,500/mo', '$30,000'],
      ['My AI Lead Gen — Account Intelligence (Enterprise)', 'Named commercial / fleet / municipal prospecting, enrichment, dossiers, and RFP intelligence across the Western footprint', '$6,999/mo', '$84,000'],
      ['My AI — Fractional AI Advisor', 'AI program leadership, model governance, and implementation QA', '$2,000/mo', '$24,000'],
      ['My Dev — Managed App Services', 'Hosting, monitoring, and ongoing optimization of the portal and automations', '$1,200/mo', '$14,400'],
      ['My Dev — Custom Build (one-time, phased)', 'Portal + AI chatbot, RFP automation, and LCFS / IFTA compliance tooling', '—', '$90,000'],
      ['My AI — Executive AI Workshop (one-time)', 'Leadership alignment and roadmap', '—', '$5,000'],
      [{ text: 'YEAR-1 TOTAL INVESTMENT', bold: true }, { text: 'Recurring $12,699/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$247,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'Winning roughly six net-new commercial accounts in Year 1, at an estimated $40,000 gross profit each, covers most of the full program on its own — before counting a dollar of retained volume or efficiency.',
      'Local search demand is the cheapest demand to capture, and it compounds: once SC Fuels ranks and gets cited, leads arrive month after month with no per-click cost.',
      'The program is phased — start with the foundation and capture layer, prove the lead and bid flow, then scale account-based outreach and compliance automation — which lowers the entry point and de-risks the spend.',
    ],
    CORE_BLUE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence suited to a multi-state, regulated, enterprise operation: build the foundation first (local SEO, location pages, and the capture layer), then stand up the demand-and-intelligence engine (content, citations, the named-account list, and an RFP pilot), then scale outbound and automate compliance and operations. Meaningful inbound and bid speed are visible inside the first ninety days; the bigger automations are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'SC Fuels 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 12.0 — SC Fuels Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Get the digital base right and stand up the layer that turns visits into quotes and open accounts.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Local / AEO Foundation', 'Build the keyword and answer-engine question map. Ship technical SEO, schema, and the first per-branch location pages. Refresh the ownership and scale story so the Pilot-backed reality works for SC Fuels in search and on the page.'],
      ['1.2 — Capture Layer Live', 'Add an AI assistant and self-serve quoting / open-account flow to the existing customer portal, with source-tagged lead tracking so SC Fuels knows which queries and branches actually convert.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Demand & Intelligence Engine (Days 91–180)', { color: TEAL }),
  p('Publish the content that ranks and gets cited, and build the named-account intelligence base.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Content & Answer-Engine Engine', 'A renewable-diesel, LCFS, and fuel-market authority hub publishing on a steady cadence. First Google rankings for priority terms and first AI-assistant citations for the questions buyers ask.'],
      ['2.2 — Account Intelligence Base', 'My AI Lead Gen harvests the named commercial and municipal target lists by territory and fuel signal. First per-account dossiers to the field team, plus an RFP / bid-automation pilot and an at-risk-account churn model.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Compliance (Days 181–365)', { color: CORE_ORANGE }),
  p('Scale the account-based outreach, automate the heavy compliance work, and compound what is converting.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Account-Based Outreach at Scale', 'Personalized sequences running across the named universe; reps supported by dossiers and trigger alerts. RFP automation in production. New commercial accounts closing.'],
      ['3.2 — Compliance + Optimize', 'LCFS, RIN, and IFTA reporting automated. Route and predictive tank-monitoring optimization live. ROI dashboard delivered against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions SC Fuels can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Build One Location Page as a Template',
    ['Pick the largest branch and publish a single, complete location page — services, fuel types, service area, hours, and a quote request. It costs almost nothing, it will start ranking for "[fuel service] + [that city]," and it becomes the template for every other branch.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Claim and Complete Every Google Business Profile',
    ['Verify and fully complete the Google Business Profile for each branch — services, hours, photos, and categories. Commercial buyers and procurement officers do check, and complete profiles are free local visibility that also feed the AI answers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Publish One Renewable-Diesel / LCFS FAQ',
    ['Write a single plain-language page answering the questions ESG and fleet buyers actually ask: "Is R99 renewable diesel a drop-in for my fleet?", "How does it affect my LCFS position?" Almost no competitor has built this — it is the seed of content that gets cited in AI answers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Align the Ownership Story With Reality',
    ['Update the website copy so the Pilot- and Berkshire-backed scale works for SC Fuels instead of against it. "Backed by one of North America’s largest fuel companies" is a supply-security selling point — and it removes the credibility gap of a stale family-owned story.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Ask Five Anchor Accounts for a Case Study',
    ['Reach out to five long-standing commercial accounts and ask for a short quote about what the SC Fuels relationship removes from their week. Customer proof is the most persuasive asset in an account-based sale — and SC Fuels has already earned it.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with SC Fuels’ real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Account growth', 'Net-new commercial accounts per month today and field-sales headcount by territory', 'Calibrates the account-based outbound scope and ROI'],
      ['Account economics', 'Average annual gross profit per commercial account', 'Sets the primary revenue line in the ROI model'],
      ['Retention', 'Current churn rate on cardlock and commercial accounts', 'Baselines the retained-volume opportunity'],
      ['Compliance load', 'Hours and cost spent today on LCFS, RIN, and IFTA reporting', 'Sizes the Tier-3 automation payback'],
      ['Systems', 'CRM and billing / back-office systems in use', 'Defines the integration surface for funnels and automation'],
      ['Footprint', 'Exact branch count, states, and renewable-diesel share of volume', 'Scopes the location-page build and the ESG / LCFS opportunity'],
      ['Marketing', 'Who owns web / marketing today, current spend, and the relationship to Pilot’s central marketing', 'Determines where the SEO and content work plugs in'],
      ['Sponsor', 'Whether the engagement buyer is SC Fuels’ own leadership or routed through Pilot', 'Shapes the sales motion and approval path'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on SC Fuels’ real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('SC Fuels already has the hard things: scale, supply security, a multi-channel offer, an installed base of more than eleven thousand accounts, and the backing of one of North America’s largest fuel companies. What it has not yet done is convert that lead into a digital and AI advantage — and the corner of the market where scale meets AI is still open in the West.'),
  p('The opportunity is concrete: buyers are already searching for what SC Fuels sells, named accounts and municipal contracts are won by a field team that AI can multiply, and the heavy compliance and operations work is exactly what automation removes. A focused, hybrid program captures the search demand, sharpens the account-based effort, and protects margin — without pretending software replaces the rep who closes the deal.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope and sponsor.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the local / AEO foundation, the first location pages, and the AI-assisted capture layer — live inside 30 days of signature.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
      borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to own the corner where scale meets AI?', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional businesses compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for SC Fuels', weight: 5 }],
    [
      ['My SEO', 'Local and answer-engine SEO — ranking in Google and getting cited by AI assistants — plus per-branch location pages and the renewable / compliance content hub that make SC Fuels findable across its Western markets'],
      ['My AI Lead Gen', 'Account-based outbound that harvests, enriches, and sequences the named commercial and municipal accounts worth winning — supporting the field team, not replacing it'],
      ['My AI', 'AI strategy and builds — RFP automation, churn and demand intelligence, and LCFS / RIN / IFTA compliance automation, with governance and security throughout'],
      ['My Dev', 'Custom, AI-native builds — the AI-assisted customer portal, online quoting, predictive tank monitoring, and the dashboards that run the program'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '(949) 379-8500'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted May 22, 2026. Firmographic details (founding year, employee count, gallon volume, ownership, and acquisition history) are drawn from public sources and company materials and should be confirmed with SC Fuels before external use. No internal revenue figure is cited, as reliable public figures do not exist for a private subsidiary.', { italics: true }),
  spacer(120),
  p('1. SC Fuels — official website: scfuels.com (Home, About Us, Industries, Services, Fleet Cards / Cardlock, Fuel Management, Contact)', { size: 20 }),
  p('2. SC Fuels — customer portal: customerportal.scfuels.com', { size: 20 }),
  p('3. Pilot Company — newsroom: SC Fuels acquires Downs Energy cardlock, fueling, and lubricants assets (2025); SC Fuels as a wholly owned subsidiary of Pilot Travel Centers LLC', { size: 20 }),
  p('4. CSP Daily News & Convenience Store News — "Pilot Co. Acquires SC Fuels" (2021); Matrix Capital Markets Group — Southern Counties Oil Co., L.P. transaction', { size: 20 }),
  p('5. Competitors — World Kinect / Flyers Energy (world-kinect.com, flyersenergy.com), Mansfield Energy (mansfield.energy), Pinnacle Petroleum (pinnaclepetroleum.com), Ramos Oil (ramosoil.com), Hunt & Sons (huntnsons.com), Star Oilco (staroilco.net), Booster (boosterusa.com), NextNRG / EzFill (NASDAQ filings)', { size: 20 }),
  p('6. Cardlock networks — Pacific Pride (pacificprideusa.com); CFN (Commercial Fueling Network)', { size: 20 }),
  p('7. Regulatory — California Air Resources Board, Low Carbon Fuel Standard (ww2.arb.ca.gov); EPA Renewable Fuel Standard / RINs; IFTA; CA State Water Resources Control Board UST program', { size: 20 }),
  p('8. Industry — Matrix Capital Markets 2024/2025 fuels distribution M&A review; EIA gasoline consumption data; IEA Global EV Outlook 2025; fleet fuel fraud and telematics industry sources', { size: 20 }),
  p('9. Technijian service pricing — My SEO, My AI, My AI Lead Gen (Starter $1,499 / Professional $3,499 / Enterprise $6,999), and My Dev rate cards', { size: 20 }),
);

// =====================================================================
// DOCUMENT ASSEMBLY
// =====================================================================
const doc = new Document({
  numbering: { config: [{
    reference: NUM_BULLETS,
    levels: [{
      level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } },
    }],
  }]},
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD },
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD },
        paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

const OUT_PATH = path.join(__dirname, 'SC-Fuels-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
