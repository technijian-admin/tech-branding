// The Aventine at Aliso Viejo (AAVA) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/TALY/build-taly-report.js (VAF/SCF/ORX/MWAR/RKE lineage).

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

const TODAY = '2026-05-27';
const CLIENT = 'The Aventine at Aliso Viejo';

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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to The Aventine: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'THE AVENTINE AT ALISO VIEJO', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Luxury Apartment Homes  ·  Pacific Coast Management Portfolio', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Aliso Viejo, California  |  aventine-apartments.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for The Aventine at Aliso Viejo / Pacific Coast Management', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '386', label: 'Apartment Homes', color: CORE_BLUE },
    { number: '1997', label: 'Built · Resort Amenities', color: CORE_ORANGE },
    { number: '~9', label: 'Communities in the Portfolio', color: TEAL },
    { number: '~3.0★', label: 'Reviews vs. 4.1–4.9 Rivals', color: CRITICAL },
  ]),
  spacer(300),
  p('The Aventine at Aliso Viejo is a 386-home luxury community with the product that wins renters — a resort-style pool, a heated spa, a 24-hour fitness center, and bright, well-kept homes from $2,520 a month. It is the flagship of a portfolio of roughly nine Southern California communities under one owner-operator, Pacific Coast Management. The apartments are not the problem. How prospects find the community, how fast they get answered, how easily they apply, and whether residents stay — that is where the growth is, and that is where the property is currently leaving money on the table.'),
  p('The gap is concrete. The Aventine is heavily listed on Apartments.com and Zillow, so leads arrive — but the moment a prospect lands on the community’s own funnel, the experience is dated: there is no online application (only a downloadable PDF), no real-time tour booking, no online rent payment, and no way to get an answer after the leasing office closes. Meanwhile the communities it competes with for the same renter — Vista Bella and Aliso Town Center (Irvine Company), ARTÀ and Ravello (Greystar), Vantis (Shea), and Avalon Baker Ranch (AvalonBay) — all run modern, AI-assisted leasing: self-guided tours, instant chat, and online applications. They also out-rate the Aventine online, 4.1 to 4.9 stars against its 3.0.'),
  p('This blueprint is a focused, demand-generation program built for how an apartment community actually grows: get found and convert (own the local search and lift the reputation that decides which community a renter even tours), lease faster (answer every prospect in seconds, 24/7, and let them tour, apply, and pay online), and keep and grow (retain residents, because the cheapest lease is the one you never lose). Every piece is designed to be Fair-Housing-safe, privacy-safe, and disclosed as a bot — and the program deliberately stays out of rent-setting, which is now both an antitrust and a rent-regulation minefield. Prove it at the Aventine, then run the same template across all nine communities.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'The Aventine has a luxury product and steady ILS lead flow, but a manual leasing funnel: a PDF application, contact-form “tours,” no online payments, and no after-hours response. Every one of those is a place a ready-to-lease prospect drops out.',
      'The communities it competes with for the same renter already run 24/7 AI leasing assistants, self-guided tours, and online applications — and rate 4.1 to 4.9 stars to the Aventine’s 3.0. The product is competitive; the digital leasing experience and the reputation are not.',
      'A 386-home community with a luxury offering, run by a nine-property operator, is the ideal place to give an independent the leasing technology only the national REITs have — at one community first, then across the portfolio.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information. The community’s internal numbers — current occupancy, average days-to-lease, turnover, and renewal rate — were not available for this draft. Every projection below is labeled estimated and conservative, and calibrates to real numbers after a short discovery call. The specific questions are in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW A COMMUNITY LIKE THE AVENTINE GROWS ----------
docChildren.push(
  ...sectionHeader('How a Community Like The Aventine Grows', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for an apartment community starts with how it actually earns. Revenue is the rent roll, and the rent roll is the product of two things: filling empty homes quickly with qualified residents, and keeping the residents already there. Both run through one funnel — a prospect inquires, tours, applies, leases, and eventually renews — and the community wins or loses at each step on speed and experience. The diagram below shows the funnel, the demand that feeds it, and the points where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The Leasing & Retention Engine', 600, 1.667),
  diagramCaption('Figure 2.0 — The leasing and retention engine: where leads come from, where they convert, and where AI plugs in'),
  spacer(120),
  subHeader('Demand Arrives — Mostly Online, Mostly Intermediated'),
  p('A modern renter starts on the internet listing sites — Apartments.com, Zillow, and a dozen syndicated feeds — or on a Google or AI-assistant search for “luxury apartments in Aliso Viejo.” A smaller share comes from reputation and referrals or from driving past the community. The Aventine already has broad listing coverage, so the top of the funnel is healthy. The leakage happens after the click, on the community’s own funnel, where the experience has not kept pace with the listings.'),
  subHeader('The Lease Is Won on Speed and Experience'),
  p('Once a prospect raises a hand, multifamily leasing is a race. Industry tracking by the National Multifamily Housing Council shows that instant response is now a renter expectation, and the community that answers first and makes touring and applying effortless usually wins the lease. The Aventine’s funnel asks a ready renter to wait for office hours, fill out a PDF, and schedule a tour through a contact form — friction at exactly the moment a competitor’s assistant is booking a self-guided tour for tonight.'),
  subHeader('The Cheapest Lease Is the One You Keep'),
  p('Acquiring a new resident costs a vacancy, a make-ready, and a leasing effort; renewing one costs a good experience and a fair, timely conversation. The reviews show the Aventine’s residents value the homes and the grounds but are frustrated by inconsistent leasing-office communication, uneven maintenance follow-through, and move-out deposit disputes — the exact failures that drive avoidable turnover. Retention is the quiet half of the engine, and it is where consistent, automated communication pays back fastest.'),
  spacer(120),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Get found and convert: be the community a renter finds first and trusts on sight — strong local search, answer-engine visibility, and a reputation that matches the product.',
      'Lease faster: answer every prospect in seconds, around the clock, and let them tour, apply, screen, and pay online — the speed-to-lead lever that decides most leases.',
      'Keep and grow: serve residents consistently and renew them proactively, then run the same playbook across all nine communities. AI lifts the whole engine, not one step of it.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE COMPLIANCE BOUNDARY ----------
docChildren.push(
  ...sectionHeader('The Compliance Boundary — Fair Housing, Privacy & the Rent-Algorithm Landmine', TEAL, '03'),
  spacer(100),
  p('Apartment leasing is one of the most regulated consumer interactions there is, and AI raises the stakes in three specific places. This section names them plainly, because the value of a Technijian-built program is not just that the AI is fast — it is that the AI is fast and safe. The boundary is simple to state: AI fills vacancies and serves residents; it never decides who is approved, and it never sets rent.'),
  spacer(140),
  subHeader('Fair Housing — The First and Highest Bar'),
  p('The federal Fair Housing Act and California’s Fair Employment and Housing Act and Unruh Civil Rights Act prohibit discrimination in housing, and California’s protected classes are broader than the federal list. In May 2024, the U.S. Department of Housing and Urban Development issued guidance applying the Fair Housing Act directly to AI in two areas that matter here: tenant screening and targeted advertising. The rules of the road are clear. An AI leasing assistant must give every prospect the same answers on availability, pricing, and qualifying criteria — a bot that quotes different terms to different people, or answers questions about schools and neighborhoods in a way that steers, creates liability. Advertising must not let an ad platform’s algorithm exclude protected groups from seeing a listing. And screening must never be an autonomous accept-or-deny: AI can organize the documents, but a person applies consistent, transparent criteria and the housing provider remains responsible for the decision.'),
  spacer(120),
  subHeader('The Rent-Algorithm Landmine — What This Program Will Not Touch'),
  p('There is one category of multifamily AI that this program explicitly avoids: algorithmic rent-setting and revenue management. In August 2024 the U.S. Department of Justice, joined by California and other states, sued RealPage over software that allegedly let landlords share private data and align rents; a proposed settlement followed in late 2025. Cities including San Francisco, San Diego, Minneapolis, and Berkeley have banned algorithmic rent-pricing software outright, and California went statewide — Assembly Bill 325, effective January 1, 2026, amended the Cartwright Act to make using a “common pricing algorithm” in restraint of trade unlawful. Combined with the AB 1482 rent cap that already governs a 1997-built community like the Aventine, pricing is the one area where AI creates legal risk rather than value. Technijian does not provide, build, or integrate rent-setting algorithms. Pricing stays entirely with the operator.'),
  spacer(120),
  subHeader('Privacy and Bot Disclosure — Built In, Not Bolted On'),
  p('A leasing assistant handles applicant data — names, incomes, sometimes Social Security numbers — so it must sit behind a privacy notice and a data-processing agreement consistent with the California Consumer Privacy Act, with sensitive data minimized and never sold or shared for advertising. A Technijian-built solution keeps that data owned and controlled by the operator, not locked inside a third-party platform. And under California’s bot-disclosure law, the assistant opens by telling the prospect it is automated and hands off to a human leasing agent on request. None of this slows the experience; it is simply how it is built.'),
  spacer(120),
  calloutBox(
    'The Boundary — AI Serves, A Person Decides',
    [
      'AI responds, schedules, drafts, and remembers — uniformly, and disclosed as a bot. It gives every prospect the same fast, complete answer, which is both better service and the Fair-Housing-safe way to operate.',
      'AI never makes the accept-or-deny decision and never sets rent. A person owns screening on consistent criteria, and pricing stays with the operator — outside the antitrust and rent-regulation risk entirely.',
      'That boundary is the point: the Aventine gets institutional-grade leasing speed without putting its name on a decision it did not make or a price an algorithm set.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 04 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '04'),
  spacer(100),
  p('Because the Aventine sells to a broad, search-driven market of renters — not a finite list of named accounts — this is a demand-generation program: the job is to capture more of the demand that already exists, convert it faster, and keep more of it. The growth comes from three pools, and the same engine serves all three. The point of AI is to be found first, to respond instantly, and to free the leasing team for the human moments that close a tour and renew a resident.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.4 },
      { label: 'Who / What', weight: 3.2 },
      { label: 'How The Aventine Captures It', weight: 4 },
    ],
    [
      ['New-lease demand', 'Renters searching ILS sites, Google, and AI assistants for a South-OC luxury apartment', 'Be found first (local SEO, answer-engine visibility), then answer and book the tour in seconds, 24/7 — speed-to-lead wins the lease'],
      ['The renewal pool', 'Current residents approaching lease-end — the cheapest, highest-value “lease” to win', 'Consistent service, proactive renewal outreach, and the maintenance and deposit fairness that turn a frustrated resident into a renewing one'],
      ['Reputation & referrals', 'Prospects who judge the community by its 3.0-star rating before they ever call', 'AI-assisted review generation and response to lift the rating, which lifts both ILS ranking and the trust that earns the tour'],
      ['The portfolio', 'The eight other Pacific Coast Management communities running the same manual funnel', 'Prove the engine at the Aventine, then replicate the stack — one build, nine communities'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Demand-Generation by Design — Capture, Convert, Keep',
    [
      'Unlike a referral-driven professional firm, an apartment community lives on open-market demand. The renter is out there searching right now; the question is whether the Aventine is found, answers fast, and makes leasing effortless — or whether a competitor does.',
      'The highest-return pool is the one most operators under-serve: the residents already in place. A few points of renewal lift removes the most expensive vacancies of all.',
      'Every motion here is measurable — search visibility, response time, lead-to-tour rate, application completion, review rating, and renewal rate — so the program is tuned to what actually moves the rent roll.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE AVENTINE RENTER ----------
docChildren.push(
  ...sectionHeader('The Aventine Renter', CORE_ORANGE, '05'),
  spacer(100),
  p('Four renter types account for nearly all of the community’s leasing and renewal activity. They differ in how they search, how fast they move, and what keeps them — but they share one trait that defines the strategy: each is reached and kept through speed, experience, and reputation rather than relationships. The cards below profile each renter, and the matrix places them by acquisition volume and lifetime value to the community.'),
  spacer(160),

  personaCard('1 — The Relocating Professional', CORE_BLUE, [
    ['Profile', 'Moving to the South-OC / Irvine-Spectrum job corridor on a compressed timeline, often from out of area and unable to walk in.'],
    ['Pain Points', 'Needs a fast answer, a way to tour remotely, and an easy application — and gets a PDF and a contact form instead.'],
    ['Decision Driver', 'Speed and convenience — the community that responds instantly and lets them tour and apply online wins.'],
    ['AI Opportunity', '24/7 leasing assistant, virtual and self-guided tours, and online application — the speed-to-lead path.'],
    ['Technijian Hook', 'My Dev — the AI leasing assistant and online application. My AI Lead Gen — instant follow-up.'],
  ]),
  spacer(160),

  personaCard('2 — The Move-Up / Right-Sizing Renter', TEAL, [
    ['Profile', 'A local renter upgrading into a luxury community, comparison-shopping several properties at once.'],
    ['Pain Points', 'Reads reviews heavily and is put off by a 3.0-star rating; wants reassurance the experience matches the photos.'],
    ['Decision Driver', 'Reputation and responsiveness — reviews, quick replies, and a polished, credible online presence.'],
    ['AI Opportunity', 'Reputation management to lift the rating, plus local SEO and answer-engine visibility that earn the shortlist.'],
    ['Technijian Hook', 'My SEO — local search, reputation, and answer-engine visibility.'],
  ]),
  spacer(160),

  personaCard('3 — The Renewal-Risk Resident', CORE_ORANGE, [
    ['Profile', 'A current resident approaching lease-end — the cheapest lease to win and the highest lifetime value to protect.'],
    ['Pain Points', 'Sensitive to rent increases and, more so, to inconsistent communication, slow maintenance, and deposit disputes.'],
    ['Decision Driver', 'A fair, timely renewal conversation and a consistently good service experience through the year.'],
    ['AI Opportunity', 'Proactive renewal outreach, automated maintenance status updates, and resident-sentiment monitoring.'],
    ['Technijian Hook', 'My AI — renewal and retention automation. My Dev — the resident-experience assistant.'],
  ]),
  spacer(160),

  personaCard('4 — The Lifestyle / Amenity Renter', GOLD, [
    ['Profile', 'A young professional or couple drawn by the resort pool, the fitness center, and the community feel.'],
    ['Pain Points', 'Wants the amenities and the experience to look as good online as they are in person, and easy answers to quick questions.'],
    ['Decision Driver', 'The amenity story and the community vibe, discovered through photos, video, and reviews.'],
    ['AI Opportunity', 'A modern site with strong visual content and 3D tours, plus an assistant that answers amenity and pet questions instantly.'],
    ['Technijian Hook', 'My Dev — modern site and tours. My SEO — visual content and reputation.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each renter by acquisition volume and lifetime value to the community — showing why the resident you already have (the renewal pool) is the highest-value lease of all, and why the relocating professional is the high-velocity target where speed-to-lead wins.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The Aventine Renter Matrix', 560, 1.50),
  diagramCaption('Figure 5.0 — The Aventine Renter: Acquisition Volume vs. Resident Lifetime Value'),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  spacer(100),
  p('The Aventine competes for the same South-OC renter against two kinds of operator: the national, institutional companies — Irvine Company, Greystar, AvalonBay, Shea — that run polished, AI-assisted leasing across large portfolios, and a few well-run independents. The pattern across all of them is the opportunity: the communities that out-compete the Aventine online do it with leasing technology and reputation, not a better product. The Aventine’s homes hold up; its digital leasing experience does not.'),
  spacer(140),
  buildTable(
    [
      { label: 'Community', weight: 2.4 },
      { label: 'Operator', weight: 2.2 },
      { label: 'Rating', weight: 1.1, align: AlignmentType.CENTER },
      { label: 'Digital Leasing Posture', weight: 4 },
    ],
    [
      ['Vista Bella', 'Irvine Company', { text: '4.1', align: AlignmentType.CENTER }, 'The benchmark — self-guided tours, virtual tours, live chat, full online application'],
      ['Aliso Town Center', 'Irvine Company', { text: 'strong', align: AlignmentType.CENTER }, 'The same Irvine Company digital stack — self-service touring and leasing'],
      ['ARTÀ', 'Greystar', { text: '4.4', align: AlignmentType.CENTER }, 'National digital and listing platform; online tours and applications'],
      ['Ravello', 'Greystar', { text: '3.5', align: AlignmentType.CENTER }, 'Platform-grade leasing, but rent-hike complaints — a service gap a higher-touch independent can exploit'],
      ['Vantis', 'Shea Apartment Communities', { text: '4.7', align: AlignmentType.CENTER }, 'RentCafe resident portal and online leasing; top-rated in the submarket'],
      ['Hanover Laguna Niguel', 'The Hanover Company', { text: '4.9', align: AlignmentType.CENTER }, 'Modern, fully digital luxury experience'],
      ['Avalon Baker Ranch', 'AvalonBay (NYSE: AVB)', { text: '4.5', align: AlignmentType.CENTER }, 'Self-guided tours and online leasing on REIT-grade technology'],
      ['Serrano Highlands', 'FPI Management', { text: '—', align: AlignmentType.CENTER }, 'Third-party-managed; RentCafe portal — a partial, mid-maturity digital experience'],
    ],
  ),
  spacer(200),
  subHeader('Scale & Digital-Maturity Scorecard'),
  p('Reduced to the two things that decide whether a searching renter finds, trusts, and leases — how much operator scale and resources stand behind the community, and how mature its AI and digital leasing is — the picture is clear, and it shows the Aventine holding a competitive product while ceding the digital ground entirely.'),
  buildTable(
    [
      { label: 'Player', weight: 2.8 },
      { label: 'Operator Scale', weight: 2.2, align: AlignmentType.CENTER },
      { label: 'AI / Digital Leasing', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.6 },
    ],
    [
      ['Irvine Company (Vista Bella, Aliso Town Center)', { text: 'High', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'The benchmark — fully digital leasing'],
      ['Greystar / AvalonBay / Shea', { text: 'High', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'REIT-grade digital leasing at scale'],
      ['The Hanover Company', { text: 'Medium', align: AlignmentType.CENTER }, { text: 'High', color: PASS, align: AlignmentType.CENTER }, 'Independent, but modern and digital'],
      ['FPI (Serrano Highlands)', { text: 'Medium', align: AlignmentType.CENTER }, { text: 'Medium', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Fee-managed, partially digital'],
      [{ text: 'The Aventine (today)', bold: true }, { text: 'Independent', align: AlignmentType.CENTER, bold: true }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER, bold: true }, { text: 'Luxury product, manual leasing', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 6.0 plots the field on those two axes. The Aventine sits in the bottom-left — independent scale, near-zero leasing automation. The move is straight up: keep the boutique, higher-touch feel and add the institutional-grade AI leasing the giants run, landing in a corner no independent currently holds.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. AI & Digital-Leasing Maturity', 560, 1.50),
  diagramCaption('Figure 6.0 — Competitive Positioning: Operator Scale vs. AI & Digital-Leasing Maturity'),
  spacer(160),
  calloutBox(
    'Where The Aventine Wins — The White Space',
    [
      'The top-left corner — an independent, boutique-scale community running institutional-grade AI leasing — is empty. The national operators have the technology but not the higher-touch feel; the independents have neither.',
      'There is an honest opening even against the giants: institutional does not mean beloved. Greystar’s Ravello sits at 3.5 stars with rent-hike complaints. A higher-touch independent that adds responsiveness — not rent optimization — out-serves them on the one axis renters feel most.',
      'The Aventine already has the product. Adding the leasing speed and the reputation puts it in a position none of its direct rivals occupy — and the same move works at all nine communities.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For a luxury community charging $2,500 to $3,900 a month, the digital experience materially under-represents the product — and it matters precisely when a renter’s first move is an online search and a review check before they ever call. The listings bring people in; the owned funnel and the reputation decide whether they tour, apply, and stay.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Online application', 'A downloadable PDF “Application-to-Rent” — no online apply, screen, or sign', 'A ready-to-lease prospect is asked to print, fill, and return paper; many simply move on to a competitor that takes the application online'],
      ['Tour scheduling', 'A contact form, not a real-time calendar; no self-guided touring', 'Competitors let a prospect book or self-tour instantly; the form adds a wait at the highest-intent moment'],
      ['After-hours response', 'None — inquiries outside office hours wait until the office reopens', 'A large share of renter inquiries arrive evenings and weekends; with no 24/7 assistant, those leads cool or go elsewhere'],
      ['Online rent payment / resident portal', 'None visible on the site', 'A basic resident expectation in 2026; its absence signals “dated” and adds friction to renewals'],
      ['Reputation', 'Approximately 3.0 stars while direct rivals run 4.1 to 4.9', 'The rating is checked before the call; it suppresses both ILS ranking and tour conversion for a genuinely nice community'],
      ['Site & content', 'A WordPress marketing site with a 360° tour but dated conversion design', 'The product looks better in person than online; modern content and clear calls to action would convert more of the existing traffic'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the community — only making a genuinely good luxury property look and lease as modern as it already feels in person.',
      'A modern site, online application and payments, reputation management, and a 24/7 assistant are compounding moves: each lifts conversion of the traffic the listings already deliver.',
      'They are also the natural first ninety days — fix the funnel and the reputation, then layer the speed-to-lead engine and retention on top, and replicate across the portfolio.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE SILENT VACANCY ----------
docChildren.push(
  ...sectionHeader('The Silent Vacancy — Where Revenue Leaks', DARK_CHARCOAL, '08'),
  spacer(100),
  p('This section names the cost that does not appear on any report, because it is the one most expensive to ignore. A 386-home community at roughly $3,000 a month carries a rent roll near $13.9 million a year. At that scale, the revenue lost to a slow leasing funnel and avoidable turnover is not a rounding error — it is a silent vacancy that never shows up as a line item, only as days a home sits empty and residents who quietly leave.'),
  spacer(140),
  subHeader('The Leads That Cool After Hours'),
  p('Roughly half of rental inquiries arrive when a leasing office is closed — evenings, weekends, the moment a prospect finishes a tour somewhere else. A community with no after-hours response simply waits, and a meaningful share of those prospects book with whoever answers first. The Aventine’s competitors answer first, automatically. Every cooled lead is a tour that did not happen and, often, a lease that went to Vista Bella or ARTÀ instead.'),
  spacer(60),
  p('The math is unforgiving in a good way: when each vacant home costs roughly $100 a day in lost rent, shaving even a handful of days off the average time-to-lease across a few hundred annual move-ins adds up quickly. Speed-to-lead is not a soft metric here; it is days of occupancy on a $13.9 million rent roll.'),
  spacer(120),
  subHeader('The Residents Who Quietly Leave'),
  p('The reviews tell a consistent story: residents like the homes and the grounds but are worn down by inconsistent leasing-office communication, maintenance that sometimes takes three or four requests, and move-out deposit disputes. None of those are product problems; all of them are communication and follow-through problems — and all of them drive avoidable turnover. Each unnecessary move-out is the most expensive vacancy of all: a make-ready, lost rent, and a fresh leasing effort to replace a resident who would have stayed for a better experience.'),
  spacer(120),
  subHeader('The Reputation That Decides the Tour'),
  p('A 3.0-star rating, against rivals at 4.1 to 4.9, is a tax on every other marketing dollar. Renters filter by rating before they ever read a description, so a low score suppresses both the community’s ranking on the listing sites and the share of viewers who convert to a tour. Lifting the rating — by earning more reviews from satisfied residents and responding well to the rest — compounds across the entire funnel.'),
  spacer(120),
  calloutBox(
    'Three Leaks, One Fix',
    [
      'Leads cool after hours; residents leave over preventable friction; and a 3.0-star reputation quietly suppresses every tour. None is a product failure — each is a speed, consistency, or communication failure.',
      'These are exactly the failures automation closes: instant 24/7 response, consistent and proactive resident communication, and a steady reputation engine — uniform, logged, and Fair-Housing-safe.',
      'This is the highest-conviction place to start, because it converts traffic and residents the community already has into leases and renewals it is currently losing.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services The Aventine would engage. Each is labeled for what it is, and each maps to a specific Aventine use case. Technijian has not built an apartment leasing assistant before; what it has built is the conversational, document, and search AI that a leasing assistant is made of — and that is the honest claim.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70%.',
    'This is how the Aventine gets found: local-search and answer-engine content that ranks the community for “luxury apartments in Aliso Viejo” and earns the citation in Google AI, ChatGPT, and Perplexity, plus the reputation content that lifts a 3.0-star rating.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex documents for FINRA-registered broker-dealers, cutting response time from days to minutes with 60–80% less manual review.',
    'Pointed at the leasing document load, the same approach processes applications, leases, and move-in and move-out inspections — and produces the itemized, document-backed deposit accounting that ends the move-out disputes residents complain about.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a conversational design that cross-checks each answer instead of trusting a single pass.',
    'That conversational, cross-checked design is exactly what a Fair-Housing-safe leasing assistant needs: it answers prospects consistently and can verify that every response stays inside the qualifying-criteria and anti-steering guardrails before it is sent.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization’s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'Across a nine-community portfolio, this becomes the shared operations playbook — leasing scripts, maintenance procedures, contractor and unit histories — so every property runs to the same standard and a new leasing or maintenance hire is productive in weeks.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services The Aventine Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian’s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations around a client’s actual process.',
    'This builds the working tools: the 24/7, bot-disclosed AI leasing assistant; online application, screening hand-off, and payments; the resident-experience assistant; and the modern site — owned by the operator, not locked in a third-party platform.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO — Local, Reputation & Answer-Engine',
    'My SEO is Technijian’s search service: local search optimization, reputation management, and answer-engine visibility so a business is found and trusted where its buyers actually look.',
    'For the Aventine it owns local search for South-OC luxury apartments, runs the review-generation and response engine that lifts the 3.0-star rating, and earns the AI-answer citations that put the community on the shortlist.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Leasing Demand Capture',
    'My AI Lead Gen is Technijian’s productized demand-capture service — it engages and nurtures inbound interest instantly and routes qualified, prioritized prospects rather than letting leads sit in a queue.',
    'For the Aventine it is the speed-to-lead engine: instant first response to every ILS and website inquiry, automated follow-up and tour booking, and nurture that keeps a prospect warm until they lease.',
    'service'
  ),
);

// ---------- 10 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms The Aventine’s Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get found and convert (own local search and lift the reputation that earns the tour), lease faster (answer instantly and let prospects tour, apply, and pay online), and keep and grow (retain residents and replicate across the portfolio). The first fills the top of the funnel, the second is the speed-to-lead core, and the third protects and scales the rent roll.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The Aventine AI Growth Engine', 600, 1.607),
  diagramCaption('Figure 10.0 — The Engine: Get Found & Convert, Lease Faster, and Keep & Grow'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.7 },
      { label: 'Tool', weight: 2.5 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.6 },
      { label: 'Technijian Service', weight: 1.6 },
    ],
    [
      ['Get Found & Convert', 'Local SEO + map pack', 'Rank for the searches renters make for Aliso Viejo luxury apartments', 'Search visibility', 'My SEO'],
      ['Get Found & Convert', 'Answer-engine (GEO)', 'Be the cited community in Google AI, ChatGPT, and Perplexity', 'AI-answer mentions', 'My SEO'],
      ['Get Found & Convert', 'Reputation management', 'Lift the 3.0-star rating with AI-assisted review requests and replies', 'Review rating', 'My SEO'],
      ['Lease Faster', '24/7 AI leasing assistant', 'Answer every prospect instantly by chat and text — disclosed as a bot', 'Response time', 'My Dev'],
      ['Lease Faster', 'Speed-to-lead nurture + tour booking', 'Instant follow-up and self-service tour scheduling, day or night', 'Lead-to-tour rate', 'My AI Lead Gen'],
      ['Lease Faster', 'Online application + payments', 'Replace the PDF — apply, screen, pay, and sign online', 'Application completion', 'My Dev'],
      ['Lease Faster', 'Document intelligence', 'Auto-process applications, leases, and inspections; itemize deposits', 'Processing time', 'My AI'],
      ['Keep & Grow', 'Resident-experience assistant', 'Maintenance intake, status updates, and FAQs around the clock', 'Resident satisfaction', 'My Dev'],
      ['Keep & Grow', 'Renewal & retention automation', 'Proactive renewal outreach and resident-sentiment monitoring', 'Renewal rate', 'My AI'],
      ['Keep & Grow', 'Portfolio replication', 'Deploy the same stack across all nine communities', 'Communities live', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI responds, schedules, drafts, and remembers — uniformly, and disclosed as a bot. It gives every prospect the same fast, complete answer, which is both better service and the Fair-Housing-safe way to run a leasing funnel.',
      'AI never makes the accept-or-deny decision and never sets rent. A person owns screening on consistent criteria, and pricing stays with the operator — outside the antitrust and rent-regulation risk entirely.',
      'The leasing team is freed, not replaced: the assistant handles the after-hours questions, the follow-ups, and the paperwork, so the team spends its time on tours, relationships, and renewals.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on quick wins — local search, reputation, and instant speed-to-lead capture — and expands into the 24/7 assistant, the online application, and the portfolio only as the results prove out. The model below is built from public information and conservative assumptions, because the community’s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 14 replace them with real baselines.'),
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
      ['Prospect response time', 'Hours; after-hours unanswered', 'Instant, 24/7', 'Speed-to-lead'],
      ['Average days-vacant per turn', 'Estimated current', 'Reduced via faster lease-up', 'Occupancy up'],
      ['Online application', 'PDF only', 'Apply, screen, pay, sign online', 'Less friction'],
      ['Review rating', '~3.0 stars', '4 stars and rising', 'Trust & ranking'],
      ['Renewal / retention rate', 'Estimated current', 'Improved via proactive service', 'Fewer turns'],
      ['Leasing-team hours on FAQs / after-hours', 'Heavy, manual', 'Recovered by the assistant', 'Capacity freed'],
      ['Resident maintenance communication', 'Manual, inconsistent', 'Automated status updates', 'Satisfaction up'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model — The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the two safe levers — filling vacancies faster and retaining more residents — not on new rent, because pricing stays out of scope. The entry program alone (local search, reputation, and instant speed-to-lead capture) drives the gains below; the expansion build pushes the lease-faster lever further still. It assumes roughly 193 unit turns a year (about half of 386 homes) at a blended rent near $3,000 a month (about $100 per vacant day).', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Conservative', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.1, align: AlignmentType.CENTER },
    ],
    [
      ['Avg. days-vacant reduced per turn', { text: '2', align: AlignmentType.CENTER }, { text: '3', align: AlignmentType.CENTER }, { text: '4', align: AlignmentType.CENTER }],
      ['Vacancy loss recovered (~193 turns × ~$100/day)', { text: '+$38,600', align: AlignmentType.CENTER }, { text: '+$57,900', align: AlignmentType.CENTER }, { text: '+$77,200', align: AlignmentType.CENTER }],
      ['Additional renewals retained (avoided turns)', { text: '+4', align: AlignmentType.CENTER }, { text: '+7', align: AlignmentType.CENTER }, { text: '+10', align: AlignmentType.CENTER }],
      ['Turn cost avoided (× ~$3,500/turn)', { text: '+$14,000', align: AlignmentType.CENTER }, { text: '+$24,500', align: AlignmentType.CENTER }, { text: '+$35,000', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 Value (entry)', bold: true }, { text: '+$52,600', bold: true, align: AlignmentType.CENTER }, { text: '+$82,400', bold: true, align: AlignmentType.CENTER }, { text: '+$112,200', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '1.6x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '2.6x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '3.5x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only — the easiest possible place to start. It does not count the larger gains the expansion build unlocks (the 24/7 assistant and online application), the reputation lift that compounds across every listing, the leasing-team hours recovered, or the portfolio. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
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
      ['My AI — AI Readiness + Executive Workshop (one-time)', 'A leadership session and a readiness assessment to map the highest-ROI moves', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — Local & Reputation', 'Own local search and run the review engine that lifts the 3.0-star rating', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Leasing Capture (Starter)', 'Instant response, follow-up, and tour booking on every inquiry', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,250/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — AI Leasing Assistant + Portal (Phase 2 build)', 'The 24/7 assistant, online application and resident portal, and document intelligence', { text: '—', align: AlignmentType.CENTER }, { text: '$27,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, and enhancement of the assistant and portal', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, Fair-Housing and privacy governance, and the roadmap', { text: '$1,500', align: AlignmentType.CENTER }, { text: '$18,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $4,550/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$86,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $32,000 entry program — local search, reputation, and speed-to-lead capture — that pays for itself on quick wins and asks for no large build to begin.',
      'Expand into the full engine (the 24/7 assistant, the online application and portal, document intelligence) only once the entry proves the lift. That one-time build is then a portfolio platform, built once.',
      'Communities two through nine onboard at roughly the recurring run-rate without re-paying the build — so the blended return across the portfolio compounds well above any single community’s. Pilot at one, then replicate across the other eight in a single owner-operator decision.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence that mirrors the land-and-expand plan: start with the low-commitment entry — get found and capture every lead — then add the assistant-and-application build, then retention and the portfolio. Real gains — a modern site, a rising rating, instant lead response — are visible inside the first ninety days, before any large build; the deeper build and the portfolio roll-out are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'The Aventine 90-180-365 Day Roadmap', 600, 2.296),
  diagramCaption('Figure 12.0 — The Aventine Growth Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation & Capture (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — get found and capture every lead, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — Site, SEO & Reputation', 'Modernize the website for conversion; launch local-search optimization and the review-generation and response engine to begin lifting the 3.0-star rating; set up answer-engine visibility.'],
      ['1.2 — Speed-to-Lead Capture', 'Turn on instant response, automated follow-up, and tour booking on every ILS and website inquiry — the entry program’s fast win, with no custom build required.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Build & Lease Faster (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — add the 24/7 assistant and the online application.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — AI Leasing Assistant Live', 'Stand up the 24/7, bot-disclosed AI leasing assistant on chat and text, with Fair-Housing-safe scripted responses on every inquiry.'],
      ['2.2 — Online Application + Portal', 'Replace the PDF with online application, screening hand-off, and payments; add self-service tour booking; put document intelligence to work on applications and inspections.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Keep & Scale (Days 181–365)', { color: CORE_ORANGE }),
  p('Add retention, then replicate the proven engine across the portfolio.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Retention & Resident Experience', 'Launch renewal automation, the maintenance-intake and status assistant, and resident-sentiment monitoring; itemized, document-backed deposits to end move-out disputes.'],
      ['3.2 — Portfolio Roll-Out', 'Replicate the leasing-and-retention stack across the other eight communities, and deliver an ROI dashboard measured against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Five actions The Aventine can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Claim and Complete the Google Business Profile',
    ['Make sure a renter searching “Aventine Aliso Viejo” or “luxury apartments Aliso Viejo” finds a complete, photo-rich, accurate listing with current hours and a working call and directions button. It is the first thing a prospect sees, and it costs nothing.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Respond to Every Review, Good and Bad',
    ['Reply to the recent reviews — thank the happy residents and respond calmly and specifically to the critical ones. Renters read the responses as closely as the reviews; a thoughtful reply to a complaint often matters more than the complaint itself.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Set Up an Instant Auto-Reply on After-Hours Inquiries',
    ['Until the AI assistant is live, set a simple automatic reply on the leasing email and web form that answers within minutes with hours, a tour link, and next steps. A fast “we got your message and here is how to tour” keeps a lead warm overnight.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Add a Real Tour-Scheduling Link',
    ['Replace the “contact us for a tour” form with a simple scheduling link that lets a prospect pick a time instantly. Removing the wait at the highest-intent moment lifts tour bookings immediately, for free.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Audit the Listing Sites for Accuracy and Photos',
    ['Check that Apartments.com, Zillow, and the other listings show current pricing, accurate amenities, the pet policy, and fresh photos and the 360° tour. Stale or conflicting listings cost conversions and erode trust before the call.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with the community’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Occupancy & lease-up', 'Current occupancy, average days-to-lease, and annual turnover', 'Calibrates the vacancy-loss half of the ROI model'],
      ['Retention', 'Current renewal rate and the top reasons residents leave', 'Sizes the retention half of the model'],
      ['Lead flow & response', 'Monthly inquiry volume, after-hours share, and current response time', 'Scopes the speed-to-lead opportunity'],
      ['Leasing stack', 'Current CRM or property-management system and leasing-team headcount', 'Defines the build and integration surface'],
      ['Reputation', 'Current ratings across Google, Yelp, and the listing sites', 'Sizes the reputation-management lift'],
      ['Marketing ownership', 'Who owns the website, listings, and marketing today', 'Defines the workflow and hand-offs'],
      ['Property facts', 'Confirmed pet policy and fees, parking, and current concessions', 'Ensures the assistant answers accurately'],
      ['Portfolio & ownership', 'The principal, corporate entity, total units, and operator revenue', 'Sizes the portfolio roll-out and confirms privacy-law applicability'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on the Aventine’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('The Aventine already has the hard thing: a genuinely good luxury product, in a strong submarket, run by an operator with the scale of nine communities. What it has not yet done is make that product as easy to find, tour, and lease as its competitors have — or serve and keep residents with the consistency that protects the rent roll.'),
  p('The opportunity is concrete: get found and convert as the community renters discover first and trust on sight, lease faster by answering every prospect in seconds and letting them tour and apply online, and keep and grow by retaining residents and replicating the engine across the portfolio. A focused, demand-generation program does all three — and it stays Fair-Housing-safe, privacy-safe, and entirely out of rent-setting, so the speed comes without the risk.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — the modern site, the reputation engine, and speed-to-lead capture — live inside 30 days of signature, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to lease like an Irvine Company community — at boutique scale?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
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
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional operators compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for The Aventine', weight: 5 }],
    [
      ['My Dev', 'Custom, AI-native builds — the 24/7 AI leasing assistant, online application and resident portal, and document intelligence, owned by the operator'],
      ['My SEO', 'Local search, reputation management, and answer-engine visibility that get the community found and trusted'],
      ['My AI Lead Gen', 'The speed-to-lead engine — instant response, follow-up, and tour booking on every inquiry'],
      ['My AI', 'AI strategy and builds — renewal and retention automation, document drafting, and program leadership with Fair-Housing and privacy governance throughout'],
      ['My Security', 'Privacy and access control for applicant and resident data — the CCPA-aligned governance behind every AI-assisted workflow'],
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
  p('Market and community intelligence gathered via public web research conducted May 2026. Community details (unit count, year built, floor plans and pricing, amenities, and operator) are drawn from public sources and the community’s own website and should be confirmed with The Aventine before external use.', { italics: true }),
  spacer(120),
  p('1. The Aventine at Aliso Viejo — aventine-apartments.com (home, floor plans, amenities, contact, residents) and the downloadable Application-to-Rent. 386 units, built 1997, 1BR/2BR (717–1,100 sq ft), rents from approximately $2,520.', { size: 20 }),
  p('2. Operator — Pacific Coast Management (pacificcoastmgmt.com) and the affiliated “sister property” cluster: Le Med and Glen Oaks (Anaheim), San Carlos, Casa De Sol (Orange), Cresthaven (San Bernardino), Sea Cliff (San Clemente), and Casa Cortez and Las Casas (Tustin). Principal, corporate entity, and total unit count to be confirmed in discovery.', { size: 20 }),
  p('3. Reviews & ratings — Yelp, ApartmentRatings.com, ApartmentHomeLiving, and Birdeye listings for The Aventine (approximately 3.0 stars across sources).', { size: 20 }),
  p('4. Competitors — Vista Bella and Aliso Town Center (Irvine Company), ARTÀ and Ravello (Greystar), Vantis (Shea Apartment Communities), Hanover Laguna Niguel (The Hanover Company), Avalon Baker Ranch (AvalonBay), and Serrano Highlands (FPI Management), with ratings from public listing and review sites.', { size: 20 }),
  p('5. AI leasing landscape — EliseAI, LeaseHawk, RealPage (Lumina), Yardi RentCafe Chat IQ, Entrata, Funnel, Knock, BetterBot, PERQ, and Colleen AI, and NMHC commentary on instant response as a renter expectation.', { size: 20 }),
  p('6. Regulation — HUD May 2024 guidance applying the Fair Housing Act to AI tenant screening and advertising; California FEHA and Unruh Civil Rights Act; United States v. RealPage (DOJ, filed August 2024) and 2025 proposed settlement; municipal bans on algorithmic rent-pricing (San Francisco, San Diego, Minneapolis, Berkeley, and others); California Assembly Bill 325 amending the Cartwright Act (effective January 1, 2026); the California Consumer Privacy Act / CPRA; California bot-disclosure law (SB 1001); and AB 1482 (Tenant Protection Act) and Costa-Hawkins.', { size: 20 }),
  p('7. Technijian service pricing — My AI Lead Gen (Starter $1,499 / Professional $3,499 / Enterprise $6,999), My AI, My SEO, My Dev, and My Security rate cards.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'Aventine-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
