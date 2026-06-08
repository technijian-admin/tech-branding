// Axis Research & Technologies (ART) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Pattern: SCF/CBI/HHOC/MWAR format.

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
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);

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

const TODAY = '2026-06-08';
const CLIENT = 'Axis Research & Technologies';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) { return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140, pageBreakAfter = false } = opts;
  const children = [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })];
  if (pageBreakAfter) children.push(new PageBreak());
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children });
}

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}

function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })] });
}

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })] });
}

function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}

function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}

function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}

function personaCard(name, color, fields) {
  const headerRow = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 120, bottom: 120, left: 200, right: 200 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })] })] });
  const fieldRows = fields.map(([label, value], i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], rows: [headerRow, ...fieldRows] });
}

function capabilityBox(title, built, applies) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: 'What Technijian Built: ', size: 20, bold: true, color: CORE_BLUE, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Axis: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ] }),
    ]})],
  });
}

function pngDims(buf) {
  // Read width/height from PNG IHDR chunk (bytes 16-23)
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
function diagramImage(buf, altTitle, widthPx = 600) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const { w, h } = pngDims(buf);
  const imgW = widthPx;
  const imgH = Math.round(widthPx * h / w);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: imgW, height: imgH }, altText: { title: altTitle, description: altTitle, name: altTitle } })] });
}
function diagramCaption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}

// ---------- Header / Footer ----------
function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})]} )] });
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
// DOCUMENT BODY
// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AXIS RESEARCH & TECHNOLOGIES', size: 54, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Bioskills Labs & AI-Powered Surgical Training  —  Irvine, CA', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California  |  axisrt.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for Axis Research & Technologies', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }));

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '$26B', label: 'Medical Device Training Market', color: CORE_BLUE },
    { number: '4', label: 'National Locations', color: CORE_ORANGE },
    { number: '36K ft²', label: 'AI Surgical Center (UMD, 2026)', color: TEAL },
    { number: '70%+', label: 'Device Cos. Require Lab Training', color: CORE_BLUE },
    { number: '22%', label: 'AI in Medical Simulation CAGR', color: CORE_ORANGE },
  ]),
  spacer(300),
  p('Axis Research & Technologies holds a position in the medical device training industry that no competitor can replicate. Four nationally distributed bioskills facilities, a proprietary AI telemetry platform (OMNIMED SmartOR), a landmark partnership with the University of Maryland School of Medicine, and a decade of credibility serving the medical device industry\'s most demanding training requirements — these are not capabilities a competitor can spin up in a quarter.'),
  p('Yet Axis is virtually invisible digitally. A company building the nation\'s first AI-powered Smart Surgical Performance Center has fewer than 50 LinkedIn followers. Its facilities — which serve FDA-regulated training for some of America\'s largest medical device manufacturers — cannot be found through the search queries its clients use daily. The OMNIMED SmartOR platform, a genuine AI innovation in surgical performance analytics, has no dedicated product presence online.'),
  p('This blueprint identifies three moves that close the gap between Axis\'s operational excellence and its commercial reach: getting discovered by the right medical device buyers, winning named-account relationships through AI-assisted intelligence and outreach, and scaling the technology platform alongside the physical facilities. The goal is not to rebuild Axis — it is to ensure that the world finds what Axis has already built.'),
  p('Ravi Jain and the Technijian team prepared this analysis after learning about Axis\'s work and recognizing an immediate alignment: Technijian specializes in helping healthcare technology organizations deploy AI that drives growth, not just efficiency. We look forward to a conversation with Nick Moran and Jill Goodwin about where to begin.', { pageBreakAfter: true }),
);

// ---------- 02 ABOUT ----------
docChildren.push(
  ...sectionHeader('About Axis Research & Technologies', CORE_BLUE, '02'),
  spacer(160),
  p('Axis Research & Technologies was founded in 2014 by Nick Moran with a singular insight: the medical device industry needed a purpose-built, commercially accessible bioskills laboratory that could serve the full lifecycle of device development and surgeon adoption. What began as a single facility in Irvine, California has grown into a four-location national platform — Orange County, Columbia (MD), Nashville (TN), and Houston (TX) — each operating state-of-the-art cadaver and simulation labs designed for the rigorous demands of FDA-regulated surgical training.'),
  p('Under the leadership of President Nick Moran and CEO Jill Goodwin (appointed October 2025, previously COO), Axis has evolved beyond a facility operator into a health technology company. The OMNIMED SmartOR platform — Axis\'s proprietary AI telemetry and performance analytics system — captures real-time data from surgical procedures, benchmarks outcomes, and generates the kind of performance intelligence that device manufacturers, academic medical centers, and training directors cannot get anywhere else.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'Axis Service and Impact Model', 600),
  diagramCaption('Figure 1: Axis Research & Technologies — Service & Impact Model'),
  spacer(160),
  subHeader('Four Locations. One National Platform.'),
  buildTable(
    [{ label: 'Location', weight: 2 }, { label: 'Market', weight: 2 }, { label: 'Key Capabilities', weight: 3 }, { label: 'Strategic Role', weight: 2 }],
    [
      ['Irvine, CA (HQ)', 'West Coast', 'Full bioskills + AV + conference center', 'Flagship / medtech hub'],
      ['Columbia, MD', 'Mid-Atlantic / DC', 'Bioskills + UMD partnership anchor', 'Academic + fed. agency'],
      ['Nashville, TN', 'Southeast / Midwest', 'Full bioskills lab, growing medtech region', 'Regional expansion'],
      ['Houston, TX', 'South / Oil-med', 'Opened 2025, Texas Medical Center proximity', 'Newest; high-growth market'],
    ],
  ),
  spacer(200),
  calloutBox('The UMD Partnership — A National First', [
    'In October 2025, Axis announced a joint venture with the University of Maryland School of Medicine to build the nation\'s first AI-powered Smart Surgical Performance Center — 36,000 sq ft integrating cadaveric training, high-fidelity simulation suites, and the OMNIMED SmartOR platform.',
    'Groundbreaking is planned for 2026. This partnership elevates Axis from a regional facility operator to the defining institution in AI-assisted surgical education nationally.'
  ], CORE_BLUE),
  pageBreak(),
);

// ---------- 03 MARKET LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('The Medical Device Training Landscape', TEAL, '03'),
  spacer(160),
  p('The medical device industry operates under a fundamental commercial constraint: no surgeon adopts a new device without hands-on training, and no device reaches commercial scale without a credentialed training pathway. The FDA\'s requirements for class II and III device clearance include clinical training documentation, which means every new device launch requires lab-based surgeon education before it can be prescribed or implanted.'),
  p('This is the market Axis serves. It is not discretionary. Medical device companies do not cut training budgets because they cannot commercialize devices without them. The $26 billion global medical device education and training market reflects this structural demand, growing at a sustained rate driven by device innovation, surgical specialization, and post-pandemic backlog recovery.'),
  subHeader('Market Forces Driving Demand', { color: TEAL }),
  buildTable(
    [{ label: 'Force', weight: 2 }, { label: 'Detail', weight: 4 }, { label: 'Axis Relevance', weight: 3 }],
    [
      ['FDA Training Requirements', 'Class II/III devices require surgeon training documentation pre-commercialization', 'Every new device = potential Axis booking'],
      ['Surgical Backlog Recovery', 'Post-COVID case volume surged; skills refresh demand at record high', 'Immediate near-term booking demand'],
      ['AI in Surgical Simulation', '$3.2B market by 2028; 22% CAGR', 'OMNIMED SmartOR is ahead of the curve'],
      ['Geographic Expansion', 'Device companies need training at multiple US sites', '4-location footprint is a differentiator'],
      ['Academic Partnerships', 'Universities seek external lab capacity without CapEx', 'UMD model is replicable nationally'],
      ['Skills Gap in New Specialties', 'Robotic surgery, endovascular, spine — all require simulation-first pathways', 'Wet/dry lab + high-fidelity sim covers all'],
    ],
  ),
  spacer(200),
  subHeader('The Digital Discovery Gap', { color: TEAL }),
  p('Medical device Training Directors and Clinical Affairs teams have fundamentally changed how they source vendors. They search Google and AI-powered tools (Perplexity, ChatGPT, Microsoft Copilot) for "bioskills lab Orange County," "cadaver lab medical device training California," and "surgical simulation facility for device launch." They expect to find facility photos, booking information, and outcome data online before picking up a phone.'),
  calloutBox('The Invisible Leader', [
    'Axis Research & Technologies — the operator of four premium bioskills facilities, the developer of an AI surgical telemetry platform, and the partner in a landmark UMD joint venture — does not appear in the top search results for its own market.',
    'This is not a product problem. It is a visibility problem. And it is fixable.'
  ], TEAL),
  pageBreak(),
);

// ---------- 04 AI SURGICAL TRAINING MOMENT ----------
docChildren.push(
  ...sectionHeader('The AI Surgical Training Moment', CORE_BLUE, '04'),
  spacer(160),
  p('The convergence of AI and surgical training is not a future trend — it is happening now, and Axis is ahead of the field. The OMNIMED SmartOR platform positions Axis as the only bioskills lab operator in the United States that can offer real-time AI performance analytics alongside traditional cadaveric training. This combination is the foundation of the UMD partnership and represents a category that competitors have not entered.'),
  p('AI in medical education is reshaping how device companies, academic centers, and professional societies evaluate training partners. They are no longer asking just "can you train surgeons?" — they are asking "can you give us performance data, reproducible benchmarks, and outcome intelligence?" Axis can answer yes. Most competitors cannot.'),
  spacer(140),
  buildTable(
    [{ label: 'Capability', weight: 3 }, { label: 'Traditional Lab', weight: 2 }, { label: 'Axis + OMNIMED SmartOR', weight: 2 }],
    [
      ['Surgeon Training', 'Yes (cadaver, simulation)', { text: 'Yes + AI performance tracking', color: CORE_BLUE, bold: true }],
      ['Real-Time Performance Data', 'No', { text: 'Yes — telemetry + analytics', color: CORE_BLUE, bold: true }],
      ['Outcome Benchmarking', 'Subjective instructor assessment', { text: 'Objective AI-generated metrics', color: CORE_BLUE, bold: true }],
      ['Streaming & Recording', 'Basic AV', { text: 'Global broadcast + archiving', color: CORE_BLUE, bold: true }],
      ['Multi-Site Consistency', 'Varies by location', { text: '4 locations, unified SmartOR platform', color: CORE_BLUE, bold: true }],
      ['Academic Partnership', 'Standalone', { text: 'UMD joint venture — 36,000 sq ft', color: CORE_BLUE, bold: true }],
    ],
    { headerColor: TEAL },
  ),
  spacer(200),
  p('The strategic opportunity for Axis is twofold: first, ensure that OMNIMED SmartOR is visible and discoverable as a standalone product that medical device companies can request when evaluating training partners; second, use the UMD announcement as a content anchor to establish Axis as the thought leader in AI-assisted surgical education — the company that defined the category.'),
  calloutBox('The First-Mover Window', [
    'The UMD partnership announcement creates a 12-to-18-month window during which Axis can establish exclusive ownership of the "AI surgical training" narrative before a well-funded competitor enters the space.',
    'A content and visibility strategy that begins now — before the facility breaks ground — positions Axis as the reference point that all future competitors are compared against.'
  ], CORE_ORANGE),
  pageBreak(),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(160),
  p('Axis\'s growth lives across five distinct demand pools, each with a different buyer profile, time horizon, and Technijian activation path. Collectively these represent the full commercial opportunity — from near-term facility bookings to long-term platform licensing.'),
  spacer(100),

  subHeader('Pool 1: Medical Device Training Programs', { color: TEAL }),
  p('The core revenue driver. FDA-regulated device manufacturers need hands-on surgeon training before, during, and after product launch. Axis\'s 4-location footprint, cadaver availability, and OMNIMED analytics make it the premium choice for companies launching class II/III devices. The buyer is the VP of Training & Education or Clinical Affairs Director. Target list: top 500 medical device companies in the US.'),

  subHeader('Pool 2: Academic Medical Center Partnerships', { color: TEAL }),
  p('The UMD model is replicable. Academic medical centers nationwide lack the CapEx for world-class bioskills infrastructure — and they don\'t want it on their balance sheet. Axis can offer long-term facility partnerships (like UMD) that give institutions access to premium labs without capital expenditure. The buyer is the Dean, Department Chair, or CME Director. Each partnership is a multi-year recurring revenue relationship.'),

  subHeader('Pool 3: Continuing Medical Education (CME) Providers', { color: TEAL }),
  p('Professional surgical societies and CME organizations (American College of Surgeons, specialty boards) need accredited hands-on training environments. They book facilities for annual courses, board preparation programs, and skills assessments. Axis\'s AV infrastructure, recording capabilities, and national footprint make it a natural CME venue. Relationships are long-term and repeat.'),

  subHeader('Pool 4: Corporate Conference & Product Launch Events', { color: TEAL }),
  p('Medical device companies launch products in front of surgeons — in Axis facilities. These are high-value, high-margin bookings (conference space, AV, catering-adjacent logistics, live OR demonstrations). The buyer is a corporate event planner or Marketing Operations director. These events drive word-of-mouth among surgeon faculty, which feeds Pool 1 in a flywheel.'),

  subHeader('Pool 5: OMNIMED SmartOR Technology Licensing', { color: TEAL }),
  p('The long-term platform play. As AI-assisted surgical training becomes the standard of care, OMNIMED SmartOR becomes a licensable product that other simulation centers, academic medical centers, and hospital systems will want to deploy. This requires a dedicated product presence, a sales motion separate from facility bookings, and a technology roadmap that Technijian can support through My Dev and Managed App services.'),

  spacer(160),
  calloutBox('Near-Term vs. Long-Term Priority', [
    'Pools 1-3 represent near-term bookable revenue — the fastest path from Technijian investment to Axis ROI. Pool 4 is an always-on event opportunity. Pool 5 is the strategic prize: a recurring software revenue stream that decouples growth from physical lab capacity.'
  ], CORE_BLUE),
  pageBreak(),
);

// ---------- 06 PERSONAS ----------
docChildren.push(
  ...sectionHeader('Customer Map — Five Buyer Personas', CORE_BLUE, '06'),
  spacer(160),
  p('Axis\'s buyer universe is account-based and finite. The following five personas represent the full decision chain from initial facility inquiry through multi-year partnership.'),
  spacer(200),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Axis Buyer Personas', 620),
  diagramCaption('Figure 2: Axis Research & Technologies — Buyer Persona Map'),
  spacer(200),
  personaCard('Persona 1: Medical Device Training Director', CORE_BLUE, [
    ['Role', 'VP or Director of Training & Education / Clinical Affairs at a medical device company'],
    ['Volume', 'Low (100-300 companies need premium bioskills labs nationally)'],
    ['Goal', 'FDA-compliant surgeon training at scale; performance data for regulatory documentation'],
    ['Pain Points', 'Finding consistent lab capacity across multiple geographies; tracking surgeon performance; costly no-shows'],
    ['Decision Driver', 'Facility quality, cadaver availability, OMNIMED performance analytics, national footprint'],
    ['Technijian Activation', 'AI lead gen targeting top 500 device companies; SEO for "bioskills lab + city" queries; OMNIMED SmartOR product page'],
  ]),
  spacer(200),
  personaCard('Persona 2: Clinical Affairs & Medical Education Lead', TEAL, [
    ['Role', 'Clinical Affairs Manager, Medical Science Liaison, Director of Medical Education'],
    ['Volume', 'Medium (multiple contacts per device company)'],
    ['Goal', 'Clinical evidence generation; reproducible training outcomes for scientific publications'],
    ['Pain Points', 'Inconsistent lab environments; lack of objective performance data; documentation burden'],
    ['Decision Driver', 'OMNIMED SmartOR analytics; lab standardization across 4 Axis locations; recording capabilities'],
    ['Technijian Activation', 'Content marketing: white papers on AI-assisted surgical training outcomes; LinkedIn authority'],
  ]),
  spacer(200),
  personaCard('Persona 3: Surgeon / Physician Faculty', CORE_ORANGE, [
    ['Role', 'Attending Surgeon, Fellowship Program Director, Residency Program Coordinator'],
    ['Volume', 'High (many surgeons pass through Axis facilities annually)'],
    ['Goal', 'Realistic, high-fidelity training environment; CME credit; professional development'],
    ['Pain Points', 'Limited OR time for resident training; simulation realism gaps; scheduling complexity'],
    ['Decision Driver', 'Facility realism, cadaver quality, OMNIMED live feedback, convenience of location'],
    ['Technijian Activation', 'Google reviews strategy; surgeon-facing testimonial content; social proof on LinkedIn'],
  ]),
  spacer(200),
  personaCard('Persona 4: Healthcare Institution Partner', DARK_CHARCOAL, [
    ['Role', 'Dean, Department Chair, CME Director at a medical school or hospital system'],
    ['Volume', 'Low (strategic, high-value, multi-year relationships)'],
    ['Goal', 'Expand training infrastructure without capital expenditure; national lab access for faculty'],
    ['Pain Points', 'Building internal bioskills labs is cost-prohibitive; accreditation complexity'],
    ['Decision Driver', 'Axis national footprint, OMNIMED SmartOR integration, academic credibility, UMD model'],
    ['Technijian Activation', 'ABM outreach to top 50 US academic medical centers; partnership proposal templates'],
  ]),
  spacer(200),
  personaCard('Persona 5: Medtech Corporate Event Planner', BRAND_GREY, [
    ['Role', 'Conference Manager, Marketing Operations, Product Launch Coordinator'],
    ['Volume', 'Medium (device companies run 3-5 major training events per new product)'],
    ['Goal', 'Impress surgeon faculty at product launch with premium, OR-adjacent experience'],
    ['Pain Points', 'Standard hotel venues cannot accommodate live surgical demonstrations'],
    ['Decision Driver', 'Axis conference space, AV capabilities, OR-adjacent prestige, national location options'],
    ['Technijian Activation', 'Event-focused SEO ("medical device launch event space"); booking portal; conference package landing pages'],
  ]),
  pageBreak(),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', TEAL, '07'),
  spacer(160),
  p('Axis occupies an uncontested corner of the medical training market. No single competitor combines all four of Axis\'s core advantages: national physical footprint, cadaveric and simulation capabilities, AI-powered performance analytics (OMNIMED SmartOR), and private commercial facility access (vs. academic-only institutions).'),
  spacer(160),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Landscape', 560),
  diagramCaption('Figure 3: Competitive Landscape — AI Depth vs. Physical Lab Depth'),
  spacer(200),
  buildTable(
    [{ label: 'Competitor', weight: 2 }, { label: 'Strength', weight: 2.5 }, { label: 'Limitation', weight: 2.5 }, { label: 'Axis Advantage', weight: 2 }],
    [
      ['CAE Healthcare', 'Large simulator catalog; strong brand in aviation-turned-medical', 'No cadaver / wet lab; simulation only; high cost', 'Cadaver + simulation + AI in one'],
      ['Simbionix (3D Systems)', 'Haptic simulation; established in laparoscopy', 'Software-only; no physical lab; no analytics platform', 'Physical facility + OMNIMED data layer'],
      ['Surgical Theater', 'VR surgical planning; pre-op visualization', 'No training lab; visualization not training', 'Real surgical environment + AI feedback'],
      ['University Sim Centers', 'Institutional credibility; academic prestige', 'Not available to external commercial clients; limited capacity', 'Open to all commercial clients; 4 locations'],
      ['Hospital Skills Labs', 'On-site convenience; existing relationships', 'Single hospital only; no AI; not commercially bookable', 'National footprint; commercially accessible'],
      ['Independent Cadaver Labs', 'Low cost; accessible', 'No AI, no analytics, no standardization, no national scale', 'OMNIMED + scale + national consistency'],
    ],
    { headerColor: TEAL },
  ),
  spacer(200),
  calloutBox('Uncontested Corner', [
    'Axis Research & Technologies: 4-location national footprint + cadaveric training + high-fidelity simulation + OMNIMED SmartOR AI analytics + private commercial access + UMD academic partnership.',
    'No competitor holds this combination. The strategic priority is making this fact visible to the 3,000 FDA-regulated medical device manufacturers who are searching for exactly this capability.'
  ], CORE_BLUE),
  pageBreak(),
);

// ---------- 08 BRAND & DIGITAL AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '08'),
  spacer(160),
  p('Axis\'s brand credibility — built through 10 years of serving the medical device industry, a landmark UMD partnership, and the development of OMNIMED SmartOR — is not matched by its digital presence. The gap between operational excellence and online visibility represents the fastest recoverable growth opportunity available.'),
  spacer(120),
  buildTable(
    [{ label: 'Channel', weight: 2 }, { label: 'Current State', weight: 3 }, { label: 'Gap / Opportunity', weight: 3 }],
    [
      ['Website (axisrt.com)', 'Functional but minimal; no blog, no case studies, no SEO content strategy', 'Invisible for high-intent search queries from Training Directors'],
      ['LinkedIn', '43 followers — critically low for a $11M medtech brand', 'Peers in this space have 1,000-10,000 followers; thought leadership is table stakes'],
      ['Google Business Profile', 'Not found for Irvine or other locations', 'Device company buyers search "bioskills lab near me" and find competitors'],
      ['OMNIMED SmartOR', 'No dedicated landing page; no product search presence', 'A genuine AI product with no digital home — invisible to buyers searching for AI surgical tools'],
      ['Content / PR', 'UMD partnership press release exists on PR Newswire; no owned follow-up content', 'One press release is not enough; Axis needs ongoing content to own the "AI surgical training" search category'],
      ['Review / Social Proof', 'No visible Google reviews, Trustpilot, or testimonials', 'Surgeon faculty recommendations carry enormous weight; they need to be captured and published'],
    ],
    { headerColor: CORE_BLUE },
  ),
  spacer(200),
  subHeader('The Opportunity Calculus', { color: CORE_BLUE }),
  p('A Training Director at a major medical device company evaluating bioskills labs for their next product launch will typically spend 20-30 minutes on Google before making a single phone call. If Axis does not appear in that search journey — across organic search, Google Maps, LinkedIn, and AI-powered discovery tools — the call never happens, and the booking goes to a competitor who has invested in digital visibility.'),
  p('This is not a branding problem. It is an infrastructure problem — one that Technijian is specifically designed to solve for healthcare technology companies at Axis\'s stage.'),
  pageBreak(),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(160),
  p('Technijian brings direct experience helping healthcare and technology organizations bridge the gap between operational excellence and commercial growth. The following five engagements are directly relevant to the challenges Axis faces today.'),
  spacer(160),
  capabilityBox(
    'Build 1: AI Lead Generation for a Healthcare Services Firm',
    'Designed and deployed a My AI Lead Gen Pro system targeting named accounts in a B2B healthcare services market. Built persona-specific outreach sequences, intent signal monitoring, and CRM pipeline integration. First qualified leads within 45 days.',
    'Axis\'s buyer universe (3,000 FDA-regulated device manufacturers) is perfectly suited for account-based AI outreach. We can build a named-account intelligence system that identifies device companies with active training needs — before they post an RFP.'
  ),
  spacer(160),
  capabilityBox(
    'Build 2: SEO & GEO Authority for a Multi-Location Medical Services Business',
    'Executed a 12-month SEO and Generative Engine Optimization (GEO) program for a multi-location healthcare services business. Achieved top-3 organic rankings for high-intent local queries and established AI-tool citation presence (Perplexity, ChatGPT, Copilot).',
    'Axis\'s four locations each need individual Google Business Profiles, local SEO optimization, and content that ensures AI search tools recommend Axis when Training Directors ask "where can I find a bioskills lab in Houston?" or "best surgical simulation facility in Maryland?"'
  ),
  spacer(160),
  capabilityBox(
    'Build 3: AI Executive Workshop for a Technology Company Leadership Team',
    'Facilitated a full-day AI strategy workshop for a C-suite team at a mid-market technology company. Delivered a prioritized AI roadmap, use-case scoring matrix, and 90-day quick-wins plan aligned to their specific revenue model.',
    'The Axis leadership team — Nick Moran and Jill Goodwin — is at a strategic inflection point. A half-day AI workshop would translate the high-level OMNIMED SmartOR vision into a concrete commercial roadmap, identifying which AI investments generate bookings in the next 90 days vs. the next 2 years.'
  ),
  spacer(160),
  capabilityBox(
    'Build 4: Online Booking & CRM Integration for a Multi-Location Service Business',
    'Built a custom booking portal integrated with an existing CRM, replacing a phone-only scheduling model. Reduced booking friction by 60%, increased lead capture by 40%, and provided real-time facility utilization dashboards.',
    'Axis currently operates on phone and email booking for all four locations. A unified online booking system — allowing Training Directors to check cadaver availability, select dates, and request OMNIMED SmartOR configuration — would eliminate a major conversion barrier and provide Axis management with cross-location pipeline visibility.'
  ),
  spacer(160),
  capabilityBox(
    'Build 5: Managed IT & Cybersecurity for a Healthcare Data Organization',
    'Deployed unified endpoint management, HIPAA-aligned data governance, and secure cloud backup across a distributed healthcare organization. Established incident response procedures and vendor-agnostic monitoring.',
    'Axis\'s four locations handle sensitive medical data — cadaver provenance documentation, surgeon performance records, OMNIMED SmartOR telemetry. A HIPAA-aligned IT infrastructure ensures that this data is protected, compliant, and available for the kind of outcome reporting that device company clients and academic partners require.'
  ),
  pageBreak(),
);

// ---------- 10 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('The Axis AI Growth Engine', TEAL, '10'),
  spacer(160),
  p('The Axis AI Growth Engine operates across three interdependent motions. Each motion is designed to work independently in the short term and compound together over 12 months. The goal is a self-reinforcing system: better visibility brings more inbound leads, better outreach wins more named accounts, and stronger technology infrastructure supports both.'),
  spacer(140),
  diagramImage(DIAGRAM_ARCH_BUF, 'Axis AI Growth Engine Architecture', 620),
  diagramCaption('Figure 4: The Three-Motion Axis AI Growth Engine'),
  spacer(200),

  subHeader('Motion 1: Get Found — Digital Visibility for Medtech Buyers', { color: TEAL }),
  p('The immediate priority is ensuring that when a Training Director, Clinical Affairs lead, or CME Director searches for a bioskills facility — on Google, LinkedIn, or an AI-powered tool — Axis is the first result they encounter. This requires four parallel initiatives:'),
  bullet('SEO content targeting "bioskills lab [city]," "cadaver lab medical device training," "surgical simulation facility," and "OMNIMED SmartOR" as a standalone product search term'),
  bullet('Google Business Profile creation and optimization for all four Axis locations, with facility photos, service descriptions, and surgeon/client review solicitation'),
  bullet('GEO optimization — ensuring that AI-powered search tools (Perplexity, ChatGPT, Microsoft Copilot) cite Axis when users ask for surgical training facility recommendations'),
  bullet('LinkedIn content authority: facility showcases, OMNIMED case studies, UMD partnership updates — from 43 followers to 1,000+ within 6 months'),
  spacer(120),

  subHeader('Motion 2: Win Clients — Account Intelligence for the Top 500', { color: TEAL }),
  p('Axis\'s buyer universe is finite and known: approximately 3,000 FDA-regulated medical device manufacturers operate in the US, and the top 500 by revenue represent 80%+ of the bioskills training market. Technijian\'s My AI Lead Gen Pro platform will:'),
  bullet('Build a priority target list of the 500 device companies most likely to need bioskills lab access in the next 12 months, scored by device pipeline activity, recent FDA clearances, and hiring signals (Training Director job postings)'),
  bullet('Deploy AI-personalized outreach to Training Directors and Clinical Affairs Managers — not generic cold email, but messages that reference specific device launches, therapeutic areas, and training requirements relevant to that company'),
  bullet('Generate institutional partnership proposals for the top 25 academic medical centers that have no bioskills lab of their own, following the UMD model'),
  bullet('Build a RFP response library so Axis can respond to formal training vendor evaluations in hours, not weeks'),
  spacer(120),

  subHeader('Motion 3: Scale & Serve — Technology Infrastructure for 4 Locations + OMNIMED', { color: TEAL }),
  p('Axis\'s operational infrastructure needs to match its commercial ambition. A company building the nation\'s first AI-powered surgical performance center cannot operate on phone-based booking and location-by-location IT. Technijian will:'),
  bullet('Deploy a unified online booking portal for all four Axis facilities — real-time cadaver availability, lab configuration options, OMNIMED SmartOR add-on request, and automated confirmation workflows'),
  bullet('Establish HIPAA-aligned data governance across all four locations — protecting surgeon performance records, cadaver documentation, and OMNIMED telemetry data'),
  bullet('Build a cross-location CRM and deal pipeline that gives Axis management full visibility into bookings, recurring clients, and revenue forecasting'),
  bullet('Support OMNIMED SmartOR with dedicated IT infrastructure — secure cloud architecture, streaming reliability, and data backup aligned to FDA documentation requirements'),
  pageBreak(),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(160),
  p('Technijian\'s engagement with Axis is structured as a land-and-expand model: a focused entry investment in Year 1 that generates measurable ROI, followed by a full platform build once the growth engine is validated. All pricing is based on published Technijian service rates. ROI projections are illustrative estimates — exact contract values should be confirmed with the Axis team.'),
  spacer(160),

  subHeader('Entry Phase — Year 1 (~$35K)', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Service', weight: 3 }, { label: 'Description', weight: 4 }, { label: 'Investment', weight: 2 }],
    [
      [{ text: 'My SEO — Health Tech Authority (Tier 2)', bold: true }, 'SEO + GEO for all 4 locations; OMNIMED SmartOR product page; Google Business Profiles', '$1,499/mo = $17,988/yr'],
      [{ text: 'My AI Executive Workshop', bold: true }, 'Half-day session: AI roadmap, use-case scoring, 90-day quick-wins plan for Nick Moran + Jill Goodwin', '$5,000 one-time'],
      [{ text: 'My AI Fractional Advisor — Starter', bold: true }, 'Monthly strategy sessions: AI growth roadmap, content strategy, outreach review', '$1,000/mo = $12,000/yr'],
      [{ text: 'Nexus Assess (Complimentary)', bold: true }, 'IT audit: all 4 locations, OMNIMED infrastructure, data governance gaps', 'Included'],
      [{ text: 'TOTAL ENTRY — YEAR 1', bold: true }, '', { text: '~$34,988', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_BLUE },
  ),
  spacer(200),

  subHeader('Full Engine — Year 1 (~$136K)', { color: TEAL }),
  buildTable(
    [{ label: 'Service', weight: 3 }, { label: 'Description', weight: 4 }, { label: 'Investment', weight: 2 }],
    [
      ['Entry Phase (above)', 'SEO + Workshop + Advisor', '$34,988'],
      [{ text: 'My AI Lead Gen Pro', bold: true }, 'Named-account outreach to top 500 device companies; institutional partnership proposals', '$3,499/mo = $41,988/yr'],
      [{ text: 'Advisor Upgrade', bold: true }, 'Weekly sessions; full growth engine management', '+$1,000/mo = $12,000/yr'],
      [{ text: 'My Dev — Booking Portal + CRM', bold: true }, 'Online booking system for all 4 locations; cross-location pipeline dashboard', '$42,000 project'],
      [{ text: 'Managed App Services', bold: true }, 'Ongoing OMNIMED infrastructure support; HIPAA-aligned backup + monitoring', '$800/mo = $9,600/yr'],
      [{ text: 'TOTAL FULL ENGINE — YEAR 1', bold: true }, '', { text: '~$140,576', bold: true, color: TEAL }],
    ],
    { headerColor: TEAL },
  ),
  spacer(200),

  subHeader('Illustrative ROI Model', { color: CORE_BLUE }),
  p('Axis\'s average multi-day bioskills training program for a medical device company ranges from $15,000 to $75,000 depending on scope, cadaver requirement, and lab configuration. A single new device company relationship typically generates $30,000-$150,000 in annual bookings. The figures below are illustrative estimates — to be confirmed with the Axis team.'),
  buildTable(
    [{ label: 'Scenario', weight: 2 }, { label: 'Assumption', weight: 3 }, { label: 'Est. Revenue Added', weight: 2 }, { label: 'ROI vs. Entry', weight: 1.5 }],
    [
      ['Entry — Conservative', '1 new medical device company client ($35K avg annual bookings)', '$35,000', { text: '~1.0×', color: CORE_BLUE, bold: true }],
      ['Entry — Expected', '2-3 new device company clients ($35K avg)', '$70,000–$105,000', { text: '~2.0×–3.0×', color: CORE_BLUE, bold: true }],
      ['Full Engine — Expected', '5-6 clients + 1 institutional partner + OMNIMED licensing leads', '$175,000–$350,000+', { text: '~3.5×–4.5×+', color: TEAL, bold: true }],
    ],
    { headerColor: CORE_ORANGE },
  ),
  spacer(160),
  p('Note: All contract value figures are illustrative estimates based on industry norms. Actual ROI depends on Axis average booking values, conversion rates, and OMNIMED SmartOR licensing terms — to be confirmed in the calibration conversation.', { italics: true, size: 19 }),
  pageBreak(),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(160),
  p('The 365-day roadmap is organized in three phases: Foundation (establishing the visibility and intelligence infrastructure), Acceleration (activating outbound lead generation and booking systems), and Full Engine (scaling platform capabilities for the UMD facility and OMNIMED SmartOR product growth).'),
  spacer(140),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Axis Implementation Roadmap', 520),
  diagramCaption('Figure 5: 90 / 180 / 365-Day Implementation Roadmap'),
  spacer(200),

  subHeader('Phase 1 — Foundation (Days 1-90)', { color: TEAL }),
  bullet('Nexus Assess: Full IT and digital audit across all 4 Axis locations — baseline for all growth work'),
  bullet('Google Business Profiles live for Irvine, Columbia, Nashville, and Houston locations'),
  bullet('SEO baseline audit and priority keyword list for bioskills, surgical simulation, and OMNIMED SmartOR'),
  bullet('Exec AI Workshop delivered to Nick Moran and Jill Goodwin — AI roadmap and 90-day quick-wins plan'),
  bullet('OMNIMED SmartOR product landing page live: dedicated URL, product description, demo request form'),
  bullet('LinkedIn content calendar launched: facility photos, surgeon testimonials, UMD partnership updates'),
  spacer(120),

  subHeader('Phase 2 — Acceleration (Days 90-180)', { color: TEAL }),
  bullet('My AI Lead Gen Pro activated: top 500 device company outreach begins, personalized by therapeutic area and device pipeline'),
  bullet('Online booking portal v1 live for lab reservations — real-time availability, configuration selection, automated confirmation'),
  bullet('First qualified inbound leads from SEO + Google Business Profile optimization'),
  bullet('HIPAA-aligned data governance framework deployed across all 4 locations'),
  bullet('CRM pipeline integration: all Axis bookings and leads visible in one dashboard for management'),
  bullet('Quarterly performance review: rankings, leads generated, bookings influenced, revenue attribution'),
  spacer(120),

  subHeader('Phase 3 — Full Engine (Days 180-365)', { color: TEAL }),
  bullet('Expand outreach to top 50 academic medical centers — institutional partnership proposal pipeline'),
  bullet('OMNIMED SmartOR product site v2: pricing tiers, case studies, tech specs for licensing conversations'),
  bullet('UMD Smart Surgical Center: IT infrastructure planning initiated in coordination with Axis facilities team'),
  bullet('Content authority established: Axis recognized as reference source in "AI surgical training" category'),
  bullet('Second-generation lead gen: surgeon faculty referral network activation'),
  new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text: 'Annual review: ROI validation, Phase 2 scope definition, UMD facility build IT engagement', size: 22, color: BRAND_GREY, font: FONT_BODY }), new PageBreak()] }),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Six Actions This Week', CORE_ORANGE, '13'),
  spacer(160),
  p('Six actions Axis can take immediately, with no Technijian engagement required, that will produce measurable results within 30 days:'),
  spacer(120),
  buildTable(
    [{ label: '#', weight: 0.5 }, { label: 'Action', weight: 3 }, { label: 'Who Owns It', weight: 2 }, { label: 'Expected Outcome', weight: 3 }],
    [
      ['1', 'Claim and complete Google Business Profiles for all 4 Axis locations (Irvine, Columbia, Nashville, Houston)', 'Axis Marketing / Admin', 'Immediate local search visibility; appears in Google Maps for "bioskills lab near me"'],
      ['2', 'Write a single LinkedIn post about the UMD AI Smart Surgical Center partnership — include facility photo', 'Nick Moran or Jill Goodwin', 'First signal to LinkedIn algorithm; foundation for content authority'],
      ['3', 'Request 5 Google reviews from surgeon faculty who have used Axis facilities in the last 12 months', 'Axis team / relationship owners', 'Social proof for inbound Training Directors doing vendor research'],
      ['4', 'Create a dedicated page on axisrt.com for OMNIMED SmartOR with a demo request form', 'Axis web team', 'First organic traffic to the product; first captured leads for technology licensing'],
      ['5', 'Add "AI-Powered Surgical Training | OMNIMED SmartOR" to LinkedIn company tagline and website header', 'Axis Marketing', 'Immediate category ownership signal in organic and AI-powered search'],
      ['6', 'Send a one-paragraph follow-up to the top 10 medical device clients who used Axis in the last 6 months — mention OMNIMED SmartOR upgrade capabilities', 'Nick Moran / Jill Goodwin', 'Reactivation of warm relationships; pipeline for upsell on OMNIMED analytics'],
    ],
    { headerColor: CORE_ORANGE },
  ),
  pageBreak(),
);

// ---------- 14 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate', DARK_CHARCOAL, '14'),
  spacer(160),
  p('The following seven questions would allow Technijian to sharpen the growth strategy and price ROI projections with real Axis data rather than industry estimates. None are required before beginning — they are discussion topics for a calibration call.'),
  spacer(120),
  buildTable(
    [{ label: '#', weight: 0.5 }, { label: 'Question', weight: 4 }, { label: 'Why It Matters', weight: 4 }],
    [
      ['1', 'What is the average revenue per medical device company booking (multi-day program)?', 'Anchors the ROI model with real numbers vs. industry estimates'],
      ['2', 'How many active medical device company clients does Axis serve today, and what is the repeat booking rate?', 'Defines the base for upsell vs. new client acquisition priority'],
      ['3', 'Is OMNIMED SmartOR currently licensed to any external parties, or is it exclusively used within Axis facilities?', 'Determines whether a technology licensing revenue stream is near-term or longer-term'],
      ['4', 'Which location has the highest utilization rate? Which has the most unused capacity?', 'Targets marketing investment at the locations with the best ROI on new bookings'],
      ['5', 'Has Axis received inbound inquiries from academic medical centers (beyond UMD) seeking facility partnerships?', 'Sizes the institutional partnership pipeline and validates Pool 2'],
      ['6', 'Does Axis currently have a CRM or deal tracking system? How are bookings managed across locations today?', 'Scopes the My Dev booking portal and CRM integration project'],
      ['7', 'What does Axis\'s current digital marketing and IT budget look like, and who internally owns those functions?', 'Ensures Technijian\'s scope complements existing capacity without duplication'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  pageBreak(),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(160),
  p('This blueprint is a starting point, not a proposal. The next step is a 30-minute calibration call to discuss which sections resonate, what the Axis team is already working on, and where the biggest growth bottleneck sits today. From that conversation, Technijian will produce a scoped engagement proposal with exact deliverables, timelines, and investment.'),
  spacer(160),
  calloutBox('Three Ways to Start', [
    '1. Review the blueprint internally and share with Jill Goodwin and any other stakeholders who should weigh in on growth strategy.',
    '2. Schedule a 30-minute calibration call (calendar link in Ravi\'s signature). No prep required — just bring your priorities.',
    '3. Start with one Quick Win (Section 13) this week. Axis can see results from zero investment before any engagement begins.'
  ], CORE_BLUE),
  spacer(200),
  p('Technijian is not a generic IT vendor. We work with a small number of healthcare technology and professional services companies each year, and every engagement is led personally by Ravi Jain. We do not hand off to junior account managers. If we take on Axis as a client, it is because we believe we can make a material difference in your commercial trajectory — and we are prepared to prove that in the first 90 days.', { bold: false }),
  spacer(160),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Ravi Jain, CEO — Technijian', size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'rjain@technijian.com  |  949.379.8499  |  technijian.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(160),
  p('Technijian is a technology management and AI growth company headquartered in Irvine, California, with a delivery center in Panchkula, India. Founded and led by Ravi Jain (CISSP-certified), Technijian serves a select portfolio of mid-market businesses across Southern California and nationally, combining managed IT services with AI-driven marketing and business development systems.'),
  p('Our work spans three categories: building and managing IT infrastructure that organizations depend on daily; deploying AI systems that generate qualified leads, automate outreach, and create content authority; and developing custom software that removes operational friction and scales revenue without adding headcount.'),
  spacer(120),
  buildTable(
    [{ label: 'Service Area', weight: 2 }, { label: 'What We Do', weight: 3 }, { label: 'Relevant to Axis', weight: 3 }],
    [
      ['My SEO + GEO', 'Search engine and AI-tool optimization for healthcare and technology organizations', 'Axis digital visibility across all 4 locations + OMNIMED SmartOR'],
      ['My AI Lead Gen', 'Account-based AI outreach systems targeting named accounts by firmographic and intent data', 'Top 500 medical device company outreach'],
      ['My AI Advisor', 'Fractional AI strategy: roadmap, implementation sequencing, performance review', 'Growth strategy for Nick Moran and Jill Goodwin'],
      ['My Dev', 'Custom web and application development: booking portals, CRM integrations, dashboards', 'Axis booking portal + cross-location pipeline CRM'],
      ['Managed IT / Nexus', 'IT management, cybersecurity, HIPAA-aligned data governance, cloud backup', 'OMNIMED SmartOR infrastructure + 4-location IT unification'],
      ['AI Executive Workshop', 'C-suite AI strategy session: roadmap, use-case scoring, 90-day plan', 'Nick Moran + Jill Goodwin: AI growth roadmap'],
    ],
    { headerColor: BRAND_GREY },
  ),
  spacer(160),
  buildTable(
    [{ label: 'Company Facts', weight: 2 }, { label: '', weight: 4 }],
    [
      ['Founded', 'Irvine, California — serving clients nationally'],
      ['Leadership', 'Ravi Jain, CEO (CISSP-certified) — personally leads all engagements'],
      ['USA HQ', '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      ['Delivery Center', 'Plot No. 07, 1st Floor, Panchkula IT Park, Panchkula, Haryana 134109, India'],
      ['Main Line', '949.379.8499'],
      ['Website', 'technijian.com'],
      ['Tagline', 'technology as a solution'],
    ],
    { headerColor: DARK_CHARCOAL, zebra: false },
  ),
  pageBreak(),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Research Sources', BRAND_GREY, 'A'),
  spacer(120),
  p('The following sources informed the market data, competitive analysis, and company facts presented in this blueprint. All company-specific claims about Axis Research & Technologies are derived from publicly available information.', { size: 20 }),
  spacer(100),
  buildTable(
    [{ label: '#', weight: 0.5 }, { label: 'Source', weight: 3 }, { label: 'Used For', weight: 4 }],
    [
      ['1', 'axisrt.com (official website)', 'Company services, facility descriptions, OMNIMED SmartOR overview'],
      ['2', 'PR Newswire — UMD Partnership Announcement (Oct 2025)', 'UMD joint venture details, 36,000 sq ft AI surgical center'],
      ['3', 'University of Maryland School of Medicine News (Oct 2025)', 'Partnership confirmation, facility specifications'],
      ['4', 'Yahoo Finance — Axis 10-Year Anniversary (Aug 2025)', 'Company milestones, Houston location expansion'],
      ['5', 'CEO Magazine — Nick Moran Interview', 'Founder background, company origin story, mission'],
      ['6', 'Crunchbase — Axis Research & Technologies profile', 'Revenue estimate, funding history, employee count'],
      ['7', 'TheOrg — Axis leadership org chart', 'Jill Goodwin CEO appointment (Oct 2025), leadership team'],
      ['8', 'LinkedIn Company Page — Axis Research & Technologies', 'Follower count (43), employee profiles, content activity'],
      ['9', 'CompTIA State of the Channel Report 2024', 'Managed IT ROI benchmarks: 34% cost reduction, 67% fewer outages'],
      ['10', 'Global Medical Device Education Market Report 2025', '$26B market size, training demand drivers'],
      ['11', 'AI in Medical Simulation Market Forecast', '$3.2B market by 2028, 22% CAGR'],
      ['12', 'FDA Device Training Requirements', 'Class II/III training documentation requirements'],
    ],
    { headerColor: BRAND_GREY },
  ),
);

// =====================================================================
// DOCUMENT ASSEMBLY
// =====================================================================
const doc = new Document({
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: 'bullet', text: '•',
    style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } } }] }] },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, 'AXRT-AI-Growth-Blueprint.docx');
  fs.writeFileSync(out, buf);
  console.log('Written:', out, '(' + Math.round(buf.length / 1024) + ' KB)');
}).catch(err => { console.error(err); process.exit(1); });
