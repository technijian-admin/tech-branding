// MBC Aquatic Sciences (MBCA) — AI Growth & Integration: EXECUTIVE SUMMARY (3 pages)
// Hook artifact for the first-touch email to Shane Beck.
// Pulls from the full MBC-AI-Growth-Report; same brand tokens, helpers, and diagrams.

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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration: Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 200, height: 42 } })] }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'MBC AQUATIC SCIENCES', size: 36, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy  ·  Executive Summary', size: 26, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 180 }, children: [new TextRun({ text: 'Prepared by Technijian for Shane Beck, President  ·  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '1969', label: 'Founded — CA eelgrass-science pioneer', color: CORE_BLUE },
    { number: '57', label: 'Years in Business (2026)', color: CORE_ORANGE },
    { number: '600+', label: 'Major Scientific Reports', color: TEAL },
    { number: '27 yrs', label: 'Avg Project-Mgmt Tenure', color: GOLD },
  ]),
  spacer(240),
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(100),
  p('MBC has the hard things: fifty-seven years of field-defining marine and environmental science, a founder still on staff, a senior bench whose depth no niche competitor can match, an in-house toxicity laboratory, and a reputation that wins work. The growth and continuity question is somewhere else, and three forces define it — each one a place where AI is the right lever for a firm whose value is its expertise.'),
  p('First, the memory is the moat, and it is aging. The firm’s value lives in the judgment of its most-tenured people, and it is almost entirely undocumented. Every retirement on a twenty-seven-year-average bench moves irreplaceable knowledge closer to the door. Second, the proposal is the bottleneck. A specialized firm wins on qualifications and response speed, and a lean senior team’s capacity to produce strong statements of qualifications quietly caps how much of the right work it even pursues. Third, the firm is hard to find. When an agency project manager or an AI assistant asks who does eelgrass restoration, Clean Water Act §316(b) studies, or marine toxicity testing in Southern California, a field-defining firm sits below the citation surface.'),
  p('None of the three is a science problem; each is a memory, speed, or visibility problem — exactly where a right-sized firm can deploy AI faster than a global competitor can, and turn its accumulated expertise into a durable, compounding asset.'),
  spacer(80),
  calloutBox(
    'The Science-First Boundary',
    [
      'AI drafts the proposal, indexes fifty-seven years of reports and data, tracks the permitting calendar, runs a quality check on a draft, and remembers every project — with sources cited.',
      'AI never makes a scientific determination, never signs or certifies a regulatory submittal, and never replaces a licensed professional’s judgment. The scientist owns the analysis, the signature, and the regulatory call.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- THE ENGINE (architecture diagram + 3 motions) ----------
docChildren.push(
  ...sectionHeader('How AI Transforms MBC’s Growth & Integration', CORE_BLUE),
  spacer(40),
  p('The engine runs three motions at once — the institutional brain on the left feeds the proposal engine and the pursuit funnel, with each motion detailed beneath the diagram.', { spaceAfter: 80 }),
  diagramImage(DIAGRAM_ARCH_BUF, 'The MBC AI Growth & Integration Engine', 580, 1.596),
  diagramCaption('The Engine: Capture the Memory, Win the Proposal Race, and Get Cited & Pursue'),
  spacer(60),
  calloutBox('Capture the Memory',
    ['Index fifty-seven years of reports, field data, toxicity records, taxonomic keys, and — through structured debriefs — the founder’s and senior scientists’ own judgment into a secure, queryable institutional brain. The next generation onboards on the firm’s accumulated expertise instead of reinventing it, and a key-person risk becomes a durable, transferable asset.'],
    CORE_BLUE),
  spacer(60),
  calloutBox('Win the Proposal Race',
    ['Draft statements of qualifications, scopes, key-personnel resumes, and reference packages from the institutional brain, in the agency’s format, in hours instead of days. A multi-model quality check flags gaps before the scientist’s final review. The firm pursues more of the right work — at the same win rate — without adding headcount.'],
    CORE_ORANGE),
  spacer(60),
  calloutBox('Get Cited & Pursue',
    ['Own the AI-search citations on eelgrass, §316(b), toxicity, and desalination queries, and publish the under-covered authority content that signals depth. Watch the named-account solicitation calendar — on-call cycles, capital-improvement and CEQA filings, NPDES renewals — and arrive at each pursuit with a dossier ready.'],
    TEAL),
);

// ---------- THE PROGRAM + NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('The Program — Start Small, Expand as It Proves Out', CORE_ORANGE),
  spacer(100),
  p('The program leads with a small, low-commitment entry that pays for itself on the highest near-term levers — AI-search authority, named-account pursuit intelligence, and a strategy workshop — with no large build to begin. The institutional-memory brain and the proposal engine come second, once the entry proves the lift. The figures below are estimated and conservative; the full plan walks through every assumption and calibrates after a short discovery call.'),
  spacer(120),
  buildTable(
    [
      { label: 'Entry Program — Phase 1', weight: 3.2 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My SEO — Niche AI-Search Authority + Reputation', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account Pursuit (Starter)', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      ['My AI — Executive AI Workshop (one-time)', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM (start here)', bold: true }, { text: '$2,250/mo + workshop', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
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
      ['Added revenue from faster, better proposals', { text: '+$55K', align: AlignmentType.CENTER }, { text: '+$135K', align: AlignmentType.CENTER }, { text: '+$275K', align: AlignmentType.CENTER }],
      ['On-call renewal value protected', { text: '+$40K', align: AlignmentType.CENTER }, { text: '+$70K', align: AlignmentType.CENTER }, { text: '+$110K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 value (entry program)', bold: true }, { text: '+$95K', bold: true, align: AlignmentType.CENTER }, { text: '+$205K', bold: true, align: AlignmentType.CENTER }, { text: '+$385K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI vs. $32K entry', bold: true, color: CORE_BLUE }, { text: '~3.0x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.4x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~12.0x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is modeled against the entry program only. The expansion build — the institutional-memory brain and the proposal engine — adds further gains the entry ratio does not count, including the succession and key-person risk it retires. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'MBC 90-180-270 Day Roadmap', 600, 2.273),
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A short discovery call to confirm scope and calibrate the plan against MBC’s actual numbers — and to talk candidly about the succession and scaling questions underneath it.', size: 20, color: WHITE, font: FONT_BODY })] }),
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

const OUT_PATH = path.join(__dirname, 'MBC-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`Summary DOCX written: ${OUT_PATH}`);
  console.log(`Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
