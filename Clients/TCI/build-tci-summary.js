// TCI Transportation — AI Growth & Integration Blueprint — EXECUTIVE SUMMARY
// Short (5-6pp) first-touch attachment. Reuses the full report's helpers, brand tokens,
// and the rendered architecture.png + timeline.png. TRUTHFUL pricing: published entry only;
// expansion scoped in discovery; NO fabricated ROI ratio (Ravi, 2026-06-01).

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

const MAIN_PHONE = tokens.phone.main.$value;        // 949.379.8499
const FOUNDER_EMAIL = tokens.email.founder.$value;

const LOGO_BUF = fs.readFileSync(path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value));
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => fs.existsSync(path.join(DIAGRAMS_DIR, n)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, n)) : null;
const DIAGRAM_ARCH_BUF = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');
const AR_ARCH = 1.607, AR_TIMELINE = 2.296;  // TCI diagram aspect ratios

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
    new TextRun({ text: `Technijian  |  Irvine, CA  |  ${MAIN_PHONE}  |  technijian.com  |  CONFIDENTIAL  |  Page `, size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'TCI TRANSPORTATION', size: 44, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 30, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Executive Summary', size: 24, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
  spacer(260),
  kpiRow([
    { number: '1978', label: 'Family-owned, 2 generations', color: CORE_BLUE },
    { number: '3,800+', label: 'Trucks, tractors & trailers', color: CORE_ORANGE },
    { number: '26+', label: 'Facilities across 10 states', color: TEAL },
    { number: '1,500+', label: 'Team members', color: DARK_CHARCOAL },
  ]),
  spacer(260),
  p('TCI already runs operational AI — preventative maintenance, collision mitigation, telematics. This blueprint points AI at the one place it has not yet aimed: the commercial side, where the next dollar of growth is found, won, and kept. Two pillars: own the recurring leasing core through search and account intelligence, and own the California EV / WAIRE niche the national giants treat generically. This summary covers the opportunity, the engine, the program, and the entry. The full blueprint is ready on request.', { align: AlignmentType.CENTER }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for TCI Transportation  |  Technijian  |  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  pageBreak(),
);

// ---- 1. THE OPPORTUNITY ----
docChildren.push(
  ...sectionHeader('The Opportunity', CORE_BLUE, '01'),
  spacer(120),
  p('TCI wins work through 47 years of relationships, a full-service offer under one roof, and a service culture the national giants can’t match in any single market. None of that changes. What this blueprint adds is a commercial-AI layer underneath it, on two pillars at once:'),
  spacer(60),
  buildTable(
    [
      { label: '', weight: 1.4 },
      { label: 'Pillar 1 — The Recurring Core', weight: 3.6 },
      { label: 'Pillar 2 — The EV / WAIRE Wedge', weight: 3.6 },
    ],
    [
      [{ text: 'The win', bold: true }, 'More full-service leases, maintenance contracts, and used-truck sales captured', 'Own the California zero-emission transition the giants treat generically'],
      [{ text: 'How', bold: true }, 'Local + answer-engine search across 26+ yards; account intelligence on fleets', 'Target WAIRE-obligated warehouses; EV trucks + charging + a compliance-ROI tool'],
      [{ text: 'AI role', bold: true }, 'Get found, surface named accounts, automate the quote and the RFP', 'Find obligated warehouses by truck-trip data; make the compliance math a sale'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why Now — The 2026 Window',
    [
      'California is legislating the EV pillar into a deadline: SCAQMD’s WAIRE rule ramps warehouse obligations through 2031, and CARB’s Advanced Clean Fleets and Advanced Clean Trucks mandates push zero-emission adoption — a buyer who needs exactly what TCI offers, in TCI’s own air basin.',
      'The freight market rewards diversification: with carriers failing and the recovery slow, TCI’s recurring mix — leasing, maintenance, factoring, used trucks — is a resilience story it does not yet tell where buyers look.',
      'The national giants are digitally strong but generic. The nimble, local, family-owned operator that out-modernizes regionally captures the demand and the EV niche before they localize.',
    ],
    CORE_ORANGE
  ),
);

// ---- 2. THE ENGINE ----
docChildren.push(
  ...sectionHeader('The Engine', CORE_BLUE, '02'),
  spacer(120),
  p('Three motions, all aimed at the fleets, shippers, and warehouses TCI already knows — never a broad funnel. AI gets TCI found, arms the sales team, and speeds the quoting and bidding; the relationship, the yards, and the lease still close the deal.'),
  spacer(60),
  diagramImage(DIAGRAM_ARCH_BUF, 'The TCI AI Growth Engine', 600, AR_ARCH),
  diagramCaption('Get Found · Account Intelligence & Outbound · Internal Automation — extending the operational AI TCI already runs'),
  spacer(120),
  calloutBox('Get found', 'Local and answer-engine search across 26+ yards: a page per facility and service, and authority content that owns the WAIRE, EV-truck, leasing, and used-truck questions buyers ask in Google and AI answers.', TEAL),
  spacer(120),
  calloutBox('Win named accounts', 'The same public-records account-intelligence motion already in production for a Technijian client — 24 contact-ready leads in a single 75-minute run — pointed at WAIRE-obligated warehouses and named fleets, with RFP and lease-proposal automation behind it.', CORE_ORANGE),
  spacer(120),
  calloutBox('Run leaner', 'A quote / spec-to-lease assistant, a WAIRE/EV ROI tool that turns the regulation into a sales conversation, used-truck merchandising, and an AI-assisted portal across leasing, maintenance, factoring, and roadside.', CORE_BLUE),
);

// ---- 3. THE PROGRAM (TRUTHFUL: ENTRY PUBLISHED; EXPANSION SCOPED) ----
docChildren.push(
  ...sectionHeader('The Program', CORE_BLUE, '03'),
  spacer(120),
  p('The program is built land-and-expand: a small, published entry that proves the lift, then an expansion scoped at discovery once it does. We are deliberate about money — only the published price is stated as firm; the build is priced from the rate card and scoped into a fixed-price Statement of Work, never an invented number.'),
  spacer(80),
  buildTable(
    [
      { label: 'Entry Program (published)', weight: 3.2 },
      { label: 'Scope', weight: 4.2 },
      { label: 'Y1', weight: 1.6, align: AlignmentType.RIGHT },
    ],
    [
      ['My SEO — Tier 5 + AEO / PR / Syndication', 'Multi-location local + answer-engine search foundation; 12-mo, unlimited hours', { text: '~$24,600', align: AlignmentType.RIGHT }],
      [{ text: 'ENTRY PROGRAM (Y1)', bold: true }, { text: 'Prove the search + capture lift, no large build to start', bold: true }, { text: '$2,050/mo', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  buildTable(
    [
      { label: 'Expansion (scoped in discovery)', weight: 3.4 },
      { label: 'Basis — 2026 rate card', weight: 3.6 },
      { label: 'Investment', weight: 2.4, align: AlignmentType.RIGHT },
    ],
    [
      ['Custom AI & app build (quote-to-lease, WAIRE/EV ROI tool, portal, used-truck)', 'AI eng $185–$275/hr; full-stack $145–$210/hr', { text: 'Fixed-scope SOW', color: CORE_ORANGE, align: AlignmentType.RIGHT }],
      ['Account intelligence & outbound + Fractional AI Advisor', 'My AI engagement; advisor $1,500–$3,500/mo', { text: 'Set at discovery', color: CORE_ORANGE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Return — Value at Stake',
    [
      'Rather than print an ROI multiple we cannot yet stand behind, we name the levers the program moves: new full-service lease and dedicated-contract wins, WAIRE-driven EV deals (a zero-emission Class 6/7 truck earns WAIRE points worth roughly $68,000 in avoided fees), used-truck unit-sales lift, and retained leasing volume.',
      'Within five business days of a 30-minute discovery call, Technijian returns a calibrated ROI model and a fixed-scope Statement of Work built on TCI’s real per-deal economics. Prove the foundation first, then size the engine.',
    ],
    CORE_BLUE
  ),
);

// ---- 4. ROADMAP + CTA ----
docChildren.push(
  ...sectionHeader('The Roadmap & Next Step', CORE_ORANGE, '04'),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Implementation Roadmap', 600, AR_TIMELINE),
  diagramCaption('Foundation (0–90 days) → Demand & Intelligence (90–180) → Scale & Automate (180–365)'),
  spacer(160),
  ctaBanner([
    { text: 'A local, family-built partner for the commercial side of TCI.', size: 26, bold: true },
    { text: 'Start with five Quick Wins and one live before/after — no contract, no obligation.', size: 22 },
    { text: 'Use the Book a Meeting button in my signature to set up a time to discuss this and the', size: 20 },
    { text: 'AI strategies Technijian is putting into place for itself and its clients.', size: 20 },
    { text: `Ravi Jain, Technijian  |  ${FOUNDER_EMAIL}  |  ${MAIN_PHONE}`, size: 20 },
  ]),
  spacer(160),
  p('The full AI Growth & Integration Blueprint — the buyer universe, competitive landscape, capability proof with real engagements, the complete service map, the truthful investment detail, and the discovery questions — is ready if you want to read further before we meet.', { italics: true, align: AlignmentType.CENTER }),
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

const OUT_PATH = path.join(__dirname, 'TCI-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nSUMMARY DOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
