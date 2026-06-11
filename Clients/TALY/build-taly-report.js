// Talley and Associates, Inc. — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/VAF/build-vaf-report.js (SCF/ORX/MWAR/RKE lineage).

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
const CHARTREUSE    = strip(tokens.color.secondary.chartreuse.$value);
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
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-05-26';
const CLIENT = 'Talley and Associates';

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
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    pageBreakBefore: true,
    spacing: { before: 0, after: 120, line: 240 },
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
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

function capabilityBox(title, built, applies, kind = 'built') {
  const leadLabel = kind === 'service' ? 'The Technijian Service: ' : 'What Technijian Built: ';
  const leadColor = kind === 'service' ? TEAL : CORE_BLUE;
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
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: leadLabel, size: 20, bold: true, color: leadColor, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Talley and Associates: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'TALLEY & ASSOCIATES', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Government Relations · Public Affairs · Association Management', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Laguna Hills, California  |  talleyassoc.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Talley and Associates, Inc.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1981', label: 'Firm Founded', color: CORE_BLUE },
    { number: '45 Years', label: 'MHP & Land-Use Advocacy', color: CORE_ORANGE },
    { number: '100+', label: 'Named Clients & Associations', color: TEAL },
    { number: '4 Counties', label: 'OC, LA, Riverside & San Bernardino', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Talley and Associates is a relationship business. For 45 years it has won land-use entitlements for property owners, guided mobile-home-park owners through conversions and closures, and managed the trade associations and political action committees of the housing and commercial-real-estate industry — all on the strength of relationships at the staff and elected-official levels of local government that few firms can match. The asset is not a product or a process. It is who the firm knows, what it remembers, and the property-rights reputation it has earned across Orange, Los Angeles, Riverside, and San Bernardino counties.'),
  p('That asset has three exposures, and each is exactly what AI is built to address. First, the firm’s 45 years of expertise is effectively invisible online: talleyassoc.com forwards to a free do-it-yourself website, so the property owners and association boards now searching for help find competitors instead. Second, the regulatory ground the firm watches — the California Legislature, the FPPC, and the agendas of roughly eighty city and county bodies — moves faster and wider than any small team can track by hand. Third, and most important, the institutional knowledge that makes the firm valuable lives in the heads of two senior principals, undocumented.'),
  p('This blueprint is a focused, account-based program with three moves: get known (make the firm’s expertise findable where buyers and the public now search), monitor and mobilize (watch every bill and agenda that can touch a client and surface it the week it moves), and capture and scale (turn 45 years of relationships and matter history into a knowledge base, and automate the association and compliance work that consumes senior time). It is deliberately account-based — Talley already knows who its targets are — and the relationships, the judgment, and the presence at the dais stay exactly where they belong, with the team.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Talley’s moat is 45 years of relationships and a property-rights, mobile-home-park, and land-use mastery few can claim — but that knowledge lives in two people’s heads, and the firm’s online presence (a free DIY site) tells none of it.',
      'The firm wins on depth and timing: knowing which council to call, which bill threatens which client, which jurisdiction is about to change an ordinance. AI watches the Legislature, the FPPC, and roughly eighty local agendas continuously, so nothing affecting a client slips by.',
      'No competitor owns the “California mobile-home-park conversion / property-rights” conversation online. The digitally strong firms are Los Angeles generalists; the local land-use specialists are invisible. That corner is open, and Talley is the firm that has actually earned it.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information. The firm’s internal numbers — active retainer clients, the association and PAC book, the number of jurisdictions tracked, and filing volume — were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call. The specific questions are in Section 15.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE FIRM — THREE PILLARS ----------
docChildren.push(
  ...sectionHeader('The Firm — Three Pillars of Practice', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for Talley starts with how the firm actually earns, because three distinct practices share one engine. The engine is a set of relationships and a regulatory fluency built since 1981; the practices are the three ways the firm puts it to work. They reinforce each other — the same property owners, housing associations, and commercial-real-estate players move between all three — which is why a single AI program lifts the whole firm rather than one service line.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'Three Pillars of Practice', 600, 1.73),
  diagramCaption('Figure 2.0 — Three pillars of practice, one set of relationships, serving the same property-owner and housing universe'),
  spacer(120),
  subHeader('Governmental Relations & Land-Use Advocacy'),
  p('The firm represents private property owners, developers, and businesses at the local level — entitlements, approvals, and property-rights matters before city councils and planning commissions across four counties. Founder Vickie Talley brings the inside view: she served the City of Cypress as Mayor, Councilmember, and Planning Commissioner, and worked in the Los Angeles City Planning Department. Advisor Bill Talley served as city manager for Anaheim, Mission Viejo, Dana Point, Rancho Santa Margarita, Oceanside, and San Clemente. The team’s value is knowing how each jurisdiction actually decides.'),
  subHeader('Mobile-Home-Park Conversions'),
  p('This is the firm’s deepest specialty: representing park owners through the conversion or closure of a mobile-home park since 1981. The work spans the strategy, the preparation of the Conversion Impact Report required under Government Code section 65863.7, tenant mitigation and relocation, and the public and governmental-relations process with the jurisdiction and the community. Vickie Talley qualifies as an expert witness on mobile-home-park conversions and closures and on rental-assistance programs. Few firms in California have done this work longer or know its politics better.'),
  subHeader('Association & PAC Management'),
  p('The firm provides full-service management for non-profit trade associations and their political action committees — a dedicated team and office at a fraction of the cost of a stand-alone operation. The named book is substantial: the Manufactured Housing Educational Trust and its PAC, the California Mobilehome Parkowners Alliance, the NAIOP commercial-real-estate chapters and their PACs, the Urban Land Institute and SIOR district councils, and apartment- and housing-industry associations across Orange County and the Inland Empire. The firm runs the membership, the governance, the events, the reporting, and the advocacy.'),
  spacer(120),
  calloutBox(
    'The Asset Is the Relationships — and the Memory Behind Them',
    [
      'The firm’s record is concrete: more than a hundred named property-owner, developer, and association clients; ten city governments served; and two ballot campaigns run and won (Proposition 199 in 1996 and Huntington Beach’s Measure EE in 2002).',
      'Across the team, that is more than 75 years of relationships at the staff and elected-official levels of local government — the kind of access that is earned over decades and cannot be bought.',
      'Everything in this blueprint is designed to protect that asset and extend its reach — never to replace the relationships that are the firm’s real product.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE REGULATED ENVIRONMENT ----------
docChildren.push(
  ...sectionHeader('The Regulated Environment', TEAL, '03'),
  spacer(100),
  p('Talley operates inside three bodies of regulation, and each is document-heavy, deadline-driven, and spread across many jurisdictions — which is precisely the kind of work AI handles well, with a person reviewing and signing anything sworn. Understanding the load is the first step to removing most of it.'),
  spacer(140),
  subHeader('Political Reform Act, the FPPC, and Local Lobbying Rules'),
  p('Lobbying and PAC work in California is governed by the Political Reform Act of 1974 and administered by the Fair Political Practices Commission. The obligations are recurring and exact: lobbying registration and quarterly disclosure (Forms 604, 615, 625, and 635), and campaign and committee reporting for PAC clients (Forms 460 and 461). Local government advocacy is regulated separately and city by city — Los Angeles, Orange County, Anaheim, and many others maintain their own lobbyist registries and quarterly reports — so a firm working dozens of jurisdictions carries a compliance matrix, not a single calendar. Late or inaccurate filings carry penalties (a late Form 460 accrues a daily fine, and enforcement penalties can reach $5,000 per violation).'),
  spacer(120),
  subHeader('Mobile-Home-Park Conversion Law'),
  p('A park conversion or closure runs on its own statutory track. Government Code section 65863.7 requires the proponent to prepare a Conversion Impact Report addressing the relocation of residents, deliver it to residents well before the hearing, and address relocation costs — a statutory minimum that local agencies often build on. The Mobilehome Residency Law (Civil Code section 798 and following) governs the landlord-tenant relationship in the park, and recent law (AB 2782, 2020) tightened how long-term leases interact with local rent stabilization. The result is a document-heavy, discretionary, and politically charged process — exactly the niche the firm has worked for four decades.'),
  spacer(120),
  subHeader('Land Use, CEQA, and Housing Mandates'),
  p('The firm’s developer and property-owner clients move through CEQA review, housing-element and RHNA mandates, and a fast-changing body of state housing law — the 2025 CEQA reforms (AB 130 and SB 131), transit-oriented upzoning, and ADU streamlining among them — all decided in the same council and planning-commission rooms where the firm already works. Every new bill and ordinance is both a risk to manage and a reason a client picks up the phone.'),
  spacer(120),
  calloutBox(
    'The Compliance Boundary — Assist, Never Auto-File',
    [
      'This is disclosure and recordkeeping compliance, not automated decision-making — a far lower-risk place for AI than, say, credit underwriting. Lobbying disclosures are public record, so monitoring and drafting carry little confidentiality risk.',
      'But filings are sworn and penalized. So AI drafts the forms, tracks every state and local deadline, and runs an accuracy check — and a person at the firm reviews and signs every filing. The technology removes the burden and the deadline risk; it never replaces the signature.',
      'The same principle holds for legislation: AI summarizes a bill and flags what it means for a client, and the firm decides what to do about it.',
    ],
    CORE_BLUE
  ),
);

// ---------- 04 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '04'),
  spacer(100),
  p('Because Talley sells to a finite, nameable set of buyers — property owners, park owners, association boards, and businesses that need a local-government voice — this is an account-based program, not a marketing campaign. The firm’s next engagement comes from four pools, and the team already knows most of the names. The job of AI is to make the firm easy to find when a buyer first searches, to surface the moment a named account needs help, and to free senior time for the relationships that close the work.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.4 },
      { label: 'Who / What', weight: 3.2 },
      { label: 'How Talley Captures It', weight: 4 },
    ],
    [
      ['Land-use & entitlement clients', 'Developers and property owners facing a city-hall approval or a property-rights fight', 'Reputation, referrals, and visible authority in the niche — found first when a buyer searches, then won on the relationship'],
      ['Mobile-home-park owners', 'Owners converting or closing a park, or fighting a rent-control ordinance', 'The 45-year specialist with the expert-witness record and the Conversion Impact Report process — surfaced the moment a hostile bill or ordinance appears'],
      ['Association & PAC contracts', 'Trade-association and PAC boards in housing and commercial real estate', 'Industry fluency plus the MHET and CMPA track record — and the capacity to run a board turnkey, now extended by automation'],
      ['Deeper service to the existing book', 'The 100-plus property owners, developers, and associations already with the firm', 'Capacity freed from admin and monitoring, plus proactive alerts that surface a client’s next need before they ask'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based by Design — No Shotgun Marketing',
    [
      'Talley already knows who its targets are: the property-owner, housing, and commercial-real-estate universe across four counties. The value of AI is depth, timing, and capacity on those named accounts — not a broad consumer funnel.',
      'There is one honest exception, and it is inbound: when a park owner first searches “how to close a mobile home park in California,” the firm should be the cited expert that comes up. That is authority, not lead-gen — it earns the relationship that does the rest.',
      'The relationship stays central throughout. AI surfaces the account and drafts the first pass; the team makes the call, walks the hall, and wins the work.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE TALLEY CLIENT ----------
docChildren.push(
  ...sectionHeader('The Talley Client', CORE_ORANGE, '05'),
  spacer(100),
  p('Four buyer types account for nearly all of the firm’s work. They differ in how often they hire, how much an engagement is worth, and what they worry about — but they share one trait that defines the strategy: each is a named, knowable account, reached through reputation and relationship rather than broad advertising. The cards below profile each buyer, and the matrix places them by engagement volume and strategic value to the firm.'),
  spacer(160),

  personaCard('1 — The Real-Estate Developer / Property Owner', CORE_BLUE, [
    ['Role', 'A developer or owner who needs an entitlement, approval, or property-rights outcome from a city council or planning commission.'],
    ['Pain Points', 'Political and CEQA risk, hostile or unpredictable councils, and timelines that slip when the politics are misread.'],
    ['Decision Driver', 'Track record and access — a firm that knows how this jurisdiction actually decides and who has to be persuaded.'],
    ['AI Opportunity', 'Account dossiers and stakeholder maps on the council and jurisdiction; agenda monitoring; first-pass position letters.'],
    ['Technijian Hook', 'My AI Lead Gen — account intelligence on named jurisdictions. My Dev — the agenda monitor and dossier system.'],
  ]),
  spacer(160),

  personaCard('2 — The Mobile-Home-Park Owner', CORE_ORANGE, [
    ['Role', 'An owner converting or closing a park, or defending one against a rent-control ordinance — the firm’s core client.'],
    ['Pain Points', 'Navigating section 65863.7, surviving local ordinances, relocation compliance, resident organizing, and hostile bills like SB 749.'],
    ['Decision Driver', 'Deep specialization — the firm with 45 years of mobile-home-park wins and the expert-witness credibility.'],
    ['AI Opportunity', 'Monitoring every mobile-home-park bill and local ordinance; drafting the Conversion Impact Report; tracking the politics jurisdiction by jurisdiction.'],
    ['Technijian Hook', 'My AI — document drafting and legislative monitoring. My SEO — own the “mobile-home-park conversion” niche online.'],
  ]),
  spacer(160),

  personaCard('3 — The Trade-Association Board', TEAL, [
    ['Role', 'A volunteer board (MHET, CMPA, NAIOP, ULI) that wants its association run turnkey, without hiring staff.'],
    ['Pain Points', 'Administrative burden, member retention and dues, event and symposium logistics, board reporting, and PAC compliance.'],
    ['Decision Driver', 'Industry fluency and trust — a manager who speaks the members’ language and delivers Sacramento advocacy.'],
    ['AI Opportunity', 'Automating member communications, dues and event workflows, board-report generation, and PAC-filing support.'],
    ['Technijian Hook', 'My Dev — a member portal and ops automation. My AI — newsletters, reporting, and filing assistance.'],
  ]),
  spacer(160),

  personaCard('4 — The Business / Coalition Needing a Local Voice + PAC', GOLD, [
    ['Role', 'A company or coalition that needs a sustained voice at city and county level and a compliant political action committee.'],
    ['Pain Points', 'Cannot track every jurisdiction’s agenda; needs to mobilize fast on a threat; carries campaign-finance compliance risk.'],
    ['Decision Driver', 'Coverage and reliability — a firm that watches the rooms they cannot and keeps the PAC clean.'],
    ['AI Opportunity', 'Multi-jurisdiction agenda monitoring with trigger alerts, and PAC compliance tracking across filings.'],
    ['Technijian Hook', 'My AI Lead Gen — jurisdiction monitoring and triggers. My Security — data governance behind the compliance work.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each buyer by engagement volume and strategic value to the firm — showing which are anchor retainers, which are high-value but episodic, and which represent recurring volume worth deepening.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Talley Client Matrix', 580, 1.50),
  diagramCaption('Figure 5.0 — The Talley Client: Engagement Volume vs. Strategic Value to the Firm'),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  spacer(100),
  p('Talley competes against two kinds of firm: the large Los Angeles and statewide public-affairs generalists that are polished and visible online, and the local Orange County land-use specialists that share Talley’s lane but run thin websites. The pattern across all of them is the opportunity — none pairs Talley’s depth in mobile-home-park and property-rights work with a visible, authoritative online presence.'),
  spacer(140),
  buildTable(
    [
      { label: 'Firm', weight: 2.2 },
      { label: 'Lane', weight: 3.2 },
      { label: 'Posture vs. Talley', weight: 4 },
    ],
    [
      ['Curt Pringle & Associates', 'Anaheim — local land-use entitlement & government affairs', 'The most direct overlap with Talley’s lane — strong local relationships, but a thin brochure website and no content'],
      ['Englander Knabe & Allen', 'Los Angeles — land-use entitlements, ballot measures, crisis comms', 'A digitally sophisticated generalist; the online bar to clear, but not a mobile-home-park or Orange County specialist'],
      ['Cerrell Associates', 'Los Angeles — California’s oldest public-affairs firm (1966)', 'Deep brand and a content-rich site; a generalist whose niche is reputation, not property-rights land use'],
      ['Townsend Public Affairs', 'Newport Beach — advocacy & grant-writing for public agencies', 'Modern, multi-office, strong online — but serves public agencies, a different client base than Talley’s owners'],
      ['California Strategies', 'Statewide — bipartisan state & local advocacy', 'Polished site and named partners; a large-account, statewide player, not an Orange County land-use specialist'],
      ['The Lew Edwards Group', 'Oakland — local ballot- and tax-measure campaigns', 'Campaign specialists for public agencies; adjacent to, not competing in, Talley’s property-owner lane'],
      ['Renne Public Policy Group', 'San Francisco Bay Area — state legislative advocacy', 'Public-agency policy focus; little overlap with mobile-home-park or local entitlement work'],
      ['Probolsky Research', 'Newport Beach — opinion polling & community surveys', 'A complement more than a rival — the research a campaign buys, with a strong, active online presence'],
    ],
  ),
  spacer(200),
  subHeader('Specialization & Digital-Authority Scorecard'),
  p('Reduced to the two things that decide whether a searching buyer finds and trusts a firm — how specialized it is in Talley’s exact lane, and how visible and authoritative it is online — the picture is clear, and it shows Talley holding the specialization no generalist can copy while ceding the digital ground entirely.'),
  buildTable(
    [
      { label: 'Player', weight: 2.6 },
      { label: 'OC / MHP Specialization', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Digital & Content Authority', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.4 },
    ],
    [
      ['Cerrell / Englander K&A', { text: 'Low', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'LA generalist, strong online'],
      ['Townsend / Cal Strategies', { text: 'Low', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'Statewide / public-agency, strong online'],
      ['Probolsky Research', { text: 'Medium', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'Research complement, visible'],
      ['Curt Pringle & Associates', { text: 'High', color: PASS, align: AlignmentType.CENTER }, { text: 'Low', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Closest rival, thin online'],
      [{ text: 'Talley (today)', bold: true }, { text: 'Highest', color: PASS, align: AlignmentType.CENTER, bold: true }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Deep specialist, invisible online', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 6.0 plots the field on those two axes. Talley sits where its depth is greatest and its visibility is lowest — the bottom-right. The move is straight up: keep the specialization, add the online authority, and own a corner no rival holds.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Specialization vs. Digital Authority', 580, 1.50),
  diagramCaption('Figure 6.0 — Competitive Positioning: OC / MHP & Land-Use Specialization vs. Digital & Content Authority'),
  spacer(160),
  calloutBox(
    'Where Talley Wins — The White Space',
    [
      'The top-right corner — deep Orange County, mobile-home-park, and land-use specialization paired with visible online authority — is empty. The digitally strong firms are Los Angeles generalists; the local land-use specialists are invisible online. Talley can hold a corner neither reaches.',
      'No firm owns the “California mobile-home-park conversion” and “property-rights land use” conversation in search or AI answers. Talley has the deepest real expertise in it — it simply has never published.',
      'The nearest rival, Curt Pringle & Associates, shares the lane but runs a thin site with no content. A modest authority program puts daylight between the two.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For a 45-year firm with a named book of more than a hundred clients and fifteen-plus associations and PACs, the digital presence materially under-represents the practice — and it matters precisely when a buyer’s first move is an online search and an association board vets a manager on the web before the referral conversation ever happens.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Website', 'talleyassoc.com forwards to a free do-it-yourself site — thin pages, no team bios, no case results', 'Undercuts credibility with sophisticated buyers and is nearly invisible to search and AI answer engines'],
      ['Authority content', 'No articles, explainers, or thought leadership on mobile-home-park law or land use', 'The exact questions buyers search return competitors or nothing — 45 years of expertise earns no search authority'],
      ['Answer-engine (GEO) presence', 'Not cited by Google AI, ChatGPT, or Perplexity for the niche', 'As buyers shift to AI answers, an invisible firm is left out of the shortlist before a call is ever made'],
      ['Institutional knowledge', 'Relationships, park histories, and jurisdiction playbooks held in two principals’ heads', 'A continuity and enterprise-value risk — addressed directly in Section 08'],
      ['Association web presence', 'Member experience for MHET and CMPA is light and largely manual', 'Member growth and engagement left on the table; a clear automation opportunity'],
      ['Pipeline & monitoring', 'No system tying the named-account universe or jurisdiction agendas together', 'Monitoring and outreach are manual and reactive rather than continuous'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making a proven, four-decade practice look and work as modern as it already is.',
      'A real website, niche authority content, and a knowledge base are low-cost, compounding moves that raise credibility with property owners, developers, and boards alike.',
      'They are also the natural first ninety days: fix the foundation and the story, then build the monitoring and knowledge engine on top of it.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a park owner or developer asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Who can help me close or convert a mobile home park in California?"', [
    'TODAY — the AI assistant answers with whichever firms and resources have the strongest content and signals it can read: it names a couple of statewide law firms and general consultants, points to the Government Code section 65863.7 process, and does NOT mention Talley and Associates — even though Talley has done this work since 1981, has the expert-witness record, and knows the politics jurisdiction by jurisdiction. The firm is invisible at the exact moment a buyer is forming a shortlist.',
    'AFTER GEO — the same query returns Talley as a cited option ("Talley and Associates has specialized in California mobile-home-park conversions and the Conversion Impact Report process since 1981…"), with the authority explainers and a credible site as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result would be captured as the baseline at engagement start.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter Talley is not cited, the assistants learn to answer "how to close a mobile home park in California" with someone else — and that default, once set in the training and retrieval data, is far harder and more expensive to dislodge than to claim now. No competitor owns this niche today; the nearest rival, Curt Pringle & Associates, runs a thin site with no content. That window is widest before anyone builds an AI presence. The cost of waiting is not zero — it is a competitor, or a generalist law firm, becoming the default answer in the one conversation Talley has actually earned.'),
);

// ---------- 08 THE INSTITUTIONAL-KNOWLEDGE RISK ----------
docChildren.push(
  ...sectionHeader('The Institutional-Knowledge Risk', DARK_CHARCOAL, '08'),
  spacer(100),
  p('This section names the risk that matters most, because it is the one that is hardest to see and most expensive to ignore. Talley’s entire value is concentrated in the experience and relationships of two senior principals. That is the strength of a relationship firm — and its single point of failure.'),
  spacer(140),
  p('Research on relationship-based professional-services firms is blunt about the pattern: the knowledge that runs the business lives in the founder’s head, not in documented processes, and clients hold their relationship with the principal, not the firm. That makes any transition fragile and personal. For Talley, the irreplaceable knowledge is specific and deep — which city managers and councilmembers to call across roughly eighty cities, how each jurisdiction actually handles a mobile-home-park conversion, the history and the players in every park fight and entitlement since 1981, and the relationships behind every association and PAC on the books.'),
  spacer(60),
  p('The mitigation is not dramatic, and it does not change how the firm works. It is to institutionalize and automate: capture the relationship history, the regulatory playbooks, and the case precedents into a secure, queryable knowledge base before they walk out the door. Done well, it protects continuity, makes a junior associate productive in months instead of years, and protects the enterprise value of the firm itself — the value that any future transition or sale depends on.'),
  spacer(120),
  calloutBox(
    'Capture the Knowledge Before It Walks Out the Door',
    [
      'The firm’s balance sheet is its relationships and its memory. Today both are undocumented and concentrated in two people — an exposure no insurance policy covers.',
      'A private, secure AI knowledge base turns 45 years of files, matters, and relationships into something the whole team can query: “What happened the last time we converted a park in this city? Who was on the council? What did the Impact Report argue, and what worked?”',
      'It is succession insurance, a training accelerator, and an enterprise-value protector at once — and it is the cleanest, highest-conviction place to start.',
    ],
    CORE_BLUE
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services Talley would engage. Each is labeled for what it is, and each maps to a specific Talley use case. The flagship is first, because it is the firm’s highest-conviction need.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'This is the direct answer to the institutional-knowledge risk: turn 45 years of relationships, park histories, and jurisdiction playbooks into a secure knowledge base the team can query — succession insurance and a training accelerator in one.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates complex due-diligence questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review.',
    'Pointed at the firm’s document load, the same approach drafts a first-pass Conversion Impact Report, summarizes staff reports and ordinances, and prepares position letters in minutes — the team finalizes and signs.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70%.',
    'This is how Talley gets known: a steady stream of mobile-home-park and land-use explainers that make the firm the cited expert in Google AI, ChatGPT, and Perplexity for a niche no competitor has claimed.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a design that cross-checks each conclusion instead of trusting a single pass.',
    'That cross-checked review is the right pattern for sworn work: an accuracy QA on FPPC and PAC filings and on Conversion Impact Reports before a person at the firm reviews and signs.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Talley Would Engage'),
  capabilityBox(
    'My AI Lead Gen — Account & Legislative Intelligence',
    'My AI Lead Gen is Technijian’s productized account-intelligence service — it harvests and enriches high-fit targets and signals from public data and delivers prioritized, monitored account lists rather than a generic data subscription.',
    'For Talley it watches the named-account universe and the regulatory field — the Legislature, the FPPC, and roughly eighty jurisdiction agendas — and surfaces the trigger events (a hostile bill, a new ordinance) that mean a specific client needs the firm now.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle that integrates Claude Code, Figma Make, GitHub, and CI/CD to ship portals, trackers, and integrations around a client’s actual process.',
    'This builds the working tools: the legislative and agenda monitor, the multi-jurisdiction FPPC and PAC compliance tracker, the institutional-knowledge base, and a member portal for the associations.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Security — Security & Compliance, Built In',
    'My Security is Technijian’s managed security service: every system is designed security-first, with role-based access, audit trails, and SOC 2, HIPAA, PCI-DSS, and GDPR-aligned controls built in rather than bolted on.',
    'For Talley this keeps client strategy and the knowledge base private and access-controlled — the data governance that sits behind any AI-assisted compliance and document work.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task'),
  p('A fair question about running AI across authority content, legislative monitoring, and compliance drafting: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors (Claude, GPT-4o, and Gemini) and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final position-letter voice, compliance-critical answers, deepest reasoning on a sworn filing', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — authority content, bill summaries, account dossiers, Impact Report first passes', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, extraction, tagging agendas and ordinances across roughly eighty jurisdictions', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Talley pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single mobile-home-park explainer, for example, is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 10 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Talley Leadership', CORE_BLUE, '10'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Talley sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that Vickie and the team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t'),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "summarize this bill and flag what it means for a park-owner client." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch every jurisdiction agenda and decide what to surface." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Talley starts with simple automations that pay off in the first 90 days — bill summaries, deadline tracking, knowledge capture — and adds autonomous agents only where the value is proven, which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Talley Sits Today — The AI Maturity Ladder'),
  p('Most established, relationship-driven firms — including Talley — sit at the first rung of the widely-used five-stage AI maturity model (a model consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Talley Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      [{ text: '1. Foundational', bold: true }, { text: 'Little or no AI; manual, people-dependent processes — the firm’s knowledge and monitoring live in two principals’ heads', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['2. Emerging', 'A first AI tool or two in use, but AI is not yet woven into growth or operations', ''],
      ['3. Operational', 'AI runs specific workflows day-to-day — monitoring, content, compliance — with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and operations with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the business runs and competes', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Talley sits at the Foundational stage today — no AI in the practice, and the firm’s expertise undocumented. This report is the plan to reach Operational — AI working in the growth engine and inside the firm — within twelve months. The first move (capturing the institutional knowledge) is also the highest-conviction one.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages'),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a regulated firm like Talley, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything client-facing or sworn — AI drafts, a person at the firm reviews and signs every FPPC/PAC filing and Impact Report'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — client strategy and the knowledge base never touch a public model; lobbying disclosures are already public record'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — FPPC-ready, led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Organizations Are Already Doing'),
  bullet('Professional-services firms: relationship-driven firms are capturing decades of founder knowledge into a secure, queryable base before key people retire — protecting continuity and enterprise value.'),
  bullet('Government-affairs and advocacy: advocacy teams are using legislative-monitoring AI to catch a threatening bill the week it moves rather than the month it passes — getting ahead of it instead of reacting.'),
  bullet('Regulated, document-heavy businesses: firms with deadline-driven filings are turning multi-day document and compliance assembly into a minutes-long, audit-ready draft — responding to more matters with the same team.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Talley’s own numbers would be confirmed in discovery. Technijian’s specific, documented results from prior builds appear in Section 9 (Capability Proof).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — A Talley Associate'),
  calloutBox('Before vs. After AI', [
    'TODAY: An associate learns of a hostile bill or a new rent-control ordinance by chance, scrambles to reconstruct which clients it touches, hunts through old files for the last time the firm fought a similar fight in that city, and drafts a position letter from a blank page — all while the filing deadlines for a dozen PAC clients sit on a manual calendar.',
    'WITH AI: A monitor flags the bill the week it moves and maps it to the affected clients automatically; the knowledge base answers "what did we argue the last time we converted a park in this city, and who was on the council?" in seconds; an AI assistant drafts the first-pass position letter and tracks every state and local deadline — the associate reviews, sharpens, and the principal signs. The expertise is captured in a system, so it survives a retirement and makes a new hire productive in months.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself'),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but Talley assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 11 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Talley’s Growth Engine', CORE_BLUE, '11'),
  spacer(100),
  p('The engine runs three motions at once: get known (make 45 years of expertise findable where buyers and the public now search), monitor and mobilize (watch every bill and agenda that can touch a client and surface it the week it moves), and capture and scale (institutionalize the firm’s knowledge and automate the association and compliance work that consumes senior time). The first builds authority, the second is the account-based engine, and the third protects and scales the firm.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Talley AI Growth Engine', 600, 1.61),
  diagramCaption('Figure 11.0 — The Engine: Get Known, Monitor & Mobilize, and Capture & Scale'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.7 },
      { label: 'Tool', weight: 2.5 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.7 },
      { label: 'Technijian Service', weight: 1.7 },
    ],
    [
      ['Get Known', 'Modern site + niche authority content', 'Replace the DIY site and publish the MHP and land-use explainers buyers search', 'Search citations', 'My SEO'],
      ['Get Known', 'Answer-engine (GEO) optimization', 'Become the cited expert in Google AI, ChatGPT, and Perplexity for the niche', 'AI-answer mentions', 'My SEO'],
      ['Get Known', 'Track-record & reputation pages', 'Make the 100-plus client roster and 45-year record visible and credible', 'Inquiries', 'My SEO'],
      ['Monitor & Mobilize', 'Legislative monitor (Sacramento + FPPC)', 'Flag a bill that threatens a client, like SB 749, the week it moves', 'Threats caught early', 'My AI Lead Gen'],
      ['Monitor & Mobilize', 'Multi-jurisdiction agenda monitor', 'Track roughly eighty city and county agendas — no hearing or ordinance missed', 'Agendas tracked', 'My Dev'],
      ['Monitor & Mobilize', 'Account dossiers + stakeholder maps', 'Who sits on each council, how they vote, who to persuade — before the meeting', 'Prep time saved', 'My AI Lead Gen'],
      ['Monitor & Mobilize', 'Position-letter & testimony drafts', 'First-pass advocacy documents in minutes; the team finalizes and signs', 'Hours recovered', 'My AI'],
      ['Capture & Scale', 'Institutional-knowledge base', 'Query 45 years of relationships, park histories, and jurisdiction playbooks', 'Continuity protected', 'My Dev'],
      ['Capture & Scale', 'FPPC / PAC compliance tracker', 'Multi-jurisdiction filing deadlines and accuracy QA — a human signs', 'Penalties avoided', 'My Dev'],
      ['Capture & Scale', 'Association-ops automation', 'Member comms, dues, events, and board reports for MHET and CMPA', 'Admin hours recovered', 'My Dev'],
      ['Capture & Scale', 'Conversion Impact Report drafting', 'First-pass Impact Reports and staff-report summaries — faster turnaround', 'Turnaround time', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI monitors, drafts, and remembers — it does not lobby. The relationships, the calls to city hall, and the testimony at the dais stay with Vickie and the team. AI gives them more reach, faster preparation, and a memory that does not retire.',
      'For anything sworn — every FPPC and PAC filing, every Impact Report — a person at the firm reviews and signs. The technology removes the burden and the deadline risk; it never replaces the judgment or the signature.',
      'That boundary is the point: Talley gets the reach and the capacity without putting its name on anything it has not checked.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 12 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '12'),
  spacer(100),
  p('The model below is built from public information and conservative assumptions, because the firm’s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 15 replace them with real baselines. The logic is deliberately modest — a relationship firm does not need a flood of leads, it needs capacity, memory, and reach — and it holds across a wide range of inputs.'),
  spacer(120),
  calloutBox(
    'AI as a Managed Investment — Not a Leap of Faith',
    [
      'The reason most AI spending disappoints is not the technology — it is the lack of measurement. Industry surveys find that a large majority of companies now use AI in some form, but only a minority report a clear profit impact; the difference is discipline, not budget.',
      'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost — and if a pilot does not clear its cost at the gate, we stop and re-scope. Talley carries the upside, not blind risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility Pilot'),
  p('Start with one clearly-scoped program rather than an open-ended engagement. The pilot fixes the digital foundation, stands up Talley’s answer-engine presence in the mobile-home-park and land-use niche, and begins capturing the institutional knowledge — and it proves the lift before any larger build is discussed.'),
  buildTable(
    [{ label: 'What’s Included', weight: 3 }, { label: 'Detail', weight: 4 }, { label: 'Investment', weight: 2 }],
    [
      [{ text: 'My SEO — Authority & Answer-Engine (GEO)', bold: true }, 'A modern website to replace the DIY site; the first MHP and land-use authority explainers; GEO/AEO setup so AI answers begin to cite the firm', '$1,500/mo = $18,000/yr'],
      [{ text: 'My AI — Executive AI Workshop', bold: true }, 'A leadership session for Vickie and the team: AI roadmap, priorities, and the knowledge-capture kickoff', '$5,000 one-time'],
      [{ text: 'My AI — Fractional AI Advisor (Starter)', bold: true }, 'Monthly strategy sessions: authority-content direction, monitoring priorities, and the knowledge-capture program', '$2,000/mo = $24,000/yr'],
      [{ text: 'ENTRY PROGRAM — YEAR 1', bold: true }, 'Fixed scope, published rates, no large up-front build', { text: '~$47,000', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_BLUE },
  ),
  spacer(120),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, the firm has a credible modern site live and is cited by at least one major AI answer engine (Google AI, ChatGPT, or Perplexity) for a high-intent mobile-home-park or property-rights query — a corner no competitor has claimed.',
      'Our commitment: the entry program is month-to-month after the initial term — no long lock-in, no obligation to continue if it doesn’t hit the metric by day 90. If the pilot has not moved the needle, we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3.2 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['Jurisdictions monitored', 'A few, manually', 'Legislature + FPPC + ~80 agendas', 'Nothing slips'],
      ['Time to draft a letter or Impact Report', 'Hours to days, manual', 'Minutes, AI-drafted first pass', 'Capacity freed'],
      ['Client trigger alerts (bill / ordinance)', 'Reactive', 'Proactive, same-week', 'Threats caught early'],
      ['Filing deadlines (state + local)', 'Manual calendar', 'Tracked and accuracy-checked', 'Penalties avoided'],
      ['Association admin hours', 'Senior-time heavy', 'Automated workflows', 'Margin and scale'],
      ['Online authority in the niche', 'Invisible', 'Cited expert', 'New inquiries'],
      ['Institutional knowledge', 'In two principals’ heads', 'Queryable knowledge base', 'Continuity protected'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model (Estimated, Conservative Assumptions)'),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Conservative', weight: 2.1 },
      { label: 'Target', weight: 2.1 },
      { label: 'Aggressive', weight: 2.1 },
    ],
    [
      ['New retained engagements (Y1)', '+2', '+4', '+6'],
      ['Illustrative blended value per engagement*', '$60,000', '$60,000', '$60,000'],
      ['Incremental revenue (Y1)', '+$120,000', '+$240,000', '+$360,000'],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$108,600', bold: true }, { text: '~$108,600', bold: true }, { text: '~$108,600', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '1.1x', bold: true, color: PASS }, { text: '2.2x', bold: true, color: PASS }, { text: '3.3x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* The blended annual value of a new engagement — a retainer plus project work for an entitlement client, a park conversion, or an association-management contract — is an illustrative, deliberately conservative placeholder of about $60,000, to be replaced with Talley’s actual retainer economics in discovery. The ratio counts only new engagements. It does not count the value the program also delivers: senior capacity recovered from admin and monitoring, filing penalties avoided (a daily fine plus up to $5,000 per violation across many jurisdictions), clients retained because a threat was caught early, and the firm’s enterprise value protected by capturing its institutional knowledge. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Technijian Service Investment Map'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'Scope', weight: 3.6 },
      { label: 'Monthly', weight: 1.4 },
      { label: 'Y1 Total', weight: 1.4 },
    ],
    [
      ['My AI — Fractional AI Advisor', 'AI program leadership, the institutional-knowledge-capture program, and AI governance', '$2,000/mo', '$24,000'],
      ['My AI Lead Gen — Account & Legislative Intelligence', 'Monitoring the Legislature, the FPPC, and named-jurisdiction agendas; trigger alerts and account dossiers (Starter to Professional)', '$1,499/mo', '$17,988'],
      ['My SEO — Authority & Answer-Engine (GEO)', 'A modern website plus MHP and land-use authority content to own the niche in search and AI answers', '$1,500/mo', '$18,000'],
      ['My Dev — Managed App Services', 'Hosting, monitoring, and ongoing enhancement of the monitor, tracker, and portal', '$800/mo', '$9,600'],
      ['My Dev — Custom Build (one-time, phased)', 'The legislative and agenda monitor, the multi-jurisdiction FPPC / PAC compliance tracker, the institutional-knowledge base, and an association member portal', '—', '$34,000'],
      ['My AI — Executive AI Workshop (one-time)', 'A leadership session plus the knowledge-capture kickoff', '—', '$5,000'],
      [{ text: 'YEAR-1 TOTAL INVESTMENT', bold: true }, { text: 'Recurring $5,799/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$108,600', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'A relationship firm does not need more leads; it needs capacity, memory, and reach. Two to four new engagements a year — an entitlement client, a park conversion, a new association contract — cover the program, and the firm already knows who those prospects are.',
      'The program pays back in ways the ratio does not count: senior hours recovered from admin and monitoring, penalties avoided on multi-jurisdiction filings, and clients retained because a threat was caught the week it was introduced, not the month it passed.',
      'It is phased — start with the knowledge base, the site, and the monitoring, prove the capacity gains, then scale — which lowers the entry point and de-risks the spend.',
    ],
    CORE_BLUE
  ),
);

// ---------- 13 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '13'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence suited to a regulated professional-services firm: capture the knowledge and fix the foundation first, then stand up the monitoring and the authority content, then scale the operations and turn the knowledge base into a true succession asset. Real gains — a working knowledge base, a credible site, live monitoring — are visible inside the first ninety days; the deeper builds are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Talley 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 13.0 — Talley Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation & Capture (Days 1–90)', { color: CORE_BLUE }),
  p('Start with the highest-conviction move — capturing the knowledge — and fix the digital foundation.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Knowledge Base & Workshop', 'Stand up the secure institutional-knowledge base and begin capturing relationships, park histories, and jurisdiction playbooks. Run a leadership AI workshop to align on priorities and governance.'],
      ['1.2 — Site & Authority Foundation', 'Replace the do-it-yourself site with a modern, credible website; publish the first mobile-home-park and land-use explainers; and set up the firm’s answer-engine (GEO) presence.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Monitor & Authority (Days 91–180)', { color: TEAL }),
  p('Turn on the account-based engine and build the authority cadence.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Legislative & Agenda Monitor Live', 'Stand up monitoring of the California Legislature, the FPPC, and named-jurisdiction agendas, with trigger alerts mapped to each client’s interests.'],
      ['2.2 — Compliance Tracker & Content', 'Launch the multi-jurisdiction FPPC and PAC filing tracker with deadline and accuracy support, and scale the authority-content cadence in the niche.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Succession (Days 181–365)', { color: CORE_ORANGE }),
  p('Scale the operations and convert the knowledge base into lasting enterprise value.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Association Portal & Ops Automation', 'Bring member communications, dues, events, and board reporting automation into production for MHET and CMPA, and put document drafting (Impact Reports, position letters) to work.'],
      ['3.2 — Scale & Succession', 'Deepen the knowledge base into a true succession asset; run account dossiers and targeted outreach across the named universe; and deliver an ROI dashboard against the Section 15 baselines.'],
    ],
  ),
);

// ---------- 14 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '14'),
  spacer(100),
  p('Five actions Talley can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Claim the Google Business Profile and Fix the Redirect',
    ['Make sure a property owner searching “Talley and Associates” or “mobile home park consultant Orange County” finds a complete, credible listing — and that talleyassoc.com resolves to a real page, not a forward. It is the first thing a buyer sees, and it costs nothing.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Set Alerts on the Threats That Matter',
    ['Set Google Alerts on SB 749, on “mobile home park rent control” for your key cities, and on your top clients’ names. A hostile bill or a new ordinance should land in the inbox the week it moves, not the month after it passes.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Publish One Plain-Language Explainer',
    ['Write a single page answering the question a park owner actually searches: what it takes to close or convert a mobile-home park in California. It seeds the authority content and starts earning the search trust competitors have left on the table.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Start the Knowledge Inventory',
    ['List the top fifty relationships and the last twenty park or entitlement matters in one document. It costs nothing, and it is the first deposit into the knowledge base that protects the firm’s most valuable and least-documented asset.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Put Every Filing Deadline on One Calendar',
    ['Pull every state and local FPPC and PAC filing deadline for every association and PAC client onto a single, shared calendar. It is a free way to de-risk the penalties now, before the system automates the tracking later.'],
    CORE_BLUE),
);

// ---------- 15 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '15'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 12 and 13 are deliberately conservative estimates — a short discovery call replaces them with Talley’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Client & engagement mix', 'Active retainer clients, new engagements per year, and typical retainer and project values', 'Calibrates the ROI model'],
      ['Association book', 'Which associations and PACs are managed today, their size and dues, and confirming the scope of Orange County Housing Providers', 'Sizes the association-automation opportunity'],
      ['Jurisdictions', 'How many city and county agendas the team tracks today, and how', 'Scopes the monitoring build'],
      ['Compliance load', 'The number of FPPC and PAC filings per cycle and the current process', 'Sizes the compliance-tracker payback'],
      ['MHP pipeline', 'Active conversion or closure matters and current Impact Report turnaround', 'Sizes the document-intelligence value'],
      ['Team & succession', 'Headcount, who holds which knowledge, and any continuity plan', 'Shapes the knowledge-capture priority'],
      ['Systems', 'Current CRM, document, and association-management tools', 'Defines the build and integration surface'],
      ['Marketing ownership', 'Who, if anyone, owns the website and outreach today', 'Defines the authority-content workflow'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Talley’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 16 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '16'),
  spacer(100),
  p('The honest answers to the questions Talley leadership is most likely asking right now.'),
  spacer(140),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We don’t really do marketing — won’t this turn us into a lead-gen shop?', bold: true }, 'No. This is account-based, not a funnel. The firm keeps winning on relationships and referrals; we simply make sure that when a park owner or a board first searches, Talley is the cited expert that comes up — and we capture and automate the back-office work that consumes senior time. Whoever helps with the website today can keep doing so; we add the AI layer no marketing shop provides.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — knowledge capture, bill summaries, deadline tracking — not autonomous "agents" doing the firm’s job. We use the simplest tool that works, measure it, and only expand what earns its place. The lobbying still happens at city hall, by your team.'],
      [{ text: 'Is our data — client strategy, the knowledge base — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything sworn or client-facing, led by a CISSP-certified team. Lobbying disclosures are already public record, so monitoring carries little confidentiality risk — but client strategy is locked down with role-based access and audit trails.'],
      [{ text: 'We’re a small team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give the team back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing and signing what we draft. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 12), month-to-month with no long lock-in. If it has not moved the needle by day 90 — a credible site live and a first AI-answer citation in the niche — you are under no obligation to continue, and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry program is approximately $47K for Year 1 at published rates — no hidden fees, no large up-front build. The full Year-1 program, profiled in Section 12, runs about $108,600 and is phased so you prove the capacity gains before scaling.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 17 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '17'),
  spacer(100),
  p('Talley already has the hard things: 45 years of relationships at the staff and elected level, a mastery of mobile-home-park and land-use law few firms can match, and a named book of property owners, developers, and associations across four counties. What it has not yet done is make that expertise visible where buyers now search, watch every bill and city hall that can affect a client, or capture the institutional knowledge that today lives in two people’s heads.'),
  p('The opportunity is concrete: get known as the cited authority in a niche no competitor has claimed, monitor and mobilize across every jurisdiction so nothing affecting a client slips by, and capture and scale the firm’s knowledge and association work so senior time goes to the relationships that win. A focused, account-based program does all three — and the relationships, the judgment, and the presence at the dais stay exactly where they belong, with the team.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 15 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the knowledge base, the new site, and the legislative monitoring — live inside 30 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to make 45 years of relationships impossible to lose — and impossible to miss?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 18 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '18'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional firms compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Talley and Associates', weight: 5 }],
    [
      ['My AI', 'AI strategy and builds — the institutional-knowledge base, document drafting for Impact Reports and position letters, and filing accuracy QA, with governance throughout'],
      ['My AI Lead Gen', 'Account and legislative intelligence — monitoring the Legislature, the FPPC, and roughly eighty jurisdiction agendas and surfacing the trigger events that matter to named clients'],
      ['My Dev', 'Custom, AI-native builds — the legislative and agenda monitor, the multi-jurisdiction compliance tracker, the knowledge base, and the association member portal'],
      ['My SEO', 'A modern website and mobile-home-park and land-use authority content that make the firm the cited expert in search and AI answers'],
      ['My Security', 'Privacy and access control for client strategy and the knowledge base — the governance behind AI-assisted compliance and document work'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '(949) 379-8500'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and firm intelligence gathered via public web research conducted May 2026. Firm details (founding year, leadership, client and association roster, and contact information) are drawn from public sources and the firm’s own website and should be confirmed with Talley before external use.', { italics: true }),
  spacer(120),
  p('1. Talley and Associates — talleyassoc.com (forwarding to talleyassoc.weebly.com): Home, Who We Are, Governmental Relations, MHP Conversions, Association Management, Clients, and Contact pages.', { size: 20 }),
  p('2. Leadership & history — Vickie Talley (founder; former Mayor, Councilmember, and Planning Commissioner of Cypress; former Los Angeles City Planning Department; Executive Director of MHET) and Bill Talley (advisor; former city manager of Anaheim, Mission Viejo, Dana Point, Rancho Santa Margarita, Oceanside, and San Clemente). Firm founded 1981.', { size: 20 }),
  p('3. Clients & associations — MHET and MHET PAC, California Mobilehome Parkowners Alliance (CMPA), CMHCA, NAIOP Inland Empire and SoCal chapters and PACs, ULI and SIOR district councils, AAGIE, SCAA, IEHC; city clients (Anaheim, Chino Hills, Dana Point, Garden Grove, Mission Viejo, Newport Beach, Oceanside, Rancho Mirage, Rancho Santa Margarita, San Clemente); ballot campaigns (Proposition 199, 1996; Huntington Beach Measure EE, 2002).', { size: 20 }),
  p('4. Competitors — Curt Pringle & Associates, Englander Knabe & Allen, Cerrell Associates, Townsend Public Affairs, California Strategies, The Lew Edwards Group, Renne Public Policy Group, and Probolsky Research.', { size: 20 }),
  p('5. Regulation — California Political Reform Act of 1974 and the FPPC (lobbying Forms 604/615/625/635; campaign Forms 460/461); local lobbying ordinances (Los Angeles Ethics Commission, Orange County, Anaheim); Government Code section 65863.7 (Conversion Impact Report); Mobilehome Residency Law (Civil Code section 798 et seq.); AB 2782 (2020).', { size: 20 }),
  p('6. Legislative & market context — SB 749 (2025–26), SB 610 (2025), AB 2399 / AB 2387 / AB 2247 (2024); CEQA reform AB 130 / SB 131 (2025); industry bodies WMA, MHI, and CMHI; and the AMC Institute association-management model.', { size: 20 }),
  p('7. Technijian service pricing — My AI Lead Gen (Starter $1,499 / Professional $3,499 / Enterprise $6,999), My AI, My SEO, My Dev, and My Security rate cards.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Talley-Associates-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
