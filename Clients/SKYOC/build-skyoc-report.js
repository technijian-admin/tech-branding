// Skyline Displays of Orange County (SKYOC) - AI Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/ALG/build-alg-report.js (AAVA/TALY/VAF/SCF/ORX/MWAR/RKE lineage).

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
const PURPLE        = '7B2D8B';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_SERVICE_BUF  = dbuf('servicearch.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-03';
const PHONE = '949.379.8499';

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
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
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

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}
function bulletRuns(runs) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 100, line: 300 },
    children: runs.map(r => new TextRun({
      text: r.text, size: r.size || 22, color: r.color || BRAND_GREY,
      bold: r.bold || false, italics: r.italics || false, font: FONT_BODY,
    })),
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Skyline: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
      new TextRun({ text: `Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  ${PHONE}  |  technijian.com  |  Page `, size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'SKYLINE DISPLAYS', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'OF ORANGE COUNTY', size: 40, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Custom Trade-Show Exhibits  -  Design, Build & Manage, Since 1985', size: 22, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Lake Forest, California  |  skylineoc.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL - Prepared exclusively for Skyline Displays of Orange County', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }),
  // No trailing pageBreak: Section 01's pageBreakBefore starts the next page automatically.
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1985', label: 'Founded - 40 Years Family-Owned', color: CORE_BLUE },
    { number: '45,000', label: 'Sq Ft of Client Booth Storage', color: CORE_ORANGE },
    { number: '$17.3B', label: 'US Trade-Show Market by 2028', color: TEAL },
    { number: '3x', label: 'Lead Conversion: Digital vs Paper Capture', color: GOLD },
  ]),
  spacer(300),
  p('Skyline Displays of Orange County is a forty-year, family-owned trade-show exhibit house and an authorized dealer in the Skyline Exhibits network. From its Lake Forest headquarters it designs, builds, installs, and stores custom and portable exhibits for brands of every size, backed by 45,000 square feet of asset management and a showroom where clients see a display before they buy. The work is excellent and the reputation is earned: museum curators "delighted and amazed," a named client whose booth "generated buzz on the show floor with videos shared for months," and multi-show clients who trust Skyline with ten-plus shows a year. The growth gap is not the work. It is everywhere the work is invisible.'),
  p('Two forces decide this market in 2026, and Skyline is on the wrong side of both today. First, buyers now choose an exhibit house the way they choose anything else: a search, a question typed into ChatGPT or Google AI, a quick scan of reviews. Skyline\'s own website is a 1990s static-HTML site so dated that search engines mis-summarize it, while the modern, polished presence lives on the parent corporate site. The company is hardest to find exactly where the buying now starts. Second, the show floor itself is going AI fast: digital lead capture converts three times better than paper, AI booth activations lift engagement up to forty-five percent, interactive elements hold attendees two to three times longer, and roughly half of all event professionals now use AI in their trade-show work, up from a quarter two years ago. The parent network is already moving in this direction. No local competitor is.'),
  p('This blueprint runs two engines on one show floor. The first grows Skyline\'s own book: get found and win the project (AI-search authority, reputation, faster RFP and quote turnaround), then keep and grow the account (repeat and re-book intelligence, the latent social proof, forty years of design knowledge made searchable). The second is a new, high-margin revenue line Skyline can resell to its own clients: the AI-enabled booth - lead capture, an on-floor concierge, instant post-show follow-up, and an ROI dashboard - with Technijian as the white-label builder behind it. Each piece is designed inside a plain boundary: AI assists capture, follow-up, and drafting; it never replaces the designer\'s craft and never makes a consent or legal call. A person owns both.'),
  p('Crucially, this is not a foreign idea to Skyline. In 2024 the company co-founded Echo Experiential with Echo Media Group, an alliance built explicitly to pair marketing campaigns with the booth and capture leads "from pre-show to post-show." Skyline has already chosen the integrated, capture-the-lead direction; what it does not yet have is the AI that makes that promise scale and become measurable. This blueprint is the intelligence layer under a strategy the company has already publicly committed to.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Skyline has the hard things already: forty years of craft, a trusted name, named multi-show clients, 45,000 square feet of asset management, and the Skyline product line. What it does not have is the AI-driven layer that decides who gets found, who responds fastest, and who can sell measurable results - not just a structure.',
      'There are two wins, not one. Engine A modernizes Skyline\'s own funnel and reputation so it is found and chosen where buyers now look. Engine B turns the AI-enabled booth into a new resale line Skyline sells to its clients - the differentiator no local rival offers.',
      'There is an enterprise-value overlay, too. The Skyline network is consolidating under private-equity ownership and acquiring its strongest dealers. A differentiated, AI-enabled, high-growth dealer is worth more - a better multiple and a stronger hand - whatever the family decides next.',
    ],
    CORE_ORANGE
  ),
  spacer(220),
  subHeader('Strategic Takeaways'),
  bulletRuns([
    { text: 'Skyline is invisible where buyers now start. ', bold: true, color: DARK_CHARCOAL },
    { text: 'A forty-year reputation does not surface in the AI answers and searches that now build the shortlist. The first projects lost are lost on findability, not craft - and that is the cheapest gap to close.' },
  ]),
  bulletRuns([
    { text: 'The show floor is going AI, and no local rival is selling it. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Digital capture converts three times better than paper and AI activations lift engagement up to forty-five percent. The exhibit house that delivers - and resells - the AI layer owns a differentiator the entire SoCal field is missing today.' },
  ]),
  bulletRuns([
    { text: 'Two engines compound on one foundation. ', bold: true, color: DARK_CHARCOAL },
    { text: 'The same AI-search authority, reputation, design-knowledge memory, and measurement layer that grow Skyline\'s own book also power the AI-enabled booth it resells to its clients. One build, two revenue lines.' },
  ]),
  bulletRuns([
    { text: 'The re-book is the cheapest growth, and it is leaking. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Repeat and multi-show clients drift when no one watches their show calendar. Re-book intelligence protects the revenue that costs the least to keep and is most often left on the table.' },
  ]),
  bulletRuns([
    { text: 'AI raises Skyline\'s enterprise value, not just its lead flow. ', bold: true, color: DARK_CHARCOAL },
    { text: 'In a Skyline network consolidating under private-equity ownership and acquiring its strongest dealers, a differentiated, AI-enabled, high-growth dealer commands a better multiple and a stronger hand - whatever the family decides next.' },
  ]),
  spacer(160),
  calloutBox(
    'Where Technijian Fits',
    'Technijian designs, builds, and operates the AI growth and integration stack so Skyline\'s designers and sales team stay focused on the craft and the relationships. We are not a marketing agency - we are the technology partner that builds the AI infrastructure, sized and priced for a family-owned exhibit house, and white-labels the booth layer Skyline resells under its own name.',
    CORE_BLUE
  ),
  p('A note on figures: this blueprint was built from public information. Skyline\'s internal numbers - project mix, average project value, win rate on RFPs, repeat-client share, and current marketing spend - were not available for this draft. Every projection below is labeled estimated and conservative and calibrates to real numbers after a short discovery call. The specific questions are in Section 17.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW AN EXHIBIT HOUSE WINS ----------
docChildren.push(
  ...sectionHeader('How an Exhibit House Wins in 2026', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for an exhibit house starts with how the business actually earns. Revenue comes from a booth-buying funnel that runs over months: a marketing or event manager discovers an exhibit partner, qualifies the fit and budget, reviews a design concept and a quote, awards the project, the booth is built and shown, and the client either re-books for the next show or is lost to a competitor. Around that funnel sit four sources of demand - search and AI discovery, show RFPs, referral and repeat business, and targeted outreach to companies already registered to exhibit. The diagram below shows the funnel, the demand that feeds it, and the two engines where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The Dual Growth Engine', 600, 1.667),
  diagramCaption('Figure 2.0 - How an exhibit house wins: discover, win the project, deliver, and re-book - plus the AI-booth resale line'),
  spacer(120),
  subHeader('Discovery - How a Buyer Even Finds the Exhibit House'),
  p('In 2026 a marketing manager planning a booth for the Anaheim Convention Center does not open a directory; they search, and increasingly they ask ChatGPT, Perplexity, or Google\'s AI overview "best custom trade show booth company in Orange County" or "AI-enabled trade show booth near Anaheim." The exhibit house the AI cites is on the shortlist; the one it does not cite is not. For a forty-year company with a dated website and scattered reviews, this is the first and least-recognized place business is lost - not to a better builder, but to a more findable one.'),
  subHeader('The Project Is Won on Speed and Confidence'),
  p('Once a buyer raises a hand, the contest is responsiveness. Exhibitors issue booth RFPs six to eight months before a show and expect a design direction and a clear rate-sheet quote. The exhibit house that returns a sharp first concept and an accurate quote in hours, while a competitor takes a week, wins more of the projects it already gets invited to bid. That speed is a craft problem today - designers and estimators assembling concepts and quotes by hand - and it is exactly where AI-assisted drafting turns a bandwidth ceiling into a non-issue without changing the creative team.'),
  subHeader('The Cheapest Win Is the Re-Book'),
  p('Winning a new exhibitor costs months of relationship work; re-booking the client who already trusts Skyline with ten shows a year costs a timely, proactive conversation before the next show window. The biggest avoidable losses are the repeat clients who quietly drift because no one watched their show calendar, and the booths that ship without the lead-capture and follow-up layer that would have proven the booth\'s return. Retention and the new AI layer are the quiet half of the engine, and they are where the margin compounds.'),
  spacer(120),
  calloutBox(
    'Two Engines, One Show Floor',
    [
      'Engine A - grow Skyline\'s book: be found in the AI answers and searches buyers now read first, win more of the RFPs you are invited to with faster concepts and quotes, and re-book the repeat clients you already have.',
      'Engine B - the new AI-booth resale line: sell a managed lead-capture, on-floor concierge, post-show nurture, and ROI-measurement layer with every booth - a high-margin service no local competitor offers, built white-label by Technijian.',
      'Both run on the same foundation: AI-search authority, reputation, a knowledge memory of forty years of design, and a measurement layer that finally proves what a booth returns.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE AI SHIFT ON THE SHOW FLOOR ----------
docChildren.push(
  ...sectionHeader('The AI Shift on the Show Floor - Why Now', TEAL, '03'),
  spacer(100),
  p('Trade shows are not fading; they are getting more competitive for attention, and AI is the dividing line. This section names the forces plainly, because the value of a Technijian-built program is not just that the AI is fast - it is that the AI is fast and safe. The boundary is simple: AI assists capture, engagement, follow-up, and drafting; it never replaces the designer\'s creative judgment and never makes a consent or legal determination about an attendee\'s data. A person owns both.'),
  spacer(140),
  subHeader('The Market Is Big, Growing, and More Crowded'),
  p('US business-to-business trade shows generated about 15.8 billion dollars in 2024 and are on track for 17.3 billion by 2028, with the global market pushing toward fifty billion. Seventy-two percent of B2B buyers still say they prefer meeting vendors in person. The show floor is not going away - which means the contest for an attendee\'s attention, and for the exhibitor\'s budget, only intensifies. Exhibitors are under more pressure than ever to prove a booth returned more than it cost.'),
  spacer(120),
  subHeader('AI Is the 2026 Dividing Line'),
  p('Roughly half of event professionals now use AI tools somewhere in their trade-show operations, up from about a quarter in 2024. AI-powered booth activations - interactive guided experiences, on-floor assistants - report engagement lifts of up to forty-five percent, and interactive elements hold attendees two to three times longer than static displays. AI badge and business-card scanning now exceeds ninety-five percent accuracy, and digital lead capture converts about three times better than paper forms. The exhibitor who captures more leads and follows up instantly wins the show; the one who collects a stack of cards and emails them a week later does not.'),
  spacer(120),
  subHeader('Spend Is Moving to Exactly Where AI Helps'),
  p('As per-attendee costs rise, exhibitors are concentrating budget on the three areas that drive return: booth design, pre-show marketing, and post-show follow-up. Those are precisely the places an AI layer plugs in. The parent Skyline network is already moving this way - launching interactive digital activations and a data-driven exhibiting methodology - which means the AI-enabled booth is on-brand for a Skyline dealer, not a departure. The dealer who operationalizes a managed AI layer locally, and resells it, rides the wave; the dealer who stays "a booth vendor" gets commoditized.'),
  spacer(120),
  subHeader('The Boundary - What the Program Will and Will Not Do'),
  p('Trade-show lead capture collects attendee personal information - badge scans, business cards - so the program is built inside the consumer-privacy and anti-spam rules that govern it: CCPA and CPRA for the data, CAN-SPAM and TCPA for the post-show outreach, and California\'s bot-disclosure law for any on-floor chatbot, which discloses that it is an assistant. AI drafts the follow-up, scores the lead, and answers the attendee; a person owns the consent, the messaging decision, and the creative. This is a lighter boundary than a bank or a landlord faces, but it is real, and stating it is what makes the program safe to deploy at scale.'),
  spacer(120),
  calloutBox(
    'The Boundary - AI Serves, the Designer and the Client Decide',
    [
      'AI captures and enriches the lead, answers the attendee on the floor, drafts the personalized follow-up, and measures the booth\'s return - consistently, and inside the privacy and anti-spam rules that govern attendee data.',
      'AI never replaces the designer\'s creative judgment, never sends outreach a person has not approved, and never makes a consent or legal determination. The designer owns the craft; the client owns the data decision.',
      'That boundary is the point: Skyline\'s clients get enterprise-grade engagement and measurement without putting their brand behind a message a person did not approve.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 04 SERVICE ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('Skyline\'s Service Architecture', CORE_BLUE, '04'),
  spacer(100),
  p('Before the growth strategy, it is worth being precise about what Skyline actually sells, because the breadth is itself the advantage. Skyline is not a single-service booth shop; it runs the entire exhibit lifecycle under one roof - strategy and design, fabrication, large-format graphics, install and dismantle, on-site show support anywhere in the world, year-round storage and asset management, and the re-book for the next show. For a marketing manager juggling a print vendor, a fabricator, a freight company, and a labor crew, that single-partner model is the whole point - and it is also what makes an AI layer so natural to add, because Skyline already touches every stage of the booth\'s life.'),
  subHeader('4.1  Design & Build - the Custom and Modular Core'),
  p('Skyline\'s flagship is custom exhibit design and fabrication - a one-of-a-kind booth engineered to a brand\'s goals and the realities of a specific show floor. The "custom exhibits, without the custom price tag" positioning is the practical promise: high-impact design and structure made accessible by Skyline\'s modular system and the broader Skyline Exhibits product line behind it, so a brand of any size can look bigger than its budget. This is the highest-craft, highest-margin work, and it is where forty years of design judgment shows.'),
  p('Alongside the fully custom work sit portable and modular systems and a rental program. Portable and modular exhibits are reconfigurable, lighter to ship, and faster to set up - the right answer for an SMB, a multi-configuration program, or a brand that exhibits in several footprints across a season. The rental program removes the capital cost of owning a booth entirely, lowering the barrier for first-timers and one-off shows. Together they let Skyline meet a buyer anywhere on the spectrum from a modest inline to a six-figure island - which is exactly why the growth engine has to speak to both the first-time SMB and the enterprise program manager, not one or the other.'),
  subHeader('4.2  Graphics, Logistics & Worldwide Show Services'),
  p('A booth is only as good as its graphics and its execution on the floor. Skyline\'s in-house creative-content design and large-format graphic production supply the visual stopping-power that turns a structure into an experience - and, increasingly, into share-worthy content a client posts for months, as the Urban Surfaces booth showed. Holding creative in-house also means the design intent survives all the way to the printed panel instead of being lost in a handoff to an outside printer.'),
  p('Beyond the build, Skyline coordinates install and dismantle, on-site supervision, drayage, and the rest of the show-services choreography exhibitors find most stressful - in any show city, through the Skyline network\'s worldwide reach. That logistics capability is also a growth lever in its own right: it is what lets Skyline serve out-of-region brands and other exhibit houses that need dependable local hands at the Anaheim, Los Angeles, and Las Vegas convention centers, the channel buyer profiled as Persona 7.'),
  subHeader('4.3  Storage & Asset Management - the Quiet Retention Engine'),
  p('The 45,000 square feet of managed storage is more than a warehouse. Between shows, Skyline stores, inspects, refurbishes, and re-kits each client\'s booth so it is show-ready for the next event - which is precisely why multi-show clients trust Skyline with their assets and come back season after season. Asset management is the physical anchor of the re-book relationship and the least price-sensitive part of the business.'),
  p('It is also the natural home for two AI layers. A searchable design-knowledge memory turns decades of stored builds, graphics, and client preferences into a reusable asset that speeds the next quote; and re-book intelligence watches each stored client\'s show calendar so the next-show conversation happens before the window closes. The storage that already keeps clients loyal becomes the data that grows the account - the clearest example of AI integrating into a business Skyline already runs.'),
  spacer(120),
  buildTable(
    [
      { label: 'Service Line', weight: 2.6 },
      { label: 'What It Covers', weight: 4.2 },
      { label: 'Why It Matters to the Buyer', weight: 3.2 },
    ],
    [
      ['Custom Exhibits', 'Ground-up design and fabrication of a one-of-a-kind booth - "custom exhibits, without the custom price tag"', 'The flagship build for brands that need to stand out on a crowded floor'],
      ['Portable / Modular', 'Reconfigurable, lighter-weight display systems that ship and set up easily', 'The right-sized option for SMBs and multi-configuration programs'],
      ['Rental Program', 'High-impact rental exhibits without the capital cost of owning a booth', 'Lowers the barrier for first-timers and one-off shows'],
      ['Creative & Graphics', 'In-house creative content design and large-format graphic production', 'The visual stopping-power that wins attention - and share-worthy content'],
      ['I&D + Worldwide Show Services', 'Install and dismantle labor, show-services coordination, and on-site supervision in any show city', 'One partner handles the logistics across every market'],
      ['Storage & Asset Management', '45,000+ sq ft of managed storage, refurbishment, and kitting between shows', 'The reason multi-show clients trust Skyline with their assets year-round'],
    ],
  ),
  spacer(160),
  p('Figure 4.0 traces that lifecycle and marks the three points where Technijian AI adds a layer - faster concepts and quotes at design, the AI-enabled booth at the show, and re-book intelligence afterward - without changing the craft in between.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_SERVICE_BUF, 'Skyline Service Value Chain', 620, 2.25),
  diagramCaption('Figure 4.0 - Skyline\'s Service Architecture: the booth lifecycle and where AI adds a layer'),
  spacer(160),
  calloutBox(
    'Selected Work & Reputation',
    [
      'The craft is not in question, and the portfolio proves the range: Panattoni and CEMCO (industrial development and manufacturing), AEVEX Aerospace (defense), Diality and Vital Tears (medical), Oosto and eLend (AI software and fintech), Urban Surfaces (a 20-by-20 flooring island), Caboo and Inicio (consumer brands), and the California Museum of Photography (a 60-foot backlit traveling exhibit). One client was "delighted and amazed"; another\'s booth "generated buzz on the show floor," with videos "shared for months."',
      'A multi-show client running ten-plus shows a year with four active booths trusts Skyline with its assets and praises the team as "proactive" and willing to "go to bat when complications arise." Designers are named and praised by clients - the creative relationship is a core asset.',
      'The gap is not the work; it is that this reputation is scattered and largely invisible online, exactly where the next buyer looks first. Sections 09 and 10 size that gap.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('Skyline\'s growth comes from a hybrid motion: a broad pool of new exhibitors who find the company through search and reputation, a finite set of repeat and multi-show accounts who come back show after show, a brand-new resale line in the AI-enabled booth, and the agencies who subcontract fabrication. The same AI engine serves all four. The point is to be found and chosen where buyers now look, to win more of the projects already in reach, to sell a measurable AI layer no local rival offers, and to keep the accounts the company has already earned.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.6 },
      { label: 'What It Is', weight: 3.4 },
      { label: 'How Skyline Captures It', weight: 4 },
    ],
    [
      ['New exhibitors (demand-gen)', 'Companies planning a booth for an Anaheim, Los Angeles, or Las Vegas show who find an exhibit house by search, AI answer, and reviews', 'AI-search and AEO authority on the booth-design queries; consolidated, growing reputation; capture-and-nurture across the 6-8-month buying cycle'],
      ['Repeat & multi-show accounts', 'Clients who exhibit at multiple shows a year and re-book - the highest lifetime value and lowest acquisition cost', 'Re-book intelligence that watches each client\'s show calendar; asset-management value; adding the AI layer to every booth they run'],
      ['The AI-enabled booth (new line)', 'A managed lead-capture, concierge, follow-up, and ROI layer sold with the booth - a new high-margin service', 'Technijian builds it white-label; Skyline resells it, attaches it to the existing client base, and proves booth ROI with the dashboard'],
      ['Agencies & event-production partners', 'Marketing and experiential agencies that subcontract exhibit fabrication and design', 'Reliable white-label execution; a design partner that can now also deliver the AI engagement layer their clients are asking for'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Hybrid by Design - Find, Win, Sell the Layer, Keep',
    [
      'Unlike a pure account-based supplier, Skyline has a real broad-demand pool: every SoCal company planning a booth is a prospect who starts with a search. Modern AI-search authority and reputation put Skyline in front of them.',
      'The highest-return pool is the repeat client already trusting Skyline with multiple shows - protected by re-book intelligence and expanded by attaching the AI layer to every booth they run.',
      'Every motion is measurable - AI-citation rate, inbound inquiries, RFP and quote turnaround, win rate, review velocity, AI-booth attach rate, and re-book rate - so the program is tuned to what actually moves the order book.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE SKYLINE OC BUYER (PERSONAS) ----------
docChildren.push(
  ...sectionHeader('The Skyline OC Buyer', CORE_ORANGE, '06'),
  spacer(100),
  p('Five buyer types account for nearly all of Skyline\'s project and re-book activity, and the firm\'s own portfolio names them. They differ in how they discover an exhibit house, how fast they move, and what keeps them - but each is reached and kept through being found, responding fast, and proving return, rather than through price alone. One important note: the buyer who specifically wants measurable ROI and an AI-enabled booth is not a separate company type - it is a fast-growing demand that cuts across the first four personas, and it is what the new resale line serves. The cards below profile each buyer with real Skyline clients, and Figure 6.0 places them by opportunity volume and project and account value.'),
  spacer(160),

  personaCard('1 - The Corporate Marketing / Event Manager', CORE_BLUE, [
    ['Profile', 'The core buyer: a marketing or event manager at a mid-market company who owns the trade-show budget. Skyline\'s portfolio is full of them across very different industries - Oosto (AI computer-vision software), eLend (fintech), Diality (medical device), Vital Tears (health), Inicio (apparel), Onyx. Vertical-diverse, united by one need: a booth that performs and a partner who runs the whole show.'],
    ['Pain Points', 'Internal pressure to prove ROI; coordinating a fabricator, a printer, freight, and labor; a slow concept-and-quote cycle; and no clean way to measure what the booth actually returned.'],
    ['Decision Driver', 'A partner who is easy to find and trust, responds fast with a strong concept and a clear quote, and can show results - not just a structure.'],
    ['AI Opportunity', 'AI-search authority and reputation to be found and trusted; faster AI-assisted concept and quote; the AI-enabled booth to capture and prove leads.'],
    ['Technijian Hook', 'My SEO - found and trusted. My AI Lead Gen - capture the inquiry. My Dev - the AI-booth layer and faster quoting.'],
  ]),
  spacer(160),

  personaCard('2 - The Enterprise / Multi-Show Program Manager', CORE_ORANGE, [
    ['Profile', 'A larger organization running an ongoing, multi-show program with several active booths and heavy reliance on Skyline\'s storage and asset management - the "ten shows a year, four booths, trust us with the assets" client. Skyline already serves this tier: Panattoni (a global industrial developer), AEVEX Aerospace, and CEMCO (a national steel-framing manufacturer).'],
    ['Pain Points', 'Consistency across many shows and cities; asset logistics between events; proving ROI across an entire program; and managing more moving parts than a lean team can handle.'],
    ['Decision Driver', 'Reliability across the calendar, proactive coordination, and one partner who runs the whole program - now including the AI engagement layer on every booth.'],
    ['AI Opportunity', 'Re-book intelligence across the show calendar; the AI-enabled booth attached to every booth in the program; an ROI dashboard that proves the program\'s return to the C-suite.'],
    ['Technijian Hook', 'My AI - re-book intelligence and program measurement. My Dev - the AI-booth layer at scale across the program.'],
  ]),
  spacer(160),

  personaCard('3 - The First-Time / Occasional / Emerging Brand', TEAL, [
    ['Profile', 'A smaller or fast-growing brand doing its first or occasional show - exactly who "custom exhibits, without the custom price tag" speaks to. Caboo (sustainable CPG) and Inicio Apparel are portfolio examples, and Natural Products Expo West alone draws 3,200-plus mostly-emerging brands to Anaheim every March.'],
    ['Pain Points', 'Budget; inexperience; fear of looking small next to bigger booths; and no idea how to tell whether the show was worth it.'],
    ['Decision Driver', 'An approachable, findable partner with portable and rental options, clear pricing, and hand-holding through a first show.'],
    ['AI Opportunity', 'This is the demand-gen funnel: AI-search authority and reviews bring them in, capture-and-nurture guides the first-timer, and a starter AI-capture option finally proves the show worked.'],
    ['Technijian Hook', 'My SEO - the findable, trusted option. My AI Lead Gen - capture and nurture the first-timer.'],
  ]),
  spacer(160),

  personaCard('4 - The Experiential & Marketing-Agency Partner', CRITICAL, [
    ['Profile', 'Marketing-communications agencies and experiential producers that pair a campaign with a physical presence. Skyline has already institutionalized this channel: in 2024 it co-founded Echo Experiential with Echo Media Group, an alliance that joins award-winning marketing-comms with Skyline\'s design-build-and-manage to capture leads "from pre-show to post-show."'],
    ['Pain Points', 'On-deadline execution they can put their name behind; design collaboration; and, increasingly, clients asking for AI engagement and lead technology the agency cannot build itself.'],
    ['Decision Driver', 'Dependable white-label delivery and a partner that makes the agency look good - now able to offer the AI layer their clients are asking for.'],
    ['AI Opportunity', 'AI is the intelligence layer the Echo Experiential promise already implies - AEO, AI capture and enrichment, instant nurture, and an ROI dashboard - sold through the agency channel under its own brand.'],
    ['Technijian Hook', 'My Dev - the white-label AI-booth and capture layer. My SEO - the AEO and content that feed the campaign.'],
  ]),
  spacer(160),

  personaCard('5 - The Institutional & Cultural Exhibitor', PURPLE, [
    ['Profile', 'Museums, cultural institutions, and education or civic groups commissioning booths, pavilions, or traveling exhibits. The California Museum of Photography - a 60-foot backlit traveling exhibit Skyline built - is the archetype; procurement is committee- or grant-driven and mission-oriented.'],
    ['Pain Points', 'Tight, scrutinized budgets; proving visitor or member engagement to a board; and recurring or touring exhibits that should get easier each cycle but do not.'],
    ['Decision Driver', 'Design-led craft within a defined budget, a partner who handles everything from concept through storage, and a way to show the exhibit earned its keep.'],
    ['AI Opportunity', 'AEO and reputation to be found on a budget; the AI engagement layer to measure visitor interaction; a design memory that makes each touring stop or annual cycle faster than the last.'],
    ['Technijian Hook', 'My SEO - found and trusted on a budget. My Dev - the measurement layer and the design memory.'],
  ]),
  spacer(200),

  p('Figure 6.0 maps the five buyers by opportunity volume and project and account value - showing why the enterprise multi-show program is the highest-value repeat account, why emerging brands are the volume that feeds the funnel, and why the experiential and agency channel is the multiplier.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Skyline OC Buyer Matrix', 560, 1.50),
  diagramCaption('Figure 6.0 - The Skyline OC Buyer: Opportunity Volume vs. Project & Account Value'),
  spacer(200),
  subHeader('Cross-Persona Snapshot'),
  p('The five profiles buy differently, and one message reaches none of them. The snapshot below shows how each is found and what wins them, so the growth engine is tuned per buyer rather than blasted at all of them at once.'),
  buildTable(
    [
      { label: 'Persona', weight: 2.4 },
      { label: 'Typical Titles', weight: 2.9 },
      { label: 'What They Buy On', weight: 2.6 },
      { label: 'Where to Reach Them', weight: 3.0 },
    ],
    [
      [{ text: 'Corporate Marketing / Event Mgr', bold: true, color: CORE_BLUE }, 'Marketing Mgr or Director; Trade-Show / Event Manager; Field Marketing Lead', 'Findability, fast response, measurable ROI', 'Search & AI answers, LinkedIn, show exhibitor directories, referrals'],
      [{ text: 'Enterprise / Multi-Show Program', bold: true, color: CORE_ORANGE }, 'Trade-Show Program Mgr; Director of Events; Brand Experience Mgr', 'Reliability across the calendar, asset management, program-level ROI', 'Account relationship, re-book cadence, between-show asset reviews'],
      [{ text: 'First-Time / Emerging Brand', bold: true, color: TEAL }, 'Owner / Founder; marketing generalist; Operations Manager', 'Approachability, clear pricing, hand-holding on a first show', 'Google / AI search, reviews, rental & portable pages, Expo West-type shows'],
      [{ text: 'Experiential / Agency Partner', bold: true, color: CRITICAL }, 'Account or Creative Director; Producer; Head of Experiential', 'Integrated campaign + booth + lead capture they can white-label', 'The Echo Experiential channel, agency networks, partner outreach'],
      [{ text: 'Institutional / Cultural', bold: true, color: PURPLE }, 'Museum Curator; Events / Membership Director; civic or program lead', 'Design-led craft on a budget, proof of engagement', 'AEO + reviews, cultural & association networks, board / grant-cycle timing'],
    ],
  ),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('Skyline competes for SoCal booth projects against a defined set of exhibit houses: Greve Co. in Orange, Bowman Design Group, RCS Custom Exhibits across Anaheim and Los Angeles, Blazer Exhibits & Events, Expo Stand Services, Exhibits Studio, Muller Expo, Metro Exhibits, ProExhibits, and Absolute Exhibits in Tustin - plus the parent network\'s own retail centers. The pattern across all of them is the same opportunity: every one sells essentially the same thing - a physical booth plus design, logistics, and storage. None positions as the AI-enabled exhibit house that delivers, and resells, a managed lead-capture, engagement, follow-up, and measurement layer; and none is winning the AI-search citations for the Orange County, Anaheim, and Los Angeles booth queries. Skyline also starts from further ahead than a pure fabricator: through its 2024 Echo Experiential alliance with Echo Media Group, it already pairs campaigns and lead capture with the build - so the AI layer widens an existing lead rather than inventing one from scratch.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.4 },
      { label: 'Base', weight: 2.0 },
      { label: 'Signal', weight: 2.2 },
      { label: 'AI / Measurement Posture', weight: 3.0 },
    ],
    [
      ['Greve Co.', 'Orange, CA', 'Full-service custom manufacturing, ~23 yrs', 'No managed AI engagement layer'],
      ['Bowman Design Group', 'Orange County', 'Custom exhibits + branded environments', 'Design-led; no AI offer'],
      ['RCS Custom Exhibits', 'Anaheim + LA', 'Design/build/install for ACC + LACC', 'City-page SEO; no AI layer'],
      ['Blazer Exhibits & Events', 'Orange County', 'Custom exhibits "to help get leads"', 'Gestures at leads; no managed AI'],
      ['Expo Stand Services', 'Anaheim', 'Since 2008; full-service + storage', 'Strong city SEO; no AI layer'],
      ['Metro Exhibits', 'Multi-city (incl. Anaheim)', 'Full-service custom + rental + logistics', 'National footprint, content-forward'],
      ['ProExhibits', 'California', 'Custom + high-impact rentals + support', 'Content marketing; no managed AI'],
      ['Absolute / Exhibits Studio / Muller', 'Tustin / Anaheim', 'Custom + rental in-house fabrication', 'Mid digital; no AI engagement layer'],
      [{ text: 'Skyline Displays OC (today)', bold: true }, { text: 'Lake Forest', bold: true }, { text: '40 yrs, Skyline line, 45k sq ft', bold: true }, { text: 'Excellent work, dated site, no AI layer', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(200),
  subHeader('Scale & AI-Maturity Scorecard'),
  p('Reduced to the two things that decide whether a buyer finds, trusts, and chooses an exhibit house - how much fabrication scale and breadth stands behind it, and how mature its AI, engagement, and measurement posture is - the picture is clear. The national and parent-network players have scale; the SoCal independents cluster together on low AI maturity; and Skyline holds a credible, trusted local position while ceding the digital and AI ground entirely.'),
  buildTable(
    [
      { label: 'Player', weight: 2.8 },
      { label: 'Fabrication Scale', weight: 2.2, align: AlignmentType.CENTER },
      { label: 'AI / Measurement', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.6 },
    ],
    [
      ['Parent network retail centers (CMX)', { text: 'Very High', align: AlignmentType.CENTER }, { text: 'Med-High', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Setting the AI bar in-network'],
      ['Metro / ProExhibits', { text: 'High', align: AlignmentType.CENTER }, { text: 'Medium', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'National reach; content-forward'],
      ['RCS / Expo Stand / Greve', { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Low-Med', color: CRITICAL, align: AlignmentType.CENTER }, 'Solid local builders, manual engine'],
      ['Bowman / Blazer / Absolute', { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER }, 'Design-led, modest digital'],
      [{ text: 'Skyline Displays OC (today)', bold: true }, { text: 'Mid', align: AlignmentType.CENTER, bold: true }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER, bold: true }, { text: 'Trusted name, manual growth engine', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field on those two axes. Skyline sits low-left - a credible local scale with near-zero AI and measurement maturity. The move is straight up: keep the trusted, right-sized local position and add the institutional-grade AI engagement and measurement layer every rival is missing, landing in a corner no exhibit house in the market currently holds.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning - Fabrication Scale vs. AI & Measurement Maturity', 560, 1.50),
  diagramCaption('Figure 7.0 - Competitive Positioning: Fabrication Scale vs. AI & Measurement Maturity (representative players shown)'),
  spacer(160),
  calloutBox(
    'Where Skyline Wins - The White Space',
    [
      'The top of the map - a trusted local exhibit house running institutional-grade AI engagement and measurement - is empty. The national players have scale but no local managed-AI layer; the local players have neither.',
      'There is an honest opening even against bigger names: scale does not mean measurable. A trusted forty-year local partner that can capture leads, run an on-floor concierge, follow up instantly, and prove ROI beats a bigger booth that does none of that.',
      'Skyline already has the craft, the name, and the asset base. Adding the AI engagement layer - and reselling it - puts it where no direct rival sits, and makes it the more valuable dealer in a consolidating network.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 STRATEGIC MARKET DYNAMICS & PROCUREMENT ----------
docChildren.push(
  ...sectionHeader('Strategic Market Dynamics & the Trade-Show Procurement Calendar', TEAL, '08'),
  spacer(100),
  p('How a booth is actually bought is non-obvious, and it shapes every growth move. Unlike a walk-in service, an exhibit purchase is governed by a calendar: a company commits to a specific show, then works backward. Demand is lumpy and seasonal, clustered around the big SoCal and Las Vegas show seasons, and the buying window for any given show opens and closes on a schedule everyone in the category can see in advance. That predictability is an opportunity - it means Skyline can know who is about to buy before they raise a hand.'),
  spacer(120),
  subHeader('The Show Calendar Is the Procurement Clock'),
  p('Exhibitors lock their show schedule six to twelve months out. From there the booth decision follows: budget approval, partner shortlisting, the RFP, the award, production, and the show itself. Because the calendar is public - exhibitor registration for the Anaheim Convention Center, the Los Angeles Convention Center, and the major Las Vegas shows is published months ahead - an exhibit house that watches it can reach a committed exhibitor at exactly the moment the booth budget is live. Most local houses wait for the inbound RFP; the one that reaches out first, with relevance, gets the inside track.'),
  spacer(120),
  subHeader('The RFP Expects a Concept and a Rate Sheet'),
  p('When a serious exhibitor issues an RFP - typically six to eight months before the show - they expect more than a price. They want a design direction or rendering, a clear rate sheet for design, fabrication, graphics, I&D, drayage, and storage, and confidence the house can execute on the show deadline. Assembling that by hand is slow, and a slow response loses the bid to a faster house at the same quality. This is the single clearest place AI-assisted concept and quote drafting converts effort into won projects.'),
  spacer(120),
  subHeader('The Decision Is Speed, Trust, and Proof'),
  p('Three things decide the award: whether the buyer found and trusted the house in the first place (findability and reputation), how fast and complete the response was (speed), and - increasingly - whether the house can prove the booth will return more than it costs (measurable ROI). The first two are where Skyline is currently invisible; the third is the AI-enabled booth\'s entire reason to exist. Win all three and the re-book follows almost automatically, because switching a trusted exhibit partner is costly and risky for the buyer.'),
  spacer(140),
  buildTable(
    [
      { label: 'Procurement Stage', weight: 2.4 },
      { label: 'What Happens', weight: 4.0 },
      { label: 'Where Skyline Wins or Loses', weight: 3.6 },
    ],
    [
      ['Show commitment', 'The exhibitor registers for a specific show 6-12 months out; budget is set', 'Public exhibitor lists make this a targetable signal - reach them first'],
      ['Shortlist / discovery', 'The buyer searches, asks AI, and scans reviews to build a shortlist', 'Findability and reputation decide whether Skyline is even on the list'],
      ['RFP & design', 'A formal RFP requests a concept, a rendering, and a rate sheet', 'Speed and completeness of the concept-and-quote response win the bid'],
      ['Award & production', 'The exhibitor selects a house; design, build, graphics, and logistics begin', 'Reliability and the single-partner model reduce the buyer\'s risk'],
      ['Show & re-book', 'The booth shows; the question becomes whether to re-book next season', 'Proven ROI and proactive re-book outreach turn one project into a program'],
    ],
  ),
  spacer(160),
  calloutBox(
    'What the Calendar Means for the Engine',
    [
      'Be found before the RFP: AI-search authority and reputation put Skyline on the shortlist, and targeted outreach against public exhibitor lists reaches committed buyers while the budget is live.',
      'Respond faster than the house can today: AI-assisted concepts and rate-sheet quotes turn a multi-day scramble into a same-day, complete response that wins more bids at the same quality.',
      'Prove it to win the re-book: the AI-enabled booth measures the return, which is the most durable reason a buyer re-books - and the cheapest growth Skyline can earn.',
    ],
    TEAL
  ),
);

// ---------- 09 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '09'),
  spacer(100),
  p('For a forty-year exhibit house with named clients, glowing testimonials, and 45,000 square feet of asset management, the digital footprint materially under-represents the business - and it matters precisely when a buyer\'s first move is a search, an AI question, and a quick scan of reviews before they ever ask for a quote. The craft is real; the buyer-facing surface that signals it is a liability.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.4 },
      { label: 'Gap / Opportunity', weight: 4 },
    ],
    [
      ['skylineoc.com', 'A 1990s static-HTML site (.htm pages); no modern CMS, no AEO structure, no self-serve quote intake; the TLS certificate does not even match the domain', 'A modern, fast, AEO-structured site (or a strong landing page first) that converts the search into an inquiry and signals the quality of the work'],
      ['Reputation / reviews', 'Real, strong testimonials exist (named clients, museum work) but are scattered across the parent site, Alignable, and Yelp - thin where buyers look', 'Consolidate and grow Google Business Profile reviews; surface named-client proof; run review velocity so quality-of-work finally shows online'],
      ['AI-search visibility', 'Below the citation surface for "custom trade show booth Orange County," "Anaheim exhibit design," "AI-enabled booth"', 'Multi-Agent SEO + AEO targeting the exact booth queries - the Technijian-built capability sits here'],
      ['Social proof / content', 'Share-worthy builds and show-floor videos exist (a client\'s "videos shared for months") but are not systematically captured into content', 'Social before/after and build-time-lapse content that wins the next client - a strong fit for a visual business'],
      ['The booth-buying funnel', 'Relationship- and referral- and RFP-led; no capture-and-nurture for the 6-8-month cycle, no targeted outbound on exhibitor lists', 'Capture-and-nurture across the long cycle; targeted outreach to companies already registered to exhibit at upcoming shows'],
      ['40 years of design IP', 'Past designs, graphics, and client preferences live in files and in people\'s heads', 'A searchable design knowledge memory - reusable, faster to quote from, and protected through any succession'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the craft or the team - only making a trusted forty-year exhibit house visible and chosen where its buyers already look.',
      'AI-search visibility, consolidated reputation, the capture funnel, and the social content are compounding moves: each lifts the share of qualified inquiries Skyline receives and the share it converts.',
      'They are also the natural first ninety days - get found, capture the inbound, and grow the reputation - before any large build, so the entry phase pays back fast.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_BLUE }),
  p('Here is the gap made concrete. When a buyer asks an AI assistant the question below, this is the shape of the answer they get - illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Best custom trade-show booth company in Orange County?"', [
    'TODAY - the AI assistant answers with whichever exhibit houses have the strongest content and third-party signals it can read: it names a couple of the SoCal independents and a national player with city pages, and does NOT mention Skyline - even though Skyline has forty years of craft, named clients, and 45,000 square feet of asset management. Skyline is invisible at the exact moment the buyer is forming a shortlist.',
    'AFTER AEO - the same query returns Skyline as a cited option ("Skyline Displays of Orange County designs, builds, and manages custom and portable exhibits, with an AI-enabled booth option for lead capture and post-show follow-up..."), with the modernized site and consolidated reviews as the supporting evidence the assistant points to.',
  ], CORE_BLUE),
  p('(Illustrative of current AI-search behavior for this query class; the live result is captured as the Quick Win #1 baseline.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter Skyline is not cited, the assistants learn to answer "best trade-show booth company in Orange County" with someone else - and that default, once set in the training and retrieval data, is far harder and more expensive to dislodge than to claim now. The same window is open on the AI-enabled booth: no local rival is selling that layer yet, so the dealer who operationalizes and resells it first owns a differentiator the whole field is missing. The cost of waiting is not zero - it is a competitor becoming the default answer, and a high-margin resale line left on the table.'),
);

// ---------- 08 THE SILENT REVENUE LEAK ----------
docChildren.push(
  ...sectionHeader('The Silent Revenue Leak - Where Booths Walk Out', DARK_CHARCOAL, '10'),
  spacer(100),
  p('This section names the cost that never appears on a report, because it is the most expensive one to ignore. A forty-year exhibit house with named clients and 45,000 square feet of asset management should be holding more of its market than a manual growth engine can currently serve. The revenue lost to buyers who never found Skyline, to RFPs answered too slowly, to repeat clients who quietly drifted, and to the AI upsell that is never offered is not a rounding error - it is a silent leak that shows up only as inquiries that never came, projects that went to a more findable rival, and a high-margin service the company is leaving on the table.'),
  spacer(140),
  subHeader('The Buyers Who Never Found Skyline'),
  p('The first leak is invisible by definition: the marketing manager who searched "custom trade show booth Orange County," got an AI answer and a map pack that did not include Skyline, and called someone else. With a dated site and scattered reviews, a forty-year reputation simply does not show up where the buying now starts. Every one of those is a project lost not on craft but on findability - and AI-search authority and reputation close that leak directly, without changing a single thing about the work.'),
  spacer(60),
  p('The math runs in the right direction: in an under-served local market where no rival owns the AI-search citations, even a handful of additional projects a year - captured from buyers who would otherwise never have found Skyline - pays for the entire entry program many times over.'),
  spacer(120),
  subHeader('The Quotes That Went Out Too Slow - and the Upsell Never Offered'),
  p('The second leak is speed and scope. When a concept and a rate-sheet quote take a week to assemble by hand, the buyer who got a sharp answer in two days from a competitor has already moved on. And when the booth ships without a lead-capture, follow-up, and measurement layer, Skyline leaves a high-margin service - one the client increasingly expects - entirely unsold. AI-assisted concept and quote drafting closes the first; the AI-enabled booth resale line closes the second, turning every project into a chance to sell measurable results, not just a structure.'),
  spacer(120),
  subHeader('The Repeat Clients Who Quietly Drifted'),
  p('The most expensive vacancy in this business is the multi-show client who does not formally leave - they simply do not call about the next show, because no one was watching their calendar and no one proactively brought them the next idea. None of that is a craft failure; it is a memory and attention failure, and it is exactly what re-book intelligence and a searchable account memory protect against. Keeping a client Skyline already earned is a fraction of the cost of winning a new one.'),
  spacer(120),
  calloutBox(
    'Three Leaks, One Engine',
    [
      'Buyers who never found Skyline because it was invisible in search; quotes that went out too slow and an AI layer that was never offered; and repeat clients who drifted because no one watched the calendar. None is a craft failure - each is a findability, speed, or memory failure.',
      'These are exactly the failures the dual engine closes: AI-search authority and reputation, AI-assisted quoting plus the new AI-booth resale line, and re-book intelligence with an account memory.',
      'This is the highest-conviction place to start, because it converts buyers, projects, and clients the company already has within reach into revenue it is currently leaving on the table.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '11'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds - systems Technijian has actually built and operates. Then come the productized services Skyline would engage. Each is labeled for what it is, and each maps to a specific Skyline use case. Technijian has not built an AI-powered trade-show booth product for an exhibit house before; what it has built is the search, document, conversational, and knowledge AI that an AI-enabled booth is made of - and that is the honest claim.'),
  spacer(160),
  subHeader('Proven Builds - Systems Technijian Has Built'),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70 percent.',
    'This is how Skyline gets found: AI-search authority on the queries that matter - custom trade show booth Orange County, Anaheim exhibit design, AI-enabled trade show booth - so that Google AI, ChatGPT, and Perplexity surface Skyline as the credible local answer.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex documents for FINRA-registered broker-dealers, cutting response time from days to minutes with 60 to 80 percent less manual review.',
    'Pointed at Skyline\'s sales motion, the same approach drafts RFP responses, design briefs, and rate-sheet quotes in hours instead of days - so Skyline wins more of the projects it is invited to bid, without adding to the design team\'s load.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield - Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory - a conversational design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked, on-brand conversational design is exactly what the AI-enabled booth needs: a booth concierge that answers attendees, qualifies them, and books meetings on the floor - and a buyer-side site assistant - that stays on-message and discloses it is an assistant.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization\'s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'For Skyline this is forty years of design memory - past builds, graphics, client preferences, what won on which show floor - made searchable so the team quotes faster, reuses what worked, and protects the institutional knowledge through any succession.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI-Native Software Delivery (SDLC v7.0)',
    'Technijian builds custom software on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations three to five times faster than a traditional team.',
    'This is how the AI-enabled booth platform gets built quickly and affordably: the capture, concierge, nurture, and ROI-dashboard layer Skyline resells - plus the AI quote engine and the design memory - are delivered on a proven pipeline, not a from-scratch dev-shop timeline.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Skyline Would Engage'),
  capabilityBox(
    'My Dev - Custom Application Development',
    'My Dev is Technijian\'s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations around a client\'s actual process.',
    'This builds the working tools: the AI-enabled booth platform (lead capture, concierge, post-show nurture, ROI dashboard) that Skyline resells, the AI-assisted RFP and quote engine, and the design knowledge memory - owned and white-labeled by Skyline, not locked in a third-party app.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO - AI-Search Authority & Reputation',
    'My SEO is Technijian\'s search service: local search optimization, reputation management, answer-engine visibility, and content so a business is found and trusted where its buyers actually look.',
    'For Skyline it owns the AI-search citations on the booth-design queries, consolidates and grows the reviews that the work has already earned, and turns show-floor builds into before/after social content that wins the next client.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen - Capture, Nurture & Targeted Outbound',
    'My AI Lead Gen is Technijian\'s productized demand service - it captures and nurtures inbound inquiries and runs targeted, list-based outreach rather than a generic blast.',
    'For Skyline it catches and nurtures the inquiry across the 6-8-month booth-buying cycle, and runs targeted outreach to companies already registered to exhibit at upcoming Anaheim, Los Angeles, and Las Vegas shows - a ready-made, time-boxed target list.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable - Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across search, capture, quoting, and the booth layer: won\'t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model - our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only - final brand-voice pass on a concept narrative, compliance-sensitive answers, the deepest reasoning', { text: '~5-10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning - RFP and quote drafts, outreach personalization, summarization, lead scoring', { text: '~30-40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work - badge-scan classification, lead enrichment, tagging and enriching thousands of exhibitor records', { text: '~50-60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Skyline pays premium-model prices only for the small slice of work that warrants them - typically a 60-80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single concept-and-quote draft, for example, is assembled by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model - instead of one premium model doing all three at roughly triple the cost. This is the kind of AI-engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 12 UNDERSTANDING AI - FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI - A Field Guide for SKYOC Leadership', CORE_BLUE, '12'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype - just what AI is, where Skyline sits today, how to adopt it without risk, and what comparable businesses are already doing. The goal is that John, Grady, and the Skyline team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is - and Isn\'t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do - not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define - predictable and low-risk. For example, "draft a first concept narrative and rate-sheet quote from this RFP." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself - more flexible, and it needs human oversight. For example, "watch the exhibitor lists and flag who is worth reaching out to." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic\'s guidance on building AI systems) is to use the simplest thing that works. Skyline starts with simple automations that pay off in the first 90 days - faster quotes, found-in-search, captured inquiries - and adds autonomous agents only where the value is proven, which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Skyline Sits Today - The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run companies - including Skyline - sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Skyline Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'AI is appearing at the edges (the parent network\'s digital activations; an awareness of AI lead capture) but is not yet woven into Skyline\'s own growth or operations', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day - search authority, capture, quoting, the booth layer - with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and the booth resale line with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the business runs, sells, and competes', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Skyline is early but not behind - the craft is world-leading and the parent network is already moving on digital. This report is the plan to reach Operational - AI working in the growth engine and inside the booth - within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly - Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government\'s NIST AI Risk Management Framework gives leaders a simple mental model - Govern, Map, Measure, Manage. For a business that captures attendee data on the show floor, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything client-facing or that goes out under Skyline\'s name - AI drafts, a person approves the concept, the quote, and the follow-up'],
      ['Data leakage', 'Attendee badge and contact data pasted into public tools can escape', 'Private, governed AI deployments - attendee PII and client data never touch a public model; capture runs inside CCPA/CPRA, CAN-SPAM, and TCPA rules'],
      ['Compliance & accountability', 'Untracked AI tools create gaps - including an undisclosed booth chatbot', 'Every AI tool inventoried with owner, vendor, and data source; the on-floor concierge discloses it is an assistant (California SB 1001), led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Businesses Are Already Doing', { color: CORE_BLUE }),
  bullet('Experiential & exhibit marketing: exhibitors are moving to AI lead capture and instant post-show nurture because digital capture converts far better than a stack of paper cards left to go cold for a week.'),
  bullet('Local service businesses: multi-location operators are using AI-search optimization to become the cited answer when buyers ask AI tools "who is the best [trade] near me?" - capturing demand competitors never see.'),
  bullet('Project-and-proposal businesses: design-and-bid firms are turning multi-day proposal and quote assembly into a same-day, review-ready draft - responding to more RFPs with the same team.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Skyline\'s own numbers would be confirmed in discovery. Technijian\'s specific, measured results from prior builds appear in Section 11 (Capability Proof), and the growth engine that puts them to work is in Section 13.', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life - A Skyline Exhibit Consultant', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A consultant fields an RFP, hunts through old files for a comparable past build, re-keys booth dimensions and graphics specs, assembles a rate sheet by hand across design, fabrication, I&D, drayage, and storage, and sends a first concept days later - while a faster competitor has already answered. After the show, the captured cards sit in a pile until someone has time to follow up.',
    'WITH AI: The RFP lands and an AI assistant drafts a first concept narrative and a rate-sheet quote in minutes - pulling from a searchable memory of forty years of builds - which the consultant reviews and approves the same day. On the floor, the AI-enabled booth captures and enriches every lead and drafts the personalized follow-up instantly. The expertise is captured in a system, so the same standard holds across every consultant and survives a new hire or a succession.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner - vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but Skyline assembles, secures, and governs everything - and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire - with proven builds and CISSP-led security, plus a booth platform Skyline owns and resells', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 13 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Skyline OC\'s Growth Engine', CORE_BLUE, '13'),
  spacer(100),
  p('The engine runs three motions at once: get found and win the project (AI-search authority, reputation, targeted outbound, and faster RFP and quote drafting), sell the AI-enabled booth (the new resale line - lead capture, an on-floor concierge, instant post-show nurture, and an ROI dashboard), and keep and grow the account (re-book intelligence, a searchable design memory, social proof, and the AI layer attached across the client base). The first fills the funnel, the second is a brand-new high-margin revenue line, and the third protects and compounds the order book.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Skyline OC AI Growth Engine', 600, 1.607),
  diagramCaption('Figure 12.0 - The Engine: Get Found & Win, Sell the AI-Enabled Booth, and Keep & Grow'),
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
      ['Get Found & Win', 'AI-search authority (AEO)', 'Be cited by Google AI, ChatGPT, Perplexity for booth-design queries', 'AI-citation rate', 'My SEO'],
      ['Get Found & Win', 'Reputation & reviews', 'Consolidate and grow reviews; surface named-client proof', 'Review velocity', 'My SEO'],
      ['Get Found & Win', 'Targeted exhibitor-list outbound', 'Reach companies already registered to exhibit at upcoming shows', 'Qualified inquiries', 'My AI Lead Gen'],
      ['Get Found & Win', 'AI RFP & quote drafting', 'First concepts and rate-sheet quotes in hours, not days', 'Quote turnaround', 'My Dev'],
      ['Sell the AI Booth', 'AI lead capture + enrichment', 'Badge/card scan with enrichment - 3x the conversion of paper', 'Leads per booth', 'My Dev'],
      ['Sell the AI Booth', 'Booth concierge / chatbot', 'Answers attendees, qualifies, books meetings on the floor', 'Engagement lift', 'My Dev'],
      ['Sell the AI Booth', 'Post-show AI nurture', 'Instant personalized follow-up and CRM sync - leads stay warm', 'Lead-to-meeting', 'My AI'],
      ['Sell the AI Booth', 'ROI measurement dashboard', 'Engagement, dwell, leads, pipeline - prove the booth\'s return', 'Proven ROI', 'My AI'],
      ['Keep & Grow', 'Re-book intelligence', 'Watch each client\'s show calendar and re-book window', 'Re-book rate', 'My AI'],
      ['Keep & Grow', 'Design knowledge memory', 'Forty years of builds and graphics - searchable and reusable', 'Quote speed', 'My Dev'],
      ['Keep & Grow', 'Social before/after content', 'Turn show-floor builds into reels that win the next client', 'Content reach', 'My SEO'],
      ['Keep & Grow', 'AI-booth attach expansion', 'Add the AI layer to every booth across the client base', 'Attach rate', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI captures and enriches leads, answers attendees on the floor, drafts the follow-up, measures the booth, and drafts the concept and quote - consistently, and inside the privacy and anti-spam rules that govern attendee data.',
      'AI never replaces the designer\'s creative judgment, never sends outreach a person has not approved, and never makes a consent or legal call. The designer owns the craft; the client owns the data decision.',
      'The team is freed, not replaced: AI handles the findability, the capture, the follow-up, and the drafting, so the designers and sales team spend their time on the creative and the relationships that close projects.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 14 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '14'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on the highest near-term levers - AI-search authority, reputation, capture-and-nurture, and a strategy workshop - and expands into the AI-enabled booth platform, the AI quote engine, and the design memory only as the results prove out. The model below is built from public information and conservative assumptions, because Skyline\'s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 17 replace them with real baselines.'),
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
      ['AI-search citation on booth queries', 'Below the citation surface', 'Cited by Google AI, ChatGPT, Perplexity', 'Discoverability'],
      ['Inbound exhibit inquiries / month', 'Referral-dependent', 'Search + AEO + reputation pipeline', 'Lead flow'],
      ['RFP / concept / quote turnaround', 'Days; assembled by hand', 'Hours; AI-assisted drafting', 'Win rate'],
      ['Online reputation where buyers look', 'Scattered, thin', 'Consolidated, growing, surfaced', 'Trust'],
      ['Post-show follow-up (for Skyline\'s clients)', 'Manual; leads go cold', 'Instant AI nurture, CRM-synced', 'Client ROI'],
      ['AI-booth attach rate (new line)', 'None today', 'A managed AI layer on every booth', 'New revenue'],
      ['Repeat / re-book rate', 'Reactive', 'Triggered before the next-show window', 'Retention'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model - The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the highest-conviction lever - incremental booth projects won from buyers who find Skyline through AI-search and reputation and from faster RFP and quote turnaround. It deliberately does not count the much larger uncounted upside: the new AI-booth resale margin, the retention from re-book intelligence, or the enterprise-value lift. The figure is attributable project revenue; at a typical exhibit-house gross margin the conservative case still covers the entry, and the target and aggressive cases fund the Phase-2 build several times over.', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Conservative', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.1, align: AlignmentType.CENTER },
    ],
    [
      ['Incremental booth projects won / year', { text: '+3', align: AlignmentType.CENTER }, { text: '+7', align: AlignmentType.CENTER }, { text: '+12', align: AlignmentType.CENTER }],
      ['Avg revenue per won project (illustrative)', { text: '$18K', align: AlignmentType.CENTER }, { text: '$28K', align: AlignmentType.CENTER }, { text: '$38K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 attributable project revenue', bold: true }, { text: '$54K', bold: true, align: AlignmentType.CENTER }, { text: '$196K', bold: true, align: AlignmentType.CENTER }, { text: '$456K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI (vs. entry, on revenue)', bold: true, color: CORE_BLUE }, { text: '~1.7x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.1x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~14.3x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only - the easiest possible place to start. It does not count the new AI-booth resale margin (pure new revenue at an attach rate across the client base), the retention the re-book intelligence protects, the staff hours recovered from faster quoting, or the enterprise-value lift of being a differentiated dealer in a consolidating network. Average project value is illustrative and is replaced with Skyline\'s actual book in discovery. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  calloutBox('AI as a Managed Investment - Not a Leap of Faith', [
    'The reason most AI spending disappoints is not the technology - it is the lack of measurement. Industry research (McKinsey, State of AI 2025) finds roughly 88% of companies now use AI, but only about 39% see a real profit impact; the difference is discipline, not budget.',
    'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost - and if a pilot does not clear its cost at the gate, we stop and re-scope. Skyline carries the upside, not blind risk.',
  ], CORE_ORANGE),
  spacer(160),
  subHeader('The Entry Offer - The 90-Day AI Visibility Pilot', { color: CORE_BLUE }),
  p('Start with one clearly-scoped, fixed-price program - not an open-ended engagement. The pilot stands up Skyline\'s AI-search presence, consolidates and grows the reputation, and captures the inbound, and proves the lift before any larger build is discussed.'),
  calloutBox('The Pilot Bar - and Our Commitment', [
    'Success metric: within 90 days, Skyline is cited by at least one major AI assistant (ChatGPT, Perplexity, or Google AI) for a high-intent booth-design query in its market, AND the capture-and-nurture funnel is live and producing qualified inbound exhibit inquiries.',
    'Our commitment: the entry program is month-to-month after the initial term - no long lock-in. If the pilot has not moved the needle on the metric above by day 90, you are under no obligation to continue, and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
  ], CORE_ORANGE),
  spacer(160),
  subHeader('Service Investment Map - Start Small, Expand as It Proves Out'),
  buildTable(
    [
      { label: 'Service', weight: 3.0 },
      { label: 'Scope', weight: 3.4 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO - AI-Search Authority + Reputation (Tier 4)', 'Own AI-search citations on booth-design queries; consolidate and grow reviews; before/after social content', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen - Capture & Nurture (Starter)', 'Catch and nurture inbound across the 6-8-month cycle; targeted outbound on public exhibitor lists', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      ['My AI - Executive AI Workshop (one-time)', 'A half-day with John, Grady, and the creative and sales leads: the AI-booth product roadmap and the growth plan', { text: '-', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      [{ text: 'THE 90-DAY AI VISIBILITY PILOT - Phase 1 (start here)', bold: true }, { text: 'Recurring $2,250/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev - AI-Enabled Booth Platform (Phase 2 build)', 'The resale product: AI lead capture + enrichment, booth concierge, post-show nurture, ROI dashboard; plus the AI RFP/quote engine and design knowledge memory', { text: '-', align: AlignmentType.CENTER }, { text: '$48,000', align: AlignmentType.CENTER }],
      ['My Dev - Managed App Services (Phase 2)', 'Hosting, monitoring, per-show deployment, and iteration of the platform', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI - Fractional AI Advisor (Phase 2)', 'Program leadership, measurement governance, and the AI-booth go-to-market with Skyline\'s sales team', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE - Entry + Expansion', bold: true }, { text: 'Recurring $5,050/mo + build', bold: true }, { text: '', bold: true }, { text: '~$113,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $32,000 entry program - AI-search authority, reputation, capture-and-nurture, and the strategy workshop - that pays for itself on found-and-won projects, with no large build to begin.',
      'Expand into the full engine (the AI-enabled booth platform, the AI quote engine, the design memory, managed services, and the fractional AI advisor) only once the entry proves the lift. That one-time build then becomes a resale platform.',
      'Phase 3 is scale: roll the AI-booth layer across the whole client base at an attach rate, and carry the differentiation into the dealer\'s enterprise value within the consolidating Skyline network. Treat as upside, not Year-1 ask.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 15 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '15'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan: start with the low-commitment entry - get found and capture the inbound - then build and resell the AI-enabled booth, then hold and scale. Real gains - AI-search citations, a growing review base, captured inquiries - are visible inside the first ninety days, before the larger build; the platform and the scale are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Skyline OC 90-180-270 Day Roadmap', 600, 2.296),
  diagramCaption('Figure 14.0 - The Skyline OC Growth Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 - Get Found & Capture (Days 1-90)', { color: CORE_BLUE }),
  p('The low-commitment entry - get found on booth-design queries and capture the inbound, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 - AEO + Reputation', 'Launch Multi-Agent SEO + AEO targeting the queries that matter (custom trade show booth Orange County; Anaheim exhibit design; AI-enabled trade show booth). Claim and optimize the Google Business Profile, consolidate scattered reviews, and start review velocity so the work\'s reputation finally shows online.'],
      ['1.2 - Capture & Targeted Outbound', 'Stand up capture-and-nurture for the 6-8-month booth-buying cycle. Begin targeted outreach against the public exhibitor lists for the next Anaheim, Los Angeles, and Las Vegas shows - companies already committed to exhibit. Deliver the first month\'s qualified inquiries, with no custom build required.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 - Build the AI Booth (Days 91-180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift - stand up the AI-enabled booth platform Skyline resells, plus the internal AI quote engine and the design memory.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 - AI-Enabled Booth Platform', 'Build the resale product: AI lead capture and enrichment, an on-floor booth concierge (bot-disclosed), instant post-show nurture with CRM sync, and an ROI measurement dashboard. Pilot it on a live client booth and measure the lift to seed the first case study.'],
      ['2.2 - AI Quote Engine + Design Knowledge Memory', 'Stand up AI-assisted RFP, concept, and rate-sheet quote drafting so first concepts and quotes go out in hours. Index forty years of designs, graphics, and client preferences into a searchable memory the team quotes from and reuses.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 - Hold & Scale (Days 181-270)', { color: CORE_ORANGE }),
  p('Protect and compound the order book, then scale the AI line across the client base and into the dealer\'s enterprise value.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 - Repeat & Attach-Rate Growth', 'Turn on re-book intelligence that watches each client\'s show calendar and surfaces the next-show conversation before the window closes. Attach the AI-booth layer to repeat and multi-show clients, lifting the attach rate across the existing base.'],
      ['3.2 - Scale + Enterprise Value', 'Roll the AI-booth resale line across the client base and into agency channels. Deliver an ROI dashboard measured against the Section 17 baselines, and position the differentiated, AI-enabled book of business as enterprise value within the consolidating Skyline network.'],
    ],
  ),
);

// ---------- 16 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins - Start This Week', CORE_ORANGE, '16'),
  spacer(100),
  p('Five actions Skyline can take immediately - before any new Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 - Test AI-Search Visibility for Booth Queries',
    ['Type the queries a real buyer would type into ChatGPT, Perplexity, and Google AI: "best custom trade show booth company in Orange County," "trade show display rental near Anaheim Convention Center," "AI-enabled trade show booth." See whether Skyline is cited; capture a screenshot baseline. It costs nothing and immediately sizes the AEO opportunity.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 - Claim the Google Business Profile and Ask 10 Clients for a Review',
    ['Claim and complete the Google Business Profile, then text the last ten happy clients - the museum-exhibit client, the multi-show client, others - a direct link to leave a Google review. The work has earned glowing testimonials; this puts them where buyers actually look, and it starts the review velocity the program will scale.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 - Modernize the Homepage Message Above the Fold',
    ['Even before a full rebuild, refresh what a buyer sees first on skylineoc.com (or stand up a single modern landing page): the "custom exhibits, without the custom price tag" promise, two or three named-client proofs, a clear "request a design consultation" button, and the Lake Forest showroom. It is an afternoon of work and it stops the dated site from undercutting a forty-year reputation.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 - Pull the Exhibitor Lists for the Next Three SoCal Shows',
    ['Pick the next three shows that matter (Anaheim Convention Center, the Los Angeles Convention Center, and a Las Vegas show) and pull their public exhibitor directories. That is the seed target list for outbound - companies already committed to exhibit, who need exactly what Skyline builds.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 - Pilot AI Lead Capture at the Next Booth',
    ['At the next client booth, run a simple AI badge-scan and instant-follow-up test on one section of the floor and measure the lift against the usual card collection. It costs almost nothing, proves the AI-enabled booth concept on real ground, and becomes the first case study for the new resale line.'],
    CORE_BLUE),
);

// ---------- 17 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '17'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 14 and 15 are deliberately conservative estimates - a short discovery call replaces them with Skyline\'s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We\'d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Project mix & value', 'The split of portable/modular vs. custom vs. rental, and average project value by type', 'Calibrates the ROI math and the entry-program payback'],
      ['Inbound vs. referral vs. RFP', 'How inquiries arrive today, and the current win rate on RFPs', 'Sizes the findability and quote-speed levers directly'],
      ['Repeat-client share', 'What share of revenue is repeat / multi-show, and the current re-book rate', 'Sizes the retention and attach-rate opportunity'],
      ['Marketing & sales engine', 'Any current CRM, SEO, or ad spend, and who owns marketing today', 'Defines the workflow and the data handoff'],
      ['AI-booth appetite', 'Whether Skyline already resells any lead capture, at what margin, and willingness to white-label a managed AI layer', 'Confirms the size and shape of the new resale line'],
      ['Parent relationship', 'What a dealer can add as its own service vs. what must run through Skyline corporate (CMX, activations)', 'Bounds what the dealer-built AI layer can include'],
      ['Reputation baseline', 'Current Google Business Profile status, review count, and which named clients can be used publicly', 'Sizes the reputation lever and the social-proof content'],
      ['Quote turnaround today', 'Typical days from RFP to first concept and quote', 'Calibrates the AI-quote efficiency lever'],
      ['Owner horizon', 'Whether the goal is grow-and-hold, expand, or eventually transition the family business', 'Sets how hard to lean on the enterprise-value thesis'],
      ['IT & M365 footprint', 'What Skyline runs today for IT and Microsoft 365', 'The entry point for the broader Technijian managed-services relationship'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting - the Quick Wins and the Phase 1 entry proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Skyline\'s real numbers - not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 18 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '18'),
  spacer(100),
  p('The honest answers to the questions Skyline leadership is most likely asking right now.'),
  spacer(140),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already have a marketing partner - and the Echo Experiential alliance. Why add Technijian?', bold: true }, 'Keep them. Echo handles the campaign and the creative; Technijian adds the AI layer neither builds: AI-search authority (AEO), AI lead capture and instant nurture, the AI quote engine, and the white-label AI-enabled booth. We are the technology partner that makes the Echo Experiential "capture leads pre-show to post-show" promise scale and become measurable - alongside your partners, not over them.'],
      [{ text: 'Isn\'t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast - get found, capture the inquiry, draft the quote faster - not autonomous "agents" doing your designers\' job. We use the simplest tool that works, measure it, and only expand what earns its place. The booth-floor AI numbers are public industry context, not our guarantees - we label them that way.'],
      [{ text: 'Is our data - and our attendees\' data - safe?', bold: true }, 'Yes. Attendee badge and contact data never touches a public AI model; we deploy private, governed systems with human review on anything that goes out under Skyline\'s name, and capture runs inside the CCPA/CPRA, CAN-SPAM, and TCPA rules. The booth concierge discloses it is an assistant (California SB 1001). It is led by a CISSP-certified team.'],
      [{ text: 'We\'re a lean, family-owned team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite - to give your designers and sales team back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing what we draft. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn\'t work?', bold: true }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 14), month-to-month with no long lock-in. If it has not moved the needle by day 90, you are under no obligation to continue - and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry program is approximately $32K for Year 1 at published and estimated rates - no hidden fees, no large up-front build. The full engine, including the AI-enabled booth platform Skyline resells, is profiled in Section 14, but only after the pilot proves the lift.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 19 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '19'),
  spacer(100),
  p('Skyline already has the hard things: forty years of craft, a trusted family-owned name, named multi-show clients, 45,000 square feet of asset management, a Lake Forest showroom, and a place in the Skyline Exhibits network. What it has not yet done is add the AI-driven layer that decides who gets found, who responds fastest, and who can sell measurable results instead of just a structure - and that is where this program starts.'),
  p('The opportunity is concrete and runs on two engines. Grow Skyline\'s own book - get found in the AI answers and searches buyers read first, win more of the projects with faster concepts and quotes, and keep the repeat clients the company has earned. And stand up the AI-enabled booth as a new high-margin resale line no local rival offers. Both stay inside a plain boundary: AI serves the capture, the follow-up, and the drafting; the designer owns the craft and the client owns the data decision. The entry is small on purpose and pays for itself fast; the build comes second, once it proves the lift.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 17 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff - AEO authority, reputation, capture-and-nurture, and the strategy workshop - live inside 30 days of signature, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to get found, win faster, and sell the AI-enabled booth?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: `Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  ${PHONE}`, size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 20 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '20'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help right-sized operators compete at scale - with security and compliance built in, not bolted on. For Skyline, that means two engines on one show floor: a modern growth engine for the company\'s own book, and a white-label AI-enabled booth platform Skyline resells to its clients.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Skyline', weight: 5 }],
    [
      ['My Dev', 'Custom AI-native builds - the AI-enabled booth platform Skyline resells, the AI RFP and quote engine, and the design knowledge memory, owned and white-labeled by Skyline'],
      ['My SEO', 'AI-search authority (AEO), reputation and review management, and before/after social content for a visual business'],
      ['My AI Lead Gen', 'Capture and nurture across the long booth-buying cycle, plus targeted outreach on public exhibitor lists for upcoming shows'],
      ['My AI', 'AI strategy and builds - fractional AI advisor, ROI-measurement governance, and program leadership with the privacy and consent boundary throughout'],
      ['My Security', 'Cybersecurity and managed IT for the broader relationship - protecting the attendee data and the systems behind every AI workflow'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain - RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', PHONE],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix - Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and category intelligence gathered via public web research conducted June 2026. Company details (founding, locations, leadership, services, and clients) are drawn from public sources and Skyline\'s own listings and should be confirmed with Skyline before external use.', { italics: true }),
  spacer(120),
  p('1. Skyline Displays of Orange County - skyline.com dealer profile (about-us, portfolio, asset-management) and skylineoc.com. Founded 1985, family-owned; Lake Forest HQ since 1995; custom and portable exhibits, graphics, install and dismantle, rental program, and 45,000+ sq ft of storage and asset management; "custom exhibits, without the custom price tag."', { size: 20 }),
  p('2. Leadership and personnel - John Funk (President/Owner), Grady Funk (VP/COO), Dan Harves (CFO); RocketReach profile (John Funk, prior Vistage Worldwide experience); Exhibit City News (Carol Lim) and ExhibitorOnline (Ken Wolf). Confirm current ownership and roles with Skyline.', { size: 20 }),
  p('3. Customer voice - public testimonials via the Skyline OC portfolio and listings (a museum-exhibit client, a named flooring-brand client whose booth videos were "shared for months," and a multi-show client running 10+ shows a year with 4 active booths); Alignable, Yelp, and Yahoo Local listings.', { size: 20 }),
  p('4. Parent network - Skyline Exhibits: 45 years; serves 3,000+ brands annually in 35 countries; ~17 US authorized dealers, 9 resellers, 14 international partners, ~27 owned retail centers; acquired by Gemspring Capital (2020); consolidating top dealers (Skyline Bay Area 2023, Skyline New York, Skyline Pacific Northwest); Custom Modular Experience (CMX) and the 2D2A data-driven methodology; 10+ digital activations launched in two years.', { size: 20 }),
  p('5. SoCal competitors - Greve Co. (Orange), Bowman Design Group (OC), RCS Custom Exhibits (Anaheim/LA), Blazer Exhibits & Events (OC), Expo Stand Services (Anaheim, since 2008), Exhibits Studio (Anaheim), Muller Expo (Anaheim), Metro Exhibits (multi-city), ProExhibits (CA), Absolute Exhibits (Tustin).', { size: 20 }),
  p('6. Trade-show market and AI trends - US B2B trade shows $15.8B (2024) to $17.3B (2028), global toward ~$50B; 72% of B2B buyers prefer in-person; ~50% of event pros using AI in 2026 (up from ~25% in 2024); AI booth activations up to +45% engagement; AI badge/card scan >95% accuracy; interactive elements hold attendees 2-3x longer; digital lead capture ~3x the conversion of paper. Sources: tradeshowlabs.com, labexhibits.com, exhibitpotential.com, exhibitsnw.com, tradeshowpro.events, acedisplays.com.', { size: 20 }),
  p('7. Lead-capture and booth-engagement vendor landscape - Cvent iCapture, Captello, momencio, Swapcard, Wave Connect, EventDex, Zuddl. The white space is a managed, brand-trained AI layer sold by the exhibit house with the booth.', { size: 20 }),
  p('8. Exhibit RFP process - exhibitconcepts.com, exhibitus.com, absoluteexhibits.com, exoptions.com: booth RFPs typically issued 6-8 months pre-show, expecting design renderings and rate sheets.', { size: 20 }),
  p('9. Compliance boundary context - California CCPA/CPRA (consumer data), CAN-SPAM and TCPA (post-show outreach), and California SB 1001 (bot disclosure) as they apply to trade-show lead capture and on-floor chatbots.', { size: 20 }),
  p('10. Technijian capability proof - Multi-Agent SEO + AEO platform; AI Document Intelligence (FINRA broker-dealers, days to minutes); ScamShield multi-model LLM Council; Enterprise Knowledge & Memory (Weaviate + Obsidian). Productized services: My Dev, My SEO, My AI Lead Gen, My AI, My Security. My SEO published tiers; My AI / My Dev figures estimated, confirmed at quote.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Skyline-OC-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
