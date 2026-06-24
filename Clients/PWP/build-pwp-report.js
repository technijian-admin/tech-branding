// Prosperity Wealth Planning (PWP) - AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY. LIVE TOC field + Word-COM convert.
// Thesis: a fee-only fiduciary RIA - AI to give advisors time back from documentation + help the
// right clients find them, on a strict privacy + RIA-compliance foundation for client financial data.
// NOTE: built as an internal ASSET. PWP opted out of email outreach - do NOT email them this without honoring the goodwill-only posture.

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
const TODAY = 'June 19, 2026';
const DIAG = path.join(__dirname, 'diagrams');
const diagBuf = (n) => fs.existsSync(path.join(DIAG, n)) ? fs.readFileSync(path.join(DIAG, n)) : null;

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ keepNext: true, spacing: { before: s, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, o = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140, keepNext = false } = o;
  return new Paragraph({ alignment: align, keepNext, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
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
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 90, right: 90 }, verticalAlign: VerticalAlign.CENTER, children: [
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
  colorBar(CORE_BLUE, 200), spacer(760),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(320),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }), spacer(210),
  centered('AI FOR GROWTH', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('& EFFICIENCY', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(120),
  centered('Prosperity Wealth', { size: 46, color: DARK_CHARCOAL, bold: true, after: 60 }),
  centered('Planning', { size: 46, color: DARK_CHARCOAL, bold: true, after: 120 }),
  centered('Fee-Only Financial Planning  ·  Irvine & Long Beach', { size: 20, color: CORE_BLUE, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Helping more of the right clients find you, and giving your advisors their time back, with AI built for the privacy and compliance a fiduciary’s client data demands', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(760),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Prosperity Wealth Planning, LLC', { size: 22, color: DARK_CHARCOAL, bold: true, after: 30 }),
  centered('Carolanne Chavanne, CFP®, Founder', { size: 20, color: BRAND_GREY, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR PROSPERITY WEALTH PLANNING', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('A short, honest framing before anything else.', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Privacy and compliance come first here, not last. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your firm holds clients’ complete financial lives, balances, Social Security numbers, estate and tax detail. Any AI near that work has to clear a higher bar, and as of 2026 part of that bar is regulatory, not just prudent. So we put it up front (Section 03): private, governed systems, a fiduciary reviewing anything that reaches a client, and client data that never enters a public AI tool.' }]),
  bulletRuns([{ text: 'It works on two fronts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Growth (help the right clients find you and turn your video series into reach) and efficiency (give your advisors their time back from meeting notes and plan drafting). Both matter to a practice like yours; the efficiency half is usually the easier place to start.' }]),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Prosperity is drawn from your website, public SEC records, and industry directories, cited in the Appendix. We have not assumed your assets under management, your client count, your systems, or your finances.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer needs information only your team has, we ask rather than guess. Section 13 is a short questionnaire that completes the analysis.' }]),
  calloutBox('The lens for everything that follows',
    ['Prosperity Wealth Planning is, at its heart, a fiduciary relationship: a client trusting an expert with their financial future, and an advisor who answers to them and no product shelf. Nothing in this plan changes that, or wants to. AI here has two jobs only: protect and extend your advisors’ time, and help the clients who need a true fiduciary actually find you.',
     'It does not give the advice. Your people do.'], CORE_ORANGE),
];

// ============================================================ TOC
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list and choose Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents - right-click and choose "Update Field" to populate page numbers.', { hyperlink: true, headingStyleRange: '1-1' }),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Prosperity Wealth Planning is an established fee-only fiduciary practice serving professionals and retirees across Southern California, built over decades on something that does not scale easily: Carolanne Chavanne’s expertise and the trust of the clients who rely on it. The numbers below capture that foundation.', { spaceAfter: 120 }),
  kpiRow([
    { number: '1999', label: 'Founder a CFP® since', color: CORE_BLUE },
    { number: 'Fee-Only', label: 'Fiduciary, no products sold', color: CORE_ORANGE },
    { number: '4 CFP®s', label: 'On the planning team', color: TEAL },
    { number: '25+', label: '“Supercharge Your Finances” episodes', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'The opportunity is not to change the work, it is to protect and extend it. ', bold: true, color: DARK_CHARCOAL }, { text: 'A fee-only practice like Prosperity runs into two predictable limits as it grows: expert advisors spend hours on meeting notes and plan drafting instead of advising, and the clients who most need a true fiduciary often cannot tell one apart from a product salesperson in the noise. This generation of AI is unusually good at both problems, and almost nothing else in this plan matters more than those two.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'So the blueprint works on two fronts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Efficiency (Section 09): draft meeting notes, financial plans, and review summaries from your advisors’ input, so they review and sign off in minutes instead of writing for hours, and capture Carolanne’s planning process so the whole team delivers it consistently. Growth (Section 08): make Prosperity the answer professionals and retirees find when they search for a fee-only fiduciary, and turn your “Supercharge Your Finances” series into an authority engine that does the same.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'And it rests on one non-negotiable foundation. ', bold: true, color: DARK_CHARCOAL }, { text: 'Client financial data is sensitive in a way that demands more than the average business AI deployment, and regulators now agree: private, governed systems, a fiduciary in the loop on anything a client sees, and never feeding client information into a public tool. Section 03 makes that the floor everything else stands on, aligned to the SEC’s Regulation S-P and Marketing Rule and led by a CISSP-certified security practice.' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'A practice built on one expert’s judgment and relationships has a natural ceiling: her hours, and the firm’s ability to be found. AI cannot replace fiduciary judgment, and should not try. What it can do is give your advisors back the time they lose to documentation, preserve the founder’s method for the team, and put Prosperity in front of the clients who are searching for exactly what you do.', CORE_ORANGE),
];

// ============================================================ SEC 01 - THE CLIENTS & WHY NOW
const section1 = [
  ...sectionHeader('The Clients Prosperity Serves, and Why Now', CORE_BLUE, '01'),
  p('The context below is about the clients and the field Prosperity works in, not claims about the practice, and it explains why an investment in efficiency and visibility pays now. Sources are in the Appendix.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'What Prosperity does and where AI helps', 624),
  caption('Figure 01.0 - A fee-only fiduciary practice turning expert planning into confidence and security for clients, on a foundation of strict privacy and compliance.'),
  h3('The decision is high-stakes, and finding a true fiduciary is hard'),
  p('The clients Prosperity serves, professionals and retirees with real assets to steward, are making some of the most consequential and anxious decisions of their lives: when to retire, how to turn a career’s savings into income that lasts, what to do with equity compensation or a windfall. The hard part for them is telling a genuine fee-only fiduciary apart from a salesperson paid to move a product. Prosperity is exactly the fiduciary they are looking for; the question is whether they can find it at the moment they start searching, which today increasingly means a search engine or an AI assistant.', { spaceAfter: 120 }),
  h3('The field is adopting AI fastest where the work is heaviest'),
  p('Across registered investment advisers, the clearest, most-proven use of AI is not giving the advice, it is taking the documentation load off the advisor. The 2026 Schwab study found 63% of RIAs now use AI, more than double the level in 2023, and that the use is concentrated on meeting notes and client communication. Advisors using AI note-takers report saving meaningful hours every week, time that goes back to clients. This is the low-risk, high-return entry point for a practice like Prosperity’s.', { spaceAfter: 120 }),
  calloutBox('Why this matters now',
    'Three things are converging: clients are shifting how they search for an advisor (toward AI answers), AI has become genuinely good at the documentation that consumes your advisors’ time, and the SEC’s Regulation S-P amendments set a 2026 compliance clock for firms your size. A premium fee-only practice that moves now, carefully and compliantly, can reach more of the right clients, free its experts to serve them, and get its AI governance right from the start.', TEAL),
];

// ============================================================ SEC 02 - WHAT WE VERIFIED
const section2 = [
  ...sectionHeader('What We Verified About Prosperity', CORE_BLUE, '02'),
  p('Everything here is drawn from your website, public SEC records, and industry directories (see Appendix). Where a figure is dated or sources disagree, we say so, and we have not guessed at anything only your team would know.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founder & leader', bold: true }, 'Carolanne Chavanne, CFP®, Founder. Earned the CFP® designation in 1999; B.S. in Financial Services from San Diego State University. Roughly 15 years serving Toyota Motor North America associates and retirees; prior roles as a financial planner at LPL Financial and Senior Financial Planner at Comerica Bank. (The firm bio cites 35-plus years; some directories show ~30, confirm at discovery.)'],
      [{ text: 'The firm', bold: true }, 'Prosperity Wealth Planning, LLC, an SEC-registered investment adviser (firm CRD 315163). Fee-only and fiduciary: as the firm states, it is prohibited from selling products or accepting commissions. No disciplinary disclosures reported across public categories.'],
      [{ text: 'What Prosperity does', bold: true }, 'Comprehensive, fee-only financial planning and investment management: retirement and income planning, investment management, tax-aware and estate-aware planning, and life-transition planning, under three fee structures (a percentage of assets, a flat planning fee, or hourly).'],
      [{ text: 'The team', bold: true }, 'A planning team of CFP® professionals, Carolanne plus Easton Price (CFP®, CDFA®), Jordan Bromley (CFP®), and Ava Pompay (CFP®), supported by a client-services team. Exact headcount to confirm at discovery.'],
      [{ text: 'Clients & specialties', bold: true }, 'Professionals and retirees with roughly $500,000 or more to invest. A signature niche serving automotive-industry professionals and retirees, plus divorce and life-transition planning (a Certified Divorce Financial Analyst on staff).'],
      [{ text: 'Client experience', bold: true }, 'An Orion client portal; an active “Supercharge Your Finances” video education series (about 25-plus episodes, most recent in 2026), newsletters, and life-transition resources.'],
      [{ text: 'Footprint', bold: true }, 'Offices in Irvine (3349 Michelson Dr.) and Long Beach; serving Southern California and beyond, in person and virtually.'],
      [{ text: 'What we did NOT assume', bold: true, color: CRITICAL }, 'Assets under management, client or household count, exact team size, your custodian, the systems you run today, how documentation is handled, and any finances. These are the questions in Section 13.'],
    ], { headerColor: CORE_BLUE }),
];

// ============================================================ SEC 03 - PRIVACY & COMPLIANCE FOUNDATION
const section3 = [
  ...sectionHeader('Protecting Client Data: The Privacy & Compliance Foundation', CORE_BLUE, '03'),
  p('Most AI plans treat privacy as a closing caveat. For a fiduciary entrusted with clients’ complete financial lives, it is the starting condition, so it comes first. Any AI Prosperity adopts must clear a higher bar than ordinary business software, and as of 2026 part of that bar is set by regulators, not just prudence.', { spaceAfter: 130 }),
  p('The data your work generates, net worth, account balances, Social Security numbers, estate and tax detail, and personal goals, is exactly the kind that must never be exposed, and the SEC now requires you to safeguard it formally. Three commitments make AI safe to use here, each straightforward:', { spaceAfter: 110 }),
  buildTable(
    [{ label: 'The commitment', weight: 30 }, { label: 'What it means in practice', weight: 44 }, { label: 'How Technijian does it', weight: 26 }],
    [
      [{ text: 'Private, governed systems', bold: true, color: CORE_BLUE }, 'Client financial information never enters a public AI tool (ChatGPT, free apps). AI runs in a private, access-controlled environment where your data stays yours and is never used to train someone else’s model.', 'Private deployments; CISSP-led security.'],
      [{ text: 'A fiduciary in the loop', bold: true, color: CORE_BLUE }, 'AI drafts; a qualified advisor reviews, owns, and signs off on anything that reaches a client or a regulator. The duty of care cannot be delegated to a machine.', 'Review built into every workflow.'],
      [{ text: 'Compliant & accountable by design', bold: true, color: CORE_BLUE }, 'Every AI tool has a named owner and a known data source; AI-assisted marketing is substantiated before it goes out; an incident-response program is in place.', 'AI inventory + Reg S-P alignment.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  subHeader('The regulatory backdrop, in plain terms'),
  bulletRuns([{ text: 'Regulation S-P (amended 2024). ', bold: true, color: DARK_CHARCOAL }, { text: 'The SEC now requires advisers to maintain a written incident-response program and to notify affected clients of a breach, with the compliance date for smaller advisers falling in mid-2026. Any AI vendor that touches client “covered information” has to fit inside that program. We design for it from day one.' }]),
  bulletRuns([{ text: 'The Marketing Rule (206(4)-1). ', bold: true, color: DARK_CHARCOAL }, { text: 'AI-assisted marketing and client communications must be fair, substantiated, and not misleading. We keep a human review and a substantiation trail on anything AI helps produce, so your “Supercharge Your Finances” content and client emails stay compliant.' }]),
  bulletRuns([{ text: 'Honest AI claims. ', bold: true, color: DARK_CHARCOAL }, { text: 'The SEC has already penalized firms for overstating their use of AI. Our framing is deliberately honest: AI assists and drafts; your advisors decide and advise. We never position AI as making the investment decisions, because it does not.' }]),
  bulletRuns([{ text: 'CFP Board guidance (2025). ', bold: true, color: DARK_CHARCOAL }, { text: 'The CFP Board’s guidance on generative AI says to use it to aid, not replace, the planner, who stays responsible for the work and for safeguarding confidentiality. With four CFP® professionals on your team, that principle is built into every workflow we propose.' }]),
  pRuns([{ text: 'This is also a competitive advantage, not just a safeguard. ', bold: true, color: DARK_CHARCOAL }, { text: 'Clients choosing who to trust with their financial future are buying exactly that, trust. A firm that can say, plainly, “we use AI to serve you better and your financial information never leaves our protected systems” is more trustworthy than both the firm that uses AI carelessly and the one that refuses to modernize at all. Done right, privacy is part of the pitch.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 04 - PEOPLE (personas)
const section4 = [
  ...sectionHeader('The People Prosperity Serves', CORE_BLUE, '04'),
  p('A fee-only practice like Prosperity does not have a sales funnel; it has people at the center of the work and the team and partners around them. The most useful way to plan AI is around those stakeholders. These are research-based archetypes to confirm at discovery, not your records.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'The people Prosperity serves and how AI helps each', 600),
  caption('Figure 04.0 - Stakeholders around the work. The "AI helps" line is the opportunity, to calibrate with your team.'),
  buildTable(
    [{ label: 'Who', weight: 24 }, { label: 'What they need', weight: 42 }, { label: 'How AI helps (privately, advisor-reviewed)', weight: 34 }],
    [
      [{ text: 'The affluent client (the buyer)', bold: true, color: CORE_ORANGE }, 'Trust, genuine fiduciary care, and a plan they can see and understand, for high-stakes money decisions.', 'Be findable in search and AI answers; a private intake assistant; clearer plan and progress updates.'],
      [{ text: 'The automotive professional & retiree', bold: true, color: CORE_BLUE }, 'A planner who understands equity comp, pensions, and the retirement decisions specific to their industry.', 'Be the cited expert for their situation; faster, tailored plan drafts the advisor reviews.'],
      [{ text: 'The financial planner', bold: true, color: TEAL }, 'To spend their hours advising clients, not writing meeting notes, plans, and summaries.', 'Draft documentation from their input; they review and sign off in minutes.'],
      [{ text: 'The referral partner / COI', bold: true, color: DARK_CHARCOAL }, 'Reliable communication and outcomes for the clients they refer (CPAs, estate attorneys, custodians).', 'COI nurture and clear, professional client summaries.'],
      [{ text: 'Carolanne Chavanne', bold: true, color: CRITICAL }, 'To scale her impact, judgment, and relationships without diluting quality, or burning herself out.', 'Capture the method into team playbooks; surface her authority; protect her time.'],
    ], { headerColor: CORE_BLUE }),
];

// ============================================================ SEC 05 - PEER LANDSCAPE
const section5 = [
  ...sectionHeader('How RIAs & Financial Planners Are Adopting AI', CORE_BLUE, '05'),
  p('Prosperity does not compete on volume, so the useful comparison is positional: where is the field on AI, and where could a premium fee-only practice choose to sit? The field is moving fastest exactly where the lowest risk and clearest value are, meeting notes and client communications.', { spaceAfter: 130 }),
  diagramImage(diagBuf('peer.png'), 'How RIAs and financial planners are adopting AI', 600),
  caption('Figure 05.0 - A strategic read, not a measured score. Examples are representative directions of travel across comparable practices, not guarantees.'),
  buildTable(
    [{ label: 'What practices are doing', weight: 30 }, { label: 'The example', weight: 44 }, { label: 'Read-across for Prosperity', weight: 26 }],
    [
      [{ text: 'AI for meeting notes', bold: true, color: CORE_BLUE }, 'Advisors report saving 5-15 hours a week with AI note-takers (Jump, Zocks) that draft summaries and follow-ups for review, then feed the CRM and plan (vendor-reported).', 'The fastest, safest place to start.'],
      [{ text: 'Plan & communication drafting', bold: true, color: CORE_BLUE }, 'AI drafts first versions of plans, reviews, and client emails for an advisor to refine and approve.', 'Sharper, faster client deliverables.'],
      [{ text: 'Pre-meeting preparation', bold: true, color: CORE_BLUE }, 'AI assembles a pre-meeting client dossier from portfolio and CRM data, surfacing what changed and what to discuss.', 'Better-prepared reviews, less manual prep.'],
      [{ text: 'Adoption is now mainstream', bold: true, color: CORE_BLUE }, '63% of RIAs now use AI, more than double 2023; the leaders are pulling ahead on capacity rather than headcount (Schwab, 2026).', 'A premium fee-only firm can lead its peers.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The position available to Prosperity',
    'Most solo and small RIAs are still exploring; the leaders are integrating note-taking and client-prep into daily work. A respected, founder-led fee-only practice can be a first-mover among premium practices, modernizing carefully and compliantly while keeping the fiduciary relationship that is its whole reason for being. That is a genuinely available, and durable, position.', CORE_ORANGE),
];

// ============================================================ SEC 06 - CAPABILITY PROOF
const section6 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '06'),
  p('Strategy is easy to write and hard to build. Each capability this plan relies on is something Technijian has already built, mapped to Prosperity’s situation. Where a build is described by profile rather than a named client, it is scope and effort only.', { spaceAfter: 130 }),
  calloutBox('Proven build: AI Document Intelligence (days to minutes)',
    'What we built: a pipeline that reads, extracts from, and drafts complex documents in minutes instead of hours, with a person approving the result. How it applies to Prosperity: draft meeting notes, financial plans, investment policy statements, and review summaries from an advisor’s input, so they review and sign off instead of writing from scratch. This is the highest-return, lowest-risk first step.', CORE_BLUE),
  calloutBox('Proven build: Knowledge-Capture Graph (Weaviate + Obsidian)',
    'What we built: an AI knowledge system that turns documents, recordings, and expert interviews into a searchable, reusable resource. How it applies: capture Carolanne’s 35 years of planning judgment and the firm’s process into team playbooks, so the planning team delivers it consistently and new advisors onboard faster, reducing the key-person risk every founder-led practice carries.', CRITICAL),
  calloutBox('Proven build: Multi-Agent Search & Content (My SEO + My AI)',
    'What we built: a multi-model platform that wins visibility in search and AI assistants and turns expertise into authority content. How it applies: make Prosperity the cited answer for “fee-only financial advisor Irvine,” “CFP for retirees,” and similar searches, and turn your “Supercharge Your Finances” series into articles, posts, and short video.', TEAL),
  calloutBox('Proven build: AI-Native Software Delivery (My Dev)',
    'What we built: an AI-native development practice that ships custom tools several times faster than traditional teams. How it applies: a private intake assistant, a prospect and client portal, and faster prospect qualification, each inside your governed, private environment.', CORE_ORANGE),
  subHeader('Two honest guardrails (because they always come up)'),
  pRuns([{ text: 'On spend: ', bold: true, color: DARK_CHARCOAL }, { text: 'we do not wire every task to one expensive AI model. We run a routed, multi-model platform, roughly seven models across three providers and three tiers, sending each task to the cheapest model that can do it well, typically 60-80% below the price of routing everything to a premium model. ' }, { text: 'On control and privacy: ', bold: true, color: DARK_CHARCOAL }, { text: 'AI drafts and finds; your advisors decide, advise, and sign off. Client financial data stays inside private, governed systems and never trains an outside model. For a fiduciary whose entire value is trust, that discipline is the only way AI is allowed near the work.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 07 - UNDERSTANDING AI
const section7 = [
  ...sectionHeader('Understanding AI - A Field Guide for Prosperity Leadership', CORE_BLUE, '07'),
  p('Plain-English and independent. You do not need to know how AI is built to use it well, you need to know what it can and cannot do, and how to adopt it responsibly. Every framing here is anchored to an outside source, named in the Appendix.', { spaceAfter: 120 }),
  h3('1. What AI actually is (and is not)'),
  pRuns([{ text: 'The most useful distinction, from Anthropic’s engineering guidance, is between ', }, { text: 'automation', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a set path, predictable and low-risk, "draft this meeting summary from these notes") and ', }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself, flexible but needing oversight). The operating principle is to use the simplest thing that works: start with simple, supervised automations that pay off fast, and add more autonomy only where it clearly earns it. For a fiduciary practice, that conservative posture is exactly right.' }], { spaceAfter: 120 }),
  h3('2. Where Prosperity sits today'),
  p('On a widely used five-stage view of AI maturity (consistent with the Gartner and Google Cloud frameworks), most established advisory practices, Prosperity included, sit at the first or second rung. That is not a criticism; it is where most of the profession is, even as adoption climbs. The goal of this engagement is to move Prosperity up a rung or two deliberately and safely, starting with the back office, not to turn it into a technology company.', { spaceAfter: 120 }),
  h3('3. Adopting AI responsibly - three risks every leader manages'),
  p('The U.S. National Institute of Standards and Technology offers an impartial way to think about this; its AI Risk Management Framework organizes the job into four functions: govern, map, measure, and manage. In plain terms, three risks matter most here, and each has a clear answer:', { spaceAfter: 100 }),
  bulletRuns([{ text: 'Confident wrong answers (hallucination). ', bold: true, color: DARK_CHARCOAL }, { text: 'AI can state something false with total confidence, unacceptable in anything that reaches a client or a regulator. The answer is a fiduciary in the loop: a qualified advisor reviews and owns it.' }]),
  bulletRuns([{ text: 'Data leakage. ', bold: true, color: DARK_CHARCOAL }, { text: 'Client financial information must never go into public AI tools. The answer is private, governed deployments where your data stays yours, the heart of Section 03 and of Regulation S-P.' }]),
  bulletRuns([{ text: 'Accountability. ', bold: true, color: DARK_CHARCOAL }, { text: 'Every AI tool should have a named owner and a known data source, and AI-assisted marketing must be substantiated. The answer is a simple inventory and review trail, straight from the framework’s govern function and the Marketing Rule.' }]),
  h3('4. Why a partner, rather than hiring or do-it-yourself tools'),
  p('Do-it-yourself tools are inexpensive but leave you to assemble and govern everything, and to own the three risks above, with client financial data. Hiring a qualified AI specialist is expensive (typically well over $180,000 a year) and scarce, and one person rarely covers strategy, building, security, and governance at once. A partner brings all four at a fraction of that, with builds already proven and security led by a CISSP-certified team. For a focused practice, the partner path is usually the practical one.', { spaceAfter: 120 }),
  calloutBox('The reassuring truth',
    'Nothing here asks Prosperity to trust a machine with a client or to become a tech company. The approach is the opposite: simple, governed, private automations that give your expert advisors more time and reach, with a fiduciary always in the loop and accountable for anything that matters.', TEAL),
];

// ============================================================ SEC 08 - TWO FRONTS (engine)
const section8 = [
  ...sectionHeader('The Two Fronts: Grow the Practice & Give the Team Time Back', CORE_BLUE, '08'),
  p('The engine has two connected fronts on a single privacy and compliance foundation. Grow brings the right clients in; Run gives your advisors their hours back. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Prosperity two-front AI engine', 624),
  caption('Figure 08.0 - Grow the practice (left) and run it lighter (right), everything resting on the privacy and compliance foundation.'),
  buildTable(
    [{ label: 'Capability', weight: 26 }, { label: 'Use case for Prosperity', weight: 48 }, { label: 'Technijian service', weight: 26 }],
    [
      [{ text: 'Be found by clients', bold: true, color: CORE_ORANGE }, 'Be the cited answer when a professional or retiree searches or asks an AI assistant for a fee-only fiduciary advisor in Irvine or OC.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      [{ text: 'Authority content engine', bold: true, color: CORE_ORANGE }, 'Turn your “Supercharge Your Finances” episodes into articles, posts, and short video that build trust and visibility.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Referral & COI nurture', bold: true, color: CORE_ORANGE }, 'Keep CPAs, estate attorneys, and custodians informed and engaged so referrals keep flowing.', { text: 'My AI Lead Gen', bold: true, color: CORE_BLUE }],
      [{ text: 'Capture inquiries', bold: true, color: CORE_ORANGE }, 'A private intake assistant that answers common prospect questions and routes serious inquiries to the team.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      [{ text: 'Meeting notes & follow-ups', bold: true, color: TEAL }, 'Draft meeting notes and follow-up tasks from an advisor’s input; a qualified person reviews and signs off.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Financial-plan drafting', bold: true, color: TEAL }, 'Turn planning inputs into draft plans and investment policy statements, reviewed by the advisor before they go out.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Client review prep', bold: true, color: TEAL }, 'Assemble pre-meeting client dossiers from Orion and the CRM, surfacing what changed since last time.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Capture the method', bold: true, color: TEAL }, 'Preserve Carolanne’s planning process as team playbooks and faster, more consistent onboarding.', { text: 'My AI', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'Everything above runs inside the private, governed environment from Section 03, and an advisor reviews anything a client or regulator sees. AI finds, drafts, and organizes; your advisors decide, advise, and sign off. This amplifies the team and Carolanne’s method; it does not replace the fiduciary relationship at the center of the work.', TEAL),
];

// ============================================================ SEC 09 - EFFICIENCY
const section9 = [
  ...sectionHeader('Inside Prosperity: AI-Powered Documentation & Method', CORE_BLUE, '09'),
  p('The growth front brings clients in; this is the other half, the daily work of running the practice, where AI quietly returns hours and protects quality. Every row maps a real Prosperity workflow to an AI integration and the proven Technijian build behind it, all inside the private environment from Section 03.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Workflow today', weight: 28 }, { label: 'AI integration (advisor-reviewed)', weight: 42 }, { label: 'Proven Technijian build', weight: 30 }],
    [
      [{ text: 'Meeting notes & follow-ups', bold: true, color: DARK_CHARCOAL }, 'Draft from the advisor’s conversation and notes; they review and sign off in minutes instead of writing after every meeting.', 'AI Document Intelligence (days to minutes).'],
      [{ text: 'Financial-plan & IPS drafting', bold: true, color: DARK_CHARCOAL }, 'Turn planning inputs into draft plans and investment policy statements, reviewed before they reach the client.', 'AI Document Intelligence.'],
      [{ text: 'Client review prep', bold: true, color: DARK_CHARCOAL }, 'Assemble pre-meeting dossiers and summaries from Orion and the CRM, what changed, what to discuss.', 'AI Document Intelligence.'],
      [{ text: 'The founder’s method', bold: true, color: DARK_CHARCOAL }, 'Capture Carolanne’s planning process into searchable playbooks for consistent delivery and onboarding.', 'Knowledge-Capture Graph (Weaviate + Obsidian).'],
      [{ text: 'Client communication', bold: true, color: DARK_CHARCOAL }, 'Draft newsletters, review recaps, and RMD or tax-season reminders for staff to personalize and approve.', 'AI assistant + document intelligence.'],
      [{ text: 'Compliance documentation', bold: true, color: DARK_CHARCOAL }, 'Keep Reg S-P incident-response records, Marketing-Rule substantiation, and an AI inventory audit-ready.', 'AI document automation + governance.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  subHeader('What that returns, in plain terms'),
  p('We measure this the way a practice does, in advisor hours recovered, quality protected, and more clients served, not a flashy multiple. The directions below are conservative, to confirm at discovery.', { spaceAfter: 110 }),
  buildTable(
    [{ label: 'Efficiency lever', weight: 42 }, { label: 'Conservative direction (confirm at discovery)', weight: 58 }],
    [
      ['Documentation time', 'Hours per advisor returned each week from meeting notes, plans, and summaries, redirected to clients.'],
      ['Plan & review turnaround', 'Faster, clearer financial plans and review summaries for clients and prospects.'],
      ['Consistency & onboarding', 'The founder’s method captured once, delivered consistently, with faster ramp for new advisors.'],
      ['Capacity', 'More clients served with the same expert team, because experts spend their time on expert work.'],
      ['Reach', 'More of the right clients finding Prosperity at the moment they start searching.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  calloutBox('The easier yes',
    'Growth is the upside; this is protection, keeping your experts doing expert work and your quality consistent as you grow. For most practices the efficiency front is the easier place to start, because the value shows up in the first weeks and in work the team already finds draining.', CORE_ORANGE),
];

// ============================================================ SEC 10 - INVESTMENT
const section10 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '10'),
  p('We price from real, published service ranges and scope the rest at a quote, never an invented number. The path is deliberately small at the start, prove the value privately and quickly, then expand.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path (start small, prove it, then grow)'),
  buildTable(
    [{ label: 'Phase', weight: 24 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement', weight: 26 }],
    [
      [{ text: 'Land - prove it', bold: true, color: CORE_BLUE }, 'A leadership AI workshop, a private documentation pilot with one or two advisors (meeting notes and a plan), and a visibility audit. Small, fast, and compliance-safe.', 'Workshop + pilot'],
      [{ text: 'Expand - both fronts', bold: true, color: CORE_BLUE }, 'Roll documentation across the team, stand up the authority content engine and search visibility, and add the private intake assistant.', 'My AI + My SEO + My Dev'],
      [{ text: 'Scale - the method', bold: true, color: CORE_BLUE }, 'Capture the planning method as playbooks, add a prospect and client portal, COI nurture, and a steady review engine.', 'My AI + My Dev + advisory'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Service ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 42 }, { label: 'Indicative range', weight: 32 }, { label: 'Note', weight: 26 }],
    [
      ['Leadership AI workshop', '~$5,000 (one-time)', 'published default'],
      ['Documentation pilot (fixed scope)', 'a fixed-scope build, estimated', 'confirmed at quote'],
      ['My SEO - visibility + authority content', '$500 - $1,500 / mo + add-ons', 'published tiers'],
      ['My AI - automation & advisory', 'scoped retainer', 'estimated, at quote'],
      ['My Dev - intake / portal / matching', 'project-based', 'estimated, at quote'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we would model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a practice like Prosperity’s, the return is concrete: advisor hours recovered from documentation (often the single biggest line), more of the right clients reached and served, and the founder’s method preserved and scaled. Modeled conservatively, the time the entry program gives back to a few advisors, plus a small number of additional households served, typically covers the entry several times over, before counting the harder-to-quantify value of consistency, compliance, and protected founder time. We will put real numbers against these once discovery gives us yours (Section 13); until then, any single figure would be a guess, and we do not guess.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 11 - ROADMAP
const section11 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '11'),
  p('Staged so each phase delivers value before the next begins, and sequenced to start where the risk is lowest and the value is fastest: private, compliant documentation help.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 11.0 - Start compliance-safe with a meeting-notes pilot, grow the practice, then scale Carolanne’s method. Scope calibrates at discovery.'),
  p('The first ninety days are deliberately low-risk: stand up a private, governed AI environment and pilot meeting-note drafting with one or two advisors, while auditing how clients find Prosperity today. The next ninety build both fronts, the authority content engine and search visibility, and documentation help rolled out to the whole team. The final stretch scales the founder’s method into playbooks and adds a prospect and client portal, COI nurture, and a steady review engine, so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 12 - QUICK WINS
const section12 = [
  ...sectionHeader('Quick Wins - Start This Week', CORE_BLUE, '12'),
  p('Five actions Prosperity can take now, with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Ask an AI assistant for "the best fee-only fiduciary advisor in Irvine." ', bold: true, color: DARK_CHARCOAL }, { text: 'See whether Prosperity appears. That free check is your visibility baseline at the moment clients now start searching.' }]),
  bulletRuns([{ text: 'Time one advisor’s documentation for a week. ', bold: true, color: DARK_CHARCOAL }, { text: 'Measure the hours spent on meeting notes, plans, and summaries. That number is the size of the easiest, fastest win, and the baseline you will measure against.' }]),
  bulletRuns([{ text: 'List five questions clients always ask from "Supercharge Your Finances." ', bold: true, color: DARK_CHARCOAL }, { text: 'Each is an article, post, or short video waiting to be made from an episode you already recorded, and the seed of the authority engine.' }]),
  bulletRuns([{ text: 'Check your Google presence and reviews for the Irvine office. ', bold: true, color: DARK_CHARCOAL }, { text: 'Confirm hours, services, and that a searching professional or retiree finds an accurate, reassuring picture.' }]),
  bulletRuns([{ text: 'Confirm your Regulation S-P incident-response program covers AI and cloud vendors. ', bold: true, color: DARK_CHARCOAL }, { text: 'With the smaller-adviser compliance date in 2026, checking that any tool touching client data fits your written program is a free, high-value governance step.' }]),
];

// ============================================================ SEC 13 - QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section13 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '13'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers, from a short conversation, replace every estimate above with your real numbers. "We are not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A - The practice & priorities', CORE_BLUE, [
    'What is the most pressing priority right now, freeing advisor time, reaching more of the right clients, scaling the method, or something else?',
    'Roughly how many clients and households do you serve, and how many advisors and client-service staff are on the team?',
    'Where is demand strongest, and where do you most wish you had more capacity?',
  ]),
  ...qGroup('B - Documentation & method', CORE_ORANGE, [
    'How are meeting notes, financial plans, and review summaries handled today, and roughly how many hours do they take per advisor each week?',
    'How is your planning process taught to new advisors today, and how long does onboarding take?',
    'What documentation or reporting is most draining, or most often late?',
  ]),
  ...qGroup('C - Reach & reputation', TEAL, [
    'How do clients find Prosperity today, search, referrals, COIs, the "Supercharge Your Finances" series?',
    'Which referral relationships matter most (CPAs, estate attorneys, custodians), and how are they nurtured now?',
    'What is the goal behind the video series, and what would meaningfully more of the right clients finding you be worth?',
  ]),
  ...qGroup('D - Systems, privacy & compliance', CHARTREUSE, [
    'What systems run your CRM, financial planning, and portfolio reporting (which Orion modules), and who is your custodian?',
    'Is your Regulation S-P written incident-response program in place, and does it cover third-party AI and cloud vendors?',
    'Who reviews and substantiates AI-assisted marketing today, and who decides on an investment like this?',
  ]),
  spacer(80),
  calloutBox('The easiest way to answer',
    'Most of these take a 30-minute conversation. We can also run a short, no-obligation, compliance-safe readiness check, your visibility today, the hours documentation is costing, and the single highest-value place to start, and hand you the findings whether or not we work together.', CORE_ORANGE),
];

// ============================================================ SEC 14 - WHAT HAPPENS NEXT
const section14 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '14'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short conversation, walk this blueprint and the Section 13 questions, focused on freeing your advisors’ time first.', 'A call. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'A free, compliance-safe readiness check, your visibility, the hours documentation costs, and the best place to start.', 'None; the findings are yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand, start with the private documentation pilot, then add the two fronts as each proves out.', 'You decide, with real numbers.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('A useful read, on your terms',
    ['Prosperity has built something rare: a fee-only fiduciary practice that clients trust with their financial future. This plan is about protecting that, by giving your advisors their time back and helping more of the right clients find you, with AI that keeps client information private and compliant and a fiduciary always in the loop.',
     'Ravi Jain, Founder & CEO  -  rjain@technijian.com  -  949.379.8499  -  technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy, security, and implementation firm founded in 2000 by Ravi Jain. We help organizations put AI to practical work, through AI-era search and answer-engine optimization (My SEO), AI lead generation and outreach (My AI Lead Gen), AI knowledge and automation (My AI), and AI-native software development (My Dev), and we architect, build, and operate through to production rather than handing over a slide deck. Our dedicated pod model assigns a named team to each client, with offices in Irvine, California and Panchkula, India for coverage across time zones. Our approach is cybersecurity-first and AI-forward, with private, governed deployments, which is exactly what a fiduciary handling client financial data requires.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO - rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery center', bold: true }, 'Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com - technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix - Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. could not confirm'),
  bullet('Carolanne Chavanne’s CFP® designation (earned 1999), B.S. in Financial Services (San Diego State University), prior roles (LPL Financial, Comerica Bank), and ~15 years serving Toyota Motor North America associates and retirees - per the firm’s About page and public directories; recommend self-verifying the CFP® on cfp.net and the tenure (35 vs ~30 years) at discovery.'),
  bullet('Fee-only fiduciary status, SEC registration (firm CRD 315163), three fee structures, the team of CFP® professionals, the automotive niche, the "Supercharge Your Finances" series, Orion portal, and the Irvine and Long Beach offices - VERIFIED via prosperitywealthplanning.com and the SEC IAPD.'),
  bullet('Account minimum stated as roughly $500,000 - per the firm site and FPA listing; one ADV mirror shows $1M. Listed as a discovery confirm.'),
  bullet('Assets under management, client or household count, exact team size, custodian, systems in use, how documentation is handled today, and any finances - NOT confirmed (public ADV mirrors disagree); listed as questions in Section 13.'),
  subHeader('Selected sources'),
  ...[
    'Prosperity Wealth Planning - prosperitywealthplanning.com (about, services, team, "Supercharge Your Finances"); SEC Investment Adviser Public Disclosure (adviserinfo.sec.gov), firm CRD 315163.',
    'Regulation & compliance - SEC Regulation S-P 2024 amendments (Release 34-100155); SEC Marketing Rule 206(4)-1 and the small-entity compliance guide; SEC AI-washing settlements (Delphia, Global Predictions, March 2024); CFP Board Generative AI Ethics Guide (2025).',
    'Industry adoption - Charles Schwab RIA and AI Study (January 2026) and RIA Benchmarking Study; T3 / Inside Information Software Survey (2025); Jump and Zocks advisor time-savings figures (vendor-reported).',
    'AI framing - MIT Sloan (AI literacy); Anthropic ("Building Effective Agents"); Gartner and Google Cloud AI maturity frameworks; NIST AI Risk Management Framework (Govern/Map/Measure/Manage).',
  ].map(s => bullet(s)),
  spacer(120),
  p('Industry figures are about the wider RIA and financial-planning landscape; figures specific to Prosperity are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Prosperity Wealth Planning  ·  AI for Growth & Efficiency', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  ...section11, ...section12, ...section13, ...section14, ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'Prosperity Wealth Planning - AI Growth & Integration Blueprint', description: 'A facts-only AI blueprint for Prosperity Wealth Planning, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Prosperity-Wealth-Planning-AI-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
