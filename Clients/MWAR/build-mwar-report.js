// Monaco Wheel Restoration — AI-Driven Business Development Blueprint
// Technijian-branded DOCX report builder
// Reads brand-tokens.json for all brand values

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
const PURPLE        = '7B2D8B';
const GOLD          = 'D4A017';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const DIAGRAM_PERSONAS_BUF  = fs.existsSync(path.join(DIAGRAMS_DIR, 'personas.png'))  ? fs.readFileSync(path.join(DIAGRAMS_DIR, 'personas.png'))  : null;
const DIAGRAM_ARCH_BUF      = fs.existsSync(path.join(DIAGRAMS_DIR, 'architecture.png')) ? fs.readFileSync(path.join(DIAGRAMS_DIR, 'architecture.png')) : null;
const DIAGRAM_TIMELINE_BUF  = fs.existsSync(path.join(DIAGRAMS_DIR, 'timeline.png'))  ? fs.readFileSync(path.join(DIAGRAMS_DIR, 'timeline.png'))  : null;

const TODAY = '2026-05-19';

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
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })],
  });
}
function pRuns(runs, opts = {}) {
  const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })),
  });
}

function sectionHeader(text, color = CORE_BLUE, num = '', { newPage = false } = {}) {
  const label = num ? `${num}  ${text}` : text;
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    keepNext: true,
    spacing: { before: 0, after: 120, line: 240 },
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
    keepNext: true,
    keepLines: true,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    keepNext: true,
    spacing: { before: 220, after: 80 },
    children: [new TextRun({ text, size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })],
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
    keepNext: true,
    keepLines: true,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })],
  });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({
    keepNext: i < bodyArr.length - 1,
    keepLines: true,
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
    margins: { top: 200, bottom: 200, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 56, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 18, color: BRAND_GREY, font: FONT_BODY })] }),
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
    children: [
      new TableCell({
        columnSpan: 2,
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })],
      }),
    ],
  });
  const fieldRows = fields.map(([label, value], i) => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 2200, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 2200, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2200, CONTENT_W - 2200],
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Monaco: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  return new Header({
    children: [
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2400, CONTENT_W - 2400],
        borders: noBorders,
        rows: [new TableRow({ children: [
          new TableCell({
            borders: noBorders,
            children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })],
          }),
          new TableCell({
            borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
            verticalAlign: VerticalAlign.BOTTOM,
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Business Development Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
          }),
        ]})],
      }),
    ],
  });
}

function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80 },
        children: [
          new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
          new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
        ],
      }),
    ],
  });
}

// =====================================================================
// DOCUMENT BODY
// =====================================================================

const docChildren = [];

// ---------- COVER PAGE ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(400),
  // Orange divider
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'MONACO WHEEL RESTORATION', size: 72, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Business Development Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Costa Mesa, California  |  monacowr.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Monaco Wheel Restoration', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TABLE OF CONTENTS ----------
docChildren.push(
  new TableOfContents('Table of Contents', {
    hyperlink: true,
    headingStyleRange: '1-2',
  }),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '13', label: 'Years of Precision Craftsmanship', color: CORE_BLUE },
    { number: '100K+', label: 'Wheels Repaired by Hand', color: CORE_ORANGE },
    { number: '4.9★', label: 'Yelp Rating — Costa Mesa', color: TEAL },
    { number: '2+', label: 'Markets: OC & Expanding', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Monaco Wheel Restoration is Orange County\'s premier wheel repair and auto restyling destination — a 13-year-old business built on hand-craftsmanship, same-day speed, and a 4.9-star reputation across 200+ reviews. Owner Javon has grown the operation from a dealer-focused service into a thriving direct-retail brand serving luxury vehicle owners, Tesla drivers, and body shops across the region.'),
  p('The opportunity in front of Monaco is significant: the shop currently operates at roughly 40–48% of daily capacity, with 10–12 wheels repaired on an average day against a maximum of 20–30. Closing even part of that gap is worth six figures a year — at the blended average ticket, lifting from today\'s ~11 wheels/day toward 60–75% capacity represents on the order of $150,000–$300,000 in annual revenue waiting to be captured — not through more technicians or equipment, but through smarter demand generation.'),
  p('This blueprint maps exactly how an AI-driven program — powered by Technijian\'s proven platforms — fills that capacity gap through three engines: dominating local search in Orange County and San Clemente, converting every interaction into a loyal returning customer, and automating the operational tasks that currently consume Javon\'s time.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Monaco runs at ~40% capacity on an average day. The constraint is not supply — it\'s demand.',
      'Two additional wheels per day, at the blended average ticket of $140, generates $73,920 in annual revenue.',
      'The Technijian AI program is designed to deliver that lift — and more — within the first 90 days.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 02 SERVICE ARCHITECTURE & PRICING ----------
docChildren.push(
  ...sectionHeader('Service Architecture & Pricing', CORE_BLUE, '02'),
  spacer(100),
  p('Monaco Wheel Restoration offers a full range of precision wheel and auto restyling services, from same-day curb rash repair to full vehicle wraps. The pricing structure positions Monaco competitively in the premium tier — well above mobile-only budget competitors, with a clear quality story to match.'),
  spacer(120),
  buildTable(
    [
      { label: 'Service', weight: 3 },
      { label: 'Format', weight: 2 },
      { label: 'Price', weight: 2 },
      { label: 'Key Differentiator', weight: 3 },
    ],
    [
      ['Wheel Repair', 'In-Shop', '$125 / wheel', 'Same-day turnaround, precision color match'],
      ['Wheel Repair', 'Mobile', '$150–$175 / wheel', 'Technician comes to you — home, office, or dealer lot'],
      ['Brake Caliper Painting', 'In-Shop or Mobile', '$750', 'Heat-resistant coating, custom color to spec'],
      ['Chrome Delete', 'In-Shop', '$600–$1,599', 'Full or partial chrome-to-black / color transformation'],
      ['Vehicle Wrap', 'In-Shop', '$2,400–$5,000', 'Full and partial wraps — showroom quality finish'],
      ['Custom Wheel Finishes', 'In-Shop', 'Quote-based', 'Powder coat, gloss, matte, two-tone combinations'],
    ],
  ),
  spacer(160),
  subHeader('Revenue Architecture'),
  p('Monaco\'s service mix creates a natural upsell ladder. A customer who starts with a $125 wheel repair is a strong candidate for a caliper paint ($750) or chrome delete ($600+) on the same visit. The AI growth program includes an automated upsell prompt engine that identifies combo opportunities — increasing average ticket size by an estimated 12–18% without additional marketing spend.'),
  spacer(100),
  buildTable(
    [
      { label: 'Revenue Stream', weight: 3 },
      { label: 'Est. Monthly Volume', weight: 2 },
      { label: 'Est. Monthly Revenue', weight: 2 },
    ],
    [
      ['Wheel repair (in-shop, ~70% of volume)', '~168 wheels', '~$21,000'],
      ['Wheel repair (mobile, ~30% of volume)', '~72 wheels', '~$11,664'],
      ['Brake caliper painting', '~6 jobs', '~$4,500'],
      ['Chrome delete', '~3 jobs', '~$3,300'],
      ['Vehicle wraps', '~1–2 jobs', '~$5,550'],
      [{ text: 'TOTAL ESTIMATED MONTHLY REVENUE', bold: true }, { text: '', bold: true }, { text: '~$46,000', bold: true, color: CORE_BLUE }],
    ],
  ),
);

// ---------- 03 THE TWO-MARKET OPPORTUNITY ----------
docChildren.push(
  ...sectionHeader('The Two-Market Opportunity', TEAL, '03'),
  spacer(100),
  p('Monaco\'s growth strategy is built on a dual-brand model — two distinct identities serving two distinct geographic communities, powered by the same operational team and quality standards. This approach is not just a geographic expansion play; it is a local dominance strategy.'),
  spacer(120),
  buildTable(
    [
      { label: 'Brand', weight: 3 },
      { label: 'Market', weight: 2 },
      { label: 'Primary Model', weight: 2 },
      { label: 'Status', weight: 2 },
      { label: 'Strategic Goal', weight: 3 },
    ],
    [
      ['Monaco Wheel Restoration', 'Orange County (Costa Mesa + surrounding)', 'Shop + mobile', 'Active — 13 years', 'Capture full capacity; dominate OC Map Pack'],
      ['San Clemente Wheel Repair', 'San Clemente + South OC', 'Mobile-first', 'Planned launch', 'Become the #1 wheel brand in San Clemente within 90 days'],
    ],
  ),
  spacer(200),
  calloutBox(
    'Why San Clemente Is the Right Move',
    [
      'San Clemente has zero dominant wheel repair brands. The current leader, Rim Revival Mobile, has only 68 Yelp reviews — less than one-third of Monaco\'s Costa Mesa count.',
      'A systematically launched Google Business Profile + review generation program can make San Clemente Wheel Repair the top-ranked wheel repair in the city within the first 90 days.',
      'This is the same playbook that built Monaco\'s Costa Mesa reputation — applied to a wide-open market where Javon has deep personal community roots.',
    ],
    TEAL
  ),
  spacer(160),
  subHeader('Shared Infrastructure Advantage'),
  p('The two-brand model does not require two separate teams or shops. The same technicians, same equipment, and same quality standards serve both markets under separate brand identities. This means:'),
  bullet('Two Google Business Profiles accumulating reviews independently'),
  bullet('Two Yelp listings ranking for different geographic search queries'),
  bullet('Two local SEO tracks ("wheel repair Costa Mesa" vs. "wheel repair San Clemente")'),
  bullet('One operational team — zero additional overhead for the first brand expansion'),
  bullet('Cross-market referrals: a San Clemente customer who moves to OC already knows Monaco'),
);

// ---------- 04 CUSTOMER PERSONAS ----------
docChildren.push(
  ...sectionHeader('The Monaco Customer', CORE_ORANGE, '04'),
  spacer(100),
  p('Monaco serves a distinct cross-section of Southern California car culture — from luxury vehicle owners protecting five-figure wheel investments to practical lease drivers managing end-of-term penalties. Each persona represents a specific growth lever for the AI program.'),
  spacer(160),

  // Persona 1
  personaCard('1 — The Luxury & Performance Vehicle Owner', CORE_BLUE, [
    ['Role', 'Owner of high-end vehicles — BMW, Mercedes, Porsche, Range Rover, Ferrari. Wheels are part of the car\'s identity.'],
    ['Pain Points', 'A single curb rash on a $3,000 wheel ruins the look of a $100K car. Expects perfection. Will not accept "good enough."'],
    ['Decision Driver', 'Quality over price. Wants the job done right the first time by someone who understands what they\'re protecting.'],
    ['AI Opportunity', 'Premium before/after content on Instagram validates the quality story before they call. AEO content captures "luxury wheel repair [city]" queries.'],
    ['Technijian Hook', 'My SEO — targeted keyword content for luxury vehicle search terms. My AI — social content engine generating before/after posts automatically.'],
  ]),
  spacer(160),

  // Persona 2
  personaCard('2 — The Tesla Owner', CORE_ORANGE, [
    ['Role', 'Tesla Model 3, Y, S, or X owner. Orange County and coastal Southern California have a notably high concentration of Tesla and EV owners.'],
    ['Pain Points', 'Large-diameter, low-profile EV wheels are easy to curb-rash in tight OC parking, and replacement Tesla wheels are expensive — making quality repair a clear money-saver over replacement.'],
    ['Decision Driver', 'Wants a specialist who knows EV wheels — not a generic rim shop. Will pay a premium for someone who has worked on Teslas before.'],
    ['AI Opportunity', '"Tesla wheel repair [city]" is an underserved search term with high intent. Owning this keyword cluster captures a sizable, repeat-prone customer segment.'],
    ['Technijian Hook', 'My SEO — "Tesla wheel specialist" AEO content strategy. My Dev — Tesla-specific quote flow on website.'],
  ]),
  spacer(160),

  // Persona 3
  personaCard('3 — The Lease-Return Preparer', TEAL, [
    ['Role', 'Leasing a BMW, Audi, or Mercedes and approaching the end of term — typically 6–18 months out. Curb rash on any wheel triggers excess wear fees.'],
    ['Pain Points', 'Lease-end fees for wheel damage can run $200–$500 per wheel. Repairing at $125/wheel is a clear financial win.'],
    ['Decision Driver', 'Cost avoidance. They need a receipt and a clean result to present at turn-in. Speed matters — they often wait until the last 30 days.'],
    ['AI Opportunity', 'Seasonal urgency content ("lease return season" — typically Q1 and Q3) + retargeting ads for OC luxury lease demographics.'],
    ['Technijian Hook', 'My SEO — "avoid lease-end wheel fees" content. My AI — seasonal email/SMS campaign to past customers approaching typical 36-month lease cycles.'],
  ]),
  spacer(160),

  // Persona 4
  personaCard('4 — The Dealer Service Manager', DARK_CHARCOAL, [
    ['Role', 'Service director or lot manager at an automotive dealership. Responsible for vehicle prep, trade-in reconditioning, and transport damage repair.'],
    ['Pain Points', 'Wheels arrive damaged from transport, or get curb-rashed during test drives and lot moves. Need a fast, reliable vendor who works on the dealer\'s timeline.'],
    ['Decision Driver', 'Volume consistency and turnaround reliability. Price matters, but a vendor who shows up when they say they will is worth more than a $10 savings per wheel.'],
    ['AI Opportunity', 'Automated dealer account outreach + monthly performance reports showing turn time, volume, and savings vs. alternative vendors.'],
    ['Technijian Hook', 'My AI — dealer outreach and account management automation. My Dev — dealer portal for scheduling and job tracking.'],
  ]),
  spacer(160),

  // Persona 5
  personaCard('5 — The Body Shop Partner', CHARTREUSE, [
    ['Role', 'Owner or estimator at an independent auto body shop. Sends wheel work to Monaco rather than buying equipment to do it in-house.'],
    ['Pain Points', 'Every repair job that touches a wheel is a potential revenue leak if they can\'t complete it in-house. Needs a sub-contractor who makes them look good.'],
    ['Decision Driver', 'Reliability + quality. A body shop\'s reputation rides on every referral they send out. They need a wheel partner they trust completely.'],
    ['AI Opportunity', 'Automated weekly check-in + volume incentive program builds loyalty. A referral tracking system shows body shops their contribution to Monaco\'s pipeline.'],
    ['Technijian Hook', 'My Dev — partner portal and referral tracking. My AI — automated relationship-maintenance messaging.'],
  ]),
  spacer(160),

  // Persona 6
  personaCard('6 — The San Clemente Local', PURPLE, [
    ['Role', 'San Clemente resident — surfer, commuter, or small business owner. Drives a truck, Jeep, Tesla, or daily driver. Values local businesses over chains.'],
    ['Pain Points', 'San Clemente\'s narrow streets and beach parking create constant curb rash. No trusted, local wheel specialist exists today.'],
    ['Decision Driver', 'Community trust and convenience. Wants mobile service that comes to the beach lot or their home in town.'],
    ['AI Opportunity', 'Hyper-local Google Map Pack ranking for "wheel repair San Clemente." Community-first social content featuring local landmarks and car culture.'],
    ['Technijian Hook', 'My SEO — San Clemente geo-targeted local SEO and GBP optimization. My AI — community content engine featuring SC-specific imagery.'],
  ]),
  spacer(200),

  p('Figure 4.0 below maps each persona by service frequency (how often they need wheel repair per year) and average revenue per visit — illustrating which segments drive the most immediate growth opportunity.', { italics: true, color: BRAND_GREY }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Monaco Customer Personas — Frequency vs. Revenue', 580, 1.50),
  diagramCaption('Figure 4.0 — Monaco Customer Segments: Service Frequency vs. Revenue per Visit'),
);

// ---------- 05 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '05'),
  spacer(100),
  p('The Orange County and San Clemente wheel repair markets are served by a mix of mobile-only operators and shop-based services. Monaco\'s strongest competitive advantage — 13 years of established trust, a 4.9-star Yelp rating, and the ability to do complex restyling work that mobile-only competitors cannot — is currently underrepresented in the digital landscape.'),
  spacer(140),

  subHeader('Orange County Market', { color: CORE_BLUE }),
  buildTable(
    [
      { label: 'Competitor', weight: 2.5 },
      { label: 'Reviews', weight: 1.5 },
      { label: 'Hours', weight: 2 },
      { label: 'Model', weight: 1.5 },
      { label: 'Key Gap vs Monaco', weight: 2.5 },
    ],
    [
      ['Orange Coast Mobile Wheel Repair', '255 Yelp', 'Unknown', 'Mobile-only', 'Shop services unavailable; no complex restyling'],
      ['SoCal Auto Touch Up', 'Unknown', 'Same/next-day', 'Mobile-only', '$139 flat price signals budget positioning; no wraps/chrome'],
      ['Resurrect Wheel Recon', 'Unknown', 'Unknown', 'Mobile-only', '25+ years but older brand; likely limited digital presence'],
      ['Steve\'s Mobile Wheel Repair', '140 Yelp', 'Mon–Sun 8–6', 'Mobile-only', 'Open weekends (Monaco is not); no shop or restyling capability'],
      ['Metalworks & Tire Place', 'Unknown', 'Same-day', 'Shop', 'Powder coat focus; no mobile option; Santa Ana location'],
    ],
  ),
  spacer(200),

  subHeader('San Clemente Market', { color: TEAL }),
  buildTable(
    [
      { label: 'Competitor', weight: 3 },
      { label: 'Reviews', weight: 1.5 },
      { label: 'Hours', weight: 2 },
      { label: 'Model', weight: 1.5 },
      { label: 'Gap', weight: 2 },
    ],
    [
      ['Rim Revival Mobile Wheel Restoration', '68 Yelp', 'Mon–Sun 8–5', 'Mobile-only', 'Only 68 reviews — not a dominant brand. No shop, no restyling.'],
      ['Fix Auto San Clemente', 'Unknown', 'Business hours', 'Shop (autobody primary)', 'Autobody first; wheels are secondary offering, not specialized.'],
    ],
  ),
  spacer(200),

  calloutBox(
    'The AI Differentiation Gap — Where Monaco Wins',
    [
      'No competitor in either market has a systematized AI-powered digital presence. None appear to have review automation, content engines, or AI-driven booking flows.',
      'Monaco\'s quality ceiling (complex restyling, wraps, chrome delete) is unreachable by mobile-only operators. This premium capability is the story AI can amplify.',
      'San Clemente is a genuinely open market. Rim Revival\'s 68 reviews represent a solvable problem — not a moat. Monaco can become the #1 wheel brand in San Clemente within 90 days of launch.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '06'),
  spacer(100),
  p('Monaco has built genuine trust through craft and service — 13 years of it. The gap is not in the work; it is in how loudly the work speaks online. The current digital presence captures a fraction of the demand this business has the capacity to serve.'),
  spacer(140),

  buildTable(
    [
      { label: 'Digital Channel', weight: 3 },
      { label: 'Current State', weight: 3 },
      { label: 'Gap / Opportunity', weight: 4 },
    ],
    [
      ['Google Business Profile (OC)', 'Active listing, shop address', 'Review velocity unknown; GBP posts likely inconsistent; Q&A unanswered'],
      ['Yelp (Costa Mesa)', '4.9★, 222 reviews', 'Strong but not growing fast; no automated post-service review asks'],
      ['Yelp (Las Vegas)', '47 reviews', 'Under-indexed vs. OC location; same gap'],
      ['Google Business Profile (San Clemente)', 'Does not yet exist', 'Zero digital footprint in target market — launch is Day 1'],
      ['Yelp (San Clemente)', 'Does not yet exist', 'Rim Revival has 68 reviews; Monaco can surpass this in 60–90 days'],
      ['Instagram (@monacowheel)', 'Active — before/after content', 'Manual posting; no content calendar; engagement not systematized'],
      ['Website (monacowr.com)', 'Live', 'Booking friction — 75% of customers still call or text; no AI quote flow'],
      ['Online booking', '25% of volume', '75% of leads require phone handling — capacity constraint for Javon'],
    ],
  ),
  spacer(200),

  subHeader('The Booking Bottleneck'),
  p('Three out of every four customers contact Monaco by phone or text. This means Javon (or staff) answers every quote request, schedule question, and follow-up manually — during business hours, Monday through Friday. Every inquiry that arrives after 6pm or on a weekend is either handled late or lost entirely to a competitor who picks up.'),
  spacer(100),
  calloutBox(
    'Booking Gap = Revenue Gap',
    [
      '75% of bookings require a human touchpoint. At 10–12 wheels per day, that\'s roughly 20+ phone/text interactions daily.',
      'Every after-hours inquiry that goes unanswered is a potential job that books with Steve\'s Mobile (open 7 days) or Rim Revival the next morning.',
      'An AI-powered quote and scheduling system handles after-hours, weekends, and simultaneous inquiries — converting leads that currently slip through.',
    ],
    CORE_ORANGE
  ),
  spacer(160),

  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a local car owner asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox(
    'Prompt: "Best mobile wheel repair near San Clemente?"',
    [
      'TODAY — the AI assistant answers with whichever shops have the strongest content and review signals it can read: it names a couple of mobile operators that have built up reviews, and does NOT mention a Monaco / San Clemente Wheel Repair brand — because there is no San Clemente listing, page, or reviews for it to cite yet. Monaco is invisible at the exact moment a local is choosing who to call.',
      'AFTER the program — the same query surfaces San Clemente Wheel Repair as a cited option ("San Clemente Wheel Repair offers mobile curb-rash and refinishing with same-day service and strong local reviews…"), with the Google Business Profile, before/after content, and reviews as the supporting evidence the assistant points to.',
    ],
    CORE_ORANGE
  ),
  p('(Illustrative of current AI-search behavior for this query class; the live result would be captured as the baseline at kickoff.)', { italics: true, size: 18 }),
  spacer(160),

  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('Local search and AI-search visibility compound, and they reward whoever builds first. Every month San Clemente Wheel Repair does not exist online, the map pack and the AI assistants learn to answer "wheel repair near me" with someone else — and that default, once set, is harder and more expensive to dislodge than to claim now while Rim Revival sits at only 68 reviews and no brand owns the city. The same is true for the after-hours gap: every unanswered weekend text is a job that books with a 7-day competitor and a customer relationship that starts with someone else. The cost of waiting is not zero — it is a competitor becoming the default answer in a market that is still open today.'),
);

// ---------- 07 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '07'),
  spacer(100),
  p('Before presenting the AI growth program, it is important to establish one thing: Technijian has already built exactly what Monaco needs. The following four proven platforms are not proposals — they are delivered systems, operating for real clients today. Each maps directly to a Monaco growth opportunity.'),
  spacer(160),

  capabilityBox(
    'Proven Build 1 — Multi-Agent Local SEO & AEO Platform',
    'Technijian built a multi-agent SEO system combining Claude, GPT-4o, and Gemini with SEMrush, Google Analytics, and Perplexity — automating content production, Google Business Profile optimization, and AI-citation positioning for service businesses.',
    'Applied to Monaco: a weekly cadence of geo-targeted content ("wheel repair Costa Mesa", "Tesla wheel specialist Orange County", "wheel repair San Clemente") builds Google Map Pack dominance in both markets. AEO content positions Monaco as the AI-cited answer to "best wheel repair in [city]" queries.'
  ),
  spacer(140),

  capabilityBox(
    'Proven Build 2 — AI Review Velocity & Reputation System',
    'Technijian deployed an automated post-service review request system — triggered by job completion — that sends a personalized SMS with a one-tap review link to each customer, growing Yelp and Google ratings at 3–5× the organic rate.',
    'Applied to Monaco: every completed wheel repair automatically triggers a review request. At 240 wheels per month, this generates a systematic review pipeline. For the San Clemente launch, this mechanism can produce 50+ reviews in the first 60 days — surpassing Rim Revival\'s 68-review total rapidly.'
  ),
  spacer(140),

  capabilityBox(
    'Proven Build 3 — AI Social Content Engine (Before/After Automation)',
    'Technijian built a visual content pipeline that takes technician photos of completed jobs, applies brand-consistent formatting, generates caption copy optimized for platform algorithms, and schedules posts across Instagram, TikTok, and Facebook — without manual effort.',
    'Applied to Monaco: every repaired wheel is already a piece of content. The before/after format is the most-shared format in the auto-enthusiast space. An automated pipeline converts every job into a published post — building the @monacowheel following systematically rather than manually.'
  ),
  spacer(140),

  capabilityBox(
    'Proven Build 4 — AI-Powered Booking, Quote & After-Hours Capture',
    'Technijian built an AI chatbot and SMS intake system that handles customer inquiries outside business hours, qualifies jobs with a photo-based quote flow, and slots bookings into the shop calendar without human intervention.',
    'Applied to Monaco: a customer texts a photo of their wheel damage at 9pm Saturday. The AI responds with a quote range, asks for their location and preferred time, and confirms the appointment. Javon arrives Monday with a full schedule — and zero lost weekend leads. This single system addresses Monaco\'s biggest unmonitored revenue gap.'
  ),
  spacer(140),

  capabilityBox(
    'Proven Build 5 — My AI Lead Gen: Automated Outbound Prospecting',
    'Technijian\'s My AI Lead Gen platform automates the full outbound prospecting cycle: identify high-fit B2B targets from public data (dealer inventory systems, fleet operator directories, collision shop listings), draft AI-personalized outreach sequences in the client\'s voice, and manage follow-up cadences until a reply or a booked call — all without manual effort.',
    'Applied to Monaco: Technijian runs a dealer and fleet outreach program targeting Orange County and Las Vegas new-car dealers who accumulate wheel damage from lot moves and test drives. AI-personalized emails go out from Javon\'s inbox, with automated Day 3 and Day 7 follow-ups. Positive responses are flagged for Javon to close personally. Secondary sequences target fleet managers and corporate accounts. Goal: 2 new wholesale dealer accounts within 60 days; 8+ by end of Year 1 — adding an estimated $8,000–$12,000 per month in B2B revenue at volume pricing.'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across content, reviews, and outreach: won\'t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass on customer-facing copy, the trickiest quote and outreach decisions, deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — before/after captions, review replies, dealer outreach personalization, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, photo tagging, extracting details from inbound texts, enriching dealer lists', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Monaco pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. For example, a single before/after social post is drafted by a low-cost model, tightened by a mid model, and given a final brand-voice pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 08 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Monaco Wheel & Rim Leadership', CORE_BLUE, '08'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Monaco sits today, how to adopt it without risk, and what comparable businesses are already doing. The goal is that Javon and the Monaco team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn\'t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a business owner needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "text the customer a review link the moment a job is marked complete." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch incoming texts overnight and draft quotes for the morning." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic\'s guidance on building AI systems) is to use the simplest thing that works. Monaco starts with simple automations that pay off in the first 30 days, and adds more autonomous behavior only where the value is proven — which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Monaco Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run small businesses — including Monaco — sit at the first or second rung of the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Monaco Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      [{ text: '1. Foundational', bold: false }, 'Little or no AI; manual, people-dependent processes — phone, text, and memory', ''],
      [{ text: '2. Emerging', bold: true }, { text: 'A few digital tools are in place (website, Instagram, Yelp) but AI is not yet woven into how leads are won or jobs are run', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — local search, reviews, booking, content — with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and operations with dashboards and a clear owner', ''],
      ['5. Transformational', 'AI is the default way the business runs and competes', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Monaco is a strong Emerging business — a real brand, an active Instagram, and a 4.9-star Yelp reputation. This report is the plan to reach Operational — AI working in the growth engine and inside the shop — within 90 days, not years.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Owner Manages', { color: CORE_BLUE }),
  p('The U.S. government\'s NIST AI Risk Management Framework gives owners a simple mental model — Govern, Map, Measure, Manage. For a customer-facing business like Monaco, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer — like quoting the wrong price', 'Human-in-the-loop review on anything customer-facing or money-bound — AI drafts the quote, a person confirms before it is sent'],
      ['Data leakage', 'Customer contact info pasted into public tools can escape', 'Private, governed AI deployments — customer phone numbers, photos, and booking details never touch a public model'],
      ['Brand & accountability', 'Off-brand or untracked AI replies erode the trust Monaco earned', 'Every AI tool inventoried with an owner and brand-voice rules — and led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Businesses Are Already Doing', { color: CORE_BLUE }),
  bullet('Local auto-services shops: detailers and tire shops are automating post-service review requests to climb the Google Map Pack — turning every finished job into a ranking signal competitors never capture.'),
  bullet('Mobile service brands: home-service and mobile-repair operators are using AI to answer and quote after-hours inquiries, capturing weekend demand that used to go to voicemail.'),
  bullet('Visual trades: businesses whose work is inherently photogenic (body shops, landscapers, restylers) are running automated before/after content engines to grow social reach without a marketing hire.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Monaco\'s own numbers would be confirmed as the program runs. Technijian\'s specific builds appear in Section 07 (Capability Proof) and the impact is modeled in Section 10.', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — Javon and the Monaco Front Desk', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A customer texts a photo of a curb-rashed wheel at 9pm on Saturday. The message sits unanswered until Monday; by then they have booked with a competitor who is open weekends. Javon spends his mornings returning calls, re-quoting the same jobs, and chasing reviews by hand — three out of four bookings still run through a manual phone or text exchange.',
    'WITH AI: The Saturday text gets an instant, on-brand reply with a quote range and a booking slot; Monday\'s schedule is already half-full. The moment a job is marked done, the customer gets a one-tap review link, and the finished wheel becomes a scheduled before/after post. Javon reviews and approves — the expertise is captured in a system, so the same standard holds whether it is Costa Mesa or the new San Clemente brand.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but Monaco assembles, secures, and governs everything — and owns the three risks above alone, on top of running the shop'],
      ['Hire in-house', 'A capable marketing/AI hire typically costs $70K–$120K+/year and is hard to find, and one person cannot cover SEO, content, booking, and security'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, and security in one team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 09 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Monaco\'s Growth Engine', CORE_BLUE, '09'),
  spacer(100),
  p('Monaco\'s AI growth program operates across three channels simultaneously: inbound demand generation, outbound relationship building, and internal capacity optimization. Together, they close the gap between Monaco\'s current output and its full operational capacity.'),
  spacer(200),
  diagramImage(DIAGRAM_ARCH_BUF, 'Monaco AI Growth Engine Architecture', 560, 1.61),
  diagramCaption('Figure 9.0 — Monaco AI Growth Engine: Three-Channel Architecture'),
  spacer(160),

  buildTable(
    [
      { label: 'Channel', weight: 1.5 },
      { label: 'AI Tool', weight: 2.5 },
      { label: 'Use Case', weight: 3 },
      { label: 'Impact Metric', weight: 2 },
      { label: 'Technijian Service', weight: 1.5 },
    ],
    [
      // Inbound
      ['Inbound', 'Multi-agent SEO platform', 'Google Map Pack dominance — OC + San Clemente', 'New organic leads / month', 'My SEO'],
      ['Inbound', 'AEO content engine', '"Tesla wheel repair OC" AI-cited authority', 'AI citation share', 'My SEO'],
      ['Inbound', 'GBP optimization bot', 'Weekly posts, Q&A, photo uploads automated', 'GBP views & calls', 'My SEO'],
      ['Inbound', 'Before/after content pipeline', 'Instagram & TikTok posts from every repair', 'Follower growth, profile visits', 'My AI'],
      // Outbound
      ['Outbound', 'Review velocity system', 'Auto SMS post-service review request', 'New reviews / month', 'My AI'],
      ['Outbound', 'My AI Lead Gen — dealer prospecting', 'Identify & AI-sequence OC + LV new-car dealers; personalized emails from Javon\'s inbox + auto follow-up', 'New wholesale dealer accounts / quarter', 'My AI Lead Gen'],
      ['Outbound', 'My AI Lead Gen — fleet & B2B', 'Fleet managers, corporate accounts, rental operators — outbound prospecting sequences', 'Fleet accounts closed / quarter', 'My AI Lead Gen'],
      ['Outbound', 'Referral activation', 'Body shop partner loyalty + volume tracking', 'Partner referral revenue', 'My Dev'],
      // Internal
      ['Internal', 'AI booking & quote bot', 'After-hours intake, photo-to-quote, scheduling', 'After-hours bookings captured', 'My Dev'],
      ['Internal', 'Upsell prompt engine', 'Caliper / chrome delete combo suggestions at booking', 'Avg ticket lift %', 'My AI'],
      ['Internal', 'Customer CRM', '6-month follow-up: "Time for another repair?"', 'Repeat customer rate', 'My Dev'],
    ],
  ),
);

// ---------- 10 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '10'),
  spacer(100),
  p('Technijian\'s engagement with Monaco is structured to prove value before it asks for scale: a focused, fixed-price entry pilot that delivers measurable lift in the first 90 days, followed by the full program once the engine is validated. All pricing is based on published Technijian service rates. ROI projections are illustrative estimates — exact figures should be confirmed against Monaco\'s real booking values and conversion rates.'),
  spacer(120),
  calloutBox('AI as a Managed Investment — Not a Leap of Faith', [
    'The reason most AI spending disappoints is rarely the technology — it is the lack of measurement. Widely-cited industry surveys find that most companies now use AI in some form, but only a minority report a clear profit impact; the difference is discipline, not budget.',
    'Technijian runs every engagement with stage-gates: we track adoption, then operational lift (wheels/day, reviews, captured leads), then revenue against total cost — and if the pilot does not clear its cost at the gate, we stop and re-scope. Monaco carries the upside, not blind risk.',
  ], CORE_ORANGE),
  spacer(160),

  subHeader('Projected KPI Lift'),
  buildTable(
    [
      { label: 'KPI', weight: 3 },
      { label: 'Current State', weight: 2.5 },
      { label: 'With AI Program', weight: 2.5 },
      { label: 'Lift', weight: 2 },
    ],
    [
      ['Wheels repaired per day (avg)', '10–12', '14–16 (Year 1)', '+3–4 wheels/day'],
      ['Monthly wheel repair volume', '~240 wheels', '~300–350 wheels', '+25–45%'],
      ['Yelp reviews — San Clemente', '0 (not launched)', '50+ in 90 days', 'Market entry'],
      ['Google Map Pack rank — San Clemente', 'Not listed', 'Top 3 within 60 days', 'New revenue channel'],
      ['After-hours lead capture rate', '~0% (no coverage)', '80%+ of inquiries captured', 'Previously lost revenue'],
      ['Dealer accounts', '4 active', '7–10 within 6 months', '+75–150%'],
      ['Average revenue per job (upsell)', 'Baseline', '+12–18% from combo prompts', '$5–9K/month incremental'],
      ['Monthly estimated revenue', '~$46,000', '~$56,000–$64,000', '+$10–18K/month'],
    ],
  ),
  spacer(200),

  subHeader('Y1 Return on Investment'),
  buildTable(
    [
      { label: 'Model', weight: 3 },
      { label: 'Conservative', weight: 2 },
      { label: 'Target', weight: 2 },
      { label: 'Aggressive', weight: 2 },
    ],
    [
      ['Additional wheels/day vs. current', '+2 wheels', '+4 wheels', '+6 wheels'],
      ['Additional monthly wheel revenue', '+$6,160', '+$12,320', '+$18,480'],
      ['Additional services (upsell, dealers)', '+$3,000/mo', '+$6,000/mo', '+$10,000/mo'],
      ['Total additional monthly revenue', '+$9,160', '+$18,320', '+$28,480'],
      ['Total additional annual revenue', '+$109,920', '+$219,840', '+$341,760'],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$36,000', bold: true }, { text: '~$36,000', bold: true }, { text: '~$36,000', bold: true }],
      [{ text: 'ROI Ratio', bold: true, color: CORE_BLUE }, { text: '3.1×', bold: true, color: PASS }, { text: '6.1×', bold: true, color: PASS }, { text: '9.5×', bold: true, color: PASS }],
    ],
  ),
  spacer(200),

  subHeader('The Entry Offer — The 90-Day AI Lead-Gen Pilot', { color: CORE_ORANGE }),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up Monaco\'s local-search presence, the after-hours booking and review automation, and the first wave of before/after content, and proves the lift before any larger build is discussed.'),
  buildTable(
    [
      { label: 'What\'s Included', weight: 2.5 },
      { label: 'Detail', weight: 4 },
      { label: 'Investment', weight: 1.8 },
    ],
    [
      [{ text: 'My SEO — Local Dominance', bold: true }, 'Google Map Pack + AEO content + GBP weekly optimization (OC + San Clemente)', '$800/mo'],
      [{ text: 'My AI — Content & Reviews', bold: true }, 'Before/after content engine + automated post-service review requests', '$700/mo'],
      [{ text: 'AI Booking & Quote Bot', bold: true }, 'After-hours SMS intake + photo-to-quote flow (one-time build, deployed in the pilot)', '$15,000 build'],
      [{ text: 'ENTRY PILOT — 90 DAYS', bold: true }, 'Fixed scope, published rates, month-to-month after the initial term', { text: '~$15K build + $1,500/mo', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_ORANGE },
  ),
  spacer(120),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, Monaco is capturing after-hours and weekend inquiries that previously went to voicemail (target: 80%+ of inbound inquiries answered and quoted), with a measurable lift in booked jobs over the pre-pilot baseline.',
      'Our commitment: the entry pilot is month-to-month after the initial term — no long lock-in, no obligation to continue if it doesn\'t hit the metric by day 90. If it hasn\'t moved the needle, you are free to stop, and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(200),

  subHeader('Full Program — Year 1 Service Investment Map'),
  buildTable(
    [
      { label: 'Service', weight: 2.5 },
      { label: 'Description', weight: 3.5 },
      { label: 'Monthly', weight: 1.5 },
      { label: 'Y1 Total', weight: 1.5 },
    ],
    [
      ['My SEO — Local Dominance', 'Google Map Pack + AEO content + GBP weekly optimization (OC + San Clemente)', '$800/mo', '$9,600'],
      ['My AI — Content & Automation', 'Before/after content engine + review velocity system + upsell prompts + dealer outreach sequences', '$700/mo', '$8,400'],
      ['My Dev — Booking & CRM Build', 'AI quote bot + after-hours intake + customer CRM + partner portal (one-time build)', '—', '$15,000'],
      ['My Dev — Managed App Services', 'Bot hosting, updates, monitoring', '$250/mo', '$3,000'],
      [{ text: 'Y1 TOTAL INVESTMENT', bold: true }, { text: '', bold: true }, { text: '$1,750/mo', bold: true }, { text: '~$36,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'At $140 blended average per wheel, 2 additional wheels per day generates $6,160/month — covering the full monthly program investment ($1,750) with $4,410 left over.',
      'The AI program pays for itself with the first 13 additional wheels repaired each month. Everything beyond that is margin expansion.',
      'The San Clemente launch alone — capturing a market that does not yet have a dominant brand — is a standalone revenue engine that does not exist today.',
    ],
    CORE_BLUE
  ),
);

// ---------- 11 SUBSCRIPTION & MEMBERSHIP PRICING ----------
docChildren.push(
  ...sectionHeader('Subscription & Membership Pricing Strategy', TEAL, '11'),
  spacer(100),
  p('As Monaco\'s AI program matures and the customer base grows, a subscription or membership model creates predictable monthly recurring revenue, locks in loyalty, and enables capacity planning. Done correctly, it also builds a competitive moat that is nearly impossible for solo-operator competitors to replicate.'),
  spacer(120),

  subHeader('Why Subscriptions Work for Monaco'),
  buildTable(
    [{ label: 'Benefit', weight: 2.5 }, { label: 'What It Means for Monaco', weight: 5 }],
    [
      ['Predictable revenue', 'Subscription fees arrive regardless of whether damage occurs — smoothing seasonal dips'],
      ['Capacity planning', 'Knowing 100 subscribers will book ~400 repairs/year lets Javon schedule staff and mobile routes proactively'],
      ['Customer lock-in', 'Subscribers are 3–5× less likely to shop a competitor for each repair — they already paid'],
      ['AI upsell surface', 'Subscription CRM flags renewal dates, upgrade opportunities, and add-on services (calipers, chrome delete)'],
      ['Moat', 'No solo mobile operator can afford to offer a structured subscription program — this differentiates Monaco immediately'],
    ],
  ),
  spacer(160),

  subHeader('Recommended Tier Structure'),
  buildTable(
    [
      { label: 'Tier', weight: 1.5 },
      { label: 'Annual Fee', weight: 1.5 },
      { label: 'Included Repairs', weight: 1.5 },
      { label: 'Retail Value', weight: 1.5 },
      { label: 'Savings', weight: 1 },
      { label: 'Best For', weight: 2.5 },
    ],
    [
      ['Silver', '$349/yr ($29/mo)', '4 repairs/yr', '$500', '30%', 'Single-car owners, lease drivers'],
      ['Gold', '$649/yr ($54/mo)', '8 repairs/yr', '$1,000', '35%', 'Dual-car households, Tesla owners'],
      ['Platinum', '$999/yr ($83/mo)', '12 repairs/yr', '$1,500', '33%', 'Car enthusiasts, collectors'],
      ['Fleet / Dealer', 'Custom — min. $1,200/yr', 'Unlimited at volume rate', '—', '$75–$85/wheel', 'Dealerships, fleet managers'],
    ],
  ),
  spacer(120),
  p('Each tier is priced to deliver meaningful customer savings while protecting Monaco\'s per-repair margin. At volume, a subscription repair costs Monaco approximately the same as a walk-in — but generates guaranteed pipeline.'),
  spacer(160),

  subHeader('Usage Abuse Prevention — The Fair-Use Framework'),
  p('The highest-risk scenario: a customer on the 4-repair Silver plan damages 8–12 wheels in a year. The following layered approach prevents margin erosion without punishing honest customers.'),
  spacer(100),
  buildTable(
    [
      { label: 'Control Layer', weight: 2 },
      { label: 'How It Works', weight: 4 },
      { label: 'Enforcement', weight: 2.5 },
    ],
    [
      ['VIN linkage', 'Each subscription is tied to one registered vehicle\'s VIN. A second vehicle = second subscription.', 'Captured at sign-up; AI CRM validates at booking'],
      ['Cooldown window', 'The same wheel is not eligible for repair within 60 days of a previous repair on that wheel.', 'CRM blocks booking; AI flags duplicate requests'],
      ['Overage pricing', 'Repairs 1–4 at member rate. Repairs 5–8 at 15% discount. Repairs 9+ at full retail ($125–$175).', 'Pricing applied automatically at checkout'],
      ['AI usage monitoring', 'CRM flags any account using 2× the cohort average. Ravi or Javon receives an alert for manual review.', 'My AI CRM anomaly detection; monthly report'],
      ['Early-term clause', 'Accounts showing systematic over-use within 90 days may be offered an upgrade or a plan exit at prorated refund.', 'Human decision; AI surfaces the candidates'],
    ],
  ),
  spacer(120),
  p('The key principle: make the price of abuse higher than the price of upgrading. A customer repairing 8 wheels should find it cheaper to upgrade to Gold than to pay Silver + overage fees — steering them toward the right tier organically.'),
  spacer(160),

  subHeader('Revenue Impact Scenarios'),
  buildTable(
    [
      { label: 'Scenario', weight: 2 },
      { label: 'Subscribers', weight: 1 },
      { label: 'Avg Repairs/Yr', weight: 1.5 },
      { label: 'Avg Fee/Yr', weight: 1.5 },
      { label: 'Annual Recurring Revenue', weight: 2 },
      { label: 'Monthly Recurring Revenue', weight: 1.5 },
    ],
    [
      ['Conservative (Yr 1)', '50', '4.2', '$399', '$19,950', '~$1,660/mo'],
      ['Target (Yr 2)', '150', '4.8', '$499', '$74,850', '~$6,240/mo'],
      ['Aggressive (Yr 3)', '300', '5.2', '$549', '$164,700', '~$13,725/mo'],
      ['Fleet add-on', '6 dealer accts', '24 repairs/yr', '$1,400', '$8,400', '~$700/mo'],
    ],
  ),
  spacer(100),
  p('At 150 subscribers (Year 2 target), Monaco collects ~$6,240/month in guaranteed subscription fees — providing a predictable revenue floor regardless of seasonal fluctuation. Combined with the capacity gains from the AI program, this transforms Monaco\'s financial profile from purely transactional to partially recurring.'),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The Monaco AI Growth Program is designed for fast impact. Rather than a multi-year transformation, this roadmap is built for 90-day proof-of-concept cycles — with meaningful, measurable results visible within the first 30 days.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Monaco 30-60-90 Day Implementation Timeline', 580, 2.30),
  diagramCaption('Figure 12.0 — Monaco AI Growth Program: 30/60/90 Day Roadmap'),
  spacer(160),

  subHeader('Phase 1 — Foundation (Days 1–30)', { color: CORE_BLUE }),
  p('Establish the digital infrastructure that everything else runs on.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Google & Yelp Infrastructure', 'Claim + optimize San Clemente GBP and Yelp listings. Audit and update OC listings for consistency, photos, Q&A. Set review request baseline.'],
      ['1.2 — AI Booking & Quote Bot', 'Deploy after-hours SMS intake. Configure photo-to-quote flow. Integrate with Javon\'s scheduling system. Test with 5 real inquiries.'],
    ],
  ),
  spacer(160),

  subHeader('Phase 2 — Growth (Days 31–60)', { color: CORE_ORANGE }),
  p('Launch the content and outreach engines.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Content & Review Engine Live', 'Before/after content pipeline publishing 3–5 posts/week automatically. Review velocity system generating 15–25 new reviews/month. San Clemente first 20 reviews captured.'],
      ['2.2 — Dealer & Partner Outreach', 'Identify 15 OC dealerships not currently using Monaco. Launch AI outreach sequence. Activate body shop referral tracking with 5 existing partners.'],
    ],
  ),
  spacer(160),

  subHeader('Phase 3 — Scale (Days 61–90)', { color: TEAL }),
  p('Close the capacity gap and lock in the wins.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — San Clemente Market Entry', 'San Clemente Wheel Repair reaches Top 3 Google Map Pack. 50+ Yelp reviews (surpasses Rim Revival). First 20 San Clemente jobs completed.'],
      ['3.2 — Revenue Loop Closed', 'Upsell prompt engine live and tracking avg ticket lift. CRM follow-up sequence active for past 90 days of customers. ROI dashboard delivered to Javon showing program performance vs. baseline.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('These are five actions Monaco can take immediately — before any Technijian contract is signed. Each one is a concrete step that creates value this week and naturally leads to the larger AI program.'),
  spacer(140),

  calloutBox(
    '1 — Claim the San Clemente Google Business Profile Today',
    ['Go to business.google.com and create a service-area GBP for "San Clemente Wheel Repair." Set the service area to San Clemente, Dana Point, and San Juan Capistrano. Add 10 before/after photos. This is free and takes 30 minutes.'],
    CORE_BLUE
  ),
  spacer(100),
  calloutBox(
    '2 — Text Your Last 20 Completed Customers a Review Link',
    ['Open your phone, go through the last 20 completed jobs, and text each customer: "Hi [name], thank you for trusting Monaco with your wheels! If you have a moment, we\'d love a Google review: [link]." Five positive reviews can shift your ranking within 2 weeks.'],
    CORE_BLUE
  ),
  spacer(100),
  calloutBox(
    '3 — Set a Google Alert for Your Top Competitors',
    ['Go to google.com/alerts and create alerts for "Orange Coast Mobile Wheel Repair," "Rim Revival San Clemente," and "Steve\'s Mobile Wheel Repair." Get notified when they get press, reviews, or social mentions — so you can respond to market signals in real time.'],
    CORE_BLUE
  ),
  spacer(100),
  calloutBox(
    '4 — Post One Before/After This Week',
    ['Find the best wheel repair you did this week — the most dramatic transformation. Take a clean before photo and a clean after photo on white concrete if possible. Post it on @monacowheel with: "Curb rash? We fix that. Same day. 📍 Costa Mesa | (949) 800-8502." Watch what happens to your profile views.'],
    CORE_BLUE
  ),
  spacer(100),
  calloutBox(
    '5 — Add a Weekend or After-Hours Text Number to Your Bio and Website',
    ['Even before the AI bot is live, add "Text for after-hours quotes: (your number)" to your Instagram bio and website contact page. Capture the inquiry. Even a 2-hour text response outperforms a voicemail that gets ignored.'],
    CORE_BLUE
  ),
);

// ---------- 14 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '14'),
  spacer(100),
  p('The honest answers to the questions Monaco is most likely asking right now.'),
  spacer(120),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already do our own marketing and social. Why add Technijian?', bold: true }, 'Keep doing what works — your Instagram and reputation are real assets. We add the layer that is hard to do by hand: systematic local-search and AI-search ranking (SEO/AEO), automated review velocity, after-hours booking capture, and a content engine that runs without you sitting at a phone. We run alongside what you do, not over it.'],
      [{ text: 'Isn\'t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — a review text when a job is done, a quote reply at 9pm Saturday — not autonomous "agents" running your shop. We use the simplest tool that works, measure it, and only expand what earns its place.'],
      [{ text: 'Is our customer data — phone numbers, photos, addresses — safe?', bold: true }, 'Yes. Customer data never touches a public AI model; we deploy private, governed systems with human review on anything customer-facing or money-bound, led by a CISSP-certified team. Data handling is set up correctly from day one.'],
      [{ text: 'We\'re a lean shop. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give you back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly check-in plus a quick approve on what we draft. No new hire to manage.'],
      [{ text: 'What if it doesn\'t work?', bold: true }, 'The entry pilot is a fixed-price 90-day program with a defined success metric (Section 10), month-to-month with no long lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry pilot is roughly a $15K one-time bot build plus $1,500/mo at published rates — no hidden fees. The full Year-1 program is profiled in Section 10 (~$36K), but only after the pilot proves the lift. At a $140 blended ticket, ~2 extra wheels a day covers the full monthly program.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 15 CONCLUSION ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('Monaco Wheel Restoration has everything it needs to dominate the Orange County and San Clemente wheel repair markets: the craft, the reputation, the capacity, and a 13-year head start. The missing piece is a systematic AI program that makes the quality of the work as visible online as it is in person.'),
  p('The opportunity is not abstract. It is 2 additional wheels per day, captured after hours by an AI that never sleeps. It is 50 San Clemente reviews that make Monaco the first name that appears when a local searches "wheel repair near me." It is a dealer base that doubles because an AI handles the outreach Javon does not have time for.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: Complete a 30-minute scoping call with Technijian to confirm program scope and pricing for Monaco\'s specific needs.',
      'Step 2: Technijian delivers a Statement of Work within 5 business days of the scoping call.',
      'Step 3: Program kickoff — GBP setup, bot deployment, and first content posts live within 14 days of contract signature.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [
      new TableCell({
        shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 300, bottom: 300, left: 400, right: 400 },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to fill Monaco\'s capacity gap?', size: 30, bold: true, color: WHITE, font: FONT_HEAD })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  }),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California. We build and operate the AI systems that help local and regional businesses compete at scale — without adding headcount.'),
  spacer(140),
  buildTable(
    [
      { label: 'Service', weight: 2 },
      { label: 'What It Delivers for Monaco', weight: 5 },
    ],
    [
      ['My SEO', 'Google Map Pack dominance and AEO content for both Monaco locations — driving inbound leads from search without paid advertising'],
      ['My AI', 'AI-powered review velocity, before/after content engine, upsell prompts, and dealer outreach automation'],
      ['My Dev', 'Custom AI booking bot, photo-to-quote system, customer CRM, and partner referral portal — built for Monaco\'s specific workflow'],
    ],
  ),
  spacer(200),
  buildTable(
    [
      { label: 'Contact', weight: 2 },
      { label: 'Detail', weight: 4 },
    ],
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
  p('Market intelligence gathered via web research conducted May 19, 2026. All competitor data from publicly available sources.', { italics: true }),
  spacer(120),
  p('1. Monaco Wheel Restoration — Yelp listing (Costa Mesa): yelp.com/biz/monaco-wheel-restoration-costa-mesa', { size: 20 }),
  p('2. Monaco Wheel Restoration — Official website: monacowr.com', { size: 20 }),
  p('3. Orange Coast Mobile Wheel Repair — Yelp: yelp.com/biz/orange-coast-mobile-wheel-repair-orange-county', { size: 20 }),
  p('4. SoCal Auto Touch Up — Pricing: socal-autotouchup.com/services', { size: 20 }),
  p('5. Resurrect Wheel Recon — Costa Mesa/Irvine: resurrectwheelrecon.com', { size: 20 }),
  p('6. Steve\'s Mobile Wheel Repair — Yelp: yelp.com/biz/steves-mobile-wheel-repair-orange-county-2', { size: 20 }),
  p('7. Rim Revival Mobile Wheel Restoration (San Clemente) — Yelp: yelp.com/biz/rim-revival-mobile-wheel-restoration-san-clemente-3', { size: 20 }),
  p('8. Fix Auto San Clemente: fixauto.com/us/en/shop/san-clemente/', { size: 20 }),
  p('9. Yelp — Best Wheel & Rim Repair in Orange County, CA (2026): yelp.com search results', { size: 20 }),
  p('10. Yelp — Best Wheel & Rim Repair in San Clemente, CA (2025): yelp.com search results', { size: 20 }),
  p('11. Monaco Wheel Restoration — BBB Profile: bbb.org/us/ca/costa-mesa/profile/wheel-repair/monaco-wheel-restoration-llc-1126-1000111528', { size: 20 }),
  p('12. Monaco Wheel Restoration — Instagram: instagram.com/monacowheel', { size: 20 }),
  p('13. West Coast Tire & Services San Clemente expansion (January 2026): York Dispatch press release', { size: 20 }),
  p('14. Technijian Service Pricing — services/My SEO, My AI, My Dev internal rate cards', { size: 20 }),
);

// =====================================================================
// DOCUMENT ASSEMBLY
// =====================================================================

const doc = new Document({
  numbering: {
    config: [{
      reference: NUM_BULLETS,
      levels: [{
        level: 0,
        format: 'bullet',
        text: '•',
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: { indent: { left: 360, hanging: 360 } },
          run: { font: 'Symbol', size: 22, color: CORE_BLUE },
        },
      }],
    }],
  },
  styles: {
    default: {
      document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD },
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD },
        paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: 15840 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

// ---------- Write DOCX ----------
const OUT_PATH = path.join(__dirname, 'Monaco-Wheel-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\n✅  DOCX written: ${OUT_PATH}`);
  console.log(`    Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('❌  Build failed:', err.message);
  process.exit(1);
});
