// Rayco Exteriors (RAY) — AI Growth & Bid-Intelligence Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY discipline: verified facts only,
// self-reported / market figures attributed, estimates labeled, unknowns -> Questions.
// Account-based (ABM), for-profit voice. The reframe: this is NOT managed IT / security
// (already declined) — it is AI for the COMMERCIAL front end: being found by community
// managers and winning more HOA/CID reconstruction bids. AI never touches the field work.

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
const GOLD = 'C9922A';
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
  centered('AI GROWTH & BID-INTELLIGENCE BLUEPRINT', { size: 26, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('Rayco Exteriors', { size: 48, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'How AI can help a proven reconstruction contractor get found by the community managers who hire — and win more HOA and commercial bids, in a market a California law just put on a recurring clock. Built on verified facts, with the questions that complete the picture.', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(760),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Gabe Cooley, President — Rayco Exteriors', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR RAYCO EXTERIORS LEADERSHIP', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...sectionHeader('How to Read This Blueprint', CORE_BLUE, ''),
  calloutBox('First — this is not a managed-IT or security pitch',
    ['When we first reached out, we led with managed IT and a free Network Detective security assessment, and Valerie kindly replied on your behalf that you do not have a current need for that kind of support. That is a fair answer, and this blueprint asks nothing of that kind — nothing here proposes to change who runs your network, your devices, or your security.',
     'It is about something different, and for a firm like Rayco more valuable: using AI to get found by the community managers and boards who hire reconstruction contractors, and to win more of the bids you already compete for. That is commercial growth, not IT — the front office, never the field.'], CORE_ORANGE),
  p('This blueprint was prepared from public research, before any conversation about your numbers, pipeline, or systems. It holds itself to a simple discipline:', { spaceBefore: 120, spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Rayco is drawn from your own website, your LinkedIn and CACM/CAI listings, public review platforms, and the California statutes themselves — and is cited in the Appendix. Where a figure describes the wider market rather than your firm, we say so plainly.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Review counts, follower counts, and market figures are marked as reported or as industry context — never presented as audited results. The numbers that drive a plan come from a short discovery conversation.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has — current pipeline, win rate, the tools you use — we ask rather than guess. Section 14 is a structured questionnaire that completes the analysis.' }]),
  calloutBox('A note on precision, up front',
    ['We will be precise even where it is inconvenient. Your own sources disagree on when Rayco was founded — your site says "10+ years," LinkedIn lists 2008, and the current business registration dates to 2016 — so we treat the exact founding year as a discovery question rather than pick one. We cite no revenue figure (none is public and verified), and where a review count comes from a third-party aggregator rather than the source platform, we say "reported."',
     'That same standard runs through every number here. We would rather under-claim and be trusted than over-claim and be checked — which, with a sophisticated buyer, is exactly what happens.'], TEAL),
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
    ['01', 'The Company & What It Builds', 7],
    ['02', 'How Rayco Wins & Delivers Work', 9],
    ['03', 'The Market & the SB 326 / SB 721 Clock', 11],
    ['04', 'Where Growth Lives', 14],
    ['05', 'Buyers & the Decision Chain', 15],
    ['06', 'The Visibility & Reputation Landscape', 17],
    ['07', 'Brand & Digital Presence Audit', 19],
    ['08', 'Technijian Capability Proof', 21],
    ['09', 'Understanding AI — A Field Guide for Rayco Leadership', 23],
    ['10', 'The AI Growth & Bid-Intelligence Engine', 25],
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
  p('Rayco Exteriors is a Southern California reconstruction contractor that restores the building envelope of multifamily, HOA, common-interest-development, and commercial properties — exterior rehab, painting and waterproofing, dry-rot and structural wood repair, deck and balcony reconstruction, stucco and masonry, railings, and siding. The firm has operated for more than a decade, completed a self-reported 3,500-plus communities and buildings, carries a General Building (B) and Painting (C-33) license, and is a CACM Industry Partner and a CAI Orange County business partner. The work and the relationships are real.', { spaceAfter: 120 }),
  kpiRow([
    { number: '3,500+', label: 'communities & buildings (self-reported)', color: CORE_BLUE },
    { number: 'B + C-33', label: 'licensed general & painting contractor', color: CORE_ORANGE },
    { number: 'Jan 1, 2025', label: 'SB 326 first deadline — then every 9 yrs', color: TEAL },
    { number: 'OC + SD', label: 'core market (NorCal expanding)', color: GREEN },
  ]),
  spacer(160),
  pRuns([{ text: 'The opportunity is not the craft — it is being found by the people who hire you, and being trusted before the bid. ', bold: true, color: DARK_CHARCOAL }, { text: 'Rayco wins work through a narrow, knowable universe of community association managers, HOA boards, and the construction managers who write the specs — yet its public reputation is thin where those buyers look. A reported 3.4-star, 27-review Google profile sits well below competitors with hundreds of reviews; there is no blog or resource hub (the site’s /resources and /careers pages return errors); and Rayco does not surface in the AI answers a manager increasingly asks first. The proof of 3,500 projects exists; the digital trail a 2026 buyer follows does not.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'And the demand is on a clock the State of California just set. ', bold: true, color: DARK_CHARCOAL }, { text: 'SB 326 requires every California HOA with wood-framed balconies and elevated walkways to have them inspected by a licensed engineer or architect — the first inspection was due January 1, 2025, and then every nine years thereafter. SB 721 puts apartment buildings on a parallel six-year cycle (first inspection due January 1, 2026). Inspectors diagnose the dry rot, failed waterproofing, and unsafe railings — but they do not repair them. Someone has to, under permit, on a deadline. Rayco’s service lines map almost exactly onto that mandated repair scope, and the cycle regenerates demand every few years. The question is whether the managers funding those repairs can find and trust Rayco when the inspection report lands.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The plan has two parts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Be found and trusted — a modern site with board-ready SB 326 content, a reputation engine that closes the review gap, and authority content that makes Rayco the answer when a manager searches "HOA reconstruction contractor in Orange County." Win more bids — AI that watches the SB 326 inspection cycle and the management-company portfolios, flags the communities sourcing now, and drafts the spec responses and proposals so a lean team competes like a much larger one. Across both, the rule is fixed: AI works the commercial front end and drafts; your team owns every relationship, verifies every claim, and AI never touches the field reconstruction.' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'Your reconstruction work is not the problem — your discoverability and reputation are. A firm with 3,500 projects and the right CACM and CAI memberships is, in 2026, hard to find and thin on reviews exactly where community managers look and exactly as a state law puts thousands of HOA balcony repairs on a recurring deadline. AI can close that gap: get Rayco found and trusted, surface the communities on the clock, and help a small team win more of the bids it already competes for — without adding headcount, and without ever touching the craft.', CORE_ORANGE),
];

// ============================================================ SEC 01 — COMPANY
const section1 = [
  ...sectionHeader('The Company & What It Builds', CORE_BLUE, '01'),
  p('Everything in this section is drawn from Rayco’s own website, its LinkedIn and CACM/CAI listings, the CSLB license record, and public review and directory sources (see Appendix). Where a detail could not be independently confirmed, it is flagged rather than asserted.', { spaceAfter: 130 }),
  subHeader('One discipline — restoring the building envelope'),
  p('Rayco Exteriors describes itself as "California’s Premier Reconstruction Contractor," focused on the exterior envelope of multifamily, HOA / common-interest-development, and commercial properties. That single discipline spans a deliberately complete set of service lines, so a community can run an entire exterior rehabilitation through one contractor rather than coordinating many trades.', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Service line', weight: 30 }, { label: 'What it covers (from Rayco’s site)', weight: 70 }],
    [
      [{ text: 'Complete Exterior Rehab', bold: true, color: CORE_BLUE }, 'Upgrading an existing building envelope, phased or all at once, with financing assistance for the association.'],
      [{ text: 'Painting & Waterproofing', bold: true, color: CORE_BLUE }, 'Full preparation and painting of exteriors using premium paints and specialty coatings.'],
      [{ text: 'Wood Repairs & Replacement', bold: true, color: CORE_BLUE }, 'Dry-rot and termite repair, siding and trim replacement, structural beam replacement, patio covers.'],
      [{ text: 'Deck, Balcony & Walking Surfaces', bold: true, color: CORE_BLUE }, 'Deck and balcony reconstruction, waterproof coatings, and decorative coatings — the heart of SB 326 / SB 721 repair.'],
      [{ text: 'Stucco & Masonry', bold: true, color: CORE_BLUE }, 'Efflorescence and vapor-barrier repair, concrete spalling repair, fog coating, and complete re-stucco.'],
      [{ text: 'Railings & Siding', bold: true, color: CORE_BLUE }, 'Wrought-iron repair or new rail fabrication; siding from 100% natural to 100% composite.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  subHeader('Footprint, leadership, and credentials (verified)'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'Founded', bold: true }, 'More than a decade in operation. Sources disagree on the exact year — the site says "10+ years," LinkedIn lists 2008, and the current business registration dates to 2016 — so we treat the founding year as a discovery item, not a claim.'],
      [{ text: 'Leadership', bold: true }, 'Gabe Cooley, President and founder, with 15-plus years focused on reconstruction for common-interest developments. The team includes a COO (Jennifer Longnion), a Head of Construction (Giorgio Asciutto), a Director of Strategic Accounts (Lori Gilbert), a Lead Estimator (Dan Poe), and named business-development and project-management staff.'],
      [{ text: 'Location & market', bold: true }, 'Headquartered in Escondido, CA; CACM lists the regions served as Orange County and San Diego, and a NorCal Territory Manager signals expansion north.'],
      [{ text: 'Scale', bold: true }, 'A self-reported 3,500-plus homes, commercial buildings, and HOA communities completed. LinkedIn lists the firm at 11–50 employees (about 29 employees visible on the platform).'],
      [{ text: 'Licensing', bold: true }, 'California General Building contractor license B-1019483 (active) and a C-33 Painting & Decorating classification; the site also references an A General Engineering classification (one to confirm against the CSLB record).'],
      [{ text: 'Industry standing', bold: true }, 'A CACM (California Association of Community Managers) Industry Partner at the "Plus" tier, listed under General Contractors for OC and San Diego, and a CAI Orange County business partner listed as a Construction Defect Specialist. Rayco exhibits at CACM seminars.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your annual revenue or true field headcount; your current bid pipeline, win rate, or average project value; which CRM, estimating, or project-management tools you run; how you generate leads today beyond your evident referral and CACM/CAI presence; or your EPA RRP lead-safe certification status. These are the questions in Section 14 — and the answers reshape everything that follows.', CORE_ORANGE),
];

// ============================================================ SEC 02 — HOW WORK IS WON
const section2 = [
  ...sectionHeader('How Rayco Wins & Delivers Work', CORE_BLUE, '02'),
  p('A reconstruction firm runs on a cycle: work comes in through managers and bid lists, skilled field crews restore the building, and those results — referenced well and easy to find — bring in the next community. AI can strengthen the front of that cycle without touching the craft at its center.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'How Rayco wins and delivers work', 612),
  caption('Figure 02.0 — Work in (left), reconstruct and waterproof (center, the craft), proven outcomes (right). The orange band shows where AI plugs in — the commercial front end only; it never touches the field reconstruction.'),
  buildTable(
    [{ label: 'Stage', weight: 24 }, { label: 'What it is today', weight: 46 }, { label: 'Where AI helps', weight: 30 }],
    [
      [{ text: 'Work in', bold: true, color: TEAL }, 'RFPs and bid invitations from construction managers and boards; referrals and approved-vendor lists at management companies; CACM / CAI presence.', 'Account & deadline intelligence; faster, stronger bids.'],
      [{ text: 'Reconstruct & waterproof', bold: true, color: DARK_CHARCOAL }, 'The crown jewel: licensed multi-trade field reconstruction of the building envelope.', 'Nothing. AI does not touch this.'],
      [{ text: 'Proven outcomes', bold: true, color: CORE_BLUE }, 'Restored envelopes, completed SB 326 repairs, warranty and annual inspections, referenceable communities.', 'Case studies; reviews; reputation made findable.'],
    ], { headerColor: TEAL }),
  spacer(80),
  pRuns([{ text: 'The craft is not the constraint — reach and reputation are. ', bold: true, color: DARK_CHARCOAL }, { text: 'A reconstruction firm lives on a steady flow of the right bid invitations, and on being trusted enough to make the shortlist before price is even discussed. When a community manager is choosing who to invite, the decision is shaped by who they can find, who their peers recommend, and whose reviews and references hold up. That is exactly the part of the cycle where a busy team is most stretched, and exactly where AI creates leverage: surfacing the communities on a deadline, making Rayco easy to find and verify, and turning a decade of work into proof a manager can trust at a glance.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — MARKET & SB 326/721
const section3 = [
  ...sectionHeader('The Market & the SB 326 / SB 721 Clock', CORE_BLUE, '03'),
  p('The most important fact about Rayco’s market in 2026 is that California law has put a large, recurring share of its demand on a fixed schedule. The statutes below are quoted from the California Legislature; the deadlines are exact and worth getting precisely right — most vendors state them wrong.', { spaceAfter: 130 }),
  kpiRow([
    { number: 'SB 326', label: 'HOAs / condos — Civil Code §5551', color: CORE_BLUE },
    { number: '9 yrs', label: 'SB 326 inspection cycle (first due 1/1/2025)', color: CORE_ORANGE },
    { number: 'SB 721', label: 'apartments — Health & Safety §17973', color: TEAL },
    { number: '6 yrs', label: 'SB 721 cycle (first due 1/1/2026)', color: GOLD },
  ]),
  spacer(150),
  h3('SB 326 — the HOA balcony law that drives reserve-funded reconstruction'),
  p('SB 326 (Civil Code §5551) requires every California common-interest development with three or more attached units to have its wood-framed "exterior elevated elements" — balconies, decks, stairways, walkways, and their railings more than six feet above the ground — inspected by a licensed structural or civil engineer or architect. The statute is explicit on timing: the first inspection had to be completed by January 1, 2025, and then "every nine years thereafter in coordination with the reserve study inspection." When an inspection finds damage, the inspector reports it to the board, the finding is folded into the reserve study, and — if there is an immediate safety threat — the association must restrict access until repairs are completed and approved. Crucially, the inspector diagnoses; the inspector does not repair. The repair is a separate, permitted reconstruction job.', { spaceAfter: 120 }),
  h3('SB 721 — the parallel apartment cycle'),
  p('SB 721 (Health & Safety Code §17973) puts the same logic on rental apartment buildings of three or more units. After AB 2579 extended the original deadline by a year, the first inspection must be completed by January 1, 2026, and then every six years thereafter. For apartments only, the law carries teeth that the HOA statute does not: if required repairs are not completed within the statutory window, civil penalties of $100 to $500 per day can accrue, along with a recordable building-safety lien. (Two facts to keep straight, because they are widely mis-stated: the daily penalty applies to SB 721 apartments only, not to SB 326 HOAs; and AB 2579 extended SB 721 only — the SB 326 HOA deadline stayed January 1, 2025.)', { spaceAfter: 120 }),
  h3('Why this is a demand engine, not a one-time event'),
  p('The two laws together create a mandatory, recurring inspect-then-repair pipeline. Licensed inspectors find deteriorated framing, dry rot, failed waterproofing and flashing, and unsafe railings — and then someone has to fix them, under permit, often on a deadline, and pay for it through reserves, a special assessment, or a bank loan. Rayco’s service lines — structural wood and dry-rot reconstruction, deck and balcony rebuilds, waterproof coatings, flashing, and railings — map almost exactly onto that mandated repair scope, and Rayco already markets SB 326 services with region-specific intake. Because the inspections recur on a nine-year (HOA) and six-year (apartment) cycle, the demand does not go away after the first wave; it regenerates. The strategic point for this blueprint is narrow and powerful: a predictable, legally-driven stream of reconstruction work is moving through California’s HOAs and apartments right now, and the firms that win it are the ones a manager can find and trust at the moment the inspection report lands.', { spaceAfter: 120 }),
  calloutBox('Why this matters for an AI plan',
    'A deadline-driven market rewards knowing which communities are on the clock; a reserve-funded buyer rewards being trusted before the bid; a recurring cycle rewards a system that watches it continuously; and a lean team rewards automation that does the watching and the first drafting. Every one of these forces points at a specific capability later in this blueprint — and none asks Rayco to change how it builds, only to put its proven work in front of the people now funding exactly this kind of repair.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where Growth Lives', CORE_BLUE, '04'),
  p('For a reconstruction firm that sells to a known universe of managers and boards, "growth" is not one wide sales funnel. It is four levers — and AI supports each while keeping your team at the center of every relationship.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Lever', weight: 24 }, { label: 'What it looks like for Rayco', weight: 50 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Be found & trusted', bold: true, color: CORE_BLUE }, 'Surface when a manager searches for a reconstruction contractor — and be backed by reviews and references that hold up when they check.', 'Get found'],
      [{ text: 'Win more bids', bold: true, color: CORE_BLUE }, 'See the communities on an SB 326 deadline early, get on more pre-qualified bid lists, and respond faster with stronger, spec-matched proposals.', 'Win work'],
      [{ text: 'Deepen accounts', bold: true, color: CORE_ORANGE }, 'Turn one community into a management-company portfolio — earn preferred-vendor status so a single relationship unlocks many associations.', 'Win work'],
      [{ text: 'Respond faster', bold: true, color: CORE_ORANGE }, 'Cut the time the team spends on proposals, vendor-qualification packets, and follow-up, so estimators and PMs stay on the work that wins and delivers jobs.', 'Operate'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first lever makes Rayco easy to choose; the second grows the flow of the right bids; the third compounds a single win into a portfolio; the fourth gives a lean team back its time. None of them asks Rayco to be a different company — they ask only that its proven reconstruction work be seen, sourced, and won more often.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — BUYERS & CHANNELS
const section5 = [
  ...sectionHeader('Buyers & the Decision Chain', CORE_BLUE, '05'),
  p('Rayco does not sell to a broad market; it sells into a decision chain. A board decides, but a community manager almost always sources and recommends, and a construction manager often controls the bid list. The map below places the players by how much portfolio leverage each carries and how actively each is sourcing in 2026 — archetypes to calibrate against your real pipeline at discovery, not a ranked account list.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Buyer and decision-chain map', 560),
  caption('Figure 05.0 — The decision chain by portfolio leverage and current sourcing intensity. Bubble size approximates relative leverage; calibrate against your real pipeline at discovery.'),
  buildTable(
    [{ label: 'Player', weight: 24 }, { label: 'Role in the decision', weight: 40 }, { label: 'How AI helps Rayco reach & win them', weight: 36 }],
    [
      [{ text: 'Community management companies', bold: true, color: CORE_BLUE }, 'Employ the managers and keep approved-vendor lists across portfolios of many associations — the highest-leverage relationship.', 'Map which communities each firm manages; pursue portfolio-wide vendor approval.'],
      [{ text: 'HOA boards', bold: true, color: CORE_ORANGE }, 'The deciders — elected volunteer fiduciaries who approve major contracts and reserve spend by vote.', 'Board-ready SB 326 and reserve content; references and reviews that build trust before the vote.'],
      [{ text: 'Community association managers (CAMs)', bold: true, color: TEAL }, 'The gatekeepers — solicit bids, evaluate proposals, and recommend a contractor to the board.', 'Be easy to find and verify; structured, personalized follow-up after CACM / CAI events.'],
      [{ text: 'Construction managers / specifiers', bold: true, color: GREEN }, 'Often hired by the board to write the specification and control the pre-qualified bid list.', 'Faster, spec-matched bid responses; a credible, current capability profile.'],
      [{ text: 'SB 326 / overdue-inspection communities', bold: true, color: GOLD }, 'CIDs entering their nine-year cycle or already flagged for elevated-element repair — sourcing now, on a clock.', 'Account intelligence that surfaces them early, while the bid list is still forming.'],
      [{ text: 'Commercial / mixed-use property', bold: true, color: BRAND_GREY }, 'A selective adjacency to the HOA core, with its own owners and managers.', 'Authority content and search presence for commercial exterior reconstruction terms.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your CRM. The named management firms in your market — FirstService Residential, Seabreeze, Powerstone, Action, Keystone, and others — are the kind of accounts this engine targets, but which ones matter most by value, by win probability, and by fit with your capacity is a discovery question. We would rather build the plan around your real relationships and priorities than around our assumptions about them.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE
const section6 = [
  ...sectionHeader('The Visibility & Reputation Landscape', CORE_BLUE, '06'),
  p('Rayco competes for attention and trust as much as for contracts — for the same managers and boards, and for the same search results, directory listings, and reviews. The throughline below is discoverability and reputation set against real reconstruction capability, because Rayco’s gap is reach and review depth, not craft.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Visibility and reputation landscape', 560),
  caption('Figure 06.0 — A strategic assessment, not a measured score, and a discovery item rather than a verified benchmark. Rayco’s project proof is real; its public review depth and discoverability are the open lane.'),
  buildTable(
    [{ label: 'Who competes for the same buyers', weight: 30 }, { label: 'Where they are strong', weight: 36 }, { label: 'Visibility / reputation read', weight: 34 }],
    [
      [{ text: 'EmpireWorks Reconstruction', bold: true, color: CORE_BLUE }, 'Statewide scale; a CACM industry partner; the category’s most-reviewed full-scope reconstruction name.', 'More visible and far more reviewed (200-plus reviews) than Rayco.'],
      [{ text: 'BRR Contractors (San Diego)', bold: true, color: CORE_BLUE }, 'Deep SB 326 / SB 721 balcony and deck reputation; the largest review base in the SD balcony niche.', 'Reputation-led — 139 Yelp and 600-plus Angi reviews; narrower scope.'],
      [{ text: 'Pacific Western, 24HRC, Bay Cities', bold: true, color: CORE_BLUE }, 'Regional HOA depth (SD and OC); Bay Cities markets SB 326 / 721 content actively.', 'Strong local reputations and, for Bay Cities, an SB 326 content lead.'],
      [{ text: 'CACM / CAI directories & HOAManagement', bold: true, color: CORE_BLUE }, 'The buyer-side lists managers actually browse when sourcing a vendor.', 'Rayco is listed (CACM Plus + CAI-OC) — parity here, an asset to build on.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space — and an honest caveat',
    ['Few competitors can match Rayco’s breadth of service and decade of completed communities. But several are easier to find and carry far deeper public review trails. A firm that pairs genuinely proven reconstruction with modern discoverability and a strong, current reputation would occupy a corner few hold — credible when a manager checks, and actually present when they search. That is the open lane.',
     'The caveat: a rigorous, named win/loss map (which firms take which communities, and where Rayco wins or loses) was not built from public data in this pass. We would rather research it properly with you than assert it — it is a discovery deliverable.'], CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Rayco’s public digital footprint as observed in June 2026. The point is not criticism — it is that the gap between the quality of the reconstruction work and the reach of its digital presence is, itself, the opportunity. Counts drawn from third-party platforms are labeled "reported" and should be confirmed at the source.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 22 }, { label: 'What we observed (June 2026)', weight: 52 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Reviews / reputation', bold: true, color: CRITICAL }, 'A reported 3.4-star Google rating across about 27 reviews (via aggregator and search), with roughly 83 Yelp reviews. Well below competitors carrying 130–250-plus reviews.', 'A systematic reputation engine.'],
      [{ text: 'Website content', bold: true, color: CRITICAL }, 'A clear services site, but no blog, news, or resource hub — the /resources and /careers pages return errors. Nothing search or AI can surface as current, authoritative content.', 'Board-ready SB 326 content + authority.'],
      [{ text: 'Search & AEO presence', bold: true, color: CRITICAL }, 'Rayco did not surface as a named answer for non-branded buyer searches like "HOA reconstruction contractor Orange County / San Diego"; category authority skews to larger, more-published competitors.', 'Be the cited answer, not absent.'],
      [{ text: 'AI answer presence (GEO)', bold: true }, 'Because live content is thin, AI assistants have little current Rayco material to cite when a manager asks them to recommend a reconstruction contractor.', 'Show up where buyers now ask first.'],
      [{ text: 'LinkedIn', bold: true }, 'An active company page (about 665 followers) with periodic posts — SB 326 campaigns, CACM seminar announcements, hiring. A real base to build on, not a blank slate.', 'Convert presence into authority.'],
      [{ text: 'Directories', bold: true, color: PASS }, 'Listed in the CACM Industry Partner directory (Plus tier) and the CAI-OC business-partner directory — exactly where managers look. A genuine strength.', 'Leverage and extend the listings.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most important finding',
    'Rayco has the memberships and the track record, but it is thin on the two things a 2026 buyer checks first — search presence and review depth — at the exact moment a state law is sending thousands of HOA balcony repairs to bid. Neither the work nor the demand is in question; only the connection between them is underbuilt. That connection is the cheapest, highest-leverage place to start, and a modern presence with a live reputation engine can be standing in weeks.', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('Before the plan, the proof. The builds below are real Technijian capabilities; each is mapped to a specific Rayco use case. Where a build is described by an industry profile rather than a named client, it is scope and effort only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: Local SEO + Reputation & Reviews System',
    'What we built: AI-driven local-SEO and review systems that lift map-pack ranking and automate review solicitation and response for service businesses whose new work depends on online reputation. How it applies: a reputation engine that closes Rayco’s 3.4-star / 27-review gap, and a Google Business Profile and local-search presence that puts Rayco in front of managers searching for a reconstruction contractor.', CORE_ORANGE),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini with search and analytics tools) that produces and optimizes authority content and tracks whether AI assistants cite it. How it applies: board-ready SB 326 and reserve-funding content that makes Rayco the answer when a manager searches — or asks an AI assistant — who handles HOA balcony reconstruction in OC or San Diego.', CORE_BLUE),
  calloutBox('Proven build: AI Document Intelligence (RFPs: days to minutes)',
    'What we built: an AI pipeline that turns dense, repetitive documents into structured data and drafted output, deployed for a regulated firm’s compliance workflows. How it applies: first drafts of bid responses mapped to a construction manager’s specification, and the licensing/insurance/reference packets management firms require to add a vendor — so estimators edit rather than start from a blank page.', TEAL),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: searchable knowledge systems and an AI-native software practice that ships builds far faster than traditional development. How it applies: a searchable knowledge graph of Rayco’s 3,500-plus past projects — comparable scopes, costs, and photos retrievable for faster, more accurate bids — plus an SB 326 account-intelligence and pipeline dashboard for a lean team.', CORE_BLUE),
  subHeader('"Is this affordable for a firm our size?" — the multi-model discipline'),
  p('A fair question for any privately-held firm. Technijian does not wire every task to one expensive AI model. We run a routed, multi-model platform and send each sub-task to the most cost-effective model that does it well: lightweight models for high-volume work like watching the inspection cycle and enriching prospect lists, mid-tier models for drafting proposals and outreach, and frontier models only for the small slice that needs deep judgment. In practice that runs well below the cost of routing everything to one premium tool — typically a large reduction in run cost with no loss of quality on the work that matters — and it means the engine scales with the work rather than carrying a fixed overhead a contractor cannot justify.', { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — UNDERSTANDING AI
const section9 = [
  ...sectionHeader('Understanding AI — A Field Guide for Rayco Leadership', CORE_BLUE, '09'),
  p('A short, vendor-neutral primer so the conversation rests on shared ground — written for a builder, not a marketer. Each point is anchored to an independent framework, not a sales claim, and the guardrails are written for a firm whose reputation rests on doing the work right.', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'You need to know what AI can and cannot do, not how to build it. The most useful distinction is between ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable and low-risk, e.g. "draft a bid response from this spec and our past scopes") and ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps — flexible, needs oversight, e.g. "watch for communities entering their SB 326 cycle and flag the fits"). The principle, from Anthropic’s engineering guidance, is to use the simplest thing that works: start with drafting and monitoring that pay off fast, and add autonomy only where it earns its keep.' }], { spaceAfter: 120 }),
  h3('Where Rayco sits today — the AI maturity ladder'),
  p('On a standard five-stage view (Foundational, Emerging, Operational, Scaled, Transformational), Rayco today sits at the Foundational-to-Emerging rungs on the commercial side: real memberships and a track record, but no content engine, no reputation automation, and no system watching the bid cycle. That is exactly where most established reconstruction firms sit — the leaders are one or two rungs up, and the gap closes in months, not years. This engagement is best understood as moving Rayco up two rungs on the commercial front end, not buying a product.', { spaceAfter: 120 }),
  h3('Adopting AI responsibly — three risks every leader manages'),
  bulletRuns([{ text: 'Accuracy — every claim in a bid must be true. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI produces a fluent answer, not always a correct one. The rule, aligned with the NIST AI Risk Management Framework: AI drafts; a qualified person verifies every scope, price, and reference before it reaches a manager or board. One overstated claim in a proposal costs credibility with a sophisticated buyer.' }]),
  bulletRuns([{ text: 'Data care — protect what is private. ', bold: true, color: DARK_CHARCOAL }, { text: 'Community details, board contacts, and your own pricing are not for public AI tools. We use private, governed deployments with no-training terms, and AI works with public-facing facts unless you choose a secured internal tool.' }]),
  bulletRuns([{ text: 'The team owns the relationship. ', bold: true, color: DARK_CHARCOAL }, { text: 'AI handles research, monitoring, and first drafts. Your BD team and estimators own every conversation, every walk, and every commitment to a community.' }]),
  bulletRuns([{ text: 'AI stays on the commercial side. ', bold: true, color: DARK_CHARCOAL }, { text: 'Nothing in this plan applies AI to the reconstruction itself — the scoping, the crews, the waterproofing, the field quality. The craft stays entirely human and entirely yours; AI works the front office.' }]),
  h3('Why a partner, versus do-it-yourself or a new hire'),
  p('Free tools are cheap but leave you to assemble, secure, and govern the whole system — time a running contractor does not have. A capable full-time marketing or business-development hire is expensive (often $150K-plus all-in) and still cannot cover strategy, content, search, reputation, automation, and software alone. A partner provides all of that at a fraction of the cost, with proven builds — and we architect, build, and operationalize through to something your team actually uses, rather than handing over a slide deck.', { spaceAfter: 120 }),
];

// ============================================================ SEC 10 — AI ENGINE
const section10 = [
  ...sectionHeader('The AI Growth & Bid-Intelligence Engine', CORE_BLUE, '10'),
  p('The engine has three columns: be found and trusted, win more bids, and respond and operate faster. Each capability names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Rayco AI growth and bid-intelligence engine', 624),
  caption('Figure 10.0 — Be found and trusted (left); win more bids (center); respond and operate faster (right). AI works the front end and drafts; a person owns every relationship and verifies every claim.'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Rayco', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Modern site + SB 326 content', 'A fast site with board-ready SB 326 and reserve-funding explainers that answer what managers and boards ask.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Reputation & reviews engine', 'Systematic review solicitation and response across Google, Yelp, and Birdeye to close the review gap.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['AEO / GEO + local search', 'Be the answer for "HOA reconstruction contractor OC / San Diego," in search and AI assistants.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['SB 326 / 721 account intelligence', 'Watch the inspection cycle; flag communities entering their window or overdue for elevated-element repair.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Portfolio mapping', 'Map which communities FirstService, Seabreeze, Powerstone, and Action manage to pursue portfolio approval.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['RFP & spec response drafting', 'First drafts of bid responses mapped to the construction manager’s specification; estimators refine.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Event follow-up & outreach', 'Capture CACM / CAI booth and seminar leads; structured, personalized manager follow-up.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Knowledge graph + dashboard', 'Make 3,500-plus past projects searchable; route inquiries; a measured pipeline dashboard for the team.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'AI assists the people who win and deliver the work; it does not replace the estimator who earns a board’s trust, and it never touches the field reconstruction. Every draft is checked, every figure is verified against the record, and no private community data goes into a public tool. That is how this stays credible with the managers and boards Rayco needs to win.', TEAL),
];

// ============================================================ SEC 11 — INVESTMENT
const section11 = [
  ...sectionHeader('Investment & Value at Stake', CORE_BLUE, '11'),
  p('We price from real, published service ranges, we start small and prove value before scaling, and we model returns only after discovery. No figure below is a quote, and none is presented as a guaranteed result.', { spaceAfter: 130 }),
  subHeader('Start small, prove it, then grow'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Start — be found & trusted', bold: true, color: CORE_BLUE }, 'A short AI Readiness session, a modern site with board-ready SB 326 content, local-search presence, and a reputation engine that closes the review gap. The cheapest, fastest win.', 'My SEO (entry)'],
      [{ text: 'Grow — win more bids', bold: true, color: CORE_BLUE }, 'SB 326 / 721 account intelligence, management-company portfolio mapping, AI-assisted bid and spec-response drafting, and CACM / CAI event follow-up.', 'My SEO + My AI'],
      [{ text: 'Scale — operate & sustain', bold: true, color: CORE_BLUE }, 'A searchable knowledge graph of 3,500-plus projects, inquiry triage, vendor-qualification packets, and a measured pipeline dashboard.', 'My Dev + ongoing support'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What it costs — published ranges, scaled to your firm'),
  buildTable(
    [{ label: 'Component', weight: 44 }, { label: 'Basis', weight: 30 }, { label: 'Note', weight: 26 }],
    [
      [{ text: 'My SEO — site, reputation, AEO/GEO, SB 326 content', bold: true }, 'published monthly tiers', 'recurring (the entry)'],
      [{ text: 'My AI — bid intelligence, account & portfolio, proposals', bold: true }, 'published monthly tiers, by workflow', 'recurring + build'],
      ['My Dev — knowledge graph / dashboard build', 'project-based (US dev rate card)', 'one-time build (later)'],
      ['AI Readiness session', 'small fixed engagement', 'one-time'],
      ['Discovery & strategy', 'included in the first conversation', 'no cost'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a project-based reconstruction firm, the right way to think about return is value at stake, not a revenue multiple we invent. A single additional HOA reconstruction or full exterior-rehab contract is worth far more than a year of this engine — so the engine pays for itself if it helps win even one bid that would otherwise never have reached you, or one management-company portfolio you would not otherwise have opened. We will put conservative, mid, and upside numbers against that — using your real average project value, win rate, and capacity — once discovery gives us the figures (Section 14). Until then, any single ROI claim would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
  calloutBox('A note on fit',
    'We scope the first engagement to fit your firm and to prove out before it scales — get found and trusted first, because that is the cheapest, fastest win and it lifts every bid that follows, then add the bid-intelligence automation once the presence is live. The goal is a plan that starts where it pays for itself and grows only as it earns the next step.', CORE_ORANGE),
];

// ============================================================ SEC 12 — ROADMAP
const section12 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '12'),
  p('Staged so each phase pays for itself — in bids surfaced or won — before the next begins, and sequenced to start with the lowest-cost, fastest win: being found and trusted.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 12.0 — Be found and trusted, then win more bids, then scale and sustain. Targets and sequence calibrate at discovery and flex to your capacity.'),
  p('Phase one stands up a modern site with board-ready SB 326 content, turns on a reputation engine to close the review gap, and gets Rayco discoverable for the terms managers actually search — the lowest-cost, highest-leverage fixes. Phase two turns on SB 326 / 721 account intelligence and management-company portfolio mapping, and adds AI-assisted bid and spec-response drafting so the team responds faster and stronger. Phase three makes the firm’s 3,500-plus projects searchable, adds inquiry triage and vendor-qualification packets, and stands up a pipeline dashboard so every claim in this plan is measured against real bids surfaced, pursued, and won.', { spaceAfter: 120 }),
];

// ============================================================ SEC 13 — QUICK WINS
const section13 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '13'),
  p('Five actions Rayco can take now, with no Technijian contract, that create value and set up the work:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Claim and complete the Google Business Profile, then ask your last 10 happy communities for a review. ', bold: true, color: DARK_CHARCOAL }, { text: 'Reviews are the first thing a manager checks, and they are free. A short, direct ask after a completed job is the single fastest way to lift a 3.4-star profile.' }]),
  bulletRuns([{ text: 'Publish one board-ready SB 326 explainer. ', bold: true, color: DARK_CHARCOAL }, { text: 'A clear one-page guide — what the law requires, the deadline, what a repair involves — is exactly what a manager forwards to a board, and content you do not have today.' }]),
  bulletRuns([{ text: 'Fix the broken site pages. ', bold: true, color: DARK_CHARCOAL }, { text: 'The /resources and /careers pages return errors; even removing the dead links, and adding a simple "SB 326 Resources" section, stops the site working against you.' }]),
  bulletRuns([{ text: 'Pick the three searches you most want to own. ', bold: true, color: DARK_CHARCOAL }, { text: 'Whether it is "HOA reconstruction contractor Orange County," "SB 326 balcony repair San Diego," or "multifamily exterior rehab" — that choice points the whole content effort.' }]),
  bulletRuns([{ text: 'List your top 10 target management companies. ', bold: true, color: DARK_CHARCOAL }, { text: 'Naming the portfolios you most want on — FirstService, Seabreeze, Powerstone, Action, and the rest — turns the account-intelligence engine on with focus from day one.' }]),
];

// ============================================================ SEC 14 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & pipeline', CORE_BLUE, [
    'What is a typical reconstruction or exterior-rehab project worth, and how many active bids are you tracking at once?',
    'What is your rough win rate on the bids you pursue, and what is your current capacity to take on more work?',
    'How long is a typical cycle from first contact (or RFP) to a signed contract?',
  ]),
  ...qGroup('B · Buyers & relationships', CORE_ORANGE, [
    'Which management companies do you already have strong relationships with, and which would you most like to break into?',
    'How much of your work today comes from SB 326 / 721 repairs versus other reconstruction and rehab?',
    'Do you sell to commercial / mixed-use property as well as HOAs, and do you want to grow that?',
  ]),
  ...qGroup('C · Sales & systems', TEAL, [
    'How do you find and win work today — referrals, CACM / CAI, repeat managers, inbound, or outbound?',
    'What CRM, estimating, or project-management tools do you use, and how are bids and proposals produced today?',
    'How much of the team’s time goes to business development and proposals versus running jobs?',
  ]),
  ...qGroup('D · People & decision', CHARTREUSE, [
    'Who owns marketing and business development today, and is there appetite to publish regular SB 326 / reconstruction content?',
    'What would a successful next year look like — more bids, a specific portfolio opened, a target number of new communities?',
    'Who decides on an initiative like this, who else weighs in, and what is the right first step for your team?',
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
      [{ text: '2', bold: true, color: CORE_BLUE }, 'An AI Readiness session — map your business-development workflow and return a prioritized, costed plan, scaled to your firm.', 'A small, fixed engagement; the plan is yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Start small — be found and trusted first, then add the bid-intelligence automation; grow as each step proves out.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['The easiest first step is a short working session on where AI creates measurable value for Rayco — no obligation, and nothing about managed IT. We will come having done our homework, and we will be honest about what is worth doing now, what can wait, and what value is realistically at stake. And if the answer is "not now," we will respect it.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain. We help organizations move from AI curiosity to operational deployment — we architect, build, and operationalize through to production. Our dedicated pod model assigns a named team to each client, and our Irvine, California and Panchkula, India offices provide coverage across time zones. Our approach is practical, cost-conscious, and AI-forward — and for a reconstruction firm, we keep AI on the commercial front end so your field work stays entirely your own.', { spaceAfter: 140 }),
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
  bullet('Company, service lines, "3,500+" projects, and "10+ years" — drawn from Rayco’s own website and LinkedIn (self-reported). Founding year is left open because sources disagree (site "10+ years," LinkedIn 2008, business registration 2016).'),
  bullet('Leadership names and titles (Gabe Cooley, President; Jennifer Longnion, COO; Giorgio Asciutto, Head of Construction; Lori Gilbert, Director of Strategic Accounts; Dan Poe, Lead Estimator; and BD/PM staff) — VERIFIED from the Rayco team page.'),
  bullet('License B-1019483 (active, CSLB) and C-33 classification — VERIFIED; the A General Engineering classification is claimed on the site and should be confirmed against the CSLB record.'),
  bullet('CACM Industry Partner (Plus tier, General Contractors, OC + San Diego) and CAI Orange County business partner (Construction Defect Specialists) — VERIFIED from the association directories.'),
  bullet('SB 326 (Civil Code §5551): wood-framed exterior elevated elements, licensed engineer/architect inspector, first inspection by January 1, 2025, then every nine years; no daily penalty for HOAs — VERIFIED from the California Legislature. SB 721 (Health & Safety §17973): apartments, first inspection by January 1, 2026 (extended by AB 2579), then every six years, $100–$500/day penalty for non-compliance — VERIFIED from the California Legislature.'),
  bullet('Digital-presence figures — a reported 3.4-star / ~27-review Google profile and ~83 Yelp reviews are drawn from third-party aggregators and search, labeled "reported," and should be confirmed at the source; ~665 LinkedIn followers is self-reported; the /resources and /careers pages were observed to return errors in June 2026.'),
  bullet('Current revenue, field headcount, bid pipeline, win rate, average project value, current marketing/CRM/estimating/PM tools, lead-generation mix, and EPA RRP certification status — NOT independently confirmed; listed as questions in Section 14.'),
  bullet('Competitor names (EmpireWorks, BRR Contractors, Pacific Western, 24HRC, Bay Cities, Trifecta, Saarman) and their review counts — drawn from public review platforms and directories as a general read, not a verified win/loss benchmark.'),
  subHeader('Selected sources'),
  ...[
    'Rayco — company website (home, services, about, team pages): raycoexteriors.com.',
    'Firm profile — LinkedIn (Rayco Exteriors); CACM Industry Partner Directory; CAI Orange County business-partner directory; CSLB license record; BBB.',
    'Reviews — Google Business Profile / Birdeye (reported 3.4-star / ~27 reviews); Yelp (~83 reviews).',
    'Statutes — California Legislature: Civil Code §5551 (SB 326), Health & Safety Code §17973 (SB 721), AB 2579, Civil Code §5550 (reserve studies).',
    'Buyer & process context — CACM and CAI / ECHO / Davis-Stirling materials on HOA boards, community-association management, reserve studies, and bidding practice.',
    'Competitors — EmpireWorks, BRR Contractors, Pacific Western Painting & Construction, 24HRC, Bay Cities Construction, Trifecta, Saarman (public review platforms and directories).',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and statutory figures describe the wider California HOA/CID reconstruction environment; figures specific to Rayco are drawn from public sources and the company’s own statements, with anything uncertain deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
  p('Note on review figures: counts drawn from third-party aggregators are labeled "reported" and can lag or mis-match the source platform; we recommend confirming them directly on Google and Yelp. No Rayco revenue figure is cited because none is public and verified.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rayco Exteriors  ·  AI Growth & Bid-Intelligence Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Rayco Exteriors — AI Growth & Bid-Intelligence Blueprint', description: 'A facts-only AI Growth & Bid-Intelligence blueprint for Rayco Exteriors, prepared by Technijian.',
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Rayco-Exteriors-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
