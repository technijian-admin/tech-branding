// Algro International (ALG) — AI Growth Plan: EXECUTIVE SUMMARY (3 pages)
// Hook artifact for the first-touch email to Deepak Bansal.
// Pulls from the 38-page Algro-AI-Growth-Report; same brand tokens, helpers, and diagrams.

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
const CRITICAL      = strip(tokens.color.status.critical.$value);
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

const TODAY = '2026-05-28';

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
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ] })] });
}

// =====================================================================
// BODY — 3 pages: (1) Cover + the opportunity (2) the engine (3) the program + CTA
// =====================================================================
const docChildren = [];

// ---------- PAGE 1 — COVER + THE OPPORTUNITY ----------
docChildren.push(
  colorBanner(CORE_BLUE, 100),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 200, height: 42 } })] }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'ALGRO INTERNATIONAL', size: 36, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth Plan  ·  Executive Summary', size: 28, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 180 }, children: [new TextRun({ text: 'Prepared by Technijian  ·  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '1969', label: 'Parent BIEL Founded', color: CORE_BLUE },
    { number: '11–50', label: 'US Team · Irvine / NJ / BC', color: CORE_ORANGE },
    { number: '18%', label: 'US Tariff after 2025 swing (10→50→18%)', color: TEAL },
    { number: '2028', label: 'FSMA 204 Enforcement', color: GOLD },
  ]),
  spacer(240),
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(100),
  p('Algro has a competitive product, a 57-year Bharat Industrial milling base behind it, three certified North American facilities, USDA NOP organic certification, and an existing Technijian managed-services and cybersecurity relationship. The growth gap is somewhere else. Premium-rice procurement in 2026 is governed by three forces a thirteen-person US team cannot keep up with by hand, and AI is the lever on each one.'),
  p('First, a documentation tax that runs into hundreds of buyer-requested artifacts per active account per year, including FSVP, HARPC, organic chain of custody, lot COAs, kosher and halal letters, sustainability scorecards, and per-SKU technical responses. Second, a tariff environment that swung from 10 percent to 50 percent to a settled 18 percent on Indian basmati inside one year and remains politically live. And third, a multi-origin compliance surface across India, Thailand, and US-domestic supply that the FDA Food Traceability Rule will codify in 2028 but that the major retailers are already requiring in supplier agreements today.'),
  p('The category at scale, LT Foods and KRBL and Riviana and Tilda and Olam, is uniformly behind on AI-enabled buyer-experience, AI-search visibility, and category thought leadership on exactly that triangle. A right-sized Irvine team can deploy AI faster than a multi-billion-dollar competitor can re-platform, and that is the opening.'),
  spacer(80),
  calloutBox(
    'The Compliance Boundary',
    [
      'AI auto-drafts, indexes, monitors, and remembers, with sources cited and inside the documentation rules each buyer audit applies.',
      'AI never makes the GFSI or food-safety determination, never approves a lot release, and never sets pricing in any antitrust-sensitive arrangement. A person owns the safety decision, the lot release, and the pricing.',
    ],
    DARK_CHARCOAL
  ),
  pageBreak(),
);

// ---------- PAGE 2 — THE ENGINE (architecture diagram + 3 motions) ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Algro’s Growth Engine', CORE_BLUE),
  spacer(100),
  p('The engine runs three motions at once. The first fills the top of the named-account funnel by getting Algro cited in the AI answers procurement researchers now read first. The second is the documentation core that decides which supplier responds to the next big RFP in days instead of weeks. The third protects the order book and reuses the same engine across the Simply So consumer brand and the BIEL parent’s 54-country export markets.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Algro AI Growth Engine', 600, 1.607),
  diagramCaption('The Engine: Get Cited & Discovered, Win the Documentation Race, and Hold & Expand'),
  spacer(80),
  calloutBox('Get Cited & Discovered',
    ['Own AI-search citations on procurement queries like USDA NOP organic basmati private-label supplier, FSMA-204-ready rice importer, and multi-origin organic chain of custody. Publish category authority content on tariffs and FSMA. Track the named-account universe across retail PL, foodservice, and industrial CPG.'],
    CORE_BLUE),
  spacer(60),
  calloutBox('Win the Documentation Race',
    ['Auto-draft RFP and RFI responses in the buyer’s exact format from an indexed library of FSVP plans, HARPC controls, lot COAs, kosher and halal letters, and prior responses. Run multi-origin chain of custody across India, Thailand, and US supply. Watch the tariff signal and propose origin-mix updates per buyer.'],
    CORE_ORANGE),
  spacer(60),
  calloutBox('Hold the Account & Expand',
    ['Keep every buyer conversation, sample shipment, audit finding, and recipe-development discussion in a searchable memory. Watch renewal triggers proactively. Reuse the same engine for the Simply So consumer brand and the BIEL parent export markets.'],
    TEAL),
  pageBreak(),
);

// ---------- PAGE 3 — THE PROGRAM + NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('The Program — Start Small, Expand as It Proves Out', CORE_ORANGE),
  spacer(100),
  p('The program leads with a small, low-commitment entry that pays for itself on the highest near-term levers, faster RFP responses and renewal protection, with no large build to begin. The expansion build comes second, once the entry proves the lift. The Simply So consumer brand and the BIEL export are reuses of the same engine, not a separate ask.'),
  spacer(120),
  buildTable(
    [
      { label: 'Service', weight: 3.2 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO — AI-Search Authority + Reputation', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account ABM (Starter)', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      ['My AI — Executive Workshop (one-time)', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — Phase 1 (start here)', bold: true }, { text: '$2,250/mo + workshop', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
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
      ['Added revenue from faster RFP response', { text: '+$40K', align: AlignmentType.CENTER }, { text: '+$90K', align: AlignmentType.CENTER }, { text: '+$160K', align: AlignmentType.CENTER }],
      ['Renewal value protected from churn', { text: '+$30K', align: AlignmentType.CENTER }, { text: '+$80K', align: AlignmentType.CENTER }, { text: '+$150K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 value (entry program)', bold: true }, { text: '+$70K', bold: true, align: AlignmentType.CENTER }, { text: '+$170K', bold: true, align: AlignmentType.CENTER }, { text: '+$310K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI vs. $32K entry', bold: true, color: CORE_BLUE }, { text: '~2.2x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~5.3x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~9.7x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('All figures are estimated and conservative; the full 38-page plan walks through every assumption and calibrates after a short discovery call. The expansion build (the buyer-documentation engine, multi-origin traceability layer, tariff signal monitor, and fractional AI advisor) adds further gains the entry ratio does not count.', { italics: true, size: 18 }),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Algro 90-180-270 Day Roadmap', 600, 2.296),
  diagramCaption('90 / 180 / 270-Day Roadmap'),
  spacer(120),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Next Step — 30 Minutes', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A short discovery call to confirm scope and calibrate the plan against Algro’s actual book.', size: 20, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 20, color: WHITE, font: FONT_BODY })] }),
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

const OUT_PATH = path.join(__dirname, 'Algro-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`Summary DOCX written: ${OUT_PATH}`);
  console.log(`Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
