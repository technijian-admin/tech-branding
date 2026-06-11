// ThriveWell Schools (TWS) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/CBI/build-cbi-report.js (HHOC lineage).

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

const TODAY = '2026-06-08';
const CLIENT = 'ThriveWell Schools';

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

function capabilityBox(title, built, applies) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [
          new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: 'What Technijian Built: ', size: 20, bold: true, color: CORE_BLUE, font: FONT_HEAD }), new TextRun({ text: built, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to ThriveWell Schools: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
    ]})]} )] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ] })] });
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
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2000, 5360, 2000], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'THRIVEWELL SCHOOLS', size: 54, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Restorative Justice & Trauma-Informed Professional Development  —  Berkeley, CA', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Berkeley, California  |  thrivewellschools.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for ThriveWell Schools', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }));

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '$8B', label: 'CA Wellness Funding (CYBHI + CCSPP)', color: CORE_BLUE },
    { number: '70%', label: 'Referral Drop — Antioch-area Middle School', color: CORE_ORANGE },
    { number: '53%', label: 'Teacher Burnout Rate (RAND 2025)', color: TEAL },
    { number: '37%', label: 'Schools Without Formal SEL Curriculum', color: CORE_BLUE },
    { number: '6', label: 'ThriveWell Program Tracks', color: CORE_ORANGE },
  ]),
  spacer(300),
  p('ThriveWell Schools occupies a unique and urgent position in California\'s K-12 education landscape. Founded by Dr. Jennifer Lynn-Whaley, PhD — a researcher and practitioner with deep roots in criminal justice, neuroscience of behavior, and school-based trauma prevention — ThriveWell delivers what no software platform or off-the-shelf curriculum can: implementation-level coaching that shifts school culture from the inside out.'),
  p('The results are documented. At an Antioch-area middle school, ThriveWell\'s trauma-informed practices produced a 70% drop in behavioral referrals within a single school year. The mechanism was not a program installed in isolation — it was universal staff training, ongoing coaching, and a shared accountability culture built across every adult in the building.'),
  p('California has committed $8 billion in combined investment to children\'s behavioral health and community school partnerships. Districts are receiving discretionary block grants, LCFF cost-of-living increases, and federal Title IV allocations — all earmarked for exactly the kind of work ThriveWell does. The funding window is open now, and districts are actively searching for credible, research-backed partners.'),
  p('This blueprint maps three moves: getting ThriveWell found by district leaders who are already searching for trauma-informed professional development, winning named-account district relationships through AI-assisted account intelligence and grant application support, and scaling delivery beyond in-person constraints through an online training platform that removes Jennifer\'s geographic ceiling.'),
  calloutBox(
    'The Core Opportunity',
    [
      'ThriveWell holds the uncontested corner of California\'s K-12 wellness market: Restorative Justice + Trauma-Informed Practice + School-to-Prison Pipeline Prevention, delivered through a PhD-credentialed implementation coach.',
      'No software platform can replicate this. No off-the-shelf curriculum carries Jennifer\'s research depth. The question is not whether ThriveWell\'s work is needed — it is — but how fast ThriveWell can reach the districts that most need it.',
      'Technijian\'s role: build the digital infrastructure that makes ThriveWell findable, scalable, and measurably effective at the speed California\'s funding window demands.',
    ],
    TEAL
  ),
  p('A note on figures: ThriveWell\'s internal contract values and active client count were not available at time of preparation. Every ROI projection is labeled illustrative and calibrates to real numbers after a short discovery call — the specific questions are in Section 15.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 ABOUT THRIVEWELL SCHOOLS ----------
docChildren.push(
  ...sectionHeader('About ThriveWell Schools', CORE_BLUE, '02'),
  spacer(100),
  buildTable(
    [{ label: 'Field', weight: 2 }, { label: 'Detail', weight: 5 }],
    [
      ['Organization', 'ThriveWell Schools'],
      ['Website', 'thrivewellschools.com'],
      ['Founder', 'Dr. Jennifer Lynn-Whaley, PhD — Criminal Justice, Public Administration & Public Policy (American University)'],
      ['Location', 'Berkeley, CA (serving California K-12 school districts)'],
      ['Business type', 'B2B professional development & consulting — school district clients'],
      ['Signature credential', 'PhD research bridging criminology, neuroscience, and K-12 education practice'],
      ['Key publication', '"The Neuroscience Behind Misbehavior" — foundational framework for ThriveWell\'s approach'],
      ['Proven outcome', '70% drop in behavioral referrals at an Antioch-area middle school following district-wide implementation'],
      ['Delivery model', 'Workshops + ongoing coaching + technical assistance; in-person primary; virtual capacity emerging'],
      ['Free consultation', '30-minute discovery call available at thrivewellschools.com'],
    ]
  ),
  spacer(200),
  subHeader('The ThriveWell Approach'),
  p('Jennifer\'s background is rare: a criminologist and public policy researcher who spent years studying the school-to-prison pipeline from the justice system side before crossing over to transform how schools prevent it. Where most professional development vendors offer curriculum, ThriveWell offers implementation — the difference between a framework teachers learn and then forget versus a cultural shift that holds through leadership transitions and budget cycles.'),
  p('The approach is built on three research foundations: ACE (Adverse Childhood Experiences) science, neuroscience of behavior and brain-body states, and restorative justice principles drawn from evidence-based programs with documented impact on exclusionary discipline. These are not separate modules — they are integrated into a coherent framework that moves school adults from reactive punishment to proactive co-regulation.'),
  calloutBox(
    'What Makes ThriveWell Different',
    [
      'Implementation depth: ThriveWell stays — bi-monthly coaching, classroom observations, co-planning, and sustainability planning beyond the initial workshop.',
      'Research credibility: Jennifer\'s PhD in criminal justice and public policy gives ThriveWell a research base that district leadership and school boards recognize as rigorous.',
      'The prison pipeline lens: Most SEL vendors stop at student behavior. ThriveWell connects classroom discipline to juvenile justice outcomes — a frame that resonates with equity-focused superintendents and board members.',
    ],
    CORE_BLUE
  ),
  subHeader('The ThriveWell Program Portfolio'),
  buildTable(
    [{ label: 'Program', weight: 3 }, { label: 'What It Delivers', weight: 6 }],
    [
      ['Strong Beginnings', 'Restorative circles, classroom norms, and community-building for the first weeks of school — resets relational culture at the start of each year'],
      ['Foundations in Trauma', 'Staff training in ACE science, neuroscience of behavior, and brain-body connection — the conceptual base for everything else ThriveWell does'],
      ['Restorative Discipline', 'Shifts school culture from punitive response to accountability and restoration — reduces suspensions and exclusionary discipline referrals'],
      ['Responding to Dysregulated Students', 'Practical de-escalation tools and co-regulation techniques for classroom teachers — what to do in the moment, not just after the fact'],
      ['Staff Resilience Workshop', 'Burnout prevention and vicarious trauma processing for educators — addresses the staff mental health crisis that drives turnover'],
      ['Improving Staff Culture', 'Organizational culture remediation for toxic staff environments — supports leadership teams managing interpersonal conflict and morale crises'],
      ['Wellness Rooms Program', 'Tier I universal mental health support — physical space and protocol that absorbs dysregulated students before counselor or admin referral'],
      ['Consultation & Technical Support', 'Bi-monthly coaching calls, classroom observations, and co-planning — implementation support that makes training stick'],
    ]
  ),
);

// ---------- 03 THE DISCIPLINE CRISIS & MENTAL HEALTH LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('The Discipline Crisis & Mental Health Landscape', TEAL, '03'),
  spacer(100),
  subHeader('The Problem ThriveWell Was Built to Solve'),
  p('California\'s K-12 schools are navigating an intersecting set of crises that compound each other: a student mental health emergency, a teacher burnout epidemic, and chronic over-reliance on exclusionary discipline that research consistently links to lower graduation rates and higher incarceration risk.'),
  buildTable(
    [{ label: 'Crisis', weight: 3 }, { label: 'Scale', weight: 2 }, { label: 'ThriveWell Program That Addresses It', weight: 4 }],
    [
      ['Student dysregulation & behavioral referrals', 'Suspension rates disproportionately impact students of color and students with IEPs', 'Restorative Discipline + Responding to Dysregulated Students'],
      ['Teacher burnout', '53% of teachers report burnout (RAND 2025); #1 driver is student behavior management (52%)', 'Staff Resilience Workshop + Improving Staff Culture'],
      ['Counselor overload', 'Counselor caseloads in many CA districts run well above the recommended ratio (ASCA recommends 1:250), and a large share of referrals are behavioral rather than clinical', 'Wellness Rooms Program creates Tier I buffer before counselor referral'],
      ['Vicarious trauma in staff', '78% of teachers cite insufficient administrative support (RAND 2025); high turnover follows', 'Foundations in Trauma + Staff Culture training for administrators'],
      ['School-to-prison pipeline', 'Research consistently links exclusionary discipline (suspension/expulsion) to lower graduation rates and higher justice-system involvement', 'The entire ThriveWell framework — root cause intervention'],
    ]
  ),
  spacer(200),
  subHeader('The Wellness Rooms Opportunity'),
  p('ThriveWell\'s Wellness Rooms program represents the most tangible, visible product in its portfolio. Unlike abstract professional development, a Wellness Room is a physical space students can enter — and a set of practices staff can point to when explaining the school\'s approach to behavior.'),
  p('The program creates a Tier I universal support system that absorbs dysregulated students before they reach the counselor\'s office or the principal\'s door. Students learn self-regulation and coping strategies. Staff learn to guide rather than simply refer. Data collection built into the program tracks behavioral patterns over time — giving district leaders the outcome evidence that justifies renewal and expansion.'),
  calloutBox(
    'Legislative Tailwinds (2025–2026)',
    [
      'Restorative Practices in Schools Act gaining traction in Congress (Bennet, Cohen) — creates federal mandate framing for ThriveWell\'s core approach.',
      'NIJ investing in restorative justice research — peer-reviewed validation is building.',
      'California increasingly mandating trauma-informed approaches in school discipline policy — districts need implementation partners, not just guidance documents.',
    ],
    TEAL
  ),
);

// ---------- 04 CALIFORNIA'S HISTORIC INVESTMENT WINDOW ----------
docChildren.push(
  ...sectionHeader('California\'s Historic Investment Window', CORE_BLUE, '04'),
  spacer(100),
  p('California has made an extraordinary commitment to children\'s behavioral health and school climate — creating the largest funding window in state history for exactly the kind of work ThriveWell delivers. Understanding how to access and align with these funding streams is among the highest-value moves ThriveWell can make in the next 12 months.'),
  buildTable(
    [{ label: 'Funding Source', weight: 3 }, { label: 'Scale', weight: 2 }, { label: 'Relevance to ThriveWell', weight: 4 }],
    [
      ['CYBHI + CCSPP (combined)', '~$8B combined', 'Children & Youth Behavioral Health Initiative and CA Community Schools Partnership Program — fund school-based mental health, wraparound services, and restorative practices'],
      ['LCFF Cost-of-Living Increase (FY2026)', '~$2.1B increase', 'Districts have expanded professional development budgets — discretionary'],
      ['Discretionary Block Grants (FY2026)', '~$1.7B one-time', 'ADA-based allocation; fully discretionary — ideal for wellness/PD contracts'],
      ['Title IV Part A (Federal)', 'Ongoing annual', 'Student support and academic enrichment — PD and school climate initiatives'],
      ['Federal / state SEL continuation grants', 'Competitive', 'Grants for districts expanding evidence-based SEL programs (amounts vary by program and year)'],
    ]
  ),
  spacer(200),
  calloutBox(
    'The Urgency: Federal Cuts Accelerate State Dependency',
    [
      'The federal administration has moved to cancel roughly $168M in school mental health grants previously committed (a reported figure; districts should confirm their own exposure).',
      'This creates an urgent shift: districts that were counting on federal dollars must now move faster to access state-level CYBHI and CCSPP funding — and they need credible partners who understand both the funding landscape and the implementation requirements.',
      'ThriveWell is positioned to help districts navigate this transition. With AI-assisted grant application support, ThriveWell can identify open funding opportunities, align program descriptions to grant criteria, and help districts build the outcome data that makes applications competitive.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  subHeader('California K-12 Market Demand Pools'),
  p('California has over 1,000 school districts. ThriveWell\'s serviceable market is not every district — it is the districts where the combination of funding access, equity urgency, and leadership readiness creates a high-probability buying environment. Five demand pools stand out:'),
  buildTable(
    [{ label: 'Demand Pool', weight: 3 }, { label: 'District Profile', weight: 3 }, { label: 'Entry Trigger', weight: 3 }],
    [
      ['CYBHI / CCSPP Grant Recipients', 'Any CA district awarded state behavioral health or community school funding — they now have earmarked dollars and a mandate to spend them on evidence-based programs', 'Grant award announcement; AI account intelligence monitors grant databases'],
      ['High Suspension / CA Dashboard Red', 'Districts flagged on CA Dashboard\'s Suspension & Expulsion indicator — under board pressure to show discipline reform', 'Annual CA Dashboard release (fall); board meeting public comment; news coverage'],
      ['New Superintendent / Cabinet Transition', 'New district leadership typically drives 90-day culture reset agenda — trauma-informed discipline is a flagship equity initiative for incoming superintendents', 'LinkedIn leadership change; EdSource / EdWeek district news; ACSA network'],
      ['Teacher Burnout / Retention Crisis', 'Districts with documented staff turnover, union grievances, or morale incidents — the Staff Resilience + Culture programs provide immediate relief', 'Staff survey scores; news coverage; district budget emergency declarations'],
      ['MTSS / PBIS Restructure', 'Districts rebuilding their Multi-Tiered Support System — Wellness Rooms and coaching fit directly into Tier I/II design', 'MTSS coordinator job posting; PBIS consultant engagement; district strategic plan'],
    ]
  ),
  spacer(200),
  p('The growth engine is not broadcasting to all 1,000 districts. It is monitoring the 50–100 districts at any moment where one or more of these triggers has fired — and reaching them with a credible, timely offer before they find a competitor.'),
);

// ---------- 06 CUSTOMER MAP — FIVE BUYER PERSONAS ----------
docChildren.push(
  ...sectionHeader('Customer Map — Five Buyer Personas', CORE_BLUE, '06'),
  spacer(100),
  p('ThriveWell\'s buyer journey spans five distinct stakeholder types, from the cabinet officer who approves the contract to the classroom teacher whose buy-in determines whether training sticks. Each requires a different message — and AI-assisted account intelligence can identify which personas are active at any given district.'),
  spacer(80),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'ThriveWell Buyer Personas', 600, 1.78),
  diagramCaption('Figure 1 — Five stakeholder personas across the district-to-classroom adoption chain'),
  spacer(120),
);

const personas = [
  {
    name: '1 — District Cabinet Champion',
    color: CORE_BLUE,
    fields: [
      ['Role', 'Superintendent, Assistant Superintendent, Cabinet Officer'],
      ['Primary goal', 'Board accountability on equity metrics; CA Dashboard performance; federal/state compliance'],
      ['Core pain', 'Public pressure on suspension rates; board directives for visible equity wins; fear of CDE intervention'],
      ['What triggers a conversation', 'New CYBHI/CCSPP grant awarded; board equity resolution passed; CA Dashboard red on Suspension & Expulsion'],
      ['What they want from a vendor', 'Research credibility, a proven outcome they can present to the board, and a partner who understands district politics'],
      ['ThriveWell\'s message', '"A comparable middle school reduced behavioral referrals by 70% in a single year. Here\'s how we replicate that across your district."'],
      ['Volume / Strategic Impact', 'Low volume (1 per district) — HIGH strategic value (drives multi-site adoption)'],
    ],
  },
  {
    name: '2 — Director of Student Services',
    color: CORE_BLUE,
    fields: [
      ['Role', 'Director of Student Services, Director of Pupil Services, Director of Special Education'],
      ['Primary goal', 'Reduce referrals to admin and counselors; build sustainable MTSS/PBIS Tier I support; protect counselor caseloads'],
      ['Core pain', 'Over-referred students absorbing counselor time; teachers who send every dysregulated student to the office; no Tier I buffer'],
      ['What triggers a conversation', 'New wellness/mental health budget; board mandate to reduce exclusionary discipline; MTSS restructure project'],
      ['What they want from a vendor', 'Evidence-based Tier I program with built-in data collection; coaching for staff, not just a one-time workshop'],
      ['ThriveWell\'s message', '"The Wellness Rooms program creates a Tier I buffer that absorbs dysregulated students before they reach your counselors — with data to show what\'s working."'],
      ['Volume / Strategic Impact', 'Medium volume — PRIMARY RFP champion (controls professional development budget allocation)'],
    ],
  },
  {
    name: '3 — Site Principal',
    color: TEAL,
    fields: [
      ['Role', 'School Principal, Assistant Principal'],
      ['Primary goal', 'Reduce office referrals; improve staff morale; build parent trust; survive the daily behavior management grind'],
      ['Core pain', 'Constant behavior management consuming leadership time; burnout spreading to admin; teacher turnover driven by lack of support'],
      ['What triggers a conversation', 'High suspension rates flagged by district; staff survey showing morale crisis; new PD day budget available'],
      ['What they want from a vendor', 'Training teachers can use Monday morning; ongoing support, not a one-and-done workshop; visible results for parent community'],
      ['ThriveWell\'s message', '"Strong Beginnings and Restorative Discipline give your staff tools they\'ll actually use — and we\'re there for the coaching afterward."'],
      ['Volume / Strategic Impact', 'High volume (1 per school) — site-level gatekeeper; drives staff adoption and contract renewal'],
    ],
  },
  {
    name: '4 — MTSS / Wellness Coordinator',
    color: TEAL,
    fields: [
      ['Role', 'School Counselor, School Psychologist, MTSS Coordinator, Mental Health Lead'],
      ['Primary goal', 'Evidence-based Tier I/II supports; reduce crisis-level referrals coming to them; build teacher capacity for dysregulation'],
      ['Core pain', '400+ caseloads; teachers send every dysregulated student directly to counselor; no universal prevention layer'],
      ['What triggers a conversation', 'MTSS restructure; wellness room budget available; outcome data showing referral spike to counselors'],
      ['What they want from a vendor', 'Research-grounded framework they can champion to administration; tools teachers will actually trust and use'],
      ['ThriveWell\'s message', '"We build the Tier I system that takes the crisis volume off your plate — and gives teachers what they need to co-regulate before students reach your door."'],
      ['Volume / Strategic Impact', 'Medium volume — evidence-based champion; often initiates the RFP or brings ThriveWell to the Director\'s attention'],
    ],
  },
  {
    name: '5 — Classroom Teacher',
    color: CORE_ORANGE,
    fields: [
      ['Role', 'K-12 Classroom Teacher (training end-user)'],
      ['Primary goal', 'Manage student behavior without constant referrals; get through the school year without burning out'],
      ['Core pain', '53% burnout rate (RAND 2025); vicarious trauma from students with ACEs; insufficient administrative support for dysregulated students'],
      ['What triggers a conversation', 'PD day mandated by district; new school year; personal crisis with a student behavior incident'],
      ['What they want from a vendor', 'Tools they can use immediately; practical de-escalation skills, not abstract theory; to feel supported, not judged'],
      ['ThriveWell\'s message', '"The de-escalation tools, circle techniques, and brain-based framework we teach are things you can use Monday morning — and we follow up to help you make them stick."'],
      ['Volume / Strategic Impact', 'Highest volume (20–40 per school) — NPS and adoption driver; teacher buy-in determines whether training produces lasting culture change'],
    ],
  },
];

personas.forEach((persona, i) => {
  if (i > 0) docChildren.push(spacer(200));
  docChildren.push(personaCard(persona.name, persona.color, persona.fields));
});

// ---------- 07 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', TEAL, '07'),
  spacer(100),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Landscape 2x2', 600, 1.78),
  diagramCaption('Figure 2 — ThriveWell\'s uncontested position: Trauma-Informed Depth + Implementation Coaching'),
  spacer(120),
  buildTable(
    [{ label: 'Competitor', weight: 3 }, { label: 'Focus', weight: 3 }, { label: 'Why ThriveWell Wins', weight: 4 }],
    [
      ['Panorama Education', 'SEL assessment & data analytics platform', 'Panorama measures school climate — it does not change it. ThriveWell changes the culture. Districts need both; Panorama is a complement, not a competitor.'],
      ['Care Solace', 'Mental health provider navigation', 'Connects families to therapists. Not professional development. Entirely different function — no head-to-head competition.'],
      ['Hazel Health', 'School-based telehealth therapy', 'Clinical service, not staff training. Districts need Hazel for high-acuity students and ThriveWell for universal Tier I prevention.'],
      ['Conscious Discipline', 'Brain-based discipline / SEL curriculum', 'SAMHSA evidence-based, adult-first approach — packaged curriculum without customized district implementation or the restorative justice / prison pipeline lens.'],
      ['7 Mindsets', 'Character development SEL curriculum', 'Off-the-shelf online curriculum. No trauma-informed coaching, no implementation support, no restorative justice depth.'],
      ['Responsive Classroom', '25-year SEL approach', 'General classroom management and SEL — respected but generic. No criminal justice research lens, no school-to-prison pipeline prevention framing.'],
      ['Second Step', 'Emotion recognition SEL curriculum', 'Widely adopted K-12 curriculum — commodity. Districts looking for cultural transformation, not another curriculum package, choose ThriveWell.'],
    ]
  ),
  spacer(200),
  calloutBox(
    'ThriveWell\'s Uncontested Position',
    'No competitor holds the combination of: (1) restorative justice AND trauma-informed practice AND school-to-prison pipeline prevention, (2) delivered through a PhD-credentialed practitioner who stays for coaching and technical assistance, (3) with a documented 70% referral reduction outcome. This is not a crowded market. This is an open field for the right partner to dominate.',
    CORE_ORANGE
  ),
);

// ---------- 08 BRAND & DIGITAL AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Audit', CORE_BLUE, '08'),
  spacer(100),
  buildTable(
    [{ label: 'Channel', weight: 2 }, { label: 'Current State', weight: 4 }, { label: 'Priority', weight: 2 }],
    [
      ['Website (thrivewellschools.com)', 'Professional and clear — "Schedule a Free Consultation" CTA is strong. Missing: outcome data prominently displayed, case studies, online training options, and a resource library that demonstrates Jennifer\'s research depth.', { text: 'Medium', color: CORE_ORANGE, bold: false }],
      ['SEO / Organic Search', 'Low visibility. No active content marketing pipeline. Districts searching "trauma-informed professional development California" likely do not find ThriveWell on page one.', { text: 'HIGH', color: 'C0392B', bold: true }],
      ['AI Search (Google SGE, Perplexity)', 'Not optimized for AI-generated answers. When district administrators ask AI assistants for restorative discipline consultants, ThriveWell does not appear.', { text: 'HIGH', color: 'C0392B', bold: true }],
      ['LinkedIn (Jennifer personal)', '464+ connections — good foundation but underutilized for thought leadership. Jennifer\'s publication and case study outcomes should be driving regular content.', { text: 'HIGH', color: 'C0392B', bold: true }],
      ['Instagram (@thrivewell_schools)', 'Active — good for brand awareness among educators. Limited for B2B district decision-maker audience.', { text: 'Medium', color: CORE_ORANGE, bold: false }],
      ['Substack (@thrivewellwithdrjenn)', 'Exists — underutilized. Jennifer\'s writing voice and research credibility are assets that deserve a larger audience.', { text: 'Medium', color: CORE_ORANGE, bold: false }],
      ['Case Studies / Outcome Data', 'The 70% referral reduction at a CA middle school is ThriveWell\'s most powerful marketing asset — and it is not prominently visible on the website, in search results, or in thought leadership content.', { text: 'HIGH', color: 'C0392B', bold: true }],
      ['Online Training Capability', 'No documented online or virtual delivery option. All programs appear to require Jennifer\'s in-person presence — a geographic and capacity constraint that limits scale.', { text: 'HIGH', color: 'C0392B', bold: true }],
    ]
  ),
  spacer(200),
  calloutBox(
    'The Digital Gap',
    [
      'ThriveWell\'s competitors — Panorama, Hazel Health, Care Solace — invest heavily in SEO, content marketing, and digital lead generation. They show up when district leaders search. ThriveWell currently does not.',
      'This is not a brand weakness — it is an infrastructure gap. Jennifer\'s credentials, outcomes, and approach are highly differentiated. The work is to build the digital presence that carries those differentiators into the conversations that matter.',
    ],
    CORE_BLUE
  ),
  spacer(200),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a district administrator asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:'),
  calloutBox('Prompt: "Who provides trauma-informed, restorative-discipline professional development for California school districts?"', [
    'TODAY — the AI assistant answers with whichever providers have the strongest content and third-party signals it can read: it names a few SEL curriculum vendors and assessment platforms, and does NOT mention ThriveWell or Dr. Lynn-Whaley — even though ThriveWell has the deepest restorative-justice and school-to-prison-pipeline lens and a documented 70% referral-reduction outcome. ThriveWell is invisible at the exact moment a district is forming its shortlist.',
    'AFTER AI Search Optimization — the same query returns ThriveWell as a cited option ("ThriveWell Schools, led by Dr. Jennifer Lynn-Whaley, PhD, delivers trauma-informed and restorative-discipline implementation coaching with a documented referral-reduction outcome…"), with the case study and resource library as the supporting evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class; the live result would be captured as a baseline at the start of the engagement.)', { italics: true, size: 18 }),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('Technijian\'s work with professional services firms and consulting organizations provides direct proof of the capabilities ThriveWell needs. The following builds illustrate what Technijian has delivered — and how each applies.'),
  spacer(80),
  capabilityBox(
    'Multi-Agency SEO + Authority Content System',
    'Built SEO content pipelines and authority content programs for professional services firms in regulated industries — including California state-regulated sectors — driving first-page rankings for competitive, long-tail searches in less than 90 days.',
    'Trauma-informed professional development is a specific, searchable need. District administrators Google it. Jennifer\'s credentials and outcome data make ThriveWell the strongest possible organic ranking candidate — once the content infrastructure exists to carry that credibility into search results.'
  ),
  spacer(140),
  capabilityBox(
    'AI Account Intelligence & Named-Account Monitoring',
    'Deployed AI-driven account intelligence systems that monitor named-account trigger events — leadership transitions, regulatory filings, budget announcements, public board actions — and surface them as outreach opportunities. Used by clients in government-adjacent professional services sectors.',
    'California school district trigger events are public information: CA Dashboard publications, grant announcements, ACSA conference speaker lists, board meeting minutes, EdSource coverage. Technijian\'s AI monitors these continuously and surfaces the 5–10 highest-priority district conversations each week for Jennifer to act on.'
  ),
  spacer(140),
  capabilityBox(
    'Grant Application AI & Funding Identification System',
    'Built AI-assisted grant writing and funding identification tools for nonprofit and public-sector clients — scanning federal and state grant databases, matching program descriptions to eligibility criteria, and auto-drafting narrative sections aligned to grant language.',
    'California\'s $8B funding landscape is navigable, but complex. Technijian\'s grant AI identifies open Title IV, CYBHI, CCSPP, and SEL continuation grants relevant to ThriveWell\'s programs, drafts application narratives from Jennifer\'s existing program descriptions, and helps districts understand how to fund ThriveWell engagements with existing wellness allocations.'
  ),
  spacer(140),
  capabilityBox(
    'Online Learning Platform & Outcome Dashboard',
    'Designed and built custom learning management systems and outcome measurement dashboards for training and professional development organizations — including live-virtual delivery, asynchronous content libraries, participant tracking, and real-time reporting for organizational clients.',
    'ThriveWell\'s in-person delivery model is Jennifer\'s current ceiling. An online training platform — built to ThriveWell\'s methodology, with Jennifer\'s recorded content, live virtual coaching sessions, and participant progress tracking — multiplies delivery capacity without multiplying travel. A school climate dashboard gives district leaders the data they need to justify contract renewal and expansion.'
  ),
  spacer(140),
  capabilityBox(
    'Thought Leadership & Research Amplification',
    'Transformed existing research publications, case studies, and practitioner frameworks into multi-channel content programs — LinkedIn authority series, Substack newsletters, speaking pitch decks, and media placement — for professional services clients with strong IP but limited digital distribution.',
    'Jennifer\'s "Neuroscience Behind Misbehavior" publication and the Antioch-area middle school case study are conversion-grade content waiting to be amplified. Technijian builds the content system that turns Jennifer\'s research credibility into inbound district conversations.'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across content, account intelligence, and grant support: won\'t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [{ label: 'Tier', weight: 1.7 }, { label: 'What It Does', weight: 3.3 }, { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER }],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — final brand-voice pass, research-credible claims, deepest reasoning', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — content, outreach personalization, grant-narrative drafts, summarization, scoring', { text: '~30–40%', color: TEAL }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — classification, extraction, enriching and tagging district records', { text: '~50–60%', color: BRAND_GREY }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: ThriveWell pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. For example, a single piece of authority content is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),
);

// ---------- 10 UNDERSTANDING AI — FIELD GUIDE ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for ThriveWell Schools Leadership', CORE_BLUE, '10'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where ThriveWell sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that Jennifer and the ThriveWell team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn\'t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft a grant-narrative section from this program description." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the district funding and leadership signals and flag what needs attention." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic\'s guidance on building AI systems) is to use the simplest thing that works. ThriveWell starts with simple automations that pay off in the first 90 days, and adds autonomous agents only where the value is proven — which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where ThriveWell Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most founder-led professional services firms — including ThriveWell — sit at the first or second rung of the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [{ label: 'Stage', weight: 1.6 }, { label: 'What It Looks Like', weight: 4 }, { label: 'ThriveWell Today', weight: 1.6, align: AlignmentType.CENTER }],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', color: CORE_BLUE }],
      [{ text: '2. Emerging', bold: true }, { text: 'AI used informally for occasional content or research, but not yet woven into how the practice grows or delivers', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — SEO content, account intelligence, grant support — with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and delivery with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the practice runs and competes', ''],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('ThriveWell is at the Emerging stage — using AI informally but not yet as growth infrastructure. This report is the plan to reach Operational — AI working in the growth engine and behind delivery — within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government\'s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For an organization that works inside schools and with student-adjacent data like ThriveWell, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [{ label: 'Risk', weight: 1.8 }, { label: 'What It Means', weight: 3.4 }, { label: 'How Technijian Controls It', weight: 3.4 }],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything district-facing or grant-bound — AI drafts, Jennifer approves'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — district records, outcome data, and student-behavior data never touch a public model'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, vendor, and data source — FERPA-aware, led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Organizations Are Already Doing', { color: CORE_BLUE }),
  bullet('Education consulting: professional development providers are using AI search optimization to become the cited answer when district leaders ask AI tools "who does trauma-informed PD in California?" — capturing demand competitors never see.'),
  bullet('Grant-funded services: organizations that depend on public funding are using AI to identify open grants and draft application narratives, responding to more opportunities with the same small team.'),
  bullet('Founder-led practices: solo and small expert consultancies are packaging their methodology into online and on-demand formats so delivery is no longer capped by one person\'s calendar.'),
  p('These are representative directions of travel across comparable organizations, not guarantees; ThriveWell\'s own numbers would be confirmed in discovery. Technijian\'s specific results from prior builds appear in Section 9 (Capability Proof).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — A ThriveWell District-Outreach Week', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: Jennifer hears about a district\'s new wellness funding by chance — a referral, a conference hallway, an email forward. She drafts each outreach note from scratch, researches the district\'s situation by hand, and chases grant deadlines from memory — all between delivering the actual coaching that pays the bills.',
    'WITH AI: A monitoring system surfaces the handful of California districts that just won CYBHI/CCSPP funding or changed superintendents this week; an AI assistant drafts a tailored note referencing that district\'s specific situation and the matching ThriveWell program; Jennifer reviews and sends. The same system flags grant deadlines and drafts narrative sections — so outreach happens consistently instead of only when she has a spare hour.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Path', weight: 1.6 }, { label: 'Reality', weight: 5 }],
    [
      ['DIY tools', 'Inexpensive, but ThriveWell assembles, secures, and governs everything — and owns the three risks above alone, on top of delivering client work'],
      ['Hire in-house', 'A capable AI/marketing leader typically costs $120K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); the widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 11 THE THRIVEWELL AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('The ThriveWell AI Growth Engine', TEAL, '11'),
  spacer(100),
  diagramImage(DIAGRAM_ARCH_BUF, 'ThriveWell AI Growth Architecture', 600, 1.78),
  diagramCaption('Figure 3 — Three-motion AI growth engine: Get Found, Win Districts, Scale & Serve'),
  spacer(120),
  subHeader('Motion 1: Get Found', { color: CORE_BLUE }),
  p('District administrators are actively searching for trauma-informed professional development, restorative discipline consultants, and school wellness programs. ThriveWell needs to show up when they search — in Google, in AI-generated answers, and in the professional networks where district leaders learn about vendors.'),
  buildTable(
    [{ label: 'Service', weight: 3 }, { label: 'What It Does for ThriveWell', weight: 6 }],
    [
      ['My SEO — Education Authority', 'Rank page-one for "trauma-informed professional development California," "restorative discipline consultant K-12," "school-to-prison pipeline prevention programs," "wellness rooms schools." Monthly content drives compounding organic visibility.'],
      ['AI Search Optimization (AEO)', 'Optimize for Google SGE, Perplexity, and district AI assistants. When a superintendent asks "who does restorative discipline PD in California?" — ThriveWell appears in the generated answer.'],
      ['Thought Leadership Amplification', 'Repurpose Jennifer\'s "Neuroscience Behind Misbehavior" paper into a 4-part LinkedIn series. Build a Substack content calendar. Submit speaking proposals to ACSA, CDE, and WestEd conferences.'],
    ],
    { headerColor: CORE_BLUE }
  ),
  spacer(160),
  subHeader('Motion 2: Win Districts', { color: TEAL }),
  p('Getting found brings inbound conversations. Winning districts requires outbound intelligence — knowing which 10 districts at any given moment have the funding, the urgency, and the leadership readiness to move. AI turns public data into a prioritized outreach list.'),
  buildTable(
    [{ label: 'Service', weight: 3 }, { label: 'What It Does for ThriveWell', weight: 6 }],
    [
      ['My AI Lead Gen — District Intelligence', 'Monitor named-account triggers: CYBHI/CCSPP grants awarded, superintendent transitions, CA Dashboard red flags, EdSource news coverage, ACSA conference attendance. Surface the top 10 district conversations each week.'],
      ['Grant Application AI', 'Identify open Title IV, CYBHI, SEL continuation grants. Auto-draft application narratives from Jennifer\'s program descriptions. Help districts use existing wellness allocations to fund ThriveWell engagements.'],
      ['Outcome Documentation System', 'Systematically collect referral rates, attendance data, and staff survey scores from every engagement. Build the evidence base that wins the next district — and justifies contract renewal at current ones.'],
    ],
    { headerColor: TEAL }
  ),
  spacer(160),
  subHeader('Motion 3: Scale & Serve', { color: CORE_ORANGE }),
  p('Jennifer\'s in-person model is ThriveWell\'s current ceiling. Online delivery and outcome dashboards break the geographic and capacity constraints — allowing ThriveWell to serve 3–5× more districts without 3–5× more travel.'),
  buildTable(
    [{ label: 'Service', weight: 3 }, { label: 'What It Does for ThriveWell', weight: 6 }],
    [
      ['ThriveWell Online Platform', 'Deliver Strong Beginnings, Trauma Foundations, and Staff Resilience as on-demand or live-virtual programs. Serve districts statewide — and eventually nationally — without Jennifer traveling.'],
      ['School Climate Analytics Dashboard', 'Real-time dashboard for district leaders: referral trends, wellness room utilization, staff survey scores, ADA correlation. Data that renews contracts and expands to additional school sites.'],
      ['My AI Fractional Advisor', 'Quarterly AI growth roadmap: which platforms to build next, which grants to pursue, how to package Jennifer\'s IP into a certifiable professional development track.'],
    ],
    { headerColor: CORE_ORANGE }
  ),
);

// ---------- 12 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '12'),
  spacer(100),
  subHeader('How the ROI Model Works'),
  p('ThriveWell\'s growth is measured by new district training and coaching contracts. Each district engagement is a multi-year relationship: an initial training contract, followed by ongoing coaching and technical support, and expansion to additional school sites. The investment figures below use Technijian\'s published service rates. District contract values are illustrative — Jennifer knows her own pricing; Technijian does not.'),
  spacer(120),
  calloutBox(
    'AI as a Managed Investment — Not a Leap of Faith',
    [
      'The reason most AI spending disappoints is rarely the technology — it is the lack of measurement. Surveys of business adopters consistently find that a majority of organizations now use AI in some form, but only a minority report a clear financial impact; the difference is discipline, not budget.',
      'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost — and if a pilot does not clear its cost at the gate, we stop and re-scope. ThriveWell carries the upside, not blind risk.',
    ],
    CORE_ORANGE
  ),
  spacer(120),
  calloutBox(
    'The Cost of Waiting',
    [
      'AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter ThriveWell is not cited, the assistants learn to answer "trauma-informed PD in California" with someone else — and that default, once set, is harder and more expensive to dislodge than to claim now.',
      'California\'s funding window is the same shape. The CYBHI/CCSPP dollars are being allocated now; the districts that find a credible partner first will spend them first. The cost of waiting is not zero — it is a competitor becoming the default answer, and a funding cycle spent elsewhere.',
    ],
    'C0392B'
  ),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day AI Visibility Pilot', { color: TEAL }),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up ThriveWell\'s AI-search and organic visibility, sharpens the AI growth strategy in a working session, and proves the lift before any larger build is discussed.'),
  buildTable(
    [{ label: 'Service', weight: 4 }, { label: 'Structure', weight: 3 }, { label: 'Y1 Investment', weight: 2 }],
    [
      [{ text: 'My SEO — Education Authority (Tier 2)', bold: true }, '$1,499/mo', '$17,988'],
      [{ text: 'My AI Executive Workshop', bold: true }, 'One-time', '$5,000'],
      [{ text: 'My AI Fractional Advisor — Starter', bold: true }, '$1,000/mo', '$12,000'],
      [{ text: 'TOTAL — Entry Phase', bold: true }, '', { text: '$34,988', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: TEAL }
  ),
  spacer(140),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, ThriveWell ranks on page one for at least one high-intent query (such as "trauma-informed professional development California") AND is cited by at least one major AI assistant (Google SGE, Perplexity, or ChatGPT) for a restorative-discipline / trauma-informed PD query.',
      'Our commitment: the entry program is month-to-month after the initial term — no long lock-in, no obligation to continue if it does not hit the metric by day 90. If the pilot has not moved the needle by then, we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('Full Growth Engine — Phase 2 (Y1+)', { color: CORE_BLUE }),
  buildTable(
    [{ label: 'Service', weight: 4 }, { label: 'Structure', weight: 3 }, { label: 'Y1 Investment', weight: 2 }],
    [
      [{ text: 'My SEO — Education Authority (from Phase 1)', bold: false }, '$1,499/mo', '$17,988'],
      [{ text: 'My AI Lead Gen — District Intelligence (Pro)', bold: true }, '$3,499/mo', '$41,988'],
      [{ text: 'My AI Fractional Advisor — Pro (upgrade)', bold: true }, '$2,000/mo', '$24,000'],
      [{ text: 'My Dev — ThriveWell Platform Build', bold: true }, 'Project', '$42,000'],
      [{ text: 'My Dev — Managed App Services', bold: true }, '$800/mo', '$9,600'],
      [{ text: 'TOTAL — Full Engine Y1', bold: true }, '', { text: '$135,576', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_BLUE }
  ),
  spacer(200),
  subHeader('ROI Scenarios'),
  p('The ROI model is built on new district training and coaching contracts secured as a result of Technijian\'s growth infrastructure. District contract values are placeholder figures — "TO CONFIRM with Jennifer" based on actual ThriveWell pricing.'),
  buildTable(
    [{ label: 'Scenario', weight: 2 }, { label: 'New Contracts Won', weight: 2 }, { label: 'Revenue Added (est.)', weight: 2 }, { label: 'Investment', weight: 2 }, { label: 'Multiple', weight: 2 }],
    [
      [{ text: 'Entry — Conservative', bold: false }, '1 new district', '$60K (est.)', '$34,988', { text: '1.7×', color: TEAL, bold: true }],
      [{ text: 'Entry — Expected', bold: false }, '2–3 new districts', '$120–$180K (est.)', '$34,988', { text: '3.4×–5.1×', color: TEAL, bold: true }],
      [{ text: 'Entry — Upside', bold: false }, '5+ districts', '$300K+ (est.)', '$34,988', { text: '8.5×+', color: TEAL, bold: true }],
      [{ text: 'Full Engine — Conservative', bold: false }, '3 districts + platform revenue', '$180K (est.)', '$135,576', { text: '1.3×', color: BRAND_GREY, bold: false }],
      [{ text: 'Full Engine — Expected', bold: false }, '6–8 districts + platform', '$360–$480K (est.)', '$135,576', { text: '2.7×–3.5×', color: CORE_ORANGE, bold: true }],
      [{ text: 'Full Engine — Upside', bold: false }, '12+ districts + online revenue', '$720K+ (est.)', '$135,576', { text: '5.3×+', color: CORE_ORANGE, bold: true }],
    ]
  ),
  spacer(200),
  calloutBox(
    'The Entry Case Makes Itself',
    [
      'At $34,988 for Year 1, a single new district engagement — at whatever ThriveWell charges for a full-year training and coaching contract — recovers the investment.',
      'The expected case is 2–3 new districts, which is a reasonable outcome from 12 months of SEO authority-building, AI-assisted account intelligence, and one executive workshop to sharpen Jennifer\'s AI growth strategy.',
      'The upside case — 5+ new districts plus the beginning of an online revenue stream — is the 12-month target if ThriveWell executes all three motions in sequence.',
    ],
    TEAL
  ),
);

// ---------- 13 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '13'),
  spacer(100),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'ThriveWell 90/180/365 Roadmap', 600, 1.78),
  diagramCaption('Figure 4 — 90-Day Foundation, 180-Day Acceleration, 365-Day Scale'),
  spacer(120),
  buildTable(
    [{ label: 'Phase', weight: 2 }, { label: 'Milestone', weight: 4 }, { label: 'Owner', weight: 2 }],
    [
      [{ text: 'Days 1–90', bold: true, color: CORE_BLUE }, 'My AI Executive Workshop — map ThriveWell\'s AI growth opportunity', 'Technijian + Jennifer'],
      ['Days 1–90', 'My SEO launch — keyword strategy, website optimization, content calendar', 'Technijian'],
      ['Days 1–90', 'Case study documentation — Antioch-area middle school outcome structured for web and content', 'Jennifer + Technijian'],
      ['Days 1–90', 'LinkedIn authority content — repurpose "Neuroscience Behind Misbehavior" into 4-part series', 'Technijian (Jennifer reviews)'],
      [{ text: 'Days 91–180', bold: true, color: TEAL }, 'My AI Lead Gen launch — district account intelligence, weekly priority list', 'Technijian'],
      ['Days 91–180', 'Grant application AI — identify 5–10 open CA/federal grants; draft narratives', 'Technijian + Jennifer'],
      ['Days 91–180', 'Outcome documentation system — build data collection cadence for active districts', 'Technijian + Jennifer'],
      ['Days 91–180', 'Online pilot — deliver one program virtually to a distant district; test and refine', 'Jennifer + Technijian'],
      [{ text: 'Days 181–365', bold: true, color: CORE_ORANGE }, 'ThriveWell Platform launch — on-demand and live-virtual program delivery', 'Technijian builds; Jennifer delivers'],
      ['Days 181–365', 'School Climate Analytics Dashboard — district-facing outcome measurement tool', 'Technijian'],
      ['Days 181–365', 'Statewide expansion — target 10–15 new districts via AI intelligence + SEO leads + conference pipeline', 'Jennifer + Technijian'],
      ['Days 181–365', 'Certification program design — package Jennifer\'s methodology as certifiable district coach track', 'Jennifer (Technijian supports)'],
    ]
  ),
);

// ---------- 14 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins', CORE_ORANGE, '14'),
  spacer(100),
  p('These actions require no contract and no budget — Jennifer can begin them this week. Each one builds the foundation that paid infrastructure accelerates.'),
  spacer(80),
  calloutBox('Quick Win 1 — Add the outcome data to the homepage',
    '"A California middle school reduced behavioral referrals by 70% after district-wide implementation." This one sentence, prominent on the homepage, changes the conversion rate of every visitor. Currently invisible on thrivewellschools.com.', CORE_BLUE),
  spacer(100),
  calloutBox('Quick Win 2 — Publish the case study',
    'Write a 600-word case study: the challenge, the intervention, the outcome. Post it to the website, Substack, and LinkedIn. This single piece of content will rank organically for "trauma-informed school results California" within 60 days.', CORE_BLUE),
  spacer(100),
  calloutBox('Quick Win 3 — LinkedIn authority content: 4-part series',
    'Repurpose the "Neuroscience Behind Misbehavior" paper into a 4-part LinkedIn series: (1) what ACEs do to the developing brain, (2) why punishment fails dysregulated students, (3) what co-regulation looks like in a classroom, (4) how the 70% outcome was achieved. Jennifer\'s 464+ connections are largely education professionals — the audience is already there.', TEAL),
  spacer(100),
  calloutBox('Quick Win 4 — Submit one ACSA or CDE conference speaking proposal',
    'Superintendents and district directors attend ACSA (Association of California School Administrators) conferences. A 30-minute session on "Breaking the School-to-Prison Pipeline: What One District Achieved in a Year" creates both visibility and credibility with the exact buyer ThriveWell needs.', TEAL),
  spacer(100),
  calloutBox('Quick Win 5 — Add an online inquiry form with intake questions',
    'Currently, thrivewellschools.com offers a "Schedule a Free Consultation" CTA. Adding 3 qualifying questions (district size, current challenge, budget cycle) to the intake form triples the information Jennifer gets from the first contact and allows better preparation for every discovery call.', CORE_ORANGE),
  spacer(100),
  calloutBox('Quick Win 6 — Claim a Google Business Profile for ThriveWell Schools',
    'A verified Google Business Profile for "ThriveWell Schools" in Berkeley, CA adds a local SEO anchor, enables Google reviews from past district clients, and surfaces ThriveWell in Google Maps results for K-12 education consultants in Northern California.', CORE_ORANGE),
);

// ---------- 15 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '15'),
  spacer(100),
  p('These discovery questions allow Technijian to refine the investment model, confirm the GTM motion, and identify the highest-priority first move. They are not requests for information ThriveWell is obligated to share — they are the questions that make the engagement more precise.'),
  buildTable(
    [{ label: '#', weight: 1 }, { label: 'Question', weight: 7 }, { label: 'Why It Matters', weight: 4 }],
    [
      ['1', 'How many active district clients does ThriveWell currently serve, and what does a typical engagement look like in terms of scope and duration?', 'Calibrates ROI model and defines what "capacity" means today'],
      ['2', 'What is the average contract value for a full-year training + coaching engagement?', 'Makes the ROI model precise — right now it uses illustrative placeholders'],
      ['3', 'Have any districts expressed interest in virtual or online delivery? Is there a waiting list of districts Jennifer cannot currently serve due to geography or calendar?', 'Determines urgency of online platform investment'],
      ['4', 'Has ThriveWell applied for any California wellness grants (CYBHI, CCSPP, Title IV) as an applicant or supported a district\'s application?', 'Calibrates grant AI priority and identifies quick grant wins'],
      ['5', 'Is the Antioch-area middle school case study available for public use with the school named, or should it remain anonymized?', 'Determines how prominently to feature the outcome in marketing materials'],
      ['6', 'What is the primary channel through which ThriveWell currently finds new district clients — referral, conference, or inbound search?', 'Determines whether SEO or account intelligence is the higher-priority first move'],
      ['7', 'Is there a target geography beyond California — other states, national expansion — in the 1–3 year plan?', 'Determines whether the platform needs to scale nationally or CA-first'],
    ]
  ),
);

// ---------- 16 QUESTIONS WE USUALLY GET (FAQ) ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '16'),
  spacer(120),
  p('The honest answers to the questions ThriveWell\'s leadership is most likely asking right now.'),
  spacer(100),
  buildTable(
    [{ label: 'Question', weight: 3 }, { label: 'Our Honest Answer', weight: 5 }],
    [
      [{ text: 'We work mostly by referral and word of mouth. Why add this now?', bold: true }, 'Referrals are a strength — keep them. What they cannot do is reach the districts that just won wellness funding or changed leadership this quarter and are searching right now. AI account intelligence and search visibility find those districts while the funding window is open, so referrals are no longer the only source of new work.'],
      [{ text: 'Isn\'t AI mostly hype right now?', bold: true }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — SEO content, account monitoring, grant-narrative drafts — not autonomous "agents" doing your job. We use the simplest tool that works, measure it, and only expand what earns its place.'],
      [{ text: 'Is district and student-behavior data safe?', bold: true }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything district-facing or grant-bound, led by a CISSP-certified team. Data governance is built into the engagement, FERPA-aware from day one.'],
      [{ text: 'It is mostly just me. Do I have the bandwidth to manage this?', bold: true }, 'The point is the opposite — to give you back hours and remove the geographic ceiling, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing what we draft. The fractional model means no new hire to manage.'],
      [{ text: 'What if it doesn\'t work?', bold: true }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 12), month-to-month with no long lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true }, 'The entry program is approximately $35K for Year 1 at published rates — no hidden fees, no large up-front build. The full engine (the later expansion, including the online platform) is profiled in Section 12, but only after the pilot proves the lift.'],
    ],
    { headerColor: CORE_BLUE }
  ),
);

// ---------- 17 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '17'),
  spacer(100),
  p('This blueprint is the starting point for a conversation — not a commitment. The next step is a 30-minute call to walk through the three motions, answer the calibration questions, and identify which move creates the most value fastest for ThriveWell.'),
  spacer(80),
  buildTable(
    [{ label: 'Step', weight: 1 }, { label: 'Action', weight: 4 }, { label: 'Timeline', weight: 2 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'Review this blueprint and identify any corrections or clarifications', 'This week'],
      [{ text: '2', bold: true, color: CORE_BLUE }, '30-minute discovery call with Technijian to walk through the three motions and answer calibration questions', 'This week / next week'],
      [{ text: '3', bold: true, color: TEAL }, 'Technijian scopes the entry package based on discovery conversation', 'Within 3 business days of call'],
      [{ text: '4', bold: true, color: TEAL }, 'My AI Executive Workshop — one day, maps ThriveWell\'s full AI opportunity', 'Day 1 of engagement'],
      [{ text: '5', bold: true, color: CORE_ORANGE }, 'My SEO launch — keyword strategy and first content pieces go live', 'Days 14–30'],
      [{ text: '6', bold: true, color: CORE_ORANGE }, 'Review 90-day SEO and content performance; decide on Phase 2 timing', 'Day 90'],
    ]
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to get ThriveWell found, seen, and funded?', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  rjain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 18 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '18'),
  spacer(100),
  p('Technijian is a California-based technology services firm serving businesses, nonprofits, and professional services organizations across the United States. Our work spans managed IT, cybersecurity, AI implementation, custom software development, and digital marketing — united by a commitment to technology as a solution, not a complication.'),
  p('We serve clients who need a partner that understands both the technology and the domain — a firm that can build the infrastructure, implement the AI, and understand why the restorative justice lens matters. Our team includes engineers, AI specialists, marketers, and developers who build for results, not for demos.'),
  buildTable(
    [{ label: 'Service Line', weight: 3 }, { label: 'What It Is', weight: 6 }],
    [
      ['My SEO', 'Authority SEO, AI search optimization, and thought leadership content — built for professional services firms with differentiated expertise'],
      ['My AI Lead Gen', 'AI-driven account intelligence and named-account monitoring — surfaces the right prospect at the right moment'],
      ['My AI Executive Workshop', 'One-day intensive: maps an organization\'s AI growth opportunity and produces a prioritized 12-month roadmap'],
      ['My AI Fractional Advisor', 'Ongoing strategic AI guidance — quarterly roadmaps, tool selection, vendor evaluation, implementation oversight'],
      ['My Dev', 'Custom software and platform development — LMS, dashboards, data tools, and web applications built to production quality'],
      ['My Dev Managed', 'Hosting, security, uptime, and maintenance for custom-built platforms — so Jennifer focuses on clients, not servers'],
      ['My IT / My Security', 'Managed IT and cybersecurity for professional services organizations — HIPAA-aware, compliance-ready infrastructure'],
    ]
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — rjain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
  spacer(120),
  p('"technology as a solution"', { bold: true, color: CORE_BLUE, align: AlignmentType.CENTER, size: 24 }),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources & References', BRAND_GREY, 'A'),
  spacer(100),
  p('Market and company intelligence gathered via public web research conducted June 2026. All financial projections, ROI models, and investment scenarios are illustrative estimates based on industry benchmarks and Technijian\'s published service rates. District contract values are placeholders — actual ThriveWell pricing was not available to Technijian at time of preparation. No guarantee of specific results is expressed or implied.', { italics: true }),
  spacer(120),
  p('1. ThriveWell Schools official website — thrivewellschools.com', { size: 20 }),
  p('2. Jennifer Lynn-Whaley, PhD — LinkedIn profile (retrieved 2026-06-08)', { size: 20 }),
  p('3. RAND Corporation — Teacher Burnout Survey 2025', { size: 20 }),
  p('4. PPIC — How California Is Investing in School-Based Mental Health Services for Teens (ppic.org)', { size: 20 }),
  p('5. Blue Shield of California — California Schools & Community Leaders Step Up for Youth Mental Health, June 2026', { size: 20 }),
  p('6. K-12 Mental Health Software Vendors, Pricing & Contracts 2026 — Civic IQ Blog (civiciq.com)', { size: 20 }),
  p('7. ORI Learning — SEL Grants for Schools 2026: Funding Sources & How to Apply', { size: 20 }),
  p('8. Youth Today — What Are Wellness Rooms and Why Do Schools Need Them? (October 2023)', { size: 20 }),
  p('9. IES Regional Education Laboratory Northwest — Using Restorative Practices in Schools (January 2025)', { size: 20 }),
  p('10. Oxford Academic — Trauma-Informed Restorative Justice Practices in Schools (Community Schools, Vol. 44, Issue 2)', { size: 20 }),
  p('11. Why Me? Restorative Services — Breaking the School-to-Prison Pipeline Through Restorative Practices (2025)', { size: 20 }),
  p('12. PublicSchoolReview.com — Public Schools Supporting Student Mental Health in 2026', { size: 20 }),
  p('13. Conscious Discipline — Methodology overview (consciousdiscipline.com)', { size: 20 }),
  p('14. Wallace Foundation — Navigating Social Emotional Learning Inside Out', { size: 20 }),
  p('15. Fomcore — Wellness Rooms in Schools: A Complete Guide', { size: 20 }),
  p('16. California Department of Education — LCFF Cost-of-Living Adjustment FY2026', { size: 20 }),
  p('17. EdSource — California school district wellness funding coverage (2025–2026)', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'TWS-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
