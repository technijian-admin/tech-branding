// Alexandria House (AHO) — AI Growth Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY discipline: verified facts only,
// self-reported figures attributed, estimates labeled, unknowns -> Questions section.
// Mission-respectful nonprofit voice. The reframe: this is NOT managed IT (already handled);
// it is AI to raise more, win more grants, reach more families bilingually, recover staff time.

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
  centered('Alexandria House', { size: 52, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'How AI can help raise more, win more grants, reach more families in English and Spanish, and return staff time to the mission — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(820),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Marissa Espinoza, Executive Director — Alexandria House', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR ALEXANDRIA HOUSE LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...sectionHeader('How to Read This Blueprint', CORE_BLUE, ''),
  calloutBox('First — this is not about replacing your network team',
    ['When we first reached out, you told us you already have your network team in place. Good — keep them. This blueprint is not a managed-IT or network proposal, and nothing in it asks you to change who supports your systems.',
     'It is about something different: using AI to help Alexandria House raise more money, win more grants, reach families in Spanish as well as English, and give staff hours back to the mission. That is work your IT team does not do — and it is where a small, donation-funded organization gains the most.'], CORE_ORANGE),
  p('This blueprint was prepared from public research, before any conversation about your internal numbers or systems. It holds itself to a simple discipline:', { spaceBefore: 120, spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Alexandria House is drawn from your own website, your IRS Form 990, reputable press, and partner sites, and is cited in the Appendix. Where a figure is something the organization reports about itself, we say so.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Sector statistics and ranges are clearly marked as market context — never presented as your results. The numbers that matter for a plan come from a short discovery conversation.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('A few corrections we made for accuracy',
    ['There is a separate organization, Alexandra House, Inc. in Anoka County, Minnesota (note the spelling) — a different nonprofit. We discarded every Minnesota figure that surfaced in research so none of it is mistaken for yours.',
     'We also confirmed your founder, Sister Judy Vaughan, is a Sister of St. Joseph of Carondelet (CSJ), and corrected a circulating mix-up with another order. And we set aside one outsized single-year revenue figure in a public database that appears to be a data artifact rather than a real number.',
     'That is the standard of evidence you should expect from every Technijian deliverable.'], TEAL),
];

// ============================================================ TOC
// Manual TOC with verified page RANGES (right-aligned, dot leader). Placed right after the cover.
// Columns: orange = SECTION number (01-15); right column = the PAGES that section spans.
// A clarifier line + a PAGES header prevent the section numbers being misread as a page count.
// Ranges are verified against the rendered PDF; update them if section lengths change.
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
  children: [new TextRun({ text: 'Fifteen sections across 35 pages. The orange figures are section numbers; the figures on the right are the pages each section spans.', size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })],
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
    ['02', 'How Alexandria House Creates & Sustains Impact', '9–10'],
    ['03', 'The Nonprofit Funding & AI Landscape', '11–12'],
    ['04', 'Where Growth & Capacity Live', '13'],
    ['05', 'The Supporter & Stakeholder Relationships', '14–15'],
    ['06', 'The Funding & Visibility Landscape', '16–17'],
    ['07', 'Brand & Digital Presence Audit', '18–19'],
    ['08', 'Technijian Capability Proof', '20–21'],
    ['09', 'Understanding AI — A Field Guide for Nonprofit Leadership', '22–23'],
    ['10', 'The AI Growth Engine', '24–25'],
    ['11', 'Mission Impact & Investment', '26–27'],
    ['12', 'Implementation Roadmap', '28'],
    ['13', 'Quick Wins — Start This Week', '29'],
    ['14', 'Questions to Complete the Analysis', '30–31'],
    ['15', 'What Happens Next', '32'],
  ].map(([n, t, pg]) => tocRow(n, t, pg)),
  tocRow('', 'About Technijian', '33'),
  tocRow('', 'Appendix — Sources & What Remains to Confirm', '34–35'),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Since 1996, Alexandria House has been a transitional residence and house of hospitality for women and children moving out of homelessness in central Los Angeles — and a neighborhood center for the surrounding Mid-Wilshire and Koreatown community. Founded by Sister Judy Vaughan, CSJ, it surrounds families with what it calls a Circle of Support across six areas of stability: housing, economic opportunity, food security, child care, social-emotional wellness, and lifelong alumni support. By your own count, the organization has welcomed 200 women and families — including 315 children — and reports that more than 92% of families who complete the program remain in permanent housing.', { spaceAfter: 120 }),
  kpiRow([
    { number: '1996', label: 'Founded · Sister Judy Vaughan, CSJ', color: CORE_BLUE },
    { number: '315', label: 'Children served since 1996 (org-reported)', color: CORE_ORANGE },
    { number: '~83%', label: 'Revenue from contributions & grants (FY2024)', color: TEAL },
    { number: '>92%', label: 'Families retained in housing (org-reported)', color: GREEN },
  ]),
  spacer(160),
  p('This blueprint shows where AI creates real, measurable value for an organization like yours — and it starts from an honest reading of your position. Alexandria House is not technologically lost: you run a capable all-in-one platform, an active Instagram audience of roughly 15,000, modern event fundraising, and you carry a Charity Navigator rating and a transparency seal. What you are is capacity-constrained and donation-dependent, and that is exactly where AI helps most.', { spaceAfter: 120 }),
  pRuns([{ text: 'The pressure is real and current. ', bold: true, color: DARK_CHARCOAL }, { text: 'In FY2024 roughly 83% of revenue came from contributions and grants, and the organization spent more than it took in for the year while scaling a newly acquired 39-unit building. At the same time, the public funding environment tightened sharply — in June 2026 HUD suspended federal homelessness funding flowing through the regional agency. For a donation-funded mission, deepening private and grant support is no longer optional.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The plan has two parts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Grow support — AI helps research and draft grants, find and re-engage donors, and personalize bilingual appeals, so staff spend their scarce hours on the relationships and arguments that actually win gifts. Reach and serve better — a Spanish-language website your families can actually read, automated impact and funder reporting, and a volunteer chatbot that answers routine questions around the clock. Across both, the rule never changes: AI drafts and researches; a person verifies every claim and owns every relationship.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'And it is built to be affordable. ', bold: true, color: DARK_CHARCOAL }, { text: 'Much of the enabling technology is free or granted to 501(c)(3) organizations — including up to $10,000 a month in free Google search advertising, free Google Workspace, and nonprofit-priced Microsoft tools. We scope the rest to your budget and grant cycles, and we model returns only after a discovery conversation gives us your real numbers (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'Your network is handled. The missing piece is capacity — the time and reach to raise more and serve more without adding payroll. AI can let a small team do the work of a much larger development office: more grants pursued, more donors stewarded, families reached in their own language, and impact reported automatically — so more of every dollar reaches the women and children you serve.', CORE_ORANGE),
];

// ============================================================ SEC 01 — ORGANIZATION & MISSION
const section1 = [
  ...sectionHeader('The Organization & Mission', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Alexandria House’s own website, its IRS Form 990, reputable press, and partner organizations (see Appendix). Figures the organization reports about itself are attributed as such.', { spaceAfter: 130 }),
  subHeader('A house of hospitality, and a neighborhood'),
  p('Alexandria House describes itself as a transitional residence and "house of hospitality" providing safe, supportive housing for women and children experiencing homelessness and trauma, helping them move from emergency shelter toward stability and permanent housing. It is also a neighborhood center for the surrounding community, and it carries a founding commitment to grassroots advocacy against systemic poverty. The organization describes itself as "intentionally multicultural and anti-racist," centered on the needs of women who are economically poor, and sums up its values as "Hope. Love. Healing."', { spaceAfter: 120 }),
  subHeader('The Circle of Support'),
  p('The model of care is a "Circle of Support" that strengthens six essential areas of stability. It is a clear, compassionate framework — and, as later sections show, each area is also something a funder will pay to see measured.', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Area of stability', weight: 28 }, { label: 'What it means for a family', weight: 72 }],
    [
      [{ text: 'Housing', bold: true, color: CORE_BLUE }, 'Safe transitional and permanent affordable housing — the foundation everything else is built on.'],
      [{ text: 'Economic opportunity', bold: true, color: CORE_BLUE }, 'Job development and entrepreneurship, including the Start Up Sisterhood LA program.'],
      [{ text: 'Food security', bold: true, color: CORE_BLUE }, 'Food access and distribution for residents and the neighborhood.'],
      [{ text: 'Child care', bold: true, color: CORE_BLUE }, 'Child care plus afterschool and teen programming so parents can work and children can thrive.'],
      [{ text: 'Social-emotional wellness', bold: true, color: CORE_BLUE }, 'Free therapy, wellness, and support groups that help families heal from trauma.'],
      [{ text: 'Lifelong alumni support', bold: true, color: CORE_BLUE }, 'A relationship that does not end at move-out — support that follows families forward.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Footprint, leadership, and scale (verified)'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founded', bold: true }, '1996, by Sister Judy Vaughan, CSJ (Sisters of St. Joseph of Carondelet), with about a dozen women. IRS 501(c)(3) recognition followed in March 2001. EIN 95-4809755; fiscal year ends June 30.'],
      [{ text: 'Location', bold: true }, 'Main campus at 426 S. Alexandria Ave., Los Angeles, CA 90020 (Mid-Wilshire / Koreatown). Phone (213) 381-2649.'],
      [{ text: 'Housing', bold: true }, 'A transitional residence plus permanent affordable housing: a 16-unit building (510 S. Alexandria Ave., completed 2009 with Hollywood Community Housing Corporation) and a 39-unit building (Kenmore Apartments, acquired February 2022).'],
      [{ text: 'Leadership', bold: true }, 'Marissa Espinoza, MA, Executive Director (since July 2022; previously with Covenant House California and Casa Pacifica). Sister Judy Vaughan, CSJ, Founding Director. Aletheia Broom, MPA, Associate Director of Programs & Services.'],
      [{ text: 'Impact (org-reported)', bold: true }, '200 women and families, including 315 children, welcomed since 1996; more than 92% of families who complete the program remain in permanent housing. These are figures Alexandria House reports about itself.'],
      [{ text: 'Recognition', bold: true }, 'A Charity Navigator score of 86% (three stars, accountability beacon) and a transparency seal; member of CalNonprofits.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your current annual count of women, children, and families served; your current transitional-bed count; your present mix of government, foundation, and individual funding; your board roster; or how grant writing, donor management, and reporting are handled today. These are the questions in Section 14.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW IMPACT IS CREATED
const section2 = [
  ...sectionHeader('How Alexandria House Creates & Sustains Impact', CORE_BLUE, '02'),
  p('A nonprofit runs on a cycle: support comes in, programs turn it into outcomes for families, and those outcomes — told well and measured honestly — bring in more support. AI can strengthen every stage of that cycle without changing the human heart of the work.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Alexandria House creates and sustains impact', 612),
  caption('Figure 02.0 — Support in (left), the Circle of Support (center), outcomes for families (right). The orange band shows where AI plugs in — assisting people, never replacing the relationship.'),
  buildTable(
    [{ label: 'Stage', weight: 24 }, { label: 'What it is today', weight: 46 }, { label: 'Where AI helps', weight: 30 }],
    [
      [{ text: 'Support in', bold: true, color: TEAL }, 'Individual and monthly donors, foundations and grants, events, and in-kind gifts — roughly 83% of revenue is contributions and grants (FY2024).', 'Grant & donor intelligence; bilingual appeals.'],
      [{ text: 'Programs', bold: true, color: DARK_CHARCOAL }, 'The Circle of Support delivered through housing, child care, SUSLA, food, wellness, and alumni programs.', 'Volunteer & inquiry automation; staff time recovered.'],
      [{ text: 'Outcomes', bold: true, color: CORE_BLUE }, 'Stable housing, economic opportunity, thriving children, and a lasting alumni community.', 'Impact measurement; consistent funder reporting.'],
    ], { headerColor: TEAL }),
  spacer(80),
  pRuns([{ text: 'The platform you already run is the anchor. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your website, donor records, email, and donate forms run on a single all-in-one nonprofit platform, with event fundraising on a second tool. That matters for the plan: the highest-value AI here does not replace those systems — it works alongside them, so staff keep using the tools they trust while AI removes the repetitive work around them.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — FUNDING & AI LANDSCAPE
const section3 = [
  ...sectionHeader('The Nonprofit Funding & AI Landscape', CORE_BLUE, '03'),
  p('The forces below are facts about the environment a small social-services nonprofit operates in — not claims about Alexandria House. Each one rewards better information, faster writing, and broader reach. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '54%', label: 'of nonprofit revenue comes from individual donors', color: CORE_BLUE },
    { number: '~⅔', label: 'of grant-seekers win only $5K–$15K per year', color: CORE_ORANGE },
    { number: '76%', label: 'of nonprofits have no AI strategy or policy', color: TEAL },
    { number: '13%', label: 'use predictive AI for donor prospecting', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('Individual giving is the engine — and it can be grown'),
  p('Across the sector, individual donors drive roughly 54% of nonprofit revenue, far more than grants at about 22% (BryteBridge, 2024). For an organization where contributions and grants are about 83% of revenue, that is the central fact: the fastest, most durable growth comes from finding, keeping, and deepening relationships with individual donors — exactly the work AI can accelerate without replacing the personal touch.', { spaceAfter: 120 }),
  h3('Grants are slow, competitive, and rewarded by preparation'),
  p('Most small nonprofits pursue grants, but the yield is hard-won: around two-thirds of grant-seekers secure only $5,000–$15,000 a year, the average time to a first grant is over two years, and roughly four in ten organizations are not "grant-ready" when opportunities appear (BryteBridge, 2024). The differentiator is preparation — a ready library of vetted facts and outcomes, and the capacity to draft quickly. That is precisely where AI assistance pays off, and about a quarter of nonprofits already use it for grant writing (TechSoup, 2025).', { spaceAfter: 120 }),
  h3('A real early-mover window in AI'),
  p('Awareness is high but execution is low: 96% of nonprofits report a basic understanding of AI, yet 76% have no AI strategy and 76% have no AI policy (TechSoup × Tapp Network, 2025). About 30% say AI boosted fundraising revenue in the past year, while only 13% use predictive AI to find likely donors. The honest caveat: high tool use has not automatically meant high impact — which is exactly why a small organization benefits from a structured, guardrailed plan rather than ad-hoc experimentation.', { spaceAfter: 120 }),
  h3('The public-funding ground is shifting'),
  p('The environment for homelessness funding tightened sharply in 2026: HUD suspended federal homelessness funds flowing through the Los Angeles regional agency (LAHSA) amid a fraud-and-mismanagement review. We have not confirmed whether Alexandria House currently receives LAHSA pass-through funding — that is a discovery question — but the direction of travel is unambiguous: organizations that diversify and deepen private and grant support are the ones best insulated from public-funding shocks.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'Donor-dependent revenue rewards better donor intelligence and stewardship; competitive grants reward speed and preparation; an early-mover AI window rewards a structured plan; and a shifting public-funding picture rewards diversification toward private giving. Every one of these forces points at a specific AI capability later in this blueprint — and none requires Alexandria House to change its mission, only to give a small team more reach.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where Growth & Capacity Live', CORE_BLUE, '04'),
  p('For a mission like this, "growth" is not a single sales funnel. It is four levers — and AI supports each one while keeping people at the center of every relationship.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 24 }, { label: 'What it looks like for Alexandria House', weight: 50 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Raise more from donors', bold: true, color: CORE_BLUE }, 'Find likely major and recurring givers, re-engage lapsed donors, and personalize appeals across a contribution-driven base.', 'Grow support'],
      [{ text: 'Win more grants', bold: true, color: CORE_BLUE }, 'Match the right funders and draft faster, so limited staff time goes to the funder-specific case for support.', 'Grow support'],
      [{ text: 'Reach more families', bold: true, color: CORE_ORANGE }, 'Serve and engage a Latino and Korean neighborhood in Spanish as well as English — on the website and in every channel.', 'Reach & serve'],
      [{ text: 'Recover staff time', bold: true, color: CORE_ORANGE }, 'Automate reporting, routine inquiries, and repetitive admin so hours return to families and relationships.', 'Reach & serve'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first two levers grow the resources that fund the mission. The second two extend reach and give a small team back its time. None of them asks Alexandria House to be a different organization — they ask only that the work it already does be seen, funded, and sustained more fully.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — STAKEHOLDERS (personas)
const section5 = [
  ...sectionHeader('The Supporter & Stakeholder Relationships', CORE_BLUE, '05'),
  p('Alexandria House depends on a portfolio of relationships. The map below places the supporter archetypes by giving capacity and engagement depth — archetypes to calibrate against your real donor file at discovery, not named individuals. The families served are the purpose of the work, not a fundraising segment.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Supporter and stakeholder map', 560),
  caption('Figure 05.0 — Supporter archetypes by giving capacity and engagement. Bubble size approximates relative revenue weight. The families served are the mission, not a segment to monetize.'),
  buildTable(
    [{ label: 'Relationship', weight: 24 }, { label: 'What they need', weight: 40 }, { label: 'How AI helps Alexandria House serve them', weight: 36 }],
    [
      [{ text: 'Major-gift donors', bold: true, color: CORE_ORANGE }, 'A personal relationship and a clear, trusted picture of impact.', 'Prospect research and pre-meeting briefs; staff own every conversation.'],
      [{ text: 'Monthly / recurring donors', bold: true, color: CORE_BLUE }, 'Easy giving and steady, meaningful updates.', 'Segmented, personalized stewardship; bilingual updates.'],
      [{ text: 'Foundation funders', bold: true, color: TEAL }, 'A strong fit, a credible case, and clean reporting.', 'Funder matching; faster drafts; consistent outcome reports.'],
      [{ text: 'Government / institutional', bold: true, color: BRAND_GREY }, 'Compliance and documented outcomes.', 'Automated outcome tracking and report narratives.'],
      [{ text: 'Volunteers & community', bold: true, color: GREEN }, 'A simple way to help and quick answers.', 'Self-serve sign-up; a 24/7 inquiry chatbot.'],
      [{ text: 'Lapsed donors', bold: true, color: DARK_CHARCOAL }, 'A reason to return and to be remembered.', 'Re-engagement scoring and tailored win-back appeals.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your donor database. Which segments matter most — by revenue, by growth potential, by mission fit — is a discovery question. We would rather build the plan around your real supporters than around our assumptions about them.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE / FUNDING LANDSCAPE
const section6 = [
  ...sectionHeader('The Funding & Visibility Landscape', CORE_BLUE, '06'),
  p('Alexandria House does not compete for customers — but it does, in effect, compete for attention: for the same grant dollars, major donors, volunteers, and the families searching for help. The throughline below is digital and AI maturity in fundraising, because that, not mission quality, is the open lane.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Funding and visibility landscape', 560),
  caption('Figure 06.0 — A strategic assessment, not a measured score, and a discovery item rather than a verified peer set. The open corner pairs a real, trusted mission with AI-enabled bilingual fundraising.'),
  buildTable(
    [{ label: 'Who competes for the same support', weight: 30 }, { label: 'Examples', weight: 34 }, { label: 'Digital / AI posture (general read)', weight: 36 }],
    [
      [{ text: 'Large LA homeless-services orgs', bold: true, color: CORE_BLUE }, 'Major regional providers with development departments', 'High visibility and professional fundraising; AI adoption uneven but resourced.'],
      [{ text: 'Peer family / women’s shelters', bold: true, color: CORE_BLUE }, 'Comparable transitional-housing and women’s-services nonprofits', 'Closest peers for grants and major donors; most have not yet adopted AI in fundraising.'],
      [{ text: 'Neighborhood & directory presence', bold: true, color: CORE_BLUE }, 'Koreatown / neighborhood orgs; directories such as 211LA and womenshelters.org', 'Directories often out-rank individual nonprofits for "help" searches — new supporters leak to them.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and an honest caveat',
    ['Most small nonprofits have not yet brought AI into fundraising and storytelling, and very few in this category publish strong bilingual, search-friendly, AI-citable content. An organization that pairs a genuinely trusted mission with AI-enabled bilingual fundraising would stand in a corner few peers occupy — found when supporters search, and credible when they arrive.',
     'The caveat: a rigorous peer funding-competition map (which LA family-services nonprofits chase the same foundations and donors, and where Alexandria House wins or loses) was not built from public data in this pass. We would rather research it properly with you than assert it — it is a discovery deliverable.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Alexandria House’s public digital footprint as observed in June 2026. The point is not criticism — it is that the gap between the quality of the work and the reach of its digital presence is itself the opportunity.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 22 }, { label: 'What we observed', weight: 52 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Website & platform', bold: true }, 'A capable all-in-one nonprofit platform (content, donor CRM, email, SMS, donor logins) with a clear "Circle of Support" story.', 'A strong base to build on.'],
      [{ text: 'Online giving', bold: true }, 'A native donate form with a monthly-giving option, sensible tiers, matching gifts, and giving about one click from any page.', 'Already good; make it bilingual.'],
      [{ text: 'Spanish language', bold: true, color: CRITICAL }, 'The website — home, about, donate, volunteer, and help pages — is English-only, in a heavily Latino and Korean neighborhood, even though your social shows bilingual capacity.', 'The single biggest, most mission-aligned fix.'],
      [{ text: 'Content / stories', bold: true, color: CRITICAL }, 'No active blog, news, or impact-stories engine; strong outcomes (the 92%) are not surfaced as fresh, quotable content.', 'Feed donor cultivation, search, and AI answers.'],
      [{ text: 'Social media', bold: true }, 'An active Instagram of roughly 15,000 followers (with some bilingual posts); a LinkedIn page of about 940 that is not even linked from the site.', 'Convert reach into list and recurring gifts.'],
      [{ text: 'Search / AEO', bold: true, color: CRITICAL }, 'The site sits below directories and peers for terms families and donors actually search; a dormant 2010 site is still live and un-redirected.', 'Be found and cited where people look.'],
      [{ text: 'Fundraising stack', bold: true }, 'General gifts in the main platform; events on a second tool — likely two donor records and manual reconciliation.', 'One unified view of each supporter.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most important finding',
    'An organization serving a largely Spanish-speaking neighborhood publishes a website its own families often cannot read, while strong results — like more than 92% of completing families staying housed — sit invisible to search and AI assistants. Neither gap is a weakness to hide; together they are the clearest, lowest-cost place to start, and a Spanish page can be live in weeks.', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the plan, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Alexandria House use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: AI Document Intelligence',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured data and drafted output — deployed for a regulated financial firm’s compliance workflows. How it applies: first drafts of grant narratives and funder reports from your vetted facts and outcomes, so staff edit rather than start from a blank page.', CORE_BLUE),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini with search and analytics tools) that produces and optimizes authority content and tracks whether AI assistants cite it. How it applies: a bilingual story-and-impact engine that makes Alexandria House the answer when someone searches for help or for a place to give — and helps qualify and run a free Google Ad Grant.', CORE_ORANGE),
  calloutBox('Proven build: LLM Council (multi-model peer review)',
    'What we built: a pattern in which several models independently review the same output and reconcile it (our ScamShield system). How it applies: a fact-check pass on grant claims and funder reports, where a single confident error is unacceptable — a second set of eyes before a person signs off.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: knowledge systems and an AI-native software practice that delivers builds far faster than traditional development. How it applies: one unified view of each supporter across your platforms, plus a bilingual volunteer-and-inquiry chatbot — and a searchable institutional memory so a thirty-year history is an asset, not a pile of inboxes.', CORE_BLUE),
  subHeader('"Can a nonprofit our size afford this?" — the multi-model discipline'),
  p('A fair question for a lean budget. Technijian does not wire every task to one expensive model. We run a routed, multi-model platform and send each sub-task to the most cost-effective model that does it well: lightweight models for high-volume work, mid-tier models for drafting, and frontier models only for the small slice that needs deep judgment. In practice that runs well below the cost of routing everything to one premium tool. Just as important for an organization like yours, much of the surrounding stack — Google Workspace, a Google Ad Grant, nonprofit-priced Microsoft tools — is free or granted to 501(c)(3) organizations, which keeps the real out-of-pocket cost modest.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Nonprofit Leadership', CORE_BLUE, '09'),
  p('A short, impartial primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim — and the guardrails are written for an organization serving vulnerable women and children.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it. The most useful distinction is between ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable and low-risk, e.g. "draft a thank-you from these gift details") and ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight). The principle is to use the simplest thing that works: start with drafting and research automations that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('The non-negotiable guardrails for this mission'),
  bulletRuns([{ text: 'Hallucination control — every funder claim must be true. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI produces a fluent answer, not necessarily a correct one. The rule: AI drafts; a human verifies every number, name, and outcome before anything goes to a funder. One fabricated statistic in a report can end a relationship.' }]),
  bulletRuns([{ text: 'Privacy and dignity — never put client data into public AI. ', bold: true, color: DARK_CHARCOAL }, { text: 'Information about women and children leaving unsafe situations carries real legal and ethical duties. The rule: no client names, locations, or case details go into consumer AI tools; we use private, governed deployments with no-training terms and de-identified data.' }]),
  bulletRuns([{ text: 'The human owns the relationship. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI handles research, segmentation, and first drafts. People own every major-gift conversation and every final message to a donor or a family.' }]),
  bulletRuns([{ text: 'Funder disclosure — follow each funder’s rule. ', bold: true, color: DARK_CHARCOAL }, { text: 'Policies vary: some funders bar fully AI-generated applications and AI-fabricated references, others require or encourage disclosure of AI use. We keep AI to assistive drafting and disclose where required.' }]),
  bulletRuns([{ text: 'A bilingual quality gate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Machine translation alone misses cultural and idiomatic nuance. A native bilingual reviewer validates any Spanish material before it reaches families.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Free tools are cheap but leave you to assemble, secure, and govern the whole system. A capable full-time technology hire is scarce and costs well over six figures a year, and cannot cover strategy, build, security, and governance alone. A partner provides all of that at a fraction of the cost, with proven builds — and we architect, build, and operationalize through to something your team actually uses, rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth Engine', CORE_BLUE, '10'),
  p('The engine has three columns: be found and tell the story, raise more and win grants, and serve families and report impact. Each capability names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Alexandria House AI growth engine', 624),
  caption('Figure 10.0 — Be found and tell the story (left); raise more and win grants (center); serve and report impact (right). AI drafts and researches; a human owns every relationship.'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Alexandria House', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Bilingual website & content', 'Spanish-language donate, help, and story pages your families can actually read.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Authority & impact stories', 'A real story engine — outcomes, alumni voices, the 92% — that donors and search reward.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['AEO / search + Google Ad Grant', 'Be the cited answer for help and giving; qualify and run a free $10K/mo Google Ad Grant.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Grant prospecting & drafting', 'Match funders and draft boilerplate; staff write the funder-specific case for support.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Donor development & scoring', 'Find likely major and recurring givers; re-engage lapsed donors across the base.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Bilingual comms at scale', 'Spanish newsletters, intake, social, and surveys — AI drafts, bilingual staff review, publish.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Impact & funder reporting', 'Auto-draft outcome dashboards and report narratives, consistently across many funders.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Unified donor view + chatbot', 'Reconcile your two platforms into one supporter record; a 24/7 volunteer & inquiry chatbot.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'AI assists the people who do this work; it does not replace the relationship that wins a gift or the staff member who walks alongside a family. Every draft is checked, every claim is verified, and no client data ever goes into a public tool. That is how this stays trustworthy in a mission built on trust.', TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Mission Impact & Investment', CORE_BLUE, '11'),
  p('We price from real, published service ranges, we lean on technology that is free or granted to nonprofits, and we model returns only after discovery. No figure below is a quote, and none is presented as Alexandria House’s guaranteed result.', { spaceAfter: 130 }),
  subHeader('Start small, prove it, then grow'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Start — prove it', bold: true, color: CORE_BLUE }, 'A short AI Readiness session, the free nonprofit tech set up (Google Ad Grant + Workspace), a Spanish-language donate/help page, and ONE high-value automation (e.g., grant or report drafting).', 'Fixed, modest scope'],
      [{ text: 'Grow — raise & reach', bold: true, color: CORE_BLUE }, 'Grant funder-matching and AI-assisted drafting; donor segmentation and re-engagement; bilingual content at scale.', 'My SEO + My AI'],
      [{ text: 'Sustain — operate', bold: true, color: CORE_BLUE }, 'A unified supporter view and volunteer chatbot, automated impact reporting, and a measured dashboard of dollars raised and hours saved.', 'My Dev + ongoing support'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What it costs — and how much is free to nonprofits'),
  buildTable(
    [{ label: 'Component', weight: 42 }, { label: 'Cost to a 501(c)(3)', weight: 32 }, { label: 'Note', weight: 26 }],
    [
      [{ text: 'Google Ad Grants — free search advertising', color: GREEN, bold: true }, 'Free (up to $10,000 / mo)', 'in-kind reach'],
      [{ text: 'Google Workspace for Nonprofits', color: GREEN, bold: true }, 'Free for most 501(c)(3)s', 'recurring'],
      ['Microsoft 365 nonprofit + Copilot', 'granted / discounted via TechSoup', 'recurring'],
      ['Candid Foundation Directory (funder research)', 'free with a Candid Gold Seal', 'recurring'],
      ['My SEO — bilingual authority + AEO + Ad Grant', 'published service range', 'recurring'],
      ['My AI — grant, donor & reporting automation', 'scoped to workflow count', 'recurring + build'],
      ['My Dev — unified view / chatbot build', 'project-based', 'one-time build'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a donation-funded mission, return is measured in dollars raised, hours recovered, and families reached — not in a revenue multiple. The levers are concrete: more grants pursued and won, lapsed donors re-engaged, staff hours returned from drafting and reporting, and Spanish-speaking families finally able to find and give. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real figures (Section 14). Until then, any single ROI claim would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
  calloutBox('A note on affordability',
    'We understand this is a budget-constrained, deficit-year organization with a mission we respect. We scope the first engagement to fit a real nonprofit budget and to align with grant cycles, and we deliberately build on the free and granted nonprofit technology first — so the plan starts where it pays for itself and grows only as it proves out.', CORE_ORANGE),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself — in dollars raised or hours saved — before the next begins, and sequenced to start with the lowest-cost, fastest wins.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Foundation, then raise & reach, then deepen & sustain. Targets and sequence calibrate at discovery and flex to grant cycles and budget.'),
  p('Phase one stands up the free nonprofit technology, publishes a Spanish-language donate and help page, fixes the dormant legacy site, and sets a one-page AI use policy with light staff training so the guardrails are real from day one. Phase two turns on the grant engine and donor development and begins publishing bilingual, search-friendly stories. Phase three unifies the supporter view, adds the volunteer chatbot, automates funder reporting, and stands up a dashboard so every claim in this plan is measured against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions Alexandria House can take now, with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Apply for the Google Ad Grant. ', bold: true, color: DARK_CHARCOAL }, { text: 'Eligible 501(c)(3) organizations receive up to $10,000 a month in free Google search ads — the single highest-impact fix for the discovery gap, at no cost.' }]),
  bulletRuns([{ text: 'Publish one page in Spanish. ', bold: true, color: DARK_CHARCOAL }, { text: 'A Spanish donate or help page signals to your families — and to search engines — that Alexandria House speaks their language. A small change with outsized reach.' }]),
  bulletRuns([{ text: 'Redirect the dormant 2010 site. ', bold: true, color: DARK_CHARCOAL }, { text: 'An old, un-redirected website still lives online and dilutes your search presence. Pointing it at the current site is a quick, free cleanup.' }]),
  bulletRuns([{ text: 'Surface the 92% as a quotable stat. ', bold: true, color: DARK_CHARCOAL }, { text: 'Put your strongest outcome where donors, search, and AI assistants can find it — with the source data ready so it stands up to a funder’s scrutiny.' }]),
  bulletRuns([{ text: 'Pick the most painful piece of writing. ', bold: true, color: DARK_CHARCOAL }, { text: 'Identify the one grant or report that eats the most staff time — that becomes the first AI-assisted drafting target.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Mission & programs', CORE_BLUE, [
    'How many women, children, and families do you serve in a typical year, and what is your current transitional-housing capacity?',
    'Do you offer ESL or other adult education today, beyond the Start Up Sisterhood program?',
    'What share of the families you serve are Spanish-dominant, and how many bilingual staff do you have?',
  ]),
  ...qGroup('B · Fundraising & systems', CORE_ORANGE, [
    'How are grant writing and funder reporting handled today, and how many staff hours do they take?',
    'How do you manage donors across your platforms — and do event donors and general donors live in one record or two?',
    'How many grants do you pursue in a year, and what is your typical win rate?',
  ]),
  ...qGroup('C · Funding mix & priorities', TEAL, [
    'What is your current mix of individual, foundation, and government funding — and do you receive any LAHSA or other public pass-through today?',
    'Who are your most important current funders, and when do their renewals come up?',
    'Is the priority this year to raise more, to reach more families, to recover staff time — or some combination?',
  ]),
  ...qGroup('D · People & decision', CHARTREUSE, [
    'Who leads development and marketing, and is there appetite to publish regular bilingual content and stories?',
    'What is Sister Judy Vaughan’s current role alongside the Executive Director?',
    'Who would sponsor this initiative, who else weighs in, and what would a successful first year look like?',
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
      [{ text: '2', bold: true, color: CORE_BLUE }, 'An AI Readiness session — map your fundraising workflows and return a prioritized, costed plan, scoped to budget.', 'A small, fixed engagement; the plan is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Start small — the free tech set-up, a Spanish page, and one automation; grow as each step proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['The easiest first step is a short working session on where AI creates measurable value for Alexandria House — no obligation. We will come having done our homework, and we will be honest about what is free, what is worth paying for, and what can wait.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain. We help organizations move from AI curiosity to operational deployment — we architect, build, and operationalize through to production. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide coverage across time zones. Our approach is practical, cost-conscious, and AI-forward — and for mission-driven organizations, we lean first on the free and granted technology that nonprofits qualify for.', { spaceAfter: 140 }),
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
  bullet('Mission, the Circle of Support, founding in 1996 by Sister Judy Vaughan, CSJ, and program set — VERIFIED (alexandriahouse.org; Angelus News; The Guibord Center).'),
  bullet('501(c)(3) status, EIN 95-4809755, March 2001 IRS recognition, and FY2024 financials (revenue ~$3.15M, expenses ~$4.14M) — VERIFIED (ProPublica Nonprofit Explorer; IRS Form 990).'),
  bullet('Leadership — Marissa Espinoza (ED since July 2022), Sister Judy Vaughan (Founding Director), Aletheia Broom (Associate Director) — VERIFIED (LinkedIn; ProPublica; press).'),
  bullet('Housing footprint (16-unit and 39-unit buildings) and partners (Hollywood Community Housing Corporation; Carrie Estelle Doheny Foundation) — VERIFIED (partner sites; press).'),
  bullet('Impact figures (200 women & families / 315 children; 92% retention) — attributed as organization-reported, not independently audited.'),
  bullet('All "Alexandra House" (Minnesota) figures — EXCLUDED as a different organization; a circulating founder-order mix-up — CORRECTED to CSJ; one outsized single-year revenue figure in a public database — SET ASIDE as a likely data artifact.'),
  bullet('Current annual people served, board roster, present funding mix, current LAHSA/government funding, and named flagship events — NOT independently confirmed; listed as questions in Section 14.'),
  subHeader('Selected sources'),
  ...[
    'Alexandria House — home, about, SUSLA, and Kenmore pages: alexandriahouse.org.',
    'Financial / regulatory — ProPublica Nonprofit Explorer and IRS Form 990 (EIN 95-4809755); Charity Navigator; Candid/GuideStar (via the organization’s site).',
    'Press & profiles — Angelus News; The Guibord Center; VoyageLA; Larchmont Chronicle / Larchmont Buzz; LAist, CalMatters, NBC LA, FOX 11, The Real Deal (2026 HUD/LAHSA coverage).',
    'Partners & funders — Hollywood Community Housing Corporation; Carrie Estelle Doheny Foundation; Marilyn and John Wells Family Foundation (capital lead gift).',
    'Sector & nonprofit-AI — BryteBridge (2024 nonprofit revenue & grant statistics); TechSoup × Tapp Network State of AI in Nonprofits (2025); Nonprofit Productivity Report (2025); Google for Nonprofits + Google Ad Grants; Microsoft for Nonprofits; Candid; Instrumentl; TechSoup.',
    'AI framing & guardrails — MIT Sloan (AI literacy); Anthropic (workflows vs. agents); NIST AI Risk Management Framework; funder AI policies (NIH, NSF, Spencer Foundation, Wellcome) via Thesify.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Sector and market figures describe the wider nonprofit environment; figures specific to Alexandria House are drawn from public filings and the organization’s own statements, with anything uncertain deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
  p('Data-hygiene note: Alexandria House (Los Angeles, EIN 95-4809755) is a different organization from Alexandra House, Inc. (Anoka County, Minnesota). The founder’s religious order is the Sisters of St. Joseph of Carondelet (CSJ).', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Alexandria House  ·  AI Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Alexandria House — AI Growth Blueprint', description: 'A facts-only AI Growth blueprint for Alexandria House, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Alexandria-House-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
