// Christian Brother's Flooring & Interiors (cbinteriors.net) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/HHOC/build-hhoc-report.js. Built-vs-service capability labels
// per feedback_capability_proof_built_vs_service. Framed as a warm expansion of an existing
// Technijian IT-support relationship.

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

const TODAY = '2026-05-27';
const CLIENT = 'Christian Brothers';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) { return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
  // Native Word page-break-before avoids the blank-page artifacts that standalone pageBreak() paragraphs cause.
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, pageBreakBefore: true,
    spacing: { before: 0, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}

function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })] });
}

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: NUM_BULLETS, level: 0 }, spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })] });
}

function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}

function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 44, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}

function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}

function personaCard(name, color, fields) {
  const headerRow = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 120, bottom: 120, left: 200, right: 200 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] })] })] });
  const fieldRows = fields.map(([label, value], i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], rows: [headerRow, ...fieldRows] });
}

// kind = 'built' (delivered case study) | 'service' (productized service we offer)
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Christian Brothers: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ] }),
    ]})],
  });
}

function diagramImage(buf, altTitle, widthPx = 600, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) }, altText: { title: altTitle, description: altTitle, name: altTitle } })] });
}
function diagramCaption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}

// ---------- Header / Footer ----------
function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
    ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'CHRISTIAN BROTHERS', size: 54, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Flooring & Interiors  —  San Diego County', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Lakeside, California  |  cbinteriors.net', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for Christian Brothers Flooring & Interiors', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }));

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1988', label: 'Family-Owned Since', color: CORE_BLUE },
    { number: '37', label: 'Years in San Diego County', color: CORE_ORANGE },
    { number: '2', label: 'Growth Channels', color: TEAL },
    { number: 'A+', label: 'BBB Rated', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Technijian already runs Christian Brothers’ IT and security. This blueprint is about a different kind of partnership: turning that same trusted stack into a growth engine. Christian Brothers has spent thirty-seven years building a flooring and finishes business in San Diego County, earning a BBB A+ and the 2023 BIA San Diego ICON Award for finish work — and it has built something most flooring shops have not: a new-home design-center program that runs the buyer-personalization process for homebuilders.'),
  p('That gives Christian Brothers two ways to grow, and they call for two playbooks. The homeowner channel — remodels and flooring, the steady revenue base — is won the way every local home-services business is won today: showing up in Google with strong reviews, a deep visual portfolio, and a way for a buyer to picture the floor in their own room. The homebuilder channel — the higher-margin differentiator — is won account by account, by knowing which builders are starting which communities and being the design-center partner they choose. AI moves both.'),
  p('This is a focused program with three motions: get found (fix the local-search foundation, build review velocity, merchandise the portfolio, and add a room visualizer), win builders (account intelligence on San Diego construction plus a proof library that wins the design-center relationship), and convert and serve (capture and nurture leads, speed the designer selections, and automate quoting). Because Technijian already supports the systems and security underneath, this deploys faster and with less risk than it would for any outside firm.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'A self-inflicted, free fix: the design-center site currently brands Christian Brothers as "Orange County’s #1" while the company operates entirely in San Diego County — a local-search own-goal that caps Google visibility and is correctable day one.',
      'Win on what homeowners actually choose by: reviews, a visual portfolio, and a room visualizer. Christian Brothers sits at roughly 37 reviews where the strongest San Diego rivals have 200 to 369, and rivals already offer "see-your-floor-in-your-room" visualization. These are catch-up moves with outsized payoff.',
      'Grow the high-margin builder channel deliberately: AI account intelligence on new San Diego communities and starts turns a lumpy, reactive pipeline into a proactive target list — and the existing IT relationship means the whole program is lower-risk and faster to stand up.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Christian Brothers’ internal numbers (lead volume, average project value, close rate, review velocity, and the builder pipeline) were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call — the specific questions are in Section 15.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE TWO-CHANNEL MODEL ----------
docChildren.push(
  ...sectionHeader('The Two-Channel Model', CORE_BLUE, '02'),
  spacer(100),
  p('A growth plan has to start with how Christian Brothers actually wins work, because there are two distinct channels and each is won differently. The homeowner channel is a local home-services business: a remodeling homeowner or new-home buyer finds Christian Brothers through search, reviews, and the Lakeside showroom, then selects flooring and finishes. The homebuilder channel is account-based: a builder outsources its design center, and Christian Brothers runs the buyer-personalization process inside the builder’s construction schedule — using the Studio Chateau selection tool the company already deploys.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'Two Ways Christian Brothers Wins Work', 600, 1.73),
  diagramCaption('Figure 2.0 — Two channels: a B2C homeowner channel and a B2B homebuilder design-center channel, both converging on the showroom and install crew'),
  spacer(120),
  subHeader('Two Channels, Two Playbooks'),
  bullet('Homeowner channel (the steady base): remodel-heavy, luxury-vinyl-led, won through local search, online reviews, a visual portfolio, and the showroom and shop-at-home experience.'),
  bullet('Homebuilder channel (the high-margin differentiator): "turn builders into New Home Retailers" by running their design center — online selections, the four-plus designer meetings, and the move-in walkthrough. Win one builder and you earn recurring buyer flow across a whole community.'),
  spacer(120),
  calloutBox(
    'Why the Model Rewards AI',
    [
      'The homeowner channel is decided online before anyone calls: 91% of homeowners check reviews, and Google plus a visual portfolio shape the shortlist. Whoever shows up — with proof and a way to picture the result — wins the lead.',
      'The builder channel is high-margin but lumpy: new construction is a small share of San Diego home sales, so the relationships are worth pursuing deliberately, not waiting for. Account intelligence makes the pursuit proactive.',
      'And the same selections, quotes, and design meetings that the work runs on are exactly the repetitive, high-volume tasks AI accelerates — freeing designers to sell and serve.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE GROWTH EQUATION ----------
docChildren.push(
  ...sectionHeader('The Growth Equation', TEAL, '03'),
  spacer(100),
  p('Christian Brothers grows three ways, and each is gated by something fixable. This is the spine the rest of the plan hangs on.'),
  spacer(140),
  buildTable(
    [ { label: 'Growth Lever', weight: 2.4 }, { label: 'What Gates It Today', weight: 4 }, { label: 'The AI Play', weight: 3.6 } ],
    [
      ['Get found by homeowners', 'A San Diego company tagged "Orange County" in search; thin reviews; no room visualizer; split brands', 'Geo-corrected local SEO, a review engine, a unified visual portfolio, and a "see-your-floor" visualizer'],
      ['Win more builder partnerships', 'A reactive, lumpy pipeline; the award and builder work are under-used online', 'Account intelligence on new communities and starts, plus a searchable design-center proof library'],
      ['Convert and serve faster', 'Manual lead follow-up, manual selections and quoting; designers do admin instead of selling', 'Lead capture and nurture, AI mood-boards, and selection/quote automation around Studio Chateau'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why Christian Brothers Is Positioned to Win This',
    [
      'The cheapest gains are the most certain: correcting the geography, building reviews, and merchandising a portfolio Christian Brothers already photographs are low-cost moves with fast, measurable payoff.',
      'The builder channel is a real moat: a 37-year reputation, in-house install, a showroom, and a BIA ICON award are hard for a software-only competitor to match — they just need to be made findable and provable.',
      'The IT partnership de-risks all of it: Technijian already knows and secures the systems, so the program plugs in rather than starting from scratch.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE MARKET & WHERE IT'S GOING ----------
docChildren.push(
  ...sectionHeader('The Market & Where It’s Going', CORE_BLUE, '04'),
  spacer(100),
  p('Two market realities shape the plan: the homeowner remodel channel is the larger, steadier base, while the builder channel is higher-margin but smaller and lumpier — and homeowners now decide largely online before they ever visit a showroom.'),
  spacer(140),
  subHeader('Market Forces (2024–2026)'),
  buildTable(
    [ { label: 'Force', weight: 2.6 }, { label: 'What’s Happening', weight: 4 }, { label: 'Implication for Christian Brothers', weight: 3.4 } ],
    [
      ['Remodel is the base', 'Renovation spending is growing slowly but steadily; luxury vinyl dominates and repair-and-remodel is the majority of flooring spend', 'The homeowner channel is the dependable engine — win it with local search, reviews, and visualization'],
      ['New construction is lumpy', 'San Diego permitted ~8,800 homes in 2024, but new construction is only ~2-3% of home sales', 'The builder channel is high-value per deal but must be pursued deliberately, account by account'],
      ['Design centers are profit centers', 'Builders earn more on personalized, built-to-order homes; online selection tools are now standard', 'Christian Brothers’ design-center program is the differentiator — make it findable and provable'],
      ['Homeowners decide online', '91% rely on reviews; Google plus visual platforms (Houzz, Instagram, Pinterest) shape the shortlist', 'Review volume and a visual portfolio are not optional — they are how the lead is won'],
      ['Visualization is expected', 'Room-visualizer tools convert materially more shoppers; a San Diego rival already offers one', 'A "see-your-floor-in-your-room" tool closes the most visible product gap'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Market’s Verdict',
    [
      'The homeowner channel rewards the firm that is most findable and most trusted online — and that is a position Christian Brothers can take in San Diego with focused, low-cost work.',
      'The builder channel rewards the firm that shows up first with proof when a community breaks ground — which is an account-intelligence problem AI is built to solve.',
      'Both point the same way: make a strong, proven, 37-year operation look and work as modern online as it already is in person.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('The next dollar comes from a few clear pools. The homeowner pools are won with visibility and trust; the builder and developer pools are won account by account. The program serves all of them.'),
  spacer(120),
  buildTable(
    [ { label: 'Growth Pool', weight: 2.4 }, { label: 'Who / What', weight: 3.2 }, { label: 'How Christian Brothers Captures It', weight: 4 } ],
    [
      ['Remodel homeowners (base)', 'San Diego homeowners replacing flooring or refreshing finishes', 'Local SEO + reviews + visual portfolio + a room visualizer + the showroom'],
      ['New-home buyers (via builders)', 'Buyers personalizing a new home through the design center', 'A smoother selection experience (Studio Chateau + AI mood-boards) that lifts attach and upgrade revenue'],
      ['Homebuilder partnerships', 'Production and semi-custom builders starting San Diego communities', 'Account intelligence on starts and permits + a proof library that wins the design-center relationship'],
      ['Referral multipliers', 'Realtors, designers, and general contractors who send work', 'Stay top-of-mind and easy to refer with a strong, current online presence and proof'],
      ['Multifamily / commercial (adjacent)', 'Apartment and commercial flooring projects they already do some of', 'Targeted outreach and a portfolio that shows the commercial capability'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Playbooks, One Program',
    [
      'The homeowner pools are demand that already exists — people are searching for flooring in San Diego today; the job is to be found, trusted, and easy to picture.',
      'The builder and developer pools are won by relationship and timing — AI surfaces the right accounts and arms the team with proof, but the showroom, the install crew, and the 37-year reputation close them.',
      'The two reinforce each other: a stronger public presence and portfolio also make Christian Brothers a more credible design-center partner to builders.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE CBI CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The Christian Brothers Customer', CORE_ORANGE, '06'),
  spacer(100),
  p('Christian Brothers serves two kinds of buyer — homeowners and homebuilders — plus the referral partners who feed both. The cards below profile the relationships that matter, and the matrix places each by project value and how strategic and recurring it is.'),
  spacer(160),

  personaCard('1 — The Production / Semi-Custom Homebuilder', CORE_BLUE, [
    ['Role', 'A builder that wants to sell more homes and offload the design-center and personalization process — the highest-value, most recurring relationship.'],
    ['Pain Points', 'Personalization is operationally heavy; a slow or clunky design center frustrates buyers and leaves option revenue on the table.'],
    ['Decision Driver', 'A partner who runs the design center smoothly, lifts option attach rates, and makes the builder look good to buyers.'],
    ['AI Opportunity', 'Account intelligence flags which builders are starting communities; a proof library and faster selections win and keep the relationship.'],
    ['Technijian Hook', 'My AI Lead Gen — builder account intelligence. My SEO — the design-center proof library.'],
  ]),
  spacer(160),
  personaCard('2 — The Remodeling Homeowner', TEAL, [
    ['Role', 'A San Diego homeowner replacing flooring or refreshing finishes — the steady volume base.'],
    ['Pain Points', 'Hard to judge quality and trust; wants to picture the result and not get burned on the install.'],
    ['Decision Driver', 'Reviews, a visible portfolio, an easy way to picture the floor, and a dependable install.'],
    ['AI Opportunity', 'Local SEO + reviews get found; a room visualizer de-risks the choice; lead capture and nurture convert the inquiry.'],
    ['Technijian Hook', 'My SEO — local search, reviews, portfolio. My Dev — the room visualizer and lead capture.'],
  ]),
  spacer(160),
  personaCard('3 — The New-Home Buyer', CORE_ORANGE, [
    ['Role', 'A buyer personalizing a new home through the builder’s design center that Christian Brothers runs.'],
    ['Pain Points', 'Overwhelmed by options and deadlines; wants confidence the selections will look right together.'],
    ['Decision Driver', 'A guided, confidence-building selection experience that makes personalization feel easy.'],
    ['AI Opportunity', 'AI mood-boards and concept palettes accelerate the designer meetings and lift attach and upgrade revenue.'],
    ['Technijian Hook', 'My AI — mood-boards and concepts. My Dev — selection automation around Studio Chateau.'],
  ]),
  spacer(160),
  personaCard('4 — The Referral Source', GOLD, [
    ['Role', 'Realtors, interior designers, and general contractors who send homeowner and project work.'],
    ['Pain Points', 'Will only refer a firm that makes them look good and is easy to find and vouch for.'],
    ['Decision Driver', 'A current, credible online presence and proof they can point a client to.'],
    ['AI Opportunity', 'A strong portfolio, reviews, and proof library make Christian Brothers the easy, safe referral.'],
    ['Technijian Hook', 'My SEO — portfolio, reviews, and proof that earn and hold referrals.'],
  ]),
  spacer(160),
  subHeader('Emerging & High-Value Segments'),
  personaCard('5 — The Multifamily / Commercial Developer', PASS, [
    ['Role', 'Apartment and commercial projects — high-value flooring work Christian Brothers already does some of.'],
    ['Pain Points', 'Needs reliable, at-scale install and a partner who can show comparable commercial work.'],
    ['Decision Driver', 'Proven commercial capability, dependable timelines, and competitive pricing.'],
    ['AI Opportunity', 'Targeted outreach plus a portfolio that surfaces the commercial work win more of these projects.'],
    ['Technijian Hook', 'My AI Lead Gen — project and developer targeting. My SEO — commercial portfolio.'],
  ]),
  spacer(160),
  personaCard('6 — The Whole-Home Move-Up Homeowner', DARK_CHARCOAL, [
    ['Role', 'A higher-end homeowner doing a whole-home flooring and finishes project — a high-value niche.'],
    ['Pain Points', 'Wants design guidance and a coordinated result across the whole home, not just a product sale.'],
    ['Decision Driver', 'Design expertise, a strong portfolio of comparable homes, and a guided experience.'],
    ['AI Opportunity', 'Mood-boards and visualization elevate the design consult; portfolio content attracts the look-alike buyer.'],
    ['Technijian Hook', 'My AI — visualization and mood-boards. My SEO — high-end project content.'],
  ]),
  spacer(200),
  p('Figure 6.0 maps each by project value and strategic/recurring value — the anchor builder relationships, the strategic referral multipliers, the high-value projects, and the transactional volume base.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Christian Brothers Customer Matrix', 580, 1.50),
  diagramCaption('Figure 6.0 — Customer Matrix: Project / Account Value vs. Strategic / Recurring Value'),
);

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('Christian Brothers competes on two fronts. Among San Diego flooring retailers, the leaders win online with review volume, deep visual portfolios, and room visualizers. In the builder design-center channel, the category leader is Chateau Interiors — which, notably, owns the very Studio Chateau software Christian Brothers licenses. Christian Brothers cannot out-scale these players, but it can out-modernize the local field and counter the builder incumbent with something software alone cannot offer: local San Diego presence, in-house install, and a showroom.'),
  spacer(140),
  buildTable(
    [ { label: 'Competitor', weight: 2.2 }, { label: 'Segment', weight: 3 }, { label: 'Posture vs. Christian Brothers', weight: 4 } ],
    [
      ['Metro Flooring', 'San Diego flooring retailer-installer', 'The B2C digital benchmark — ~199 reviews, strong Houzz, large online catalog; the bar for findability and trust'],
      ['West Coast Flooring Center', 'North County multi-showroom retailer', 'Very strong online — ~369 reviews and a Union-Tribune "Best" award; the North County threat'],
      ['Geneva Flooring', 'San Diego hardwood + flooring', 'Strong visual presence — deep Houzz portfolio and steady reviews; a visual-merchandising benchmark'],
      ['Floor Store & Design Center', 'San Diego "design center" retailer', 'Already runs a room visualizer and uses "design center" language — direct positioning overlap'],
      ['Empire Today', 'National shop-at-home', 'National scale and ad spend, but mixed trust — beatable on craftsmanship and local reputation'],
      ['Chateau Interiors & Design', 'Builder design-center (B2B) leader', 'The SoCal category leader — and the owner of the Studio Chateau tool CBI licenses; counter with local presence + in-house install + showroom, not scale'],
    ],
  ),
  spacer(200),
  subHeader('Scale & Digital-Maturity Scorecard'),
  p('Reduced to the two things that decide who gets the lead — reach and digital/AI maturity (reviews, portfolio, visualization) — the picture is clear, and it shows the move available to a smaller, well-run local firm.'),
  buildTable(
    [ { label: 'Player', weight: 2.6 }, { label: 'Reach', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Reviews', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Visualizer', weight: 1.6, align: AlignmentType.CENTER }, { label: 'Verdict', weight: 2.6 } ],
    [
      ['West Coast Flooring', { text: 'Multi-site', align: AlignmentType.CENTER }, { text: '~369', color: PASS, align: AlignmentType.CENTER }, { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, 'Scale + digital leader'],
      ['Metro Flooring', { text: 'Regional', align: AlignmentType.CENTER }, { text: '~199', color: PASS, align: AlignmentType.CENTER }, { text: 'Catalog', align: AlignmentType.CENTER }, 'B2C digital benchmark'],
      ['Floor Store', { text: 'Multi-site', align: AlignmentType.CENTER }, { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Roomvo', color: PASS, align: AlignmentType.CENTER }, 'Has the visualizer CBI lacks'],
      ['Chateau Interiors', { text: 'SoCal (B2B)', align: AlignmentType.CENTER }, { text: 'n/a', align: AlignmentType.CENTER }, { text: 'Owns tool', align: AlignmentType.CENTER }, 'Builder-channel leader'],
      [{ text: 'Christian Brothers (today)', bold: true }, { text: 'Local', align: AlignmentType.CENTER }, { text: '~37', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'None', color: CRITICAL, align: AlignmentType.CENTER }, { text: 'Room to out-modernize locally', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field. Christian Brothers sits in the local/emerging corner — small and early on the digital signals homeowners use. The realistic move is straight up: out-modernize on reviews, visual portfolio, and a visualizer, and let local trust win the lead.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. Digital & AI Maturity', 580, 1.50),
  diagramCaption('Figure 7.0 — Competitive Positioning: Scale / Reach vs. Digital & AI Maturity'),
  spacer(160),
  calloutBox(
    'Where Christian Brothers Wins',
    [
      'On the homeowner side, the leaders win on review volume, portfolio depth, and a room visualizer — all of which Christian Brothers can build quickly, and one of which (the geo-corrected local presence) is a free fix.',
      'On the builder side, the category leader owns the software but not the local relationship: Christian Brothers’ San Diego presence, in-house install, showroom, and BIA ICON award are advantages software cannot replicate — they just need to be made findable.',
      'The same content and proof that win homeowners also make Christian Brothers a more credible design-center partner to builders, so the two fronts compound.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For a 37-year, award-winning firm, the online presence under-represents the operation — and a few fixes are unusually high-return because the audiences (homeowners and builders) decide largely online.'),
  spacer(140),
  buildTable(
    [ { label: 'Digital Asset', weight: 2.6 }, { label: 'Current State', weight: 3.2 }, { label: 'Gap / Opportunity', weight: 4.2 } ],
    [
      ['Geography in search', 'The design-center site brands the company "Orange County’s #1" while it operates in San Diego County', 'A geo-SEO own-goal that caps local ranking and credibility — correct it to San Diego day one'],
      ['Two brands / two sites', 'cbinteriors.net (design center) and cbfloorsinc.com (flooring) run as separate brands and Instagram handles', 'Split domain authority and a diluted presence — consolidate or cross-link to compound, not divide'],
      ['Online reviews', '~37 Yelp reviews despite 37 years; strong rating but thin volume', 'Top rivals carry 200-369 — a review engine closes the single biggest trust gap'],
      ['Room visualizer', 'None', 'A San Diego rival already offers "see-your-floor-in-your-room" — the most visible product gap'],
      ['Visual portfolio / social', 'Thin, split Instagram; no Pinterest; no Houzz reviews', 'A visual category under-merchandised where homeowners actually look — a fast content win'],
      ['Proof of the builder work', 'The BIA ICON Award and builder projects are barely surfaced', 'Under-used proof that should anchor the design-center pitch to builders'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the business — only making a strong, proven operation look and work online as modern as it is in the showroom.',
      'The geography fix, a review engine, and a unified portfolio are low-cost, compounding moves with fast returns — and Christian Brothers already photographs the work.',
      'They are also the natural first ninety days: fix the foundation, then build the visualizer and the builder-intelligence engine on top.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a San Diego homeowner asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Best flooring store in San Diego for luxury vinyl plank?"', [
    'TODAY — the AI assistant answers with whichever firms have the strongest reviews, portfolios, and third-party signals it can read: it names the high-review rivals (the 200-to-369-review players) and the multi-showroom retailers, and does NOT mention Christian Brothers — even though Christian Brothers has 37 years, in-house install, a showroom, and a BIA ICON award. Christian Brothers is invisible at the exact moment the buyer is forming a shortlist.',
    'AFTER the program — the same query can return Christian Brothers as a cited option ("Christian Brothers Flooring & Interiors, a 37-year San Diego County flooring and design firm with in-house install and an award-winning design center…"), with the city-by-product pages, the review velocity, and the visual portfolio as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result is part of the Phase 1 baseline audit. The "Orange County" geo-defect actively works against Christian Brothers here.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('Local AI-search and review signals compound, and they reward whoever optimizes first. Every quarter Christian Brothers is not found, the assistants and the map pack learn to answer "best flooring store in San Diego" with someone else — and the review-volume gap (37 vs. the rivals’ 200-to-369) widens, because a competitor adding reviews every week pulls further ahead the longer the gap stays open. Meanwhile the "Orange County" tagline keeps telling Google the company is in the wrong county. The cost of waiting is not zero — it is a competitor becoming the default answer, and a wider gap to close later than it is to close now.'),
);

// ---------- 09 TECHNIJIAN CAPABILITIES ----------
docChildren.push(
  ...sectionHeader('Technijian Capabilities — Proven Builds & Services', CORE_BLUE, '09'),
  spacer(100),
  p('Technijian already runs Christian Brothers’ IT and security, so we know the systems, the data, and the people — which makes everything here faster and lower-risk to deploy. This section separates two things plainly: proven builds Technijian has actually delivered, and the productized services Christian Brothers would engage. Each is labeled for what it is, and each maps to a specific use case.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'Multi-Agent SEO + Answer-Engine Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP servers, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited source inside AI assistants — cutting content-production time roughly 70%.',
    'This is the engine that gets Christian Brothers found: correct the geography, build city-by-product pages ("luxury vinyl Carlsbad," "new-home design center San Diego"), and merchandise the portfolio so homeowners and referral partners find the firm in Google and AI answers.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI Document Intelligence (Days to Minutes)',
    'Technijian deployed AI document intelligence that auto-populates complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review.',
    'Pointed at the design workflow, the same approach speeds selection sheets, estimates, and quotes — and assembles builder proposals from past projects, so designers spend time selling and serving rather than on paperwork.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Christian Brothers Would Engage'),
  capabilityBox(
    'My SEO — Local Search, Reviews & Visual Portfolio',
    'My SEO is Technijian’s local and answer-engine search service — Google Business Profile optimization, city and product landing pages, review generation, and content/portfolio merchandising.',
    'For Christian Brothers it fixes the "Orange County" geo-defect, builds review velocity toward the rivals’ levels, and merchandises the project portfolio across the web, Houzz, Instagram, and Pinterest.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Homebuilder Account Intelligence',
    'My AI Lead Gen is Technijian’s productized outbound service — it harvests high-fit targets from public data, enriches and scores them, and delivers outreach-ready, prioritized account lists.',
    'For the builder channel it monitors new San Diego communities, starts, and permits, ranks the builders worth pursuing (and flags low-fit ones), and arms the team with a per-builder profile to win the design-center relationship.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) to ship the tools and integrations a business actually runs on.',
    'For Christian Brothers it builds the room visualizer, AI mood-boards, lead capture and CRM nurture, online booking, and the selection-and-quote automation that wraps around the Studio Chateau tool the company already uses.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task'),
  p('A fair question about running AI across search, the visualizer, lead gen, and the design workflow: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass, the toughest reasoning, anything customer-facing where accuracy is non-negotiable', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — content, outreach personalization, mood-board concepts, summarization, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, extraction, enriching and tagging thousands of builder and project records', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Christian Brothers pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. For example, a single city-by-product page is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 10 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for CBI Leadership', CORE_BLUE, '10'),
  spacer(100),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Christian Brothers sits today, how to adopt it without risk, and what comparable businesses are already doing. The goal is that the Castelli family and the Christian Brothers team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft this selection sheet from the buyer’s wish-list." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch San Diego permits and flag which builders are worth pursuing." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Christian Brothers starts with simple automations that pay off in the first 90 days — the geo-fix, the review engine, the visualizer — and adds autonomous agents only where the value is proven, which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Christian Brothers Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run companies — including Christian Brothers — sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'CBI Today', weight: 1.4, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'Licensed tools are in use (Studio Chateau selections, Birdeye reviews, Setmore booking) but AI is not yet woven into growth or operations', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — local search, reviews, the visualizer, builder intelligence — with measured results', ''],
      ['4. Scaled', 'AI is embedded across both channels with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the business runs and competes', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Christian Brothers already uses capable licensed tools, which puts it at the Emerging stage. This report is the plan to reach Operational — AI working in the growth engine and inside the design workflow — within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a customer-facing business like Christian Brothers, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything client-facing — a designer or owner approves AI-drafted content, quotes, and selections before they go out'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — customer, project, and builder data never touch a public model; this is the same security foundation Technijian already runs for CBI'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source, led by a CISSP-certified team — the same discipline already applied to your IT'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Businesses Are Already Doing', { color: CORE_BLUE }),
  bullet('Local home-services firms: flooring and remodel retailers are adding room visualizers and review-generation engines to win the homeowner who decides online before ever calling — capturing leads competitors never see.'),
  bullet('Multi-location retailers: showroom businesses are using local search and answer-engine optimization to become the cited answer when a buyer asks AI tools "best flooring store near me?" — turning organic search into booked consults.'),
  bullet('Account-based B2B: relationship-driven firms are monitoring public signals (permits, starts, leadership changes) to reach the right accounts first, instead of waiting for a reactive, lumpy pipeline.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Christian Brothers’ own numbers would be confirmed in discovery. Technijian’s specific, measured results from prior builds appear in Section 9 (Technijian Capabilities) and Section 11 (How AI Grows Christian Brothers).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — A Christian Brothers Designer', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A designer fields a homeowner inquiry, manually checks availability and books the consult, builds a mood-board by hand, walks the buyer through the Studio Chateau selections, then re-keys those choices into an estimate and chases the quote — much of it from experience held in a few people’s heads, with admin crowding out selling.',
    'WITH AI: The lead is captured and the consult booked automatically; an AI assistant drafts a starting mood-board and palette in minutes; the room visualizer lets the buyer picture the floor before the meeting; and selection-to-quote automation turns the wish-list into a priced estimate the designer reviews and approves. The expertise is captured in a system, so the same standard holds across both channels and survives a new hire.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but Christian Brothers assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — and Technijian already runs your IT, so the program plugs into a stack we know and protect', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 11 AI ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Grows Christian Brothers', CORE_BLUE, '11'),
  spacer(100),
  p('The engine runs three motions at once: get found (capture homeowner demand with local search, reviews, portfolio, and a visualizer), win builders (account intelligence and proof that grow the high-margin design-center channel), and convert and serve (capture and nurture leads, speed the selections, and automate quoting). Every part of it builds on the IT and security foundation Technijian already runs for Christian Brothers.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Christian Brothers AI Engine', 600, 1.61),
  diagramCaption('Figure 10.0 — The Engine: Get Found, Win Builders, and Convert & Serve'),
  spacer(160),
  buildTable(
    [ { label: 'Motion', weight: 1.7 }, { label: 'Play', weight: 2.5 }, { label: 'What It Does', weight: 3 }, { label: 'Metric', weight: 1.6 }, { label: 'Service', weight: 1.5 } ],
    [
      ['Get Found', 'Geo-SEO fix + local/AEO', 'Re-anchor to San Diego; city-by-product pages; both Google profiles', 'Local rankings', 'My SEO'],
      ['Get Found', 'Review-generation engine', 'Post-install asks to Google / Yelp / Houzz', 'Review volume', 'My SEO'],
      ['Get Found', 'Visual portfolio + social', 'Completed jobs into Houzz / Instagram / Pinterest', 'Portfolio reach', 'My SEO'],
      ['Get Found', 'AI room visualizer', '"See your floor in your room" on the site + showroom', 'Engagement, leads', 'My Dev'],
      ['Win Builders', 'Builder account intelligence', 'Monitor new communities, starts, permits; rank targets', 'Qualified builders', 'My AI Lead Gen'],
      ['Win Builders', 'New-community triggers', 'Alert when a builder staffs a design-center need', 'Triggered outreach', 'My AI'],
      ['Win Builders', 'Design-center proof library', 'Package the BIA-award builder work to win RFPs', 'Win rate', 'My SEO'],
      ['Convert & Serve', 'Lead capture + CRM nurture', 'Speed-to-lead replies and drip for every channel', 'Lead-to-consult rate', 'My Dev'],
      ['Convert & Serve', 'AI mood-boards + concepts', 'Room concepts and palettes to speed designer meetings', 'Attach / upgrade rate', 'My AI'],
      ['Convert & Serve', 'Selection + quote automation', 'Measure-to-quote and options pricing around Studio Chateau', 'Quote turnaround', 'My Dev'],
      ['Convert & Serve', 'Booking + install coordination', 'Online scheduling, reminders, post-job review prompts', 'No-shows, reviews', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'AI augments the designers, the showroom relationship, and the install crew — it does not replace them. The visualizer and mood-boards speed and de-risk the human design consult; people still design and install.',
      'Technijian integrates around the Studio Chateau tool Christian Brothers already uses — it enhances that workflow, it does not replace it.',
      'And every play runs on the IT and security foundation Technijian already provides, so the growth program is built on a stack we already know and protect.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 12 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '12'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because Christian Brothers’ internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 15 replace them with real baselines. The logic holds across a wide range of inputs, because the two levers — more homeowner projects and more builder partnerships — are large relative to the program cost.'),
  spacer(140),
  calloutBox(
    'AI as a Managed Investment — Not a Leap of Faith',
    [
      'The reason most AI spending disappoints is not the technology — it is the lack of measurement. Industry research (McKinsey State of AI) finds the large majority of companies now use AI, but only about a third see a real profit impact; the difference is discipline, not budget.',
      'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost — and if a pilot does not clear its cost at the gate, we stop and re-scope. Christian Brothers carries the upside, not blind risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility Pilot', { color: CORE_BLUE }),
  p('Start with one clearly-scoped program — not an open-ended engagement. The pilot fixes the free geography defect, turns on review velocity, and stands up the local-search and portfolio foundation, proving the homeowner-lead lift before the larger builds (the visualizer and builder intelligence) are scoped.'),
  buildTable(
    [{ label: 'What’s Included', weight: 3 }, { label: 'Detail', weight: 4 }, { label: 'Investment', weight: 2 }],
    [
      [{ text: 'My SEO — Local Search, Reviews & Portfolio', bold: true }, 'Geo-fix off "Orange County," city/product pages, both Google profiles, review engine, and portfolio across Houzz / Instagram / Pinterest', '$1,500/mo'],
      [{ text: 'My AI — Executive AI Workshop', bold: true }, 'Half-day session: AI roadmap, use-case scoring, and a 90-day quick-wins plan for Castelli-family leadership', '$5,000 one-time'],
      [{ text: 'My IT (in place)', bold: true }, 'The managed IT and security Technijian already provides — the trusted foundation the program plugs into', 'Existing'],
      [{ text: 'ENTRY PROGRAM — 90-DAY PILOT', bold: true }, 'Fixed scope, published rates, no large up-front build', { text: '~$9,500', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_BLUE },
  ),
  spacer(120),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, the "Orange County" geo-defect is corrected and both Google Business Profiles rank for San Diego flooring queries, AND a working review engine has measurably lifted review velocity past its current pace toward the rivals’ levels.',
      'Our commitment: the entry program is month-to-month — no lock-in. If the pilot has not moved the needle on the metric above by day 90, you are under no obligation to continue, and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk — and because we already run your IT, there is no new firm to onboard.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('Projected Lift — The Full Program (Estimated)', { color: CORE_BLUE }),
  buildTable(
    [ { label: 'Measure', weight: 3 }, { label: 'Estimated Current', weight: 2.4 }, { label: 'With the Program', weight: 2.4 }, { label: 'Direction', weight: 1.8 } ],
    [
      ['Local search visibility', 'Mis-tagged "Orange County"', 'Re-anchored to San Diego + city pages', 'Found locally'],
      ['Online reviews (volume)', '~37', 'Growing velocity', 'Trust + ranking'],
      ['Room visualizer', 'None', 'Live on site + showroom', 'Engagement + conversion'],
      ['Visual portfolio reach', 'Split + thin', 'Unified + active', 'Shortlist visibility'],
      ['Homeowner leads to consults', 'Manual follow-up', 'Captured + nurtured', 'More booked jobs'],
      ['Builder partnerships', 'Reactive', 'Account-intelligence-driven', 'More communities'],
      ['Selection / quote turnaround', 'Manual', 'Automated', 'Designer capacity'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model (Estimated, Conservative Assumptions)'),
  buildTable(
    [ { label: 'Model Input', weight: 3.6 }, { label: 'Conservative', weight: 2.1 }, { label: 'Target', weight: 2.1 }, { label: 'Aggressive', weight: 2.1 } ],
    [
      ['New homeowner projects (Y1)', '+18', '+40', '+80'],
      ['Est. average project value*', '$9,000', '$9,000', '$9,000'],
      ['Homeowner revenue', '+$162,000', '+$360,000', '+$720,000'],
      ['Builder design-center revenue (won / deepened)**', '+$90,000', '+$190,000', '+$300,000'],
      [{ text: 'Total incremental revenue', bold: true }, { text: '+$252,000', bold: true }, { text: '+$550,000', bold: true }, { text: '+$1,020,000', bold: true }],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$100,000', bold: true }, { text: '~$100,000', bold: true }, { text: '~$100,000', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '2.5x', bold: true, color: PASS }, { text: '5.5x', bold: true, color: PASS }, { text: '10.2x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* Placeholder average flooring/finishes project value, blended across remodel and new-home work — calibrates to Christian Brothers’ actual average in discovery. ** Estimated incremental revenue from builder design-center partnerships won or deepened (recurring across a community’s homes). Revenue is attributed to the program, not guaranteed; all figures depend on actual close rate, project value, and builder pipeline.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Technijian Service Investment Map — Full Engine (the later expansion)'),
  p('The 90-Day Visibility Pilot above is the ask. The full engine below is the expansion — engaged only once the pilot proves the lift — and is what the Year-1 ROI model is built against.'),
  buildTable(
    [ { label: 'Service', weight: 2.8 }, { label: 'Scope', weight: 3.6 }, { label: 'Monthly', weight: 1.4 }, { label: 'Y1 Total', weight: 1.4 } ],
    [
      ['My SEO — Local Search, Reviews & Portfolio (Pilot)', 'Geo-fix + city/product pages, both Google profiles, review engine, and portfolio across Houzz / Instagram / Pinterest', '$1,500/mo', '$18,000'],
      ['My AI Lead Gen — Builder Account Intelligence', 'Monitor San Diego communities, starts, and permits; rank and profile builders to pursue (Starter tier)', '$1,499/mo', '$18,000'],
      ['My AI — Fractional AI Advisor', 'Program lead across the visualizer, automation, and search work', '$2,000/mo', '$24,000'],
      ['My Dev — Custom Build (one-time, phased)', 'Room visualizer, AI mood-boards, lead capture and CRM, online booking, and selection/quote automation', '—', '$35,000'],
      ['My AI — Executive AI Workshop (one-time)', 'Leadership alignment and an AI roadmap', '—', '$5,000'],
      [{ text: 'FULL ENGINE — YEAR-1 TOTAL', bold: true }, { text: 'Recurring $4,999/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$100,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'The cheapest wins come first: the geo-fix, review engine, and portfolio are low-cost and start paying back in homeowner leads within the first quarter — before the bigger builds.',
      'Winning even one or two new builder design-center partnerships adds recurring revenue across whole communities — a single relationship can cover much of the program on its own.',
      'And because Technijian already runs the IT, there is no new outside firm to onboard and no integration starting from zero — the program plugs into a stack we already manage and secure.',
    ],
    CORE_BLUE
  ),
);

// ---------- 13 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '13'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence: fix the foundation and the public front door first, then capture homeowner demand with the visualizer and portfolio, then grow the builder channel and automate. The cheapest, highest-visibility wins land in the first ninety days; the bigger builds get realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Christian Brothers 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 12.0 — Christian Brothers Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Fix the free things and turn on the trust engine.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Geo-SEO & Profile Foundation', 'Correct the "Orange County" geography to San Diego, build the first city-by-product pages, and optimize both Google Business Profiles (flooring and design center).'],
      ['1.2 — Review Engine Live', 'Turn on post-install review requests to Google, Yelp, and Houzz, and start closing the review-volume gap against the leaders.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Capture (Days 91–180)', { color: TEAL }),
  p('Give homeowners a reason to choose and a way to picture it.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Room Visualizer', 'Launch a "see-your-floor-in-your-room" visualizer on the site and a showroom kiosk to de-risk the buying decision.'],
      ['2.2 — Visual Portfolio + Social', 'Stand up the content engine that turns completed jobs into Houzz, Instagram, and Pinterest assets, and unify the two brands.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Grow (Days 181–365)', { color: CORE_ORANGE }),
  p('Grow the high-margin builder channel and automate the work.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Builder Account Intelligence', 'Turn on monitoring of San Diego communities, starts, and permits, and build the design-center proof library to win partnerships.'],
      ['3.2 — Automate & Optimize', 'Bring lead capture and CRM nurture and selection/quote automation into production, and deliver the ROI dashboard against the Section 15 baselines.'],
    ],
  ),
);

// ---------- 14 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '14'),
  spacer(100),
  p('Five actions Christian Brothers can take immediately — before any expanded engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Fix the "Orange County" Tagline',
    ['Change "Orange County’s #1 Interior Design House" on cbinteriors.net to reflect San Diego County. It is a free, same-day edit that stops actively mis-signaling your location to Google and removes a credibility gap with local buyers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Turn On a Review Ask After Every Install',
    ['Text or email every finished customer a one-tap link to leave a Google review. You sit at roughly 37 where rivals have 200-plus; starting the habit this week begins closing the single biggest trust gap, at no cost.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Claim and Complete Both Google Business Profiles',
    ['Make sure the flooring showroom and the design center each have a complete, photo-rich Google Business Profile with services and the San Diego service-area cities. This is free local visibility the leaders already own.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Post Five Recent Before-and-After Projects',
    ['Put five recent installs on Houzz, Instagram, and Pinterest. You already photograph the work; flooring is a visual-discovery category, and evergreen project photos are exactly what homeowners shortlist on.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Build One "For Homebuilders" Proof Page',
    ['Create a single page that features the 2023 BIA ICON Award and your best builder design-center work. It anchors the design-center pitch and gives a prospective builder something concrete to evaluate.'],
    CORE_BLUE),
);

// ---------- 15 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '15'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 12 and 13 are deliberately conservative estimates — a short discovery call replaces them with Christian Brothers’ real baselines and sharpens the whole program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [ { label: 'Topic', weight: 2.4 }, { label: 'What We’d Confirm', weight: 4.4 }, { label: 'Why It Matters', weight: 3.2 } ],
    [
      ['Channel mix', 'The split between homeowner flooring and builder design-center revenue', 'Sets where the program leans and the ROI weighting'],
      ['Project economics', 'Average project value and close rate, by channel', 'The primary inputs to the revenue model'],
      ['Lead sources', 'Where leads come from today and the showroom / shop-at-home conversion', 'Calibrates the get-found and convert plays'],
      ['Builder pipeline', 'Which builders Christian Brothers serves and the current win rate', 'Scopes the account-intelligence work'],
      ['Reviews & marketing', 'Current review volume and velocity, and who owns marketing', 'Sizes the review and portfolio program'],
      ['Brand architecture', 'Whether to consolidate cbinteriors.net and cbfloorsinc.com or keep them separate', 'Decides the SEO and brand approach'],
      ['Systems', 'Studio Chateau usage, the CRM and booking tools, and current visualization', 'Defines the build and integration surface'],
      ['IT scope', 'Confirm the current Technijian IT footprint', 'So the growth program plugs in cleanly'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Christian Brothers’ real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 16 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '16'),
  spacer(100),
  p('The honest answers to the questions Christian Brothers’ leadership is most likely asking right now.'),
  spacer(120),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already have a marketing person / agency. Why add Technijian?', bold: true }, 'Keep them — we are not here to replace good marketing. We add the AI layer most agencies do not build: answer-engine optimization so AI tools cite you, the room visualizer, builder account intelligence, and the internal selection/quote automation. We already run your IT, so this plugs in alongside whatever marketing you have, not over it.'],
      [{ text: 'Isn’t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven moves that pay back fast — the free geo-fix, a review engine, a visualizer rivals already run — not autonomous "agents" doing your job. We use the simplest tool that works, measure it, and only expand what earns its place.'],
      [{ text: 'Is our data — customer, project, and builder information — safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything client-facing, led by a CISSP-certified team. This is the same security foundation Technijian already runs for your IT today.'],
      [{ text: 'We’re a lean team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give your designers back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly check-in plus reviewing what we draft. There is no new hire to manage, and no new firm to onboard since we already support your systems.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry program is a fixed-scope 90-day pilot with a defined success metric (Section 12), month-to-month with no lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The 90-Day Visibility Pilot is roughly $9,500 at published rates — no large up-front build. The full engine (the later expansion, profiled in Section 12) runs about $100K in Year 1, but only after the pilot proves the lift. You decide whether to expand based on real results, not a leap of faith.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 17 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '17'),
  spacer(100),
  p('Christian Brothers has the hard things: thirty-seven years, a BBB A+, a BIA ICON award, in-house install, a showroom, and a design-center program most flooring shops do not have. What it has not yet done is make that strength as visible and as easy to act on online as it is in person — and that is exactly where AI helps.'),
  p('The opportunity is concrete and low-risk: fix a free geography defect, build the reviews and visual portfolio homeowners choose by, add the visualizer rivals already have, and pursue the builder relationships deliberately with account intelligence. Because Technijian already runs the IT and security underneath, this is the rare growth program that starts on a stack the partner already knows and protects.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 15 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the geo-SEO fix, both Google profiles, and the review engine — live inside 30 days.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'We already run your IT. Let’s turn it into a growth engine.', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ] })] })],
  }),
);

// ---------- 18 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '18'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000 — and already Christian Brothers’ IT-support partner. We build and operate the AI systems that help regional businesses compete at scale, with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Christian Brothers', weight: 5 }],
    [
      ['My IT (in place)', 'The managed IT and security Technijian already provides — the trusted foundation the growth program builds on'],
      ['My SEO', 'Local and answer-engine search, review generation, and the visual portfolio that get Christian Brothers found and trusted by San Diego homeowners and referral partners'],
      ['My AI Lead Gen', 'Homebuilder account intelligence — monitoring San Diego communities and starts to win design-center partnerships'],
      ['My Dev', 'Custom, AI-native builds — the room visualizer, lead capture and CRM, online booking, and selection/quote automation around Studio Chateau'],
      ['My AI', 'AI strategy and builds — mood-boards and concepts, and the program leadership that ties it together'],
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
  p('Market and company intelligence gathered via public web research conducted May 2026. Company details (founding year, ownership, locations, services, awards) are drawn from public sources and the company’s own materials and should be confirmed with Christian Brothers before external use.', { italics: true }),
  spacer(120),
  p('1. Christian Brothers — cbinteriors.net and cbfloorsinc.com (About, Homebuilder, Homebuyer, Location, Reviews); BuildZoom (entity, officers, license #939936); BBB (A+, founded 1988); BIA San Diego 2023 ICON Awards; Yelp / Houzz / Birdeye / Angi; Instagram (@cbflooringinc, @christianbrothersinteriors)', { size: 20 }),
  p('2. Studio Chateau (studiochateau.com) — the licensed new-home option-selection tool; Chateau Interiors & Design (Irvine) — its parent and the SoCal design-center category leader', { size: 20 }),
  p('3. Competitors — Metro Flooring, West Coast Flooring Center, Geneva Flooring, Floor Store & Design Center, Empire Today, Express Flooring; Roomvo (room-visualizer benchmark)', { size: 20 }),
  p('4. Industry — Inside San Diego (8,782 permits, 2024); Oakwood Escrow (new-construction share of sales); Mordor / Data Insights (vinyl flooring market); Harvard JCHS LIRA (renovation spending); True Future Media / ACHR (91% rely on reviews; discovery channels)', { size: 20 }),
  p('5. Technijian capabilities & service pricing — My SEO, My AI Lead Gen, My Dev, My AI, and My IT; documented Proven Results (Multi-Agent SEO + Answer-Engine Platform; AI Document Intelligence for FINRA broker-dealers)', { size: 20 }),
  p('6. AI education layer (Section 10) — MIT Sloan Management Review (AI literacy for executives); Anthropic, "Building Effective Agents" (the automation-vs-agent distinction); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud AI Adoption frameworks); U.S. NIST AI Risk Management Framework (Govern / Map / Measure / Manage); McKinsey State of AI (AI-as-a-managed-investment / measurement discipline)', { size: 20 }),
);

// =====================================================================
const doc = new Document({
  numbering: { config: [{ reference: NUM_BULLETS, levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } } }] }] },
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: docChildren }],
});

const OUT_PATH = path.join(__dirname, 'Christian-Brothers-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => { console.error('Build failed:', err.message); process.exit(1); });
