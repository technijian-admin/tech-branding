// Pangea Luxe Travel (PLT) — Executive Summary (forwardable hook artifact). FACTS-ONLY.
// Entry-program pricing only (per skill Phase 10). Reuses architecture.png + timeline.png.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber
} = require('C:/vscode/tech-branding/tech-branding/node_modules/docx');

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
const GREEN = '28A745';
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 24, 2026';
const DIAG = path.join(__dirname, 'diagrams');
const diagBuf = (n) => fs.existsSync(path.join(DIAG, n)) ? fs.readFileSync(path.join(DIAG, n)) : null;

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ keepNext: true, spacing: { before: s, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 130, keepNext = false } = o; return new Paragraph({ alignment: align, keepNext, spacing: { before: spaceBefore, after: spaceAfter, line: 318 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] }); }
function pRuns(runs, o = {}) { const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 130 } = o; return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 318 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) }); }
function subHeader(text, color = CORE_BLUE) { return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 260, after: 110 }, children: [new TextRun({ text, size: 26, bold: true, color, font: FONT_HEAD })] }); }
const NB = 'b';
function bulletRuns(runs) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 30, after: 70, line: 296 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 21, color: r.color || BRAND_GREY, bold: r.bold || false, font: FONT_BODY })) }); }
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 70 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const arr = Array.isArray(body) ? body : [body];
  const bp = arr.map((b, i) => new Paragraph({ keepNext: i < arr.length - 1, keepLines: true, spacing: { before: 40, after: 50, line: 296 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
    new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 150, bottom: 150, left: 230, right: 190 }, children: [titleP, ...bp] }),
  ] })] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 180, bottom: 180, left: 70, right: 70 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: it.number, size: 38, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, o = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = o;
  const totalW = columns.reduce((s, c) => s + c.weight, 0);
  const cw = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalW)));
  cw[cw.length - 1] += CONTENT_W - cw.reduce((s, w) => s + w, 0);
  const hc = columns.map((c, i) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 130, right: 130 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 19, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dr = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const co = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 80, bottom: 80, left: 130, right: 130 }, verticalAlign: VerticalAlign.TOP, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, spacing: { before: 0, after: 0, line: 276 }, children: [new TextRun({ text: co.text, size: 19, color: co.color || BRAND_GREY, bold: co.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cw, rows: [new TableRow({ tableHeader: true, children: hc }), ...dr] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = o; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }
function pngDims(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function diagramImage(buf, alt, widthPx = 600) { if (!buf) return new Paragraph({ children: [new TextRun('')] }); const { w, h } = pngDims(buf); return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 60 }, keepNext: false, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx * h / w) }, altText: { title: alt, description: alt, name: alt } })] }); }

const children = [
  colorBar(CORE_BLUE, 130), spacer(220),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 250, height: Math.round(250 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(200),
  centered('EXECUTIVE SUMMARY', { size: 22, color: CORE_ORANGE, bold: true, after: 90 }),
  centered('Pangea Luxe Travel', { size: 42, color: DARK_CHARCOAL, bold: true, after: 80 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth & Integration — win more travelers, serve them in a fraction of the time', size: 21, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 170 }, children: [new TextRun({ text: 'Prepared for Ryan & Katie McKibben  ·  ' + TODAY + '  ·  Confidential', size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '$1.5T+', label: 'Global luxury-travel market, 2025', color: CORE_BLUE },
    { number: '+76%', label: 'More travelers now seeking an advisor', color: CORE_ORANGE },
    { number: '59%', label: 'Of advisors now use AI (was 41%)', color: TEAL },
    { number: '2023', label: 'Founded — visibility to build', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  p('Pangea Luxe Travel is a boutique luxury travel advisory — a husband-and-wife team, Ryan & Katie McKibben — based in South Orange County and operating as an independent affiliate of the Cadence Travel host agency. Through Cadence, Pangea has genuine luxury credibility: access to the Virtuoso network, a Forbes Travel-endorsed network, and elite hotel status. This summary shows where AI builds on that foundation — on two fronts — and states only verified facts, deferring every company-specific number to a short discovery call.', { spaceAfter: 120 }),
  pRuns([{ text: 'Win more travelers. ', bold: true, color: DARK_CHARCOAL }, { text: 'Affluent travelers find advisors through referrals, Instagram, search, and increasingly AI assistants. Today your authority is real but your independent visibility is thin — one blog post, a modest social footprint. Authority content, AI-search and local optimization, a visual content rhythm, and review velocity make you the advisor more of the right travelers find.' }, { text: '  Serve them in a fraction of the time. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI drafts the itinerary, does the supplier research, assembles the quote, and produces the branded trip documents — so two people serve more travelers without hiring. Every itinerary and booking is still confirmed by a human, and client data stays in private, governed tools.' }], { spaceAfter: 60 }),

  subHeader('What we verified'),
  bulletRuns([{ text: 'A credentialed boutique: ', bold: true, color: DARK_CHARCOAL }, { text: 'a husband-and-wife luxury advisory (founded 2023), independent affiliate of Cadence Travel, with Virtuoso advisor profiles and luxury-hotel status — credibility conferred through your host agency.' }]),
  bulletRuns([{ text: 'A relationship-led business: ', bold: true, color: DARK_CHARCOAL }, { text: 'you grow through referrals and repeat clients first; this plan protects that core and adds a discovery channel around it — not "shotgun" marketing.' }]),
  bulletRuns([{ text: 'Borrowed authority, thin own visibility: ', bold: true, color: DARK_CHARCOAL }, { text: 'a dormant blog (one post), a quiet social presence, and little content for search or AI to cite — the clearest, lowest-cost place to start.' }]),
  bulletRuns([{ text: 'Time is the constraint: ', bold: true, color: DARK_CHARCOAL }, { text: 'a two-person advisory can only carry so many active trips, because each one is hours of research, itineraries, quotes, and documents — exactly the work AI does well.' }]),
  calloutBox('The one idea', 'Your authority is borrowed from Virtuoso and Cadence — but your visibility and your time are yours to build. AI makes you the advisor affluent travelers find, and gives two people the back-office reach of a ten-person agency. That lets Pangea grow without burning out and without hiring before you are ready.', TEAL),

  subHeader('The engine'),
  p('Three parts: get found and chosen by the right travelers, plan and serve them faster, then keep and grow them through repeat and referral — each delivered by a specific Technijian service.', { spaceAfter: 60, keepNext: true }),
  diagramImage(diagBuf('architecture.png'), 'AI growth and time engine', 600),

  subHeader('The program — a small, easy first step'),
  p('We price from real, published service ranges and keep the entry deliberately small — sized for a growing two-person advisory. The entry pays for itself on the two highest-value levers alone — hours recovered and a few additional trips won. The larger custom build comes later, only once the entry proves the lift.', { spaceAfter: 90 }),
  buildTable(
    [{ label: 'Entry program (Year 1)', weight: 52 }, { label: 'Tier / description', weight: 26 }, { label: 'Investment', weight: 22 }],
    [
      [{ text: 'My SEO — Growth Starter', bold: true, color: CORE_BLUE }, 'Local + AI-search, reviews, content', { text: '~$850/mo', bold: true }],
      [{ text: 'My AI — Visibility & Content Jumpstart', bold: true, color: CORE_BLUE }, 'One-time workshop + setup', { text: '~$2,500', bold: true }],
      [{ text: 'ENTRY PROGRAM — the easy yes', bold: true, color: GREEN }, 'Year-1 total', { text: '≈ $12,700', bold: true, color: GREEN }],
    ], { headerColor: DARK_CHARCOAL }),
  p('Modeled against the entry, the likely first-year return is roughly 3× — built on hours recovered and a handful of extra trips, with the real figures calibrated to your numbers at discovery. Productized My SEO rates are real and published; My AI is an estimate confirmed at quote. We do not invent prices.', { italics: true, size: 19, spaceAfter: 110 }),

  subHeader('The first 90 days, and the next step'),
  p('A fixed-scope 90-Day Visibility & Time Pilot stands up your get-found foundation and one working AI time-saver — with no long lock-in. If it is not creating visible lift and saving you real hours by day 90, we will tell you honestly whether to continue.', { spaceAfter: 60, keepNext: true }),
  diagramImage(diagBuf('timeline.png'), '30/60/90-day roadmap', 600),
  calloutBox('Start the conversation',
    ['A short discovery call is the easiest first step — no obligation, and we are local in Irvine. The full blueprint goes deeper and ends with a short questionnaire that turns this summary into a costed, calibrated plan.',
     'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  +1 949.379.8499  ·  technijian.com  ·  technology as a solution'], CORE_BLUE),
];

const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 124, height: Math.round(124 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Pangea Luxe Travel  ·  Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  +1 949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const doc = new Document({
  creator: 'Technijian', title: 'Pangea Luxe Travel — Executive Summary', description: 'Forwardable executive summary for Pangea Luxe Travel, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [{ id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 260, after: 110 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 230 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1700, right: MARGIN, bottom: 1320, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children }],
});
const outPath = path.join(__dirname, 'Pangea-Luxe-Executive-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
