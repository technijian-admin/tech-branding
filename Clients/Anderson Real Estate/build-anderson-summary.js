// Anderson Real Estate — AI Growth & Integration EXECUTIVE SUMMARY (first-touch attachment).
// Reuses the full-plan helpers, brand tokens, and diagrams. Entry pricing only (per skill Phase 10).

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
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
const PASS = strip(tokens.color.status.pass.$value);
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';

const LOGO_BUF = fs.readFileSync(path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value));
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => fs.existsSync(path.join(DIAGRAMS_DIR, n)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, n)) : null;
const DIAGRAM_TWOFRONTS_BUF = dbuf('two-fronts.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');
const TODAY = '2026-06-08';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ spacing: { before: s, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, o = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  return [
    new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 360, after: 120 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] }),
    new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
      rows: [new TableRow({ children: [
        new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
        new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 32, bold: true, color, font: FONT_HEAD })] })] }),
      ]})] }),
  ];
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const arr = Array.isArray(body) ? body : [body];
  const bodyParas = arr.map((b, i) => new Paragraph({ keepNext: i < arr.length - 1, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})] });
}
function kpiCell(number, label, color, w) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 46, bold: true, color, font: FONT_HEAD })] }),
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
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: ri % 2 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: o.text || '', size: 20, color: o.color || BRAND_GREY, bold: o.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function diagramImage(buf, alt, widthPx = 600, ar = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / ar) }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(t) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: t, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, h = 200) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun('')] })] })] })] }); }
function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth — Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
    new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  ] })] });
}

const C = [];
// COVER
C.push(
  colorBanner(CORE_BLUE), spacer(700),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(360),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
    new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
  ]})] }),
  spacer(280),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ANDERSON REAL ESTATE', size: 46, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 26, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'EXECUTIVE SUMMARY', size: 30, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(280),
  kpiRow([
    { number: '53', label: 'Properties', color: CORE_BLUE },
    { number: '3.1M', label: 'Sq ft · 9 markets', color: CORE_ORANGE },
    { number: '250+', label: 'Tenants', color: TEAL },
    { number: '$100M', label: 'Century City reposition', color: DARK_CHARCOAL },
  ]),
  spacer(280),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Prepared by Technijian  ·  ' + TODAY + '  ·  for Rebecca Reyna, Chief of Staff', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(360), colorBanner(CORE_ORANGE, 150), spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Anderson Real Estate', size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  pageBreak(),
);

// THE OPPORTUNITY
C.push(
  ...sectionHeader('The Opportunity', CORE_BLUE),
  spacer(120),
  p('Anderson Real Estate is a family-owned commercial portfolio — 53 properties, 3.1 million square feet, 250+ tenants across nine markets — mid-way through a $100 million repositioning of its Anderson Towers campus in Century City, with Ares Management already signed as anchor. Century City is the top-performing office submarket on the West Coast, so the timing is excellent. The question is how AI helps the team capture that moment without losing the personal, relationship-driven service that is the family’s edge.'),
  p('AI helps on two fronts, and they are different in kind. The first is leasing and tenant growth — winning the right tenants and holding the 250+ base — which is account-based and broker-driven, not a marketing funnel. The second, and the larger near-term return, is portfolio operations and efficiency — abstracting 250+ leases, automating CAM, and putting occupancy and rollover in one view — so a lean family-office team operates at an institutional standard.'),
  spacer(120),
  calloutBox('Why Now', [
    'A single month of avoided vacancy on Century City office runs to six figures — faster, better-targeted leasing is the single largest number in the model.',
    'Lease intelligence is the surest win: abstracting a complex lease takes a human 2–3 hours; AI does it in minutes — across 250+ leases that is one to two analysts of capacity recovered without new headcount.',
    'Only ~5% of real-estate firms have made AI deliver. No Westside family owner-operator is known to have built this layer — Anderson can hold a genuine first-mover position.',
  ], CORE_ORANGE),
);

// HOW AI HELPS — TWO FRONTS
C.push(
  ...sectionHeader('How AI Helps — Two Fronts', TEAL),
  spacer(120),
  p('The plan keeps the two fronts separate on purpose, because the right tool for one is the wrong tool for the other. AI is the operating layer under Anderson’s family-owned platform — it amplifies "people come first," it does not replace the relationship.'),
  spacer(120),
  diagramImage(DIAGRAM_TWOFRONTS_BUF, 'The AI Operating Layer — Two Fronts', 600, 1.58),
  diagramCaption('The AI operating layer: Front 1 wins and holds tenants; Front 2 runs the portfolio.'),
  spacer(80),
  calloutBox('Front 1 — Leasing & Tenant Growth (account-based)', [
    'Be the cited answer for "Century City office space" and Westside retail; track named in-market tenants and their brokers; draft on-brand proposals in hours; tell the Ares-anchor story to court the next wave. Never broad "lead generation" — depth and timing against a known universe.',
  ], CORE_BLUE),
  spacer(100),
  calloutBox('Front 2 — Portfolio Operations & Efficiency (the fastest return)', [
    'Abstract 250+ leases into a searchable, source-linked view; automate CAM across 53 properties; triage maintenance with a 24/7 tenant assistant; and put occupancy, rollover, and revenue in one live dashboard — one integrated layer, not 14 disconnected tools.',
  ], TEAL),
);

// THE PROGRAM
C.push(
  ...sectionHeader('The Program — Start Small, Expand on Proof', CORE_BLUE),
  spacer(120),
  p('The program lands small and expands. The entry below is the headline ask — recurring quick-win services plus a lease-intelligence pilot and a free Nexus Assess, with no large build. The bigger build (portfolio dashboard, tenant portal, leasing CRM, full lease rollout) comes later, once the entry proves the lift.'),
  spacer(120),
  buildTable(
    [{ label: 'Entry Program (Year 1)', weight: 4.4 }, { label: 'Scope', weight: 3.6 }, { label: 'Y1', weight: 1.6 }],
    [
      ['My SEO — Leasing Visibility + GEO', 'AEO/GEO for Century City office & Westside retail', '$15,000'],
      ['My AI — Lease-Intelligence Pilot + Advisor', 'Abstract a first lease tranche + AI roadmap', '$30,000'],
      ['My AI — Executive AI Workshop', 'Leadership session to prioritize the roadmap', '$5,000'],
      ['Nexus Assess — Risk Scan', 'Free, no-commitment IT/security assessment', '$0'],
      [{ text: 'ENTRY PROGRAM — the easy yes', bold: true }, { text: 'No large build to begin', bold: true }, { text: '~$50,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(140),
  p('Modeled against that small entry, the return is strong and honest (all figures estimated, conservative, and calibrated on a discovery call):', { size: 20 }),
  buildTable(
    [{ label: 'Year-1 Value at Stake', weight: 4 }, { label: 'Downside-Protected', weight: 2 }, { label: 'Likely', weight: 2 }, { label: 'Upside', weight: 2 }],
    [
      ['Total value attributed', '$75,000', '$215,000', '$410,000'],
      ['Technijian ENTRY investment', '~$50,000', '~$50,000', '~$50,000'],
      [{ text: 'Modeled ROI vs. entry', bold: true, color: CORE_BLUE }, { text: '1.5×', bold: true, color: PASS }, { text: '4.3×', bold: true, color: PASS }, { text: '8.2×', bold: true, color: PASS }],
    ],
  ),
);

// ROADMAP + CTA
C.push(
  ...sectionHeader('Roadmap & Next Step', TEAL),
  spacer(120),
  p('A 90 / 180 / 365-day cadence, sequenced land-first: prove the lease-intelligence win and switch on leasing visibility, then build the account-based leasing engine, then the portfolio intelligence layer and scale.'),
  spacer(80),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Anderson 90/180/365 Roadmap', 600, 2.30),
  diagramCaption('90 / 180 / 365-Day Roadmap — prove the highest-ROI win first, then the engine, then scale.'),
  spacer(120),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ children: [new TableCell({
    shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'A 30-minute conversation is the next step.', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'We can run the free Nexus Assess in parallel, and return a calibrated ROI model and fixed-scope plan within 5 business days.', size: 20, color: WHITE, font: FONT_BODY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  949.379.8499  ·  technijian.com', size: 22, color: WHITE, font: FONT_BODY })] }),
    ],
  })]})] }),
  spacer(120),
  p('The full 25-page plan — personas, competitive landscape, capability proof, both fronts in detail, and the complete investment map — is ready on request.', { italics: true, size: 20, align: AlignmentType.CENTER }),
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
    headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: C,
  }],
});

const OUT = path.join(__dirname, 'Anderson-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log('Summary DOCX:', OUT, (buf.length / 1024).toFixed(1) + ' KB'); }).catch(e => { console.error(e.message); process.exit(1); });
