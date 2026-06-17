// Multipoint Network (MPN) — AI Growth Blueprint
// Technijian-branded DOCX builder. FACTS-ONLY. LIVE TOC field + Word-COM convert.
// Thesis: world-class capability, near-zero visibility -> AI growth engine.

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
const TODAY = 'June 17, 2026';
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
// Front-matter header (NOT Heading1) so Contents / How-to-Read don't self-list in the live TOC.
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
  colorBar(CORE_BLUE, 200), spacer(780),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(320),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }), spacer(210),
  centered('AI GROWTH', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('BLUEPRINT', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('Multipoint Network', { size: 50, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rare capability, near-zero visibility — and the AI growth engine to close the gap', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(900),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Multipoint Network, Inc. — Carter Busby', { size: 22, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('CONFIDENTIAL · PREPARED EXCLUSIVELY FOR MULTIPOINT NETWORK', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Blueprint'),
  p('A quick, honest framing before anything else — because the cold note that started this conversation pitched the wrong thing.', { spaceAfter: 120 }),
  bulletRuns([{ text: 'This is not a pitch for managed IT. ', bold: true, color: DARK_CHARCOAL }, { text: 'You are an IT and software firm; you do not need an IT vendor, and you were right to say so. This blueprint is about something different: helping a firm that builds remarkable things get found and win more of the work it is uniquely good at.' }]),
  bulletRuns([{ text: 'It reports verified facts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Everything stated about Multipoint Network is drawn from your own website, LinkedIn, and public records, and is cited in the Appendix. Client names are shown as the logos that appear on your site, not asserted as contracts. We have not assumed your revenue, headcount, or pipeline.' }]),
  bulletRuns([{ text: 'It turns unknowns into questions. ', bold: true, color: DARK_CHARCOAL }, { text: 'Where an answer requires information only your team has, we ask rather than guess. Section 13 is a short questionnaire that completes the analysis.' }]),
  calloutBox('One thing we corrected for accuracy',
    'Your public footprint is split: directories still show the older "managed IT services" Multipoint, while your current site (and the mpnet.ai identity) is a "Design. Build. Grow." software, AI/ML, and entertainment-infrastructure firm. We treat the current, rebranded positioning as the real one — and that repositioning is exactly what makes the visibility gap worth fixing.', TEAL),
];

// ============================================================ TOC (live field)
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', { hyperlink: true, headingStyleRange: '1-1' }),
];

// ============================================================ EXEC SUMMARY
const execSummary = [
  ...sectionHeader('Executive Summary', CORE_BLUE, ''),
  p('Multipoint Network is a small, founder-led Beverly Hills firm that has quietly become something rare: a boutique that designs and runs custom software, in-house AI/ML production systems, and entertainment-grade infrastructure for some of the most demanding clients in media — with SOC 2, CMMC, and TPN (the studios’ content-security standard) behind it. The work is, by any measure, first-rate. The problem is that almost no one outside your existing relationships can tell.', { spaceAfter: 120 }),
  p('The numbers below tell the whole story in one line — established, elite clients, remarkable proof, and a market presence that does not match any of it:', { spaceAfter: 120 }),
  kpiRow([
    { number: '20+', label: 'Years in business (since ~2003)', color: CORE_BLUE },
    { number: 'WB · NBCU', label: 'Client logos shown (incl. Paramount)', color: CORE_ORANGE },
    { number: 'TPN', label: '+ SOC 2 + CMMC security certifications', color: TEAL },
    { number: '122', label: 'LinkedIn followers — the visibility gap', color: CRITICAL },
  ]),
  spacer(160),
  pRuns([{ text: 'The opportunity is not capability — it is visibility. ', bold: true, color: DARK_CHARCOAL }, { text: 'The MSP/IT-services industry says the firms that win are the ones that are vertically specialized, security-first, and AI-forward. Multipoint already is all three (media/entertainment; TPN/SOC 2/CMMC; real AI/ML). What the high-growth firms add is the one thing Multipoint is missing — a demand engine. Lead generation is the single most-cited growth constraint in this industry, and it is precisely the gap here: a thin website, ~122 LinkedIn followers, little search presence, and a flagship cost-reduction story (a published $187K-to-$3K cloud case) that almost no prospect ever sees.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'So the blueprint is a growth engine, in two motions. ', bold: true, color: DARK_CHARCOAL }, { text: 'First, get found: AI-era search and answer-engine optimization, authority content that finally surfaces your proof, and a storefront rebuilt to convert. Second, win named accounts: account intelligence and proposal automation aimed at studios, post houses, agencies, and media-tech — supporting your relationship-led sales, not replacing it. We are not here to out-engineer you; we are here to out-market for you.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'The method is conservative on purpose. ', bold: true, color: DARK_CHARCOAL }, { text: 'You will not find an invented revenue figure or a guessed ROI here — your financials are not public, so we cite none. Investment is shown as real, published Technijian service ranges; returns are modeled only after discovery calibrates them against your real pipeline and win rate (Section 13).' }], { spaceAfter: 120 }),
  calloutBox('The one idea to carry into the conversation',
    'You sit in the rarest quadrant in your market: high capability, low visibility. Your competitors are either visible-but-ordinary or scaled-but-generic. The move is not to build more capability — you have it — but to become as findable as you are good. That is a solvable problem, and a fast one.', CORE_ORANGE),
];

// ============================================================ SEC 01 — WHAT WE VERIFIED
const section1 = [
  ...sectionHeader('What We Verified About Multipoint Network', CORE_BLUE, '01'),
  p('Everything here is drawn from your own websites, LinkedIn, and public records (see Appendix). Client names appear as the logos shown on your site, not as asserted contracts.', { spaceAfter: 130 }),
  subHeader('A rebranded, AI-forward boutique'),
  p('Your current site leads with "Design. Build. Grow." and the line "the team that built it runs it" — a software, AI/ML, and infrastructure firm, not a generic managed-IT shop. (Directories still carry the older managed-IT positioning; the live brand, on the mpnet.ai identity, is the rebranded one.) What we verified:', { spaceAfter: 100 }),
  buildTable(
    [{ label: 'Attribute', weight: 26 }, { label: 'Verified fact', weight: 74 }],
    [
      [{ text: 'What you do', bold: true }, 'Custom software / SaaS development, in-house AI/ML production systems (your site cites 24 production systems and a multi-stage ML pipeline), cloud migration (a notable Cloudflare practice), and 24/7 human-monitored operations. Terms advertised: month-to-month, free assessment, 4-hour response.'],
      [{ text: 'Security & compliance', bold: true }, 'SOC 2, CMMC, and TPN (Trusted Partner Network — the entertainment industry’s content-security standard), with a stated "0 breaches" record.'],
      [{ text: 'Client logos shown', bold: true }, 'Warner Bros., Paramount Pictures, NBCUniversal, and Velaro — a clear media & entertainment lean, consistent with TPN.'],
      [{ text: 'Headquarters', bold: true }, 'Beverly Hills, CA (315 N Crescent Dr, per your signature). Greater Los Angeles service base.'],
      [{ text: 'Leadership', bold: true }, 'Brian D. Bloom, President (founder-operator); Norman Sternfeld, Business Development. Privately held, founder-led — no evidence of private-equity ownership.'],
      [{ text: 'Tenure & size', bold: true }, 'In business roughly 20 years (founded ~2003; one source says 2008). A small, senior team.'],
      [{ text: 'Revenue & headcount', bold: true, color: CRITICAL }, 'Not publicly disclosed; broker figures conflict. We cite neither and treat both as discovery items.'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('What we have NOT assumed',
    'We do not know, and have not guessed: your revenue or team size; whether the named studios are direct clients versus project or sub-vendor work; which brand (multipointnetwork.com or mpnet.ai) is the go-forward identity; how you generate leads today and your win rate; or the exact role of our contact, Carter Busby. These are the questions in Section 13.', CORE_ORANGE),
];

// ============================================================ SEC 02 — THE GAP
const section2 = [
  ...sectionHeader('The Capability–Visibility Gap', CORE_BLUE, '02'),
  p('The central fact about Multipoint Network is a mismatch: the capability is rare and provable, and the market presence is almost nonexistent. The diagram makes it concrete.', { spaceAfter: 130 }),
  diagramImage(diagBuf('model.png'), 'What Multipoint Network builds, and who cannot find it', 612),
  caption('Figure 02.0 — Rare capability and elite clients on one side; a thin, hard-to-find market presence on the other.'),
  pRuns([{ text: 'The proof is already there — it is just buried. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your own site states 99.97% uptime, 34,897 tickets handled, a 9-stage ML pipeline running 14 models, and a flagship cost-reduction case — moving a client from 421 Azure resources to Cloudflare Workers, cutting roughly $187,000 a year to about $3,000. Any one of those would be a standout proof point for a media-tech buyer. Together they are a remarkable story. Almost no prospect ever encounters it, because it lives behind a single-narrative website with no search footprint to speak of.' }], { spaceAfter: 120 }),
  pRuns([{ text: 'And the visibility side is genuinely thin. ', bold: true, color: DARK_CHARCOAL }, { text: 'A LinkedIn company page with roughly 122 followers, little to no published content, no meaningful review presence, and a website that repeats the same single story regardless of where a visitor lands. For a firm trusted with studio-grade content security, that is a striking under-representation — and the clearest, lowest-cost place to start.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 03 — MARKET (agent-2)
const section3 = [
  ...sectionHeader('The Market & Why Now', CORE_BLUE, '03'),
  p('The forces below are facts about the IT-services market Multipoint operates in — not claims about the company — and together they explain why a visibility investment pays now rather than later. Sources are in the Appendix.', { spaceAfter: 130 }),
  kpiRow([
    { number: '$365–731B', label: 'Global managed-services market (firm-dependent)', color: CORE_BLUE },
    { number: '+15%', label: 'Managed security — fastest-growing segment', color: CORE_ORANGE },
    { number: '~40k', label: 'US MSPs (industry estimate) — fragmented', color: TEAL },
    { number: '~69%', label: 'Of disclosed MSP deals are private-equity', color: DARK_CHARCOAL },
  ]),
  spacer(150),
  h3('The market is growing — and consolidating against small independents'),
  p('Analysts project the global managed-services market growing at mid-single to mid-teens percent annually (estimates range roughly $365B to $731B+ by the end of the decade depending on the firm and scope), with managed security the fastest-growing segment (about +15% in 2025, per Canalys). But the field is fragmenting against small firms: an estimated 40,000+ US MSPs, 466 tracked MSP/MSSP acquisitions in 2025, and private equity in roughly 69% of disclosed deals are building roll-ups with scale and capital. A small independent does not win by out-scaling them; it wins by being unmistakably differentiated — and by being found.', { spaceAfter: 120 }),
  h3('The winners are specialized, security-first, and AI-forward — which Multipoint already is'),
  p('Industry research is consistent that the three durable differentiators are vertical specialization (specialized firms report materially higher margins and command a price premium), a security-first posture (the vast majority of top-earning firms lead with managed security), and AI-forward delivery. Multipoint already has all three: a media/entertainment vertical, TPN/SOC 2/CMMC, and real AI/ML. The hard part is done. The missing piece is the one most firms in this market also miss.', { spaceAfter: 120 }),
  h3('That missing piece is demand generation'),
  p('Lead generation is the single most-cited growth constraint among IT-services firms — one MSP-marketing study reports that the large majority of owners name it their number-one challenge — because most are run by technical founders who under-invest in marketing and rely on referrals until growth stalls. The buying-moment channel is search: when a prospect needs a Cloudflare migration, studio-grade infrastructure, or an AI/ML build, they search — and increasingly they ask an AI assistant. A firm with real proof but no search or content footprint simply is not in those answers. That is the gap this blueprint closes.', { spaceAfter: 120 }),
  calloutBox('Why this matters now',
    'A growing market, consolidating against independents, rewards the differentiated firm that can be found. Multipoint has the differentiation already; the window is to convert it into visibility and pipeline before a competitor with half the capability and twice the marketing takes the share that should be yours.', TEAL),
];

// ============================================================ SEC 04 — WHERE GROWTH LIVES
const section4 = [
  ...sectionHeader('Where the Growth Lives', CORE_BLUE, '04'),
  p('For a high-capability, low-visibility firm, growth is not a single funnel — it is three connected moves, each supported by AI without changing the relationship-led nature of the business.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Move', weight: 22 }, { label: 'What it looks like for Multipoint', weight: 52 }, { label: 'Front', weight: 26 }],
    [
      [{ text: 'Get found', bold: true, color: CORE_BLUE }, 'Be the cited answer in search and AI assistants for your niche — Cloudflare migration, studio-grade / TPN-compliant infrastructure, AI/ML builds for media — and surface the proof you already have.', 'Growth'],
      [{ text: 'Capture & convert', bold: true, color: CORE_BLUE }, 'Turn visitors into qualified enquiries with a real funnel, an on-site AI assistant, and case studies that sell while you sleep — instead of a single brochure page.', 'Growth'],
      [{ text: 'Win named accounts', bold: true, color: CORE_BLUE }, 'Account intelligence, proposal automation, and personalised outbound aimed at a named list of studios, post houses, agencies, and media-tech companies.', 'Growth'],
      [{ text: 'Package & scale', bold: true, color: CORE_ORANGE }, 'Productize bespoke engineering into named, marketable offers so growth does not bottleneck on the founder.', 'Integration'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  p('The first three moves are growth; the fourth makes growth durable. Notice what is not on this list: there is no "integrate AI into your delivery" line, because you already have that — your own AI/ML production systems are more advanced than most firms we would normally introduce to AI. The value here is the demand engine wrapped around the capability you have already built.', { spaceAfter: 120 }),
];

// ============================================================ SEC 05 — SEGMENTS (personas)
const section5 = [
  ...sectionHeader('The Buyer Segments', CORE_BLUE, '05'),
  p('Multipoint can win across a portfolio of media-and-tech buyers. The matrix maps the archetypes by deal volume and value per engagement — archetypes to calibrate at discovery, not your account list.', { spaceAfter: 120 }),
  diagramImage(diagBuf('personas.png'), 'Buyer segments matrix', 560),
  caption('Figure 05.0 — Where AI-assisted, relationship-led growth has the most impact. Bubble size approximates value per engagement.'),
  buildTable(
    [{ label: 'Segment', weight: 26 }, { label: 'What they need', weight: 40 }, { label: 'How the engine reaches them', weight: 34 }],
    [
      [{ text: 'Studio / network IT & security', bold: true, color: CORE_BLUE }, 'Content-secure, audited infrastructure and a partner who already speaks TPN/CMMC.', 'Account-based outbound + authority content on studio-grade security.'],
      [{ text: 'Production / post house', bold: true, color: CORE_ORANGE }, 'Reliable, secure pipelines under deadline pressure.', 'Niche AEO/SEO + proof-driven case studies.'],
      [{ text: 'Enterprise media infrastructure', bold: true, color: GREEN }, 'Cost control and resilience at scale (the Cloudflare story).', 'The $187K-to-$3K case as flagship content + ABM.'],
      [{ text: 'Agency / creative shop', bold: true, color: TEAL }, 'A technical partner who can build, not just advise.', 'Search visibility + referral and partner content.'],
      [{ text: 'Media-tech / SaaS', bold: true, color: DARK_CHARCOAL }, 'Custom software and AI/ML they cannot staff in-house.', 'AEO for "AI/ML build" queries + capture funnel.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('Honest framing',
    'These are research-based archetypes, not your CRM. Which segments matter most — by volume, by margin, by growth priority — is a discovery question. We would rather build the plan around your real book of business than around our assumptions about it.', CORE_ORANGE),
];

// ============================================================ SEC 06 — COMPETITIVE (agent-2)
const section6 = [
  ...sectionHeader('Competitive Landscape', CORE_BLUE, '06'),
  p('The useful way to read Multipoint’s position is not by size but by two axes: technical capability and market visibility. On that map, Multipoint sits where almost no one else does.', { spaceAfter: 130 }),
  diagramImage(diagBuf('competitive.png'), 'Competitive positioning: visibility vs capability', 560),
  caption('Figure 06.0 — A strategic assessment (not a measured score). The top-left — real capability, almost no visibility — is rare, and fixable.'),
  buildTable(
    [{ label: 'Competitor type', weight: 26 }, { label: 'Where they sit', weight: 36 }, { label: 'The contrast with Multipoint', weight: 38 }],
    [
      [{ text: 'PE-backed consolidators', bold: true, color: CORE_BLUE }, 'High visibility, broad capability, large scale.', 'Out-market and out-scale small firms — but generic; rarely studio-grade or AI-native.'],
      [{ text: 'Marketing-led / generic MSPs', bold: true, color: CORE_BLUE }, 'High visibility, ordinary capability.', 'Win local search with weaker delivery — they are seen but not special.'],
      [{ text: 'Boutique dev / AI agencies', bold: true, color: CORE_BLUE }, 'Strong capability, moderate visibility.', 'Closest peers — but few combine software, AI/ML, AND entertainment-grade security.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The white space',
    'The consolidators are visible but generic; the local MSPs are visible but ordinary; the boutique agencies rarely combine your exact mix (software + AI/ML + TPN-grade security + a real Cloudflare practice). Multipoint owns a genuinely differentiated position — it is simply in the "strong but invisible" corner. The entire job of this plan is to move it rightward into "seen and strong," where its capability finally translates into pipeline.', CORE_ORANGE),
];

// ============================================================ SEC 07 — DIGITAL AUDIT
const section7 = [
  ...sectionHeader('Brand & Digital Presence Audit', CORE_BLUE, '07'),
  p('A factual read of Multipoint’s public footprint as observed in June 2026. The point is not criticism — it is that the distance between the quality of the work and the quality of its presentation is the opportunity.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Asset', weight: 24 }, { label: 'What we observed', weight: 50 }, { label: 'Opportunity', weight: 26 }],
    [
      [{ text: 'Website', bold: true, color: CRITICAL }, 'A well-designed but content-thin, single-narrative site (Wix); much of it repeats the same Azure-to-Cloudflare story regardless of page. Two identities in play (multipointnetwork.com + mpnet.ai).', 'Rebuild to convert; pick one brand.'],
      [{ text: 'Search / AEO', bold: true, color: CRITICAL }, 'Little evident optimization for the high-intent queries your buyers run, or for citation by AI assistants.', 'Own your niche in search + AI answers.'],
      [{ text: 'Content / proof', bold: true, color: CRITICAL }, 'Remarkable proof (the cost-reduction case, uptime, the ML pipeline, TPN) is buried; no real content engine.', 'Turn proof into authority content.'],
      [{ text: 'LinkedIn', bold: true, color: CRITICAL }, 'Roughly 122 followers; the company size band is mis-set; activity is light.', 'A real, consistent presence.'],
      [{ text: 'Reviews / reputation', bold: true }, 'No meaningful Google/Yelp review footprint surfaced.', 'Build visible social proof.'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The most quotable finding',
    'A firm trusted with content security for major studios — holding TPN, SOC 2, and CMMC, running its own AI/ML production systems, with a published case that cut a client’s cloud bill by ~98% — has about 122 LinkedIn followers and almost no search presence. That is not a capability problem. It is a visibility problem, and visibility problems are the fast kind to fix.', TEAL),
];

// ============================================================ SEC 08 — CAPABILITY PROOF
const section8 = [
  ...sectionHeader('Technijian Capability Proof', CORE_BLUE, '08'),
  p('You build remarkable things; we will not pretend to out-engineer you. What we bring is the demand engine — and we have built every piece of it. Each capability below is real, mapped to your situation. Where a build is described by an industry profile rather than a named client, it is scope and effort only.', { spaceAfter: 130 }),
  calloutBox('Proven build: Multi-Agent SEO + AEO Platform',
    'What we built: a multi-model platform (Claude, GPT, Gemini + MCP, SEMrush, GA4, Perplexity) that produces and optimises authority content and tracks whether AI assistants cite you. How it applies: make Multipoint the cited answer for "Cloudflare migration," "studio-grade IT," and "AI/ML for media" — and surface the proof you already have.', CORE_BLUE),
  calloutBox('Proven build: AI Lead-Gen & Account Intelligence',
    'What we built: an AI lead-generation engine that enriches and scores target accounts, monitors triggers, and drafts personalised outreach. How it applies: a named target list of studios, post houses, agencies, and media-tech, worked by AI and closed by your team.', CORE_ORANGE),
  calloutBox('Proven build: AI-Native Software Delivery (My Dev)',
    'What we built: an AI-native development practice that ships 3–5x faster. How it applies: a conversion-built site, a lead-capture funnel, and an on-site AI assistant — and a way to productize your bespoke engineering into repeatable offers.', TEAL),
  calloutBox('Proven build: AI Content Factory + Knowledge Graph',
    'What we built: a routed content pipeline and Weaviate/Obsidian knowledge systems. How it applies: turn each Multipoint win into a reusable, searchable case study, and make two decades of institutional know-how a marketing asset instead of tribal memory.', CORE_BLUE),
  subHeader('Two honest guardrails (because you will ask)'),
  pRuns([{ text: 'Cost: ', bold: true, color: DARK_CHARCOAL }, { text: 'we run a routed, multi-model platform (roughly seven models across three vendors and three tiers) and send each task to the cheapest model that can do it well — typically 60–80% below the cost of routing everything to one premium model. ' }, { text: 'Control: ', bold: true, color: DARK_CHARCOAL }, { text: 'AI drafts, finds, and triages; a human approves every piece of outbound and owns your brand voice. The 2024 Moffatt v. Air Canada ruling — where a company, not its chatbot, was held liable for an answer the bot invented — is exactly why nothing customer-facing ships without a person’s sign-off.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 09 — AI GROWTH ENGINE
const section9 = [
  ...sectionHeader('The AI Growth Engine', CORE_BLUE, '09'),
  p('Three connected columns: get found for what you already do, convert the traffic into qualified pipeline, and win the named media accounts. Each names the specific Technijian service that delivers it.', { spaceAfter: 120 }),
  diagramImage(diagBuf('architecture.png'), 'The Multipoint Network AI growth engine', 624),
  caption('Figure 09.0 — Get found (left); capture & convert (centre); win named accounts (right).'),
  buildTable(
    [{ label: 'Capability', weight: 28 }, { label: 'Use case for Multipoint', weight: 46 }, { label: 'Technijian service', weight: 26 }],
    [
      ['AEO / GEO for the niche', 'Be cited for Cloudflare migration, studio-grade IT, and AI/ML-for-media queries.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Surface the proof', 'Turn the $187K-to-$3K case, uptime, and the ML pipeline into authority content.', { text: 'My SEO', bold: true, color: CORE_BLUE }],
      ['Storefront rebuild + capture', 'A conversion-built site and a real funnel instead of a single brochure page.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
      ['On-site AI assistant', 'Answer prospect questions 24/7 and route serious enquiries to the team.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Account intelligence', 'Signal monitoring and dossiers on studios, post houses, agencies, and media-tech.', { text: 'My AI', bold: true, color: CORE_BLUE }],
      ['Proposal automation', 'Draft tailored proposals and SOWs fast; the team personalises and signs off.', { text: 'My AI Lead Gen', bold: true, color: CORE_BLUE }],
      ['ABM outreach', 'Personalised outbound to a named target list — not spray-and-pray.', { text: 'My AI Lead Gen', bold: true, color: CORE_BLUE }],
      ['Package the bespoke', 'Turn one-off engineering into named, marketable, repeatable offers.', { text: 'My Dev', bold: true, color: CORE_BLUE }],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The non-negotiable',
    'This augments your founder-led sales motion; it does not replace it. AI finds, drafts, and triages; a human owns the relationship and the brand voice and signs off on everything that goes out. For a firm whose reputation is content security and trust, that human-in-the-loop discipline is the only way AI is allowed to touch the pipeline.', TEAL),
];

// ============================================================ SEC 10 — INVESTMENT
const section10 = [
  ...sectionHeader('Business Impact & Investment', CORE_BLUE, '10'),
  p('We price from real, published service ranges and model returns only after discovery. No figure below is a quote, and none is presented as Multipoint’s guaranteed result.', { spaceAfter: 130 }),
  subHeader('A land-and-expand path'),
  buildTable(
    [{ label: 'Phase', weight: 22 }, { label: 'What it includes', weight: 50 }, { label: 'Engagement type', weight: 28 }],
    [
      [{ text: 'Land — get found', bold: true, color: CORE_BLUE }, 'AEO/SEO foundation, surfacing your proof as authority content, and a conversion-built storefront with a capture funnel.', 'My SEO + My Dev build'],
      [{ text: 'Expand — build demand', bold: true, color: CORE_BLUE }, 'On-site AI assistant, case-study engine, account intelligence, and a named target list.', 'My AI + My AI Lead Gen'],
      [{ text: 'Scale — win accounts', bold: true, color: CORE_BLUE }, 'ABM outreach + proposal automation, packaged offers, and a measured pipeline/ROI dashboard.', 'My AI Lead Gen + advisory'],
    ], { headerColor: CORE_BLUE }),
  subHeader('Market-typical investment ranges (context, not a quote)'),
  buildTable(
    [{ label: 'Component', weight: 40 }, { label: 'Published range', weight: 34 }, { label: 'Note', weight: 26 }],
    [
      ['My SEO — SEO + AEO + content', '~$2,000–$3,000 / mo', 'recurring'],
      ['My AI Lead Gen', 'Starter $1,499 · Pro $3,499 · Ent $6,999 / mo', 'recurring'],
      ['My Dev — site / funnel / assistant build', 'project-based', 'one-time build'],
      ['AI growth advisory', 'scoped retainer', 'recurring'],
    ], { headerColor: DARK_CHARCOAL }),
  spacer(80),
  pRuns([{ text: 'How we will model the return. ', bold: true, color: DARK_CHARCOAL }, { text: 'For a firm with large average deal sizes and a tiny pipeline, ROI is modeled on qualified leads created, win rate, and average engagement value — not a guessed revenue number. A single new studio or enterprise-infrastructure engagement likely covers a year of the program many times over, which is why even a modest lift in visibility is high-impact here. We will put conservative, mid, and upside numbers against those levers once discovery gives us your real figures (Section 13). Until then, any single ROI figure would be a guess, and we don’t guess.' }], { spaceAfter: 120 }),
];

// ============================================================ SEC 11 — ROADMAP
const section11 = [
  ...sectionHeader('Implementation Roadmap', CORE_BLUE, '11'),
  p('Staged so each phase pays for itself before the next begins — and sequenced to start with the lowest-risk, fastest wins.', { spaceAfter: 120 }),
  diagramImage(diagBuf('timeline.png'), '90/180/365-day roadmap', 624),
  caption('Figure 11.0 — Get found, build the demand engine, then scale outbound. Targets calibrate at discovery.'),
  p('Phase one fixes the foundation (positioning, technical and local SEO, a storefront rebuilt to convert) and surfaces the first authority content from real wins. Phase two adds the on-site AI assistant and capture funnel, then builds the named target list with account intelligence. Phase three runs ABM outbound with proposal automation, packages the bespoke work into offers, and stands up a measured pipeline/ROI dashboard so every claim in this plan is tracked against reality.', { spaceAfter: 120 }),
];

// ============================================================ SEC 12 — QUICK WINS
const section12 = [
  ...sectionHeader('Quick Wins — Start This Week', CORE_BLUE, '12'),
  p('Five actions Multipoint can take now, with no Technijian contract, that create value and set up the engagement:', { spaceAfter: 120 }),
  bulletRuns([{ text: 'Publish the $187K-to-$3K case as a real case study. ', bold: true, color: DARK_CHARCOAL }, { text: 'Your single best proof point currently lives as a stat on a homepage. Written up properly, it is a magnet for cost-conscious media-infrastructure buyers.' }]),
  bulletRuns([{ text: 'Fix the LinkedIn company page. ', bold: true, color: DARK_CHARCOAL }, { text: 'Correct the mis-set size band, sharpen the description to the rebrand, and post one real piece of work. A 20-year studio-grade firm should not read as a 122-follower unknown.' }]),
  bulletRuns([{ text: 'Pick one brand. ', bold: true, color: DARK_CHARCOAL }, { text: 'Decide whether multipointnetwork.com or mpnet.ai is the go-forward identity and point everything at it — split identities dilute every bit of visibility you build.' }]),
  bulletRuns([{ text: 'Claim and populate your review profiles. ', bold: true, color: DARK_CHARCOAL }, { text: 'Set up Google Business and ask one or two happy clients for a review. Social proof compounds, and you currently have almost none visible.' }]),
  bulletRuns([{ text: 'Name your five dream accounts. ', bold: true, color: DARK_CHARCOAL }, { text: 'Write down the five studios, post houses, or media-tech firms you would most like to win. That list is the seed of the account-based motion in this plan.' }]),
];

// ============================================================ SEC 13 — QUESTIONS
function qGroup(title, color, items) { return [subHeader(title, color), ...items.map(q => bullet(q))]; }
const section13 = [
  ...sectionHeader('Questions to Complete the Analysis', CORE_BLUE, '13'),
  p('This is the part that turns a research-based blueprint into a costed, calibrated plan. The answers — from a short conversation — replace every estimate above with your real numbers. "We’re not sure" is a useful answer.', { spaceAfter: 130 }),
  ...qGroup('A · Business & goals', CORE_BLUE, [
    'What is the real growth goal — more studio/media accounts, more software/AI builds, a new vertical, or simply more of everything?',
    'Roughly how many new engagements a year do you win now, and what does an average engagement look like in size and length?',
    'Which brand is the go-forward identity — multipointnetwork.com or mpnet.ai?',
  ]),
  ...qGroup('B · How you grow today', CORE_ORANGE, [
    'How do you currently get new clients — referrals, relationships, outbound, anything else?',
    'Who owns sales and marketing today, and is there any marketing budget or spend now?',
    'What is your rough win rate when you do get into a conversation?',
  ]),
  ...qGroup('C · Proof & positioning', TEAL, [
    'Are Warner Bros., Paramount, and NBCUniversal direct clients we can reference, or logos/project work we should describe carefully?',
    'Which capabilities do you most want to be known for — Cloudflare/infrastructure, custom software, AI/ML, or content-security?',
    'What recent wins (beyond the Azure-to-Cloudflare case) could become case studies?',
  ]),
  ...qGroup('D · Team & decision', CHARTREUSE, [
    'How big is the team, and who would own the relationship with a growth partner?',
    'Can you confirm Carter Busby’s role, and who else weighs in on a decision like this?',
    'What would a successful first year look like — in pipeline, in named logos, in revenue?',
  ]),
  spacer(80),
  calloutBox('The easiest way to answer',
    'Most of these take a 30-minute conversation. We can also run a short, no-obligation visibility assessment — your current search footprint, AI-assistant citations, and the gap to your nearest visible competitor — and hand you the findings whether or not we work together.', CORE_ORANGE),
];

// ============================================================ SEC 14 — WHAT HAPPENS NEXT
const section14 = [
  ...sectionHeader('What Happens Next', CORE_BLUE, '14'),
  p('A low-commitment sequence that produces something useful at each step:', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Step', weight: 8 }, { label: 'What happens', weight: 52 }, { label: 'Your commitment', weight: 40 }],
    [
      [{ text: '1', bold: true, color: CORE_BLUE }, 'A short conversation — walk this blueprint and the Section 13 questions. Peer to peer; you know the tech.', 'A call. No commitment.'],
      [{ text: '2', bold: true, color: CORE_BLUE }, 'A free visibility assessment — your search footprint, AI-assistant citations, and the gap to your nearest visible competitor.', 'None; the findings are yours.'],
      [{ text: '3', bold: true, color: CORE_BLUE }, 'Land-and-expand — start with get-found and the storefront; add the demand engine and outbound as each proves out.', 'You decide, with real numbers.'],
    ], { headerColor: CORE_BLUE }),
  spacer(150),
  calloutBox('No pitch — just a useful read',
    ['You were right that you do not need IT services. This is a different conversation: how a firm that builds genuinely impressive things becomes as findable as it is good. If that is worth 30 minutes, we would value your read on this plan; if not, the visibility assessment is yours regardless.',
     'Ravi Jain, Founder & CEO · rjain@technijian.com · 949.379.8499 · technijian.com'], CORE_ORANGE),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy, growth, and implementation firm founded in 2000 by Ravi Jain. We help technical companies turn real capability into demand — through AI-era search and answer-engine optimisation (My SEO), AI lead generation (My AI Lead Gen), and AI-native software and funnel development (My Dev) — and we architect, build, and operationalise through to production rather than handing over a slide deck. Our dedicated pod model assigns a named team to each client, with offices in Irvine, California and Panchkula, India for coverage across time zones. Our approach is cybersecurity-first and AI-forward, with private, governed deployments.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '949.379.8499 (reaches both U.S. and India teams)'],
      [{ text: 'U.S. headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'India delivery centre', bold: true }, 'Panchkula, Haryana, India'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & What Remains to Confirm', CORE_BLUE, ''),
  subHeader('What we verified vs. could not confirm'),
  bullet('Current rebranded positioning ("Design. Build. Grow."), services, SOC 2 / CMMC / TPN certifications, and the client logos shown (Warner Bros., Paramount, NBCUniversal, Velaro) — VERIFIED on the live site (multipointnetwork.com / mpnet.ai).'),
  bullet('Leadership (Brian D. Bloom, President; Norman Sternfeld, Business Development), Beverly Hills HQ, and ~20-year tenure — VERIFIED across the site, LinkedIn, and registry sources.'),
  bullet('Whether the named studios are direct clients vs. project/sub-vendor work; current revenue and headcount; founding year (2003 vs 2008); and Carter Busby’s role — NOT confirmed; listed as questions.'),
  bullet('Digital-presence findings (thin site, ~122 LinkedIn followers, no review footprint) — observed from public profiles June 2026.'),
  subHeader('Selected sources'),
  ...[
    'Multipoint Network — live site, About, and case content: multipointnetwork.com / mpnet.ai; LinkedIn company page.',
    'Market — Grand View Research, MarketsandMarkets, Canalys / N-able MSP Horizons, Kaseya MSP Benchmark (managed-services size & growth, security as fastest segment).',
    'Consolidation — MSP M&A trackers (466 deals 2025; PE in ~69% of disclosed deals).',
    'MSP growth & marketing — MSP-marketing studies (lead-gen as the #1 owner-cited constraint); local SEO / AEO as the buying-moment channel.',
    'Differentiation — vertical-specialization, security-first, and AI-forward as the consensus differentiators (SuperOps, IRONSCALES, Kaseya).',
    'AI guardrails — human-in-the-loop best practice; Moffatt v. Air Canada (2024) on chatbot liability.',
  ].map(s => bullet(s)),
  spacer(120),
  p('Market and industry figures are facts about the wider market; figures specific to Multipoint Network are intentionally deferred to discovery. Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Multipoint Network  ·  AI Growth Blueprint', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
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
  creator: 'Technijian', title: 'Multipoint Network — AI Growth Blueprint', description: 'A facts-only AI growth blueprint for Multipoint Network, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Multipoint-Network-AI-Growth-Blueprint.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });
