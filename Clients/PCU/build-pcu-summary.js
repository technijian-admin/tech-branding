// Pacific Utility Installation - AI Growth & Integration Strategy - EXECUTIVE SUMMARY (hook artifact, ~6pp)
// Abridged from build-pcu-report.js. Same brand tokens + helpers + diagrams. ENTRY-only pricing.
// WARM PROSPECT (Vistage peer) — value-first framing, NO "in place" IT line. Real rates + TBD.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const PASS = strip(tokens.color.status.pass.$value);
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';

const LOGO_BUF = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'Technijian Logo 2.png'));
const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => fs.existsSync(path.join(DIAGRAMS_DIR, n)) ? fs.readFileSync(path.join(DIAGRAMS_DIR, n)) : null;
const DIAGRAM_ARCH_BUF = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');
const TODAY = '2026-06-03';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ spacing: { before: s, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE) {
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, spacing: { before: 360, after: 120, line: 240 }, children: [new TextRun({ text, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visualTable = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 32, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
  return [headingPara, visualTable];
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiCell(number, label, color, w) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 80, right: 80 }, verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 36, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
    ] });
}
function kpiRow(items) { const w = Math.floor(CONTENT_W / items.length); return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] }); }
function buildTable(columns, rows) {
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const cellObj = typeof cell === 'string' ? { text: cell } : cell;
    const fill = ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function diagramImage(buf, alt, widthPx = 600, ar = 1.78) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / ar) }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(t) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: t, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, h = 200) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun('')] })] })] })] }); }
function makeHeader() { return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders, rows: [new TableRow({ children: [
  new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 168, height: 35 } })] })] }),
  new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
]})] })] }); }
function makeFooter() { return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
  new TextRun({ text: 'Technijian  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] }); }

const d = [];
// ---- PAGE 1 ----
d.push(
  colorBanner(CORE_BLUE),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 240, height: 50 } })] }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'PACIFIC UTILITY', size: 44, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'AI Growth & Integration Strategy  —  Executive Summary', size: 25, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY + '  |  Corona, California  |  pacificutility.com', size: 19, color: BRAND_GREY, font: FONT_BODY })] }),
  colorBanner(CORE_ORANGE, 60),
  spacer(170),
  kpiRow([
    { number: '1997', label: 'Building Since', color: CORE_BLUE },
    { number: '5 Trades', label: 'One Source, One Schedule', color: CORE_ORANGE },
    { number: 'ESOP', label: 'Employee-Owned · 2017', color: TEAL },
    { number: 'CA·NV·AZ', label: 'Tri-State Footprint', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  p('For more than twenty-five years Pacific Utility has built the underground that everything else stands on — utility engineering, wet, dry, high voltage, and streetlights, self-performed across California, Nevada, and Arizona. What it has not yet built is the digital and AI engine that makes that reputation findable, wins more of the right work, and lets a labor-short team bid more without adding estimators it cannot hire.'),
  calloutBox('The Core Opportunity', [
    'Rebalance toward the boom — residential is cooling while grid, undergrounding, EV, broadband, and streetlights surge, and Pacific Utility already self-performs exactly that work. AI helps the firm chase and win more of it.',
    'Own a category that is digitally asleep — no underground-utility contractor has claimed the AI-answer position, and none can claim the single-source, all-five-trades, tri-state story. First mover earns compounding authority.',
    'Make bandwidth the advantage, not the ceiling — in a labor shortage, estimating capacity is the bottleneck. AI lets the firm bid more and sharper without hiring up; the licensed estimator still signs the number.',
  ], CORE_ORANGE),
  pageBreak(),
);

// ---- PAGE 2 ----
d.push(
  ...sectionHeader('The Inflection — Two Diverging Engines', CORE_BLUE),
  spacer(120),
  p('The market Pacific Utility serves is splitting. The two demand engines that ran side by side for years are now moving in opposite directions — and the firm is positioned, by trade mix and recent hiring, to ride the one that is rising. This is the "why now."'),
  spacer(120),
  buildTable(
    [{ label: 'Engine', weight: 2.4 }, { label: 'What’s Happening (2025–2026)', weight: 4 }, { label: 'What It Means for Pacific Utility', weight: 3.6 }],
    [
      ['Residential (cooling)', 'Starts and deliveries pulling back across CA, NV, AZ; SoCal price softening; Las Vegas’ slowest February sales in a decade', 'The developer/builder channel softens — a reason to diversify the bid mix'],
      ['Grid & public infra (booming)', '~$1.4T U.S. utility capex 2025–2030; the largest transmission build ever; underground-line and transformer spend up sharply', 'The firm already self-performs high voltage, undergrounding, and streetlights — the exact scopes the boom demands'],
      ['Federal & state programs', 'IIJA grid modernization, DOE grid-hardening, NEVI EV charging, BEAD broadband, and CA SB 1 for streets', 'New, fundable channels — if the firm is found and prepared early'],
      ['The labor shortage', 'Electricians retire faster than they’re replaced; the workforce is projected to shrink as demand rises', 'Estimating bandwidth, not demand, becomes the binding constraint — exactly where AI pays'],
    ],
  ),
  spacer(160),
  calloutBox('Why Pacific Utility Wins This', [
    'The demand is moving toward exactly what the firm does best — underground, high voltage, undergrounding, and streetlights — across three states where most rivals are single-state.',
    'The moat is real and uncaptured: more than twenty-five years, employee-owned, the only contractor that can self-perform all five underground trades on one schedule — a story no competitor can claim and the firm barely tells online.',
  ], CORE_BLUE),
);
d.push(pageBreak());

// ---- PAGE 3 ----
d.push(
  ...sectionHeader('How AI Grows Pacific Utility', CORE_BLUE),
  spacer(120),
  p('The engine runs three motions at once — get found and trusted (own the answer-engine, the single-source story, and the tri-state lane), win the work (project and permit intelligence plus bid and estimating acceleration on the booming grid and public work), and run leaner and remember (a twenty-five-year knowledge system and more bids per estimator). Every part respects the boundary that protects a fixed-price, safety-critical contractor.'),
  spacer(120),
  diagramImage(DIAGRAM_ARCH_BUF, 'Pacific Utility AI Engine', 600, 1.61),
  diagramCaption('The Engine: Get Found & Trusted, Win the Work, and Run Leaner & Remember'),
);
d.push(pageBreak());

// ---- PAGE 4 ----
d.push(
  ...sectionHeader('The Three Motions', CORE_ORANGE),
  spacer(120),
  calloutBox('1 — Get Found & Trusted', [
    'Own "underground / dry / high-voltage utility contractor" across CA, NV, and AZ cities in Google and AI answers; publish the single-source, all-five-trades story no competitor can claim; claim the Rule 20 / undergrounding lane; and merchandise twenty-five years of named work into searchable proof. The whole category is answer-engine-blind — first mover earns compounding, credible authority.',
  ], CORE_BLUE),
  spacer(120),
  calloutBox('2 — Win the Work', [
    'Project and permit intelligence flags the developers, master-planned communities, agencies, and utility programs entitling or permitting underground and electrical scope across three states — months early. AI then assembles responsive public and private bids fast and accelerates estimating, so the firm bids more of the booming work before the field crowds in.',
  ], CORE_ORANGE),
  spacer(120),
  calloutBox('3 — Run Leaner & Remember', [
    'Capture twenty-five years of bids, jurisdictional know-how, and conflict-overlay precedents into a searchable memory, and lift the output of every estimator — turning the labor shortage from a ceiling on growth into an advantage over slower rivals.',
  ], TEAL),
  spacer(160),
  calloutBox('The Boundary That Builds Trust', [
    'On fixed-price, safety-critical work the rule is simple and absolute: AI assists; the licensed estimator or project manager owns the final price and signs; safety-critical calls stay with the qualified professional. Stated to a developer or an agency, that boundary is a reason to trust the firm — and it is genuinely hard to do well, which makes deploying AI inside it a durable advantage in 2026.',
  ], DARK_CHARCOAL),
);
d.push(pageBreak());

// ---- PAGE 5 ----
d.push(
  ...sectionHeader('The Program', CORE_BLUE),
  spacer(120),
  p('Lead with a modest entry program — real published Technijian rates — that makes the firm found and surfaces the right bids; add the AI estimating and knowledge build as a later expansion, once the entry proves the lift. No invented numbers.'),
  spacer(120),
  buildTable(
    [{ label: 'Entry Program', weight: 3 }, { label: 'What It Does', weight: 4 }, { label: 'Investment', weight: 2.4 }],
    [
      ['My SEO — Answer-Engine, Tri-State Local & Single-Source', 'AEO + the single-source story + the Rule 20 / undergrounding lane + a project-proof scoreboard (new)', { text: '$500–$1,500/mo*', color: CORE_BLUE }],
      ['My AI Lead Gen — Project, Permit & Account Intelligence (Starter)', 'Early project/permit/program intelligence across CA, NV, AZ; relationship-led, not volume', { text: '$1,499/mo* + $2,500 setup', color: CORE_BLUE }],
      ['My AI — Readiness Workshop + Content Engine', 'Leadership alignment, the boundary, and the content engine', { text: 'TBD — discovery', color: CORE_ORANGE }],
      [{ text: 'ENTRY PROGRAM', bold: true }, { text: 'The new growth layer: My SEO + Lead Gen Starter + the TBD workshop — starts small, no large build', bold: true }, { text: 'Published + TBD', bold: true, color: CORE_BLUE }],
    ],
  ),
  spacer(60),
  p('* Real published Technijian list rates. My SEO published tiers run $500–$1,500/mo (final tier set in discovery); My AI Lead Gen Starter is $1,499/mo plus a one-time $2,500 setup. The AI estimating, bid-assembly, and institutional-knowledge build, managed app services, and the fractional advisor are the Phase-2 expansion — no published rate, scoped in discovery. The Year-1 total is finalized then; no invented numbers.', { italics: true, size: 18 }),
  spacer(140),
  calloutBox('How We’ll Measure the Return', [
    'We do not lead with a multiple we cannot back. Year-1 return is modeled from real levers — more bids won, estimator throughput, and authority inbound — each tied to a number Pacific Utility already tracks (bid volume, win rate, average job size, estimating capacity). Targets are set from those baselines in discovery, and in this market a single additional grid or public-works award can outweigh the entire program cost. Illustrative until then — no number we can’t back.',
  ], TEAL),
);
d.push(pageBreak());

// ---- PAGE 6 ----
d.push(
  ...sectionHeader('The Roadmap & Next Step', CORE_BLUE),
  spacer(120),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Pacific Utility 90-180-270 Day Roadmap', 600, 2.30),
  diagramCaption('90 / 180 / 270-Day Roadmap: Foundation, Win the Work, then Run Leaner & Remember'),
  spacer(120),
  calloutBox('Recommended Next Steps', [
    'Step 1: A 30-minute discovery call to confirm the baselines and the program scope.',
    'Step 2: Technijian returns a calibrated model and a fixed-scope Statement of Work within 5 business days.',
    'Step 3: Phase 1 kickoff — the answer-engine foundation, the single-source story, and the proof scoreboard — inside 30 days.',
  ], CORE_ORANGE),
  spacer(200),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ children: [new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 280, bottom: 280, left: 400, right: 400 }, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'You’ve built the contractor. Let’s build the growth engine.', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499  |  technijian.com', size: 22, color: WHITE, font: FONT_BODY })] }),
  ] })] })] }),
);

const doc = new Document({
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [{ id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: d }],
});
const OUT = path.join(__dirname, 'Pacific-Utility-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log(`Summary DOCX written: ${OUT}\n   Size: ${(buf.length / 1024).toFixed(1)} KB`); }).catch(e => { console.error('Build failed:', e.message); process.exit(1); });
