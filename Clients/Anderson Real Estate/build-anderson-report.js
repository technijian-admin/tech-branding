// Anderson Real Estate — AI Growth & Integration Blueprint. Technijian-branded DOCX builder.
// GTM: account-based commercial real-estate owner-operator (leasing + portfolio operations).
// Pattern adapted from Clients/EBRMD/build-ebrmd-report.js (reads brand-tokens.json).

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
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_TWOFRONTS_BUF = dbuf('two-fronts.png');
const DIAGRAM_PERSONAS_BUF  = dbuf('personas.png');
const DIAGRAM_TIMELINE_BUF  = dbuf('timeline.png');

const TODAY = '2026-06-08';
const CLIENT = 'Anderson';

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
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 46, bold: true, color, font: FONT_HEAD })] }),
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

function capabilityBox(title, built, applies) {
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
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: 'What Technijian Built: ', size: 20, bold: true, color: CORE_BLUE, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `How This Applies to ${CLIENT}: `, size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ANDERSON REAL ESTATE', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'A family-owned commercial portfolio  ·  Century City, Los Angeles', size: 24, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint — Leasing Velocity + Portfolio Efficiency', size: 28, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for Rebecca Reyna, Chief of Staff', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Anderson Real Estate', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '53', label: 'Properties owned & operated', color: CORE_BLUE },
    { number: '3.1M', label: 'Sq ft across 9 markets', color: CORE_ORANGE },
    { number: '250+', label: 'Tenants to serve & retain', color: TEAL },
    { number: '$100M', label: 'Century City reposition underway', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Anderson Real Estate is a rarity: a family-owned commercial portfolio, built over five decades from John E. Anderson’s original 1956 venture, that has held to a "people come first" philosophy while most of its Westside competitors became institutional REITs. Today the firm owns and operates 53 properties — 3.1 million square feet of office, retail, mixed-use, and industrial across nine markets — and is mid-way through a $100 million repositioning of its Anderson Towers campus at 1800 and 1900 Avenue of the Stars, with Ares Management already signed as anchor. The portfolio and the timing are excellent. The question this blueprint answers is how AI helps the team capture that moment without losing the personal, relationship-driven service that is the family’s edge.'),
  p('The honest answer is that AI helps Anderson on two fronts at once, and they are different in kind. The first is leasing and tenant growth — winning the right tenants for the repositioned space and holding the 250+ tenant base — which is account-based and broker-driven, not a marketing funnel. The second, and the larger near-term return, is portfolio operations and efficiency — abstracting 250+ leases, automating CAM, triaging maintenance, and putting occupancy and rollover in one view — so a lean family-office team operates at an institutional standard. This is where AI has its clearest, highest-ROI win in commercial real estate today.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Century City is the top-performing office submarket on the West Coast, and the $100M Anderson Towers reposition lands in exactly the right place at the right time — premium space wins only if the right tenants and brokers are found, courted, and converted.',
      'Lease intelligence is the fastest, surest return: abstracting a complex commercial lease takes a human 2–3 hours; AI does it in minutes — across 250+ leases that is one to two full-time analysts of capacity recovered without adding headcount.',
      'Almost no Westside family owner-operator has adopted AI — only ~5% of real-estate firms report achieving their AI goals. Anderson can hold a genuine first-mover position while the institutional REITs move slowly.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Anderson’s internal metrics (current vacancy and rollover, leasing-team capacity, lease-administration hours, systems in use) were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call — the questions are in Section 13.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE TWO FRONTS ----------
docChildren.push(
  ...sectionHeader('The Two Fronts AI Works', TEAL, '02'),
  spacer(100),
  p('Every dollar of value AI creates for a commercial owner-operator comes from one of two fronts, and they could not be more different in how they work. Confusing them — treating leasing like a consumer marketing funnel, or treating operations like a growth campaign — is the most common and most expensive mistake. This blueprint keeps them separate on purpose, because the right tool for one is the wrong tool for the other.'),
  spacer(160),
  diagramImage(DIAGRAM_TWOFRONTS_BUF, 'The AI Operating Layer — Two Fronts', 600, 1.58),
  diagramCaption('Figure 2.0 — The AI operating layer: Front 1 wins and holds tenants; Front 2 runs the portfolio.'),
  spacer(140),
  buildTable(
    [
      { label: 'Dimension', weight: 2 },
      { label: 'Front 1 — Leasing & Tenant Growth', weight: 4 },
      { label: 'Front 2 — Portfolio Ops & Efficiency', weight: 4 },
    ],
    [
      ['Goal', 'Win the right tenants; hold the 250+ base', 'Run 3.1M sq ft at an institutional standard'],
      ['Who it touches', 'Named tenants and the brokers who control deal flow', 'Lease admin, finance, engineering, leadership'],
      ['Right motion', 'Account-based: target, court, convert, retain', 'Automate the repetitive; surface the buried'],
      ['Right tools', 'My SEO + GEO, My AI account intelligence, My Dev', 'My AI lease/doc intelligence, Chat.AI, My Dev'],
      ['Wrong tool', 'Broad "lead generation" — leasing is relationship-driven', 'A new point tool for every task — 14 disconnected silos'],
      ['Payback', 'Compounds with each lease and renewal', 'Immediate — recovered capacity in the first quarter'],
    ],
  ),
  spacer(120),
  p('Section 3 sets the market context that makes the timing matter; Sections 8 and 9 detail each front in turn; Section 10 models the return. The throughline is simple: AI is the operating layer under Anderson’s family-owned platform — it amplifies "people come first," it does not replace the relationship.'),
);

// ---------- 03 THE MARKET MOMENT ----------
docChildren.push(
  ...sectionHeader('The Market Moment — Century City & the Flight to Quality', CORE_BLUE, '03'),
  spacer(100),
  p('The reason to act now is the market Anderson is leasing into. While office struggled almost everywhere after 2020, Century City did the opposite — it became the top-performing office submarket on the West Coast, pulling major occupiers out of Downtown Los Angeles in a clear flight to quality toward premium, amenitized, repositioned space. That is precisely the space the $100M Anderson Towers program is creating.'),
  spacer(140),
  buildTable(
    [
      { label: 'Market Signal', weight: 3 },
      { label: 'What the Data Shows', weight: 4 },
      { label: 'What It Means for Anderson', weight: 3.4 },
    ],
    [
      ['Century City rents', 'Average base rent near $80/sf — the highest in the metro, up sharply since 2018', 'A single floor of avoided vacancy is worth six figures — leasing speed pays'],
      ['Flight to quality', 'Occupiers leaving older/Downtown stock for premium repositioned campuses', 'Anderson Towers is built for exactly this demand — if tenants find it'],
      ['Leasing recovery', 'Q1 2026 posted the highest single-quarter LA office leasing since pre-pandemic', 'The window is open now; movement favors the prepared landlord'],
      ['Anchor proof', 'Ares Management signed as Anderson Towers anchor', 'A marquee credibility signal to court the next wave of tenants'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why the Timing Compounds',
    [
      'Premium space and a strong submarket are necessary but not sufficient — the building still has to reach the right tenant, through the right broker, before a competitor’s space does. That reach is what Front 1 builds.',
      'Every month a repositioned floor sits empty is rent foregone at the metro’s highest rate. Faster, better-targeted leasing is not a marketing nicety here — it is the single largest number in the model.',
      'The Ares anchor is a story worth telling. AI-assisted content and outreach turn one marquee lease into authority that courts the next ten.',
    ],
    CORE_BLUE
  ),
);

// ---------- 04 WHERE ANDERSON COMPETES ----------
docChildren.push(
  ...sectionHeader('Where Anderson Competes', CORE_ORANGE, '04'),
  spacer(100),
  p('Anderson competes for tenants against the largest names on the Westside — and that is exactly where its difference becomes an advantage. The competition is almost entirely institutional and publicly traded: large, capable, and standardized, but impersonal and bound to short-horizon, quarter-to-quarter pressures. Anderson is the opposite: family-owned, patient, and built on relationships measured in decades.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.6 },
      { label: 'Profile', weight: 3.6 },
      { label: 'Posture', weight: 3.8 },
    ],
    [
      ['Douglas Emmett (DEI)', 'Dominant Westside / Century City office + multifamily REIT', 'Largest Westside owner; institutional scale; public-market pressure'],
      ['Hudson Pacific Properties', 'Westside creative / media office REIT', 'Tech & media tenant focus; institutional, standardized'],
      ['Boston Properties (BXP)', 'National trophy-office REIT', 'Premium product, but corporate — not local or family-run'],
      ['JMB / Century City owners', 'Large institutional Century City office towers', 'Scale and capital; impersonal tenant experience'],
      ['Watt / Worthe Real Estate', 'Regional SoCal owner-operators', 'Closer peers in style; smaller AI footprint'],
    ],
  ),
  spacer(200),
  calloutBox(
    'Where Anderson Wins — The White Space',
    [
      'Family stewardship vs. quarterly pressure: Anderson can make decisions — on a tenant, a renewal, a repositioning — that a REIT answerable to public shareholders cannot. "People come first" is a real differentiator, not a slogan.',
      'Boutique service at institutional quality: AI lets a lean family-office team deliver the data, responsiveness, and polish tenants expect from a DEI or BXP — without becoming impersonal.',
      'AI first-mover: only ~5% of real-estate firms have made AI deliver; more than 60% say they are unprepared. No Westside family owner-operator is known to have built this layer. Anderson can.',
      'The relationship moat: brokers and tenants stay where they are known and well-served. AI sharpens the targeting and the follow-through; the Anderson team keeps the trust.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 WHO ANDERSON SERVES ----------
docChildren.push(
  ...sectionHeader('Who Anderson Serves', CORE_BLUE, '05'),
  spacer(100),
  p('Anderson’s growth depends on a small set of distinct relationships, and each is reached differently — which is the whole point of an account-based approach. The tenant-rep broker sits at the center: for most commercial deals, the broker controls which buildings a tenant ever tours. The plan treats the broker as a channel to be cultivated, and each tenant type as a named target rather than an anonymous lead.'),
  spacer(160),

  personaCard('1 — The Trophy Office Tenant', CORE_BLUE, [
    ['Profile', 'A finance, PE, law, or entertainment firm seeking landmark, amenitized Century City space — Ares is the proof case.'],
    ['Mindset', 'Buys quality, image, and certainty; expects an institutional-grade experience and a responsive landlord.'],
    ['Decision Driver', 'Building quality + the broker’s recommendation + how well-run and credible the ownership feels.'],
    ['How AI Helps', 'Account intelligence finds in-market firms and their brokers; AI-drafted proposals and the Ares-anchored story court them faster.'],
    ['Technijian Hook', 'My AI account intelligence + My SEO/GEO authority + My Dev proposal automation.'],
  ]),
  spacer(160),

  personaCard('2 — The Tenant-Rep Broker (the gatekeeper)', CORE_ORANGE, [
    ['Profile', 'A CBRE / JLL / Cushman / Savills broker who controls which buildings a tenant tours. The single most important relationship.'],
    ['Mindset', 'Sends clients to landlords who are responsive, easy to transact with, and make the broker look good.'],
    ['Decision Driver', 'Speed of response, quality of materials, and trust built over repeated deals.'],
    ['How AI Helps', 'Tracks broker activity and requirements; delivers fast, polished proposals and availability — so Anderson is the easy "yes" to tour.'],
    ['Technijian Hook', 'My AI broker intelligence + My Dev proposal/availability automation.'],
  ]),
  spacer(160),

  personaCard('3 — The Renewing Anchor / Long-Term Tenant', GOLD, [
    ['Profile', 'A member of the existing 250+ tenant base approaching renewal. Retention is far cheaper than new leasing.'],
    ['Mindset', 'Wants to be valued, heard, and well-served; will stay if the experience is good and the relationship is real.'],
    ['Decision Driver', 'Service quality, responsiveness, and feeling like a partner rather than a line item.'],
    ['How AI Helps', 'A 24/7 tenant assistant and faster maintenance response raise satisfaction; rollover analytics flag renewals early so the team can act.'],
    ['Technijian Hook', 'Chat.AI tenant assistant + My Dev portfolio/rollover dashboard.'],
  ]),
  spacer(160),

  personaCard('4 — The Lifestyle / Retail Tenant', TEAL, [
    ['Profile', 'A boutique retailer or restaurateur on Montana Avenue, in Westwood Village, or in Brentwood. Brand-fit and foot traffic matter.'],
    ['Mindset', 'Cares about co-tenancy, neighborhood identity, and a landlord who curates the right mix.'],
    ['Decision Driver', 'Location quality, the tenant mix around them, and lease terms.'],
    ['How AI Helps', 'Local SEO/GEO surfaces available retail to the right operators; AI drafts curation-minded outreach to brands that fit the corridor.'],
    ['Technijian Hook', 'My SEO (local) + My AI targeted outreach.'],
  ]),
  spacer(160),

  personaCard('5 — The Industrial / Flex Tenant', DARK_CHARCOAL, [
    ['Profile', 'A light-industrial or creative user in Oxnard, Ventura County, or Thousand Oaks. Practical and space-driven.'],
    ['Mindset', 'Focused on functionality, price-per-foot, and a smooth, low-friction transaction.'],
    ['Decision Driver', 'Right space, right price, fast and easy to lease.'],
    ['How AI Helps', 'Listing visibility plus automated qualification and follow-up keep these higher-volume deals moving without tying up the team.'],
    ['Technijian Hook', 'My SEO + My Dev intake/qualification automation.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each relationship by lease value and volume — office is high-value and rare, retail and flex are the volume base, and the broker is the channel that multiplies them all.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Who Anderson Serves — Lease Value x Volume', 560, 1.50),
  diagramCaption('Figure 5.0 — Who Anderson serves: Lease Value × Volume'),
);

// ---------- 06 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '06'),
  spacer(100),
  p('There is a gap between the quality of Anderson’s real estate and the visibility of Anderson online — and for an account-based leasing motion, that gap quietly costs deals. When a tenant or a broker searches for Westside or Century City space, the answers are dominated by the big REITs and the brokerage portals; the owner of the space is hard to find. The portfolio is institutional-grade; the digital footprint is understated. Closing that gap is the foundation of Front 1.'),
  spacer(140),
  buildTable(
    [
      { label: 'Dimension', weight: 2.6 },
      { label: 'Current State (observed)', weight: 4 },
      { label: 'The Opportunity', weight: 3.4 },
    ],
    [
      ['Search visibility', 'Does not surface for "Century City office space" or Westside retail searches', 'AEO/GEO so Anderson — the owner — is the cited answer, not just the brokers'],
      ['AI answer engines', 'Effectively invisible to ChatGPT, Perplexity, and Google AI Overviews', 'Be the source these assistants cite for Westside space and the Towers'],
      ['The Anderson Towers story', 'A $100M reposition and an Ares anchor — under-told publicly', 'A marquee narrative that courts the next wave of trophy tenants'],
      ['Family-brand authority', 'The 50-year "people-first" story is a moat that is barely voiced online', 'Content that distinguishes a relationship-driven owner from impersonal REITs'],
      ['Leasing materials', 'Proposals and availability assembled by hand, ad hoc', 'On-brand, AI-drafted proposals and OMs that make the broker’s job easy'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Gap Is the Opportunity',
    [
      'This is not a vanity problem. For an account-based landlord, being the cited, credible answer at the moment a broker or tenant is searching is how the right deal starts — and today that answer is someone else.',
      'The fix is not "more marketing." It is authority and findability for a finite, high-value audience — and turning the Ares-anchored repositioning into a story that earns the next lease.',
      'Every other element of Front 1 (Section 08) builds on this foundation: you cannot run account-based outreach from a presence that the market cannot find.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '07'),
  spacer(100),
  p('Before any recommendation, the relevant question is whether Technijian has actually built what Anderson needs. It has. Each platform below is delivered and operating for real clients, and each maps directly to a front in this plan — evidence first, pitch second.'),
  spacer(160),
  capabilityBox(
    'Proven Build 1 — AI Document Intelligence (the lease-intelligence engine)',
    'Technijian deployed AI document intelligence for a FINRA-registered broker-dealer that auto-populates complex vendor questionnaires — cutting response time from days to minutes against documents that demand exactness.',
    'The same engine abstracts Anderson’s 250+ leases — surfacing dates, options, escalations, and CAM terms, each linked back to the source document — plus estoppels, SNDAs, and vendor contracts. This is the highest-ROI move available.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 2 — Weaviate + Obsidian Knowledge System',
    'Technijian builds hybrid memory systems (Weaviate vector search + Obsidian) that let AI retrieve an organization’s institutional knowledge across sessions instead of losing it.',
    'It captures fifty years of family-firm decisions, tenant histories, and broker relationships before they walk out the door with a retiring employee — turning tribal knowledge into a durable, searchable asset.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 3 — Multi-Agent SEO + AEO/GEO Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP, plus SEMrush, GA4, and Perplexity) that ranks content in Google and positions clients as the source the AI assistants cite.',
    'It makes Anderson the cited answer for "Century City office space" and Westside retail searches, and builds family-brand authority that distinguishes a relationship-driven owner from the impersonal REITs.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 4 — AI-Native Custom App Delivery (My Dev)',
    'Technijian’s AI-native SDLC delivers custom web apps 3–5× faster than traditional development — dashboards, portals, and automations built around a real workflow.',
    'It builds the portfolio-intelligence dashboard (occupancy, rollover, revenue in one view), the leasing/broker CRM, the tenant-experience portal, and CAM automation — an integrated layer, not 14 disconnected tools.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 5 — Chat.AI Conversational Platform',
    'Chat.AI is Technijian’s enterprise AI platform; as an assistant it answers questions in natural language around the clock and routes what needs a human to the right person.',
    'For Anderson it becomes a 24/7 tenant assistant — fielding maintenance requests, building information, and after-hours questions across the portfolio — raising tenant satisfaction and freeing the property team.'
  ),
);

// ---------- 07 FRONT 1 — LEASING & TENANT GROWTH ----------
docChildren.push(
  ...sectionHeader('Front 1 — AI for Leasing & Tenant Growth', CORE_ORANGE, '08'),
  spacer(100),
  p('Commercial leasing is won through relationships, not broadcast marketing — so this front is account-based from end to end. The goal is not to "generate leads"; it is to know which named tenants are in-market, which brokers represent them, and to reach them faster and more credibly than the competing landlord down the street. AI does the finding, watching, and drafting; the Anderson team does the relationship.'),
  spacer(140),
  subHeader('The AI Tools for Front 1'),
  buildTable(
    [
      { label: 'Tool', weight: 2.6 },
      { label: 'Use Case', weight: 4.2 },
      { label: 'Impact', weight: 2.2 },
      { label: 'Technijian Service', weight: 2 },
    ],
    [
      ['Leasing AEO / GEO content', 'Be the cited answer for "Century City office space" and Westside retail searches', 'More direct, qualified inquiry', 'My SEO'],
      ['Broker & tenant signal monitoring', 'Track named in-market tenants, lease expirations, funding, and moves', 'Reach the right tenant first', 'My AI'],
      ['Tour & proposal automation', 'Draft on-brand leasing proposals, OMs, and follow-ups in hours', 'Days → hours to respond', 'My Dev'],
      ['Family-brand authority', 'Tell the Ares-anchor and "people-first" story; tenant testimonials', 'Higher tour-to-lease conversion', 'My SEO + My AI'],
      ['Account-based outreach', 'Personalized per-broker and per-tenant outreach — never mass mailing', 'Warmer named-account pipeline', 'My AI'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based, Not "Lead Generation"',
    [
      'Anderson already knows who its targets are — the brokers and the firms in-market for Westside space. The value of AI is depth and timing against that known universe, not volume against an anonymous one.',
      'Every output here supports a human relationship: AI surfaces the signal and drafts the first version; the Anderson team makes the call, hosts the tour, and earns the trust.',
      'This is the right framing for a relationship-driven, family-owned landlord — and the opposite of the "shotgun" marketing that would erode the brand it took fifty years to build.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 FRONT 2 — PORTFOLIO OPS & EFFICIENCY ----------
docChildren.push(
  ...sectionHeader('Front 2 — AI for Portfolio Operations & Efficiency', TEAL, '09'),
  spacer(100),
  p('This front is where the fastest, surest return lives. A 3.1M sq ft portfolio across nine markets generates an enormous amount of repetitive, document-heavy work — lease administration, CAM reconciliation, maintenance coordination, reporting — most of it still done by hand or buried in files and people’s heads. AI does not replace the team here; it removes the drudgery so the team can do the judgment work, and it surfaces what was previously invisible.'),
  spacer(140),
  subHeader('The AI Tools for Front 2'),
  buildTable(
    [
      { label: 'Tool', weight: 2.6 },
      { label: 'Use Case', weight: 4.2 },
      { label: 'Impact', weight: 2.2 },
      { label: 'Technijian Service', weight: 2 },
    ],
    [
      ['Lease abstraction & intelligence', 'Abstract 250+ leases; surface dates, options, escalations, CAM — source-linked', '~1–2 FTE recovered', 'My AI'],
      ['CAM reconciliation automation', 'Reduce manual common-area-maintenance math across 53 properties', 'Faster, cleaner billbacks', 'My AI'],
      ['Document intelligence', 'Estoppels, SNDAs, insurance certs, vendor contracts summarized & tracked', 'Fewer missed obligations', 'My AI'],
      ['Maintenance / work-order triage', 'AI-route tenant requests; flag predictive upkeep across the engineering team', 'Lower response time & downtime', 'Chat.AI + My Dev'],
      ['Portfolio analytics dashboard', 'Occupancy, rollover exposure, revenue, and anomalies in one live view', 'Faster leadership decisions', 'My Dev'],
      ['Tenant-experience assistant', '24/7 AI assistant for tenant requests and building information', 'Higher satisfaction & retention', 'Chat.AI'],
      ['Institutional knowledge retention', 'Capture 50 years of family-firm decisions and relationships', 'Knowledge survives turnover', 'My AI'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Lease-Intelligence Quick Win',
    [
      'A human analyst spends two to three hours abstracting a single complex commercial lease. Across 250+ leases, doing this by hand is a recurring tax on the team — and the data still ends up scattered.',
      'AI abstracts each lease in minutes, links every extracted term back to the source page, and makes the whole portfolio searchable — critical dates, renewal options, escalations, and CAM terms surfaced automatically.',
      'This single capability recovers the equivalent of one to two full-time analysts, eliminates missed options and escalations, and pays back faster than anything else in the plan. It is the recommended first move.',
    ],
    TEAL
  ),
);

// ---------- 09 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '10'),
  spacer(100),
  p('The model below is built from public market data and industry benchmarks because Anderson’s internal numbers were not available for this draft. Every figure is estimated and deliberately conservative; the discovery questions in Section 13 replace them with real baselines. The program is structured to land small and expand — prove the return on a modest entry, then build the larger engine once it is earned.'),
  spacer(140),
  subHeader('Projected Operating Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3 },
      { label: 'Estimated Current', weight: 2.6 },
      { label: 'With the Program', weight: 2.6 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['Lease abstraction', '2–3 hrs/lease, manual', 'Minutes, source-linked', '~1–2 FTE freed'],
      ['Lease-data visibility', 'In documents & people’s heads', 'Searchable portfolio-wide', 'No missed options'],
      ['Leasing visibility', 'Broker-dependent', 'Cited in Google + AI answers', 'More direct inquiry'],
      ['Tenant request handling', 'Phone/email, business hours', '24/7 AI assistant + routing', 'Faster, happier tenants'],
      ['Portfolio reporting', 'Manual, multi-spreadsheet', 'One live dashboard', 'Real-time rollover view'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 Value at Stake vs. the Entry Program (Estimated)'),
  p('Because a single month of avoided vacancy on Century City office runs to six figures and lease intelligence recovers one to two analysts, the return is modeled against the small entry investment. The very-conservative floor is labeled Downside-Protected; lead with the Likely case.', { size: 20 }),
  buildTable(
    [
      { label: 'Value Lever (Y1, estimated)', weight: 3.8 },
      { label: 'Downside-Protected', weight: 2.1 },
      { label: 'Likely', weight: 2.1 },
      { label: 'Upside', weight: 2.1 },
    ],
    [
      ['Recovered operations capacity (lease abstraction, CAM, reporting)', '$60,000', '$90,000', '$120,000'],
      ['Leasing velocity — faster fill of repositioned space', '—', '$80,000', '$200,000'],
      ['Tenant retention — fewer avoidable move-outs', '$15,000', '$45,000', '$90,000'],
      [{ text: 'Total value attributed', bold: true }, { text: '$75,000', bold: true }, { text: '$215,000', bold: true }, { text: '$410,000', bold: true }],
      [{ text: 'Technijian ENTRY investment (Y1)', bold: true }, { text: '~$50,000', bold: true }, { text: '~$50,000', bold: true }, { text: '~$50,000', bold: true }],
      [{ text: 'Modeled ROI vs. entry', bold: true, color: CORE_BLUE }, { text: '1.5×', bold: true, color: PASS }, { text: '4.3×', bold: true, color: PASS }, { text: '8.2×', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('All figures projected, not guaranteed. The expansion build (portfolio dashboard, tenant portal, leasing CRM, full lease rollout) adds gains the entry ratio above does not count.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Service Investment Map — Land and Expand'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'Scope', weight: 4 },
      { label: 'Monthly', weight: 1.5 },
      { label: 'Y1 Total', weight: 1.5 },
    ],
    [
      ['My SEO — Leasing Visibility + GEO', 'AEO/GEO for Century City office & Westside retail; family-brand authority', '$1,250/mo', '$15,000'],
      ['My AI — Lease-Intelligence Pilot + Advisor', 'Abstract a first lease tranche + fractional AI advisory and roadmap', '$2,500/mo', '$30,000'],
      ['My AI — Executive AI Workshop', 'Leadership working session; prioritize the portfolio AI roadmap (1×)', '—', '$5,000'],
      ['Nexus Assess — IT/Security Risk Scan', 'Free, no-commitment assessment across the footprint (Quick Win)', 'Free', '$0'],
      [{ text: 'ENTRY PROGRAM (the easy yes)', bold: true }, { text: 'Recurring $3,750/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$50,000', bold: true, color: CORE_BLUE }],
      ['My Dev — Portfolio Intelligence + Leasing CRM (Phase 2)', 'Occupancy/rollover/revenue dashboard + broker/tenant CRM (one-time build)', '—', '$90,000'],
      ['My Dev — Tenant Portal + Chat.AI Assistant (Phase 2)', 'Tenant-experience portal and 24/7 assistant (one-time build)', '—', '$45,000'],
      ['My AI — Full Lease Rollout + Account Intelligence (Phase 2)', 'Abstract all 250+ leases; broker/tenant account-intelligence engine', '$3,499/mo', '$42,000'],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, and ongoing optimization', '$1,000/mo', '$12,000'],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'Recurring + one-time builds', bold: true }, { text: '', bold: true }, { text: '~$239,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(40),
  p('My SEO has published tiers; My AI and My Dev figures are estimated defaults confirmed at quote. The entry is the headline ask; the Phase-2 expansion is shown for transparency but is not the first commitment.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Transparent US Labor Rates (for any ad-hoc / project work)'),
  buildTable(
    [
      { label: 'Role', weight: 4 },
      { label: 'Standard', weight: 2 },
      { label: 'After-Hours', weight: 2 },
      { label: 'Contracted', weight: 2 },
    ],
    [
      ['Technical Support / Engineer', '$150/hr', '$250/hr', '$125/hr'],
      ['CTO / vCIO / AI Architect', '$250/hr', '$350/hr', '$225/hr'],
    ],
  ),
  spacer(40),
  p('A single blended US-led rate; project and ad-hoc work is billed transparently against this card so there are no surprises.', { italics: true, size: 18 }),
);

// ---------- 10 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '11'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence and is sequenced land-first: prove the highest-ROI win (lease intelligence) and switch on leasing visibility in the first quarter, stand up the account-based leasing engine next, then build the portfolio intelligence layer and scale across the Anderson Holdings footprint. Meaningful results — abstracted leases, more direct inquiry — are visible inside the first 90 days.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Anderson 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 10.0 — Anderson Real Estate: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Prove the return and switch on the fastest wins — no large build required.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Lease-Intelligence Pilot', 'Abstract a first tranche of leases into a searchable, source-linked view; surface critical dates, options, and CAM terms.'],
      ['1.2 — Leasing Visibility + Assess', 'Stand up AEO/GEO for "Century City office space" and Westside retail; run the free Nexus Assess risk scan.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Leasing Engine (Days 91–180)', { color: TEAL }),
  p('Build the account-based engine that finds, courts, and converts the right tenants.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Broker & Tenant Intelligence', 'Track named in-market tenants, their tenant-rep brokers, and trigger signals across the Westside.'],
      ['2.2 — Tour & Proposal Automation', 'Deploy on-brand proposal and follow-up drafting plus the 24/7 tenant assistant; first account outreach live.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Portfolio Intelligence & Scale (Days 181–365)', { color: CORE_ORANGE }),
  p('Build the integrated operating layer and extend it across the enterprise.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Portfolio Dashboard + Full Rollout', 'Occupancy/rollover/revenue dashboard live; CAM automation; lease abstraction extended across all 250+ leases.'],
      ['3.2 — Scale Across Holdings', 'Extend the operating layer toward the other Anderson Holdings lines; ROI dashboard delivered against the Section 13 baselines.'],
    ],
  ),
);

// ---------- 11 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Quarter', CORE_ORANGE, '12'),
  spacer(100),
  p('Five actions Anderson can take immediately — before any new engagement. Each creates value now and leads into the larger program.'),
  spacer(140),
  calloutBox('1 — Run a Free Nexus Assess Across the Footprint',
    ['Technijian’s Nexus Assess delivers a no-cost risk assessment — internal and external vulnerability, a dark-web credential check, and a Microsoft 365 review — returned as a prioritized remediation roadmap. For a firm holding tenant PII, financial data, and lease documents across 53 properties, it is a concrete, zero-commitment first step that doubles as a compliance head start.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Pick 10 Leases for an Abstraction Pilot',
    ['Choose ten representative leases and let AI abstract them into a searchable summary with source links. It proves the lease-intelligence ROI on real Anderson documents within days, and the team can judge the time saved firsthand.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Claim the "Century City Office Space" Search',
    ['Make sure Anderson Towers and the repositioning have a strong, AI-citable web presence for the exact searches tenants and brokers run. Today these queries are answered by the big REITs and brokerages — not by the owner of the space.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Write the Ares-Anchor Story',
    ['Turn the Ares Management anchor lease into a short, public case story — the kind of credibility signal that courts the next wave of trophy tenants and that AI-assisted content can then amplify across channels.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — List Your Rollover Over the Next 24 Months',
    ['Have the team assemble which leases expire over the next two years. This is the seed of both the retention engine and the portfolio dashboard — and it immediately shows where renewal attention is most urgent.'],
    CORE_BLUE),
);

// ---------- 12 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '13'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 10 and 11 are deliberately conservative — a short discovery call replaces them with Anderson’s real baselines and sharpens the whole program. These questions move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Occupancy & rollover', 'Current vacancy and which leases expire over 24 months', 'Sizes the leasing and retention value'],
      ['Anderson Towers', 'Remaining space to lease and the target tenant profile', 'Focuses Front 1 on the priority asset'],
      ['Lease administration', 'How leases are abstracted and tracked today, and by whom', 'Sizes the lease-intelligence ROI'],
      ['Leasing team', 'Team size, broker relationships, and proposal turnaround', 'Designs the account-intelligence layer'],
      ['Systems', 'Property-management / accounting platform in use (e.g., Yardi, MRI)', 'Defines the integration surface'],
      ['CAM', 'How common-area-maintenance reconciliation is done now', 'Scopes the finance-automation win'],
      ['Reporting', 'What leadership reporting exists and how it is produced', 'Shapes the portfolio dashboard'],
      ['Holdings scope', 'Whether the other Anderson Holdings lines are in scope later', 'Sizes the Phase-3 scale opportunity'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase-1 lease pilot proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Anderson’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 13 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '14'),
  spacer(100),
  p('Anderson Real Estate has the hardest things to build already: a five-decade family track record, a 3.1M sq ft portfolio, and a repositioned Century City campus landing in the strongest office submarket on the West Coast. What it is missing is the operating layer that lets a lean, relationship-driven team move at institutional speed — abstracting leases in minutes, reaching the right tenants through the right brokers, and seeing the whole portfolio in one view. Both fronts are buildable now, on systems Technijian has already delivered.'),
  p('The plan is sequenced to earn trust before scale: prove the lease-intelligence return and switch on leasing visibility first, stand up the account-based leasing engine next, then build the portfolio intelligence layer and extend it across the Anderson Holdings footprint. Small, honest entry; large, earned expansion.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 13 questions and confirm scope — we can run the free Nexus Assess in parallel.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the lease-intelligence pilot and leasing-visibility layer — live inside 14 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to make AI the operating layer under Anderson’s next fifty years?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Ravi Jain, Founder & CEO, Technijian  |  rjain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 14 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '15'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving businesses since 2000. We build and operate the AI systems that let organizations work at scale without losing the personal service that defines them — with a cybersecurity-first, AI-forward approach and a dedicated team assigned to each client.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Anderson', weight: 5 }],
    [
      ['My AI', 'Lease and document intelligence, account intelligence, CAM automation, and institutional-knowledge retention'],
      ['My SEO', 'AEO/GEO leasing visibility and family-brand authority — the cited answer for Westside space'],
      ['My Dev', 'Portfolio-intelligence dashboard, leasing/broker CRM, tenant portal, and integrations — built 3–5× faster'],
      ['Chat.AI', 'The 24/7 tenant-experience assistant across the portfolio'],
      ['Nexus Assess', 'A no-cost IT and security risk assessment for a firm holding tenant PII and financial data'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499 (reaches USA + India)'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted June 8, 2026. Portfolio figures, leadership, and competitor claims are from publicly available sources and to be confirmed with Anderson before external use.', { italics: true }),
  spacer(120),
  p('1. Anderson Real Estate / Anderson Holdings — official sites: andersonrealestate.com, andersonholdings.com (Home, About, Team) — portfolio (53 properties, 3.1M sq ft, 250+ tenants, 9 markets), guiding principles, founding.', { size: 20 }),
  p('2. Business Wire & Los Angeles Business Journal (Jan 2023) — Anderson Towers $100M reposition; Ares Management anchor; William Anderson, Executive Chairman & CEO, Anderson Holdings.', { size: 20 }),
  p('3. TheOrg / Crunchbase / LinkedIn — Anderson Real Estate leadership (Jeffrey R. Anderson, Andrew Evans, Tere M. Throenle, Darren S. Bell) and Rebecca Reyna, Chief of Staff.', { size: 20 }),
  p('4. Wikipedia / LA Business Journal — John E. Anderson, Topa Equities, and the UCLA Anderson School of Management legacy.', { size: 20 }),
  p('5. Avison Young, The Real Deal, Bisnow, IPG, Kidder Mathews — Century City & Westside Los Angeles office market 2025–2026 (rents near $80/sf, flight to quality, leasing recovery).', { size: 20 }),
  p('6. Re-Leased, Propmodo, Commercial Observer, Agora, Prophia — AI in commercial real estate 2026 (lease-abstraction ROI, adoption gap of ~5%, proptech VC of $16.7B in 2025).', { size: 20 }),
  p('7. Technijian service pricing and methodology — My SEO published tiers; My AI, My Dev, Chat.AI, and Nexus Assess scopes; US labor-rate card.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Anderson-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
