// B2 Insurance Services (B2I) - AI Growth & Integration Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/AFC/build-afc-report.js (RKE/JDH/COB lineage).
// COLD PROSPECT: no meeting yet (June 2026). Tone = respectful, evidence-first, conservative claims.
// Logo: uses the AUTHENTIC assets/Technijian Logo 2.png.
// Diagrams embedded via pngDims() - aspect ratio derived from real PNG IHDR dimensions.

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
const GOLD          = 'C9922A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png');
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_PERSONAS_BUF = dbuf('personas.png');
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to B2: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  });
}

function pngDims(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'B2 INSURANCE SERVICES', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Business Insurance · Employee Benefits · Consulting  ·  Redondo Beach, California  ·  Founded 2013', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth & Integration Blueprint', size: 38, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'b2insurance.com  |  (424) 286-9400  |  CA License 0I22551', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for B2 Insurance Services', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '98.3%', label: 'Client retention — B2’s own published figure', color: CORE_BLUE },
    { number: '+10.7%', label: 'Average 2026 California small-group health renewal increase (carrier filings)', color: CORE_ORANGE },
    { number: '5.0★', label: 'Yelp rating — but only 6 reviews, on an unclaimed listing', color: TEAL },
    { number: '2019', label: 'The year B2’s blog went quiet — verified live, June 2026', color: GOLD },
  ]),
  spacer(300),
  p('B2 Insurance Services is the kind of firm the insurance industry says it wants more of. Founded in 2013 by brothers Keith and Derek Brewer — who worked side by side at a small brokerage for a decade before betting on their own values-based approach — B2 built a Redondo Beach practice on a promise most brokers only put in slide decks: consulting hours bundled into the Broker of Record relationship, HR outsourcing, employment-law guidance, 401(k) advising, even technology evaluations and back-office automation for clients. The published 98.3% retention rate says clients believe the promise. The reviews that exist are five-star and name agents personally. This is a substance-first firm.'),
  p('The problem is that in 2026, substance has a visibility problem — and B2’s is unusually severe. The firm’s name collides with the most famous aircraft in the world and a vitamin: a search for "B2 Insurance Services" plus the city returns the Northrop B-2 bomber and riboflavin supplements before the brokerage. A Google Maps search for B2’s exact name and street address resolves to a competing Redondo Beach agency founded in 1961. The blog last published in August 2019. The Yelp listing is unclaimed. Two of the three leadership bios on the website are placeholder text. None of this reflects the quality of the firm — and all of it is what a prospective client, and increasingly an AI assistant, actually sees. (Every claim above was verified live on June 11, 2026, with screenshots; Section 06 shows the evidence.)'),
  p('The timing makes this urgent rather than cosmetic. California small-group health renewals are arriving with an average increase near 10.7% for 2026 — some carriers filed near 13% — so every employer in B2’s market is about to have a hard renewal conversation, and industry surveys report roughly 69% of employers now want a strategic, advisory broker relationship rather than a transactional one. That is B2’s exact model. At the same moment, the state’s homeowners market is in genuine crisis — hundreds of thousands of non-renewals since 2021, a FAIR Plan that swelled past 550,000 policies and filed a 35.8% rate increase effective April 2026, and depopulation programs now opening — which means South Bay households need exactly the kind of broker B2 is. The demand side of B2’s business has never been louder. The firm just is not findable at the moments that demand goes looking.'),
  p('This blueprint works two fronts at once, and the distinction matters. The growth front (Sections 06 and 09): make "B2 Insurance" resolve to B2 in Google, in Maps, and in AI assistants; turn the 98.3%-retention client base into review velocity and referral signal; and give the commercial practice an account-intelligence layer for the Broker-of-Record pursuit — dossiers and renewal-window timing on named mid-market targets, not cold-list volume. The efficiency front (Section 10): put AI to work inside the brokerage — quote and renewal document intelligence, a governed HR-compliance assistant that scales the consulting hours B2 already gives away, and an institutional knowledge system that protects two decades of carrier and client know-how. The entry program is small on purpose: about $39,000 in Year 1 at published rates, month-to-month, with no custom build until the entry proves the lift.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'B2 already owns the hard things: a real consulting-grade service model, 98.3% retention, a founder story buyers remember, and a position in the most demand-rich insurance market California has seen in decades. What it lacks is entirely fixable: an entity-grade digital presence, an answer-engine footprint, review velocity to match its service quality, and the internal AI that lets a 16-person team out-serve consolidator branches.',
      'Nobody in the South Bay owns "local + AI." The nationals (HUB, USI, Marsh McLennan Agency) have analytics platforms but not local trust. The tech-native brokers (Nava, Newfront) market AI loudly but have no South Bay presence. The established local independents have the reviews but show no AI capability. The lane is open — and B2’s own brand language ("an industry disrupter") already claims it.',
      'The ask is deliberately conservative: roughly $39K in Year 1 at published rates, paced to the renewal calendar so visibility lands before Q4 renewal season. The custom build — the renewal document-intelligence engine — comes later, only after the entry proves itself.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built entirely from public information — B2’s website, LinkedIn, Yelp, carrier agency locators, California rate filings, and industry sources — verified in June 2026. B2’s internal numbers (book composition, revenue mix, renewal counts, staff hours) were not available and are deliberately not guessed at. Projections are labeled estimated and conservative, and the discovery questions in Section 11 replace assumptions with real baselines after one short conversation.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 THE CALIFORNIA SQUEEZE ----------
docChildren.push(
  ...sectionHeader('The California Squeeze — Why 2026 Is the Broker’s Moment', CORE_ORANGE, '02'),
  spacer(100),
  p('Three forces are converging on California insurance buyers right now, and each one pushes business toward exactly the kind of brokerage B2 is — if buyers can find it.'),
  spacer(60),
  subHeader('Force 1: The renewal shock on the benefits side'),
  p('California small-group health carriers filed 2026 increases averaging roughly 10.7%, with UnitedHealthcare near 13%, Kaiser and Blue Shield closer to 7%, and some filings exceeding 20% (per published analyses of California rate filings; Covered California’s individual market posted a 10.3% preliminary weighted average). Behind the averages: hospital and outpatient cost growth, specialty-drug inflation, and rising utilization. For every employer with 25 to 500 employees, the 2026 renewal letter is a budget event — and the standard advice is to start 90 to 120 days before renewal with plan analysis and broker negotiation. Employers stuck with a transactional broker get a spreadsheet and a shrug. Industry surveys report roughly 69% of employers now want a strategic, advisory relationship from their broker instead. Advisory is precisely what B2 sells — consulting hours inside the BOR, alternative funding analysis, HR support around the plan. The renewal shock is, bluntly, B2’s best prospecting season in years.'),
  subHeader('Force 2: The homeowners crisis on the personal-lines side'),
  p('California’s home-insurance market has seen hundreds of thousands of policies non-renewed or canceled since 2021, and seven of the state’s twelve largest home insurers limited or withdrew from new business between 2022 and 2025. The FAIR Plan — the insurer of last resort — swelled past 550,000 policies with roughly $600 billion in exposure, and in September 2025 filed its largest rate increase in seven years: 35.8%, effective April 2026, with roughly half of policyholders facing increases of 40 to 55%. Now the market is turning: depopulation programs are live, with Mercury committing to tens of thousands of new policies and CSAA quoting qualifying FAIR Plan policyholders. Translation for a South Bay broker: thousands of local homeowners are trapped in an expensive last-resort plan precisely as carriers reopen selectively — and every one of them needs a knowledgeable independent broker to remarket their coverage. This is a once-in-a-generation remarketing wave, and it rewards whoever is visible when a frustrated homeowner searches.'),
  subHeader('Force 3: The squeeze on independent brokerages themselves'),
  p('While demand surges, the brokerage industry itself is consolidating and re-arming. HUB, Acrisure, USI, Alliant, and Marsh McLennan Agency continue rolling up independent agencies across Los Angeles. A new class of tech-native brokers — Nava Benefits, Newfront (now part of WTW), Sequoia — markets AI-powered service directly against traditional firms in B2’s exact mid-market segment, with claims like 20+ hours of HR time saved per month and renewal savings. And payroll platforms (Gusto, Rippling) embed small-group benefits at the bottom of the market. An independent that stays independent wins by out-serving — and in 2026, out-serving at a 16-person scale increasingly means putting AI behind the humans. The good news: B2’s brand promise ("an industry disrupter," technology evaluations, back-office automation for clients) is already the right story. It is the only local firm whose positioning matches what the AI era rewards.'),
  spacer(120),
  calloutBox(
    'What the Squeeze Means for B2',
    [
      'Demand: every 2026 renewal letter and every FAIR Plan increase notice creates a buyer actively looking for a better broker — commercial and personal alike.',
      'Supply: the firms competing for that buyer are either consolidator branches (scale without intimacy), tech-native platforms (AI without local presence), or local independents (presence without AI). The local + AI quadrant is empty.',
      'Window: visibility built by September 2026 is in place for Q4 renewal season — the single highest-intent quarter of the insurance year. Visibility built next spring misses it.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 B2 TODAY ----------
docChildren.push(
  ...sectionHeader('B2 Today — The BOR-Plus-Consulting Model', TEAL, '03'),
  spacer(100),
  p('B2’s service architecture is broader than a typical 16-person agency, and the breadth is strategic: it makes the firm hard to displace once installed, and it explains the 98.3% retention figure the firm publishes. Five distinct lines, verified from the live site in June 2026:'),
  spacer(140),
  buildTable(
    [
      { label: 'Service Line', weight: 2.6 },
      { label: 'What It Includes', weight: 4.4 },
      { label: 'Strategic Role', weight: 3.0 },
    ],
    [
      ['Employee benefits / group health', 'Benefit program design addressing cost drivers, productivity, and retention; carrier negotiation; enrollment', { text: 'The anchor relationship — the BOR that everything else attaches to', bold: true }],
      ['Commercial P&C + risk', 'Property and casualty coverage, risk assessment for business clients', 'Rounds out the commercial account; second BOR'],
      ['Consulting (inside the BOR)', 'HR outsourcing (HR admin, benefits admin, payroll); retainer HR and management consulting (engagement, performance, recruiting, comp analysis, training); employment-law guidance; 401(k) advising; technology evaluations; back-office automation; business mapping; optimization projects', { text: 'The differentiator — consulting hours bundled into the brokerage relationship', bold: true }],
      ['Personal lines', 'Auto, home, health, dental, life, rental, umbrella, earthquake', 'Volume + the household side of every business owner'],
      ['Financial planning', '401(k) rollover, estate planning, retirement planning, term and permanent life', 'Deepens the owner relationship; highest lifetime value'],
    ],
    { headerColor: TEAL }
  ),
  spacer(160),
  subHeader('How B2 wins business', { color: TEAL }),
  p('Commercial accounts in this segment are not won through ad clicks. They are won through referrals, relationships, and Broker-of-Record letters — an employer who decides mid-relationship that a different broker should service their existing policies simply signs a BOR letter, and the book moves. That means B2’s commercial growth is account-based by nature: a definable universe of South Bay and greater Los Angeles employers, each won one relationship at a time, with timing driven by renewal windows and trigger events (a bad renewal, a service failure, a new CFO, an M&A event). The personal-lines side is the opposite motion: volume demand, arriving through local search, reviews, and referral — especially now, with the FAIR Plan wave in motion. A correct growth plan treats these as two different engines, and Section 09 does.'),
  spacer(100),
  calloutBox(
    'The Strategic Irony — and the Opening',
    [
      'B2 sells technology evaluations, back-office automation, and optimization projects to its clients. Its own digital operation — a 2019-era blog, an unclaimed Yelp profile, placeholder bios — does not yet match the promise. That gap is not a weakness to hide; it is the engagement’s opening move. When B2 installs an AI-powered growth and operations layer in its own house, the firm’s consulting pitch gains a proof point no South Bay competitor can copy: "we run this ourselves — let us show you."',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE BUYERS ----------
docChildren.push(
  ...sectionHeader('The Buyers — Five Personas, Two Growth Motions', CORE_BLUE, '04'),
  spacer(100),
  p('Five buyer personas emerge from B2’s own service pages, its content history (the 2018-19 blog wrote HR-compliance briefs for exactly one audience), its review evidence, and the structure of its market. Four are won account-by-account; one arrives in volume. Each persona card names the AI opportunity and the Technijian hook.'),
  spacer(160),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'Five buyers placed by relationship count and value', 600),
  diagramCaption('Figure 4.0 — Five buyers, one brokerage: where the value concentrates (placement derived from public evidence; calibrate at discovery)'),
  spacer(120),
  personaCard('1 · The Growth-Minded Owner', CORE_BLUE, [
    ['Role', 'Founder / CEO of a 25-200 employee Southern California company (B2’s site references manufacturing clients); makes the BOR decision'],
    ['Pain Points', 'Renewal increases eating the budget; HR complexity outgrowing the office manager; wants one trusted advisor, not five point solutions; too busy to evaluate technology'],
    ['Decision Driver', 'Trust plus proof: who will actually pick up the phone, and who makes my company measurably better between renewals'],
    ['AI Opportunity', 'Account dossiers and trigger monitoring put B2 in front of this buyer in the 90-120 day pre-renewal window with specifics, not a cold pitch'],
    ['Technijian Hook', 'My AI account intelligence + My SEO authority content that makes B2 the advisor this owner finds when the renewal letter lands'],
  ]),
  spacer(200),
  personaCard('2 · The Renewal-Shocked CFO', TEAL, [
    ['Role', 'CFO / controller of a mid-market employer staring at a 2026 renewal letter quoting +10 to 13%'],
    ['Pain Points', 'Cannot absorb the increase, cannot strip benefits in a tight labor market; current broker offers a spreadsheet, not a strategy; board wants options (funding alternatives, contribution redesign) by next quarter'],
    ['Decision Driver', 'Evidence of negotiation results and analytical depth — show me the alternatives and the math'],
    ['AI Opportunity', 'Renewal-window timing intelligence; comparison decks assembled in minutes from carrier quotes so B2’s proposal lands first and deepest'],
    ['Technijian Hook', 'My AI document intelligence (quote/SBC extraction and comparison) + renewal-season authority content that this CFO finds mid-search'],
  ]),
  spacer(200),
  personaCard('3 · The HR Leader Under Siege', CORE_ORANGE, [
    ['Role', 'HR director / manager at a 50-500 employee company; runs benefits administration and lives in compliance fear'],
    ['Pain Points', 'Open enrollment chaos; employee benefits questions all year; California employment-law exposure (leave laws, wage-hour, workplace-violence prevention); no bandwidth to vet AI tools the CEO keeps forwarding'],
    ['Decision Driver', 'Which broker actually reduces my workload — admin support, compliance answers, employee communication — not just places the policy'],
    ['AI Opportunity', 'A governed HR-compliance assistant under B2’s brand answers the recurring questions instantly, with human review — scaling the consulting hours B2 already bundles into the BOR'],
    ['Technijian Hook', 'My AI governed assistant build (Phase 2) + the content engine that answers this buyer’s questions publicly and wins the trust before the meeting'],
  ]),
  spacer(200),
  personaCard('4 · The Owner-Crossover Household', '8BC34A', [
    ['Role', 'The same business owner as persona 1 — wearing their household hat: home, auto, umbrella, earthquake, life, 401(k) rollover, estate'],
    ['Pain Points', 'Personal coverage scattered across direct writers; underinsured umbrella and earthquake exposure typical of beach-cities net worth; retirement and estate planning deferred for years'],
    ['Decision Driver', 'Convenience plus trust transfer — the broker who earned the business account earns the household'],
    ['AI Opportunity', 'Book mining surfaces every commercial client without personal lines (and vice versa); life-event triggers time the outreach'],
    ['Technijian Hook', 'My AI Lead Gen nurture flows on the existing book — warm cross-sell, never cold'],
  ]),
  spacer(200),
  personaCard('5 · The FAIR-Plan Refugee', CRITICAL, [
    ['Role', 'South Bay homeowner non-renewed by a major carrier, or trapped in the FAIR Plan facing the 35.8% April 2026 increase'],
    ['Pain Points', 'Skyrocketing premium for bare-bones coverage; confusion about depopulation options as Mercury, CSAA and others selectively re-enter; earthquake gap unaddressed'],
    ['Decision Driver', 'Findability and credibility at the moment of frustration — they search, read reviews, and call whoever looks competent'],
    ['AI Opportunity', 'Local search dominance plus review velocity captures the wave; remarketing campaigns work the existing book as depopulation windows open'],
    ['Technijian Hook', 'My SEO local visibility + reputation engine; My AI Lead Gen capture and nurture for the volume motion'],
  ]),
  spacer(160),
  calloutBox(
    'Why the Two-Motion Distinction Matters',
    [
      'Personas 1-4 are account-based: a finite universe of relationships won through trust, timing, and proof. For them, "lead generation" is the wrong tool; account intelligence, renewal-window triggers, and authority content are the right ones.',
      'Persona 5 is a volume motion: thousands of households in B2’s service area hitting the same crisis at once. For them, local search visibility, review credibility, and fast capture-and-nurture are exactly right.',
      'The engine in Section 09 runs both motions without confusing them — that is the design principle this research dictates.',
    ],
    CORE_BLUE
  ),
);

// ---------- 05 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape — Who Is Actually in the Ring', DARK_CHARCOAL, '05'),
  spacer(100),
  p('B2 competes in three directions at once: locally against established South Bay independents, upmarket against national consolidator branches, and structurally against tech-native brokerages that sell AI-powered service into its segment from anywhere. Eight named competitors, researched June 2026:'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.4 },
      { label: 'Type', weight: 2.0 },
      { label: 'Verified Data Point', weight: 2.9 },
      { label: 'Strength / Weakness vs B2', weight: 3.4 },
    ],
    [
      [{ text: 'Bichlmeier Insurance Services (Redondo Beach)', bold: true }, 'Local family independent, est. 1961, three generations', '76 Yelp reviews; Mercury + Nationwide appointed; niches in apartment buildings and non-profits', 'Captures B2’s own Google Maps searches today; deep local digital footprint / no visible AI or advisory-consulting layer'],
      ['HUB International (LA offices)', 'National consolidator', 'Top-5 global broker; multiple LA offices (Hope St, Wilshire)', 'Scale, markets, resources / branch-office service intimacy is the classic indie counter-story'],
      ['Marsh McLennan Agency', 'National (mid-market arm of Marsh)', 'Major LA-market benefits and P&C presence', 'Brand authority / same intimacy gap; mid-market is its declared target — direct collision with B2'],
      ['USI Insurance Services', 'National mid-market', '500K+ clients; proprietary USI ONE analytics platform', 'Already sells data-driven advisory / platform over person; B2 counters with the human plus AI story'],
      ['Alliant / Gallagher', 'National consolidators', 'Top-10 brokers, both actively acquiring across LA', 'Acquisition pressure on independents is also a recruiting pitch for B2’s independence'],
      ['Bolton & Co. (Pasadena)', 'Large CA independent (IMA-affiliated)', 'Roughly a century in the CA market', 'Shows what a scaled independent looks like / not South Bay-local'],
      [{ text: 'Nava Benefits', bold: true }, 'Tech-native benefits brokerage', 'Claims 600+ employers, 20+ hrs/month HR time savings, AI-powered member support (company-published)', 'Markets AI explicitly against traditional brokers in B2’s exact segment / no local presence, no P&C, no personal lines'],
      ['Newfront (now WTW)', 'Tech-native full-service', 'Technology-native platform; joined Willis Towers Watson', 'Validates the tech-broker model with global muscle / enterprise gravity, not South Bay mid-market service'],
    ],
    { headerColor: DARK_CHARCOAL }
  ),
  spacer(160),
  calloutBox(
    'The White Space No One Owns',
    [
      'Map the field on two axes — local trust and AI capability — and the upper-right quadrant is empty. The nationals and tech-natives have analytics and AI but no South Bay presence or relationships. The local independents have the relationships and the reviews but show no AI capability, no answer-engine visibility, and in most cases no content operation at all.',
      'B2 is the only local firm whose brand language ("an industry disrupter... technology evaluations... back-office automation") already claims the empty quadrant. What is missing is not positioning — it is the engine behind the words, and the visibility to be found claiming it. That is buildable, and Section 09 specifies it.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 06 DIGITAL REALITY AUDIT ----------
docChildren.push(
  ...sectionHeader('The Digital Reality — A Verified Audit', CORE_ORANGE, '06'),
  spacer(100),
  p('Everything in this section was verified live on June 11, 2026 — by direct page visits and screenshots, not third-party data tools. The findings are presented not as criticism but as the gap map this engagement closes: each row is a fixable asset, and several are fixable within a week.'),
  spacer(140),
  buildTable(
    [
      { label: 'Asset', weight: 2.2 },
      { label: 'Verified Finding (June 11, 2026)', weight: 4.6 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      [{ text: 'Google Maps / Business Profile', bold: true }, 'Two direct searches — the firm’s name plus city, then its exact name plus street address — both resolved to Bichlmeier Insurance Services, a competitor. If a B2 profile exists, it does not surface for the firm’s own name and address', { text: 'Prospects who hear "B2 Insurance" and search land on a competitor founded in 1961', color: CRITICAL }],
      [{ text: 'Brand-name search', bold: true }, 'A quoted web search for "B2 Insurance Services" + Redondo Beach + reviews returned the Northrop B-2 bomber, Vitamin B2 supplements, and an audio company on page one — no B2 Insurance result', { text: 'The brand token "B2" is invisible without deliberate entity work — in classic search and in AI assistants alike', color: CRITICAL }],
      ['Yelp', '5.0 stars — but only 6 reviews, and the listing is unclaimed ("Verify this business" panel showing)', 'A 98.3%-retention client base could produce 10x the review count; claiming the listing is free'],
      ['LinkedIn', 'Approximately 130 followers (captured June 2026); 16 employees listed; no recent founder posting cadence visible', 'The benefits-buying audience lives on LinkedIn; the channel is essentially unworked'],
      ['Blog / content', 'Last post August 19, 2019; seven posts total (FMLA, ADA, OSHA, HR briefs, 2018-19)', 'The editorial instinct was right — HR-compliance content for exactly the right buyer — it just stopped'],
      ['Website hygiene', 'Leadership page: one real bio (Keith); two placeholder Lorem Ipsum bios (Derek Brewer, Jacqueline Rogers); page URL slug is "new-page-3"', 'A diligence-minded CFO who checks the team page sees an unfinished site'],
      ['NAP consistency', 'Site footer says Suite 203; Yelp, LinkedIn and carrier locators say Suite 201', 'Address inconsistency suppresses local-search trust signals'],
      ['Booking', 'A "Book a Meeting" button exists on the contact page', 'A genuine positive — the conversion endpoint is already in place'],
    ],
    { headerColor: CORE_ORANGE }
  ),
  spacer(160),
  subHeader('The AI-search dimension', { color: CORE_ORANGE }),
  p('Buyers increasingly ask AI assistants — ChatGPT, Perplexity, Gemini, Copilot — questions they used to type into Google: "best employee benefits broker near Torrance for a 100-person company," "how do I get off the California FAIR Plan," "is a 13% renewal increase normal." These engines compose answers from entities and sources they can resolve and trust. A firm whose name cannot be disambiguated from a strategic bomber, whose profiles are unclaimed, and whose site has published nothing since 2019 effectively does not exist to them. The box below illustrates the mechanics.'),
  spacer(100),
  calloutBox(
    'AI Search Reality Check — Illustrative',
    [
      'Prompt a buyer might ask an AI assistant today: "Who are the best business insurance and employee benefits brokers near Redondo Beach for a mid-size company?"',
      'How such engines typically resolve it: national names with heavy digital footprints (HUB, Marsh McLennan Agency, USI), tech-forward brokers with deep content libraries (Newfront, Nava), and locally, whichever independents have claimed profiles, review depth, and recent content — the signals Bichlmeier has and B2 currently lacks.',
      'This box is illustrative of how AI search composes answers from entity and authority signals; it is not a screenshot of a specific engine’s output. The pattern it illustrates, however, is exactly what the verified findings above predict — and Section 09’s first workstream exists to change it.',
    ],
    DARK_CHARCOAL
  ),
  spacer(100),
  calloutBox(
    'The Cost of Waiting',
    [
      'Every quarter this gap stays open, three things compound against B2: the Q4 2026 renewal-shock searches get answered by competitors’ content; the FAIR Plan depopulation wave — already in motion — gets captured by whoever is visible when homeowners go looking; and AI assistants continue learning that other entities are the answer to questions B2 should own. Visibility is a flywheel: reviews, citations, and content authority accrue to whoever starts first, and catching up costs more than starting did.',
    ],
    CRITICAL
  ),
);

// ---------- 07 CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof — Built, Not Promised', CORE_BLUE, '07'),
  spacer(100),
  p('Before any growth pitch, the fair question is: has Technijian actually built these things? Six proven builds map directly onto B2’s situation. Each box names what exists today and the specific application to a Redondo Beach brokerage.'),
  spacer(140),
  capabilityBox(
    'Proven Build: Multi-Agent SEO + AEO Platform',
    'A production platform that runs search and answer-engine optimization with multiple AI models (Claude, GPT-4o, Gemini) orchestrated over live SEMrush, GA4, and Perplexity data — researching, drafting, fact-checking, and publishing authority content tuned to be cited by AI engines, at roughly 70% less production time than manual workflows.',
    'This is the engine that fixes the name-collision problem: entity-grade schema and profile work plus a steady cadence of renewal-season and FAIR-Plan authority content, structured so that when a South Bay CFO or homeowner asks Google or an AI assistant the questions in Section 06, B2 is the cited answer.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build: AI Document Intelligence',
    'A document-intelligence engine built for a financial-compliance environment that turns multi-day RFP and document-review cycles into minutes — extraction, structured comparison, and drafted output with 60-80% less manual review.',
    'Pointed at a brokerage’s renewal stack: carrier quotes, SBCs, ACORD forms, and loss runs extracted and compared automatically, with renewal comparison decks drafted for producer review. Industry reports describe this class of automation taking what once consumed two staff members a full day down to under thirty minutes — at B2’s scale, that is renewal-season capacity without renewal-season hiring.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build: LLM Council — Three-Model Peer Review',
    'A pattern (production-proven in ScamShield, a fraud-detection service) where three independent AI models review the same output and must agree before it ships — catching the errors any single model makes alone.',
    'The trust architecture for anything compliance-adjacent B2 publishes or answers: employment-law guidance, plan-comparison summaries, client-facing explanations. For a firm whose consulting credibility is the product, "three models check every answer, then a human signs it" is a story a skeptical CFO accepts.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build: Institutional Knowledge System',
    'A Weaviate vector-database plus Obsidian knowledge architecture that turns years of scattered institutional knowledge — files, notes, project history — into a searchable, answerable system.',
    'Keith and Derek carry two decades of carrier appetite, underwriter relationships, client history, and placement know-how in their heads. Captured into a knowledge system, it ramps new producers in weeks instead of years, survives any single departure, and answers "have we ever placed something like this?" in seconds.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build: AI-Native Custom Delivery (SDLC v7.0)',
    'A development methodology where AI agents handle the build under human architectural control — delivering custom applications 3-5x faster than traditional development, with the same engine behind client portals, dashboards, and workflow tools.',
    'When the entry program proves out, this is what builds B2’s Phase-2 assets at a boutique budget: the renewal document-intelligence workflow, a client self-service portal (certificates, ID cards, policy questions), or the governed HR-compliance assistant — scoped at discovery, priced at published labor rates.'
  ),
  spacer(160),
  capabilityBox(
    'Proven Build: AI Review & Reputation Engine',
    'An automated review-generation and reputation-management system for consumer-facing businesses — systematic post-service review requests, response drafting, and rating velocity tracking.',
    'B2’s 98.3% retention means hundreds of satisfied clients who have simply never been asked. A systematic, personal-feeling review program converts that goodwill into the public signal — Yelp, Google — that persona 5 reads before calling, and that AI engines weigh when composing answers.'
  ),
  spacer(160),
  calloutBox(
    'Why This Does Not Cost a Fortune — The Multi-Model Discipline',
    [
      'A reasonable worry: "if AI touches content, renewals, outreach, and service, the model bills must be enormous." Technijian’s answer is architectural: no single premium model runs everything. Work is decomposed and routed across roughly seven models in three tiers — lightweight models for high-volume mechanical work (extraction, classification, enrichment), workhorse models for drafting and reasoning, and frontier models reserved for the small slice that genuinely needs deep judgment (final brand-voice passes, compliance-critical answers).',
      'Example, tuned to B2: a quote-comparison run extracts carrier data on the cheapest tier, drafts the comparison on the mid tier, and escalates only the recommendation language to a frontier model with council review. The result is typically a 60-80% lower run cost than wiring everything to one premium model — engineering norms, not a client-specific guarantee, and exactly the kind of routing a one-tool agency never builds.',
    ],
    TEAL
  ),
);

// ---------- 08 UNDERSTANDING AI ----------
docChildren.push(
  ...sectionHeader('Understanding AI — A Field Guide for B2 Leadership', TEAL, '08'),
  spacer(100),
  p('This section sells nothing. It is the two-page grounding a leadership team deserves before committing budget — what AI actually is, where B2 sits on the adoption curve, the three risks that matter, and when a partner beats a hire. Every framework cited is third-party and checkable.'),
  spacer(60),
  subHeader('What AI is — and the one distinction that matters', { color: TEAL }),
  p('MIT Sloan’s guidance for executives is that leaders need to know what AI can and cannot do — not how to build it. The single most useful distinction comes from Anthropic’s engineering guide "Building Effective Agents": workflows are AI following a predefined path ("extract these fields from every quote PDF and fill this comparison template") — predictable, testable, low-risk. Agents are AI deciding its own steps ("watch these fifty target accounts and tell me when one is worth a call") — more powerful, and requiring oversight. The operating principle this blueprint follows: use the simplest thing that works. B2’s first-year program is almost entirely workflows; agent-style autonomy earns its way in later, where monitoring justifies it. That ordering is why the roadmap looks the way it does.'),
  subHeader('Where B2 sits — the maturity ladder', { color: TEAL }),
  buildTable(
    [
      { label: 'Stage', weight: 2.2 },
      { label: 'What It Looks Like', weight: 5.0 },
      { label: 'Who', weight: 2.6 },
    ],
    [
      ['1 · Exploring', 'Individuals try ChatGPT informally; no shared tooling, policy, or measurement', { text: 'Most independent agencies — and, on public evidence, B2 today', bold: true }],
      ['2 · Assisted', 'Defined AI workflows in specific tasks (content drafts, quote extraction) with human review and basic guardrails', 'Where the entry program lands B2 within 90 days'],
      ['3 · Operational', 'AI embedded in core processes (renewal cycle, service desk); measured ROI; governed data', 'Where Year 1 ends — the renewal machine'],
      ['4 · Scaled', 'AI across the client lifecycle; proprietary data assets; clients feel the difference', 'Tech-native brokers like Nava market from here'],
      ['5 · Transformational', 'AI-native operating model; the firm’s economics differ structurally from peers', 'A handful of leaders in any industry'],
    ],
    { headerColor: TEAL }
  ),
  spacer(120),
  p('(A widely-used five-stage maturity model, consistent with Gartner and Google Cloud adoption frameworks.) Two honest observations: most established independents sit exactly where B2 sits, so there is no embarrassment in the starting point — and the gap to stage 3 closes in months, not years, which is why the firms that start now open a service gap the laggards feel at renewal time.'),
  subHeader('The three risks every leader must manage', { color: TEAL }),
  p('The NIST AI Risk Management Framework gives executives a four-function mental model — Govern, Map, Measure, Manage. In practice, three risks cover what a brokerage owner must care about:'),
  bullet('Hallucination — AI states a confident wrong answer. Management: human review on everything client-facing or compliance-bound, plus council-style multi-model checking (Section 07) on the answers that matter most. A wrong leave-law answer under B2’s letterhead is not a model problem; it is a brand problem — so the architecture assumes fallibility.'),
  bullet('Data leakage — the non-negotiable for a benefits broker. Client census files, health information, claims experience, and salary data never enter public AI tools. Private, governed deployments only, with an inventory of every AI tool, its owner, and its data sources (straight from NIST’s Govern function). This discipline is also a selling point to B2’s own compliance-minded clients.'),
  bullet('Accountability — every AI-assisted output has a named human owner. The producer signs the renewal deck; the consultant signs the compliance answer. AI accelerates the work; it never owns it.'),
  subHeader('What peers are already doing', { color: TEAL }),
  p('Representative directions of travel across the brokerage industry — sourced from industry reporting, not Technijian client outcomes: agencies using OCR-plus-AI intake report renewal-document processing dropping from staff-days to under an hour; firms running AI research briefs and personalized outreach report new-producer ramp times falling dramatically; AI administrative automation is widely reported to reclaim 20-30% of service-staff time. Treat these as industry signals, not guarantees — B2’s own numbers get established at discovery and measured at the 90-day gate.'),
  subHeader('A day in the life — renewal season, before and after', { color: TEAL }),
  p('Before: an account manager opens a 90-group renewal queue. For each: chase the carrier quote, re-key plan details into a spreadsheet, build the comparison, draft the email, answer the client’s five compliance questions from memory or a binder. Two hours per group on mechanics; the strategic conversation gets whatever is left. After: the quote and SBC land in a watched folder; extraction and comparison are drafted by the time coffee is poured; the account manager reviews, adjusts the recommendation, and spends the recovered ninety minutes on the call that actually retains the client — the one where B2’s advisory model lives. Same person, same standards, far more capacity where it counts.'),
  subHeader('Partner, hire, or DIY tools', { color: TEAL }),
  buildTable(
    [
      { label: 'Path', weight: 2.2 },
      { label: 'True Cost', weight: 3.4 },
      { label: 'What You Get — and Own', weight: 4.2 },
    ],
    [
      ['DIY tools', 'Hundreds of dollars/month in subscriptions', 'Point solutions you must integrate, govern, and babysit yourself — and you own all three risks above with no architecture'],
      ['Hire', 'A capable AI lead runs $180K+/year (estimated, market-typical) and is scarce', 'One person who cannot cover strategy, build, security, and governance alone — and who the consolidators will recruit'],
      [{ text: 'Partner (Technijian)', bold: true }, 'A fraction of one hire — the entry program in Section 11 is about $39K/year', { text: 'Strategy + build + security + governance, with the proven builds in Section 07 and a CISSP-led security practice behind every deployment', bold: true }],
    ],
    { headerColor: TEAL }
  ),
);

// ---------- 09 GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms B2’s Growth Engine', CORE_BLUE, '09'),
  spacer(100),
  p('The engine has three coordinated fronts, and it respects the two-motion reality from Section 04: the commercial practice gets account-based depth — intelligence, timing, and authority aimed at named targets — while the personal-lines side gets honest volume capture. Nothing here replaces the relationship selling that built B2’s 98.3% retention; the engine works underneath it, making sure the relationships start sooner, with better information, at the right moment.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The B2 AI Growth and Integration Engine', 620),
  diagramCaption('Figure 9.0 — Three fronts, one engine, one governance boundary. Inbound makes B2 findable; outbound deepens the named-account pursuit; internal makes 16 people operate like fifty.'),
  spacer(120),
  subHeader('Inbound — get found and get cited'),
  p('The first workstream is entity repair: schema markup, profile claiming, NAP consistency (one suite number everywhere), and citation building until "B2 Insurance" plus any local qualifier resolves to the brokerage — in Google, in Maps, and in AI assistants. On top of that foundation, the content engine restarts the silent-since-2019 blog with the two content franchises the moment demands: renewal-season guidance for employers (what a 10.7% average increase means, what alternatives exist, what to ask your broker) and FAIR-Plan navigation for homeowners (depopulation eligibility, earthquake gaps, what re-entering carriers want to see). Every piece is structured for answer-engine citation — the questions buyers actually ask, answered directly, with B2 as the named source. The 2018-19 blog proves the firm always knew what its buyers needed to read; the engine simply makes the cadence sustainable.'),
  subHeader('Outbound — win the BOR, account by account'),
  p('For the commercial practice, outbound means depth on named targets, not volume on strangers. The account-intelligence layer maintains a living dossier on each target employer: headcount trends, hiring surges, leadership changes, funding or M&A events, OSHA citations, carrier-exit exposure, and — most valuable of all — renewal-window timing, so a producer’s outreach lands inside the 90-120 day window when the +13% letter is sitting on the CFO’s desk. Trigger monitoring watches the list continuously and tells producers who is worth a call this week and why. Meanwhile, book mining works the warmest universe B2 owns: existing clients. Commercial accounts without personal lines, households without umbrella or earthquake coverage, FAIR-trapped homeowners in the book as depopulation windows open — each becomes a timed, personalized, human-sent touch. None of this is "lead generation" in the shotgun sense; it is the firm’s existing relationship strategy, finally armed with timing and information.'),
  subHeader('Internal — the renewal machine and the brain'),
  p('Section 10 details the efficiency front; the headline here is strategic. Quote-and-renewal document intelligence converts B2’s most labor-intensive season into its most scalable one. The governed HR-compliance assistant turns the consulting hours B2 bundles into the BOR — its core differentiator — from a capacity constraint into a scalable asset. And the knowledge system makes the Brewers’ two decades of placement know-how a firm asset rather than a key-person risk. Every internal hour recovered is producer capacity pointed back at the growth fronts.'),
  spacer(140),
  subHeader('The AI tools matrix'),
  buildTable(
    [
      { label: 'Tool', weight: 2.6 },
      { label: 'Use Case', weight: 3.4 },
      { label: 'Impact Metric (estimated)', weight: 2.6 },
      { label: 'Technijian Service', weight: 2.2 },
    ],
    [
      ['Entity & answer-engine optimization', '"B2 Insurance" resolves to B2 across Google, Maps, and AI assistants; renewal + FAIR content cited in answers', 'Brand-search resolution; AI-citation presence; local-pack entry', 'My SEO + AI Search Optimization'],
      ['Review & reputation engine', 'Systematic review requests across the retained base; response drafting', 'Review count toward the 76-review local benchmark; rating maintained at 5.0', 'My SEO'],
      ['Account-intelligence dossiers', 'Living profiles + trigger alerts on named commercial targets; renewal-window timing', 'Producer meetings booked per quarter; win-rate on pursued BORs', 'My AI'],
      ['Book mining & cross-sell', 'Coverage-gap detection across the existing book; FAIR-depopulation remarketing', 'Cross-sell policies per 100 clients; remarketing capture rate', 'My AI Lead Gen'],
      ['Quote & renewal document intelligence', 'Extraction + comparison of carrier quotes, SBCs, ACORD forms, loss runs; drafted renewal decks', 'Hours per renewal; renewals processed per staffer per week', 'My Dev (Phase 2, scoped)'],
      ['Governed HR-compliance assistant', 'CA employment-law and benefits-compliance answers, grounded on vetted sources, human-reviewed', 'Consulting hours scaled; response time on client questions', 'My AI (Phase 2)'],
      ['Knowledge system', 'Carrier appetite, placement history, client institutional memory — searchable', 'New-producer ramp time; "who knows X" lookups eliminated', 'My AI (Phase 2)'],
    ],
  ),
  spacer(140),
  calloutBox(
    'What This Engine Deliberately Is Not',
    [
      'It is not mass cold email under B2’s name, not auto-published content without human review, not a chatbot answering compliance questions unsupervised, and not client data fed to public AI tools. Each exclusion protects the same asset: the trust that produced 98.3% retention. The engine’s job is to multiply that trust’s reach — never to spend it.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 10 OPERATIONAL EFFICIENCY ----------
docChildren.push(
  ...sectionHeader('Inside the Brokerage — AI-Powered Operational Efficiency', TEAL, '10'),
  spacer(100),
  p('Growth is half the thesis. The other half saves money and de-risks what B2 already does — often the easier "yes," and for a 16-person firm heading into a renewal season shaped by double-digit increases, arguably the more valuable one. The workflows below are inferred from B2’s public service descriptions (group health, P&C, HR outsourcing, payroll, personal lines) and standard brokerage operations; each row cites a real Technijian build or published industry benchmark, and every estimate is labeled for confirmation at discovery.'),
  spacer(140),
  buildTable(
    [
      { label: 'B2 Workflow Today', weight: 3.2 },
      { label: 'AI Integration', weight: 3.6 },
      { label: 'Proven Result', weight: 3.2 },
    ],
    [
      ['Renewal processing — chase quotes, re-key plan data, build comparisons, draft client decks for every group, every year', 'Document-intelligence extraction of quotes/SBCs/ACORD forms; auto-drafted comparison decks for producer review', 'Technijian document-intelligence build: multi-day review cycles to minutes, 60-80% less manual review; industry reports: ~2 staff-days to <30 min'],
      ['Client compliance questions — leave laws, COBRA, ACA reporting — answered ad hoc by whoever knows', 'Governed assistant grounded on vetted CA/federal sources; drafts answers, human signs', 'LLM Council pattern (ScamShield): three models must agree before output ships'],
      ['Certificates, ID cards, policy lookups — staff interrupt-driven service requests', 'Self-service portal + AI triage for routine requests; staff handle exceptions', 'AI-Native SDLC: custom portals delivered 3-5x faster than traditional builds'],
      ['Institutional knowledge — carrier appetite and client history living in two founders’ heads', 'Weaviate + Obsidian knowledge system; searchable placement and client memory', 'Technijian knowledge-system build: years of scattered knowledge made answerable'],
      ['Review requests and referral asks — manual, sporadic, usually skipped in busy seasons', 'Automated, personal-feeling post-service review and referral flows', 'Technijian review-engine build: systematic velocity without staff time'],
      ['Cross-sell identification — gaps spotted only when a client happens to mention something', 'Book-wide coverage-gap scans + life-event triggers feeding producer queues', 'Technijian lead-gen engine: timed, warm outreach from existing-book signals'],
    ],
    { headerColor: TEAL }
  ),
  spacer(160),
  subHeader('What the recovered hours are worth', { color: TEAL }),
  buildTable(
    [
      { label: 'Efficiency Lever', weight: 3.6 },
      { label: 'Conservative Annual Impact (estimated — confirm at discovery)', weight: 6.4 },
    ],
    [
      ['Renewal-season document handling', 'If document intelligence saves even 1.5 hours per group renewal across the book, renewal season returns hundreds of staff hours — capacity for the advisory calls that retain clients, without seasonal hiring'],
      ['Compliance Q&A handling', 'Routine questions answered in minutes instead of research time; consulting hours inside the BOR stretch further — the differentiator scales instead of capping out'],
      ['Service-request triage', 'Industry reports place 20-30% of service-staff time in automatable administrative work; even the conservative end frees one full-time-equivalent of capacity across a 16-person firm'],
      ['Producer ramp & knowledge lookups', 'New hires reach productive fluency against a searchable knowledge base instead of apprenticeship-by-interruption; founder time stops being the bottleneck'],
      ['Retention protection', 'At 98.3% retention, even half a point protected is real revenue — and renewal-season service quality is exactly what AI capacity protects when increases make clients shop'],
    ],
    { headerColor: TEAL }
  ),
  spacer(140),
  calloutBox(
    'The Two-Front Logic, Stated Plainly',
    [
      'The growth front (Section 09) earns new revenue; this front protects existing revenue and recovers the hours that fund the growth motion. They share infrastructure — the same document intelligence that speeds renewals feeds the account dossiers; the same knowledge system that ramps producers powers the compliance assistant. Build once, benefit twice. That sharing is also why the entry program stays small: most of Phase 1 is configuration and content, not construction.',
    ],
    CORE_BLUE
  ),
);

// ---------- 11 BUSINESS IMPACT & INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_ORANGE, '11'),
  spacer(100),
  p('The program is structured land-and-expand: a deliberately small entry of recurring, quick-win services at published rates — no large build, month-to-month — followed by an expansion phase that begins only after the entry proves measurable lift. The headline ask is the entry, not the engine.'),
  spacer(60),
  subHeader('The entry offer — productized and risk-reversed', { color: CORE_ORANGE }),
  calloutBox(
    'The 90-Day Be-Findable Pilot',
    [
      'What it is: entity repair (profiles claimed, NAP fixed, schema live), the review engine running on the retained base, the content cadence restarted with renewal-season and FAIR-Plan franchises, and lead capture-and-nurture live on the personal-lines side — everything in Phase 1 of the roadmap, at the published rates below.',
      'The metric it will be judged on: "B2 Insurance" searches resolving to B2 (not a bomber, not a competitor) across Google, Maps, and major AI assistants — plus review-count growth against the 76-review local benchmark.',
      'The risk reversal: month-to-month, no long-term contract, and an honest 90-day gate review. If the pilot is not visibly working, we will say so plainly and recommend stopping — the same stop-or-scale discipline (McKinsey-style stage gates) we apply to every AI investment we recommend.',
    ],
    CORE_ORANGE
  ),
  spacer(140),
  subHeader('Service investment map', { color: CORE_ORANGE }),
  buildTable(
    [
      { label: 'Service', weight: 3.3 },
      { label: 'Scope', weight: 3.7 },
      { label: 'Monthly', weight: 1.5, align: AlignmentType.RIGHT },
      { label: 'Year 1', weight: 1.5, align: AlignmentType.RIGHT },
    ],
    [
      ['My SEO — Tier 3 + AI Search Optimization + PR + Content Syndication', 'Entity repair, local SEO, review engine, content cadence (renewal + FAIR franchises), answer-engine optimization, quarterly PR, syndication', '$1,550', '$18,600'],
      ['My AI Lead Gen — Starter', 'Capture + nurture on personal-lines demand and book-mining campaigns; includes one-time setup $2,500', '$1,499', '$20,488'],
      [{ text: 'ENTRY PROGRAM — the ask', bold: true }, { text: 'Everything above; month-to-month; 90-day gate review', bold: true }, { text: '', bold: true }, { text: '$39,088', bold: true, color: CORE_ORANGE }],
      ['My AI — Executive AI Workshop (optional Phase-1 add-on)', 'Half-day leadership session: AI literacy, governance policy, tool inventory (estimated)', 'one-time', '$5,000'],
      ['My Dev — renewal document-intelligence build (Phase 2)', 'Quote/SBC/ACORD extraction + comparison engine; client portal as scoped', '—', 'TBD — scoped at discovery'],
      ['My AI — governed HR-compliance assistant + knowledge system (Phase 2)', 'Vetted-source grounding, council review, human sign-off; Weaviate knowledge base', '—', 'TBD — scoped at discovery'],
      ['My Dev — Managed App Services (Phase 2, after build)', 'Hosting, monitoring, iteration on Phase-2 builds (estimated)', '$800', '$9,600'],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Ongoing strategy, governance, measurement — 4 hrs/month (estimated)', '$2,000', '$24,000'],
    ],
    { headerColor: CORE_ORANGE }
  ),
  spacer(120),
  p('My SEO and My AI Lead Gen figures are Technijian’s published rates. Items marked estimated follow Technijian’s standard service defaults; items marked TBD are custom scope, quoted after discovery at the labor rates below. Phase-2 lines are the expansion — shown for planning honesty, not as part of the ask. Annual prepay on My AI Lead Gen saves 17% and waives setup.', { italics: true, size: 20 }),
  spacer(100),
  subHeader('Published labor rates (custom work, ad hoc or Phase 2)', { color: CORE_ORANGE }),
  buildTable(
    [
      { label: 'Role', weight: 3.4 },
      { label: 'Normal Hours (M-F 7a-7p PT)', weight: 2.4, align: AlignmentType.RIGHT },
      { label: 'After Hours', weight: 2.0, align: AlignmentType.RIGHT },
      { label: 'Contracted Cycle', weight: 2.2, align: AlignmentType.RIGHT },
    ],
    [
      ['Technical / development', '$150/hr', '$250/hr', '$125/hr'],
      ['CTO / vCIO / AI strategy', '$250/hr', '$350/hr', '$225/hr'],
    ],
    { headerColor: DARK_CHARCOAL }
  ),
  spacer(140),
  subHeader('The ROI model — honest method, conservative numbers', { color: CORE_ORANGE }),
  p('The method, stated openly: value at stake = (new commercial relationships won with the engine’s help x typical account revenue) + (personal-lines and cross-sell volume captured) + (renewal-season staff hours recovered, valued at loaded cost) + (retention protected). B2’s actual account economics are private, so the model uses deliberately modest illustrative assumptions — e.g., the engine contributing to one or two mid-market commercial wins across the year, a modest share of the FAIR-wave volume, and the conservative end of industry hour-recovery benchmarks. Discovery replaces every assumption with B2’s real baselines before anything is promised.'),
  spacer(100),
  buildTable(
    [
      { label: 'Scenario', weight: 3.0 },
      { label: 'Modeled Year-1 Value (illustrative)', weight: 3.4, align: AlignmentType.RIGHT },
      { label: 'vs. $39,088 Entry', weight: 3.6, align: AlignmentType.RIGHT },
    ],
    [
      ['Downside-protected (engine underperforms; efficiency hours + a handful of personal-lines wins only)', '$45,000', '1.2x — the floor still clears the cost'],
      [{ text: 'Expected (the planning case)', bold: true }, { text: '$95,000', bold: true }, { text: '2.4x', bold: true, color: CORE_ORANGE }],
      ['Upside (a strong renewal season: two commercial wins + meaningful FAIR-wave capture)', '$160,000', '4.1x'],
    ],
    { headerColor: CORE_ORANGE }
  ),
  spacer(120),
  p('All three scenarios are modeled against the entry program only; the Phase-2 expansion adds gains (renewal-machine capacity, the compliance assistant) that this table deliberately does not count. Projected, estimated, never guaranteed — and re-baselined at the 90-day gate with real data.', { italics: true, size: 20 }),
  spacer(100),
  subHeader('Discovery questions that calibrate everything', { color: CORE_ORANGE }),
  bullet('Book shape: how many group clients, average group size, and what share of revenue is benefits vs. P&C vs. personal lines vs. consulting?'),
  bullet('Renewal operations: how many renewals land in Q4, who builds the comparisons today, and how many hours does each consume?'),
  bullet('Commercial pursuit: how many named targets is the firm actively pursuing, and what triggered the last three BOR wins?'),
  bullet('Consulting hours: how many bundled hours does the BOR promise consume per client per year, and which questions recur most?'),
  bullet('Personal lines: how many book clients sit on the FAIR Plan or carry no earthquake/umbrella coverage today?'),
  bullet('Technology: what agency-management system runs the book (the integration point for every workflow above)?'),
);

// ---------- 12 ROADMAP ----------
docChildren.push(
  ...sectionHeader('The Roadmap — Paced to the Renewal Calendar', CORE_BLUE, '12'),
  spacer(100),
  p('Insurance has a clock: Q4 is renewal season, when every commercial buyer is in motion and every retention risk is live. The roadmap is built backward from that clock. Phase 1 makes B2 findable before the season starts; Phase 2 arms the firm for the season itself; Phase 3 compounds what worked and adds the custom build once the entry has proven the lift.'),
  spacer(160),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'The first year, paced to the renewal calendar', 620),
  diagramCaption('Figure 12.0 — Be findable by September, win renewal season by January, compound all year. The custom build waits for proof.'),
  spacer(120),
  subHeader('Days 0-90 — Be findable (summer, before the season)'),
  bullet('Entity repair sprint: claim Yelp and Google profiles, fix the NAP suite-number mismatch, deploy schema, replace the placeholder leadership bios — the one-week fixes first.'),
  bullet('Review engine live: systematic, personal-feeling requests into the retained base; target steady monthly velocity against the 76-review local benchmark.'),
  bullet('Content restart: the renewal-season franchise (for employers) and the FAIR-Plan franchise (for homeowners) publishing on cadence, structured for answer-engine citation.'),
  bullet('Capture live: My AI Lead Gen Starter capturing and nurturing personal-lines demand; baseline metrics recorded for the 90-day gate.'),
  subHeader('Days 90-180 — Win renewal season (Q4 into January)'),
  bullet('90-day gate review: brand-search resolution, review velocity, capture volume — stop, fix, or scale, stated honestly.'),
  bullet('Account-intelligence pilot: dossiers and trigger alerts on the named commercial target list; producer outreach timed to renewal windows.'),
  bullet('FAIR-depopulation remarketing: campaigns into the book as carrier re-entry windows open; renewal-shock content peaks with the season.'),
  subHeader('Days 180-365 — Compound (the expansion, on proof)'),
  bullet('Renewal document-intelligence build scoped and delivered (My Dev, quoted at published labor rates after discovery) — in production before the next renewal season.'),
  bullet('Governed HR-compliance assistant and knowledge system: the consulting differentiator, scaled.'),
  bullet('Measurement rhythm: stage-gate review each quarter — adoption, operational lift, financial benefit vs. total cost — scale what clears the bar, stop what does not.'),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — This Week, No Contract Required', TEAL, '13'),
  spacer(100),
  p('Seven actions B2 can take immediately, free, with or without Technijian. Each one closes a verified gap from Section 06 — and several will be visible in search results within days.'),
  spacer(120),
  buildTable(
    [
      { label: '#', weight: 0.6, align: AlignmentType.CENTER },
      { label: 'Action', weight: 4.4 },
      { label: 'Why Now', weight: 5.0 },
    ],
    [
      ['1', 'Claim the Yelp listing (the "Verify this business" panel is showing today)', 'Ten minutes; lets the firm respond to reviews and fixes the unclaimed-profile trust signal'],
      ['2', 'Claim or create the Google Business Profile and load it: photos, hours, services, the correct suite number', 'Today, searches for B2’s own name + address resolve to a competitor — this is the single highest-impact free fix'],
      ['3', 'Pick one suite number (201 or 203) and align the website footer, Yelp, LinkedIn, and carrier locator listings', 'NAP consistency is a core local-search trust signal, and the mismatch is live right now'],
      ['4', 'Replace the two Lorem Ipsum leadership bios and rename the "/new-page-3" URL', 'The team page is where a diligence-minded CFO looks first; placeholder text undercuts the firm’s consulting positioning'],
      ['5', 'Text the last ten happy clients a direct review link', 'At 98.3% retention, the goodwill exists — it has simply never been systematically asked; even ten reviews moves a 6-review profile dramatically'],
      ['6', 'Set Google Alerts: "Bichlmeier Insurance," "FAIR Plan depopulation," "California small group renewal"', 'Free competitive and market-trigger intelligence — a manual preview of the Section 09 trigger engine'],
      ['7', 'Post one renewal-season piece from Keith on LinkedIn ("What a 10.7% average increase actually means for South Bay employers")', 'The benefits audience lives on LinkedIn; one authentic founder post starts the authority flywheel at zero cost'],
    ],
    { headerColor: TEAL }
  ),
  spacer(140),
  calloutBox(
    'The Eighth Quick Win — A Free Nexus Assess',
    [
      'Technijian’s standing offer to any prospective client: one complimentary Nexus Assess run — an internal vulnerability scan, an external scan including a dark-web credential check, and a Microsoft 365 configuration review, delivered as a prioritized remediation roadmap. For a firm holding client census and health data, it doubles as a head start on the security story B2’s own clients increasingly ask about. No cost, no commitment — and it shows how Technijian works before a dollar changes hands.',
    ],
    CORE_BLUE
  ),
);

// ---------- 14 FAQ ----------
docChildren.push(
  ...sectionHeader('The Questions You Are Probably Already Asking', DARK_CHARCOAL, '14'),
  spacer(100),
  subHeader('"We already have a marketing person / a website firm."', { color: DARK_CHARCOAL }),
  p('Keep them. This engagement is not website design or social posting — it is entity-grade search and answer-engine engineering, account intelligence, and brokerage workflow automation. Where an existing partner owns a channel, we coordinate; the verified gaps in Section 06 (an unresolvable brand entity, an unclaimed Yelp profile, a 2019 blog) are precisely the work that generalist marketing relationships have not covered.'),
  subHeader('"Is AI in insurance real, or hype?"', { color: DARK_CHARCOAL }),
  p('Both exist. The hype is autonomous agents replacing brokers — we do not build that, and Section 08 explains why. The real part is mundane and measurable: documents extracted, comparisons drafted, profiles resolved, reviews requested, triggers monitored. Industry adoption data says the firms integrating AI into workflow gain efficiency and advisory capacity; nothing in this blueprint requires believing anything more exotic than that.'),
  subHeader('"Is our client data safe?"', { color: DARK_CHARCOAL }),
  p('This is the right question for a benefits broker, and the answer is architectural: census, health, claims, and salary data never enter public AI tools — private, governed deployments only, an inventory of every tool and data source, and human sign-off on client-facing output. Technijian’s security practice is CISSP-led; the same discipline that protects B2’s data becomes part of B2’s pitch to its own compliance-minded clients.'),
  subHeader('"We do not have bandwidth for another initiative."', { color: DARK_CHARCOAL }),
  p('Phase 1 is built to demand almost none: entity repair, reviews, content, and capture run on Technijian’s side after a short onboarding. The first internal-time commitment of any size is the 90-day gate review — by design, the moment B2 decides with data whether to go further.'),
  subHeader('"What if the team does not adopt it?"', { color: DARK_CHARCOAL }),
  p('Phase 1 requires no behavior change from producers — it makes the phone ring and the meetings better-informed. Internal tools arrive in Phase 2 only after the entry proves value, and they arrive as relief (renewal decks drafted, answers grounded) rather than surveillance. Adoption follows usefulness; that is why the sequence is what it is.'),
  subHeader('"What does this really cost — and what about the AI bills?"', { color: DARK_CHARCOAL }),
  p('The entry is $39,088 in Year 1 at published rates, month-to-month. Model costs stay small because of the multi-model routing discipline in Section 07: cheap models do the volume, mid-tier models do the drafting, and frontier models touch only the slice that needs judgment — typically 60-80% below single-premium-model cost. Custom Phase-2 work is quoted at the published labor rates in Section 11 before it starts. No surprise line items.'),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', CORE_ORANGE, '15'),
  spacer(100),
  p('This blueprint was built cold, from public evidence, because the evidence was strong enough to justify the work. One conversation makes it real: a 30-minute discovery call walks the verified findings, answers the calibration questions in Section 11, and decides — with B2’s real numbers — whether the 90-Day Be-Findable Pilot is worth running.'),
  spacer(120),
  calloutBox(
    'The Next Step',
    [
      '1.  A 30-minute discovery conversation — the findings, the questions, the fit. No commitment.',
      '2.  If it fits: the 90-Day Be-Findable Pilot starts at $39,088/year equivalent, month-to-month, published rates, with the honest gate review built in.',
      '3.  If it does not fit: B2 keeps this blueprint, the seven free quick wins, and the complimentary Nexus Assess offer — all of which stand on their own.',
    ],
    CORE_ORANGE
  ),
  spacer(120),
  p('Either way, the seven quick wins in Section 13 are worth doing this week — they are free, they are fast, and they start closing the gap between how good this firm is and how findable it is.'),
);

// ---------- 16 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', CORE_BLUE, '16'),
  spacer(100),
  p('Technijian is an Irvine, California managed IT, cybersecurity, and AI-services firm. For more than two decades it has run the technology behind Southern California businesses — including regulated industries where compliance is non-negotiable — and now builds the AI layer for firms that want growth and efficiency without trading away trust: technology as a solution.'),
  spacer(120),
  buildTable(
    [
      { label: 'Practice', weight: 2.4 },
      { label: 'What It Delivers', weight: 7.6 },
    ],
    [
      ['My AI', 'AI strategy, governance, fractional AI leadership, account intelligence, governed assistants, knowledge systems — the thinking and the build'],
      ['My SEO', 'Search and answer-engine optimization: entity work, local SEO, reputation engines, AI-cited authority content — published tiers from $500/month'],
      ['My AI Lead Gen', 'Capture, nurture, and remarketing engines — published tiers from $1,499/month'],
      ['My Dev', 'Custom application delivery on the AI-Native SDLC — portals, document intelligence, workflow tools, 3-5x faster than traditional builds'],
      ['Managed IT & Security', 'CISSP-led managed infrastructure, security operations, and compliance support — the foundation under everything above'],
    ],
  ),
  spacer(160),
  buildTable(
    [
      { label: 'Contact', weight: 3.0 },
      { label: ' ', weight: 7.0 },
    ],
    [
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
      ['Headquarters', '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      ['Delivery Center', 'Panchkula IT Park, Panchkula, Haryana, India'],
    ],
    { headerColor: DARK_CHARCOAL, zebra: false }
  ),
);

// ---------- APPENDIX ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources & Verification', DARK_CHARCOAL, 'A'),
  spacer(100),
  p('Primary research was conducted June 11, 2026. Digital-presence claims in Section 06 were verified by direct live visits with dated screenshots retained on file. B2’s internal financials were not used and not estimated.'),
  spacer(100),
  subHeader('B2 Insurance Services — primary sources', { color: DARK_CHARCOAL }),
  bullet('b2insurance.com — home, What We Do, Services, News, Partners, Leadership, Contact pages (fetched live, June 2026)'),
  bullet('LinkedIn: linkedin.com/company/b2insurance — follower count (~130, approximate), 16 employees, founded 2013, partnership type (screenshot, June 11, 2026)'),
  bullet('Yelp: B2 Insurance Services, Redondo Beach — 5.0 stars, 6 reviews, unclaimed status (screenshot, June 11, 2026)'),
  bullet('Google Maps: two direct searches (name + city; exact name + street address), both resolving to Bichlmeier Insurance Services (screenshots, June 11, 2026)'),
  bullet('Bing web search: quoted brand name + city + "reviews," page 1 (screenshot, June 11, 2026)'),
  bullet('Alignable business profiles (founding story); Nationwide and Hagerty agency locators (carrier appointments); Facebook page (94% recommend, 7 reviews — approximate)'),
  subHeader('Market & industry sources', { color: DARK_CHARCOAL }),
  bullet('California 2026 small-group health filings: published carrier-filing analyses (Skyline Benefit; Bertram Insurance; JC Lewis) — ~10.7% average, carrier range ~7% to 20%+'),
  bullet('Covered California 2026 preliminary weighted average +10.3% — California Health Care Foundation'),
  bullet('California FAIR Plan: key statistics (cfpnet.com) — 550K+ policies, ~$600B exposure; 35.8% rate filing effective April 2026 (September 2025 filing, as reported); CA Department of Insurance press releases on market reforms and depopulation (Mercury, CSAA commitments)'),
  bullet('Employer-advisory preference (~69%): 2025 Zywave Broker Survey, as reported in industry press'),
  bullet('Broker AI operations benchmarks (ACORD/loss-run OCR day-to-minutes; 20-30% admin time; producer ramp claims): industry and AI-tools press, 2025-26 — treated as directional, not guaranteed'),
  bullet('Competitor data: Bichlmeier (bisins.com, Yelp — 76 reviews, est. 1961); Nava Benefits (navabenefits.com — company-published claims); Newfront (newfront.com — WTW combination); HUB, MMA, USI, Alliant, Gallagher, Bolton & Co. public pages'),
  subHeader('Frameworks cited', { color: DARK_CHARCOAL }),
  bullet('NIST AI Risk Management Framework (Govern / Map / Measure / Manage)'),
  bullet('Anthropic, "Building Effective Agents" (workflow vs. agent distinction)'),
  bullet('MIT Sloan executive AI-literacy guidance'),
  bullet('A widely-used five-stage AI maturity model, consistent with Gartner and Google Cloud adoption frameworks'),
  bullet('McKinsey State of AI (2025) — AI adoption vs. profit-impact gap; stage-gate measurement discipline'),
  spacer(140),
  p('Prepared by Technijian · ' + TODAY + ' · Confidential — for B2 Insurance Services', { italics: true, size: 18, align: AlignmentType.CENTER }),
);

// =====================================================================
// DOCUMENT
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

const OUT_PATH = path.join(__dirname, 'B2I-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
