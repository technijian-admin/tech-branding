// Santa Fe Christian Schools (SFC) — Executive Summary (forwardable hook artifact). FACTS-ONLY.
// Pricing-light (scoped after assessment). Reuses architecture.png + timeline.png.
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
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 180, bottom: 180, left: 60, right: 60 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: it.number, size: 36, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 14, color: BRAND_GREY, font: FONT_BODY })] }),
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
  centered('Santa Fe Christian Schools', { size: 40, color: DARK_CHARCOAL, bold: true, after: 80 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Managed IT, Security & AI — solve the project on your desk, then run and secure the school', size: 20, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 170 }, children: [new TextRun({ text: 'Prepared for Rob Honma, CTO  ·  ' + TODAY + '  ·  Confidential', size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '1977', label: 'Founded · ~50 years, K-12', color: CORE_BLUE },
    { number: '~1,100', label: 'Students, one campus', color: CORE_ORANGE },
    { number: '82%', label: 'Of K-12 schools hit by a cyber incident', color: CRITICAL },
    { number: 'Jun 16', label: '3CX V20 U9 went Final — brand-new', color: TEAL },
  ]),
  spacer(150),
  p('Santa Fe Christian Schools is a K-12, Christ-centered college-preparatory school in Solana Beach, founded in 1977 and serving roughly 1,100 students on one campus. The school reached out with a specific, current need: help configuring 3CX V20 Update 9 — the phone system — to work cleanly through a Check Point firewall with a Twilio SIP trunk. This summary shows how Technijian solves that today, and where a partner builds from there — stating only verified facts and deferring every school-specific number to a short discovery call.', { spaceAfter: 120 }),
  pRuns([{ text: 'Solve today, then run and secure the school. ', bold: true, color: DARK_CHARCOAL }, { text: 'Update 9 reached Final release on June 16, 2026 — about a week before this summary — and getting a brand-new PBX release past an enterprise firewall and a hosted trunk is fiddly the first time and routine for a team that has done it often. From there, co-managed IT keeps your team in charge while we add help-desk overflow, 24/7 monitoring, and project muscle a lean team cannot staff alone.' }, { text: '  Integrate AI for time and enrollment. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI assists staff with parent communications, admissions follow-up, and routine documents — and helps the right families find the school. A person reviews anything a family sees, and student data stays in private, governed tools.' }], { spaceAfter: 60 }),

  subHeader('What we verified'),
  bulletRuns([{ text: 'A credentialed school, a credentialed CTO: ', bold: true, color: DARK_CHARCOAL }, { text: 'a K-12 Christ-centered college-prep school (founded 1977; WASC / ACSI / CESA; multiple National Blue Ribbon awards), led in technology by an award-winning, ITIL-certified CTO running a lean team.' }]),
  bulletRuns([{ text: 'A real, current project: ', bold: true, color: DARK_CHARCOAL }, { text: '3CX V20 Update 9 (Final June 16, 2026) behind a Check Point firewall with a Twilio trunk — a documented, recurring configuration challenge, and an ideal first win.' }]),
  bulletRuns([{ text: 'A lean IT function: ', bold: true, color: DARK_CHARCOAL }, { text: 'one strong technology leader with little visible depth beneath — the textbook case for co-managed support, not full outsourcing.' }]),
  bulletRuns([{ text: 'An honest compliance picture: ', bold: true, color: DARK_CHARCOAL }, { text: 'funding-tied mandates (FERPA, CIPA) may not legally bind a private school, but obligations still arrive through ed-tech apps, tuition payments, and — most firmly — cyber-insurance requirements.' }]),
  calloutBox('The one idea', 'Start with the problem on your desk. Solving the 3CX / Check Point / Twilio configuration is a small, concrete proof of how Technijian works — and the natural window into a co-managed partner that runs and secures the school’s IT and helps staff do more with the hours they have. Co-managed means we work for your team, not instead of it.', TEAL),

  subHeader('One partner, three jobs'),
  p('Run the school’s IT, secure it and protect student data, and save staff time and help enrollment — each delivered by a specific Technijian service.', { spaceAfter: 60, keepNext: true }),
  diagramImage(diagBuf('architecture.png'), 'One partner, three jobs', 600),

  subHeader('A staged path — and a small first step'),
  p('We solve the phone-and-firewall project first, run a free Nexus Assess alongside it, then secure and comply, then optimize. We price from real, market-typical ranges with education pricing where eligible — no invented numbers, and the larger program scoped only after the free assessment.', { spaceAfter: 90 }),
  buildTable(
    [{ label: 'First step', weight: 52 }, { label: 'What it is', weight: 26 }, { label: 'Commitment', weight: 22 }],
    [
      [{ text: 'Solve 3CX / Check Point / Twilio', bold: true, color: CORE_BLUE }, 'A scoped project', { text: 'Small, defined', bold: true }],
      [{ text: 'Free Nexus Assess', bold: true, color: GREEN }, 'Security & risk read', { text: 'None — free', bold: true, color: GREEN }],
      [{ text: 'Right-sized co-managed proposal', bold: true, color: DARK_CHARCOAL }, 'Only the layers you want', { text: 'You decide', bold: true }],
    ], { headerColor: DARK_CHARCOAL }),
  p('Productized services such as managed email security carry real published rates (My AntiSpam, $4.75 / user / mo); everything else is scoped from data after the free assessment. We do not invent prices.', { italics: true, size: 19, spaceAfter: 100, spaceBefore: 60 }),
  diagramImage(diagBuf('timeline.png'), 'Staged roadmap — stabilize, secure, optimize', 600),
  calloutBox('Start the conversation',
    ['The easiest first step is to let us solve the phone-and-firewall project and book a free Nexus Assess alongside it — no obligation, and we are local in Southern California. The full brief goes deeper and ends with a short questionnaire that turns this summary into a costed, calibrated plan.',
     'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  949.379.8499  ·  technijian.com  ·  technology as a solution'], CORE_BLUE),
];

const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 124, height: Math.round(124 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Santa Fe Christian Schools  ·  Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const doc = new Document({
  creator: 'Technijian', title: 'Santa Fe Christian Schools — Executive Summary', description: 'Forwardable executive summary for Santa Fe Christian Schools, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [{ id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 260, after: 110 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 230 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1700, right: MARGIN, bottom: 1320, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children }],
});
const outPath = path.join(__dirname, 'SFC-Executive-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
