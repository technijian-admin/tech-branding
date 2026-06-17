// Gossamer Space Frames (GSF) — AI Growth Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY discipline: verified facts only,
// self-reported / market figures attributed, estimates labeled, unknowns -> Questions.
// Engineer-to-engineer, for-profit voice. The reframe: this is NOT managed IT / security
// (already declined) — it is AI for the COMMERCIAL front end: getting found and winning work
// in a solar market that is growing again. AI never touches the structural engineering.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  TabStopType, LeaderType, HeadingLevel, BorderStyle, WidthType, ShadingType,
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
  centered('AI GROWTH BLUEPRINT', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('Gossamer Space Frames', { size: 48, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'How AI can help a firm with world-class, proven engineering get found and win more work — in a solar market that is growing again. Built on verified facts, with the questions that complete the picture.', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(800),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Glenn Reynolds, President — Gossamer Space Frames', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR GOSSAMER SPACE FRAMES LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...sectionHeader('How to Read This Blueprint', CORE_BLUE, ''),
  calloutBox('First — this is not a managed-IT or security pitch',
    ['When we first reached out, we led with managed IT and a free security assessment, and you replied that you are not there yet. That is fair, and this blueprint asks nothing of that kind — nothing here proposes to change who supports your systems or runs your network.',
     'It is about something different, and for a firm like yours more valuable: using AI to get found and win more work — in a concentrated-solar market that, after a quiet decade, is growing again. That is commercial growth, not IT, and it is where a small firm with world-class engineering has the most to gain.'], CORE_ORANGE),
  p('This blueprint was prepared from public research, before any conversation about your internal numbers, pipeline, or systems. It holds itself to a simple discipline:', { spaceBefore: 120, spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Gossamer is drawn from your own website, reputable press, patent records, and partner and lab sources, and is cited in the Appendix. Where a figure describes the wider market rather than your firm, we say so plainly.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Market sizes and growth rates are clearly marked as industry context — never presented as your results. The numbers that drive a plan come from a short discovery conversation.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has — current pipeline, capacity, priorities — we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('A correction we owe you, up front',
    ['Our first note congratulated you on the "recent" debut of the LAT solar collector with 3M. On closer research, that milestone — a genuine engineering breakthrough, independently verified by NREL — was proven out in 2011–2012, not recently. We would rather be precise than flattering: it is the platform you pioneered, and it matters more now than it did then, because the market for large-aperture trough technology has come back.',
     'We hold this document to that same standard. We cite no revenue figure for Gossamer (none is public and verified), we do not assume your 3M relationship or any project is still active, and where sources disagree — even on something as basic as your current city — we flag it as a question rather than state it as fact. Precision is the standard behind every number here.'], TEAL),
];

// ============================================================ TOC
function tocRow(n, t, page, o = {}) {
  const { bold = false } = o;
  return new Paragraph({ spacing: { before: 52, after: 52 }, tabStops: [
    { type: TabStopType.LEFT, position: 600 },
    { type: TabStopType.RIGHT, position: CONTENT_W, leader: LeaderType.DOT },
  ], children: [
    new TextRun({ text: n || '·', size: 22, bold: true, color: CORE_ORANGE, font: FONT_HEAD }),
    new TextRun({ text: '\t' + t, size: 22, bold, color: DARK_CHARCOAL, font: FONT_BODY }),
    new TextRun({ text: '\t' + String(page), size: 22, color: DARK_CHARCOAL, font: FONT_HEAD }),
  ] });
}
const toc = [
  ...sectionHeader('Contents', CORE_BLUE, ''), spacer(80),
  tocRow('', 'How to Read This Blueprint', 3),
  tocRow('', 'Executive Summary', 5),
  ...[
    ['01', 'The Company & Its Engineering', 7],
    ['02', 'How Gossamer Wins & Delivers Work', 10],
    ['03', 'The CSP & Industrial-Heat Market', 12],
    ['04', 'Where Growth Lives', 14],
    ['05', 'Buyers & Channels', 15],
    ['06', 'The Visibility & Demand Landscape', 17],
    ['07', 'Brand & Digital Presence Audit', 19],
    ['08', 'Technijian Capability Proof', 21],
    ['09', 'Understanding AI — A Field Guide for Technical Leadership', 23],
    ['10', 'The AI Growth Engine', 25],
    ['11', 'Investment & Value at Stake', 27],
    ['12', 'Implementation Roadmap', 29],
    ['13', 'Quick Wins — Start This Week', 30],
    ['14', 'Questions to Complete the Analysis', 31],
    ['15', 'What Happens Next', 33],
  ].map(([n, t, pg]) => tocRow(n, t, pg)),
  tocRow('', 'About Technijian', 34),
  tocRow('', 'Appendix — Sources & What Remains to Confirm', 35),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Gossamer Space Frames is a Southern California engineering firm that designs and fabricates space-frame structures — lightweight modular truss systems — for two markets: concentrated solar power (CSP) and architecture. Founded in 1999 by Glenn Reynolds and his partners, it pioneered the LAT 73 Large Aperture Trough with 3M: a 7.3-meter-aperture parabolic-trough solar collector, independently verified by NREL at better than 99% optical intercept, that cut installed solar-field cost by more than 25%. The Martin Next Generation Solar Energy Center it helped build for Florida Power & Light won Power Engineering’s Project of the Year. The engineering is, by any measure, world-class.', { spaceAfter: 120 }),
  kpiRow([
    { number: '1999', label: 'Founded · Glenn Reynolds, PE', color: CORE_BLUE },
    { number: '7.3 m', label: 'LAT aperture — largest at its debut', color: CORE_ORANGE },
    { number: '>25%', label: 'lower solar-field cost (LAT + 3M)', color: TEAL },
    { number: '>99%', label: 'optical intercept, NREL-verified', color: GREEN },
  ]),
  spacer(160),
  pRuns([{ text: 'The problem this blueprint addresses is not the engineering — it is that almost no one buying these structures today can find you. ', bold: true, color: DARK_CHARCOAL }, { text: 'Gossamer’s public presence largely froze around 2012: a legacy website whose newest news is more than a decade old, a company LinkedIn page with a handful of followers, no living case studies, and effectively zero visibility for the search terms a 2026 developer or EPC actually types. Meanwhile the technology you helped invent has competitors who are easy to find — and a market that has quietly returned.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The opportunity is real and current. ', bold: true, color: DARK_CHARCOAL }, { text: 'Industry analysts put the parabolic-trough CSP market back on a growth track through the 2030s, with the fastest demand in the Middle East and North Africa — Saudi Arabia, the UAE, and Egypt all have utility-scale pipelines — and a fast-growing adjacency in solar industrial process heat, desalination, and mining. Parabolic trough remains the dominant CSP technology. For a firm that owns patented, proven, large-aperture trough IP, the question is simply whether the people now spending that money know you exist.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The plan has two parts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Be found — a modern, technical web presence that turns the LAT, the NREL data, the patents, and the Project-of-the-Year plant into living, search-and-AI-citable proof, so Gossamer surfaces when a developer searches "large aperture trough" or "CSP support structure." Win more work — AI that watches the CSP, industrial-heat, and space-frame project pipeline, identifies the developers and EPCs actively sourcing now, and drafts the technical first-touch and proposal so a small team competes like a much larger one. Across both, the rule is fixed: AI works the commercial front end and drafts; Glenn and the team verify every claim, own every relationship, and AI never touches the structural engineering.' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'Your engineering is not the problem — your visibility is. A firm with patented, NREL-verified, award-winning trough IP is, in 2026, nearly invisible to the developers and EPCs now sourcing exactly this technology. AI can close that gap: get Gossamer found, surface the projects worth chasing, and help a small team win work without adding headcount — so a quiet decade becomes the start of the next one.', CORE_ORANGE),
];

// ============================================================ SEC 01 — COMPANY & ENGINEERING
const section1 = [
  ...sectionHeader('The Company & Its Engineering', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Gossamer’s own website, reputable press, U.S. patent records, NREL documentation, and partner organizations (see Appendix). Where a current detail could not be independently confirmed, it is flagged rather than asserted.', { spaceAfter: 130 }),
  subHeader('Two businesses, one rare capability'),
  p('Gossamer Space Frames — which also presents publicly as Gossamer Innovations — designs and fabricates space frames: lightweight, modular truss structures. That single capability serves two very different markets. In concentrated solar power, Gossamer builds the structural support systems that hold and aim parabolic-trough collectors. In architecture, it builds long-span and free-form structures — roofs, atria, and pedestrian bridges — including work built on its Co-Axial Joint System, which the company describes as the only non-welded round-pipe structural system of its kind. Both rest on the same engineering discipline: precise, lightweight, aerospace-influenced structures that do more with less material.', { spaceAfter: 120 }),
  subHeader('The LAT 73 — the platform you pioneered'),
  p('The headline achievement is the LAT 73 Large Aperture Trough, developed with 3M’s renewable-energy group. It pairs a Gossamer aluminum space-frame collector with 3M’s polymer Solar Mirror Film in place of heavy glass mirrors. The specifications are independently documented and remain impressive today:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Attribute', weight: 30 }, { label: 'Verified detail', weight: 70 }],
    [
      [{ text: 'Aperture', bold: true, color: CORE_BLUE }, '7.3 meters — described at its 2012 debut as the largest-aperture parabolic trough in the world.'],
      [{ text: 'Concentration', bold: true, color: CORE_BLUE }, 'Greater than 100x (about 104x), pairing the space frame with 3M Solar Mirror Film (~94.5% reflectivity, roughly half the weight of glass).'],
      [{ text: 'Optical accuracy', bold: true, color: CORE_BLUE }, 'Better than 99% intercept (up to ~99.3% on a standard receiver), independently verified by NREL, with testing referenced at Sandia.'],
      [{ text: 'Cost impact', bold: true, color: CORE_BLUE }, 'A reported reduction of more than 25% in installed parabolic-trough solar-field cost.'],
      [{ text: 'Demonstration', bold: true, color: CORE_BLUE }, 'Deployed at the long-running Sunray Energy facility in Daggett, California (Cogentrix Energy), with power contracted to Southern California Edison.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('On timing — stated plainly',
    'The LAT 73 inauguration with 3M took place in 2011–2012, and we found no public evidence of LAT activity after that period. We treat it not as recent news but as a proven, verified platform — your IP — whose relevance is rising again as the trough market returns. Whether the 3M relationship or the LAT program is active today is a discovery question, not an assumption.', CORE_ORANGE),
  subHeader('Footprint, leadership, and recognition (verified)'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founded', bold: true }, '1999, by Glenn Reynolds with partners; a privately held firm with no outside funding rounds on record.'],
      [{ text: 'Leadership', bold: true }, 'Glenn Reynolds, co-founder and President, a licensed Professional Engineer (since 1985) with prior roles as a plant manager at Temcor (aluminum space frames) and a business-unit manager on Boeing’s C-17 wing-assembly program. Co-founders include Gary Curtis (senior engineer) and Dean Hackbarth (senior designer).'],
      [{ text: 'Location', bold: true }, 'Southern California (Orange County / Long Beach area; public sources list Laguna Hills, Long Beach, and Huntington Beach across different years — the current address is a discovery item).'],
      [{ text: 'Size', bold: true }, 'A small, specialized firm (public listings indicate roughly 2–10 people) — a boutique engineering shop, not a mass manufacturer.'],
      [{ text: 'Intellectual property', bold: true }, 'Multiple U.S. patents naming Glenn Reynolds on space-frame trough support structures and CSP components (e.g., the SunLock center drive and MiniTruss / X-PERF reflective panels) — a real, defensible IP position.'],
      [{ text: 'Recognition', bold: true }, 'The Martin Next Generation Solar Energy Center (Indiantown, FL; for Florida Power & Light) won Power Engineering’s Project of the Year / Best Renewable Energy Project (2011). Earlier architectural work includes the Long Beach Pike pedestrian bridge (2002).'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your current annual revenue or headcount; whether Gossamer is actively bidding and taking projects today; your current project pipeline and capacity; your present mix of CSP versus architectural versus industrial-heat work; or the current status of the 3M relationship. These are the questions in Section 14 — and the answers reshape everything that follows.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW WORK IS WON
const section2 = [
  ...sectionHeader('How Gossamer Wins & Delivers Work', CORE_BLUE, '02'),
  p('An engineering firm runs on a cycle: work comes in, world-class engineering turns it into proven structures, and those results — told well and easy to find — bring in the next project. AI can strengthen the front of that cycle without touching the engineering at its heart.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Gossamer wins and delivers work', 612),
  caption('Figure 02.0 — Work in (left), engineer and fabricate (center, the IP), proven outcomes (right). The orange band shows where AI plugs in — the commercial front end only; it never touches the structural engineering.'),
  buildTable(
    [{ label: 'Stage', weight: 24 }, { label: 'What it is today', weight: 46 }, { label: 'Where AI helps', weight: 30 }],
    [
      [{ text: 'Work in', bold: true, color: TEAL }, 'Inquiries and RFPs, referrals built on patents and the NREL-verified track record, and partner / EPC channels.', 'Project intelligence; lead identification.'],
      [{ text: 'Engineer & fabricate', bold: true, color: DARK_CHARCOAL }, 'The crown jewel: patented space-frame and trough design, fabrication, and field assembly.', 'Nothing. AI does not touch this.'],
      [{ text: 'Proven outcomes', bold: true, color: CORE_BLUE }, 'Lower-cost solar fields, verified performance, iconic structures, durable installations.', 'Case studies; storytelling; reputation made findable.'],
    ], { headerColor: TEAL }),
  spacer(80),
  pRuns([{ text: 'The engineering is not the constraint — reach is. ', bold: true, color: DARK_CHARCOAL }, { text: 'A firm of this size lives or dies on a steady flow of the right opportunities. When the work is custom, technical, and infrequent, the hardest part is being in front of the right buyer at the right moment — and being credible enough, fast enough, to make the shortlist. That is exactly the part of the cycle where a small team is most stretched, and exactly where AI creates leverage: watching the market, surfacing the right projects, and turning a thirty-year body of work into proof a buyer can find and trust.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — MARKET LANDSCAPE
const section3 = [
  ...sectionHeader('The CSP & Industrial-Heat Market', CORE_BLUE, '03'),
  p('The figures below describe the market Gossamer sells into — not Gossamer’s own results. They are drawn from independent market research, which varies in its estimates; we present them as direction and order of magnitude, not precision. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '~8%', label: 'est. CSP market CAGR through the 2030s', color: CORE_BLUE },
    { number: '~53–67%', label: 'parabolic-trough share of CSP (2025)', color: CORE_ORANGE },
    { number: '~22%', label: 'CSP growth rate in MEA — fastest region', color: TEAL },
    { number: '~66%', label: 'of 2024 new solar industrial-heat area was trough', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('The trough market has come back — and trough still leads'),
  p('After a quiet decade, concentrated solar power is growing again. Independent analysts project the broader CSP market expanding through 2035 at high-single-digit annual rates, and within it, the parabolic trough remains the dominant technology — roughly 53% to 67% of the market in 2025, depending on the source — ahead of the more-hyped tower designs. For a firm whose IP is a large-aperture trough, that matters: demand is concentrated in exactly the technology class Gossamer pioneered.', { spaceAfter: 120 }),
  h3('The center of gravity has moved to the Middle East and North Africa'),
  p('The fastest-growing region is the Middle East and North Africa, where analysts cite growth rates above 20% a year: Saudi Arabia has a multi-gigawatt CSP pipeline, the UAE already operates hundreds of megawatts, and Egypt has tendered large projects. These are utility-scale developers and EPCs actively sourcing collector technology now — buyers who are highly unlikely to find a Southern California firm whose web presence stopped updating in 2012. Reaching them is a visibility-and-outreach problem, not an engineering one.', { spaceAfter: 120 }),
  h3('Industrial process heat is the fast-growing adjacency'),
  p('Beyond utility power, the use of solar thermal energy for industrial process heat — and for desalination, mining, and enhanced oil recovery — is rising quickly. Parabolic trough made up roughly two-thirds of newly added solar industrial-heat collector area in 2024. This is a logical adjacency for Gossamer’s technology, though we found no public evidence the firm has marketed into it; whether to pursue it is a strategic choice for discovery, and a potentially large open lane.', { spaceAfter: 120 }),
  h3('The honest caveat'),
  p('Market-sizing reports disagree, sometimes widely, and a growing market is not the same as a signed contract. None of these figures is a forecast of Gossamer’s revenue. What they establish is narrower and still powerful: the demand for large-aperture trough and space-frame structures is real and rising, and it is concentrated among buyers who currently cannot find you.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'A returning trough market rewards being found for the right technical terms; a MENA-centered pipeline rewards reach beyond your existing network; a fast-growing industrial-heat adjacency rewards watching where demand is moving; and a small team rewards automation that does the searching and the first drafting. Every one of these forces points at a specific capability later in this blueprint — and none asks Gossamer to change its engineering, only to put it in front of the people now buying it.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where Growth Lives', CORE_BLUE, '04'),
  p('For a specialized engineering firm, "growth" is not a single sales funnel. It is four levers — and AI supports each one while keeping Glenn and the team at the center of every technical relationship.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 24 }, { label: 'What it looks like for Gossamer', weight: 50 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Be found', bold: true, color: CORE_BLUE }, 'Surface for the technical terms developers, EPCs, and architects search — and be citable by the AI assistants they increasingly ask first.', 'Get found'],
      [{ text: 'Win more bids', bold: true, color: CORE_BLUE }, 'See more of the right RFPs and tenders early, and respond faster with stronger, proof-backed proposals.', 'Win work'],
      [{ text: 'Reach new markets', bold: true, color: CORE_ORANGE }, 'Open the MENA CSP pipeline and the industrial-process-heat adjacency — demand that exists today but outside the current network.', 'Win work'],
      [{ text: 'Respond faster', bold: true, color: CORE_ORANGE }, 'Cut the time a small team spends on proposals, capability statements, and spec responses, so engineers stay on engineering.', 'Operate'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first two levers grow the flow of qualified opportunities; the third opens markets the firm is not currently reaching; the fourth gives a lean team back its time. None of them asks Gossamer to be a different company — they ask only that its proven engineering be seen, sourced, and won more often.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — BUYERS & CHANNELS
const section5 = [
  ...sectionHeader('Buyers & Channels', CORE_BLUE, '05'),
  p('Gossamer sells to a portfolio of technical buyers. The map below places the buyer archetypes by deal value and by how actively each segment is sourcing in 2026 — archetypes to calibrate against your real pipeline at discovery, not named accounts.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Buyer and channel map', 560),
  caption('Figure 05.0 — Buyer archetypes by deal value and current sourcing intensity. Bubble size approximates relative opportunity weight; calibrate against your real pipeline at discovery.'),
  buildTable(
    [{ label: 'Buyer', weight: 24 }, { label: 'What they need', weight: 40 }, { label: 'How AI helps Gossamer reach & win them', weight: 36 }],
    [
      [{ text: 'CSP developers & EPCs', bold: true, color: CORE_BLUE }, 'A proven, lower-cost collector structure and a credible partner who reduces project risk.', 'Pipeline tracking; early RFP alerts; proof-backed proposals.'],
      [{ text: 'International / MENA developers', bold: true, color: CORE_ORANGE }, 'Bankable, demonstrated technology for large utility-scale fields.', 'Surface and translate for the MENA pipeline; targeted outreach.'],
      [{ text: 'Electric utilities', bold: true, color: TEAL }, 'Reliable performance and a documented track record (the FPL plant).', 'Case studies and authority content that build trust before contact.'],
      [{ text: 'Industrial process-heat buyers', bold: true, color: GREEN }, 'Cost-effective solar thermal for heat, desalination, or mining.', 'Watch an emerging adjacency; identify and qualify early movers.'],
      [{ text: 'Architects & general contractors', bold: true, color: BRAND_GREY }, 'Distinctive long-span / free-form structures and a buildable system.', 'Be found for space-frame terms; portfolio made searchable.'],
      [{ text: 'Government / national labs', bold: true, color: DARK_CHARCOAL }, 'Verified performance and research-grade partners.', 'Surface grant and program opportunities; supporting drafts.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your CRM. Which segments matter most — by value, by win probability, by fit with your current capacity — is a discovery question. We would rather build the plan around your real pipeline and priorities than around our assumptions about them.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE
const section6 = [
  ...sectionHeader('The Visibility & Demand Landscape', CORE_BLUE, '06'),
  p('Gossamer competes for attention as much as for contracts: for the same developers, EPCs, and architects, and for the same search results and AI answers. The throughline below is discoverability set against technical credibility — because Gossamer’s gap is reach, not proof.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Visibility and demand landscape', 560),
  caption('Figure 06.0 — A strategic assessment, not a measured score, and a discovery item rather than a verified benchmark. Gossamer sits high on proof and low on visibility — the open lane is to be found as well as proven.'),
  buildTable(
    [{ label: 'Who competes for the same buyers', weight: 28 }, { label: 'Examples', weight: 34 }, { label: 'Visibility vs. Gossamer (general read)', weight: 38 }],
    [
      [{ text: 'Direct CSP-structure analogs', bold: true, color: CORE_BLUE }, 'SkyFuel (aluminum SpaceFrame + film-mirror SkyTrough); legacy Abengoa SpaceTube IP.', 'The closest comparison; more visible and more current online than Gossamer.'],
      [{ text: 'Glass-mirror collector suppliers', bold: true, color: CORE_BLUE }, 'Rioglass, Flabeg, and large-aperture glass collectors.', 'Established supply-chain presence; compete on the mirror approach.'],
      [{ text: 'Architectural space-frame firms', bold: true, color: CORE_BLUE }, 'MERO-TSK, Geometrica, and similar long-span specialists.', 'Far larger and far more visible online for space-frame terms.'],
      [{ text: 'Directories & market reports', bold: true, color: CORE_BLUE }, 'Industry directories and research-firm listings.', 'Often out-rank individual firms for category searches — buyers leak to them.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and an honest caveat',
    ['Few competitors can match Gossamer’s combination of patented IP, NREL-verified performance, and an award-winning built plant. But most are easier to find. A firm that pairs genuinely proven engineering with modern discoverability would stand in a corner few occupy — credible when a buyer arrives, and actually present when they search. That is the open lane.',
     'The caveat: a rigorous, named competitive win/loss map (which firms take which CSP and space-frame work, and where Gossamer wins or loses) was not built from public data in this pass. We would rather research it properly with you than assert it — it is a discovery deliverable.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Gossamer’s public digital footprint as observed in June 2026. The point is not criticism — it is that the gap between the quality of the engineering and the reach of its digital presence is, itself, the opportunity.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 22 }, { label: 'What we observed', weight: 52 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Website', bold: true, color: CRITICAL }, 'A legacy site built on static .htm pages, presenting as "Gossamer Innovations," whose newest news items date to roughly 2012. It reads as frozen in time.', 'A modern technical site is the foundation.'],
      [{ text: 'Case studies / proof', bold: true, color: CRITICAL }, 'The LAT, the NREL verification, the FPL Project-of-the-Year plant, and the patents are mentioned in prose but not built into structured, citable case studies.', 'Turn proof into findable assets.'],
      [{ text: 'News / content', bold: true }, 'No active blog or content engine; the news page is a decade stale, so the firm publishes nothing search or AI can surface as current.', 'A light, technical content cadence.'],
      [{ text: 'LinkedIn', bold: true, color: CRITICAL }, 'A company page with only a handful of followers and no visible recent activity, listed at 2–10 employees.', 'A credible, active profile buyers can vet.'],
      [{ text: 'Search visibility', bold: true, color: CRITICAL }, 'The firm ranks for its own name and rides on 2012-era press, but is effectively invisible for non-branded buyer terms like "large aperture trough" or "CSP support structure."', 'Be found for what buyers search.'],
      [{ text: 'AI answer presence (AEO/GEO)', bold: true }, 'Because the live content is thin and dated, AI assistants have little current, authoritative Gossamer material to cite when asked about trough structures.', 'Be the cited answer, not absent.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most important finding',
    'A firm with patented, NREL-verified, award-winning trough IP is, in 2026, nearly impossible to find for the exact buyers now sourcing this technology — because its public presence stopped around 2012 while the market came back. Neither the proof nor the demand is in question; only the connection between them is missing. That connection is the cheapest, highest-leverage place to start, and a modern presence can be standing in weeks.', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the plan, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Gossamer use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini with search and analytics tools) that produces and optimizes authority content and tracks whether AI assistants cite it. How it applies: a modern, technical Gossamer presence that makes the firm the answer when a developer searches "large aperture trough" or asks an AI assistant who builds CSP collector structures.', CORE_ORANGE),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured data and drafted output — deployed for a regulated financial firm’s compliance workflows. How it applies: first drafts of proposals, capability statements, and spec responses built from your own verified facts, so engineers edit rather than start from a blank page.', CORE_BLUE),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: a fact-check pass on technical claims and proposal language before it reaches a sophisticated engineering buyer — where a single overstated number would cost credibility.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: knowledge systems and an AI-native software practice that delivers builds far faster than traditional development. How it applies: a searchable knowledge graph of Gossamer’s 25-plus years of designs, patents, and projects — so a thirty-year body of work becomes an instantly retrievable asset for estimating, proposals, and reuse, plus pipeline and RFP-triage tools for a lean team.', CORE_BLUE),
  subHeader('"Is this affordable for a firm our size?" — the multi-model discipline'),
  p('A fair question for a lean shop. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform and send each sub-task to the most cost-effective model that does it well: lightweight models for high-volume work like pipeline monitoring, mid-tier models for drafting, and frontier models only for the small slice that needs deep judgment. In practice that runs well below the cost of routing everything to one premium tool — and it means the engine scales with the work rather than carrying a fixed overhead a small firm cannot justify.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Technical Leadership', CORE_BLUE, '09'),
  p('A short, vendor-neutral primer so the conversation rests on shared ground — written for an engineer, not a marketer. Each point is anchored to an independent framework, not a sales claim, and the guardrails are written for a firm whose reputation rests on technical precision and proprietary IP.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it. The most useful distinction is between ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable and low-risk, e.g. "draft a capability statement from these project facts") and ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight, e.g. "monitor these tender portals and flag fits"). The principle is to use the simplest thing that works: start with drafting and monitoring automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The non-negotiable guardrails for this firm'),
  bulletRuns([{ text: 'Accuracy — every technical claim must be true. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI produces a fluent answer, not necessarily a correct one. The rule: AI drafts; a qualified person verifies every number, spec, and reference before it reaches a buyer. To a sophisticated engineering customer, one overstated figure ends the conversation — so the LAT data, the NREL results, and the patent claims are stated exactly, never embellished.' }]),
  bulletRuns([{ text: 'Confidentiality — proprietary IP never goes into public AI. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your designs, drawings, and unpublished know-how are the business. The rule: no proprietary engineering data goes into consumer AI tools; we use private, governed deployments with no-training terms, and AI works only with public-facing facts unless you explicitly choose a secured internal tool.' }]),
  bulletRuns([{ text: 'The engineer owns the relationship. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI handles research, monitoring, and first drafts. Glenn and the team own every technical conversation, every quote, and every commitment to a client.' }]),
  bulletRuns([{ text: 'AI stays on the commercial side. ', bold: true, color: DARK_CHARCOAL }, { text: 'Nothing in this plan applies AI to structural design, analysis, or fabrication. The engineering is your domain and stays entirely human and entirely yours; AI works the front office.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Free tools are cheap but leave you to assemble, secure, and govern the whole system — time a working engineer does not have. A capable full-time marketing or business-development hire is expensive and still cannot cover strategy, content, search, automation, and software alone. A partner provides all of that at a fraction of the cost, with proven builds — and we architect, build, and operationalize through to something your team actually uses, rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth Engine', CORE_BLUE, '10'),
  p('The engine has three columns: be found and tell the story, win more work, and respond and operate faster. Each capability names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Gossamer AI growth engine', 624),
  caption('Figure 10.0 — Be found and tell the story (left); win more work (center); respond and operate faster (right). AI works the front end and drafts; a person owns every relationship and verifies every claim.'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Gossamer', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Modern technical website', 'Replace the 2012-era site with a fast, credible presence built around the engineering.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Authority & case studies', 'Turn the LAT, NREL data, the FPL plant, and the patents into living, citable proof.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['AEO / GEO + search', 'Be the cited answer for "large aperture trough" and "CSP support structure," in search and AI assistants.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Project & RFP intelligence', 'Monitor CSP, industrial-heat, and space-frame projects and tenders as they emerge.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Lead identification & outreach', 'Find developers and EPCs sourcing now; draft tailored, technical first-touch and follow-up.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Proposal & spec drafting', 'First drafts of proposals and spec responses from your verified facts; engineers refine.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['International / MENA reach', 'Surface and translate for the Middle East and North Africa CSP pipeline.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Knowledge graph + triage', 'Make 25+ years of designs and patents searchable; sort and route incoming inquiries.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'AI assists the people who win and deliver the work; it does not replace the engineer who earns a buyer’s trust, and it never touches the structural design. Every draft is checked, every figure is verified against the record, and no proprietary IP goes into a public tool. That is how this stays credible with the technical buyers Gossamer needs to win.', TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Investment & Value at Stake', CORE_BLUE, '11'),
  p('We price from real, published service ranges, we start small and prove value before scaling, and we model returns only after discovery. No figure below is a quote, and none is presented as a guaranteed result.', { spaceAfter: 130 }),
  subHeader('Start small, prove it, then grow'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Start — get found', bold: true, color: CORE_BLUE }, 'A short AI Readiness session, a modern technical website, and the LAT / NREL / FPL track record rebuilt as structured, search-and-AI-citable case studies.', 'Fixed, modest scope'],
      [{ text: 'Grow — win work', bold: true, color: CORE_BLUE }, 'Project and RFP intelligence across CSP, industrial heat, and space frames; lead identification; AI-assisted technical outreach and proposal drafting.', 'My SEO + My AI'],
      [{ text: 'Scale — operate', bold: true, color: CORE_BLUE }, 'A searchable knowledge graph of the firm’s IP, inquiry/RFP triage, and a measured pipeline dashboard of opportunities surfaced, pursued, and won.', 'My Dev + ongoing support'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What it costs — published ranges, scaled to a small firm'),
  buildTable(
    [{ label: 'Component', weight: 44 }, { label: 'Basis', weight: 30 }, { label: 'Note', weight: 26 }],
    [
      [{ text: 'My SEO — site, authority content, AEO/GEO', bold: true }, 'published monthly tiers', 'recurring'],
      [{ text: 'My AI — pipeline, lead-gen & proposal automation', bold: true }, 'published monthly tiers, by workflow', 'recurring + build'],
      ['My Dev — knowledge graph / triage build', 'project-based (US dev rate card)', 'one-time build'],
      ['AI Readiness session', 'small fixed engagement', 'one-time'],
      ['Discovery & strategy', 'included in the first conversation', 'no cost'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a project-based engineering firm, the right way to think about return is value at stake, not a revenue multiple we invent. A single additional CSP collector contract, industrial-heat project, or signature space-frame structure is worth far more than a year of this engine — so the engine pays for itself if it helps win even one opportunity that would otherwise never have reached you. We will put conservative, mid, and upside numbers against that — using your real average project value, win rate, and capacity — once discovery gives us the figures (Section 14). Until then, any single ROI claim would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
  calloutBox('A note on fit',
    'We scope the first engagement to fit a small firm and to prove out before it scales — get found first, because that is the cheapest, fastest win, then add the work-winning automation only once the presence is live. The goal is a plan that starts where it pays for itself and grows only as it earns the next step.', CORE_ORANGE),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself — in opportunities surfaced or won — before the next begins, and sequenced to start with the lowest-cost, fastest win: being found.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Be found, then win work, then scale and sustain. Targets and sequence calibrate at discovery and flex to your capacity.'),
  p('Phase one stands up a modern technical website, rebuilds the LAT, NREL, and FPL track record as structured case studies, gets Gossamer discoverable for buyer search terms, and revives a credible LinkedIn presence — the lowest-cost, highest-leverage fixes. Phase two turns on project and RFP intelligence across CSP, industrial heat, and space frames, identifies the buyers sourcing now, and adds AI-assisted technical outreach and proposal drafting. Phase three makes the firm’s 25-plus years of IP searchable, adds inquiry triage, and stands up a pipeline dashboard so every claim in this plan is measured against real opportunities surfaced, pursued, and won.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions Gossamer can take now, with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Claim and refresh the LinkedIn company page. ', bold: true, color: DARK_CHARCOAL }, { text: 'A current, credible profile is the first thing a serious buyer checks — and it is free. Even a short, accurate description and the LAT / FPL highlights lift credibility immediately.' }]),
  bulletRuns([{ text: 'Publish the LAT 73 as a real case study. ', bold: true, color: DARK_CHARCOAL }, { text: 'Put the aperture, the NREL-verified intercept, and the >25% cost reduction on one clean, current page — the single strongest piece of proof you own, today buried in dated prose.' }]),
  bulletRuns([{ text: 'Redirect or refresh the dated site. ', bold: true, color: DARK_CHARCOAL }, { text: 'A 2012-era homepage actively works against you. Even an interim one-page modern site with clear contact and capability signals beats a decade-old presence.' }]),
  bulletRuns([{ text: 'Pick the three search terms you most want to own. ', bold: true, color: DARK_CHARCOAL }, { text: 'Decide whether it is "large aperture trough," "CSP support structure," "space frame solar collector," or architectural terms — that choice points the whole content effort.' }]),
  bulletRuns([{ text: 'Name your three target markets for the year. ', bold: true, color: DARK_CHARCOAL }, { text: 'Domestic CSP, MENA utility-scale, industrial process heat, architecture — deciding where to aim turns the project-intelligence engine on with focus.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & pipeline', CORE_BLUE, [
    'Is Gossamer actively bidding and taking new projects today, and what is your current capacity to take on work?',
    'What does your current pipeline look like — CSP, architectural, or other — and how many active opportunities are you tracking?',
    'What is a typical project worth, and how long is a typical sales cycle from first contact to signed contract?',
  ]),
  ...qGroup('B · Markets & priorities', CORE_ORANGE, [
    'Where do you most want to grow — domestic CSP, international / MENA utility-scale, industrial process heat, or architectural space frames?',
    'Is the LAT 73 platform something you are actively offering, and is the 3M relationship still in place?',
    'Have you considered the industrial-process-heat or desalination adjacency, or is your focus utility-scale power?',
  ]),
  ...qGroup('C · Sales & systems', TEAL, [
    'How do you find and win work today — referrals, repeat clients, EPC relationships, inbound, or outbound?',
    'Do you use a CRM or any system to track opportunities, and how are proposals produced today?',
    'How much of your time, and the team’s, currently goes to business development versus engineering?',
  ]),
  ...qGroup('D · People & decision', CHARTREUSE, [
    'Who owns business development and marketing today, and is there appetite to publish regular technical content?',
    'What would a successful next year look like — more inbound, a specific market opened, a target number of new contracts?',
    'Who decides on an initiative like this, who else weighs in, and what is the current address and team we should plan around?',
  ]),
  spacer(80),
  calloutBox('The easiest way to answer',
    'Most of these take a 45-minute discovery call. Several can also be mapped in a short AI Readiness session that returns a prioritized, costed plan — which is the cleanest, lowest-commitment first step.', CORE_ORANGE),
];

// ============================================================ SEC 15 — WHAT HAPPENS NEXT
const section15 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '15'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short conversation — walk this blueprint and the Section 14 questions together.', 'A meeting. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'An AI Readiness session — map your business-development workflow and return a prioritized, costed plan, scoped to a small firm.', 'A small, fixed engagement; the plan is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Start small — get found first, then add the work-winning automation; grow as each step proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['The easiest first step is a short working session on where AI creates measurable value for Gossamer — no obligation, and nothing about managed IT. We will come having done our homework, and we will be honest about what is worth doing now, what can wait, and what value is realistically at stake.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain. We help organizations move from AI curiosity to operational deployment — we architect, build, and operationalize through to production. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide coverage across time zones. Our approach is practical, cost-conscious, and AI-forward — and for a specialized firm, we keep AI on the commercial front end so your engineering stays entirely your own.', { spaceAfter: 140 }),
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
  subHeader('What we verified vs. what we set aside'),
  bullet('Company, business lines, 1999 founding, and co-founders (Glenn Reynolds, President, PE; Gary Curtis; Dean Hackbarth) — VERIFIED (gossamersf.com; Tracxn; LinkedIn).'),
  bullet('LAT 73 specifications (7.3 m aperture, >100x concentration, 3M Solar Mirror Film, >25% field-cost reduction, >99% NREL-verified intercept) and the 2011–2012 debut with 3M — VERIFIED (3M / Business Wire; Solar Power World; pv-magazine; Design News; NREL documentation).'),
  bullet('Demonstration at Sunray Energy, Daggett, CA (Cogentrix Energy), power to Southern California Edison — VERIFIED (press; Reuters Events / CSP Today).'),
  bullet('Martin Next Generation Solar Energy Center for Florida Power & Light — Power Engineering Project of the Year (2011); Long Beach Pike pedestrian bridge (2002) — VERIFIED (press).'),
  bullet('Multiple U.S. patents naming Glenn Reynolds; NREL verification; SunShot-era context — VERIFIED (USPTO; NREL). Whether Gossamer was a direct DOE SunShot grant awardee vs. a participant — NOT confirmed; not claimed here.'),
  bullet('Current revenue, current headcount beyond public 2–10 listings, whether the firm is actively taking projects, current pipeline, current 3M relationship, and the present HQ city (sources list Laguna Hills, Long Beach, and Huntington Beach) — NOT independently confirmed; listed as questions in Section 14.'),
  bullet('All market sizes and growth rates — attributed to third-party market research as industry context, NOT as Gossamer’s results, and presented as order-of-magnitude given wide variance between sources.'),
  subHeader('Selected sources'),
  ...[
    'Gossamer — company website (about, management team, architectural systems, and news pages): gossamersf.com.',
    'LAT 73 / 3M — 3M and Business Wire (May 2012 inauguration); Solar Power World; pv-magazine; Design News; Reuters Events (CSP Today); Renewable Energy Magazine (2009, SunLock / MiniTruss).',
    'Performance & IP — NREL collector documentation; USPTO patent records naming Glenn Reynolds; references to Sandia testing.',
    'Projects & recognition — Power Engineering (Project of the Year, Martin NGSEC for FPL); Cogentrix Energy / Sunray Energy (Daggett); Long Beach Pike pedestrian bridge.',
    'Firm profile — LinkedIn (Gossamer Space Frames); Tracxn; D&B / ZoomInfo (size and funding indicators only).',
    'Market context — Future Market Insights, Mordor Intelligence, Research and Markets (parabolic-trough and CSP market sizing); MDPI / SolarPACES (solar industrial process heat, 2024).',
    'Competitors — SkyFuel (SpaceFrame / SkyTrough); Abengoa Solar (SpaceTube, DOE-referenced); Rioglass / Flabeg; MERO-TSK; Geometrica.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and sector figures describe the wider CSP and space-frame environment; figures specific to Gossamer are drawn from public sources and the company’s own statements, with anything uncertain deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
  p('Timing note: the LAT 73 debut with 3M took place in 2011–2012; we found no public evidence of LAT activity after that period and treat it as a proven platform, not recent news. No Gossamer revenue figure is cited because none is public and verified.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Gossamer Space Frames  ·  AI Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  949.379.8499  ·  CONFIDENTIAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const allChildren = [
  ...cover, ...toc, ...methodNote, ...execSummary,
  ...section1, ...section2, ...section3, ...section4, ...section5,
  ...section6, ...section7, ...section8, ...section9, ...section10,
  ...section11, ...section12, ...section13, ...section14, ...section15,
  ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'Gossamer Space Frames — AI Growth Blueprint', description: 'A facts-only AI Growth blueprint for Gossamer Space Frames, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Gossamer-Space-Frames-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
