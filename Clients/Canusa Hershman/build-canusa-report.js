// Canusa Hershman (CHR) — AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY discipline: verified facts only,
// estimates clearly labeled, unknowns -> Questions section. Authentic logo.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  TabStopType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
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
const PASS = strip(tokens.color.status.pass.$value);
const GREEN = '28A745';
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 16, 2026';
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
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 46, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
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
  centered('Canusa Hershman', { size: 52, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Where AI grows the trade and integrates the back office — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(900),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Canusa Hershman — Executive Leadership', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR CANUSA HERSHMAN LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...sectionHeader('How to Read This Blueprint', CORE_BLUE, ''),
  p('This blueprint was prepared from public research, before any technical discovery. It holds itself to a simple discipline:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Canusa Hershman is drawn from the company’s own website, trade press, or public records, and is cited in the Appendix. We have not assumed your internal financials, systems, or tonnage by division.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Market figures, ROI ranges, and impact numbers are clearly marked as estimates or market-typical context — never presented as your results. The real numbers come from discovery.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('A correction we made for accuracy',
    ['Three details that circulate about this account did not survive verification, so we have left them out and turned them into questions: an "ISO-certified" claim (no ISO 9001/14001 is published on your site), a "Plymouth, Michigan" headquarters (your verified HQ is Branford, CT), and a "Frontier Trading" partnership (no public record). If any are in fact true, tell us and we will fold them in.',
     'That is the standard of evidence you should expect from every Technijian deliverable.'], TEAL),
];

// ============================================================ TOC
const toc = [
  ...sectionHeader('Contents', CORE_BLUE, ''), spacer(80),
  ...[
    ['01', 'The Company & Market Position'],
    ['02', 'How Canusa Hershman Trades'],
    ['03', 'Industry & Regulatory Landscape'],
    ['04', 'Where the Growth & Efficiency Live'],
    ['05', 'The Trade Relationships'],
    ['06', 'Competitive Landscape'],
    ['07', 'Brand & Digital Presence Audit'],
    ['08', 'Technijian Capability Proof'],
    ['09', 'Understanding AI — A Field Guide for Leadership'],
    ['10', 'The AI Growth & Integration Engine'],
    ['11', 'Business Impact & Investment'],
    ['12', 'Implementation Roadmap'],
    ['13', 'Quick Wins — Start This Week'],
    ['14', 'Questions to Complete the Analysis'],
    ['15', 'What Happens Next'],
    ['', 'About Technijian'],
    ['', 'Appendix — Sources & What Remains to Confirm'],
  ].map(([n, t]) => new Paragraph({ spacing: { before: 56, after: 56 }, tabStops: [{ type: TabStopType.LEFT, position: 720 }], children: [
    new TextRun({ text: n || '·', size: 22, bold: true, color: CORE_ORANGE, font: FONT_HEAD }),
    new TextRun({ text: '\t' + t, size: 22, color: DARK_CHARCOAL, font: FONT_BODY }),
  ] })),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Canusa Hershman is an independent, founder- and family-held group that sits in the middle of a two-sided global trade: it sources recovered fiber, plastics, and metals from generators across North America and beyond, finances and moves the material, and sells it to paper mills and material consumers worldwide. Since rebranding from "Canusa Hershman Recycling Company" to a parent brand in 2021, it has operated as a group of divisions — the core trading business, Recycle 1 processing, BA/CH Polymers, Evergreen Fibres, Pulp & Alternative Fibers, and the Newport CH export joint venture — and it has been the consolidator in its market, acquiring rather than being acquired.', { spaceAfter: 120 }),
  p('This blueprint shows where AI creates measurable value for a business like that, on two fronts at once:', { spaceAfter: 120 }),
  kpiRow([
    { number: '2002', label: 'Founded (roots to 1887)', color: CORE_BLUE },
    { number: '1M+', label: 'Tons/yr traded (self-reported)', color: CORE_ORANGE },
    { number: '6', label: 'Operating divisions', color: TEAL },
    { number: 'cieTrade', label: 'Core system of record', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'Front one — grow the trade. ', bold: true, color: DARK_CHARCOAL }, { text: 'A commodities trader grows by deepening relationships on both sides — more supply placed, more offtake secured, better timing on price. AI does not replace the trader; it arms them: market-signal and price decision-support, account and credit intelligence, pre-call dossiers, and authority content that makes Canusa Hershman the cited name when a generator or mill searches for a partner.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — integrate and run leaner. ', bold: true, color: DARK_CHARCOAL }, { text: 'The back office is where the fastest, lowest-risk returns sit: automating bills of lading, customs declarations, and certificates of origin into cieTrade; self-serve portals and a chatbot for suppliers and customers; logistics and container optimization on export; and sustainability reporting. This is the efficiency front the April introduction letter already pointed to.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is conservative on purpose. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented revenue figure or a guessed ROI here — the public revenue numbers for the group conflict, so we cite none as fact. Investment is shown as real, published Technijian service ranges; returns are modeled only after a discovery call calibrates them against your real trade margins and volumes (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'AI plugs into the system you already run — cieTrade — and into the relationships your traders already own. The win is a trader who walks into every call already briefed, a back office that stops re-keying documents, and a brand that finally shows up when the market goes looking. We start small, prove it, then scale.', CORE_ORANGE),
];

// ============================================================ SEC 01 — COMPANY & MARKET POSITION
const section1 = [
  ...sectionHeader('The Company & Market Position', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Canusa Hershman’s own website, trade press, and public registries (see Appendix).', { spaceAfter: 130 }),
  subHeader('A group, not a single company'),
  p('In January 2021 the business rebranded from "Canusa Hershman Recycling Company" to "Canusa Hershman" as a parent brand, with the original trading company (CHRC) becoming one division among several. The enterprise today is a group:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Division', weight: 26 }, { label: 'Origin', weight: 16 }, { label: 'Role', weight: 58 }],
    [
      [{ text: 'Canusa Hershman Recycling (CHRC)', bold: true, color: CORE_BLUE }, '2002', 'Core trading of recovered fiber, plastics, and metals; the original operating company.'],
      [{ text: 'Recycle 1', bold: true, color: CORE_BLUE }, 'acq. 2022', 'Processing operations across four plants, including the former Arizona Pacific Pulp & Paper in Phoenix.'],
      [{ text: 'BA/CH Polymers', bold: true, color: CORE_BLUE }, '2009', 'Recycled and virgin plastic resin trading.'],
      [{ text: 'Evergreen Fibres', bold: true, color: CORE_BLUE }, 'acq. 2021', 'Containerboard and packaging papers (Paper Alliance, Alliance Paperboard).'],
      [{ text: 'Pulp & Alternative Fibers', bold: true, color: CORE_BLUE }, 'pre-2021', 'Low-carbon pulp and alternative-fiber trading.'],
      [{ text: 'Newport CH International', bold: true, color: CORE_BLUE }, 'JV 2003', 'Export joint venture (Orange, CA) into Asia and Latin America.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Independent, and the consolidator'),
  pRuns([{ text: 'This is an independent, founder- and family-held LLC — not private-equity-owned and not a strategic acquisition target. ', bold: true, color: DARK_CHARCOAL }, { text: 'The Hershman side traces to 1887 in New Haven, Connecticut; the Canusa side was founded in 1981 by Bruce W. Fleming; the two merged in 2002. Since 2020 the group has been buying (Mehali, Evergreen Fibres, Recycle 1/Arizona Pacific), not being bought. A separate Fleming-family investment company, Canusa Corporation, holds an equity interest. For this plan, that matters: Canusa Hershman is a scale player extending its lead, and AI is a lever to widen the gap — not a turnaround.' }], { spaceAfter: 120 }),
  subHeader('Scale, leadership, and footprint (verified)'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Headquarters', bold: true }, 'Branford, Connecticut (45 Northeast Industrial Road). Plants/offices in Baltimore MD, St Albans VT, Wellford SC, and Phoenix AZ; Newport CH in Orange CA; a registered UK entity in Canterbury.'],
      [{ text: 'Scale', bold: true }, 'Self-reports "more than one million tons per year" of recovered fiber, plastics and metals plus "200+ million pounds" of plastic resin; trade press (2022) cited 105,000+ tons per month. Employee band 51–200 (LinkedIn).'],
      [{ text: 'Leadership', bold: true }, 'John Daniel, CEO; Ethan Hershman and Bruce W. Fleming, Co-Chairmen; Todd Laggis, CFO (all verified in company and trade-press sources).'],
      [{ text: 'Export reach', bold: true }, 'Described as one of the industry’s largest direct exporters to Latin America, India, and Southeast Asia.'],
      [{ text: 'Revenue', bold: true, color: CRITICAL }, 'Not stated as a verified fact — public figures conflict ($100M+ at the 2002 merger; a ~$400M order-of-magnitude in a third-party bio; an implausible data-broker figure). We cite no hard revenue and treat this as a discovery item.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: tonnage or revenue by division; which recovered-paper grades and metals you trade; your rail-versus-ocean mix; whether you hold ISO certifications; or how price, credit, and trade documents are handled today. These are the questions in Section 14.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW THEY TRADE
const section2 = [
  ...sectionHeader('How Canusa Hershman Trades', CORE_BLUE, '02'),
  p('Canusa Hershman describes its value to the market in three parts — and each is a place where AI and integration can sharpen the edge.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Canusa Hershman trades the market', 612),
  caption('Figure 02.0 — A two-sided trade: source and process, finance and move, sell to mills and consumers worldwide.'),
  buildTable(
    [{ label: 'The value Canusa Hershman provides', weight: 30 }, { label: 'What it means', weight: 44 }, { label: 'Where AI sharpens it', weight: 26 }],
    [
      [{ text: 'Market access', bold: true, color: CORE_BLUE }, 'Global trading relationships that place tonnage and secure offtake across domestic and export markets.', 'Account & price intelligence; authority content.'],
      [{ text: 'Financial solutions', bold: true, color: CORE_BLUE }, 'Prompt payment to suppliers, flexible/extended terms to customers, and equipment financing.', 'Credit-risk scoring; exposure monitoring.'],
      [{ text: 'Supply-chain management', bold: true, color: CORE_BLUE }, 'Pickup, delivery, and logistics through shipping lines, forwarders, haulers, and warehouses.', 'Trade-doc automation; container/lane optimization.'],
    ], { headerColor: TEAL }),
  spacer(80),
  pRuns([{ text: 'The system of record is cieTrade. ', bold: true, color: DARK_CHARCOAL }, { text: 'The company’s supplier and customer portals run on cieTrade, the recovered-materials trading platform. That is the single most important fact for an integration plan: the highest-value AI here does not replace cieTrade — it reads from and writes to it, so traders and the back office work inside the system they already trust.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — INDUSTRY & REGULATORY  (agent-2 refines)
const section3 = [
  ...sectionHeader('Industry & Regulatory Landscape', CORE_BLUE, '03'),
  p('Recovered-materials trading is a margin-thin, logistics-heavy business reshaped by global policy. The forces below are facts about the market Canusa Hershman operates in — not claims about the company — and each rewards better information and faster, cleaner paperwork. Sources are listed in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '~27%', label: 'of US recovered paper exported (falling 3 yrs)', color: CORE_BLUE },
    { number: '>8M', label: 'tons/yr new domestic recycled-fiber capacity since 2018', color: CORE_ORANGE },
    { number: '7', label: 'US states with packaging EPR laws', color: TEAL },
    { number: '2018', label: 'China "National Sword" inflection', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('The demand map redrew — and is tilting domestic'),
  p('China’s "National Sword" ban (effective January 1, 2018, with a 0.5% contamination limit) collapsed export demand and prices almost overnight: average OCC fell from roughly $174/ton in 2017 to about $25/ton by 2019, and mixed paper went to $0 and briefly negative. Redirected tonnage to Southeast Asia closed almost as fast. The lasting effect is that roughly 73% of US recovered paper is now consumed domestically, with exports declining three years running — even as the counterweight builds: more than 8 million tons per year of new 100%-recycled US mill capacity has come online since 2018 (Green Bay Packaging, Pratt, Cascades Bear Island, Domtar Kingsport, Graphic Packaging). In this market, knowing in near-real time where a grade clears best is a direct margin lever.', { spaceAfter: 120 }),
  h3('Plastics and packaging face tightening rules'),
  p('The Basel Convention plastic-waste amendments (in force 2021) brought most plastic-scrap exports under prior-consent controls — and because the United States is not a Basel Party, US exporters of mixed or contaminated plastic are effectively limited to OECD destinations plus Canada and Mexico; only clean, single-resin material still moves freely. In parallel, seven US states have enacted packaging Extended Producer Responsibility laws (Maine, Oregon, Colorado, California, Minnesota, Maryland, Washington), with California’s SB 54 rules taking effect in 2026 and fee structures that tilt producers toward fiber. The common thread is more compliance documentation per shipment — exactly the repetitive, error-prone work AI document processing was built for.', { spaceAfter: 120 }),
  h3('Grades, specs, and a price benchmark now in question'),
  p('Recovered fiber and metals trade against published industry specifications (the ReMA/ISRI grade definitions — OCC is grade #11, sorted office paper #37, mixed paper #54), and prices are benchmarked largely through Fastmarkets RISI. Notably, that benchmark is increasingly contested: in 2025 major paper producers publicly began moving away from the long-standing price index, arguing it no longer reflected the market — which opens room for faster, more transparent market intelligence. Meanwhile every cross-border load still carries a bill of lading, a customs declaration, a certificate of origin, and an electronic export filing. None of this is going away; the manual handling around it is where time and margin leak today.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'Extreme, regional, policy-driven volatility rewards better price and market signals; redirected trade flows reward speed in matching grade to buyer; tighter export rules reward automated, accurate documentation; and a contested price index rewards whoever can see the market more clearly. Each industry force points at a specific AI capability later in this blueprint — and none requires Canusa Hershman to change what it sells, only how fast and how well it moves information.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where the Growth & Efficiency Live', CORE_BLUE, '04'),
  p('For a two-sided trader, "growth" is not a single funnel. It is four levers, and AI supports each without changing the relationship-driven nature of the business.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 24 }, { label: 'What it looks like for Canusa Hershman', weight: 50 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Place more supply', bold: true, color: CORE_BLUE }, 'Win more tonnage from generators, MRFs, manufacturers and brands — including ESG-motivated sellers who want a documented, responsible outlet.', 'Growth'],
      [{ text: 'Secure more offtake', bold: true, color: CORE_BLUE }, 'Deepen domestic-mill and export-mill relationships; be the first call when a buyer needs a grade.', 'Growth'],
      [{ text: 'Trade the margin', bold: true, color: CORE_BLUE }, 'Better timing and grade-to-market matching on price; faster response when a lane opens.', 'Growth'],
      [{ text: 'Run leaner', bold: true, color: CORE_ORANGE }, 'Cut the manual hours in documentation, credit checks, logistics coordination, and reporting.', 'Integration'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first three levers are account-based: Canusa Hershman already knows who the mills and the large generators are. So the growth plan is depth and timing, not broad "lead generation." The fourth lever — efficiency — is often the easiest yes, because it saves money on work the team already does and de-risks the compliance that trade demands.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — TRADE RELATIONSHIPS (personas)
const section5 = [
  ...sectionHeader('The Trade Relationships', CORE_BLUE, '05'),
  p('Canusa Hershman manages a portfolio of relationships on both sides of the trade. The matrix below maps the archetypes by trade volume and strategic value — archetypes to calibrate at discovery, not named accounts.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Trade-relationship matrix', 560),
  caption('Figure 05.0 — Buy-side and sell-side relationship archetypes. Bubble size approximates relative volume.'),
  buildTable(
    [{ label: 'Relationship', weight: 24 }, { label: 'What they need', weight: 40 }, { label: 'How AI helps Canusa Hershman serve them', weight: 36 }],
    [
      [{ text: 'Export mill buyer', bold: true, color: CORE_ORANGE }, 'Reliable grade, on-spec quality, and clean export documentation, on time.', 'Automated, accurate trade docs; container/lane optimization.'],
      [{ text: 'Domestic mill buyer', bold: true, color: CORE_BLUE }, 'Consistent supply at a fair, market-referenced price.', 'Price/market signals; faster grade-to-buyer matching.'],
      [{ text: 'Large generator / MRF', bold: true, color: TEAL }, 'Prompt payment and a dependable outlet for tonnage.', 'Inbound capture; credit/exposure visibility.'],
      [{ text: 'Brand / ESG supplier', bold: true, color: GREEN }, 'A documented, responsible recovery story for their reporting.', 'Sustainability / diversion reporting automation.'],
      [{ text: 'Plastics / resin buyer', bold: true, color: DARK_CHARCOAL }, 'Spec-matched resin and compliant cross-border movement.', 'Spec matching; Basel/EPR documentation support.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your CRM. Which segments matter most — by tonnage, by margin, by growth priority — is a discovery question. We would rather build the plan around your real book of business than around our assumptions about it.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE (agent-2 refines; competitive.png added later)
let section6 = [
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  p('Canusa Hershman competes with integrated paper/packaging producers that buy their own fiber, with other large independent traders and brokers, and with regional processors. The throughline below is digital and AI maturity — because that, not scale, is the open lane.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Competitive positioning: scale vs digital and AI maturity', 560),
  caption('Figure 06.0 — A strategic assessment (not a measured score). The "scale + AI" corner is uncontested.'),
  buildTable(
    [{ label: 'Type of competitor', weight: 28 }, { label: 'Examples', weight: 34 }, { label: 'Digital / AI posture (general read)', weight: 38 }],
    [
      [{ text: 'Integrated producers', bold: true, color: CORE_BLUE }, 'Smurfit WestRock (~$21B), International Paper / DS Smith (brokers 7M+ tons fiber/yr), Pratt Recycling (3M+ tons/yr), Greif / Caraustar (sells ~50% externally)', 'Recovered fiber is a captive input, not a marketed capability. Strong operations; no public fiber-trading portal or price index.'],
      [{ text: 'Independent traders / exporters', bold: true, color: CORE_BLUE }, 'Cellmark (4B+, employee-owned, 2M+ tons/yr), America Chung Nam (#1 US recovered-paper exporter), Potential Industries', 'The closest peers — global reach, relationship-led. Yet none runs a public price index, a trading portal, or a stated trading AI; even the #1 exporter fronts a brochure site.'],
      [{ text: 'Haulers & regional brokers', bold: true, color: CORE_BLUE }, 'WM, Republic Services; regional MRFs / brokers; B2B scrap marketplaces', 'Strong in-plant AI sorting and billing apps, but no recovered-commodity trading portal. Marketplaces cluster in plastics/metals, mostly outside the US.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space',
    ['The value chain already has a sophisticated price-intelligence layer (Fastmarkets RISI) and a fast-arriving, well-funded AI layer at the sorting plant (AMP, Greyparrot, Glacier) — but the trading desk between them is stubbornly analog. Across roughly three dozen peers, no large recovered-fiber trader runs a public price index, a trading portal, or a stated trading AI: even Cellmark (over $4B in revenue) and America Chung Nam (the #1 US exporter) front relationship-and-phone trading with brochure websites.',
     'Canusa Hershman has the scale and the system of record (cieTrade) to own the open corner first — which compounds into both reputation (supply and offtake find you) and efficiency (the back office runs leaner than rivals’). The data already exists; the edge goes to whoever puts it on the trader’s desk.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Canusa Hershman’s public digital footprint as observed in June 2026. The point is not criticism — it is that the gap between the quality of the business and the quality of its digital presence is itself the opportunity.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 24 }, { label: 'What we observed', weight: 50 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Website', bold: true }, 'WordPress; clear "what we do," history, and sustainability pages; tagline "Your Trusted Partner in Global Trade."', 'Solid base to build authority on.'],
      [{ text: 'Trading portals', bold: true }, 'Supplier/customer portals run on cieTrade (CHRC and CHMD). A real system of record.', 'The anchor for every integration play.'],
      [{ text: 'Content / market voice', bold: true, color: CRITICAL }, 'No active blog, news, or published market/price commentary; no public grade-spec resources.', 'Own the market conversation; feed AEO.'],
      [{ text: 'LinkedIn', bold: true, color: CRITICAL }, 'Company industry is mislabeled as "Renewable Energy Semiconductor Manufacturing"; activity is sparse (~1,471 followers).', 'A one-day fix; then a real presence.'],
      [{ text: 'Search / AEO', bold: true }, 'No evident optimization for the terms generators and mills use, or for AI-assistant citation.', 'Be found and cited where buyers look.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most quotable finding',
    'A company that moves more than a million tons a year is currently classified on LinkedIn as a semiconductor manufacturer, and publishes no market commentary in a market that runs on information. That gap is not a weakness to hide — it is the single clearest place to start, and it costs almost nothing to begin.', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the pitch, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Canusa Hershman use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured data and drafted output — deployed for a FINRA broker-dealer’s compliance workflows. How it applies: bills of lading, customs declarations, and certificates of origin parsed and reconciled into cieTrade — the highest-volume, most error-prone paperwork in export trade.', CORE_BLUE),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini + MCP, SEMrush, GA4, Perplexity) that produces and optimizes authority content and tracks AI-assistant citations. How it applies: make Canusa Hershman the cited name for recovered-material sourcing and grade questions — and fix the brand-hygiene gaps.', CORE_ORANGE),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: credit-risk and counterparty checks, and price/market-signal summaries, where a single model’s confident error is unacceptable.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: Weaviate/Obsidian knowledge systems and an AI-native software delivery practice (3–5x faster builds). How it applies: a supplier/customer portal and chatbot on top of cieTrade, and an institutional-knowledge layer so a 145-year trading history is searchable, not stuck in inboxes.', CORE_BLUE),
  subHeader('"Won’t AI cost a fortune?" — the multi-model discipline'),
  p('A fair question for a margin-thin business. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform — roughly seven models across three vendors and three capability tiers — and send each sub-task to the cheapest model that can do it well: lightweight models for high-volume extraction (parsing thousands of documents), mid-tier models for reasoning and drafting, and frontier models only for the small slice that needs deep judgment. Where quality is non-negotiable, several models peer-review the same output. In practice this runs roughly 60–80% below the cost of routing everything to one premium model — and private, governed deployments keep counterparty and pricing data out of public tools.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '09'),
  p('A short, vendor-neutral primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it (MIT Sloan). The most useful distinction, from Anthropic’s engineering guidance: ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable, low-risk, e.g. "extract these fields from this bill of lading") versus ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight). The principle is to use the simplest thing that works: start with document and content automations that pay off fast, add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The three risks every leader must manage (NIST AI Risk Management Framework)'),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer; a human signs off on anything that moves money or material. Price "predictions" are decision-support, never a guarantee.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— counterparty, pricing, and contract data never go into public AI tools; we use private, governed deployments.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool is inventoried with an owner, vendor, and data source, straight from the NIST "Govern" function.' }]),
  h3('Why a partner, versus DIY or a new hire'),
  p('Do-it-yourself tools are cheap but leave you to assemble and govern the system. A capable full-time AI hire costs well over $180,000 a year, is scarce, and cannot cover strategy, build, security, and governance alone. A partner provides all four at a fraction of the cost, with proven builds — and, as the introduction letter put it, we architect, build, and operationalize through to production rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth & Integration Engine', CORE_BLUE, '10'),
  p('The engine has three columns: get found and trusted, arm the traders with intelligence, and integrate the back office around cieTrade. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Canusa Hershman AI growth and integration engine', 624),
  caption('Figure 10.0 — Get found (left); trade & account intelligence (center); operations & integration on cieTrade (right).'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Canusa Hershman', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Authority & AEO content', 'Publish market commentary and grade guides; be the cited source in AI assistants and search.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Brand hygiene + per-location', 'Fix the LinkedIn mislabel; profiles for Branford and the Recycle 1 plants.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Commodity price & market signals', 'Decision-support on price trends and where a grade clears best — probabilistic, human-confirmed.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Account & credit intelligence', 'Vendor/customer risk scoring; pre-call dossiers for traders and account executives.', { text: 'My AI / Lead Gen', bold: true, color: CORE_BLUE }],
      ['Trade-document automation', 'Bills of lading, customs declarations, certificates of origin — parsed into cieTrade.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Portal + chatbot on cieTrade', 'Self-serve order, document, and balance lookups for suppliers and customers, 24/7.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      ['Logistics & container optimization', 'Match loads to lanes and forwarders; cut demurrage and empty miles on export.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      ['ESG / sustainability reporting', 'Automate diversion and recovery reporting for customers and the sustainability page.', { text: 'My AI', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'AI augments the trader and the cieTrade system of record; it does not replace the relationship that closes a contract or the human who signs off on a trade. Every "prediction" is decision-support a person confirms. That is how this stays trustworthy in a business built on trust.', TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '11'),
  p('We price from real, published service ranges and we model returns only after discovery. No figure below is a quote, and none is presented as Canusa Hershman’s guaranteed result.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Land — prove it', bold: true, color: CORE_BLUE }, 'AI Readiness Assessment (map workflows + cieTrade), brand-hygiene + authority/AEO content, and ONE high-ROI automation (e.g., trade-doc parsing).', 'Fixed-scope projects + My SEO'],
      [{ text: 'Expand — integrate', bold: true, color: CORE_BLUE }, 'Price/market-signal and account/credit intelligence; supplier/customer portal + chatbot on cieTrade; logistics optimization.', 'My AI + My Dev build'],
      [{ text: 'Scale — operate', bold: true, color: CORE_BLUE }, 'Fractional AI Advisor: ongoing guidance, new automations across divisions, and a measured ROI dashboard.', 'Fractional AI Advisor (retainer)'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Market-typical investment ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 40 }, { label: 'Market-typical range', weight: 34 }, { label: 'Note', weight: 26 }],
    [
      ['AI readiness / discovery engagement', 'low five figures, fixed scope', 'one-time'],
      ['My SEO — authority + AEO + brand hygiene', '~$2,500–$3,000 / mo', 'recurring'],
      ['My AI — automation + intelligence', 'scoped to workflow count', 'recurring + build'],
      ['My Dev — portal / chatbot / integration build', 'project-based', 'one-time build'],
      ['Fractional AI Advisor', '~$2,000+ / mo retainer', 'recurring'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a margin-thin trader, ROI is modeled on trade margin and hours recovered — not on revenue. The levers are concrete: hours saved per shipment on documentation, faster grade-to-buyer matching, reduced credit losses, and reduced demurrage. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real volumes (Section 14). Until then, any single ROI figure would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself before the next begins — and sequenced to start with the lowest-risk, fastest wins.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Foundation, then trade intelligence, then integrate & scale. Targets calibrate at discovery.'),
  p('Phase one fixes the brand-hygiene basics, stands up authority content, and runs the AI readiness assessment against cieTrade. Phase two delivers price/market-signal decision-support and the first trade-document automation. Phase three integrates the portal, logistics, credit, and ESG reporting, and stands up a measured ROI dashboard so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions Canusa Hershman can take now, with no Technijian contract, that create value and set up the engagement:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Fix the LinkedIn industry label. ', bold: true, color: DARK_CHARCOAL }, { text: 'Change "Renewable Energy Semiconductor Manufacturing" to the correct recovered-materials / wholesale-trade category. A five-minute fix that stops misrepresenting the business.' }]),
  bulletRuns([{ text: 'Publish one market note. ', bold: true, color: DARK_CHARCOAL }, { text: 'A single short commentary on a current grade or lane signals to suppliers, buyers, and search engines that Canusa Hershman has a market voice.' }]),
  bulletRuns([{ text: 'List your traded grades and specs publicly. ', bold: true, color: DARK_CHARCOAL }, { text: 'A simple specs page captures the searches generators and mills actually run.' }]),
  bulletRuns([{ text: 'Pick the single most painful document. ', bold: true, color: DARK_CHARCOAL }, { text: 'Identify the one export document that eats the most staff time — that becomes the first automation target.' }]),
  bulletRuns([{ text: 'Name a cieTrade owner for the project. ', bold: true, color: DARK_CHARCOAL }, { text: 'Designate who knows the cieTrade data model; their half-day of input shapes the entire integration plan.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call or a half-day AI Readiness Assessment — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & trade', CORE_BLUE, [
    'Roughly what volume and trade margin flows through each division, and which divisions are the growth priority?',
    'Which recovered-paper grades, plastics, and metals do you actually trade most, and into which markets (domestic vs. each export lane)?',
    'Is the growth goal more supply placed, more offtake secured, better price/timing — or efficiency first?',
  ]),
  ...qGroup('B · Systems & data', CORE_ORANGE, [
    'Which cieTrade modules do you use, and how open is it to integration (API, exports)?',
    'What other core systems run alongside cieTrade (accounting, logistics, email, document storage)?',
    'Where does trade documentation live today, and how is it created — manual entry, templates, EDI?',
  ]),
  ...qGroup('C · How the work is done today', TEAL, [
    'How do traders get price and market signals today, and how much time goes into it?',
    'How are credit decisions and counterparty risk handled, and have bad-debt losses been an issue?',
    'How many staff hours per week go into export documentation, logistics coordination, and reporting?',
    'How is sustainability / diversion reporting produced for customers today?',
  ]),
  ...qGroup('D · Brand, web & decision', CHARTREUSE, [
    'Who owns the website and marketing, and is there appetite to publish market content?',
    'Do you hold ISO 9001 / 14001 or other certifications we should reflect (the public site does not state any)?',
    'Can you confirm the office footprint — in particular, is there a Plymouth, Michigan location, or was that an error?',
    'Who sponsors this initiative, who else weighs in, and what would a successful first year look like?',
  ]),
  spacer(80),
  calloutBox('Two easy ways to answer',
    'Most of these take a 45-minute discovery call. For Sections B and C, a half-day AI Readiness Assessment maps your cieTrade workflows directly and returns a prioritized, costed automation roadmap — which is also the cleanest first engagement.', CORE_ORANGE),
];

// ============================================================ SEC 15 — WHAT HAPPENS NEXT
const section15 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '15'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'Executive AI Briefing or discovery call — walk this blueprint and the Section 14 questions.', 'A meeting. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'AI Readiness Assessment — a half-day mapping of workflows and cieTrade, returned as a prioritized, costed roadmap.', 'A fixed-scope engagement; the roadmap is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand build — start with one automation and the authority layer; scale across divisions as each proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['An Executive AI Briefing is the easiest first step — a working session on where AI creates measurable value for Canusa Hershman, with no obligation. Or we begin with the AI Readiness Assessment for a deeper, costed roadmap.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain. We help organizations across manufacturing, logistics, financial services, and supply chain move from AI curiosity to operational deployment — we architect, build, and operationalize through to production. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide coverage across time zones. Our approach is cybersecurity-first and AI-forward.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery center', bold: true }, 'Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. inferred / could not confirm'),
  bullet('Parent-brand structure, divisions, and independent family ownership — VERIFIED (company history page; trade press; newportch.com).'),
  bullet('Branford CT headquarters, plant/office locations, and CEO/leadership — VERIFIED (company contact + team pages; Recycling Today).'),
  bullet('cieTrade as the trading system of record — VERIFIED (portal links on canusahershman.com).'),
  bullet('Revenue — NOT confirmed (public figures conflict); no hard revenue cited in this document.'),
  bullet('ISO certification, the "Plymouth, MI" address, and a "Frontier Trading" partner — NOT confirmed; excluded and listed as questions.'),
  bullet('Specific recovered-paper grades traded and rail-vs-ocean logistics mix — industry-typical but not stated publicly; deferred to discovery.'),
  subHeader('Selected sources'),
  ...[
    'Canusa Hershman — history, what we do, divisions, team, contact: canusahershman.com.',
    'Newport CH International — history (2003 JV, export arm): newportch.com.',
    'Recycling Today — 2002 merger and 2022 Recycle 1 / Arizona Pacific acquisition coverage.',
    'cieTrade — recovered-materials trading platform (supplier/customer portals).',
    'Industry & regulatory — AF&PA US paper recovery statistics; Fastmarkets RISI (recovered-fiber price benchmark) and 2025 producer moves away from it; Resource Recycling / Recycling Today (China "National Sword" 2018, OCC/mixed-paper price history, domestic recycled-fiber capacity tracker, >8M tons since 2018); Basel Convention Secretariat + US EPA (plastic-waste amendments 2021; US non-Party status); CalRecycle / Circular Action Alliance / state trackers (seven-state EPR, SB 54); ReMA/ISRI Scrap Specifications Circular (grade definitions).',
    'AI use-case outcomes — McKinsey (supply-chain & credit decisioning); IMF & World Bank (commodity-price forecasting limits); CFPB (AI credit-decision guidance); AIIM/Deep Analysis (intelligent document processing); named vendor case studies. All projections labeled as such; price prediction treated as probabilistic decision-support.',
    'AI framing — MIT Sloan (AI literacy); Anthropic (workflows vs. agents); NIST AI Risk Management Framework.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider market; figures specific to Canusa Hershman are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Canusa Hershman  ·  AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
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
  creator: 'Technijian', title: 'Canusa Hershman — AI Growth & Integration Blueprint', description: 'A facts-only AI Growth & Integration blueprint for Canusa Hershman, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Canusa-Hershman-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
