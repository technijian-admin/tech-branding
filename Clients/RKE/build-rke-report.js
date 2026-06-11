// RKE Strategic Market Analysis & AI Growth Blueprint
// Technijian-branded DOCX report builder
// Reads brand-tokens.json for all brand values

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  ExternalHyperlink, InternalHyperlink, Bookmark, FootnoteReferenceRun,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo,
  PositionalTabLeader, TabStopType, TabStopPosition, Column, SectionType,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ---------- Brand constants (loaded from brand-tokens.json) ----------
const tokens = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'
));

const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE     = strip(tokens.color.primary.blue.$value);   // 006DB6
const CORE_ORANGE   = strip(tokens.color.primary.orange.$value); // F67D4B
const TEAL          = strip(tokens.color.secondary.teal.$value); // 1EAAC8
const CHARTREUSE    = strip(tokens.color.secondary.chartreuse.$value); // CBDB2D
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);   // 1A1A2E
const NEAR_BLACK    = strip(tokens.color.neutral.near_black.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value); // 59595B
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value); // F8F9FA
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value); // E9ECEF
const CRITICAL      = strip(tokens.color.status.critical.$value);
const PASS          = strip(tokens.color.status.pass.$value);

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

// Diagram images
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const DIAGRAM_ARCH_BUF     = fs.existsSync(path.join(DIAGRAMS_DIR, 'architecture.png')) ? fs.readFileSync(path.join(DIAGRAMS_DIR, 'architecture.png')) : null;
const DIAGRAM_TIMELINE_BUF = fs.existsSync(path.join(DIAGRAMS_DIR, 'timeline.png'))     ? fs.readFileSync(path.join(DIAGRAMS_DIR, 'timeline.png'))     : null;
const DIAGRAM_PERSONAS_BUF = fs.existsSync(path.join(DIAGRAMS_DIR, 'personas.png'))     ? fs.readFileSync(path.join(DIAGRAMS_DIR, 'personas.png'))     : null;

const TODAY = '2026-05-18';

// ---------- Helpers ----------
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W = 12240;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

function spacer(size = 200) {
  // keepNext: a spacer binds to the following element so it can never orphan onto a blank page.
  return new Paragraph({ keepNext: true, spacing: { before: size, after: 0 }, children: [new TextRun({ text: '' })] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// Embed a diagram PNG, centered, with optional caption underneath
function diagramImage(buf, altTitle, widthPx = 620, aspectRatio = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun({ text: '' })] });
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [new ImageRun({
      type: 'png',
      data: buf,
      transformation: { width: widthPx, height: Math.round(widthPx / aspectRatio) },
      altText: { title: altTitle, description: altTitle, name: altTitle },
    })],
  });
}

function diagramCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({
      text: text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY,
    })],
  });
}

// Plain paragraph
function p(text, opts = {}) {
  const {
    size = 22,         // 11pt
    color = BRAND_GREY,
    bold = false,
    italics = false,
    align = AlignmentType.JUSTIFIED,
    spaceBefore = 0,
    spaceAfter = 140,
    font = FONT_BODY,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font })],
  });
}

// Multi-run paragraph (for inline emphasis)
function pRuns(runs, opts = {}) {
  const {
    align = AlignmentType.JUSTIFIED,
    spaceBefore = 0,
    spaceAfter = 140,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: runs.map(r => new TextRun({
      text: r.text,
      size: r.size || 22,
      color: r.color || BRAND_GREY,
      bold: r.bold || false,
      italics: r.italics || false,
      font: r.font || FONT_BODY,
    })),
  });
}

// Section header — emits a TOC-visible Heading1 paragraph + a colored visual table.
// Use with spread: `...sectionHeader('Title', COLOR, '01')`.
// Every section starts on a fresh page (Ravi, 2026-06-10): the invisible Heading1 carries
// pageBreakBefore: true with spacing.before: 0. Native Word page-break-before avoids the
// blank-page artifacts that standalone pageBreak() paragraphs cause. The `newPage` param is
// retained for call-site compatibility but no longer alters behavior.
function sectionHeader(text, color = CORE_BLUE, num = '', { newPage = false } = {}) {
  const label = num ? `${num}  ${text}` : text;
  const tocLabel = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    keepNext: true,
    spacing: { before: 0, after: 120, line: 240 },
    children: [new TextRun({ text: tocLabel, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
  });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [120, CONTENT_W - 120],
    borders: noBorders,
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: 120, type: WidthType.DXA },
          shading: { fill: color, type: ShadingType.CLEAR },
          borders: noBorders,
          children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
        }),
        new TableCell({
          width: { size: CONTENT_W - 120, type: WidthType.DXA },
          borders: noBorders,
          margins: { top: 100, bottom: 100, left: 200, right: 0 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })],
          })],
        }),
      ],
    })],
  });
  return [headingPara, visualTable];
}

// Subsection header (smaller, no accent)
function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 28 } = opts;
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    keepNext: true,
    keepLines: true,
    spacing: { before: 300, after: 140 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    keepNext: true,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })],
  });
}

// Bullet
const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}

function bulletRuns(runs) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: runs.map(r => new TextRun({
      text: r.text, size: r.size || 22, color: r.color || BRAND_GREY,
      bold: r.bold || false, font: FONT_BODY,
    })),
  });
}

// Callout box with colored left border
function calloutBox(title, body, color = CORE_BLUE) {
  // keepNext + keepLines = title stays with body + body stays unbroken across pages
  const titleP = new Paragraph({
    keepNext: true,
    keepLines: true,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })],
  });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({
    keepNext: i < bodyArr.length - 1,
    keepLines: true,
    spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })],
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({
      cantSplit: true,
      children: [
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
      ],
    })],
  });
}

// KPI card cell
function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    borders: noBorders,
    margins: { top: 200, bottom: 200, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: number, size: 56, bold: true, color, font: FONT_HEAD })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
        children: [new TextRun({ text: label, size: 18, color: BRAND_GREY, font: FONT_BODY })],
      }),
    ],
  });
}

// KPI row (3 or 4 cards)
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    borders: noBorders,
    rows: [new TableRow({ children: cells })],
  });
}

// Table builder — header row + data rows
function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / columns.reduce((s, c) => s + c.weight, 0))));
  // Force sum exactly
  const diff = CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  colWidths[colWidths.length - 1] += diff;

  const headerCells = columns.map((c, i) => new TableCell({
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { fill: headerColor, type: ShadingType.CLEAR },
    borders: cellBorders,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: c.align || AlignmentType.LEFT,
      children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })],
    })],
  }));

  const dataRows = rows.map((row, ri) => new TableRow({
    cantSplit: true,  // prevent row from splitting across pages
    children: row.map((cell, i) => {
      // cell can be string OR { text, color, bold }
      const cellObj = typeof cell === 'string' ? { text: cell } : cell;
      const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
      const paras = (cellObj.paras
        ? cellObj.paras
        : (Array.isArray(cellObj.text) ? cellObj.text : [cellObj.text]).map(t =>
            new Paragraph({
              alignment: columns[i].align || AlignmentType.LEFT,
              spacing: { before: 0, after: 40, line: 280 },
              children: [new TextRun({
                text: t,
                size: 20,
                color: cellObj.color || BRAND_GREY,
                bold: cellObj.bold || false,
                font: FONT_BODY,
              })],
            })
          ));
      return new TableCell({
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        verticalAlign: VerticalAlign.TOP,
        children: paras,
      });
    }),
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ tableHeader: true, children: headerCells }), ...dataRows],
  });
}

// Solid full-width colored bar (for cover page accents)
function colorBar(color, heightDXA = 60) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      height: { value: heightDXA, rule: 'exact' },
      children: [new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
      })],
    })],
  });
}

// ---------- COVER PAGE ----------
const cover = [
  colorBar(CORE_BLUE, 200),
  spacer(900),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new ImageRun({
      type: 'png',
      data: LOGO_BUF,
      transformation: { width: 320, height: 67 },
      altText: { title: 'Technijian Logo', description: 'Technijian Logo', name: 'Technijian Logo' },
    })],
  }),
  spacer(360),
  // Orange divider
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })],
  }),
  spacer(240),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({
      text: 'STRATEGIC MARKET ANALYSIS',
      size: 28, bold: true, color: CORE_ORANGE, font: FONT_HEAD,
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 180 },
    children: [new TextRun({
      text: '& AI GROWTH BLUEPRINT',
      size: 28, bold: true, color: CORE_ORANGE, font: FONT_HEAD,
    })],
  }),
  spacer(200),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
    children: [new TextRun({
      text: 'RK Engineering Group, Inc.',
      size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD,
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new TextRun({
      text: 'Customer Personas, Competitive Positioning, and an AI-Powered Growth Engine',
      size: 24, italics: true, color: BRAND_GREY, font: FONT_BODY,
    })],
  }),
  spacer(1200),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'PREPARED FOR', size: 18, color: BRAND_GREY, font: FONT_HEAD })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: 'RK Engineering Group, Inc.', size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'PREPARED BY', size: 18, color: BRAND_GREY, font: FONT_HEAD })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: 'Technijian — technology as a solution', size: 22, bold: true, color: CORE_BLUE, font: FONT_HEAD })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'DATE', size: 18, color: BRAND_GREY, font: FONT_HEAD })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: 'May 18, 2026', size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: 'CONFIDENTIAL · PREPARED EXCLUSIVELY FOR RKE LEADERSHIP', size: 16, bold: true, color: BRAND_GREY, font: FONT_HEAD })],
  }),
  colorBar(CORE_ORANGE, 200),
];

// ---------- TABLE OF CONTENTS ----------
const toc = [
  ...sectionHeader('Table of Contents', CORE_BLUE, '', { newPage: true }),
  spacer(200),
  // TOC limited to H1 ONLY (sections, no subsections) — ACU precedent. At '1-2' the TOC filled
  // pages 2-3 exactly and its trailing paragraph mark spilled onto p4, which Section 01's
  // pageBreakBefore then stranded as a blank page (the 2026-06-10/11 "RKE p4" artifact).
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-1' }),
];

// ---------- EXECUTIVE SUMMARY ----------
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, '01', { newPage: true }),
  spacer(160),
  p('RK Engineering Group, Inc. operates at the precise intersection of California\'s most regulated, litigated, and politically charged engineering discipline — traffic, transportation, and environmental impact analysis under the California Environmental Quality Act (CEQA). With more than 35 years of practice, over 7,000 completed projects, and deep expertise across Transportation Planning, Traffic Engineering, and Environmental Engineering (acoustics, air quality, greenhouse gas), RKE has built one of the most defensible technical reputations in Southern California.'),
  p('This report — prepared by Technijian — accomplishes three things. First, it deconstructs the regulatory mechanics (CEQA, Senate Bill 743, Vehicle Miles Traveled) that drive mandatory demand for RKE\'s services. Second, it maps the seven customer personas RKE must target to expand revenue — four primary (Regulatory Guardian, Timeline Driver, Design Integrator, Legal Strategist) and three emerging (Industrial Logistics Developer, Institutional Steward, ESG / Sustainability Officer). Third, and most importantly, it presents a concrete AI-powered growth blueprint Technijian can deploy with RKE in the next 90 to 365 days to capture each persona at scale.'),

  spacer(200),
  subHeader('Key Findings at a Glance', CORE_BLUE, 26),

  kpiRow([
    { number: '35+', label: 'Years RKE in market', color: CORE_BLUE },
    { number: '7,000+', label: 'Projects completed', color: CORE_ORANGE },
    { number: '7', label: 'Target customer personas', color: TEAL },
    { number: '~50%', label: 'CEQA plaintiff win rate', color: CRITICAL },
  ]),

  spacer(200),
  subHeader('Strategic Takeaways', CORE_BLUE, 26),
  bulletRuns([
    { text: 'Demand is regulatory, not discretionary. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Every dollar RKE earns is tied to a CEQA, SB 743, or municipal-code trigger. Marketing must speak the language of mandates, not features.' },
  ]),
  bulletRuns([
    { text: 'SB 743 (VMT) is the single largest growth catalyst in the post-2020 era. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Cities are still rewriting their guidelines and developers are still adjusting their pro formas. RKE is positioned to be the regional thought leader — if it claims that authority quickly.' },
  ]),
  bulletRuns([
    { text: 'Seven personas buy differently. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Public agencies procure through on-call RFPs. Developers buy on speed-to-entitlement. Prime AEC firms buy on low-friction teaming. Attorneys buy on courtroom credibility. Industrial logistics developers buy on AB 98 defensibility. Institutional owners buy on multi-year continuity. ESG officers buy on court-grade methodology. One message will reach none of them.' },
  ]),
  bulletRuns([
    { text: 'AI shifts the economics of business development. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Predictive intent monitoring, Answer Engine Optimization, and generative outbound let a 15-person firm punch above its weight against Fehr & Peers, Urban Crossroads, LSA Associates, and Kimley-Horn — without hiring a dedicated marketing team. Technijian has already built every component of this stack for adjacent industries.' },
  ]),
  bulletRuns([
    { text: 'Internal AI is just as valuable as outbound AI. ', bold: true, color: DARK_CHARCOAL },
    { text: 'Proposal generation, technical peer-review acceleration, and CEQA litigation intelligence collectively recover ~450 billable-equivalent hours per principal per year (Section 11.4 details the breakdown).' },
  ]),

  spacer(200),
  calloutBox(
    'Where Technijian fits',
    'Technijian designs, builds, and operates the AI growth stack so RKE\'s principals stay focused on engineering. We are not a marketing agency — we are a technology partner who deploys the same AI infrastructure used by Fortune 500 firms, sized and priced for a specialized engineering consultancy.',
    CORE_ORANGE
  ),];

// ============================================================
// SECTION 1 — REGULATORY CONTEXT
// ============================================================
const section1 = [
  ...sectionHeader('The Regulatory Architecture of California Land Development', CORE_BLUE, '02'),
  spacer(160),
  p('To accurately identify the target market for RK Engineering Group, one must first deeply understand the regulatory mechanisms that mandate the procurement of its services. Engineering consulting in the California land development space is rarely purchased proactively or voluntarily. It is purchased to overcome a regulatory barrier, mitigate a specific operational risk, or solve a physical design constraint imposed by municipal code. In California, this framework is defined by comprehensive environmental protection laws and the overarching authority of local planning departments.'),

  subHeader('2.1  The California Environmental Quality Act (CEQA)'),
  p('The primary driver of RKE\'s revenue is regulatory compliance dictated by CEQA. Enacted to inform governmental decision-makers and the public about potential environmental effects of proposed activities, CEQA requires state and local agencies to identify significant environmental impacts of their actions and to avoid or mitigate those impacts when feasible. In practical terms, a real estate developer or public agency cannot break ground on a new project without first securing a certified Environmental Impact Report (EIR), a Mitigated Negative Declaration (MND), or a validated Categorical Exemption.'),
  p('The State of California also mandates that the legislative body of each county and city adopt a comprehensive general plan, which must include specific elements dedicated to Circulation (traffic) and Noise. City planners are bound by state law to demand rigorous, empirically sound traffic and noise studies from developers before any discretionary approvals can be granted.'),
  p('This creates a symbiotic, mandatory economic relationship: the municipality cannot legally approve the project without the technical data, and the developer cannot generate the data without hiring a specialized firm like RKE. The environmental studies RKE provides serve as the foundational appendices to the larger environmental documents — they supply the quantitative evidence that justifies qualitative planning decisions.'),

  subHeader('2.2  The Legislative Catalyst: SB 743 and Vehicle Miles Traveled'),
  p('No analysis of the California traffic engineering market is complete without addressing the paradigm shift introduced by Senate Bill 743. Signed in 2013 and fully implemented in July 2020, SB 743 fundamentally altered how transportation impacts are measured and mitigated under CEQA.'),
  p('Historically, transportation impact was measured by Level of Service (LOS), which graded intersection delay from A (free flow) to F (gridlock). Under the legacy LOS framework, a new commercial or residential project that pushed intersection delay below acceptable thresholds had to physically widen roads, add turn lanes, or install signals to mitigate the impact.'),
  p('Research demonstrated this approach was counterproductive to state environmental goals. Road widening induced demand — making driving easier encouraged single-occupancy travel, sprawling development, and higher emissions. The legacy framework also burdened infill developers in transit-rich urban areas with exorbitant mitigation costs simply because urban intersections were naturally more congested than suburban ones.'),
  p('SB 743 replaced LOS with Vehicle Miles Traveled (VMT) as the basis for determining CEQA impacts. VMT measures the total additional automobile travel a project generates on the California road network. Projects that add excessive car travel — sprawling subdivisions far from employment centers, for example — are deemed to cause significant transportation impacts. Projects near transit hubs or in mixed-use walkable neighborhoods generate lower VMT and earn streamlined environmental approvals.'),

  spacer(120),
  calloutBox(
    'Why this matters for RKE',
    [
      'City planners have been forced to overhaul transportation guidelines, establish localized thresholds of significance, and adapt to regional travel demand models like the Orange County Transportation Analysis Model (OCTAM).',
      'Developers must now prove projects fall below regional VMT averages, forcing multi-modal transportation strategies, transit subsidies, or density changes — or face costly CEQA litigation.',
      'Every jurisdiction in Southern California is a buyer for SB 743 advisory work. Every developer is a buyer for VMT screening. This is a market created by law.',
    ],
    CORE_ORANGE
  ),];

// ============================================================
// SECTION 2 — RKE SERVICE ARCHITECTURE
// ============================================================
const section2 = [
  ...sectionHeader('RKE Service Architecture & Technical Differentiation', CORE_BLUE, '03'),
  spacer(160),
  p('To accurately map the ideal customer base, one must deconstruct the technical deliverables RKE provides. The firm\'s service portfolio is deeply specialized, focused on the quantitative metrics and qualitative impacts of land use and commercial development on the surrounding environment and public infrastructure. RKE has deliberately chosen to specialize in niche traffic and environmental disciplines, distinguishing itself from general civil engineering firms that primarily handle grading, drainage, and utility design.'),

  subHeader('3.1  Transportation Planning & Traffic Engineering'),
  p('This is the historical core and most prominent pillar of RKE\'s practice. In modern land development, a project cannot proceed to the planning commission without empirical proof that its impact on vehicular and pedestrian circulation is either manageable or effectively mitigated through engineered solutions.'),
  p('The foundational deliverable is the Traffic Impact Study. Whenever a new development is proposed, the local jurisdiction requires rigorous analysis of how many daily and peak-hour vehicle trips the project will generate. RKE applies established industry methodologies — most notably the ITE Trip Generation Manual — frequently combined with customized empirical data collected at comparable local sites to forecast peak AM, peak PM, and overall daily trips. This analysis dictates the infrastructure upgrades the developer must fund: new traffic signals, roundabouts, or worksite traffic control plans during construction.'),
  p('Parking infrastructure is another critical financial and logistical component of real estate development, and RKE provides specialized Parking Demand and Utilization Studies. From a developer\'s perspective, over-parking a site wastes valuable developable land and inflates construction investment; under-parking generates community backlash, spillover into adjacent residential streets, and denial of conditional use permits. RKE conducts shared parking models for mixed-use developments where distinct uses have varying peak hours — office parking peaks at midday while restaurant parking peaks in the evening, allowing physical spaces to serve double duty. The firm also evaluates modern solutions like automated mechanical parking garages, analyzing queuing lengths and retrieval times for tight urban footprints.'),
  p('To mitigate traffic impacts without physically expanding roadways, RKE designs Transportation Demand Management (TDM) plans. As demonstrated in work for the Schools First Federal Credit Union corporate headquarters, TDM plans incorporate programmatic strategies — corporate carpool matching, transit subsidies, telecommuting frameworks, and active transportation infrastructure such as secure bicycle parking and end-of-trip facilities — to reduce single-occupancy vehicle travel.'),

  spacer(200),
  buildTable(
    [
      { label: 'Service Category', weight: 18 },
      { label: 'Specific Deliverable', weight: 22 },
      { label: 'Primary Objective & Regulatory Context', weight: 30 },
      { label: 'Typical Project Trigger', weight: 30 },
    ],
    [
      [
        { text: 'Traffic Engineering', bold: true, color: DARK_CHARCOAL },
        'Traffic Impact Study',
        'Analyzes localized intersection delay, capacity utilization, and queuing. Required by municipal codes to determine physical infrastructure exactions.',
        'New commercial, residential, or institutional development exceeding baseline trip generation thresholds.',
      ],
      [
        { text: 'SB 743 Compliance', bold: true, color: DARK_CHARCOAL },
        'VMT Screening',
        'Determines if a project falls below regional travel averages to qualify for CEQA exemptions; uses regional models like OCTAM and NOCC+.',
        'Any discretionary land use project subject to CEQA environmental review post-2020.',
      ],
      [
        { text: 'Site Circulation', bold: true, color: DARK_CHARCOAL },
        'Parking Utilization & Shared Parking Study',
        'Balances parking supply against empirical demand; minimizes paved footprint while preventing neighborhood spillover. Supports code variance requests.',
        'Mixed-use developments, medical office conversions, urban infill projects, high-density residential.',
      ],
      [
        { text: 'Demand Reduction', bold: true, color: DARK_CHARCOAL },
        'Transportation Demand Management Plan',
        'Programmatic strategies to reduce single-occupancy vehicle trips via active transportation, transit subsidies, and carpooling.',
        'Large corporate headquarters, university campuses, major employment centers.',
      ],
      [
        { text: 'Infrastructure Design', bold: true, color: DARK_CHARCOAL },
        'Traffic Signal, Signing & Striping Plans',
        'Engineered construction documents for physical roadway modifications, per Caltrans and local municipal standards.',
        'Projects requiring new access points, intersection upgrades, or worksite traffic control.',
      ],
    ]
  ),

  subHeader('3.2  Environmental Engineering: Air Quality, GHG, and Acoustics'),
  p('The second major pillar of RKE\'s service model involves environmental compliance tailored to the rigorous technical requirements of CEQA. Every discretionary land use approval in California must be evaluated for its potential impact on regional air quality and global climate change.'),
  p('RKE conducts Air Quality and Greenhouse Gas impact analyses for project typologies ranging from residential subdivisions to commercial ventures like gas stations and industrial warehouse logistics parks. These studies quantify short-term construction-related emissions (fugitive dust from grading, diesel particulate matter from heavy machinery) and long-term operational emissions (vehicle exhaust, baseline energy consumption). The firm models emissions to determine if a project exceeds the strict thresholds established by regional bodies such as the South Coast Air Quality Management District, then proposes mitigation measures to bring the project into compliance.'),
  p('Noise is a highly sensitive and heavily scrutinized environmental trigger under CEQA. RKE provides acoustical engineering services led by founding principal Robert Kahn and supported by certified acoustical consultants. The work involves establishing baseline ambient noise levels through field measurements with calibrated decibel meters, then using advanced acoustic modeling software to predict future noise contours generated by the project.'),
  p('Projects generally require noise studies to solve two regulatory challenges. The first is project-on-environment impacts — how a new operational noise source will affect existing sensitive receptors. RKE assesses the decibel output of rooftop HVAC units at a converted medical office, mechanical noise from a commercial winery, or amplified sound from drive-through restaurant speakers, ensuring they do not disturb neighboring residential properties. The second is environment-on-project impacts — how the existing ambient environment affects future users of the proposed project. When a developer proposes residential townhomes adjacent to a busy arterial roadway or beneath an active commercial flight path, RKE conducts interior and exterior noise modeling, then designs architectural mitigations such as masonry sound walls, upgraded window assemblies with high Sound Transmission Class ratings, or forced-air ventilation systems that allow residents to keep windows closed without sacrificing climate control.'),

  subHeader('3.3  Litigation Support & Expert Witness Services'),
  p('Because CEQA is primarily enforced through civil litigation rather than administrative oversight, the California land entitlement process is exceptionally adversarial. Neighborhood opposition groups, environmental organizations, labor unions, and even rival commercial interests frequently use CEQA lawsuits to halt, delay, or extract concessions from development projects. Studies of CEQA litigation show that high-density multifamily projects in urban neighborhoods are the most frequent targets, and plaintiffs win nearly 50% of cases — a vastly higher success rate than comparable administrative litigation elsewhere in the country.'),
  p('In this hostile legal arena, RKE has positioned itself as a critical asset for both legal defense and project opposition. The firm\'s principals provide expert witness testimony and litigation support specifically regarding complex traffic data and noise impacts. They are routinely retained by legal counsel to conduct rigorous peer reviews of competing traffic studies, searching for methodological flaws, improper baseline data collection, or missing mitigation measures.'),
  p('As one representative example, RKE provided technical reports supporting the Brentwood Homeowners Association in their opposition to the Mount Saint Mary\'s University Wellness Pavilion project. RKE systematically identified critical issues with the original environmental analysis, challenging assumptions regarding student body growth, actual trip generation from campus events, and the failure to account for the impact of concurrent events on the local circulation system. RKE technical reports also serve as foundational evidence in litigation involving school district rebuilds and commercial developments — including arguments over whether the lead agency properly applied categorical exemptions. With millions of dollars in real estate capital contingent on outcomes, RKE deliverables must be unassailable, logically sound, and defensible under cross-examination in Superior Court.'),];

// ============================================================
// SECTION 3 — PROJECT PORTFOLIO
// ============================================================
const section3 = [
  ...sectionHeader('Project Portfolio Highlights', CORE_BLUE, '04'),
  spacer(160),
  p('RKE\'s publicly available project history reveals a firm capable of servicing developments of extraordinary scale while maintaining the agility to consult on highly localized, nuanced infill projects. The following representative cross-section illustrates the direct application of specific engineering studies to varying development typologies.'),

  subHeader('4.1  Large-Scale Master-Planned Communities'),
  p('RKE demonstrates significant expertise in massive, multi-phased residential and mixed-use developments. A prime example is the Eastvale Square project (Leal Master Plan) in Eastvale, California — a 158-acre master-planned community with 2,500 residential units, a new downtown civic center, a fire station, a commercial shopping district, and office spaces. For a project of this magnitude RKE delivered a fully integrated suite across all three core verticals: the comprehensive Traffic Impact Study modeling daily vehicle trips, a sprawling Parking Study evaluating shared parking dynamics between civic, commercial, and residential sectors, and full engineering and design services for the new traffic signals. Simultaneously, the environmental division executed the Noise Impact Study and the Air Quality and Greenhouse Gas Study to satisfy the overarching CEQA requirements for the EIR. By bundling these services, RKE ensured the traffic volume data used in the transportation study was synchronized with the mobile-source emission data used in the air quality modeling — eliminating a common point of failure in large-scale environmental documents.'),

  subHeader('4.2  Commercial, Agricultural, and Institutional Projects'),
  p('Beyond residential construction, RKE actively services commercial, agricultural, and institutional sectors. The firm collaborated with Peltzer Family Cellars on a remodel and expansion project for the Peltzer Winery in the Temecula Wine Country Community. Agricultural tourism projects like wineries present unique engineering challenges: they act as manufacturing facilities, retail centers, and high-volume event venues simultaneously. RKE delivered a multi-disciplinary technical package including a Traffic Impact Study, Parking Utilization Study to handle event overlays, Noise Impact Study to assess the acoustic impact of outdoor events on neighboring rural properties, and an Air Quality, Greenhouse Gas, and Energy Impact Study.'),
  p('In the corporate sector, the firm supported Schools First Federal Credit Union in developing their headquarters in Tustin, California — highlighting RKE\'s proficiency in Transportation Demand Management. By developing a well-engineered TDM plan alongside the standard traffic, parking, and noise studies, the firm helped the financial institution mitigate its corporate footprint, satisfying local regulators while providing modern transportation amenities for the workforce.'),

  spacer(200),
  buildTable(
    [
      { label: 'Project', weight: 24 },
      { label: 'Location & Context', weight: 18 },
      { label: 'Studies Applied', weight: 26 },
      { label: 'Primary Challenge Solved', weight: 32 },
    ],
    [
      [
        { text: ['Eastvale Square (Leal Master Plan)', '158-Acre Mixed-Use Community'], bold: true, color: DARK_CHARCOAL },
        'Eastvale, CA  ·  Suburban Greenfield',
        'Traffic Impact, Parking, Signal Design, Worksite Control, Noise/Acoustical, Air Quality/GHG',
        'Managing the massive, cumulative infrastructural impact of 2,500 new residential units and multiple commercial centers.',
      ],
      [
        { text: ['Peltzer Winery Expansion', 'Agricultural Tourism / Commercial'], bold: true, color: DARK_CHARCOAL },
        'Temecula, CA  ·  Rural / Agricultural',
        'Traffic Impact, Parking Utilization, Noise/Acoustical, Air Quality/GHG/Energy',
        'Mitigating intermittent, high-intensity traffic and acoustic impacts associated with winery events and tasting-room operations.',
      ],
      [
        { text: ['Schools First Federal Credit Union', 'Corporate Headquarters'], bold: true, color: DARK_CHARCOAL },
        'Tustin, CA  ·  Urban / Commercial',
        'Traffic Impact, TDM, Parking, Noise',
        'Reducing single-occupancy commute reliance and integrating a corporate workforce into the local traffic grid.',
      ],
      [
        { text: ['3300 Irvine Avenue Medical Conversion', 'Commercial Adaptive Reuse'], bold: true, color: DARK_CHARCOAL },
        'Orange County, CA  ·  Suburban Commercial',
        'Traffic Impact, VMT Screening, Air Quality/GHG, Parking',
        'Proving that converting standard office space to high-intensity medical use would not overwhelm existing parking capacity.',
      ],
      [
        { text: ['Mount Saint Mary’s University', 'Institutional Expansion'], bold: true, color: DARK_CHARCOAL },
        'Los Angeles, CA  ·  Urban / Residential-Adjacent',
        'Peer Review, Traffic Impact Analysis, Trip Generation Review',
        'Providing litigation-grade analysis on behalf of a homeowners association challenging institutional expansion assumptions.',
      ],
    ]
  ),];
// ============================================================
// SECTION 5 — MARKET DYNAMICS & PROCUREMENT
// ============================================================
const section5 = [
  ...sectionHeader('Strategic Market Dynamics & Procurement Channels', CORE_BLUE, '05'),
  spacer(160),
  p('Engineering consulting is heavily dependent on relationships, reputation, and formalized procurement vehicles. Market dynamics differ drastically depending on whether the client is a public municipality operating with taxpayer funds or a private developer operating on private equity. Understanding these channels is essential to designing an AI growth engine that produces qualified opportunities, not just leads.'),

  subHeader('5.1  The Public Agency Procurement Ecosystem'),
  p('When local governments require traffic engineering or environmental services, they are legally bound by strict procurement protocols designed to ensure fairness, transparency, and financial stewardship. Public agencies rarely hire RKE for a single, isolated traffic study on an ad-hoc basis. Instead, municipalities issue formal Requests for Qualifications (RFQs) or Requests for Proposals (RFPs) for On-Call or Master Services Agreements.'),
  p('Through these competitive processes, cities build a roster of pre-approved, vetted consulting firms. The City of Seaside, for example, issued an RFQ seeking firms to provide comprehensive analyses of existing and projected traffic conditions, roundabout analysis, speed data analysis, and review of subdivision development projects. The City of Santa Barbara issued an RFP for firms to provide updated traffic modeling for a General Plan Supplemental Program EIR.'),
  p('Once RKE successfully navigates the RFP process and wins an on-call contract — as evidenced by professional services agreements with the City of Newport Beach and the City of Costa Mesa — they become an integrated extension of the city staff. When a private developer submits a complex application, the understaffed city planning department issues a task order under the existing master agreement, instructing RKE to peer-review the developer\'s submissions or draft the city\'s official response. This creates a stable, recurring revenue stream insulated from cyclical volatility in private real estate.'),

  subHeader('5.2  Private Sector & Prime Consultant Teaming'),
  p('In the private sector, procurement is characterized by speed, relationships, and risk mitigation. Real estate developers do not issue public RFPs; they rely on internal networks, recommendations from land use attorneys, or prior successful engagements. Developers frequently hire RKE directly for feasibility studies, VMT screening, and complete EIR technical appendices. The primary driver for private procurement is the firm\'s historical success rate in achieving project entitlement and defending its work in administrative hearings.'),
  p('A significant portion of RKE\'s business is generated through strategic teaming with multi-disciplinary Prime Architecture and Engineering Consultants. Large environmental planning firms — such as FirstCarbon Solutions or HDR Engineering — often win massive contracts to author comprehensive city-wide General Plan updates or large programmatic EIRs. These prime consultants frequently lack the hyper-specialized, highly localized expertise required for complex traffic modeling or advanced acoustical engineering. They subcontract those technical appendices to RKE. As noted in a public proposal for the City of Beaumont, RKE was explicitly named as the subconsultant responsible for Air Quality and Traffic issues under the umbrella of prime consultant Cozad & Fox, Inc. This teaming strategy lets RKE participate in massive, multi-million-dollar public projects without bearing the administrative overhead or liability of acting as prime.'),];

// ============================================================
// SECTION 6 — CUSTOMER PERSONAS
// ============================================================
function personaCard(title, subtitle, color, body) {
  // body is an array of { label, value } pairs
  const rows = body.map((b, i) => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: Math.floor(CONTENT_W * 0.25), type: WidthType.DXA },
        shading: { fill: i % 2 === 1 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({
          children: [new TextRun({ text: b.label, size: 18, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })],
        })],
      }),
      new TableCell({
        width: { size: Math.floor(CONTENT_W * 0.75), type: WidthType.DXA },
        shading: { fill: i % 2 === 1 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({
          spacing: { line: 280 },
          children: [new TextRun({ text: b.value, size: 20, color: BRAND_GREY, font: FONT_BODY })],
        })],
      }),
    ],
  }));

  const titleW = CONTENT_W;
  const headerRow = new TableRow({
    cantSplit: true,
    children: [new TableCell({
      width: { size: titleW, type: WidthType.DXA },
      columnSpan: 2,
      shading: { fill: color, type: ShadingType.CLEAR },
      borders: cellBorders,
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      children: [
        new Paragraph({
          children: [new TextRun({ text: title, size: 28, bold: true, color: WHITE, font: FONT_HEAD })],
        }),
        new Paragraph({
          spacing: { before: 40 },
          children: [new TextRun({ text: subtitle, size: 18, color: WHITE, italics: true, font: FONT_BODY })],
        }),
      ],
    })],
  });

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [Math.floor(CONTENT_W * 0.25), CONTENT_W - Math.floor(CONTENT_W * 0.25)],
    rows: [headerRow, ...rows],
  });
}

const section6 = [
  ...sectionHeader('The Seven Customer Personas', CORE_BLUE, '06'),
  spacer(160),
  p('Based on the regulatory framework, RKE\'s service architecture, and California\'s real estate macroeconomics, seven distinct customer profiles emerge — four primary (high-volume, high-margin) and three emerging (fast-growing, modest incremental investment). These personas represent the decision-makers who hold the budgets, face the intense regulatory pain points, and require the exact solutions RKE provides. To maximize marketing return on investment, RKE must abandon generic messaging and tailor digital architecture, content strategy, and direct business development outreach to the nuanced motivations of each profile.'),

  spacer(120),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Seven Personas Volume-Margin Map', 620, 1.57),
  diagramCaption('Figure 6.0 — Seven personas plotted on Volume (buying-signal frequency) × Margin (revenue per engagement). Numbered dots key to the persona cards that follow.'),

  spacer(120),
  personaCard(
    'Persona 1 — The Regulatory Guardian',
    'Public agency decision-makers',
    CORE_BLUE,
    [
      { label: 'Titles', value: 'City Traffic Engineers · Directors of Community Development · Senior Planners · Directors of Public Works' },
      { label: 'Employer', value: 'Local municipalities, county governments, and regional transportation agencies across Southern California' },
      { label: 'Mandate', value: 'Foster a thriving urban environment, safely manage aging infrastructure, update General Plans for population growth, process developer applications' },
      { label: 'Pain Points', value: 'Transitioning municipal codes to align with SB 743 VMT requirements; chronic understaffing; political pressure between pro-development councils and vocal resident groups; insufficient internal technical resources to peer-review well-funded developer submissions' },
      { label: 'How RKE Wins', value: 'On-call professional services agreements that make RKE a trusted extension of city staff; peer review of developer-submitted traffic studies; authoring municipal VMT guidelines and thresholds of significance (as executed for the City of Laguna Hills and the City of Citrus Heights)' },
      { label: 'Marketing Tone', value: '"Defensible, compliant, and efficient engineering support to protect infrastructure and streamline planning departments." Avoid sales jargon. Emphasize technical authority and partnership.' },
      { label: 'Engagement Channels', value: 'Government RFP platforms (PlanetBids, BidNet Direct, BidSync); League of California Cities conferences; technical webinars on SB 743 implementation' },
    ]
  ),
  spacer(300),

  personaCard(
    'Persona 2 — The Timeline Driver',
    'Real estate developers and entitlement managers',
    CORE_ORANGE,
    [
      { label: 'Titles', value: 'VP of Land Development · Entitlements Manager · Director of Real Estate · Project Manager' },
      { label: 'Employer', value: 'Residential homebuilders, commercial retail developers, industrial warehouse logistics firms, business center owners' },
      { label: 'Mandate', value: 'Acquire raw land or underutilized parcels, secure entitlements and environmental clearances from local agencies, transition projects from conceptual planning into vertical construction as rapidly as possible' },
      { label: 'Pain Points', value: 'Time is literally money — a six-to-twelve-month delay from an incomplete traffic study or successful CEQA lawsuit can erode the project\'s internal rate of return. Profound unpredictability of VMT mitigation. Relentless threat of neighborhood lawsuits weaponizing environmental laws.' },
      { label: 'How RKE Wins', value: 'Early-stage rapid VMT screening that lets developers assess environmental liabilities BEFORE major capital is committed to land acquisition. Unassailable, meticulously documented studies that survive brutal planning commission hearings and withstand CEQA litigation.' },
      { label: 'Marketing Tone', value: '"Protect your pro forma, accelerate your entitlements, and preempt litigation with proactive VMT screening and bulletproof environmental studies."' },
      { label: 'Engagement Channels', value: 'Building Industry Association (BIA), Urban Land Institute (ULI), NAIOP, ICSC; targeted outreach with entitlement case studies' },
    ]
  ),

  personaCard(
    'Persona 3 — The Design Integrator',
    'Prime architecture and engineering consultants',
    TEAL,
    [
      { label: 'Titles', value: 'Principal Architect · Director of Civil Engineering · Lead Environmental Planner' },
      { label: 'Employer', value: 'Massive multi-disciplinary AEC firms (HDR, Stantec, FirstCarbon Solutions, AECOM, Kimley-Horn)' },
      { label: 'Mandate', value: 'Serve as the prime consultant on massive infrastructure or planning projects — city-wide General Plan updates, university master plans, programmatic EIRs. Assemble, coordinate, and manage sub-consultants to deliver a cohesive final product.' },
      { label: 'Pain Points', value: 'Despite size, lacks niche in-house expertise for advanced acoustical modeling or specialized traffic signal design. Bears reputational risk if a subcontracted engineer delivers a flawed report. Values responsiveness, technical excellence, and proactive problem-solvers — not bureaucratic vendors.' },
      { label: 'How RKE Wins', value: 'Acts as a high-tier, low-friction sub-consultant. Bundles three critical environmental appendices (traffic + air quality + noise) under one roof, drastically reducing internal management burden and eliminating risk of conflicting data.' },
      { label: 'Marketing Tone', value: '"The specialized partner who elevates your deliverables, streamlines your management, and protects your firm\'s reputation."' },
      { label: 'Engagement Channels', value: 'Relationship-based selling; presence at California Association of Environmental Professionals (CAEP) events; case studies of successful prime-sub deliveries' },
    ]
  ),
  spacer(300),

  personaCard(
    'Persona 4 — The Legal Strategist',
    'Land use and environmental attorneys',
    CRITICAL,
    [
      { label: 'Titles', value: 'Partner (Land Use & Environmental Law) · Senior Associate · Public Counsel' },
      { label: 'Employer', value: 'Elite environmental law practices, real estate law firms, legal departments of major cities (Nossaman, Holland & Knight, K&L Gates)' },
      { label: 'Mandate', value: 'Secure project approvals and defend against CEQA lawsuits for developers, OR represent community opposition groups tearing apart EIRs to stop development. Inherently combative practice.' },
      { label: 'Pain Points', value: 'Brilliant legal experts but not technical engineers. When litigating noise study inadequacy, trip generation flaws, or VMT calculation errors, completely reliant on authoritative technical backing. Need experts with exceptional credentials, decades of localized experience, and the ability to translate engineering into persuasive narratives a judge or jury can understand — and who will not collapse under cross-examination.' },
      { label: 'How RKE Wins', value: 'Provides technical ammunition. Whether defending a developer or representing a homeowners association, RKE principals translate raw technical data into clear, persuasive courtroom evidence. Robert Kahn\'s expert witness record is the practice\'s deepest moat.' },
      { label: 'Marketing Tone', value: '"Authoritative expert testimony, rigorous peer review, and deposition support — the technical foundation your case needs."' },
      { label: 'Engagement Channels', value: 'CLE seminars on engineering/CEQA case law; publication in legal trade journals; direct outreach to elite firms with documented expert witness CVs' },
    ]
  ),

  // --- 6.5 emerging / niche personas (NEW) ---
  subHeader('6.5  Emerging & Niche Personas'),
  p('The four primary personas above represent the highest-volume and highest-margin buyers. Three additional, fast-growing segments deserve targeted attention: industrial logistics, institutional master planners, and corporate sustainability officers. Each is reachable with the same AI infrastructure that powers the primary loops — at modest incremental investment.'),

  spacer(200),
  personaCard(
    'Persona 5 — The Industrial Logistics Developer',
    'Warehouse, last-mile, and distribution mega-projects',
    CHARTREUSE,
    [
      { label: 'Titles', value: 'Director of Industrial Development · VP Acquisitions · Project Executive at industrial REITs' },
      { label: 'Employer', value: 'Prologis, Rexford, Duke Realty, Industrial Property Trust, regional developers building in the Inland Empire and High Desert corridors' },
      { label: 'Mandate', value: 'Entitle massive (500k–2M sq ft) warehouse and logistics facilities. Bring projects online before SCAQMD\'s Rule 2305 (Warehouse Indirect Source Rule) compliance windows expire.' },
      { label: 'Pain Points', value: 'Crushing SCAQMD scrutiny on diesel particulate matter and tailpipe emissions; community opposition coalitions specifically targeting warehouses; AB 98 (warehouse-specific CEQA setback rules) reshapes site-selection economics; truck-trip VMT calculations under SB 743 are notoriously unpredictable.' },
      { label: 'How RKE Wins', value: 'Bundled traffic + air quality + GHG analysis is exactly what AB 98 and Rule 2305 require. RKE delivers from one team with synchronized inputs — eliminating the data-reconciliation errors that derail Inland Empire warehouse EIRs.' },
      { label: 'Marketing Tone', value: '"AB 98 and Rule 2305 changed the rules. Your warehouse pro forma needs traffic, air quality, and GHG modeling from a single, defensible team — before the next setback challenge."' },
      { label: 'Engagement Channels', value: 'NAIOP SoCal industrial conferences; Inland Empire Economic Partnership; targeted outreach when SCAQMD issues new warehouse advisories' },
    ]
  ),
  spacer(300),

  personaCard(
    'Persona 6 — The Institutional Steward',
    'Universities, hospitals, school districts, civic owners',
    DARK_CHARCOAL,
    [
      { label: 'Titles', value: 'VP Facilities · Director of Campus Planning · Capital Projects Director · Bond Program Manager' },
      { label: 'Employer', value: 'UC and CSU campuses, community colleges, K–12 school districts (Measure-funded bond projects), hospital systems, municipal civic owners' },
      { label: 'Mandate', value: 'Deliver master plans, campus expansions, and bond-funded facilities under intense public oversight. Survive both the CEQA process and the political process of the local elected board.' },
      { label: 'Pain Points', value: 'Multi-year master plans with shifting CEQA requirements; opposition from neighborhood associations (the Brentwood / Mount Saint Mary\'s pattern); bond-program scrutiny on every consultant decision; long procurement timelines that test smaller firms\' patience.' },
      { label: 'How RKE Wins', value: 'Demonstrated institutional track record (Mount Saint Mary\'s peer review, school-district CEQA support). RKE delivers both the affirmative master-plan EIR work and the defensive litigation support on the same campus — a one-stop continuity that primes value highly.' },
      { label: 'Marketing Tone', value: '"Your master plan needs to survive both the CEQA process and the Board of Trustees. We\'ve done both, on both sides, for institutions like yours."' },
      { label: 'Engagement Channels', value: 'CASBO (school business officials), SCUP (Society for College and University Planning), CHEFS (California Higher Education Facilities Society), CEQA defense bar referrals' },
    ]
  ),
  spacer(300),

  personaCard(
    'Persona 7 — The Sustainability / ESG Officer',
    'Corporate climate and sustainability buyers (emerging)',
    TEAL,
    [
      { label: 'Titles', value: 'Chief Sustainability Officer · Director of ESG · VP Environmental, Health & Safety · Corporate Real Estate Sustainability Lead' },
      { label: 'Employer', value: 'Public companies subject to SEC climate disclosure, CARB SB 253/261 reporters, corporate real estate portfolios needing ESG-aligned facility decisions' },
      { label: 'Mandate', value: 'Quantify Scope 1, 2, and 3 emissions across the corporate facility footprint; defend public ESG claims; align facility decisions with stated decarbonization commitments.' },
      { label: 'Pain Points', value: 'Compliance with overlapping disclosure regimes (SEC, CARB, EU CSRD); GHG models that don\'t reconcile across facilities; scrutiny from investors and short-sellers on greenwashing claims; transportation/commute Scope 3 emissions that are technically hard to quantify.' },
      { label: 'How RKE Wins', value: 'RKE already builds defensible GHG models for CEQA — those same methodologies are exactly what ESG officers need for SB 253/261 attestation. The compliance bar in court is higher than the bar in a 10-K, so RKE\'s methodology is over-engineered for the use case.' },
      { label: 'Marketing Tone', value: '"Your ESG attestation lives in front of investors, regulators, and plaintiff lawyers. Use a GHG methodology already proven in court."' },
      { label: 'Engagement Channels', value: 'GreenBiz, AICPA Sustainability Assurance Symposium, IR firms supporting CARB SB 253 reporters, corporate real estate sustainability councils' },
    ]
  ),

  subHeader('6.6  Cross-Persona Interaction Matrix'),
  buildTable(
    [
      { label: 'Persona', weight: 18 },
      { label: 'Procurement Vehicle', weight: 22 },
      { label: 'Operational Pain Point', weight: 28 },
      { label: 'Strategic Value RKE Delivers', weight: 32 },
    ],
    [
      [
        { text: 'Regulatory Guardian', bold: true, color: CORE_BLUE },
        'Public RFPs, On-Call Master Services Agreements',
        'Legislative compliance (SB 743), understaffing, political exposure to angry residents',
        'Regulatory certainty, code drafting, staff augmentation, objective peer review',
      ],
      [
        { text: 'Timeline Driver', bold: true, color: CORE_ORANGE },
        'Direct sole-source contracts, master agreements',
        'Entitlement delays, unpredictable mitigation costs, CEQA litigation risks',
        'Speed to market, proactive VMT screening, bulletproof environmental documentation',
      ],
      [
        { text: 'Design Integrator', bold: true, color: TEAL },
        'Sub-consultant teaming on prime AEC contracts',
        'Complex team management, sub-consultant reputational risk',
        'Multi-disciplinary integration, low-friction execution, single point of accountability',
      ],
      [
        { text: 'Legal Strategist', bold: true, color: CRITICAL },
        'Direct retainer for expert witness / litigation support',
        'Lack of technical expertise to argue complex data in court',
        'Authoritative expert testimony, rigorous peer review, deposition support',
      ],
      [
        { text: 'Industrial Logistics Developer', bold: true, color: CHARTREUSE },
        'Direct engagement, often via industrial broker referrals',
        'SCAQMD Rule 2305, AB 98 setbacks, anti-warehouse opposition coalitions',
        'Bundled traffic + air quality + GHG defensible against AB 98 challenges',
      ],
      [
        { text: 'Institutional Steward', bold: true, color: DARK_CHARCOAL },
        'RFPs against bond-program rules, sole-source for specialized work',
        'Multi-year master plans, board scrutiny, neighborhood opposition',
        'Both affirmative master-plan EIR work AND defensive litigation support',
      ],
      [
        { text: 'ESG / Sustainability Officer', bold: true, color: TEAL },
        'Direct, often via IR firm or sustainability consultant referral',
        'SEC/CARB disclosure compliance, Scope 3 quantification, greenwashing risk',
        'Court-proven GHG methodology applied to ESG attestation',
      ],
    ]
  ),];

// ============================================================
// SECTION 7 — COMPETITIVE LANDSCAPE (NEW)
// ============================================================
const section7 = [
  ...sectionHeader('Competitive Landscape: Who RKE Is Up Against', CORE_BLUE, '07'),
  spacer(160),
  p('RKE competes in a Southern California traffic and environmental engineering market that includes both large regional firms and specialized boutiques. The competitive set varies by persona — public agencies and developers see different competitors. Understanding who else is bidding, what they offer, and where their gaps lie is the foundation for differentiating RKE in every proposal and outreach campaign.'),

  subHeader('7.1  Primary Competitive Set'),
  buildTable(
    [
      { label: 'Firm', weight: 18 },
      { label: 'Scale & Footprint', weight: 22 },
      { label: 'Strengths', weight: 28 },
      { label: 'Gaps RKE Can Exploit', weight: 32 },
    ],
    [
      [
        { text: 'Fehr & Peers', bold: true, color: DARK_CHARCOAL },
        'Large regional (15+ offices, CA + Mountain West)',
        'Heavy thought leadership on SB 743 and VMT; published methodology authority',
        'Premium pricing; less responsive to small-to-mid-sized infill developers; limited acoustical bench',
      ],
      [
        { text: 'Urban Crossroads', bold: true, color: DARK_CHARCOAL },
        'Mid-sized Southern California focus',
        'Strong traffic + air quality bundle; competitive on master-planned community work',
        'Less differentiated acoustical engineering depth; narrower expert-witness profile',
      ],
      [
        { text: 'LSA Associates', bold: true, color: DARK_CHARCOAL },
        'Regional multi-disciplinary (CA + Western U.S.)',
        'Strong environmental/biological resources; broad CEQA practice',
        'Traffic engineering bench is secondary to their ecology and cultural-resources work',
      ],
      [
        { text: 'Kimley-Horn', bold: true, color: DARK_CHARCOAL },
        'National AEC giant',
        'Massive infrastructure capability, deep client relationships with public agencies',
        'Operates as prime — often subs out the specialized traffic + noise + air work RKE provides',
      ],
      [
        { text: 'Iteris', bold: true, color: DARK_CHARCOAL },
        'Publicly traded ITS/traffic specialist',
        'Connected vehicle, signal optimization, large public-sector wins',
        'Focused on technology products and large signal contracts, not boutique CEQA-driven studies',
      ],
      [
        { text: 'Stantec / HDR', bold: true, color: DARK_CHARCOAL },
        'Multinational AEC primes',
        'Win programmatic EIRs and General Plan updates',
        'Routinely sub-contract specialized traffic and acoustical work — direct sub-consultant opportunity for RKE',
      ],
    ]
  ),

  spacer(200),
  subHeader('7.2  Where RKE Wins'),
  bulletRuns([{ text: 'Multi-disciplinary bundling under one roof. ', bold: true, color: DARK_CHARCOAL }, { text: 'Most competitors offer traffic OR acoustics, not both. RKE delivers traffic, parking, noise, air quality, and GHG from one team — eliminating data-reconciliation errors that derail EIRs.' }]),
  bulletRuns([{ text: 'Expert witness pedigree. ', bold: true, color: DARK_CHARCOAL }, { text: 'Robert Kahn\'s personal courtroom record is a moat. National AEC firms cannot match boutique principal-led testimony.' }]),
  bulletRuns([{ text: 'Speed and direct partner access. ', bold: true, color: DARK_CHARCOAL }, { text: 'Developers reach a principal directly, not a five-layer account team. That speed is worth six-figure pro-forma protection.' }]),
  bulletRuns([{ text: 'Southern California focus. ', bold: true, color: DARK_CHARCOAL }, { text: 'Deep knowledge of OCTAM, NOCC+, SCAG, and SCAQMD beats generalist firms parachuting in.' }]),

  spacer(200),
  subHeader('7.3  Where RKE Is Vulnerable'),
  bulletRuns([{ text: 'Thought leadership reach. ', bold: true, color: CRITICAL }, { text: 'Fehr & Peers dominates SB 743 search results and CLE circuit speaking slots. RKE has the expertise but less published surface area.' }]),
  bulletRuns([{ text: 'Marketing infrastructure. ', bold: true, color: CRITICAL }, { text: 'Larger firms have dedicated marketing teams generating case studies, white papers, and webinars at scale. A small firm cannot replicate that with headcount alone — but it can with AI.' }]),
  bulletRuns([{ text: 'Pipeline visibility. ', bold: true, color: CRITICAL }, { text: 'Without systematic monitoring of RFP platforms, permit filings, and prime-contract awards, RKE catches opportunities reactively.' }]),

  spacer(200),
  calloutBox(
    'Strategic Conclusion',
    'RKE\'s competitive moats are technical depth, multi-disciplinary integration, and expert-witness credibility. Its competitive deficits are marketing surface area and pipeline visibility. Both deficits are solvable with AI — and that is the centerpiece of the next section.',
    CORE_ORANGE
  ),];

// ============================================================
// SECTION 8 — TECHNIJIAN CAPABILITY PROOF (NEW)
// ============================================================
const section8proof = [
  ...sectionHeader('Technijian Capability Proof — What We\'ve Already Built', CORE_BLUE, '08'),
  spacer(160),
  p('Before presenting the AI blueprint for RKE, this section makes one thing explicit: none of what follows is theoretical. Every component of the proposed RKE growth engine has been built, deployed, and operated by Technijian for clients in adjacent industries. The technical risk to RKE is correspondingly low. The work is product-ifying existing Technijian capabilities for a specialized engineering consultancy use case.'),

  subHeader('8.1  Five Technijian Builds That Map Directly to RKE'),
  spacer(120),

  calloutBox(
    'Build #1 — Multi-Agent SEO Automation Platform',
    [
      'What it is: A production platform that orchestrates Claude, GPT-4o, and Gemini through the Model Context Protocol (MCP), integrating SEMrush, Google Analytics 4, Perplexity, Firecrawl, DataForSEO, and multi-channel social distribution.',
      'Measured outcome: ~70% reduction in content production time. 6+ MCP integrations. 3 AI providers orchestrated.',
      'RKE application: Powers RKE\'s Hub-and-Spoke content engine, AEO content production, and continuous keyword/competitor monitoring against Fehr & Peers, Urban Crossroads, LSA, and Kimley-Horn. Effectively gives RKE a full content marketing operation without hiring a content team.',
    ],
    CORE_BLUE
  ),
  spacer(200),

  calloutBox(
    'Build #2 — AI Document Intelligence for FINRA Broker-Dealers',
    [
      'What it is: An AI-driven document intelligence system that ingests complex, multi-section vendor questionnaires and auto-populates responses from prior approved answers, evidence libraries, and policy documents.',
      'Measured outcome: RFP response time reduced from days to minutes. 60–80% less manual review required by senior staff.',
      'RKE application: Direct fit for RKE\'s RFP-response workflow. A typical traffic engineering RFP takes 40–80 hours of senior staff time. This platform compresses the response cycle, lets RKE bid on RFPs that would otherwise be uneconomic, and preserves senior time for billable engineering work.',
    ],
    CORE_ORANGE
  ),
  spacer(200),

  calloutBox(
    'Build #3 — LLM Council Architecture (ScamShield)',
    [
      'What it is: A multi-LLM council architecture (Claude + GPT-4o + Gemini) that cross-validates technical findings, combined with Weaviate RAG vector memory for institutional knowledge, IPQS and Twilio for risk scoring, and Whisper for voice transcription.',
      'Measured outcome: 70–80% target gross margins. 3-model LLM Council. Persistent RAG memory.',
      'RKE application: The same LLM Council pattern powers RKE\'s AI Peer-Review Assistant — three models independently review competing traffic studies, surface methodology issues, and require consensus before flagging. Compresses a 40-hour peer review to ~12 hours of expert validation.',
    ],
    TEAL
  ),
  spacer(200),

  calloutBox(
    'Build #4 — Enterprise Knowledge & Memory Systems',
    [
      'What it is: Hybrid memory architecture combining Weaviate vector search with structured Obsidian.md knowledge graphs, deployed for enterprise AI agents requiring persistent cross-session memory.',
      'Measured outcome: Persistent cross-session memory. Hybrid vector + structured knowledge base. Production-grade.',
      'RKE application: Indexes 35 years of RKE deliverables — every traffic study, parking analysis, acoustical model, peer review, expert-witness transcript — into a single searchable knowledge graph. New hires reach productivity in weeks instead of years. Principals retrieve comparable past studies in seconds.',
    ],
    DARK_CHARCOAL
  ),
  spacer(200),

  calloutBox(
    'Build #5 — AI-Native SDLC v7.0',
    [
      'What it is: An AI-first software development lifecycle integrating Claude Code with Figma Make, GitHub, multi-agent orchestration, and CI/CD. Full lifecycle coverage from design through deployment.',
      'Measured outcome: 3–5× faster shipping than traditional development shops, with better architecture and fewer bugs.',
      'RKE application: Builds RKE\'s custom client-facing tools — the Self-Serve VMT Calculator, the SB 743 Knowledge Agent on rkengineer.com, the Developer Permit Monitor, the Expert Witness Portfolio Optimizer. Tooling that would take 12–18 months at a traditional shop ships in 3–6 months under SDLC v7.0.',
    ],
    CHARTREUSE
  ),

  subHeader('8.2  How These Builds Translate into RKE Capabilities'),
  buildTable(
    [
      { label: 'Technijian Capability (Proven)', weight: 30 },
      { label: 'RKE Application', weight: 38 },
      { label: 'Persona It Serves', weight: 32 },
    ],
    [
      [
        { text: 'Multi-Agent SEO Automation', bold: true, color: CORE_BLUE },
        'AEO content engine, Hub-and-Spoke pillars, continuous competitor monitoring against Fehr & Peers and Urban Crossroads',
        'All 7 personas (inbound visibility)',
      ],
      [
        { text: 'AI Document Intelligence (FINRA-grade)', bold: true, color: CORE_BLUE },
        'Auto-drafts RFP responses to City/County on-call traffic engineering RFPs — minutes instead of days',
        'Regulatory Guardian (primary); Design Integrator (sub-bid responses)',
      ],
      [
        { text: 'LLM Council Pattern (ScamShield)', bold: true, color: CORE_BLUE },
        'AI Peer-Review Assistant for competing traffic studies; CEQA case-law analyzer; expert-witness pre-briefing tool',
        'Legal Strategist (primary); Regulatory Guardian (city peer review)',
      ],
      [
        { text: 'Weaviate + Obsidian Knowledge Systems', bold: true, color: CORE_BLUE },
        'Full RKE project knowledge graph; comparable-site retrieval; institutional memory preserved across staff transitions',
        'All 7 personas (delivery quality and proposal speed)',
      ],
      [
        { text: 'AI-Native SDLC v7.0', bold: true, color: CORE_BLUE },
        'VMT Calculator, SB 743 Q&A Agent, Permit Monitor, Prime-Contract Tracker, Attorney CRM — all custom-built',
        'All 7 personas (each tool serves at least one)',
      ],
    ]
  ),

  spacer(200),
  calloutBox(
    'Why This Matters',
    'Choosing Technijian is not choosing an experimental partner. Every architectural pattern in the RKE blueprint has been deployed and is in production for an existing Technijian client. The 90-day Foundation phase (Section 12.1) integrates and configures known-good components — it does not invent them. This is the difference between an R&D engagement and an integration engagement, and it is reflected in both the timeline and the investment profile.',
    CORE_ORANGE
  ),

  spacer(200),
  subHeader('8.3  How We Keep AI Affordable — Seven Models, Routed by Task', { color: CORE_BLUE }),
  p('A fair question about running AI across content, lead gen, RFP drafting, and peer review: won\'t the token bill be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI vendors and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [
      { label: 'Tier', weight: 1.7 },
      { label: 'What It Does', weight: 3.3 },
      { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER },
    ],
    [
      [{ text: 'Frontier (premium)', bold: true, color: DARK_CHARCOAL }, 'The hardest judgment only — final brand-voice pass, litigation-grade accuracy checks, deepest reasoning on a peer review', { text: '~5–10%', color: CORE_BLUE, bold: true }],
      [{ text: 'Workhorse (balanced)', bold: true, color: DARK_CHARCOAL }, 'The bulk of drafting and reasoning — content, outreach personalization, proposal summarization, lead scoring', { text: '~30–40%', color: TEAL, bold: true }],
      [{ text: 'Lightweight (low-cost)', bold: true, color: DARK_CHARCOAL }, 'High-volume mechanical work — classification, extraction, enriching and tagging thousands of permit and RFP records', { text: '~50–60%', color: BRAND_GREY, bold: true }],
    ],
    { headerColor: DARK_CHARCOAL }
  ),
  p('The result: RKE pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A single SB 743 authority article, for example, is drafted by a low-cost model, tightened and fact-checked by a mid model, and given a final brand-and-accuracy pass by a frontier model — instead of one premium model doing all three at roughly triple the cost. This is the kind of AI engineering depth a partner brings that wiring everything to one chatbot does not.', { spaceBefore: 80 }),];

// ============================================================
// SECTION 9 — UNDERSTANDING AI: FIELD GUIDE (NEW EDUCATION LAYER)
// ============================================================
const sectionEdu = [
  ...sectionHeader('Understanding AI — A Field Guide for RK Engineering Group Leadership', CORE_BLUE, '09'),
  spacer(140),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where RKE sits today, how to adopt it without risk, and what comparable organizations are already doing. The goal is that RKE\'s principals can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('9.1  What AI Actually Is — and Isn\'t', { color: CORE_BLUE }),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the only distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft this RFP response from our prior winning proposals and the new evaluation criteria." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch every SoCal RFP platform and permit feed and flag what RKE should pursue." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic\'s guidance on building AI systems) is to use the simplest thing that works. RKE starts with simple automations that pay off in the first 90 days, and adds autonomous agents only where the value is proven — which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('9.2  Where RKE Sits Today — The AI Maturity Ladder', { color: CORE_BLUE }),
  p('Most established, well-run firms — including RKE — sit at the first or second rung of a widely-used five-stage AI maturity model. The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [
      { label: 'Stage', weight: 1.6 },
      { label: 'What It Looks Like', weight: 4 },
      { label: 'RKE Today', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent business development and proposal work', ''],
      [{ text: '2. Emerging', bold: true, color: DARK_CHARCOAL }, { text: 'Some modern tooling and a clear appetite to adopt AI, but AI is not yet woven into growth or internal delivery', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE }],
      ['3. Operational', 'AI runs specific workflows day-to-day — RFP detection, content, peer review — with measured results', ''],
      ['4. Scaled', 'AI is embedded across growth and delivery with governance and dashboards', ''],
      ['5. Transformational', 'AI is the default way the firm competes and wins work', ''],
    ],
    { headerColor: CORE_BLUE }
  ),
  p('RKE is well-positioned to move quickly: a deep deliverable archive and disciplined engineering practice are exactly the inputs AI needs. This report is the plan to reach Operational — AI working in the growth engine and inside the firm — within twelve months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('9.3  Adopting AI Responsibly — Three Risks Every Leader Manages', { color: CORE_BLUE }),
  p('The U.S. government\'s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a firm whose deliverables must survive cross-examination in Superior Court, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [
      { label: 'Risk', weight: 1.8 },
      { label: 'What It Means', weight: 3.4 },
      { label: 'How Technijian Controls It', weight: 3.4 },
    ],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop review on anything client-facing or litigation-bound — AI drafts, a principal approves before it leaves the building'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — client project files, expert-witness materials, and prior peer reviews never touch a public model'],
      ['Compliance & accountability', 'Untracked AI tools create gaps', 'Every AI tool inventoried with owner, vendor, and data source — defensible and audit-ready, led by a CISSP-certified team'],
    ],
    { headerColor: DARK_CHARCOAL }
  ),
  spacer(140),

  subHeader('9.4  What Comparable Organizations Are Already Doing', { color: CORE_BLUE }),
  bullet('Professional services: document-heavy regulated firms are turning multi-day proposal and qualification-package assembly into a minutes-long, reviewable draft — responding to more opportunities with the same team.'),
  bullet('Specialized consultancies: technical experts are using AI search optimization to become the cited answer when buyers ask AI tools a regulatory question — capturing demand competitors never see.'),
  bullet('Engineering and AEC: boutique firms are indexing decades of past deliverables into a searchable knowledge layer, so a new hire reaches productivity in weeks and senior staff retrieve comparable past work in seconds.'),
  p('These are representative directions of travel across comparable industries, not guarantees; RKE\'s own numbers would be confirmed in discovery. Technijian\'s specific, measured results from prior builds appear in Section 8 (Capability Proof) and Section 11.', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('9.5  A Day in the Life — An RKE Principal', { color: CORE_BLUE }),
  calloutBox('Before vs. After AI', [
    'TODAY: A principal opens the day to an RFP that was forwarded late, hand-assembles a proposal from old documents scattered across folders, performs a 40-hour peer review of a competitor\'s traffic study line by line, and tries to remember which past project is the right comparable — all while the billable engineering work waits.',
    'WITH AI: The RFP was flagged the day it posted; a first-draft proposal is already assembled from prior winning bids for the principal to refine; the peer-review assistant has surfaced the likely methodology flaws for the principal to validate in a quarter of the time; and the knowledge graph returns the five most comparable past studies in seconds. The expertise stays with the principal — the overhead does not.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('9.6  Why a Partner — vs. Hiring or Doing It Yourself', { color: CORE_BLUE }),
  buildTable(
    [
      { label: 'Path', weight: 1.6 },
      { label: 'Reality', weight: 5 },
    ],
    [
      ['DIY tools', 'Inexpensive, but RKE assembles, secures, and governs everything — and owns the three risks above alone'],
      ['Hire in-house', 'A capable AI leader typically costs $180K+/year and is scarce, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true, color: DARK_CHARCOAL }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — with proven builds (Section 8) and CISSP-led security', bold: true }],
    ],
    { headerColor: CORE_BLUE }
  ),
  p('Sources cited in this section: MIT Sloan Management (AI literacy); Anthropic (AI system design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework.', { italics: true, size: 18, spaceBefore: 100 }),];

// ============================================================
// SECTION 10 — THE AI GROWTH ENGINE (EXPANDED CENTERPIECE)
// ============================================================
const section8 = [
  ...sectionHeader('How AI Transforms RKE\'s Growth Engine', CORE_ORANGE, '10'),
  spacer(160),
  p('This section is the heart of the report. The seven customer personas are real, the competitive landscape is well understood, and the regulatory tailwinds (SB 743, CEQA litigation volume, infill housing pressure, AB 98 warehouse setbacks, and CARB SB 253/261 climate disclosure) all favor RKE. What is missing is a modern, AI-powered growth machine. The remainder of this section presents — concretely and tactically — what Technijian can build, operate, and measure for RKE in the next 12 months.'),

  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'AI Growth Engine Architecture', 620, 1.57),
  diagramCaption('Figure 10.0 — Public data sources flow into the Technijian AI layer; outputs reach each of the seven personas through dedicated channels.'),

  subHeader('10.1  Why AI Matters for a Specialized Engineering Consultancy'),
  p('Boutique engineering firms have always been outgunned on marketing. A small, principal-led firm cannot fund the content engine, RFP-tracking team, or CRM operation that a 1,000-person AEC giant maintains. Historically, that headcount asymmetry has been decisive — larger firms simply see more opportunities and respond faster. AI changes that math.'),
  p('A small firm with the right AI infrastructure can monitor every RFP platform in California, every permit filing in Southern California, every CEQA case docket, and every prime-contract award — continuously, automatically, and at a fraction of the investment a competitor spends on a single business development manager. AI does not replace RKE\'s engineers. It removes the marketing and pipeline-management overhead that currently consumes principal time.'),

  spacer(120),
  kpiRow([
    { number: '70%', label: 'Reduction in time-to-RFP-detection', color: CORE_BLUE },
    { number: '3x', label: 'Outbound contact volume', color: CORE_ORANGE },
    { number: '40%', label: 'Improvement in proposal cycle time', color: TEAL },
  ]),
  p('Modeled targets for a 90-day deployment of the Technijian AI growth stack. Actual results vary by execution; commitments are documented in a formal Statement of Work.', { italics: true, size: 18, align: AlignmentType.CENTER }),

  subHeader('10.2  Inbound AI — Owning the Search Layer'),
  p('RKE\'s inbound problem is not that it lacks expertise. It is that the expertise is not discoverable where buyers now look — Google\'s local pack, AI search engines, and AI-cited references inside ChatGPT, Perplexity, Claude, and Google AI Overviews. Inbound AI cements RKE as the undisputed technical authority on CEQA, VMT, and environmental compliance — capturing both traditional local search traffic and emerging AI-driven inquiries.'),

  h3('Local SEO for Municipalities and Developers'),
  p('Visibility in the local search pack is paramount for public agencies and local developers. Technijian deploys Google Business Profile optimization, local citation building across 50+ directories, NAP (Name, Address, Phone) consistency audits, and review-velocity programs. When a Director of Public Works searches "traffic impact study Newport Beach" or a developer searches "VMT screening Orange County," RKE appears at the top of the pack — not buried below Fehr & Peers and Urban Crossroads.'),

  h3('Answer Engine Optimization (AEO)'),
  p('Legal strategists and AEC professionals increasingly use AI search engines for regulatory research. Traditional SEO alone is insufficient. Technijian\'s AEO approach uses schema markup, direct-answer content formatting, and AI citation optimization so that when a user asks ChatGPT "How do I calculate VMT under SB 743?" RKE\'s materials are the source the engine recommends. AI search engines source from a smaller pool than Google — first-mover advantage in this space is the most valuable inbound investment available today.'),

  spacer(120),
  p('Here is the gap made concrete. When a buyer asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query right now:', { spaceBefore: 40 }),
  calloutBox(
    'Prompt: "Who are the top traffic and VMT engineering firms for a CEQA project in Orange County?"',
    [
      'TODAY — the AI assistant answers with whichever firms have the strongest content and third-party signals it can read: it names a couple of large regional players (Fehr & Peers, Urban Crossroads) and does NOT mention RK Engineering Group — even though RKE has 35+ years, 7,000+ projects, and the expert-witness depth those competitors lack. RKE is invisible at the exact moment the buyer is forming a shortlist.',
      'AFTER AEO — the same query returns RKE as a cited option ("RK Engineering Group is a Southern California traffic, VMT, and environmental engineering firm with deep SB 743 and expert-witness experience…"), with the SB 743 hub content and project case studies as the supporting evidence the assistant points to.',
    ],
    CORE_ORANGE
  ),
  p('(Illustrative of current AI-search behavior for this query class; the live result is captured as part of the discovery baseline — not a fabricated screenshot.)', { italics: true, size: 18 }),

  h3('Semantic SEO & Topic Authority'),
  p('Content is built using a Hub-and-Spoke model targeting featured snippets and semantic authority. Rather than chasing broad keywords, RKE publishes a tightly organized library of technical white papers and case studies on topics like CEQA litigation defense, acoustic impact mitigation, mixed-use shared parking modeling, and TDM plan design. Each hub article links to spoke articles answering specific sub-questions — a structure search engines and LLMs both reward. A 90-day content sprint can produce 25+ pieces ranked for high-intent queries.'),

  h3('Generative Content at Scale'),
  p('Technijian operates a content production system that combines retrieval-augmented generation (RAG) over RKE\'s existing project deliverables with human review by RKE principals. The result: case studies, white papers, and blog posts published weekly at the editorial quality bar a senior principal would set — without consuming the principal\'s time. This is the single largest lever for closing the marketing-surface-area gap against Fehr & Peers.'),

  spacer(120),
  calloutBox(
    'The Cost of Waiting',
    [
      'AI-search visibility compounds, and it rewards whoever optimizes first. Every quarter RKE is not cited, the assistants learn to answer "best VMT / CEQA traffic firm in Southern California" with Fehr & Peers or Urban Crossroads — and that default, once set in the training and retrieval data, is far harder and more expensive to dislodge than to claim now.',
      'The same applies to the RFP pipeline: every on-call solicitation detected late, or missed entirely, is a contract awarded to a competitor and an on-call roster RKE does not sit on for the next several years. The cost of waiting is not zero — it is a competitor becoming the default answer and the default vendor.',
    ],
    CRITICAL
  ),

  subHeader('10.3  Outbound AI — Real-Time Intent and Personalization'),
  p('AI lead generation shifts outbound from inefficient cold-calling to data-driven, high-intent prospecting. The objective: every outbound message lands at the exact moment the recipient has a project-shaped problem.'),

  h3('Real-Time Intent Signals — Targeting the Timeline Driver'),
  p('AI systems can process massive volumes of public data to identify real-time intent signals. Technijian builds a monitoring layer over public records — recent commercial land acquisitions, building permits, early-stage entitlement filings, and pre-application meeting calendars across all SoCal jurisdictions. When a developer files a notice of preparation for a 200-unit infill project in Orange County, RKE knows within 24 hours. A pre-written, personalized outreach offering early-stage VMT screening triggers automatically — landing exactly when the developer is realizing they need it.'),

  h3('Predictive Lead Scoring — Targeting the Design Integrator'),
  p('Prime AEC consultants rely heavily on sub-consultants for specialized tasks. Technijian\'s AI uses predictive lead scoring on behavioral signals and large public datasets — bid award announcements, public meeting minutes, prime-contract wins — to identify precisely when massive programmatic EIRs or General Plan updates are awarded. RKE executes targeted outreach to the winning firm\'s Project Director offering low-friction management of specialized traffic and noise appendices, often before the prime has even started sub-consultant outreach.'),

  h3('Segmented Personalized Outreach — Public Agencies & Attorneys'),
  p('For Public Agencies, campaigns are timed to state legislative milestones. When OPR releases a new SB 743 technical advisory, AI-drafted outreach to City Traffic Engineers across SoCal lands within 48 hours — offering complimentary one-hour briefings on what changed and what their agency needs to update. For Legal Strategists, AI-curated case-law digests featuring CEQA decisions and expert-witness commentary keep RKE\'s principals top of mind during retainer selection.'),

  h3('Conversation Intelligence'),
  p('When outreach connects, AI conversation intelligence captures every sales call, transcribes it, extracts the prospect\'s objections and needs, and feeds the insights back into the CRM. Over months, the system learns which messages work for which personas and continuously refines outreach copy. This is how a small firm builds the institutional sales knowledge that takes a large firm a decade to accumulate.'),

  subHeader('10.4  Internal AI — Capacity Multiplication for Principals'),
  p('Outbound AI fills the pipeline. Internal AI lets RKE close more of it. Four internal AI tools convert principal time from administrative overhead back into billable engineering work.'),

  h3('Generative Proposal Engine'),
  p('RFP responses are time-consuming. A typical traffic engineering RFP requires 40 to 80 hours of senior staff time. Technijian builds a proposal engine that ingests RKE\'s prior winning proposals, applicable case studies, and the new RFP\'s evaluation criteria, then produces a complete first draft in under 30 minutes. The principal reviews, adjusts, and submits in a fraction of the original cycle — preserving win quality while doubling response capacity.'),

  h3('AI Peer-Review Assistant'),
  p('RKE\'s peer-review work — examining competing traffic studies for methodological flaws — is high-value but time-intensive. An AI assistant trained on prior RKE peer reviews and the relevant municipal guidelines flags likely issues in minutes: improper baseline data, missing modeling steps, unsupported trip generation assumptions, or missed CEQA precedents. The principal validates the AI\'s findings rather than performing the entire review from scratch. A 40-hour peer review compresses to 12 hours of focused expert validation.'),

  h3('CEQA Litigation Watch'),
  p('A continuously updated intelligence feed scans California Superior and Appellate court filings, OPR advisories, and major firm publications. RKE principals receive a weekly digest of CEQA cases — what was filed, which methodologies were challenged, which experts testified, and how the courts ruled. This intelligence directly supports business development with attorneys and gives RKE first-mover insight on emerging legal theories.'),

  h3('Knowledge Graph of Past Projects'),
  p('Over 35 years, RKE has accumulated thousands of project deliverables. A semantic knowledge graph indexes every study, comparable site, mitigation recommendation, and traffic count — making the entire institutional memory searchable in seconds. When a new project comes in, the principal asks one question and surfaces five comparable past studies, the assumptions used, and the results. New hires reach productivity in weeks instead of years.'),

  subHeader('10.5  AI Tools Matched to Each Persona'),
  p('Every AI initiative below maps to an existing Technijian productized service. The "Technijian Service" column identifies which My AI, My SEO, or My Dev offering delivers the capability. This avoids invoice surprises and makes the engagement structure explicit from day one.'),
  spacer(120),
  buildTable(
    [
      { label: 'Persona', weight: 16 },
      { label: 'AI Tool / Initiative', weight: 26 },
      { label: 'How It Wins Business', weight: 34 },
      { label: 'Technijian Service', weight: 24 },
    ],
    [
      [
        { text: 'Regulatory Guardian', bold: true, color: CORE_BLUE },
        'RFP Intelligence Engine + Legislative Tracking',
        'Monitors PlanetBids, BidNet Direct, BidSync, OCTA CAMMNET continuously. The moment a SoCal city posts a traffic or VMT on-call RFP, RKE knows. AI auto-drafts a tailored response within hours.',
        'My AI (Document Intelligence, proven on FINRA RFPs) + My Dev (custom integration)',
      ],
      [
        { text: 'Regulatory Guardian', bold: true, color: CORE_BLUE },
        'SB 743 Knowledge Agent (white-labeled)',
        'Public Q&A assistant on rkengineer.com answering SB 743 implementation questions — establishes RKE as the regional authority and generates warm inbound leads from city planners.',
        'My Dev (SDLC v7.0) + My AI (RAG layer)',
      ],
      [
        { text: 'Timeline Driver', bold: true, color: CORE_ORANGE },
        'Developer Permit Monitor + Outreach',
        'Tracks land acquisitions, NOPs, and pre-application filings across SoCal. Triggers personalized outreach when a developer needs VMT screening — exactly the moment the prospect needs it.',
        'My Dev (custom monitor) + My AI (personalization engine)',
      ],
      [
        { text: 'Timeline Driver', bold: true, color: CORE_ORANGE },
        'Self-Serve VMT Screening Calculator',
        'Web calculator on rkengineer.com lets a developer enter project parameters and receive a preliminary VMT screen in 60 seconds. Converts cold visitors into engaged leads while demonstrating RKE technical authority.',
        'My Dev (SDLC v7.0) + My SEO (lead capture integration)',
      ],
      [
        { text: 'Design Integrator', bold: true, color: TEAL },
        'Prime Contract Award Tracker',
        'Predictive scoring identifies when AECOM, Stantec, HDR, or Kimley-Horn wins major EIRs or General Plan updates. Triggers outreach to the prime\'s project director offering specialized sub-consultant bundling.',
        'My AI (predictive scoring) + My Dev (data pipelines)',
      ],
      [
        { text: 'Design Integrator', bold: true, color: TEAL },
        'Cross-Reference Knowledge Graph',
        'When proposing on a prime\'s project, the AI surfaces every comparable RKE-led prime-sub engagement so RKE can demonstrate fit in the cover letter — increasing teaming-bid win rate.',
        'My AI (Weaviate/Obsidian knowledge system — proven build)',
      ],
      [
        { text: 'Legal Strategist', bold: true, color: CRITICAL },
        'CEQA Litigation Watch + Attorney CRM',
        'Tracks CEQA filings naming RKE-relevant project typologies; identifies which attorneys are repeatedly retained; triggers warm outreach with a curated case digest demonstrating expertise.',
        'My AI (Multi-Agent SEO Platform pattern) + My Dev (CRM build)',
      ],
      [
        { text: 'Legal Strategist', bold: true, color: CRITICAL },
        'Expert Witness Portfolio Optimizer',
        'AI-generated, attorney-facing landing pages presenting Robert Kahn\'s expert testimony record, formatted for the legal research workflow. Tracks attorney engagement to identify warm prospects.',
        'My Dev (SDLC v7.0) + My SEO (AEO content layer)',
      ],
      [
        { text: 'Industrial Logistics Developer', bold: true, color: CHARTREUSE },
        'Warehouse Pipeline Monitor',
        'Tracks Inland Empire warehouse permit filings, SCAQMD Rule 2305 advisories, and AB 98 setback challenges. Outreach triggers when a developer faces a fresh setback enforcement action.',
        'My Dev (custom monitor) + My AI (signal extraction)',
      ],
      [
        { text: 'Institutional Steward', bold: true, color: DARK_CHARCOAL },
        'Master Plan Opportunity Tracker',
        'Monitors bond-program announcements, UC/CSU capital plans, and school district Measure approvals. Surfaces opportunities 18–24 months before formal RFP issuance.',
        'My AI (predictive scoring) + My SEO (institutional content authority)',
      ],
      [
        { text: 'ESG / Sustainability Officer', bold: true, color: TEAL },
        'ESG Attestation Methodology Bridge',
        'Repackages RKE\'s court-proven GHG methodology as an SB 253/261 attestation deliverable; targets newly-mandated CARB reporters with a defensible methodology authority pitch.',
        'My AI (methodology adapter) + My SEO (AEO targeting ESG queries)',
      ],
    ]
  ),];

// ============================================================
// SECTION 10 — PROJECTED BUSINESS IMPACT (NEW)
// ============================================================
const section9 = [
  ...sectionHeader('Projected Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(160),
  p('The financial case for AI-powered growth must be specific. The projections below are modeled estimates based on benchmark performance Technijian has observed in comparable specialized professional services firms. They are not contractual commitments — exact results depend on RKE\'s market posture, conversion discipline, and pricing. They are presented to anchor planning discussions.'),
  spacer(120),
  calloutBox(
    'AI as a Managed Investment — Not a Leap of Faith',
    [
      'The reason most AI spending disappoints is not the technology — it is the lack of measurement. McKinsey\'s 2025 State of AI finds roughly 88% of companies now use AI, but only about a third see a meaningful bottom-line impact; the difference is discipline, not budget.',
      'Technijian runs every engagement with stage-gates: we track adoption, then operational improvement, then financial benefit against total cost — and if a pilot does not clear its cost at the gate, we stop and re-scope. RKE carries the upside, not blind risk.',
    ],
    CORE_ORANGE
  ),
  spacer(200),

  subHeader('11.1  The Entry Offer — The 90-Day AI Visibility Pilot'),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up RKE\'s AI-search presence (so RKE becomes the cited answer on SB 743 and VMT questions) and the RFP intelligence engine, and proves the lift before any larger build is discussed. It maps to the recommended starting posture in Section 11.5: My SEO Tier 3 plus AI Search Optimization, plus the first persona outreach loop.'),
  buildTable(
    [
      { label: 'What\'s Included', weight: 3 },
      { label: 'Detail', weight: 4 },
      { label: 'Investment', weight: 2 },
    ],
    [
      [{ text: 'My SEO — Tier 3 + AI Search Optimization', bold: true, color: DARK_CHARCOAL }, 'GEO/AEO layer so RKE is cited on SB 743 / VMT queries; SB 743 hub article; Google Business Profile + 50-directory NAP audit', '$1,000/mo + $200/mo'],
      [{ text: 'RFP Intelligence Engine (pilot)', bold: true, color: DARK_CHARCOAL }, 'Continuous monitoring of PlanetBids, BidNet Direct, BidSync, OCTA CAMMNET; daily digest to the BD lead', 'Scoped in SOW'],
      [{ text: 'Executive AI Workshop', bold: true, color: DARK_CHARCOAL }, 'Half-day kickoff with RKE\'s actual project data; validates persona priorities and 90-day KPIs', 'One-time'],
      [{ text: 'ENTRY PILOT — 90 DAYS', bold: true, color: CORE_BLUE }, 'Fixed scope, published rates, no large up-front build', { text: 'Month-to-month, no lock-in', bold: true, color: CORE_BLUE }],
    ],
    { headerColor: CORE_BLUE }
  ),
  spacer(120),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, RKE is cited by at least one major AI assistant (ChatGPT, Perplexity, Claude, or Google AI Overviews) for a high-intent SB 743 / VMT / CEQA query, AND the RFP intelligence engine has surfaced at least one qualifying opportunity RKE would otherwise have missed.',
      'Our commitment: the entry program is month-to-month, no lock-in, and no obligation to continue if it doesn\'t hit the metric by day 90. If the pilot has not moved the needle, you are under no obligation to continue — and we will tell you honestly whether it is worth continuing. You carry the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(200),

  subHeader('11.2  Top-Line Pipeline Lift'),
  kpiRow([
    { number: '+45%', label: 'Qualified opportunities / quarter', color: CORE_BLUE },
    { number: '+22%', label: 'RFP win rate', color: CORE_ORANGE },
    { number: '−38%', label: 'Cost per qualified lead', color: TEAL },
    { number: '−60%', label: 'Time from RFP post to draft response', color: PASS },
  ]),
  spacer(200),
  p('These four metrics, together, are the difference between organic growth and exponential growth. A 45% lift in qualified opportunities at a 22% improvement in win rate is — in compounding effect — a near-doubling of new contract value over 18 months, holding pricing constant.', { italics: true, size: 20 }),

  subHeader('11.3  Investment Recovery Estimate (Year 1)'),
  buildTable(
    [
      { label: 'AI Initiative', weight: 32 },
      { label: 'Y1 Investment (modeled)', weight: 22 },
      { label: 'Y1 Pipeline Value (modeled)', weight: 22 },
      { label: 'ROI Multiple', weight: 24 },
    ],
    [
      [{ text: 'Inbound AI (SEO + AEO + Content Engine)', bold: true, color: DARK_CHARCOAL }, '$60,000 – $90,000', '$300,000 – $600,000', '4x – 7x'],
      [{ text: 'Outbound AI (RFP + Permit Monitor + CRM)', bold: true, color: DARK_CHARCOAL }, '$45,000 – $75,000', '$400,000 – $800,000', '8x – 11x'],
      [{ text: 'Internal AI (Proposal + Peer Review Assistants)', bold: true, color: DARK_CHARCOAL }, '$35,000 – $55,000', '$200,000 – $350,000 (capacity recovered)', '5x – 6x'],
      [{ text: 'Self-Serve VMT Calculator + Knowledge Agent', bold: true, color: DARK_CHARCOAL }, '$25,000 – $40,000', '$150,000 – $300,000 (inbound leads)', '6x – 7x'],
      [{ text: 'Total program', bold: true, color: CORE_BLUE }, { text: '$165,000 – $260,000', bold: true, color: CORE_BLUE }, { text: '$1,050,000 – $2,050,000', bold: true, color: CORE_BLUE }, { text: '6x – 8x', bold: true, color: CORE_BLUE }],
    ]
  ),
  spacer(200),
  p('Investment ranges reflect the full Technijian engagement: build, integrate, train, and operate. They include licensing for the AI infrastructure, data subscriptions for public-records monitoring, and ongoing operational support. Pipeline value reflects projected incremental new-contract revenue and recovered principal capacity — both contribute to firm growth.', { italics: true, size: 20 }),

  subHeader('11.4  Capacity Recovery Per Principal'),
  kpiRow([
    { number: '~250', label: 'Hours/yr recovered from proposal automation', color: CORE_BLUE },
    { number: '~120', label: 'Hours/yr recovered from peer-review AI', color: CORE_ORANGE },
    { number: '~80', label: 'Hours/yr recovered from intelligence digests', color: TEAL },
  ]),
  p('A single RKE principal recovers approximately 450 billable-equivalent hours per year — roughly 25% of their working capacity. Multiplied across the principal team, this is the single largest hidden return of the AI program.', { italics: true, size: 20 }),

  subHeader('11.5  Technijian Service Investment Map'),
  p('The investment ranges above resolve into specific Technijian productized services. RKE knows exactly what is being purchased, at what monthly investment, and which AI initiative it powers.'),
  spacer(120),
  buildTable(
    [
      { label: 'Technijian Service', weight: 20 },
      { label: 'Recommended Tier', weight: 22 },
      { label: 'Monthly Investment', weight: 16 },
      { label: 'What It Delivers for RKE', weight: 42 },
    ],
    [
      [
        { text: 'My SEO', bold: true, color: CORE_BLUE },
        'Tier 3 (Blog Content for 5 Keywords)',
        '$1,000 / mo',
        '12-month commitment. Unlimited service hours. Includes Tier 1 (Web design + hosting) and Tier 2 (SEO Optimization). Foundation for the Hub-and-Spoke content engine and inbound persona loops.',
      ],
      [
        { text: 'My SEO add-on', bold: true, color: CORE_BLUE },
        'AI Search Optimization',
        '$200 / mo',
        'Critical for Answer Engine Optimization. Schema markup, semantic SEO, brand-entity optimization, and AI-driven keyword research. Targets ChatGPT, Perplexity, Claude, and Google AI Overviews directly.',
      ],
      [
        { text: 'My SEO add-on', bold: true, color: CORE_BLUE },
        'PR Releases (quarterly)',
        '$150 / mo',
        'Quarterly press releases announcing RKE expert-witness wins, landmark VMT methodology contributions, and major project milestones. Distributed to FOX, ABC, NBC affiliates and 300+ live placements. Builds authority signal for AEO and attorney outreach.',
      ],
      [
        { text: 'My SEO add-on', bold: true, color: CORE_BLUE },
        'Content Syndication',
        '$200 / mo',
        'Distribution of RKE hub-and-spoke articles to 250+ websites including media outlets and engineering news channels. Drives backlink authority for the SB 743 and CEQA content pillars.',
      ],
      [
        { text: 'My AI', bold: true, color: CORE_ORANGE },
        'Fractional AI Advisor (retained)',
        'Investment scoped in SOW',
        'Monthly retained engagement providing AI leadership for RKE\'s growth program. Strategic guidance, roadmap management, vendor oversight, implementation QA. Replaces the cost of hiring an internal Director of Marketing Technology.',
      ],
      [
        { text: 'My AI', bold: true, color: CORE_ORANGE },
        'Fixed-Scope Implementation',
        'Per SOW',
        'Discrete builds: RFP Document Intelligence Engine, AI Peer-Review Assistant (LLM Council), Project Knowledge Graph (Weaviate/Obsidian), Conversation Intelligence layer. Each ships with acceptance criteria and a measurable outcome.',
      ],
      [
        { text: 'My AI', bold: true, color: CORE_ORANGE },
        'Executive AI Workshop',
        'Half-day or full-day briefing',
        'Kickoff event for RKE leadership team. Live demos with RKE\'s actual project data. Validates persona priorities, sets KPI targets, and aligns principals on the 90-day Foundation phase.',
      ],
      [
        { text: 'My Dev', bold: true, color: TEAL },
        'Custom Application Development (SDLC v7.0)',
        'Per project, T&M or fixed',
        'Builds the client-facing tools: Self-Serve VMT Calculator, SB 743 Knowledge Agent, Developer Permit Monitor, Prime-Contract Tracker, Expert Witness Portfolio Site, Attorney CRM. SDLC v7.0 ships 3–5× faster than traditional dev shops.',
      ],
      [
        { text: 'My Dev', bold: true, color: TEAL },
        'Managed Application Services',
        'Post-launch monthly',
        'Ongoing maintenance, enhancements, and architecture ownership for all custom-built RKE tools. Ensures the AI growth stack stays operational and improves over time.',
      ],
    ]
  ),
  spacer(200),
  calloutBox(
    'Engagement Structure',
    'My SEO tiers are cumulative — Tier 3 at $1,000/mo includes everything in Tier 1 and Tier 2. The 12-month commitment with unlimited monthly service hours is the standard My SEO posture. My AI and My Dev engagements are scoped in a Statement of Work with discrete deliverables, acceptance criteria, and timeline. Final pricing is documented in a Master Services Agreement and corresponding SOWs before any work begins.',
    CORE_BLUE
  ),];

// ============================================================
// SECTION 11 — IMPLEMENTATION ROADMAP (NEW)
// ============================================================
const section10 = [
  ...sectionHeader('Implementation Roadmap (90 / 180 / 365 Days)', CORE_BLUE, '12'),
  spacer(160),
  p('Technijian recommends a phased deployment. The first 90 days establish the foundation: inbound SEO/AEO, the RFP intelligence engine, and one persona-specific outreach loop. The next 90 days add the AI proposal engine, the VMT self-serve calculator, and the CEQA litigation watch. The full year completes the program with the knowledge graph, conversation intelligence, and continuous-optimization layer.'),

  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, '90/180/365 Implementation Timeline', 620, 1.57),
  diagramCaption('Figure 12.0 — Three phases with milestones plotted on day-of-year axis; cumulative outcomes shown beneath each phase.'),

  subHeader('12.1  Days 1–90: Foundation'),
  buildTable(
    [
      { label: 'Week', weight: 12 },
      { label: 'Milestone', weight: 38 },
      { label: 'Output / Acceptance', weight: 50 },
    ],
    [
      ['1–2', { text: 'Discovery & Brand Workshop', bold: true, color: DARK_CHARCOAL }, 'Audit existing rkengineer.com, content, citations, and CRM. Define ICPs, message map, and KPIs. Sign-off on persona-specific outreach copy.'],
      ['3–4', { text: 'Technical SEO + AEO Foundation', bold: true, color: DARK_CHARCOAL }, 'Schema markup, Core Web Vitals optimization, Google Business Profile, NAP audit across 50+ directories. AEO content templates published.'],
      ['5–8', { text: 'RFP Intelligence Engine Live', bold: true, color: DARK_CHARCOAL }, 'Continuous monitoring of PlanetBids, BidNet Direct, BidSync, OCTA CAMMNET. Daily digest delivered to BD lead. AI auto-drafts first-pass response to matched RFPs.'],
      ['9–10', { text: 'Hub Content Sprint #1', bold: true, color: DARK_CHARCOAL }, 'Six pillar articles published: CEQA defense, SB 743 implementation, VMT calculation, shared parking, acoustical mitigation, TDM plan design.'],
      ['11–12', { text: 'Persona 1 Outreach Loop (Public Agencies)', bold: true, color: DARK_CHARCOAL }, 'AI-drafted, principal-reviewed outreach to City Traffic Engineers across SoCal. First measurable lift in inbound RFP invitations.'],
    ]
  ),

  subHeader('12.2  Days 91–180: Acceleration'),
  buildTable(
    [
      { label: 'Week', weight: 12 },
      { label: 'Milestone', weight: 38 },
      { label: 'Output / Acceptance', weight: 50 },
    ],
    [
      ['13–16', { text: 'AI Proposal Engine v1', bold: true, color: DARK_CHARCOAL }, 'Ingests prior winning proposals, builds RAG index. Reduces proposal cycle from 60 hours to under 20 hours for a typical TIA RFP.'],
      ['17–20', { text: 'Developer Permit Monitor + Persona 2 Loop', bold: true, color: DARK_CHARCOAL }, 'Permit and NOP scrapers across SoCal jurisdictions. Personalized outreach to entitlement managers within 24 hours of filing detection.'],
      ['21–24', { text: 'Self-Serve VMT Calculator', bold: true, color: DARK_CHARCOAL }, 'Public-facing calculator on rkengineer.com. Captures developer leads with project parameters; auto-routes to BD with a pre-populated context brief.'],
      ['25–26', { text: 'CEQA Litigation Watch + Persona 4 Loop', bold: true, color: DARK_CHARCOAL }, 'Weekly litigation digest live. Outreach to environmental and land-use attorneys begins with curated case-law commentary.'],
    ]
  ),

  subHeader('12.3  Days 181–365: Compounding'),
  buildTable(
    [
      { label: 'Quarter', weight: 14 },
      { label: 'Milestone', weight: 36 },
      { label: 'Output / Acceptance', weight: 50 },
    ],
    [
      ['Q3', { text: 'AI Peer-Review Assistant', bold: true, color: DARK_CHARCOAL }, 'Trained on prior RKE peer reviews. Compresses a 40-hour review to ~12 hours of expert validation. Frees principal time for higher-value testimony work.'],
      ['Q3', { text: 'Prime AEC Award Tracker + Persona 3 Loop', bold: true, color: DARK_CHARCOAL }, 'Tracks major EIR awards. Triggers outreach to prime project directors offering specialized sub-consultant bundling.'],
      ['Q4', { text: 'Knowledge Graph + Conversation Intelligence', bold: true, color: DARK_CHARCOAL }, 'Full institutional memory indexed. Sales-call transcription and objection extraction feed continuous outreach optimization.'],
      ['Q4', { text: 'Annual Review & Renewal Planning', bold: true, color: DARK_CHARCOAL }, 'Quarterly business review across all seven persona loops. Identify the next year\'s expansion: predictive bid pricing, advanced acoustical modeling AI, and integration with CRM analytics.'],
    ]
  ),];

// ============================================================
// SECTION 12 — QUICK WINS (NEW)
// ============================================================
const section11 = [
  ...sectionHeader('Quick Wins: What RKE Can Start in Week 1', CORE_ORANGE, '13'),
  spacer(160),
  p('Strategy is meaningless without immediate motion. The following five actions can be initiated within seven days of report acceptance. None of them require a contract with Technijian to begin — they are presented to demonstrate the kind of urgency the market rewards.'),
  spacer(200),

  calloutBox('Quick Win #1 — Claim every directory listing', [
    'In the first 72 hours, audit rkengineer.com\'s Google Business Profile, Bing Places, and the major engineering directories (ENR, EnvironmentalXPRT, BlueBook). Ensure NAP (Name, Address, Phone) consistency across all 50+ directories that AI search engines use for citation.',
    'Owner: Marketing lead. Investment: < $1,000. Impact: Local pack visibility improves within 14 days.',
  ], CORE_BLUE),
  spacer(200),

  calloutBox('Quick Win #2 — Publish a single SB 743 explainer article', [
    'A 2,500-word, technically rigorous explainer on SB 743 implementation — written for City Traffic Engineers — published on rkengineer.com with proper schema markup. This is the cornerstone hub article that anchors the AEO strategy.',
    'Owner: Principal + technical writer. Investment: 1 week of senior time. Impact: First AI-citation surface area; first measurable inbound from city planner research queries.',
  ], CORE_ORANGE),
  spacer(200),

  calloutBox('Quick Win #3 — Stand up the RFP scan today', [
    'Configure a free trial monitoring of PlanetBids, BidNet Direct, and OCTA CAMMNET for traffic, transportation, and environmental keywords across all SoCal jurisdictions. Daily digest to the BD lead\'s inbox starts within 48 hours.',
    'Owner: Business development. Investment: minimal. Impact: Immediate visibility into the RFP pipeline; first response to a previously-missed RFP within 30 days.',
  ], TEAL),
  spacer(200),

  calloutBox('Quick Win #4 — Document three case studies in narrative form', [
    'Eastvale Square, Schools First, and one Brentwood-style litigation engagement. Written as compelling, persona-specific narratives — not project sheets — and used immediately in outreach and the website.',
    'Owner: Marketing + principals. Investment: 2 weeks. Impact: First high-quality case study content that converts cold attention into qualified conversations.',
  ], CORE_BLUE),
  spacer(200),

  calloutBox('Quick Win #5 — Build the attorney short list', [
    'Compile the 30 to 50 land-use and environmental attorneys in SoCal who have retained RKE as expert witness, or who litigate the most CEQA cases. This becomes the seed list for the Legal Strategist outreach loop.',
    'Owner: Principals. Investment: half a week. Impact: Foundation for sustained Persona 4 outbound, the highest-margin RKE practice line.',
  ], CRITICAL),];

// ============================================================
// SECTION 14 — QUESTIONS WE USUALLY GET (FAQ, NEW)
// ============================================================
const sectionFaq = [
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '14'),
  spacer(160),
  p('The honest answers to the questions RKE leadership is most likely asking right now.'),
  spacer(120),
  buildTable(
    [
      { label: 'Question', weight: 3 },
      { label: 'Our Honest Answer', weight: 5 },
    ],
    [
      [{ text: 'We already work with a marketing or web vendor. Why add Technijian?', bold: true, color: DARK_CHARCOAL }, 'Keep them if they are doing good work. We add the layer most agencies do not build: AI-search optimization (AEO) so RKE is cited on SB 743/VMT questions, the RFP intelligence engine, and the internal AI (proposal, peer-review, knowledge graph) that no SEO agency provides. We run alongside an existing vendor, not over them.'],
      [{ text: 'Isn\'t AI mostly hype right now?', bold: true, color: DARK_CHARCOAL }, 'A lot of it is. That is why this blueprint starts with simple, proven automations that pay back fast — RFP detection, AEO content, proposal drafting — not autonomous "agents" running your practice. We use the simplest tool that works, measure it, and only expand what earns its place. Every component is already in production for a Technijian client (Section 8).'],
      [{ text: 'Is our data — project files, expert-witness materials, peer reviews — safe?', bold: true, color: DARK_CHARCOAL }, 'Yes. Sensitive data never touches a public AI model; we deploy private, governed systems with human review on anything client-facing or litigation-bound, led by a CISSP-certified team. Data governance is part of the discovery in the entry pilot (Section 11.1).'],
      [{ text: 'We\'re a lean, principal-led firm. Do we have the bandwidth for this?', bold: true, color: DARK_CHARCOAL }, 'The point is the opposite — to give your principals back hours, not add work. Technijian runs the build and the cadence; your involvement is a short monthly strategy session plus reviewing what we draft. The internal AI tools recover roughly 450 billable-equivalent hours per principal per year (Section 11.4).'],
      [{ text: 'What if it doesn\'t work?', bold: true, color: DARK_CHARCOAL }, 'The entry program is a fixed-price 90-day pilot with a defined success metric (Section 11.1), month-to-month with no lock-in. If it has not moved the needle by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth it.'],
      [{ text: 'What does it really cost?', bold: true, color: DARK_CHARCOAL }, 'The entry pilot runs on published My SEO rates — Tier 3 at $1,000/mo plus AI Search Optimization at $200/mo — with the RFP engine and workshop scoped in a short SOW, month-to-month and no large up-front build. The full-year program is profiled in Section 11, but only after the pilot proves the lift.'],
    ],
    { headerColor: CORE_BLUE }
  ),];

// ============================================================
// SECTION 15 — CONCLUSION
// ============================================================
const conclusion = [
  ...sectionHeader('Conclusion', CORE_BLUE, '15'),
  spacer(160),
  p('RK Engineering Group operates in an industry where baseline technical proficiency in drafting a traffic model or measuring ambient decibels is merely the minimum expectation for entry. True success and sustainable market dominance in the California architecture, engineering, and construction landscape require a profound, almost psychological understanding of the state\'s draconian regulatory mandates, the volatile political dynamics of local city councils, and the acute financial and legal pressures faced by those attempting to build within its borders.'),
  p('RKE has that understanding. Its 35-year track record, multi-disciplinary integration, and expert-witness credibility are competitive moats that national firms with ten times the headcount cannot replicate. What RKE lacks — and what every firm of its size lacks — is the marketing surface area and pipeline visibility of its larger competitors.'),
  p('Both deficits are solvable. AI does not replace RKE\'s engineers. It removes the marketing and pipeline-management overhead currently consuming principal time, and it amplifies every outbound touch with intelligence the largest competitors cannot match. The seven target personas — The Regulatory Guardian, The Timeline Driver, The Design Integrator, The Legal Strategist, The Industrial Logistics Developer, The Institutional Steward, and the ESG / Sustainability Officer — can each be reached at scale, with personalization, and at a fraction of the investment a traditional marketing buildout would require. Every component of the engine has been proven in production for an existing Technijian client — the work for RKE is configuration and integration, not invention.'),
  p('Technijian is prepared to design, build, and operate this program in partnership with RKE leadership. The next step is a focused planning session to validate the personas, prioritize the 90-day milestones, and execute the Quick Wins outlined in Section 13. We look forward to that conversation.'),

  spacer(300),
  calloutBox(
    'Next Steps',
    [
      '1. Schedule a 60-minute strategy session with Technijian to validate this report\'s assumptions and refine priorities for RKE.',
      '2. Authorize the 90-day Foundation phase (Section 12.1) to begin within two weeks of the strategy session.',
      '3. Identify the RKE principal who will sponsor the program and the operational lead who will hold the Technijian team accountable to weekly milestones.',
    ],
    CORE_ORANGE
  ),];

// ============================================================
// SECTION 14 — ABOUT TECHNIJIAN
// ============================================================
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, '16'),
  spacer(160),
  p('Technijian is a full-spectrum IT services partner founded in 2000 by Ravi Jain. For more than 25 years we have served small and mid-sized businesses with managed IT services, CrowdStrike-powered cybersecurity, cloud infrastructure, compliance frameworks (HIPAA, PCI, SOC 2, GDPR), and AI-driven software development.'),
  p('Our Technijians pod model assigns a dedicated team to each client, providing deep institutional knowledge and eliminating the fragmented experience common with other managed service providers. With offices in Irvine, California and Panchkula, India, we deliver 24/7 global support without additional investment. Our cybersecurity-first, AI-forward approach helps businesses use technology as a competitive advantage — not a back-office afterthought.'),

  subHeader('Productized Services That Power the RKE Engagement', CORE_BLUE),
  p('Technijian delivers through a productized service catalog — predictable, transparent, and operationally proven. Three services anchor the RKE engagement:'),
  bulletRuns([{ text: 'My AI — ', bold: true, color: CORE_BLUE }, { text: 'AI strategy and hands-on implementation. Documented results include a Multi-Agent SEO Automation Platform (70% content time reduction), AI Document Intelligence for FINRA broker-dealers (RFP response: days to minutes), and a multi-LLM Council architecture deployed in production. Engagement models: Fixed-Scope, Flexible Consulting, Fractional AI Advisor, Executive AI Workshops.' }]),
  bulletRuns([{ text: 'My SEO — ', bold: true, color: CORE_BLUE }, { text: 'A 12-month, unlimited-service-hours SEO and digital marketing engagement. Five cumulative tiers from $500–$1,500 per month. AI Search Optimization, Content Syndication (250+ outlets), and quarterly PR Releases (FOX, ABC, NBC affiliates) available as add-ons. The recommended RKE starting posture: Tier 3 plus AI Search Optimization plus PR Releases.' }]),
  bulletRuns([{ text: 'My Dev — ', bold: true, color: CORE_BLUE }, { text: 'Custom application development under SDLC v7.0, an AI-native methodology integrating Claude Code, Figma Make, GitHub, and multi-agent orchestration. Ships 3–5× faster than traditional shops. Engagement models: Fixed-Scope Project, Time & Materials, Staff Augmentation, Managed Application Services.' }]),

  spacer(200),
  subHeader('Why RKE Should Partner With Technijian', CORE_BLUE),
  bulletRuns([{ text: 'Engineering-services pedigree. ', bold: true, color: DARK_CHARCOAL }, { text: 'We understand specialized professional services firms — including their margin structure, principal-time economics, and the realities of relationship-driven sales.' }]),
  bulletRuns([{ text: 'AI delivered as a managed service. ', bold: true, color: DARK_CHARCOAL }, { text: 'We do not hand RKE an AI toolkit and walk away. We build, integrate, train, and operate the entire stack on RKE\'s behalf.' }]),
  bulletRuns([{ text: 'Documented program governance. ', bold: true, color: DARK_CHARCOAL }, { text: 'Every initiative ships with a Statement of Work, weekly milestones, KPI dashboard, and a quarterly business review with RKE leadership.' }]),
  bulletRuns([{ text: 'Pricing aligned with outcomes. ', bold: true, color: DARK_CHARCOAL }, { text: 'Engagement is structured around tangible deliverables — qualified opportunities, RFP responses, content velocity — not unmeasured retainer hours.' }]),
  bulletRuns([{ text: 'Industries already served. ', bold: true, color: DARK_CHARCOAL }, { text: 'Real Estate & Property Management, Financial Services & FINRA, Healthcare & HIPAA, Legal & Professional Services, Technology & SaaS, Manufacturing & Distribution. RKE\'s engineering consultancy use case sits squarely inside our existing competency footprint.' }]),

  spacer(300),
  subHeader('Contact', CORE_BLUE),
  buildTable(
    [
      { label: 'Channel', weight: 30 },
      { label: 'Detail', weight: 70 },
    ],
    [
      [{ text: 'USA Headquarters', bold: true, color: DARK_CHARCOAL }, '18 Technology Dr., Ste 141, Irvine, CA 92618, United States'],
      [{ text: 'India Delivery Center', bold: true, color: DARK_CHARCOAL }, 'Plot No. 07, 1st Floor, Panchkula IT Park, Panchkula, Haryana 134109, India'],
      [{ text: 'Main', bold: true, color: DARK_CHARCOAL }, '+1 949.379.8499  (reaches USA and India teams)'],
      [{ text: 'Sales direct', bold: true, color: DARK_CHARCOAL }, '+1 949.379.8500  ·  sales@technijian.com'],
      [{ text: 'Web', bold: true, color: DARK_CHARCOAL }, 'technijian.com'],
      [{ text: 'Founder & CEO', bold: true, color: DARK_CHARCOAL }, 'Ravi Jain  ·  rjain@technijian.com'],
    ]
  ),];

// ============================================================
// SECTION 14 — APPENDIX: WORKS CITED
// ============================================================
const works = [
  ['1', 'RK Engineering: Home', 'https://rkengineer.com/'],
  ['2', 'Projects — RK Engineering', 'https://rkengineer.com/projects/'],
  ['3', 'Mitigating VMT from Highway Expansion Projects (UC ITS)', 'https://ucits.org/research_products/policy-brief-mitigating-vmt-from-highway-expansion-projects-early-insights-from-california/'],
  ['4', 'SB 743 Frequently Asked Questions — California Office of Land Use and Climate Innovation', 'https://lci.ca.gov/ceqa/sb-743/faq.html'],
  ['5', 'Letter to LA City Planning Commission re: VTT-74865', 'https://cityclerk.lacity.org/onlinedocs/2021/21-0022_misc_AR_PLUM_03-01-21.pdf'],
  ['6', 'Respondent\'s Brief — Del Mar Union School District CEQA Litigation', 'https://www.dmusd.org/documents/Measure-MM/Del-Mar-Heights-School-Rebuild-Planning/CEQA-Litigation/CEQA_DMUSD_Opposition_Brief.pdf'],
  ['7', 'Mexin Teme Winery Noise Impact Study, County of Riverside', 'https://planning.rctlma.org/sites/g/files/aldnop416/files/2025-01/Appendix%20H%20-%20PPT220010%20-%20Noise%20-%209-15-2022.pdf'],
  ['8', 'Ginkgo Stonehouse Residential Project DEIR, City of Sierra Madre', 'https://www.sierramadreca.gov/media/b5cigbay/revised_public_deir_ginkgo_stonehouse_residential_project_december_2025.pdf'],
  ['9', 'City of Beaumont 2nd Street Improvement Project RFP', 'https://mccmeetingspublic.blob.core.usgovcloudapi.net/beaumntca-meet-e3bb2b06ab4c4c058965d22367c90d16/ITEM-Attachment-001-8f93ce7484364e26a5e3b50f6a046795.pdf'],
  ['10', 'California SB 743 — Fehr & Peers', 'https://www.fehrandpeers.com/sb743/'],
  ['11', 'City of Anaheim Traffic Impact Analysis Guidelines for CEQA', 'https://local.anaheim.net/docs_agend/questys_pub/25914/25944/25947/26186/26189/2.%20Proposed%20TIA%20Guidelines%20for%20CEQA%20Analysis26189.pdf'],
  ['12', 'CalAEP SB 743 Practicum', 'http://califaep.org/docs/SB_743_Practicum.pdf'],
  ['13', 'Transportation Impact Studies — City of Citrus Heights', 'https://www.citrusheights.net/1107/Transportation-Impact-Studies'],
  ['14', 'Technical Advisory on Evaluating Transportation Impacts in CEQA — OPR', 'https://lci.ca.gov/docs/20180416-743_Technical_Advisory_4.16.18.pdf'],
  ['15', 'City of Laguna Hills VMT and Traffic Study Guidelines', 'https://www.lagunahillsca.gov/DocumentCenter/View/9151/VMT-and-Traffic-Study-Guidelines-Combined'],
  ['16', 'How SB 743 is Changing Traffic Impact Assessments — Urban Crossroads', 'https://urbanxroads.com/beyond-level-of-service-how-sb-743-is-changing-traffic-impact-assessments/'],
  ['17', 'Real Estate Developers Grapple with CEQA\'s VMT Metric — K&L Gates', 'https://www.klgates.com/Real-Estate-Developers-Grapple-with-CEQAS-Vehicle-Miles-Traveled-Metric-for-Measuring-Transportation-Impacts-04-06-2020'],
  ['18', 'ITE Western District Newsletter (Sept 2004)', 'https://westernite.org/newsletter-pdfs/sept2004.pdf'],
  ['19', 'City of Anaheim — Records Document', 'https://records.anaheim.net/CityClerk/DocView.aspx?id=2351469'],
  ['20', 'Request for Qualifications — City of Seaside Traffic Engineering', 'https://www.ci.seaside.ca.us/DocumentCenter/View/11261'],
  ['21', 'A-5-VEN-21-0011 (Wynkoop Properties) — CA Coastal Commission', 'https://documents.coastal.ca.gov/reports/2022/12/Th16a/Th16a-12-2022-corresp2.pdf'],
  ['22', 'LA City Planning Staff Report — VTT-74865-1A', 'https://planning.lacity.gov/plndoc/Staff_Reports/2022/06-14-2022/VTT_74865_1A.pdf'],
  ['23', 'eComment — San Diego County Planning Commission', 'https://www.sandiegocounty.gov/content/dam/sdc/pds/PC/200731-pc-hearing/Item%205.pdf'],
  ['24', 'R.K. Engineering & Constructions', 'https://rkengineeringandconstruction.com/'],
  ['25', 'Certification of Qualified Acoustical Consultants — OC Development Services', 'https://pwds.oc.gov/sites/ocpwocds/files/2021-01/PC_PA20-0255-StaffReport-Jan-27-2021.pdf'],
  ['26', 'CEQA Reforms and Their Impact on Property Development — Peterson Law Group', 'https://www.petersonlawgroup.com/blog/ceqa-reforms-and-their-impact-on-property-development-in-california/'],
  ['27', 'Getting in Its Own Way: Behind California\'s CEQA Curtain — Holland & Knight', 'https://www.hklaw.com/en/case-studies/getting-in-its-own-way-behind-californias-ceqa-curtain'],
  ['28', 'Brentwood HOA Traffic Expert Response to DEIR (Mount St Mary\'s)', 'https://brentwoodalliance.org/wp-content/uploads/2021/07/BHA-Traffic-Expert-Response-to-DEIR.pdf'],
  ['29', 'Developers — RK Engineering', 'https://rkengineer.com/industries/developers/'],
  ['30', 'Procurement Manual — California DGS', 'https://www.dgs.ca.gov/-/media/Divisions/PD/PTCS/PAU/FISCAL-Financial-Information-System-for-California-Procurement-Manual.pdf'],
  ['31', 'City of Santa Barbara RFP 4036 — Traffic Engineering', 'https://www.califaep.org/docs/RFP_No_4036_Traffic_Engineering_Services_for_Traffic_Management_and_General_PEIR.pdf'],
  ['32', 'City of Costa Mesa 2023 City Contracts', 'https://www.costamesaca.gov/government/departments-and-divisions/city-clerk/city-contracts/2023-city-contracts'],
  ['33', 'City of Costa Mesa 2022 City Contracts', 'https://www.costamesaca.gov/government/departments-and-divisions/city-clerk/city-contracts/2022-city-contracts'],
  ['34', 'Phase II ESA — Dale Townhomes, Buena Park', 'https://cms7files1.revize.com/buenaparkca/Document_center/City%20Departments/Community%20development/Planning%20Division/Keynote%20Projects/8030%20Dale/Draft%20Initial%20Study_Mitigated%20Negative%20Declaration%20Appendices%20G%20-%20L%20(July%2019,%202024).pdf'],
  ['35', 'Professional Consultants — RK Engineering', 'https://rkengineer.com/industries/professional-consultants/'],
  ['36', 'CAMMNET — Orange County Transportation Authority', 'https://cammnet.octa.net/procurements/planholders-list-report/Default.aspx?solnum=13268'],
  ['37', 'Public Agencies — RK Engineering', 'https://rkengineer.com/industries/public-agencies/'],
];

const appendix = [
  ...sectionHeader('Appendix — Works Cited & Data Sources', CORE_BLUE, 'A'),
  spacer(160),
  p('All references are publicly accessible at the time of report publication (May 2026). Citation numbers correspond to footnoted references in the source-document version of this report; the current synthesis preserves the original evidentiary base.'),
  spacer(200),
  ...works.map(([n, title, url]) => new Paragraph({
    spacing: { before: 60, after: 60, line: 280 },
    children: [
      new TextRun({ text: `${n}. `, size: 18, bold: true, color: CORE_BLUE, font: FONT_BODY }),
      new TextRun({ text: `${title}  ·  `, size: 18, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: url, size: 16, color: TEAL, italics: true, font: FONT_BODY }),
    ],
  })),
];

// ============================================================
// HEADER / FOOTER
// ============================================================
const docHeader = new Header({
  children: [
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)],
      borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA },
            borders: noBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              children: [new ImageRun({
                type: 'png',
                data: LOGO_BUF,
                transformation: { width: 130, height: 27 },
                altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' },
              })],
            })],
          }),
          new TableCell({
            width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA },
            borders: noBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({
                text: 'RKE  ·  Strategic Market Analysis & AI Growth Blueprint',
                size: 16, color: BRAND_GREY, font: FONT_BODY,
              })],
            })],
          }),
        ],
      })],
    }),
    new Paragraph({ children: [new TextRun({ text: '' })] }),
  ],
});

const docFooter = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 0 },
      children: [
        new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
        new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  +1 949.379.8499  ·  ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
        new TextRun({ text: 'Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      ],
    }),
  ],
});

// ============================================================
// ASSEMBLE DOCUMENT
// ============================================================
const allChildren = [
  ...cover,
  ...toc,
  ...execSummary,
  ...section1,
  ...section2,
  ...section3,
  ...section5,
  ...section6,
  ...section7,
  ...section8proof,
  ...sectionEdu,
  ...section8,
  ...section9,
  ...section10,
  ...section11,
  ...sectionFaq,
  ...conclusion,
  ...about,
  ...appendix,
];

const doc = new Document({
  creator: 'Technijian',
  title: 'RKE Strategic Market Analysis & AI Growth Blueprint',
  description: 'Strategic market analysis, customer personas, and AI-powered growth blueprint for RK Engineering Group, prepared by Technijian.',

  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE },
        paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },

  numbering: {
    config: [
      {
        reference: NUM_BULLETS,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } },
        }],
      },
    ],
  },

  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: 15840 },
        margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN },
      },
    },
    headers: { default: docHeader },
    footers: { default: docFooter },
    children: allChildren,
  }],
});

// ============================================================
// OUTPUT
// ============================================================
const outPath = path.join(__dirname, 'RKE-Strategic-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('Wrote:', outPath);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
