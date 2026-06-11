// Pacific Utility Installation, Inc. (pacificutility.com) — AI Growth & Integration Strategy
// Technijian-branded DOCX report builder, built to the technijian-biz-dev-blueprint skill at RKE caliber.
// Counts are RESEARCH-DRIVEN (not copied): 18 sections, 5 personas, 4 built + 3 service capability proofs,
// 6 diagrams — derived from Pacific Utility's actual buyer landscape and the specialty-contractor GTM.
// WARM PROSPECT (Vistage peer relationship), NOT an existing client — so NO "in place" IT line.
// ABM / specialty-construction GTM. AUTHENTIC logo. Real published rates + "TBD — discovery" (no invented
// pricing). Built-vs-service capability labels. The moat = "AI assists; the licensed estimator/PM signs."

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ---------- Brand constants ----------
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE     = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE   = strip(tokens.color.primary.orange.$value);
const TEAL          = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';
const PURPLE        = '7B2D8B';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

// AUTHENTIC logo (NOT the AI-fake set in assets/logos/png/technijian-logo-*).
const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_MODEL_BUF    = dbuf('model.png');
const DIAGRAM_SERVICES_BUF = dbuf('services.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_COMP_BUF     = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-03';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) { return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, pageBreakBefore: true, spacing: { before: 0, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}
function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 280, after: 120 }, children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })] });
}
const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })] });
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 80, right: 80 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 38, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}
function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function personaCard(name, color, fields) {
  const headerRow = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 120, bottom: 120, left: 200, right: 200 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })] })] });
  const fieldRows = fields.map(([label, value], i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], rows: [headerRow, ...fieldRows] });
}
function capabilityBox(title, built, applies, kind = 'built') {
  const leadLabel = kind === 'service' ? 'The Technijian Service: ' : 'What Technijian Built: ';
  const leadColor = kind === 'service' ? TEAL : CORE_BLUE;
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: leadColor, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: leadLabel, size: 20, bold: true, color: leadColor, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Pacific Utility: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ] }),
    ]})],
  });
}
function diagramImage(buf, altTitle, widthPx = 600, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) }, altText: { title: altTitle, description: altTitle, name: altTitle } })] });
}
function diagramCaption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}

function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 168, height: 35 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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

// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 264, height: 55 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'PACIFIC UTILITY', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Utility Engineering · Wet · Dry · High Voltage · Streetlights  —  Corona, California', size: 22, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Corona, California  |  pacificutility.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for Pacific Utility Installation, Inc.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
// Section 01's pageBreakBefore (in sectionHeader) separates the TOC from Section 1 — no trailing pageBreak() needed here.
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }));

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1997', label: 'Building Since', color: CORE_BLUE },
    { number: '5 Trades', label: 'One Source, One Schedule', color: CORE_ORANGE },
    { number: 'Employee-Owned', label: 'ESOP Since 2017', color: TEAL },
    { number: 'CA · NV · AZ', label: 'Tri-State Footprint', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Pacific Utility Installation has spent more than twenty-five years building the underground that everything else stands on. Since 1997 the firm has grown from high-voltage cable-pulling in Southern California Edison territory into one of the few contractors that self-performs the whole underground scope — utility engineering, wet utility, dry utility, high voltage, and streetlights and traffic signals — across California, Nevada, and Arizona. It is employee-owned, an ESOP since 2017, and it pioneered the "Applicant Installation" model that lets developers control their own power-infrastructure schedule. The work and the reputation are real. What has not yet been built is the digital and AI engine that makes that reputation findable, that wins more of the right work, and that lets a labor-short team bid more without adding estimators it cannot hire.'),
  p('This plan is shared peer-to-peer, value first. Technijian is an AI-native managed-services and technology firm in Irvine; we build the answer-engine visibility, the project-and-permit intelligence, and the secure AI tooling that let a specialist firm compete above its size. The thesis here is specific to this moment in Pacific Utility’s market, and it is the reason to act now rather than next year.'),
  p('The market is splitting into two engines moving in opposite directions. Residential development — a core channel for Pacific Utility — is cooling across California, Nevada, and Arizona into 2026. At the same time the grid and public-infrastructure side is in a once-in-a-generation boom: roughly $1.4 trillion of U.S. utility capital spending is forecast for 2025–2030, the largest transmission build ever is underway, and federal programs are pouring into grid undergrounding, EV charging, broadband, and streetlights. Pacific Utility already does the work that boom demands — high voltage, Rule 20 undergrounding, streetlights and signals — and has hired utility leadership to chase it. The opportunity is to rebalance deliberately toward the booming side, and to use AI to win more of it with the team the firm already has.'),
  p('The program runs three motions, all account-based and all true to how a contractor actually wins work. Get found and trusted: own the answer-engine and the "single-source, all five trades" story no competitor can claim, across three states. Win the work: project, permit, and bid intelligence that surfaces the right developers, agencies, and utility programs early, plus AI that assembles responsive bids and accelerates estimating. Run leaner and remember: capture twenty-five years of bids and jurisdictional know-how into a searchable memory, and lift the output of every estimator and crew. One boundary holds throughout — on fixed-price, safety-critical work, AI assists, and the licensed estimator or project manager owns the final price and signs.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Rebalance toward the boom: residential is cooling while grid, undergrounding, EV, broadband, and streetlights are surging — and Pacific Utility already self-performs exactly that work. AI helps the firm chase and win more of it.',
      'Own a category that is digitally asleep: no underground-utility contractor has claimed the AI-answer position, and none can claim Pacific Utility’s single-source, all-five-trades, tri-state story. First mover earns compounding authority.',
      'Make bandwidth the advantage, not the ceiling: in a skilled-labor shortage, estimating capacity is the bottleneck. AI lets the firm bid more and bid sharper without adding estimators it cannot hire — the human still signs the number.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Pacific Utility’s internal numbers (bid volume, win rate, average job size, estimating capacity) were not part of this draft. Every projection below is labeled illustrative, pricing shows real published rates where they exist and "to be determined in discovery" everywhere else, and the return is shown as the method we will measure — not an invented multiple. The discovery questions in Section 19 replace estimates with real baselines.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE STRATEGIC INFLECTION ----------
docChildren.push(
  ...sectionHeader('The Strategic Inflection — Two Diverging Engines', DARK_CHARCOAL, '02'),
  spacer(100),
  p('Every growth plan should start with the force that makes it urgent, and for Pacific Utility that force is a split in the market the firm serves. The two demand engines that have run side by side for years are now moving in opposite directions, and the firm is positioned — by trade mix, licenses, and recent hiring — to ride the one that is rising. This is the "why now."'),
  spacer(140),
  buildTable(
    [ { label: 'Engine', weight: 2.1 }, { label: 'What’s Happening (2025–2026)', weight: 4.2 }, { label: 'What It Means for Pacific Utility', weight: 3.7 } ],
    [
      ['Residential development (cooling)', 'Housing starts and deliveries are pulling back across CA, NV, and AZ; SoCal metros saw price softening and Las Vegas builders logged the slowest February sales in a decade', 'The developer/builder channel softens near-term — a reason to diversify the bid mix, not to lean harder on cooling demand'],
      ['Grid & public infrastructure (booming)', '~$1.4T U.S. utility capex 2025–2030; the largest transmission build ever; in 2023, utilities spent on the order of $11.8B on underground lines and $7.5B on transformers (the latter up roughly 23% year over year)', 'Pacific Utility already self-performs high voltage, Rule 20 undergrounding, and streetlights — the exact scopes the boom demands'],
      ['Federal & state programs', 'IIJA grid modernization (~$73B), DOE grid-hardening and undergrounding, NEVI EV charging ($5B, restored 2025), BEAD broadband ($42B) ramping into 2026, CA SB 1 (~$5B/yr) for streets', 'New, fundable channels for dry-utility, high-voltage, EV, broadband, and streetlight scopes — if the firm is found and prepared early'],
      ['Wildfire-driven undergrounding', 'CPUC Rule 20 is shifting from legacy work-credit projects to utility wildfire-mitigation undergrounding (IOU hardening) — a growing, multi-year channel', 'A direct fit for the firm’s origin business; the contractor that owns the "undergrounding" story is positioned to win it'],
      ['The skilled-labor shortage', 'Construction needs hundreds of thousands of net new workers; electricians retire faster than they are replaced, with the workforce projected to shrink while demand rises', 'Estimating bandwidth and crew productivity — not demand — become the binding constraint; this is precisely where AI pays'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Inflection, Stated Plainly',
    [
      'The demand is moving toward exactly what Pacific Utility already does best — underground, high voltage, undergrounding, and streetlights — and away from the residential channel that is cooling.',
      'The constraint is no longer finding work; it is having the estimating bandwidth to chase and win more of the right work with a team that cannot be hired up quickly in a labor shortage.',
      'That is the whole case for AI here: be found first where the booming work is, bid more of it faster and sharper, and lift the output of the people the firm already has — with the licensed estimator still signing the number.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 03 SERVICE ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('Pacific Utility’s Service Architecture', CORE_BLUE, '03'),
  spacer(100),
  p('Pacific Utility is one of the few contractors that can self-perform the entire underground scope of a project. Most rivals pick a lane — dry utility, or wet utility, or electrical. Pacific Utility runs five practice lines under one roof, and that is not just a broader menu; it is the structural reason the firm can offer a developer something its competitors cannot: a single point of accountability for everything below grade, on one schedule. When one contractor owns the trenching, the conduit, the vaults, the high-voltage make-up, and the streetlights, there are fewer seams for conflicts to hide in and fewer handoffs to slow energization. That single-source story is the firm’s sharpest differentiator — and it is almost entirely unmarketed.'),
  spacer(160),
  diagramImage(DIAGRAM_SERVICES_BUF, 'Pacific Utility’s Five Trades', 600, 2.04),
  diagramCaption('Figure 3.0 — Five practice lines under one roof: the single-source underground story no siloed competitor can claim'),
  spacer(120),
  subHeader('Utility Engineering — plan the risk out first'),
  p('The firm approaches utility work differently by leading with engineering: site studies and due diligence, project estimations, constructability reviews, conflict-overlay plans that find the clashes before a crew is in the trench, customer-side engineering, guaranteed structure placement, and work-order processing. This is where schedule risk is removed before it becomes a change order — and where AI-assisted estimating and conflict detection have the most leverage.'),
  subHeader('Wet & Dry Utility — the underground backbone'),
  p('Wet utility covers sewer mainline, storm drain, water mainline, sewer laterals and water services, and points of connection. Dry utility — the firm’s origin business — covers utility trenching, Rule 20 overhead-to-underground conversions, conduit, vaults and substructures, electrical line extensions, telecom infrastructure, gas, and private communications. Together they are the single-source backbone: the developer who hires Pacific Utility for both is buying one schedule and one accountable partner instead of coordinating two siloed subs across the same trench.'),
  subHeader('High Voltage — the safety-critical specialty'),
  p('Pacific Utility installs new residential and commercial power infrastructure: cable, splice, and make-up of primary and secondary services; setting and energizing transformers, switchgear, and secondary structures; and metering. This is life-safety work, and the firm says so plainly — "there is no such thing as discount high voltage." It is also the scope most exposed to the grid-capex boom, and the one where the "AI assists, the licensed professional signs" boundary matters most.'),
  subHeader('Streetlights & Traffic Signals — the public-works funnel'),
  p('The firm installs and maintains parking-lot, commercial, residential, and city street lighting; traffic signals; controllers and pedestals; retrofits; and ongoing maintenance and repair. This is the channel fed by SB 1, municipal LED and connected-streetlight conversions, and intelligent-transportation funding — a recurring, agency-driven complement to the project-based development work.'),
  spacer(120),
  buildTable(
    [ { label: 'Practice Line', weight: 2.3 }, { label: 'Primary Buyer', weight: 2.5 }, { label: 'Where AI Helps', weight: 5 } ],
    [
      ['Utility engineering', 'Developers & GCs', 'Estimating and takeoff acceleration, conflict-overlay assistance, constructability first-passes the engineer reviews'],
      ['Wet & dry utility', 'Developers & builders', 'The single-source authority story, project/permit intelligence, and bid assembly across both scopes'],
      ['High voltage', 'Developers, utilities', 'Bid acceleration and safety/compliance documentation — with the licensed estimator signing the price'],
      ['Streetlights & signals', 'Municipal / public works', 'Public-works RFP response automation and prevailing-wage / traffic-control document assembly'],
    ],
  ),
);

// ---------- 04 TRACK RECORD, CREDENTIALS & THE ESOP DIFFERENCE ----------
docChildren.push(
  ...sectionHeader('Track Record, Credentials & the ESOP Difference', CORE_ORANGE, '04'),
  spacer(100),
  p('Pacific Utility’s credibility is real and earned — and almost entirely uncaptured online. More than twenty-five years in business, a tri-state license footprint, membership in the contractor and homebuilder associations that matter, named municipal work, and an employee-ownership culture that retains craftspeople in a labor-short market. The proof exists; it is simply not merchandised where developers, agencies, and the engineers who specify subcontractors can see it. That gap is itself part of the opportunity.'),
  spacer(140),
  subHeader('The License & Geography Footprint'),
  p('Few specialty contractors carry the firm’s breadth of licensure across three states, which is both an operational asset and a structural search advantage — the firm can credibly own answer-engine visibility in markets where most competitors are single-state.'),
  buildTable(
    [ { label: 'State', weight: 1.6 }, { label: 'License(s)', weight: 3.2 }, { label: 'Footprint', weight: 3.2 } ],
    [
      ['California', 'C-733207 — classifications A, B, C-10', 'Headquarters in Corona; the core SoCal market'],
      ['Nevada', '0090319 (C-2) and 0085785 (A)', 'Las Vegas office (opened 2020) — a booming Southwest market'],
      ['Arizona', 'ROC 343337 (A) and 343338 (CR-11)', 'Scottsdale office (opened 2020) — Phoenix-metro growth corridor'],
    ],
  ),
  spacer(160),
  subHeader('Leadership & Affiliations'),
  p('Pacific Utility was founded in 1997 by Daniel Mole — today Chairman and CEO, and the originator of the "Applicant Installation" model — alongside co-founder Bill Pfeifer. The firm has deliberately built out its public-infrastructure bench, bringing in distribution-services leadership with utility and IOU-design background (ex-SDG&E and a national utility-design platform) to lead the municipal and grid focus. It is a member of the Associated General Contractors (AGC), the Building Industry Association of Southern California (BIASC), and the Southern Nevada Home Builders Association (SNHBA), and it holds itself to formal safety standards. The named municipal work the firm references — high-voltage work for the City of Corona, dry-utility work for Azusa, and streetlights and signals for Moreno Valley — is exactly the kind of public-agency proof that wins the next RFP, and exactly the kind that is currently invisible online.'),
  spacer(160),
  calloutBox(
    'Employee-Owned Is a Growth Asset, Not Just a Culture Note',
    [
      'An ESOP since 2017, Pacific Utility is owned by the craftspeople who do the work — a genuine retention advantage when skilled labor is the industry’s scarcest resource and the deciding constraint on capacity.',
      'It is also a trust and brand story buyers respond to: the people on the job have an ownership stake in getting it right. Today that story is barely told online.',
      'Merchandising the real proof — the tri-state licenses, the association memberships, the named agency work, the employee-ownership — is among the cheapest, highest-return moves in this plan, because the work is already done; it just needs to be made findable.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE MARKET & HOW CONTRACTORS WIN WORK ----------
docChildren.push(
  ...sectionHeader('The Market & How Contractors Win Work', CORE_BLUE, '05'),
  spacer(100),
  p('Pacific Utility’s growth engine is account-based and bid-driven, not a marketing funnel — and any plan that ignores how this work is actually won will aim at the wrong target. Contractors win through competitive bids to general contractors and developers, government public-works RFPs, prequalification and on-call master agreements, and decades-old relationships. The job of AI is to make the firm found and trusted early, surface the right projects sooner, and assemble responsive bids faster — never to "generate leads" in a category that does not buy that way.'),
  spacer(140),
  subHeader('How the Work Is Won'),
  buildTable(
    [ { label: 'Channel', weight: 2.5 }, { label: 'How It Works', weight: 4 }, { label: 'Where AI Helps', weight: 3.5 } ],
    [
      ['Competitive hard bid (private)', 'Developers and GCs invite bids on defined scopes; speed and estimate accuracy decide who wins — a large share of winning bids land within days of posting', 'Project/permit intelligence flags the bid early; AI takeoff and bid assembly let the firm respond faster and sharper'],
      ['Public-works RFP (low bid)', 'Agencies post solicitations; public projects draw roughly twice the bidders of private work, so responsiveness and compliance matter', 'RFP response automation assembles compliant, complete bids; prevailing-wage and traffic-control docs auto-drafted'],
      ['Prequalification & on-call', 'Agencies and utilities prequalify contractors and award on-call/master agreements; being on the list is the precondition to bid', 'AI assembles and maintains prequal packages; account intelligence tracks which agencies/utilities to pursue'],
      ['Relationships & reputation', 'Repeat developers, GCs, and engineers who specify subs; long memories and referrals', 'A merchandised track record and answer-engine authority make the firm the easy, credible specification'],
    ],
  ),
  spacer(160),
  subHeader('The Preconstruction Pain'),
  p('Preconstruction is where bids are won or lost and where time leaks. Estimators do manual takeoffs against volatile material prices and lead times, and a single scope gap on a fixed-price bid transfers real risk to the contractor. Industry research puts a striking share of project time lost to searching for data and to rework. In a labor shortage, the estimating function is the bottleneck — every bid an estimator cannot get to is revenue the firm never had the chance to win. This is the single clearest place AI earns its keep for Pacific Utility, and it is why the plan leads there.'),
  spacer(120),
  calloutBox(
    'AI Adoption Is Already Here — In Estimating First',
    [
      'In the latest industry outlook, a majority of construction firms now use AI or plan to increase AI investment, and estimating is among the top applications — this is not speculative for the sector.',
      'Automated takeoff can compress preconstruction from dozens of hours to a fraction, with the estimator reviewing and owning the result — directly relieving the bandwidth constraint.',
      'The firms adopting this now will out-bid and out-pace those still doing it entirely by hand; the advantage compounds bid over bid.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 HOW BUYERS CHOOSE ----------
docChildren.push(
  ...sectionHeader('How Buyers Choose — the Bid & Relationship Economy', TEAL, '06'),
  spacer(100),
  p('This is the section that decides whether the growth plan is right or wrong, because Pacific Utility wins work through bids and relationships, not a lead funnel. A developer assembling a project, a GC pricing a job, and a public agency issuing an RFP all decide on the same things: can this contractor do the scope, will it hit the schedule, is the price right, and is it the kind of firm engineers and owners trust to specify. The job of AI is to make Pacific Utility the contractor that is found early, trusted on sight, and able to respond fast — across both the private and public sides.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'How Pacific Utility Wins Work', 600, 1.73),
  diagramCaption('Figure 6.0 — A relationship- and bid-driven contractor: private developers and GCs and public agencies and utilities, won account by account'),
  spacer(120),
  subHeader('The Buyer’s Decision Path'),
  bullet('Specify or shortlist: the developer, GC, or agency engineer decides which contractors are credible for the scope — visibility, proof, and the single-source story shape who makes the list.'),
  bullet('Solicit the bid: an invitation to bid (private) or a posted RFP (public) goes out; the firms that learn about it early and can respond fast have the edge.'),
  bullet('Price and respond: estimators take off the scope and assemble the bid against schedule and price — the place where bandwidth and accuracy decide the outcome.'),
  bullet('Award and build: the relationship and the delivered result feed the next invitation — reputation compounds, which is why merchandised proof matters.'),
  spacer(120),
  buildTable(
    [ { label: 'Buyer', weight: 2.4 }, { label: 'How They Choose', weight: 3.6 }, { label: 'How AI Supports It', weight: 4 } ],
    [
      ['Land developers & builders', 'Schedule certainty and single-source accountability across all underground scopes', 'The single-source authority story + project/permit intelligence that surfaces their projects early'],
      ['General contractors', 'A reliable underground sub that prices fast and delivers on schedule', 'Faster, sharper bid response so the firm is the easy, dependable sub to call'],
      ['Public agencies', 'Responsive, compliant low bids and prequalified, on-call partners', 'RFP response automation, prequal-package assembly, and agency account intelligence'],
      ['Utilities (grid hardening)', 'Proven high-voltage and undergrounding capability and program prequalification', 'Undergrounding authority content + intelligence on IOU hardening and Rule 20 programs'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Found Early, Trusted on Sight, Fast to Respond',
    [
      'Never a lead funnel: this is how a bid-and-relationship contractor earns the right to price the work. Authority and proof get the firm onto the shortlist; intelligence gets it to the bid early; AI assembly gets the response out fast.',
      'The reinforcing loop is the point: visible authority makes the firm easier to specify and trust, better intelligence surfaces more of the right bids, and faster response wins more of them — each delivered job feeds the next invitation.',
      'AI supports the human relationship layer — the estimator’s judgment, the project manager’s reputation, the handshake on the next job — and never replaces it.',
    ],
    TEAL
  ),
);

// ---------- 07 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', CORE_BLUE, '07'),
  spacer(100),
  p('The next contract comes from a few clear pools. In a bid-and-relationship market these are won with authority, intelligence, and response speed — not volume — and the program serves all of them, weighted toward the booming grid and public-infrastructure side.'),
  spacer(120),
  buildTable(
    [ { label: 'Growth Pool', weight: 2.6 }, { label: 'Who / What', weight: 3.2 }, { label: 'How Pacific Utility Captures It', weight: 4 } ],
    [
      ['Grid & utility undergrounding', 'IOU wildfire-mitigation undergrounding, Rule 20 conversions, high-voltage programs', 'Undergrounding authority content + intelligence on utility hardening programs and prequalification'],
      ['Public-works & streetlights', 'Municipal RFPs for streets, signals, LED and connected-streetlight conversions (SB 1, ITS)', 'RFP response automation and agency account intelligence to win more, more responsively'],
      ['EV, broadband & federal-funded', 'NEVI EV charging, BEAD broadband, IIJA-funded dry-utility and conduit scopes ramping into 2026', 'Early project/permit intelligence so the firm is bidding before the field is crowded'],
      ['Single-source developer work', 'Developers who would rather hire one accountable underground partner than coordinate siloed subs', 'The "all five trades, one schedule" story — the position only Pacific Utility can credibly own'],
      ['Tri-state local search lanes', 'Buyers searching for underground / dry / high-voltage contractors in CA, NV, and AZ cities', 'Answer-engine and local SEO across three states — a lane no single-state rival can hold'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Reinforcing Loop',
    [
      'The grid, public-works, and federally-funded pools are demand that is surging right now — the job is to be found, prequalified, and bidding early, before the field fills in.',
      'The single-source and relationship pools are won by reputation and response — AI surfaces the right projects and assembles the bid, while the estimator and PM close them.',
      'Each pool strengthens the others: visible authority makes the firm easier to specify, better intelligence surfaces more of the right work, and a merchandised track record makes every bid more credible.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE FIVE PACIFIC UTILITY BUYERS ----------
docChildren.push(
  ...sectionHeader('The Five Pacific Utility Buyers', CORE_ORANGE, '08'),
  spacer(100),
  p('Pacific Utility sells to a finite, named set of buyers — not a broad consumer market. The five profiles below are derived from the firm’s actual work across private development and public infrastructure; they are not a borrowed template. The matrix that follows places each by project value and how strategic and recurring the relationship is — which is where account-based effort should concentrate, and it points toward the booming grid and public side.'),
  spacer(160),

  personaCard('1 — The Utility / Grid-Hardening Buyer', PURPLE, [
    ['Who', 'An investor-owned or public utility running wildfire-mitigation undergrounding, Rule 20 conversions, and high-voltage hardening — the booming channel.'],
    ['Pain Points', 'Massive multi-year programs, a shortage of qualified high-voltage and undergrounding contractors, and prequalification gates.'],
    ['Decision Driver', 'Proven high-voltage and undergrounding capability, safety record, and program prequalification.'],
    ['AI Opportunity', 'Undergrounding authority content earns visibility; intelligence on hardening programs and prequal status arms the pursuit.'],
    ['Technijian Hook', 'My SEO — undergrounding authority. My AI Lead Gen — utility-program intelligence.'],
  ]),
  spacer(160),
  personaCard('2 — The Land Developer (Master-Planned)', CORE_BLUE, [
    ['Who', 'A horizontal/master-planned-community developer who needs all the underground done on schedule across multiple phases — the "Applicant Installation" buyer.'],
    ['Pain Points', 'Schedule slips when siloed subs clash in the same trench; energization delays hold up the whole project.'],
    ['Decision Driver', 'Single-source accountability and schedule certainty across every underground scope.'],
    ['AI Opportunity', 'The single-source story plus project/permit intelligence that surfaces their entitlements and permits early.'],
    ['Technijian Hook', 'My SEO — the single-source authority. My AI Lead Gen — project & entitlement intelligence.'],
  ]),
  spacer(160),
  personaCard('3 — The Production Home Builder', CORE_ORANGE, [
    ['Who', 'A production builder putting up homes lot after lot who needs underground and power delivered reliably across many parcels.'],
    ['Pain Points', 'Repeatable scopes where any delay multiplies across lots; needs a dependable sub that prices fast.'],
    ['Decision Driver', 'Reliability, repeatable pricing, and a sub that keeps the schedule across a long pipeline.'],
    ['AI Opportunity', 'Faster bid turnaround and account intelligence to stay ahead of the builder’s next phases.'],
    ['Technijian Hook', 'My Dev / My AI — bid acceleration. My AI Lead Gen — builder-pipeline intelligence.'],
  ]),
  spacer(160),
  personaCard('4 — The General Contractor', TEAL, [
    ['Who', 'A GC on commercial, mixed-use, or public projects who hires Pacific Utility as the underground subcontractor.'],
    ['Pain Points', 'Needs an underground sub that prices quickly and accurately and never becomes the schedule’s weak link.'],
    ['Decision Driver', 'Speed and accuracy of bid response, and dependable delivery on schedule.'],
    ['AI Opportunity', 'AI takeoff and bid assembly make Pacific Utility the fast, sharp, easy sub to call back.'],
    ['Technijian Hook', 'My Dev / My AI — estimating & bid assembly.'],
  ]),
  spacer(160),
  personaCard('5 — The Municipal / Public-Works Agency', CRITICAL, [
    ['Who', 'A city or public-works agency issuing RFPs for streetlights, traffic signals, dry utility, and high-voltage work — the named Corona / Azusa / Moreno Valley pattern.'],
    ['Pain Points', 'Needs responsive, compliant low bids from prequalified, on-call partners; values a clean safety and delivery record.'],
    ['Decision Driver', 'Responsiveness, prevailing-wage and compliance discipline, prequalification, and proven agency work.'],
    ['AI Opportunity', 'RFP response automation and prequal-package assembly, plus agency account intelligence on upcoming solicitations.'],
    ['Technijian Hook', 'My Dev / My AI — RFP & prequal automation. My AI Lead Gen — agency intelligence.'],
  ]),
  spacer(200),
  p('Figure 8.0 places each by project value and strategic, recurring value — the utility/grid and land-developer accounts carry the most strategic weight, which is where account-based effort should concentrate.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Pacific Utility Customer Matrix', 580, 1.50),
  diagramCaption('Figure 8.0 — Customer Matrix: Project / Account Value vs. Strategic & Recurring Value'),
);

// ---------- 09 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape & the White Space', CORE_BLUE, '09'),
  spacer(100),
  p('Pacific Utility competes in a category that is, almost uniformly, content-shy and answer-engine-blind. The big underground rivals win on scale and earned media; the dry-utility and wet-utility peers run brochure sites with little or no thought-leadership. Only one competitor does steady project-PR, and through earned media rather than owned, indexable content. No one has claimed the AI-answer position, the single-source story, or the tri-state search lane — and Pacific Utility, self-performing all five trades across three states, is positioned to take all three.'),
  spacer(140),
  buildTable(
    [ { label: 'Competitor', weight: 2.1 }, { label: 'Lane / Reach', weight: 3 }, { label: 'Posture vs. Pacific Utility', weight: 4.1 } ],
    [
      ['W.A. Rasic Construction', 'Heavy-civil underground; Long Beach', 'The content leader — steady project-PR syndicated through industry press, but earned media, not owned, indexable authority'],
      ['Doty Bros. Construction', 'Dry utility; Anaheim; decades-old, MBE', 'The closest dry-utility analog — functional site, no blog or thought-leadership, no AI signal'],
      ['Sukut Construction', 'Mass-grading + underground; Santa Ana', 'The grading incumbent on big land jobs — polished site and real field tech, but not a buyer-facing content or AI story'],
      ['Helix Electric', 'Electrical; San Diego + Las Vegas', 'The electrical scale player in SD/LV — large site and regional PR, scale-driven, not owned search'],
      ['Sturgeon Electric (MYR)', 'High-voltage transmission/substation; AZ + NV', 'The HV benchmark in the firm’s Southwest geography — utility-focused, not developer-facing'],
      ['T.E. Roberts', 'Wet + dry pipeline; Orange', 'A mid-sized wet/dry peer — clean site, no case-study or content engine'],
      ['Turf Construction', 'Wet + dry for subdivisions; SoCal', 'The closest developer-facing profile — minimal portfolio, no news or tech, representative of the category’s thinness'],
    ],
  ),
  spacer(200),
  subHeader('Content & Answer-Engine Scorecard'),
  p('Reduced to what now decides who gets specified and found — owned authority content, answer-engine visibility, and merchandised project proof — the picture is clear, and it shows the move available to a single-source, tri-state firm.'),
  buildTable(
    [ { label: 'Player', weight: 2.6 }, { label: 'Owned Content', weight: 1.9, align: AlignmentType.CENTER }, { label: 'AEO / AI Answers', weight: 1.9, align: AlignmentType.CENTER }, { label: 'Project Proof', weight: 1.7, align: AlignmentType.CENTER }, { label: 'Verdict', weight: 2.4 } ],
    [
      ['W.A. Rasic', { text: 'Earned PR', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Press', color: PASS, align: AlignmentType.CENTER }, 'Content leader, via earned media'],
      ['Helix / Sturgeon', { text: 'Scale PR', align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Some', align: AlignmentType.CENTER }, 'Scale, low owned content'],
      ['Doty / T.E. Roberts / Turf', { text: 'Minimal', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Little', color: CRITICAL, align: AlignmentType.CENTER }, 'Brochure sites'],
      [{ text: 'Pacific Utility (today)', bold: true }, { text: 'Thin', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Un-scored', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'Real capability, uncaptured', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 9.0 plots the field. The whole category sits low on answer-engine maturity — the only real content comes from one rival’s earned press. The realistic move for Pacific Utility is straight up-and-right: own the AI-answer position and the single-source story no competitor has claimed.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. Content & Answer-Engine Maturity', 580, 1.50),
  diagramCaption('Figure 9.0 — Competitive Positioning: Scale / Reach vs. Content & Answer-Engine Maturity'),
  spacer(160),
  calloutBox(
    'Where Pacific Utility Wins',
    [
      'The AI-answer corner is empty — not one underground-utility contractor is optimized for the answers buyers and engineers now get from AI and search. First mover earns compounding, credible authority.',
      'Pacific Utility alone can own the single-source, all-five-trades story — no siloed competitor can claim it, and it is exactly what a schedule-anxious developer wants to hear.',
      'And the tri-state lane is open ground: most rivals are single-state, so owning the underground-contractor answer in CA, NV, and AZ cities is a position no one else can hold.',
    ],
    CORE_BLUE
  ),
);

// ---------- 10 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '10'),
  spacer(100),
  p('For a twenty-five-year, tri-state, single-source contractor, the digital presence dramatically under-represents the firm — and the gaps are precise and fixable. The point is not that Pacific Utility needs to become a media company. It is that real capability and real proof are not structured for the way developers, agencies, and the engineers who specify subs now find and vet a contractor.'),
  spacer(140),
  buildTable(
    [ { label: 'Digital Asset', weight: 2.6 }, { label: 'Current State', weight: 3.2 }, { label: 'Gap / Opportunity', weight: 4.2 } ],
    [
      ['Answer-engine visibility', 'No structured content for the questions buyers ask AI and search about underground/dry/HV contractors', 'The single biggest fixable gap — become the cited answer across three states, a lane no rival holds'],
      ['The single-source story', 'The all-five-trades differentiator is barely stated on the site', 'The one position only Pacific Utility can own — make it the headline, schema-marked and searchable'],
      ['Project-proof scoreboard', 'No structured, searchable case studies; named municipal work is invisible', 'Twenty-five years and named agency work, un-merchandised — a credibility asset left on the table'],
      ['Undergrounding / grid authority', 'No content claiming Rule 20, undergrounding, or high-voltage expertise', 'Claim the grid-hardening search lane exactly as that channel booms'],
      ['Recency & social presence', 'Last visible news/LinkedIn activity is years old; modest following', 'A fast credibility and recency signal — buyers read an outdated presence as an outdated firm'],
      ['Project & permit intelligence', 'No system to surface entitlements, permits, or bids early', 'The clearest "AI as business development" play — know about the right projects before the field crowds in'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the firm — only making real, existing capability visible the way buyers and AI engines now find it.',
      'The answer-engine fix, the single-source story, and the proof scoreboard are low-cost, compounding moves in a category no competitor has claimed.',
      'They are also the natural first ninety days: make the capability visible and structured, then layer on project intelligence and the secure AI tooling.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a developer’s engineer or an agency buyer asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Who installs dry utility and high-voltage for a master-planned community in the Inland Empire / Las Vegas / Phoenix?"', [
    'TODAY — the AI assistant answers with whichever contractors have the strongest indexable content and third-party signals it can read: it names a couple of larger or better-publicized firms, and does NOT mention Pacific Utility — even though Pacific Utility self-performs all five underground trades on one schedule across exactly those three states. The firm is invisible at the moment the buyer is forming a shortlist.',
    'AFTER ANSWER-ENGINE OPTIMIZATION — the same query returns Pacific Utility as a cited option ("Pacific Utility Installation self-performs wet, dry, high-voltage, streetlights, and utility engineering across CA, NV, and AZ — a single-source underground partner…"), with the single-source page and the project-proof scoreboard as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result for the firm’s actual target queries would be captured as the answer-engine baseline at kickoff.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('Answer-engine visibility compounds, and it rewards whoever optimizes first. Every quarter Pacific Utility is not cited, the assistants learn to answer "underground / undergrounding / high-voltage contractor in [city]" with someone else — and that default, once set in the retrieval data the engines lean on, is harder and more expensive to dislodge than to claim now. The category is wide open: no underground-utility contractor in the set has claimed the AI-answer position, the single-source story, or the tri-state lane. That window is widest right now, before a rival builds its own answer-engine presence — and it lines up with the grid and public-infrastructure boom the firm is built to win. The cost of waiting is not zero; it is a competitor becoming the default answer in the exact lane Pacific Utility should own.'),
);

// ---------- 11 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof — What We’ve Built', CORE_BLUE, '11'),
  spacer(100),
  p('This section is the credibility centerpiece, and it comes before the AI growth pitch. We separate two things plainly: proven builds Technijian has actually delivered, and the productized services Pacific Utility would engage. We have not built an AI estimating-and-bid platform for an underground-utility contractor before, and we say so; what follows maps real, delivered capabilities to this specific firm, honestly labeled — because a contractor that lives on accountable scopes deserves the same discipline from its technology partner.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence inside a FINRA Broker-Dealer’s Controls',
    'Technijian deployed AI document intelligence that auto-populates complex, structured questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review — inside the firm’s supervision and review controls.',
    'This maps directly to bid and RFP assembly: the same approach drafts responsive public-works bids, assembles prequalification packages, and pulls the right details from twenty-five years of past bids — with the estimator reviewing and owning the result.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants — cutting content-production time roughly 70%.',
    'This is the engine that makes Pacific Utility findable: own "underground / dry / high-voltage utility contractor" across CA, NV, and AZ cities, the "single-source" story, and the Rule 20 undergrounding lane no contractor has claimed.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Knowledge System — Weaviate + Obsidian Institutional Memory',
    'Technijian builds vector-search knowledge systems that turn years of files and tribal knowledge into a searchable, AI-queryable memory — surfacing the right precedent in seconds instead of hours.',
    'For Pacific Utility it captures twenty-five years of bids, jurisdictional know-how, and conflict-overlay precedents into matched references for the next estimate — the institutional memory that survives a retirement and sharpens every bid.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'LLM Council — Three-Model Peer Review for Defensible Output',
    'Technijian built an LLM Council pattern (ScamShield) in which three independent models review and challenge one another’s output before anything is finalized — raising accuracy and catching errors a single model misses.',
    'For a firm whose bids are fixed-price and safety-critical, the same peer-review pattern strengthens a first-pass takeoff or estimate the licensed estimator then verifies and signs — accuracy as a discipline, before the number goes out the door.',
    'built'
  ),
  spacer(140),
  subHeader('Productized Services Pacific Utility Would Engage'),
  capabilityBox(
    'My SEO — Answer-Engine, Tri-State Local & the Single-Source Story',
    'My SEO is Technijian’s local and answer-engine search service — answer-engine optimization, authority and project-proof content, schema and structure, and local search. (New for Pacific Utility — there is no SEO program today.)',
    'It makes the real capability visible: the tri-state underground-contractor answer, the single-source story, the Rule 20 / undergrounding authority lane, and a merchandised project-proof scoreboard.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Project, Permit & Account Intelligence',
    'My AI Lead Gen is Technijian’s productized intelligence service — it identifies and profiles high-fit accounts and opportunities from public data, enriches and prioritizes them, and supports targeted, relationship-led pursuit (not volume prospecting).',
    'For Pacific Utility it flags developers, master-planned communities, agencies, and utility programs entitling or permitting underground and electrical scope across CA, NV, and AZ — months early, so the firm bids before the field crowds in.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev & My AI — AI Estimating, Bid Assembly & Knowledge',
    'My Dev and My AI are Technijian’s custom-application and applied-AI services — built on an AI-native lifecycle and integrated with the platforms a firm already uses for estimating, project management, and documents.',
    'For Pacific Utility they build the AI takeoff and estimating acceleration, the bid and RFP assembly, the prequalification and compliance-document automation, and the institutional-knowledge system — with the licensed estimator or PM signing the price.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task'),
  p('A fair question about running AI across content, project intelligence, and estimating support: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [ { label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER } ],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass, compliance-critical answers, the deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — content, outreach personalization, summarization, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, extraction, enriching and tagging thousands of records', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Pacific Utility pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single authority page is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. On the work that has to be right, the same three-model peer-review pattern (the LLM Council above) raises accuracy before anything goes out. This is the kind of AI-engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 12 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Pacific Utility Leadership', CORE_BLUE, '12'),
  spacer(100),
  p('This section exists to make the rest of this plan easy to evaluate. No jargon, no hype — just what AI is, where Pacific Utility sits today, how to adopt it without risk, and what comparable firms are already doing. The goal is that Daniel Mole and the leadership team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t'),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft this bid response from these takeoff quantities and the firm’s past bids." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the permit and bid boards across three states and flag what fits our scope." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Pacific Utility starts with simple automations that pay off in the first ninety days, and adds autonomous monitoring only where the value is proven — which is exactly how the roadmap in this plan is sequenced. And on fixed-price, safety-critical work the boundary holds throughout: AI assists, the licensed estimator or PM signs.'),
  spacer(140),

  subHeader('Where Pacific Utility Sits Today — The AI Maturity Ladder'),
  p('Most established, well-run firms — including Pacific Utility — sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [ { label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Pacific Utility Today', weight: 1.6, align: AlignmentType.CENTER } ],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'The data and process assets for AI exist (twenty-five years of bids, jurisdictional know-how, a tri-state footprint) but AI is not yet woven into growth or operations', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — answer-engine content, project intelligence, estimating support — with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and operations with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the business competes and runs', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Pacific Utility has the raw material most firms lack — a deep bid history and real jurisdictional expertise — which is what puts it at the Emerging stage rather than the first rung. This plan is the path to reach Operational: AI working in the growth engine and inside estimating, within roughly nine months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages'),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a fixed-price, safety-critical contractor, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [ { label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 } ],
    [
      ['Hallucination', 'AI can state a confident, wrong answer — a takeoff quantity or a bid number that looks right but isn’t', 'Human-in-the-loop on anything binding: AI drafts the takeoff and the bid; the licensed estimator or PM verifies and signs the price'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — bid history, pricing, and prequalification data never touch a public model'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps on prevailing-wage and DIR-governed public work', 'Every AI tool inventoried with owner, vendor, and data source — public-works-ready, led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Firms Are Already Doing'),
  bullet('Construction estimating: contractors are using automated takeoff to compress preconstruction from dozens of hours to a fraction, letting each estimator carry more bids — the estimator still reviews and owns the number.'),
  bullet('Business development: developer- and agency-facing firms are using project, permit, and entitlement intelligence to surface the right opportunities months early and bid before the field crowds in.'),
  bullet('Specialty trades: document-heavy regulated contractors are turning multi-day bid, RFP, and prequal assembly into a minutes-long, reviewable draft — responding to more solicitations with the same team.'),
  p('These are representative directions of travel across comparable firms, not guarantees; Pacific Utility’s own numbers would be confirmed in discovery. Technijian’s specific, delivered results from prior builds appear in Section 11 (Capability Proof) and feed the engine in Section 13.', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — A Pacific Utility Estimator'),
  calloutBox('Before vs. After AI', [
    'TODAY: An estimator learns about a public-works RFP or a developer invitation, hunts for the documents, does the takeoff by hand against volatile material prices, rebuilds scope from memory and old bids, and assembles the prevailing-wage and prequal paperwork — and still has to decline bids there is no bandwidth to reach.',
    'WITH AI: Project and permit intelligence flags the right bid early; an AI first-pass takeoff and a draft bid assemble in minutes from the firm’s own history; the prequal and compliance package drafts itself; and the licensed estimator reviews, prices, and signs. The same estimator carries more bids — and the binding constraint, bandwidth, loosens without a hire the labor market can’t supply.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself'),
  buildTable(
    [ { label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 } ],
    [
      ['DIY tools', 'Inexpensive, but Pacific Utility assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); the U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 13 AI ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Pacific Utility’s Growth Engine', CORE_BLUE, '13'),
  spacer(100),
  p('The engine runs three motions at once: get found and trusted (own the answer-engine, the single-source story, and the tri-state lane), win the work (project and permit intelligence plus bid and estimating acceleration on the booming grid and public work), and run leaner and remember (a twenty-five-year knowledge system and more bids per estimator). Every part respects the boundary that protects a fixed-price, safety-critical contractor — covered in full in the next section.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Pacific Utility AI Engine', 600, 1.61),
  diagramCaption('Figure 13.0 — The Engine: Get Found & Trusted, Win the Work, and Run Leaner & Remember'),
  spacer(160),
  buildTable(
    [ { label: 'Motion', weight: 2.0 }, { label: 'Play', weight: 2.5 }, { label: 'What It Does', weight: 3 }, { label: 'Metric', weight: 1.5 }, { label: 'Service', weight: 1.5 } ],
    [
      ['Get Found & Trusted', 'Answer-engine + tri-state local', 'Own underground / dry / HV contractor answers in CA, NV, AZ', 'Cited authority', 'My SEO'],
      ['Get Found & Trusted', 'The single-source story', 'Own "one contractor, all five trades" — the schedule-de-risking position', 'Organic reach', 'My SEO'],
      ['Get Found & Trusted', 'Project-proof scoreboard', 'Merchandise 25 years and the named agency work', 'Credibility', 'My SEO'],
      ['Get Found & Trusted', 'Rule 20 / undergrounding authority', 'Claim the grid-hardening search lane no contractor owns', 'Local visibility', 'My SEO'],
      ['Win the Work', 'Project & permit intelligence', 'Flag the right developers, agencies, and programs months early', 'Qualified bids', 'My AI Lead Gen'],
      ['Win the Work', 'Bid / RFP response automation', 'Assemble responsive public and private bids fast', 'Time-to-bid', 'My Dev'],
      ['Win the Work', 'AI estimating & takeoff', 'Cut takeoff time; more bids per estimator (human signs)', 'Bids per estimator', 'My Dev'],
      ['Win the Work', 'Pre-bid account dossiers', 'Brief the team on each target before pursuit', 'Win rate', 'My AI'],
      ['Run Leaner & Remember', 'Institutional-knowledge system', '25 years of bids and jurisdictions into matched precedents', 'Estimate speed', 'My AI'],
      ['Run Leaner & Remember', 'Safety & compliance docs', 'Prevailing-wage, traffic-control, prequal package automation', 'Admin hours', 'My AI'],
      ['Run Leaner & Remember', 'Schedule & preconstruction', 'Generative scheduling and substructure-conflict avoidance', 'Schedule risk', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'AI augments the estimators, project managers, and crews — it does not replace them. Their judgment is the product; AI makes the firm faster, sharper, and more visible around it.',
      'It integrates around the estimating, project-management, and document systems the firm already uses — it enhances the workflow, it does not rip it out.',
      'And the rule never bends on fixed-price, safety-critical work: AI assists; the licensed estimator or project manager owns the final price and signs. The next section makes that boundary explicit.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 14 THE BOUNDARY THAT BUILDS TRUST ----------
docChildren.push(
  ...sectionHeader('The Boundary That Builds Trust', DARK_CHARCOAL, '14'),
  spacer(100),
  p('Underground utility work is fixed-price and safety-critical, and that fact sets a hard boundary on where AI belongs — a boundary that, stated plainly, becomes a trust signal rather than a caveat. A bid is a binding price; a high-voltage installation is life-safety work; a public bid carries prevailing-wage and compliance obligations. AI can take off quantities, draft the bid, assemble the prequal package, and surface the precedent in seconds — but it cannot own the number or the safety sign-off. The licensed estimator and the project manager do. That is not a limitation on the strategy; it is the discipline that makes the strategy safe to run, and it is exactly the discipline a careful contractor already lives by.'),
  spacer(140),
  buildTable(
    [ { label: 'Where the Risk Lives', weight: 2.6 }, { label: 'Why It’s Critical', weight: 3.7 }, { label: 'The AI Boundary', weight: 3.7 } ],
    [
      ['The fixed-price bid', 'A binding price; a scope gap or takeoff error transfers real, uninsured risk to the contractor', 'AI does the first-pass takeoff and assembles the bid; the licensed estimator verifies and owns the final number'],
      ['High-voltage / life-safety', '"There is no such thing as discount high voltage" — errors are safety events, not cost overruns', 'AI drafts documentation and checklists; the qualified professional makes every safety and energization call'],
      ['Public-works compliance', 'Prevailing-wage, DIR registration, traffic-control, and bid-responsiveness rules govern public bids', 'AI assembles compliant, complete packages; the firm’s compliance owner reviews and submits'],
      ['Professional liability', 'A 15–20% estimate error can exceed what PL insurance covers if not validated by a qualified estimator', 'AI accelerates; the credentialed human signs — so the work stays inside the firm’s coverage and controls'],
      ['Estimate defensibility', 'A bid has to hold up to an owner, a GC, and the firm’s own risk review', 'A three-model peer-review pass strengthens the first draft before the estimator signs — accuracy as a discipline'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Boundary Is the Differentiator',
    [
      'The rule is simple and absolute: AI assists; the licensed estimator or project manager signs; safety-critical calls stay with the qualified professional. Stated to a developer or an agency, it is a reason to trust the firm, not a disclaimer.',
      'It is also the honest answer to the fear every contractor has about AI: it does not bid the job for you, and it does not put an unreviewed number or an unsafe call into the field.',
      'And it is genuinely hard to do well — which is the point. The firm that deploys AI inside this boundary in 2026 builds a real, durable advantage over rivals who either avoid AI entirely or use it carelessly.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 15 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '15'),
  spacer(100),
  p('This section shows where the value comes from and what the program costs. Pricing shows real published Technijian rates where they exist and "to be determined in discovery" everywhere else; the return is shown as the method we will measure, not an invented multiple. The discovery questions in Section 19 replace estimates with Pacific Utility’s real baselines.'),
  spacer(140),
  subHeader('Projected Lift (Illustrative)'),
  buildTable(
    [ { label: 'Measure', weight: 3 }, { label: 'Current State', weight: 2.6 }, { label: 'With the Program', weight: 2.6 }, { label: 'Direction', weight: 1.8 } ],
    [
      ['Answer-engine visibility', 'Absent', 'Cited across CA / NV / AZ', 'Authority inbound'],
      ['The single-source story', 'Barely stated', 'Owned and searchable', 'Differentiated'],
      ['Project-proof', 'Un-scored', 'Merchandised scoreboard', 'Credibility'],
      ['Project & bid intelligence', 'None', 'Right projects flagged early', 'More qualified bids'],
      ['Estimating throughput', 'Manual takeoffs', 'AI-assisted (human signs)', 'Bids per estimator'],
      ['Institutional knowledge', 'In people’s heads', 'Captured + searchable', 'Faster, sharper bids'],
    ],
  ),
  spacer(160),
  subHeader('How We’ll Measure the Return (Illustrative)'),
  p('We do not lead with a multiple we cannot back. Year-1 return is modeled from the levers below, each tied to a number Pacific Utility already tracks — so the model is built from real baselines in discovery, not assumed here.'),
  buildTable(
    [ { label: 'Value Lever', weight: 3 }, { label: 'The Mechanism', weight: 4 }, { label: 'The Number We Calibrate From', weight: 3 } ],
    [
      ['More bids won', 'Project/permit intelligence and faster, sharper bids win more of the booming grid and public work', 'Bid volume, win rate, and average job size by channel'],
      ['Estimator throughput', 'AI takeoff and bid assembly let each estimator carry more bids in a labor-short market', 'Estimating capacity and bids declined for lack of bandwidth'],
      ['Authority inbound', 'Answer-engine visibility and the single-source story make the firm found and specified', 'Current inbound mix and how buyers find the firm today'],
    ],
  ),
  spacer(60),
  p('Illustrative until discovery — no number we can’t back. Revenue is attributed to the program, not guaranteed; in this market a single additional grid or public-works award can outweigh the entire program cost.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility & Bid-Intelligence Pilot'),
  p('Start with one clearly-scoped entry program — not an open-ended engagement. The 90-Day AI Visibility & Bid-Intelligence Pilot stands up Pacific Utility’s answer-engine presence and the single-source story, and turns on the first project- and permit-intelligence feed — proving the lift before any larger estimating build is discussed. It runs on modest, published rates with no large up-front build.'),
  spacer(120),
  buildTable(
    [ { label: 'Service', weight: 2.9 }, { label: 'Scope', weight: 3.7 }, { label: 'Monthly', weight: 1.6 }, { label: 'Investment', weight: 1.6 } ],
    [
      ['My SEO — Answer-Engine, Tri-State Local & Single-Source', 'AEO + the single-source story + Rule 20 / undergrounding lane + project-proof scoreboard (new)', '$500–$1,500/mo*', 'Published tier'],
      ['My AI Lead Gen — Project, Permit & Account Intelligence (Starter)', 'Early project/permit/program intelligence across CA, NV, AZ; relationship-led, not volume', '$1,499/mo*', '+ $2,500 setup'],
      [{ text: 'My AI — Readiness Workshop + Content Engine kickoff' }, 'Leadership alignment, the boundary, and the content engine', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'THE 90-DAY PILOT — SUBTOTAL', bold: true }, { text: 'The new growth layer: My SEO + Lead Gen Starter + the readiness workshop — starts small, no large build', bold: true }, { text: '', bold: true }, { text: 'Published + TBD', bold: true, color: CORE_BLUE }],
      [{ text: 'My Dev / My AI — AI Estimating + Bid-Assembly + Knowledge (Phase 2)' }, 'AI takeoff/estimating, bid & RFP assembly, prequal/compliance docs, institutional-knowledge system', '—', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'My Dev — Managed App Services (Phase 2)' }, 'Hosting, monitoring, and support for the AI estimating and knowledge platform', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'My AI — Fractional AI Advisor (Phase 2)' }, 'Program leadership across authority, intelligence, and estimating', 'TBD', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'Finalized after discovery', bold: true }, { text: '', bold: true }, { text: 'TBD', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(60),
  p('* Real published Technijian list rates. My SEO published tiers run $500–$1,500/mo (final tier set in discovery). My AI Lead Gen Starter is $1,499/mo plus a one-time $2,500 setup. My AI, My Dev, the AI estimating and knowledge build, managed app services, the advisor, and the workshop have no published rate and are scoped in discovery — the Year-1 total is finalized then.', { italics: true, size: 18 }),
  spacer(160),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, Pacific Utility is cited by a major AI assistant (ChatGPT, Perplexity, or Microsoft Copilot) for a high-intent underground / undergrounding / high-voltage contractor query in at least one of its three states, AND the firm is receiving its first project- and permit-intelligence feed on target submarkets.',
      'Our commitment: the entry program is month-to-month — no long lock-in, no obligation to continue if it doesn’t hit the metric by day 90. If it has not moved the needle on the metric above, you are under no obligation to continue, and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'The cheapest wins come first: making the firm answer-engine-visible and merchandising the track record start earning authority and the right bids on a modest, published-rate entry — with no large build to begin.',
      'In this market the economics are asymmetric: a single additional grid, undergrounding, or public-works award can outweigh the entire year’s program cost many times over.',
      'And the expansion build pays where it hurts most — estimating bandwidth — turning the labor shortage from a ceiling on growth into an advantage over slower-moving rivals.',
    ],
    CORE_BLUE
  ),
);

// ---------- 16 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '16'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence: make the firm found and trusted first, then turn on the project intelligence and bid acceleration, then build the AI estimating and knowledge engine. The lowest-cost, highest-visibility wins land in the first ninety days; the estimating build gets realistic runway and the boundary built in.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Pacific Utility 90-180-270 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 16.0 — Pacific Utility Growth Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Make the firm found and trusted the way buyers and AI engines now look.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Answer-Engine + Tri-State Local SEO', 'Stand up answer-engine and local search for underground / dry / high-voltage contractor across CA, NV, and AZ cities; publish the single-source story, schema-marked.'],
      ['1.2 — Proof Scoreboard + Rule 20 Authority', 'Merchandise twenty-five years and the named agency work into a searchable scoreboard; publish the Rule 20 / undergrounding authority page; restart the news and LinkedIn cadence.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Win the Work (Days 91–180)', { color: TEAL }),
  p('Surface the right bids early and respond faster.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Project & Permit Intelligence', 'Turn on monitoring of developers, master-planned communities, agencies, and utility programs entitling or permitting underground and electrical scope across the three states.'],
      ['2.2 — Bid / RFP Automation + Account Dossiers', 'Stand up bid and RFP response assembly from the firm’s history, and pre-bid account dossiers on the target developers, agencies, and utilities.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Run Leaner & Remember (Days 181–270)', { color: CORE_ORANGE }),
  p('Build the AI estimating and knowledge engine — with the estimator signing.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — AI Estimating & Takeoff', 'Build the AI takeoff and estimating acceleration and the prequal/compliance-document automation, with the licensed estimator verifying and signing every price.'],
      ['3.2 — Knowledge System + ROI Dashboard', 'Stand up the twenty-five-year institutional-knowledge system (matched precedents) and deliver the ROI dashboard against the Section 19 baselines.'],
    ],
  ),
);

// ---------- 17 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '17'),
  spacer(100),
  p('Five actions Pacific Utility can take immediately — before any expanded engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Publish the "Single Source for All Underground Scopes" Page',
    ['Take the real all-five-trades capability and structure one definitive, schema-marked page on how the firm de-risks a developer’s schedule. It claims the story no competitor can, at almost no cost.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Stand Up a Simple Project-Proof Scoreboard',
    ['Add a credible, current scoreboard — twenty-five years, employee-owned, the tri-state licenses, the named Corona / Azusa / Moreno Valley work — so a developer or agency engineer sees the proof at a glance.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Publish One "Rule 20 / Utility Undergrounding Contractor" Answer Page',
    ['Claim the grid-hardening search lane no contractor owns, exactly as that channel booms. One schema-marked page signals the whole answer-engine strategy.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Date and Restart the News / LinkedIn Cadence',
    ['The last visible activity is years old. A few current posts — a project energized, a new agency award, the ESOP story — are a fast, free credibility and recency signal buyers actually check.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Set a Project & Permit Alert on the Target Submarkets',
    ['Turn on a permit/entitlement alert for the SoCal, Las Vegas, and Phoenix submarkets the firm wants to grow in — a free taste of the project-intelligence program, surfacing the right bids early.'],
    CORE_BLUE),
);

// ---------- 18 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '18'),
  spacer(100),
  p('The honest answers to the questions Pacific Utility leadership is most likely asking right now.'),
  spacer(120),
  buildTable(
    [ { label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 } ],
    [
      [{ text: 'We have marketing handled internally. Why add Technijian?', bold: true }, 'Keep what works — Melessa’s team owns the brand and the relationships. We add the layer an in-house marketing function rarely builds: answer-engine optimization (so AI assistants cite the firm), the single-source story made searchable, project and permit intelligence, and the AI estimating and bid-assembly tooling. We run alongside your team, not over it.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this plan starts with simple, proven automations that pay back fast — answer-engine content and project intelligence — not autonomous "agents" bidding your jobs. We use the simplest tool that works, measure it, and only expand what earns its place. The estimating build comes later, inside the boundary where the licensed estimator still signs the number.'],
      [{ text: 'Is our data — bid history, pricing, prequal records — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything binding, led by a CISSP-certified team. Data governance is part of the readiness work in the entry program, and it is built for the prevailing-wage and DIR-governed nature of public work.'],
      [{ text: 'We’re a lean team in a labor shortage. Do we have bandwidth for this?', bold: true }, 'The point is the opposite — to give your estimators and PMs back hours, not add work. Technijian runs the build and the cadence; your involvement is a short strategy session plus reviewing what we draft. The whole thesis is to bid more without a hire the labor market can’t supply.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry program is a 90-day pilot with a defined success metric (Section 15), month-to-month with no long lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it. You carry the upside, not the risk.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry program runs on real published rates — My SEO at $500–$1,500/mo and My AI Lead Gen Starter at $1,499/mo plus a one-time $2,500 setup — with no large up-front build. The AI estimating and knowledge build is the later expansion, scoped in discovery and only after the pilot proves the lift; the full Year-1 number is finalized then, with no figure we can’t back.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 19 CONCLUSION & NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('Conclusion & Next Steps', DARK_CHARCOAL, '19'),
  spacer(100),
  p('Pacific Utility has the hard things: more than twenty-five years, an employee-owned culture that retains craftspeople, a tri-state license footprint, named agency work, and the rare ability to self-perform all five underground trades on one schedule. What it has not yet done is make that capability visible where buyers now look, surface the right bids early, and use AI — safely — to bid more with the team it has. And it is doing this at the exact moment the market is rebalancing toward the grid and public-infrastructure work the firm does best.'),
  p('The opportunity is concrete and low-risk: own the answer-engine, the single-source story, and the tri-state lane no competitor has claimed; surface the booming grid and public work early; and build AI estimating and knowledge inside the boundary that protects a fixed-price, safety-critical contractor. The boundary that governs the work — AI assists, the licensed estimator or project manager signs — is not a limitation on the strategy. It is the strategy’s moat.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call — bid volume, win rate, average job size by channel, and estimating capacity — to replace the illustrative figures with real baselines and confirm program scope.',
      'Step 2: Technijian returns a calibrated model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the answer-engine foundation, the single-source story, and the proof scoreboard — inside 30 days.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'You’ve built the contractor. Let’s build the growth engine.', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ] })] })],
  }),
);

// ---------- 20 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '20'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help firms compete at scale, with security and compliance built in, not bolted on — and we map real, delivered capabilities to each client’s actual work, honestly labeled.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Pacific Utility', weight: 5 }],
    [
      ['My SEO', 'Answer-engine optimization, the single-source story, the undergrounding authority lane, and the tri-state project-proof scoreboard'],
      ['My AI Lead Gen', 'Project, permit, and account intelligence — surfacing the right developers, agencies, and utility programs early'],
      ['My Dev & My AI', 'AI estimating and takeoff, bid and RFP assembly, prequal/compliance automation, and the institutional-knowledge system'],
      ['My IT + Security', 'The managed IT, endpoint defense, and Microsoft 365 hardening that secure the AI estimating and knowledge platform'],
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
  ...sectionHeader('Appendix — Works Cited & Data Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted June 2026. Company details (founding year, ownership, leadership, services, offices, licenses, and affiliations) are drawn from public sources and the firm’s own materials and should be confirmed with Pacific Utility before external use. Size figures circulating from data brokers conflict and are deliberately not relied on in this draft.', { italics: true }),
  spacer(120),
  p('1. Pacific Utility Installation — pacificutility.com (About, Utility Engineering, Wet Utility, Dry Utility, High Voltage, Streetlights & Traffic Signals, Projects, News); 2020 press releases (distribution-services leadership hire, NV/AZ expansion, wet-utility launch); LinkedIn (pacific-utility-installation). Daniel Mole (Chairman & CEO, co-founder) and Bill Pfeifer (co-founder) per the firm’s materials.', { size: 20 }),
  p('2. Licenses & affiliations — CA CSLB 733207 (A, B, C-10); NV 0090319 (C-2), 0085785 (A); AZ ROC 343337 (A), 343338 (CR-11); AGC, BIASC, SNHBA memberships per the firm’s materials. Note: not to be confused with "Pacific Utility Construction" (Woodland/Anaheim), a separate company.', { size: 20 }),
  p('3. Utility capital & grid boom — EEI, Morningstar, and EIA (utility capex 2025–2030, transmission build, underground-line and transformer spending); IIJA grid modernization, DOE GRIP/grid-hardening, NEVI EV charging, and BEAD broadband program summaries (B&D Law, NETL, CRS).', { size: 20 }),
  p('4. Undergrounding & streets — CPUC Rule 20 program materials and counsel summaries (legacy 20A vs. utility wildfire-mitigation undergrounding); California SB 1 and Caltrans transportation funding for streets and signals.', { size: 20 }),
  p('5. Residential market — 2026 homebuilding outlooks for Southern California, Las Vegas, and Phoenix (starts, deliveries, and net-sales data from regional builder and market reports).', { size: 20 }),
  p('6. Labor shortage — Associated Builders and Contractors (net new-worker estimates); ECMag / BLS and AGC (electrician supply, retirements, and workforce projections).', { size: 20 }),
  p('7. AI in construction & bidding — AGC 2026 Construction Outlook (AI adoption and estimating); Autodesk BuildingConnected, ConstructConnect, and project-intelligence platforms (Mercator.ai, Dodge); estimating-accuracy and preconstruction data (Procore); professional-liability considerations on AI-generated estimates.', { size: 20 }),
  p('8. Technijian capabilities & pricing — My SEO published tiers ($500–$1,500/mo plus add-ons), My AI Lead Gen ($1,499 Starter + $2,500 setup); My AI and My Dev scoped per engagement; documented Proven Results (AI Document Intelligence inside a FINRA broker-dealer; Multi-Agent SEO + Answer-Engine Platform; Weaviate/Obsidian knowledge system; LLM Council three-model peer review).', { size: 20 }),
  p('9. AI literacy & responsible-AI frameworks (Section 12) — MIT Sloan Management Review (AI literacy: "what AI can do," not how to build it); Anthropic, "Building Effective Agents" (the automation/workflow vs. agent distinction); a widely-used five-stage AI maturity model (consistent with the Gartner AI Maturity Model and Google Cloud AI Adoption Framework); U.S. NIST AI Risk Management Framework (Govern / Map / Measure / Manage).', { size: 20 }),
);

// =====================================================================
const doc = new Document({
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } } }] }] },
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 0, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: docChildren }],
});

const OUT_PATH = path.join(__dirname, 'Pacific-Utility-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
