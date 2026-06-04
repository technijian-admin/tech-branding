// JDH Pacific (JDH) — AI Growth & Integration Plan: EXECUTIVE SUMMARY (3 pages)
// Hook artifact for the first-touch warm-expansion email to Donald Hu / Daniel Evans.
// Pulls from the 38-page JDH-AI-Growth-Report; same brand tokens, helpers, and diagrams.
// Logo: AUTHENTIC assets/Technijian Logo 2.png (NOT the assets/logos/png fakes).

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

const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-02';

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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 36, bold: true, color, font: FONT_HEAD })] }),
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
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 150, height: 31 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Plan: Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 210, height: 44 } })] }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'JDH PACIFIC', size: 40, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth & Integration Plan  ·  Executive Summary', size: 26, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 180 }, children: [new TextRun({ text: 'Prepared by Technijian  ·  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '35+ yrs', label: 'Supplying Industrial OEMs', color: CORE_BLUE },
    { number: '4 Countries', label: 'US · Mexico · China · India', color: CORE_ORANGE },
    { number: 'NMSDC MBE', label: 'Minority-Owned Certified', color: TEAL },
    { number: '47 users', label: 'Already Managed by Technijian', color: GOLD },
  ]),
  spacer(240),
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(100),
  p('JDH Pacific owns the hard things in its category. Joint-venture foundries in China, a four-country supply chain across the US, Mexico, China, and India, an in-house quality department and machine shop, NMSDC minority-owned certification, and a thirty-five-year track record supplying cast, forged, and machined components to Fortune-500 OEMs — Parker-Hannifin, Emerson, Dover, Eaton, Xylem, Regal Rexnord, Paccar, and DSI. And it is already a Technijian managed-IT and hosting client across 47 users.'),
  p('The growth gap is the AI operating layer that turns those physical assets into speed and margin. A contract manufacturer wins or loses on three things a hand-run shop can no longer keep up with in 2026. The quote race, where the OEM awards the program to whoever quotes first and most completely. The supplier-qualification discipline, where PPAP, FAI, COA, and customer scorecards decide whether the next program comes JDH’s way. And the sophistication of the sourcing answer in a Section 301, reshoring, and nearshoring world — where JDH already has the multi-origin footprint most rivals lack, but operates it by hand.'),
  p('No competitor in JDH’s set markets or operates AI-speed quoting, AI tariff intelligence, answer-engine visibility, and a tariff-resilient multi-origin story together. Domestic foundries are capable but high-cost; Asia brokers are cheap but bare; the big precision players have scale but no minority-owned status or boutique responsiveness. JDH already owns the assets — adding the AI layer puts it in a corner none of them hold. And because Technijian already runs JDH’s servers, security, Microsoft 365, Sage ERP, and PC-DMIS quality environment, the build starts inside a system we already operate.'),
  spacer(80),
  calloutBox(
    'The Boundary — AI Drafts, A Person Signs',
    [
      'AI drafts the quote, classifies the part under its HTS code, assembles the PPAP / FAI / COA package, and watches the tariff — uniformly, with sources cited, inside the documentation rules the OEM and the regulator expect.',
      'AI never fabricates an inspection result, never invents a country-of-origin claim, and never sets a price in an antitrust-sensitive way. A JDH quality engineer signs the material cert and a licensed customs broker signs the customs entry — exactly what a Fortune-500 supplier-quality reviewer needs to see.',
    ],
    DARK_CHARCOAL
  ),
  spacer(360),
);

// ---------- PAGE 2 — THE ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms JDH’s Growth Engine', CORE_BLUE),
  spacer(100),
  p('The engine runs three motions at once. The first gets JDH found and specified by the OEM sourcing and design engineers who now ask Google AI, ChatGPT, and Perplexity for a supplier before they send an RFQ. The second wins the quote race by turning drawings, RFQs, and qualification packages into accurate quotes and certs in hours, not days. The third holds and grows the account by recalling thirty-five years of history, protecting quoted margin against tariff swings, and keeping every supplier scorecard green. Because Technijian already runs the Sage and PC-DMIS environment, the engine plugs into systems we operate today.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'The JDH AI Growth & Integration Engine', 600, 1.596),
  diagramCaption('The Engine: Get Found & Specified, Win the Quote Race, and Hold & Grow'),
  spacer(80),
  calloutBox('Get Found & Specified',
    ['Own answer-engine citations on the supplier-discovery queries that matter: offshore casting supplier, minority-owned casting and forging supplier, tariff-resilient China and Mexico sourcing partner. Publish category authority content on total landed cost by origin, substantial transformation, and MBE Tier-2 value. Lift the Donald and Daniel LinkedIn cadence on reshoring and tariff resilience — the topics OEM sourcing leaders read.'],
    CORE_BLUE),
  spacer(60),
  calloutBox('Win the Quote Race',
    ['Point the same AI document-intelligence engine Technijian built for FINRA broker-dealers at JDH’s RFQs and drawings: read the drawing, recall thirty-five years of quote history, and draft the quote and should-cost in hours. Assemble PPAP, FAI, and COA packages from real PC-DMIS inspection data. Add an AI tariff and landed-cost-by-origin dashboard. Every quote and cert is three-model checked and human-signed.'],
    CORE_ORANGE),
  spacer(60),
  calloutBox('Hold & Grow',
    ['Make thirty-five years of quotes, tooling, and parts instantly recallable, so a repeat part is re-quoted in minutes instead of rebuilt from scratch. Automate the COA-on-every-lot flow to keep OEM supplier scorecards green. Flag quoted jobs a duty or policy shift has eroded before the PO is accepted. Recover the engineering hours quoting and paperwork consume today, and point them at more quotes and better design-for-manufacturability.'],
    TEAL),
  spacer(360),
);

// ---------- PAGE 3 — THE PROGRAM + NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('The Program — Start Small, Expand as It Proves Out', CORE_ORANGE),
  spacer(100),
  p('The program leads with a small, low-commitment entry that pays for itself on the highest near-term levers — programs won faster and engineering hours recovered — with no large build to begin. The custom AI Quote & Quality-Doc engine, integrated with the Sage and PC-DMIS environment Technijian already runs, comes second, once the entry proves the lift. Rolling the engine across the China, India, and Mexico sites is the Phase-3 upside, not the Year-1 ask.'),
  spacer(120),
  buildTable(
    [
      { label: 'Entry Program — Phase 1', weight: 3.2 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO — Tier 3 + AI Search Optimization (answer-engine authority + content)', { text: '$1,200', align: AlignmentType.CENTER }, { text: '$14,400', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account ABM (Starter)', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      ['My AI — Readiness + Executive Workshop (one-time)', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — start here', bold: true }, { text: '$2,200/mo + workshop', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
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
      ['Incremental part programs won — gross-profit contribution', { text: '+$70K', align: AlignmentType.CENTER }, { text: '+$150K', align: AlignmentType.CENTER }, { text: '+$260K', align: AlignmentType.CENTER }],
      ['Engineering + quality hours recovered', { text: '+$20K', align: AlignmentType.CENTER }, { text: '+$40K', align: AlignmentType.CENTER }, { text: '+$70K', align: AlignmentType.CENTER }],
      ['Margin protected (tariff / landed-cost intelligence)', { text: '+$15K', align: AlignmentType.CENTER }, { text: '+$35K', align: AlignmentType.CENTER }, { text: '+$60K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 value (entry program)', bold: true }, { text: '+$105K', bold: true, align: AlignmentType.CENTER }, { text: '+$225K', bold: true, align: AlignmentType.CENTER }, { text: '+$390K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI vs. ~$32K entry', bold: true, color: CORE_BLUE }, { text: '~3.3x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~7.0x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~12.2x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('All figures are estimated and conservative; the full 38-page plan walks through every assumption and calibrates after a short discovery call. The custom AI Quote & Quality-Doc engine, integrated with Sage and PC-DMIS, adds further gains the entry ratio does not count — quote-velocity compounding, the supplier-diversity channel maturing, and the re-quote win-rate lift — and is the Phase-2 expansion, once the entry proves out.', { italics: true, size: 18 }),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'JDH 90-180-270 Day Roadmap', 600, 2.273),
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A short call to confirm scope and calibrate the plan against JDH’s actual quote book and named accounts.', size: 20, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 20, color: WHITE, font: FONT_BODY })] }),
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

const OUT_PATH = path.join(__dirname, 'JDH-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`Summary DOCX written: ${OUT_PATH}`);
  console.log(`Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
