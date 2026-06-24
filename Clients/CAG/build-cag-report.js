// China Auto Group (CAG) — AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY: verified facts, estimates labeled,
// unknowns -> Questions section. Authentic logo. Orange County China-sourcing partner for automotive.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  TabStopType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, TableOfContents
} = require('C:/vscode/tech-branding/tech-branding/node_modules/docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const CHARTREUSE = strip(tokens.color.secondary.chartreuse.$value);
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
const TODAY = 'June 22, 2026';
const DIAG = path.join(__dirname, 'diagrams');
const diagBuf = (n) => fs.existsSync(path.join(DIAG, n)) ? fs.readFileSync(path.join(DIAG, n)) : null;

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ keepNext: true, spacing: { before: s, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, o = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function pRuns(runs, o = {}) {
  const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true, spacing: { before: 0, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [headingPara, visual, spacer(120)];
}
function plainHeader(text, color = CORE_BLUE) {
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: 1 })] }), visual, spacer(120)];
}
function subHeader(text, color = CORE_BLUE) { return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 300, after: 130 }, children: [new TextRun({ text, size: 27, bold: true, color, font: FONT_HEAD })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, spacing: { before: 220, after: 90 }, children: [new TextRun({ text, size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }); }
const NB = 'bullets';
function bullet(text, o = {}) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...o })] }); }
function bulletRuns(runs) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) }); }
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const arr = Array.isArray(body) ? body : [body];
  const bodyParas = arr.map((b, i) => new Paragraph({ keepNext: i < arr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
    new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
  ] })] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 40, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, o = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = o;
  const totalW = columns.reduce((s, c) => s + c.weight, 0);
  const cw = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalW)));
  cw[cw.length - 1] += CONTENT_W - cw.reduce((s, w) => s + w, 0);
  const hc = columns.map((c, i) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 110, bottom: 110, left: 130, right: 130 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 19, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dr = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const co = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    const texts = Array.isArray(co.text) ? co.text : [co.text];
    const paras = texts.map(t => new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, spacing: { before: 0, after: 30, line: 276 }, children: [new TextRun({ text: t, size: 19, color: co.color || BRAND_GREY, bold: co.bold || false, italics: co.italics || false, font: FONT_BODY })] }));
    return new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 90, bottom: 90, left: 130, right: 130 }, verticalAlign: VerticalAlign.TOP, children: paras });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cw, rows: [new TableRow({ tableHeader: true, children: hc }), ...dr] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = o; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }
function pngDims(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function diagramImage(buf, alt, widthPx = 600) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const { w, h } = pngDims(buf);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx * h / w) }, altText: { title: alt, description: alt, name: alt } })] });
}
function caption(text) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 220 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }

// ============================================================ COVER
const cover = [
  colorBar(CORE_BLUE, 200), spacer(780),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(320),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }), spacer(210),
  centered('AI GROWTH & INTEGRATION', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('BLUEPRINT', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('China Auto Group', { size: 50, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Where AI wins more accounts and makes China sourcing faster and lower-risk — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(820),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Jason Kirby, VP Operations & Logistics — and the China Auto Group leadership team', { size: 21, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR CHINA AUTO GROUP LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('This blueprint was prepared from public research, before any technical discovery. It holds itself to a simple discipline:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about China Auto Group is drawn from the company’s own website, business directories, and trade and tariff sources, and is cited in the Appendix. We have not assumed your revenue, order volume, or headcount.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Tariff figures and market context are facts about the trade environment, not claims about your results; ROI ranges are clearly marked as estimates. The real numbers come from discovery.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('Two things we were careful about',
    ['First, titles and roles: we use China Auto Group’s own Management page — Jason Kirby as VP, Operations & Logistics; Stephen Kirby as Founder & President — rather than third-party data brokers, which conflate the family’s résumés. Second, this is not a firm “without technology”: you already run Acctivate as your operational system of record, with engineering software and a Shanghai office for on-site quality. This blueprint is therefore about going further with AI, not starting from zero.',
     'That is the standard of evidence behind every statement here.'], TEAL),
];

// ============================================================ TOC (live field — Word fills page numbers)
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', {
    hyperlink: true,
    headingStyleRange: '1-1',
  }),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('China Auto Group — a trade name of S. Kirby & Company, Inc., based in Rancho Santa Margarita, California — is a turnkey China-sourcing partner for the automotive industry. A buyer hands over a part requirement; China Auto Group identifies the factory, negotiates, engineers and samples, manages production and quality, consolidates and ships, clears customs as the U.S. importer of record, finances in U.S. dollars, and delivers landed to the buyer’s warehouse. Its stated principle is plain: “we work for our customers, not for factories.”', { spaceAfter: 120 }),
  p('That business — de-risking China sourcing for automotive buyers — has never been harder to do, or more valuable, than it is in 2026. This blueprint works on two fronts (Sections 10 and 11 detail both):', { spaceAfter: 120 }),
  kpiRow([
    { number: '70+ yrs', label: 'Combined aftermarket experience (company-cited)', color: CORE_BLUE },
    { number: '25%', label: 'U.S. Section 301 tariff on China auto parts', color: CORE_ORANGE },
    { number: '~90%', label: 'Of business that is custom development (company)', color: TEAL },
    { number: 'US · EU · China', label: 'Sales & sourcing offices', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'Front one — win more accounts. ', bold: true, color: DARK_CHARCOAL }, { text: 'China Auto Group’s buyers are a finite, knowable universe — aftermarket brands, OE and Tier 1/2 manufacturers, and performance brands — so growth is account-based, not broad advertising. AI authority content makes the firm the cited expert buyers find when they search “how to source auto parts from China under tariffs,” and account and trigger intelligence plus faster quotes help win and keep the accounts the business is built on.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — quote and source faster, and run leaner. ', bold: true, color: DARK_CHARCOAL }, { text: 'This is where sourcing returns the most: AI that classifies a part to its tariff code, models landed cost across China, Vietnam, Mexico, and India, drafts quotes and RFQs in minutes, assembles PPAP and customs paperwork, and tracks orders on top of Acctivate. A qualified person still confirms every classification, quote, and commitment, and your proprietary data stays in private, governed systems.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is conservative on purpose. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented revenue figure or a guessed ROI here — your financials are not public, so we cite none. Investment is shown as real, published Technijian service ranges; returns are modeled only after discovery calibrates them against your real volumes, hours, and quote turnaround (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'Sourcing from China is harder every quarter — higher tariffs, classification risk, and the pressure to qualify a second country. The buyers who used to do it themselves increasingly cannot. That makes a U.S.-accountable, automotive-specialized partner who can classify, cost, and qualify across countries faster than anyone else more valuable, not less — and AI is the multiplier on exactly that work. China Auto Group already owns the hard-to-copy corner; AI widens the moat.', CORE_ORANGE),
];

// ============================================================ SEC 01 — COMPANY & POSITION
const section1 = [
  ...sectionHeader('The Company & Market Position', CORE_BLUE, '01'),
  p('Everything in this section is drawn from China Auto Group’s own website, business directories, and trade sources (see Appendix). Where directories carry estimated figures, we label them and defer to discovery.', { spaceAfter: 130 }),
  subHeader('A U.S.-accountable partner for China sourcing'),
  p('China Auto Group is an Orange County firm that sources automotive parts and components from China on behalf of buyers in the U.S. and Europe — and, crucially, does it as the U.S. importer of record, so its customers transact with a domestic corporation rather than directly with overseas factories. The company describes a turnkey scope: identify the factory from a database of hundreds of member factories, negotiate price, engineer and sample the part, schedule and monitor production, run quality control with China-based engineers, consolidate and ship, clear customs, finance in U.S. dollars on open account, and warehouse for just-in-time delivery. Prices are quoted “Landed Your Warehouse,” and the company states customers carry no contingent liability for future duty or dumping charges.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Attribute', weight: 24 }, { label: 'Verified fact', weight: 76 }],
    [
      [{ text: 'Identity', bold: true }, 'China Auto Group — a trade name of S. Kirby & Company, Inc.; headquarters in Rancho Santa Margarita, CA (Orange County).'],
      [{ text: 'Footprint', bold: true }, 'U.S. sales offices in Los Angeles, Detroit, and Dallas/Fort Worth; an office in Hamburg, Germany; and a Shanghai, China office for factory-partner communication and on-site quality.'],
      [{ text: 'What they do', bold: true }, 'Turnkey China sourcing for automotive: supplier identification, negotiation, product engineering, production management, quality assurance, logistics, import administration (importer of record), U.S.-dollar financing, and warehousing.'],
      [{ text: 'Products', bold: true }, 'HVAC, electrical/electronic, engine, brake, suspension, interior parts and accessories, and tools/equipment — “virtually the entire automotive parts components field.” The company states custom development is roughly 90% of its business.'],
      [{ text: 'Leadership', bold: true }, 'Founder & President Stephen Kirby (40+ years in automotive parts; ex-President of Import Parts America; Auto International Hall of Fame, 1996); VP Operations & Logistics Jason Kirby; plus senior product, account, engineering (IATF-16949 auditor), customer-relations, and warehouse leads.'],
      [{ text: 'Operating system', bold: true }, 'Acctivate (inventory and order management) is the operational system of record, per a public customer reference.'],
      [{ text: 'Founded / scale / revenue', bold: true, color: CRITICAL }, 'Not something we assume. Business directories carry third-party estimates of founding year, headcount, and revenue; we treat all three as discovery items and cite none as fact.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your revenue, order volume, or headcount; your founding year; the mix of business across aftermarket, OE, Tier 1/2, and performance accounts; or which product lines are growing fastest. These are the questions in Section 14.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW THEY SERVE
const section2 = [
  ...sectionHeader('How China Auto Group Serves Its Customers', CORE_BLUE, '02'),
  p('China Auto Group sits between China’s factories and Western automotive buyers, and owns every link in between. Each link is a place where AI sharpens the edge.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How China Auto Group sources', 504),
  caption('Figure 02.0 — A U.S.-accountable, turnkey model: vet and engineer with China factories, manage quality and import, and deliver landed to the buyer’s warehouse.'),
  pRuns([{ text: 'A real operational base already exists. ', bold: true, color: DARK_CHARCOAL }, { text: 'The business runs on Acctivate for inventory and order management, uses engineering and design software for product development, and staffs a Shanghai office with an IATF-16949-qualified engineer for on-site quality. This is the single most important fact for an AI plan: the highest-value AI here reads from and writes to the process and systems the team already trusts — quoting, classification, quality documentation, and order tracking — rather than replacing them.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The work is expert, and much of it is still manual. ', bold: true, color: DARK_CHARCOAL }, { text: 'Finding the right factory, engineering a part to spec, classifying it for customs, modeling landed cost, assembling PPAP and inspection paperwork, and keeping a customer informed across a twelve-hour time difference is skilled work done largely by hand — and largely by a few long-tenured experts. That is exactly where AI returns the most: not by replacing the expertise, but by doing the repetitive 80 percent of it faster, so the experts spend their time on judgment and relationships.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — INDUSTRY & TRADE
const section3 = [
  ...sectionHeader('Industry & Trade Landscape', CORE_BLUE, '03'),
  p('China Auto Group operates at the centre of the most consequential force in its market — the U.S.–China trade relationship. The figures below are facts about that environment, not claims about the company, and nearly every one makes an expert, U.S.-accountable sourcing partner more valuable, not less. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '25%', label: 'Section 301 (List 3) duty on auto parts', color: CORE_BLUE },
    { number: 'Nov 2026', label: 'Current Section 301 exclusion expiry', color: CORE_ORANGE },
    { number: 'China+1', label: 'The default diversification strategy', color: TEAL },
    { number: '100%', label: 'U.S. tariff on Chinese EVs (2024) — direction of travel', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('Tariffs made sourcing harder — and expert sourcing more valuable'),
  p('Automotive parts from China carry a 25% Section 301 duty (List 3, in force since 2018 and raised to 25% in 2019), and that duty stacks on top of the normal (most-favored-nation) rate — so a part with a 2.5% base rate lands at roughly 27.5% before freight. The broader 2025–26 tariff picture is higher still and has shifted repeatedly, which is precisely the point: when duty rates are high and moving, the difference between a part classified correctly and one classified carelessly, or sourced from the right country, is real margin. A partner who quotes “Landed Your Warehouse” and carries the duty and dumping exposure — as China Auto Group does — is selling exactly what a tariff-era buyer needs.', { spaceAfter: 120 }),
  h3('China+1 is now the default procurement question'),
  p('The standard response to concentrated China exposure is “China+1” — keeping China where it still wins and qualifying a second source in Vietnam, India, Thailand, or Mexico. For a buyer that means modeling total landed cost and lead time across countries, re-qualifying factories, and re-doing the quality and compliance work — slow, expensive, and error-prone by hand. It is also precisely the multi-country sourcing and engineering work China Auto Group already does, which turns the industry’s biggest anxiety into the firm’s clearest opening.', { spaceAfter: 120 }),
  h3('The compliance burden is real — and automatable'),
  p('Behind every part is paperwork: tariff (HTS) classification, which is legally the importer’s responsibility under U.S. Customs’ “reasonable care” standard; PPAP and IATF 16949 quality documentation; country-of-origin and anti-dumping/countervailing-duty exposure; and commercial-invoice and customs records. A wrong classification is not a typo — it is underpaid duty, penalties, and liability. This is documentation-heavy, rules-based work: the kind AI drafts and screens fastest, with a qualified person confirming every entry.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'Every trade force points the same way. Sourcing from China has never been more complex, and the buyers who used to do it themselves increasingly cannot. That makes a U.S.-accountable, automotive-specialized partner who can classify, cost, and qualify across countries faster than anyone else more valuable each quarter — and AI is the multiplier on exactly that work.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where the Growth & Efficiency Live', CORE_BLUE, '04'),
  p('For a sourcing partner, value sits in four levers. AI supports each one without changing the relationship-and-expertise nature of the business.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 26 }, { label: 'What it looks like for China Auto Group', weight: 50 }, { label: 'Front', weight: 24 }],
    [
      [{ text: 'Win more accounts', bold: true, color: CORE_BLUE }, 'Land and keep more aftermarket, OE, Tier 1/2, and performance accounts — including faster, sharper responses to part inquiries and RFQs.', 'Growth'],
      [{ text: 'Be the expert buyers find', bold: true, color: CORE_BLUE }, 'Be cited and chosen for “how to source automotive parts from China under tariffs” and China+1 — through authority content and AI-search visibility the firm has none of today.', 'Growth'],
      [{ text: 'Quote & source faster', bold: true, color: CORE_BLUE }, 'Classify parts, model landed cost across countries, and turn requirements into quotes in minutes — so experts spend time on judgment, not paperwork.', 'Integration'],
      [{ text: 'Run the back office leaner', bold: true, color: CORE_ORANGE }, 'Automate quality documentation, order tracking, and East–West communication — the repetitive load behind every shipment.', 'Integration'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The account lever is account-based: China Auto Group already knows the kinds of companies it wins — so the plan is depth, timing, and faster quotes, not broad “lead generation.” The expert-visibility lever makes the firm the answer buyers find. And the two efficiency levers are usually the easiest place to start, because they save hours on work the team already does every day.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — SEGMENTS (personas)
const section5 = [
  ...sectionHeader('The Customer Segments', CORE_BLUE, '05'),
  p('China Auto Group serves a finite, knowable universe of automotive buyers — which is what makes its growth motion account-based rather than broad. The matrix maps the archetypes by order volume and value per relationship. These are research-based archetypes drawn from the team’s own account mandates, to calibrate at discovery — not your account list.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Customer segments matrix', 560),
  caption('Figure 05.0 — Buyer archetypes across the automotive supply chain. Bubble size approximates value per relationship.'),
  buildTable(
    [{ label: 'Segment', weight: 24 }, { label: 'What they need', weight: 40 }, { label: 'How AI helps China Auto Group serve them', weight: 36 }],
    [
      [{ text: 'Aftermarket Brand / Distributor', bold: true, color: CORE_BLUE }, 'Competitive landed cost, dependable quality, and catalog breadth for parts they resell or private-label.', 'Faster quotes and landed-cost models; supplier options; reliable quality documentation.'],
      [{ text: 'OE / OEM Manufacturer', bold: true, color: CORE_ORANGE }, 'Custom components engineered to spec, with full traceability and PPAP.', 'AI-assembled quality/PPAP packages; spec and RFQ drafting; classification accuracy.'],
      [{ text: 'Tier 1 / Tier 2 Supplier', bold: true, color: TEAL }, 'Cost-down on sub-components without quality risk, plus capacity.', 'China+1 landed-cost scenarios; supplier risk-scoring; IATF documentation.'],
      [{ text: 'Specialty / Performance Brand', bold: true, color: GREEN }, 'Design help, small minimum runs, and speed on niche parts.', 'Fast spec and quote drafting; supplier discovery for low-volume custom runs.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your account list. Which segments matter most — by volume, by margin, by growth priority — is a discovery question. And the “China+1 diversifier” is a trigger that can appear in any of them: a buyer whose tariff exposure just forced a sourcing rethink is the warmest conversation you can have right now.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE
const section6 = [
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  p('China Auto Group competes with four different kinds of player at once — and the way to read the field is not by size, but by two axes: how much of the sourcing risk the partner actually carries, and how deep its automotive specialization runs.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Competitive positioning: turnkey accountability vs automotive depth', 560),
  caption('Figure 06.0 — A strategic assessment (not a measured score). The top-right corner — turnkey accountability and automotive depth together — is largely unoccupied.'),
  buildTable(
    [{ label: 'Competitor type', weight: 24 }, { label: 'Examples', weight: 26 }, { label: 'Where they win / where they don’t', weight: 50 }],
    [
      [{ text: 'Generalist sourcing agencies', bold: true, color: CORE_BLUE }, 'Dragon Sourcing, Leeline Sourcing, Supplyia', 'Broad category coverage and real sourcing capability, but China-domiciled, category-agnostic, and typically not the U.S. importer of record — the buyer still carries more of the customs and accountability risk.'],
      [{ text: 'Marketplaces / DIY-direct', bold: true, color: CORE_BLUE }, 'Alibaba, Made-in-China.com, Global Sources', 'Cheapest and broadest, but the buyer owns all of it: telling a factory from a trading company, quality, language, customs, classification, and tariff exposure. This is the real “do it yourself” alternative.'],
      [{ text: 'Quality-inspection firms', bold: true, color: CORE_BLUE }, 'QIMA, SGS, Bureau Veritas', 'Strong at one slice — inspection — but not turnkey sourcing, engineering, import, or finance.'],
      [{ text: 'In-house buying office', bold: true, color: CORE_BLUE }, 'A buyer’s own China team', 'Maximum control and automotive depth, but high fixed cost — and the company still carries every quality, customs, and tariff risk itself.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and the moat',
    ['Few competitors combine all four of China Auto Group’s advantages: a U.S. entity that is the importer of record, deep automotive specialization, in-China engineering and quality, and “Landed Your Warehouse” pricing that removes the buyer’s currency, financing, and duty risk. Generalists are turnkey but not automotive experts; marketplaces are cheap but transfer no risk; inspection firms cover one step; an in-house office means the buyer does the work. China Auto Group occupies the corner that is hardest to copy.',
     'AI widens that moat. The firm’s edge is expert judgment applied fast and accurately — exactly what AI multiplies. A generalist agency wiring everything to one chatbot cannot match an automotive specialist whose AI is trained on its own classification, landed-cost, and quality work.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of China Auto Group’s public digital footprint, observed in June 2026. The headline is a sharp split: a capable, expert operation behind an almost-silent digital front door. For an account-based business that is not a crisis — but it is the clearest, lowest-cost place to start.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 24 }, { label: 'What we observed', weight: 50 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Operational systems', bold: true, color: CORE_BLUE }, 'Acctivate for inventory and order management, plus engineering/design software and a Shanghai quality office — a real working base.', 'Extend with AI, don’t replace.'],
      [{ text: 'Website', bold: true, color: CRITICAL }, 'A dated, multi-page brochure site (Home, About, Services, Products, Why Buy, Contact); informative, but no content engine, online quoting, or lead capture.', 'Refresh for credibility + AI search.'],
      [{ text: 'Content / market voice', bold: true, color: CRITICAL }, 'No blog, guidance, or published expertise — almost nothing for search or AI assistants to cite on a topic buyers are searching for right now.', 'Own the expert conversation.'],
      [{ text: 'AI-search visibility', bold: true, color: CRITICAL }, 'With no content and a thin site, the firm is effectively invisible to a buyer asking an assistant “who can help me source auto parts from China under tariffs?”', 'Be the cited answer.'],
      [{ text: 'LinkedIn / social', bold: true }, 'A limited presence; the company has posted at least one role (an Aftermarket Parts Specialist).', 'A consistent, expert presence.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most useful finding',
    'A firm with decades of automotive sourcing expertise publishes none of it — at the exact moment buyers are searching for help navigating tariffs and China+1. That gap is not a weakness to hide; it is the lowest-cost growth lever available, because the expertise to fill it already exists inside the business. (We deliberately cite no follower or review count — those numbers are routinely wrong in cold research; reputation here is built through relationships and trade standing, which is a strength.)', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the pitch, the proof. The builds below are real Technijian capabilities; each is mapped to a specific China Auto Group use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured, checked data — deployed for a regulated financial-services firm’s compliance workflows. How it applies: tariff (HTS) classification screening, PPAP and IATF 16949 quality packages, and customs and commercial-invoice paperwork — the highest-volume, most error-prone, most liability-bearing documents in a sourcing back office.', CORE_BLUE),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini, with SEMrush, GA4, and Perplexity) that produces and optimises authority content and tracks AI-assistant citations. How it applies: make China Auto Group the cited answer for sourcing-under-tariffs and China+1 questions — the front-door gap from Section 7.', CORE_ORANGE),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: classification and landed-cost checks, where a confident but wrong tariff code or duty assumption is a penalty-and-margin event, not a typo.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: Weaviate/Obsidian knowledge systems and an AI-native software practice that builds custom tools 3–5x faster. How it applies: a supplier-intelligence graph and a landed-cost/quoting tool layered on Acctivate, plus a searchable layer over decades of supplier, part, and program know-how before key people retire.', CORE_BLUE),
  subHeader('“Won’t AI cost a fortune?” — the multi-model discipline'),
  p('A fair question. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three vendors and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume work (parsing factory data, drafting first-pass content), mid-tier models for reasoning, and frontier models only for the small slice that needs deep judgment. In practice this runs roughly 60–80% below the price of routing everything to one premium model — and private, governed deployments keep your buyer specifications and supplier pricing out of public tools.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '09'),
  p('A short, impartial primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction, from Anthropic’s engineering guidance: ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable, low-risk, e.g. “draft a quote from these inputs”) versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight). The principle is to use the simplest thing that works: start with quoting, classification, and document automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('Where China Auto Group sits today — and the next two rungs'),
  p('On a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks: foundational → emerging → operational → scaled → transformational), most established mid-market sourcing firms — China Auto Group included — sit at the first or second rung: capable operational systems, little applied AI. The leaders are a rung or two up, and the gap closes in months, not years. This engagement is about moving up two rungs, not buying a product.', { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer; a qualified person signs off on every classification, quote, and commitment. An AI-drafted classification or quote is a starting point, never the final word.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— your buyer specifications and supplier pricing never go into public AI tools; we use private, governed deployments.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool is inventoried with an owner, provider, and data source, straight from the NIST “Govern” function.' }]),
  h3('Why a partner, versus DIY or a new hire'),
  p('Do-it-yourself tools are inexpensive but leave you to assemble and govern the system. A capable full-time AI hire is scarce and runs well into six figures, and cannot cover strategy, build, security, and governance alone. A partner provides all four at a fraction of that, with proven builds — and architects, builds, and operationalises through to production rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth & Integration Engine', CORE_BLUE, '10'),
  p('The engine has three columns: win more accounts, classify-cost-and-quote faster with AI, and automate the sourcing back office around Acctivate. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'China Auto Group AI growth and integration engine', 624),
  caption('Figure 10.0 — Win more accounts (left); classify, cost, and quote faster (centre); automate the sourcing back office (right).'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for China Auto Group', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Authority & AEO content', 'Be the cited expert for sourcing-under-tariffs and China+1; fill the content gap from Section 7.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Account & trigger intelligence', 'Watch target parts brands for tariff, recall, and supply-shift triggers, to time outreach.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['HTS + landed-cost engine', 'Classify a part and model duty, freight, and landed cost across China, Vietnam, Mexico, and India.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Supplier discovery & risk-scoring', 'Mine and risk-score factory candidates; extend the member-factory database.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['RFQ / quote / spec drafting', 'Turn a buyer’s loose requirement into a structured RFQ, spec, and quote in minutes.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Quality-doc automation', 'Assemble PPAP / IATF 16949 / inspection and customs paperwork into audit-ready records.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Order & production tracking', 'An AI layer over Acctivate: flag at-risk POs, schedule slips, and container status.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      ['Institutional knowledge graph', 'Make decades of supplier, part, and program know-how searchable, not stuck in inboxes.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  pRuns([{ text: 'What peers report (industry directions, not guarantees). ', bold: true, color: DARK_CHARCOAL }, { text: 'Across sourcing and trade operations, AI document automation routinely cuts classification and paperwork time by more than half; AI-assisted content is how firms get cited by the assistants buyers now ask first; and structured landed-cost modeling turns a multi-day, error-prone comparison into a same-hour one. These are industry-typical directions of travel, not promises — your numbers come from discovery (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The non-negotiable',
    ['AI augments the expert and the systems of record (Acctivate, your quoting and quality process); it does not replace the person who confirms a classification, signs a quote, or holds a supplier relationship. Every AI-drafted classification, cost model, and quote is decision-support a person confirms.',
     'This is not only principle, it is law: U.S. Customs holds the importer responsible for classification under a “reasonable care” standard, so a person authorises every entry, and your proprietary specifications and pricing stay in private, governed deployments. That is how this stays trustworthy in a business built on trust.'], TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '11'),
  p('We price from real, published service ranges and we model returns only after discovery. No figure below is a quote, and none is presented as China Auto Group’s guaranteed result.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path'),
  buildTable(
    [{ label: 'Phase', weight: 24 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 26 }],
    [
      [{ text: 'Land — prove it', bold: true, color: CORE_BLUE }, 'An AI Readiness Assessment (map your sourcing, quoting, classification, quality, and Acctivate workflows), an authority-content / AEO start, and ONE high-ROI automation — the HTS + landed-cost / quote engine is the highest-conviction first build.', 'Fixed-scope projects + My SEO'],
      [{ text: 'Expand — quote & source faster', bold: true, color: CORE_BLUE }, 'Supplier discovery and risk-scoring, quality-document automation, account and trigger intelligence, and a custom quoting/landed-cost tool on Acctivate.', 'My AI + My Dev build'],
      [{ text: 'Scale — operate', bold: true, color: CORE_BLUE }, 'Fractional AI Advisor: ongoing guidance, the institutional knowledge graph, and a measured ROI dashboard.', 'Fractional AI Advisor (retainer)'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Market-typical investment ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 40 }, { label: 'Market-typical range (USD)', weight: 34 }, { label: 'Note', weight: 26 }],
    [
      ['AI readiness / discovery engagement', 'low five figures, fixed scope', 'one-time'],
      ['My SEO — authority content + AEO', '~$2,500–$3,000 / mo', 'recurring'],
      ['My AI — automation + intelligence', 'scoped to workflow count', 'recurring + build'],
      ['My Dev — quoting / landed-cost / integration build', 'project-based', 'one-time build'],
      ['Fractional AI Advisor', '~$2,000+ / mo retainer', 'recurring'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a sourcing partner, ROI is modeled on hours recovered per quote and per classification, faster quote turnaround winning more orders, landed-cost and duty optimisation captured, and quality-and-customs paperwork time saved — not on a guessed revenue number. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real volumes and hours (Section 14). Until then, any single ROI figure would be a guess, and we don’t guess. (Pricing is a single U.S.-led blended rate; we do not expose per-component line items — a bundled price plus a clear labor-rate table is the professional norm.)' }], { spaceAfter: 120 }),
  calloutBox('The price of waiting',
    'Every quarter that quoting, classification, and landed-cost work stays manual is a quarter of slower quotes, margin lost to imprecise duty assumptions, and buyers you could not answer fast enough — while the China+1 conversations happening right now go to whoever can model the alternatives first. The trade environment will not wait, and the firms that make sourcing-under-tariffs feel easy will win the accounts that are anxious about it today.', CORE_ORANGE),
  subHeader('Questions we usually get'),
  bulletRuns([{ text: '“We already have our sourcing relationships.” ', bold: true, color: DARK_CHARCOAL }, { text: 'Good — keep them. AI does not replace your factory relationships or your judgment; it makes the paperwork and quoting around them faster, so your experts spend time where they add value.' }]),
  bulletRuns([{ text: '“Isn’t AI just hype?” ', bold: true, color: DARK_CHARCOAL }, { text: 'The hype is the autonomous-everything version. What we deploy here is narrow and proven: classify a part, model a landed cost, draft a quote, assemble a PPAP package. Measurable, and it pays for itself.' }]),
  bulletRuns([{ text: '“Is our data safe?” ', bold: true, color: DARK_CHARCOAL }, { text: 'Your buyer specifications and supplier pricing stay in private, governed deployments and never enter public AI tools. Security-first is how we build.' }]),
  bulletRuns([{ text: '“What if it doesn’t work?” ', bold: true, color: DARK_CHARCOAL }, { text: 'The entry is small and scoped to one success metric. If it does not clear its cost, we tell you honestly and we stop — no lock-in.' }]),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself before the next begins — and sequenced to start with the lowest-risk, fastest wins.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Foundation, then quote and source faster, then scale and integrate. Targets calibrate at discovery.'),
  p('Phase one maps your sourcing, quoting, classification, and quality workflows and your Acctivate setup, runs the AI readiness assessment, and starts authority content so buyers begin to find you. Phase two delivers the work that pays fastest: the tariff-classification and landed-cost engine, RFQ and quote drafting, and the first quality-document automation. Phase three adds supplier intelligence, account and trigger intelligence on target buyers, a knowledge graph that captures decades of expertise, and a measured ROI dashboard so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions China Auto Group can take now, with no Technijian contract, that create value and set up the engagement:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Publish one expert answer. ', bold: true, color: DARK_CHARCOAL }, { text: 'A single strong piece — “How to source automotive parts from China under 2026 tariffs,” or “China+1 for auto parts: what to model” — signals to buyers and to search engines that China Auto Group has a voice. It is the first brick in the content gap.' }]),
  bulletRuns([{ text: 'Write down how a quote gets made. ', bold: true, color: DARK_CHARCOAL }, { text: 'Document the steps from a buyer’s inquiry to a landed-cost quote today — who touches it, what data they pull, how long it takes. That one page is the blueprint for the highest-ROI automation.' }]),
  bulletRuns([{ text: 'List the parts most exposed to tariff and classification risk. ', bold: true, color: DARK_CHARCOAL }, { text: 'The categories where a duty rate or classification call moves real margin are the first place an AI classification-and-landed-cost tool earns its keep.' }]),
  bulletRuns([{ text: 'Capture one expert’s knowledge before the next vacation. ', bold: true, color: DARK_CHARCOAL }, { text: 'Record a short walkthrough from a long-tenured team member on how they vet a factory or judge a part — the raw material for a future knowledge graph, and a hedge against key-person risk.' }]),
  bulletRuns([{ text: 'Name an Acctivate and process owner for the project. ', bold: true, color: DARK_CHARCOAL }, { text: 'Designate who knows your systems and quoting flow; a half-day of their input shapes the entire integration plan.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call or a half-day AI Readiness Assessment — replace every estimate above with your real numbers. “We’re not sure” is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & priorities', CORE_BLUE, [
    'Roughly how does the business split across aftermarket, OE, Tier 1/2, and performance accounts — and which is the growth priority?',
    'Is the bigger near-term goal winning new accounts, being found by new buyers, or serving existing accounts faster?',
    'How are your target accounts identified today, and would faster, sharper quotes win more of them?',
  ]),
  ...qGroup('B · How the work is done today', CORE_ORANGE, [
    'How is a quote produced today — from a buyer’s inquiry to a landed-cost number — and how long does it take?',
    'How is tariff (HTS) classification and landed-cost modeling done now, and who carries the risk if a classification is wrong?',
    'How is China+1 / alternative-country sourcing handled today, and how often are buyers asking for it?',
  ]),
  ...qGroup('C · Systems & data', TEAL, [
    'How do you use Acctivate and your factory database today, and how open are they to integration?',
    'How are PPAP, inspection, and customs documents assembled, and where do they live?',
    'What are the rules for any AI tool that touches buyer specifications or supplier pricing?',
  ]),
  ...qGroup('D · Brand & decision', CHARTREUSE, [
    'Who owns the website and marketing, and is there appetite to publish expert content?',
    'Where does staff time actually go — sourcing, quoting, classification, quality documentation, logistics, communication?',
    'Who sponsors this initiative, who else weighs in, and what would a successful first year look like?',
  ]),
  spacer(80),
  calloutBox('Two easy ways to answer',
    'Most of these take a 45-minute discovery call. For Sections B and C, a half-day AI Readiness Assessment maps your sourcing and quoting workflows directly and returns a prioritised, costed automation roadmap — which is also the cleanest first engagement.', CORE_ORANGE),
];

// ============================================================ SEC 15 — WHAT HAPPENS NEXT
const section15 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '15'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short discovery call — walk this blueprint and the Section 14 questions. We are in Irvine, about 25 minutes from Rancho Santa Margarita, so in person is easy.', 'A meeting. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'AI Readiness Assessment — a half-day mapping of your sourcing, quoting, classification, and quality workflows, returned as a prioritised, costed roadmap.', 'A fixed-scope engagement; the roadmap is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand build — start with the landed-cost/quote engine and the content base; scale across the back office as each proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['A short discovery call is the easiest first step — a working session on where AI creates measurable value for China Auto Group, with no obligation. Or we begin with the AI Readiness Assessment for a deeper, costed roadmap.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · +1 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain, headquartered in Irvine, California — about 25 minutes from China Auto Group. We help organisations across distribution, manufacturing, logistics, professional services, and financial services move from AI curiosity to operational deployment — we architect, build, and operationalise through to production. Our dedicated pod model assigns a named team to each client, and our offices in Irvine and Panchkula, India provide round-the-clock coverage — useful for a business that already works across a twelve-hour China time difference. Our approach is cybersecurity-first and AI-forward, with private, governed deployments for proprietary commercial data.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '+1 949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery centre', bold: true }, 'Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. could not confirm'),
  bullet('Identity (China Auto Group as a trade name of S. Kirby & Company, Inc.), Orange County headquarters, the U.S./Germany/China office footprint, the turnkey service scope, the product range, and leadership (Stephen Kirby, Hall of Fame 1996; Jason Kirby, VP Operations & Logistics; and team) — VERIFIED (company website; business directories).'),
  bullet('Acctivate as the operational system of record — VERIFIED (public customer reference).'),
  bullet('Section 301 List 3 25% duty on auto parts, the duty-stacking principle, the EV rate, the exclusion expiry, and China+1 diversification — VERIFIED (USTR; Auto Care Association; trade press).'),
  bullet('Founding year, revenue, order volume, and headcount — NOT confirmed (business directories carry third-party estimates only; we cite none as fact).'),
  bullet('The mix across account types and product lines, current China+1 posture, and internal workflow timings — NOT confirmed; listed as questions in Section 14.'),
  bullet('No LinkedIn follower count or review count is asserted — these are unreliable in cold research and deliberately omitted.'),
  subHeader('Selected sources'),
  ...[
    'China Auto Group — company website (Home, About Us, Services, Management, Products, Why Buy, Contact): chinaautogroup.com.',
    'Business directories — ZoomInfo, LeadIQ, Buzzfile (S. Kirby & Company), Kompass, Yahoo Local (location and classification; third-party revenue/headcount estimates, labeled as such).',
    'Operations — Acctivate customer reference (China Auto Group) for the operational system of record.',
    'Trade & tariffs — Office of the U.S. Trade Representative (Section 301); Auto Care Association (Section 301 List 3 = 25% on auto parts); trade-press tariff trackers (the 2025–26 environment, cited only as “elevated and volatile”); China+1 diversification (Vietnam, India, Thailand, Mexico).',
    'Competitive — Dragon Sourcing, Leeline Sourcing (sourcing agencies); QIMA, SGS (inspection); Alibaba, Made-in-China.com, Global Sources (marketplaces).',
    'AI framing — MIT Sloan (AI literacy); Anthropic (“Building Effective Agents,” workflows vs. agents); NIST AI Risk Management Framework (Govern/Map/Measure/Manage); McKinsey State of AI.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and trade figures are facts about the wider environment; figures specific to China Auto Group are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'China Auto Group  ·  AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  +1 949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const allChildren = [
  ...cover, ...methodNote, ...toc, ...execSummary,
  ...section1, ...section2, ...section3, ...section4, ...section5,
  ...section6, ...section7, ...section8, ...section9, ...section10,
  ...section11, ...section12, ...section13, ...section14, ...section15,
  ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'China Auto Group — AI Growth & Integration Blueprint', description: 'A facts-only AI Growth & Integration blueprint for China Auto Group, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'China-Auto-Group-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
