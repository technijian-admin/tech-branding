// China Auto Group (CAG) — Executive Summary (forwardable hook artifact). FACTS-ONLY.
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
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 22, 2026';
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
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [new TextRun({ text: it.number, size: 34, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
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
  centered('China Auto Group', { size: 40, color: DARK_CHARCOAL, bold: true, after: 80 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI Growth & Integration — win more accounts, source faster, lower the risk', size: 21, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 170 }, children: [new TextRun({ text: 'Prepared for China Auto Group  ·  ' + TODAY + '  ·  Confidential', size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  kpiRow([
    { number: '70+ yrs', label: 'Combined aftermarket experience (company)', color: CORE_BLUE },
    { number: '25%', label: 'U.S. tariff on China auto parts (Sec. 301)', color: CORE_ORANGE },
    { number: '~90%', label: 'Of business that is custom development', color: TEAL },
    { number: 'US·EU·China', label: 'Sales & sourcing offices', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  p('China Auto Group — a trade name of S. Kirby & Company, Inc., in Rancho Santa Margarita, California — is a turnkey China-sourcing partner for the automotive industry: it identifies the factory, engineers and samples the part, manages production and quality, clears customs as the U.S. importer of record, finances in U.S. dollars, and delivers “Landed Your Warehouse.” That job — de-risking China sourcing — has never been harder, or more valuable, than in 2026. This summary shows where AI builds on the firm’s real operational base (Acctivate, engineering, a Shanghai quality office) on two fronts, and states only verified facts, deferring every company-specific number to discovery.', { spaceAfter: 120 }),
  pRuns([{ text: 'Win more accounts. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI authority content makes China Auto Group the cited expert buyers find for sourcing under tariffs and China+1; account and trigger intelligence and faster quotes help win and keep the aftermarket, OE, Tier 1/2, and performance accounts the business runs on.' }, { text: '  Source faster and lower the risk. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI that classifies a part to its tariff code, models landed cost across China, Vietnam, Mexico, and India, drafts quotes and RFQs in minutes, and assembles PPAP and customs paperwork — with a qualified person confirming every classification and quote, and all proprietary data in private, governed systems.' }], { spaceAfter: 60 }),

  subHeader('What we verified'),
  bulletRuns([{ text: 'A U.S.-accountable, turnkey sourcing partner: ', bold: true, color: DARK_CHARCOAL }, { text: 'identify factory, negotiate, engineer, QC, ship, clear customs as importer of record, finance in USD, and warehouse — “we work for our customers, not for factories.”' }]),
  bulletRuns([{ text: 'A real operational base already: ', bold: true, color: DARK_CHARCOAL }, { text: 'Acctivate for inventory and order management, engineering/design software, and a Shanghai office with an IATF-16949-qualified engineer for on-site quality.' }]),
  bulletRuns([{ text: 'Automotive-specialized, U.S.-domiciled: ', bold: true, color: DARK_CHARCOAL }, { text: 'a hard-to-copy corner — generalists are turnkey but not auto experts; marketplaces are cheap but transfer no risk; inspection firms cover one step.' }]),
  bulletRuns([{ text: 'A quiet digital front door: ', bold: true, color: DARK_CHARCOAL }, { text: 'a dated brochure website, no published expertise, and near-invisibility to AI search — exactly when buyers are searching for tariff help. The lowest-cost place to start.' }]),
  calloutBox('The one idea', 'Sourcing from China is harder every quarter, and the buyers who used to do it themselves increasingly cannot. That makes a U.S.-accountable, automotive-specialized partner who can classify, cost, and qualify across countries faster than anyone else more valuable, not less — and AI is the multiplier on exactly that work. China Auto Group already owns the hard-to-copy corner; AI widens the moat.', TEAL),

  subHeader('The engine'),
  p('Three columns: win more accounts, classify-cost-and-quote faster with AI, and automate the sourcing back office around Acctivate — each delivered by a specific Technijian service.', { spaceAfter: 60, keepNext: true }),
  diagramImage(diagBuf('architecture.png'), 'AI growth and integration engine', 430),

  subHeader('Investment & the path forward'),
  pRuns([{ text: 'No invented numbers. ', bold: true, color: DARK_CHARCOAL }, { text: 'We price from real, published Technijian service ranges and model ROI only after discovery — on hours recovered per quote and classification, faster turnaround, and landed-cost savings captured, never a guessed revenue figure. The path is land-and-expand: prove one automation — the tariff-classification and landed-cost engine is the highest-conviction first build — then scale across the back office.' }], { spaceAfter: 100 }),
  p('The easiest first step is a short discovery call, with no obligation — or a half-day AI Readiness Assessment that maps your workflows and returns a prioritised, costed roadmap. We are in Irvine, about 25 minutes away. The full blueprint ends with a questionnaire that turns this summary into a costed plan.', { spaceAfter: 110 }),
  calloutBox('Start the conversation', 'Ravi Jain, Founder & CEO  ·  rjain@technijian.com  ·  +1 949.379.8499  ·  technijian.com  ·  technology as a solution', CORE_BLUE),
];

const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 124, height: Math.round(124 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'China Auto Group  ·  Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  +1 949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const doc = new Document({
  creator: 'Technijian', title: 'China Auto Group — Executive Summary', description: 'Forwardable executive summary for China Auto Group, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [{ id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 260, after: 110 }, outlineLevel: 1 } }] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 230 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1700, right: MARGIN, bottom: 1320, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children }],
});
const outPath = path.join(__dirname, 'China-Auto-Group-Executive-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
