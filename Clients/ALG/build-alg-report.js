// Algro International (ALG) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/AAVA/build-aava-report.js (TALY/VAF/SCF/ORX/MWAR/RKE lineage).

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

const TODAY = '2026-05-28';
const CLIENT = 'Algro International';

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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Algro: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ALGRO INTERNATIONAL', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Premium Specialty Rice & Grains  ·  Private-Label, Foodservice & Industrial', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California  |  algrointernational.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Algro International LLC', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '1969', label: 'Parent Bharat Industrial Founded', color: CORE_BLUE },
    { number: '11–50', label: 'US Team across Irvine, NJ & BC', color: CORE_ORANGE },
    { number: '18%', label: 'US Tariff after 2025–26 swing (10→50→18%)', color: TEAL },
    { number: '2028', label: 'FSMA 204 Enforcement (extended Aug 2025)', color: GOLD },
  ]),
  spacer(300),
  p('Algro International is the US arm of a 57-year-old Indian rice miller, Bharat Industrial Enterprises Ltd, with three North American facilities — Irvine, Jersey City, and Burnaby, BC — and a product line that runs from premium Indian basmati and Thai jasmine to organic, instant, ready-to-serve, and individually quick-frozen rice. The company sells through three channels — industrial procurement at CPG manufacturers, foodservice operators and their broadline distributors, and the private-label teams at the major retailers. The buyer universe in each channel is finite and named, which makes this an account-based business, not a broad-market one — and that single fact decides how AI is applied.'),
  p('The product, the parent-company scale, and the certifications are competitive. The growth gap is somewhere else. Premium-rice procurement in 2026 is governed by three forces a thirteen-person US team cannot keep up with by hand: a documentation tax that runs into hundreds of buyer-requested artifacts per active account per year — FSVP, HARPC, organic chain of custody, lot COAs, kosher and halal letters, sustainability scorecards, per-SKU technical responses; a tariff environment that swung from 10 percent to 50 percent to a settled 18 percent on Indian basmati inside one year and remains politically live; and a multi-origin compliance surface across India, Thailand, and US-domestic supply that the FDA Food Traceability Rule will codify in 2028 but that the major retailers are already requiring in supplier agreements today. The competitors at scale — LT Foods, KRBL, Riviana, Tilda, Olam — are larger but uniformly behind on AI-enabled buyer-experience, AI-search visibility, and category thought leadership on exactly that triangle.'),
  p('This blueprint is a focused, account-based program built for how a B2B private-label and foodservice supplier actually wins: get cited and discovered (own AI-search citations for procurement queries and the under-covered tariff and FSMA conversation), win the buyer-documentation race (auto-draft RFP and RFI responses, index the certification library, run a multi-origin chain of custody, watch the tariff signal), and hold the account and expand (sales-pipeline knowledge memory, per-SKU automation, renewal intelligence, and a deliberate path to reuse the same engine for the Simply So consumer brand and the parent BIEL’s 54-country export markets). Every piece is designed inside the legal boundary that decides which AI is even safe to deploy in this category: AI auto-drafts, indexes, monitors, and remembers — but Technijian does not provide rent-style algorithmic pricing in any antitrust-sensitive way, and AI never replaces a GFSI or food-safety determination.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Algro has the supply (Bharat Industrial’s 57-year mill), the certifications (USDA NOP organic since 2020, parent BRC / ISO 22000 / HACCP), and the existing Technijian managed-services and cybersecurity relationship. What it does not yet have is the AI-driven buyer-experience layer that decides who responds to the next big RFP in days instead of weeks.',
      'The 2025 US tariff swing, FSMA 204 readiness, and the multi-origin compliance triangle are real, defensible moats — and the category’s giants are uniformly behind on AI-buyer-experience and AI-search visibility. A thirteen-person Irvine team can deploy AI faster than a multi-billion-dollar competitor can re-platform.',
      'The right entry is small, low-commitment, and pays back fast. The expansion build — the buyer-documentation engine, the traceability layer, the tariff signal monitor — comes second, once the entry proves the lift. The Simply So consumer brand and the BIEL export portfolio are reuses of the same engine, not a separate ask.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information. Algro’s internal numbers — current named-account roster, average first-year value of a won account by persona, GFSI / kosher / halal status at the US facility, current sales engine, and tariff-exposure book — were not available for this draft. Every projection below is labeled estimated and conservative and calibrates to real numbers after a short discovery call. The specific questions are in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW A B2B RICE IMPORTER WINS ----------
docChildren.push(
  ...sectionHeader('How a B2B Rice Importer Wins', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for a premium-rice supplier starts with how the business actually earns. Revenue is not built on broad consumer marketing; it is built on a finite, named universe of buyers — retail private-label brand teams, industrial CPG procurement, foodservice operators and their broadline distributors, specialty and ethnic brand owners, and a handful of institutional channels. Every account moves through the same buying process: a procurement researcher discovers the supplier, a category buyer qualifies the fit, a quality team reviews the documentation, a sampling and audit cycle confirms the spec, an award is signed, and the account either renews or is re-bid. The diagram below shows the funnel, the demand that feeds it, and the points where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The B2B Named-Account Growth Engine', 600, 1.667),
  diagramCaption('Figure 2.0 — The B2B named-account growth engine: how procurement discovers, qualifies, documents, awards, and renews'),
  spacer(120),
  subHeader('Discovery — How a Buyer Even Finds the Supplier'),
  p('In 2026 a procurement researcher at Costco, Sysco, or Conagra does not start with a Yellow Pages directory; they start with a search and, increasingly, with a question typed into ChatGPT, Perplexity, or Google’s AI overview. They ask things like “USDA NOP certified organic basmati private-label supplier in California” or “FSMA-204-ready rice importer with halal and kosher.” The supplier the AI cites — once — is on the shortlist; the supplier it does not is not. This is the first and least-recognized place where a small, modern operator out-competes a big, conservative one.'),
  subHeader('The Award Is Won on Documentation Velocity'),
  p('Once a buyer raises a hand, the contest is administrative speed. A serious retailer or industrial RFP is a hundred-plus questions on capability, food safety, traceability, sustainability, packaging, and specification — answered against a thick library of FSVP plans, preventive-control plans, lot COAs, organic certificates, kosher and halal letters, allergen statements, and per-SKU technical responses. The supplier who returns a complete, in-format response in days, not weeks, wins more awards at the same win rate. That is not a soft claim; it is what the buyer is rewarding.'),
  subHeader('The Cheapest Win Is the Renewal'),
  p('Winning a private-label or foodservice account costs a year of relationship work and an audit cycle; renewing one costs an in-spec record and a fair, timely conversation when the contract comes up. The biggest avoidable losses in this category are accounts that quietly slip when a competitor responds to a tariff swing or a buyer audit faster, not accounts that lose head-to-head on quality. Retention is the quiet half of the engine, and it is where account-renewal intelligence — watching volume drift, audit cycles, and price-hold expirations — pays back fastest.'),
  spacer(120),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Get cited and discovered: be the supplier procurement finds first when it searches Google, Perplexity, or ChatGPT — and the one whose name is in the under-covered tariff, FSMA, and multi-origin compliance conversation.',
      'Win the documentation race: auto-draft RFP and RFI responses in the buyer’s exact format from an indexed library of certifications, COAs, and prior responses, in minutes instead of weeks.',
      'Hold and expand: keep a searchable memory of every buyer conversation, audit, and recipe iteration, watch renewal triggers proactively, and reuse the same engine for the Simply So consumer brand and the BIEL parent export markets.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE COMPLIANCE BOUNDARY ----------
docChildren.push(
  ...sectionHeader('The Compliance Boundary — FSMA, Tariffs, Multi-Origin & the Pricing Line', TEAL, '03'),
  spacer(100),
  p('Premium-rice importing is one of the most regulated B2B categories there is, and AI raises the stakes in specific, nameable places. This section names them plainly, because the value of a Technijian-built program is not just that the AI is fast — it is that the AI is fast and safe. The boundary is simple to state: AI auto-drafts, indexes, monitors, and remembers; it never replaces a GFSI or food-safety determination, and it never makes pricing decisions in any antitrust-sensitive way.'),
  spacer(140),
  subHeader('FDA FSMA Section 204 — The Food Traceability Rule'),
  p('The FDA Food Traceability Rule sits at the centre of where retail and foodservice buyer requirements are heading. The original compliance date was January 20, 2026; in August 2025 the FDA proposed a thirty-month extension and the November 2025 Continuing Appropriations Act directed the agency not to enforce the rule before July 20, 2028. The substance of the rule is unchanged. Even though enforcement now sits in 2028, the practical reality for a supplier is that the top retailers are already pre-flighting traceability readiness in supplier agreements today, because they intend to be ahead of the deadline. Buying into FSMA-204-ready supplier capability now is a procurement de-risking signal that beats competitors in head-to-head reviews. Note that rice itself is not currently on the FDA Food Traceability List; the IQF vegetables Algro carries may be, depending on classification — a discovery item, not a guess.'),
  spacer(120),
  subHeader('US Import Tariffs — The 2025–2026 Swing Is Real'),
  p('In 2025 the US tariff on Indian basmati rice escalated from 10 percent to 50 percent before settling at 18 percent in early 2026 after the India–US trade deal — a movement reported by the Indian Rice Exporters Federation and confirmed in trade press. That sits alongside Thai tariffs around 19 percent and Pakistani tariffs near 19 percent. From April through November 2025 alone, Indian basmati exports to the United States ran roughly 199,558 tonnes worth approximately 1,749 crore rupees. The translation for a US-based importer is straightforward: cost of goods on the most important product category moved by hundreds of basis points inside one year, with more political risk on the calendar. AI that watches tariff signals — USITC postings, India and Thailand commerce-ministry filings, freight indices, and FX — and proactively reformulates buyer cost models and origin-mix proposals is a defensible capability AND a reason to call procurement directors right now.'),
  spacer(120),
  subHeader('Multi-Origin Compliance & Chain of Custody'),
  p('Algro sources Indian basmati through Bharat Industrial, Thai jasmine and specialty varieties (Hom Mali, Pathum Thani, Red Cargo), and US and Canadian organic supply via the CCOF NOP processor-handler certificate held in Irvine since April 2020 (extended for US/Canada Equivalence in July 2023). Each origin carries its own audit cycle, residue testing, segregation requirement, and certificate body. The Foreign Supplier Verification Program (FSVP) applies because the importer of record sits in the United States, and HARPC preventive controls apply at the Irvine and Jersey City handling facilities. Every retail and industrial buyer audits these. A digital chain of custody — input certificate to lot to product to buyer COA, kept current automatically across origins — reduces the audit surface for every account at the same time.'),
  spacer(120),
  subHeader('The Pricing Line — What This Program Will Not Touch'),
  p('There is one category of B2B-supply AI that this program explicitly avoids: algorithmic pricing in any antitrust-sensitive arrangement that shares non-public data across competitors or aligns prices among multiple suppliers. The recent US Department of Justice action against RealPage in multifamily — Sherman Act counts, a co-plaintiff California, a 2025 proposed settlement, and a wave of state and municipal bans — is the doctrine landmark, and a thoughtful operator imports the principle into the food category whether the case law has fully caught up or not. Pricing decisions stay with Algro and its buyers. AI may inform cost models with public tariff and freight data; it does not feed a multi-supplier pricing engine and it does not match prices across competitors.'),
  spacer(120),
  calloutBox(
    'The Boundary — AI Serves, A Person Decides',
    [
      'AI auto-drafts the RFP response, indexes the FSVP and COA library, watches the tariff signal, and remembers every buyer conversation — uniformly, with sources cited, and inside the documentation rules each buyer audit applies.',
      'AI never makes the GFSI / food-safety determination, never approves a lot release, and never sets pricing in an antitrust-sensitive way. A person owns the safety decision, the lot release, and the pricing — outside the regulatory and antitrust risk entirely.',
      'That boundary is the point: Algro gets enterprise-grade documentation velocity without putting its name on a decision it did not make or a price an algorithm set.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 04 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '04'),
  spacer(100),
  p('Because Algro sells to a finite, named universe of buyers — not a broad consumer market — this is an account-based program: the job is to be discovered by, respond faster to, and retain a known set of accounts across four channels. The growth comes from four pools, and the same AI engine serves all four. The point of AI is to be cited first, to respond completely in days instead of weeks, and to keep a searchable memory of every relationship the small US team has earned.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.6 },
      { label: 'The Named Universe', weight: 3.4 },
      { label: 'How Algro Captures It', weight: 4 },
    ],
    [
      ['Retail private-label awards', 'Costco (Kirkland), Walmart (Great Value), Kroger (Simple Truth / Private Selection), Target (Good & Gather), Whole Foods (365), Sprouts, Trader Joe’s, Aldi, Wegmans', 'AI-cited authority on organic and specialty rice queries; auto-drafted RFP responses in the buyer’s exact format; FSMA-204 readiness as a de-risking signal'],
      ['Industrial / CPG procurement', 'Conagra, Nestlé, Kraft Heinz, General Mills, Amy’s Kitchen, Saffron Road, Tattooed Chef, Maya Kaimal, regional frozen-meal co-packers', 'Per-SKU spec automation, lot-level COA delivery, capacity-flex documentation, recipe-development partnership through the sales memory engine'],
      ['Foodservice & distribution', 'Sysco, US Foods, Performance Food Group, UNFI, KeHE, restaurant chains (Chipotle, Cava, Sweetgreen, Halal Guys, Cheesecake Factory, Texas Roadhouse, Panera, P.F. Chang’s)', 'GS1 / GDSN spec-sheet automation, tariff-resilient price-hold proposals, same-day technical response, fast hold and recall coordination'],
      ['Specialty / ethnic / mission-driven', 'Saffron Road, Maya Kaimal, Tasty Bite, Stonefire, Kitchens of India, growing CPG and restaurant brands that need organic, halal, kosher, Indian and Thai together', 'The right-sized partnership: minimum-order flexibility, recipe iteration, brand-storytelling support — accelerated by the sales memory'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based by Design — Discover, Document, Hold',
    [
      'Unlike a consumer-facing supplier, Algro lives on a named universe of buyers. The work is depth and speed inside each account, not shotgun marketing — and the AI is sized for that motion, not for a broad funnel.',
      'The highest-return pool is also the one most easily under-served: the buyer who already audited Algro last year and has an upcoming re-bid. Account-renewal intelligence — watching volume drift, audit cycles, and competitor signals — protects revenue the small US team would otherwise lose to faster responders.',
      'Every motion here is measurable — AI-citation rate on procurement queries, RFP response time, win rate by channel, certification-pack completeness, and renewal rate — so the program is tuned to what actually moves the order book.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE ALGRO BUYER (PERSONAS) ----------
docChildren.push(
  ...sectionHeader('The Algro Buyer', CORE_ORANGE, '05'),
  spacer(100),
  p('Five buyer types account for nearly all of the company’s award and renewal activity. They differ in how they discover suppliers, how fast they move through procurement, and what keeps them — but they share one trait that defines the strategy: each is reached and kept through documentation velocity, AI-search visibility, and sales memory rather than broad consumer marketing. The cards below profile each buyer, and Figure 5.0 places them by account volume and lifetime value.'),
  spacer(160),

  personaCard('1 — The Retail Private-Label Brand Manager', CORE_BLUE, [
    ['Profile', 'Owns one or more rice or grain SKUs in a chain private-label line on a 12 to 24-month award cycle — Costco Kirkland, Walmart Great Value, Kroger Simple Truth, Target Good & Gather, Whole Foods 365, Sprouts, Trader Joe’s, Aldi, Wegmans.'],
    ['Pain Points', 'RFP cycle speed; FSMA readiness; kosher, halal, and organic chain of custody; packaging-design partnership; sustainability and Sedex / SMETA scorecard volume.'],
    ['Decision Driver', 'A complete, in-format response in days, audit-ready documentation, and a supplier the buying team’s legal and quality reviewers do not have to chase.'],
    ['AI Opportunity', 'AI RFP auto-drafting against the indexed FSVP / COA / certification library; FSMA-204 readiness narrative; AI-cited authority on organic and specialty queries.'],
    ['Technijian Hook', 'My Dev — the buyer-documentation engine. My SEO — AI-search authority. My AI Lead Gen — named-account intelligence.'],
  ]),
  spacer(160),

  personaCard('2 — The Industrial / CPG Procurement Buyer', CORE_ORANGE, [
    ['Profile', 'Buys rice as an ingredient into a downstream branded SKU — Conagra, Nestlé, Kraft Heinz, General Mills, Amy’s Kitchen, Saffron Road, Tattooed Chef, Maya Kaimal, regional frozen-meal co-packers.'],
    ['Pain Points', 'Spec consistency by lot, on-time delivery to a manufacturing schedule, capacity flex on seasonal launches, recipe-development collaboration, tariff-driven cost shifts on imported ingredients.'],
    ['Decision Driver', 'Lot-level COA delivery, tight ingredient spec, capacity reliability, and a supplier who can sit in a development room and iterate on a recipe.'],
    ['AI Opportunity', 'Per-SKU spec automation; lot-level COA generation; the tariff signal monitor that protects ingredient cost; sales-pipeline memory across development conversations.'],
    ['Technijian Hook', 'My Dev — per-SKU automation. My AI — the tariff signal and the sales memory.'],
  ]),
  spacer(160),

  personaCard('3 — The Foodservice / Distributor Category Buyer', TEAL, [
    ['Profile', 'On the distribution side: Sysco, US Foods, Performance Food Group, UNFI, KeHE. On the operator side: Chipotle, Cava, Sweetgreen, Halal Guys, Cheesecake Factory, Texas Roadhouse, Olive Garden, Yum, Panera, P.F. Chang’s.'],
    ['Pain Points', 'Per-SKU spec sheets in GS1 / GDSN format; price-hold reliability through tariff swings; fast hold and recall coordination; a single point of contact who answers same-day.'],
    ['Decision Driver', 'Operational responsiveness, standardized documentation, and the ability to absorb a category buyer’s spec change without missing a delivery window.'],
    ['AI Opportunity', 'GS1 / GDSN spec automation; the tariff-resilient price-hold proposal engine; a 24/7 conversational layer for buyer questions on capability, MOQ, lead time.'],
    ['Technijian Hook', 'My Dev — the conversational layer and spec automation. My AI — the tariff and signal engine.'],
  ]),
  spacer(160),

  personaCard('4 — The Specialty / Ethnic / Mission-Driven Brand Owner', GOLD, [
    ['Profile', 'A growing CPG or restaurant brand that needs organic + halal + kosher + Indian + Thai together, with a willingness to co-develop — Saffron Road, Maya Kaimal, Tasty Bite, Stonefire, Kitchens of India, and the up-and-comers.'],
    ['Pain Points', 'Finding a co-pack partner who can do the multi-origin, multi-cert build with minimum-order flexibility and a real interest in recipe iteration and brand storytelling.'],
    ['Decision Driver', 'Cultural fit, recipe-development collaboration, and a partner who will help build the brand rather than fulfill a commodity SKU.'],
    ['AI Opportunity', 'Category authority content that draws these brands in; the conversational layer that answers capability questions instantly; sales-pipeline memory that turns every prior conversation into a productive next one.'],
    ['Technijian Hook', 'My SEO — category authority. My Dev — the conversational and memory layer.'],
  ]),
  spacer(160),

  personaCard('5 — The Institutional / Channel Buyer (Emerging)', DARK_CHARCOAL, [
    ['Profile', 'K-12 nutrition contractors, federal commodities, military commissaries, healthcare and corrections contract foodservice (Sodexo, Aramark, Compass). Confirm in discovery whether currently in scope.'],
    ['Pain Points', 'USDA and Buy-American compliance documentation, multi-year contract paperwork volume, audit posture, transparent traceability of origin.'],
    ['Decision Driver', 'Paperwork completeness and a multi-year reliability record; AI is a documentation aid, not a sales channel.'],
    ['AI Opportunity', 'The documentation engine again; multi-year contract intelligence; FSMA-204-ready traceability narrative.'],
    ['Technijian Hook', 'My Dev — the documentation engine.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each buyer by account volume and account lifetime value — showing why the retail private-label award is the highest-LTV target, why industrial CPG is the highest-velocity opportunity, and why foodservice is the volume-driven cash flow that makes the entire program self-sustaining.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Algro Buyer Matrix', 560, 1.50),
  diagramCaption('Figure 5.0 — The Algro Buyer: Account Volume vs. Account Lifetime Value'),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  spacer(100),
  p('Algro competes for the same retail private-label, foodservice, and industrial-CPG awards against a defined set of operators: the publicly-listed giants — LT Foods (Daawat and Royal Basmati), KRBL (India Gate), Olam Agri, Riviana Foods (Ebro Foods, including Mahatma, Carolina, Success, and Minute Rice), Tilda (also Ebro), Kohinoor — and a tier of mid-market premium-basmati names — Amira Nature Foods, Authentic Royal / Authentic Foods Group, Shri Lal Mahal, Chaman Lal Setia, Veer Overseas. The pattern across all of them is the same opportunity: the operators that out-compete Algro at scale uniformly do it on scale and brand strength, not on AI-enabled buyer experience. The product, the certifications, and the parent-company milling base are competitive; what is not is the AI-search visibility and the buyer-documentation velocity that decide which supplier responds first to the next big RFP.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.6 },
      { label: 'Position', weight: 2.6 },
      { label: 'Scale', weight: 1.0, align: AlignmentType.CENTER },
      { label: 'AI / Buyer-Experience Posture', weight: 3.4 },
    ],
    [
      ['LT Foods (Daawat / Royal)', 'NSE-listed parent of Royal Basmati and Daawat; a category leader in US private-label basmati', { text: 'High', align: AlignmentType.CENTER }, 'Modern retail-brand sites and category leadership; not yet visibly AI-buyer-experience'],
      ['KRBL (India Gate)', 'World’s largest basmati miller with the India Gate retail brand', { text: 'High', align: AlignmentType.CENTER }, 'Brand-strong but a traditional B2B sales motion'],
      ['Olam Agri', 'Multinational agri-commodity supplier with sophisticated supply-chain technology', { text: 'High', align: AlignmentType.CENTER }, 'Most data-led of the cohort; enterprise-priced and slow to re-platform on AI-buyer-experience'],
      ['Riviana Foods (Ebro)', 'US-domestic category dominator (Mahatma, Carolina, Success, Minute) plus private-label', { text: 'High', align: AlignmentType.CENTER }, 'Retail-brand strong; B2B digital posture mid-tier'],
      ['Tilda (Ebro)', 'UK-rooted premium basmati with growing US footprint', { text: 'Mid–High', align: AlignmentType.CENTER }, 'Brand-led; not the AI-buyer-experience benchmark'],
      ['Amira Nature Foods', 'Premium-branded basmati with private-label footprint claims across 60+ countries', { text: 'Mid', align: AlignmentType.CENTER }, 'Historically branded-led; quiet on AI'],
      ['Kohinoor Foods', 'Premium Indian basmati to US retail and private label (Adani / McCormick relationships)', { text: 'Mid', align: AlignmentType.CENTER }, 'Brand-led; traditional B2B'],
      ['Authentic Royal / Authentic Foods Group', 'Mid-market US private-label and branded basmati', { text: 'Mid', align: AlignmentType.CENTER }, 'Mid-tier digital and AI posture'],
      [{ text: 'Algro International (today)', bold: true }, { text: 'US arm of Bharat Industrial (1969); specialty, organic, IQF', bold: true }, { text: 'Independent', align: AlignmentType.CENTER, bold: true }, { text: 'Low — clean site, modest LinkedIn, no AI-buyer-experience layer', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(200),
  subHeader('Scale & AI Buyer-Experience Scorecard'),
  p('Reduced to the two things that decide whether a procurement researcher finds, trusts, and awards — how much operator scale stands behind the supplier, and how mature its AI-buyer-experience and AI-search posture is — the picture is clear, and it shows Algro holding a credible specialty product while ceding the digital ground entirely.'),
  buildTable(
    [
      { label: 'Player', weight: 2.8 },
      { label: 'Operator Scale', weight: 2.2, align: AlignmentType.CENTER },
      { label: 'AI / Buyer-Experience', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.6 },
    ],
    [
      ['Olam Agri', { text: 'Very High', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'Most digital-mature of the cohort'],
      ['LT Foods / KRBL', { text: 'Very High', align: AlignmentType.CENTER }, { text: 'Medium–High', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Category-leading scale; traditional B2B'],
      ['Riviana / Tilda (Ebro)', { text: 'High', align: AlignmentType.CENTER }, { text: 'Medium', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Brand-strong, digital-mid'],
      ['Amira / Kohinoor / Authentic Royal', { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Low–Medium', color: CRITICAL, align: AlignmentType.CENTER }, 'Mid-market, modest digital'],
      [{ text: 'Algro International (today)', bold: true }, { text: 'Independent', align: AlignmentType.CENTER, bold: true }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER, bold: true }, { text: 'Credible product, manual buyer engine', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 6.0 plots the field on those two axes. Algro sits in the bottom-left — independent scale, near-zero AI-buyer-experience automation. The move is straight up: keep the right-sized, multi-origin, specialty position and add the institutional-grade AI buyer-experience the giants are uniformly behind on, landing in a corner no competitor in the category currently holds.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. AI & Buyer-Experience Maturity', 560, 1.50),
  diagramCaption('Figure 6.0 — Competitive Positioning: Operator Scale vs. AI & Buyer-Experience Maturity'),
  spacer(160),
  calloutBox(
    'Where Algro Wins — The White Space',
    [
      'The top-left corner — an independent, right-sized specialty supplier running institutional-grade AI buyer-experience — is empty. The category’s giants have the scale but not the AI-buyer-experience; the mid-market players have neither.',
      'There is an honest opening even against the giants: scale does not mean responsive. A multi-billion-dollar miller takes longer to respond to a buyer audit, a tariff swing, or an FSMA-readiness question than a thirteen-person Irvine team running an AI documentation engine.',
      'Algro already has the product, the certifications, and the parent-company milling base. Adding the AI buyer-experience layer puts it in a position none of its direct rivals occupy — and the same engine carries over to the Simply So consumer brand and the BIEL parent export markets.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For a US importer fronting a 57-year-old Indian milling base across three certified product lines and three North American facilities, the digital footprint materially under-represents the business — and it matters precisely when a procurement researcher’s first move is a search, an AI question, and a quick scan of the supplier’s public presence before they ever ask a sample. The product range is real; the buyer-facing surface that signals it is light.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.4 },
      { label: 'Gap / Opportunity', weight: 4 },
    ],
    [
      ['algrointernational.com', 'Clean product catalogue and contact form; some sub-pages return 404; no buyer self-service or thought leadership', 'Buyer-side conversational layer; a category-authority resource library on tariffs, FSMA 204, multi-origin compliance; case studies if relationships allow'],
      ['Certification documentation', 'Quality and CCOF NOP organic stamps on the home page; no public buyer-side documentation portal', 'A buyer-credentialing portal where invited procurement contacts pull current certifications, COAs, and SDS without an email round-trip'],
      ['LinkedIn presence', 'About 1,018 followers (small for the category); no visible publishing cadence', 'A regular cadence on tariffs, FSMA, organic supply, and multi-origin compliance — signed off by Deepak and Sinem, drafted by the content engine'],
      ['Parent (bielfood.com)', 'A late-2010s static site under-using the 1969 / 54-country / BRC story', 'A US-market translation of the parent authority into category-leading content the US sales team can attach to RFP responses'],
      ['AI-search visibility', 'Below the citation surface on procurement queries (organic basmati private-label, USDA NOP IQF rice California, FSMA-204 rice importer)', 'Multi-Agent SEO + AEO targeting the exact procurement queries — the Technijian-built capability sits here'],
      ['Buyer documentation operations', 'Best understood as a small team plus shared drives plus email; no indexed library, no auto-draft of buyer responses', 'The buyer-documentation engine: index every certificate, every plan, every prior RFP response; auto-draft new responses in the buyer’s format'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the supply chain or the certifications — only making a credible specialty importer visible to the buyer it is already qualified to serve.',
      'AI-search visibility, the conversational buyer-side layer, the documentation engine, and the renewed LinkedIn cadence are compounding moves: each lifts the share of qualified RFPs Algro receives and the share it converts.',
      'They are also the natural first ninety days — get cited, capture the inbound, and stand the documentation engine up — before any large build, so the entry phase pays back fast.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE SILENT MARGIN LEAK ----------
docChildren.push(
  ...sectionHeader('The Silent Margin Leak — Where Revenue Walks Out', DARK_CHARCOAL, '08'),
  spacer(100),
  p('This section names the cost that does not appear on any report, because it is the one most expensive to ignore. A US arm with three facilities, organic certification, and a 1969 Indian milling base behind it should be holding more of its category than a small team can currently service with manual documentation operations. The revenue lost to slow RFP turnaround, tariff-driven margin compression that nobody hedged, and buyer renewals lost to faster responders is not a rounding error — it is a silent margin leak that never shows up as a line item, only as RFPs that did not return, accounts that did not renew, and audits that took weeks instead of days.'),
  spacer(140),
  subHeader('The RFPs That Got Skipped Because There Was No Bandwidth'),
  p('A small US sales and quality team can sustain a finite number of full RFP responses in a quarter — particularly when each response is a hundred-plus questions assembled by hand from a shared drive of FSVP plans, lot COAs, certificates, and prior responses. The result is a quiet triage: the easy ones get answered fast, the complicated ones get deferred, and a meaningful share of qualified opportunities never get a full response at all. Every skipped RFP is an award that went to a competitor with more bandwidth, not more product. AI-drafted responses against an indexed certification library turn that bandwidth ceiling into a non-issue — without changing the team.'),
  spacer(60),
  p('The math is unforgiving in the right direction: when each fully-answered RFP carries a real chance to win a multi-year, multi-million-dollar private-label or foodservice award, even a handful of additional RFP completions a year — at the same win rate — adds up quickly. Documentation velocity is not a soft metric here; it is awards on the table that are currently being left there.'),
  spacer(120),
  subHeader('The Tariff Margin That Nobody Hedged'),
  p('The 2025 swing on Indian basmati — 10 percent to 50 percent to a settled 18 percent inside one year — moved cost of goods by hundreds of basis points on the most important product category, with Thai and Pakistani origin sitting near 19 percent. A supplier that watched the signal early and proposed an origin-mix update to buyers ahead of contract review protected margin; a supplier that did not absorbed the swing or, worse, lost a buyer when a faster competitor came in with a re-priced proposal first. The tariff signal is not going away — and AI that watches USITC postings, India and Thailand commerce-ministry filings, freight indices, and FX, and proactively reformulates the cost model and origin-mix per buyer, is the cheapest possible insurance.'),
  spacer(120),
  subHeader('The Renewals That Went Quiet'),
  p('The most expensive vacancy in this business is the account that does not formally cancel — it simply stops returning the next RFP, and the next, and the next. The reasons are usually small and avoidable: a buyer audit that took three rounds instead of one; a certification document that was hard to find when the procurement team’s quality reviewer asked; a tariff-driven cost shift that arrived as a surprise instead of a proactive proposal. None of those are product failures; all of them are documentation, communication, and signal failures — and all of them drive the avoidable churn that AI-enabled account-renewal intelligence and sales-pipeline memory protect against.'),
  spacer(120),
  calloutBox(
    'Three Leaks, One Engine',
    [
      'RFPs skipped because the documentation tax is too heavy; tariff swings that compress margin because no signal was watched; and accounts that quietly stop returning the next RFP. None is a product failure — each is a documentation, signal, or memory failure.',
      'These are exactly the failures the AI growth engine closes: auto-drafted RFP responses against an indexed library, a tariff signal monitor that proposes origin-mix updates per buyer, and a sales-pipeline memory that watches every account’s audit cycle and renewal trigger.',
      'This is the highest-conviction place to start, because it converts RFPs and accounts the company already has into awards and renewals it is currently losing.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services Algro would engage. Each is labeled for what it is, and each maps to a specific Algro use case. Technijian has not built an AI buyer-documentation engine for a food importer before; what it has built is the conversational, document, and search AI a buyer-documentation engine is made of — and that is the honest claim.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex documents for FINRA-registered broker-dealers, cutting response time from days to minutes with 60 to 80 percent less manual review.',
    'Pointed at Algro’s documentation load, the same approach drafts RFP and RFI responses in the buyer’s exact format from an indexed library of FSVP plans, HARPC controls, lot COAs, organic and kosher and halal certificates, allergen statements, and prior buyer responses — at the same win rate, against more RFPs.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70 percent.',
    'This is how Algro gets cited: AI-search authority on the procurement queries that matter — USDA NOP organic basmati private-label supplier, FSMA-204 readiness for imported rice, multi-origin organic chain of custody — so that ChatGPT, Perplexity, and Google AI surface Algro as a credible answer.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a conversational design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked, multi-model design is exactly what a buyer-side conversational layer needs: it answers procurement questions on capability, certification, MOQ, and lead time consistently, and can verify each response is on-spec before it is sent — the same discipline FINRA and food-safety documentation require.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'For a thirteen-person US team across Irvine, Jersey City, and Burnaby, this is the sales-pipeline memory — every buyer conversation, every sample shipment, every audit finding, every recipe-development discussion — searchable so a buyer who surfaces eighteen months later does not start from a cold email.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Algro Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations around a client’s actual process.',
    'This builds the working tools: the AI buyer-documentation and RFP-response engine, the multi-origin traceability layer, the tariff signal monitor, the buyer-side conversational layer, and the per-SKU spec automation — owned by Algro, not locked inside a third-party platform.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO — AI-Search Authority & Reputation',
    'My SEO is Technijian’s search service: local search optimization, reputation management, and answer-engine visibility so a business is found and trusted where its buyers actually look.',
    'For Algro it owns the AI-search citations on procurement queries, drafts the under-covered category authority content on tariffs, FSMA, and multi-origin compliance, and lifts the LinkedIn cadence that signals seriousness to retail and foodservice category buyers.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Named-Account ABM',
    'My AI Lead Gen is Technijian’s productized account-based service — it tracks named accounts, watches buyer-side triggers, and produces account dossiers and personalised outreach rather than a broad funnel.',
    'For Algro it is the named-account intelligence engine: track Costco PL, Sysco category buyers, Cava procurement, Saffron Road sourcing, and the rest of the named universe; watch for triggers (new PL launches, category buyer changes, recall events at competitors, FSVP-supplier-change postings); and deliver pre-meeting dossiers the sales team can act on.',
    'service'
  ),
);

// ---------- 10 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Algro’s Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get cited and discovered (own AI-search authority on procurement queries and the under-covered tariff, FSMA, and multi-origin compliance conversation), win the documentation race (auto-draft RFP responses, index the certification library, run multi-origin traceability, watch the tariff signal), and hold the account and expand (sales-pipeline memory, per-SKU automation, account-renewal intelligence, and reuse of the same engine for Simply So and BIEL exports). The first fills the top of the named-account funnel, the second is the documentation core, and the third protects and scales the order book.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Algro AI Growth Engine', 600, 1.607),
  diagramCaption('Figure 10.0 — The Engine: Get Cited & Discovered, Win the Documentation Race, and Hold & Expand'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.8 },
      { label: 'Tool', weight: 2.4 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.5 },
      { label: 'Technijian Service', weight: 1.5 },
    ],
    [
      ['Get Cited & Discovered', 'AI-search authority (AEO)', 'Be cited by Google AI, ChatGPT, Perplexity on procurement queries', 'AI-citation rate', 'My SEO'],
      ['Get Cited & Discovered', 'Category thought leadership', 'Tariff, FSMA 204, NOP multi-origin — the under-covered topics', 'Content authority', 'My SEO'],
      ['Get Cited & Discovered', 'Named-account ABM intelligence', 'Track retail PL, foodservice, industrial CPG named accounts', 'Pipeline coverage', 'My AI Lead Gen'],
      ['Get Cited & Discovered', 'Buyer-side conversational layer', 'On-site bot answers capabilities, certifications, MOQ in seconds', 'Inquiry response', 'My Dev'],
      ['Win the Doc Race', 'AI RFP / RFI auto-drafting', 'Draft responses in the buyer’s exact format in minutes, not weeks', 'RFP turnaround', 'My Dev'],
      ['Win the Doc Race', 'FSVP / HARPC / COA library', 'Indexed certifications, lot COAs, kosher, halal, NOP, GFSI', 'Document coverage', 'My AI'],
      ['Win the Doc Race', 'Multi-origin traceability', 'Lot chain of custody across India, Thailand, US — FSMA-204-ready', 'Audit response time', 'My Dev'],
      ['Win the Doc Race', 'Tariff & trade signal monitor', 'Watch USITC, FX, freight; propose origin-mix updates per buyer', 'Margin protected', 'My AI'],
      ['Hold & Expand', 'Sales-pipeline memory', 'Every conversation, sample, audit, recipe iteration — searchable', 'Retrieval depth', 'My Dev'],
      ['Hold & Expand', 'Per-SKU spec automation', 'Auto-generate spec sheets, allergen statements, packaging copy', 'Spec turnaround', 'My AI'],
      ['Hold & Expand', 'Account-renewal intelligence', 'Watch volume drift, price-hold expirations, audit cycles', 'Renewal rate', 'My AI'],
      ['Hold & Expand', 'Portfolio reuse (Simply So + BIEL)', 'Same engine for consumer brand + parent export markets', 'Communities live', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI auto-drafts, indexes, monitors, and remembers — with sources cited and inside the documentation rules each buyer audit applies. It gives every RFP, every audit, and every buyer conversation the same complete, in-format answer.',
      'AI never makes the GFSI or food-safety determination, never approves a lot release, and never sets pricing in any antitrust-sensitive arrangement. A person owns the safety decision, the lot release, and the pricing — outside the regulatory and antitrust risk entirely.',
      'The US sales and quality team is freed, not replaced: the AI handles the documentation tax, the signal monitoring, and the memory; the team spends its time on relationships, sampling, and the buyer conversations that close awards.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on the highest near-term levers — AI-search authority, named-account intelligence, and a strategy workshop — and expands into the buyer-documentation engine, the traceability layer, and the tariff signal monitor only as the results prove out. The model below is built from public information and conservative assumptions, because Algro’s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 14 replace them with real baselines.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3.2 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['AI-search citation on procurement queries', 'Below the citation surface', 'Cited by Google AI, ChatGPT, Perplexity', 'Discoverability'],
      ['RFP / RFI response turnaround', 'Weeks; some skipped', 'Days; bandwidth ceiling removed', 'Win rate'],
      ['Buyer audit response time', 'Manual; multi-round', 'Same-day; one-query coverage', 'Audit speed'],
      ['Documentation completeness on first pass', 'Variable by responder', 'Consistent, sourced, in-format', 'Quality'],
      ['Tariff-driven margin protection', 'Reactive', 'Proactive origin-mix proposals', 'Margin defended'],
      ['Account renewal coverage', 'Reactive', 'Triggered before re-bid window', 'Renewal rate'],
      ['Sales-team hours on documentation tax', 'Heavy, manual', 'Recovered for relationships', 'Capacity freed'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model — The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the two highest-conviction levers — additional RFP responses completed at the same win rate, and accounts protected from renewal loss — not on pricing changes, because pricing stays out of scope. The entry program alone (AI-search authority, named-account intelligence, and the strategy workshop) drives the lift below; the expansion build adds the buyer-documentation engine and the tariff signal that push both levers further.', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Conservative', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.1, align: AlignmentType.CENTER },
    ],
    [
      ['Additional RFP responses completed / year', { text: '+4', align: AlignmentType.CENTER }, { text: '+8', align: AlignmentType.CENTER }, { text: '+12', align: AlignmentType.CENTER }],
      ['Implied wins at ~15% category baseline win-rate', { text: '~1', align: AlignmentType.CENTER }, { text: '~1.5', align: AlignmentType.CENTER }, { text: '~2', align: AlignmentType.CENTER }],
      ['Avg first-year revenue per won account (illustrative)', { text: '$40K', align: AlignmentType.CENTER }, { text: '$60K', align: AlignmentType.CENTER }, { text: '$80K', align: AlignmentType.CENTER }],
      ['Added revenue from faster RFP response', { text: '+$40K', align: AlignmentType.CENTER }, { text: '+$90K', align: AlignmentType.CENTER }, { text: '+$160K', align: AlignmentType.CENTER }],
      ['Accounts protected from renewal loss', { text: '+1', align: AlignmentType.CENTER }, { text: '+2', align: AlignmentType.CENTER }, { text: '+3', align: AlignmentType.CENTER }],
      ['Renewal value protected (avg $30–50K)', { text: '+$30K', align: AlignmentType.CENTER }, { text: '+$80K', align: AlignmentType.CENTER }, { text: '+$150K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 Value (entry)', bold: true }, { text: '+$70K', bold: true, align: AlignmentType.CENTER }, { text: '+$170K', bold: true, align: AlignmentType.CENTER }, { text: '+$310K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '~2.2x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~5.3x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~9.7x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only — the easiest possible place to start. It does not count the larger gains the expansion build adds (the buyer-documentation engine, the traceability layer, the tariff signal monitor), the AI-search authority that compounds month over month, the sales-team hours recovered from the documentation tax, or the reuse of the engine for the Simply So consumer brand and the BIEL parent export. Average first-year revenue per won account is illustrative and is replaced with Algro’s actual book in discovery. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Service Investment Map — Start Small, Expand as It Proves Out'),
  buildTable(
    [
      { label: 'Service', weight: 3.0 },
      { label: 'Scope', weight: 3.4 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My AI — AI Readiness + Executive Workshop (one-time)', 'A half-day session with Deepak, Sinem, and the sales lead — AI buyer-experience roadmap, FSMA-204 readiness, and tariff-signal monitoring kickoff', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — AI-Search Authority + Reputation', 'Own AI-search citations on procurement queries; the LinkedIn cadence on tariffs, FSMA, and multi-origin compliance', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account ABM (Starter)', 'Track named accounts; trigger monitoring; per-account dossiers across retail PL, foodservice, and industrial CPG', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,250/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — AI Buyer-Documentation Engine + Traceability + Tariff Monitor (Phase 2 build)', 'The custom build — RFP / RFI auto-drafting, FSVP / HARPC / COA / cert library, multi-origin chain of custody, tariff signal monitor, buyer-side conversational layer', { text: '—', align: AlignmentType.CENTER }, { text: '$48,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, and iteration of the buyer-documentation engine', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, food-safety / FSMA / tariff governance, model performance review', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $5,050/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$113,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $32,000 entry program — AI-search authority, named-account ABM intelligence, and the strategy workshop — that pays for itself on faster RFP responses and renewal protection, with no large build to begin.',
      'Expand into the full engine (the buyer-documentation and traceability build, the tariff signal monitor, the fractional AI advisor) only once the entry proves the lift. That one-time build is then a portfolio platform.',
      'Phase 3 is reuse: the same engine carries Simply So consumer-brand demand-gen and the BIEL parent’s 54-country export markets — without re-paying the build. Treat as upside, not Year-1 ask.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan: start with the low-commitment entry — get cited and capture the named-account inbound — then add the buyer-documentation engine and the traceability layer, then hold and expand. Real gains — AI-search citations, named-account dossiers, an indexed certification library — are visible inside the first ninety days, before the larger build; the deeper engine and the portfolio reuse are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Algro 90-180-270 Day Roadmap', 600, 2.296),
  diagramCaption('Figure 12.0 — The Algro Growth Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Get Cited & Capture (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — get cited on procurement queries and capture the named-account universe, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — AEO + Thought Leadership', 'Launch Multi-Agent SEO + AEO targeting the procurement queries that matter (USDA NOP organic basmati private-label supplier; FSMA-204-ready rice importer; multi-origin organic chain of custody). Draft the under-covered category authority content on tariffs and FSMA. Lift the LinkedIn cadence with Deepak and Sinem.'],
      ['1.2 — Named-Account ABM', 'Stand up the named-account list across retail PL, foodservice, and industrial CPG. Begin trigger monitoring (new private-label launches, category-buyer changes, recall events at competitors, FSVP supplier changes). Deliver pre-meeting account dossiers to the sales team — the entry program’s fast win, with no custom build required.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Build the Documentation Engine (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — add the buyer-documentation engine, the traceability layer, and the tariff signal monitor.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Buyer-Documentation & RFP-Response Engine', 'Index FSVP plans, HARPC / preventive-control plans, lot COAs, NOP / kosher / halal certificates, allergen statements, packaging specs, and prior RFP responses. Stand up AI auto-drafting in the buyer’s exact format. Add the buyer-side conversational layer on algrointernational.com.'],
      ['2.2 — Multi-Origin Traceability + Tariff Signal Monitor', 'Stand up the digital chain of custody (input certificate to lot to product to buyer COA) across India, Thailand, and US-domestic supply. Wire the tariff & trade signal monitor (USITC, India and Thailand commerce filings, freight, FX) into per-buyer cost-model proposals.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Hold & Expand (Days 181–270)', { color: CORE_ORANGE }),
  p('Add the sales memory and account-renewal intelligence, then begin reusing the engine across Simply So and the BIEL parent export markets.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Sales-Pipeline Memory + Renewal Intelligence', 'Index every buyer conversation, sample shipment, audit finding, and recipe-development discussion in the Weaviate + Obsidian memory layer. Add account-renewal intelligence — volume drift, price-hold expirations, audit-cycle triggers — and a per-account dashboard.'],
      ['3.2 — Portfolio Reuse Kickoff', 'Begin the reuse track: the same AEO authority and conversational layer for the Simply So consumer brand; the same documentation engine extended to support the BIEL parent’s 54-country export documentation. Deliver an ROI dashboard measured against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions Algro can take immediately — before any new Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Test AI-Search Visibility for Procurement Queries',
    ['Type the queries a real procurement researcher would type into ChatGPT, Perplexity, and Google AI: “USDA NOP certified organic basmati private-label supplier,” “FSMA-204-ready rice importer,” “USDA NOP IQF rice co-packer in California.” See whether Algro is cited; capture a screenshot baseline. It costs nothing and immediately sizes the AEO opportunity.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Publish One Tariff or FSMA Post on LinkedIn This Week',
    ['Have Deepak or Sinem publish a short, factual LinkedIn post on the 2025 tariff swing (10 percent → 50 percent → 18 percent) or the FSMA 204 extension to July 2028 and what it means for retail and foodservice supplier agreements. The category is uncovered; one post earns more inbound from procurement researchers than most paid campaigns.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Inventory the Documentation Library in One Folder',
    ['Pull every FSVP plan, HARPC document, lot COA, organic certificate, kosher / halal letter, allergen statement, prior RFP response, and packaging spec into a single shared drive with a clean folder structure. This is the corpus the AI documentation engine will index — and it makes the next buyer audit faster on its own.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Pick the Top 25 Named Accounts to Track First',
    ['Choose the twenty-five named accounts — across retail PL, foodservice, and industrial CPG — that matter most for the next twelve months. Note award cycle, current relationship temperature, and the named buyer if known. This is the seed list the named-account ABM intelligence will track from day one.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Fix the 404s on algrointernational.com',
    ['The /about, /products, and /contact sub-routes return 404 (verified). Fix the broken links and add one short paragraph each on the company, the parent BIEL milling base since 1969, and how to reach the right person at each US facility. It costs an afternoon and lifts every other piece of inbound discovery work.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with Algro’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Named-account roster', 'Which retail PL / foodservice / industrial CPG buyers are live, in-flight, or top-of-pipe', 'Calibrates the ROI math and seeds the ABM target list'],
      ['Average won-account value', 'Average first-year revenue per won account by persona', 'Replaces the $40K / $60K / $80K illustrative range'],
      ['RFP / RFI volume and win rate', 'RFPs per quarter, current response time, recent win rate', 'Sizes the documentation-velocity lever directly'],
      ['Documentation operations', 'How FSVP, HARPC, COA, and certificate library are kept today', 'Defines the build and integration surface'],
      ['Certifications at the US facility', 'GFSI (BRC / SQF / FSSC 22000), kosher (OU / OK / Star-K), halal (IFANCA / ISA)', 'Confirms what is buyer-ready vs. on the roadmap'],
      ['Current sales engine', 'CRM in use (HubSpot / Salesforce / Pipedrive / other), sales-team size, trade-show calendar', 'Defines the workflow and the data-handoff'],
      ['Tariff-exposure book', 'Recent cost shift from the 2025 Indian rice tariff swings; in-flight buyer renegotiations', 'Sizes the tariff signal monitor opportunity'],
      ['FSMA 204 posture', 'Which SKUs (IQF veg in particular) are on the FDA Food Traceability List; retailer pre-flight requirements', 'Confirms which traceability work is mandatory vs. preferred'],
      ['Simply So priority', 'Whether the consumer brand is a Year-1 ask or a Phase-3 reuse', 'Decides whether the engine includes a D2C track'],
      ['GDAP / M365', 'Whether Technijian can be granted GDAP for the M365 tenant', 'Lets the AI engine index the documentation library directly'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 entry proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Algro’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('Algro already has the hard things: the parent-company milling base since 1969, the US-arm specialty product line, the USDA NOP organic certification, three certified North American facilities, and an existing Technijian managed-services and cybersecurity relationship. What it has not yet done is add the AI buyer-experience layer that decides which supplier responds to the next big RFP in days instead of weeks — and that is where this program starts.'),
  p('The opportunity is concrete: get cited and discovered as the supplier procurement finds first, win the buyer documentation race by auto-drafting responses against an indexed library in the buyer’s exact format, and hold the account and expand by watching renewal triggers proactively and reusing the same engine across Simply So and the BIEL parent export. A focused, account-based program does all three — and it stays inside the food-safety, antitrust, and pricing boundaries that decide which AI is even safe to deploy in this category.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — AEO authority, named-account ABM intelligence, and the strategy workshop — live inside 30 days of signature, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to respond to the next RFP in days, not weeks?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
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
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help right-sized operators compete at scale — with security and compliance built in, not bolted on. Algro is an existing Technijian managed-services and cybersecurity client; this blueprint is the expansion into the AI buyer-experience layer.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Algro', weight: 5 }],
    [
      ['My Dev', 'Custom AI-native builds — the buyer-documentation and RFP-response engine, multi-origin traceability layer, tariff signal monitor, and the buyer-side conversational layer, owned by Algro'],
      ['My SEO', 'AI-search authority (AEO), reputation management, and the under-covered tariff / FSMA / multi-origin compliance category content'],
      ['My AI Lead Gen', 'Named-account ABM intelligence — track retail PL, foodservice, and industrial CPG buyers; trigger monitoring; account dossiers'],
      ['My AI', 'AI strategy and builds — fractional AI advisor, model performance review, and program leadership with food-safety and antitrust governance throughout'],
      ['My Security', 'Existing engagement (Huntress + CrowdStrike + Client Portal); extends to applicant and buyer-PII governance behind every AI workflow'],
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
  p('Market and category intelligence gathered via public web research conducted May 2026. Company details (founding, locations, product lines, certifications, and leadership) are drawn from public sources and Algro’s own website and should be confirmed with Algro before external use.', { italics: true }),
  spacer(120),
  p('1. Algro International — algrointernational.com (home, what-we-offer/specialty-rice-and-grains, what-we-offer/ready-to-serve-rice-grains, what-we-offer/organic-rice). Specialty, organic, ready-to-serve, instant, and IQF lines.', { size: 20 }),
  p('2. Simply So Foods — simplysofoods.com (home, our-products). Organic basmati, jasmine, brown, cilantro lime, turmati basmati with cumin, Thai medley — the Algro / Deepak Bansal consumer brand.', { size: 20 }),
  p('3. Parent company — Bharat Industrial Enterprises Ltd / BIEL (bielfood.com); founded 1969; Karnal / Taraori, Haryana, India; milling capacity publicly cited at 12 metric tonnes per hour at the factory and at higher figures across trade-show / import-export directory listings; ISO 22000, GMP, HACCP, BRC; exports to more than 54 countries; Gulfood 2025 exhibitor.', { size: 20 }),
  p('4. Certifications — CCOF / USDA NOP organic processor-handler certificate for Algro International LLC (client code PR2333; original issue 2020-04-29; US/Canada Equivalence 2023-07-28). Certified products include Arborio, Basmati, Jasmine, Long Grain Brown, Long Grain White, Prepared, Wild rice and IQF Vegetables. CCOF point of contact: Sinem Eren, Manager Food Safety & Quality Assurance.', { size: 20 }),
  p('5. Competitors — LT Foods (Daawat / Royal), KRBL (India Gate), Olam Agri, Riviana Foods (Ebro Foods — Mahatma, Carolina, Success, Minute), Tilda (Ebro), Kohinoor Foods, Amira Nature Foods, Authentic Royal / Authentic Foods Group, Shri Lal Mahal, Chaman Lal Setia, Veer Overseas, Patanjali Rice. Indirect: Riceland Foods, American Commodity Co, Producers Rice Mill.', { size: 20 }),
  p('6. Tariff and trade — 2025 US tariffs on Indian basmati: 10 percent base → 50 percent escalation → 18 percent settled following the India–US trade deal in early 2026. Sources: Indian Rice Exporters Federation commentary; Open the Magazine; Rice News Today; Indian News Network; StratNews Global. India Apr–Nov 2025 basmati exports to the US: ~199,558 tonnes / ~Rs 1,749.17 crore.', { size: 20 }),
  p('7. Regulation — FDA FSMA Section 204 Food Traceability Rule (original compliance 2026-01-20; proposed 30-month extension Aug 2025; codified by Continuing Appropriations Act Nov 2025 — no enforcement before 2028-07-20). Foreign Supplier Verification Program (FSVP) and HARPC preventive controls. USDA NOP organic chain of custody. Buyer-mandated GFSI (BRC / SQF / FSSC 22000), kosher (OU / OK / Star-K), halal (IFANCA / ISA / HMA) certifications.', { size: 20 }),
  p('8. AI category context — RFP and document automation (RFPIO/Responsive.io, Loopio); food-safety / traceability (Wherefour, ReposiTrak, FoodLogiQ/Trustwell, Safefood 360, IBM Food Trust); trade-signal (Avalara Trade Tariff Console, Thomson Reuters ONESOURCE Global Trade); ABM (Apollo, 6sense, Demandbase); horizontal conversational AI (Drift, Intercom, Tidio).', { size: 20 }),
  p('9. Internal — annual-client-review vault conversation logs 2026-04-29 and 2026-05-04: existing Technijian MSP relationship (Client Portal + Huntress + CrowdStrike), 42 time entries in April 2026, primary contact Deepak Bansal.', { size: 20 }),
  p('10. Technijian service pricing — My AI Lead Gen (Starter $1,499 / Professional $3,499 / Enterprise $6,999), My AI, My SEO, My Dev, and My Security rate cards.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Algro-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
