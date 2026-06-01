// Danielian Associates (DAS) — AI Growth & Integration Strategy
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern: technijian-biz-dev-blueprint skill (RKE/CDLX/CBI lineage). Account-based (ABM) AEC firm.

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
const PURPLE        = '7B2D8B';
const GOLD          = 'C9922A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_PERSONAS_BUF    = dbuf('personas.png');
const DIAGRAM_COMPETITIVE_BUF = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF        = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF    = dbuf('timeline.png');

// Aspect ratios measured from the REAL cropped PNGs (per skill diagram discipline)
const AR_PERSONAS    = 1.524;
const AR_COMPETITIVE = 1.546;
const AR_ARCH        = 2.384;
const AR_TIMELINE    = 2.675;

const TODAY = '2026-06-01';
const CLIENT = 'Danielian Associates';

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

function leadBullet(lead, body) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [
      new TextRun({ text: lead, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }),
      new TextRun({ text: body, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  });
}

function numberedSteps(items) {
  return items.map((t, i) => new Paragraph({
    spacing: { before: 30, after: 70, line: 300 },
    indent: { left: 520, hanging: 520 },
    children: [
      new TextRun({ text: `${i + 1}.`, size: 22, bold: true, color: CORE_BLUE, font: FONT_HEAD }),
      new TextRun({ text: '\t', size: 22, font: FONT_BODY }),
      new TextRun({ text: t, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  }));
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 40, bold: true, color, font: FONT_HEAD })] }),
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
      const fill = cellObj.fill || (zebra && ri % 2 === 1 ? OFF_WHITE : WHITE);
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
        width: { size: 2600, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 2600, type: WidthType.DXA },
        shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2600, CONTENT_W - 2600],
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Danielian: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
function ctaBanner(lines) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
      borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: lines.map((ln, i) => new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: i < lines.length - 1 ? 90 : 0 },
        children: [new TextRun({ text: ln.text, size: ln.size || 22, bold: ln.bold || false, color: WHITE, font: ln.bold ? FONT_HEAD : FONT_BODY })],
      })),
    })]})],
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  CONFIDENTIAL  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'DANIELIAN ASSOCIATES', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 36, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Two fronts: win more developer pursuits — and run the studio with less drag', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(160),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for Danielian Associates | Architects • Planners', size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California — five minutes apart', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(520),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Danielian Associates. Projections are estimated and calibrate to real figures after a discovery call.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Table of Contents', size: 32, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1968', label: 'Designing communities for 57 years', color: CORE_BLUE },
    { number: '1M+', label: 'Units of housing delivered', color: CORE_ORANGE },
    { number: '775+', label: 'Design awards won', color: TEAL },
    { number: '6,353', label: 'Projects, 44 states, 15 countries', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Danielian Associates has spent 57 years turning land into communities — more than a million units of housing across 44 states and 15 countries, and 775 design awards along the way. The firm wins work the way the best design studios always have: through deep developer relationships, a reputation for craft, and pursuits that land the next project. None of that changes. What this strategy adds is a layer underneath it — AI that helps the firm win more of those pursuits and run the studio with less non-design drag, so a new generation of leadership carries the Danielian legacy into the next decade without losing what makes it Danielian.'),
  p('This document is built on two fronts, because Danielian has two distinct, real opportunities. The first is growth: win a larger share of the finite, named universe of developers the firm already competes for — faster proposals, sharper account timing, and authority content aimed at the exact questions developers ask. The second is integration: weave AI into how the studio actually runs — making 57 years of project knowledge searchable, turning proposal assembly from days into hours, and giving entitlement and code research a head start — so licensed architects spend more time designing and in front of clients.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Growth (the pursuit engine): Danielian sells to a knowable set of homebuilders, multifamily and BTR developers, affordable-housing developers, and landowners. The win is depth and timing on those named accounts — not a broad lead funnel. AI makes each pursuit faster and better-targeted.',
      'Integration (the studio engine): a 57-year, 6,353-project archive is the firm’s most underused asset. Made searchable and paired with proposal and research automation, it returns hours to design and locks in knowledge as senior principals hand the firm to the next generation.',
      'The timing: California’s 2026 housing laws are pushing demand up in Danielian’s exact product lines (multifamily, BTR, ADU, middle housing) while most architecture firms are not yet AI-ready. The firm that turns pursuits around fastest captures disproportionate share.',
    ],
    CORE_ORANGE
  ),
  p('Danielian already runs on EOS, with a named Chief Technology Manager and a Director of Business Development — the two seats an AI program reports into. That is a firm built to absorb this. We have framed the program as EOS Rocks with Scorecard metrics, scoped to start small and prove the lift before it scales firmwide across Orange County, Los Angeles, and Nashville.', { spaceBefore: 60 }),
  p('An honest note up front, carried throughout: AI augments the licensed architects and planners — it does not design, and it does not stamp. Every figure here is an estimate that calibrates to Danielian’s real numbers at a discovery call. Technijian has built the patterns named in this plan for clients in other regulated, document-heavy fields; we map them to Danielian’s workflows rather than claim prior architecture-specific delivery.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE TWO FRONTS ----------
docChildren.push(
  ...sectionHeader('Where the Value Comes From — Two Fronts', TEAL, '02'),
  spacer(100),
  p('Before any tactics, one question shapes the plan: where does the next dollar of value actually come from for a 57-year-old design studio? There are two answers, and they are different enough that the program treats them as parallel fronts — one external and growth-facing, one internal and efficiency-facing.'),
  spacer(120),
  buildTable(
    [
      { label: '', weight: 1.6 },
      { label: 'Front 1 — Growth (win more pursuits)', weight: 3.4 },
      { label: 'Front 2 — Integration (run the studio)', weight: 3.4 },
    ],
    [
      [{ text: 'What it is', bold: true }, 'Win a larger share of the named developer universe Danielian already competes for', 'Weave AI into how the studio runs — knowledge, proposals, research, production'],
      [{ text: 'Who owns it', bold: true }, 'Deborah Muro, Director of Business Development', 'Victor Alvarez-Duran, Chief Technology Manager'],
      [{ text: 'The win', bold: true }, 'Higher pursuit win rate; faster, sharper proposals; better account timing', 'Hours returned to billable design; knowledge retained; less rework'],
      [{ text: 'Time to value', bold: true }, 'One to two quarters — first pursuit pilot proves it', 'Weeks for proposal automation; a quarter for the knowledge graph'],
      [{ text: 'Where AI fits', bold: true }, 'Account intelligence, proposal automation, authority content', 'Searchable project archive, entitlement research, production automation'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Fronts, One Studio',
    [
      'Front 1 is the growth play: AI sits under the relationship layer Danielian has built over 57 years — it does not replace referrals, trust, or the in-person pursuit. It makes the firm faster and better-informed on the accounts it already chases.',
      'Front 2 is the efficiency play, and for a firm this established it may be the bigger near-term win: the 6,353-project archive becomes a living, searchable asset instead of files and retiring principals’ memories.',
      'They reinforce each other. The same knowledge graph that speeds a proposal also surfaces the right precedent for a design. The same automation that wins a pursuit returns the hours to deliver it well.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 WHY NOW ----------
docChildren.push(
  ...sectionHeader('Why Now — The 2026 Window', CORE_BLUE, '03'),
  spacer(100),
  p('Two forces are converging in 2026, and both favor a firm that moves now. Demand for Danielian’s exact products is being legislated upward, while the architecture profession is splitting into firms that have made AI part of how they work and firms that have not.'),
  spacer(60),
  subHeader('Force 1 — California is legislating housing demand straight into Danielian’s product lines'),
  leadBullet('SB 79 (effective July 1, 2026). ', 'Upzones land around transit — including small single-family parcels — pushing more multifamily and mixed-use exactly where Danielian designs.'),
  leadBullet('SB 1211 + ADU streamlining (SB 543, AB 1061). ', 'Allows up to eight detached ADUs on a multifamily lot and accelerates ADU and lot-split approvals. ADUs and middle housing — a Danielian heritage going back to its wide-shallow-lot and z-lot innovations — become higher-volume work.'),
  leadBullet('The pattern. ', 'The state has issued 60,000+ ADU permits since 2018 and keeps pressing for production. The regulatory wind is at Danielian’s back specifically in multifamily, BTR, ADU, and middle housing.'),
  p('The firm that can research an entitlement pathway and turn a pursuit around fastest captures a disproportionate share of this wave. That speed is exactly what AI delivers.', { spaceBefore: 60, italics: true, size: 20 }),
  spacer(140),
  subHeader('Force 2 — The AEC field is split into AI-ready and AI-behind firms'),
  buildTable(
    [
      { label: 'The signal (A&E industry, 2025–2026)', weight: 5.2 },
      { label: 'What it means for Danielian', weight: 4.8 },
    ],
    [
      ['53% of A&E firms now use AI tools; 94% of users will increase usage in 2026', 'The early-adopter window is closing — but it is not closed. Moving now still means leading, not following.'],
      ['75% of AEC firms expect AI to lift profitability; only ~20% feel "highly prepared"', 'A 55-point gap between intent and readiness. The bottleneck is not desire — it is having a partner to implement.'],
      ['~40% of design-development tasks are automatable; proposals, precedent and code search are the proven near-term wins', 'The highest-value first plays are the non-design tasks around design — exactly where Danielian loses studio hours today.'],
      ['"The barriers in 2026 aren’t cost — they’re complexity, culture, and connection"', 'Danielian doesn’t need to build an AI department. It needs an integration partner who brings strategy, build, and governance together.'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Why-Now, in One Line',
    [
      'Demand for Danielian’s exact products is being legislated upward in 2026 while the profession divides into AI-ready and AI-behind firms. Danielian can lock in the ready side — against rivals who are larger, but not necessarily faster or smarter per pursuit.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE DANIELIAN BUYER UNIVERSE ----------
docChildren.push(
  ...sectionHeader('The Danielian Buyer Universe', CORE_BLUE, '04'),
  spacer(100),
  p('This is an account-based opportunity, not a broad market. The people who hire Danielian are a finite, nameable set of developers, builders, and landowners — won through relationships, repeat work, referrals, and pursuits. The map below orders them by account value and how often they buy design, so the growth engine targets depth and timing on real accounts rather than a generic funnel.'),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Danielian Buyer Universe', 600, AR_PERSONAS),
  diagramCaption('Figure 4.0 — The Danielian Buyer Universe: Account Value vs. Pursuit Frequency'),
  spacer(160),
  personaCard('A — The Production / National Homebuilder', CORE_BLUE, [
    ['Role', 'The volume engine — recurring multifamily and single-family design across communities.'],
    ['What they want', 'A design partner who turns pursuits fast, hits product type and budget, and reuses what works.'],
    ['Where AI helps', 'Precedent-matched project sheets and resumes assembled to each pursuit in hours, not days.'],
    ['Technijian hook', 'Proposal/SOQ automation + the institutional knowledge graph feeding tailored pursuits.'],
  ]),
  spacer(160),
  personaCard('B — The Multifamily / BTR Developer', CORE_ORANGE, [
    ['Role', 'The 2026 growth category — apartments and build-to-rent communities riding the housing-law tailwind.'],
    ['What they want', 'A firm fluent in current density, transit, and BTR feasibility — and quick to a credible concept.'],
    ['Where AI helps', 'Authority content on BTR and SB 79 feasibility; trigger-based outreach when they acquire a site.'],
    ['Technijian hook', 'AEO authority engine + account intelligence on land buys and entitlement filings.'],
  ]),
  spacer(160),
  personaCard('C — The Affordable-Housing Developer', TEAL, [
    ['Role', 'Mission-and-volume buyers (LIHTC / workforce) where entitlement speed and precedent matter most.'],
    ['What they want', 'A partner who can move fast through complex approvals and bring a deep affordable precedent library.'],
    ['Where AI helps', 'Entitlement-pathway research; a searchable library of past affordable and workforce projects.'],
    ['Technijian hook', 'Entitlement/code research assistant + the knowledge graph.'],
  ]),
  spacer(160),
  personaCard('D — The Master-Planned-Community Landowner', PURPLE, [
    ['Role', 'Highest-value, less-frequent buyers — large land holdings needing planning and design vision.'],
    ['What they want', 'Planning heritage, yield/feasibility credibility, and a firm that can carry a vision to entitlement.'],
    ['Where AI helps', 'AI-assisted yield and feasibility studies that accelerate the early planning stage (human-led).'],
    ['Technijian hook', 'My AI planning support + Danielian’s 57-year planning legacy, made searchable.'],
  ]),
  spacer(160),
  personaCard('E — The Public Agency / Municipality', BRAND_GREY, [
    ['Role', 'Planning and entitlement-adjacent buyers — cities and agencies shaping policy and community plans.'],
    ['What they want', 'A policy-fluent partner who speaks the language of current housing law and community process.'],
    ['Where AI helps', 'Policy-fluent authority content and entitlement narratives drafted from a strong starting point.'],
    ['Technijian hook', 'AEO authority engine + entitlement research assistant.'],
  ]),
  spacer(120),
  p('Inside Danielian, the program reports into a clear set of seats: John Danielian (President) sets direction; Victor Alvarez-Duran (Chief Technology Manager) owns the build; Deborah Muro (Director of Business Development) owns the pursuit engine; Jeff Schmehr (CFO) holds the ROI line; and the senior project managers are the ones who get their hours back.', { italics: true }),
);

// ---------- 05 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '05'),
  spacer(100),
  p('The question is not who has the largest portfolio — Danielian competes well on craft and legacy against any firm in California residential design. It is who can be the fastest and most intelligent on each pursuit. Seen that way, the landscape has an open lane.'),
  spacer(140),
  buildTable(
    [
      { label: 'Firm', weight: 1.8 },
      { label: 'Position', weight: 2.6 },
      { label: 'Relevant to Danielian', weight: 5.6 },
    ],
    [
      ['KTGY', 'Among the nation’s largest multifamily architecture firms; multi-office, full-service', 'The scale leader Danielian competes under. Breadth and reach are its edge — speed-per-pursuit is the lane it does not visibly own.'],
      ['AO Architects', 'Among the nation’s largest multifamily A/E firms; Orange County base; relationship-led', 'A local scale rival whose "relationships" positioning mirrors Danielian’s — which means relationships alone no longer differentiate.'],
      ['William Hezmalhalch (WHA)', '~40-year residential A+P firm; OC, LA, Sacramento, Bay Area', 'The closest peer in the same residential architecture-and-planning lane, with deep builder and agency ties.'],
      ['Bassenian Lagoni / regional peers', 'Orange County residential specialists', 'A broader competitive set on the same axes Danielian has competed on for decades — portfolio, relationships, scale.'],
      [{ text: 'Danielian + Technijian', bold: true, color: CORE_BLUE }, { text: 'Same craft, fastest and smartest pursuits', bold: true, color: CORE_BLUE }, { text: '57 years and 6,353 projects of institutional knowledge, made searchable — turning Danielian’s depth into pursuit speed no larger rival is visibly matching.', color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  diagramImage(DIAGRAM_COMPETITIVE_BUF, 'Competitive Positioning', 600, AR_COMPETITIVE),
  diagramCaption('Figure 5.0 — Positioning: firm scale & reach vs. AI-readiness and pursuit/studio speed'),
  spacer(120),
  calloutBox(
    'The White Space',
    [
      'Danielian’s rivals compete on scale, portfolio, and relationships — the same axes Danielian has competed on for 57 years. None is visibly winning on "fastest, most intelligent pursuit and entitlement turnaround."',
      'Danielian is smaller than the scale leaders, but it can be faster and smarter per pursuit — and that plays to its actual advantage: more institutional knowledge per person than a younger, larger firm, finally made usable by AI.',
      'That is a lane a firm can take without abandoning what it is. It is the same studio, the same craft — just faster to the right answer.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '06'),
  spacer(100),
  p('Before any pitch, one thing should be clear: the AI plays in this strategy are not concepts — they are patterns Technijian has already built and runs in production, including for clients in Danielian’s own residential-construction market. We map them to Danielian’s workflows below. One honest boundary, stated plainly: Technijian has not designed a building or run an architecture studio’s production pipeline — the design craft is Danielian’s. What Technijian has built is the AI and IT layer around firms that build and sell housing, and that is exactly what this section proves.'),
  spacer(120),
  capabilityBox(
    'Proven Build — AI Pursuit Intelligence for a Residential Builder',
    'For a luxury custom-home builder in Orange County’s coastal communities, Technijian built a multi-agent AI system that watches the signals that precede a permit — just-sold records, geotech, pre-applications, ARC filings, story poles, and Design Review Board agendas — across 10 permit jurisdictions and 60+ HOA architectural-review committees, replacing 15–20 hours a week of manual portal-reading. On day one of production, one 75-minute run surfaced 24 enriched, scored Tier-1 leads, each resolved to a parcel with owner, value, and contact.',
    'This is the closest possible proof to Danielian’s growth front — same market, same public-records terrain (permits, DRB/ARC agendas, story poles), same goal of being in the conversation before a developer commits. Pointed at Danielian’s named developer universe, the same engine monitors land acquisitions, entitlement filings, and project pipelines and produces pre-meeting account dossiers against the firm’s existing target list.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build — AI Document Intelligence (proposals: days to minutes)',
    'For a regulated financial-services client, Technijian built a document-intelligence system that turned questionnaire and RFP work from days into minutes, cutting manual review by roughly 60–80% while a multi-model peer-review step kept the output accurate.',
    'Architecture pursuits are document-heavy — SOQs, RFQs, project sheets, resumes, references. The same engine assembles a tailored pursuit response in hours and auto-matches the right past projects and resumes to each opportunity.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build — Institutional Knowledge Graph (Weaviate + Obsidian)',
    'Technijian builds knowledge systems that make years of files, decisions, and institutional memory searchable in plain language — so the right precedent surfaces on demand instead of living in someone’s head.',
    'Danielian’s 57-year, 6,353-project archive is its most underused asset. "Find every wide-shallow-lot BTR we did near transit in a density-bonus jurisdiction" becomes a question with an answer — powering both pursuits and design precedent, and locking in knowledge as senior principals hand off the firm.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build — Multi-Agent SEO + AEO Platform',
    'Technijian runs a multi-agent platform (Claude, GPT-4o, and Gemini coordinated through MCP, with SEMrush, GA4, and Perplexity) that builds authority content engineered to be cited by both search engines and AI answer engines.',
    'Aimed at the housing-policy questions developers actually ask — SB 79, ADU rules, BTR feasibility — this makes Danielian the cited expert when a developer researches. It is authority for named buyers, not broad lead generation.'
  ),
  spacer(200),
  subHeader('Representative Engagements — Work Like Yours'),
  p('Two anonymized Technijian engagements in the construction sector show the pattern on real work — one on the growth front, one on the IT foundation a firmwide AI rollout sits on. Both are described by scope and effort only; client-identifying detail is stripped.'),
  spacer(80),
  buildTable(
    [
      { label: 'Engagement', weight: 3.0 },
      { label: 'What Technijian did', weight: 4.4 },
      { label: 'Scope', weight: 2.2, align: AlignmentType.RIGHT },
    ],
    [
      ['AI Lead Generation — Luxury Home Builder (OC coastal)', 'Multi-agent system across 7 signal layers, 10 permit jurisdictions, and 60+ HOA committees; 24 enriched Tier-1 leads in a single 75-minute run', { text: '7 layers · 10 jurisdictions', align: AlignmentType.RIGHT }],
      ['Datacenter Migration & Azure AD Hybrid — Construction Contractor', 'Moved core identity to a hosted datacenter, stood up live Azure AD sync for HQ/field/remote, decommissioned 4 legacy servers with zero auth outage', { text: '89 hrs · 3 phases', align: AlignmentType.RIGHT }],
    ],
  ),
  p('The lead-generation engagement is the same market and the same public-records terrain as Danielian’s developer pursuits. The infrastructure engagement is the kind of secure, hybrid foundation a three-office firm needs before rolling AI out firmwide. Neither is an architecture-design build — that craft stays with Danielian.', { size: 18, italics: true, spaceBefore: 60 }),
);

// ---------- 07 AI GROWTH + INTEGRATION ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Danielian’s Engine', CORE_BLUE, '07'),
  spacer(100),
  p('The engine runs three motions, and because this is an account-based business, every motion aims at named buyers rather than a broad funnel. AI sits underneath the human relationship layer — it surfaces the right developers, arms the pursuit, and removes the non-design drag — but the trust between Danielian and a developer, and the craft of the design itself, are what win and keep the work. Stating that plainly is the point.'),
  spacer(60),
  p('This is not theoretical. The same outbound motion shown below already runs in production for a residential builder in this market — surfacing 24 enriched, scored Tier-1 leads in a single 75-minute run by watching the permit, DRB/ARC, and just-sold signals months before a project reaches the open market (see Section 06). Pointed at Danielian’s named developer universe, it becomes pursuit timing no larger rival is visibly matching.', { spaceBefore: 0 }),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Danielian AI Growth + Integration Engine', 600, AR_ARCH),
  diagramCaption('Figure 7.0 — Inbound authority, Outbound pursuit intelligence, Internal knowledge & production — feeding one studio'),
  spacer(160),
  subHeader('The AI tools, mapped to Danielian'),
  buildTable(
    [
      { label: 'Motion', weight: 1.4 },
      { label: 'Play', weight: 2.4 },
      { label: 'What it does for Danielian', weight: 4.2 },
      { label: 'Technijian Service', weight: 2.0 },
    ],
    [
      ['Inbound', 'Authority / AEO content', 'Answer the SB 79, ADU, and BTR-feasibility questions developers ask — so Danielian is the cited expert', 'My SEO'],
      ['Inbound', 'Awards & portfolio merchandising', 'Turn 775+ awards and the project archive into proof that wins the next pursuit', 'My SEO'],
      ['Outbound', 'Pursuit / proposal automation', 'SOQ / RFQ / project-sheet assembly from days to hours, precedent-matched per pursuit', 'My AI'],
      ['Outbound', 'Account intelligence', 'Monitor land buys, entitlements, builder pipelines on the named developer universe', 'My AI Lead Gen'],
      ['Outbound', 'Pre-meeting dossiers', 'A one-page brief on every target before the pursuit meeting', 'My AI'],
      ['Internal', 'Institutional knowledge graph', '57 years / 6,353 projects, searchable in plain language for pursuits and design', 'My AI'],
      ['Internal', 'Entitlement & code research', 'A researched starting point on zoning, density-bonus, and ADU pathways per parcel', 'My AI / My Dev'],
      ['Internal', 'Early massing / yield studies', 'Generative feasibility options the designers choose from — human-in-the-loop', 'My AI / My Dev'],
    ],
  ),
  spacer(140),
  calloutBox(
    'The Honest Boundary',
    [
      'AI augments the licensed architects and planners — it does not design, and it does not stamp. It removes the non-design drag: proposal assembly, precedent and code search, knowledge retrieval, and marketing production.',
      'On the growth side, AI supports the relationship layer Danielian has built over 57 years; it does not replace referrals, trust, or the in-person pursuit. It makes the firm faster and better-informed on the accounts it already chases.',
      'Every play is built on a secure IT and governance foundation, with an AI-use policy so the studio adopts these tools safely and consistently.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE EOS INTEGRATION PLAN ----------
docChildren.push(
  ...sectionHeader('The EOS Integration Plan', TEAL, '08'),
  spacer(100),
  p('Danielian runs on EOS — Rocks, the Level-10 cadence, the Scorecard, the Accountability Chart. That is an advantage: it means an AI program can be installed in the firm’s own operating language rather than bolted on as a side project. We do not propose "digital transformation." We propose a quarter of AI Rocks with measurable Scorecard metrics, owned by the seats that already exist.'),
  spacer(80),
  buildTable(
    [
      { label: 'AI Rock (quarterly)', weight: 3.0 },
      { label: 'Owner / seat', weight: 2.2 },
      { label: 'Scorecard metric it moves', weight: 4.8 },
    ],
    [
      ['Stand up proposal automation on live pursuits', 'Deborah Muro (BD)', 'Hours-to-proposal; pursuits responded to per quarter'],
      ['Build the institutional knowledge graph (seed corpus)', 'Victor Alvarez-Duran (CTM)', 'Precedent-search time; reuse rate on pursuits'],
      ['Launch authority/AEO content program', 'BD + marketing', 'Inbound developer inquiries; AI-answer citations'],
      ['Set the AI-use policy + staff training', 'CTM + President', '% of staff trained; tools adopted firmwide'],
      ['Establish the ROI Scorecard for AI', 'Jeff Schmehr (CFO)', 'Pursuit win rate; billable hours recovered; utilization'],
    ],
  ),
  spacer(120),
  calloutBox(
    'Why EOS Makes This Easier',
    [
      'EOS firms already think in measurable accountability, so the ROI and KPI framing of this plan lands naturally — there is no culture gap to cross first.',
      'The Chief Technology Manager almost certainly already owns a tech Rock. Technijian becomes the integration partner that helps land it — bringing the strategy, the build, and the governance so an internal team of one is not carrying it alone.',
      'Each quarter, the AI Rocks produce Scorecard movement the leadership team already reviews — so the program proves itself in the meeting cadence the firm already runs.',
    ],
    CORE_BLUE
  ),
);

// ---------- 09 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '09'),
  spacer(100),
  p('The investment below is built land-and-expand: a small, easy-to-approve entry that pays for itself on the pursuit and efficiency lift alone, and a clearly-labeled later expansion that builds the full engine once the entry proves out. Every figure is an estimate that calibrates to Danielian’s real numbers — pursuit volume, win rate, and hours-to-proposal — at a discovery call.'),
  spacer(140),
  subHeader('What the program moves (KPI lift)'),
  buildTable(
    [
      { label: 'Metric', weight: 3.4 },
      { label: 'Today (estimated)', weight: 2.2, align: AlignmentType.RIGHT },
      { label: 'With the program', weight: 2.2, align: AlignmentType.RIGHT },
      { label: 'Lever', weight: 2.6 },
    ],
    [
      ['Hours to assemble a pursuit / SOQ', { text: 'days', align: AlignmentType.RIGHT }, { text: 'hours', align: AlignmentType.RIGHT }, 'Proposal automation'],
      ['Pursuit win rate', { text: 'baseline', align: AlignmentType.RIGHT }, { text: '+ points', align: AlignmentType.RIGHT }, 'Speed + account intelligence'],
      ['Precedent / knowledge search time', { text: 'hours', align: AlignmentType.RIGHT }, { text: 'minutes', align: AlignmentType.RIGHT }, 'Knowledge graph'],
      ['Billable design hours recovered / mo', { text: '—', align: AlignmentType.RIGHT }, { text: 'tens of hrs', align: AlignmentType.RIGHT }, 'Less non-design drag'],
      ['Inbound developer inquiries', { text: 'baseline', align: AlignmentType.RIGHT }, { text: 'rising', align: AlignmentType.RIGHT }, 'Authority / AEO content'],
    ],
  ),
  p('Baselines read "estimated" on purpose — discovery replaces every one with Danielian’s actual figures. The point is the direction and the levers, which are concrete.', { size: 18, italics: true, spaceBefore: 60 }),
  spacer(140),
  subHeader('The Entry — the easy yes'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'Scope', weight: 4.0 },
      { label: 'Est. Monthly', weight: 1.4, align: AlignmentType.RIGHT },
      { label: 'Est. Y1', weight: 1.6, align: AlignmentType.RIGHT },
    ],
    [
      ['My AI — Executive Workshop + Readiness', 'A leadership session that sets the AI program as EOS Rocks and a readiness baseline (one-time)', { text: '—', align: AlignmentType.RIGHT }, { text: '~$5,000', align: AlignmentType.RIGHT }],
      ['My AI — Fractional AI Advisor', 'The program lead — strategy, governance, AI-use policy, and the pursuit-automation pilot', { text: '~$2,000', align: AlignmentType.RIGHT }, { text: '~$24,000', align: AlignmentType.RIGHT }],
      ['My SEO — Authority / AEO foundation', 'GEO/authority content on the housing-policy questions developers ask; the inbound foundation', { text: '~$1,000', align: AlignmentType.RIGHT }, { text: '~$12,000', align: AlignmentType.RIGHT }],
      [{ text: 'ENTRY PROGRAM (Y1)', bold: true }, { text: 'Prove the pursuit + efficiency lift, no large build', bold: true }, { text: '', align: AlignmentType.RIGHT }, { text: '~$41,000', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  p('My SEO is shown at its published Tier-3 authority rate. My AI advisory and workshop figures are estimates confirmed at quote. The fuller program below is the expansion, not the ask.', { size: 18, italics: true, spaceBefore: 60 }),
  spacer(120),
  subHeader('The Expansion — once the entry proves out'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'Scope', weight: 4.0 },
      { label: 'Est. Monthly', weight: 1.4, align: AlignmentType.RIGHT },
      { label: 'Est. Y1', weight: 1.6, align: AlignmentType.RIGHT },
    ],
    [
      ['My AI — Institutional Knowledge Graph (build)', 'Make the 57-year / 6,353-project archive searchable; seed corpus + production rollout', { text: '—', align: AlignmentType.RIGHT }, { text: 'scoped build', align: AlignmentType.RIGHT }],
      ['My AI Lead Gen — Account Intelligence', 'Trigger monitoring + pre-meeting dossiers on the named developer universe', { text: '~$1,500', align: AlignmentType.RIGHT }, { text: '~$18,000', align: AlignmentType.RIGHT }],
      ['My Dev — Entitlement / Research Assistant (build)', 'A research assistant for zoning, density-bonus, and ADU pathways per parcel', { text: '—', align: AlignmentType.RIGHT }, { text: 'scoped build', align: AlignmentType.RIGHT }],
      ['My IT / My Compliance — Foundation (as needed)', 'Secure IT + AI-governance foundation for firmwide, three-office rollout', { text: 'scoped', align: AlignmentType.RIGHT }, { text: 'per assessment', align: AlignmentType.RIGHT }],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'The complete program — built after the entry proves the lift', bold: true }, { text: '', align: AlignmentType.RIGHT }, { text: 'scoped at discovery', bold: true, color: CORE_ORANGE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  subHeader('Year-1 ROI — modeled against the entry'),
  p('We model the return against the small entry program, so the ratio is honest and the entry is an easy yes. Read the expected case first: a single additional pursuit won, plus the studio hours the automation returns, clears the entry cost several times over. The expansion opens larger gains this entry ratio does not even count.'),
  spacer(60),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Downside-Protected', weight: 2.1, align: AlignmentType.RIGHT },
      { label: 'Likely (expected)', weight: 2.1, align: AlignmentType.RIGHT },
      { label: 'Upside', weight: 2.1, align: AlignmentType.RIGHT },
    ],
    [
      ['Additional pursuits won (Y1)', { text: '0', align: AlignmentType.RIGHT }, { text: '1', align: AlignmentType.RIGHT }, { text: '2–3', align: AlignmentType.RIGHT }],
      ['Studio hours recovered (Y1)', { text: '~150 hrs', align: AlignmentType.RIGHT }, { text: '~300 hrs', align: AlignmentType.RIGHT }, { text: '~500 hrs', align: AlignmentType.RIGHT }],
      ['Value of recovered capacity*', { text: '+$22,500', align: AlignmentType.RIGHT }, { text: '+$45,000', align: AlignmentType.RIGHT }, { text: '+$75,000', align: AlignmentType.RIGHT }],
      ['Value of additional pursuit wins**', { text: '—', align: AlignmentType.RIGHT }, { text: '+$60,000', align: AlignmentType.RIGHT }, { text: '+$150,000', align: AlignmentType.RIGHT }],
      [{ text: 'Total estimated Y1 value', bold: true }, { text: '+$22,500', bold: true, align: AlignmentType.RIGHT }, { text: '+$105,000', bold: true, align: AlignmentType.RIGHT }, { text: '+$225,000', bold: true, align: AlignmentType.RIGHT }],
      [{ text: 'Entry program (Y1)', bold: true }, { text: '~$41,000', bold: true, align: AlignmentType.RIGHT }, { text: '~$41,000', bold: true, align: AlignmentType.RIGHT }, { text: '~$41,000', bold: true, align: AlignmentType.RIGHT }],
      [{ text: 'Modeled ROI (vs. entry)', bold: true, color: CORE_BLUE }, { text: 'pays for itself', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }, { text: '~2.6×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }, { text: '~5.5×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  p('* Recovered studio hours valued at a conservative blended internal rate (~$150/hr). ** Value of an additional pursuit win is modeled conservatively as design-fee contribution, not total project value; one mid-size residential pursuit is worth well more than the figure shown. All numbers are estimates that calibrate to Danielian’s real pursuit economics at discovery — projected, not guaranteed.', { size: 18, italics: true }),
  spacer(120),
  calloutBox(
    'How to Read This Range',
    [
      'The Downside-Protected case assumes the firm wins zero additional pursuits in Year 1. Even then, the hours the automation returns to billable design cover the entry — the program pays for itself on efficiency alone.',
      'The Likely case (~2.6×) counts a single additional pursuit win plus the recovered hours. For a firm that competes for far more than one pursuit a year, that is a conservative expectation.',
      'The real economics sit above this table: the expansion — the knowledge graph, account intelligence, and entitlement research — compounds across every pursuit and every office, which the entry ratio does not count.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 10 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', CORE_ORANGE, '10'),
  spacer(100),
  p('The roadmap is paced for a busy studio: land the entry fast, prove the pursuit and efficiency lift on real work, then scale firmwide across Orange County, Los Angeles, and Nashville. No phase asks Danielian to absorb more than it comfortably can while still running its business — and each phase maps to an EOS quarter.'),
  spacer(160),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Implementation Roadmap', 620, AR_TIMELINE),
  diagramCaption('Figure 10.0 — Foundation (0–90 days) → Pursuit Engine (90–180) → Firmwide Scale (180–365)'),
  spacer(160),
  subHeader('Phase 1 — Foundation (0–90 days)'),
  bullet('Run a free Nexus Assess to baseline the IT, security, and Microsoft 365 posture before any firmwide AI rollout.'),
  bullet('Run the Executive AI Workshop and set the AI program as EOS Rocks with Scorecard metrics.'),
  bullet('Stand up the proposal-automation pilot on one live pursuit — a concrete before/after on hours-to-proposal.'),
  spacer(120),
  subHeader('Phase 2 — Pursuit Engine (90–180 days)'),
  bullet('Move proposal / SOQ automation into production across the BD team.'),
  bullet('Build the institutional knowledge graph from a seed corpus of the most-reused past projects.'),
  bullet('Turn on account intelligence and pre-meeting dossiers against the named developer universe.'),
  spacer(120),
  subHeader('Phase 3 — Firmwide Scale (180–365 days)'),
  bullet('Roll the program out across Orange County, Los Angeles, and Nashville.'),
  bullet('Add the entitlement and code research assistant for the planning practice.'),
  bullet('Run AI Rocks on the Scorecard every quarter — the program becomes how the firm operates, not a project.'),
);

// ---------- 11 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — No Commitment Required', TEAL, '11'),
  spacer(100),
  p('A handful of things Danielian can do right away with no contract and no spend — each a genuine improvement on its own, and each a natural on-ramp to the program. The first is the marquee: a complete, no-cost assessment.'),
  spacer(80),
  subHeader('Run a free Nexus Assess'),
  p('Nexus Assess is Technijian’s one-time, no-cost IT risk and security assessment — internal and external vulnerability scanning plus a Microsoft 365 review, delivered as a prioritized remediation roadmap that reads like a board memo. For Danielian it doubles as the readiness baseline before any firmwide AI rollout: you see exactly where the studio stands across three offices before committing to anything.'),
  spacer(80),
  subHeader('And four more, no commitment'),
  spacer(40),
  leadBullet('Pick one live pursuit for a before/after. ', 'Let Technijian show the proposal-assembly time on a single real RFQ — the most concrete proof of the highest-value play, with nothing signed.'),
  leadBullet('Add an "AI at Danielian" Rock to the next EOS quarter. ', 'Pick one Scorecard metric — hours-to-proposal is the cleanest — and the program already speaks your operating language.'),
  leadBullet('Tag the ten most-reused past projects. ', 'They become the seed corpus for the knowledge graph. The project data already exists; this just points at it.'),
  leadBullet('Publish one authority piece on a 2026 housing-law angle. ', 'An SB 79 or ADU explainer developers are searching for — the first brick in AI-answer authority.'),
);

// ---------- 12 NEXT STEPS & DISCOVERY ----------
docChildren.push(
  ...sectionHeader('Next Steps & Discovery', DARK_CHARCOAL, '12'),
  spacer(100),
  p('The path from here is short and low-risk. The entry is small on purpose; discovery replaces every estimate in this document with Danielian’s real numbers.'),
  spacer(60),
  ...numberedSteps([
    'Book a 30-minute walkthrough of this strategy — what fits Danielian, what to cut, and what to sequence first.',
    'Schedule the free Nexus Assess — no obligation, and it doubles as the readiness baseline for a firmwide AI rollout.',
    'Pick one live pursuit for a proposal-automation before/after — the fastest way to see the highest-value play in action.',
    'Set the entry program as the next quarter’s AI Rock, with one Scorecard metric to prove the lift.',
  ]),
  spacer(140),
  subHeader('Discovery Questions (to replace every estimate with a real number)'),
  bullet('How many pursuits does the firm respond to per year, and what is the current win rate and average hours-to-proposal?'),
  bullet('What is the current tech stack — CAD/BIM (Revit?), CRM or pursuit tracking, and the project-asset library?'),
  bullet('Which developer relationships are the repeat crown jewels — the seed list for account intelligence?'),
  bullet('What AI tools, if any, is the firm already piloting, and who owns them?'),
  bullet('What is the current IT and security posture and Microsoft 365 setup across the three offices?'),
  bullet('How are EOS Rocks set, and what is the timing to propose an AI Rock?'),
  spacer(200),
  ctaBanner([
    { text: 'Two fronts, one local partner — five minutes apart in Irvine.', size: 26, bold: true },
    { text: 'Use the Book a Meeting button in my signature to set up a time to discuss this and all the', size: 22 },
    { text: 'AI strategies Technijian is putting into place for itself and its clients.', size: 22 },
    { text: 'Ravi Jain, Technijian  |  rjain@technijian.com  |  949.379.8499  |  technijian.com', size: 20 },
  ]),
);

// ---------- 13 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '13'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California — five minutes from Danielian in the Spectrum — serving small and mid-sized businesses since 2000. We design, build, and operate secure infrastructure with security and compliance built in, and a dedicated team assigned to each client.'),
  spacer(160),
  kpiRow([
    { number: 'Since 2000', label: '25+ years in continuous operation', color: CORE_BLUE },
    { number: 'US + India', label: '24/7 global delivery, no extra cost', color: CORE_ORANGE },
    { number: 'AI-native', label: 'Our own agents run in production', color: TEAL },
  ]),
  spacer(160),
  subHeader('The services behind this strategy'),
  buildTable(
    [
      { label: 'Service', weight: 2.2 },
      { label: 'Role in this strategy', weight: 5.8 },
    ],
    [
      ['My AI', 'Fractional AI advisor, proposal automation, the institutional knowledge graph, and the workshop that sets the program as EOS Rocks'],
      ['My AI Lead Gen', 'Account intelligence and pre-meeting dossiers on the named developer universe'],
      ['My SEO', 'Authority and AEO content aimed at the housing-policy questions developers ask'],
      ['My Dev', 'The entitlement / code research assistant and any custom studio tooling (expansion)'],
      ['My IT / My Compliance', 'The secure IT and AI-governance foundation for a firmwide, three-office rollout'],
    ],
  ),
  spacer(160),
  buildTable(
    [
      { label: 'Contact', weight: 2.4 },
      { label: 'Detail', weight: 7.6 },
    ],
    [
      ['Prepared by', 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- 14 APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources & Notes', BRAND_GREY, '14'),
  spacer(100),
  p('This strategy draws on public sources about Danielian Associates and the residential design market, California housing legislation, and AEC AI-adoption research, plus Technijian’s own service definitions and production AI work. Company figures for Danielian (headcount, pursuit volume, win rate) are public-signal estimates confirmed at discovery.'),
  spacer(60),
  bullet('Danielian Associates corporate site — firm overview, people/leadership, architecture and planning service lines, the Danielian legacy, and contact (60 Corporate Park, Irvine, CA 92606; offices in Orange County, Los Angeles, and Nashville; founded 1968; 6,353 projects, 1M+ units, 775+ awards, 44 states, 15 countries; runs on EOS).'),
  bullet('Leadership: Arthur Danielian (Founder & Chairman), John A. Danielian (President), Brian D. Miller (Senior Principal), Ike Balmaseda (Principal, Urban Planning & Design), Jeff Schmehr (CFO), Victor M. Alvarez-Duran (Chief Technology Manager), Deborah Muro (Director of Business Development), and senior directors / project managers.'),
  bullet('California 2026 housing legislation — SB 79 (transit upzoning; effective July 1, 2026), SB 1211 (up to eight detached ADUs per multifamily lot), SB 543 and AB 1061 (ADU streamlining and SB 9 expansion); HCD data on 60,000+ ADU permits since 2018.'),
  bullet('AEC AI-adoption research (2025–2026) — Deltek Clarity A&E Study (53% AI adoption; 94% increasing usage); industry surveys on the readiness gap (75% expect profitability lift, ~20% feel highly prepared); analyses showing ~40% of design-development tasks automatable.'),
  bullet('Competitive references — KTGY, AO Architects, William Hezmalhalch Architects (WHA), Bassenian Lagoni and regional residential peers; public positioning material.'),
  bullet('Technijian service definitions and production AI work — My AI, My AI Lead Gen, My SEO, My Dev, My IT, My Compliance; AI Document Intelligence, institutional knowledge systems, and the multi-agent SEO/AEO platform.'),
  spacer(140),
  p('Note on scope: Technijian has not delivered an architecture-specific AI build. The capabilities in this strategy are proven patterns from other document-heavy, regulated fields, mapped to Danielian’s workflows — presented as near-term builds, never as completed architecture work. All projections are estimated and conservative pending discovery.', { italics: true, size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Danielian-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
