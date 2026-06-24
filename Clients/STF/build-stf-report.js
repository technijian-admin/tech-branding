// Shoes That Fit (STF) — AI Growth & IT Readiness Blueprint (HYBRID)
// Technijian-branded DOCX builder. FACTS-ONLY discipline: verified facts only,
// self-reported figures attributed, estimates labeled, unknowns -> Questions section.
// Mission-respectful nonprofit voice. HYBRID framing: protect what the $776K gift built
// (IT/security foundation) THEN grow the partner engine with AI. The outreach contact
// (Nekeda Newell-Hall, Deputy CEO External Affairs) confirmed she does NOT own IT, so this
// is built for whoever leads technology + growth — and the growth half is in her wheelhouse.

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
const TODAY = 'June 23, 2026';
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
  centered('AI GROWTH & IT READINESS BLUEPRINT', { size: 26, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('Shoes That Fit', { size: 52, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'How to protect a record gift and a year of scaling — then grow the partner engine, win more grants, and reach more children — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(820),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Amy Fass, CEO & Executive Director, and the Shoes That Fit Leadership Team', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR SHOES THAT FIT LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...sectionHeader('How to Read This Blueprint', CORE_BLUE, ''),
  calloutBox('First — this is built for whoever leads technology and growth at Shoes That Fit',
    ['When we reached out, Nekeda Newell-Hall kindly let us know she does not manage your IT. That was helpful — it tells us exactly who this is, and is not, for. So we built this for your leadership team and whoever owns technology decisions, not for any one inbox.',
     'It also works on two fronts at once. The first is protective: a record $776,000 gift and a year of scaling raise the stakes on securing the money and the donor data behind it. The second is growth: using AI to grow the corporate-partner engine, win more grants, and reach more children — work that sits squarely in the External Affairs lane, and is easy to share with the right colleague.'], CORE_ORANGE),
  p('This blueprint was prepared from public research, before any conversation about your internal numbers or systems. It holds itself to a simple discipline:', { spaceBefore: 120, spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Shoes That Fit is drawn from your own website, your IRS Form 990, Charity Navigator, reputable press, and partner sites, and is cited in the Appendix. Where a figure is something the organization reports about itself, we say so.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Sector statistics and ranges are clearly marked as market context — never presented as your results. The numbers that matter for a plan come from a short discovery conversation.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your current technology and security setup is not public, so we have assumed nothing about it. Where an answer requires information only your team has, we ask rather than guess — Section 15 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('A few notes for accuracy',
    ['The record gift was reported by Shoes That Fit and the wire services as "over $776,000"; one local outlet rounded it to $766,000. We use $776,000+, and we footnote the difference.',
     'We list Nekeda Newell-Hall by her current site title, Deputy CEO, External Affairs; some third-party databases still show an earlier title. And because your IT and security posture is not public, every statement about it in this document is framed as a question to confirm, not a claim.',
     'That is the standard of evidence you should expect from every Technijian deliverable.'], TEAL),
];

// ============================================================ TOC
function tocRow(n, t, pages, o = {}) {
  const { bold = false } = o;
  return new Paragraph({ spacing: { before: 50, after: 50 }, tabStops: [
    { type: TabStopType.LEFT, position: 600 },
    { type: TabStopType.RIGHT, position: CONTENT_W, leader: LeaderType.DOT },
  ], children: [
    new TextRun({ text: n || '·', size: 22, bold: true, color: CORE_ORANGE, font: FONT_HEAD }),
    new TextRun({ text: '\t' + t, size: 22, bold, color: DARK_CHARCOAL, font: FONT_BODY }),
    new TextRun({ text: '\t' + String(pages), size: 22, color: DARK_CHARCOAL, font: FONT_HEAD }),
  ] });
}
const tocClarifier = new Paragraph({
  spacing: { before: 0, after: 60 },
  children: [new TextRun({ text: 'Sixteen sections across the full document. The orange figures are section numbers; the figures on the right are the pages each section spans.', size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })],
});
const tocHeaderRow = new Paragraph({
  spacing: { before: 80, after: 40 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LIGHT_GREY } },
  tabStops: [{ type: TabStopType.LEFT, position: 600 }, { type: TabStopType.RIGHT, position: CONTENT_W }],
  children: [
    new TextRun({ text: '#', size: 16, bold: true, color: BRAND_GREY, font: FONT_HEAD }),
    new TextRun({ text: '\tSECTION', size: 16, bold: true, color: BRAND_GREY, font: FONT_HEAD }),
    new TextRun({ text: '\tPAGES', size: 16, bold: true, color: BRAND_GREY, font: FONT_HEAD }),
  ],
});
const toc = [
  ...sectionHeader('Contents', CORE_BLUE, ''), spacer(40),
  tocClarifier, tocHeaderRow,
  tocRow('', 'How to Read This Blueprint', '3–4'),
  tocRow('', 'Executive Summary', '5–6'),
  ...[
    ['01', 'The Organization & Mission', '7–8'],
    ['02', 'How Shoes That Fit Creates & Sustains Impact', '9–10'],
    ['03', 'The Moment — A Record Gift and a Year of Scaling', '11–12'],
    ['04', 'Protect What You’ve Built — IT & Security Readiness', '13–15'],
    ['05', 'Where Growth & Capacity Live', '16'],
    ['06', 'The Supporter & Partner Relationships', '17–18'],
    ['07', 'The Funding & Visibility Landscape', '19–20'],
    ['08', 'Brand & Digital Presence Audit', '21–22'],
    ['09', 'Technijian Capability Proof', '23–24'],
    ['10', 'Understanding AI — A Field Guide for Leadership', '25–26'],
    ['11', 'The AI Growth Engine', '27–28'],
    ['12', 'Mission Impact & Investment', '29–30'],
    ['13', 'Implementation Roadmap', '31'],
    ['14', 'Quick Wins — Start This Week', '32'],
    ['15', 'Questions to Complete the Analysis', '33–34'],
    ['16', 'What Happens Next', '35'],
  ].map(([n, t, pg]) => tocRow(n, t, pg)),
  tocRow('', 'About Technijian', '36'),
  tocRow('', 'Appendix — Sources & What Remains to Confirm', '37–38'),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Since 1992, Shoes That Fit has given children across the country brand-new athletic shoes so they can go to school "with dignity and joy, ready to learn, play, and thrive." The model is grassroots and elegant: a sponsoring group is matched to a partner school, the school measures each child for size and fit, and the sponsor provides exactly what that child needs. From its Claremont headquarters and a new Shoe Bank, the organization now reaches roughly 218,000 children a year across all 50 states and more than 2,100 communities, and has distributed over three million pairs of shoes since it began.', { spaceAfter: 120 }),
  kpiRow([
    { number: '1992', label: 'Founded · national 501(c)(3)', color: CORE_BLUE },
    { number: '~218K', label: 'Children served per year, all 50 states', color: CORE_ORANGE },
    { number: '3M+', label: 'Pairs of new shoes since 1992', color: TEAL },
    { number: '$776K+', label: 'Largest-ever gift · Stater Bros., June 2026', color: GREEN },
  ]),
  spacer(160),
  p('This blueprint works on two fronts, because this moment calls for both. In June 2026, a 12-day Stater Bros. Charities campaign delivered the largest single donation in the organization’s history — over $776,000 for new sneakers this fall. That visibility, a year of scaling into a new warehouse, and a fiscal year in which the organization deliberately spent more than it raised all point to the same need: protect what has been built, and grow what comes next.', { spaceAfter: 120 }),
  pRuns([{ text: 'Front one — protect. ', bold: true, color: DARK_CHARCOAL }, { text: 'A nonprofit that holds donor data, processes card gifts, and moves money with corporate partners is exactly the kind of organization criminals target — and a widely publicized windfall is the kind of event that draws them. The foundation in Section 04 is practical and right-sized: verify payments against wire fraud, secure identities and devices, migrate cleanly through the 2025 Microsoft nonprofit-licensing change, and know where donor data lives. It begins with one free risk assessment, the same one we run for our managed clients.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — grow. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your corporate and celebrity partnerships — Nordstrom, Stater Bros., Capital Group, the Dodgers and Rams — are the engine, and AI strengthens it: finding look-alike corporate prospects, drafting grants faster, re-engaging lapsed donors, and producing the per-partner impact reports that win the next gift. Across both fronts the rule never changes: AI drafts and researches, security protects, and a person owns every relationship and verifies every claim.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'And it is built to be affordable. ', bold: true, color: DARK_CHARCOAL }, { text: 'Much of the enabling technology is free or discounted to 501(c)(3) organizations — including up to $10,000 a month in free Google search advertising and nonprofit-priced Microsoft tools. We scope the rest to your budget and grant cycles, and we measure return the way a mission measures it — in dollars raised, staff hours recovered, children reached, and risk avoided — not a revenue multiple (Section 12 and Section 15).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'A record gift is both an opportunity and a target. The same engine that protects the $776,000 and the donor trust behind it can also grow the partner relationships that produced it — so a small team of 44 can secure more, raise more, and reach more children without adding overhead. That is the two-front case this blueprint makes.', CORE_ORANGE),
];

// ============================================================ SEC 01 — ORGANIZATION & MISSION
const section1 = [
  ...sectionHeader('The Organization & Mission', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Shoes That Fit’s own website, its IRS Form 990, Charity Navigator, reputable press, and partner organizations (see Appendix). Figures the organization reports about itself are attributed as such.', { spaceAfter: 130 }),
  subHeader('A simple idea, run at national scale'),
  p('Shoes That Fit gives children in need brand-new athletic shoes — and other essentials — so they can attend school ready to learn, play, and thrive. It frames the work in terms of dignity: a child who has shoes that fit is not singled out, can take part in recess and P.E., and shows up with confidence. From a single idea in 1992 it has grown into a national organization reaching all 50 states.', { spaceAfter: 120 }),
  subHeader('How the model works'),
  p('The mechanic is grassroots sponsor-matching, and it is the heart of why the organization is trusted. Shoes That Fit pairs a sponsoring group — a business, school, church, civic club, or a group of friends — with a partner school. Teachers and staff at the school identify the children most in need and measure each one for size and fit. The sponsor then buys exactly what each child needs, and the shoes are delivered to the school. Sponsors choose how many children to help; a community fundraiser starts at about 30 children.', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Step', weight: 22 }, { label: 'What happens', weight: 78 }],
    [
      [{ text: 'Match', bold: true, color: CORE_BLUE }, 'A sponsoring group is paired with a partner school in a community that needs support.'],
      [{ text: 'Measure', bold: true, color: CORE_BLUE }, 'School staff identify the children most in need and measure each child for the right size and fit.'],
      [{ text: 'Provide', bold: true, color: CORE_BLUE }, 'The sponsor funds exactly what each child needs — brand-new shoes, never used.'],
      [{ text: 'Deliver', bold: true, color: CORE_BLUE }, 'Shoes arrive at the school and reach the children with dignity, no child singled out.'],
      [{ text: 'Sustain', bold: true, color: CORE_BLUE }, 'A new 16,000 sq ft Shoe Bank warehouse lets the organization hold inventory and scale distribution.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Footprint, leadership, and scale (verified)'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founded', bold: true }, '1992; recognized as a 501(c)(3) public charity (IRS tax-exempt since August 1993). EIN 95-4425565; fiscal year ends June 30.'],
      [{ text: 'Headquarters', bold: true }, '150 W. 1st St., Suite 170, Claremont, CA 91711, plus a new 16,000 sq ft Shoe Bank warehouse.'],
      [{ text: 'Reach', bold: true }, 'All 50 states and Washington, D.C.; roughly 218,000 children a year across more than 2,100 communities (organization-reported).'],
      [{ text: 'Cumulative impact', bold: true }, 'More than 3 million pairs of new shoes distributed since 1992 (organization-reported).'],
      [{ text: 'Leadership', bold: true }, 'Amy Fass, CEO & Executive Director. Nekeda Newell-Hall, Deputy CEO, External Affairs (corporate, celebrity, and athlete partnerships; formerly Nike). Julie Stevens, Chief of Staff. Jeff Fueston, VP, Supply Chain.'],
      [{ text: 'Governance', bold: true }, 'An uncompensated board chaired by Lynn Mason (appointed March 2026); Charity Navigator rates the organization 99% (Four-Star), with an independent audit and audit committee confirmed.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your current number of partner schools; how school intake, sizing, and distribution are coordinated today; your donor and grant systems; how card gifts are processed; or who runs your technology and security. Most important for the protective half of this plan, your entire IT and security posture is private — so we treat it as a set of questions in Section 15, not a set of claims.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW IMPACT IS CREATED
const section2 = [
  ...sectionHeader('How Shoes That Fit Creates & Sustains Impact', CORE_BLUE, '02'),
  p('A nonprofit runs on a cycle: support comes in, the organization turns it into outcomes for children, and those outcomes — told well and measured honestly — bring in more support. AI can strengthen every stage of that cycle, and security protects the parts of it that move money and data — without changing the human heart of the work.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Shoes That Fit creates and sustains impact', 624),
  caption('Figure 02.0 — Support in (left), the organization and Shoe Bank (center), outcomes for children (right). The orange band shows where Technijian plugs in on two fronts: securing the money and data, and growing the mission with AI.'),
  buildTable(
    [{ label: 'Stage', weight: 24 }, { label: 'What it is today', weight: 46 }, { label: 'Where Technijian helps', weight: 30 }],
    [
      [{ text: 'Support in', bold: true, color: TEAL }, 'Corporate and celebrity partners, community sponsors, individual and legacy donors, foundations and grants — nearly all revenue is contributions.', 'Partner ABM, grants, donor intelligence; secure payments.'],
      [{ text: 'The work', bold: true, color: DARK_CHARCOAL }, 'Matching sponsors to schools, sizing children, and distributing new shoes from the Shoe Bank at 50-state scale.', 'School-intake & logistics automation; staff time recovered.'],
      [{ text: 'Outcomes', bold: true, color: CORE_BLUE }, 'Confidence, attendance, and dignity for children who arrive at school in shoes that fit.', 'Impact measurement; consistent per-partner reporting.'],
    ], { headerColor: TEAL }),
  spacer(80),
  pRuns([{ text: 'The relationships you already run are the anchor. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your partnerships, your donor base, and your school network are the assets — and the highest-value technology here does not replace them. Security protects the money and data flowing through them, and AI removes the repetitive work around them, so a small team keeps doing what only people can do: build trust and win the next gift.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — THE MOMENT
const section3 = [
  ...sectionHeader('The Moment — A Record Gift and a Year of Scaling', CORE_BLUE, '03'),
  p('Strategy should start from what is actually happening. Three facts about this moment shape everything that follows — and together they make the two-front case.', { spaceAfter: 130 }),
  h3('A record $776,000 gift, in public'),
  pRuns([{ text: 'In June 2026, a 12-day in-store campaign across Stater Bros. Markets raised over $776,000 for Shoes That Fit — the largest single donation in the organization’s history — to provide brand-new athletic shoes to hundreds of Southern California students this fall. It builds on a partnership that began in 2019. As CEO Amy Fass put it, ' }, { text: '"the simple gift of a pair of shoes has been shown to increase a child’s confidence, attendance, and performance at school."', italics: true }, { text: ' A gift this size, announced this publicly, is a milestone worth protecting as much as celebrating.' }], { spaceAfter: 120 }),
  h3('A year of scaling'),
  p('The organization recently opened a 16,000 sq ft Shoe Bank warehouse and reports serving roughly 218,000 children a year across all 50 states. Scaling inventory, logistics, and distribution to that level is an operational achievement — and it adds systems, data, and coordination that benefit from both automation and sound security.', { spaceAfter: 120 }),
  h3('A fiscal year that invested ahead of revenue'),
  pRuns([{ text: 'Per its IRS Form 990, in fiscal year 2025 (ended June 30) Shoes That Fit reported about $13.1 million in revenue against roughly $17.2 million in expenses — a deliberate draw-down after a strong prior year — with nearly all revenue coming from contributions. We have not confirmed the reasons with the organization (that is a discovery item), but the pattern is clear and common for a mission in a growth year: ' }, { text: 'deepening and protecting private and partner support is the priority, not optional.', bold: true, color: DARK_CHARCOAL }], { spaceAfter: 120 }),
  calloutBox('Why this matters for the plan',
    'A publicized windfall rewards better security; a scaling operation rewards automation; and a contribution-dependent, invest-ahead year rewards a stronger, AI-supported development engine. Every one of these forces points at a specific capability later in this blueprint — and none asks Shoes That Fit to change its mission, only to protect and extend the work it already does.', TEAL),
];

// ============================================================ SEC 04 — IT & SECURITY READINESS (HYBRID FRONT)
const section4 = [
  ...sectionHeader('Protect What You’ve Built — IT & Security Readiness', CORE_BLUE, '04'),
  p('This is the protective front, and it comes first because a record gift and a year of scaling raise the stakes on the basics. To be clear about method: your current technology and security setup is private, so nothing here is a claim about what you have or lack. It is a right-sized readiness map for an organization that holds donor data, processes card gifts, and moves money with corporate partners — with the open questions gathered in Section 15.', { spaceAfter: 130 }),
  diagramImage(diagBuf('readiness.png'), 'Two fronts — protect, then grow', 624),
  caption('Figure 04.0 — The same moment raises the stakes on both fronts. Foundation (left): secure the gifts, the donor data, and the team. Growth (right): grow the partner engine and donor base with AI. This section covers the foundation.'),
  subHeader('The risk is real, current, and not hypothetical'),
  kpiRow([
    { number: '$3.0B', label: 'Reported BEC / wire-fraud losses (FBI IC3, 2025)', color: CRITICAL },
    { number: '#2', label: 'Nonprofits: among the most-targeted sectors', color: CORE_ORANGE },
    { number: '68%', label: 'of nonprofits lack a documented incident-response plan', color: TEAL },
    { number: 'Jul 2025', label: 'Microsoft ended free nonprofit M365 grants', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  pRuns([{ text: 'Business email compromise — a criminal impersonating a leader, partner, or supplier to redirect a payment — is the single most costly category of cybercrime, with about $3.0 billion in reported U.S. losses in 2025 alone (FBI IC3). Nonprofits are now among the most-targeted and least-resourced sectors: industry research finds roughly ', }, { text: 'two-thirds have no documented incident-response plan', bold: true, color: DARK_CHARCOAL }, { text: ', even as attacks on the sector rise. An organization that holds donor information, processes card donations, and coordinates large transfers with corporate partners — right after a $776,000 gift made national news — fits the exact profile attackers look for. None of this is cause for alarm; it is cause for a few well-placed controls.' }], { spaceAfter: 120 }),
  subHeader('The readiness foundation — four practical layers'),
  buildTable(
    [{ label: 'Layer', weight: 24 }, { label: 'What it protects, and why it matters here', weight: 50 }, { label: 'Technijian service', weight: 26 }],
    [
      [{ text: 'Payment & email fraud controls', bold: true, color: CORE_BLUE }, 'Email authentication plus a simple, enforced verification step for any payment or banking-detail change — so a publicized gift or a partner transfer cannot be hijacked by an impersonation email.', { text: 'My Security', bold: true, color: CORE_BLUE }],
      [{ text: 'Identity & device security', bold: true, color: CORE_BLUE }, 'Multi-factor authentication everywhere, endpoint protection, and least-privilege access for a 44-person team — the controls that stop the most common account-takeover and ransomware paths.', { text: 'My Security', bold: true, color: CORE_BLUE }],
      [{ text: 'Microsoft 365 grant-cliff migration', bold: true, color: CORE_BLUE }, 'Microsoft ended free nonprofit M365 grants in July 2025; many nonprofits are re-licensing now. We make that transition clean and correctly configured, with no security gaps opened in transit.', { text: 'My Cloud', bold: true, color: CORE_BLUE }],
      [{ text: 'Donor data & payment hygiene', bold: true, color: CORE_BLUE }, 'Map where donor personal information and card data actually live, who can reach them, and how gifts are processed — the groundwork a funder, an auditor, or a board will eventually ask about.', { text: 'My Compliance', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  subHeader('Start with one free assessment — Nexus Assess'),
  pRuns([{ text: 'Before any engagement, the honest first step is to see the real picture. ', bold: true, color: DARK_CHARCOAL }, { text: 'Technijian will run one free Nexus Assess — the same risk assessment we run for our managed clients — covering internal and external vulnerabilities, a dark-web check for exposed staff credentials, and a Microsoft 365 security review. It comes back as a prioritized, plain-language remediation roadmap mapped to recognized frameworks (such as PCI-DSS for card data, SOC 2, and NIST). No commitment, no cost — just a clear baseline you can act on with us or on your own.' }], { spaceAfter: 120 }),
  calloutBox('An honest word on compliance',
    'Whether specific regimes apply to Shoes That Fit — for example PCI-DSS scope for card donations, or state privacy laws for donor data — depends on how gifts are actually processed and where data is stored, which we cannot see from the outside. We will not assert a compliance obligation we have not confirmed. What we can say plainly: the controls above are good practice for any organization holding donor and payment data, and the free assessment is the fastest way to know exactly where you stand.', CORE_ORANGE),
];

// ============================================================ SEC 05 — WHERE GROWTH LIVES
const section5 = [
  ...sectionHeader('Where Growth & Capacity Live', CORE_BLUE, '05'),
  p('With the foundation protected, the growth front comes into focus. For a mission like this, "growth" is not a single sales funnel — it is four levers, and AI supports each one while keeping people at the center of every relationship.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 26 }, { label: 'What it looks like for Shoes That Fit', weight: 48 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Grow the partner engine', bold: true, color: CORE_BLUE }, 'Find look-alike corporate and foundation prospects, spot renewal risk early, and deliver the per-partner impact reports that secure the next year’s gift.', 'Raise more'],
      [{ text: 'Win more grants', bold: true, color: CORE_BLUE }, 'Match the right funders and draft faster, so limited staff time goes to the funder-specific case for support, not the boilerplate.', 'Raise more'],
      [{ text: 'Reach & re-engage donors', bold: true, color: CORE_ORANGE }, 'Segment the donor base, re-engage lapsed and mid-tier givers, and personalize appeals in English and Spanish at a scale a small team cannot reach by hand.', 'Reach more'],
      [{ text: 'Recover staff time', bold: true, color: CORE_ORANGE }, 'Automate school intake, logistics coordination, reporting, and routine admin so hours return to partners, schools, and children.', 'Reach more'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first two levers grow the resources that fund the mission; the second two extend reach and give a small team back its time. None of them asks Shoes That Fit to be a different organization — they ask only that the work it already does be funded, sustained, and reported more fully.', { spaceAfter: 120 }),
];

// ============================================================ SEC 06 — STAKEHOLDERS (personas)
const section6 = [
  ...sectionHeader('The Supporter & Partner Relationships', CORE_BLUE, '06'),
  p('Shoes That Fit depends on a portfolio of relationships, and its strongest is the corporate-partnership engine led from External Affairs. The map below places the supporter archetypes by giving capacity and engagement depth — archetypes to calibrate against your real data at discovery, not named accounts. The children served are the purpose of the work, never a fundraising segment.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Supporter and partner map', 560),
  caption('Figure 06.0 — Supporter and partner archetypes by giving capacity and engagement. Bubble size approximates relative revenue weight; calibrate at discovery. The children served are the mission, not a segment to monetize.'),
  buildTable(
    [{ label: 'Relationship', weight: 26 }, { label: 'What they need', weight: 38 }, { label: 'How AI helps Shoes That Fit serve them', weight: 36 }],
    [
      [{ text: 'Corporate & celebrity partners', bold: true, color: CORE_ORANGE }, 'A real relationship and proof of impact worth renewing and expanding.', 'Look-alike prospecting, renewal-risk signals, and automated per-partner impact reports.'],
      [{ text: 'Foundations & grantmakers', bold: true, color: TEAL }, 'A strong fit, a credible case, and clean reporting.', 'Funder matching; faster drafts; consistent outcome reports.'],
      [{ text: 'Major-gift & legacy donors', bold: true, color: CORE_BLUE }, 'A personal relationship and a clear picture of impact.', 'Prospect research and pre-meeting briefs; staff own every conversation.'],
      [{ text: 'Community sponsors', bold: true, color: GREEN }, 'A simple way to adopt a school and see the result.', 'Self-serve sign-up; automated matching and thank-you stories.'],
      [{ text: 'Individual & recurring donors', bold: true, color: PASS }, 'Easy giving and steady, meaningful updates.', 'Segmented, personalized, bilingual stewardship.'],
      [{ text: 'Lapsed & mid-tier donors', bold: true, color: DARK_CHARCOAL }, 'A reason to return and to be remembered.', 'Re-engagement scoring and tailored win-back appeals.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your donor file. Which segments matter most — by revenue, by growth potential, by mission fit — is a discovery question. We would rather build the plan around your real supporters and partners than around our assumptions about them.', CORE_ORANGE),
];

// ============================================================ SEC 07 — COMPETITIVE / FUNDING LANDSCAPE
const section7 = [
  ...sectionHeader('The Funding & Visibility Landscape', CORE_BLUE, '07'),
  p('Shoes That Fit does not compete for customers — but it does compete for attention: for the same corporate CSR budgets, foundation dollars, major donors, and the visibility that brings new sponsors. The throughline below is digital and AI maturity in fundraising, because that, not mission quality or brand trust, is the open lane.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Funding and visibility landscape', 560),
  caption('Figure 07.0 — A strategic assessment, not a measured score, and a discovery item rather than a verified peer set. The open corner pairs a trusted national brand with AI-enabled partner growth.'),
  buildTable(
    [{ label: 'Who competes for the same support', weight: 30 }, { label: 'Examples', weight: 34 }, { label: 'Digital / AI posture (general read)', weight: 36 }],
    [
      [{ text: 'Large national children’s charities', bold: true, color: CORE_BLUE }, 'Well-funded national brands with full development departments', 'High visibility and professional fundraising; AI adoption uneven but resourced.'],
      [{ text: 'Peer back-to-school / shoe nonprofits', bold: true, color: CORE_BLUE }, 'Comparable basic-needs and footwear-focused nonprofits', 'Closest peers for corporate CSR and major gifts; most have not yet adopted AI in fundraising.'],
      [{ text: 'CSR & giving directories / portals', bold: true, color: CORE_BLUE }, 'Corporate-giving platforms and donation aggregators', 'Often out-rank individual nonprofits for "where to give" and CSR searches — new partners can leak to them.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and an honest caveat',
    ['Few nonprofits have brought AI into corporate-partner growth and storytelling, and fewer still make their impact AI-citable and search-visible for the CSR teams deciding where to give. An organization that pairs a genuinely trusted national brand with AI-enabled partner growth would stand in a corner few peers occupy — found when a corporate giving team searches, and credible when they arrive.',
     'The caveat: a rigorous peer map (which children’s nonprofits chase the same corporate and foundation dollars, and where Shoes That Fit wins or loses) was not built from public data in this pass. We would rather research it properly with you than assert it — it is a discovery deliverable.'], CORE_ORANGE),
];

// ============================================================ SEC 08 — DIGITAL AUDIT
const section8 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '08'),
  p('A factual read of Shoes That Fit’s public digital footprint as observed in June 2026. The point is not criticism — the brand is strong and the storytelling is active. It is that the gap between a trusted national brand and an AI-ready, search-visible presence is itself the growth opportunity. Where a number was not directly visible to us, we say so rather than guess.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 22 }, { label: 'What we observed', weight: 52 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Website', bold: true }, 'A clear, well-organized site with a strong mission story, prominent Donate calls to action, a self-serve community-fundraiser builder, and corporate-partner and legacy-giving paths.', 'A strong base to build on.'],
      [{ text: 'Impact storytelling', bold: true }, 'An active news/impact section with frequent, well-written posts (board news, the new Shoe Bank, partner stories, all-star events).', 'Make stories AI-citable and search-visible.'],
      [{ text: 'LinkedIn', bold: true }, 'About 2,084 followers and 44 employees on the company page (directly verified) — a credible base for a national org, with room to convert reach into corporate relationships.', 'Turn reach into CSR relationships.'],
      [{ text: 'Other social', bold: true }, 'Active presence on Instagram, Facebook, and other channels (linked from the site). We did not independently verify follower counts, so we report none — a discovery item.', 'Convert reach into recurring gifts.'],
      [{ text: 'Search / AEO', bold: true, color: CRITICAL }, 'The brand name ranks, but "back-to-school shoe drive," "corporate giving," and similar high-intent CSR searches are an open field where directories and large charities can absorb the demand.', 'Be the cited answer where CSR teams look.'],
      [{ text: 'Bilingual reach', bold: true }, 'A national footprint includes many heavily Hispanic communities; Spanish-language donor and school pages would extend reach.', 'Reach more families and sponsors.'],
      [{ text: 'Giving / data platforms', bold: true }, 'The site supports online and self-serve giving; the underlying donor, CRM, and payment platforms are not publicly disclosed.', 'Confirm and unify at discovery.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most important finding',
    'The brand is trusted and the stories are being told — but they are not yet built to be found and cited by the AI assistants and search tools that corporate giving teams, grantmakers, and donors increasingly use. Closing that gap is low-cost, high-impact, and the natural complement to the partner-growth engine in Section 11.', TEAL),
];

// ============================================================ SEC 09 — CAPABILITY PROOF
const section9 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '09'),
  p('Before the plan, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Shoes That Fit use case across both fronts — protect and grow. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: Security & Risk Assessment (Nexus Assess + Pulse)',
    'What we built: a unified IT-risk and AI-penetration-testing platform — internal and external vulnerability scanning, dark-web credential monitoring, Microsoft 365 review, and compliance mapping (PCI-DSS, SOC 2, NIST). How it applies: the free baseline assessment that opens this engagement, plus the controls that protect a record gift, donor data, and partner transfers from fraud.', CORE_BLUE),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured data and drafted output — deployed for a regulated financial firm’s compliance workflows. How it applies: first drafts of grant narratives and per-partner impact reports from your vetted facts and outcomes, so staff edit rather than start from a blank page.', CORE_ORANGE),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini with search and analytics tools) that produces and optimizes authority content and tracks whether AI assistants cite it. How it applies: a story-and-impact engine that makes Shoes That Fit the answer when a corporate giving team or donor searches — and helps qualify and run a free Google Ad Grant.', TEAL),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: a fact-check pass on grant claims and partner reports, where a single confident error is unacceptable — a second set of eyes before a person signs off.', CORE_BLUE),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: knowledge systems and an AI-native software practice that delivers builds far faster than traditional development. How it applies: school-intake and Shoe-Bank logistics automation, plus one unified view of each supporter across your systems — and a searchable institutional memory so a 30-year history is an asset, not a pile of inboxes.', CORE_ORANGE),
  subHeader('"Can a nonprofit our size afford this?" — the multi-model discipline'),
  p('A fair question for a lean budget. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform and send each sub-task to the most cost-effective model that does it well: lightweight models for high-volume work, mid-tier models for drafting, and frontier models only for the small slice that needs deep judgment. In practice that runs well below the cost of routing everything to one premium tool. Just as important for an organization like yours, much of the surrounding stack — a Google Ad Grant, nonprofit-priced Microsoft tools — is free or discounted to 501(c)(3) organizations, which keeps the real out-of-pocket cost modest.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — UNDERSTANDING AI
const section10 = [
  ...sectionHeader('Understanding AI — A Field Guide for Leadership', CORE_BLUE, '10'),
  p('A short, impartial primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim — and the guardrails are written for an organization that holds donor data and serves children.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it. The most useful distinction is between ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable and low-risk, e.g. "draft a thank-you from these gift details") and ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight). The principle is to use the simplest thing that works: start with drafting and research automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('Where Shoes That Fit sits today — the maturity ladder'),
  p('Most established nonprofits sit on the first one or two rungs of a widely-used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks): aware of AI, experimenting informally, but without a strategy, a policy, or operational deployment. The leaders are one or two rungs up, and the gap closes in months, not years. This engagement is about moving Shoes That Fit up two rungs deliberately and safely — not buying a product.', { spaceAfter: 120 }),
  h3('Adopting AI responsibly — the guardrails for this mission'),
  bulletRuns([{ text: 'Hallucination control — every funder claim must be true. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI produces a fluent answer, not necessarily a correct one. The rule: AI drafts; a human verifies every number, name, and outcome before anything goes to a partner or funder. One fabricated statistic in a report can end a relationship.' }]),
  bulletRuns([{ text: 'Data protection — never put donor or child data into public AI. ', bold: true, color: DARK_CHARCOAL }, { text: 'Donor records and any information about the children served carry real duties. The rule: no donor personal information or child data goes into consumer AI tools; we use private, governed deployments with no-training terms and de-identified data. This is where the security front and the AI front meet.' }]),
  bulletRuns([{ text: 'The human owns the relationship. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI handles research, segmentation, and first drafts. People own every partner and major-gift conversation and every final message to a donor.' }]),
  bulletRuns([{ text: 'Accountability — inventory every AI tool. ', bold: true, color: DARK_CHARCOAL }, { text: 'Following the NIST AI Risk Management Framework, keep a simple record of each AI tool, its owner, and the data it touches — so governance is real, not assumed.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Free tools are cheap but leave you to assemble, secure, and govern the whole system — and to own the risks. A capable full-time technology hire is scarce and costs well over six figures a year, and cannot cover strategy, build, security, and governance alone. A partner provides all of that at a fraction of the cost, with proven builds and security-first method — and we architect, build, and operationalize through to something your team actually uses, rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 11 — AI ENGINE
const section11 = [
  ...sectionHeader('The AI Growth Engine', CORE_BLUE, '11'),
  p('With the foundation secured, here is the growth engine. It has three columns: be found and tell the story, raise more and win partners and grants, and serve schools and report impact. Each capability names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Shoes That Fit AI growth engine', 624),
  caption('Figure 11.0 — Be found and tell the story (left); raise more and win partners and grants (center); serve schools and report impact (right). AI drafts and researches; a human owns every relationship.'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Shoes That Fit', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Authority & impact stories', 'A story engine — children served, the record gift, outcomes — that donors and search reward.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['AEO / search + Google Ad Grant', 'Be the cited answer for corporate giving and back-to-school searches; run a free $10K/mo Ad Grant.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Bilingual reach', 'Spanish donor and school pages across a 50-state, heavily Hispanic community.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Corporate-partner ABM', 'Find look-alike corporate prospects, warm-intro paths, and renewal-risk signals for the #1 engine.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Grant prospecting & drafting', 'Match funders and draft boilerplate; staff write the funder-specific case for support.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Donor reactivation & scoring', 'Segment, score, and re-engage lapsed and mid-tier donors across the base.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Per-partner CSR reporting', 'Auto-draft each corporate partner’s impact report — the currency of renewal.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['School intake & Shoe-Bank logistics', 'Streamline how schools measure and request; forecast size mix and distribution from the warehouse.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'AI assists the people who do this work; it does not replace the relationship that wins a partner gift or the staff member who matches a school. Every draft is checked, every claim is verified, and no donor or child data ever goes into a public tool. That is how this stays trustworthy in a mission built on trust.', TEAL),
];

// ============================================================ SEC 12 — INVESTMENT
const section12 = [
  ...sectionHeader('Mission Impact & Investment', CORE_BLUE, '12'),
  p('We price from real, published service ranges, we lean on technology that is free or discounted to nonprofits, and we measure return only after discovery. No figure below is a quote, and none is presented as a guaranteed result for Shoes That Fit.', { spaceAfter: 130 }),
  subHeader('Start small, prove it, then grow'),
  buildTable(
    [{ label: 'Phase', weight: 24 }, { label: 'What it includes', weight: 48 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Secure & stabilize', bold: true, color: CORE_BLUE }, 'A free Nexus Assess baseline, then the priority controls it surfaces — payment/email fraud protection, MFA and endpoint security, and a clean Microsoft 365 migration.', 'Free assessment + fixed scope'],
      [{ text: 'Raise & reach', bold: true, color: CORE_BLUE }, 'Corporate-partner ABM and AI-assisted grant drafting; donor segmentation and reactivation; AEO/SEO, a Google Ad Grant, and bilingual content.', 'My SEO + My AI'],
      [{ text: 'Deepen & sustain', bold: true, color: CORE_BLUE }, 'School-intake and Shoe-Bank logistics automation, per-partner impact reporting, a unified supporter view, and a measured dashboard of dollars raised, hours saved, and risk reduced.', 'My Dev + ongoing support'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What it costs — and how much is free or discounted to nonprofits'),
  buildTable(
    [{ label: 'Component', weight: 44 }, { label: 'Cost to a 501(c)(3)', weight: 30 }, { label: 'Note', weight: 26 }],
    [
      [{ text: 'Nexus Assess — baseline risk assessment', color: GREEN, bold: true }, 'Free (one-time)', 'the opening step'],
      [{ text: 'Google Ad Grants — free search advertising', color: GREEN, bold: true }, 'Free (up to $10,000 / mo)', 'in-kind reach'],
      ['Microsoft 365 nonprofit licensing', 'discounted via TechSoup (~$5.50/user/mo Business Premium)', 'recurring'],
      ['My Security / My Cloud — controls + M365 migration', 'scoped to team size', 'project + recurring'],
      ['My SEO — authority + AEO + Ad Grant management', 'published service range', 'recurring'],
      ['My AI — partner ABM, grant, donor & reporting automation', 'scoped to workflow count', 'recurring + build'],
      ['My Dev — intake / logistics / unified view build', 'project-based', 'one-time build'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will measure the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a donation-funded mission, return is measured in dollars raised, staff hours recovered, children reached, and risk avoided — not a revenue multiple. The levers are concrete: more corporate partners retained and won, more grants pursued and secured, lapsed donors re-engaged, staff hours returned from drafting and reporting, and a record gift and donor base protected from fraud. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real figures (Section 15). Until then, any single return claim would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
  calloutBox('A note on affordability',
    'We understand this is a contribution-funded organization in an invest-ahead year, with a mission we respect. We scope the first engagement to fit a real nonprofit budget, we lead with the free assessment and the free and discounted nonprofit technology, and we sequence the work so it starts where it pays for itself — in risk reduced or dollars raised — and grows only as it proves out.', CORE_ORANGE),
];

// ============================================================ SEC 13 — ROADMAP
const section13 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '13'),
  p('Staged so each phase pays for itself — in risk reduced, dollars raised, or hours saved — before the next begins, and sequenced to secure the foundation first, then grow.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 13.0 — Secure & stabilize, then raise & reach, then deepen & sustain. Targets and sequence calibrate at discovery and flex to budget and grant cycles.'),
  p('Phase one runs the free Nexus Assess and closes the priority gaps it surfaces — payment and email fraud controls, multi-factor authentication, and a clean Microsoft 365 migration — and sets a one-page AI use policy with light staff training so the guardrails are real from day one. Phase two turns on the partner and grant engine and donor reactivation, activates a Google Ad Grant, and begins publishing search-friendly, AI-citable stories. Phase three automates school intake and Shoe-Bank logistics, adds per-partner impact reporting and a unified supporter view, and stands up a dashboard so every claim in this plan is measured against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 14 — QUICK WINS
const section14 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '14'),
  p('Six actions Shoes That Fit can take now, most with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Run the free Nexus Assess. ', bold: true, color: DARK_CHARCOAL }, { text: 'Accept the no-cost risk assessment — the same one we run for our managed clients. One reply gets you a prioritized picture of where donor data and payments are exposed, with no obligation.' }]),
  bulletRuns([{ text: 'Add a payment-verification rule today. ', bold: true, color: DARK_CHARCOAL }, { text: 'Require a known-number phone callback to confirm any new payment instruction or change of banking details. It is free, it takes a memo to staff, and it stops the most common wire-fraud play against a publicized gift.' }]),
  bulletRuns([{ text: 'Turn on multi-factor authentication everywhere. ', bold: true, color: DARK_CHARCOAL }, { text: 'If it is not already universal across email and key systems, enabling it is the single highest-impact security step, at no cost.' }]),
  bulletRuns([{ text: 'Activate a Google Ad Grant. ', bold: true, color: DARK_CHARCOAL }, { text: 'Eligible 501(c)(3) organizations receive up to $10,000 a month in free Google search ads — a powerful, no-cost channel for both donors and corporate sponsors.' }]),
  bulletRuns([{ text: 'Surface the record gift and the 3-million milestone as quotable content. ', bold: true, color: DARK_CHARCOAL }, { text: 'Put your strongest proof points where corporate giving teams, search engines, and AI assistants can find and cite them — with the source data ready so they stand up to scrutiny.' }]),
  bulletRuns([{ text: 'Pick the most painful report. ', bold: true, color: DARK_CHARCOAL }, { text: 'Identify the one grant or corporate-partner report that eats the most staff time — that becomes the first AI-assisted drafting target.' }]),
];

// ============================================================ SEC 15 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section15 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '15'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Mission & operations', CORE_BLUE, [
    'How many partner schools do you work with in a typical year, and how is school intake, sizing, and distribution coordinated today?',
    'How does the new Shoe Bank change your logistics — and where do staff spend the most manual hours?',
    'How many staff are involved in development, marketing, and operations, and where is the team most stretched?',
  ]),
  ...qGroup('B · Fundraising & systems', CORE_ORANGE, [
    'How is the corporate-partner pipeline managed today, and how are per-partner impact reports produced?',
    'What donor, CRM, and email systems do you use — and how are card donations processed?',
    'How many grants do you pursue in a year, and what is your typical win rate and capacity?',
  ]),
  ...qGroup('C · Technology & security', TEAL, [
    'Who runs your IT and security today — internal staff, an outside provider, or a mix?',
    'Where are you in the 2025 Microsoft 365 nonprofit-licensing transition, and is multi-factor authentication universal?',
    'How is donor personal information stored and protected, and what is your current incident-response plan?',
  ]),
  ...qGroup('D · People & decision', CHARTREUSE, [
    'Who owns technology and security decisions, and who leads development and partnerships?',
    'Is the priority this year to protect and stabilize, to raise more, to recover staff time — or some combination?',
    'Who would sponsor this initiative, who else weighs in, and what would a successful first year look like?',
  ]),
  spacer(80),
  calloutBox('The easiest way to answer',
    'Most of these take a 45-minute discovery call. Several are answered for free by the Nexus Assess baseline and a short AI Readiness session, which together return a prioritized, costed plan — the cleanest, lowest-commitment first step.', CORE_ORANGE),
];

// ============================================================ SEC 16 — WHAT HAPPENS NEXT
const section16 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '16'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short conversation — walk this blueprint and the Section 15 questions together, and confirm who owns technology and growth.', 'A meeting. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'The free Nexus Assess and a brief AI Readiness session — a prioritized security baseline and a costed growth plan, scoped to budget.', 'A free assessment; the plan is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Start small — close the priority security gaps, activate the free tech, and turn on one growth automation; grow as each step proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['The easiest first step is the free Nexus Assess and a short working session on where AI creates measurable value for Shoes That Fit — no obligation. We will come having done our homework, and we will be honest about what is free, what is worth paying for, and what can wait.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT and security services company founded in 2000 by Ravi Jain. We help organizations move from AI curiosity to operational deployment — we architect, build, secure, and operationalize through to production. Our security practice is led with a CISSP-credentialed, security-first method; our dedicated pod model assigns a named team to each client; and our Irvine, California and Panchkula, India offices provide coverage across time zones. For mission-driven organizations, we lean first on the free and discounted technology that nonprofits qualify for.', { spaceAfter: 140 }),
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
  bullet('Mission, the sponsor-school model, founding in 1992, 50-state reach, and the new Shoe Bank — VERIFIED (shoesthatfit.org).'),
  bullet('501(c)(3) status, EIN 95-4425565, and FY2023–FY2025 financials (FY2025 revenue ~$13.1M, expenses ~$17.2M) — VERIFIED (ProPublica Nonprofit Explorer; IRS Form 990).'),
  bullet('Charity Navigator 99% (Four-Star) rating, independent audit and audit committee — VERIFIED (Charity Navigator). We did not state a program-expense ratio, which we could not directly confirm.'),
  bullet('Leadership — Amy Fass (CEO & ED), Nekeda Newell-Hall (Deputy CEO, External Affairs), Julie Stevens (Chief of Staff), Jeff Fueston (VP Supply Chain), board chair Lynn Mason — VERIFIED (shoesthatfit.org staff & board; press).'),
  bullet('The $776,000+ Stater Bros. Charities gift (June 2026, 12-day campaign) and partners Nordstrom, Nike (via Nordstrom), Capital Group, LA Dodgers Foundation, LA Rams, MGM Resorts Foundation, Stratton Community Foundation — VERIFIED (press releases; corporate-partner page). One outlet rounded the gift to $766,000; we use $776,000+.'),
  bullet('LinkedIn ~2,084 followers and 44 employees — VERIFIED by direct page visit. Instagram, Facebook, and other social follower counts — NOT independently verified; reported as presence only.'),
  bullet('Impact figures (~218,000 children/year; 3M+ pairs) — attributed as organization-reported, not independently audited. Number of partner schools — NOT confirmed.'),
  bullet('IT and security posture, donor/CRM and payment platforms, FY2025 deficit cause, and any specific compliance obligation (PCI-DSS scope, state privacy law) — NOT confirmed; listed as questions in Section 15.'),
  subHeader('Selected sources'),
  ...[
    'Shoes That Fit — home, about, staff & board, corporate partners, and news pages: shoesthatfit.org.',
    'Financial / regulatory — ProPublica Nonprofit Explorer and IRS Form 990 (EIN 95-4425565); Charity Navigator.',
    'Press & partners — Stater Bros. Charities $776K release (wire services; Claremont Courier); Nordstrom press; Capital Group, LA Dodgers Foundation, LA Rams, MGM Resorts Foundation, Stratton Community Foundation.',
    'Security & threat landscape — FBI IC3 2025 Internet Crime Report (BEC losses); sector cybersecurity research (BDO, NTEN, Okta, CyberPeace Institute).',
    'Nonprofit technology — Google for Nonprofits + Google Ad Grants; Microsoft for Nonprofits (2025 licensing change); TechSoup; Candid.',
    'AI framing & guardrails — MIT Sloan (AI literacy); Anthropic (workflows vs. agents); Gartner / Google Cloud (maturity model); NIST AI Risk Management Framework; State of AI in Nonprofits 2025; peer use cases (Treetop, charity: water, Classy, Roper St. Francis) as industry examples only.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Sector and market figures describe the wider nonprofit environment; figures specific to Shoes That Fit are drawn from public filings and the organization’s own statements, with anything uncertain deferred to discovery. Peer outcomes are industry examples, not Technijian or Shoes That Fit results. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Shoes That Fit  ·  AI Growth & IT Readiness Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  ...section11, ...section12, ...section13, ...section14, ...section15, ...section16,
  ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'Shoes That Fit — AI Growth & IT Readiness Blueprint', description: 'A facts-only hybrid AI growth and IT readiness blueprint for Shoes That Fit, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Shoes-That-Fit-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
