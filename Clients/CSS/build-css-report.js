// Custom Silicon Solutions (CSS) — AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY: verified facts, estimates labeled,
// unknowns -> Questions section. Authentic logo. Existing My SEO client -> warm expansion.

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
const TODAY = 'June 26, 2026';
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
// personaCard — RKE persona-profile format (NOT a one-row-per-persona table). Header band + labeled rows.
function personaCard(name, segment, color, rows) {
  const LW = 2520;
  const header = new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 110, bottom: 110, left: 200, right: 160 }, children: [
      new Paragraph({ spacing: { after: 10 }, children: [new TextRun({ text: name, size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
      new Paragraph({ children: [new TextRun({ text: segment, size: 18, color: WHITE, italics: true, font: FONT_BODY })] }),
    ] }),
  ] });
  const dataRows = rows.map((r, i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: LW, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 90, bottom: 90, left: 160, right: 120 }, verticalAlign: VerticalAlign.TOP, children: [new Paragraph({ children: [new TextRun({ text: r.label, size: 19, bold: true, color, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - LW, type: WidthType.DXA }, borders: cellBorders, margins: { top: 90, bottom: 90, left: 160, right: 140 }, verticalAlign: VerticalAlign.TOP, children: (Array.isArray(r.value) ? r.value : [r.value]).map((v, j, a) => new Paragraph({ spacing: { after: j < a.length - 1 ? 40 : 0, line: 286 }, children: [new TextRun({ text: (Array.isArray(r.value) ? '• ' : '') + v, size: 19, color: BRAND_GREY, font: FONT_BODY })] })) }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [LW, CONTENT_W - LW], rows: [header, ...dataRows] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 38, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
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
  centered('Custom Silicon Solutions', { size: 48, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Where AI makes the firm the cited expert design engineers find — and makes quoting, design documentation, and obsolescence rescue faster — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(760),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('The Custom Silicon Solutions leadership team', { size: 21, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR CUSTOM SILICON SOLUTIONS LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('This blueprint was prepared from public research and from the data inside our existing SEO engagement — before any AI or operations discovery. It holds itself to a simple discipline:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Custom Silicon Solutions is drawn from the company’s own website, its leadership profiles, business directories, and the analytics in our SEO engagement — and is cited in the Appendix. We have not assumed your revenue, headcount, unit volumes, or quote turnaround.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Market and industry figures are facts about the semiconductor environment, not claims about your results; ROI ranges are clearly marked as estimates. The real numbers come from discovery.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('One thing worth saying up front',
    ['Custom Silicon Solutions is already a Technijian My SEO client, so this is not a cold pitch and it is not a firm “without technology.” You run an in-house production test floor, partner across the major foundries, and design analog and mixed-signal silicon most firms cannot. This blueprint is therefore about going further with AI — extending the SEO we already run into AI-search authority, and adding automation to the engineering back office — not starting from zero.',
     'That is the standard of evidence behind every statement here: verified facts, labeled estimates, and honest questions.'], TEAL),
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
  p('Custom Silicon Solutions is a fabless, fab-agnostic custom-ASIC house in Irvine, California, designing analog, mixed-signal, high-voltage, and wireless silicon since 1996. The firm takes a design in at any stage — a concept on a napkin or a finished specification — and carries it through design, prototyping, in-house wafer and package test, and production. Its engineers average 25-plus years of experience, and the company cites more than 300 tape-outs with a 100% success record. It serves industrial, medical, aerospace-and-defense, and consumer programs, with named customers including Itron, Curtis Instruments, and Transoma Medical.', { spaceAfter: 120 }),
  p('That business — designing custom silicon a customer will build a product around for a decade — runs on engineering trust. This blueprint works on two fronts (Sections 10 and 11 detail both):', { spaceAfter: 120 }),
  kpiRow([
    { number: '1996', label: 'Designing custom ASICs (~30 years)', color: CORE_BLUE },
    { number: '300+', label: 'Tape-outs, 100% success (company-cited)', color: CORE_ORANGE },
    { number: '25+ yrs', label: 'Average engineer experience', color: TEAL },
    { number: '124', label: 'Organic search keywords today — the gap', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'Front one — win more design wins. ', bold: true, color: DARK_CHARCOAL }, { text: 'A custom-ASIC buyer is a design engineer at a finite, knowable set of OEMs — so growth is account-based, not broad advertising. A design engineer now asks an AI assistant before they ever pick up the phone; AI authority content makes Custom Silicon Solutions the cited expert that assistant names for “a US custom mixed-signal ASIC partner” or “a drop-in replacement for an obsolete part,” while account and trigger intelligence and faster RFQ responses help win the programs the business is built on.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — design and quote faster, and run leaner. ', bold: true, color: DARK_CHARCOAL }, { text: 'The engineering back office is where the time goes: turning a loose requirement into a spec and a quote, drafting datasheets and test programs, matching an obsolete part to a drop-in replacement, and capturing what the senior engineers know before they retire. AI does the repetitive share of that work fast, so the engineers spend their hours on judgment — and a qualified engineer still signs off every spec and parameter, with proprietary designs kept in private, governed systems.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is conservative on purpose. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented revenue figure or a guessed ROI here — your financials are not public, so we cite none. Investment is shown as real, published service ranges; returns are modeled only after discovery calibrates them against your real volumes, hours, and quote turnaround (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'A design engineer choosing a custom-ASIC partner increasingly starts with an AI assistant, and Custom Silicon Solutions — US-based, fab-agnostic, with its own test floor, a 100% tape-out record, and an obsolescence niche almost nobody else serves — is nearly invisible to that search. The firm already owns a hard-to-copy corner of the market; the gap is that the engineers who need exactly this cannot find it. AI closes that gap on the way in, and takes the repetitive load off the experts once the work begins.', CORE_ORANGE),
];

// ============================================================ SEC 01 — COMPANY & POSITION
const section1 = [
  ...sectionHeader('The Company & Market Position', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Custom Silicon Solutions’ own website and leadership profiles, business directories, and the analytics in our SEO engagement (see Appendix). Where directories carry estimated figures, we label them and defer to discovery.', { spaceAfter: 130 }),
  subHeader('A US-based, fab-agnostic custom-ASIC partner'),
  p('Custom Silicon Solutions designs and delivers custom Application-Specific Integrated Circuits — chips built for one customer’s product rather than sold off the shelf. The focus is analog, mixed-signal, high-voltage, and wireless silicon: the hard, expert end of chip design, where a circuit has to sense, convert, drive, or communicate in the physical world. As a fabless supplier the firm is fab-agnostic, choosing among major foundries for each design, but it is not asset-light where it counts — it owns and operates an in-house production test facility, so a chip is designed, tested, and qualified under one roof.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Attribute', weight: 24 }, { label: 'Verified fact', weight: 76 }],
    [
      [{ text: 'Identity', bold: true }, 'Custom Silicon Solutions, Inc. — a fabless, fab-agnostic custom-ASIC design and manufacturing house; headquartered in Irvine, California (Orange County). Operating since 1996 — nearly three decades.'],
      [{ text: 'Facility', bold: true }, 'A 30,000-sq-ft Irvine headquarters, including an owned-and-operated 8,000-sq-ft, Class-10,000 clean-room production test facility with in-house wafer probe and final packaged-part test.'],
      [{ text: 'What they do', bold: true }, 'Custom ASIC design from any starting point (“a concept sketched on a napkin or a complete specification”) through prototyping, test, and production; turnkey ASIC manufacturing; drop-in replacements for obsolete parts; and standard IC products.'],
      [{ text: 'Design specialties', bold: true }, 'High-voltage; sensors and MEMS interfacing; ultra-low-power (nano-amp) design; precision analog and data converters (Flash, SAR, and Sigma-Delta ADCs, plus DACs); and wireless communications (LNAs, mixers, VCOs, power amplifiers).'],
      [{ text: 'Markets', bold: true }, 'Industrial (drivers, power-management ICs, sensors, metering), medical devices, aerospace & defense, and consumer electronics.'],
      [{ text: 'Track record', bold: true }, 'More than 300 tape-outs with a 100% success record, and an average engineer experience of 25-plus years (both company-cited). Foundry partners cited include TSMC, GlobalFoundries, X-FAB, and Tower Semiconductor.'],
      [{ text: 'Leadership', bold: true }, 'President & CEO John Cheng (BSEE, UC Irvine; 35+ years; led 300+ tape-outs); VP Engineering & Technology Frank Bohac (co-founder, 1996; BSEE/MSEE, Purdue); VP Marketing & Business Development Jared Stevenson (BSEE/MSEE/MBA; 23+ years; previously a business-unit director at onsemi).'],
      [{ text: 'Existing relationship', bold: true, color: TEAL }, 'Custom Silicon Solutions is an active Technijian My SEO client; analytics (Google Analytics 4, Search Console) are connected and in use. This blueprint extends that relationship.'],
      [{ text: 'Revenue / headcount / volumes', bold: true, color: CRITICAL }, 'Not something we assume. Public profiles list a small team (roughly 11–50 on LinkedIn) and carry third-party revenue estimates; we treat headcount, revenue, and unit volumes as discovery items and cite none as fact.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your revenue, exact headcount, unit volumes, or active-customer count; your average NRE or quote turnaround; your design-win rate; or your quality certifications (for example ISO 9001, AS9100, or ITAR registration are not stated on the public site). These are the questions in Section 14.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW THEY DELIVER
const section2 = [
  ...sectionHeader('How Custom Silicon Solutions Delivers a Custom ASIC', CORE_BLUE, '02'),
  p('A custom ASIC is a long, expert process that turns a customer’s requirement into qualified silicon. Custom Silicon Solutions owns every link from a first sketch to a tested production part. Each link is also a place where AI sharpens the edge.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Custom Silicon Solutions delivers a custom ASIC', 600),
  caption('Figure 02.0 — A US-based, fab-agnostic turnkey model: take a design in at any stage, design and prototype it, test it on an in-house floor, and deliver production silicon to OEM design teams.'),
  pRuns([{ text: 'The in-house test floor is a real, hard-to-copy asset. ', bold: true, color: DARK_CHARCOAL }, { text: 'Many design houses hand a netlist to a foundry and a separate test house and hope the pieces line up. Custom Silicon Solutions owns its production test — wafer probe and final package test in a Class-10,000 clean room — so design intent, characterization, and qualification stay under one roof. That is the single most important fact for an AI plan: the highest-value AI here reads from and writes to the work the engineers already do — specs, datasheets, test programs, characterization reports — rather than replacing the systems they trust.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The work is expert, and much of it is still done by hand. ', bold: true, color: DARK_CHARCOAL }, { text: 'Turning a customer’s loose requirement into a spec and an NRE quote, drafting a datasheet, writing a test program, matching an obsolete part to a drop-in replacement, and answering a customer’s integration questions is skilled work done largely manually — and largely by a few long-tenured experts. That is exactly where AI returns the most: not by replacing the expertise, but by doing the repetitive 80 percent of it faster, so the engineers spend their time on judgment and on the customer relationship.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — INDUSTRY & MARKET
const section3 = [
  ...sectionHeader('Industry & Market Landscape', CORE_BLUE, '03'),
  p('Custom Silicon Solutions operates at a moment when several forces in the semiconductor market move in its favour at once. The points below are facts about that environment, not claims about the company — and nearly every one makes a US-based, specialized custom-ASIC partner more valuable, not less. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '$52B+', label: 'US CHIPS Act funding for domestic semiconductors', color: CORE_BLUE },
    { number: 'Reshoring', label: 'Supply-chain security now a buyer priority', color: CORE_ORANGE },
    { number: 'DMSMS', label: 'Part obsolescence is a standing program risk', color: TEAL },
    { number: 'Analog', label: 'Rising content in every sensor & power design', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('“Custom silicon” is having a moment — but know which one is theirs'),
  p('The headlines about custom ASICs are about AI accelerators — Broadcom, the hyperscalers’ in-house chips, and the like — built in enormous volumes on the most advanced nodes. That is a different business from Custom Silicon Solutions’, and it is worth saying plainly: the firm’s opportunity is not AI-accelerator silicon. Its market is the vast, less-glamorous world of analog and mixed-signal ASICs — sensor interfaces, power and high-voltage drivers, data converters, and ultra-low-power designs — at low-to-mid volumes and long lifecycles, where deep analog expertise and a US test floor matter more than the latest process node. The broader “design your own silicon” climate still helps: it has made custom ASICs a boardroom-level idea, which warms the market the firm has quietly served for decades.', { spaceAfter: 120 }),
  h3('Reshoring and supply security favour a US-domiciled partner'),
  p('The CHIPS and Science Act committed more than $52 billion to rebuild domestic semiconductor capability, and supply-chain security has become a procurement requirement rather than a preference — especially for aerospace, defense, and medical programs that cannot tolerate a sourcing surprise. A US-based, fab-agnostic design house with its own test floor is exactly the kind of partner that buyers under reshoring and trusted-supply pressure are told to find. The firm’s presence at venues such as GOMACTech, the government microelectronics forum, sits squarely in that conversation.', { spaceAfter: 120 }),
  h3('Component obsolescence is a permanent, underserved problem'),
  p('Industrial, medical, and defense products are designed to live for ten, twenty, or thirty years, but the chips inside them are not. When a part goes end-of-life, the team that built the product faces a last-time-buy, a costly redesign, or a hunt for a replacement — the discipline the defense world calls DMSMS (diminishing manufacturing sources and material shortages). A custom-ASIC house that can build a form-fit-function drop-in replacement turns that crisis into a quiet fix. It is a high-intent, recurring need that few competitors actively court, and that buyers actively search for — which makes it one of the clearest places where being found online pays off.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'Every force points the same way. Custom silicon is a board-level topic, reshoring favours a US partner, and obsolescence keeps creating high-intent buyers — but those buyers find a partner by searching, and increasingly by asking an AI assistant. A firm with these credentials that is hard to find online is leaving warm demand on the table. Being the cited answer, and quoting faster than anyone else, is the multiplier on exactly these tailwinds.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH & EFFICIENCY LIVE
const section4 = [
  ...sectionHeader('Where the Growth & Efficiency Live', CORE_BLUE, '04'),
  p('For a custom-ASIC house, value sits in four levers. AI supports each one without changing the engineering-and-relationship nature of the business.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 26 }, { label: 'What it looks like for Custom Silicon Solutions', weight: 50 }, { label: 'Front', weight: 24 }],
    [
      [{ text: 'Win more design wins', bold: true, color: CORE_BLUE }, 'Land and keep more programs across industrial, medical, A&D, and consumer — including faster, sharper responses to RFQs and part inquiries.', 'Growth'],
      [{ text: 'Be the expert engineers find', bold: true, color: CORE_BLUE }, 'Be cited and chosen when a design engineer searches — or asks an AI assistant — for a custom mixed-signal ASIC partner or an obsolete-part replacement, through authority content and AI-search visibility the firm has little of today.', 'Growth'],
      [{ text: 'Design & quote faster', bold: true, color: CORE_BLUE }, 'Turn requirements into specs, NRE quotes, datasheets, and test programs in a fraction of the time — so engineers spend hours on judgment, not paperwork.', 'Integration'],
      [{ text: 'Run the back office leaner', bold: true, color: CORE_ORANGE }, 'Automate characterization and quality documentation, customer technical support, and capture of veteran know-how — the repetitive load behind every design.', 'Integration'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first two levers are account-based: Custom Silicon Solutions already knows the kinds of companies it wins — so the plan is depth, timing, and being found, not broad “lead generation.” The second two are usually the easiest place to start, because they save hours on work the engineers already do every day, and the savings are visible inside one quarter.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — SEGMENTS (personas)
const section5 = [
  ...sectionHeader('The Customer Segments', CORE_BLUE, '05'),
  p('Custom Silicon Solutions serves a finite, knowable universe of OEM design teams — which is what makes its growth motion account-based rather than broad. The matrix maps the buyer archetypes by annual unit volume and value-and-complexity per program; the profiles that follow add the detail. These are research-based archetypes drawn from named customers, served markets, and trade-show presence — to calibrate at discovery, not your account list.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Customer segments matrix', 558),
  caption('Figure 05.0 — Buyer archetypes across the markets the firm serves. Bubble size approximates value per program; the obsolescence trigger cuts across all of them.'),
  personaCard('Industrial / IoT Design Engineer', 'Core volume — drivers, PMICs, sensors, metering (e.g. Itron, Curtis Instruments)', CORE_BLUE, [
    { label: 'Who they are', value: 'A design engineer or engineering manager at an industrial, IoT, metering, or motion/EV OEM, integrating analog and sensor functions into a product built in real volume.' },
    { label: 'Pain points', value: ['A board full of discrete analog parts that is too big, too power-hungry, or too easy to copy', 'BOM cost and supply risk across many separate components', 'Wanting to protect proprietary circuitry inside a single custom chip'] },
    { label: 'Decision driver', value: 'Integration that lowers BOM, size, and power while protecting IP and securing long-term supply.' },
    { label: 'AI opportunity', value: 'Faster RFQ-to-spec and NRE quoting; authority content for “integrate analog into a custom ASIC”; account intelligence on volume programs.' },
    { label: 'Technijian hook', value: 'My SEO authority + My AI quote/spec drafting so the firm answers a volume inquiry first and fastest.' },
  ]),
  spacer(160),
  personaCard('Medical-Device R&D Lead', 'High-value, long-cycle — implantable & wearable (e.g. Transoma Medical)', CORE_ORANGE, [
    { label: 'Who they are', value: 'An R&D lead or VP of Engineering at a medical-device maker needing ultra-low-power, sensor-interface, or implantable/wearable silicon with a long product life.' },
    { label: 'Pain points', value: ['Extreme low-power and reliability requirements that off-the-shelf parts miss', 'Traceability, documentation, and quality rigor across a long lifecycle', 'A partner who will still support the part many years from now'] },
    { label: 'Decision driver', value: 'Proven ultra-low-power and mixed-signal expertise, plus disciplined documentation and a durable US partner.' },
    { label: 'AI opportunity', value: 'Automated characterization/quality documentation; AEO authority for medical-grade low-power ASIC queries; knowledge capture that de-risks long support.' },
    { label: 'Technijian hook', value: 'My AI documentation automation + My SEO medical-ASIC authority, with private, governed handling of sensitive design data.' },
  ]),
  spacer(160),
  personaCard('Aerospace & Defense Program Engineer', 'Hi-rel, low-volume, long-life — trusted US supply (the GOMACTech audience)', TEAL, [
    { label: 'Who they are', value: 'A program or component engineer on a hi-rel aerospace, defense, or space program that needs trusted, US-based silicon for a system fielded for decades.' },
    { label: 'Pain points', value: ['Part obsolescence (DMSMS) threatening a fielded system', 'Trusted-supply and US-domicile requirements', 'Low volumes that big foundries and houses will not prioritize'] },
    { label: 'Decision driver', value: 'A US-based, fab-agnostic partner that will take a low-volume, long-life, hi-rel design and support it for the program’s life.' },
    { label: 'AI opportunity', value: 'Obsolescence cross-reference matching; authority content for DMSMS/last-time-buy searches; trigger intelligence on EOL notices.' },
    { label: 'Technijian hook', value: 'My Dev obsolescence cross-reference tool + My SEO so a DMSMS search finds the firm first.' },
  ]),
  spacer(160),
  personaCard('Obsolescence / Sustaining-Engineering Manager', 'Cross-cutting trigger — an EOL part in any market', GREEN, [
    { label: 'Who they are', value: 'A sustaining-engineering or sourcing manager — in industrial, medical, or defense — whose product just lost a critical chip to end-of-life and needs it kept alive.' },
    { label: 'Pain points', value: ['A discontinued part forcing a costly redesign or risky last-time-buy', 'Pressure to keep a profitable legacy product shipping', 'Searching urgently, online, for anyone who can build a replacement'] },
    { label: 'Decision driver', value: 'A form-fit-function drop-in replacement that avoids a full redesign and secures future supply.' },
    { label: 'AI opportunity', value: 'A parametric cross-reference matcher that turns a dead-part number into matched replacement candidates; AEO for obsolescence queries.' },
    { label: 'Technijian hook', value: 'My Dev cross-reference matcher + My SEO so “drop-in replacement for [obsolete part]” surfaces Custom Silicon Solutions — a high-intent, recurring entry point.' },
  ]),
  spacer(140),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your account list. Which segments matter most — by volume, by margin, by growth priority — is a discovery question. And the obsolescence trigger can appear inside any of them: an engineer whose part just went end-of-life is the warmest, highest-intent conversation available, and almost nobody is competing to be found for it. (Consumer electronics is a listed market; we treat it as a lighter, opportunistic fifth segment pending evidence, rather than forcing it into a profile.)', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE
const section6 = [
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  p('Custom Silicon Solutions competes with several different kinds of player at once — and the way to read the field is not by size, but by two axes: how much US-based, turnkey accountability the partner carries from design through in-house test to production, and how deep its analog and mixed-signal specialization runs at low-to-mid volumes.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Competitive positioning: US turnkey accountability vs analog/mixed-signal depth', 558),
  caption('Figure 06.0 — A strategic assessment (not a measured score). The top-right corner — US turnkey accountability and deep analog specialization together — is largely Custom Silicon Solutions’ own.'),
  buildTable(
    [{ label: 'Competitor type', weight: 24 }, { label: 'Examples', weight: 26 }, { label: 'Where they win / where they don’t', weight: 50 }],
    [
      [{ text: 'US analog/mixed-signal boutiques', bold: true, color: CORE_BLUE }, 'ASIC North, System to ASIC', 'Genuine US-based analog/mixed-signal peers — the closest direct competitors. They win on similar ground; the differentiator is its in-house production test floor, 100% tape-out record, and obsolescence niche — none of which is visible to a buyer searching online today.'],
      [{ text: 'Offshore analog ASIC houses', bold: true, color: CORE_BLUE }, 'AnSem, ICsense, Swindon Silicon', 'Deep analog/mixed-signal expertise and strong track records, but not US-domiciled — a disadvantage for reshoring-, ITAR-, and trusted-supply-sensitive programs in aerospace, defense, and medical.'],
      [{ text: 'Large / structured-ASIC players', bold: true, color: CORE_BLUE }, 'Renesas; AI-accelerator-scale houses', 'Win the high-volume, advanced-node, and AI-accelerator work — but rarely interested in low-to-mid-volume custom analog, and not the partner for an obsolescence rescue or a long-life hi-rel part.'],
      [{ text: 'Standard ICs / DIY discrete', bold: true, color: CORE_BLUE }, 'Catalog parts; in-house discrete design', 'The real default for many buyers: build it from off-the-shelf components. Cheapest to start, but no integration, no IP protection, more board area and supply risk — the gap a custom ASIC closes.'],
      [{ text: 'In-house design team', bold: true, color: CORE_BLUE }, 'A buyer’s own IC group', 'Maximum control and analog depth, but high fixed cost and scarce talent — most OEMs cannot justify a standing analog-IC team for occasional custom silicon.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and the moat',
    ['Few competitors combine all of Custom Silicon Solutions’ advantages: a US-domiciled, fab-agnostic design house, deep analog/mixed-signal/high-voltage specialization, an in-house production test floor, a cited 100% tape-out record, and an active obsolescence-replacement practice. Offshore houses are deep but not US-accountable; large players skip low-to-mid-volume analog; standard parts transfer no engineering help. The firm occupies a corner that is genuinely hard to copy.',
     'AI widens that moat — but first it makes the moat visible. The firm’s edge is expert judgment applied accurately, exactly what AI multiplies; and AI-search authority is what finally lets the engineers who need this corner discover it. A competitor wiring everything to one chatbot cannot match a specialist whose AI is grounded in its own design, test, and obsolescence work.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Custom Silicon Solutions’ public digital footprint, drawn from our own SEO engagement and observed in June 2026. Because we already run your SEO, this is a shared starting line, not a critique — and the headline is a sharp split: a deeply credible engineering operation behind a quiet digital front door. For an account-based business that is not a crisis, but it is the clearest, lowest-cost place to grow.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 24 }, { label: 'What we observe (June 2026)', weight: 50 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'SEO (live engagement)', bold: true, color: TEAL }, 'Active Technijian My SEO engagement; analytics (GA4, Search Console) and tag management connected and in use — a real, working foundation.', 'Extend SEO into AI search.'],
      [{ text: 'Organic search footprint', bold: true, color: CRITICAL }, 'Roughly 124 organic keywords and on the order of 100 organic visits per month — small against the breadth of the firm’s capabilities (each specialty is its own rich technical search space).', 'Capture the technical long-tail.'],
      [{ text: 'Paid search', bold: true }, 'No paid search running — fine for an account-based business, but it means every visit is earned, which makes organic and AI-search authority the whole game.', 'Earn the high-intent queries.'],
      [{ text: 'AI-search visibility', bold: true, color: CRITICAL }, 'Traditional SEO — even the SEO we run — does not automatically win citation by AI assistants, where buyers increasingly start. Custom Silicon Solutions is largely absent from those answers today.', 'Be the cited answer (AEO/GEO).'],
      [{ text: 'Content / authority', bold: true, color: CRITICAL }, 'A news/update section exists, but little published engineering authority — few deep pages on high-voltage, low-power, data-converter, or obsolescence topics buyers search.', 'Publish the expertise you have.'],
      [{ text: 'LinkedIn / social', bold: true }, 'A modest presence (reported on the order of a few hundred followers) with active trade-show updates (Sensors Converge, MD&M West, GOMACTech). A real, if quiet, channel.', 'A consistent expert voice.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most useful finding',
    'A firm with three decades of analog-design expertise and a 100% tape-out record publishes almost none of it — at the exact moment buyers are asking AI assistants who can design a custom mixed-signal ASIC or replace an obsolete part. That gap is not a weakness to hide; it is the lowest-cost growth lever available, because the expertise to fill it already lives inside the business. (We deliberately cite no precise follower or review count — those numbers are routinely wrong in cold research; for this firm, reputation is built through engineering relationships and trade standing, which is a strength.)', TEAL),
  subHeader('AI Search Reality Check (illustrative)'),
  p('To make the gap concrete, here is how an AI-assistant query in the firm’s space tends to resolve today. This is illustrative of how AI search behaves, not a screenshot — but it is easy to reproduce.', { spaceAfter: 110 }),
  calloutBox('Illustrative — a buyer asks an AI assistant',
    ['Prompt: “Who can design a custom low-power mixed-signal ASIC in the US, and replace an obsolete analog part?”',
     'Typical answer today: the assistant names a handful of large or well-published houses and offshore design services, drawn from whoever has the most authoritative public content — and a firm with little published authority, however qualified, is usually not named. The goal of the growth engine in Section 10 is simple: make Custom Silicon Solutions the firm that answer names.'], CORE_ORANGE),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the pitch, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Custom Silicon Solutions use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, and Gemini, with SEMrush, GA4, and Perplexity) that produces and optimises authority content and tracks AI-assistant citations — the same engine already working in your SEO engagement. How it applies: extend it from traditional SEO into AI-search authority for custom-ASIC and obsolescence queries, and into the technical long-tail your 124 keywords barely touch — the front-door gap from Section 7.', CORE_BLUE),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured, checked data — deployed for a regulated financial-services firm’s compliance workflows (RFP-style work cut from days to minutes). How it applies: RFQ-to-spec and NRE drafting, datasheet and app-note generation, and test-program and characterization documentation — the highest-volume, most repetitive engineering paperwork in the business.', CORE_ORANGE),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: a double-check on critical specification parameters and obsolescence cross-references — where a confident but wrong number is not a typo but a tape-out-killing, schedule-wrecking error. The model drafts; the engineer decides.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: Weaviate/Obsidian knowledge systems and an AI-native software practice that builds custom tools 3–5x faster. How it applies: a parametric obsolescence cross-reference tool on the Custom Silicon Solutions site that turns a dead-part search into a replacement opportunity, plus a searchable knowledge graph that captures what 25-plus-year engineers know before they retire — a real risk for a small, veteran team.', CORE_BLUE),
  subHeader('“Won’t AI cost a fortune?” — the multi-model discipline'),
  p('A fair question. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three providers and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume work (parsing datasheets, drafting first-pass content), mid-tier models for reasoning, and frontier models only for the small slice that needs deep judgment, such as a final accuracy pass on a critical parameter. In practice this runs roughly 60–80% below the price of routing everything to one premium model — and private, governed deployments keep your schematics, netlists, and customer designs out of public tools.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '09'),
  p('A short, impartial primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim — useful even for a team of engineers, because the questions here are about adoption and risk, not circuit design.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction, from Anthropic’s engineering guidance: ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable, low-risk, e.g. “draft a datasheet from this design data”) versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight). The principle is to use the simplest thing that works: start with quoting, documentation, and cross-reference automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('Where Custom Silicon Solutions sits today — and the next two rungs'),
  p('On a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks: foundational → emerging → operational → scaled → transformational), most established analog-design firms — Custom Silicon Solutions included — sit at the first or second rung: first-rate engineering tools, little applied AI in the commercial and documentation workflow. The leaders are a rung or two up, and the gap closes in months, not years. This engagement is about moving up two rungs, not buying a product.', { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer; for a chip company that is acute, so a qualified engineer signs off on every specification, parameter, quote, and cross-reference. An AI draft is a starting point, never the final word.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— your schematics, netlists, and customers’ designs never go into public AI tools; we use private, governed deployments. For ITAR- or export-sensitive work, this is non-negotiable, and we treat it that way.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool is inventoried with an owner, provider, and data source, straight from the NIST “Govern” function.' }]),
  h3('Why a partner, versus DIY or a new hire'),
  p('Do-it-yourself tools are inexpensive but leave you to assemble and govern the system. A capable full-time AI hire is scarce and runs well into six figures, and cannot cover strategy, build, security, and governance alone — a hard sell for a focused engineering team that needs its budget on silicon. A partner provides all four at a fraction of that, with proven builds — and architects, builds, and operationalises through to production rather than handing over a slide deck. Technijian’s approach is cybersecurity-first, which matters when the data is proprietary IC design.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth & Integration Engine', CORE_BLUE, '10'),
  p('The engine has three columns: win more design wins, design and quote faster with AI, and automate the engineering back office. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Custom Silicon Solutions AI growth and integration engine', 624),
  caption('Figure 10.0 — Win more design wins (left); design, quote, and cross-reference faster (centre); automate the engineering back office (right).'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Custom Silicon Solutions', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Authority & AEO content', 'Be the cited expert for custom mixed-signal ASIC and obsolescence queries; fill the content gap from Section 7.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Technical long-tail pages', 'Datasheet-grade pages per capability (high-voltage, low-power, data converters) so search and AI find the right expertise.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Account & trigger intelligence', 'Watch target OEMs for EOL notices, new programs, and design-win signals, to time outreach.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['RFQ → spec & NRE drafting', 'Turn a buyer’s loose requirement into a structured spec and quote estimate in minutes.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Obsolescence cross-reference', 'Match an obsolete part to drop-in replacement candidates, parametrically.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      ['Datasheet & test-program docs', 'Draft datasheets, app notes, characterization and test documentation from design data.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Customer technical support AI', 'Answer integration questions instantly from the firm’s own datasheets and design notes.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Institutional knowledge graph', 'Capture 25+-year engineers’ know-how before retirement; make it searchable for the team.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  pRuns([{ text: 'What peers report (industry directions, not guarantees). ', bold: true, color: DARK_CHARCOAL }, { text: 'Across technical-design and documentation operations, AI document automation routinely cuts drafting and review time by more than half; AI-assisted content is how firms get cited by the assistants buyers now ask first; and a parametric cross-reference turns a multi-hour obsolescence search into a same-session answer. These are industry-typical directions of travel, not promises — your numbers come from discovery (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The non-negotiable',
    ['AI augments the engineers and the work they already trust (specs, datasheets, test programs, the obsolescence practice); it does not replace the person who confirms a parameter, signs a quote, or owns a customer relationship. Every AI-drafted spec, quote, cross-reference, and datasheet is decision-support an engineer confirms.',
     'For a chip company this is the whole point: a wrong number on a datasheet or a mis-matched replacement is a tape-out and a schedule, not a typo — so a qualified engineer authorises every output, and your proprietary IC designs stay in private, governed deployments. That is how this stays trustworthy in a business built on engineering trust.'], TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '11'),
  p('We price from real, published service ranges and we model returns only after discovery. No figure below is a quote, and none is presented as Custom Silicon Solutions’ guaranteed result. Because you already run My SEO with us, the “land” here is mostly an extension of work in flight, not a new commitment.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path'),
  buildTable(
    [{ label: 'Phase', weight: 24 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 26 }],
    [
      [{ text: 'Land — extend & prove', bold: true, color: CORE_BLUE }, 'Extend the My SEO you already run into AI-search authority and the technical long-tail, run a half-day AI Readiness Assessment of your design/RFQ/test/documentation workflows, and stand up ONE high-ROI automation — the RFQ-to-spec/NRE drafting or the obsolescence cross-reference are the highest-conviction first builds.', 'My SEO (extend) + fixed-scope project'],
      [{ text: 'Expand — design & quote faster', bold: true, color: CORE_BLUE }, 'Add datasheet and test-program documentation automation, customer technical-support AI, account and trigger intelligence, and the custom parametric cross-reference tool on your site.', 'My AI + My Dev build'],
      [{ text: 'Scale — operate', bold: true, color: CORE_BLUE }, 'Fractional AI Advisor: ongoing guidance, the institutional knowledge graph, and a measured ROI dashboard.', 'Fractional AI Advisor (retainer)'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Investment ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 40 }, { label: 'Range (USD)', weight: 34 }, { label: 'Note', weight: 26 }],
    [
      ['My SEO — authority + AEO + long-tail', '$500–$1,500 / mo by tier, plus add-ons', 'published tiers; you are already a client'],
      ['AI Readiness Assessment / discovery', 'low five figures, fixed scope', 'one-time'],
      ['My AI — automation + intelligence', 'scoped to workflow count', 'recurring + build'],
      ['My Dev — cross-reference / quoting build', 'project-based', 'one-time build'],
      ['Fractional AI Advisor', '~$2,000+ / mo retainer', 'recurring'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a custom-ASIC house, ROI is modeled on hours recovered per RFQ, datasheet, and test program; faster quote turnaround winning more design wins; obsolescence searches captured that would otherwise never have found you; and senior-engineer knowledge retained — not on a guessed revenue number. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real volumes and hours (Section 14). Until then, any single ROI figure would be a guess, and we don’t guess. (Pricing is a single US-led blended rate; we do not expose per-component line items — a bundled price plus a clear labor-rate table is the professional norm.)' }], { spaceAfter: 120 }),
  calloutBox('The price of waiting',
    'Every quarter that the firm stays hard to find is a quarter of design engineers and obsolescence searches landing on a competitor’s page instead — and a quarter of RFQ, datasheet, and test-documentation hours spent by hand that AI could have given back to the engineers. The buyers asking AI assistants for a custom-ASIC partner are asking right now; the firm that becomes the cited answer, and quotes fastest, wins the programs that are searching today.', CORE_ORANGE),
  subHeader('Questions we usually get'),
  bulletRuns([{ text: '“We already do SEO with you.” ', bold: true, color: DARK_CHARCOAL }, { text: 'Right — and that is the head start. This extends it into AI-search authority and the technical long-tail, then adds automation. It builds on the engagement you have, rather than starting another.' }]),
  bulletRuns([{ text: '“Isn’t AI just hype?” ', bold: true, color: DARK_CHARCOAL }, { text: 'The hype is the autonomous-everything version. What we deploy here is narrow and proven: draft a spec, cross-reference an obsolete part, generate a datasheet, get cited by an AI assistant. Measurable, and it pays for itself.' }]),
  bulletRuns([{ text: '“Is our IP safe?” ', bold: true, color: DARK_CHARCOAL }, { text: 'Your schematics, netlists, and customer designs stay in private, governed deployments and never enter public AI tools — and we treat ITAR/export-sensitive work accordingly. Security-first is how we build.' }]),
  bulletRuns([{ text: '“What if it doesn’t work?” ', bold: true, color: DARK_CHARCOAL }, { text: 'The first build is small and scoped to one success metric. If it does not clear its cost, we tell you honestly and we stop — no lock-in.' }]),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself before the next begins — and sequenced to start with the lowest-risk, fastest wins, building on the SEO already in place.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Foundation, then quote and win faster, then scale and integrate. Targets calibrate at discovery.'),
  p('Phase one maps your design, RFQ, test, and documentation workflows, runs the AI readiness assessment, and extends the SEO we already run into AI-search authority and datasheet-grade capability pages so buyers begin to find you. Phase two delivers the work that pays fastest: RFQ-to-spec and NRE drafting, and the obsolescence cross-reference tool that turns dead-part searches into opportunities. Phase three adds characterization and test-documentation automation, a knowledge graph that captures decades of expertise, account and trigger intelligence on target OEMs, and a measured ROI dashboard so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions Custom Silicon Solutions can take now, with no new Technijian contract, that create value and set up the engagement:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Publish one piece of engineering authority. ', bold: true, color: DARK_CHARCOAL }, { text: 'A single strong page — “How to replace an obsolete analog part with a drop-in custom ASIC,” or “When a custom mixed-signal ASIC beats a board of discrete parts” — signals to buyers and to AI assistants that the firm has a voice. It is the first brick in the content gap, and we can fold it into the SEO already running.' }]),
  bulletRuns([{ text: 'Ask an AI assistant the buyer’s question. ', bold: true, color: DARK_CHARCOAL }, { text: 'Type “US custom low-power mixed-signal ASIC partner” and “drop-in replacement for [a part you’ve replaced]” into ChatGPT or Perplexity and see whether Custom Silicon Solutions is named. That two-minute test is the most persuasive view of the opportunity in this entire document.' }]),
  bulletRuns([{ text: 'Write down how an RFQ becomes a quote. ', bold: true, color: DARK_CHARCOAL }, { text: 'Document the steps from a customer inquiry to an NRE quote today — who touches it, what data they pull, how long it takes. That one page is the blueprint for the highest-ROI automation.' }]),
  bulletRuns([{ text: 'List the obsolete parts you’ve already replaced. ', bold: true, color: DARK_CHARCOAL }, { text: 'The cross-references you have done are the seed data for a parametric matcher — and each is a page that a sustaining engineer searching for that exact dead part could find.' }]),
  bulletRuns([{ text: 'Capture one veteran’s knowledge before the next retirement. ', bold: true, color: DARK_CHARCOAL }, { text: 'Record a short walkthrough from a long-tenured engineer on how they approach a design or a characterization — the raw material for a future knowledge graph, and a hedge against key-person risk on a small team.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call or a half-day AI Readiness Assessment — replace every estimate above with your real numbers. “We’re not sure” is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & priorities', CORE_BLUE, [
    'Roughly how does the business split across industrial, medical, A&D, and consumer programs — and which is the growth priority?',
    'Is the bigger near-term goal winning new design wins, being found by new buyers, or serving existing customers faster?',
    'How are target accounts identified today, and would faster, sharper RFQ responses win more of them?',
    'How large is the obsolescence-replacement practice today, and is it a growth priority?',
  ]),
  ...qGroup('B · How the work is done today', CORE_ORANGE, [
    'How is an RFQ turned into a spec and an NRE quote today — who is involved, and how long does it take?',
    'How are datasheets, app notes, test programs, and characterization reports produced now?',
    'How do you handle obsolescence cross-referencing — matching a discontinued part to a replacement — today?',
    'Where does engineering time actually go across design, test, documentation, and customer support?',
  ]),
  ...qGroup('C · Systems, data & IP', TEAL, [
    'What design, PLM/PDM, ERP, or CRM systems are in use, and how open are they to integration?',
    'What are the rules for any AI tool that touches schematics, netlists, or customer designs — and what work is ITAR/export-controlled?',
    'Do you hold ISO 9001, AS9100, ITAR registration, or other certifications we should design the AI governance around?',
  ]),
  ...qGroup('D · Brand & decision', CHARTREUSE, [
    'Beyond the SEO we run, who owns marketing and content, and is there appetite to publish engineering authority?',
    'Which capability or market would you most want to be the cited expert for first?',
    'Who sponsors this initiative, who else weighs in, and what would a successful first year look like?',
  ]),
  spacer(80),
  calloutBox('Two easy ways to answer',
    'Most of these take a 45-minute discovery call. For Sections B and C, a half-day AI Readiness Assessment maps your design, RFQ, test, and documentation workflows directly and returns a prioritised, costed automation roadmap — which is also the cleanest first engagement on top of the SEO already running.', CORE_ORANGE),
];

// ============================================================ SEC 15 — WHAT HAPPENS NEXT
const section15 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '15'),
  p('A low-commitment sequence that produces something useful at each step — and builds on the engagement we already have:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short working session — walk this blueprint and the Section 14 questions, and review where the SEO we run can extend into AI search. We are in Irvine, minutes from your office, so in person is easy.', 'A meeting. No new commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'AI Readiness Assessment — a half-day mapping of your design, RFQ, test, and documentation workflows, returned as a prioritised, costed roadmap.', 'A fixed-scope engagement; the roadmap is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand build — start with AI-search authority and one automation (RFQ/spec drafting or the obsolescence cross-reference); scale across the back office as each proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['A short working session is the easiest first step — building on the SEO we already run for you, with no new obligation. Or we begin with the AI Readiness Assessment for a deeper, costed roadmap.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · +1 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain, headquartered in Irvine, California — minutes from Custom Silicon Solutions. We help organisations across manufacturing, technology, professional services, and regulated industries move from AI curiosity to operational deployment — we architect, build, and operationalise through to production. Our dedicated pod model assigns a named team to each client, and our offices in Irvine and Panchkula, India provide round-the-clock coverage. Our approach is cybersecurity-first and AI-forward, with private, governed deployments for proprietary design data — and we already partner with Custom Silicon Solutions on SEO.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '+1 949.379.8499 (reaches both US and India teams)'],
      [{ text: 'US headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery centre', bold: true }, 'Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. could not confirm'),
  bullet('Identity (fabless, fab-agnostic custom-ASIC house), Irvine headquarters and 30,000-sq-ft facility, the owned 8,000-sq-ft Class-10,000 clean-room production test floor, the design specialties and markets, the turnkey scope including drop-in obsolete-part replacement, and leadership (John Cheng, Frank Bohac, Jared Stevenson) — VERIFIED (company website and leadership profiles).'),
  bullet('300+ tape-outs with 100% success and 25+-year average engineer experience — company-cited (labeled as such, not independently audited).'),
  bullet('Foundry partners (TSMC, GlobalFoundries, X-FAB, Tower) and named customers (Itron, Curtis Instruments, Transoma Medical) — VERIFIED (company website / testimonials).'),
  bullet('Active My SEO engagement and analytics (GA4, Search Console, tag manager) connected; ~124 organic keywords and ~100 organic visits/month; no paid search; no Google Business Profile (expected for a fabless B2B) — VERIFIED (Technijian SEO engagement data, June 2026).'),
  bullet('Trade-show presence (Sensors Converge 2026, MD&M West 2026, GOMACTech 2026) and a pressure-sensor-interface standard product shown with Murata — VERIFIED (company LinkedIn updates).'),
  bullet('Revenue, exact headcount, unit volumes, active-customer count, NRE/quote turnaround, design-win rate, and quality certifications (ISO 9001 / AS9100 / ITAR) — NOT confirmed; listed as questions in Section 14.'),
  bullet('No precise LinkedIn follower count or review count is asserted — these are unreliable in cold research and deliberately omitted.'),
  subHeader('Selected sources'),
  ...[
    'Custom Silicon Solutions — company website (Home, About, Design Services, Products, Contact): customsiliconsolutions.com.',
    'Leadership profiles — company About page and LinkedIn (John Cheng; Frank Bohac; Jared Stevenson).',
    'Industry directories and listings — AnySilicon, CB Insights, ZoomInfo (location, classification, and third-party headcount/revenue estimates, labeled as such).',
    'Market & trade — US CHIPS and Science Act ($52B+ domestic semiconductor funding); DMSMS / part-obsolescence practice (defense and long-life industrial programs); AI-accelerator custom-ASIC coverage (cited only to distinguish the firm’s niche).',
    'Competitive — ASIC North, System to ASIC (US analog/mixed-signal peers); AnSem, ICsense, Swindon Silicon (offshore analog houses); Renesas / structured-ASIC players.',
    'SEO engagement data — Technijian My SEO workspace for customsiliconsolutions.com (SEMrush domain overview; GA4/GSC/GTM connection status), June 2026.',
    'AI framing — MIT Sloan (AI literacy); Anthropic (“Building Effective Agents,” workflows vs. agents); NIST AI Risk Management Framework (Govern/Map/Measure/Manage); Gartner / Google Cloud maturity models.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider environment; figures specific to Custom Silicon Solutions are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Custom Silicon Solutions  ·  AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Custom Silicon Solutions — AI Growth & Integration Blueprint', description: 'A facts-only AI Growth & Integration blueprint for Custom Silicon Solutions, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Custom-Silicon-Solutions-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
