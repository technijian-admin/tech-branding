// Boberg Engineering & Contracting, Inc. — AI Growth & Bid Intelligence Blueprint
// Technijian-branded DOCX builder.
// Pattern: Clients/COB/build-cob-report.js

const fs   = require('fs');
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

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => {
  const p2 = path.join(DIAGRAMS_DIR, name);
  return fs.existsSync(p2) ? fs.readFileSync(p2) : null;
};
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

// Derive aspect ratio from real PNG dimensions
function pngDimensions(buf) {
  if (!buf || buf.length < 24) return { w: 1200, h: 700 };
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  return { w, h };
}

const TODAY = '2026-06-05';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W    = 12240;
const MARGIN    = 1440;
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

function sectionHeader(text, color = CORE_BLUE) {
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    pageBreakBefore: true,
    spacing: { before: 0, after: 120, line: 240 },
    children: [new TextRun({ text, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
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
        children: [new Paragraph({ children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })] })],
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

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
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
  const diff = CONTENT_W - colWidths.reduce((s, w2) => s + w2, 0);
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
        width: { size: 2600, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 2600, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2600, CONTENT_W - 2600],
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Boberg Engineering: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  });
}

function diagramImage(buf, altTitle, widthPx = 580) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const dims = pngDimensions(buf);
  const h = Math.round(widthPx * dims.h / dims.w);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: h }, altText: { title: altTitle, description: altTitle, name: altTitle } })],
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Bid Intelligence Blueprint  ·  Boberg Engineering', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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

// ─────────────── COVER ───────────────
docChildren.push(
  colorBanner(CORE_BLUE, 240),
  spacer(700),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(500),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1800, 5760, 1800],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})],
  }),
  spacer(240),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'AI Growth & Bid Intelligence Blueprint', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Boberg Engineering & Contracting, Inc.', size: 40, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'How AI Wins More Bids and Deepens GC Relationships', size: 28, color: BRAND_GREY, font: FONT_BODY, italics: true })] }),
  spacer(360),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: `Prepared by Technijian  ·  ${TODAY}`, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: 'CONFIDENTIAL', size: 18, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
  spacer(800),
  colorBanner(CORE_ORANGE, 80),
  pageBreak()
);

// ─────────────── TOC ───────────────
docChildren.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 }, children: [new TextRun({ text: 'Table of Contents', size: 36, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' })
);

// ─────────────── 01 EXECUTIVE SUMMARY ───────────────
docChildren.push(...sectionHeader('01 — Executive Summary'));
docChildren.push(spacer(160));
docChildren.push(
  kpiRow([
    { number: '33', label: 'Years serving SoCal commercial construction', color: CORE_BLUE },
    { number: '98', label: 'BuildZoom score — top 16% in California', color: TEAL },
    { number: '58', label: 'LinkedIn followers — the gap to fill', color: CRITICAL },
    { number: '~38%', label: 'GC firms reporting AI adoption in 2026 (industry research)', color: CORE_ORANGE },
  ])
);
docChildren.push(spacer(200));
docChildren.push(
  p('Boberg Engineering has spent 33 years doing work that speaks for itself — warehouse pads for national industrial developers, medical campus site prep, commercial demolition across Southern California. Chad Boberg and Matthew Sage run a firm that GCs invite back because the work is done right, on schedule, and without surprises. That is the foundation every AI growth strategy builds on.'),
  p('The gap is not in field performance. The gap is in pipeline awareness, bid intelligence, and digital authority. Today, the average GC estimator building a sub list for a new Inland Empire warehouse project consults ConstructConnect, checks a sub\'s BuildZoom profile, and Googles them before sending the bid invite. When they search for Boberg Engineering, they find a thin shelf — 58 LinkedIn followers, limited online project history, and no published content establishing Boberg as the grading authority in commercial SoCal construction.'),
  p('This blueprint shows exactly how Technijian changes that on two fronts simultaneously:')
);
docChildren.push(
  bullet('Growth — be found, verified, and trusted by GC estimators before the bid invite arrives; monitor the bid pipeline 24 hours before competitors; and deepen relationships with the industrial developers who hire earthwork subs directly'),
  bullet('Efficiency — automate the proposal process so Boberg bids in one day instead of five, and preserve 33 years of institutional knowledge so the next generation of estimators inherits it instead of rebuilding it from scratch')
);
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The Opportunity in One Sentence',
  'A 33-year firm with a 98 BuildZoom score and a Hillwood relationship has near-zero digital authority — and no AI advantage. The first SoCal commercial earthwork sub to deploy bid intelligence and account-based outreach claims the pipeline first.',
  CORE_BLUE
));

// ─────────────── 02 ABOUT BOBERG ENGINEERING ───────────────
docChildren.push(...sectionHeader('02 — About Boberg Engineering & Contracting'));
docChildren.push(spacer(160));
docChildren.push(
  p('Founded in 1993 by Larry Boberg, Boberg Engineering & Contracting, Inc. has spent more than three decades building a quiet reputation as one of Southern California\'s most reliable commercial earthwork subcontractors. Based in Corona and operating throughout the Inland Empire, Orange County, and greater Los Angeles, the firm is now led by President Chad Boberg and co-operator Matthew Sage — a leadership team carrying 40-plus years of combined grading experience.'),
  p('The firm\'s project mix reflects the full spectrum of Southern California\'s commercial construction cycle: warehouse and industrial distribution centers, medical campuses, retail centers, and office buildings. The Magnon Business Center, delivered for national industrial developer Hillwood Construction Services, is one example of Boberg\'s capacity to execute on large-scale, schedule-critical industrial site prep — the highest-value segment in the SoCal earthwork market.'),
  p('Boberg holds a California General Engineering license plus separate licenses in Earthwork & Paving, Building Moving, and Demolition. Their BuildZoom score of 98 places them in the top 16 percent of California-licensed contractors — a pre-qualification signal that GC estimators increasingly use as a first filter before extending bid invitations.')
);
docChildren.push(spacer(120));
docChildren.push(subHeader('Boberg Service Architecture'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Service', weight: 2 }, { label: 'Description', weight: 3 }, { label: 'Primary Project Types', weight: 2 }],
  [
    ['Mass / Rough Grading', 'Large-scale earthmoving, cut-and-fill operations to design grade', 'Industrial, warehouse, large commercial pads'],
    ['Fine Grading', 'Precision grading to engineered tolerances; subgrade prep for slabs and paving', 'Medical, retail, office, industrial'],
    ['Demolition', 'Commercial structure demolition, concrete breaking, clearing and grubbing', 'Redevelopment, tenant improvement sites, industrial conversion'],
    ['Earthwork', 'Import/export, compaction, moisture conditioning, subgrade stabilization', 'All commercial project types'],
    ['Site Preparation', 'Full site prep from raw land or improved site to pad-ready condition', 'Greenfield industrial, campus medical, mixed-use retail'],
  ]
));

// ─────────────── 03 THE COMMERCIAL CONSTRUCTION LANDSCAPE ───────────────
docChildren.push(...sectionHeader('03 — The Commercial Construction Landscape'));
docChildren.push(spacer(160));
docChildren.push(
  p('Southern California\'s commercial construction market is one of the largest and most active in the country. Industrial and logistics real estate demand — driven by e-commerce, near-shoring, and the Inland Empire\'s position as a global logistics hub — continues to push new warehouse and distribution development at a pace that keeps earthwork subs at capacity. The medical and retail sectors add additional project velocity, particularly in the 91 and 241 corridors where Boberg operates.'),
  p('For earthwork subcontractors, the business development cycle is distinctly account-based. General contractors and developers do not respond to broad marketing campaigns; they maintain a curated sub roster and invite bids selectively. New entrants to that roster come in one of two ways: through a relationship initiated by someone the estimator already trusts, or through a pre-qualification discovery process that increasingly happens online — BuildZoom scores, ConstructConnect profiles, and Google searches.'),
  p('The construction technology landscape is shifting beneath that process. Industry research reports a sharp rise in AI adoption among commercial contractors — on the order of roughly 38 percent of GC firms by 2026 — and AI-assisted bid-management tools are reported to reach the high-80s to ~90 percent accuracy against manually prepared estimates. GCs are increasingly using platforms like ConstructConnect and DowntoBid to identify, score, and invite qualified subs algorithmically. Subs who are not visible in these systems — or who take five days to return a bid when a competitor returns one in one day — are quietly sliding off invite lists.')
);
docChildren.push(spacer(120));
docChildren.push(calloutBox(
  'The Window Is Open — Not Forever',
  ['Among the seven named SoCal earthwork competitors researched for this report, none shows evidence of AI-enabled bid intelligence, account-based outreach, or published technical authority content. The first firm to deploy these capabilities does not just win more bids — it becomes the default "safe choice" on estimators\' sub lists before competitors realize the game changed.'],
  CORE_ORANGE
));

// ─────────────── 04 THE CUSTOMER: WHO HIRES BOBERG ───────────────
docChildren.push(...sectionHeader('04 — The Customer: Four Buyer Personas'));
docChildren.push(spacer(160));
docChildren.push(
  p('Boberg\'s target buyer universe is finite and knowable. It is not a broad market to advertise into — it is a named list of GC firms and developers operating in the SoCal commercial construction segment. The four personas below represent the distinct buyer types who decide whether Boberg is on the bid list, and what drives each decision.'),
  p('The diagram below positions each persona by bid invitation volume (how many invites per year typically flow from this buyer type) and project margin potential (the gross margin profile of work from this relationship):')
);
docChildren.push(spacer(100));
docChildren.push(diagramImage(DIAGRAM_PERSONAS_BUF, 'Buyer Persona Matrix', 560));
docChildren.push(diagramCaption('Figure 4.0 — Four Buyer Personas: Bid Volume × Project Margin Potential'));
docChildren.push(spacer(160));

docChildren.push(personaCard(
  'Persona 1 — The GC Estimator / Pre-Con Lead',
  CORE_BLUE,
  [
    ['Role', 'Estimating Manager or Pre-Construction Lead at a regional or national GC. Maintains the sub invite list for earthwork scopes. Sends bid packages to 3–5 qualified subs per project.'],
    ['Pain Points', '(1) Too many subs to evaluate — needs a reliable way to verify track record fast. (2) Slow bid turnaround forces last-minute scrambles. (3) Scope gaps in sub proposals create VE pain during construction. (4) Unfamiliar subs on large industrial projects = schedule risk.'],
    ['Decision Driver', 'Speed of response and scope accuracy on the bid, plus a verifiable track record on the project type. A sub who returns a clean bid in 24 hours and has a 98 BuildZoom score gets invited again.'],
    ['AI Opportunity', 'AI bid portal monitoring surfaces new project postings 24–48 hours before they reach most subs. AI-drafted proposals return clean, scope-complete bids in hours. BBE becomes the estimator\'s first call because they always come back fast and right.'],
    ['Technijian Hook', 'My AI bid intelligence platform monitors ConstructConnect and PlanetBids daily; proposal auto-drafting from plan extracts cuts bid prep from 5 days to 1 day.'],
  ]
));
docChildren.push(spacer(120));
docChildren.push(personaCard(
  'Persona 2 — The Industrial Developer / Owner Representative',
  CORE_ORANGE,
  [
    ['Role', 'VP of Real Estate, Project Manager, or Owner Representative at an industrial developer — Hillwood, Prologis, Rexford, Majestic, or similar. Hires earthwork subs directly before a GC is selected, or manages site prep as a separate owner-contract.'],
    ['Pain Points', '(1) Site prep schedule is always on the critical path — any delay ripples forward to the GC start date and the tenant delivery. (2) Earthwork subs who have never worked on a tilt-up industrial pad miss the tolerance requirements. (3) The developer\'s in-house PM needs a sub who self-manages; daily babysitting is not in the budget.'],
    ['Decision Driver', 'Proven track record on industrial/warehouse site prep plus self-sufficient project management and on-time delivery. Hillwood-caliber developers are referral- and relationship-driven: one successful project opens the portfolio.'],
    ['AI Opportunity', 'AI permit monitoring tracks new industrial entitlement filings, zoning changes, and developer site acquisitions across IE, OC, and LA — BBE reaches the developer before a GC or competing sub does. Account intelligence on developer pipeline enables proactive outreach timed to the site acquisition stage.'],
    ['Technijian Hook', 'My AI account intelligence + trigger monitoring on industrial developer activity; My SEO authority content targeting developer searches for "industrial earthwork contractor SoCal."'],
  ]
));
docChildren.push(spacer(120));
docChildren.push(personaCard(
  'Persona 3 — The GC Principal / VP Construction',
  TEAL,
  [
    ['Role', 'Partner, VP of Operations, or Business Development lead at a regional GC. Makes or heavily influences the sub roster decisions — who gets invited to bid and who gets the negotiated repeat work at higher margin.'],
    ['Pain Points', '(1) Sub performance data lives in project managers\' heads — hard to evaluate which subs should be promoted to preferred status. (2) Key-relationship subs get poached by competitors offering lower price; pure price-competition erodes the roster quality. (3) No visibility into a sub\'s forward capacity — awkward last-minute "we\'re booked" conversations.'],
    ['Decision Driver', 'Trust built over multiple successful projects and a sub who communicates proactively. Negotiated preferred-sub arrangements (step 5 of the procurement funnel) happen at this level — the highest-margin work Boberg can win.'],
    ['AI Opportunity', 'AI-packaged project performance history and relationship touchpoint tracking lets BBE show GC principals a data story at relationship reviews. Proactive outreach at key relationship milestones (project anniversary, leadership change at GC) signals investment in the relationship.'],
    ['Technijian Hook', 'My AI account intelligence and CRM layer; My Dev custom GC relationship tool tracking project history, performance metrics, and relationship cadence.'],
  ]
));
docChildren.push(spacer(120));
docChildren.push(personaCard(
  'Persona 4 — The Commercial Developer (Retail / Medical / Office)',
  CHARTREUSE,
  [
    ['Role', 'Developer, Owner, or PM at a retail, medical, or office project. Hires a GC who in turn selects the earthwork sub — or, on smaller projects, hires Boberg directly for site prep.'],
    ['Pain Points', '(1) Medical and retail projects have tight schedule windows tied to lease start dates or physician move-in dates. (2) Site conditions surprises (undocumented fill, rock, contamination) are a budget and schedule nightmare for a developer with a fixed price lease. (3) Smaller project = smaller earthwork scope = sub capacity availability is the hidden problem.'],
    ['Decision Driver', 'Reliability and communication. A sub who flags an unforeseen condition immediately and comes with a priced solution is far more valuable than one with a slightly lower bid.'],
    ['AI Opportunity', 'AEO content authority for "commercial grading contractor Orange County" and "site prep contractor medical campus SoCal" ensures BBE is surfaced when developers or their architects search before issuing an RFP. AI project documentation (daily reports, RFI responses) signals the professionalism this persona values.'],
    ['Technijian Hook', 'My SEO + content authority; My AI for project documentation efficiency that becomes a client-facing differentiator.'],
  ]
));

// ─────────────── 05 COMPETITIVE LANDSCAPE ───────────────
docChildren.push(...sectionHeader('05 — Competitive Landscape'));
docChildren.push(spacer(160));
docChildren.push(
  p('Seven named earthwork and grading contractors compete with Boberg in the Southern California commercial construction segment. The table below captures what is knowable from public sources — ratings, founding history, stated strengths, and identifiable gaps. The AI/digital posture column is the key differentiator signal:')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Competitor', weight: 2 }, { label: 'Est.', weight: 0.7 }, { label: 'Market', weight: 1.5 }, { label: 'Strengths', weight: 2.5 }, { label: 'Gap vs. Boberg', weight: 2.5 }, { label: 'AI / Digital Posture', weight: 1.5 }],
  [
    ['Southern California Grading', '1969', 'SoCal', 'Longest established; turnkey civil construction; broad project mix', 'Older firm; slower adaptation track record', 'None visible'],
    ['Ironclad General Engineering', '2010', 'SoCal', 'Younger firm; public works + commercial; actively growing', 'Less established on large industrial; newer track record', 'None visible'],
    ['SoCal Earthworks', 'N/A', 'SoCal', 'Grading, demolition, excavation focus; clean positioning', 'Limited public data; no differentiation signal', 'None visible'],
    ['Mark Company', '1964', 'SoCal', 'Broadest scope: demo + grading + wet/dry utilities', 'Full scope = less specialization; larger overhead footprint', 'None visible'],
    ['Weber-Madgwick Excavating', 'N/A', 'SoCal', 'Known for schedule adherence and professionalism', 'Limited industrial-segment recognition', 'None visible'],
    ['RCW Construction', '30+ yrs', 'LA area', 'Complex and hillside grading specialty; structural remediations', 'Hillside niche limits commercial warehouse appeal', 'None visible'],
    ['Peterson Grading & Paving', '50+ yrs', 'California', '50 years; asphalt paving + grading + ADA compliance', 'Paving focus dilutes earthwork specialization messaging', 'None visible'],
  ]
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The White Space No Competitor Owns',
  ['None of the seven competitors shows evidence of AI-enabled bid intelligence, account-based GC outreach, published technical authority content, or AI-assisted proposal automation. The first SoCal commercial earthwork subcontractor to deploy these capabilities claims the pre-qualification and pipeline-awareness advantage before the field catches up. That window is open now — and it will not stay open.'],
  CORE_BLUE
));

// ─────────────── 06 HOW GCS ACTUALLY HIRE EARTHWORK SUBS ───────────────
docChildren.push(...sectionHeader('06 — Strategic Procurement Dynamics: How GCs Choose Their Subs'));
docChildren.push(spacer(160));
docChildren.push(
  p('Commercial earthwork subcontractors win work through a five-step procurement funnel that is relationship-driven from top to bottom. Understanding exactly where AI creates leverage at each step is the key to calibrating the right growth investment:')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Step', weight: 0.5 }, { label: 'What Happens', weight: 2 }, { label: 'AI Leverage Point', weight: 2.5 }, { label: 'BBE\'s Current Position', weight: 2 }],
  [
    ['1', 'Pre-qualification: GC builds and maintains a vetted sub roster. Sub is on the invite list — or not.', 'AI content authority + BuildZoom optimization ensures BBE appears in estimator searches and pre-qual checks before bid season begins.', 'Strong BuildZoom 98 score. Thin digital footprint limits organic discovery.'],
    ['2', 'Invite-to-Bid: GC estimator sends scope + plans to 3–5 qualified subs on the roster.', 'Bid portal monitoring surfaces new project invites 24–48 hours early. Pre-qualification profile on ConstructConnect/Dodge increases invite frequency.', 'On existing GC rosters. Unknown whether all bid portals are active.'],
    ['3', 'Competitive Bid: BBE submits price + schedule + alternates.', 'AI proposal drafting returns a clean, scope-complete bid in hours, not days. Speed + accuracy are the differentiators at equal price.', 'Bids prepared manually over multiple days. Speed disadvantage versus faster subs.'],
    ['4', 'Award: Usually lowest responsible bid; track record as tiebreaker.', 'Packaged project performance history gives BBE a credibility edge in "responsible bidder" evaluations.', 'Strong field track record; not systematically documented or presented.'],
    ['5', 'Negotiated / Sole-Source: Trusted sub invited without competitive bid. Highest margin work.', 'GC account intelligence + relationship cadence tracking enables proactive touchpoints that convert bid relationships into preferred-sub status.', 'Some negotiated relationships with long-standing GC partners. Not systematically nurtured.'],
  ]
));
docChildren.push(spacer(160));
docChildren.push(
  p('Steps 1 and 2 are where the greatest volume of new work enters the pipeline. Steps 4 and 5 are where the highest margin work lives. A well-designed AI growth strategy captures both ends: authority and visibility for steps 1 and 2; relationship intelligence and proposal speed for steps 3, 4, and 5.')
);

// ─────────────── 07 DIGITAL PRESENCE GAP ───────────────
docChildren.push(...sectionHeader('07 — The Digital Presence Gap'));
docChildren.push(spacer(160));
docChildren.push(
  p('When a GC estimator adds a new sub to their roster or verifies an existing one before extending a bid invite, they follow a short but decisive audit: BuildZoom score, Google search, LinkedIn check, and ConstructConnect profile review. For Boberg Engineering, three of these four signals are weak today.'),
  p('The one bright spot is the BuildZoom score of 98 — a measurable trust signal that places Boberg in the top 16 percent of California contractors. That score is not advertised, not linked from the company website, and not mentioned in any LinkedIn content. It sits underused as a differentiation asset.')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Signal', weight: 2 }, { label: 'Current State', weight: 2.5 }, { label: 'Benchmark / Gap', weight: 2.5 }, { label: 'AI Opportunity', weight: 2 }],
  [
    ['LinkedIn followers', '58', 'SoCal Grading: 200+; Mark Company: 500+. Gap = 4–9× to competitors', 'My SEO content engine + project spotlights: target 500+ followers in 6 months'],
    ['Google search presence', 'Thin — no indexed content authority', 'Top SoCal subs appear for "commercial grading contractor Corona/IE/OC" queries', 'My SEO + AEO: publish earthwork authority content targeting GC estimator searches'],
    ['BuildZoom score 98', 'Exists; not actively promoted', 'Strength hiding in plain sight — BBE is already top 16% CA', 'Promote in every bid, proposal, LinkedIn post, and pre-qual submission'],
    ['AI search citations (GEO)', 'Zero', '0% coverage in ChatGPT/Perplexity answers about SoCal earthwork subs', 'AI Search Optimization via My SEO — own the answer to key GC estimator queries'],
    ['Pre-qual portals', 'BuildZoom active; others unknown', 'ConstructConnect, Dodge, PlanetBids profiles drive invite frequency', 'Audit and optimize all portals; ensure project history and capacity data is current'],
    ['Project portfolio online', '1 named project visible (Magnon)', 'Strong competitors show 10–15 named projects across market segments', 'AI-assisted content for 5–10 additional project spotlights in Q1'],
  ]
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The Pre-Qualification Moment Is Already Digital',
  'GC pre-construction teams increasingly vet a sub online — BuildZoom score, a quick Google search, a LinkedIn glance — before extending a bid invite, and a weak or absent digital footprint can quietly cost a sub the invitation. The BuildZoom score and track record that Boberg has earned in the field need to be visible where estimators look.',
  CORE_ORANGE
));
docChildren.push(spacer(160));
docChildren.push(subHeader('AI Search Reality Check', { color: CORE_ORANGE }));
docChildren.push(
  p('Here is the gap made concrete. When a GC estimator or developer asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:')
);
docChildren.push(spacer(80));
docChildren.push(calloutBox(
  'Prompt: "Best commercial earthwork and grading subcontractor for an Inland Empire warehouse project?"',
  [
    'TODAY — the AI assistant answers with whichever firms have the strongest content and third-party signals it can read: it names a couple of older, more-visible SoCal grading contractors and does NOT mention Boberg — even though Boberg has a 98 BuildZoom score (top 16% in California) and a Hillwood industrial track record. Boberg is invisible at the exact moment the estimator is forming a shortlist.',
    'AFTER GEO — the same query returns Boberg as a cited option ("Boberg Engineering & Contracting, a Corona-based commercial earthwork sub with a BuildZoom score of 98 and industrial site-prep experience for national developers…"), with the project portfolio and BuildZoom profile as the supporting evidence the assistant points to.',
  ],
  CORE_ORANGE
));
docChildren.push(
  p('(Illustrative of current AI-search behavior for this query class; the live result would be captured as part of the discovery baseline.)', { italics: true, size: 18 })
);
docChildren.push(spacer(160));
docChildren.push(subHeader('The Cost of Waiting', { color: CRITICAL }));
docChildren.push(
  p('AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter Boberg is not cited, the assistants — and the GC estimators who increasingly trust them — learn to answer "best earthwork sub in the Inland Empire" with someone else, and that default, once set in the training and retrieval data, is far harder and more expensive to dislodge than to claim now. Among the seven named SoCal competitors researched for this report, none yet shows an AI-search or bid-intelligence presence; that window is widest before one of them builds it. The cost of waiting is not zero — it is a competitor becoming the default answer, and Boberg sliding off invite lists it never knew it was on.')
);

// ─────────────── 08 TECHNIJIAN CAPABILITY PROOF ───────────────
docChildren.push(...sectionHeader('08 — Technijian Capability Proof'));
docChildren.push(spacer(160));
docChildren.push(
  p('Before recommending any AI investment, Technijian must prove it has built the specific capabilities Boberg Engineering needs. The four proven builds below are drawn from completed client engagements — not concepts or prototypes. Each maps directly to a challenge Boberg faces today.')
);
docChildren.push(spacer(120));
docChildren.push(capabilityBox(
  'Proven Build 1 — Multi-Agent SEO + AEO Platform',
  'Technijian deployed a multi-agent AI system using Claude, GPT-4o, and Gemini in parallel with MCP integrations for SEMrush, Google Analytics 4, and Perplexity. The platform generates, publishes, and optimizes authority content at scale — including AI Search Optimization so client answers surface in ChatGPT and Perplexity alongside traditional search.',
  'GC estimators search for grading subs before extending bid invites. Boberg needs to own the answer to "commercial earthwork contractor SoCal," "Corona grading sub warehouse," and "top-rated grading contractor Inland Empire" — in Google, in ChatGPT, and in Perplexity. This is the platform that delivers that ownership.'
));
docChildren.push(spacer(100));
docChildren.push(capabilityBox(
  'Proven Build 2 — AI Document Intelligence (RFPs: Days → Minutes)',
  'For a B2B client with complex proposal-heavy sales cycles, Technijian built an AI document intelligence system that extracts scope from inbound documents (plans, specs, RFPs), auto-drafts the response using the client\'s standard language library, and flags non-standard terms for human review. Turnaround dropped from 4–5 days to same-day.',
  'Boberg prepares competitive bids from civil plans and project specifications. An AI system that extracts earthwork scope from a set of plans and auto-drafts a proposal using BBE\'s standard bid language — qualifications, alternates, unit pricing ranges — cuts bid prep from 5 days to less than 1 day and reduces scope-gap errors that cause VE pain post-award.'
));
docChildren.push(spacer(100));
docChildren.push(capabilityBox(
  'Proven Build 3 — Weaviate + Obsidian Knowledge Retention System',
  'Technijian built a vector-database-backed knowledge system for a client with decades of institutional knowledge locked in files and key people\'s heads. Project histories, lessons learned, client preferences, and domain rules were ingested and made searchable via natural language. Knowledge now survives key-person transitions.',
  '33 years of Boberg project data — soil conditions encountered, production rates, estimating rules-of-thumb, GC preferences, lessons from challenging sites — lives in Chad\'s and Larry\'s heads. An AI knowledge system captures this before it walks out the door at retirement, and makes it searchable for new estimators so onboarding time drops from months to weeks.'
));
docChildren.push(spacer(100));
docChildren.push(capabilityBox(
  'Proven Build 4 — AI-Native Custom App Delivery (3–5× Faster)',
  'Technijian\'s AI-Native SDLC v7.0 delivers custom workflow tools, calculators, and CRM-adjacent systems in weeks rather than months. For a niche B2B client, Technijian built a custom account tracking and pipeline tool tailored to their specific sales motion — not a re-skinned generic CRM.',
  'No off-the-shelf CRM tracks a commercial earthwork sub\'s bid pipeline the right way — by project type, GC relationship, estimator contact, win/loss rate, and proposal turnaround time. My Dev can build a Bid Intelligence Platform custom-fitted to how Boberg actually works: ConstructConnect/Dodge feed ingestion, GC account profiles, bid history, and proposal draft automation in one tool.'
));
docChildren.push(spacer(160));
docChildren.push(subHeader('How We Keep AI Affordable — Seven Models, Routed by Task'));
docChildren.push(spacer(80));
docChildren.push(
  p('A fair question about running AI across content, bid intelligence, and proposals: won\'t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.')
);
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
  [
    [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass, compliance-critical answers, deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
    [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — earthwork content, outreach personalization, proposal drafting, GC account scoring', { text: '~30–40%', color: TEAL }],
    [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, scope extraction from plans, enriching and tagging thousands of bid records', { text: '~50–60%', color: BRAND_GREY }],
  ],
  { headerColor: DARK_CHARCOAL }
));
docChildren.push(
  p('The result: Boberg pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single bid proposal, for example, has scope extracted from the civil plans by a low-cost model, the draft built and tightened by a mid model, and a final accuracy-and-language pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI-engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 })
);

// ─────────────── 09 UNDERSTANDING AI — FIELD GUIDE ───────────────
docChildren.push(...sectionHeader('09 — Understanding AI: A Field Guide for Boberg Engineering Leadership'));
docChildren.push(spacer(140));
docChildren.push(
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Boberg sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that Chad, Matthew, and the Boberg team can judge every recommendation that follows on its merits.')
);
docChildren.push(spacer(140));

docChildren.push(subHeader('What AI Actually Is — and Isn\'t', { color: CORE_BLUE }));
docChildren.push(
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:')
);
docChildren.push(bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft this earthwork bid from the plan takeoff and our standard language." This is where almost all near-term value lives.'));
docChildren.push(bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the bid portals and flag the projects worth our time." This comes later, where it earns its place.'));
docChildren.push(
  p('The operating principle (Anthropic\'s guidance on building AI systems) is to use the simplest thing that works. Boberg starts with simple automations that pay off in the first 90 days, and adds autonomous agents only where the value is proven — which is exactly how the roadmap in this report is sequenced.')
);
docChildren.push(spacer(140));

docChildren.push(subHeader('Where Boberg Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }));
docChildren.push(
  p('Most established, well-run firms — including Boberg — sit at the first rung of a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.')
);
docChildren.push(spacer(80));
docChildren.push(buildTable(
  [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Boberg Today', weight: 1.4, align: AlignmentType.CENTER }],
  [
    [{ text: '1. Foundational', bold: true }, { text: 'Little or no AI; bids, account tracking, and knowledge are manual and people-dependent', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
    ['2. Emerging', 'First AI tools appear — content drafting, a bid-portal alert, a knowledge search — used in spots, not yet systematic', ''],
    ['3. Operational', 'AI runs specific workflows day-to-day — bid intelligence, proposal drafting, content — with measured results', ''],
    ['4. Scaled', 'AI is embedded across growth and operations with governance and dashboards', ''],
    ['5. Transformational', 'AI is the default way the business bids, sells, and runs', ''],
  ],
  { headerColor: CORE_BLUE }
));
docChildren.push(
  p('Boberg sits at Foundational today — strong in the field, with the AI layer not yet built. This report is the plan to reach Operational — AI working in the bid-and-growth engine and inside the back office — within twelve months.', { spaceBefore: 80 })
);
docChildren.push(spacer(140));

docChildren.push(subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }));
docChildren.push(
  p('The U.S. government\'s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a commercial construction firm like Boberg, three risks matter most, and each has a concrete control:')
);
docChildren.push(spacer(80));
docChildren.push(buildTable(
  [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
  [
    ['Hallucination', 'AI can state a confident, wrong answer — a wrong quantity or a missed exclusion on a bid', 'Human-in-the-loop review on anything client-facing or contractually binding — AI drafts, an estimator approves'],
    ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — bid pricing, GC relationship notes, and project history never touch a public model'],
    ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — led by a CISSP-certified team'],
  ],
  { headerColor: DARK_CHARCOAL }
));
docChildren.push(spacer(140));

docChildren.push(subHeader('What Comparable Organizations Are Already Doing', { color: CORE_BLUE }));
docChildren.push(bullet('Construction subcontractors: firms are using bid-portal monitoring and AI scoring to see qualified projects earlier and bid only the work that fits — responding faster than competitors still working from email alerts.'));
docChildren.push(bullet('Document-heavy trades: contractors are turning multi-day proposal and takeoff assembly into a same-day, scope-complete draft — submitting more clean bids with the same estimating team.'));
docChildren.push(bullet('Regional B2B service firms: companies are using AI search optimization to become the cited answer when buyers ask AI tools "who is the best [trade] contractor in [region]?" — capturing demand competitors never see.'));
docChildren.push(
  p('These are representative directions of travel across comparable industries, not guarantees; Boberg\'s own numbers would be confirmed in discovery. Technijian\'s specific, measured results from prior builds appear in Section 8 (Capability Proof) and Section 10.', { italics: true, size: 19, spaceBefore: 40 })
);
docChildren.push(spacer(140));

docChildren.push(subHeader('A Day in the Life — A Boberg Estimator', { color: CORE_BLUE }));
docChildren.push(calloutBox(
  'Before vs. After AI',
  [
    'TODAY: An estimator learns about a project when the bid invite lands in the inbox — often the same day competitors got it. They take five days to read the civil plans, hand-build the earthwork takeoff, write the proposal from scratch, and chase down the qualifications and exclusions from memory and old bids.',
    'WITH AI: A pre-scored alert flags the project 24–48 hours early — project type, GC, size, location, margin profile. An AI assistant extracts the earthwork scope from the plans and drafts the bid in Boberg\'s standard language — qualifications, alternates, unit-price ranges, exclusions — in minutes; the estimator reviews and approves. The bid goes out clean in a day instead of five, and 33 years of estimating know-how is captured in the system instead of one person\'s head.',
  ],
  CORE_BLUE
));
docChildren.push(spacer(140));

docChildren.push(subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }));
docChildren.push(buildTable(
  [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
  [
    ['DIY tools', 'Inexpensive, but Boberg assembles, secures, and governs everything — and owns the three risks above alone'],
    ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
    [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
  ],
  { headerColor: CORE_BLUE }
));
docChildren.push(
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 })
);

// ─────────────── 10 HOW AI TRANSFORMS BOBERG'S GROWTH ENGINE ───────────────
docChildren.push(...sectionHeader('10 — How AI Transforms Boberg\'s Bid & Growth Engine'));
docChildren.push(spacer(160));
docChildren.push(
  p('Boberg\'s growth engine is account-based, not volume-driven. The opportunity is not to spray marketing at a broad anonymous market — it is to be the sub that specific GC estimators think of first, the sub that developers call before the GC is even selected, and the sub that turns bid wins into preferred-sub relationships. AI accelerates all three motions at once.'),
  p('The architecture diagram below shows how the three channels — Inbound Authority, Outbound Intelligence, and Internal Efficiency — work together as a single growth system:')
);
docChildren.push(spacer(100));
docChildren.push(diagramImage(DIAGRAM_ARCH_BUF, 'AI Bid & Growth Engine Architecture', 580));
docChildren.push(diagramCaption('Figure 10.0 — Boberg AI Growth Engine: Inbound Authority · Outbound Intelligence · Internal Efficiency'));
docChildren.push(spacer(160));

docChildren.push(subHeader('Inbound — Authority: Get Found Before the Bid Invite'));
docChildren.push(spacer(80));
docChildren.push(
  p('GC estimators verify subs before inviting them to bid. They Google, they check BuildZoom, they look at LinkedIn. The inbound channel builds Boberg\'s authority in those exact discovery moments so that when a new project lands in an estimator\'s queue, BBE is already the "safe choice" they recognize.'),
  bullet('AEO / SEO content engine — publish monthly earthwork authority articles targeting the specific queries GC estimators run: "commercial grading contractor SoCal," "industrial earthwork sub Inland Empire," "Corona CA demolition contractor." My SEO Tier 2 with AI Search Optimization ensures BBE appears in Google, ChatGPT, and Perplexity.'),
  bullet('LinkedIn professional authority — bi-weekly project spotlights and earthwork insight posts targeting GC estimators and industrial developers. Showcase the Magnon Business Center and 5–8 additional named projects. Target 500+ followers within 6 months.'),
  bullet('Pre-qualification portal authority — optimize BuildZoom, ConstructConnect, and Dodge profiles with current project history, capacity data, certifications, and safety record. The 98 BuildZoom score is Boberg\'s strongest credibility asset — it belongs in every pre-qual submission and profile headline.')
);
docChildren.push(spacer(120));
docChildren.push(subHeader('Outbound — Intelligence: Act First on Every Bid Signal'));
docChildren.push(spacer(80));
docChildren.push(
  p('The outbound channel is not cold prospecting. It is targeted, intelligence-driven outreach to a known list of GC firms and industrial developers — the exact buyers BBE already sells to or wants to sell to. AI makes Boberg the first sub to see every opportunity in their sweet spot, and the best-prepared when they walk into a GC relationship meeting.'),
  bullet('Bid portal intelligence — AI monitors ConstructConnect, Dodge, and PlanetBids continuously for new earthwork and demolition scopes in SoCal matching BBE\'s project-type criteria (warehouse, medical, retail, $500K–$5M+). Pre-scored alerts — project type, GC, size, location, estimated margin profile — land in Chad\'s inbox within 24 hours of posting.'),
  bullet('GC account intelligence — for each of BBE\'s top 20 target GC firms, My AI auto-pulls project pipeline, recent permit filings, new project awards, and leadership changes. Before every GC relationship call, Chad receives a one-page dossier with what the GC is working on, who is leading pre-con, and any new bids in the pipeline.'),
  bullet('Industrial developer trigger monitoring — AI watches for new industrial permit filings, entitlement approvals, and site acquisitions by Hillwood-type developers (Prologis, Rexford, Majestic) across the Inland Empire, OC, and LA Basin. BBE reaches the developer before a GC is selected — and before any competing sub knows the project exists.')
);
docChildren.push(spacer(120));
docChildren.push(subHeader('Internal — Efficiency: Bid Faster, Know More, Lose Less Knowledge'));
docChildren.push(spacer(80));
docChildren.push(
  p('The internal channel recovers time and knowledge that the current manual process loses daily. Faster proposals mean more bids returned on time. A searchable knowledge base means the next estimator hired at Boberg inherits 33 years of field intelligence instead of starting from zero.'),
  bullet('Proposal auto-drafting — AI extracts earthwork scope from a set of civil plans and auto-drafts a bid using BBE\'s standard language library: qualifications, unit pricing ranges, alternates, exclusions, and schedule assumptions. Bid prep time drops from 5 days to less than 1 day. Scope accuracy improves.'),
  bullet('Knowledge retention system — 33 years of project data, soil conditions, production rates, lessons learned, and estimating rules-of-thumb are ingested into a vector-searchable knowledge base. New estimators query it in plain English. Key-person knowledge survives retirement.'),
  bullet('Project documentation AI — AI-assisted RFI responses, daily reports, and submittal cover letters reduce PM administrative time. SWPPP and NPDES template automation ensures compliance documentation is complete without pulling a PM off the field.')
);
docChildren.push(spacer(160));

docChildren.push(subHeader('AI Tools Matrix'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'AI Tool / Capability', weight: 2.5 }, { label: 'Use Case for Boberg', weight: 3 }, { label: 'Projected Impact Metric', weight: 2 }, { label: 'Technijian Service', weight: 1.5 }],
  [
    ['AEO / SEO Content Engine', 'Publish earthwork authority articles targeting GC estimator search queries; AI search optimization for ChatGPT/Perplexity citations', '+3 inbound GC discovery contacts/year; 0→top-3 search ranking for target queries', 'My SEO Tier 2 + AI Search Opt'],
    ['LinkedIn Project Spotlights', 'Bi-weekly posts showcasing BBE project portfolio and earthwork expertise targeting GC/developer audience', '58 → 500+ followers in 6 months; 5+ direct engagement contacts from target GC firms', 'My SEO + PR'],
    ['Bid Portal Intelligence', 'Daily ConstructConnect + PlanetBids + Dodge monitoring with AI pre-scoring by project type, GC, size, and location', '+20% bid invitation awareness; 24–48 hr head start on new project postings vs. competitors', 'My AI'],
    ['GC Account Intelligence', 'Auto-pull pipeline, permits, award history for top 20 target GC accounts; pre-meeting dossiers delivered before relationship calls', 'Conversation quality per GC meeting; estimated 1–2 new preferred-sub relationships/year', 'My AI'],
    ['Developer Trigger Monitoring', 'Watch for industrial permit filings and site acquisitions by target developers; outreach timed before GC selection', '2–3 pre-GC outreach opportunities/year to industrial developers; estimated 1 direct developer contract', 'My AI'],
    ['Proposal Auto-Drafting', 'Extract scope from civil plans; auto-draft bid with BBE standard language; flags non-standard terms', 'Bid prep: 5 days → <1 day; proposal scope-gap errors: estimated −40%', 'My AI + My Dev'],
    ['Knowledge Retention System', '33 years of project data and estimating rules ingested into a searchable AI knowledge base', 'New estimator onboarding: months → weeks; institutional knowledge preserved through key-person transitions', 'My AI'],
    ['Project Documentation AI', 'AI-assisted RFI responses, daily reports, submittals, SWPPP/NPDES templates auto-generated per project type', 'PM admin time: estimated −3 hrs/project; SWPPP compliance errors: −80%', 'My AI'],
  ]
));

// ─────────────── 10 BUSINESS IMPACT & SERVICE INVESTMENT ───────────────
docChildren.push(...sectionHeader('11 — Business Impact & Service Investment'));
docChildren.push(spacer(160));

docChildren.push(subHeader('KPI Lift Projections'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'KPI', weight: 2 }, { label: 'Current Estimated Baseline', weight: 2 }, { label: 'Projected Lift (Y1)', weight: 2 }, { label: 'Driver', weight: 2 }],
  [
    ['Bid invitation volume (annual)', 'Estimated current (confirmed at discovery)', '+15–25% via portal intelligence and pre-qual authority', 'My SEO + My AI bid monitoring'],
    ['Bid win rate (awarded / submitted)', 'Estimated current (confirmed at discovery)', '+5–10 percentage points via proposal speed and scope accuracy', 'My AI proposal drafting'],
    ['Time to submit a bid', '3–5 business days', '<1 business day', 'My AI scope extraction + proposal auto-draft'],
    ['New direct developer contacts (Y1)', 'Estimated 1–2 per year (referral)', '+2–3 from trigger monitoring and authority content', 'My AI developer intelligence + My SEO'],
    ['LinkedIn followers', '58', '500+ in 6 months', 'My SEO content engine + project spotlights'],
    ['GEO / AI search citations', '0', 'Top-3 answer for target GC estimator queries', 'My SEO AI Search Optimization'],
    ['New preferred-sub GC relationships (Y1)', 'Estimated current', '+1–2 via account intelligence and relationship cadence', 'My AI account intelligence'],
  ]
));
docChildren.push(spacer(160));

docChildren.push(subHeader('Year-1 ROI Model — vs. Entry Program'));
docChildren.push(spacer(100));
docChildren.push(
  p('The ROI model below is projected against the Entry Program only — the conservative "land" investment. Earthwork subcontractor gross margin on commercial SoCal projects runs approximately 10–14 percent. Using a conservative average of 12 percent and a conservative average project scope of $600,000, each additional bid win generates approximately $72,000 in gross margin. All figures are estimated and conservative; confirmed at discovery.', { italics: true, size: 20 })
);
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Scenario', weight: 1.5 }, { label: 'Projected Outcome (Y1)', weight: 2.5 }, { label: 'Estimated Value Generated', weight: 2 }, { label: 'ROI vs. $35.6K Entry', weight: 2 }],
  [
    [{ text: 'Downside-Protected', bold: true, color: BRAND_GREY }, '1 additional project win sourced or accelerated by AI bid intelligence', '~$60K gross margin', { text: '1.7×', bold: true, color: TEAL }],
    [{ text: 'Expected', bold: true, color: CORE_BLUE }, '2–3 additional project wins + 1 new GC invited-bid relationship', '~$180K–$250K gross margin', { text: '5.1×–7.0×', bold: true, color: CORE_BLUE }],
    [{ text: 'Upside', bold: true, color: CORE_ORANGE }, '1 direct industrial developer relationship (repeat scope, no GC intermediary)', '$300K–$500K/yr gross margin ongoing', { text: '8.4×–14.0×', bold: true, color: CORE_ORANGE }],
  ]
));
docChildren.push(spacer(120));
docChildren.push(calloutBox(
  'The Upside Is Compounding',
  'A single industrial developer relationship — the Hillwood model — does not deliver one project. It delivers a portfolio. Every warehouse pad completed on schedule for a national developer opens the next project conversation before the RFP is ever issued. The ROI on that relationship is not 1× — it is years of repeat, negotiated, high-margin scope.',
  TEAL
));
docChildren.push(spacer(160));

docChildren.push(subHeader('The Entry Offer — The 90-Day AI Bid-Visibility Pilot', { color: CORE_BLUE }));
docChildren.push(spacer(80));
docChildren.push(
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up Boberg\'s AI-search presence, the pre-qualification authority that gets BBE onto more invite lists, and the bid-monitoring configuration — and proves the lift before any larger build (the My Dev Bid Intelligence Platform) is discussed.')
);
docChildren.push(spacer(120));
docChildren.push(subHeader('Service Investment Map — Land and Expand'));
docChildren.push(spacer(100));
docChildren.push(
  p('The investment is structured land-and-expand: the 90-Day AI Bid-Visibility Pilot is the easy yes — quick-win recurring services that pay for themselves fast, with no large up-front build. The Expansion adds the custom platform and deeper intelligence layer once the entry proves the lift.', { italics: true, size: 20 })
);
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Service', weight: 2.5 }, { label: 'Tier / Description', weight: 3 }, { label: 'Monthly', weight: 1.5 }, { label: 'Y1 Total', weight: 1.5 }],
  [
    [{ text: 'THE 90-DAY AI BID-VISIBILITY PILOT — Phase 1', bold: true, color: CORE_BLUE }, { text: 'Quick-win recurring services — no large build required', bold: true, color: CORE_BLUE }, { text: '—', bold: true, color: CORE_BLUE }, { text: '—', bold: true, color: CORE_BLUE }],
    ['My SEO', 'Tier 2 + AI Search Optimization + PR + Content Syndication', '$1,550/mo', '$18,600'],
    ['My AI Workshop', 'Executive AI Workshop — map targets, define bid criteria, build AI strategy (1× upfront)', '—', '$5,000'],
    ['My AI Advisor', 'Fractional AI Advisor — Starter, 2 hrs/mo. Account intelligence setup, bid monitoring configuration, quarterly strategy sessions', '$1,000/mo', '$12,000'],
    [{ text: 'ENTRY PROGRAM TOTAL', bold: true, color: CORE_BLUE }, '', { text: '$2,550/mo', bold: true, color: CORE_BLUE }, { text: '~$35,600 Y1', bold: true, color: CORE_BLUE }],
    [{ text: 'EXPANSION — Phase 2 (once entry proves lift)', bold: true, color: CORE_ORANGE }, { text: 'Custom build + deeper intelligence — the upsell after entry ROI is visible', bold: true, color: CORE_ORANGE }, { text: '—', bold: true, color: CORE_ORANGE }, { text: '—', bold: true, color: CORE_ORANGE }],
    ['My Dev', 'Bid Intelligence Platform — ConstructConnect/Dodge feed ingestion, pre-scoring, proposal auto-drafting, GC CRM (Phase 2)', '—', '$40,000–$60,000'],
    ['My Dev', 'Managed App Services — ongoing platform hosting, updates, and support', '$800/mo', '$9,600'],
    ['My AI Advisor', 'Fractional AI Advisor — Expanded, 4 hrs/mo. Knowledge base build, intelligence system expansion', '$2,000/mo', '$24,000'],
    [{ text: 'FULL ENGINE TOTAL (Entry + Expansion)', bold: true, color: DARK_CHARCOAL }, '', { text: '—', bold: true, color: DARK_CHARCOAL }, { text: '~$109K–$129K Y1', bold: true, color: DARK_CHARCOAL }],
  ]
));
docChildren.push(spacer(120));
docChildren.push(
  p('All investment figures are estimated and confirmed at formal quote. Labor rates (for any ad-hoc or project work): US Tech Support $125/hr contracted; US vCIO/Strategy $225/hr contracted. Investment shown is client-facing; full quote provided at discovery meeting.', { size: 18, italics: true })
);
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The Pilot Bar — and Our Commitment',
  [
    'Success metric: within 90 days, Boberg is the cited or top-ranked answer for at least one high-intent GC-estimator query (e.g. "commercial earthwork contractor Inland Empire" / "Corona grading contractor") in Google and at least one AI assistant (ChatGPT, Perplexity, or Copilot), AND bid-portal monitoring is live and delivering pre-scored project alerts to Chad.',
    'Our commitment: the entry program is month-to-month, with no lock-in. If the pilot has not hit the metric above by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it. You carry the upside, not the risk.',
  ],
  CORE_ORANGE
));

// ─────────────── 12 IMPLEMENTATION ROADMAP ───────────────
docChildren.push(...sectionHeader('12 — Implementation Roadmap'));
docChildren.push(spacer(160));
docChildren.push(
  p('The roadmap is paced for a commercial construction business that cannot slow down operations during implementation. The Entry Program launches in Phase 1 with no disruption to Boberg\'s bid and operations cycle; the intelligence systems build on that foundation in Phase 2; and the custom platform engagement begins in Phase 3 after Phase 1 ROI is established.'),
  p('The timeline diagram below shows the three phases with milestones:')
);
docChildren.push(spacer(100));
docChildren.push(diagramImage(DIAGRAM_TIMELINE_BUF, 'Implementation Timeline', 580));
docChildren.push(diagramCaption('Figure 12.0 — 270-Day Implementation Roadmap: Foundation → Intelligence → Growth'));
docChildren.push(spacer(160));
docChildren.push(buildTable(
  [{ label: 'Phase', weight: 1.5 }, { label: 'Period', weight: 1 }, { label: 'Key Milestones', weight: 4 }, { label: 'Outcome', weight: 2 }],
  [
    [{ text: 'Phase 1 — Foundation', bold: true, color: CORE_BLUE }, 'Days 1–90', 'Digital authority baseline (Google Business Profile, LinkedIn, ConstructConnect/Dodge profiles). AI Executive Workshop: map 20 target GCs, define bid sweet-spot criteria. My SEO launch: keyword strategy, first authority article, AEO setup. Nexus Assess IT risk baseline (optional).', 'Boberg is findable, verifiable, and credible in every digital channel GC estimators use.'],
    [{ text: 'Phase 2 — Intelligence', bold: true, color: CORE_ORANGE }, 'Days 90–180', 'Bid portal monitoring live (ConstructConnect + PlanetBids pre-scored daily alerts). Account intelligence: top 20 GC accounts with trigger monitoring. Pre-meeting dossiers delivered before first GC relationship calls. AI proposal template built and live-tested on first real bid. Content engine: monthly earthwork insight articles publishing.', 'Boberg bids smarter, acts first, and arrives at every GC meeting better prepared than the competition.'],
    [{ text: 'Phase 3 — Growth', bold: true, color: TEAL }, 'Days 180–270', 'Bid win rate baseline established; AI-attributed wins tracked. Monthly pipeline intelligence reports by named GC account delivered to Chad. Knowledge retention system ingested with BBE project history. My Dev Bid Intelligence Platform scoped and engagement initiated. First named-developer dossiers delivered for pre-bid outreach.', 'Boberg wins more bids, converts GC relationships to preferred-sub status, and owns the institutional knowledge that competitors cannot replicate.'],
  ]
));

// ─────────────── 12 QUICK WINS ───────────────
docChildren.push(...sectionHeader('13 — Quick Wins: Week 1, No Contract Required'));
docChildren.push(spacer(160));
docChildren.push(
  p('The actions below cost nothing and require no Technijian engagement. They close the most visible gaps in Boberg\'s digital presence and lay the groundwork for the AI systems to build on. Each is completable in a day or less:')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: '#', weight: 0.4 }, { label: 'Quick Win', weight: 2 }, { label: 'Action', weight: 3.5 }, { label: 'Why It Matters', weight: 2 }],
  [
    ['1', 'Free Nexus Assess', 'Request a complimentary Technijian Nexus Assess — an IT risk assessment covering internal vulnerability, external vulnerability, dark-web credential check, and a Microsoft 365 review. Delivered as a prioritized remediation roadmap.', 'No-cost way to identify IT exposures before they become a bid qualification problem. Maps to any compliance framework. The natural first step before any AI investment.'],
    ['2', 'Claim Google Business Profile', 'Search "Boberg Engineering Contracting Corona CA" in Google Maps. Claim and optimize the Google Business Profile: add photos of field work, current hours, services, license numbers, and link to bobergeng.com.', 'GC estimators who Google BBE see the GBP before the website. An empty or unclaimed GBP is a pre-qualification red flag.'],
    ['3', 'Audit pre-qual portals', 'Log into ConstructConnect and PlanetBids (or create accounts if none exist). Verify company profile is current: license classes, project types, geographic coverage, capacity, safety record, and recent project references.', 'Bid portal profiles drive invite frequency. An outdated or incomplete profile means BBE is skipped in filtered sub searches.'],
    ['4', 'LinkedIn project sprint', 'Post 3 project spotlights in the next 30 days: Magnon Business Center + 2 others. Include: project type, GC, location, scope size, timeline, and a photo. Tag the GC in each post.', 'Shows real work at real scale. GC estimators who visit BBE\'s LinkedIn after a Google search find evidence of capability — not an empty feed.'],
    ['5', 'Build the target GC list', 'List the 20 GC firms Boberg most wants to work with. Classify each as: (a) active relationship, (b) bid once / no relationship, or (c) never approached. This list is the foundation of the AI account intelligence system.', 'The account intelligence system is only as good as the target list. Starting with a classified roster lets My AI prioritize the right accounts from day one.'],
    ['6', 'Set Google Alerts', 'Set Google Alerts for: "[Target GC name] new project," "commercial construction permit [IE/OC/LA]," "warehouse construction Southern California 2026," and "industrial development Inland Empire."', 'Free manual version of what My AI automates at scale. Immediately surfaces new project signals in target markets.'],
  ]
));

// ─────────────── 14 QUESTIONS WE USUALLY GET (FAQ) ───────────────
docChildren.push(...sectionHeader('14 — Questions We Usually Get'));
docChildren.push(spacer(160));
docChildren.push(
  p('The honest answers to the questions Boberg leadership is most likely asking right now.')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
  [
    [{ text: 'We already work with a marketing or web person. Why add Technijian?', bold: true }, 'Keep them — if traditional web and SEO work is being done, this sits alongside it. We add the layer most general agencies do not: AI-search optimization (GEO) so estimators\' AI tools cite Boberg, plus bid-portal intelligence, account dossiers, and proposal automation no marketing firm provides. We run alongside your existing help, not over it.'],
    [{ text: 'Isn\'t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — proposal drafting, bid-portal alerts, authority content — not autonomous "agents" running your bids. We use the simplest tool that works, measure it, and only expand what earns its place.'],
    [{ text: 'Is our data — bid pricing, GC relationships, project history — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything client-facing or contractually binding, led by a CISSP-certified team. Data governance is part of the complimentary Nexus Assess in the entry program.'],
    [{ text: 'We\'re a lean shop. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give your estimators back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing what we draft. The fractional advisor model means no new hire to manage.'],
    [{ text: 'What if it doesn\'t work?', bold: true }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 11), month-to-month with no lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
    [{ text: 'What does it really cost?', bold: true }, 'The entry program — the 90-Day AI Bid-Visibility Pilot — is about $35.6K for Year 1 at published rates: no hidden fees, no large up-front build. The full engine (the custom Bid Intelligence Platform and deeper intelligence) is profiled in Section 11, but only after the pilot proves the lift.'],
  ],
  { headerColor: CORE_BLUE }
));

// ─────────────── 15 CONCLUSION + CTA ───────────────
docChildren.push(...sectionHeader('15 — Conclusion & Next Step'));
docChildren.push(spacer(160));
docChildren.push(
  p('Boberg Engineering has earned its reputation one completed pad at a time over 33 years. The field performance is not the problem. The problem is that the estimator who just received a new warehouse project in Ontario has three subs in their head — and Boberg may not be one of them, not because the work is not good, but because the digital shelf is empty.'),
  p('AI solves that problem on both sides of the bid funnel: the authority and discoverability that gets BBE onto more invite lists, and the bid intelligence and proposal speed that turns more invitations into awards. The entry program is designed to prove this on a small budget before any large build is committed.'),
  p('The first step is a 30-minute conversation. Technijian will review Boberg\'s current bid pipeline, target GC list, and field capacity — and deliver a calibrated first-year plan with real numbers before any commitment is made. The full blueprint is available on request.')
);
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'Next Step',
  [
    'Use the Book a Meeting button in Ravi\'s signature to schedule 30 minutes and walk through the strategy, the entry program, and all the AI work Technijian is deploying for itself and its clients across Southern California.',
    'Questions before the meeting? Reach Ravi directly: rjain@technijian.com · 949.379.8499',
  ],
  CORE_BLUE
));

// ─────────────── 14 ABOUT TECHNIJIAN ───────────────
docChildren.push(...sectionHeader('16 — About Technijian'));
docChildren.push(spacer(160));
docChildren.push(
  p('Technijian is a Southern California managed IT services and AI strategy firm founded in 2000. Headquartered in Irvine with a delivery center in Panchkula, India, Technijian serves clients across the commercial construction, professional services, healthcare, and logistics sectors with three AI-native service lines:')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Service', weight: 1.5 }, { label: 'What It Delivers', weight: 3.5 }, { label: 'Best For', weight: 2 }],
  [
    ['My AI', 'AI strategy, implementation, and ongoing advisory — from Executive Workshops to full AI system deployment including bid intelligence, account intelligence, document automation, and knowledge retention systems', 'Firms that want AI embedded in operations, not a one-time consultation'],
    ['My SEO', 'Full-service SEO + AI Search Optimization (AEO) — authority content, pre-qualification portal management, LinkedIn professional authority, AI search citation ownership, and local/professional search presence', 'Firms that need to be found and verified by known buyers before the bid invite'],
    ['My Dev', 'Custom AI-native application development — bid intelligence platforms, CRM tools, workflow automation, and any custom build a specific business process requires. Delivered 3–5× faster with AI-native SDLC v7.0', 'Firms that need a specific tool built for how they actually work — not a re-skinned generic SaaS'],
  ]
));
docChildren.push(spacer(160));
docChildren.push(buildTable(
  [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 3 }],
  [
    ['Founder & CEO', 'Ravi Jain — rjain@technijian.com'],
    ['Phone', '949.379.8499'],
    ['Website', 'technijian.com'],
    ['USA HQ', '18 Technology Dr., Ste 141, Irvine, CA 92618'],
    ['India Delivery Center', 'Plot No. 07, 1st Floor, Panchkula IT Park, Panchkula, Haryana 134109'],
    ['Tagline', 'technology as a solution'],
  ],
  { headerColor: DARK_CHARCOAL }
));

// ─────────────── APPENDIX — WORKS CITED ───────────────
docChildren.push(...sectionHeader('Appendix — Works Cited'));
docChildren.push(spacer(160));
docChildren.push(buildTable(
  [{ label: '#', weight: 0.4 }, { label: 'Source', weight: 2.5 }, { label: 'Used For', weight: 3 }],
  [
    ['1', 'bobergeng.com — company website', 'Services, project portfolio, contact information'],
    ['2', 'ZoomInfo — Boberg Engineering & Contracting profile', 'Employee count, revenue range, leadership'],
    ['3', 'D&B Company Profile — Boberg Engineering Inc., Corona CA', 'Revenue figure (2024), founding year, address'],
    ['4', 'BuildZoom contractor profile — license classes, score', 'BuildZoom score 98, top 16% CA; license categories'],
    ['5', 'BBB Business Profile — Boberg Engineering & Contracting Inc.', 'General Engineering Contractor classification, Corona CA'],
    ['6', 'LinkedIn — Boberg Engineering & Contracting, Inc.', 'Follower count (58), Chad Boberg, Larry Boberg profiles'],
    ['7', 'LinkedIn — Chad Boberg (President)', 'Leadership confirmation'],
    ['8', 'RocketReach / SignalHire — Boberg Engineering profile', 'Employee count cross-reference'],
    ['9', 'ForConstructionPros.com — AI Adoption in Commercial Construction (2026)', 'AI adoption rate (38%), bid management accuracy (85–90%)'],
    ['10', 'ConstructionOwners.com — AI Adoption Doubles in 2026', 'AI adoption surge statistics'],
    ['11', 'Quotr Blog — State of AI in Preconstruction 2026', 'ENR top GC AI adoption data; bid management AI context'],
    ['12', 'DowntoBid.com — AI Construction Bidding article (2026)', 'Subcontractor AI bid discovery and qualification context'],
    ['13', 'SoCal Grading (socalgrading.com)', 'Competitor profile — founded 1969, turnkey civil'],
    ['14', 'SoCal Earthworks (socalearthworks.com)', 'Competitor profile'],
    ['15', 'Ironclad General Engineering research', 'Competitor profile — founded 2010'],
    ['16', 'Mark Company research', 'Competitor profile — founded 1964, full scope'],
    ['17', 'Technijian brand-tokens.json', 'All brand values: colors, logos, contact, offices, tagline'],
    ['18', 'Technijian My SEO content files', 'Pricing tiers and service definitions'],
    ['19', 'Technijian My AI content files', 'Pricing and service definitions'],
    ['20', 'Technijian skills/technijian-biz-dev-blueprint/SKILL.md', 'Blueprint methodology, voice rules, investment defaults'],
    ['21', 'MIT Sloan Management Review — AI literacy for executives', 'Section 9: framing AI literacy as "what AI can do," not how to build it'],
    ['22', 'Anthropic — Building Effective Agents', 'Section 9: the automation (workflow) vs. agent distinction'],
    ['23', 'AI maturity models (Gartner; Google Cloud AI Adoption Framework)', 'Section 9: the widely-used five-stage maturity ladder concept'],
    ['24', 'U.S. NIST AI Risk Management Framework (Govern/Map/Measure/Manage)', 'Section 9: responsible-AI controls for the three risks'],
  ]
));

// =====================================================================
// BUILD DOCUMENT
// =====================================================================
const doc = new Document({
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0,
        format: 'bullet',
        text: '•',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 260 } } },
      }],
    }],
  },
  styles: {
    default: {
      heading1: {
        run: { size: 2, color: 'FFFFFF', font: FONT_HEAD },
        paragraph: { spacing: { before: 480, after: 0 } },
      },
      heading2: {
        run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD },
        paragraph: { spacing: { before: 280, after: 120 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1800, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
      titlePage: true,
    },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const outPath = path.join(__dirname, 'BBE-AI-Growth-Report.docx');
  fs.writeFileSync(outPath, buf);
  console.log(`Written: ${outPath}`);
});
