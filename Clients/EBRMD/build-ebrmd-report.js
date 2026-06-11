// Robinson Facial Plastic Surgery (Dr. Ernest B. Robinson, MD) — AI Growth Blueprint
// Patient Demand + Referral Lead Generation. Technijian-branded DOCX builder.
// Pattern adapted from Clients/ORX/build-orx-report.js (reads brand-tokens.json).

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
const DIAGRAM_TWOENGINE_BUF = dbuf('two-engine.png');
const DIAGRAM_REFERRAL_BUF  = dbuf('referral-map.png');
const DIAGRAM_PERSONAS_BUF  = dbuf('personas.png');
const DIAGRAM_TIMELINE_BUF  = dbuf('timeline.png');

const TODAY = '2026-05-22';

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
    keepNext: true, pageBreakBefore: true,
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 48, bold: true, color, font: FONT_HEAD })] }),
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Robinson Facial: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ROBINSON FACIAL PLASTIC SURGERY', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Dr. Ernest B. Robinson, MD  ·  drface.com', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth Blueprint — Patient Demand + Referral Lead Generation', size: 30, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Aliso Viejo, California  ·  Orange County', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Robinson Facial Plastic Surgery', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '21+', label: 'Years of Facial Surgery', color: CORE_BLUE },
    { number: 'Dual', label: 'Board-Certified · RealSelf Top Doctor', color: CORE_ORANGE },
    { number: '4.8★', label: 'Google — but only ~32 reviews', color: TEAL },
    { number: '2', label: 'Growth Engines to Build', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Robinson Facial Plastic Surgery is, by any clinical measure, an elite practice: Dr. Ernest B. Robinson is a dual board-certified, fellowship-trained facial plastic and reconstructive surgeon with 21+ years of results, a RealSelf Top Doctor, and an exclusive Allergan provider. The practice already runs a My SEO program. Yet two things hold the business below its potential — and both are fixable.'),
  p('First, the digital reputation does not match the surgical one. The practice shows 4.8★ on Google but only about 32 reviews after 21 years, while the dominant Orange County names carry hundreds. Thousands of happy patients exist; they were simply never asked. Second — and the reason for this blueprint — is the question on the table: can AI Lead Gen grow the business? It can, but the honest answer depends on which of two growth engines you point it at.'),
  p('This blueprint frames the practice around those two engines. Engine A is consumer demand capture — patients searching for procedures — which grows by extending the existing My SEO with GEO, on-site capture, consult-to-surgery nurture, and a reputation engine. Engine B is professional-referral growth — other practices that send surgical cases — and that is exactly where My AI Lead Gen fits: it harvests, scores, and courts the named referral universe (dermatologists, Mohs surgeons, med spas, and more). The plan builds Engine A first, then stands up Engine B.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity — and the Honest Answer',
    [
      'Can My AI Lead Gen help? Yes — for the referral engine. It cannot (and should not) cold-prospect individual patients for elective surgery, but it is purpose-built to harvest and court the local practices that refer cases.',
      'The fastest win is reputation: closing the 32-vs-hundreds review gap lifts every local ranking and the trust a patient feels at the moment they compare surgeons.',
      'Dr. Robinson performs Mohs reconstruction — which makes every Orange County dermatologist and Mohs surgeon a natural, high-intent referral target the referral engine can pursue first.',
    ],
    CORE_ORANGE
  ),
  p('Note on figures: the practice’s internal metrics (consult volume and conversion, referral counts, average case value, current My SEO scope) were not available for this draft. Every projection below is labeled estimated and calibrates to real numbers after a short discovery call — the questions are listed in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE TWO GROWTH ENGINES ----------
docChildren.push(
  ...sectionHeader('The Two Growth Engines', TEAL, '02'),
  spacer(100),
  p('Every growth dollar for a facial plastic surgery practice comes from one of two engines, and they could not be more different in how they work. Confusing them is the most common — and most expensive — marketing mistake in aesthetics. This blueprint keeps them separate on purpose, because the right tool for one is the wrong tool for the other.'),
  spacer(160),
  diagramImage(DIAGRAM_TWOENGINE_BUF, 'The Two Growth Engines', 600, 1.61),
  diagramCaption('Figure 2.0 — The Two Growth Engines, and where My AI Lead Gen fits'),
  spacer(140),
  buildTable(
    [
      { label: 'Dimension', weight: 2 },
      { label: 'Engine A — Consumer Demand Capture', weight: 4 },
      { label: 'Engine B — B2B Referral Lead Gen', weight: 4 },
    ],
    [
      ['Who', 'Individual patients researching a procedure', 'Other practices that send surgical cases'],
      ['How they arrive', 'They search, compare, and deliberate (often for weeks)', 'A trusted provider refers them directly'],
      ['Right motion', 'Be found, capture, nurture, and earn reviews', 'Harvest, score, and court named practices'],
      ['Right tools', 'My SEO (live) + GEO + Chat.AI + nurture + reputation', 'My AI Lead Gen (account-based outreach)'],
      ['Wrong tool', 'Outbound prospecting — you cannot cold-sell a facelift', 'Mass advertising — referrers want a relationship'],
      ['Pace', 'Compounds steadily as content + reviews build', 'Each relationship sends cases for years'],
    ],
  ),
  spacer(120),
  p('The rest of this blueprint follows that structure: Section 4 answers the lead-gen question directly, Section 6 details the referral engine (Engine B), and Section 7 details the consumer engine (Engine A) on top of the My SEO already in place.'),
);

// ---------- 03 WHERE THE DEMAND LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Demand Lives', CORE_BLUE, '03'),
  spacer(100),
  p('Before tactics, it helps to see exactly where the next patient comes from. Consumer demand is large, searchable, and already partly served by the practice’s My SEO. Referral demand is smaller in count but far more valuable per relationship — and almost entirely uncaptured today.'),
  spacer(140),
  subHeader('Consumer Demand — What Patients Search'),
  buildTable(
    [
      { label: 'Patient Search', weight: 3.6 },
      { label: 'Value', weight: 2 },
      { label: 'How Robinson Wins It', weight: 4.4 },
    ],
    [
      ['"best facelift surgeon Orange County"', 'Very high', 'SEO (live) + GEO + reviews + before/after proof'],
      ['"deep plane facelift near me"', 'Very high', 'A procedure-specific page that ranks and gets AI-cited'],
      ['"rhinoplasty Orange County" / revision rhinoplasty', 'High', 'Visual gallery + surgeon credentials + consult capture'],
      ['"eyelid surgery / blepharoplasty cost"', 'High', 'Cost + candidacy explainer the assistant can answer'],
      ['"Botox / filler near me Aliso Viejo"', 'Recurring', 'Local SEO + offers + the recurring-revenue base'],
      ['"Mohs reconstruction surgeon"', 'High', 'A page that serves BOTH patients and referring derms'],
    ],
  ),
  spacer(160),
  subHeader('Referral Demand — The Practices That Send Cases'),
  p('A facial plastic surgeon earns a meaningful share of surgical volume from other providers. This universe is finite, local, and listed in public records — which is what makes it a perfect fit for My AI Lead Gen (Section 6):'),
  buildTable(
    [
      { label: 'Referral Source', weight: 3 },
      { label: 'Why They Refer', weight: 5 },
      { label: 'Priority', weight: 1.6 },
    ],
    [
      ['Dermatologists / Mohs surgeons', 'Mohs skin-cancer excisions on the face need reconstruction — Dr. Robinson does this', '★★★★★'],
      ['Non-surgical med spas', 'Take Botox/filler revenue but refer surgical cases (facelift, eyes, nose) up', '★★★★'],
      ['Dentists / oral & maxillofacial', 'Chin and jaw work, facial trauma, cosmetic facial referrals', '★★★'],
      ['Optometry / ophthalmology', 'Droopy-lid (ptosis) and cosmetic/functional eyelid cases', '★★★'],
      ['PCP · OB-GYN · estheticians / salons', 'General cosmetic referrals from trusted local relationships', '★★'],
    ],
  ),
);

// ---------- 04 CAN MY AI LEAD GEN HELP? ----------
docChildren.push(
  ...sectionHeader('Can My AI Lead Gen Help? The Honest Answer', CORE_ORANGE, '04'),
  spacer(100),
  p('This is the question that prompted the blueprint, so it deserves a direct answer rather than a sales pitch: yes — but for one engine, not both. Getting this right is what separates a program that works from money spent in the wrong place.'),
  spacer(140),
  subHeader('For Consumer Patients — No (and here’s why)'),
  p('My AI Lead Gen is an outbound engine: it harvests named targets from public business data, enriches them, and runs personalized outreach. That model does not fit individual patients. You cannot ethically or practically build a list of "people who want a facelift," privacy and HIPAA aside — and nobody chooses an elective $15K–$40K surgery because they received a cold message. Consumer growth is won by being found and trusted at the moment someone is already searching, then nurturing them to a booked consult. That is Engine A (Section 7), built on the My SEO already running — not outbound lead gen.'),
  spacer(120),
  subHeader('For Professional Referrals — Yes, and It’s a Strong Fit'),
  p('Referral sources are exactly what My AI Lead Gen was built to find. Every dermatology, Mohs, med-spa, dental, and optometry practice in Orange County is a named business in public records (the NPI registry, Google Business, and more). My AI Lead Gen harvests that universe, enriches and scores it, and delivers outreach-ready, personalized sequences — replacing the cold-list tax of tools like Apollo or ZoomInfo. Pointed at referrers, it builds a pipeline of relationships, each of which can send cases for years.'),
  spacer(100),
  calloutBox(
    'The Mohs Reconstruction Wedge',
    [
      'Dr. Robinson performs Mohs reconstruction — repairing the face after a dermatologist removes skin cancer. That is a direct, recurring, high-intent referral line.',
      'My AI Lead Gen can surface every Mohs surgeon and dermatology practice in Orange County and put them at the top of the outreach list — a channel almost no competitor systematically pursues.',
      'This is account-based and relationship-first: AI builds the list and drafts the outreach; Dr. Robinson and the coordinator build the trust. The tool supports the relationship; it does not replace it.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Robinson Facial Plastic Surgery Leadership', CORE_BLUE, '05'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where the practice sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that Dr. Robinson and the team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn\'t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "text every post-op patient a review request three days after surgery." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the referral pipeline and flag which derm practices to follow up with." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic\'s guidance on building AI systems) is to use the simplest thing that works. Robinson Facial starts with simple automations that pay off in the first 90 days — review velocity, consult capture, referral harvesting — and adds autonomous agents only where the value is proven, which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Robinson Facial Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run practices — including Robinson Facial — sit at the first or second rung of the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'Robinson Today', weight: 1.6, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent marketing and intake', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'A live My SEO program is in place, but AI is not yet woven into reputation, capture, nurture, or referral growth', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — review velocity, consult nurture, referral outreach — with measured results', ''],
      ['4. Scaled', 'AI is embedded across both growth engines with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the practice markets, captures, and grows', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Robinson Facial is already at the Emerging stage: the My SEO program is live. This report is the plan to reach Operational — AI working across both the consumer engine and the referral engine — within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government\'s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a medical practice like Robinson Facial, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything patient-facing or medical — AI drafts candidacy and procedure copy, Dr. Robinson or the coordinator approves'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — patient information and any PHI never touch a public model; HIPAA-aware handling by design'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Organizations Are Already Doing', { color: CORE_BLUE }),
  bullet('Elective-procedure practices: aesthetic and dental practices are running systematic post-visit review requests to lift local ranking and trust — turning years of happy-but-silent patients into a visible reputation.'),
  bullet('Local service providers: businesses are using AI search optimization (GEO) to become the cited answer when prospects ask AI assistants "best [procedure] near me" — capturing demand competitors never see.'),
  bullet('Referral-driven B2B: relationship-led businesses are using account-based AI outreach to systematically court a finite, named referral universe instead of leaving it to chance.'),
  p('These are representative directions of travel across comparable industries, not guarantees; Robinson Facial\'s own numbers would be confirmed in discovery. Technijian\'s specific capabilities and prior builds appear in Section 10 (Capability Proof).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — A Robinson Facial Patient Coordinator', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A coordinator answers consult inquiries by phone and a single web form, repeats the same candidacy, cost, and financing questions all day, manually remembers to follow up with patients still deliberating, and rarely has time to ask happy post-op patients for a review — so the reputation gap stays open and warm consults go cold.',
    'WITH AI: A 24/7 consult assistant answers candidacy/cost/financing on drface.com and books consults; nurture sequences keep deliberating patients warm automatically; a review-request goes to every happy patient on schedule; and the referral list and outreach are drafted for the coordinator to approve. The coordinator spends time on patients, not on repetitive chasing — and nothing falls through the cracks.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but the practice assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI marketing lead typically costs $180K+/year and is scarce, and one person cannot cover SEO/GEO, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds and CISSP-led security, already trusted via the live My SEO program', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 06 THE REFERRAL ENGINE ----------
docChildren.push(
  ...sectionHeader('The Referral Engine (Engine B)', CORE_BLUE, '06'),
  spacer(100),
  p('This is the new growth channel My AI Lead Gen opens. The diagram below shows the referral universe it harvests and the priority order it works — with dermatologists and Mohs surgeons first, because facial reconstruction is a direct line into Dr. Robinson’s operating room.'),
  spacer(160),
  diagramImage(DIAGRAM_REFERRAL_BUF, 'The Referral Engine — what My AI Lead Gen builds', 580, 1.71),
  diagramCaption('Figure 5.0 — The Referral Engine: the practices My AI Lead Gen harvests, scores, and courts'),
  spacer(140),
  subHeader('How My AI Lead Gen Runs It'),
  buildTable(
    [
      { label: 'Stage', weight: 2 },
      { label: 'What Happens', weight: 5.4 },
      { label: 'Output', weight: 2.6 },
    ],
    [
      ['Harvest', 'Pull every OC dermatology/Mohs, med-spa, dental, and optometry practice from public data (NPI registry, Google Business)', 'A complete named-target list'],
      ['Enrich', 'Add practice size, services, decision-maker, and contact details', 'Outreach-ready records'],
      ['Score', 'Rank by referral fit — Mohs/derms first, then med spas, then the rest', 'A prioritized queue'],
      ['Deliver', 'Personalized outreach in Dr. Robinson’s voice; coordinator follows up; track responses', 'Booked referral meetings'],
    ],
  ),
  spacer(120),
  calloutBox(
    'Why This Channel Compounds',
    [
      'A consumer ad stops working the day you stop paying. A referral relationship, once earned, sends cases for years — at near-zero ongoing cost.',
      'The universe is finite: there are only so many dermatology and Mohs practices in Orange County. Working the full list systematically is achievable, not endless.',
      'It is a wedge no competitor is pressing. The big Newport Beach names compete loudly for consumers; few are quietly building the referral base Dr. Robinson’s Mohs work makes natural.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 THE CONSUMER ENGINE ----------
docChildren.push(
  ...sectionHeader('The Consumer Engine (Engine A) — Building on My SEO', CORE_ORANGE, '07'),
  spacer(100),
  p('The practice already runs My SEO, so this engine is about extending what’s working — not starting over. Four additions turn existing search visibility into more booked surgeries, and the first is the highest-ROI move available to the practice today.'),
  spacer(140),
  buildTable(
    [
      { label: 'Addition', weight: 2.4 },
      { label: 'What It Does', weight: 4 },
      { label: 'Why It Matters', weight: 3.6 },
    ],
    [
      ['Reputation engine', 'Systematically request reviews from happy patients (post-visit SMS/email)', 'Closes the 32-vs-hundreds gap; lifts local ranking AND trust at compare-time'],
      ['GEO (on top of My SEO)', 'Make procedure pages the source AI assistants cite', 'Patients now ask ChatGPT/Perplexity "best facelift surgeon OC" before they call'],
      ['Chat.AI consult assistant', '24/7 assistant answers candidacy / cost / financing and books the consult', 'Aesthetics sites bounce; an assistant converts visits into consults'],
      ['Consult-to-surgery nurture', 'Tasteful email/SMS over the weeks a patient deliberates', 'Lifts the single biggest revenue metric — consult-to-surgery conversion'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Reputation Gap Is the Quick Win',
    [
      '21 years and thousands of patients have produced only ~32 Google reviews. The reviews are not missing because patients were unhappy — they were never asked.',
      'A systematic post-visit review request can multiply that count within 90 days, directly improving how Robinson ranks against Newport Beach competitors and how a comparing patient perceives the practice.',
      'This single move costs little, builds on the existing My SEO, and pays back faster than anything else in the plan.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '08'),
  spacer(100),
  p('Orange County facial plastic surgery is one of the most competitive aesthetic markets in the country, concentrated in Newport Beach. Robinson’s clinical credentials are fully competitive; the gap is digital reputation and visibility — which is precisely what this program closes.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.4 },
      { label: 'Market / Focus', weight: 3 },
      { label: 'Digital Posture', weight: 4 },
    ],
    [
      ['Dr. Kevin Sadati', 'Newport Beach — facelift, "natural" look', '700+ 5-star reviews; "Best Facial Cosmetic Surgeon OC" — the dominant brand'],
      ['Dr. Ali Sajjadian', 'Newport Beach — rhinoplasty authority', '~5,000 nose procedures, 30 yrs; strong rhinoplasty SEO'],
      ['Dr. Rami Batniji', 'Newport Beach / Beverly Hills — deep-plane facelift', 'Orange Coast Top Doctor 2026; polished brand'],
      ['Dr. Ali Sepehr', 'Newport Beach / Tustin', 'Fellowship-trained (U Toronto); active content'],
      ['Dr. Timothy Miller', 'Orange County — eyelid + face/neck', 'Established; less aggressive digital'],
      ['Dr. Jonathan Zelken', 'Newport Beach', 'NewBeauty Top Doctor; social-forward'],
    ],
  ),
  spacer(200),
  calloutBox(
    'Where Robinson Wins — The White Space',
    [
      'Reputation velocity: 32 reviews vs. competitors’ hundreds is the single biggest, most fixable gap. The quality is there; the reviews were never collected.',
      'South-OC ownership: the big names cluster in Newport Beach. Robinson can own Aliso Viejo, Laguna, Mission Viejo, San Clemente, and Dana Point local search instead of fighting Newport head-on.',
      'The Mohs-reconstruction referral niche: a clinical credential most cosmetic-only competitors don’t emphasize — and a B2B referral wedge nobody is systematically courting.',
      'GEO first-mover: almost no OC surgeon is optimized to be the answer AI assistants cite. Robinson can claim it.',
    ],
    CORE_BLUE
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a prospective patient asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Who is the best facial plastic surgeon in Orange County for a facelift?"', [
    'TODAY — the AI assistant answers with whichever surgeons have the strongest content and review signals it can read: it names the dominant Newport Beach brands (hundreds of reviews, heavy content) and does NOT mention Dr. Robinson — even though his 21 years, dual board certification, and fellowship training are fully competitive. Robinson is invisible at the exact moment the patient is forming a shortlist.',
    'AFTER GEO + reviews — the same query returns Robinson as a cited option ("Dr. Ernest B. Robinson is a dual board-certified, fellowship-trained facial plastic surgeon in Aliso Viejo with 21+ years of experience…"), with the procedure pages and a deeper review base as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result would be captured as the GEO baseline at the discovery call.)', { italics: true, size: 18 }),
);

// ---------- 09 THE PATIENT & REFERRAL CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The Patient & Referral Customer', CORE_ORANGE, '09'),
  spacer(100),
  p('Robinson serves a handful of distinct segments across the two engines. Each is reached differently — which is the whole point of separating consumer capture from referral lead gen.'),
  spacer(160),

  personaCard('1 — The Surgical Self-Investor (Engine A)', CORE_BLUE, [
    ['Profile', 'Affluent, 45–65, considering a facelift, neck lift, or eyelid surgery. The highest-value patient.'],
    ['Mindset', 'Researches for weeks or months; reads reviews; compares 3–4 surgeons; "do it for myself."'],
    ['Decision Driver', 'Trust and natural results. Reviews, before/after proof, and surgeon credentials win the consult.'],
    ['How AI Helps', 'GEO + reviews put Robinson in the consideration set; nurture and the consult assistant convert the deliberation into a booking.'],
    ['Technijian Hook', 'My SEO (live) + GEO + My AI reputation/nurture + Chat.AI consult capture.'],
  ]),
  spacer(160),

  personaCard('2 — The Rhinoplasty Patient (Engine A)', TEAL, [
    ['Profile', 'Often 20s–30s, highly visual and social-media-driven; primary or revision rhinoplasty.'],
    ['Mindset', 'Studies galleries and surgeon specialization closely; wants proof of nose-specific expertise.'],
    ['Decision Driver', 'Portfolio depth and credibility for the specific procedure.'],
    ['How AI Helps', 'Procedure-specific SEO/GEO pages + visual proof + an assistant that answers cost/candidacy.'],
    ['Technijian Hook', 'My SEO + GEO + Chat.AI; before/after content engine.'],
  ]),
  spacer(160),

  personaCard('3 — The Injectables Regular (Engine A)', CORE_BLUE, [
    ['Profile', 'Returns 2–4×/year for Botox and filler; the recurring-revenue base and a referral source.'],
    ['Mindset', 'Convenience and trust; often the entry point to a future surgical case.'],
    ['Decision Driver', 'Local, easy booking, consistent results, fair offers.'],
    ['How AI Helps', 'Local SEO + offers + recall reminders keep them coming back and upgrade them over time.'],
    ['Technijian Hook', 'My SEO (local) + My AI recall/nurture.'],
  ]),
  spacer(160),

  personaCard('4 — The Referring Dermatologist / Mohs Surgeon (Engine B)', CORE_ORANGE, [
    ['Profile', 'A local derm or Mohs surgeon who removes facial skin cancers and needs a reconstruction partner.'],
    ['Mindset', 'Wants a reliable, skilled surgeon who makes them and their patient look good — and communicates back.'],
    ['Decision Driver', 'Surgical skill, responsiveness, and a relationship. The #1 B2B target.'],
    ['How AI Helps', 'My AI Lead Gen surfaces and scores them; personalized outreach + Dr. Robinson’s Mohs credential opens the door.'],
    ['Technijian Hook', 'My AI Lead Gen (account-based) + My Dev referral-status touchpoints.'],
  ]),
  spacer(160),

  personaCard('5 — The Med-Spa Referrer (Engine B)', GOLD, [
    ['Profile', 'A non-surgical med spa that performs injectables but refers surgical cases out.'],
    ['Mindset', 'Wants a trusted surgeon to send facelift/eyelid/nose cases to without losing the patient relationship.'],
    ['Decision Driver', 'Trust and a clean hand-off; reciprocal respect.'],
    ['How AI Helps', 'My AI Lead Gen identifies non-surgical spas in the area and runs partnership outreach.'],
    ['Technijian Hook', 'My AI Lead Gen (account-based outreach).'],
  ]),
  spacer(160),

  personaCard('6 — The Out-of-Town Guest (Engine A)', TEAL, [
    ['Profile', 'A patient traveling to Orange County for a specific procedure; the site already has an out-of-town page.'],
    ['Mindset', 'Needs logistics confidence (travel, recovery, aftercare) on top of surgeon trust.'],
    ['Decision Driver', 'Reputation + a concierge-grade experience that removes travel friction.'],
    ['How AI Helps', 'GEO captures destination searches; the consult assistant answers logistics and books the virtual consult.'],
    ['Technijian Hook', 'My SEO + GEO + Chat.AI (virtual consult capture).'],
  ]),
  spacer(200),

  p('Figure 8.0 maps each segment by revenue value and volume — blue for consumer patients (Engine A) and orange/gold for referral sources (Engine B, the My AI Lead Gen targets).', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Patient & Referral Segments', 580, 1.50),
  diagramCaption('Figure 8.0 — Patient & Referral Segments: Revenue Value vs. Volume'),
);

// ---------- 10 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '10'),
  spacer(100),
  p('Robinson already knows Technijian delivers — the My SEO program is live. The platforms below are the rest of the toolkit, each delivered and operating for real clients, and each mapped to a specific engine in this plan.'),
  spacer(160),
  capabilityBox(
    'Proven Build 1 — Multi-Agent SEO + GEO Platform (extends your live My SEO)',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP, plus SEMrush, GA4, and Perplexity) that ranks content in Google and positions clients as the answer the AI assistants cite.',
    'It layers GEO onto the My SEO already running — so "best facelift surgeon Orange County" and the procedure searches win in both Google and ChatGPT / Perplexity / Google AI Overviews.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 2 — My AI Lead Gen: Account-Based Outbound (the referral engine)',
    'My AI Lead Gen harvests high-fit targets from public data, enriches and scores them, and delivers outreach-ready personalized sequences — replacing the Apollo / ZoomInfo subscription tax.',
    'It builds the referral engine: every OC dermatology/Mohs, med-spa, dental, and optometry practice, scored with Mohs derms first, with personalized outreach in Dr. Robinson’s voice. This is the answer to the lead-gen question.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 3 — AI Review & Reputation Engine',
    'Technijian built an AI review and reputation system that requests, monitors, and responds to reviews across Google and the directories local search ranks on.',
    'It closes the 32-vs-hundreds review gap with systematic post-visit requests — the single highest-ROI move available, lifting both local ranking and patient trust.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 4 — Chat.AI Conversational Capture',
    'Chat.AI is Technijian’s enterprise AI platform; as a website assistant it answers visitor questions in natural language around the clock and hands qualified inquiries to a person.',
    'On drface.com it answers candidacy, cost, and financing questions for nervous prospective patients and books the consult — turning visits into consults instead of bounces.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 5 — AI-Native Custom App Delivery (My Dev)',
    'Technijian’s AI-native SDLC delivers custom web apps 3–5x faster than traditional development — funnels, integrations, and automations built around a real workflow.',
    'It builds the consult-to-surgery nurture flows, the booking/lead routing, and the referral-status touchpoints that keep referring practices informed and loyal.'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across SEO content, review generation, nurture, and referral outreach: won’t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass on patient-facing copy, candidacy/medical-claim wording, deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — procedure content, referral-outreach personalization, review responses, nurture sequences, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, extraction, enriching and tagging thousands of OC referral-practice records', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Robinson Facial pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. For example, a single procedure explainer is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because Robinson’s internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 14 replace them with real baselines. Because a single facial surgery case is high-value, the ROI holds at modest case counts — the two engines simply need to add a handful of cases each.'),
  spacer(120),
  calloutBox(
    'AI as a Managed Investment — Not a Leap of Faith',
    [
      'The reason most AI spending disappoints is not the technology — it is the lack of measurement. Industry research (McKinsey State of AI, 2025) finds roughly 88% of companies now use AI, but only about 39% see a real profit impact; the difference is discipline, not budget.',
      'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost — and if a pilot does not clear its cost at the gate, we stop and re-scope. Robinson Facial carries the upside, not blind risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility & Reputation Pilot', { color: CORE_BLUE }),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up the reputation engine and the GEO layer on top of the live My SEO, plus the consult-capture assistant, and proves the lift before the referral engine or the larger build is discussed.'),
  buildTable(
    [{ label: 'What\'s Included', weight: 3 }, { label: 'Detail', weight: 4 }, { label: 'Investment', weight: 2 }],
    [
      [{ text: 'My AI — Reputation Engine', bold: true }, 'Systematic post-visit review requests to close the ~32-vs-hundreds gap; monitoring and response', '$1,500/mo'],
      [{ text: 'My SEO — GEO Extension', bold: true }, 'GEO/AI-citation layer + procedure content on top of the My SEO already running', '$750/mo'],
      [{ text: 'My Dev — Consult Capture (Chat.AI)', bold: true }, 'Consult-assistant integration + booking funnel on drface.com (one-time build)', '$20,000 one-time'],
      [{ text: 'Discovery & Baseline', bold: true }, 'Calibration call: real consult volume, conversion, referral counts, case value', 'Included'],
      [{ text: '90-DAY PILOT', bold: true }, 'Fixed scope, published rates, no referral-engine spend until proven', { text: '~$6,750 + build', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_BLUE },
  ),
  spacer(120),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, Robinson Facial has at least 25 net-new Google reviews from happy patients AND the consult-capture assistant is live and booking consults on drface.com.',
      'Our commitment: the pilot is month-to-month, no lock-in, and there is no obligation to continue if it doesn’t hit the metric by day 90. If it has not moved the needle, you are under no obligation to continue — and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['Google reviews', '~32 (after 21 yrs)', 'Hundreds within a year', 'Ranking + trust'],
      ['GEO citations (ChatGPT, Perplexity, AI Overviews)', 'None', 'Cited for key procedures', 'Durable visibility'],
      ['Consult → surgery conversion', 'Unmanaged', 'Nurtured', 'More surgeries, same consults'],
      ['Active referring practices', 'Ad hoc / few', 'A worked, growing list', 'Recurring case flow'],
      ['Visitor → consult capture', 'Form only', 'Chat.AI assistant + funnel', 'More from same traffic'],
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
      ['Incremental cases — referral engine (Y1)', '+12', '+24', '+40'],
      ['Incremental cases — consumer engine (Y1)', '+8', '+16', '+28'],
      ['Avg case value*', '$12,000', '$12,000', '$12,000'],
      [{ text: 'Total additional annual revenue', bold: true }, { text: '+$240,000', bold: true }, { text: '+$480,000', bold: true }, { text: '+$816,000', bold: true }],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$96,200', bold: true }, { text: '~$96,200', bold: true }, { text: '~$96,200', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '2.5x', bold: true, color: PASS }, { text: '5.0x', bold: true, color: PASS }, { text: '8.5x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* Blended placeholder across surgical procedures; conservative — facelifts and rhinoplasty run well above $12,000. Excludes recurring injectables uplift. All figures projected, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('Technijian Service Investment Map'),
  buildTable(
    [
      { label: 'Service', weight: 2.6 },
      { label: 'Scope', weight: 3.8 },
      { label: 'Monthly', weight: 1.4 },
      { label: 'Y1 Total', weight: 1.4 },
    ],
    [
      ['My SEO — GEO Extension', 'Add GEO/AI-citation + procedure content on top of the My SEO already running', '$750/mo', '$9,000'],
      ['My AI — Reputation + Nurture', 'Review-velocity engine + consult-to-surgery nurture flows', '$1,500/mo', '$18,000'],
      ['My AI Lead Gen — Referral Engine', 'Harvest/enrich/score/outreach to OC referral practices (Professional tier)', '$3,499/mo', '$42,000'],
      ['My Dev — Capture & Funnel Build', 'Chat.AI consult-assistant integration, booking funnel, lead routing (one-time)', '—', '$20,000'],
      ['My Dev — Managed Services', 'Hosting, monitoring, and ongoing optimization', '$600/mo', '$7,200'],
      [{ text: 'YEAR-1 TOTAL (added program)', bold: true }, { text: 'Recurring $6,349/mo + build', bold: true }, { text: '', bold: true }, { text: '~$96,200', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(40),
  p('My SEO is already in place and is not re-billed here — this map shows the added program. Chat.AI is integrated within the My Dev build. All amounts confirm against scope at the discovery call.', { italics: true, size: 18 }),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'A single facelift or rhinoplasty case can be worth $15,000–$40,000. At a conservative $12,000 blended, just eight added cases a year cover the full program — and the model targets far more.',
      'The reputation engine and the referral engine both produce results that compound: reviews and relationships keep paying long after the work to build them.',
      'The program is phased — reputation + capture first (fast payback), then the referral engine — which lowers the entry point and proves return before the full spend.',
    ],
    CORE_BLUE
  ),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('Two things compound against the practice every quarter it waits. First, AI-search visibility rewards whoever optimizes first: each quarter Robinson Facial is not the cited answer for "best facelift surgeon Orange County," the assistants learn to answer with a Newport Beach competitor — and that default, once set in the retrieval data, is harder and more expensive to dislodge than to claim now. Second, the reputation gap stays open: every month of happy-but-unasked patients is local ranking and compare-time trust ceded to surgeons with hundreds of reviews. The referral universe is finite, too — the dermatologists and Mohs surgeons a competitor courts first are no longer available to court. The cost of waiting is not zero; it is a competitor becoming the default answer and the default referral partner.'),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence: strengthen the consumer engine first (where the fastest wins are), stand up the referral engine next, then scale both. Meaningful results — more reviews, more captured consults — are visible inside the first 90 days.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Robinson 90-180-365 Day Growth Roadmap', 600, 2.30),
  diagramCaption('Figure 11.0 — Robinson Facial Plastic Surgery: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Strengthen the consumer engine on top of the live My SEO — and capture the demand it already creates.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Reputation + GEO', 'Launch the review-velocity engine (post-visit requests). Layer GEO and procedure content onto the existing My SEO.'],
      ['1.2 — Capture & Nurture Live', 'Deploy the Chat.AI consult assistant on drface.com. Stand up consult-to-surgery nurture flows and lead tracking.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Referral Engine (Days 91–180)', { color: TEAL }),
  p('Stand up Engine B — the answer to the lead-gen question.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Harvest the Universe', 'My AI Lead Gen pulls every OC dermatology/Mohs, med-spa, dental, and optometry practice; enriches and scores it (Mohs derms first).'],
      ['2.2 — Account-Based Outreach', 'Personalized outreach in Dr. Robinson’s voice; coordinator follow-up; first referral meetings booked.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale Both Engines (Days 181–365)', { color: CORE_ORANGE }),
  p('Compound what is working across both engines.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Both Engines Compounding', 'Consult-to-surgery conversion rising; a steady, growing referral case flow from the worked list.'],
      ['3.2 — Optimize & Report', 'Double down on the procedures and referrers that convert. ROI dashboard delivered against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions Robinson Facial can take immediately — before any new engagement. Each creates value this week and leads into the larger program.'),
  spacer(140),
  calloutBox('1 — Text Your Last 50 Happy Patients for a Review',
    ['The 32-review gap is the biggest, cheapest fix in the practice. Have the coordinator text the last 50 satisfied surgical patients a one-tap Google review link. Even 20 new reviews shifts local ranking and compare-time trust within weeks.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Claim and Complete the Google Business Profile',
    ['Verify the Aliso Viejo Google Business Profile; add full procedure descriptions, hours, photos, and before/after imagery. This is free local visibility that patients and referrers both check.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Build the Mohs / Dermatology Target List',
    ['Open Google Maps and list every dermatology and Mohs practice within 20 miles. This is the seed of the referral engine — and Dr. Robinson’s reconstruction credential is the reason to reach out.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Add a Consult CTA + Assistant to Every Procedure Page',
    ['Make "Request a Consultation" unmissable on every procedure page, and add a simple chat/booking prompt. Capture the visitor while their interest is high instead of relying on a single contact form.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Publish One Before/After-Rich Procedure FAQ',
    ['Pick the top procedure (facelift or rhinoplasty) and publish a page answering the real questions — cost, recovery, candidacy — with before/after proof. This is the seed of the GEO content AI assistants cite.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative — a short discovery call replaces them with Robinson’s real baselines and sharpens the whole program. These questions move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Consult funnel', 'Monthly consult volume and consult → surgery conversion rate', 'The #1 consumer-engine lever and ROI input'],
      ['Referrals today', 'Current referral volume and which practices send cases', 'Sizes Engine B and seeds the target list'],
      ['Case value', 'Average surgical case value and surgical vs. non-surgical mix', 'Sets the revenue lines in the ROI model'],
      ['My SEO scope', 'What the existing My SEO program covers today', 'So we extend it, not duplicate it'],
      ['Lead handling', 'Who answers calls / inquiries now, and how fast', 'Designs the capture + nurture layer'],
      ['Reviews', 'Any existing review-request process or platform', 'Calibrates the reputation engine'],
      ['Paid ads', 'Any Google / Meta / Instagram spend running now', 'Determines where capture plugs in'],
      ['Systems', 'Practice-management / CRM system in use', 'Defines the integration surface for nurture + routing'],
      ['Locations', 'Confirm Aliso Viejo + Laguna Hills — and whether Temecula is active', 'Scopes local SEO + geographic targeting'],
      ['Brand', 'Robinson Facial Plastic Surgery vs. the DrFace brand — which leads?', 'Aligns SEO/GEO and outreach naming'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Robinson’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '15'),
  spacer(160),
  p('The honest answers to the questions Robinson Facial leadership is most likely asking right now.'),
  spacer(120),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We already run My SEO with Technijian. Why add more?', bold: true }, 'Keep it — it is working, and we do not re-bill it here. This plan adds the layers it does not cover: the GEO/AI-citation layer on top of it, the reputation engine that closes the review gap, consult capture and nurture, and the My AI Lead Gen referral engine. Everything is additive to the program already running.'],
      [{ text: 'Isn\'t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — review velocity, consult capture, referral harvesting — not autonomous "agents" running your practice. We use the simplest tool that works, measure it, and only expand what earns its place.'],
      [{ text: 'Is our data — patient information — safe?', bold: true }, 'Yes. Sensitive data and any PHI never touch a public AI model; we deploy private, governed systems with human review on anything patient-facing or medical, led by a CISSP-certified team. Review and nurture run on consenting, post-visit contact only.'],
      [{ text: 'We\'re a small team. Do we have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give the coordinator back hours, not add work. Technijian runs the build and the cadence; your involvement is a short review of what we draft and approving outreach in Dr. Robinson’s voice. There is no new hire to manage.'],
      [{ text: 'What if it doesn\'t work?', bold: true }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 11), month-to-month with no lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The 90-day pilot is roughly $6,750 plus the one-time capture build, at published rates — no hidden fees. The full added program is profiled in Section 11, but only the referral engine and the rest are added after the pilot proves the lift.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 16 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '16'),
  spacer(100),
  p('Robinson Facial Plastic Surgery has the hardest thing to build already: 21 years of dual-board-certified, fellowship-trained results. What it is missing is a digital reputation that matches that surgical one, and a referral engine worthy of Dr. Robinson’s Mohs-reconstruction credential. Both are buildable now, on top of the My SEO already in place and on systems Technijian has already delivered.'),
  p('And the question that started this is answered: yes, My AI Lead Gen can grow the business — as the referral engine, courting the dermatologists, Mohs surgeons, and med spas that send surgical cases, while the consumer engine captures and converts the patients already searching. Two engines, each with the right tool.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm scope against the existing My SEO program.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — review engine, GEO layer, and the Chat.AI consult assistant — live inside 14 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to turn 21 years of results into reviews and referrals?', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 17 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '17'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help local businesses compete at scale — and Robinson Facial already runs our My SEO program.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Robinson Facial', weight: 5 }],
    [
      ['My SEO', 'The live program — extended with GEO so the practice ranks in Google AND gets cited by the AI assistants for the procedures patients search'],
      ['My AI Lead Gen', 'The referral engine — harvest, enrich, score, and court the dermatology/Mohs, med-spa, and dental practices that send surgical cases'],
      ['My AI', 'The reputation engine (close the review gap) and consult-to-surgery nurture'],
      ['My Dev', 'Chat.AI consult-assistant integration, the booking funnel, lead routing, and referral-status touchpoints'],
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
  p('Market and practice intelligence gathered via public web research conducted May 22, 2026. Review counts, credentials, and competitor claims are from publicly available sources and to be confirmed with the practice before external use.', { italics: true }),
  spacer(120),
  p('1. Robinson Facial Plastic Surgery — official website: drface.com (Home, About, Surgical & Non-Surgical Procedures, Aesthetic NP, Photos & Stories, Contact, Blog)', { size: 20 }),
  p('2. drface.com — procedures, team, locations (Aliso Viejo + Pacific Hills Surgery Center, Laguna Hills), badges (RealSelf Top Doctor, AAFPRS, Allergan)', { size: 20 }),
  p('3. Web research — Orange County facial plastic surgery competitive set (Sadati, Sajjadian, Batniji, Sepehr, Miller, Zelken)', { size: 20 }),
  p('4. My AI Lead Gen — mechanics + pricing (Harvest → Enrich → Score → Deliver; Starter $1,499 / Professional $3,499 / Enterprise $6,999 per month)', { size: 20 }),
  p('5. Mohs reconstruction referral pattern — dermatology / Mohs surgery to facial reconstructive surgeon (clinical referral line)', { size: 20 }),
  p('6. Technijian service pricing — My SEO, My AI, My AI Lead Gen, My Dev, Chat.AI rate cards; Technijian SEO + GEO strategy methodology', { size: 20 }),
  p('7. MIT Sloan Management Review — AI literacy for executives (Section 5: framing AI literacy as "what AI can do," not how to build it)', { size: 20 }),
  p('8. Anthropic — Building Effective Agents (Section 5: the automation/workflow vs. agent distinction)', { size: 20 }),
  p('9. AI maturity models — a widely-used five-stage model consistent with the Gartner AI Maturity Model and Google Cloud AI Adoption Framework (Section 5: the maturity ladder concept)', { size: 20 }),
  p('10. U.S. NIST AI Risk Management Framework (Govern / Map / Measure / Manage) — Section 5: responsible-AI controls for the three risks', { size: 20 }),
  p('11. McKinsey — The State of AI, 2025 (Section 11: ~88% of companies use AI, ~39% see profit impact — AI as a stage-gated managed investment)', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Robinson-Facial-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
