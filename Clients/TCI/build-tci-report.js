// TCI Transportation (Transportation Commodities, Inc.) — AI-Driven Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/SCF/build-scf-report.js (RKE/ORX lineage).
// Pricing discipline: ONLY My SEO is a firm published price; everything else is rate-card
// ranges scoped in discovery. ROI is value-at-stake, not a fabricated ratio (Ravi, 2026-06-01).

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

// Brand contact — MAIN line (reaches USA + India). 8500/8501 are direct-dials only.
const MAIN_PHONE = tokens.phone.main.$value;        // 949.379.8499
const FOUNDER_EMAIL = tokens.email.founder.$value;  // rjain@technijian.com
const USA_ADDR = tokens.offices.usa.address_oneline.$value;

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-01';
const CLIENT = 'TCI Transportation';

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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to TCI: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: `Technijian  |  Irvine, CA  |  ${MAIN_PHONE}  |  technijian.com  |  Page `, size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'TCI TRANSPORTATION', size: 60, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'TCI Leasing  ·  TCI Transportation', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Commerce, California  |  tcitransportation.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for TCI Transportation', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '1978', label: 'Family-Owned Since', color: CORE_BLUE },
    { number: '3,800+', label: 'Trucks, Tractors & Trailers', color: CORE_ORANGE },
    { number: '26+', label: 'Facilities Across 10 States', color: TEAL },
    { number: '1,500+', label: 'Team Members', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('TCI Transportation is a 47-year, family-owned operator that competes against the national giants of truck leasing and logistics — Ryder and Penske — and wins on the things those giants are not built for: speed, locality, flexibility, and relationship. Founded by Gerry Flynn in 1978 and run today by his sons, co-presidents Andrew and Ryan Flynn, TCI runs two business units — TCI Leasing and TCI Transportation — across 26-plus facilities in ten states, with a fleet that has grown past 3,800 trucks, tractors, and trailers and a team of more than 1,500.'),
  p('TCI is also, notably, already an AI operator on the inside. It runs AI-powered preventative maintenance, collision-mitigation systems, and connected fleet telematics — the operational and safety AI that keeps equipment and drivers performing. That matters for what follows: this blueprint is not about teaching TCI to use AI. It is about pointing AI at the one place TCI has not yet aimed it — the commercial side of the business, where the next dollar of growth is found, won, and kept.'),
  p('The program is a focused, hybrid growth engine with three moves: get found for the demand that already searches (local and answer-engine SEO, a page for every yard and service), win the named accounts worth winning (account intelligence on fleets, shippers, and the WAIRE-obligated warehouses that have to electrify — plus RFP and lease-proposal automation), and run leaner (a quote-to-lease assistant, a WAIRE/EV ROI tool, used-truck merchandising, and a customer portal with an AI assistant). It is account-based where it should be — TCI already knows who its biggest targets are — and demand-capturing where genuine search demand exists.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'TCI runs operational AI well, but the commercial side is unbuilt: no per-yard search presence, no account-intelligence engine, no RFP or quote automation, and no tool that turns California’s EV mandates into a sales conversation. That is exactly where growth lives.',
      'The national giants (Ryder, Penske) are digitally strong but generic. TCI’s white space is being the nimble, local, family-owned operator that out-modernizes regionally and owns the California EV and WAIRE niche the giants treat as a checkbox.',
      'A diversified, recurring-revenue mix — leasing, maintenance, used trucks, factoring, logistics — is a resilience story the freight market rewards in a downturn. TCI lives that story but does not yet tell it where buyers look.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures and pricing: this blueprint was built from public information. Every projection is labeled estimated and conservative, and the discovery questions in Section 14 replace these assumptions with TCI’s real baselines. On investment, only published Technijian pricing is stated as firm; every custom build is shown with its rate-card basis and scoped in discovery, so the numbers TCI sees are real — not invented to fill a table.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE MARKET POSITION ----------
docChildren.push(
  ...sectionHeader('The Market Position', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for TCI starts with a clear-eyed view of who TCI is in its market. It is not a national mega-lessor, and it is not a small independent fighting to survive. It is something more useful: a 47-year, family-owned operator with real coast-to-coast scale — 3,800-plus units, 26-plus yards, 1,500-plus people — that competes against Ryder and Penske by being faster, more local, and more personal than a company that size can be. The founding family still runs it. Customers deal with an operator that knows their name, not a national account queue.'),
  p('That position is a strength to press, not hide. The national giants have enormous scale and capable digital tools, but their presence in any single market is generic — a national playbook applied to a local yard. TCI’s advantage is the inverse: deep regional presence across ten states, a full-service offer under one roof, and the flexibility to say yes quickly. The job of this program is to make that advantage visible and findable, and to put modern commercial AI behind the sales motion so the relationship scales.'),
  spacer(120),
  calloutBox(
    'Three Strengths to Build On',
    [
      'A diversified, two-unit model: full-service leasing, maintenance, rental, and used trucks on one side; dedicated logistics, brokerage, carrier services, and freight factoring on the other — recurring revenue that holds when spot freight does not.',
      'A real operational-AI foundation already in place — preventative maintenance, collision mitigation, and fleet telematics — which means TCI is an AI-credible operator, not an AI skeptic. The commercial layer builds on a culture that already trusts the technology.',
      'A California-rooted footprint inside the South Coast Air Basin, with EV acquisitions, charging, and WAIRE assistance already offered — a regulation-driven growth lever sitting right in TCI’s backyard.',
    ],
    CORE_BLUE
  ),
  p('The one thing TCI has not yet done is carry that story into search, into AI answers, and into a modern, AI-assisted buying experience. The strengths are real; they are simply under-marketed. Making them visible is the fastest early win, and it is where Section 13’s Quick Wins begin.', { spaceBefore: 60 }),
);

// ---------- 03 THE TCI BUSINESS MODEL ----------
docChildren.push(
  ...sectionHeader('The TCI Business Model', TEAL, '03'),
  spacer(100),
  p('TCI makes money across two business units that share one fleet, one set of yards, and one reputation. TCI Leasing is the asset-and-recurring side: full-service truck leasing with maintenance bundled in, contract maintenance for fleets that keep their own trucks, commercial rental, and used-truck sales. TCI Transportation is the logistics-and-services side: dedicated contract carriage, freight brokerage across intermodal, truckload, and LTL, reefer LTL and consolidation, carrier services, and freight factoring. Understanding both sides matters, because each service line is found, sold, and retained differently — and AI plugs into each at a different point.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How TCI Reaches the Market', 600, 1.73),
  diagramCaption('Figure 3.0 — How TCI reaches the market: two business units, the service lines, and where commercial AI plugs in'),
  spacer(120),
  subHeader('Two Units, Many Service Lines'),
  buildTable(
    [
      { label: 'Service Line', weight: 2.6 },
      { label: 'What It Is', weight: 4.2 },
      { label: 'Primary Buyer', weight: 3.2 },
    ],
    [
      ['Full-service leasing & maintenance', 'NationaLease full-service truck leasing with maintenance, licensing, and substitute vehicles bundled in', 'Private fleets choosing to lease rather than own'],
      ['Contract maintenance', 'Outsourced preventative and repair maintenance for fleets that own their trucks', 'Fleet and equipment managers'],
      ['Used trucks & commercial rental', 'Heavy- and medium-duty trucks and semi-trailers for sale; short-term and seasonal rental', 'Owner-operators, small fleets, overflow needs'],
      ['Dedicated logistics & brokerage', 'Dedicated contract carriage plus brokerage across intermodal, truckload, LTL, and reefer', 'Shippers and supply-chain teams'],
      ['Freight factoring & carrier services', 'Invoice factoring and support services for carriers and owner-operators', 'Carriers needing cash flow and back-office support'],
      ['EV / WAIRE, parking, yard & roadside', 'EV acquisitions and charging, WAIRE-program assistance, truck and trailer parking, yard management, 24/7 roadside', 'Warehouses, fleets, and operations managers'],
    ],
  ),
  spacer(160),
  subHeader('What TCI Already Does Well'),
  p('The business runs on real operational strengths — several of them already AI-powered — that get sharper with commercial AI behind them:'),
  bullet('A full-service offer under one roof: a customer can lease, maintain, rent, buy used, ship, and finance through one trusted partner and one relationship.'),
  bullet('Operational AI already in production — preventative maintenance, collision mitigation, and fleet telematics that protect uptime and safety.'),
  bullet('Deep regional density: 26-plus yards across ten states put service, parking, and maintenance physically close to the customer.'),
  bullet('Field relationships built over 47 years — the human core that commercial AI is meant to amplify, not replace.'),
  spacer(120),
  calloutBox(
    'Why the Model Rewards Commercial AI',
    [
      'Most of TCI’s revenue is recurring — leases, maintenance contracts, factoring, dedicated runs — which means winning and keeping accounts compounds. That is exactly what account intelligence and churn prediction are built to protect.',
      'The same customer often buys across several lines — a lease customer needs maintenance, a logistics customer needs trucks, a warehouse needs EV trucks and WAIRE help. Share-of-wallet growth is the cheapest growth there is, and AI is good at spotting where it sits.',
      'TCI already trusts AI on the operational side. Extending that trust to the commercial side is a shorter step than it is for a company starting cold.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 INDUSTRY & REGULATORY LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Industry & Regulatory Landscape', CORE_BLUE, '04'),
  spacer(100),
  p('Two forces shape the next few years for a multi-service truck leasing and logistics operator, and both favor the diversified operator that modernizes its commercial engine first. The first is the freight cycle and its pressures — a slow recovery, a structural driver shortage, and resilient used-truck values that reward an operator with leasing, maintenance, and used-truck lines to lean on. The second is regulation: California’s fleet-emissions rules are turning electrification from a someday-question into a deadline, and TCI sits right where that pressure is highest.'),
  spacer(140),
  subHeader('Market Forces (2025–2026)'),
  buildTable(
    [
      { label: 'Force', weight: 2.6 },
      { label: 'What’s Happening', weight: 4.2 },
      { label: 'Implication for TCI', weight: 3.2 },
    ],
    [
      ['Freight-cycle recovery', 'The 2023–25 downturn is past its worst but healing slowly; carrier exits are up sharply', 'Diversified recurring revenue (leasing, maintenance, factoring, used) is a resilience story to tell while pure carriers struggle'],
      ['Driver shortage', 'An estimated ~82,000-driver shortfall in 2026, with new licensing rules tightening supply further', 'Full-service leasing, dedicated carriage, and maintenance insulate customers from the labor crunch — a selling point'],
      ['Resilient used-truck values', 'Class 8 retail prices held near $56,000 in early 2026 even as volumes softened', 'The used-truck line stays a real revenue and trade-in lever; better merchandising captures more of it'],
      ['Freight factoring demand', 'In a tight market, factoring shifts from a growth tool to a cash-flow lifeline for carriers', 'TCI’s factoring and carrier services meet rising demand — if the right carriers can find them'],
      ['Digital consolidation', 'The leasing and brokerage field is consolidating around the digitally capable; mid-market is squeezed', 'The independent that modernizes its commercial engine defends and grows share; the one that does not gets squeezed'],
    ],
  ),
  spacer(160),
  subHeader('California’s Emissions Rules Are the EV Growth Thesis'),
  p('TCI’s Commerce headquarters and many of its California yards sit inside the South Coast Air Basin, where some of the country’s most aggressive fleet-emissions rules apply. These rules are not abstract — they put a dollar figure on electrification, and they create a buyer who needs exactly what TCI already offers: zero-emission trucks, charging, and help navigating compliance.'),
  buildTable(
    [
      { label: 'Regime', weight: 2.4 },
      { label: 'What It Requires', weight: 4.6 },
      { label: 'TCI Angle', weight: 1.8, align: AlignmentType.CENTER },
    ],
    [
      ['SCAQMD Rule 2305 (WAIRE)', 'Warehouses of 100,000+ sq ft must earn WAIRE points on truck trips; obligations rise through 2031; a zero-emission Class 6/7 truck earns points worth roughly $68,000 in avoided fees; unmet points cost up to $1,000 each', { text: 'High', color: PASS, bold: true }],
      ['CARB Advanced Clean Fleets / Trucks', 'State mandates pushing zero-emission truck adoption and sales over the next decade', { text: 'High', color: PASS, bold: true }],
      ['CARB Clean Truck Check', 'Periodic emissions testing and reporting for heavy-duty vehicles', { text: 'Medium', color: CORE_ORANGE, bold: true }],
      ['DOT / FMCSA / Hazmat', 'Driver and vehicle certifications, hours-of-service, BOLs and manifests, CSA scores', { text: 'Medium', color: CORE_ORANGE, bold: true }],
    ],
  ),
  spacer(160),
  calloutBox(
    'WAIRE Is a Sales Conversation, Not Just a Rule',
    [
      'Every WAIRE-obligated warehouse in TCI’s region faces a yearly choice: pay mitigation fees or acquire zero-emission trucks and charging that earn points. TCI sells exactly the second option — and it is physically local to those warehouses in a way the national players are not.',
      'AI can identify which warehouses are obligated by their truck-trip volume, then arm a rep with a compliance-cost-versus-zero-emission-lease comparison for that specific site. That turns a regulation into a qualified, timed sales conversation.',
      'A clarity note for honesty: Technijian builds the document and data automation that supports TCI’s compliance work and sales tools. TCI remains the expert on its own regulatory obligations; the AI accelerates the paperwork and the targeting, it does not replace professional compliance judgment.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('Before tactics, one question decides the strategy: where does TCI’s next dollar of growth actually come from? The answer is a handful of distinct demand pools — some searchable and under-captured today, and some a finite set of named accounts won by the sales team. The program serves all of them, which is why it pairs broad search capture with targeted, account-based outreach instead of one undirected campaign.'),
  spacer(120),
  buildTable(
    [
      { label: 'Demand Pool', weight: 2.2 },
      { label: 'Who’s Looking', weight: 2.6 },
      { label: 'Example Triggers / Searches', weight: 3 },
      { label: 'How TCI Wins It', weight: 2.4 },
    ],
    [
      ['Searchable local', 'Fleets, owner-operators, and buyers comparing options', '"full-service truck leasing [city]", "used semi for sale", "truck parking [city]", "reefer LTL"', 'Local + AEO SEO, a page per yard and service'],
      ['Named fleet & shipper accounts', 'Private fleets and shippers the reps know by name', '(won by outreach) fleet expansions, lease expiries, new lanes, RFPs', 'Account intelligence + per-account outreach + reps'],
      ['WAIRE-obligated warehouses', 'Operators of 100k+ sq ft warehouses in the air basin', 'Annual WAIRE deadlines; mitigation-fee exposure', 'WAIRE/EV ROI targeting + EV trucks + charging'],
      ['Carriers & owner-operators', 'Small carriers needing cash flow, trucks, parking', '"freight factoring", "used trucks", "truck parking near me"', 'Search capture + a fast quote and onboarding flow'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Ways to Grow, One Program',
    [
      'The searchable pool is demand that already exists — buyers type these queries every day and the results point to whoever shows up, which is rarely TCI today across its 26-plus yards. Local SEO, answer-engine optimization, and a fast capture layer turn that traffic into quotes and open accounts.',
      'The named fleet, shipper, and warehouse accounts are not won by search; they are won by the sales team. That track stays account-based, so the program is never an undirected blast — AI surfaces the right targets, times the outreach, and arms the rep who closes them.',
      'This honesty is the point: TCI already knows who its biggest targets are. The value of AI is depth and timing on those accounts, plus capturing the broad search demand the sales team cannot chase one quote at a time.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE TCI CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The TCI Customer', CORE_ORANGE, '06'),
  spacer(100),
  p('TCI serves a set of distinct buyer types across its two units. Each is found and sold differently, and they differ meaningfully on both account or contract value and strategic or recurring value — which is why the matrix below uses those two axes to show where to point the search effort and where to point the account-based outreach.'),
  spacer(160),

  personaCard('1 — The Fleet / Asset Manager', CORE_BLUE, [
    ['Role', 'Runs a private fleet and weighs leasing against owning — the core full-service leasing and maintenance buyer.'],
    ['Pain Points', 'Capital tied up in trucks; maintenance is a distraction from the core business; uptime and predictable monthly cost matter more than sticker price.'],
    ['Decision Driver', 'Total cost of ownership, uptime, substitute vehicles, and a partner who handles maintenance, licensing, and compliance so the team does not have to.'],
    ['AI Opportunity', 'Account intelligence finds fleets at a lease-versus-own inflection point; a quote-to-lease assistant turns interest into a fast, configured proposal.'],
    ['Technijian Hook', 'My AI — account intelligence + churn prediction on the recurring base. My Dev — quote-to-lease assistant.'],
  ]),
  spacer(160),

  personaCard('2 — The Logistics / Supply-Chain Director', CORE_ORANGE, [
    ['Role', 'Owns capacity and service for a shipper — buys dedicated contract carriage and brokerage across truckload, LTL, intermodal, and reefer.'],
    ['Pain Points', 'Capacity is volatile; dedicated service has to be reliable; switching providers is high-stakes and relationship-driven.'],
    ['Decision Driver', 'Proven reliability, coverage across lanes, and a responsive partner — won through relationships, references, and RFPs.'],
    ['AI Opportunity', 'Account intelligence and trigger monitoring (new lanes, RFPs, expiring contracts); RFP and proposal automation that lets TCI respond faster and to more bids.'],
    ['Technijian Hook', 'My AI — account intelligence + RFP/proposal automation. My SEO — capture dedicated-carriage and reefer search demand.'],
  ]),
  spacer(160),

  personaCard('3 — The WAIRE-Obligated Warehouse / DC Operator', TEAL, [
    ['Role', 'Operates a 100,000+ sq ft warehouse in the South Coast Air Basin and must meet annual WAIRE point obligations.'],
    ['Pain Points', 'WAIRE compliance is confusing and costly; mitigation fees add up; electrifying truck activity is the cheaper long-run path but hard to plan.'],
    ['Decision Driver', 'A local partner who can supply zero-emission trucks and charging and make the compliance math concrete — fast.'],
    ['AI Opportunity', 'Identify obligated warehouses by truck-trip volume; a WAIRE/EV ROI tool that compares mitigation fees to a zero-emission lease for that specific site.'],
    ['Technijian Hook', 'My AI — WAIRE-warehouse targeting. My Dev — WAIRE/EV ROI tool. My SEO — own the WAIRE and EV-truck questions in search.'],
  ]),
  spacer(160),

  personaCard('4 — The Owner-Operator / Small Carrier', DARK_CHARCOAL, [
    ['Role', 'Runs one truck or a small fleet — a buyer of used trucks, rental, parking, and freight factoring.'],
    ['Pain Points', 'Cash flow is tight, especially in a soft freight market; needs trucks, parking, and fast payment on invoices without red tape.'],
    ['Decision Driver', 'Access, speed, and price — high volume, transactional, often found through search and word of mouth.'],
    ['AI Opportunity', 'Search capture for "used trucks", "truck parking", and "freight factoring"; a fast online quote and onboarding flow that converts before a competitor does.'],
    ['Technijian Hook', 'My SEO — used-truck, parking, and factoring search demand. My Dev — fast quote / onboarding + used-truck merchandising.'],
  ]),
  spacer(160),

  subHeader('Emerging & Higher-Value Segments'),
  personaCard('5 — The Sustainability / EV Fleet Buyer', PASS, [
    ['Role', 'A corporate or public fleet under pressure to decarbonize — a buyer of electric trucks, charging, and a transition roadmap.'],
    ['Pain Points', 'Needs to electrify without disrupting operations, and to plan charging and acquisition under shifting mandates.'],
    ['Decision Driver', 'A credible partner who can supply, maintain, and charge zero-emission trucks — not just sell them.'],
    ['AI Opportunity', 'Authority content owns the EV-transition and ACF/ACT questions in search and AI answers; targeting matches mandate timelines to the right fleets.'],
    ['Technijian Hook', 'My SEO — EV-transition authority content. My AI — targeting fleets by mandate exposure.'],
  ]),
  spacer(160),

  personaCard('6 — The Maintenance / Equipment Manager', GOLD, [
    ['Role', 'Keeps a fleet running and is open to outsourcing maintenance — the contract-maintenance buyer.'],
    ['Pain Points', 'Technician shortages, parts delays, and unplanned downtime; maintenance is a cost center they would rather hand to an expert.'],
    ['Decision Driver', 'Uptime, cost-per-mile, and a maintenance partner with the network and parts to keep trucks moving.'],
    ['AI Opportunity', 'Share-of-wallet intelligence flags lease and logistics accounts that should also be buying contract maintenance; content captures maintenance-outsourcing search.'],
    ['Technijian Hook', 'My AI — cross-sell intelligence. My SEO — contract-maintenance content and local capture.'],
  ]),
  spacer(200),

  p('Figure 6.0 maps each segment by account or contract value and strategic or recurring value — showing which buyers are the anchor, recurring accounts to defend and win, which are higher-value niches, and which represent high-volume transactional revenue.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'TCI Customer Segment Matrix', 580, 1.50),
  diagramCaption('Figure 6.0 — TCI Customer Segments: Account / Contract Value vs. Strategic / Recurring Value'),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('TCI competes against three kinds of rival: the national giants it should out-maneuver locally (Ryder and Penske, who lead on scale and have capable digital tools but operate generically in any one market), the structural peers it should out-modernize (Idealease, Enterprise Fleet Management, and other NationaLease independents), and the digital-native brokers it should learn from on the brokerage line (the marketplace platforms). The honest read differs from many industries: here the biggest players are digitally strong. TCI’s opening is not "be the only one with AI" — it is to be faster, more local, and the obvious California EV and WAIRE partner, with a modern commercial engine the giants apply only generically.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.4 },
      { label: 'Market', weight: 2.8 },
      { label: 'Posture vs. TCI', weight: 4 },
    ],
    [
      ['Ryder System', 'National FSL, logistics, used trucks (public co.)', 'The category benchmark — huge scale, capital, app and telematics, even publishes WAIRE guidance; but a national account experience, not a local one'],
      ['Penske Truck Leasing', 'National FSL, logistics, used trucks', 'Ryder’s twin on scale and digital, with a strong used-truck marketplace; same generic-in-market dynamic'],
      ['Idealease', 'National network of independent FSL dealers', 'TCI’s nearest structural peer type — a network of independents; strong where members invest, uneven across the network'],
      ['Enterprise Fleet Management', 'National fleet leasing and management', 'Strong in mid-market full-service leasing with modern tools; less rooted in heavy-duty and California EV than TCI'],
      ['NationaLease peers', 'Independent FSL operators nationwide (TCI is a member)', 'A peer network and co-op, not a head-to-head rival — shared standards, but commercial-AI maturity varies widely'],
      ['Digital freight brokers', 'Asset-light brokerage platforms (national)', 'Compete on the brokerage line only — marketplace-led and tech-forward; the experience bar for TCI’s brokerage'],
      ['EV-transition specialists', 'Fleet-electrification and WAIRE advisory (national + vendors)', 'Compete on the EV/WAIRE line with national, generic content — not the local, full-service, in-yard partner TCI can be'],
    ],
  ),
  spacer(200),
  subHeader('Commercial Digital & AI Maturity Scorecard'),
  p('Stripping the field down to the commercial fundamentals that drive modern buying shows where TCI starts — strong on operations, light on the commercial side — and where the move is.'),
  buildTable(
    [
      { label: 'Player', weight: 2.4 },
      { label: 'Local Search', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Account Intel', weight: 1.5, align: AlignmentType.CENTER },
      { label: 'Buyer-Facing AI', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.9 },
    ],
    [
      ['Ryder', { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Yes (app)', align: AlignmentType.CENTER }, 'National scale + strong, generic digital'],
      ['Penske', { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'Yes', align: AlignmentType.CENTER }, { text: 'Yes (app)', align: AlignmentType.CENTER }, 'National scale + strong, generic digital'],
      ['Enterprise FM', { text: 'Good', align: AlignmentType.CENTER }, { text: 'Partial', align: AlignmentType.CENTER }, { text: 'Some', align: AlignmentType.CENTER }, 'Modern mid-market tools'],
      ['Idealease / peers', { text: 'Mixed', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'No', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'No', color: CRITICAL, align: AlignmentType.CENTER }, 'Varies by member — beatable on depth'],
      [{ text: 'TCI (today)', bold: true }, { text: 'Light', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Ops only', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'Strong ops AI, commercial AI unbuilt', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field on the two axes that matter — scale and reach against commercial digital and AI maturity. TCI sits in the regional-independent corner today; the move is up and slightly right: out-modernize regionally and own the California EV and WAIRE niche, rather than trying to out-scale the giants.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning Scale vs Commercial Digital-AI Maturity', 580, 1.50),
  diagramCaption('Figure 7.0 — Competitive Positioning: Scale / Reach vs. Commercial Digital & AI Maturity'),
  spacer(160),
  calloutBox(
    'Where TCI Wins — The White Space',
    [
      'Local search across 26-plus yards is unclaimed: real "[service] + [city]" demand for leasing, used trucks, parking, reefer LTL, and factoring goes to whoever ranks. First to build per-yard pages and answer-engine content captures it.',
      'The California EV and WAIRE niche is local by nature — a warehouse needs trucks, charging, and help in its own market. TCI is in the basin; the national players treat WAIRE as a generic blog post. TCI can be the in-yard partner.',
      'Commercial AI, not operational AI, is the gap no regional independent has filled: account intelligence, RFP and quote automation, and used-truck merchandising behind the sales motion. TCI already trusts AI operationally — extending it commercially is the move.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For a 47-year operator with 3,800-plus units and 26-plus yards, the commercial digital presence under-represents the operation. The operational side is genuinely modern; the commercial side — how TCI gets found, how it targets accounts, how it turns a regulation into a sale — is where the gaps are. Closing them is the fastest early win.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Headline stats', 'Homepage still cites "2,500+ units" and "1,000+ professionals"', 'TCI’s own 2025 review says 3,800+ units and 1,500+ people — the site undersells the company; an easy day-one credibility fix'],
      ['Local / yard pages', 'No per-yard or per-service location pages across ~26 facilities', 'Real "[service] + [city]" demand goes uncaptured — a page per yard and service claims it'],
      ['Answer-engine presence', 'Effectively none', 'No content ranking or cited by ChatGPT, Perplexity, or AI Overviews for leasing, used-truck, WAIRE, or factoring questions'],
      ['WAIRE / EV positioning', 'Offered, but not merchandised to win', 'TCI’s in-basin, full-service EV and WAIRE advantage is not built into search or a tool the national players cannot match locally'],
      ['Commercial AI', 'None on the buyer-facing side', 'Operational AI is real and well-used; account intelligence, quote/RFP automation, and used-truck merchandising are absent — the clearest gap'],
      ['Customer experience', 'Largely manual quoting and inquiry', 'A quote-to-lease assistant and an AI-assisted portal would speed conversion and self-service across all lines'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making its existing scale, service, and EV/WAIRE strengths visible, findable, and quotable.',
      'Per-yard location pages, a WAIRE/EV content hub, and an AI-assisted capture layer are low-investment, compounding moves with fast search and credibility returns.',
      'These are also the natural first ninety days of the program: fix the stats and the foundation, then build the engine on top of it.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('Before the growth program, one thing must be clear: Technijian has already built the systems TCI needs on the commercial side. The platforms below are delivered and operating for real clients — not proposals. Each maps to a specific TCI use case, with security and governance built in rather than bolted on.'),
  spacer(160),

  capabilityBox(
    'Proven Build 1 — Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants — with about a 70% reduction in content-production time.',
    'This is the engine that gets TCI found: own "full-service truck leasing [city]," "used semi for sale," WAIRE and EV-truck questions, and parking and factoring queries in both Google and AI answers, and build the per-yard location pages TCI does not have today.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 2 — AI Document Intelligence (RFPs: Days to Minutes)',
    'Technijian deployed document intelligence for FINRA-registered broker-dealers that auto-populates complex due-diligence questionnaires, cutting RFP response from days to minutes with 60–80% less manual review.',
    'Pointed at dedicated-carriage and large-fleet lease RFPs, the same engine drafts and assembles proposals in hours instead of days — letting TCI respond to more opportunities, faster, with consistent, accurate detail.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 3 — Account-Based Intelligence & Outbound',
    'Technijian builds AI account-intelligence engines that harvest high-fit targets from public data, enrich and score them, and assemble per-account dossiers — so a sales team spends its time on the right accounts, not on list-building.',
    'For TCI it builds the named lists of private fleets, shippers, and — the wedge — WAIRE-obligated warehouses by truck-trip volume, with a dossier for each rep conversation. Depth on the accounts TCI already wants, not a broad blast.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 4 — AI-Native Custom App Delivery (My Dev)',
    'Technijian’s AI-native software lifecycle delivers custom web apps three to five times faster than traditional development — portals, calculators, and integrations built around a client’s actual process.',
    'This builds TCI’s commercial layer: a quote / spec-to-lease assistant, a WAIRE/EV ROI tool that turns the regulation into a sales conversation, used-truck merchandising and syndication, and an AI-assisted customer portal across leasing, maintenance, factoring, and roadside.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 5 — Local SEO + Review & Reputation Engine',
    'Technijian built an AI system that manages Google Business Profiles and requests, monitors, and responds to reviews across the local directories that search ranking depends on.',
    'Across TCI’s 26-plus yards, complete and consistent Business Profiles and active reviews lift the local rankings that capture "[service] + [city]" demand — and they are exactly the third-party signals AI assistants weigh when deciding whom to cite.'
  ),
);

// ---------- 10 HOW AI TRANSFORMS THE GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms TCI’s Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get found for the demand that searches, win the named accounts worth winning, and run leaner so quoting, bidding, and service hold as volume grows. The first motion captures broad search demand at scale; the second is account-based by design, aimed at the fleets, shippers, and WAIRE warehouses TCI already knows; the third speeds the work that turns interest into closed leases and dedicated contracts. Together they extend the operational AI TCI already runs into a full commercial engine.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'TCI AI Growth Engine', 600, 1.607),
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
      ['Get Found', 'Local + AEO search', 'Rank for "[service] + [city]" and answer-engine queries', 'Organic leads / mo', 'My SEO'],
      ['Get Found', 'Location / yard pages', 'A page per yard and service across the 10-state footprint', 'Local rankings', 'My SEO'],
      ['Get Found', 'WAIRE / EV authority + GBP', 'WAIRE / EV / leasing content hub + reviews per yard', 'Citations, reviews', 'My SEO'],
      ['Account Intel', 'Named-account prospecting', 'Private fleets and shippers by territory and fleet size', 'Qualified accounts / mo', 'My AI'],
      ['Account Intel', 'WAIRE-warehouse targeting', 'Find 100k+ sq ft warehouses by truck-trip volume — the EV wedge', 'Targeted warehouses', 'My AI'],
      ['Account Intel', 'RFP / lease-proposal auto-draft', 'Draft dedicated-contract and lease bids in hours', 'Bids submitted, win rate', 'My AI'],
      ['Account Intel', 'Dossiers + churn model', 'Pre-visit briefs for reps; flag at-risk lease/maintenance accounts', 'Meetings, retained accounts', 'My AI'],
      ['Run Leaner', 'Quote / spec-to-lease assistant', 'Configure a lease or used-truck deal and capture the lead 24/7', 'Quotes, capture rate', 'My Dev'],
      ['Run Leaner', 'WAIRE / EV ROI tool', 'Compliance-cost-vs-zero-emission-lease calculator', 'EV deals started', 'My Dev'],
      ['Run Leaner', 'Used-truck merchandising', 'Auto-listings, spec sheets, syndication, buyer-match', 'Used-truck turn', 'My Dev'],
      ['Run Leaner', 'Portal + AI chatbot', 'Self-serve leasing, maintenance, factoring, roadside support', 'Self-serve rate', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'Local SEO, answer-engine content, and the capture layer get TCI found and turn searchers into quotes and open accounts — most of that work is highly automatable.',
      'For named fleet, shipper, and warehouse accounts, AI surfaces the right targets, times the outreach, and arms the rep — but the relationship, the yards, the maintenance craft, and the lease or contract still close the deal.',
      'TCI already runs the operational and safety AI. This program adds the commercial layer on top of it — it does not pretend software signs a multi-year lease or a dedicated-carriage contract on its own.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('This section is deliberately honest about numbers. Where Technijian has a published price, it is shown as a firm price. Where an investment depends on the scope of a custom build, the document shows the real rate-card basis and states plainly that the figure is set in discovery — it does not invent a total to fill a cell. And the return is framed as the value at stake across TCI’s growth levers, with the dollar figures calibrated once discovery establishes TCI’s real per-deal economics. That is the standard TCI should expect from a partner: no numbers we cannot ground.'),
  spacer(140),
  subHeader('Phase 1 — Entry Program (Published Pricing)'),
  p('The program starts with the one part that needs no custom build and carries a firm, published price: the search and answer-engine foundation. It is a 12-month engagement with unlimited monthly service hours.'),
  buildTable(
    [
      { label: 'Service', weight: 3 },
      { label: 'Scope', weight: 4 },
      { label: 'Monthly', weight: 1.5, align: AlignmentType.CENTER },
      { label: 'Y1 Total', weight: 1.5, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO — Tier 5 (incl. Tiers 1–4)', 'Custom site + hosting, on/off-page SEO, 5 keyword blogs/mo, and video — the multi-location organic foundation', { text: '$1,500', align: AlignmentType.CENTER }, { text: '$18,000', align: AlignmentType.CENTER }],
      ['+ AI Search Optimization', 'Answer-engine (AEO/GEO) optimization for ChatGPT, Perplexity, and Google AI Overviews', { text: '$200', align: AlignmentType.CENTER }, { text: '$2,400', align: AlignmentType.CENTER }],
      ['+ PR Releases (quarterly)', '300+ live placements; FOX / ABC / NBC affiliate coverage', { text: '$150', align: AlignmentType.CENTER }, { text: '$1,800', align: AlignmentType.CENTER }],
      ['+ Content Syndication', 'Distribution to 250+ websites', { text: '$200', align: AlignmentType.CENTER }, { text: '$2,400', align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Subtotal (published)', bold: true }, { text: '12-month commitment, unlimited service hours', bold: true }, { text: '$2,050/mo', bold: true, align: AlignmentType.CENTER }, { text: '~$24,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('Optional at entry: Digital Marketing (paid-ads) management runs $200/mo (Standard tier) plus a $100 one-time setup per brand, with media spend billed separately. An Executive AI Workshop and AI Readiness Assessment is a fixed-scope engagement; Technijian strategic-planning engagements run $8,500–$25,000 on the 2026 rate card, with the exact scope and price confirmed in discovery.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Phase 2 — Expansion (Scoped in Discovery)'),
  p('The custom builds and account-intelligence work are where the engine is built. Their cost depends entirely on scope — how many yards, how many integrations, how deep the tooling — so rather than print an invented total, the table shows the real rate-card basis and the work to be scoped into a fixed-price Statement of Work after discovery.'),
  buildTable(
    [
      { label: 'Service', weight: 2.7 },
      { label: 'Scope', weight: 3.6 },
      { label: 'Basis (2026 Rate Card)', weight: 2.4 },
      { label: 'Investment', weight: 2 },
    ],
    [
      ['My Dev — Custom AI & app build', 'Quote/spec-to-lease assistant, WAIRE/EV ROI tool, customer portal + AI chatbot, used-truck merchandising', 'AI eng $185–$275/hr; full-stack $145–$210/hr', { text: 'Scoped in discovery → fixed-scope SOW', bold: true, color: CORE_ORANGE }],
      ['My AI — Account intelligence & outbound', 'Named fleet/shipper + WAIRE-warehouse targeting, dossiers, RFP/lease-proposal automation', 'My AI engagement', { text: 'Scoped in discovery', bold: true, color: CORE_ORANGE }],
      ['My AI — Fractional AI Advisor', 'Program leadership, model governance, implementation QA', 'Retainer $1,500–$3,500/mo', { text: 'Tier set at discovery', bold: true, color: CORE_ORANGE }],
      ['My Dev — Managed App Services', 'Hosting, monitoring, and optimization of the build', 'Monthly managed service', { text: 'Scoped once build is sized', bold: true, color: CORE_ORANGE }],
    ],
  ),
  spacer(160),
  subHeader('Transparent US Labor Rates (2026)'),
  p('So project and ad-hoc work carries no surprises, here are the blended, US-led rates the expansion draws from. These are real rate-card figures; a fixed-scope build converts them into a single agreed price.'),
  buildTable(
    [
      { label: 'Work', weight: 4 },
      { label: 'Unit', weight: 2, align: AlignmentType.CENTER },
      { label: 'US Rate (2026)', weight: 2, align: AlignmentType.CENTER },
    ],
    [
      ['Custom AI agent development', { text: 'per hour', align: AlignmentType.CENTER }, { text: '$185–$275', align: AlignmentType.CENTER }],
      ['Full-stack application development', { text: 'per hour', align: AlignmentType.CENTER }, { text: '$145–$210', align: AlignmentType.CENTER }],
      ['Planned project / engineering work', { text: 'per hour', align: AlignmentType.CENTER }, { text: '$145–$195', align: AlignmentType.CENTER }],
      ['Strategic AI / planning engagement', { text: 'per engagement', align: AlignmentType.CENTER }, { text: '$8,500–$25,000', align: AlignmentType.CENTER }],
      ['Fractional AI Advisor', { text: 'per month', align: AlignmentType.CENTER }, { text: '$1,500–$3,500', align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('Rates are blended US-led pricing. A 3% annual escalator and Net 30 terms apply, disclosed up front in any Statement of Work.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Return: Value at Stake'),
  p('Because TCI’s internal numbers (average lease value, close rate, used-truck margin, WAIRE pipeline) were not available for this draft, this blueprint does not print an ROI multiple it cannot stand behind. Instead it names the levers the program moves and the unit each is measured in. The dollar value of each is set in discovery and built into a calibrated ROI model.'),
  buildTable(
    [
      { label: 'Growth Lever', weight: 3.6 },
      { label: 'Measured In', weight: 3.6 },
      { label: 'Year-1 Value', weight: 2.2, align: AlignmentType.CENTER },
    ],
    [
      ['New full-service lease & dedicated-contract wins', 'Multi-year recurring contracts', { text: 'Set at discovery', color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['WAIRE-driven EV-acquisition & charging deals', 'ZE units + WAIRE points (~$68K avoided fees per ZE Class 6/7)', { text: 'Set at discovery', color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['Used-truck unit-sales lift', 'Units / month × margin', { text: 'Set at discovery', color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['Brokerage & freight-factoring account adds', 'Active accounts', { text: 'Set at discovery', color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['Retained leasing & maintenance volume', 'Churn prevented', { text: 'Set at discovery', color: CORE_ORANGE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Read the Money',
    [
      'The entry program is a known, published investment of about $24,600 in Year 1 — the search and answer-engine foundation, with no large build required to start.',
      'The custom build and account-intelligence work are scoped in discovery and delivered as a fixed-price Statement of Work, priced from the published rate card above — never an invented number.',
      'Within five business days of a 30-minute discovery call (Section 14), Technijian returns a calibrated ROI model and a fixed-scope SOW built on TCI’s real per-deal economics. That is the right sequence: prove the foundation, then size the engine.',
    ],
    CORE_BLUE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence suited to a multi-yard, multi-state, regulated operation: build the foundation first (local SEO, yard pages, and the capture layer), then stand up the demand-and-intelligence engine (content, citations, the named-account list, and an RFP pilot), then scale outbound and ship the commercial tools. Meaningful inbound and faster quoting are visible inside the first ninety days; the bigger builds are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'TCI 90-180-365 Day Roadmap', 600, 2.296),
  diagramCaption('Figure 12.0 — TCI Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Get the commercial-digital base right and stand up the layer that turns visits into quotes and open accounts.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Local / AEO Foundation', 'Build the keyword and WAIRE/EV question map. Ship technical SEO, schema, and the first per-yard location pages. Refresh the headline stats (3,800+ units, 1,500+ team) so the site stops underselling the company.'],
      ['1.2 — Capture Layer Live', 'Add a quote / spec-to-lease capture flow and an AI assistant to the website, with source-tagged lead tracking so TCI knows which queries and yards actually convert.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Demand & Intelligence Engine (Days 91–180)', { color: TEAL }),
  p('Publish the content that ranks and gets cited, and build the named-account intelligence base.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Content & Answer-Engine Engine', 'A WAIRE / EV, leasing, and used-truck authority hub publishing on a steady cadence. First Google rankings for priority terms and first AI-assistant citations for the questions buyers ask.'],
      ['2.2 — Account Intelligence Base', 'My AI harvests the named fleet, shipper, and WAIRE-warehouse target lists by territory and signal. First per-account dossiers to the sales team, plus an RFP / lease-proposal automation pilot and an at-risk-account churn model.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Automate (Days 181–365)', { color: CORE_ORANGE }),
  p('Scale the account-based outreach and ship the commercial tools that compound what is converting.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Account-Based Outreach at Scale', 'Personalized sequences running across the named universe; reps supported by dossiers and trigger alerts. RFP and lease-proposal automation in production. New lease and dedicated-contract deals closing.'],
      ['3.2 — Tools + Optimize', 'WAIRE/EV ROI tool and used-truck merchandising live; the AI-assisted portal extended across lines. ROI dashboard delivered against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions TCI can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Refresh the Headline Stats',
    ['Update the website to the current figures — 3,800+ trucks, tractors, and trailers and 1,500+ team members — from TCI’s own 2025 review. The site currently undersells the company with older numbers; fixing it is an instant credibility and accuracy win.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Build One Yard Location Page as a Template',
    ['Pick the largest facility and publish a single, complete location page — services, equipment, service area, hours, and a quote request. It costs almost nothing, it will start ranking for "[service] + [that city]," and it becomes the template for every other yard.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Claim and Complete Every Google Business Profile',
    ['Verify and fully complete the Google Business Profile for each facility — services, hours, photos, and categories. Buyers and owner-operators do check, and complete profiles are free local visibility that also feed AI answers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Publish One WAIRE / EV FAQ',
    ['Write a single plain-language page answering the questions warehouse and fleet buyers actually ask: "How many WAIRE points does a zero-emission Class 6 truck earn?" and "Is it cheaper to lease EV trucks than pay WAIRE mitigation fees?" Almost no competitor has localized this — it is the seed of content that gets cited in AI answers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Ask Five Long-Standing Customers for a Short Testimonial',
    ['Reach out to five long-standing leasing or dedicated customers and ask for a short quote about what the TCI relationship removes from their week. Customer proof is the most persuasive asset in an account-based sale — and TCI has earned it over 47 years.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative — a short discovery call replaces them with TCI’s real baselines, sets the dollar value of each growth lever, and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Fleet & footprint', 'Current fleet and headcount (to reconcile 3,800+/1,500+ vs. the older site figures) and exact yard count and states', 'Scopes the location-page build and corrects the public stats'],
      ['Service-line mix', 'Revenue mix across leasing, logistics, used trucks, and factoring — and the priority growth bet internally', 'Sets where the program leads and where the spend goes first'],
      ['Lease economics', 'Average full-service lease and dedicated-contract value and close rate', 'Sets the primary lines in the value-at-stake model'],
      ['EV / WAIRE pipeline', 'How many WAIRE-obligated prospects, ZE units sold/leased, and charging deals today', 'Sizes the EV/WAIRE wedge — the highest-margin opportunity'],
      ['Account growth', 'New accounts per month today and sales-team structure by region and unit', 'Calibrates the account-based outbound scope'],
      ['Systems', 'CRM, dealer-management, and quoting systems in use', 'Defines the integration surface for the assistant and automation'],
      ['Used-truck flow', 'Inventory turn and how listings are merchandised today', 'Scopes the used-truck merchandising build'],
      ['Marketing & sponsor', 'Who owns web / marketing, current spend, and the engagement sponsor', 'Determines where the work plugs in and who approves'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work within five business days.',
      'The goal is a plan built on TCI’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('TCI already has the hard things: 47 years of reputation, a diversified two-unit model, 3,800-plus units across 26-plus yards, a family-owned service culture, and an operational-AI foundation most independents do not have. What it has not yet done is point AI at the commercial side — getting found, winning named accounts, and turning California’s EV mandates into a sales conversation — and that corner of the market is still open to the operator who moves first.'),
  p('The opportunity is concrete: buyers are already searching for what TCI sells, named fleets and warehouses are won by a team that AI can multiply, and the quoting, bidding, and merchandising work is exactly what automation speeds. A focused, hybrid program captures the search demand, sharpens the account-based effort, and ships the tools — without pretending software replaces the relationship that closes a lease.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope and sponsor.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the local / AEO foundation, the first yard pages, the stat refresh, and the AI-assisted capture layer — live inside 30 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to point AI at the commercial side of TCI?', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: `Contact Ravi Jain, Technijian  |  ${FOUNDER_EMAIL}  |  ${MAIN_PHONE}`, size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional businesses compete at scale — with security and governance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for TCI', weight: 5 }],
    [
      ['My SEO', 'Local and answer-engine SEO — ranking in Google and getting cited by AI assistants — plus per-yard location pages and the WAIRE / EV content hub that make TCI findable across its markets'],
      ['My AI', 'AI strategy and builds — account intelligence, WAIRE-warehouse targeting, RFP and lease-proposal automation, and churn intelligence, with governance and security throughout'],
      ['My Dev', 'Custom, AI-native builds — the quote/spec-to-lease assistant, WAIRE/EV ROI tool, used-truck merchandising, and the AI-assisted customer portal'],
      ['My IT & Security', 'The managed IT, cybersecurity, and cloud foundation that runs underneath the growth engine — available as TCI’s needs grow'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', `Ravi Jain — ${FOUNDER_EMAIL}`],
      ['Office', USA_ADDR],
      ['Phone', MAIN_PHONE],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted June 1, 2026. Firmographic details (founding year, ownership, fleet and headcount, facility count, certifications) are drawn from public sources and company materials and should be confirmed with TCI before external use. Where the public website and TCI’s own 2025 review disagree on fleet and headcount, the more recent self-reported figures are used and flagged for confirmation. No revenue figure is cited, as no reliable public figure exists for a private family company.', { italics: true }),
  spacer(120),
  p('1. TCI Transportation — official website: tcitransportation.com (Home, About Us, History, Leadership, Full-Service Leasing, Services, Locations)', { size: 20 }),
  p('2. TCI Transportation — company blog: "A Family Legacy of Growth, Innovation, and Commitment" and "2025 Year in Review" (founded 1978 by Gerry Flynn; co-presidents Andrew & Ryan Flynn; 3,800+ units; 1,500+ professionals)', { size: 20 }),
  p('3. Competitors — Ryder System (ryder.com, incl. WAIRE guidance), Penske Truck Leasing, Idealease, Enterprise Fleet Management, NationaLease; digital freight brokers (C.H. Robinson, Uber Freight, DAT); EV / charging vendors (Xos, Orange EV)', { size: 20 }),
  p('4. Regulatory — South Coast AQMD Rule 2305 / WAIRE Program (aqmd.gov FAQs; NV5, Lazer Logistics, Xos, Orange EV explainers); CARB Advanced Clean Fleets and Advanced Clean Trucks; CARB Clean Truck Check; US DOT / FMCSA', { size: 20 }),
  p('5. Industry — ACT Research (2026 used-truck outlook; Class 8 retail values); American Trucking Associations driver-shortage estimates; 2025–26 freight-market and carrier-exit analyses; US truck leasing & rental market size and CAGR; freight-factoring rate benchmarks', { size: 20 }),
  p('6. Technijian pricing — Services/My SEO published tiers and add-ons; technijian-pricing 2026 rate card (custom AI development $185–$275/hr; full-stack $145–$210/hr; project work $145–$195/hr; strategic engagement $8,500–$25,000; Fractional Advisor / vCIO $1,500–$3,500/mo); Services/My AI Proven Results', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'TCI-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
