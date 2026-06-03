// Skyline Displays of Orange County (SKYOC) - AI Growth Plan: EXECUTIVE SUMMARY
// Hook artifact for the first-touch email to John Funk.
// Pulls from the full Skyline-OC-AI-Growth-Report; same brand tokens, helpers, and diagrams.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

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
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-03';
const PHONE = '949.379.8499';

const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

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
    heading: HeadingLevel.HEADING_1, keepNext: true,
    spacing: { before: 320, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
  });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [120, CONTENT_W - 120],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    borders: noBorders, margins: { top: 160, bottom: 160, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 40, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
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
    shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders,
    margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })],
  }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders,
      margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT,
        children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })],
    });
  }) }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows],
  });
}
function diagramImage(buf, altTitle, widthPx = 600, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) }, altText: { title: altTitle, description: altTitle, name: altTitle } })],
  });
}
function diagramCaption(text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
    children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] });
}
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })],
  });
}
function makeHeader() {
  return new Header({ children: [new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth Plan: Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
// BODY - (1) Cover + the opportunity (2) the engine (3) the program + CTA
// =====================================================================
const docChildren = [];

// ---------- PAGE 1 - COVER + THE OPPORTUNITY ----------
docChildren.push(
  colorBanner(CORE_BLUE, 100),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 200, height: 42 } })] }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'SKYLINE DISPLAYS OF ORANGE COUNTY', size: 32, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth Plan  -  Executive Summary', size: 28, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 180 }, children: [new TextRun({ text: 'Prepared by Technijian  -  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '1985', label: 'Founded - 40 Yrs Family-Owned', color: CORE_BLUE },
    { number: '45,000', label: 'Sq Ft of Client Booth Storage', color: CORE_ORANGE },
    { number: '$17.3B', label: 'US Trade-Show Market by 2028', color: TEAL },
    { number: '3x', label: 'Lead Conversion: Digital vs Paper', color: GOLD },
  ]),
  spacer(240),
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(100),
  p('Skyline Displays of Orange County is a forty-year, family-owned trade-show exhibit house and an authorized Skyline Exhibits dealer in Lake Forest - custom and portable exhibits, design, build, install, and 45,000 square feet of asset management, with a reputation the testimonials make plain. The craft is excellent. The growth gap is everywhere the craft is invisible, and two forces decide it.'),
  p('First, buyers now choose an exhibit house by search, by a question typed into ChatGPT or Google AI, and by a quick scan of reviews - and Skyline\'s own website is a 1990s static-HTML site so dated that search engines mis-summarize it. The company is hardest to find exactly where the buying starts. Second, the show floor itself is going AI fast: digital lead capture converts three times better than paper, AI booth activations lift engagement up to forty-five percent, and roughly half of all event professionals now use AI in their trade-show work. The parent Skyline network is already moving this way. No local competitor is.'),
  p('Skyline has already chosen this direction. In 2024 it co-founded Echo Experiential with Echo Media Group to pair marketing campaigns with the booth and capture leads "from pre-show to post-show." This plan is the AI that makes that promise scale and become measurable - it is the intelligence layer under a strategy Skyline has already committed to, not a foreign idea.'),
  p('The plan runs two engines on one show floor. Engine A grows Skyline\'s own book - get found and win the project, then keep and grow the account. Engine B is a new, high-margin resale line: the AI-enabled booth - lead capture, an on-floor concierge, instant post-show follow-up, and an ROI dashboard - that Skyline sells to its own clients, with Technijian as the white-label builder. There is an enterprise-value overlay, too: in a Skyline network that is consolidating under private equity and buying its strongest dealers, a differentiated, AI-enabled dealer is simply worth more.'),
  spacer(80),
  calloutBox(
    'The Boundary',
    [
      'AI captures and enriches leads, answers attendees on the floor, drafts the follow-up, measures the booth, and drafts the concept and quote - inside the privacy and anti-spam rules that govern attendee data.',
      'AI never replaces the designer\'s creative judgment, never sends outreach a person has not approved, and never makes a consent or legal call. The designer owns the craft; the client owns the data decision.',
    ],
    DARK_CHARCOAL
  ),
  pageBreak(),
);

// ---------- PAGE 2 - THE ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Skyline\'s Growth Engine', CORE_BLUE),
  spacer(100),
  p('The engine runs three motions at once. The first gets Skyline found and wins the project - cited in the AI answers buyers now read first, with faster concepts and quotes. The second is a brand-new revenue line: the AI-enabled booth Skyline resells to its clients. The third keeps and grows the account, watching each repeat client\'s show calendar and attaching the AI layer to every booth.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Skyline OC AI Growth Engine', 600, 1.607),
  diagramCaption('The Engine: Get Found & Win, Sell the AI-Enabled Booth, and Keep & Grow'),
  spacer(80),
  calloutBox('Get Found & Win the Project',
    ['Own AI-search citations on the queries buyers type - custom trade show booth Orange County, Anaheim exhibit design, AI-enabled booth. Consolidate and grow the reviews the work has earned. Reach companies already registered to exhibit at upcoming shows, and draft first concepts and rate-sheet quotes in hours instead of days.'],
    CORE_BLUE),
  spacer(60),
  calloutBox('Sell the AI-Enabled Booth (New Resale Line)',
    ['A managed layer sold with every booth: AI lead capture and enrichment (3x the conversion of paper), an on-floor booth concierge that qualifies and books meetings, instant post-show nurture with CRM sync, and an ROI dashboard that finally proves what the booth returned. A high-margin service no local rival offers - built white-label by Technijian.'],
    CORE_ORANGE),
  spacer(60),
  calloutBox('Keep & Grow the Account',
    ['Watch each repeat and multi-show client\'s show calendar and surface the next-show conversation before the window closes. Make forty years of designs and graphics searchable so the team quotes faster. Attach the AI layer to every booth across the client base.'],
    TEAL),
  pageBreak(),
);

// ---------- PAGE 3 - THE PROGRAM + NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('The Program - Start Small, Expand as It Proves Out', CORE_ORANGE),
  spacer(100),
  p('The program leads with a small, low-commitment entry that pays for itself on the highest near-term levers - getting found, growing reputation, and capturing the inbound - with no large build to begin. The AI-enabled booth platform, the AI quote engine, and the design memory come second, once the entry proves the lift.'),
  spacer(120),
  buildTable(
    [
      { label: 'Service', weight: 3.2 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO - AI-Search Authority + Reputation', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen - Capture & Nurture (Starter)', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      ['My AI - Executive Workshop (one-time)', { text: '-', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM - Phase 1 (start here)', bold: true }, { text: '$2,250/mo + workshop', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  buildTable(
    [
      { label: 'Y1 Lever (Estimated, Conservative)', weight: 3.4 },
      { label: 'Conservative', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Target', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 1.6, align: AlignmentType.CENTER },
    ],
    [
      ['Incremental booth projects won / year', { text: '+3', align: AlignmentType.CENTER }, { text: '+7', align: AlignmentType.CENTER }, { text: '+12', align: AlignmentType.CENTER }],
      ['Avg revenue per won project (illustrative)', { text: '$18K', align: AlignmentType.CENTER }, { text: '$28K', align: AlignmentType.CENTER }, { text: '$38K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 attributable project revenue', bold: true }, { text: '$54K', bold: true, align: AlignmentType.CENTER }, { text: '$196K', bold: true, align: AlignmentType.CENTER }, { text: '$456K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI vs. $32K entry', bold: true, color: CORE_BLUE }, { text: '~1.7x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.1x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~14.3x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('All figures are estimated and conservative; the full plan walks through every assumption and calibrates after a short discovery call. The ratio is modeled on incremental project revenue alone - it does not count the new AI-booth resale margin, the retention the re-book intelligence protects, or the enterprise-value lift. The expansion build (the AI-enabled booth platform, the AI quote engine, the design memory, and the fractional AI advisor) adds further gains the entry ratio does not count.', { italics: true, size: 18 }),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Skyline OC 90-180-270 Day Roadmap', 600, 2.296),
  diagramCaption('90 / 180 / 270-Day Roadmap'),
  spacer(120),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Next Step - 30 Minutes', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A short discovery call to confirm scope and calibrate the plan against Skyline\'s actual numbers.', size: 20, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Ravi Jain, Technijian  |  RJain@technijian.com  |  ${PHONE}`, size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

const OUT_PATH = path.join(__dirname, 'Skyline-OC-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`Summary DOCX written: ${OUT_PATH}`);
  console.log(`Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
