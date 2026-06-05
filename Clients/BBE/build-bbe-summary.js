// BBE — Boberg Engineering & Contracting
// Executive Summary builder (4-5 pages) — attach to first-touch outreach email
// Reuses same helpers and brand tokens as build-bbe-report.js

const fs   = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
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
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);
const WHITE         = 'FFFFFF';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH   = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF    = fs.readFileSync(LOGO_PATH);
const LOGO_WH_PATH = path.join(__dirname, '..', '..', tokens.logo.reverse_white.$value);
const LOGO_WH_BUF  = fs.existsSync(LOGO_WH_PATH) ? fs.readFileSync(LOGO_WH_PATH) : LOGO_BUF;

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => { const p2 = path.join(DIAGRAMS_DIR, n); return fs.existsSync(p2) ? fs.readFileSync(p2) : null; };
const ARCH_BUF     = dbuf('architecture.png');
const TIMELINE_BUF = dbuf('timeline.png');

function pngDimensions(buf) {
  if (!buf || buf.length < 24) return { w: 1200, h: 700 };
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const TODAY = '2026-06-05';

const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W    = 12240;
const MARGIN    = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---------- Helpers (reuse pattern) ----------
function spacer(sz = 200) { return new Paragraph({ spacing: { before: sz, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: 0, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 48, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: it.label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  ]}));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const total = columns.reduce((s, c) => s + c.weight, 0);
  let cw = columns.map(c => Math.floor(CONTENT_W * c.weight / total));
  cw[cw.length - 1] += CONTENT_W - cw.reduce((s, w) => s + w, 0);
  const hdr = columns.map((c, i) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const co = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: co.text || '', size: 20, color: co.color || BRAND_GREY, bold: co.bold || false, font: FONT_BODY })] })] });
  })}));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cw, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: hdr }), ...dRows] });
}
function diagramImage(buf, alt, widthPx = 540) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const dims = pngDimensions(buf);
  const h = Math.round(widthPx * dims.h / dims.w);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: h }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] });
}

function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executive Summary  ·  Boberg Engineering', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ]})]})] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
    new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  ]})],
  });
}

// =====================================================================
// SUMMARY BODY
// =====================================================================
const docChildren = [];

// ─────────────── COVER (Page 1) ───────────────
docChildren.push(
  colorBanner(CORE_BLUE, 200),
  spacer(600),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 240, height: 50 } })] }),
  spacer(400),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [1800, 5760, 1800], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
    new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
  ]})]}),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'AI Growth & Bid Intelligence', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Executive Summary', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Boberg Engineering & Contracting, Inc.', size: 36, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'How AI Wins More Bids and Deepens GC Relationships', size: 26, color: BRAND_GREY, font: FONT_BODY, italics: true })] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: `Prepared by Technijian  ·  ${TODAY}`, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: 'CONFIDENTIAL', size: 18, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
  spacer(300),
  kpiRow([
    { number: '33', label: 'Years SoCal commercial earthwork', color: CORE_BLUE },
    { number: '98', label: 'BuildZoom score — top 16% CA', color: TEAL },
    { number: '58', label: 'LinkedIn followers today', color: CRITICAL },
    { number: '38%', label: 'GCs using AI to screen subs', color: CORE_ORANGE },
  ]),
  spacer(300),
  colorBanner(CORE_ORANGE, 60),
  pageBreak()
);

// ─────────────── PAGE 2 — The Opportunity ───────────────
docChildren.push(
  new Paragraph({ spacing: { before: 200, after: 160 }, children: [new TextRun({ text: 'The Opportunity', size: 34, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  p('Boberg Engineering has earned its reputation one completed pad at a time over 33 years. The BuildZoom score of 98 places the firm in the top 16 percent of California contractors — a trust signal GC estimators use as a first filter before sending bid invites.'),
  p('The gap is not in field performance. When a GC estimator builds a sub list for a new Inland Empire warehouse project, they Google the sub, check BuildZoom, and review LinkedIn before sending the invite. What they find for Boberg Engineering today: 58 LinkedIn followers, limited online project history, no published content, and no AI advantage in the bid discovery process.'),
  spacer(120),
  calloutBox(
    'Three Forces Shaping the Market Right Now',
    [
      '1. AI adoption among GCs has reached 38% in 2026 — up from 17% eighteen months ago. GCs are now using AI to screen, score, and invite subs algorithmically. Subs not visible in bid portals and online searches are quietly sliding off invite lists.',
      '2. Industrial and logistics real estate demand in the Inland Empire continues to set records. Hillwood, Prologis, Rexford, and Majestic are actively developing — and they hire earthwork subs before the GC is even selected.',
      '3. None of the seven named SoCal earthwork competitors has deployed AI-enabled bid intelligence, account-based outreach, or published technical authority content. The first-mover window is open.',
    ],
    CORE_BLUE
  ),
  spacer(160),
  calloutBox(
    'The Opportunity in One Sentence',
    'A 33-year firm with a 98 BuildZoom score and a Hillwood relationship has near-zero digital authority — and no AI advantage. The first SoCal commercial earthwork sub to deploy bid intelligence and account-based outreach claims the pipeline first.',
    CORE_ORANGE
  ),
  pageBreak()
);

// ─────────────── PAGE 3 — How AI Transforms Boberg's Growth Engine ───────────────
docChildren.push(
  new Paragraph({ spacing: { before: 200, after: 160 }, children: [new TextRun({ text: 'How AI Transforms Boberg\'s Bid & Growth Engine', size: 34, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  p('Boberg\'s growth engine is account-based — a finite list of GC firms and developers who decide whether Boberg is on the bid list. AI accelerates the three motions that matter most in this model:'),
  spacer(100),
  diagramImage(ARCH_BUF, 'AI Bid & Growth Engine Architecture', 550),
  diagramCaption('Figure 1 — Boberg AI Growth Engine: Inbound Authority · Outbound Intelligence · Internal Efficiency'),
  spacer(160),
  calloutBox(
    'Inbound — Authority: Get Found Before the Bid Invite',
    'My SEO + AI Search Optimization makes Boberg the cited answer when GC estimators search "commercial grading contractor SoCal," "earthwork sub warehouse IE," and "Corona demolition contractor." LinkedIn project spotlights grow followers from 58 to 500+ in 6 months.',
    CORE_BLUE
  ),
  spacer(80),
  calloutBox(
    'Outbound — Intelligence: Act First on Every Bid Signal',
    'My AI monitors ConstructConnect, PlanetBids, and Dodge 24/7 — pre-scored alerts land in Chad\'s inbox 24–48 hours before competitors see new projects. Account intelligence on Boberg\'s top 20 GC targets delivers pre-meeting dossiers before every relationship call. Developer permit monitoring reaches industrial developers before a GC is selected.',
    CORE_ORANGE
  ),
  spacer(80),
  calloutBox(
    'Internal — Efficiency: Bid in 1 Day, Not 5',
    'AI extracts earthwork scope from civil plans and auto-drafts proposals with BBE\'s standard language — bid prep drops from 5 days to less than 1 day. A knowledge retention system captures 33 years of project data, estimating rules, and lessons learned so institutional knowledge survives key-person transitions.',
    TEAL
  ),
  pageBreak()
);

// ─────────────── PAGE 4 — Entry Program + ROI + Roadmap ───────────────
docChildren.push(
  new Paragraph({ spacing: { before: 200, after: 160 }, children: [new TextRun({ text: 'The Entry Program', size: 34, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  p('The entry program is designed to prove the lift on a modest budget before any large build is committed. Quick-win recurring services — no custom platform required in Phase 1:'),
  spacer(120),
  buildTable(
    [{ label: 'Service', weight: 2.5 }, { label: 'Description', weight: 3.5 }, { label: 'Monthly', weight: 1.5 }, { label: 'Y1 Total', weight: 1.5 }],
    [
      ['My SEO', 'Tier 2 + AI Search Optimization + PR + Content Syndication', '$1,550/mo', '$18,600'],
      ['My AI Workshop', 'Executive AI Workshop — map target GC list, define bid criteria (1× upfront)', '—', '$5,000'],
      ['My AI Advisor', 'Fractional AI Advisor — 2 hrs/mo. Bid monitoring setup, account intelligence, quarterly strategy', '$1,000/mo', '$12,000'],
      [{ text: 'ENTRY TOTAL', bold: true, color: CORE_BLUE }, { text: 'Phase 1 — no custom build required', bold: true, color: CORE_BLUE }, { text: '$2,550/mo', bold: true, color: CORE_BLUE }, { text: '~$35,600 Y1', bold: true, color: CORE_BLUE }],
    ]
  ),
  spacer(160),
  new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: 'Projected ROI — vs. Entry Program', size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  buildTable(
    [{ label: 'Scenario', weight: 1.5 }, { label: 'Projected Outcome (Y1)', weight: 3 }, { label: 'ROI vs. $35.6K Entry', weight: 1.5 }],
    [
      [{ text: 'Downside-Protected', bold: true }, '1 additional project win sourced by AI bid intelligence (~$60K gross margin)', { text: '1.7×', bold: true, color: TEAL }],
      [{ text: 'Expected', bold: true }, '2–3 additional wins + 1 new GC invited-bid relationship (~$180K–$250K gross margin)', { text: '5.1×–7.0×', bold: true, color: CORE_BLUE }],
      [{ text: 'Upside', bold: true }, '1 direct industrial developer relationship — repeat scope, no GC intermediary ($300K–$500K/yr ongoing)', { text: '8.4×–14.0×', bold: true, color: CORE_ORANGE }],
    ]
  ),
  spacer(120),
  p('The expansion — a custom Bid Intelligence Platform (My Dev, $40K–$60K one-time) — is the upsell once the entry proves the lift. The full engine runs ~$109K–$129K Y1. Reserve for the discovery meeting.', { size: 19, italics: true }),
  spacer(160),
  new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: '270-Day Roadmap', size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  diagramImage(TIMELINE_BUF, 'Implementation Timeline', 520),
  diagramCaption('Foundation (Days 1–90) → Intelligence (Days 90–180) → Growth (Days 180–270)'),
  pageBreak()
);

// ─────────────── PAGE 5 — CTA ───────────────
docChildren.push(
  new Paragraph({ spacing: { before: 200, after: 160 }, children: [new TextRun({ text: 'Next Step', size: 34, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }),
  p('The full 29-page AI Growth & Bid Intelligence Blueprint is available on request. It includes the detailed competitive landscape, four buyer persona cards, the AI Tools Matrix, the complete Service Investment Map, and the 20-source appendix. Send a reply and it is in your inbox within the hour.'),
  p('The entry program is designed as an easy first yes: $2,550/month for quick-win recurring services, no large build, and a clear ROI measurement by month six. The bigger build comes later, once the entry proves the lift.'),
  spacer(160),
  calloutBox(
    'Book a Meeting',
    [
      'Use the Book a Meeting button in Ravi\'s signature to schedule 30 minutes. We will walk through the strategy, the entry program, and all the AI work Technijian is deploying for itself and its clients across Southern California.',
      'Questions before the meeting: rjain@technijian.com  ·  949.379.8499',
    ],
    CORE_BLUE
  ),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: DARK_CHARCOAL, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 240, bottom: 240, left: 300, right: 300 }, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Technijian', size: 28, bold: true, color: WHITE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'technology as a solution', size: 20, italics: true, color: CORE_ORANGE, font: FONT_BODY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: '18 Technology Dr., Ste 141, Irvine, CA 92618', size: 18, color: 'CCCCCC', font: FONT_BODY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: '949.379.8499  |  technijian.com  |  rjain@technijian.com', size: 18, color: 'CCCCCC', font: FONT_BODY })] }),
  ]})]})]})
);

// =====================================================================
// BUILD SUMMARY DOCX
// =====================================================================
const doc = new Document({
  styles: {
    default: {
      heading1: { run: { size: 2, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 400, after: 0 } } },
    },
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: MARGIN, left: MARGIN } },
      titlePage: true,
    },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const outPath = path.join(__dirname, 'BBE-AI-Growth-Summary.docx');
  fs.writeFileSync(outPath, buf);
  console.log(`Written: ${outPath}`);
});
