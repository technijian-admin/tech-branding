// Andersen Industries (ANI) — AI Growth & Integration Plan: EXECUTIVE SUMMARY (3 pages)
// Hook artifact for the first-touch warm-expansion email. Pulls from the full
// Andersen-Industries-AI-Growth-Report; same brand tokens, helpers, and diagrams.
// Pricing shows ONLY the ENTRY program (~$31K) — the full engine is reserved for the call.
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

const TODAY = '2026-06-15';

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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 34, bold: true, color, font: FONT_HEAD })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'ANDERSEN INDUSTRIES', size: 38, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'AI Growth & Integration Plan  ·  Executive Summary', size: 26, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: 'Prepared by Technijian  ·  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: 'Since 1966', label: '~60 Years Fabricating in CA', color: CORE_BLUE },
    { number: '108,000 ft²', label: 'Single-Source Facility', color: CORE_ORANGE },
    { number: 'Two Engines', label: 'Fabrication + WeldPro 360', color: TEAL },
    { number: 'Existing Client', label: 'Already with Technijian', color: GOLD },
  ]),
  spacer(220),
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(100),
  p('Andersen Industries owns the hard things in its category. A 108,000-square-foot single-source plant in Adelanto, the full cut-form-machine-weld-finish stack under one roof, sixty years of fabrication know-how, an OEM and contractor customer base, and its own national product line, WeldPro 360 — branded MIG welding boom arms and source-capture fume extraction. Two engines, one shop. And it is already a Technijian client.'),
  p('The growth gap is the AI operating layer that turns those assets into speed and found revenue. A contract fabricator wins or loses on three things a hand-run shop struggles to keep up with in 2026. The quote race, where the buyer awards the job to whoever returns a credible number first — and today an Andersen estimator reads each uploaded drawing and quotes by hand. Discoverability, where a sourcing engineer or a weld-cell manager increasingly asks an AI assistant for a shop or a product before they ever search — and Andersen is not yet the cited answer. And knowledge retention, where the skilled-trades shortage threatens to take sixty years of estimating and welding expertise into retirement.'),
  p('No competitor in Andersen’s region markets or operates AI-speed quoting, answer-engine authority, and modern product marketing together. The capable shops operate by hand; the cert-strong players are legacy on digital; the brokers are bare. Andersen already owns the plant and the trust — adding the AI layer puts it in a corner none of its rivals hold. And because Technijian already supports Andersen’s IT, the build starts inside an environment we already know.'),
  spacer(80),
  calloutBox(
    'The Boundary — AI Drafts, A Person Signs',
    [
      'AI reads the drawing and drafts the first-pass estimate, gets the shop found in AI search, and assembles the inspection and cert package — uniformly, with sources cited, inside the rules the customer expects.',
      'AI never fabricates an inspection result and never invents a material certification. An Andersen estimator signs the quote that goes to the customer, and a welder or QA lead signs the inspection — exactly what a quality-minded buyer needs to see.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- PAGE 2 — THE ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Andersen’s Growth Engine', CORE_BLUE),
  spacer(100),
  p('The engine runs three motions at once. The first gets Andersen found and specified by the sourcing engineers, contractors, and weld-cell managers who now ask Google AI, ChatGPT, and Perplexity for a shop or a product before they search. The second wins the quote and spec race by turning drawings and RFQs into accurate first-pass estimates in minutes, not hours, and turning a WeldPro inquiry into a guided, configured quote. The third holds and grows by recalling sixty years of job history, generating a steady stream of reviews, and capturing the veteran knowledge before it retires. Because Technijian already supports the environment, the engine plugs into systems we operate today.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Andersen AI Growth & Integration Engine', 600, 1.596),
  diagramCaption('The Engine: Get Found & Specified, Win the Quote & Spec Race, and Hold & Grow'),
  spacer(80),
  calloutBox('Get Found & Specified',
    ['Own answer-engine citations on the queries that matter for both engines: contract metal fabrication in the Inland Empire and High Desert, custom equipment enclosures, MIG welding boom arms, and weld fume extraction. Publish the under-covered capability and welding-fume-safety content, run a structured review-generation program, and market WeldPro 360 to a national audience for the first time.'],
    CORE_BLUE),
  spacer(60),
  calloutBox('Win the Quote & Spec Race',
    ['Point the same AI document-intelligence engine Technijian built for FINRA broker-dealers at Andersen’s RFQs and drawings: read the drawing, extract the cost-driving features, recall the closest prior job, and draft a first-pass estimate in minutes. Assemble inspection and cert packages toward ISO/AS9100-ready documentation. Turn WeldPro inquiries into configured quotes. Every estimate is three-model checked and an estimator signs it.'],
    CORE_ORANGE),
  spacer(60),
  calloutBox('Hold & Grow',
    ['Make sixty years of quotes, jobs, and tooling instantly recallable, so a repeat job is re-quoted in minutes instead of rebuilt from scratch. Turn finished jobs into a steady stream of recent five-star reviews. Capture the setups, weld procedures, and fixturing know-how of veteran staff before retirement. Recover the estimating hours quoting consumes today, and point them at more quotes and better design-for-manufacturability feedback.'],
    TEAL),
);

// ---------- PAGE 3 — THE PROGRAM + NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('The Program — Start Small, Expand as It Proves Out', CORE_ORANGE),
  spacer(100),
  p('The program leads with a small, low-commitment entry that pays for itself on the highest near-term levers — jobs won faster and found, WeldPro product sales, and estimating hours recovered — with no large build to begin. The custom AI Quote & Spec engine, integrated with the environment Technijian already supports, comes second, once the entry proves the lift. Productizing the WeldPro engine and the cert-doc automation is the Phase-3 upside, not the Year-1 ask.'),
  spacer(120),
  buildTable(
    [
      { label: 'Entry Program — The 90-Day AI Visibility & Quote-Velocity Pilot', weight: 3.2 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO — Tier 3 + AI Search Optimization (authority + content + reviews + WeldPro)', { text: '$1,200', align: AlignmentType.CENTER }, { text: '$14,400', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account + Product Capture (Starter)', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      ['My AI — Readiness + Executive Workshop (one-time)', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — start here', bold: true }, { text: '$2,200/mo + workshop', bold: true, align: AlignmentType.CENTER }, { text: '~$31,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
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
      ['Incremental contract jobs won — gross-profit contribution', { text: '+$55K', align: AlignmentType.CENTER }, { text: '+$120K', align: AlignmentType.CENTER }, { text: '+$220K', align: AlignmentType.CENTER }],
      ['WeldPro 360 product sales lift', { text: '+$20K', align: AlignmentType.CENTER }, { text: '+$45K', align: AlignmentType.CENTER }, { text: '+$80K', align: AlignmentType.CENTER }],
      ['Estimating + admin hours recovered', { text: '+$15K', align: AlignmentType.CENTER }, { text: '+$30K', align: AlignmentType.CENTER }, { text: '+$55K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 value (entry program)', bold: true }, { text: '+$90K', bold: true, align: AlignmentType.CENTER }, { text: '+$195K', bold: true, align: AlignmentType.CENTER }, { text: '+$355K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI vs. ~$31K entry', bold: true, color: CORE_BLUE }, { text: '~2.9x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.3x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~11.5x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('All figures are estimated and conservative; the full plan walks through every assumption and calibrates after a short discovery call. The custom AI Quote & Spec engine, integrated with the systems Technijian already supports, adds further gains the entry ratio does not count — quote-velocity compounding, the cert-doc engine opening new RFQs, and the WeldPro configurator maturing — and is the Phase-2 expansion, once the entry proves out.', { italics: true, size: 18 }),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Andersen 90-180-270 Day Roadmap', 600, 2.273),
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A short call to confirm scope and calibrate the plan against Andersen’s actual quote volume, named accounts, and WeldPro numbers.', size: 20, color: WHITE, font: FONT_BODY })] }),
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

const OUT_PATH = path.join(__dirname, 'Andersen-Industries-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`Summary DOCX written: ${OUT_PATH}`);
  console.log(`Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
