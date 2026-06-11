// MBC Aquatic Sciences (MBCA) — AI Growth & Integration Strategy (AI-Driven Growth Blueprint)
// RKE gold-standard caliber per feedback_blueprint_rke_caliber: 19 sections, 7 personas,
// 5 capability proofs, 6 diagrams. Reads brand-tokens.json. Helpers from ALG/RKE lineage.

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
const PURPLE        = '7B2D8B';
const ROSE          = 'B5476A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_SERVICE_BUF  = dbuf('service.png');
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-03';
const CLIENT = 'MBC Aquatic Sciences';

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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to MBC: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'MBC AQUATIC SCIENCES', size: 50, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Marine & Environmental Science Consulting  ·  Since 1969', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian for Shane Beck, President  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Costa Mesa, California  |  mbcaquatic.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for MBC Aquatic Sciences', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1969', label: 'Founded — CA eelgrass-science pioneer', color: CORE_BLUE },
    { number: '57', label: 'Years in Business (2026)', color: CORE_ORANGE },
    { number: '600+', label: 'Major Scientific Reports Authored', color: TEAL },
    { number: '27 yrs', label: 'Average Project-Management Tenure', color: GOLD },
  ]),
  spacer(300),
  p('MBC Aquatic Sciences has done one thing exceptionally well for fifty-seven years: bring rigorous marine and environmental science to projects that cannot move without it. Since founder Chuck Mitchell started the firm in 1969, MBC has pioneered eelgrass-restoration science in California, built one of the region’s most trusted in-house toxicity-testing laboratories, and authored well over six hundred major scientific reports for the agencies, utilities, ports, and developers who depend on defensible answers. The firm’s reputation — rapid response, and the standard captured in its own motto, "we do it right, or we do it over" — is the asset. And that reputation lives, almost entirely, inside the heads of a remarkable senior bench whose average tenure is twenty-seven years.'),
  p('That is the strength and the strategic question at the same time. MBC competes for work through a finite, named universe of buyers — public water and wastewater agencies, investor-owned and municipal utilities, desalination developers, ports and harbor districts, resource agencies, and the engineering primes who sub the marine scope to MBC. This is an account-based business, won through qualifications, on-call master agreements, relationships, and proposals — not broad consumer marketing. The single fact that the firm’s competitive edge is its accumulated expertise decides where AI creates the most value, and it is not where most firms point it.'),
  p('This strategy lays out three connected moves. First, capture the memory: turn fifty-seven years of reports, field data, taxonomic judgment, and senior-scientist knowledge into a living, queryable institutional brain — before any of it retires. Second, win the proposal race: draft statements of qualifications, scopes, and reference packages from that brain in hours instead of days, so MBC pursues more of the right work without adding headcount. Third, get cited and pursue: become the firm that agency project managers and AI search engines name first for eelgrass, toxicity testing, Clean Water Act §316(b) studies, and desalination documentation — and watch the named-account pursuit pipeline so no on-call solicitation is missed. Every piece sits inside a firm boundary: AI drafts, indexes, monitors, and remembers; a licensed scientist owns and signs every scientific determination and every regulatory submittal.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'MBC’s moat is fifty-seven years of irreplaceable aquatic-science expertise — and the people who hold it are the firm’s most tenured. The first and highest-value AI move is to capture that institutional memory while the founder and the senior bench are still here to inform it.',
      'The same institutional brain is what makes proposals faster and more credible. A specialized consultancy wins on qualifications and response speed; an AI proposal engine drawing on the firm’s own history lifts win rate on the on-call master agreements that are MBC’s steadiest revenue.',
      'The right entry is small and proves itself fast — AI-search authority in an under-served niche, named-account pursuit monitoring, and a strategy workshop. The institutional-memory brain and proposal engine come second, once the entry proves the lift. There is no large build required to begin.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures, and on the spirit of this document. It was prepared for a fellow Vistage member from public information, and the projections in Sections 15 and 16 are deliberately conservative — MBC’s real numbers (average engagement value, pursuit volume and win rate, the named-account roster, and the succession timeline) sharpen the entire plan after a short conversation. Every number here is labeled estimated. The specific questions are in Section 18.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 INDUSTRY & REGULATORY ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('The Aquatic-Science Industry & Regulatory Architecture', TEAL, '02'),
  spacer(100),
  p('MBC operates in a market created entirely by regulation. No agency, utility, or developer commissions marine biology for its own sake; they commission it because a statute, a permit, or an approval requires defensible scientific data before a project can proceed. Understanding that regulatory architecture is the same thing as understanding where MBC’s work comes from — and why the firm that produces defensible answers fastest wins more of it. This section maps the demand environment before the later sections show how AI strengthens MBC’s position inside it.'),
  spacer(140),
  subHeader('The Statutes That Create the Work'),
  p('Two environmental-review statutes sit at the base of the demand. The California Environmental Quality Act (CEQA) and the National Environmental Policy Act (NEPA) require that projects with potential environmental impact be studied and disclosed before approval; the marine, biological, and water-quality sections of those documents are precisely what MBC authors. On the water side, the Clean Water Act drives two more streams: Section 316(a) governs thermal discharges and Section 316(b) governs cooling-water intake structures — the entrainment and impingement studies MBC has run for coastal generating stations for decades — while the NPDES permit program requires whole-effluent toxicity (WET) testing under EPA protocols, which MBC performs in its own laboratory.'),
  spacer(120),
  subHeader('The Agencies That Hold the Gates'),
  p('A coastal or aquatic project in California typically passes through a stack of agencies, each with its own submittal and its own standard of proof: the California Coastal Commission for coastal development, the U.S. Army Corps of Engineers under Section 404 for dredge-and-fill in waters of the United States, the Regional Water Quality Control Board under Section 401 for water-quality certification, the California Department of Fish and Wildlife for species and habitat, and NMFS or USFWS for Endangered Species Act consultations. Eelgrass impacts are governed specifically by the California Eelgrass Mitigation Policy (CEMP) — a framework MBC helped shape the science behind. Each gate is a place where a weak or poorly-documented study stalls a project, and where a firm that knows the agency, the precedent, and the site history moves it forward.'),
  spacer(120),
  subHeader('Why Defensibility Is the Product'),
  p('CEQA is among the most-litigated environmental statutes in the country, and a biological finding that cannot withstand public comment or a legal challenge is worse than useless — it is a schedule and reputation risk for the agency that relied on it. That is the real reason agencies select consultants on qualifications rather than price, and it is why incumbency, track record, and institutional memory matter more in this market than in almost any other professional service. A firm wins because its data and methods will hold up, and because it has held up before. The strategic implication for MBC is direct: anything that makes the firm’s accumulated, defensible track record faster to assemble and easier to prove is a competitive weapon, not a back-office convenience.'),
  spacer(120),
  buildTable(
    [
      { label: 'Regulatory Driver', weight: 2.6 },
      { label: 'What It Requires', weight: 4.0 },
      { label: 'MBC Service That Delivers', weight: 3.4 },
    ],
    [
      ['CEQA / NEPA', 'Defensible biological & marine analysis in EIR/EIS/IS-MND documents', 'Permitting & Documentation; Biological; Surveying'],
      ['Clean Water Act §316(a)/(b)', 'Thermal-effects and entrainment/impingement studies for intakes', 'Marine Studies; long-term monitoring'],
      ['NPDES / EPA WET', 'Acute and chronic whole-effluent toxicity testing', 'In-house Water & Toxicity laboratory'],
      ['Coastal Commission / USACE §404 / RWQCB §401', 'Permit-grade survey data and processing through each agency', 'Permitting & Documentation; Surveying'],
      ['CEMP (eelgrass) / ESA consultations', 'Eelgrass surveys, mitigation design, sensitive-species assessment', 'Mitigation & Restoration; Biological'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Regulatory Load Is Rising — and That Favors the Best-Documented Firm',
    [
      'Scrutiny, litigation exposure, and tighter permitting timelines are all trending up across California coastal and water work. The bar for defensible documentation keeps rising.',
      'In that environment the advantage flows to the firm that can assemble defensible, well-referenced analysis fastest — which is exactly what an institutional-memory brain and an AI proposal engine deliver, inside the boundary that a licensed scientist still signs every determination.',
      'New demand is forming on top of the base: federal Pacific oil-platform decommissioning is now in environmental review, and California offshore wind — though federally paused for the moment — will eventually require exactly the marine baseline science MBC has produced for fifty-seven years. The firm that is already the cited authority captures the new work first.',
    ],
    TEAL
  ),
);

// ---------- 03 SERVICE ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('Service Architecture', CORE_BLUE, '03'),
  spacer(100),
  p('MBC fields seven service families that, taken together, cover a marine or aquatic project from its first baseline study to decades of post-construction monitoring. Few firms of MBC’s size own the vessels, field equipment, and in-house laboratory to do all of it without subcontracting — and that self-sufficiency is a genuine differentiator, because it lets MBC mobilize quickly along the California coast and control the quality and timing of its own data. The diagram below shows how the regulatory drivers create demand, how a project moves through its lifecycle, and where each MBC service family does its work.'),
  spacer(120),
  diagramImage(DIAGRAM_SERVICE_BUF, 'MBC Service Architecture', 600, 1.654),
  diagramCaption('Figure 3.0 — MBC Service Architecture: regulatory drivers, the project lifecycle, and the seven service families'),
  spacer(120),
  buildTable(
    [
      { label: 'Service Family', weight: 2.4 },
      { label: 'What MBC Does', weight: 4.2 },
      { label: 'Primary Driver / Buyer', weight: 3.4 },
    ],
    [
      ['Permitting & Documentation', 'CEQA/NEPA biological and marine sections; Coastal Commission, USACE §404, and RWQCB §401 processing', 'Agencies, developers, primes'],
      ['Surveying', 'Eelgrass and caulerpa surveys, bathymetric and oceanographic surveys, habitat mapping', 'Permitting; pre-construction'],
      ['Marine Studies', 'Benthic, fish, and plankton studies; scientific diving; thermal-effects and §316(b) entrainment/impingement', 'Utilities, desalination, ports'],
      ['Water & Toxicity', 'In-house EPA acute and chronic WET testing; water-quality and NPDES compliance monitoring', 'Dischargers, water/wastewater agencies'],
      ['Biological', 'Sensitive-species assessments; benthic studies near outfalls, platforms, and dredging from San Diego to Alaska', 'Agencies, utilities, federal'],
      ['Mitigation & Restoration', 'Eelgrass (CA pioneer), wetland, and kelp restoration design and monitoring', 'CEMP-driven mitigation; agencies'],
      ['Lake Management', 'Lakes, ponds, and reservoirs for districts, municipalities, golf courses, HOAs, and clubs, with compliance paperwork', 'Recurring private + public clients'],
    ],
  ),
  spacer(160),
  calloutBox(
    'One Lifecycle, One Relationship, Years of Data',
    [
      'Because the families span the whole lifecycle, MBC often holds a single relationship for years — baseline study, permitting, construction monitoring, mitigation, and then long-term monitoring on the same site. That continuity is where the firm earns its incumbency advantage.',
      'It is also where the strategy lands: every family produces reports, data, and judgment that compound over a multi-year relationship. Captured into an institutional-memory brain, that body of work wins the next phase and the next on-call faster than any competitor starting cold.',
    ],
    CORE_BLUE
  ),
);

// ---------- 04 TRACK RECORD & SIGNATURE WORK ----------
docChildren.push(
  ...sectionHeader('Track Record & Signature Work', CORE_ORANGE, '04'),
  spacer(100),
  p('In a qualifications-based market, the proposal is only as strong as the record behind it — and MBC’s record is unusually deep for a firm its size. The signature work below is drawn from public sources and the firm’s own account of its history; the specific project names, agencies, and outcomes are exactly the material a discovery conversation would confirm and the institutional-memory brain would index. The point of this section is simple: MBC has already done the work that wins the next pursuit. The opportunity is to make that record instantly provable.'),
  spacer(140),
  subHeader('Pioneering Eelgrass-Restoration Science'),
  p('MBC pioneered the science of eelgrass restoration in California and has worked in the field for more than three decades. Because eelgrass impacts are governed by their own mitigation policy and are a frequent flashpoint in coastal permitting, a firm with that depth of restoration history is a natural choice when an agency or developer faces an eelgrass question. That accumulated mitigation history — what was tried, where, under what conditions, and how it performed — is among the most valuable and least-documented assets the firm holds.'),
  spacer(120),
  subHeader('Three Decades of Power-Generation & Intake Monitoring'),
  p('MBC has run offshore marine-monitoring programs for twelve coastal generating stations from San Diego to Ventura under NPDES permits, and has monitored the environment offshore the El Segundo Generating Station for thirty years. Its client roster on this work reads like the region’s power map — Southern California Edison, AES (Alamitos, Huntington Beach, Redondo Beach), Cabrillo Power, El Segundo Power, Long Beach Generation, LADWP, and NRG — and extends to the San Onofre nuclear station, where MBC has performed REMP and NPDES studies and Unit 1 decommissioning surveys. These are multi-year programs where the value compounds: the firm that holds the long baseline dataset and understands the site’s history is extremely difficult to displace. Institutional memory is not a nicety here — it is the moat that protects the renewal.'),
  spacer(120),
  subHeader('Desalination, Ports, and a Portfolio of Forty-Plus Named Projects'),
  p('MBC has analyzed the marine impacts of seawater desalination since 2000 — for Poseidon Water, West Basin MWD, the Doheny Ocean Desalination Project, Huntington Beach, Camp Pendleton, the City of Antioch, and the Carlsbad-to-Baja corridor — exactly the projects that draw the most intense Coastal Commission scrutiny. On the maritime side it prepared the water, sediment, and biological-resource sections for the Port of Los Angeles APL Marine Terminal EIS/EIR and has worked the Port of Long Beach repeatedly (Middle Harbor construction, sediment characterization, the Maintenance Dredge Program, stormwater monitoring, and black-crowned night heron mitigation). For the sanitation dischargers it delivered the LACSD Clearwater Program EIR/EIS and runs LA, Orange, and Inyo County whole-effluent toxicity testing. The firm’s public list runs to more than forty named projects across these sectors.'),
  spacer(120),
  subHeader('From San Diego to Alaska — and a Laboratory of Its Own'),
  p('Since 1969 MBC has performed benthic studies near sewage outfalls, thermal discharges, power plants, oil platforms, and dredging operations from San Diego to Alaska, and has authored more than six hundred major reports along the way — one senior scientist alone has logged over twenty-four hundred scientific dives. The in-house toxicity laboratory, run for decades by the same coordinator, gives MBC control over turnaround that firms relying on outside labs cannot match. Founder Chuck Mitchell remains on staff, and the firm is a founding member of the Orange County Marine Protected Area Council and part of the Southern California Kelp Consortium.'),
  spacer(120),
  buildTable(
    [
      { label: 'Signature Capability', weight: 2.6 },
      { label: 'The Evidence (Named Work)', weight: 4.0 },
      { label: 'Why It Wins Work', weight: 3.0 },
    ],
    [
      ['Power-generation monitoring', 'El Segundo (30 yrs), 12 coastal generating stations, San Onofre nuclear; SCE, AES, Cabrillo, NRG, LADWP', 'Incumbency on multi-decade NPDES / §316 contracts'],
      ['Desalination', 'Poseidon, West Basin, Doheny, Huntington Beach, Camp Pendleton, Antioch — since 2000', 'The proven choice for Coastal-Commission-grade desal docs'],
      ['Ports & dredging', 'Port of LA (APL Terminal EIS/EIR); Port of Long Beach (Middle Harbor, sediment, dredge, mitigation)', 'Repeat maritime infrastructure work'],
      ['Wastewater / WET', 'LACSD Clearwater EIR/EIS; LA / Orange / Inyo County WET testing', 'In-house-lab speed on NPDES compliance'],
      ['Eelgrass restoration', 'CA pioneer; 36+ years; Mission Bay, Newport Bay, Convair Lagoon', 'The go-to firm for CEMP-driven eelgrass questions'],
      ['Benthic & biological', '600+ reports, San Diego to Alaska; 2,400+ scientific dives', 'Demonstrated range and depth on technical SOQs'],
      ['Founding stewardship', 'OC Marine Protected Area Council; SC Kelp Consortium', 'Authority and standing in the scientific community'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Best Proposal Asset Is Not Yet Indexed',
    [
      'This track record is MBC’s single strongest proposal asset — and most of it lives in filing cabinets, project servers, and senior scientists’ memories rather than in any searchable system.',
      'The institutional-memory brain turns fifty-seven years of it into instantly-citable proof: every relevant prior project, the agency, the conditions, and the outcome, surfaced into an SOQ in seconds instead of reconstructed by hand under a deadline.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 HOW A SPECIALIZED AQUATIC-SCIENCE FIRM WINS ----------
docChildren.push(
  ...sectionHeader('How a Specialized Aquatic-Science Firm Wins', CORE_BLUE, '05'),
  spacer(100),
  p('With the market and the firm’s capabilities established, the next question is mechanical: how does MBC actually convert all of that into revenue? Not through broad marketing, but through a finite, named universe of buyers — agency project managers, utility environmental leads, desalination developers, ports and harbor districts, and the engineering primes who need a marine specialist on the team. Each pursuit moves through the same process: the firm is identified for an opportunity, qualifies the fit, prepares a statement of qualifications or proposal, is shortlisted and often interviewed, wins the award or task order, and then either renews the on-call master agreement or competes again. The diagram below shows that pursuit funnel, the demand that feeds it, and where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The Named-Account / On-Call Growth Engine', 600, 1.654),
  diagramCaption('Figure 5.0 — How a specialized aquatic-science firm wins: identify, qualify, propose, win, and renew'),
  spacer(120),
  subHeader('Discovery — How a Buyer Finds the Firm'),
  p('An agency project manager scoping an eelgrass survey, a §316(b) entrainment study, or a desalination intake assessment does not start cold. They ask colleagues, they check who holds the relevant on-call, and — increasingly — they ask a search engine or an AI assistant a precise technical question. The firm that is cited as the answer is on the shortlist; the firm that is invisible to that query is not. For a niche where MBC genuinely is one of the most qualified firms in the state, being hard to find in a search is pure lost ground.'),
  subHeader('The Award Is Won on the Proposal'),
  p('Once an opportunity is real, the contest is qualifications and responsiveness. A statement of qualifications or a proposal is assembled from the same materials every time: relevant past projects, key-personnel resumes, agency-specific scopes, references, and the firm’s record on similar work. The firm that returns a complete, well-matched, on-time response wins more of the work it pursues — at the same underlying win rate. For a lean senior team, the binding constraint is how many strong proposals it can produce in a quarter, and that constraint quietly decides how much work the firm even competes for.'),
  subHeader('The Cheapest Win Is the On-Call Renewal'),
  p('Winning a new agency relationship costs a full pursuit cycle; renewing an on-call master agreement costs a strong track record and timely, well-documented performance. The most avoidable losses in this business are not head-to-head defeats on quality — they are renewals that lapse because the institutional knowledge of a long relationship was never captured, or a pursuit that was missed because no one was watching the solicitation calendar. Retention and vigilance are the quiet half of the engine, and they are where institutional memory and pursuit monitoring pay back fastest.'),
  spacer(120),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Capture the memory: turn fifty-seven years of reports, field data, and senior-scientist judgment into a queryable institutional brain — so the firm’s accumulated expertise is an asset that compounds, not one that retires.',
      'Win the proposal race: draft statements of qualifications, scopes, and reference packages from that brain, in the agency’s format, in hours instead of days — so MBC pursues more of the right work without adding headcount.',
      'Get cited and pursue: be the firm cited first for eelgrass, toxicity, §316(b), and desalination work, and watch the named-account solicitation calendar so no on-call opportunity is missed.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 STRATEGIC MARKET DYNAMICS & PROCUREMENT ----------
docChildren.push(
  ...sectionHeader('Strategic Market Dynamics & Procurement', TEAL, '06'),
  spacer(100),
  p('How agencies actually buy marine science determines how MBC must sell it. This is not an advertising market; it is a qualifications-and-relationships market with its own well-defined mechanisms, and an AI growth program only works if it is built around those mechanisms rather than against them. The four below account for nearly all of how MBC’s work is awarded.'),
  spacer(140),
  subHeader('Qualifications-Based Selection (QBS)'),
  p('Public agencies are generally required to select architecture-and-engineering and environmental consultants on qualifications first and negotiate fee second — the federal Brooks Act and California’s "Mini-Brooks Act" (Government Code sections 4525 through 4529.5) codify it. In practice the statement of qualifications, the key-personnel resumes, the project references, and the firm’s demonstrated record decide the shortlist before price is ever discussed. That is precisely the material an AI proposal engine, drawing on an indexed institutional memory, assembles faster and more completely than a team working by hand.'),
  spacer(120),
  subHeader('On-Call Master Agreements'),
  p('Agencies routinely award multi-year on-call or as-needed contracts and then issue task orders against them without re-competing each one. Holding the right on-calls is the steadiest revenue a firm like MBC can have, and renewing them turns on two things: documented performance and relationship continuity. Both are vulnerable to the loss of institutional memory, and both are protected by capturing it. Watching on-call solicitation calendars so the firm never misses a window to get onto a new bench is a core job for AI pursuit monitoring.'),
  spacer(120),
  subHeader('Prime / Subconsultant Teaming'),
  p('MBC is frequently the marine and aquatic specialist on a larger engineering or environmental prime’s team, providing the marine scope inside a bigger pursuit. Being the easy, fast, reliable teaming partner — the firm that turns its scope and qualifications around in time for the prime’s deadline and delivers clean, drop-in work — is what earns the next invitation. A fast proposal engine and a buyer-side conversational layer that answers a prime’s capability questions instantly serve this channel directly.'),
  spacer(120),
  subHeader('Where the Pursuits Surface'),
  p('Opportunities appear in predictable places: agency procurement portals such as PlanetBids and the state’s eProcurement systems, capital-improvement budgets and bond measures that signal upcoming work, NPDES permit renewal calendars, and the relationship intelligence that flows through a well-connected firm. AI pursuit monitoring watches these sources against MBC’s named-account list and surfaces the right opportunity with a pre-pursuit dossier — not a broad funnel, but depth and timing on a known universe.'),
  spacer(120),
  buildTable(
    [
      { label: 'Buying Mechanism', weight: 2.6 },
      { label: 'How It Works', weight: 4.0 },
      { label: 'Where AI Helps', weight: 3.4 },
    ],
    [
      ['Qualifications-Based Selection', 'Shortlist on SOQ, references, key personnel; fee negotiated after', 'Proposal engine + indexed track record'],
      ['On-Call Master Agreements', 'Multi-year bench; task orders issued without re-compete', 'Pursuit monitoring; renewal intelligence'],
      ['Prime / Sub Teaming', 'MBC supplies the marine scope inside a larger team', 'Fast proposal turnaround; conversational layer'],
      ['Portals & Signals', 'PlanetBids, CIP budgets, bond measures, NPDES calendars', 'AI monitoring against the named-account list'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Depth and Timing, Not Volume',
    [
      'None of this is "lead generation" in the consumer sense. MBC already knows who its buyers are; the value is being more present, faster, and better-documented across a known universe of agencies, utilities, and primes.',
      'That is the exact motion AI supports here — and the reason the program is framed as account intelligence and proposal velocity, not a marketing funnel.',
    ],
    TEAL
  ),
);

// ---------- 07 THE MBC BUYER (PERSONAS) ----------
docChildren.push(
  ...sectionHeader('The MBC Buyer', CORE_ORANGE, '07'),
  spacer(100),
  p('These personas are not generic categories — they are derived directly from MBC’s own published client and project list, which reads as a map of the firm’s real buyer universe. Eight distinct segments account for nearly all of MBC’s pursuit and renewal activity, and they fall into three economic groups: a recurring-monitoring backbone (power generators, wastewater and sanitation dischargers, and ports) whose multi-year contracts are the firm’s steadiest revenue; high-value project work (desalination, federal, and coastal-developer engagements); and the prime / A-E teaming channel that is the highest-velocity source of pursuits. The cards below profile each, with real MBC clients named, and Figure 7.0 places them by pursuit volume and account lifetime value.'),
  spacer(160),

  personaCard('1 — The Power-Generation Utility (NPDES / §316)', CORE_BLUE, [
    ['Real MBC Clients', 'Southern California Edison, AES (Alamitos, Huntington Beach, Redondo Beach), Cabrillo Power, El Segundo Power, Long Beach Generation, LADWP, NRG (Mandalay, Ormond Beach); San Onofre nuclear (REMP / NPDES; Unit 1 decommissioning surveys).'],
    ['Pain Points', '§316(a)/(b) thermal-effects and entrainment/impingement studies; NPDES receiving-water monitoring across many stations; decommissioning surveys; multi-decade dataset consistency.'],
    ['Decision Driver', 'Scientific defensibility and site-history continuity — MBC has monitored the El Segundo Generating Station for thirty years and runs offshore monitoring for twelve coastal generating stations.'],
    ['AI Opportunity', 'Institutional memory of multi-decade datasets is the incumbency moat; AI manages the documentation and trend-tracking around each program.'],
    ['Technijian Hook', 'My Dev — the institutional-memory brain. My AI — program documentation and QC. (Flagship recurring; very high LTV.)'],
  ]),
  spacer(160),

  personaCard('2 — The Wastewater / Sanitation District Discharger', TEAL, [
    ['Real MBC Clients', 'Los Angeles County Sanitation Districts (LACSD Clearwater Program EIR/EIS), Orange County Sanitation Districts, Inland Empire Utilities Agency; LAC/OC/IC whole-effluent toxicity (WET) testing services.'],
    ['Pain Points', 'NPDES permit renewal, WET-testing turnaround, effluent and receiving-water limits, and ocean-outfall and receiving-water monitoring under deadline.'],
    ['Decision Driver', 'In-house-lab speed and defensible compliance data that hold up through a permit-renewal negotiation.'],
    ['AI Opportunity', 'Memory of permit and monitoring history; AI documentation and trend-tracking; faster, sourced compliance reporting.'],
    ['Technijian Hook', 'In-house lab + My Dev — the memory brain. My AI — compliance documentation. (High LTV, recurring.)'],
  ]),
  spacer(160),

  personaCard('3 — The Desalination Developer', GOLD, [
    ['Real MBC Clients', 'Poseidon Water, West Basin MWD (desalination EIR), Doheny Ocean Desalination, Huntington Beach, Camp Pendleton, City of Antioch (intake survey), and the Carlsbad / Oceanside / Baja corridor — MBC has analyzed desalination marine impacts since 2000.'],
    ['Pain Points', 'Intake entrainment, brine-discharge impacts, multi-year EIR timelines, and intense Coastal Commission scrutiny — any weak study stalls a billion-dollar project.'],
    ['Decision Driver', 'Regulatory defensibility and schedule certainty; a firm whose desalination marine documentation has cleared the Coastal Commission before.'],
    ['AI Opportunity', 'Memory across MBC’s deep desalination portfolio; faster, well-referenced EIR marine sections; intake-study precedent on tap.'],
    ['Technijian Hook', 'My Dev — the memory brain and proposal engine. My AI — QC on high-stakes documents. (Very high LTV, long-cycle project.)'],
  ]),
  spacer(160),

  personaCard('4 — The Port / Harbor Authority', CORE_ORANGE, [
    ['Real MBC Clients', 'Port of Los Angeles (APL Marine Terminal EIS/EIR), Port of Long Beach (Middle Harbor construction, sediment characterization, Maintenance Dredge Program, stormwater monitoring, black-crowned night heron mitigation), Eastern San Pedro Bay restoration.'],
    ['Pain Points', 'Dredging sediment characterization, terminal EIS/EIR, eelgrass mitigation, and species mitigation on tight construction schedules.'],
    ['Decision Driver', 'Defensible documentation plus deep dredging-and-maritime expertise the ports return to repeatedly.'],
    ['AI Opportunity', 'Project-history memory across many port jobs; faster EIS/EIR sections; mitigation precedent retrieval.'],
    ['Technijian Hook', 'My Dev — the memory brain and proposal engine. My SEO — authority on port and dredging queries. (High LTV; recurring + project.)'],
  ]),
  spacer(160),

  personaCard('5 — The Prime / A-E Teaming Partner', PASS, [
    ['Real MBC Partners', 'AECOM, Dudek, ICF, Michael Baker International, Moffatt & Nichol, MWH, Parsons, Psomas, Tetra Tech, RBF, RECON Environmental, URS, Weston, LSA, Larry Walker Associates, ERM — MBC is the marine specialist sub on their teams.'],
    ['Pain Points', 'Fast turnaround on the marine scope to hit a pursuit deadline; clean, drop-in deliverables; key-personnel availability and a reliable teaming partner.'],
    ['Decision Driver', 'Speed and reliability as the marine sub — and note the coopetition: Dudek, ICF, and AECOM team with MBC on some pursuits and compete on others, so being the fastest, most dependable marine partner keeps MBC on their teams.'],
    ['AI Opportunity', 'The proposal engine turns the marine scope and qualifications around in hours; the conversational layer answers a prime’s capability questions instantly.'],
    ['Technijian Hook', 'My Dev — the proposal engine and conversational layer. My AI — the institutional brain behind both. (Highest velocity.)'],
  ]),
  spacer(160),

  personaCard('6 — The Municipal / Water-District & Resource Agency', PURPLE, [
    ['Real MBC Clients', 'Cities (Antioch, Corona, Riverside, San Diego, Huntington Beach), water districts (Mesa Water, Irvine Ranch, Chino, Elsinore Valley, San Bernardino, Yucaipa Valley, El Dorado ID), and counties (LA, Orange, Inyo); lake and reservoir work (Canyon Lake HABs, Irvine Lake, Silver Lake bathymetry).'],
    ['Pain Points', 'CEQA biological sections, surveys, lake and reservoir HABs management with recurring compliance paperwork, all selected by qualifications.'],
    ['Decision Driver', 'Qualifications and responsiveness; a single firm that handles the science and the paperwork together.'],
    ['AI Opportunity', 'AI-search discovery; SOQ auto-drafting; documentation automation for recurring lake and water-quality compliance.'],
    ['Technijian Hook', 'My SEO — local and AEO discovery. My Dev — the proposal and documentation layer. (Mid-high volume; includes the recurring lake book.)'],
  ]),
  spacer(160),

  personaCard('7 — The Federal / Military Buyer', DARK_CHARCOAL, [
    ['Real MBC Clients', 'U.S. Army Corps of Engineers, U.S. Coast Guard (LA Fast Response Cutter dock construction), and Camp Pendleton (desalination and military marine work).'],
    ['Pain Points', 'Federal procurement and NEPA, Endangered Species Act consultations, Buy-American and federal documentation standards, and a multi-year reliability record.'],
    ['Decision Driver', 'Federal-grade documentation and a demonstrated record on federal and military marine work.'],
    ['AI Opportunity', 'The documentation engine and memory of federal project history; faster, compliant NEPA marine sections.'],
    ['Technijian Hook', 'My Dev — the documentation engine. My AI — QC and federal-format compliance. (Distinct procurement; mid-high LTV.)'],
  ]),
  spacer(160),

  personaCard('8 — The Coastal Developer / Contractor', ROSE, [
    ['Real MBC Clients', 'Bubalo Construction, Intracoastal Dredging, Wieland-Davco, and restoration projects such as Convair Lagoon eelgrass-and-kelp restoration and the Newport Bay mitigation project.'],
    ['Pain Points', 'Eelgrass surveys, permitting, and mitigation on a construction schedule; permit risk at the Coastal Commission or the Corps.'],
    ['Decision Driver', 'A clear path to approval, schedule certainty, and documentation regulators trust.'],
    ['AI Opportunity', 'AI-cited discovery for permitting queries; faster proposals; precedent from the institutional brain on comparable approvals.'],
    ['Technijian Hook', 'My SEO — discovery authority. My Dev — proposal and precedent retrieval. (Mid LTV; project-based.)'],
  ]),
  spacer(200),

  p('Figure 7.0 maps each buyer by pursuit volume and account lifetime value. It shows why the power, wastewater, and port relationships are the recurring backbone, why desalination is the highest-value project work, and why the prime / A-E channel is the highest-velocity source of pursuits. (Emerging segments not yet sized as personas: offshore oil-platform decommissioning — MBC has done the Platform Gina pipeline assessment and the federal Pacific decommissioning environmental review is now underway; the SoCal Kelp Consortium and OC Marine Protected Area Council research work; and, on a longer horizon, California offshore wind, currently paused at the federal level.)', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The MBC Buyer Matrix', 560, 1.49),
  diagramCaption('Figure 7.0 — The MBC Buyer: eight evidence-driven segments by Pursuit Volume vs. Account Lifetime Value'),
);

// ---------- 08 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '08'),
  spacer(100),
  p('MBC competes in two directions at once. Against a small tier of true niche peers — Tenera Environmental, Merkel & Associates, Miller Marine Science & Consulting — it competes on depth and reputation in marine and aquatic science, and it holds its own. Against the large multidisciplinary generalists — Dudek, Environmental Science Associates, Anchor QEA, and the global firms AECOM, ICF, and Stantec — it competes for the marine scope inside bigger pursuits, where scale and bench breadth are the threat. The pattern across the whole field is the same opportunity: the niche peers are small and traditional, and the giants run no niche-specific AI buyer-experience. The scientific credibility is competitive; the digital and AI ground is wide open. And the client list makes plain a twist worth naming: several of those giants — Dudek, ICF, and AECOM — are also primes MBC subs to. MBC both competes with and teams alongside them, so a fast, well-documented marine scope does double duty — it wins the head-to-head pursuits and it keeps MBC on the teaming roster of the very firms it sometimes competes against.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.5 },
      { label: 'Position vs. MBC', weight: 2.9 },
      { label: 'Scale', weight: 1.1, align: AlignmentType.CENTER },
      { label: 'AI / Digital Posture', weight: 3.1 },
    ],
    [
      ['Tenera Environmental', 'Closest direct peer — marine/coastal scientists since 1975; §316(b) and eelgrass leader on the Central Coast', { text: 'Niche', align: AlignmentType.CENTER }, 'Traditional; strong science, modest digital'],
      ['Merkel & Associates', 'Direct — eelgrass mitigation and restoration leader (e.g., Pier 300, LA Harbor)', { text: 'Niche', align: AlignmentType.CENTER }, 'Traditional; no visible AI posture'],
      ['Miller Marine Science', 'Direct (niche) — intake/outfall, impingement/entrainment, NPDES compliance', { text: 'Niche', align: AlignmentType.CENTER }, 'Low; specialist and traditional'],
      ['CSA Ocean Sciences', 'Adjacent — multidisciplinary marine survey since 1970; more offshore/energy', { text: 'Mid', align: AlignmentType.CENTER }, 'Medium; survey-data-led'],
      ['Dudek', 'Generalist threat — large SoCal environmental/engineering; CEQA/NEPA, biology, restoration', { text: 'Large', align: AlignmentType.CENTER }, 'Medium; scale, not niche AI'],
      ['Environmental Science Associates', 'Generalist threat — large CEQA leader founded 1969; coastal/marine practice', { text: 'Large', align: AlignmentType.CENTER }, 'Medium; broad, not niche-AI'],
      ['Anchor QEA', 'Generalist threat — marine/coastal engineering and science; ports, dredging, sediment', { text: 'Large', align: AlignmentType.CENTER }, 'Medium; scale-driven'],
      ['AECOM / ICF / Stantec', 'Global giants — bundle marine scope into mega-pursuits', { text: 'Very High', align: AlignmentType.CENTER }, 'Medium; scale, no niche-AI buyer experience'],
      [{ text: 'MBC Aquatic Sciences (today)', bold: true }, { text: 'CA eelgrass pioneer (1969); in-house tox lab; 600+ reports; deepest niche bench', bold: true }, { text: 'Niche', align: AlignmentType.CENTER, bold: true }, { text: 'Low — strong site, no AI buyer-experience or memory layer', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 8.0 plots the field on the two axes that decide which firm an agency finds, trusts, and shortlists: firm scale and resources, and AI and digital maturity. The niche peers sit with MBC in the bottom-left — deep but under-automated. The giants sit to the right — big, but digitally average and running no niche AI. The top-left corner — a niche specialist with fifty-seven years of depth running institutional-grade AI — is empty. That is MBC’s move.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Firm Scale vs. AI & Digital Maturity', 560, 1.49),
  diagramCaption('Figure 8.0 — Competitive Positioning: Firm Scale vs. AI & Digital Maturity'),
  spacer(160),
  calloutBox(
    'Where MBC Wins — The White Space',
    [
      'The top-left corner — a right-sized niche specialist running institutional-grade AI — is empty. The niche peers have the focus but not the automation; the giants have the scale but no niche-specific AI buyer experience.',
      'There is an honest opening even against the giants: scale does not mean fast or specialized. A global firm cannot match MBC’s fifty-seven-year depth in eelgrass, toxicity, and §316(b) work, and it cannot re-respond to a niche solicitation faster than a focused firm running an AI proposal engine on its own history.',
      'MBC already has the deepest niche expertise in its corner of the market. Adding the institutional-memory brain, the proposal engine, and AI-search authority puts it in a position no competitor in this niche currently holds.',
    ],
    CORE_BLUE
  ),
);

// ---------- 09 THE INSTITUTIONAL-MEMORY MOAT (FLAGSHIP) ----------
docChildren.push(
  ...sectionHeader('The Institutional-Memory Moat', DARK_CHARCOAL, '09'),
  spacer(100),
  p('This is the section that matters most, because it names both MBC’s greatest strength and its greatest exposure — and they are the same thing. The firm’s value is not a product on a shelf; it is fifty-seven years of accumulated scientific judgment. It is knowing what an eelgrass bed in a specific bay did across three decades of surveys, which method a particular regulator will accept, what a toxicity result means in context, and who to call at an agency. That knowledge is the reason MBC is trusted to "do it right." It is also, today, almost entirely undocumented and person-dependent — and the people who hold it are the firm’s most tenured.'),
  spacer(140),
  subHeader('The Expertise Is the Product, and It Is Aging'),
  p('Consider the bench. Founder Chuck Mitchell, who started MBC in 1969 and is senior author or editor on more than six hundred major reports, is still on staff. Senior scientists joined in 1978, 1987, and 1989; one has logged more than twenty-four hundred scientific dives since the 1970s; another runs the in-house toxicity laboratory she has managed for decades. The firm’s own figure — a twenty-seven-year average tenure for project-management personnel — is extraordinary, and it is the foundation of the rapid, confident, defensible work clients pay for. But every year that average tenure climbs, more of the firm’s irreplaceable knowledge sits closer to the door. When a thirty- or forty-year scientist retires, the projects are archived, but the judgment that made them defensible is not.'),
  spacer(120),
  subHeader('What Walks Out the Door'),
  p('The loss is rarely dramatic; it is quiet and compounding. A younger scientist re-derives a method a predecessor perfected. A proposal omits a directly relevant project because no one remembered it. A regulator asks about site history from fifteen years ago and the answer takes a week of digging instead of a minute of recall. A new hire takes three years to build context a retiring expert could have transferred in three months. Consider the thirty-year El Segundo monitoring record, or the multi-decade datasets behind twelve generating stations: the data is archived, but the scientist who knows why a given anomaly in a 2009 survey was not a concern is the irreplaceable part. None of this shows up as a line item — it shows up as slower proposals, thinner institutional continuity on long monitoring contracts, and a moat that erodes one retirement at a time.'),
  spacer(120),
  subHeader('Capturing It Is a Proven Build, Not an Experiment'),
  p('This is precisely the problem Technijian’s Enterprise Knowledge and Memory system was built to solve. Index the firm’s reports, field datasets, toxicity records, taxonomic keys, photographs, agency contacts, and — through structured debriefs — the senior scientists’ own judgment, into a secure, private, queryable institutional brain. Any scientist can then ask, in plain language, "every eelgrass mitigation we have done in this bay, the agency conditions, and the outcomes," and get a sourced answer in seconds. The next generation onboards on the firm’s accumulated judgment instead of reinventing it. And the same brain becomes the engine room for faster proposals, covered in Section 14. For a Vistage member thinking about how to scale a firm whose value is in people, this is the move that converts a key-person risk into a durable, transferable asset.'),
  spacer(120),
  calloutBox(
    'The Memory Is the Moat',
    [
      'MBC’s competitive advantage is fifty-seven years of aquatic-science judgment held by its most tenured people. Captured, it becomes a compounding asset that makes every proposal and project faster and more credible; left uncaptured, it retires with the bench.',
      'This is not a speculative build. Technijian’s Enterprise Knowledge and Memory system (Weaviate and Obsidian) turns an organization’s files, history, and people-knowledge into a secure, searchable brain — the exact capability MBC’s situation calls for.',
      'It is also the honest answer to a succession question: the firm’s value becomes transferable and durable, not dependent on who is in the building on a given day.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 10 THE SCIENCE-FIRST BOUNDARY ----------
docChildren.push(
  ...sectionHeader('The Science-First Boundary — Where AI Stops', TEAL, '10'),
  spacer(100),
  p('MBC’s deliverables carry legal and regulatory weight. A biological section in an environmental impact report must survive public comment and, sometimes, litigation. A toxicity result under an NPDES permit, a §316(b) entrainment finding, a Coastal Commission submittal — each is a professional determination a qualified scientist stakes their name on. The value of a Technijian-built program is not only that the AI is fast; it is that the AI is fast and stays firmly on the correct side of a bright line. This section names that line plainly, because for a science-first firm, naming it is what makes the rest credible.'),
  spacer(140),
  subHeader('CEQA / NEPA and Permitting Documentation'),
  p('MBC authors and contributes the biological and marine analyses inside CEQA and NEPA documents, and processes Coastal Commission, U.S. Army Corps §404, and Regional Water Quality Control Board §401 approvals. AI assembles, drafts, and quality-checks these from the institutional brain and prior approved work, and tracks deadlines and conditions. It does not make the analytical call or sign the document. The qualified scientist or planner owns the analysis and the signature.'),
  spacer(120),
  subHeader('Toxicity Testing, NPDES, and Clean Water Act §316'),
  p('The in-house laboratory runs acute and chronic toxicity testing under EPA protocols, and the firm designs thermal-effects and entrainment/impingement studies under Clean Water Act §316(a) and §316(b). On long-term monitoring programs, institutional memory of a site’s history is decisive — and capturing it protects the incumbency advantage MBC has earned. AI manages the documentation, trend-tracking, and reporting around these programs. It never makes the pass/fail determination, approves a result, or substitutes for the laboratory’s professional method judgment.'),
  spacer(120),
  subHeader('Eelgrass Policy and Restoration Science'),
  p('MBC pioneered eelgrass-restoration science in California and works within the California Eelgrass Mitigation Policy and the broader marine-protected-area framework. The firm’s accumulated mitigation history is exactly the kind of knowledge the institutional brain keeps queryable. AI surfaces precedent and prior outcomes; the scientist designs the mitigation and certifies the result.'),
  spacer(120),
  calloutBox(
    'The Boundary — AI Serves, the Scientist Decides',
    [
      'AI drafts the proposal, indexes fifty-seven years of reports and data, tracks the permitting calendar, runs a multi-model quality check on a draft, and remembers every project — uniformly, with sources cited.',
      'AI never makes a scientific determination, never signs or certifies a regulatory submittal, and never replaces a licensed or qualified professional’s judgment. The scientist owns the analysis, the signature, and the regulatory call.',
      'That boundary is the point: MBC gets the speed and recall of a much larger firm without ever putting its name — or its "we do it right" reputation — on a determination a person did not make.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BRAND & AI-SEARCH PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & AI-Search Presence Audit', CORE_ORANGE, '11'),
  spacer(100),
  p('For a firm that pioneered a field of science and has authored six hundred reports, the public and AI-search footprint materially under-represents the work — and it matters precisely when an agency PM’s first move is a search, an AI query, and a quick scan of the firm’s presence before a shortlist is drawn. The expertise is real and deep; the digital surface that signals and demonstrates it is light. None of the gaps below require changing the science. They require making a firm that is already one of the most qualified in its niche visible and legible to the buyers and the AI engines that now mediate discovery.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.4 },
      { label: 'Gap / Opportunity', weight: 4 },
    ],
    [
      ['mbcaquatic.com', 'Clean, modern service pages, team bios, and a light blog', 'A searchable project portfolio and case-study library; AI-search-optimized technical content on the niches MBC owns; a buyer-side conversational layer'],
      ['AI-search visibility', 'Below the citation surface on technical queries (eelgrass survey/restoration, §316(b) study consultant, marine toxicity lab, desalination documentation)', 'Multi-Agent SEO + AEO targeting the exact queries agency PMs and primes ask — the proven Technijian capability sits here'],
      ['Thought leadership', 'Limited published authority for a field-defining firm', 'A regular cadence on eelgrass policy (CEMP), §316(b), HABs, and coastal resilience — drafted by the content engine, signed by the scientists'],
      ['Proposal / SOQ engine', 'Assembled by hand from prior documents and senior-staff memory', 'AI proposal drafting from the institutional brain — past projects, resumes, references, scopes — in the agency’s format'],
      ['Institutional knowledge', 'Fifty-seven years of reports, data, and judgment, largely un-indexed and person-dependent', 'The institutional-memory brain: the flagship build, and the foundation under both proposals and onboarding'],
      ['Named-account pursuit tracking', 'Relationship- and reputation-led, with no systematic solicitation monitoring', 'Pursuit monitoring on on-call solicitations, CIP and CEQA filings, and NPDES renewal cycles, with pre-pursuit dossiers'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this changes the science or the staffing — it makes a deeply qualified firm visible to the agencies and primes it is already equipped to serve, and legible to the AI engines that now sit between a buyer and a shortlist.',
      'AI-search authority, the conversational layer, the proposal engine, and a thought-leadership cadence compound: each lifts the share of qualified pursuits MBC is invited into and the share it converts.',
      'They are also the natural first ninety days — get cited and capture the named-account pipeline — before any large build, so the entry phase pays back quickly.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI-Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When an agency project manager or a prime asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Who are the best eelgrass survey and restoration consultants in Southern California?"', [
    'TODAY — the AI assistant answers with whichever firms have the strongest content and third-party signals it can read: it names a couple of larger environmental generalists and one or two niche peers, and does NOT mention MBC Aquatic Sciences — even though MBC pioneered eelgrass-restoration science in California and has worked the field for more than three decades. MBC is invisible at the exact moment the buyer is forming a shortlist.',
    'AFTER AEO — the same query returns MBC as a cited option ("MBC Aquatic Sciences pioneered eelgrass-restoration science in California and has authored 600+ marine reports since 1969…"), with the project portfolio and authority content as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result is the baseline the Quick Wins ask MBC to capture, and the first thing the entry program moves.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter MBC is not cited, the assistants learn to answer "eelgrass restoration consultant" or "§316(b) entrainment study firm" with someone else — and that default, once set in the training and retrieval data, is far harder and more expensive to dislodge than to claim now. The same compounding works against the named-account pipeline: an on-call window missed because no one was watching the solicitation calendar is a multi-year revenue stream lost to a competitor for the length of the contract. New demand is also forming — Pacific oil-platform decommissioning is in environmental review, and California offshore wind will eventually need exactly this marine baseline science — and the firm that is already the cited authority captures it first. The cost of waiting is not zero; it is a competitor becoming the default answer, and a renewal or a pursuit quietly going to someone else.'),
);

// ---------- 12 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '12'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services MBC would engage. Each is labeled for what it is, and each maps to a specific MBC use case. To be candid: Technijian has not built an institutional-memory brain or a proposal engine for an environmental-science consultancy before. What it has built is the enterprise knowledge, document-intelligence, multi-model-review, answer-engine, and AI-native delivery capability that such a system is made of — and that is the honest claim, with the proof below.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'This is the institutional-memory brain: index fifty-seven years of reports, field data, toxicity records, taxonomic keys, and senior-scientist debriefs so any scientist can retrieve site history, prior mitigations, and outcomes in seconds — and so the firm’s judgment is captured before it retires.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex, regulated documents for FINRA-registered broker-dealers, cutting response time from days to minutes with sixty to eighty percent less manual review.',
    'Pointed at MBC’s proposals, the same approach drafts statements of qualifications, scopes, key-personnel resumes, and reference packages from the institutional brain, in the agency’s format — so the firm pursues more of the right work at the same win rate, without adding headcount.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked design is a quality-control layer for draft deliverables: it flags missing citations, inconsistencies, and regulatory-language gaps in a draft report before the scientist’s final review — protecting the "we do it right" standard, with the scientist always making the final call.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content-production time by roughly seventy percent.',
    'This is how MBC gets cited: authority on the procurement queries that matter — eelgrass survey and restoration in Southern California, §316(b) entrainment study consultants, marine toxicity testing for an NPDES permit — so AI engines and search surface MBC as the credible answer.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI-Native Software Delivery (SDLC v7.0)',
    'Technijian delivers custom applications on an AI-native software development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships production software roughly three to five times faster than traditional development.',
    'This is why the institutional-memory brain and the proposal engine are a months-not-years build. MBC gets a working, owned system on a realistic timeline, iterated against real proposals and real archives — not a multi-year IT project.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services MBC Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on the AI-native lifecycle above, that ships assistants, portals, and integrations around a client’s actual process.',
    'This builds the working tools owned by MBC: the institutional-memory brain, the AI proposal/SOQ engine, the multi-model QC layer, and the buyer-side conversational layer — owned by the firm, not locked inside a third-party platform.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO — AI-Search Authority & Reputation',
    'My SEO is Technijian’s search service: local search optimization, reputation management, and answer-engine visibility so a firm is found and trusted where its buyers actually look.',
    'For MBC it owns the AI-search citations on niche technical queries, drafts the under-covered thought leadership on eelgrass policy, §316(b), and HABs, and builds the published authority that signals depth to agency PMs and primes.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Named-Account Pursuit Intelligence',
    'My AI Lead Gen is Technijian’s productized account-based service — it tracks named accounts, watches buyer-side triggers, and produces account dossiers and targeted outreach rather than a broad funnel.',
    'For MBC it is named-account pursuit intelligence: watch on-call solicitations, capital-improvement and CEQA filings, NPDES renewal cycles, and agency and prime staff changes, and deliver pre-pursuit dossiers — depth and timing on a known universe, never shotgun marketing.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across the institutional brain, the proposal engine, AI-search content, and pursuit monitoring: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final draft-quality pass, defensibility-critical QC, the deepest reasoning before a scientist signs', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — SOQ and scope drafts, content, outreach personalization, summarization, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — indexing reports, classification, extraction, enriching and tagging thousands of records', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: MBC pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. For example, a single statement of qualifications is drafted from the institutional brain by a low-cost model, tightened and fact-checked by a mid model, and given a final defensibility-and-accuracy pass by a frontier model (or the multi-model QC council) — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 13 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for MBC Leadership', CORE_BLUE, '13'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where MBC sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that Shane, the founder, and the senior bench can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft this statement of qualifications from these past projects and resumes." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the on-call solicitation calendar and flag what needs attention." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. MBC starts with simple automations that pay off in the first ninety days — getting cited, drafting proposals from its own history — and adds autonomous agents only where the value is proven, which is exactly how the roadmap in this report is sequenced. And the bright line never moves: a qualified scientist owns and signs every scientific determination, as Section 10 sets out.'),
  spacer(140),

  subHeader('Where MBC Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run firms — including MBC — sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'MBC Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'Sophisticated digital data and an in-house laboratory exist, but AI is not yet woven into how the firm wins work or runs its proposals and institutional memory', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — proposals, AI-search authority, pursuit monitoring — with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and operations with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the firm runs and competes', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('MBC has the raw material most firms lack: fifty-seven years of reports, field data, and an in-house lab already produce a deep, structured record — that is why it sits at Emerging rather than Foundational. This report is the plan to reach Operational — AI working in the growth engine and inside the firm’s proposals and institutional memory — within nine months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a science-first firm whose deliverables carry regulatory and legal weight, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop on anything client-facing or regulatory — AI drafts, a qualified scientist reviews and signs every determination'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — the institutional brain, toxicity records, and client project data never touch a public model'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — defensibility-ready, led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Organizations Are Already Doing', { color: CORE_BLUE }),
  bullet('Professional services: qualifications-based firms are turning multi-day SOQ and proposal assembly into a minutes-long, well-referenced draft — responding to more pursuits with the same senior team.'),
  bullet('Knowledge-heavy consultancies: firms whose value is in long-tenured experts are capturing decades of judgment into a private, searchable institutional brain before key people retire — de-risking succession.'),
  bullet('Niche technical specialists: under-the-radar experts are using AI-search optimization to become the cited answer when a buyer asks an AI tool "who does this kind of study?" — capturing pursuits competitors never see.'),
  p('These are representative directions of travel across comparable industries, not guarantees; MBC’s own numbers would be confirmed in discovery. Technijian’s specific, measured results from prior builds appear in Section 12 (Capability Proof) and Section 15 (Business Impact).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — An MBC Senior Scientist', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A solicitation lands with a short deadline. A senior scientist hunts through project servers and filing cabinets for the most relevant prior work, re-keys resumes and references, reconstructs an agency’s site history from memory, and drafts the qualifications by hand — pulling hours away from the science only they can do, and risking that a directly relevant project is simply forgotten.',
    'WITH AI: The institutional-memory brain surfaces every relevant prior project, the agency conditions, and the outcomes in seconds; the proposal engine drafts the SOQ, scope, and reference package in the agency’s format; a multi-model check flags any gap. The scientist reviews, sharpens the science, and signs — turning days of assembly into hours, with nothing forgotten and the firm’s judgment captured, not retiring.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but MBC assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 14 AI GROWTH & INTEGRATION ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms MBC’s Growth & Integration', CORE_BLUE, '14'),
  spacer(100),
  p('The engine runs three motions at once. Capture the memory turns fifty-seven years of expertise into a queryable institutional brain. Win the proposal race uses that brain to draft qualifications, scopes, and references in hours, with a multi-model quality check before a scientist signs. Get cited and pursue makes MBC the firm AI engines and agency PMs name first, and watches the named-account solicitation calendar so no opportunity is missed. The brain on the left feeds the proposal engine in the center; AI-search authority fills the pursuit funnel on the right.'),
  spacer(40),
  diagramImage(DIAGRAM_ARCH_BUF, 'The MBC AI Growth & Integration Engine', 600, 1.596),
  diagramCaption('Figure 13.0 — The Engine: Capture the Memory, Win the Proposal Race, and Get Cited & Pursue'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.8 },
      { label: 'Tool', weight: 2.4 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.5 },
      { label: 'Technijian Service', weight: 1.5 },
    ],
    [
      ['Capture the Memory', 'Institutional-memory brain', 'Index 57 years of reports, data, taxonomy, and agency history', 'Retrieval depth', 'My Dev'],
      ['Capture the Memory', 'Senior-scientist debrief capture', 'Record the retiring bench’s judgment before it leaves', 'Knowledge retained', 'My AI'],
      ['Capture the Memory', 'Project & site-history search', 'Every eelgrass, tox, and §316(b) project, queryable in plain language', 'Time-to-answer', 'My Dev'],
      ['Capture the Memory', 'Next-generation onboarding', 'New scientists learn from the firm’s accumulated judgment', 'Ramp time', 'My AI'],
      ['Win the Proposal Race', 'AI SOQ / RFP auto-drafting', 'Draft qualifications and scopes from the brain, in the agency’s format', 'Proposal turnaround', 'My Dev'],
      ['Win the Proposal Race', 'Key-personnel & reference sheets', 'Auto-assemble resumes and matched past projects', 'Win rate', 'My AI'],
      ['Win the Proposal Race', 'CEQA / NEPA scope builder', 'Assemble defensible scopes from approved prior work', 'Scope quality', 'My Dev'],
      ['Win the Proposal Race', 'Multi-model QC review', 'Cross-check drafts for gaps before the scientist signs', 'Defensibility', 'My AI'],
      ['Get Cited & Pursue', 'Answer-engine authority (AEO)', 'Be cited by Google AI, ChatGPT, Perplexity on niche queries', 'AI-citation rate', 'My SEO'],
      ['Get Cited & Pursue', 'Niche thought leadership', 'Eelgrass policy, §316(b), HABs — the under-covered topics', 'Content authority', 'My SEO'],
      ['Get Cited & Pursue', 'Named-account pursuit monitor', 'Watch on-call solicitations, CIP/CEQA filings, NPDES cycles', 'Pursuit coverage', 'My AI Lead Gen'],
      ['Get Cited & Pursue', 'Buyer-side conversational layer', 'Answer agency and prime questions; route to the right scientist', 'Inquiry response', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI drafts, indexes, monitors, and remembers — with sources cited — giving every proposal, every pursuit, and every site question the same complete, fast, well-referenced answer.',
      'AI never makes a scientific determination, never signs or certifies a regulatory submittal, and never replaces a licensed professional’s judgment. The scientist owns the analysis, the signature, and the regulatory call.',
      'The senior bench is freed, not replaced: AI carries the documentation, the search, and the memory; the scientists spend their time on the science, the fieldwork, and the client relationships that win the work.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 15 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '15'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on the highest near-term levers — AI-search authority, named-account pursuit intelligence, and a strategy workshop — and expands into the institutional-memory brain and the proposal engine only as the results prove out. The model below is built from public information and conservative assumptions, because MBC’s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 18 replace them with real baselines.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3.2 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['AI-search citation on niche queries', 'Below the citation surface', 'Cited by Google AI, ChatGPT, Perplexity', 'Discoverability'],
      ['SOQ / proposal turnaround', 'Days; bandwidth-limited', 'Hours; more pursuits at same quality', 'Win rate'],
      ['Institutional knowledge captured', 'Person-dependent, un-indexed', 'Queryable brain, sourced answers', 'Succession de-risked'],
      ['New-scientist ramp time', 'Years to build context', 'Months — learns from the brain', 'Continuity'],
      ['Site-history recall on long contracts', 'Manual, slow', 'Seconds; protects incumbency', 'Renewal rate'],
      ['Named-account pursuit coverage', 'Relationship-led, gaps likely', 'Solicitations watched, dossiers ready', 'Pursuit coverage'],
      ['Senior-scientist hours on admin', 'Heavy, manual', 'Recovered for science and clients', 'Capacity freed'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model — The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the two highest-conviction levers — additional qualified pursuits won through faster, better-referenced proposals and AI-cited discovery, and on-call relationships protected from renewal loss — not on any change to MBC’s scientific or pricing practice. The entry program alone (AI-search authority, named-account pursuit intelligence, and the strategy workshop) drives the lift below; the expansion build adds the institutional-memory brain and the proposal engine that push both levers further.', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Conservative', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.1, align: AlignmentType.CENTER },
    ],
    [
      ['Additional qualified pursuits supported / year', { text: '+3', align: AlignmentType.CENTER }, { text: '+6', align: AlignmentType.CENTER }, { text: '+9', align: AlignmentType.CENTER }],
      ['Implied wins at ~28% shortlist-to-award', { text: '~1', align: AlignmentType.CENTER }, { text: '~1.7', align: AlignmentType.CENTER }, { text: '~2.5', align: AlignmentType.CENTER }],
      ['Avg first-year value per won engagement (illustrative)', { text: '$55K', align: AlignmentType.CENTER }, { text: '$80K', align: AlignmentType.CENTER }, { text: '$110K', align: AlignmentType.CENTER }],
      ['Added revenue from faster, better proposals', { text: '+$55K', align: AlignmentType.CENTER }, { text: '+$135K', align: AlignmentType.CENTER }, { text: '+$275K', align: AlignmentType.CENTER }],
      ['On-call relationships protected from renewal loss', { text: '+1', align: AlignmentType.CENTER }, { text: '+1', align: AlignmentType.CENTER }, { text: '+2', align: AlignmentType.CENTER }],
      ['Renewal value protected (avg $40–55K)', { text: '+$40K', align: AlignmentType.CENTER }, { text: '+$70K', align: AlignmentType.CENTER }, { text: '+$110K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 Value (entry)', bold: true }, { text: '+$95K', bold: true, align: AlignmentType.CENTER }, { text: '+$205K', bold: true, align: AlignmentType.CENTER }, { text: '+$385K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '~3.0x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.4x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~12.0x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only — the easiest place to start. It does not count the larger gains the expansion build adds (the institutional-memory brain and the proposal engine), the succession and key-person risk it retires, the AI-search authority that compounds month over month, or the senior-scientist hours recovered from administrative work. Average first-year value per won engagement is illustrative and is replaced with MBC’s actual book in discovery. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility & Pursuit Pilot', { color: CORE_BLUE }),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The 90-Day AI Visibility & Pursuit Pilot stands up MBC’s AI-search presence on the niche technical queries it should own and the named-account pursuit monitoring, and proves the lift before any larger build is discussed. It is the recurring entry services below (AI-search authority + named-account pursuit intelligence) plus the executive workshop — roughly $32,000 for Year 1.'),
  calloutBox('The Pilot Bar — and Our Commitment', [
    'Success metric: within 90 days, MBC is cited by at least one major AI assistant (ChatGPT, Perplexity, or Google AI) for a high-intent niche query (eelgrass survey/restoration, §316(b) entrainment study, or marine toxicity testing), AND the named-account pursuit monitor is live and delivering pre-pursuit dossiers against MBC’s target roster.',
    'Our commitment: the entry program is month-to-month — no long lock-in, no obligation to continue if it doesn’t hit the metric by day 90. If the pilot has not moved the needle on the metric above, you are under no obligation to continue, and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
  ], CORE_ORANGE),
  spacer(160),
  subHeader('Service Investment Map — Start Small, Expand as It Proves Out'),
  buildTable(
    [
      { label: 'Service', weight: 3.0 },
      { label: 'Scope', weight: 3.4 },
      { label: 'Monthly', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['My AI — AI Readiness + Executive Workshop (one-time)', 'A half-day session with Shane and the senior scientists: the institutional-memory and succession roadmap, proposal-velocity quick wins, and the "scientist signs" AI-governance boundary', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — Niche AI-Search Authority + Reputation', 'Own AI-search citations on eelgrass, §316(b), toxicity, and desalination queries; the thought-leadership cadence', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account Pursuit (Starter)', 'Watch on-call solicitations, CIP/CEQA filings, and NPDES cycles across named agencies, utilities, ports, and primes; pre-pursuit dossiers', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'THE 90-DAY AI VISIBILITY & PURSUIT PILOT — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,250/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — Institutional-Memory Brain + Proposal Engine (Phase 2 build)', 'The custom build — Weaviate/Obsidian institutional brain, AI SOQ/RFP/scope drafting, multi-model QC, and the buyer-side conversational layer (estimated; scoped at discovery)', { text: '—', align: AlignmentType.CENTER }, { text: '~$65,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, and iteration of the brain and proposal engine', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, AI-governance and the "scientist signs" boundary, model-performance and QC review', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $5,050/mo + build', bold: true }, { text: '', bold: true }, { text: '~$130,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $32,000 entry program — AI-search authority, named-account pursuit intelligence, and the strategy workshop — that pays for itself on faster proposals and renewal protection, with no large build to begin.',
      'Expand into the full engine (the institutional-memory brain, the proposal engine, the fractional AI advisor) only once the entry proves the lift. That one-time build is the firm’s durable, transferable knowledge platform.',
      'My Dev and My AI figures are estimated and confirmed at quote; My SEO uses published service tiers. The full-engine total is shown for planning, not as the first ask.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 16 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '16'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan: start with the low-commitment entry — get cited and capture the named-account pipeline — then build the institutional-memory brain and the proposal engine, then add quality control, renewal intelligence, and scale. Real gains — AI-search citations, pursuit dossiers, an indexed knowledge base — are visible inside the first ninety days, before the larger build; the deeper engine is given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'MBC 90-180-270 Day Roadmap', 600, 2.273),
  diagramCaption('Figure 15.0 — The MBC Growth & Integration Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Get Cited & Capture (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — get cited on the niche technical queries and capture the named-account pursuit pipeline, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — AEO + Thought Leadership', 'Launch Multi-Agent SEO + AEO targeting the queries that matter (eelgrass survey and restoration in Southern California; §316(b) entrainment study consultant; marine toxicity testing for an NPDES permit; desalination intake documentation). Draft the under-covered authority content on eelgrass policy, §316(b), and HABs, signed by the scientists.'],
      ['1.2 — Named-Account Pursuit Monitoring', 'Stand up the named-account list across agencies, utilities, ports, and primes. Begin monitoring on-call solicitations, capital-improvement and CEQA filings, and NPDES renewal cycles. Deliver pre-pursuit dossiers to the team — the entry program’s fast win, with no custom build required.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Build the Memory & Proposal Engine (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — capture the institutional memory and stand up the proposal engine on top of it.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Institutional-Memory Brain', 'Index fifty-seven years of reports, field data, toxicity records, taxonomic keys, photographs, and agency history into the Weaviate + Obsidian brain. Run structured debriefs with the founder and senior scientists to capture judgment, not just files. Deliver plain-language search across the firm’s entire history.'],
      ['2.2 — AI Proposal / SOQ Engine', 'Stand up AI drafting of statements of qualifications, scopes, key-personnel resumes, and reference packages from the brain, in the agency’s format. Add the multi-model QC layer and the buyer-side conversational layer on mbcaquatic.com.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — QC, Renew & Scale (Days 181–270)', { color: CORE_ORANGE }),
  p('Add the quality-control discipline, the renewal and pursuit intelligence, and scale the engine across the firm.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — QC + Onboarding + Renewal Intelligence', 'Operationalize multi-model QC on draft deliverables (scientist signs). Use the brain for next-generation onboarding. Add renewal intelligence — on-call cycles, performance milestones, agency-relationship triggers — so no renewal lapses unattended.'],
      ['3.2 — Scale the Engine + ROI Review', 'Extend the proposal engine and brain firm-wide across service lines and the lake-management book. Deliver an ROI dashboard measured against the Section 18 baselines, and a plan for ongoing thought-leadership authority.'],
    ],
  ),
);

// ---------- 17 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '17'),
  spacer(100),
  p('Five actions MBC can take immediately — before any new Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Test AI-Search Visibility for Your Niche',
    ['Type the queries an agency PM or a prime would type into ChatGPT, Perplexity, and Google AI: "eelgrass survey and restoration consultant Southern California," "Clean Water Act 316(b) entrainment study firm," "marine toxicity testing lab for an NPDES permit in Orange County." See whether MBC is cited; capture a screenshot baseline. It costs nothing and immediately sizes the AI-search opportunity for a firm that should be the obvious answer.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Publish One Authority Post This Week',
    ['Have a senior scientist publish a short, factual piece on eelgrass-restoration practice under the California Eelgrass Mitigation Policy, or on what §316(b) compliance really requires. The niche is under-covered online; one authoritative post from a field-defining firm earns more credibility with agency PMs than most outreach.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Start the Institutional-Memory Capture With One Debrief',
    ['Sit the founder or a senior scientist down for a recorded, structured one-hour debrief on a single signature project — the site, the method, the agency, the outcome, what they would tell a younger scientist. It is the first entry in the institutional brain, it is valuable on its own, and it makes the succession opportunity concrete.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Pick the Top 25 Named Accounts to Track First',
    ['Choose the twenty-five named accounts — agencies, utilities, ports, and primes — that matter most for the next twelve months. Note the on-call cycle, the current relationship, and the known contact. This is the seed list the named-account pursuit monitoring will track from day one.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Claim a Free Nexus Assess',
    ['Technijian will run one free Nexus Assess — a no-cost assessment covering internal and external vulnerability (with a dark-web credential check) and a Microsoft 365 review, delivered as a prioritized remediation roadmap. For a firm whose institutional data is its single most valuable asset, knowing how well that data is protected is the right first step, and it maps to the security posture any AI build will sit on top of. No commitment required.'],
    CORE_BLUE),
);

// ---------- 18 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '18'),
  spacer(100),
  p('This strategy was built from public information. The numbers in Sections 15 and 16 are deliberately conservative estimates — a short discovery call replaces them with MBC’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Succession & ownership', 'The succession plan and timeline; the retirement horizon for the founder and senior bench', 'This is the engagement’s center of gravity — it sets the urgency of memory capture'],
      ['Average engagement value', 'Average first-year value of a won engagement, by type (on-call, project, monitoring)', 'Replaces the $55K / $80K / $110K illustrative range'],
      ['Pursuit volume & win rate', 'Proposals per quarter, current turnaround, recent shortlist-to-award rate, on-calls held', 'Sizes the proposal-velocity lever directly'],
      ['Knowledge state', 'Where 57 years of reports, data, and photos live today; biggest "lost when X retires" risks', 'Defines the institutional-brain build and the capture priority'],
      ['Current win engine', 'How SOQs are assembled today; any CRM or proposal tools (Deltek, Unanet, other)', 'Defines the build and integration surface'],
      ['Named-account roster', 'Which agencies, utilities, ports, and primes are core, in-flight, or top-of-pipe', 'Calibrates the ROI math and seeds the pursuit list'],
      ['In-house lab / systems', 'Toxicity-lab software (LIMS) and any reporting-assist appetite', 'Confirms integration points vs. core build'],
      ['IT & data governance', 'Microsoft 365 tenant, data protection posture, and who manages IT today', 'The institutional brain needs governed access to the archives'],
      ['Decision & budget owners', 'Beyond Shane, who weighs in (the founder on legacy/science; an ops or finance lead on budget)', 'Aligns the proposal with how MBC actually decides'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 entry proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on MBC’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 19 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '19'),
  spacer(100),
  p('The honest answers to the questions MBC leadership is most likely asking right now.'),
  spacer(140),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already have people and tools that handle our website and proposals. Why add Technijian?', bold: true }, 'Keep them — this sits alongside what you do today, it does not replace your scientists or your process. We add the layer no general marketing help provides: AI-search authority on your niche queries, the institutional-memory brain, and the AI proposal engine drawing on your own fifty-seven-year history. We run under your named-account strategy, not over it.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this plan starts with simple, proven automations that pay back fast — getting cited and drafting proposals from your own record — not autonomous "agents" doing the science. We use the simplest tool that works, measure it, and only expand what earns its place. The scientist still signs every determination.'],
      [{ text: 'Is our data — reports, toxicity records, client project files — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything client-facing or regulatory, led by a CISSP-certified team. Data protection is also the point of the free Nexus Assess in the Quick Wins — your institutional data is your single most valuable asset.'],
      [{ text: 'We’re a lean senior team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give your senior scientists back hours, not add work. Technijian runs the build and the cadence; your involvement is a short strategy session plus structured debriefs and reviewing what we draft. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry program is a fixed-scope 90-day pilot with a defined success metric (Section 15), month-to-month with no long lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it. You carry the upside, not the risk.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry program is approximately $32K for Year 1 — AI-search authority, named-account pursuit intelligence, and the strategy workshop — at published or quote-confirmed rates, with no large up-front build. The full engine (the institutional-memory brain and proposal engine) is profiled in Section 15, but only as the later expansion once the entry proves the lift.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 20 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '20'),
  spacer(100),
  p('MBC already has the hard things: fifty-seven years of field-defining science, a founder still on staff, a senior bench whose depth no competitor in the niche can match, an in-house toxicity laboratory, and a reputation that wins work. What it has not yet done is capture that expertise into a durable asset, and put an AI growth and integration layer underneath the proposals and pursuits that turn reputation into awards. That is where this program starts.'),
  p('The opportunity is concrete: capture the institutional memory before it retires, win the proposal race by drafting qualifications and scopes from the firm’s own history in hours, and get cited and pursue so MBC is the firm agency PMs and AI engines name first. A focused, account-based program does all three — and it stays firmly on the right side of the boundary that matters to a science-first firm: AI serves, the scientist decides.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 18 questions and confirm program scope — and, since this began as a conversation between Vistage members, to talk candidly about the succession and scaling questions underneath it.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within five business days.',
      'Step 3: Phase 1 kickoff — AI-search authority, named-account pursuit intelligence, the strategy workshop, and a free Nexus Assess — live inside 30 days of signature, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to capture fifty-seven years of expertise — before it retires?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 21 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '21'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help right-sized, expert organizations compete at scale — with security and compliance built in, not bolted on. For MBC, that means capturing fifty-seven years of institutional knowledge, accelerating the proposals that win work, and earning the AI-search authority a field-defining firm deserves.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for MBC', weight: 5 }],
    [
      ['My Dev', 'Custom AI-native builds — the institutional-memory brain, the proposal/SOQ engine, the multi-model QC layer, and the buyer-side conversational layer, owned by MBC'],
      ['My SEO', 'AI-search authority (AEO), reputation, and the under-covered thought leadership on eelgrass policy, §316(b), and coastal-resilience topics'],
      ['My AI Lead Gen', 'Named-account pursuit intelligence — watch on-call solicitations, CIP/CEQA filings, and NPDES cycles; pre-pursuit dossiers'],
      ['My AI', 'AI strategy and builds — fractional AI advisor, model-performance review, and program leadership with the "scientist signs" governance throughout'],
      ['My Security', 'Cybersecurity and the free Nexus Assess — protecting the institutional data that is MBC’s single most valuable asset'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Public web research conducted June 2026. Company details (founding, locations, services, leadership, and stated figures) are drawn from public sources and MBC’s own website and should be confirmed with MBC before external use.', { italics: true }),
  spacer(60),
  p('1. MBC Aquatic Sciences — mbcaquatic.com (home, services, about/who-we-are, about/team, and the marine, lake-management, water-quality-and-toxicity-testing, and biological service pages). Founded 1969 as Marine Biological Consultants, Inc.; Costa Mesa, CA; tagline "Pure science with people in mind"; motto "We do it right, or we do it over." Affiliations: founding member, Orange County Marine Protected Area Council; Southern California Kelp Consortium; named client reference Southern California Edison.', { size: 20, spaceAfter: 100 }),
  p('2. Leadership and staff — Shane Beck, President / Principal Scientist (with MBC since 1992; owner since approximately 2008; long-tenured Vistage member, per public search); founder Charles "Chuck" Mitchell (1969), VP / Managing Scientist (600+ reports); senior scientists with tenures from 1978–1989 (one with 2,400+ scientific dives); in-house toxicity laboratory; stated 27-year average project-management tenure.', { size: 20, spaceAfter: 100 }),
  p('3. Services — permitting/documentation (CEQA/NEPA, Coastal Commission, USACE §404, RWQCB §401); surveying (eelgrass/caulerpa, oceanographic); marine and biological studies and scientific diving; thermal-effects and Clean Water Act §316(a)/(b); EPA acute/chronic toxicity testing and NPDES; mitigation/restoration (eelgrass, wetland, kelp); and lake management.', { size: 20, spaceAfter: 100 }),
  p('4. Competitors — Tenera Environmental (since 1975; §316(b), eelgrass), Merkel & Associates (eelgrass mitigation, e.g., Pier 300), Miller Marine Science & Consulting (intake/outfall, NPDES), CSA Ocean Sciences (since 1970), Dudek, Environmental Science Associates (founded 1969), Anchor QEA, Chambers Group, and the global generalists AECOM, ICF, and Stantec.', { size: 20, spaceAfter: 100 }),
  p('5. Regulatory context — CEQA/NEPA; Clean Water Act §316(a)/(b); EPA whole-effluent toxicity (WET) and NPDES; Coastal Commission, USACE §404, and RWQCB §401 permitting; the California Eelgrass Mitigation Policy (CEMP) and marine-protected-area framework; QBS (federal Brooks Act / CA Mini-Brooks Act, Gov. Code 4525–4529.5).', { size: 20, spaceAfter: 100 }),
  p('6. Technijian — proven builds: Enterprise Knowledge & Memory (Weaviate + Obsidian), AI Document Intelligence (FINRA), ScamShield LLM Council, Multi-Agent SEO & Answer-Engine, AI-Native SDLC v7.0. Services: My Dev, My SEO, My AI Lead Gen, My AI, My Security. My SEO uses published tiers; My AI and My Dev figures are estimated, confirmed at quote.', { size: 20, spaceAfter: 100 }),
  p('7. AI literacy & responsible-AI frameworks (Section 13) — MIT Sloan Management Review (AI literacy: "what AI can do," not how to build it); Anthropic, "Building Effective Agents" (the automation/workflow vs. agent distinction); a widely-used five-stage AI maturity model, consistent with Gartner and Google Cloud frameworks (the Foundational→Transformational ladder concept); U.S. NIST AI Risk Management Framework, Govern/Map/Measure/Manage (the responsible-AI controls for the three risks). Peer "directions of travel" are representative industry examples, not Technijian client guarantees.', { size: 20, spaceAfter: 100 }),
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

const OUT_PATH = path.join(__dirname, 'MBC-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
