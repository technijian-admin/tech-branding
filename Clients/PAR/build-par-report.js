// Pacific Arena (PAR) — AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY: verified facts, estimates labeled,
// unknowns -> Questions section. Authentic logo. Singapore travel group.

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
const TODAY = 'June 17, 2026';
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
// Front-matter header (Contents / How to Read) — same visual as sectionHeader but NOT a Heading1,
// so these pages do not list themselves in the live TOC field. pageBreakBefore via a tiny leading para.
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
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 44, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
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
  centered('Pacific Arena', { size: 52, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Where AI wins more travellers and serves them faster — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(900),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Pacific Arena Pte. Ltd. — Leadership', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR PACIFIC ARENA LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('This blueprint was prepared from public research, before any technical discovery. It holds itself to a simple discipline:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Pacific Arena is drawn from the company’s own websites, the Singapore business registry, the STB licensed-agent directory, trade press, or LinkedIn, and is cited in the Appendix. We have not assumed your revenue, headcount, or the split of business across your brands.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Market figures and ROI ranges are clearly marked as estimates or market-typical context — never presented as your results. The real numbers come from discovery.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('Two things we corrected for accuracy',
    ['First, Pacific Arena is not a classically "family-owned" agency: it was P&O Travel (Singapore) until a 2003 acquisition by a Hong Kong investment group, then rebranded — so we treat current ownership as a discovery item, not an assumption. Second, this is not a firm that "has no technology": your corporate arm already runs Sabre, back-office automation, and a PDPA/GDPR-compliant client portal. This blueprint is therefore about going further with AI, not starting from zero.',
     'That is the standard of evidence behind every figure here.'], TEAL),
];

// ============================================================ TOC (live field — Word fills page numbers)
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', {
    hyperlink: true,
    headingStyleRange: '1-1',   // section-level (Heading 1) only — keeps it to one page
  }),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Pacific Arena is a Singapore travel group that has operated since 1976 — originally P&O Travel (Singapore), rebranded in 2003 — and today trades through a portfolio of brands: PriceBreaker Corporate for business travel management, PriceBreaker for leisure and customised holidays, Accolade for MICE and incentives, and Cruise Arena for cruising, plus a visa-services line. It is a perennial top airline-ticketing agent — named Singapore Airlines Top Agent every year from 2016 to 2024 — and its corporate arm already runs a modern stack: Sabre, back-office automation, and a proprietary client portal built to PCI DSS, Singapore PDPA, and EU GDPR standards.', { spaceAfter: 120 }),
  p('That combination — deep travel expertise and a real technology base — is exactly the foundation AI builds on. This blueprint works on two fronts:', { spaceAfter: 120 }),
  kpiRow([
    { number: '1976', label: 'In business since (as P&O Travel)', color: CORE_BLUE },
    { number: '2016–24', label: 'Singapore Airlines Top Agent, every year', color: CORE_ORANGE },
    { number: '5', label: 'Brands / service lines', color: TEAL },
    { number: 'Sabre', label: 'Core booking platform', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'Front one — win more travellers and accounts. ', bold: true, color: DARK_CHARCOAL }, { text: 'On the leisure side, AI authority content and search visibility (AEO) make Pacific Arena the answer travellers find — a gap today, since the consumer brands publish little content. On the corporate side, AI account and tender intelligence, plus faster proposal drafting, help win and retain the MNC, SME, and public-sector accounts the business is built on.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — serve faster and run leaner. ', bold: true, color: DARK_CHARCOAL }, { text: 'This is where travel returns the most: AI-drafted itineraries and quotes, a customer-service virtual agent, fare re-shopping that captures savings, ticketing and PNR automation that extends what Sabre already does, and visa-document processing on the existing visa line. Every booking is still confirmed by a consultant, and traveller data stays in private, PDPA-governed systems.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is conservative on purpose. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented revenue figure or a guessed ROI here — your financials are not public, so we cite none. Investment is shown as real, published Technijian service ranges; returns are modeled only after discovery calibrates them against your real volumes, consultant hours, and conversion (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'OTAs win on digital but not on service; traditional agencies win on service but not on digital. Pacific Arena has both the service depth and a real tech base — so AI lets it deliver high-touch travel expertise at digital speed and scale. That is the lane almost no mid-market agency occupies yet.', CORE_ORANGE),
];

// ============================================================ SEC 01 — COMPANY & POSITION
const section1 = [
  ...sectionHeader('The Company & Market Position', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Pacific Arena’s own websites, the Singapore business registry (ACRA / OpenGovSG), the STB licensed-agent directory, trade press, and LinkedIn (see Appendix).', { spaceAfter: 130 }),
  subHeader('A brand portfolio, not a single agency'),
  p('"Pacific Arena" is the licensed entity; the business reaches the market through a portfolio of specialist brands. Reading the model this way matters, because AI plugs into each brand differently:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Brand', weight: 26 }, { label: 'Line of business', weight: 30 }, { label: 'Who it serves', weight: 44 }],
    [
      [{ text: 'PriceBreaker Corporate', bold: true, color: CORE_BLUE }, 'Business travel management (TMC)', 'MNCs, SMEs, public-sector bodies, and educational institutions; on Sabre + a proprietary client portal, within the global ATG / AllStars alliance.'],
      [{ text: 'PriceBreaker', bold: true, color: CORE_BLUE }, 'Leisure & customised travel', 'Individual and family travellers — group tours, FIT/bespoke itineraries, rail, self-drive, cruise deals, and student fares.'],
      [{ text: 'Accolade', bold: true, color: CORE_BLUE }, 'MICE & incentives', 'Corporate event, meeting, and incentive-travel buyers.'],
      [{ text: 'Cruise Arena', bold: true, color: CORE_BLUE }, 'Cruise specialist', 'Cruise travellers (Royal Caribbean, Princess, Celebrity); Princess Top Performing Agency 2017.'],
      [{ text: 'Visa Advisory & Application', bold: true, color: CORE_BLUE }, 'Visa services', 'Assessment, advisory, document check, and courier handling — largely a corporate-travel add-on.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Heritage, ownership, and footing (verified)'),
  pRuns([{ text: 'Established 1976 as P&O Travel (Singapore); rebranded to Pacific Arena after a 2003 acquisition by a Hong Kong investment group. ', bold: true, color: DARK_CHARCOAL }, { text: 'That history matters in two ways. It explains the strong corporate-travel DNA (the airline-ticketing awards, the TMC apparatus). And it means the firm is not a classic family business — current ultimate ownership is something we treat as a discovery item rather than an assumption. The firm holds Singapore STB travel-agent licence TA00249 and is a perennial top airline-ticketing agent (Singapore Airlines Top Agent every year 2016–2024).' }], { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founded', bold: true }, '1976 (as P&O Travel (Singapore)); rebranded Pacific Arena in 2003. UEN 197600773W; paid-up capital SGD 1,986,000.'],
      [{ text: 'Headquarters', bold: true }, '200 Cantonment Road #04-05 Southpoint, Singapore 089763. +65 6317 2800.'],
      [{ text: 'Licence', bold: true }, 'Singapore Tourism Board travel-agent licence TA00249; SSIC 79102 (travel agencies & tour operators, mainly outbound).'],
      [{ text: 'Recognition', bold: true }, 'Singapore Airlines Top Agent 2016–2024; awards from Qatar, Emirates, Cathay, Lufthansa Group and others; Princess Cruises Top Performing Agency 2017; Globus Sales Excellence 2025.'],
      [{ text: 'Scale', bold: true }, 'Approximately 50–60 staff (LinkedIn lists the 51–200 band; ~2,479 followers). Industry: leisure, travel & tourism.'],
      [{ text: 'Revenue', bold: true, color: CRITICAL }, 'Not publicly disclosed — we cite no revenue figure and treat it as a discovery item.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your revenue or the split across corporate, leisure, MICE, and cruise; your exact headcount; current ultimate ownership; your IATA/BSP or NATAS status; or the role of our contact, Adeline Chan, whom we could not confirm on any public page. These are the questions in Section 14.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW THEY SERVE
const section2 = [
  ...sectionHeader('How Pacific Arena Serves Travel', CORE_BLUE, '02'),
  p('Pacific Arena sits between travel supply and travellers, on both sides of the market at once — and each link in the chain is a place where AI sharpens the edge.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Pacific Arena serves travel', 612),
  caption('Figure 02.0 — A dual model under one licence: source fares and product, package and book them, and service corporate and leisure travellers.'),
  pRuns([{ text: 'A real technology base already exists. ', bold: true, color: DARK_CHARCOAL }, { text: 'The corporate arm runs Sabre (Bargain Finder Max low-fare search, PNR Validator, MySeat, SafePoint duty-of-care) plus "Robotics Assist" back-office automation for ticketing and PNR quality control, and a proprietary client portal with single sign-on, traveller profiles, policy monitoring, and online booking — built to PCI DSS, Singapore PDPA, and EU GDPR standards. This is the single most important fact for an AI plan: the highest-value AI here reads from and writes to the systems your consultants already trust, rather than replacing them.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The contrast is the opportunity. ', bold: true, color: DARK_CHARCOAL }, { text: 'The corporate stack is modern; the consumer side (the leisure and cruise brands) is largely an enquiry-and-deals web presence with little published content and a thin review footprint. That gap between a sophisticated back office and a quiet front door is exactly where the growth front of this plan focuses.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — INDUSTRY  (agent-2 refines)
const section3 = [
  ...sectionHeader('Industry & Regulatory Landscape', CORE_BLUE, '03'),
  p('Pacific Arena operates in the largest and fastest-growing travel region in the world, reshaped by online booking and now by AI. The figures below are facts about that market — not claims about the company — and each one favours an agency that pairs human expertise with automation. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '16.5M', label: 'Singapore visitor arrivals, 2024 (+21%)', color: CORE_BLUE },
    { number: 'S$29.8B', label: 'Singapore tourism receipts, 2024 — a record', color: CORE_ORANGE },
    { number: '>41%', label: 'APAC share of global business travel', color: TEAL },
    { number: '~65%', label: 'of travel booked online by 2026', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('Online booking commoditised the simple trip — not the complex one'),
  p('Online travel agencies (Trip.com, Expedia, Klook, Agoda, Booking.com) and direct airline sites absorbed the simple point-to-point booking — online penetration is heading from roughly 62% of travel sales in 2024 to two-thirds by 2027 — and airline commissions collapsed from a fixed standard to near-zero by 2002, so agencies now live on service fees and package margin, not air commission. What did not commoditise is the work Pacific Arena is built on: complex and customised itineraries, groups and MICE (a MICE visitor spends roughly twice a leisure visitor, and Singapore is targeting S$4.5B of MICE receipts by 2040), cruise, visa logistics, and corporate duty-of-care. Travellers who use an advisor choose one for relationships and expertise, not price — and companies with managed business-travel programmes can outperform peers by up to 30% in revenue (GBTA/ASTA). APAC is both the largest business-travel region (over 41% of global spend) and the least "managed," which is a long runway for a TMC.', { spaceAfter: 120 }),
  h3('Singapore’s regulatory frame — already part of how Pacific Arena operates'),
  p('Travel agencies in Singapore are licensed by the Singapore Tourism Board under the Travel Agents Act 1975 — the Travel Agent Licence (Pacific Arena holds TA00249); a General Licence requires S$100,000 paid-up capital and net worth, renewed every two years. The industry body is NATAS, whose members run Singapore’s two large consumer travel fairs each year. Traveller data is governed by the Personal Data Protection Act (PDPA): ten obligations, a mandatory data-protection officer, breach notification to the regulator within three days where a breach risks significant harm or affects 500+ individuals, and penalties up to S$1 million or 10% of Singapore turnover. The PDPC also restricts using passport and NRIC numbers as identifiers — directly relevant to AI that processes visa and passport documents. Pacific Arena’s corporate portal already states PCI DSS, PDPA, and GDPR compliance, so an AI programme here starts privacy-aware: any AI touching traveller data stays in private, governed systems, a constraint this blueprint assumes throughout.', { spaceAfter: 120 }),
  h3('AI is the next platform shift in travel'),
  p('AI mentions in the largest travel companies’ annual reports rose from 4% in 2022 to 35% in 2024, and extensive AI use for trip planning roughly doubled from 2024 to 2025. The OTAs and the global TMCs have already shipped AI assistants. For a traditional agency this is both the threat and the opportunity: the threat is that AI further commoditises simple trip planning; the opportunity is that the same technology, in expert hands, lets a 50-year-old agency draft in minutes what used to take hours — and spend the time saved on the judgment and relationships a machine cannot replicate.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'Every industry force points the same way: the simple trip is automated, so the winners are the agencies that use AI to deliver complex, high-touch, well-serviced travel faster than anyone else — for both the bespoke leisure traveller and the mid-market corporate account the giants underserve. Pacific Arena does not need to change what it sells, only how fast and how visibly it sells and services it.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where the Growth & Efficiency Live', CORE_BLUE, '04'),
  p('For a dual-motion travel group, value sits in four levers. AI supports each one without changing the relationship-and-expertise nature of the business.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 24 }, { label: 'What it looks like for Pacific Arena', weight: 50 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Win corporate accounts', bold: true, color: CORE_BLUE }, 'Land and retain more MNC, SME, and public-sector / education travel programmes — including faster, sharper responses to tenders and RFPs.', 'Growth'],
      [{ text: 'Capture leisure demand', bold: true, color: CORE_BLUE }, 'Be found and chosen for tours, cruises, and bespoke trips — through content, search/AEO visibility, and a consumer experience that converts.', 'Growth'],
      [{ text: 'Serve faster', bold: true, color: CORE_BLUE }, 'Draft itineraries and quotes in minutes, answer travellers around the clock, and re-shop fares — so consultants spend time on judgment, not typing.', 'Integration'],
      [{ text: 'Run leaner', bold: true, color: CORE_ORANGE }, 'Automate ticketing/PNR work, visa-document checks, and finance/BSP reconciliation — the repetitive back-office load.', 'Integration'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The corporate lever is account-based: Pacific Arena already knows the kinds of organisations it wins — so the plan is depth, timing, and faster proposals, not broad "lead generation." The leisure lever is demand-based: be the agency travellers find and trust. And the two efficiency levers are often the easiest place to start, because they save consultant hours on work the team already does every day.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — SEGMENTS (personas)
const section5 = [
  ...sectionHeader('The Customer Segments', CORE_BLUE, '05'),
  p('Pacific Arena serves a portfolio of travellers and accounts across its brands. The matrix below maps the archetypes by booking volume and value per relationship — archetypes to calibrate at discovery, not your CRM.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Customer segments matrix', 560),
  caption('Figure 05.0 — Buy-side archetypes across corporate and leisure. Bubble size approximates value per relationship.'),
  buildTable(
    [{ label: 'Segment', weight: 24 }, { label: 'What they need', weight: 40 }, { label: 'How AI helps Pacific Arena serve them', weight: 36 }],
    [
      [{ text: 'Corporate Travel Manager', bold: true, color: CORE_BLUE }, 'Savings, policy compliance, duty of care, and clean reporting across a travelling workforce.', 'Account intelligence; faster tenders; reporting and re-shopping on the portal.'],
      [{ text: 'Leisure FIT / bespoke', bold: true, color: CORE_ORANGE }, 'A customised, well-judged itinerary and a human who knows the destination.', 'AI-drafted itineraries the consultant personalises; faster quotes.'],
      [{ text: 'Group / packaged leisure', bold: true, color: TEAL }, 'Value, reliability, and a smooth booking for a tour or cruise.', 'Content and search visibility; a virtual agent for enquiries.'],
      [{ text: 'MICE / incentive buyer', bold: true, color: GREEN }, 'A memorable, well-run event or incentive trip.', 'Proposal drafting; supplier and logistics coordination.'],
      [{ text: 'SME / public / education', bold: true, color: DARK_CHARCOAL }, 'Managed travel at a fair price with light overhead.', 'Self-serve booking + AI support; tender-ready proposals.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your account list. Which segments matter most — by volume, by margin, by growth priority — is a discovery question. We would rather build the plan around your real book of business than around our assumptions about it.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE (agent-2 refines)
let section6 = [
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  p('Pacific Arena competes with three different kinds of player at once — and the way to read the field is not by size, but by two axes: digital/AI maturity, and depth of high-touch, complex, and corporate service.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Competitive positioning: digital and AI maturity vs high-touch depth', 560),
  caption('Figure 06.0 — A strategic assessment (not a measured score). The top-right corner — high-touch service at digital scale — is largely unoccupied at mid-market.'),
  buildTable(
    [{ label: 'Competitor type', weight: 26 }, { label: 'Examples', weight: 32 }, { label: 'Where they win / where they don’t', weight: 42 }],
    [
      [{ text: 'OTAs / digital', bold: true, color: CORE_BLUE }, 'Trip.com, Expedia, Klook, Agoda, Booking.com', 'Win on price, convenience, and digital scale for simple trips; weak on complex itineraries, groups, and corporate duty-of-care. All run consumer AI assistants today (TripGenie, Romie, K.AI, Agoda, Booking AI Trip Planner).'],
      [{ text: 'Global TMCs', bold: true, color: CORE_BLUE }, 'American Express GBT, CWT, FCM, BCD', 'Strong digital + corporate depth, with AI assistants (myCWT, Egencia AI, FCM "Sam"). But built for large enterprises — and the Amex GBT–CWT merger concentrates the top end, leaving mid-market accounts a lower priority.'],
      [{ text: 'Singapore agencies', bold: true, color: CORE_BLUE }, 'Chan Brothers, Dynasty, CTC, ASA, EU Holidays', 'Strong leisure brands and service, but thin digital/AI — and as of mid-2026 not one runs a live customer AI chatbot. Only Chan Brothers has announced an AI programme.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and the window',
    ['OTAs have digital scale but not service; traditional agencies have service but not digital; global TMCs have both but are built for the enterprise. That leaves two openings the giants underserve: the bespoke, complex, or group/MICE leisure traveller who wants human curation, and the mid-market corporate account that wants managed travel and duty-of-care without enterprise overhead. Pacific Arena, unusually, already spans both corporate and leisure for the same Singapore client base.',
     'There is also a clock on it. Among Singapore’s leisure agencies, no one has a live customer AI assistant yet, and only the largest peer has announced an AI programme — being built through 2026. An AI-assisted, human-closed model is an ownable local differentiator now; the window is roughly 2026–2027. Pacific Arena has the service depth, the airline relationships, and a real tech base (Sabre + a compliant portal + the ATG network) to occupy that corner first.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Pacific Arena’s public digital footprint as observed in June 2026. The headline is a split: a sophisticated corporate technology stack behind a quiet consumer front door. The gap is the opportunity.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 24 }, { label: 'What we observed', weight: 50 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Corporate stack', bold: true, color: PASS_OR_BLUE() }, 'Sabre + "Robotics Assist" automation + a proprietary client portal (SSO, profiles, policy, PCI/PDPA/GDPR). A genuine, modern base.', 'Extend with AI, don’t replace.'],
      [{ text: 'Consumer websites', bold: true, color: CRITICAL }, 'WordPress/Elementor, single-page, marketing-oriented and dated; the leisure and cruise sites are enquiry-and-deals, not conversion-built.', 'Refresh for conversion + AEO.'],
      [{ text: 'Content / market voice', bold: true, color: CRITICAL }, 'No active blog, destination content, or published travel guidance — little for search or AI assistants to cite.', 'Own the travel conversation.'],
      [{ text: 'Reviews / reputation', bold: true, color: CRITICAL }, 'Thin consumer-review footprint; reputation is built through airline and supplier B2B awards, not Google/TripAdvisor.', 'Build visible social proof.'],
      [{ text: 'LinkedIn / social', bold: true }, '~2,479 followers, tagline "Travel is never just travel."; modest for a 50-year-old firm.', 'A real, consistent presence.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most useful finding',
    'A firm that has been a top airline-ticketing agent for nearly a decade, with a modern corporate portal, is almost invisible to a traveller searching online and publishes no destination content in a market that now runs on search and AI answers. That gap is not a weakness to hide — it is the clearest, lowest-cost place to start, because the expertise to fill it already exists inside the business.', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the pitch, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Pacific Arena use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured, checked data — deployed for a regulated financial-services firm’s compliance workflows. How it applies: visa applications and supporting documents, and BSP / supplier-invoice reconciliation — the highest-volume, most error-prone paperwork in a travel back office.', CORE_BLUE),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini + MCP, SEMrush, GA4, Perplexity) that produces and optimises authority content and tracks AI-assistant citations. How it applies: make Pacific Arena’s leisure and cruise brands the answer travellers find in search and AI assistants — the front-door gap from Section 7.', CORE_ORANGE),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: itinerary and fare-rule quality checks, where a confident but wrong fare rule or routing is a money-and-service event.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: Weaviate/Obsidian knowledge systems and an AI-native software practice (3–5x faster builds). How it applies: an AI itinerary/quote generator and customer-service agent layered on Sabre and the client portal, plus a searchable layer over five decades of supplier, fare, and itinerary know-how.', CORE_BLUE),
  subHeader('"Won’t AI cost a fortune?" — the multi-model discipline'),
  p('A fair question. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three vendors and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume work (parsing documents, drafting first-pass content), mid-tier models for reasoning, and frontier models only for the small slice that needs deep judgment. In practice this runs roughly 60–80% below the cost of routing everything to one premium model — and private, governed deployments keep traveller and corporate data out of public tools, consistent with PDPA.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '09'),
  p('A short, vendor-neutral primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction, from Anthropic’s engineering guidance: ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable, low-risk, e.g. "draft an itinerary from these inputs") versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight). The principle is to use the simplest thing that works: start with itinerary, content, and document automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer; a consultant signs off on every itinerary and every booking. An AI-drafted trip is a starting point, never the final word.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— traveller PII and corporate data never go into public AI tools; we use private, governed deployments consistent with PDPA, GDPR, and PCI.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool is inventoried with an owner, vendor, and data source, straight from the NIST "Govern" function.' }]),
  h3('Why a partner, versus DIY or a new hire'),
  p('Do-it-yourself tools are cheap but leave you to assemble and govern the system. A capable full-time AI hire is scarce and expensive, and cannot cover strategy, build, security, and governance alone. A partner provides all four at a fraction of the cost, with proven builds — and architects, builds, and operationalises through to production rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth & Integration Engine', CORE_BLUE, '10'),
  p('The engine has three columns: win more travellers and accounts, serve them faster with AI, and automate the booking back office around Sabre and the client portal. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Pacific Arena AI growth and integration engine', 624),
  caption('Figure 10.0 — Get found and win (left); serve and sell faster (centre); automate the back office (right).'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Pacific Arena', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Leisure AEO & authority content', 'Be the cited answer for destinations, tours, and cruises; fill the content gap.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Corporate account & tender intel', 'Signal monitoring on target accounts and Singapore public-sector / education tenders.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['AI itinerary & quote generation', 'Draft customised itineraries and quotes in minutes; the consultant personalises and signs off.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Customer-service virtual agent', 'Answer enquiries and support corporate travellers 24/7; escalate complex trips to a human.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      ['Fare re-shopping & savings', 'Re-price booked trips when fares drop; surface savings before ticketing.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Ticketing & PNR automation', 'Extend Sabre Robotics Assist: PNR QA, schedule-change handling, queue clearing.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Visa & document processing', 'Parse and check visa paperwork; flag gaps before submission.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Institutional knowledge graph', 'Make 50 years of supplier, fare, and itinerary know-how searchable, not stuck in inboxes.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  pRuns([{ text: 'What peers report (industry results, not guarantees). ', bold: true, color: DARK_CHARCOAL }, { text: 'Agencies using ticketing and schedule-change automation have cut agent time by up to about 72% and operational cost by roughly 21% (Sabre study); corporate fare re-shopping recovers around 4% of air spend on identical flights (FairFly / Oversee); and AI trip-planning assistants have roughly doubled order conversion for one major OTA (Trip.com). These are industry figures that show the levers are real — your numbers come from discovery (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The non-negotiable',
    ['AI augments the consultant and the Sabre / portal systems of record; it does not replace the human who confirms a booking or the relationship that closes a corporate account. Every AI-drafted itinerary, quote, and fare is decision-support a person confirms.',
     'This is not only principle. In a 2024 ruling (Moffatt v. Air Canada), a tribunal held the airline — not its chatbot — liable for an answer the bot invented. The lesson is to let AI stage and recommend, and require a human to authorise anything irreversible, money-moving, or compliance-bearing. That is how this stays trustworthy in a business built on trust — and how it keeps Pacific Arena’s high-touch edge over the OTAs.'], TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '11'),
  p('We price from real, published service ranges and we model returns only after discovery. No figure below is a quote, and none is presented as Pacific Arena’s guaranteed result. Figures are in US dollars; a Singapore-dollar engagement is straightforward to structure.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Land — prove it', bold: true, color: CORE_BLUE }, 'AI Readiness Assessment (map Sabre, the portal, and workflows), a leisure content/AEO start, and ONE high-ROI automation (e.g., itinerary drafting or visa-document checks).', 'Fixed-scope projects + My SEO'],
      [{ text: 'Expand — serve faster', bold: true, color: CORE_BLUE }, 'AI itinerary/quote generation; a customer-service virtual agent; fare re-shopping; corporate account intelligence.', 'My AI + My Dev build'],
      [{ text: 'Scale — operate', bold: true, color: CORE_BLUE }, 'Fractional AI Advisor: ongoing guidance, ticketing/finance automation, and a measured ROI dashboard.', 'Fractional AI Advisor (retainer)'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Market-typical investment ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 40 }, { label: 'Market-typical range (USD)', weight: 34 }, { label: 'Note', weight: 26 }],
    [
      ['AI readiness / discovery engagement', 'low five figures, fixed scope', 'one-time'],
      ['My SEO — leisure content + AEO', '~$2,500–$3,000 / mo', 'recurring'],
      ['My AI — automation + intelligence', 'scoped to workflow count', 'recurring + build'],
      ['My Dev — itinerary / chatbot / integration build', 'project-based', 'one-time build'],
      ['Fractional AI Advisor', '~$2,000+ / mo retainer', 'recurring'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a travel agency, ROI is modeled on consultant hours recovered, conversion lift, and savings captured — not on a guessed revenue number. The levers are concrete: hours saved per itinerary and per ticket, faster quote turnaround winning more bookings, fares re-captured before ticketing, and corporate tenders won. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real volumes and consultant time (Section 14). Until then, any single ROI figure would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself before the next begins — and sequenced to start with the lowest-risk, fastest wins.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Foundation, then serve faster, then scale and integrate. Targets calibrate at discovery.'),
  p('Phase one maps the Sabre and portal stack, runs the AI readiness assessment, and refreshes the consumer web with a content and AEO base. Phase two delivers AI itinerary and quote generation, a customer-service virtual agent, and visa-document automation. Phase three extends ticketing automation and fare re-shopping, adds corporate account intelligence, and stands up a measured ROI dashboard so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions Pacific Arena can take now, with no Technijian contract, that create value and set up the engagement:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Publish one destination guide. ', bold: true, color: DARK_CHARCOAL }, { text: 'A single strong piece of destination or cruise content signals to travellers and to search engines that Pacific Arena has a voice — the first brick in the content gap.' }]),
  bulletRuns([{ text: 'Claim and fill the review profiles. ', bold: true, color: DARK_CHARCOAL }, { text: 'Set up and populate Google Business and key review profiles; ask recent happy travellers for a review. Social proof compounds.' }]),
  bulletRuns([{ text: 'Pick the single most painful back-office task. ', bold: true, color: DARK_CHARCOAL }, { text: 'Identify the one repetitive job that eats the most consultant time — visa checks, quoting, or PNR work — as the first automation target.' }]),
  bulletRuns([{ text: 'List your brands clearly online. ', bold: true, color: DARK_CHARCOAL }, { text: 'Make it obvious to a visitor that PriceBreaker Corporate, PriceBreaker, Accolade, and Cruise Arena are one trusted group — it strengthens every brand at once.' }]),
  bulletRuns([{ text: 'Name a Sabre / portal owner for the project. ', bold: true, color: DARK_CHARCOAL }, { text: 'Designate who knows your Sabre and portal setup; a half-day of their input shapes the entire integration plan.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call or a half-day AI Readiness Assessment — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & priorities', CORE_BLUE, [
    'Roughly how does the business split across corporate, leisure, MICE, cruise, and visa — and which is the growth priority?',
    'Is the bigger near-term goal winning corporate accounts, capturing leisure demand, or serving existing travellers faster?',
    'Who are your target corporate segments, and do you pursue Singapore public-sector / education travel tenders?',
  ]),
  ...qGroup('B · Systems & data', CORE_ORANGE, [
    'Which Sabre products and "Robotics Assist" capabilities do you use, and how open are they to integration?',
    'What does the proprietary client portal do today, and what ATG / AllStars tooling do you already use?',
    'Where do quotes, itineraries, and visa documents get created today — and in which systems do they live?',
  ]),
  ...qGroup('C · How the work is done today', TEAL, [
    'How long does a customised itinerary or quote take to produce, and how many do you handle a week?',
    'Where does consultant time go — quoting, ticketing, visa work, servicing, re-booking?',
    'How are after-hours and corporate-traveller support handled today?',
    'How do you handle traveller personal data under PDPA, and what are the rules for any AI tool that touches it?',
  ]),
  ...qGroup('D · Brand, web & decision', CHARTREUSE, [
    'Who owns the consumer websites and marketing, and is there appetite to publish travel content?',
    'Can you confirm IATA/BSP accreditation and NATAS membership (the public record was unclear)?',
    'Can you confirm current ownership and the role of our contact, Adeline Chan?',
    'Who sponsors this initiative, who else weighs in, and what would a successful first year look like?',
  ]),
  spacer(80),
  calloutBox('Two easy ways to answer',
    'Most of these take a 45-minute discovery call. For Sections B and C, a half-day AI Readiness Assessment maps your Sabre and portal workflows directly and returns a prioritised, costed automation roadmap — which is also the cleanest first engagement.', CORE_ORANGE),
];

// ============================================================ SEC 15 — WHAT HAPPENS NEXT
const section15 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '15'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short discovery call — walk this blueprint and the Section 14 questions (time-zone-friendly: our India delivery team overlaps Singapore hours).', 'A meeting. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'AI Readiness Assessment — a half-day mapping of Sabre, the portal, and workflows, returned as a prioritised, costed roadmap.', 'A fixed-scope engagement; the roadmap is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand build — start with one automation and the content/AEO layer; scale across brands as each proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['A short discovery call is the easiest first step — a working session on where AI creates measurable value for Pacific Arena, with no obligation. Or we begin with the AI Readiness Assessment for a deeper, costed roadmap.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · +1 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain. We help organisations across travel, professional services, logistics, and financial services move from AI curiosity to operational deployment — we architect, build, and operationalise through to production. Our dedicated pod model assigns a named team to each client, and our offices in Irvine, California and Panchkula, India provide coverage across time zones — our India delivery centre overlaps Singapore business hours closely, which makes us a practical partner for an APAC client. Our approach is cybersecurity-first and AI-forward, with private, governed deployments suited to PDPA, GDPR, and PCI requirements.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '+1 949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery centre', bold: true }, 'Panchkula, Haryana, India (Singapore-overlapping hours)'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. could not confirm'),
  bullet('Identity, 1976 founding, former name P&O Travel (Singapore), 2003 rebrand, brand portfolio, STB licence TA00249 — VERIFIED (company sites, ACRA/OpenGovSG, STB directory, Travel Weekly Asia).'),
  bullet('Sabre + back-office automation + proprietary PDPA/GDPR/PCI client portal, ATG/AllStars network, SIA Top Agent 2016–2024 — VERIFIED (PriceBreaker Corporate site; awards page).'),
  bullet('Revenue and exact headcount — NOT confirmed (no primary figure; ~50–60 staff is an estimate from the LinkedIn band); no revenue cited.'),
  bullet('Current ultimate ownership (post-2003 Investour acquisition), IATA/BSP accreditation, NATAS membership, and the role of contact Adeline Chan — NOT confirmed; listed as questions.'),
  bullet('The 5 ACRA-registered officer/shareholder identities — paywalled; data-broker names conflict and are deliberately excluded.'),
  subHeader('Selected sources'),
  ...[
    'Pacific Arena — company site, awards, team, STB licence TA00249: pacificarena.travel.',
    'PriceBreaker Corporate — about (TMC, ATG network) and technology (Sabre, client portal): business.pricebreaker.travel.',
    'Singapore registry — ACRA / OpenGovSG record for UEN 197600773W; STB licensed-agent directory.',
    'Travel Weekly Asia — "P&O Travel (Singapore) is now Pacific Arena" (2003 Investour acquisition).',
    'Market — Singapore Tourism Board (2024 arrivals 16.5M / receipts S$29.8B record); GBTA (global business travel; managed-travel ROI up to 30% with ASTA); Phocuswright (online penetration to two-thirds by 2027); IATA (2024 air-demand record; APAC recovery); WTTC; McKinsey & Skift (travel AI adoption 4%→35%).',
    'Regulatory — STB Travel Agents Act 1975 & Travel Agent Licence (General Licence S$100k, 2-yr validity); NATAS; Singapore PDPC / PDPA (ten obligations, 3-day breach notice, ≥500-individual threshold, S$1m / 10%-turnover cap, passport/NRIC identifier restriction, 2024 AI advisory guidelines); IATA BSP / NewGen ISS.',
    'Competitive & AI use cases — OTA, TMC, and Singapore-agency AI programmes (Trip.com TripGenie, Amex GBT Egencia AI, FCM "Sam", CWT myCWT; Chan Brothers AI roadmap); Sabre automation study; FairFly/Oversee re-shopping; Moffatt v. Air Canada (2024) on chatbot liability.',
    'AI framing — MIT Sloan (AI literacy); Anthropic (workflows vs. agents); NIST AI Risk Management Framework.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider market; figures specific to Pacific Arena are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// helper for one cell color (kept simple)
function PASS_OR_BLUE() { return CORE_BLUE; }

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Pacific Arena  ·  AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Pacific Arena — AI Growth & Integration Blueprint', description: 'A facts-only AI Growth & Integration blueprint for Pacific Arena, prepared by Technijian.',
  features: { updateFields: true },   // tells Word to update the TOC field (page numbers) on open
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Pacific-Arena-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
