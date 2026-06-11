// Abound Food Care (AFC) - AI Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/JDH/build-jdh-report.js (DTS/ALG/AAVA/TALY/VAF/SCF/ORX/RKE lineage).
// COLD-ISH PROSPECT: first conversation June 2026 - no Technijian services in place. Tone = mission-respectful, cold-prospect care.
// Logo: uses the AUTHENTIC assets/Technijian Logo 2.png (NOT the assets/logos/png fakes).
// Diagrams embedded via pngDims() - aspect ratio derived from real PNG IHDR dimensions (never hardcoded).

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

// AUTHENTIC logo (light backgrounds) per feedback_logo_use_authentic_files.
const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_ECO_BUF      = dbuf('ecosystem.png');
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
const DIAGRAM_LAND_BUF     = dbuf('landscape.png');
const DIAGRAM_ARCH_BUF     = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-06-11';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers ----------
function spacer(size = 200) {
  // keepNext: a spacer binds to the following element so it can never orphan onto a blank page.
  return new Paragraph({ keepNext: true, spacing: { before: size, after: 0 }, children: [new TextRun('')] });
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

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  // pageBreakBefore: every section starts on a fresh page (Ravi, 2026-06-10).
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to Abound: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  });
}

// Read PNG IHDR dimensions - offsets 16=width, 20=height (skill-mandated pngDims pattern)
function pngDims(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
// Embed diagram at correct aspect ratio derived from real file dimensions. Never hardcode AR.
function diagramImage(buf, altTitle, widthPx = 600) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const { w, h } = pngDims(buf);
  const imgW = widthPx;
  const imgH = Math.round(widthPx * h / w);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: imgW, height: imgH }, altText: { title: altTitle, description: altTitle, name: altTitle } })],
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
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 150, height: 31 } })] })] }),
      new TableCell({
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
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
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 300, height: 63 } })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ABOUND FOOD CARE', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'The Coordination Layer of Food Recovery  ·  Founded 2012 as Waste Not OC', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 38, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Santa Ana, California  |  aboundfoodcare.org', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for Abound Food Care', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '2012', label: 'Founded as Waste Not OC · rebranded Abound Food Care 2021', color: CORE_BLUE },
    { number: '7', label: 'Solution lines, from group procurement to emergency meals', color: CORE_ORANGE },
    { number: '4', label: 'Jurisdiction programs referenced: Ventura regional · Sacramento alliance · Garden Grove · Arcata', color: TEAL },
    { number: '2022 / 2024', label: 'SB 1383 Tier 1 / Tier 2 generator duties in force statewide', color: GOLD },
  ]),
  spacer(300),
  p('Abound Food Care is the coordination layer of food recovery — not a food bank. Founded in 2012 as Waste Not OC by Dr. Eric Handler, then Orange County’s public health officer, and Mark Lowry of the OC Food Bank, and led since 2016 by Mike Learakos, a thirty-year foodservice operator, the organization connects the businesses that generate surplus food to the recovery organizations that feed people — and handles the written agreements, the food-safety chain of custody, the logistics, and the tracking and reporting that make the whole system stand up to an auditor. It convenes the OC Hunger Alliance alongside Second Harvest Food Bank of Orange County and the OC Food Bank, and Orange County’s own waste authority describes it as "a food recovery and recycling specialist that has pioneered the nation’s most effective and cost-efficient food recovery model."'),
  p('That credibility is now winning government work well beyond Orange County. California’s SB 1383 requires large food businesses — Tier 1 generators such as supermarkets, grocery stores, and food distributors since 2022, and Tier 2 generators such as large restaurants, hotels, health facilities, and schools since 2024 — to recover surplus edible food under written agreements, and it requires every jurisdiction in the state to build recovery capacity, educate its generators, and monitor compliance. Abound is a contracted implementer of exactly that: a regional program for the Ventura County Public Works Agency covering the county and eight cities, a contract with the City of Arcata, an engagement with the Sacramento-region Capital Food Access Alliance covering Sacramento County and six cities, and a listed recovery-organization role in Garden Grove’s program.'),
  p('The growth question for a small mission team running multi-county government programs is not "find more leads." It is: win more jurisdiction contracts, make existing programs visibly succeed so they renew and become references, and diversify funding — without adding headcount the budget does not have. This blueprint shows how AI becomes that multiplier, working two fronts at once. The growth front (Sections 11 and 12): own the SB 1383 answers generators and jurisdictions now ask AI engines, run account intelligence on a named universe of roughly 480 cities and 58 counties, and turn proposal and grant drafting from days of assembly into review-and-sign sessions. The capacity front (Section 8): give the team back the hours currently consumed by reporting cycles, onboarding packets, and institutional memory held in a few heads. Every piece sits inside a boundary stated plainly in Section 4: donor information, health-adjacent screening data, and government-contract records never enter public AI tools, and a named human signs every compliance report, food-safety decision, and grant submission.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Abound already owns the hard things: fourteen years of operating credibility, seven solution lines no software platform or consultancy matches, referenced programs across four jurisdictions and two regions, the OC Hunger Alliance convening role, and the trust of the agencies and funders who write the checks. What it does not yet have is the AI layer that turns that record into answer-engine visibility, proposal and grant velocity, and audit-ready reporting at statewide scale.',
      'The timing is specific. SB 1383 enforcement has been live since 2024, Tier 2 obligations are now in force, and the Sacramento alliance’s grant-funded projects complete by June 30, 2026 — which makes the next twelve months the freshest window Abound will ever have to turn that proof into the next contracts.',
      'The entry is small on purpose: roughly $32,000 in Year 1, month-to-month, with no large build to begin — sized for a lean nonprofit where every dollar is mission money. The custom grant-and-reporting engine comes later, only once the entry proves the lift.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information — Abound’s own website, jurisdiction and state sources, and nonprofit-sector references — verified in June 2026. Abound’s internal numbers (contract values, grant calendars, reporting hours, enrollment counts) were not available and are deliberately not guessed at. Every projection below is labeled estimated and conservative, and the calibration questions in Section 12 replace assumptions with real baselines after one short discovery conversation.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW ABOUND WINS ----------
docChildren.push(
  ...sectionHeader('How Abound Wins — The Compliance-Credibility Engine', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for Abound starts with how the organization actually earns. Revenue is jurisdiction contracts, grants, and contributions — and all three are won on the same three assets: credibility (referenced programs that worked), capacity (the network and logistics to actually move food), and auditable reporting (data a program manager can hand to CalRecycle without flinching). A jurisdiction hiring an SB 1383 implementer is not buying marketing; it is buying trust at scale, with its own enforcement exposure on the line. A funder is buying measurable outcomes. A generator is buying compliance made easy. The diagram below maps the ecosystem and where AI strengthens every junction.'),
  spacer(160),
  diagramImage(DIAGRAM_ECO_BUF, 'The Food-Recovery Ecosystem', 600),
  diagramCaption('Figure 2.0 — The ecosystem: surplus food flows left to right; contracts and auditable reporting flow up; funding follows proof'),
  spacer(120),
  subHeader('The Regulatory Engine Behind the Market'),
  p('SB 1383 is the demand engine of Abound’s category. Since 2022, Tier 1 commercial edible-food generators — supermarkets, large grocery stores, food distributors, and wholesale food suppliers — must recover surplus edible food under written agreements with recovery organizations and keep records. Since 2024, the same duty extends to Tier 2 generators: large restaurants, hotels, health facilities, large venues, and schools. Jurisdictions — every city and county in California — must build recovery capacity, educate their generators, and monitor compliance, with the enforcement phase live since 2024. That creates two simultaneous customer urgencies: jurisdictions that must show CalRecycle a working program, and generators that must show their jurisdiction a written agreement and records. Abound sits exactly where both urgencies meet — and its tracking data is not a marketing artifact but a contract deliverable with audit exposure.'),
  spacer(120),
  subHeader('Where the Growth Lives'),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.8 },
      { label: 'The Universe', weight: 3.6 },
      { label: 'How Abound Captures It', weight: 3.6 },
    ],
    [
      ['New jurisdiction implementation contracts', 'California’s roughly 480 cities and 58 counties all carry SB 1383 edible-food-recovery obligations; many are still building capacity as enforcement ramps', 'Account intelligence on the named universe — grant cycles, RFP calendars, compliance posture — plus proposal velocity and the Ventura / Sacramento / Garden Grove / Arcata references'],
      ['Regional alliance replication', 'The multi-jurisdiction model already proven twice: a county plus eight cities (Ventura), a county plus six cities (Sacramento alliance)', 'Package the regional playbook as the product; the per-jurisdiction cost story sells itself to neighboring counties'],
      ['Generator enrollment velocity', 'Tier 1 and Tier 2 businesses statewide that must comply and increasingly ask Google and AI assistants how', 'Own the SB 1383 answer surface; onboarding packets and written agreements drafted in minutes; enrolled generators make the jurisdiction program visibly perform'],
      ['Grant and funder pipeline', 'CalRecycle-linked capacity funding, foundations, and corporate CSR / food-industry partners (the Foodbuy and Sysco procurement relationships show the corporate door is open)', 'AI-assisted grant discovery, eligibility screening, drafting, and impact reporting from program data'],
      ['Health-system partnerships', 'Hospital and health-plan community-benefit programs around food-insecurity screening and medically tailored meals', 'Clinical credibility (advisory MDs), governed data discipline, and outcome reporting that fits a health system’s compliance bar'],
    ],
  ),
  spacer(160),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Win jurisdictions: be the implementer the named universe of cities and counties finds, shortlists, and can defend hiring — account intelligence, proposal velocity, and referenced proof.',
      'Enroll generators: be the answer when a Tier 1 or Tier 2 business asks an AI engine what SB 1383 requires — and make saying yes operationally painless with agreement packets drafted in minutes.',
      'Fund the mission: more grant submissions per cycle, impact reports assembled from program data instead of weekends, and corporate partners briefed account by account.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 SERVICE ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('Service Architecture — The Seven Solution Lines', TEAL, '03'),
  spacer(100),
  p('Abound’s website presents seven solution lines (verified live, June 2026). Together they are the moat: donation-matching software matches; consultancies advise; food banks distribute. Abound is the only player in its category operating the full stack — contracts, kitchens, logistics, data, and disaster response — under one roof. That breadth is also why the team’s hours are the binding constraint, which is exactly what the AI layer addresses.'),
  spacer(140),
  buildTable(
    [
      { label: 'Solution Line', weight: 2.6 },
      { label: 'What It Does', weight: 3.8 },
      { label: 'What It Means for Growth', weight: 3.6 },
    ],
    [
      ['Enhanced Procurement Program', 'Group purchasing for nonprofits with Foodbuy — North America’s largest food group-purchasing organization — and Sysco, so pantries and kitchens buy food and supplies at combined-volume prices', 'A statewide-scalable membership offer and the proof that Abound can run corporate food-industry partnerships'],
      ['Food Resource Recovery', 'System-wide programs that channel surplus edible food from businesses to communities instead of landfills', 'The core SB 1383 implementation service jurisdictions contract for'],
      ['Food Donation', 'Donation programs connecting generators to recovery organizations, with the written agreements and records SB 1383 requires', 'Every enrolled generator strengthens a jurisdiction program — and the renewal case'],
      ['Logistics Coordination', 'Routing, scheduling, and food-safety chain-of-custody between generators and recovery organizations', 'The operational depth software-only platforms do not offer'],
      ['Repurposing Kitchens', 'Cook/chill operations that turn recovered surplus into ready-to-heat meals', 'Differentiated capacity — recovered food becomes meals, not just transferred inventory'],
      ['Data Collection', 'Supply-chain tracking and the regulatory reporting that jurisdiction contracts and SB 1383 compliance demand', 'The audit-ready data trail that wins and keeps government work — and the natural substrate for AI'],
      ['Emergency Food Management', 'Disaster-meal readiness targeting meals within 48 hours, including a solar-powered cold-storage container designed to hold 10,000 to 25,000 blast-frozen meals', 'A press-proven story funders remember, and a readiness capability jurisdictions value'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Breadth Is the Moat — and the Bottleneck',
    [
      'No donation-matching app operates kitchens. No solid-waste consultancy runs a 48-hour disaster-meal capability. No food bank carries the jurisdiction-side reporting load. The seven lines together are why agencies hire Abound.',
      'But every line generates documents, data, and coordination work — agreements, reports, grant applications, playbooks — and today that work is bounded by a small team’s hours. The AI layer in this blueprint is aimed at exactly that constraint: more proposals, more enrollments, more reports, more grant submissions from the same mission team.',
    ],
    TEAL
  ),
);

// ---------- 04 THE MISSION BOUNDARY ----------
docChildren.push(
  ...sectionHeader('The Mission Boundary — Data Care & Compliance', DARK_CHARCOAL, '04'),
  spacer(100),
  p('A nonprofit that points AI at donor relationships, health-adjacent programs, and government contracts without naming the boundary loses the room the first time a board member, a hospital compliance officer, or a county counsel asks. This section names it plainly, because the value of a Technijian-built program is not just that the AI is fast — it is that the AI is fast and trustworthy. The boundary is simple to state: AI drafts, classifies, assembles, and remembers; a named human signs.'),
  spacer(140),
  subHeader('Three Data Categories That Never Enter Public AI Tools'),
  buildTable(
    [
      { label: 'Data Category', weight: 2.6 },
      { label: 'Why It Is Sensitive', weight: 3.6 },
      { label: 'The Control', weight: 3.6 },
    ],
    [
      ['Donor and payment information', 'Abound is a donor-supported nonprofit; donor trust is mission capital, and payment data carries its own handling rules', 'Donor PII and payment records stay in governed systems; no public AI tool ever sees them'],
      ['Health-adjacent program data', 'Hospital partnerships around food-insecurity screening and medically tailored meals put program data near patient information', 'Private, governed AI deployments only; Technijian runs HIPAA-aware practices for its healthcare clients and brings the same discipline here'],
      ['Government-contract records', 'Jurisdiction contracts and CalRecycle-facing program data carry audit exposure and, often, security riders', 'Same governed-deployment rule; access controls, audit trails, and retention discipline built in from day one'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),
  subHeader('Human Signs, AI Drafts'),
  p('Three categories of output are always signed by a named human owner: compliance reports to jurisdictions and CalRecycle-facing records, food-safety and chain-of-custody decisions, and grant submissions. AI assembles the draft, attaches the evidence, checks the math, and remembers the history — it does not attest. This is the same discipline regulators are converging on across industries: automated systems may inform and accelerate, but accountability stays with a person. For Abound it is also a sales asset: it is precisely what a jurisdiction program manager needs to hear before putting a contractor’s reports in front of the state.'),
  spacer(120),
  subHeader('The Governance Dividend'),
  p('There is a quiet bonus. Nonprofit governance reviewers look for documented records-retention and reporting practices, and a governed knowledge system builds that discipline into daily work — every agreement, report, and SOP filed, versioned, and findable. The same system that makes the team faster also makes the organization easier to audit, easier to insure, and easier to fund.'),
  spacer(120),
  calloutBox(
    'The Boundary — Stated for the Board',
    [
      'Donor PII, health-adjacent screening data, and government-contract records never enter public AI tools. All AI runs in private, governed deployments with access controls and audit trails.',
      'AI drafts, classifies, assembles, and remembers. A named human signs every compliance report, every food-safety decision, and every grant submission. No automated decision-making on food safety or compliance attestations — ever.',
      'That boundary is the point: Abound gets institutional-grade document and reporting velocity without putting its name — or a jurisdiction’s — on anything a model invented.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 05 THE ABOUND BUYER ----------
docChildren.push(
  ...sectionHeader('The Abound Buyer — Five Personas', CORE_ORANGE, '05'),
  spacer(100),
  p('Five buyer and partner types drive nearly all of Abound’s revenue and program performance. Two of them — the jurisdiction program manager and the funder — write the checks. Two more — the generator compliance owner and the recovery-organization director — make the programs visibly perform, which is what wins the next check. The fifth, the health-system community-benefit lead, is the emerging premium lane. The cards below profile each, and Figure 5.0 places them by revenue contribution and program influence.'),
  spacer(160),

  personaCard('1 — The Jurisdiction Sustainability / Solid-Waste Program Manager', CORE_BLUE, [
    ['Profile', 'Owns SB 1383 edible-food-recovery compliance at a county public-works agency, a city, or a sanitation district; answers to a council or board — and, on this program, to CalRecycle. The contract-writing buyer.'],
    ['Pain Points', 'Must show recovery capacity, generator education, and monitoring with enforcement live since 2024; limited staff; procurement rules; zero appetite for headline risk.'],
    ['Decision Driver', 'Referenced capacity evidence (who has actually run this), auditable data, cost-per-outcome, and reporting they can defend to the state without flinching.'],
    ['AI Opportunity', 'Account intelligence on grant cycles and RFP calendars; proposal responses drafted from referenced wins; jurisdiction-facing reports with evidence appendices.'],
    ['Technijian Hook', 'My AI Lead Gen — jurisdiction account intelligence. My Dev — proposal and reporting engine.'],
  ]),
  spacer(160),

  personaCard('2 — The Tier 1 / Tier 2 Generator Compliance Owner', CORE_ORANGE, [
    ['Profile', 'Regional operations manager at a grocery chain, hotel general manager, hospital food-services director, school-district nutrition director. Must comply with SB 1383 — Tier 1 since 2022, Tier 2 since 2024 — under a written agreement, with records.'],
    ['Pain Points', 'Confusion about what the law actually requires; liability worry about donating food; tax-benefit paperwork; zero operational slack for a program that disrupts service.'],
    ['Decision Driver', 'Compliance made easy: clear answers, liability protection explained (the Good Samaritan framework), paperwork handled, pickups that fit operations.'],
    ['AI Opportunity', 'They increasingly ask AI engines these exact questions — the organization whose content feeds those answers gets the call. Onboarding packets and agreements drafted in minutes make yes easy.'],
    ['Technijian Hook', 'My SEO — own the SB 1383 answer surface. My Dev — onboarding and agreement packets.'],
  ]),
  spacer(160),

  personaCard('3 — The Food Recovery Organization Program Director', TEAL, [
    ['Profile', 'Runs a pantry, community kitchen, or faith-based program in the recovery network Abound coordinates — including alliance partners. The capacity side of every program.'],
    ['Pain Points', 'Cold-chain and food-safety handoffs; unpredictable supply; thin staffing; grant paperwork for capacity funding.'],
    ['Decision Driver', 'Predictable logistics, clean food-safety handoffs, and access to the capacity funding that flows through programs like the Sacramento alliance’s grants.'],
    ['AI Opportunity', 'Lighter paperwork on agreements and capacity grants; clearer routing and scheduling; a network that performs makes every member stronger.'],
    ['Technijian Hook', 'Network effect of the program engine; a partner-facing portal is a natural Phase 2 candidate.'],
  ]),
  spacer(160),

  personaCard('4 — The Funder / Grant Officer', GOLD, [
    ['Profile', 'CalRecycle-linked program staff, foundation program officers, and corporate CSR / ESG leads at food companies. Funds capacity; renews on evidence.'],
    ['Pain Points', 'Funding outcomes, not overhead; thin, slow, or anecdotal reporting from grantees; replicability questions.'],
    ['Decision Driver', 'Measurable outcomes — meals, tonnage, diversion — reported credibly and on time, plus a model that visibly scales across jurisdictions.'],
    ['AI Opportunity', 'Impact reports assembled from program data instead of weekends; more submissions per grant cycle; corporate-partner dossiers built account by account.'],
    ['Technijian Hook', 'My AI — impact-report factory. My Dev — grant pipeline engine. My AI Lead Gen — CSR partner intelligence.'],
  ]),
  spacer(160),

  personaCard('5 — The Health-System Community-Benefit / Population-Health Lead', DARK_CHARCOAL, [
    ['Profile', 'Owns community-benefit spend or population-health programs at a hospital or health plan; buys food-insecurity screening and medically tailored meal programs.'],
    ['Pain Points', 'Anything touching patient-adjacent data must clear compliance; needs clinical credibility and disciplined reporting; pilots die without evidence.'],
    ['Decision Driver', 'Clinical advisors at the table, HIPAA-aware data practices, and outcome reporting that survives a compliance review.'],
    ['AI Opportunity', 'Governed data pipelines and program reporting that meet a health system’s bar — the data discipline itself becomes the differentiator.'],
    ['Technijian Hook', 'My AI — governed deployments and reporting, built HIPAA-aware from day one.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps the five by direct revenue contribution and program influence — showing why the jurisdiction program manager is the anchor buyer, why generators and recovery organizations are the proof engine that wins renewals, and where the funder and health-system lanes add diversified fuel.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Abound Buyer Matrix', 560),
  diagramCaption('Figure 5.0 — The Abound Buyer: Revenue / Funding Contribution vs. Program Influence / Network Value'),
);

// ---------- 06 THE ECOSYSTEM LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('The Ecosystem Landscape — Allies, Platforms & the White Space', CORE_BLUE, '06'),
  spacer(100),
  p('Abound’s landscape is an ecosystem more than a battlefield, and this report treats it that way. Peer recovery organizations and food banks — Second Harvest Food Bank of Orange County and the OC Food Bank foremost — are allies and OC Hunger Alliance partners, not competitors; the network only works because they are strong. The strategic map has three other player types worth naming: donation-matching software platforms, jurisdiction-services consultancies, and commercial recovery services. None of them operates Abound’s full stack — and none of them owns the AI-search answer surface either.'),
  spacer(140),
  buildTable(
    [
      { label: 'Player', weight: 2.4 },
      { label: 'Category', weight: 2.2 },
      { label: 'What They Do Well', weight: 2.8 },
      { label: 'What They Do Not Do', weight: 2.8 },
    ],
    [
      ['Careit', 'Donation-matching software', 'Polished donation app; adopted by California jurisdictions for SB 1383 tracking; publishes donor-guide content', 'No kitchens, no logistics crews, no emergency capability, no jurisdiction-side implementation staff'],
      ['ChowMatch', 'Donation-matching software', 'Matching and tracking; referenced alongside Abound in Orange County’s program', 'Software only — matching is not implementation'],
      ['Commercial recovery services (e.g., Replate, Copia)', 'Fee-for-pickup recovery', 'Slick corporate-facing recovery for offices and caterers', 'Not jurisdiction implementers; not built around CalRecycle-facing compliance reporting'],
      ['Solid-waste / SB 1383 consultancies', 'Jurisdiction advisors', 'Win jurisdiction-support contracts for education, monitoring, and capacity planning', 'Advise rather than operate — no recovery network, no kitchens, no food moved'],
      [{ text: 'Peer FROs & food banks', }, 'Allies / capacity partners', 'Distribution scale, community trust, shared mission — the alliance Abound convenes', 'Not rivals: they are the capacity Abound’s programs route food through'],
      [{ text: 'Abound Today', bold: true }, { text: 'Full-service coordination layer', bold: true }, { text: 'Contracts, kitchens, logistics, data, emergency response — referenced across four jurisdictions and two regions', bold: true }, { text: 'The AI and answer-engine layer is the open move — no one in the category holds it yet', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  subHeader('What the Answer Engines Say Today'),
  p('As part of this blueprint, Technijian checked the public source layer that AI assistants draw on for the questions Abound’s buyers actually ask — "SB 1383 Tier 1 and Tier 2 written agreement requirements," "how to donate surplus food in California and liability protection," and related compliance queries (June 2026). The pattern is consistent: CalRecycle pages, individual jurisdiction pages, and legal references dominate; the most visible commercial player is a donation-matching software company’s donor guides; a couple of regional volunteer groups surface on liability questions. No full-service food-recovery implementer — Abound’s category — owns these answers statewide. The organization whose content feeds those answers first will be very hard to displace later.'),
  spacer(120),
  calloutBox(
    'The White Space',
    [
      'The top-right of Figure 6.0 — full-service depth plus platform-grade data and AI discipline — is empty. Software platforms hold the data corner without the service; consultancies hold advice without operations; Abound holds the service depth with data operations still run by hand.',
      'Abound’s move is straight up: keep the full-service moat and add the answer-engine visibility, document velocity, and governed knowledge that no platform, consultancy, or peer currently operates.',
      'This is not a bet on outspending anyone. It is a bet on Abound’s existing record — four referenced jurisdiction programs, seven solution lines, fourteen years — being told and proven at machine speed.',
    ],
    CORE_BLUE
  ),
  spacer(160),
  diagramImage(DIAGRAM_LAND_BUF, 'Ecosystem Map — Service Depth vs Data & AI Discipline', 560),
  diagramCaption('Figure 6.0 — The Ecosystem Map: Service Depth vs. Data & AI Discipline (allies shown for category context only)'),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For an organization whose buyers are government program managers, compliance-anxious businesses, and evidence-driven funders, the digital surface matters at one precise moment: when a buyer searches, asks an AI assistant, or checks credibility before a call. Abound’s presence is real and professional — this audit found genuine assets, several verified live in June 2026 — but it under-tells a remarkable story. The framing throughout is enhancement, not failure: the operation is strong; the buyer-facing surface that signals it is light.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State (verified June 2026)', weight: 3.6 },
      { label: 'Opportunity', weight: 3.8 },
    ],
    [
      ['aboundfoodcare.org', 'Professional site; all seven solution lines presented; donation path in place; FC Focus newsletter', 'Add the jurisdiction-buyer track: referenced program pages, outcomes, and a clear "for jurisdictions" path sized for a program manager building a shortlist'],
      ['SB 1383 content', 'A live SB 1383 explainer page — an educational overview of the mandate', 'Build it into the question-by-question library generators and jurisdictions actually ask — tier thresholds, written agreements, liability, records — the content AI engines cite'],
      ['AI-search visibility', 'Checks of the public source layer AI assistants draw on (June 2026) show CalRecycle, jurisdiction pages, and a software platform’s guides dominating SB 1383 answers', 'Own the answer surface for the generator and jurisdiction questions in Abound’s lane — the white space of Section 6'],
      ['Reference proof', 'The Ventura, Sacramento, Garden Grove, and Arcata engagements are documented on the jurisdictions’ own sites and in program announcements', 'Tell them on Abound’s own surface as buyer-facing case stories — the single highest-credibility content the org owns'],
      ['Executive voice', 'Leadership credibility is deep — a thirty-year operator CEO and a public-health co-founding story', 'A modest LinkedIn cadence on SB 1383 implementation lessons would put that authority where program managers and funders actually read'],
      ['Impact storytelling', 'Press-proven assets: the solar-powered cold-storage container and emergency-meal capability have earned media attention', 'Systematic impact pages — meals, tonnage, diversion — that funders and CSR partners can lift straight into their own reporting'],
    ],
  ),
  spacer(160),
  subHeader('AI Search Reality Check', { color: CORE_ORANGE }),
  p('Here is the gap made concrete. When a Tier 2 generator’s operations manager asks an AI assistant the question below today, this is the shape of the answer they get — illustrative of how AI search resolves this query class right now:'),
  calloutBox('Prompt: "My hotel got a notice that we’re a Tier 2 edible food generator under SB 1383. What do we have to do, and who can help us comply in Orange County?"', [
    'TODAY — the assistant summarizes the mandate from CalRecycle and city pages: written agreement with a food recovery organization, records, the 2024 Tier 2 date. Asked who can help, it names whatever it can read: a donation-matching app, a city contact page, sometimes a food bank. Abound Food Care — the organization Orange County’s own waste authority calls the pioneer of the model, with referenced programs in two regions — is not reliably part of the answer at the exact moment a generator is deciding who to call.',
    'AFTER AEO — the same query returns Abound as a cited option ("Abound Food Care, a Santa Ana-based food recovery organization that implements SB 1383 programs for jurisdictions including Ventura County and the Sacramento region, provides written agreements, pickup logistics, and compliance records..."), with the question-by-question content library as the evidence the assistant points to.',
  ], CORE_ORANGE),
  p('(Illustrative of current AI-search behavior for this query class, based on June 2026 checks of the sources these engines draw on; the live baseline is captured in Quick Win 1.)', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Cost of Waiting', { color: CRITICAL }),
  p('Answer-engine visibility compounds, and it rewards whoever builds it first. Every quarter the SB 1383 answer surface stays unowned, the assistants keep learning to answer generator and jurisdiction questions with whoever is publishing — a software platform’s guides, generic legal summaries — and that default, once set, is far harder to dislodge than to claim now. The window is dated: Tier 2 enforcement pressure is rising, jurisdictions are still standing up capacity, and the Sacramento alliance’s grant projects complete by June 30, 2026, after which Abound’s freshest multi-jurisdiction proof starts aging. The cost of waiting is not zero — it is the next regional contract decided by an answer Abound is not part of.'),
);

// ---------- 08 THE SILENT CAPACITY LEAK ----------
docChildren.push(
  ...sectionHeader('The Silent Capacity Leak — Where Mission Hours Go', DARK_CHARCOAL, '08'),
  spacer(100),
  p('This is the efficiency front of the blueprint — and for a lean nonprofit it may be the more important one, because every hour recovered is mission capacity that does not have to be fundraised. From the outside, Abound’s public surface reveals the shape of its internal workload: seven solution lines, four jurisdiction engagements across two regions, written agreements and records for every enrolled generator, jurisdiction-facing reporting cycles, grant applications and their impact reports, a newsletter, and a 48-hour emergency capability that must stay drill-ready. A small team carries all of it. None of this is a criticism — it is the visible cost of running government-grade programs with nonprofit staffing, and it is exactly the workload AI document systems are best at.'),
  spacer(140),
  buildTable(
    [
      { label: 'Abound Workflow Today', weight: 3.0 },
      { label: 'AI Integration', weight: 3.4 },
      { label: 'Proven Technijian Result', weight: 3.6 },
    ],
    [
      ['Jurisdiction RFPs and proposals assembled by hand from past program materials', 'AI reads the solicitation and drafts the response from the Ventura / Sacramento / Garden Grove / Arcata record; staff edit and a named human signs', 'AI Document Intelligence for FINRA broker-dealers: response time cut from days to minutes, 60–80% less manual review (built)'],
      ['Generator onboarding and written agreements run on phone-and-email cycles', 'Tier classification, agreement packet, liability and tax-benefit one-pagers drafted automatically and tracked to signature', 'Same document-intelligence engine; high-volume packet work runs on low-cost models (Section 9 cost discipline)'],
      ['Jurisdiction- and state-facing compliance reports built from tracking data each cycle', 'Reports drafted with evidence appendices; three independent models cross-check compliance-critical sections; a named human signs', 'ScamShield three-model LLM Council — the peer-review pattern built for outputs that cannot afford a confident wrong answer (built)'],
      ['Grant work: discovery, eligibility screening, drafting, and impact reporting', 'A pipeline that screens eligibility, drafts applications for human edit, and assembles impact reports from program data', 'Document intelligence plus the multi-agent content platform: roughly 70% less production time, measured (built)'],
      ['SB 1383 education content and the FC Focus newsletter', 'A routed content factory: a low-cost model drafts, a mid-tier model fact-checks, a frontier model does the final voice-and-accuracy pass', 'Multi-Agent SEO + answer-engine platform — productized as My SEO (built)'],
      ['Institutional knowledge — a thirty-year operator’s know-how and program SOPs — concentrated in a few people', 'A governed knowledge system the whole team can query in plain language; records-retention discipline built in', 'Weaviate + Obsidian enterprise knowledge and memory system (built)'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(160),
  subHeader('What the Recovered Hours Are Worth'),
  p('Without Abound’s internal numbers, the honest quantification is directional — anchored to Technijian’s own measured results, with every line confirmed at discovery:'),
  buildTable(
    [
      { label: 'Efficiency Lever', weight: 3.2 },
      { label: 'Conservative Direction (confirm at discovery)', weight: 6.0 },
    ],
    [
      ['Proposal and grant drafting', 'Days of assembly per submission compress toward review-and-sign sessions — the 60–80% review reduction measured on the FINRA engine is the basis'],
      ['Reporting cycles', 'Jurisdiction-facing reports drafted from tracked data; staff hours per cycle redeploy to partner-facing work'],
      ['Generator onboarding', 'Packets in minutes instead of cycles; faster signature loops; more enrollments per staff-week — which is program performance, which is renewals'],
      ['Content production', 'Roughly 70% less production time, as measured on Technijian’s own multi-agent platform'],
      ['Knowledge transfer', 'New staff and partners answer routine questions from the system instead of interrupting the operators who carry the history'],
      ['Emergency activation', 'Playbooks and partner communications pre-drafted, so a 48-hour activation spends its hours on logistics, not paperwork'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(160),
  calloutBox(
    'Three Leaks, One Engine',
    [
      'Hours: document assembly — proposals, agreements, reports, applications — consumes the scarcest resource a lean mission team has.',
      'Cycles: grant rounds and RFP windows are calendar-bound; a submission that cannot be drafted in time is funding that never existed.',
      'Memory: the operating know-how that wins this work lives in a few heads; every departure or busy week taxes it.',
      'None of these is a capability failure — each is a speed, calendar, or memory constraint, and they are precisely what the document, pipeline, and knowledge systems in this blueprint remove.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services Abound would engage. Each is labeled for what it is, and each maps to a specific Abound use case. To be direct about it: Technijian has not built an AI engine for a food-recovery nonprofit before. What it has built is the document intelligence, answer-engine, multi-model review, and knowledge infrastructure such an engine is made of — for clients in regulated, audit-heavy settings — and that is the honest claim this blueprint stands on.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60 to 80 percent less manual review.',
    'Pointed at Abound’s workload, the same approach reads a jurisdiction RFP, a grant application, or a generator agreement packet, drafts it from the referenced program record, and assembles the evidence — at the same accuracy, in minutes instead of days, with a named Abound owner signing every submission. This is the flagship mapping.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70 percent.',
    'This is how Abound owns the SB 1383 answer surface: the question-by-question library generators and jurisdictions actually ask, published at a cadence a small team could never sustain by hand, so AI assistants cite Abound at the moment a buyer is deciding who to call.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked design is exactly what compliance-bound drafting needs: three independent models review each jurisdiction report and grant submission draft, disagreements surface for human judgment, and every output is sourced and auditable — the discipline a CalRecycle-facing data trail deserves.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'For Abound this is the institutional memory: fourteen years of program history, a thirty-year operator’s know-how, SOPs, agreements, and grant language — searchable by the whole team, resilient to turnover, and quietly building the records-retention discipline governance reviewers look for.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI-Native SDLC v7.0',
    'Technijian designed an AI-first software development lifecycle integrating Claude Code with Figma Make, GitHub, and CI/CD — full lifecycle coverage with an AI-native development methodology.',
    'This is how the Phase 2 custom build — the AI Grant & Compliance-Reporting Engine — ships in months rather than a year: production-grade, audit-logged, and owned by Abound, not rented from a platform.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services Abound Would Engage'),
  capabilityBox(
    'My SEO — Answer-Engine Authority & Visibility',
    'My SEO is Technijian’s search service: content, reputation, and answer-engine visibility so an organization is found and trusted where its audiences actually look — including AI assistants.',
    'For Abound it owns the SB 1383 answer surface — tier thresholds, written agreements, liability protection, records — plus the referenced-program stories and the executive voice, published on a cadence that compounds.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Account Intelligence (Starter)',
    'My AI Lead Gen’s starter tier, configured here as an account-intelligence service: it tracks a named universe of accounts, watches buyer-side triggers, and produces dossiers and personalized outreach drafts — depth on known targets, not volume marketing.',
    'For Abound it is the jurisdiction radar: track the cities and counties in the named universe, watch grant cycles, RFP calendars, and program announcements, and brief the team before conversations — plus account dossiers on corporate CSR and health-system partners. Inbound generator interest gets captured and routed, never dropped.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on the AI-native lifecycle above; it ships assistants, portals, and integrations around a client’s actual process.',
    'This builds the Phase 2 working tools — the grant and proposal drafting engine, the compliance-reporting drafts with evidence appendices, the generator onboarding packets, and the knowledge system — integrated with how Abound already tracks its programs and owned by Abound.',
    'service'
  ),
  spacer(200),
  subHeader('How We Keep AI Affordable — Seven Models, Routed by Task'),
  p('A fair question for a budget-conscious nonprofit: if AI touches content, proposals, reports, and onboarding, will the run cost be enormous? Not the way Technijian builds it. We do not wire every task to one expensive model — our platform routes across roughly seven models, spanning three AI providers and three capability tiers, and sends each sub-task to the cheapest model that can do it well.'),
  buildTable(
    [
      { label: 'Tier', weight: 1.7 },
      { label: 'What It Does', weight: 3.3 },
      { label: 'Share of Work', weight: 1.5, align: AlignmentType.CENTER },
    ],
    [
      [{ text: 'Frontier (premium)', bold: true }, 'The hardest judgment only — compliance-critical report sections, the final accuracy-and-voice pass on grant narratives', { text: '~5–10%', color: CORE_BLUE, bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Workhorse (balanced)', bold: true }, 'The bulk of drafting and reasoning — proposal sections, grant drafts, content, summaries, screening calls', { text: '~30–40%', color: TEAL, align: AlignmentType.CENTER }],
      [{ text: 'Lightweight (low-cost)', bold: true }, 'High-volume mechanical work — tier classification, packet assembly, data extraction, tagging records', { text: '~50–60%', color: BRAND_GREY, align: AlignmentType.CENTER }],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  p('The result: Abound pays premium-model prices only for the small slice of work that warrants them — typically a 60–80% lower run cost than routing everything to one top-tier model, with no quality loss where it counts. A jurisdiction report, for example, has its data extracted by a low-cost model, its narrative drafted by a mid-tier model, and its compliance-critical sections checked by a frontier model with a three-model council review — instead of one premium model doing all three at roughly triple the cost. Where quality is non-negotiable, the council pattern catches what any single model would miss. These ratios are engineering norms from Technijian’s own platforms, not a client-specific guarantee.', { spaceBefore: 80 }),
);

// ---------- 10 UNDERSTANDING AI ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for Abound Food Care Leadership', CORE_BLUE, '10'),
  spacer(100),
  p('This section exists to make the rest of this report easy to evaluate. No jargon, no hype — just what AI is, where Abound sits today, how to adopt it without risking the mission, and what comparable organizations are already doing. The goal is that Mike, the board, and the team can judge every recommendation that follows on its merits.'),
  spacer(140),

  subHeader('What AI Actually Is — and Isn’t'),
  p('As MIT Sloan puts it, a leader needs to know what AI can and cannot do — not how to build it. In practice, the one distinction that matters for planning is this:'),
  bullet('Automation (workflows): the AI follows a path you define — predictable and low-risk. For example, "draft this generator agreement packet from this intake form and our template." This is where almost all near-term value lives.'),
  bullet('Agents: the AI decides the steps itself — more flexible, and it needs human oversight. For example, "watch the named jurisdictions and flag the ones opening a grant cycle." This comes later, where it earns its place.'),
  p('The operating principle (Anthropic’s guidance on building AI systems) is to use the simplest thing that works. Abound starts with simple automations that pay off in the first ninety days — answer content, onboarding packets, report drafts — and adds autonomous behavior only where the value is proven, which is exactly how the roadmap in this report is sequenced.'),
  spacer(140),

  subHeader('Where Abound Sits Today — The AI Maturity Ladder'),
  p('Most established, well-run organizations — including Abound — sit at the first or second rung of a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks). The leaders in any field are only one or two rungs higher, and the gap closes in months, not years.'),
  spacer(80),
  buildTable(
    [
      { label: 'Stage', weight: 1.6 },
      { label: 'What It Looks Like', weight: 4 },
      { label: 'Abound Today', weight: 1.4, align: AlignmentType.CENTER },
    ],
    [
      ['1. Foundational', 'Little or no AI; manual, people-dependent processes', { text: '', align: AlignmentType.CENTER }],
      [{ text: '2. Emerging', bold: true }, { text: 'Program data is tracked and reported — Data Collection is one of the seven solution lines — but AI is not yet woven into how Abound wins contracts, enrolls generators, or drafts grants and reports', bold: true }, { text: '◀ You are here', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['3. Operational', 'AI runs specific workflows day-to-day — answer content, onboarding packets, report and grant drafts — with measured results', { text: '', align: AlignmentType.CENTER }],
      ['4. Scaled', 'AI is embedded across growth and operations with governance and dashboards, and replicated across regional programs', { text: '', align: AlignmentType.CENTER }],
      ['5. Transformational', 'AI is the default way the organization wins, reports, and scales its mission', { text: '', align: AlignmentType.CENTER }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Abound has a head start most nonprofits lack: program data is already a contract deliverable, which means the substrate AI needs already exists. This report is the plan to reach Operational — AI working inside the proposal, onboarding, and reporting workflows — within roughly nine months.', { spaceBefore: 80 }),
  spacer(140),

  subHeader('Adopting AI Responsibly — Three Risks Every Leader Manages'),
  p('The U.S. government’s NIST AI Risk Management Framework gives leaders a simple mental model — Govern, Map, Measure, Manage. For a donor-supported nonprofit running government programs near health data, three risks matter most, and each has a concrete control:'),
  spacer(80),
  buildTable(
    [
      { label: 'Risk', weight: 1.8 },
      { label: 'What It Means', weight: 3.4 },
      { label: 'How Technijian Controls It', weight: 3.4 },
    ],
    [
      ['Hallucination', 'AI can state a confident, wrong answer', 'Human-in-the-loop on anything compliance-bound or public-facing — AI drafts the report, the packet, and the application; a named Abound owner signs; a three-model council checks compliance-critical sections'],
      ['Data leakage', 'Sensitive data pasted into public tools can escape', 'Private, governed AI deployments — donor PII, screening data, and government-contract records never touch a public model (the Section 4 boundary)'],
      ['Compliance & accountability', 'Untracked AI tools create audit gaps', 'Every AI tool inventoried with owner, data source, and purpose — audit-ready, led by a CISSP-certified team, and aligned with the records discipline funders and reviewers look for'],
    ],
    { headerColor: DARK_CHARCOAL },
  ),
  spacer(140),

  subHeader('What Comparable Organizations Are Already Doing'),
  bullet('Nonprofits and grant-funded organizations are using AI to discover grants, screen eligibility, and draft applications — submitting more per cycle with the same team, with human sign-off retained on every submission.'),
  bullet('Government-services contractors in document-heavy categories are running proposal and compliance-reporting engines that turn days of assembly into hours of review.'),
  bullet('Compliance-heavy operators are standing up governed knowledge systems that make documentation, records retention, and audit response a by-product of daily work instead of a scramble.'),
  p('These are representative directions of travel across comparable sectors, not guarantees; Abound’s own numbers would be confirmed in discovery. Technijian’s specific, measured results appear in Section 8 (the workflow table) and Section 9 (Capability Proof).', { italics: true, size: 19, spaceBefore: 40 }),
  spacer(140),

  subHeader('A Day in the Life — An Abound Program Coordinator'),
  calloutBox('Before vs. After AI', [
    'TODAY: A hotel calls, confused by its Tier 2 notice. The coordinator explains the law by phone, assembles an agreement packet by hand, and chases the signature for two weeks. Meanwhile a jurisdiction report deadline approaches — data pulled, narrative written from scratch — and a grant LOI is due Friday. The knowledge of how it all fits together lives mostly in two people’s heads.',
    'WITH AI: The hotel arrives half-informed, because the question it asked an AI assistant was answered with Abound’s own content. The packet drafts itself from the intake form; the coordinator reviews and sends it the same day. The jurisdiction report is drafted from tracked data with its evidence appendix attached, council-checked, waiting for review and a signature. The LOI draft is in the queue with eligibility already screened. The coordinator’s day goes to the calls and site visits that actually grow the network — and the know-how is in a system the whole team can ask.',
  ], CORE_BLUE),
  spacer(140),

  subHeader('Why a Partner — vs. Hiring or Doing It Yourself'),
  buildTable(
    [
      { label: 'Path', weight: 1.6 },
      { label: 'Reality', weight: 5 },
    ],
    [
      ['DIY tools', 'Inexpensive, but Abound assembles, secures, and governs everything itself — and owns the three risks above alone, on top of running the programs'],
      ['Hire in-house', 'A capable AI lead typically costs $180K+ per year and is scarce — rarely a responsible line item for a lean nonprofit, and one person cannot cover strategy, build, security, and governance'],
      [{ text: 'Partner (Technijian)', bold: true }, { text: 'Strategy, build, security, and governance in one team at a fraction of a hire — proven builds, CISSP-led security, and an Irvine office fifteen minutes from Santa Ana', bold: true }],
    ],
    { headerColor: CORE_BLUE },
  ),
  p('Sources cited in this section: MIT Sloan Management Review (AI literacy); Anthropic, "Building Effective Agents" (workflow vs. agent design); a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework. Full references in the Appendix.', { italics: true, size: 18, spaceBefore: 100 }),
);

// ---------- 11 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms Abound’s Growth Engine', CORE_BLUE, '11'),
  spacer(100),
  p('The engine runs three layers at once, mirroring the three motions from Section 2. Visibility and demand: own the SB 1383 answer surface, publish the referenced-program proof, and run account intelligence on the named jurisdiction universe. The compliance and document engine: turn RFPs, grant applications, jurisdiction reports, and generator onboarding packets from days of assembly into review-and-sign sessions. Knowledge and governance: assemble impact reports from program data, capture institutional memory, and build the records discipline that makes everything above defensible. The first layer fills the pipeline, the second wins and keeps the work, the third compounds it — and the whole engine sits on the Section 4 boundary.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Abound Compliance-Credibility Engine', 600),
  diagramCaption('Figure 11.0 — The Engine: Visibility & Demand, the Compliance & Doc Engine, and Knowledge & Governance — on one boundary'),
  spacer(160),
  buildTable(
    [
      { label: 'Layer', weight: 2.0 },
      { label: 'Tool', weight: 2.5 },
      { label: 'What It Does', weight: 3.0 },
      { label: 'Metric', weight: 1.5 },
      { label: 'Service', weight: 1.3 },
    ],
    [
      ['Visibility & Demand', 'Answer-engine authority (AEO)', 'Cited answers for the SB 1383 questions generators and jurisdictions ask AI engines', 'Citation share', 'My SEO'],
      ['Visibility & Demand', 'Generator education library', 'Tier guides, written-agreement FAQs, liability and tax-benefit explainers', 'Enrollments', 'My SEO'],
      ['Visibility & Demand', 'Jurisdiction account intelligence', 'Track the named universe — grant cycles, RFP calendars, program announcements', 'Qualified opportunities', 'My AI Lead Gen'],
      ['Visibility & Demand', 'Reference proof engine', 'Ventura, Sacramento, Garden Grove, and Arcata stories told where buyers look', 'Share of voice', 'My SEO'],
      ['Compliance & Doc Engine', 'RFP / proposal drafting', 'Solicitation in, referenced draft out; staff edit; a named human signs', 'Proposal turnaround', 'My Dev'],
      ['Compliance & Doc Engine', 'Grant pipeline engine', 'Discover, screen eligibility, draft applications for human edit and submission', 'Submissions per cycle', 'My Dev'],
      ['Compliance & Doc Engine', 'Compliance reporting drafts', 'Jurisdiction-facing reports with evidence appendices, council-checked', 'Reporting cycle time', 'My Dev'],
      ['Compliance & Doc Engine', 'Generator onboarding packets', 'Tier classification, agreement drafts, one-pagers — tracked to signature', 'Onboarding days', 'My Dev'],
      ['Knowledge & Governance', 'Impact-report factory', 'Meals, tonnage, and diversion outcomes assembled from program data', 'Reporting hours', 'My AI'],
      ['Knowledge & Governance', 'Institutional knowledge system', 'SOPs, history, and operator know-how searchable by the whole team', 'Retention & onboarding', 'My Dev'],
      ['Knowledge & Governance', 'Records governance', 'Retention discipline and audit-ready files as a by-product of daily work', 'Audit readiness', 'My AI'],
      ['Knowledge & Governance', 'Emergency activation playbooks', '48-hour drill communications and partner notifications pre-drafted', 'Activation readiness', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI drafts, classifies, assembles, and remembers — uniformly, with sources attached, inside the documentation rules jurisdictions and funders expect. Every generator, every report, and every application gets the same complete, fast, in-format treatment.',
      'AI never signs. A named Abound owner signs every compliance report, every food-safety decision, and every grant submission — and donor, screening, and government-contract data never enter public AI tools.',
      'The team is freed, not replaced: the AI carries the documentation load, the calendar watching, and the memory; the people carry the relationships, the judgment, and the mission.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 12 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '12'),
  spacer(100),
  p('The plan is built to start small and expand only on proof — sized for an organization where every dollar is mission money. It begins with a focused, low-commitment entry that needs no large build: answer-engine authority, jurisdiction account intelligence, and a strategy workshop. The custom AI Grant & Compliance-Reporting Engine is the Phase 2 expansion, priced and scoped only after the entry proves the lift. Abound’s internal numbers were not available for this draft, so this section deliberately models logic, not invented dollars: every figure is either a published Technijian rate or a clearly-labeled estimate, and the calibration questions at the end of this section replace assumptions with baselines in one short conversation.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated, Directional)'),
  buildTable(
    [
      { label: 'KPI', weight: 3.2 },
      { label: 'Estimated Current', weight: 2.6 },
      { label: 'With the Program', weight: 2.6 },
      { label: 'Direction', weight: 1.4 },
    ],
    [
      ['AI-engine citation on tracked SB 1383 queries', 'Not reliably cited (June 2026 source-layer checks)', 'Cited for the tracked generator and jurisdiction query set', 'Discoverability'],
      ['Jurisdiction proposals per cycle, and turnaround', 'Bounded by hand assembly', 'Drafted from the referenced record in hours; humans edit and sign', 'Velocity'],
      ['Grant submissions per cycle', 'Bounded by drafting bandwidth', 'Pipeline-screened and drafted; more shots on goal per cycle', 'Funding'],
      ['Generator onboarding time', 'Phone-and-email cycles', 'Packets in minutes; tracked to signature', 'Enrollment'],
      ['Reporting hours per jurisdiction cycle', 'Manual data-to-narrative work', 'Drafted with evidence appendices; review-and-sign', 'Capacity'],
      ['Institutional knowledge retention', 'Concentrated in a few people', 'Governed, searchable, resilient to turnover', 'Continuity'],
    ],
  ),
  spacer(160),
  subHeader('The Value at Stake — Modeled Against the Entry, Not the Full Program'),
  p('Abound’s contract and grant values are not public, and this report will not invent them. The honest framing is value-at-stake logic: the entry program costs roughly $32,000 in Year 1, and any one of the three anchors below plausibly clears it on its own. Every line is estimated — scoped at discovery.', { size: 20 }),
  buildTable(
    [
      { label: 'Value Anchor', weight: 2.8 },
      { label: 'What It Is', weight: 3.4 },
      { label: 'Payback Logic vs. the ~$32K Entry', weight: 3.8 },
    ],
    [
      ['One additional regional jurisdiction program', 'A Ventura-scale engagement — a county plus eight cities — runs multi-year and multi-jurisdiction', 'If one incremental program is worth at least the entry cost per contract year — a conservative floor for county-scale implementation work — the entry pays back in year one and again every contract year. Estimated — scoped at discovery.'],
      ['One incremental major grant cycle', 'A capacity-grant award that gets discovered, drafted, and submitted because the pipeline made the calendar', 'A single additional award at typical capacity-grant scale plausibly clears the entry alone — and the drafting hours recovered compound it. Estimated — scoped at discovery.'],
      ['Generator-enrollment velocity protecting renewals', 'Programs that visibly perform renew — and become the reference that wins the neighboring county', 'Renewal protection on even one existing engagement preserves a multiple of the entry; with the Sacramento alliance’s grant projects completing June 30, 2026, the reference is freshest in the next twelve months. Estimated — scoped at discovery.'],
    ],
  ),
  spacer(60),
  p('Read it plainly: one anchor landing pays the entry back; more than one returns a multiple of it. The expansion build raises every anchor’s ceiling — but it is deliberately not part of this math, and neither is any number Abound has not confirmed. Discovery replaces this logic with real baselines. All projections are estimated, not guaranteed.', { italics: true, size: 18 }),
  spacer(160),
  subHeader('The Entry Offer — The 90-Day SB 1383 Visibility & Grant-Velocity Pilot'),
  p('Start with one clearly-scoped, fixed-price program — not an open-ended engagement. The pilot stands up Abound’s answer-engine visibility on the tracked SB 1383 query set, the jurisdiction account intelligence on the named universe, and the strategy workshop that scopes everything that follows — and it proves the lift before any larger build is discussed.'),
  buildTable(
    [
      { label: 'Service', weight: 3.2 },
      { label: 'Scope', weight: 3.4 },
      { label: 'Monthly', weight: 1.3, align: AlignmentType.CENTER },
      { label: 'Y1', weight: 1.3, align: AlignmentType.CENTER },
    ],
    [
      ['My AI — Readiness + Executive Workshop (one-time)', 'A focused session with Mike and the team — program and reporting workflow tour, data and boundary baseline, build scoping, and the success metrics this report commits to', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — Tier 4 (content + video + answer-engine focus)', 'Own the SB 1383 answer surface: the generator and jurisdiction question library, referenced-program proof pages, video explainers, and the executive voice cadence', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Account Intelligence (Starter)', 'Jurisdiction radar on the named universe: grant cycles, RFP calendars, program announcements, pre-meeting dossiers; corporate CSR and health-system account briefs; inbound generator interest captured and routed', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'THE 90-DAY PILOT — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,250/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — AI Grant & Compliance-Reporting Engine (Phase 2 build)', 'The custom engine: grant pipeline, RFP / proposal drafting, jurisdiction-facing reporting with evidence appendices, generator onboarding packets, and the governed knowledge system — estimated, confirmed at quote', { text: '—', align: AlignmentType.CENTER }, { text: '~$48,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, audit-log review, and iteration of the engine', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, governance, model performance review, and team training on a monthly cadence', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $5,050/mo + build', bold: true }, { text: '', bold: true }, { text: '~$113,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Pilot Bar — and Our Commitment',
    [
      'Success metric: within 90 days, Abound is cited by at least one major AI assistant (Google AI, ChatGPT, or Perplexity) for a tracked high-intent SB 1383 query (for example, "who can help my business comply with SB 1383 in Orange County"), AND the jurisdiction intelligence queue is delivering grant-cycle and RFP-calendar briefs the team is actually using.',
      'Our commitment: the entry program is month-to-month, with no lock-in. If the pilot has not hit the bar by day 90, Abound is under no obligation to continue — and we will tell you honestly whether it is worth continuing. The mission carries the upside, not the risk.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand — and the Grant-Offset Question',
    [
      'Start with the roughly $32,000 entry — answer-engine authority, jurisdiction intelligence, and the workshop — with no large build to begin. Expand into the custom AI Grant & Compliance-Reporting Engine only once the entry proves the lift; that one-time build then becomes a permanent Abound asset.',
      'Worth raising with funders and jurisdiction partners: SB 1383 implementation budgets and capacity-building funding streams sometimes treat reporting and program-tooling capacity as fundable program infrastructure. Eligibility is the funder’s call, never ours to promise — but the question costs nothing to ask, and the impact-reporting the program produces is exactly what such funding wants to see.',
      'Phase 3 is replication: the regional playbook — proven in Ventura and Sacramento — packaged for the next counties and alliances, with the engine amortizing across every new program. Treat it as upside, not the Year-1 ask. Productized services beyond My SEO are estimated and confirmed at quote.',
    ],
    CORE_ORANGE
  ),
  spacer(160),
  subHeader('Questions That Calibrate This Plan'),
  p('None of these block starting — the Quick Wins and the Phase 1 entry proceed regardless. One thirty-minute conversation answers most of them and lets Technijian return a calibrated model and a fixed-scope statement of work built on Abound’s real numbers instead of our conservative estimates.'),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Contract economics', 'Typical jurisdiction engagement value and term; renewal cadence', 'Replaces the value-at-stake logic with real anchors'],
      ['Grant pipeline', 'Current grant calendar, submissions per cycle, hit rate, hours per application', 'Sizes the grant-velocity lever directly'],
      ['Reporting load', 'Reports per jurisdiction per cycle; hours per report; who drafts and who signs', 'Calibrates the reporting-hours recovery'],
      ['Generator onboarding', 'Enrollments per month; days from first contact to signed agreement; drop-off points', 'Sizes the enrollment-velocity lever'],
      ['Program tracking stack', 'What systems hold program data today (tracking, agreements, routing); export paths', 'Defines the Phase 2 build’s integration surface'],
      ['Named-universe priorities', 'Which counties and alliances are realistic next targets; existing relationships', 'Seeds the jurisdiction radar with judgment, not just data'],
      ['Funder relationships', 'Which funders and CSR partners are active or warm; reporting formats they require', 'Shapes the impact-report factory’s outputs'],
      ['Health-system lane', 'Status of hospital partnerships and screening programs; data-handling requirements', 'Scopes the governed-deployment bar'],
      ['Marketing ownership', 'Who owns the website, newsletter, and LinkedIn today; any agency relationships', 'Defines the content-engine handoff'],
      ['Emergency program', 'Activation cadence and the playbook’s current form', 'Scopes the readiness automation'],
    ],
  ),
);

// ---------- 13 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '13'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan. Begin with the low-commitment entry: get found and trusted on the SB 1383 answer surface and stand up the jurisdiction intelligence. Then build the grant, proposal, and reporting engine once the entry proves out. Then prove, fund, and expand — impact reporting, the knowledge system, and the regional replication play. Real, visible gains — answer-engine citations, grant-cycle briefs, drafted packets — arrive inside the first ninety days, before any large build.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Abound 90-180-270 Day Roadmap', 600),
  diagramCaption('Figure 13.0 — The Abound Growth & Integration Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Get Found & Trusted (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — the 90-Day SB 1383 Visibility & Grant-Velocity Pilot of Section 12 — with quick, visible wins and no large build.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — AEO + SB 1383 Answer Content', 'Launch the answer-engine program on the tracked query set — tier thresholds, written agreements, liability protection, records, "who can help." Publish the referenced-program proof pages (Ventura regional, Sacramento alliance, Garden Grove, Arcata) on Abound’s own surface. Begin the executive voice cadence.'],
      ['1.2 — Jurisdiction Intelligence Standup', 'Stand up the named-universe radar: the priority counties and alliances, grant cycles, RFP calendars, and program announcements, with pre-meeting dossiers delivered on a weekly rhythm. Add corporate CSR and health-system account briefs.'],
      ['1.3 — AI Readiness Workshop + Boundary Baseline', 'Run the workshop with Mike and the team: program and reporting workflow tour, the data and boundary baseline (Section 4 made operational), Phase 2 build scoping, and the pilot’s success metrics agreed in writing.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Win the Document Race (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — the AI Grant & Compliance-Reporting Engine, integrated with how Abound already tracks its programs.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Grant + RFP Drafting Engine', 'Grant discovery, eligibility screening, and application drafting; jurisdiction RFP and proposal responses assembled from the referenced record. Three-model council review on compliance-critical sections; a named Abound owner signs every submission.'],
      ['2.2 — Reporting + Onboarding Automation', 'Jurisdiction-facing compliance reports drafted from tracked data with evidence appendices. Generator onboarding packets — tier classification, agreement drafts, liability and tax one-pagers — generated and tracked to signature.'],
      ['2.3 — Managed Services + Advisor Cadence', 'The engine moves to managed operation: hosting, monitoring, audit-log review. The Fractional AI Advisor begins the monthly governance and training cadence.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Prove, Fund & Expand (Days 181–270)', { color: CORE_ORANGE }),
  p('Turn performance into funding and replication.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Impact-Report Factory + Knowledge System', 'Outcome reporting — meals, tonnage, diversion — assembled from program data in the formats funders require. The governed knowledge system goes live: SOPs, program history, agreements, and grant language searchable by the whole team, with records-retention discipline built in.'],
      ['3.2 — Replicate the Regional Model', 'Package the regional playbook — the Ventura and Sacramento pattern — as a repeatable offer for the next counties and alliances, with the engine and the reference library doing the heavy lifting. Deliver a measured-results review against the Section 12 baselines and the pilot bar.'],
    ],
  ),
);

// ---------- 14 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '14'),
  spacer(100),
  p('Six actions Abound can take immediately — none requires a contract or a dollar. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Baseline the AI Answers Yourselves',
    ['Type the questions a real generator or program manager would ask into ChatGPT, Perplexity, and Google AI: "what does SB 1383 require of my restaurant," "edible food recovery organization Orange County," "who can help my city comply with SB 1383." See who is cited; capture screenshots as the baseline. It costs nothing and sizes the answer-engine opportunity in twenty minutes.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Put the Four Jurisdiction References on Your Own Site',
    ['The Ventura County regional program, the Sacramento-area alliance engagement, Garden Grove, and Arcata are documented on the jurisdictions’ own sites — but a program manager building a shortlist should find them told as case stories on aboundfoodcare.org. One page each: the scope, the structure, the outcome. This is the highest-credibility content the organization owns.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Write Down the Ten Questions Generators Always Ask',
    ['The team already answers them by phone every week — tier thresholds, what a written agreement is, liability protection, tax paperwork, what a pickup actually looks like. Capturing them verbatim is free, and it becomes the seed of the answer-engine library (and better phone calls in the meantime).'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Start a Grant and RFP Watchlist',
    ['One shared sheet: the funders and capacity-grant programs relevant to food recovery, the jurisdictions likely to solicit implementation help, and their known cycles. Free to start, and it is the exact seed list the jurisdiction-intelligence radar will work from on day one.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Capture One SOP a Week',
    ['Pick the process most concentrated in one person’s head — emergency activation, a reporting cycle, generator intake — and write it down or record a walkthrough. A page is enough. This is free knowledge insurance today and the training substrate for the knowledge system later — and it builds the records discipline governance reviewers look for.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('6 — Take the Free Security & M365 Assessment',
    ['Technijian’s no-cost Nexus Assess covers internal and external vulnerabilities and a Microsoft 365 review, delivered as a prioritized plain-English roadmap that is Abound’s to keep. Every boundary commitment in Section 4 rests on a sound security foundation — this verifies it before any AI program begins, at no cost and with no obligation.'],
    CORE_BLUE),
);

// ---------- 15 QUESTIONS WE USUALLY GET ----------
docChildren.push(
  ...sectionHeader('Questions We Usually Get', CORE_BLUE, '15'),
  spacer(100),
  p('The honest answers to the questions Abound’s leadership and board are most likely asking right now.'),
  spacer(140),
  buildTable(
    [
      { label: 'Question', weight: 3 },
      { label: 'Our Honest Answer', weight: 5 },
    ],
    [
      [{ text: 'We already have help with our website and communications. Why add this?', bold: true }, 'Keep them — this does not replace web maintenance or design. We add the layers a general marketing provider does not build: answer-engine optimization so AI assistants cite Abound on SB 1383 questions, jurisdiction account intelligence, and — in Phase 2 — the document and reporting engine. It is an addition to what works, not a replacement.'],
      [{ text: 'We’re a lean nonprofit. Isn’t AI a corporate luxury?', bold: true }, 'The opposite, honestly. A large organization can hire its way out of a document load; a lean mission team cannot. The entry program exists precisely because every dollar is mission money: it is small, month-to-month, and aimed at the two levers — visibility and document velocity — that return capacity fastest. We start with simple automations that pay back in the first ninety days, not a moonshot.'],
      [{ text: 'Is our data safe — donors, program records, the health-system work?', bold: true }, 'Yes, by design. Donor PII, health-adjacent screening data, and government-contract records never enter public AI tools; everything runs in private, governed deployments with access controls and audit trails, led by a CISSP-certified team. Section 4 states the full boundary — it is written to be shown to a board member or a hospital compliance officer as-is.'],
      [{ text: 'Do we have the bandwidth to manage this?', bold: true }, 'The point is to give bandwidth back, not take it. Technijian runs the build and the cadence; Abound’s involvement is a short workshop, a monthly session, and reviewing and signing what the AI drafts. If the program adds net work to your team, it is failing — that is part of the pilot bar.'],
      [{ text: 'What if it doesn’t work?', bold: true }, 'The entry is a fixed-price 90-day pilot with a named success metric (Section 12), month-to-month with no lock-in. If it has not hit the bar by day 90, you are under no obligation to continue — and we will tell you honestly whether it is worth continuing.'],
      [{ text: 'What does it really cost — and can grants help pay for it?', bold: true }, 'The entry is about $32,000 for Year 1 — the answer-engine program, the jurisdiction intelligence, and the workshop — at published or clearly-estimated rates, with no large build to begin. The custom engine (about $48,000, Phase 2) comes only after the pilot proves the lift. On grants: some SB 1383 implementation budgets and capacity-funding streams treat reporting and tooling capacity as fundable infrastructure — eligibility is the funder’s call, never ours to promise, but it is worth asking, and we will help frame the question.'],
    ],
    { headerColor: CORE_BLUE },
  ),
);

// ---------- 16 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '16'),
  spacer(100),
  p('Abound already has the hard things: fourteen years of operating credibility, seven solution lines no platform or consultancy matches, referenced programs across four jurisdictions and two regions, the OC Hunger Alliance convening role, and a state mandate that makes its category necessary. What it has not yet added is the AI layer that turns that record into answer-engine visibility, proposal and grant velocity, and audit-ready reporting at statewide scale — and that is where this program starts.'),
  p('The opportunity is concrete and dated: own the SB 1383 answer surface while it is still unowned, run intelligence on a named universe of jurisdictions still building capacity, and turn the Sacramento and Ventura proof into the next contracts while it is freshest. The entry is small on purpose, the boundary is written for a board, and the pilot carries a bar we are willing to be judged on.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery conversation to walk this blueprint, answer the Section 12 calibration questions, and confirm scope.',
      'Step 2: Technijian returns a calibrated model and a fixed-scope statement of work within 5 business days.',
      'Step 3: Phase 1 kickoff — answer-engine authority, jurisdiction intelligence, and the workshop — live inside 30 days of go-ahead, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to be the answer when California asks who makes food recovery work?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);
// Plain landing paragraph after a section-ending table — prevents Word from orphaning a blank
// page between the table and the next section's pageBreakBefore heading.
docChildren.push(new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: 2 })] }));

// ---------- 17 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '17'),
  spacer(100),
  p('Technijian is an AI-native managed-services and technology firm headquartered in Irvine, California — fifteen minutes from Abound’s Santa Ana office — serving small and mid-sized organizations since 2000, with a delivery center in Panchkula, India. We build and operate the AI systems that help capable, mission-driven operators do more with the team they have, with security and compliance built in, not bolted on. Technology as a solution.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for Abound', weight: 5 }],
    [
      ['My SEO', 'Answer-engine authority on the SB 1383 question library, referenced-program proof pages, video explainers, and the executive voice cadence'],
      ['My AI Lead Gen', 'Jurisdiction account intelligence on the named universe — grant cycles, RFP calendars, dossiers — plus corporate CSR and health-system account briefs'],
      ['My AI', 'AI strategy and governance — the readiness workshop, the fractional AI advisor, impact-report and records-governance automation, team training'],
      ['My Dev', 'The custom Phase 2 build: the AI Grant & Compliance-Reporting Engine, generator onboarding packets, and the governed knowledge system — owned by Abound'],
      ['Managed IT & Security', 'The secure, governed foundation any responsible AI program stands on — endpoint security, Microsoft 365 governance, backup, and CISSP-led practices'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Founder & CEO', 'Ravi Jain — RJain@technijian.com'],
      ['Offices', '18 Technology Dr., Suite 141, Irvine, CA 92618 (HQ)  ·  Panchkula IT Park, Haryana, India (delivery center)'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources', BRAND_GREY, 'A'),
  spacer(100),
  p('Market, regulatory, and organizational intelligence gathered via public web research conducted and verified June 2026. Organization details are drawn from Abound Food Care’s own website and public jurisdiction, state, and nonprofit-sector sources, and should be confirmed with Abound before external use. No internal Abound data was used.', { italics: true }),
  spacer(120),
  p('1. Abound Food Care — aboundfoodcare.org (home, solutions, SB 1383 explainer, Enhanced Procurement Program pages; verified live June 2026). Seven solution lines: Enhanced Procurement Program, Food Resource Recovery, Food Donation, Logistics Coordination, Repurposing Kitchens, Data Collection, Emergency Food Management. Founded 2012 as Waste Not OC by Dr. Eric Handler and Mark Lowry; rebranded Abound Food Care 2021; CEO Mike Learakos; Santa Ana, California.', { size: 20 }),
  p('2. CalRecycle — SB 1383 (Short-Lived Climate Pollutants) edible-food-recovery requirements: Tier 1 commercial edible food generators required to recover surplus edible food under written agreements since January 1, 2022; Tier 2 since January 1, 2024; jurisdiction capacity, education, and monitoring obligations, with the enforcement phase live since 2024.', { size: 20 }),
  p('3. Ventura County Public Works Agency — announcement (March 2024) of the contract with Abound Food Care to implement a regional edible-food-recovery program covering unincorporated Ventura County and the cities of Camarillo, Fillmore, Moorpark, Ojai, Oxnard, Santa Paula, Simi Valley, and Ventura, working with countywide Tier 1 and Tier 2 generators to support SB 1383 compliance.', { size: 20 }),
  p('4. Capital Food Access Alliance (capfoodaccess.org) — the Sacramento-region alliance of Sacramento County and the cities of Citrus Heights, Elk Grove, Galt, Folsom, Rancho Cordova, and Sacramento, which hired Abound Food Care to help local organizations expand edible-food-recovery capacity; alliance grant programs (microgrants, equipment, expansion) with proposed projects to be completed by June 30, 2026.', { size: 20 }),
  p('5. City of Garden Grove — edible-food-recovery program page listing Abound Food Care among the food recovery organizations serving the city. City of Arcata — SB 1383 edible-food-recovery page: the city has contracted with Abound Food Care to help food-related businesses comply, providing education, guidance, and compliance-documentation support.', { size: 20 }),
  p('6. OC Waste & Recycling (oclandfills.com) — edible-food-recovery program page describing Abound Food Care as "a food recovery and recycling specialist that has pioneered the nation’s most effective and cost-efficient food recovery model," with the ChowMatch donation-matching application referenced in the county program.', { size: 20 }),
  p('7. Ecosystem references — Careit (donation-matching software adopted by California jurisdictions for SB 1383 tracking and donor guidance); ChowMatch; commercial recovery services (Replate, Copia); the category of solid-waste and SB 1383 jurisdiction-services consultancies; allied recovery organizations including Second Harvest Food Bank of Orange County and the OC Food Bank (OC Hunger Alliance). June 2026 checks of the public source layer AI assistants draw on for SB 1383 compliance queries (CalRecycle, jurisdiction pages, platform donor guides dominating; no full-service implementer cited).', { size: 20 }),
  p('8. Liability framework — the federal Bill Emerson Good Samaritan Food Donation Act and California AB 1219 (the California Good Samaritan Food Donation Act, effective 2018), the donor liability protections referenced in generator education content.', { size: 20 }),
  p('9. Enhanced Procurement Program partners — Abound Food Care program page and Voice of OC reporting (December 2024): group purchasing with Foodbuy, North America’s largest food group-purchasing organization, and Sysco, helping nonprofits buy food and supplies at combined-volume prices.', { size: 20 }),
  p('10. AI education layer — MIT Sloan Management Review (AI literacy for leaders); Anthropic, "Building Effective Agents" (workflow vs. agent design); a widely-used five-stage AI maturity model (consistent with the Gartner and Google Cloud frameworks); U.S. NIST AI Risk Management Framework (Govern, Map, Measure, Manage).', { size: 20 }),
  p('11. Technijian service capability — the My AI "Proven Results": Multi-Agent SEO and answer-engine platform (~70% content-production-time reduction); AI Document Intelligence for FINRA broker-dealers (responses days to minutes, 60–80% less manual review); ScamShield three-model LLM Council; Weaviate + Obsidian enterprise knowledge and memory system; AI-Native SDLC v7.0.', { size: 20 }),
  p('12. Technijian service pricing — My SEO published tiers ($500 to $1,500 monthly; Tier 4 at $1,250); My AI Lead Gen Starter $1,000 monthly; My AI Executive Workshop $5,000 one-time; My AI Fractional Advisor $2,000 monthly; My Dev custom build estimated ~$48,000 for the scoped engine (confirmed at quote); My Dev Managed App Services $800 monthly. Productized services beyond My SEO are estimated and confirmed at quote.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Abound-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
