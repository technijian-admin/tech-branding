// JDH Pacific (JDH) - AI-Driven Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/DTS/build-dts-report.js (ALG/AAVA/TALY/VAF/SCF/ORX/MWAR/RKE lineage).
// WARM EXPANSION: JDH is an existing managed-IT + hosting client (47 users).
// Logo: uses the AUTHENTIC assets/Technijian Logo 2.png (NOT the assets/logos/png fakes).

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

// AUTHENTIC logo (light backgrounds) per feedback_logo_use_authentic_files. AR 4.779.
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

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 40, bold: true, color, font: FONT_HEAD })] }),
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

function capabilityBox(title, built, applies, kind = 'built') {
  const leadLabel = kind === 'service' ? 'The Technijian Service: ' : 'What Technijian Built: ';
  const leadColor = kind === 'service' ? TEAL : CORE_BLUE;
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
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: leadLabel, size: 20, bold: true, color: leadColor, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to JDH: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 150, height: 31 } })] })] }),
      new TableCell({
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
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

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 300, height: 63 } })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'JDH PACIFIC', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Cast, Forged & Machined Components  ·  35 Years of Multi-Origin Supply Chain', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth & Integration Blueprint', size: 38, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Fullerton, California  |  jdhpacific.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for JDH Pacific', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '35+ yrs', label: 'Supplying Industrial OEMs Since 1989', color: CORE_BLUE },
    { number: '4 Countries', label: 'US · Mexico · China · India Supply Chain', color: CORE_ORANGE },
    { number: 'NMSDC MBE', label: 'Minority-Owned Business Certified', color: TEAL },
    { number: '47 users', label: 'Already Managed by Technijian', color: GOLD },
  ]),
  spacer(300),
  p('JDH Pacific has supplied cast, forged, and machined components to industrial OEM manufacturers for more than thirty-five years. Founded in 1989 by Donald Hu and run today from Fullerton with a 90,000-square-foot warehouse in La Mirada, JDH does something few suppliers do: it manages the entire supply chain, from engineering review and joint-venture-owned offshore foundries in China through quality control, ocean and customs logistics, US and Mexico inventory, and one-to-five-day local shipping. Its named customers read like an industrial who-is-who: Parker-Hannifin, Emerson Electric, Dover, Eaton, Xylem, Regal Rexnord, Paccar, and DSI. It is an NMSDC-certified Minority Owned Business, and it is already a Technijian managed-IT and hosting client across 47 users.'),
  p('The capability is real and the relationship is established. What has not yet been built is the AI operating layer that turns thirty-five years of physical advantage into faster quotes, surfaced supplier-diversity spend, and tariff resilience marketed as a buyer benefit. A contract manufacturer wins or loses on three things a hand-run shop can no longer keep up with in 2026: the speed and completeness of the quote (the OEM awards the program to whoever responds first and most credibly), the discipline of the supplier-qualification paperwork (PPAP, FAI, COA, and customer scorecards that decide whether the next program comes your way), and the sophistication of the sourcing answer in a Section 301, reshoring, and nearshoring world (where JDH already has the multi-origin footprint most rivals lack).'),
  p('This blueprint is a focused, account-based program built for how JDH actually wins work. Get found and specified: own AI-search visibility on the supplier-discovery queries OEM sourcing and NPI engineers now type into Google AI, ChatGPT, and Perplexity, and lead the tariff-resilient and minority-owned-supplier conversation. Win the quote race: point the same AI document-intelligence engine Technijian built for FINRA broker-dealers at JDH’s RFQs, drawings, and qualification packages, so a quote that took days takes hours. Hold and grow the account: recall thirty-five years of quote and tooling history instantly, protect quoted margin against tariff swings, and keep every OEM supplier scorecard green. Every piece sits inside a clear boundary: AI drafts the quote, classifies the part, and assembles the cert package, but a JDH engineer signs the material cert and a licensed broker signs the customs entry. AI never fabricates an inspection result or a country-of-origin claim.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'JDH already owns the hard things: joint-venture foundries, a four-country supply chain, an in-house quality department and machine shop, NMSDC minority-owned certification, and a thirty-five-year track record with Fortune-500 OEMs. What it does not yet have is the AI quote, qualification, and tariff-intelligence layer that turns those assets into speed and margin.',
      'Because Technijian already runs JDH’s servers, security, Microsoft 365, Sage, and PC-DMIS quality environment, the build starts inside a system we already operate, not outside it. That is a head start no outside software provider can match.',
      'The right entry is small, low-commitment, and pays back fast: AI-search authority, named-account intelligence, and a strategy workshop. The custom AI Quote & Quality-Doc engine comes second, once the entry proves the lift. Rolling it across the China, India, and Mexico sites is the Phase-3 upside, not the Year-1 ask.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information plus Technijian’s own internal records of the JDH environment. JDH’s confidential business numbers — quote volume, win rate, average part-program value and margin, named-account concentration, current revenue — were not available for this draft. Every projection below is labeled estimated and conservative and calibrates to real numbers after a short discovery call. The specific questions are in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW A CONTRACT MANUFACTURER WINS ----------
docChildren.push(
  ...sectionHeader('How a Contract Manufacturer & Supply Partner Wins', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for JDH starts with how the business actually earns. Revenue is not built on consumer marketing; it is built on a finite, named universe of industrial OEM accounts, won and kept through a multi-stage account motion. An OEM sourcing manager or design engineer needs a casting, forging, or machined part — for a new product, a cost-down, a re-source off a failing supplier, or a tariff-driven supply rebalance. They find candidate suppliers, send a drawing and a spec, and award the program to whoever quotes first, most completely, and most credibly. Then the part has to qualify, deliver on time, score well, and earn the next program. The diagram below shows that funnel, the demand that feeds it, and the points where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How a Contract Manufacturer Wins', 600, 1.654),
  diagramCaption('Figure 2.0 — How JDH wins: get specified, quote, qualify, deliver, and hold the account'),
  spacer(120),
  subHeader('The Quote Decides the Program'),
  p('When an OEM sends an RFQ, the contest is speed at the right completeness. A sourcing manager with a part to place does not wait two weeks for a supplier who is buried in other quotes; the program goes to whoever returns a credible, complete number first. A supplier that turns a drawing into an accurate quote and should-cost in hours wins more programs at the same margin; a supplier that takes days loses them to a faster competitor, not a better one. AI that reads the drawing, matches it to capability and thirty-five years of quote history, and drafts the quote compounds that speed advantage without adding engineering headcount.'),
  subHeader('Qualification and the Scorecard Decide the Next Program'),
  p('Winning the first PO is only half the motion. Supplier qualification — PPAP, FAI or AS9102, ISO and IATF cert packages, material and mill certs — is document-heavy and slow, and every OEM keeps a supplier scorecard on quality, on-time delivery, and parts-per-million defects that governs whether the next program is offered to JDH or to someone else. The paperwork is not a side task; it is the gate to the relationship. AI that assembles those packages from real inspection data — the PC-DMIS dimensional results JDH already produces — keeps the gate open without eating the engineering hours that should be writing the next quote.'),
  subHeader('The Cheapest Win Is the Re-Order and the Next Part'),
  p('Winning a new OEM account costs months of qualification, samples, and trust; winning the next part on an account already qualified costs a fast, accurate re-quote and a green scorecard. The biggest avoidable losses in this business are the repeat part that gets re-quoted from scratch (or lost) because the prior quote and tooling live in a spreadsheet or someone’s memory, and the program lost on quote speed alone. Retention and recall are the quiet half of the engine, and they are where thirty-five years of institutional memory — made searchable — pay back fastest.'),
  spacer(120),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Get found and specified: be the supplier OEM sourcing and NPI engineers find first when they search Google AI, ChatGPT, or Perplexity, and the name in the tariff-resilient, minority-owned-supplier conversation on LinkedIn.',
      'Win the quote race: turn drawings and RFQs into accurate quotes and qualification packages in hours, not days, with AI that reads the drawing, recalls the history, and assembles the certs — a JDH engineer signing every one.',
      'Hold and grow: instant re-quote from thirty-five years of memory, tariff and landed-cost intelligence that protects quoted margin, and supplier-scorecard automation that keeps every OEM rating green.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE TRADE-COMPLIANCE & QUALITY-INTEGRITY BOUNDARY ----------
docChildren.push(
  ...sectionHeader('The Trade-Compliance & Quality-Integrity Boundary', TEAL, '03'),
  spacer(100),
  p('A manufacturer-importer that points AI at quoting, classification, and quality documentation without naming the boundary loses any sophisticated OEM’s supplier-quality or trade-compliance reviewer the first time they ask. This section names the boundary plainly, because the value of a Technijian-built program is not just that the AI is fast — it is that the AI is fast and trustworthy. The boundary is simple to state: AI drafts, classifies, assembles, and monitors; a qualified human signs.'),
  spacer(140),
  subHeader('Trade Compliance — The Import Side'),
  p('Section 301 tariffs on Chinese-origin goods remain in force and escalated through 2025, and many castings and forgings sit on the lists; Section 232 on steel and aluminum and active antidumping and countervailing-duty orders on certain iron castings and forged components from China add stacking duty exposure. Country of origin is governed by US Customs’ substantial-transformation doctrine: simply trans-shipping Chinese components through Mexico for minor finishing does not change origin or escape Section 301 — real manufacturing transformation does. And Mexico is not a guaranteed safe harbor: the US Trade Representative opened a new Section 301 investigation into Mexico in March 2026, and Mexico’s December 2025 decree expanded import duties on over 1,400 tariff lines. The 2026 sourcing answer is data-driven total-landed-cost and origin flexibility — exactly the multi-origin posture JDH already operates — not a single-country bet. AI classifies parts, models landed cost by origin, and monitors policy; a licensed customs broker or JDH’s trade-compliance owner signs the entry and the country-of-origin declaration.'),
  spacer(120),
  subHeader('Quality-System Integrity — The Delivery Side'),
  p('AI assembles PPAP, FAI, and cert packages and drafts certificates of analysis from real inspection data — the PC-DMIS coordinate-measuring-machine results, material certs, and test reports JDH already produces. It never fabricates an inspection result, a material certification, or a dimensional report. A quality engineer signs. The CMM data is the source of truth; the AI is the assembler and the memory, not the inspector. That distinction is what makes the speed defensible when an OEM audits the supplier-quality file.'),
  spacer(120),
  subHeader('The Pricing Line — What This Program Will Not Touch'),
  p('There is one category of supply-chain AI this program explicitly avoids: any algorithmic pricing that shares non-public data across competitors or aligns quotes among multiple suppliers. The recent US Department of Justice action against RealPage in housing — antitrust counts, a 2025 proposed settlement, and a wave of state bans — is the doctrine landmark, and a thoughtful operator imports the principle by analogy. AI may inform JDH’s own should-cost and quote from public cost data and JDH’s own history; it does not feed a multi-firm rate-setting engine and it does not match prices across competitors.'),
  spacer(120),
  calloutBox(
    'The Boundary — AI Drafts, A Person Signs',
    [
      'AI drafts the quote, classifies the part under its HTS code, assembles the PPAP / FAI / COA package, and watches the tariff — uniformly, with sources cited, and inside the documentation rules the OEM and the regulator expect.',
      'AI never fabricates an inspection result, never invents a country-of-origin claim, and never sets a price in an antitrust-sensitive way. A JDH quality engineer signs the material cert and a licensed customs broker signs the customs entry, explicitly, in writing.',
      'That boundary is the point: JDH gets institutional-grade quoting and compliance velocity without putting its name on a number an algorithm invented or an origin a model guessed — which is exactly what a Fortune-500 supplier-quality reviewer needs to see.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 04 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '04'),
  spacer(100),
  p('Because JDH sells to a finite, named universe of industrial OEM accounts — not a broad consumer market — this program is account-based: the job is to be discovered by, quote faster for, qualify cleaner with, and retain a known set of OEM buyers. There is a real secondary inbound layer, because OEM sourcing and NPI engineers increasingly do supplier discovery through AI search, so answer-engine authority earns a place — but the engine’s spine is account depth and quote speed, not volume. The growth comes from five pools.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.8 },
      { label: 'The Named Universe', weight: 3.7 },
      { label: 'How JDH Captures It', weight: 3.5 },
    ],
    [
      ['Re-source & cost-down programs at existing-class OEMs', 'The Fortune-500 industrial OEMs JDH already serves or is qualified at — Parker-Hannifin, Emerson, Dover, Eaton, Xylem, Regal Rexnord, Paccar, DSI — plus their peers in valves, pumps, power transmission, and off-road', 'Named-account intelligence; trigger monitoring on cost-down cycles, supplier re-sources, and plant moves; AI quote speed; thirty-five-year quote-history recall'],
      ['Reshoring & tariff-rebalance sourcing', 'OEMs publicly rebalancing China exposure in 2025-2026 — the ones announcing nearshoring, dual-sourcing, or tariff mitigation', 'AI tariff and landed-cost intelligence plus JDH’s China + India + Mexico + US multi-origin footprint as the de-risking answer; authority content; targeted outreach'],
      ['Supplier-diversity (Tier-1 / Tier-2) spend', 'Fortune-500 OEMs with diverse-spend targets and Tier-2 reporting requirements — most large OEMs run a supplier-diversity program', 'JDH’s NMSDC minority-owned certification surfaced into the diversity channel, backed by the audit-ready qualification docs those programs demand'],
      ['New-product introduction (NPI) programs', 'Design and project engineers at OEMs designing a new product that needs a casting or forging partner during the design phase', 'Fast design-for-manufacturability feedback and quote turnaround; engineering support; prototype-to-production path; answer-engine discovery'],
      ['Mid-market OEM accounts', 'The small and mid-size manufacturers JDH explicitly serves — more price- and flexibility-sensitive, valuing no-minimum orders, Kanban, local inventory, and US-based service', 'Responsiveness, flexibility, answer-engine discovery, and the no-minimum plus local-inventory story'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based on the Buyer Side — Specify, Quote, Hold',
    [
      'Unlike a consumer business, JDH lives on a named universe of OEM accounts. The work is depth and speed inside each account — not shotgun marketing — and the AI is sized for that motion, not for a broad funnel.',
      'The highest-return pool is also the most easily under-served: the OEM that placed one program last year and has a related part coming this year. Account intelligence — watching cost-down cycles, supplier failures, plant moves, and diversity initiatives — protects revenue JDH would otherwise lose to a faster responder.',
      'Every motion here is measurable — answer-engine citation rate, RFQ turnaround, programs won, supplier-scorecard health, and margin protected — so the program is tuned to what actually moves the order book.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE JDH BUYER (PERSONAS) ----------
docChildren.push(
  ...sectionHeader('The JDH Buyer', CORE_ORANGE, '05'),
  spacer(100),
  p('Five buyer types account for nearly all of JDH’s program activity. They differ in how they discover JDH, how fast they move, and what keeps them — but they share one trait that defines the strategy: each is reached and kept through quote velocity, answer-engine visibility, supplier-diversity access, and account memory rather than broad marketing. The cards below profile each buyer, and Figure 5.0 places them by annual spend and account stickiness.'),
  spacer(160),

  personaCard('1 — The OEM Strategic-Sourcing / Commodity Manager', CORE_BLUE, [
    ['Profile', 'Owns the casting, forging, or machined-part commodity at a Fortune-500 industrial OEM; buys on multi-year blanket and Kanban agreements. The repeat, high-volume, highest-lifetime-value buyer.'],
    ['Pain Points', 'Total landed cost under tariff pressure; on-time delivery and PPM quality; single-source supply risk; the bandwidth to qualify and manage a second source; tariff exposure on China-origin parts.'],
    ['Decision Driver', 'A complete, accurate quote in days not weeks; a supplier scorecard that stays green; a multi-origin partner who de-risks the supply without adding management overhead.'],
    ['AI Opportunity', 'AI quote drafting and should-cost; tariff and landed-cost-by-origin intelligence; supplier-scorecard automation; quote-history recall across the account.'],
    ['Technijian Hook', 'My Dev — AI Quote & Quality-Doc engine + tariff dashboard. My AI Lead Gen — named-account intelligence.'],
  ]),
  spacer(160),

  personaCard('2 — The OEM NPI / Design Engineer', TEAL, [
    ['Profile', 'A design or project engineer at an OEM designing a new product that needs a casting or forging partner during the design phase; wins the program early, before sourcing formalizes it.'],
    ['Pain Points', 'Finding a manufacturable design fast; a partner who gives real design-for-manufacturability feedback; a credible prototype-to-production path; speed without a giant-supplier runaround.'],
    ['Decision Driver', 'Fast, knowledgeable DFM feedback and a quick quote; engineering depth; the confidence the part will scale from prototype to production.'],
    ['AI Opportunity', 'Answer-engine discovery during supplier search; AI RFQ and drawing intelligence for fast DFM and quote turnaround; quote-history matches to similar prior parts.'],
    ['Technijian Hook', 'My SEO — answer-engine authority. My Dev — AI RFQ / drawing intelligence.'],
  ]),
  spacer(160),

  personaCard('3 — The OEM Supplier-Diversity / Procurement Lead', GOLD, [
    ['Profile', 'Owns Tier-1 and Tier-2 diverse-spend targets and reporting at a Fortune-500 OEM. JDH’s NMSDC minority-owned certification is the key that opens this door — a door very few of JDH’s competitors can open.'],
    ['Pain Points', 'A certified diverse supplier that can actually perform at scale, not just hold a certificate; audit-ready diversity and qualification reporting; Tier-2 spend visibility for their own reporting.'],
    ['Decision Driver', 'Proven MBE certification plus delivery credibility; clean, audit-ready documentation; a supplier that makes the diversity-spend report easy to defend.'],
    ['AI Opportunity', 'Surface JDH into the supplier-diversity channel; AI-assembled qualification and audit-ready docs; authority content on minority-owned Tier-2 value.'],
    ['Technijian Hook', 'My SEO — MBE Tier-2 authority content. My AI Lead Gen — diversity-program targeting. My Dev — audit-ready doc engine.'],
  ]),
  spacer(160),

  personaCard('4 — The Mid-Market OEM Owner / Buyer', CORE_ORANGE, [
    ['Profile', 'Owner or buyer at a small or mid-size manufacturer — the "small, medium" customers JDH explicitly serves. More price- and flexibility-sensitive than the Fortune-500 buyer; values responsiveness and the absence of red tape.'],
    ['Pain Points', 'Minimum-order requirements at bigger suppliers; cash-flow-friendly Kanban; local inventory and short lead times; a US-based team that picks up the phone.'],
    ['Decision Driver', 'No-minimum flexibility, Kanban and local inventory, one-to-five-day shipping, and a responsive US operational team.'],
    ['AI Opportunity', 'Answer-engine discovery; fast AI quote turnaround on smaller RFQs; the no-minimum and local-inventory story told well online.'],
    ['Technijian Hook', 'My SEO — answer-engine discovery. My Dev — fast AI quoting on smaller RFQs.'],
  ]),
  spacer(160),

  personaCard('5 — The Distributor / Channel Buyer', BRAND_GREY, [
    ['Profile', 'A distributor or channel buyer in post-tension, fire protection, or the MRO channel buying components to stock and resell; volume- and availability-driven.'],
    ['Pain Points', 'Availability and lead-time reliability; consistent quality across repeat lots; predictable pricing; a partner that can hold inventory.'],
    ['Decision Driver', 'Reliable availability from local inventory; consistent COA-backed quality on every lot; predictable re-order pricing.'],
    ['AI Opportunity', 'Quote-history recall for repeat lots; supplier-scorecard automation; inventory-aware re-order flow.'],
    ['Technijian Hook', 'My Dev — quote-history memory + scorecard automation.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each buyer by annual spend and account stickiness — showing why the strategic-sourcing manager is the highest-lifetime-value target, why the NPI engineer wins the program earliest, why the supplier-diversity lead is the strategic door-opener, and where the mid-market and distributor buyers add flexible volume.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The JDH Buyer Matrix', 560, 1.490),
  diagramCaption('Figure 5.0 — The JDH Buyer: Annual Spend vs. Account Stickiness / Strategic Value'),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  spacer(100),
  p('JDH competes in a fragmented global market against three kinds of supplier: Asia-sourced casting and forging supply-chain partners like itself (CAB Worldwide, Bunty, the large precision player Impro), domestic foundries and forges that are capable but higher-cost (MetalTek, Hitchiner, Signicast), and the OEM’s do-it-yourself alternatives — buying direct from China with no US partner or quality buffer. The pattern across all of them is the same opportunity: JDH already owns the hard physical assets — joint-venture foundries, a four-country footprint, an in-house quality department and machine shop, minority-owned certification, and a thirty-five-year track record — while no competitor in its set markets or operates AI-speed quoting, AI tariff intelligence, answer-engine authority, and a tariff-resilient multi-origin story together. The physical capability is competitive; the digital and AI operating layer is the move from here.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.6 },
      { label: 'Position', weight: 3.2 },
      { label: 'Scale', weight: 1.0, align: AlignmentType.CENTER },
      { label: 'Digital & AI Posture', weight: 3.0 },
    ],
    [
      ['Impro Precision Industries', 'China-HQ precision castings and machining; US operations; publicly listed', { text: 'Large', align: AlignmentType.CENTER }, 'Scale and some digital investment; no minority-owned status, no boutique responsiveness'],
      ['CAB Worldwide', '35+ years; steel flanges plus industrial castings and forgings; manage and distribute', { text: 'Mid', align: AlignmentType.CENTER }, 'Closest direct analog; legacy web presence and manual quoting'],
      ['Bunty LLC', 'Greenville, SC; custom machined, forged, cast, and plated parts', { text: 'Boutique', align: AlignmentType.CENTER }, 'Broad capability; legacy tooling and buyer experience'],
      ['MetalTek International', 'US alloy castings; domestic foundry', { text: 'Mid', align: AlignmentType.CENTER }, 'Capable but higher cost; little tariff-arbitrage or AI story'],
      ['Hitchiner / Signicast (Form)', 'US investment casting at scale; the domestic-premium option', { text: 'Large', align: AlignmentType.CENTER }, 'Scale and quality; domestic-premium pricing; legacy buyer experience'],
      ['China-direct / sourcing brokers', 'Trading companies or direct factory buys with no US partner', { text: 'Varies', align: AlignmentType.CENTER }, 'Cheap; no US inventory, engineering, quality department, or MBE; full tariff and quality risk on the buyer'],
      [{ text: 'JDH Today', bold: true }, { text: 'Multi-origin (China JV + India + Mexico + US), NMSDC MBE, in-house quality and machine shop, 35-yr OEM track record', bold: true }, { text: 'Mid', align: AlignmentType.CENTER, bold: true }, { text: 'Strong physical capability; the AI operating layer is the move from here', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(200),
  subHeader('Capability & AI Scorecard'),
  p('Reduced to the two things that decide whether an OEM finds JDH, trusts it, and keeps it — how much real supply-chain capability and cost advantage stands behind the quote, and how mature the digital and AI operating layer is — the picture is clear. JDH holds a genuinely strong capability position and cedes the AI ground; the domestic foundries are capable but expensive and manual; the brokers are cheap and bare.'),
  buildTable(
    [
      { label: 'Player', weight: 3.0 },
      { label: 'Supply-Chain Capability', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Digital & AI', weight: 2.0, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.8 },
    ],
    [
      ['Impro Precision', { text: 'High', align: AlignmentType.CENTER }, { text: 'Medium', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Scale-strong; no MBE or boutique edge'],
      ['Domestic foundries (MetalTek / Hitchiner / Signicast)', { text: 'High', align: AlignmentType.CENTER }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER }, 'Capable but higher-cost and manually operated'],
      ['CAB Worldwide / Bunty', { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER }, 'Direct analogs; legacy operated'],
      ['China-direct brokers', { text: 'Low', align: AlignmentType.CENTER }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER }, 'Cheap and bare; full tariff and quality risk on the buyer'],
      [{ text: 'JDH Today', bold: true }, { text: 'High', align: AlignmentType.CENTER, bold: true }, { text: 'Emerging', color: CORE_ORANGE, align: AlignmentType.CENTER, bold: true }, { text: 'MBE + multi-origin + quality dept = ready to add the AI layer', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 6.0 plots the field on those two axes. JDH sits in the bottom-right — strong supply-chain capability, emerging digital and AI. The move is straight up: keep the multi-origin, minority-owned, quality-led capability position and add the AI quoting, tariff-intelligence, and answer-engine layer that no competitor in the set operates, landing in a corner none of them currently holds.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Capability vs. AI Maturity', 560, 1.490),
  diagramCaption('Figure 6.0 — Competitive Positioning: Supply-Chain Capability vs. Digital & AI Operating Maturity'),
  spacer(160),
  calloutBox(
    'Where JDH Wins — The White Space',
    [
      'The top-right corner — a capable, multi-origin, minority-owned manufacturer running AI-speed quoting, tariff intelligence, and answer-engine authority — is empty. The domestic foundries have capability but cost and no tariff story; the brokers have cost but no US service, engineering, quality department, or MBE; the big precision players have scale but no diversity or boutique responsiveness.',
      'There is an honest opening even against the giants: capability does not mean responsive, and scale cannot manufacture a minority-owned certification or a four-country footprint overnight. JDH already has both, plus thirty-five years of OEM trust.',
      'JDH already owns the hard physical assets. Adding the AI operating layer puts it in a position none of its rivals occupy — and the same engine carries over to the China, India, and Mexico sites as the program scales.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For a thirty-five-year manufacturer with joint-venture foundries, a four-country footprint, minority-owned certification, and Fortune-500 supplier awards, the digital footprint materially under-represents the business — and it matters precisely when an OEM sourcing or NPI engineer’s first move is a search, an AI question, and a quick scan of the supplier’s public presence before an RFQ ever goes out. The operation is real; the buyer-facing surface that signals it is light.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.4 },
      { label: 'Gap / Opportunity', weight: 4.0 },
    ],
    [
      ['jdhpacific.com', 'Clean, informational capability and facilities pages; "Request a Quote" is a basic form', 'Answer-engine authority content (tariff-resilient sourcing, MBE Tier-2 value, total landed cost, PPAP-in-days); named case studies; an intelligent quote intake'],
      ['AI-search visibility', 'Below the citation surface on "offshore casting supplier," "minority-owned casting / forging supplier," "tariff-resilient China + Mexico sourcing partner"', 'Multi-Agent SEO + AEO — own the supplier-discovery answer in ChatGPT, Perplexity, and Google AI overviews'],
      ['MBE & supplier awards', 'NMSDC minority-owned status noted; Regal Beloit (2016) and Xylem (2019) supplier awards buried in the history page', 'Surface MBE and awards prominently — credibility the site under-plays, and the literal key to the supplier-diversity channel'],
      ['LinkedIn', 'Light company presence; little executive thought leadership', 'Donald Hu and Daniel Evans cadence on reshoring, tariff resilience, and minority-owned sourcing — the topics OEM sourcing leaders read'],
      ['Quote workflow', 'Manual: drawing and spec in, engineering reviews, quote out — bounded by engineering bandwidth', 'AI RFQ and drawing intelligence plus quote-history recall — quote in hours, capacity ceiling removed'],
      ['Qualification documents', 'Manual PPAP / FAI / COA and cert assembly; consumes engineering and quality time', 'AI cert-package assembly from real PC-DMIS inspection data, human-signed'],
      ['Institutional memory', 'Thirty-five years of quotes, tooling, part numbers, and customer preferences in Sage, spreadsheets, and people', 'Weaviate + Obsidian quote, part, tooling, and customer memory — instant recall, resilient to turnover'],
      ['Tariff / landed-cost operations', 'Manual and reactive to policy changes', 'AI tariff and trade-policy monitor plus a landed-cost-by-origin model'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the operation — only making a genuinely strong, thirty-five-year manufacturer visible to the OEM sourcing, NPI, and supplier-diversity buyers JDH is already qualified to serve.',
      'Answer-engine visibility, the executive LinkedIn cadence, the AI quoting layer, and the qualification-doc engine are compounding moves: each lifts the share of qualified RFQs JDH sees and the share it wins.',
      'They are also the natural first ninety days — get cited, capture the named-account intelligence, and surface the MBE channel — before any large build, so the entry phase pays back fast.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE SILENT MARGIN LEAK ----------
docChildren.push(
  ...sectionHeader('The Silent Margin Leak — Where Revenue Walks Out of a Contract Manufacturer', DARK_CHARCOAL, '08'),
  spacer(100),
  p('This section names the cost that does not appear on any report, because it is the one most expensive to ignore. A manufacturer with joint-venture foundries, a four-country footprint, minority-owned certification, and a thirty-five-year OEM track record should be holding more of its category than a hand-run quoting and qualification process can currently service. The revenue lost to quotes that went out slow or never, diversity slots that were never surfaced, and re-orders lost to thin memory is not a rounding error — it is a silent margin leak that never shows up as a line item, only as programs that went elsewhere, accounts that did not come back, and quoted margin that evaporated between quote and PO.'),
  spacer(140),
  subHeader('The Quotes That Went Out Slow — or Never Went Out'),
  p('Engineering bandwidth caps how many RFQs get a full, fast, complete quote. The hard or complex ones get deferred; the easy ones get worked; and the OEM awards the program to whoever quoted first. Every slow or skipped quote is a parts program lost to a faster competitor, not a better one. When a single won program can carry tens of thousands of dollars in first-year gross profit, even a handful of additional completed quotes per quarter — at the same win rate — adds up quickly. Quote velocity is not a soft metric here; it is programs on the table that are currently being left there. AI RFQ intelligence and quote-history recall remove the bandwidth ceiling without adding headcount.'),
  spacer(120),
  subHeader('The Supplier-Diversity Slots JDH Qualifies For but Never Surfaces Into'),
  p('As an NMSDC-certified minority-owned business, JDH is exactly what Fortune-500 Tier-1 and Tier-2 diverse-spend programs are looking for — a certified diverse supplier that can actually perform at scale. But that only converts if JDH is in the channel, registered in the right programs, and backed by audit-ready documentation. Diversity spend that JDH leaves on the table is among the highest-margin revenue in the business, lost silently because no one is working the channel systematically. Surfacing the certification and automating the qualification paperwork turns a dormant credential into an active pipeline.'),
  spacer(120),
  subHeader('The Re-Order Lost to Thin Memory — and the Margin Lost to Tariff Surprises'),
  p('A repeat part gets re-quoted from scratch — or lost — because the prior quote, tooling, and cost history live in a spreadsheet or in someone’s head, and the person who remembered it is busy or gone. And when a tariff or duty shifts between quote and purchase order and nobody catches it, a quoted job ships at a margin that quietly evaporated. Neither is a capability failure; both are memory and signal failures. AI quote-history memory makes thirty-five years of parts instantly recallable, and a tariff and landed-cost monitor flags the quoted jobs a policy change just made unprofitable, before the PO is accepted.'),
  spacer(120),
  calloutBox(
    'Three Leaks, One Engine',
    [
      'Quotes skipped because the engineering bandwidth ceiling is too low; diversity slots missed because no one works the channel; re-orders and margin lost because memory and tariff-signal monitoring are manual. None is a capability failure — each is a speed, channel, or memory failure.',
      'These are exactly the failures the AI engine closes: AI quote drafting and qualification-doc assembly against the indexed history, a surfaced and automated supplier-diversity channel, and quote-history memory plus a tariff monitor that protects quoted margin.',
      'This is the highest-conviction place to start, because it converts RFQs, certifications, and customer relationships JDH already has into programs and margin currently being lost.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services JDH would engage. Each is labeled for what it is, and each maps to a specific JDH use case. Technijian has not built an AI quoting or supply-chain platform for a contract manufacturer before; what it has built is the document, search, and knowledge AI such a platform is made of — and that is the honest claim. The unfair advantage is that Technijian already operates JDH’s servers, security, Microsoft 365, Sage ERP, and PC-DMIS quality environment across 47 users, so the build starts inside a system we already run.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60 to 80 percent less manual review.',
    'Pointed at the quoting workflow, the same approach reads an RFQ package and a drawing, drafts the quote and should-cost, and assembles the PPAP, FAI, COA, and supplier-qualification packages — at the same accuracy, in minutes instead of days, with a JDH engineer as the human-in-the-loop who signs. This is the flagship mapping.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70 percent.',
    'This is how JDH gets specified: answer-engine authority on the supplier-discovery queries that matter — offshore casting supplier, minority-owned casting and forging supplier, tariff-resilient China and Mexico sourcing partner — so that ChatGPT, Perplexity, and Google AI overviews surface JDH when an OEM sourcing or design engineer searches.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked, multi-model design is exactly what AI quoting and HTS classification need to be trade-compliance-defensible: three independent models review each draft quote, should-cost, and part classification, a JDH engineer is the human-in-the-loop arbiter, and every output is sourced and auditable. Auditable and explainable — the same discipline FINRA documentation requires, brought to the supplier-quality file.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'For JDH this is the quote, part, tooling, and customer memory — thirty-five years of quotes, material specs, tooling, and cost history searchable across the team and resilient to turnover, so a repeat part is recalled and re-quoted in minutes instead of rebuilt from scratch. The manufacturer’s quiet super-power.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI-Native SDLC v7.0',
    'Technijian designed an AI-first software development lifecycle integrating Claude Code with Figma Make, GitHub, and CI/CD — full lifecycle coverage with an AI-native development methodology.',
    'This is how the AI Quote & Quality-Doc engine ships in roughly ninety days instead of nine months — integrated with the Sage ERP and PC-DMIS environment Technijian already hosts for JDH, production-grade and audit-logged, not a long agency build. JDH owns what gets built.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services JDH Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations around a client’s actual process.',
    'This builds the working tools — the AI RFQ and drawing intelligence, the quote-history memory, the PPAP / FAI / COA engine, and the tariff and landed-cost dashboard — integrated with Sage and PC-DMIS and owned by JDH, not locked inside a third-party platform.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO — Answer-Engine Authority & Reputation',
    'My SEO is Technijian’s search service: local search optimization, reputation management, and answer-engine visibility so a business is found and trusted where its buyers actually look.',
    'For JDH it owns the answer-engine citations on supplier-discovery queries, drafts the under-covered category authority content (tariff-resilient sourcing, MBE Tier-2 value, total landed cost), and lifts the executive LinkedIn cadence that signals seriousness to OEM sourcing leaders.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Named-Account ABM',
    'My AI Lead Gen is Technijian’s productized account-based service — it tracks named accounts, watches buyer-side triggers, and produces account dossiers and personalized outreach rather than a broad funnel.',
    'For JDH it is the OEM account-intelligence engine: track the sourcing, commodity, and supplier-diversity managers at the named OEM accounts; watch for triggers (reshoring announcements, new product programs, tariff actions, plant expansions, supplier-diversity initiatives); and deliver pre-meeting dossiers the sales team can act on the day a program opens.',
    'service'
  ),
);

// ---------- 10 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms JDH’s Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get found and specified (own answer-engine authority on supplier-discovery queries, with an executive LinkedIn cadence on reshoring and tariff resilience), win the quote race (point AI at the RFQs, drawings, qualification packages, and tariff classification so quotes go out in hours and certs assemble themselves for a human to sign), and hold and grow (recall thirty-five years of quote and tooling history, protect quoted margin against tariff swings, and keep every supplier scorecard green). The first fills the top of the named-account funnel, the second is the quoting and qualification core, and the third protects and compounds the order book.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The JDH AI Growth & Integration Engine', 600, 1.596),
  diagramCaption('Figure 10.0 — The Engine: Get Found & Specified, Win the Quote Race, and Hold & Grow'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.9 },
      { label: 'Tool', weight: 2.5 },
      { label: 'What It Does', weight: 3.0 },
      { label: 'Metric', weight: 1.4 },
      { label: 'Service', weight: 1.4 },
    ],
    [
      ['Get Found & Specified', 'Answer-engine authority (AEO)', 'Be cited by Google AI, ChatGPT, Perplexity on supplier-discovery queries', 'Citation rate', 'My SEO'],
      ['Get Found & Specified', 'Authority content engine', 'Tariff-resilient sourcing, MBE Tier-2 value, total landed cost', 'Share of voice', 'My SEO'],
      ['Get Found & Specified', 'Named-account intelligence', 'Trigger monitor on reshoring, new programs, tariff actions, diversity pushes', 'Trigger-to-RFQ', 'My AI Lead Gen'],
      ['Get Found & Specified', 'Executive LinkedIn cadence', 'Donald + Daniel voice on reshoring and tariff resilience', 'Reach', 'My SEO'],
      ['Win the Quote Race', 'AI RFQ / drawing intelligence', 'Drawing + spec into a draft quote and should-cost, 3-model checked', 'Quote turnaround', 'My Dev'],
      ['Win the Quote Race', 'AI quote-history memory', 'Instant re-quote of prior parts, tooling, and cost history', 'Re-quote speed', 'My Dev'],
      ['Win the Quote Race', 'AI PPAP / FAI / COA engine', 'Assemble qualification and cert packages from PC-DMIS data', 'Doc hours saved', 'My Dev'],
      ['Win the Quote Race', 'AI tariff & landed-cost dashboard', 'HTS assist, landed-cost-by-origin model, trade-policy monitor', 'Margin protected', 'My Dev'],
      ['Hold & Grow', 'Quote / part / tooling memory', 'Thirty-five years searchable across the team', 'Retrieval depth', 'My Dev'],
      ['Hold & Grow', 'Supplier-scorecard automation', 'COA on every lot; keep OEM ratings green', 'Scorecard health', 'My AI'],
      ['Hold & Grow', 'Tariff-margin protection', 'Flag quoted jobs a duty or policy shift would erode', 'Margin saved', 'My AI'],
      ['Hold & Grow', 'Engineering capacity recovery', 'Hours back from quoting and docs go to more quotes and DFM', 'Hours recovered', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI drafts, classifies, assembles, and monitors — with sources cited and inside the documentation rules the OEM and the regulator expect. It gives every RFQ, every part, and every qualification package the same complete, fast, in-format treatment.',
      'AI never fabricates an inspection result, never invents a country-of-origin claim, and never sets a price in an antitrust-sensitive way. A JDH engineer signs the material cert and a licensed broker signs the customs entry, in writing, outside the compliance and antitrust risk entirely.',
      'The team is freed, not replaced: the AI handles the documentation tax, the tariff signal monitoring, and the memory; the team spends its time on the customer relationships, the design conversations, and the negotiations that win programs.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on the highest near-term levers — answer-engine authority, named-account intelligence, and a strategy workshop — and expands into the custom AI Quote & Quality-Doc engine, the tariff dashboard, and the fractional AI advisor only as the results prove out. The model below is built from public information and conservative assumptions, because JDH’s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 14 replace them with real baselines.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3.2 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.6 },
    ],
    [
      ['Answer-engine citation on supplier-discovery queries', 'Below the citation surface', 'Cited by Google AI, ChatGPT, Perplexity', 'Discoverability'],
      ['RFQ-to-quote turnaround time', 'Days; engineering-bandwidth limited', 'Hours with AI quote drafting', 'Velocity'],
      ['Quotes completed per engineer per quarter', 'Bandwidth-limited; quiet triage', 'Ceiling removed by AI drafting + recall', 'Capacity'],
      ['Supplier-qualification doc assembly (PPAP / FAI / COA)', 'Manual, slow, engineer-time heavy', 'Assembled from PC-DMIS data, human-signed', 'Quality + speed'],
      ['Supplier-diversity slots surfaced into', 'Ad hoc', 'Systematic MBE Tier-2 channel', 'Win rate'],
      ['Quoted-margin protection vs. tariff shifts', 'Reactive; caught late', 'Monitored and flagged before the PO', 'Margin'],
      ['Re-quote / re-order recall', 'From scratch; spreadsheet- and memory-bound', 'Instant from thirty-five years of memory', 'Retention'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model — The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the highest-conviction levers — incremental gross profit on programs won faster, engineering and quality hours recovered, and quoted margin protected — not on price changes, because pricing stays out of scope. The entry program alone (answer-engine authority, named-account intelligence, and the strategy workshop) drives the lift below; the custom AI Quote & Quality-Doc engine pushes every lever further.', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 4.0 },
      { label: 'Conservative', weight: 2.0, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.0, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.0, align: AlignmentType.CENTER },
    ],
    [
      ['Incremental part programs won (faster quote + AEO + ABM), gross-profit contribution', { text: '+$70K', align: AlignmentType.CENTER }, { text: '+$150K', align: AlignmentType.CENTER }, { text: '+$260K', align: AlignmentType.CENTER }],
      ['Engineering + quality hours recovered (quote + PPAP / COA automation)', { text: '+$20K', align: AlignmentType.CENTER }, { text: '+$40K', align: AlignmentType.CENTER }, { text: '+$70K', align: AlignmentType.CENTER }],
      ['Margin protected (tariff / landed-cost intelligence + fewer re-quotes)', { text: '+$15K', align: AlignmentType.CENTER }, { text: '+$35K', align: AlignmentType.CENTER }, { text: '+$60K', align: AlignmentType.CENTER }],
      [{ text: 'Total Projected Y1 Value', bold: true }, { text: '+$105K', bold: true, align: AlignmentType.CENTER }, { text: '+$225K', bold: true, align: AlignmentType.CENTER }, { text: '+$390K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '~3.3x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~7.0x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~12.2x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only — the easiest possible place to start. It does not count the larger gains the custom AI Quote & Quality-Doc engine adds (quote-velocity compounding, the supplier-diversity channel maturing, and the re-quote win-rate lift), nor the Phase-3 reuse of the engine across the China, India, and Mexico sites. Average program value and margin are illustrative placeholders and are replaced with JDH’s actual book in discovery. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Service Investment Map — Start Small, Expand as It Proves Out'),
  buildTable(
    [
      { label: 'Service', weight: 3.2 },
      { label: 'Scope', weight: 3.4 },
      { label: 'Monthly', weight: 1.3, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.3, align: AlignmentType.CENTER },
    ],
    [
      ['My AI — Readiness + Executive Workshop (one-time)', 'A one-day session with Donald, Daniel, the quality lead, and engineering — quote and qualification workflow tour, build scoping, trade-compliance and quality governance baseline', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — Tier 3 + AI Search Optimization', 'Own answer-engine citations on supplier-discovery queries; authority content on tariff-resilient and minority-owned sourcing; executive LinkedIn cadence', { text: '$1,200', align: AlignmentType.CENTER }, { text: '$14,400', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account ABM (Starter)', 'Track OEM sourcing, commodity, and supplier-diversity managers; trigger monitoring (reshoring, new programs, tariff actions); per-account dossiers', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,200/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — AI Quote & Quality-Doc Engine (Phase 2 build)', 'AI RFQ / drawing intelligence + quote drafting + should-cost + PPAP / FAI / COA assembly + tariff / landed-cost dashboard + quote-history memory, integrated with Sage + PC-DMIS', { text: '—', align: AlignmentType.CENTER }, { text: '~$72,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, audit-log review, and iteration of the engine', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, trade-compliance and quality governance, model performance review, team training', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $5,000/mo + build', bold: true }, { text: '', bold: true }, { text: '~$137,000', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $32,000 entry program — answer-engine authority, named-account intelligence, and the strategy workshop — that pays for itself on additional programs won and recovered engineering hours, with no large build to begin.',
      'Expand into the full engine (the custom AI Quote & Quality-Doc engine, the tariff dashboard, the managed app services, and the fractional AI advisor) only once the entry proves the lift. That one-time build becomes a permanent JDH advantage, integrated with the Sage and PC-DMIS environment Technijian already runs.',
      'Phase 3 is reuse: roll the engine across the China, India, and Mexico sites, and productize the tariff-intelligence and supplier-diversity module. Treat it as upside, not the Year-1 ask. Productized "My X" services beyond My SEO are estimated and confirmed at quote.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan — and because Technijian already runs the environment, the start is fast. Begin with the low-commitment entry: get found and specified and stand up the named-account intelligence. Then build the AI quote and qualification engine and the tariff dashboard. Then hold, grow, and scale across the sites. Real gains — answer-engine citations, named-account dossiers, the surfaced MBE channel — are visible inside the first ninety days, before the larger build; the deeper engine and the multi-site roll-out are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'JDH 90-180-270 Day Roadmap', 600, 2.273),
  diagramCaption('Figure 12.0 — The JDH Growth & Integration Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Get Found & Specified (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — get cited on supplier-discovery queries and stand up the named-account intelligence, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — AEO + Authority Content', 'Launch Multi-Agent SEO and answer-engine optimization targeting the supplier-discovery queries that matter (offshore casting supplier, minority-owned casting and forging supplier, tariff-resilient China and Mexico sourcing partner). Draft the under-covered category authority content (total landed cost by origin, substantial transformation explained, MBE Tier-2 value, PPAP in days). Lift the Donald and Daniel LinkedIn cadence on reshoring and tariff resilience.'],
      ['1.2 — Named-Account Intelligence Standup', 'Stand up the named OEM account list across the existing-class accounts, reshoring-active OEMs, and supplier-diversity programs. Begin trigger monitoring (cost-down cycles, supplier re-sources, new programs, tariff actions, diversity pushes). Deliver pre-meeting account dossiers to the sales team — the entry program’s fast win, with no custom build required.'],
      ['1.3 — AI Readiness Workshop + Credential Foundation', 'Run the one-day workshop with Donald, Daniel, the quality lead, and engineering — quote and qualification workflow tour, build scoping, trade-compliance and quality governance baseline. Surface the NMSDC MBE status and the Regal and Xylem supplier awards prominently on the site and LinkedIn; begin the supplier-diversity channel work.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Win the Quote Race (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — the AI quote and qualification engine and the tariff dashboard, integrated with the Sage and PC-DMIS environment Technijian already hosts.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — AI RFQ / Drawing Intelligence + Quote Drafting', 'Read drawings, specs, and RFQ packages; draft the quote and should-cost; three-model review (the ScamShield pattern) on every draft; engineer-in-the-loop approval before any quote goes to the customer.'],
      ['2.2 — AI Quality-Doc Engine', 'Assemble PPAP, FAI, and COA packages from real PC-DMIS inspection data; auto-respond to customer supplier-questionnaires; every package human-signed by a quality engineer before release.'],
      ['2.3 — Tariff & Landed-Cost Dashboard + Quote-History Memory', 'HTS classification assist, landed-cost-by-origin model, and trade-policy monitor, integrated with Sage. Index thirty-five years of quotes, tooling, and parts in the Weaviate + Obsidian memory. Fractional AI Advisor onboards with a weekly cadence; trade-compliance and quality governance review begins.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Hold, Grow & Scale (Days 181–270)', { color: CORE_ORANGE }),
  p('Add the retention layer, roll the engine across the sites, and begin productizing the tariff and diversity module.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Supplier-Scorecard Automation + Margin Protection', 'Automate the COA-on-every-lot flow to keep OEM supplier ratings green. Stand up the quoted-margin protection that flags jobs a duty or policy shift has eroded before the PO is accepted. Add an account-renewal and re-order intelligence view per account.'],
      ['3.2 — Roll Across Sites + Productize (SCALE)', 'Roll the quote and qualification engine and the memory layer across the China, India, and Mexico operations. Productize the tariff-intelligence and supplier-diversity reporting as a repeatable managed module. Deliver an ROI dashboard measured against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Six actions JDH can take immediately — before any new Technijian engagement beyond the IT services already in place. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Test Answer-Engine Visibility for Supplier-Discovery Queries',
    ['Type the queries a real OEM sourcing or NPI engineer would type into ChatGPT, Perplexity, and Google AI: "offshore casting supplier," "minority-owned casting and forging supplier," "tariff-resilient China and Mexico sourcing partner," "contract manufacturer cast forged machined components." See whether JDH is cited; capture a screenshot baseline. It costs nothing and immediately sizes the answer-engine opportunity.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Run a Free AI Quote-Velocity Audit',
    ['Technijian’s no-cost growth hook: map how long an RFQ takes today end to end — from drawing-in to quote-out — and exactly where it stalls. Delivered as a one-page bottleneck map. (JDH already receives monthly IT and network-security scans as a managed client, so this is the growth analog of that assessment, pointed at the quote process.)'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Map the Top 20 OEM Accounts with a Reshoring, Tariff, or Diversity Trigger',
    ['The named-account seed list. Free to assemble from public press and the existing customer base: the OEM accounts where a reshoring announcement, a tariff-exposure event, or a supplier-diversity initiative makes a new program statistically likely in the next twelve months. This is the list the named-account ABM intelligence will work from day one.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Surface the MBE Certification and Supplier Awards',
    ['Put the NMSDC minority-owned certification and the Regal Beloit (2016) and Xylem (2019) supplier awards prominently on the site and on LinkedIn. Free; it is credibility the site under-plays today and the literal key to the Fortune-500 supplier-diversity channel.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Open a Content Calendar with Daniel and Donald',
    ['Five topics, owned by the leadership team, drafted for their cadence: "Total landed cost: China vs. Mexico vs. India in 2026," "What substantial transformation means for your tariff exposure," "Why a Tier-2 minority-owned casting supplier de-risks your spend," "PPAP in days, not weeks," and "Dual-source without dual-managing." These compound on Google, Perplexity, and LinkedIn for years.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('6 — Inventory the Quote and Part Data in Sage',
    ['Map what the Sage ERP captures on each quote and part today and what the AI quote engine will need (drawings, part history, tooling, material specs, cost history). This is a free internal audit; it informs the workshop and accelerates the Phase 2 build — and Technijian already knows the Sage environment.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information plus Technijian’s internal records of the JDH IT environment. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with JDH’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Program economics', 'Average first-year value and gross margin of a won part program', 'Replaces the gross-profit placeholders in the ROI model'],
      ['Quote volume & velocity', 'RFQs per month, current win rate, current RFQ-to-quote turnaround time', 'Calibrates the quote-velocity lift directly'],
      ['Named-account roster', 'Which OEM accounts are live vs. qualified-but-dormant; revenue concentration', 'Seeds the ABM target list and sizes the re-order pool'],
      ['Sage + PC-DMIS architecture', 'Quote and part data captured today; PC-DMIS / Hexagon integration surface; data format', 'Defines the Phase 2 build and integration scope'],
      ['Supplier-diversity activity', 'Which OEM diversity programs JDH is registered in today; Tier-2 reporting in use', 'Sizes the supplier-diversity channel opportunity'],
      ['Marketing ownership', 'Agency, internal, or none; current content cadence; who owns LinkedIn', 'Defines the content engine handoff'],
      ['Revenue band', 'Current revenue scale and growth rate since the 2018 $30M milestone', 'Calibrates entry vs. expansion sizing'],
      ['Growth plan', 'Reshoring strategy; Mexico and India expansion; capacity plans for 2026-2027', 'Phases the expansion and SCALE conversation'],
      ['Trade-compliance ownership', 'In-house or broker; HTS classification process today; tariff exposure by origin', 'Sets the trade-compliance boundary and the tariff-dashboard scope'],
      ['Engineering & quality capacity', 'Headcount; hours spent on quoting and qualification docs today', 'Sizes the hours-recovered lever'],
      ['Productization appetite', 'Whether JDH would entertain productizing the tariff and quote module across sites', 'Decides whether the Year-2 conversation is multi-site or single-site'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 entry proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on JDH’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('JDH already has the hard things: joint-venture foundries, a four-country supply chain, an in-house quality department and machine shop, NMSDC minority-owned certification, a thirty-five-year track record with Fortune-500 OEMs, and a Technijian team that already runs its servers, security, Microsoft 365, Sage, and PC-DMIS environment. What it has not yet done is add the AI operating layer that turns those assets into faster quotes, surfaced supplier-diversity spend, and tariff resilience marketed as a buyer benefit — and that is where this program starts.'),
  p('The opportunity is concrete: get found and specified as the supplier OEM sourcing and design engineers ask about first, win the quote race by turning drawings and RFQs into accurate quotes and qualification packages in hours, and hold and grow by recalling thirty-five years of history, protecting quoted margin against tariff swings, and keeping every supplier scorecard green. A focused, account-based program does all three — and it stays inside the trade-compliance and quality-integrity boundary that makes the speed defensible to a Fortune-500 supplier-quality reviewer.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope — easy to schedule, because the team already meets with JDH on IT.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — answer-engine authority, named-account intelligence, and the strategy workshop — live inside 30 days of go-ahead, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to quote in hours, not days — and hold every OEM account against the next tariff swing?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(100),
  p('Technijian is an AI-native managed-services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000 — and JDH’s managed-IT and hosting partner today. We build and operate the AI systems that help capable operators compete at speed, with security and compliance built in, not bolted on. Technology as a solution.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for JDH', weight: 5 }],
    [
      ['My Dev', 'Custom AI-native builds — the AI RFQ and drawing intelligence, quote-history memory, PPAP / FAI / COA engine, and tariff and landed-cost dashboard — integrated with Sage and PC-DMIS and owned by JDH'],
      ['My SEO', 'Answer-engine authority on supplier-discovery queries, the under-covered tariff-resilient and minority-owned category content, and the executive LinkedIn cadence'],
      ['My AI Lead Gen', 'Named-account ABM intelligence on OEM sourcing, commodity, and supplier-diversity managers; reshoring, new-program, and tariff trigger monitoring; account dossiers'],
      ['My AI', 'AI strategy and builds — fractional AI advisor, model performance review, trade-compliance and quality governance, team training'],
      ['Managed IT, Hosting & Security', 'The server hosting, CrowdStrike and Huntress security, Microsoft 365, and backup Technijian already runs for JDH across 47 users — the foundation the AI layer builds on'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Founder & CEO', 'Ravi Jain — RJain@technijian.com'],
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
  p('Market and category intelligence gathered via public web research conducted June 2026, plus Technijian’s own internal records of the JDH IT environment. Company details (founding, locations, services, leadership, customers, and certifications) are drawn from public sources and JDH’s own website and should be confirmed with JDH before external use.', { italics: true }),
  spacer(120),
  p('1. JDH Pacific — jdhpacific.com (Home, About Us, Why JDH Pacific, Capabilities / Industries Served, Global Facilities, History, Supply Chain Management, Contact). Cast, forged, and machined component supplier and supply-chain manager; founded 1989; Fullerton HQ plus a 90,000 sq ft La Mirada warehouse; joint-venture offshore foundries in China; offices and warehouses in the US, Mexico, China, and India; NMSDC-approved Minority Owned Business.', { size: 20 }),
  p('2. JDH Pacific history page — milestones (Beijing 1991, JMI joint venture 2002, Shanghai 2005, $30M revenue 2018, La Mirada 2016, India 2023) and named customers (Dywidag-Systems / DSI, Parker-Hannifin, Emerson Electric, Dover, Paccar, Eaton, Borets-Weatherford, Xylem, Regal Beloit / Regal Rexnord); supplier awards (Regal Beloit Supplier of the Year 2016, Xylem Supplier Award 2019).', { size: 20 }),
  p('3. Leadership and company directory — The Org (Donald Hu, Founder & CEO; Daniel Evans, VP Sales & Supply Chain); ZoomInfo, Dun & Bradstreet, Clodura, and LeadIQ company profiles (industry, location, employee and revenue indicators).', { size: 20 }),
  p('4. Trade policy — United States Trade Representative Section 301 tariff actions on China; US Customs and Border Protection substantial-transformation doctrine on country of origin; the USTR Section 301 investigation into Mexico opened March 2026; Mexico’s December 2025 import-duty decree; nearshoring and foreign-direct-investment trend reporting for US-adjacent manufacturing.', { size: 20 }),
  p('5. Competitors — Impro Precision Industries; CAB Worldwide; Bunty LLC; MetalTek International; Hitchiner Manufacturing; Signicast / Form Technologies; and China-direct sourcing and trading firms. Public websites and Dun & Bradstreet / ZoomInfo competitor listings (which also name General Stamping & Metalworking, Deco Products, State Line Foundries, and Keystone Friction Hinge).', { size: 20 }),
  p('6. US DOJ v. RealPage (2024 filing, 2025 proposed settlement) as the algorithmic-pricing antitrust analog imported by reference to the supply-chain pricing boundary.', { size: 20 }),
  p('7. Technijian internal records — the JDH managed-IT and hosting engagement (47 active users; hosted server estate; CrowdStrike, Huntress, Cisco Umbrella, Sophos, and Exchange Online Protection security stack; Microsoft 365; Sage ERP; PC-DMIS / Hexagon quality environment; monthly network-security scans). Internal source of the warm-expansion context.', { size: 20 }),
  p('8. Technijian service capability — the My AI "Proven Results" (Multi-Agent SEO and answer-engine platform; AI Document Intelligence for FINRA broker-dealers; ScamShield LLM Council; Weaviate + Obsidian enterprise knowledge and memory; AI-Native SDLC v7.0).', { size: 20 }),
  p('9. Technijian service pricing — My SEO tiered pricing $500 to $1,500 monthly with $200 add-ons (AI Search Optimization); My AI Lead Gen Starter $1,000 monthly; My AI Workshop $5,000 one-time; My AI Fractional Advisor $2,000 monthly; My Dev custom build scoped $40,000 to $120,000; My Dev Managed App Services $800 monthly. Productized "My X" services beyond My SEO are estimated and confirmed at quote.', { size: 20 }),
);

// =====================================================================
// DOCUMENT ASSEMBLY
// =====================================================================
const NUM_BULLETS = 'bullets';
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

const OUT_PATH = path.join(__dirname, 'JDH-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
