// Rayco Exteriors (RAY) — Executive Summary (forwardable 3-4pp hook artifact)
// Distilled from the full blueprint. FACTS-ONLY, review/market figures attributed, SB 326/721 stated exactly.
// Account-based, for-profit voice; the reframe: NOT managed IT/security, but AI to get found & win bids.

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
const CRITICAL = strip(tokens.color.status.critical.$value);
const GREEN = '28A745';
const GOLD = 'C9922A';
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 23, 2026';
const DIAG = path.join(__dirname, 'diagrams');
const diagBuf = (n) => fs.existsSync(path.join(DIAG, n)) ? fs.readFileSync(path.join(DIAG, n)) : null;

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ keepNext: true, spacing: { before: s, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 130 } = o; return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 318 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] }); }
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
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 180, bottom: 180, left: 80, right: 80 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: it.number, size: 38, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = o; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }
function pngDims(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function diagramImage(buf, alt, widthPx = 580) { if (!buf) return new Paragraph({ children: [new TextRun({ text: '' })] }); const { w, h } = pngDims(buf); return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 60 }, keepNext: true, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx * h / w) }, altText: { title: alt, description: alt, name: alt } })] }); }

const children = [
  colorBar(CORE_BLUE, 130), spacer(220),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 250, height: Math.round(250 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(200),
  centered('EXECUTIVE SUMMARY', { size: 22, color: CORE_ORANGE, bold: true, after: 90 }),
  centered('Rayco Exteriors', { size: 40, color: DARK_CHARCOAL, bold: true, after: 80 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth & Bid-Intelligence Blueprint — get found and trusted, win more HOA reconstruction bids', size: 21, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 170 }, children: [new TextRun({ text: 'Prepared for Gabe Cooley, President — Rayco Exteriors  ·  ' + TODAY + '  ·  Confidential', size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '3,500+', label: 'communities & buildings (self-reported)', color: CORE_BLUE },
    { number: 'B + C-33', label: 'licensed general & painting', color: CORE_ORANGE },
    { number: 'SB 326', label: 'every 9 yrs (first due 1/1/2025)', color: TEAL },
    { number: 'OC + SD', label: 'core market (NorCal expanding)', color: GREEN },
  ]),
  spacer(150),
  calloutBox('First — this is not a managed-IT or security pitch',
    'When we first reached out we led with managed IT and a free security assessment, and you replied you don’t have a current need for that. Fair enough — this is something different and, for a firm like Rayco, more valuable: using AI to get found by the community managers who hire reconstruction contractors, and to win more of the bids you already compete for. That is commercial growth, not IT — the front office, never the field.', CORE_ORANGE),
  p('Rayco Exteriors restores the building envelope of multifamily, HOA, and commercial properties — exterior rehab, painting and waterproofing, dry-rot and structural wood repair, deck and balcony reconstruction, stucco, railings, and siding. With a decade-plus track record, a self-reported 3,500-plus communities completed, a B and C-33 license, and CACM and CAI memberships, the work and the relationships are real. This summary states only verified facts, attributes all review and market figures, and defers company-specific numbers to discovery.', { spaceBefore: 120, spaceAfter: 120 }),
  pRuns([{ text: 'The opportunity is not the craft — it is being found and trusted by the people who hire you. ', bold: true, color: DARK_CHARCOAL }, { text: 'Rayco wins through a knowable universe of community managers, boards, and the construction managers who write the specs — yet its public reputation is thin where they look: a reported 3.4-star, 27-review Google profile sits well below competitors with hundreds of reviews, there is no content hub (the /resources and /careers pages error out), and Rayco does not surface in the AI answers a manager increasingly asks first. The plan has two parts: ' }, { text: 'be found and trusted ', bold: true, color: DARK_CHARCOAL }, { text: '— a modern site with board-ready SB 326 content, a reputation engine, and authority content; and ' }, { text: 'win more bids ', bold: true, color: DARK_CHARCOAL }, { text: '— AI that watches the SB 326 cycle and the management portfolios, flags who is sourcing now, and drafts the spec responses. AI works the front end and drafts; your team owns every relationship and verifies every claim — and it never touches the field reconstruction.' }], { spaceAfter: 60 }),

  subHeader('What we verified'),
  bulletRuns([{ text: 'A real reconstruction firm: ', bold: true, color: DARK_CHARCOAL }, { text: 'a self-reported 3,500-plus communities and buildings; a B-1019483 general and C-33 painting license; a full envelope service set; CACM Industry Partner (Plus) and CAI-OC memberships; an Escondido base serving OC and San Diego.' }]),
  bulletRuns([{ text: 'A market on a legal clock: ', bold: true, color: DARK_CHARCOAL }, { text: 'SB 326 requires HOA balcony inspections — first due January 1, 2025, then every nine years — and SB 721 puts apartments on a six-year cycle (first due January 1, 2026). Inspectors diagnose; they do not repair. Rayco’s service lines map almost exactly onto the mandated repair scope.' }]),
  bulletRuns([{ text: 'The gap is reach and reputation, not craft: ', bold: true, color: DARK_CHARCOAL }, { text: 'a reported 3.4-star / 27-review profile, no content engine, and weak presence in AI answers — while better-reviewed competitors take the calls when a manager searches.' }]),
  bulletRuns([{ text: 'Honest about the facts: ', bold: true, color: DARK_CHARCOAL }, { text: 'we leave the founding year open (sources disagree — 2008 on LinkedIn, 2016 on the business registration), label review counts "reported," and cite no revenue figure because none is public and verified.' }]),
  calloutBox('A note on precision', 'We will be precise even where it is inconvenient — leaving the founding year as a discovery item rather than picking one, and labeling third-party review counts "reported." That precision is the standard behind every figure here, and it is how a bid stays credible with a sophisticated buyer.', TEAL),

  subHeader('The engine'),
  p('Three columns — be found and trusted, win more bids, and respond and operate faster — each delivered by a specific Technijian service, with AI kept entirely on the commercial front end.', { spaceAfter: 60 }),
  diagramImage(diagBuf('architecture.png'), 'AI growth and bid-intelligence engine', 600),

  subHeader('Investment & the path forward'),
  pRuns([{ text: 'Priced from real ranges, no invented numbers. ', bold: true, color: DARK_CHARCOAL }, { text: 'We price from published My SEO / My AI / My Dev ranges, start small — be found and trusted first, because it is the cheapest, fastest win and it lifts every bid that follows — and model returns only after discovery. For a project-based firm, return is value at stake: a single additional reconstruction contract, or one management-company portfolio opened, is worth far more than a year of this engine, so it pays for itself if it wins even one bid that would never have reached you.' }], { spaceAfter: 100 }),
  p('The easiest first step is a short working session on where AI creates measurable value for Rayco — no obligation, and nothing about managed IT. The full blueprint ends with a structured questionnaire, "Questions to Complete the Analysis," that turns this summary into a costed, calibrated plan scaled to your firm. And if the answer is "not now," we will respect it.', { spaceAfter: 110 }),
  calloutBox('Start the conversation', 'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  949.379.8499  ·  technijian.com  ·  technology as a solution', CORE_BLUE),
];

const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 124, height: Math.round(124 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rayco Exteriors  ·  Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const doc = new Document({
  creator: 'Technijian', title: 'Rayco Exteriors — Executive Summary', description: 'Forwardable executive summary for Rayco Exteriors, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [{ id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 260, after: 110 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 230 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1700, right: MARGIN, bottom: 1320, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children }],
});
const outPath = path.join(__dirname, 'Rayco-Exteriors-Executive-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
