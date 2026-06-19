// Franklin Educational Services (FES) - AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY. LIVE TOC field + Word-COM convert.
// Thesis: a founder-led educational-therapy practice - AI to give the clinical team time back + help the
// right families find them, on a strict data-privacy foundation for children's records.
// NOTE: built as an internal ASSET. Franklin opted out of email outreach - do NOT email them this.

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
  centered('Franklin Educational', { size: 46, color: DARK_CHARCOAL, bold: true, after: 60 }),
  centered('Services', { size: 46, color: DARK_CHARCOAL, bold: true, after: 120 }),
  centered('Educational Therapy & Tutoring  ·  Los Angeles', { size: 20, color: CORE_BLUE, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Helping more of the right families find you, and giving your team their time back, with AI built for the privacy children’s data demands', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(760),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Franklin Educational Services, Inc.', { size: 22, color: DARK_CHARCOAL, bold: true, after: 30 }),
  centered('Dr. Daniel Franklin, Founder & Clinical Director', { size: 20, color: BRAND_GREY, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR FRANKLIN EDUCATIONAL SERVICES', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('A short, honest framing before anything else.', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Privacy comes first here, not last. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your practice handles children’s learning, behavioral, and diagnostic information. Any AI near that work has to clear a higher bar, so we put it up front (Section 03): private, governed systems, a qualified person reviewing anything that reaches a child or parent, and a child’s records never entering a public AI tool.' }]),
  bulletRuns([{ text: 'It works on two fronts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Growth (help the right families find you and turn Dr. Franklin’s authority into reach) and efficiency (give your educators their time back from documentation). Both matter to a practice like yours; the efficiency half is often the easier place to start.' }]),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Franklin is drawn from your website, Dr. Franklin’s published work, and public records, cited in the Appendix. We have not assumed your enrollment, your team size, your systems, or your finances.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer needs information only your team has, we ask rather than guess. Section 13 is a short questionnaire that completes the analysis.' }]),
  calloutBox('The lens for everything that follows',
    ['Franklin Educational Services is, at its heart, a relationship between an expert educator and a child who learns differently. Nothing in this plan changes that, or wants to. AI here has two jobs only: protect and extend your educators’ time, and help the families who need you most actually find you.',
     'It does not teach the child. Your people do.'], CORE_ORANGE),
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
  p('Franklin Educational Services is one of the most established educational-therapy and tutoring practices on the Westside, built over decades on something that does not scale easily: Dr. Daniel Franklin’s expertise and the trust of the families who rely on it. The numbers below capture that foundation.', { spaceAfter: 120 }),
  kpiRow([
    { number: '1987', label: 'Serving Los Angeles families since', color: CORE_BLUE },
    { number: 'Harvard · UCLA', label: 'Founder’s training (PhD, BCET)', color: CORE_ORANGE },
    { number: '80+', label: 'National talks (Google, IDA, CHADD)', color: TEAL },
    { number: 'K–College', label: 'Students served, plus adults', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'The opportunity is not to change the work, it is to protect and extend it. ', bold: true, color: DARK_CHARCOAL }, { text: 'A practice like Franklin’s runs into two predictable limits as it grows: expert educators spend hours on documentation instead of teaching, and the families who most need a specialist like Dr. Franklin often cannot find one in the noise of generic tutoring. This generation of AI is unusually good at both problems, and almost nothing else in this plan matters more than those two.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'So the blueprint works on two fronts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Efficiency (Section 09): draft session notes, progress reports, and assessment summaries from your educators’ input, so they review and sign off in minutes instead of writing for hours, and capture Dr. Franklin’s "Academic Management" method so the whole team delivers it consistently. Growth (Section 08): make Franklin the answer parents and professionals find when they search for help with dyslexia, ADHD, or a learning difference, and turn Dr. Franklin’s book and 80-plus talks into an authority engine that does the same.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'And it rests on one non-negotiable foundation. ', bold: true, color: DARK_CHARCOAL }, { text: 'Children’s data is sensitive in a way that demands more than the average business AI deployment: private, governed systems, a human in the loop on anything a family sees, and never feeding a child’s records into a public tool. Section 03 makes that the floor everything else stands on, led by a CISSP-certified security practice.' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'A practice built on one expert’s judgment has a natural ceiling: his hours, and his ability to be found. AI cannot replace that judgment, and should not try. What it can do is give your educators back the time they lose to paperwork, preserve the founder’s method for the team, and put Franklin in front of the families who are searching for exactly what you do.', CORE_ORANGE),
];

// ============================================================ SEC 01 - THE FAMILIES & WHY NOW
const section1 = [
  ...sectionHeader('The Families Franklin Serves, and Why Now', CORE_BLUE, '01'),
  p('The context below is about the families and the field Franklin works in, not claims about the practice, and it explains why an investment in efficiency and visibility pays now. Sources are in the Appendix.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'What Franklin does and where AI helps', 624),
  caption('Figure 01.0 - A founder-led practice turning expert help into outcomes for students who learn differently, on a foundation of strict privacy.'),
  h3('The need is large, and the search for help is hard'),
  p('A meaningful share of students learn differently, dyslexia, ADHD, dysgraphia, dyscalculia, autism, and processing differences are common, and the families affected are often anxious, motivated, and actively looking for an expert they can trust. The hard part for them is telling a true specialist apart from generic tutoring. Franklin is exactly the specialist they are looking for; the question is whether they can find it at the moment they start searching, which today increasingly means a search engine or an AI assistant.', { spaceAfter: 120 }),
  h3('The field is adopting AI fastest where the work is heaviest'),
  p('Across tutoring and special education, the clearest, most-proven use of AI is not teaching the student, it is taking the documentation load off the educator. Special-education teams report saving roughly two to four hours per case using AI to draft notes and reports for a human to review, and a majority find it useful for spotting patterns in a learner’s progress. The same tools help families see that progress through clearer updates. This is the low-risk, high-return entry point for a practice like Franklin’s.', { spaceAfter: 120 }),
  calloutBox('Why this matters now',
    'Two curves are crossing: parents are shifting how they search for specialists (toward AI answers), and AI has become genuinely good at the documentation that consumes your educators’ time. A premium practice that moves now, carefully and privately, can both reach more of the right families and free its experts to serve them, before the generic players figure it out.', TEAL),
];

// ============================================================ SEC 02 - WHAT WE VERIFIED
const section2 = [
  ...sectionHeader('What We Verified About Franklin', CORE_BLUE, '02'),
  p('Everything here is drawn from your website, Dr. Franklin’s published work, and public records (see Appendix). Where a figure is dated or uncertain, we say so, and we have not guessed at anything only your team would know.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founder & leader', bold: true }, 'Dr. Daniel Franklin, PhD, BCET, Founder, President, and Clinical Director. Master’s from the Harvard Graduate School of Education (Reading, Language & Learning Disabilities); PhD from UCLA in Education; Board Certified Educational Therapist; 30+ years across teaching, administration, consulting, and therapy.'],
      [{ text: 'Authority', bold: true }, 'Author of "Helping Your Child with Language-Based Learning Disabilities" (2018), built on an attachment-based approach to learning. 80+ national presentations (including Google, the International Dyslexia Association, and CHADD); featured on CNN/HLN and KTLA and in the documentary Unteachable.'],
      [{ text: 'What Franklin does', bold: true }, 'Educational therapy; tutoring and test prep (K-College, including AP/Honors); ADHD and executive-functioning coaching; fully-accredited one-to-one schooling; trauma-informed school companions; college and graduate-school transition coaching; educational consulting and advocacy; teacher training and parent coaching.'],
      [{ text: 'Specialties', bold: true }, 'Dyslexia, dyscalculia, dysgraphia, ADHD, autism, and auditory and visual processing differences.'],
      [{ text: 'Method', bold: true }, 'A proprietary "Academic Management" approach combining educational-therapy principles (executive function) with subject expertise, building organization, planning, study skills, memory, and self-advocacy.'],
      [{ text: 'Team & standards', bold: true }, 'Tutors hold a BA/BS or higher and are rigorously vetted (background and reference checks, multiple interviews, writing samples, routine evaluations). A NASP-Approved Provider of continuing education.'],
      [{ text: 'Footprint', bold: true }, 'Brentwood Learning Center, 11777 San Vicente Blvd, Ste 129, Los Angeles; serving Los Angeles and Orange County; in-person and online. Established 1987 (confirm exact at discovery).'],
      [{ text: 'What we did NOT assume', bold: true, color: CRITICAL }, 'Current enrollment, number of educators, the systems you run today, how documentation is handled, and any finances. These are the questions in Section 13.'],
    ], { headerColor: CORE_BLUE }),
];

// ============================================================ SEC 03 - PRIVACY FOUNDATION
const section3 = [
  ...sectionHeader('Protecting Children’s Data: The Privacy Foundation', CORE_BLUE, '03'),
  p('Most AI plans treat privacy as a closing caveat. For a practice serving children with learning differences, it is the starting condition, so it comes first. Any AI Franklin adopts must clear a higher bar than ordinary business software, and that bar is achievable.', { spaceAfter: 130 }),
  p('The data your work generates, learning profiles, diagnoses, assessment results, session notes, and family information, is exactly the kind that must never be exposed. Your own correspondence already treats it as privileged. Three commitments make AI safe to use here, each straightforward:', { spaceAfter: 110 }),
  buildTable(
    [{ label: 'The commitment', weight: 30 }, { label: 'What it means in practice', weight: 44 }, { label: 'How Technijian does it', weight: 26 }],
    [
      [{ text: 'Private, governed systems', bold: true, color: CORE_BLUE }, 'A child’s records never enter a public AI tool (ChatGPT, free apps). AI runs in a private, access-controlled environment where your data stays yours and is never used to train someone else’s model.', 'Private deployments; CISSP-led security.'],
      [{ text: 'A human in the loop', bold: true, color: CORE_BLUE }, 'AI drafts; a qualified educator reviews and approves anything that reaches a child or parent. Nothing clinical or student-facing ships unread.', 'Review built into every workflow.'],
      [{ text: 'Accountability by design', bold: true, color: CORE_BLUE }, 'Every AI tool has a named owner and a known data source, so you always know what is running and on what information.', 'A simple AI inventory and governance.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  pRuns([{ text: 'This is also a competitive advantage, not just a safeguard. ', bold: true, color: DARK_CHARCOAL }, { text: 'Parents choosing a practice for their child are buying trust above all. A practice that can say, plainly, "we use AI to serve you better and your child’s information never leaves our protected systems" is more trustworthy than both the firm that uses AI carelessly and the one that refuses to modernize at all. Done right, privacy is part of the pitch.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 04 - PEOPLE (personas)
const section4 = [
  ...sectionHeader('The People Franklin Serves', CORE_BLUE, '04'),
  p('A practice like Franklin’s does not have a sales funnel; it has people at the center of the work and the staff and partners around them. The most useful way to plan AI is around those stakeholders. These are research-based archetypes to confirm at discovery, not your records.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'The people Franklin serves and how AI helps each', 600),
  caption('Figure 04.0 - Stakeholders around the work. The "AI helps" line is the opportunity, to calibrate with your team.'),
  buildTable(
    [{ label: 'Who', weight: 24 }, { label: 'What they need', weight: 42 }, { label: 'How AI helps (privately, human-reviewed)', weight: 34 }],
    [
      [{ text: 'The parent (the buyer)', bold: true, color: CORE_ORANGE }, 'Trust, real expertise, and progress they can see, for an anxious decision about their child.', 'Be findable in search and AI answers; a private intake assistant; clearer progress updates.'],
      [{ text: 'The student', bold: true, color: CORE_BLUE }, 'Personalized, confidence-building support and structure, always with a caring educator.', 'Adaptive practice and study tools that the educator directs, never AI alone with a child.'],
      [{ text: 'The educational therapist', bold: true, color: TEAL }, 'To spend their hours teaching, not writing notes, reports, and summaries.', 'Draft documentation from their input; they review and sign off in minutes.'],
      [{ text: 'The referral partner', bold: true, color: DARK_CHARCOAL }, 'Reliable communication and outcomes for the families they send (schools, psychologists, pediatricians).', 'Referral nurture and clear, professional outcome summaries.'],
      [{ text: 'Dr. Franklin', bold: true, color: CRITICAL }, 'To scale his impact and method without diluting quality, or burning himself out.', 'Capture the method into team playbooks; surface his authority; protect his time.'],
    ], { headerColor: CORE_BLUE }),
];

// ============================================================ SEC 05 - PEER LANDSCAPE
const section5 = [
  ...sectionHeader('How Tutoring & Special-Ed Practices Are Adopting AI', CORE_BLUE, '05'),
  p('Franklin does not compete on volume, so the useful comparison is positional: where is the field on AI, and where could a premium practice choose to sit? The field is moving fastest exactly where the lowest risk and clearest value are, documentation and personalized practice.', { spaceAfter: 130 }),
  diagramImage(diagBuf('peer.png'), 'How tutoring and special-ed practices are adopting AI', 600),
  caption('Figure 05.0 - A strategic read, not a measured score. Examples are representative directions of travel across comparable practices, not guarantees.'),
  buildTable(
    [{ label: 'What practices are doing', weight: 32 }, { label: 'The example', weight: 42 }, { label: 'Read-across for Franklin', weight: 26 }],
    [
      [{ text: 'AI for documentation', bold: true, color: CORE_BLUE }, 'Special-education teams report saving ~2-4 hours per case using AI to draft notes, reports, and parent communication for a human to review.', 'The fastest, safest place to start.'],
      [{ text: 'Pattern-spotting in progress', bold: true, color: CORE_BLUE }, '~57% of special-ed teachers find AI helpful for surfacing patterns in a learner’s data and suggesting next steps.', 'Sharper, faster progress reviews.'],
      [{ text: 'Personalized practice', bold: true, color: CORE_BLUE }, 'Intelligent tutoring systems adapt practice to a student’s pace and pinpoint where they struggle, supporting (not replacing) the educator.', 'Educator-directed practice between sessions.'],
      [{ text: 'Parent communication', bold: true, color: CORE_BLUE }, 'AI-drafted progress summaries strengthen the home connection, with the explicit principle that technology complements the human touch.', 'Matches Dr. Franklin’s attachment-based philosophy.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The position available to Franklin',
    'Most private practices are still exploring; schools and tools are piloting and integrating. A respected, founder-led practice with real clinical depth can be the first-mover among premium practices, modernizing carefully and privately while keeping the human relationship that is its whole reason for being. That is a genuinely available, and durable, position.', CORE_ORANGE),
];

// ============================================================ SEC 06 - CAPABILITY PROOF
const section6 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '06'),
  p('Strategy is easy to write and hard to build. Each capability this plan relies on is something Technijian has already built, mapped to Franklin’s situation. Where a build is described by profile rather than a named client, it is scope and effort only.', { spaceAfter: 130 }),
  calloutBox('Proven build: AI Document Intelligence (days to minutes)',
    'What we built: a pipeline that reads, extracts from, and drafts complex documents in minutes instead of hours, with a person approving the result. How it applies to Franklin: draft session notes, progress reports, and assessment summaries from an educator’s input, so they review and sign off instead of writing from scratch. This is the highest-return, lowest-risk first step.', CORE_BLUE),
  calloutBox('Proven build: Knowledge-Capture Graph (Weaviate + Obsidian)',
    'What we built: an AI knowledge system that turns documents, recordings, and expert interviews into a searchable, reusable resource. How it applies: capture Dr. Franklin’s "Academic Management" method into team playbooks, so a vetted staff delivers it consistently and new educators onboard faster, reducing the key-person risk every founder-led practice carries.', CRITICAL),
  calloutBox('Proven build: Multi-Agent Search & Content (My SEO + My AI)',
    'What we built: a multi-model platform that wins visibility in search and AI assistants and turns expertise into authority content. How it applies: make Franklin the cited answer for "dyslexia tutor Los Angeles," "educational therapist Brentwood," and similar searches, and turn Dr. Franklin’s book and 80+ talks into parent guides, articles, and video.', TEAL),
  calloutBox('Proven build: AI-Native Software Delivery (My Dev)',
    'What we built: an AI-native development practice that ships custom tools several times faster than traditional teams. How it applies: a private intake assistant, a parent progress portal, and faster tutor-to-student matching, each inside your governed, private environment.', CORE_ORANGE),
  subHeader('Two honest guardrails (because they always come up)'),
  pRuns([{ text: 'On spend: ', bold: true, color: DARK_CHARCOAL }, { text: 'we do not wire every task to one expensive AI model. We run a routed, multi-model platform, roughly seven models across three providers and three tiers, sending each task to the cheapest model that can do it well, typically 60-80% below the price of routing everything to a premium model. ' }, { text: 'On control and privacy: ', bold: true, color: DARK_CHARCOAL }, { text: 'AI drafts and finds; your educators decide, teach, and sign off. Children’s records stay inside private, governed systems and never train an outside model. For a practice whose entire value is trust, that discipline is the only way AI is allowed near the work.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 07 - UNDERSTANDING AI
const section7 = [
  ...sectionHeader('Understanding AI - A Field Guide for Franklin Leadership', CORE_BLUE, '07'),
  p('Plain-English and independent. You do not need to know how AI is built to use it well, you need to know what it can and cannot do, and how to adopt it responsibly. Every framing here is anchored to an outside source, named in the Appendix.', { spaceAfter: 120 }),
  h3('1. What AI actually is (and is not)'),
  pRuns([{ text: 'The most useful distinction, from Anthropic’s engineering guidance, is between ', }, { text: 'automation', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a set path, predictable and low-risk, "draft this progress note from these observations") and ', }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself, flexible but needing oversight). The operating principle is to use the simplest thing that works: start with simple, supervised automations that pay off fast, and add more autonomy only where it clearly earns it. For a child-serving practice, that conservative posture is exactly right.' }], { spaceAfter: 120 }),
  h3('2. Where Franklin sits today'),
  p('On a widely used five-stage view of AI maturity (consistent with the Gartner and Google Cloud frameworks), most established practices, Franklin included, sit at the first or second rung. That is not a criticism; it is where nearly everyone in education is. The goal of this engagement is to move Franklin up a rung or two deliberately and safely, starting with the back office, not to turn it into a technology company.', { spaceAfter: 120 }),
  h3('3. Adopting AI responsibly - three risks every leader manages'),
  p('The U.S. National Institute of Standards and Technology offers an impartial way to think about this; its AI Risk Management Framework organizes the job into four functions: govern, map, measure, and manage. In plain terms, three risks matter most here, and each has a clear answer:', { spaceAfter: 100 }),
  bulletRuns([{ text: 'Confident wrong answers (hallucination). ', bold: true, color: DARK_CHARCOAL }, { text: 'AI can state something false with total confidence, unacceptable in anything that reaches a child or parent. The answer is human-in-the-loop: a qualified educator approves it.' }]),
  bulletRuns([{ text: 'Data leakage. ', bold: true, color: DARK_CHARCOAL }, { text: 'A child’s records must never go into public AI tools. The answer is private, governed deployments where your data stays yours, the heart of Section 03.' }]),
  bulletRuns([{ text: 'Accountability. ', bold: true, color: DARK_CHARCOAL }, { text: 'Every AI tool should have a named owner and a known data source. The answer is a simple inventory, straight from the framework’s govern function.' }]),
  h3('4. Why a partner, rather than hiring or do-it-yourself tools'),
  p('Do-it-yourself tools are inexpensive but leave you to assemble and govern everything, and to own the three risks above, with children’s data. Hiring a qualified AI specialist is expensive (typically well over $180,000 a year) and scarce, and one person rarely covers strategy, building, security, and governance at once. A partner brings all four at a fraction of that, with builds already proven and security led by a CISSP-certified team. For a focused practice, the partner path is usually the practical one.', { spaceAfter: 120 }),
  calloutBox('The reassuring truth',
    'Nothing here asks Franklin to trust a machine with a child or to become a tech company. The approach is the opposite: simple, governed, private automations that give your expert educators more time and reach, with a person always in the loop on anything that matters.', TEAL),
];

// ============================================================ SEC 08 - TWO FRONTS (engine)
const section8 = [
  ...sectionHeader('The Two Fronts: Grow the Practice & Give the Team Time Back', CORE_BLUE, '08'),
  p('The engine has two connected fronts on a single privacy foundation. Grow brings the right families in; Run gives your educators their hours back. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Franklin two-front AI engine', 624),
  caption('Figure 08.0 - Grow the practice (left) and run it lighter (right), everything resting on the data-privacy foundation.'),
  buildTable(
    [{ label: 'Capability', weight: 26 }, { label: 'Use case for Franklin', weight: 48 }, { label: 'Technijian service', weight: 26 }],
    [
      [{ text: 'Be found by families', bold: true, color: CORE_ORANGE }, 'Be the cited answer when a parent searches or asks an AI assistant for help with dyslexia, ADHD, or a learning difference in LA or OC.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      [{ text: 'Authority content engine', bold: true, color: CORE_ORANGE }, 'Turn Dr. Franklin’s book and 80+ talks into parent guides, articles, and short video that build trust and visibility.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Referral nurture', bold: true, color: CORE_ORANGE }, 'Keep schools, psychologists, and pediatricians informed and engaged so referrals keep flowing.', { text: 'My AI Lead Gen', bold: true, color: CORE_BLUE }],
      [{ text: 'Capture inquiries', bold: true, color: CORE_ORANGE }, 'A private intake assistant that answers common parent questions and routes serious inquiries to the team.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      [{ text: 'Notes & reports', bold: true, color: TEAL }, 'Draft session notes and progress reports from an educator’s input; a qualified person reviews and signs off.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Assessment summaries', bold: true, color: TEAL }, 'Turn evaluation data into clear, parent-friendly summaries, reviewed by staff before they go out.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Capture the method', bold: true, color: TEAL }, 'Preserve the Academic Management method as team playbooks and faster, more consistent onboarding.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      [{ text: 'Tutor-student matching', bold: true, color: TEAL }, 'Match the right specialist to each child faster, with the team making the final call.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'Everything above runs inside the private, governed environment from Section 03, and a human reviews anything a child or parent sees. AI finds, drafts, and organizes; your educators teach, decide, and sign off. This amplifies the team and Dr. Franklin’s method; it does not replace the human relationship at the center of the work.', TEAL),
];

// ============================================================ SEC 09 - EFFICIENCY
const section9 = [
  ...sectionHeader('Inside Franklin: AI-Powered Documentation & Method', CORE_BLUE, '09'),
  p('The growth front brings families in; this is the other half, the daily work of running the practice, where AI quietly returns hours and protects quality. Every row maps a real Franklin workflow to an AI integration and the proven Technijian build behind it, all inside the private environment from Section 03.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Workflow today', weight: 28 }, { label: 'AI integration (human-reviewed)', weight: 42 }, { label: 'Proven Technijian build', weight: 30 }],
    [
      [{ text: 'Session notes & progress reports', bold: true, color: DARK_CHARCOAL }, 'Draft from the educator’s observations; they review and sign off in minutes instead of writing for hours.', 'AI Document Intelligence (days to minutes).'],
      [{ text: 'Assessment write-ups', bold: true, color: DARK_CHARCOAL }, 'Turn evaluation data into clear, parent-friendly summaries, reviewed before they go out.', 'AI Document Intelligence.'],
      [{ text: 'The founder’s method', bold: true, color: DARK_CHARCOAL }, 'Capture "Academic Management" into searchable playbooks for consistent delivery and onboarding.', 'Knowledge-Capture Graph (Weaviate + Obsidian).'],
      [{ text: 'Parent communication', bold: true, color: DARK_CHARCOAL }, 'Draft progress updates and answers to common questions for staff to personalize and approve.', 'AI assistant + document intelligence.'],
      [{ text: 'Matching & scheduling', bold: true, color: DARK_CHARCOAL }, 'Match the right specialist to each child and ease scheduling friction, team decides.', 'AI-native custom build (My Dev).'],
      [{ text: 'Inquiry intake', bold: true, color: DARK_CHARCOAL }, 'A private assistant handles first questions and routes serious inquiries without adding front-desk load.', 'AI assistant + intake build.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  subHeader('What that returns, in plain terms'),
  p('We measure this the way a practice does, in educator hours recovered, quality protected, and more families served, not a flashy multiple. The directions below are conservative, to confirm at discovery.', { spaceAfter: 110 }),
  buildTable(
    [{ label: 'Efficiency lever', weight: 42 }, { label: 'Conservative direction (confirm at discovery)', weight: 58 }],
    [
      ['Documentation time', 'Hours per educator returned each week from notes, reports, and summaries, redirected to teaching.'],
      ['Report turnaround', 'Faster, clearer progress reports and assessment summaries for parents and schools.'],
      ['Consistency & onboarding', 'The founder’s method captured once, delivered consistently, with faster ramp for new educators.'],
      ['Capacity', 'More students served with the same expert team, because experts spend their time on expert work.'],
      ['Reach', 'More of the right families finding Franklin at the moment they start searching.'],
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
      [{ text: 'Land - prove it', bold: true, color: CORE_BLUE }, 'A leadership AI workshop, a private documentation pilot with one or two educators (notes and reports), and a visibility audit. Small, fast, and privacy-safe.', 'Workshop + pilot'],
      [{ text: 'Expand - both fronts', bold: true, color: CORE_BLUE }, 'Roll documentation across the team, stand up the authority content engine and search visibility, and add the private intake assistant.', 'My AI + My SEO + My Dev'],
      [{ text: 'Scale - the method', bold: true, color: CORE_BLUE }, 'Capture the Academic Management method as playbooks, add a parent progress portal, referral nurture, and a steady review engine.', 'My AI + My Dev + advisory'],
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
  pRuns([{ text: 'How we would model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a practice like Franklin’s, the return is concrete: educator hours recovered from documentation (often the single biggest line), more families reached and served, and the founder’s method preserved and scaled. Modeled conservatively, the time the entry program gives back to a few educators, plus a small number of additional families served, typically covers the entry several times over, before counting the harder-to-quantify value of consistency and protected founder time. We will put real numbers against these once discovery gives us yours (Section 13); until then, any single figure would be a guess, and we do not guess.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 11 - ROADMAP
const section11 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '11'),
  p('Staged so each phase delivers value before the next begins, and sequenced to start where the risk is lowest and the value is fastest: private documentation help.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 11.0 - Start privacy-safe with a documentation pilot, grow the practice, then scale Dr. Franklin’s method. Scope calibrates at discovery.'),
  p('The first ninety days are deliberately low-risk: stand up a private, governed AI environment and pilot session-note drafting with one or two educators, while auditing how families find Franklin today. The next ninety build both fronts, the authority content engine and search visibility, and documentation help rolled out to the whole team. The final stretch scales the founder’s method into playbooks and adds a parent progress portal, referral nurture, and a steady review engine, so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 12 - QUICK WINS
const section12 = [
  ...sectionHeader('Quick Wins - Start This Week', CORE_BLUE, '12'),
  p('Five actions Franklin can take now, with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Ask an AI assistant for "the best educational therapist in West LA." ', bold: true, color: DARK_CHARCOAL }, { text: 'See whether Franklin appears. That free check is your visibility baseline at the moment parents now start searching.' }]),
  bulletRuns([{ text: 'Time one educator’s documentation for a week. ', bold: true, color: DARK_CHARCOAL }, { text: 'Measure the hours spent on notes, reports, and summaries. That number is the size of the easiest, fastest win, and the baseline you will measure against.' }]),
  bulletRuns([{ text: 'List five things from Dr. Franklin’s book or talks that parents always ask about. ', bold: true, color: DARK_CHARCOAL }, { text: 'Each is a parent guide or short video waiting to be made, and the seed of the authority engine.' }]),
  bulletRuns([{ text: 'Check your Google presence and reviews for the Brentwood center. ', bold: true, color: DARK_CHARCOAL }, { text: 'Confirm hours, services, and that a searching parent finds an accurate, reassuring picture.' }]),
  bulletRuns([{ text: 'Write down the one thing every new educator must learn about "Academic Management." ', bold: true, color: DARK_CHARCOAL }, { text: 'That is the first entry in the method playbook AI can help you capture and scale.' }]),
];

// ============================================================ SEC 13 - QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section13 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '13'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers, from a short conversation, replace every estimate above with your real numbers. "We are not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A - The practice & priorities', CORE_BLUE, [
    'What is the most pressing priority right now, freeing educator time, reaching more families, scaling the method, or something else?',
    'Roughly how many students and families do you serve, and how many educators and tutors are on the team?',
    'Where is demand strongest, and where do you most wish you had more capacity?',
  ]),
  ...qGroup('B - Documentation & method', CORE_ORANGE, [
    'How are session notes, progress reports, and assessment summaries handled today, and roughly how many hours do they take per educator?',
    'How is the "Academic Management" method taught to new educators today, and how long does onboarding take?',
    'What documentation or reporting is most draining, or most often late?',
  ]),
  ...qGroup('C - Reach & reputation', TEAL, [
    'How do families find Franklin today, search, referrals, reputation, Dr. Franklin’s book and talks?',
    'Which referral relationships matter most (schools, psychologists, pediatricians), and how are they nurtured now?',
    'What would meaningfully more of the right families finding you be worth to the practice?',
  ]),
  ...qGroup('D - Systems, privacy & decision', CHARTREUSE, [
    'What systems run scheduling, records, and billing today, and how is student data protected now?',
    'Are there places you would never want AI involved (likely anything student-facing) versus back-office work?',
    'Who decides on an investment like this, and is Orange County in scope alongside Los Angeles?',
  ]),
  spacer(80),
  calloutBox('The easiest way to answer',
    'Most of these take a 30-minute conversation. We can also run a short, no-obligation, privacy-safe readiness check, your visibility today, the hours documentation is costing, and the single highest-value place to start, and hand you the findings whether or not we work together.', CORE_ORANGE),
];

// ============================================================ SEC 14 - WHAT HAPPENS NEXT
const section14 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '14'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short conversation, walk this blueprint and the Section 13 questions, focused on freeing your educators’ time first.', 'A call. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'A free, privacy-safe readiness check, your visibility, the hours documentation costs, and the best place to start.', 'None; the findings are yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand, start with the private documentation pilot, then add the two fronts as each proves out.', 'You decide, with real numbers.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('A useful read, on your terms',
    ['Franklin has built something rare: an expert practice families trust with their children. This plan is about protecting that, by giving your educators their time back and helping more of the right families find you, with AI that keeps a child’s information private and a person always in the loop.',
     'Ravi Jain, Founder & CEO  -  rjain@technijian.com  -  949.379.8499  -  technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy, security, and implementation firm founded in 2000 by Ravi Jain. We help organizations put AI to practical work, through AI-era search and answer-engine optimization (My SEO), AI lead generation and outreach (My AI Lead Gen), AI knowledge and automation (My AI), and AI-native software development (My Dev), and we architect, build, and operate through to production rather than handing over a slide deck. Our dedicated pod model assigns a named team to each client, with offices in Irvine, California and Panchkula, India for coverage across time zones. Our approach is cybersecurity-first and AI-forward, with private, governed deployments, which is exactly what a practice handling children’s data requires.', { spaceAfter: 140 }),
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
  bullet('Dr. Daniel Franklin’s credentials (Harvard master’s, UCLA PhD, BCET), authorship of "Helping Your Child with Language-Based Learning Disabilities" (2018), 80+ national presentations, and media features - VERIFIED via franklined.com, danielfranklinphd.com, the publisher, and public profiles.'),
  bullet('Services, specialties, the "Academic Management" method, tutor standards, NASP-approved status, and the Brentwood location serving LA + OC - VERIFIED on franklined.com.'),
  bullet('Founding year (1987) - per public listing; the site says "more than 25 years." Listed as a discovery confirm.'),
  bullet('Current enrollment, team size, systems in use, how documentation is handled today, and any finances - NOT confirmed; listed as questions in Section 13.'),
  subHeader('Selected sources'),
  ...[
    'Franklin Educational Services - franklined.com (services, about, method); Dr. Daniel Franklin - danielfranklinphd.com, Learning & the Brain, SpeakerHub; "Helping Your Child with Language-Based Learning Disabilities" (New Harbinger, 2018).',
    'AI in special education & tutoring - EdTech Magazine (2026); Council for Exceptional Children; Structural Learning (2026) on documentation time saved and pattern-spotting; ETC Journal and Faculty Focus (2026) on personalized tutoring and assessment.',
    'AI framing - MIT Sloan (AI literacy); Anthropic ("Building Effective Agents"); Gartner and Google Cloud AI maturity frameworks; NIST AI Risk Management Framework (Govern/Map/Measure/Manage).',
  ].map(s => bullet(s)),
  spacer(120),
  p('Field figures are about the wider tutoring and special-education landscape; figures specific to Franklin are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Franklin Educational Services  ·  AI for Growth & Efficiency', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Franklin Educational Services - AI Growth & Integration Blueprint', description: 'A facts-only AI blueprint for Franklin Educational Services, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Franklin-Educational-Services-AI-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
