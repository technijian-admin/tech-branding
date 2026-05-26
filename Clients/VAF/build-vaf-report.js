// VIA Auto Finance, LLC (a CUSO) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/SCF/build-scf-report.js (ORX/MWAR/RKE lineage).

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
const CLIENT = 'VIA Auto Finance';

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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to VIA Auto Finance: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'VIA AUTO FINANCE', size: 60, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Indirect Auto Lending — A Credit Union Service Organization', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California  |  viaautofinance.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for VIA Auto Finance', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '2022', label: 'CUSO Launched', color: CORE_BLUE },
    { number: '$350M+', label: 'Originations in Under 3 Years', color: CORE_ORANGE },
    { number: '10,000+', label: 'New Credit-Union Members', color: TEAL },
    { number: '5 → 20+', label: 'States, Today to Planned', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('VIA Auto Finance is a Credit Union Service Organization. It originates, underwrites, and prices prime and near-prime auto loans through car dealerships, and its partner credit union, American Heritage, funds and services them while the borrower becomes a member. In under three years that model has produced more than $350 million in originations and roughly ten thousand new members, and VIA is now expanding from five states toward twenty-plus and recruiting additional credit-union partners onto the platform.'),
  p('VIA’s growth comes down to a simple equation: more dealers, more funded loans per dealer, and a protected return for the credit union that funds it all. The structural advantage is real. Because the loans are funded by credit-union deposits, VIA carries a cost-of-capital edge that the independent finance companies and the venture-backed fintechs simply do not have. The gap is operational, not financial: dealers now choose a lender on funding speed, not rate, and VIA is still largely manual, with no public dealer portal and no AI in the workflow.'),
  p('This blueprint is a focused, account-based program with three moves: win more dealers (AI account intelligence that prioritizes the right rooftops and captures the relationships competitors are abandoning), fund faster and safer (document verification and fraud screening that turn days into minutes and protect the credit union’s return), and protect and scale (explainable, audit-ready compliance plus the platform credibility to bring on the next credit-union partner). It is deliberately account-based, because VIA already knows who its targets are, and there is no consumer marketing in it.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'VIA’s credit-union deposit funding is a cost-of-capital moat no independent or fintech rival has — but dealers now choose on funding speed, and VIA is still manual. Pair the moat with AI funding-speed and VIA owns a corner no one else can reach.',
      'Growth is gated by dealer count. AI account intelligence multiplies a finite field team across the 20-state expansion — and competitor retrenchment (Prestige, Truist, the Tricolor collapse) is freeing up dealer relationships right now.',
      'Every play protects the relationship that funds everything — the credit union’s return — through faster, cleaner, fraud-screened, and explainable originations. That protection is what grows the program’s capacity and brings on the next CU partner.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: VIA’s internal metrics (active dealer count, annual origination run-rate, time-to-fund, and the CUSO’s per-loan economics) were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call — the specific questions are in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE BUSINESS MODEL ----------
docChildren.push(
  ...sectionHeader('The Business Model — A Credit-Union-Backed CUSO', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for VIA has to start with how the business actually works, because the structure is unusual and it drives everything. VIA is not a balance-sheet lender. It is the dealer-acquisition, origination, and underwriting engine; American Heritage Credit Union is the balance sheet and the servicer. A dealer submits a deal, VIA originates and prices it, the loan is awarded to the credit union, the credit union funds and services it, and the borrower becomes a member. VIA earns CUSO economics on each loan; the credit union gains higher-return auto assets and new members.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The CUSO Model — Three Parties, One Loan', 600, 1.73),
  diagramCaption('Figure 2.0 — The CUSO model: VIA originates and underwrites, the credit union funds and services, the borrower becomes a member'),
  spacer(120),
  subHeader('Two Customers, Not One'),
  p('The non-obvious consequence is that VIA has two customers it must win and keep, and a growth program has to serve both:'),
  bullet('The dealer, who sources the paper. VIA wins dealers with fast approvals, workable near-prime structures, and reliable funding — a relationship driven by a field-sales team.'),
  bullet('The funding credit union, which puts up the capital and services the loan. VIA keeps it by delivering return, clean credit quality, member growth, and airtight compliance — which is also what makes the program worth expanding and what attracts the next credit-union partner.'),
  spacer(120),
  subHeader('What VIA Already Does Well'),
  p('The CUSO is built on real strengths, each of which gets sharper with AI behind it:'),
  bullet('A credit-union deposit funding base — a lower cost of capital than the independents that depend on the asset-backed-securities market, whose subprime spreads widened after the 2025 Tricolor collapse.'),
  bullet('A prime and near-prime focus — the safer side of a market seeing record subprime delinquency — with customized underwriting designed alongside the credit union’s risk team.'),
  bullet('A seasoned, experienced field-sales team driving dealer relationships market by market.'),
  bullet('A proven, repeatable platform — $350 million originated and ten thousand members created — that can be offered to additional credit unions.'),
  spacer(120),
  calloutBox(
    'The Funding Moat Is the Whole Game',
    [
      'Credit-union deposit funding gives VIA a cost-of-capital advantage that the venture-backed fintechs and the ABS-dependent independents cannot match. That is a durable, structural edge.',
      'But a funding edge only converts to dealer share if VIA can fund fast and clean. Today the moat is real and the operations are manual — so the edge is not yet showing up at the dealer.',
      'The entire thesis of this blueprint is to convert the funding moat into dealer share by adding AI funding-speed on top of it — without taking on credit or compliance risk the credit union cannot defend.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE GROWTH EQUATION ----------
docChildren.push(
  ...sectionHeader('The Growth Equation', TEAL, '03'),
  spacer(100),
  p('VIA grows three ways, and only three ways: it signs more dealers, it funds more loans per dealer, and it protects the credit union’s return so the program can keep expanding. Each lever is gated by something operational today, and each is squarely addressable with AI. This is the spine the rest of the plan hangs on.'),
  spacer(140),
  buildTable(
    [
      { label: 'Growth Lever', weight: 2.4 },
      { label: 'What Moves It', weight: 4 },
      { label: 'The AI Play', weight: 3.6 },
    ],
    [
      ['More dealers', 'A finite field team can only call on so many rooftops; the 20-state expansion needs prioritization', 'Account intelligence scores and ranks the dealers worth recruiting; triggers flag competitor retrenchment'],
      ['More loans per dealer', 'Dealers send deals to whoever funds fastest and cleanest; slow stips and manual decisions lose deals', 'Document verification and instant decisioning clear deals in minutes, lifting capture at every dealer'],
      ['Protected return', 'The credit union keeps funding (and adds capacity) only if return, credit quality, and compliance hold', 'Fraud screening, explainable underwriting, and portfolio early-warning protect return and credit quality'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why the Equation Favors VIA Now',
    [
      'The market is consolidating in VIA’s favor: as competitors retrench (Prestige stopped new originations, Truist pulled back, Tricolor collapsed), dealer relationships are up for grabs for a disciplined lender that can move.',
      'The credit-union channel is winning — credit unions have been the number-one auto originator by units for five straight years — and the channel now competes on speed, accuracy, and predictability, not rate. That is exactly the lane AI improves.',
      'Each protected, well-run loan strengthens the case for the next credit-union partner — turning operational excellence into a platform-expansion engine.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 INDUSTRY & REGULATORY LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Industry & Regulatory Landscape', CORE_BLUE, '04'),
  spacer(100),
  p('Two forces shape the next few years for an indirect auto lender, and both favor the disciplined, well-funded operator that modernizes first. The market is under affordability and credit pressure even as the credit-union channel gains share; and the regulatory environment is heavy — which is both the burden AI removes and the constraint AI must respect.'),
  spacer(140),
  subHeader('Market Forces (2024–2026)'),
  buildTable(
    [
      { label: 'Force', weight: 2.5 },
      { label: 'What’s Happening', weight: 4.2 },
      { label: 'Implication for VIA', weight: 3.3 },
    ],
    [
      ['Affordability pressure', 'New-vehicle prices topped $50,000 and average payments passed $750/month', 'Near-prime borrowers are stretched — disciplined underwriting and verification matter more than ever'],
      ['Record delinquency', 'Subprime 60-plus-day delinquency hit a multi-decade high in 2025', 'VIA’s prime / near-prime focus is the safer side — but the funding CU’s return depends on clean credit and fraud control'],
      ['Consolidation & retrenchment', 'Competitors pulled back or failed (Prestige, Truist, the Tricolor collapse)', 'Dealer relationships are up for grabs — a direct case for dealer-acquisition account intelligence'],
      ['The credit-union channel wins', 'Credit unions are the #1 auto originator by units; the channel competes on speed, not rate', 'VIA’s exact lane is winning — the constraint is operational friction, which AI removes'],
      ['Fintech encroachment', 'Digital lenders compress deal time 50–70% and reset dealer expectations', 'Dealers increasingly expect instant, document-light decisions — VIA has to match the bar'],
      ['Fraud at record exposure', 'Industry fraud exposure reached an estimated $10.4 billion; income misrepresentation is the largest share', 'Fraud and synthetic-identity screening directly protect the credit union’s return'],
    ],
  ),
  spacer(160),
  subHeader('The Regulatory Frame — Burden and Constraint'),
  p('Lending is heavily regulated, and a lender will judge a technology partner on regulatory fluency. Most of the load is recurring, rules-based documentation that AI automates well — but one area, credit underwriting, is where AI must be handled carefully.'),
  buildTable(
    [
      { label: 'Regulation', weight: 2.4 },
      { label: 'The Recurring Burden', weight: 4.2 },
      { label: 'AI Angle', weight: 3.4 },
    ],
    [
      ['ECOA / Reg B', 'Specific, accurate adverse-action reasons on every denial; fair lending', 'Auto-generate compliant reason codes — only with an explainable model (see below)'],
      ['TILA / Reg Z', 'Accurate APR and finance-charge disclosures on every contract', 'Document generation with automated disclosure validation and audit trail'],
      ['FCRA', 'Permissible purpose, risk-based-pricing and adverse-action notices', 'Automated, accurate notice generation and dispute handling'],
      ['GLBA + FTC Safeguards Rule', 'A written information-security program; 30-day breach notification', 'Security monitoring, access controls, incident detection — Technijian’s core security lane'],
      ['SCRA / Military Lending Act', 'Active-duty rate caps and repossession protections', 'Automated military-status checks and rate / repo guardrails'],
      ['State licensing & rate caps', 'A 45-state-plus patchwork of rate and term limits', 'A geo-aware rate-and-term rules engine with audit logging'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Constraint We Lead With: Explainable, Never a Black Box',
    [
      'Any AI that touches a credit decision must be explainable and adverse-action-ready. ECOA and Reg B require specific, accurate reasons for a denial — and regulators have been explicit that a model being "too complex or novel" is not an excuse.',
      'Fair-lending exposure is narrowing federally but is not gone: the statute still applies, and state attorneys general are actively enforcing — one settled a fair-lending action over an AI underwriting model in 2025.',
      'So we lead with the constraint: Technijian deploys explainable, documented, bias-tested models — or automates the verification and compliance layer around VIA’s existing scorecards — so VIA gets the speed and return upside without un-defendable risk.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('The growth equation points to a finite, nameable set of accounts — which is why this is an account-based program, not a marketing campaign. VIA’s next dollar comes from four pools, and the field team already knows most of the names. The job of AI is to find the right ones faster, win them with a better experience, and free the team to cover twenty states instead of five.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.4 },
      { label: 'Who / What', weight: 3.2 },
      { label: 'How VIA Captures It', weight: 4 },
    ],
    [
      ['Net-new dealers', 'Franchised and independent rooftops not yet sending VIA deals, especially in expansion states', 'Account intelligence ranks targets by volume and credit mix; triggers flag competitor exits'],
      ['Deeper share at existing dealers', 'Dealers already on board who send only a fraction of their near-prime deals', 'Faster funding and instant decisions lift capture — the lender that funds fastest gets the next deal'],
      ['Additional CU partners', 'Other credit unions that want indirect-auto growth but lack the engine', 'A proven, modern, compliant platform story plus the data to prove return'],
      ['Geographic expansion', 'The move from five states toward twenty-plus', 'Account intelligence and a modern submission experience let a finite team cover far more ground'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based by Design — No Consumer Marketing',
    [
      'VIA does not transact with consumers; the borrower comes through the dealer and becomes a credit-union member. So this program is aimed entirely at named dealers and credit-union partners — not a broad consumer funnel, and not refinance marketing.',
      'That is the honest framing: VIA already knows who its targets are. The value of AI is depth, speed, and timing on those named accounts, and the reach to pursue more of them across the expansion.',
      'It also means the field-sales relationship stays central. AI surfaces and arms; the rep and the credit union’s risk team still close and fund the business.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE VIA CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The VIA Customer', CORE_ORANGE, '06'),
  spacer(100),
  p('VIA’s accounts span two sides: the dealers that source the paper and the credit union that funds it. The end borrower matters — their credit quality and experience protect the program — but they are reached through the dealer, not marketed to directly. The cards below profile the buyers and stakeholders that a growth program has to win, and the matrix places each by origination-volume potential and strategic value to the CUSO.'),
  spacer(160),

  personaCard('1 — The Multi-Rooftop Dealer Group', CORE_BLUE, [
    ['Role', 'A finance director or principal across several dealership rooftops — the highest-volume accounts VIA can win.'],
    ['Pain Points', 'Needs consistent, fast funding across every store; juggles many lenders; a slow lender quietly loses the group’s deals.'],
    ['Decision Driver', 'Speed and consistency across all rooftops, and a near-prime partner that funds clean deals without drama.'],
    ['AI Opportunity', 'Account intelligence flags these groups as top targets; instant decisions and fast stip clearing make VIA the easy default.'],
    ['Technijian Hook', 'My AI Lead Gen — prioritize and win multi-rooftop groups. My Dev — instant-decision portal and integration.'],
  ]),
  spacer(160),

  personaCard('2 — The Franchised / Independent Dealer Principal', CORE_ORANGE, [
    ['Role', 'The owner or general manager who decides which lenders the store sends its near-prime deals to.'],
    ['Pain Points', 'Loses customers when a lender is slow or says no; wants a dependable near-prime "yes" with workable structures.'],
    ['Decision Driver', 'A lender that approves more near-prime deals, funds fast, and is genuinely easy to work with.'],
    ['AI Opportunity', 'Dealer-facing authority content and a fast, modern submission experience win and hold the relationship.'],
    ['Technijian Hook', 'My SEO — dealer-facing authority content. My Dev — dealer portal plus RouteOne / Dealertrack integration.'],
  ]),
  spacer(160),

  personaCard('3 — The F&I Manager', GOLD, [
    ['Role', 'Runs the finance desk; submits deals and structures financing with the customer sitting across the desk.'],
    ['Pain Points', 'Manual stip chasing, slow decisions, and re-submissions — every minute of delay risks losing the sale.'],
    ['Decision Driver', 'Instant decisions, multiple structures per approval, and stipulations cleared in seconds, not days.'],
    ['AI Opportunity', 'Verification automation clears documents in seconds and an instant-decision experience keeps the deal moving.'],
    ['Technijian Hook', 'My Dev — document / income verification and the instant-decision portal experience.'],
  ]),
  spacer(160),

  personaCard('4 — The Independent Used-Car Dealer', TEAL, [
    ['Role', 'A smaller independent rooftop — opportunistic volume, often underserved by the bigger lenders.'],
    ['Pain Points', 'Wants reliable near-prime coverage and a lender that actually shows up for a smaller store.'],
    ['Decision Driver', 'Dependability — a lender that funds reliably and treats a small dealer like it matters.'],
    ['AI Opportunity', 'Account intelligence finds and prioritizes the independents worth recruiting in each new state.'],
    ['Technijian Hook', 'My AI Lead Gen — territory-level dealer discovery and prioritization.'],
  ]),
  spacer(160),

  subHeader('The Funding Side & The Scale Lever'),
  personaCard('5 — The Funding Credit Union (American Heritage)', DARK_CHARCOAL, [
    ['Role', 'The credit union that funds, books, and services every loan — the relationship that makes the CUSO work.'],
    ['Pain Points', 'Needs return, clean credit quality, member growth, and airtight compliance to justify growing the program.'],
    ['Decision Driver', 'Originations that are fast, well-underwritten, fraud-screened, and fully compliant — so the program is worth expanding.'],
    ['AI Opportunity', 'Fraud screening, explainable underwriting, and portfolio early-warning protect return and credit quality — which grows capacity and brings on more partners.'],
    ['Technijian Hook', 'My AI — fraud detection, explainable decisioning, portfolio analytics. My Security — GLBA compliance.'],
  ]),
  spacer(160),

  personaCard('6 — The Prospective CU Partner', PASS, [
    ['Role', 'Other credit unions VIA wants to recruit onto the CUSO platform — the lever that scales toward twenty-plus states.'],
    ['Pain Points', 'Want to grow indirect auto and membership but lack the dealer network, the origination engine, and the technology.'],
    ['Decision Driver', 'A proven, turnkey, compliant platform with a track record — the $350 million and ten-thousand-member proof.'],
    ['AI Opportunity', 'A credible, modern, compliant platform story — with the data to prove return — is what recruits the next partner.'],
    ['Technijian Hook', 'My SEO — the platform credibility story. My AI and My Security — the analytics and compliance that de-risk a new partner.'],
  ]),
  spacer(200),

  p('Figure 6.0 maps each account by origination-volume potential and strategic value to the CUSO — showing which are the anchor accounts, which are the strategic scale levers, and which represent recurring volume.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'VIA Account Matrix', 580, 1.50),
  diagramCaption('Figure 6.0 — VIA Accounts: Origination Volume Potential vs. Strategic Value to the CUSO'),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('VIA competes against three kinds of rival: the near-prime independents and credit-union platforms in its own lane, the deep-subprime independents that show what scale and operational AI look like, and the AI-native players that set the modern bar for decisioning. The pattern across all of them is the opportunity — none pairs VIA’s credit-union funding advantage with genuine AI-driven funding speed.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.2 },
      { label: 'Lane', weight: 3 },
      { label: 'Posture vs. VIA', weight: 4 },
    ],
    [
      ['Open Lending', 'AI decisioning + default-insurance platform for banks & credit unions', 'The closest channel analog — powers CU-funded near-prime decisioning; the standard VIA’s funding CU will expect VIA to match'],
      ['Upstart', 'AI underwriting marketplace; loans originated by bank / CU partners', 'The model benchmark — instant, document-light, fair-lending-aware decisioning'],
      ['Global Lending Services', 'Near-prime / subprime indirect, PE-backed, fast-growing', 'Strong dealer-facing instant decisioning and real-time deal structuring — a direct experience comparison'],
      ['Westlake Financial', 'Full-spectrum independent; the largest privately held', 'The operational-AI benchmark — automates ~70% of loan documents and funds in under an hour'],
      ['Lobel Financial', 'Anaheim, CA — all-tier indirect; a local neighbor', 'Already runs a dealer portal with instant approvals and Dealertrack / RouteOne integration — the table-stakes bar'],
      ['Consumer Portfolio Services', 'Irvine, CA subprime; a local public lender', 'A same-size-class AI adopter (automated income / stipulation clearing) — proof the playbook works'],
      ['Veros Credit', 'Santa Ana, CA near-/sub-prime; a neighbor', 'Recently took outside investment specifically to upgrade its technology — a peer that just admitted it must modernize'],
      ['Exeter Finance', 'National subprime independent; branch-based', 'Scale and PE backing, but a relationship / branch model that is less automated — beatable on speed'],
    ],
  ),
  spacer(200),
  subHeader('Funding & Automation Scorecard'),
  p('Reduced to the two things that decide dealer share — cost of capital and funding speed — the picture is clear, and it shows VIA holding the one advantage that is hardest to copy.'),
  buildTable(
    [
      { label: 'Player', weight: 2.4 },
      { label: 'Funding-Cost Edge', weight: 2, align: AlignmentType.CENTER },
      { label: 'Instant Decisioning', weight: 2, align: AlignmentType.CENTER },
      { label: 'AI / Automation', weight: 1.8, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.6 },
    ],
    [
      ['Open Lending / Upstart', { text: 'Medium', align: AlignmentType.CENTER }, { text: 'Yes', color: PASS, align: AlignmentType.CENTER }, { text: 'Native', color: PASS, align: AlignmentType.CENTER }, 'AI-native benchmark'],
      ['Westlake', { text: 'Medium', align: AlignmentType.CENTER }, { text: 'Yes', color: PASS, align: AlignmentType.CENTER }, { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, 'Operational-AI leader'],
      ['Global Lending / Lobel', { text: 'Medium', align: AlignmentType.CENTER }, { text: 'Yes', color: PASS, align: AlignmentType.CENTER }, { text: 'Some', align: AlignmentType.CENTER }, 'Modern dealer UX'],
      ['Veros / Exeter', { text: 'Low–Med', align: AlignmentType.CENTER }, { text: 'Partial', align: AlignmentType.CENTER }, { text: 'Upgrading', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Modernizing / laggard'],
      [{ text: 'VIA (today)', bold: true }, { text: 'High', color: PASS, align: AlignmentType.CENTER, bold: true }, { text: 'Manual', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Funding moat, manual ops', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field on those two axes. VIA sits where no rival does — the strongest funding-cost position, but below the field on automation. The move is straight up: keep the funding moat, add the AI funding-speed.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Funding-Cost Advantage vs. Origination Speed & AI', 580, 1.50),
  diagramCaption('Figure 7.0 — Competitive Positioning: Funding-Cost Advantage vs. Origination Speed & AI Automation'),
  spacer(160),
  calloutBox(
    'Where VIA Wins — The White Space',
    [
      'The top-right corner — a funding-cost moat paired with AI-driven funding speed — is empty. The AI-native players do not have VIA’s deposit funding; the funded independents do not have VIA’s cost of capital. VIA can hold a corner neither can reach.',
      'Operational friction is the real constraint on indirect growth — and it is exactly what document verification and instant decisioning remove. The lender that funds fastest and cleanest gets the next deal.',
      'Dealer relationships are up for grabs as competitors retrench, and account intelligence captures them. Meanwhile two local neighbors — Lobel with a dealer portal and CPS with automation — show the bar VIA can clear and exceed.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For a CUSO that has originated more than $350 million and created ten thousand members, the digital presence materially under-represents the operation — and that matters when the audiences VIA needs to impress are dealers deciding where to send deals and credit unions deciding whether to partner.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Website', 'A small, dated brochure site (Home / About / For Dealers / Why Partner / For Borrowers)', 'Thin content and an aging build undercut credibility with dealers and prospective CU partners'],
      ['Dealer portal', 'No public dealer-portal login or self-serve submission shown', 'No modern, instant-decision submission experience — the single clearest gap versus Lobel and GLS'],
      ['Lender integrations', 'No stated RouteOne / Dealertrack / CUDL integration', 'Table stakes for indirect lending — dealers expect to submit where they already work'],
      ['Content / SEO', 'No blog, resource center, or dealer-facing authority content', 'Nothing that earns dealer trust or tells the "why a CU-backed lender" story before a rep ever calls'],
      ['AI in the workflow', 'None evident', 'Decisioning and verification appear manual — the gap this blueprint is built to close'],
      ['Brand presence', 'Light social footprint for the size; borrower experience runs on the credit union’s portal', 'The platform proof (originations, members, return) is barely told — the recruiting story is left on the table'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making a strong, proven operation look and work as modern as it actually is.',
      'A refreshed site, a dealer-enrollment experience, and dealer-facing authority content are low-cost, compounding moves that lift credibility with both dealers and CU partners.',
      'They are also the natural first ninety days: fix the foundation and the story, then build the funding-speed engine on top of it.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things, plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services VIA would engage. Each is labeled for what it is, and each maps to a specific VIA use case. Where AI touches a credit decision, it is explainable by design.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review.',
    'Pointed at the funding workflow, the same approach clears stipulations and verifies income and employment in seconds instead of days — the funding speed that wins dealers and removes the operational friction limiting indirect growth.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — AI Detection Product',
    'Technijian architected ScamShield, an AI scam-detection product, using a three-model LLM Council (Claude, GPT-4o, and Gemini), risk scoring, and persistent memory — a multi-model design that cross-checks each conclusion instead of relying on one opaque score.',
    'That cross-checked, multi-model approach is the model for two VIA needs: screening applications for income misrepresentation and synthetic identities before funding, and keeping decisioning explainable so adverse-action reasons stay accurate and fair-lending review is defensible.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services VIA Would Engage'),
  capabilityBox(
    'My AI Lead Gen — Account-Based Outbound',
    'My AI Lead Gen is Technijian’s productized outbound service — it harvests high-fit targets from public data, enriches and scores them, and delivers outreach-ready, personalized sequences, replacing the data-subscription tax of tools like ZoomInfo and Apollo.',
    'For dealer acquisition it builds the ranked list of franchised and independent rooftops worth recruiting in each expansion state, flags dealers losing a lender as competitors retrench, and arms the field team with a per-dealer dossier — depth on named accounts, not a broad blast.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle that integrates Claude Code, Figma Make, GitHub, and CI/CD to ship portals, dashboards, and integrations around a client’s actual process.',
    'This builds the dealer-facing layer: a modern dealer portal with instant decisions and funding status, RouteOne and Dealertrack integration so dealers submit where they already work, and the verification and fraud-screening workflow behind it.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Security — Security & Compliance, Built In',
    'My Security is Technijian’s managed security service: every system is designed security-first, with role-based access, audit trails, and HIPAA, SOC 2, PCI-DSS, and GDPR-aligned controls built in rather than bolted on.',
    'For VIA this delivers the GLBA Safeguards information-security program the law requires, plus the audit trails and fair-lending monitoring that make AI-assisted underwriting deployable — the low-friction entry point that also de-risks the next credit-union partner.',
    'service'
  ),
);

// ---------- 10 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms VIA’s Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: win dealers (account-based acquisition), fund faster and safer (the speed and fraud control that lift capture and protect return), and protect and scale (the compliance and analytics that keep the credit union confident and bring on the next partner). The first motion grows the top of the funnel; the second converts it; the third makes the whole thing defensible and repeatable.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'VIA AI Growth Engine', 600, 1.61),
  diagramCaption('Figure 10.0 — The Engine: Win Dealers, Fund Faster & Safer, and Protect & Scale'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.7 },
      { label: 'Play', weight: 2.5 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.7 },
      { label: 'Technijian Service', weight: 1.7 },
    ],
    [
      ['Win Dealers', 'Dealer account intelligence', 'Score and prioritize dealers to recruit by territory and credit mix', 'Dealers added / mo', 'My AI Lead Gen'],
      ['Win Dealers', 'Competitor-retrenchment triggers', 'Alert when a dealer loses a lender — call that day', 'Triggered calls', 'My AI'],
      ['Win Dealers', 'Dealer-facing authority content', 'B2B content that earns dealer trust before a rep calls', 'Dealer inquiries', 'My SEO'],
      ['Win Dealers', 'Field-rep enablement + CRM', 'Pre-call dossiers and pipeline across the expansion', 'Rep meetings', 'My AI'],
      ['Fund Faster', 'Stip & income verification', 'Clear documents in seconds, not days', 'Time-to-fund', 'My Dev'],
      ['Fund Faster', 'Fraud & synthetic-ID screening', 'Catch misrepresentation before funding', 'Fraud losses avoided', 'My AI'],
      ['Fund Faster', 'Dealer portal + instant decision', 'Real-time structures and funding status', 'Look-to-book', 'My Dev'],
      ['Fund Faster', 'RouteOne / Dealertrack integration', 'Meet dealers where they already submit', 'Submission share', 'My Dev'],
      ['Protect & Scale', 'Explainable decisioning + adverse action', 'Accurate reason codes — never a black box', 'Compliant notices', 'My AI'],
      ['Protect & Scale', 'Fair-lending monitoring', 'Ongoing disparate-impact testing and documentation', 'Audit-readiness', 'My AI'],
      ['Protect & Scale', 'GLBA Safeguards / security', 'The required security program and monitoring', 'Breach risk reduced', 'My Security'],
      ['Protect & Scale', 'CU-partner expansion + early-warning', 'Recruit credit unions; protect return with analytics', 'New CU partners', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'Any AI that touches a credit decision stays explainable and adverse-action-ready — accurate reason codes on every decision, ongoing fair-lending testing, no protected-class proxies. We do not sell a black box; a model that cannot explain itself is a non-starter under ECOA, and we will not put VIA there.',
      'AI surfaces the right dealers, clears the documents, and screens for fraud — but the field rep’s relationship and the credit union’s risk team still own the decision. AI supports them; it does not replace them.',
      'That honesty is the point: VIA gets the funding-speed and return upside without taking on credit or compliance risk it cannot defend.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because VIA’s internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 14 replace them with real baselines. The logic holds across a wide range of inputs, because the levers — dealers won and funded volume per dealer — are large relative to the program cost.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['New active dealers / quarter', 'Field-team limited', 'Account-intelligence-driven', 'More dealers'],
      ['Funded originations / month', 'Current run-rate', 'Accelerated capture', 'Growth'],
      ['Time-to-fund (stip clearing)', 'Manual, days', 'Automated, under an hour', 'Speed wins dealers'],
      ['Documents auto-cleared', 'Largely manual', 'Majority automated', 'Capacity freed'],
      ['Fraud caught before funding', 'Reactive', 'Predicted and screened', 'Return protected'],
      ['Adverse-action / fair-lending', 'Manual', 'Automated and explainable', 'Audit-ready'],
      ['Funding CU partners', 'One (American Heritage)', 'A recruiting pipeline', 'CUSO scale'],
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
      ['New active dealer relationships (Y1)', '+20', '+45', '+90'],
      ['Incremental funded originations (Y1)', '+$40M', '+$90M', '+$180M'],
      ['Illustrative VIA economics on incremental volume*', '+$600K', '+$1.35M', '+$2.7M'],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$188,000', bold: true }, { text: '~$188,000', bold: true }, { text: '~$188,000', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '3.2x', bold: true, color: PASS }, { text: '7.2x', bold: true, color: PASS }, { text: '14.4x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* VIA’s CUSO economics (origination, servicing, and yield-share per loan) are not public, so the return line applies an illustrative, deliberately conservative ~1.5% of incremental originations as a placeholder — to be replaced with VIA’s actual per-loan economics in discovery. Beyond this, the program avoids fraud losses and protects the credit union’s return — the relationship that funds everything. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
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
      ['My AI Lead Gen — Dealer Account Intelligence', 'Named-dealer scoring and targeting, competitor-retrenchment triggers, and a rep CRM across the expansion (Professional tier)', '$3,499/mo', '$42,000'],
      ['My AI — Fractional AI Advisor', 'AI program leadership plus explainable-underwriting and fair-lending governance', '$2,000/mo', '$24,000'],
      ['My SEO — Dealer Authority Content + Site', 'Dealer-facing B2B authority content and a modernized site (not consumer SEO)', '$1,500/mo', '$18,000'],
      ['My Security — GLBA Safeguards Program', 'The required information-security program and monitoring — the entry point', '$1,200/mo', '$14,400'],
      ['My Dev — Managed App Services', 'Hosting, monitoring, and ongoing optimization of the portal and automations', '$800/mo', '$9,600'],
      ['My Dev — Custom Build (one-time, phased)', 'Stip / income verification, fraud screening, dealer portal + instant-decision UX, and RouteOne / Dealertrack integration', '—', '$75,000'],
      ['My AI — Executive AI Workshop (one-time)', 'Leadership alignment plus a fair-lending guardrails roadmap', '—', '$5,000'],
      [{ text: 'YEAR-1 TOTAL INVESTMENT', bold: true }, { text: 'Recurring $8,999/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$188,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'Dealers are the lever. Winning roughly twenty net-new dealers in Year 1, each sending a steady flow of funded near-prime deals, is enough incremental volume to cover the program many times over on the funding economics alone.',
      'Speed compounds the base. Faster funding lifts capture at every dealer already on board — the lender that funds fastest gets the next deal, month after month, with no new acquisition cost.',
      'The program is phased — start with the compliance foundation and dealer intelligence, prove the funding-speed gains, then scale outreach and recruit the next credit-union partner — which lowers the entry point and de-risks the spend.',
    ],
    CORE_BLUE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence suited to a regulated, integration-dependent lender: lay the compliance and intelligence foundation first, then accelerate funding speed and the dealer experience, then scale the outreach and the platform. Real dealer-intelligence and funding-speed gains are visible inside the first ninety days; the bigger integrations and the next CU partner are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'VIA 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 12.0 — VIA Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Get the compliance base right and stand up the intelligence that drives dealer acquisition.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Foundation & Compliance', 'Run the GLBA Safeguards review and a fair-lending / adverse-action readiness check. Refresh the website and stand up a clean dealer-enrollment experience so the platform looks as modern as it performs.'],
      ['1.2 — Dealer Intelligence Live', 'Build the named-dealer target lists by territory, turn on competitor-retrenchment triggers, and equip the field team with a CRM and per-dealer dossiers.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Accelerate (Days 91–180)', { color: TEAL }),
  p('Turn funding speed into the dealer-winning advantage, and meet dealers where they submit.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Verification Automation', 'Pilot document, income, and employment verification plus fraud and synthetic-identity screening; baseline time-to-fund and drive it down toward the target.'],
      ['2.2 — Portal & Integration', 'Launch the dealer portal with an instant-decision experience and RouteOne / Dealertrack integration; onboard the first dealers onto the new flow.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Protect (Days 181–365)', { color: CORE_ORANGE }),
  p('Scale the account-based outreach, make the decisioning explainable and defensible, and grow the platform.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Decisioning & Outreach at Scale', 'Bring explainable decisioning support and fair-lending monitoring into production; scale personalized dealer outreach across the new states.'],
      ['3.2 — Scale the CUSO & Optimize', 'Recruit additional credit-union partner(s) with the platform proof; turn on portfolio early-warning; deliver the ROI dashboard against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions VIA can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Refresh the Site and Add a Dealer-Enrollment Page',
    ['Modernize the brochure site and add one clean "become a dealer partner" enrollment page. It costs little, and it is the first thing a dealer or a prospective credit-union partner sees when they vet VIA — the platform should look as proven as it is.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Confirm the RouteOne / Dealertrack Submission Path',
    ['Make sure dealers can submit deals to VIA through the systems they already use every day. If the integration is not exposed, that is the single fastest way to lower the friction of sending VIA a deal — table stakes in indirect lending.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Publish One Dealer-Facing Authority Piece',
    ['Write a single, plain page answering the question a dealer actually asks: why send near-prime deals to a credit-union-backed lender? Faster funding, better structures, a partner that funds clean. This is the seed of the content that earns dealer trust before a rep ever calls.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Baseline the Current Time-to-Fund',
    ['Measure how long a deal takes from submission to funding today, and how much of that is manual stip clearing. That single number is the starting point for the funding-speed story — and the clearest before-and-after the program can show.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Run a Fair-Lending and Adverse-Action Readiness Check',
    ['Before any AI touches a credit decision, review how adverse-action reasons are generated today and whether fair-lending testing is documented. It is a free posture check that de-risks everything that follows — and it is exactly what a funding credit union wants to see.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with VIA’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Dealer base', 'Active dealer count today, dealers added per month, and field-rep headcount', 'Calibrates the dealer-acquisition scope and ROI'],
      ['Origination run-rate', 'Annual (vs. cumulative) originations, average loan size, and look-to-book', 'Sets the funded-volume lines in the model'],
      ['Funding speed', 'Current time-to-fund and how much stip clearing is manual', 'The speed baseline the whole program improves'],
      ['CUSO economics', 'VIA’s economics per loan (origination / servicing / yield share)', 'Replaces the illustrative return placeholder with real numbers'],
      ['Decisioning', 'Rules-based scorecard vs. any model; the adverse-action and fair-lending process today', 'Defines how AI underwriting can be deployed explainably'],
      ['Fraud', 'Current fraud and synthetic-identity losses', 'Sizes the fraud-screening payback'],
      ['Integrations & systems', 'RouteOne / Dealertrack / CUDL status, plus the loan-origination and CRM stack', 'Defines the build and integration surface'],
      ['CUSO structure', 'Whether American Heritage is the sole funder, and the CU-partner pipeline', 'Scopes the platform-expansion track'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on VIA’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('VIA already has the hard things: a proven CUSO model, a credit-union funding moat the competition cannot copy, a prime and near-prime book on the safer side of the market, and a track record of $350 million originated and ten thousand members created. What it has not yet done is convert that funding advantage into dealer share by funding faster — and the corner where a funding moat meets AI speed is still empty.'),
  p('The opportunity is concrete: win more dealers with account intelligence while competitors retrench, fund faster and cleaner so the lender that moves quickest gets the deal, and protect the credit union’s return so the platform can scale to more states and more partners. A focused, account-based program does all three — with underwriting that stays explainable and a field team that stays central.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the compliance foundation, the site and dealer-enrollment refresh, and dealer account intelligence — live inside 30 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to pair your funding moat with AI funding-speed?', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '16'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional businesses compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for VIA Auto Finance', weight: 5 }],
    [
      ['My AI Lead Gen', 'Account-based dealer acquisition — scoring, prioritizing, and sequencing the named rooftops and credit-union partners worth winning, supporting the field team rather than replacing it'],
      ['My AI', 'AI strategy and builds — fraud and synthetic-identity screening, explainable decisioning, fair-lending monitoring, and portfolio early-warning, with governance throughout'],
      ['My Dev', 'Custom, AI-native builds — the dealer portal and instant-decision experience, document verification, and RouteOne / Dealertrack integration'],
      ['My SEO', 'Dealer-facing authority content and a modernized site that build credibility with dealers and prospective credit-union partners'],
      ['My Security', 'The GLBA Safeguards information-security program, monitoring, and the audit trails that make AI-assisted lending defensible'],
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
  p('Market and company intelligence gathered via public web research conducted May 2026. Firmographic details (founding year, originations, members, states, ownership, and leadership) are drawn from public sources and company materials and should be confirmed with VIA before external use.', { italics: true }),
  spacer(120),
  p('1. VIA Auto Finance — official website: viaautofinance.com (Home, About, For Dealers, Why Partner, For Borrowers, Contact)', { size: 20 }),
  p('2. American Heritage Credit Union & CUInsight — joint press release (Feb 2025): $350M originations and 10,000 new members milestone; CUInsight company profile', { size: 20 }),
  p('3. Washington Secretary of State corporate record — VIA Auto Finance, LLC (legal entity / formation); leadership (Robert Barbee, President & CEO) via company press and LinkedIn', { size: 20 }),
  p('4. Competitors — Open Lending (Lenders Protection), Upstart, Global Lending Services, Westlake Financial, Lobel Financial, Consumer Portfolio Services, Veros Credit, Exeter Finance, Credit Acceptance, Lendbuzz, AutoFi', { size: 20 }),
  p('5. Industry — Cox Automotive (vehicle prices and affordability), Fitch / Federal Reserve (subprime delinquency), Origence / CU Management (credit-union channel and operational-friction analysis), Point Predictive (auto-lending fraud exposure)', { size: 20 }),
  p('6. Regulation — CFPB Circular 2023-03 (adverse-action and AI explainability); ECOA / Reg B; TILA / Reg Z; FCRA; FDCPA; FTC Safeguards Rule (GLBA); SCRA / Military Lending Act; state licensing and rate-cap surveys', { size: 20 }),
  p('7. Technijian service pricing — My AI Lead Gen (Starter $1,499 / Professional $3,499 / Enterprise $6,999), My AI, My SEO, My Dev, and My Security rate cards', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'VIA-Auto-Finance-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
