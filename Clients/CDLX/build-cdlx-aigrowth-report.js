// CardLogix (CDLX) — AI-Driven Business Development Blueprint
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern: technijian-biz-dev-blueprint skill (RKE/ORX/SCF/CBI lineage). ABM motion.
// NOTE: separate from build-cdlx-report.js (the CloudHSM analysis) — do not conflate outputs.

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
const PURPLE        = '7B2D8B';
const GOLD          = 'C9922A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (name) => fs.existsSync(path.join(DIAGRAMS_DIR, name)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, name)) : null;
const DIAGRAM_PERSONAS_BUF    = dbuf('personas.png');
const DIAGRAM_COMPETITIVE_BUF = dbuf('competitive.png');
const DIAGRAM_ARCH_BUF        = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF    = dbuf('timeline.png');

const TODAY = '2026-05-30';
const CLIENT = 'CardLogix';

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

function leadBullet(lead, body) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [
      new TextRun({ text: lead, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }),
      new TextRun({ text: body, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  });
}

function numberedSteps(items) {
  return items.map((t, i) => new Paragraph({
    spacing: { before: 30, after: 70, line: 300 },
    indent: { left: 520, hanging: 520 },
    children: [
      new TextRun({ text: `${i + 1}.`, size: 22, bold: true, color: CORE_BLUE, font: FONT_HEAD }),
      new TextRun({ text: '\t', size: 22, font: FONT_BODY }),
      new TextRun({ text: t, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  }));
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
      const fill = cellObj.fill || (zebra && ri % 2 === 1 ? OFF_WHITE : WHITE);
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
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'How This Applies to CardLogix: ', size: 20, bold: true, color: CORE_ORANGE, font: FONT_HEAD }), new TextRun({ text: applies, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
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
function ctaBanner(lines) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
      borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: lines.map((ln, i) => new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: i < lines.length - 1 ? 90 : 0 },
        children: [new TextRun({ text: ln.text, size: ln.size || 22, bold: ln.bold || false, color: WHITE, font: ln.bold ? FONT_HEAD : FONT_BODY })],
      })),
    })]})],
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI-Driven Business Development Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  CONFIDENTIAL  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'CARDLOGIX', size: 64, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'AI-Driven Business Development Blueprint', size: 36, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Two tracks: your own IT, and a phishing-resistant MFA channel partnership', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(160),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for CardLogix Corporation', size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Irvine, California — neighbors in the Spectrum', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(520),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for CardLogix. Projections are estimated and calibrate to real figures after a discovery call.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: false, headingStyleRange: '1-2' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '1998', label: 'CardLogix building secure credentials', color: CORE_BLUE },
    { number: '3 waves', label: 'MFA mandates: federal → state/local → private (insurance)', color: CORE_ORANGE },
    { number: '2', label: 'Tracks: your own IT + a channel partnership', color: TEAL },
    { number: '5 min', label: 'Apart in the Irvine Spectrum', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('CardLogix makes the credentials that secure identity — PIV cards, FIDO2 smart cards, FRAC cards for first responders, and the BIOSID biometric kits behind them. Since 1998, from Irvine, it has shipped NIST-certified, GSA-approved hardware through a network of integrators and resellers. The hardware is excellent. What sits around the hardware — the managed IT that runs CardLogix internally, and the managed-services delivery that an end agency needs to actually put those cards to work — is where this blueprint focuses.'),
  p('This document is deliberately built on two tracks, because CardLogix presents two distinct, real opportunities. The first is close to home: CardLogix runs its own IT with a small internal team and has weighed co-managed support before. The second is strategic: a regulatory shift has made CardLogix’s core products mandatory for an entire market — and that market needs a managed-services partner CardLogix does not currently bring to the table.'),
  p('Track A is CardLogix’s own environment — a co-managed IT engagement sized to a lean team, where Technijian extends coverage and senior expertise without displacing the person who runs IT today. Track B is a channel partnership: CardLogix supplies the phishing-resistant credentials, and Technijian wraps the managed IT, security operations, compliance program, and certificate authority around them for the customers who must now meet MFA requirements — law-enforcement agencies under CJIS first, and increasingly private companies pushed by their cyber-insurers. AI runs underneath both — as account intelligence, audit-evidence automation, and authority content aimed at the specific buyers each track serves.'),
  spacer(100),
  calloutBox(
    'The Core Opportunity',
    [
      'Track A (your IT): a co-managed engagement sized to CardLogix’s footprint — we assume roughly 6 managed workstations and 2 servers today — a card manufacturer’s headcount typically spans production and floor roles beyond the managed-desktop fleet, and the exact count firms up at the free assessment — senior coverage and after-hours help that extends your internal team, priced to be an easy first step rather than an enterprise retainer.',
      'Track B (the partnership): MFA has gone from recommended to required in three waves — federal, then state/local and law enforcement (CJIS, mandatory since October 1, 2024), and now private companies pushed by cyber-insurance renewals. CardLogix’s cards satisfy that requirement; what customers still need is a partner to deploy and run them — the role Nick indicated CardLogix wants Technijian to play (subject to Goulet/Hope sign-off).',
      'AI is the layer under both tracks — account intelligence on named agencies and integrators, AI-assisted compliance evidence, and authority content for the exact questions CJIS buyers ask. This is account-based by design, not broad lead generation.',
    ],
    CORE_ORANGE
  ),
  p('This blueprint follows our conversation on May 29, 2026. In that call, Nick Schooler confirmed the managed-MFA / certificate-authority offering is a service CardLogix wants to extend to its own customers with Technijian delivering it — so Track B below is grounded in a real, stated intent, not a cold pitch. The figures remain estimates pending discovery, but the direction is the client’s, not ours alone.', { spaceBefore: 60 }),
  p('An honest note up front, carried throughout this document: Technijian has built deep practices in eight compliance frameworks, but CJIS is not yet one of them. We treat CJIS as a near-term build — closely adjacent to the CMMC practice we already run — and a partnership with CardLogix is exactly the trigger that would justify standing it up. We do not claim CJIS delivery experience we have not earned.', { italics: true, size: 20, spaceBefore: 60 }),
);

// ---------- 02 WHERE GROWTH COMES FROM ----------
docChildren.push(
  ...sectionHeader('Where the Growth Comes From — Two Tracks', TEAL, '02'),
  spacer(100),
  p('Before any tactics, one question shapes the whole plan: where does the next dollar of value actually come from? For CardLogix there are two answers, and they are different enough that the program treats them as separate tracks running in parallel — one fast and close to home, one strategic and built over a few quarters.'),
  spacer(120),
  buildTable(
    [
      { label: '', weight: 1.6 },
      { label: 'Track A — CardLogix’s Own IT', weight: 3.4 },
      { label: 'Track B — CJIS / MFA Partnership', weight: 3.4 },
    ],
    [
      [{ text: 'What it is', bold: true }, 'Co-managed IT for a lean internal team (about 5–6 workstations and 2 servers)', 'A channel partnership: CardLogix supplies the credentials, Technijian wraps managed IT, SOC, and CJIS-compliance around them for agency end-customers'],
      [{ text: 'Who decides', bold: true }, 'Nick Schooler can champion and likely sign', 'Sebastien Goulet (CEO) and Tom Hope (Sales) — Nick warms the door'],
      [{ text: 'Time to value', bold: true }, 'Weeks, once scope is agreed', 'A few quarters — needs at least one joint pilot'],
      [{ text: 'Confidence', bold: true }, 'High — this is what co-managed IT is built for', 'Nick expressed strong interest in our 2026-05-29 conversation in offering this as a joint, customer-facing service — subject to Goulet/Hope sign-off; a pilot proves delivery'],
      [{ text: 'Where AI fits', bold: true }, 'Operational automation, monitoring, knowledge capture', 'Account intelligence, compliance-evidence automation, authority content'],
    ],
  ),
  spacer(160),
  calloutBox(
    'Two Tracks, One Relationship',
    [
      'Track A is the land: a small, well-scoped co-managed engagement that solves a real internal pain and proves how Technijian works — neighbors who answer the phone, not an offshore queue.',
      'Track B is the expansion: a partnership where CardLogix’s hardware and Technijian’s managed-services wrap together become a complete answer for CJIS-bound agencies — a story neither side tells alone today.',
      'They are sequenced on purpose. Track A earns the trust and the working rhythm; Track B is the larger, slower prize that the working relationship makes credible.',
    ],
    CORE_BLUE
  ),
);

// ---------- 03 THE MARKET SHIFT BEHIND TRACK B ----------
docChildren.push(
  ...sectionHeader('The Market Shift Behind the Partnership', CORE_BLUE, '03'),
  spacer(100),
  p('The partnership exists because of a real demand wave that Nick described directly in our conversation — and it is wider than law enforcement. Strong multi-factor authentication moved from "recommended" to "required" in three waves, each pulling a new segment of the market toward exactly the kind of credential CardLogix makes.'),
  spacer(60),
  leadBullet('Wave 1 — Federal. ', 'Federal agencies were required to implement multi-factor authentication first (roughly three years ago), establishing PIV / smart-card credentials as the government standard.'),
  leadBullet('Wave 2 — State & local. ', 'The requirement flowed down to state and local government — and, for law enforcement specifically, the FBI’s CJIS Security Policy 5.9.5 made MFA mandatory for access to criminal-justice information as of October 1, 2024, with version 6.0 (December 2024) tightening it toward phishing-resistant methods.'),
  leadBullet('Wave 3 — Private sector (the big one). ', 'Now private companies are being pulled in — not by a government rule, but by their insurers: renewing ransomware / cybersecurity insurance increasingly requires MFA to be in place. That makes the addressable market far larger than agencies alone.'),
  spacer(80),
  p('There is a second shift inside the first: which kind of MFA counts. As Nick put it, many organizations rely on Cisco Duo or Okta with codes pushed to phones — and phones get compromised, with the added headache of whether the device is company-owned or personal. Phishing-resistant, hardware-bound credentials are the durable answer, and CardLogix’s reasoning is simple: in these environments people already carry a badge, so the credential rides on something they already have. PKI smart cards and FIDO2 satisfy the strongest requirements where phone-based one-time codes no longer do — and that is precisely the CardLogix product line (PIV, FIDO2, FRAC).'),
  spacer(80),
  p('The implication is the same across all three waves. Whether it is a small police department under CJIS or a private company satisfying its insurer, the buyer often has thin or outsourced IT and limited capacity to deploy and operate the solution. The credential is necessary but not sufficient: it must be issued, bound to an identity, integrated with the customer’s directory (for example certificate-based authentication into Microsoft Entra ID, working alongside — not bypassing — Microsoft’s own MFA), and operated with logging, access control, incident response, and audit around it. That operational wrap is the gap — and it is what CardLogix asked Technijian to fill.'),
  spacer(120),
  calloutBox(
    'Why CardLogix Cannot Capture This Alone',
    [
      'CardLogix sells through integrators and resellers — it makes and programs the cards, but does not deliver the customer’s managed IT, security operations, ongoing compliance, or the certificate authority behind the credential.',
      'The larger incumbent, HID Global, wins partly because it can point to a full ecosystem around the credential. CardLogix’s competitive gap is not the card; it is the absence of a managed-services partner it can hand off to.',
      'Technijian can be that partner on the channel side — turning "buy our card" into "we will stand up and run the secure, compliant environment your card lives in, including the certificate authority." That is a stronger, jointly-owned offer that works for an LE agency under CJIS and for a private company satisfying its cyber-insurer alike.',
    ],
    CORE_ORANGE
  ),
  p('Honesty matters here as much as ambition. Technijian’s My Compliance practice supports eight frameworks today — HIPAA, SOC 2, PCI-DSS, CMMC/DFARS, GDPR/CCPA, NIST CSF, CIS Controls, and ISO 27001. CJIS is not yet among them. The reason this is still credible is adjacency: CJIS shares control families, an evidence model, and an audit posture with CMMC, which Technijian already runs on a foundation of Microsoft Entra ID, Microsoft Defender, conditional access, insider-risk monitoring, and documented IT operations. A CardLogix partnership is exactly the reason to formalize a CJIS wrapper on top of that foundation. This document positions CJIS as a near-term capability to build together, never as a track record to claim.', { spaceBefore: 60 }),
  spacer(120),
  subHeader('The CJIS Practice Build — A Dated Plan, Not a Promise'),
  p('Because "we’ll build it" is not something Nick can take to Goulet, here is the actual plan — mapped onto the CMMC foundation already in place, timed to the first joint pilot rather than left open-ended:'),
  spacer(40),
  leadBullet('Month 1 — Control mapping. ', 'Map the CJIS Security Policy (v5.9.5 / 6.0) control families onto the existing CMMC control set and the Entra ID + Defender + conditional-access stack we already operate; produce the CJIS gap map (the free Nexus Assess seeds this).'),
  leadBullet('Month 2 — Evidence + policy. ', 'Stand up the CJIS evidence model and the policy/procedure set; configure logging, access control, and incident-response artifacts to CJIS requirements.'),
  leadBullet('Month 3 — Mock audit on the pilot. ', 'Run the first joint LE-agency pilot under the wrapper and dry-run a CJIS audit against it — the reusable proof point for every deal after.'),
  leadBullet('Ongoing — Formalize + staff. ', 'Promote the wrapper to a standing CJIS practice inside My Compliance, with CJIS-trained, US-based, background-screened personnel on any CJI-touching work.'),
  p('It is a build measured in months, not years, and the partnership is what triggers it — but the path, the owner, and the milestones are concrete, not aspirational. CJIS work is scoped to the first pilot before any multi-agency commitment, and every CJI-touching task is handled by US-based, background-screened staff.', { size: 18, italics: true, spaceBefore: 40 }),
);

// ---------- 04 THE BUYER MAP ----------
docChildren.push(
  ...sectionHeader('The Buyer Map', CORE_ORANGE, '04'),
  spacer(100),
  p('This is an account-based opportunity, not a broad market. The people who move it are a small, nameable set — inside CardLogix for both tracks, and across a finite group of agencies and integrators for the partnership. The map below orders them by influence and by how ready each is to engage now, so effort goes where it converts.'),
  spacer(160),

  personaCard('1 — Nick Schooler · Business Development', CORE_BLUE, [
    ['Role', 'CardLogix’s business-development lead and, today, the person who runs internal IT. Technical, deeply versed in smart-card technology.'],
    ['What He Feels', 'The toil of running IT solo for a growing shop — after-hours issues, patching, user provisioning, second-pair-of-eyes on anything unusual.'],
    ['Decision Driver', 'Track A that removes work without taking away his control; a partnership idea he can champion without overcommitting his executives.'],
    ['Where AI Helps', 'Operational automation and monitoring on Track A; account intelligence he can put in front of Goulet and Hope on Track B.'],
    ['Technijian Hook', 'My IT (Co-Managed) for his environment; a tight partnership concept he can carry upward when he is ready.'],
  ]),
  spacer(160),

  personaCard('2 — Sebastien Goulet · Chairman & CEO', CRITICAL, [
    ['Role', 'Final decision-maker for any partnership-level commitment. Not in the first conversation; reached through Nick.'],
    ['What He Cares About', 'Whether a partnership wins more agency deals and strengthens CardLogix against HID — without diluting the brand or adding overhead.'],
    ['Decision Driver', 'A credible, low-risk path to a joint go-to-market with proof, not a slide deck of promises.'],
    ['Where AI Helps', 'Evidence: a modeled view of the pipeline a managed-services wrap opens, grounded in the CJIS mandate and named target agencies.'],
    ['Technijian Hook', 'The partnership concept — earned after Track A shows Technijian executes.'],
  ]),
  spacer(160),

  personaCard('3 — Tom Hope · Director of Sales', CORE_ORANGE, [
    ['Role', 'Owns CardLogix’s commercial relationships and channel. Central to making a co-sell motion real.'],
    ['What He Cares About', 'Whether the partnership helps his integrators close, shortens sales cycles, and answers the "who runs it after we sell it?" objection.'],
    ['Decision Driver', 'A repeatable co-sell play his channel can actually use, not a one-off.'],
    ['Where AI Helps', 'Trigger monitoring on agency grant cycles and audit deadlines; per-account dossiers his team and integrators can act on.'],
    ['Technijian Hook', 'My AI account-intelligence engine feeding the channel; joint enablement material.'],
  ]),
  spacer(160),

  personaCard('4 — The LE Agency IT Director (Joint End-Customer)', TEAL, [
    ['Role', 'The person inside a police department, sheriff’s office, or agency responsible for meeting CJIS and keeping officers working.'],
    ['What They Feel', 'A mandate they must meet, thin internal IT, and uncertainty about how to deploy and operate phishing-resistant MFA.'],
    ['Decision Driver', 'A single accountable partner who delivers the cards and runs the compliant environment around them.'],
    ['Where AI Helps', 'Authority content that answers their exact CJIS questions; AI-assisted onboarding and audit-evidence packs.'],
    ['Technijian Hook', 'The joint CardLogix + Technijian offer: hardware plus a managed, CJIS-aligned environment.'],
  ]),
  spacer(160),

  personaCard('5 — The Prime Integrator / Reseller (Channel Partner)', PURPLE, [
    ['Role', 'The integrators and resellers CardLogix already sells through (the channel that reaches agencies).'],
    ['What They Care About', 'Closing more agency deals and not owning the managed-IT obligation themselves.'],
    ['Decision Driver', 'A managed-services partner they can attach to a card sale to complete the offer.'],
    ['Where AI Helps', 'Shared account intelligence and co-branded authority content that lifts the whole channel.'],
    ['Technijian Hook', 'Technijian as the named managed-services partner in the channel motion.'],
  ]),
  spacer(200),

  p('Figure 4.0 maps each buyer by influence over the opportunity and readiness to engage now — showing whom to warm first (Nick), whom to reach through him (Goulet, Hope), and whom the partnership activates (agencies and integrators).', { italics: true }),
  spacer(60),
  diagramImage(DIAGRAM_PERSONAS_BUF, 'CardLogix Joint Go-to-Market Buyer Map', 470, 1.553),
  diagramCaption('Figure 4.0 — The Joint Go-to-Market Buyer Map: Account Influence vs. Deal Readiness'),
);

// ---------- 05 COMPETITIVE LANDSCAPE ----------
docChildren.push(
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '05'),
  spacer(100),
  p('The question for the partnership is not who makes the best card — CardLogix competes well there. It is who can offer an agency the complete answer: the credential plus the managed environment around it. Seen that way, the landscape has an obvious open lane.'),
  spacer(140),
  buildTable(
    [
      { label: 'Vendor', weight: 1.8 },
      { label: 'Position', weight: 2.4 },
      { label: 'Relevant to the Partnership', weight: 4.2 },
    ],
    [
      ['HID Global', 'The incumbent; full identity ecosystem', 'Wins partly on a complete ecosystem around the credential. A CardLogix + Technijian managed-services wrap is the most direct answer to that advantage.'],
      ['Identiv', 'Hirsch uTrust FIDO2 (CardLogix resells this)', 'A partner-and-peer overlap; underlines that hardware alone is increasingly commoditized — the managed wrap is the differentiator.'],
      ['Tx Systems', 'CJIS-focused smart-card distributor', 'Competes for the same channel position; does not bring a managed-IT/SOC delivery arm.'],
      ['Yubico', 'YubiKey FIDO2 — the volume MFA pick', 'Many buyers choose YubiKey to satisfy MFA cheaply, without PIV depth. CardLogix wins on credentialing-grade depth; the partnership wins on delivery.'],
      ['Phone-based MFA (Cisco Duo, Okta)', 'The incumbent being displaced', 'The real status quo for most customers: one-time codes pushed to phones. Phones get compromised, and company-vs-personal device ownership is a headache. The phishing-resistant credential — riding the badge people already carry — is the upgrade path, and the joint offer is how it gets deployed.'],
      [{ text: 'CardLogix + Technijian', bold: true, color: CORE_BLUE }, { text: 'Hardware + managed credential environment', bold: true, color: CORE_BLUE }, { text: 'Credentialing-grade cards plus a single accountable partner to deploy and operate them — including the certificate authority — an offer no card maker on this list delivers on the channel side today.', color: CORE_BLUE }],
    ],
  ),
  spacer(160),
  diagramImage(DIAGRAM_COMPETITIVE_BUF, 'Competitive Positioning Map', 600, 1.544),
  diagramCaption('Figure 5.0 — Positioning: credentialing-grade hardware depth vs. managed-services / CJIS-IT ecosystem depth'),
  spacer(120),
  calloutBox(
    'The White Space',
    [
      'No card maker in CardLogix’s peer set delivers the managed-IT, security-operations, and CJIS-compliance wrap on the channel side. That is open ground.',
      'CardLogix already owns the hard part — NIST-certified, GSA-approved, credentialing-grade hardware with 28 years behind it. The missing piece is operational delivery, not product.',
      'A partnership claims that white space first: "buy the card, and the environment it lives in is already handled." It is the answer to the one objection that sends deals to HID.',
    ],
    CORE_BLUE
  ),
);

// ---------- 06 TECHNIJIAN CAPABILITY PROOF ----------
docChildren.push(
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '06'),
  spacer(100),
  p('Before any pitch, one thing should be clear: Technijian has already built the operational pieces both tracks require. The capabilities below are delivered and operating — not proposals. Each maps to a specific CardLogix use case. Where a capability is adjacent rather than built (CJIS), this section says so plainly.'),
  spacer(160),

  capabilityBox(
    'Proven Build 1 — Co-Managed IT for Lean Internal Teams (My IT)',
    'Technijian runs a co-managed model that extends a client’s internal IT: after-hours and overflow help desk, shared monitoring, ticketing and documentation, senior architects on demand, and shared security and compliance ownership.',
    'This is Track A, directly. It fits a shop where one capable person runs IT and needs coverage and senior depth without giving up control — exactly CardLogix’s current internal situation.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 2 — Managed Security Operations (My Security)',
    'Technijian operates a 24/7 security program — monitoring and response, endpoint detection, SIEM, MFA-everywhere, and conditional access — built on Microsoft Entra ID and Microsoft Defender.',
    'This is the security half of the CJIS wrap. The same controls an agency needs for the CJIS Security Policy — access control, logging, incident response — are the ones Technijian already runs for other regulated clients.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 3 — Multi-Framework Compliance Practice (My Compliance)',
    'Technijian delivers managed compliance across eight frameworks, including CMMC/DFARS for defense-adjacent clients — control mapping, evidence collection, and audit readiness as an ongoing service.',
    'CMMC is the closest neighbor to CJIS: shared control families, the same evidence discipline, the same audit posture. The CJIS practice is a near-term extension of this proven model — built for the partnership, not claimed as existing.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 4 — AI Document Intelligence (RFPs and Evidence: days to minutes)',
    'Technijian built an AI document-intelligence capability that turns proposal- and evidence-heavy work from days into minutes, with model peer-review to keep output accurate.',
    'On Track B this becomes AI-assisted CJIS audit-evidence packs and faster grant- and RFP-response drafting for joint agency deals — the paperwork that otherwise slows a small agency’s compliance to a crawl.'
  ),
  spacer(140),
  capabilityBox(
    'Proven Build 5 — My AI Lead Gen: Account-Based Intelligence',
    'My AI Lead Gen is Technijian’s account-based engine — it builds target lists from public data, enriches and scores them, and produces per-account dossiers and personalized outreach, replacing the data-subscription tax.',
    'For the partnership it identifies and profiles named agencies (by region, size, and CJIS-deadline exposure) and the integrators that serve them — turning CardLogix’s channel into a targeted, intelligence-led motion rather than a broad campaign.'
  ),
  spacer(200),
  subHeader('Representative Engagements — Work Like Yours'),
  p('Capability statements matter less than what we actually do for companies your size. Two recent engagements map closely to CardLogix’s own environment — a lean team, an on-prem footprint, the identity-and-server modernization that sits underneath Track A. They are described by scope and effort and fully anonymized; we are glad to arrange a reference conversation at the right stage.'),
  spacer(120),
  capabilityBox(
    'Engagement — On-Prem Active Directory → Microsoft Entra ID (21-user firm)',
    'A four-phase migration for a 21-desktop business off aging on-premise Active Directory to cloud identity (Microsoft Entra ID): evaluation of the existing AD, a tailored cloud-identity design (roles, policies, access levels), automated migration of all user accounts and profiles to minimize downtime, and safe decommissioning of the old domain controller. Scoped at ~50 hours.',
    'This is the exact identity foundation the MFA conversation rests on — the same Entra ID layer your certificate-based and FIDO2 authentication plugs into. A close analog to standing up a clean, cloud-anchored identity base before layering phishing-resistant credentials on top.'
  ),
  spacer(140),
  capabilityBox(
    'Engagement — Server 2012→2022 + Hyper-V→ESXi Modernization (2-host)',
    'A staged modernization of a two-host virtualization environment: assessment and migration plan, an on-site loaner ESXi server to build and migrate onto with zero data loss, host-by-host upgrade (HV01 then HV02) with VMs live-migrated across the pair, then load-balancing and removal of the loaner. Scoped at ~84 hours, sequenced so the business kept running throughout.',
    'CardLogix runs roughly this shape — about two servers carrying the load. It shows the disciplined, no-downtime way Technijian modernizes a small server footprint, which is precisely the work the co-managed engagement (Track A) absorbs.'
  ),
);

// ---------- 07 AI GROWTH ENGINE ----------
docChildren.push(
  ...sectionHeader('The AI Growth Engine', CORE_BLUE, '07'),
  spacer(100),
  p('The engine runs three motions, and because this is an account-based opportunity, every motion is aimed at named buyers rather than a broad funnel. AI sits underneath the human relationship layer — it surfaces the right agencies, arms the conversation, and automates the evidence — but the trust between CardLogix, Technijian, and an agency is still what closes a deal. Stating that plainly is the point.'),
  spacer(60),
  p('This is not theoretical for us. Our own My AI Lead Gen engine — the same account-intelligence approach proposed here — runs on public-data pipelines that have cut prospecting effort by roughly 80% and brought cost-per-qualified-lead under $3, a 3–5× pipeline-velocity gain over manual research. We would point that engine at the named-agency universe CardLogix sells into.', { spaceBefore: 0 }),
  spacer(160),
  diagramImage(DIAGRAM_ARCH_BUF, 'CardLogix AI Growth Engine', 600, 2.365),
  diagramCaption('Figure 7.0 — The Engine: Inbound authority, Outbound account intelligence, Internal evidence — feeding one joint pipeline'),
  spacer(160),
  buildTable(
    [
      { label: 'Motion', weight: 1.5 },
      { label: 'Play', weight: 2.4 },
      { label: 'What It Does', weight: 3.3 },
      { label: 'Metric', weight: 1.7 },
      { label: 'Service', weight: 1.5 },
    ],
    [
      ['Inbound', 'Authority / AEO content', 'Answer the exact CJIS, PIV, and FIDO2 questions agency IT teams ask — so the partnership is the cited expert', 'AI-answer citations', 'My SEO'],
      ['Inbound', 'Co-branded content', 'Joint material with integrators that lifts the whole channel', 'Channel-sourced inquiries', 'My SEO'],
      ['Outbound', 'Account intelligence', 'Identify and profile named agencies by region, size, CJIS exposure', 'Qualified accounts', 'My AI Lead Gen'],
      ['Outbound', 'Trigger monitoring', 'Watch grant cycles, audit deadlines, leadership changes on named targets', 'Timed outreach events', 'My AI'],
      ['Outbound', 'RFP / grant drafting', 'Auto-draft responses for joint agency opportunities', 'Time-to-response', 'My AI'],
      ['Internal', 'CJIS evidence packs', 'AI-assisted audit evidence and control mapping', 'Audit-prep hours saved', 'My Compliance'],
      ['Internal', 'Knowledge graph', 'CJIS policy mapped against each agency’s controls', 'Reusable control maps', 'My AI'],
      ['Internal', 'Card-lifecycle automation', 'Provisioning, binding, and renewal workflow around issuance', 'Issuance cycle time', 'My Dev'],
    ],
  ),
  spacer(120),
  calloutBox(
    'The Honest Boundary',
    [
      'Inbound authority content and internal evidence automation are highly automatable — AI does most of that work, and it compounds over time.',
      'Outbound account intelligence makes the human outreach sharper and better-timed, but the relationship with each agency — and the executive relationship between CardLogix and Technijian — is what signs the deal.',
      'The plan is built to be truthful about that line. AI multiplies a small team’s reach and removes the paperwork drag; it does not pretend software wins an agency contract on its own.',
    ],
    DARK_CHARCOAL
  ),
);

// ---------- 08 BUSINESS IMPACT & SERVICE INVESTMENT ----------
docChildren.push(
  ...sectionHeader('Business Impact & Service Investment', CORE_BLUE, '08'),
  spacer(100),
  p('The pricing below is built land-and-expand: a small, easy-to-approve entry that solves a real problem now (Track A), and a clearly-labeled later expansion that builds the partnership engine once the working relationship is proven (Track B). The managed-IT and labor figures are drawn from Technijian’s current 2026 rate card — real published rates, not round-number guesses — and are calibrated to a firm quote after the free assessment. The figures most sensitive to your environment are CardLogix’s actual endpoint count and the number it walked from on the prior co-managed conversation; the discovery questions in Section 11 pin those down.'),
  spacer(140),
  subHeader('The Managed Certificate Authority — the Technical Anchor'),
  p('In our conversation Nick asked specifically what Technijian recommends for the certificate authority (CA) behind the credentials — the system that issues and signs them. This is the technical heart of the partnership offer, and Technijian has already done the engineering work on it. The short version: rather than keep the CA key in software on a Windows server (where a breach exposes it), the CA key is generated inside a dedicated, FIPS-validated cloud Hardware Security Module (HSM) and designed to be non-exportable — it stays in tamper-resistant hardware rather than living on a server an attacker can copy. Because the existing key may already be exposed, the right move is to stand up a fresh CA in the HSM rather than migrate the old one. Indicative cost runs roughly $2,000–$4,000/mo for the HSM-backed CA infrastructure depending on cloud and redundancy (detailed, with the AWS-vs-Azure recommendation, in the companion CloudHSM analysis); on the partnership model CardLogix resells it and Technijian operates it.'),
  p('Technijian has prepared a companion deliverable — the CardLogix Managed-PKI / Cloud HSM analysis — that compares AWS CloudHSM and Microsoft Azure Cloud HSM on cost, fit, and implementation, with a working commercial model where CardLogix resells the service and Technijian implements and operates it. That document holds the cost tables and step-by-step build; it is kept separate from this strategy on purpose, because its provider pricing is list-price-current and will be validated at quote time. For this blueprint, the point is simpler: the managed CA is a real, costed, deliverable service that becomes the technical anchor of the Track-B expansion — offered per customer on AWS, Azure, or Google to match whichever cloud they already run.', { spaceBefore: 0 }),
  spacer(140),
  subHeader('The Entry — Track A (the easy yes)'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'Scope', weight: 4 },
      { label: 'Est. Monthly', weight: 1.4, align: AlignmentType.RIGHT },
      { label: 'Est. Y1', weight: 1.6, align: AlignmentType.RIGHT },
    ],
    [
      ['My IT — Co-Managed', 'Managed-services stack (endpoint security, patching, monitoring, image backup) for ~6 workstations + 2 servers, plus a monthly block of co-managed senior support — billed per Technijian’s 2026 managed-services schedule. Ad-hoc / project work beyond the block at the labor rates below.', { text: '~$1,200', align: AlignmentType.RIGHT }, { text: '~$14,400', align: AlignmentType.RIGHT }],
      ['My SEO — Tier 3 (authority content)†', 'GEO/authority content on the MFA, CJIS, and smart-card questions buyers ask; foundation for the partnership’s inbound presence', { text: '$1,000', align: AlignmentType.RIGHT }, { text: '$12,000', align: AlignmentType.RIGHT }],
      ['My AI — Readiness Workshop', 'One-time executive workshop (CTO-advisory hours) to map the joint go-to-market and the CJIS-practice build path', { text: '—', align: AlignmentType.RIGHT }, { text: '~$5,000', align: AlignmentType.RIGHT }],
      [{ text: 'ENTRY PROGRAM (Y1)', bold: true }, { text: 'The land — solves Track A now, no large build', bold: true }, { text: '', align: AlignmentType.RIGHT }, { text: '~$31,400', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  p('† The managed-IT figure is grounded in Technijian’s current 2026 managed-services schedule and is consistent with what comparable lean offices pay today. The SEO line is My SEO Tier 3 at its standard $1,000/mo published rate — kept lean on purpose for the entry; the fuller program that adds AI Search Optimization, PR, and content syndication runs $1,550/mo and can layer on later. All figures are confirmed in a firm quote after the free assessment.', { size: 18, italics: true, spaceBefore: 60 }),
  spacer(120),
  calloutBox(
    'On the Cost Concern From Last Time',
    [
      'CardLogix looked at co-managed support before and stepped back on cost — so this entry is built specifically to answer that. It is priced per-endpoint, not as an enterprise retainer; there is no large up-front build; and routine work runs on the blended US-led model that keeps the monthly low.',
      'It is month-to-month-friendly and the free assessment comes first — so you see the real scope and a firm number before committing to anything. The goal is an easy yes, not a leap of faith.',
    ],
    TEAL
  ),
  spacer(140),
  subHeader('Labor Rates — 2026 Rate Card (for ad-hoc & project work)'),
  p('So there are no surprises, here are Technijian’s standard 2026 labor rates. Anything beyond the co-managed support block — projects, after-hours incidents, the CA/HSM build — is billed at these published rates, and the offshore and contracted columns are how a co-managed relationship keeps cost down.'),
  spacer(60),
  buildTable(
    [
      { label: 'Role', weight: 3 },
      { label: 'Normal hrs*', weight: 2.4, align: AlignmentType.RIGHT },
      { label: 'After-hours*', weight: 1.8, align: AlignmentType.RIGHT },
      { label: 'Contracted**', weight: 1.8, align: AlignmentType.RIGHT },
    ],
    [
      ['US Tech Support / Engineering', { text: '$150/hr', align: AlignmentType.RIGHT }, { text: '$250/hr', align: AlignmentType.RIGHT }, { text: '$125/hr', align: AlignmentType.RIGHT }],
      ['CTO / vCIO Advisory', { text: '$250/hr', align: AlignmentType.RIGHT }, { text: '$350/hr', align: AlignmentType.RIGHT }, { text: '$225/hr', align: AlignmentType.RIGHT }],
      ['Developer (US)', { text: '$150/hr', align: AlignmentType.RIGHT }, { text: '—', align: AlignmentType.RIGHT }, { text: '$125/hr', align: AlignmentType.RIGHT }],
      ['Blended delivery (US-led, global team)‡', { text: 'included in plan', align: AlignmentType.RIGHT }, { text: 'included in plan', align: AlignmentType.RIGHT }, { text: 'lowest effective rate', align: AlignmentType.RIGHT }],
    ],
  ),
  p('* Normal hours are Mon–Fri 7:00 AM–7:00 PM PT; after-hours is all other times. ** Contracted = discounted rate on a 3-, 6-, or 12-month cycle commitment. ‡ Routine, repeatable work (monitoring, patching, provisioning, content production) is delivered through Technijian’s blended US-led global model — senior US architects direct and own the relationship while a follow-the-sun team handles execution, which is what lets a co-managed plan stay well below the à-la-carte rates above. Any work touching CJIS or other regulated data is performed by US-based, background-screened personnel. On-site has a 2-hour minimum with no trip charges; emergency/critical response is billed at the after-hours rate with a 1-hour minimum.', { size: 18, italics: true }),
  spacer(160),
  subHeader('The Expansion — Track B (once the entry proves out)'),
  buildTable(
    [
      { label: 'Service', weight: 2.8 },
      { label: 'Scope', weight: 4 },
      { label: 'Est. Monthly', weight: 1.4, align: AlignmentType.RIGHT },
      { label: 'Est. Y1', weight: 1.6, align: AlignmentType.RIGHT },
    ],
    [
      ['My Cloud + My Security — Managed CA on Cloud HSM (Phase 2)', 'The HSM-backed certificate authority Nick asked us to recommend: a fresh CA key generated inside a CA-grade cloud HSM (AWS / Azure / Google, per the customer), not migrated from the existing software CA. Detailed in the companion CloudHSM analysis.', { text: 'per customer', align: AlignmentType.RIGHT }, { text: 'resold + managed', align: AlignmentType.RIGHT }],
      ['My Compliance — CJIS Practice Build (Phase 2)', 'Formalize a CJIS wrapper on the existing CMMC foundation: control mapping, evidence model, audit posture', { text: '—', align: AlignmentType.RIGHT }, { text: '~$25,000–40,000', align: AlignmentType.RIGHT }],
      ['My AI — Account-Intelligence Engine (Phase 2)', 'Fractional AI advisor + the named-account intelligence, trigger monitoring, and RFP engine', { text: '~$2,000', align: AlignmentType.RIGHT }, { text: '~$24,000', align: AlignmentType.RIGHT }],
      ['My Security — Managed SOC for Pilot (Phase 2)', 'The 24/7 security operations behind the first joint customer pilot', { text: 'scoped', align: AlignmentType.RIGHT }, { text: 'per pilot', align: AlignmentType.RIGHT }],
      ['My Dev — Card-Lifecycle Automation (Phase 2)', 'Provisioning, identity-binding, and renewal workflow around card issuance', { text: '—', align: AlignmentType.RIGHT }, { text: 'scoped build', align: AlignmentType.RIGHT }],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true }, { text: 'The partnership engine — built after Track A proves the rhythm', bold: true }, { text: '', align: AlignmentType.RIGHT }, { text: 'scoped at pilot', bold: true, color: CORE_ORANGE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(160),
  subHeader('How the Partnership Splits — An Opening Position'),
  p('A channel partnership is its economics, so here is a strawman to react to — explicitly an opening position, fully negotiable, and exactly the kind of thing to settle with Sebastien and Tom. The principle: CardLogix owns the credential and the customer relationship; Technijian delivers and operates the managed environment; each side is paid for what it brings, and neither carries the other’s risk.'),
  spacer(60),
  buildTable(
    [
      { label: 'Element', weight: 2.4 },
      { label: 'CardLogix', weight: 3.3 },
      { label: 'Technijian', weight: 3.3 },
    ],
    [
      ['Sells / owns the account', 'Yes — your brand, your customer, your card', 'Behind the scenes or co-branded, your call'],
      ['Hardware revenue', '100% to CardLogix', 'None — we never touch card margin'],
      ['Managed-services revenue', 'Referral: up to 10% of the gross monthly service invoice — or your own markup on resale', 'Balance, for delivering + operating'],
      ['Who carries delivery liability', 'None for the managed wrap', 'Technijian owns the SLA and the ops risk'],
      [{ text: 'Two clean models to choose from', bold: true }, { text: 'Referral: you refer, we contract + pay you up to 10% of the gross monthly service invoice', bold: true }, { text: 'Resale: you contract, we wholesale to you, you set retail', bold: true }],
    ],
  ),
  p('Either model bounds CardLogix’s exposure to essentially zero on the delivery side while creating a new recurring margin stream on hardware you already sell. Which model fits — and your resale markup, if you take that route — is a 30-minute conversation, not a prerequisite to starting.', { size: 18, italics: true, spaceBefore: 60 }),
  spacer(160),
  subHeader('Year-1 ROI — A Range, Modeled Against the Entry'),
  p('Start with the expected case: about 1.8× in Year 1 — the co-managed IT line pays for itself on recovered time alone, and a single partnership win clears the rest. The full range below sets expectations honestly, not on a single optimistic number, and none of the cases count the full revenue the expansion adds — so even the Likely case understates the real opportunity. The model separates the two halves of the entry honestly: the co-managed IT line is a cost-recovery play (it pays for itself in recovered staff time), while the SEO/authority foundation and readiness workshop are growth investments whose return arrives through partnership wins. Read the columns this way: the Very Conservative floor assumes zero partnership wins in Year 1; the Likely case counts a single joint managed-MFA/CA win, which Nick has confirmed is a service CardLogix wants to offer; the Upside reflects the broader private-sector, insurance-driven demand gaining traction sooner.'),
  spacer(60),
  buildTable(
    [
      { label: 'Model Input', weight: 3.6 },
      { label: 'Downside-Protected (zero wins)', weight: 2.1 },
      { label: 'Likely (expected)', weight: 2.1 },
      { label: 'Upside', weight: 2.1 },
    ],
    [
      ['Internal IT hours recovered (Y1)*', '~150 hrs', '~250 hrs', '~350 hrs'],
      ['Value of that recovered capacity**', '+$15,000', '+$25,000', '+$35,000'],
      [{ text: 'Co-managed IT line (~$14,400/yr) — payback on recovered time alone', color: CORE_BLUE }, { text: '≈ pays for itself', color: CORE_BLUE }, { text: '≈ 1.7×', color: CORE_BLUE }, { text: '≈ 2.4×', color: CORE_BLUE }],
      ['Joint managed-MFA / CA customer wins (Y1)', '0', '1', '2'],
      ['Recurring value per joint win***', '—', '+$30,000', '+$30,000'],
      [{ text: 'Total estimated Y1 value (all sources)', bold: true }, { text: '+$15,000', bold: true }, { text: '+$55,000', bold: true }, { text: '+$95,000', bold: true }],
      [{ text: 'Full entry program (Y1)†', bold: true }, { text: '~$31,400', bold: true }, { text: '~$31,400', bold: true }, { text: '~$31,400', bold: true }],
      [{ text: 'Net Y1 position', bold: true, color: CORE_BLUE }, { text: 'IT pays for itself; growth spend not yet returned', bold: true, color: CORE_BLUE }, { text: '~1.8×', bold: true, color: CORE_BLUE }, { text: '~3.0×', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(120),
  p('* Recovered hours = time spent on after-hours, patching, and provisioning that co-managed IT absorbs. ** Valued at a conservative blended internal rate (~$100/hr). *** Derivation of the ~$30,000/win: a single mid-size LE agency or private firm adopting the managed credential environment is modeled at roughly $2,000–$3,000/mo of recurring managed-services value to the partnership (managed IT + SOC + the CA wrap, ~25–50 seats) — i.e. ~$24,000–$36,000/yr; we use $30,000 as the midpoint. It is an estimate, ranged at discovery against a real pilot, not a promise. † The full entry program (~$31,400) includes the co-managed IT line plus growth investments (authority/SEO foundation + readiness workshop) whose return shows up through partnership wins, not through recovered IT hours — which is why the floor is measured on the IT line, not on the full program. All figures are estimates pending discovery.', { size: 18, italics: true }),
  spacer(120),
  calloutBox(
    'How to Read This Range',
    [
      'The floor is deliberately cautious: it assumes the partnership lands nothing in Year 1. Even then, the co-managed IT line pays for itself in recovered time alone, and the entry still buys a compounding authority/SEO asset and a mapped go-to-market — value the floor does not dollar-count. We show the zero-win case on purpose so the downside is honest.',
      'The Likely case (~1.8×) is our realistic expectation — it counts a single joint managed-MFA/CA customer win, the kind of service Nick indicated CardLogix wants to offer. One win clears the entry cost and then some.',
      'The real economics sit above this table. Every figure is measured against the small entry only; the expansion — the managed CA on cloud HSM, the CJIS practice, the account-intelligence engine — scales the partnership against a market now widening from federal and law-enforcement into private companies driven by cyber-insurance. Discovery replaces these estimates with CardLogix’s real endpoint count, the prior co-managed benchmark, and a concrete pilot target.',
    ],
    CORE_ORANGE
  ),
  spacer(200),
  subHeader('The Bigger Picture — One Partner vs. a Stack of Vendors'),
  p('It is worth zooming out from any single line item. The capabilities in this plan — managed IT, security operations, compliance, marketing and authority content, sales intelligence, AI integration, and custom development — are things most companies buy from six or eight separate vendors, each with its own contract, renewal, onboarding, and account-management overhead. The table below is what that fragmented stack costs a firm of CardLogix’s size at typical 2025–2026 market rates. It is not a set of competitor quotes; it is the published market reality for each category, leaning conservative on purpose.'),
  spacer(80),
  buildTable(
    [
      { label: 'What you would otherwise assemble (separate vendors)', weight: 5.2 },
      { label: 'Typical market cost / mo', weight: 2.8, align: AlignmentType.RIGHT },
    ],
    [
      ['Managed / Co-Managed IT', { text: '$2,000 – $4,000', align: AlignmentType.RIGHT }],
      ['24/7 Cybersecurity (SOC / MDR / EDR)', { text: '$400 – $1,000', align: AlignmentType.RIGHT }],
      ['Compliance program + vCISO', { text: '$1,500 – $5,000', align: AlignmentType.RIGHT }],
      ['Digital marketing agency (SEO / content / PPC mgmt)*', { text: '$3,000 – $8,000', align: AlignmentType.RIGHT }],
      ['Sales intelligence / lead data (ZoomInfo, Apollo)', { text: '$150 – $2,500', align: AlignmentType.RIGHT }],
      ['AI advisory / integration', { text: '$2,500 – $5,000', align: AlignmentType.RIGHT }],
      ['Custom app / managed-app dev capacity', { text: '$500 – $3,000', align: AlignmentType.RIGHT }],
      ['vCIO / IT strategy (incremental)**', { text: '$1,000 – $3,000', align: AlignmentType.RIGHT }],
      [{ text: 'Fragmented multi-vendor reality (a typical working subset)', bold: true }, { text: '~$6,000 – $12,000 / mo', bold: true, color: CORE_ORANGE, align: AlignmentType.RIGHT }],
      [{ text: 'Technijian entry program (Track A — your starting point)', bold: true, color: CORE_BLUE }, { text: '~$2,600 / mo', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
      [{ text: 'Full consolidated program (entry + expansion)', bold: true, color: CORE_BLUE }, { text: 'scoped after a free Nexus Assess', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  p('* Excludes the ad media spend itself. ** Comprehensive managed-IT plans often bundle light vCIO, so this is shown as an incremental line only. Figures are market-typical ranges drawn from published 2025–2026 pricing data — not competitor quotes — and vary by size, scope, and contract term. Summed in full these categories run higher; the ~$6,000–$12,000/mo composite reflects the core stack a firm this size actually runs (managed IT + security + light compliance + a modest content retainer), with ad spend, software licenses, and one-time build capex excluded. The ~$2,600/mo entry program is the Track-A starting point — not yet the full stack — so it is not an apples-to-apples replacement for every line above; the point is the direction, that consolidating onto one partner begins well below the fragmented total and scales efficiently from there. Your firm quote is set after the free Nexus Assess.', { size: 18, italics: true, spaceBefore: 60 }),
  spacer(120),
  calloutBox(
    'Why One Partner Costs Less — Honestly',
    [
      'Consolidation itself is the first saving: one relationship, one bill, one accountable team instead of six to eight vendors to coordinate — each charging its own onboarding and account-management tax, and several (managed-detection especially) carrying per-seat minimums that make a firm this size pay a premium just to clear their floor.',
      'The structural cost advantage is real and specific: Technijian runs a US-senior + India-blended delivery model. Most of the stack above is priced on labor — vCISO hours, agency hours, AI-advisory hours, dev hours, IT-strategy time. Independent rate data puts US onshore work at roughly $100–$200/hr versus a blended $50–$100/hr; Technijian keeps senior US architects on the work that needs them and runs the rest through the India delivery center, so the same outcomes come from a structurally lower cost base — not a discount that erodes service.',
      'We do not put a Technijian “total” on this page on purpose. The honest number comes from a scoped quote after the free Nexus Assess — but whatever lines CardLogix actually needs, consolidating them with one partner on a blended-delivery model lands well under assembling them vendor by vendor.',
    ],
    CORE_BLUE
  ),
);

// ---------- 09 IMPLEMENTATION ROADMAP ----------
docChildren.push(
  ...sectionHeader('Implementation Roadmap', CORE_ORANGE, '09'),
  spacer(100),
  p('The roadmap sequences the two tracks: land Track A fast, prove the joint motion on a single pilot, then scale the channel play. It is paced for a lean organization — no phase asks CardLogix to absorb more than it comfortably can while still running its business.'),
  spacer(160),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Implementation Roadmap', 620, 2.675),
  diagramCaption('Figure 9.0 — Foundation (0–90 days) → Joint Pilot (90–180) → Scale (180–365)'),
  spacer(160),
  subHeader('Phase 1 — Foundation (0–90 days)'),
  bullet('Free IT assessment of CardLogix’s own environment — endpoints, servers, backup, identity posture.'),
  bullet('Stand up the co-managed IT engagement (Track A): coverage, monitoring, and senior support in place.'),
  bullet('Build the CJIS-control gap map from the existing CMMC baseline — the blueprint for the practice build.'),
  spacer(120),
  subHeader('Phase 2 — Joint Pilot (90–180 days)'),
  bullet('Run one joint pilot with a single LE agency: CardLogix cards plus Technijian’s managed, CJIS-aligned wrap.'),
  bullet('Bring the AI account-intelligence and RFP engine live against named target agencies.'),
  bullet('Prove the audit-evidence automation on the pilot — the reusable proof point for every deal after.'),
  spacer(120),
  subHeader('Phase 3 — Scale (180–365 days)'),
  bullet('Turn the pilot into a repeatable channel playbook with CardLogix’s integrators.'),
  bullet('Formalize the CJIS practice inside My Compliance as a standing capability.'),
  bullet('Move to a co-sell motion across multiple agencies — the partnership operating at scale.'),
);

// ---------- 10 QUICK WINS ----------
docChildren.push(
  ...sectionHeader('Quick Wins — No Commitment Required', TEAL, '10'),
  spacer(100),
  p('A handful of things CardLogix can do right away with no contract and no spend — each a genuine improvement on its own, and each a natural on-ramp to the program. The first is the marquee: a complete, no-cost security and risk assessment.'),
  spacer(80),
  subHeader('Run a free Nexus Assess security assessment'),
  p('Nexus Assess is Technijian’s one-time, point-in-time IT risk and security assessment. We run it once at no charge so CardLogix gets a real, evidence-backed picture of where it stands today — internally, on the perimeter, and across Microsoft 365 — delivered as a prioritized remediation roadmap that reads like a board memo, not a raw vulnerability dump. It draws on 20+ underlying security tools, dual risk scoring (a proprietary score plus CVSS and Microsoft Secure Score), and a library of 100+ report types. Three layers matter most here:'),
  spacer(40),
  leadBullet('Internal vulnerability assessment. ', 'Non-intrusive discovery across Windows, macOS, and Linux; full device inventory; Active Directory and Azure AD security review (users, group policy, stale accounts, privilege sprawl); missing security patches and end-of-life / unsupported operating systems; AV/EDR coverage gaps; local and domain password-policy review; insecure listening ports and services; even SQL Server database security — all rolled into an overall risk score with each issue ranked by severity.'),
  leadBullet('External vulnerability assessment. ', 'A scan of CardLogix’s public-facing surface — exposed ports and services, weak or expired SSL/TLS certificates, and domain/DNS hygiene an attacker would probe first — plus dark-web monitoring and credential-exposure detection for company logins already leaked in known breaches.'),
  leadBullet('Microsoft 365 assessment. ', 'A full tenant security review across M365, Teams, SharePoint, OneDrive, and Exchange: MFA coverage for every user, risky or suspicious sign-ins, mailbox forwarding and inbox rules (a common breach indicator), admin-role assignments, external sharing and guest-access settings, and license waste — exactly the surface that matters when the whole strategy turns on phishing-resistant identity.'),
  spacer(60),
  p('Because Nexus Assess also maps findings to HIPAA, SOC 2, PCI-DSS, CJIS, and NIST CSF, the same free run doubles as a head start on the CJIS-control gap map that Track B will need.', { size: 20, italics: true }),
  spacer(120),
  subHeader('And four more, no commitment'),
  spacer(40),
  leadBullet('Inventory the two servers. ', 'Document what runs on each (roles, OS version, backup state). It is the first thing any scoping needs — and Nexus Assess above captures most of it automatically.'),
  leadBullet('Map the MFA / CJIS exposure in the channel. ', 'List the agency-facing integrators already selling CardLogix cards — the seed list for any joint motion.'),
  leadBullet('Pull the prior co-managed proposal. ', 'Revisit the number CardLogix walked from and why; it frames a fair, right-sized scope this time.'),
  leadBullet('Review one published CJIS / MFA FAQ. ', 'See how few card makers answer agency CJIS and MFA questions well online — the authority gap is visible in minutes.'),
);

// ---------- 11 NEXT STEPS & DISCOVERY ----------
docChildren.push(
  ...sectionHeader('Next Steps & Discovery', DARK_CHARCOAL, '11'),
  spacer(100),
  p('These follow directly from what we agreed on the May 29 call: Technijian delivers this AI growth strategy, follows with the managed certificate-authority / cloud-HSM options, and Nick sends over the other IT issues on his list. The steps below put structure around that.'),
  spacer(60),
  ...numberedSteps([
    'The one easy yes — book the free Nexus Assess. At no cost and no obligation, Technijian walks the environment and hands back a board-ready risk map plus a scoped, right-sized co-managed (Track A) option with a firm number. This is the only decision in front of CardLogix today, and nothing past the assessment is committed.',
    'Send the other IT issues on your list so the assessment is scoped against real priorities.',
    'Keep Track B separate and later. The partnership (managed-MFA / CA) needs Goulet and Hope, so it stays a parallel conversation — not part of the easy yes. Technijian has prepared a one-page Partnership Concept Brief (the companion document) for Nick to forward when the timing is right; nothing in the Track A step commits CardLogix to it.',
    'Already in hand: this strategy plus the companion CloudHSM analysis on the managed-CA options Nick asked about — including the recommendation to generate a fresh CA key inside a CA-grade cloud HSM rather than migrate the existing software CA.',
  ]),
  spacer(140),
  subHeader('Discovery Questions (to replace every estimate with a real number)'),
  bullet('How many users and endpoints today, and where does the next 12 months take that?'),
  bullet('What runs on the two servers — file, AD, application, virtualization? On-prem AD or hybrid? Backup posture?'),
  bullet('What eats the most internal IT time right now — after-hours, patching, provisioning, security alerts?'),
  bullet('What did the prior co-managed conversation look like — what number and what model?'),
  bullet('Who owns a partnership decision internally, and what would make Goulet or Hope take the meeting?'),
  bullet('What does a typical agency end-customer look like, and how do they end up with a CardLogix card today?'),
  spacer(200),
  ctaBanner([
    { text: 'Your next step: book the free Nexus Assess.', size: 26, bold: true },
    { text: 'At no cost and no obligation, you get a board-ready map of exactly where CardLogix stands —', size: 22 },
    { text: 'internal, external, and Microsoft 365 — plus the scoped, firm Track A number. Month-to-month — the easy yes, not a lock-in.', size: 22 },
    { text: 'Book with Ravi Jain  |  RJain@technijian.com  |  949.379.8499  |  technijian.com', size: 20 },
  ]),
);

// ---------- 12 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '12'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California — minutes from CardLogix in the Spectrum — serving small and mid-sized businesses since 2000. We design, build, and operate secure infrastructure with security and compliance built in, and a dedicated team assigned to each client.'),
  spacer(160),
  kpiRow([
    { number: 'Since 2000', label: '26 years in continuous operation', color: CORE_BLUE },
    { number: '1,000+', label: 'networks served', color: CORE_ORANGE },
    { number: '24/7', label: 'SOC — 15-minute critical-response SLA', color: TEAL },
    { number: 'CrowdStrike', label: 'powered cybersecurity', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  calloutBox(
    'Working With Us Is Low-Risk by Design',
    [
      'A dedicated pod that knows your environment; 24/7 coverage from the USA + India with a 15-minute critical-response SLA; CrowdStrike-powered security and managed compliance across eight frameworks (HIPAA, SOC 2, PCI, CMMC, GDPR, NIST CSF, CIS, ISO 27001).',
      'Month-to-month-friendly terms, your data stays yours, and every engagement starts with a free assessment — so you prove the fit before you commit. For any CJIS-bound or regulated work, delivery is handled by US-based, background-screened personnel.',
    ],
    CORE_BLUE
  ),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'Role in This Blueprint', weight: 5 }],
    [
      ['My IT', 'Co-managed IT for CardLogix’s internal team (Track A) and the managed-IT half of the agency wrap (Track B)'],
      ['My Security', '24/7 security operations — the SOC, EDR, MFA, and access control behind a CJIS-aligned environment'],
      ['My Compliance', 'Eight frameworks today, with CJIS as the near-term build adjacent to the existing CMMC practice'],
      ['My AI', 'Account intelligence, trigger monitoring, evidence automation, and the readiness workshop'],
      ['My SEO', 'Authority and AEO content aimed at the specific CJIS and smart-card questions agency buyers ask'],
      ['My Dev', 'Card-lifecycle and provisioning automation around issuance (expansion phase)'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Prepared by', 'Ravi Jain, Founder & CEO — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '949.379.8499'],
      ['Web', 'technijian.com'],
    ],
  ),
);

// ---------- 13 APPENDIX — SOURCES ----------
docChildren.push(
  ...sectionHeader('Appendix — Sources & Notes', BRAND_GREY, '13'),
  spacer(100),
  p('This blueprint draws on our May 29, 2026 conversation with Nick Schooler, public sources, and Technijian’s research foundation for CardLogix. Company figures (headcount, revenue, endpoint count) are public-signal estimates and are confirmed at discovery. CJIS references are to the FBI CJIS Security Policy and public analyses of versions 5.9.5 and 6.0.'),
  spacer(60),
  bullet('Conversation with Nick Schooler (CardLogix), May 29, 2026 — confirmed the managed-MFA/CA service as a joint customer-facing offering; the three-wave MFA-adoption framing (federal → state/local → private via cyber-insurance); the phone-MFA (Duo/Okta) displacement thesis; and certificate-based authentication into Microsoft Entra ID.'),
  bullet('CardLogix corporate site — products (PIV, FIDO2, FRAC, BIOSID), markets, services, news room.'),
  bullet('FBI CJIS Security Policy 5.9.5 (2024) — multi-factor authentication mandatory for CJI access as of October 1, 2024.'),
  bullet('FBI CJIS Security Policy 6.0 (December 2024) — tightened password and MFA requirements with phased milestones.'),
  bullet('Public analyses of authentication requirements (phishing-resistant MFA; PKI smart cards and FIDO2 as satisfying controls).'),
  bullet('Competitive references: HID Global, Identiv, Tx Systems, Yubico, and phone-based MFA (Cisco Duo, Okta) — public product and positioning material.'),
  bullet('Companion deliverable: CardLogix Managed-PKI / CloudHSM analysis (AWS vs. Azure CA-grade HSM options).'),
  bullet('Technijian service definitions: My IT, My Security, My Compliance (eight frameworks), My AI, My SEO, My Dev.'),
  bullet('Technijian 2026 rate card (MSA standard schedule) — labor rates (US support, CTO/vCIO advisory, offshore) and managed-services component pricing used as the basis for the Track-A figures. Final pricing is set in a firm quote after the assessment.'),
  spacer(140),
  p('Note on CJIS: Technijian does not currently hold a CJIS delivery practice. CJIS is presented throughout as a near-term capability to build on the existing CMMC foundation, triggered by this partnership — never as completed work. All projections are estimated and conservative pending discovery.', { italics: true, size: 20 }),
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

const OUT_PATH = path.join(__dirname, 'CardLogix-AI-Growth-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
