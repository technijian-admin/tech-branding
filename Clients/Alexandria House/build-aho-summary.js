// Alexandria House (AHO) — Executive Summary (forwardable 3-4pp hook artifact)
// Distilled from the full blueprint. FACTS-ONLY, self-reported figures attributed. Authentic logo.
// Mission-respectful nonprofit voice; the reframe: NOT managed IT, but AI for mission growth.

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
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 16, 2026';
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
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: it.number, size: 40, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = o; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }
function pngDims(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function diagramImage(buf, alt, widthPx = 580) { if (!buf) return new Paragraph({ children: [new TextRun('')] }); const { w, h } = pngDims(buf); return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 60 }, keepNext: true, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx * h / w) }, altText: { title: alt, description: alt, name: alt } })] }); }

const children = [
  colorBar(CORE_BLUE, 130), spacer(220),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 250, height: Math.round(250 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(200),
  centered('EXECUTIVE SUMMARY', { size: 22, color: CORE_ORANGE, bold: true, after: 90 }),
  centered('Alexandria House', { size: 42, color: DARK_CHARCOAL, bold: true, after: 80 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth Blueprint — raise more, win more grants, reach more families, recover staff time', size: 21, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 170 }, children: [new TextRun({ text: 'Prepared for Alexandria House  ·  ' + TODAY + '  ·  Confidential', size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '1996', label: 'Founded · Sister Judy Vaughan, CSJ', color: CORE_BLUE },
    { number: '315', label: 'Children served since 1996 (org-reported)', color: CORE_ORANGE },
    { number: '~83%', label: 'Revenue from contributions (FY2024)', color: TEAL },
    { number: '>92%', label: 'Families retained in housing (org-reported)', color: GREEN },
  ]),
  spacer(150),
  calloutBox('First — this is not about replacing your network team',
    'You told us you already have your network team in place. Keep them. This is not a managed-IT proposal. It is about using AI to raise more money, win more grants, reach families in Spanish as well as English, and return staff time to the mission — work your IT team does not do, and where a small, donation-funded organization gains the most.', CORE_ORANGE),
  p('Since 1996, Alexandria House has been a transitional residence and house of hospitality for women and children moving out of homelessness in central Los Angeles, surrounding families with a "Circle of Support" across housing, economic opportunity, food, child care, wellness, and lifelong alumni support. This summary shows where AI creates measurable value — and states only verified facts, attributing what the organization reports about itself and deferring company-specific numbers to discovery.', { spaceBefore: 120, spaceAfter: 120 }),
  pRuns([{ text: 'Grow support. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI helps research and draft grants, find and re-engage donors, and personalize bilingual appeals — so staff spend scarce hours on the relationships and arguments that win gifts.' }, { text: '  Reach and serve better. ', bold: true, color: DARK_CHARCOAL }, { text: 'A Spanish-language website your families can actually read, automated impact and funder reporting, and a volunteer chatbot for routine questions. The rule never changes: AI drafts and researches; a person verifies every claim and owns every relationship.' }], { spaceAfter: 60 }),

  subHeader('What we verified'),
  bulletRuns([{ text: 'A trusted, established mission: ', bold: true, color: DARK_CHARCOAL }, { text: 'founded 1996 by Sister Judy Vaughan, CSJ; 501(c)(3) (EIN 95-4809755); led by ED Marissa Espinoza since July 2022; permanent affordable housing across a 16-unit and a 39-unit building.' }]),
  bulletRuns([{ text: 'Donation-dependent and under pressure: ', bold: true, color: DARK_CHARCOAL }, { text: 'about 83% of FY2024 revenue was contributions and grants, and the organization spent more than it took in for the year while scaling the 39-unit building — as HUD suspended federal homelessness funds through the regional agency in June 2026.' }]),
  bulletRuns([{ text: 'Capable, not lost: ', bold: true, color: DARK_CHARCOAL }, { text: 'a solid all-in-one platform, a ~15,000-follower Instagram, modern event fundraising, and a Charity Navigator rating — a strong base to build on.' }]),
  bulletRuns([{ text: 'The clearest gap is the wedge: ', bold: true, color: DARK_CHARCOAL }, { text: 'an English-only website in a heavily Latino and Korean neighborhood, with strong outcomes (the 92%) invisible to search and AI assistants — fixable, and the best place to start.' }]),
  calloutBox('A few corrections we made for accuracy', 'We discarded all figures belonging to a separate Minnesota organization (Alexandra House, Inc.), confirmed the founder’s order as the Sisters of St. Joseph of Carondelet, and set aside one outsized single-year revenue figure in a public database that appears to be a data artifact. That is the standard of evidence behind every figure here.', TEAL),

  subHeader('The engine'),
  p('Three columns — be found and tell the story, raise more and win grants, and serve families and report impact — each delivered by a specific Technijian service, and much of the enabling technology free or granted to nonprofits.', { spaceAfter: 60 }),
  diagramImage(diagBuf('architecture.png'), 'AI growth engine', 600),

  subHeader('Investment & the path forward'),
  pRuns([{ text: 'Affordable by design, no invented numbers. ', bold: true, color: DARK_CHARCOAL }, { text: 'We lean first on free and granted nonprofit technology — including up to $10,000 a month in free Google search ads and free Google Workspace — price the rest from real published ranges, and model returns only after discovery, in dollars raised and hours recovered rather than a revenue multiple. The path is start-small: prove one automation and a Spanish page, then grow as each step proves out.' }], { spaceAfter: 100 }),
  p('The easiest first step is a short working session on where AI creates measurable value for Alexandria House — no obligation. The full blueprint ends with a structured questionnaire, "Questions to Complete the Analysis," that turns this summary into a costed, calibrated plan scoped to your budget and grant cycles.', { spaceAfter: 110 }),
  calloutBox('Start the conversation', 'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  949.379.8499  ·  technijian.com  ·  technology as a solution', CORE_BLUE),
];

const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 124, height: Math.round(124 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Alexandria House  ·  Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const doc = new Document({
  creator: 'Technijian', title: 'Alexandria House — Executive Summary', description: 'Forwardable executive summary for Alexandria House, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [{ id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 260, after: 110 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 230 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1700, right: MARGIN, bottom: 1320, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children }],
});
const outPath = path.join(__dirname, 'Alexandria-House-Executive-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
