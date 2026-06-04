// Core Benefits Insurance Services Corp — AI Growth Blueprint
// Technijian-branded DOCX builder.
// Pattern adapted from Clients/EBRMD/build-ebrmd-report.js

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

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => {
  const p2 = path.join(DIAGRAMS_DIR, name);
  return fs.existsSync(p2) ? fs.readFileSync(p2) : null;
};
const DIAGRAM_PERSONAS_BUF    = dbuf('personas.png');
const DIAGRAM_ARCH_BUF        = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF    = dbuf('timeline.png');

const TODAY = '2026-06-03';

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

function sectionHeader(text, color = CORE_BLUE) {
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
    children: [new TextRun({ text, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
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
        children: [new Paragraph({ children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })] })],
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

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Core Benefits: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  });
}

function diagramImage(buf, altTitle, widthPx = 580, aspectRatio = 1.714) {
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth Blueprint  ·  Core Benefits', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
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

// ─────────────── COVER ───────────────
docChildren.push(
  colorBanner(CORE_BLUE, 240),
  spacer(700),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(500),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1800, 5760, 1800],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})],
  }),
  spacer(240),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Core Benefits Insurance Services Corp', size: 40, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'How AI Transforms Your Growth Strategy — and Why Now', size: 28, color: BRAND_GREY, font: FONT_BODY, italics: true })] }),
  spacer(360),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: `Prepared by Technijian  ·  ${TODAY}`, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: 'CONFIDENTIAL', size: 18, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
  spacer(800),
  colorBanner(CORE_ORANGE, 80),
  pageBreak()
);

// ─────────────── TOC ───────────────
docChildren.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 }, children: [new TextRun({ text: 'Table of Contents', size: 36, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  pageBreak()
);

// ─────────────── 01 EXECUTIVE SUMMARY ───────────────
docChildren.push(...sectionHeader('01 — Executive Summary'));
docChildren.push(spacer(160));
docChildren.push(
  kpiRow([
    { number: '37', label: 'Years serving OC employers', color: CORE_BLUE },
    { number: '$0', label: 'Annual AI investment today', color: CORE_ORANGE },
    { number: '42', label: 'LinkedIn followers — the gap', color: CRITICAL },
    { number: '31%', label: 'Benefits teams with full AI adoption', color: TEAL },
  ])
);
docChildren.push(spacer(200));
docChildren.push(
  p('Core Benefits has spent 37 years building the kind of employer-client relationships most boutique brokers spend their careers chasing. Timothy Johnson\'s clients stay — not for one renewal cycle, but for a decade. That is a durable competitive advantage, and it is exactly the foundation that an AI growth strategy builds on.'),
  p('The gap is not in service quality. The gap is in visibility, reach, and data-driven differentiation. Today, a prospective Orange County employer searching for a benefits broker who understands self-funding, PEO exits, and ACA compliance is far more likely to find Alliant, HUB, or Relational Advisors than Core Benefits — not because those firms are better, but because they have invested in the digital and analytical infrastructure that surfaces them first.'),
  p('This blueprint shows exactly how Technijian helps Core Benefits close that gap on two fronts simultaneously:')
);
docChildren.push(
  bullet('Growth — get found by the right OC employers at the right moment (AEO/SEO authority on compliance topics, account intelligence on named prospects, a CPA referral program, PEO-exit trigger monitoring)'),
  bullet('Delivery — weave AI into how Core Benefits actually serves clients (AI-powered renewal analysis, claims analytics dashboards, compliance auto-monitoring, employee FAQ chatbots) so every client gets more value from the same team')
);
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The Opportunity in One Sentence',
  'A 37-year firm with the deepest compliance expertise in OC has near-zero digital footprint — and zero AI-powered service delivery. The first boutique broker who closes that gap owns the segment.',
  CORE_BLUE
));

// ─────────────── 02 ABOUT CORE BENEFITS ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('02 — About Core Benefits'));
docChildren.push(spacer(160));
docChildren.push(
  p('Founded in 1989 by Timothy Johnson under the name "The Johnson Group" and rebranded as Core Benefits Insurance Services Corp in 2004, Core Benefits is one of Orange County\'s longest-standing independent employee benefits brokerage firms. With over three decades of experience serving small and mid-market employers, the firm has built a reputation for strategic, long-term partnership rather than transactional renewal management.'),
  p('Core Benefits\' approach — multi-year strategic planning, self-funding expertise, embedded compliance oversight, and hands-on PEO evaluation — positions the firm at the premium end of the boutique brokerage market. Client testimonials consistently describe the relationship as "a reliable friend, not just another agency," with retention relationships extending well over ten years.'),
  p('Technijian has proudly served Core Benefits\' IT infrastructure since December 2015. From network segmentation to the 3CX phone system migration, we have kept Core Benefits\' internal technology running reliably. This blueprint is the next chapter: applying that same partnership discipline to Core Benefits\' most important growth challenge.')
);
docChildren.push(spacer(120));
docChildren.push(subHeader('Core Benefits Service Architecture'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Service', weight: 2 }, { label: 'Description', weight: 3 }, { label: 'Relevance to AI', weight: 2 }],
  [
    ['Benefits Strategy & Consulting', 'Multi-year strategic planning; not reactive renewals', 'AI renewal analysis replaces manual multi-carrier comparison'],
    ['Self-Funding & Funding Strategy', 'Self-funded and alternative funding plan design', 'Claims analytics is the core differentiator in self-funded advisory'],
    ['Compliance & Risk Management', 'ACA, ERISA, COBRA, CAA embedded oversight', 'AI compliance monitoring reduces E&O exposure and staff hours'],
    ['Employee Education & Engagement', 'Open enrollment support, employee communications', 'AI FAQ chatbot deployed on employer portals handles routine questions 24/7'],
    ['Technology & HCM Consulting', 'Benefits + HR/payroll platform integration', 'Technijian My Dev builds the custom layer employers actually want'],
    ['PEO Evaluation & Exit Strategy', 'Moving clients off TriNet, Insperity, ADP TotalSource', 'AI trigger monitoring identifies PEO-exit timing for new prospects'],
    ['Voluntary & Ancillary Benefits', 'Accident, hospital indemnity, critical illness', 'Content engine builds authority in ancillary benefit topics for AEO'],
    ['Renewal Strategy & Cost Stabilization', 'Claims transparency, trend analysis, cost management', 'Claims Analytics Dashboard makes data-driven renewal the standard'],
  ]
));

// ─────────────── 03 THE EMPLOYER YOUR CLIENTS ARE ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('03 — The Employer You Serve: Four Buyer Personas'));
docChildren.push(spacer(160));
docChildren.push(
  p('Core Benefits\' target employer — Orange County companies with 50–300 employees — contains four distinct buyer types, each arriving with different pain, different budget authority, and a different trigger that opens the door. Understanding them precisely determines which AI plays land and which ones miss.'),
  p('The diagram below positions each persona by prospect volume (how many OC employers fit the profile) and estimated annual revenue to Core Benefits (broker commission income from the relationship):')
);
docChildren.push(spacer(100));
docChildren.push(diagramImage(DIAGRAM_PERSONAS_BUF, 'Employer Persona Matrix', 560, 1.714));
docChildren.push(diagramCaption('Figure 3.0 — Four Employer Personas: Prospect Volume × Annual Revenue to Core Benefits'));
docChildren.push(spacer(160));

// Persona 1
docChildren.push(personaCard(
  'Persona 1 — The HR Overwhelm',
  CORE_BLUE,
  [
    ['Role', 'HR Director or HR Manager at a 50–150 employee OC company — typically a one-person HR department'],
    ['Pain Points', '(1) Spending 15–20% of their time on benefits admin, enrollment questions, and carrier calls. (2) One annual renewal where they feel they are at the mercy of the broker\'s carrier relationships. (3) Compliance fear — "I don\'t know what I don\'t know about ACA." (4) Employees flooding them with "is my doctor in-network?" questions during open enrollment.'],
    ['Decision Driver', 'Responsiveness and a named contact who actually picks up the phone. Cost-per-hour of their own time is the real benchmark.'],
    ['AI Opportunity', 'An AI FAQ chatbot deployed on their HR portal eliminates 60%+ of routine employee benefits questions. AI compliance monitoring removes the ACA audit anxiety. The broker who delivers both wins the relationship.'],
    ['Technijian Hook', 'My Dev builds the chatbot layer on their existing HR/payroll platform. My AI Fractional Advisor trains the compliance monitoring system.'],
  ]
));
docChildren.push(spacer(160));

// Persona 2
docChildren.push(personaCard(
  'Persona 2 — The Cost-Driven CFO',
  CORE_ORANGE,
  [
    ['Role', 'CFO or CEO at a 75–300 employee OC company — approved the benefits budget and is watching it increase 15–20% every renewal cycle'],
    ['Pain Points', '(1) Annual renewal feels like a hostage situation: the carrier raises rates, the broker shows three alternatives, and every option is expensive. (2) No data — they receive carrier summary reports, not a claims intelligence story. (3) Rising costs are starting to impact headcount planning and competitive compensation. (4) Competitors are moving to self-funded plans; CFO does not know if it is right for them.'],
    ['Decision Driver', 'Data and cost-reduction proof. Show them a claims analytics deck at the first meeting and they will want a second meeting.'],
    ['AI Opportunity', 'AI claims analytics dashboard produces a "cost intelligence briefing" before every renewal — top 10 utilization drivers, trend projection, self-funding readiness score, recommended plan design adjustments. Turns a commodity renewal into a strategic advisory session.'],
    ['Technijian Hook', 'My Dev builds the Claims Analytics Portal. My AI Fractional Advisor designs the self-funding readiness model.'],
  ]
));
docChildren.push(spacer(160));

// Persona 3
docChildren.push(personaCard(
  'Persona 3 — The PEO Refugee',
  TEAL,
  [
    ['Role', 'Business owner or COO at a 100–300 employee company in the process of exiting TriNet, Insperity, ADP TotalSource, or Paychex PEO'],
    ['Pain Points', '(1) PEO costs have become opaque — the consolidated invoice masks what benefits actually cost vs. what the PEO margin is. (2) Plan flexibility is limited; the PEO\'s carrier relationships are not necessarily the best fit for their workforce. (3) The exit itself is administratively terrifying: new payroll setup, carrier applications, compliance transition, COBRA continuity. (4) They have been burned by the PEO\'s promise of "simplicity" and now want a broker who is transparent.'],
    ['Decision Driver', 'Trust and hands-on transition support. They are buying a guide through a high-stakes process, not just a plan selector.'],
    ['AI Opportunity', 'AI-assisted PEO transition checklist + compliance timeline. Document intelligence automates carrier applications. AI monitors the transition for gaps before they become penalties.'],
    ['Technijian Hook', 'My AI builds the PEO exit playbook with automated compliance monitoring. My Dev builds the transition management dashboard. Core Benefits wins the broker-of-record on exit day.'],
  ]
));
docChildren.push(spacer(160));

// Persona 4
docChildren.push(personaCard(
  'Persona 4 — The Compliance-Anxious Owner',
  CRITICAL,
  [
    ['Role', 'Business owner, controller, or CFO at a 50–150 employee OC company — often in manufacturing, professional services, or healthcare — who is aware enough of ACA exposure to be nervous, but not resourced enough to track every change'],
    ['Pain Points', '(1) ACA employer mandate: "Do we file 1095-Cs correctly? Are we full-time vs. part-time classified right?" (2) ERISA fiduciary duty: "Does our SPD say what it\'s supposed to say?" (3) CAA transparency: "I heard brokers now have to disclose their compensation — did our old broker tell us what they made?" (4) COBRA administration: "Are our former employees getting their notices on time?" Every line is a potential $2,500–$36,500/day penalty.'],
    ['Decision Driver', 'Peace of mind — provided by a broker who proactively flags issues before they become DOL audit targets, not after.'],
    ['AI Opportunity', 'AI compliance monitoring system tracks regulatory changes (PCORI fee deadlines, 1095-C filing windows, CAA disclosure requirements) and alerts both the broker and the client. Automated compliance calendar. AI-generated SPD gap review.'],
    ['Technijian Hook', 'My AI builds the compliance monitoring engine. My AI Fractional Advisor designs the alert workflow and client reporting cadence.'],
  ]
));

// ─────────────── 04 REGULATORY ARCHITECTURE ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('04 — Regulatory Architecture: The Compliance Advantage'));
docChildren.push(spacer(160));
docChildren.push(
  p('Employee benefits brokerage is one of the most regulated advisory relationships in American business. Every employer with 50+ full-time employees carries ongoing compliance obligations under at least five distinct federal frameworks — most of which have significant penalty exposures that HR staff at small and mid-market companies are not equipped to monitor independently. This regulatory burden is not a headache for Core Benefits; it is the firm\'s structural advantage.'),
  p('The broker who keeps employer clients safe from DOL audits, ACA penalties, and ERISA violations — proactively, with documentation — commands loyalty no transactional renewal-shopper can match. AI makes that proactive compliance layer scalable across every client relationship simultaneously.')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Framework', weight: 1.2 }, { label: 'What It Requires', weight: 2.2 }, { label: 'Penalty Exposure', weight: 1.3 }, { label: 'AI Solution', weight: 2 }],
  [
    ['ACA (Affordable Care Act)', 'Employer mandate (50+ FTEs), 1095-C annual filing, PCORI fee, MLR rebate distribution, minimum value/affordability compliance', '$2,570–$4,260 per FTE for mandate failures; $100/day per employee for reporting failures', 'AI-automated compliance calendar; penalty risk scoring; 1095-C data validation'],
    ['ERISA', 'Summary Plan Description (SPD) maintenance and distribution, Form 5500 annual filing, fiduciary duty documentation, claims procedure compliance', '$110/day for SPD failures; civil penalties for 5500 non-filing; personal liability for fiduciary breaches', 'AI document review of SPD gaps; automated 5500 deadline tracking; fiduciary duty audit trail'],
    ['COBRA', '60-day election notices to qualifying beneficiaries, premium billing accuracy, timely administration', '$110/day per qualified beneficiary for notice failures', 'AI-assisted COBRA event tracking; automated notice generation and audit log'],
    ['CAA 2021', 'Broker compensation disclosure (Form 5500 for 250+ participants), network adequacy requirements, reference-based pricing transparency, machine-readable plan files', 'Evolving; good-faith safe harbor available only for proactive disclosure', 'AI-generated compensation disclosure documents; machine-readable file automation'],
    ['HIPAA (Self-Funded)', 'PHI handling, Business Associate Agreements for self-funded plan sponsors, privacy notices, minimum necessary data standards', '$100–$50,000+ per violation; criminal penalties for willful neglect', 'AI-flagged HIPAA risk assessments; BAA tracking; data minimization audit'],
  ],
  { headerColor: DARK_CHARCOAL }
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The AI Compliance Wedge',
  [
    'Most boutique brokers deliver compliance reactively — they respond when a client surfaces a problem. The AI-powered compliance monitoring system Technijian builds for Core Benefits delivers proactive alerts: a client\'s COBRA notice window is closing in 72 hours; the PCORI fee deadline is in 14 days; a new CAA transparency rule takes effect January 1st.',
    'This is not incremental improvement — it is a category shift from reactive broker to proactive compliance partner. Every competitor who stays manual is conceding this ground.',
  ],
  CORE_BLUE
));

// ─────────────── 05 COMPETITIVE LANDSCAPE ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('05 — Competitive Landscape'));
docChildren.push(spacer(160));
docChildren.push(
  p('The Orange County employee benefits market includes five national firms with significant OC presence and three boutique competitors who occupy the same employer-size lane as Core Benefits. The competitive reality in 2026: the national firms have capital, platform, and scale; the boutiques have relationships and agility. The broker who adds AI analytics to boutique-grade service is positioned to take share from both.')
);
docChildren.push(spacer(120));
docChildren.push(subHeader('Tier 1 — National Firms with Orange County Presence'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Competitor', weight: 1.2 }, { label: 'OC Footprint', weight: 1.2 }, { label: 'Strengths', weight: 1.8 }, { label: 'Weakness vs. Core Benefits', weight: 1.8 }],
  [
    ['Alliant Insurance Services', 'Newport Beach HQ (#5 US broker nationally)', 'Deep specialty practices, native OC, national data analytics platform', 'Enterprise-only focus; boutique accounts receive less hands-on service; high minimum account size'],
    ['HUB International', 'Irvine + Newport Beach offices; acquired Invensure 2022', 'P&C + EB + HR under one roof; national resources', 'Post-acquisition churn risk; not a boutique relationship model; account transitions disrupt advisory continuity'],
    ['The Baldwin Group (ex-Burnham Benefits)', 'Irvine heritage; national rollup', '8 CA offices at peak; recognized Best Places to Work for culture', 'Brand dilution after Baldwin acquisition; clients frequently lose primary advisor contact; national platform vs. local expertise'],
    ['Lockton Pacific Series', 'Irvine + San Diego + Los Angeles', 'Employee-owned (no PE pressure), deep analytics, specialty verticals', 'Minimum account size thresholds exclude most sub-100 EE accounts; not a boutique play'],
    ['Newfront', 'SoCal presence + national', 'Modern platform, data transparency, strong VC/tech company niche', 'Pricing premium; less suited for manufacturing/medical clients; tech-startup-oriented service model'],
  ],
  { headerColor: CORE_BLUE }
));
docChildren.push(spacer(160));
docChildren.push(subHeader('Tier 2 — Boutique OC Brokers (Direct Competitive Set)'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Competitor', weight: 1.2 }, { label: 'Location', weight: 0.8 }, { label: 'Scale', weight: 0.8 }, { label: 'Key Differentiator', weight: 1.5 }, { label: 'AI / Digital Posture', weight: 1.5 }],
  [
    ['Relational Advisors', 'Irvine', '14–15 staff', 'EB + retirement + HR services integrated; community engagement (OC Food Bank, A21); 8–23 yr experience per advisor', 'Stronger LinkedIn presence than COB; growing digital content; most direct direct competitor by profile'],
    ['Ernstam & Lewis Insurance', 'Irvine', 'Small boutique', 'Founded 1983; benefits-only focus; preferred broker for Family Winemakers of CA; commission-only model', 'Minimal digital content; no evident AI analytics play'],
    ['Benefit Consulting Group', 'Huntington Beach', 'Very small', 'Direct geographic overlap in the South OC corridor', 'No visible digital presence or analytics positioning'],
  ],
  { headerColor: DARK_CHARCOAL }
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'The White Space No Competitor Owns',
  [
    'Zero boutique competitors in Orange County have invested in AI-powered claims analytics, automated compliance monitoring, or a systematic employer account intelligence engine. The national firms have analytics infrastructure but deploy it for enterprise accounts, not the 50–300 employee mid-market that Core Benefits serves.',
    'The broker who arrives at the renewal meeting with an AI-generated claims intelligence briefing — top 10 utilization drivers, self-funding readiness score, projected trend modeling, compliance risk flags — is doing something no boutique competitor currently does in this market. First-mover advantage compounds: the employer-clients who experience this level of data-driven service will not switch back to a carrier-comparison spreadsheet.',
  ],
  CORE_ORANGE
));

// ─────────────── 06 BRAND & DIGITAL PRESENCE AUDIT ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('06 — Brand & Digital Presence Audit'));
docChildren.push(spacer(160));
docChildren.push(
  p('Core Benefits\' digital presence today does not reflect the quality of the firm\'s work. This is common among boutique brokers who have grown entirely through relationships and referrals — the clients know how good Core Benefits is; the employers who have not yet experienced that relationship have no way to find out. The audit below maps the current gap and the opportunity it represents.')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Channel', weight: 1.2 }, { label: 'Current State', weight: 1.8 }, { label: 'Benchmark / Gap', weight: 2 }, { label: 'Priority', weight: 0.8 }],
  [
    ['LinkedIn', '42 followers (verified Jun 2026)', 'Relational Advisors: 200+; Alliant: 10,000+. Gap to peer boutiques: 5× minimum. OC HR Directors and CFOs are on LinkedIn daily.', { text: 'CRITICAL', color: CRITICAL, bold: true }],
    ['Google Business Profile', 'Unverified / unclaimed for "employee benefits broker" search', 'Every active broker firm in OC has a claimed, optimized GBP. Missing GBP means zero map-pack visibility for 72% of employer searches that include a location modifier.', { text: 'CRITICAL', color: CRITICAL, bold: true }],
    ['Website Content Authority', 'Service pages strong; compliance thought leadership absent', 'AEO opportunity: "ACA 2026 employer mandate guide," "CAA broker compensation disclosure," "self-funded health plan Orange County." Zero current content for any of these high-intent searches.', { text: 'HIGH', color: CORE_ORANGE, bold: true }],
    ['Blog / Content Cadence', 'No active content program visible', 'Benefits compliance changes generate 3–5 content opportunities per quarter (PCORI fee, 1095-C deadline, CAA filing). Competitors who publish these own the search and AI citation results.', { text: 'HIGH', color: CORE_ORANGE, bold: true }],
    ['AI Search Citations (GEO)', '0% — not cited by ChatGPT, Perplexity, or Google AI Overviews for any OC benefits query', 'AI search tools now answer 30–40% of informational queries before users visit a website. A broker not cited by AI tools is invisible to the fastest-growing search channel.', { text: 'HIGH', color: CORE_ORANGE, bold: true }],
    ['Client Reviews / Social Proof', 'No verified public review platform; Yelp page exists but returns 403 error', '37 years of satisfied employer clients represent hundreds of potential reviews. A systematic ask campaign is the highest-ROI 30-day action available.', { text: 'MEDIUM', color: TEAL, bold: true }],
    ['Email Newsletter', 'No evidence of regular employer communications', 'Existing clients + CPA referral partners are a captive audience for monthly compliance updates. The newsletter is also the cheapest content distribution channel.', { text: 'MEDIUM', color: TEAL, bold: true }],
  ],
  { headerColor: DARK_CHARCOAL }
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'Why the Digital Gap Matters Now',
  [
    'Benefits broker switching is low-frequency but high-stakes. Employers switch brokers at renewal — typically every 3–5 years — triggered by a cost shock, a service failure, or a compelling introduction from a CPA or peer. The broker who is visible and credible when that trigger moment arrives wins the account. Without a digital presence, Core Benefits is invisible during the research phase that precedes every introduction.',
    'The compounding risk: Relational Advisors and Newfront are actively building content and LinkedIn presence in the same OC employer market. Every month they publish and Core Benefits does not widens the authority gap. AEO content authority, once established, is extremely sticky — AI tools cite sources that have been authoritative for 12+ months, making early investment the highest-returning timing.',
  ],
  CORE_BLUE
));

// ─────────────── 07 TECHNIJIAN CAPABILITY PROOF ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('07 — Technijian Capability Proof'));
docChildren.push(spacer(160));
docChildren.push(
  p('Technijian does not propose generic AI capabilities — every engagement is built on proven delivery. The builds below are directly applicable to Core Benefits\' growth and delivery challenges. Most critically: Technijian has already built technology for Core Benefits. The network infrastructure and 3CX phone system running in Costa Mesa today are Technijian builds. The next chapter is AI.'),
);
docChildren.push(spacer(160));

docChildren.push(capabilityBox(
  'Proven Build: Core Benefits IT Infrastructure (Active Client Since 2015)',
  'Designed and implemented the Core Benefits network segmentation architecture (separating Cisco PBX from the core network) and migrated the firm from an end-of-life Cisco UC540 PBX to a fully operational 3CX phone system.',
  'The existing infrastructure relationship means Technijian already understands Core Benefits\' operating environment, team size, and workflow requirements. The AI layer builds on that foundation — no discovery-from-scratch, no ramp-up period. We know the office. We know the team. We build the next layer together.'
));
docChildren.push(spacer(160));

docChildren.push(capabilityBox(
  'Proven Build: AI Document Intelligence for FINRA Broker-Dealers',
  'Deployed AI-driven document intelligence to auto-populate complex vendor questionnaires for FINRA-registered broker-dealers. RFP response time reduced from days to minutes; 60–80% less manual review required.',
  'The same document intelligence capability applies directly to Core Benefits\' highest-volume manual workflows: carrier applications during PEO exits, ACA 1095-C data compilation, ERISA SPD gap reviews, and CAA compensation disclosure documentation. What took 3 days of manual research takes 4 hours with AI.'
));
docChildren.push(spacer(160));

docChildren.push(capabilityBox(
  'Proven Build: Multi-Agent SEO + AEO Platform',
  'Architected a multi-agent platform integrating Claude, GPT-4o, and Gemini with MCP servers for SEMrush, GA4, Perplexity, Firecrawl, and social distribution. ~70% reduction in content production time; full AEO optimization for AI search engine citations.',
  'Benefits compliance content — ACA deadlines, ERISA guidance, CAA transparency requirements — is exactly the type of authoritative, evergreen content that AI search engines (ChatGPT, Perplexity, Google AI Overviews) cite. My SEO with AI Search Optimization puts Core Benefits in those citations ahead of every boutique competitor in OC.'
));
docChildren.push(spacer(160));

docChildren.push(capabilityBox(
  'Proven Build: AI-Native Application Development (My Dev)',
  'Designed and delivered production-grade custom applications on .NET 8 + React under Technijian\'s AI-Native SDLC v7.0, 3–5× faster than traditional development cycles. Used across healthcare, financial services, and professional services clients.',
  'The Claims Analytics Dashboard and AI Renewal Analysis tool Core Benefits needs are custom applications — not off-the-shelf software that every competitor also uses. My Dev builds the exact tool, configured for Core Benefits\' carrier relationships, client data structure, and reporting preferences. This becomes a proprietary competitive advantage, not a shared platform.'
));
docChildren.push(spacer(160));

docChildren.push(capabilityBox(
  'Proven Build: Enterprise Knowledge & Compliance Systems',
  'Implemented Weaviate and Obsidian.md hybrid memory for enterprise AI agents; built security-first AI design with RBAC, audit trails, and HIPAA/SOC 2/PCI-DSS compliance built into every solution.',
  'Core Benefits\' compliance monitoring system — tracking ACA, ERISA, COBRA, and CAA deadlines across every client account — is exactly the kind of institutional knowledge system Technijian has built for regulated industries. HIPAA compliance built in from day one protects Core Benefits\' self-funded clients and their PHI.'
));

// ─────────────── 08 HOW AI TRANSFORMS CORE BENEFITS' GROWTH ENGINE ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('08 — How AI Transforms Core Benefits\' Growth Engine'));
docChildren.push(spacer(160));
docChildren.push(
  p('Core Benefits is an account-based business. The firm does not need more leads — it needs to be the first call when an OC employer decides to change brokers. That moment is triggered by three events: a painful renewal, a PEO exit, or an introduction from a trusted CPA or peer. The AI growth engine below is designed to intercept all three channels simultaneously, while AI-powered service delivery gives every existing client a reason to stay and expand.')
);
docChildren.push(spacer(160));
docChildren.push(diagramImage(DIAGRAM_ARCH_BUF, 'Core Benefits AI Growth Engine Architecture', 560, 1.714));
docChildren.push(diagramCaption('Figure 8.0 — Three-Channel AI Growth Engine: Authority Content · Account Intelligence · AI Service Delivery'));
docChildren.push(spacer(200));

docChildren.push(subHeader('Channel 1 — Get Cited: Inbound Content Authority'));
docChildren.push(spacer(100));
docChildren.push(
  p('The OC employer who is frustrated with their current broker, evaluating a PEO exit, or nervous about ACA compliance does not call three brokers and ask for proposals. They search. They ask ChatGPT. They read LinkedIn posts from people they respect. Core Benefits needs to be the answer to those searches, citations, and posts — before any competing broker is invited into the conversation.'),
);
docChildren.push(spacer(80));
docChildren.push(buildTable(
  [{ label: 'AI Tool', weight: 1.2 }, { label: 'Use Case', weight: 2 }, { label: 'Impact Metric', weight: 1.5 }, { label: 'Technijian Service', weight: 1.5 }],
  [
    ['AEO Content Engine', 'AI generates authoritative compliance articles: "ACA 2026 employer mandate changes," "CAA broker compensation disclosure guide," "self-funded health plan Orange County" — content AI search tools cite', '0 → 10+ monthly AI search citations for OC benefits compliance queries in 90 days', 'My SEO Tier 2 + AI Search Optimization'],
    ['LinkedIn Thought Leadership', 'Weekly compliance insights (ACA deadlines, ERISA tips, CAA updates) written in TJ\'s voice, targeting OC HR Directors and CFOs. Systematic comment engagement builds warm relationships before any outreach.', '42 → 500+ LinkedIn followers in 90 days; 3–5 warm employer introductions per quarter via LinkedIn', 'My SEO content calendar + My AI'],
    ['Google Business Profile Optimization', 'Claim and fully optimize the COB GBP for "employee benefits broker Orange County," "health insurance broker Costa Mesa," "ACA compliance broker OC" — captures the search traffic that currently finds competitors', 'First-page map pack appearance for core local search terms within 60 days', 'My SEO Tier 2 base + GBP management'],
    ['PR & Content Syndication', 'Quarterly compliance briefings distributed to 300+ outlets; FOX/ABC/NBC affiliate placements; builds domain authority and cements Core Benefits as OC\'s go-to compliance source', '300+ live placements per quarter; measurable domain authority increase within 6 months', 'My SEO PR add-on ($150/mo)'],
  ]
));
docChildren.push(spacer(200));

docChildren.push(subHeader('Channel 2 — Win the Account: Outbound Intelligence'));
docChildren.push(spacer(100));
docChildren.push(
  p('An account-based growth strategy does not spray outreach at a broad market — it monitors named targets for the precise moment their situation changes and delivers a timely, relevant signal to the right contact. This is where AI gives Core Benefits an asymmetric advantage: the ability to track 50–100 OC employer accounts simultaneously for trigger events that no human team could monitor manually.')
);
docChildren.push(spacer(80));
docChildren.push(buildTable(
  [{ label: 'AI Tool', weight: 1.2 }, { label: 'Use Case', weight: 2 }, { label: 'Impact Metric', weight: 1.5 }, { label: 'Technijian Service', weight: 1.5 }],
  [
    ['Employer Account Intelligence', 'AI monitors 50–100 named OC employers (50–300 EE) for trigger signals: job postings with "benefits" or "open enrollment" keywords, Glassdoor reviews complaining about benefits, LinkedIn leadership changes in HR or Finance', '5 → 20+ employer prospect engagements per quarter; better timing on every outreach', 'My AI Fractional Advisor'],
    ['CPA Referral Program AI', 'Harvest and score 50–100 OC CPA firms whose SMB client portfolios align with Core Benefits\' employer sweet spot. AI drafts personalized outreach in TJ\'s voice, framed around compliance topics CPAs care about (ACA penalty exposure, ERISA audit risk)', '0 → formal referral relationships with 10+ OC CPA firms in 180 days', 'My AI Fractional Advisor'],
    ['PEO Exit Trigger Monitoring', 'AI monitors TriNet, Insperity, ADP TotalSource, and Paychex client signals: Glassdoor "PEO frustration" reviews, LinkedIn posts about HR transitions, industry forum complaints — surfaced as hot-prospect alerts to TJ', '3–5 PEO-exit prospects identified per quarter; broker-of-record on first call', 'My AI Fractional Advisor'],
    ['Pre-Meeting Account Dossiers', 'Before every prospect call, AI assembles an employer profile: estimated headcount, industry vertical, likely current carrier mix, LinkedIn profiles of HR Director and CFO, any visible compliance gaps (public GBP review text, Glassdoor benefits mentions)', 'Every prospect call starts with intelligence; conversion rate from first call to second meeting improves', 'My AI Fractional Advisor'],
  ]
));
docChildren.push(spacer(200));

docChildren.push(subHeader('Channel 3 — Keep & Expand: AI-Powered Service Delivery'));
docChildren.push(spacer(100));
docChildren.push(
  p('The most powerful retention tool in benefits brokerage is the gap between what clients experience from Core Benefits and what they would experience switching to a transactional competitor. AI-powered service delivery makes that gap insurmountable — every client gets claims intelligence, compliance monitoring, and a 24/7 employee support layer that no boutique competitor currently offers.')
);
docChildren.push(spacer(80));
docChildren.push(buildTable(
  [{ label: 'AI Tool', weight: 1.2 }, { label: 'Use Case', weight: 2 }, { label: 'Impact Metric', weight: 1.5 }, { label: 'Technijian Service', weight: 1.5 }],
  [
    ['Claims Analytics Dashboard', 'Replace carrier-comparison spreadsheets with an AI claims intelligence briefing: top 10 utilization drivers, trend projection, self-funding readiness score, recommended plan design adjustments — delivered before every renewal meeting', 'Renewal meetings shift from transactional to strategic; retention rate target: 95%+; 3× more employer-client referrals from satisfied data story experience', 'My Dev (Claims Analytics Portal)'],
    ['AI Renewal Analysis', 'Multi-carrier rate comparison + trend modeling in hours not days. TJ\'s analysis time drops 80%+; every employer client receives a data-backed recommendation with documented rationale', '3-day manual renewal analysis → 4-hour AI-assisted analysis; capacity to add 30%+ more employer clients without adding staff', 'My Dev + My AI Fractional Advisor'],
    ['ACA / ERISA Compliance Auto-Monitor', 'AI tracks regulatory changes (CAA filings, PCORI fee deadlines, 1095-C windows, ERISA plan document updates) and sends proactive alerts to both Core Benefits and the relevant employer clients', 'Zero missed compliance deadlines; measurable reduction in E&O exposure; Core Benefits positioned as "compliance safety net," not just a plan selector', 'My AI Fractional Advisor'],
    ['Employee Benefits FAQ Chatbot', 'Deployed on each employer-client\'s HR portal: answers "what does my plan cover?", "is my doctor in-network?", "how do I submit a claim?" — reducing HR admin calls by 60%+ during open enrollment', '60%+ reduction in routine HR call volume for client employers; increases perceived value of Core Benefits relationship; sticky service anchor', 'My Dev'],
  ]
));

// ─────────────── 09 BUSINESS IMPACT & SERVICE INVESTMENT ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('09 — Business Impact & Service Investment'));
docChildren.push(spacer(160));

docChildren.push(subHeader('KPI Lift: What Changes at Core Benefits'));
docChildren.push(spacer(100));
docChildren.push(buildTable(
  [{ label: 'Metric', weight: 2 }, { label: 'Current State', weight: 1.5 }, { label: 'Projected (Y1)', weight: 1.5 }, { label: 'AI Driver', weight: 2 }],
  [
    ['Employer prospects engaged per quarter', '~5 (relationship + referral dependent)', '20+ (AI account intelligence + content authority)', 'Account intelligence + LinkedIn content + CPA referral engine'],
    ['Time to renewal analysis (per client)', '2–3 days (manual carrier comparison)', '4 hours (AI-assisted multi-carrier analysis)', 'My Dev AI Renewal Analysis tool'],
    ['Compliance monitoring hours per month', '~25 hrs (manual tracking across all clients)', '~5 hrs (AI-automated alerts + client notifications)', 'My AI compliance monitoring engine'],
    ['LinkedIn followers / content reach', '42 followers; near-zero organic reach', '500+ followers; 3,000–5,000 monthly impressions', 'My SEO content calendar + AI Search Optimization'],
    ['AI search citations (GEO)', '0 citations for any OC benefits query', '10+ monthly citations in ChatGPT, Perplexity, Google AI Overviews', 'My SEO AI Search Optimization add-on'],
    ['Client renewal retention rate', 'Strong (long-term relationships)', '95%+ formalized with data-driven renewal service standard', 'Claims Analytics Dashboard + compliance monitoring'],
    ['New employer clients per year', 'Referral-dependent (estimated 1–2/yr)', '3–5 projected (AI-assisted pipeline + digital authority)', 'Full AI growth engine'],
  ]
));
docChildren.push(spacer(200));

docChildren.push(subHeader('Y1 ROI Model (vs. Entry Program)'));
docChildren.push(spacer(100));
docChildren.push(
  p('The ROI model below is structured against the Entry Program investment only — the conservative, low-commitment first phase. Core Benefits\' broker revenue from each new employer relationship is estimated conservatively; actual commissions depend on group size and carrier mix (confirmed at discovery).'),
  p('Average annual broker commission per new 100-employee OC employer group: $25,000–$60,000/year. The model uses $40,000 as the expected midpoint.')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Scenario', weight: 1.2 }, { label: 'New Employers Added (Y1)', weight: 1.2 }, { label: 'Projected Annual Revenue Increase', weight: 1.8 }, { label: 'ROI vs. $30K Entry', weight: 1.2 }, { label: 'Notes', weight: 1.8 }],
  [
    [{ text: 'Downside-Protected', color: BRAND_GREY, bold: true }, '1 new employer', '$25K–$40K (single group, ~75 EE)', { text: '0.8×–1.3×', color: BRAND_GREY, bold: false }, 'Single referral-driven win + content investment compounding for Y2'],
    [{ text: 'Expected', color: CORE_BLUE, bold: true }, '2–3 new employers', '$50K–$120K (avg. $40K per employer)', { text: '1.7×–4.0×', color: CORE_BLUE, bold: true }, 'Account intelligence + CPA referral program delivering introductions'],
    [{ text: 'Upside', color: PASS, bold: true }, '4+ new employers', '$160K+ (compounding with staff-hours recovered)', { text: '5.3×+', color: PASS, bold: true }, 'Full growth engine + AI delivery freeing TJ for business development vs. manual renewal analysis'],
  ],
  { headerColor: DARK_CHARCOAL }
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'Lead with the Expected Case',
  'A 2–3 employer gain in Year 1 — with the account intelligence engine and CPA referral program operational by month 6 — is a conservative expected outcome for an established firm with Core Benefits\' relationship quality and market position. The 1.7×–4.0× return against the Entry Program investment is the honest headline. The upside scenario (4+ employers) unlocks as the staff hours recovered via AI renewal analysis and compliance monitoring free TJ to spend more time on business development, not manual analysis.',
  CORE_BLUE
));
docChildren.push(spacer(200));

docChildren.push(subHeader('Service Investment Map — Land-and-Expand'));
docChildren.push(spacer(100));
docChildren.push(
  p('The investment structure below is sequenced for maximum ease of first commitment. Phase 1 (ENTRY) contains only recurring services and a one-time workshop — no large build required, no long-term engineering risk. Phase 2 (EXPANSION) adds the custom My Dev applications once the entry program has proven the lift.')
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Technijian Service', weight: 2 }, { label: 'Tier / Scope', weight: 1.8 }, { label: 'Monthly Investment', weight: 1.2 }, { label: 'Y1 Total', weight: 1.2 }],
  [
    [{ text: 'PHASE 1 — ENTRY PROGRAM', color: CORE_BLUE, bold: true }, { text: '', bold: false }, { text: '', bold: false }, { text: '', bold: false }],
    ['My SEO', 'Tier 2 (SEO Optimization) + AI Search Optimization add-on + PR Releases add-on', '$1,100/mo', '$13,200'],
    ['My AI', 'Executive AI Workshop (1× upfront) — Core Benefits team + roadmap design', '—', '$5,000'],
    ['My AI', 'Fractional AI Advisor (Starter: account intelligence setup + compliance monitoring)', '$1,000/mo', '$12,000'],
    [{ text: 'ENTRY PROGRAM SUBTOTAL', color: CORE_BLUE, bold: true }, { text: '', bold: false }, { text: '$2,100/mo', color: CORE_BLUE, bold: true }, { text: '$30,200', color: CORE_BLUE, bold: true }],
    [{ text: 'PHASE 2 — EXPANSION (once entry proves lift)', color: CORE_ORANGE, bold: true }, { text: '', bold: false }, { text: '', bold: false }, { text: '', bold: false }],
    ['My Dev', 'Claims Analytics Portal + AI Renewal Analysis Tool (fixed-scope build)', '—', '$45,000–$65,000 (Phase 2)'],
    ['My Dev', 'Managed App Services (post-build maintenance + enhancements)', '$800/mo', '$9,600'],
    ['My AI', 'Fractional AI Advisor expanded (4 hrs/mo: roadmap + portal oversight + compliance)', '$2,000/mo', '$24,000'],
    [{ text: 'FULL ENGINE TOTAL (entry + expansion, Y1)', color: DARK_CHARCOAL, bold: true }, { text: '', bold: false }, { text: '', bold: false }, { text: '~$109K–$129K', color: DARK_CHARCOAL, bold: true }],
  ],
  { headerColor: CORE_BLUE }
));
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'Entry Program Is the Ask — Expansion Is the Reward',
  'The $30,200 Entry Program requires no engineering engagement and no large up-front commitment. My SEO builds the content authority engine; the My AI Workshop establishes the AI roadmap; the Fractional Advisor starter sets up the account intelligence and compliance monitoring systems. The full-engine number ($109K–$129K) is the expansion that follows once the entry proves the lift — it is the upsell, not the opening ask.',
  CORE_ORANGE
));

// ─────────────── 10 IMPLEMENTATION ROADMAP ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('10 — Implementation Roadmap'));
docChildren.push(spacer(160));
docChildren.push(
  p('The roadmap below is paced to Core Benefits\' capacity — a 2–10 person firm where every implementation step needs to deliver value immediately without overwhelming the team. Each phase is designed to prove its own ROI before the next phase begins, which is why the Claims Analytics Portal (the largest build) does not start until the entry program is operational and the data story is established.'),
);
docChildren.push(spacer(120));
docChildren.push(diagramImage(DIAGRAM_TIMELINE_BUF, 'Core Benefits Implementation Timeline', 560, 2.857));
docChildren.push(diagramCaption('Figure 10.0 — Three-Phase Implementation: Foundation → Intelligence → Growth'));
docChildren.push(spacer(160));

docChildren.push(buildTable(
  [{ label: 'Phase', weight: 1 }, { label: 'Timeframe', weight: 0.8 }, { label: 'Milestones', weight: 3 }, { label: 'Outcome', weight: 1.5 }],
  [
    ['Phase 1 — Foundation', 'Days 1–90',
      '(1) Website SEO audit + on-page optimization for core compliance keywords. (2) AI Search Optimization layer deployed for AEO coverage. (3) Google Business Profile claimed and fully optimized. (4) LinkedIn content calendar launched — weekly compliance insights in TJ\'s voice. (5) Executive AI Workshop with Core Benefits team. (6) Claims data baseline established for 3 pilot employer clients.',
      'Core Benefits is visible and credible online for the first time. Compliance content assets begin compounding.'],
    ['Phase 2 — Intelligence', 'Days 90–180',
      '(1) Account intelligence engine operational — monitoring 50 named OC employer targets. (2) CPA referral outreach program launched (25 priority CPA firms). (3) PEO exit trigger monitoring live. (4) First AI-powered renewal analysis delivered to pilot clients. (5) ACA/ERISA compliance auto-monitoring deployed across active client base. (6) Pre-meeting dossier template operational for every prospect call.',
      'Pipeline intelligence active — Core Benefits receives timely signals for the right outreach at the right moment.'],
    ['Phase 3 — Growth', 'Days 180–270',
      '(1) Claims Analytics Portal development begins (My Dev). (2) First 1–2 new employer clients onboarded through AI-assisted pipeline. (3) Employee FAQ chatbot piloted on 2 employer-client HR portals. (4) Content authority metrics visible in AI search citations (ChatGPT, Perplexity, Google AIO). (5) CPA referral program delivering qualified introductions. (6) Expansion plan reviewed: portal rollout + upgraded Fractional AI Advisor engagement.',
      'New employer client acquisition in motion. Claims portal underway. Full competitive moat forming.'],
  ],
  { headerColor: CORE_BLUE }
));

// ─────────────── 11 QUICK WINS ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('11 — Quick Wins: What Core Benefits Can Do This Week'));
docChildren.push(spacer(160));
docChildren.push(
  p('These six actions require no contract, no budget approval, and no technology purchase. Each one delivers value immediately and creates momentum toward the larger AI growth program. As an existing Technijian client, Core Benefits has a standing resource for step 1 at no additional cost.')
);
docChildren.push(spacer(120));

const quickWins = [
  ['1', 'Claim Your Free Nexus Assess', CORE_BLUE, 'As an active Technijian client, Core Benefits qualifies for a complimentary Nexus Assess — a full IT risk assessment covering internal vulnerability scanning, external vulnerability + dark-web credential check, and a Microsoft 365 environment review, delivered as a prioritized remediation roadmap. This is the natural conversation-starter for refreshing the IT relationship and setting the stage for the AI program.'],
  ['2', 'Claim + Optimize Google Business Profile', CORE_ORANGE, 'Search "Core Benefits Insurance Services" in Google Maps and claim the listing if unclaimed. Add all services, update hours, upload team photos, write a benefits-specific description using keywords like "employee benefits broker Orange County," "ACA compliance," and "self-funded health plans." This is a 2-hour action that changes local search visibility immediately.'],
  ['3', 'Post One Compliance Insight on LinkedIn This Week', TEAL, 'Write a 150-word LinkedIn post about one ACA or CAA compliance topic that OC HR Directors or CFOs should know right now (the 2026 PCORI fee, CAA transparency disclosure requirements, or ACA affordability percentage update). Post from TJ\'s personal LinkedIn. Tag 3 local HR contacts. This starts the content engine with zero cost and creates the first piece of authority content.'],
  ['4', 'Set Four Google Alerts', DARK_CHARCOAL, 'Create Google Alerts for: "PEO exit Orange County," "employee benefits broker RFP California," "TriNet cancel," and "Insperity alternative Orange County." These surface hot-prospect signals within hours of publication. No cost. Takes 10 minutes. Provides a steady stream of market intelligence that most boutique brokers never see.'],
  ['5', 'Email 10 Longest-Tenured Employer Clients', CORE_BLUE, 'Send a personal email (not a bulk blast) to Core Benefits\' 10 longest-tenured clients asking for a LinkedIn recommendation. The exact phrasing: "I value our relationship and am working to share Core Benefits\' capabilities with more OC employers. Would you be willing to write a brief LinkedIn recommendation? It takes about 5 minutes and it would mean a great deal." Every recommendation becomes a permanent piece of social proof.'],
  ['6', 'Identify Three Missing Content Pillars on corebenefits.org', CORE_ORANGE, 'Review the current website against three high-intent OC employer searches: "self-funded health plan guide," "PEO exit checklist California," and "ACA 2026 employer compliance checklist." If none of these pillar pages exist, these are the first three content priorities for My SEO. Document the gaps and send to Technijian — we will build the content brief in the first week of engagement.'],
];
for (const [num, title, color, body] of quickWins) {
  docChildren.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [600, CONTENT_W - 600],
      borders: noBorders,
      rows: [new TableRow({ cantSplit: true, children: [
        new TableCell({
          width: { size: 600, type: WidthType.DXA },
          shading: { fill: color, type: ShadingType.CLEAR },
          borders: noBorders,
          margins: { top: 120, bottom: 120, left: 0, right: 0 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: num, size: 60, bold: true, color: WHITE, font: FONT_HEAD })] })],
        }),
        new TableCell({
          width: { size: CONTENT_W - 600, type: WidthType.DXA },
          borders: noBorders,
          shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 200, right: 200 },
          children: [
            new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text: title, size: 24, bold: true, color, font: FONT_HEAD })] }),
            new Paragraph({ spacing: { after: 0, line: 300 }, children: [new TextRun({ text: body, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
          ],
        }),
      ]})],
    })
  );
  docChildren.push(spacer(120));
}

// ─────────────── 12 CONCLUSION + CTA ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('12 — Conclusion: The Growth Window Is Open'));
docChildren.push(spacer(160));
docChildren.push(
  p('Core Benefits is in an unusual and valuable position: a 37-year firm with durable employer-client relationships, deep compliance expertise, and a fully operational technology infrastructure — with essentially zero AI investment and near-zero digital presence. In most industries, that gap would be a slow threat. In benefits brokerage, where boutique brokers compete on trust and relationships, it is a specific, correctable opportunity.'),
  p('The boutique broker who combines Core Benefits\' advisory depth with an AI-powered content authority engine, account intelligence system, and claims analytics delivery layer will win accounts that the national firms cannot serve with enough attention and that the transactional boutiques cannot serve with enough sophistication. That is the exact gap this blueprint is designed to close.'),
  p('The entry program — My SEO content authority + My AI account intelligence and compliance monitoring — is a $30,200 Year 1 investment designed to generate its own ROI before a single engineering dollar is spent on the Claims Analytics Portal. The portal comes in Phase 2, once the data story is established and the new employer pipeline is moving.'),
  p('Technijian has been Core Benefits\' infrastructure partner for over a decade. This blueprint is the proposal to extend that partnership to the growth layer — applying the same standards, the same reliability, and the same client-first approach that we have brought to your network and phone systems to the business development challenge that matters most right now.'),
);
docChildren.push(spacer(160));
docChildren.push(calloutBox(
  'Next Step',
  [
    'I\'d love 30 minutes to walk you through this blueprint and the entry program in more detail.',
    'Use the Book-a-Meeting link in my signature to set up a time — we can discuss this blueprint and all the AI strategies Technijian is deploying for itself and its clients right now.',
  ],
  CORE_ORANGE
));

// ─────────────── ABOUT TECHNIJIAN ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('About Technijian'));
docChildren.push(spacer(160));
docChildren.push(
  p('Founded in 2000 by Ravi Jain, Technijian is a full-spectrum IT services company serving small and mid-sized businesses with managed IT, cybersecurity, cloud infrastructure, AI consulting, and custom software development. With offices in Irvine, California and Panchkula, India, Technijian provides 24/7 support through a dedicated Technijians pod model — the same team, every engagement.'),
);
docChildren.push(spacer(120));
docChildren.push(buildTable(
  [{ label: 'Service', weight: 1.5 }, { label: 'Description', weight: 3 }, { label: 'Relevant to Core Benefits', weight: 2 }],
  [
    ['My AI', 'AI strategy, implementation, and Fractional AI Advisor retainers. Hands-on delivery from discovery through production deployment.', 'Account intelligence engine, compliance monitoring, renewal analysis, CPA referral AI'],
    ['My SEO', 'SEO + AEO content engine with AI Search Optimization, PR syndication, and Google Business Profile management. 12-month programs.', 'Compliance content authority; AI citation coverage; LinkedIn thought leadership'],
    ['My Dev', 'Custom application development on .NET 8 + React, 3–5× faster under AI-Native SDLC v7.0. Production-grade, no prototypes.', 'Claims Analytics Portal; AI Renewal Analysis tool; Employee FAQ Chatbot'],
    ['Managed IT', '24/7 managed IT services, cybersecurity (CrowdStrike), cloud, and compliance frameworks. Core Benefits\' infrastructure since 2015.', 'Existing partnership; Nexus Assess free for active clients'],
  ]
));
docChildren.push(spacer(160));
docChildren.push(buildTable(
  [{ label: 'Contact', weight: 1 }, { label: 'Detail', weight: 2 }],
  [
    ['Ravi Jain', 'Founder & CEO  ·  rjain@technijian.com'],
    ['Phone', '949.379.8499'],
    ['Website', 'technijian.com'],
    ['USA HQ', '18 Technology Dr., Ste 141, Irvine, CA 92618'],
    ['India Delivery Center', 'Plot No. 07, 1st Floor, Panchkula IT Park, Panchkula, Haryana 134109'],
    ['Tagline', 'technology as a solution'],
  ],
  { headerColor: DARK_CHARCOAL, zebra: true }
));

// ─────────────── APPENDIX ───────────────
docChildren.push(spacer(100));
docChildren.push(...sectionHeader('Appendix — Works Cited'));
docChildren.push(spacer(160));
const citations = [
  'Core Benefits Insurance Services Corp, corebenefits.org — Company overview, services, case studies (accessed June 2026)',
  'Core Benefits LinkedIn company page, linkedin.com/company/corebenefits — Follower count, team profiles (accessed June 2026)',
  'Alliant Insurance Services, alliant.com/employee-benefits — OC EB practice overview (accessed June 2026)',
  'HUB International — Irvine office, hubinternational.com/offices/us/california/irvine/ (accessed June 2026)',
  'The Baldwin Group (Burnham Benefits legacy), baldwin.com/about-us/burnham-benefits/ (accessed June 2026)',
  'Lockton Pacific Series, lockton.com — Pacific Series employee benefits practice (accessed June 2026)',
  'Newfront Insurance, newfront.com — Tech-forward brokerage profile (accessed June 2026)',
  'Relational Advisors, relational.com/about/ — OC boutique competitive profile (accessed June 2026)',
  'Ernstam & Lewis Insurance Services, ernstam.com/employee-benefits (accessed June 2026)',
  'Benefit Consulting Group, Huntington Beach — Yelp listing, yelp.com (accessed June 2026)',
  'PIHRA South Orange County Chapter, pihra.org/find-pihra-chapters/pihra-south-orange-county/ — HR professional network data (accessed June 2026)',
  'CFH: "How AI Is Transforming Employee Benefits Administration in 2026," cfhic.com — AI adoption statistics (accessed June 2026)',
  'Employee Benefit News: "How These AI Tools Are Supporting Benefit Leaders," benefitnews.com (accessed June 2026)',
  'Deloitte: AI in Human Capital 2025 — 67% of HR leaders report AI improving efficiency',
  'Selerix ACA Compliance Module, selerix.com/solutions/aca-software/ — Benefits admin AI overview (accessed June 2026)',
  'Technijian brand-tokens.json, services/My SEO/assets/my-seo-content.txt, services/My AI/assets/my-ai-content.txt (internal, 2026)',
  'Technijian CRM — Core Benefits client record: Contract IDs 4213, 4549, 4551; client since 2015-12-29 (internal)',
];
citations.forEach((c, i) => {
  docChildren.push(new Paragraph({
    numbering: { reference: 'citations', level: 0 },
    spacing: { before: 40, after: 80, line: 280 },
    children: [new TextRun({ text: c, size: 18, color: BRAND_GREY, font: FONT_BODY })],
  }));
});

// =====================================================================
// ASSEMBLE DOCUMENT
// =====================================================================
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, numFmt: 'bullet',
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 440, hanging: 280 } } },
        }],
      },
      {
        reference: 'citations',
        levels: [{
          level: 0, numFmt: 'decimal',
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 440, hanging: 280 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      heading1: { run: { size: 2, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 0, after: 0 } } },
      heading2: { run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD }, paragraph: { spacing: { before: 280, after: 120 } } },
    },
    paragraphStyles: [
      { id: 'Normal', name: 'Normal', run: { size: 22, color: BRAND_GREY, font: FONT_BODY } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1800, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    titlePage: true,
    children: docChildren,
  }],
});

const OUT_DIR = __dirname;
const DOCX_PATH = path.join(OUT_DIR, 'COB-AI-Growth-Report.docx');

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(DOCX_PATH, buf);
  console.log(`✓ DOCX written: ${DOCX_PATH}`);
}).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
