// Operating Engineers Training Trust (OETT) - AI for Training & Recruitment Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY. LIVE TOC field + Word-COM convert.
// Thesis: a 60-year training trust facing a retirement cliff - AI to capture expertise + recruit the next generation.
// Post-decline reframe: prospect has an IT Manager; this is NOT managed IT - it is AI for training & recruitment.

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
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 42, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
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
  centered('AI FOR TRAINING', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('& RECRUITMENT', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(120),
  centered('Operating Engineers', { size: 46, color: DARK_CHARCOAL, bold: true, after: 60 }),
  centered('Training Trust', { size: 46, color: DARK_CHARCOAL, bold: true, after: 120 }),
  centered('IUOE Local 12  ·  Southern California', { size: 20, color: CORE_BLUE, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Capturing a generation of expertise, and recruiting the next one, with AI', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(820),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Operating Engineers Training Trust', { size: 22, color: DARK_CHARCOAL, bold: true, after: 30 }),
  centered('Renee Gadberry, Curriculum Coordinator', { size: 20, color: BRAND_GREY, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR THE OPERATING ENGINEERS TRAINING TRUST', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('A quick, honest framing first, because the note that started this conversation pitched the wrong thing.', { spaceAfter: 120 }),
  bulletRuns([{ text: 'This is not a pitch for managed IT. ', bold: true, color: DARK_CHARCOAL }, { text: 'You told us you have an IT Manager, and you were right to. Keeping the network, the portals, and the help desk running is their job, and this blueprint does not touch it. This is a different conversation: how AI helps a training organization capture the expertise it is about to lose to retirement, and recruit the next generation of operators, none of which is your IT Manager’s job.' }]),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about OETT is drawn from your own website (oett.net) and public records, and is cited in the Appendix. We have not assumed your enrollment, your budget, your staffing, or your current systems.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer needs information only your team has, we ask rather than guess. Section 13 is a short questionnaire that completes the analysis.' }]),
  bulletRuns([{ text: 'It works on two fronts at once. ', bold: true, color: DARK_CHARCOAL }, { text: 'Training (Section 09) and recruitment (Section 08) get equal weight, because a training trust lives and dies on both: the quality of what it teaches, and the pipeline of who it teaches.' }]),
  calloutBox('Why a training organization, specifically',
    ['Most AI conversations start with a sales team or a marketing funnel. Yours should not. The highest-value AI in a 60-year apprenticeship trust is not about selling anything; it is about keeping the irreplaceable knowledge of your veteran operators before they retire, building and updating curriculum faster, and reaching the next generation of apprentices in the channels they actually use.',
     'That is the lens for everything that follows.'], CORE_ORANGE),
];

// ============================================================ TOC (live field)
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list and choose Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents - right-click and choose "Update Field" to populate page numbers.', { hyperlink: true, headingStyleRange: '1-1' }),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('The Operating Engineers Training Trust has done something most organizations only talk about: for sixty years it has turned people with no experience into the skilled operators who build California’s roads, dams, tunnels, and high-rises, at no cost to the apprentice. That mission is now meeting two forces at once, and both are squarely in range of what AI does well.', { spaceAfter: 120 }),
  p('The numbers below frame the moment, your heritage and reach on one side, and the workforce cliff the whole trade is facing on the other:', { spaceAfter: 120 }),
  kpiRow([
    { number: '1964', label: 'Training operators since (60 years)', color: CORE_BLUE },
    { number: '6,000', label: 'On-the-job hours per apprenticeship', color: CORE_ORANGE },
    { number: '6', label: 'Training sites across the region', color: TEAL },
    { number: '~41%', label: 'Of the construction workforce projected to retire by 2031', color: CRITICAL },
  ]),
  spacer(160),
  pRuns([{ text: 'The first force is a retirement cliff. ', bold: true, color: DARK_CHARCOAL }, { text: 'The construction industry needs roughly 349,000 net new workers in 2026 alone, and more than half of that is simply to replace people retiring (Associated Builders and Contractors). The National Center for Construction Education and Research projects that about 41% of today’s construction workforce will retire by 2031. For a training trust, that is both the threat and the opportunity: your veteran master operators carry decades of judgment that today lives only in their heads, and your job is to refill the pipeline behind them faster than it empties.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'So this blueprint works on two motions, weighted equally. ', bold: true, color: DARK_CHARCOAL }, { text: 'Train smarter (Section 09): capture a retiring operator’s expertise into durable curriculum, draft and update courses and assessments in a fraction of the time, and give apprentices modern study support before they ever climb into a half-million-dollar machine. Recruit the next generation (Section 08): make OETT the answer a career-changer or a veteran finds when they search how to get into the trades, and reach them in their own language. AI supports your instructors and coordinators; it does not replace the hands-on, seat-time training that only your people can deliver.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The timing is unusually good. ', bold: true, color: DARK_CHARCOAL }, { text: 'In 2026 the U.S. Department of Labor launched a national initiative to bring AI into Registered Apprenticeships, including the traditional trades. The category is moving; almost no heavy-equipment training trust in Southern California has moved yet. That is a first-mover position worth holding.' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'A training trust is, at its core, a knowledge-transfer machine: it moves expertise from people who have it to people who need it. That is exactly what this generation of AI is best at accelerating. The opportunity is not to replace your instructors; it is to make sure the knowledge in their heads outlasts their careers, and to fill the seats in front of them.', CORE_ORANGE),
];

// ============================================================ SEC 01 - WORKFORCE REALITY
const section1 = [
  ...sectionHeader('The Workforce Reality OETT Trains Into', CORE_BLUE, '01'),
  p('The forces below are facts about the construction workforce OETT serves, not claims about the trust, and together they explain why an investment in capturing knowledge and recruiting talent pays now rather than later. Sources are in the Appendix.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'What OETT does and the knowledge cliff ahead', 624),
  caption('Figure 01.0 - A 60-year trust turning people into skilled operators, just as a generation of expertise prepares to retire.'),
  h3('A retirement cliff is hitting the trades'),
  p('The construction industry needs an estimated 349,000 net new workers in 2026, rising toward 456,000 in 2027 (Associated Builders and Contractors), and more than half of the 2026 figure is needed simply to replace retirees rather than to staff new work. The workforce is aging: the average construction worker is about 42.5 years old, only roughly 16% are under 35, and the National Center for Construction Education and Research projects that around 41% of the current workforce will retire by 2031. When a veteran operator leaves, decades of jobsite judgment, how a crane behaves in wind, the early signs a machine is about to fail, leave with them.', { spaceAfter: 120 }),
  h3('A training trust sits at the center of both problems'),
  p('Two problems, one institution. The pipeline-in problem is recruitment: filling apprenticeship seats with the next generation, including the career-changers and veterans the trades increasingly depend on. The knowledge problem is retention: making sure the expertise of retiring journeypersons and instructors becomes durable curriculum instead of walking out the door. OETT is the organization positioned to solve both, and AI is unusually well-suited to each.', { spaceAfter: 120 }),
  h3('And the moment is right'),
  p('In 2026 the U.S. Department of Labor launched a national initiative to integrate AI into Registered Apprenticeships, explicitly including traditional trades and infrastructure occupations. Federal attention, and in some cases funding, is flowing toward exactly this work. A training trust that moves now is aligned with where workforce policy is heading, not fighting it.', { spaceAfter: 120 }),
  calloutBox('Why this matters now',
    'The retirement wave is not a someday risk; it is a 2026-to-2031 window that is already open. Every veteran operator who retires without a structured way to pass on what they know is knowledge the trust cannot get back. The cheapest, highest-return moment to start capturing it is before the next retirement, not after.', TEAL),
];

// ============================================================ SEC 02 - WHAT WE VERIFIED
const section2 = [
  ...sectionHeader('What We Verified About OETT', CORE_BLUE, '02'),
  p('Everything here is drawn from your own website and public records (see Appendix). Where a figure is dated or uncertain, we say so, and we have not guessed at anything only your team would know.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'What OETT is', bold: true }, 'A non-profit training trust established in 1964 by IUOE Local 12 and its signatory contractors to fund and deliver training for apprentices and journeypersons. Trust funds purchase training equipment, hire instructors, and provide educational resources.'],
      [{ text: 'Scale & heritage', bold: true }, 'Since 1964 the training fund has trained more than 6,000 apprentices (as reported as of 2016). Local 12 is one of the largest and most influential locals in the IUOE.'],
      [{ text: 'Footprint', bold: true }, 'Home office in Whittier, CA, with six training facilities across Southern California (Whittier, Devore, Rincon, Bakersfield, Camarillo, and the San Luis Obispo area) and six apprentice districts spanning Los Angeles, Ventura/Santa Barbara/SLO, Kern, San Diego, the Inland Empire, and Orange County.'],
      [{ text: 'What operators do', bold: true }, 'Operate heavy construction equipment, cranes, concrete pumps, pile drivers, drilling rigs, grade checking, dredging, and plant equipment, on freeways, dams, tunnels, airports, and high-rises.'],
      [{ text: 'Programs', bold: true }, 'A work-study apprenticeship (6,000 OJT hours plus six semesters of classroom, typically 3-4 years), plus journeyperson continuing education, Inspection CEU, crane operations, pipeline training, hazmat, remote-control equipment, and drone training.'],
      [{ text: 'Apprenticeship terms', bold: true }, 'No cost for the training; apprentices join Local 12. Entry requires passing an exam, with applications opening roughly every two years. Apprentices begin at 60% of journeyperson scale, stepping up as milestones are met.'],
      [{ text: 'Existing systems', bold: true }, 'Online application portal, separate apprentice and journeyperson accounts, and class registration, all run today (and supported by your IT Manager). The opportunity is the AI layer on top, not the infrastructure underneath.'],
      [{ text: 'What we did NOT assume', bold: true, color: CRITICAL }, 'Current enrollment, number of instructors, training budget, graduation rates, and how curriculum and reporting are handled today. These are the questions in Section 13.'],
    ], { headerColor: CORE_BLUE }),
];

// ============================================================ SEC 03 - APPRENTICESHIP & COMPLIANCE ARCHITECTURE
const section3 = [
  ...sectionHeader('The Apprenticeship & Compliance Architecture', CORE_BLUE, '03'),
  p('A training trust works inside a structured, audited apprenticeship system, and that structure is where much of the administrative load, and several of the clearest AI opportunities, live.', { spaceAfter: 130 }),
  p('Registered apprenticeship is overseen by California’s Division of Apprenticeship Standards (DAS), within the Department of Industrial Relations, which sets the standards for wages, hours, and the skills required for journeyperson certification, with federal oversight through the Department of Labor’s apprenticeship data system. Programs and signatory contractors generate a documentation trail, award and dispatch notices, certified records, training-fund reporting, that must stay audit-ready and funding-eligible, and California is moving it toward electronic submission.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Where the work lives', weight: 30 }, { label: 'The administrative reality', weight: 44 }, { label: 'The AI opportunity', weight: 26 }],
    [
      [{ text: 'Apprentice records', bold: true, color: CORE_BLUE }, 'Hours, milestones, wage-step progression, and classroom credit tracked across a 3-4 year program for many apprentices at once.', 'Validate and reconcile records automatically.'],
      [{ text: 'Curriculum & standards', bold: true, color: CORE_BLUE }, 'Course content and assessments kept current with equipment, codes, and certification requirements across 9+ equipment families.', 'Draft and update faster, with sign-off.'],
      [{ text: 'CEU & certification', bold: true, color: CORE_BLUE }, 'Continuing-education and inspection credits tracked for journeypersons across six sites.', 'Automated tracking and reminders.'],
      [{ text: 'State & federal reporting', bold: true, color: CORE_BLUE }, 'DAS and federal apprenticeship reporting, increasingly electronic, that must reconcile and survive audit.', 'Pre-fill, check, and assemble audit-ready.'],
    ], { headerColor: CORE_BLUE }),
  spacer(60),
  pRuns([{ text: 'The honest read: ', bold: true, color: TEAL }, { text: 'none of this replaces the judgment of your coordinators or the DAS relationship your team manages. The point is narrower, a meaningful slice of the reporting and record-keeping load is structured, repetitive, and rule-bound, exactly the kind of work AI can pre-fill and check so your people spend their time on training, not paperwork.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 04 - PEOPLE OETT SERVES (personas)
const section4 = [
  ...sectionHeader('The People OETT Serves', CORE_BLUE, '04'),
  p('A training trust does not have customers; it has people moving through a trade, and the people who guide them. The most useful way to plan AI is around those stakeholders and what each one needs. These are research-based archetypes to confirm at discovery, not your roster.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'The people OETT serves and how AI helps each', 600),
  caption('Figure 04.0 - Stakeholders along the operating-engineer lifecycle. The "AI helps" line is the opportunity, to calibrate with your team.'),
  buildTable(
    [{ label: 'Who', weight: 24 }, { label: 'What they need', weight: 42 }, { label: 'How AI helps', weight: 34 }],
    [
      [{ text: 'Prospective apprentice', bold: true, color: CORE_ORANGE }, 'A clear, fast way to discover the program, understand it, apply, and prepare, often in a second language.', 'Be findable in search and AI answers; a 24/7 multilingual application assistant; exam preparation.'],
      [{ text: 'Apprentice in-program', bold: true, color: CORE_BLUE }, 'Study support and confidence across a 3-4 year, 6,000-hour program, including before live seat time.', 'A study assistant, scenario and simulation prep, multilingual support, progress nudges.'],
      [{ text: 'Curriculum coordinator', bold: true, color: TEAL }, 'Faster ways to build and update courses, assessments, and safety modules across many equipment families and sites.', 'Draft and refresh curriculum and assessments; apply standards changes quickly, with sign-off.'],
      [{ text: 'Veteran master operator', bold: true, color: CRITICAL }, 'A way to pass on decades of tacit, jobsite judgment that today lives only in their head and hands.', 'Structured knowledge capture that turns expertise into durable, searchable curriculum.'],
      [{ text: 'Director of training', bold: true, color: DARK_CHARCOAL }, 'Visibility across six sites and a lighter state and federal reporting burden.', 'Cross-site dashboards, reporting automation, outcome analytics.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'Which of these matters most, and whether there are stakeholders we have not named (signatory contractors who hire your graduates, for instance), is a discovery question. We would rather build the plan around your real people than around our assumptions about them.', CORE_ORANGE),
];

// ============================================================ SEC 05 - PEER LANDSCAPE
const section5 = [
  ...sectionHeader('How Peer Training Organizations Are Adopting AI', CORE_BLUE, '05'),
  p('OETT does not compete for customers, so the useful comparison is not competitive, it is positional: where do training organizations sit on AI adoption, and where could OETT choose to sit? The answer is that the category is moving, a federal tailwind is pushing it, and the heavy-equipment training world has barely started.', { spaceAfter: 130 }),
  diagramImage(diagBuf('peer.png'), 'Where training organizations sit on AI adoption', 600),
  caption('Figure 05.0 - A strategic read, not a measured score. Examples are representative directions of travel across comparable training organizations, not guarantees.'),
  buildTable(
    [{ label: 'What peers are doing', weight: 32 }, { label: 'The example', weight: 42 }, { label: 'Read-across for OETT', weight: 26 }],
    [
      [{ text: 'Federal push into apprenticeship AI', bold: true, color: CORE_BLUE }, 'In 2026 the U.S. Department of Labor launched a national initiative to integrate AI into Registered Apprenticeships, including traditional trades and infrastructure occupations.', 'A tailwind, and possibly funding, for moving now.'],
      [{ text: 'Registered AI apprenticeships', bold: true, color: CORE_BLUE }, 'NC State’s AI Academy partnered with Apprenti on the first nationwide registered AI apprenticeship with national standards.', 'Apprenticeship bodies are building AI into programs.'],
      [{ text: 'AI simulators for hands-on trades', bold: true, color: CORE_BLUE }, 'Studies of AI-guided simulation training (for example in welding) report improved accuracy and faster learning versus conventional methods.', 'Directly analogous to equipment-sim prep before seat time.'],
      [{ text: 'GenAI for instructors', bold: true, color: CORE_BLUE }, 'Documented frameworks help vocational instructors use AI to generate teaching materials and lesson plans.', 'The curriculum-coordinator opportunity, already proven elsewhere.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space',
    'Most heavy-equipment training trusts and JATCs are still in the exploring stage. The colleges, the registered AI programs, and the simulation researchers are moving ahead. OETT can decide to be the first-mover in Southern California heavy-equipment training, rather than the organization that adopts AI once everyone else has, which is a genuinely available position and a fast one to claim.', CORE_ORANGE),
];

// ============================================================ SEC 06 - CAPABILITY PROOF
const section6 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '06'),
  p('Strategy is easy to write and hard to build. This section is the credibility check: each capability the plan relies on is something Technijian has already built, mapped to OETT’s specific situation. Where a build is described by profile rather than a named client, it is scope and effort only.', { spaceAfter: 130 }),
  calloutBox('Proven build: Knowledge-Capture Graph (Weaviate + Obsidian)',
    'What we built: an AI knowledge system that ingests documents, recordings, and expert interviews and makes the knowledge searchable and reusable. How it applies to OETT: sit with one or two retiring master operators, capture how they actually do the work, and turn it into durable, searchable training material, so the expertise outlasts the career. This is the single highest-value build for a trust facing a retirement wave.', CRITICAL),
  calloutBox('Proven build: AI Document Intelligence (days to minutes)',
    'What we built: a pipeline that reads, extracts from, and drafts complex documents in minutes instead of days, with a human approving the result. How it applies: draft and update curriculum and assessments from existing materials and changed standards, and assemble state and federal apprenticeship reporting into audit-ready records.', CORE_BLUE),
  calloutBox('Proven build: AI-Native Software Delivery (My Dev)',
    'What we built: an AI-native development practice that ships custom tools several times faster than traditional teams. How it applies: an apprentice study assistant, an exam-prep tool, and a cross-site dashboard that gives the Director of Training one view across all six locations.', TEAL),
  calloutBox('Proven build: Multi-Agent Search & AI Lead Gen',
    'What we built: a multi-model platform that wins visibility in search and AI assistants, plus an outreach engine that finds and reaches the right people. How it applies: make OETT the answer when someone searches how to become an operating engineer in California, and run recruitment campaigns to schools, veterans groups, and career-changers when application windows open.', CORE_ORANGE),
  subHeader('Two honest guardrails (because they always come up)'),
  pRuns([{ text: 'On spend: ', bold: true, color: DARK_CHARCOAL }, { text: 'we do not wire every task to one expensive AI model. We run a routed, multi-model platform, roughly seven models across three providers and three tiers, and send each task to the cheapest model that can do it well, which typically runs 60-80% below the price of routing everything to a premium model. ' }, { text: 'On control: ', bold: true, color: DARK_CHARCOAL }, { text: 'AI drafts, captures, and triages; your instructors and coordinators validate and own the content. Nothing about safety training or certification ships without a qualified person’s sign-off. For a trust whose reputation rides on the competence of the operators it certifies, that human-in-the-loop discipline is the only way AI is allowed near the curriculum.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 07 - UNDERSTANDING AI
const section7 = [
  ...sectionHeader('Understanding AI - A Field Guide for OETT Leadership', CORE_BLUE, '07'),
  p('This section is deliberately plain-English and independent. You do not need to know how AI is built to use it well, you need to know what it can and cannot do, and how to adopt it responsibly. Every framing here is anchored to an outside source, named in the Appendix.', { spaceAfter: 120 }),
  h3('1. What AI actually is (and what it is not)'),
  pRuns([{ text: 'The most useful distinction, from Anthropic’s engineering guidance, is between ', }, { text: 'automation', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a set path, predictable and low-risk, "draft this assessment from these standards") and ', }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself, flexible but needing oversight, "monitor the reporting and flag what is missing"). The operating principle is to use the simplest thing that works: start with simple automations that pay off fast, and add agents only where they clearly earn it. That is exactly how the roadmap in Section 11 is sequenced.' }], { spaceAfter: 120 }),
  h3('2. Where OETT sits today'),
  p('On a widely used five-stage view of AI maturity (consistent with the Gartner and Google Cloud frameworks), running from foundational to transformational, most established training organizations, OETT included, sit at the first or second rung today. That is not a criticism; it is where almost everyone in the trades is. The leaders are one or two rungs up, and the gap closes in months, not years. The goal of this engagement is to move OETT up two rungs deliberately, not to buy a product.', { spaceAfter: 120 }),
  h3('3. Adopting AI responsibly - three risks every leader manages'),
  p('The U.S. National Institute of Standards and Technology offers an impartial way to think about this, its AI Risk Management Framework organizes the job into four functions: govern, map, measure, and manage. In plain terms, three risks matter most, and each has a straightforward answer:', { spaceAfter: 100 }),
  bulletRuns([{ text: 'Confident wrong answers (hallucination). ', bold: true, color: DARK_CHARCOAL }, { text: 'AI can state something false with total confidence, which is unacceptable in safety training. The answer is human-in-the-loop: a qualified instructor signs off on anything that reaches an apprentice.' }]),
  bulletRuns([{ text: 'Data leakage. ', bold: true, color: DARK_CHARCOAL }, { text: 'Apprentice records and member information must never be fed into public AI tools. The answer is private, governed deployments where your data stays yours.' }]),
  bulletRuns([{ text: 'Accountability. ', bold: true, color: DARK_CHARCOAL }, { text: 'Every AI tool should have a named owner and a known data source. The answer is a simple inventory, straight from the framework’s govern function.' }]),
  h3('4. Why a partner, rather than hiring or do-it-yourself tools'),
  p('There are three ways to adopt AI. Do-it-yourself tools are inexpensive but leave you to assemble and govern everything, and to own the three risks above. Hiring a capable AI specialist is expensive (typically well over $180,000 a year) and scarce, and one person rarely covers strategy, building, security, and governance at once. A partner brings all four at a fraction of that, with builds already proven and security led by a CISSP-certified team. For a lean trust, the partner path is usually the practical one.', { spaceAfter: 120 }),
  calloutBox('The reassuring truth',
    'Nothing here asks OETT to become a technology company or to trust a machine with safety-critical judgment. The whole approach is the opposite: simple, governed automations that give your expert humans more time and reach, with a person always in the loop on anything that matters.', TEAL),
];

// ============================================================ SEC 08 - TWO MOTIONS (engine)
const section8 = [
  ...sectionHeader('Two Motions: Train Smarter & Recruit the Next Generation', CORE_BLUE, '08'),
  p('The engine has three connected columns. Recruit brings the next generation in; Train captures and scales your instructors’ expertise; Operate runs the trust with less administrative load. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'OETT two-motion AI engine', 624),
  caption('Figure 08.0 - Recruit the next generation (left); capture and scale expertise (center); run the trust with less admin (right).'),
  buildTable(
    [{ label: 'Capability', weight: 26 }, { label: 'Use case for OETT', weight: 48 }, { label: 'Technijian service', weight: 26 }],
    [
      [{ text: 'Be found by recruits', bold: true, color: CORE_ORANGE }, 'Be the cited answer when a prospect searches or asks an AI assistant how to become a crane or heavy-equipment operator in Southern California.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      [{ text: 'Application assistant', bold: true, color: CORE_ORANGE }, 'A 24/7 multilingual assistant that guides applicants through eligibility, the exam, and the process.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Recruitment campaigns', bold: true, color: CORE_ORANGE }, 'Targeted outreach to high schools, veterans groups, and career-changers when application windows open.', { text: 'My AI Lead Gen', bold: true, color: CORE_BLUE }],
      [{ text: 'Capture veteran expertise', bold: true, color: CRITICAL }, 'Turn a retiring master operator’s knowledge into durable, searchable curriculum before they leave.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Build curriculum faster', bold: true, color: TEAL }, 'Draft and update courses and assessments across equipment families, with instructor sign-off.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Apprentice study assistant', bold: true, color: TEAL }, 'Test prep, multilingual support, and scenario prep before live seat time on costly equipment.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      [{ text: 'Reporting automation', bold: true, color: DARK_CHARCOAL }, 'Pre-fill, validate, and assemble CEU and state/federal apprenticeship reporting into audit-ready records.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Cross-site dashboards', bold: true, color: DARK_CHARCOAL }, 'One view of training, completion, and outcomes across all six sites and districts.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'This adds an AI layer on top of your team; it does not replace anyone, and it does not touch the hands-on, seat-time training that only your instructors can deliver. AI finds, drafts, captures, and triages; your people validate and own the content and sign off on anything safety- or certification-related. It also sits cleanly alongside your IT Manager, who keeps the systems running, none of this is their job.', TEAL),
];

// ============================================================ SEC 09 - OPERATIONAL EFFICIENCY
const section9 = [
  ...sectionHeader('Inside OETT: AI-Powered Training & Operational Efficiency', CORE_BLUE, '09'),
  p('The recruitment motion grows the pipeline; this is the other half, the day-to-day work of building training and running the trust, where AI quietly returns hours and reduces risk. Every row maps a real OETT workflow to an AI integration and the proven Technijian build behind it.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Workflow today', weight: 28 }, { label: 'AI integration', weight: 42 }, { label: 'Proven Technijian build', weight: 30 }],
    [
      [{ text: 'Veteran knowledge in people’s heads', bold: true, color: DARK_CHARCOAL }, 'Capture a retiring operator’s expertise through guided interviews and recordings, turned into structured curriculum.', 'Knowledge-Capture Graph (Weaviate + Obsidian).'],
      [{ text: 'Curriculum & assessment creation', bold: true, color: DARK_CHARCOAL }, 'Draft and update courses, assessments, and safety modules from existing materials and changed standards.', 'AI Document Intelligence (days to minutes).'],
      [{ text: 'CEU & apprenticeship reporting', bold: true, color: DARK_CHARCOAL }, 'Pre-fill, validate, and reconcile records into audit-ready state and federal reporting.', 'Compliance documentation automation.'],
      [{ text: 'Cross-site coordination (6 sites)', bold: true, color: DARK_CHARCOAL }, 'One dashboard for enrollment, completion, and outcomes across every location.', 'Multi-location reporting and dashboard build.'],
      [{ text: 'Apprentice onboarding & study', bold: true, color: DARK_CHARCOAL }, 'A study assistant and scenario prep that shorten time-to-competence before seat time.', 'AI-native custom build (My Dev).'],
      [{ text: 'Applicant intake at window open', bold: true, color: DARK_CHARCOAL }, 'A multilingual assistant and screening that handle a surge of applicants without adding staff.', 'AI assistant + lead-gen engine.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  subHeader('What that returns, in plain terms'),
  p('We measure a training trust the way a training trust thinks, in hours recovered, knowledge retained, and people served, not a revenue multiple. The figures below are conservative directions to confirm at discovery, not promises.', { spaceAfter: 110 }),
  buildTable(
    [{ label: 'Efficiency lever', weight: 42 }, { label: 'Conservative direction (confirm at discovery)', weight: 58 }],
    [
      ['Curriculum update cycle', 'From weeks of manual revision toward days, as standards and equipment change.'],
      ['Instructor & coordinator hours', 'Hours returned each month from drafting, reporting, and record reconciliation, redirected to teaching.'],
      ['Knowledge retention', 'Each retiring expert captured is decades of judgment kept instead of lost, the highest-value and least reversible lever.'],
      ['Audit & reporting response', 'Faster, cleaner responses to DAS and federal reporting, with less last-minute scramble.'],
      ['Applicant reach & conversion', 'More qualified applicants reached and guided through to a completed application when windows open.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  calloutBox('The easier yes',
    'Recruitment is growth; this is protection, keeping what you already have and giving your people their time back. For many training organizations the efficiency half is the easier place to start, because the value shows up in the first quarter and in work the team already knows is painful.', CORE_ORANGE),
];

// ============================================================ SEC 10 - MISSION IMPACT & INVESTMENT
const section10 = [
  ...sectionHeader('Mission Impact & Investment', CORE_BLUE, '10'),
  p('We price from real, published service ranges and scope the rest at a quote, never an invented number. Because OETT is a member-funded trust rather than a business chasing revenue, we do not put a profit multiple on the work; we frame return the way a trust measures it, in expertise retained, hours recovered, and apprentices served.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path (start small, prove it, then grow)'),
  buildTable(
    [{ label: 'Phase', weight: 24 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement', weight: 26 }],
    [
      [{ text: 'Land - prove it', bold: true, color: CORE_BLUE }, 'An executive AI workshop, a fixed-scope knowledge-capture pilot on one or two retiring operators, and a recruitment-visibility audit. Small, fast, and low-risk.', 'Workshop + pilot'],
      [{ text: 'Expand - the two motions', bold: true, color: CORE_BLUE }, 'Curriculum AI assist, an apprentice study assistant, and the recruitment engine (search visibility plus an application assistant).', 'My AI + My SEO + My Dev'],
      [{ text: 'Scale - across six sites', bold: true, color: CORE_BLUE }, 'Roll the tools across all sites, add CEU and reporting automation, a cross-site dashboard, and a searchable knowledge base.', 'My Dev + advisory'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Service ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 42 }, { label: 'Indicative range', weight: 32 }, { label: 'Note', weight: 26 }],
    [
      ['Executive AI workshop', '~$5,000 (one-time)', 'published default'],
      ['Knowledge-capture pilot (fixed scope)', 'a fixed-scope build, estimated', 'confirmed at quote'],
      ['My SEO - recruitment visibility + content', '$500 - $1,500 / mo + add-ons', 'published tiers'],
      ['My AI - curriculum & advisory', 'scoped retainer', 'estimated, at quote'],
      ['My Dev - study assistant / dashboard', 'project-based', 'estimated, at quote'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we would model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a training trust, the return is not a revenue figure, it is instructor and coordinator hours recovered, faster and cleaner reporting, more qualified applicants reached, and, most importantly, the expertise of retiring operators kept instead of lost. We will put conservative numbers against those levers once discovery gives us your real figures (Section 13). Until then, any single return figure would be a guess, and we do not guess.' }], { spaceAfter: 120 }),
  calloutBox('A funding note worth exploring',
    'Because the federal government is actively funding AI in registered apprenticeships in 2026, and California maintains apprenticeship and workforce-development funding streams, part of the recruitment and readiness scope may be eligible for support beyond the trust’s own budget. We cannot promise eligibility, but we can help map which scope might qualify at discovery, so the plan is sized to what is actually fundable.', CORE_ORANGE),
];

// ============================================================ SEC 11 - ROADMAP
const section11 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '11'),
  p('Staged so each phase delivers something useful before the next begins, and sequenced to start with the lowest-risk, highest-meaning win: capturing knowledge that is otherwise about to be lost.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 11.0 - Start with a knowledge-capture pilot, build the two motions, then scale across all six sites. Scope calibrates at discovery.'),
  p('The first ninety days prove the idea cheaply: capture one or two retiring master operators into a first AI-built training module, and audit how recruits find OETT today and how curriculum is built. The next ninety build the two motions, curriculum AI assist with instructor sign-off, and the recruitment engine of search visibility plus a multilingual application assistant. The final stretch scales across all six sites, adding the apprentice study assistant, CEU and reporting automation, cross-site dashboards, and a searchable knowledge base, so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 12 - QUICK WINS
const section12 = [
  ...sectionHeader('Quick Wins - Start This Week', CORE_BLUE, '12'),
  p('Five actions OETT can take now, with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Record one retiring operator before they go. ', bold: true, color: DARK_CHARCOAL }, { text: 'Even a phone video of a veteran walking through how they really do a tricky lift or read a machine is the seed of a knowledge-capture module, and it is knowledge you cannot get back once they retire.' }]),
  bulletRuns([{ text: 'Ask an AI assistant how to become an operating engineer in Southern California. ', bold: true, color: DARK_CHARCOAL }, { text: 'See whether OETT shows up in the answer. That free check is your recruitment-visibility baseline.' }]),
  bulletRuns([{ text: 'Map the steps to update one course. ', bold: true, color: DARK_CHARCOAL }, { text: 'Pick a course a coordinator maintains and write down every step it takes to revise it. That process map is exactly what an AI assist is trained against.' }]),
  bulletRuns([{ text: 'Check your search and map presence. ', bold: true, color: DARK_CHARCOAL }, { text: 'Look up the Whittier office and each training site in Google. Confirm hours, addresses, and that prospective apprentices can actually find you.' }]),
  bulletRuns([{ text: 'Name the three hardest classifications to fill. ', bold: true, color: DARK_CHARCOAL }, { text: 'The classifications with the most demand or turnover are where recruitment AI should focus first. That list is the seed of the campaign.' }]),
];

// ============================================================ SEC 13 - QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section13 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '13'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers, from a short conversation, replace every estimate above with your real numbers. "We are not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A - Mission & priorities', CORE_BLUE, [
    'What is the most urgent priority right now, capturing retiring expertise, recruiting apprentices, easing the reporting load, or something else?',
    'Roughly how many apprentices are in the program today, and how many journeypersons do you train each year?',
    'Are there classifications or sites where demand most outstrips the operators you can supply?',
  ]),
  ...qGroup('B - Training & curriculum', CORE_ORANGE, [
    'How is curriculum built and updated today, and roughly how many hours does a typical revision take?',
    'How many instructors and curriculum coordinators are there, and how is veteran knowledge passed on now, if at all?',
    'Which courses or equipment families change most often, and where is the content hardest to keep current?',
  ]),
  ...qGroup('C - Recruitment & reach', TEAL, [
    'How do prospective apprentices find OETT today, and how often do application windows open?',
    'What share of applicants do not complete the application or pass the exam, and where do they fall off?',
    'Which audiences matter most for the next generation, high schools, veterans, career-changers, specific communities?',
  ]),
  ...qGroup('D - Operations, systems & decision', CHARTREUSE, [
    'How are CEU, certification, and DAS / federal reporting handled today, and how many staff hours does that take?',
    'What systems run the apprentice and journeyperson accounts, and is your IT Manager in-house or an outside provider?',
    'Who decides on an investment like this, the Director of Training, the Business Manager, or the Trustees, and is Southern Nevada in scope or separate?',
  ]),
  spacer(80),
  calloutBox('The easiest way to answer',
    'Most of these take a 30-minute conversation. We can also run a short, no-obligation readiness check, your recruitment visibility, a quick look at one curriculum workflow, and the single highest-value knowledge-capture target, and hand you the findings whether or not we work together.', CORE_ORANGE),
];

// ============================================================ SEC 14 - WHAT HAPPENS NEXT
const section14 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '14'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short conversation, walk this blueprint and the Section 13 questions, focused on training and recruitment, not IT.', 'A call. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'A free readiness check, recruitment visibility, one curriculum workflow, and your highest-value knowledge-capture target.', 'None; the findings are yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand, start with the knowledge-capture pilot, then add the two motions as each proves out.', 'You decide, with real numbers.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('No pitch - just a useful read',
    ['You were right that you have IT covered. This is a different conversation: how a 60-year training trust keeps the expertise it is about to lose, and recruits the operators California needs next. If that is worth 30 minutes, we would value your read on this plan, and the readiness check is yours either way.',
     'Ravi Jain, Founder & CEO  -  rjain@technijian.com  -  949.379.8499  -  technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy, security, and implementation firm founded in 2000 by Ravi Jain. We help organizations put AI to practical work, through AI-era search and answer-engine optimization (My SEO), AI lead generation and outreach (My AI Lead Gen), AI knowledge and automation (My AI), and AI-native software development (My Dev), and we architect, build, and operate through to production rather than handing over a slide deck. Our dedicated pod model assigns a named team to each client, with offices in Irvine, California and Panchkula, India for coverage across time zones. Our approach is cybersecurity-first and AI-forward, with private, governed deployments.', { spaceAfter: 140 }),
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
  bullet('OETT mission, 1964 founding, six training facilities, apprenticeship structure (6,000 OJT hours + six semesters), programs, and apprenticeship terms - VERIFIED on the live site (oett.net) and public records.'),
  bullet('That the trust has trained more than 6,000 apprentices - reported as of 2016; current totals were not published and are listed as a discovery item.'),
  bullet('Current enrollment, instructor and coordinator headcount, training budget, graduation and exam-pass rates, and how curriculum and reporting are handled today - NOT confirmed; listed as questions in Section 13.'),
  bullet('That OETT has an IT Manager and runs application/account systems today - stated by OETT; the scope of that role is a discovery item so we stay clearly out of it.'),
  subHeader('Selected sources'),
  ...[
    'OETT - live site, course, apprenticeship, FAQ, and coordinator pages (oett.net); IUOE Local 12 background (Ballotpedia; oefi.org).',
    'Workforce - Associated Builders and Contractors and Associated General Contractors (net new construction workers needed, 2026-2027); National Center for Construction Education and Research (retirement projection to 2031); industry workforce reporting (ConstructConnect, Construction Dive).',
    'AI in apprenticeship & training - U.S. Department of Labor / Employment and Training Administration initiative to integrate AI into Registered Apprenticeships (2026); NC State AI Academy with Apprenti; peer-reviewed studies on AI/simulation in vocational training; CSET Georgetown, "The State of AI-Related Apprenticeships."',
    'Compliance - California Division of Apprenticeship Standards (DIR); federal registered-apprenticeship reporting; registered-apprenticeship compliance guidance (2026).',
    'AI framing - MIT Sloan (AI literacy); Anthropic ("Building Effective Agents"); Gartner and Google Cloud AI maturity frameworks; NIST AI Risk Management Framework (Govern/Map/Measure/Manage).',
  ].map(s => bullet(s)),
  spacer(120),
  p('Workforce and industry figures are facts about the wider construction and training landscape; figures specific to OETT are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Operating Engineers Training Trust  ·  AI for Training & Recruitment', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Operating Engineers Training Trust - AI for Training & Recruitment Blueprint', description: 'A facts-only AI blueprint for the Operating Engineers Training Trust (IUOE Local 12), prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Operating-Engineers-Training-Trust-AI-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
