// Andersen Industries (ANI) - AI-Driven Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/JDH/build-jdh-report.js (contract-manufacturer warm-expansion lineage).
// WARM EXPANSION: Andersen is an existing Technijian client. DUAL MOTION: contract fabrication (ABM)
// + the WeldPro 360 product line (demand-gen). Logo: AUTHENTIC assets/Technijian Logo 2.png.

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

const TODAY = '2026-06-15';

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
  return new Paragraph({ keepNext: true, spacing: { before: size, after: 0 }, children: [new TextRun('')] });
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

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    pageBreakBefore: true,
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 38, bold: true, color, font: FONT_HEAD })] }),
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Andersen: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ANDERSEN INDUSTRIES', size: 54, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contract Metal Fabrication Since 1966  ·  The WeldPro 360 Product Line', size: 23, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth & Integration Blueprint', size: 38, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Adelanto, California  |  andersenmp.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Andersen Industries, Inc.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: 'Since 1966', label: '~60 Years Fabricating in California', color: CORE_BLUE },
    { number: '108,000 ft²', label: 'Single-Source Fabrication Facility', color: CORE_ORANGE },
    { number: 'Two Engines', label: 'Contract Fabrication + WeldPro 360', color: TEAL },
    { number: 'Existing Client', label: 'Already Supported by Technijian', color: GOLD },
  ]),
  spacer(300),
  p('Andersen Industries has turned metal into engineered, finished product for nearly sixty years. From a 108,000-square-foot facility in Adelanto, it runs the full sequence under one roof — design and DFM, laser and turret cutting, press-brake forming and plate rolling, CNC milling and turning, MIG and TIG welding, and powder-coat finishing — for OEMs, machine-tool and specialty-equipment builders, and contractors across Southern California and the Central Valley. It also does something most job shops never attempt: it sells its own branded product line, WeldPro 360, a family of MIG welding boom arms and source-capture fume extraction sold nationally and through distributors. Two engines, one shop.'),
  p('The capability is real and the Technijian relationship is already in place. What has not yet been built is the AI operating layer that turns sixty years of fabrication skill and a manual quote process into faster quotes, more found work, and recovered shop-floor hours. A contract fabricator wins or loses on three things a hand-run shop struggles to keep up with in 2026: how fast and complete the quote is (the buyer awards the job to whoever returns a credible number first), how discoverable the shop is at the moment a sourcing engineer or a weld-cell manager goes looking (increasingly an AI-assistant question, not just a Google search), and how much of the veteran estimating and welding knowledge is captured before it walks out the door with a retiring tradesperson.'),
  p('This blueprint works on two fronts at once. The growth front (Sections 03–06 and 11) gets Andersen found and specified — cited by AI search for the fabrication and welding-product queries its buyers actually type, surfaced to a named list of target OEM accounts, and marketed properly for the WeldPro 360 line. The efficiency front (Sections 07 and 10) points AI at the manual quote funnel, the cert and inspection paperwork, and the institutional knowledge in veteran heads — so the same team quotes more work, faster, and the shop is less exposed to the skilled-labor shortage. Every piece sits inside a clear boundary: AI reads the drawing and drafts the first-pass estimate, but an Andersen estimator signs the quote; AI assembles the inspection and cert package, but a welder or QA lead signs it. AI never fabricates an inspection result or a material certification.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Andersen already owns the hard things: a 108,000-square-foot single-source plant, the full cut-form-machine-weld-finish stack, sixty years of fabrication know-how, an OEM and contractor customer base, and its own WeldPro 360 product line. What it does not yet have is the AI quote, discoverability, and knowledge-capture layer that turns those assets into speed and found revenue.',
      'Because Technijian already supports Andersen’s day-to-day IT, the build starts inside an environment we already know — not as an outside provider cold to the business. That is a head start no software company can match.',
      'The right entry is small, low-commitment, and pays back fast: AI-search authority, named-account intelligence, WeldPro product marketing, and a strategy workshop. The custom AI Quote & Spec engine comes second, once the entry proves the lift. Productizing the WeldPro engine and the cert-doc automation is the Phase-3 upside, not the Year-1 ask.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information plus Technijian’s knowledge of Andersen as an existing client. Andersen’s confidential numbers — RFQ volume, quote win rate, average job value and margin, WeldPro unit sales, current marketing spend — were not used in this draft. Every projection below is labeled estimated and conservative and calibrates to real numbers after a short discovery call. The specific questions are in Section 15.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW ANDERSEN WINS — TWO ENGINES ----------
docChildren.push(
  ...sectionHeader('How Andersen Wins — Two Engines', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for Andersen starts with how the business actually earns, and Andersen earns two different ways. The first engine is contract fabrication: a finite, named universe of OEMs, machine-tool and specialty-equipment builders, and contractors who need parts, weldments, enclosures, or assemblies built to print. A sourcing manager or a design engineer sends a drawing and a spec, and the job goes to whoever quotes first, most completely, and most credibly — then has to qualify, deliver on time, and earn the next part. The second engine is the WeldPro 360 product line: branded MIG welding boom arms and source-capture fume extraction sold to weld-cell managers, plant operations leaders, and safety managers across the country, directly and through distributors. The diagram below shows the shared win funnel, the demand that feeds both engines, and the points where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How Andersen Wins — Two Engines', 600, 1.654),
  diagramCaption('Figure 2.0 — Two engines, one funnel: get specified, quote, qualify, deliver, and hold the account'),
  spacer(120),
  subHeader('Engine One — Contract Fabrication Is Account-Based'),
  p('Contract work is not won with broad consumer marketing; it is won account by account. The buyers are a knowable set — purchasing and supply-chain managers, design and mechanical engineers, machine-tool and equipment builders, and general or electrical contractors — and the contest, every time, is the quote. A buyer with a part to place does not wait two weeks for a shop buried in other RFQs; the job goes to whoever returns a credible, complete number first. A shop that turns a drawing into an accurate quote in hours wins more work at the same margin; a shop that takes days loses it to a faster competitor, not a better one. This is why the right motion here is account-based depth and quote speed — not shotgun lead generation — and why the AI in this plan is sized for that motion.'),
  subHeader('Engine Two — WeldPro 360 Is a Product, and Products Need Demand-Gen'),
  p('WeldPro 360 is a different motion entirely. It is a national product with a clear value story — a marketed arc-time gain from keeping the welder welding instead of repositioning, plus source-capture fume extraction that speaks directly to OSHA welding-fume exposure limits. Its buyers are weld-cell and production managers and EHS or safety managers anywhere in the country, and they discover products the way buyers do: search, content, reviews, and distributor recommendation. Today every WeldPro page ends in "request more info," with no online configuration and little marketing behind it. That is a demand-generation and product-marketing opportunity sitting next to the contract shop — a second growth engine that the same AI visibility layer can light up.'),
  subHeader('The Cheapest Win Is the Re-Order and the Next Part'),
  p('Across both engines, the cheapest revenue is the customer who already trusts Andersen. Winning a new OEM account or a new WeldPro distributor costs months of qualification and trust; winning the next part on a qualified account, or the re-order from a satisfied weld shop, costs a fast, accurate re-quote and a good experience. The biggest avoidable losses in this business are the repeat job re-quoted from scratch because the prior quote lives in a spreadsheet or someone’s memory, and the job lost on quote speed alone. Retention and recall are the quiet half of the engine — and they are where sixty years of institutional memory, made searchable, pays back fastest.'),
  spacer(120),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Get found and specified: be the shop AI assistants and search name first when a sourcing engineer asks for an Inland-Empire fabricator, and when a weld-cell manager searches for a welding boom or fume extraction.',
      'Win the quote and spec race: turn drawings and RFQs into accurate first-pass estimates in hours, not days, and turn WeldPro inquiries into guided, configured quotes — with an Andersen estimator signing every one.',
      'Hold and grow: instant re-quote from sixty years of job memory, a steady stream of new reviews, and the veteran knowledge captured before it retires.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '03'),
  spacer(100),
  p('Because Andersen sells to a finite, named universe of industrial accounts on one side and a national product market on the other, the growth comes from a defined set of pools — not from a generic "more leads" funnel. The table below names them, who sits in each, and how Andersen captures it. The contract pools are won through account depth and quote speed; the WeldPro pool is won through product marketing and channel reach.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.8 },
      { label: 'The Named Universe', weight: 3.7 },
      { label: 'How Andersen Captures It', weight: 3.5 },
    ],
    [
      ['Re-source & cost-down programs at OEM accounts', 'The OEMs, specialty-equipment and machine-tool builders Andersen already serves or is qualified at — plus their peers across machinery, energy, defense, and power-generation enclosures', 'Named-account intelligence; trigger monitoring on re-source events and plant moves; AI quote speed; sixty-year job-history recall'],
      ['Reshoring & "buy domestic" sourcing', 'OEMs rebalancing offshore exposure in 2025-2026 and looking for a capable domestic single-source fabricator close to their California operations', 'AI-search authority on tariff-resilient domestic fabrication; the single-source, one-roof story; targeted outreach to re-sourcing buyers'],
      ['New-product & design-phase wins (NPI)', 'Design and mechanical engineers at OEMs who need a fabrication partner during the design phase, when the program is won early', 'Fast design-for-manufacturability feedback and quote turnaround; answer-engine discovery; capability content engineers can find'],
      ['Custom enclosures & contractor work', 'General and electrical contractors needing generator, switchgear, and control enclosures, command centers, and skids — field-ready and finished', 'Enclosure capability content; AEO on "custom equipment enclosure" queries; fast quoting on configured builds'],
      ['WeldPro 360 national product demand', 'Weld-cell and production managers and EHS / safety managers nationwide, plus distributors who stock and resell — a broad, addressable product market', 'Product marketing and demand-gen content (productivity + OSHA fume safety); an AI spec configurator; distributor-enablement; lead capture and nurture'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Motions, Matched to the Buyer',
    [
      'The contract pools are account-based: the job is to be discovered by, quote faster for, and retain a known set of OEM and contractor buyers — depth and speed, not volume. The AI is sized for that motion, not for a broad funnel.',
      'The WeldPro pool is the opposite: a national product that genuinely benefits from demand generation, content, reviews, and a guided buying experience — the one place broad reach is the right play.',
      'Every motion here is measurable — answer-engine citation rate, RFQ turnaround, jobs won, WeldPro leads and units, and review velocity — so the program is tuned to what actually moves the order book.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE ANDERSEN BUYER (PERSONAS) ----------
docChildren.push(
  ...sectionHeader('The Andersen Buyer', CORE_ORANGE, '04'),
  spacer(100),
  p('Six buyer types account for nearly all of Andersen’s activity across the two engines. Four sit on the contract-fabrication side and two on the WeldPro 360 side. They differ in how they discover Andersen, how fast they move, and what keeps them — but they share one trait that defines the strategy: each is reached and kept through quote velocity, search and answer-engine visibility, and a good buying experience rather than broad advertising. The cards below profile each buyer, and Figure 4.0 places them by annual spend and account stickiness.'),
  spacer(160),

  personaCard('1 — The OEM Purchasing / Supply-Chain Manager', CORE_BLUE, [
    ['Profile', 'Owns the fabricated-part or assembly category at an OEM or specialty-equipment manufacturer; buys on repeat POs and blanket agreements. The high-volume, highest-lifetime-value buyer.'],
    ['Pain Points', 'Suppliers that miss delivery dates; managing too many shops; single-source supply risk; pressure to re-source to a capable domestic partner; total landed cost.'],
    ['Decision Driver', 'A complete, accurate quote in days not weeks; reliable on-time delivery; a single-source partner that consolidates cut, form, machine, weld, and finish under one roof.'],
    ['AI Opportunity', 'AI quote drafting and first-pass estimating; named-account intelligence; job-history recall across the account; on-time-delivery and quality signals surfaced.'],
    ['Technijian Hook', 'My Dev — AI Quote & Spec engine. My AI Lead Gen — named-account intelligence.'],
  ]),
  spacer(160),

  personaCard('2 — The OEM Design / Mechanical Engineer', TEAL, [
    ['Profile', 'A design or project engineer specifying a part, weldment, or enclosure during the design phase; chooses the fabrication partner early, before purchasing formalizes it.'],
    ['Pain Points', 'Finding a shop that gives real design-for-manufacturability feedback; build-to-print accuracy; a credible prototype-to-production path; speed without a runaround.'],
    ['Decision Driver', 'Fast, knowledgeable DFM feedback and a quick quote; engineering depth; confidence the part scales from prototype to production.'],
    ['AI Opportunity', 'Answer-engine discovery during the supplier search; AI RFQ and drawing intelligence for fast DFM and quote turnaround; matches to similar prior jobs.'],
    ['Technijian Hook', 'My SEO — answer-engine authority. My Dev — AI RFQ / drawing intelligence.'],
  ]),
  spacer(160),

  personaCard('3 — The Machine-Tool / Specialty-Equipment Builder', GOLD, [
    ['Profile', 'A manufacturer of machines, equipment, or systems that needs complex weldments, frames, bases, guarding, chassis, or skids built right — often a recurring, program-level relationship.'],
    ['Pain Points', 'Coordinating multiple processes across several suppliers; tight tolerances; finding one shop that does fabrication, machining, welding, and finishing together.'],
    ['Decision Driver', 'Complete single-source capability under one roof; precision; the capacity and overhead-crane handling for large weldments and assemblies.'],
    ['AI Opportunity', 'Capability content that engineers find; fast multi-process quoting; job-history recall for repeat builds; named-account targeting.'],
    ['Technijian Hook', 'My SEO — capability authority. My Dev — multi-process AI quoting. My AI Lead Gen — account intelligence.'],
  ]),
  spacer(160),

  personaCard('4 — The General / Electrical Contractor', CORE_ORANGE, [
    ['Profile', 'A contractor sourcing custom generator, compressor, or switchgear enclosures, command centers, control rooms, or skids — field-ready, finished, and mountable.'],
    ['Pain Points', 'Lead time; getting a fully finished, field-ready unit; custom sizing and mounting; a shop that can handle large, configured enclosure builds.'],
    ['Decision Driver', 'Enclosure customization and finishing; foundation, skid, or trailer mounting options; reliable delivery to the jobsite.'],
    ['AI Opportunity', 'AEO on custom-enclosure queries; fast quoting on configured builds; capability content showing the enclosure portfolio.'],
    ['Technijian Hook', 'My SEO — enclosure-query authority. My Dev — fast AI quoting on configured enclosures.'],
  ]),
  spacer(160),

  personaCard('5 — The WeldPro Weld-Cell / Production Manager', CHARTREUSE, [
    ['Profile', 'Runs a welding cell or fabrication floor at a manufacturer anywhere in the country; buys capital equipment to lift throughput. The core WeldPro 360 productivity buyer.'],
    ['Pain Points', 'Dead zones and reach over large weldments; time lost repositioning work; operator fatigue; equipment that does not play with their existing Lincoln, Miller, or ESAB gear.'],
    ['Decision Driver', 'More arc-on time and reach; brand-agnostic compatibility; a clear productivity payback on the boom and fume setup.'],
    ['AI Opportunity', 'Product demand-gen content; an AI spec configurator ("which boom for my cell?"); lead capture and nurture; distributor-enablement.'],
    ['Technijian Hook', 'My SEO — WeldPro product visibility. My Dev — AI spec configurator. My AI Lead Gen — product lead nurture.'],
  ]),
  spacer(160),

  personaCard('6 — The WeldPro EHS / Safety Manager', PASS, [
    ['Profile', 'Owns worker health and OSHA compliance at a fabricator or manufacturer; a co-buyer or gatekeeper on any fume-extraction purchase.'],
    ['Pain Points', 'Hexavalent-chromium and manganese fume exposure liability; meeting OSHA permissible exposure limits; air-monitoring findings; clean air at the weld gun.'],
    ['Decision Driver', 'Source-capture fume extraction that helps meet OSHA exposure limits; documented compliance support; protecting welders.'],
    ['AI Opportunity', 'Authority content on welding-fume compliance; the safety-plus-productivity story told well online; capture into the WeldPro funnel.'],
    ['Technijian Hook', 'My SEO — welding-fume-safety authority content. My AI Lead Gen — WeldPro funnel capture.'],
  ]),
  spacer(200),

  p('Figure 4.0 maps each buyer by annual spend and account stickiness — showing why the purchasing manager is the highest-lifetime-value target, why the design engineer wins the program earliest, why the machine-tool builder anchors recurring program work, and why the WeldPro buyers add national product volume that diversifies the order book.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Andersen Buyer Matrix', 560, 1.490),
  diagramCaption('Figure 4.0 — The Andersen Buyer: Annual Spend vs. Account Stickiness / Strategic Value'),
);

// ---------- 05 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '05'),
  spacer(100),
  p('Andersen competes in two different arenas. In contract fabrication, it competes against regional sheet-metal and machining shops across the High Desert, Inland Empire, and Orange County — most of them capable but operated by hand, with thin digital presence. In the WeldPro 360 arena, it competes against established welding-equipment and fume-extraction brands. The pattern in the first arena is the opportunity: Andersen already has strong capability and capacity, while almost no regional competitor markets or operates AI-speed quoting, answer-engine authority, and a modern digital presence together. The capability is competitive; the digital and AI operating layer is the move from here.'),
  spacer(140),
  subHeader('Contract-Fabrication Competitors (Regional)'),
  buildTable(
    [
      { label: 'Competitor', weight: 2.4 },
      { label: 'Position', weight: 3.4 },
      { label: 'Cert Posture', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Digital & AI Posture', weight: 2.8 },
    ],
    [
      ['F&B Performance (Victorville)', 'Closest High-Desert rival; precision CNC machining and welding, tight tolerances, exotic alloys', { text: 'AWS', align: AlignmentType.CENTER }, 'Capable but small-part focused; thin digital presence'],
      ['Pen Manufacturing (LA / OC)', 'Contract manufacturer and direct custom-enclosure competitor since 1982', { text: 'Varies', align: AlignmentType.CENTER }, 'Modern positioning; the more digital-forward peer'],
      ['Precision Advanced Mfg (Riverside / Anaheim)', 'CNC machining, laser, waterjet, welding', { text: 'ISO + AS9100 + ITAR', align: AlignmentType.CENTER }, 'Cert-strong for aerospace/defense; legacy digital'],
      ['OC Sheet Metal (Anaheim)', 'Laser, CNC machining, forming, stamping, welding — broad process mix', { text: 'Varies', align: AlignmentType.CENTER }, 'Broad capability; older web presence'],
      ['Victor Valley Steel (Victorville)', 'Local structural-steel fabrication and welding', { text: 'AWS', align: AlignmentType.CENTER }, 'Structural niche; minimal web/AI presence'],
      ['Design SM / Brydenscot (IE)', 'Custom sheet-metal fabrication; long-tenured Inland-Empire shops', { text: 'Varies', align: AlignmentType.CENTER }, 'Dated brochure sites; little content or AEO'],
      [{ text: 'Andersen Today', bold: true }, { text: '108,000 ft² single-source plant; cut-form-machine-weld-finish under one roof; 60-year track record; AWS D1.1 / D1.2', bold: true }, { text: 'AWS', align: AlignmentType.CENTER, bold: true }, { text: 'Strong capability; recently-refreshed site; the AI layer is the move from here', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('One competitive fact is worth naming plainly: several regional rivals advertise ISO 9001, AS9100 (aerospace), or ITAR registration, while Andersen’s published certifications are weld-procedure (AWS D1.1 and D1.2). For the aerospace and defense work Andersen’s own industries page courts, a formal quality-system certification is often a gate. Section 10 shows how AI lowers the cost of getting that documentation audit-ready — turning a gap into an opening — and Section 15 lists it as a discovery item, because Andersen’s current certification status should be confirmed firsthand, not assumed from a website.', { spaceBefore: 0 }),
  spacer(140),
  subHeader('WeldPro 360 Product Competitors (National)'),
  buildTable(
    [
      { label: 'Competitor', weight: 2.4 },
      { label: 'What They Make', weight: 4.0 },
      { label: 'WeldPro’s Edge', weight: 3.6 },
    ],
    [
      ['Lincoln Electric', 'Fume-extraction arms and on-torch extraction; dominant brand and channel', 'Brand-agnostic boom + reach + productivity story, not just extraction'],
      ['Miller (FILTAIR)', 'Source-capture fume-extraction arms and booms', 'Works with the customer’s existing Miller, Lincoln, or ESAB gear'],
      ['RoboVent', 'Articulated extraction arms plus extension booms; closest direct boom rival', 'WeldPro leads with arc-time productivity, with fume capture bundled'],
      ['Nederman / Kemper / Donaldson', 'Industrial fume extraction and filtration at scale', 'A focused, configurable productivity-plus-safety product, not a catalog'],
      [{ text: 'WeldPro 360 (Andersen)', bold: true }, { text: 'MIG welding boom arms (LRW-18/18P/10ML) + source-capture fume extraction + mounting and accessories', bold: true }, { text: 'Reach + a marketed arc-time gain + fume capture, brand-agnostic — under-marketed today', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Across both arenas, the digital and AI posture is the consistent white space. Figure 5.0 plots the contract-fabrication field on the two axes that decide whether a buyer finds Andersen, trusts it, and keeps it: how much real fabrication capability and capacity stands behind the quote, and how mature the digital and AI operating layer is.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Capability vs. AI Maturity', 560, 1.490),
  diagramCaption('Figure 5.0 — Competitive Positioning: Fabrication Capability vs. Digital & AI Operating Maturity'),
  spacer(160),
  calloutBox(
    'Where Andersen Wins — The White Space',
    [
      'The top-right corner — a capable, high-capacity fabricator running AI-speed quoting, answer-engine authority, and modern product marketing — is empty in Andersen’s region. The capable shops operate by hand; the brokers are cheap and bare; the cert-strong players are legacy on digital.',
      'There is an honest opening: capability does not mean discoverable, and capacity does not mean fast to quote. Andersen already has the plant, the process stack, and sixty years of trust. Adding the AI layer puts it in a corner none of its regional rivals occupy.',
      'And the WeldPro 360 product line gives Andersen a second front the pure job shops do not have — a national product the same visibility engine can market while the contract engine keeps the floor full.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '06'),
  spacer(100),
  p('For a sixty-year fabricator with a 108,000-square-foot plant, a full process stack, and its own national product line, the off-site digital footprint materially under-represents the business — and it matters precisely when a sourcing engineer, a contractor, or a weld-cell manager’s first move is a search, an AI question, and a quick scan of the shop’s public presence before an RFQ or a product inquiry ever goes out. The website itself is a genuine strength — clean and recently refreshed, ahead of most regional peers. The gap is everything around it: discoverability in AI search, a content engine, the reputation surface, and a quote intake that is still entirely manual.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.4 },
      { label: 'Gap / Opportunity', weight: 4.0 },
    ],
    [
      ['andersenmp.com', 'Clean, recently-refreshed capability, facilities, and product pages — a real asset', 'Add the layer that gets it found: answer-engine authority content, capability case studies, and an intelligent quote intake'],
      ['AI-search visibility', 'Below the citation surface on "contract metal fabrication Inland Empire," "custom equipment enclosure," "MIG welding boom arm," "weld fume extraction"', 'Multi-Agent SEO + AEO — own the discovery answer in ChatGPT, Perplexity, and Google AI overviews for both engines'],
      ['Content / resources', 'No blog or article hub; resources are literature, gallery, and product videos — nothing dated to rank or be cited', 'A focused content engine on fabrication capability, reshoring/domestic sourcing, and welding-fume safety that compounds for years'],
      ['Reputation / reviews', 'A handful of strong but mostly older five-star reviews; no testimonials surfaced on the site', 'A structured, AI-assisted review-generation program that turns finished jobs into a steady stream of recent reviews'],
      ['LinkedIn & social', 'A light company presence; little executive or capability thought leadership', 'A simple capability and reshoring cadence — the topics sourcing engineers and contractors read'],
      ['WeldPro 360 marketing', 'Product pages end in "request info"; no pricing, no configuration, little marketing behind a real product', 'Product demand-gen, an AI spec configurator, distributor-enablement content, and lead capture for a national audience'],
      ['Quote / RFQ intake', 'A manual web form with file upload; a person reads the comment box and the drawing and quotes by hand', 'AI RFQ and drawing intelligence — read the drawing, draft the first-pass estimate, remove the bandwidth ceiling'],
      ['Institutional memory', 'Sixty years of quotes, jobs, tooling, and setups in files, the ERP, and veteran heads', 'A searchable job, quote, and knowledge memory — instant recall, resilient to a retiring workforce'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the operation — only making a genuinely strong, sixty-year fabricator and a real product line visible to the OEM, contractor, and welding-equipment buyers Andersen is already built to serve.',
      'Answer-engine visibility, the content engine, the review program, and the WeldPro marketing are compounding moves: each lifts the share of qualified RFQs and product inquiries Andersen sees and the share it wins.',
      'They are also the natural first ninety days — get cited, stand up the reviews, and light up WeldPro — before any large build, so the entry phase pays back fast.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a sourcing engineer or a weld-cell manager asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Who is a good contract metal fabricator in the Inland Empire / High Desert for custom enclosures and weldments?"', [
    'TODAY — the assistant answers with whichever shops have the strongest content and third-party signals it can read. It names a couple of regional shops with more web content, and does NOT mention Andersen Industries — even though Andersen runs a 108,000-square-foot single-source plant with sixty years of track record. Andersen is invisible at the exact moment the buyer is forming a shortlist.',
    'AFTER AEO — the same query returns Andersen as a cited option ("Andersen Industries is a single-source contract metal fabricator in Adelanto, CA with laser, forming, machining, welding, and finishing under one roof, serving OEMs and contractors across Southern California since 1966…"), with the capability content, the surfaced reviews, and the enclosure portfolio as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live baseline is captured in Quick Win 1.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('Answer-engine visibility compounds, and it rewards whoever optimizes first. Every quarter Andersen is not cited, the assistants learn to answer "contract fabricator near me," "custom equipment enclosure," and "MIG welding boom arm" with someone else — and that default, once set in the training and retrieval data, is harder and more expensive to dislodge than to claim now. The 2025-2026 reshoring window is the moment OEM sourcing teams are actively looking for capable domestic fabricators, and the shop they find first in an AI answer is the one that gets the RFQ. The cost of waiting is not zero — it is a competitor becoming the default answer, and the re-source program, and the WeldPro sale, Andersen never sees.'),
);

// ---------- 07 THE SILENT MARGIN LEAK ----------
docChildren.push(
  ...sectionHeader('The Silent Margin Leak — Where Revenue Walks Out of a Job Shop', DARK_CHARCOAL, '07'),
  spacer(100),
  p('This section names the cost that does not appear on any report, because it is the one most expensive to ignore. A fabricator with a 108,000-square-foot plant, a full process stack, and a national product line should be holding more of its market than a hand-run quoting and marketing process can currently service. The revenue lost to quotes that went out slow or never, to buyers who never found the shop, to a product line that is barely marketed, and to thin recall on repeat jobs is not a rounding error — it is a silent margin leak that never shows up as a line item, only as jobs that went elsewhere, RFQs that never arrived, and WeldPro sales that never happened.'),
  spacer(140),
  subHeader('The Quotes That Went Out Slow — or Never Went Out'),
  p('Estimating bandwidth caps how many RFQs get a full, fast, complete quote. The hard or complex ones get deferred; the easy ones get worked; and the buyer awards the job to whoever quoted first. Today an Andersen estimator reads each uploaded drawing and the comment box and builds the quote by hand — careful, accurate, and bounded by how many hours are in the day. Every slow or skipped quote is a job lost to a faster competitor, not a better one. When a single won job can carry meaningful first-year gross profit, even a handful of additional completed quotes per month — at the same win rate — adds up quickly. AI RFQ and drawing intelligence drafts the first-pass estimate for the estimator to check and sign, removing the bandwidth ceiling without adding headcount.'),
  spacer(120),
  subHeader('The Buyers and Products That Never Found the Shop'),
  p('A sixty-year fabricator that is invisible in AI search and light on content loses work it never knew was available — the sourcing engineer who shortlisted three shops Andersen was not on, the contractor who searched "custom enclosure fabricator" and clicked a competitor, the weld-cell manager who bought a different boom because WeldPro 360 never showed up. This is demand Andersen is fully capable of serving, walking past the door because the door is hard to find. The fix is not more capacity; it is visibility — and it is among the highest-return work in this plan because the capability is already paid for.'),
  spacer(120),
  subHeader('The Re-Order Lost to Thin Memory — and the Knowledge Walking Out the Door'),
  p('A repeat job gets re-quoted from scratch — or lost — because the prior quote, tooling, and setup live in a spreadsheet or in a veteran’s head, and that person is busy or has retired. The skilled-trades shortage makes this acute: with the average welder near retirement age and a national shortage of replacements, the knowledge in Andersen’s most experienced people is both its quiet super-power and its biggest single-point risk. Neither the lost re-order nor the lost knowledge is a capability failure; both are memory failures. AI job-history memory makes sixty years of work instantly recallable, and a structured knowledge-capture effort preserves the setups, weld procedures, and fixturing know-how before they walk out the door.'),
  spacer(120),
  calloutBox(
    'Three Leaks, One Engine',
    [
      'Quotes skipped because the estimating bandwidth ceiling is too low; work and product sales missed because buyers never found the shop; re-orders and knowledge lost because memory is manual and the workforce is aging. None is a capability failure — each is a speed, visibility, or memory failure.',
      'These are exactly the failures the AI engine closes: AI quote drafting against the indexed history, answer-engine visibility and WeldPro marketing that get the shop found, and a job-and-knowledge memory that protects both the re-order and the institutional expertise.',
      'This is the highest-conviction place to start, because it converts capability, customers, and a product line Andersen already has into jobs and margin currently being lost.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 08 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services Andersen would engage. Each is labeled for what it is, and each maps to a specific Andersen use case. Technijian has not built an AI quoting platform for a metal fabricator before; what it has built is the document, search, and knowledge AI such a platform is made of — and that is the honest claim. The advantage is that Technijian already supports Andersen’s IT, so the build starts inside an environment we already know.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60 to 80 percent less manual review.',
    'Pointed at the quoting workflow, the same approach reads an uploaded drawing and an RFQ, extracts the features that drive cost (material, cut length, bends, holes, weld inches, finish), and drafts a first-pass estimate — at the same accuracy, in minutes instead of hours, with an Andersen estimator as the human-in-the-loop who signs. This is the flagship mapping.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70 percent.',
    'This is how Andersen gets found: answer-engine authority on the queries that matter for both engines — contract metal fabrication in the Inland Empire and High Desert, custom equipment enclosures, MIG welding boom arms, and weld fume extraction — so that ChatGPT, Perplexity, and Google AI overviews surface Andersen when a sourcing engineer, a contractor, or a weld-cell manager searches.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked, multi-model design is exactly what AI estimating needs to be trustworthy: three independent models review each draft estimate before an estimator sees it, so the number that lands on the desk is sanity-checked, sourced, and explainable. An Andersen estimator is always the human-in-the-loop arbiter who signs the quote that goes to the customer.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'For Andersen this is the job, quote, and knowledge memory — sixty years of quotes, jobs, tooling, weld procedures, and setups searchable across the team and resilient to a retiring workforce, so a repeat job is recalled and re-quoted in minutes instead of rebuilt from scratch. The shop’s quiet super-power, protected.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI-Native SDLC v7.0',
    'Technijian designed an AI-first software development lifecycle integrating Claude Code with Figma Make, GitHub, and CI/CD — full lifecycle coverage with an AI-native development methodology.',
    'This is how the AI Quote & Spec engine and the WeldPro configurator ship in roughly ninety days instead of nine months — integrated with the environment Technijian already supports for Andersen, production-grade and audit-logged, not a long agency build. Andersen owns what gets built.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Andersen Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations around a client’s actual process.',
    'This builds the working tools — the AI RFQ and drawing intelligence, the first-pass estimate drafting, the cert and inspection doc engine, the job-history memory, and the WeldPro AI spec configurator — integrated with Andersen’s systems and owned by Andersen, not locked inside someone else’s platform.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO — Answer-Engine Authority & Reputation',
    'My SEO is Technijian’s search service: local and answer-engine optimization, reputation management, and content so a business is found and trusted where its buyers actually look.',
    'For Andersen it owns the answer-engine citations on fabrication and welding-product queries, builds the under-covered capability and welding-fume-safety content, runs the structured review-generation program, and markets the WeldPro 360 line to a national audience.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Named-Account ABM + Product Capture',
    'My AI Lead Gen is Technijian’s productized account-based service — it tracks named accounts, watches buyer-side triggers, and produces account dossiers and personalized outreach, and it captures and nurtures inbound product leads.',
    'For the contract engine it is the OEM account-intelligence layer: track sourcing and engineering contacts at named target accounts, watch for re-source and reshoring triggers, and deliver pre-meeting dossiers. For WeldPro it captures and nurtures national product inquiries into qualified, configured opportunities.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task'),
  p('A fair question about running AI across estimating, content, account intelligence, and product marketing: will the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [
      { label: 'Tier', weight: 1.7 },
      { label: 'What It Does', weight: 3.3 },
      { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER },
    ],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — the final estimate sanity-check pass, the brand-voice content pass, the deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — estimate drafting, content, outreach personalization, summarization, scoring', { text: '~30–40%', color: TEAL, align: AlignmentType.CENTER }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — drawing and spec extraction, classification, enriching and tagging thousands of job and account records', { text: '~50–60%', color: BRAND_GREY, align: AlignmentType.CENTER }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Andersen pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single draft estimate, for example, has its drawing features extracted by a low-cost model, its should-cost reasoned by a mid model, and its final sanity-check run by a frontier model with a 3-model council review — instead of one premium model doing all three at roughly triple the cost. This is the AI-engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 09 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Andersen Leadership', CORE_BLUE, '09'),
  spacer(100),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Andersen sits today, how to adopt it without risk, and what comparable manufacturers are already doing. The goal is that the Andersen leadership team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t'),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "read this drawing and draft a first-pass estimate from these inputs." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the named OEM accounts and flag the ones with a reshoring or re-source trigger." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Andersen starts with simple automations that pay off in the first ninety days — estimate drafting, content, review generation — and adds autonomous agents only where the value is proven, which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Andersen Sits Today — The AI Maturity Ladder'),
  p('Most established, well-run manufacturers — including Andersen — sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [
      { label: 'Stage', weight: 1.6 },
      { label: 'What It Looks Like', weight: 4 },
      { label: 'Andersen Today', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', align: AlignmentType.CENTER }],
      [{ text: '2. Emerging', bold: true }, { text: 'A managed, modern IT environment is in place, but AI is not yet woven into how Andersen quotes, gets found, or captures knowledge', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['3. Operational', 'AI runs specific workflows day-to-day — estimate drafting, content, review generation, account intelligence — with measured results', { text: '', align: AlignmentType.CENTER }],
      ['4. Scaled', 'AI is embedded across growth and operations with governance and dashboards', { text: '', align: AlignmentType.CENTER }],
      ['5. Transformational', 'AI is the default way the business quotes, gets found, and competes', { text: '', align: AlignmentType.CENTER }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Andersen has the foundation many shops lack — a managed, secure IT environment already in place with Technijian. This report is the plan to reach Operational — AI working in the quote race and inside the visibility and knowledge workflow — within roughly nine months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages'),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a manufacturer like Andersen, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [
      { label: 'Risk', weight: 1.8 },
      { label: 'What It Means', weight: 3.4 },
      { label: 'How Technijian Controls It', weight: 3.4 },
    ],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything customer-facing — AI drafts the estimate, the content, and the cert package; an Andersen estimator or QA lead signs'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — drawings, quotes, customer records, and proprietary WeldPro designs never touch a public model; the security posture Technijian already runs for Andersen'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — audit-ready, led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Manufacturers Are Already Doing'),
  bullet('Contract fabrication & job shops: shops are using AI to read RFQ packages and drawings and draft first-pass estimates, compressing a multi-hour quote into minutes and responding to more RFQs with the same estimating team.'),
  bullet('Quality-heavy manufacturing: suppliers facing inspection, first-article, and certification paperwork are turning multi-hour document assembly into a minutes-long, audit-ready draft — with a qualified person signing the result.'),
  bullet('Industrial product brands: manufacturers with their own product lines are using AI configurators and content to turn anonymous web traffic into specified, qualified product inquiries — exactly the WeldPro 360 opportunity.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Andersen’s own numbers would be confirmed in discovery. Technijian’s specific, measured results from prior builds appear in Section 8 (Capability Proof) and Section 12 (Business Impact).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — An Andersen Estimator'),
  calloutBox('Before vs. After AI', [
    'TODAY: An RFQ lands with a drawing and a comment box. The estimator opens the drawing, reads the geometry by hand, hunts for a similar prior job in spreadsheets and memory, works up the material, cut, form, weld, and finish costs, and drafts the quote. The hard ones get deferred to the end of the day; the buyer awards the job to whoever quoted first.',
    'WITH AI: The AI reads the drawing and spec, extracts the cost-driving features, surfaces the closest matching job from sixty years of indexed history, and drafts a first-pass estimate in minutes; a three-model council sanity-checks it; the estimator reviews, adjusts, and signs. The expertise is captured in a system, so the same standard holds across the team and survives a busy week or a retirement — and the estimator spends the recovered hours on more quotes and better DFM feedback.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself'),
  buildTable(
    [
      { label: 'Path', weight: 1.6 },
      { label: 'Reality', weight: 5 },
    ],
    [
      ['DIY tools', 'Inexpensive, but Andersen assembles, secures, and governs everything — and owns the three risks above alone, on top of running the plant'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — already supporting Andersen’s IT, with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 10 INSIDE THE SHOP — AI-POWERED OPERATIONAL EFFICIENCY ----------
docChildren.push(
  ...sectionHeader('Inside the Shop — AI-Powered Operational Efficiency', TEAL, '10'),
  spacer(100),
  p('The growth half of this blueprint says "win more work." This half says "do the work you already win with less friction, less risk, and less exposure to the labor shortage." For a job shop, the efficiency front is often the easier yes: it does not depend on selling anything new, it pays back on hours and risk Andersen already carries, and it compounds with the growth front because faster quoting wins more of the work that visibility surfaces. The table below maps Andersen’s real internal workflows to an AI integration and to a proven Technijian result behind it.'),
  spacer(140),
  buildTable(
    [
      { label: 'Andersen Workflow Today', weight: 3.0 },
      { label: 'AI Integration', weight: 3.6 },
      { label: 'Proven Technijian Result', weight: 3.4 },
    ],
    [
      ['Estimator reads each uploaded drawing and quotes by hand', 'AI RFQ / drawing intelligence extracts cost-driving features and drafts a first-pass estimate for sign-off', 'AI document intelligence for FINRA broker-dealers: days → minutes, 60–80% less manual review'],
      ['RFQ triage — sorting fab vs. machining vs. enclosure vs. WeldPro by hand', 'AI classifies and routes each inbound RFQ, flags missing info, and auto-acknowledges', 'Multi-model classification at scale on the routed seven-model platform'],
      ['Inspection, first-article, and cert paperwork assembled manually', 'AI assembles inspection and cert packages from real measurement data, human-signed — the path toward ISO/AS9100-ready documentation', 'HIPAA-grade documentation-automation discipline; ScamShield 3-model review for accuracy'],
      ['Veteran setups, weld procedures, and fixturing in people’s heads', 'A searchable knowledge memory captures it before retirement and answers shop-floor questions in plain language', 'Weaviate + Obsidian enterprise knowledge and memory system'],
      ['Repeat jobs re-quoted from scratch from spreadsheets', 'AI job-history memory recalls the prior quote, tooling, and cost instantly', 'Weaviate knowledge system — instant retrieval across years of records'],
      ['WeldPro inquiries answered ad hoc by phone and email', 'An AI spec configurator guides the buyer to the right boom and fume setup and a clean quote', 'My Dev AI-native build — assistants and configurators around a real process'],
    ],
  ),
  spacer(160),
  subHeader('What the Efficiency Front Is Worth (Estimated, Conservative)'),
  p('These levers are estimated conservatively and confirmed against Andersen’s real numbers in discovery (Section 15). They are framed as hours and risk recovered, not as price changes — the work itself does not change, only the friction around it.', { size: 20 }),
  buildTable(
    [
      { label: 'Efficiency Lever', weight: 4.2 },
      { label: 'Conservative Annual Impact', weight: 3.8 },
    ],
    [
      ['Estimating hours recovered (AI drafts the first pass)', 'Reclaim a large share of estimating time → more quotes out the door at the same headcount'],
      ['Higher quote throughput → more jobs won', 'Even a handful of extra completed quotes per month, at the same win rate, compounds across the year'],
      ['Cert / inspection documentation time', 'Multi-hour packages assembled in minutes; a credible path to ISO/AS9100-ready records that open new RFQs'],
      ['Knowledge retention / onboarding speed', 'Veteran expertise preserved against retirement; faster ramp for new hires in a tight labor market'],
      ['Re-quote / re-order recall', 'Repeat jobs recalled in minutes instead of rebuilt — protects the cheapest revenue in the shop'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Efficiency Front Is the Easier Yes',
    [
      'Growth asks Andersen to win new work; efficiency pays back on work and risk it already carries — recovered estimating hours, audit-ready documentation, and veteran knowledge preserved before it retires.',
      'It also de-risks the single biggest threat to a sixty-year shop: the skilled-trades shortage. Capturing what the most experienced people know, and drafting the quotes they would have written, is insurance against the retirements coming for the whole industry.',
      'And it compounds with growth — faster quoting wins more of the work that visibility surfaces, so the two fronts reinforce each other.',
    ],
    TEAL
  ),
);

// ---------- 11 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Andersen’s Growth Engine', CORE_BLUE, '11'),
  spacer(100),
  p('The engine runs three motions at once: get found and specified (own answer-engine authority on fabrication and welding-product queries, run the content and review programs, and market WeldPro 360 to a national audience), win the quote and spec race (point AI at the RFQs, drawings, and cert paperwork so quotes go out in hours and a WeldPro inquiry becomes a configured quote), and hold and grow (recall sixty years of job history, generate a steady stream of reviews, and capture the veteran knowledge before it retires). The first fills the top of both funnels, the second is the quoting and spec core, and the third protects and compounds the order book.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Andersen AI Growth & Integration Engine', 600, 1.596),
  diagramCaption('Figure 11.0 — The Engine: Get Found & Specified, Win the Quote & Spec Race, and Hold & Grow'),
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
      ['Get Found & Specified', 'Answer-engine authority (AEO)', 'Be cited by Google AI, ChatGPT, Perplexity on fabrication + welding-product queries', 'Citation rate', 'My SEO'],
      ['Get Found & Specified', 'Capability + product content', 'Inland-Empire fabrication, enclosures, weld-fume safety, WeldPro 360', 'Share of voice', 'My SEO'],
      ['Get Found & Specified', 'Named-account intelligence', 'Trigger monitor on re-source, reshoring, and new programs at target OEMs', 'Trigger-to-RFQ', 'My AI Lead Gen'],
      ['Get Found & Specified', 'WeldPro demand-gen + distributor', 'National product leads and distributor-enablement content', 'Product leads', 'My SEO'],
      ['Win the Quote & Spec Race', 'AI RFQ / drawing intelligence', 'Drawing + spec into extracted features and a first-pass estimate, 3-model checked', 'Quote turnaround', 'My Dev'],
      ['Win the Quote & Spec Race', 'AI estimate / quote drafting', 'Draft the quote against sixty years of job and cost history', 'Quotes / estimator', 'My Dev'],
      ['Win the Quote & Spec Race', 'AI quality / cert doc engine', 'Assemble inspection and cert packages from real measurement data', 'Doc hours saved', 'My Dev'],
      ['Win the Quote & Spec Race', 'WeldPro AI spec configurator', 'Guide the buyer to the right boom and fume setup and a clean quote', 'Inquiry-to-quote', 'My Dev'],
      ['Hold & Grow', 'Job / quote / tooling memory', 'Sixty years searchable across the team', 'Retrieval depth', 'My Dev'],
      ['Hold & Grow', 'Review & reputation automation', 'Turn finished jobs into a steady stream of recent reviews', 'Review velocity', 'My SEO'],
      ['Hold & Grow', 'Veteran-knowledge capture', 'Preserve setups, weld procedures, and fixturing before retirement', 'Knowledge retained', 'My AI'],
      ['Hold & Grow', 'Estimating capacity recovery', 'Hours back from quoting go to more quotes and better DFM', 'Hours recovered', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI reads, drafts, classifies, and assembles — with sources cited and inside the rules the customer expects. It gives every RFQ, every drawing, and every cert package the same complete, fast treatment.',
      'AI never fabricates an inspection result and never invents a material certification. An Andersen estimator signs the quote that goes to the customer, and a welder or QA lead signs the inspection — in writing, outside any question of integrity.',
      'The team is freed, not replaced: the AI handles the drawing-reading, the first-pass math, the paperwork, and the memory; the team spends its time on the customer relationships, the design conversations, and the craftsmanship that win and keep the work.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 12 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '12'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on the highest near-term levers — answer-engine authority, named-account intelligence, WeldPro product marketing, and a strategy workshop — and expands into the custom AI Quote & Spec engine only as the results prove out. The model below is built from public information and conservative assumptions, because Andersen’s internal numbers were not used in this draft. Every figure is estimated; the discovery questions in Section 15 replace them with real baselines.'),
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
      ['Answer-engine citation on fabrication / product queries', 'Below the citation surface', 'Cited by Google AI, ChatGPT, Perplexity', 'Discoverability'],
      ['RFQ-to-quote turnaround time', 'Hours per quote; bandwidth limited', 'Minutes to a first-pass draft', 'Velocity'],
      ['Quotes completed per estimator per month', 'Bandwidth-limited; hard ones deferred', 'Ceiling removed by AI drafting + recall', 'Capacity'],
      ['Cert / inspection doc assembly', 'Manual, slow', 'Assembled from measurement data, human-signed', 'Quality + speed'],
      ['Recent online reviews', 'A handful, mostly older', 'Steady stream from finished jobs', 'Reputation'],
      ['WeldPro 360 qualified product leads', 'Ad hoc "request info" inquiries', 'Marketed funnel + AI configurator', 'Product growth'],
      ['Re-quote / re-order recall', 'From scratch; spreadsheet- and memory-bound', 'Instant from sixty years of memory', 'Retention'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model — The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the highest-conviction levers — incremental gross profit on jobs won faster and found, WeldPro product sales lift, and estimating hours recovered — not on price changes, because pricing stays out of scope. The entry program alone (answer-engine authority, named-account intelligence, WeldPro marketing, and the strategy workshop) drives the lift below; the custom AI Quote & Spec engine pushes every lever further.', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 4.0 },
      { label: 'Conservative', weight: 2.0, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.0, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.0, align: AlignmentType.CENTER },
    ],
    [
      ['Incremental contract jobs won (faster quote + AEO + ABM), gross-profit contribution', { text: '+$55K', align: AlignmentType.CENTER }, { text: '+$120K', align: AlignmentType.CENTER }, { text: '+$220K', align: AlignmentType.CENTER }],
      ['WeldPro 360 product sales lift (marketing + configurator)', { text: '+$20K', align: AlignmentType.CENTER }, { text: '+$45K', align: AlignmentType.CENTER }, { text: '+$80K', align: AlignmentType.CENTER }],
      ['Estimating + admin hours recovered', { text: '+$15K', align: AlignmentType.CENTER }, { text: '+$30K', align: AlignmentType.CENTER }, { text: '+$55K', align: AlignmentType.CENTER }],
      [{ text: 'Total Projected Y1 Value', bold: true }, { text: '+$90K', bold: true, align: AlignmentType.CENTER }, { text: '+$195K', bold: true, align: AlignmentType.CENTER }, { text: '+$355K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$31,000', bold: true, align: AlignmentType.CENTER }, { text: '~$31,000', bold: true, align: AlignmentType.CENTER }, { text: '~$31,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '~2.9x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.3x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~11.5x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only — the easiest possible place to start. It does not count the larger gains the custom AI Quote & Spec engine adds (quote-velocity compounding, the cert-doc engine opening new RFQs, and the WeldPro configurator maturing), nor the Phase-3 reuse of the engine and the productized WeldPro module. Average job value and margin are illustrative placeholders and are replaced with Andersen’s actual numbers in discovery. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility & Quote-Velocity Pilot'),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up Andersen’s answer-engine visibility for both engines, the named-account intelligence on the OEM accounts that matter, the WeldPro product marketing, and the strategy workshop that scopes the build — and it proves the lift before any larger build is discussed.'),
  buildTable(
    [
      { label: 'Service', weight: 3.2 },
      { label: 'Scope', weight: 3.4 },
      { label: 'Monthly', weight: 1.3, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.3, align: AlignmentType.CENTER },
    ],
    [
      ['My AI — Readiness + Executive Workshop (one-time)', 'A half-day session with leadership, estimating, and the WeldPro lead — quote-workflow tour, build scoping, AI-governance baseline', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — Tier 3 + AI Search Optimization', 'Answer-engine citations on fabrication + WeldPro queries; capability and welding-fume-safety content; review-generation program', { text: '$1,200', align: AlignmentType.CENTER }, { text: '$14,400', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account + Product (Starter)', 'Track sourcing and engineering contacts at named OEM targets; re-source trigger monitoring; capture and nurture WeldPro inquiries', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'THE 90-DAY PILOT — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,200/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$31,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — AI Quote & Spec Engine (Phase 2 build)', 'AI RFQ / drawing intelligence + first-pass estimate drafting + cert / inspection doc engine + job-history memory + WeldPro spec configurator', { text: '—', align: AlignmentType.CENTER }, { text: '~$65,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, audit-log review, and iteration of the engine', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, AI governance, model performance review, team training', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $5,000/mo + build', bold: true }, { text: '', bold: true }, { text: '~$130,000', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, Andersen is cited by at least one major AI assistant (Google AI, ChatGPT, or Perplexity) for a high-intent query (for example, "contract metal fabricator Inland Empire" or "MIG welding boom arm"), a working named-account intelligence queue is delivering pre-meeting dossiers, and the WeldPro 360 marketing funnel is live and capturing leads.',
      'Our commitment: the entry program is month-to-month, with no lock-in. If the pilot has not hit the metric above by day 90, you are under no obligation to continue, and we will tell you honestly whether it is worth continuing. Andersen carries the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $31,000 entry program — answer-engine authority, named-account intelligence, WeldPro marketing, and the strategy workshop — that pays for itself on additional jobs won and recovered estimating hours, with no large build to begin.',
      'Expand into the full engine (the custom AI Quote & Spec engine, the cert-doc engine, the WeldPro configurator, the managed app services, and the fractional AI advisor) only once the entry proves the lift. That one-time build becomes a permanent Andersen advantage, integrated with the environment Technijian already supports.',
      'Phase 3 is reuse: productize the WeldPro engine and the cert-doc automation as repeatable modules. Treat it as upside, not the Year-1 ask. Productized "My X" services beyond My SEO are estimated and confirmed at quote.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 13 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '13'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan — and because Technijian already supports the environment, the start is fast. Begin with the low-commitment entry: get found and specified, stand up the named-account intelligence and the reviews, and light up WeldPro. Then build the AI quote and spec engine and the cert-doc automation. Then hold, grow, and productize. Real gains — answer-engine citations, named-account dossiers, new reviews, and WeldPro leads — are visible inside the first ninety days, before the larger build; the deeper engine is given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Andersen 90-180-270 Day Roadmap', 600, 2.273),
  diagramCaption('Figure 13.0 — The Andersen Growth & Integration Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Get Found & Specified (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — get cited on fabrication and WeldPro queries, stand up the named-account intelligence and the review program, and market the product line, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — AEO + Authority Content', 'Launch Multi-Agent SEO and answer-engine optimization targeting the queries that matter for both engines (contract metal fabrication Inland Empire / High Desert, custom equipment enclosure, MIG welding boom arm, weld fume extraction). Draft the under-covered capability and welding-fume-safety content. Stand up the structured review-generation program on the existing customer base.'],
      ['1.2 — Account Intelligence + WeldPro Funnel', 'Stand up the named OEM target list (existing-class accounts, reshoring-active OEMs, contractors). Begin trigger monitoring (re-source events, new programs, plant moves). Light up the WeldPro 360 demand-gen funnel and lead capture — the entry program’s fast wins, with no custom build required.'],
      ['1.3 — AI Readiness Workshop + Baseline', 'Run the half-day workshop with leadership, estimating, and the WeldPro lead — quote-workflow tour, build scoping, AI-governance baseline. Confirm the current IT footprint and certification status. Capture the live AI-search baseline (Quick Win 1) to measure against.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Win the Quote & Spec Race (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — the AI quote and spec engine and the cert-doc automation, integrated with the environment Technijian already supports.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — AI RFQ / Drawing Intelligence + Estimate Drafting', 'Read drawings, specs, and RFQ packages; extract cost-driving features; draft the first-pass estimate; three-model review (the ScamShield pattern) on every draft; estimator-in-the-loop approval before any quote goes to the customer.'],
      ['2.2 — AI Quality / Cert Doc Engine + WeldPro Configurator', 'Assemble inspection, weld, and cert packages from real measurement data toward ISO/AS9100-ready documentation; every package human-signed. Ship the WeldPro AI spec configurator that turns a product inquiry into a guided, configured quote.'],
      ['2.3 — Job Memory + Knowledge Capture', 'Index sixty years of quotes, jobs, tooling, and setups in the Weaviate + Obsidian memory. Begin structured veteran-knowledge capture. Fractional AI Advisor onboards with a monthly cadence; AI-governance review begins.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Hold, Grow & Scale (Days 181–270)', { color: CORE_ORANGE }),
  p('Add the retention layer, deepen the knowledge memory, and begin productizing the repeatable modules.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Reputation, Memory & Capacity', 'Mature the review-generation flow into a steady stream of recent reviews. Complete the job-history memory and the veteran-knowledge capture. Stand up an estimating-capacity dashboard measured against the Section 15 baselines.'],
      ['3.2 — Productize (SCALE)', 'Productize the WeldPro spec-configurator and the cert-doc automation as repeatable managed modules. Deepen the cert-ready documentation to open aerospace/defense RFQs. Deliver an ROI dashboard measured against the real baselines.'],
    ],
  ),
);

// ---------- 14 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '14'),
  spacer(100),
  p('Six actions Andersen can take immediately — before any new Technijian engagement beyond the IT services already in place. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Test Answer-Engine Visibility for Both Engines',
    ['Type the queries a real buyer would type into ChatGPT, Perplexity, and Google AI: "contract metal fabricator Inland Empire," "custom equipment enclosure fabricator Southern California," "MIG welding boom arm," "weld fume extraction system." See whether Andersen is cited; capture a screenshot baseline. It costs nothing and immediately sizes the answer-engine opportunity for both the contract shop and WeldPro 360.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Run a Free AI Quote-Velocity Audit',
    ['Technijian’s no-cost growth hook: map how long an RFQ takes today end to end — from drawing-in to quote-out — and exactly where it stalls. Delivered as a one-page bottleneck map. As an existing managed client, Andersen already receives IT support; this is the growth analog of that, pointed at the quote process.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Map the Top 20 Target OEM & Contractor Accounts',
    ['The named-account seed list. Free to assemble from public sources and the existing customer base: the OEMs, equipment builders, and contractors where a re-source, a reshoring move, or a new program makes a fabrication need statistically likely in the next twelve months. This is the list the named-account ABM intelligence will work from day one.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Text Your Last 15 Satisfied Customers for a Review',
    ['Reputation is a thin asset today — a handful of strong but mostly older reviews. The fastest fix is free: ask the last fifteen happy customers, by text or email, for a quick Google review. It builds the trust signal AI search and human buyers both read, and it seeds the structured review program.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Open a WeldPro 360 Content Calendar',
    ['Five topics that market the product line and rank for years: "How a welding boom arm lifts arc-on time," "Source-capture fume extraction and OSHA welding-fume limits," "Choosing the right boom for your weld cell," "WeldPro 360 vs. a fixed extraction arm," and "Brand-agnostic welding equipment: works with your Lincoln, Miller, or ESAB gear." Free to outline; the foundation of the WeldPro demand engine.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('6 — Inventory the Quote and Job Data You Already Have',
    ['Map what your quoting and ERP records capture on each job today and what the AI quote engine will need (drawings, job history, tooling, material specs, cost history). This is a free internal audit; it informs the workshop and accelerates the Phase 2 build — and Technijian already knows the environment.'],
    CORE_BLUE),
);

// ---------- 15 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '15'),
  spacer(100),
  p('This blueprint was built from public information plus Technijian’s knowledge of Andersen as an existing client. The numbers in Sections 12 and 13 are deliberately conservative estimates — a short discovery call replaces them with Andersen’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Job economics', 'Average value and gross margin of a typical won job', 'Replaces the gross-profit placeholders in the ROI model'],
      ['Quote volume & velocity', 'RFQs per month, current win rate, current RFQ-to-quote turnaround time', 'Calibrates the quote-velocity lift directly'],
      ['Named-account roster', 'Which OEM and contractor accounts are live vs. dormant; revenue concentration', 'Seeds the ABM target list and sizes the re-order pool'],
      ['Quote system & data', 'What quoting/ERP system is in use; what job data is captured; file formats accepted', 'Defines the Phase 2 build and integration scope'],
      ['Certification status', 'Current ISO 9001 / AS9100 / ITAR status or plans; DNV/Navy weld procedures', 'Sizes the cert-doc opportunity and the aerospace/defense RFQ opening'],
      ['WeldPro 360 economics', 'Current WeldPro unit volume, price points, and distributor mix', 'Sizes the product demand-gen opportunity and the configurator scope'],
      ['Marketing ownership', 'Agency, internal, or none; current content cadence; who owns the website and social', 'Defines the content engine handoff'],
      ['IT footprint (confirm)', 'Current Technijian-supported systems, users, and the shop-floor environment', 'Confirms the warm-expansion integration surface'],
      ['Estimating capacity', 'Estimating headcount; hours spent quoting per week; the backlog of deferred RFQs', 'Sizes the hours-recovered and throughput levers'],
      ['Workforce & knowledge', 'Tenure of key estimators and welders; retirement horizon; onboarding pain', 'Sizes the knowledge-capture urgency and value'],
      ['Productization appetite', 'Whether Andersen would entertain productizing the WeldPro and cert modules', 'Decides whether the Year-2 conversation is single-shop or productized'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 entry proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Andersen’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 16 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '16'),
  spacer(100),
  p('The honest answers to the questions Andersen leadership is most likely asking right now.'),
  spacer(140),
  buildTable(
    [
      { label: 'Question', weight: 3 },
      { label: 'Our Honest Answer', weight: 5 },
    ],
    [
      [{ text: 'We already have whoever handles our website. Why add this?', bold: true }, 'Keep them — this does not replace web maintenance. We add the layer most web help does not: answer-engine optimization so AI assistants cite Andersen, the review and content programs, the named-account intelligence, the WeldPro product marketing, and the AI quoting engine no general web provider builds. And because Technijian already supports your IT, the AI layer plugs into the environment we already operate.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — estimate drafting, content, review generation — not autonomous "agents" running your shop. We use the simplest tool that works, measure it, and only expand what earns its place. The same document-intelligence engine already runs for FINRA broker-dealers; this is that discipline applied to your RFQs and drawings.'],
      [{ text: 'Is our data — drawings, quotes, customer records, WeldPro designs — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything customer-facing, led by a CISSP-certified team. It is the same security posture Technijian already runs for Andersen, extended to the AI layer.'],
      [{ text: 'We’re a lean estimating team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give your estimators back hours, not add work. Technijian runs the build and the cadence; your involvement is a short workshop, a monthly strategy session, and reviewing and signing what the AI drafts. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 12), month-to-month with no lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry program is about $31K for Year 1 — My SEO with AI search optimization, named-account intelligence and WeldPro marketing, and the strategy workshop — at published or estimated rates, with no large up-front build. The custom AI Quote & Spec engine (the full engine) is profiled in Section 12, but only comes after the pilot proves the lift. Productized "My X" services beyond My SEO are estimated and confirmed at quote.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 17 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '17'),
  spacer(100),
  p('Andersen already has the hard things: a 108,000-square-foot single-source plant, the full cut-form-machine-weld-finish stack, sixty years of fabrication know-how, an OEM and contractor customer base, its own WeldPro 360 product line, and a Technijian team that already supports its IT. What it has not yet done is add the AI operating layer that turns those assets into faster quotes, more found work, a marketed product line, and recovered shop-floor hours — and that is where this program starts.'),
  p('The opportunity is concrete: get found and specified as the fabricator and the welding-product brand buyers ask about first, win the quote and spec race by turning drawings and RFQs into accurate first-pass estimates in hours, and hold and grow by recalling sixty years of history, generating a steady stream of reviews, and capturing the veteran knowledge before it retires. A focused, two-engine program does all of it — and it stays inside the boundary that keeps the speed trustworthy: AI drafts, an Andersen estimator or QA lead signs.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 15 questions and confirm program scope — easy to schedule, because the team already works with Andersen on IT.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — answer-engine authority, named-account intelligence, WeldPro marketing, and the strategy workshop — live inside 30 days of go-ahead, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to quote in minutes, get found by the buyers searching right now, and market WeldPro 360 like the product it is?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);
// NOTE: no trailing "landing paragraph" here. Section 18's pageBreakBefore heading starts the
// next page cleanly — exactly like every other section transition. An empty landing paragraph
// orphaned onto its own blank page (p51) in testing, so it is intentionally omitted.

// ---------- 18 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '18'),
  spacer(100),
  p('Technijian is an AI-native managed-services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000 — and Andersen’s IT partner today. We build and operate the AI systems that help capable operators compete at speed, with security and compliance built in, not bolted on. Technology as a solution.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Andersen', weight: 5 }],
    [
      ['My Dev', 'Custom AI-native builds — the AI RFQ and drawing intelligence, first-pass estimate drafting, cert / inspection doc engine, job-history memory, and the WeldPro AI spec configurator — integrated with Andersen’s systems and owned by Andersen'],
      ['My SEO', 'Answer-engine authority on fabrication and welding-product queries, the under-covered capability and welding-fume-safety content, the review-generation program, and WeldPro 360 product marketing'],
      ['My AI Lead Gen', 'Named-account ABM intelligence on OEM sourcing and engineering contacts; re-source and reshoring trigger monitoring; WeldPro product lead capture and nurture'],
      ['My AI', 'AI strategy and builds — fractional AI advisor, model performance review, AI governance, team training'],
      ['Managed IT & Security', 'The day-to-day IT support, security, and infrastructure Technijian already provides Andersen — the foundation the AI layer builds on'],
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
  p('Market and category intelligence gathered via public web research conducted June 2026, plus Technijian’s knowledge of Andersen as an existing client. Company details (founding, location, services, products, and certifications) are drawn from public sources and Andersen’s own website and should be confirmed with Andersen before external use.', { italics: true }),
  spacer(120),
  p('1. Andersen Industries — andersenmp.com (Home, About, Facilities, Industries, Engineering, Welding, Manufacturing Services, Equipment Enclosures, WeldPro 360 product pages, Request for Quote, Locations, Contact). Contract metal fabricator founded 1966; Adelanto, CA; 108,000 sq ft facility; laser/turret cutting, forming, plate rolling, CNC machining, MIG/TIG welding, powder coating, 3D-CAD engineering; AWS D1.1 / D1.2 weld procedures; serves OEMs, machine-tool and specialty-equipment builders, and contractors across LA Metro, Inland Empire, Orange County, San Diego, and the Central Valley.', { size: 20 }),
  p('2. WeldPro 360 product line — andersenmp.com WeldPro 360 pages (LRW-18, LRW-18P, LRW-10ML boom arms; weld fume extractor; boom mounting and accessories) and distributor listing (CK Supply). Marketed arc-time productivity gain; brand-agnostic compatibility with Lincoln, Miller, ESAB, and Fronius equipment. The arc-time figure is Andersen’s own marketed claim and should be substantiated before external use.', { size: 20 }),
  p('3. Regional competitors — F&B Performance Engineered Products (Victorville); Pen Manufacturing (LA/OC); Precision Advanced Mfg (Riverside/Anaheim; ISO 9001 / AS9100 / ITAR); OC Sheet Metal (Anaheim); Victor Valley Steel Fabricators (Victorville); Design Sheet Metal Fabrication and Brydenscot (Inland Empire). Public websites and industrial-directory listings; certification claims are the competitors’ own and were not independently audited.', { size: 20 }),
  p('4. WeldPro product competitors — Lincoln Electric, Miller (FILTAIR), RoboVent, Nederman, Kemper, Donaldson, ESAB. Public product pages for welding fume-extraction arms, booms, and source-capture systems.', { size: 20 }),
  p('5. Market & industry context — U.S. sheet-metal and fabricated-structural-metal manufacturing segments at roughly $65–80B (2025, IBISWorld industry reports; CAGRs are recent-cycle and presented as approximate); U.S. manufacturing-construction spending (U.S. Census Bureau); reshoring and FDI job announcements (Reshoring Initiative 2024 Annual/Data Report, ~244,000 jobs announced in 2024); skilled-welder shortage and workforce age (American Welding Society workforce data, ~330,000 welding professionals needed by 2028; average welder age ~55); Inland Empire / High Desert industrial-market reporting (CBRE, San Bernardino County economic development).', { size: 20 }),
  p('6. Welding-fume regulation (WeldPro demand driver) — OSHA Hexavalent Chromium standard, 29 CFR 1910.1026 (permissible exposure limit 5 µg/m³, action level 2.5 µg/m³, engineering-control requirement); OSHA welding-fume guidance and manganese exposure-limit trends (ACGIH TLV). Source-capture extraction is the engineering control these standards drive.', { size: 20 }),
  p('7. Technijian internal context — Andersen managed-IT engagement (existing client; exact footprint to be confirmed at discovery, Section 15). Internal source of the warm-expansion framing.', { size: 20 }),
  p('8. Technijian service capability — the My AI "Proven Results" (Multi-Agent SEO and answer-engine platform; AI Document Intelligence for FINRA broker-dealers; ScamShield LLM Council; Weaviate + Obsidian enterprise knowledge and memory; AI-Native SDLC v7.0).', { size: 20 }),
  p('9. Technijian service pricing — My SEO tiered pricing $500 to $1,500 monthly with $200 add-ons (AI Search Optimization); My AI Lead Gen Starter $1,000 monthly; My AI Workshop $5,000 one-time; My AI Fractional Advisor $2,000 monthly; My Dev custom build scoped $40,000 to $120,000; My Dev Managed App Services $800 monthly. Productized "My X" services beyond My SEO are estimated and confirmed at quote.', { size: 20 }),
  p('10. AI literacy and governance frameworks — MIT Sloan Management Review (AI literacy); Anthropic, "Building Effective Agents" (workflow vs. agent); a widely-used five-stage AI maturity model consistent with Gartner and Google Cloud frameworks; U.S. NIST AI Risk Management Framework (Govern, Map, Measure, Manage).', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Andersen-Industries-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
