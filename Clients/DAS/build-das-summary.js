// Danielian Associates (DAS) — AI Growth & Integration Strategy — EXECUTIVE SUMMARY
// Short (5-6pp) first-touch attachment. Reuses the full report's helpers, brand tokens,
// and the already-rendered architecture.png + timeline.png. Pricing shows ENTRY only.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
} = require('docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';

const LOGO_BUF = fs.readFileSync(path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value));
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => fs.existsSync(path.join(DIAGRAMS_DIR, n)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, n)) : null;
const DIAGRAM_ARCH_BUF = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');
const AR_ARCH = 2.384, AR_TIMELINE = 2.675;

const TODAY = '2026-06-01';
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function spacer(s = 200) { return new Paragraph({ spacing: { before: s, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 360, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 32, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiCell(number, label, color, w) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 40, bold: true, color, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}
function buildTable(columns, rows) {
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const o = typeof cell === 'string' ? { text: cell } : cell;
    const fill = o.fill || (ri % 2 === 1 ? OFF_WHITE : WHITE);
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: o.text || '', size: 20, color: o.color || BRAND_GREY, bold: o.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function diagramImage(buf, alt, widthPx, ar) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / ar) }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, h = 200) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun('')] })] })] })] }); }
function ctaBanner(lines) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 }, children: lines.map((ln, i) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: i < lines.length - 1 ? 90 : 0 }, children: [new TextRun({ text: ln.text, size: ln.size || 22, bold: ln.bold || false, color: WHITE, font: ln.bold ? FONT_HEAD : FONT_BODY })] })) })] })] });
}
function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
    new TextRun({ text: 'Technijian  |  Irvine, CA  |  949.379.8499  |  technijian.com  |  CONFIDENTIAL  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  ] })] });
}

const docChildren = [];

// ---- COVER (compact) ----
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(500),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 240, height: 50 } })] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'DANIELIAN ASSOCIATES', size: 44, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 30, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Executive Summary', size: 24, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
  spacer(260),
  kpiRow([
    { number: '1968', label: '57 years designing communities', color: CORE_BLUE },
    { number: '1M+', label: 'Units of housing delivered', color: CORE_ORANGE },
    { number: '775+', label: 'Design awards', color: TEAL },
    { number: '~2.6×', label: 'Modeled Y1 ROI vs. the entry', color: DARK_CHARCOAL },
  ]),
  spacer(260),
  p('Two fronts: win more developer pursuits — and run the studio with less non-design drag. AI sits under the relationships and the craft Danielian has built over 57 years; it does not design, and it does not replace the pursuit. This summary covers the opportunity, the engine, the program, and the entry. The full strategy is ready on request.', { align: AlignmentType.CENTER }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for Danielian Associates  |  Technijian  |  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  pageBreak(),
);

// ---- 1. THE OPPORTUNITY ----
docChildren.push(
  ...sectionHeader('The Opportunity', CORE_BLUE, '01'),
  spacer(120),
  p('Danielian wins work through deep developer relationships, a reputation for craft, and pursuits that land the next project. None of that changes. What this strategy adds is a layer underneath it, on two fronts at once:'),
  spacer(60),
  buildTable(
    [
      { label: '', weight: 1.4 },
      { label: 'Front 1 — Growth (win more pursuits)', weight: 3.6 },
      { label: 'Front 2 — Integration (run the studio)', weight: 3.6 },
    ],
    [
      [{ text: 'The win', bold: true }, 'Higher pursuit win rate; faster, sharper proposals; better account timing', 'Hours returned to billable design; 57 years of knowledge made searchable'],
      [{ text: 'Owner', bold: true }, 'Deborah Muro, Director of Business Development', 'Victor Alvarez-Duran, Chief Technology Manager'],
      [{ text: 'AI role', bold: true }, 'Account intelligence, proposal automation, authority content', 'Searchable archive, entitlement research, production automation'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why Now — The 2026 Window',
    [
      'Demand is being legislated up: SB 79 (transit upzoning, effective July 2026), SB 1211 (up to 8 ADUs per multifamily lot), and ADU streamlining push more work into Danielian’s exact product lines — multifamily, BTR, ADU, middle housing.',
      'The field is split: 53% of A&E firms now use AI and 94% of users are expanding it, yet only ~20% feel "highly prepared." The firm that turns pursuits around fastest captures disproportionate share.',
      'Danielian already runs on EOS, with a Chief Technology Manager and a Director of Business Development — the two seats this program reports into. It is a firm built to absorb this.',
    ],
    CORE_ORANGE
  ),
);

// ---- 2. THE ENGINE ----
docChildren.push(
  ...sectionHeader('The Engine', CORE_BLUE, '02'),
  spacer(120),
  p('Three motions, all aimed at the named developers Danielian already competes for — never a broad funnel. AI sits under the relationship layer and removes the non-design drag; the trust and the craft still win the work.'),
  spacer(60),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Danielian AI Growth + Integration Engine', 600, AR_ARCH),
  diagramCaption('Inbound authority · Outbound pursuit intelligence · Internal knowledge & production — feeding one studio'),
  spacer(120),
  calloutBox('Get cited', 'Authority content on the housing-policy questions developers ask (SB 79, ADU, BTR) — so Danielian is the cited expert, not a name in a broad ad.', TEAL),
  spacer(120),
  calloutBox('Win the pursuit', 'SOQ / RFQ / proposal assembly from days to hours, precedent-matched per pursuit, with account intelligence on land buys and entitlement filings.', CORE_ORANGE),
  spacer(120),
  calloutBox('Free the studio', '57 years and 6,353 projects, finally searchable; entitlement and code research with a head start — hours returned to design and client time.', CORE_BLUE),
);

// ---- 3. THE PROGRAM (ENTRY ONLY) ----
docChildren.push(
  ...sectionHeader('The Program', CORE_BLUE, '03'),
  spacer(120),
  p('The program is built land-and-expand and framed as EOS Rocks: a small entry that proves the lift, then a clearly-labeled expansion once it does. Here is the entry — the easy yes. The bigger build (the institutional knowledge graph, account intelligence, the entitlement assistant) comes later, once the entry proves out, and is scoped at discovery.'),
  spacer(80),
  buildTable(
    [
      { label: 'Entry Service', weight: 3.0 },
      { label: 'Scope', weight: 4.4 },
      { label: 'Est. Y1', weight: 1.6, align: AlignmentType.RIGHT },
    ],
    [
      ['My AI — Workshop + Readiness', 'Set the AI program as EOS Rocks; readiness baseline (one-time)', { text: '~$5,000', align: AlignmentType.RIGHT }],
      ['My AI — Fractional AI Advisor', 'Program lead, governance, and the pursuit-automation pilot', { text: '~$24,000', align: AlignmentType.RIGHT }],
      ['My SEO — Authority / AEO foundation', 'Authority content on the housing-policy questions developers ask', { text: '~$12,000', align: AlignmentType.RIGHT }],
      [{ text: 'ENTRY PROGRAM (Y1)', bold: true }, { text: 'Prove the pursuit + efficiency lift, no large build', bold: true }, { text: '~$41,000', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  buildTable(
    [
      { label: 'Year-1 ROI vs. entry', weight: 3.6 },
      { label: 'Downside-Protected', weight: 2.1, align: AlignmentType.RIGHT },
      { label: 'Likely', weight: 2.1, align: AlignmentType.RIGHT },
      { label: 'Upside', weight: 2.1, align: AlignmentType.RIGHT },
    ],
    [
      ['Total estimated Y1 value', { text: '+$22,500', align: AlignmentType.RIGHT }, { text: '+$105,000', align: AlignmentType.RIGHT }, { text: '+$225,000', align: AlignmentType.RIGHT }],
      [{ text: 'Modeled ROI', bold: true, color: CORE_BLUE }, { text: 'pays for itself', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }, { text: '~2.6×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }, { text: '~5.5×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  p('Even with zero additional pursuit wins, the studio hours the automation returns cover the entry. The expected case counts a single added win plus those hours. Projected, not guaranteed; calibrated to Danielian’s real numbers at discovery.', { size: 18, italics: true, spaceBefore: 60 }),
);

// ---- 4. ROADMAP + CTA ----
docChildren.push(
  ...sectionHeader('The Roadmap & Next Step', CORE_ORANGE, '04'),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Implementation Roadmap', 600, AR_TIMELINE),
  diagramCaption('Foundation (0–90 days) → Pursuit Engine (90–180) → Firmwide Scale (180–365)'),
  spacer(160),
  ctaBanner([
    { text: 'Two fronts, one local partner — five minutes apart in Irvine.', size: 26, bold: true },
    { text: 'Start with a free Nexus Assess and one live-pursuit before/after — no contract, no obligation.', size: 22 },
    { text: 'Use the Book a Meeting button in my signature to set up a time to discuss this and all the', size: 20 },
    { text: 'AI strategies Technijian is putting into place for itself and its clients.', size: 20 },
    { text: 'Ravi Jain, Technijian  |  rjain@technijian.com  |  949.379.8499', size: 20 },
  ]),
  spacer(160),
  p('The full AI Growth & Integration Strategy — the buyer universe, competitive landscape, capability proof, the EOS integration plan, the complete service map, and the discovery questions — is ready if you want to read further before we meet.', { italics: true, align: AlignmentType.CENTER }),
);

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

const OUT_PATH = path.join(__dirname, 'Danielian-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nSUMMARY DOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
