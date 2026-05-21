// OrthoKinetix (powered by OrthoXpress) — SEO, GEO & Lead Generation Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/MWAR/build-mwar-report.js and Clients/RKE.

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
const DIAGRAM_STOCKBILL_BUF = dbuf('stockbill.png');
const DIAGRAM_PERSONAS_BUF  = dbuf('personas.png');
const DIAGRAM_ARCH_BUF      = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF  = dbuf('timeline.png');

const TODAY = '2026-05-21';
const CLIENT = 'OrthoKinetix';

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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to OrthoKinetix: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'SEO, GEO & Lead Generation Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'ORTHOKINETIX', size: 68, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'powered by OrthoXpress', size: 26, bold: false, color: BRAND_GREY, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'SEO, GEO & Lead Generation Blueprint', size: 38, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Riverside, California  |  orthokinetix.net', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for OrthoKinetix', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
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
    { number: '2006', label: 'Serving Providers Since', color: CORE_BLUE },
    { number: '40+', label: 'Payors Contracted (Proof You Can Bill)', color: CORE_ORANGE },
    { number: '2', label: 'Search Audiences: Patients + Providers', color: TEAL },
    { number: 'GEO', label: 'The AI-Answer Channel, Wide Open', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('OrthoKinetix has the things that take years to build — two decades serving providers since 2006, BOC Gold Seal accreditation, and contracts across more than forty payors and workers’-comp networks. What it does not have is visibility in search. The homepage still sits at a /site/ subfolder, and almost nothing on it ranks for the terms patients and providers actually type. Meanwhile, that demand flows every day to whoever shows up first.'),
  p('Two distinct audiences are searching right now. Patients look for covered equipment — "knee brace covered by Medicare near me," "CPM machine rental Riverside," "lymphedema pump through insurance." Providers look for a partner — "stock and bill program California," "DME company for an orthopedic practice." And a third surface has opened: people increasingly ask ChatGPT, Perplexity, Google AI Overviews, and Gemini these exact questions, and those tools answer by citing whoever optimized for it. OrthoKinetix is in none of those answers today.'),
  p('This blueprint is a focused SEO + GEO + Lead Generation program with three moves: get OrthoKinetix found (SEO for Google, GEO for AI answers), capture the demand (an on-site Chat.AI assistant and conversion funnels — you already know Chat.AI, so it is the capture layer here, not a product to sell you), and win the high-value accounts by name (account-based outreach powered by My AI Lead Gen). It is deliberately hybrid: broad search demand on one side, named hospital and surgery-center accounts on the other.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Patients and providers are already searching for exactly what OrthoKinetix sells — the demand exists; OrthoKinetix simply is not capturing it.',
      'GEO — being the source ChatGPT, Perplexity, and Google AI Overviews cite — is a brand-new channel almost no DME competitor has claimed. First mover wins compounding visibility.',
      'The program is hybrid by design: SEO/GEO plus on-site capture for the broad searchable demand, and targeted account-based outreach for the hospital and surgery-center accounts worth winning by name.',
    ],
    CORE_ORANGE
  ),
  p('Note on figures: OrthoKinetix’s internal metrics (web traffic and lead volume, new accounts per month, average order and account value) were not available for this draft. Every projection below is labeled estimated and calibrates to real numbers after a short discovery call — the specific questions are listed in Section 13.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 WHERE THE DEMAND LIVES ----------
docChildren.push(
  ...sectionHeader('Where the Demand Lives', TEAL, '02'),
  spacer(100),
  p('Before any tactics, one question decides the whole strategy: where does OrthoKinetix’s next dollar of growth actually come from? The answer is a few distinct pools of demand — most of them searchable and largely uncaptured, plus a finite set of high-value accounts worth winning by name. The program is built to serve all of them, which is why it pairs broad search capture with targeted outreach.'),
  spacer(120),
  buildTable(
    [
      { label: 'Demand Pool', weight: 2.1 },
      { label: 'Who’s Looking', weight: 2.6 },
      { label: 'Example Searches', weight: 3 },
      { label: 'How OrthoKinetix Captures It', weight: 2.5 },
    ],
    [
      ['Patient / consumer', 'Patients with a prescription or a recovery need', '"knee brace covered by Medicare near me", "CPM rental Riverside", "lymphedema pump through insurance"', 'Local + organic SEO, GEO answers, on-site capture'],
      ['Provider / practice', 'Administrators, surgeons, office managers choosing a DME partner', '"stock and bill program California", "DME company for an orthopedic practice"', 'Provider SEO + authority content + a consult funnel'],
      ['AI-assistant (GEO)', 'Both audiences asking ChatGPT, Perplexity, Google AI Overviews, Gemini', '"What DME suppliers do stock and bill in California?", "How do I get a CPM machine covered?"', 'GEO: structured answers + FAQPage schema + citations'],
      ['Named high-value accounts', 'Hospitals, surgery centers, large ortho groups', '(these do not search — they are won by outreach)', 'Account-based outbound (My AI Lead Gen) + field reps'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Ways to Grow, One Program',
    [
      'The searchable pools are demand that already exists today — patients and providers type these queries every day, and the results (and the AI answers) point somewhere other than OrthoKinetix. SEO + GEO + on-site capture turns that traffic into leads.',
      'The named hospitals and surgery centers worth winning do not search; they are won by targeted outreach. That track stays account-based, so the program never becomes undirected "spray-and-pray."',
      'One note up front: because patient questions touch health information, the on-site assistant and all data handling are HIPAA-safe by design — a BAA in place, no patient data sent to public AI tools. Done right, that is a trust signal, not a hurdle.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 03 THE STOCK & BILL BUSINESS MODEL ----------
docChildren.push(
  ...sectionHeader('The Stock & Bill Business Model', CORE_BLUE, '03'),
  spacer(100),
  p('OrthoKinetix is not a retail DME shop. It is a business-to-business operator that sits in the middle of a three-party transaction: it stocks devices at the provider’s office, the provider dispenses to the patient at the point of care, and OrthoKinetix bills the patient’s insurance and owns every follow-up. This matters to a growth program because the buyer (the practice), the user (the patient), and the payer (the insurer) are three different parties — so the search demand and the message that converts it look different for each, and the program meets each where they look.'),
  spacer(160),
  diagramImage(DIAGRAM_STOCKBILL_BUF, 'OrthoKinetix Stock & Bill Model', 600, 1.80),
  diagramCaption('Figure 3.0 — The Stock & Bill Model: one transaction, three parties, and where AI accelerates it'),
  spacer(120),
  subHeader('Two Divisions, One Operation'),
  buildTable(
    [
      { label: 'Division', weight: 2.4 },
      { label: 'Customer', weight: 2.6 },
      { label: 'How It Works', weight: 5 },
    ],
    [
      ['Office Stock & Bill', 'Physician practices, ortho / PT / pain clinics, surgery centers (SoCal)', 'A rep monitors on-site inventory and restocks to the practice’s prescription patterns. The provider dispenses in-visit; OrthoKinetix bills insurance and owns follow-up and warranty.'],
      ['Hospital Stock & Bill Division', 'Hospitals (nationwide)', 'On-site product availability, stocking programs, and dedicated field service support extended to hospital partners across the country.'],
    ],
  ),
  spacer(160),
  subHeader('What OrthoKinetix Already Does Well'),
  p('The company sells on real operational strengths — each of which becomes sharper with AI behind it:'),
  bullet('In-house billing with upfront benefit verification and clear co-pay explanation — a differentiator AI can make instant.'),
  bullet('In-service training delivered directly to facilities, building the relationship that earns the next referral.'),
  bullet('Dedicated sales representatives who own long-term account relationships — the human core AI is meant to amplify, not replace.'),
  bullet('Pricing aligned to Medicare allowable amounts, with the payor breadth to actually collect on it.'),
  spacer(120),
  calloutBox(
    'Why This Model Converts Search Demand',
    [
      'Stock & Bill is an unusually strong offer to put in front of a searching provider: "we stock it, your team dispenses in-visit, we bill insurance and own the follow-up." That is a direct answer to a real, weekly pain.',
      'For a patient, the message is just as concrete: get the device your doctor prescribed, in-network, without fighting the paperwork.',
      'A strong, specific offer is what makes SEO and GEO pay off — traffic only converts when what it lands on solves the searcher’s problem. OrthoKinetix already has that offer; it simply is not visible in search yet. (Back-office automation — prior-auth and denials — is available as a later phase, but it is not the focus of this plan.)',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 THE SEARCH OPPORTUNITY: SEO + GEO ----------
docChildren.push(
  ...sectionHeader('The Search Opportunity — SEO + GEO', TEAL, '04'),
  spacer(100),
  p('Getting found now means two things, not one. SEO is being the result Google shows when someone searches. GEO — Generative Engine Optimization — is being the source the AI assistants quote when someone asks ChatGPT, Perplexity, Google AI Overviews, or Gemini the same question. The two reinforce each other: the structured, authoritative content that ranks in Google is exactly what the AI assistants pull from. OrthoKinetix is currently absent from both, while the queries below run every day.'),
  spacer(140),
  subHeader('What Patients Are Searching'),
  p('Patient demand is real, local, and high-intent — a person with a prescription looking for a covered device is ready to act. These are the queries OrthoKinetix should own across Los Angeles, Riverside, San Bernardino, Orange, and Ventura counties:'),
  buildTable(
    [
      { label: 'Patient Search', weight: 3.6 },
      { label: 'Intent', weight: 2 },
      { label: 'How OrthoKinetix Wins It', weight: 4.4 },
    ],
    [
      ['"knee brace covered by Medicare near me"', 'High — ready to obtain', 'Local SEO + a covered-bracing page + a complete Google Business Profile'],
      ['"CPM machine rental Riverside"', 'High — post-op need', 'Service page + a GEO answer on what is covered and how to get it'],
      ['"lymphedema pump through insurance"', 'High — specific device', 'Condition page + a coverage FAQ that AI assistants can cite'],
      ['"bone growth stimulator covered by insurance"', 'High — specific', 'Coverage explainer answering the exact question in plain language'],
      ['"DME supplier that accepts IEHP / Medi-Cal"', 'High — payor match', 'Payor-specific landing pages naming the plans OrthoKinetix takes'],
      ['"where to get a back brace after surgery"', 'Medium — guidance', 'How-to content that captures the searcher early and routes them in'],
    ],
  ),
  spacer(160),
  subHeader('What Providers Are Searching'),
  p('Provider demand is lower in volume but far higher in value — one practice that adopts Stock & Bill is worth thousands of patient searches. These queries are wide open because no DME supplier has built real content for them:'),
  buildTable(
    [
      { label: 'Provider Search', weight: 3.6 },
      { label: 'Who’s Searching', weight: 2.4 },
      { label: 'How OrthoKinetix Wins It', weight: 4 },
    ],
    [
      ['"stock and bill program California"', 'Practice administrator', 'A real Stock & Bill page (not a two-sentence stub) + a consult funnel'],
      ['"DME company for an orthopedic practice"', 'Surgeon / office manager', 'Provider authority content + proof from long-standing accounts'],
      ['"in-office bracing dispensing partner"', 'Practice / clinic', 'Service page leading with the "we own the billing" message'],
      ['"workers comp DME supplier"', 'WC case manager', 'A WC-channel page naming the networks OrthoKinetix contracts with'],
      ['"hospital stock and bill DME vendor"', 'Materials manager', 'A Hospital Stock & Bill Division page built for national searches'],
    ],
  ),
  spacer(160),
  subHeader('GEO — Getting Cited by the AI Assistants'),
  p('More patients and providers now ask an AI assistant before they ever open Google. They type "What DME suppliers do stock and bill in California?" or "How do I get a CPM machine covered after knee surgery?" — and ChatGPT, Perplexity, Google AI Overviews, and Gemini answer in prose, naming a few sources. GEO is the practice of becoming one of those named sources. It is the same content discipline as SEO, packaged for machines to quote: direct, plain-language answers; FAQPage schema on every coverage question; ungated explainers; and third-party citations (a complete Google Business Profile, reviews, and industry directories) that tell the models OrthoKinetix is a real, trusted answer.'),
  spacer(100),
  calloutBox(
    'GEO Is the Channel Competitors Haven’t Claimed',
    [
      'AI assistants are becoming the first stop for "how do I get X covered?" questions — and they cite whoever structured their content to be quotable. Almost no DME supplier has done this.',
      'The work compounds: a single well-built coverage explainer can rank in Google AND be cited by four different AI assistants, for years, with no per-click cost.',
      'Being the cited answer is a durable moat — far harder for a competitor to dislodge than a paid ad, and OrthoKinetix can claim it first.',
    ],
    CORE_BLUE
  ),
  p('All of this rests on one fix: the homepage must move off the /site/ subfolder to the root domain, and the OrthoKinetix / OrthoXpress naming should consolidate, so every page of content compounds one domain’s authority instead of splitting it (see Section 7).', { spaceBefore: 60 }),
);

// ---------- 05 THE ORTHOKINETIX CUSTOMER ----------
docChildren.push(
  ...sectionHeader('The OrthoKinetix Customer', CORE_ORANGE, '05'),
  spacer(100),
  p('OrthoKinetix serves a small set of distinct buyer segments — plus the patient at the end of the chain. Each is found or reached differently, and they differ meaningfully on both account volume and margin, which is why the segment matrix below uses those two axes to show where to point the SEO/GEO and the outreach effort.'),
  spacer(160),

  personaCard('1 — The Surgeon / Practice Administrator', CORE_BLUE, [
    ['Role', 'Orthopedic surgeon or the administrator who runs the practice’s operations and chooses its DME partner.'],
    ['Pain Points', 'No time or space to manage inventory; staff buried in billing and prior-auth; denied claims that boomerang back to the office.'],
    ['Decision Driver', 'Does this remove work and keep patients moving? Reliability and "we own the billing" matter more than a few dollars of price.'],
    ['AI Opportunity', 'Provider SEO makes OrthoKinetix the name they find first; account-intelligence dossiers let reps walk in already understanding the practice.'],
    ['Technijian Hook', 'My SEO — provider authority content + the Stock & Bill page they find when comparing partners. My AI Lead Gen — account-based outreach for the practices worth winning.'],
  ]),
  spacer(160),

  personaCard('2 — The Hospital / Surgery-Center Materials Manager', CORE_ORANGE, [
    ['Role', 'Supply-chain or materials manager responsible for on-site product availability and supplier performance at a hospital or ASC.'],
    ['Pain Points', 'Stockouts at the point of care; multiple suppliers to manage; pressure on cost and compliance documentation.'],
    ['Decision Driver', 'Consistent on-site availability, dependable field service, and clean compliance — a partner who never lets a case wait on a missing device.'],
    ['AI Opportunity', 'Account-based outreach reaches named hospitals and ASCs by name; a dedicated Hospital division page captures national search demand.'],
    ['Technijian Hook', 'My AI Lead Gen — account-based outreach to named hospitals and surgery centers. My SEO — a Hospital Stock & Bill page built for national searches.'],
  ]),
  spacer(160),

  personaCard('3 — The PT / Pain-Management Clinic Owner', TEAL, [
    ['Role', 'Owner or lead clinician at a physical-therapy or pain clinic that dispenses bracing, TENS, traction, and supports.'],
    ['Pain Points', 'Wants to dispense at point of care without becoming a billing operation; reorders and supplies are a manual chore.'],
    ['Decision Driver', 'Turnkey dispensing with someone else owning the insurance work; fast restock so they never run out mid-treatment.'],
    ['AI Opportunity', 'High account volume makes this a strong base for SEO/GEO inbound and on-site lead capture.'],
    ['Technijian Hook', 'My SEO — local + GEO presence for clinics searching for a partner. Chat.AI — the on-site assistant that captures the inquiry.'],
  ]),
  spacer(160),

  personaCard('4 — The Workers’ Comp Case Manager', DARK_CHARCOAL, [
    ['Role', 'Case manager or adjuster inside a WC network (One Call, Homelink, MTI America, Orchid Medical, and others) who routes DME referrals.'],
    ['Pain Points', 'Needs fast status, clean documentation, and no chasing; a difficult supplier makes their job harder and slower.'],
    ['Decision Driver', 'Whichever supplier makes the referral effortless and the paperwork airtight gets the next one — and the one after that.'],
    ['AI Opportunity', 'A modern case-manager view (instant status + documents) turns a transactional channel into a repeat-referral engine.'],
    ['Technijian Hook', 'My SEO — a workers’-comp channel page naming the networks. My Dev — a fast case-manager status view that earns repeat referrals.'],
  ]),
  spacer(160),

  personaCard('5 — The Patient (Reorders & Recurring)', GOLD, [
    ['Role', 'The end user who receives the device in-visit — and, for compression, CPM, and supplies, needs reorders over time.'],
    ['Pain Points', 'Confusion about coverage and co-pay; reorders that depend on someone remembering to call.'],
    ['Decision Driver', 'Clear cost up front and an easy way to reorder — the difference between a one-time claim and recurring revenue.'],
    ['AI Opportunity', 'High-volume, lower-margin, but the front door: patients searching for covered devices are the cheapest demand to capture — if OrthoKinetix ranks and the on-site assistant converts them.'],
    ['Technijian Hook', 'My SEO/GEO — rank and get cited for the covered-device searches patients make. Chat.AI — the assistant that answers coverage questions and captures the lead.'],
  ]),
  spacer(200),

  p('Figure 5.0 maps each segment by account volume and margin / strategic value — showing which buyers are the anchor accounts to win, which are high-value niches, and which represent recurring volume.', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'OrthoKinetix Customer Segment Matrix', 580, 1.50),
  diagramCaption('Figure 5.0 — OrthoKinetix Customer Segments: Account Volume vs. Margin / Strategic Value'),
);

// ---------- 06 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  spacer(100),
  p('The orthopedic DME and stock-and-bill market spans regional specialists, manufacturer-owned programs, and national O&P chains. OrthoKinetix’s edge — 20 years of provider relationships, BOC accreditation, deep payor breadth, and both office and hospital divisions — is real but largely invisible online. Nearly every competitor sells the same way: field reps and relationships, with almost no digital or AI presence. That shared blind spot is the opportunity.'),
  spacer(140),
  buildTable(
    [
      { label: 'Competitor', weight: 2.2 },
      { label: 'Type / Market', weight: 3 },
      { label: 'Posture vs. OrthoKinetix', weight: 4 },
    ],
    [
      ['SOS Medical', 'SoCal post-op / pain / rehab + custom O&P manufacturer', 'Direct regional rival; also manufactures custom O&P — a vertical advantage to neutralize on service and speed'],
      ['Restore Motion', 'Orange County, est. 2007, operates CA / AZ / HI', 'Direct rival in the same SoCal footprint; multi-state reach'],
      ['SEE THE TRAINER', 'National Stock & Bill for large practices + hospitals', 'Direct model competitor targeting the same large-practice and hospital accounts'],
      ['DJO / Enovis', 'National manufacturer-owned stock-and-bill', 'Scale and owned product; can compete on price for its own lines'],
      ['Breg', 'National manufacturer with its own stock-and-bill programs', 'Supplier partner AND competitor — supplies OrthoKinetix yet also sells direct programs'],
      ['Hanger', 'National orthotics & prosthetics leader', 'Dominant specifically in prosthetics; less focused on broad DME stock-and-bill'],
      ['MedEx PSI', 'Orthopedic bracing & DME services', 'Model competitor in bracing and DME fulfillment'],
      ['AVORS Medical Group', 'Lancaster, CA — clinic-integrated DME', 'Regional, clinic-attached model'],
    ],
  ),
  spacer(200),
  calloutBox(
    'Where OrthoKinetix Wins — The White Space',
    [
      'Digital invisibility is universal: no competitor credibly owns Google or the AI answers for "stock and bill program California," specialty-DME partner queries, or patient coverage questions. First to build it wins compounding inbound.',
      'No one is capturing patient search demand. Patients hunt for covered braces, CPM rentals, and pumps every day; competitors leave that traffic to chance. Local SEO + GEO + on-site capture claims it.',
      'No one has modernized the workers’-comp case-manager experience — the exact relationship that drives repeat referrals.',
      'Provider acquisition is gated by field-team size everywhere. Account-based outreach that multiplies a finite team’s reach is a structural advantage competitors are not pursuing.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 BRAND & DIGITAL PRESENCE AUDIT ----------
docChildren.push(
  ...sectionHeader('Brand & Digital Presence Audit', CORE_ORANGE, '07'),
  spacer(100),
  p('For a 20-year, ~$5M company with a nationwide hospital division and dozens of payor contracts, the online presence materially under-represents the business. The quality of the operation is far ahead of how it shows up on screen — and that gap is the easiest early win.'),
  spacer(140),
  buildTable(
    [
      { label: 'Digital Asset', weight: 2.6 },
      { label: 'Current State', weight: 3.2 },
      { label: 'Gap / Opportunity', weight: 4.2 },
    ],
    [
      ['Site URL structure', 'Homepage lives at orthokinetix.net/site/ (a subfolder)', 'Move to root domain; the /site/ path hurts SEO and looks unfinished to a vetting administrator'],
      ['Brand naming', '"OrthoKinetix powered by OrthoXpress" — two names', 'Dual naming splits search authority; consolidate to one primary brand so equity compounds'],
      ['Page content depth', 'Stock & Bill and Payor Relations pages are a few sentences', 'No provider-conversion content, case studies, or specialty landing pages — the buyer can’t self-educate'],
      ['Site assets', 'Forms and PDFs dated to 2016', 'Refresh signals an active, modern operation — important when "are they still current?" is a buying question'],
      ['Provider lead capture', 'Patient appointment form only', 'No path for a provider (the actual buyer) to request a Stock & Bill consult or gated resource'],
      ['Answer-engine presence', 'Effectively none', 'No GEO content ranking in Google or cited in AI answers for the queries patients and providers actually search'],
      ['Authority / proof', 'Accreditation noted, little narrative', 'BOC Gold Seal, 20 years, payor breadth, hospital division — strong proof, barely told'],
    ],
  ),
  spacer(160),
  calloutBox(
    'The Presence Gap Is the On-Ramp',
    [
      'None of this requires rebuilding the business — only making the existing strengths visible and findable.',
      'Consolidating the brand, moving to the root domain, and publishing provider-facing authority content are low-cost moves with compounding SEO and credibility returns.',
      'These are also the natural first 90 days of the program: fix the foundation, then build the engine on top of it.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 08 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  spacer(100),
  p('Before the growth program, one thing must be clear: Technijian has already built the systems OrthoKinetix needs. The platforms below are delivered and operating for real clients — not proposals. Each maps to a specific OrthoKinetix use case, and each respects the HIPAA boundary that healthcare AI demands.'),
  spacer(160),

  capabilityBox(
    'Proven Build 1 — Multi-Agent SEO + GEO Platform',
    'Technijian operates a multi-agent platform (Claude, GPT-4o, and Gemini with MCP, plus SEMrush, GA4, and Perplexity) that produces authority content, ranks it in Google, and positions clients as the cited answer inside the AI assistants.',
    'This is the core engine: own "stock and bill program California," specialty-DME queries, and patient coverage questions in both Google search and the AI answers from ChatGPT, Perplexity, and Google AI Overviews — the SEO + GEO that gets OrthoKinetix found.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 2 — Chat.AI Conversational Capture (already in your stack)',
    'Chat.AI — which OrthoKinetix already knows — is Technijian’s enterprise AI platform. As a website assistant it answers visitor questions in natural language around the clock and hands qualified inquiries to a person.',
    'Pointed at orthokinetix.net it becomes the capture layer for SEO/GEO traffic: it answers "is this covered by my plan?" for patients and "how does Stock & Bill work?" for providers, then captures the lead — turning visits into contacts instead of bounces, with HIPAA-safe handling for anything touching patient data.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 3 — My AI Lead Gen: Account-Based Outbound',
    'My AI Lead Gen is Technijian’s productized outbound engine — harvest high-fit targets from public data, enrich and score them, and deliver outreach-ready personalized sequences — replacing the Apollo / ZoomInfo subscription tax.',
    'For the named-account track it builds the list of orthopedic practices, surgery centers, and hospitals not yet on Stock & Bill (from NPI and other public sources), with a per-account dossier for each rep visit and personalized sequences — depth on the accounts worth winning, not a blast.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 4 — AI-Native Custom App Delivery (My Dev)',
    'Technijian’s AI-native SDLC delivers custom web apps 3–5x faster than traditional development — landing pages, funnels, and integrations built around a client’s actual process.',
    'This builds the conversion layer that SEO/GEO traffic lands on: intent-matched device and Stock & Bill pages, the "Request a consult" provider funnel, source-tagged lead routing into the CRM, and the workers’-comp status view that earns repeat referrals.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 5 — AI Review & Reputation Engine',
    'Technijian built an AI review and reputation system that requests, monitors, and responds to reviews across Google and the local directories that search ranks on.',
    'Reviews and a complete Google Business Profile do double duty for OrthoKinetix: they lift the local SEO that captures patient demand, and they are exactly the third-party signals the AI assistants weigh when deciding whom to cite — trust that compounds both channels.'
  ),
);

// ---------- 09 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('The Lead Gen Engine — Capture & Convert', CORE_BLUE, '09'),
  spacer(100),
  p('The engine runs three motions at once: get found (SEO + GEO), capture and convert (an on-site Chat.AI assistant plus conversion funnels), and account-based outbound (My AI Lead Gen for the named hospitals and surgery centers). The first two capture the broad search demand at scale; the third wins the high-value accounts by name. Together they turn OrthoKinetix from invisible into the default answer — and turn that attention into booked leads and signed accounts.'),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'OrthoKinetix SEO + GEO + Lead Gen Engine', 600, 1.61),
  diagramCaption('Figure 9.0 — The Engine: Get Found (SEO/GEO), Capture & Convert, and Account-Based Outbound'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.6 },
      { label: 'Play', weight: 2.4 },
      { label: 'What It Does', weight: 3.2 },
      { label: 'Metric', weight: 1.8 },
      { label: 'Technijian Service', weight: 1.6 },
    ],
    [
      ['Get Found', 'Local + organic SEO', 'Rank for patient device + local "near me" queries', 'Organic leads / mo', 'My SEO'],
      ['Get Found', 'Provider SEO', 'Rank for "stock and bill California" + partner queries', 'Provider inquiries / mo', 'My SEO'],
      ['Get Found', 'GEO — AI citations', 'Be the source ChatGPT, Perplexity & AI Overviews quote', 'AI-answer citations', 'My SEO'],
      ['Get Found', 'Authority content + schema', 'Coverage & how-to guides with FAQPage schema', 'Indexed Q&As, rankings', 'My SEO'],
      ['Capture', 'Chat.AI site assistant', '24/7 answers + lead capture (patient & provider)', 'Visitor → lead rate', 'Chat.AI'],
      ['Capture', 'Conversion landing pages', 'Intent-matched device + Stock & Bill pages', 'Page conversion rate', 'My Dev'],
      ['Capture', 'Provider consult funnel', '"Request a Stock & Bill consult" → routed to a rep', 'Consults booked', 'My Dev'],
      ['Capture', 'Lead routing + tracking', 'Source-tagged leads into the CRM', 'Cost per lead by source', 'My Dev'],
      ['Outbound', 'My AI Lead Gen', 'Harvest named provider / hospital targets', 'Qualified accounts / mo', 'My AI Lead Gen'],
      ['Outbound', 'Account dossiers', 'Pre-visit intelligence per named practice', 'Rep meetings booked', 'My AI'],
      ['Outbound', 'Per-account sequences', 'Personalized outreach to named targets', 'New Stock & Bill accounts', 'My AI Lead Gen'],
      ['Outbound', 'WC case-manager channel', 'Status + docs that earn repeat referrals', 'Repeat WC referrals', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'SEO, GEO, and the on-site assistant get OrthoKinetix found and turn searchers into qualified leads — that is most of the work, and it is highly automatable.',
      'For the high-value hospital and surgery-center accounts, AI surfaces the right targets and arms the rep — but the in-service training, the trust, and the relationship still close the deal.',
      'That honesty is the point: the plan captures broad demand at scale and makes the named-account effort sharper, without pretending software signs a stock-and-bill contract on its own.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 10 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '10'),
  spacer(100),
  p('The model below is built from public and industry benchmarks because OrthoKinetix’s internal numbers were not available for this draft. Every figure is estimated and conservative; the discovery questions in Section 13 replace these assumptions with real baselines. The ROI logic holds at almost any reasonable input, because the two levers — new accounts won and search demand captured — are large relative to the program cost.'),
  spacer(140),
  subHeader('Projected KPI Lift (Estimated)'),
  buildTable(
    [
      { label: 'KPI', weight: 3 },
      { label: 'Estimated Current', weight: 2.4 },
      { label: 'With the Program', weight: 2.4 },
      { label: 'Direction', weight: 1.8 },
    ],
    [
      ['Organic + AI-referred traffic', 'Near zero', 'Growing monthly', 'New top of funnel'],
      ['Patient leads captured / mo', '~0 (no capture)', 'Steady inbound', 'Recurring orders'],
      ['Provider consults / mo', 'Ad hoc', 'Predictable inbound', 'New account pipeline'],
      ['GEO citations (ChatGPT, Perplexity, AI Overviews)', 'None', 'Cited for key questions', 'Durable visibility'],
      ['Visitor → lead conversion', 'No funnel', 'Funnel + Chat.AI capture', 'More from same traffic'],
      ['New Stock & Bill accounts / quarter', 'Field-team limited', 'Inbound + account-based', 'More named wins'],
    ],
  ),
  spacer(160),
  subHeader('Year-1 ROI Model (Estimated, Conservative Assumptions)'),
  buildTable(
    [
      { label: 'Model Input', weight: 3.4 },
      { label: 'Conservative', weight: 2.2 },
      { label: 'Target', weight: 2.2 },
      { label: 'Aggressive', weight: 2.2 },
    ],
    [
      ['New Stock & Bill accounts (Y1)', '+4', '+8', '+14'],
      ['Est. annual revenue per new account*', '$40,000', '$40,000', '$40,000'],
      ['Revenue from new accounts', '+$160,000', '+$320,000', '+$560,000'],
      ['Incremental patient orders from search**', '+$60,000', '+$120,000', '+$200,000'],
      [{ text: 'Total additional annual revenue', bold: true }, { text: '+$220,000', bold: true }, { text: '+$440,000', bold: true }, { text: '+$760,000', bold: true }],
      [{ text: 'Technijian Program Investment (Y1)', bold: true }, { text: '~$105,600', bold: true }, { text: '~$105,600', bold: true }, { text: '~$105,600', bold: true }],
      [{ text: 'Modeled ROI Ratio', bold: true, color: CORE_BLUE }, { text: '2.1x', bold: true, color: PASS }, { text: '4.2x', bold: true, color: PASS }, { text: '7.2x', bold: true, color: PASS }],
    ],
  ),
  spacer(60),
  p('* Placeholder per-account value pending OrthoKinetix’s actual average. ** Modeled from patient orders captured via SEO/GEO + on-site conversion; conservative against the searchable demand across five counties. All figures projected, not guaranteed.', { italics: true, size: 18 }),
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
      ['My SEO — SEO + GEO Program', 'Local + organic + GEO/AI-citation for patient & provider terms; content + FAQPage schema; brand + root-domain fix', '$2,000/mo', '$24,000'],
      ['My AI Lead Gen — Account-Based Acquisition', 'Named provider / hospital harvesting, enrichment, and personalized sequences (Professional tier)', '$3,499/mo', '$42,000'],
      ['My Dev — Capture & Funnel Build', 'Landing pages, provider consult funnel, Chat.AI assistant integration, lead routing + tracking (one-time)', '—', '$25,000'],
      ['My AI — Executive Workshop', 'One-time leadership alignment + roadmap (upfront)', '—', '$5,000'],
      ['My Dev — Managed Funnel Services', 'Hosting, monitoring, and ongoing conversion optimization', '$800/mo', '$9,600'],
      [{ text: 'YEAR-1 TOTAL INVESTMENT', bold: true }, { text: 'Recurring $6,299/mo + builds', bold: true }, { text: '', bold: true }, { text: '~$105,600', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(40),
  p('Chat.AI is already in OrthoKinetix’s stack, so it is not a line item here — the build integrates the assistant you already have as the on-site capture layer.', { italics: true, size: 18 }),
  spacer(160),
  calloutBox(
    'The Math That Matters',
    [
      'Winning just four new Stock & Bill accounts in Year 1, at an estimated $40,000 each, more than covers the full program investment on its own.',
      'Patient search demand is the cheapest demand to capture and it compounds: once OrthoKinetix ranks and gets cited, leads arrive month after month with no per-click cost.',
      'The program is phased — start with the SEO/GEO foundation and on-site capture, prove the lead flow, then scale account-based outbound — which lowers the entry point and de-risks the spend.',
    ],
    CORE_BLUE
  ),
);

// ---------- 11 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', TEAL, '11'),
  spacer(100),
  p('The roadmap runs on a 90 / 180 / 365-day cadence: get found first (the SEO/GEO foundation plus the on-site capture layer), then build the demand engine (content, citations, and the named-account target list), then scale outbound and compound what converts. Meaningful inbound is visible inside the first 90 days; the account-based outbound is given the runway it needs.'),
  spacer(200),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'OrthoKinetix 90-180-365 Day SEO GEO Lead Gen Roadmap', 600, 2.30),
  diagramCaption('Figure 11.0 — OrthoKinetix SEO · GEO · Lead Gen Program: 90 / 180 / 365-Day Roadmap'),
  spacer(160),
  subHeader('Phase 1 — Foundation: SEO/GEO (Days 1–90)', { color: CORE_BLUE }),
  p('Get the technical base right and stand up the layer that turns visits into leads.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['1.1 — SEO/GEO Foundation', 'Move the homepage to the root domain and consolidate the brand. Build the keyword + GEO-question map. Ship technical SEO, FAQPage schema, and the first priority pages — patient device pages plus the Stock & Bill page.'],
      ['1.2 — Capture Layer Live', 'Point the Chat.AI assistant at the site to answer patient and provider questions and capture leads. Launch the "Request a consult" provider funnel and source-tagged lead tracking.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 2 — Demand Engine (Days 91–180)', { color: TEAL }),
  p('Publish the content that ranks and gets cited, and build the named-account target list.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['2.1 — Content & GEO Engine', 'Authority hub publishing on a steady cadence. First Google rankings for priority terms and first AI-assistant citations for the coverage questions patients and providers ask.'],
      ['2.2 — Account Intelligence Base', 'My AI Lead Gen harvests the named provider and hospital target list (NPI + public data). First per-account dossiers delivered to the field team.'],
    ],
  ),
  spacer(160),
  subHeader('Phase 3 — Scale & Outbound (Days 181–365)', { color: CORE_ORANGE }),
  p('Scale the account-based outreach and compound what is already converting.'),
  buildTable(
    [{ label: 'Milestone', weight: 3 }, { label: 'Deliverables', weight: 7 }],
    [
      ['3.1 — Account-Based Outreach at Scale', 'Personalized sequences running across the named universe; reps supported by per-account dossiers. New Stock & Bill accounts closing.'],
      ['3.2 — Optimize & Compound', 'Double down on the queries and pages that convert. Patient reorder prompts live. ROI dashboard delivered against the Section 13 baselines.'],
    ],
  ),
);

// ---------- 12 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — Start This Week', CORE_ORANGE, '12'),
  spacer(100),
  p('Five actions OrthoKinetix can take immediately — before any Technijian engagement. Each creates value this week and leads naturally into the larger program.'),
  spacer(140),
  calloutBox('1 — Fix the Homepage URL',
    ['Set up a redirect so orthokinetix.net points to the live homepage instead of orthokinetix.net/site/. This single change improves how search engines and prospective providers perceive the site — and it costs nothing but a few minutes with whoever manages the domain.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('2 — Claim and Complete the Google Business Profile',
    ['Verify the Riverside Google Business Profile, add the full service description, hours, photos, and the Stock & Bill program. Referring practices and case managers do check — and a complete profile is free local visibility.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('3 — Write One Provider-Facing FAQ Page',
    ['Publish a single page answering the questions administrators actually ask: "How does the Stock & Bill program work?", "Who handles billing and denials?", "Which payors do you contract with?" This is the seed of the authority content that ranks in AI answers.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('4 — Add a "Provider Consult" Request to the Site',
    ['Right now the only form is for patients. Add a short "Request a Stock & Bill consult" form for providers — the buyer — so an interested practice administrator has a path to raise their hand without calling.'],
    CORE_BLUE),
  spacer(100),
  calloutBox('5 — Ask Five Long-Standing Accounts for a Testimonial',
    ['Reach out to five practices that have been with OrthoKinetix for years and ask for a short quote about what the partnership removes from their day. Provider proof is the most persuasive asset in an account-based sale — and you already earned it.'],
    CORE_BLUE),
);

// ---------- 13 QUESTIONS TO CALIBRATE THIS PLAN ----------
docChildren.push(
  ...sectionHeader('Questions to Calibrate This Plan', DARK_CHARCOAL, '13'),
  spacer(100),
  p('This blueprint was built from public information. The numbers in Sections 10 and 11 are deliberately conservative estimates — a short discovery call replaces them with OrthoKinetix’s real baselines and sharpens the entire program. These are the questions that move the model the most:'),
  spacer(140),
  buildTable(
    [
      { label: 'Topic', weight: 2.4 },
      { label: 'What We’d Confirm', weight: 4.4 },
      { label: 'Why It Matters', weight: 3.2 },
    ],
    [
      ['Web baseline', 'Current website traffic and where leads come from today', 'Calibrates the inbound traffic-and-lead model'],
      ['Lead handling', 'Who answers patient & provider inquiries now, and how fast', 'Designs the capture layer and lead routing'],
      ['Order & account value', 'Average patient order value and the annual value of a Stock & Bill account', 'Sets the two revenue lines in the ROI model'],
      ['Account growth', 'New Stock & Bill accounts per month and current sales-team size', 'Calibrates the account-based outbound scope'],
      ['Systems', 'Website platform (WordPress?) and the CRM in use', 'Defines the integration surface for funnels + tracking'],
      ['Hospital division', 'Number of hospital accounts and states served', 'Scopes the national vs. regional balance of the program'],
      ['Recurring revenue', 'Current patient reorder rate for compression / CPM / supplies', 'Baselines the recurring-revenue opportunity'],
      ['Marketing', 'Who owns web/marketing today and any current ad spend', 'Determines where the SEO/GEO work plugs in'],
      ['Brand', 'Is "OrthoXpress" vs. "OrthoKinetix" intentional, or consolidate?', 'Decides the brand and domain strategy in Phase 1'],
      ['Leadership', 'Confirm leadership names and titles', 'So the final document and outreach are exactly right'],
    ],
  ),
  spacer(160),
  calloutBox(
    'How to Use This Section',
    [
      'None of these questions block starting — the Quick Wins and the Phase 1 foundation proceed regardless.',
      'A single 30-minute call answers most of them and lets Technijian return a calibrated ROI model and a fixed-scope Statement of Work.',
      'The goal is a plan built on OrthoKinetix’s real numbers — not on our conservative estimates.',
    ],
    TEAL
  ),
);

// ---------- 14 WHAT HAPPENS NEXT ----------
docChildren.push(
  ...sectionHeader('What Happens Next', DARK_CHARCOAL, '14'),
  spacer(100),
  p('OrthoKinetix has the hard things already: two decades of provider relationships, accreditation, payor breadth, and both office and hospital divisions. What it does not yet have is visibility — in Google and in the AI answers — and a way to capture the demand that visibility creates. Both are buildable today, on systems Technijian has already delivered.'),
  p('The opportunity is concrete: patients and providers are already searching for what OrthoKinetix sells, and a focused SEO + GEO + lead-generation program turns that searching into captured leads and, for the high-value accounts, into signed Stock & Bill contracts. It captures broad demand at scale and sharpens the named-account effort — without pretending software replaces the rep who closes the deal.'),
  spacer(160),
  calloutBox(
    'Recommended Next Steps',
    [
      'Step 1: A 30-minute discovery call to answer the Section 13 questions and confirm program scope.',
      'Step 2: Technijian returns a calibrated ROI model and a fixed-scope Statement of Work within 5 business days.',
      'Step 3: Phase 1 kickoff — brand / URL fix, the SEO/GEO foundation, and the Chat.AI capture layer (HIPAA-safe) — live inside 14 days of signature.',
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
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to be the answer when patients and providers search?', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
);

// ---------- 15 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '15'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We build and operate the AI systems that help regional businesses compete at scale — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'What It Delivers for OrthoKinetix', weight: 5 }],
    [
      ['My SEO', 'Local + organic SEO and GEO — ranking in Google and getting cited by the AI assistants — plus the authority content and brand / root-domain fix that make OrthoKinetix findable to patients and providers'],
      ['My AI Lead Gen', 'Account-based outbound that harvests, enriches, and sequences the named providers and hospitals worth winning — supporting the field team, not replacing it'],
      ['My Dev', 'Custom, AI-native builds — conversion landing pages, the provider consult funnel, Chat.AI capture integration, lead routing, and the workers’-comp status view'],
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
  p('Market and company intelligence gathered via public web research conducted May 21, 2026. Firmographic details (founding year, employee count, revenue estimate, leadership) are third-party-sourced and to be confirmed with OrthoKinetix before external use.', { italics: true }),
  spacer(120),
  p('1. OrthoKinetix — official website: orthokinetix.net/site/ (Home, About Us, Stock and Bill Program, Payor Relations, Insurances, Direct Lines)', { size: 20 }),
  p('2. OrthoKinetix — Stock and Bill Program: orthokinetix.net/site/stock-and-bill-program/', { size: 20 }),
  p('3. OrthoKinetix — Payor Relations: orthokinetix.net/site/payor-relations/', { size: 20 }),
  p('4. OrthoKinetix — Insurances / contracted payors: orthokinetix.net/site/insurances/', { size: 20 }),
  p('5. OrthoXpress / OrthoKinetix — RocketReach firmographic profile (founding year, employees, revenue, leadership)', { size: 20 }),
  p('6. OrthoXpress / OrthoKinetix — LinkedIn company profile', { size: 20 }),
  p('7. Stock-and-bill model & regulatory context — Medtrade, Breg white paper, DME industry sources', { size: 20 }),
  p('8. Competitors — SOS Medical (sosmedical.net), Restore Motion (restoremotiondme.com), SEE THE TRAINER, DJO/Enovis, Breg, Hanger, MedEx PSI (medexpsi.com), AVORS Medical Group', { size: 20 }),
  p('9. Medicare DMEPOS supplier standards — CMS / Palmetto GBA; CMS-846 & CMS-847 forms — Noridian', { size: 20 }),
  p('10. Technijian service pricing — My SEO, My AI Lead Gen, My Dev, Chat.AI rate cards; Technijian SEO + GEO strategy methodology', { size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'OrthoKinetix-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
