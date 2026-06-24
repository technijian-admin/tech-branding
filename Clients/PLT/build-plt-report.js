// Pangea Luxe Travel (PLT) — AI Growth & Integration Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY: verified facts, estimates labeled,
// unknowns -> Questions section. Authentic logo. Boutique luxury travel advisory,
// husband-and-wife team (Ryan & Katie McKibben), Cadence Travel affiliate, South Orange County CA.

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
const PURPLE = '7B2D8B';
const GOLD = 'C9922A';
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 24, 2026';
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
// Detailed per-persona profile card (RKE pattern): colored header (name + subtitle) over label/value rows.
function personaCard(title, subtitle, color, body) {
  const rows = body.map((b, i) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.24), type: WidthType.DXA }, shading: { fill: i % 2 === 1 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.TOP, children: [new Paragraph({ children: [new TextRun({ text: b.label, size: 18, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.24), type: WidthType.DXA }, shading: { fill: i % 2 === 1 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.TOP, children: [new Paragraph({ spacing: { line: 288 }, children: [new TextRun({ text: b.value, size: 20, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] }));
  const headerRow = new TableRow({ cantSplit: true, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, columnSpan: 2, shading: { fill: color, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 150, bottom: 150, left: 200, right: 200 }, children: [
    new Paragraph({ children: [new TextRun({ text: title, size: 27, bold: true, color: WHITE, font: FONT_HEAD })] }),
    new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: subtitle, size: 18, color: WHITE, italics: true, font: FONT_BODY })] }),
  ] })] });
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.24), CONTENT_W - Math.floor(CONTENT_W * 0.24)], rows: [headerRow, ...rows] });
}

// ============================================================ COVER
const cover = [
  colorBar(CORE_BLUE, 200), spacer(780),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(320),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }), spacer(210),
  centered('AI GROWTH & INTEGRATION', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('BLUEPRINT', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('Pangea Luxe Travel', { size: 50, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'How a two-person luxury advisory wins more travelers and serves them in a fraction of the time — built on verified facts, with the questions that complete the picture', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(820),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Ryan & Katie McKibben — Pangea Luxe Travel', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR PANGEA LUXE TRAVEL', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('This blueprint was prepared from public research, before any discovery call. It holds itself to a simple discipline:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Pangea Luxe Travel is drawn from your own website, your Virtuoso advisor profiles, Cadence Travel’s site, and public directories — and is cited in the Appendix. We have not assumed your revenue, your client count, your follower numbers, or your review counts.' }]),
  bulletRuns([{ text: 'It labels every estimate. ', bold: true, color: DARK_CHARCOAL }, { text: 'Market figures and the ROI model are clearly marked as market context or illustrative estimates — never presented as your results. The real numbers come from a short discovery call.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer needs information only you have, we ask rather than guess. Section 14 is a short questionnaire that completes the analysis.' }]),
  calloutBox('Two things we framed carefully',
    ['First, your credentials are real but conferred through Cadence: access to the Virtuoso network, the Forbes Travel-endorsed network, and elite hotel status all come through your host agency. We treat that as borrowed authority — a genuine asset to amplify, not something to overstate as self-built. Second, this is not a business with "no technology": you already run a website, Instagram, and Virtuoso tools. This blueprint is about going further with AI — and especially about giving two people the back-office reach of a much larger agency.',
     'That is the standard of evidence behind every figure here.'], TEAL),
];

// ============================================================ TOC
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', {
    hyperlink: true,
    headingStyleRange: '1-1',
  }),
];

// ============================================================ 01 EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  p('Pangea Luxe Travel is a boutique luxury travel advisory — a husband-and-wife team, Ryan & Katie McKibben — based in South Orange County, California, and operating as an independent affiliate of the Cadence Travel host agency. Founded in 2023 after the McKibbens sold a long-running food franchise and spent three years traveling to more than thirty countries, the firm specializes in luxury cruises, customized international travel, honeymoons, destination weddings, and family trips, with destination depth in Italy, the Caribbean, and Southeast Asia.', { spaceAfter: 120 }),
  p('Two strengths define the business. The first is genuine luxury credibility — through Cadence, Pangea has access to the Virtuoso network, a Forbes Travel-endorsed partner network, and elite status with the major luxury hotel groups. The second is a personal, high-touch service style that affluent travelers increasingly seek out. This blueprint works on two fronts that build on both:', { spaceAfter: 120 }),
  kpiRow([
    { number: '$1.5T+', label: 'Global luxury-travel market, 2025 (~8% CAGR)', color: CORE_BLUE },
    { number: '+76%', label: 'More travelers now seeking an advisor (Virtuoso)', color: CORE_ORANGE },
    { number: '59%', label: 'Of advisors now use AI (up from 41% in 2024)', color: TEAL },
    { number: '2023', label: 'Founded — young, with visibility to build', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  pRuns([{ text: 'Front one — win more travelers. ', bold: true, color: DARK_CHARCOAL }, { text: 'Affluent travelers find advisors through referrals, Instagram, and search — and increasingly through AI assistants. Today Pangea’s authority is real but its independent visibility is thin: one blog post, a modest social footprint, and little content for search or AI to find and cite. AI authority content, local and AI-search optimization, a visual content rhythm, and review velocity make Pangea the advisor more of the right travelers discover and trust.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'Front two — serve them in a fraction of the time. ', bold: true, color: DARK_CHARCOAL }, { text: 'This is where AI returns the most for a two-person firm, because time is the binding constraint. A boutique advisor can personally manage only so many trips at once; the limit is the hours that go into research, itineraries, quotes, and trip documents. AI drafts the itinerary, does the supplier research, assembles the quote, and produces the branded trip documents — so Ryan and Katie spend their hours on relationships and selling, not typing. Every itinerary and booking is still confirmed by a human, and client data stays in private, governed tools.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is conservative on purpose. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented revenue figure or a guessed result here. Investment is shown as real, published Technijian service ranges, and the entry program is deliberately small — sized for a growing two-person advisory, not an enterprise. Returns are modeled only after discovery calibrates them against your real trip values and the hours you spend today (Section 14).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'Your authority is borrowed from Virtuoso and Cadence — but your visibility and your time are yours to build. AI does two things at once: it makes you the advisor affluent travelers find, and it gives two people the back-office reach of a ten-person agency. That combination lets Pangea grow without burning out and without hiring before you are ready.', CORE_ORANGE),
];

// ============================================================ 02 WHO YOU ARE & HOW YOU GROW
const section2 = [
  ...sectionHeader('Who You Are & How You Grow', CORE_BLUE, '02'),
  p('Everything in this section is drawn from your website, your Virtuoso advisor profiles, Cadence Travel’s site, and public listings (see Appendix). It is the factual base the rest of the plan builds on.', { spaceAfter: 130 }),
  subHeader('The business, in verified facts'),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'What it is', bold: true }, 'A boutique luxury travel advisory — "Luxury Cruise & International Travel Specialists" — run as a husband-and-wife team.'],
      [{ text: 'Founders', bold: true }, 'Ryan & Katie McKibben. Background: ran a quick-serve food franchise for nine years, sold it, then traveled three years across 30+ countries before launching the advisory.'],
      [{ text: 'Founded', bold: true }, '2023 (per both Virtuoso advisor profiles). A young firm, building its independent presence.'],
      [{ text: 'Host agency', bold: true }, 'Independent affiliate of Cadence Travel (La Jolla, CA; founded 1995; Virtuoso member). Cadence provides supplier rates, accounting, and back-office support; Pangea owns its brand, clients, and day-to-day planning.'],
      [{ text: 'Services', bold: true }, 'Luxury travel, cruises, honeymoons, destination weddings, family travel, and business travel — six lines on the site.'],
      [{ text: 'Destination depth', bold: true }, 'Italy (Rome, Florence, Venice, Amalfi, Cinque Terre); the Bahamas (Exuma); Thailand (Chiang Mai, Chiang Rai); plus broad Virtuoso reach.'],
      [{ text: 'Location', bold: true }, 'South Orange County, CA (Ladera Ranch) — local to Technijian’s Irvine office.'],
      [{ text: 'Revenue / client volume', bold: true, color: CRITICAL }, 'Not public — we cite no figure and treat it as a discovery item.'],
    ], { headerColor: DARK_CHARCOAL }),
  subHeader('How the growth actually happens'),
  pRuns([{ text: 'Pangea grows the way boutique luxury advisories grow: referrals and repeat clients first, new-client discovery second. ', bold: true, color: DARK_CHARCOAL }, { text: 'A delighted honeymoon couple refers their friends; a family rebooks every year. That relationship core is the moat, and nothing in this plan replaces it. Around it sits the discovery layer — the affluent traveler who does not yet know you, and who looks on Google, on Instagram, and increasingly through an AI assistant before choosing an advisor. This blueprint protects and compounds the referral core (review velocity, repeat and anniversary triggers) and builds the second channel so you are not dependent on word of mouth alone.' }], { spaceAfter: 120 }),
  p('This is deliberately not a "shotgun" marketing plan. Luxury travel is a high-trust, relationship-led business; the goal is to be found and chosen by the right travelers, then to serve them so well they come back and refer — not to chase volume for its own sake.', { spaceAfter: 120 }),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your revenue, your average trip value or commission, how many active trips you handle at once, your Instagram or Facebook follower counts, your Google or Yelp review counts, which Cadence tools you use day to day, or your commission split. These are the questions in Section 14 — the answers turn this research into a costed, calibrated plan.', CORE_ORANGE),
];

// ============================================================ 03 THE MARKET MOMENT
const section3 = [
  ...sectionHeader('The Market Moment — Why Now', CORE_BLUE, '03'),
  p('The figures below are facts about the market, not claims about Pangea, and each one favors a boutique advisor who pairs human expertise with AI. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '50%', label: 'More likely to use an advisor now vs. before (ASTA)', color: CORE_BLUE },
    { number: '65%', label: 'Of affluent clients use an advisor for the human layer', color: CORE_ORANGE },
    { number: '>50%', label: 'Of travelers now plan with AI assistants', color: TEAL },
    { number: '+43%', label: 'Ultra-luxury cruise bookings, 2025 (Virtuoso)', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('The travel advisor is back — especially at the top of the market'),
  p('After years of "the internet will replace travel agents," the opposite happened. ASTA research finds half of travelers are now more likely to use an advisor than in the past — up about 14% year over year — and roughly two-thirds say planning a trip has become more complex, not less. At the luxury end the momentum is sharper: Virtuoso reported overall 2025 sales up double digits, hotel bookings up about a quarter, and ultra-luxury cruise sales up more than 40%, alongside a large rise in consumers actively seeking an advisor. Affluent travelers are not choosing an advisor to save money; they choose one for expertise, access, and an added layer of protection when a trip is expensive and the stakes are personal.', { spaceAfter: 120 }),
  h3('AI is becoming the new front door — and that cuts both ways'),
  p('At the same time, more than half of travelers now use AI assistants to help plan trips, and that share is far higher among younger affluent travelers. Search is slowly giving ground to AI answers as the place a trip begins. For a boutique advisory this is both the threat and the opportunity: the threat is that AI further commoditizes simple trip planning; the opportunity is that the same technology, in expert hands, lets two people produce in minutes what used to take hours — and be the advisor an AI assistant names when someone asks who to trust with a once-in-a-lifetime trip.', { spaceAfter: 120 }),
  h3('The tension is the whole opportunity'),
  p('Here is the pattern that matters. Affluent travelers want a human advisor more than ever — yet advisors are drowning in manual back-office work, which is exactly why a boutique advisor can only carry a limited number of active trips at once. AI does not resolve that tension by replacing the human; it resolves it by removing the grind. The research, the first-draft itinerary, the quote, the trip documents — the work that eats evenings — is the work AI does well. The relationship, the judgment, the reassurance at 9 p.m. before a big departure — the work that earns referrals — stays human. A firm that uses AI for the first and protects the second is the firm that grows.', { spaceAfter: 120 }),
  calloutBox('Why this matters for Pangea',
    'Every force points the same way: travelers want a trusted human, they start more trips through search and AI, and the advisors who win are the ones who are both visible online and fast behind the scenes. Pangea already has the trusted-human half and the luxury credibility. The plan is to add the visibility and the speed — the two things AI is best at — without changing what makes the service special.', TEAL),
];

// ============================================================ 04 PERSONAS
const section4 = [
  ...sectionHeader('The Five Traveler Personas', CORE_BLUE, '04'),
  p('A luxury advisory does not serve "travelers" in general — it serves a handful of distinct people, each booking for a different reason, with different anxieties and a different rhythm of return. Five archetypes emerge from how boutique luxury advisories actually win and keep clients, mapped to the services Pangea already offers. The map below places them by trip frequency and spend; the detailed profiles that follow are where the marketing and the service model get tailored. These are research-based archetypes to calibrate against your real book at discovery — not assumptions about your clients.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'The five traveler personas — frequency x spend', 560),
  caption('Figure 04.0 — The five personas by trip frequency and spend per trip. Bubble size approximates lifetime value; the dotted ring marks the Repeat & Referral VIP, the engine of a boutique advisory.'),
  spacer(60),
  personaCard('Persona 1 — The Honeymoon & Destination-Wedding Couple', 'Once-in-a-lifetime romance travel', CORE_ORANGE, [
    { label: 'Who they are', value: 'Engaged or newlywed couples, typically late 20s to early 40s, often dual-income professionals who will spend well above their normal travel budget for this one occasion — because it is the most important trip of their lives so far.' },
    { label: 'What they book', value: 'Honeymoons and destination weddings — the Amalfi Coast, Santorini, Bora Bora, the Maldives, Tuscany — plus pre- and post-wedding stays and room blocks for a destination ceremony.' },
    { label: 'What they value', value: 'A flawless, romantic, photograph-worthy experience with none of the logistics on their shoulders, guided by one trusted person who has "been there" and handles every detail.' },
    { label: 'Pain points', value: 'Decision overwhelm — endless options and no way to judge real quality; fear of getting a once-in-a-lifetime trip wrong; coordinating a wedding\'s worth of guests and suppliers from afar; the anxiety of the week before departure.' },
    { label: 'Decision driver', value: 'Trust and reassurance over price. They choose the advisor who feels most personally invested and most expert in their specific destination — and who answers fast when they have a question.' },
    { label: 'How AI helps you serve them', value: 'AI drafts a beautiful first-pass itinerary in minutes so you respond while they are still excited; it generates the pre-trip guide and day-by-day that makes them feel cared for; and an always-on enquiry experience answers the late-night question without costing you the evening.' },
    { label: 'Where you reach them', value: 'Instagram and Pinterest (the visual romance sell), high-intent search ("best Amalfi honeymoon advisor"), and — above all — referrals from friends whose wedding or honeymoon you made perfect.' },
  ]),
  spacer(260),
  personaCard('Persona 2 — The Milestone Celebration Couple', 'Anniversaries, big birthdays, retirements', GOLD, [
    { label: 'Who they are', value: 'Established couples, often 45 to 65, marking a significant anniversary, a milestone birthday, a retirement, or a "finally, just us" empty-nest trip — financially comfortable and willing to spend for meaning.' },
    { label: 'What they book', value: 'A signature European journey (Italy and the Amalfi Coast are central to your brand), a bucket-list cruise, or a special-occasion stay at an iconic property — with the touches (a private tour, a chef\'s-table dinner) that mark the moment.' },
    { label: 'What they value', value: 'A trip that feels personal and meaningful rather than packaged, built by an advisor who listens to the occasion — and the confidence that the details, from the anniversary surprise to the right room, are handled.' },
    { label: 'Pain points', value: 'They know what "special" feels like and fear a generic itinerary; they have limited vacation time they cannot afford to waste; and many have been burned by an impersonal online booking before.' },
    { label: 'Decision driver', value: 'Demonstrated understanding of both the destination and the occasion. They choose the advisor who shows real Italy or cruise expertise and treats the celebration itself as the point.' },
    { label: 'How AI helps you serve them', value: 'A searchable destination knowledge base surfaces your hard-won Italy and Amalfi insider detail on demand; AI assembles tailored options quickly; and anniversary triggers prompt the next milestone trip before they think to ask.' },
    { label: 'Where you reach them', value: 'Authority content and destination guides they find in search and AI assistants, reviews that prove the personal touch, and repeat or referral business from a milestone trip you already delivered.' },
  ]),
  spacer(260),
  personaCard('Persona 3 — The Multigenerational Luxury Family', 'High-complexity, high-value group travel', PURPLE, [
    { label: 'Who they are', value: 'An affluent family principal — often a grandparent or a high-earning parent, 40 to 65 — organizing a trip for several households and ages at once. This is the most logistically complex and one of the highest-value bookings a boutique advisor handles.' },
    { label: 'What they book', value: 'Large, multi-room, multi-generation trips: a villa in Tuscany, a luxury cruise, or an all-ages resort in the Caribbean or Thailand — with activities that work for toddlers, teens, and grandparents at the same time.' },
    { label: 'What they value', value: 'One trusted person who absorbs the complexity so the family principal can actually enjoy the trip too; genuinely age-appropriate planning; and the reassurance that if something goes wrong, someone has their back.' },
    { label: 'Pain points', value: 'Coordinating many travelers, budgets, and preferences; the sheer hours of research and back-and-forth; and the risk that a single wrong call — a too-long flight, a wrong-for-kids hotel — sours an expensive trip for everyone.' },
    { label: 'Decision driver', value: 'Confidence the advisor can manage the complexity flawlessly. This is the persona most likely to value an advisor precisely because the trip is too hard to self-serve.' },
    { label: 'How AI helps you serve them', value: 'AI does the heavy assembly — options, availability, and documents across many moving parts — so you can take on the complex family trip without it consuming a week, and branded trip documents keep every household on the same page.' },
    { label: 'Where you reach them', value: 'Referrals (delighted families refer other families), reviews that praise "she handled everything," and content signaling that you specialize in complex, multi-generation luxury travel.' },
  ]),
  spacer(260),
  personaCard('Persona 4 — The Luxury Cruise Enthusiast', 'Repeat premium and expedition cruisers', TEAL, [
    { label: 'Who they are', value: 'Repeat luxury and expedition cruisers, frequently 50 and older, who travel often and know what they like — a core segment for a self-described luxury cruise specialist, and a more frequent booker than most other personas.' },
    { label: 'What they book', value: 'Premium and ultra-luxury sailings (the category Virtuoso reports growing fastest), expedition voyages, and the pre- and post-cruise land stays that round out the trip.' },
    { label: 'What they value', value: 'Genuine cruise expertise — the right line, ship, cabin category, and dining — access to exclusive perks and amenities, and an advisor who remembers their preferences from one voyage to the next.' },
    { label: 'Pain points', value: 'The market is noisy and discount-driven; they want an expert who knows the ships, not an order-taker; and they do not want to re-explain their preferences every single time.' },
    { label: 'Decision driver', value: 'Demonstrated cruise authority and real perks. They choose — and stay with — the advisor who clearly knows cruising better than they do and brings value a booking site cannot.' },
    { label: 'How AI helps you serve them', value: 'A searchable knowledge base of ships, lines, and cabins makes you instantly authoritative; re-book and new-sailing prompts surface the right voyage at the right time; and fast comparison assembly wins the booking while interest is hot.' },
    { label: 'Where you reach them', value: 'Cruise-specific authority content and reviews — and re-engagement, because this persona\'s value compounds through repeat bookings, so retention is the play.' },
  ]),
  spacer(260),
  personaCard('Persona 5 — The Repeat & Referral VIP', 'The highest-lifetime-value segment — the engine', CORE_BLUE, [
    { label: 'Who they are', value: 'Your past clients who loved the experience — the highest-lifetime-value segment a boutique advisory has, and the engine of a referral-led business. For a two-person firm, protecting and growing this group is the single most important growth move there is.' },
    { label: 'What they book', value: 'Everything, over time — the next anniversary trip, the family holiday, the cruise — and, just as valuable, they introduce their friends, who arrive pre-sold on you.' },
    { label: 'What they value', value: 'To feel known and looked after without re-explaining themselves; the easy next trip; and being the friend who "knows a wonderful travel advisor."' },
    { label: 'Pain points', value: 'Life is busy — without a gentle, well-timed prompt, even a delighted client drifts or defaults to booking direct next time, and a referral that is not easy to make often never happens.' },
    { label: 'Decision driver', value: 'The relationship. They do not shop; they return to the person who made them feel cared for — as long as you stay top of mind at the right moments.' },
    { label: 'How AI helps you serve them', value: 'Post-trip re-engagement, anniversary and re-book triggers, and effortless referral asks keep the relationship warm and turn one great trip into a lifetime of bookings and introductions — automatically, so no VIP slips through the cracks.' },
    { label: 'Where you reach them', value: 'Your own client list and post-trip nurture. This is a retention channel, not a discovery one — and it is where a boutique advisory\'s growth quietly compounds.' },
  ]),
  spacer(120),
  calloutBox('Honest framing',
    'These are archetypes from research, not your client list. Which travelers matter most to you — by volume, by value, by the kind of work you love — is a discovery question (Section 14). We would rather build the plan around your real book of business than around our assumptions about it. The Repeat & Referral VIP is profiled last and marked on the map because, for a boutique advisory, it is almost always the highest-value segment to protect and grow.', CORE_ORANGE),
];

// ============================================================ 05 COMPETITIVE ATTENTION GAP
const section5 = [
  ...sectionHeader('The Competitive Attention Gap', CORE_BLUE, '05'),
  p('Pangea does not really compete on price or even on credentials — through Virtuoso and Cadence, the credentials are at parity with the best. The competition is for attention: when an affluent traveler is deciding who to trust with a $30,000 trip, whose name comes up, whose content they find, whose reviews they read. The advisors below are real and named; the point is not their size but their visibility.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Advisor / agency', weight: 26 }, { label: 'Focus', weight: 30 }, { label: 'Observable visibility strength', weight: 44 }],
    [
      [{ text: 'World Travel Agency (the LaBaws)', bold: true, color: CORE_BLUE }, 'Husband-and-wife luxury team; weddings, honeymoons', 'The closest comparable — a couple-run Virtuoso-affiliated shop; shows how a two-person brand can carry real authority.'],
      [{ text: 'Remarkable Honeymoons', bold: true, color: CORE_BLUE }, 'Honeymoons, destination weddings (Virtuoso)', 'Tightly niched on romance travel — direct overlap with your honeymoon and wedding line.'],
      [{ text: 'Q Cruise + Travel (Rob Clabbers)', bold: true, color: CORE_BLUE }, 'Luxury & expedition cruise specialist', 'Founder named to a national "best advisors" A-List for cruise — the visible cruise authority you compete with for that traveler.'],
      [{ text: 'Huffman Travel', bold: true, color: CORE_BLUE }, 'Bespoke luxury, honeymoons', 'A Forbes Travel-endorsed agency with press features and an active blog and social presence — the "visibility leader" benchmark.'],
      [{ text: 'SmartFlyer · Tully Luxury Travel', bold: true, color: CORE_BLUE }, 'Large national luxury agencies', 'Many advisors on national A-Lists, with award credentials and press — what self-built authority looks like at scale.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('A note on accuracy: we did not measure these firms’ exact follower or review counts, and we do not state any here. What is observable — active blogs and newsletters, press features, A-List and Forbes recognition, a steady social presence — is the visibility layer where they are strong and where a young firm is, for now, quiet.', { spaceAfter: 120 }),
  calloutBox('The white space — and the window',
    ['The opening is specific. The visibility leaders win attention with content, press, and a consistent presence — but most are larger agencies, not a personal, couple-run boutique. The couple-run boutiques (your closest peers) have the personal brand but are mostly as quiet online as you are. The corner that is open is a personal, couple-run luxury advisory that pairs Virtuoso-grade service with modern, AI-driven visibility and speed.',
     'There is a clock on it, too. AI search is reshaping how travelers find advisors right now, and the firms publishing authority content today are the ones AI assistants will cite tomorrow. Being early is an ownable advantage; being late means buying back the attention later.'], CORE_ORANGE),
];

// ============================================================ 06 CAPABILITY PROOF
const section6 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '06'),
  p('Before the pitch, the proof. The builds below are real Technijian capabilities; each is mapped to a specific way it would help Pangea. Where a build is described by an industry profile rather than a named client, it is scope and method only — no invented outcomes.', { spaceAfter: 130 }),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini, plus SEMrush, GA4, and Perplexity) that produces authority content and tracks whether AI assistants cite it. How it applies: make Pangea the cited answer for high-intent searches like "luxury Amalfi Coast honeymoon advisor" or "Orange County luxury travel planner" — the discovery gap from Section 5.', CORE_BLUE),
  calloutBox('Proven build: AI Content & Social Engine',
    'What we built: a content factory that drafts, fact-checks, and brand-voices content at a fraction of the usual time. How it applies: revive the dormant blog with destination guides and turn 30+ countries of photos and notes into a steady, on-brand Instagram rhythm — without it eating your evenings.', CORE_ORANGE),
  calloutBox('Proven build: AI Review & Reputation System',
    'What we built: an automated system that earns and manages online reviews for consumer-facing businesses. How it applies: systematic Google, Yelp, and Virtuoso review velocity after every trip — the social proof that turns a searching traveler into an enquiry.', TEAL),
  calloutBox('Proven build: AI Document Intelligence (days → minutes)',
    'What we built: an AI pipeline that turns dense, repetitive document work into structured, checked output — deployed in regulated, detail-critical workflows. How it applies: itinerary drafting, quote assembly, and branded trip documents (pre-trip guides, day-by-day plans, packing lists) produced in minutes on your templates.', CORE_BLUE),
  calloutBox('Proven build: Knowledge Graph + Custom Development',
    'What we built: Weaviate/Obsidian knowledge systems and an AI-native software practice that ships 3–5× faster. How it applies: a searchable knowledge base of your destination and supplier know-how — so two people’s hard-won expertise is an asset, not a memory — and, later, a custom AI Itinerary & Trip-Document Studio built around how you actually work.', CORE_ORANGE),
  subHeader('"Won’t AI cost a fortune?" — the multi-model discipline'),
  p('A fair question for a small business. Technijian does not wire every task to one expensive AI model. We run a routed, multi-model platform — roughly seven models across three providers and three capability tiers — and send each task to the cheapest model that can do it well: lightweight models for high-volume work like research and first-draft content, mid-tier models for reasoning, and the most capable models only for the small slice that needs deep judgment. In practice this runs about 60–80% below the price of routing everything to one premium model — and private, governed deployments keep your clients’ personal and payment details out of public AI tools entirely.', { spaceAfter: 120 }),
];

// ============================================================ 07 UNDERSTANDING AI
const section7 = [
  ...sectionHeader('Understanding AI — A Field Guide', CORE_BLUE, '07'),
  p('A short, plain-English primer so the conversation rests on shared ground. Each point is anchored to an independent framework, not a sales claim — you should know what AI can and cannot do, not how to build it (MIT Sloan).', { spaceAfter: 130 }),
  h3('What AI is — and the distinction that matters'),
  pRuns([{ text: 'The most useful distinction, from Anthropic’s engineering guidance, is between ' }, { text: 'workflows', bold: true, color: DARK_CHARCOAL }, { text: ' (AI follows a fixed path — predictable and low-risk, e.g. "draft an itinerary from these inputs") and ' }, { text: 'agents', bold: true, color: DARK_CHARCOAL }, { text: ' (AI decides the steps itself — flexible, and needing oversight). The principle is to use the simplest thing that works: start Pangea with itinerary, content, and document automations that pay off fast, and add more autonomy only where it clearly earns it. That is exactly how this plan is staged.' }], { spaceAfter: 120 }),
  h3('Where Pangea sits today — and the next two rungs'),
  p('On a widely used five-stage AI maturity model (consistent with Gartner and Google Cloud frameworks), most established small firms sit at stage one or two — using AI occasionally and informally, if at all. That is a perfectly normal place to start, and the gap to the next rungs closes in months, not years. This engagement is about moving Pangea up two rungs: from occasional use, to AI built into how you find clients and produce trips, to AI quietly running the back office while you focus on people. It is a path, not a single purchase.', { spaceAfter: 120 }),
  h3('Adopting AI responsibly — the three risks to manage'),
  p('Anchored to the NIST AI Risk Management Framework, three plain risks matter for a travel advisory, each with how we handle it:', { spaceAfter: 90 }),
  bulletRuns([{ text: 'Hallucination ', bold: true, color: DARK_CHARCOAL }, { text: '— AI can state a confident wrong answer (a fare rule, a visa requirement, a hotel detail). So a human signs off on every itinerary and booking; an AI draft is a starting point, never the final word a client acts on.' }]),
  bulletRuns([{ text: 'Data leakage ', bold: true, color: DARK_CHARCOAL }, { text: '— your clients’ personal details, passport information, and payment data never go into public AI tools. We use private, governed deployments, and Technijian’s security-first method (Ravi Jain is a CISSP) treats that as non-negotiable.' }]),
  bulletRuns([{ text: 'Accountability ', bold: true, color: DARK_CHARCOAL }, { text: '— every AI tool in use is inventoried with an owner, a provider, and what data it touches, straight from the NIST "Govern" function. For a two-person firm that is light to maintain and worth doing from day one.' }]),
  h3('Why a partner — versus doing it yourself or hiring'),
  p('Do-it-yourself AI tools are inexpensive, but they leave you to assemble, secure, and govern the system yourself — on top of running the business. A capable full-time AI hire is scarce and expensive, and far beyond what a two-person advisory needs or could justify. A partner provides the strategy, the build, the security, and the ongoing guidance at a fraction of that, with proven systems — and stays with it through to something that actually works in your day. For Pangea, a partner is the only option that fits the size of the firm and the size of the opportunity at the same time.', { spaceAfter: 120 }),
];

// ============================================================ 08 GROWTH ENGINE
const section8 = [
  ...sectionHeader('The Growth Engine — Win More Travelers', CORE_BLUE, '08'),
  p('The engine has three parts: get found and chosen by the right travelers, serve and convert them faster, then keep and grow them through repeat and referral. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'Pangea Luxe AI growth and time engine', 624),
  caption('Figure 08.0 — Get found and chosen (left); plan and serve faster (centre); keep and grow (right).'),
  buildTable(
    [{ label: 'AI capability', weight: 28 }, { label: 'Use case for Pangea', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['Local & AI-search authority (AEO)', 'Be the cited answer for "luxury Italy advisor," "OC honeymoon planner," and the trips you love to sell.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Authority content / blog revival', 'Turn the dormant blog into destination guides search engines and AI assistants can find and cite.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Instagram & visual content rhythm', 'A steady, on-brand feed from your 30+ countries of photos — luxury travel is a visual sale.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Reviews & reputation velocity', 'Systematic Google, Yelp, and Virtuoso reviews after every trip — the proof that converts searchers.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Lead capture & nurture', 'Turn website and social visitors into enquiries, and nurture them warmly until they are ready to book.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Post-trip re-engagement', 'Welcome-home notes, review requests, and the next-trip nudge — handled automatically.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Anniversary & re-book triggers', 'Surface the right client for the right offer at the right moment — the repeat booking, made easy.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Referral activation', 'Make it effortless for delighted clients to refer — the boutique advisor’s strongest channel.', { text: 'My AI', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  pRuns([{ text: 'What this is not. ', bold: true, color: DARK_CHARCOAL }, { text: 'This is not broad, impersonal lead generation. For a luxury advisory the value is depth and trust, not volume. AI supports the human relationship layer — the referrals, the repeat clients, the reassurance — it does not replace it. The aim is to be found and chosen by more of the right travelers, and to make sure the ones you already delighted come back and bring their friends.' }], { spaceAfter: 120 }),
];

// ============================================================ 09 TIME ENGINE
const section9 = [
  ...sectionHeader('The Time Engine — AI-Powered Efficiency', CORE_BLUE, '09'),
  p('For a two-person advisory, time is the real constraint on growth. Industry guidance is consistent: boutique and luxury advisors can personally manage only a limited number of active trips at once because each one carries hours of research, itinerary building, quoting, and document assembly. The Time Engine attacks exactly that work — so the same two people can serve more travelers, and serve them better, without hiring.', { spaceAfter: 120 }),
  subHeader('Your work today, and where AI takes the load'),
  buildTable(
    [{ label: 'Your workflow today', weight: 30 }, { label: 'AI integration', weight: 40 }, { label: 'Proven Technijian result', weight: 30 }],
    [
      [{ text: 'Building a custom itinerary from scratch', bold: true, color: DARK_CHARCOAL }, 'A brief becomes a polished, branded first-draft itinerary in minutes; you personalize and send.', 'AI document intelligence — dense document work taken from days to minutes.'],
      [{ text: 'Researching suppliers & destinations', bold: true, color: DARK_CHARCOAL }, 'Options, availability, and insider detail pulled together fast, with your knowledge base behind it.', 'Knowledge-graph build — institutional know-how made searchable.'],
      [{ text: 'Assembling quotes & comparison options', bold: true, color: DARK_CHARCOAL }, 'Comparison options and quotes assembled without manual copy-and-paste.', 'AI document intelligence — structured, checked output.'],
      [{ text: 'Producing trip documents', bold: true, color: DARK_CHARCOAL }, 'Pre-trip guides, day-by-day plans, and packing lists generated to your template and voice.', 'AI content engine — branded output at a fraction of the time.'],
      [{ text: 'Post-trip follow-up & re-booking', bold: true, color: DARK_CHARCOAL }, 'Welcome-home, review request, and the next-trip prompt triggered automatically.', 'AI outreach engine — re-engagement on autopilot.'],
      [{ text: 'Remembering what you know', bold: true, color: DARK_CHARCOAL }, 'Your destination and supplier expertise captured once and reused, not re-researched.', 'Weaviate knowledge graph — searchable institutional memory.'],
    ], { headerColor: CORE_BLUE }),
  subHeader('What that is worth — in plain terms'),
  p('The levers below are illustrative and conservative; the real figures come from discovery, when we measure how your hours are actually spent (Section 14). The point is the shape of the return, not a promise.', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Efficiency lever', weight: 46 }, { label: 'Illustrative annual impact (confirm at discovery)', weight: 54 }],
    [
      ['Hours recovered on itineraries, research, quotes, and documents', 'An estimated 8–15 hours a week across two advisors — roughly 400–700 hours a year returned to selling and relationships.'],
      ['Capacity to serve more trips without hiring', 'Even a handful of additional trips a year — at luxury commissions — without adding a person.'],
      ['Faster quote and itinerary turnaround', 'Quicker first responses help win the booking when a traveler is comparing advisors.'],
      ['Fewer errors and missed details', 'Checked, templated documents reduce the small mistakes that cost time and goodwill.'],
      ['Knowledge retained, not re-researched', 'Expertise captured once compounds; onboarding any future help is far faster.'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  calloutBox('The two-person advantage',
    'This is the easier yes for a boutique firm, because it does not ask you to spend to chase customers — it gives you your evenings back and lets you take on the next client you would otherwise have turned away. Two people with this back office run like a much larger agency, while still feeling, to every client, like the personal advisor they chose.', TEAL),
];

// ============================================================ 10 BUSINESS IMPACT & INVESTMENT
const section10 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '10'),
  p('We price from real, published service ranges, and we keep the entry deliberately small — sized for a growing two-person advisory. No figure below is a quote, and none is presented as a guaranteed result. The full build is shown only so the path is clear; it is the later step, not today’s ask.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Land — prove it', bold: true, color: CORE_BLUE }, 'Get-found foundation (local + AI-search, reviews, blog and Instagram jumpstart) and ONE high-value time-saver (AI itinerary or trip-document drafting), proven on your real work.', 'My SEO + a fixed-scope AI jumpstart'],
      [{ text: 'Expand — serve faster', bold: true, color: CORE_BLUE }, 'A custom AI Itinerary & Trip-Document Studio built around how you work, plus the retention triggers and light ongoing AI guidance.', 'My Dev build + My AI'],
      [{ text: 'Scale — operate', bold: true, color: CORE_BLUE }, 'The full Growth and Time engine running, with a simple ROI dashboard so every claim here is tracked against reality.', 'Fractional AI Advisor (retainer)'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Service investment map'),
  buildTable(
    [{ label: 'Technijian service', weight: 40 }, { label: 'Tier / description', weight: 30 }, { label: 'Investment', weight: 30 }],
    [
      [{ text: 'My SEO — Growth Starter', bold: true, color: CORE_BLUE }, 'Local + AI-search, reviews, light content', { text: '~$850/mo · ~$10,200 Y1', bold: true }],
      [{ text: 'My AI — Visibility & Content Jumpstart', bold: true, color: CORE_BLUE }, 'One-time workshop + setup', { text: '~$2,500 one-time', bold: true }],
      [{ text: 'ENTRY PROGRAM (the ask today)', bold: true, color: GREEN }, 'Year-1 entry — the easy yes', { text: '≈ $12,700 Y1', bold: true, color: GREEN }],
      [{ text: 'My Dev — AI Itinerary & Trip-Document Studio (Phase 2)', bold: true, color: BRAND_GREY }, 'Scoped starter build, estimated', 'est. $15,000–$25,000'],
      [{ text: 'My AI — Fractional AI Advisor (Phase 2)', bold: true, color: BRAND_GREY }, 'Light ongoing retainer', '~$1,250/mo'],
      [{ text: 'My Dev — Managed App Services (Phase 2)', bold: true, color: BRAND_GREY }, 'Hosting + upkeep of the Studio', '~$400/mo'],
      [{ text: 'FULL ENGINE (entry + expansion)', bold: true, color: DARK_CHARCOAL }, 'The later upsell, not today’s ask', { text: 'est. ~$45K–$55K Y1', bold: true, color: DARK_CHARCOAL }],
    ], { headerColor: DARK_CHARCOAL }),
  p('Productized My SEO tiers are real published rates. My AI and My Dev figures are estimates labeled as such and confirmed at quote. We do not invent precise prices.', { italics: true, size: 18, spaceAfter: 120 }),
  subHeader('The return, modeled against the entry'),
  p('We model the return against the small entry program, not the full build — a modest number divided into a modest investment gives an honest ratio. The value comes from two levers: hours recovered (Section 9) and additional trips won from better visibility and freed capacity. The figures are illustrative and assume, for example, an average luxury-trip commission you would confirm at discovery; lead with the likely case.', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Scenario', weight: 34 }, { label: 'Modeled Year-1 value vs. entry', weight: 40 }, { label: 'Ratio', weight: 26 }],
    [
      [{ text: 'Downside-protected', bold: true }, 'A few hours a week recovered and one or two extra trips — value already clears the entry.', { text: '≈ 1.5×', bold: true, color: TEAL }],
      [{ text: 'Likely', bold: true, color: GREEN }, 'Hours recovered fund real added capacity, plus a handful of extra trips from new visibility.', { text: '≈ 3.0×', bold: true, color: GREEN }],
      [{ text: 'Upside', bold: true }, 'Visibility compounds and capacity fills with higher-value trips.', { text: '≈ 5.0×+', bold: true, color: CORE_BLUE }],
      [{ text: 'Entry investment (Y1)', bold: true, color: DARK_CHARCOAL }, 'The denominator above — the headline ask.', { text: '≈ $12,700', bold: true, color: DARK_CHARCOAL }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The 90-Day Pangea Visibility & Time Pilot',
    ['A fixed-scope, fixed-price start so there is nothing to over-think. In 90 days we stand up your get-found foundation (Google and Yelp optimized, reviews engine on, local and AI-search base, blog and Instagram jumpstarted) AND one working AI time-saver — itinerary or trip-document drafting — in your own voice and templates. One headline outcome: your visibility base live, and a real AI draft you would actually send.',
     'The risk reversal: no long lock-in. If by day 90 it is not creating visible lift and saving you real hours, we will tell you honestly whether to continue — and you are free to stop. A plan you can walk away from is the only kind worth starting.'], CORE_ORANGE),
  subHeader('The cost of waiting'),
  p('The upside is only half the picture; there is a quiet downside to standing still. Every season without visibility cedes searching, AI-assisted travelers to the boutiques already publishing and optimizing — attention you then have to buy back later. And every manual hour spent on research and documents is a client you could not take on. The window on AI search is open now precisely because most boutique advisors have not moved; that is the advantage to claim while it is cheap.', { spaceAfter: 120 }),
];

// ============================================================ 11 ROADMAP
const section11 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '11'),
  p('Staged for a small team, in fast 30-day steps, so each phase delivers something useful before the next begins — and sequenced to start with the lowest-risk, fastest wins.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '30/60/90-day roadmap', 624),
  caption('Figure 11.0 — Get found, then serve faster, then keep and scale. Targets calibrate at discovery.'),
  p('The first thirty days build the foundation that does not need you: your Google Business and Yelp profiles optimized, the review engine switched on, the local and AI-search base set, and the blog and Instagram jumpstarted. The next thirty stand up the time-savers — AI itinerary and proposal drafting in your voice, then supplier research and branded trip documents. The final thirty turn on the retention engine — post-trip re-engagement, review velocity, and referral activation — and add a searchable knowledge base and a simple ROI dashboard so every claim in this plan is measured against your reality. The sequence is staged so each phase pays for itself before the next begins.', { spaceAfter: 120 }),
];

// ============================================================ 12 QUICK WINS
const section12 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '12'),
  p('Five actions you can take now, with no Technijian contract, that create value on their own and set up the engagement:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Claim and complete your Google Business Profile. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a local luxury advisor it is the single highest-impact free asset — photos, services, service area, and a link. Most searching travelers check it before they ever reach your site.' }]),
  bulletRuns([{ text: 'Text your last ten happy clients for a review. ', bold: true, color: DARK_CHARCOAL }, { text: 'A short, personal ask to recent honeymooners or families is the fastest social proof you can build, and it costs nothing. Reviews compound.' }]),
  bulletRuns([{ text: 'Publish one destination guide. ', bold: true, color: DARK_CHARCOAL }, { text: 'You already wrote one strong post; add a second — an Amalfi Coast or Exuma guide — and you signal to search engines and AI assistants that Pangea has a voice in those destinations.' }]),
  bulletRuns([{ text: 'Set a simple Instagram rhythm. ', bold: true, color: DARK_CHARCOAL }, { text: 'Even two posts a week from your existing travel photos keeps the feed alive for the affluent traveler who checks it before enquiring. Consistency beats volume.' }]),
  bulletRuns([{ text: 'Write down the one task you most wish you could hand off. ', bold: true, color: DARK_CHARCOAL }, { text: 'Itineraries, research, quotes, or trip documents — naming the most painful, most repetitive job tells us exactly where AI should help first.' }]),
];

// ============================================================ 13 FAQ
const section13 = [
  ...sectionHeader('Common Questions, Answered', CORE_BLUE, '13'),
  p('The honest questions a careful small-business owner asks before saying yes — answered plainly.', { spaceAfter: 120 }),
  h3('"We get most of our business from referrals — why do we need this?"'),
  p('Referrals stay your core, and this protects them — review velocity and post-trip re-engagement make your happy clients more likely to refer and rebook. It also adds a second channel so you are not dependent on word of mouth alone, because the affluent traveler who does not yet know you is searching on Google, Instagram, and AI assistants right now.', { spaceAfter: 110 }),
  h3('"Isn’t AI just hype?"'),
  p('The relationship is the part that cannot be automated, and we do not try to. AI is the back-office help that drafts, researches, and remembers — and it is already mainstream among advisors, with most now using it. We use it for the grind and protect the human work that earns referrals.', { spaceAfter: 110 }),
  h3('"Is our clients’ data safe?"'),
  p('Yes — that is a non-negotiable. Client personal details, passport information, and payment data never go into public AI tools; we use private, governed deployments, and Technijian’s security-first approach (Ravi Jain is a CISSP) is built around exactly this.', { spaceAfter: 110 }),
  h3('"We’re only two people — do we even have bandwidth for this?"'),
  p('That is the reason to do it, not the reason to wait. The Time Engine gives you hours back; we run the system and you approve the output. The entry is intentionally light to set up, and the pilot is fixed-scope so it never becomes a project you have to manage.', { spaceAfter: 110 }),
  h3('"Will AI make our service feel less personal?"'),
  p('It should make it feel more personal. AI does the drafting and the research; you personalize and confirm everything a client sees. The hours it returns are hours you spend on the people, not the paperwork — so clients get more of your attention, not less.', { spaceAfter: 110 }),
  h3('"What does this really cost?"'),
  p('The entry is about $12,700 for the first year — real, published My SEO plus a one-time jumpstart — and it is designed to pay for itself on the two highest-value levers alone. The larger build comes later, only once the entry proves the lift, and multi-model routing keeps the ongoing run cost low.', { spaceAfter: 120 }),
  calloutBox('AI Search Reality Check (illustrative)',
    'Picture an affluent traveler asking an AI assistant: "Who’s the best luxury travel advisor for an Amalfi Coast honeymoon, near Orange County?" Today, with one blog post and a quiet social presence, it is unlikely Pangea is named — the advisors with authority content are the ones that get cited. This is illustrative of how AI search resolves such a question, not a screenshot; the get-found front of this plan exists to change that answer.', TEAL),
];

// ============================================================ 14 QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section14 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '14'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short discovery call — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & goals', CORE_BLUE, [
    'Roughly how do new clients find you today — referral and repeat versus new discovery — and which do you want to grow?',
    'What is a typical trip value and your average commission per trip? (This calibrates the entire ROI model.)',
    'How many active trips can the two of you comfortably manage at once, and where do you turn business away?',
    'Which services drive the most revenue and which do you most enjoy — honeymoons, cruises, family, milestones?',
  ]),
  ...qGroup('B · Visibility & brand', CORE_ORANGE, [
    'What is your current Instagram and Facebook following and posting rhythm, and who manages it?',
    'How many Google, Yelp, and Virtuoso reviews do you have today, and is there a system for asking?',
    'Do you have appetite to publish content regularly, and do you run an email list or newsletter?',
  ]),
  ...qGroup('C · How the work is done today', TEAL, [
    'How long does a custom itinerary or quote take to produce, and how many do you handle in a week?',
    'Where does your time actually go — research, itineraries, quoting, documents, servicing, re-booking?',
    'What tools do you use day to day (Cadence CRM, itinerary software, anything else), and how open are they?',
    'How do you handle client personal, passport, and payment data today?',
  ]),
  ...qGroup('D · Decision', CHARTREUSE, [
    'Who decides, and what would a successful first year look like to you?',
    'What level of monthly investment feels comfortable for a first step?',
  ]),
  spacer(80),
  calloutBox('The easy way to answer',
    'Most of these take a 45-minute discovery call — a relaxed working session, no obligation. We are right up the road in Irvine, so in person or by video, whatever suits you.', CORE_ORANGE),
];

// ============================================================ 15 WHAT HAPPENS NEXT
const section15 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '15'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short discovery call — we walk this blueprint and the Section 14 questions, and calibrate the plan to your real numbers.', 'A 45-minute conversation. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'The 90-Day Visibility & Time Pilot — a fixed-scope, fixed-price start: your get-found foundation plus one working AI time-saver.', 'A small, defined engagement you can walk away from.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand — once the entry proves the lift, add the custom Studio and let the engine scale.', 'You decide, with real numbers in hand.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('Let’s start the conversation',
    ['A short discovery call is the easiest first step — a working session on where AI creates real, measurable value for Pangea Luxe Travel, with no obligation. We are local, in Irvine, and would enjoy helping a fellow Orange County business grow.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · +1 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain, based in Irvine, California. We help organizations — from two-person specialists to mid-sized firms — move from AI curiosity to practical, working deployment: we set the strategy, build the systems, secure them, and stay with them through to production. Our approach is security-first (Ravi Jain is a CISSP) and AI-forward, with private, governed deployments that keep sensitive client data protected. For a local Orange County business, we are a partner up the road, not a faceless service.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '+1 949.379.8499'],
      [{ text: 'Office', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
      [{ text: 'What we do', bold: true }, 'AI strategy & build (My AI), AI search & content (My SEO), custom development (My Dev), managed IT & security.'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. could not confirm'),
  bullet('Identity, husband-and-wife team (Ryan & Katie McKibben), 2023 founding, six service lines, Italy/Bahamas/Thailand destination depth, Cadence Travel affiliation, Virtuoso advisor profiles — VERIFIED (company site, Virtuoso profiles, Cadence site).'),
  bullet('Cadence Travel context: La Jolla host agency, founded 1995, Virtuoso member, ~180–200+ advisors, supplier/accounting/marketing back-office — VERIFIED (cadencetravel.com, Virtuoso agency page, press).'),
  bullet('Digital presence: Wix website, a dormant blog (one post, Nov 2024), an Instagram and a Facebook page — VERIFIED as existing. Follower counts, review counts, and Google rating — NOT confirmed; deliberately not stated as fact (cold web data is unreliable here).'),
  bullet('Revenue, average trip value/commission, active client volume, the Cadence tools you use, and your commission split — NOT public; listed as questions in Section 14.'),
  subHeader('Selected sources'),
  ...[
    'Pangea Luxe Travel — company website (home, about, services, blog): pangealuxetravel.com.',
    'Virtuoso — advisor profiles for Ryan and Katie McKibben (Pangea Luxe Travel, an independent affiliate of Cadence).',
    'Cadence Travel — about and host-agency pages (founded 1995, Virtuoso member, advisor support): cadencetravel.com; Virtuoso agency listing; "Cadence Marks 30 Years" (PR Newswire).',
    'Market — luxury travel market size and growth (Straits Research; Grand View Research); ASTA advisor-usage research ("50% more likely," +14% YoY; "44% more likely" post-pandemic) via TravelAge West, Travel Agent Central, Skift; Virtuoso 2025 luxury trends (sales, hotels, ultra-luxury cruise, advisor demand) via TravelAge West.',
    'Advisor economics — commission and planning-fee models, and boutique advisor capacity (Fora; HostAgencyReviews; PTN Travel).',
    'AI in travel — 2025 advisor AI-adoption survey (59% use, up from 41%) via Travel And Tour World; AI as the trip-planning "front door" and >50% of travelers planning with AI (Phocuswright "Search Slips, AI Surges"); agentic-AI direction (Travel Weekly); the human-advisor advantage (Phocuswright; Deloitte "Future of luxury travel").',
    'Competitors — World Travel Agency, Remarkable Honeymoons, Q Cruise + Travel, Huffman Travel, SmartFlyer, Tully Luxury Travel (company sites and national advisor A-List / Forbes recognition).',
    'AI framing — MIT Sloan (AI literacy); Anthropic ("Building Effective Agents," workflows vs. agents); NIST AI Risk Management Framework (Govern/Map/Measure/Manage); Gartner / Google Cloud AI maturity models; McKinsey State of AI.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider market; figures specific to Pangea Luxe Travel are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Pangea Luxe Travel  ·  AI Growth & Integration Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  ...section2, ...section3, ...section4, ...section5, ...section6,
  ...section7, ...section8, ...section9, ...section10, ...section11,
  ...section12, ...section13, ...section14, ...section15,
  ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'Pangea Luxe Travel — AI Growth & Integration Blueprint', description: 'A facts-only AI Growth & Integration blueprint for Pangea Luxe Travel, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Pangea-Luxe-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
