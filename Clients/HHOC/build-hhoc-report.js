// Housing for Health Orange County (DBA Housing for Health California) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/VAF/build-vaf-report.js (SCF/ORX/MWAR/RKE lineage).
// Capability Proof uses built-vs-service labels per feedback_capability_proof_built_vs_service.

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
const CLIENT = 'Housing for Health';

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

// kind = 'built' (delivered case study) | 'service' (productized service we offer)
function capabilityBox(title, built, applies, kind = 'built') {
  const leadLabel = kind === 'service' ? 'The Technijian Service: ' : 'What Technijian Built: ';
  const leadColor = kind === 'service' ? TEAL : CORE_BLUE;
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({
        width: { size: 80, type: WidthType.DXA },
        shading: { fill: leadColor, type: ShadingType.CLEAR },
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Housing for Health: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'HOUSING FOR HEALTH', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Orange County  —  A CalAIM Housing & Health Nonprofit', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California  |  housingforhealthca.org', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Housing for Health', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '2022', label: '501(c)(3) Since', color: CORE_BLUE },
    { number: '2,412', label: 'Members Served in 2024', color: CORE_ORANGE },
    { number: '92%', label: 'Kept Permanent Housing', color: TEAL },
    { number: '39%', label: 'Increased Income (Day Hab)', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('Housing for Health is a CalAIM provider: it delivers Enhanced Care Management and the housing Community Supports — navigation, deposits, tenancy and sustaining services, day habilitation, and short-term post-hospitalization housing — to Medi-Cal members experiencing or at risk of homelessness in Orange County, and it bills the Medi-Cal managed care plan for that work. By its own reporting it served 2,412 members in 2024, with 92% of tenancy clients keeping permanent housing. It is also building toward a larger role: a platform that helps other front-line providers deliver the same services to the same standard.'),
  p('For an organization like this, growth means two things — capturing the funding it has already earned, and serving more people. Both are gated by the same operational reality. Every Medi-Cal dollar flows through a managed-care-plan contract and is released only on a clean claim, and plans are widely reported to be slow to pay community organizations on anything that is not. So the highest-value move is not chasing new money; it is collecting cleanly and completely on the services already being delivered, and freeing care managers to serve more people.'),
  p('This blueprint is a focused, account-based program with three moves: capture revenue (clean-claim and documentation automation that recovers what is owed and speeds payment), serve more people (faster intake and caseload optimization so the same team reaches more members), and win and comply (the outcomes reporting that wins contract renewals and grants, plus the HIPAA and 42 CFR Part 2 compliance the work requires). Every part of it that touches client information is HIPAA-safe by design.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Capture, don’t chase. With CalAIM startup subsidies ending and grants tightening, the highest-return move is collecting cleanly and completely on services Housing for Health is already entitled to bill — clean claims, recovered denials, faster payment.',
      'Serve more people. Caseload economics are set by the Medi-Cal rate; optimizing caseloads and speeding intake lets the same team reach more members — the mission and the margin move together.',
      'AI must be HIPAA-safe — and that is the point. Any system touching member information runs under a Business Associate Agreement on private, enterprise endpoints, with no client data sent to public AI tools and a person reviewing every decision. Doing AI the compliant way is what a Medi-Cal-funded organization requires.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: Housing for Health’s internal numbers (current Medi-Cal claims volume, denial rate, days to payment, caseload, and current financials) were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call — the specific questions are in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE CALAIM MODEL ----------
docChildren.push(
  ...sectionHeader('The CalAIM Model — How Housing for Health Is Funded', CORE_BLUE, '02'),
  spacer(100),
  p('A growth plan has to start with how the money actually moves, because in CalAIM the flow is specific and the friction is predictable. A referral source — a hospital discharge, the county Coordinated Entry System, or the health plan’s own high-utilizer list — sends an eligible Medi-Cal member to Housing for Health. Housing for Health delivers Enhanced Care Management and the housing Community Supports, then bills the member’s Medi-Cal managed care plan. The plan pays — and that final step is where revenue leaks, through slow payment and denials on anything that is not a clean claim.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The CalAIM Funding Model', 600, 1.73),
  diagramCaption('Figure 2.0 — How Housing for Health is funded: a referral becomes a member, services are delivered, the plan is billed, and payment follows'),
  spacer(120),
  subHeader('What Gets Delivered, and How It Pays'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'What It Is', weight: 4 },
      { label: 'How It Pays (Representative)', weight: 3.2 },
    ],
    [
      ['Housing Transition Navigation', 'Assessment, housing search, applications, landlord engagement, move-in', 'Per-member-per-month (assumes a set caseload)'],
      ['Housing Tenancy & Sustaining', 'Eviction prevention, dispute resolution, lease compliance — keep the housing', 'Per-member-per-month (a tighter caseload)'],
      ['Housing Deposits', 'Security and utility deposits, first month’s rent, basic setup (up to ~$5,000)', 'One-time, against documentation'],
      ['Short-Term Post-Hospitalization Housing', 'Interim housing for members leaving a hospital or institution', 'Per diem'],
      ['Enhanced Care Management (ECM)', 'Whole-person care coordination through a single lead care manager', 'Per-member-per-month'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Caseload Is the Margin',
    [
      'The per-member-per-month rates bake in an assumed caseload. Staff below that ratio and the rate does not cover the cost to serve; staff above it and quality and audit risk climb. Caseload accuracy is, quite literally, the margin.',
      'A mix of payment models — per-member-per-month, per diem, and one-time — means each service has its own billing rules, and each is a place a claim can be denied or delayed if the documentation is not exactly right.',
      'Housing for Health also supports partner organizations (the emerging platform role), so the same discipline that collects cleanly for its own programs becomes something it can extend to a network.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE GROWTH EQUATION ----------
docChildren.push(
  ...sectionHeader('The Growth Equation', TEAL, '03'),
  spacer(100),
  p('Housing for Health grows three ways, and each is gated by something operational that AI can address — within a strict HIPAA-safe boundary. This is the spine the rest of the plan hangs on.'),
  spacer(140),
  buildTable(
    [
      { label: 'Growth Lever', weight: 2.4 },
      { label: 'What Gates It Today', weight: 4 },
      { label: 'The AI Play (HIPAA-safe)', weight: 3.6 },
    ],
    [
      ['Capture earned revenue', 'Denials and slow payment on claims that are not perfectly clean; documentation gaps', 'Clean-claim generation, documentation completeness checks, denial detection and resubmission'],
      ['Serve more people', 'A finite care-management team; intake and eligibility are manual; caseloads set the ceiling', 'Faster referral intake and eligibility screening; caseload optimization to the rate'],
      ['Win & deepen funding', 'Renewals and grants require outcomes the team reports by hand; RFPs are easy to miss', 'Automated outcomes reporting; account intelligence on plans/counties; RFP and grant discovery'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Why the Equation Favors Acting Now',
    [
      'The CalAIM startup subsidies that funded program launch have ended, and federal and state homelessness grants are volatile — so collecting cleanly on the services already delivered matters more than ever.',
      'A new billable service, Transitional Rent, became a required offering in 2026 — a fresh line to capture for an organization ready to bill it cleanly.',
      'Capacity-building funding under CalAIM’s PATH initiative is designed to pay for exactly this kind of billing, data, and readiness work — so a meaningful part of the program may be grant-offsettable through 2026.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 FUNDING & REGULATORY LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Funding & Regulatory Landscape', CORE_BLUE, '04'),
  spacer(100),
  p('Two forces shape the next few years, and both reward the organization that runs cleanly and compliantly. The funding environment is shifting from subsidized launch to self-sustaining operations, and the regulatory environment is heavy — which is both the burden AI removes and the constraint AI must respect.'),
  spacer(140),
  subHeader('Funding Forces (2024–2026)'),
  buildTable(
    [
      { label: 'Force', weight: 2.6 },
      { label: 'What’s Happening', weight: 4 },
      { label: 'Implication for Housing for Health', weight: 3.4 },
    ],
    [
      ['Subsidies ending', 'CalAIM’s Incentive Payment Program ended; programs must self-sustain on claims', 'Collecting cleanly on delivered services is now the core of sustainability'],
      ['Plans pay slowly', 'Managed care plans must pay clean claims fast — but getting claims clean is where organizations bleed', 'Clean-claim and documentation automation is the direct fix'],
      ['New billable line', 'Transitional Rent became a required Community Support in 2026', 'A fresh revenue line to capture early and cleanly'],
      ['Grants tightening', 'Federal homelessness funding is volatile; state grants are more prescriptive', 'Lean harder on the reliable Medi-Cal stream; sharpen grant/RFP targeting'],
      ['Capacity funding', 'CalAIM PATH funds billing, data, and readiness work through 2026', 'A meaningful part of this program may be grant-offsettable'],
    ],
  ),
  spacer(160),
  subHeader('The Regulatory Frame — Burden and Constraint'),
  p('This work runs on protected health information, so a technology partner is judged first on whether it understands the rules. Most of the load is recurring documentation and reporting that AI automates well — but how AI can be used is bounded, and that boundary is the first thing to get right.'),
  buildTable(
    [
      { label: 'Regime', weight: 2.4 },
      { label: 'What It Governs', weight: 4.2 },
      { label: 'AI Angle', weight: 3.4 },
    ],
    [
      ['HIPAA', 'All protected health information on Medi-Cal members', 'Constraint first (BAA, encryption, access), then reducer (HIPAA-safe documentation and summarization)'],
      ['42 CFR Part 2', 'Tighter confidentiality for substance-use records; compliance required by February 2026', 'Hard constraint — consent and segmentation; these records do not go to general AI models'],
      ['Medi-Cal billing integrity', 'Every claim is auditable; unsupported claims invite clawback', 'Audit-readiness and documentation-to-claim matching — explainable, human-reviewed, never autonomous billing'],
      ['HMIS', 'HUD data standards, de-duplication, reporting', 'Data-quality automation and reconciliation against plan encounter data'],
      ['Data Exchange Framework', 'Statewide health-data exchange; smaller organizations phase in by early 2026', 'Participate to receive hospital discharge feeds — faster, cleaner referral intake'],
      ['Fair housing', 'Anti-discrimination in client and landlord matching', 'Constraint — any matching model is bias-audited for protected classes'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Constraint We Lead With: HIPAA-Safe by Design',
    [
      'Any AI that touches member information runs under a Business Associate Agreement, on private, enterprise endpoints (the BAA-covered versions of the major AI platforms), tenant-isolated, with no client data used to train a model and no member data ever sent to a public AI tool.',
      'A person reviews anything that affects a claim or a member — AI assembles and flags, people decide. That keeps the work explainable and audit-ready and keeps Housing for Health clear of billing-integrity risk.',
      'This is the difference between an off-the-shelf AI tool and a partner that understands Medi-Cal: the compliance posture is the first design decision, not an afterthought.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '05'),
  spacer(100),
  p('Housing for Health’s funding comes from a finite, nameable set of payers and partners — which is why this is an account-based program, not a marketing campaign. There is no consumer funnel here; individuals do not fund the work. The next dollar comes from four pools, and the job of AI is to help capture each one cleanly and to free the team to pursue more of them.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.4 },
      { label: 'Who / What', weight: 3.4 },
      { label: 'How Housing for Health Captures It', weight: 3.8 },
    ],
    [
      ['Payer contracts (primary)', 'The Medi-Cal managed care plan(s) — CalOptima in Orange County, plus ECM through Kaiser', 'Clean billing that proves reliability, and the outcomes data plans require to renew and expand'],
      ['Captured / recovered revenue', 'The claims already earned but denied, delayed, or never billed for lack of documentation', 'Clean-claim, documentation, and denial-recovery automation'],
      ['Grants & RFPs', 'State and county housing funds, foundations, and CalAIM capacity funding', 'RFP and grant discovery plus drafting from a reusable evidence and outcomes library'],
      ['Provider network (emerging)', 'Other housing organizations that need the same billing and compliance backbone', 'Extend the platform and standards — the role Housing for Health is already building toward'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based by Design — and Mission-Aligned',
    [
      'The buyers are a handful of named plans, counties, and funders — so the work is depth and reliability on those relationships, not broad outreach. AI surfaces the right targets and produces the outcomes evidence that wins them.',
      'The member is at the center, not the market. Serving more people and serving them well is what produces the outcomes that renew contracts — the mission and the funding reinforce each other.',
      'The human relationships stay central. AI handles the documentation, the claims, and the reporting so that care managers and leadership can spend their time on members and partners.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 THE HHOC STAKEHOLDERS ----------
docChildren.push(
  ...sectionHeader('The Housing for Health Stakeholders', CORE_ORANGE, '06'),
  spacer(100),
  p('Housing for Health serves people, but it is funded and sustained by a small set of stakeholders — and a growth program has to understand each one. The cards below profile the relationships that matter most, and the map places each by its influence on funding and the priority it deserves.'),
  spacer(160),

  personaCard('1 — The Medi-Cal Managed Care Plan', DARK_CHARCOAL, [
    ['Who', 'The plan that funds the work — CalOptima in Orange County, with ECM through Kaiser; the single most important relationship.'],
    ['What They Need', 'Reliable, clean billing; strong member outcomes; clean compliance — the evidence that the program is worth renewing and expanding.'],
    ['What Wins Them', 'Clean claims that do not create rework, and outcomes reporting that proves housing retention and reduced hospital use.'],
    ['AI Opportunity', 'Clean-claim and documentation automation makes Housing for Health an easy plan to work with; automated outcomes reporting proves the value.'],
    ['Technijian Hook', 'My Dev — clean-claim and documentation automation. My AI — outcomes and impact reporting.'],
  ]),
  spacer(160),

  personaCard('2 — The Medi-Cal Member', CORE_ORANGE, [
    ['Who', 'The person served — a Medi-Cal member experiencing or at risk of homelessness, often with complex needs.'],
    ['What They Need', 'A faster path from referral to housing, and a care manager with the time to help rather than chase paperwork.'],
    ['What Helps Them', 'Quicker intake and eligibility, and a care team freed from manual documentation to focus on the member.'],
    ['AI Opportunity', 'Faster intake and a care-coordination copilot give care managers more time per member — the mission metric and a billable one.'],
    ['Technijian Hook', 'My Dev — referral intake and eligibility. My AI — care-coordination copilot (HIPAA-safe).'],
  ]),
  spacer(160),

  personaCard('3 — The Referral Source', TEAL, [
    ['Who', 'Hospitals and emergency departments, the county Coordinated Entry System, clinics, and the plan’s high-utilizer lists.'],
    ['What They Need', 'A simple, reliable way to refer a member and know it was received and acted on.'],
    ['What Helps Them', 'A clear intake path and, over time, electronic discharge feeds that route members in automatically.'],
    ['AI Opportunity', 'Automated intake from referrals and discharge feeds turns a manual handoff into a fast, trackable enrollment.'],
    ['Technijian Hook', 'My Dev — referral intake and eligibility screening. My SEO — a referral-partner page so they can find and use Housing for Health.'],
  ]),
  spacer(160),

  personaCard('4 — The Care Manager', GOLD, [
    ['Who', 'The internal team delivering the work — and the constraint on how many members can be served.'],
    ['Pain Points', 'Documentation and stipulation chasing eat the day; caseload pressure trades off against quality and against the rate.'],
    ['What Helps Them', 'Automation that turns notes into compliant records and flags gaps before a claim, plus caseload balancing to the rate.'],
    ['AI Opportunity', 'Documentation automation and caseload optimization free time, protect margin, and reduce burnout.'],
    ['Technijian Hook', 'My Dev — documentation and encounter capture. My AI — caseload optimization.'],
  ]),
  spacer(160),

  subHeader('The Supporting Stakeholders'),
  personaCard('5 — The Partner CBO', PASS, [
    ['Who', 'Other housing organizations Housing for Health supports — the emerging platform and network role.'],
    ['What They Need', 'The billing, compliance, and reporting backbone they lack the scale to build themselves.'],
    ['What Wins Them', 'A proven, modern, compliant platform with the outcomes to show it works.'],
    ['AI Opportunity', 'The same automation Housing for Health builds for itself becomes a capability it can extend to a network.'],
    ['Technijian Hook', 'My AI and My Dev — the platform and standards. My Security — the compliance that de-risks a network.'],
  ]),
  spacer(160),

  personaCard('6 — The Funder / Foundation', CORE_BLUE, [
    ['Who', 'Health-system and philanthropic funders that supplement the Medi-Cal revenue.'],
    ['What They Need', 'Clear evidence of impact and a credible, well-run organization.'],
    ['What Wins Them', 'Outcomes data and a professional public presence — and proposals that arrive on time and on target.'],
    ['AI Opportunity', 'Outcomes reporting and grant discovery and drafting turn impact into funded proposals.'],
    ['Technijian Hook', 'My AI — outcomes reporting and grant/RFP discovery. My SEO — the credibility of the public presence.'],
  ]),
  spacer(200),

  p('Figure 6.0 maps each stakeholder by influence on funding and engagement priority — showing the anchor relationships to deepen, the pipeline and strategic relationships to build, and the supplemental ones to maintain.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Housing for Health Stakeholder Map', 580, 1.50),
  diagramCaption('Figure 6.0 — Stakeholder Map: Influence on Funding & Sustainability vs. Engagement Priority'),
);

// ---------- 07 PEER & COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Peer & Competitive Landscape', CORE_BLUE, '07'),
  spacer(100),
  p('The CalAIM housing space has a clear top tier — organizations that pair scale with real data and outcomes capability — and a large middle that is operations-heavy and digitally behind. Housing for Health cannot out-scale the leaders, but it can out-modernize the operations-heavy peers on data and AI, and that is precisely what wins managed-care contracts and renewals.'),
  spacer(140),
  buildTable(
    [
      { label: 'Organization', weight: 2.2 },
      { label: 'What They Do', weight: 3.4 },
      { label: 'Posture vs. Housing for Health', weight: 4 },
    ],
    [
      ['Illumination Foundation', 'Recuperative care, post-hospital housing, ECM and Community Supports (Orange County)', 'The tech-forward Orange County benchmark — deep plan-data integration and documented outcomes; the bar to approach'],
      ['Brilliant Corners', 'Flexible housing-subsidy administration, navigation, landlord engagement (statewide)', 'The systems leader at scale — centralized referral, tracking, and reporting; the data benchmark'],
      ['HealthRIGHT 360', 'Integrated behavioral health, primary care, and housing (statewide)', 'Clinically data-mature; large and integrated — a different model, useful as a data reference'],
      ['PATH', 'Outreach, shelter, navigation, and ECM (statewide, including Orange County)', 'Large and established but operations-heavy and not a publicized tech leader — out-modernizable'],
      ['Mercy House', 'Full continuum from outreach to permanent housing (Orange County)', 'Long-tenured regional provider, traditionally behind on technology — a partner more than a threat'],
      ['Unite Us / findhelp', 'Closed-loop referral and payment platforms the plans require organizations to use', 'Infrastructure to interoperate with, not replace — AI sits on top to reduce the multi-platform burden'],
    ],
  ),
  spacer(200),
  subHeader('Scale & Data-Maturity Scorecard'),
  p('Reduced to the two dimensions that decide managed-care confidence — reach and data/AI maturity — the picture is clear, and it shows the move available to a smaller, well-run organization.'),
  buildTable(
    [
      { label: 'Organization', weight: 2.6 },
      { label: 'Scale', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Data / Outcomes', weight: 1.8, align: AlignmentType.CENTER },
      { label: 'AI Posture', weight: 1.6, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.8 },
    ],
    [
      ['Brilliant Corners', { text: 'High', align: AlignmentType.CENTER }, { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'Forward', color: PASS, align: AlignmentType.CENTER }, 'Systems leader at scale'],
      ['Illumination Foundation', { text: 'Med-High', align: AlignmentType.CENTER }, { text: 'Strong', color: PASS, align: AlignmentType.CENTER }, { text: 'Forward', color: PASS, align: AlignmentType.CENTER }, 'The OC benchmark'],
      ['PATH', { text: 'High', align: AlignmentType.CENTER }, { text: 'Moderate', align: AlignmentType.CENTER }, { text: 'Behind', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Large, operations-heavy'],
      ['Mercy House', { text: 'Regional', align: AlignmentType.CENTER }, { text: 'Light', align: AlignmentType.CENTER }, { text: 'Behind', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Traditional provider'],
      [{ text: 'Housing for Health (today)', bold: true }, { text: 'Small', align: AlignmentType.CENTER }, { text: 'Emerging', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'Open', color: CORE_ORANGE, align: AlignmentType.CENTER }, { text: 'Room to leapfrog on data + AI', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 7.0 plots the field. Housing for Health sits in the emerging corner — small and early on data and AI. The realistic move is straight up: out-modernize the operations-heavy peers, approach the benchmark tier on outcomes, and let that win contracts.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Peer Positioning — Scale vs. Data & AI Maturity', 580, 1.50),
  diagramCaption('Figure 7.0 — Peer Positioning: Scale / Reach vs. Data & AI Maturity'),
  spacer(160),
  calloutBox(
    'Where Housing for Health Wins',
    [
      'The field’s shared weakness is fragmentation: plans adopted incompatible referral and billing platforms, so care managers juggle multiple portals and manual workarounds. The organization that unifies and automates that work serves more people per dollar.',
      'Outcomes win contracts. The benchmark organizations win and keep managed-care business because they can prove housing retention and reduced hospital use. A smaller organization that reports outcomes just as cleanly competes well above its size.',
      'And the capability compounds: the same automation built for Housing for Health’s own programs is exactly what its emerging provider network would pay to use.',
    ],
    CORE_BLUE
  ),
);

// ---------- 08 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '08'),
  spacer(100),
  p('For an organization whose audiences are managed-care plans deciding where to send contracts and partners deciding whether to join a network, the public presence does real work — and today it under-represents a CalAIM provider with genuine outcomes.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Website', 'Clean, recently rebranded site with a clear mission and an impact page', 'A strong base — but it speaks more to the public than to the plans and partners who fund the work'],
      ['Partner page', 'The “become a partner” path is referenced but not built out', 'The core of the new network strategy needs a real page that tells plans and CBOs why to engage'],
      ['Plan / procurement page', 'No dedicated “for health plans” or procurement section', 'The buyers are managed-care plans — give them a page that speaks to clean billing, compliance, and outcomes'],
      ['Outcomes presentation', 'A few strong metrics, current year only', 'Outcomes win renewals and grants; presenting them prominently and over time is high-value and low-cost'],
      ['Content & discoverability', 'Thin content; limited organic visibility', 'Referral partners and eligible members should find Housing for Health for “ECM provider Orange County” and similar searches'],
      ['Data & AI in the workflow', 'Not evident', 'Billing, documentation, and reporting appear manual — the gap this blueprint is built to close'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the mission — only making a real, proven program look and work as modern as it is.',
      'Fixing the partner and plan pages, presenting outcomes prominently, and improving discoverability are low-cost moves that build credibility with the exact audiences that fund the work.',
      'They are also the natural first ninety days: get the compliance foundation and the public story right, then build the revenue-capture engine on top.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITIES ----------
docChildren.push(
  ...sectionHeader('Technijian Capabilities — Proven Builds & Services', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things, plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services Housing for Health would engage. Each is labeled for what it is, and each maps to a specific use case. Everything that touches member information is HIPAA-safe by design.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review.',
    'The same approach turns caseworker notes into compliant encounter records and assembles clean claim packets in minutes instead of hours — and drafts grant and RFP responses from a reusable library. Pointed at member data, it runs HIPAA-safe.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory Systems',
    'Technijian implemented enterprise knowledge and memory systems (Weaviate plus Obsidian) that give AI agents persistent, structured recall across an organization’s information.',
    'For Housing for Health this is the basis of a care-coordination copilot that safely summarizes a member’s history across systems for the lead care manager, and an institutional memory that survives staff turnover — all under a HIPAA-safe architecture.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Housing for Health Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) to ship portals, dashboards, and integrations around an organization’s actual process.',
    'This builds the operating layer: HIPAA-safe clean-claim and billing automation, documentation and encounter capture, caseload and outcomes dashboards, and the referral-intake workflow that feeds it.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI — AI Strategy & Implementation (HIPAA-Safe)',
    'My AI is Technijian’s AI consulting and implementation service — strategy plus hands-on delivery, with security and compliance designed in (HIPAA, SOC 2, and related frameworks), led by a fractional AI advisor.',
    'For Housing for Health it runs the AI program: the billing, documentation, and compliance automation; caseload and outcomes analytics; and the account intelligence that targets the right plans, counties, and grants.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Security — HIPAA & 42 CFR Part 2 Safeguards',
    'My Security is Technijian’s managed security service: the information-security program, monitoring, access controls, and audit trails required to handle protected health information.',
    'For Housing for Health it delivers the HIPAA safeguards program and the 42 CFR Part 2 readiness due in early 2026 — the compliance foundation that makes AI-assisted work deployable and a low-friction first engagement.',
    'service'
  ),
);

// ---------- 10 AI ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Helps Housing for Health Serve More & Capture More', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: capture revenue (collect cleanly and completely on services already delivered), serve more people (faster intake and better-balanced caseloads), and win and comply (the outcomes and account intelligence that win funding, on a compliant foundation). Every part that touches member information is HIPAA-safe by design.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'Housing for Health AI Engine', 600, 1.61),
  diagramCaption('Figure 10.0 — The Engine: Capture Revenue, Serve More People, and Win & Comply'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.8 },
      { label: 'Play', weight: 2.5 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.6 },
      { label: 'Service', weight: 1.5 },
    ],
    [
      ['Capture Revenue', 'Clean-claim & billing automation', 'Generate clean claims; verify eligibility and authorization', 'Days to payment', 'My Dev'],
      ['Capture Revenue', 'Documentation & encounters', 'Turn notes into compliant records; flag gaps pre-claim', 'Clean-claim rate', 'My Dev'],
      ['Capture Revenue', 'Denial detection & resubmission', 'Catch denials early; assemble corrected resubmissions', 'Revenue recovered', 'My AI'],
      ['Capture Revenue', 'Caseload & margin optimization', 'Staff to the rate-baked caseload ratios', 'Margin per program', 'My AI'],
      ['Serve More People', 'Referral intake & eligibility', 'Ingest referrals and discharge feeds; auto-screen', 'Time to enroll', 'My Dev'],
      ['Serve More People', 'Care-coordination copilot', 'Summarize member history for the lead care manager', 'Time per member', 'My AI'],
      ['Serve More People', 'Client–housing matching', 'Match members to units and landlords (bias-audited)', 'Time to placement', 'My AI'],
      ['Win & Comply', 'Outcomes & impact reporting', 'Auto-generate plan, funder, and 990 reports', 'Renewals, grants won', 'My AI'],
      ['Win & Comply', 'Plan / county account intelligence', 'Track which plans offer what, where, and when RFPs drop', 'Qualified opportunities', 'My AI'],
      ['Win & Comply', 'HIPAA + 42 CFR Part 2 program', 'The required security program and SUD-record consent', 'Compliance posture', 'My Security'],
      ['Win & Comply', 'Audit-readiness monitoring', 'Continuously check documentation supports every claim', 'Audit exceptions', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'Every AI touching member information is HIPAA-safe — a Business Associate Agreement, private enterprise endpoints, no client data to public models, and no member data used to train a model.',
      'A person decides anything that affects a claim or a member. AI assembles, checks, and flags; care managers and billing staff review and approve. Billing is never autonomous, and any matching model is bias-audited for fair-housing compliance.',
      'That is the point: Housing for Health gets the speed and the captured revenue without taking on compliance or billing-integrity risk it cannot defend.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because Housing for Health’s internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 14 replace them with real baselines. The logic holds across a wide range of inputs, because the program is funded largely by revenue it recovers — money already earned but not yet collected.'),
  spacer(140),
  subHeader('Projected Lift (Estimated)'),
  buildTable(
    [
      { label: 'Measure', weight: 3 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['Clean-claim rate (first-pass)', 'Manual, variable', 'Checked before submission', 'Fewer denials'],
      ['Days to payment', 'Slowed by rework', 'Faster, cleaner claims', 'Better cash flow'],
      ['Denied revenue recovered', 'Ad hoc', 'Systematic detection + resubmission', 'Revenue captured'],
      ['Members served per care manager', 'Set by manual workload', 'Optimized to the rate', 'Serve more people'],
      ['Documentation completeness', 'Variable', 'Gaps flagged before the claim', 'Audit-ready'],
      ['Outcomes reporting', 'Manual', 'Automated for plans and funders', 'Renewals + grants'],
      ['HIPAA / 42 CFR Part 2 readiness', 'In progress', 'Programmatic + monitored', 'Compliant by early 2026'],
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
      ['Captured / recovered Medi-Cal revenue (Y1)*', '+$100,000', '+$250,000', '+$500,000'],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$91,000', bold: true }, { text: '~$91,000', bold: true }, { text: '~$91,000', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '1.1x', bold: true, color: PASS }, { text: '2.7x', bold: true, color: PASS }, { text: '5.5x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* Captured revenue = denials recovered, documentation gaps closed before submission, faster and cleaner billing, and caseload throughput. The figure depends on Housing for Health’s actual claims volume and denial rate — a key discovery item (Section 14). Not counted in the ratio: more people served, reduced audit risk, and contracts and grants won or renewed. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
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
      ['My AI — Fractional AI Advisor (HIPAA-safe)', 'AI program lead; billing, documentation, and compliance strategy; plan / RFP account intelligence', '$2,000/mo', '$24,000'],
      ['My SEO — Referral & Funder Discoverability', 'Answer-engine and search visibility; “for health plans” and partner pages (not consumer marketing)', '$1,000/mo', '$12,000'],
      ['My Security — HIPAA + 42 CFR Part 2 Safeguards', 'The required security program and Part 2 readiness due early 2026 — the entry point', '$800/mo', '$9,600'],
      ['My Dev — Custom Build (one-time, phased)', 'HIPAA-safe clean-claim and billing automation, documentation capture, caseload and outcomes dashboards, referral intake', '—', '$40,000'],
      ['My AI — Executive AI Workshop + readiness (one-time)', 'Leadership alignment and a HIPAA-safe AI roadmap', '—', '$5,000'],
      [{ text: 'YEAR-1 TOTAL INVESTMENT', bold: true }, { text: 'Recurring $3,800/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$91,000', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'The program is designed to fund itself: recovering even a modest share of denied or uncaptured Medi-Cal claims, and billing more cleanly going forward, covers the investment — this is money already earned, not new money chased.',
      'A meaningful part of the build qualifies as the billing, data, and readiness work that CalAIM’s PATH capacity funding covers through 2026 — so the out-of-pocket cost may be materially lower.',
      'The program is phased — start with the compliance foundation and revenue capture, prove the recovered dollars, then scale outcomes reporting and account intelligence — which lowers the entry point and de-risks the spend.',
    ],
    CORE_BLUE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence suited to a compliance-sensitive organization: get the HIPAA-safe foundation right, then turn revenue capture on, then scale outcomes and the funding pipeline. Recovered revenue and faster, cleaner billing are visible inside the first six months; the bigger reporting and account-intelligence work is given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Housing for Health 90-180-365 Day Roadmap', 600, 2.30),
  diagramCaption('Figure 12.0 — Housing for Health Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation (Days 1–90)', { color: CORE_BLUE }),
  p('Get the compliance base right and fix the public front door.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — HIPAA & Part 2 Readiness', 'Stand up the Business-Associate-Agreement architecture and the 42 CFR Part 2 consent handling due in early 2026. Baseline the current denial rate and days to payment. Fix the partner and plan pages.'],
      ['1.2 — Capture Pilot', 'Pilot clean-claim and documentation automation with denial detection on a defined set of services — and start recovering revenue that is already earned.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Capture (Days 91–180)', { color: TEAL }),
  p('Turn revenue capture and caseload throughput into routine.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Caseload & Throughput', 'Optimize caseloads to the rate-baked ratios and automate referral intake and eligibility so the same team serves more members.'],
      ['2.2 — Outcomes Engine', 'Stand up automated outcomes and impact reporting for the managed-care plan, funders, and the annual filing — the evidence that renews contracts.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Win (Days 181–365)', { color: CORE_ORANGE }),
  p('Scale the funding pipeline and compound what is working.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Account Intelligence & Grants', 'Turn on plan and county account intelligence and RFP and grant discovery to drive renewals and the expansion pipeline.'],
      ['3.2 — Optimize & (Optional) Network', 'Bring audit-readiness monitoring into production and deliver the ROI dashboard against the Section 14 baselines — and, optionally, package the platform for the partner-CBO network.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions Housing for Health can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Build the Partner & Health-Plan Pages',
    ['Finish the “become a partner” page and add a short “for health plans” section. These are the audiences that fund the work, and right now they do not have a page that speaks to them — a low-cost fix with outsized credibility return.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Put the Outcomes Front and Center',
    ['Housing for Health already reports strong numbers — members served, housing retention, income gains. Present them prominently and keep them current. Outcomes are what win managed-care renewals and grants, so they belong on the front page, not buried.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Baseline the Denials and Days-to-Payment',
    ['Pull the current claim denial rate and the average time from service to payment. That single pair of numbers is the starting point for the entire revenue-capture story — and the clearest before-and-after the program can show.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Run a HIPAA & 42 CFR Part 2 Readiness Check',
    ['Before any AI touches member data, review how protected health information and substance-use records are handled today against the Part 2 rules due in early 2026. It is a free posture check that de-risks everything that follows — and exactly what a managed-care partner wants to see.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Publish a Referral-Partner Page',
    ['Add one clear page telling hospitals, clinics, and county staff how to refer a Medi-Cal member for Enhanced Care Management and housing supports. It makes Housing for Health easy to find and easy to use for the partners who feed the program.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with Housing for Health’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Claims volume', 'Current Medi-Cal claims volume, denial rate, and average days to payment', 'Sets the revenue-capture model — the heart of the ROI'],
      ['Caseload', 'Current caseloads and care-management staffing against the rate ratios', 'Calibrates the throughput and margin story'],
      ['Programs & plans', 'Which Community Supports are contracted, and with which plans beyond CalOptima and Kaiser', 'Scopes the billing automation and the account-intelligence targets'],
      ['Systems', 'The case-management, HMIS, billing, and closed-loop-referral platforms in use', 'Defines the build and integration surface'],
      ['Compliance today', 'How adverse documentation and Part 2 consent are handled now', 'Confirms the HIPAA-safe foundation and the Part 2 timeline'],
      ['Organization model', 'Whether the focus is direct service or the emerging provider-network platform', 'Shifts the center of gravity of the AI roadmap'],
      ['Funding mix', 'Current funders, any PATH or capacity funding held, and grant priorities', 'Sizes the grant-offset and the RFP/grant work'],
      ['Sponsor', 'Who leads the engagement and how decisions are made', 'Shapes the rollout and approval path'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on Housing for Health’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('Housing for Health already has the hard things: a CalAIM provider role, real outcomes, a mission that matters, and the beginnings of a platform that could lift other providers with it. What it has not yet done is put modern data and AI behind the work — to collect cleanly on what it has earned, free its team to serve more people, and prove its impact to the plans and funders who decide its future.'),
  p('The opportunity is concrete and conservative: capture the Medi-Cal revenue already being left on the table, serve more members with the same team, and win renewals and grants with outcomes reported cleanly — all on a HIPAA-safe foundation, with people in charge of every decision that matters. It is a program designed to pay for itself, with much of the build potentially grant-offsettable.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the HIPAA-safe foundation, the partner and plan pages, and the first revenue-capture pilot — live inside 30 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to capture the funding you’ve earned — and serve more people?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
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
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized organizations since 2000. We build and operate the AI systems that help mission-driven and regional organizations compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Housing for Health', weight: 5 }],
    [
      ['My AI', 'HIPAA-safe AI strategy and delivery — clean-claim, documentation, and compliance automation; caseload and outcomes analytics; and the account intelligence that targets the right plans, counties, and grants'],
      ['My Dev', 'Custom, AI-native builds — the clean-claim and billing automation, documentation capture, caseload and outcomes dashboards, and referral-intake workflow'],
      ['My Security', 'The HIPAA and 42 CFR Part 2 safeguards program, monitoring, and audit trails that make AI-assisted, Medi-Cal-funded work defensible'],
      ['My SEO', 'Answer-engine and search visibility plus the partner and health-plan pages that build credibility with the audiences that fund the work'],
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
  p('Market and program intelligence gathered via public web research conducted May 2026. Organizational details (founding year, programs, served counts, funders, and footprint) are drawn from public sources and the organization’s own materials and should be confirmed with Housing for Health before external use.', { italics: true }),
  spacer(120),
  p('1. Housing for Health California — official website: housingforhealthca.org (Home, About, Services, Impact, Contact)', { size: 20 }),
  p('2. ProPublica Nonprofit Explorer & CauseIQ — Form 990 filings (EIN 87-3137292); CMS NPI Registry; CalOptima Health and Kaiser Permanente provider/ECM listings', { size: 20 }),
  p('3. CalAIM — California Health Care Foundation (Housing-Related Community Supports; Billing Better in CalAIM); DHCS (Community Supports Policy Guide; ECM and Community Supports Billing Guidance; Transitional Rent; Incentive Payment Program; Closed-Loop Referral FAQs); NASHP (rate ranges)', { size: 20 }),
  p('4. Regulatory — HHS 42 CFR Part 2 Final Rule (compliance February 2026); HIPAA Privacy/Security; CalHHS Data Exchange Framework; HMIS (HUD) data standards', { size: 20 }),
  p('5. Funding — California HCD HHAP; CalAIM PATH capacity funding; HUD Continuum of Care; health-system and foundation philanthropy', { size: 20 }),
  p('6. Peers — Illumination Foundation; Brilliant Corners; PATH (People Assisting The Homeless); Mercy House; HealthRIGHT 360; Unite Us and findhelp (closed-loop referral platforms)', { size: 20 }),
  p('7. Technijian capabilities & service pricing — My AI, My Dev, My Security, and My SEO; documented Proven Results (AI Document Intelligence for FINRA broker-dealers; Enterprise Knowledge & Memory Systems)', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Housing-for-Health-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
