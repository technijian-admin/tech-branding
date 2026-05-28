// DisruptiX Talent Solutions (DTS) — AI-Driven Growth Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/ALG/build-alg-report.js (AAVA/TALY/VAF/SCF/ORX/MWAR/RKE lineage).

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

const TODAY = '2026-05-28';
const CLIENT = 'DisruptiX Talent Solutions';

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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to DisruptiX: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'DISRUPTIX TALENT SOLUTIONS', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Accounting & Finance Talent  ·  Boutique Scale, Transparency-Driven', size: 24, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI-Driven Growth Blueprint', size: 40, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Costa Mesa, California  |  disruptixtalent.com', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for DisruptiX Talent Solutions', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '25+ yrs', label: 'SoCal Accounting & Finance Market Experience', color: CORE_BLUE },
    { number: '48–72 hrs', label: 'Typical Contract Placement Today', color: CORE_ORANGE },
    { number: 'SD + OC', label: 'Markets Served (LA + IE on the Roadmap)', color: TEAL },
    { number: 'KeyMatch', label: 'Proprietary Client Portal — Live', color: GOLD },
  ]),
  spacer(300),
  p('DisruptiX Talent Solutions is a boutique Southern-California staffing firm focused on accounting and finance talent — CFOs, Controllers, Assistant Controllers, Accounting Managers, Senior Financial Analysts, and FP&A leaders — placed on both a direct-hire and contract-consulting basis. The firm was founded by Jennifer McCasland, a CPA (Inactive) and the former Managing Partner of Vaco Orange County, and expanded from its San Diego origins to Costa Mesa in summer 2025. The team runs the engagement through KeyMatch, a proprietary client portal that promises full visibility into the recruitment process — and around a tagline, "Driving excellence through transparency," that is rare in this category.'),
  p('The product is competitive: a 25-year SoCal accounting and finance market relationship base, a CPA founder who speaks the language of both the CFO who needs the Controller and the Controller who is between roles, a 48-to-72-hour typical placement velocity on contract roles, and a proprietary technology layer. The growth gap is somewhere else. Boutique accounting and finance staffing in 2026 is governed by three forces a one-to-ten-person team cannot keep up with by hand: the search bandwidth ceiling that forces silent triage of the harder mandates, the SoCal mid-market trigger queue (new fundings, CFO transitions, IPO filings, PE acquisitions, audit-firm changes) that decides who calls first when a finance seat opens, and the compliance surface around AI in hiring that decides which AI is even safe to deploy in this category. The national giants — Robert Half, Vaco, Kforce, Randstad — have the scale and a partial AI investment but are uniformly behind on transparency-as-tech, and the SoCal boutique field uniformly runs legacy ATS-style tooling.'),
  p('This blueprint is a focused, hybrid program built for how a boutique accounting and finance firm actually wins: get found and cited (own AI-search visibility on the SoCal CFO, Controller, and fractional-finance queries, with a founder-led LinkedIn cadence that signals seriousness), match faster and better (extend the KeyMatch portal with an AI matching layer, an AI job-spec generator, an AI candidate one-pager, and an AI pre-screen and reference summarizer that compound velocity without sacrificing fit), and keep and grow (sales-pipeline memory, consultant-care intelligence between placements, account-renewal triggers, and recruiter productivity). Every piece is designed inside the legal boundary that decides which AI is even safe to deploy in hiring: AI auto-drafts, indexes, summarizes, and remembers — but Technijian does not provide black-box candidate scoring, does not adjudicate protected-class questions, and does not feed any wage-setting algorithm in an antitrust-sensitive way. The recruiter, and ultimately the client, owns the hiring decision in writing.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'DisruptiX already has the rare hard things: a CPA-and-ex-Vaco-MP founder, the KeyMatch portal, the transparency tagline, and a 48-to-72-hour contract-placement velocity that sits ahead of category average. What it does not yet have is the AI buyer-experience and recruiter-productivity layer that turns a boutique into a national-grade research bench.',
      'The compliance surface around AI in hiring — EEOC technical assistance, NYC Local Law 144 bias audits, California SB 7 in motion, the FEHA and Fair Chance Act framework — is the doorway, not the wall. A boutique can deploy AI inside that boundary in 2026; a Robert Half cannot re-platform its global stack inside it in less than two years.',
      'The right entry is small, low-commitment, and pays back fast. The KeyMatch v2 expansion — AI matching, AI job-spec generator, AI pre-screen and reference summarizer — comes second, once the entry proves the lift. Productizing the engine as a SaaS for peer boutiques is the Phase-3 upside, not the Year-1 ask.',
    ],
    CORE_ORANGE
  ),
  p('A note on figures: this blueprint was built from public information. DisruptiX\'s internal numbers — current named-client roster, placement volume by search type, average first-year value of a won account, average contract markup, KeyMatch architecture specifics, candidate pool size — were not available for this draft. Every projection below is labeled estimated and conservative and calibrates to real numbers after a short discovery call. The specific questions are in Section 14.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 HOW A BOUTIQUE STAFFING FIRM WINS ----------
docChildren.push(
  ...sectionHeader('How a Boutique Accounting & Finance Firm Wins', CORE_BLUE, '02'),
  spacer(100),
  p('Any growth plan for a boutique staffing firm starts with how the business actually earns. Revenue is not built on consumer marketing; it is built on a finite, named universe of SoCal employer accounts — PE-portfolio operating partners, public-company finance leadership, VC-backed scale-up CEOs, family-office principals, and high-growth bootstrapped founders — matched against a finite, rotating pool of vetted accounting and finance consultants. Every account moves through the same buying process: an employer discovers DisruptiX, a recruiter qualifies the role, KeyMatch returns two-to-four matched profiles, the employer interviews, an offer is made and accepted, and the placement either extends, converts to full-time, or kicks off a replacement cycle. The diagram below shows the funnel, the demand that feeds it, and the points where AI removes friction.'),
  spacer(160),
  diagramImage(DIAGRAM_MODEL_BUF, 'The Dual-Sided Staffing Marketplace', 600, 1.667),
  diagramCaption('Figure 2.0 — How a boutique accounting and finance firm wins: discover, match, place, retain'),
  spacer(120),
  subHeader('Discovery — How an Employer Finds the Recruiter'),
  p('In 2026 a CFO or CEO who needs a Controller does not start with a Google search for "staffing firm Costa Mesa"; they ask a peer, they post to LinkedIn, or — increasingly — they type the question into ChatGPT, Perplexity, or Google\'s AI overview. They ask things like "best CFO recruiter Orange County" or "fractional Controller search SoCal" or "interim CFO Newport Beach." The recruiter cited by the AI — once — is on the call list; the recruiter that is not is not. This is the first and least-recognized place where a small, modern boutique out-competes a much larger national firm.'),
  subHeader('The Match Is Won on Velocity and Fit Together'),
  p('Once an employer raises a hand, the contest is matching speed at the right quality. A CFO with a Controller seat open does not get a second chance at a top candidate who is already in three other interview loops. A boutique that returns two-to-four genuinely matched profiles inside 48-to-72 hours wins more searches at the same close rate; a boutique that takes two weeks loses the candidate to whoever moved faster. AI matching against an indexed candidate pool, AI job-spec generation from a single intake call, and AI pre-screen and reference summarization compound that velocity advantage without sacrificing the human judgment in the loop.'),
  subHeader('The Cheapest Win Is the Renewal — and the Conversion'),
  p('Winning a new employer account costs months of relationship work, content, and patience; renewing one costs a contract end-date watch, a check-in conversation, and a fair offer when the time comes. The biggest avoidable losses in this business are the contract consultant who quietly takes a Robert Half placement because nobody called between gigs, and the employer who never comes back for the second search because the first one took two interviews more than it should have. Retention is the quiet half of the engine, and it is where consultant-care intelligence and account-renewal monitoring pay back fastest.'),
  spacer(120),
  calloutBox(
    'One Engine, Three Motions',
    [
      'Get found and cited: be the recruiter SoCal CFOs and CEOs find first when they ask Google, Perplexity, or ChatGPT — and the firm whose founder is in the SoCal CFO comp, fractional CFO, and Controller-search conversation on LinkedIn.',
      'Match faster and better: extend KeyMatch with AI matching, AI job-spec generation, AI candidate one-pagers, and AI pre-screen and reference summarization — the boutique punches above weight class without expanding headcount.',
      'Keep and grow: searchable sales-pipeline memory across every prior search and candidate conversation, consultant-care between placements, account-renewal triggers, and recruiter productivity that recovers eight to twelve hours per recruiter per week.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE COMPLIANCE & ETHICS BOUNDARY ----------
docChildren.push(
  ...sectionHeader('The Compliance & Ethics Boundary — EEOC, NYC LL 144, SB 7 & the Wage-Setting Line', TEAL, '03'),
  spacer(100),
  p('AI in hiring is the single most regulated AI application surface in the United States today, and a recruiting firm that deploys AI without explicitly naming the boundary loses any sophisticated client the first time the general counsel asks. This section names the boundary plainly, because the value of a Technijian-built program is not just that the AI is fast — it is that the AI is fast and safe. The boundary is simple to state: AI auto-drafts, indexes, summarizes, and remembers; it never makes the hiring decision, it never adjudicates a protected-class question, and it never sets a rate in an antitrust-sensitive way.'),
  spacer(140),
  subHeader('EEOC AI-in-Hiring Technical Assistance (2023–2024)'),
  p('The Equal Employment Opportunity Commission\'s May 2023 technical assistance document made clear that an employer — and the staffing firm acting as its agent — is liable for disparate impact created by algorithmic hiring tools under Title VII, the Americans with Disabilities Act, and the Age Discrimination in Employment Act. The 2024 update extended the principle to AI used in performance management. The practical implication for a boutique staffing firm is direct: any AI matching or screening tool used in the workflow must be auditable, source-cited, and explainable, with a recruiter review-in-the-loop on every output. Black-box machine-learning scoring of candidates without a documented review process is the textbook liability — and a category of AI this program does not deploy.'),
  spacer(120),
  subHeader('NYC Local Law 144 — Automated Employment Decision Tools'),
  p('In effect since July 2023, NYC Local Law 144 requires an independent bias audit of any automated tool used to substantially assist or replace a hiring or promotion decision affecting NYC candidates, and mandates candidate notice. The law applies to NYC-based candidates and roles but functions as the national template — similar laws have been proposed and in some cases enacted in Illinois, New Jersey, Maryland, and Washington. A boutique that matches multi-state candidates inherits the NYC posture even when it is otherwise SoCal-only, and the right architectural answer is to build the stack the way NYC LL 144 expects: bias-audit-ready, candidate-notice-ready, and human-in-the-loop by design.'),
  spacer(120),
  subHeader('California Fair Chance Act (AB 1008) and the FEHA Framework'),
  p('California already prohibits employer inquiry into criminal history before a conditional offer under the Fair Chance Act, requires individualized assessment, and imposes the broadest worker-protection framework in the country through the Fair Employment & Housing Act. AI matching that inadvertently surfaces proxies for protected characteristics — zip code as a race proxy, employment gap as a parental-leave or disability proxy, name as a national-origin proxy — creates disparate-impact risk even with neutral intent. The honest answer is that the recruiter, not the AI, makes any decision that touches a protected-class question, and the AI\'s role is summarization, indexing, and sourcing — not selection.'),
  spacer(120),
  subHeader('California SB 7 — Automated Decision Systems (Proposed)'),
  p('California Senate Bill 7, introduced in the 2025 session, would require employer notice and a human-review pathway for any AI tool used in hiring or employee management. It is not yet law, but it is moving — and the right blueprint posture is to be built the way SB 7 wants the world to look, so DisruptiX\'s stack does not require a re-architect when the bill passes. CCPA and CPRA already treat candidate resumes as personal information, with the disclosure, deletion-on-request, and limited-purpose obligations that imposes; AI tools that index resumes into a vector store create a new processing surface that has to be inventoried and disclosed.'),
  spacer(120),
  subHeader('The Wage-Setting Line — What This Program Will Not Touch'),
  p('There is one category of staffing-firm AI that this program explicitly avoids: any algorithmic wage-setting that shares non-public data across employer competitors or aligns rates among multiple staffing firms. The recent US Department of Justice action against RealPage in multifamily housing — Sherman Act counts, a co-plaintiff California, a 2025 proposed settlement, and a wave of state and municipal bans — is the doctrine landmark, and a thoughtful operator imports the principle into employment whether the case law has fully caught up or not. Pricing and bill-rate decisions stay with DisruptiX and its clients. AI may inform comp benchmarking with public salary-survey data; it does not feed a multi-firm rate-setting engine and it does not match rates across competitors.'),
  spacer(120),
  calloutBox(
    'The Boundary — AI Serves, A Person Decides',
    [
      'AI auto-drafts the job spec, indexes the candidate library, summarizes the reference call, watches the leadership-change signal, and remembers every prior engagement — uniformly, with sources cited, and inside the review-in-the-loop the regulator expects.',
      'AI never makes the hiring decision, never adjudicates a protected-class question, and never sets a rate in an antitrust-sensitive way. The recruiter — and ultimately the client — owns the decision, explicitly, in writing.',
      'That boundary is the point: DisruptiX gets institutional-grade matching velocity without putting its name on a decision it did not make or a rate an algorithm set. It is also the reason DisruptiX wins this conversation against the giants: a boutique can deploy AI inside the boundary in 2026; a national firm cannot re-platform its global stack inside it in less than two years.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 04 WHERE THE GROWTH LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Growth Lives', TEAL, '04'),
  spacer(100),
  p('Because DisruptiX sells to a finite, named universe of SoCal employer accounts — not a broad consumer market — the employer side of this program is account-based: the job is to be discovered by, respond faster to, and retain a known set of mid-market employers across five growth pools. The candidate side is broader visibility-driven, but still targeted on the SoCal accounting and finance consultant pool. The growth comes from five pools on the employer side, fed by a steady candidate pool on the other.'),
  spacer(120),
  buildTable(
    [
      { label: 'Growth Pool', weight: 2.6 },
      { label: 'The Named Universe', weight: 3.6 },
      { label: 'How DisruptiX Captures It', weight: 3.8 },
    ],
    [
      ['PE-portco Controller / VP Finance searches', 'SoCal PE portfolios — Sun Capital, Marlin, Vista lower-middle-market, Levine Leichtman, Aurora Capital Partners, Gryphon, Brentwood Associates — each holding 8 to 25 SoCal portcos on a 3-to-5-year hold', 'Account intelligence on portfolio companies; trigger monitoring on CFO and Controller transitions; CPA-fluent AI intake; warm intro from the operating partner'],
      ['Public-company SOX, audit, Q3-Q4 close project consulting', 'SoCal-headquartered public companies — Edwards Lifesciences, Skechers, AbbVie / Allergan, Hyundai Capital, Western Digital, Quanta, El Pollo Loco, Outset Medical, Resideo, Pacira, OpenLane — and their internal audit and SOX program offices', 'KeyMatch + AI-matched consultant bench; AI pre-screen summaries; AI engagement-letter automation; same-week response on seasonal spikes'],
      ['VC-backed scale-up CFO / Controller direct hire', 'SoCal venture-backed companies in tech, life sciences, climate, and consumer — Anduril, Aspiration, ServiceTitan, Skyryse, Velo3D, Outset, ClearPoint — and the lead funds (Mucker, Upfront, Crosscut, March Capital, Fika, Wavemaker) for the warm intro', 'Authority-AEO content on first-CFO hiring playbooks; founder LinkedIn cadence; AI-driven candidate matching speed; cultural-fit weighting in the match'],
      ['Family office / multi-strategy MSO Controller searches', 'OC and SD single- and multi-family offices, professional-services rollups (dental, vet, medspa, autobody MSOs), high-net-worth operating companies', 'Relationship-driven; AI memory across prior engagements; discreet outreach; high recurrence'],
      ['Fractional CFO and interim-CFO bench', 'High-growth bootstrapped SaaS, restaurant groups in turnaround, family-business succession plans, pre-IPO finance bench builds', 'KeyMatch consultant pool; AI matching by industry and revenue band; same-day response; flexible engagement structure'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Account-Based on the Employer Side — Discover, Match, Hold',
    [
      'Unlike a consumer-facing recruiter, DisruptiX lives on a named universe of SoCal mid-market employer accounts. The work is depth and speed inside each account, not shotgun marketing — and the AI is sized for that motion, not for a broad funnel.',
      'The highest-return pool is also the one most easily under-served: the employer who placed a single search last year and has a related role coming this year. Account-renewal intelligence — watching contract end-dates, leadership transitions, and audit-cycle staffing peaks — protects revenue the boutique team would otherwise lose to faster responders.',
      'Every motion here is measurable — AI-citation rate on SoCal recruiter queries, time-to-match, recruiter hours recovered, account retention, and consultant retention — so the program is tuned to what actually moves the placement count.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 05 THE DISRUPTIX BUYER (PERSONAS) ----------
docChildren.push(
  ...sectionHeader('The DisruptiX Buyer', CORE_ORANGE, '05'),
  spacer(100),
  p('Six buyer types account for nearly all of the firm\'s placement activity — five on the employer side and one collapsed candidate-side persona representing the consultant pool. They differ in how they discover DisruptiX, how fast they move through engagement, and what keeps them — but they share one trait that defines the strategy: each is reached and kept through matching velocity, AI-search visibility, and pipeline memory rather than broad consumer marketing. The cards below profile each buyer, and Figure 5.0 places them by search velocity and account lifetime value.'),
  spacer(160),

  personaCard('1 — The PE-Portco Operating Partner / CEO', CORE_BLUE, [
    ['Profile', 'Operating partner at a SoCal-active PE firm or a portco CEO running multiple companies in succession; uses staffing partners on a 3-to-5-year hold cycle — repeat buyer, multi-portfolio, high-margin retained search.'],
    ['Pain Points', 'Speed without sacrificing partner-quality candidates; discretion; cultural fit at the portco level; one trusted recruiter who can serve six portcos instead of six separate engagements.'],
    ['Decision Driver', 'A complete, accurate shortlist of two-to-four candidates in days, an audit-ready process the GC does not have to second-guess, and a recruiter who already knows the portfolio.'],
    ['AI Opportunity', 'AI account intelligence on the portfolio; AI matching against vetted consultant pool; AI pre-screen summarization; sales-pipeline memory across all six portcos.'],
    ['Technijian Hook', 'My Dev — KeyMatch v2 matching engine. My AI Lead Gen — operating-partner ABM. My AI — fractional advisor with audit-ready governance.'],
  ]),
  spacer(160),

  personaCard('2 — The Public-Company Finance VP', CORE_ORANGE, [
    ['Profile', 'VP Finance, VP Internal Audit, or SOX program lead at a SoCal-headquartered public company; Q3-Q4 close and audit-season spikes drive most of the engagement.'],
    ['Pain Points', 'Consultant bench depth in peak season; engagement-letter velocity; consistent quality across multiple concurrent placements; integration with the internal audit team.'],
    ['Decision Driver', 'Same-week response when the seasonal spike hits, consultant quality that survives the internal-audit review, and a recruiter who understands SOX and audit-team dynamics.'],
    ['AI Opportunity', 'AI matching against the contract consultant pool; AI engagement-letter automation; AI candidate one-pager; bench-depth visibility ahead of the spike.'],
    ['Technijian Hook', 'My Dev — KeyMatch v2 + AI engagement-letter automation. My AI — bench-availability dashboard.'],
  ]),
  spacer(160),

  personaCard('3 — The VC-Backed Scale-Up CEO / Founder', TEAL, [
    ['Profile', 'CEO or founder of a SoCal venture-backed company hiring a first VP Finance or a first CFO; single search, urgent, high-stakes, often the warm intro comes from the lead VC.'],
    ['Pain Points', 'First-CFO playbook — what does this role even look like; cultural-fit weighting; speed; not paying a giant retainer to a national firm.'],
    ['Decision Driver', 'A CPA-founder advisor who has seen this movie before; cultural-fit weighting in the match; warm intro from the VC who knows DisruptiX.'],
    ['AI Opportunity', 'AI-search authority on first-CFO playbook content; cultural-fit weighting in the match; pre-screen summaries that surface culture cues.'],
    ['Technijian Hook', 'My SEO — first-CFO authority content. My Dev — cultural-fit weighting in KeyMatch v2.'],
  ]),
  spacer(160),

  personaCard('4 — The Family Office / MSO Principal', GOLD, [
    ['Profile', 'Principal at a SoCal single- or multi-family office, or the operating principal of a professional-services MSO (dental, vet, medspa, autobody rollups); high-discretion, relationship-driven, long sales cycle.'],
    ['Pain Points', 'Trust before speed; discretion absolute; cultural alignment with a family or a founder; finding a recruiter who will not blow the relationship by leaking the search.'],
    ['Decision Driver', 'A long-term recruiter relationship; AI memory that remembers every preference from every prior conversation; outreach that does not feel like a mass campaign.'],
    ['AI Opportunity', 'Sales-pipeline memory across the multi-year relationship; AI account-renewal triggers; founder-led outreach drafted by content engine.'],
    ['Technijian Hook', 'My Dev + My AI — sales-pipeline memory + account-renewal intelligence.'],
  ]),
  spacer(160),

  personaCard('5 — The Bootstrapped / Interim-CFO Buyer', DARK_CHARCOAL, [
    ['Profile', 'Founder or CEO of a high-growth bootstrapped SaaS, a restaurant group in turnaround, or a family-business succession plan; needs fractional or interim accounting and finance leadership — modest engagement fee but a gateway to a larger relationship.'],
    ['Pain Points', 'Cash-conscious; cannot pay a national retainer; wants a flexible commitment; needs a trusted advisor who will be honest about whether full-time is even the right call.'],
    ['Decision Driver', 'Transparency on rates and engagement length; flexibility to scale up or down; an honest answer when fractional is the right call vs. when full-time has become unavoidable.'],
    ['AI Opportunity', 'AI matching by industry and revenue band; fractional consultant pool visibility; same-day intake response.'],
    ['Technijian Hook', 'My Dev — fractional-bench matching. My SEO — fractional CFO authority content.'],
  ]),
  spacer(160),

  personaCard('6 — The CPA Consultant (Candidate Side)', BRAND_GREY, [
    ['Profile', 'A CPA between roles, a Big-4 alum looking to move in-house, a returning parent with audit-firm experience, a fractional CFO with three concurrent engagements — the supply side of the marketplace.'],
    ['Pain Points', 'Transparency on rates and project length; recruiter who actually calls between gigs; quality of opportunity matching; not feeling like a number in a national database.'],
    ['Decision Driver', 'The recruiter who picks up the phone, surfaces real opportunities, and does not try to place them somewhere they do not fit.'],
    ['AI Opportunity', 'Consultant-care engine between placements; AI opportunity-matching; preference memory; transparent comp band visibility.'],
    ['Technijian Hook', 'My Dev — consultant portal in KeyMatch v2. My AI — consultant-care engine.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each buyer by search velocity and account lifetime value — showing why the PE-portco operating partner is the highest-LTV target, why the public-company finance VP is the highest-velocity opportunity, and why the consultant pool is the candidate-side cash flow that makes the entire program possible.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'The DisruptiX Buyer Matrix', 560, 1.50),
  diagramCaption('Figure 5.0 — The DisruptiX Buyer: Search Velocity vs. Account Lifetime Value'),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  spacer(100),
  p('DisruptiX competes for the same SoCal accounting and finance searches against a defined set of operators: the national giants — Robert Half (and its Protiviti consulting arm), Vaco, Kforce, Randstad/RGP — and a tier of SoCal regional boutiques — Alliance Resource Group, FORTIS Resource Partners, J.R. Berry Search Group, Beacon Resources, Brilliant Financial Search, Stephen James Associates, Innovative Career Resources, Centric Business Resources, Marquee Staffing. The pattern across all of them is the same opportunity: the operators that out-compete DisruptiX at scale uniformly do it on scale and partial AI investment, not on transparency-as-tech and not on AI-buyer-experience velocity. The CPA founder, the KeyMatch portal, the transparency tagline, and the 48-to-72-hour placement speed are all competitive; what is not yet competitive is the AI-search visibility and the AI matching and screening layer that decide which recruiter the next SoCal CFO calls first.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.6 },
      { label: 'Position', weight: 2.8 },
      { label: 'Scale', weight: 1.0, align: AlignmentType.CENTER },
      { label: 'AI / Transparency-Tech Posture', weight: 3.2 },
    ],
    [
      ['Robert Half / Protiviti', 'NYSE-listed; ~330 offices; ~$7B revenue; the category benchmark', { text: 'Very High', align: AlignmentType.CENTER }, 'Proprietary tech and a Robert Half Direct launch in 2024; legacy ATS DNA; not transparency-led'],
      ['Vaco', 'Olympus Partners–backed; ~50+ offices; Jennifer McCasland\'s prior firm', { text: 'High', align: AlignmentType.CENTER }, 'Moderate AI investment (Olive talent platform); brand recovering from rapid rollup'],
      ['Kforce', 'Public NASDAQ; tech + finance specialist; national footprint', { text: 'High', align: AlignmentType.CENTER }, 'Mid-tier digital; not the transparency or AI-buyer-experience benchmark'],
      ['Randstad / RGP', 'Global parent; RGP focused on project consulting', { text: 'Very High', align: AlignmentType.CENTER }, 'Enterprise-priced; slow to re-platform on transparency or AI matching'],
      ['Alliance Resource Group', 'Irvine-headquartered OC/LA accounting and finance retained search', { text: 'Mid', align: AlignmentType.CENTER }, 'Long-established OC network; CFO-level focus; legacy tooling'],
      ['FORTIS Resource Partners', 'Boutique direct-hire OC/LA/SD', { text: 'Mid', align: AlignmentType.CENTER }, 'Solid OC presence; relationship-driven; legacy posture'],
      ['J.R. Berry Search Group', 'Newport Beach executive search; finance and operations', { text: 'Boutique', align: AlignmentType.CENTER }, 'High-margin retained-search niche; traditional tooling'],
      ['Beacon Resources', 'SoCal accounting and finance staffing', { text: 'Mid', align: AlignmentType.CENTER }, 'Mid-tier digital posture; legacy ATS'],
      ['Brilliant Financial Search', 'National brand with SoCal presence', { text: 'Mid', align: AlignmentType.CENTER }, 'Branded as accounting and finance; mid-AI maturity'],
      [{ text: 'DisruptiX Today', bold: true }, { text: 'Boutique SoCal accounting and finance with transparency tagline + KeyMatch portal + CPA founder', bold: true }, { text: 'Boutique', align: AlignmentType.CENTER, bold: true }, { text: 'KeyMatch live; transparency tagline declared; AI matching layer is the move from here', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(200),
  subHeader('Scale & AI/Transparency-Tech Scorecard'),
  p('Reduced to the two things that decide whether a SoCal CFO finds, trusts, and calls — how much operator scale stands behind the recruiter, and how mature its AI-buyer-experience and transparency-tech posture is — the picture is clear, and it shows DisruptiX holding a credible boutique product while ceding the AI ground entirely. The national giants have the scale; the SoCal boutique field has neither.'),
  buildTable(
    [
      { label: 'Player', weight: 2.8 },
      { label: 'Operator Scale', weight: 2.2, align: AlignmentType.CENTER },
      { label: 'AI / Transparency-Tech', weight: 2.4, align: AlignmentType.CENTER },
      { label: 'Verdict', weight: 2.6 },
    ],
    [
      ['Robert Half / Protiviti', { text: 'Very High', align: AlignmentType.CENTER }, { text: 'Medium', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Scale-dominant; black-box AI; legacy DNA'],
      ['Vaco / Kforce / Randstad', { text: 'High', align: AlignmentType.CENTER }, { text: 'Medium', color: CORE_ORANGE, align: AlignmentType.CENTER }, 'Scale-strong; partial AI; not transparency-led'],
      ['Alliance / FORTIS / J.R. Berry / Beacon', { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER }, 'Solid SoCal boutiques; legacy tooling'],
      ['Brilliant / Stephen James / Innovative', { text: 'Mid', align: AlignmentType.CENTER }, { text: 'Low', color: CRITICAL, align: AlignmentType.CENTER }, 'Regional mid-market; legacy posture'],
      [{ text: 'DisruptiX Today', bold: true }, { text: 'Boutique', align: AlignmentType.CENTER, bold: true }, { text: 'Emerging', color: CORE_ORANGE, align: AlignmentType.CENTER, bold: true }, { text: 'CPA founder + KeyMatch + transparency tagline = ready to land', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  p('Figure 6.0 plots the field on those two axes. DisruptiX sits in the bottom-left — boutique scale, emerging AI and transparency-tech. The move is straight up: keep the right-sized, transparency-led, CPA-founder position and add the institutional-grade AI matching and recruiter-productivity layer the giants are uniformly behind on, landing in a corner no competitor in the SoCal accounting and finance market currently holds.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_COMP_BUF, 'Competitive Positioning — Scale vs. AI & Transparency-Tech Maturity', 560, 1.50),
  diagramCaption('Figure 6.0 — Competitive Positioning: Operator Scale vs. AI & Transparency-Tech Maturity'),
  spacer(160),
  calloutBox(
    'Where DisruptiX Wins — The White Space',
    [
      'The top-left corner — a boutique SoCal recruiter running institutional-grade AI matching and recruiter productivity with transparency-as-tech — is empty. The category\'s giants have the scale but not the transparency-led AI architecture; the SoCal boutique field has neither.',
      'There is an honest opening even against the giants: scale does not mean responsive. A multi-billion-dollar Robert Half cannot re-architect its global stack inside the EEOC / NYC LL 144 / SB 7 boundary in less than two years; a CPA-led boutique can deploy AI inside that boundary in 2026.',
      'DisruptiX already has the product, the CPA-founder credibility, and the KeyMatch portal. Adding the AI matching and recruiter-productivity layer puts it in a position none of its direct rivals occupy — and the same engine carries over as the SaaS product DisruptiX could sell to peer boutiques in Phase 3.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For a transparency-led boutique fronting a CPA founder, the KeyMatch portal, and a 25-year SoCal relationship base, the digital footprint materially under-represents the business — and it matters precisely when a SoCal CFO\'s first move is a search, an AI question, and a quick scan of the recruiter\'s public presence before they ever pick up the phone. The product is real; the buyer-facing surface that signals it is light.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.4 },
      { label: 'Gap / Opportunity', weight: 4 },
    ],
    [
      ['disruptixtalent.com', 'Clean responsive site; portal-led navigation; minimal thought leadership beyond the homepage hook', 'Authority-AEO content on SoCal CFO compensation 2026, fractional CFO ROI, Controller-search runbook, first-CFO playbook for founder-led companies'],
      ['KeyMatch portal', 'Live; advertised as "full visibility every step of the recruitment process"', 'Major asset — the AI matching, AI screening, and AI summary layer plugs in here as KeyMatch v2; current state is the platform, AI is the next layer'],
      ['LinkedIn — company page', 'Boutique footprint; activity is concentrated on the founder\'s personal account', 'Branded company-page cadence on the same content the founder publishes; team amplification; thought-leadership engine drafted by content team, founder-approved'],
      ['LinkedIn — founder', 'Active publishing cadence by Jen McCasland on transparency, recruiting, and accounting market; rare voice in the category', 'Amplify with the content engine — Jen\'s voice, drafted to her cadence, on the topics that compound (CFO comp, fractional CFO, transparency-as-tech)'],
      ['Glassdoor / Indeed / Comparably', 'Limited reviews on the firm itself; boutique footprint by nature', 'ClearlyRated "Best of Staffing" pursuit + active Google review program on the consultant side; the Best-of-Staffing badge compounds on procurement searches for years'],
      ['AI-search visibility', 'Below the citation surface on the key procurement queries (best CFO recruiter Orange County, fractional Controller Costa Mesa, SOX consultant SoCal)', 'Multi-Agent SEO + AEO targeting the exact SoCal CFO and Controller queries — the Technijian-built capability sits here'],
      ['Candidate database / matching', 'KeyMatch + the team\'s institutional knowledge; mostly human-driven matching today', 'AI matching engine: embeddings over resumes + JD specs; semantic + skills + cultural-fit weighting; recruiter-in-the-loop review with audit-logged rationale'],
      ['Recruiter workflow', 'Standard combination of ATS + LinkedIn Recruiter + email + shared drives', 'AI job-spec generator from intake calls; AI candidate one-pager from resumes; AI reference-check summarizer; AI pre-screen summarizer'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires changing the supply side — only making a credible boutique visible to the SoCal CFOs, CEOs, and operating partners DisruptiX is already qualified to serve.',
      'AI-search visibility, the founder LinkedIn cadence, the AI matching layer on KeyMatch, and the recruiter productivity layer are compounding moves: each lifts the share of qualified searches DisruptiX sees and the share it converts.',
      'They are also the natural first ninety days — get cited, capture the named-account intelligence, and stand the matching layer up — before any large build, so the entry phase pays back fast.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 THE SILENT MARGIN LEAK ----------
docChildren.push(
  ...sectionHeader('The Silent Margin Leak — Where Revenue Walks Out of a Boutique', DARK_CHARCOAL, '08'),
  spacer(100),
  p('This section names the cost that does not appear on any report, because it is the one most expensive to ignore. A boutique with a CPA founder, a 25-year SoCal relationship base, the KeyMatch portal, and a 48-to-72-hour contract-placement velocity should be holding more of its category than a one-to-ten-person team can currently service with manual recruiter operations. The revenue lost to searches that quietly get skipped because of bandwidth, triggers that nobody caught, and consultants who went quiet between placements is not a rounding error — it is a silent margin leak that never shows up as a line item, only as searches that did not return, accounts that did not come back for the second mandate, and consultants who took the next placement elsewhere.'),
  spacer(140),
  subHeader('The Searches That Got Skipped Because There Was No Bandwidth'),
  p('A boutique recruiter team can sustain a finite number of active retained searches and a finite number of contract placements simultaneously — particularly when each role requires a hand-written job spec, manually-summarized candidate briefs, and recruiter-written reference notes. The result is quiet triage: the easy mandates get worked, the complicated ones get deferred, and a meaningful share of qualified inbound never gets a full effort. Every skipped search is a placement that went to a competitor with more bandwidth, not better candidates. AI-drafted job specs, AI candidate one-pagers, and AI pre-screen and reference summarizers turn that bandwidth ceiling into a non-issue — without changing the team.'),
  spacer(60),
  p('The math is unforgiving in the right direction: when each completed retained search carries a real chance to win a $20K-to-$30K placement fee at a 20-to-25% rate on a $90K-to-$130K accounting and finance hire, even a handful of additional completions per quarter — at the same close rate — adds up quickly. Documentation and matching velocity are not soft metrics here; they are placements on the table that are currently being left there.'),
  spacer(120),
  subHeader('The Triggers That Nobody Caught'),
  p('A SoCal mid-market CFO leaves; their replacement gets filled by whoever calls the CEO first. A PE portco closes an acquisition; the new ops team needs a Controller within ninety days. A scale-up files an IPO S-1; SOX-readiness staffing kicks in. A family office adds a third operating company; finance bench depth becomes a problem. A boutique that monitors these signals manually catches a fraction; a boutique that runs an AI account-intelligence layer catches them all. The cost of missing one twenty-five-thousand-dollar placement fee per quarter to a faster competitor compounds into six figures per year — silently, because the search never came in, so it never showed up in the missed-deals report.'),
  spacer(120),
  subHeader('The Consultants Who Went Quiet'),
  p('The most expensive vacancy in a contract-staffing business is the consultant who finishes an engagement and then stops returning the recruiter\'s calls — because they took a Robert Half placement that came in warmer. The reasons are usually small and avoidable: a check-in that did not happen, an opportunity that was not surfaced, a comp shift that arrived as a surprise, a feeling of being a number in a database. None of those are relationship failures; all of them are communication and memory failures — which AI-enabled consultant-care intelligence and sales-pipeline memory protect against. A boutique that holds its top contract consultants between gigs is a boutique that controls its supply side and out-bids the giants on velocity.'),
  spacer(120),
  calloutBox(
    'Three Leaks, One Engine',
    [
      'Searches skipped because the recruiter bandwidth ceiling is too low; triggers missed because account intelligence is manual; consultants who went quiet because between-placement memory is thin. None is a relationship failure — each is a documentation, signal, or memory failure.',
      'These are exactly the failures the AI growth engine closes: AI-drafted job specs and candidate briefs against the indexed pool, an account-intelligence layer that watches SoCal mid-market signals daily, and a consultant-care engine that keeps the supply side warm between placements.',
      'This is the highest-conviction place to start, because it converts searches and consultants DisruptiX already has into placements and renewals currently being lost.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 09 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  spacer(100),
  p('This section separates two things plainly. First are proven builds — systems Technijian has actually built and operates. Then come the productized services DisruptiX would engage. Each is labeled for what it is, and each maps to a specific DisruptiX use case. Technijian has not built an AI recruiting platform for a staffing firm before; what it has built is the conversational, document, and search AI a recruiting platform is made of — and that is the honest claim.'),
  spacer(160),
  subHeader('Proven Builds — Systems Technijian Has Built'),
  capabilityBox(
    'AI Document Intelligence for FINRA Broker-Dealers',
    'Technijian deployed AI document intelligence that auto-populates and reviews complex vendor questionnaires for FINRA-registered broker-dealers, cutting response time from days to minutes with 60 to 80 percent less manual review.',
    'Pointed at the recruiter workflow, the same approach drafts job specs from intake-call transcripts, candidate one-pagers from resumes, reference-check summaries from three calls, and engagement-letter packages — at the same accuracy, in minutes instead of hours, with the recruiter as the human-in-the-loop reviewer.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Multi-Agent SEO & Answer-Engine Platform',
    'Technijian built a multi-agent content and search platform (Claude, GPT-4o, and Gemini with live search and analytics integrations) that produces authoritative, well-researched content and cut content production time by roughly 70 percent.',
    'This is how DisruptiX gets cited: AI-search authority on the SoCal procurement queries that matter — best CFO recruiter Orange County, fractional Controller Costa Mesa, SOX consultant Southern California, interim CFO Newport Beach — so that ChatGPT, Perplexity, and Google AI overviews surface DisruptiX as a credible answer.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'ScamShield — Multi-Model Review (LLM Council)',
    'Technijian architected ScamShield using a three-model LLM Council (Claude, GPT-4o, and Gemini) with risk scoring and persistent memory — a conversational design that cross-checks each answer instead of trusting a single pass.',
    'That cross-checked, multi-model design is exactly what AI candidate matching needs to be EEOC-defensible and NYC LL 144-ready: three independent models review each candidate-against-JD match, the recruiter is the human-in-the-loop arbiter, and every match has an auditable rationale. Auditable, explainable, transparent — the same discipline FINRA and food-safety documentation require, brought to hiring.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'Enterprise Knowledge & Memory System (Weaviate + Obsidian)',
    'Technijian built a private enterprise knowledge and memory system on Weaviate and Obsidian that turns an organization\'s files, history, and people-knowledge into a secure, queryable resource the whole team can search in plain language.',
    'For a one-to-ten-person boutique, this is the sales-pipeline memory — every prior search debrief, every candidate preference, every client comp note, every reference summary — searchable across the team so a consultant who surfaces eighteen months later does not start from a cold conversation. The boutique\'s quiet super-power.',
    'built'
  ),
  spacer(140),
  capabilityBox(
    'AI-Native SDLC v7.0',
    'Technijian designed an AI-first software development lifecycle integrating Claude Code with Figma Make, GitHub, and CI/CD — full lifecycle coverage with AI-native development methodology.',
    'This is how the KeyMatch v2 AI matching layer ships in ninety days instead of nine months — production-grade, audit-logged, EEOC-defensible, and deployable without re-platforming the existing portal. DisruptiX owns what gets built; it is not locked inside a third-party platform.',
    'built'
  ),
  spacer(160),
  subHeader('Productized Services DisruptiX Would Engage'),
  capabilityBox(
    'My Dev — Custom Application Development',
    'My Dev is Technijian\'s custom application development service, built on an AI-native development lifecycle (Claude Code, Figma Make, GitHub, and CI/CD) that ships assistants, portals, and integrations around a client\'s actual process.',
    'This builds the working tools — the AI matching layer on KeyMatch, the AI job-spec generator, the AI candidate one-pager, the AI pre-screen and reference summarizer, and the sales-pipeline memory layer — owned by DisruptiX, not locked inside a third-party platform.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My SEO — AI-Search Authority & Reputation',
    'My SEO is Technijian\'s search service: local search optimization, reputation management, and answer-engine visibility so a business is found and trusted where its buyers actually look.',
    'For DisruptiX it owns the AI-search citations on SoCal CFO, Controller, and fractional-finance queries, drafts the under-covered category authority content (CFO comp 2026, fractional CFO playbook, first-CFO hiring runbook), and lifts the founder LinkedIn cadence that signals seriousness to SoCal CFOs and operating partners.',
    'service'
  ),
  spacer(140),
  capabilityBox(
    'My AI Lead Gen — Named-Account ABM',
    'My AI Lead Gen is Technijian\'s productized account-based service — it tracks named accounts, watches buyer-side triggers, and produces account dossiers and personalised outreach rather than a broad funnel.',
    'For DisruptiX it is the SoCal mid-market account-intelligence engine: track the PE-portfolio companies, the public-company finance teams, the VC-backed scale-ups, and the named operating partners; watch for triggers (CFO transitions, IPO filings, PE acquisitions, audit-firm changes); and deliver pre-meeting account dossiers the BD team can act on the day a finance seat opens.',
    'service'
  ),
);

// ---------- 10 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('How AI Transforms DisruptiX’s Growth Engine', CORE_BLUE, '10'),
  spacer(100),
  p('The engine runs three motions at once: get found and cited (own AI-search authority on SoCal CFO and Controller procurement queries, with a founder LinkedIn cadence on the topics that compound), match faster and better (extend KeyMatch with AI matching, AI job-spec generation, AI candidate one-pagers, and AI pre-screen and reference summarization), and keep and grow (sales-pipeline memory, consultant-care intelligence between placements, account-renewal triggers, and recruiter productivity that recovers eight to twelve hours per recruiter per week). The first fills the top of the named-account funnel, the second is the matching and screening core, and the third protects and scales the placement count.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'The DisruptiX AI Growth Engine', 600, 1.607),
  diagramCaption('Figure 10.0 — The Engine: Get Found & Cited, Match Faster & Better, and Keep & Grow'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.8 },
      { label: 'Tool', weight: 2.4 },
      { label: 'What It Does', weight: 3 },
      { label: 'Metric', weight: 1.5 },
      { label: 'Technijian Service', weight: 1.5 },
    ],
    [
      ['Get Found & Cited', 'AI-search authority (AEO)', 'Be cited by Google AI, ChatGPT, Perplexity on SoCal CFO and Controller queries', 'AI-citation rate', 'My SEO'],
      ['Get Found & Cited', 'Authority content engine', 'SoCal CFO comp 2026, fractional CFO playbook, Controller search runbook', 'Content authority', 'My SEO'],
      ['Get Found & Cited', 'Account intelligence', 'Daily SoCal mid-market signal monitor — funding, CFO transitions, IPOs', 'Trigger conversion', 'My AI Lead Gen'],
      ['Get Found & Cited', 'Founder LinkedIn cadence', 'Jen’s voice at branded cadence; team amplification', 'Reach + engagement', 'My SEO'],
      ['Match Faster & Better', 'AI matching engine (KeyMatch v2)', 'Embeddings over the candidate pool; recruiter-in-the-loop audit trail', 'Time-to-match', 'My Dev'],
      ['Match Faster & Better', 'AI job-spec generator', 'Intake call → JD with comp band and culture cues in 5 minutes', 'JD turnaround', 'My Dev'],
      ['Match Faster & Better', 'AI candidate one-pager', 'Resume → recruiter brief: highlights, gaps, references to verify', 'Hours saved', 'My Dev'],
      ['Match Faster & Better', 'AI pre-screen + reference summarizer', 'Video screen and three reference calls into one synthesized brief', 'Time-to-shortlist', 'My Dev'],
      ['Keep & Grow', 'Sales-pipeline memory', 'Every prior search and conversation searchable across the team', 'Retrieval depth', 'My Dev'],
      ['Keep & Grow', 'Consultant-care engine', 'Between-placement check-ins; opportunity matching; upskilling cues', 'Consultant retention', 'My AI'],
      ['Keep & Grow', 'Account-renewal intelligence', 'Watch contract end-dates, convert-to-FTE triggers, extensions', 'Renewal rate', 'My AI'],
      ['Keep & Grow', 'Recruiter productivity layer', '8 to 12 hours per recruiter per week recovered for higher-margin work', 'Hours recovered', 'My AI'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Human Boundary',
    [
      'AI auto-drafts, indexes, summarizes, and remembers — with sources cited and inside the documentation rules each regulator expects. It gives every search, every match, and every candidate conversation the same complete, in-format treatment.',
      'AI never makes the hiring decision, never adjudicates a protected-class question, and never sets a rate in an antitrust-sensitive way. The recruiter — and ultimately the client — owns the decision, in writing, outside the regulatory and antitrust risk entirely.',
      'The boutique team is freed, not replaced: the AI handles the documentation tax, the signal monitoring, and the memory; the team spends its time on the relationships, the warm intros, and the buyer conversations that close placements.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 11 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '11'),
  spacer(100),
  p('The plan is built to start small and expand. Rather than ask for the full program up front, it begins with a focused, low-commitment entry that pays for itself on the highest near-term levers — AI-search authority, named-account intelligence, and a strategy workshop — and expands into the KeyMatch v2 AI matching layer, the recruiter productivity tools, and the fractional AI advisor only as the results prove out. The model below is built from public information and conservative assumptions, because DisruptiX’s internal numbers were not available for this draft. Every figure is estimated; the discovery questions in Section 14 replace them with real baselines.'),
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
      ['AI-search citation on SoCal recruiter queries', 'Below the citation surface', 'Cited by Google AI, ChatGPT, Perplexity', 'Discoverability'],
      ['Time to deliver a matched shortlist', '48 to 72 hours on contract roles', '24 to 48 hours with AI matching', 'Velocity'],
      ['Searches handled per recruiter per quarter', 'Bandwidth-limited; quiet triage', 'Ceiling removed by AI-drafted specs and briefs', 'Capacity'],
      ['Documentation completeness on first pass', 'Variable by recruiter', 'Consistent, sourced, audit-logged', 'Quality'],
      ['SoCal trigger-to-outreach lag', 'Manual; days to weeks', 'Same-day on the priority signals', 'Win rate'],
      ['Consultant between-placement retention', 'Manual check-ins; gaps', 'Engaged by the consultant-care engine', 'Supply side'],
      ['Recruiter hours on JD, briefs, notes, email', 'Heavy, manual', 'Recovered for relationship work', 'Capacity freed'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model — The Entry Program (Estimated, Conservative)'),
  p('Value is modeled on the two highest-conviction levers — additional client searches won and additional contract-consulting placements completed at the same close rate — not on rate changes, because rate-setting stays out of scope. The entry program alone (AI-search authority, named-account intelligence, and the strategy workshop) drives the lift below; the KeyMatch v2 expansion build and the fractional AI advisor push both levers further.', { size: 20 }),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Conservative', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Target', weight: 2.1, align: AlignmentType.CENTER },
      { label: 'Aggressive', weight: 2.1, align: AlignmentType.CENTER },
    ],
    [
      ['Additional client searches won (direct-hire)', { text: '+2', align: AlignmentType.CENTER }, { text: '+4', align: AlignmentType.CENTER }, { text: '+7', align: AlignmentType.CENTER }],
      ['Avg first-year placement fee per win (illustrative ~22%)', { text: '$22K', align: AlignmentType.CENTER }, { text: '$22K', align: AlignmentType.CENTER }, { text: '$22K', align: AlignmentType.CENTER }],
      ['Added direct-hire revenue', { text: '+$44K', align: AlignmentType.CENTER }, { text: '+$88K', align: AlignmentType.CENTER }, { text: '+$154K', align: AlignmentType.CENTER }],
      ['Additional contract-consulting placements completed', { text: '+3', align: AlignmentType.CENTER }, { text: '+6', align: AlignmentType.CENTER }, { text: '+10', align: AlignmentType.CENTER }],
      ['Avg margin per consulting placement (illustrative)', { text: '$12K', align: AlignmentType.CENTER }, { text: '$12K', align: AlignmentType.CENTER }, { text: '$12K', align: AlignmentType.CENTER }],
      ['Added contract-consulting margin', { text: '+$36K', align: AlignmentType.CENTER }, { text: '+$72K', align: AlignmentType.CENTER }, { text: '+$120K', align: AlignmentType.CENTER }],
      ['Recruiter hours recovered (loaded at ~$80/hr)', { text: '+$15K', align: AlignmentType.CENTER }, { text: '+$35K', align: AlignmentType.CENTER }, { text: '+$66K', align: AlignmentType.CENTER }],
      [{ text: 'Total Y1 Value (entry)', bold: true }, { text: '+$95K', bold: true, align: AlignmentType.CENTER }, { text: '+$195K', bold: true, align: AlignmentType.CENTER }, { text: '+$340K', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Entry Program Investment (Y1)', bold: true }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }, { text: '~$32,000', bold: true, align: AlignmentType.CENTER }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '~3.0x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~6.1x', bold: true, color: PASS, align: AlignmentType.CENTER }, { text: '~10.6x', bold: true, color: PASS, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(60),
  p('The ratio is measured against the entry program only — the easiest possible place to start. It does not count the larger gains the KeyMatch v2 expansion adds (AI matching, AI job-spec generator, AI pre-screen and reference summarizer), the consultant retention compounding effect on supply, the AI-search authority that compounds month over month, or the future Phase-3 SaaS productization of KeyMatch. Average placement fee and consulting margin are illustrative public-market placeholders and are replaced with DisruptiX’s actual book in discovery. All figures are projected, not guaranteed.', { italics: true, size: 18 }),
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
      ['My AI — AI Readiness + Executive Workshop (one-time)', 'A one-day session with Jen, Frankie, Brad, and Alex — recruiter workflow tour, KeyMatch v2 scoping, compliance posture review (EEOC, NYC LL 144, SB 7)', { text: '—', align: AlignmentType.CENTER }, { text: '$5,000', align: AlignmentType.CENTER }],
      ['My SEO — Tier 4: Website + SEO + Blog Content + Video', 'Own AI-search citations on SoCal CFO and Controller queries; founder LinkedIn cadence on transparency-as-tech and CFO comp 2026', { text: '$1,250', align: AlignmentType.CENTER }, { text: '$15,000', align: AlignmentType.CENTER }],
      ['My AI Lead Gen — Named-Account ABM (Starter)', 'Track SoCal PE portcos, public-company finance teams, VC-backed scale-ups; trigger monitoring; per-account dossiers', { text: '$1,000', align: AlignmentType.CENTER }, { text: '$12,000', align: AlignmentType.CENTER }],
      [{ text: 'ENTRY PROGRAM — Phase 1 (start here)', bold: true }, { text: 'Recurring $2,250/mo + workshop', bold: true }, { text: '', bold: true }, { text: '~$32,000', bold: true, color: CORE_ORANGE, align: AlignmentType.CENTER }],
      ['My Dev — KeyMatch v2 AI Layer (Phase 2 build)', 'AI matching engine + AI job-spec generator + AI candidate one-pager + AI pre-screen summarizer + AI reference-check summarizer + sales-pipeline memory layer', { text: '—', align: AlignmentType.CENTER }, { text: '$48,000', align: AlignmentType.CENTER }],
      ['My Dev — Managed App Services (Phase 2)', 'Hosting, monitoring, audit-log review, and iteration of the KeyMatch v2 layer', { text: '$800', align: AlignmentType.CENTER }, { text: '$9,600', align: AlignmentType.CENTER }],
      ['My AI — Fractional AI Advisor (Phase 2)', 'Program leadership, EEOC and NYC LL 144 governance, model performance review, recruiter team training', { text: '$2,000', align: AlignmentType.CENTER }, { text: '$24,000', align: AlignmentType.CENTER }],
      [{ text: 'FULL ENGINE — Entry + Expansion', bold: true }, { text: 'Recurring $5,050/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$113,600', bold: true, color: CORE_BLUE, align: AlignmentType.CENTER }],
    ],
  ),
  spacer(160),
  calloutBox(
    'Land Small, Then Expand',
    [
      'Start with the roughly $32,000 entry program — AI-search authority, named-account ABM intelligence, and the strategy workshop — that pays for itself on additional placements and recovered recruiter hours, with no large build to begin.',
      'Expand into the full engine (the KeyMatch v2 AI matching layer, the recruiter productivity tools, the managed app services, the fractional AI advisor) only once the entry proves the lift. That one-time build becomes a permanent boutique advantage.',
      'Phase 3 is reuse: productize KeyMatch as a sellable SaaS for peer boutique accounting and finance firms outside DisruptiX’s competitive territory, and extend to other functional verticals (HR, Legal, Marketing). Treat as upside, not Year-1 ask.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 12 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '12'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 270-day cadence that mirrors the land-and-expand plan: start with the low-commitment entry — get cited and stand up the named-account intelligence — then add the KeyMatch v2 AI matching layer and the recruiter productivity tools, then scale and explore productizing. Real gains — AI-search citations, named-account dossiers, an indexed candidate pool — are visible inside the first ninety days, before the larger build; the deeper engine and the SaaS productization are given realistic runway.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'DisruptiX 90-180-270 Day Roadmap', 600, 2.296),
  diagramCaption('Figure 12.0 — The DisruptiX Growth Program: 90 / 180 / 270-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation & Quick Wins (Days 1–90)', { color: CORE_BLUE }),
  p('The low-commitment entry — get cited on SoCal recruiter queries and stand up the named-account intelligence, with quick, visible wins and no large build to begin.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — AEO + Authority Content', 'Launch Multi-Agent SEO + AEO targeting the SoCal procurement queries that matter (best CFO recruiter Orange County, fractional Controller Costa Mesa, SOX consultant Southern California). Draft the under-covered category authority content (SoCal CFO comp 2026, fractional CFO playbook, first-CFO hiring runbook). Lift the founder LinkedIn cadence on transparency-as-tech and the CFO comp conversation.'],
      ['1.2 — Account Intelligence Standup', 'Stand up the named-account list across SoCal PE portfolios, public-company finance teams, VC-backed scale-ups, and family offices. Begin trigger monitoring (CFO transitions, IPO filings, PE acquisitions, audit-firm changes). Deliver pre-meeting account dossiers to the BD team — the entry program’s fast win, with no custom build required.'],
      ['1.3 — AI Readiness Workshop + Reputation Foundation', 'Run the one-day workshop with Jen, Frankie, Brad, and Alex — recruiter workflow tour, KeyMatch v2 scoping, compliance posture review. Stand up the Google + ClearlyRated review program on the consultant side; pursue the Best-of-Staffing badge.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — KeyMatch v2 + Pipeline Build (Days 91–180)', { color: TEAL }),
  p('The expansion build, once the entry proves the lift — extend KeyMatch with the AI matching layer, the recruiter productivity tools, and the fractional AI advisor.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — KeyMatch v2 AI Matching Layer', 'Embeddings over the candidate pool; semantic + skills + cultural-fit weighting; recruiter-in-the-loop review UI; audit-logged rationale for every match. NYC LL 144-ready bias-audit posture from day one.'],
      ['2.2 — AI Job-Spec Generator + AI Candidate One-Pager', 'Production deployment for the recruiter team. Intake call → JD with comp band and culture cues in five minutes. Resume → recruiter brief: highlights, gaps, references to verify. Recruiter approval pass required before client-facing release.'],
      ['2.3 — AI Pre-Screen + Reference Summarizer + Fractional Advisor Onboarded', 'Video screen and three reference calls into one synthesized brief, with bias-audit review built in. Fractional AI Advisor onboards with Jen weekly cadence; quarterly EEOC / NYC LL 144 / SB 7 posture review begins.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Productize (Days 181–270)', { color: CORE_ORANGE }),
  p('Add the sales-pipeline memory and consultant-care engine, roll out to expanded SoCal team, and begin exploring KeyMatch as a SaaS for peer boutique firms.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Sales-Pipeline Memory + Consultant-Care Engine', 'Index every prior search, debrief, candidate preference, and client comp note in the Weaviate + Obsidian memory layer. Stand up the consultant-care engine: between-placement check-ins, opportunity matching, upskilling cues. Add account-renewal intelligence with a per-account dashboard.'],
      ['3.2 — Productize KeyMatch (SCALE) + Functional Expansion', 'Begin discovery with three to five peer boutique accounting and finance firms outside DisruptiX’s competitive territory on KeyMatch as a sellable SaaS. Validate cross-vertical reuse with a first HR or Marketing senior search. Deliver an ROI dashboard measured against the Section 14 baselines.'],
    ],
  ),
);

// ---------- 13 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '13'),
  spacer(100),
  p('Six actions DisruptiX can take immediately — before any new Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Test AI-Search Visibility for SoCal Recruiter Queries',
    ['Type the queries a real SoCal CFO would type into ChatGPT, Perplexity, and Google AI: “best CFO recruiter Orange County,” “fractional Controller Costa Mesa,” “SOX consultant Southern California,” “interim CFO Newport Beach.” See whether DisruptiX is cited; capture a screenshot baseline. It costs nothing and immediately sizes the AEO opportunity.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Run the EEOC AI Hiring Compliance Checklist',
    ['The May 2023 EEOC technical assistance is public. DisruptiX almost certainly already complies because the team makes hiring decisions manually, but the checklist is the audit trail when a client GC asks. Run it; file the result. Free; takes an afternoon.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Map 30 SoCal PE Portcos with a CFO Older than 60 or a CFO with a 4+ Year Tenure',
    ['The trigger queue. Free to assemble from Pitchbook, Crunchbase, LinkedIn, and public press: the SoCal mid-market PE portcos where a CFO transition is statistically likely in the next twelve months. This is the seed list the named-account ABM intelligence will work from day one — the kind of list a national giant pays a research team to maintain.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Ask the Last 10 Clients for a ClearlyRated Review',
    ['ClearlyRated’s Best of Staffing badge compounds for years on procurement searches. Email the last ten placements; request a review with the ClearlyRated direct link. Same for Google reviews on the consultant side. Free; takes a single afternoon to send.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Open a Content Calendar with Jen',
    ['Five topics, owned by Jen, drafted by the marketing team for her cadence: “How long should a Controller search take,” “The 2026 SoCal CFO comp band,” “The fractional CFO playbook,” “What a PE operating partner actually looks for in a Controller,” “When to convert a contract Controller to FTE.” These compound on Google, Perplexity, and Jen’s personal LinkedIn for years.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('6 — Inventory the Candidate Database Fields',
    ['Map what fields KeyMatch captures on each candidate today and what is missing for an AI matching layer to work well (industry depth, revenue band of prior employers, public-vs-private experience, SOX exposure, system experience, comp preferences, location flex). This is a free internal audit; it informs the workshop and accelerates the Phase 2 build.'],
    CORE_BLUE),
);

// ---------- 14 QUESTIONS TO CALIBRATE ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '14'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 11 and 12 are deliberately conservative estimates — a short discovery call replaces them with DisruptiX’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Placement volume mix', 'Searches per month by type (retained direct-hire vs. contract consulting vs. interim project)', 'Calibrates the ROI math directly'],
      ['Average won-account value', 'Avg direct-hire fee, avg consulting markup spread, avg contract length', 'Replaces the $22K / $12K illustrative placeholders'],
      ['Named-client roster + concentration', 'Which SoCal PE / public / VC / family-office accounts are live', 'Seeds the ABM target list and sizes the renewal pool'],
      ['KeyMatch architecture', 'Current platform (custom, Bullhorn-based, PCRecruiter, other), integrations (LinkedIn Recruiter, etc.), candidate-database size, client-portal usage stats', 'Defines the Phase 2 build and integration surface'],
      ['Candidate pool size + composition', 'Active vs. passive split; functional bench depth; geographic mix', 'Sizes the matching engine and the consultant-care opportunity'],
      ['Current sales motion', 'Outbound BD process; trigger sources used today; sales-team headcount', 'Defines the workflow handoff'],
      ['Marketing ownership', 'Agency, internal, or founder-led; current content cadence; LinkedIn ownership', 'Defines the content engine handoff'],
      ['Revenue band (rough)', 'Y1 revenue scale, growth rate', 'Calibrates entry vs. upsell sizing'],
      ['Growth plan', 'Geographic (LA + IE), functional, headcount targets for 2026 and 2027', 'Phases the expansion and SCALE conversation'],
      ['Compliance posture', 'Current EEOC documentation; any prior NYC placements; CCPA/CPRA disclosure language; SB 7 awareness', 'Sets the audit-ready baseline'],
      ['Josh’s role', 'Partner, senior BD, investor, or referral champion', 'Calibrates the outreach and the budget-owner conversation'],
      ['KeyMatch SaaS appetite', 'Would DisruptiX entertain productizing KeyMatch as a sellable SaaS to peer boutiques in Phase 3', 'Decides whether the Y2 conversation is SaaS or staffing scale'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 entry proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on DisruptiX’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 15 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '15'),
  spacer(100),
  p('DisruptiX already has the hard things: a CPA founder with twenty-five years of SoCal accounting and finance market relationships, the KeyMatch portal, the transparency tagline that signals exactly the right architectural posture for the EEOC / NYC LL 144 / SB 7 world, and a 48-to-72-hour contract-placement velocity. What it has not yet done is add the AI matching and recruiter-productivity layer that turns a boutique into a national-grade research bench — and that is where this program starts.'),
  p('The opportunity is concrete: get found and cited as the SoCal accounting and finance recruiter procurement researchers ask about first, match faster and better by extending KeyMatch with an AI matching layer the giants cannot legally re-platform around inside two years, and keep and grow by holding the supply side warm and watching the renewal triggers. A focused, hybrid program does all three — and it stays inside the EEOC, NYC LL 144, and antitrust boundaries that decide which AI is even safe to deploy in this category.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 14 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — AEO authority, named-account ABM intelligence, and the strategy workshop — live inside 30 days of signature, with no large build required to start.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to deliver the next matched shortlist in 24 hours, not 72?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
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
  p('Technijian is an AI-native managed-services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help right-sized operators compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for DisruptiX', weight: 5 }],
    [
      ['My Dev', 'Custom AI-native builds — KeyMatch v2 AI matching layer, AI job-spec generator, AI candidate one-pager, AI pre-screen and reference summarizer, sales-pipeline memory — owned by DisruptiX'],
      ['My SEO', 'AI-search authority (AEO) on the SoCal CFO and Controller queries, the under-covered CFO comp and fractional CFO category content, founder LinkedIn cadence'],
      ['My AI Lead Gen', 'Named-account ABM intelligence — SoCal PE portcos, public-company finance teams, VC-backed scale-ups; CFO and Controller trigger monitoring; account dossiers'],
      ['My AI', 'AI strategy and builds — fractional AI advisor, model performance review, EEOC and NYC LL 144 governance throughout, recruiter team training'],
      ['My Security', 'Candidate-PII governance behind every AI workflow; SOC 2 and CCPA-ready architecture for the KeyMatch v2 layer'],
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
  p('Market and category intelligence gathered via public web research conducted May 2026. Company details (founding, locations, services, leadership, and team) are drawn from public sources and DisruptiX’s own website and should be confirmed with DisruptiX before external use.', { italics: true }),
  spacer(120),
  p('1. DisruptiX Talent Solutions — disruptixtalent.com (home, Company Solutions, Job Seeker Hub, Consultant Portal, Direct Hire Jobs, Knowledge Resources, KeyMatch portal). Boutique accounting and finance staffing firm headquartered in Costa Mesa, expanded from San Diego in summer 2025.', { size: 20 }),
  p('2. LinkedIn — DisruptiX Talent Solutions company page (linkedin.com/company/disruptixtalent) and Jennifer McCasland personal profile (linkedin.com/in/jennifer-mccasland-cpa-inactive-2021911). Active publishing cadence on transparency, recruiting, and the SoCal accounting and finance market.', { size: 20 }),
  p('3. Orange County Business Journal — "On the Move: DisruptiX Talent Solutions Expands to Orange County," advertorial dated 2025-08-11. Documents the OC expansion and the firm’s mission of bridging automation with genuine human connection.', { size: 20 }),
  p('4. Skutvik Consulting — Vibecast Episode 45, "Disrupting Recruiting with Transparency and Trust with Jen McCasland," 2025-09-06. Source for the transparency-as-tech positioning and the founder’s career narrative.', { size: 20 }),
  p('5. Vaco Orange County — vaco.com archive listing Jennifer McCasland as a former Managing Partner of the Orange County office, specializing in accounting and finance and contingent staffing.', { size: 20 }),
  p('6. Competitors — Robert Half / Protiviti (NYSE:RHI), Vaco (Olympus Partners), Kforce (NASDAQ:KFRC), Randstad / RGP, Alliance Resource Group (Irvine), FORTIS Resource Partners (OC/LA/SD), J.R. Berry Search Group (Newport Beach), Beacon Resources, Brilliant Financial Search, Stephen James Associates, Innovative Career Resources, Centric Business Resources, Marquee Staffing. Public websites, ClearlyRated rankings, Clutch.co.', { size: 20 }),
  p('7. Regulation — EEOC technical assistance on algorithmic hiring tools (May 2023, updated 2024); NYC Local Law 144 on Automated Employment Decision Tools (effective July 2023); California Fair Chance Act AB 1008; California FEHA framework; California SB 7 (2025 session, Automated Decision Systems); CCPA / CPRA candidate-data obligations; US DOJ v. RealPage (2024 filing, 2025 proposed settlement) as the algorithmic-pricing antitrust analog.', { size: 20 }),
  p('8. Staffing industry data — ClearlyRated Best of Staffing program (best-of-staffing.com); SHRM Talent Acquisition Benchmark; Glassdoor and Comparably review aggregators; Bullhorn and PCRecruiter ATS market positioning; LinkedIn Recruiter platform documentation.', { size: 20 }),
  p('9. AI category context — AI-in-hiring (HireVue, Eightfold, Paradox, Pymetrics, Olive); horizontal RFP and document automation (Loopio, RFPIO/Responsive.io); ABM (Apollo, 6sense, Demandbase); horizontal conversational AI (Drift, Intercom). DisruptiX itself does not compete with these — it would be a customer of the underlying capabilities, brought to bear inside KeyMatch v2.', { size: 20 }),
  p('10. Technijian service pricing — My SEO tiered pricing $500 to $1,500 monthly with $200 add-ons; My AI Lead Gen Starter $1,000 monthly; My AI Workshop $5,000 one-time; My AI Fractional Advisor $2,000 monthly; My Dev custom build scoped $40,000 to $120,000; My Dev Managed App Services $800 monthly.', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'DisruptiX-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
